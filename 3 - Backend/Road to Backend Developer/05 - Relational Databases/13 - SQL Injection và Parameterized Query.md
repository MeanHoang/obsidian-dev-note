# 13 — SQL Injection và Parameterized Query

> **Nguồn chính:** OWASP Cheat Sheet Series — *SQL Injection Prevention Cheat Sheet* — <https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html>
> **Nguồn phụ:** PostgreSQL Documentation — `PREPARE`, libpq `PQexecParams`, PL/pgSQL *Executing Dynamic Commands*, `format()`
> Bài này bám 4 Primary Defenses + Additional Defenses của OWASP, ghép với cách PostgreSQL hiện thực tham số hoá.

> [!note] Bài này nói về PHÒNG THỦ
> Đây là bài dành cho người **viết query**, không phải người tấn công. Mọi ví dụ dưới đây dừng ở mức đủ để hiểu *vì sao* lỗi xảy ra và *viết thế nào cho đúng*. Không có payload khai thác, không có kỹ thuật dò lỗ hổng hệ thống người khác — OWASP xếp những thứ đó ở tài liệu khác, và tài liệu này (theo đúng lời OWASP) được tạo ra để **giúp bạn tránh** chúng.

---

## 1. SQL injection là gì

📖 **Nguyên văn**
> "This cheat sheet will help you prevent SQL injection flaws in your applications. It will define what SQL injection is, explain where those flaws occur, and provide four options for defending against SQL injection attacks. [SQL Injection](https://owasp.org/www-community/attacks/SQL_Injection) attacks are common because:
>
> 1. SQL Injection vulnerabilities are very common.
> 2. The application's database is a frequent target for attackers because it typically contains sensitive or critical data."

🇻🇳 **Dịch**
> "Cheat sheet này sẽ giúp bạn ngăn chặn các lỗ hổng SQL injection trong ứng dụng của bạn. Nó sẽ định nghĩa SQL injection là gì, giải thích những lỗ hổng đó xảy ra ở đâu, và đưa ra bốn lựa chọn để phòng thủ trước các cuộc tấn công SQL injection. Các cuộc tấn công SQL Injection phổ biến bởi vì:
>
> 1. Lỗ hổng SQL Injection rất phổ biến.
> 2. Database của ứng dụng là mục tiêu thường xuyên của kẻ tấn công vì nó thường chứa dữ liệu nhạy cảm hoặc trọng yếu."

📖 **Nguyên văn** — *What Is a SQL Injection Attack?*
> "Attackers can use SQL injection on an application if it has dynamic database queries that use string concatenation and user-supplied input. To avoid SQL injection flaws, developers need to:
>
> 1. Stop writing dynamic queries with string concatenation.
> 2. Prevent malicious SQL input from being included in executed queries."

🇻🇳 **Dịch**
> "Kẻ tấn công có thể dùng SQL injection lên một ứng dụng nếu ứng dụng đó có các dynamic database query sử dụng string concatenation và input do người dùng cung cấp. Để tránh các lỗ hổng SQL injection, developer cần:
>
> 1. Ngừng viết dynamic query bằng string concatenation.
> 2. Ngăn không cho input SQL độc hại lọt vào các query được thực thi."

📖 **Nguyên văn**
> "There are simple techniques for preventing SQL injection vulnerabilities, and they can be used with practically any kind of programming language and any type of database. While XML databases can have similar problems (e.g., XPath and XQuery injection), these techniques can be used to protect them as well."

🇻🇳 **Dịch**
> "Có những kỹ thuật đơn giản để ngăn chặn lỗ hổng SQL injection, và chúng dùng được với gần như mọi loại ngôn ngữ lập trình và mọi loại database. Trong khi XML database có thể gặp vấn đề tương tự (ví dụ XPath và XQuery injection), các kỹ thuật này cũng dùng để bảo vệ chúng được."

> [!tip] Điểm cần nhớ ngay từ dòng đầu
> OWASP không mô tả SQL injection là "lỗi bảo mật bí ẩn". Họ mô tả nó là **hệ quả trực tiếp của một thói quen viết code**: nối chuỗi. Bỏ thói quen đó đi là bỏ được cả lớp lỗ hổng.

---

## 2. Vì sao lỗi xảy ra — nối chuỗi dữ liệu người dùng vào câu SQL

📖 **Nguyên văn** — *Anatomy of a Typical SQL Injection Vulnerability*
> "A common SQL injection flaw in Java is shown below. Because its unvalidated "customerName" parameter is simply appended to the query, an attacker can enter SQL code into that query and the application would take the attacker's code and execute it on the database."

🇻🇳 **Dịch**
> "Một lỗ hổng SQL injection phổ biến trong Java được trình bày dưới đây. Bởi vì tham số "customerName" chưa được validate bị nối thẳng vào query, kẻ tấn công có thể nhập code SQL vào query đó và ứng dụng sẽ lấy code của kẻ tấn công rồi thực thi nó trên database."

📖 **Nguyên văn** — code mẫu của OWASP
> ```java
> String query = "SELECT account_balance FROM user_data WHERE user_name = "
>              + request.getParameter("customerName");
> try {
>     Statement statement = connection.createStatement( ... );
>     ResultSet results = statement.executeQuery( query );
> }
>
> ...
> ```

🇻🇳 Đoạn Java trên nối thẳng giá trị `customerName` (do người dùng gửi lên) vào chuỗi SQL rồi chạy bằng `Statement` — câu lệnh và dữ liệu bị trộn chung thành một chuỗi duy nhất.

### Cùng lỗi đó viết bằng JavaScript

> [!warning] ⚠️ Đoạn code dưới đây là **ví dụ minh hoạ tự viết**, KHÔNG trích từ OWASP hay PostgreSQL Docs
> Mục đích: dịch nguyên lý của OWASP sang stack JavaScript cho dễ nhận mặt trong code hằng ngày.

```js
// ❌ ví dụ minh hoạ tự viết — SAI, đây chính là pattern OWASP bảo phải bỏ
async function findCustomer(pool, customerName) {
  const sql = "SELECT account_balance FROM user_data WHERE user_name = '" + customerName + "'";
  const result = await pool.query(sql);   // câu lệnh và dữ liệu đã dính làm một
  return result.rows;
}
```

Vấn đề nằm ở chỗ: đến lúc `pool.query(sql)` được gọi, PostgreSQL **chỉ nhận được một chuỗi văn bản duy nhất**. Nó không có cách nào biết đoạn nào vốn là câu lệnh do developer viết, đoạn nào vốn là dữ liệu người dùng gõ vào. Nếu trong `customerName` có ký tự nháy đơn, ranh giới chuỗi bị vỡ và phần còn lại của giá trị được parser đọc như **cú pháp SQL**, không phải như dữ liệu.

OWASP minh hoạ đúng ranh giới này bằng một giá trị input rất kinh điển:

📖 **Nguyên văn**
> "In the safe Java example below, if an attacker were to enter the userID as `tom' or '1'='1`, the parameterized query would look for a username that literally matches the entire string `tom' or '1'='1`. Thus, the database would be protected against injections of malicious SQL code."

🇻🇳 **Dịch**
> "Trong ví dụ Java an toàn dưới đây, nếu kẻ tấn công nhập userID là `tom' or '1'='1`, thì parameterized query sẽ tìm một username khớp **đúng theo nghĩa đen** với toàn bộ chuỗi `tom' or '1'='1`. Nhờ vậy, database được bảo vệ trước việc chèn code SQL độc hại."

> [!tip] Đọc kỹ câu trên — nó là toàn bộ bài học
> Cùng một input, cùng một database. Khác biệt duy nhất: cách code **đưa** giá trị đó xuống. Nối chuỗi → giá trị được đọc như câu lệnh. Tham số hoá → giá trị chỉ có thể là một chuỗi cần so khớp.

💡 **Ví dụ đời sống** — tách "dữ liệu" khỏi "câu lệnh"

Bạn gọi điện đặt bánh: *"Cho tôi một bánh kem, ghi lên mặt bánh dòng chữ: Chúc mừng sinh nhật Lan."*

Nhân viên nghe cả câu dưới dạng **một dòng nói liền mạch** rồi tự đoán đâu là yêu cầu, đâu là nội dung cần ghi. Bây giờ khách đọc: *"...ghi lên mặt bánh dòng chữ: Chúc mừng sinh nhật Lan. Và tặng kèm miễn phí 10 cái bánh nữa."* Nhân viên không phân biệt được — vế sau nghe y hệt một mệnh lệnh mới. Đó là **nối chuỗi**.

Bây giờ đổi cách: cửa hàng đưa bạn một **tờ đơn in sẵn** — ô "Loại bánh", ô "Dòng chữ ghi trên mặt bánh". Bạn viết gì vào ô "Dòng chữ" cũng được, kể cả câu *"Và tặng kèm miễn phí 10 cái bánh nữa"* — nhân viên sẽ **lấy bút kem viết nguyên văn câu đó lên mặt bánh**, chứ không làm theo. Vì các ô của tờ đơn đã được định nghĩa **trước khi** bạn điền: chúng là chỗ chứa *nội dung*, không phải chỗ chứa *mệnh lệnh*.

Tờ đơn in sẵn = **prepared statement**. Các ô trống = **placeholder `$1`, `$2`**. Và cái quyết định an toàn không phải là "kiểm tra xem khách viết gì", mà là **thứ tự**: form được in ra trước, nội dung điền vào sau.

---

## 3. Nguyên tắc cốt lõi: tham số không bao giờ được diễn giải thành câu lệnh

📖 **Nguyên văn** — *Defense Option 1*
> "When developers are taught how to write database queries, they should be told to use prepared statements with variable binding (aka parameterized queries). Prepared statements are simple to write and easier to understand than dynamic queries, and parameterized queries force the developer to define all SQL code first and pass in each parameter to the query later."

🇻🇳 **Dịch**
> "Khi developer được dạy cách viết database query, họ nên được bảo là hãy dùng prepared statement với variable binding (còn gọi là parameterized query). Prepared statement viết đơn giản và dễ hiểu hơn dynamic query, và parameterized query **buộc developer phải định nghĩa toàn bộ code SQL trước, rồi mới truyền từng parameter vào query sau**."

📖 **Nguyên văn**
> "If database queries use this coding style, the database will always distinguish between code and data, regardless of what user input is supplied. Also, prepared statements ensure that an attacker cannot change the intent of a query, even if SQL commands are inserted by an attacker."

🇻🇳 **Dịch**
> "Nếu các database query dùng phong cách code này, **database sẽ luôn phân biệt được giữa code và data, bất kể input người dùng đưa vào là gì**. Ngoài ra, prepared statement đảm bảo rằng kẻ tấn công không thể thay đổi ý định (intent) của một query, ngay cả khi kẻ tấn công có chèn các câu lệnh SQL vào."

> [!danger] Đây là nguyên tắc sống còn của cả bài
> Hai chữ khoá: **"define all SQL code first"** và **"distinguish between code and data"**.
> Câu lệnh được gửi xuống server và được parse **trước**, khi chưa có giá trị nào. Giá trị đi xuống sau, theo một kênh riêng, và tại thời điểm đó cấu trúc câu lệnh đã cố định — không còn chỗ nào để một giá trị "trở thành" cú pháp nữa.
> Vì vậy: **không escape cho khéo hơn, mà là đừng nối chuỗi nữa.**

PostgreSQL nói cùng một điều ở tầng driver (libpq):

📖 **Nguyên văn** — PostgreSQL Docs, `PQexecParams`
> "The primary advantage of `PQexecParams` over `PQexec` is that parameter values can be separated from the command string, thus avoiding the need for tedious and error-prone quoting and escaping."

🇻🇳 **Dịch**
> "Lợi thế chính của `PQexecParams` so với `PQexec` là **các giá trị parameter có thể được tách khỏi chuỗi câu lệnh**, nhờ đó tránh được việc quoting và escaping vốn rườm rà và dễ sai."

📖 **Nguyên văn**
> "Unlike `PQexec`, `PQexecParams` allows at most one SQL command in the given string. (There can be semicolons in it, but not more than one nonempty command.) This is a limitation of the underlying protocol, but has some usefulness as an extra defense against SQL-injection attacks."

🇻🇳 **Dịch**
> "Khác với `PQexec`, `PQexecParams` chỉ cho phép **nhiều nhất một câu lệnh SQL** trong chuỗi được đưa vào. (Trong đó có thể có dấu chấm phẩy, nhưng không được quá một câu lệnh khác rỗng.) Đây là giới hạn của protocol bên dưới, nhưng lại có ích như một lớp phòng thủ bổ sung chống lại tấn công SQL injection."

📖 **Nguyên văn** — chữ ký hàm `PQexecParams`
> ```c
> PGresult *PQexecParams(PGconn *conn,
>                        const char *command,
>                        int nParams,
>                        const Oid *paramTypes,
>                        const char * const *paramValues,
>                        const int *paramLengths,
>                        const int *paramFormats,
>                        int resultFormat);
> ```

🇻🇳 Chữ ký hàm cho thấy rõ sự tách bạch: `command` (chuỗi câu lệnh) là **một tham số riêng**, còn `paramValues` (mảng giá trị) là **một tham số khác** — chúng đi xuống server qua hai đường, không bao giờ được ghép chuỗi ở phía client.

📖 **Nguyên văn** — PostgreSQL Docs, mục `PQescapeStringConn` / Tip
> "It is especially important to do proper escaping when handling strings that were received from an untrustworthy source. Otherwise there is a security risk: you are vulnerable to “SQL injection” attacks wherein unwanted SQL commands are fed to your database."
>
> "Note that it is neither necessary nor correct to do escaping when a data value is passed as a separate parameter in `PQexecParams` or its sibling routines."

🇻🇳 **Dịch**
> "Đặc biệt quan trọng là phải escape cho đúng khi xử lý các chuỗi nhận từ nguồn không đáng tin. Nếu không sẽ có rủi ro bảo mật: bạn bị tổn thương trước các tấn công “SQL injection”, trong đó những câu lệnh SQL không mong muốn được đưa vào database của bạn."
>
> "Lưu ý rằng **việc escape là không cần thiết và cũng không đúng** khi một giá trị dữ liệu được truyền như một parameter riêng trong `PQexecParams` hoặc các hàm anh em của nó."

> [!tip] Câu thứ hai đáng dán lên màn hình
> Escape **và** tham số hoá cùng lúc không phải là "an toàn gấp đôi" — PostgreSQL nói thẳng nó là **sai**. Đã tham số hoá thì thôi escape; giá trị sẽ bị double-escape và dữ liệu lưu xuống sẽ méo.

---

## 4. Bốn Primary Defenses của OWASP, đúng thứ tự ưu tiên

📖 **Nguyên văn** — *Primary Defenses*
> - "**Option 1: Use of Prepared Statements (with Parameterized Queries)**
> - **Option 2: Use of Properly Constructed Stored Procedures**
> - **Option 3: Allow-list Input Validation**
> - **Option 4: STRONGLY DISCOURAGED: Escaping All User Supplied Input**"

🇻🇳 **Dịch**
> - "**Lựa chọn 1: Dùng Prepared Statement (với Parameterized Query)**
> - **Lựa chọn 2: Dùng Stored Procedure được xây dựng đúng cách**
> - **Lựa chọn 3: Allow-list Input Validation**
> - **Lựa chọn 4: CỰC KỲ KHÔNG KHUYẾN KHÍCH: Escape toàn bộ input do người dùng cung cấp**"

> [!warning] Thứ tự này không phải danh sách "chọn cái nào cũng được"
> Nó là thứ tự **ưu tiên**. Option 1 là mặc định. Option 3 chỉ dành cho những chỗ Option 1 **không dùng được về mặt kỹ thuật** (xem mục 6). Option 4 được chính OWASP viết hoa là STRONGLY DISCOURAGED.

### Option 1 — Prepared Statements (with Parameterized Queries)

📖 **Nguyên văn** — code mẫu Java của OWASP
> ```java
> // This should REALLY be validated too
> String custname = request.getParameter("customerName");
> // Perform input validation to detect attacks
> String query = "SELECT account_balance FROM user_data WHERE user_name = ? ";
> PreparedStatement pstmt = connection.prepareStatement( query );
> pstmt.setString( 1, custname);
> ResultSet results = pstmt.executeQuery( );
> ```

🇻🇳 Chuỗi SQL được viết **trọn vẹn với dấu `?`** làm chỗ trống, đưa cho `prepareStatement` trước; giá trị `custname` chỉ được gắn vào sau bằng `setString`, nên nó không bao giờ tham gia vào việc parse cú pháp.

📖 **Nguyên văn**
> "While we have shown examples in Java and .NET, practically all other languages (including Cold Fusion and Classic ASP) support parameterized query interfaces."

🇻🇳 **Dịch**
> "Dù chúng tôi trình bày ví dụ bằng Java và .NET, **gần như mọi ngôn ngữ khác** (kể cả Cold Fusion và Classic ASP) đều hỗ trợ các interface parameterized query."

📖 **Nguyên văn**
> "Generally, developers like prepared statements because all the SQL code stays within the application, which makes applications relatively database independent."

🇻🇳 **Dịch**
> "Nhìn chung, developer thích prepared statement vì toàn bộ code SQL nằm trong ứng dụng, khiến ứng dụng tương đối độc lập với database."

### Option 2 — Stored Procedures

📖 **Nguyên văn**
> "Though stored procedures are not always safe from SQL injection, developers can use certain standard stored procedure programming constructs. This approach has the same effect as using parameterized queries, as long as the stored procedures are implemented safely (which is the norm for most stored procedure languages)."

🇻🇳 **Dịch**
> "Mặc dù stored procedure không phải lúc nào cũng an toàn trước SQL injection, developer có thể dùng một số cấu trúc lập trình stored procedure tiêu chuẩn. Cách tiếp cận này có hiệu quả tương đương với việc dùng parameterized query, **miễn là các stored procedure được hiện thực một cách an toàn** (vốn là chuẩn mực với hầu hết các ngôn ngữ stored procedure)."

📖 **Nguyên văn**
> "The difference between prepared statements and stored procedures is that the SQL code for a stored procedure is defined and stored in the database itself, then called from the application. Since prepared statements and safe stored procedures are equally effective in preventing SQL injection, your organization should choose the approach that makes the most sense for you."

🇻🇳 **Dịch**
> "Khác biệt giữa prepared statement và stored procedure là code SQL của stored procedure được định nghĩa và lưu **ngay trong database**, rồi được gọi từ ứng dụng. Vì prepared statement và stored procedure an toàn có hiệu quả **ngang nhau** trong việc ngăn SQL injection, tổ chức của bạn nên chọn cách nào hợp lý nhất với mình."

📖 **Nguyên văn** — *When Stored Procedures Can Increase Risk*
> "However, stored procedures require execute rights, a role not available by default. In some setups where user management has been centralized, but is limited to those 3 roles, web apps would have to run as `db_owner` so stored procedures could work. Naturally, that means that if a server is breached, the attacker has full rights to the database, where previously, they might only have had read-access."

🇻🇳 **Dịch**
> "Tuy nhiên, stored procedure đòi hỏi quyền execute, một role không có sẵn theo mặc định. Trong một số cấu hình nơi việc quản lý user đã bị tập trung hoá nhưng lại giới hạn ở 3 role đó, web app sẽ phải chạy dưới quyền `db_owner` thì stored procedure mới hoạt động. Dĩ nhiên, điều đó có nghĩa là nếu server bị xâm nhập, kẻ tấn công có **toàn quyền** trên database, trong khi trước đó chúng có thể chỉ có quyền đọc."

> [!warning] Bẫy đánh đổi
> Dùng stored procedure để chống injection nhưng lại phải nâng quyền app lên `db_owner` thì bạn vừa vá một lỗ và vừa khoét một lỗ to hơn. Xem mục 7 — Least Privilege.

### Option 3 — Allow-list Input Validation

📖 **Nguyên văn**
> "If you are faced with parts of SQL queries that can't use bind variables, such as table names, column names, or sort order indicators (ASC or DESC), input validation or query redesign is the most appropriate defense. When table or column names are needed, ideally those values come from the code and not from user parameters."

🇻🇳 **Dịch**
> "Nếu bạn gặp những phần của câu SQL **không thể dùng bind variable**, chẳng hạn tên bảng, tên cột, hoặc chỉ định thứ tự sắp xếp (ASC hay DESC), thì input validation hoặc thiết kế lại query là biện pháp phòng thủ phù hợp nhất. Khi cần tên bảng hay tên cột, lý tưởng nhất là **các giá trị đó đến từ code chứ không phải từ tham số người dùng**."

📖 **Nguyên văn** — *Sample Of Safe Table Name Validation*
> "WARNING: Using user parameter values to target table or column names is a symptom of poor design and a full rewrite should be considered if time allows. If that is not possible, developers should map the parameter values to the legal/expected table or column names to make sure unvalidated user input doesn't end up in the query."

🇻🇳 **Dịch**
> "CẢNH BÁO: Việc dùng giá trị tham số của người dùng để chỉ định tên bảng hay tên cột là **triệu chứng của thiết kế tồi**, và nên cân nhắc viết lại hoàn toàn nếu thời gian cho phép. Nếu không thể, developer nên **ánh xạ (map)** các giá trị tham số sang những tên bảng/tên cột hợp lệ và được mong đợi, để chắc chắn input chưa validate không lọt vào query."

📖 **Nguyên văn** — code mẫu allow-list của OWASP
> ```text
> String tableName;
> switch(PARAM):
>   case "Value1": tableName = "fooTable";
>                  break;
>   case "Value2": tableName = "barTable";
>                  break;
>   ...
>   default      : throw new InputValidationException("unexpected value provided"
>                                                   + " for table name");
> ```

🇻🇳 Đây là **allow-list**: input của người dùng không bao giờ đi vào query; nó chỉ được dùng để **chọn** một trong các tên bảng đã viết cứng trong code, và mọi giá trị lạ đều ném exception.

📖 **Nguyên văn** — *Sample of Safer Dynamic Query Generation (DISCOURAGED)*
> "For something simple like a sort order, it is best if the user supplied input is converted to a boolean, and then that boolean is used to select the safe value to append to the query. This is a very standard need in dynamic query creation."
>
> ```java
> public String someMethod(boolean sortOrder) {
>  String SQLquery = "some SQL ... order by Salary " + (sortOrder ? "ASC" : "DESC");
>  ...
> ```

🇻🇳 **Dịch**
> "Với thứ đơn giản như sort order, tốt nhất là input người dùng được **chuyển thành boolean**, rồi boolean đó được dùng để chọn giá trị an toàn để nối vào query. Đây là nhu cầu rất tiêu chuẩn khi tạo dynamic query."
>
> 🇻🇳 Đoạn code: chuỗi nối vào query chỉ có thể là `"ASC"` hoặc `"DESC"` — hai hằng số viết cứng — vì thứ điều khiển nó là một `boolean`, không phải chuỗi người dùng.

📖 **Nguyên văn**
> "Any time user input can be converted to a non-String, like a date, numeric, boolean, enumerated type, etc. before it is appended to a query, or used to select a value to append to the query, this ensures it is safe to do so."
>
> "Input validation is also recommended as a secondary defense in ALL cases, even when using bind variables as discussed earlier in this article."

🇻🇳 **Dịch**
> "Bất cứ khi nào input người dùng có thể được chuyển sang kiểu không phải String — như date, numeric, boolean, enumerated type, v.v. — trước khi nối vào query hoặc dùng để chọn giá trị nối vào query, thì điều đó đảm bảo việc làm này là an toàn."
>
> "Input validation cũng được khuyến nghị như một phòng thủ thứ cấp trong **MỌI** trường hợp, kể cả khi đã dùng bind variable như đã bàn ở phần trước của bài viết này."

### Option 4 — Escaping All User-Supplied Input (OWASP xếp cuối và không khuyến khích)

📖 **Nguyên văn** — tiêu đề mục nguyên văn: *Defense Option 4: STRONGLY DISCOURAGED: Escaping All User-Supplied Input*
> "In this approach, the developer will escape all user input before putting it in a query. It is very database specific in its implementation.  This methodology is fragile compared to other defenses, and we CANNOT guarantee that this option will prevent all SQL injections in all situations."

🇻🇳 **Dịch**
> "Trong cách tiếp cận này, developer sẽ escape toàn bộ input người dùng trước khi đưa vào query. Cách hiện thực của nó rất phụ thuộc vào từng database cụ thể. **Phương pháp luận này mong manh (fragile) so với các biện pháp phòng thủ khác, và chúng tôi KHÔNG THỂ đảm bảo rằng lựa chọn này sẽ ngăn được mọi SQL injection trong mọi tình huống.**"

📖 **Nguyên văn**
> "If an application is built from scratch or requires low risk tolerance, it should be built or re-written using parameterized queries, stored procedures, or some kind of Object Relational Mapper (ORM) that builds your queries for you."

🇻🇳 **Dịch**
> "Nếu một ứng dụng được xây từ đầu hoặc đòi hỏi mức chấp nhận rủi ro thấp, thì nó **nên được xây hoặc viết lại** bằng parameterized query, stored procedure, hoặc một loại Object Relational Mapper (ORM) nào đó tự dựng query cho bạn."

> [!danger] Đọc lại chữ in hoa của OWASP
> "we **CANNOT** guarantee that this option will prevent all SQL injections in all situations."
> Escaping là lựa chọn cuối cùng, dành cho code cũ không sửa được kiến trúc — không phải lựa chọn của code mới.

---

## 5. PREPARE / EXECUTE trong PostgreSQL

Ở tầng SQL, PostgreSQL cho phép tạo prepared statement trực tiếp bằng lệnh `PREPARE`.

📖 **Nguyên văn** — PostgreSQL Docs, `PREPARE` — Synopsis
> ```sql
> PREPARE name [ ( data_type [, ...] ) ] AS statement
> ```

🇻🇳 Cú pháp: đặt tên cho prepared statement, khai báo (tuỳ chọn) kiểu dữ liệu của các tham số, rồi sau `AS` là câu lệnh SQL có chứa các placeholder.

📖 **Nguyên văn** — *Description*
> "`PREPARE` creates a prepared statement. A prepared statement is a server-side object that can be used to optimize performance. When the `PREPARE` statement is executed, the specified statement is parsed, analyzed, and rewritten. When an `EXECUTE` command is subsequently issued, the prepared statement is planned and executed. This division of labor avoids repetitive parse analysis work, while allowing the execution plan to depend on the specific parameter values supplied."

🇻🇳 **Dịch**
> "`PREPARE` tạo ra một prepared statement. Prepared statement là một **đối tượng phía server** có thể dùng để tối ưu hiệu năng. Khi câu lệnh `PREPARE` được thực thi, câu lệnh chỉ định sẽ được **parse, analyze và rewrite**. Khi sau đó một lệnh `EXECUTE` được phát ra, prepared statement mới được lập plan và thực thi. Sự phân chia công việc này tránh được việc phải làm lại phân tích cú pháp lặp đi lặp lại, đồng thời vẫn cho phép execution plan phụ thuộc vào các giá trị parameter cụ thể được cung cấp."

> [!tip] Chú ý trật tự thời gian trong đoạn trên
> "the specified statement is **parsed**, analyzed, and rewritten" xảy ra ở bước `PREPARE` — **khi chưa có giá trị nào**. Đến `EXECUTE`, cấu trúc câu lệnh đã đóng băng. Đây chính là cơ chế kỹ thuật đứng sau câu "database will always distinguish between code and data" của OWASP ở mục 3.

📖 **Nguyên văn**
> "Prepared statements can take parameters: values that are substituted into the statement when it is executed. When creating the prepared statement, refer to parameters by position, using `$1`, `$2`, etc. A corresponding list of parameter data types can optionally be specified. When a parameter's data type is not specified or is declared as `unknown`, the type is inferred from the context in which the parameter is first referenced (if possible). When executing the statement, specify the actual values for these parameters in the `EXECUTE` statement."

🇻🇳 **Dịch**
> "Prepared statement có thể nhận parameter: những giá trị được thay vào câu lệnh **khi nó được thực thi**. Khi tạo prepared statement, hãy tham chiếu tới parameter **theo vị trí**, dùng `$1`, `$2`, v.v. Một danh sách kiểu dữ liệu tương ứng của các parameter có thể được chỉ định tuỳ ý. Khi kiểu dữ liệu của một parameter không được chỉ định hoặc được khai là `unknown`, kiểu sẽ được suy ra từ ngữ cảnh nơi parameter đó được tham chiếu lần đầu (nếu có thể). Khi thực thi câu lệnh, hãy chỉ định các giá trị thực tế cho những parameter này trong câu lệnh `EXECUTE`."

📖 **Nguyên văn** — *Parameters* → `statement`
> "Any `SELECT`, `INSERT`, `UPDATE`, `DELETE`, `MERGE`, or `VALUES` statement."

🇻🇳 **Dịch**
> "Bất kỳ câu lệnh `SELECT`, `INSERT`, `UPDATE`, `DELETE`, `MERGE`, hay `VALUES` nào."

📖 **Nguyên văn** — *Examples*
> "Create a prepared statement for an `INSERT` statement, and then execute it:"
>
> ```sql
> PREPARE fooplan (int, text, bool, numeric) AS
>     INSERT INTO foo VALUES($1, $2, $3, $4);
> EXECUTE fooplan(1, 'Hunter Valley', 't', 200.00);
> ```

🇻🇳 **Dịch**
> "Tạo một prepared statement cho một câu lệnh `INSERT`, rồi thực thi nó:"
>
> 🇻🇳 Câu lệnh `INSERT` được khai báo trước với 4 chỗ trống `$1`–`$4` và kiểu tương ứng `(int, text, bool, numeric)`; `EXECUTE` chỉ việc đưa 4 giá trị vào. Xem thêm [[08 - INSERT, UPDATE, DELETE]].

📖 **Nguyên văn** — *Examples* (tiếp)
> "Create a prepared statement for a `SELECT` statement, and then execute it:"
>
> ```sql
> PREPARE usrrptplan (int) AS
>     SELECT * FROM users u, logs l WHERE u.usrid=$1 AND u.usrid=l.usrid
>     AND l.date = $2;
> EXECUTE usrrptplan(1, current_date);
> ```
>
> "In this example, the data type of the second parameter is not specified, so it is inferred from the context in which `$2` is used."

🇻🇳 **Dịch**
> "Tạo một prepared statement cho một câu lệnh `SELECT`, rồi thực thi nó:"
>
> "Trong ví dụ này, kiểu dữ liệu của parameter thứ hai không được chỉ định, nên nó được suy ra từ ngữ cảnh nơi `$2` được dùng."
>
> 🇻🇳 Câu `SELECT` này join `users` với `logs` (xem [[03 - Queries - SELECT, JOIN, Aggregate]]); hai giá trị lọc nằm ở `$1` và `$2`, không có chỗ nào là chuỗi được nối vào.

📖 **Nguyên văn** — *Notes* (vòng đời)
> "Prepared statements only last for the duration of the current database session. When the session ends, the prepared statement is forgotten, so it must be recreated before being used again. This also means that a single prepared statement cannot be used by multiple simultaneous database clients; however, each client can create their own prepared statement to use. Prepared statements can be manually cleaned up using the `DEALLOCATE` command."

🇻🇳 **Dịch**
> "Prepared statement chỉ tồn tại trong suốt thời gian của **session database hiện tại**. Khi session kết thúc, prepared statement bị quên đi, nên phải tạo lại trước khi dùng tiếp. Điều này cũng có nghĩa là một prepared statement đơn lẻ không thể được dùng bởi nhiều database client đồng thời; tuy nhiên, mỗi client có thể tự tạo prepared statement riêng của mình. Prepared statement có thể được dọn dẹp thủ công bằng lệnh `DEALLOCATE`."

> [!note] Đừng nhầm hai thứ tên giống nhau
> Lệnh SQL `PREPARE`/`EXECUTE` ở trên là công cụ **ở tầng session** — hữu ích khi chạy tay trong `psql` hoặc khi cần ép plan. Trong ứng dụng, bạn hầu như không gõ `PREPARE`; bạn gọi API tham số hoá của driver (ví dụ `PQexecParams` ở mục 3), và driver lo phần giao thức bên dưới. Lợi ích bảo mật là như nhau: **câu lệnh đi một đường, giá trị đi một đường.**

📖 **Nguyên văn** — PostgreSQL Docs, PL/pgSQL, *Executing Dynamic Commands* — Note
> "The PL/pgSQL `EXECUTE` statement is not related to the `EXECUTE` SQL statement supported by the PostgreSQL server. The server's `EXECUTE` statement cannot be used directly within PL/pgSQL functions (and is not needed)."

🇻🇳 **Dịch**
> "Câu lệnh `EXECUTE` của PL/pgSQL **không liên quan** tới câu lệnh SQL `EXECUTE` mà PostgreSQL server hỗ trợ. Câu lệnh `EXECUTE` của server không thể dùng trực tiếp bên trong các function PL/pgSQL (và cũng không cần thiết)."

---

## 6. Khi KHÔNG tham số hoá được: tên bảng, tên cột, ORDER BY động

Đây là chỗ nhiều developer bị kẹt: gắn `$1` vào chỗ tên bảng thì query báo lỗi cú pháp. PostgreSQL giải thích thẳng vì sao.

📖 **Nguyên văn** — PL/pgSQL, *Executing Dynamic Commands*
> "The command string can use parameter values, which are referenced in the command as `$1`, `$2`, etc. These symbols refer to values supplied in the `USING` clause. This method is often preferable to inserting data values into the command string as text: it avoids run-time overhead of converting the values to text and back, and **it is much less prone to SQL-injection attacks since there is no need for quoting or escaping**."
>
> ```sql
> EXECUTE 'SELECT count(*) FROM mytable WHERE inserted_by = $1 AND inserted <= $2'
>    INTO c
>    USING checked_user, checked_date;
> ```

🇻🇳 **Dịch**
> "Chuỗi câu lệnh có thể dùng các giá trị parameter, được tham chiếu trong câu lệnh dưới dạng `$1`, `$2`, v.v. Những ký hiệu này trỏ tới các giá trị cung cấp trong mệnh đề `USING`. Phương pháp này thường được ưa chuộng hơn việc chèn giá trị dữ liệu vào chuỗi câu lệnh dưới dạng text: nó tránh được chi phí run-time của việc chuyển giá trị sang text rồi ngược lại, và **ít bị tấn công SQL-injection hơn nhiều vì không cần quoting hay escaping**."

📖 **Nguyên văn** — câu quan trọng nhất của mục này
> "Note that parameter symbols can only be used for **data values** — if you want to use dynamically determined table or column names, you must insert them into the command string textually. For example, if the preceding query needed to be done against a dynamically selected table, you could do this:"
>
> ```sql
> EXECUTE 'SELECT count(*) FROM '
>     || quote_ident(tabname)
>     || ' WHERE inserted_by = $1 AND inserted <= $2'
>    INTO c
>    USING checked_user, checked_date;
> ```

🇻🇳 **Dịch**
> "Lưu ý rằng các ký hiệu parameter **chỉ có thể dùng cho giá trị dữ liệu (data values)** — nếu bạn muốn dùng tên bảng hay tên cột được xác định động, bạn **buộc phải chèn chúng vào chuỗi câu lệnh dưới dạng văn bản**. Ví dụ, nếu query phía trên cần chạy trên một bảng được chọn động, bạn có thể làm thế này:"
>
> 🇻🇳 Đoạn SQL: tên bảng `tabname` được đưa qua `quote_ident()` rồi mới nối vào chuỗi; còn hai giá trị lọc vẫn giữ nguyên dạng tham số `$1`, `$2` truyền qua `USING`.

> [!warning] Tại sao placeholder không dùng được ở đó — lý do kỹ thuật
> Quay lại mục 5: `PREPARE` **parse và analyze câu lệnh trước**, khi chưa có giá trị. Muốn analyze được, planner phải biết câu lệnh đọc bảng nào, cột nào, kiểu gì. Nếu tên bảng còn là ẩn số thì **không có câu lệnh nào để phân tích cả** — chính cái thứ tự đã bảo vệ bạn ở giá trị dữ liệu lại khiến identifier không thể là tham số.
> Nói gọn: placeholder là **chỗ trống trong một cấu trúc đã cố định**. Tên bảng, tên cột, `ASC`/`DESC` **chính là cấu trúc** — chúng không thể vừa là cấu trúc vừa là chỗ trống.

📖 **Nguyên văn**
> "Another restriction on parameter symbols is that they only work in optimizable SQL commands (`SELECT`, `INSERT`, `UPDATE`, `DELETE`, `MERGE`, and certain commands containing one of these). In other statement types (generically called utility statements), you must insert values textually even if they are just data values."

🇻🇳 **Dịch**
> "Một hạn chế khác của các ký hiệu parameter là chúng chỉ hoạt động trong những câu lệnh SQL **optimizable** (`SELECT`, `INSERT`, `UPDATE`, `DELETE`, `MERGE`, và một số câu lệnh chứa các lệnh này). Trong các loại câu lệnh khác (gọi chung là utility statement), bạn buộc phải chèn giá trị dưới dạng văn bản ngay cả khi chúng chỉ là giá trị dữ liệu."

### Cách xử lý đúng: allow-list trước, `quote_ident`/`format %I` sau

📖 **Nguyên văn** — PL/pgSQL, cách sạch hơn
> "A cleaner approach is to use `format()`'s `%I` specification to insert table or column names with automatic quoting:"
>
> ```sql
> EXECUTE format('SELECT count(*) FROM %I '
>    'WHERE inserted_by = $1 AND inserted <= $2', tabname)
>    INTO c
>    USING checked_user, checked_date;
> ```
>
> "(This example relies on the SQL rule that string literals separated by a newline are implicitly concatenated.)"

🇻🇳 **Dịch**
> "Một cách tiếp cận sạch hơn là dùng đặc tả `%I` của `format()` để chèn tên bảng hoặc tên cột với việc quoting tự động:"
>
> "(Ví dụ này dựa trên quy tắc SQL rằng các string literal cách nhau bởi một dòng mới thì được nối ngầm định với nhau.)"
>
> 🇻🇳 Đoạn SQL: `%I` lo phần tên bảng (identifier), `USING` lo phần giá trị — hai loại nội dung đi qua hai cơ chế khác nhau, đúng như bản chất của chúng.

📖 **Nguyên văn** — Example 41.1. *Quoting Values in Dynamic Queries*
> "This example demonstrates the use of the `quote_ident` and `quote_literal` functions (see Section 9.4). For safety, expressions containing column or table identifiers should be passed through `quote_ident` before insertion in a dynamic query. Expressions containing values that should be literal strings in the constructed command should be passed through `quote_literal`. These functions take the appropriate steps to return the input text enclosed in double or single quotes respectively, with any embedded special characters properly escaped."

🇻🇳 **Dịch**
> "Ví dụ này minh hoạ việc dùng các hàm `quote_ident` và `quote_literal` (xem Section 9.4). **Để an toàn, các biểu thức chứa identifier của cột hoặc bảng nên được đưa qua `quote_ident` trước khi chèn vào một dynamic query.** Các biểu thức chứa giá trị vốn phải là literal string trong câu lệnh được dựng nên thì nên đưa qua `quote_literal`. Những hàm này thực hiện các bước thích hợp để trả về văn bản đầu vào được bao trong dấu nháy kép hoặc nháy đơn tương ứng, với mọi ký tự đặc biệt bên trong được escape đúng cách."

📖 **Nguyên văn** — PostgreSQL Docs, String Functions, `quote_ident` / `quote_literal`
> "`quote_ident ( text ) → text`
> Returns the given string suitably quoted to be used as an identifier in an SQL statement string. Quotes are added only if necessary (i.e., if the string contains non-identifier characters or would be case-folded). Embedded quotes are properly doubled."
>
> "`quote_literal ( text ) → text`
> Returns the given string suitably quoted to be used as a string literal in an SQL statement string. Embedded single-quotes and backslashes are properly doubled. Note that `quote_literal` returns null on null input; if the argument might be null, `quote_nullable` is often more suitable."

🇻🇳 **Dịch**
> "`quote_ident ( text ) → text`
> Trả về chuỗi đã cho được quote thích hợp để dùng làm **identifier** trong một chuỗi câu lệnh SQL. Dấu nháy chỉ được thêm khi cần thiết (tức là khi chuỗi chứa ký tự không hợp lệ cho identifier hoặc sẽ bị case-fold). Các dấu nháy nằm bên trong được nhân đôi đúng cách."
>
> "`quote_literal ( text ) → text`
> Trả về chuỗi đã cho được quote thích hợp để dùng làm **string literal** trong một chuỗi câu lệnh SQL. Các dấu nháy đơn và dấu gạch chéo ngược bên trong được nhân đôi đúng cách. Lưu ý rằng `quote_literal` trả về null với input null; nếu tham số có thể là null, `quote_nullable` thường phù hợp hơn."

📖 **Nguyên văn** — String Functions, đặc tả `%I` và `%L` của `format()`
> "`I` treats the argument value as an SQL identifier, double-quoting it if necessary. It is an error for the value to be null (equivalent to `quote_ident`)."
>
> "`L` quotes the argument value as an SQL literal. A null value is displayed as the string `NULL`, without quotes (equivalent to `quote_nullable`)."
>
> "The `%I` and `%L` format specifiers are particularly useful for safely constructing dynamic SQL statements. See Example 41.1."

🇻🇳 **Dịch**
> "`I` xử lý giá trị tham số như một **SQL identifier**, thêm dấu nháy kép nếu cần. Giá trị null sẽ gây lỗi (tương đương `quote_ident`)."
>
> "`L` quote giá trị tham số như một **SQL literal**. Giá trị null được hiển thị thành chuỗi `NULL`, không có dấu nháy (tương đương `quote_nullable`)."
>
> "Các format specifier `%I` và `%L` **đặc biệt hữu ích cho việc dựng câu lệnh SQL động một cách an toàn**. Xem Example 41.1."

📖 **Nguyên văn** — String Functions, ví dụ `format()`
> ```sql
> SELECT format('INSERT INTO %I VALUES(%L)', 'Foo bar', E'O\'Reilly');
> Result: INSERT INTO "Foo bar" VALUES('O''Reilly')
>
> SELECT format('INSERT INTO %I VALUES(%L)', 'locations', 'C:\Program Files');
> Result: INSERT INTO locations VALUES('C:\Program Files')
> ```

🇻🇳 Kết quả cho thấy rõ: `%I` bao tên bảng `Foo bar` bằng nháy kép vì nó có khoảng trắng, còn `locations` thì để nguyên; `%L` nhân đôi dấu nháy trong `O'Reilly` thành `O''Reilly` để nó vẫn là **một chuỗi dữ liệu**, không phá vỡ câu lệnh.

📖 **Nguyên văn** — kết luận của Example 41.1 về thứ tự ưu tiên
> "`%I` is equivalent to `quote_ident`, and `%L` is equivalent to `quote_nullable`. The `format` function can be used in conjunction with the `USING` clause:"
>
> ```sql
> EXECUTE format('UPDATE tbl SET %I = $1 WHERE key = $2', colname)
>    USING newvalue, keyvalue;
> ```
>
> "This form is better because the variables are handled in their native data type format, rather than unconditionally converting them to text and quoting them via `%L`. It is also more efficient."

🇻🇳 **Dịch**
> "`%I` tương đương `quote_ident`, và `%L` tương đương `quote_nullable`. Hàm `format` có thể được dùng kết hợp với mệnh đề `USING`:"
>
> "**Dạng này tốt hơn** vì các biến được xử lý theo đúng định dạng kiểu dữ liệu gốc của chúng, thay vì bị chuyển vô điều kiện sang text rồi quote qua `%L`. Nó cũng hiệu quả hơn."

> [!tip] Công thức cuối cùng cho query có phần động
> 1. **Giá trị dữ liệu** → luôn luôn là tham số (`$1`, `$2` / `USING` / API driver). Không ngoại lệ.
> 2. **Tên bảng, tên cột** → allow-list trong code trước (Option 3 của OWASP: *"ideally those values come from the code and not from user parameters"*), rồi mới `format('%I', ...)`.
> 3. **`ORDER BY` động, `ASC`/`DESC`** → không bao giờ nối chuỗi từ input; map sang boolean hoặc enum rồi chọn hằng số viết cứng.
>
> Lưu ý: `quote_ident`/`%I` bảo vệ cú pháp, nhưng **không** biến một tên bảng tuỳ ý thành hợp lệ về mặt nghiệp vụ. Nếu bỏ bước allow-list, người dùng vẫn có thể trỏ query sang một bảng họ không được phép đọc. Hai lớp này bổ sung cho nhau, không thay thế nhau.

📖 **Nguyên văn** — cảnh báo về dollar quoting trong Example 41.1
> "because it would break if the contents of `newvalue` happened to contain `$$`. The same objection would apply to any other dollar-quoting delimiter you might pick. So, to safely quote text that is not known in advance, you must use `quote_literal`, `quote_nullable`, or `quote_ident`, as appropriate."

🇻🇳 **Dịch**
> "bởi vì nó sẽ hỏng nếu nội dung của `newvalue` tình cờ chứa `$$`. Cùng một phản bác đó áp dụng cho bất kỳ dấu phân cách dollar-quoting nào khác bạn có thể chọn. Vì vậy, để quote một cách an toàn phần text **không biết trước**, bạn buộc phải dùng `quote_literal`, `quote_nullable`, hoặc `quote_ident`, tuỳ trường hợp."

---

## 7. Additional Defenses — Least Privilege

📖 **Nguyên văn** — *Additional Defenses*
> "Beyond adopting one of the four primary defenses, we also recommend adopting all of these additional defenses to provide defense in depth. These additional defenses are:
>
> - **Least Privilege**
> - **Allow-list Input Validation**"

🇻🇳 **Dịch**
> "Ngoài việc áp dụng một trong bốn primary defense, chúng tôi cũng khuyến nghị áp dụng tất cả các biện pháp phòng thủ bổ sung sau để tạo ra **defense in depth** (phòng thủ nhiều lớp). Các biện pháp bổ sung đó là:
>
> - **Least Privilege** (đặc quyền tối thiểu)
> - **Allow-list Input Validation**"

📖 **Nguyên văn** — *Least Privilege*
> "To minimize the potential damage of a successful SQL injection attack, you should minimize the privileges assigned to every database account in your environment. Start from the ground up to determine what access rights your application accounts require, rather than trying to figure out what access rights you need to take away."

🇻🇳 **Dịch**
> "Để giảm thiểu thiệt hại tiềm tàng của một cuộc tấn công SQL injection thành công, bạn nên **giảm thiểu quyền được cấp cho mọi database account** trong môi trường của bạn. Hãy bắt đầu từ con số không để xác định ứng dụng của bạn **cần** những quyền truy cập nào, thay vì cố nghĩ xem cần **lấy bớt** quyền nào đi."

📖 **Nguyên văn**
> "Make sure that accounts that only need read access are only granted read access to the tables they need access to. DO NOT ASSIGN DBA OR ADMIN TYPE ACCESS TO YOUR APPLICATION ACCOUNTS. We understand that this is easy, and everything just "works" when you do it this way, but it is very dangerous."

🇻🇳 **Dịch**
> "Hãy đảm bảo rằng các account chỉ cần quyền đọc thì chỉ được cấp quyền đọc trên đúng những bảng chúng cần truy cập. **ĐỪNG GÁN QUYỀN KIỂU DBA HAY ADMIN CHO CÁC ACCOUNT ỨNG DỤNG CỦA BẠN.** Chúng tôi hiểu rằng làm vậy thì dễ, và mọi thứ cứ thế "chạy" khi bạn làm theo cách đó, nhưng nó rất nguy hiểm."

> [!danger] Dịch sang ngôn ngữ PostgreSQL
> User mà ứng dụng dùng để kết nối **không được là superuser**. Cách tạo role riêng, `GRANT` đúng quyền trên đúng bảng, và vì sao đừng để app chạy bằng role `postgres` — xem [[14 - Roles, Backup, VACUUM và Performance]].

📖 **Nguyên văn** — *Details Of Least Privilege When Developing*
> "If an account only needs access to portions of a table, consider creating a view that limits access to that portion of the data and assigning the account access to the view instead of the underlying table. Rarely, if ever, grant create or delete access to database accounts."

🇻🇳 **Dịch**
> "Nếu một account chỉ cần truy cập một phần của bảng, hãy cân nhắc tạo một **view** giới hạn quyền truy cập vào phần dữ liệu đó và cấp cho account quyền trên view thay vì trên bảng gốc. Rất hiếm khi — nếu có bao giờ — nên cấp quyền create hay delete cho các database account."

📖 **Nguyên văn** — *Least Admin Privileges For Multiple DBs*
> "In general, each separate web application that requires access to the database should have a designated database user account that the application will use to connect to the DB. That way, the designer of the application can have good granularity in the access control, thus reducing the privileges as much as possible. Each DB user will then have select access to only what it needs, and write-access as needed."

🇻🇳 **Dịch**
> "Nhìn chung, **mỗi web application riêng biệt** cần truy cập database nên có một database user account được chỉ định riêng để ứng dụng đó dùng khi kết nối tới DB. Bằng cách đó, người thiết kế ứng dụng có được độ chi tiết tốt trong access control, nhờ vậy giảm quyền xuống mức thấp nhất có thể. Mỗi DB user khi đó chỉ có quyền select trên đúng thứ nó cần, và quyền ghi khi cần thiết."

📖 **Nguyên văn** — ví dụ login page / sign-up page
> "As an example, a login page requires read access to the username and password fields of a table, but no write access of any form (no insert, update, or delete). However, the sign-up page certainly requires insert privilege to that table; this restriction can only be enforced if these web apps use different DB users to connect to the database."

🇻🇳 **Dịch**
> "Ví dụ, một trang login cần quyền đọc các field username và password của một bảng, nhưng **không cần quyền ghi dưới bất kỳ hình thức nào** (không insert, update, hay delete). Trong khi đó, trang sign-up chắc chắn cần quyền insert vào bảng đó; hạn chế này chỉ có thể được thực thi nếu các web app này dùng **những DB user khác nhau** để kết nối tới database."

📖 **Nguyên văn** — *Minimizing Application and OS Privileges*
> "While you are at it, you should minimize the privileges of the operating system account that the DBMS runs under. Don't run your DBMS as root or system!"

🇻🇳 **Dịch**
> "Nhân tiện, bạn cũng nên giảm thiểu quyền của **account hệ điều hành** mà DBMS chạy dưới quyền đó. Đừng chạy DBMS của bạn dưới quyền root hay system!"

### Allow-list Input Validation như lớp phòng thủ thứ hai

📖 **Nguyên văn**
> "In addition to being a primary defense when nothing else is possible (e.g., when a bind variable isn't legal), input validation can also be a secondary defense used to detect unauthorized input before it is passed to the SQL query. For more information please see the [Input Validation Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html). Proceed with caution here. **Validated data is not necessarily safe to insert into SQL queries via string building.**"

🇻🇳 **Dịch**
> "Ngoài vai trò là biện pháp phòng thủ chính khi không còn cách nào khác (ví dụ khi bind variable không hợp lệ ở vị trí đó), input validation cũng có thể là **phòng thủ thứ cấp** dùng để phát hiện input trái phép trước khi nó được truyền vào SQL query. Để biết thêm, xem Input Validation Cheat Sheet. Hãy thận trọng ở đây. **Dữ liệu đã được validate không nhất thiết là an toàn để chèn vào SQL query bằng cách dựng chuỗi.**"

> [!warning] Câu cuối là cái bẫy hay gặp nhất
> "Tôi đã validate rồi nên nối chuỗi cũng không sao" — OWASP phủ nhận thẳng lập luận đó. Validation lọc input xấu; **tham số hoá mới là thứ đảm bảo input không thể trở thành câu lệnh.** Làm validation không miễn cho bạn khỏi việc tham số hoá.

---

## 8. Checklist rút gọn

| Tình huống | Làm đúng | Tránh |
|---|---|---|
| Giá trị trong `WHERE`, `SET`, `VALUES` | Tham số `$1`, `$2` qua driver / `USING` | Nối chuỗi, kể cả khi "đã validate" |
| Tên bảng / tên cột động | Allow-list trong code → `format('%I', ...)` / `quote_ident` | Truyền thẳng tên từ request |
| `ORDER BY` động, `ASC`/`DESC` | Map sang boolean/enum → chọn hằng số viết cứng | Nối chuỗi sort key từ query param |
| Utility statement (không optimizable) | Chèn text, nhưng giá trị phải đến từ allow-list | Coi như query thường rồi gắn `$1` |
| Đã tham số hoá rồi | Không escape thêm | Escape + tham số hoá cùng lúc (PG: "neither necessary nor correct") |
| Quyền của app | 1 app = 1 DB user, quyền tối thiểu, dùng view nếu cần | App chạy bằng superuser / `db_owner` |

---

> [!note] Vị trí bài này trong roadmap
> Trên [roadmap.sh/backend](https://roadmap.sh/backend), **SQL Injection** được xếp ở node **Web Security** (phần 09 của series này), không nằm trong node Relational Databases. Bài được đặt ở đây vì nó gắn chặt với **cách viết query** — bạn không thể học `SELECT`/`INSERT` xong rồi mới học cách viết chúng cho an toàn sau. Khi tới phần 09, chủ đề này sẽ được nhìn lại từ góc độ tấn công/phòng thủ ở tầng web nói chung (cùng XSS, CSRF...).

---

## Liên kết

- Bài trước: [[12 - Window Functions]]
- Bài kế: [[14 - Roles, Backup, VACUUM và Performance]]
- Mục lục và thứ tự bài: [[00 - Tổng hợp (Relational Databases)]]
- [[03 - Queries - SELECT, JOIN, Aggregate]] — `SELECT`, `WHERE`, `JOIN`, `ORDER BY`: chính là những chỗ giá trị người dùng đi vào query
- [[08 - INSERT, UPDATE, DELETE]] — `INSERT`/`UPDATE`/`DELETE` cũng nằm trong danh sách câu lệnh mà `PREPARE` chấp nhận
- [[02 - Tables, Data Types và Constraints]] — constraint là lớp bảo vệ **tính đúng đắn** của dữ liệu, khác với lớp bảo vệ **cú pháp** ở bài này; hai thứ không thay thế nhau
- [[05 - Transactions, ACID và MVCC]] — một injection thành công trong transaction vẫn commit bình thường; transaction không phải cơ chế bảo mật

## Nguồn tham khảo

- OWASP Cheat Sheet Series — *SQL Injection Prevention Cheat Sheet* : <https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html>
- OWASP — *Input Validation Cheat Sheet* (được cheat sheet trên dẫn) : <https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html>
- PostgreSQL Documentation — `PREPARE` : <https://www.postgresql.org/docs/current/sql-prepare.html>
- PostgreSQL Documentation — libpq, *Command Execution Functions* (`PQexecParams`, `PQexecPrepared`, escaping) : <https://www.postgresql.org/docs/current/libpq-exec.html>
- PostgreSQL Documentation — PL/pgSQL, *Basic Statements* → 41.5.4. *Executing Dynamic Commands* + Example 41.1 : <https://www.postgresql.org/docs/current/plpgsql-statements.html>
- PostgreSQL Documentation — *String Functions and Operators* (`format`, `quote_ident`, `quote_literal`, `quote_nullable`) : <https://www.postgresql.org/docs/current/functions-string.html>
- roadmap.sh — Backend Developer Roadmap : <https://roadmap.sh/backend>

> Đoạn JavaScript ở mục 2 (khối gắn nhãn "ví dụ minh hoạ tự viết") **không** trích từ tài liệu nào — đó là bản chuyển thể pattern Java của OWASP sang JS để dễ nhận diện trong code hằng ngày. Mọi khối "Nguyên văn" còn lại đều là trích dẫn nguyên văn từ các nguồn liệt kê trên, và khối nào cũng có bản dịch tiếng Việt đi kèm ngay bên dưới.
