# 03 — JDBC Configuration

> Chapter 5, Section 5.3 — Core Java Volume II: Advanced Features, 11th Edition (Horstmann), Java 11.
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 5.3. JDBC Configuration

> *"Of course, you need a database program for which a JDBC driver is available. There are many excellent choices, such as IBM DB2, Microsoft SQL Server, MySQL, Oracle, and PostgreSQL."*

**Dịch:** Đương nhiên bạn cần **một chương trình database có sẵn JDBC driver**. Có nhiều lựa chọn tốt: IBM DB2, Microsoft SQL Server, MySQL, Oracle, PostgreSQL.

> *"You must also create a database for your experimental use. We assume you name it COREJAVA. Create a new database, or have your database administrator create one with the appropriate permissions. You need to be able to create, update, and drop tables in the database."*

**Dịch:** Bạn cũng phải **tạo một database để thí nghiệm**. Sách giả định bạn đặt tên là **`COREJAVA`**. Tự tạo database mới, hoặc nhờ database administrator tạo với **quyền phù hợp**. Bạn cần **tạo, cập nhật và xoá (drop) table được** trong database đó.

> *"If you have never installed a client/server database before, you might find setting up the database to be somewhat complex—diagnosing causes of failure can be difficult. It might be best to seek expert help if your setup is not working correctly."*

**Dịch:** Nếu bạn chưa từng cài database client/server, việc dựng database có thể **khá phức tạp** — **chẩn đoán nguyên nhân lỗi rất khó**. Tốt nhất nên **nhờ người có kinh nghiệm** nếu setup không chạy đúng.

> *"If this is your first experience with databases, we recommend that you use the Apache Derby database, which is available from http://db.apache.org/derby."*

**Dịch:** Nếu đây là lần đầu bạn tiếp xúc database, sách khuyên dùng **Apache Derby**.

> *"You need to gather a number of items before you can write your first database program. The following sections cover these items."*

**Dịch:** Bạn cần chuẩn bị **một số thứ** trước khi viết chương trình database đầu tiên; các phần sau nói về chúng.

---

## 5.3.1. Database URLs

> *"When connecting to a database, you must use various database-specific parameters such as host names, port numbers, and database names."*

**Dịch:** Khi kết nối tới database, bạn phải dùng **các parameter riêng của từng database** như **host name, port number, database name**.

> *"JDBC uses a syntax similar to that of ordinary URLs to describe data sources. Here are examples of the syntax:"*

```
jdbc:derby://localhost:1527/COREJAVA;create=true
jdbc:postgresql:COREJAVA
```

> *"These JDBC URLs specify a Derby database and a PostgreSQL database named COREJAVA."*

**Dịch:** JDBC dùng **cú pháp giống URL thông thường** để mô tả data source. Hai URL trên chỉ định một database **Derby** và một database **PostgreSQL** tên `COREJAVA`.

> *"The general syntax is"*

```
jdbc:subprotocol:other stuff
```

> *"where a subprotocol selects the specific driver for connecting to the database. The format for the other stuff depends on the subprotocol used. You will need to look up your vendor's documentation for the specific format."*

**Dịch:** Cú pháp tổng quát như trên, trong đó **subprotocol chọn ra driver cụ thể** để kết nối tới database. **Định dạng của phần "other stuff" phụ thuộc vào subprotocol** đang dùng — phải **tra tài liệu của vendor** để biết định dạng cụ thể.

---

## 5.3.2. Driver JAR Files

> *"You need to obtain the JAR file in which the driver for your database is located. If you use Derby, you need the file derbyclient.jar. With another database, you need to locate the appropriate driver. For example, the PostgreSQL drivers are available at http://jdbc.postgresql.org."*

**Dịch:** Bạn cần lấy **file JAR chứa driver** của database mình dùng. Với Derby là file **`derbyclient.jar`**. Với database khác thì phải tìm driver tương ứng; ví dụ driver PostgreSQL có tại `http://jdbc.postgresql.org`.

> *"Include the driver JAR file on the class path when running a program that accesses the database. (You don't need the JAR file for compiling.)"*

**Dịch:** **Đưa file JAR của driver vào class path khi chạy** chương trình truy cập database. (**Không cần file JAR khi compile.**)

> *"When you launch programs from the command line, simply use the command"*

```
java -classpath driverPath:. ProgramName
```

> *"On Windows, use a semicolon to separate the current directory (denoted by the . character) from the driver JAR location."*

**Dịch:** Khi chạy chương trình từ command line thì dùng lệnh trên. **Trên Windows dùng dấu chấm phẩy `;`** để ngăn thư mục hiện tại (ký hiệu `.`) với vị trí file JAR của driver.

---

## 5.3.3. Starting the Database

> *"The database server needs to be started before you can connect to it. The details depend on your database."*

**Dịch:** **Database server phải được khởi động trước khi kết nối tới nó.** Chi tiết tuỳ database bạn dùng.

> *"With the Derby database, follow these steps:"*

**Dịch:** Với Derby, làm theo các bước sau.

> *"1. Open a command shell and change to a directory that will hold the database files."*

**Dịch:** **Bước 1.** Mở command shell và chuyển vào thư mục sẽ chứa file database.

> *"2. Locate the file derbyrun.jar. With some versions of the JDK, it is contained in the jdk/db/lib directory. If it's not there, install Apache Derby and locate the JAR file in the installation directory. We will denote the directory containing lib/derbyrun.jar with derby."*

**Dịch:** **Bước 2.** Tìm file **`derbyrun.jar`**. Ở một số phiên bản JDK, nó nằm trong thư mục `jdk/db/lib`. Nếu không có, cài Apache Derby và tìm file JAR trong thư mục cài đặt. Sách ký hiệu thư mục chứa `lib/derbyrun.jar` là **`derby`**.

> *"3. Run the command"*

```
java -jar derby/lib/derbyrun.jar server start
```

**Dịch:** **Bước 3.** Chạy lệnh trên để **khởi động server**.

> *"4. Double-check that the database is working correctly. Create a file ij.properties that contains these lines:"*

```
ij.driver=org.apache.derby.jdbc.ClientDriver
ij.protocol=jdbc:derby://localhost:1527/
ij.database=COREJAVA;create=true
```

> *"From another command shell, run Derby's interactive scripting tool (called ij) by executing"*

```
java -jar derby/lib/derbyrun.jar ij -p ij.properties
```

> *"Now you can issue SQL commands such as"*

```sql
CREATE TABLE Greetings (Message CHAR(20));
INSERT INTO Greetings VALUES ('Hello, World!');
SELECT * FROM Greetings;
DROP TABLE Greetings;
```

> *"Note that each command must be terminated by a semicolon. To exit, type"*

```
EXIT;
```

**Dịch:** **Bước 4.** Kiểm tra lại database chạy đúng chưa. Tạo file **`ij.properties`** với nội dung trên. Từ **một command shell khác**, chạy công cụ scripting tương tác của Derby (**tên là `ij`**). Giờ bạn phát được các lệnh SQL. **Mỗi lệnh phải kết thúc bằng dấu chấm phẩy.** Để thoát thì gõ `EXIT;`.

> *"5. When you are done using the database, stop the server with the command"*

```
java -jar derby/lib/derbyrun.jar server shutdown
```

**Dịch:** **Bước 5.** Xong việc thì **dừng server** bằng lệnh trên.

> *"If you use another database, you need to consult the documentation to find out how to start and stop your database server, and how to connect to it and issue SQL commands."*

**Dịch:** Nếu dùng database khác, phải **tra tài liệu** để biết cách khởi động/dừng server, cách kết nối và phát lệnh SQL.

---

## 5.3.4. Registering the Driver Class

> *"Many JDBC JAR files (such as the Apache Derby driver) automatically register the driver class. In that case, you can skip the manual registration step that we describe in this section. A JAR file can automatically register the driver class if it contains a file META-INF/services/java.sql.Driver. You can simply unzip your driver's JAR file to check."*

**Dịch:** **Nhiều file JAR JDBC (như driver Apache Derby) tự động register driver class.** Khi đó bạn **bỏ qua** bước register thủ công. Một file JAR **tự register được** nếu nó chứa file **`META-INF/services/java.sql.Driver`**. Cứ **giải nén file JAR của driver ra để kiểm tra**.

> *"If your driver's JAR file doesn't support automatic registration, you need to find out the name of the JDBC driver classes used by your vendor. Typical driver names are"*

```
org.apache.derby.jdbc.ClientDriver
org.postgresql.Driver
```

**Dịch:** Nếu file JAR của driver **không hỗ trợ tự động register**, bạn phải **tìm tên các JDBC driver class** mà vendor dùng. Vài tên driver điển hình ở trên.

> *"There are two ways to register the driver with the DriverManager. One way is to load the driver class in your Java program. For example,"*

```java
Class.forName("org.postgresql.Driver"); // force loading of driver class
```

> *"This statement causes the driver class to be loaded, thereby executing a static initializer that registers the driver."*

**Dịch:** Có **hai cách** register driver với `DriverManager`. Cách thứ nhất là **load driver class trong chương trình Java**. Câu lệnh này khiến driver class được load, qua đó **chạy một static initializer để register driver**. (Xem lại [[06 - Object Construction#4.6.7. Initialization Blocks]] về static initialization block.)

> *"Alternatively, you can set the jdbc.drivers property. You can specify the property with a command-line argument, such as"*

```
java -Djdbc.drivers=org.postgresql.Driver ProgramName
```

> *"Or, your application can set the system property with a call such as"*

```java
System.setProperty("jdbc.drivers", "org.postgresql.Driver");
```

> *"You can also supply multiple drivers; separate them with colons, for example:"*

```
org.postgresql.Driver:org.apache.derby.jdbc.ClientDriver
```

**Dịch:** Cách khác là **set property `jdbc.drivers`**, hoặc qua **command-line argument**, hoặc **ứng dụng tự set system property**. Bạn **cung cấp được nhiều driver**, **ngăn cách bằng dấu hai chấm**.

---

## 5.3.5. Connecting to the Database

> *"In your Java program, open a database connection like this:"*

```java
String url = "jdbc:postgresql:COREJAVA";
String username = "dbuser";
String password = "secret";
Connection conn = DriverManager.getConnection(url, username, password);
```

**Dịch:** Trong chương trình Java, **mở connection tới database** như trên.

> *"The driver manager iterates through the registered drivers to find a driver that can use the subprotocol specified in the database URL."*

**Dịch:** **Driver manager duyệt qua các driver đã register** để tìm driver **dùng được subprotocol** ghi trong database URL.

> *"The getConnection method returns a Connection object. In the following sections, you will see how to use the Connection object to execute SQL statements."*

**Dịch:** Method `getConnection` **trả về một `Connection` object**. Các phần sau sẽ chỉ cách dùng `Connection` object để **thực thi câu lệnh SQL**.

> *"To connect to the database, you will need a user name and password for your database."*

**Dịch:** Để kết nối, bạn cần **user name và password** cho database.

> **Note (sách):** *"By default, Derby lets you connect with any user name, and it does not check passwords. A separate set of tables is generated for each user. The default user name is app."*
>
> **Dịch:** Mặc định Derby **cho kết nối với bất kỳ user name nào và không kiểm tra password**. **Mỗi user được sinh một bộ table riêng.** User name mặc định là **`app`**.

---

## Chương trình test

> *"The test program in Listing 5.1 puts these steps to work. It loads connection parameters from a file named database.properties and connects to the database."*

**Dịch:** Chương trình test ở Listing 5.1 áp dụng các bước trên: **nạp parameter kết nối từ file `database.properties`** rồi kết nối tới database.

> *"The database.properties file supplied with the sample code contains connection information for the Derby database. If you use a different database, put your database-specific connection information into that file. Here is an example for connecting to a PostgreSQL database:"*

```
jdbc.drivers=org.postgresql.Driver
jdbc.url=jdbc:postgresql:COREJAVA
jdbc.username=dbuser
jdbc.password=secret
```

**Dịch:** File `database.properties` đi kèm code mẫu chứa thông tin kết nối cho Derby. Nếu dùng database khác thì **đặt thông tin kết nối riêng của bạn vào file đó**. (Xem thêm [[06 - Input and Output]] về đọc file.)

> *"After connecting to the database, the test program executes the following SQL statements:"*

```sql
CREATE TABLE Greetings (Message CHAR(20))
INSERT INTO Greetings VALUES ('Hello, World!')
SELECT * FROM Greetings
```

> *"The result of the SELECT statement is printed, and you should see an output of"*

```
Hello, World!
```

> *"Then the table is removed by executing the statement"*

```sql
DROP TABLE Greetings
```

**Dịch:** Sau khi kết nối, chương trình test chạy các câu lệnh SQL trên, **in kết quả của `SELECT`**, rồi **xoá table** bằng `DROP TABLE`.

> *"To run this test, start your database as described previously, and launch the program as"*

```
java -classpath .:driverJAR test.TestDB
```

> *"(As always, Windows users need to use ; instead of : to separate the path elements.)"*

**Dịch:** Để chạy test, khởi động database như mô tả ở trên rồi chạy chương trình. **Trên Windows dùng `;` thay cho `:`** để ngăn các phần tử path.

> **Tip (sách):** *"One way to debug JDBC-related problems is to enable JDBC tracing. Call the DriverManager.setLogWriter method to send trace messages to a PrintWriter. The trace output contains a detailed listing of the JDBC activity. Most JDBC driver implementations provide additional mechanisms for tracing. For example, with Derby, you can add a traceFile option to the JDBC URL: jdbc:derby://localhost:1527/COREJAVA;create=true;traceFile=trace.out."*
>
> **Dịch:** Một cách debug vấn đề liên quan JDBC là **bật JDBC tracing**. Gọi method **`DriverManager.setLogWriter`** để gửi thông điệp trace tới một `PrintWriter`. Output trace chứa **liệt kê chi tiết hoạt động JDBC**. Đa số implementation của driver còn có **cơ chế tracing bổ sung** — ví dụ với Derby, thêm option **`traceFile`** vào JDBC URL.

### API — `java.sql.DriverManager` 1.1

| Method | Mô tả |
|---|---|
| `static Connection getConnection(String url, String user, String password)` | Thiết lập connection tới database đã cho và **trả về một `Connection` object** |

---

### Listing 5.1 — `test/TestDB.java`

```java
package test;

import java.nio.file.*;
import java.sql.*;
import java.io.*;
import java.util.*;

/**
 * This program tests that the database and the JDBC driver are correctly configured.
 * @version 1.03 2018-05-01
 * @author Cay Horstmann
 */
public class TestDB
{
    public static void main(String args[]) throws IOException
    {
        try
        {
            runTest();
        }
        catch (SQLException ex)
        {
            for (Throwable t : ex)
                t.printStackTrace();
        }
    }

    /**
     * Runs a test by creating a table, adding a value, showing the table contents, and
     * removing the table.
     */
    public static void runTest() throws SQLException, IOException
    {
        try (Connection conn = getConnection();
            Statement stat = conn.createStatement())
        {
            stat.executeUpdate("CREATE TABLE Greetings (Message CHAR(20))");
            stat.executeUpdate("INSERT INTO Greetings VALUES ('Hello, World!')");

            try (ResultSet result = stat.executeQuery("SELECT * FROM Greetings"))
            {
                if (result.next())
                    System.out.println(result.getString(1));
            }
            stat.executeUpdate("DROP TABLE Greetings");
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

---

## Bài kế tiếp

→ [[04 - Working with JDBC Statements]] — thực thi câu lệnh SQL, quản lý `Connection`/`Statement`/`ResultSet`, phân tích SQL exception, và chương trình nạp dữ liệu vào database.
