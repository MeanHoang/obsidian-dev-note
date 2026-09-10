# 07 — Row Sets

> Chapter 5, Section 5.7 — Core Java Volume II: Advanced Features, 11th Edition (Horstmann), Java 11.
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 5.7. Row Sets

> *"Scrollable result sets are powerful, but they have a major drawback. You need to keep the database connection open during the entire user interaction. However, a user can walk away from the computer for a long time, leaving the connection occupied. That is not good—database connections are scarce resources. In this situation, use a row set. The RowSet interface extends the ResultSet interface, but row sets don't have to be tied to a database connection."*

**Dịch:** Scrollable result set mạnh, nhưng có một **nhược điểm lớn**: bạn **phải giữ database connection mở suốt toàn bộ quá trình tương tác với người dùng**. Mà người dùng **có thể bỏ đi khỏi máy tính rất lâu**, để connection bị chiếm. Thế là **không tốt — database connection là tài nguyên khan hiếm**. Trong tình huống này, hãy dùng **row set**. **Interface `RowSet` extend interface `ResultSet`**, nhưng **row set không nhất thiết phải gắn với một database connection**.

> *"Row sets are also suitable if you need to move a query result to a different tier of a complex application, or to another device such as a cell phone. You would never want to move a result set—its data structures can be huge, and it is tethered to the database connection."*

**Dịch:** Row set cũng **hợp** khi bạn cần **chuyển kết quả query sang một tầng khác** của ứng dụng phức tạp, hoặc **sang thiết bị khác** như điện thoại. **Bạn sẽ không bao giờ muốn chuyển một result set** — **cấu trúc dữ liệu của nó có thể rất lớn**, và nó **bị buộc vào database connection**.

---

## 5.7.1. Constructing Row Sets

> *"The javax.sql.rowset package provides the following interfaces that extend the RowSet interface:"*

**Dịch:** Package **`javax.sql.rowset`** cung cấp các interface sau, **extend interface `RowSet`**.

> *"A CachedRowSet allows disconnected operation. We will discuss cached row sets in the following section."*

**Dịch:** **`CachedRowSet`** cho phép **hoạt động ở trạng thái ngắt kết nối (disconnected)**.

> *"A WebRowSet is a cached row set that can be saved to an XML file. The XML file can be moved to another tier of a web application where it is opened by another WebRowSet object."*

**Dịch:** **`WebRowSet`** là một cached row set **lưu được ra file XML**. File XML đó **chuyển được sang tầng khác của ứng dụng web**, nơi nó **được mở bởi một `WebRowSet` object khác**.

> *"The FilteredRowSet and JoinRowSet interfaces support lightweight operations on row sets that are equivalent to SQL SELECT and JOIN operations. These operations are carried out on the data stored in row sets, without having to make a database connection."*

**Dịch:** Interface **`FilteredRowSet`** và **`JoinRowSet`** hỗ trợ các thao tác **nhẹ** trên row set, **tương đương thao tác `SELECT` và `JOIN` của SQL**. Các thao tác này thực hiện **trên dữ liệu đã lưu trong row set**, **không cần tạo database connection**.

> *"A JdbcRowSet is a thin wrapper around a ResultSet. It adds useful methods from the RowSet interface."*

**Dịch:** **`JdbcRowSet`** là một **lớp bọc mỏng quanh một `ResultSet`**. Nó **thêm các method hữu ích từ interface `RowSet`**.

| Interface | Vai trò |
|---|---|
| `CachedRowSet` | Hoạt động **disconnected** |
| `WebRowSet` | Cached row set **lưu được ra file XML**, chuyển sang tầng khác của web app |
| `FilteredRowSet` · `JoinRowSet` | Thao tác nhẹ tương đương `SELECT` và `JOIN`, **không cần connection** |
| `JdbcRowSet` | **Wrapper mỏng** quanh `ResultSet`, thêm method của `RowSet` |

> *"As of Java 7, there is a standard way for obtaining a row set:"*

```java
RowSetFactory factory = RowSetProvider.newFactory();
CachedRowSet crs = factory.createCachedRowSet();
```

> *"There are similar methods for obtaining the other row set types."*

**Dịch:** **Từ Java 7** đã có **cách chuẩn để lấy một row set**. Có **method tương tự** để lấy các loại row set khác.

---

## 5.7.2. Cached Row Sets

> *"A cached row set contains all data from a result set. Since CachedRowSet is a subinterface of the ResultSet interface, you can use a cached row set exactly as you would use a result set. Cached row sets confer an important benefit: You can close the connection and still use the row set. As you will see in our sample program in Listing 5.4, this greatly simplifies the implementation of interactive applications. Each user command simply opens the database connection, issues a query, puts the result in a cached row set, and then closes the database connection."*

**Dịch:** Một cached row set **chứa toàn bộ dữ liệu từ một result set**. Vì **`CachedRowSet` là subinterface của `ResultSet`**, bạn **dùng cached row set y hệt như dùng result set**. Cached row set mang lại một **lợi ích quan trọng: bạn ĐÓNG được connection mà vẫn dùng được row set**. Điều này **đơn giản hoá rất nhiều việc implement ứng dụng tương tác**: mỗi lệnh của người dùng chỉ việc **mở connection, phát query, đặt kết quả vào cached row set, rồi đóng connection**.

> *"It is even possible to modify the data in a cached row set. Of course, the modifications are not immediately reflected in the database; you need to make an explicit request to accept the accumulated changes. The CachedRowSet then reconnects to the database and issues SQL statements to write the accumulated changes."*

**Dịch:** Thậm chí bạn **sửa được dữ liệu trong cached row set**. Đương nhiên các sửa đổi **không phản ánh ngay vào database**; bạn phải **yêu cầu tường minh để chấp nhận (accept) các thay đổi đã tích luỹ**. Khi đó `CachedRowSet` **kết nối lại tới database và phát câu lệnh SQL để ghi các thay đổi đó**.

### Nạp dữ liệu vào CachedRowSet

> *"You can populate a CachedRowSet from a result set:"*

```java
ResultSet result = . . .;
RowSetFactory factory = RowSetProvider.newFactory();
CachedRowSet crs = factory.createCachedRowSet();
crs.populate(result);
conn.close(); // now OK to close the database connection
```

**Dịch:** Bạn **nạp một `CachedRowSet` từ một result set** như trên — sau đó **đóng database connection là ổn**.

> *"Alternatively, you can let the CachedRowSet object establish a connection automatically. Set up the database parameters:"*

```java
crs.setURL("jdbc:derby://localhost:1527/COREJAVA");
crs.setUsername("dbuser");
crs.setPassword("secret");
```

> *"Then set the query statement and any parameters:"*

```java
crs.setCommand("SELECT * FROM Books WHERE Publisher_ID = ?");
crs.setString(1, publisherId);
```

> *"Finally, populate the row set with the query result:"*

```java
crs.execute();
```

> *"This call establishes a database connection, issues the query, populates the row set, and disconnects."*

**Dịch:** Hoặc bạn **để chính `CachedRowSet` object tự thiết lập connection**: set các parameter database, rồi set **câu query và các parameter của nó**, cuối cùng **nạp row set bằng kết quả query**. Lời gọi `execute()` **thiết lập connection, phát query, nạp row set, và ngắt kết nối**.

### Page size

> *"If your query result is very large, you would not want to put it into the row set in its entirety. After all, your users will probably only look at a few rows. In that case, specify a page size:"*

```java
CachedRowSet crs = . . .;
crs.setCommand(command);
crs.setPageSize(20);
. . .
crs.execute();
```

> *"Now you will only get 20 rows. To get the next batch of rows, call"*

```java
crs.nextPage();
```

**Dịch:** Nếu kết quả query **rất lớn**, bạn **không muốn nhét toàn bộ vào row set** — dù sao người dùng cũng **chỉ xem vài row**. Khi đó **chỉ định page size**. Giờ bạn **chỉ nhận 20 row**; để lấy **lô row kế tiếp** thì gọi `nextPage()`.

### Ghi thay đổi trở lại database

> *"You can inspect and modify the row set with the same methods you use for result sets. If you modified the row set contents, you must write it back to the database by calling"*

```java
crs.acceptChanges(conn);
```

> *"or"*

```java
crs.acceptChanges();
```

> *"The second call works only if you configured the row set with the information required to connect to a database (such as the URL, user name, and password)."*

**Dịch:** Bạn **xem và sửa row set bằng chính những method dùng cho result set**. Nếu đã sửa nội dung row set, bạn **phải ghi nó trở lại database** bằng `acceptChanges`. **Lời gọi thứ hai (không tham số) chỉ chạy được nếu bạn đã cấu hình row set với thông tin cần để kết nối** tới database (URL, user name, password).

> *"In Section 5.6.2, "Updatable Result Sets," on p. 325, you saw that not all result sets are updatable. Similarly, a row set that contains the result of a complex query will not be able to write its changes back to the database. You should be safe if your row set contains data from a single table."*

**Dịch:** Như đã thấy ở [[06 - Scrollable and Updatable Result Sets#5.6.2. Updatable Result Sets]], **không phải result set nào cũng updatable**. Tương tự, một row set chứa **kết quả của query phức tạp sẽ không ghi được thay đổi về database**. Bạn **an toàn nếu row set chứa dữ liệu từ MỘT table duy nhất**.

> **Caution (sách):** *"If you populated the row set from a result set, the row set does not know the name of the table to update. You need to call setTableName to set the table name."*
>
> **Dịch:** Nếu bạn nạp row set **từ một result set**, row set **không biết tên table cần cập nhật**. Bạn **phải gọi `setTableName`** để đặt tên table.

> *"Another complexity arises if the data in the database have changed after you populated the row set. This is clearly a sign of trouble that could lead to inconsistent data. The reference implementation checks whether the original row set values (that is, the values before editing) are identical to the current values in the database. If so, they are replaced with the edited values; otherwise, a SyncProviderException is thrown and none of the changes are written. Other implementations may use other strategies for synchronization."*

**Dịch:** Một rắc rối khác nảy sinh nếu **dữ liệu trong database đã thay đổi sau khi bạn nạp row set**. Đây rõ ràng là **dấu hiệu của rắc rối, có thể dẫn tới dữ liệu không nhất quán**. **Reference implementation kiểm tra xem giá trị gốc của row set (tức giá trị trước khi sửa) có giống hệt giá trị hiện tại trong database không**. Nếu giống thì **chúng được thay bằng giá trị đã sửa**; nếu không thì **một `SyncProviderException` được ném ra và KHÔNG thay đổi nào được ghi**. Các implementation khác **có thể dùng chiến lược đồng bộ khác**.

### API — `javax.sql.RowSet` 1.4

| Method | Mô tả |
|---|---|
| `String getURL()`<br>`void setURL(String url)` | Lấy hoặc đặt **database URL** |
| `String getUsername()`<br>`void setUsername(String username)` | Lấy hoặc đặt **user name** để kết nối database |
| `String getPassword()`<br>`void setPassword(String password)` | Lấy hoặc đặt **password** để kết nối database |
| `String getCommand()`<br>`void setCommand(String command)` | Lấy hoặc đặt **câu lệnh được chạy để nạp row set này** |
| `void execute()` | **Nạp row set này** bằng cách phát câu lệnh đã set qua `setCommand`. Để driver manager lấy được connection, **URL, user name và password phải được set** |

### API — `javax.sql.rowset.CachedRowSet` 5.0

| Method | Mô tả |
|---|---|
| `void execute(Connection conn)` | Nạp row set này bằng câu lệnh đã set qua `setCommand`. Method này **dùng connection đã cho và ĐÓNG nó** |
| `void populate(ResultSet result)` | **Nạp cached row set này** bằng dữ liệu từ result set đã cho |
| `String getTableName()`<br>`void setTableName(String tableName)` | Lấy hoặc đặt **tên table** mà cached row set này được nạp từ đó |
| `int getPageSize()`<br>`void setPageSize(int size)` | Lấy hoặc đặt **page size** |
| `boolean nextPage()`<br>`boolean previousPage()` | Nạp **trang row kế tiếp / trước đó**. Trả về `true` nếu có trang kế/trước |
| `void acceptChanges()`<br>`void acceptChanges(Connection conn)` | **Kết nối lại database và ghi các thay đổi** do sửa row set. **Có thể ném `SyncProviderException`** nếu không ghi lại được vì dữ liệu trong database đã đổi |

### API — `javax.sql.rowset.RowSetProvider` 7

| Method | Mô tả |
|---|---|
| `static RowSetFactory newFactory()` | **Tạo một row set factory** |

### API — `javax.sql.rowset.RowSetFactory` 7

| Method | Mô tả |
|---|---|
| `CachedRowSet createCachedRowSet()`<br>`FilteredRowSet createFilteredRowSet()`<br>`JdbcRowSet createJdbcRowSet()`<br>`JoinRowSet createJoinRowSet()`<br>`WebRowSet createWebRowSet()` | **Tạo một row set thuộc loại chỉ định** |

---

## Bài kế tiếp

→ [[08 - Metadata]] — `DatabaseMetaData` và `ResultSetMetaData`: lấy thông tin về cấu trúc database và result set.
