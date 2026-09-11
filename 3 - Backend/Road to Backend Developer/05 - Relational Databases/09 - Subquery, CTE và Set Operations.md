# 09 — Subquery, CTE và Set Operations

> **Nguồn chính:** PostgreSQL 18 Documentation — *7.8. WITH Queries (Common Table Expressions)* — https://www.postgresql.org/docs/current/queries-with.html
> Bài này bám mục 7.8 (WITH/CTE/RECURSIVE), 7.4 (UNION/INTERSECT/EXCEPT), 9.24 (Subquery Expressions), 4.2.11 (Scalar Subqueries) và 7.2.1.3 + 7.2.1.5 (subquery trong `FROM`, `LATERAL`).

---

## 1. Subquery là gì

Subquery = một câu `SELECT` nằm bên trong một câu lệnh khác. Tài liệu PostgreSQL không gom "subquery" vào một chương riêng, mà mô tả nó ở đúng từng vị trí nó được phép xuất hiện. Có 3 vị trí chính: trong `WHERE`, trong `FROM`, và trong danh sách cột của `SELECT`.

💡 **Ví dụ đời sống**
Bạn đi siêu thị với tờ giấy ghi: *"mua tất cả món nào đắt hơn giá trung bình của giỏ hàng tháng trước"*. Bạn không thể thực hiện ngay — phải làm **một phép tính phụ trước** (tính giá trung bình tháng trước), rồi mới dùng kết quả đó để lọc. Phép tính phụ đó chính là subquery.

Cú pháp `SELECT`, `JOIN`, `GROUP BY` dùng trong các ví dụ dưới đây đã giải thích ở [[03 - Queries - SELECT, JOIN, Aggregate]].

---

## 2. Subquery trong `SELECT` — Scalar Subquery

📖 **Nguyên văn** (4.2.11. Scalar Subqueries)
> "A scalar subquery is an ordinary SELECT query in parentheses that returns exactly one row with one column. (See Chapter 7 for information about writing queries.) The SELECT query is executed and the single returned value is used in the surrounding value expression. It is an error to use a query that returns more than one row or more than one column as a scalar subquery. (But if, during a particular execution, the subquery returns no rows, there is no error; the scalar result is taken to be null.) The subquery can refer to variables from the surrounding query, which will act as constants during any one evaluation of the subquery. See also Section 9.24 for other expressions involving subqueries."

🇻🇳 **Dịch**
> "Một scalar subquery là một câu `SELECT` thông thường đặt trong dấu ngoặc đơn, trả về **đúng một dòng với một cột**. (Xem Chapter 7 để biết cách viết query.) Câu `SELECT` đó được thực thi và giá trị đơn lẻ trả về được dùng trong value expression bao quanh nó. Sẽ là lỗi nếu dùng một query trả về nhiều hơn một dòng hoặc nhiều hơn một cột làm scalar subquery. (Nhưng nếu trong một lần chạy cụ thể, subquery không trả về dòng nào thì không có lỗi; kết quả scalar được coi là null.) Subquery có thể tham chiếu tới các biến từ query bao quanh, chúng đóng vai trò như hằng số trong mỗi lần đánh giá subquery. Xem thêm Section 9.24 cho các expression khác liên quan tới subquery."

📖 **Nguyên văn** (ví dụ gốc)
> "For example, the following finds the largest city population in each state:"

🇻🇳 **Dịch**
> "Ví dụ, câu sau tìm dân số thành phố lớn nhất trong mỗi state:"

```sql
SELECT name, (SELECT max(pop) FROM cities WHERE cities.state = states.name)
    FROM states;
```

🇻🇳 Mỗi dòng của `states` chạy một subquery riêng, lấy `max(pop)` của các thành phố thuộc state đó — subquery tham chiếu `states.name` từ query ngoài (đây gọi là *correlated subquery*).

> [!warning]
> Scalar subquery trả về nhiều hơn 1 dòng hoặc nhiều hơn 1 cột → **lỗi runtime**, không phải lỗi cú pháp. Query có thể chạy đúng trên dữ liệu test rồi chết trên production khi dữ liệu sinh thêm dòng.

---

## 3. Subquery trong `FROM` — derived table

📖 **Nguyên văn** (7.2.1.3. Subqueries)
> "Subqueries specifying a derived table must be enclosed in parentheses. They may be assigned a table alias name, and optionally column alias names (as in Section 7.2.1.2). For example:"

🇻🇳 **Dịch**
> "Các subquery định nghĩa một derived table phải được đặt trong dấu ngoặc đơn. Chúng có thể được gán một table alias, và tuỳ chọn thêm các column alias (như ở Section 7.2.1.2). Ví dụ:"

```sql
FROM (SELECT * FROM table1) AS alias_name
```

🇻🇳 Coi kết quả của `SELECT * FROM table1` như một bảng tạm tên `alias_name`.

📖 **Nguyên văn**
> "This example is equivalent to FROM table1 AS alias_name. More interesting cases, which cannot be reduced to a plain join, arise when the subquery involves grouping or aggregation."

🇻🇳 **Dịch**
> "Ví dụ này tương đương với `FROM table1 AS alias_name`. Những trường hợp thú vị hơn — không thể rút gọn thành một join thường — xuất hiện khi subquery có grouping hoặc aggregation."

📖 **Nguyên văn**
> "According to the SQL standard, a table alias name must be supplied for a subquery. PostgreSQL allows AS and the alias to be omitted, but writing one is good practice in SQL code that might be ported to another system."

🇻🇳 **Dịch**
> "Theo chuẩn SQL, một subquery bắt buộc phải có table alias. PostgreSQL cho phép bỏ `AS` và bỏ alias, nhưng viết alias là good practice cho code SQL có thể được port sang hệ khác."

### 3.1. `LATERAL` — subquery trong `FROM` nhìn được cột của bảng bên trái

📖 **Nguyên văn** (7.2.1.5. LATERAL Subqueries)
> "Subqueries appearing in FROM can be preceded by the key word LATERAL. This allows them to reference columns provided by preceding FROM items. (Without LATERAL, each subquery is evaluated independently and so cannot cross-reference any other FROM item.)"

🇻🇳 **Dịch**
> "Các subquery xuất hiện trong `FROM` có thể được đặt sau từ khoá `LATERAL`. Điều này cho phép chúng tham chiếu tới các cột do những `FROM` item đứng trước cung cấp. (Không có `LATERAL`, mỗi subquery được đánh giá độc lập nên không thể tham chiếu chéo tới bất kỳ `FROM` item nào khác.)"

📖 **Nguyên văn**
> "A trivial example of LATERAL is"

🇻🇳 **Dịch**
> "Một ví dụ đơn giản của `LATERAL` là"

```sql
SELECT * FROM foo, LATERAL (SELECT * FROM bar WHERE bar.id = foo.bar_id) ss;
```

🇻🇳 Với mỗi dòng của `foo`, chạy subquery lấy các dòng `bar` khớp `foo.bar_id`.

📖 **Nguyên văn**
> "LATERAL is primarily useful when the cross-referenced column is necessary for computing the row(s) to be joined."

🇻🇳 **Dịch**
> "`LATERAL` chủ yếu hữu ích khi cột được tham chiếu chéo là thứ cần thiết để tính ra (các) dòng sẽ được join."

---

## 4. Subquery trong `WHERE` — Subquery Expressions

📖 **Nguyên văn** (9.24. Subquery Expressions)
> "This section describes the SQL-compliant subquery expressions available in PostgreSQL. All of the expression forms documented in this section return Boolean (true/false) results."

🇻🇳 **Dịch**
> "Mục này mô tả các subquery expression tuân chuẩn SQL có trong PostgreSQL. Tất cả các dạng expression trong mục này đều trả về kết quả Boolean (true/false)."

### 4.1. `EXISTS`

```sql
EXISTS (subquery)
```

🇻🇳 Kiểm tra xem subquery có trả về dòng nào hay không.

📖 **Nguyên văn**
> "The argument of EXISTS is an arbitrary SELECT statement, or subquery. The subquery is evaluated to determine whether it returns any rows. If it returns at least one row, the result of EXISTS is “true”; if the subquery returns no rows, the result of EXISTS is “false”."

🇻🇳 **Dịch**
> "Đối số của `EXISTS` là một câu lệnh `SELECT` bất kỳ, hay subquery. Subquery được đánh giá để xác định xem nó có trả về dòng nào không. Nếu nó trả về ít nhất một dòng, kết quả của `EXISTS` là “true”; nếu subquery không trả về dòng nào, kết quả của `EXISTS` là “false”."

📖 **Nguyên văn**
> "The subquery will generally only be executed long enough to determine whether at least one row is returned, not all the way to completion. It is unwise to write a subquery that has side effects (such as calling sequence functions); whether the side effects occur might be unpredictable."

🇻🇳 **Dịch**
> "Subquery nói chung chỉ được thực thi đủ lâu để xác định xem có ít nhất một dòng được trả về hay không, chứ không chạy tới hết. Viết một subquery có side effect (như gọi sequence function) là không khôn ngoan; việc side effect có xảy ra hay không có thể không đoán trước được."

📖 **Nguyên văn**
> "Since the result depends only on whether any rows are returned, and not on the contents of those rows, the output list of the subquery is normally unimportant. A common coding convention is to write all EXISTS tests in the form EXISTS(SELECT 1 WHERE ...). There are exceptions to this rule however, such as subqueries that use INTERSECT."

🇻🇳 **Dịch**
> "Vì kết quả chỉ phụ thuộc vào việc có dòng nào được trả về hay không, chứ không phụ thuộc nội dung các dòng đó, danh sách cột output của subquery thường không quan trọng. Một coding convention phổ biến là viết mọi phép kiểm tra `EXISTS` theo dạng `EXISTS(SELECT 1 WHERE ...)`. Tuy nhiên vẫn có ngoại lệ cho quy tắc này, ví dụ các subquery dùng `INTERSECT`."

📖 **Nguyên văn**
> "This simple example is like an inner join on col2, but it produces at most one output row for each tab1 row, even if there are several matching tab2 rows:"

🇻🇳 **Dịch**
> "Ví dụ đơn giản này giống một inner join trên `col2`, nhưng nó sinh ra tối đa một dòng output cho mỗi dòng của `tab1`, kể cả khi có nhiều dòng `tab2` khớp:"

```sql
SELECT col1
FROM tab1
WHERE EXISTS (SELECT 1 FROM tab2 WHERE col2 = tab1.col2);
```

🇻🇳 Lấy `col1` của những dòng `tab1` mà tồn tại ít nhất một dòng `tab2` có `col2` khớp.

`NOT EXISTS` là phủ định của `EXISTS`: đúng khi subquery **không** trả về dòng nào.

### 4.2. `IN`

```sql
expression IN (subquery)
```

🇻🇳 Kiểm tra giá trị bên trái có nằm trong tập kết quả một cột của subquery không.

📖 **Nguyên văn**
> "The right-hand side is a parenthesized subquery, which must return exactly one column. The left-hand expression is evaluated and compared to each row of the subquery result. The result of IN is “true” if any equal subquery row is found. The result is “false” if no equal row is found (including the case where the subquery returns no rows)."

🇻🇳 **Dịch**
> "Vế phải là một subquery trong ngoặc đơn, phải trả về **đúng một cột**. Expression vế trái được đánh giá và so sánh với từng dòng của kết quả subquery. Kết quả của `IN` là “true” nếu tìm thấy bất kỳ dòng subquery nào bằng nó. Kết quả là “false” nếu không tìm thấy dòng nào bằng (bao gồm cả trường hợp subquery không trả về dòng nào)."

📖 **Nguyên văn**
> "Note that if the left-hand expression yields null, or if there are no equal right-hand values and at least one right-hand row yields null, the result of the IN construct will be null, not false. This is in accordance with SQL's normal rules for Boolean combinations of null values."

🇻🇳 **Dịch**
> "Lưu ý rằng nếu expression vế trái cho ra null, hoặc nếu không có giá trị vế phải nào bằng nó và có ít nhất một dòng vế phải cho ra null, thì kết quả của cấu trúc `IN` sẽ là **null, không phải false**. Điều này tuân theo quy tắc thông thường của SQL cho tổ hợp Boolean của các giá trị null."

### 4.3. `NOT IN` — và cái bẫy NULL kinh điển

```sql
expression NOT IN (subquery)
```

🇻🇳 Kiểm tra giá trị bên trái **không** nằm trong tập kết quả của subquery.

📖 **Nguyên văn**
> "The right-hand side is a parenthesized subquery, which must return exactly one column. The left-hand expression is evaluated and compared to each row of the subquery result. The result of NOT IN is “true” if only unequal subquery rows are found (including the case where the subquery returns no rows). The result is “false” if any equal row is found."

🇻🇳 **Dịch**
> "Vế phải là một subquery trong ngoặc đơn, phải trả về đúng một cột. Expression vế trái được đánh giá và so sánh với từng dòng của kết quả subquery. Kết quả của `NOT IN` là “true” nếu chỉ tìm thấy các dòng subquery không bằng nó (bao gồm cả trường hợp subquery không trả về dòng nào). Kết quả là “false” nếu tìm thấy bất kỳ dòng nào bằng nó."

> [!danger] Bẫy NULL với `NOT IN`
> 📖 **Nguyên văn**
> > "Note that if the left-hand expression yields null, or if there are no equal right-hand values and at least one right-hand row yields null, the result of the NOT IN construct will be null, not true. This is in accordance with SQL's normal rules for Boolean combinations of null values."
>
> 🇻🇳 **Dịch**
> > "Lưu ý rằng nếu expression vế trái cho ra null, hoặc nếu không có giá trị vế phải nào bằng nó và có ít nhất một dòng vế phải cho ra null, thì kết quả của cấu trúc `NOT IN` sẽ là **null, không phải true**. Điều này tuân theo quy tắc thông thường của SQL cho tổ hợp Boolean của các giá trị null."
>
> Hệ quả thực tế: `WHERE x NOT IN (SELECT y FROM t)` mà cột `y` có dù chỉ **một** giá trị NULL → mọi dòng đều cho kết quả null → `WHERE` loại hết → query trả về **0 dòng**, im lặng, không báo lỗi. Đây là lý do nhiều người khuyên dùng `NOT EXISTS` thay cho `NOT IN` khi cột bên phải có thể chứa NULL.

### 4.4. `ANY` / `SOME`

```sql
expression operator ANY (subquery)
expression operator SOME (subquery)
```

🇻🇳 So sánh giá trị vế trái với từng dòng subquery bằng `operator`; đúng nếu có ít nhất một phép so sánh cho true.

📖 **Nguyên văn**
> "The right-hand side is a parenthesized subquery, which must return exactly one column. The left-hand expression is evaluated and compared to each row of the subquery result using the given operator, which must yield a Boolean result. The result of ANY is “true” if any true result is obtained. The result is “false” if no true result is found (including the case where the subquery returns no rows)."

🇻🇳 **Dịch**
> "Vế phải là một subquery trong ngoặc đơn, phải trả về đúng một cột. Expression vế trái được đánh giá và so sánh với từng dòng của kết quả subquery bằng operator đã cho, operator này phải cho ra kết quả Boolean. Kết quả của `ANY` là “true” nếu thu được bất kỳ kết quả true nào. Kết quả là “false” nếu không tìm thấy kết quả true nào (bao gồm cả trường hợp subquery không trả về dòng nào)."

📖 **Nguyên văn**
> "SOME is a synonym for ANY. IN is equivalent to = ANY."

🇻🇳 **Dịch**
> "`SOME` là từ đồng nghĩa của `ANY`. `IN` tương đương với `= ANY`."

📖 **Nguyên văn**
> "Note that if there are no successes and at least one right-hand row yields null for the operator's result, the result of the ANY construct will be null, not false. This is in accordance with SQL's normal rules for Boolean combinations of null values."

🇻🇳 **Dịch**
> "Lưu ý rằng nếu không có phép so sánh nào thành công và có ít nhất một dòng vế phải cho ra null ở kết quả của operator, thì kết quả của cấu trúc `ANY` sẽ là null, không phải false. Điều này tuân theo quy tắc thông thường của SQL cho tổ hợp Boolean của các giá trị null."

### 4.5. `ALL`

```sql
expression operator ALL (subquery)
```

🇻🇳 Đúng khi phép so sánh cho true với **mọi** dòng của subquery.

📖 **Nguyên văn**
> "The right-hand side is a parenthesized subquery, which must return exactly one column. The left-hand expression is evaluated and compared to each row of the subquery result using the given operator, which must yield a Boolean result. The result of ALL is “true” if all rows yield true (including the case where the subquery returns no rows). The result is “false” if any false result is found. The result is NULL if no comparison with a subquery row returns false, and at least one comparison returns NULL."

🇻🇳 **Dịch**
> "Vế phải là một subquery trong ngoặc đơn, phải trả về đúng một cột. Expression vế trái được đánh giá và so sánh với từng dòng của kết quả subquery bằng operator đã cho, operator này phải cho ra kết quả Boolean. Kết quả của `ALL` là “true” nếu tất cả các dòng đều cho true (bao gồm cả trường hợp subquery không trả về dòng nào). Kết quả là “false” nếu tìm thấy bất kỳ kết quả false nào. Kết quả là NULL nếu không có phép so sánh nào với dòng subquery trả về false, và có ít nhất một phép so sánh trả về NULL."

📖 **Nguyên văn**
> "NOT IN is equivalent to <> ALL."

🇻🇳 **Dịch**
> "`NOT IN` tương đương với `<> ALL`."

> [!note]
> Cả `EXISTS`, `IN`, `NOT IN`, `ANY` đều kèm một câu cảnh báo chung trong tài liệu:
>
> 📖 **Nguyên văn**
> > "As with EXISTS, it's unwise to assume that the subquery will be evaluated completely."
>
> 🇻🇳 **Dịch**
> > "Cũng như với `EXISTS`, giả định rằng subquery sẽ được đánh giá hoàn toàn là không khôn ngoan."

---

## 5. CTE — `WITH` (trọng tâm)

📖 **Nguyên văn** (7.8. WITH Queries)
> "WITH provides a way to write auxiliary statements for use in a larger query. These statements, which are often referred to as Common Table Expressions or CTEs, can be thought of as defining temporary tables that exist just for one query. Each auxiliary statement in a WITH clause can be a SELECT, INSERT, UPDATE, DELETE, or MERGE; and the WITH clause itself is attached to a primary statement that can also be a SELECT, INSERT, UPDATE, DELETE, or MERGE."

🇻🇳 **Dịch**
> "`WITH` cung cấp một cách để viết các câu lệnh phụ trợ dùng trong một query lớn hơn. Các câu lệnh này — thường được gọi là **Common Table Expressions** hay **CTE** — có thể được xem như định nghĩa các bảng tạm chỉ tồn tại cho đúng một query. Mỗi câu lệnh phụ trợ trong mệnh đề `WITH` có thể là `SELECT`, `INSERT`, `UPDATE`, `DELETE`, hoặc `MERGE`; và bản thân mệnh đề `WITH` được gắn vào một câu lệnh chính cũng có thể là `SELECT`, `INSERT`, `UPDATE`, `DELETE`, hoặc `MERGE`."

💡 **Ví dụ đời sống**
Nấu một món phức tạp. Bạn không đứng trộn tất cả nguyên liệu cùng lúc, mà làm từng bước có tên rõ ràng: *"nước dùng"*, *"phần thịt ướp"*, *"rau sống"*. Xong bước nào để riêng ra một tô có nhãn, bước sau lấy tô đó dùng tiếp. CTE chính là "cái tô có nhãn" đó — bạn đặt tên cho một kết quả trung gian, rồi các bước sau gọi nó bằng tên thay vì viết lại toàn bộ công thức lồng vào trong nhau.

### 5.1. `SELECT` trong `WITH` — chia nhỏ query phức tạp

📖 **Nguyên văn** (7.8.1. SELECT in WITH)
> "The basic value of SELECT in WITH is to break down complicated queries into simpler parts. An example is:"

🇻🇳 **Dịch**
> "Giá trị cơ bản của `SELECT` trong `WITH` là chia nhỏ các query phức tạp thành những phần đơn giản hơn. Một ví dụ là:"

```sql
WITH regional_sales AS (
    SELECT region, SUM(amount) AS total_sales
    FROM orders
    GROUP BY region
), top_regions AS (
    SELECT region
    FROM regional_sales
    WHERE total_sales > (SELECT SUM(total_sales)/10 FROM regional_sales)
)
SELECT region,
       product,
       SUM(quantity) AS product_units,
       SUM(amount) AS product_sales
FROM orders
WHERE region IN (SELECT region FROM top_regions)
GROUP BY region, product;
```

🇻🇳 Bước 1 tính tổng doanh số theo `region`; bước 2 lọc ra các region vượt 10% tổng; query chính thống kê doanh số theo product chỉ trong các region đó.

📖 **Nguyên văn**
> "which displays per-product sales totals in only the top sales regions. The WITH clause defines two auxiliary statements named regional_sales and top_regions, where the output of regional_sales is used in top_regions and the output of top_regions is used in the primary SELECT query. This example could have been written without WITH, but we'd have needed two levels of nested sub-SELECTs. It's a bit easier to follow this way."

🇻🇳 **Dịch**
> "câu này hiển thị tổng doanh số theo từng product chỉ trong các region bán chạy nhất. Mệnh đề `WITH` định nghĩa hai câu lệnh phụ trợ tên `regional_sales` và `top_regions`, trong đó output của `regional_sales` được dùng trong `top_regions` và output của `top_regions` được dùng trong query `SELECT` chính. Ví dụ này lẽ ra có thể viết mà không cần `WITH`, nhưng ta sẽ phải dùng **hai tầng sub-`SELECT` lồng nhau**. Viết theo cách này dễ theo dõi hơn một chút."

**Khi nào CTE dễ đọc hơn subquery lồng nhau?** Chính câu trên là câu trả lời của tài liệu: khi kết quả trung gian (a) cần **đặt tên** để hiểu ý nghĩa, (b) được dùng **ở nhiều chỗ** (ở đây `regional_sales` xuất hiện 2 lần trong `top_regions`), hoặc (c) khiến subquery phải lồng từ 2 tầng trở lên. Subquery lồng đọc từ trong ra ngoài; CTE đọc từ trên xuống dưới theo đúng thứ tự tư duy.

### 5.2. Materialization — CTE có được tính lại nhiều lần không?

📖 **Nguyên văn** (7.8.3. Common Table Expression Materialization)
> "A useful property of WITH queries is that they are normally evaluated only once per execution of the parent query, even if they are referred to more than once by the parent query or sibling WITH queries. Thus, expensive calculations that are needed in multiple places can be placed within a WITH query to avoid redundant work."

🇻🇳 **Dịch**
> "Một tính chất hữu ích của các query `WITH` là chúng thường **chỉ được đánh giá một lần** cho mỗi lần thực thi query cha, kể cả khi chúng được tham chiếu nhiều hơn một lần bởi query cha hoặc bởi các query `WITH` anh em. Nhờ vậy, những tính toán tốn kém cần dùng ở nhiều nơi có thể đặt trong một query `WITH` để tránh làm việc thừa."

📖 **Nguyên văn**
> "However, if a WITH query is non-recursive and side-effect-free (that is, it is a SELECT containing no volatile functions) then it can be folded into the parent query, allowing joint optimization of the two query levels. By default, this happens if the parent query references the WITH query just once, but not if it references the WITH query more than once. You can override that decision by specifying MATERIALIZED to force separate calculation of the WITH query, or by specifying NOT MATERIALIZED to force it to be merged into the parent query."

🇻🇳 **Dịch**
> "Tuy nhiên, nếu một query `WITH` là non-recursive và không có side effect (tức là một `SELECT` không chứa volatile function) thì nó có thể được gộp (fold) vào query cha, cho phép tối ưu hoá chung cả hai tầng query. Mặc định, điều này xảy ra khi query cha tham chiếu query `WITH` **đúng một lần**, nhưng không xảy ra nếu tham chiếu nhiều hơn một lần. Bạn có thể ghi đè quyết định đó bằng cách chỉ định `MATERIALIZED` để buộc tính riêng query `WITH`, hoặc chỉ định `NOT MATERIALIZED` để buộc nó được trộn vào query cha."

```sql
WITH w AS NOT MATERIALIZED (
    SELECT * FROM big_table
)
SELECT * FROM w AS w1 JOIN w AS w2 ON w1.key = w2.ref
WHERE w2.key = 123;
```

🇻🇳 `NOT MATERIALIZED` cho phép điều kiện `key = 123` của query cha được đẩy xuống thẳng vào việc quét `big_table` — nhờ đó dùng được index thay vì tạo bản sao tạm rồi self-join. (Xem [[04 - Indexes]].)

---

## 6. `RECURSIVE` CTE

📖 **Nguyên văn** (7.8.2. Recursive Queries)
> "The optional RECURSIVE modifier changes WITH from a mere syntactic convenience into a feature that accomplishes things not otherwise possible in standard SQL. Using RECURSIVE, a WITH query can refer to its own output. A very simple example is this query to sum the integers from 1 through 100:"

🇻🇳 **Dịch**
> "Modifier tuỳ chọn `RECURSIVE` biến `WITH` từ một tiện lợi cú pháp thuần tuý thành một tính năng làm được những việc mà chuẩn SQL không cách nào làm khác được. Dùng `RECURSIVE`, một query `WITH` có thể tham chiếu tới **chính output của nó**. Một ví dụ rất đơn giản là query tính tổng các số nguyên từ 1 tới 100:"

```sql
WITH RECURSIVE t(n) AS (
    VALUES (1)
  UNION ALL
    SELECT n+1 FROM t WHERE n < 100
)
SELECT sum(n) FROM t;
```

🇻🇳 `VALUES (1)` là điểm khởi đầu; `SELECT n+1 FROM t WHERE n < 100` sinh số tiếp theo dựa trên kết quả đã có; `sum(n)` cộng toàn bộ.

### 6.1. Cấu trúc bắt buộc: non-recursive term UNION [ALL] recursive term

📖 **Nguyên văn**
> "The general form of a recursive WITH query is always a non-recursive term, then UNION (or UNION ALL), then a recursive term, where only the recursive term can contain a reference to the query's own output. Such a query is executed as follows:"

🇻🇳 **Dịch**
> "Dạng tổng quát của một query `WITH` recursive luôn là một **non-recursive term**, rồi `UNION` (hoặc `UNION ALL`), rồi một **recursive term**, trong đó chỉ recursive term mới được chứa tham chiếu tới output của chính query đó. Một query như vậy được thực thi như sau:"

📖 **Nguyên văn** (Recursive Query Evaluation)
> "Evaluate the non-recursive term. For UNION (but not UNION ALL), discard duplicate rows. Include all remaining rows in the result of the recursive query, and also place them in a temporary working table.
> So long as the working table is not empty, repeat these steps:
> Evaluate the recursive term, substituting the current contents of the working table for the recursive self-reference. For UNION (but not UNION ALL), discard duplicate rows and rows that duplicate any previous result row. Include all remaining rows in the result of the recursive query, and also place them in a temporary intermediate table.
> Replace the contents of the working table with the contents of the intermediate table, then empty the intermediate table."

🇻🇳 **Dịch**
> "Đánh giá non-recursive term. Với `UNION` (nhưng không phải `UNION ALL`), loại bỏ các dòng trùng. Đưa tất cả các dòng còn lại vào kết quả của recursive query, đồng thời đặt chúng vào một **working table** tạm.
> Chừng nào working table còn chưa rỗng, lặp lại các bước sau:
> Đánh giá recursive term, thay thế nội dung hiện tại của working table vào chỗ tham chiếu đệ quy tới chính nó. Với `UNION` (nhưng không phải `UNION ALL`), loại bỏ các dòng trùng và các dòng trùng với bất kỳ dòng kết quả trước đó. Đưa tất cả các dòng còn lại vào kết quả của recursive query, đồng thời đặt chúng vào một **intermediate table** tạm.
> Thay nội dung của working table bằng nội dung của intermediate table, rồi làm rỗng intermediate table."

📖 **Nguyên văn** (Note)
> "While RECURSIVE allows queries to be specified recursively, internally such queries are evaluated iteratively."

🇻🇳 **Dịch**
> "Dù `RECURSIVE` cho phép viết query theo kiểu đệ quy, bên trong các query như vậy được đánh giá theo kiểu **lặp** (iteratively)."

📖 **Nguyên văn**
> "In the example above, the working table has just a single row in each step, and it takes on the values from 1 through 100 in successive steps. In the 100th step, there is no output because of the WHERE clause, and so the query terminates."

🇻🇳 **Dịch**
> "Trong ví dụ trên, working table chỉ có đúng một dòng ở mỗi bước, và nó lần lượt nhận các giá trị từ 1 tới 100 qua các bước kế tiếp. Ở bước thứ 100, không có output nào vì mệnh đề `WHERE`, nên query kết thúc."

### 6.2. Dữ liệu dạng cây

📖 **Nguyên văn**
> "Recursive queries are typically used to deal with hierarchical or tree-structured data. A useful example is this query to find all the direct and indirect sub-parts of a product, given only a table that shows immediate inclusions:"

🇻🇳 **Dịch**
> "Các recursive query thường được dùng để xử lý dữ liệu phân cấp hoặc dạng cây. Một ví dụ hữu ích là query tìm tất cả các sub-part trực tiếp và gián tiếp của một sản phẩm, khi chỉ có một bảng ghi các quan hệ chứa trực tiếp:"

```sql
WITH RECURSIVE included_parts(sub_part, part, quantity) AS (
    SELECT sub_part, part, quantity FROM parts WHERE part = 'our_product'
  UNION ALL
    SELECT p.sub_part, p.part, p.quantity * pr.quantity
    FROM included_parts pr, parts p
    WHERE p.part = pr.sub_part
)
SELECT sub_part, SUM(quantity) as total_quantity
FROM included_parts
GROUP BY sub_part
```

🇻🇳 Bắt đầu từ các part con trực tiếp của `'our_product'`, rồi lặp xuống từng tầng con của con, nhân dồn số lượng, cuối cùng cộng tổng theo `sub_part`.

💡 **Ví dụ đời sống**
Sơ đồ tổ chức công ty: bảng chỉ lưu "ai là sếp trực tiếp của ai". Câu hỏi *"toàn bộ nhân viên dưới quyền giám đốc A, kể cả cấp cháu chắt, là những ai?"* không thể trả lời bằng một `JOIN` — vì bạn không biết trước cây sâu bao nhiêu tầng. Recursive CTE giải đúng kiểu con người làm: **bắt đầu từ A**, liệt kê cấp dưới trực tiếp (non-recursive term), rồi với mỗi người vừa tìm được lại liệt kê cấp dưới của họ (recursive term), lặp tới khi không còn ai. Y hệt như duyệt một menu danh mục lồng nhau trên website bán hàng: Điện tử → Điện thoại → Phụ kiện → Ốp lưng.

### 6.3. Vòng lặp vô hạn

> [!danger] Recursive query có thể chạy mãi không dừng
> 📖 **Nguyên văn** (7.8.2.2. Cycle Detection)
> > "When working with recursive queries it is important to be sure that the recursive part of the query will eventually return no tuples, or else the query will loop indefinitely. Sometimes, using UNION instead of UNION ALL can accomplish this by discarding rows that duplicate previous output rows. However, often a cycle does not involve output rows that are completely duplicate: it may be necessary to check just one or a few fields to see if the same point has been reached before. The standard method for handling such situations is to compute an array of the already-visited values."
>
> 🇻🇳 **Dịch**
> > "Khi làm việc với recursive query, điều quan trọng là phải chắc chắn rằng phần đệ quy của query rốt cuộc sẽ không trả về tuple nào nữa, nếu không query sẽ **lặp vô hạn**. Đôi khi, dùng `UNION` thay cho `UNION ALL` đủ để đạt điều đó nhờ loại bỏ các dòng trùng với dòng output trước đó. Tuy nhiên, một chu trình (cycle) thường không gồm các dòng output trùng nhau hoàn toàn: có thể cần kiểm tra chỉ một hoặc vài field để biết đã từng tới cùng một điểm hay chưa. Phương pháp chuẩn để xử lý tình huống này là tính một mảng các giá trị đã ghé qua."

📖 **Nguyên văn**
> "This query will loop if the link relationships contain cycles. Because we require a “depth” output, just changing UNION ALL to UNION would not eliminate the looping. Instead we need to recognize whether we have reached the same row again while following a particular path of links. We add two columns is_cycle and path to the loop-prone query:"

🇻🇳 **Dịch**
> "Query này sẽ lặp vô hạn nếu các quan hệ `link` chứa cycle. Vì ta cần một output “depth”, việc chỉ đổi `UNION ALL` thành `UNION` sẽ không loại bỏ được vòng lặp. Thay vào đó ta cần nhận ra liệu đã gặp lại cùng một dòng trong khi đi theo một đường link cụ thể hay chưa. Ta thêm hai cột `is_cycle` và `path` vào query dễ bị lặp:"

```sql
WITH RECURSIVE search_graph(id, link, data, depth, is_cycle, path) AS (
    SELECT g.id, g.link, g.data, 0,
      false,
      ARRAY[g.id]
    FROM graph g
  UNION ALL
    SELECT g.id, g.link, g.data, sg.depth + 1,
      g.id = ANY(path),
      path || g.id
    FROM graph g, search_graph sg
    WHERE g.id = sg.link AND NOT is_cycle
)
SELECT * FROM search_graph;
```

🇻🇳 `path` tích luỹ danh sách các `id` đã đi qua; `is_cycle` bật true khi `id` mới đã có trong `path`; `WHERE ... AND NOT is_cycle` chặn không đi tiếp → dừng vòng lặp.

📖 **Nguyên văn** (cú pháp `CYCLE` dựng sẵn)
> "There is built-in syntax to simplify cycle detection. The above query can also be written like this:"

🇻🇳 **Dịch**
> "Có cú pháp dựng sẵn để đơn giản hoá việc phát hiện cycle. Query ở trên cũng có thể viết như sau:"

```sql
WITH RECURSIVE search_graph(id, link, data, depth) AS (
    SELECT g.id, g.link, g.data, 1
    FROM graph g
  UNION ALL
    SELECT g.id, g.link, g.data, sg.depth + 1
    FROM graph g, search_graph sg
    WHERE g.id = sg.link
) CYCLE id SET is_cycle USING path
SELECT * FROM search_graph;
```

🇻🇳 Mệnh đề `CYCLE id SET is_cycle USING path` làm đúng việc của khối thủ công ở trên, PostgreSQL tự viết lại bên trong.

📖 **Nguyên văn** (mẹo test)
> "A helpful trick for testing queries when you are not certain if they might loop is to place a LIMIT in the parent query. For example, this query would loop forever without the LIMIT:"

🇻🇳 **Dịch**
> "Một mẹo hữu ích khi test query mà bạn không chắc nó có lặp vô hạn hay không là đặt một `LIMIT` ở query cha. Ví dụ, query sau sẽ lặp mãi mãi nếu không có `LIMIT`:"

```sql
WITH RECURSIVE t(n) AS (
    SELECT 1
  UNION ALL
    SELECT n+1 FROM t
)
SELECT n FROM t LIMIT 100;
```

🇻🇳 Recursive term không có điều kiện dừng; chỉ nhờ `LIMIT 100` ở query cha mà nó ngừng lại.

📖 **Nguyên văn**
> "This works because PostgreSQL's implementation evaluates only as many rows of a WITH query as are actually fetched by the parent query. Using this trick in production is not recommended, because other systems might work differently."

🇻🇳 **Dịch**
> "Cách này hoạt động được vì cài đặt của PostgreSQL chỉ đánh giá đúng số dòng của query `WITH` mà query cha thực sự lấy về. **Không khuyến nghị dùng mẹo này trong production**, vì các hệ khác có thể hoạt động khác."

### 6.4. `SEARCH` — thứ tự duyệt cây

📖 **Nguyên văn** (7.8.2.1. Search Order)
> "When computing a tree traversal using a recursive query, you might want to order the results in either depth-first or breadth-first order. This can be done by computing an ordering column alongside the other data columns and using that to sort the results at the end. Note that this does not actually control in which order the query evaluation visits the rows; that is as always in SQL implementation-dependent."

🇻🇳 **Dịch**
> "Khi tính một phép duyệt cây bằng recursive query, bạn có thể muốn sắp xếp kết quả theo thứ tự depth-first hoặc breadth-first. Việc này làm được bằng cách tính thêm một cột sắp xếp bên cạnh các cột dữ liệu rồi dùng nó để sort kết quả ở cuối. Lưu ý rằng điều này **không** thực sự điều khiển thứ tự mà query đi thăm các dòng; thứ tự đó, như mọi khi trong SQL, phụ thuộc vào implementation."

```sql
WITH RECURSIVE search_tree(id, link, data) AS (
    SELECT t.id, t.link, t.data
    FROM tree t
  UNION ALL
    SELECT t.id, t.link, t.data
    FROM tree t, search_tree st
    WHERE t.id = st.link
) SEARCH DEPTH FIRST BY id SET ordercol
SELECT * FROM search_tree ORDER BY ordercol;
```

🇻🇳 `SEARCH DEPTH FIRST BY id SET ordercol` tạo thêm cột `ordercol` để `ORDER BY` cho ra thứ tự depth-first (đổi thành `SEARCH BREADTH FIRST` để có breadth-first).

---

## 7. Data-Modifying Statements trong `WITH`

Các câu lệnh `INSERT` / `UPDATE` / `DELETE` đã học ở [[08 - INSERT, UPDATE, DELETE]] cũng có thể đặt thẳng trong `WITH`.

📖 **Nguyên văn** (7.8.4. Data-Modifying Statements in WITH)
> "You can use data-modifying statements (INSERT, UPDATE, DELETE, or MERGE) in WITH. This allows you to perform several different operations in the same query. An example is:"

🇻🇳 **Dịch**
> "Bạn có thể dùng các câu lệnh sửa đổi dữ liệu (`INSERT`, `UPDATE`, `DELETE`, hoặc `MERGE`) trong `WITH`. Điều này cho phép bạn thực hiện nhiều thao tác khác nhau trong cùng một query. Một ví dụ là:"

```sql
WITH moved_rows AS (
    DELETE FROM products
    WHERE
        "date" >= '2010-10-01' AND
        "date" < '2010-11-01'
    RETURNING *
)
INSERT INTO products_log
SELECT * FROM moved_rows;
```

🇻🇳 Xoá các dòng tháng 10/2010 khỏi `products`, lấy lại chúng qua `RETURNING *`, rồi chèn vào `products_log` — tức là "chuyển" dữ liệu sang bảng log trong một câu lệnh.

📖 **Nguyên văn**
> "This query effectively moves rows from products to products_log. The DELETE in WITH deletes the specified rows from products, returning their contents by means of its RETURNING clause; and then the primary query reads that output and inserts it into products_log."

🇻🇳 **Dịch**
> "Query này thực chất chuyển các dòng từ `products` sang `products_log`. Câu `DELETE` trong `WITH` xoá các dòng đã chỉ định khỏi `products`, trả lại nội dung của chúng thông qua mệnh đề `RETURNING`; rồi query chính đọc output đó và chèn vào `products_log`."

📖 **Nguyên văn**
> "A fine point of the above example is that the WITH clause is attached to the INSERT, not the sub-SELECT within the INSERT. This is necessary because data-modifying statements are only allowed in WITH clauses that are attached to the top-level statement."

🇻🇳 **Dịch**
> "Một điểm tinh tế của ví dụ trên là mệnh đề `WITH` được gắn vào `INSERT`, chứ không phải vào sub-`SELECT` bên trong `INSERT`. Điều này là bắt buộc vì các câu lệnh sửa đổi dữ liệu chỉ được phép nằm trong mệnh đề `WITH` gắn vào câu lệnh ở mức top-level."

📖 **Nguyên văn**
> "Data-modifying statements in WITH usually have RETURNING clauses (see Section 6.4), as shown in the example above. It is the output of the RETURNING clause, not the target table of the data-modifying statement, that forms the temporary table that can be referred to by the rest of the query. If a data-modifying statement in WITH lacks a RETURNING clause, then it forms no temporary table and cannot be referred to in the rest of the query. Such a statement will be executed nonetheless."

🇻🇳 **Dịch**
> "Các câu lệnh sửa đổi dữ liệu trong `WITH` thường có mệnh đề `RETURNING` (xem Section 6.4), như trong ví dụ trên. Chính output của mệnh đề `RETURNING`, chứ không phải bảng đích của câu lệnh, mới tạo thành bảng tạm mà phần còn lại của query có thể tham chiếu. Nếu một câu lệnh sửa đổi dữ liệu trong `WITH` thiếu mệnh đề `RETURNING` thì nó không tạo bảng tạm nào và không thể được tham chiếu ở phần còn lại của query. Dù vậy câu lệnh đó **vẫn được thực thi**."

> [!danger] Thứ tự thực thi không đoán trước được
> 📖 **Nguyên văn**
> > "Data-modifying statements in WITH are executed exactly once, and always to completion, independently of whether the primary query reads all (or indeed any) of their output."
>
> 🇻🇳 **Dịch**
> > "Các câu lệnh sửa đổi dữ liệu trong `WITH` được thực thi **đúng một lần và luôn chạy tới hết**, bất kể query chính có đọc toàn bộ (hay có đọc chút nào) output của chúng hay không."
>
> 📖 **Nguyên văn**
> > "The sub-statements in WITH are executed concurrently with each other and with the main query. Therefore, when using data-modifying statements in WITH, the order in which the specified updates actually happen is unpredictable. All the statements are executed with the same snapshot (see Chapter 13), so they cannot “see” one another's effects on the target tables."
>
> 🇻🇳 **Dịch**
> > "Các câu lệnh con trong `WITH` được thực thi đồng thời với nhau và với query chính. Do đó, khi dùng câu lệnh sửa đổi dữ liệu trong `WITH`, **thứ tự các cập nhật thực sự xảy ra là không đoán trước được**. Tất cả các câu lệnh được thực thi với cùng một snapshot (xem Chapter 13), nên chúng không thể “thấy” tác động của nhau lên các bảng đích."
>
> (Khái niệm snapshot đã nói ở [[05 - Transactions, ACID và MVCC]].)
>
> 📖 **Nguyên văn**
> > "Trying to update the same row twice in a single statement is not supported. Only one of the modifications takes place, but it is not easy (and sometimes not possible) to reliably predict which one."
>
> 🇻🇳 **Dịch**
> > "Cố gắng cập nhật cùng một dòng hai lần trong một câu lệnh là **không được hỗ trợ**. Chỉ một trong các sửa đổi diễn ra, nhưng không dễ (và đôi khi không thể) đoán chắc được là cái nào."

---

## 8. Set Operations: `UNION`, `INTERSECT`, `EXCEPT`

📖 **Nguyên văn** (7.4. Combining Queries)
> "The results of two queries can be combined using the set operations union, intersection, and difference. The syntax is"

🇻🇳 **Dịch**
> "Kết quả của hai query có thể được kết hợp bằng các phép toán tập hợp: hợp (union), giao (intersection) và hiệu (difference). Cú pháp là"

```sql
query1 UNION [ALL] query2
query1 INTERSECT [ALL] query2
query1 EXCEPT [ALL] query2
```

🇻🇳 Ba phép toán tập hợp, mỗi phép có biến thể `ALL` để giữ lại dòng trùng.

### 8.1. `UNION` vs `UNION ALL`

📖 **Nguyên văn**
> "UNION effectively appends the result of query2 to the result of query1 (although there is no guarantee that this is the order in which the rows are actually returned). Furthermore, it eliminates duplicate rows from its result, in the same way as DISTINCT, unless UNION ALL is used."

🇻🇳 **Dịch**
> "`UNION` thực chất nối kết quả của `query2` vào sau kết quả của `query1` (dù không có gì đảm bảo các dòng thực sự được trả về theo thứ tự đó). Hơn nữa, nó **loại bỏ các dòng trùng** khỏi kết quả, theo cách giống như `DISTINCT`, trừ khi dùng `UNION ALL`."

> [!tip] Khác biệt cốt lõi
> - `UNION` → khử trùng (phải sort/hash toàn bộ kết quả để so sánh → tốn công hơn).
> - `UNION ALL` → **giữ nguyên mọi dòng**, kể cả trùng → nhanh hơn.
> Nếu bạn biết chắc hai tập không giao nhau, dùng `UNION ALL`. Đây cũng là lý do recursive CTE ở mục 6 hay dùng `UNION ALL`.

### 8.2. `INTERSECT` và `EXCEPT`

📖 **Nguyên văn**
> "INTERSECT returns all rows that are both in the result of query1 and in the result of query2. Duplicate rows are eliminated unless INTERSECT ALL is used."

🇻🇳 **Dịch**
> "`INTERSECT` trả về tất cả các dòng vừa có trong kết quả của `query1` vừa có trong kết quả của `query2`. Các dòng trùng bị loại bỏ trừ khi dùng `INTERSECT ALL`."

📖 **Nguyên văn**
> "EXCEPT returns all rows that are in the result of query1 but not in the result of query2. (This is sometimes called the difference between two queries.) Again, duplicates are eliminated unless EXCEPT ALL is used."

🇻🇳 **Dịch**
> "`EXCEPT` trả về tất cả các dòng có trong kết quả của `query1` nhưng **không** có trong kết quả của `query2`. (Cái này đôi khi được gọi là hiệu của hai query.) Một lần nữa, các dòng trùng bị loại bỏ trừ khi dùng `EXCEPT ALL`."

### 8.3. Điều kiện "union compatible"

📖 **Nguyên văn**
> "In order to calculate the union, intersection, or difference of two queries, the two queries must be “union compatible”, which means that they return the same number of columns and the corresponding columns have compatible data types, as described in Section 10.5."

🇻🇳 **Dịch**
> "Để tính hợp, giao, hay hiệu của hai query, hai query đó phải **“union compatible”**, nghĩa là chúng trả về **cùng số cột** và các cột tương ứng có **kiểu dữ liệu tương thích**, như mô tả ở Section 10.5."

(Kiểu dữ liệu đã học ở [[02 - Tables, Data Types và Constraints]].)

### 8.4. Thứ tự ưu tiên

📖 **Nguyên văn**
> "As shown here, you can use parentheses to control the order of evaluation. Without parentheses, UNION and EXCEPT associate left-to-right, but INTERSECT binds more tightly than those two operators."

🇻🇳 **Dịch**
> "Như đã thấy ở đây, bạn có thể dùng dấu ngoặc đơn để điều khiển thứ tự đánh giá. Không có ngoặc, `UNION` và `EXCEPT` kết hợp từ trái sang phải, nhưng `INTERSECT` **bám chặt hơn** hai operator kia."

```sql
query1 UNION query2 INTERSECT query3
```

🇻🇳 Không có ngoặc, câu này được hiểu là:

```sql
query1 UNION (query2 INTERSECT query3)
```

🇻🇳 `INTERSECT` được tính trước, rồi mới `UNION`.

📖 **Nguyên văn**
> "You can also surround an individual query with parentheses. This is important if the query needs to use any of the clauses discussed in following sections, such as LIMIT. Without parentheses, you'll get a syntax error, or else the clause will be understood as applying to the output of the set operation rather than one of its inputs. For example,"

🇻🇳 **Dịch**
> "Bạn cũng có thể bọc một query riêng lẻ bằng dấu ngoặc. Điều này quan trọng nếu query cần dùng bất kỳ mệnh đề nào bàn ở các mục sau, như `LIMIT`. Không có ngoặc, bạn sẽ gặp lỗi cú pháp, hoặc mệnh đề đó sẽ được hiểu là áp dụng cho output của phép toán tập hợp chứ không phải cho một trong các input của nó. Ví dụ,"

```sql
SELECT a FROM b UNION SELECT x FROM y LIMIT 10
```

🇻🇳 Câu này được PostgreSQL hiểu là `(SELECT a FROM b UNION SELECT x FROM y) LIMIT 10` — `LIMIT` áp lên kết quả hợp, **không** phải lên `SELECT x FROM y`.

---

## 9. 🔌 Liên hệ stack thực tế

> Phần này là ghi chú riêng, KHÔNG trích từ tài liệu PostgreSQL.

Firestore không có subquery, không có `JOIN`, không có CTE và không có set operation — mọi phép "ghép" phải làm ở phía ứng dụng bằng JavaScript sau khi đọc nhiều collection. Thói quen viết CTE ở PostgreSQL — *chia bài toán thành các bước có tên* — vẫn áp dụng được: ở Firestore nó trở thành các hàm JS trung gian đặt tên rõ ràng, mỗi hàm trả về một mảng kết quả cho bước sau dùng.

Riêng dữ liệu dạng cây (danh mục lồng nhau, cây tổ chức): PostgreSQL giải bằng một recursive CTE trong một round-trip; Firestore thì phải đọc từng tầng bằng nhiều lần query — đúng bản chất vấn đề đã mô tả ở [[07 - N+1 Problem]].

Không nêu tên API hay giới hạn cụ thể của Firestore ở đây vì chưa tra tài liệu chính thức trong bài này.

---

## Liên kết
- Bài trước: [[08 - INSERT, UPDATE, DELETE]]
- Bài kế: [[10 - Views và Schemas]]
- Liên quan: [[03 - Queries - SELECT, JOIN, Aggregate]] — `SELECT`, `JOIN`, `GROUP BY`, aggregate, `DISTINCT`
- Liên quan: [[02 - Tables, Data Types và Constraints]] — kiểu dữ liệu (điều kiện union compatible)
- Liên quan: [[04 - Indexes]] — vì sao `NOT MATERIALIZED` giúp dùng được index
- Liên quan: [[05 - Transactions, ACID và MVCC]] — snapshot dùng chung cho các sub-statement trong `WITH`
- Liên quan: [[07 - N+1 Problem]] — gộp N query thành 1 bằng `IN` / `JOIN` / CTE
- Quay lại mục lục: [[00 - Tổng hợp (Relational Databases)]]

## Nguồn tham khảo
- PostgreSQL 18 Documentation — *7.8. WITH Queries (Common Table Expressions)* : https://www.postgresql.org/docs/current/queries-with.html
- PostgreSQL 18 Documentation — *7.4. Combining Queries (UNION, INTERSECT, EXCEPT)* : https://www.postgresql.org/docs/current/queries-union.html
- PostgreSQL 18 Documentation — *9.24. Subquery Expressions* : https://www.postgresql.org/docs/current/functions-subquery.html
- PostgreSQL 18 Documentation — *4.2. Value Expressions* (mục 4.2.11 Scalar Subqueries) : https://www.postgresql.org/docs/current/sql-expressions.html
- PostgreSQL 18 Documentation — *7.2. Table Expressions* (mục 7.2.1.3 Subqueries, 7.2.1.5 LATERAL Subqueries) : https://www.postgresql.org/docs/current/queries-table-expressions.html
- Trang nguồn không có hình minh hoạ → bài này không có ảnh.
