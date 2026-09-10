# 05 — Query Execution

> Chapter 5, Section 5.5 — Core Java Volume II: Advanced Features, 11th Edition (Horstmann), Java 11.
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 5.5. Query Execution

> *"In this section, we write a program that executes queries against the COREJAVA database. For this program to work, you must have a COREJAVA database populated with tables as described in the preceding section."*

**Dịch:** Phần này viết một chương trình **chạy query lên database `COREJAVA`**. Để chương trình chạy được, bạn phải có database `COREJAVA` **đã nạp table** như mô tả ở phần trước.

> *"When querying the database, you can select the author and the publisher or leave either of them as Any."*

**Dịch:** Khi query database, bạn **chọn author và publisher**, hoặc **để một trong hai là `Any`**.

> *"You can also change the data in the database. Select a publisher and type an amount. All prices of that publisher are adjusted by the amount you entered, and the program displays how many rows were changed. After a price change, you might want to run a query to verify the new prices."*

**Dịch:** Bạn cũng **thay đổi được dữ liệu**. Chọn một publisher và nhập một số tiền; **mọi giá của publisher đó được điều chỉnh theo số đã nhập**, và chương trình **hiển thị số row bị thay đổi**. Sau khi đổi giá, bạn có thể chạy query để **kiểm chứng giá mới**.

---

## 5.5.1. Prepared Statements

> *"In this program, we use one new feature, prepared statements. Consider the SQL query for all books by a particular publisher, regardless of the author:"*

```sql
SELECT Books.Price, Books.Title
FROM Books, Publishers
WHERE Books.Publisher_Id = Publishers.Publisher_Id
AND Publishers.Name = the name from the list box
```

**Dịch:** Chương trình này dùng một tính năng mới: **prepared statement**. Xét query lấy mọi sách của một publisher cụ thể, bất kể author.

> *"Instead of building a separate query statement every time the user launches such a query, we can prepare a query with a host variable and use it many times, each time filling in a different string for the variable. That technique improves performance. Whenever the database executes a query, it first computes a strategy of how to do it efficiently. By preparing the query and reusing it, you ensure that the planning step is done only once."*

**Dịch:** Thay vì **dựng một câu query riêng mỗi lần** người dùng chạy, ta **chuẩn bị (prepare) một query có host variable** và **dùng lại nhiều lần**, mỗi lần điền một string khác cho biến đó. Kỹ thuật này **cải thiện hiệu năng**: mỗi khi database chạy một query, nó **tính trước một chiến lược (strategy)** để làm việc đó cho hiệu quả. Bằng cách prepare query rồi dùng lại, bạn **đảm bảo bước lập kế hoạch chỉ làm MỘT lần**.

> *"Each host variable in a prepared query is indicated with a ?. If there is more than one variable, you must keep track of the positions of the ? when setting the values. For example, our prepared query becomes"*

```java
String publisherQuery
    = "SELECT Books.Price, Books.Title"
    + " FROM Books, Publishers"
    + " WHERE Books.Publisher_Id = Publishers.Publisher_Id AND Publishers.Name = ?";
PreparedStatement stat = conn.prepareStatement(publisherQuery);
```

**Dịch:** **Mỗi host variable trong prepared query được ký hiệu bằng `?`**. Nếu có nhiều hơn một biến, bạn **phải theo dõi vị trí của các `?`** khi set giá trị.

> *"Before executing the prepared statement, you must bind the host variables to actual values with a set method. As with the get methods of the ResultSet interface, there are different set methods for the various types. Here, we want to set a string to a publisher name:"*

```java
stat.setString(1, publisher);
```

> *"The first argument is the position number of the host variable that we want to set. The position 1 denotes the first ?. The second argument is the value that we want to assign to the host variable."*

**Dịch:** Trước khi chạy prepared statement, bạn **phải bind host variable với giá trị thật bằng một method `set`**. Giống như các method `get` của `ResultSet`, **có method `set` khác nhau cho từng kiểu**. Argument thứ nhất là **số thứ tự vị trí** của host variable muốn set — **vị trí 1 ứng với `?` đầu tiên**. Argument thứ hai là **giá trị muốn gán**.

> *"If you reuse a prepared query that you have already executed, all host variables stay bound unless you change them with a set method or call the clearParameters method. That means you only need to call a setXxx method on those host variables that change from one query to the next."*

**Dịch:** Nếu bạn **dùng lại một prepared query đã chạy**, **mọi host variable vẫn giữ nguyên binding** trừ khi bạn đổi bằng method `set` hoặc gọi **`clearParameters`**. Nghĩa là bạn **chỉ cần gọi `setXxx` cho những host variable thay đổi** giữa query này và query kế.

> *"Once all variables have been bound to values, you can execute the prepared statement:"*

```java
ResultSet rs = stat.executeQuery();
```

**Dịch:** Khi mọi biến đã được bind giá trị thì **chạy prepared statement**.

> **Tip (sách):** *"Building a query manually, by concatenating strings, is tedious and potentially dangerous. You have to worry about special characters such as quotes—and, if your query involves user input, you have to guard against injection attacks. Therefore, use prepared statements whenever your query involves variables."*
>
> **Dịch:** Dựng query thủ công bằng cách **nối string là việc lằng nhằng và tiềm ẩn nguy hiểm**. Bạn phải lo về **ký tự đặc biệt như dấu nháy** — và nếu query có **input của người dùng**, bạn phải **đề phòng injection attack**. Vì vậy: **dùng prepared statement mỗi khi query có biến**.

> *"The price update feature is implemented as an UPDATE statement. Note that we call executeUpdate, not executeQuery, because the UPDATE statement does not return a result set. The return value of executeUpdate is the count of changed rows."*

```java
int r = stat.executeUpdate();
System.out.println(r + " rows updated");
```

**Dịch:** Chức năng cập nhật giá được implement bằng câu lệnh `UPDATE`. Lưu ý ta gọi **`executeUpdate`, không phải `executeQuery`**, vì câu lệnh `UPDATE` **không trả về result set**. Giá trị trả về của `executeUpdate` là **số row bị thay đổi**.

> **Note (sách):** *"A PreparedStatement object becomes invalid after the associated Connection object is closed. However, many databases automatically cache prepared statements. If the same query is prepared twice, the database simply reuses the query strategy. Therefore, don't worry about the overhead of calling prepareStatement."*
>
> **Dịch:** Một `PreparedStatement` object **trở nên vô hiệu sau khi `Connection` object gắn với nó bị đóng**. Tuy nhiên **nhiều database tự động cache prepared statement**: nếu cùng một query được prepare hai lần, database **chỉ việc dùng lại chiến lược query**. Vì vậy **đừng lo về chi phí gọi `prepareStatement`**.

### Cấu trúc chương trình ví dụ

> *"The following list briefly describes the structure of the example program:"*

> *"The author and publisher array lists are populated by running two queries that return all author and publisher names in the database."*

**Dịch:** Hai array list author và publisher được nạp bằng **hai query trả về mọi tên author và publisher** trong database.

> *"The queries involving authors are complex. A book can have multiple authors, so the BooksAuthors table stores the correspondence between authors and books. For example, the book with ISBN 0-201-96426-0 has two authors with codes DATE and DARW. The BooksAuthors table has the rows"*

```
0-201-96426-0, DATE, 1
0-201-96426-0, DARW, 2
```

> *"to indicate this fact. The third column lists the order of the authors. (We can't just use the position of the rows in the table. There is no fixed row ordering in a relational table.) Thus, the query has to join the Books, BooksAuthors, and Authors tables to compare the author name with the one selected by the user."*

```sql
SELECT Books.Price, Books.Title FROM Books, BooksAuthors, Authors, Publishers
WHERE Authors.Author_Id = BooksAuthors.Author_Id AND BooksAuthors.ISBN = Books.ISBN
AND Books.Publisher_Id = Publishers.Publisher_Id AND Authors.Name = ?
AND Publishers.Name = ?
```

**Dịch:** Các query liên quan tới author thì **phức tạp**. Một cuốn sách **có thể có nhiều author**, nên table `BooksAuthors` lưu **quan hệ tương ứng giữa author và sách**. **Column thứ ba liệt kê thứ tự các author** — ta **không thể chỉ dựa vào vị trí của row trong table**, vì **relational table không có thứ tự row cố định**. Do đó query phải **join ba table `Books`, `BooksAuthors`, `Authors`** để so tên author với tên người dùng chọn.

> **Tip (sách):** *"Some Java programmers avoid complex SQL statements such as this one. A surprisingly common, but very inefficient, workaround is to write lots of Java code that iterates through multiple result sets. But the database is a lot better at executing query code than a Java program can be—that's the core competency of a database. A rule of thumb: If you can do it in SQL, don't do it in Java."*
>
> **Dịch:** Một số lập trình viên Java **né các câu SQL phức tạp** như thế này. Cách lách **phổ biến đến bất ngờ nhưng cực kỳ kém hiệu quả** là viết cả đống code Java lặp qua nhiều result set. Nhưng **database chạy code query giỏi hơn chương trình Java rất nhiều** — đó là **năng lực cốt lõi của database**. **Quy tắc ngón tay cái: làm được bằng SQL thì đừng làm bằng Java.**

> *"The changePrices method executes an UPDATE statement. Note that the WHERE clause of the UPDATE statement needs the publisher code and we only know the publisher name. This problem is solved with a nested subquery:"*

```sql
UPDATE Books
SET Price = Price + ?
WHERE Books.Publisher_Id = (SELECT Publisher_Id FROM Publishers WHERE Name = ?)
```

**Dịch:** Method `changePrices` chạy một câu lệnh `UPDATE`. Lưu ý mệnh đề `WHERE` của `UPDATE` **cần mã publisher** mà ta **chỉ biết tên publisher**. Vấn đề này giải bằng một **subquery lồng nhau**.

---

### Listing 5.3 — `query/QueryTest.java`

```java
package query;

import java.io.*;
import java.nio.file.*;
import java.sql.*;
import java.util.*;

/**
 * This program demonstrates several complex database queries.
 * @version 1.31 2018-05-01
 * @author Cay Horstmann
 */
public class QueryTest
{
    private static final String allQuery = "SELECT Books.Price, Books.Title FROM Books";

    private static final String authorPublisherQuery = "SELECT Books.Price, Books.Title"
        + " FROM Books, BooksAuthors, Authors, Publishers"
        + " WHERE Authors.Author_Id = BooksAuthors.Author_Id AND BooksAuthors.ISBN = Books.ISBN"
        + " AND Books.Publisher_Id = Publishers.Publisher_Id AND Authors.Name = ?"
        + " AND Publishers.Name = ?";

    private static final String authorQuery
        = "SELECT Books.Price, Books.Title FROM Books, BooksAuthors, Authors"
        + " WHERE Authors.Author_Id = BooksAuthors.Author_Id"
        + " AND BooksAuthors.ISBN = Books.ISBN"
        + " AND Authors.Name = ?";

    private static final String publisherQuery
        = "SELECT Books.Price, Books.Title FROM Books, Publishers"
        + " WHERE Books.Publisher_Id = Publishers.Publisher_Id AND Publishers.Name = ?";

    private static final String priceUpdate = "UPDATE Books SET Price = Price + ? "
        + " WHERE Books.Publisher_Id = (SELECT Publisher_Id FROM Publishers WHERE Name = ?)";

    private static Scanner in;
    private static ArrayList<String> authors = new ArrayList<>();
    private static ArrayList<String> publishers = new ArrayList<>();

    public static void main(String[] args) throws IOException
    {
        try (Connection conn = getConnection())
        {
            in = new Scanner(System.in);
            authors.add("Any");
            publishers.add("Any");
            try (Statement stat = conn.createStatement())
            {
                // Fill the authors array list
                var query = "SELECT Name FROM Authors";
                try (ResultSet rs = stat.executeQuery(query))
                {
                    while (rs.next())
                        authors.add(rs.getString(1));
                }

                // Fill the publishers array list
                query = "SELECT Name FROM Publishers";
                try (ResultSet rs = stat.executeQuery(query))
                {
                    while (rs.next())
                        publishers.add(rs.getString(1));
                }
            }
            var done = false;
            while (!done)
            {
                System.out.print("Q)uery C)hange prices E)xit: ");
                String input = in.next().toUpperCase();
                if (input.equals("Q"))
                    executeQuery(conn);
                else if (input.equals("C"))
                    changePrices(conn);
                else
                    done = true;
            }
        }
        catch (SQLException e)
        {
            for (Throwable t : e)
                System.out.println(t.getMessage());
        }
    }

    /**
     * Executes the selected query.
     * @param conn the database connection
     */
    private static void executeQuery(Connection conn) throws SQLException
    {
        String author = select("Authors:", authors);
        String publisher = select("Publishers:", publishers);
        PreparedStatement stat;
        if (!author.equals("Any") && !publisher.equals("Any"))
        {
            stat = conn.prepareStatement(authorPublisherQuery);
            stat.setString(1, author);
            stat.setString(2, publisher);
        }
        else if (!author.equals("Any") && publisher.equals("Any"))
        {
            stat = conn.prepareStatement(authorQuery);
            stat.setString(1, author);
        }
        else if (author.equals("Any") && !publisher.equals("Any"))
        {
            stat = conn.prepareStatement(publisherQuery);
            stat.setString(1, publisher);
        }
        else
            stat = conn.prepareStatement(allQuery);

        try (ResultSet rs = stat.executeQuery())
        {
            while (rs.next())
                System.out.println(rs.getString(1) + ", " + rs.getString(2));
        }
    }

    /**
     * Executes an update statement to change prices.
     * @param conn the database connection
     */
    public static void changePrices(Connection conn) throws SQLException
    {
        String publisher = select("Publishers:", publishers.subList(1, publishers.size()));
        System.out.print("Change prices by: ");
        double priceChange = in.nextDouble();
        PreparedStatement stat = conn.prepareStatement(priceUpdate);
        stat.setDouble(1, priceChange);
        stat.setString(2, publisher);
        int r = stat.executeUpdate();
        System.out.println(r + " records updated.");
    }

    /**
     * Asks the user to select a string.
     * @param prompt the prompt to display
     * @param options the options from which the user can choose
     * @return the option that the user chose
     */
    public static String select(String prompt, List<String> options)
    {
        while (true)
        {
            System.out.println(prompt);
            for (int i = 0; i < options.size(); i++)
                System.out.printf("%2d) %s%n", i + 1, options.get(i));
            int sel = in.nextInt();
            if (sel > 0 && sel <= options.size())
                return options.get(sel - 1);
        }
    }

    /**
     * Gets a connection from the properties specified in the file database.properties.
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
}
```

### API — `java.sql.Connection` 1.1

| Method | Mô tả |
|---|---|
| `PreparedStatement prepareStatement(String sql)` | Trả về một `PreparedStatement` object chứa **câu lệnh đã được biên dịch trước (precompiled)**. String `sql` chứa câu lệnh SQL với **một hoặc nhiều parameter placeholder ký hiệu bằng `?`** |

### API — `java.sql.PreparedStatement` 1.1

| Method | Mô tả |
|---|---|
| `void setXxx(int n, Xxx x)` | (`Xxx` là kiểu như `int`, `double`, `String`, `Date`, …) **Set giá trị của parameter thứ `n` thành `x`** |
| `void clearParameters()` | **Xoá mọi parameter hiện tại** trong prepared statement |
| `ResultSet executeQuery()` | Chạy prepared SQL query và **trả về một `ResultSet`** |
| `int executeUpdate()` | Chạy câu lệnh `INSERT`, `UPDATE`, `DELETE` mà `PreparedStatement` biểu diễn. Trả về **số row bị ảnh hưởng**, hoặc **0** với câu lệnh DDL như `CREATE TABLE` |

---

## 5.5.2. Reading and Writing LOBs

> *"In addition to numbers, strings, and dates, many databases can store large objects (LOBs) such as images or other data. In SQL, binary large objects are called BLOBs, and character large objects are called CLOBs."*

**Dịch:** Ngoài số, string và date, **nhiều database lưu được large object (LOB)** như hình ảnh hoặc dữ liệu khác. Trong SQL, **binary large object gọi là BLOB**, **character large object gọi là CLOB**.

> *"To read a LOB, execute a SELECT statement and call the getBlob or getClob method on the ResultSet. You will get an object of type Blob or Clob. To get the binary data from a Blob, call the getBytes or getBinaryStream. For example, if you have a table with book cover images, you can retrieve an image like this:"*

```java
PreparedStatement stat = conn.prepareStatement("SELECT Cover FROM BookCovers WHERE ISBN=?");
. . .
stat.set(1, isbn);
try (ResultSet result = stat.executeQuery())
{
    if (result.next())
    {
        Blob coverBlob = result.getBlob(1);
        Image coverImage = ImageIO.read(coverBlob.getBinaryStream());
    }
}
```

**Dịch:** Để **đọc một LOB**, chạy câu lệnh `SELECT` rồi gọi **`getBlob` hoặc `getClob`** trên `ResultSet`. Bạn nhận được một object kiểu `Blob` hoặc `Clob`. Để lấy dữ liệu nhị phân từ `Blob`, gọi **`getBytes` hoặc `getBinaryStream`** (xem [[06 - Input and Output]]).

> *"Similarly, if you retrieve a Clob object, you can get character data by calling the getSubString or getCharacterStream method."*

**Dịch:** Tương tự, nếu lấy được một `Clob` object, bạn lấy dữ liệu ký tự bằng cách gọi **`getSubString` hoặc `getCharacterStream`**.

> *"To place a LOB into a database, call createBlob or createClob on your Connection object, get an output stream or writer to the LOB, write the data, and store the object in the database. For example, here is how you store an image:"*

```java
Blob coverBlob = connection.createBlob();
int offset = 0;
OutputStream out = coverBlob.setBinaryStream(offset);
ImageIO.write(coverImage, "PNG", out);
PreparedStatement stat = conn.prepareStatement("INSERT INTO Cover VALUES (?, ?)");
stat.set(1, isbn);
stat.set(2, coverBlob);
stat.executeUpdate();
```

**Dịch:** Để **đưa một LOB vào database**: gọi **`createBlob` hoặc `createClob`** trên `Connection` object, **lấy output stream hoặc writer** tới LOB đó, **ghi dữ liệu**, rồi **lưu object vào database**.

### API — `java.sql.ResultSet` 1.1

| Method | Mô tả |
|---|---|
| `Blob getBlob(int columnIndex)` **1.2**<br>`Blob getBlob(String columnLabel)` **1.2**<br>`Clob getClob(int columnIndex)` **1.2**<br>`Clob getClob(String columnLabel)` **1.2** | Lấy **BLOB hoặc CLOB** ở column đã cho |

### API — `java.sql.Blob` 1.2

| Method | Mô tả |
|---|---|
| `long length()` | Lấy **độ dài** của BLOB này |
| `byte[] getBytes(long startPosition, long length)` | Lấy dữ liệu trong **khoảng đã cho** của BLOB |
| `InputStream getBinaryStream()`<br>`InputStream getBinaryStream(long startPosition, long length)` | Trả về **stream để đọc** dữ liệu từ BLOB này hoặc từ khoảng đã cho |
| `OutputStream setBinaryStream(long startPosition)` **1.4** | Trả về **output stream để ghi** vào BLOB này, bắt đầu từ vị trí đã cho |

### API — `java.sql.Clob` 1.4

| Method | Mô tả |
|---|---|
| `long length()` | Lấy **số ký tự** của CLOB này |
| `String getSubString(long startPosition, long length)` | Lấy các ký tự trong khoảng đã cho của CLOB |
| `Reader getCharacterStream()`<br>`Reader getCharacterStream(long startPosition, long length)` | Trả về một **reader (không phải stream)** để đọc ký tự từ CLOB này hoặc từ khoảng đã cho |
| `Writer setCharacterStream(long startPosition)` **1.4** | Trả về một **writer (không phải stream)** để ghi vào CLOB này, bắt đầu từ vị trí đã cho |

### API — `java.sql.Connection` 1.1

| Method | Mô tả |
|---|---|
| `Blob createBlob()` **6**<br>`Clob createClob()` **6** | Tạo một **BLOB hoặc CLOB rỗng** |

---

## 5.5.3. SQL Escapes

> *"The "escape" syntax features are commonly supported by databases but use database-specific syntax variations. It is the job of the JDBC driver to translate the escape syntax to the syntax of a particular database."*

**Dịch:** Các tính năng cú pháp **"escape"** được đa số database hỗ trợ nhưng **mỗi database lại có biến thể cú pháp riêng**. **Nhiệm vụ của JDBC driver là dịch cú pháp escape sang cú pháp của database cụ thể.**

> *"Escapes are provided for the following features:"*
>
> - *"Date and time literals"*
> - *"Calling scalar functions"*
> - *"Calling stored procedures"*
> - *"Outer joins"*
> - *"The escape character in LIKE clauses"*

**Dịch:** Escape được cung cấp cho các tính năng: **date và time literal** · **gọi scalar function** · **gọi stored procedure** · **outer join** · **ký tự escape trong mệnh đề `LIKE`**.

### Date và time literal

> *"Date and time literals vary widely among databases. To embed a date or time literal, specify the value in the ISO 8601 format (www.cl.cam.ac.uk/~mgk25/iso-time.html). The driver will then translate it into the native format. Use d, t, ts for DATE, TIME, or TIMESTAMP values:"*

```
{d '2008-01-24'}
{t '23:59:59'}
{ts '2008-01-24 23:59:59.999'}
```

**Dịch:** Date và time literal **khác nhau rất nhiều giữa các database**. Để nhúng một date/time literal, **chỉ định giá trị ở định dạng ISO 8601**; **driver sẽ dịch nó sang định dạng bản địa**. Dùng **`d`, `t`, `ts`** cho giá trị `DATE`, `TIME`, `TIMESTAMP`. (Xem thêm [[01 - The Time Line]] về date/time trong Java.)

### Scalar function

> *"A scalar function is a function that returns a single value. Many functions are widely available in databases, but with varying names. The JDBC specification provides standard names and translates them into the database-specific names. To call a function, embed the standard function name and arguments like this:"*

```
{fn left(?, 20)}
{fn user()}
```

> *"You can find a complete list of supported function names in the JDBC specification."*

**Dịch:** **Scalar function là function trả về MỘT giá trị duy nhất.** Nhiều function có rộng rãi trong các database nhưng **tên khác nhau**. JDBC specification **cung cấp tên chuẩn và dịch chúng sang tên riêng của database**. Danh sách đầy đủ tên function được hỗ trợ nằm trong JDBC specification.

### Stored procedure

> *"A stored procedure is a procedure that executes in the database, written in a database-specific language. To call a stored procedure, use the call escape. You need not supply parentheses if the procedure has no parameters. Use = to capture a return value:"*

```
{call PROC1(?, ?)}
{call PROC2}
{call ? = PROC3(?)}
```

**Dịch:** **Stored procedure là procedure chạy bên trong database**, viết bằng **ngôn ngữ riêng của database**. Để gọi stored procedure thì dùng escape **`call`**. **Không cần đưa dấu ngoặc nếu procedure không có parameter.** Dùng **`=` để bắt giá trị trả về**.

### Outer join

> *"An outer join of two tables does not require that the rows of each table match according to the join condition. For example, the query"*

```sql
SELECT * FROM {oj Books LEFT OUTER JOIN Publishers
ON Books.Publisher_Id = Publisher.Publisher_Id}
```

> *"contains books for which Publisher_Id has no match in the Publishers table, with NULL values to indicate that no match exists. You would need a RIGHT OUTER JOIN to include publishers without matching books, or a FULL OUTER JOIN to return both. The escape syntax is needed because not all databases use a standard notation for these joins."*

**Dịch:** **Outer join của hai table không đòi hỏi row của mỗi table phải khớp theo điều kiện join.** Query trên **bao gồm cả những cuốn sách mà `Publisher_Id` không khớp gì trong table `Publishers`**, với **giá trị `NULL`** để báo là **không tồn tại cặp khớp**. Bạn cần **`RIGHT OUTER JOIN`** để bao gồm publisher không có sách khớp, hoặc **`FULL OUTER JOIN`** để trả về cả hai. **Cần cú pháp escape vì không phải database nào cũng dùng ký pháp chuẩn cho các join này.**

### Escape character trong LIKE

> *"Finally, the _ and % characters have special meanings in a LIKE clause—to match a single character or a sequence of characters. There is no standard way to use them literally. If you want to match all strings containing a _, use this construct:"*

```sql
. . . WHERE ? LIKE %!_% {escape '!'}
```

> *"Here we define ! as the escape character. The combination !_ denotes a literal underscore."*

**Dịch:** Cuối cùng, ký tự **`_` và `%` có nghĩa đặc biệt trong mệnh đề `LIKE`** — khớp một ký tự hoặc một dãy ký tự. **Không có cách chuẩn để dùng chúng theo nghĩa đen.** Nếu muốn khớp mọi string chứa dấu `_`, dùng cấu trúc trên: ở đây ta **định nghĩa `!` là escape character**, và tổ hợp **`!_` chỉ một dấu gạch dưới theo nghĩa đen**.

---

## 5.5.4. Multiple Results

> *"It is possible for a query to return multiple results. This can happen when executing a stored procedure, or with databases that also allow submission of multiple SELECT statements in a single query. Here is how you retrieve all result sets:"*

**Dịch:** **Một query có thể trả về NHIỀU kết quả.** Chuyện này xảy ra khi **chạy stored procedure**, hoặc với database **cho phép gửi nhiều câu `SELECT` trong một query**. Cách lấy mọi result set:

> *"1. Use the execute method to execute the SQL statement."*
> *"2. Retrieve the first result or update count."*
> *"3. Repeatedly call the getMoreResults method to move on to the next result set."*
> *"4. Finish when there are no more result sets or update counts."*

**Dịch:** **1.** Dùng method `execute` để chạy câu lệnh SQL. **2.** Lấy **kết quả đầu tiên hoặc update count**. **3.** **Gọi lặp lại `getMoreResults`** để chuyển sang result set kế tiếp. **4.** **Kết thúc khi không còn result set hay update count nào.**

> *"The execute and getMoreResults methods return true if the next item in the chain is a result set. The getUpdateCount method returns -1 if the next item in the chain is not an update count."*

**Dịch:** Method `execute` và `getMoreResults` **trả về `true` nếu mục kế tiếp trong chuỗi là một result set**. Method `getUpdateCount` **trả về `-1` nếu mục kế tiếp trong chuỗi không phải update count**.

> *"The following loop traverses all results:"*

```java
boolean isResult = stat.execute(command);
boolean done = false;
while (!done)
{
    if (isResult)
    {
        ResultSet result = stat.getResultSet();
        do something with result
    }
    else
    {
        int updateCount = stat.getUpdateCount();
        if (updateCount >= 0)
            do something with updateCount
        else
            done = true;
    }
    if (!done) isResult = stat.getMoreResults();
}
```

### API — `java.sql.Statement` 1.1

| Method | Mô tả |
|---|---|
| `boolean getMoreResults()`<br>`boolean getMoreResults(int current)` **6** | Lấy kết quả kế tiếp của statement này. Parameter `current` là một trong **`CLOSE_CURRENT_RESULT` (mặc định)**, `KEEP_CURRENT_RESULT`, hoặc `CLOSE_ALL_RESULTS`. Trả về `true` nếu kết quả kế tiếp tồn tại và **là một result set** |

---

## 5.5.5. Retrieving Autogenerated Keys

> *"Most databases support some mechanism for autonumbering rows in a database. Unfortunately, the mechanisms differ widely among vendors. These automatic numbers are often used as primary keys. Although JDBC doesn't offer a vendor-independent solution for generating keys, it does provide an efficient way of retrieving them. When you insert a new row into a table and a key is automatically generated, you can retrieve it with the following code:"*

```java
stat.executeUpdate(insertStatement, Statement.RETURN_GENERATED_KEYS);
ResultSet rs = stat.getGeneratedKeys();
if (rs.next())
{
    int key = rs.getInt(1);
    . . .
}
```

**Dịch:** Đa số database hỗ trợ **cơ chế tự đánh số row**. Đáng tiếc là **cơ chế này khác nhau rất nhiều giữa các vendor**. Những số tự động này **thường được dùng làm primary key**. Dù JDBC **không cung cấp giải pháp sinh key độc lập vendor**, nó **có cách hiệu quả để lấy chúng về**. Khi bạn chèn một row mới vào table và một key được tự sinh, bạn lấy nó bằng code trên.

### API — `java.sql.Statement` 1.1

| Method | Mô tả |
|---|---|
| `boolean execute(String statement, int autogenerated)` **1.4**<br>`int executeUpdate(String statement, int autogenerated)` **1.4** | Chạy câu lệnh SQL đã cho như mô tả trước đó. Nếu `autogenerated` được đặt là **`Statement.RETURN_GENERATED_KEYS`** và câu lệnh là `INSERT`, thì **column đầu tiên chứa key tự sinh** |

---

## Bài kế tiếp

→ [[06 - Scrollable and Updatable Result Sets]] — di chuyển tới lui trong result set và cập nhật dữ liệu ngay trên result set.
