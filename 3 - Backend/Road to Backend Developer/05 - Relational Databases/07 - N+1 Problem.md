# 07 — N+1 Problem

> **Nguồn chính:** Backend Developer Roadmap — node `N plus one problem` — https://roadmap.sh/backend
> **Nguồn phụ (bên thứ ba, do roadmap.sh đề xuất):** PlanetScale Blog — https://planetscale.com/blog/what-is-n-1-query-problem-and-how-to-solve-it
> **Nguồn chính thống cho phần chẩn đoán & cách sửa:** PostgreSQL 18 Documentation — `14.1. Using EXPLAIN`, `2.6. Joins Between Tables`, `9.24. Subquery Expressions`
> Bài này giải thích N+1 problem: nó là gì, vì sao xảy ra, cách phát hiện bằng `EXPLAIN` / query log, và ba hướng sửa.

---

## 1. N+1 problem là gì

📖 **Nguyên văn** — mô tả node trên Backend Developer Roadmap
> "The N+1 problem occurs when an application retrieves a list then performs additional queries for each item's related data. Results in inefficient query multiplication (1 + N queries instead of optimized joins). Severely impacts performance with larger datasets. Solved through query optimization, joins, or batching techniques."

🇻🇳 **Dịch**
> "N+1 problem xảy ra khi một application lấy về một danh sách rồi thực hiện thêm các query cho dữ liệu liên quan của từng item. Kết quả là số lượng query bị nhân lên một cách kém hiệu quả (1 + N query thay vì các join đã được tối ưu). Ảnh hưởng nghiêm trọng tới performance với các tập dữ liệu lớn. Được giải quyết bằng query optimization, join, hoặc các kỹ thuật batching."

💡 **Ví dụ đời sống**
Bạn cần nấu một bữa ăn 10 món. Có hai cách đi chợ:

- **Cách N+1:** ra chợ hỏi "hôm nay có những món gì" (1 chuyến), rồi cứ mỗi nguyên liệu lại **đi một chuyến riêng** để mua — 10 chuyến nữa. Tổng 11 chuyến. Mỗi chuyến đều mất thời gian đi-về như nhau, dù chỉ mua một bó hành.
- **Cách JOIN:** viết sẵn danh sách, **đi một chuyến duy nhất**, mua hết mọi thứ.

Điểm mấu chốt: cái đắt không phải là "lấy bó hành", mà là **chuyến đi** (round-trip). Database cũng vậy — chi phí lớn nằm ở việc gửi query qua mạng và chờ kết quả về, chứ không phải ở độ phức tạp của một câu query đơn giản.

---

## 2. Vì sao gọi là "N+1"

📖 **Nguyên văn** — PlanetScale Blog, mục *What caused the N+1 query problem?* (nguồn bên thứ ba, KHÔNG phải tài liệu chính thống)
> "This type of query execution is often called "N+1 queries" because instead of doing the work in a single query, you are running one query to get the list of categories, then another query for every N categories. Hence the term "N+1 queries"."

🇻🇳 **Dịch**
> "Kiểu thực thi query này thường được gọi là "N+1 queries" bởi vì thay vì làm xong việc trong một query duy nhất, bạn chạy một query để lấy danh sách các category, rồi thêm một query nữa cho mỗi trong số N category đó. Do vậy mới có thuật ngữ "N+1 queries"."

Tức là:

| Thành phần | Số query | Làm gì |
|---|---|---|
| **1** | 1 | Query lấy danh sách cha (ví dụ: tất cả categories) |
| **N** | N | Với mỗi item trong danh sách, thêm 1 query lấy dữ liệu liên quan |
| **Tổng** | **N + 1** | |

📖 **Nguyên văn** — PlanetScale Blog, mục *What is the N+1 query problem?*
> "You might expect that many small queries would be fast and one large, complex query will be slow. This is rarely the case. In practice, the opposite is true. Each query has to be sent to the database, the database has to perform the query, then it sends the results back to your app. The more queries you perform, the more time it takes to get the results back, with each trip to the database server taking time and resources."

🇻🇳 **Dịch**
> "Bạn có thể nghĩ rằng nhiều query nhỏ sẽ nhanh còn một query lớn, phức tạp sẽ chậm. Điều đó hiếm khi đúng. Trong thực tế thì ngược lại. Mỗi query đều phải được gửi tới database, database phải thực thi query đó, rồi gửi kết quả về lại app của bạn. Bạn chạy càng nhiều query thì càng tốn thời gian để lấy kết quả về, mỗi chuyến đi tới database server đều tốn thời gian và tài nguyên."

> [!note] Số liệu thực đo từ bài PlanetScale
> 📖 **Nguyên văn**
> > "In the above example, our database contains about 800 items across 17 categories. It takes over 1 second to run the 18 simple queries involved in this!"
>
> 🇻🇳 **Dịch**
> > "Trong ví dụ ở trên, database của chúng tôi chứa khoảng 800 item thuộc 17 category. Phải mất hơn 1 giây để chạy 18 query đơn giản liên quan!"
>
> 17 category → 17 query con + 1 query danh sách = 18 query. Đúng công thức N+1.

---

## 3. Minh hoạ bằng SQL: chuỗi query BỊ N+1

> [!warning] Phần SQL dưới đây là **ví dụ minh hoạ tự viết**, KHÔNG trích từ tài liệu nguồn nào.
> Mục đích chỉ để thấy rõ hình dạng của chuỗi query. Bảng `categories` / `items` mượn theo kịch bản của bài PlanetScale.

**Query thứ 1** — lấy danh sách cha:

```sql
SELECT id, name FROM categories ORDER BY name;
```

Giả sử trả về 3 dòng: `1 = Produce`, `2 = Deli`, `3 = Dairy`.

**Query thứ 2 → thứ N+1** — application lặp qua từng dòng và bắn thêm một query cho mỗi dòng:

```sql
SELECT id, name FROM items WHERE category_id = 1 ORDER BY name;
SELECT id, name FROM items WHERE category_id = 2 ORDER BY name;
SELECT id, name FROM items WHERE category_id = 3 ORDER BY name;
```

Tổng cộng: **1 + 3 = 4 query** cho 3 category. Với 17 category thì là 18 query; với 1000 category thì là 1001 query.

> [!danger] Vấn đề không nằm ở SQL, mà nằm ở code application
> Từng câu query ở trên đều hoàn toàn hợp lệ và nhanh. Cái sai là **vòng lặp trong code gọi database**. Nhìn vào riêng một câu query sẽ không bao giờ phát hiện được N+1 — phải nhìn vào **số lần** nó được gọi.

---

## 4. Ba hướng sửa

### 4.1. Hướng 1 — JOIN: gộp thành 1 query

Đây là cách sửa chính mà roadmap node nhắc tới ("instead of optimized joins").

📖 **Nguyên văn** — PostgreSQL Documentation, `2.6. Joins Between Tables`
> "Thus far, our queries have only accessed one table at a time. Queries can access multiple tables at once, or access the same table in such a way that multiple rows of the table are being processed at the same time. Queries that access multiple tables (or multiple instances of the same table) at one time are called join queries. They combine rows from one table with rows from a second table, with an expression specifying which rows are to be paired."

🇻🇳 **Dịch**
> "Cho tới giờ, các query của chúng ta mới chỉ truy cập một table tại một thời điểm. Query có thể truy cập nhiều table cùng lúc, hoặc truy cập cùng một table theo cách mà nhiều row của table đó được xử lý cùng lúc. Những query truy cập nhiều table (hoặc nhiều instance của cùng một table) tại một thời điểm được gọi là join query. Chúng kết hợp các row từ một table với các row từ table thứ hai, bằng một expression chỉ rõ những row nào sẽ được ghép cặp."

📖 **Nguyên văn** — cú pháp JOIN, PostgreSQL Documentation, `2.6. Joins Between Tables`
```sql
SELECT * FROM weather JOIN cities ON city = name;
```

🇻🇳 Câu lệnh này ghép mỗi row của table `weather` với row của table `cities` có `weather.city = cities.name`, trả về tất cả trong **một** query duy nhất — thay vì phải query `cities` riêng cho từng row của `weather`.

📖 **Nguyên văn** — PostgreSQL Documentation, `2.6. Joins Between Tables`, về việc chỉ định rõ tên table
```sql
SELECT weather.city, weather.temp_lo, weather.temp_hi,
       weather.prcp, weather.date, cities.location
    FROM weather JOIN cities ON weather.city = cities.name;
```

🇻🇳 Cùng một join nhưng ghi rõ tên table trước mỗi column, để tránh nhập nhằng khi hai table có column trùng tên.

📖 **Nguyên văn** — lời khuyên đi kèm, `2.6. Joins Between Tables`
> "It is widely considered good style to qualify all column names in a join query, so that the query won't fail if a duplicate column name is later added to one of the tables."

🇻🇳 **Dịch**
> "Việc ghi rõ tên table cho tất cả column trong một join query được xem rộng rãi là phong cách tốt, để query không bị lỗi nếu sau này có ai đó thêm một column trùng tên vào một trong các table."

> [!tip] Lưu ý về `LEFT JOIN`
> 📖 **Nguyên văn** — `2.6. Joins Between Tables`
> > "There is no result row for the city of Hayward. This is because there is no matching entry in the cities table for Hayward, so the join ignores the unmatched rows in the weather table."
>
> 🇻🇳 **Dịch**
> > "Không có row kết quả nào cho thành phố Hayward. Lý do là trong table `cities` không có entry nào khớp với Hayward, nên join bỏ qua các row không khớp trong table `weather`."
>
> Nghĩa là `JOIN` thường sẽ **làm mất** các category không có item nào. Nếu cần giữ lại thì dùng `LEFT JOIN` — bài PlanetScale cũng ghi chú đúng điều này ngay trong SQL của họ: 📖 `-- Using a normal JOIN would not get the categories with 0 items` — 🇻🇳 "Dùng JOIN thường sẽ không lấy được các category có 0 item".

Chi tiết về JOIN đã ghi ở [[03 - Queries - SELECT, JOIN, Aggregate]].

---

### 4.2. Hướng 2 — Batching bằng `WHERE id IN (...)`: 2 query thay vì N+1

Khi không tiện gộp thành một JOIN (ví dụ hai bên đến từ hai service khác nhau, hoặc muốn giữ shape dữ liệu tách biệt), có thể **gom N query thành 1**: lấy danh sách id ở query đầu, rồi truyền cả nhóm id đó vào **một** query thứ hai.

📖 **Nguyên văn** — PostgreSQL Documentation, `9.24.2. IN`
```sql
expression IN (subquery)
```

🇻🇳 Dạng tổng quát của `IN`: so sánh một expression bên trái với tập giá trị bên phải.

📖 **Nguyên văn** — PostgreSQL Documentation, `9.24.2. IN`
> "The right-hand side is a parenthesized subquery, which must return exactly one column. The left-hand expression is evaluated and compared to each row of the subquery result. The result of IN is "true" if any equal subquery row is found. The result is "false" if no equal row is found (including the case where the subquery returns no rows)."

🇻🇳 **Dịch**
> "Vế phải là một subquery đặt trong ngoặc, subquery này phải trả về đúng một column. Expression ở vế trái được tính toán rồi đem so sánh với từng row trong kết quả của subquery. Kết quả của `IN` là "true" nếu tìm thấy bất kỳ row nào bằng nó. Kết quả là "false" nếu không tìm thấy row nào bằng (kể cả trường hợp subquery không trả về row nào)."

📖 **Nguyên văn** — PostgreSQL Documentation, `9.24.4. ANY/SOME`
> "SOME is a synonym for ANY. IN is equivalent to = ANY."

🇻🇳 **Dịch**
> "`SOME` là từ đồng nghĩa của `ANY`. `IN` tương đương với `= ANY`."

> [!warning] SQL dưới đây là **ví dụ minh hoạ tự viết**, không trích nguồn.

```sql
-- Query 1: lấy danh sách cha
SELECT id, name FROM categories ORDER BY name;

-- Query 2: lấy TẤT CẢ item của TẤT CẢ category trong một lần
SELECT id, name, category_id
  FROM items
 WHERE category_id IN (1, 2, 3)
 ORDER BY category_id, name;
```

Sau đó application tự nhóm kết quả của query 2 theo `category_id` trong bộ nhớ. **Tổng: 2 query, bất kể N lớn bao nhiêu.**

> [!note] Vì sao đôi khi chọn batching thay vì JOIN
> JOIN trả về dữ liệu cha bị **lặp lại** trên mỗi row con (mỗi item kéo theo một bản sao của tên category). Batching trả về mỗi bên đúng một lần, đổi lại phải tự ghép trong code. Cả hai đều chỉ tốn số round-trip hằng số — đó mới là điều quan trọng.

---

### 4.3. Hướng 3 — Eager loading trong ORM (ghi chú khái niệm)

> [!note] Phần này là ghi chú khái niệm, KHÔNG trích từ tài liệu chính thống của bất kỳ ORM nào.

Phần lớn N+1 trong thực tế **không phải do lập trình viên tự viết vòng lặp SQL**, mà do ORM: khi truy cập một quan hệ (`category.items`) trên từng object trong một danh sách, ORM âm thầm bắn một query cho mỗi lần truy cập. Đây gọi là **lazy loading**.

Cách sửa ở tầng ORM gọi là **eager loading**: báo trước cho ORM rằng "tôi sẽ cần quan hệ này cho cả danh sách", để nó tự chuyển thành một JOIN hoặc một batched query (`IN (...)`) — đúng hai hướng đã trình bày ở 4.1 và 4.2.

Cú pháp cụ thể khác nhau theo từng ORM nên **không ghi ở đây** — cần tra chính tài liệu của ORM đang dùng. Bài PlanetScale có nhắc tới một cơ chế của Laravel:

📖 **Nguyên văn** — PlanetScale Blog, mục *Identifying N+1 queries* (nguồn bên thứ ba)
> "Laravel also allows you to fully disable N+1 queries by adding the following line to your AppServiceProvider inside the boot method:"

🇻🇳 **Dịch**
> "Laravel cũng cho phép bạn vô hiệu hoá hoàn toàn các N+1 query bằng cách thêm dòng sau vào `AppServiceProvider` bên trong method `boot`:"

📖 **Nguyên văn** — cùng nguồn
```php
Model::preventLazyLoading(!app()->isProduction());
```

🇻🇳 Dòng này bật chế độ cấm lazy loading khi không chạy ở production.

📖 **Nguyên văn** — cùng nguồn
> "This will cause the application to throw an exception if it detects an N+1 query when not in production, allowing you to detect and fix these issues."

🇻🇳 **Dịch**
> "Điều này khiến application ném ra một exception nếu nó phát hiện một N+1 query khi không ở môi trường production, cho phép bạn phát hiện và sửa các vấn đề này."

Ý tưởng đáng học ở đây không phải là cú pháp Laravel, mà là **nguyên tắc**: biến N+1 từ "lỗi performance âm thầm" thành "lỗi nổ ngay ở môi trường dev".

---

## 5. Chẩn đoán: `EXPLAIN` và query log

### 5.1. `EXPLAIN` — xem query planner định làm gì

📖 **Nguyên văn** — PostgreSQL Documentation, `14.1.1. EXPLAIN Basics`
> "The structure of a query plan is a tree of plan nodes. Nodes at the bottom level of the tree are scan nodes: they return raw rows from a table. There are different types of scan nodes for different table access methods: sequential scans, index scans, and bitmap index scans. [...] The output of EXPLAIN has one line for each node in the plan tree, showing the basic node type plus the cost estimates that the planner made for the execution of that plan node."

🇻🇳 **Dịch**
> "Cấu trúc của một query plan là một cây gồm các plan node. Các node ở tầng dưới cùng của cây là scan node: chúng trả về các row thô từ một table. Có nhiều loại scan node khác nhau ứng với các cách truy cập table khác nhau: sequential scan, index scan, và bitmap index scan. [...] Output của `EXPLAIN` có một dòng cho mỗi node trong cây plan, hiển thị loại node cơ bản cùng với ước lượng chi phí mà planner đưa ra cho việc thực thi plan node đó."

📖 **Nguyên văn** — ví dụ tối giản, `14.1.1. EXPLAIN Basics`
```sql
EXPLAIN SELECT * FROM tenk1;

                         QUERY PLAN
-------------------------------------------------------------
 Seq Scan on tenk1  (cost=0.00..445.00 rows=10000 width=244)
```

🇻🇳 `EXPLAIN` in ra kế hoạch thực thi mà không chạy query; ở đây planner chọn quét tuần tự toàn bộ table `tenk1`.

### 5.2. `EXPLAIN ANALYZE` — thực sự chạy và đo

📖 **Nguyên văn** — PostgreSQL Documentation, `14.1.2. EXPLAIN ANALYZE`
> "It is possible to check the accuracy of the planner's estimates by using EXPLAIN's ANALYZE option. With this option, EXPLAIN actually executes the query, and then displays the true row counts and true run time accumulated within each plan node, along with the same estimates that a plain EXPLAIN shows."

🇻🇳 **Dịch**
> "Có thể kiểm tra độ chính xác của các ước lượng mà planner đưa ra bằng cách dùng option `ANALYZE` của `EXPLAIN`. Với option này, `EXPLAIN` thực sự thực thi query, rồi hiển thị số row thật và thời gian chạy thật được tích luỹ trong từng plan node, cùng với chính những ước lượng mà một lệnh `EXPLAIN` thường hiển thị."

📖 **Nguyên văn** — trích một phần output ví dụ, `14.1.2. EXPLAIN ANALYZE`
```sql
EXPLAIN ANALYZE SELECT *
FROM tenk1 t1, tenk2 t2
WHERE t1.unique1 < 10 AND t1.unique2 = t2.unique2;
```

🇻🇳 Chạy thật câu join giữa `tenk1` và `tenk2` rồi in ra plan kèm thời gian và số row thực tế của từng node.

**Chỉ số quan trọng nhất cho N+1 là `loops`:**

📖 **Nguyên văn** — `14.1.2. EXPLAIN ANALYZE`
> "In some query plans, it is possible for a subplan node to be executed more than once. For example, the inner index scan will be executed once per outer row in the above nested-loop plan. In such cases, the loops value reports the total number of executions of the node, and the actual time and rows values shown are averages per-execution."

🇻🇳 **Dịch**
> "Trong một số query plan, có thể một subplan node được thực thi nhiều hơn một lần. Ví dụ, index scan ở phía trong sẽ được thực thi một lần cho mỗi row ở phía ngoài trong plan nested-loop nói trên. Trong các trường hợp như vậy, giá trị `loops` cho biết tổng số lần node đó được thực thi, còn các giá trị `actual time` và `rows` hiển thị là **trung bình mỗi lần thực thi**."

> [!warning] Đọc `loops` cho đúng
> `actual time` hiển thị là **trung bình một lần chạy**, không phải tổng. Muốn ra tổng thì nhân với `loops`.
> 📖 **Nguyên văn** — `14.1.2. EXPLAIN ANALYZE`
> > "Multiply by the loops value to get the total time actually spent in the node."
>
> 🇻🇳 **Dịch**
> > "Nhân với giá trị `loops` để có tổng thời gian thực sự tiêu tốn trong node đó."

> [!danger] `EXPLAIN ANALYZE` chạy thật câu query
> 📖 **Nguyên văn** — `14.1.2. EXPLAIN ANALYZE`
> > "Keep in mind that because EXPLAIN ANALYZE actually runs the query, any side-effects will happen as usual, even though whatever results the query might output are discarded in favor of printing the EXPLAIN data. If you want to analyze a data-modifying query without changing your tables, you can roll the command back afterwards"
>
> 🇻🇳 **Dịch**
> > "Hãy nhớ rằng vì `EXPLAIN ANALYZE` thực sự chạy query, mọi side-effect vẫn xảy ra như bình thường, mặc dù kết quả mà query có thể xuất ra sẽ bị bỏ đi để in ra dữ liệu `EXPLAIN`. Nếu bạn muốn phân tích một query có sửa dữ liệu mà không làm thay đổi các table, bạn có thể roll back lệnh đó sau đấy"
>
> Với `UPDATE` / `DELETE`: bọc trong một transaction rồi `ROLLBACK`.

### 5.3. Quan sát query log

`EXPLAIN` chỉ soi được **một** câu query. Nhưng N+1 là vấn đề của **số lượng** query, nên chỉ nhìn plan là không đủ — phải nhìn vào log để đếm.

📖 **Nguyên văn** — PlanetScale Blog, mục *What is the N+1 query problem?* (nguồn bên thứ ba)
> "The chief symptom of this problem is that there are many, many queries being performed."

🇻🇳 **Dịch**
> "Triệu chứng chính của vấn đề này là có rất, rất nhiều query đang được thực thi."

Dấu hiệu nhận biết trong query log, theo bài PlanetScale:

📖 **Nguyên văn** — PlanetScale Blog, mục *PlanetScale Insights*
> "Overall, this shows us right away that our N+1 queries:
> Ran way too many times
> Read way more rows than returned
> And performance was relatively slow"

🇻🇳 **Dịch**
> "Nhìn chung, điều này cho chúng ta thấy ngay rằng các N+1 query của chúng ta:
> Chạy quá nhiều lần
> Đọc số row nhiều hơn hẳn số row trả về
> Và performance thì tương đối chậm"

Cụ thể: **cùng một khuôn query lặp lại rất nhiều lần, chỉ khác giá trị tham số** — đó gần như luôn là N+1.

---

## 6. Bảng so sánh số lượng query

Với danh sách có **N** item cha:

| Cách làm | Số query | Số round-trip tới DB | Độ phức tạp code |
|---|---|---|---|
| Lặp trong code (bị N+1) | **N + 1** | N + 1 | Đơn giản nhất, nhưng chậm |
| JOIN (4.1) | **1** | 1 | Query phức tạp hơn, dữ liệu cha lặp lại trên mỗi row |
| Batching `IN (...)` (4.2) | **2** | 2 | Phải tự nhóm kết quả trong code |
| Eager loading ORM (4.3) | **1 hoặc 2** | 1 hoặc 2 | ORM tự sinh ra JOIN hoặc batched query |

Số hoá bằng ví dụ 17 category của PlanetScale: **18 query, hơn 1 giây** → **1 query JOIN**.

📖 **Nguyên văn** — PlanetScale Blog
> "The page loads in about 0.16 seconds, instead of 1.4 seconds."

🇻🇳 **Dịch**
> "Trang tải trong khoảng 0,16 giây, thay vì 1,4 giây."

📖 **Nguyên văn** — PlanetScale Blog
> "In this simple example, with a database that isn't very large, the n+1 approach takes about 10 times longer!"

🇻🇳 **Dịch**
> "Trong ví dụ đơn giản này, với một database không lớn lắm, cách làm n+1 tốn thời gian gấp khoảng 10 lần!"

---

## 7. Index KHÔNG cứu được N+1

Đây là hiểu lầm phổ biến nhất. Đã học ở [[04 - Indexes]]: index làm **một câu query** tìm row nhanh hơn.

Nhưng trong N+1, từng câu query con **vốn đã nhanh sẵn** — chúng tra theo `category_id`, có index thì chỉ mất vài chục micro giây. Cái tốn thời gian là **N lần round-trip**: N lần gửi query đi, N lần database parse + plan + execute, N lần trả kết quả về qua mạng.

Thêm index vào sẽ làm mỗi chuyến đi nhanh hơn một chút, nhưng **vẫn là N chuyến đi**. Quay lại ví dụ đi chợ: mua xe máy nhanh hơn không sửa được việc bạn phải đi 11 chuyến — muốn nhanh thì phải **gộp thành một chuyến**.

> [!tip] Cách phân biệt
> - Query **chậm** vì phải quét cả table → vấn đề index → xem [[04 - Indexes]].
> - Query **nhanh** nhưng chạy hàng trăm lần → vấn đề N+1 → JOIN hoặc batching.

---

## 🔌 Liên hệ stack thực tế

> Phần này là ghi chú riêng, KHÔNG trích từ tài liệu PostgreSQL.

N+1 không phải vấn đề riêng của SQL — nó là vấn đề của **bất kỳ data store nào có round-trip qua mạng**. Với Firestore, việc lặp qua một danh sách document rồi gọi thêm một lần đọc cho từng document liên quan cũng tạo ra đúng hình dạng N+1: 1 truy vấn danh sách + N lần đọc. Nguyên tắc sửa vẫn giống hệt — gom các lần đọc lại thay vì gọi trong vòng lặp, hoặc thiết kế dữ liệu sao cho một lần đọc là đủ.

Không ghi tên API hay giới hạn cụ thể của Firestore ở đây vì chưa tra tài liệu chính thức trong bài này.

---

## Liên kết
- Bài trước: [[06 - Database Migrations]]
- Liên quan: [[03 - Queries - SELECT, JOIN, Aggregate]] — cú pháp `SELECT`, `JOIN`, aggregate
- Liên quan: [[04 - Indexes]] — index tăng tốc một query, nhưng không giảm số lượng query
- Quay lại mục lục: [[00 - Tổng hợp (Relational Databases)]]

## Nguồn tham khảo
- Backend Developer Roadmap — node `N plus one problem` : https://roadmap.sh/backend
  (nội dung node lấy từ repo: `roadmaps/backend/content/n1-problem@bQnOAu863hsHdyNMNyJop.md`)
- PlanetScale Blog — *What is the N+1 Query Problem and How to Solve it?*, JD Lien, January 18, 2023 : https://planetscale.com/blog/what-is-n-1-query-problem-and-how-to-solve-it
  ⚠️ Đây là **nguồn bên thứ ba** do roadmap.sh đề xuất, không phải tài liệu chính thống của PostgreSQL.
- PostgreSQL 18 Documentation — *14.1. Using EXPLAIN* : https://www.postgresql.org/docs/current/using-explain.html
- PostgreSQL 18 Documentation — *2.6. Joins Between Tables* : https://www.postgresql.org/docs/current/tutorial-join.html
- PostgreSQL 18 Documentation — *9.24. Subquery Expressions* : https://www.postgresql.org/docs/current/functions-subquery.html
- Các khối SQL ở mục 3 và 4.2 là **ví dụ minh hoạ tự viết**, không trích từ nguồn nào.
