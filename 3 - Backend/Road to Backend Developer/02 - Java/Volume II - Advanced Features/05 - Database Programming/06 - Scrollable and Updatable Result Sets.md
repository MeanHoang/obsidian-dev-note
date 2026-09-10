# 06 — Scrollable and Updatable Result Sets

> Chapter 5, Section 5.6 — Core Java Volume II: Advanced Features, 11th Edition (Horstmann), Java 11.
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 5.6. Scrollable and Updatable Result Sets

> *"As you have seen, the next method of the ResultSet interface iterates over the rows in a result set. That is certainly adequate for a program that needs to analyze the data. However, consider a visual data display that shows a table or query results (such as Figure 5.4). You usually want the user to be able to move both forward and backward in the result set. In a scrollable result, you can move forward and backward through a result set and even jump to any position."*

**Dịch:** Như đã thấy, method `next` của interface `ResultSet` **lặp qua các row** trong result set. Thế là đủ cho chương trình chỉ cần phân tích dữ liệu. Nhưng xét một màn hình hiển thị dữ liệu trực quan: bạn thường muốn người dùng **di chuyển được cả tiến lẫn lùi** trong result set. Trong một **scrollable result**, bạn **đi tới, đi lui, thậm chí nhảy tới vị trí bất kỳ**.

> *"Furthermore, once users see the contents of a result set displayed, they may be tempted to edit it. In an updatable result set, you can programmatically update entries so that the database is automatically updated. We discuss these capabilities in the following sections."*

**Dịch:** Hơn nữa, khi người dùng đã thấy nội dung result set, họ có thể **muốn sửa nó**. Trong một **updatable result set**, bạn **cập nhật entry bằng code và database được cập nhật tự động**.

---

## 5.6.1. Scrollable Result Sets

> *"By default, result sets are not scrollable or updatable. To obtain scrollable result sets from your queries, you must obtain a different Statement object with the method"*

```java
Statement stat = conn.createStatement(type, concurrency);
```

> *"For a prepared statement, use the call"*

```java
PreparedStatement stat = conn.prepareStatement(command, type, concurrency);
```

**Dịch:** **Mặc định result set KHÔNG scrollable cũng KHÔNG updatable.** Để có scrollable result set, bạn phải **lấy một `Statement` object khác** bằng method trên. Với prepared statement thì dùng lời gọi tương ứng.

> *"The possible values of type and concurrency are listed in Tables 5.6 and 5.7. You have the following choices:"*

> *"Do you want the result set to be scrollable? If not, use ResultSet.TYPE_FORWARD_ONLY."*

**Dịch:** Bạn có muốn result set **scrollable** không? Nếu **không**, dùng `ResultSet.TYPE_FORWARD_ONLY`.

> *"If the result set is scrollable, do you want it to reflect changes in the database that occurred after the query that yielded it? (In our discussion, we assume the ResultSet.TYPE_SCROLL_INSENSITIVE setting for scrollable result sets. This assumes that the result set does not "sense" database changes that occurred after execution of the query.)"*

**Dịch:** Nếu result set scrollable, bạn có muốn nó **phản ánh những thay đổi trong database xảy ra SAU query đã sinh ra nó** không? (Trong phần thảo luận, sách giả định dùng `ResultSet.TYPE_SCROLL_INSENSITIVE` — nghĩa là result set **không "cảm nhận" được thay đổi của database** xảy ra sau khi query chạy.)

> *"Do you want to be able to update the database by editing the result set? (See the next section for details.)"*

**Dịch:** Bạn có muốn **cập nhật database bằng cách sửa result set** không?

### Table 5.6 — ResultSet Type Values

| Value | Explanation | Dịch |
|---|---|---|
| `TYPE_FORWARD_ONLY` | The result set is not scrollable (default). | Result set **không scrollable** (**mặc định**) |
| `TYPE_SCROLL_INSENSITIVE` | The result set is scrollable but not sensitive to database changes. | Result set **scrollable nhưng không nhạy** với thay đổi của database |
| `TYPE_SCROLL_SENSITIVE` | The result set is scrollable and sensitive to database changes. | Result set **scrollable và nhạy** với thay đổi của database |

### Table 5.7 — ResultSet Concurrency Values

| Value | Explanation | Dịch |
|---|---|---|
| `CONCUR_READ_ONLY` | The result set cannot be used to update the database (default). | **Không dùng được** result set để cập nhật database (**mặc định**) |
| `CONCUR_UPDATABLE` | The result set can be used to update the database. | **Dùng được** result set để cập nhật database |

> *"For example, if you simply want to be able to scroll through a result set but don't want to edit its data, use"*

```java
Statement stat = conn.createStatement(
    ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY);
```

> *"All result sets that are returned by calls"*

```java
ResultSet rs = stat.executeQuery(query);
```

> *"are now scrollable. A scrollable result set has a cursor that indicates the current position."*

**Dịch:** Nếu chỉ muốn **cuộn qua result set mà không sửa dữ liệu**, dùng cấu hình trên. Mọi result set trả về từ lời gọi `executeQuery` **giờ đã scrollable**. **Một scrollable result set có một cursor chỉ ra vị trí hiện tại.**

> **Note (sách):** *"Not all database drivers support scrollable or updatable result sets. (The supportsResultSetType and supportsResultSetConcurrency methods of the DatabaseMetaData interface will tell you which types and concurrency modes are supported by a particular database using a particular driver.) Even if a database supports all result set modes, a particular query might not be able to yield a result set with all the properties that you requested. (For example, the result set of a complex query might not be updatable.) In that case, the executeQuery method returns a ResultSet of lesser capabilities and adds a SQLWarning to the connection object. (Section 5.4.3, "Analyzing SQL Exceptions," on p. 304 shows how to retrieve the warning.) Alternatively, you can use the getType and getConcurrency methods of the ResultSet interface to find out what mode a result set actually has. If you do not check the result set capabilities and issue an unsupported operation, such as previous on a result set that is not scrollable, the operation will throw a SQLException."*
>
> **Dịch:** **Không phải driver nào cũng hỗ trợ scrollable hay updatable result set.** (Method `supportsResultSetType` và `supportsResultSetConcurrency` của `DatabaseMetaData` cho biết database + driver cụ thể hỗ trợ những type và concurrency mode nào.) **Kể cả khi database hỗ trợ mọi mode, một query cụ thể vẫn có thể không cho ra result set với đủ mọi thuộc tính bạn yêu cầu** — ví dụ result set của một query phức tạp có thể **không updatable**. Khi đó `executeQuery` **trả về một `ResultSet` với ít khả năng hơn** và **thêm một `SQLWarning` vào connection object** (xem [[04 - Working with JDBC Statements#5.4.3. Analyzing SQL Exceptions]]). Hoặc bạn dùng **`getType` và `getConcurrency`** để biết result set thực sự đang ở mode nào. **Nếu không kiểm tra khả năng của result set mà phát một thao tác không được hỗ trợ** — như gọi `previous` trên result set không scrollable — thì thao tác đó **ném `SQLException`**.

### Di chuyển cursor

> *"Scrolling is very simple. Use"*

```java
if (rs.previous()) . . .;
```

> *"to scroll backward. The method returns true if the cursor is positioned on an actual row, or false if it is now positioned before the first row."*

**Dịch:** Cuộn rất đơn giản. Dùng `previous()` để **cuộn lùi**. Method trả về **`true` nếu cursor đang nằm trên một row thật**, hoặc **`false` nếu nó đang ở trước row đầu tiên**.

> *"You can move the cursor backward or forward by any number of rows with the call"*

```java
rs.relative(n);
```

> *"If n is positive, the cursor moves forward. If n is negative, it moves backward. If n is zero, the call has no effect. If you attempt to move the cursor outside the current set of rows, it is set to point either after the last row or before the first row, depending on the sign of n. Then, the method returns false and the cursor does not move. The method returns true if the cursor is positioned on an actual row."*

**Dịch:** `relative(n)` di chuyển cursor **tới hoặc lui bao nhiêu row tuỳ ý**. **`n` dương → tiến; `n` âm → lùi; `n` bằng 0 → không tác dụng gì.** Nếu bạn cố di chuyển cursor **ra ngoài tập row hiện tại**, nó được đặt trỏ **sau row cuối hoặc trước row đầu**, tuỳ dấu của `n`; khi đó method **trả về `false`** và cursor **không di chuyển**. Method trả về `true` nếu cursor nằm trên một row thật.

> *"Alternatively, you can set the cursor to a particular row number:"*

```java
rs.absolute(n);
```

> *"To get the current row number, call"*

```java
int currentRow = rs.getRow();
```

> *"The first row in the result set has number 1. If the return value is 0, the cursor is not currently on a row—it is either before the first row or after the last row."*

**Dịch:** Hoặc **đặt cursor tới một số hiệu row cụ thể** bằng `absolute(n)`. Lấy số hiệu row hiện tại bằng `getRow()`. **Row đầu tiên mang số 1.** Nếu giá trị trả về là **0** thì cursor **hiện không nằm trên row nào** — hoặc trước row đầu, hoặc sau row cuối.

> *"The convenience methods first, last, beforeFirst, and afterLast move the cursor to the first, to the last, before the first, or after the last position."*

**Dịch:** Các method tiện lợi **`first`, `last`, `beforeFirst`, `afterLast`** đưa cursor tới vị trí **đầu tiên, cuối cùng, trước đầu tiên, sau cuối cùng**.

> *"Finally, the methods isFirst, isLast, isBeforeFirst, and isAfterLast test whether the cursor is at one of these special positions."*

**Dịch:** Cuối cùng, **`isFirst`, `isLast`, `isBeforeFirst`, `isAfterLast`** kiểm tra xem cursor có đang ở một trong các vị trí đặc biệt đó không.

```
  beforeFirst ─── row 1 ─── row 2 ─── … ─── row n ─── afterLast
                    ▲                           ▲
                  first()                     last()
       getRow() == 0 ở hai vị trí ngoài rìa
```

> *"Using a scrollable result set is very simple. The hard work of caching the query data is carried out behind the scenes by the database driver."*

**Dịch:** Dùng scrollable result set **rất đơn giản**. Phần việc nặng nhọc là **cache dữ liệu query** thì **database driver làm sau hậu trường**.

---

## 5.6.2. Updatable Result Sets

> *"If you want to edit the data in the result set and have the changes automatically reflected in the database, create an updatable result set. Updatable result sets don't have to be scrollable, but if you present data to a user for editing, you usually want to allow scrolling as well."*

**Dịch:** Nếu bạn muốn **sửa dữ liệu trong result set và thay đổi tự động phản ánh vào database**, hãy tạo **updatable result set**. **Updatable result set không nhất thiết phải scrollable**, nhưng nếu bạn trình dữ liệu cho người dùng sửa thì thường cũng muốn cho cuộn luôn.

> *"To obtain updatable result sets, create a statement as follows:"*

```java
Statement stat = conn.createStatement(
    ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_UPDATABLE);
```

> *"The result sets returned by a call to executeQuery are then updatable."*

**Dịch:** Tạo statement như trên thì result set trả về từ `executeQuery` **sẽ updatable**.

> **Note (sách):** *"Not all queries return updatable result sets. If your query is a join that involves multiple tables, the result might not be updatable. However, if your query involves only a single table or if it joins multiple tables by their primary keys, you should expect the result set to be updatable. Call the getConcurrency method of the ResultSet interface to find out for sure."*
>
> **Dịch:** **Không phải query nào cũng trả về updatable result set.** Nếu query là một **join nhiều table**, kết quả **có thể không updatable**. Nhưng nếu query **chỉ liên quan một table**, hoặc **join nhiều table theo primary key của chúng**, thì bạn **có thể trông đợi result set là updatable**. Gọi **`getConcurrency`** để biết chắc.

### Sửa row đang có

> *"For example, suppose you want to raise the prices of some books, but you don't have a simple criterion for issuing an UPDATE statement. Then, you can iterate through all books and update prices based on arbitrary conditions."*

```java
String query = "SELECT * FROM Books";
ResultSet rs = stat.executeQuery(query);
while (rs.next())
{
    if (. . .)
    {
        double increase = . . .;
        double price = rs.getDouble("Price");
        rs.updateDouble("Price", price + increase);
        rs.updateRow(); // make sure to call updateRow after updating fields
    }
}
```

**Dịch:** Ví dụ bạn muốn **tăng giá một số sách** nhưng **không có tiêu chí đơn giản** để viết một câu `UPDATE`. Khi đó bạn **lặp qua mọi cuốn sách và cập nhật giá theo điều kiện tuỳ ý**.

> *"There are updateXxx methods for all data types that correspond to SQL types, such as updateDouble, updateString, and so on; specify the name or the number of the column (as with the getXxx methods), then the new value for the field."*

**Dịch:** Có method **`updateXxx` cho mọi kiểu dữ liệu tương ứng với kiểu SQL** — `updateDouble`, `updateString`, v.v. Chỉ định **tên hoặc số hiệu column** (như với các method `getXxx`), rồi tới **giá trị mới** cho field.

> **Note (sách):** *"If you use the updateXxx method whose first parameter is the column number, be aware that this is the column number in the result set. It could well be different from the column number in the database."*
>
> **Dịch:** Nếu dùng `updateXxx` với parameter đầu là số hiệu column, hãy nhớ rằng đó là **số hiệu column TRONG RESULT SET** — nó **rất có thể khác số hiệu column trong database**.

> *"The updateXxx method changes only the row values, not the database. When you are done with the field updates in a row, you must call the updateRow method. That method sends all updates in the current row to the database. If you move the cursor to another row without calling updateRow, this row's updates are discarded from the row set and never communicated to the database. You can also call the cancelRowUpdates method to cancel the updates to the current row."*

**Dịch:** Method `updateXxx` **chỉ đổi giá trị của row, không đổi database**. Khi đã cập nhật xong các field trong một row, bạn **phải gọi `updateRow`** — method đó **gửi mọi cập nhật của row hiện tại tới database**. **Nếu bạn di chuyển cursor sang row khác mà chưa gọi `updateRow`, mọi cập nhật của row này bị vứt bỏ** và **không bao giờ được truyền tới database**. Bạn cũng gọi được **`cancelRowUpdates`** để **huỷ các cập nhật của row hiện tại**.

### Chèn row mới

> *"The preceding example shows how to modify an existing row. If you want to add a new row to the database, first use the moveToInsertRow method to move the cursor to a special position, called the insert row. Then, build up a new row in the insert row position by issuing updateXxx instructions. When you are done, call the insertRow method to deliver the new row to the database. When you are done inserting, call moveToCurrentRow to move the cursor back to the position before the call to moveToInsertRow. Here is an example:"*

```java
rs.moveToInsertRow();
rs.updateString("Title", title);
rs.updateString("ISBN", isbn);
rs.updateString("Publisher_Id", pubid);
rs.updateDouble("Price", price);
rs.insertRow();
rs.moveToCurrentRow();
```

**Dịch:** Muốn **thêm row mới** vào database: trước hết dùng **`moveToInsertRow`** để đưa cursor tới một **vị trí đặc biệt gọi là insert row**. Sau đó **dựng row mới tại vị trí insert row** bằng các lệnh `updateXxx`. Xong thì gọi **`insertRow`** để **đưa row mới vào database**. Chèn xong thì gọi **`moveToCurrentRow`** để **đưa cursor về vị trí trước khi gọi `moveToInsertRow`**.

> *"Note that you cannot influence where the new data is added in the result set or the database."*

**Dịch:** Lưu ý bạn **không tác động được vào chuyện dữ liệu mới được thêm ở đâu** trong result set hay trong database.

> *"If you don't specify a column value in the insert row, it is set to a SQL NULL. However, if the column has a NOT NULL constraint, an exception is thrown and the row is not inserted."*

**Dịch:** Nếu **không chỉ định giá trị cho một column** trong insert row, nó **được đặt là SQL `NULL`**. Nhưng nếu column có **ràng buộc `NOT NULL`** thì **một exception được ném ra và row không được chèn**.

### Xoá row

> *"Finally, you can delete the row under the cursor:"*

```java
rs.deleteRow();
```

> *"The deleteRow method immediately removes the row from both the result set and the database."*

**Dịch:** Cuối cùng, bạn **xoá được row nằm dưới cursor**. Method `deleteRow` **xoá row ngay lập tức khỏi CẢ result set LẪN database**.

> *"The updateRow, insertRow, and deleteRow methods of the ResultSet interface give you the same power as executing UPDATE, INSERT, and DELETE SQL statements. However, Java programmers might find it more natural to manipulate the database contents through result sets than by constructing SQL statements."*

**Dịch:** `updateRow`, `insertRow`, `deleteRow` cho bạn **sức mạnh tương đương việc chạy câu lệnh `UPDATE`, `INSERT`, `DELETE`**. Nhưng lập trình viên Java có thể thấy **thao tác lên nội dung database qua result set tự nhiên hơn** so với việc dựng câu lệnh SQL.

> **Caution (sách):** *"If you are not careful, you can write staggeringly inefficient code with updatable result sets. It is much more efficient to execute an UPDATE statement than to make a query and iterate through the result, changing data along the way. Updatable result sets make sense for interactive programs in which a user can make arbitrary changes, but for most programmatic changes, a SQL UPDATE is more appropriate."*
>
> **Dịch:** Nếu không cẩn thận, bạn **viết ra code kém hiệu quả đến kinh ngạc** với updatable result set. **Chạy một câu `UPDATE` hiệu quả hơn nhiều** so với việc query rồi lặp qua kết quả, vừa đi vừa sửa dữ liệu. Updatable result set **hợp lý cho chương trình tương tác** nơi người dùng thay đổi tuỳ ý, còn với **đa số thay đổi bằng chương trình thì `UPDATE` của SQL phù hợp hơn**.

> **Note (sách):** *"JDBC 2 delivered further enhancements to result sets, such as the capability to update a result set with the most recent data if the data have been modified by another concurrent database connection. JDBC 3 added yet another refinement, specifying the behavior of result sets when a transaction is committed. However, these advanced features are outside the scope of this introductory chapter. We refer you to the JDBC™ API Tutorial and Reference, Third Edition, by Maydene Fisher, Jon Ellis, and Jonathan Bruce (Addison-Wesley, 2003) and the JDBC specification for more information."*
>
> **Dịch:** **JDBC 2** mang tới các cải tiến khác cho result set, như khả năng **cập nhật result set bằng dữ liệu mới nhất** nếu dữ liệu đã bị một database connection đồng thời khác sửa đổi. **JDBC 3** thêm một tinh chỉnh nữa, **quy định hành vi của result set khi một transaction được commit**. Các tính năng nâng cao này **nằm ngoài phạm vi chương nhập môn này**.

### API — `java.sql.Connection` 1.1

| Method | Mô tả |
|---|---|
| `Statement createStatement(int type, int concurrency)` **1.2**<br>`PreparedStatement prepareStatement(String command, int type, int concurrency)` **1.2** | Tạo một statement/prepared statement cho ra result set với **type và concurrency đã cho**. `type` là một trong `TYPE_FORWARD_ONLY`, `TYPE_SCROLL_INSENSITIVE`, `TYPE_SCROLL_SENSITIVE`; `concurrency` là `CONCUR_READ_ONLY` hoặc `CONCUR_UPDATABLE` — **tất cả định nghĩa trong interface `ResultSet`** |

### API — `java.sql.ResultSet` 1.1

| Method | Mô tả |
|---|---|
| `int getType()` **1.2** | Trả về **type của result set này** — một trong `TYPE_FORWARD_ONLY`, `TYPE_SCROLL_INSENSITIVE`, `TYPE_SCROLL_SENSITIVE` |
| `int getConcurrency()` **1.2** | Trả về **thiết lập concurrency** — `CONCUR_READ_ONLY` hoặc `CONCUR_UPDATABLE` |
| `boolean previous()` **1.2** | Đưa cursor tới **row liền trước**. `true` nếu cursor nằm trên một row, `false` nếu cursor ở trước row đầu tiên |
| `int getRow()` **1.2** | Lấy **số hiệu row hiện tại**. Row được đánh số **bắt đầu từ 1** |
| `boolean absolute(int r)` **1.2** | Đưa cursor tới **row `r`**. `true` nếu cursor nằm trên một row |
| `boolean relative(int d)` **1.2** | Di chuyển cursor **`d` row**. `d` âm thì lùi. `true` nếu cursor nằm trên một row |
| `boolean first()` **1.2**<br>`boolean last()` **1.2** | Đưa cursor tới **row đầu / row cuối**. `true` nếu cursor nằm trên một row |
| `void beforeFirst()` **1.2**<br>`void afterLast()` **1.2** | Đưa cursor **trước row đầu / sau row cuối** |
| `boolean isFirst()` **1.2**<br>`boolean isLast()` **1.2** | Kiểm tra cursor có ở **row đầu / row cuối** không |
| `boolean isBeforeFirst()` **1.2**<br>`boolean isAfterLast()` **1.2** | Kiểm tra cursor có ở **trước row đầu / sau row cuối** không |
| `void moveToInsertRow()` **1.2** | Đưa cursor tới **insert row** — một row đặc biệt để chèn dữ liệu mới bằng `updateXxx` và `insertRow` |
| `void moveToCurrentRow()` **1.2** | Đưa cursor **từ insert row trở lại row nó đang đứng khi `moveToInsertRow` được gọi** |
| `void insertRow()` **1.2** | Chèn nội dung của insert row **vào database và vào result set** |
| `void deleteRow()` **1.2** | Xoá row hiện tại **khỏi database và khỏi result set** |
| `void updateXxx(int column, Xxx data)` **1.2**<br>`void updateXxx(String columnName, Xxx data)` **1.2** | (`Xxx` là kiểu như `int`, `double`, `String`, `Date`, …) **Cập nhật một field trong row hiện tại của result set** |
| `void updateRow()` **1.2** | **Gửi các cập nhật của row hiện tại tới database** |
| `void cancelRowUpdates()` **1.2** | **Huỷ các cập nhật của row hiện tại** |

### API — `java.sql.DatabaseMetaData` 1.1

| Method | Mô tả |
|---|---|
| `boolean supportsResultSetType(int type)` **1.2** | `true` nếu database **hỗ trợ result set thuộc type đã cho** (`TYPE_FORWARD_ONLY`, `TYPE_SCROLL_INSENSITIVE`, `TYPE_SCROLL_SENSITIVE`) |
| `boolean supportsResultSetConcurrency(int type, int concurrency)` **1.2** | `true` nếu database hỗ trợ result set với **tổ hợp type và concurrency** đã cho |

---

## Bài kế tiếp

→ [[07 - Row Sets]] — row set không cần giữ connection: `CachedRowSet`, `WebRowSet`, `FilteredRowSet`, `JoinRowSet`, `JdbcRowSet`.
