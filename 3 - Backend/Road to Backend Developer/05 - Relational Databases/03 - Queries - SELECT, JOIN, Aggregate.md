# 03 — Queries: SELECT, JOIN, Aggregate

> **Nguồn chính:** PostgreSQL 18 Documentation — [2.5. Querying a Table](https://www.postgresql.org/docs/current/tutorial-select.html), [2.6. Joins Between Tables](https://www.postgresql.org/docs/current/tutorial-join.html), [2.7. Aggregate Functions](https://www.postgresql.org/docs/current/tutorial-agg.html), [7.1. Overview](https://www.postgresql.org/docs/current/queries-overview.html), [7.2. Table Expressions](https://www.postgresql.org/docs/current/queries-table-expressions.html), [7.5. ORDER BY](https://www.postgresql.org/docs/current/queries-order.html), [7.6. LIMIT and OFFSET](https://www.postgresql.org/docs/current/queries-limit.html)
> Bài này bám mục 2.5–2.7 (tutorial) và chương 7 (Queries) — đọc dữ liệu ra khỏi database.

⭐ Đây là bài quan trọng nhất về mặt dùng hằng ngày: 90% công việc với database là viết `SELECT`.

---

## 1. Query là gì — cấu trúc tổng quát của SELECT

📖 **Nguyên văn** — [7.1. Overview](https://www.postgresql.org/docs/current/queries-overview.html)
> "The process of retrieving or the command to retrieve data from a database is called a query. In SQL the SELECT command is used to specify queries. The general syntax of the SELECT command is"

🇻🇳 **Dịch**
> "Quá trình lấy dữ liệu — hoặc câu lệnh dùng để lấy dữ liệu — từ một database được gọi là query. Trong SQL, lệnh SELECT được dùng để mô tả các query. Cú pháp tổng quát của lệnh SELECT là"

📖 **Nguyên văn** (cú pháp gốc)
```sql
[WITH with_queries] SELECT select_list FROM table_expression [sort_specification]
```

🇻🇳 Ba mảnh ghép của mọi query: `select_list` (lấy cột gì), `table_expression` (lấy từ đâu — table, join, subquery), `sort_specification` (sắp xếp thế nào).

📖 **Nguyên văn**
> "FROM table1 is a simple kind of table expression: it reads just one table. In general, table expressions can be complex constructs of base tables, joins, and subqueries. But you can also omit the table expression entirely and use the SELECT command as a calculator:"

🇻🇳 **Dịch**
> "`FROM table1` là một dạng table expression đơn giản: nó chỉ đọc một table. Nói chung, table expression có thể là những cấu trúc phức tạp gồm base table, join và subquery. Nhưng bạn cũng có thể bỏ hẳn table expression và dùng lệnh SELECT như một cái máy tính:"

📖 **Nguyên văn**
```sql
SELECT 3 * 4;
```
```sql
SELECT random();
```

🇻🇳 Hai câu này chạy được mà không cần table nào — `SELECT` tính biểu thức và gọi function trực tiếp.

---

## 2. SELECT cơ bản — chọn cột

📖 **Nguyên văn** — [2.5. Querying a Table](https://www.postgresql.org/docs/current/tutorial-select.html)
> "To retrieve data from a table, the table is queried. An SQL SELECT statement is used to do this. The statement is divided into a select list (the part that lists the columns to be returned), a table list (the part that lists the tables from which to retrieve the data), and an optional qualification (the part that specifies any restrictions). For example, to retrieve all the rows of table weather, type:"

🇻🇳 **Dịch**
> "Để lấy dữ liệu ra khỏi một table, ta query table đó. Câu lệnh SQL SELECT được dùng để làm việc này. Câu lệnh được chia thành một select list (phần liệt kê các cột sẽ trả về), một table list (phần liệt kê các table lấy dữ liệu từ đó), và một qualification không bắt buộc (phần chỉ định các điều kiện giới hạn). Ví dụ, để lấy tất cả các row của table `weather`, gõ:"

📖 **Nguyên văn**
```sql
SELECT * FROM weather;
```

🇻🇳 Lấy toàn bộ row và toàn bộ cột của table `weather`.

📖 **Nguyên văn**
> "Here * is a shorthand for “all columns”. [2] So the same result would be had with:"

🇻🇳 **Dịch**
> "Ở đây `*` là cách viết tắt cho “tất cả các cột”. [2] Vậy nên cùng kết quả đó cũng có được với:"

📖 **Nguyên văn**
```sql
SELECT city, temp_lo, temp_hi, prcp, date FROM weather;
```

🇻🇳 Liệt kê tường minh từng cột — kết quả giống hệt `SELECT *`.

📖 **Nguyên văn** (output)
```
     city      | temp_lo | temp_hi | prcp |    date
---------------+---------+---------+------+------------
 San Francisco |      46 |      50 | 0.25 | 1994-11-27
 San Francisco |      43 |      57 |    0 | 1994-11-29
 Hayward       |      37 |      54 |      | 1994-11-29
(3 rows)
```

🇻🇳 Bảng `weather` mẫu có 3 row; ô `prcp` của Hayward bỏ trống vì là NULL.

> [!warning] Footnote [2] — đừng dùng `SELECT *` trong production
> 📖 **Nguyên văn**
> > "While SELECT * is useful for off-the-cuff queries, it is widely considered bad style in production code, since adding a column to the table would change the results."
>
> 🇻🇳 **Dịch**
> > "Mặc dù `SELECT *` tiện cho các query viết nhanh tạm thời, nó bị coi rộng rãi là bad style trong code production, vì thêm một cột vào table sẽ làm thay đổi kết quả."

---

## 3. Biểu thức trong select list và `AS`

📖 **Nguyên văn**
> "You can write expressions, not just simple column references, in the select list. For example, you can do:"

🇻🇳 **Dịch**
> "Bạn có thể viết các biểu thức trong select list, không chỉ đơn thuần là tham chiếu cột. Ví dụ, bạn có thể làm:"

📖 **Nguyên văn**
```sql
SELECT city, (temp_hi+temp_lo)/2 AS temp_avg, date FROM weather;
```

🇻🇳 Tính nhiệt độ trung bình ngay trong query và đặt tên cột kết quả là `temp_avg`.

📖 **Nguyên văn** (output)
```
     city      | temp_avg |    date
---------------+----------+------------
 San Francisco |       48 | 1994-11-27
 San Francisco |       50 | 1994-11-29
 Hayward       |       45 | 1994-11-29
(3 rows)
```

🇻🇳 Cột `temp_avg` là cột tính toán, không tồn tại trong table gốc.

📖 **Nguyên văn**
> "Notice how the AS clause is used to relabel the output column. (The AS clause is optional.)"

🇻🇳 **Dịch**
> "Chú ý cách mệnh đề `AS` được dùng để đặt lại nhãn cho cột output. (Mệnh đề `AS` là tuỳ chọn.)"

---

## 4. `WHERE` — lọc row

📖 **Nguyên văn**
> "A query can be “qualified” by adding a WHERE clause that specifies which rows are wanted. The WHERE clause contains a Boolean (truth value) expression, and only rows for which the Boolean expression is true are returned. The usual Boolean operators (AND, OR, and NOT) are allowed in the qualification. For example, the following retrieves the weather of San Francisco on rainy days:"

🇻🇳 **Dịch**
> "Một query có thể được “qualify” bằng cách thêm mệnh đề `WHERE` chỉ định những row nào là mong muốn. Mệnh đề `WHERE` chứa một biểu thức Boolean (giá trị đúng/sai), và chỉ những row mà biểu thức Boolean đó đúng mới được trả về. Các toán tử Boolean thông thường (`AND`, `OR`, và `NOT`) đều được phép dùng trong qualification. Ví dụ, câu sau lấy thời tiết của San Francisco vào những ngày mưa:"

📖 **Nguyên văn**
```sql
SELECT * FROM weather
    WHERE city = 'San Francisco' AND prcp > 0.0;
```

🇻🇳 Lọc hai điều kiện cùng lúc: đúng thành phố San Francisco **và** lượng mưa lớn hơn 0.

📖 **Nguyên văn** (output)
```
     city      | temp_lo | temp_hi | prcp |    date
---------------+---------+---------+------+------------
 San Francisco |      46 |      50 | 0.25 | 1994-11-27
(1 row)
```

🇻🇳 Chỉ còn 1 row thoả cả hai điều kiện.

---

## 5. `DISTINCT` — bỏ row trùng

📖 **Nguyên văn**
> "You can request that duplicate rows be removed from the result of a query:"

🇻🇳 **Dịch**
> "Bạn có thể yêu cầu loại bỏ các row trùng lặp khỏi kết quả của một query:"

📖 **Nguyên văn**
```sql
SELECT DISTINCT city
    FROM weather;
```

🇻🇳 Lấy danh sách thành phố, mỗi tên chỉ xuất hiện một lần.

📖 **Nguyên văn** (output)
```
     city
---------------
 Hayward
 San Francisco
(2 rows)
```

🇻🇳 3 row gốc rút còn 2 giá trị `city` khác nhau.

📖 **Nguyên văn**
> "Here again, the result row ordering might vary. You can ensure consistent results by using DISTINCT and ORDER BY together: [3]"

🇻🇳 **Dịch**
> "Ở đây một lần nữa, thứ tự row trong kết quả có thể thay đổi. Bạn có thể đảm bảo kết quả nhất quán bằng cách dùng `DISTINCT` và `ORDER BY` cùng nhau: [3]"

📖 **Nguyên văn**
```sql
SELECT DISTINCT city
    FROM weather
    ORDER BY city;
```

🇻🇳 Kết hợp `DISTINCT` + `ORDER BY` để kết quả luôn cùng một thứ tự.

> [!warning] Footnote [3] — `DISTINCT` KHÔNG tự sắp xếp
> 📖 **Nguyên văn**
> > "In some database systems, including older versions of PostgreSQL, the implementation of DISTINCT automatically orders the rows and so ORDER BY is unnecessary. But this is not required by the SQL standard, and current PostgreSQL does not guarantee that DISTINCT causes the rows to be ordered."
>
> 🇻🇳 **Dịch**
> > "Ở một số hệ database, bao gồm các phiên bản PostgreSQL cũ, cách cài đặt `DISTINCT` tự động sắp xếp các row nên `ORDER BY` là không cần thiết. Nhưng điều đó không được chuẩn SQL yêu cầu, và PostgreSQL hiện tại không đảm bảo rằng `DISTINCT` làm cho các row được sắp xếp."

---

# ⭐ 6. JOIN — trọng tâm của bài

## 6.1. Join query là gì

📖 **Nguyên văn** — [2.6. Joins Between Tables](https://www.postgresql.org/docs/current/tutorial-join.html)
> "Thus far, our queries have only accessed one table at a time. Queries can access multiple tables at once, or access the same table in such a way that multiple rows of the table are being processed at the same time. Queries that access multiple tables (or multiple instances of the same table) at one time are called join queries. They combine rows from one table with rows from a second table, with an expression specifying which rows are to be paired."

🇻🇳 **Dịch**
> "Cho tới giờ, các query của ta mới chỉ truy cập một table mỗi lần. Query có thể truy cập nhiều table cùng lúc, hoặc truy cập cùng một table theo cách mà nhiều row của table đó được xử lý cùng lúc. Những query truy cập nhiều table (hoặc nhiều instance của cùng một table) cùng một lúc được gọi là join query. Chúng kết hợp các row từ một table với các row từ một table thứ hai, với một biểu thức chỉ định những row nào được ghép cặp."

📖 **Nguyên văn**
```sql
SELECT * FROM weather JOIN cities ON city = name;
```

🇻🇳 Ghép mỗi row `weather` với row `cities` có `name` trùng `city`.

📖 **Nguyên văn** (output)
```
     city      | temp_lo | temp_hi | prcp |    date    |     name      | location
---------------+---------+---------+------+------------+---------------+-----------
 San Francisco |      46 |      50 | 0.25 | 1994-11-27 | San Francisco | (-194,53)
 San Francisco |      43 |      57 |    0 | 1994-11-29 | San Francisco | (-194,53)
(2 rows)
```

🇻🇳 Hayward biến mất — vì `cities` không có row nào tên Hayward.

📖 **Nguyên văn**
> "There is no result row for the city of Hayward. This is because there is no matching entry in the cities table for Hayward, so the join ignores the unmatched rows in the weather table. We will see shortly how this can be fixed."

🇻🇳 **Dịch**
> "Không có row kết quả nào cho thành phố Hayward. Đó là vì không có entry khớp nào trong table `cities` cho Hayward, nên join bỏ qua những row không khớp trong table `weather`. Ta sẽ thấy ngay sau đây cách sửa chuyện này."

📖 **Nguyên văn**
> "It is widely considered good style to qualify all column names in a join query, so that the query won't fail if a duplicate column name is later added to one of the tables."

🇻🇳 **Dịch**
> "Được coi rộng rãi là good style khi qualify (ghi đầy đủ tên table trước tên cột) toàn bộ tên cột trong một join query, để query không bị lỗi nếu sau này một tên cột trùng được thêm vào một trong các table."

📖 **Nguyên văn**
```sql
SELECT weather.city, weather.temp_lo, weather.temp_hi,
       weather.prcp, weather.date, cities.location
    FROM weather JOIN cities ON weather.city = cities.name;
```

🇻🇳 Mọi cột đều ghi rõ thuộc table nào — an toàn khi schema thay đổi.

## 6.2. Cú pháp cũ (implicit join) vs `JOIN ... ON`

📖 **Nguyên văn**
```sql
SELECT *
    FROM weather, cities
    WHERE city = name;
```

🇻🇳 Cách viết cũ: liệt kê table bằng dấu phẩy, điều kiện ghép nằm trong `WHERE`.

📖 **Nguyên văn**
> "This syntax pre-dates the JOIN/ON syntax, which was introduced in SQL-92. The tables are simply listed in the FROM clause, and the comparison expression is added to the WHERE clause. The results from this older implicit syntax and the newer explicit JOIN/ON syntax are identical. But for a reader of the query, the explicit syntax makes its meaning easier to understand: The join condition is introduced by its own key word whereas previously the condition was mixed into the WHERE clause together with other conditions."

🇻🇳 **Dịch**
> "Cú pháp này có trước cú pháp `JOIN`/`ON`, vốn được giới thiệu trong SQL-92. Các table chỉ đơn giản được liệt kê trong mệnh đề `FROM`, và biểu thức so sánh được thêm vào mệnh đề `WHERE`. Kết quả từ cú pháp implicit cũ này và cú pháp explicit `JOIN`/`ON` mới hơn là giống hệt nhau. Nhưng với người đọc query, cú pháp explicit làm ý nghĩa của nó dễ hiểu hơn: join condition được giới thiệu bằng key word riêng của nó, trong khi trước đây điều kiện bị trộn lẫn vào mệnh đề `WHERE` cùng với các điều kiện khác."

## 6.3. Joined table — định nghĩa chính quy

📖 **Nguyên văn** — [7.2.1.1. Joined Tables](https://www.postgresql.org/docs/current/queries-table-expressions.html)
> "A joined table is a table derived from two other (real or derived) tables according to the rules of the particular join type. Inner, outer, and cross-joins are available. The general syntax of a joined table is"

🇻🇳 **Dịch**
> "Một joined table là một table được dẫn xuất từ hai table khác (thật hoặc dẫn xuất) theo các quy tắc của loại join cụ thể. Có sẵn inner join, outer join và cross join. Cú pháp tổng quát của một joined table là"

📖 **Nguyên văn**
```sql
T1 join_type T2 [ join_condition ]
```

🇻🇳 Khung chung: table trái, loại join, table phải, điều kiện ghép.

📖 **Nguyên văn**
> "Joins of all types can be chained together, or nested: either or both T1 and T2 can be joined tables. Parentheses can be used around JOIN clauses to control the join order. In the absence of parentheses, JOIN clauses nest left-to-right."

🇻🇳 **Dịch**
> "Join thuộc mọi loại đều có thể nối chuỗi với nhau, hoặc lồng nhau: một hoặc cả hai `T1` và `T2` đều có thể là joined table. Dấu ngoặc đơn có thể được dùng quanh các mệnh đề `JOIN` để kiểm soát thứ tự join. Khi không có dấu ngoặc, các mệnh đề `JOIN` lồng từ trái sang phải."

### Bảng dữ liệu mẫu dùng cho tất cả ví dụ dưới đây

📖 **Nguyên văn** — `t1`
```
 num | name
-----+------
   1 | a
   2 | b
   3 | c
```

🇻🇳 Table `t1` có 3 row, khoá `num` = 1, 2, 3.

📖 **Nguyên văn** — `t2`
```
 num | value
-----+-------
   1 | xxx
   3 | yyy
   5 | zzz
```

🇻🇳 Table `t2` có 3 row, `num` = 1, 3, 5. Giao nhau với `t1` chỉ ở 1 và 3.

---

## 6.4. CROSS JOIN

📖 **Nguyên văn**
```sql
T1 CROSS JOIN T2
```

🇻🇳 Cú pháp cross join — không có điều kiện ghép.

📖 **Nguyên văn**
> "For every possible combination of rows from T1 and T2 (i.e., a Cartesian product), the joined table will contain a row consisting of all columns in T1 followed by all columns in T2. If the tables have N and M rows respectively, the joined table will have N * M rows."

🇻🇳 **Dịch**
> "Với mọi tổ hợp có thể có của các row từ `T1` và `T2` (tức là một tích Descartes — Cartesian product), joined table sẽ chứa một row gồm tất cả các cột trong `T1` theo sau bởi tất cả các cột trong `T2`. Nếu các table có lần lượt N và M row, joined table sẽ có N * M row."

📖 **Nguyên văn**
> "FROM T1 CROSS JOIN T2 is equivalent to FROM T1 INNER JOIN T2 ON TRUE (see below). It is also equivalent to FROM T1, T2."

🇻🇳 **Dịch**
> "`FROM T1 CROSS JOIN T2` tương đương với `FROM T1 INNER JOIN T2 ON TRUE` (xem bên dưới). Nó cũng tương đương với `FROM T1, T2`."

📖 **Nguyên văn** (ví dụ + output)
```sql
=> SELECT * FROM t1 CROSS JOIN t2;
 num | name | num | value
-----+------+-----+-------
   1 | a    |   1 | xxx
   1 | a    |   3 | yyy
   1 | a    |   5 | zzz
   2 | b    |   1 | xxx
   2 | b    |   3 | yyy
   2 | b    |   5 | zzz
   3 | c    |   1 | xxx
   3 | c    |   3 | yyy
   3 | c    |   5 | zzz
(9 rows)
```

🇻🇳 3 × 3 = 9 row — mỗi row của `t1` ghép với **mọi** row của `t2`.

> [!warning] Note trong tài liệu — `CROSS JOIN` và dấu phẩy không hoàn toàn giống nhau
> 📖 **Nguyên văn**
> > "This latter equivalence does not hold exactly when more than two tables appear, because JOIN binds more tightly than comma. For example FROM T1 CROSS JOIN T2 INNER JOIN T3 ON condition is not the same as FROM T1, T2 INNER JOIN T3 ON condition because the condition can reference T1 in the first case but not the second."
>
> 🇻🇳 **Dịch**
> > "Sự tương đương sau cùng này không đúng chính xác khi có nhiều hơn hai table xuất hiện, vì `JOIN` gắn kết chặt hơn dấu phẩy. Ví dụ `FROM T1 CROSS JOIN T2 INNER JOIN T3 ON condition` không giống với `FROM T1, T2 INNER JOIN T3 ON condition` vì điều kiện có thể tham chiếu `T1` trong trường hợp đầu nhưng không thể trong trường hợp sau."

---

## 6.5. Qualified joins — cú pháp chung

📖 **Nguyên văn**
```sql
T1 { [INNER] | { LEFT | RIGHT | FULL } [OUTER] } JOIN T2 ON boolean_expression
T1 { [INNER] | { LEFT | RIGHT | FULL } [OUTER] } JOIN T2 USING ( join column list )
T1 NATURAL { [INNER] | { LEFT | RIGHT | FULL } [OUTER] } JOIN T2
```

🇻🇳 Ba cách chỉ định điều kiện ghép: `ON` (biểu thức tự do), `USING` (danh sách cột cùng tên), `NATURAL` (tự suy ra mọi cột cùng tên).

📖 **Nguyên văn**
> "The words INNER and OUTER are optional in all forms. INNER is the default; LEFT, RIGHT, and FULL imply an outer join."

🇻🇳 **Dịch**
> "Các từ `INNER` và `OUTER` là tuỳ chọn trong mọi dạng. `INNER` là mặc định; `LEFT`, `RIGHT`, và `FULL` hàm ý một outer join."

> [!tip] Nghĩa thực tế
> Viết `JOIN` trần = `INNER JOIN`. Viết `LEFT JOIN` = `LEFT OUTER JOIN`. Không khác gì nhau.

📖 **Nguyên văn**
> "The join condition is specified in the ON or USING clause, or implicitly by the word NATURAL. The join condition determines which rows from the two source tables are considered to “match”, as explained in detail below."

🇻🇳 **Dịch**
> "Join condition được chỉ định trong mệnh đề `ON` hoặc `USING`, hoặc ngầm định bằng từ `NATURAL`. Join condition quyết định những row nào từ hai table nguồn được coi là “khớp”, như giải thích chi tiết bên dưới."

---

## 6.6. INNER JOIN

📖 **Nguyên văn**
> "For each row R1 of T1, the joined table has a row for each row in T2 that satisfies the join condition with R1."

🇻🇳 **Dịch**
> "Với mỗi row R1 của `T1`, joined table có một row cho mỗi row trong `T2` thoả mãn join condition với R1."

📖 **Nguyên văn** (ví dụ + output)
```sql
=> SELECT * FROM t1 INNER JOIN t2 ON t1.num = t2.num;
 num | name | num | value
-----+------+-----+-------
   1 | a    |   1 | xxx
   3 | c    |   3 | yyy
(2 rows)
```

🇻🇳 Chỉ giữ `num` = 1 và 3 — hai giá trị có mặt ở **cả hai** table. Row `2 | b` và `5 | zzz` bị loại.

### Biến thể `USING`

📖 **Nguyên văn**
> "The USING clause is a shorthand that allows you to take advantage of the specific situation where both sides of the join use the same name for the joining column(s). It takes a comma-separated list of the shared column names and forms a join condition that includes an equality comparison for each one. For example, joining T1 and T2 with USING (a, b) produces the join condition ON T1.a = T2.a AND T1.b = T2.b."

🇻🇳 **Dịch**
> "Mệnh đề `USING` là cách viết tắt cho phép bạn tận dụng tình huống cụ thể khi cả hai phía của join dùng cùng một tên cho (các) cột ghép. Nó nhận một danh sách các tên cột chung ngăn cách bằng dấu phẩy và tạo thành một join condition gồm một phép so sánh bằng cho từng cột. Ví dụ, join `T1` và `T2` với `USING (a, b)` sinh ra join condition `ON T1.a = T2.a AND T1.b = T2.b`."

📖 **Nguyên văn**
> "Furthermore, the output of JOIN USING suppresses redundant columns: there is no need to print both of the matched columns, since they must have equal values. While JOIN ON produces all columns from T1 followed by all columns from T2, JOIN USING produces one output column for each of the listed column pairs (in the listed order), followed by any remaining columns from T1, followed by any remaining columns from T2."

🇻🇳 **Dịch**
> "Hơn nữa, output của `JOIN USING` loại bỏ các cột thừa: không cần in cả hai cột đã khớp, vì chúng bắt buộc phải có giá trị bằng nhau. Trong khi `JOIN ON` sinh ra tất cả các cột từ `T1` theo sau bởi tất cả các cột từ `T2`, thì `JOIN USING` sinh ra một cột output cho mỗi cặp cột được liệt kê (theo thứ tự liệt kê), theo sau bởi các cột còn lại của `T1`, rồi đến các cột còn lại của `T2`."

📖 **Nguyên văn** (ví dụ + output)
```sql
=> SELECT * FROM t1 INNER JOIN t2 USING (num);
 num | name | value
-----+------+-------
   1 | a    | xxx
   3 | c    | yyy
(2 rows)
```

🇻🇳 Giống `INNER JOIN ... ON` nhưng chỉ còn **một** cột `num` thay vì hai.

### Biến thể `NATURAL`

📖 **Nguyên văn**
> "Finally, NATURAL is a shorthand form of USING: it forms a USING list consisting of all column names that appear in both input tables. As with USING, these columns appear only once in the output table. If there are no common column names, NATURAL JOIN behaves like CROSS JOIN."

🇻🇳 **Dịch**
> "Cuối cùng, `NATURAL` là dạng viết tắt của `USING`: nó tạo ra một danh sách `USING` gồm tất cả các tên cột xuất hiện ở cả hai table đầu vào. Giống như với `USING`, các cột này chỉ xuất hiện một lần trong table output. Nếu không có tên cột chung nào, `NATURAL JOIN` hành xử giống như `CROSS JOIN`."

📖 **Nguyên văn** (ví dụ + output)
```sql
=> SELECT * FROM t1 NATURAL INNER JOIN t2;
 num | name | value
-----+------+-------
   1 | a    | xxx
   3 | c    | yyy
(2 rows)
```

🇻🇳 PostgreSQL tự tìm cột chung (`num`) và ghép theo nó.

> [!danger] Tài liệu cảnh báo `NATURAL` rất rủi ro
> 📖 **Nguyên văn**
> > "USING is reasonably safe from column changes in the joined relations since only the listed columns are combined. NATURAL is considerably more risky since any schema changes to either relation that cause a new matching column name to be present will cause the join to combine that new column as well."
>
> 🇻🇳 **Dịch**
> > "`USING` khá an toàn trước những thay đổi cột trong các relation được join vì chỉ những cột được liệt kê mới được kết hợp. `NATURAL` rủi ro hơn đáng kể vì bất kỳ thay đổi schema nào ở một trong hai relation làm xuất hiện một tên cột khớp mới sẽ khiến join kết hợp luôn cả cột mới đó."

---

## 6.7. LEFT OUTER JOIN

📖 **Nguyên văn** — [7.2.1.1](https://www.postgresql.org/docs/current/queries-table-expressions.html)
> "First, an inner join is performed. Then, for each row in T1 that does not satisfy the join condition with any row in T2, a joined row is added with null values in columns of T2. Thus, the joined table always has at least one row for each row in T1."

🇻🇳 **Dịch**
> "Trước hết, một inner join được thực hiện. Sau đó, với mỗi row trong `T1` không thoả mãn join condition với bất kỳ row nào trong `T2`, một joined row được thêm vào với các giá trị null ở các cột của `T2`. Nhờ vậy, joined table luôn có ít nhất một row cho mỗi row của `T1`."

📖 **Nguyên văn** (ví dụ + output)
```sql
=> SELECT * FROM t1 LEFT JOIN t2 ON t1.num = t2.num;
 num | name | num | value
-----+------+-----+-------
   1 | a    |   1 | xxx
   2 | b    |     |
   3 | c    |   3 | yyy
(3 rows)
```

🇻🇳 Giữ đủ 3 row của `t1`; row `2 | b` không tìm được bạn nên cột của `t2` là NULL.

📖 **Nguyên văn** (biến thể `USING`)
```sql
=> SELECT * FROM t1 LEFT JOIN t2 USING (num);
 num | name | value
-----+------+-------
   1 | a    | xxx
   2 | b    |
   3 | c    | yyy
(3 rows)
```

🇻🇳 Cùng kết quả nhưng gộp hai cột `num` thành một.

### Cách tutorial giải thích LEFT JOIN (ví dụ `weather` / `cities`)

📖 **Nguyên văn** — [2.6](https://www.postgresql.org/docs/current/tutorial-join.html)
> "Now we will figure out how we can get the Hayward records back in. What we want the query to do is to scan the weather table and for each row to find the matching cities row(s). If no matching row is found we want some “empty values” to be substituted for the cities table's columns. This kind of query is called an outer join. (The joins we have seen so far are inner joins.) The command looks like this:"

🇻🇳 **Dịch**
> "Bây giờ ta sẽ tìm cách lấy lại các record của Hayward. Điều ta muốn query làm là quét table `weather` và với mỗi row tìm (các) row `cities` khớp với nó. Nếu không tìm thấy row khớp nào, ta muốn một vài “giá trị rỗng” được thay vào cho các cột của table `cities`. Loại query này được gọi là outer join. (Các join ta đã thấy cho tới giờ đều là inner join.) Câu lệnh trông như sau:"

📖 **Nguyên văn**
```sql
SELECT *
    FROM weather LEFT OUTER JOIN cities ON weather.city = cities.name;
```

🇻🇳 Giữ toàn bộ row của `weather` kể cả khi không có thành phố tương ứng trong `cities`.

📖 **Nguyên văn** (output)
```
     city      | temp_lo | temp_hi | prcp |    date    |     name      | location
---------------+---------+---------+------+------------+---------------+-----------
 Hayward       |      37 |      54 |      | 1994-11-29 |               |
 San Francisco |      46 |      50 | 0.25 | 1994-11-27 | San Francisco | (-194,53)
 San Francisco |      43 |      57 |    0 | 1994-11-29 | San Francisco | (-194,53)
(3 rows)
```

🇻🇳 Hayward đã quay lại, với `name` và `location` để trống (NULL).

📖 **Nguyên văn**
> "This query is called a left outer join because the table mentioned on the left of the join operator will have each of its rows in the output at least once, whereas the table on the right will only have those rows output that match some row of the left table. When outputting a left-table row for which there is no right-table match, empty (null) values are substituted for the right-table columns."

🇻🇳 **Dịch**
> "Query này được gọi là left outer join vì table được nhắc tới ở bên trái toán tử join sẽ có mỗi row của nó xuất hiện trong output ít nhất một lần, trong khi table bên phải chỉ có những row khớp với một row nào đó của table bên trái mới được xuất ra. Khi xuất một row của table trái mà không có row khớp ở table phải, các giá trị rỗng (null) được thay vào cho các cột của table phải."

---

## 6.8. RIGHT OUTER JOIN

📖 **Nguyên văn**
> "First, an inner join is performed. Then, for each row in T2 that does not satisfy the join condition with any row in T1, a joined row is added with null values in columns of T1. This is the converse of a left join: the result table will always have a row for each row in T2."

🇻🇳 **Dịch**
> "Trước hết, một inner join được thực hiện. Sau đó, với mỗi row trong `T2` không thoả mãn join condition với bất kỳ row nào trong `T1`, một joined row được thêm vào với các giá trị null ở các cột của `T1`. Đây là chiều ngược lại của left join: table kết quả sẽ luôn có một row cho mỗi row của `T2`."

📖 **Nguyên văn** (ví dụ + output)
```sql
=> SELECT * FROM t1 RIGHT JOIN t2 ON t1.num = t2.num;
 num | name | num | value
-----+------+-----+-------
   1 | a    |   1 | xxx
   3 | c    |   3 | yyy
     |      |   5 | zzz
(3 rows)
```

🇻🇳 Giữ đủ 3 row của `t2`; `5 | zzz` không có bạn ở `t1` nên cột của `t1` là NULL.

---

## 6.9. FULL OUTER JOIN

📖 **Nguyên văn**
> "First, an inner join is performed. Then, for each row in T1 that does not satisfy the join condition with any row in T2, a joined row is added with null values in columns of T2. Also, for each row of T2 that does not satisfy the join condition with any row in T1, a joined row with null values in the columns of T1 is added."

🇻🇳 **Dịch**
> "Trước hết, một inner join được thực hiện. Sau đó, với mỗi row trong `T1` không thoả mãn join condition với bất kỳ row nào trong `T2`, một joined row được thêm vào với các giá trị null ở các cột của `T2`. Đồng thời, với mỗi row của `T2` không thoả mãn join condition với bất kỳ row nào trong `T1`, một joined row với các giá trị null ở các cột của `T1` cũng được thêm vào."

📖 **Nguyên văn** (ví dụ + output)
```sql
=> SELECT * FROM t1 FULL JOIN t2 ON t1.num = t2.num;
 num | name | num | value
-----+------+-----+-------
   1 | a    |   1 | xxx
   2 | b    |     |
   3 | c    |   3 | yyy
     |      |   5 | zzz
(4 rows)
```

🇻🇳 Giữ tất cả row của cả hai table: 2 row khớp + `2 | b` chỉ có ở `t1` + `5 | zzz` chỉ có ở `t2`.

---

## 6.10. 🧭 Bảng tóm tắt — loại JOIN nào giữ row nào

> Bảng này do người viết note tổng hợp từ các định nghĩa nguyên văn ở mục 6.4–6.9, dùng đúng dữ liệu `t1`/`t2` của tài liệu.

| Loại JOIN | Row khớp cả hai bên | Row chỉ có ở T1 (trái) | Row chỉ có ở T2 (phải) | Kết quả với `t1`/`t2` |
|---|---|---|---|---|
| `CROSS JOIN` | — (ghép tất cả với tất cả) | giữ, ghép với mọi row T2 | giữ, ghép với mọi row T1 | 9 rows (3 × 3) |
| `INNER JOIN` | ✅ giữ | ❌ loại | ❌ loại | 2 rows |
| `LEFT OUTER JOIN` | ✅ giữ | ✅ giữ, cột T2 = NULL | ❌ loại | 3 rows |
| `RIGHT OUTER JOIN` | ✅ giữ | ❌ loại | ✅ giữ, cột T1 = NULL | 3 rows |
| `FULL OUTER JOIN` | ✅ giữ | ✅ giữ, cột T2 = NULL | ✅ giữ, cột T1 = NULL | 4 rows |

Mẹo nhớ: **LEFT / RIGHT / FULL đều bắt đầu bằng một INNER JOIN**, rồi *thêm lại* những row bị rơi ở phía trái / phải / cả hai — đúng như tài liệu viết "First, an inner join is performed. Then...".

---

## 6.11. 💡 Ví dụ đời sống — INNER JOIN vs LEFT JOIN

Hình dung một buổi họp lớp, bạn cầm hai tờ giấy:

- Tờ **DANH SÁCH LỚP** (`students`): 40 tên học sinh.
- Tờ **SỔ ĐÓNG QUỸ** (`payments`): tên + số tiền, chỉ 28 người đã đóng.

Bạn muốn ghép hai tờ lại để biết ai đóng bao nhiêu.

- **INNER JOIN** = bạn chỉ chép ra những dòng mà tên xuất hiện ở **cả hai** tờ → được 28 dòng. Rất tiện nếu bạn cần in biên lai. Nhưng 12 người chưa đóng **biến mất hoàn toàn** — nhìn vào kết quả bạn tưởng lớp chỉ có 28 người. Đây đúng là chuyện đã xảy ra với Hayward trong tài liệu: không có trong `cities` → bốc hơi khỏi kết quả.

- **LEFT JOIN** (lấy `students` làm bên trái) = bạn chép ra **đủ 40 dòng**, ai chưa đóng thì ô "số tiền" để trống. Trống ở đây chính là NULL. Giờ bạn mới trả lời được câu hỏi quan trọng nhất: *ai chưa đóng?* → chính là những dòng có ô tiền trống.

- **FULL OUTER JOIN** = thêm cả những dòng trong sổ quỹ mà **không có tên trong danh sách lớp** (ví dụ ai đó ghi nhầm tên, hoặc phụ huynh đóng hộ dưới tên khác). Dùng khi bạn đang đi soát dữ liệu lệch giữa hai nguồn.

Quy tắc thực dụng: **cần đếm "bao nhiêu cái KHÔNG có" thì bắt buộc dùng LEFT JOIN**, vì INNER JOIN đã vứt chúng đi trước khi bạn kịp đếm.

---

## 6.12. Bẫy kinh điển: điều kiện đặt ở `ON` khác điều kiện đặt ở `WHERE`

📖 **Nguyên văn**
> "The join condition specified with ON can also contain conditions that do not relate directly to the join. This can prove useful for some queries but needs to be thought out carefully. For example:"

🇻🇳 **Dịch**
> "Join condition được chỉ định bằng `ON` cũng có thể chứa những điều kiện không liên quan trực tiếp tới phép join. Điều này có thể hữu ích cho một số query nhưng cần được cân nhắc kỹ. Ví dụ:"

📖 **Nguyên văn**
```sql
=> SELECT * FROM t1 LEFT JOIN t2 ON t1.num = t2.num AND t2.value = 'xxx';
 num | name | num | value
-----+------+-----+-------
   1 | a    |   1 | xxx
   2 | b    |     |
   3 | c    |     |
(3 rows)
```

🇻🇳 Điều kiện nằm trong `ON` → vẫn giữ đủ 3 row của `t1`, chỉ là row nào không thoả thì cột `t2` thành NULL.

📖 **Nguyên văn**
> "Notice that placing the restriction in the WHERE clause produces a different result:"

🇻🇳 **Dịch**
> "Chú ý rằng đặt điều kiện giới hạn trong mệnh đề `WHERE` sinh ra kết quả khác:"

📖 **Nguyên văn**
```sql
=> SELECT * FROM t1 LEFT JOIN t2 ON t1.num = t2.num WHERE t2.value = 'xxx';
 num | name | num | value
-----+------+-----+-------
   1 | a    |   1 | xxx
(1 row)
```

🇻🇳 Cùng một điều kiện nhưng ở `WHERE` → chỉ còn 1 row: LEFT JOIN coi như bị biến thành INNER JOIN.

> [!danger] Câu chốt của tài liệu
> 📖 **Nguyên văn**
> > "This is because a restriction placed in the ON clause is processed before the join, while a restriction placed in the WHERE clause is processed after the join. That does not matter with inner joins, but it matters a lot with outer joins."
>
> 🇻🇳 **Dịch**
> > "Đó là vì một điều kiện giới hạn đặt trong mệnh đề `ON` được xử lý **trước** phép join, còn điều kiện đặt trong mệnh đề `WHERE` được xử lý **sau** phép join. Chuyện đó không quan trọng với inner join, nhưng nó rất quan trọng với outer join."

---

## 6.13. Self join — join một table với chính nó

📖 **Nguyên văn** — [2.6](https://www.postgresql.org/docs/current/tutorial-join.html)
> "We can also join a table against itself. This is called a self join. As an example, suppose we wish to find all the weather records that are in the temperature range of other weather records. So we need to compare the temp_lo and temp_hi columns of each weather row to the temp_lo and temp_hi columns of all other weather rows. We can do this with the following query:"

🇻🇳 **Dịch**
> "Ta cũng có thể join một table với chính nó. Việc này được gọi là self join. Ví dụ, giả sử ta muốn tìm tất cả các record thời tiết nằm trong khoảng nhiệt độ của các record thời tiết khác. Vậy ta cần so sánh các cột `temp_lo` và `temp_hi` của mỗi row `weather` với các cột `temp_lo` và `temp_hi` của tất cả những row `weather` khác. Ta có thể làm điều này với query sau:"

📖 **Nguyên văn**
```sql
SELECT w1.city, w1.temp_lo AS low, w1.temp_hi AS high,
       w2.city, w2.temp_lo AS low, w2.temp_hi AS high
    FROM weather w1 JOIN weather w2
        ON w1.temp_lo < w2.temp_lo AND w1.temp_hi > w2.temp_hi;
```

🇻🇳 Đặt hai alias `w1`, `w2` cho cùng table `weather` để so sánh các row với nhau.

📖 **Nguyên văn** (output)
```
     city      | low | high |     city      | low | high
---------------+-----+------+---------------+-----+------
 San Francisco |  43 |   57 | San Francisco |  46 |   50
 Hayward       |  37 |   54 | San Francisco |  46 |   50
(2 rows)
```

🇻🇳 Hai row có khoảng nhiệt độ "bao trọn" khoảng của row San Francisco 46–50.

📖 **Nguyên văn**
> "Here we have relabeled the weather table as w1 and w2 to be able to distinguish the left and right side of the join. You can also use these kinds of aliases in other queries to save some typing, e.g.:"

🇻🇳 **Dịch**
> "Ở đây ta đã đặt lại nhãn cho table `weather` thành `w1` và `w2` để có thể phân biệt phía trái và phía phải của phép join. Bạn cũng có thể dùng những alias kiểu này trong các query khác để đỡ phải gõ nhiều, ví dụ:"

📖 **Nguyên văn**
```sql
SELECT *
    FROM weather w JOIN cities c ON w.city = c.name;
```

🇻🇳 `w` và `c` là alias viết tắt của `weather` và `cities`.

📖 **Nguyên văn** — footnote [4]
> "This is only a conceptual model. The join is usually performed in a more efficient manner than actually comparing each possible pair of rows, but this is invisible to the user."

🇻🇳 **Dịch**
> "Đây chỉ là một mô hình khái niệm. Phép join thường được thực hiện theo cách hiệu quả hơn là thực sự so sánh từng cặp row có thể có, nhưng điều đó là vô hình với người dùng."

---

# 7. Aggregate functions

## 7.1. Khái niệm

📖 **Nguyên văn** — [2.7. Aggregate Functions](https://www.postgresql.org/docs/current/tutorial-agg.html)
> "Like most other relational database products, PostgreSQL supports aggregate functions. An aggregate function computes a single result from multiple input rows. For example, there are aggregates to compute the count, sum, avg (average), max (maximum) and min (minimum) over a set of rows."

🇻🇳 **Dịch**
> "Giống như hầu hết các sản phẩm relational database khác, PostgreSQL hỗ trợ các aggregate function. Một aggregate function tính ra một kết quả duy nhất từ nhiều row đầu vào. Ví dụ, có các aggregate để tính `count`, `sum`, `avg` (trung bình), `max` (lớn nhất) và `min` (nhỏ nhất) trên một tập row."

📖 **Nguyên văn**
```sql
SELECT max(temp_lo) FROM weather;
```

🇻🇳 Lấy giá trị `temp_lo` lớn nhất trong toàn bộ table.

📖 **Nguyên văn** (output)
```
 max
-----
  46
(1 row)
```

🇻🇳 Nhiều row đầu vào → đúng 1 row kết quả.

---

## 7.2. ⚠️ Vì sao KHÔNG dùng được aggregate trong `WHERE` — chỗ người mới sai nhiều nhất

📖 **Nguyên văn**
> "If we wanted to know what city (or cities) that reading occurred in, we might try:"

🇻🇳 **Dịch**
> "Nếu ta muốn biết con số đó xảy ra ở thành phố nào (hoặc những thành phố nào), ta có thể thử:"

📖 **Nguyên văn** (query SAI — tài liệu tự đánh dấu `-- WRONG`)
```sql
SELECT city FROM weather WHERE temp_lo = max(temp_lo);     -- WRONG
```

🇻🇳 Query này **sai** — tài liệu tự chú thích `-- WRONG` ngay trong ví dụ.

> [!danger] Trích nguyên văn lý do — đọc kỹ đoạn này
> 📖 **Nguyên văn**
> > "but this will not work since the aggregate max cannot be used in the WHERE clause. (This restriction exists because the WHERE clause determines which rows will be included in the aggregate calculation; so obviously it has to be evaluated before aggregate functions are computed.) However, as is often the case the query can be restated to accomplish the desired result, here by using a subquery:"
>
> 🇻🇳 **Dịch**
> > "nhưng cái này sẽ không chạy được vì aggregate `max` không thể dùng trong mệnh đề `WHERE`. (Hạn chế này tồn tại bởi vì mệnh đề `WHERE` quyết định những row nào sẽ được đưa vào phép tính aggregate; nên hiển nhiên nó phải được đánh giá **trước khi** các aggregate function được tính.) Tuy nhiên, như thường lệ, query có thể được viết lại để đạt được kết quả mong muốn, ở đây bằng cách dùng một subquery:"

Logic vòng tròn ở đây: `WHERE` phải chạy trước để biết lấy row nào đưa vào `max()`, nhưng câu `WHERE temp_lo = max(temp_lo)` lại đòi biết `max()` trước mới lọc được. Không thể có cả hai.

📖 **Nguyên văn** (cách viết đúng)
```sql
SELECT city FROM weather
    WHERE temp_lo = (SELECT max(temp_lo) FROM weather);
```

🇻🇳 Đưa `max()` vào một subquery độc lập, tính xong ra một con số rồi mới đem so sánh trong `WHERE`.

📖 **Nguyên văn** (output)
```
     city
---------------
 San Francisco
(1 row)
```

🇻🇳 Kết quả đúng: thành phố có `temp_lo` cao nhất.

📖 **Nguyên văn**
> "This is OK because the subquery is an independent computation that computes its own aggregate separately from what is happening in the outer query."

🇻🇳 **Dịch**
> "Cách này ổn vì subquery là một phép tính độc lập, nó tính aggregate của riêng nó tách biệt khỏi những gì đang diễn ra trong query bên ngoài."

---

## 7.3. `GROUP BY`

📖 **Nguyên văn**
> "Aggregates are also very useful in combination with GROUP BY clauses. For example, we can get the number of readings and the maximum low temperature observed in each city with:"

🇻🇳 **Dịch**
> "Các aggregate cũng rất hữu ích khi kết hợp với mệnh đề `GROUP BY`. Ví dụ, ta có thể lấy số lượng lần đo và nhiệt độ thấp lớn nhất quan sát được ở mỗi thành phố bằng:"

📖 **Nguyên văn**
```sql
SELECT city, count(*), max(temp_lo)
    FROM weather
    GROUP BY city;
```

🇻🇳 Gom row theo `city`, mỗi nhóm tính số lượng row và `temp_lo` lớn nhất.

📖 **Nguyên văn** (output)
```
     city      | count | max
---------------+-------+-----
 Hayward       |     1 |  37
 San Francisco |     2 |  46
(2 rows)
```

🇻🇳 2 thành phố → 2 row kết quả.

📖 **Nguyên văn**
> "which gives us one output row per city. Each aggregate result is computed over the table rows matching that city. We can filter these grouped rows using HAVING:"

🇻🇳 **Dịch**
> "cái này cho ta một row output cho mỗi thành phố. Mỗi kết quả aggregate được tính trên các row của table khớp với thành phố đó. Ta có thể lọc các grouped row này bằng `HAVING`:"

---

## 7.4. `HAVING`

📖 **Nguyên văn**
```sql
SELECT city, count(*), max(temp_lo)
    FROM weather
    GROUP BY city
    HAVING max(temp_lo) < 40;
```

🇻🇳 Sau khi gom nhóm, chỉ giữ những nhóm có `max(temp_lo)` nhỏ hơn 40.

📖 **Nguyên văn** (output)
```
  city   | count | max
---------+-------+-----
 Hayward |     1 |  37
(1 row)
```

🇻🇳 Chỉ Hayward thoả điều kiện nhóm.

📖 **Nguyên văn**
> "which gives us the same results for only the cities that have all temp_lo values below 40. Finally, if we only care about cities whose names begin with “S”, we might do:"

🇻🇳 **Dịch**
> "cái này cho ta cùng những kết quả đó nhưng chỉ với các thành phố có tất cả các giá trị `temp_lo` dưới 40. Cuối cùng, nếu ta chỉ quan tâm tới các thành phố có tên bắt đầu bằng “S”, ta có thể làm:"

📖 **Nguyên văn**
```sql
SELECT city, count(*), max(temp_lo)
    FROM weather
    WHERE city LIKE 'S%'            -- (1)
    GROUP BY city;
```

🇻🇳 Lọc row **trước** khi gom nhóm bằng `WHERE` + pattern matching `LIKE 'S%'`.

📖 **Nguyên văn** (output)
```
     city      | count | max
---------------+-------+-----
 San Francisco |     2 |  46
(1 row)
```

🇻🇳 Chỉ San Francisco có tên bắt đầu bằng "S".

📖 **Nguyên văn** — chú thích (1)
> "The LIKE operator does pattern matching and is explained in Section 9.7."

🇻🇳 **Dịch**
> "Toán tử `LIKE` thực hiện pattern matching và được giải thích trong Section 9.7."

---

## 7.5. ⭐ `WHERE` vs `HAVING` — đoạn quan trọng nhất của bài

> [!danger] Trích nguyên văn — học thuộc đoạn này
> 📖 **Nguyên văn**
> > "It is important to understand the interaction between aggregates and SQL's WHERE and HAVING clauses. The fundamental difference between WHERE and HAVING is this: WHERE selects input rows before groups and aggregates are computed (thus, it controls which rows go into the aggregate computation), whereas HAVING selects group rows after groups and aggregates are computed. Thus, the WHERE clause must not contain aggregate functions; it makes no sense to try to use an aggregate to determine which rows will be inputs to the aggregates. On the other hand, the HAVING clause always contains aggregate functions. (Strictly speaking, you are allowed to write a HAVING clause that doesn't use aggregates, but it's seldom useful. The same condition could be used more efficiently at the WHERE stage.)"
>
> 🇻🇳 **Dịch**
> > "Hiểu được tương tác giữa các aggregate và các mệnh đề `WHERE`, `HAVING` của SQL là điều quan trọng. Khác biệt căn bản giữa `WHERE` và `HAVING` là: `WHERE` chọn các row đầu vào **trước khi** các nhóm và các aggregate được tính (do đó, nó kiểm soát những row nào đi vào phép tính aggregate), trong khi `HAVING` chọn các group row **sau khi** các nhóm và các aggregate đã được tính. Vì vậy, mệnh đề `WHERE` không được chứa aggregate function; việc dùng một aggregate để xác định những row nào sẽ là đầu vào của chính các aggregate đó là vô nghĩa. Ngược lại, mệnh đề `HAVING` luôn chứa aggregate function. (Nói chặt chẽ ra, bạn được phép viết một mệnh đề `HAVING` không dùng aggregate, nhưng hiếm khi hữu ích. Cùng điều kiện đó có thể được dùng hiệu quả hơn ở giai đoạn `WHERE`.)"

📖 **Nguyên văn**
> "In the previous example, we can apply the city name restriction in WHERE, since it needs no aggregate. This is more efficient than adding the restriction to HAVING, because we avoid doing the grouping and aggregate calculations for all rows that fail the WHERE check."

🇻🇳 **Dịch**
> "Trong ví dụ trước, ta có thể áp dụng điều kiện giới hạn tên thành phố trong `WHERE`, vì nó không cần aggregate. Cách này hiệu quả hơn là thêm điều kiện vào `HAVING`, bởi ta tránh được việc phải thực hiện gom nhóm và tính aggregate cho tất cả những row trượt kiểm tra `WHERE`."

> [!tip] Quy tắc bỏ túi
> - Điều kiện **không** dùng aggregate → đặt vào `WHERE` (nhanh hơn, lọc sớm).
> - Điều kiện **có** dùng aggregate (`count()`, `sum()`, `max()`...) → bắt buộc đặt vào `HAVING`.
> - Thứ tự thực thi khái niệm: `FROM`/`JOIN` → `WHERE` → `GROUP BY` → aggregate → `HAVING` → `SELECT` → `ORDER BY` → `LIMIT`.

---

## 7.6. `FILTER` — lọc riêng cho từng aggregate

📖 **Nguyên văn**
> "Another way to select the rows that go into an aggregate computation is to use FILTER, which is a per-aggregate option:"

🇻🇳 **Dịch**
> "Một cách khác để chọn các row đi vào một phép tính aggregate là dùng `FILTER`, đây là một tuỳ chọn riêng cho từng aggregate:"

📖 **Nguyên văn**
```sql
SELECT city, count(*) FILTER (WHERE temp_lo < 45), max(temp_lo)
    FROM weather
    GROUP BY city;
```

🇻🇳 `FILTER` chỉ gắn vào `count(*)`, không ảnh hưởng tới `max(temp_lo)`.

📖 **Nguyên văn** (output)
```
     city      | count | max
---------------+-------+-----
 Hayward       |     1 |  37
 San Francisco |     1 |  46
(2 rows)
```

🇻🇳 `count` của San Francisco giảm còn 1, nhưng `max` vẫn là 46.

📖 **Nguyên văn**
> "FILTER is much like WHERE, except that it removes rows only from the input of the particular aggregate function that it is attached to. Here, the count aggregate counts only rows with temp_lo below 45; but the max aggregate is still applied to all rows, so it still finds the reading of 46."

🇻🇳 **Dịch**
> "`FILTER` khá giống `WHERE`, ngoại trừ việc nó chỉ loại bỏ row khỏi đầu vào của riêng aggregate function mà nó được gắn vào. Ở đây, aggregate `count` chỉ đếm những row có `temp_lo` dưới 45; nhưng aggregate `max` vẫn được áp lên tất cả các row, nên nó vẫn tìm ra con số 46."

---

# 8. `ORDER BY` — sắp xếp

📖 **Nguyên văn** — [7.5. Sorting Rows (ORDER BY)](https://www.postgresql.org/docs/current/queries-order.html)
> "After a query has produced an output table (after the select list has been processed) it can optionally be sorted. If sorting is not chosen, the rows will be returned in an unspecified order. The actual order in that case will depend on the scan and join plan types and the order on disk, but it must not be relied on. A particular output ordering can only be guaranteed if the sort step is explicitly chosen."

🇻🇳 **Dịch**
> "Sau khi một query đã tạo ra table output (sau khi select list đã được xử lý), nó có thể được sắp xếp một cách tuỳ chọn. Nếu không chọn sắp xếp, các row sẽ được trả về theo một thứ tự không xác định. Thứ tự thực tế trong trường hợp đó sẽ phụ thuộc vào loại scan và join plan cũng như thứ tự trên đĩa, nhưng không được phép dựa vào nó. Một thứ tự output cụ thể chỉ có thể được đảm bảo nếu bước sort được chọn một cách tường minh."

📖 **Nguyên văn** (cú pháp)
```sql
SELECT select_list
    FROM table_expression
    ORDER BY sort_expression1 [ASC | DESC] [NULLS { FIRST | LAST }]
             [, sort_expression2 [ASC | DESC] [NULLS { FIRST | LAST }] ...]
```

🇻🇳 Có thể sắp xếp theo nhiều biểu thức, mỗi cái có hướng riêng và cách xử lý NULL riêng.

📖 **Nguyên văn**
```sql
SELECT a, b FROM table1 ORDER BY a + b, c;
```

🇻🇳 Sắp xếp theo biểu thức `a + b`, nếu bằng nhau thì xét tiếp cột `c`.

📖 **Nguyên văn**
> "When more than one expression is specified, the later values are used to sort rows that are equal according to the earlier values. Each expression can be followed by an optional ASC or DESC keyword to set the sort direction to ascending or descending. ASC order is the default. Ascending order puts smaller values first, where “smaller” is defined in terms of the < operator. Similarly, descending order is determined with the > operator. [6]"

🇻🇳 **Dịch**
> "Khi có nhiều hơn một biểu thức được chỉ định, các giá trị sau được dùng để sắp xếp những row bằng nhau theo các giá trị trước. Mỗi biểu thức có thể được theo sau bởi keyword tuỳ chọn `ASC` hoặc `DESC` để đặt hướng sắp xếp là tăng dần hay giảm dần. Thứ tự `ASC` là mặc định. Thứ tự tăng dần đặt các giá trị nhỏ hơn lên trước, trong đó “nhỏ hơn” được định nghĩa theo toán tử `<`. Tương tự, thứ tự giảm dần được xác định bằng toán tử `>`. [6]"

📖 **Nguyên văn**
> "The NULLS FIRST and NULLS LAST options can be used to determine whether nulls appear before or after non-null values in the sort ordering. By default, null values sort as if larger than any non-null value; that is, NULLS FIRST is the default for DESC order, and NULLS LAST otherwise."

🇻🇳 **Dịch**
> "Các tuỳ chọn `NULLS FIRST` và `NULLS LAST` có thể được dùng để quyết định xem các giá trị null xuất hiện trước hay sau các giá trị non-null trong thứ tự sắp xếp. Mặc định, các giá trị null được sắp xếp như thể chúng lớn hơn mọi giá trị non-null; tức là `NULLS FIRST` là mặc định cho thứ tự `DESC`, còn `NULLS LAST` là mặc định trong các trường hợp khác."

📖 **Nguyên văn**
> "Note that the ordering options are considered independently for each sort column. For example ORDER BY x, y DESC means ORDER BY x ASC, y DESC, which is not the same as ORDER BY x DESC, y DESC."

🇻🇳 **Dịch**
> "Lưu ý rằng các tuỳ chọn sắp xếp được xét độc lập cho từng cột sort. Ví dụ `ORDER BY x, y DESC` có nghĩa là `ORDER BY x ASC, y DESC`, vốn không giống với `ORDER BY x DESC, y DESC`."

📖 **Nguyên văn**
```sql
SELECT a + b AS sum, c FROM table1 ORDER BY sum;
SELECT a, max(b) FROM table1 GROUP BY a ORDER BY 1;
```

🇻🇳 Có thể sắp xếp theo nhãn cột output (`sum`) hoặc theo số thứ tự cột (`1`).

📖 **Nguyên văn**
> "both of which sort by the first output column. Note that an output column name has to stand alone, that is, it cannot be used in an expression — for example, this is not correct:"

🇻🇳 **Dịch**
> "cả hai đều sắp xếp theo cột output đầu tiên. Lưu ý rằng tên cột output phải đứng một mình, nghĩa là nó không thể được dùng trong một biểu thức — ví dụ, câu này là không đúng:"

📖 **Nguyên văn**
```sql
SELECT a + b AS sum, c FROM table1 ORDER BY sum + c; -- wrong
```

🇻🇳 Sai — dùng alias `sum` bên trong một biểu thức là không được phép.

---

# 9. `LIMIT` và `OFFSET` — phân trang

📖 **Nguyên văn** — [7.6. LIMIT and OFFSET](https://www.postgresql.org/docs/current/queries-limit.html)
> "LIMIT and OFFSET allow you to retrieve just a portion of the rows that are generated by the rest of the query:"

🇻🇳 **Dịch**
> "`LIMIT` và `OFFSET` cho phép bạn chỉ lấy một phần của các row được sinh ra bởi phần còn lại của query:"

📖 **Nguyên văn** (cú pháp)
```sql
SELECT select_list
    FROM table_expression
    [ ORDER BY ... ]
    [ LIMIT { count | ALL } ]
    [ OFFSET start ]
```

🇻🇳 `LIMIT` giới hạn số row trả về, `OFFSET` bỏ qua bao nhiêu row đầu tiên.

📖 **Nguyên văn**
> "If a limit count is given, no more than that many rows will be returned (but possibly fewer, if the query itself yields fewer rows). LIMIT ALL is the same as omitting the LIMIT clause, as is LIMIT with a NULL argument."

🇻🇳 **Dịch**
> "Nếu một limit count được đưa ra, sẽ không có nhiều hơn số row đó được trả về (nhưng có thể ít hơn, nếu bản thân query sinh ra ít row hơn). `LIMIT ALL` cũng giống như bỏ hẳn mệnh đề `LIMIT`, `LIMIT` với đối số `NULL` cũng vậy."

📖 **Nguyên văn**
> "OFFSET says to skip that many rows before beginning to return rows. OFFSET 0 is the same as omitting the OFFSET clause, as is OFFSET with a NULL argument."

🇻🇳 **Dịch**
> "`OFFSET` nói rằng hãy bỏ qua chừng đó row trước khi bắt đầu trả về các row. `OFFSET 0` cũng giống như bỏ hẳn mệnh đề `OFFSET`, `OFFSET` với đối số `NULL` cũng vậy."

📖 **Nguyên văn**
> "If both OFFSET and LIMIT appear, then OFFSET rows are skipped before starting to count the LIMIT rows that are returned."

🇻🇳 **Dịch**
> "Nếu cả `OFFSET` và `LIMIT` cùng xuất hiện, thì `OFFSET` row được bỏ qua trước khi bắt đầu đếm `LIMIT` row được trả về."

> [!danger] `LIMIT` mà không có `ORDER BY` = kết quả không thể đoán trước
> 📖 **Nguyên văn**
> > "When using LIMIT, it is important to use an ORDER BY clause that constrains the result rows into a unique order. Otherwise you will get an unpredictable subset of the query's rows. You might be asking for the tenth through twentieth rows, but tenth through twentieth in what ordering? The ordering is unknown, unless you specified ORDER BY."
>
> 🇻🇳 **Dịch**
> > "Khi dùng `LIMIT`, điều quan trọng là phải dùng một mệnh đề `ORDER BY` ràng buộc các row kết quả vào một thứ tự duy nhất. Nếu không bạn sẽ nhận được một tập con không thể đoán trước của các row trong query. Bạn có thể đang hỏi xin row thứ mười tới thứ hai mươi, nhưng thứ mười tới thứ hai mươi theo thứ tự nào? Thứ tự đó là không xác định, trừ khi bạn đã chỉ định `ORDER BY`."

📖 **Nguyên văn**
> "The query optimizer takes LIMIT into account when generating query plans, so you are very likely to get different plans (yielding different row orders) depending on what you give for LIMIT and OFFSET. Thus, using different LIMIT/OFFSET values to select different subsets of a query result will give inconsistent results unless you enforce a predictable result ordering with ORDER BY. This is not a bug; it is an inherent consequence of the fact that SQL does not promise to deliver the results of a query in any particular order unless ORDER BY is used to constrain the order."

🇻🇳 **Dịch**
> "Query optimizer có tính tới `LIMIT` khi sinh ra các query plan, nên rất có khả năng bạn nhận được các plan khác nhau (sinh ra thứ tự row khác nhau) tuỳ theo giá trị bạn đưa cho `LIMIT` và `OFFSET`. Vì vậy, dùng các giá trị `LIMIT`/`OFFSET` khác nhau để chọn các tập con khác nhau của một kết quả query sẽ cho ra những kết quả không nhất quán, trừ khi bạn ép một thứ tự kết quả có thể đoán trước bằng `ORDER BY`. Đây không phải là bug; đó là hệ quả tất yếu của việc SQL không hứa hẹn trả về kết quả của một query theo bất kỳ thứ tự cụ thể nào trừ khi `ORDER BY` được dùng để ràng buộc thứ tự đó."

📖 **Nguyên văn**
> "The rows skipped by an OFFSET clause still have to be computed inside the server; therefore a large OFFSET might be inefficient."

🇻🇳 **Dịch**
> "Những row bị bỏ qua bởi mệnh đề `OFFSET` vẫn phải được tính bên trong server; do đó một `OFFSET` lớn có thể kém hiệu quả."

> [!tip] Hệ quả thực tế cho phân trang
> Phân trang kiểu `OFFSET 100000 LIMIT 20` buộc server phải tính rồi vứt bỏ 100000 row — chính là điều tài liệu gọi là "might be inefficient". Đây là lý do các API lớn dùng keyset pagination (`WHERE id > last_id ORDER BY id LIMIT 20`) thay vì `OFFSET`.

---

## Tổng kết bài

1. `SELECT` = select list + table expression + sort specification.
2. `SELECT *` tiện khi thử nghiệm, là bad style trong production.
3. `WHERE` lọc row **trước**; `HAVING` lọc nhóm **sau**; aggregate chỉ được xuất hiện ở `HAVING` (hoặc trong subquery).
4. `INNER JOIN` giữ giao; `LEFT`/`RIGHT`/`FULL OUTER JOIN` = inner join rồi thêm lại row rơi rụng với NULL.
5. Điều kiện ở `ON` khác điều kiện ở `WHERE` — chỉ với outer join, nhưng khác rất lớn.
6. `DISTINCT` không tự sắp xếp; `LIMIT` không có `ORDER BY` là không xác định. Muốn thứ tự thì phải viết `ORDER BY`.

---

## 🔌 Liên hệ stack thực tế

> Phần này là ghi chú riêng, KHÔNG trích từ tài liệu PostgreSQL.

- **Firestore không có JOIN.** Toàn bộ mục 6 của bài này không có bản tương đương trong Firestore — muốn ghép dữ liệu giữa hai collection thì phải đọc lần lượt ở phía client/server, hoặc denormalize (nhân bản dữ liệu vào document). Đây là khác biệt lớn nhất khi chuyển tư duy từ document database sang relational database.
- **Firestore không có `GROUP BY` / `HAVING` tổng quát.** Các con số tổng hợp thường được duy trì bằng counter tự cập nhật qua Cloud Functions, thay vì tính bằng query như `SELECT city, count(*) ... GROUP BY city`.
- **Phân trang:** đoạn cảnh báo `OFFSET` kém hiệu quả ở mục 9 giải thích luôn vì sao Firestore chỉ cho phân trang theo con trỏ (`startAfter` trên một document) chứ không cho nhảy thẳng tới trang thứ N — đó chính là keyset pagination.
- Nếu dùng Cloud SQL for PostgreSQL trên GCP thì mọi thứ trong bài này áp dụng nguyên vẹn, vì đó là PostgreSQL thật.

---

## Liên kết
- Bài trước: [[02 - Tables, Data Types và Constraints]]
- Bài kế: [[04 - Indexes]]

## Nguồn tham khảo
- PostgreSQL 18 Documentation — 2.5. Querying a Table : https://www.postgresql.org/docs/current/tutorial-select.html
- PostgreSQL 18 Documentation — 2.6. Joins Between Tables : https://www.postgresql.org/docs/current/tutorial-join.html
- PostgreSQL 18 Documentation — 2.7. Aggregate Functions : https://www.postgresql.org/docs/current/tutorial-agg.html
- PostgreSQL 18 Documentation — 7.1. Overview : https://www.postgresql.org/docs/current/queries-overview.html
- PostgreSQL 18 Documentation — 7.2. Table Expressions (7.2.1.1. Joined Tables) : https://www.postgresql.org/docs/current/queries-table-expressions.html
- PostgreSQL 18 Documentation — 7.5. Sorting Rows (ORDER BY) : https://www.postgresql.org/docs/current/queries-order.html
- PostgreSQL 18 Documentation — 7.6. LIMIT and OFFSET : https://www.postgresql.org/docs/current/queries-limit.html
- Trang nguồn không có hình minh hoạ → note này không có ảnh trong `assets/`
