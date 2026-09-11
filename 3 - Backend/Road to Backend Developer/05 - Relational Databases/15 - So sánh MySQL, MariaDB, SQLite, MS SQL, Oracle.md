# 15 — So sánh MySQL, MariaDB, SQLite, MS SQL, Oracle

> **Nguồn chính:** tài liệu chính thức của TỪNG hệ quản trị (MySQL Reference Manual 8.4, MariaDB KB, SQLite.org, Microsoft Learn, Oracle Database Concepts 23, PostgreSQL Documentation)
> Bài này phủ theo chiều RỘNG 5 hệ còn lại trong node roadmap "Relational Databases", sau khi bài 01–14 đã đi sâu PostgreSQL.

> [!warning] Quy tắc của bài này
> Mỗi hệ chỉ được mô tả bằng **trích dẫn từ tài liệu chính thức của chính hệ đó**. Không dùng blog so sánh, không dùng bảng xếp hạng, không viết theo trí nhớ.
> Đặc điểm nào không trích được từ tài liệu chính thức thì để trống (`—`) và ghi rõ "không kiểm chứng được từ tài liệu chính thức". Không đoán.

---

## Vì sao học sâu một hệ rồi mới đi rộng

Toàn bộ kiến thức nền đã học ở bài 01–14 — table, column, constraint, `JOIN`, index, transaction — không phải là "kiến thức PostgreSQL". Đó là **chuẩn SQL**, và mọi hệ trong danh sách này đều tự mô tả mình bám theo chuẩn đó.

📖 **Nguyên văn** (MySQL)
> "The SQL part of "MySQL" stands for "Structured Query Language". SQL is the most common standardized language used to access databases.
>
> SQL is defined by the ANSI/ISO SQL Standard. The SQL standard has been evolving since 1986 and several versions exist."

🇻🇳 **Dịch**
> "Phần SQL trong "MySQL" là viết tắt của "Structured Query Language". SQL là ngôn ngữ chuẩn hoá phổ biến nhất dùng để truy cập database.
>
> SQL được định nghĩa bởi chuẩn ANSI/ISO SQL. Chuẩn SQL đã tiến hoá từ năm 1986 và tồn tại nhiều phiên bản."

📖 **Nguyên văn** (Oracle)
> "SQL is the ANSI standard language for relational databases. All operations on the data in an Oracle database are performed using SQL statements. [...] Oracle SQL is an implementation of the ANSI standard. Oracle SQL supports numerous features that extend beyond standard SQL."

🇻🇳 **Dịch**
> "SQL là ngôn ngữ chuẩn ANSI cho relational database. Mọi thao tác trên dữ liệu trong một Oracle database đều được thực hiện bằng các câu lệnh SQL. [...] Oracle SQL là một implementation của chuẩn ANSI. Oracle SQL hỗ trợ rất nhiều tính năng vượt ra ngoài SQL chuẩn."

Câu cuối của Oracle là chìa khoá của cả bài: **ai cũng bám chuẩn, rồi ai cũng mở rộng ra ngoài chuẩn.** Cho nên khi chuyển hệ, thứ phải học lại chủ yếu là:

1. Khác biệt cú pháp ở phần mở rộng ngoài chuẩn (kiểu dữ liệu, hàm, lệnh quản trị).
2. Đặc thù vận hành (kiến trúc lưu trữ, backup, tuning, license).

Còn tư duy quan hệ thì mang theo nguyên vẹn — xem lại [[01 - Relational Database và PostgreSQL là gì]].

💡 **Ví dụ đời sống**
Biết lái xe số sàn rồi thì chuyển từ Toyota sang Ford không phải học lái lại từ đầu. Luật giao thông, côn–số–ga vẫn thế. Thứ phải làm quen chỉ là vị trí nút gạt mưa, cách mở nắp capo, và loại dầu nhớt hãng khuyến nghị. Chuẩn SQL là luật giao thông; phần mở rộng riêng của mỗi hệ là vị trí cái nút gạt mưa.

---

## Điểm mốc đối chiếu: PostgreSQL (đã học ở bài 01–14)

📖 **Nguyên văn**
> "PostgreSQL is an object-relational database management system (ORDBMS) based on POSTGRES, Version 4.2, developed at the University of California at Berkeley Computer Science Department. POSTGRES pioneered many concepts that only became available in some commercial database systems much later.
>
> PostgreSQL is an open-source descendant of this original Berkeley code. It supports a large part of the SQL standard and offers many modern features:
>
> complex queries
> foreign keys
> triggers
> updatable views
> transactional integrity
> multiversion concurrency control
>
> Also, PostgreSQL can be extended by the user in many ways, for example by adding new
>
> data types
> functions
> operators
> aggregate functions
> index methods
> procedural languages
>
> And because of the liberal license, PostgreSQL can be used, modified, and distributed by anyone free of charge for any purpose, be it private, commercial, or academic."

🇻🇳 **Dịch**
> "PostgreSQL là một object-relational database management system (ORDBMS) dựa trên POSTGRES, Version 4.2, được phát triển tại khoa Khoa học Máy tính, Đại học California tại Berkeley. POSTGRES đi tiên phong nhiều khái niệm mà mãi về sau mới xuất hiện ở một số hệ database thương mại.
>
> PostgreSQL là hậu duệ mã nguồn mở của phần code Berkeley gốc này. Nó hỗ trợ phần lớn chuẩn SQL và cung cấp nhiều tính năng hiện đại:
>
> complex query
> foreign key
> trigger
> updatable view
> transactional integrity
> multiversion concurrency control
>
> Ngoài ra, PostgreSQL có thể được người dùng mở rộng theo nhiều cách, ví dụ thêm mới
>
> data type
> function
> operator
> aggregate function
> index method
> procedural language
>
> Và nhờ giấy phép rộng rãi, PostgreSQL có thể được bất kỳ ai sử dụng, chỉnh sửa và phân phối miễn phí cho bất kỳ mục đích nào, dù là cá nhân, thương mại hay học thuật."

Ba từ khoá cần giữ trong đầu để so sánh với 5 hệ dưới: **object-relational**, **extensible** (mở rộng bằng data type / index method / procedural language), **liberal license**.

---

## MySQL

> **Nguồn:** MySQL 8.4 Reference Manual — [1.2.1 What is MySQL?](https://dev.mysql.com/doc/refman/8.4/en/what-is-mysql.html)

### Tự giới thiệu

📖 **Nguyên văn**
> "MySQL, the most popular Open Source SQL database management system, is developed, distributed, and supported by Oracle Corporation."

🇻🇳 **Dịch**
> "MySQL, hệ quản trị database SQL mã nguồn mở phổ biến nhất, được phát triển, phân phối và hỗ trợ bởi Oracle Corporation."

📖 **Nguyên văn**
> "**MySQL Server works in client/server or embedded systems.**
>
> The MySQL Database Software is a client/server system that consists of a multithreaded SQL server that supports different back ends, several different client programs and libraries, administrative tools, and a wide range of application programming interfaces (APIs).
>
> We also provide MySQL Server as an embedded multithreaded library that you can link into your application to get a smaller, faster, easier-to-manage standalone product."

🇻🇳 **Dịch**
> "**MySQL Server hoạt động ở dạng client/server hoặc hệ thống nhúng.**
>
> MySQL Database Software là một hệ client/server gồm một SQL server đa luồng hỗ trợ nhiều back end khác nhau, vài chương trình và thư viện client khác nhau, các công cụ quản trị, cùng một loạt application programming interface (API).
>
> Chúng tôi cũng cung cấp MySQL Server dưới dạng một thư viện nhúng đa luồng mà bạn có thể link vào ứng dụng của mình để có một sản phẩm standalone nhỏ hơn, nhanh hơn, dễ quản lý hơn."

Về license, tài liệu nói rõ mô hình kép:

📖 **Nguyên văn**
> "The MySQL software uses the GPL (GNU General Public License), http://www.fsf.org/licenses/, to define what you may and may not do with the software in different situations. If you feel uncomfortable with the GPL or need to embed MySQL code into a commercial application, you can buy a commercially licensed version from us."

🇻🇳 **Dịch**
> "Phần mềm MySQL dùng GPL (GNU General Public License), http://www.fsf.org/licenses/, để định nghĩa bạn được và không được làm gì với phần mềm trong các tình huống khác nhau. Nếu bạn thấy không thoải mái với GPL hoặc cần nhúng code MySQL vào một ứng dụng thương mại, bạn có thể mua một phiên bản có license thương mại từ chúng tôi."

> [!note] Phát âm
> 📖 **Nguyên văn**
> > "The official way to pronounce "MySQL" is "My Ess Que Ell" (not "my sequel"), but we do not mind if you pronounce it as "my sequel" or in some other localized way."
>
> 🇻🇳 **Dịch**
> > "Cách phát âm chính thức của "MySQL" là "My Ess Que Ell" (không phải "my sequel"), nhưng chúng tôi không phiền nếu bạn phát âm là "my sequel" hay theo cách bản địa nào khác."

### Đặc thù lớn nhất so với PostgreSQL: pluggable storage engine

Đây là điểm kiến trúc mà PostgreSQL **không** có tương đương: ở MySQL, tầng lưu trữ dữ liệu là một **component thay thế được**, chọn theo từng table.

> **Nguồn:** MySQL 8.4 Reference Manual — [Chapter 18 Alternative Storage Engines](https://dev.mysql.com/doc/refman/8.4/en/storage-engines.html)

📖 **Nguyên văn**
> "Storage engines are MySQL components that handle the SQL operations for different table types. `InnoDB` is the default and most general-purpose storage engine, and Oracle recommends using it for tables except for specialized use cases. (The `CREATE TABLE` statement in MySQL 8.4 creates `InnoDB` tables by default.)
>
> MySQL Server uses a pluggable storage engine architecture that enables storage engines to be loaded into and unloaded from a running MySQL server.
>
> To determine which storage engines your server supports, use the `SHOW ENGINES` statement."

🇻🇳 **Dịch**
> "Storage engine là các component của MySQL đảm nhiệm các thao tác SQL cho những loại table khác nhau. `InnoDB` là storage engine mặc định và đa dụng nhất, và Oracle khuyến nghị dùng nó cho các table trừ những trường hợp chuyên biệt. (Câu lệnh `CREATE TABLE` trong MySQL 8.4 mặc định tạo table `InnoDB`.)
>
> MySQL Server dùng kiến trúc pluggable storage engine, cho phép nạp storage engine vào và gỡ ra khỏi một MySQL server đang chạy.
>
> Để biết server của bạn hỗ trợ những storage engine nào, dùng câu lệnh `SHOW ENGINES`."

Một số storage engine mà tài liệu MySQL 8.4 liệt kê, kèm mô tả nguyên văn:

📖 **Nguyên văn**
> "`InnoDB`: The default storage engine in MySQL 8.4. `InnoDB` is a transaction-safe (ACID compliant) storage engine for MySQL that has commit, rollback, and crash-recovery capabilities to protect user data."

🇻🇳 **Dịch**
> "`InnoDB`: Storage engine mặc định trong MySQL 8.4. `InnoDB` là một storage engine transaction-safe (tuân thủ ACID) cho MySQL, có các khả năng commit, rollback và crash-recovery để bảo vệ dữ liệu người dùng."

📖 **Nguyên văn**
> "`MyISAM`: These tables have a small footprint. Table-level locking limits the performance in read/write workloads, so it is often used in read-only or read-mostly workloads in Web and data warehousing configurations."

🇻🇳 **Dịch**
> "`MyISAM`: Các table loại này chiếm ít dung lượng. Việc khoá ở mức table (table-level locking) giới hạn hiệu năng với workload đọc/ghi, nên nó thường được dùng cho workload chỉ-đọc hoặc chủ-yếu-đọc trong các cấu hình Web và data warehousing."

📖 **Nguyên văn**
> "`Memory`: Stores all data in RAM, for fast access in environments that require quick lookups of non-critical data."

🇻🇳 **Dịch**
> "`Memory`: Lưu toàn bộ dữ liệu trong RAM, để truy cập nhanh trong các môi trường cần tra cứu nhanh dữ liệu không trọng yếu."

📖 **Nguyên văn**
> "`Blackhole`: The Blackhole storage engine accepts but does not store data, similar to the Unix `/dev/null` device. Queries always return an empty set."

🇻🇳 **Dịch**
> "`Blackhole`: Storage engine Blackhole nhận dữ liệu nhưng không lưu, tương tự thiết bị `/dev/null` của Unix. Query luôn trả về tập rỗng."

Ngoài ra tài liệu còn liệt kê `CSV`, `Archive`, `NDB`, `Merge`, `Federated`, `Example`.

> [!warning] Hệ quả thực tế của pluggable storage engine
> Vì transaction do storage engine cung cấp chứ không do server, nên câu hỏi "MySQL có transaction không" phụ thuộc vào engine của table. Tài liệu nói rõ `InnoDB` là "transaction-safe (ACID compliant)", còn `MyISAM` được mô tả bằng "table-level locking" chứ không có từ "transaction". Ở PostgreSQL câu hỏi này không tồn tại — xem lại [[05 - Transactions, ACID và MVCC]].
> Tài liệu MySQL cũng liệt kê khả năng này như một tính năng chủ đích: "Provides transactional and nontransactional storage engines." ("Cung cấp cả storage engine có transaction lẫn không có transaction.")

💡 **Ví dụ đời sống**
PostgreSQL giống một chiếc xe bán nguyên khối: động cơ gắn liền, muốn đổi thì phải đổi cả xe. MySQL giống một khung xe đua có thể tháo lắp động cơ: cùng một vô-lăng và hộp số (SQL), nhưng bạn chọn gắn động cơ an toàn có phanh ABS (`InnoDB`) hay động cơ nhẹ tối giản không phanh (`MyISAM`) — và chọn riêng cho từng chiếc table.

---

## MariaDB

> **Nguồn:** MariaDB Knowledge Base — [MariaDB versus MySQL - Compatibility](https://mariadb.com/kb/en/mariadb-vs-mysql-compatibility/)

MariaDB không được mô tả ở đây bằng "một hệ database mới", mà bằng **quan hệ tương thích với MySQL** — đó chính là danh tính của nó.

📖 **Nguyên văn**
> "Until MariaDB 5.5, MariaDB versions functioned as a "drop-in replacement" for the equivalent MySQL version, with some limitations. From MariaDB 10.0, it is usually still very easy to upgrade from MySQL."

🇻🇳 **Dịch**
> "Cho tới MariaDB 5.5, các phiên bản MariaDB hoạt động như một "drop-in replacement" (thay thế trực tiếp không cần sửa gì) cho phiên bản MySQL tương đương, với một vài giới hạn. Từ MariaDB 10.0 trở đi, việc nâng cấp từ MySQL thường vẫn rất dễ."

### Tương thích tới mức nào — trích nguyên văn danh sách

📖 **Nguyên văn**
> "MariaDB's data files are generally binary compatible with those from the equivalent MySQL version.
> All filenames and paths are generally the same.
> Data and table definition files (.frm) files are binary compatible.
> See note below for an incompatibility with views!
> MariaDB's client protocol is binary compatible with MySQL's client protocol.
> All client APIs and structs are identical.
> All ports and sockets are generally the same.
> All MySQL connectors (PHP, Perl, Python, Java, .NET, MyODBC, Ruby, MySQL C connector etc) work unchanged with MariaDB."

🇻🇳 **Dịch**
> "Các file dữ liệu của MariaDB nhìn chung tương thích nhị phân với file của phiên bản MySQL tương đương.
> Mọi tên file và đường dẫn nhìn chung là giống nhau.
> File dữ liệu và file định nghĩa table (.frm) tương thích nhị phân.
> Xem ghi chú bên dưới về một điểm không tương thích với view!
> Client protocol của MariaDB tương thích nhị phân với client protocol của MySQL.
> Mọi client API và struct đều giống hệt nhau.
> Mọi port và socket nhìn chung là giống nhau.
> Mọi connector của MySQL (PHP, Perl, Python, Java, .NET, MyODBC, Ruby, MySQL C connector v.v.) hoạt động với MariaDB mà không cần sửa đổi gì."

📖 **Nguyên văn**
> "This means that for many cases, you can just uninstall MySQL and install MariaDB and you are good to go. There is not generally any need to convert any data files.
>
> However, you must still run `mysql_upgrade` to finish the upgrade. This is needed to ensure that your mysql privilege and event tables are updated with the new fields MariaDB uses."

🇻🇳 **Dịch**
> "Điều này nghĩa là trong nhiều trường hợp, bạn chỉ cần gỡ MySQL và cài MariaDB là xong. Nhìn chung không cần convert file dữ liệu nào cả.
>
> Tuy nhiên bạn vẫn phải chạy `mysql_upgrade` để hoàn tất việc nâng cấp. Bước này cần thiết để đảm bảo các table privilege và event của mysql được cập nhật những field mới mà MariaDB dùng."

🇻🇳 `mysql_upgrade` là công cụ dòng lệnh cập nhật các bảng hệ thống (privilege, event) sang schema mà phiên bản mới yêu cầu.

### Nhưng tương thích đang xa dần

📖 **Nguyên văn**
> "That said, MariaDB has a lot of new options, extension, storage engines and bug fixes that are not in MySQL."

🇻🇳 **Dịch**
> "Dù vậy, MariaDB có rất nhiều option mới, extension, storage engine và bản sửa lỗi mà MySQL không có."

📖 **Nguyên văn**
> "MariaDB 10.2, MariaDB 10.3, and MariaDB 10.4 function as limited drop-in replacements for MySQL 5.7, as far as InnoDB is concerned. However, the implementation differences continue to grow in each new MariaDB version.
> MariaDB 10.0 and MariaDB 10.1 function as limited drop-in replacements for MySQL 5.6, as far as InnoDB is concerned. However, there are some implementation differences in some features.
> MariaDB 5.5 functions as a drop-in replacement for MySQL 5.5.
> MariaDB 5.1, MariaDB 5.2, and MariaDB 5.3 function as drop-in replacements for MySQL 5.1."

🇻🇳 **Dịch**
> "MariaDB 10.2, MariaDB 10.3 và MariaDB 10.4 hoạt động như drop-in replacement có giới hạn cho MySQL 5.7, xét trên phạm vi InnoDB. Tuy nhiên, khác biệt về implementation tiếp tục lớn dần qua mỗi phiên bản MariaDB mới.
> MariaDB 10.0 và MariaDB 10.1 hoạt động như drop-in replacement có giới hạn cho MySQL 5.6, xét trên phạm vi InnoDB. Tuy nhiên có một số khác biệt implementation ở vài tính năng.
> MariaDB 5.5 hoạt động như drop-in replacement cho MySQL 5.5.
> MariaDB 5.1, MariaDB 5.2 và MariaDB 5.3 hoạt động như drop-in replacement cho MySQL 5.1."

> [!tip] Đọc được gì từ đoạn này
> Chú ý cách dùng từ giảm dần theo thời gian: bản 5.x là "drop-in replacements" (không kèm điều kiện), bản 10.x trở đi là "**limited** drop-in replacements ... **as far as InnoDB is concerned**". Và câu "the implementation differences continue to grow in each new MariaDB version" là lời thừa nhận trực tiếp từ chính tài liệu MariaDB rằng hai hệ đang tách xa nhau. Nói "MariaDB = MySQL" là sai với tài liệu hiện hành.

💡 **Ví dụ đời sống**
Hai anh em sinh đôi cùng trứng, lúc 5 tuổi thay nhau đi học thay không ai phát hiện. Đến 30 tuổi vẫn giống mặt, vẫn chung họ, nhưng nghề nghiệp và giọng nói đã khác — đưa CV của người này đi phỏng vấn thay người kia thì không còn trót lọt hoàn toàn nữa.

---

## SQLite

> **Nguồn:** [About SQLite](https://www.sqlite.org/about.html) , [Appropriate Uses For SQLite](https://www.sqlite.org/whentouse.html) , [Datatypes In SQLite](https://www.sqlite.org/datatype3.html)

### Tự giới thiệu

📖 **Nguyên văn**
> "SQLite is an in-process library that implements a self-contained, serverless, zero-configuration, transactional SQL database engine. The code for SQLite is in the public domain and is thus free for use for any purpose, commercial or private. SQLite is the most widely deployed database in the world with more applications than we can count, including several high-profile projects."

🇻🇳 **Dịch**
> "SQLite là một thư viện chạy trong tiến trình (in-process library), hiện thực một SQL database engine tự-chứa (self-contained), không-server (serverless), không-cần-cấu-hình (zero-configuration) và có transaction. Code của SQLite thuộc public domain nên được dùng miễn phí cho mọi mục đích, thương mại hay cá nhân. SQLite là database được triển khai rộng rãi nhất thế giới với số lượng ứng dụng nhiều hơn chúng tôi đếm được, bao gồm nhiều dự án nổi tiếng."

📖 **Nguyên văn**
> "SQLite is an embedded SQL database engine. Unlike most other SQL databases, SQLite does not have a separate server process. SQLite reads and writes directly to ordinary disk files. A complete SQL database with multiple tables, indices, triggers, and views, is contained in a single disk file."

🇻🇳 **Dịch**
> "SQLite là một SQL database engine nhúng (embedded). Khác với hầu hết các SQL database khác, SQLite không có tiến trình server riêng. SQLite đọc và ghi trực tiếp vào các file đĩa thông thường. Một database SQL hoàn chỉnh với nhiều table, index, trigger và view được chứa trong một file đĩa duy nhất."

📖 **Nguyên văn**
> "Think of SQLite not as a replacement for Oracle but as a replacement for fopen()"

🇻🇳 **Dịch**
> "Hãy nghĩ về SQLite không phải như thứ thay thế Oracle, mà như thứ thay thế `fopen()`"

Đây là câu định vị quan trọng nhất của cả dự án SQLite. Trang `whentouse.html` mở đầu bằng chính ý đó:

📖 **Nguyên văn**
> "SQLite is not directly comparable to client/server SQL database engines such as MySQL, Oracle, PostgreSQL, or SQL Server since SQLite is trying to solve a different problem.
>
> Client/server SQL database engines strive to implement a shared repository of enterprise data. They emphasize scalability, concurrency, centralization, and control. SQLite strives to provide local data storage for individual applications and devices. SQLite emphasizes economy, efficiency, reliability, independence, and simplicity.
>
> SQLite does not compete with client/server databases. SQLite competes with fopen()."

🇻🇳 **Dịch**
> "SQLite không so sánh trực tiếp được với các SQL database engine kiểu client/server như MySQL, Oracle, PostgreSQL hay SQL Server, bởi SQLite đang cố giải một bài toán khác.
>
> Các SQL database engine client/server nỗ lực hiện thực một kho dữ liệu doanh nghiệp dùng chung. Chúng nhấn mạnh khả năng mở rộng (scalability), tính đồng thời (concurrency), sự tập trung hoá và khả năng kiểm soát. SQLite nỗ lực cung cấp lưu trữ dữ liệu cục bộ cho từng ứng dụng và thiết bị riêng lẻ. SQLite nhấn mạnh sự tiết kiệm, hiệu quả, độ tin cậy, tính độc lập và sự đơn giản.
>
> SQLite không cạnh tranh với các database client/server. SQLite cạnh tranh với `fopen()`."

### Khi nào NÊN dùng — trích nguyên văn

📖 **Nguyên văn**
> "**Embedded devices and the internet of things**
> Because an SQLite database requires no administration, it works well in devices that must operate without expert human support. SQLite is a good fit for use in cellphones, set-top boxes, televisions, game consoles, cameras, watches, kitchen appliances, thermostats, automobiles, machine tools, airplanes, remote sensors, drones, medical devices, and robots: the "internet of things"."

🇻🇳 **Dịch**
> "**Thiết bị nhúng và internet of things**
> Vì một database SQLite không cần quản trị, nó hoạt động tốt trong các thiết bị phải vận hành mà không có người hỗ trợ chuyên môn. SQLite phù hợp để dùng trong điện thoại di động, set-top box, tivi, máy chơi game, máy ảnh, đồng hồ, thiết bị nhà bếp, bộ điều nhiệt, ô tô, máy công cụ, máy bay, cảm biến từ xa, drone, thiết bị y tế và robot: cái gọi là "internet of things"."

📖 **Nguyên văn**
> "**Websites**
> SQLite works great as the database engine for most low to medium traffic websites (which is to say, most websites). The amount of web traffic that SQLite can handle depends on how heavily the website uses its database. Generally speaking, any site that gets fewer than 100K hits/day should work fine with SQLite. The 100K hits/day figure is a conservative estimate, not a hard upper bound. SQLite has been demonstrated to work with 10 times that amount of traffic."

🇻🇳 **Dịch**
> "**Website**
> SQLite hoạt động rất tốt trong vai trò database engine cho phần lớn website có lưu lượng thấp đến trung bình (tức là phần lớn website). Lượng traffic web mà SQLite xử lý được phụ thuộc vào mức độ website dùng database của nó. Nói chung, bất kỳ site nào nhận dưới 100 nghìn hit/ngày đều nên chạy tốt với SQLite. Con số 100 nghìn hit/ngày là ước lượng thận trọng, không phải giới hạn trên cứng. SQLite đã được chứng minh là hoạt động với lượng traffic gấp 10 lần con số đó."

📖 **Nguyên văn**
> "**Application file format**
> SQLite is often used as the on-disk file format for desktop applications such as version control systems, financial analysis tools, media cataloging and editing suites, CAD packages, record keeping programs, and so forth."

🇻🇳 **Dịch**
> "**Định dạng file của ứng dụng**
> SQLite thường được dùng làm định dạng file trên đĩa cho các ứng dụng desktop như version control system, công cụ phân tích tài chính, bộ phần mềm quản lý và biên tập media, gói CAD, chương trình lưu trữ hồ sơ, v.v."

Ngoài ra trang này còn liệt kê: *Data analysis*, *Cache for enterprise data*, *Server-side database*, *Data transfer format*, *File archive and/or data container*, *Replacement for ad hoc disk files*, *Internal or temporary databases*, *Stand-in for an enterprise database during demos or testing*, *Education and Training*, *Experimental SQL language extensions*.

### Khi nào KHÔNG nên dùng — trích nguyên văn

> [!danger] "Situations Where A Client/Server RDBMS May Work Better"

📖 **Nguyên văn**
> "**Client/Server Applications**
> If there are many client programs sending SQL to the same database over a network, then use a client/server database engine instead of SQLite. SQLite will work over a network filesystem, but because of the latency associated with most network filesystems, performance will not be great. Also, file locking logic is buggy in many network filesystem implementations (on both Unix and Windows). If file locking does not work correctly, two or more clients might try to modify the same part of the same database at the same time, resulting in corruption."

🇻🇳 **Dịch**
> "**Ứng dụng client/server**
> Nếu có nhiều chương trình client gửi SQL tới cùng một database qua mạng, hãy dùng một database engine client/server thay vì SQLite. SQLite vẫn chạy được trên network filesystem, nhưng vì độ trễ của hầu hết network filesystem, hiệu năng sẽ không tốt. Ngoài ra, logic khoá file bị lỗi trong nhiều implementation network filesystem (trên cả Unix lẫn Windows). Nếu việc khoá file không hoạt động đúng, hai hoặc nhiều client có thể cùng lúc sửa cùng một phần của cùng một database, dẫn tới hỏng dữ liệu."

📖 **Nguyên văn**
> "**High-volume Websites**
> SQLite will normally work fine as the database backend to a website. But if the website is write-intensive or is so busy that it requires multiple servers, then consider using an enterprise-class client/server database engine instead of SQLite."

🇻🇳 **Dịch**
> "**Website lưu lượng lớn**
> SQLite thường chạy tốt trong vai trò database backend cho một website. Nhưng nếu website nặng về ghi (write-intensive) hoặc bận tới mức cần nhiều server, thì hãy cân nhắc dùng một database engine client/server cấp doanh nghiệp thay vì SQLite."

📖 **Nguyên văn**
> "**Very large datasets**
> An SQLite database is limited in size to 281 terabytes (2^48 bytes, 256 tibibytes). And even if it could handle larger databases, SQLite stores the entire database in a single disk file and many filesystems limit the maximum size of files to something less than this."

🇻🇳 **Dịch**
> "**Tập dữ liệu rất lớn**
> Một database SQLite bị giới hạn kích thước ở 281 terabyte (2^48 byte, 256 tibibyte). Và kể cả nếu nó xử lý được database lớn hơn, SQLite lưu toàn bộ database trong một file đĩa duy nhất, mà nhiều filesystem lại giới hạn kích thước tối đa của file nhỏ hơn con số này."

📖 **Nguyên văn**
> "**High Concurrency**
> SQLite supports an unlimited number of simultaneous readers, but it will only allow one writer at any instant in time. For many situations, this is not a problem. Writers queue up. Each application does its database work quickly and moves on, and no lock lasts for more than a few dozen milliseconds. But there are some applications that require more concurrency, and those applications may need to seek a different solution."

🇻🇳 **Dịch**
> "**Tính đồng thời cao**
> SQLite hỗ trợ số lượng reader đồng thời không giới hạn, nhưng tại mỗi thời điểm chỉ cho phép MỘT writer. Với nhiều tình huống, đây không phải vấn đề. Các writer xếp hàng. Mỗi ứng dụng làm việc với database thật nhanh rồi đi tiếp, và không lock nào kéo dài quá vài chục mili-giây. Nhưng có một số ứng dụng đòi hỏi tính đồng thời cao hơn, và những ứng dụng đó có thể cần tìm giải pháp khác."

Trang kết bằng một checklist gọn:

📖 **Nguyên văn**
> "Is the data separated from the application by a network? → choose client/server
> Many concurrent writers? → choose client/server
> Big data? → choose client/server
> Otherwise → choose SQLite!"

🇻🇳 **Dịch**
> "Dữ liệu bị ngăn cách với ứng dụng bởi một mạng? → chọn client/server
> Nhiều writer đồng thời? → chọn client/server
> Dữ liệu lớn? → chọn client/server
> Còn lại → chọn SQLite!"

### Khác biệt lớn nhất của SQLite so với MỌI hệ còn lại: dynamic typing

📖 **Nguyên văn**
> "Most SQL database engines (every SQL database engine other than SQLite, as far as we know) uses static, rigid typing. With static typing, the datatype of a value is determined by its container - the particular column in which the value is stored.
>
> SQLite uses a more general dynamic type system. In SQLite, the datatype of a value is associated with the value itself, not with its container. The dynamic type system of SQLite is backwards compatible with the more common static type systems of other database engines in the sense that SQL statements that work on statically typed databases work the same way in SQLite. However, the dynamic typing in SQLite allows it to do things which are not possible in traditional rigidly typed databases. Flexible typing is a feature of SQLite, not a bug."

🇻🇳 **Dịch**
> "Hầu hết các SQL database engine (theo chỗ chúng tôi biết là mọi SQL database engine ngoài SQLite) dùng kiểu tĩnh, cứng (static, rigid typing). Với static typing, kiểu dữ liệu của một giá trị được xác định bởi cái chứa nó — tức là cột cụ thể nơi giá trị được lưu.
>
> SQLite dùng một hệ kiểu động (dynamic type system) tổng quát hơn. Trong SQLite, kiểu dữ liệu của một giá trị gắn với chính giá trị đó, chứ không gắn với cái chứa nó. Hệ kiểu động của SQLite tương thích ngược với hệ kiểu tĩnh phổ biến hơn của các database engine khác, theo nghĩa các câu lệnh SQL chạy được trên database kiểu tĩnh cũng chạy y như vậy trong SQLite. Tuy nhiên, dynamic typing trong SQLite cho phép nó làm những việc bất khả thi với database kiểu cứng truyền thống. Kiểu linh hoạt là một TÍNH NĂNG của SQLite, không phải lỗi."

Hệ quả trực tiếp:

📖 **Nguyên văn**
> "Any column in an SQLite version 3 database, except an INTEGER PRIMARY KEY column, may be used to store a value of any storage class."

🇻🇳 **Dịch**
> "Bất kỳ cột nào trong một database SQLite version 3, trừ cột INTEGER PRIMARY KEY, đều có thể dùng để lưu một giá trị thuộc bất kỳ storage class nào."

Năm storage class được liệt kê nguyên văn:

📖 **Nguyên văn**
> "NULL. The value is a NULL value.
> INTEGER. The value is a signed integer, stored in 0, 1, 2, 3, 4, 6, or 8 bytes depending on the magnitude of the value.
> REAL. The value is a floating point value, stored as an 8-byte IEEE floating point number.
> TEXT. The value is a text string, stored using the database encoding (UTF-8, UTF-16BE or UTF-16LE).
> BLOB. The value is a blob of data, stored exactly as it was input."

🇻🇳 **Dịch**
> "NULL. Giá trị là một giá trị NULL.
> INTEGER. Giá trị là số nguyên có dấu, lưu trong 0, 1, 2, 3, 4, 6 hoặc 8 byte tuỳ theo độ lớn của giá trị.
> REAL. Giá trị là số thực dấu phẩy động, lưu dưới dạng số IEEE floating point 8 byte.
> TEXT. Giá trị là một chuỗi văn bản, lưu theo encoding của database (UTF-8, UTF-16BE hoặc UTF-16LE).
> BLOB. Giá trị là một khối dữ liệu nhị phân, lưu đúng nguyên như lúc nhập vào."

Vậy `VARCHAR(10)`, `DECIMAL`, `BOOLEAN`... trong SQLite là gì? Là **type affinity** — một *gợi ý*, không phải ràng buộc:

📖 **Nguyên văn**
> "The type affinity of a column is the recommended type for data stored in that column. The important idea here is that the type is recommended, not required. Any column can still store any type of data. It is just that some columns, given the choice, will prefer to use one storage class over another. The preferred storage class for a column is called its "affinity".
>
> Each column in an SQLite 3 database is assigned one of the following type affinities:
>
> TEXT
> NUMERIC
> INTEGER
> REAL
> BLOB"

🇻🇳 **Dịch**
> "Type affinity của một cột là kiểu *được khuyến nghị* cho dữ liệu lưu trong cột đó. Ý quan trọng ở đây là kiểu được khuyến nghị, KHÔNG phải bắt buộc. Mọi cột vẫn có thể lưu bất kỳ loại dữ liệu nào. Chỉ là một số cột, khi có lựa chọn, sẽ ưu tiên dùng storage class này hơn storage class kia. Storage class được ưu tiên của một cột gọi là "affinity" của nó.
>
> Mỗi cột trong một database SQLite 3 được gán một trong các type affinity sau:
>
> TEXT
> NUMERIC
> INTEGER
> REAL
> BLOB"

📖 **Nguyên văn**
> "If the declared type contains the string "INT" then it is assigned INTEGER affinity."

🇻🇳 **Dịch**
> "Nếu kiểu khai báo có chứa chuỗi "INT" thì cột được gán INTEGER affinity."

> [!warning] Đây là cái bẫy lớn nhất khi từ PostgreSQL sang SQLite
> Ở PostgreSQL, khai báo `age integer` là một **ràng buộc**: nhét chuỗi `'abc'` vào sẽ bị từ chối. Ở SQLite, khai báo đó chỉ là **affinity**: nếu giá trị không phải số hợp lệ, nó vẫn được lưu nguyên dạng TEXT. Cột không bảo vệ bạn. Xem lại tư duy constraint ở [[02 - Tables, Data Types và Constraints]].
>
> Từ 3.37.0 SQLite có đường thoát:
> 📖 **Nguyên văn**
> > "As of version 3.37.0 (2021-11-27), SQLite provides STRICT tables that do rigid type enforcement, for developers who prefer that kind of thing."
>
> 🇻🇳 **Dịch**
> > "Kể từ phiên bản 3.37.0 (2021-11-27), SQLite cung cấp các table STRICT thực thi kiểu một cách cứng rắn, dành cho lập trình viên nào thích kiểu đó."

💡 **Ví dụ đời sống**
Tủ hồ sơ ở PostgreSQL có ngăn dán nhãn "Hoá đơn" và nắp ngăn được cắt vừa khít khổ giấy hoá đơn — nhét quyển sổ tay vào là không lọt. Tủ SQLite cũng dán nhãn "Hoá đơn", nhưng ngăn để trống hoàn toàn: nhãn chỉ là lời nhắc, bạn nhét quyển sổ tay, cái bút, hay hộp cơm vào đều được. Muốn cái nắp cắt vừa khít thì phải đặt riêng — đó là `STRICT`.

---

## Microsoft SQL Server

> **Nguồn:** Microsoft Learn — [What is SQL Server?](https://learn.microsoft.com/en-us/sql/sql-server/what-is-sql-server)

📖 **Nguyên văn**
> "Microsoft SQL Server is a relational database management system (RDBMS). Applications and tools connect to a SQL Server instance or database, and communicate using Transact-SQL (T-SQL).
>
> SQL Server is one of many products and platforms that runs the Microsoft SQL Database Engine."

🇻🇳 **Dịch**
> "Microsoft SQL Server là một relational database management system (RDBMS). Các ứng dụng và công cụ kết nối tới một instance hoặc database của SQL Server, và giao tiếp bằng Transact-SQL (T-SQL).
>
> SQL Server là một trong nhiều sản phẩm và nền tảng chạy Microsoft SQL Database Engine."

Điểm cần nhớ: **T-SQL** là phương ngữ SQL riêng của Microsoft, tương ứng vị trí mà PL/pgSQL giữ ở PostgreSQL.

### Deployment — không còn chỉ Windows

📖 **Nguyên văn**
> "You can install SQL Server on Windows or Linux, deploy it in a Linux container, or deploy it on Azure Virtual Machines or other virtual machine platform. You previously might have referred to this as the boxed product."

🇻🇳 **Dịch**
> "Bạn có thể cài SQL Server trên Windows hoặc Linux, triển khai nó trong một Linux container, hoặc triển khai trên Azure Virtual Machines hay nền tảng máy ảo khác. Trước đây bạn có thể đã gọi đây là "boxed product" (sản phẩm đóng hộp)."

📖 **Nguyên văn**
> "The underlying SQL Server Database Engine is also used by the following products and services:
>
> Azure SQL Database
> SQL database in Microsoft Fabric
> Azure SQL Managed Instance
> Microsoft Fabric Data Warehouse and the SQL analytics endpoint in Microsoft Fabric"

🇻🇳 **Dịch**
> "SQL Server Database Engine bên dưới cũng được dùng bởi các sản phẩm và dịch vụ sau:
>
> Azure SQL Database
> SQL database trong Microsoft Fabric
> Azure SQL Managed Instance
> Microsoft Fabric Data Warehouse và SQL analytics endpoint trong Microsoft Fabric"

### Đặc thù: một bộ sản phẩm, không chỉ một database engine

📖 **Nguyên văn**
> "**Database Engine**
> The Database Engine is the core service for storing, processing, and securing data. The Database Engine provides controlled access and transaction processing to meet the requirements of the most demanding data consuming applications within your enterprise."

🇻🇳 **Dịch**
> "**Database Engine**
> Database Engine là dịch vụ lõi để lưu trữ, xử lý và bảo mật dữ liệu. Database Engine cung cấp truy cập có kiểm soát và xử lý transaction nhằm đáp ứng yêu cầu của những ứng dụng tiêu thụ dữ liệu khắt khe nhất trong doanh nghiệp của bạn."

📖 **Nguyên văn**
> "**Integration Services (SSIS)**
> SQL Server Integration Services is a platform for building high performance data integration solutions, including packages that provide extract, transform, and load (ETL) processing for data warehousing."

🇻🇳 **Dịch**
> "**Integration Services (SSIS)**
> SQL Server Integration Services là một nền tảng để xây dựng giải pháp tích hợp dữ liệu hiệu năng cao, bao gồm các package cung cấp xử lý extract, transform, load (ETL) cho data warehousing."

📖 **Nguyên văn**
> "**Analysis Services (SSAS)**
> SQL Server Analysis Services is an analytical data platform and toolset for personal, team, and corporate business intelligence."

🇻🇳 **Dịch**
> "**Analysis Services (SSAS)**
> SQL Server Analysis Services là một nền tảng dữ liệu phân tích và bộ công cụ cho business intelligence ở cấp cá nhân, nhóm và doanh nghiệp."

📖 **Nguyên văn**
> "**Reporting Services (SSRS)**
> SQL Server Reporting Services delivers enterprise, Web-enabled reporting functionality."

🇻🇳 **Dịch**
> "**Reporting Services (SSRS)**
> SQL Server Reporting Services cung cấp chức năng báo cáo cấp doanh nghiệp, hoạt động trên nền Web."

📖 **Nguyên văn**
> "**Machine Learning Services (MLS)**
> SQL Server Machine Learning Services supports integration of machine learning, using the popular R and Python languages, into enterprise workflows."

🇻🇳 **Dịch**
> "**Machine Learning Services (MLS)**
> SQL Server Machine Learning Services hỗ trợ tích hợp machine learning, dùng hai ngôn ngữ phổ biến R và Python, vào các workflow doanh nghiệp."

📖 **Nguyên văn**
> "**Replication**
> SQL Server Replication is a set of technologies for copying and distributing data and database objects from one database to another, and then synchronizing between databases to maintain consistency."

🇻🇳 **Dịch**
> "**Replication**
> SQL Server Replication là một tập công nghệ để sao chép và phân phối dữ liệu cùng các database object từ database này sang database khác, rồi đồng bộ giữa các database để giữ tính nhất quán."

> [!note] Ghi chú về license của SQL Server
> Trang "What is SQL Server?" chỉ nói: "Supported versions of SQL Server depend on your license agreement" ("Các phiên bản SQL Server được hỗ trợ phụ thuộc vào thoả thuận license của bạn") và trỏ sang các trang Editions riêng. Trang này **không** phát biểu mô hình license cụ thể, nên bài này không ghi gì thêm về license của SQL Server.

---

## Oracle Database

> **Nguồn:** Oracle Database Concepts 23 — [1 Introduction to Oracle Database](https://docs.oracle.com/en/database/oracle/oracle-database/23/cncpt/introduction-to-oracle-database.html)

> [!note] Về tên gọi trong trích dẫn
> Trang tài liệu này hiện dùng tên "Oracle AI Database" ở phần lớn nội dung. Các trích dẫn dưới đây giữ **nguyên văn** tên như trang hiển thị, không sửa thành "Oracle Database".

### Tự giới thiệu

📖 **Nguyên văn**
> "Oracle AI Database is an RDBMS. An RDBMS that implements object-oriented features such as user-defined types, inheritance, and polymorphism is called an object-relational database management system (ORDBMS). Oracle AI Database has extended the relational model to an object-relational model, making it possible to store complex business models in a relational database."

🇻🇳 **Dịch**
> "Oracle AI Database là một RDBMS. Một RDBMS có hiện thực các tính năng hướng đối tượng như user-defined type, kế thừa (inheritance) và đa hình (polymorphism) thì được gọi là object-relational database management system (ORDBMS). Oracle AI Database đã mở rộng mô hình quan hệ thành mô hình object-relational, giúp có thể lưu các mô hình nghiệp vụ phức tạp trong một relational database."

Chú ý: đây là **cùng một thuật ngữ ORDBMS** mà PostgreSQL dùng để tự mô tả ở đầu bài.

### Database vs instance — đặc thù thuật ngữ Oracle

📖 **Nguyên văn**
> "An Oracle database server consists of a database and at least one database instance, commonly referred to as simply an instance.
>
> Database
> A database is a set of files, located on disk, that store user data. These data files can exist independently of a database instance.
>
> Database instance
> An instance is a named set of memory structures that manage database files. A database instance consists of a shared memory area, called the system global area (SGA), and a set of background processes. An instance can exist independently of database files."

🇻🇳 **Dịch**
> "Một Oracle database server gồm một database và ít nhất một database instance, thường được gọi tắt là instance.
>
> Database
> Database là một tập các file nằm trên đĩa, lưu dữ liệu người dùng. Các file dữ liệu này có thể tồn tại độc lập với một database instance.
>
> Database instance
> Instance là một tập có tên gồm các cấu trúc bộ nhớ quản lý các file database. Một database instance gồm một vùng bộ nhớ dùng chung gọi là system global area (SGA), và một tập các background process. Một instance có thể tồn tại độc lập với các file database."

### Đặc thù lớn nhất: multitenant architecture (CDB / PDB)

📖 **Nguyên văn**
> "Every Oracle AI Database must contain or be able to be contained by another database. For example, a CDB contains PDBs, and an application container contains application PDBs. A PDB is contained by a CDB or application container, and an application container is contained by a CDB.
>
> Starting in Oracle Database 21c, a multitenant container database is the only supported architecture. In previous releases, Oracle supported non-container databases (non-CDBs)."

🇻🇳 **Dịch**
> "Mọi Oracle AI Database đều phải chứa hoặc có khả năng được chứa bởi một database khác. Ví dụ, một CDB chứa các PDB, và một application container chứa các application PDB. Một PDB được chứa bởi một CDB hoặc một application container, còn application container được chứa bởi một CDB.
>
> Bắt đầu từ Oracle Database 21c, multitenant container database là kiến trúc DUY NHẤT được hỗ trợ. Ở các bản phát hành trước, Oracle có hỗ trợ non-container database (non-CDB)."

📖 **Nguyên văn**
> "A PDB is a portable collection of schemas, schema objects, and nonschema objects that appears to an application as a separate database.
>
> At the physical level, each PDB has its own set of data files that store the data for the PDB. [...] To move or archive a PDB, you can unplug it. An unplugged PDB consists of the PDB data files and a metadata file. An unplugged PDB is not usable until it is plugged in to a CDB."

🇻🇳 **Dịch**
> "PDB là một tập hợp có thể di chuyển được (portable) gồm các schema, schema object và nonschema object, và trông như một database riêng biệt đối với ứng dụng.
>
> Ở mức vật lý, mỗi PDB có tập file dữ liệu riêng lưu dữ liệu cho PDB đó. [...] Để di chuyển hoặc lưu trữ một PDB, bạn có thể "unplug" (rút) nó ra. Một PDB đã rút gồm các file dữ liệu của PDB cùng một file metadata. PDB đã rút không dùng được cho tới khi nó được "plug in" (cắm) vào một CDB."

💡 **Ví dụ đời sống**
PDB giống ổ cứng gắn ngoài: rút khỏi máy này (unplug), cầm đi, cắm vào máy khác (plug in) là dùng được nguyên vẹn. Còn database ở PostgreSQL thì giống ổ cứng hàn chết trong máy — muốn mang đi phải dump ra file rồi restore lại.

### Schema gắn với user — khác PostgreSQL

📖 **Nguyên văn**
> "In Oracle AI Database, a database schema is a collection of logical data structures, or schema objects. A database user owns a database schema, which has the same name as the user name."

🇻🇳 **Dịch**
> "Trong Oracle AI Database, một database schema là một tập hợp các cấu trúc dữ liệu logic, hay còn gọi là schema object. Một database user sở hữu một database schema, và schema này có cùng tên với tên user."

Ở PostgreSQL, schema và user (role) là hai thứ tách rời — xem lại [[10 - Views và Schemas]]. Ở Oracle, tài liệu nói rõ schema **trùng tên với user**.

### PL/SQL

📖 **Nguyên văn**
> "PL/SQL is a procedural extension to Oracle SQL. [...] A primary benefit of PL/SQL is the ability to store application logic in the database itself. A PL/SQL procedure or function is a schema object that consists of a set of SQL statements and other PL/SQL constructs, grouped together, stored in the database, and run as a unit to solve a specific problem or to perform a set of related tasks."

🇻🇳 **Dịch**
> "PL/SQL là một phần mở rộng thủ tục (procedural extension) cho Oracle SQL. [...] Lợi ích chính của PL/SQL là khả năng lưu logic ứng dụng ngay trong database. Một procedure hay function PL/SQL là một schema object gồm một tập câu lệnh SQL và các cấu trúc PL/SQL khác, nhóm lại với nhau, lưu trong database, và chạy như một đơn vị để giải một bài toán cụ thể hoặc thực hiện một nhóm tác vụ liên quan."

---

## Bảng so sánh tổng hợp

> [!warning] Cách đọc bảng
> Mỗi ô **có nội dung** đều truy được về một câu trích nguyên văn ở trên trong bài này.
> Ô ghi `—` nghĩa là **không kiểm chứng được từ tài liệu chính thức** đã fetch — KHÔNG phải "không có" hay "kém".

| | **PostgreSQL** | **MySQL** | **MariaDB** | **SQLite** | **MS SQL Server** | **Oracle Database** |
|---|---|---|---|---|---|---|
| **Tự mô tả** | "object-relational database management system (ORDBMS)" | "the most popular Open Source SQL database management system" | Định nghĩa qua quan hệ với MySQL: "drop-in replacement" (tới 5.5), "limited drop-in replacements" (10.x) | "self-contained, serverless, zero-configuration, transactional SQL database engine" | "a relational database management system (RDBMS)" | "an RDBMS ... extended the relational model to an object-relational model" (ORDBMS) |
| **Kiến trúc kết nối** | — (trang intro-whatis không nói) | "client/server or embedded systems" | — (trang compatibility không nói; kế thừa protocol MySQL: "client protocol is binary compatible with MySQL's") | "does not have a separate server process. SQLite reads and writes directly to ordinary disk files" | "Applications and tools connect to a SQL Server instance or database" | "consists of a database and at least one database instance" |
| **Tầng lưu trữ** | — | "pluggable storage engine architecture ... loaded into and unloaded from a running MySQL server" (`InnoDB` mặc định) | "storage engines ... that are not in MySQL" (có thêm storage engine riêng) | "A complete SQL database with multiple tables, indices, triggers, and views, is contained in a single disk file" | "The Database Engine is the core service for storing, processing, and securing data" | "a set of files, located on disk, that store user data" |
| **Hệ kiểu** | — (không trích được từ trang intro-whatis) | — (trang features liệt kê data type nhưng không phát biểu static typing) | — | **Dynamic typing / type affinity**: "the datatype of a value is associated with the value itself, not with its container"; "the type is recommended, not required" | — | — |
| **Ngôn ngữ thủ tục** | "procedural languages" (liệt kê trong danh sách mở rộng được) | — (trang features không liệt kê) | — | — | "communicate using Transact-SQL (T-SQL)" | "PL/SQL is a procedural extension to Oracle SQL"; cũng lưu được Java và JavaScript |
| **Đặc thù nổi bật nhất** | "can be extended by the user in many ways ... new data types, functions, operators, aggregate functions, index methods, procedural languages" | Chọn storage engine theo từng table (`InnoDB` transaction-safe vs `MyISAM` table-level locking) | Tương thích nhị phân với MySQL ở data file, .frm, client protocol, connector | "SQLite does not compete with client/server databases. SQLite competes with fopen()" | Là cả bộ sản phẩm: Database Engine + SSIS + SSAS + SSRS + MLS + Replication | Multitenant: "a multitenant container database is the only supported architecture" từ 21c; PDB "portable", unplug/plug |
| **Giới hạn được nêu rõ trong tài liệu** | — | — | "the implementation differences continue to grow in each new MariaDB version" | "only allow one writer at any instant in time"; "limited in size to 281 terabytes" | — | — |
| **License** | "liberal license ... free of charge for any purpose, be it private, commercial, or academic" | GPL + "you can buy a commercially licensed version from us" | — (trang compatibility không nói về license) | "in the public domain and is thus free for use for any purpose, commercial or private" | — (trang chỉ nói "depend on your license agreement") | — (trang cncpt không nói về license) |
| **Khuyến nghị dùng khi** | — | "mission-critical, heavy-load production systems as well as for embedding into mass-deployed software" (Chapter 1) | — | IoT, application file format, website < 100K hits/day, data analysis, cache, test/demo, dạy học | — | — |
| **Khuyến nghị KHÔNG dùng khi** | — | — | — | Client/server qua network filesystem; high-volume website write-intensive; dataset > 281 TB; high concurrency ghi | — | — |

### Những ô để trống và lý do

- **Hệ kiểu** của PostgreSQL/MySQL/MariaDB/MS SQL/Oracle: các trang giới thiệu được giao **không phát biểu** "static typing" bằng câu chữ của chính họ. Chỉ có SQLite chủ động phát biểu điều này. Tuyên bố duy nhất ta có là câu của SQLite — "every SQL database engine other than SQLite, as far as we know, uses static, rigid typing" — nhưng đó là lời SQLite nói về hệ khác, không phải tài liệu chính thức của hệ đó, nên không điền vào ô của họ.
- **License** của MariaDB, MS SQL Server, Oracle: ba trang đã fetch không nêu mô hình license.
- **Khuyến nghị dùng / không nên dùng**: chỉ SQLite có hẳn một trang chính thức (`whentouse.html`) bàn chuyện này. Các hệ còn lại không có trang tương đương trong danh sách nguồn, nên để trống.
- **Tầng lưu trữ / ngôn ngữ thủ tục của MariaDB**: trang compatibility chỉ nói MariaDB "có thêm" so với MySQL, không mô tả chi tiết, nên chỉ ghi đúng mức đó.
- **Giới hạn được nêu rõ**: chỉ SQLite và MariaDB tự nêu giới hạn/khác biệt trong tài liệu giới thiệu. Các hệ khác thì trang giới thiệu là văn bản quảng bá năng lực, không nêu giới hạn.

> [!note] Điều bảng này KHÔNG nói
> Không có ô nào xếp hạng "nhanh hơn", "tốt hơn", "phổ biến hơn". Mỗi tài liệu chính thức đều tự khen sản phẩm mình ("the most popular", "most widely deployed", "very fast") — đó là lời tự giới thiệu, không phải số đo so sánh chéo, nên không dùng làm cơ sở xếp hạng.

---

## Ghi chú thực dụng cho backend dev mới

> [!tip] Học sâu MỘT hệ, rồi mở rộng — tốt hơn biết lơ mơ cả sáu
> Bài này cố tình dài phần trích dẫn và ngắn phần kết luận, vì đó chính là bài học: **đọc tài liệu chính thức của hệ bạn đang dùng** luôn cho kết quả chắc chắn hơn đọc mười bài so sánh.

Ba lý do cụ thể:

**1. Phần chung chiếm đa số.** Table, constraint, `JOIN`, index, transaction, `EXPLAIN` — những thứ bạn đã học ở bài 01–14 — đều bắt nguồn từ chuẩn ANSI/ISO SQL mà cả sáu hệ cùng tuyên bố bám theo. Học sâu một hệ là học sâu phần chung này.

**2. Phần riêng chỉ học được khi có bối cảnh.** Bạn không thể hiểu vì sao MySQL cần `SHOW ENGINES` nếu chưa từng thắc mắc "dữ liệu thật sự được ghi xuống đĩa thế nào". Bạn không thấy type affinity của SQLite đáng sợ nếu chưa từng được `CHECK` constraint của PostgreSQL cứu một lần. Kiến thức nền là thứ làm cho khác biệt trở nên *có nghĩa*.

**3. Cái cần đọc lại khi chuyển hệ là một danh sách ngắn.** Với mỗi hệ mới, chỉ cần trả lời:
- Dữ liệu được lưu và transaction do đâu đảm bảo? (MySQL: storage engine nào; SQLite: một file, một writer; Oracle: PDB nào trong CDB nào)
- Kiểu dữ liệu có được thực thi cứng không? (chỉ SQLite trả lời "không, trừ khi `STRICT`")
- Phương ngữ thủ tục là gì? (T-SQL, PL/SQL, PL/pgSQL)
- Ai sở hữu schema? (Oracle: schema trùng tên user)
- License cho phép làm gì? (chỉ tra được ở trang license của chính hãng)

**Chọn hệ nào để đi sâu?** Bài này không trả lời thay bạn, vì không tài liệu chính thức nào trả lời được câu đó. Nhưng có một lời khuyên duy nhất trích được từ nguồn, và nó dành cho trường hợp cụ thể nhất:

📖 **Nguyên văn**
> "Otherwise → choose SQLite!
> For device-local storage with low writer concurrency and less than a terabyte of content, SQLite is almost always a better solution. SQLite is fast and reliable and it requires no configuration or maintenance. It keeps things simple. SQLite "just works"."

🇻🇳 **Dịch**
> "Còn lại → chọn SQLite!
> Với lưu trữ cục bộ trên thiết bị, mức ghi đồng thời thấp và dưới một terabyte nội dung, SQLite gần như luôn là giải pháp tốt hơn. SQLite nhanh và đáng tin cậy, và không cần cấu hình hay bảo trì. Nó giữ mọi thứ đơn giản. SQLite "cứ thế chạy được"."

Ngay cả lời này cũng kèm ba điều kiện rõ ràng. Đó là hình mẫu của một khuyến nghị kỹ thuật tử tế — và là thứ bạn nên đòi hỏi ở mọi lời khuyên "nên dùng database nào".

---

## Liên kết

- Bài trước: [[14 - Roles, Backup, VACUUM và Performance]]
- Cross-link: [[01 - Relational Database và PostgreSQL là gì]] — khái niệm relational database, vì sao PostgreSQL
- Cross-link: [[02 - Tables, Data Types và Constraints]] — đối chiếu data type / constraint với type affinity của SQLite
- Cross-link: [[05 - Transactions, ACID và MVCC]] — đối chiếu với `InnoDB` vs `MyISAM` của MySQL
- Cross-link: [[10 - Views và Schemas]] — đối chiếu schema của PostgreSQL với schema-gắn-user của Oracle
- Quay lại mục lục: [[00 - Tổng hợp (Relational Databases)]]

## Nguồn tham khảo

- MySQL 8.4 Reference Manual — What is MySQL? : https://dev.mysql.com/doc/refman/8.4/en/what-is-mysql.html
- MySQL 8.4 Reference Manual — The Main Features of MySQL : https://dev.mysql.com/doc/refman/8.4/en/features.html
- MySQL 8.4 Reference Manual — General Information (Chapter 1) : https://dev.mysql.com/doc/refman/8.4/en/introduction.html
- MySQL 8.4 Reference Manual — Alternative Storage Engines : https://dev.mysql.com/doc/refman/8.4/en/storage-engines.html
- MariaDB Knowledge Base — MariaDB versus MySQL - Compatibility : https://mariadb.com/kb/en/mariadb-vs-mysql-compatibility/
- SQLite — About SQLite : https://www.sqlite.org/about.html
- SQLite — Appropriate Uses For SQLite : https://www.sqlite.org/whentouse.html
- SQLite — Datatypes In SQLite : https://www.sqlite.org/datatype3.html
- Microsoft Learn — What is SQL Server? : https://learn.microsoft.com/en-us/sql/sql-server/what-is-sql-server
- Oracle Database Concepts 23 — Introduction to Oracle Database : https://docs.oracle.com/en/database/oracle/oracle-database/23/cncpt/introduction-to-oracle-database.html
- PostgreSQL Documentation — What Is PostgreSQL? : https://www.postgresql.org/docs/current/intro-whatis.html

> [!note] Về nguồn không dùng được
> `https://mariadb.com/kb/en/about-mariadb-server/` trả HTTP 200 nhưng **redirect** sang `https://mariadb.com/docs?q=about-mariadb-server` — một trang index của bộ tài liệu, không có nội dung tự giới thiệu MariaDB. Vì vậy bài này không trích gì từ URL đó, và phần MariaDB chỉ dựa trên trang compatibility.
> Bài này không dùng bất kỳ blog so sánh, bảng xếp hạng hay nguồn thứ cấp nào.
