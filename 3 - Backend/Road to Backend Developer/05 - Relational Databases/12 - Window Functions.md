# 12 — Window Functions

> **Nguồn chính:** PostgreSQL 18 Documentation — *3.5. Window Functions* — https://www.postgresql.org/docs/current/tutorial-window.html
> **Nguồn phụ (cùng bộ tài liệu chính thống):**
> - *9.22. Window Functions* (danh sách hàm) — https://www.postgresql.org/docs/current/functions-window.html
> - *4.2.8. Window Function Calls* (cú pháp đầy đủ, frame clause) — https://www.postgresql.org/docs/current/sql-expressions.html
> Bài này bám mục 3.5 của tutorial, bổ sung cú pháp từ 4.2.8 và bảng hàm từ 9.22.

---

## 1. Window function là gì — và nó KHÁC aggregate ở chỗ nào

Đây là ý cốt lõi của cả bài. Đọc kỹ câu thứ ba trong đoạn trích dưới đây.

📖 **Nguyên văn** — *3.5. Window Functions*, đoạn mở đầu
> "A window function performs a calculation across a set of table rows that are somehow related to the current row. This is comparable to the type of calculation that can be done with an aggregate function. However, window functions do not cause rows to become grouped into a single output row like non-window aggregate calls would. Instead, the rows retain their separate identities. Behind the scenes, the window function is able to access more than just the current row of the query result."

🇻🇳 **Dịch**
> "Một window function thực hiện một phép tính trên một tập các row của table có liên quan theo cách nào đó tới row hiện tại. Việc này tương đương với kiểu tính toán mà một aggregate function có thể làm. **Tuy nhiên, window function KHÔNG làm cho các row bị gộp lại thành một output row duy nhất như các lời gọi aggregate không-window sẽ làm. Thay vào đó, các row vẫn giữ nguyên danh tính riêng của mình.** Ở phía sau hậu trường, window function có khả năng truy cập nhiều hơn là chỉ mỗi row hiện tại của kết quả query."

Nói gọn: **cùng một phép tính trên nhóm, nhưng không mất row nào.** Aggregate + `GROUP BY` nuốt 10 row thành 3 row; window function vẫn trả về 10 row, chỉ thêm một cột giá trị tính trên nhóm.

Tài liệu *4.2.8* nhắc lại cùng ý đó bằng lời khác:

📖 **Nguyên văn** — *4.2.8. Window Function Calls*
> "A window function call represents the application of an aggregate-like function over some portion of the rows selected by a query. Unlike non-window aggregate calls, this is not tied to grouping of the selected rows into a single output row — each row remains separate in the query output. However the window function has access to all the rows that would be part of the current row's group according to the grouping specification (PARTITION BY list) of the window function call."

🇻🇳 **Dịch**
> "Một lời gọi window function biểu diễn việc áp dụng một function kiểu-aggregate lên một phần nào đó của các row được query chọn ra. Khác với các lời gọi aggregate không-window, việc này không gắn với chuyện gộp các row đã chọn thành một output row duy nhất — mỗi row vẫn tách riêng trong output của query. Tuy vậy window function vẫn truy cập được tất cả các row sẽ thuộc về nhóm của row hiện tại theo đặc tả nhóm (danh sách `PARTITION BY`) của lời gọi window function đó."

💡 **Ví dụ đời sống**
Một cuộc chạy bộ phong trào có 3 câu lạc bộ tham gia.

- **Cách `GROUP BY`:** ban tổ chức dán lên bảng 3 dòng — "CLB A: thành tích trung bình 28 phút", "CLB B: 31 phút", "CLB C: 26 phút". Đẹp, gọn, nhưng **tên bạn biến mất**. Bạn không biết mình đứng đâu.
- **Cách window function:** bảng kết quả vẫn liệt kê **đủ từng vận động viên, từng dòng một** — nhưng mỗi dòng có thêm hai cột: "trung bình CLB của bạn: 28 phút" và "hạng trong CLB: 4/12". Bạn vừa còn tên mình, vừa thấy mình so với nhóm thế nào.

Đó chính xác là khác biệt giữa aggregate và window function.

---

## 2. So sánh trực tiếp với `GROUP BY` (đã học ở [[03 - Queries - SELECT, JOIN, Aggregate]])

Ở [[03 - Queries - SELECT, JOIN, Aggregate]] ta đã dùng `GROUP BY` + `avg()`. Window function tính **đúng cùng một con số**, chỉ khác cách trả kết quả. Tài liệu nói rõ điều này khi giải thích ví dụ đầu tiên:

📖 **Nguyên văn** — *3.5. Window Functions*
> "The first three output columns come directly from the table empsalary, and there is one output row for each row in the table. The fourth column represents an average taken across all the table rows that have the same depname value as the current row. (This actually is the same function as the non-window avg aggregate, but the OVER clause causes it to be treated as a window function and computed across the window frame.)"

🇻🇳 **Dịch**
> "Ba cột output đầu tiên đến thẳng từ table `empsalary`, và có một output row cho mỗi row trong table. Cột thứ tư biểu diễn một giá trị trung bình lấy trên tất cả các row của table có cùng giá trị `depname` với row hiện tại. (Đây thực ra chính là function `avg` aggregate không-window, nhưng mệnh đề `OVER` khiến nó được xử lý như một window function và được tính trên window frame.)"

Bảng so sánh (phần này là tổng hợp của mình từ hai đoạn trích ở trên, không phải trích dẫn):

| | `GROUP BY` + aggregate | Window function (`OVER`) |
|---|---|---|
| Số row output | Thu gọn: mỗi nhóm còn **1 row** | Giữ nguyên: **1 row input → 1 row output** |
| Cột được phép `SELECT` | Chỉ cột trong `GROUP BY` + aggregate | Mọi cột của row hiện tại, cộng thêm cột window |
| Chia nhóm bằng | Mệnh đề `GROUP BY` ở cấp query | `PARTITION BY` bên trong `OVER` |
| Nhiều cách chia nhóm trong 1 query | Không (chỉ một `GROUP BY`) | Có — mỗi window function một `OVER` riêng |
| Dùng được trong `WHERE` / `HAVING` | `HAVING` lọc được kết quả aggregate | **Không** — xem cảnh báo ở mục 6 |
| Câu hỏi nó trả lời | "Mỗi phòng ban lương trung bình bao nhiêu?" | "Lương của **người này** so với trung bình phòng ban của **anh ta** thế nào?" |

📖 **Nguyên văn** — *4.2.8. Window Function Calls* (về quan hệ giữa `PARTITION BY` và `GROUP BY`)
> "The PARTITION BY clause groups the rows of the query into partitions, which are processed separately by the window function. PARTITION BY works similarly to a query-level GROUP BY clause, except that its expressions are always just expressions and cannot be output-column names or numbers. Without PARTITION BY, all rows produced by the query are treated as a single partition. The ORDER BY clause determines the order in which the rows of a partition are processed by the window function. It works similarly to a query-level ORDER BY clause, but likewise cannot use output-column names or numbers. Without ORDER BY, rows are processed in an unspecified order."

🇻🇳 **Dịch**
> "Mệnh đề `PARTITION BY` gom các row của query thành các **partition**, và chúng được window function xử lý riêng rẽ. `PARTITION BY` hoạt động tương tự mệnh đề `GROUP BY` ở cấp query, chỉ khác là các biểu thức của nó luôn chỉ là biểu thức thuần, không được dùng tên hay số thứ tự của output column. Nếu không có `PARTITION BY`, toàn bộ row do query sinh ra được coi là một partition duy nhất. Mệnh đề `ORDER BY` quyết định thứ tự các row trong một partition được window function xử lý. Nó hoạt động tương tự mệnh đề `ORDER BY` ở cấp query, nhưng cũng không được dùng tên hay số thứ tự của output column. Nếu không có `ORDER BY`, các row được xử lý theo thứ tự không xác định."

---

## 3. Ví dụ gốc của tài liệu: bảng `empsalary`

### 3.1. `avg()` với `PARTITION BY`

📖 **Nguyên văn** — *3.5. Window Functions*
> "Here is an example that shows how to compare each employee's salary with the average salary in his or her department:"

🇻🇳 **Dịch**
> "Dưới đây là một ví dụ cho thấy cách so sánh salary của từng employee với salary trung bình trong department của người đó:"

```sql
SELECT depname, empno, salary, avg(salary) OVER (PARTITION BY depname) FROM empsalary;
```

🇻🇳 Query lấy từng nhân viên kèm mức lương trung bình của chính phòng ban người đó — 10 nhân viên vẫn ra đủ 10 dòng.

```
  depname  | empno | salary |          avg
-----------+-------+--------+-----------------------
 develop   |    11 |   5200 | 5020.0000000000000000
 develop   |     7 |   4200 | 5020.0000000000000000
 develop   |     9 |   4500 | 5020.0000000000000000
 develop   |     8 |   6000 | 5020.0000000000000000
 develop   |    10 |   5200 | 5020.0000000000000000
 personnel |     5 |   3500 | 3700.0000000000000000
 personnel |     2 |   3900 | 3700.0000000000000000
 sales     |     3 |   4800 | 4866.6666666666666667
 sales     |     1 |   5000 | 4866.6666666666666667
 sales     |     4 |   4800 | 4866.6666666666666667
(10 rows)
```

🇻🇳 Output gốc của tài liệu: đủ 10 row, cột `avg` lặp lại cùng một giá trị cho mọi người trong cùng `depname`. Nếu dùng `GROUP BY depname` thì chỉ còn 3 row và mất hẳn cột `empno`, `salary`.

### 3.2. `row_number()` với `PARTITION BY ... ORDER BY`

📖 **Nguyên văn** — *3.5. Window Functions*
> "You can also control the order in which rows are processed by window functions using ORDER BY within OVER. (The window ORDER BY does not even have to match the order in which the rows are output.) Here is an example:"

🇻🇳 **Dịch**
> "Bạn cũng có thể kiểm soát thứ tự các row được window function xử lý bằng `ORDER BY` bên trong `OVER`. (`ORDER BY` của window thậm chí không bắt buộc phải trùng với thứ tự các row được xuất ra.) Đây là một ví dụ:"

```sql
SELECT depname, empno, salary,
       row_number() OVER (PARTITION BY depname ORDER BY salary DESC)
FROM empsalary;
```

🇻🇳 Đánh số thứ tự cho từng nhân viên **trong nội bộ phòng ban của mình**, sắp theo lương giảm dần.

```
  depname  | empno | salary | row_number
-----------+-------+--------+------------
 develop   |     8 |   6000 |          1
 develop   |    10 |   5200 |          2
 develop   |    11 |   5200 |          3
 develop   |     9 |   4500 |          4
 develop   |     7 |   4200 |          5
 personnel |     2 |   3900 |          1
 personnel |     5 |   3500 |          2
 sales     |     1 |   5000 |          1
 sales     |     4 |   4800 |          2
 sales     |     3 |   4800 |          3
(10 rows)
```

🇻🇳 Chú ý: số thứ tự **reset về 1** ở mỗi partition (`develop` → `personnel` → `sales`).

📖 **Nguyên văn** — *3.5. Window Functions*
> "As shown here, the row_number window function assigns sequential numbers to the rows within each partition, in the order defined by the ORDER BY clause (with tied rows numbered in an unspecified order). row_number needs no explicit parameter, because its behavior is entirely determined by the OVER clause."

🇻🇳 **Dịch**
> "Như thấy ở đây, window function `row_number` gán các số thứ tự liên tiếp cho các row bên trong mỗi partition, theo thứ tự do mệnh đề `ORDER BY` định nghĩa (các row bằng điểm nhau được đánh số theo thứ tự không xác định). `row_number` không cần tham số tường minh nào, vì hành vi của nó hoàn toàn do mệnh đề `OVER` quyết định."

### 3.3. Window function nhìn thấy row nào?

📖 **Nguyên văn** — *3.5. Window Functions*
> "The rows considered by a window function are those of the “virtual table” produced by the query's FROM clause as filtered by its WHERE, GROUP BY, and HAVING clauses if any. For example, a row removed because it does not meet the WHERE condition is not seen by any window function. A query can contain multiple window functions that slice up the data in different ways using different OVER clauses, but they all act on the same collection of rows defined by this virtual table."

🇻🇳 **Dịch**
> "Các row mà một window function xét đến là các row của “virtual table” do mệnh đề `FROM` của query sinh ra, sau khi đã bị lọc bởi các mệnh đề `WHERE`, `GROUP BY` và `HAVING` nếu có. Ví dụ, một row bị loại vì không thoả điều kiện `WHERE` sẽ không được bất kỳ window function nào nhìn thấy. Một query có thể chứa nhiều window function cắt lát dữ liệu theo những cách khác nhau bằng các mệnh đề `OVER` khác nhau, nhưng tất cả đều tác động lên cùng một tập row do virtual table này định nghĩa."

📖 **Nguyên văn** — *3.5. Window Functions*
> "We already saw that ORDER BY can be omitted if the ordering of rows is not important. It is also possible to omit PARTITION BY, in which case there is a single partition containing all rows."

🇻🇳 **Dịch**
> "Ta đã thấy `ORDER BY` có thể bỏ đi nếu thứ tự các row không quan trọng. Cũng có thể bỏ `PARTITION BY`, khi đó chỉ có một partition duy nhất chứa tất cả các row."

---

## 4. Cú pháp đầy đủ của một lời gọi window function

📖 **Nguyên văn** — *3.5. Window Functions* (giải thích mệnh đề `OVER`)
> "A window function call always contains an OVER clause directly following the window function's name and argument(s). This is what syntactically distinguishes it from a normal function or non-window aggregate. The OVER clause determines exactly how the rows of the query are split up for processing by the window function. The PARTITION BY clause within OVER divides the rows into groups, or partitions, that share the same values of the PARTITION BY expression(s). For each row, the window function is computed across the rows that fall into the same partition as the current row."

🇻🇳 **Dịch**
> "Một lời gọi window function **luôn** chứa một mệnh đề `OVER` đặt ngay sau tên và (các) argument của window function. Đây chính là thứ phân biệt nó về mặt cú pháp với một function thường hay một aggregate không-window. Mệnh đề `OVER` quyết định chính xác các row của query được chia ra thế nào để window function xử lý. Mệnh đề `PARTITION BY` bên trong `OVER` chia các row thành các nhóm, hay **partition**, cùng chung giá trị của (các) biểu thức `PARTITION BY`. Với mỗi row, window function được tính trên các row rơi vào cùng partition với row hiện tại."

📖 **Nguyên văn** — *4.2.8. Window Function Calls* (cú pháp)
> "The syntax of a window function call is one of the following:"

🇻🇳 **Dịch**
> "Cú pháp của một lời gọi window function là một trong các dạng sau:"

```
function_name ([expression [, expression ... ]]) [ FILTER ( WHERE filter_clause ) ] OVER window_name
function_name ([expression [, expression ... ]]) [ FILTER ( WHERE filter_clause ) ] OVER ( window_definition )
function_name ( * ) [ FILTER ( WHERE filter_clause ) ] OVER window_name
function_name ( * ) [ FILTER ( WHERE filter_clause ) ] OVER ( window_definition )
```

🇻🇳 Bốn biến thể: gọi với danh sách argument hoặc với `*`, và `OVER` hoặc trỏ tới một window đã đặt tên, hoặc mở ngoặc định nghĩa window ngay tại chỗ.

📖 **Nguyên văn** — *4.2.8. Window Function Calls*
> "where window_definition has the syntax"

🇻🇳 **Dịch**
> "trong đó `window_definition` có cú pháp"

```
[ existing_window_name ]
[ PARTITION BY expression [, ...] ]
[ ORDER BY expression [ ASC | DESC | USING operator ] [ NULLS { FIRST | LAST } ] [, ...] ]
[ frame_clause ]
```

🇻🇳 Ba thành phần chính bên trong `OVER (...)`: chia nhóm (`PARTITION BY`), sắp thứ tự trong nhóm (`ORDER BY`), và giới hạn phạm vi tính (`frame_clause` — mục 7). Cả ba đều **tuỳ chọn**; `OVER ()` rỗng là hợp lệ.

Giải thích từng thành phần (tóm tắt từ các đoạn trích ở mục 2 và 4):

| Thành phần | Vai trò | Bỏ trống thì sao |
|---|---|---|
| `PARTITION BY expr` | Chia row thành các partition cùng giá trị `expr` | Toàn bộ row là **một** partition duy nhất |
| `ORDER BY expr` | Sắp thứ tự row bên trong partition để function xử lý | Thứ tự **không xác định**; frame mặc định thành cả partition |
| `frame_clause` | Giới hạn tập row thực sự tham gia tính, hẹp hơn partition | Mặc định `RANGE UNBOUNDED PRECEDING` (mục 7) |

---

## 5. Các hàm window thường dùng (Table 9.67)

📖 **Nguyên văn** — *9.22. Window Functions*
> "Window functions provide the ability to perform calculations across sets of rows that are related to the current query row. See Section 3.5 for an introduction to this feature, and Section 4.2.8 for syntax details."
>
> "The built-in window functions are listed in Table 9.67. Note that these functions must be invoked using window function syntax, i.e., an OVER clause is required."
>
> "In addition to these functions, any built-in or user-defined ordinary aggregate (i.e., not ordered-set or hypothetical-set aggregates) can be used as a window function; see Section 9.21 for a list of the built-in aggregates. Aggregate functions act as window functions only when an OVER clause follows the call; otherwise they act as plain aggregates and return a single row for the entire set."

🇻🇳 **Dịch**
> "Window function cung cấp khả năng thực hiện các phép tính trên những tập row có liên quan tới row hiện tại của query. Xem Section 3.5 để có phần giới thiệu về tính năng này, và Section 4.2.8 để biết chi tiết cú pháp."
>
> "Các window function dựng sẵn được liệt kê trong Table 9.67. Lưu ý rằng các function này **bắt buộc** phải được gọi bằng cú pháp window function, tức là cần có một mệnh đề `OVER`."
>
> "Ngoài các function này, bất kỳ aggregate thông thường nào dựng sẵn hoặc do người dùng định nghĩa (tức là không phải ordered-set hay hypothetical-set aggregate) đều có thể dùng như một window function; xem Section 9.21 để có danh sách các aggregate dựng sẵn. Aggregate function chỉ hoạt động như window function khi có một mệnh đề `OVER` theo sau lời gọi; ngược lại chúng hoạt động như aggregate thuần và trả về một row duy nhất cho toàn bộ tập."

**Table 9.67. General-Purpose Window Functions** — cột "Nguyên văn" trích đúng từ tài liệu, cột "Dịch" là bản dịch:

| Function | Description (nguyên văn) | 🇻🇳 Dịch |
|---|---|---|
| `row_number () → bigint` | "Returns the number of the current row within its partition, counting from 1." | Trả về số thứ tự của row hiện tại trong partition của nó, đếm từ 1. |
| `rank () → bigint` | "Returns the rank of the current row, with gaps; that is, the row_number of the first row in its peer group." | Trả về thứ hạng của row hiện tại, **có khoảng trống**; tức là `row_number` của row đầu tiên trong peer group của nó. |
| `dense_rank () → bigint` | "Returns the rank of the current row, without gaps; this function effectively counts peer groups." | Trả về thứ hạng của row hiện tại, **không có khoảng trống**; function này thực chất là đếm số peer group. |
| `percent_rank () → double precision` | "Returns the relative rank of the current row, that is (rank - 1) / (total partition rows - 1). The value thus ranges from 0 to 1 inclusive." | Trả về thứ hạng tương đối của row hiện tại, tức là `(rank - 1) / (tổng số row của partition - 1)`. Giá trị vì vậy nằm trong khoảng từ 0 đến 1, bao gồm cả hai đầu. |
| `cume_dist () → double precision` | "Returns the cumulative distribution, that is (number of partition rows preceding or peers with current row) / (total partition rows). The value thus ranges from 1/N to 1." | Trả về phân phối tích luỹ, tức là `(số row trong partition đứng trước hoặc là peer của row hiện tại) / (tổng số row của partition)`. Giá trị vì vậy nằm trong khoảng từ `1/N` đến 1. |
| `ntile ( num_buckets integer ) → integer` | "Returns an integer ranging from 1 to the argument value, dividing the partition as equally as possible." | Trả về một số nguyên từ 1 đến giá trị của argument, chia partition thành các phần **đều nhau nhất có thể**. |
| `lag ( value anycompatible [, offset integer [, default anycompatible ] ] ) → anycompatible` | "Returns value evaluated at the row that is offset rows before the current row within the partition; if there is no such row, instead returns default (which must be of a type compatible with value). Both offset and default are evaluated with respect to the current row. If omitted, offset defaults to 1 and default to NULL." | Trả về `value` được tính tại row nằm **trước** row hiện tại `offset` row trong cùng partition; nếu không có row đó thì trả về `default` (phải có kiểu tương thích với `value`). Cả `offset` lẫn `default` đều được tính theo row hiện tại. Nếu bỏ qua, `offset` mặc định là 1 và `default` là `NULL`. |
| `lead ( value anycompatible [, offset integer [, default anycompatible ] ] ) → anycompatible` | "Returns value evaluated at the row that is offset rows after the current row within the partition; if there is no such row, instead returns default (which must be of a type compatible with value). Both offset and default are evaluated with respect to the current row. If omitted, offset defaults to 1 and default to NULL." | Trả về `value` được tính tại row nằm **sau** row hiện tại `offset` row trong cùng partition; nếu không có row đó thì trả về `default` (phải có kiểu tương thích với `value`). Cả `offset` lẫn `default` đều được tính theo row hiện tại. Nếu bỏ qua, `offset` mặc định là 1 và `default` là `NULL`. |
| `first_value ( value anyelement ) → anyelement` | "Returns value evaluated at the row that is the first row of the window frame." | Trả về `value` được tính tại row là row **đầu tiên** của window frame. |
| `last_value ( value anyelement ) → anyelement` | "Returns value evaluated at the row that is the last row of the window frame." | Trả về `value` được tính tại row là row **cuối cùng** của window frame. |
| `nth_value ( value anyelement , n integer ) → anyelement` | "Returns value evaluated at the row that is the n'th row of the window frame (counting from 1); returns NULL if there is no such row." | Trả về `value` được tính tại row là row thứ `n` của window frame (đếm từ 1); trả về `NULL` nếu không có row đó. |

📖 **Nguyên văn** — *9.22. Window Functions* (khái niệm **peer**)
> "All of the functions listed in Table 9.67 depend on the sort ordering specified by the ORDER BY clause of the associated window definition. Rows that are not distinct when considering only the ORDER BY columns are said to be peers. The four ranking functions (including cume_dist) are defined so that they give the same answer for all rows of a peer group."

🇻🇳 **Dịch**
> "Tất cả các function liệt kê trong Table 9.67 đều phụ thuộc vào thứ tự sắp xếp được chỉ định bởi mệnh đề `ORDER BY` của window definition tương ứng. Các row không phân biệt được với nhau khi chỉ xét các cột trong `ORDER BY` được gọi là **peer**. Bốn ranking function (bao gồm `cume_dist`) được định nghĩa sao cho chúng cho cùng một đáp án với mọi row trong một peer group."

> [!tip] `rank` vs `dense_rank` — khác nhau đúng ở chữ "gaps"
> Tài liệu nói `rank` có "gaps" còn `dense_rank` thì "without gaps". Nhìn lại output mục 3.2: hai người `develop` cùng lương 5200 là **peer** của nhau. Với `rank` họ cùng hạng 1... rồi người tiếp theo nhảy sang hạng 3 (bỏ qua 2). Với `dense_rank` người tiếp theo là hạng 2. Còn `row_number` thì không quan tâm peer, cứ 1-2-3-4-5 (như output gốc ở trên).

> [!warning] Bẫy kinh điển: `last_value` thường ra kết quả "vô dụng"
> 📖 **Nguyên văn** — *9.22. Window Functions*
> > "Note that first_value, last_value, and nth_value consider only the rows within the “window frame”, which by default contains the rows from the start of the partition through the last peer of the current row. This is likely to give unhelpful results for last_value and sometimes also nth_value. You can redefine the frame by adding a suitable frame specification (RANGE, ROWS or GROUPS) to the OVER clause. See Section 4.2.8 for more information about frame specifications."
>
> 🇻🇳 **Dịch**
> > "Lưu ý rằng `first_value`, `last_value` và `nth_value` chỉ xét các row nằm trong “window frame”, mà mặc định chứa các row từ đầu partition cho tới peer cuối cùng của row hiện tại. Điều này nhiều khả năng cho ra kết quả **vô ích** với `last_value` và đôi khi cả với `nth_value`. Bạn có thể định nghĩa lại frame bằng cách thêm một frame specification phù hợp (`RANGE`, `ROWS` hoặc `GROUPS`) vào mệnh đề `OVER`. Xem Section 4.2.8 để biết thêm về frame specification."
>
> Lý do: frame mặc định kết thúc ở row hiện tại → "row cuối cùng của frame" chính là row hiện tại, không phải row cuối của partition.

📖 **Nguyên văn** — *9.22. Window Functions* (aggregate dùng làm window function)
> "When an aggregate function is used as a window function, it aggregates over the rows within the current row's window frame. An aggregate used with ORDER BY and the default window frame definition produces a “running sum” type of behavior, which may or may not be what's wanted. To obtain aggregation over the whole partition, omit ORDER BY or use ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING. Other frame specifications can be used to obtain other effects."

🇻🇳 **Dịch**
> "Khi một aggregate function được dùng như một window function, nó tổng hợp trên các row nằm trong window frame của row hiện tại. Một aggregate dùng kèm `ORDER BY` với định nghĩa window frame mặc định sẽ tạo ra hành vi kiểu “**running sum**” (tổng luỹ tiến), điều này có thể đúng hoặc không đúng ý bạn. Để tổng hợp trên toàn bộ partition, hãy bỏ `ORDER BY` đi hoặc dùng `ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING`. Có thể dùng các frame specification khác để đạt các hiệu ứng khác."

---

## 6. ⚠️ Window function chỉ được dùng ở `SELECT` list và `ORDER BY`

> [!warning] Không được dùng window function trong `WHERE`, `GROUP BY`, `HAVING`
> 📖 **Nguyên văn** — *3.5. Window Functions*
> > "Window functions are permitted only in the SELECT list and the ORDER BY clause of the query. They are forbidden elsewhere, such as in GROUP BY, HAVING and WHERE clauses. This is because they logically execute after the processing of those clauses. Also, window functions execute after non-window aggregate functions. This means it is valid to include an aggregate function call in the arguments of a window function, but not vice versa."
>
> 🇻🇳 **Dịch**
> > "Window function **chỉ được phép dùng trong `SELECT` list và mệnh đề `ORDER BY`** của query. Chúng **bị cấm** ở mọi nơi khác, chẳng hạn trong các mệnh đề `GROUP BY`, `HAVING` và `WHERE`. Lý do là về mặt logic chúng được thực thi **sau** khi các mệnh đề đó đã được xử lý. Ngoài ra, window function thực thi sau các aggregate function không-window. Điều này nghĩa là đặt một lời gọi aggregate function vào trong argument của một window function thì hợp lệ, nhưng ngược lại thì không."
>
> Tài liệu *4.2.8* nhắc lại đúng một câu:
>
> 📖 **Nguyên văn** — *4.2.8. Window Function Calls*
> > "Window function calls are permitted only in the SELECT list and the ORDER BY clause of the query."
>
> 🇻🇳 **Dịch**
> > "Các lời gọi window function chỉ được phép dùng trong `SELECT` list và mệnh đề `ORDER BY` của query."

### Cách lách: bọc bằng sub-select (hoặc CTE)

📖 **Nguyên văn** — *3.5. Window Functions*
> "If there is a need to filter or group rows after the window calculations are performed, you can use a sub-select. For example:"

🇻🇳 **Dịch**
> "Nếu cần lọc hoặc gom nhóm các row **sau khi** các phép tính window đã thực hiện xong, bạn có thể dùng một sub-select. Ví dụ:"

```sql
SELECT depname, empno, salary, enroll_date
FROM
  (SELECT depname, empno, salary, enroll_date,
     row_number() OVER (PARTITION BY depname ORDER BY salary DESC, empno) AS pos
     FROM empsalary
  ) AS ss
WHERE pos < 3;
```

🇻🇳 Tính `row_number` ở query con, đặt tên cột là `pos`, rồi query ngoài mới `WHERE pos < 3` — vì `WHERE` của query ngoài chạy trên kết quả đã có sẵn cột `pos` nên hợp lệ.

📖 **Nguyên văn** — *3.5. Window Functions*
> "The above query only shows the rows from the inner query having row_number less than 3 (that is, the first two rows for each department)."

🇻🇳 **Dịch**
> "Query ở trên chỉ hiển thị các row từ query bên trong có `row_number` nhỏ hơn 3 (tức là hai row đầu tiên của mỗi department)."

Đây chính là pattern "**top-N theo nhóm**" — lấy 2 người lương cao nhất mỗi phòng ban. Kỹ thuật sub-select và CTE đã học ở [[09 - Subquery, CTE và Set Operations]]; viết bằng `WITH` cũng cho kết quả tương đương và thường dễ đọc hơn khi query dài.

---

## 7. Window frame — `ROWS` / `RANGE` / `GROUPS BETWEEN`

### 7.1. Frame là gì, mặc định là gì

📖 **Nguyên văn** — *3.5. Window Functions*
> "There is another important concept associated with window functions: for each row, there is a set of rows within its partition called its window frame. Some window functions act only on the rows of the window frame, rather than of the whole partition. By default, if ORDER BY is supplied then the frame consists of all rows from the start of the partition up through the current row, plus any following rows that are equal to the current row according to the ORDER BY clause. When ORDER BY is omitted the default frame consists of all rows in the partition."

🇻🇳 **Dịch**
> "Còn một khái niệm quan trọng nữa gắn với window function: với mỗi row, có một tập row bên trong partition của nó gọi là **window frame** của row đó. Một số window function chỉ tác động lên các row của window frame, chứ không phải toàn bộ partition. **Mặc định**, nếu có `ORDER BY` thì frame gồm tất cả các row từ đầu partition cho tới row hiện tại, cộng thêm bất kỳ row nào đứng sau mà bằng với row hiện tại theo mệnh đề `ORDER BY`. **Khi bỏ `ORDER BY`, frame mặc định gồm toàn bộ các row trong partition.**"

📖 **Nguyên văn** — *4.2.8. Window Function Calls* (phát biểu chính xác của mặc định)
> "The default framing option is RANGE UNBOUNDED PRECEDING, which is the same as RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW. With ORDER BY, this sets the frame to be all rows from the partition start up through the current row's last ORDER BY peer. Without ORDER BY, this means all rows of the partition are included in the window frame, since all rows become peers of the current row."

🇻🇳 **Dịch**
> "Tuỳ chọn frame mặc định là `RANGE UNBOUNDED PRECEDING`, tương đương với `RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW`. Khi có `ORDER BY`, điều này đặt frame là tất cả các row từ đầu partition cho tới peer `ORDER BY` cuối cùng của row hiện tại. Khi không có `ORDER BY`, điều này nghĩa là toàn bộ row của partition được đưa vào window frame, vì khi đó mọi row đều trở thành peer của row hiện tại."

### 7.2. Minh chứng: `sum()` có và không có `ORDER BY`

📖 **Nguyên văn** — *3.5. Window Functions*
> "Here is an example using sum:"

🇻🇳 **Dịch**
> "Đây là một ví dụ dùng `sum`:"

```sql
SELECT salary, sum(salary) OVER () FROM empsalary;
```

🇻🇳 `OVER ()` rỗng: không chia partition, không sắp thứ tự → frame là cả bảng.

```
 salary |  sum
--------+-------
   5200 | 47100
   5000 | 47100
   3500 | 47100
   4800 | 47100
   3900 | 47100
   4200 | 47100
   4500 | 47100
   4800 | 47100
   6000 | 47100
   5200 | 47100
(10 rows)
```

🇻🇳 Mọi row đều có cùng một tổng 47100 — tổng của toàn bảng.

📖 **Nguyên văn** — *3.5. Window Functions*
> "Above, since there is no ORDER BY in the OVER clause, the window frame is the same as the partition, which for lack of PARTITION BY is the whole table; in other words each sum is taken over the whole table and so we get the same result for each output row. But if we add an ORDER BY clause, we get very different results:"

🇻🇳 **Dịch**
> "Ở trên, vì không có `ORDER BY` trong mệnh đề `OVER`, window frame trùng với partition, mà do thiếu `PARTITION BY` nên partition là cả table; nói cách khác mỗi `sum` được lấy trên toàn bộ table và vì vậy ta có cùng một kết quả cho mọi output row. Nhưng nếu ta thêm một mệnh đề `ORDER BY`, kết quả sẽ rất khác:"

```sql
SELECT salary, sum(salary) OVER (ORDER BY salary) FROM empsalary;
```

🇻🇳 Thêm `ORDER BY salary` → frame mặc định co lại thành "từ đầu tới row hiện tại" → thành tổng luỹ tiến (running sum).

```
 salary |  sum
--------+-------
   3500 |  3500
   3900 |  7400
   4200 | 11600
   4500 | 16100
   4800 | 25700
   4800 | 25700
   5000 | 30700
   5200 | 41100
   5200 | 41100
   6000 | 47100
(10 rows)
```

🇻🇳 Hai row `4800` cho cùng giá trị 25700 vì chúng là peer của nhau — frame mặc định bao gồm cả peer cuối cùng.

📖 **Nguyên văn** — *3.5. Window Functions*
> "Here the sum is taken from the first (lowest) salary up through the current one, including any duplicates of the current one (notice the results for the duplicated salaries)."

🇻🇳 **Dịch**
> "Ở đây `sum` được lấy từ salary đầu tiên (thấp nhất) cho tới salary hiện tại, bao gồm cả các bản trùng lặp của giá trị hiện tại (hãy chú ý kết quả ở các mức salary bị trùng)."

### 7.3. Cú pháp `frame_clause`

📖 **Nguyên văn** — *4.2.8. Window Function Calls*
> "The optional frame_clause can be one of"

🇻🇳 **Dịch**
> "`frame_clause` (tuỳ chọn) có thể là một trong các dạng"

```
{ RANGE | ROWS | GROUPS } frame_start [ frame_exclusion ]
{ RANGE | ROWS | GROUPS } BETWEEN frame_start AND frame_end [ frame_exclusion ]
```

🇻🇳 Chọn một trong ba chế độ `RANGE` / `ROWS` / `GROUPS`, rồi chỉ điểm đầu, hoặc chỉ cả đầu lẫn cuối bằng `BETWEEN ... AND ...`.

📖 **Nguyên văn** — *4.2.8. Window Function Calls*
> "where frame_start and frame_end can be one of"

🇻🇳 **Dịch**
> "trong đó `frame_start` và `frame_end` có thể là một trong các dạng"

```
UNBOUNDED PRECEDING
offset PRECEDING
CURRENT ROW
offset FOLLOWING
UNBOUNDED FOLLOWING
```

🇻🇳 Năm mốc biên: đầu partition, lùi `offset`, chính row hiện tại, tiến `offset`, cuối partition.

📖 **Nguyên văn** — *4.2.8. Window Function Calls*
> "The frame_clause specifies the set of rows constituting the window frame, which is a subset of the current partition, for those window functions that act on the frame instead of the whole partition. The set of rows in the frame can vary depending on which row is the current row. The frame can be specified in RANGE, ROWS or GROUPS mode; in each case, it runs from the frame_start to the frame_end. If frame_end is omitted, the end defaults to CURRENT ROW."

🇻🇳 **Dịch**
> "`frame_clause` chỉ định tập row tạo thành **window frame**, vốn là một tập con của partition hiện tại, dành cho những window function tác động lên frame thay vì lên toàn bộ partition. Tập row trong frame có thể thay đổi tuỳ theo row nào đang là row hiện tại. Frame có thể được chỉ định ở chế độ `RANGE`, `ROWS` hoặc `GROUPS`; trong mọi trường hợp, nó chạy từ `frame_start` tới `frame_end`. Nếu bỏ `frame_end`, điểm cuối mặc định là `CURRENT ROW`."

📖 **Nguyên văn** — *4.2.8. Window Function Calls* (`UNBOUNDED`)
> "A frame_start of UNBOUNDED PRECEDING means that the frame starts with the first row of the partition, and similarly a frame_end of UNBOUNDED FOLLOWING means that the frame ends with the last row of the partition."

🇻🇳 **Dịch**
> "`frame_start` là `UNBOUNDED PRECEDING` nghĩa là frame bắt đầu từ row đầu tiên của partition, và tương tự `frame_end` là `UNBOUNDED FOLLOWING` nghĩa là frame kết thúc ở row cuối cùng của partition."

📖 **Nguyên văn** — *4.2.8. Window Function Calls* (`CURRENT ROW` khác nhau giữa các mode)
> "In RANGE or GROUPS mode, a frame_start of CURRENT ROW means the frame starts with the current row's first peer row (a row that the window's ORDER BY clause sorts as equivalent to the current row), while a frame_end of CURRENT ROW means the frame ends with the current row's last peer row. In ROWS mode, CURRENT ROW simply means the current row."

🇻🇳 **Dịch**
> "Ở chế độ `RANGE` hoặc `GROUPS`, `frame_start` là `CURRENT ROW` nghĩa là frame bắt đầu từ peer row **đầu tiên** của row hiện tại (một row mà mệnh đề `ORDER BY` của window sắp xếp là tương đương với row hiện tại), còn `frame_end` là `CURRENT ROW` nghĩa là frame kết thúc ở peer row **cuối cùng** của row hiện tại. Ở chế độ `ROWS`, `CURRENT ROW` đơn giản là chính row hiện tại."

📖 **Nguyên văn** — *4.2.8. Window Function Calls* (`ROWS` mode)
> "In ROWS mode, the offset must yield a non-null, non-negative integer, and the option means that the frame starts or ends the specified number of rows before or after the current row."

🇻🇳 **Dịch**
> "Ở chế độ `ROWS`, `offset` phải cho ra một số nguyên không null và không âm, và tuỳ chọn này nghĩa là frame bắt đầu hoặc kết thúc ở đúng số row đã chỉ định trước hoặc sau row hiện tại."

📖 **Nguyên văn** — *4.2.8. Window Function Calls* (`RANGE` mode)
> "In RANGE mode, these options require that the ORDER BY clause specify exactly one column. The offset specifies the maximum difference between the value of that column in the current row and its value in preceding or following rows of the frame. The data type of the offset expression varies depending on the data type of the ordering column. For numeric ordering columns it is typically of the same type as the ordering column, but for datetime ordering columns it is an interval. For example, if the ordering column is of type date or timestamp, one could write RANGE BETWEEN '1 day' PRECEDING AND '10 days' FOLLOWING. The offset is still required to be non-null and non-negative, though the meaning of “non-negative” depends on its data type."

🇻🇳 **Dịch**
> "Ở chế độ `RANGE`, các tuỳ chọn này yêu cầu mệnh đề `ORDER BY` chỉ định **đúng một** column. `offset` chỉ định chênh lệch tối đa giữa giá trị của column đó ở row hiện tại và giá trị của nó ở các row đứng trước hoặc sau trong frame. Kiểu dữ liệu của biểu thức `offset` thay đổi tuỳ theo kiểu dữ liệu của column sắp xếp. Với column sắp xếp kiểu số thì nó thường cùng kiểu với column đó, nhưng với column sắp xếp kiểu ngày-giờ thì nó là một `interval`. Ví dụ, nếu column sắp xếp có kiểu `date` hoặc `timestamp`, ta có thể viết `RANGE BETWEEN '1 day' PRECEDING AND '10 days' FOLLOWING`. `offset` vẫn phải không null và không âm, dù ý nghĩa của “không âm” phụ thuộc vào kiểu dữ liệu của nó."

> [!note] Khác biệt cốt lõi `ROWS` vs `RANGE`
> `ROWS` đếm **số row vật lý**; `RANGE` đo **khoảng giá trị** của cột `ORDER BY`. Cùng một câu `2 PRECEDING`, `ROWS` lấy đúng 2 row trước đó, còn `RANGE` lấy mọi row có giá trị lệch không quá 2 đơn vị.

📖 **Nguyên văn** — *4.2.8. Window Function Calls* (giới hạn ở biên partition)
> "In any case, the distance to the end of the frame is limited by the distance to the end of the partition, so that for rows near the partition ends the frame might contain fewer rows than elsewhere."

🇻🇳 **Dịch**
> "Trong mọi trường hợp, khoảng cách tới điểm cuối của frame bị giới hạn bởi khoảng cách tới điểm cuối của partition, nên với các row nằm gần hai đầu partition thì frame có thể chứa ít row hơn so với ở những chỗ khác."

📖 **Nguyên văn** — *4.2.8. Window Function Calls* (`frame_exclusion`)
> "The frame_exclusion option allows rows around the current row to be excluded from the frame, even if they would be included according to the frame start and frame end options. EXCLUDE CURRENT ROW excludes the current row from the frame. EXCLUDE GROUP excludes the current row and its ordering peers from the frame. EXCLUDE TIES excludes any peers of the current row from the frame, but not the current row itself. EXCLUDE NO OTHERS simply specifies explicitly the default behavior of not excluding the current row or its peers."

🇻🇳 **Dịch**
> "Tuỳ chọn `frame_exclusion` cho phép loại các row quanh row hiện tại ra khỏi frame, ngay cả khi chúng lẽ ra được bao gồm theo các tuỳ chọn điểm đầu và điểm cuối của frame. `EXCLUDE CURRENT ROW` loại row hiện tại khỏi frame. `EXCLUDE GROUP` loại row hiện tại và các peer theo thứ tự của nó khỏi frame. `EXCLUDE TIES` loại các peer của row hiện tại khỏi frame, nhưng không loại chính row hiện tại. `EXCLUDE NO OTHERS` chỉ đơn giản là nói tường minh hành vi mặc định, tức là không loại row hiện tại hay các peer của nó."

📖 **Nguyên văn** — *4.2.8. Window Function Calls* (các ràng buộc)
> "Restrictions are that frame_start cannot be UNBOUNDED FOLLOWING, frame_end cannot be UNBOUNDED PRECEDING, and the frame_end choice cannot appear earlier in the above list of frame_start and frame_end options than the frame_start choice does — for example RANGE BETWEEN CURRENT ROW AND offset PRECEDING is not allowed. But, for example, ROWS BETWEEN 7 PRECEDING AND 8 PRECEDING is allowed, even though it would never select any rows."

🇻🇳 **Dịch**
> "Các ràng buộc là: `frame_start` không được là `UNBOUNDED FOLLOWING`, `frame_end` không được là `UNBOUNDED PRECEDING`, và lựa chọn `frame_end` không được đứng trước lựa chọn `frame_start` trong danh sách các tuỳ chọn `frame_start`/`frame_end` nêu trên — ví dụ `RANGE BETWEEN CURRENT ROW AND offset PRECEDING` là không hợp lệ. Nhưng chẳng hạn `ROWS BETWEEN 7 PRECEDING AND 8 PRECEDING` thì được phép, dù nó sẽ không bao giờ chọn được row nào."

---

## 8. Mệnh đề `WINDOW` — đặt tên cho window definition

📖 **Nguyên văn** — *3.5. Window Functions*
> "When a query involves multiple window functions, it is possible to write out each one with a separate OVER clause, but this is duplicative and error-prone if the same windowing behavior is wanted for several functions. Instead, each windowing behavior can be named in a WINDOW clause and then referenced in OVER. For example:"

🇻🇳 **Dịch**
> "Khi một query dùng nhiều window function, có thể viết từng cái với một mệnh đề `OVER` riêng, nhưng cách đó lặp lại và dễ sai nếu ta muốn cùng một hành vi windowing cho nhiều function. Thay vào đó, mỗi hành vi windowing có thể được **đặt tên** trong một mệnh đề `WINDOW` rồi tham chiếu lại trong `OVER`. Ví dụ:"

```sql
SELECT sum(salary) OVER w, avg(salary) OVER w
  FROM empsalary
  WINDOW w AS (PARTITION BY depname ORDER BY salary DESC);
```

🇻🇳 Định nghĩa window một lần với tên `w`, rồi `sum` và `avg` cùng dùng lại `OVER w` — khỏi viết lặp `PARTITION BY ... ORDER BY ...` hai lần.

> [!note] `OVER w` không hoàn toàn giống `OVER (w ...)`
> 📖 **Nguyên văn** — *4.2.8. Window Function Calls*
> > "window_name is a reference to a named window specification defined in the query's WINDOW clause. Alternatively, a full window_definition can be given within parentheses, using the same syntax as for defining a named window in the WINDOW clause; see the SELECT reference page for details. It's worth pointing out that OVER wname is not exactly equivalent to OVER (wname ...); the latter implies copying and modifying the window definition, and will be rejected if the referenced window specification includes a frame clause."
>
> 🇻🇳 **Dịch**
> > "`window_name` là một tham chiếu tới một window specification đã đặt tên, định nghĩa trong mệnh đề `WINDOW` của query. Ngoài ra, có thể đưa trọn một `window_definition` vào trong ngoặc, dùng đúng cú pháp như khi định nghĩa một window có tên trong mệnh đề `WINDOW`; xem trang tham khảo `SELECT` để biết chi tiết. Đáng lưu ý là `OVER wname` **không hoàn toàn tương đương** với `OVER (wname ...)`; dạng sau ngụ ý sao chép và sửa đổi window definition, và sẽ bị từ chối nếu window specification được tham chiếu có chứa một frame clause."

---

## 9. `FILTER` và cú pháp `*`

📖 **Nguyên văn** — *4.2.8. Window Function Calls*
> "If FILTER is specified, then only the input rows for which the filter_clause evaluates to true are fed to the window function; other rows are discarded. Only window functions that are aggregates accept a FILTER clause."

🇻🇳 **Dịch**
> "Nếu có chỉ định `FILTER`, thì chỉ những input row mà `filter_clause` cho kết quả true mới được đưa vào window function; các row khác bị loại bỏ. Chỉ những window function vốn là aggregate mới chấp nhận mệnh đề `FILTER`."

📖 **Nguyên văn** — *4.2.8. Window Function Calls*
> "The syntaxes using * are used for calling parameter-less aggregate functions as window functions, for example count(*) OVER (PARTITION BY x ORDER BY y). The asterisk (*) is customarily not used for window-specific functions. Window-specific functions do not allow DISTINCT or ORDER BY to be used within the function argument list."

🇻🇳 **Dịch**
> "Các cú pháp dùng `*` được dùng để gọi những aggregate function không tham số như window function, ví dụ `count(*) OVER (PARTITION BY x ORDER BY y)`. Dấu sao (`*`) theo thông lệ không dùng cho các function chuyên-window. Các function chuyên-window không cho phép dùng `DISTINCT` hay `ORDER BY` bên trong danh sách argument của function."

---

## 10. Ghi chú: PostgreSQL không hỗ trợ `IGNORE NULLS`

📖 **Nguyên văn** — *9.22. Window Functions*, khối Note
> "The SQL standard defines a RESPECT NULLS or IGNORE NULLS option for lead, lag, first_value, last_value, and nth_value. This is not implemented in PostgreSQL: the behavior is always the same as the standard's default, namely RESPECT NULLS. Likewise, the standard's FROM FIRST or FROM LAST option for nth_value is not implemented: only the default FROM FIRST behavior is supported. (You can achieve the result of FROM LAST by reversing the ORDER BY ordering.)"

🇻🇳 **Dịch**
> "Chuẩn SQL định nghĩa tuỳ chọn `RESPECT NULLS` hoặc `IGNORE NULLS` cho `lead`, `lag`, `first_value`, `last_value` và `nth_value`. Tuỳ chọn này **không được cài đặt trong PostgreSQL**: hành vi luôn giống mặc định của chuẩn, tức là `RESPECT NULLS`. Tương tự, tuỳ chọn `FROM FIRST` hoặc `FROM LAST` của chuẩn dành cho `nth_value` cũng không được cài đặt: chỉ hành vi mặc định `FROM FIRST` được hỗ trợ. (Bạn có thể đạt được kết quả của `FROM LAST` bằng cách đảo ngược thứ tự `ORDER BY`.)"

---

## 11. Tóm tắt

- Window function = tính toán kiểu aggregate **nhưng không gộp row**; mỗi input row vẫn cho một output row.
- Dấu hiệu nhận biết duy nhất về cú pháp: có mệnh đề `OVER` ngay sau tên function.
- `OVER (PARTITION BY ... ORDER BY ... frame_clause)` — cả ba phần đều tuỳ chọn.
- Bỏ `PARTITION BY` → một partition chứa tất cả row. Bỏ `ORDER BY` → thứ tự không xác định, và frame mặc định thành cả partition.
- Frame mặc định là `RANGE UNBOUNDED PRECEDING`, tức `RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW` → aggregate + `ORDER BY` cho ra running sum.
- Window function **chỉ** được viết trong `SELECT` list và `ORDER BY`. Muốn lọc theo kết quả của nó thì bọc bằng sub-select hoặc CTE ([[09 - Subquery, CTE và Set Operations]]).
- Nhiều function dùng chung một window → đặt tên bằng mệnh đề `WINDOW`.

---

## 🔌 Liên hệ stack thực tế

> Phần này là ghi chú riêng, KHÔNG trích từ tài liệu PostgreSQL.

Bài toán "xếp hạng trong nhóm" (top-N mỗi nhóm, thứ hạng của một thành viên so với nhóm của họ) là nghiệp vụ rất quen với loyalty program. Với một relational database, cả bài toán này gọn trong một câu `SELECT` có `row_number() OVER (PARTITION BY ... ORDER BY ...)` như mục 6.

Firestore không có khái niệm tương đương — nó không cung cấp window function, nên thứ hạng thường phải tính ở tầng application hoặc ghi sẵn thành field khi dữ liệu thay đổi. Đây là một khác biệt kiến trúc đáng nhớ khi cân nhắc giữa document store và relational database cho tính năng bảng xếp hạng. Mình không ghi tên API hay giới hạn cụ thể của Firestore ở đây vì chưa tra tài liệu chính thức trong bài này.

---

## Liên kết
- Bài trước: [[11 - NULL, Hàm String, Date và JSON]]
- Bài kế: [[13 - SQL Injection và Parameterized Query]]
- Liên quan: [[03 - Queries - SELECT, JOIN, Aggregate]] — `SELECT`, `JOIN`, `GROUP BY` và aggregate function (nền tảng để so sánh ở mục 2)
- Liên quan: [[09 - Subquery, CTE và Set Operations]] — sub-select và `WITH`, cách lách giới hạn ở mục 6
- Quay lại mục lục: [[00 - Tổng hợp (Relational Databases)]]

## Nguồn tham khảo
- PostgreSQL 18 Documentation — *3.5. Window Functions* : https://www.postgresql.org/docs/current/tutorial-window.html
- PostgreSQL 18 Documentation — *9.22. Window Functions* (Table 9.67. General-Purpose Window Functions) : https://www.postgresql.org/docs/current/functions-window.html
- PostgreSQL 18 Documentation — *4.2.8. Window Function Calls* (trong trang *4.2. Value Expressions*) : https://www.postgresql.org/docs/current/sql-expressions.html
- Trang nguồn không có hình minh hoạ nào, nên bài này không có ảnh trong `assets/`.
