# 09 — Transactions

> Chapter 5, Section 5.9 — Core Java Volume II: Advanced Features, 11th Edition (Horstmann), Java 11.
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 5.9. Transactions

> *"You can group a set of statements to form a transaction. The transaction can be committed when all has gone well—or, if an error has occurred in one of them, it can be rolled back as if none of the statements had been issued."*

**Dịch:** Bạn **gom một tập statement lại thành một transaction**. Transaction đó **được commit khi mọi thứ suôn sẻ** — hoặc, nếu một trong số chúng gặp lỗi, nó **được rollback như thể chưa statement nào từng được phát ra**.

> *"The major reason for grouping statements into transactions is database integrity. For example, suppose we want to transfer money from one bank account to another. Then, it is important that we simultaneously debit one account and credit another. If the system fails after debiting the first account but before crediting the other account, the debit needs to be undone."*

**Dịch:** **Lý do chính** để gom statement thành transaction là **tính toàn vẹn của database (database integrity)**. Ví dụ ta muốn **chuyển tiền từ tài khoản ngân hàng này sang tài khoản khác**: điều quan trọng là **trừ tiền tài khoản này và cộng tiền tài khoản kia phải diễn ra đồng thời**. Nếu **hệ thống hỏng sau khi đã trừ tài khoản thứ nhất nhưng trước khi cộng cho tài khoản kia**, thì **việc trừ tiền phải được huỷ bỏ**.

> *"If you group update statements into a transaction, the transaction either succeeds in its entirety and can be committed, or it fails somewhere in the middle. In that case, you can carry out a rollback and the database automatically undoes the effect of all updates that occurred since the last committed transaction."*

**Dịch:** Nếu gom các câu lệnh update thành một transaction, thì **hoặc transaction thành công trọn vẹn và được commit**, **hoặc nó hỏng ở đâu đó giữa chừng**. Trong trường hợp sau, bạn **tiến hành rollback** và database **tự động huỷ tác dụng của mọi update xảy ra kể từ transaction được commit lần cuối**.

---

## 5.9.1. Programming Transactions with JDBC

> *"By default, a database connection is in autocommit mode, and each SQL statement is committed to the database as soon as it is executed. Once a statement is committed, you cannot roll it back. Turn off this default so you can use transactions:"*

```java
conn.setAutoCommit(false);
```

**Dịch:** **Mặc định, database connection ở chế độ autocommit**, và **mỗi câu lệnh SQL được commit vào database ngay khi nó chạy xong**. **Một khi đã commit thì không rollback được nữa.** Hãy **tắt mặc định này** để dùng được transaction.

> *"Create a statement object in the normal way:"*

```java
Statement stat = conn.createStatement();
```

> *"Call executeUpdate any number of times:"*

```java
stat.executeUpdate(command1);
stat.executeUpdate(command2);
stat.executeUpdate(command3);
. . .
```

> *"If all statements have been executed without error, call the commit method:"*

```java
conn.commit();
```

> *"However, if an error occurred, call"*

```java
conn.rollback();
```

> *"Then, all statements since the last commit are automatically reversed. You typically issue a rollback when your transaction was interrupted by a SQLException."*

**Dịch:** Tạo statement object như bình thường, gọi `executeUpdate` **bao nhiêu lần tuỳ ý**. **Nếu mọi statement chạy không lỗi thì gọi `commit`.** Còn **nếu có lỗi thì gọi `rollback`** — khi đó **mọi statement kể từ lần commit cuối bị đảo ngược tự động**. Bạn **thường phát rollback khi transaction bị gián đoạn bởi một `SQLException`** (xem [[04 - Working with JDBC Statements#5.4.3. Analyzing SQL Exceptions]]).

```
  setAutoCommit(false)
        │
        ├── executeUpdate(command1)
        ├── executeUpdate(command2)
        ├── executeUpdate(command3)
        │
        ├── mọi thứ OK  ──► commit()    : ghi nhận tất cả
        └── có lỗi      ──► rollback()  : đảo ngược tất cả
```

---

## 5.9.2. Save Points

> *"With some databases and drivers, you can gain finer-grained control over the rollback process by using save points. Creating a save point marks a point to which you can later return without having to abandon the entire transaction. For example,"*

```java
Statement stat = conn.createStatement(); // start transaction; rollback() goes here
stat.executeUpdate(command1);
Savepoint svpt = conn.setSavepoint(); // set savepoint; rollback(svpt) goes here
stat.executeUpdate(command2);
if (. . .) conn.rollback(svpt); // undo effect of command2
. . .
conn.commit();
```

**Dịch:** Với **một số database và driver**, bạn **kiểm soát quá trình rollback ở mức tinh hơn** bằng **save point**. Tạo một save point là **đánh dấu một điểm mà sau này bạn quay về được, mà không phải bỏ cả transaction**.

> *"When you no longer need a save point, you should release it:"*

```java
conn.releaseSavepoint(svpt);
```

**Dịch:** Khi **không còn cần một save point** nữa, bạn **nên release nó**.

---

## 5.9.3. Batch Updates

> *"Suppose a program needs to execute many INSERT statements to populate a database table. You can improve the performance of the program by using a batch update. In a batch update, a sequence of statements is collected and submitted as a batch."*

**Dịch:** Giả sử một chương trình cần chạy **rất nhiều câu `INSERT`** để nạp dữ liệu vào một table. Bạn **cải thiện được hiệu năng bằng batch update**. Trong batch update, **một dãy statement được gom lại và gửi đi thành một batch**.

> **Note (sách):** *"Use the supportsBatchUpdates method of the DatabaseMetaData interface to find out if your database supports this feature."*
>
> **Dịch:** Dùng method **`supportsBatchUpdates`** của interface `DatabaseMetaData` để **biết database của bạn có hỗ trợ tính năng này không**.

> *"The statements in a batch can be actions such as INSERT, UPDATE, or DELETE as well as data definition statements such as CREATE TABLE or DROP TABLE. An exception is thrown if you add a SELECT statement to a batch. (Conceptually, a SELECT statement makes no sense in a batch because it returns a result set without updating the database.)"*

**Dịch:** Statement trong một batch có thể là **`INSERT`, `UPDATE`, `DELETE`**, cũng như câu lệnh định nghĩa dữ liệu như **`CREATE TABLE`, `DROP TABLE`**. **Một exception được ném ra nếu bạn thêm câu `SELECT` vào batch.** (Về mặt khái niệm, `SELECT` **vô nghĩa trong một batch** vì nó **trả về result set mà không cập nhật database**.)

> *"To execute a batch, first create a Statement object in the usual way:"*

```java
Statement stat = conn.createStatement();
```

> *"Now, instead of calling executeUpdate, call the addBatch method:"*

```java
String command = "CREATE TABLE . . ."
stat.addBatch(command);
while (. . .)
{
    command = "INSERT INTO . . . VALUES (" + . . . + ")";
    stat.addBatch(command);
}
```

> *"Finally, submit the entire batch:"*

```java
int[] counts = stat.executeBatch();
```

> *"The call to executeBatch returns an array of the row counts for all submitted statements."*

**Dịch:** Để chạy một batch, trước hết tạo `Statement` object như thường lệ. Sau đó, **thay vì gọi `executeUpdate`, hãy gọi `addBatch`**. Cuối cùng **gửi toàn bộ batch** bằng `executeBatch`, lời gọi này **trả về một array chứa row count cho mọi statement đã gửi**.

> *"For proper error handling in batch mode, treat the batch execution as a single transaction. If a batch fails in the middle, you want to roll back to the state before the beginning of the batch."*

**Dịch:** Để **xử lý lỗi cho đúng** ở chế độ batch, hãy **coi việc chạy batch như MỘT transaction duy nhất**. Nếu batch hỏng giữa chừng, bạn muốn **rollback về trạng thái trước khi batch bắt đầu**.

> *"First, turn the autocommit mode off, then collect the batch, execute it, commit it, and finally restore the original autocommit mode:"*

```java
boolean autoCommit = conn.getAutoCommit();
conn.setAutoCommit(false);
Statement stat = conn.getStatement();
. . .
// keep calling stat.addBatch(. . .);
. . .
stat.executeBatch();
conn.commit();
conn.setAutoCommit(autoCommit);
```

**Dịch:** Trước hết **tắt autocommit**, rồi **gom batch, chạy nó, commit nó**, và cuối cùng **khôi phục lại chế độ autocommit ban đầu**.

### API — `java.sql.Connection` 1.1

| Method | Mô tả |
|---|---|
| `boolean getAutoCommit()`<br>`void setAutoCommit(boolean b)` | Lấy hoặc đặt **autocommit mode** của connection này. Nếu autocommit là `true`, **mọi statement được commit ngay khi chạy xong** |
| `void commit()` | **Commit mọi statement** đã phát kể từ lần commit cuối |
| `void rollback()` | **Đảo ngược tác dụng của mọi statement** đã phát kể từ lần commit cuối |
| `Savepoint setSavepoint()` **1.4**<br>`Savepoint setSavepoint(String name)` **1.4** | Đặt một **save point không tên hoặc có tên** |
| `void rollback(Savepoint svpt)` **1.4** | **Rollback về tới save point đã cho** |
| `void releaseSavepoint(Savepoint svpt)` **1.4** | **Release** save point đã cho |

### API — `java.sql.Savepoint` 1.4

| Method | Mô tả |
|---|---|
| `int getSavepointId()` | Lấy **ID** của save point **không tên** này, hoặc **ném `SQLException`** nếu đây là save point có tên |
| `String getSavepointName()` | Lấy **tên** của save point này, hoặc **ném `SQLException`** nếu đây là save point không tên |

### API — `java.sql.Statement` 1.1

| Method | Mô tả |
|---|---|
| `void addBatch(String command)` **1.2** | **Thêm lệnh vào batch lệnh hiện tại** của statement này |
| `int[] executeBatch()` **1.2**<br>`long[] executeLargeBatch()` **8** | **Chạy mọi lệnh trong batch hiện tại.** Mỗi giá trị trong array trả về ứng với một statement của batch: **không âm** thì đó là **row count**; nếu là **`SUCCESS_NO_INFO`** thì statement thành công **nhưng không có row count**; nếu là **`EXECUTE_FAILED`** thì **statement thất bại** |

### API — `java.sql.DatabaseMetaData` 1.1

| Method | Mô tả |
|---|---|
| `boolean supportsBatchUpdates()` **1.2** | Trả về `true` nếu **driver hỗ trợ batch update** |

---

## 5.9.4. Advanced SQL Types

> *"Table 5.8 lists the SQL data types supported by JDBC and their equivalents in the Java programming language."*

**Dịch:** Bảng 5.8 liệt kê **các kiểu dữ liệu SQL mà JDBC hỗ trợ** cùng **kiểu tương đương trong ngôn ngữ Java**.

### Table 5.8 — SQL Data Types and Their Corresponding Java Types

| SQL Data Type | Java Data Type |
|---|---|
| `INTEGER` hoặc `INT` | `int` |
| `SMALLINT` | `short` |
| `NUMERIC(m,n)`, `DECIMAL(m,n)` hoặc `DEC(m,n)` | `java.math.BigDecimal` |
| `FLOAT(n)` | `double` |
| `REAL` | `float` |
| `DOUBLE` | `double` |
| `CHARACTER(n)` hoặc `CHAR(n)` | `String` |
| `VARCHAR(n)`, `LONG VARCHAR` | `String` |
| `BOOLEAN` | `boolean` |
| `DATE` | `java.sql.Date` |
| `TIME` | `java.sql.Time` |
| `TIMESTAMP` | `java.sql.Timestamp` |
| `BLOB` | `java.sql.Blob` |
| `CLOB` | `java.sql.Clob` |
| `ARRAY` | `java.sql.Array` |
| `ROWID` | `java.sql.RowId` |
| `NCHAR(n)`, `NVARCHAR(n)`, `LONG NVARCHAR` | `String` |
| `NCLOB` | `java.sql.NClob` |
| `SQLXML` | `java.sql.SQLXML` |

> **Lưu ý về `FLOAT(n)` ↔ `double` và `REAL` ↔ `float`:** thứ tự này đúng như in trong sách — `FLOAT(n)` ánh xạ sang `double`, còn `REAL` ánh xạ sang `float`.

### ARRAY

> *"A SQL ARRAY is a sequence of values. For example, in a Student table, you can have a Scores column that is an ARRAY OF INTEGER. The getArray method returns an object of the interface type java.sql.Array. That interface has methods to fetch the array values."*

**Dịch:** **SQL `ARRAY` là một dãy giá trị.** Ví dụ trong table `Student`, bạn có thể có column `Scores` kiểu **`ARRAY OF INTEGER`**. Method **`getArray`** trả về một object thuộc interface **`java.sql.Array`**; interface đó **có method để lấy các giá trị của array**.

> *"When you get a LOB or an array from a database, the actual contents are fetched from the database only when you request individual values. This is a useful performance enhancement, as the data can be quite voluminous."*

**Dịch:** Khi bạn lấy một **LOB hoặc array** từ database, **nội dung thật chỉ được nạp về khi bạn yêu cầu từng giá trị cụ thể**. Đây là **cải thiện hiệu năng hữu ích**, vì **dữ liệu có thể rất đồ sộ**.

### ROWID

> *"Some databases support ROWID values that describe the location of a row so that it can be retrieved very rapidly. JDBC 4 introduced an interface java.sql.RowId and the methods to supply the row ID in queries and retrieve it from results."*

**Dịch:** Một số database hỗ trợ giá trị **`ROWID`** — **mô tả vị trí của một row** để **lấy về cực nhanh**. **JDBC 4** giới thiệu interface **`java.sql.RowId`** cùng các method để **đưa row ID vào query và lấy nó ra từ kết quả**.

### National character string

> *"A national character string (NCHAR and its variants) stores strings in a local character encoding and sorts them using a local sorting convention. JDBC 4 provided methods for converting between Java String objects and national character strings in queries and results."*

**Dịch:** **National character string** (`NCHAR` và các biến thể) **lưu string theo một character encoding bản địa** và **sắp xếp chúng theo quy ước sắp xếp bản địa**. **JDBC 4** cung cấp method để **chuyển đổi qua lại giữa `String` object của Java và national character string** trong query và kết quả. (Xem [[05 - Strings]].)

### Structured type và XML

> *"Some databases can store user-defined structured types. JDBC 3 provides a mechanism for automatically mapping structured SQL types to Java objects."*

**Dịch:** Một số database **lưu được structured type do người dùng định nghĩa**. **JDBC 3** cung cấp cơ chế **tự động ánh xạ kiểu SQL có cấu trúc sang object Java**.

> *"Some databases provide native storage for XML data. JDBC 4 introduced a SQLXML interface that can mediate between the internal XML representation and the DOM Source/Result interfaces, as well as binary streams. See the API documentation for the SQLXML class for details."*

**Dịch:** Một số database **lưu trữ dữ liệu XML một cách bản địa**. **JDBC 4** giới thiệu interface **`SQLXML`**, làm **trung gian giữa biểu diễn XML nội bộ với các interface `Source`/`Result` của DOM**, cũng như với **binary stream**.

> *"We do not discuss these advanced SQL types any further. You can find more information on these topics in the JDBC API Tutorial and Reference and the JDBC specification."*

**Dịch:** Sách **không bàn thêm về các kiểu SQL nâng cao này**. Thông tin chi tiết có trong *JDBC API Tutorial and Reference* và JDBC specification.

---

## Bài kế tiếp

→ [[10 - Connection Management in Web and Enterprise Applications]] — JNDI, `DataSource`, và connection pool.
