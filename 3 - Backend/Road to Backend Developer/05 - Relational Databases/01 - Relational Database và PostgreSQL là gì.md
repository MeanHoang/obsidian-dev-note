# 01 — Relational Database và PostgreSQL là gì

> **Nguồn chính:** PostgreSQL 18 Documentation — https://www.postgresql.org/docs/current/
> Bài này bám các mục: *Preface 1. What Is PostgreSQL?*, *1.2. Architectural Fundamentals*, *1.3. Creating a Database*, *1.4. Accessing a Database*, *2.2. Concepts*; cộng mô tả node `Relational Databases` và `PostgreSQL` trên roadmap Backend.

---

## 1. Roadmap nói gì về Relational Databases

📖 **Nguyên văn**
> "Relational databases organize data into structured tables with rows and columns, using SQL for querying. Enforce data integrity through keys and constraints, handle complex queries and transactions efficiently. Examples: MySQL, PostgreSQL, Oracle. Used for structured data storage and strong consistency."

🇻🇳 **Dịch**
> "Relational database tổ chức dữ liệu thành các table có cấu trúc gồm row và column, dùng SQL để truy vấn. Bảo đảm tính toàn vẹn dữ liệu thông qua key và constraint, xử lý hiệu quả các query phức tạp và transaction. Ví dụ: MySQL, PostgreSQL, Oracle. Được dùng cho việc lưu trữ dữ liệu có cấu trúc và yêu cầu strong consistency."

Bốn từ khoá của cả phần 05 nằm gọn trong đoạn trên:

| Từ khoá | Ý nghĩa | Học ở bài |
|---|---|---|
| table / row / column | đơn vị lưu trữ | bài này + `[[02 - Tables, Data Types và Constraints]]` |
| SQL | ngôn ngữ truy vấn | các bài sau |
| key | định danh & liên kết giữa các table | `[[02 - Tables, Data Types và Constraints]]` |
| constraint | ràng buộc toàn vẹn dữ liệu | `[[02 - Tables, Data Types và Constraints]]` |

> [!note]
> Roadmap chỉ là mô tả một dòng. Từ mục 2 trở đi bài này lấy **PostgreSQL Documentation** làm nguồn chuẩn, vì đó là tài liệu chính thống có định nghĩa đầy đủ cho từng khái niệm.

---

## 2. Roadmap nói gì về PostgreSQL

📖 **Nguyên văn**
> "PostgreSQL is an advanced, open-source RDBMS known for robustness, extensibility, and standards compliance. Supports complex queries, custom data types, full-text search, and ACID properties. Highly extensible with strong concurrency support, suitable for web apps to data warehousing."

🇻🇳 **Dịch**
> "PostgreSQL là một RDBMS open-source cao cấp, nổi tiếng về độ bền vững, khả năng mở rộng và tuân thủ chuẩn. Hỗ trợ query phức tạp, custom data type, full-text search và các thuộc tính ACID. Khả năng extensible rất cao cùng hỗ trợ concurrency mạnh, phù hợp từ web app cho tới data warehousing."

---

## 3. PostgreSQL là gì (định nghĩa chính thống + lịch sử ngắn)

📖 **Nguyên văn** — *Preface, 1. What Is PostgreSQL?*
> "PostgreSQL is an object-relational database management system (ORDBMS) based on POSTGRES, Version 4.2, developed at the University of California at Berkeley Computer Science Department. POSTGRES pioneered many concepts that only became available in some commercial database systems much later.
>
> PostgreSQL is an open-source descendant of this original Berkeley code. It supports a large part of the SQL standard and offers many modern features:"

🇻🇳 **Dịch**
> "PostgreSQL là một object-relational database management system (ORDBMS) dựa trên POSTGRES, phiên bản 4.2, được phát triển tại khoa Khoa học Máy tính của Đại học California tại Berkeley. POSTGRES đã tiên phong nhiều khái niệm mà mãi về sau mới xuất hiện trong một số hệ database thương mại.
>
> PostgreSQL là hậu duệ open-source của phần code gốc ở Berkeley đó. Nó hỗ trợ phần lớn chuẩn SQL và cung cấp nhiều tính năng hiện đại:"

Danh sách tính năng hiện đại được liệt kê nguyên văn trong tài liệu:

📖 **Nguyên văn**
> "complex queries
> foreign keys
> triggers
> updatable views
> transactional integrity
> multiversion concurrency control"

🇻🇳 **Dịch**
> "query phức tạp
> foreign key
> trigger
> updatable view
> transactional integrity (toàn vẹn ở mức transaction)
> multiversion concurrency control (kiểm soát truy cập đồng thời theo nhiều phiên bản dữ liệu)"

Và các hướng người dùng có thể tự mở rộng PostgreSQL:

📖 **Nguyên văn**
> "Also, PostgreSQL can be extended by the user in many ways, for example by adding new
>
> data types
> functions
> operators
> aggregate functions
> index methods
> procedural languages"

🇻🇳 **Dịch**
> "Ngoài ra, PostgreSQL có thể được chính người dùng mở rộng theo nhiều cách, ví dụ bằng cách thêm mới
>
> data type
> function
> operator
> aggregate function
> index method
> procedural language"

📖 **Nguyên văn**
> "And because of the liberal license, PostgreSQL can be used, modified, and distributed by anyone free of charge for any purpose, be it private, commercial, or academic."

🇻🇳 **Dịch**
> "Và nhờ license rất thoáng, PostgreSQL có thể được bất kỳ ai sử dụng, sửa đổi và phân phối miễn phí cho bất kỳ mục đích nào, dù là cá nhân, thương mại hay học thuật."

> [!tip] Vì sao lấy PostgreSQL làm nguồn chuẩn cho cả phần 05
> Roadmap liệt kê MySQL, PostgreSQL, Oracle. Trong ba cái đó chỉ PostgreSQL vừa open-source hoàn toàn, vừa có bộ documentation chính thống viết theo kiểu sách giáo khoa (có hẳn phần *Tutorial*) — đúng tinh thần "bám sách, trích nguyên văn" của series này.

---

## 4. Relational database theo định nghĩa của PostgreSQL

📖 **Nguyên văn** — *2.2. Concepts*
> "PostgreSQL is a relational database management system (RDBMS). That means it is a system for managing data stored in relations. Relation is essentially a mathematical term for table. The notion of storing data in tables is so commonplace today that it might seem inherently obvious, but there are a number of other ways of organizing databases. Files and directories on Unix-like operating systems form an example of a hierarchical database. A more modern development is the object-oriented database."

🇻🇳 **Dịch**
> "PostgreSQL là một relational database management system (RDBMS). Nghĩa là nó là một hệ thống quản lý dữ liệu được lưu trong các *relation*. *Relation* về bản chất là thuật ngữ toán học để chỉ *table*. Chuyện lưu dữ liệu trong table ngày nay quá phổ biến đến mức tưởng như hiển nhiên, nhưng còn nhiều cách khác để tổ chức database. File và directory trên hệ điều hành kiểu Unix là một ví dụ của hierarchical database. Một hướng phát triển hiện đại hơn là object-oriented database."

Đây là mấu chốt để hiểu chữ "relational": **relation = table**, không phải "quan hệ giữa các bảng" như nhiều người hay hiểu nhầm.

### Table, row, column

📖 **Nguyên văn**
> "Each table is a named collection of rows. Each row of a given table has the same set of named columns, and each column is of a specific data type. Whereas columns have a fixed order in each row, it is important to remember that SQL does not guarantee the order of the rows within the table in any way (although they can be explicitly sorted for display)."

🇻🇳 **Dịch**
> "Mỗi table là một tập hợp các row có tên. Mỗi row của một table cho trước đều có cùng một bộ column có tên, và mỗi column thuộc một data type cụ thể. Trong khi các column có thứ tự cố định trong mỗi row, cần nhớ rằng SQL không hề bảo đảm thứ tự của các row bên trong table (dù chúng có thể được sắp xếp tường minh khi hiển thị)."

> [!warning]
> Câu cuối là một cái bẫy kinh điển: **SQL không bảo đảm thứ tự row**. Muốn có thứ tự thì phải viết `ORDER BY` rõ ràng, không được dựa vào "thứ tự insert".

💡 **Ví dụ đời sống**
Hình dung một cuốn sổ sinh viên kẻ sẵn bảng:

- **Table** = tờ giấy kẻ bảng có tên ở đầu trang, ví dụ "DANH SÁCH SINH VIÊN".
- **Column** = tiêu đề cột in sẵn trên đầu: *Mã SV*, *Họ tên*, *Ngày sinh*. Cột in sẵn nên thứ tự cố định, và mỗi cột chỉ nhận đúng một loại nội dung (*Ngày sinh* không thể ghi "xanh lá") — đó chính là **data type**.
- **Row** = một dòng đã điền = một sinh viên.
- "SQL không bảo đảm thứ tự row" = nếu bạn photo tờ giấy này rồi cắt rời từng dòng, bạn vẫn không mất thông tin nào. Thứ tự các dòng không mang ý nghĩa; muốn xếp theo tên thì phải chủ động xếp lại.

---

## 5. Database cluster → database → table

📖 **Nguyên văn** — *2.2. Concepts*
> "Tables are grouped into databases, and a collection of databases managed by a single PostgreSQL server instance constitutes a database cluster."

🇻🇳 **Dịch**
> "Các table được gom nhóm vào các database, và một tập hợp các database được quản lý bởi một PostgreSQL server instance duy nhất tạo thành một database cluster."

Ba tầng lồng nhau:

```
database cluster          ← 1 PostgreSQL server instance quản lý
└── database  (mydb, joy_prod, joy_staging, ...)
    └── table  (customers, orders, ...)
        └── row / column
```

📖 **Nguyên văn** — *1.3. Creating a Database*
> "The first test to see whether you can access the database server is to try to create a database. A running PostgreSQL server can manage many databases. Typically, a separate database is used for each project or for each user."

🇻🇳 **Dịch**
> "Phép thử đầu tiên để xem bạn có truy cập được database server hay không là thử tạo một database. Một PostgreSQL server đang chạy có thể quản lý nhiều database. Thông thường, mỗi project hoặc mỗi user dùng một database riêng."

💡 **Ví dụ đời sống**
- **database cluster** = cả toà nhà lưu trữ hồ sơ, có một bác bảo vệ duy nhất giữ cửa (server instance).
- **database** = một phòng trong toà nhà, mỗi phòng cho một dự án.
- **table** = một tủ hồ sơ trong phòng đó.
- **row** = một tờ hồ sơ trong tủ.

Hai phòng khác nhau có thể cùng có tủ tên "khách hàng" mà không đụng nhau — y như hai database có thể cùng có table `customers`.

---

## 6. Kiến trúc client/server của PostgreSQL

📖 **Nguyên văn** — *1.2. Architectural Fundamentals*
> "In database jargon, PostgreSQL uses a client/server model. A PostgreSQL session consists of the following cooperating processes (programs):
>
> A server process, which manages the database files, accepts connections to the database from client applications, and performs database actions on behalf of the clients. The database server program is called postgres.
>
> The user's client (frontend) application that wants to perform database operations. Client applications can be very diverse in nature: a client could be a text-oriented tool, a graphical application, a web server that accesses the database to display web pages, or a specialized database maintenance tool. Some client applications are supplied with the PostgreSQL distribution; most are developed by users."

🇻🇳 **Dịch**
> "Theo thuật ngữ database, PostgreSQL dùng mô hình client/server. Một PostgreSQL session gồm các process (chương trình) phối hợp với nhau sau đây:
>
> Một server process, chịu trách nhiệm quản lý các file database, chấp nhận các connection tới database từ những client application, và thực hiện các thao tác database thay mặt cho client. Chương trình database server có tên là `postgres`.
>
> Client application (frontend) của người dùng, là thứ muốn thực hiện các thao tác database. Client application rất đa dạng về bản chất: một client có thể là một công cụ dạng text, một ứng dụng đồ hoạ, một web server truy cập database để hiển thị trang web, hoặc một công cụ bảo trì database chuyên dụng. Một số client application được cung cấp kèm trong bản phân phối PostgreSQL; phần lớn là do người dùng tự phát triển."

### Client và server có thể nằm khác máy

📖 **Nguyên văn**
> "As is typical of client/server applications, the client and the server can be on different hosts. In that case they communicate over a TCP/IP network connection. You should keep this in mind, because the files that can be accessed on a client machine might not be accessible (or might only be accessible using a different file name) on the database server machine."

🇻🇳 **Dịch**
> "Như thường thấy ở các ứng dụng client/server, client và server có thể nằm trên các host khác nhau. Trong trường hợp đó chúng giao tiếp qua một TCP/IP network connection. Bạn nên ghi nhớ điều này, bởi vì những file truy cập được trên máy client có thể không truy cập được (hoặc chỉ truy cập được bằng một tên file khác) trên máy database server."

> [!warning]
> Hệ quả thực tế: một câu lệnh kiểu "đọc file `/data/import.csv`" chạy trên server sẽ tìm file **trên máy server**, chứ không phải trên laptop của bạn.

### Mỗi connection là một process riêng

📖 **Nguyên văn**
> "The PostgreSQL server can handle multiple concurrent connections from clients. To achieve this it starts (“forks”) a new process for each connection. From that point on, the client and the new server process communicate without intervention by the original postgres process. Thus, the supervisor server process is always running, waiting for client connections, whereas client and associated server processes come and go. (All of this is of course invisible to the user. We only mention it here for completeness.)"

🇻🇳 **Dịch**
> "PostgreSQL server có thể xử lý nhiều connection đồng thời từ các client. Để làm được điều đó nó khởi tạo (“fork”) một process mới cho mỗi connection. Từ thời điểm đó trở đi, client và server process mới giao tiếp với nhau mà không cần sự can thiệp của process `postgres` ban đầu. Như vậy, supervisor server process luôn chạy, chờ các connection từ client, trong khi các client và server process đi kèm thì sinh ra rồi biến mất. (Tất nhiên toàn bộ chuyện này người dùng không nhìn thấy. Chúng tôi chỉ nhắc ở đây cho đầy đủ.)"

💡 **Ví dụ đời sống**
Giống quầy tiếp dân ở phường: có **một** anh trực cửa luôn đứng đó (supervisor `postgres` process). Mỗi khi có người tới, anh ta gọi thêm **một** nhân viên ra ngồi riêng với người đó cho tới khi xong việc (process fork cho mỗi connection). Anh trực cửa không xen vào cuộc trao đổi đó nữa, và tiếp tục đứng chờ người tiếp theo.

Đây cũng là lý do connection PostgreSQL "đắt": mỗi connection tốn nguyên một OS process, nên mở vài nghìn connection không phải chuyện đùa.

---

## 7. Lệnh cơ bản: `createdb`, `dropdb`, `psql`

### Tạo database

📖 **Nguyên văn** — *1.3. Creating a Database*
> "To create a new database from the command line, in this example named mydb, you use the following command:"

🇻🇳 **Dịch**
> "Để tạo một database mới từ command line, ở ví dụ này tên là `mydb`, bạn dùng lệnh sau:"

📖 **Nguyên văn**
```
$ createdb mydb
```

🇻🇳 Tạo một database mới tên `mydb` trên server đang chạy.

📖 **Nguyên văn**
> "If this produces no response then this step was successful and you can skip over the remainder of this section."

🇻🇳 **Dịch**
> "Nếu lệnh này không in ra gì cả thì bước này đã thành công và bạn có thể bỏ qua phần còn lại của mục này."

📖 **Nguyên văn**
> "You can also create databases with other names. PostgreSQL allows you to create any number of databases at a given site. Database names must have an alphabetic first character and are limited to 63 bytes in length. A convenient choice is to create a database with the same name as your current user name. Many tools assume that database name as the default, so it can save you some typing. To create that database, simply type:"

🇻🇳 **Dịch**
> "Bạn cũng có thể tạo database với những tên khác. PostgreSQL cho phép bạn tạo bao nhiêu database tuỳ ý tại một site. Tên database phải bắt đầu bằng một ký tự chữ cái và bị giới hạn ở độ dài 63 byte. Một lựa chọn tiện lợi là tạo database trùng tên với user name hiện tại của bạn. Nhiều công cụ mặc định coi đó là tên database, nên cách này đỡ phải gõ. Để tạo database đó, chỉ cần gõ:"

📖 **Nguyên văn**
```
$ createdb
```

🇻🇳 Gọi `createdb` không kèm tham số → tạo database trùng tên với user name hiện tại.

### Xoá database

📖 **Nguyên văn**
> "If you do not want to use your database anymore you can remove it. For example, if you are the owner (creator) of the database mydb, you can destroy it using the following command:"

🇻🇳 **Dịch**
> "Nếu bạn không muốn dùng database của mình nữa thì có thể xoá nó. Ví dụ, nếu bạn là owner (người tạo) của database `mydb`, bạn có thể huỷ nó bằng lệnh sau:"

📖 **Nguyên văn**
```
$ dropdb mydb
```

🇻🇳 Xoá vĩnh viễn database `mydb`.

📖 **Nguyên văn**
> "(For this command, the database name does not default to the user account name. You always need to specify it.) This action physically removes all files associated with the database and cannot be undone, so this should only be done with a great deal of forethought."

🇻🇳 **Dịch**
> "(Với lệnh này, tên database KHÔNG mặc định lấy theo tên user account. Bạn luôn phải chỉ định rõ.) Hành động này xoá vật lý toàn bộ file gắn với database đó và không thể hoàn tác, nên chỉ nên làm sau khi đã cân nhắc rất kỹ."

> [!danger]
> `dropdb` **không thể undo**. Không có `git revert` ở đây — đây là điểm khác biệt lớn so với những gì đã học ở `[[02 - What is Git]]`, nơi gần như mọi thao tác đều khôi phục được.

### Truy cập database bằng `psql`

📖 **Nguyên văn** — *1.4. Accessing a Database*
> "Once you have created a database, you can access it by:
>
> Running the PostgreSQL interactive terminal program, called psql, which allows you to interactively enter, edit, and execute SQL commands.
>
> Using an existing graphical frontend tool like pgAdmin or an office suite with ODBC or JDBC support to create and manipulate a database. These possibilities are not covered in this tutorial.
>
> Writing a custom application, using one of the several available language bindings. These possibilities are discussed further in Part IV."

🇻🇳 **Dịch**
> "Sau khi đã tạo xong một database, bạn có thể truy cập nó bằng cách:
>
> Chạy chương trình terminal tương tác của PostgreSQL, tên là `psql`, cho phép bạn nhập, sửa và thực thi các lệnh SQL một cách tương tác.
>
> Dùng một công cụ graphical frontend có sẵn như pgAdmin, hoặc một bộ ứng dụng văn phòng có hỗ trợ ODBC hay JDBC, để tạo và thao tác với database. Những khả năng này không được trình bày trong tutorial này.
>
> Viết một ứng dụng riêng, dùng một trong nhiều language binding có sẵn. Những khả năng này được bàn kỹ hơn ở Part IV."

📖 **Nguyên văn**
> "You probably want to start up psql to try the examples in this tutorial. It can be activated for the mydb database by typing the command:"

🇻🇳 **Dịch**
> "Có lẽ bạn sẽ muốn khởi động `psql` để thử các ví dụ trong tutorial này. Nó có thể được kích hoạt cho database `mydb` bằng cách gõ lệnh:"

📖 **Nguyên văn**
```
$ psql mydb
```

🇻🇳 Mở phiên làm việc tương tác `psql` nối tới database `mydb`.

📖 **Nguyên văn**
> "In psql, you will be greeted with the following message:"
```
psql (18.6)
Type "help" for help.

mydb=>
```

🇻🇳 **Dịch**
> "Trong `psql`, bạn sẽ được chào bằng thông điệp sau:" — dòng cuối `mydb=>` là prompt, cho biết đang kết nối tới database `mydb`.

📖 **Nguyên văn**
> "The last line could also be:"
```
mydb=#
```

🇻🇳 **Dịch**
> "Dòng cuối cũng có thể là:" — prompt `=#` (thay vì `=>`) nghĩa là bạn đang đăng nhập với quyền database superuser.

📖 **Nguyên văn**
> "That would mean you are a database superuser, which is most likely the case if you installed the PostgreSQL instance yourself. Being a superuser means that you are not subject to access controls."

🇻🇳 **Dịch**
> "Điều đó có nghĩa bạn là một database superuser, rất có thể là trường hợp của bạn nếu chính bạn tự cài PostgreSQL instance. Là superuser nghĩa là bạn không bị ràng buộc bởi các access control."

### Vài lệnh thử đầu tiên

📖 **Nguyên văn**
> "The last line printed out by psql is the prompt, and it indicates that psql is listening to you and that you can type SQL queries into a work space maintained by psql. Try out these commands:"

🇻🇳 **Dịch**
> "Dòng cuối cùng `psql` in ra là prompt, nó báo rằng `psql` đang lắng nghe bạn và bạn có thể gõ các SQL query vào không gian làm việc do `psql` quản lý. Hãy thử các lệnh sau:"

📖 **Nguyên văn**
```sql
mydb=> SELECT version();
mydb=> SELECT current_date;
mydb=> SELECT 2 + 2;
```

🇻🇳 Lần lượt: in phiên bản PostgreSQL đang chạy; in ngày hiện tại; tính `2 + 2` — ba query đơn giản để xác nhận kết nối hoạt động.

### Lệnh nội bộ của psql (backslash command)

📖 **Nguyên văn**
> "The psql program has a number of internal commands that are not SQL commands. They begin with the backslash character, “\”. For example, you can get help on the syntax of various PostgreSQL SQL commands by typing:"

🇻🇳 **Dịch**
> "Chương trình `psql` có một số lệnh nội bộ vốn không phải lệnh SQL. Chúng bắt đầu bằng ký tự backslash, “\”. Ví dụ, bạn có thể xem trợ giúp về cú pháp của các lệnh SQL trong PostgreSQL bằng cách gõ:"

📖 **Nguyên văn**
```
mydb=> \h
```

🇻🇳 Hiện trợ giúp cú pháp của các lệnh SQL.

📖 **Nguyên văn**
> "To get out of psql, type:"
```
mydb=> \q
```

🇻🇳 **Dịch**
> "Để thoát khỏi `psql`, gõ:" — `\q` là lệnh thoát.

📖 **Nguyên văn**
> "and psql will quit and return you to your command shell. (For more internal commands, type \? at the psql prompt.)"

🇻🇳 **Dịch**
> "và `psql` sẽ thoát, trả bạn về command shell. (Để xem thêm các lệnh nội bộ khác, gõ `\?` tại prompt của `psql`.)"

---

## 8. 💡 Ví dụ đời sống: mô hình bảng quan hệ khách hàng ↔ đơn hàng

Quay lại cửa hàng tạp hoá của bác chủ quán. Bác có **hai** cuốn sổ chứ không phải một:

**Sổ 1 — KHÁCH QUEN** (table `customers`)

| Số thẻ | Tên | Số điện thoại |
|---|---|---|
| 001 | Chị Lan | 090xxx1111 |
| 002 | Anh Hùng | 090xxx2222 |

**Sổ 2 — ĐƠN HÀNG** (table `orders`)

| Mã đơn | Số thẻ khách | Ngày | Tổng tiền |
|---|---|---|---|
| D-100 | 001 | 11/09 | 250.000 |
| D-101 | 001 | 12/09 | 80.000 |
| D-102 | 002 | 12/09 | 1.200.000 |

Vì sao tách hai sổ thay vì ghi hết vào một?

1. **Không lặp lại dữ liệu.** Chị Lan mua 50 lần thì tên và số điện thoại của chị chỉ ghi **một** lần ở sổ khách quen. Nếu gộp chung, bác phải chép lại tên chị 50 lần.
2. **Sửa một chỗ, đúng mọi nơi.** Chị Lan đổi số điện thoại → bác sửa đúng một dòng ở sổ 1. Nếu gộp chung, bác phải dò lại cả 50 dòng, sót một dòng là dữ liệu mâu thuẫn.
3. **Cột "Số thẻ khách" chính là liên kết.** Nó nói: dòng này thuộc về ai ở sổ bên kia. Trong thuật ngữ database, cột `Số thẻ` ở sổ 1 là **primary key**, còn cột `Số thẻ khách` ở sổ 2 là **foreign key** — chính cái *foreign keys* mà tài liệu PostgreSQL liệt kê ở mục 3 phía trên.
4. **Constraint** = quy tắc bác tự đặt: "không được ghi đơn hàng cho số thẻ không có trong sổ khách quen". Database sẽ tự ép quy tắc này, không phụ thuộc vào việc bác có nhớ hay không.

Đó là toàn bộ tinh thần của chữ *relational*: dữ liệu được chẻ ra thành nhiều table gọn gàng, rồi nối lại với nhau bằng key khi cần.

> [!note]
> Định nghĩa chính xác của primary key, foreign key và các loại constraint sẽ được trích nguyên văn từ tài liệu ở bài `[[02 - Tables, Data Types và Constraints]]`. Ví dụ trên chỉ để hình dung trước.

---

## 🔌 Liên hệ stack thực tế

> Phần này là ghi chú riêng, KHÔNG trích từ tài liệu PostgreSQL.

Firestore là document database, không phải relational database, nên cách nghĩ khác hẳn:

- Firestore không có schema cố định cho document trong cùng collection, còn PostgreSQL bắt buộc *"Each row of a given table has the same set of named columns"* (mục 4). Đây là khác biệt nền tảng, không phải chuyện cấu hình.
- Ở Firestore, cách xử lý quan hệ khách hàng ↔ đơn hàng thường là lưu id tham chiếu rồi tự đọc thêm ở phía application; database không tự ép ràng buộc "id này phải tồn tại". Trong PostgreSQL, foreign key constraint làm việc đó ở tầng database.
- Kiến trúc client/server ở mục 6 giải thích vì sao dùng PostgreSQL (ví dụ Cloud SQL) từ môi trường serverless cần chú ý quản lý connection: mỗi connection là một process phía server, khác với Firestore SDK vốn nói chuyện qua HTTP/gRPC.

---

## Liên kết
- Bài trước: [[00 - Tổng hợp (Relational Databases)]]
- Bài kế: [[02 - Tables, Data Types và Constraints]]
- Cross-link: [[02 - What is Git]] — đối lập với `dropdb`, thao tác trong Git gần như luôn khôi phục được

## Nguồn tham khảo
- Roadmap node *Relational Databases* : https://roadmap.sh/backend
- Roadmap node *PostgreSQL* : https://roadmap.sh/backend
- PostgreSQL Documentation — *Preface, 1. What Is PostgreSQL?* : https://www.postgresql.org/docs/current/intro-whatis.html
- PostgreSQL Documentation — *1.2. Architectural Fundamentals* : https://www.postgresql.org/docs/current/tutorial-arch.html
- PostgreSQL Documentation — *1.3. Creating a Database* : https://www.postgresql.org/docs/current/tutorial-createdb.html
- PostgreSQL Documentation — *1.4. Accessing a Database* : https://www.postgresql.org/docs/current/tutorial-accessdb.html
- PostgreSQL Documentation — *2.2. Concepts* : https://www.postgresql.org/docs/current/tutorial-concepts.html
