# 02 — The Structured Query Language

> Chapter 5, Section 5.2 — Core Java Volume II: Advanced Features, 11th Edition (Horstmann), Java 11.
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 5.2. The Structured Query Language

> *"JDBC lets you communicate with databases using SQL, which is the command language for essentially all modern relational databases. Desktop databases usually have a GUI that lets users manipulate the data directly, but server-based databases are accessed purely through SQL."*

**Dịch:** JDBC cho phép bạn giao tiếp với database bằng **SQL** — ngôn ngữ lệnh của **về cơ bản mọi relational database hiện đại**. Database desktop thường có GUI để người dùng thao tác trực tiếp lên dữ liệu, nhưng **database chạy trên server thì truy cập thuần bằng SQL**.

> *"The JDBC package can be thought of as nothing more than an API for communicating SQL statements to databases. We will briefly introduce SQL in this section. If you have never seen SQL before, you might not find this material sufficient. If so, turn to one of the many learning resources on the topic; we recommend Learning SQL by Alan Beaulieu (O'Reilly, 2009) or the online book Learn SQL The Hard Way at http://sql.learncodethehardway.org."*

**Dịch:** Có thể coi package JDBC **chẳng qua là một API để truyền câu lệnh SQL tới database**. Phần này giới thiệu SQL vắn tắt. Nếu bạn chưa từng thấy SQL, tài liệu này có thể **chưa đủ**; khi đó hãy tìm tới các nguồn học khác — sách gợi ý *Learning SQL* (Alan Beaulieu, O'Reilly, 2009) hoặc sách online *Learn SQL The Hard Way*.

> *"You can think of a database as a bunch of named tables with rows and columns. Each column has a column name. Each row contains a set of related data."*

**Dịch:** Có thể hình dung một database như **một đống table có tên, gồm row và column**. **Mỗi column có một tên column. Mỗi row chứa một tập dữ liệu liên quan với nhau.**

> *"As an example database for this book, we use a set of database tables that describe a collection of classic computer science books (see Tables 5.1 through 5.4)."*

**Dịch:** Làm database ví dụ cho sách, tác giả dùng một bộ table mô tả **bộ sưu tập sách kinh điển về khoa học máy tính**.

### Table 5.1 — The Authors Table

| Author_ID | Name | Fname |
|---|---|---|
| ALEX | Alexander | Christopher |
| BROO | Brooks | Frederick P. |
| . . . | . . . | . . . |

### Table 5.2 — The Books Table

| Title | ISBN | Publisher_ID | Price |
|---|---|---|---|
| A Guide to the SQL Standard | 0-201-96426-0 | 0201 | 47.95 |
| A Pattern Language: Towns, Buildings, Construction | 0-19-501919-9 | 019 | 65.00 |
| . . . | . . . | . . . | . . . |

### Table 5.3 — The BooksAuthors Table

| ISBN | Author_ID | Seq_No |
|---|---|---|
| 0-201-96426-0 | DATE | 1 |
| 0-201-96426-0 | DARW | 2 |
| 0-19-501919-9 | ALEX | 1 |
| . . . | . . . | . . . |

### Table 5.4 — The Publishers Table

| Publisher_ID | Name | URL |
|---|---|---|
| 0201 | Addison-Wesley | www.aw-bc.com |
| 0407 | John Wiley & Sons | www.wiley.com |
| . . . | . . . | . . . |

---

## Join — vì sao phải tách table

> *"Figure 5.3 shows a view of the Books table. Figure 5.4 shows the result of joining this table with the Publishers table. The Books and the Publishers tables each contain an identifier for the publisher. When we join both tables on the publisher code, we obtain a query result made up of values from the joined tables. Each row in the result contains the information about a book, together with the publisher name and web page URL. Note that the publisher names and URLs are duplicated across several rows because we have several books with the same publisher."*

**Dịch:** Table `Books` và table `Publishers` **đều chứa một identifier của publisher**. Khi ta **join hai table theo mã publisher**, ta được một kết quả query gồm giá trị từ cả hai table đã join. **Mỗi row trong kết quả chứa thông tin của một cuốn sách, kèm tên publisher và URL trang web.** Lưu ý là **tên publisher và URL bị lặp lại qua nhiều row** vì có nhiều sách chung một publisher.

> *"The benefit of joining tables is avoiding unnecessary duplication of data in the database tables. For example, a naive database design might have had columns for the publisher name and URL right in the Books table. But then the database itself, and not just the query result, would have many duplicates of these entries. If a publisher's web address changed, all entries would need to be updated. Clearly, this is somewhat error-prone. In the relational model, we distribute data into multiple tables so that no information is unnecessarily duplicated. For example, each publisher's URL is contained only once in the publisher table. If the information needs to be combined, the tables are joined."*

**Dịch:** **Lợi ích của việc join table là tránh trùng lặp dữ liệu không cần thiết trong các table của database.** Ví dụ, một thiết kế ngây thơ có thể đặt luôn column tên publisher và URL ngay trong table `Books`. Nhưng khi đó **bản thân database** — chứ không chỉ kết quả query — **sẽ có rất nhiều bản trùng**. Nếu địa chỉ web của một publisher đổi, **mọi entry đều phải cập nhật**, rõ ràng là **dễ sinh lỗi**. Trong **mô hình relational**, ta **phân tán dữ liệu ra nhiều table sao cho không thông tin nào bị trùng lặp thừa**. Ví dụ URL của mỗi publisher **chỉ nằm đúng một lần** trong table publisher. Khi cần gộp thông tin thì **join các table lại**.

> *"In the figures, you can see a graphical tool to inspect and link the tables. Many vendors have tools to express queries in a simple form by connecting column names and filling information into forms. Such tools are often called query by example (QBE) tools. In contrast, a query that uses SQL is written out in text, using SQL syntax, for example:"*

```sql
SELECT Books.Title, Books.Publisher_Id, Books.Price, Publishers.Name, Publishers.URL
FROM Books, Publishers
WHERE Books.Publisher_Id = Publishers.Publisher_Id
```

**Dịch:** Nhiều vendor có công cụ để diễn đạt query dưới dạng đơn giản bằng cách **nối tên column và điền thông tin vào form** — gọi là công cụ **query by example (QBE)**. Ngược lại, query dùng SQL thì **viết ra thành văn bản theo cú pháp SQL**.

> *"By convention, SQL keywords are written in capital letters, although this is not necessary."*

**Dịch:** Theo quy ước, **keyword SQL viết hoa**, dù điều đó **không bắt buộc**.

---

## SELECT

> *"The SELECT statement is quite flexible. You can simply select all rows in the Books table with the following query:"*

```sql
SELECT * FROM Books
```

> *"The FROM clause is required in every SQL SELECT statement. It tells the database which tables to examine to find the data."*

**Dịch:** Câu lệnh `SELECT` khá linh hoạt. **Mệnh đề `FROM` là bắt buộc trong mọi câu lệnh `SELECT`** — nó cho database biết **phải xem những table nào để tìm dữ liệu**.

> *"You can choose the columns that you want:"*

```sql
SELECT ISBN, Price, Title
FROM Books
```

**Dịch:** Bạn **chọn được những column mình muốn**.

### WHERE

> *"You can restrict the rows in the answer with the WHERE clause:"*

```sql
SELECT ISBN, Price, Title
FROM Books
WHERE Price <= 29.95
```

> *"Be careful with the "equals" comparison. SQL uses = and <>, rather than == or != as in the Java programming language, for equality testing."*

**Dịch:** Dùng mệnh đề `WHERE` để **giới hạn các row trong kết quả**. **Cẩn thận với phép so sánh "bằng":** SQL dùng **`=` và `<>`**, chứ không phải `==` hay `!=` như trong Java.

> **Note (sách):** *"Some database vendors support the use of != for inequality testing. This is not standard SQL, so we recommend against such use."*
>
> **Dịch:** Một số vendor **có hỗ trợ `!=`** để kiểm tra khác nhau. Đây **không phải SQL chuẩn**, sách **khuyến cáo không dùng**.

### LIKE — pattern matching

> *"The WHERE clause can also use pattern matching by means of the LIKE operator. The wildcard characters are not the usual * and ?, however. Use a % for zero or more characters and an underscore for a single character. For example,"*

```sql
SELECT ISBN, Price, Title
FROM Books
WHERE Title NOT LIKE '%n_x%'
```

> *"excludes books with titles that contain words such as Unix or Linux."*

**Dịch:** Mệnh đề `WHERE` cũng **so khớp mẫu (pattern matching)** được nhờ toán tử `LIKE`. Nhưng **ký tự wildcard không phải `*` và `?` như thường lệ**: dùng **`%` cho không hoặc nhiều ký tự** và **dấu gạch dưới `_` cho đúng một ký tự**. Ví dụ trên **loại bỏ các sách có tựa chứa từ như Unix hay Linux**.

> *"Note that strings are enclosed in single quotes, not double quotes. A single quote inside a string is represented by a pair of single quotes. For example,"*

```sql
SELECT Title
FROM Books
WHERE Title LIKE '%''%'
```

> *"reports all titles that contain a single quote."*

**Dịch:** Lưu ý **string được bọc trong nháy đơn, không phải nháy kép**. Một dấu **nháy đơn nằm trong string thì biểu diễn bằng hai dấu nháy đơn liền nhau**. Câu trên **liệt kê mọi tựa sách có chứa dấu nháy đơn**.

### Query nhiều table

> *"You can select data from multiple tables:"*

```sql
SELECT * FROM Books, Publishers
```

> *"Without a WHERE clause, this query is not very interesting. It lists all combinations of rows from both tables. In our case, where Books has 20 rows and Publishers has 8 rows, the result is a set of rows with 20 × 8 entries and lots of duplications. We really want to constrain the query to say that we are only interested in matching books with their publishers:"*

```sql
SELECT * FROM Books, Publishers
WHERE Books.Publisher_Id = Publishers.Publisher_Id
```

> *"This query result has 20 rows, one for each book, because each book has one publisher in the Publisher table."*

**Dịch:** Không có mệnh đề `WHERE` thì query này **không thú vị lắm**: nó liệt kê **mọi tổ hợp row từ cả hai table**. Trong ví dụ, `Books` có 20 row và `Publishers` có 8 row, kết quả là **20 × 8 entry với rất nhiều trùng lặp**. Ta thực sự muốn **ràng buộc query** để chỉ quan tâm tới **cặp sách khớp với publisher của nó**. Kết quả khi đó có **20 row, mỗi row một cuốn sách**, vì mỗi sách có đúng một publisher trong table `Publisher`.

> *"Whenever you have multiple tables in a query, the same column name can occur in two different places. That happened in our example. There is a column called Publisher_Id in both the Books and the Publishers tables. When an ambiguity would otherwise result, you must prefix each column name with the name of the table to which it belongs, such as Books.Publisher_Id."*

**Dịch:** Khi query có nhiều table, **cùng một tên column có thể xuất hiện ở hai chỗ khác nhau**. Chuyện đó xảy ra trong ví dụ: column `Publisher_Id` có ở **cả** `Books` lẫn `Publishers`. Khi có nguy cơ **nhập nhằng**, bạn **phải thêm tiền tố tên table vào trước tên column**, chẳng hạn `Books.Publisher_Id`.

---

## UPDATE, DELETE, INSERT

> *"You can use SQL to change the data inside a database as well. For example, suppose you want to reduce by $5.00 the current price of all books that have "C++" in their title:"*

```sql
UPDATE Books
SET Price = Price - 5.00
WHERE Title LIKE '%C++%'
```

**Dịch:** SQL cũng **thay đổi được dữ liệu bên trong database**. Ví dụ trên **giảm $5.00 giá của mọi cuốn sách có "C++" trong tựa**.

> *"Similarly, to delete all C++ books, use a DELETE query:"*

```sql
DELETE FROM Books
WHERE Title LIKE '%C++%'
```

**Dịch:** Tương tự, để **xoá** mọi sách C++ thì dùng query `DELETE`.

> *"SQL comes with built-in functions for taking averages, finding maximums and minimums in a column, and so on, which we do not discuss here."*

**Dịch:** SQL có sẵn **các function dựng sẵn** để tính trung bình, tìm giá trị lớn nhất/nhỏ nhất trong một column, v.v. — **sách không bàn tới ở đây**.

> *"Typically, to insert values into a table, you can use the INSERT statement:"*

```sql
INSERT INTO Books
VALUES ('A Guide to the SQL Standard', '0-201-96426-0', '0201', 47.95)
```

> *"You need a separate INSERT statement for every row being inserted in the table."*

**Dịch:** Để chèn giá trị vào table thì dùng câu lệnh `INSERT`. **Mỗi row được chèn cần một câu lệnh `INSERT` riêng.**

---

## CREATE TABLE

> *"Of course, before you can query, modify, and insert data, you must have a place to store data. Use the CREATE TABLE statement to make a new table. Specify the name and data type for each column. For example,"*

```sql
CREATE TABLE Books
(
    Title CHAR(60),
    ISBN CHAR(13),
    Publisher_Id CHAR(6),
    Price DECIMAL(10,2)
)
```

**Dịch:** Tất nhiên, trước khi query, sửa và chèn dữ liệu, bạn phải **có chỗ để lưu dữ liệu**. Dùng câu lệnh `CREATE TABLE` để **tạo table mới**, chỉ rõ **tên và kiểu dữ liệu cho từng column**.

> *"In this book, we do not discuss the additional clauses, such as keys and constraints, that you can use with the CREATE TABLE statement."*

**Dịch:** Sách **không bàn tới các mệnh đề bổ sung** như key và constraint dùng được với `CREATE TABLE`.

### Table 5.5 — Common SQL Data Types

| Data Types | Description | Dịch |
|---|---|---|
| `INTEGER` hoặc `INT` | Typically, a 32-bit integer | Thường là số nguyên 32-bit |
| `SMALLINT` | Typically, a 16-bit integer | Thường là số nguyên 16-bit |
| `NUMERIC(m,n)`, `DECIMAL(m,n)` hoặc `DEC(m,n)` | Fixed-point decimal number with m total digits and n digits after the decimal point | Số thập phân dấu chấm tĩnh, tổng `m` chữ số và `n` chữ số sau dấu thập phân |
| `FLOAT(n)` | A floating-point number with n binary digits of precision | Số dấu chấm động với độ chính xác `n` chữ số nhị phân |
| `REAL` | Typically, a 32-bit floating-point number | Thường là số dấu chấm động 32-bit |
| `DOUBLE` | Typically, a 64-bit floating-point number | Thường là số dấu chấm động 64-bit |
| `CHARACTER(n)` hoặc `CHAR(n)` | Fixed-length string of length n | String **độ dài cố định** `n` |
| `VARCHAR(n)` | Variable-length strings of maximum length n | String **độ dài thay đổi**, tối đa `n` |
| `BOOLEAN` | A Boolean value | Giá trị boolean |
| `DATE` | Calendar date, implementation-dependent | Ngày lịch, **phụ thuộc implementation** |
| `TIME` | Time of day, implementation-dependent | Giờ trong ngày, **phụ thuộc implementation** |
| `TIMESTAMP` | Date and time of day, implementation-dependent | Ngày và giờ, **phụ thuộc implementation** |
| `BLOB` | A binary large object | Binary large object |
| `CLOB` | A character large object | Character large object |

---

## Bài kế tiếp

→ [[03 - JDBC Configuration]] — database URL, driver JAR file, khởi động database, đăng ký driver class và mở connection.
