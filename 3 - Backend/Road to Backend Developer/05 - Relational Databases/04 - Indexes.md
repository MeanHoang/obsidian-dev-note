# 04 — Indexes

> **Nguồn chính:** PostgreSQL Documentation — Chapter 11. Indexes — https://www.postgresql.org/docs/current/indexes-intro.html
> Bài này bám mục 11.1 → 11.12 của chương Indexes, cộng phần cơ bản của 14.1 Using EXPLAIN.

---

## 1. Index là gì và vì sao cần

📖 **Nguyên văn**
> "Suppose we have a table similar to this:"

```sql
CREATE TABLE test1 (
    id integer,
    content varchar
);
```

🇻🇳 Tạo bảng `test1` gồm 2 cột: `id` kiểu integer và `content` kiểu varchar.

📖 **Nguyên văn**
> "and the application issues many queries of the form:"

```sql
SELECT content FROM test1 WHERE id = constant;
```

🇻🇳 Ứng dụng chạy rất nhiều query dạng "lấy `content` của dòng có `id` bằng một hằng số".

📖 **Nguyên văn**
> "With no advance preparation, the system would have to scan the entire `test1` table, row by row, to find all matching entries. If there are many rows in `test1` and only a few rows (perhaps zero or one) that would be returned by such a query, this is clearly an inefficient method. But if the system has been instructed to maintain an index on the `id` column, it can use a more efficient method for locating matching rows. For instance, it might only have to walk a few levels deep into a search tree."

🇻🇳 **Dịch**
> "Nếu không chuẩn bị trước, hệ thống sẽ phải quét toàn bộ bảng `test1`, từng dòng một, để tìm tất cả các bản ghi khớp. Nếu `test1` có rất nhiều dòng mà query chỉ trả về vài dòng (có thể là không dòng nào hoặc một dòng), thì rõ ràng đây là cách làm kém hiệu quả. Nhưng nếu hệ thống đã được yêu cầu duy trì một index trên cột `id`, nó có thể dùng một cách hiệu quả hơn để định vị các dòng khớp. Ví dụ, nó có thể chỉ cần đi sâu vài tầng vào trong một cây tìm kiếm."

📖 **Nguyên văn**
> "A similar approach is used in most non-fiction books: terms and concepts that are frequently looked up by readers are collected in an alphabetic index at the end of the book. The interested reader can scan the index relatively quickly and flip to the appropriate page(s), rather than having to read the entire book to find the material of interest. Just as it is the task of the author to anticipate the items that readers are likely to look up, it is the task of the database programmer to foresee which indexes will be useful."

🇻🇳 **Dịch**
> "Một cách tiếp cận tương tự được dùng trong hầu hết sách phi hư cấu: các thuật ngữ và khái niệm mà người đọc hay tra cứu được gom vào một mục lục tra cứu xếp theo thứ tự bảng chữ cái ở cuối sách. Người đọc quan tâm có thể lướt mục lục đó khá nhanh rồi giở đến đúng trang, thay vì phải đọc cả quyển sách để tìm phần mình cần. Cũng như tác giả phải đoán trước những mục người đọc có khả năng tra cứu, người lập trình database phải dự đoán trước những index nào sẽ hữu ích."

📖 **Nguyên văn**
> "The following command can be used to create an index on the `id` column, as discussed:"

```sql
CREATE INDEX test1_id_index ON test1 (id);
```

🇻🇳 Lệnh tạo index tên `test1_id_index` trên cột `id` của bảng `test1`.

📖 **Nguyên văn**
> "The name `test1_id_index` can be chosen freely, but you should pick something that enables you to remember later what the index was for.
>
> To remove an index, use the `DROP INDEX` command. Indexes can be added to and removed from tables at any time."

🇻🇳 **Dịch**
> "Tên `test1_id_index` có thể đặt tuỳ ý, nhưng bạn nên chọn cái tên giúp bạn nhớ được sau này index đó dùng để làm gì.
>
> Để xoá một index, dùng lệnh `DROP INDEX`. Index có thể được thêm vào và gỡ khỏi bảng bất cứ lúc nào."

📖 **Nguyên văn**
> "Once an index is created, no further intervention is required: the system will update the index when the table is modified, and it will use the index in queries when it thinks doing so would be more efficient than a sequential table scan. But you might have to run the `ANALYZE` command regularly to update statistics to allow the query planner to make educated decisions."

🇻🇳 **Dịch**
> "Một khi index đã được tạo, không cần can thiệp gì thêm: hệ thống sẽ tự cập nhật index khi bảng bị thay đổi, và sẽ dùng index trong query khi nó cho rằng làm vậy hiệu quả hơn quét tuần tự cả bảng. Nhưng bạn có thể phải chạy lệnh `ANALYZE` định kỳ để cập nhật statistics, giúp query planner ra quyết định có cơ sở."

📖 **Nguyên văn**
> "Indexes can also benefit `UPDATE` and `DELETE` commands with search conditions. Indexes can moreover be used in join searches. Thus, an index defined on a column that is part of a join condition can also significantly speed up queries with joins."

🇻🇳 **Dịch**
> "Index cũng có lợi cho lệnh `UPDATE` và `DELETE` có điều kiện tìm kiếm. Hơn nữa index còn được dùng trong tìm kiếm khi join. Do đó, một index định nghĩa trên cột nằm trong điều kiện join cũng có thể tăng tốc đáng kể các query có join."

📖 **Nguyên văn**
> "In general, PostgreSQL indexes can be used to optimize queries that contain one or more `WHERE` or `JOIN` clauses of the form
>
> indexed-column indexable-operator comparison-value
>
> Here, the indexed-column is whatever column or expression the index has been defined on. The indexable-operator is an operator that is a member of the index's operator class for the indexed column. And the comparison-value can be any expression that is not volatile and does not reference the index's table."

🇻🇳 **Dịch**
> "Nói chung, index trong PostgreSQL có thể dùng để tối ưu các query chứa một hoặc nhiều mệnh đề `WHERE` hay `JOIN` dạng
>
> cột-được-index toán-tử-index-được giá-trị-so-sánh
>
> Ở đây, cột-được-index là cột hoặc biểu thức mà index được định nghĩa trên đó. Toán-tử-index-được là một toán tử thuộc operator class của index cho cột đó. Còn giá-trị-so-sánh có thể là bất kỳ biểu thức nào không volatile và không tham chiếu tới chính bảng của index."

💡 **Ví dụ đời sống**
Index giống **mục lục tra cứu cuối sách** (chính tài liệu PostgreSQL dùng ví dụ này) hoặc **danh bạ điện thoại xếp theo tên**. Muốn tìm số của "Nguyễn Văn A", bạn không đọc từ trang 1; bạn mở đúng vần N rồi dò vài dòng.

Nhưng phải nói rõ **mặt trái** — đây là chỗ người mới hay quên:
- Cuốn danh bạ dày thêm vì có phần index → **index tốn dung lượng đĩa**.
- Mỗi lần có người mới chuyển đến / đổi số, bạn phải sửa cả trang dữ liệu **lẫn** phần index → **ghi dữ liệu chậm đi**.
- Nếu bạn làm 5 kiểu index khác nhau (theo tên, theo số, theo địa chỉ, theo nghề, theo tuổi) thì mỗi lần thay đổi 1 người phải sửa 5 chỗ.
- Danh bạ chỉ giúp khi bạn tra **vài người**. Nếu bạn cần đọc *toàn bộ* danh bạ thì mở mục lục còn chậm hơn đọc thẳng → đó chính là lý do planner đôi khi chọn Seq Scan.

---

## 2. Cái giá phải trả của index (đoạn quan trọng nhất)

> [!warning] Đây là đoạn người mới học hay bỏ qua nhất. Index KHÔNG miễn phí.

📖 **Nguyên văn**
> "Creating an index on a large table can take a long time. By default, PostgreSQL allows reads (`SELECT` statements) to occur on the table in parallel with index creation, but writes (`INSERT`, `UPDATE`, `DELETE`) are blocked until the index build is finished. In production environments this is often unacceptable. It is possible to allow writes to occur in parallel with index creation, but there are several caveats to be aware of — for more information see Building Indexes Concurrently."

🇻🇳 **Dịch**
> "Tạo index trên một bảng lớn có thể mất rất nhiều thời gian. Mặc định, PostgreSQL cho phép các thao tác đọc (lệnh `SELECT`) diễn ra trên bảng song song với quá trình tạo index, nhưng các thao tác ghi (`INSERT`, `UPDATE`, `DELETE`) bị chặn cho tới khi index xây xong. Trong môi trường production điều này thường là không chấp nhận được. Có thể cho phép ghi diễn ra song song với việc tạo index, nhưng có vài điểm cần lưu ý — xem thêm Building Indexes Concurrently."

📖 **Nguyên văn**
> "After an index is created, the system has to keep it synchronized with the table. This adds overhead to data manipulation operations. Indexes can also prevent the creation of heap-only tuples. Therefore indexes that are seldom or never used in queries should be removed."

🇻🇳 **Dịch**
> "Sau khi một index được tạo, hệ thống phải giữ nó đồng bộ với bảng. Điều này làm tăng chi phí (overhead) cho các thao tác thay đổi dữ liệu. Index cũng có thể ngăn việc tạo heap-only tuple. Do đó, những index hiếm khi hoặc không bao giờ được dùng trong query thì nên gỡ bỏ."

> [!tip] Tóm ba cái giá:
> 1. **Ghi chậm hơn** — mỗi `INSERT`/`UPDATE`/`DELETE` phải cập nhật thêm index (overhead), và index còn chặn tối ưu heap-only tuple.
> 2. **Tốn dung lượng** — index là cấu trúc dữ liệu riêng nằm trên đĩa (mục 11.8 nói rõ partial index "reduces the size of the index").
> 3. **Phải bảo trì** — chạy `ANALYZE` để statistics không lệch, và gỡ index không dùng.

---

## 3. Các loại index (11.2 Index Types)

### 3.1. B-tree

📖 **Nguyên văn**
> "B-trees can handle equality and range queries on data that can be sorted into some ordering. In particular, the PostgreSQL query planner will consider using a B-tree index whenever an indexed column is involved in a comparison using one of these operators:
>
> `<   <=   =   >=   >`
>
> Constructs equivalent to combinations of these operators, such as `BETWEEN` and `IN`, can also be implemented with a B-tree index search. Also, an `IS NULL` or `IS NOT NULL` condition on an index column can be used with a B-tree index."

🇻🇳 **Dịch**
> "B-tree có thể xử lý các query so sánh bằng và query theo khoảng trên dữ liệu có thể sắp xếp theo một thứ tự nào đó. Cụ thể, query planner của PostgreSQL sẽ cân nhắc dùng B-tree index mỗi khi một cột được index tham gia vào phép so sánh dùng một trong các toán tử sau:
>
> `<   <=   =   >=   >`
>
> Những cấu trúc tương đương với tổ hợp của các toán tử này, như `BETWEEN` và `IN`, cũng có thể được thực hiện bằng tìm kiếm trên B-tree index. Ngoài ra, điều kiện `IS NULL` hoặc `IS NOT NULL` trên cột index cũng dùng được với B-tree index."

📖 **Nguyên văn**
> "The optimizer can also use a B-tree index for queries involving the pattern matching operators `LIKE` and `~` if the pattern is a constant and is anchored to the beginning of the string — for example, `col LIKE 'foo%'` or `col ~ '^foo'`, but not `col LIKE '%bar'`."

🇻🇳 **Dịch**
> "Optimizer cũng có thể dùng B-tree index cho các query có toán tử so khớp mẫu `LIKE` và `~` nếu mẫu là hằng số và được neo vào đầu chuỗi — ví dụ `col LIKE 'foo%'` hoặc `col ~ '^foo'`, nhưng không phải `col LIKE '%bar'`."

📖 **Nguyên văn**
> "B-tree indexes can also be used to retrieve data in sorted order. This is not always faster than a simple scan and sort, but it is often helpful."

🇻🇳 **Dịch**
> "B-tree index cũng có thể dùng để lấy dữ liệu theo thứ tự đã sắp xếp. Cách này không phải lúc nào cũng nhanh hơn quét rồi sắp xếp, nhưng thường là hữu ích."

> [!note] B-tree là loại index **mặc định**: `CREATE INDEX` không ghi `USING` thì PostgreSQL tạo B-tree.

### 3.2. Hash

📖 **Nguyên văn**
> "Hash indexes store a 32-bit hash code derived from the value of the indexed column. Hence, such indexes can only handle simple equality comparisons. The query planner will consider using a hash index whenever an indexed column is involved in a comparison using the equal operator:
>
> `=`"

🇻🇳 **Dịch**
> "Hash index lưu một mã hash 32-bit sinh ra từ giá trị của cột được index. Do đó, loại index này chỉ xử lý được phép so sánh bằng đơn giản. Query planner sẽ cân nhắc dùng hash index mỗi khi một cột được index tham gia phép so sánh dùng toán tử bằng:
>
> `=`"

📖 **Nguyên văn**
```sql
CREATE INDEX name ON table USING HASH (column);
```

🇻🇳 Cú pháp tạo index với loại (method) là HASH thay vì B-tree mặc định.

### 3.3. GiST

📖 **Nguyên văn**
> "GiST indexes are not a single kind of index, but rather an infrastructure within which many different indexing strategies can be implemented. Accordingly, the particular operators with which a GiST index can be used vary depending on the indexing strategy (the operator class). As an example, the standard distribution of PostgreSQL includes GiST operator classes for several two-dimensional geometric data types, which support indexed queries using these operators:
>
> `<<   &<   &>   >>   <<|   &<|   |&>   |>>   @>   <@   ~=   &&`"

🇻🇳 **Dịch**
> "GiST index không phải là một loại index đơn lẻ, mà là một hạ tầng bên trong đó nhiều chiến lược đánh index khác nhau có thể được cài đặt. Vì thế, các toán tử cụ thể mà GiST index dùng được sẽ thay đổi tuỳ theo chiến lược đánh index (tức operator class). Ví dụ, bản phân phối chuẩn của PostgreSQL có sẵn các GiST operator class cho vài kiểu dữ liệu hình học hai chiều, hỗ trợ query có index dùng các toán tử sau:
>
> `<<   &<   &>   >>   <<|   &<|   |&>   |>>   @>   <@   ~=   &&`"

📖 **Nguyên văn**
> "GiST indexes are also capable of optimizing "nearest-neighbor" searches, such as"

```sql
SELECT * FROM places ORDER BY location <-> point '(101,456)' LIMIT 10;
```

> "which finds the ten places closest to a given target point."

🇻🇳 **Dịch**
> "GiST index còn có khả năng tối ưu các tìm kiếm "láng giềng gần nhất" (nearest-neighbor), chẳng hạn query trên — nó tìm mười địa điểm gần nhất với một điểm đích cho trước."

### 3.4. SP-GiST

📖 **Nguyên văn**
> "SP-GiST indexes, like GiST indexes, offer an infrastructure that supports various kinds of searches. SP-GiST permits implementation of a wide range of different non-balanced disk-based data structures, such as quadtrees, k-d trees, and radix trees (tries). As an example, the standard distribution of PostgreSQL includes SP-GiST operator classes for two-dimensional points, which support indexed queries using these operators:
>
> `<<   >>   ~=   <@   <<|   |>>`"

🇻🇳 **Dịch**
> "SP-GiST index, giống GiST index, cung cấp một hạ tầng hỗ trợ nhiều kiểu tìm kiếm khác nhau. SP-GiST cho phép cài đặt một dải rộng các cấu trúc dữ liệu trên đĩa dạng không cân bằng (non-balanced), như quadtree, k-d tree và radix tree (trie). Ví dụ, bản phân phối chuẩn của PostgreSQL có sẵn các SP-GiST operator class cho điểm hai chiều, hỗ trợ query có index dùng các toán tử sau:
>
> `<<   >>   ~=   <@   <<|   |>>`"

### 3.5. GIN

📖 **Nguyên văn**
> "GIN indexes are "inverted indexes" which are appropriate for data values that contain multiple component values, such as arrays. An inverted index contains a separate entry for each component value, and can efficiently handle queries that test for the presence of specific component values."

🇻🇳 **Dịch**
> "GIN index là "inverted index" (index đảo), phù hợp với các giá trị dữ liệu chứa nhiều giá trị thành phần bên trong, ví dụ như array. Một inverted index chứa một entry riêng cho từng giá trị thành phần, và có thể xử lý hiệu quả các query kiểm tra sự hiện diện của những giá trị thành phần cụ thể."

📖 **Nguyên văn**
> "Like GiST and SP-GiST, GIN can support many different user-defined indexing strategies, and the particular operators with which a GIN index can be used vary depending on the indexing strategy. As an example, the standard distribution of PostgreSQL includes a GIN operator class for arrays, which supports indexed queries using these operators:
>
> `<@   @>   =   &&`"

🇻🇳 **Dịch**
> "Giống GiST và SP-GiST, GIN có thể hỗ trợ nhiều chiến lược đánh index do người dùng định nghĩa, và các toán tử cụ thể mà GIN index dùng được sẽ thay đổi tuỳ theo chiến lược đó. Ví dụ, bản phân phối chuẩn của PostgreSQL có sẵn một GIN operator class cho array, hỗ trợ query có index dùng các toán tử sau:
>
> `<@   @>   =   &&`"

### 3.6. BRIN

📖 **Nguyên văn**
> "BRIN indexes (a shorthand for Block Range INdexes) store summaries about the values stored in consecutive physical block ranges of a table. Thus, they are most effective for columns whose values are well-correlated with the physical order of the table rows. Like GiST, SP-GiST and GIN, BRIN can support many different indexing strategies, and the particular operators with which a BRIN index can be used vary depending on the indexing strategy. For data types that have a linear sort order, the indexed data corresponds to the minimum and maximum values of the values in the column for each block range. This supports indexed queries using these operators:
>
> `<   <=   =   >=   >`"

🇻🇳 **Dịch**
> "BRIN index (viết tắt của Block Range INdexes) lưu các bản tóm tắt về những giá trị nằm trong các dải block vật lý liên tiếp của một bảng. Vì vậy, chúng hiệu quả nhất với những cột mà giá trị tương quan chặt với thứ tự vật lý của các dòng trong bảng. Giống GiST, SP-GiST và GIN, BRIN có thể hỗ trợ nhiều chiến lược đánh index khác nhau, và các toán tử cụ thể mà BRIN index dùng được sẽ thay đổi tuỳ theo chiến lược đó. Với các kiểu dữ liệu có thứ tự sắp xếp tuyến tính, dữ liệu được index tương ứng với giá trị nhỏ nhất và lớn nhất của cột đó trong mỗi dải block. Điều này hỗ trợ query có index dùng các toán tử sau:
>
> `<   <=   =   >=   >`"

### 3.7. Bảng tóm tắt

| Loại | Mô tả (theo 11.2) | Toán tử hỗ trợ (ví dụ chuẩn trong doc) | Khi nào dùng |
|---|---|---|---|
| **B-tree** | Xử lý equality và range query trên dữ liệu sắp xếp được; là loại mặc định | `<  <=  =  >=  >` (kèm `BETWEEN`, `IN`, `IS NULL`, `LIKE 'foo%'`) | Mặc định cho gần như mọi cột thường: khoá, ngày tháng, số, chuỗi so sánh/khoảng; cần lấy dữ liệu theo thứ tự đã sắp |
| **Hash** | Lưu mã hash 32-bit sinh từ giá trị cột | `=` | Chỉ khi query duy nhất là so sánh bằng |
| **GiST** | Không phải một loại index đơn lẻ, mà là hạ tầng cho nhiều chiến lược index | Tuỳ operator class; ví dụ hình học 2 chiều: `<< &< &> >> <<\| &<\| \|&> \|>> @> <@ ~= &&` | Dữ liệu hình học, tìm kiếm "nearest-neighbor" |
| **SP-GiST** | Hạ tầng cho các cấu trúc trên đĩa dạng non-balanced: quadtree, k-d tree, radix tree (trie) | Ví dụ điểm 2 chiều: `<< >> ~= <@ <<\| \|>>` | Dữ liệu phân hoạch không gian / phân cấp; cũng hỗ trợ nearest-neighbor |
| **GIN** | "Inverted index", có entry riêng cho từng giá trị thành phần | Ví dụ array: `<@ @> = &&` | Giá trị chứa nhiều thành phần: array (và các operator class khác) |
| **BRIN** | Block Range INdexes — lưu tóm tắt min/max theo dải block vật lý | `<  <=  =  >=  >` | Cột có giá trị tương quan chặt với thứ tự vật lý của dòng (bảng rất lớn, dữ liệu ghi theo thứ tự) |

---

## 4. Multicolumn Index — thứ tự cột quan trọng thế nào

📖 **Nguyên văn**
> "An index can be defined on more than one column of a table. For example, if you have a table of this form:"

```sql
CREATE TABLE test2 (
  major int,
  minor int,
  name varchar
);
```

🇻🇳 Tạo bảng `test2` ba cột `major`, `minor`, `name` để làm ví dụ cho index nhiều cột.

📖 **Nguyên văn**
> "and you frequently issue queries like:"

```sql
SELECT name FROM test2 WHERE major = constant AND minor = constant;
```

> "then it might be appropriate to define an index on the columns `major` and `minor` together, e.g.:"

```sql
CREATE INDEX test2_mm_idx ON test2 (major, minor);
```

🇻🇳 Nếu hay query theo cả `major` lẫn `minor`, nên tạo một index chung trên hai cột đó.

📖 **Nguyên văn**
> "Currently, only the B-tree, GiST, GIN, and BRIN index types support multiple-key-column indexes. Whether there can be multiple key columns is independent of whether `INCLUDE` columns can be added to the index. Indexes can have up to 32 columns, including `INCLUDE` columns."

🇻🇳 **Dịch**
> "Hiện tại chỉ có các loại index B-tree, GiST, GIN và BRIN hỗ trợ index nhiều cột khoá. Việc có nhiều cột khoá hay không là độc lập với việc có thể thêm cột `INCLUDE` vào index hay không. Index có thể có tối đa 32 cột, tính cả các cột `INCLUDE`."

> [!warning] Thứ tự cột trong multicolumn index quyết định index có phát huy tác dụng hay không.

📖 **Nguyên văn**
> "A multicolumn B-tree index can be used with query conditions that involve any subset of the index's columns, but the index is most efficient when there are constraints on the leading (leftmost) columns. The exact rule is that equality constraints on leading columns, plus any inequality constraints on the first column that does not have an equality constraint, will always be used to limit the portion of the index that is scanned. Constraints on columns to the right of these columns are checked in the index, so they'll always save visits to the table proper, but they do not necessarily reduce the portion of the index that has to be scanned."

🇻🇳 **Dịch**
> "Một B-tree index nhiều cột có thể dùng được với điều kiện query liên quan tới bất kỳ tập con nào của các cột trong index, nhưng index hiệu quả nhất khi có ràng buộc trên các cột dẫn đầu (ngoài cùng bên trái). Quy tắc chính xác là: các ràng buộc bằng (equality) trên những cột dẫn đầu, cộng với ràng buộc bất đẳng thức trên cột đầu tiên không có ràng buộc bằng, sẽ luôn được dùng để giới hạn phần index cần quét. Các ràng buộc trên những cột nằm bên phải chúng thì được kiểm tra trong index, nên luôn giúp tiết kiệm việc phải truy cập vào bảng thật, nhưng không nhất thiết làm giảm phần index phải quét."

📖 **Nguyên văn**
> "A multicolumn GiST index can be used with query conditions that involve any subset of the index's columns. Conditions on additional columns restrict the entries returned by the index, but the condition on the first column is the most important one for determining how much of the index needs to be scanned. A GiST index will be relatively ineffective if its first column has only a few distinct values, even if there are many distinct values in additional columns."

🇻🇳 **Dịch**
> "Một GiST index nhiều cột có thể dùng với điều kiện query liên quan tới bất kỳ tập con nào của các cột trong index. Điều kiện trên các cột phụ sẽ thu hẹp số entry mà index trả về, nhưng điều kiện trên cột đầu tiên mới là cái quan trọng nhất quyết định phải quét bao nhiêu phần của index. Một GiST index sẽ tương đối kém hiệu quả nếu cột đầu tiên của nó chỉ có ít giá trị phân biệt, dù các cột sau có nhiều giá trị phân biệt đi nữa."

📖 **Nguyên văn**
> "A multicolumn GIN index can be used with query conditions that involve any subset of the index's columns. Unlike B-tree or GiST, index search effectiveness is the same regardless of which index column(s) the query conditions use."

🇻🇳 **Dịch**
> "Một GIN index nhiều cột có thể dùng với điều kiện query liên quan tới bất kỳ tập con nào của các cột trong index. Khác với B-tree hay GiST, hiệu quả tìm kiếm của index là như nhau bất kể điều kiện query dùng cột nào trong index."

📖 **Nguyên văn**
> "Multicolumn indexes should be used sparingly. In most situations, an index on a single column is sufficient and saves space and time. Indexes with more than three columns are unlikely to be helpful unless the usage of the table is extremely stylized."

🇻🇳 **Dịch**
> "Nên dùng multicolumn index một cách dè dặt. Trong đa số tình huống, index trên một cột là đủ và tiết kiệm cả dung lượng lẫn thời gian. Index có hơn ba cột hiếm khi hữu ích trừ khi cách dùng bảng đó cực kỳ đặc thù."

---

## 5. Index và ORDER BY (11.4)

📖 **Nguyên văn**
> "In addition to simply finding the rows to be returned by a query, an index may be able to deliver them in a specific sorted order. This allows a query's `ORDER BY` specification to be honored without a separate sorting step. Of the index types currently supported by PostgreSQL, only B-tree can produce sorted output — the other index types return matching rows in an unspecified, implementation-dependent order."

🇻🇳 **Dịch**
> "Ngoài việc chỉ đơn giản tìm ra các dòng mà query cần trả về, index còn có thể trả chúng ra theo một thứ tự sắp xếp cụ thể. Điều này cho phép đáp ứng mệnh đề `ORDER BY` của query mà không cần một bước sắp xếp riêng. Trong các loại index PostgreSQL hỗ trợ hiện nay, chỉ B-tree mới tạo được output đã sắp xếp — các loại index khác trả về các dòng khớp theo một thứ tự không xác định, phụ thuộc cách cài đặt."

📖 **Nguyên văn**
> "An important special case is `ORDER BY` in combination with `LIMIT` n: an explicit sort will have to process all the data to identify the first n rows, but if there is an index matching the `ORDER BY`, the first n rows can be retrieved directly, without scanning the remainder at all."

🇻🇳 **Dịch**
> "Một trường hợp đặc biệt quan trọng là `ORDER BY` kết hợp với `LIMIT` n: một phép sắp xếp tường minh sẽ phải xử lý toàn bộ dữ liệu để xác định n dòng đầu tiên, nhưng nếu có index khớp với `ORDER BY` thì n dòng đầu có thể được lấy ra trực tiếp, không cần quét phần còn lại chút nào."

📖 **Nguyên văn**
```sql
CREATE INDEX test2_info_nulls_low ON test2 (info NULLS FIRST);
CREATE INDEX test3_desc_index ON test3 (id DESC NULLS LAST);
```

🇻🇳 Hai lệnh tạo B-tree index với thứ tự sắp xếp không mặc định: một index để NULL lên đầu, một index sắp giảm dần và để NULL xuống cuối.

---

## 6. Unique Index (11.6)

📖 **Nguyên văn**
> "Indexes can also be used to enforce uniqueness of a column's value, or the uniqueness of the combined values of more than one column."

🇻🇳 **Dịch**
> "Index cũng có thể được dùng để áp đặt tính duy nhất cho giá trị của một cột, hoặc tính duy nhất cho tổ hợp giá trị của nhiều cột."

📖 **Nguyên văn**
```sql
CREATE UNIQUE INDEX name ON table (column [, ...]) [ NULLS [ NOT ] DISTINCT ];
```

🇻🇳 Cú pháp tạo index duy nhất; phần `NULLS [ NOT ] DISTINCT` là tuỳ chọn quyết định cách xử lý giá trị null.

📖 **Nguyên văn**
> "Currently, only B-tree indexes can be declared unique.
>
> When an index is declared unique, multiple table rows with equal indexed values are not allowed. By default, null values in a unique column are not considered equal, allowing multiple nulls in the column. The `NULLS NOT DISTINCT` option modifies this and causes the index to treat nulls as equal. A multicolumn unique index will only reject cases where all indexed columns are equal in multiple rows."

🇻🇳 **Dịch**
> "Hiện tại chỉ có B-tree index mới khai báo được là unique.
>
> Khi một index được khai báo unique, sẽ không cho phép nhiều dòng trong bảng có giá trị được index bằng nhau. Mặc định, các giá trị null trong một cột unique không được coi là bằng nhau, nên cột đó vẫn có thể chứa nhiều null. Tuỳ chọn `NULLS NOT DISTINCT` thay đổi điều này và khiến index coi các null là bằng nhau. Một unique index nhiều cột chỉ từ chối những trường hợp mà tất cả các cột được index đều bằng nhau ở nhiều dòng."

📖 **Nguyên văn**
> "PostgreSQL automatically creates a unique index when a unique constraint or primary key is defined for a table. The index covers the columns that make up the primary key or unique constraint (a multicolumn index, if appropriate), and is the mechanism that enforces the constraint."

🇻🇳 **Dịch**
> "PostgreSQL tự động tạo một unique index khi một unique constraint hoặc primary key được định nghĩa cho bảng. Index đó bao phủ các cột tạo nên primary key hoặc unique constraint (là index nhiều cột nếu cần), và chính nó là cơ chế áp đặt constraint."

📖 **Nguyên văn**
> "Note
>
> There's no need to manually create indexes on unique columns; doing so would just duplicate the automatically-created index."

🇻🇳 **Dịch**
> "Ghi chú
>
> Không cần tự tay tạo index trên các cột unique; làm vậy chỉ lặp lại index vốn đã được tạo tự động."

---

## 7. Partial Index (11.8)

📖 **Nguyên văn**
> "A partial index is an index built over a subset of a table; the subset is defined by a conditional expression (called the predicate of the partial index). The index contains entries only for those table rows that satisfy the predicate. Partial indexes are a specialized feature, but there are several situations in which they are useful."

🇻🇳 **Dịch**
> "Partial index là index được xây trên một tập con của bảng; tập con đó được định nghĩa bằng một biểu thức điều kiện (gọi là predicate của partial index). Index chỉ chứa entry cho những dòng thoả predicate. Partial index là tính năng chuyên biệt, nhưng có vài tình huống nó rất hữu ích."

📖 **Nguyên văn**
> "One major reason for using a partial index is to avoid indexing common values. Since a query searching for a common value (one that accounts for more than a few percent of all the table rows) will not use the index anyway, there is no point in keeping those rows in the index at all. This reduces the size of the index, which will speed up those queries that do use the index. It will also speed up many table update operations because the index does not need to be updated in all cases."

🇻🇳 **Dịch**
> "Một lý do lớn để dùng partial index là tránh index các giá trị phổ biến. Vì một query tìm giá trị phổ biến (giá trị chiếm hơn vài phần trăm tổng số dòng trong bảng) dù sao cũng sẽ không dùng index, nên chẳng ích gì khi giữ những dòng đó trong index. Việc này làm giảm kích thước index, qua đó tăng tốc những query thực sự dùng index. Nó cũng tăng tốc nhiều thao tác update bảng vì index không cần phải được cập nhật trong mọi trường hợp."

### Example 11.1 — loại trừ giá trị phổ biến

📖 **Nguyên văn**
> "Suppose you are storing web server access logs in a database. Most accesses originate from the IP address range of your organization but some are from elsewhere (say, employees on dial-up connections). If your searches by IP are primarily for outside accesses, you probably do not need to index the IP range that corresponds to your organization's subnet."

🇻🇳 **Dịch**
> "Giả sử bạn lưu access log của web server trong database. Phần lớn lượt truy cập đến từ dải IP của tổ chức bạn nhưng một số đến từ nơi khác (ví dụ nhân viên dùng kết nối dial-up). Nếu bạn tìm kiếm theo IP chủ yếu để tra các truy cập từ bên ngoài, thì có lẽ bạn không cần index dải IP tương ứng với subnet của tổ chức mình."

📖 **Nguyên văn**
```sql
CREATE TABLE access_log (
    url varchar,
    client_ip inet,
    ...
);
```

🇻🇳 Bảng log truy cập gồm `url` và `client_ip` (kiểu `inet`).

📖 **Nguyên văn**
```sql
CREATE INDEX access_log_client_ip_ix ON access_log (client_ip)
WHERE NOT (client_ip > inet '192.168.100.0' AND
           client_ip < inet '192.168.100.255');
```

🇻🇳 Tạo partial index trên `client_ip`, nhưng chỉ index những dòng có IP **nằm ngoài** dải nội bộ `192.168.100.*`.

📖 **Nguyên văn**
> "A typical query that can use this index would be:"

```sql
SELECT *
FROM access_log
WHERE url = '/index.html' AND client_ip = inet '212.78.10.32';
```

🇻🇳 Query dùng được index vì IP `212.78.10.32` nằm ngoài dải bị loại trừ.

📖 **Nguyên văn**
> "The following query cannot use the partial index, as it uses an IP address that is excluded from the index:"

```sql
SELECT *
FROM access_log
WHERE url = '/index.html' AND client_ip = inet '192.168.100.23';
```

🇻🇳 Query này **không** dùng được partial index vì IP `192.168.100.23` thuộc dải đã bị loại khỏi index.

📖 **Nguyên văn**
> "Observe that this kind of partial index requires that the common values be predetermined, so such partial indexes are best used for data distributions that do not change. Such indexes can be recreated occasionally to adjust for new data distributions, but this adds maintenance effort."

🇻🇳 **Dịch**
> "Lưu ý rằng kiểu partial index này đòi hỏi các giá trị phổ biến phải được xác định trước, nên nó phù hợp nhất với những phân phối dữ liệu không thay đổi. Có thể thỉnh thoảng tạo lại index để điều chỉnh theo phân phối dữ liệu mới, nhưng việc đó làm tăng công sức bảo trì."

### Example 11.2 — loại trừ giá trị không quan tâm

📖 **Nguyên văn**
> "If you have a table that contains both billed and unbilled orders, where the unbilled orders take up a small fraction of the total table and yet those are the most-accessed rows, you can improve performance by creating an index on just the unbilled rows. The command to create the index would look like this:"

```sql
CREATE INDEX orders_unbilled_index ON orders (order_nr)
    WHERE billed is not true;
```

🇻🇳 **Dịch**
> "Nếu bạn có một bảng chứa cả đơn hàng đã xuất hoá đơn và chưa xuất hoá đơn, trong đó các đơn chưa xuất hoá đơn chỉ chiếm một phần nhỏ tổng bảng nhưng lại là những dòng được truy cập nhiều nhất, bạn có thể cải thiện hiệu năng bằng cách tạo index chỉ trên các dòng chưa xuất hoá đơn." — lệnh trên chỉ index cột `order_nr` cho những dòng có `billed is not true`.

📖 **Nguyên văn**
> "A possible query to use this index would be:"

```sql
SELECT * FROM orders WHERE billed is not true AND order_nr < 10000;
```

🇻🇳 Query khớp predicate (`billed is not true`) nên dùng được partial index.

📖 **Nguyên văn**
> "Note that this query cannot use this index:"

```sql
SELECT * FROM orders WHERE order_nr = 3501;
```

🇻🇳 Query này không dùng được index vì không có điều kiện `billed`, mà đơn 3501 có thể nằm ở nhóm đã hoặc chưa xuất hoá đơn.

📖 **Nguyên văn**
> "However, keep in mind that the predicate must match the conditions used in the queries that are supposed to benefit from the index. To be precise, a partial index can be used in a query only if the system can recognize that the `WHERE` condition of the query mathematically implies the predicate of the index. PostgreSQL does not have a sophisticated theorem prover that can recognize mathematically equivalent expressions that are written in different forms."

🇻🇳 **Dịch**
> "Tuy nhiên, hãy nhớ rằng predicate phải khớp với điều kiện dùng trong những query được cho là sẽ hưởng lợi từ index. Nói chính xác hơn, một partial index chỉ dùng được trong query nếu hệ thống nhận ra được rằng điều kiện `WHERE` của query kéo theo (về mặt toán học) predicate của index. PostgreSQL không có một bộ chứng minh định lý tinh vi để nhận ra các biểu thức tương đương về mặt toán học nhưng viết dưới dạng khác nhau."

---

## 8. Kiểm tra index có được dùng không: EXPLAIN

### 8.1. EXPLAIN Basics (14.1.1)

📖 **Nguyên văn**
> "The structure of a query plan is a tree of plan nodes. Nodes at the bottom level of the tree are scan nodes: they return raw rows from a table. There are different types of scan nodes for different table access methods: sequential scans, index scans, and bitmap index scans. [...] The output of `EXPLAIN` has one line for each node in the plan tree, showing the basic node type plus the cost estimates that the planner made for the execution of that plan node. [...] The very first line (the summary line for the topmost node) has the estimated total execution cost for the plan; it is this number that the planner seeks to minimize."

🇻🇳 **Dịch**
> "Cấu trúc của một query plan là một cây các plan node. Các node ở tầng đáy của cây là scan node: chúng trả về dòng thô từ bảng. Có nhiều loại scan node khác nhau cho các phương thức truy cập bảng khác nhau: sequential scan, index scan và bitmap index scan. [...] Output của `EXPLAIN` có một dòng cho mỗi node trong cây plan, hiển thị loại node cơ bản cộng với các ước lượng chi phí mà planner đưa ra cho việc thực thi node đó. [...] Dòng đầu tiên (dòng tổng kết cho node trên cùng) chứa tổng chi phí thực thi ước lượng của cả plan; đây chính là con số planner tìm cách tối thiểu hoá."

📖 **Nguyên văn**
> "Here is a trivial example, just to show what the output looks like:"

```
EXPLAIN SELECT * FROM tenk1;

                         QUERY PLAN
-------------------------------------------------------------
 Seq Scan on tenk1  (cost=0.00..445.00 rows=10000 width=244)
```

🇻🇳 Ví dụ đơn giản nhất: query không có `WHERE` → planner chọn **Seq Scan** (quét tuần tự toàn bảng).

📖 **Nguyên văn**
> "Since this query has no `WHERE` clause, it must scan all the rows of the table, so the planner has chosen to use a simple sequential scan plan. The numbers that are quoted in parentheses are (left to right):
>
> - Estimated start-up cost. This is the time expended before the output phase can begin, e.g., time to do the sorting in a sort node.
> - Estimated total cost. This is stated on the assumption that the plan node is run to completion, i.e., all available rows are retrieved.
> - Estimated number of rows output by this plan node.
> - Estimated average width of rows output by this plan node (in bytes)."

🇻🇳 **Dịch**
> "Vì query này không có mệnh đề `WHERE`, nó phải quét toàn bộ các dòng của bảng, nên planner đã chọn plan quét tuần tự đơn giản. Các con số trong ngoặc đơn lần lượt (từ trái sang phải) là:
>
> - Chi phí khởi động ước lượng. Đây là thời gian tiêu tốn trước khi giai đoạn xuất kết quả có thể bắt đầu, ví dụ thời gian sắp xếp trong một sort node.
> - Tổng chi phí ước lượng. Con số này được nêu với giả định plan node chạy đến hết, tức là mọi dòng có sẵn đều được lấy ra.
> - Số dòng ước lượng mà plan node này xuất ra.
> - Độ rộng trung bình ước lượng của các dòng do node này xuất ra (tính bằng byte)."

📖 **Nguyên văn**
> "Now let's modify the query to add a `WHERE` condition:"

```
EXPLAIN SELECT * FROM tenk1 WHERE unique1 < 7000;

                         QUERY PLAN
------------------------------------------------------------
 Seq Scan on tenk1  (cost=0.00..470.00 rows=7000 width=244)
   Filter: (unique1 < 7000)
```

🇻🇳 Có `WHERE` nhưng điều kiện khớp tới 7000/10000 dòng → vẫn là **Seq Scan**, chỉ thêm dòng `Filter`. Đây là minh chứng: có index chưa chắc được dùng, nếu query lấy quá nhiều dòng.

📖 **Nguyên văn**
> "Now, let's make the condition more restrictive:"

```
EXPLAIN SELECT * FROM tenk1 WHERE unique1 < 100;

                                  QUERY PLAN
------------------------------------------------------------------------------
 Bitmap Heap Scan on tenk1  (cost=5.06..224.98 rows=100 width=244)
   Recheck Cond: (unique1 < 100)
   ->  Bitmap Index Scan on tenk1_unique1  (cost=0.00..5.04 rows=100 width=0)
         Index Cond: (unique1 < 100)
```

🇻🇳 Điều kiện chặt hơn (chỉ 100 dòng) → planner chuyển sang dùng index qua **Bitmap Index Scan** + **Bitmap Heap Scan**.

📖 **Nguyên văn**
> "Here the planner has decided to use a two-step plan: the child plan node visits an index to find the locations of rows matching the index condition, and then the upper plan node actually fetches those rows from the table itself. Fetching rows separately is much more expensive than reading them sequentially, but because not all the pages of the table have to be visited, this is still cheaper than a sequential scan."

🇻🇳 **Dịch**
> "Ở đây planner đã quyết định dùng plan hai bước: node con truy cập index để tìm vị trí của các dòng khớp điều kiện index, rồi node cha mới thực sự lấy các dòng đó ra từ chính bảng. Lấy từng dòng riêng lẻ thì tốn kém hơn nhiều so với đọc tuần tự, nhưng vì không phải truy cập tất cả các page của bảng nên cách này vẫn rẻ hơn quét tuần tự."

📖 **Nguyên văn**
> "In some cases the planner will prefer a "simple" index scan plan:"

```
EXPLAIN SELECT * FROM tenk1 WHERE unique1 = 42;

                                 QUERY PLAN
-----------------------------------------------------------------------------
 Index Scan using tenk1_unique1 on tenk1  (cost=0.29..8.30 rows=1 width=244)
   Index Cond: (unique1 = 42)
```

🇻🇳 Chỉ lấy đúng 1 dòng → planner chọn **Index Scan** "đơn giản", đọc thẳng theo thứ tự index.

📖 **Nguyên văn**
> "In this type of plan the table rows are fetched in index order, which makes them even more expensive to read, but there are so few that the extra cost of sorting the row locations is not worth it. You'll most often see this plan type for queries that fetch just a single row. It's also often used for queries that have an `ORDER BY` condition that matches the index order, because then no extra sorting step is needed to satisfy the `ORDER BY`."

🇻🇳 **Dịch**
> "Trong loại plan này, các dòng của bảng được lấy theo thứ tự của index, khiến việc đọc còn tốn kém hơn, nhưng vì số dòng quá ít nên chi phí phụ để sắp xếp vị trí các dòng là không đáng. Bạn sẽ thấy loại plan này thường xuyên nhất ở những query chỉ lấy một dòng duy nhất. Nó cũng hay được dùng cho các query có điều kiện `ORDER BY` khớp với thứ tự của index, vì khi đó không cần bước sắp xếp phụ nào để đáp ứng `ORDER BY`."

> [!tip] **Seq Scan vs Index Scan — đọc plan thế nào**
> - `Seq Scan on <table>` → quét tuần tự cả bảng. Xuất hiện `Filter:` nghĩa là điều kiện được lọc **sau khi** đọc dòng.
> - `Index Scan using <index_name> on <table>` → có dùng index; điều kiện hiện ở dòng `Index Cond:`.
> - `Bitmap Index Scan` + `Bitmap Heap Scan` → cũng dùng index, nhưng theo plan 2 bước (gom vị trí dòng rồi mới đọc bảng), hợp khi số dòng khớp ở mức trung bình.
> - Thấy `Seq Scan` **không** đồng nghĩa với "sai". Doc nói rõ: khi query lấy tỷ lệ lớn số dòng, quét tuần tự rẻ hơn.

### 8.2. EXPLAIN ANALYZE (14.1.2)

📖 **Nguyên văn**
> "It is possible to check the accuracy of the planner's estimates by using `EXPLAIN`'s `ANALYZE` option. With this option, `EXPLAIN` actually executes the query, and then displays the true row counts and true run time accumulated within each plan node, along with the same estimates that a plain `EXPLAIN` shows."

🇻🇳 **Dịch**
> "Có thể kiểm tra độ chính xác của các ước lượng mà planner đưa ra bằng tuỳ chọn `ANALYZE` của `EXPLAIN`. Với tuỳ chọn này, `EXPLAIN` thực sự thực thi query, rồi hiển thị số dòng thật và thời gian chạy thật tích luỹ trong từng plan node, cùng với chính những ước lượng mà `EXPLAIN` thường hiển thị."

> [!warning] `EXPLAIN ANALYZE` **thực sự chạy** query. Với `UPDATE`/`DELETE` nghĩa là dữ liệu bị thay đổi thật.

### 8.3. Examining Index Usage (11.12)

📖 **Nguyên văn**
> "Although indexes in PostgreSQL do not need maintenance or tuning, it is still important to check which indexes are actually used by the real-life query workload. Examining index usage for an individual query is done with the `EXPLAIN` command; its application for this purpose is illustrated in Section 14.1. It is also possible to gather overall statistics about index usage in a running server, as described in Section 27.2."

🇻🇳 **Dịch**
> "Mặc dù index trong PostgreSQL không cần bảo trì hay tinh chỉnh, vẫn rất quan trọng phải kiểm tra xem index nào thực sự được dùng bởi khối lượng query đời thực. Việc xem xét mức độ sử dụng index cho từng query được thực hiện bằng lệnh `EXPLAIN`; cách áp dụng cho mục đích này được minh hoạ ở mục 14.1. Cũng có thể thu thập thống kê tổng thể về việc sử dụng index trên một server đang chạy, như mô tả ở mục 27.2."

📖 **Nguyên văn**
> "It is difficult to formulate a general procedure for determining which indexes to create. There are a number of typical cases that have been shown in the examples throughout the previous sections. A good deal of experimentation is often necessary."

🇻🇳 **Dịch**
> "Rất khó đưa ra một quy trình tổng quát để xác định nên tạo index nào. Có một số trường hợp điển hình đã được minh hoạ trong các ví dụ ở những mục trước. Thường thì phải thử nghiệm khá nhiều."

📖 **Nguyên văn**
> "Always run `ANALYZE` first. This command collects statistics about the distribution of the values in the table. This information is required to estimate the number of rows returned by a query, which is needed by the planner to assign realistic costs to each possible query plan. In absence of any real statistics, some default values are assumed, which are almost certain to be inaccurate. Examining an application's index usage without having run `ANALYZE` is therefore a lost cause."

🇻🇳 **Dịch**
> "Luôn chạy `ANALYZE` trước. Lệnh này thu thập statistics về phân phối các giá trị trong bảng. Thông tin đó là bắt buộc để ước lượng số dòng mà một query trả về, và planner cần con số đó để gán chi phí sát thực tế cho từng query plan khả dĩ. Khi không có statistics thật, hệ thống giả định một số giá trị mặc định, mà gần như chắc chắn là không chính xác. Vì vậy, xem xét việc sử dụng index của một ứng dụng mà chưa chạy `ANALYZE` là việc làm vô ích."

📖 **Nguyên văn**
> "Use real data for experimentation. Using test data for setting up indexes will tell you what indexes you need for the test data, but that is all.
>
> It is especially fatal to use very small test data sets. While selecting 1000 out of 100000 rows could be a candidate for an index, selecting 1 out of 100 rows will hardly be, because the 100 rows probably fit within a single disk page, and there is no plan that can beat sequentially fetching 1 disk page."

🇻🇳 **Dịch**
> "Hãy dùng dữ liệu thật để thử nghiệm. Dùng dữ liệu test để thiết lập index chỉ cho bạn biết bạn cần index nào cho *dữ liệu test*, chỉ vậy thôi.
>
> Đặc biệt tai hại là dùng tập dữ liệu test rất nhỏ. Trong khi chọn 1000 trên 100000 dòng có thể là ứng viên cho index, thì chọn 1 trên 100 dòng gần như chắc chắn không, vì 100 dòng đó có lẽ nằm gọn trong một disk page, và không plan nào thắng nổi việc đọc tuần tự 1 disk page."

📖 **Nguyên văn**
> "When indexes are not used, it can be useful for testing to force their use. There are run-time parameters that can turn off various plan types. For instance, turning off sequential scans (`enable_seqscan`) and nested-loop joins (`enable_nestloop`), which are the most basic plans, will force the system to use a different plan. If the system still chooses a sequential scan or nested-loop join then there is probably a more fundamental reason why the index is not being used; for example, the query condition does not match the index."

🇻🇳 **Dịch**
> "Khi index không được dùng, để thử nghiệm thì có thể ép hệ thống dùng nó. Có các run-time parameter tắt được nhiều loại plan khác nhau. Ví dụ, tắt sequential scan (`enable_seqscan`) và nested-loop join (`enable_nestloop`) — hai plan cơ bản nhất — sẽ buộc hệ thống dùng plan khác. Nếu hệ thống vẫn chọn sequential scan hoặc nested-loop join thì có lẽ có lý do căn bản hơn khiến index không được dùng; ví dụ điều kiện query không khớp với index."

📖 **Nguyên văn**
> "If forcing index usage does use the index, then there are two possibilities: Either the system is right and using the index is indeed not appropriate, or the cost estimates of the query plans are not reflecting reality. So you should time your query with and without indexes. The `EXPLAIN ANALYZE` command can be useful here."

🇻🇳 **Dịch**
> "Nếu việc ép dùng index thực sự khiến index được dùng, thì có hai khả năng: hoặc hệ thống đúng và dùng index quả thật không phù hợp, hoặc các ước lượng chi phí của query plan không phản ánh thực tế. Vậy nên bạn nên đo thời gian query cả khi có lẫn khi không có index. Lệnh `EXPLAIN ANALYZE` có ích ở đây."

---

## 9. Tóm tắt thực dụng

- Index không tự động là "tốt": nó **đánh đổi tốc độ đọc lấy tốc độ ghi + dung lượng + công bảo trì**.
- `CREATE INDEX` mặc định tạo **B-tree** — phù hợp đa số trường hợp.
- Multicolumn index: **cột dẫn đầu (leftmost) quan trọng nhất**; đừng tạo index quá 3 cột trừ khi bảng dùng cực kỳ đặc thù.
- Primary key / unique constraint **đã tự tạo unique index** — không tạo lại.
- Partial index để index ít dòng hơn (loại bỏ giá trị phổ biến hoặc giá trị không quan tâm) → index nhỏ hơn, update rẻ hơn.
- Muốn biết index có được dùng không: `EXPLAIN` (xem `Index Scan` / `Bitmap Index Scan` vs `Seq Scan`), `EXPLAIN ANALYZE` để so ước lượng với thực tế, và **luôn `ANALYZE` trước**.
- Index không bao giờ dùng tới thì nên **gỡ**.

---

## Liên kết
- Bài trước: [[03 - Queries - SELECT, JOIN, Aggregate]]
- Bài kế: [[05 - Transactions, ACID và MVCC]]

## Nguồn tham khảo
- PostgreSQL Documentation — 11.1. Introduction : https://www.postgresql.org/docs/current/indexes-intro.html
- PostgreSQL Documentation — 11.2. Index Types : https://www.postgresql.org/docs/current/indexes-types.html
- PostgreSQL Documentation — 11.3. Multicolumn Indexes : https://www.postgresql.org/docs/current/indexes-multicolumn.html
- PostgreSQL Documentation — 11.4. Indexes and ORDER BY : https://www.postgresql.org/docs/current/indexes-ordering.html
- PostgreSQL Documentation — 11.6. Unique Indexes : https://www.postgresql.org/docs/current/indexes-unique.html
- PostgreSQL Documentation — 11.8. Partial Indexes : https://www.postgresql.org/docs/current/indexes-partial.html
- PostgreSQL Documentation — 11.12. Examining Index Usage : https://www.postgresql.org/docs/current/indexes-examine.html
- PostgreSQL Documentation — 14.1. Using EXPLAIN : https://www.postgresql.org/docs/current/using-explain.html
