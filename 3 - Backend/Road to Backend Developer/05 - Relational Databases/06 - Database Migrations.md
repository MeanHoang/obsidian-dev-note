# 06 — Database Migrations

> **Nguồn chính:** roadmap.sh — Backend Roadmap, node "Database Migrations" — https://roadmap.sh/backend
> **Nguồn phụ:** PostgreSQL Documentation 18 — 5.7. Modifying Tables — https://www.postgresql.org/docs/current/ddl-alter.html
> **Nguồn phụ:** PostgreSQL Documentation 18 — ALTER TABLE — https://www.postgresql.org/docs/current/sql-altertable.html
> **Nguồn phụ:** Wikipedia — Schema migration — https://en.wikipedia.org/wiki/Schema_migration

> [!warning] Lưu ý về nguồn
> PostgreSQL Documentation **không có chương nào** về "database migration" theo nghĩa công cụ versioning schema.
> PostgreSQL chỉ mô tả các câu lệnh DDL (`ALTER TABLE`...) mà một migration thực chất gọi tới.
> Vì vậy bài này tách rõ:
> - **Phần khái niệm migration** → trích từ roadmap.sh node và Wikipedia (ghi rõ nguồn ở từng mục).
> - **Phần thao tác DDL** → trích nguyên văn PostgreSQL Documentation.
> - **Phần up/down migration** → là giải thích chung, KHÔNG trích được nguyên văn từ nguồn nào ở trên, đã ghi rõ.

---

## 1. Database Migration là gì

### 1.1. Định nghĩa theo roadmap.sh

📖 **Nguyên văn** — *roadmap.sh, node "Database Migrations"*
> "Database migrations are structured scripts that incrementally update a database schema to a new version. They provide a controlled and repeatable way to evolve the database structure as an application changes, ensuring data integrity and consistency across different environments. These scripts typically include instructions for creating, altering, or deleting tables, columns, indexes, and other database objects."

🇻🇳 **Dịch**
> "Database migrations là các script có cấu trúc, cập nhật schema của database lên một version mới theo từng bước tăng dần (incrementally). Chúng cung cấp một cách có kiểm soát và lặp lại được để tiến hoá cấu trúc database khi application thay đổi, đảm bảo tính toàn vẹn và nhất quán của dữ liệu qua các môi trường khác nhau. Các script này thường chứa các chỉ dẫn để tạo, thay đổi, hoặc xoá tables, columns, indexes, và các database object khác."

### 1.2. Định nghĩa theo Wikipedia

> [!note] Đây là nguồn do chính roadmap.sh đề xuất trong phần "Visit the following resources to learn more".

📖 **Nguyên văn** — *Wikipedia, Schema migration*
> "In software engineering, a schema migration (also database migration, database change management) refers to the management of version-controlled, incremental and sometimes reversible changes to relational database schemas. A schema migration is performed on a database whenever it is necessary to update or revert that database's schema to some newer or older version."

🇻🇳 **Dịch**
> "Trong software engineering, một schema migration (còn gọi là database migration, database change management) chỉ việc quản lý các thay đổi có version-control, tăng dần (incremental) và đôi khi đảo ngược được (reversible) đối với schema của relational database. Một schema migration được thực hiện trên database mỗi khi cần cập nhật hoặc quay ngược schema của database đó về một version mới hơn hoặc cũ hơn."

📖 **Nguyên văn** — *Wikipedia, Schema migration*
> "Migrations are performed programmatically by using a schema migration tool. When invoked with a specified desired schema version, the tool automates the successive application or reversal of an appropriate sequence of schema changes until it is brought to the desired state."

🇻🇳 **Dịch**
> "Các migration được thực hiện bằng chương trình thông qua một schema migration tool. Khi được gọi với một schema version đích cụ thể, tool tự động áp dụng hoặc đảo ngược lần lượt một chuỗi thay đổi schema thích hợp cho tới khi database được đưa về trạng thái mong muốn."

💡 **Ví dụ đời sống**
Hãy nghĩ tới một toà nhà đang được cải tạo. Bạn không đập toàn bộ toà nhà rồi xây lại mỗi khi cần thêm một phòng — bạn ký từng **giấy phép sửa chữa** theo thứ tự: phiếu số 1 "thêm phòng kho", phiếu số 2 "phá bức tường ngăn", phiếu số 3 "đổi cửa gỗ thành cửa kính". Mỗi phiếu ghi rõ làm gì, và nhiều phiếu ghi cả cách hoàn tác. Khi bạn cần dựng lại một toà nhà y hệt ở nơi khác (môi trường staging), bạn chỉ cần thi hành lại đúng chuỗi phiếu đó theo thứ tự. Migration chính là tập phiếu sửa chữa ấy cho database.

---

## 2. Vì sao cần migration

### 2.1. Vì database không thể "xoá đi làm lại"

📖 **Nguyên văn** — *PostgreSQL Documentation, 5.7. Modifying Tables*
> "When you create a table and you realize that you made a mistake, or the requirements of the application change, you can drop the table and create it again. But this is not a convenient option if the table is already filled with data, or if the table is referenced by other database objects (for instance a foreign key constraint). Therefore PostgreSQL provides a family of commands to make modifications to existing tables. Note that this is conceptually distinct from altering the data contained in the table: here we are interested in altering the definition, or structure, of the table."

🇻🇳 **Dịch**
> "Khi bạn tạo một table rồi nhận ra mình đã sai, hoặc yêu cầu của application thay đổi, bạn có thể drop table đó rồi tạo lại. Nhưng đây không phải lựa chọn tiện lợi nếu table đã chứa đầy dữ liệu, hoặc nếu table đang được các database object khác tham chiếu tới (ví dụ một foreign key constraint). Vì vậy PostgreSQL cung cấp một họ các lệnh để thực hiện thay đổi trên các table đang tồn tại. Lưu ý rằng điều này về mặt khái niệm khác với việc thay đổi dữ liệu chứa trong table: ở đây chúng ta quan tâm tới việc thay đổi định nghĩa, hay cấu trúc, của table."

Đây chính là lý do gốc rễ: schema thay đổi theo thời gian, nhưng **dữ liệu production thì không được mất**. Migration là cách ghi lại từng thay đổi cấu trúc đó dưới dạng script chạy được.

### 2.2. Vì có nhiều môi trường và nhiều developer

📖 **Nguyên văn** — *Wikipedia, Schema migration*
> "When developing software applications backed by a database, developers typically develop the application source code in tandem with an evolving database schema. The code typically has rigid expectations of what columns, tables and constraints are present in the database schema whenever it needs to interact with one, so only the version of database schema against which the code was developed is considered fully compatible with that version of source code."

🇻🇳 **Dịch**
> "Khi phát triển các ứng dụng có database phía sau, developer thường phát triển source code của application song song với một database schema đang tiến hoá. Code thường có kỳ vọng cứng nhắc về việc những column, table và constraint nào phải có mặt trong database schema mỗi khi nó cần tương tác, nên chỉ version của database schema mà code được phát triển dựa trên đó mới được coi là hoàn toàn tương thích với version source code ấy."

📖 **Nguyên văn** — *Wikipedia, Schema migration*
> "Under good software testing practice, schema migrations can be performed on test databases to ensure that their schema is compatible to the source code. To streamline this process, a schema migration tool is usually invoked as a part of an automated software build as a prerequisite of the automated testing phase."

🇻🇳 **Dịch**
> "Theo thực hành testing tốt, các schema migration có thể được chạy trên các test database để đảm bảo schema của chúng tương thích với source code. Để làm mượt quy trình này, một schema migration tool thường được gọi như một phần của quá trình build tự động, làm điều kiện tiên quyết cho giai đoạn testing tự động."

### 2.3. Migration đối với schema = version control đối với source code

📖 **Nguyên văn** — *Wikipedia, Schema migration*
> "Schema migration tools can be said to solve versioning problems for database schemas just as version control systems solve versioning problems for source code. In practice, many schema migration tools actually rely on a textual representation of schema changes (such as files containing SQL statements) such that the version history of schema changes can effectively be stored alongside program source code within VCS. This approach ensures that the information necessary to recover a compatible database schema for a particular code branch is recoverable from the source tree itself. Another benefit of this approach is the handling of concurrent conflicting schema changes; developers may simply use their usual text-based conflict resolution tools to reconcile differences."

🇻🇳 **Dịch**
> "Có thể nói các schema migration tool giải quyết vấn đề versioning cho database schema đúng như cách version control system giải quyết vấn đề versioning cho source code. Trên thực tế, nhiều schema migration tool dựa trên một biểu diễn dạng văn bản của các thay đổi schema (ví dụ các file chứa câu lệnh SQL), nhờ đó lịch sử version của các thay đổi schema có thể được lưu ngay cạnh source code của chương trình bên trong VCS. Cách tiếp cận này đảm bảo rằng thông tin cần thiết để khôi phục một database schema tương thích cho một code branch cụ thể là lấy lại được từ chính source tree. Một lợi ích khác của cách này là xử lý được các thay đổi schema xung đột đồng thời; developer chỉ cần dùng công cụ giải quyết conflict dạng text quen thuộc để hoà giải khác biệt."

💡 **Ví dụ đời sống — migration giống commit của Git cho cấu trúc database**
Ở [[02 - What is Git]] bạn đã học Git lưu **snapshot** của toàn bộ project tại từng thời điểm, và mỗi thay đổi được ghi thành một commit có thứ tự. Ở [[05 - Recording Changes to the Repository]] bạn đã học quy trình `add` → `commit`: gom thay đổi lại rồi đóng dấu thành một điểm mốc có message mô tả.

Migration làm đúng chuyện đó nhưng cho **cấu trúc database**:
- Mỗi file migration = một commit, có thứ tự, có mô tả ("thêm cột `loyalty_tier` vào bảng `customers`").
- Chạy migration lên = `git checkout` tới commit mới hơn.
- Rollback migration = quay lại commit cũ hơn.
- Vì migration là file text nằm trong repo, nó đi cùng branch với code — đúng như đoạn Wikipedia ở trên nói: "stored alongside program source code within VCS".

Khác biệt quan trọng: Git checkout ngược lại thì file trở về y nguyên, còn database thì **không** — dữ liệu đã mất do một migration xoá cột thì rollback không mang nó về. Xem mục 5.

---

## 3. Các thao tác DDL nền tảng mà một migration gọi tới

> [!note] Mục này trích nguyên văn từ PostgreSQL Documentation — đây là các lệnh SQL thật mà bên dưới lớp trừu tượng, mọi migration đều quy về.

📖 **Nguyên văn** — *PostgreSQL Documentation, 5.7. Modifying Tables*
> "You can:
> Add columns
> Remove columns
> Add constraints
> Remove constraints
> Change default values
> Change column data types
> Rename columns
> Rename tables
> All these actions are performed using the ALTER TABLE command, whose reference page contains details beyond those given here."

🇻🇳 **Dịch**
> "Bạn có thể:
> Thêm column
> Xoá column
> Thêm constraint
> Xoá constraint
> Đổi giá trị default
> Đổi kiểu dữ liệu của column
> Đổi tên column
> Đổi tên table
> Tất cả các thao tác này được thực hiện bằng lệnh ALTER TABLE, trang reference của nó chứa các chi tiết vượt ra ngoài những gì nêu ở đây."

### 3.1. Adding a Column

📖 **Nguyên văn**
> "To add a column, use a command like:"

🇻🇳 **Dịch**
> "Để thêm một column, dùng lệnh như sau:"

```sql
ALTER TABLE products ADD COLUMN description text;
```

🇻🇳 Thêm column `description` kiểu `text` vào table `products`.

📖 **Nguyên văn**
> "The new column is initially filled with whatever default value is given (null if you don't specify a DEFAULT clause)."

🇻🇳 **Dịch**
> "Column mới ban đầu được điền bằng giá trị default được cho (null nếu bạn không chỉ định mệnh đề DEFAULT)."

📖 **Nguyên văn** — *Tip trong tài liệu*
> "Adding a column with a constant default value does not require each row of the table to be updated when the ALTER TABLE statement is executed. Instead, the default value will be returned the next time the row is accessed, and applied when the table is rewritten, making the ALTER TABLE very fast even on large tables.
>
> If the default value is volatile (e.g., clock_timestamp()) each row will need to be updated with the value calculated at the time ALTER TABLE is executed. To avoid a potentially lengthy update operation, particularly if you intend to fill the column with mostly nondefault values anyway, it may be preferable to add the column with no default, insert the correct values using UPDATE, and then add any desired default as described below."

🇻🇳 **Dịch**
> "Thêm một column với giá trị default là hằng số KHÔNG đòi hỏi mỗi row của table phải được cập nhật khi câu lệnh ALTER TABLE chạy. Thay vào đó, giá trị default sẽ được trả về ở lần tiếp theo row được truy cập, và được áp dụng khi table được ghi lại (rewritten), khiến ALTER TABLE rất nhanh ngay cả trên các table lớn.
>
> Nếu giá trị default là volatile (ví dụ clock_timestamp()) thì mỗi row sẽ cần được cập nhật với giá trị tính tại thời điểm ALTER TABLE chạy. Để tránh một thao tác update có thể rất dài, đặc biệt nếu dù sao bạn cũng định điền vào column ấy phần lớn là các giá trị khác default, có lẽ nên thêm column không có default, chèn các giá trị đúng bằng UPDATE, rồi mới thêm default mong muốn như mô tả bên dưới."

📖 **Nguyên văn**
> "You can also define constraints on the column at the same time, using the usual syntax:"

🇻🇳 **Dịch**
> "Bạn cũng có thể định nghĩa constraint trên column ngay cùng lúc, dùng cú pháp thông thường:"

```sql
ALTER TABLE products ADD COLUMN description text CHECK (description <> '');
```

🇻🇳 Thêm column `description` kèm luôn ràng buộc `CHECK` là chuỗi không được rỗng.

📖 **Nguyên văn**
> "In fact all the options that can be applied to a column description in CREATE TABLE can be used here. Keep in mind however that the default value must satisfy the given constraints, or the ADD will fail. Alternatively, you can add constraints later (see below) after you've filled in the new column correctly."

🇻🇳 **Dịch**
> "Thực tế mọi tuỳ chọn có thể áp dụng cho phần mô tả column trong CREATE TABLE đều dùng được ở đây. Tuy nhiên hãy nhớ rằng giá trị default phải thoả mãn các constraint đã cho, nếu không lệnh ADD sẽ thất bại. Ngoài ra, bạn có thể thêm constraint sau (xem bên dưới) khi đã điền dữ liệu đúng vào column mới."

### 3.2. Removing a Column

📖 **Nguyên văn**
> "To remove a column, use a command like:"

🇻🇳 **Dịch**
> "Để xoá một column, dùng lệnh như sau:"

```sql
ALTER TABLE products DROP COLUMN description;
```

🇻🇳 Xoá hẳn column `description` khỏi table `products`.

📖 **Nguyên văn**
> "Whatever data was in the column disappears. Table constraints involving the column are dropped, too. However, if the column is referenced by a foreign key constraint of another table, PostgreSQL will not silently drop that constraint. You can authorize dropping everything that depends on the column by adding CASCADE:"

🇻🇳 **Dịch**
> "Bất kỳ dữ liệu nào đang nằm trong column đó đều biến mất. Các table constraint liên quan tới column ấy cũng bị drop theo. Tuy nhiên, nếu column được tham chiếu bởi một foreign key constraint của table khác, PostgreSQL sẽ không âm thầm drop constraint đó. Bạn có thể cho phép xoá mọi thứ phụ thuộc vào column ấy bằng cách thêm CASCADE:"

```sql
ALTER TABLE products DROP COLUMN description CASCADE;
```

🇻🇳 Xoá column và xoá luôn mọi object đang phụ thuộc vào nó.

### 3.3. Adding a Constraint

📖 **Nguyên văn**
> "To add a constraint, the table constraint syntax is used. For example:"

🇻🇳 **Dịch**
> "Để thêm một constraint, dùng cú pháp table constraint. Ví dụ:"

```sql
ALTER TABLE products ADD CHECK (name <> '');
ALTER TABLE products ADD CONSTRAINT some_name UNIQUE (product_no);
ALTER TABLE products ADD FOREIGN KEY (product_group_id) REFERENCES product_groups;
```

🇻🇳 Lần lượt: thêm ràng buộc `CHECK` tên rỗng bị cấm; thêm ràng buộc `UNIQUE` có đặt tên; thêm `FOREIGN KEY` trỏ sang table `product_groups`.

📖 **Nguyên văn**
> "To add a not-null constraint, which is normally not written as a table constraint, this special syntax is available:"

🇻🇳 **Dịch**
> "Để thêm một not-null constraint — thứ thường không được viết dưới dạng table constraint — có cú pháp đặc biệt sau:"

```sql
ALTER TABLE products ALTER COLUMN product_no SET NOT NULL;
```

🇻🇳 Bắt buộc column `product_no` không được chứa NULL.

📖 **Nguyên văn**
> "This command silently does nothing if the column already has a not-null constraint.
>
> The constraint will be checked immediately, so the table data must satisfy the constraint before it can be added."

🇻🇳 **Dịch**
> "Lệnh này âm thầm không làm gì cả nếu column đã có sẵn not-null constraint.
>
> Constraint sẽ được kiểm tra ngay lập tức, nên dữ liệu trong table phải thoả mãn constraint trước khi constraint đó có thể được thêm vào."

> [!danger] Đây là cái bẫy migration kinh điển
> Câu cuối là mấu chốt: "the table data must satisfy the constraint before it can be added". Nếu bảng production đã có rows với `product_no` là NULL, migration `SET NOT NULL` sẽ **fail giữa chừng**. Xem mục 5.

### 3.4. Removing a Constraint

📖 **Nguyên văn**
> "To remove a constraint you need to know its name. If you gave it a name then that's easy. Otherwise the system assigned a generated name, which you need to find out. The psql command \d tablename can be helpful here; other interfaces might also provide a way to inspect table details. Then the command is:"

🇻🇳 **Dịch**
> "Để xoá một constraint bạn cần biết tên của nó. Nếu bạn đã đặt tên thì dễ. Ngược lại, hệ thống đã gán một tên tự sinh, và bạn cần tìm ra tên đó. Lệnh psql `\d tablename` có thể hữu ích ở đây; các interface khác cũng có thể cung cấp cách xem chi tiết table. Sau đó lệnh là:"

```sql
ALTER TABLE products DROP CONSTRAINT some_name;
```

🇻🇳 Xoá constraint tên `some_name` khỏi table `products`.

📖 **Nguyên văn**
> "As with dropping a column, you need to add CASCADE if you want to drop a constraint that something else depends on. An example is that a foreign key constraint depends on a unique or primary key constraint on the referenced column(s).
>
> Simplified syntax is available to drop a not-null constraint:"

🇻🇳 **Dịch**
> "Giống như khi drop một column, bạn cần thêm CASCADE nếu muốn drop một constraint mà thứ khác đang phụ thuộc vào. Một ví dụ là foreign key constraint phụ thuộc vào unique hoặc primary key constraint trên (các) column được tham chiếu.
>
> Có cú pháp rút gọn để drop một not-null constraint:"

```sql
ALTER TABLE products ALTER COLUMN product_no DROP NOT NULL;
```

🇻🇳 Bỏ ràng buộc NOT NULL trên column `product_no`.

📖 **Nguyên văn**
> "This mirrors the SET NOT NULL syntax for adding a not-null constraint. This command will silently do nothing if the column does not have a not-null constraint. (Recall that a column can have at most one not-null constraint, so it is never ambiguous which constraint this command acts on.)"

🇻🇳 **Dịch**
> "Cú pháp này phản chiếu cú pháp SET NOT NULL dùng để thêm not-null constraint. Lệnh này sẽ âm thầm không làm gì nếu column không có not-null constraint. (Hãy nhớ rằng một column có nhiều nhất một not-null constraint, nên không bao giờ nhập nhằng về việc lệnh này tác động lên constraint nào.)"

### 3.5. Changing a Column's Default Value

📖 **Nguyên văn**
> "To set a new default for a column, use a command like:"

🇻🇳 **Dịch**
> "Để đặt một default mới cho column, dùng lệnh như sau:"

```sql
ALTER TABLE products ALTER COLUMN price SET DEFAULT 7.77;
```

🇻🇳 Đặt giá trị mặc định của column `price` thành `7.77`.

📖 **Nguyên văn**
> "Note that this doesn't affect any existing rows in the table, it just changes the default for future INSERT commands.
>
> To remove any default value, use:"

🇻🇳 **Dịch**
> "Lưu ý rằng điều này không ảnh hưởng tới bất kỳ row nào đang tồn tại trong table, nó chỉ thay đổi default cho các lệnh INSERT trong tương lai.
>
> Để bỏ giá trị default, dùng:"

```sql
ALTER TABLE products ALTER COLUMN price DROP DEFAULT;
```

🇻🇳 Bỏ giá trị mặc định của column `price`.

📖 **Nguyên văn**
> "This is effectively the same as setting the default to null. As a consequence, it is not an error to drop a default where one hadn't been defined, because the default is implicitly the null value."

🇻🇳 **Dịch**
> "Về bản chất điều này giống hệt việc đặt default là null. Hệ quả là, drop một default chưa từng được định nghĩa cũng không phải lỗi, vì default khi đó ngầm định là giá trị null."

### 3.6. Changing a Column's Data Type

📖 **Nguyên văn**
> "To convert a column to a different data type, use a command like:"

🇻🇳 **Dịch**
> "Để chuyển một column sang kiểu dữ liệu khác, dùng lệnh như sau:"

```sql
ALTER TABLE products ALTER COLUMN price TYPE numeric(10,2);
```

🇻🇳 Đổi kiểu dữ liệu của column `price` sang `numeric(10,2)`.

📖 **Nguyên văn**
> "This will succeed only if each existing entry in the column can be converted to the new type by an implicit cast. If a more complex conversion is needed, you can add a USING clause that specifies how to compute the new values from the old.
>
> PostgreSQL will attempt to convert the column's default value (if any) to the new type, as well as any constraints that involve the column. But these conversions might fail, or might produce surprising results. It's often best to drop any constraints on the column before altering its type, and then add back suitably modified constraints afterwards."

🇻🇳 **Dịch**
> "Lệnh này chỉ thành công nếu mọi giá trị đang tồn tại trong column có thể chuyển sang kiểu mới bằng một implicit cast. Nếu cần một phép chuyển đổi phức tạp hơn, bạn có thể thêm mệnh đề USING để chỉ định cách tính giá trị mới từ giá trị cũ.
>
> PostgreSQL sẽ cố gắng chuyển giá trị default của column (nếu có) sang kiểu mới, cũng như mọi constraint liên quan tới column đó. Nhưng các phép chuyển đổi này có thể thất bại, hoặc có thể tạo ra kết quả gây bất ngờ. Thường tốt nhất là drop mọi constraint trên column trước khi đổi kiểu, rồi thêm lại các constraint đã sửa cho phù hợp sau đó."

### 3.7. Renaming a Column

📖 **Nguyên văn**
> "To rename a column:"

🇻🇳 **Dịch**
> "Để đổi tên một column:"

```sql
ALTER TABLE products RENAME COLUMN product_no TO product_number;
```

🇻🇳 Đổi tên column `product_no` thành `product_number`.

### 3.8. Renaming a Table

📖 **Nguyên văn**
> "To rename a table:"

🇻🇳 **Dịch**
> "Để đổi tên một table:"

```sql
ALTER TABLE products RENAME TO items;
```

🇻🇳 Đổi tên table `products` thành `items`.

---

## 4. Up migration và down migration (rollback)

> [!note] Phần này là **giải thích khái niệm chung**, không trích được nguyên văn từ PostgreSQL Documentation hay Wikipedia.
> Wikipedia chỉ nói tới tính đảo ngược ở mức "sometimes reversible changes" và "update or revert that database's schema to some newer or older version" (đã trích ở mục 1.2). Cặp thuật ngữ **up / down** không xuất hiện trong các nguồn được dùng cho bài này, nên phần dưới đây trình bày theo cách hiểu chung trong ngành, không phải trích dẫn.

Ý tưởng: mỗi migration thường gồm hai nửa.

- **Up** — thao tác tiến tới version mới. Ví dụ: `ALTER TABLE products ADD COLUMN description text;`
- **Down** — thao tác đảo ngược, đưa schema trở lại version trước. Ví dụ nghịch đảo của lệnh trên: `ALTER TABLE products DROP COLUMN description;`

Nhìn lại bảng ở mục 3, hầu hết thao tác DDL của PostgreSQL đi theo cặp đối xứng — chính tài liệu PostgreSQL cũng trình bày chúng thành từng cặp:

| Up | Down |
|---|---|
| `ADD COLUMN` | `DROP COLUMN` |
| `ADD CONSTRAINT` | `DROP CONSTRAINT` |
| `ALTER COLUMN ... SET NOT NULL` | `ALTER COLUMN ... DROP NOT NULL` |
| `ALTER COLUMN ... SET DEFAULT` | `ALTER COLUMN ... DROP DEFAULT` |
| `RENAME COLUMN a TO b` | `RENAME COLUMN b TO a` |
| `RENAME TO items` | `RENAME TO products` |

> [!danger] Đối xứng về schema KHÔNG có nghĩa là đối xứng về dữ liệu
> `ADD COLUMN` rồi `DROP COLUMN` thì schema trở về như cũ, nhưng dữ liệu trong column đó đã mất vĩnh viễn. Tài liệu PostgreSQL nói thẳng ở mục 3.2: *"Whatever data was in the column disappears."*
> Tương tự, `ALTER COLUMN ... TYPE` từ `numeric(10,2)` về `integer` rồi đổi ngược lại sẽ không lấy lại được phần thập phân đã bị cắt.
> Vì vậy down migration là công cụ khôi phục **cấu trúc**, không phải công cụ khôi phục **dữ liệu**. Muốn khôi phục dữ liệu thì cần backup.

---

## 5. Cảnh báo thực tế: migration có thể phá dữ liệu và khoá bảng

### 5.1. Rủi ro khi chạy migration trên production

📖 **Nguyên văn** — *Wikipedia, Schema migration*
> "Applying a schema migration to a production database is always a risk. Development and test databases tend to be smaller and cleaner. The data in them is better understood, and if everything else fails, the amount of data is small enough for a human to process. Production databases are usually huge, old and full of surprises. The surprises can come from many sources:
>
> Corrupt data that was written by old versions of the software and not cleaned properly
> Implied dependencies in the data which no one knows about anymore
> People directly changing the database without using the designated tools
> Bugs in the schema migration tools
> Mistakes in assumptions how data should be migrated
>
> For these reasons, the migration process needs a high level of discipline, thorough testing and a sound backup strategy."

🇻🇳 **Dịch**
> "Áp dụng một schema migration lên database production luôn là một rủi ro. Database dev và test thường nhỏ hơn và sạch hơn. Dữ liệu trong đó được hiểu rõ hơn, và nếu mọi thứ hỏng hết thì lượng dữ liệu vẫn đủ nhỏ để một con người xử lý được. Database production thường khổng lồ, cũ kỹ và đầy bất ngờ. Những bất ngờ ấy có thể đến từ nhiều nguồn:
>
> Dữ liệu hỏng do các version phần mềm cũ ghi vào và không được dọn dẹp đúng cách
> Các phụ thuộc ngầm trong dữ liệu mà không ai còn biết nữa
> Người ta sửa trực tiếp database mà không dùng công cụ được quy định
> Bug trong chính các schema migration tool
> Sai lầm trong giả định về cách dữ liệu nên được migrate
>
> Vì những lý do này, quá trình migration cần mức độ kỷ luật cao, testing kỹ lưỡng và một chiến lược backup vững chắc."

📖 **Nguyên văn** — *Wikipedia, Schema migration*
> "Most schema migration tools aim to minimize the impact of schema changes on any existing data in the database. Despite this, preservation of data in general is not guaranteed because schema changes such as the deletion of a database column can destroy data (i.e. all values stored under that column for all rows in that table are deleted). Instead, the tools help to preserve the meaning of the data or to reorganize existing data to meet new requirements. Since meaning of the data often cannot be encoded, the configuration of the tools usually needs manual intervention."

🇻🇳 **Dịch**
> "Phần lớn schema migration tool nhắm tới việc giảm thiểu tác động của thay đổi schema lên dữ liệu đang có trong database. Dù vậy, nhìn chung việc bảo toàn dữ liệu là không được đảm bảo, bởi vì các thay đổi schema như xoá một column của database có thể phá huỷ dữ liệu (tức là mọi giá trị lưu dưới column đó của mọi row trong table ấy đều bị xoá). Thay vào đó, các tool giúp bảo toàn ý nghĩa của dữ liệu hoặc tổ chức lại dữ liệu hiện có để đáp ứng yêu cầu mới. Vì ý nghĩa của dữ liệu thường không thể mã hoá được, việc cấu hình các tool thường cần can thiệp thủ công."

### 5.2. Thêm NOT NULL / CHECK vào bảng đã có dữ liệu

📖 **Nguyên văn** — *PostgreSQL Documentation, ALTER TABLE, phần Notes*
> "Adding a CHECK or NOT NULL constraint requires scanning the table to verify that existing rows meet the constraint, but does not require a table rewrite. If a CHECK constraint is added as NOT ENFORCED, no verification will be performed."

🇻🇳 **Dịch**
> "Thêm một constraint CHECK hoặc NOT NULL đòi hỏi quét toàn bộ table để xác minh rằng các row đang tồn tại thoả mãn constraint, nhưng không đòi hỏi ghi lại (rewrite) table. Nếu một CHECK constraint được thêm với NOT ENFORCED, sẽ không có bước xác minh nào được thực hiện."

📖 **Nguyên văn** — *PostgreSQL Documentation, ALTER TABLE, phần Notes*
> "Scanning a large table to verify new foreign-key, check, or not-null constraints can take a long time, and other updates to the table are locked out until the ALTER TABLE ADD CONSTRAINT command is committed. The main purpose of the NOT VALID constraint option is to reduce the impact of adding a constraint on concurrent updates. With NOT VALID, the ADD CONSTRAINT command does not scan the table and can be committed immediately. After that, a VALIDATE CONSTRAINT command can be issued to verify that existing rows satisfy the constraint. The validation step does not need to lock out concurrent updates, since it knows that other transactions will be enforcing the constraint for rows that they insert or update; only pre-existing rows need to be checked. Hence, validation acquires only a SHARE UPDATE EXCLUSIVE lock on the table being altered."

🇻🇳 **Dịch**
> "Quét một table lớn để xác minh các constraint foreign-key, check, hay not-null mới có thể mất rất nhiều thời gian, và các update khác lên table đó bị khoá ra ngoài cho tới khi lệnh ALTER TABLE ADD CONSTRAINT được commit. Mục đích chính của tuỳ chọn constraint NOT VALID là giảm tác động của việc thêm constraint lên các update đồng thời. Với NOT VALID, lệnh ADD CONSTRAINT không quét table và có thể commit ngay lập tức. Sau đó, có thể chạy lệnh VALIDATE CONSTRAINT để xác minh rằng các row đang tồn tại thoả mãn constraint. Bước validation không cần khoá các update đồng thời ra ngoài, vì nó biết rằng các transaction khác sẽ tự thực thi constraint cho những row chúng insert hoặc update; chỉ các row có từ trước mới cần kiểm tra. Do đó, validation chỉ lấy một SHARE UPDATE EXCLUSIVE lock trên table đang bị thay đổi."

> [!danger] Migration thêm NOT NULL vào bảng production đang chạy
> Hai điều xảy ra cùng lúc:
> 1. **Có thể fail** — mục 3.3 của tài liệu: "the table data must satisfy the constraint before it can be added". Một row NULL duy nhất cũng đủ làm migration hỏng.
> 2. **Có thể khoá bảng lâu** — đoạn Notes vừa trích: quét bảng lớn "can take a long time, and other updates to the table are locked out".
>
> Trên bảng vài chục triệu row, đây là downtime thật sự, không phải lý thuyết.

### 5.3. Khoá bảng khi ALTER trên bảng lớn

📖 **Nguyên văn** — *PostgreSQL Documentation, ALTER TABLE, phần Description*
> "ALTER TABLE changes the definition of an existing table. There are several subforms described below. Note that the lock level required may differ for each subform. An ACCESS EXCLUSIVE lock is acquired unless explicitly noted. When multiple subcommands are given, the lock acquired will be the strictest one required by any subcommand."

🇻🇳 **Dịch**
> "ALTER TABLE thay đổi định nghĩa của một table đang tồn tại. Có nhiều dạng con (subform) được mô tả bên dưới. Lưu ý rằng mức lock cần thiết có thể khác nhau ở từng dạng con. Một ACCESS EXCLUSIVE lock sẽ được lấy trừ khi có ghi chú rõ ràng khác đi. Khi nhiều subcommand được đưa ra cùng lúc, lock được lấy sẽ là lock chặt nhất mà bất kỳ subcommand nào yêu cầu."

> [!warning] ACCESS EXCLUSIVE là mức lock chặt nhất
> Đây là mặc định của `ALTER TABLE`. Trong lúc giữ lock này, **mọi** truy cập khác vào table — kể cả `SELECT` — đều phải chờ. Nghĩa là một migration tưởng như vô hại cũng có thể làm treo toàn bộ request đang đọc bảng đó.

📖 **Nguyên văn** — *PostgreSQL Documentation, ALTER TABLE, phần Notes*
> "Changing the type of an existing column will normally cause the entire table and its indexes to be rewritten. As an exception, when changing the type of an existing column, if the USING clause does not change the column contents and the old type is either binary coercible to the new type or an unconstrained domain over the new type, a table rewrite is not needed. However, indexes will still be rebuilt unless the system can verify that the new index would be logically equivalent to the existing one. For example, if the collation for a column has been changed, an index rebuild is required because the new sort order might be different. However, in the absence of a collation change, a column can be changed from text to varchar (or vice versa) without rebuilding the indexes because these data types sort identically."

🇻🇳 **Dịch**
> "Đổi kiểu của một column đang tồn tại thông thường sẽ khiến toàn bộ table và các index của nó bị ghi lại (rewrite). Như một ngoại lệ, khi đổi kiểu của một column đang tồn tại, nếu mệnh đề USING không làm thay đổi nội dung column và kiểu cũ hoặc là binary coercible sang kiểu mới, hoặc là một domain không có constraint trên kiểu mới, thì không cần rewrite table. Tuy nhiên, các index vẫn sẽ bị build lại trừ khi hệ thống có thể xác minh rằng index mới sẽ tương đương về mặt logic với index hiện có. Ví dụ, nếu collation của một column đã bị đổi, cần build lại index vì thứ tự sắp xếp mới có thể khác đi. Tuy nhiên, khi không có thay đổi collation, một column có thể được đổi từ text sang varchar (hoặc ngược lại) mà không cần build lại index vì hai kiểu dữ liệu này sắp xếp giống hệt nhau."

📖 **Nguyên văn** — *PostgreSQL Documentation, ALTER TABLE, phần Notes*
> "The rewriting forms of ALTER TABLE are not MVCC-safe. After a table rewrite, the table will appear empty to concurrent transactions, if they are using a snapshot taken before the rewrite occurred."

🇻🇳 **Dịch**
> "Các dạng gây rewrite của ALTER TABLE là không an toàn với MVCC. Sau khi table bị rewrite, table sẽ trông như rỗng đối với các transaction đồng thời, nếu chúng đang dùng một snapshot được lấy trước khi việc rewrite xảy ra."

> [!danger] Đây là đoạn đáng sợ nhất của tài liệu
> Cùng một khái niệm MVCC bạn đã học ở [[05 - Transactions, ACID và MVCC]]: mỗi transaction đọc từ một snapshot. Nhưng `ALTER TABLE` dạng rewrite **phá vỡ** đảm bảo đó — transaction đang chạy song song có thể thấy bảng **rỗng**. Không phải dữ liệu cũ, không phải dữ liệu mới, mà là rỗng.
> Hệ quả thực tế: migration đổi kiểu dữ liệu trên bảng lớn không nên chạy khi có traffic, và không nên tin rằng MVCC sẽ che chắn cho bạn.

📖 **Nguyên văn** — *PostgreSQL Documentation, ALTER TABLE, phần Notes*
> "The main reason for providing the option to specify multiple changes in a single ALTER TABLE is that multiple table scans or rewrites can thereby be combined into a single pass over the table."

🇻🇳 **Dịch**
> "Lý do chính của việc cho phép chỉ định nhiều thay đổi trong một lệnh ALTER TABLE duy nhất là nhờ đó nhiều lần quét hoặc rewrite table có thể được gộp thành một lượt đi qua table duy nhất."

> [!tip] Gộp nhiều thay đổi vào một ALTER TABLE
> Nếu một migration cần đổi nhiều thứ trên cùng một bảng lớn, viết chúng trong **một** lệnh `ALTER TABLE` thay vì nhiều lệnh rời rạc — theo tài liệu, PostgreSQL sẽ gộp thành một lượt quét bảng duy nhất thay vì quét nhiều lần.

### 5.4. Có cách tránh khoá bảng lâu

📖 **Nguyên văn** — *PostgreSQL Documentation, ALTER TABLE*
> "Adding a constraint using an existing index can be helpful in situations where a new constraint needs to be added without blocking table updates for a long time. To do that, create the index using CREATE UNIQUE INDEX CONCURRENTLY, and then convert it to a constraint using this syntax. See the example below."

🇻🇳 **Dịch**
> "Thêm một constraint bằng cách dùng index có sẵn có thể hữu ích trong các tình huống cần thêm constraint mới mà không chặn các update lên table trong thời gian dài. Để làm việc đó, tạo index bằng CREATE UNIQUE INDEX CONCURRENTLY, rồi chuyển nó thành constraint bằng cú pháp này. Xem ví dụ bên dưới."

📖 **Nguyên văn** — *PostgreSQL Documentation, ALTER TABLE, phần Examples*
> "To recreate a primary key constraint, without blocking updates while the index is rebuilt:"

🇻🇳 **Dịch**
> "Để tạo lại một primary key constraint mà không chặn các update trong lúc index đang được build lại:"

```sql
CREATE UNIQUE INDEX CONCURRENTLY dist_id_temp_idx ON distributors (dist_id);
ALTER TABLE distributors DROP CONSTRAINT distributors_pkey,
    ADD CONSTRAINT distributors_pkey PRIMARY KEY USING INDEX dist_id_temp_idx;
```

🇻🇳 Build index unique ở chế độ `CONCURRENTLY` (không chặn ghi), rồi mới đổi primary key sang dùng index đã có sẵn — nhờ đó thời gian giữ lock rất ngắn.

📖 **Nguyên văn** — *PostgreSQL Documentation, ALTER TABLE, phần Notes*
> "Although most forms of ADD table_constraint require an ACCESS EXCLUSIVE lock, ADD FOREIGN KEY requires only a SHARE ROW EXCLUSIVE lock. Note that ADD FOREIGN KEY also acquires a SHARE ROW EXCLUSIVE lock on the referenced table, in addition to the lock on the table on which the constraint is declared."

🇻🇳 **Dịch**
> "Mặc dù hầu hết các dạng của ADD table_constraint đòi hỏi một ACCESS EXCLUSIVE lock, ADD FOREIGN KEY chỉ đòi hỏi một SHARE ROW EXCLUSIVE lock. Lưu ý rằng ADD FOREIGN KEY cũng lấy một SHARE ROW EXCLUSIVE lock trên table được tham chiếu, bên cạnh lock trên table mà constraint được khai báo."

---

## 6. Chiến lược migration không downtime

📖 **Nguyên văn** — *Wikipedia, Schema migration*
> "In the steady state, one version of an application only understands one version of a schema. So the most basic strategy is to shut down the application, execute the schema migration, and then start the newer version of the application. While simple, this strategy causes a downtime. Depending on the criticality of the system and its usage patterns, downtimes of various duration may be tolerated, but in some cases none may be tolerated at all. In those cases, one of the following zero-downtime strategies may be used."

🇻🇳 **Dịch**
> "Ở trạng thái ổn định, một version của application chỉ hiểu được một version của schema. Vì vậy chiến lược cơ bản nhất là tắt application, chạy schema migration, rồi khởi động version mới hơn của application. Tuy đơn giản, chiến lược này gây ra downtime. Tuỳ vào mức độ quan trọng của hệ thống và mô hình sử dụng của nó, downtime với độ dài khác nhau có thể chấp nhận được, nhưng trong một số trường hợp thì hoàn toàn không chấp nhận được chút nào. Trong các trường hợp đó, có thể dùng một trong các chiến lược zero-downtime sau."

📖 **Nguyên văn** — *Wikipedia, Schema migration — Dual writing*
> "These are the general steps of dual writing (also called double writing):
>
> Prepare the schema so that it can hold data in both the old and new formats. This might mean adding a new version of a column or a table, without affecting existing data.
> Deploy a new version of the application which writes data in both the old and new formats (hence the name dual writing). It's important to ensure consistency of these writes. After this point, all newly written data will exist in both old and new formats.
> Execute a backfill in the database: copy data from the old format to the new format that existed previously, and hasn't been updated recently, so it's not dual written yet. After this point, the database has a complete replica of the data in both the old and new formats.
> Deploy a new version of the application which switches to reading data in the new format, and stops dual writing. In distributed systems, it's important to switch the reading path before stopping dual writing, so this step may be divided into two.
> Remove the old format data from the schema."

🇻🇳 **Dịch**
> "Đây là các bước tổng quát của dual writing (còn gọi là double writing):
>
> Chuẩn bị schema sao cho nó chứa được dữ liệu ở cả định dạng cũ lẫn mới. Điều này có thể nghĩa là thêm một version mới của một column hoặc một table, mà không ảnh hưởng tới dữ liệu đang có.
> Deploy một version mới của application ghi dữ liệu ở cả định dạng cũ lẫn mới (từ đó có tên dual writing). Việc đảm bảo tính nhất quán của các lần ghi này là quan trọng. Sau thời điểm này, mọi dữ liệu mới ghi sẽ tồn tại ở cả hai định dạng cũ và mới.
> Chạy một đợt backfill trong database: copy dữ liệu từ định dạng cũ sang định dạng mới đối với phần dữ liệu đã có từ trước và chưa được cập nhật gần đây, tức phần chưa được dual write. Sau thời điểm này, database có một bản sao đầy đủ của dữ liệu ở cả hai định dạng.
> Deploy một version mới của application chuyển sang đọc dữ liệu ở định dạng mới, và dừng dual writing. Trong hệ thống phân tán, việc chuyển đường đọc trước khi dừng dual writing là quan trọng, nên bước này có thể được chia làm hai.
> Xoá dữ liệu định dạng cũ khỏi schema."

📖 **Nguyên văn** — *Wikipedia, Schema migration — Comparison*
> "All strategies above achieve a zero-downtime migration.
> Dual writing has the advantage that the old and new version of the data live side by side, so comparisons can be run between them to ensure consistency before committing to the new format. This, however, comes at the cost of doubling the storage requirements.
> With dual reading only one version of every piece of data exists at any point in time, so there's no increase in storage requirements.
> The combined approach allows doing the backfill in smaller batches so the storage increase can be controlled, but this comes at the cost of added complexity."

🇻🇳 **Dịch**
> "Tất cả các chiến lược ở trên đều đạt được migration không downtime.
> Dual writing có lợi thế là version cũ và mới của dữ liệu nằm cạnh nhau, nên có thể chạy so sánh giữa chúng để đảm bảo tính nhất quán trước khi chốt sang định dạng mới. Tuy nhiên, điều này phải trả giá bằng việc nhân đôi nhu cầu lưu trữ.
> Với dual reading, tại mỗi thời điểm chỉ tồn tại một version của mỗi mẩu dữ liệu, nên không làm tăng nhu cầu lưu trữ.
> Cách tiếp cận kết hợp cho phép chạy backfill theo các batch nhỏ hơn nên mức tăng lưu trữ kiểm soát được, nhưng phải trả giá bằng độ phức tạp tăng thêm."

---

## 7. Tóm tắt

- **Migration** = script có cấu trúc, có thứ tự, cập nhật schema từng bước — theo roadmap.sh và Wikipedia.
- Bên dưới, mọi migration đều quy về các lệnh **DDL** của PostgreSQL, chủ yếu là `ALTER TABLE` với 8 nhóm thao tác ở mục 3.
- Migration được lưu dạng file text trong repo nên nó **version theo branch giống hệt source code** — đây là lý do so sánh với Git commit là hợp lý.
- **Down migration khôi phục cấu trúc, không khôi phục dữ liệu.** Backup mới khôi phục dữ liệu.
- Ba cái bẫy lớn nhất trên production: constraint fail vì dữ liệu cũ không thoả, **ACCESS EXCLUSIVE lock** chặn cả `SELECT`, và table rewrite **không MVCC-safe**.

> [!note] Về tên các công cụ migration cụ thể
> Bài này cố ý **không** nêu tên hay cú pháp của bất kỳ migration tool cụ thể nào, vì không fetch được tài liệu chính thức của chúng. Wikipedia chỉ dùng thuật ngữ chung "schema migration tool". Khi cần dùng một tool cụ thể, hãy đọc tài liệu chính thức của tool đó.

---

## Liên kết
- Bài trước: [[05 - Transactions, ACID và MVCC]]
- Bài kế: [[07 - N+1 Problem]]
- Cross-link phần 03: [[02 - What is Git]] — snapshot và commit; [[05 - Recording Changes to the Repository]] — quy trình ghi lại thay đổi thành commit

## Nguồn tham khảo
- roadmap.sh — Backend Roadmap, node "Database Migrations" : https://roadmap.sh/backend
  (nội dung node lấy từ repo developer-roadmap: `roadmaps/backend/content/migrations@MOLAXgs0CMCT7o84L0EaK.md`)
- PostgreSQL Documentation 18 — 5.7. Modifying Tables : https://www.postgresql.org/docs/current/ddl-alter.html
- PostgreSQL Documentation 18 — ALTER TABLE : https://www.postgresql.org/docs/current/sql-altertable.html
- PostgreSQL Documentation 18 — CREATE TABLE : https://www.postgresql.org/docs/current/sql-createtable.html
- Wikipedia — Schema migration : https://en.wikipedia.org/wiki/Schema_migration
- Bài này không có hình minh hoạ vì các trang nguồn trên không chứa hình.
