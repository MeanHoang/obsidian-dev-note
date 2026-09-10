# 10 — Connection Management in Web and Enterprise Applications

> Chapter 5, Section 5.10 — Core Java Volume II: Advanced Features, 11th Edition (Horstmann), Java 11.
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 5.10. Connection Management in Web and Enterprise Applications

> *"The simplistic database connection setup with a database.properties file, as described in the preceding sections, is suitable for small test programs but won't scale for larger applications."*

**Dịch:** Cách dựng database connection **đơn giản hoá bằng file `database.properties`** như mô tả ở các phần trước **hợp cho chương trình test nhỏ**, nhưng **không mở rộng nổi cho ứng dụng lớn hơn**.

> *"When a JDBC application is deployed in a web or enterprise environment, the management of database connections is integrated with the JNDI. The properties of data sources across the enterprise can be stored in a directory. Using a directory allows for centralized management of user names, passwords, database names, and JDBC URLs."*

**Dịch:** Khi ứng dụng JDBC được **deploy trong môi trường web hoặc enterprise**, việc **quản lý database connection được tích hợp với JNDI**. **Thuộc tính của các data source trên toàn doanh nghiệp lưu được trong một directory.** Dùng directory cho phép **quản lý tập trung user name, password, tên database và JDBC URL**.

> *"In such an environment, you can use the following code to establish a database connection:"*

```java
var jndiContext = new InitialContext();
var source = (DataSource) jndiContext.lookup("java:comp/env/jdbc/corejava");
Connection conn = source.getConnection();
```

**Dịch:** Trong môi trường như vậy, bạn dùng code trên để **thiết lập database connection**.

> *"Note that the DriverManager is no longer involved. Instead, the JNDI service locates a data source. A data source is an interface that allows for simple JDBC connections as well as more advanced services, such as executing distributed transactions that involve multiple databases. The DataSource interface is defined in the javax.sql standard extension package."*

**Dịch:** Lưu ý **`DriverManager` không còn dính vào nữa**. Thay vào đó, **dịch vụ JNDI định vị một data source**. **Data source là một interface** cho phép **connection JDBC đơn giản** cũng như các **dịch vụ nâng cao hơn**, như **chạy distributed transaction liên quan nhiều database**. Interface **`DataSource` được định nghĩa trong package mở rộng chuẩn `javax.sql`** (xem [[01 - Interfaces]]).

```
  ứng dụng
     │
     ▼  jndiContext.lookup("java:comp/env/jdbc/corejava")
   JNDI  ──────────────►  DataSource
                              │  getConnection()
                              ▼
                          Connection
   (KHÔNG còn DriverManager)
```

> **Note (sách):** *"In a Java EE container, you don't even have to program the JNDI lookup. Simply use the Resource annotation on a DataSource field, and the data source reference will be set when your application is loaded:"*
>
> ```java
> @Resource(name="jdbc/corejava")
> private DataSource source;
> ```
>
> **Dịch:** Trong một **Java EE container**, bạn **thậm chí không phải tự lập trình phần JNDI lookup**. Chỉ cần dùng **annotation `Resource`** trên một field kiểu `DataSource`, và **reference tới data source sẽ được set khi ứng dụng của bạn được load**.

> *"Of course, the data source needs to be configured somewhere. If you write database programs that execute in a servlet container such as Apache Tomcat or in an application server such as GlassFish, place the database configuration (including the JNDI name, JDBC URL, user name, and password) in a configuration file, or set it in an admin GUI."*

**Dịch:** Đương nhiên **data source phải được cấu hình ở đâu đó**. Nếu bạn viết chương trình database chạy trong **servlet container như Apache Tomcat**, hoặc trong **application server như GlassFish**, hãy đặt **cấu hình database (gồm JNDI name, JDBC URL, user name và password) vào một file cấu hình**, hoặc **set nó trong admin GUI**.

---

## Chi phí thiết lập connection

> *"Management of user names and logins is just one of the issues that require special attention. Another issue involves the cost of establishing database connections. Our sample database programs used two strategies for obtaining a database connection. The QueryDB program in Listing 5.3 established a single database connection at the start of the program and closed it at the end of the program. The ViewDB program in Listing 5.4 opened a new connection whenever one was needed."*

**Dịch:** Quản lý user name và login **chỉ là một trong các vấn đề cần chú ý đặc biệt**. Một vấn đề khác là **chi phí thiết lập database connection**. Các chương trình mẫu dùng **hai chiến lược** để lấy connection: chương trình `QueryDB` ([[05 - Query Execution|Listing 5.3]]) **thiết lập MỘT connection duy nhất ở đầu chương trình và đóng nó ở cuối**; chương trình `ViewDB` ([[08 - Metadata|Listing 5.4]]) **mở một connection mới mỗi khi cần**.

> *"However, neither of these approaches is satisfactory. Database connections are a finite resource. If a user walks away from an application for some time, the connection should not be left open. Conversely, obtaining a connection for each query and closing it afterward is very costly."*

**Dịch:** Nhưng **cả hai cách đều không thoả đáng**. **Database connection là tài nguyên hữu hạn.** Nếu người dùng **rời khỏi ứng dụng một lúc**, connection **không nên bị để mở**. Ngược lại, **lấy một connection cho mỗi query rồi đóng nó ngay sau đó thì rất tốn kém**.

---

## Connection pool

> *"The solution is to pool connections. This means that database connections are not physically closed but are kept in a queue and reused. Connection pooling is an important service, and the JDBC specification provides hooks for implementors to supply it. However, the JDK itself does not provide any implementation, and database vendors don't usually include one with their JDBC drivers either. Instead, vendors of web containers and application servers supply connection pool implementations."*

**Dịch:** **Giải pháp là gom connection thành pool (pool connections).** Nghĩa là database connection **không bị đóng về mặt vật lý** mà **được giữ trong một queue và dùng lại**. **Connection pooling là một dịch vụ quan trọng**, và JDBC specification **cung cấp các điểm móc (hook) để người implement cung cấp nó**. Tuy nhiên **bản thân JDK không cung cấp implementation nào**, và **database vendor thường cũng không kèm theo driver JDBC của họ**. Thay vào đó, **vendor của web container và application server cung cấp implementation của connection pool**.

> *"Using a connection pool is completely transparent to the programmer. Acquire a connection from a source of pooled connections by obtaining a data source and calling getConnection. When you are done using the connection, call close. That doesn't close the physical connection but tells the pool that you are done using it. The connection pool typically makes an effort to pool prepared statements as well."*

**Dịch:** **Dùng connection pool hoàn toàn trong suốt với lập trình viên.** Bạn **lấy connection từ nguồn connection đã pool** bằng cách **lấy một data source và gọi `getConnection`**. Khi dùng xong connection thì **gọi `close`** — điều đó **KHÔNG đóng connection vật lý**, mà **báo cho pool biết bạn đã dùng xong**. Connection pool **thường cũng cố gắng pool cả prepared statement**.

```
  getConnection()  ──►  lấy 1 connection từ queue của pool
        │
        ▼  dùng xong
     close()       ──►  KHÔNG đóng vật lý; trả connection về pool
```

---

## Kết chương

> *"You have now learned about the JDBC fundamentals and know enough to implement simple database applications. However, as we mentioned at the beginning of this chapter, databases are complex and quite a few advanced topics are beyond the scope of this introductory chapter. For an overview of advanced JDBC capabilities, refer to the JDBC API Tutorial and Reference or the JDBC specification."*

**Dịch:** Bạn đã học xong **những điều cơ bản của JDBC** và **biết đủ để implement ứng dụng database đơn giản**. Nhưng như đã nói ở đầu chương, **database rất phức tạp** và **khá nhiều chủ đề nâng cao nằm ngoài phạm vi chương nhập môn này**.

> *"In this chapter, you have learned how to work with relational databases in Java. The next chapter covers the Java 8 date and time library."*

**Dịch:** Trong chương này bạn đã học **cách làm việc với relational database trong Java**. **Chương kế tiếp nói về thư viện date and time của Java 8.**

---

## Chương kế tiếp

→ [[01 - The Time Line]] — Chapter 6: The Date and Time API.
