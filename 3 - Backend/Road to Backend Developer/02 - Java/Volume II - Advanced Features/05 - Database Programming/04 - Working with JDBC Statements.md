# 04 — Working with JDBC Statements

> Chapter 5, Section 5.4 — Core Java Volume II: Advanced Features, 11th Edition (Horstmann), Java 11.
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 5.4. Working with JDBC Statements

> *"In the following sections, you will see how to use the JDBC Statement to execute SQL statements, obtain results, and deal with errors. Then we show you a simple program for populating a database."*

**Dịch:** Các phần sau chỉ cách dùng **`Statement` của JDBC** để **thực thi câu lệnh SQL, lấy kết quả và xử lý lỗi**. Sau đó là một chương trình đơn giản để **nạp dữ liệu vào database**.

---

## 5.4.1. Executing SQL Statements

> *"To execute a SQL statement, you first create a Statement object. To create statement objects, use the Connection object that you obtained from the call to DriverManager.getConnection."*

```java
Statement stat = conn.createStatement();
```

**Dịch:** Để thực thi một câu lệnh SQL, trước hết **tạo một `Statement` object**. Muốn tạo statement object thì **dùng `Connection` object** lấy được từ lời gọi `DriverManager.getConnection`.

> *"Next, place the statement that you want to execute into a string, for example:"*

```java
String command = "UPDATE Books"
    + " SET Price = Price - 5.00"
    + " WHERE Title NOT LIKE '%Introduction%'";
```

> *"Then, call the executeUpdate method of the Statement interface:"*

```java
stat.executeUpdate(command);
```

**Dịch:** Tiếp theo, **đặt câu lệnh muốn chạy vào một string**, rồi gọi method **`executeUpdate`** của interface `Statement`.

> *"The executeUpdate method returns a count of the rows that were affected by the SQL statement, or zero for statements that do not return a row count. For example, the call to executeUpdate in the preceding example returns the number of rows where the price was lowered by $5.00."*

**Dịch:** Method `executeUpdate` **trả về số row bị ảnh hưởng** bởi câu lệnh SQL, hoặc **0** với những câu lệnh không trả về row count. Ví dụ trên trả về **số row có giá bị giảm $5.00**.

> *"The executeUpdate method can execute actions such as INSERT, UPDATE, and DELETE, as well as data definition statements such as CREATE TABLE and DROP TABLE. However, you need to use the executeQuery method to execute SELECT queries. There is also a catch-all execute statement to execute arbitrary SQL statements. It's commonly used only for queries that a user supplies interactively."*

**Dịch:** `executeUpdate` chạy được **`INSERT`, `UPDATE`, `DELETE`** cũng như câu lệnh định nghĩa dữ liệu như **`CREATE TABLE`, `DROP TABLE`**. Nhưng để chạy query `SELECT` thì **phải dùng `executeQuery`**. Ngoài ra còn có method **`execute`** vơ đũa cả nắm, chạy được **câu lệnh SQL bất kỳ** — thường chỉ dùng cho **query do người dùng nhập tương tác**.

| Method | Dùng cho |
|---|---|
| `executeUpdate` | `INSERT`, `UPDATE`, `DELETE`, và DDL như `CREATE TABLE`, `DROP TABLE` |
| `executeQuery` | Query `SELECT` |
| `execute` | Câu lệnh SQL **bất kỳ** — thường chỉ cho query người dùng nhập tương tác |

> *"When you execute a query, you are interested in the result. The executeQuery object returns an object of type ResultSet that you can use to walk through the result one row at a time."*

```java
ResultSet rs = stat.executeQuery("SELECT * FROM Books");
```

> *"The basic loop for analyzing a result set looks like this:"*

```java
while (rs.next())
{
    look at a row of the result set
}
```

**Dịch:** Khi chạy query, cái bạn quan tâm là **kết quả**. `executeQuery` trả về một object kiểu **`ResultSet`**, dùng để **duyệt kết quả từng row một**.

> **Caution (sách):** *"The iteration protocol of the ResultSet interface is subtly different from that of the java.util.Iterator interface. Here, the iterator is initialized to a position before the first row. You must call the next method once to move the iterator to the first row. Also, there is no hasNext method; keep calling next until it returns false."*
>
> **Dịch:** Giao thức lặp của interface `ResultSet` **khác tinh tế** so với `java.util.Iterator` (xem [[03 - Concrete Collections]]). Ở đây iterator được khởi tạo ở **vị trí TRƯỚC row đầu tiên**. Bạn **phải gọi `next` một lần** để đưa iterator tới row đầu tiên. Ngoài ra **không có method `hasNext`**; cứ gọi `next` cho tới khi nó trả về `false`.

> *"The order of the rows in a result set is completely arbitrary. Unless you specifically ordered the result with an ORDER BY clause, you should not attach any significance to the row order."*

**Dịch:** **Thứ tự các row trong result set là hoàn toàn tuỳ tiện.** Trừ khi bạn sắp xếp rõ ràng bằng mệnh đề `ORDER BY`, **đừng gán ý nghĩa gì cho thứ tự row**.

### Accessor method

> *"When inspecting an individual row, you will want to know the contents of the fields. A large number of accessor methods give you this information."*

```java
String isbn = rs.getString(1);
double price = rs.getDouble("Price");
```

> *"There are accessors for various types, such as getString and getDouble. Each accessor has two forms, one taking a numeric argument, and the other, a string argument. When you supply a numeric argument, you refer to the column with that number. For example, rs.getString(1) returns the value of the first column in the current row."*

**Dịch:** Có accessor cho **nhiều kiểu khác nhau** như `getString`, `getDouble`. **Mỗi accessor có hai dạng**: một nhận **argument số**, một nhận **argument string**. Khi đưa argument số, bạn **trỏ tới column mang số đó** — `rs.getString(1)` trả về giá trị **column đầu tiên** của row hiện tại.

> **Caution (sách):** *"Unlike array indexes, database column numbers start at 1."*
>
> **Dịch:** Khác với index của array, **số hiệu column trong database bắt đầu từ 1**.

> *"When you supply a string argument, you refer to the column in the result set with that name. For example, rs.getDouble("Price") returns the value of the column with label Price. Using the numeric argument is a bit more efficient, but string arguments make the code easier to read and maintain."*

**Dịch:** Khi đưa argument string, bạn **trỏ tới column mang tên đó**. **Dùng argument số thì hiệu quả hơn chút**, nhưng **argument string làm code dễ đọc và dễ bảo trì hơn**.

> *"Each get method makes reasonable type conversions when the type of the method doesn't match the type of the column. For example, the call rs.getString("Price") converts the floating-point value of the Price column to a string."*

**Dịch:** Mỗi method `get` **tự chuyển kiểu một cách hợp lý** khi kiểu của method không khớp kiểu của column. Ví dụ `rs.getString("Price")` **chuyển giá trị dấu chấm động** của column `Price` **thành string** (xem [[05 - Strings]]).

### API — `java.sql.Connection` 1.1

| Method | Mô tả |
|---|---|
| `Statement createStatement()` | Tạo một `Statement` object để chạy query và update SQL **không có parameter** |
| `void close()` | **Đóng ngay lập tức** connection hiện tại và các tài nguyên JDBC mà nó tạo ra |

### API — `java.sql.Statement` 1.1

| Method | Mô tả |
|---|---|
| `ResultSet executeQuery(String sqlQuery)` | Chạy câu lệnh SQL trong string và **trả về một `ResultSet`** để xem kết quả query |
| `int executeUpdate(String sqlStatement)`<br>`long executeLargeUpdate(String sqlStatement)` **8** | Chạy câu lệnh `INSERT`, `UPDATE`, `DELETE`. Cũng chạy được câu lệnh **DDL (Data Definition Language)** như `CREATE TABLE`. Trả về **số row bị ảnh hưởng**, hoặc **0** với câu lệnh không có update count |
| `boolean execute(String sqlStatement)` | Chạy câu lệnh SQL trong string. **Có thể sinh ra nhiều result set và update count.** Trả về `true` nếu **kết quả đầu tiên là một result set**, ngược lại `false`. Gọi `getResultSet` hoặc `getUpdateCount` để lấy kết quả đầu. Xem [[05 - Query Execution#5.5.4. Multiple Results]] |
| `ResultSet getResultSet()` | Trả về result set của câu lệnh query trước đó, hoặc **`null`** nếu câu lệnh trước không có result set. **Chỉ gọi method này một lần cho mỗi statement đã chạy** |
| `int getUpdateCount()`<br>`long getLargeUpdateCount()` **8** | Trả về số row bị ảnh hưởng bởi câu lệnh update trước, hoặc **-1** nếu câu lệnh trước không có update count. **Chỉ gọi một lần cho mỗi statement đã chạy** |
| `void close()` | Đóng statement object này **và result set gắn với nó** |
| `boolean isClosed()` **6** | Trả về `true` nếu statement này đã đóng |
| `void closeOnCompletion()` **7** | Khiến statement này **tự đóng khi mọi result set của nó đã được đóng** |

### API — `java.sql.ResultSet` 1.1

| Method | Mô tả |
|---|---|
| `boolean next()` | Đưa row hiện tại **tiến lên một bước**. Trả về `false` sau row cuối. **Phải gọi method này để tới được row đầu tiên** |
| `Xxx getXxx(int columnNumber)`<br>`Xxx getXxx(String columnLabel)` | (`Xxx` là kiểu như `int`, `double`, `String`, `Date`, …) |
| `<T> T getObject(int columnIndex, Class<T> type)` **7**<br>`<T> T getObject(String columnLabel, Class<T> type)` **7**<br>`void updateObject(int columnIndex, Object x, SQLType targetSqlType)` **8**<br>`void updateObject(String columnLabel, Object x, SQLType targetSqlType)` **8** | Trả về hoặc cập nhật giá trị của column theo index/label, **đã chuyển sang kiểu chỉ định**. **Column label là label ghi trong mệnh đề SQL `AS`**, hoặc tên column nếu không dùng `AS` |
| `int findColumn(String columnName)` | Cho **column index** ứng với một tên column |
| `void close()` | **Đóng ngay lập tức** result set hiện tại |
| `boolean isClosed()` **6** | Trả về `true` nếu statement này đã đóng |

---

## 5.4.2. Managing Connections, Statements, and Result Sets

> *"Every Connection object can create one or more Statement objects. You can use the same Statement object for multiple unrelated commands and queries. However, a statement has at most one open result set. If you issue multiple queries whose results you analyze concurrently, you need multiple Statement objects."*

**Dịch:** **Mỗi `Connection` object tạo được một hoặc nhiều `Statement` object.** Bạn **dùng lại được cùng một `Statement`** cho nhiều lệnh và query không liên quan tới nhau. Tuy nhiên **một statement chỉ có tối đa MỘT result set đang mở**. Nếu bạn phát nhiều query mà cần **phân tích kết quả đồng thời**, bạn cần **nhiều `Statement` object**.

> *"Be forewarned, though, that there is a limit to the number of statements per connection. Use the getMaxStatements method of the DatabaseMetaData interface to find out the number of concurrently open statements that your JDBC driver supports."*

**Dịch:** Nhưng lưu ý trước: **có giới hạn về số statement trên mỗi connection**. Dùng method **`getMaxStatements`** của interface `DatabaseMetaData` để biết **số statement mở đồng thời** mà driver JDBC của bạn hỗ trợ.

> *"In practice, you should probably not fuss with multiple concurrent result sets. If the result sets are related, you should be able to issue a combined query and analyze a single result. It is much more efficient to let the database combine queries than it is for a Java program to iterate through multiple result sets."*

**Dịch:** Trên thực tế, **đừng bận tâm nhiều tới chuyện nhiều result set đồng thời**. Nếu các result set có liên quan, bạn **nên phát được một query gộp và phân tích một kết quả duy nhất**. **Để database gộp query hiệu quả hơn nhiều** so với việc chương trình Java lặp qua nhiều result set.

> *"Be sure to finish processing of any result set before you issue a new query or update on a Statement object. The result sets of prior queries are automatically closed."*

**Dịch:** **Hãy xử lý xong result set trước khi phát query hoặc update mới** trên một `Statement` object. **Result set của các query trước sẽ tự động bị đóng.**

> *"When you are done using a ResultSet, Statement, or Connection, it is a good idea to call the close method immediately. These objects use large data structures that draw on the finite resources of the database server."*

**Dịch:** Khi dùng xong một `ResultSet`, `Statement` hay `Connection`, **nên gọi `close` ngay**. Những object này dùng **cấu trúc dữ liệu lớn**, ăn vào **tài nguyên hữu hạn của database server**.

> *"The close method of a Statement object closes any associated result sets. Similarly, the close method of the Connection class closes all statements of the connection. Conversely, you can call the closeOnCompletion method on a Statement, and it will close automatically as soon as all its result sets have closed."*

**Dịch:** Method `close` của `Statement` **đóng luôn mọi result set gắn với nó**. Tương tự, `close` của class `Connection` **đóng mọi statement của connection đó**. Ngược lại, gọi **`closeOnCompletion`** trên một `Statement` thì nó **tự đóng ngay khi mọi result set của nó đã đóng**.

```
  Connection.close()
        └──► đóng mọi Statement
                  └──► đóng mọi ResultSet

  Statement.closeOnCompletion()
        └──► mọi ResultSet đóng ⇒ Statement tự đóng
```

> *"If your connections are short-lived, don't worry about closing statements and result sets. To make sure a connection object cannot possibly remain open, use a try-with-resources statement:"*

```java
try (Connection conn = . . .)
{
    Statement stat = conn.createStatement();
    ResultSet result = stat.executeQuery(queryString);

    process query result
}
```

**Dịch:** Nếu connection của bạn **sống ngắn**, đừng lo chuyện đóng statement và result set. Để **chắc chắn connection object không thể còn mở**, hãy dùng **`try`-with-resources** (xem [[02 - Catching Exceptions]]).

---

## 5.4.3. Analyzing SQL Exceptions

> *"Each SQLException has a chain of SQLException objects that are retrieved with the getNextException method. This exception chain is in addition to the "cause" chain of Throwable objects that every exception has. (See Volume I, Chapter 7 for details about Java exceptions.) One would need two nested loops to fully enumerate all these exceptions. Fortunately, the SQLException class has been enhanced to implement the Iterable<Throwable> interface. The iterator() method yields an Iterator<Throwable> that iterates through both chains: It starts by going through the cause chain of the first SQLException, then moves on to the next SQLException, and so on. You can simply use an enhanced for loop:"*

```java
for (Throwable t : sqlException)
{
    do something with t
}
```

**Dịch:** **Mỗi `SQLException` có một chuỗi (chain) các `SQLException`** lấy được bằng method **`getNextException`**. Chuỗi exception này **nằm ngoài chuỗi "cause"** của các `Throwable` mà mọi exception đều có (xem Volume I, Chapter 7 — [[02 - Catching Exceptions]]). Về lý thuyết phải **hai vòng lặp lồng nhau** mới liệt kê hết. May thay, class `SQLException` đã được nâng cấp để **implement interface `Iterable<Throwable>`** (xem [[01 - Interfaces]]). Method `iterator()` cho ra một `Iterator<Throwable>` **duyệt qua CẢ HAI chuỗi**: đi qua **cause chain của `SQLException` đầu tiên**, rồi chuyển sang `SQLException` kế tiếp, v.v. Bạn chỉ cần dùng **enhanced `for` loop**.

> *"You can call getSQLState and getErrorCode on a SQLException to analyze it further. The first method yields a string that is standardized by either X/Open or SQL:2003. (Call the getSQLStateType method of the DatabaseMetaData interface to find out which standard is used by your driver.) The error code is vendor-specific."*

**Dịch:** Gọi **`getSQLState`** và **`getErrorCode`** trên `SQLException` để phân tích sâu hơn. Method thứ nhất cho ra một string **được chuẩn hoá theo X/Open hoặc SQL:2003** (gọi `getSQLStateType` của `DatabaseMetaData` để biết driver của bạn dùng chuẩn nào). Còn **error code là riêng của từng vendor**.

> *"The SQL exceptions are organized into an inheritance tree (shown in Figure 5.5). This allows you to catch specific error types in a vendor-independent way."*

**Dịch:** Các SQL exception được tổ chức thành **một cây inheritance**. Nhờ vậy bạn **catch được từng loại lỗi cụ thể theo cách không phụ thuộc vendor**.

**Figure 5.5: SQL exception types**

```
SQLException
 △
 ├─ BatchUpdateException
 ├─ SerialException
 ├─ SQLTransientException
 │    △
 │    ├─ SQLTimeoutException
 │    ├─ SQLTransactionRollbackException
 │    └─ SQLTransientConnectionException
 ├─ SQLClientInfoException
 ├─ SQLRecoverableException
 ├─ SQLWarning
 ├─ SQLNonTransientException
 │    △
 │    ├─ SQLDataException
 │    ├─ SQLFeatureNotSupportedException
 │    ├─ SQLIntegrityConstraintViolationException
 │    ├─ SQLSyntaxErrorException
 │    ├─ SQLInvalidAuthorizationSpecException
 │    └─ SQLNonTransientConnectionException
 ├─ RowSetWarning
 ├─ SyncFactoryException
 └─ SyncProviderException
```

### Warning

> *"In addition, the database driver can report nonfatal conditions as warnings. You can retrieve warnings from connections, statements, and result sets. The SQLWarning class is a subclass of SQLException (even though a SQLWarning is not thrown as an exception). Call getSQLState and getErrorCode to get further information about the warnings. Similar to SQL exceptions, warnings are chained. To retrieve all warnings, use this loop:"*

```java
SQLWarning w = stat.getWarning();
while (w != null)
{
    do something with w
    w = w.nextWarning();
}
```

**Dịch:** Ngoài ra, database driver **báo cáo được các tình huống không chí mạng dưới dạng warning**. Bạn lấy warning được **từ connection, statement và result set**. Class **`SQLWarning` là subclass của `SQLException`** (dù một `SQLWarning` **không được ném ra như exception**). Gọi `getSQLState` và `getErrorCode` để biết thêm về warning. Giống SQL exception, **warning cũng được nối chuỗi**.

> *"The DataTruncation subclass of SQLWarning is used when data being read from the database are unexpectedly truncated. If data truncation happens in an update statement, a DataTruncation is thrown as an exception."*

**Dịch:** Subclass **`DataTruncation`** của `SQLWarning` được dùng khi dữ liệu đọc từ database **bị cắt cụt ngoài dự kiến**. Nếu việc cắt cụt xảy ra **trong câu lệnh update**, thì **`DataTruncation` được ném ra như một exception**.

### API — `java.sql.SQLException` 1.1

| Method | Mô tả |
|---|---|
| `SQLException getNextException()` | Lấy SQL exception kế tiếp trong chuỗi, hoặc **`null`** ở cuối chuỗi |
| `Iterator<Throwable> iterator()` **6** | Lấy iterator cho ra **các SQL exception trong chuỗi và cause của chúng** |
| `String getSQLState()` | Lấy **"SQL state"** — mã lỗi đã chuẩn hoá |
| `int getErrorCode()` | Lấy **mã lỗi riêng của vendor** |

### API — `java.sql.SQLWarning` 1.1

| Method | Mô tả |
|---|---|
| `SQLWarning getNextWarning()` | Trả về warning kế tiếp trong chuỗi, hoặc `null` ở cuối chuỗi |

### API — `java.sql.Connection` 1.1 · `java.sql.Statement` 1.1 · `java.sql.ResultSet` 1.1

| Method | Mô tả |
|---|---|
| `SQLWarning getWarnings()` | Trả về **warning đầu tiên đang chờ**, hoặc `null` nếu không có warning nào |

### API — `java.sql.DataTruncation` 1.1

| Method | Mô tả |
|---|---|
| `boolean getParameter()` | `true` nếu việc cắt cụt áp lên **parameter**, `false` nếu áp lên **column** |
| `int getIndex()` | Trả về **index** của parameter hoặc column bị cắt cụt |
| `int getDataSize()` | Số byte **lẽ ra phải được truyền**, hoặc **-1** nếu không rõ |
| `int getTransferSize()` | Số byte **thực sự được truyền**, hoặc **-1** nếu không rõ |

---

## 5.4.4. Populating a Database

> *"We are now ready to write our first real JDBC program. Sure, it would be nice to try some of the fancy queries discussed earlier, but we have a problem: Right now, there are no data in the database. We need to populate the database, and a simple way of doing that is with a set of SQL instructions to create tables and insert data into them. Most database programs can process a set of SQL instructions from a text file, but there are pesky differences about statement terminators and other syntactical issues."*

**Dịch:** Giờ ta sẵn sàng viết **chương trình JDBC thật đầu tiên**. Vấn đề là: **hiện chưa có dữ liệu nào trong database**. Ta cần **nạp dữ liệu vào database**, và cách đơn giản là dùng **một tập lệnh SQL** để tạo table và chèn dữ liệu. Đa số chương trình database xử lý được tập lệnh SQL từ file text, nhưng có những **khác biệt phiền phức về ký tự kết thúc câu lệnh** và các vấn đề cú pháp khác.

> *"For that reason, we will use JDBC in a simple program that reads a file with SQL instructions, one instruction per line, and executes them."*

**Dịch:** Vì thế, sách dùng JDBC trong một chương trình đơn giản: **đọc file chứa lệnh SQL, mỗi dòng một lệnh, rồi chạy chúng**.

> *"Specifically, the program reads data from a text file in a format such as"*

```sql
CREATE TABLE Publishers (Publisher_Id CHAR(6), Name CHAR(30), URL CHAR(80));
INSERT INTO Publishers VALUES ('0201', 'Addison-Wesley', 'www.aw-bc.com');
INSERT INTO Publishers VALUES ('0471', 'John Wiley & Sons', 'www.wiley.com');
. . .
```

> *"Listing 5.2 contains the code for the program that reads a file with SQL statements and executes them. You don't have to read through the code; simply use the program so you can populate your database and run the examples in the remainder of this chapter."*

**Dịch:** Listing 5.2 là code chương trình đọc file lệnh SQL và chạy chúng. **Bạn không cần đọc kỹ code**; cứ dùng chương trình để nạp dữ liệu vào database và chạy các ví dụ ở phần còn lại của chương.

> *"Make sure that your database server is running, and run the program as follows:"*

```
java -classpath driverPath:. exec.ExecSQL Books.sql
java -classpath driverPath:. exec.ExecSQL Authors.sql
java -classpath driverPath:. exec.ExecSQL Publishers.sql
java -classpath driverPath:. exec.ExecSQL BooksAuthors.sql
```

> *"Before running the program, check that the file database.properties is set up properly for your environment (see Section 5.3.5, "Connecting to the Database," on p. 296)."*

**Dịch:** Đảm bảo database server đang chạy rồi chạy chương trình như trên. Trước khi chạy, **kiểm tra file `database.properties` đã cấu hình đúng** cho môi trường của bạn (xem [[03 - JDBC Configuration#5.3.5. Connecting to the Database]]).

> **Note (sách):** *"Your database may also have a utility to read SQL files directly. For example, with Derby, you can run"*
>
> ```
> java -jar derby/lib/derbyrun.jar ij -p ij.properties Books.sql
> ```
>
> *"(The ij.properties file is described in Section 5.3.3, "Starting the Database," on p. 294.)"*
>
> *"In the data format for the ExecSQL command, we allow an optional semicolon at the end of each line because most database utilities expect this format."*
>
> **Dịch:** Database của bạn có thể **có sẵn tiện ích đọc thẳng file SQL**. Ví dụ với Derby thì chạy lệnh trên (file `ij.properties` mô tả ở [[03 - JDBC Configuration#5.3.3. Starting the Database]]). Trong định dạng dữ liệu cho lệnh `ExecSQL`, sách **cho phép một dấu chấm phẩy tuỳ chọn ở cuối mỗi dòng**, vì đa số tiện ích database mong đợi định dạng này.

### Các bước của chương trình ExecSQL

> *"The following steps briefly describe the ExecSQL program:"*

> *"1. Connect to the database. The getConnection method reads the properties in the file database.properties and adds the jdbc.drivers property to the system properties. The driver manager uses the jdbc.drivers property to load the appropriate database driver. The getConnection method uses the jdbc.url, jdbc.username, and jdbc.password properties to open the database connection."*

**Dịch:** **1.** Kết nối tới database. Method `getConnection` đọc property trong file `database.properties` và **thêm property `jdbc.drivers` vào system properties**. Driver manager dùng `jdbc.drivers` để **load driver database phù hợp**. `getConnection` dùng `jdbc.url`, `jdbc.username`, `jdbc.password` để **mở connection**.

> *"2. Open the file with the SQL statements. If no file name was supplied, prompt the user to enter the statements on the console."*

**Dịch:** **2.** Mở file chứa câu lệnh SQL. **Nếu không có tên file** thì **nhắc người dùng nhập câu lệnh trên console**.

> *"3. Execute each statement with the generic execute method. If it returns true, the statement had a result set. The four SQL files that we provide for the book database all end in a SELECT * statement so that you can see that the data were successfully inserted."*

**Dịch:** **3.** Chạy từng câu lệnh bằng **method `execute` tổng quát**. Nếu nó trả về `true`, câu lệnh **có result set**. Bốn file SQL đi kèm đều **kết thúc bằng câu lệnh `SELECT *`** để bạn thấy dữ liệu đã chèn thành công.

> *"4. If there was a result set, print out the result. Since this is a generic result set, we need to use metadata to find out how many columns the result has. For more information, see Section 5.8, "Metadata," on p. 334."*

**Dịch:** **4.** Nếu có result set thì **in kết quả ra**. Vì đây là result set tổng quát, ta cần dùng **metadata để biết kết quả có bao nhiêu column** (xem [[08 - Metadata]]).

> *"5. If there is any SQL exception, print the exception and any chained exceptions that may be contained in it."*

**Dịch:** **5.** Nếu có SQL exception thì **in exception đó cùng mọi exception nối chuỗi** bên trong nó.

> *"6. Close the connection to the database."*

**Dịch:** **6.** **Đóng connection** tới database.

---

### Listing 5.2 — `exec/ExecSQL.java`

```java
package exec;

import java.io.*;
import java.nio.charset.*;
import java.nio.file.*;
import java.util.*;
import java.sql.*;

/**
 * Executes all SQL statements in a file. Call this program as <br>
 * java -classpath driverPath:. ExecSQL commandFile
 *
 * @version 1.33 2018-05-01
 * @author Cay Horstmann
 */
class ExecSQL
{
    public static void main(String args[]) throws IOException
    {
        try (Scanner in = args.length == 0 ? new Scanner(System.in)
                : new Scanner(Paths.get(args[0]), StandardCharsets.UTF_8))
        {
            try (Connection conn = getConnection();
                Statement stat = conn.createStatement())
            {
                while (true)
                {
                    if (args.length == 0) System.out.println("Enter command or EXIT to exit:");

                    if (!in.hasNextLine()) return;

                    String line = in.nextLine().trim();
                    if (line.equalsIgnoreCase("EXIT")) return;
                    if (line.endsWith(";")) // remove trailing semicolon
                        line = line.substring(0, line.length() - 1);
                    try
                    {
                        boolean isResult = stat.execute(line);
                        if (isResult)
                        {
                            try (ResultSet rs = stat.getResultSet())
                            {
                                showResultSet(rs);
                            }
                        }
                        else
                        {
                            int updateCount = stat.getUpdateCount();
                            System.out.println(updateCount + " rows updated");
                        }
                    }
                    catch (SQLException e)
                    {
                        for (Throwable t : e)
                            t.printStackTrace();
                    }
                }
            }
        }
        catch (SQLException e)
        {
            for (Throwable t : e)
                t.printStackTrace();
        }
    }

    /**
     * Gets a connection from the properties specified in the file database.properties
     * @return the database connection
     */
    public static Connection getConnection() throws SQLException, IOException
    {
        var props = new Properties();
        try (InputStream in = Files.newInputStream(Paths.get("database.properties")))
        {
            props.load(in);
        }
        String drivers = props.getProperty("jdbc.drivers");
        if (drivers != null) System.setProperty("jdbc.drivers", drivers);

        String url = props.getProperty("jdbc.url");
        String username = props.getProperty("jdbc.username");
        String password = props.getProperty("jdbc.password");

        return DriverManager.getConnection(url, username, password);
    }

    /**
     * Prints a result set.
     * @param result the result set to be printed
     */
    public static void showResultSet(ResultSet result) throws SQLException
    {
        ResultSetMetaData metaData = result.getMetaData();
        int columnCount = metaData.getColumnCount();

        for (int i = 1; i <= columnCount; i++)
        {
            if (i > 1) System.out.print(", ");
            System.out.print(metaData.getColumnLabel(i));
        }
        System.out.println();

        while (result.next())
        {
            for (int i = 1; i <= columnCount; i++)
            {
                if (i > 1) System.out.print(", ");
                System.out.print(result.getString(i));
            }
            System.out.println();
        }
    }
}
```

---

## Bài kế tiếp

→ [[05 - Query Execution]] — prepared statement, đọc/ghi LOB, SQL escape, nhiều kết quả, và lấy key tự sinh.
