# 01 — The Design of JDBC

> Chapter 5, Section 5.1 — Core Java Volume II: Advanced Features, 11th Edition (Horstmann), Java 11.
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## Mở đầu chương 5

> *"In 1996, Sun released the first version of the JDBC API. This API lets programmers connect to a database to query or update it using the Structured Query Language (SQL). (SQL, usually pronounced "sequel," is an industry standard for relational database access.) JDBC has since become one of the most commonly used APIs in the Java library."*

**Dịch:** Năm 1996, Sun phát hành phiên bản đầu tiên của **JDBC API**. API này cho phép lập trình viên kết nối tới database để truy vấn hoặc cập nhật nó bằng **Structured Query Language (SQL)**. (SQL, thường đọc là "sequel", là chuẩn công nghiệp cho việc truy cập relational database.) Từ đó tới nay JDBC đã trở thành **một trong những API được dùng nhiều nhất** trong thư viện Java.

> *"JDBC has been updated several times. As this book is published, JDBC 4.3, the version included with Java 9, is the most current version."*

**Dịch:** JDBC đã được cập nhật nhiều lần. Tại thời điểm cuốn sách này xuất bản, **JDBC 4.3** — phiên bản đi kèm Java 9 — là phiên bản mới nhất.

> *"In this chapter, we will explain the key ideas behind JDBC. We will introduce you to (or refresh your memory of) SQL, the industry-standard Structured Query Language for relational databases. We will then provide enough details and examples to let you start using JDBC for common programming situations."*

**Dịch:** Trong chương này, chúng ta sẽ giải thích **những ý tưởng chủ chốt đằng sau JDBC**. Chúng ta sẽ giới thiệu (hoặc nhắc lại) **SQL** — Structured Query Language chuẩn công nghiệp cho relational database. Sau đó cung cấp đủ chi tiết và ví dụ để bạn **bắt đầu dùng JDBC cho các tình huống lập trình thông thường**.

> **Note (sách):** *"According to Oracle, JDBC is a trademarked term and not an acronym for Java Database Connectivity. It was named to be reminiscent of ODBC, a standard database API pioneered by Microsoft and since incorporated into the SQL standard."*
>
> **Dịch:** Theo Oracle, **JDBC là một thương hiệu đã đăng ký, không phải viết tắt** của "Java Database Connectivity". Nó được đặt tên để **gợi nhớ tới ODBC** — một API database chuẩn do Microsoft khởi xướng và về sau được đưa vào chuẩn SQL.

---

## 5.1. The Design of JDBC

> *"From the start, the developers of the Java technology were aware of the potential that Java showed for working with databases. In 1995, they began work on extending the standard Java library to deal with SQL access to databases. What they first hoped to do was to extend Java so that a program could talk to any random database using only "pure" Java. It didn't take them long to realize that this is an impossible task: There are simply too many databases out there, using too many protocols."*

**Dịch:** Ngay từ đầu, những người phát triển công nghệ Java đã nhận ra tiềm năng của Java trong việc làm việc với database. Năm 1995 họ bắt đầu mở rộng thư viện chuẩn của Java để xử lý truy cập SQL vào database. Điều họ hy vọng đầu tiên là mở rộng Java sao cho một chương trình **nói chuyện được với bất kỳ database nào chỉ bằng Java "thuần"**. Chẳng bao lâu họ nhận ra đó là **nhiệm vụ bất khả thi**: đơn giản là **có quá nhiều database ngoài kia, dùng quá nhiều protocol**.

> *"Moreover, although database vendors were all in favor of Java providing a standard network protocol for database access, they were only in favor of it if Java used their network protocol."*

**Dịch:** Hơn nữa, dù các database vendor đều ủng hộ việc Java cung cấp một network protocol chuẩn cho truy cập database, họ **chỉ ủng hộ nếu Java dùng protocol của chính họ**.

> *"What all the database vendors and tool vendors did agree on was that it would be useful for Java to provide a pure Java API for SQL access along with a driver manager to allow third-party drivers to connect to specific databases. Database vendors could provide their own drivers to plug into the driver manager. There would then be a simple mechanism for registering third-party drivers with the driver manager."*

**Dịch:** Điều mà **mọi database vendor và tool vendor đều đồng ý** là: Java nên cung cấp một **API thuần Java cho truy cập SQL**, kèm theo một **driver manager** để driver của bên thứ ba kết nối tới database cụ thể. Database vendor tự cung cấp driver của họ để **cắm vào driver manager**. Và sẽ có một cơ chế đơn giản để **đăng ký (register) driver bên thứ ba** với driver manager.

> *"This organization follows the very successful model of Microsoft's ODBC which provided a C programming language interface for database access. Both JDBC and ODBC are based on the same idea: Programs written according to the API talk to the driver manager, which, in turn, uses a driver to talk to the actual database."*

**Dịch:** Cách tổ chức này đi theo mô hình **rất thành công của ODBC** (Microsoft) — thứ cung cấp interface ngôn ngữ C cho truy cập database. **JDBC và ODBC dựa trên cùng một ý tưởng**: chương trình viết theo API nói chuyện với driver manager, và driver manager lại dùng một driver để nói chuyện với database thật.

```
  Chương trình Java
        │
        ▼  (JDBC API)
   Driver Manager
        │
        ▼  (driver)
    Database thật
```

> *"This means the JDBC API is all that most programmers will ever have to deal with."*

**Dịch:** Nghĩa là **JDBC API là tất cả những gì đa số lập trình viên phải đụng tới**.

---

## 5.1.1. JDBC Driver Types

> *"The JDBC specification classifies drivers into the following types:"*

**Dịch:** JDBC specification phân loại driver thành các type sau.

> *"A type 1 driver translates JDBC to ODBC and relies on an ODBC driver to communicate with the database. Early versions of Java included one such driver, the JDBC/ODBC bridge. However, the bridge requires deployment and proper configuration of an ODBC driver. When JDBC was first released, the bridge was handy for testing, but it was never intended for production use. At this point, many better drivers are available, and the JDK no longer provides the JDBC/ODBC bridge."*

**Dịch:** **Type 1 driver** dịch JDBC sang ODBC và dựa vào một ODBC driver để giao tiếp với database. Các phiên bản Java đầu có driver kiểu này, gọi là **JDBC/ODBC bridge**. Nhưng bridge đòi hỏi phải deploy và cấu hình đúng một ODBC driver. Khi JDBC mới ra, bridge tiện cho việc test, nhưng **chưa bao giờ nhắm tới production**. Hiện nay đã có nhiều driver tốt hơn, và **JDK không còn cung cấp JDBC/ODBC bridge**.

> *"A type 2 driver is written partly in Java and partly in native code; it communicates with the client API of a database. To use such a driver, you must install some platform-specific code onto the client in addition to a Java library."*

**Dịch:** **Type 2 driver** được viết **một phần bằng Java, một phần bằng native code**; nó giao tiếp với client API của database. Muốn dùng driver kiểu này, bạn phải cài **code phụ thuộc platform** lên client, bên cạnh thư viện Java.

> *"A type 3 driver is a pure Java client library that uses a database-independent protocol to communicate database requests to a server component, which then translates the requests into a database-specific protocol. This simplifies deployment because the platform-specific code is located only on the server."*

**Dịch:** **Type 3 driver** là **client library thuần Java**, dùng một protocol **không phụ thuộc database** để chuyển request tới một **server component**, rồi component đó dịch request sang protocol riêng của database. Cách này **đơn giản hoá việc deploy** vì code phụ thuộc platform **chỉ nằm trên server**.

> *"A type 4 driver is a pure Java library that translates JDBC requests directly to a database-specific protocol."*

**Dịch:** **Type 4 driver** là **thư viện thuần Java**, dịch **thẳng** request JDBC sang protocol riêng của database.

| Type | Bản chất |
|---|---|
| **1** | Dịch JDBC → ODBC, dựa vào ODBC driver. JDK **không còn cung cấp** JDBC/ODBC bridge |
| **2** | Một phần Java, một phần native code; nói chuyện với client API của database |
| **3** | Thuần Java, dùng protocol không phụ thuộc database, gửi tới **server component** |
| **4** | Thuần Java, dịch **thẳng** sang protocol riêng của database |

> **Note (sách):** *"The JDBC specification is available at https://jcp.org/aboutJava/communityprocess/mrel/jsr221/index3.html."*
>
> **Dịch:** JDBC specification có tại địa chỉ trên.

> *"Most database vendors supply either a type 3 or type 4 driver with their database. Furthermore, a number of third-party companies specialize in producing drivers with better standards conformance, support for more platforms, better performance, or, in some cases, simply better reliability than the drivers provided by the database vendors."*

**Dịch:** **Đa số database vendor cung cấp driver type 3 hoặc type 4** kèm database của họ. Ngoài ra, một số công ty bên thứ ba chuyên làm driver **tuân thủ chuẩn tốt hơn, hỗ trợ nhiều platform hơn, hiệu năng tốt hơn**, hoặc đôi khi đơn giản là **đáng tin cậy hơn** driver của chính vendor.

### Mục tiêu cuối cùng của JDBC

> *"In summary, the ultimate goal of JDBC is to make possible the following:"*

> *"Programmers can write applications in the Java programming language to access any database using standard SQL statements (or even specialized extensions of SQL) while still following Java language conventions."*

**Dịch:** Lập trình viên **viết ứng dụng bằng Java để truy cập bất kỳ database nào** bằng câu lệnh SQL chuẩn (hoặc cả phần mở rộng chuyên biệt của SQL), mà **vẫn theo quy ước của ngôn ngữ Java**.

> *"Database vendors and database tool vendors can supply the low-level drivers. Thus, they can optimize their drivers for their specific products."*

**Dịch:** **Database vendor và tool vendor cung cấp driver mức thấp**, nhờ vậy họ **tối ưu được driver cho sản phẩm riêng của mình**.

> **Note (sách):** *"If you are curious as to why Java just didn't adopt the ODBC model, the reason, as given at the JavaOne conference in 1996, was this:"*
>
> - *"ODBC is hard to learn."*
> - *"ODBC has a few commands with lots of complex options. The preferred style in the Java programming language is to have simple and intuitive methods, but to have lots of them."*
> - *"ODBC relies on the use of void* pointers and other C features that are not natural in the Java programming language."*
> - *"An ODBC-based solution is inherently less safe and harder to deploy than a pure Java solution."*
>
> **Dịch:** Vì sao Java không đơn giản là dùng luôn mô hình ODBC? Lý do nêu tại hội nghị JavaOne 1996:
> - **ODBC khó học.**
> - ODBC có **ít lệnh nhưng mỗi lệnh nhiều option phức tạp**. Phong cách được ưa chuộng trong Java là **method đơn giản, trực giác, nhưng có rất nhiều method**.
> - ODBC dựa vào **con trỏ `void*`** và các đặc tính khác của C, **không tự nhiên** trong Java.
> - Giải pháp dựa trên ODBC **vốn dĩ kém an toàn hơn và khó deploy hơn** giải pháp thuần Java.

---

## 5.1.2. Typical Uses of JDBC

> *"The traditional client/server model has a rich GUI on the client and a database on the server (see Figure 5.1). In this model, a JDBC driver is deployed on the client."*

**Dịch:** Mô hình client/server truyền thống có **GUI phong phú ở client** và **database ở server**. Trong mô hình này, **JDBC driver được deploy trên client**.

**Figure 5.1: A traditional client/server application**

```
                                     database protocol
                                             │
                                             ▼
   ┌──────────────────┬──────────┐                 ╭──────────╮
   │                  │          │                 │▔▔▔▔▔▔▔▔▔▔│
   │      Client      │   JDBC   │◄───────────────►│ Database │
   │                  │          │                 │  Server  │
   └──────────────────┴──────────┘                 ╰──────────╯
```

> *"However, nowadays it is far more common to have a three-tier model where the client application does not make database calls. Instead, it calls on a middleware layer on the server that in turn makes the database queries. The three-tier model has a couple of advantages. It separates visual presentation (on the client) from the business logic (in the middle tier) and the raw data (in the database). Therefore, it becomes possible to access the same data and the same business rules from multiple clients, such as a Java desktop application, a web browser, or a mobile app."*

**Dịch:** Tuy nhiên ngày nay **phổ biến hơn nhiều là mô hình three-tier**, trong đó **client không tự gọi database**. Thay vào đó client gọi tới một **middleware layer trên server**, rồi tầng đó mới truy vấn database. Mô hình three-tier có vài ưu điểm: nó **tách phần trình bày trực quan (ở client)** khỏi **business logic (ở tầng giữa)** và **dữ liệu thô (ở database)**. Nhờ vậy, **cùng một dữ liệu và cùng một business rule truy cập được từ nhiều loại client** — ứng dụng desktop Java, trình duyệt web, hay mobile app.

> *"Communication between the client and the middle tier typically occurs through HTTP. JDBC manages the communication between the middle tier and the back-end database. Figure 5.2 shows the basic architecture."*

**Dịch:** Giao tiếp giữa client và tầng giữa **thường qua HTTP**. **JDBC quản lý giao tiếp giữa tầng giữa và database back-end**.

**Figure 5.2: A three-tier application**

```
          HTTP, RMI, etc...                     database protocol
                   │                                     │
                   ▼                                     ▼
   ┌───────────────┐      ┌────────────────┬────────┐        ╭──────────╮
   │    Client     │      │   Middle tier  │        │        │▔▔▔▔▔▔▔▔▔▔│
   │   (visual     │◄────►│   (business    │  JDBC  │◄──────►│ Database │
   │ presentation) │      │     logic)     │        │        │  Server  │
   └───────────────┘      └────────────────┴────────┘        ╰──────────╯
```

---

## Bài kế tiếp

→ [[02 - The Structured Query Language]] — giới thiệu SQL: `SELECT`, `WHERE`, `LIKE`, join, `UPDATE`, `DELETE`, `INSERT`, `CREATE TABLE` và bảng kiểu dữ liệu SQL thông dụng.
