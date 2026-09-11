# 14 — Roles, Backup, VACUUM và Performance

> **Nguồn chính:** PostgreSQL Documentation (phiên bản `current` = PostgreSQL 18) — Chapter 21 Database Roles, Section 5.8 Privileges, Section 25.1 SQL Dump, Section 24.1 Routine Vacuuming, Chapter 14 Performance Tips, `psql` reference.
> Bài này trả lời câu hỏi: **một database chạy production thì cần biết thêm gì** ngoài chuyện viết query. Bốn thứ: ai được làm gì (roles/privileges), làm sao không mất dữ liệu (backup), làm sao database không phình to và chết (VACUUM), và làm sao nạp/chạy nhanh (performance tips).

---

## Bối cảnh: từ "biết SQL" sang "vận hành được"

Các bài trước dạy cách *nói chuyện* với database: [[02 - Tables, Data Types và Constraints]], [[03 - Queries - SELECT, JOIN, Aggregate]], [[04 - Indexes]], [[05 - Transactions, ACID và MVCC]]. Bài này là mặt còn lại: database là một **tiến trình chạy 24/7 trên server**, có người dùng, có disk, có rác cần dọn.

💡 **Ví dụ đời sống**
Học nấu ăn xong không có nghĩa là mở được nhà hàng. Mở nhà hàng còn phải: phân quyền ai được vào kho ai chỉ được vào bếp (roles), có bản sao công thức phòng khi cháy (backup), dọn rác cuối ca nếu không bếp ngập rác (VACUUM), và sắp xếp quy trình để phục vụ nhanh (performance).

---

# PHẦN A — Roles & Privileges

## A1. Role là gì — PostgreSQL không tách user/group

📖 **Nguyên văn**
> "PostgreSQL manages database access permissions using the concept of *roles*. A role can be thought of as either a database user, or a group of database users, depending on how the role is set up. Roles can own database objects (for example, tables and functions) and can assign privileges on those objects to other roles to control who has access to which objects. Furthermore, it is possible to grant membership in a role to another role, thus allowing the member role to use privileges assigned to another role."

🇻🇳 **Dịch**
> "PostgreSQL quản lý quyền truy cập database bằng khái niệm *role*. Một role có thể được xem như một database user, hoặc một nhóm database user, tuỳ cách role đó được thiết lập. Role có thể sở hữu các database object (ví dụ table và function) và có thể gán privilege trên các object đó cho role khác để kiểm soát ai có quyền truy cập object nào. Hơn nữa, có thể grant membership của một role cho một role khác, cho phép role thành viên dùng các privilege đã gán cho role kia."

📖 **Nguyên văn**
> "The concept of roles subsumes the concepts of “users” and “groups”. In PostgreSQL versions before 8.1, users and groups were distinct kinds of entities, but now there are only roles. Any role can act as a user, a group, or both."

🇻🇳 **Dịch**
> "Khái niệm role gộp luôn hai khái niệm “user” và “group”. Ở các phiên bản PostgreSQL trước 8.1, user và group là hai loại thực thể riêng biệt, nhưng bây giờ chỉ còn role. Bất kỳ role nào cũng có thể đóng vai user, group, hoặc cả hai."

💡 **Ví dụ đời sống**
Thẻ từ trong toà nhà văn phòng. Ngày xưa chia hai loại: thẻ cá nhân và "danh sách phòng ban". Giờ chỉ còn một loại thẻ — thẻ của bạn có thể tự mở cửa (đóng vai user), và cũng có thể được gán cho thẻ khác để thẻ đó thừa hưởng quyền (đóng vai group).

## A2. CREATE ROLE / DROP ROLE

📖 **Nguyên văn**
> "CREATE ROLE *name*;"
> "*name* follows the rules for SQL identifiers: either unadorned without special characters, or double-quoted. (In practice, you will usually want to add additional options, such as LOGIN, to the command. More details appear below.) To remove an existing role, use the analogous DROP ROLE command:"
> "DROP ROLE *name*;"

🇻🇳 **Dịch**
> "`CREATE ROLE tên;`"
> "*tên* tuân theo quy tắc của SQL identifier: hoặc viết trần không ký tự đặc biệt, hoặc đặt trong nháy kép. (Trên thực tế, bạn thường sẽ muốn thêm các tuỳ chọn khác, như LOGIN, vào câu lệnh. Chi tiết ở phần dưới.) Để xoá một role đang tồn tại, dùng lệnh tương ứng DROP ROLE:"
> "`DROP ROLE tên;`"

```sql
CREATE ROLE name;
DROP ROLE name;
```
🇻🇳 Tạo và xoá một role.

📖 **Nguyên văn**
> "To determine the set of existing roles, examine the `pg_roles` system catalog, for example:"
> "SELECT rolname FROM pg_roles;"
> "or to see just those capable of logging in:"
> "SELECT rolname FROM pg_roles WHERE rolcanlogin;"
> "The psql program's `\du` meta-command is also useful for listing the existing roles."

🇻🇳 **Dịch**
> "Để biết tập hợp các role đang tồn tại, xem system catalog `pg_roles`, ví dụ:"
> "`SELECT rolname FROM pg_roles;`"
> "hoặc để chỉ xem những role có thể đăng nhập:"
> "`SELECT rolname FROM pg_roles WHERE rolcanlogin;`"
> "Meta-command `\du` của chương trình psql cũng hữu ích để liệt kê các role đang tồn tại."

```sql
SELECT rolname FROM pg_roles;
SELECT rolname FROM pg_roles WHERE rolcanlogin;
```
🇻🇳 Liệt kê tất cả role, và chỉ những role đăng nhập được.

📖 **Nguyên văn**
> "In order to bootstrap the database system, a freshly initialized system always contains one predefined login-capable role. This role is always a “superuser”, and it will have the same name as the operating system user that initialized the database cluster with initdb unless a different name is specified. This role is often named `postgres`. In order to create more roles you first have to connect as this initial role."

🇻🇳 **Dịch**
> "Để khởi động hệ thống database, một hệ thống vừa được khởi tạo luôn chứa sẵn một role đăng nhập được. Role này luôn là “superuser”, và sẽ mang cùng tên với operating system user đã khởi tạo database cluster bằng initdb, trừ khi chỉ định tên khác. Role này thường được đặt tên là `postgres`. Để tạo thêm role, trước tiên bạn phải kết nối bằng chính role khởi đầu này."

## A3. Role attributes: LOGIN, SUPERUSER, CREATEDB

📖 **Nguyên văn**
> "A database role can have a number of attributes that define its privileges and interact with the client authentication system."

🇻🇳 **Dịch**
> "Một database role có thể có một số attribute định nghĩa privilege của nó và tương tác với hệ thống client authentication."

📖 **Nguyên văn** — *login privilege*
> "Only roles that have the LOGIN attribute can be used as the initial role name for a database connection. A role with the LOGIN attribute can be considered the same as a “database user”. To create a role with login privilege, use either:"
> "CREATE ROLE *name* LOGIN;"
> "CREATE USER *name*;"
> "(CREATE USER is equivalent to CREATE ROLE except that CREATE USER includes LOGIN by default, while CREATE ROLE does not.)"

🇻🇳 **Dịch**
> "Chỉ những role có attribute LOGIN mới được dùng làm tên role khởi đầu cho một database connection. Một role có attribute LOGIN có thể xem như chính là một “database user”. Để tạo role có quyền login, dùng một trong hai:"
> "`CREATE ROLE tên LOGIN;`"
> "`CREATE USER tên;`"
> "(CREATE USER tương đương CREATE ROLE, chỉ khác là CREATE USER mặc định bao gồm LOGIN, còn CREATE ROLE thì không.)"

```sql
CREATE ROLE name LOGIN;
CREATE USER name;
```
🇻🇳 Hai cách tạo role đăng nhập được; `CREATE USER` chỉ là `CREATE ROLE ... LOGIN`.

📖 **Nguyên văn** — *superuser status*
> "A database superuser bypasses all permission checks, except the right to log in. This is a dangerous privilege and should not be used carelessly; it is best to do most of your work as a role that is not a superuser. To create a new database superuser, use CREATE ROLE *name* SUPERUSER. You must do this as a role that is already a superuser."

🇻🇳 **Dịch**
> "Một database superuser bỏ qua mọi kiểm tra quyền, trừ quyền được đăng nhập. Đây là một privilege nguy hiểm và không nên dùng cẩu thả; tốt nhất là làm phần lớn công việc bằng một role không phải superuser. Để tạo superuser mới, dùng `CREATE ROLE tên SUPERUSER`. Bạn phải thực hiện việc này bằng một role vốn đã là superuser."

> [!danger] Superuser bỏ qua MỌI kiểm tra quyền
> Tài liệu gọi thẳng đây là "a dangerous privilege". Một connection string của app mà dùng superuser thì mọi lớp phân quyền bên dưới trở thành vô nghĩa — một lỗ hổng ở tầng app là mất trắng cả cluster.

📖 **Nguyên văn** — *database creation*
> "A role must be explicitly given permission to create databases (except for superusers, since those bypass all permission checks). To create such a role, use CREATE ROLE *name* CREATEDB."

🇻🇳 **Dịch**
> "Một role phải được cấp quyền một cách tường minh để tạo database (trừ superuser, vì superuser bỏ qua mọi kiểm tra quyền). Để tạo role như vậy, dùng `CREATE ROLE tên CREATEDB`."

📖 **Nguyên văn** — *role creation*
> "A role must be explicitly given permission to create more roles (except for superusers, since those bypass all permission checks). To create such a role, use CREATE ROLE *name* CREATEROLE."

🇻🇳 **Dịch**
> "Một role phải được cấp quyền một cách tường minh để tạo thêm role (trừ superuser, vì superuser bỏ qua mọi kiểm tra quyền). Để tạo role như vậy, dùng `CREATE ROLE tên CREATEROLE`."

📖 **Nguyên văn** — *password* & *connection limit*
> "A password is only significant if the client authentication method requires the user to supply a password when connecting to the database. [...] Specify a password upon role creation with CREATE ROLE *name* PASSWORD '*string*'."
> "Connection limit can specify how many concurrent connections a role can make. -1 (the default) means no limit. Specify connection limit upon role creation with CREATE ROLE *name* CONNECTION LIMIT '*integer*'."

🇻🇳 **Dịch**
> "Password chỉ có ý nghĩa nếu phương thức client authentication yêu cầu user cung cấp password khi kết nối tới database. [...] Chỉ định password lúc tạo role bằng `CREATE ROLE tên PASSWORD 'chuỗi'`."
> "Connection limit quy định một role được mở bao nhiêu connection đồng thời. -1 (mặc định) nghĩa là không giới hạn. Chỉ định connection limit lúc tạo role bằng `CREATE ROLE tên CONNECTION LIMIT 'số nguyên'`."

📖 **Nguyên văn**
> "A role's attributes can be modified after creation with ALTER ROLE. See the reference pages for the CREATE ROLE and ALTER ROLE commands for details."

🇻🇳 **Dịch**
> "Các attribute của một role có thể được sửa sau khi tạo bằng ALTER ROLE. Xem trang tham chiếu của lệnh CREATE ROLE và ALTER ROLE để biết chi tiết."

| Attribute | Nguyên văn mô tả (rút gọn) | Ý nghĩa thực tế |
|---|---|---|
| `LOGIN` | "Only roles that have the LOGIN attribute can be used as the initial role name for a database connection." | Role này là "user", đăng nhập được |
| `SUPERUSER` | "A database superuser bypasses all permission checks, except the right to log in." | Toàn quyền — tránh dùng cho app |
| `CREATEDB` | "A role must be explicitly given permission to create databases" | Được tạo database mới |
| `CREATEROLE` | "A role must be explicitly given permission to create more roles" | Được tạo/quản role khác |
| `REPLICATION` | "A role must explicitly be given permission to initiate streaming replication" | Dùng cho replica |
| `CONNECTION LIMIT` | "-1 (the default) means no limit." | Chặn một service ăn hết connection pool |

## A4. Privileges — GRANT / REVOKE

📖 **Nguyên văn**
> "When an object is created, it is assigned an owner. The owner is normally the role that executed the creation statement. For most kinds of objects, the initial state is that only the owner (or a superuser) can do anything with the object. To allow other roles to use it, privileges must be granted."

🇻🇳 **Dịch**
> "Khi một object được tạo, nó được gán một owner. Owner thường là role đã thực thi câu lệnh tạo object đó. Với hầu hết các loại object, trạng thái ban đầu là chỉ owner (hoặc một superuser) mới làm được bất cứ điều gì với object. Để cho phép các role khác dùng nó, phải grant privilege."

📖 **Nguyên văn**
> "There are different kinds of privileges: SELECT, INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, CREATE, CONNECT, TEMPORARY, EXECUTE, USAGE, SET, ALTER SYSTEM, and MAINTAIN. The privileges applicable to a particular object vary depending on the object's type (table, function, etc.)."

🇻🇳 **Dịch**
> "Có nhiều loại privilege khác nhau: SELECT, INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, CREATE, CONNECT, TEMPORARY, EXECUTE, USAGE, SET, ALTER SYSTEM và MAINTAIN. Các privilege áp dụng được cho một object cụ thể sẽ khác nhau tuỳ loại object (table, function, v.v.)."

📖 **Nguyên văn**
> "To assign privileges, the GRANT command is used. For example, if `joe` is an existing role, and `accounts` is an existing table, the privilege to update the table can be granted with:"
> "GRANT UPDATE ON accounts TO joe;"
> "Writing ALL in place of a specific privilege grants all privileges that are relevant for the object type."
> "To revoke a previously-granted privilege, use the fittingly named REVOKE command:"
> "REVOKE ALL ON accounts FROM PUBLIC;"

🇻🇳 **Dịch**
> "Để gán privilege, dùng lệnh GRANT. Ví dụ, nếu `joe` là một role đang tồn tại và `accounts` là một table đang tồn tại, privilege update table có thể được cấp bằng:"
> "`GRANT UPDATE ON accounts TO joe;`"
> "Viết ALL thay cho một privilege cụ thể sẽ cấp tất cả privilege liên quan tới loại object đó."
> "Để thu hồi một privilege đã cấp, dùng lệnh có tên rất đúng chức năng là REVOKE:"
> "`REVOKE ALL ON accounts FROM PUBLIC;`"

```sql
GRANT UPDATE ON accounts TO joe;
REVOKE ALL ON accounts FROM PUBLIC;
```
🇻🇳 Cấp quyền UPDATE trên table `accounts` cho role `joe`; thu hồi mọi quyền của PUBLIC trên table đó.

📖 **Nguyên văn**
> "The special “role” name PUBLIC can be used to grant a privilege to every role on the system."

🇻🇳 **Dịch**
> "Tên “role” đặc biệt PUBLIC có thể dùng để cấp một privilege cho mọi role trên hệ thống."

### Bảng các privilege chính (trích nguyên văn mô tả)

| Privilege | 📖 Nguyên văn | 🇻🇳 Dịch |
|---|---|---|
| `SELECT` | "Allows SELECT from any column, or specific column(s), of a table, view, materialized view, or other table-like object. Also allows use of COPY TO." | Cho phép SELECT từ bất kỳ column nào, hoặc column cụ thể, của một table, view, materialized view hay object dạng bảng khác. Cũng cho phép dùng COPY TO. |
| `INSERT` | "Allows INSERT of a new row into a table, view, etc. Can be granted on specific column(s) [...] Also allows use of COPY FROM." | Cho phép INSERT một row mới vào table, view, v.v. Có thể cấp trên column cụ thể [...] Cũng cho phép dùng COPY FROM. |
| `UPDATE` | "Allows UPDATE of any column, or specific column(s), of a table, view, etc. (In practice, any nontrivial UPDATE command will require SELECT privilege as well [...])" | Cho phép UPDATE bất kỳ column nào, hoặc column cụ thể, của table, view, v.v. (Thực tế, mọi lệnh UPDATE không tầm thường đều cần cả privilege SELECT [...]) |
| `DELETE` | "Allows DELETE of a row from a table, view, etc. (In practice, any nontrivial DELETE command will require SELECT privilege as well [...])" | Cho phép DELETE một row khỏi table, view, v.v. (Thực tế, mọi lệnh DELETE không tầm thường đều cần cả privilege SELECT [...]) |
| `TRUNCATE` | "Allows TRUNCATE on a table." | Cho phép TRUNCATE trên một table. |
| `REFERENCES` | "Allows creation of a foreign key constraint referencing a table, or specific column(s) of a table." | Cho phép tạo foreign key constraint tham chiếu tới một table, hoặc column cụ thể của table. |
| `TRIGGER` | "Allows creation of a trigger on a table, view, etc." | Cho phép tạo trigger trên table, view, v.v. |
| `CONNECT` | "Allows the grantee to connect to the database. This privilege is checked at connection startup (in addition to checking any restrictions imposed by `pg_hba.conf`)." | Cho phép bên được cấp kết nối tới database. Privilege này được kiểm tra lúc bắt đầu connection (bên cạnh các hạn chế do `pg_hba.conf` áp đặt). |
| `TEMPORARY` | "Allows temporary tables to be created while using the database." | Cho phép tạo temporary table khi đang dùng database. |
| `EXECUTE` | "Allows calling a function or procedure [...] This is the only type of privilege that is applicable to functions and procedures." | Cho phép gọi một function hoặc procedure [...] Đây là loại privilege duy nhất áp dụng cho function và procedure. |
| `MAINTAIN` | "Allows VACUUM, ANALYZE, CLUSTER, REFRESH MATERIALIZED VIEW, REINDEX, LOCK TABLE, and database object statistics manipulation functions [...] on a relation." | Cho phép VACUUM, ANALYZE, CLUSTER, REFRESH MATERIALIZED VIEW, REINDEX, LOCK TABLE và các function thao tác thống kê object [...] trên một relation. |

📖 **Nguyên văn** — mặc định của PUBLIC
> "PostgreSQL grants privileges on some types of objects to PUBLIC by default when the objects are created. No privileges are granted to PUBLIC by default on tables, table columns, sequences, foreign data wrappers, foreign servers, large objects, schemas, tablespaces, or configuration parameters. For other types of objects, the default privileges granted to PUBLIC are as follows: CONNECT and TEMPORARY (create temporary tables) privileges for databases; EXECUTE privilege for functions and procedures; and USAGE privilege for languages and data types (including domains)."

🇻🇳 **Dịch**
> "PostgreSQL mặc định cấp privilege trên một số loại object cho PUBLIC khi object được tạo. Mặc định KHÔNG có privilege nào được cấp cho PUBLIC trên table, column của table, sequence, foreign data wrapper, foreign server, large object, schema, tablespace hay configuration parameter. Với các loại object khác, privilege mặc định cấp cho PUBLIC là: CONNECT và TEMPORARY (tạo temporary table) cho database; EXECUTE cho function và procedure; và USAGE cho language và data type (kể cả domain)."

📖 **Nguyên văn**
> "The object owner can, of course, REVOKE both default and expressly granted privileges. (For maximum security, issue the REVOKE in the same transaction that creates the object; then there is no window in which another user can use the object.)"

🇻🇳 **Dịch**
> "Owner của object dĩ nhiên có thể REVOKE cả privilege mặc định lẫn privilege được cấp tường minh. (Để bảo mật tối đa, hãy chạy REVOKE trong cùng transaction tạo ra object; khi đó không có khe thời gian nào để user khác dùng được object đó.)"

## A5. Least privilege — app KHÔNG dùng superuser

Tài liệu nói thẳng: *"This is a dangerous privilege and should not be used carelessly; it is best to do most of your work as a role that is not a superuser."*

Đây là mặt phòng thủ thứ hai bổ sung cho [[13 - SQL Injection và Parameterized Query]]: parameterized query chặn injection **ở tầng ứng dụng**, còn role có privilege hẹp giới hạn **thiệt hại khi tầng đó thủng**. Nếu role của app chỉ có `SELECT, INSERT, UPDATE, DELETE` trên đúng những table cần dùng, thì một payload `DROP TABLE` lọt qua vẫn không chạy được — role không có quyền sở hữu table nên không drop được, theo đúng câu *"The right to modify or destroy an object is inherent in being the object's owner"*.

> [!tip] Mô hình tối thiểu hay gặp
> - Một role owner sở hữu schema, chỉ dùng khi chạy migration ([[06 - Database Migrations]]).
> - Một role riêng cho app, `LOGIN`, không `SUPERUSER`, không `CREATEDB`, chỉ được GRANT các privilege DML cần thiết.
> - Role read-only cho dashboard/analytics: chỉ `SELECT` + `CONNECT`.

---

# PHẦN B — Backup bằng pg_dump

## B1. Ý tưởng của SQL dump

📖 **Nguyên văn**
> "The idea behind this dump method is to generate a file with SQL commands that, when fed back to the server, will recreate the database in the same state as it was at the time of the dump. PostgreSQL provides the utility program pg_dump for this purpose. The basic usage of this command is:"
> "pg_dump *dbname* > *dumpfile*"

🇻🇳 **Dịch**
> "Ý tưởng của phương pháp dump này là sinh ra một file chứa các lệnh SQL mà khi nạp ngược lại vào server sẽ tái tạo database đúng trạng thái tại thời điểm dump. PostgreSQL cung cấp chương trình tiện ích pg_dump cho mục đích này. Cách dùng cơ bản của lệnh là:"
> "`pg_dump tên_db > file_dump`"

```
pg_dump dbname > dumpfile
```
🇻🇳 Xuất toàn bộ database ra một file SQL text qua standard output.

📖 **Nguyên văn**
> "pg_dump is a regular PostgreSQL client application (albeit a particularly clever one). This means that you can perform this backup procedure from any remote host that has access to the database. But remember that pg_dump does not operate with special permissions. In particular, it must have read access to all tables that you want to back up, so in order to back up the entire database you almost always have to run it as a database superuser."

🇻🇳 **Dịch**
> "pg_dump là một client application PostgreSQL bình thường (dù là một client khá thông minh). Nghĩa là bạn có thể thực hiện thủ tục backup này từ bất kỳ remote host nào có quyền truy cập database. Nhưng nhớ rằng pg_dump không chạy với quyền đặc biệt nào. Cụ thể, nó phải có quyền đọc trên tất cả table bạn muốn backup, nên để backup toàn bộ database thì gần như lúc nào bạn cũng phải chạy nó bằng một database superuser."

## B2. Dump là một snapshot nhất quán — nhờ MVCC

📖 **Nguyên văn**
> "Dumps created by pg_dump are internally consistent, meaning, the dump represents a snapshot of the database at the time pg_dump began running. pg_dump does not block other operations on the database while it is working. (Exceptions are those operations that need to operate with an exclusive lock, such as most forms of ALTER TABLE.)"

🇻🇳 **Dịch**
> "Các bản dump do pg_dump tạo ra là nhất quán nội tại, nghĩa là bản dump thể hiện một snapshot của database tại thời điểm pg_dump bắt đầu chạy. pg_dump không chặn các thao tác khác trên database trong lúc nó làm việc. (Ngoại lệ là những thao tác cần exclusive lock, chẳng hạn hầu hết các dạng của ALTER TABLE.)"

Đây chính là MVCC ở [[05 - Transactions, ACID và MVCC]] đang phát huy tác dụng: pg_dump đọc theo một snapshot cố định, nên dù người dùng vẫn INSERT/UPDATE suốt 40 phút backup chạy, bản dump vẫn là ảnh chụp của một thời điểm duy nhất — không có chuyện table `orders` là dữ liệu 9h00 còn table `order_items` là 9h40.

💡 **Ví dụ đời sống**
Chụp ảnh cả lớp. MVCC giống như bạn chụp một tấm ảnh duy nhất: người ta sau đó có đổi chỗ thế nào cũng không làm tấm ảnh sai. Nếu không có MVCC thì giống như đi hỏi từng bạn "lúc này cậu ngồi đâu" trong 40 phút — ghép lại ra một sơ đồ chỗ ngồi chẳng khớp với bất kỳ thời điểm nào.

📖 **Nguyên văn**
> "An important advantage of pg_dump over the other backup methods described later is that pg_dump's output can generally be re-loaded into newer versions of PostgreSQL, whereas file-level backups and continuous archiving are both extremely server-version-specific."

🇻🇳 **Dịch**
> "Một ưu điểm quan trọng của pg_dump so với các phương pháp backup khác mô tả sau này là output của pg_dump nhìn chung có thể nạp lại vào các phiên bản PostgreSQL mới hơn, trong khi backup ở mức file và continuous archiving đều phụ thuộc cực kỳ chặt vào phiên bản server."

## B3. Khôi phục: psql và pg_restore

📖 **Nguyên văn**
> "Text files created by pg_dump are intended to be read by the psql program using its default settings. The general command form to restore a text dump is"
> "psql -X *dbname* < *dumpfile*"
> "where *dumpfile* is the file output by the pg_dump command. The database *dbname* will not be created by this command, so you must create it yourself from `template0` before executing psql (e.g., with `createdb -T template0 dbname`)."

🇻🇳 **Dịch**
> "Các file text do pg_dump tạo ra được thiết kế để chương trình psql đọc bằng thiết lập mặc định. Dạng lệnh chung để khôi phục một bản dump text là"
> "`psql -X tên_db < file_dump`"
> "trong đó *file_dump* là file output của lệnh pg_dump. Database *tên_db* sẽ KHÔNG được lệnh này tạo ra, nên bạn phải tự tạo nó từ `template0` trước khi chạy psql (ví dụ bằng `createdb -T template0 dbname`)."

```
psql -X dbname < dumpfile
```
🇻🇳 Nạp file dump text ngược vào một database đã tồn tại.

📖 **Nguyên văn**
> "Non-text file dumps should be restored using the pg_restore utility."

🇻🇳 **Dịch**
> "Các bản dump không phải file text nên được khôi phục bằng tiện ích pg_restore."

📖 **Nguyên văn**
> "Before restoring an SQL dump, all the users who own objects or were granted permissions on objects in the dumped database must already exist. If they do not, the restore will fail to recreate the objects with the original ownership and/or permissions. (Sometimes this is what you want, but usually it is not.)"

🇻🇳 **Dịch**
> "Trước khi khôi phục một SQL dump, tất cả user sở hữu object hoặc được cấp quyền trên object trong database đã dump phải tồn tại sẵn. Nếu không, quá trình restore sẽ thất bại trong việc tái tạo object với ownership và/hoặc permission ban đầu. (Đôi khi đó là điều bạn muốn, nhưng thường thì không.)"

📖 **Nguyên văn**
> "By default, the psql script will continue to execute after an SQL error is encountered. You might wish to run psql with the ON_ERROR_STOP variable set to alter that behavior and have psql exit with an exit status of 3 if an SQL error occurs:"
> "psql -X --set ON_ERROR_STOP=on *dbname* < *dumpfile*"
> "Either way, you will only have a partially restored database. Alternatively, you can specify that the whole dump should be restored as a single transaction, so the restore is either fully completed or fully rolled back. This mode can be specified by passing the `-1` or `--single-transaction` command-line options to psql."

🇻🇳 **Dịch**
> "Mặc định, script psql sẽ tiếp tục chạy sau khi gặp lỗi SQL. Bạn có thể muốn chạy psql với biến ON_ERROR_STOP được bật để đổi hành vi đó và khiến psql thoát với exit status 3 nếu xảy ra lỗi SQL:"
> "`psql -X --set ON_ERROR_STOP=on tên_db < file_dump`"
> "Dù thế nào thì bạn cũng chỉ có một database được khôi phục một phần. Cách khác, bạn có thể chỉ định rằng toàn bộ bản dump được khôi phục như một transaction duy nhất, để quá trình restore hoặc hoàn tất trọn vẹn hoặc rollback trọn vẹn. Chế độ này chỉ định bằng cách truyền tuỳ chọn `-1` hoặc `--single-transaction` cho psql."

```
psql -X --set ON_ERROR_STOP=on dbname < dumpfile
```
🇻🇳 Restore và dừng ngay khi gặp lỗi SQL đầu tiên thay vì chạy tiếp.

> [!warning] `--single-transaction` là con dao hai lưỡi
> 📖 **Nguyên văn**
> > "When using this mode, be aware that even a minor error can rollback a restore that has already run for many hours. However, that might still be preferable to manually cleaning up a complex database after a partially restored dump."
>
> 🇻🇳 **Dịch**
> > "Khi dùng chế độ này, hãy lưu ý rằng dù chỉ một lỗi nhỏ cũng có thể rollback một quá trình restore đã chạy nhiều giờ. Tuy nhiên, điều đó có khi vẫn tốt hơn là phải tự tay dọn dẹp một database phức tạp sau khi dump chỉ restore được một phần."

📖 **Nguyên văn** — dump thẳng từ server này sang server khác
> "The ability of pg_dump and psql to write to or read from pipes makes it possible to dump a database directly from one server to another, for example:"
> "pg_dump -h *host1* *dbname* | psql -X -h *host2* *dbname*"

🇻🇳 **Dịch**
> "Khả năng ghi vào / đọc từ pipe của pg_dump và psql khiến việc dump một database thẳng từ server này sang server khác trở nên khả thi, ví dụ:"
> "`pg_dump -h host1 tên_db | psql -X -h host2 tên_db`"

```
pg_dump -h host1 dbname | psql -X -h host2 dbname
```
🇻🇳 Copy thẳng database giữa hai server qua pipe, không cần file trung gian.

## B4. Sau khi restore: nhớ chạy ANALYZE

📖 **Nguyên văn**
> "After restoring a backup, it is wise to run ANALYZE on each database so the query optimizer has useful statistics; see Section 24.1.3 and Section 24.1.6 for more information."

🇻🇳 **Dịch**
> "Sau khi khôi phục một bản backup, nên chạy ANALYZE trên từng database để query optimizer có được thống kê hữu ích; xem Section 24.1.3 và 24.1.6 để biết thêm."

## B5. Database lớn: nén, split, custom format, parallel

📖 **Nguyên văn**
> "Use compressed dumps. You can use your favorite compression program, for example gzip:"
> "pg_dump *dbname* | gzip > *filename*.gz"

🇻🇳 **Dịch**
> "Dùng bản dump được nén. Bạn có thể dùng chương trình nén ưa thích, ví dụ gzip:"
> "`pg_dump tên_db | gzip > tên_file.gz`"

📖 **Nguyên văn**
> "Use pg_dump's custom dump format. If PostgreSQL was built on a system with the zlib compression library installed, the custom dump format will compress data as it writes it to the output file. This will produce dump file sizes similar to using gzip, but it has the added advantage that tables can be restored selectively. The following command dumps a database using the custom dump format:"
> "pg_dump -Fc *dbname* > *filename*"
> "A custom-format dump is not a script for psql, but instead must be restored with pg_restore, for example:"
> "pg_restore -d *dbname* *filename*"

🇻🇳 **Dịch**
> "Dùng custom dump format của pg_dump. Nếu PostgreSQL được build trên hệ thống có cài thư viện nén zlib, custom dump format sẽ nén dữ liệu ngay khi ghi ra file output. Cách này cho kích thước file dump tương đương dùng gzip, nhưng có thêm lợi thế là có thể restore từng table một cách chọn lọc. Lệnh sau dump một database bằng custom dump format:"
> "`pg_dump -Fc tên_db > tên_file`"
> "Bản dump custom-format không phải là script cho psql, mà phải được restore bằng pg_restore, ví dụ:"
> "`pg_restore -d tên_db tên_file`"

```
pg_dump -Fc dbname > filename
pg_restore -d dbname filename
```
🇻🇳 Dump ở định dạng custom (nén, restore chọn lọc được) và khôi phục bằng pg_restore.

📖 **Nguyên văn**
> "Use pg_dump's parallel dump feature. To speed up the dump of a large database, you can use pg_dump's parallel mode. This will dump multiple tables at the same time. You can control the degree of parallelism with the `-j` parameter. Parallel dumps are only supported for the "directory" archive format."
> "pg_dump -j *num* -F d -f *out.dir* *dbname*"

🇻🇳 **Dịch**
> "Dùng tính năng parallel dump của pg_dump. Để tăng tốc dump một database lớn, bạn có thể dùng chế độ parallel của pg_dump. Nó sẽ dump nhiều table cùng lúc. Bạn kiểm soát mức độ song song bằng tham số `-j`. Parallel dump chỉ được hỗ trợ cho archive format "directory"."
> "`pg_dump -j số -F d -f thư_mục_out tên_db`"

## B6. pg_dumpall — backup cả cluster kèm role

📖 **Nguyên văn**
> "pg_dump dumps only a single database at a time, and it does not dump information about roles or tablespaces (because those are cluster-wide rather than per-database). To support convenient dumping of the entire contents of a database cluster, the pg_dumpall program is provided. pg_dumpall backs up each database in a given cluster, and also preserves cluster-wide data such as role and tablespace definitions."

🇻🇳 **Dịch**
> "pg_dump chỉ dump được một database mỗi lần, và nó không dump thông tin về role hay tablespace (vì những thứ đó thuộc phạm vi toàn cluster chứ không phải từng database). Để tiện dump toàn bộ nội dung của một database cluster, chương trình pg_dumpall được cung cấp. pg_dumpall backup từng database trong cluster, và cũng giữ lại dữ liệu toàn cluster như định nghĩa role và tablespace."

> [!warning] pg_dump KHÔNG backup role
> Đây là cái bẫy nối thẳng vào Phần A: bạn dày công thiết lập role và privilege, rồi backup bằng `pg_dump` và tưởng đã xong. Lúc restore mới phát hiện role biến mất — và theo mục B3, restore sẽ thất bại trong việc tái tạo ownership/permission ban đầu. Cần `pg_dumpall --globals-only` để dump riêng phần cluster-wide.

📖 **Nguyên văn**
> "Cluster-wide data can be dumped alone using the pg_dumpall `--globals-only` option. This is necessary to fully backup the cluster if running the pg_dump command on individual databases."

🇻🇳 **Dịch**
> "Dữ liệu toàn cluster có thể được dump riêng bằng tuỳ chọn `--globals-only` của pg_dumpall. Việc này là cần thiết để backup đầy đủ cluster nếu bạn chạy lệnh pg_dump trên từng database riêng lẻ."

📖 **Nguyên văn**
> "pg_dumpall works by emitting commands to re-create roles, tablespaces, and empty databases, then invoking pg_dump for each database. This means that while each database will be internally consistent, the snapshots of different databases are not synchronized."

🇻🇳 **Dịch**
> "pg_dumpall hoạt động bằng cách phát ra các lệnh tái tạo role, tablespace và database rỗng, rồi gọi pg_dump cho từng database. Nghĩa là dù mỗi database đều nhất quán nội tại, snapshot của các database khác nhau KHÔNG được đồng bộ với nhau."

> [!note] Về câu "backup chưa test restore thì chưa phải backup"
> Câu này rất phổ biến trong giới vận hành, nhưng **trang Section 25.1 SQL Dump không chứa một cảnh báo nào như vậy**. Mình không trích được vì nguồn không có — ghi lại đây như ghi chú cá nhân, không phải trích dẫn tài liệu.

---

# PHẦN C — VACUUM

Đây là phần đặc thù PostgreSQL nhất của bài, và là **hệ quả trực tiếp** của MVCC đã học ở [[05 - Transactions, ACID và MVCC]].

## C1. Vì sao database cần được "hút bụi"

📖 **Nguyên văn**
> "PostgreSQL databases require periodic maintenance known as *vacuuming*. For many installations, it is sufficient to let vacuuming be performed by the *autovacuum daemon* [...] Some database administrators will want to supplement or replace the daemon's activities with manually-managed VACUUM commands, which typically are executed according to a schedule by cron or Task Scheduler scripts."

🇻🇳 **Dịch**
> "Các database PostgreSQL cần được bảo trì định kỳ, việc này gọi là *vacuuming*. Với nhiều hệ thống, để *autovacuum daemon* tự lo việc vacuum là đủ [...] Một số database administrator sẽ muốn bổ sung hoặc thay thế hoạt động của daemon bằng các lệnh VACUUM chạy thủ công, thường được thực thi theo lịch bằng script cron hoặc Task Scheduler."

📖 **Nguyên văn**
> "PostgreSQL's VACUUM command has to process each table on a regular basis for several reasons:"
> "To recover or reuse disk space occupied by updated or deleted rows."
> "To update data statistics used by the PostgreSQL query planner."
> "To update the visibility map, which speeds up index-only scans."
> "To protect against loss of very old data due to transaction ID wraparound or multixact ID wraparound."

🇻🇳 **Dịch**
> "Lệnh VACUUM của PostgreSQL phải xử lý từng table một cách định kỳ vì vài lý do:"
> "Để thu hồi hoặc tái sử dụng dung lượng đĩa bị chiếm bởi các row đã update hoặc đã delete."
> "Để cập nhật thống kê dữ liệu mà query planner của PostgreSQL sử dụng."
> "Để cập nhật visibility map, thứ giúp tăng tốc index-only scan."
> "Để bảo vệ khỏi việc mất dữ liệu rất cũ do transaction ID wraparound hoặc multixact ID wraparound."

## C2. MVCC để lại dead row version — gốc rễ của vấn đề

📖 **Nguyên văn**
> "In PostgreSQL, an UPDATE or DELETE of a row does not immediately remove the old version of the row. This approach is necessary to gain the benefits of multiversion concurrency control (MVCC, see Chapter 13): the row version must not be deleted while it is still potentially visible to other transactions. But eventually, an outdated or deleted row version is no longer of interest to any transaction. The space it occupies must then be reclaimed for reuse by new rows, to avoid unbounded growth of disk space requirements. This is done by running VACUUM."

🇻🇳 **Dịch**
> "Trong PostgreSQL, một lệnh UPDATE hay DELETE trên một row KHÔNG xoá ngay phiên bản cũ của row đó. Cách làm này là cần thiết để có được lợi ích của multiversion concurrency control (MVCC, xem Chapter 13): phiên bản row không được phép bị xoá khi nó vẫn còn có khả năng hiển thị với các transaction khác. Nhưng rồi sẽ đến lúc một phiên bản row lỗi thời hoặc đã bị xoá không còn transaction nào quan tâm nữa. Khi đó, dung lượng nó chiếm phải được thu hồi để row mới dùng lại, nhằm tránh nhu cầu dung lượng đĩa tăng vô hạn. Việc này được thực hiện bằng cách chạy VACUUM."

🔗 **Nối với bài 05.** Ở [[05 - Transactions, ACID và MVCC]] ta học MVCC là cách PostgreSQL cho phép đọc-ghi đồng thời mà không khoá nhau: mỗi UPDATE tạo ra một phiên bản mới, phiên bản cũ vẫn nằm đó cho transaction nào còn "nhìn thấy" nó. Bài 05 kể mặt lợi. Bài này kể **cái giá**: những phiên bản cũ đó không tự biến mất. `UPDATE` một row 1000 lần là bạn có 1000 phiên bản trên đĩa. Không dọn thì table phình ra (bloat) dù số row logic vẫn y nguyên.

💡 **Ví dụ đời sống**
Sửa hồ sơ giấy trong văn phòng theo kiểu MVCC: mỗi lần sửa, bạn không tẩy xoá tờ cũ (vì có thể ai đó đang đọc nó) mà viết tờ mới rồi kẹp vào. Tiện, không ai phải chờ ai. Nhưng nếu không có người định kỳ đi rút các tờ cũ không còn ai đọc ra khỏi tủ thì tủ hồ sơ sẽ đầy ứ dù nội dung thật chỉ có mấy trang. VACUUM là người đi rút tờ cũ đó.

## C3. VACUUM vs VACUUM FULL

📖 **Nguyên văn**
> "There are two variants of VACUUM: standard VACUUM and VACUUM FULL. VACUUM FULL can reclaim more disk space but runs much more slowly. Also, the standard form of VACUUM can run in parallel with production database operations. (Commands such as SELECT, INSERT, UPDATE, and DELETE will continue to function normally, though you will not be able to modify the definition of a table with commands such as ALTER TABLE while it is being vacuumed.) VACUUM FULL requires an ACCESS EXCLUSIVE lock on the table it is working on, and therefore cannot be done in parallel with other use of the table. Generally, therefore, administrators should strive to use standard VACUUM and avoid VACUUM FULL."

🇻🇳 **Dịch**
> "Có hai biến thể của VACUUM: VACUUM tiêu chuẩn và VACUUM FULL. VACUUM FULL thu hồi được nhiều dung lượng đĩa hơn nhưng chạy chậm hơn rất nhiều. Ngoài ra, dạng tiêu chuẩn của VACUUM có thể chạy song song với các hoạt động của database production. (Các lệnh như SELECT, INSERT, UPDATE và DELETE vẫn hoạt động bình thường, mặc dù bạn sẽ không thể sửa định nghĩa của table bằng các lệnh như ALTER TABLE trong lúc table đang được vacuum.) VACUUM FULL đòi hỏi một ACCESS EXCLUSIVE lock trên table nó đang xử lý, và vì thế không thể chạy song song với việc sử dụng table đó. Do đó, nói chung administrator nên cố gắng dùng VACUUM tiêu chuẩn và tránh VACUUM FULL."

> [!danger] VACUUM FULL khoá bảng — production sẽ đứng
> Tài liệu nói rõ VACUUM FULL *"requires an ACCESS EXCLUSIVE lock on the table it is working on, and therefore cannot be done in parallel with other use of the table"* — 🇻🇳 đòi ACCESS EXCLUSIVE lock trên table, nên không thể chạy song song với bất kỳ việc sử dụng table nào khác. Trên một table vài chục GB, đó là **downtime thật** cho mọi query đụng tới table đó. Khuyến nghị nguyên văn của tài liệu: *"administrators should strive to use standard VACUUM and avoid VACUUM FULL"*.

📖 **Nguyên văn**
> "The standard form of VACUUM removes dead row versions in tables and indexes and marks the space available for future reuse. However, it will not return the space to the operating system, except in the special case where one or more pages at the end of a table become entirely free and an exclusive table lock can be easily obtained. In contrast, VACUUM FULL actively compacts tables by writing a complete new version of the table file with no dead space. This minimizes the size of the table, but can take a long time. It also requires extra disk space for the new copy of the table, until the operation completes."

🇻🇳 **Dịch**
> "Dạng tiêu chuẩn của VACUUM xoá các phiên bản row đã chết trong table và index rồi đánh dấu phần dung lượng đó là dùng lại được về sau. Tuy nhiên, nó sẽ KHÔNG trả dung lượng lại cho hệ điều hành, trừ trường hợp đặc biệt là một hoặc nhiều page ở cuối table trở nên hoàn toàn trống và có thể dễ dàng lấy được exclusive lock trên table. Ngược lại, VACUUM FULL chủ động nén chặt table bằng cách ghi ra một phiên bản hoàn toàn mới của file table không còn khoảng chết. Cách này giảm kích thước table xuống mức tối thiểu, nhưng có thể mất rất lâu. Nó cũng đòi hỏi thêm dung lượng đĩa cho bản copy mới của table cho tới khi thao tác hoàn tất."

| | `VACUUM` | `VACUUM FULL` |
|---|---|---|
| Xoá dead row version | Có | Có |
| Trả dung lượng về OS | Không (trừ page cuối table) | Có |
| Khoá table | Không chặn SELECT/INSERT/UPDATE/DELETE | ACCESS EXCLUSIVE — chặn tất cả |
| Cần thêm disk | Không | Có, cỡ bằng kích thước table |
| autovacuum có chạy không | Có | **Không bao giờ** |

📖 **Nguyên văn**
> "The usual goal of routine vacuuming is to do standard VACUUMs often enough to avoid needing VACUUM FULL. The autovacuum daemon attempts to work this way, and in fact will never issue VACUUM FULL. In this approach, the idea is not to keep tables at their minimum size, but to maintain steady-state usage of disk space: each table occupies space equivalent to its minimum size plus however much space gets used up between vacuum runs."

🇻🇳 **Dịch**
> "Mục tiêu thông thường của việc vacuum định kỳ là chạy VACUUM tiêu chuẩn đủ thường xuyên để không bao giờ phải cần tới VACUUM FULL. Autovacuum daemon cố gắng làm theo hướng này, và thực tế nó không bao giờ phát lệnh VACUUM FULL. Theo cách tiếp cận này, ý tưởng không phải là giữ table ở kích thước nhỏ nhất, mà là duy trì mức sử dụng đĩa ở trạng thái ổn định: mỗi table chiếm dung lượng bằng kích thước tối thiểu của nó cộng thêm phần dung lượng bị tiêu tốn giữa hai lần vacuum."

📖 **Nguyên văn** — khi nào buộc phải VACUUM FULL
> "Plain VACUUM may not be satisfactory when a table contains large numbers of dead row versions as a result of massive update or delete activity. If you have such a table and you need to reclaim the excess disk space it occupies, you will need to use VACUUM FULL, or alternatively CLUSTER or one of the table-rewriting variants of ALTER TABLE. These commands rewrite an entire new copy of the table and build new indexes for it. All these options require an ACCESS EXCLUSIVE lock."

🇻🇳 **Dịch**
> "VACUUM thường có thể không đủ khi một table chứa số lượng lớn phiên bản row đã chết do hoạt động update hoặc delete ồ ạt. Nếu bạn có một table như vậy và cần thu hồi phần dung lượng đĩa dư thừa nó chiếm, bạn sẽ phải dùng VACUUM FULL, hoặc thay thế bằng CLUSTER hay một trong các biến thể ghi-lại-table của ALTER TABLE. Các lệnh này ghi ra một bản copy hoàn toàn mới của table và dựng index mới cho nó. Tất cả các lựa chọn này đều đòi hỏi ACCESS EXCLUSIVE lock."

📖 **Nguyên văn** — mẹo TRUNCATE
> "If you have a table whose entire contents are deleted on a periodic basis, consider doing it with TRUNCATE rather than using DELETE followed by VACUUM. TRUNCATE removes the entire content of the table immediately, without requiring a subsequent VACUUM or VACUUM FULL to reclaim the now-unused disk space. The disadvantage is that strict MVCC semantics are violated."

🇻🇳 **Dịch**
> "Nếu bạn có một table mà toàn bộ nội dung bị xoá định kỳ, hãy cân nhắc làm việc đó bằng TRUNCATE thay vì DELETE rồi VACUUM. TRUNCATE xoá toàn bộ nội dung table ngay lập tức, không cần chạy VACUUM hay VACUUM FULL sau đó để thu hồi dung lượng đĩa vừa trở nên không dùng nữa. Nhược điểm là ngữ nghĩa MVCC nghiêm ngặt bị vi phạm."

📖 **Nguyên văn** — chi phí I/O
> "VACUUM creates a substantial amount of I/O traffic, which can cause poor performance for other active sessions."

🇻🇳 **Dịch**
> "VACUUM tạo ra một lượng I/O đáng kể, có thể khiến các session đang hoạt động khác chạy chậm."

## C4. ANALYZE — vì sao planner cần thống kê

📖 **Nguyên văn**
> "The PostgreSQL query planner relies on statistical information about the contents of tables in order to generate good plans for queries. These statistics are gathered by the ANALYZE command, which can be invoked by itself or as an optional step in VACUUM. It is important to have reasonably accurate statistics, otherwise poor choices of plans might degrade database performance."

🇻🇳 **Dịch**
> "Query planner của PostgreSQL dựa vào thông tin thống kê về nội dung của các table để sinh ra plan tốt cho query. Các thống kê này được thu thập bởi lệnh ANALYZE, lệnh này có thể được gọi độc lập hoặc như một bước tuỳ chọn bên trong VACUUM. Có được thống kê tương đối chính xác là điều quan trọng, nếu không những lựa chọn plan tồi có thể làm giảm hiệu năng database."

🔗 **Nối với bài 04.** Ở [[04 - Indexes]] ta biết planner tự quyết định dùng index hay quét cả bảng. Câu hỏi là: nó lấy đâu ra cơ sở để quyết? Câu trên chính là câu trả lời — thống kê do ANALYZE thu thập. Thống kê lỗi thời (ví dụ vừa nạp thêm 10 triệu row) khiến planner tưởng table còn nhỏ và chọn plan sai; index có đó cũng không được dùng.

💡 **Ví dụ đời sống**
Tài xế chọn đường dựa trên bản đồ giao thông. Bản đồ cập nhật (ANALYZE mới chạy) thì chọn được đường nhanh. Bản đồ từ 5 năm trước thì tài xế vẫn tự tin rẽ vào con đường giờ đã thành công trường.

📖 **Nguyên văn**
> "The autovacuum daemon, if enabled, will automatically issue ANALYZE commands whenever the content of a table has changed sufficiently. However, administrators might prefer to rely on manually-scheduled ANALYZE operations, particularly if it is known that update activity on a table will not affect the statistics of “interesting” columns. The daemon schedules ANALYZE strictly as a function of the number of rows inserted or updated; it has no knowledge of whether that will lead to meaningful statistical changes."

🇻🇳 **Dịch**
> "Autovacuum daemon, nếu được bật, sẽ tự động phát lệnh ANALYZE mỗi khi nội dung một table thay đổi đủ nhiều. Tuy nhiên, administrator có thể thích dựa vào các thao tác ANALYZE lên lịch thủ công, đặc biệt khi đã biết chắc rằng hoạt động update trên một table sẽ không ảnh hưởng tới thống kê của những column “đáng quan tâm”. Daemon lên lịch ANALYZE hoàn toàn dựa trên số row được insert hay update; nó không biết điều đó có dẫn tới thay đổi thống kê có ý nghĩa hay không."

📖 **Nguyên văn**
> "It is possible to run ANALYZE on specific tables and even just specific columns of a table, so the flexibility exists to update some statistics more frequently than others if your application requires it. In practice, however, it is usually best to just analyze the entire database, because it is a fast operation. ANALYZE uses a statistically random sampling of the rows of a table rather than reading every single row."

🇻🇳 **Dịch**
> "Có thể chạy ANALYZE trên những table cụ thể và thậm chí chỉ trên những column cụ thể của một table, nên vẫn có sự linh hoạt để cập nhật một số thống kê thường xuyên hơn số khác nếu ứng dụng của bạn cần. Tuy nhiên, trên thực tế thường tốt nhất là cứ analyze toàn bộ database, vì đây là thao tác nhanh. ANALYZE dùng cách lấy mẫu ngẫu nhiên theo thống kê trên các row của table chứ không đọc từng row một."

> [!tip] Autovacuum không ANALYZE partitioned table
> 📖 **Nguyên văn**
> > "The autovacuum daemon does not issue ANALYZE commands for partitioned tables. Inheritance parents will only be analyzed if the parent itself is changed - changes to child tables do not trigger autoanalyze on the parent table. If your queries require statistics on parent tables for proper planning, it is necessary to periodically run a manual ANALYZE on those tables to keep the statistics up to date."
>
> 🇻🇳 **Dịch**
> > "Autovacuum daemon không phát lệnh ANALYZE cho partitioned table. Các inheritance parent chỉ được analyze nếu bản thân parent bị thay đổi — thay đổi ở child table không kích hoạt autoanalyze trên parent. Nếu query của bạn cần thống kê trên parent table để lập plan đúng, cần định kỳ chạy ANALYZE thủ công trên những table đó để giữ thống kê luôn mới."

## C5. Autovacuum daemon

📖 **Nguyên văn**
> "PostgreSQL has an optional but highly recommended feature called *autovacuum*, whose purpose is to automate the execution of VACUUM and ANALYZE commands. When enabled, autovacuum checks for tables that have had a large number of inserted, updated or deleted tuples. These checks use the statistics collection facility; therefore, autovacuum cannot be used unless `track_counts` is set to true. In the default configuration, autovacuuming is enabled and the related configuration parameters are appropriately set."

🇻🇳 **Dịch**
> "PostgreSQL có một tính năng tuỳ chọn nhưng rất được khuyến nghị tên là *autovacuum*, mục đích là tự động hoá việc thực thi các lệnh VACUUM và ANALYZE. Khi được bật, autovacuum kiểm tra xem table nào có số lượng lớn tuple được insert, update hay delete. Các kiểm tra này dùng cơ chế thu thập thống kê; do đó, không thể dùng autovacuum trừ khi `track_counts` được đặt là true. Ở cấu hình mặc định, autovacuum được bật và các tham số cấu hình liên quan được đặt sẵn phù hợp."

📖 **Nguyên văn**
> "The “autovacuum daemon” actually consists of multiple processes. There is a persistent daemon process, called the *autovacuum launcher*, which is in charge of starting autovacuum worker processes for all databases. The launcher will distribute the work across time, attempting to start one worker within each database every `autovacuum_naptime` seconds. [...] A maximum of `autovacuum_max_workers` worker processes are allowed to run at the same time. [...] Each worker process will check each table within its database and execute VACUUM and/or ANALYZE as needed."

🇻🇳 **Dịch**
> "“Autovacuum daemon” thực ra gồm nhiều process. Có một process daemon thường trực, gọi là *autovacuum launcher*, chịu trách nhiệm khởi động các autovacuum worker process cho tất cả database. Launcher phân bổ công việc theo thời gian, cố gắng khởi động một worker trong mỗi database sau mỗi `autovacuum_naptime` giây. [...] Tối đa `autovacuum_max_workers` worker process được phép chạy cùng lúc. [...] Mỗi worker process sẽ kiểm tra từng table trong database của nó và thực thi VACUUM và/hoặc ANALYZE khi cần."

📖 **Nguyên văn** — ngưỡng kích hoạt
> "Tables whose `relfrozenxid` value is more than `autovacuum_freeze_max_age` transactions old are always vacuumed [...] Otherwise, if the number of tuples obsoleted since the last VACUUM exceeds the “vacuum threshold”, the table is vacuumed. The vacuum threshold is defined as:"
> "vacuum threshold = Minimum(vacuum max threshold, vacuum base threshold + vacuum scale factor * number of tuples)"

🇻🇳 **Dịch**
> "Những table có giá trị `relfrozenxid` cũ hơn `autovacuum_freeze_max_age` transaction thì luôn luôn được vacuum [...] Ngược lại, nếu số tuple trở nên lỗi thời kể từ lần VACUUM gần nhất vượt quá “vacuum threshold” thì table được vacuum. Vacuum threshold được định nghĩa là:"
> "`vacuum threshold = Minimum(vacuum max threshold, vacuum base threshold + vacuum scale factor * số tuple)`"

📖 **Nguyên văn** — có nên tắt daemon không
> "It is unwise to disable the daemon completely unless you have an extremely predictable workload."

🇻🇳 **Dịch**
> "Tắt hẳn daemon là không khôn ngoan, trừ khi bạn có một workload cực kỳ dễ dự đoán."

## C6. Transaction ID wraparound — thứ giết chết database production

📖 **Nguyên văn**
> "PostgreSQL's MVCC transaction semantics depend on being able to compare transaction ID (XID) numbers: a row version with an insertion XID greater than the current transaction's XID is “in the future” and should not be visible to the current transaction. But since transaction IDs have limited size (32 bits) a cluster that runs for a long time (more than 4 billion transactions) would suffer *transaction ID wraparound*: the XID counter wraps around to zero, and all of a sudden transactions that were in the past appear to be in the future — which means their output become invisible. In short, catastrophic data loss. (Actually the data is still there, but that's cold comfort if you cannot get at it.) To avoid this, it is necessary to vacuum every table in every database at least once every two billion transactions."

🇻🇳 **Dịch**
> "Ngữ nghĩa transaction MVCC của PostgreSQL phụ thuộc vào khả năng so sánh các số transaction ID (XID): một phiên bản row có XID lúc insert lớn hơn XID của transaction hiện tại thì nằm “ở tương lai” và không nên hiển thị với transaction hiện tại. Nhưng vì transaction ID có kích thước giới hạn (32 bit), một cluster chạy đủ lâu (hơn 4 tỷ transaction) sẽ gặp *transaction ID wraparound*: bộ đếm XID quay vòng về không, và đột nhiên các transaction vốn ở quá khứ lại trông như ở tương lai — nghĩa là output của chúng trở nên vô hình. Nói ngắn gọn: mất dữ liệu thảm khốc. (Thực ra dữ liệu vẫn còn đó, nhưng đó là an ủi lạnh lẽo nếu bạn không truy cập được nó.) Để tránh điều này, cần vacuum mọi table trong mọi database ít nhất một lần sau mỗi hai tỷ transaction."

> [!danger] Wraparound = mất dữ liệu, không phải chậm
> Tài liệu dùng đúng chữ **"catastrophic data loss"**. Đây không phải vấn đề hiệu năng — đây là dữ liệu vẫn nằm trên đĩa nhưng không đọc ra được nữa. Đó là lý do PostgreSQL kích hoạt autovacuum chống wraparound **kể cả khi bạn đã tắt autovacuum**.

📖 **Nguyên văn** — cơ chế freeze
> "The reason that periodic vacuuming solves the problem is that VACUUM will mark rows as *frozen*, indicating that they were inserted by a transaction that committed sufficiently far in the past that the effects of the inserting transaction are certain to be visible to all current and future transactions."

🇻🇳 **Dịch**
> "Lý do việc vacuum định kỳ giải quyết được vấn đề là VACUUM sẽ đánh dấu các row là *frozen*, cho biết chúng được insert bởi một transaction đã commit đủ xa trong quá khứ tới mức chắc chắn tác động của transaction insert đó hiển thị với mọi transaction hiện tại và tương lai."

📖 **Nguyên văn** — cơ chế an toàn cuối cùng
> "The maximum time that a table can go unvacuumed is two billion transactions minus the `vacuum_freeze_min_age` value at the time of the last aggressive vacuum. If it were to go unvacuumed for longer than that, data loss could result. To ensure that this does not happen, autovacuum is invoked on any table that might contain unfrozen rows with XIDs older than the age specified by the configuration parameter `autovacuum_freeze_max_age`. (This will happen even if autovacuum is disabled.)"

🇻🇳 **Dịch**
> "Thời gian tối đa một table có thể không được vacuum là hai tỷ transaction trừ đi giá trị `vacuum_freeze_min_age` tại thời điểm lần aggressive vacuum gần nhất. Nếu để lâu hơn thế mà không vacuum thì có thể dẫn tới mất dữ liệu. Để đảm bảo điều này không xảy ra, autovacuum được kích hoạt trên bất kỳ table nào có thể chứa row chưa frozen với XID cũ hơn độ tuổi quy định bởi tham số cấu hình `autovacuum_freeze_max_age`. (Việc này sẽ xảy ra ngay cả khi autovacuum đã bị tắt.)"

💡 **Ví dụ đời sống**
Đồng hồ kim chỉ 12 giờ. "3 giờ" là trước hay sau "11 giờ"? Tuỳ bạn đang đứng ở mốc nào — vì mặt đồng hồ là vòng tròn, không có điểm đầu điểm cuối. XID cũng vậy: 32 bit quay vòng. Việc "freeze" giống như đóng dấu vĩnh viễn lên vài sự kiện rằng "cái này chắc chắn đã xảy ra rồi", để dù kim có quay bao nhiêu vòng nữa cũng không ai hiểu nhầm là nó sắp xảy ra.

---

# PHẦN D — Performance tips

📖 **Nguyên văn**
> "Query performance can be affected by many things. Some of these can be controlled by the user, while others are fundamental to the underlying design of the system. This chapter provides some hints about understanding and tuning PostgreSQL performance."

🇻🇳 **Dịch**
> "Hiệu năng query có thể bị ảnh hưởng bởi nhiều thứ. Một số trong đó user kiểm soát được, số khác là bản chất của thiết kế nền tảng của hệ thống. Chương này đưa ra vài gợi ý về việc hiểu và tinh chỉnh hiệu năng PostgreSQL."

Chapter 14 gồm: `14.1. Using EXPLAIN`, `14.2. Statistics Used by the Planner`, `14.3. Controlling the Planner with Explicit JOIN Clauses`, `14.4. Populating a Database`, `14.5. Non-Durable Settings`.

> [!note] EXPLAIN
> Mục `14.1. Using EXPLAIN` đã được học ở [[04 - Indexes]] — không lặp lại ở đây.

## D1. Nạp dữ liệu lớn — Section 14.4 Populating a Database

📖 **Nguyên văn**
> "One might need to insert a large amount of data when first populating a database. This section contains some suggestions on how to make this process as efficient as possible."

🇻🇳 **Dịch**
> "Người ta có thể cần insert một lượng lớn dữ liệu khi mới nạp dữ liệu ban đầu cho database. Mục này chứa vài gợi ý làm cho quá trình đó hiệu quả nhất có thể."

### D1.1. Tắt autocommit

📖 **Nguyên văn**
> "When using multiple INSERTs, turn off autocommit and just do one commit at the end. (In plain SQL, this means issuing BEGIN at the start and COMMIT at the end. Some client libraries might do this behind your back, in which case you need to make sure the library does it when you want it done.) If you allow each insertion to be committed separately, PostgreSQL is doing a lot of work for each row that is added. An additional benefit of doing all insertions in one transaction is that if the insertion of one row were to fail then the insertion of all rows inserted up to that point would be rolled back, so you won't be stuck with partially loaded data."

🇻🇳 **Dịch**
> "Khi dùng nhiều lệnh INSERT, hãy tắt autocommit và chỉ commit một lần ở cuối. (Trong SQL thuần, nghĩa là phát BEGIN ở đầu và COMMIT ở cuối. Một số client library có thể tự làm việc này sau lưng bạn, khi đó bạn cần đảm bảo library làm đúng lúc bạn muốn.) Nếu bạn để mỗi lần insert được commit riêng, PostgreSQL phải làm rất nhiều việc cho từng row được thêm vào. Một lợi ích nữa của việc gom tất cả insert vào một transaction là nếu một row insert thất bại thì tất cả row đã insert trước đó sẽ bị rollback, nên bạn không bị kẹt với dữ liệu nạp dở."

Đây chính là transaction của [[05 - Transactions, ACID và MVCC]] dùng cho mục đích hiệu năng, không chỉ cho tính đúng đắn.

### D1.2. Dùng COPY thay INSERT

📖 **Nguyên văn**
> "Use COPY to load all the rows in one command, instead of using a series of INSERT commands. The COPY command is optimized for loading large numbers of rows; it is less flexible than INSERT, but incurs significantly less overhead for large data loads. Since COPY is a single command, there is no need to disable autocommit if you use this method to populate a table."

🇻🇳 **Dịch**
> "Dùng COPY để nạp tất cả row trong một lệnh duy nhất, thay vì dùng một loạt lệnh INSERT. Lệnh COPY được tối ưu cho việc nạp số lượng row lớn; nó kém linh hoạt hơn INSERT, nhưng tốn ít overhead hơn hẳn với các đợt nạp dữ liệu lớn. Vì COPY là một lệnh đơn, không cần tắt autocommit nếu bạn dùng cách này để nạp dữ liệu cho table."

📖 **Nguyên văn**
> "If you cannot use COPY, it might help to use PREPARE to create a prepared INSERT statement, and then use EXECUTE as many times as required. This avoids some of the overhead of repeatedly parsing and planning INSERT."
> "Note that loading a large number of rows using COPY is almost always faster than using INSERT, even if PREPARE is used and multiple insertions are batched into a single transaction."

🇻🇳 **Dịch**
> "Nếu bạn không dùng được COPY, có thể hữu ích khi dùng PREPARE để tạo một prepared INSERT statement, rồi dùng EXECUTE bao nhiêu lần tuỳ nhu cầu. Cách này tránh được một phần overhead của việc parse và lập plan lặp đi lặp lại cho INSERT."
> "Lưu ý rằng nạp một lượng lớn row bằng COPY gần như lúc nào cũng nhanh hơn dùng INSERT, kể cả khi đã dùng PREPARE và gom nhiều lần insert vào một transaction duy nhất."

> [!tip] Prepared statement — lại gặp lại
> `PREPARE` / `EXECUTE` chính là cơ chế đã học ở [[13 - SQL Injection và Parameterized Query]]. Ở đó nó là biện pháp an toàn; ở đây tài liệu chỉ ra nó còn tiết kiệm chi phí parse và planning. Một mũi tên trúng hai đích.

### D1.3. Tạo index SAU khi nạp dữ liệu

📖 **Nguyên văn**
> "If you are loading a freshly created table, the fastest method is to create the table, bulk load the table's data using COPY, then create any indexes needed for the table. Creating an index on pre-existing data is quicker than updating it incrementally as each row is loaded."
> "If you are adding large amounts of data to an existing table, it might be a win to drop the indexes, load the table, and then recreate the indexes. Of course, the database performance for other users might suffer during the time the indexes are missing. One should also think twice before dropping a unique index, since the error checking afforded by the unique constraint will be lost while the index is missing."

🇻🇳 **Dịch**
> "Nếu bạn đang nạp dữ liệu cho một table vừa tạo, cách nhanh nhất là tạo table, bulk load dữ liệu bằng COPY, rồi mới tạo các index cần thiết cho table. Tạo index trên dữ liệu đã có sẵn nhanh hơn là cập nhật index từng chút một khi mỗi row được nạp vào."
> "Nếu bạn đang thêm một lượng lớn dữ liệu vào một table đã tồn tại, có thể có lợi khi drop các index, nạp dữ liệu, rồi tạo lại index. Dĩ nhiên, hiệu năng database với các user khác có thể bị ảnh hưởng trong khoảng thời gian thiếu index. Cũng nên cân nhắc kỹ trước khi drop một unique index, vì việc kiểm lỗi mà unique constraint mang lại sẽ mất đi trong lúc index vắng mặt."

Nối với [[04 - Indexes]]: bài đó nói index làm chậm ghi. Đây là hệ quả cụ thể ở quy mô lớn — nạp 10 triệu row với 4 index nghĩa là cập nhật cấu trúc index 40 triệu lần.

### D1.4. Bỏ foreign key constraint tạm thời

📖 **Nguyên văn**
> "Just as with indexes, a foreign key constraint can be checked “in bulk” more efficiently than row-by-row. So it might be useful to drop foreign key constraints, load data, and re-create the constraints. Again, there is a trade-off between data load speed and loss of error checking while the constraint is missing."

🇻🇳 **Dịch**
> "Cũng giống như với index, một foreign key constraint có thể được kiểm tra “hàng loạt” hiệu quả hơn là kiểm tra từng row. Nên có thể hữu ích khi drop các foreign key constraint, nạp dữ liệu, rồi tạo lại constraint. Một lần nữa, đây là đánh đổi giữa tốc độ nạp dữ liệu và việc mất kiểm lỗi trong lúc constraint vắng mặt."

📖 **Nguyên văn**
> "What's more, when you load data into a table with existing foreign key constraints, each new row requires an entry in the server's list of pending trigger events (since it is the firing of a trigger that checks the row's foreign key constraint). Loading many millions of rows can cause the trigger event queue to overflow available memory, leading to intolerable swapping or even outright failure of the command."

🇻🇳 **Dịch**
> "Hơn nữa, khi bạn nạp dữ liệu vào một table đang có foreign key constraint, mỗi row mới cần một entry trong danh sách trigger event đang chờ của server (vì chính việc kích hoạt trigger mới là thứ kiểm tra foreign key constraint của row đó). Nạp vài triệu row có thể khiến hàng đợi trigger event tràn bộ nhớ khả dụng, dẫn tới swapping không chịu nổi hoặc thậm chí lệnh thất bại hoàn toàn."

### D1.5. Tăng maintenance_work_mem và max_wal_size

📖 **Nguyên văn**
> "Temporarily increasing the `maintenance_work_mem` configuration variable when loading large amounts of data can lead to improved performance. This will help to speed up CREATE INDEX commands and ALTER TABLE ADD FOREIGN KEY commands. It won't do much for COPY itself, so this advice is only useful when you are using one or both of the above techniques."

🇻🇳 **Dịch**
> "Tăng tạm thời biến cấu hình `maintenance_work_mem` khi nạp lượng dữ liệu lớn có thể cải thiện hiệu năng. Việc này giúp tăng tốc các lệnh CREATE INDEX và ALTER TABLE ADD FOREIGN KEY. Nó không giúp được gì nhiều cho bản thân COPY, nên lời khuyên này chỉ hữu ích khi bạn đang dùng một hoặc cả hai kỹ thuật nói trên."

📖 **Nguyên văn**
> "Temporarily increasing the `max_wal_size` configuration variable can also make large data loads faster. This is because loading a large amount of data into PostgreSQL will cause checkpoints to occur more often than the normal checkpoint frequency (specified by the `checkpoint_timeout` configuration variable). Whenever a checkpoint occurs, all dirty pages must be flushed to disk. By increasing `max_wal_size` temporarily during bulk data loads, the number of checkpoints that are required can be reduced."

🇻🇳 **Dịch**
> "Tăng tạm thời biến cấu hình `max_wal_size` cũng làm các đợt nạp dữ liệu lớn nhanh hơn. Lý do là nạp một lượng lớn dữ liệu vào PostgreSQL sẽ khiến checkpoint xảy ra thường xuyên hơn tần suất checkpoint bình thường (quy định bởi biến cấu hình `checkpoint_timeout`). Mỗi khi một checkpoint xảy ra, mọi dirty page phải được flush xuống đĩa. Bằng cách tăng tạm thời `max_wal_size` trong lúc bulk load, số checkpoint cần thiết có thể giảm đi."

### D1.6. Chạy ANALYZE sau khi nạp

📖 **Nguyên văn**
> "Whenever you have significantly altered the distribution of data within a table, running ANALYZE is strongly recommended. This includes bulk loading large amounts of data into the table. Running ANALYZE (or VACUUM ANALYZE) ensures that the planner has up-to-date statistics about the table. With no statistics or obsolete statistics, the planner might make poor decisions during query planning, leading to poor performance on any tables with inaccurate or nonexistent statistics."

🇻🇳 **Dịch**
> "Mỗi khi bạn đã thay đổi đáng kể phân bố dữ liệu trong một table, chạy ANALYZE là điều rất được khuyến nghị. Điều này bao gồm cả việc bulk load lượng lớn dữ liệu vào table. Chạy ANALYZE (hoặc VACUUM ANALYZE) đảm bảo planner có thống kê cập nhật về table. Khi không có thống kê hoặc thống kê lỗi thời, planner có thể ra quyết định tồi trong lúc lập plan cho query, dẫn tới hiệu năng kém trên bất kỳ table nào có thống kê sai hoặc không tồn tại."

### D1.7. Restore pg_dump nhanh hơn

📖 **Nguyên văn**
> "By default, pg_dump uses COPY, and when it is generating a complete schema-and-data dump, it is careful to load data before creating indexes and foreign keys. So in this case several guidelines are handled automatically."

🇻🇳 **Dịch**
> "Mặc định, pg_dump dùng COPY, và khi nó sinh ra một bản dump đầy đủ cả schema lẫn dữ liệu, nó cẩn thận nạp dữ liệu trước rồi mới tạo index và foreign key. Nên trong trường hợp này, vài hướng dẫn ở trên đã được xử lý tự động."

📖 **Nguyên văn**
> "Experiment with the parallel dump and restore modes of both pg_dump and pg_restore and find the optimal number of concurrent jobs to use. Dumping and restoring in parallel by means of the `-j` option should give you a significantly higher performance over the serial mode."

🇻🇳 **Dịch**
> "Hãy thử nghiệm với chế độ parallel dump và restore của cả pg_dump lẫn pg_restore để tìm số job đồng thời tối ưu. Dump và restore song song bằng tuỳ chọn `-j` sẽ cho hiệu năng cao hơn đáng kể so với chế độ tuần tự."

📖 **Nguyên văn**
> "A data-only dump will still use COPY, but it does not drop or recreate indexes, and it does not normally touch foreign keys. So when loading a data-only dump, it is up to you to drop and recreate indexes and foreign keys if you wish to use those techniques."

🇻🇳 **Dịch**
> "Một bản dump chỉ-dữ-liệu vẫn dùng COPY, nhưng nó không drop hay tạo lại index, và thường không đụng tới foreign key. Nên khi nạp một bản dump chỉ-dữ-liệu, bạn phải tự drop và tạo lại index cùng foreign key nếu muốn dùng các kỹ thuật đó."

## D2. Tham số planner

Tài liệu có mục `14.2. Statistics Used by the Planner` (gồm `14.2.1. Single-Column Statistics` và `14.2.2. Extended Statistics`) và `14.3. Controlling the Planner with Explicit JOIN Clauses`. Ngoài ra, trang Role Attributes cho thấy có thể đặt tham số planner ở mức role:

📖 **Nguyên văn**
> "A role can also have role-specific defaults for many of the run-time configuration settings described in Chapter 19. For example, if for some reason you want to disable index scans (hint: not a good idea) anytime you connect, you can use:"
> "ALTER ROLE myname SET enable_indexscan TO off;"

🇻🇳 **Dịch**
> "Một role cũng có thể có giá trị mặc định riêng cho nhiều thiết lập cấu hình run-time mô tả ở Chapter 19. Ví dụ, nếu vì lý do nào đó bạn muốn tắt index scan (gợi ý: không phải ý hay) mỗi khi kết nối, bạn có thể dùng:"
> "`ALTER ROLE tên_tôi SET enable_indexscan TO off;`"

```sql
ALTER ROLE myname SET enable_indexscan TO off;
```
🇻🇳 Đặt mặc định tắt index scan cho riêng một role — tài liệu ghi rõ trong ngoặc đây "không phải ý hay".

---

# PHẦN E — psql meta-command hay dùng

📖 **Nguyên văn** — `\l`
> "List the databases in the server and show their names, owners, character set encodings, and access privileges. If *pattern* is specified, only databases whose names match the pattern are listed. [...] If `+` is appended to the command name, database sizes, default tablespaces, and descriptions are also displayed."

🇻🇳 **Dịch**
> "Liệt kê các database trên server và hiển thị tên, owner, character set encoding và access privilege của chúng. Nếu có chỉ định *pattern*, chỉ những database có tên khớp pattern được liệt kê. [...] Nếu thêm `+` vào sau tên lệnh, kích thước database, tablespace mặc định và phần mô tả cũng được hiển thị."

📖 **Nguyên văn** — `\dt` (nằm trong nhóm `\dE \di \dm \ds \dt \dv`)
> "In this group of commands, the letters `E`, `i`, `m`, `s`, `t`, and `v` stand for foreign table, index, materialized view, sequence, table, and view, respectively. You can specify any or all of these letters, in any order, to obtain a listing of objects of these types. For example, `\dti` lists tables and indexes. [...] If `+` is appended to the command name, each object is listed with its persistence status (permanent, temporary, or unlogged), physical size on disk, and associated description if any."

🇻🇳 **Dịch**
> "Trong nhóm lệnh này, các chữ cái `E`, `i`, `m`, `s`, `t` và `v` lần lượt đại diện cho foreign table, index, materialized view, sequence, table và view. Bạn có thể chỉ định bất kỳ hoặc tất cả các chữ này, theo thứ tự bất kỳ, để có danh sách object thuộc các loại đó. Ví dụ, `\dti` liệt kê table và index. [...] Nếu thêm `+` vào sau tên lệnh, mỗi object được liệt kê kèm trạng thái persistence (permanent, temporary hay unlogged), kích thước vật lý trên đĩa và phần mô tả liên quan nếu có."

📖 **Nguyên văn** — `\d <table>`
> "For each relation (table, view, materialized view, index, sequence, or foreign table) or composite type matching the *pattern*, show all columns, their types, the tablespace (if not the default) and any special attributes such as NOT NULL or defaults. Associated indexes, constraints, rules, and triggers are also shown."

🇻🇳 **Dịch**
> "Với mỗi relation (table, view, materialized view, index, sequence hay foreign table) hoặc composite type khớp *pattern*, hiển thị tất cả column, kiểu của chúng, tablespace (nếu không phải mặc định) và mọi attribute đặc biệt như NOT NULL hay giá trị default. Các index, constraint, rule và trigger liên quan cũng được hiển thị."

📖 **Nguyên văn** — `\d` không tham số
> "If `\d` is used without a *pattern* argument, it is equivalent to `\dtvmsE` which will show a list of all visible tables, views, materialized views, sequences and foreign tables. This is purely a convenience measure."

🇻🇳 **Dịch**
> "Nếu `\d` được dùng không kèm đối số *pattern*, nó tương đương `\dtvmsE`, tức sẽ hiển thị danh sách tất cả table, view, materialized view, sequence và foreign table đang nhìn thấy được. Đây thuần tuý là một tiện ích."

📖 **Nguyên văn** — `\du`
> "Lists database roles. (Since the concepts of “users” and “groups” have been unified into “roles”, this command is now equivalent to `\dg`.) By default, only user-created roles are shown; supply the `S` modifier to include system roles. If *pattern* is specified, only those roles whose names match the pattern are listed."

🇻🇳 **Dịch**
> "Liệt kê các database role. (Vì khái niệm “user” và “group” đã được hợp nhất thành “role”, lệnh này giờ tương đương `\dg`.) Mặc định chỉ những role do user tạo được hiển thị; thêm modifier `S` để bao gồm cả role hệ thống. Nếu có chỉ định *pattern*, chỉ những role có tên khớp pattern được liệt kê."

📖 **Nguyên văn** — `\timing`
> "With a parameter, turns displaying of how long each SQL statement takes on or off. Without a parameter, toggles the display between on and off. The display is in milliseconds; intervals longer than 1 second are also shown in minutes:seconds format, with hours and days fields added if needed."

🇻🇳 **Dịch**
> "Khi có tham số, bật hoặc tắt việc hiển thị thời gian mỗi câu lệnh SQL chạy mất bao lâu. Khi không có tham số, đảo trạng thái hiển thị giữa bật và tắt. Thời gian hiển thị theo mili-giây; các khoảng dài hơn 1 giây còn được hiển thị thêm ở dạng phút:giây, kèm trường giờ và ngày nếu cần."

📖 **Nguyên văn** — `\x`
> "Sets or toggles expanded table formatting mode. As such it is equivalent to `\pset expanded`."

🇻🇳 **Dịch**
> "Đặt hoặc đảo chế độ định dạng bảng mở rộng (expanded). Như vậy nó tương đương `\pset expanded`."

📖 **Nguyên văn** — `\z` (bonus: xem privilege, rất hợp với Phần A)
> "Lists tables, views and sequences with their associated access privileges. If a *pattern* is specified, only tables, views and sequences whose names match the pattern are listed."

🇻🇳 **Dịch**
> "Liệt kê table, view và sequence kèm các access privilege liên quan. Nếu có chỉ định *pattern*, chỉ những table, view và sequence có tên khớp pattern được liệt kê."

### Bảng tra nhanh

| Meta-command | Làm gì (rút từ mô tả nguyên văn ở trên) |
|---|---|
| `\l` | Liệt kê database: tên, owner, encoding, access privilege. `\l+` thêm kích thước |
| `\dt` | Liệt kê table (`t` = table trong nhóm `\dEimstv`). `\dt+` thêm kích thước vật lý |
| `\d <table>` | Hiển thị column, kiểu, NOT NULL/default, kèm index, constraint, rule, trigger |
| `\d` | Tương đương `\dtvmsE` — liệt kê mọi relation nhìn thấy được |
| `\du` | Liệt kê database role (tương đương `\dg`) |
| `\timing` | Bật/tắt hiển thị thời gian chạy mỗi câu lệnh, đơn vị mili-giây |
| `\x` | Bật/tắt chế độ hiển thị expanded (mỗi column một dòng) |
| `\z` | Liệt kê table/view/sequence kèm access privilege |

> [!tip] Bộ đôi `\x` + `\timing`
> `\x` cực hữu ích khi `\d` hay `SELECT *` trên table nhiều column bị tràn ngang màn hình. `\timing` là cách rẻ nhất để đo trước/sau khi thêm index ở [[04 - Indexes]] mà không cần tới `EXPLAIN ANALYZE`.

---

## 🔌 Liên hệ stack thực tế

> Phần này là ghi chú riêng, KHÔNG trích từ tài liệu PostgreSQL.

- **VACUUM không có tương đương ở Firestore.** VACUUM tồn tại vì PostgreSQL lưu nhiều phiên bản row ngay trong file table (MVCC) và cần dọn thủ công/định kỳ. Firestore là dịch vụ managed, việc thu hồi dung lượng do Google vận hành, người dùng không có lệnh nào tương ứng. Đây là một khác biệt vận hành thật sự: chuyển từ Firestore sang một relational database self-hosted nghĩa là nhận thêm trách nhiệm này.
- **Roles/privileges vs Firestore Security Rules.** Cả hai đều là kiểm soát truy cập, nhưng khác tầng: GRANT/REVOKE gắn vào database engine và áp cho mọi connection; Security Rules áp ở tầng dịch vụ và gắn với identity của người dùng cuối. Không thay thế nhau được về mặt khái niệm.
- **Bài học chung nhất, đúng cho cả hai:** nguyên tắc least privilege ở Phần A không phụ thuộc vào database. Một service account/role dùng cho app không nên có quyền quản trị — đây là thói quen mang theo được sang bất kỳ stack nào.

---

## Liên kết

- Bài trước: [[13 - SQL Injection và Parameterized Query]]
- Bài kế: [[15 - So sánh MySQL, MariaDB, SQLite, MS SQL, Oracle]]
- Tổng hợp phần 05: [[00 - Tổng hợp (Relational Databases)]]
- [[05 - Transactions, ACID và MVCC]] — MVCC là lý do có dead tuple, và là lý do pg_dump có snapshot nhất quán
- [[04 - Indexes]] — planner cần thống kê từ ANALYZE để quyết định dùng index; EXPLAIN đã học ở đó
- [[06 - Database Migrations]] — role owner chạy migration, tách khỏi role của app
- [[02 - Tables, Data Types và Constraints]] — foreign key constraint bị drop tạm khi bulk load

## Nguồn tham khảo

- PostgreSQL Documentation — Chapter 21. Database Roles : https://www.postgresql.org/docs/current/user-manag.html
- PostgreSQL Documentation — 21.1. Database Roles : https://www.postgresql.org/docs/current/database-roles.html
- PostgreSQL Documentation — 21.2. Role Attributes : https://www.postgresql.org/docs/current/role-attributes.html
- PostgreSQL Documentation — 5.8. Privileges : https://www.postgresql.org/docs/current/ddl-priv.html
- PostgreSQL Documentation — 25.1. SQL Dump : https://www.postgresql.org/docs/current/backup-dump.html
- PostgreSQL Documentation — 24.1. Routine Vacuuming : https://www.postgresql.org/docs/current/routine-vacuuming.html
- PostgreSQL Documentation — Chapter 14. Performance Tips : https://www.postgresql.org/docs/current/performance-tips.html
- PostgreSQL Documentation — 14.4. Populating a Database : https://www.postgresql.org/docs/current/populate.html
- PostgreSQL Documentation — psql : https://www.postgresql.org/docs/current/app-psql.html

> [!note] Về phiên bản
> Các trang `/docs/current/` tại thời điểm fetch trỏ tới **PostgreSQL 18**. Tên tham số và số hiệu section (ví dụ `autovacuum_vacuum_max_threshold`) có thể khác ở các phiên bản cũ hơn.
