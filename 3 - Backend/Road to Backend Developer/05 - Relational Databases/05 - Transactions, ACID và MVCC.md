# 05 — Transactions, ACID và MVCC

> **Nguồn chính:** PostgreSQL Documentation — https://www.postgresql.org/docs/current/tutorial-transactions.html
> Bài này bám mục *3.4. Transactions*, *13.1. Introduction (MVCC)*, *13.2. Transaction Isolation*, *13.3. Explicit Locking*, *13.6. Caveats*, cùng trang lệnh `BEGIN` và `SAVEPOINT`.

---

## 1. Transaction là gì

📖 **Nguyên văn**
> "*Transactions* are a fundamental concept of all database systems. The essential point of a transaction is that it bundles multiple steps into a single, all-or-nothing operation. The intermediate states between the steps are not visible to other concurrent transactions, and if some failure occurs that prevents the transaction from completing, then none of the steps affect the database at all."

🇻🇳 **Dịch**
> "*Transaction* là khái niệm nền tảng của mọi hệ cơ sở dữ liệu. Điểm cốt lõi của một transaction là nó gói nhiều bước lại thành một thao tác duy nhất theo kiểu được-ăn-cả-ngã-về-không (all-or-nothing). Các trạng thái trung gian giữa những bước đó không hiển thị với các transaction khác đang chạy song song, và nếu có lỗi nào đó xảy ra khiến transaction không hoàn tất, thì không bước nào trong đó tác động đến database cả."

💡 **Ví dụ đời sống**
Chuyển khoản qua app ngân hàng: tiền rời tài khoản bạn và vào tài khoản người nhận. Không bao giờ có chuyện "tiền đã trừ nhưng chưa cộng" được coi là hợp lệ. Hoặc cả hai bước cùng xảy ra, hoặc không bước nào xảy ra. Giống như bấm nút thang máy: cửa đóng — đi — cửa mở, chứ không có trạng thái "cửa mở giữa hai tầng".

---

## 2. Ví dụ kinh điển: chuyển tiền Alice → Bob

📖 **Nguyên văn**
> "For example, consider a bank database that contains balances for various customer accounts, as well as total deposit balances for branches. Suppose that we want to record a payment of $100.00 from Alice's account to Bob's account. Simplifying outrageously, the SQL commands for this might look like:"

🇻🇳 **Dịch**
> "Ví dụ, hãy hình dung một database ngân hàng chứa số dư của nhiều tài khoản khách hàng, cũng như tổng số dư tiền gửi của từng chi nhánh. Giả sử ta muốn ghi nhận một khoản thanh toán $100.00 từ tài khoản của Alice sang tài khoản của Bob. Đơn giản hoá hết cỡ, các câu lệnh SQL cho việc này có thể trông như sau:"

📖 **Nguyên văn (SQL gốc)**
```sql
UPDATE accounts SET balance = balance - 100.00
    WHERE name = 'Alice';
UPDATE branches SET balance = balance - 100.00
    WHERE name = (SELECT branch_name FROM accounts WHERE name = 'Alice');
UPDATE accounts SET balance = balance + 100.00
    WHERE name = 'Bob';
UPDATE branches SET balance = balance + 100.00
    WHERE name = (SELECT branch_name FROM accounts WHERE name = 'Bob');
```

🇻🇳 Bốn câu `UPDATE`: trừ $100 khỏi tài khoản Alice, trừ $100 khỏi số dư chi nhánh của Alice, cộng $100 vào tài khoản Bob, cộng $100 vào số dư chi nhánh của Bob. Một nghiệp vụ "chuyển tiền" tưởng đơn giản nhưng thực chất là bốn thao tác ghi riêng biệt.

📖 **Nguyên văn**
> "The details of these commands are not important here; the important point is that there are several separate updates involved to accomplish this rather simple operation. Our bank's officers will want to be assured that either all these updates happen, or none of them happen. It would certainly not do for a system failure to result in Bob receiving $100.00 that was not debited from Alice. Nor would Alice long remain a happy customer if she was debited without Bob being credited. We need a guarantee that if something goes wrong partway through the operation, none of the steps executed so far will take effect. Grouping the updates into a *transaction* gives us this guarantee. A transaction is said to be *atomic*: from the point of view of other transactions, it either happens completely or not at all."

🇻🇳 **Dịch**
> "Chi tiết của các câu lệnh này không quan trọng ở đây; điều quan trọng là có vài câu update riêng biệt tham gia vào việc hoàn thành một thao tác khá đơn giản này. Các cán bộ ngân hàng sẽ muốn được đảm bảo rằng hoặc tất cả các update này đều xảy ra, hoặc không cái nào xảy ra. Chắc chắn sẽ không ổn nếu một sự cố hệ thống dẫn tới việc Bob nhận $100.00 mà không bị trừ từ Alice. Alice cũng chẳng còn là khách hàng vui vẻ được lâu nếu cô ấy bị trừ tiền mà Bob không được cộng. Ta cần một đảm bảo rằng nếu có gì đó sai sót giữa chừng thao tác, thì không bước nào đã thực thi trước đó có hiệu lực. Gom các update vào một *transaction* cho ta đảm bảo đó. Một transaction được gọi là *atomic*: dưới góc nhìn của các transaction khác, nó hoặc xảy ra trọn vẹn hoặc không xảy ra chút nào."

> [!note] "Atomic" nghĩa là gì
> Đây chính là định nghĩa nguyên văn của **atomic** trong tài liệu PostgreSQL: *"from the point of view of other transactions, it either happens completely or not at all"*. Không có trạng thái "làm được một nửa". Đó là ý nghĩa của cụm **all-or-nothing**.

---

## 3. Durability — ghi xuống đĩa trước khi báo xong

📖 **Nguyên văn**
> "We also want a guarantee that once a transaction is completed and acknowledged by the database system, it has indeed been permanently recorded and won't be lost even if a crash ensues shortly thereafter. For example, if we are recording a cash withdrawal by Bob, we do not want any chance that the debit to his account will disappear in a crash just after he walks out the bank door. A transactional database guarantees that all the updates made by a transaction are logged in permanent storage (i.e., on disk) before the transaction is reported complete."

🇻🇳 **Dịch**
> "Ta cũng muốn một đảm bảo rằng khi một transaction đã hoàn tất và được hệ cơ sở dữ liệu xác nhận, thì nó thực sự đã được ghi lại vĩnh viễn và sẽ không mất đi ngay cả khi một sự cố crash xảy ra ngay sau đó. Ví dụ, nếu ta đang ghi nhận một lần rút tiền mặt của Bob, ta không muốn có bất kỳ khả năng nào việc trừ tiền tài khoản anh ấy biến mất trong một lần crash ngay khi anh ấy vừa bước ra khỏi cửa ngân hàng. Một database có transaction đảm bảo rằng tất cả các update do một transaction thực hiện đều được ghi log vào bộ nhớ vĩnh viễn (tức là trên đĩa) trước khi transaction được báo là hoàn tất."

💡 **Ví dụ đời sống**
Giống như ký nhận bưu phẩm: shipper chỉ báo "giao thành công" sau khi bạn đã ký vào sổ giấy. Cái chữ ký trên giấy là "permanent storage" — mất điện, sập server thì tờ giấy vẫn còn đó.

---

## 4. Isolation — thay đổi chưa commit thì không ai thấy

📖 **Nguyên văn**
> "Another important property of transactional databases is closely related to the notion of atomic updates: when multiple transactions are running concurrently, each one should not be able to see the incomplete changes made by others. For example, if one transaction is busy totalling all the branch balances, it would not do for it to include the debit from Alice's branch but not the credit to Bob's branch, nor vice versa. So transactions must be all-or-nothing not only in terms of their permanent effect on the database, but also in terms of their visibility as they happen. The updates made so far by an open transaction are invisible to other transactions until the transaction completes, whereupon all the updates become visible simultaneously."

🇻🇳 **Dịch**
> "Một thuộc tính quan trọng khác của database có transaction liên hệ chặt chẽ với khái niệm update atomic: khi nhiều transaction chạy song song, mỗi transaction không được phép nhìn thấy những thay đổi còn dở dang do transaction khác tạo ra. Ví dụ, nếu một transaction đang bận tính tổng số dư của tất cả chi nhánh, sẽ không ổn nếu nó tính cả khoản trừ ở chi nhánh của Alice mà không tính khoản cộng ở chi nhánh của Bob, hoặc ngược lại. Vậy nên transaction phải all-or-nothing không chỉ về mặt tác động vĩnh viễn lên database, mà còn về mặt khả năng nhìn thấy trong lúc chúng đang diễn ra. Các update mà một transaction đang mở đã thực hiện đến thời điểm đó là vô hình với các transaction khác cho tới khi transaction hoàn tất, lúc đó tất cả các update trở nên nhìn thấy được cùng một lúc."

---

## 5. BEGIN / COMMIT / ROLLBACK

📖 **Nguyên văn**
> "In PostgreSQL, a transaction is set up by surrounding the SQL commands of the transaction with `BEGIN` and `COMMIT` commands. So our banking transaction would actually look like:"

🇻🇳 **Dịch**
> "Trong PostgreSQL, một transaction được thiết lập bằng cách bao các câu lệnh SQL của transaction đó giữa hai lệnh `BEGIN` và `COMMIT`. Vậy transaction ngân hàng của ta thực ra sẽ trông thế này:"

📖 **Nguyên văn (SQL gốc)**
```sql
BEGIN;
UPDATE accounts SET balance = balance - 100.00
    WHERE name = 'Alice';
-- etc etc
COMMIT;
```

🇻🇳 `BEGIN;` mở transaction block, các câu `UPDATE` chạy bên trong, `COMMIT;` chốt lại toàn bộ thành một đơn vị duy nhất.

📖 **Nguyên văn**
> "If, partway through the transaction, we decide we do not want to commit (perhaps we just noticed that Alice's balance went negative), we can issue the command `ROLLBACK` instead of `COMMIT`, and all our updates so far will be canceled."

🇻🇳 **Dịch**
> "Nếu giữa chừng transaction, ta quyết định không muốn commit nữa (có thể ta vừa nhận ra số dư của Alice đã âm), ta có thể ra lệnh `ROLLBACK` thay cho `COMMIT`, và tất cả các update tới thời điểm đó sẽ bị huỷ."

📖 **Nguyên văn**
> "PostgreSQL actually treats every SQL statement as being executed within a transaction. If you do not issue a `BEGIN` command, then each individual statement has an implicit `BEGIN` and (if successful) `COMMIT` wrapped around it. A group of statements surrounded by `BEGIN` and `COMMIT` is sometimes called a *transaction block*."

🇻🇳 **Dịch**
> "PostgreSQL thực ra coi mọi câu lệnh SQL đều được thực thi bên trong một transaction. Nếu bạn không ra lệnh `BEGIN`, thì mỗi câu lệnh riêng lẻ được bọc bởi một `BEGIN` ngầm định và (nếu thành công) một `COMMIT`. Một nhóm câu lệnh được bao bởi `BEGIN` và `COMMIT` đôi khi được gọi là một *transaction block*."

> [!warning] Client library có thể tự phát `BEGIN`
> 📖 **Nguyên văn**
> > "Some client libraries issue `BEGIN` and `COMMIT` commands automatically, so that you might get the effect of transaction blocks without asking. Check the documentation for the interface you are using."
>
> 🇻🇳 **Dịch**
> > "Một số client library tự động phát lệnh `BEGIN` và `COMMIT`, nên bạn có thể nhận được hiệu ứng của transaction block mà không hề yêu cầu. Hãy kiểm tra tài liệu của interface mà bạn đang dùng."

### Cú pháp đầy đủ của BEGIN

📖 **Nguyên văn (Synopsis gốc)**
```sql
BEGIN [ WORK | TRANSACTION ] [ transaction_mode [, ...] ]

where transaction_mode is one of:

    ISOLATION LEVEL { SERIALIZABLE | REPEATABLE READ | READ COMMITTED | READ UNCOMMITTED }
    READ WRITE | READ ONLY
    [ NOT ] DEFERRABLE
```

🇻🇳 Cú pháp `BEGIN` cho phép khai báo luôn isolation level, chế độ đọc/ghi và tính deferrable ngay lúc mở transaction.

📖 **Nguyên văn**
> "`BEGIN` initiates a transaction block, that is, all statements after a `BEGIN` command will be executed in a single transaction until an explicit `COMMIT` or `ROLLBACK` is given. By default (without `BEGIN`), PostgreSQL executes transactions in “autocommit” mode, that is, each statement is executed in its own transaction and a commit is implicitly performed at the end of the statement (if execution was successful, otherwise a rollback is done)."

🇻🇳 **Dịch**
> "`BEGIN` khởi tạo một transaction block, nghĩa là mọi câu lệnh sau lệnh `BEGIN` sẽ được thực thi trong cùng một transaction cho tới khi có `COMMIT` hoặc `ROLLBACK` tường minh. Mặc định (không có `BEGIN`), PostgreSQL thực thi transaction ở chế độ “autocommit”, nghĩa là mỗi câu lệnh được thực thi trong transaction riêng của nó và một commit được thực hiện ngầm định ở cuối câu lệnh (nếu thực thi thành công, nếu không thì một rollback được thực hiện)."

---

## 6. SAVEPOINT và ROLLBACK TO

📖 **Nguyên văn**
> "It's possible to control the statements in a transaction in a more granular fashion through the use of *savepoints*. Savepoints allow you to selectively discard parts of the transaction, while committing the rest. After defining a savepoint with `SAVEPOINT`, you can if needed roll back to the savepoint with `ROLLBACK TO`. All the transaction's database changes between defining the savepoint and rolling back to it are discarded, but changes earlier than the savepoint are kept."

🇻🇳 **Dịch**
> "Có thể kiểm soát các câu lệnh trong một transaction ở mức chi tiết hơn thông qua việc dùng *savepoint*. Savepoint cho phép bạn huỷ bỏ có chọn lọc từng phần của transaction, trong khi vẫn commit phần còn lại. Sau khi định nghĩa một savepoint bằng `SAVEPOINT`, bạn có thể quay lui về savepoint đó bằng `ROLLBACK TO` nếu cần. Tất cả thay đổi database của transaction nằm giữa lúc định nghĩa savepoint và lúc quay lui về nó đều bị huỷ, nhưng các thay đổi trước savepoint thì được giữ lại."

📖 **Nguyên văn**
> "After rolling back to a savepoint, it continues to be defined, so you can roll back to it several times. Conversely, if you are sure you won't need to roll back to a particular savepoint again, it can be released, so the system can free some resources. Keep in mind that either releasing or rolling back to a savepoint will automatically release all savepoints that were defined after it."

🇻🇳 **Dịch**
> "Sau khi quay lui về một savepoint, savepoint đó vẫn tiếp tục tồn tại, nên bạn có thể quay lui về nó nhiều lần. Ngược lại, nếu bạn chắc chắn sẽ không cần quay lui về một savepoint cụ thể nữa, nó có thể được release để hệ thống giải phóng bớt tài nguyên. Hãy nhớ rằng dù là release hay rollback về một savepoint thì đều tự động release tất cả các savepoint được định nghĩa sau nó."

📖 **Nguyên văn**
> "Remembering the bank database, suppose we debit $100.00 from Alice's account, and credit Bob's account, only to find later that we should have credited Wally's account. We could do it using savepoints like this:"

🇻🇳 **Dịch**
> "Nhớ lại database ngân hàng, giả sử ta trừ $100.00 khỏi tài khoản của Alice, và cộng vào tài khoản của Bob, để rồi sau đó mới phát hiện ra đáng lẽ phải cộng vào tài khoản của Wally. Ta có thể làm điều đó bằng savepoint như sau:"

📖 **Nguyên văn (SQL gốc)**
```sql
BEGIN;
UPDATE accounts SET balance = balance - 100.00
    WHERE name = 'Alice';
SAVEPOINT my_savepoint;
UPDATE accounts SET balance = balance + 100.00
    WHERE name = 'Bob';
-- oops ... forget that and use Wally's account
ROLLBACK TO my_savepoint;
UPDATE accounts SET balance = balance + 100.00
    WHERE name = 'Wally';
COMMIT;
```

🇻🇳 Trừ tiền Alice → đặt mốc `my_savepoint` → cộng nhầm cho Bob → `ROLLBACK TO my_savepoint` huỷ riêng phần cộng cho Bob (khoản trừ của Alice vẫn giữ) → cộng đúng cho Wally → `COMMIT`.

📖 **Nguyên văn**
> "`SAVEPOINT` establishes a new savepoint within the current transaction.
>
> A savepoint is a special mark inside a transaction that allows all commands that are executed after it was established to be rolled back, restoring the transaction state to what it was at the time of the savepoint."

🇻🇳 **Dịch**
> "`SAVEPOINT` thiết lập một savepoint mới bên trong transaction hiện tại.
>
> Savepoint là một dấu mốc đặc biệt bên trong transaction, cho phép mọi lệnh được thực thi sau khi nó được thiết lập có thể bị rollback, khôi phục trạng thái transaction về đúng như lúc đặt savepoint."

📖 **Nguyên văn (ví dụ gốc từ trang `SAVEPOINT`)**
```sql
BEGIN;
    INSERT INTO table1 VALUES (1);
    SAVEPOINT my_savepoint;
    INSERT INTO table1 VALUES (2);
    ROLLBACK TO SAVEPOINT my_savepoint;
    INSERT INTO table1 VALUES (3);
COMMIT;
```

🇻🇳 Transaction này chèn giá trị 1 và 3, nhưng không chèn 2 — đúng như tài liệu ghi: *"The above transaction will insert the values 1 and 3, but not 2."*

> [!tip] `ROLLBACK TO` là lối thoát khi transaction bị abort
> 📖 **Nguyên văn**
> > "Moreover, `ROLLBACK TO` is the only way to regain control of a transaction block that was put in aborted state by the system due to an error, short of rolling it back completely and starting again."
>
> 🇻🇳 **Dịch**
> > "Hơn nữa, `ROLLBACK TO` là cách duy nhất để giành lại quyền kiểm soát một transaction block đã bị hệ thống đưa vào trạng thái aborted do lỗi, ngoài việc rollback toàn bộ nó rồi bắt đầu lại từ đầu."

💡 **Ví dụ đời sống**
Savepoint giống như save game giữa màn. Chết ở đoạn boss thì load lại từ điểm save gần nhất, không phải chơi lại cả màn từ đầu.

---

## 7. ACID

> [!warning] Phần này là tổng hợp của mình, KHÔNG phải trích một đoạn có sẵn
> Trong 7 trang PostgreSQL Documentation được dùng làm nguồn cho bài này
> (`tutorial-transactions`, `mvcc-intro`, `transaction-iso`, `mvcc-caveats`, `explicit-locking`, `sql-begin`, `sql-savepoint`),
> **không trang nào có một đoạn định nghĩa đủ 4 chữ A-C-I-D.** Chữ "ACID" không xuất hiện trên các trang này.
> Tài liệu mô tả **từng thuộc tính riêng lẻ** bằng ngôn ngữ thường (atomic, permanent storage, visibility, isolation level) chứ không đóng gói chúng dưới nhãn ACID.
> Vì vậy bảng dưới đây là **cách mình gom lại**, mỗi dòng có kèm câu nguyên văn tương ứng đã trích ở các mục trên. Không có đoạn "nguyên văn ACID" nào để trích.

| Chữ | Tên đầy đủ | Câu nguyên văn tương ứng trong PostgreSQL docs | Mục trong bài |
|---|---|---|---|
| **A** | Atomicity | *"A transaction is said to be atomic: from the point of view of other transactions, it either happens completely or not at all."* | [Mục 2](#2-ví-dụ-kinh-điển-chuyển-tiền-alice--bob) |
| **C** | Consistency | *"Execution of multiple statements inside a transaction is also useful to ensure consistency when making several related changes"* (trang `BEGIN`) | [Mục 5](#5-begin--commit--rollback) |
| **I** | Isolation | *"The updates made so far by an open transaction are invisible to other transactions until the transaction completes"* | [Mục 4](#4-isolation--thay-đổi-chưa-commit-thì-không-ai-thấy) |
| **D** | Durability | *"all the updates made by a transaction are logged in permanent storage (i.e., on disk) before the transaction is reported complete"* | [Mục 3](#3-durability--ghi-xuống-đĩa-trước-khi-báo-xong) |

📖 **Nguyên văn (câu về consistency, trang `BEGIN`)**
> "Statements are executed more quickly in a transaction block, because transaction start/commit requires significant CPU and disk activity. Execution of multiple statements inside a transaction is also useful to ensure consistency when making several related changes: other sessions will be unable to see the intermediate states wherein not all the related updates have been done."

🇻🇳 **Dịch**
> "Các câu lệnh được thực thi nhanh hơn khi nằm trong một transaction block, vì việc bắt đầu/commit transaction đòi hỏi hoạt động CPU và đĩa đáng kể. Thực thi nhiều câu lệnh bên trong một transaction cũng hữu ích để đảm bảo tính nhất quán (consistency) khi thực hiện vài thay đổi có liên quan với nhau: các session khác sẽ không thể thấy các trạng thái trung gian mà trong đó chưa phải tất cả các update liên quan đã được làm xong."

---

## 8. MVCC — Multiversion Concurrency Control

📖 **Nguyên văn**
> "PostgreSQL provides a rich set of tools for developers to manage concurrent access to data. Internally, data consistency is maintained by using a multiversion model (Multiversion Concurrency Control, MVCC). This means that each SQL statement sees a snapshot of data (a *database version*) as it was some time ago, regardless of the current state of the underlying data. This prevents statements from viewing inconsistent data produced by concurrent transactions performing updates on the same data rows, providing *transaction isolation* for each database session. MVCC, by eschewing the locking methodologies of traditional database systems, minimizes lock contention in order to allow for reasonable performance in multiuser environments."

🇻🇳 **Dịch**
> "PostgreSQL cung cấp một bộ công cụ phong phú cho lập trình viên quản lý việc truy cập dữ liệu đồng thời. Bên trong, tính nhất quán dữ liệu được duy trì bằng cách dùng một mô hình đa phiên bản (Multiversion Concurrency Control, MVCC). Điều này nghĩa là mỗi câu lệnh SQL nhìn thấy một snapshot của dữ liệu (một *database version*) ở trạng thái của nó tại một thời điểm trước đó, bất kể trạng thái hiện tại của dữ liệu nền là gì. Việc này ngăn các câu lệnh nhìn thấy dữ liệu không nhất quán do các transaction chạy song song đang update cùng những dòng dữ liệu đó tạo ra, qua đó cung cấp *transaction isolation* cho mỗi database session. Bằng cách tránh các phương pháp khoá (locking) của những hệ database truyền thống, MVCC giảm thiểu tranh chấp khoá để cho phép hiệu năng hợp lý trong môi trường nhiều người dùng."

📖 **Nguyên văn** *(câu quan trọng nhất của MVCC)*
> "The main advantage of using the MVCC model of concurrency control rather than locking is that in MVCC locks acquired for querying (reading) data do not conflict with locks acquired for writing data, and so reading never blocks writing and writing never blocks reading. PostgreSQL maintains this guarantee even when providing the strictest level of transaction isolation through the use of an innovative *Serializable Snapshot Isolation* (SSI) level."

🇻🇳 **Dịch**
> "Lợi thế chính của việc dùng mô hình kiểm soát đồng thời MVCC thay vì locking là trong MVCC, các khoá được giành để truy vấn (đọc) dữ liệu không xung đột với các khoá được giành để ghi dữ liệu, và do đó **việc đọc không bao giờ chặn việc ghi và việc ghi không bao giờ chặn việc đọc**. PostgreSQL duy trì đảm bảo này ngay cả khi cung cấp mức transaction isolation nghiêm ngặt nhất, thông qua việc dùng một mức *Serializable Snapshot Isolation* (SSI) sáng tạo."

💡 **Ví dụ đời sống**
MVCC giống như Google Docs bản in: bạn đang đọc bản in ra lúc 9h00, người khác vẫn sửa file online thoải mái. Bản in trên tay bạn không đổi giữa chừng, và việc bạn đang đọc cũng không khoá tay người đang sửa. Khi bạn cần bản mới, bạn in lại — đó chính là "lấy snapshot mới".

📖 **Nguyên văn**
> "Table- and row-level locking facilities are also available in PostgreSQL for applications which don't generally need full transaction isolation and prefer to explicitly manage particular points of conflict. However, proper use of MVCC will generally provide better performance than locks. In addition, application-defined advisory locks provide a mechanism for acquiring locks that are not tied to a single transaction."

🇻🇳 **Dịch**
> "PostgreSQL cũng có sẵn các cơ chế khoá ở mức bảng và mức dòng, dành cho những ứng dụng nhìn chung không cần transaction isolation đầy đủ mà muốn quản lý tường minh một số điểm xung đột cụ thể. Tuy nhiên, dùng MVCC đúng cách nhìn chung sẽ cho hiệu năng tốt hơn là dùng khoá. Ngoài ra, advisory lock do ứng dụng tự định nghĩa cung cấp một cơ chế để giành khoá không gắn với một transaction đơn lẻ."

---

## 9. Bốn mức transaction isolation — TRỌNG TÂM

📖 **Nguyên văn**
> "The SQL standard defines four levels of transaction isolation. The most strict is Serializable, which is defined by the standard in a paragraph which says that any concurrent execution of a set of Serializable transactions is guaranteed to produce the same effect as running them one at a time in some order. The other three levels are defined in terms of phenomena, resulting from interaction between concurrent transactions, which must not occur at each level. The standard notes that due to the definition of Serializable, none of these phenomena are possible at that level."

🇻🇳 **Dịch**
> "Chuẩn SQL định nghĩa bốn mức transaction isolation. Nghiêm ngặt nhất là Serializable, được chuẩn định nghĩa trong một đoạn nói rằng bất kỳ lần thực thi đồng thời nào của một tập các transaction Serializable đều được đảm bảo tạo ra cùng kết quả như khi chạy chúng lần lượt từng cái một theo một thứ tự nào đó. Ba mức còn lại được định nghĩa theo các *hiện tượng* (phenomena) phát sinh từ tương tác giữa các transaction chạy song song, mà không được phép xảy ra ở mỗi mức. Chuẩn ghi chú rằng do định nghĩa của Serializable, không hiện tượng nào trong số này có thể xảy ra ở mức đó."

### 9.1. Bốn hiện tượng bị cấm

📖 **Nguyên văn**
> "The phenomena which are prohibited at various levels are:
>
> **dirty read**
> A transaction reads data written by a concurrent uncommitted transaction.
>
> **nonrepeatable read**
> A transaction re-reads data it has previously read and finds that data has been modified by another transaction (that committed since the initial read).
>
> **phantom read**
> A transaction re-executes a query returning a set of rows that satisfy a search condition and finds that the set of rows satisfying the condition has changed due to another recently-committed transaction.
>
> **serialization anomaly**
> The result of successfully committing a group of transactions is inconsistent with all possible orderings of running those transactions one at a time."

🇻🇳 **Dịch**
> "Các hiện tượng bị cấm ở những mức khác nhau là:
>
> **dirty read**
> Một transaction đọc dữ liệu được ghi bởi một transaction chạy song song chưa commit.
>
> **nonrepeatable read**
> Một transaction đọc lại dữ liệu mà nó đã đọc trước đó và phát hiện dữ liệu ấy đã bị sửa bởi một transaction khác (transaction đã commit kể từ lần đọc đầu tiên).
>
> **phantom read**
> Một transaction chạy lại một truy vấn trả về một tập các dòng thoả mãn một điều kiện tìm kiếm, và phát hiện rằng tập các dòng thoả điều kiện đó đã thay đổi do một transaction khác vừa commit gần đây.
>
> **serialization anomaly**
> Kết quả của việc commit thành công một nhóm transaction không nhất quán với mọi thứ tự khả dĩ của việc chạy các transaction đó lần lượt từng cái một."

💡 **Ví dụ đời sống cho từng hiện tượng**

- **dirty read** — Bạn nhìn qua vai đồng nghiệp đang gõ dở email báo giá "5 triệu", rồi đi báo khách. Đồng nghiệp chưa gửi email, sửa lại thành "8 triệu" rồi mới gửi. Bạn đã đọc **bản nháp chưa commit**.
- **nonrepeatable read** — Sáng vào app xem giá vé máy bay: 1.200.000đ. Mở tab khác xem hành lý, quay lại refresh: vẫn chuyến đó, vẫn ghế đó, nhưng **giá đã thành 1.500.000đ**. Cùng một dòng dữ liệu, đọc lại ra giá khác.
- **phantom read** — Bạn đếm số người trong phòng họp: 8 người. Quay đi ghi bảng, quay lại đếm lại: 10 người — hai người **mới đi vào**. Không phải người cũ đổi, mà **tập hợp** thoả điều kiện "đang ở trong phòng" đã thay đổi.
- **serialization anomaly** — Hai người cùng lúc rút tiền từ một tài khoản chung 1.000.000đ, mỗi người kiểm tra số dư thấy đủ rồi cùng rút 700.000đ. Kết quả cuối cùng (âm 400.000đ) **không khớp với bất kỳ thứ tự nào** nếu hai người xếp hàng rút lần lượt (người thứ hai đáng lẽ đã bị từ chối).

### 9.2. Table 13.1. Transaction Isolation Levels

📖 **Nguyên văn**
> "The SQL standard and PostgreSQL-implemented transaction isolation levels are described in Table 13.1."

🇻🇳 **Dịch**
> "Các mức transaction isolation theo chuẩn SQL và theo cách PostgreSQL hiện thực được mô tả trong Table 13.1."

📖 **Nguyên văn (Table 13.1, giữ nguyên dạng bảng)**

| Isolation Level | Dirty Read | Nonrepeatable Read | Phantom Read | Serialization Anomaly |
|---|---|---|---|---|
| Read uncommitted | Allowed, but not in PG | Possible | Possible | Possible |
| Read committed | Not possible | Possible | Possible | Possible |
| Repeatable read | Not possible | Not possible | Allowed, but not in PG | Possible |
| Serializable | Not possible | Not possible | Not possible | Not possible |

🇻🇳 **Dịch (cột dịch thêm vào — nội dung gốc giữ nguyên bên trên)**

| Isolation Level | Dirty Read | Nonrepeatable Read | Phantom Read | Serialization Anomaly |
|---|---|---|---|---|
| Read uncommitted | Chuẩn cho phép, nhưng PostgreSQL thì không | Có thể xảy ra | Có thể xảy ra | Có thể xảy ra |
| Read committed | Không thể xảy ra | Có thể xảy ra | Có thể xảy ra | Có thể xảy ra |
| Repeatable read | Không thể xảy ra | Không thể xảy ra | Chuẩn cho phép, nhưng PostgreSQL thì không | Có thể xảy ra |
| Serializable | Không thể xảy ra | Không thể xảy ra | Không thể xảy ra | Không thể xảy ra |

📖 **Nguyên văn**
> "In PostgreSQL, you can request any of the four standard transaction isolation levels, but internally only three distinct isolation levels are implemented, i.e., PostgreSQL's Read Uncommitted mode behaves like Read Committed. This is because it is the only sensible way to map the standard isolation levels to PostgreSQL's multiversion concurrency control architecture.
>
> The table also shows that PostgreSQL's Repeatable Read implementation does not allow phantom reads. This is acceptable under the SQL standard because the standard specifies which anomalies must not occur at certain isolation levels; higher guarantees are acceptable. The behavior of the available isolation levels is detailed in the following subsections.
>
> To set the transaction isolation level of a transaction, use the command `SET TRANSACTION`."

🇻🇳 **Dịch**
> "Trong PostgreSQL, bạn có thể yêu cầu bất kỳ mức nào trong bốn mức transaction isolation chuẩn, nhưng bên trong chỉ có ba mức isolation khác biệt được hiện thực, tức là chế độ Read Uncommitted của PostgreSQL hành xử giống như Read Committed. Đó là vì đây là cách duy nhất hợp lý để ánh xạ các mức isolation chuẩn sang kiến trúc multiversion concurrency control của PostgreSQL.
>
> Bảng trên cũng cho thấy cách hiện thực Repeatable Read của PostgreSQL không cho phép phantom read. Điều này chấp nhận được theo chuẩn SQL vì chuẩn chỉ quy định những dị thường nào *không được* xảy ra ở một số mức isolation nhất định; đảm bảo cao hơn thì vẫn được chấp nhận. Hành vi của các mức isolation có sẵn được trình bày chi tiết trong các mục con phía sau.
>
> Để đặt mức transaction isolation cho một transaction, dùng lệnh `SET TRANSACTION`."

> [!warning] Sequence không tuân theo transaction
> 📖 **Nguyên văn**
> > "Some PostgreSQL data types and functions have special rules regarding transactional behavior. In particular, changes made to a sequence (and therefore the counter of a column declared using `serial`) are immediately visible to all other transactions and are not rolled back if the transaction that made the changes aborts."
>
> 🇻🇳 **Dịch**
> > "Một số kiểu dữ liệu và hàm của PostgreSQL có quy tắc riêng về hành vi transaction. Cụ thể, các thay đổi với một sequence (và do đó là bộ đếm của một cột khai báo bằng `serial`) hiển thị ngay lập tức với tất cả transaction khác và **không bị rollback** nếu transaction tạo ra thay đổi đó bị abort."

---

## 10. Read Committed Isolation Level (mặc định)

📖 **Nguyên văn**
> "Read Committed is the default isolation level in PostgreSQL. When a transaction uses this isolation level, a `SELECT` query (without a `FOR UPDATE/SHARE` clause) sees only data committed before the query began; it never sees either uncommitted data or changes committed by concurrent transactions during the query's execution. In effect, a `SELECT` query sees a snapshot of the database as of the instant the query begins to run. However, `SELECT` does see the effects of previous updates executed within its own transaction, even though they are not yet committed. Also note that two successive `SELECT` commands can see different data, even though they are within a single transaction, if other transactions commit changes after the first `SELECT` starts and before the second `SELECT` starts."

🇻🇳 **Dịch**
> "Read Committed là mức isolation mặc định trong PostgreSQL. Khi một transaction dùng mức isolation này, một truy vấn `SELECT` (không có mệnh đề `FOR UPDATE/SHARE`) chỉ nhìn thấy dữ liệu đã được commit *trước khi truy vấn bắt đầu*; nó không bao giờ nhìn thấy dữ liệu chưa commit, cũng không thấy các thay đổi được commit bởi transaction chạy song song trong lúc truy vấn đang thực thi. Trên thực tế, một truy vấn `SELECT` nhìn thấy một snapshot của database tại đúng khoảnh khắc truy vấn bắt đầu chạy. Tuy nhiên, `SELECT` *có* nhìn thấy tác động của các update trước đó được thực thi bên trong chính transaction của nó, dù chúng chưa được commit. Cũng lưu ý rằng hai lệnh `SELECT` liên tiếp có thể nhìn thấy dữ liệu khác nhau, dù chúng nằm trong cùng một transaction, nếu có transaction khác commit thay đổi sau khi `SELECT` đầu bắt đầu và trước khi `SELECT` thứ hai bắt đầu."

> **Điểm mấu chốt:** ở Read Committed, **snapshot được lấy lại ở mỗi câu lệnh**. Đó chính là lý do nonrepeatable read và phantom read vẫn có thể xảy ra.

📖 **Nguyên văn**
> "Because of the above rules, it is possible for an updating command to see an inconsistent snapshot: it can see the effects of concurrent updating commands on the same rows it is trying to update, but it does not see effects of those commands on other rows in the database. This behavior makes Read Committed mode unsuitable for commands that involve complex search conditions; however, it is just right for simpler cases. For example, consider transferring $100 from one account to another:"

🇻🇳 **Dịch**
> "Vì các quy tắc trên, một câu lệnh update có thể nhìn thấy một snapshot không nhất quán: nó có thể thấy tác động của các câu lệnh update song song lên chính những dòng mà nó đang định update, nhưng không thấy tác động của những câu lệnh đó lên các dòng khác trong database. Hành vi này khiến chế độ Read Committed không phù hợp cho các câu lệnh có điều kiện tìm kiếm phức tạp; tuy nhiên nó lại vừa đúng cho các trường hợp đơn giản hơn. Ví dụ, hãy xét việc chuyển $100 từ tài khoản này sang tài khoản khác:"

📖 **Nguyên văn (SQL gốc)**
```sql
BEGIN;
UPDATE accounts SET balance = balance + 100.00 WHERE acctnum = 12345;
UPDATE accounts SET balance = balance - 100.00 WHERE acctnum = 7534;
COMMIT;
```

🇻🇳 Cộng $100 cho tài khoản 12345, trừ $100 của tài khoản 7534, cả hai nằm trong một transaction block.

📖 **Nguyên văn**
> "If another transaction concurrently tries to change the balance of account 7534, we clearly want the second statement to start with the updated version of the account's row. Because each command is affecting only a predetermined row, letting it see the updated version of the row does not create any troublesome inconsistency."

🇻🇳 **Dịch**
> "Nếu một transaction khác đồng thời cố thay đổi số dư của tài khoản 7534, rõ ràng ta muốn câu lệnh thứ hai bắt đầu với phiên bản đã cập nhật của dòng tài khoản đó. Vì mỗi câu lệnh chỉ tác động lên một dòng đã được xác định trước, việc cho nó thấy phiên bản mới của dòng không tạo ra bất kỳ sự không nhất quán phiền toái nào."

### Ví dụ Read Committed gây kết quả bất ngờ

📖 **Nguyên văn**
> "More complex usage can produce undesirable results in Read Committed mode. For example, consider a `DELETE` command operating on data that is being both added and removed from its restriction criteria by another command, e.g., assume `website` is a two-row table with `website.hits` equaling `9` and `10`:"

🇻🇳 **Dịch**
> "Cách dùng phức tạp hơn có thể tạo ra kết quả không mong muốn trong chế độ Read Committed. Ví dụ, hãy xét một lệnh `DELETE` thao tác trên dữ liệu đang vừa được thêm vào vừa bị loại khỏi điều kiện lọc của nó bởi một lệnh khác, ví dụ giả sử `website` là một bảng hai dòng với `website.hits` bằng `9` và `10`:"

📖 **Nguyên văn (SQL gốc)**
```sql
BEGIN;
UPDATE website SET hits = hits + 1;
-- run from another session:  DELETE FROM website WHERE hits = 10;
COMMIT;
```

🇻🇳 Session 1 tăng tất cả `hits` lên 1; session 2 đồng thời xoá dòng có `hits = 10`.

📖 **Nguyên văn**
> "The `DELETE` will have no effect even though there is a `website.hits = 10` row before and after the `UPDATE`. This occurs because the pre-update row value `9` is skipped, and when the `UPDATE` completes and `DELETE` obtains a lock, the new row value is no longer `10` but `11`, which no longer matches the criteria."

🇻🇳 **Dịch**
> "Lệnh `DELETE` sẽ không có tác dụng gì, dù rằng vẫn tồn tại một dòng `website.hits = 10` cả trước lẫn sau lệnh `UPDATE`. Chuyện này xảy ra vì dòng có giá trị `9` trước khi update bị bỏ qua, và khi `UPDATE` hoàn tất rồi `DELETE` giành được khoá, giá trị mới của dòng không còn là `10` nữa mà là `11`, không còn khớp điều kiện."

📖 **Nguyên văn**
> "The partial transaction isolation provided by Read Committed mode is adequate for many applications, and this mode is fast and simple to use; however, it is not sufficient for all cases. Applications that do complex queries and updates might require a more rigorously consistent view of the database than Read Committed mode provides."

🇻🇳 **Dịch**
> "Mức transaction isolation một phần mà chế độ Read Committed cung cấp là đủ cho nhiều ứng dụng, và chế độ này nhanh và đơn giản khi dùng; tuy nhiên nó không đủ cho mọi trường hợp. Những ứng dụng thực hiện các truy vấn và update phức tạp có thể cần một góc nhìn nhất quán chặt chẽ hơn về database so với những gì Read Committed cung cấp."

---

## 11. Repeatable Read Isolation Level

📖 **Nguyên văn**
> "The Repeatable Read isolation level only sees data committed before the transaction began; it never sees either uncommitted data or changes committed by concurrent transactions during the transaction's execution. (However, each query does see the effects of previous updates executed within its own transaction, even though they are not yet committed.) This is a stronger guarantee than is required by the SQL standard for this isolation level, and prevents all of the phenomena described in Table 13.1 except for serialization anomalies. As mentioned above, this is specifically allowed by the standard, which only describes the minimum protections each isolation level must provide."

🇻🇳 **Dịch**
> "Mức isolation Repeatable Read chỉ nhìn thấy dữ liệu đã commit *trước khi transaction bắt đầu*; nó không bao giờ nhìn thấy dữ liệu chưa commit, cũng không thấy các thay đổi được commit bởi transaction chạy song song trong lúc transaction đang thực thi. (Tuy nhiên, mỗi truy vấn vẫn thấy tác động của các update trước đó được thực thi bên trong chính transaction của nó, dù chúng chưa được commit.) Đây là một đảm bảo mạnh hơn mức mà chuẩn SQL đòi hỏi cho mức isolation này, và nó ngăn được tất cả các hiện tượng mô tả trong Table 13.1 ngoại trừ serialization anomaly. Như đã nói ở trên, điều này được chuẩn cho phép một cách rõ ràng, vì chuẩn chỉ mô tả mức bảo vệ tối thiểu mà mỗi mức isolation phải cung cấp."

📖 **Nguyên văn**
> "This level is different from Read Committed in that a query in a repeatable read transaction sees a snapshot as of the start of the first non-transaction-control statement in the transaction, not as of the start of the current statement within the transaction. Thus, successive `SELECT` commands within a single transaction see the same data, i.e., they do not see changes made by other transactions that committed after their own transaction started.
>
> Applications using this level must be prepared to retry transactions due to serialization failures."

🇻🇳 **Dịch**
> "Mức này khác Read Committed ở chỗ một truy vấn trong transaction repeatable read nhìn thấy snapshot tính từ lúc bắt đầu **câu lệnh không-phải-điều-khiển-transaction đầu tiên** trong transaction, chứ không phải tính từ lúc bắt đầu câu lệnh hiện tại bên trong transaction. Do đó, các lệnh `SELECT` liên tiếp trong cùng một transaction nhìn thấy cùng một dữ liệu, tức là chúng không thấy các thay đổi do transaction khác thực hiện và commit sau khi transaction của chính chúng bắt đầu.
>
> Các ứng dụng dùng mức này phải sẵn sàng thử lại (retry) transaction do serialization failure."

📖 **Nguyên văn (thông báo lỗi gốc)**
```
ERROR:  could not serialize access due to concurrent update
```

🇻🇳 Lỗi PostgreSQL trả về khi một transaction Repeatable Read cố sửa/khoá một dòng đã bị transaction khác thay đổi và commit sau khi nó bắt đầu.

📖 **Nguyên văn**
> "because a repeatable read transaction cannot modify or lock rows changed by other transactions after the repeatable read transaction began.
>
> When an application receives this error message, it should abort the current transaction and retry the whole transaction from the beginning. The second time through, the transaction will see the previously-committed change as part of its initial view of the database, so there is no logical conflict in using the new version of the row as the starting point for the new transaction's update.
>
> Note that only updating transactions might need to be retried; read-only transactions will never have serialization conflicts."

🇻🇳 **Dịch**
> "bởi vì một transaction repeatable read không thể sửa hay khoá những dòng đã bị các transaction khác thay đổi sau khi transaction repeatable read đó bắt đầu.
>
> Khi ứng dụng nhận được thông báo lỗi này, nó nên huỷ transaction hiện tại và thử lại toàn bộ transaction từ đầu. Ở lần chạy thứ hai, transaction sẽ thấy thay đổi đã commit trước đó như một phần của góc nhìn ban đầu về database, nên không còn xung đột logic khi dùng phiên bản mới của dòng làm điểm xuất phát cho update của transaction mới.
>
> Lưu ý rằng chỉ những transaction có ghi mới cần thử lại; các transaction chỉ đọc sẽ không bao giờ gặp serialization conflict."

📖 **Nguyên văn**
> "The Repeatable Read isolation level is implemented using a technique known in academic database literature and in some other database products as Snapshot Isolation."

🇻🇳 **Dịch**
> "Mức isolation Repeatable Read được hiện thực bằng một kỹ thuật được biết đến trong tài liệu học thuật về database và trong một số sản phẩm database khác với tên gọi Snapshot Isolation."

> [!note] Lịch sử
> 📖 **Nguyên văn**
> > "Prior to PostgreSQL version 9.1, a request for the Serializable transaction isolation level provided exactly the same behavior described here. To retain the legacy Serializable behavior, Repeatable Read should now be requested."
>
> 🇻🇳 **Dịch**
> > "Trước phiên bản PostgreSQL 9.1, một yêu cầu mức transaction isolation Serializable cho ra đúng hành vi được mô tả ở đây. Để giữ hành vi Serializable kiểu cũ, giờ nên yêu cầu Repeatable Read."

---

## 12. Serializable Isolation Level

📖 **Nguyên văn**
> "The Serializable isolation level provides the strictest transaction isolation. This level emulates serial transaction execution for all committed transactions; as if transactions had been executed one after another, serially, rather than concurrently. However, like the Repeatable Read level, applications using this level must be prepared to retry transactions due to serialization failures. In fact, this isolation level works exactly the same as Repeatable Read except that it also monitors for conditions which could make execution of a concurrent set of serializable transactions behave in a manner inconsistent with all possible serial (one at a time) executions of those transactions. This monitoring does not introduce any blocking beyond that present in repeatable read, but there is some overhead to the monitoring, and detection of the conditions which could cause a serialization anomaly will trigger a serialization failure."

🇻🇳 **Dịch**
> "Mức isolation Serializable cung cấp transaction isolation nghiêm ngặt nhất. Mức này mô phỏng việc thực thi transaction tuần tự cho tất cả transaction đã commit; như thể các transaction được thực thi lần lượt cái này sau cái kia, theo trình tự, chứ không phải đồng thời. Tuy nhiên, giống như mức Repeatable Read, các ứng dụng dùng mức này phải sẵn sàng thử lại transaction do serialization failure. Thực tế, mức isolation này hoạt động y hệt Repeatable Read, chỉ khác là nó còn giám sát những điều kiện có thể khiến việc thực thi một tập transaction serializable chạy song song hành xử theo cách không nhất quán với mọi thứ tự tuần tự (từng cái một) khả dĩ của các transaction đó. Việc giám sát này không tạo thêm blocking nào ngoài những gì đã có ở repeatable read, nhưng có một chút overhead cho việc giám sát, và việc phát hiện các điều kiện có thể gây serialization anomaly sẽ kích hoạt một serialization failure."

### Ví dụ serialization anomaly trong tài liệu

📖 **Nguyên văn**
> "As an example, consider a table `mytab`, initially containing:"

🇻🇳 **Dịch**
> "Ví dụ, hãy xét một bảng `mytab`, ban đầu chứa:"

📖 **Nguyên văn (dữ liệu gốc)**
```
 class | value
-------+-------
     1 |    10
     1 |    20
     2 |   100
     2 |   200
```

🇻🇳 Bảng `mytab` có hai cột `class` và `value`; class 1 có tổng 30, class 2 có tổng 300.

📖 **Nguyên văn**
> "Suppose that serializable transaction A computes:"

🇻🇳 **Dịch**
> "Giả sử transaction serializable A tính:"

📖 **Nguyên văn (SQL gốc)**
```sql
SELECT SUM(value) FROM mytab WHERE class = 1;
```

🇻🇳 Tính tổng cột `value` của các dòng có `class = 1` → ra 30.

📖 **Nguyên văn**
> "and then inserts the result (30) as the value in a new row with `class = 2`. Concurrently, serializable transaction B computes:"

🇻🇳 **Dịch**
> "rồi chèn kết quả (30) làm value trong một dòng mới với `class = 2`. Đồng thời, transaction serializable B tính:"

📖 **Nguyên văn (SQL gốc)**
```sql
SELECT SUM(value) FROM mytab WHERE class = 2;
```

🇻🇳 Tính tổng cột `value` của các dòng có `class = 2` → ra 300.

📖 **Nguyên văn**
> "and obtains the result 300, which it inserts in a new row with `class = 1`. Then both transactions try to commit. If either transaction were running at the Repeatable Read isolation level, both would be allowed to commit; but since there is no serial order of execution consistent with the result, using Serializable transactions will allow one transaction to commit and will roll the other back with this message:"

🇻🇳 **Dịch**
> "và thu được kết quả 300, rồi chèn nó vào một dòng mới với `class = 1`. Sau đó cả hai transaction cùng cố commit. Nếu một trong hai transaction chạy ở mức isolation Repeatable Read, cả hai sẽ đều được phép commit; nhưng vì không tồn tại thứ tự thực thi tuần tự nào nhất quán với kết quả này, dùng transaction Serializable sẽ cho phép một transaction commit và rollback cái còn lại với thông báo:"

📖 **Nguyên văn (thông báo lỗi gốc)**
```
ERROR:  could not serialize access due to read/write dependencies among transactions
```

🇻🇳 Lỗi báo phát hiện phụ thuộc đọc/ghi chéo giữa các transaction, tức là một serialization anomaly.

📖 **Nguyên văn**
> "This is because if A had executed before B, B would have computed the sum 330, not 300, and similarly the other order would have resulted in a different sum computed by A."

🇻🇳 **Dịch**
> "Đó là vì nếu A chạy trước B, thì B lẽ ra đã tính ra tổng 330 chứ không phải 300, và tương tự thứ tự ngược lại sẽ cho ra một tổng khác do A tính."

📖 **Nguyên văn**
> "To guarantee true serializability PostgreSQL uses *predicate locking*, which means that it keeps locks which allow it to determine when a write would have had an impact on the result of a previous read from a concurrent transaction, had it run first. In PostgreSQL these locks do not cause any blocking and therefore can *not* play any part in causing a deadlock."

🇻🇳 **Dịch**
> "Để đảm bảo tính serializable thật sự, PostgreSQL dùng *predicate locking*, nghĩa là nó giữ các khoá cho phép nó xác định khi nào một thao tác ghi lẽ ra đã tác động tới kết quả của một lần đọc trước đó từ một transaction chạy song song, giả sử thao tác ghi ấy chạy trước. Trong PostgreSQL, các khoá này **không gây blocking** và do đó **không** thể đóng vai trò nào trong việc gây ra deadlock."

📖 **Nguyên văn**
> "When relying on Serializable transactions to prevent anomalies, it is important that any data read from a permanent user table not be considered valid until the transaction which read it has successfully committed."

🇻🇳 **Dịch**
> "Khi dựa vào transaction Serializable để ngăn các dị thường, điều quan trọng là mọi dữ liệu đọc từ một bảng người dùng lâu dài đều không được coi là hợp lệ cho tới khi transaction đã đọc nó commit thành công."

---

## 13. Explicit Locking — khi MVCC chưa đủ

📖 **Nguyên văn**
> "PostgreSQL provides various lock modes to control concurrent access to data in tables. These modes can be used for application-controlled locking in situations where MVCC does not give the desired behavior. Also, most PostgreSQL commands automatically acquire locks of appropriate modes to ensure that referenced tables are not dropped or modified in incompatible ways while the command executes. (For example, `TRUNCATE` cannot safely be executed concurrently with other operations on the same table, so it obtains an `ACCESS EXCLUSIVE` lock on the table to enforce that.)"

🇻🇳 **Dịch**
> "PostgreSQL cung cấp nhiều chế độ khoá (lock mode) khác nhau để kiểm soát truy cập đồng thời vào dữ liệu trong các bảng. Các chế độ này có thể dùng cho việc khoá do ứng dụng tự điều khiển, trong những tình huống mà MVCC không cho ra hành vi mong muốn. Ngoài ra, hầu hết các lệnh PostgreSQL tự động giành khoá ở chế độ thích hợp để đảm bảo các bảng được tham chiếu không bị drop hay sửa đổi theo cách không tương thích trong lúc lệnh đang thực thi. (Ví dụ, `TRUNCATE` không thể được thực thi an toàn đồng thời với các thao tác khác trên cùng bảng, nên nó giành một khoá `ACCESS EXCLUSIVE` trên bảng đó để cưỡng chế điều này.)"

📖 **Nguyên văn**
> "Remember that all of these lock modes are table-level locks, even if the name contains the word “row”; the names of the lock modes are historical. [...] Two transactions cannot hold locks of conflicting modes on the same table at the same time. (However, a transaction never conflicts with itself. [...]) Non-conflicting lock modes can be held concurrently by many transactions."

🇻🇳 **Dịch**
> "Hãy nhớ rằng tất cả các lock mode này đều là khoá ở mức bảng (table-level lock), ngay cả khi tên của chúng có chứa từ “row”; tên các lock mode là do lịch sử để lại. [...] Hai transaction không thể cùng giữ các khoá ở chế độ xung đột nhau trên cùng một bảng tại cùng một thời điểm. (Tuy nhiên, một transaction không bao giờ xung đột với chính nó. [...]) Các lock mode không xung đột thì có thể được nhiều transaction giữ đồng thời."

---

## 14. Caveats — những chỗ MVCC không bảo vệ

📖 **Nguyên văn**
> "Some DDL commands, currently only `TRUNCATE` and the table-rewriting forms of `ALTER TABLE`, are not MVCC-safe. This means that after the truncation or rewrite commits, the table will appear empty to concurrent transactions, if they are using a snapshot taken before the DDL command committed. This will only be an issue for a transaction that did not access the table in question before the DDL command started — any transaction that has done so would hold at least an `ACCESS SHARE` table lock, which would block the DDL command until that transaction completes."

🇻🇳 **Dịch**
> "Một số lệnh DDL, hiện tại chỉ có `TRUNCATE` và các dạng `ALTER TABLE` phải viết lại bảng, là **không MVCC-safe**. Điều này nghĩa là sau khi lệnh truncate hoặc rewrite commit, bảng sẽ trông như rỗng đối với các transaction chạy song song, nếu chúng đang dùng một snapshot được lấy trước khi lệnh DDL commit. Việc này chỉ là vấn đề với transaction chưa hề truy cập bảng đó trước khi lệnh DDL bắt đầu — bất kỳ transaction nào đã truy cập rồi thì sẽ giữ ít nhất một khoá bảng `ACCESS SHARE`, và khoá này sẽ chặn lệnh DDL cho tới khi transaction đó hoàn tất."

📖 **Nguyên văn**
> "Support for the Serializable transaction isolation level has not yet been added to hot standby replication targets. The strictest isolation level currently supported in hot standby mode is Repeatable Read. While performing all permanent database writes within Serializable transactions on the primary will ensure that all standbys will eventually reach a consistent state, a Repeatable Read transaction run on the standby can sometimes see a transient state that is inconsistent with any serial execution of the transactions on the primary."

🇻🇳 **Dịch**
> "Hỗ trợ cho mức transaction isolation Serializable vẫn chưa được thêm vào các đích replication hot standby. Mức isolation nghiêm ngặt nhất hiện được hỗ trợ ở chế độ hot standby là Repeatable Read. Dù việc thực hiện mọi thao tác ghi lâu dài bên trong các transaction Serializable trên máy primary sẽ đảm bảo rằng mọi standby cuối cùng đều đạt tới trạng thái nhất quán, một transaction Repeatable Read chạy trên standby đôi khi vẫn có thể nhìn thấy một trạng thái tạm thời không nhất quán với bất kỳ thứ tự thực thi tuần tự nào của các transaction trên primary."

📖 **Nguyên văn**
> "Internal access to the system catalogs is not done using the isolation level of the current transaction. This means that newly created database objects such as tables are visible to concurrent Repeatable Read and Serializable transactions, even though the rows they contain are not. In contrast, queries that explicitly examine the system catalogs don't see rows representing concurrently created database objects, in the higher isolation levels."

🇻🇳 **Dịch**
> "Việc truy cập nội bộ vào system catalog không dùng mức isolation của transaction hiện tại. Điều này nghĩa là các đối tượng database mới tạo như bảng thì *nhìn thấy được* bởi các transaction Repeatable Read và Serializable chạy song song, mặc dù các dòng dữ liệu bên trong chúng thì không. Ngược lại, các truy vấn xem xét system catalog một cách tường minh thì *không* thấy các dòng đại diện cho những đối tượng database được tạo đồng thời, ở các mức isolation cao hơn."

---

## 15. Chọn mức isolation nào?

| Tình huống | Mức nên dùng | Vì sao (theo tài liệu) |
|---|---|---|
| CRUD đơn giản, mỗi lệnh chỉ đụng dòng đã xác định trước | Read Committed (mặc định) | *"this mode is fast and simple to use"*, *"it is just right for simpler cases"* |
| Báo cáo / tính tổng cần góc nhìn ổn định suốt transaction | Repeatable Read | *"provides a rigorous guarantee that each transaction sees a completely stable view of the database"* |
| Ràng buộc nghiệp vụ phức tạp, cần đúng như chạy tuần tự | Serializable | *"This level emulates serial transaction execution for all committed transactions"* |

> [!warning] Repeatable Read và Serializable đều cần retry
> Tài liệu nhắc ở cả hai mục: *"Applications using this level must be prepared to retry transactions due to serialization failures."*
> Code ứng dụng phải bắt lỗi serialization và chạy lại **toàn bộ** transaction từ đầu, không phải chỉ chạy lại câu lệnh bị lỗi.

---

## Liên kết
- Bài trước: [[04 - Indexes]]
- Bài kế: [[06 - Database Migrations]]

## Nguồn tham khảo
- PostgreSQL Documentation — 3.4. Transactions : https://www.postgresql.org/docs/current/tutorial-transactions.html
- PostgreSQL Documentation — 13.1. Introduction (MVCC) : https://www.postgresql.org/docs/current/mvcc-intro.html
- PostgreSQL Documentation — 13.2. Transaction Isolation : https://www.postgresql.org/docs/current/transaction-iso.html
- PostgreSQL Documentation — 13.6. Caveats : https://www.postgresql.org/docs/current/mvcc-caveats.html
- PostgreSQL Documentation — 13.3. Explicit Locking : https://www.postgresql.org/docs/current/explicit-locking.html
- PostgreSQL Documentation — BEGIN : https://www.postgresql.org/docs/current/sql-begin.html
- PostgreSQL Documentation — SAVEPOINT : https://www.postgresql.org/docs/current/sql-savepoint.html
