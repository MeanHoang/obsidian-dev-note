# 11 — NULL, Hàm String, Date và JSON

> **Nguồn chính:** PostgreSQL Documentation — Chapter 8. Data Types & Chapter 9. Functions and Operators — https://www.postgresql.org/docs/current/
> Bài này bám các mục 9.2 (Comparison), 9.18 (Conditional Expressions), 9.4 (String Functions), 9.7 (Pattern Matching), 8.5 + 9.9 (Date/Time), 8.14 + 9.16 (JSON).

Bốn nhóm kiến thức "dùng hàng ngày" mà roadmap không liệt kê riêng nhưng thiếu là viết query không nổi: **NULL** (phần dễ sai nhất), **hàm xử lý chuỗi**, **ngày giờ**, và **JSON/JSONB**.

---

# PHẦN A — NULL

## A1. NULL nghĩa là "không biết", không phải 0

📖 **Nguyên văn**
> "Ordinary comparison operators yield null (signifying “unknown”), not true or false, when either input is null. For example, `7 = NULL` yields null, as does `7 <> NULL`."

🇻🇳 **Dịch**
> "Các toán tử so sánh thông thường trả về null (nghĩa là “không biết”), chứ không phải true hay false, khi một trong hai đầu vào là null. Ví dụ, `7 = NULL` trả về null, `7 <> NULL` cũng vậy."

💡 **Ví dụ đời sống**
Form đăng ký có ô "số điện thoại". Ba tình huống khác nhau hoàn toàn:
- Khách điền `0901234567` → có giá trị.
- Khách điền rồi xoá, để trống → chuỗi rỗng `''`, tức là "đã trả lời: không có gì".
- Khách **bỏ qua**, chưa điền → `NULL`, tức là **"không biết số của người này là gì"**.

Hỏi "số điện thoại của khách này có bằng 0901234567 không?" khi bạn *không biết* số của họ — câu trả lời đúng không phải "có" cũng không phải "không", mà là **"tôi không biết"**. Đó chính là lý do `= NULL` không trả về true/false mà trả về null. Tương tự, `NULL` trong cột `điểm_thưởng` nghĩa là "chưa tính", khác hẳn `0` nghĩa là "đã tính, kết quả bằng không".

## A2. Không bao giờ viết `= NULL` — phải dùng `IS NULL`

📖 **Nguyên văn**
> "To check whether a value is or is not null, use the predicates:"

```sql
expression IS NULL
expression IS NOT NULL
```

🇻🇳 Hai predicate chuẩn để kiểm tra một biểu thức có phải null hay không.

📖 **Nguyên văn**
> "or the equivalent, but nonstandard, predicates:"

```sql
expression ISNULL
expression NOTNULL
```

🇻🇳 Hai dạng viết tắt tương đương nhưng **không chuẩn SQL** (chỉ PostgreSQL mới có).

📖 **Nguyên văn**
> "Do not write `expression = NULL` because `NULL` is not “equal to” `NULL`. (The null value represents an unknown value, and it is not known whether two unknown values are equal.)"

🇻🇳 **Dịch**
> "Đừng viết `expression = NULL` vì `NULL` không “bằng” `NULL`. (Giá trị null đại diện cho một giá trị không biết, và không ai biết được liệu hai giá trị không biết có bằng nhau hay không.)"

> [!warning] Bẫy kinh điển
> `WHERE phone = NULL` **không bao giờ trả về dòng nào** — không phải vì không có dòng nào có phone null, mà vì điều kiện luôn cho kết quả null (bị `WHERE` coi như không thoả). Phải viết `WHERE phone IS NULL`.

📖 **Nguyên văn**
> "Tip
>
> Some applications might expect that `expression = NULL` returns true if `expression` evaluates to the null value. It is highly recommended that these applications be modified to comply with the SQL standard. However, if that cannot be done the `transform_null_equals` configuration variable is available. If it is enabled, PostgreSQL will convert `x = NULL` clauses to `x IS NULL`."

🇻🇳 **Dịch**
> "Mẹo
>
> Một số ứng dụng có thể kỳ vọng rằng `expression = NULL` trả về true nếu `expression` cho ra giá trị null. Rất khuyến nghị sửa lại những ứng dụng đó cho đúng chuẩn SQL. Tuy nhiên, nếu không sửa được thì có biến cấu hình `transform_null_equals`. Nếu bật nó lên, PostgreSQL sẽ chuyển mệnh đề `x = NULL` thành `x IS NULL`."

📖 **Nguyên văn** (trích Table 9.2. Comparison Predicates)
> "`datatype IS NULL → boolean` — Test whether value is null. `1.5 IS NULL → f`
>
> `datatype IS NOT NULL → boolean` — Test whether value is not null. `'null' IS NOT NULL → t`"

🇻🇳 **Dịch**
> "`datatype IS NULL → boolean` — Kiểm tra giá trị có phải null không. `1.5 IS NULL → f`
>
> `datatype IS NOT NULL → boolean` — Kiểm tra giá trị có khác null không. `'null' IS NOT NULL → t`"

## A3. `IS DISTINCT FROM` — so sánh coi NULL như một giá trị bình thường

📖 **Nguyên văn**
> "When this behavior is not suitable, use the `IS [ NOT ] DISTINCT FROM` predicates:"

```sql
a IS DISTINCT FROM b
a IS NOT DISTINCT FROM b
```

🇻🇳 Hai predicate so sánh "an toàn với null": dùng khi bạn muốn null được đối xử như một giá trị bình thường thay vì "không biết".

📖 **Nguyên văn**
> "For non-null inputs, `IS DISTINCT FROM` is the same as the `<>` operator. However, if both inputs are null it returns false, and if only one input is null it returns true. Similarly, `IS NOT DISTINCT FROM` is identical to `=` for non-null inputs, but it returns true when both inputs are null, and false when only one input is null. Thus, these predicates effectively act as though null were a normal data value, rather than “unknown”."

🇻🇳 **Dịch**
> "Với đầu vào khác null, `IS DISTINCT FROM` giống hệt toán tử `<>`. Nhưng nếu cả hai đầu vào đều null thì nó trả về false, và nếu chỉ một đầu vào là null thì trả về true. Tương tự, `IS NOT DISTINCT FROM` giống hệt `=` với đầu vào khác null, nhưng trả về true khi cả hai đầu vào đều null, và false khi chỉ một bên null. Như vậy, hai predicate này thực chất hành xử như thể null là một giá trị dữ liệu bình thường, chứ không phải “không biết”."

📖 **Nguyên văn** (trích Table 9.2)
> "`datatype IS DISTINCT FROM datatype → boolean` — Not equal, treating null as a comparable value. `1 IS DISTINCT FROM NULL → t` (rather than `NULL`) `NULL IS DISTINCT FROM NULL → f` (rather than `NULL`)
>
> `datatype IS NOT DISTINCT FROM datatype → boolean` — Equal, treating null as a comparable value. `1 IS NOT DISTINCT FROM NULL → f` (rather than `NULL`) `NULL IS NOT DISTINCT FROM NULL → t` (rather than `NULL`)"

🇻🇳 **Dịch**
> "`datatype IS DISTINCT FROM datatype → boolean` — Không bằng nhau, coi null như một giá trị so sánh được. `1 IS DISTINCT FROM NULL → t` (thay vì `NULL`) `NULL IS DISTINCT FROM NULL → f` (thay vì `NULL`)
>
> `datatype IS NOT DISTINCT FROM datatype → boolean` — Bằng nhau, coi null như một giá trị so sánh được. `1 IS NOT DISTINCT FROM NULL → f` (thay vì `NULL`) `NULL IS NOT DISTINCT FROM NULL → t` (thay vì `NULL`)"

> [!tip] Khi nào dùng
> Khi so sánh giá trị cũ với giá trị mới để biết "có thay đổi không" mà cột đó cho phép null: `WHERE old_value IS DISTINCT FROM new_value` cho kết quả đúng cả khi một trong hai (hoặc cả hai) là null; `old_value <> new_value` thì không.

## A4. `COALESCE` — thay null bằng giá trị mặc định

📖 **Nguyên văn**
> "The `COALESCE` function returns the first of its arguments that is not null. Null is returned only if all arguments are null. It is often used to substitute a default value for null values when data is retrieved for display, for example:"

```sql
COALESCE(value [, ...])
```

```sql
SELECT COALESCE(description, short_description, '(none)') ...
```

🇻🇳 **Dịch**
> "Hàm `COALESCE` trả về đối số đầu tiên khác null trong danh sách đối số của nó. Null chỉ được trả về nếu tất cả đối số đều null. Nó thường được dùng để thay một giá trị mặc định vào chỗ các giá trị null khi lấy dữ liệu ra để hiển thị, ví dụ:"
> (SQL ở trên: lấy `description`, nếu null thì lấy `short_description`, nếu vẫn null thì lấy chuỗi `(none)`.)

📖 **Nguyên văn**
> "This returns `description` if it is not null, otherwise `short_description` if it is not null, otherwise `(none)`. The arguments must all be convertible to a common data type, which will be the type of the result (see Section 10.5 for details). Like a `CASE` expression, `COALESCE` only evaluates the arguments that are needed to determine the result; that is, arguments to the right of the first non-null argument are not evaluated. This SQL-standard function provides capabilities similar to `NVL` and `IFNULL`, which are used in some other database systems."

🇻🇳 **Dịch**
> "Biểu thức này trả về `description` nếu nó khác null, nếu không thì `short_description` nếu nó khác null, nếu không nữa thì `(none)`. Tất cả các đối số phải chuyển đổi được về một kiểu dữ liệu chung, và kiểu đó sẽ là kiểu của kết quả (xem Mục 10.5 để biết chi tiết). Giống như biểu thức `CASE`, `COALESCE` chỉ tính những đối số cần thiết để xác định kết quả; tức là các đối số nằm bên phải đối số khác-null đầu tiên sẽ không được tính. Hàm chuẩn SQL này cung cấp khả năng tương tự `NVL` và `IFNULL` trong một số hệ database khác."

## A5. `NULLIF` — biến một giá trị thành null

📖 **Nguyên văn**
> "The `NULLIF` function returns a null value if `value1` equals `value2`; otherwise it returns `value1`. This can be used to perform the inverse operation of the `COALESCE` example given above:"

```sql
NULLIF(value1, value2)
```

```sql
SELECT NULLIF(value, '(none)') ...
```

🇻🇳 **Dịch**
> "Hàm `NULLIF` trả về giá trị null nếu `value1` bằng `value2`; ngược lại nó trả về `value1`. Có thể dùng nó để làm thao tác ngược lại với ví dụ `COALESCE` ở trên:"
> (SQL ở trên: nếu `value` đúng bằng chuỗi `(none)` thì trả về null, ngược lại trả về chính `value`.)

📖 **Nguyên văn**
> "In this example, if `value` is `(none)`, null is returned, otherwise the value of `value` is returned. The two arguments must be of comparable types. To be specific, they are compared exactly as if you had written `value1 = value2`, so there must be a suitable `=` operator available."

🇻🇳 **Dịch**
> "Trong ví dụ này, nếu `value` là `(none)` thì null được trả về, ngược lại thì giá trị của `value` được trả về. Hai đối số phải thuộc các kiểu so sánh được với nhau. Cụ thể, chúng được so sánh đúng như thể bạn viết `value1 = value2`, nên phải có sẵn một toán tử `=` phù hợp."

> [!tip] Ứng dụng hay gặp
> `NULLIF(b, 0)` để tránh chia cho 0: phép chia cho null ra null thay vì báo lỗi.

## A6. `CASE WHEN` — if/else trong SQL

📖 **Nguyên văn**
> "The SQL `CASE` expression is a generic conditional expression, similar to if/else statements in other programming languages:"

```sql
CASE WHEN condition THEN result
     [WHEN ...]
     [ELSE result]
END
```

🇻🇳 **Dịch**
> "Biểu thức `CASE` của SQL là một biểu thức điều kiện tổng quát, tương tự câu lệnh if/else trong các ngôn ngữ lập trình khác:"

📖 **Nguyên văn**
> "`CASE` clauses can be used wherever an expression is valid. Each `condition` is an expression that returns a `boolean` result. If the condition's result is true, the value of the `CASE` expression is the `result` that follows the condition, and the remainder of the `CASE` expression is not processed. If the condition's result is not true, any subsequent `WHEN` clauses are examined in the same manner. If no `WHEN` condition yields true, the value of the `CASE` expression is the `result` of the `ELSE` clause. If the `ELSE` clause is omitted and no condition is true, the result is null."

🇻🇳 **Dịch**
> "Mệnh đề `CASE` dùng được ở bất cứ đâu mà một biểu thức là hợp lệ. Mỗi `condition` là một biểu thức trả về kết quả kiểu `boolean`. Nếu kết quả của điều kiện là true, giá trị của biểu thức `CASE` chính là `result` đi sau điều kiện đó, và phần còn lại của biểu thức `CASE` không được xử lý. Nếu kết quả của điều kiện không phải true, các mệnh đề `WHEN` tiếp theo được xét theo cách tương tự. Nếu không có điều kiện `WHEN` nào cho true, giá trị của biểu thức `CASE` là `result` của mệnh đề `ELSE`. Nếu bỏ mệnh đề `ELSE` mà không điều kiện nào đúng, kết quả là null."

📖 **Nguyên văn** — "An example:"

```sql
SELECT * FROM test;

 a
---
 1
 2
 3


SELECT a,
       CASE WHEN a=1 THEN 'one'
            WHEN a=2 THEN 'two'
            ELSE 'other'
       END
    FROM test;

 a | case
---+-------
 1 | one
 2 | two
 3 | other
```

🇻🇳 Ví dụ gốc: bảng `test` có 3 dòng 1/2/3; query gán nhãn `one` / `two` / `other` cho từng dòng.

📖 **Nguyên văn**
> "There is a “simple” form of `CASE` expression that is a variant of the general form above:"

```sql
CASE expression
    WHEN value THEN result
    [WHEN ...]
    [ELSE result]
END
```

🇻🇳 **Dịch**
> "Có một dạng “đơn giản” của biểu thức `CASE`, là một biến thể của dạng tổng quát ở trên:"

📖 **Nguyên văn**
> "The first `expression` is computed, then compared to each of the `value` expressions in the `WHEN` clauses until one is found that is equal to it. If no match is found, the `result` of the `ELSE` clause (or a null value) is returned. This is similar to the `switch` statement in C. The example above can be written using the simple `CASE` syntax:"

```sql
SELECT a,
       CASE a WHEN 1 THEN 'one'
              WHEN 2 THEN 'two'
              ELSE 'other'
       END
    FROM test;

 a | case
---+-------
 1 | one
 2 | two
 3 | other
```

🇻🇳 **Dịch**
> "`expression` đầu tiên được tính, rồi đem so sánh với từng biểu thức `value` trong các mệnh đề `WHEN` cho tới khi tìm được cái bằng nó. Nếu không khớp cái nào, `result` của mệnh đề `ELSE` (hoặc một giá trị null) được trả về. Cái này tương tự lệnh `switch` trong C. Ví dụ ở trên có thể viết bằng cú pháp `CASE` đơn giản:"

📖 **Nguyên văn**
> "A `CASE` expression does not evaluate any subexpressions that are not needed to determine the result. For example, this is a possible way of avoiding a division-by-zero failure:"

```sql
SELECT ... WHERE CASE WHEN x <> 0 THEN y/x > 1.5 ELSE false END;
```

🇻🇳 **Dịch**
> "Biểu thức `CASE` không tính bất kỳ biểu thức con nào không cần thiết để xác định kết quả. Ví dụ, đây là một cách tránh lỗi chia cho 0:"

## A7. `GREATEST` / `LEAST` và cách chúng xử lý NULL

📖 **Nguyên văn**
> "The `GREATEST` and `LEAST` functions select the largest or smallest value from a list of any number of expressions. The expressions must all be convertible to a common data type, which will be the type of the result (see Section 10.5 for details). NULL values in the argument list are ignored. The result will be NULL only if all the expressions evaluate to NULL. (This is a deviation from the SQL standard. According to the standard, the return value is NULL if any argument is NULL. Some other databases behave this way.)"

🇻🇳 **Dịch**
> "Hàm `GREATEST` và `LEAST` chọn giá trị lớn nhất hoặc nhỏ nhất từ một danh sách gồm bao nhiêu biểu thức cũng được. Các biểu thức đều phải chuyển đổi được về một kiểu dữ liệu chung, và kiểu đó sẽ là kiểu của kết quả (xem Mục 10.5). Các giá trị NULL trong danh sách đối số bị bỏ qua. Kết quả chỉ là NULL khi tất cả biểu thức đều cho ra NULL. (Đây là điểm PostgreSQL lệch khỏi chuẩn SQL. Theo chuẩn, giá trị trả về là NULL nếu bất kỳ đối số nào là NULL. Một số database khác hành xử theo kiểu đó.)"

## A8. NULL trong aggregate: `count(*)` vs `count(cột)`

📖 **Nguyên văn** (trích Table 9.62. General-Purpose Aggregate Functions)
> "`count ( * ) → bigint` — Computes the number of input rows.
>
> `count ( "any" ) → bigint` — Computes the number of input rows in which the input value is not null."

🇻🇳 **Dịch**
> "`count ( * ) → bigint` — Tính số dòng đầu vào.
>
> `count ( "any" ) → bigint` — Tính số dòng đầu vào mà **giá trị đầu vào khác null**."

> [!warning] Đây là khác biệt thật, không phải chuyện học thuật
> `count(*)` đếm mọi dòng. `count(phone)` chỉ đếm những dòng có `phone` khác null. Cùng một bảng, hai con số khác nhau. Tương tự, `sum` được tài liệu mô tả là "Computes the sum of the non-null input values" — tính tổng các giá trị đầu vào **khác null**.

📖 **Nguyên văn**
> "It should be noted that except for `count`, these functions return a null value when no rows are selected. In particular, `sum` of no rows returns null, not zero as one might expect, and `array_agg` returns null rather than an empty array when there are no input rows. The `coalesce` function can be used to substitute zero or an empty array for null when necessary."

🇻🇳 **Dịch**
> "Cần lưu ý rằng ngoại trừ `count`, các hàm này trả về giá trị null khi không có dòng nào được chọn. Cụ thể, `sum` của không dòng nào trả về null chứ không phải số không như người ta hay tưởng, và `array_agg` trả về null chứ không phải mảng rỗng khi không có dòng đầu vào nào. Có thể dùng hàm `coalesce` để thay số không hoặc mảng rỗng vào chỗ null khi cần."

## A9. Đếm null: `num_nulls` / `num_nonnulls`

📖 **Nguyên văn** (trích Table 9.3. Comparison Functions)
> "`num_nonnulls ( VARIADIC "any" ) → integer` — Returns the number of non-null arguments. `num_nonnulls(1, NULL, 2) → 2`
>
> `num_nulls ( VARIADIC "any" ) → integer` — Returns the number of null arguments. `num_nulls(1, NULL, 2) → 1`"

🇻🇳 **Dịch**
> "`num_nonnulls ( VARIADIC "any" ) → integer` — Trả về số đối số khác null. `num_nonnulls(1, NULL, 2) → 2`
>
> `num_nulls ( VARIADIC "any" ) → integer` — Trả về số đối số là null. `num_nulls(1, NULL, 2) → 1`"

---

# PHẦN B — Hàm String

📖 **Nguyên văn**
> "This section describes functions and operators for examining and manipulating string values. Strings in this context include values of the types `character`, `character varying`, and `text`. Except where noted, these functions and operators are declared to accept and return type `text`."

🇻🇳 **Dịch**
> "Mục này mô tả các hàm và toán tử để xem xét và thao tác giá trị chuỗi. “Chuỗi” ở đây bao gồm các giá trị thuộc kiểu `character`, `character varying` và `text`. Trừ khi có ghi chú khác, các hàm và toán tử này được khai báo là nhận vào và trả về kiểu `text`."

## B1. Toán tử nối chuỗi `||`

📖 **Nguyên văn**
> "`text || text → text` — Concatenates the two strings. `'Post' || 'greSQL' → PostgreSQL`
>
> `text || anynonarray → text` / `anynonarray || text → text` — Converts the non-string input to text, then concatenates the two strings. `'Value: ' || 42 → Value: 42`"

🇻🇳 **Dịch**
> "`text || text → text` — Nối hai chuỗi lại. `'Post' || 'greSQL' → PostgreSQL`
>
> `text || anynonarray → text` / `anynonarray || text → text` — Chuyển đầu vào không phải chuỗi thành text, rồi nối hai chuỗi. `'Value: ' || 42 → Value: 42`"

> [!warning] `||` với NULL
> Đây là chỗ NULL cắn lần nữa: nối một chuỗi với NULL cho ra NULL, không phải chuỗi ban đầu. Muốn an toàn thì bọc `COALESCE(col, '')`.

## B2. Bảng các hàm string dùng nhiều nhất

Cột **Description** giữ nguyên văn từ Table 9.9 và Table 9.10 của tài liệu.

| Function (nguyên văn) | Description (nguyên văn) | 🇻🇳 Dịch | Ví dụ gốc |
|---|---|---|---|
| `length ( text ) → integer` | Returns the number of characters in the string. | Trả về số ký tự trong chuỗi. | `length('jose') → 4` |
| `char_length ( text ) → integer` | Returns number of characters in the string. | Trả về số ký tự trong chuỗi. | `char_length('josé') → 4` |
| `octet_length ( text ) → integer` | Returns number of bytes in the string. | Trả về số byte trong chuỗi. | `octet_length('josé') → 5` (if server encoding is UTF8) |
| `lower ( text ) → text` | Converts the string to all lower case, according to the rules of the database's locale. | Chuyển chuỗi thành chữ thường toàn bộ, theo quy tắc locale của database. | `lower('TOM') → tom` |
| `upper ( text ) → text` | Converts the string to all upper case, according to the rules of the database's locale. | Chuyển chuỗi thành chữ hoa toàn bộ, theo quy tắc locale của database. | `upper('tom') → TOM` |
| `initcap ( text ) → text` | Converts the first letter of each word to upper case and the rest to lower case. | Chuyển chữ cái đầu mỗi từ thành chữ hoa, phần còn lại thành chữ thường. | `initcap('hi THOMAS') → Hi Thomas` |
| `btrim ( string text [ , characters text ] ) → text` | Removes the longest string containing only characters in `characters` (a space by default) from the start and end of `string`. | Xoá chuỗi dài nhất chỉ gồm các ký tự trong `characters` (mặc định là dấu cách) ở **đầu và cuối** `string`. | `btrim('xyxtrimyyx', 'xyz') → trim` |
| `ltrim ( string text [ , characters text ] ) → text` | Removes the longest string containing only characters in `characters` (a space by default) from the start of `string`. | Xoá ở **đầu** chuỗi. | `ltrim('zzzytest', 'xyz') → test` |
| `rtrim ( string text [ , characters text ] ) → text` | Removes the longest string containing only characters in `characters` (a space by default) from the end of `string`. | Xoá ở **cuối** chuỗi. | `rtrim('testxxzx', 'xyz') → test` |
| `trim ( [ LEADING \| TRAILING \| BOTH ] [ characters text ] FROM string text ) → text` | Removes the longest string containing only characters in `characters` (a space by default) from the start, end, or both ends (`BOTH` is the default) of `string`. | Xoá ở đầu, cuối, hoặc cả hai đầu (mặc định `BOTH`). | `trim(both 'xyz' from 'yxTomxx') → Tom` |
| `substring ( string text [ FROM start integer ] [ FOR count integer ] ) → text` | Extracts the substring of `string` starting at the `start`'th character if that is specified, and stopping after `count` characters if that is specified. | Cắt chuỗi con bắt đầu từ ký tự thứ `start`, lấy `count` ký tự. | `substring('Thomas' from 2 for 3) → hom` · `substring('Thomas' from 3) → omas` · `substring('Thomas' for 2) → Th` |
| `substr ( string text , start integer [ , count integer ] ) → text` | Extracts the substring of `string` starting at the `start`'th character, and extending for `count` characters if that is specified. | Dạng gọi hàm thông thường của `substring`. | `substr('alphabet', 3) → phabet` · `substr('alphabet', 3, 2) → ph` |
| `replace ( string text , from text , to text ) → text` | Replaces all occurrences in `string` of substring `from` with substring `to`. | Thay **mọi** lần xuất hiện của chuỗi con `from` bằng `to`. | `replace('abcdefabcdef', 'cd', 'XX') → abXXefabXXef` |
| `split_part ( string text , delimiter text , n integer ) → text` | Splits `string` at occurrences of `delimiter` and returns the `n`'th field (counting from one), or when `n` is negative, returns the \|`n`\|'th-from-last field. | Tách chuỗi theo `delimiter` và lấy phần thứ `n` (đếm từ 1); `n` âm thì đếm ngược từ cuối. | `split_part('abc~@~def~@~ghi', '~@~', 2) → def` · `split_part('abc,def,ghi,jkl', ',', -2) → ghi` |
| `position ( substring text IN string text ) → integer` | Returns first starting index of the specified substring within `string`, or zero if it's not present. | Trả về vị trí bắt đầu đầu tiên của chuỗi con trong `string`, hoặc 0 nếu không có. | `position('om' in 'Thomas') → 3` |
| `strpos ( string text , substring text ) → integer` | Returns first starting index of the specified substring within `string`, or zero if it's not present. (Same as `position(substring in string)`, but note the reversed argument order.) | Giống `position` nhưng thứ tự đối số ngược lại. | `strpos('high', 'ig') → 2` |
| `left ( string text , n integer ) → text` | Returns first `n` characters in the string, or when `n` is negative, returns all but last \|`n`\| characters. | Lấy `n` ký tự đầu; `n` âm thì bỏ \|`n`\| ký tự cuối. | `left('abcde', 2) → ab` |
| `right ( string text , n integer ) → text` | Returns last `n` characters in the string, or when `n` is negative, returns all but first \|`n`\| characters. | Lấy `n` ký tự cuối; `n` âm thì bỏ \|`n`\| ký tự đầu. | `right('abcde', 2) → de` |
| `lpad ( string text , length integer [ , fill text ] ) → text` | Extends the string to length `length` by prepending the characters `fill` (a space by default). If the string is already longer than `length` then it is truncated (on the right). | Chèn thêm ký tự vào **đầu** cho đủ độ dài; dài quá thì cắt bớt. | `lpad('hi', 5, 'xy') → xyxhi` |
| `rpad ( string text , length integer [ , fill text ] ) → text` | Extends the string to length `length` by appending the characters `fill` (a space by default). If the string is already longer than `length` then it is truncated. | Chèn thêm ký tự vào **cuối** cho đủ độ dài. | `rpad('hi', 5, 'xy') → hixyx` |
| `reverse ( text ) → text` | Reverses the order of the characters in the string. | Đảo ngược thứ tự ký tự. | `reverse('abcde') → edcba` |
| `starts_with ( string text , prefix text ) → boolean` | Returns true if `string` starts with `prefix`. | True nếu chuỗi bắt đầu bằng `prefix`. | `starts_with('alphabet', 'alph') → t` |
| `format ( formatstr text [ , formatarg "any" [ , ... ] ] ) → text` | Formats arguments according to a format string; see Section 9.4.1. This function is similar to the C function `sprintf`. | Định dạng các đối số theo một format string, giống hàm `sprintf` của C. | `format('Hello %s, %1$s', 'World') → Hello World, World` |
| `translate ( string text , from text , to text ) → text` | Replaces each character in `string` that matches a character in the `from` set with the corresponding character in the `to` set. | Thay từng **ký tự** trong tập `from` bằng ký tự tương ứng trong tập `to`. | `translate('12345', '143', 'ax') → a2x5` |

## B3. `format` — ba loại placeholder

📖 **Nguyên văn**
> "`s` formats the argument value as a simple string. A null value is treated as an empty string.
>
> `I` treats the argument value as an SQL identifier, double-quoting it if necessary. It is an error for the value to be null (equivalent to `quote_ident`).
>
> `L` quotes the argument value as an SQL literal. A null value is displayed as the string `NULL`, without quotes (equivalent to `quote_nullable`)."

🇻🇳 **Dịch**
> "`s` định dạng giá trị đối số thành một chuỗi đơn giản. Giá trị null được coi như chuỗi rỗng.
>
> `I` coi giá trị đối số là một SQL identifier, tự thêm dấu nháy kép nếu cần. Giá trị null sẽ gây lỗi (tương đương `quote_ident`).
>
> `L` bọc giá trị đối số thành một SQL literal. Giá trị null được hiển thị là chuỗi `NULL`, không có dấu nháy (tương đương `quote_nullable`)."

📖 **Nguyên văn**
> "The `%I` and `%L` format specifiers are particularly useful for safely constructing dynamic SQL statements."

🇻🇳 **Dịch**
> "Hai format specifier `%I` và `%L` đặc biệt hữu ích để dựng câu lệnh SQL động một cách an toàn."

## B4. `LIKE` / `ILIKE` và regex `~`

📖 **Nguyên văn**
> "There are three separate approaches to pattern matching provided by PostgreSQL: the traditional SQL `LIKE` operator, the more recent `SIMILAR TO` operator (added in SQL:1999), and POSIX-style regular expressions."

🇻🇳 **Dịch**
> "PostgreSQL cung cấp ba cách tiếp cận riêng biệt cho việc so khớp mẫu: toán tử `LIKE` truyền thống của SQL, toán tử `SIMILAR TO` mới hơn (thêm vào từ SQL:1999), và regular expression kiểu POSIX."

📖 **Nguyên văn**
> "The `LIKE` expression returns true if the `string` matches the supplied `pattern`. (As expected, the `NOT LIKE` expression returns false if `LIKE` returns true, and vice versa. An equivalent expression is `NOT (string LIKE pattern)`.) If `pattern` does not contain percent signs or underscores, then the pattern only represents the string itself; in that case `LIKE` acts like the equals operator. An underscore (`_`) in `pattern` stands for (matches) any single character; a percent sign (`%`) matches any sequence of zero or more characters. Some examples:"

```sql
'abc' LIKE 'abc'    true
'abc' LIKE 'a%'     true
'abc' LIKE '_b_'    true
'abc' LIKE 'c'      false
```

🇻🇳 **Dịch**
> "Biểu thức `LIKE` trả về true nếu `string` khớp với `pattern` được đưa vào. (Đúng như mong đợi, biểu thức `NOT LIKE` trả về false nếu `LIKE` trả về true, và ngược lại. Một biểu thức tương đương là `NOT (string LIKE pattern)`.) Nếu `pattern` không chứa dấu phần trăm hay dấu gạch dưới thì mẫu chỉ đại diện cho đúng chuỗi đó; khi đó `LIKE` hành xử như toán tử bằng. Dấu gạch dưới (`_`) trong `pattern` đại diện cho (khớp với) một ký tự bất kỳ; dấu phần trăm (`%`) khớp với một dãy gồm không hoặc nhiều ký tự. Vài ví dụ:"

📖 **Nguyên văn**
> "`LIKE` pattern matching always covers the entire string. Therefore, if it's desired to match a sequence anywhere within a string, the pattern must start and end with a percent sign."

🇻🇳 **Dịch**
> "So khớp mẫu bằng `LIKE` luôn áp lên **toàn bộ** chuỗi. Vì thế, nếu muốn khớp một dãy ký tự nằm ở bất kỳ đâu trong chuỗi thì mẫu phải bắt đầu và kết thúc bằng dấu phần trăm."

📖 **Nguyên văn**
> "The key word `ILIKE` can be used instead of `LIKE` to make the match case-insensitive according to the active locale. (But this does not support nondeterministic collations.) This is not in the SQL standard but is a PostgreSQL extension.
>
> The operator `~~` is equivalent to `LIKE`, and `~~*` corresponds to `ILIKE`. There are also `!~~` and `!~~*` operators that represent `NOT LIKE` and `NOT ILIKE`, respectively."

🇻🇳 **Dịch**
> "Có thể dùng từ khoá `ILIKE` thay cho `LIKE` để việc so khớp **không phân biệt hoa thường** theo locale đang dùng. (Nhưng nó không hỗ trợ nondeterministic collation.) Cái này không có trong chuẩn SQL mà là phần mở rộng của PostgreSQL.
>
> Toán tử `~~` tương đương với `LIKE`, còn `~~*` tương ứng với `ILIKE`. Cũng có các toán tử `!~~` và `!~~*` đại diện cho `NOT LIKE` và `NOT ILIKE`."

📖 **Nguyên văn** (trích Table 9.16. Regular Expression Match Operators)
> "`text ~ text → boolean` — String matches regular expression, case sensitively. `'thomas' ~ 't.*ma' → t`
>
> `text ~* text → boolean` — String matches regular expression, case-insensitively. `'thomas' ~* 'T.*ma' → t`
>
> `text !~ text → boolean` — String does not match regular expression, case sensitively. `'thomas' !~ 't.*max' → t`
>
> `text !~* text → boolean` — String does not match regular expression, case-insensitively. `'thomas' !~* 'T.*ma' → f`"

🇻🇳 **Dịch**
> "`text ~ text → boolean` — Chuỗi khớp regular expression, **phân biệt** hoa thường. `'thomas' ~ 't.*ma' → t`
>
> `text ~* text → boolean` — Chuỗi khớp regular expression, **không phân biệt** hoa thường. `'thomas' ~* 'T.*ma' → t`
>
> `text !~ text → boolean` — Chuỗi **không** khớp regular expression, phân biệt hoa thường. `'thomas' !~ 't.*max' → t`
>
> `text !~* text → boolean` — Chuỗi **không** khớp regular expression, không phân biệt hoa thường. `'thomas' !~* 'T.*ma' → f`"

> [!danger] Regex từ input người dùng là lỗ hổng
> 📖 "While most regular-expression searches can be executed very quickly, regular expressions can be contrived that take arbitrary amounts of time and memory to process. Be wary of accepting regular-expression search patterns from hostile sources. If you must do so, it is advisable to impose a statement timeout."
>
> 🇻🇳 "Tuy phần lớn truy vấn bằng regular expression chạy rất nhanh, người ta có thể nghĩ ra những regular expression ngốn thời gian và bộ nhớ tuỳ ý để xử lý. Hãy cẩn thận khi nhận mẫu tìm kiếm regular expression từ các nguồn thù địch. Nếu buộc phải làm vậy, nên áp đặt một statement timeout."

---

# PHẦN C — Date / Time

## C1. Các kiểu date/time

📖 **Nguyên văn**
> "PostgreSQL supports the full set of SQL date and time types, shown in Table 8.9. The operations available on these data types are described in Section 9.9. Dates are counted according to the Gregorian calendar, even in years before that calendar was introduced."

🇻🇳 **Dịch**
> "PostgreSQL hỗ trợ trọn bộ các kiểu ngày và giờ của SQL, liệt kê ở Table 8.9. Các phép toán dùng được trên những kiểu dữ liệu này được mô tả ở Mục 9.9. Ngày tháng được tính theo lịch Gregorian, kể cả với những năm trước khi lịch này ra đời."

📖 **Nguyên văn** — Table 8.9. Date/Time Types

| Name | Storage Size | Description | Low Value | High Value | Resolution |
|---|---|---|---|---|---|
| `timestamp [ (p) ] [ without time zone ]` | 8 bytes | both date and time (no time zone) | 4713 BC | 294276 AD | 1 microsecond |
| `timestamp [ (p) ] with time zone` | 8 bytes | both date and time, with time zone | 4713 BC | 294276 AD | 1 microsecond |
| `date` | 4 bytes | date (no time of day) | 4713 BC | 5874897 AD | 1 day |
| `time [ (p) ] [ without time zone ]` | 8 bytes | time of day (no date) | 00:00:00 | 24:00:00 | 1 microsecond |
| `time [ (p) ] with time zone` | 12 bytes | time of day (no date), with time zone | 00:00:00+1559 | 24:00:00-1559 | 1 microsecond |
| `interval [ fields ] [ (p) ] ` | 16 bytes | time interval | -178000000 years | 178000000 years | 1 microsecond |

🇻🇳 **Dịch** cột Description
> `timestamp` — cả ngày lẫn giờ (không có time zone) · `timestamp with time zone` — cả ngày lẫn giờ, có time zone · `date` — ngày (không có giờ trong ngày) · `time` — giờ trong ngày (không có ngày) · `time with time zone` — giờ trong ngày (không có ngày), có time zone · `interval` — một khoảng thời gian.

📖 **Nguyên văn**
> "Note
>
> The SQL standard requires that writing just `timestamp` be equivalent to `timestamp without time zone`, and PostgreSQL honors that behavior. `timestamptz` is accepted as an abbreviation for `timestamp with time zone`; this is a PostgreSQL extension."

🇻🇳 **Dịch**
> "Ghi chú
>
> Chuẩn SQL yêu cầu rằng viết trần `timestamp` là tương đương với `timestamp without time zone`, và PostgreSQL tuân theo hành vi đó. `timestamptz` được chấp nhận như một cách viết tắt của `timestamp with time zone`; đây là phần mở rộng của PostgreSQL."

📖 **Nguyên văn**
> "The type `time with time zone` is defined by the SQL standard, but the definition exhibits properties which lead to questionable usefulness. In most cases, a combination of `date`, `time`, `timestamp without time zone`, and `timestamp with time zone` should provide a complete range of date/time functionality required by any application."

🇻🇳 **Dịch**
> "Kiểu `time with time zone` được định nghĩa trong chuẩn SQL, nhưng định nghĩa của nó có những tính chất khiến độ hữu dụng đáng ngờ. Trong đa số trường hợp, kết hợp `date`, `time`, `timestamp without time zone` và `timestamp with time zone` là đủ bao trọn nhu cầu về ngày giờ của bất kỳ ứng dụng nào."

## C2. ⚠️ `timestamp` vs `timestamptz` — cái bẫy timezone kinh điển

> [!warning] Đọc kỹ đoạn này trước khi chọn kiểu cột
> 📖 **Nguyên văn**
> > "In a value that has been determined to be `timestamp without time zone`, PostgreSQL will silently ignore any time zone indication. That is, the resulting value is derived from the date/time fields in the input string, and is **not** adjusted for time zone.
> >
> > For `timestamp with time zone` values, an input string that includes an explicit time zone will be converted to UTC (Universal Coordinated Time) using the appropriate offset for that time zone. If no time zone is stated in the input string, then it is assumed to be in the time zone indicated by the system's `TimeZone` parameter, and is converted to UTC using the offset for the `timezone` zone. In either case, the value is stored internally as UTC, and the originally stated or assumed time zone is not retained. When a `timestamp with time zone` value is output, it is always converted from UTC to the current `timezone` zone, and displayed as local time in that zone."
>
> 🇻🇳 **Dịch**
> > "Với một giá trị đã được xác định là `timestamp without time zone`, PostgreSQL sẽ **âm thầm bỏ qua** mọi chỉ dẫn về time zone. Nghĩa là giá trị kết quả được suy ra từ các trường ngày/giờ trong chuỗi đầu vào, và **không** được điều chỉnh theo time zone.
> >
> > Với giá trị `timestamp with time zone`, một chuỗi đầu vào có ghi rõ time zone sẽ được chuyển sang UTC (Universal Coordinated Time) bằng offset tương ứng của time zone đó. Nếu chuỗi đầu vào không ghi time zone thì nó được giả định là thuộc time zone mà tham số `TimeZone` của hệ thống chỉ ra, rồi được chuyển sang UTC bằng offset của zone đó. Trong cả hai trường hợp, giá trị được **lưu nội bộ dưới dạng UTC**, và time zone đã ghi hoặc được giả định ban đầu **không được giữ lại**. Khi một giá trị `timestamp with time zone` được xuất ra, nó luôn được chuyển từ UTC sang zone `timezone` hiện tại, và hiển thị dưới dạng giờ địa phương của zone đó."

💡 **Ví dụ đời sống**
`timestamp` giống tờ giấy ghi "họp lúc 9 giờ sáng" — dán trên tường văn phòng thì ai cũng hiểu, nhưng gửi cho đồng nghiệp ở Mỹ thì vô nghĩa vì không biết 9 giờ ở đâu. `timestamptz` giống ghi "họp lúc 9 giờ sáng giờ Việt Nam" rồi hệ thống tự quy về một mốc tuyệt đối trên trục thời gian — ai ở đâu mở lên cũng thấy đúng khoảnh khắc đó theo giờ của mình.

📖 **Nguyên văn**
> "The SQL standard differentiates `timestamp without time zone` and `timestamp with time zone` literals by the presence of a “+” or “-” symbol and time zone offset after the time. Hence, according to the standard,"

```sql
TIMESTAMP '2004-10-19 10:23:54'
```

> "is a `timestamp without time zone`, while"

```sql
TIMESTAMP '2004-10-19 10:23:54+02'
```

> "is a `timestamp with time zone`. PostgreSQL never examines the content of a literal string before determining its type, and therefore will treat both of the above as `timestamp without time zone`. To ensure that a literal is treated as `timestamp with time zone`, give it the correct explicit type:"

```sql
TIMESTAMP WITH TIME ZONE '2004-10-19 10:23:54+02'
```

🇻🇳 **Dịch**
> "Chuẩn SQL phân biệt literal `timestamp without time zone` và `timestamp with time zone` dựa vào việc có dấu “+” hay “-” kèm offset time zone sau phần giờ hay không. Do đó, theo chuẩn, `TIMESTAMP '2004-10-19 10:23:54'` là `timestamp without time zone`, còn `TIMESTAMP '2004-10-19 10:23:54+02'` là `timestamp with time zone`. PostgreSQL **không bao giờ** xem xét nội dung của chuỗi literal trước khi xác định kiểu của nó, nên nó sẽ coi cả hai cái trên là `timestamp without time zone`. Để chắc chắn một literal được coi là `timestamp with time zone`, hãy ghi rõ kiểu:"

## C3. Hàm lấy thời điểm hiện tại

📖 **Nguyên văn**
> "PostgreSQL provides a number of functions that return values related to the current date and time. These SQL-standard functions all return values based on the start time of the current transaction: `CURRENT_TIME` and `CURRENT_TIMESTAMP` deliver values with time zone; `LOCALTIME` and `LOCALTIMESTAMP` deliver values without time zone."

🇻🇳 **Dịch**
> "PostgreSQL cung cấp một số hàm trả về giá trị liên quan tới ngày giờ hiện tại. Các hàm chuẩn SQL này đều trả về giá trị dựa trên **thời điểm bắt đầu của transaction hiện tại**: `CURRENT_TIME` và `CURRENT_TIMESTAMP` cho ra giá trị có time zone; `LOCALTIME` và `LOCALTIMESTAMP` cho ra giá trị không có time zone."

📖 **Nguyên văn** — "Some examples:"

```sql
SELECT CURRENT_TIME;
Result: 14:39:53.662522-05
SELECT CURRENT_DATE;
Result: 2019-12-23
SELECT CURRENT_TIMESTAMP;
Result: 2019-12-23 14:39:53.662522-05
SELECT CURRENT_TIMESTAMP(2);
Result: 2019-12-23 14:39:53.66-05
SELECT LOCALTIMESTAMP;
Result: 2019-12-23 14:39:53.662522
```

🇻🇳 Ví dụ gốc trong tài liệu: giờ hiện tại, ngày hiện tại, ngày giờ hiện tại (có/không time zone, có/không giới hạn số chữ số thập phân của giây).

📖 **Nguyên văn**
> "Since these functions return the start time of the current transaction, their values do not change during the transaction. This is considered a feature: the intent is to allow a single transaction to have a consistent notion of the “current” time, so that multiple modifications within the same transaction bear the same time stamp."

🇻🇳 **Dịch**
> "Vì các hàm này trả về thời điểm bắt đầu của transaction hiện tại, giá trị của chúng **không đổi trong suốt transaction**. Đây được coi là một tính năng: dụng ý là để một transaction có một khái niệm nhất quán về thời điểm “hiện tại”, nhờ đó nhiều thao tác sửa đổi trong cùng transaction mang cùng một dấu thời gian."

📖 **Nguyên văn**
> "`clock_timestamp()` returns the actual current time, and therefore its value changes even within a single SQL statement. […] `now()` is a traditional PostgreSQL equivalent to `transaction_timestamp()`."

🇻🇳 **Dịch**
> "`clock_timestamp()` trả về thời điểm hiện tại thực sự, nên giá trị của nó thay đổi ngay cả trong cùng một câu lệnh SQL. […] `now()` là cách viết truyền thống của PostgreSQL, tương đương `transaction_timestamp()`."

📖 **Nguyên văn** (trích Table 9.33)
> "`now ( ) → timestamp with time zone` — Current date and time (start of current transaction). `now() → 2019-12-23 14:39:53.662522-05`
>
> `current_date → date` — Current date. `current_date → 2019-12-23`
>
> `current_timestamp → timestamp with time zone` — Current date and time (start of current transaction). `current_timestamp → 2019-12-23 14:39:53.662522-05`"

🇻🇳 **Dịch**
> "`now ( ) → timestamp with time zone` — Ngày giờ hiện tại (thời điểm bắt đầu transaction hiện tại).
>
> `current_date → date` — Ngày hiện tại.
>
> `current_timestamp → timestamp with time zone` — Ngày giờ hiện tại (thời điểm bắt đầu transaction hiện tại)."

> [!warning] Đừng dùng literal `'now'` làm DEFAULT
> 📖 "Do not use the third form when specifying a value to be evaluated later, for example in a `DEFAULT` clause for a table column. The system will convert `now` to a timestamp as soon as the constant is parsed, so that when the default value is needed, the time of the table creation would be used! The first two forms will not be evaluated until the default value is used, because they are function calls."
>
> 🇻🇳 "Đừng dùng dạng thứ ba khi khai báo một giá trị sẽ được tính sau này, ví dụ trong mệnh đề `DEFAULT` của một cột. Hệ thống sẽ chuyển `now` thành timestamp ngay khi hằng số được parse, nên đến lúc cần giá trị mặc định thì nó lại dùng **thời điểm tạo bảng**! Hai dạng đầu sẽ không bị tính cho tới khi giá trị mặc định được dùng, vì chúng là lời gọi hàm."
>
> (Xem thêm `DEFAULT` ở [[02 - Tables, Data Types và Constraints]].)

## C4. Cộng trừ với `interval`

📖 **Nguyên văn** (trích Table 9.32. Date/Time Operators)
> "`date + integer → date` — Add a number of days to a date. `date '2001-09-28' + 7 → 2001-10-05`
>
> `date + interval → timestamp` — Add an interval to a date. `date '2001-09-28' + interval '1 hour' → 2001-09-28 01:00:00`
>
> `timestamp + interval → timestamp` — Add an interval to a timestamp. `timestamp '2001-09-28 01:00' + interval '23 hours' → 2001-09-29 00:00:00`"

🇻🇳 **Dịch**
> "`date + integer → date` — Cộng một số ngày vào một date.
>
> `date + interval → timestamp` — Cộng một interval vào một date.
>
> `timestamp + interval → timestamp` — Cộng một interval vào một timestamp."

📖 **Nguyên văn**
> "When doing arithmetic on a `timestamp with time zone` value in a time zone that recognizes DST, this means that adding or subtracting (say) `interval '1 day'` does not necessarily have the same result as adding or subtracting `interval '24 hours'`."

🇻🇳 **Dịch**
> "Khi làm số học trên giá trị `timestamp with time zone` ở một time zone có áp dụng DST (giờ mùa hè), điều này nghĩa là cộng hay trừ (chẳng hạn) `interval '1 day'` không nhất thiết cho cùng kết quả với cộng/trừ `interval '24 hours'`."

## C5. `age()` — hiệu hai mốc thời gian dạng "năm/tháng/ngày"

📖 **Nguyên văn** (trích Table 9.33)
> "`age ( timestamp, timestamp ) → interval` — Subtract arguments, producing a “symbolic” result that uses years and months, rather than just days. `age(timestamp '2001-04-10', timestamp '1957-06-13') → 43 years 9 mons 27 days`
>
> `age ( timestamp ) → interval` — Subtract argument from `current_date` (at midnight). `age(timestamp '1957-06-13') → 62 years 6 mons 10 days`"

🇻🇳 **Dịch**
> "`age ( timestamp, timestamp ) → interval` — Trừ hai đối số, cho ra kết quả “mang tính biểu tượng” dùng năm và tháng thay vì chỉ đếm ngày.
>
> `age ( timestamp ) → interval` — Lấy `current_date` (lúc nửa đêm) trừ đi đối số."

📖 **Nguyên văn**
> "Note there can be ambiguity in the `months` field returned by `age` because different months have different numbers of days. PostgreSQL's approach uses the month from the earlier of the two dates when calculating partial months. For example, `age('2004-06-01', '2004-04-30')` uses April to yield `1 mon 1 day`, while using May would yield `1 mon 2 days` because May has 31 days, while April has only 30."

🇻🇳 **Dịch**
> "Lưu ý là trường `months` mà `age` trả về có thể nhập nhằng, vì các tháng có số ngày khác nhau. Cách làm của PostgreSQL là dùng tháng của mốc **sớm hơn** trong hai ngày khi tính phần tháng lẻ. Ví dụ, `age('2004-06-01', '2004-04-30')` dùng tháng Tư nên ra `1 mon 1 day`, trong khi nếu dùng tháng Năm sẽ ra `1 mon 2 days` vì tháng Năm có 31 ngày còn tháng Tư chỉ có 30."

## C6. `date_trunc()` — cắt về mốc đầu giờ / đầu ngày / đầu tháng

📖 **Nguyên văn**
> "The function `date_trunc` is conceptually similar to the `trunc` function for numbers. `source` is a value expression of type `timestamp`, `timestamp with time zone`, or `interval`. […] `field` selects to which precision to truncate the input value. The return value is likewise of type `timestamp`, `timestamp with time zone`, or `interval`, and it has all fields that are less significant than the selected one set to zero (or one, for `day` and `month`)."

```sql
date_trunc(field, source [, time_zone ])
```

🇻🇳 **Dịch**
> "Hàm `date_trunc` về mặt khái niệm giống hàm `trunc` dành cho số. `source` là biểu thức giá trị kiểu `timestamp`, `timestamp with time zone` hoặc `interval`. […] `field` chọn mức độ chính xác để cắt giá trị đầu vào về. Giá trị trả về cũng thuộc kiểu `timestamp`, `timestamp with time zone` hoặc `interval`, với tất cả các trường nhỏ hơn trường được chọn bị đặt về 0 (hoặc 1, với `day` và `month`)."

📖 **Nguyên văn** — ví dụ gốc

```sql
SELECT date_trunc('hour', TIMESTAMP '2001-02-16 20:38:40');
Result: 2001-02-16 20:00:00
SELECT date_trunc('year', TIMESTAMP '2001-02-16 20:38:40');
Result: 2001-01-01 00:00:00
SELECT date_trunc('day', TIMESTAMP WITH TIME ZONE '2001-02-16 20:38:40+00');
Result: 2001-02-16 00:00:00-05
SELECT date_trunc('day', TIMESTAMP WITH TIME ZONE '2001-02-16 20:38:40+00', 'Australia/Sydney');
Result: 2001-02-16 08:00:00-05
SELECT date_trunc('hour', INTERVAL '3 days 02:47:33');
Result: 3 days 02:00:00
```

🇻🇳 Cắt về đầu giờ, đầu năm, đầu ngày (theo zone hiện tại và theo zone chỉ định), và cắt cả `interval`. Đây chính là hàm dùng để gom dữ liệu theo ngày/tháng khi làm báo cáo (`GROUP BY date_trunc('day', created_at)` — xem [[03 - Queries - SELECT, JOIN, Aggregate]]).

## C7. `extract()` — lấy một thành phần ra

📖 **Nguyên văn**
> "The `extract` function retrieves subfields such as year or hour from date/time values. `source` must be a value expression of type `timestamp`, `date`, `time`, or `interval`. […] `field` is an identifier or string that selects what field to extract from the `source` value. Not all fields are valid for every input data type; for example, fields smaller than a day cannot be extracted from a `date`, while fields of a day or more cannot be extracted from a `time`. The `extract` function returns values of type `numeric`."

```sql
EXTRACT(field FROM source)
```

🇻🇳 **Dịch**
> "Hàm `extract` lấy ra các trường con như năm hay giờ từ giá trị ngày/giờ. `source` phải là biểu thức giá trị kiểu `timestamp`, `date`, `time` hoặc `interval`. […] `field` là một identifier hoặc chuỗi chọn trường nào cần rút ra từ giá trị `source`. Không phải trường nào cũng hợp lệ với mọi kiểu đầu vào; ví dụ, các trường nhỏ hơn một ngày không rút ra được từ `date`, còn các trường từ một ngày trở lên không rút ra được từ `time`. Hàm `extract` trả về giá trị kiểu `numeric`."

📖 **Nguyên văn** — ví dụ gốc

```sql
SELECT EXTRACT(YEAR FROM TIMESTAMP '2001-02-16 20:38:40');
Result: 2001
SELECT EXTRACT(DAY FROM TIMESTAMP '2001-02-16 20:38:40');
Result: 16
SELECT EXTRACT(HOUR FROM TIMESTAMP '2001-02-16 20:38:40');
Result: 20
```

🇻🇳 Rút năm / ngày trong tháng / giờ ra khỏi một timestamp.

📖 **Nguyên văn** (một vài `field` hay dùng)
> "`dow` — The day of the week as Sunday (`0`) to Saturday (`6`)
>
> `doy` — The day of the year (1–365/366)
>
> `epoch` — For `timestamp with time zone` values, the number of seconds since 1970-01-01 00:00:00 UTC (negative for timestamps before that) […]
>
> `quarter` — The quarter of the year (1–4) that the date is in"

🇻🇳 **Dịch**
> "`dow` — Thứ trong tuần, từ Chủ nhật (`0`) tới Thứ bảy (`6`)
>
> `doy` — Ngày thứ mấy trong năm (1–365/366)
>
> `epoch` — Với giá trị `timestamp with time zone`, là số giây kể từ 1970-01-01 00:00:00 UTC (âm với các mốc trước đó) […]
>
> `quarter` — Quý trong năm (1–4) mà ngày đó thuộc về"

📖 **Nguyên văn**
> "For historical reasons, the `date_part` function returns values of type `double precision`. This can result in a loss of precision in certain uses. Using `extract` is recommended instead."

🇻🇳 **Dịch**
> "Vì lý do lịch sử, hàm `date_part` trả về giá trị kiểu `double precision`. Điều này có thể gây mất độ chính xác trong một số trường hợp. Khuyến nghị dùng `extract` thay thế."

---

# PHẦN D — JSON / JSONB

## D1. Vì sao dùng kiểu JSON thay vì `text`

📖 **Nguyên văn**
> "JSON data types are for storing JSON (JavaScript Object Notation) data, as specified in RFC 7159. Such data can also be stored as `text`, but the JSON data types have the advantage of enforcing that each stored value is valid according to the JSON rules. There are also assorted JSON-specific functions and operators available for data stored in these data types […] PostgreSQL offers two types for storing JSON data: `json` and `jsonb`."

🇻🇳 **Dịch**
> "Các kiểu dữ liệu JSON dùng để lưu dữ liệu JSON (JavaScript Object Notation) theo đặc tả RFC 7159. Dữ liệu như vậy cũng có thể lưu dưới dạng `text`, nhưng kiểu JSON có lợi thế là **bắt buộc mỗi giá trị lưu vào phải hợp lệ** theo quy tắc JSON. Ngoài ra còn có một loạt hàm và toán tử chuyên cho JSON dùng được với dữ liệu lưu ở các kiểu này […] PostgreSQL cung cấp hai kiểu để lưu dữ liệu JSON: `json` và `jsonb`."

## D2. `json` vs `jsonb` — chọn cái nào

📖 **Nguyên văn**
> "The `json` and `jsonb` data types accept almost identical sets of values as input. The major practical difference is one of efficiency. The `json` data type stores an exact copy of the input text, which processing functions must reparse on each execution; while `jsonb` data is stored in a decomposed binary format that makes it slightly slower to input due to added conversion overhead, but significantly faster to process, since no reparsing is needed. `jsonb` also supports indexing, which can be a significant advantage."

🇻🇳 **Dịch**
> "Hai kiểu `json` và `jsonb` nhận vào gần như cùng một tập giá trị. Khác biệt thực tế lớn nhất là **hiệu năng**. Kiểu `json` lưu một bản sao y nguyên của văn bản đầu vào, nên các hàm xử lý phải parse lại mỗi lần chạy; trong khi dữ liệu `jsonb` được lưu ở **dạng nhị phân đã phân rã**, khiến việc ghi vào hơi chậm hơn một chút do phát sinh chi phí chuyển đổi, nhưng xử lý **nhanh hơn đáng kể** vì không cần parse lại. `jsonb` còn **hỗ trợ index**, đây có thể là một lợi thế lớn."

📖 **Nguyên văn**
> "Because the `json` type stores an exact copy of the input text, it will preserve semantically-insignificant white space between tokens, as well as the order of keys within JSON objects. Also, if a JSON object within the value contains the same key more than once, all the key/value pairs are kept. (The processing functions consider the last value as the operative one.) By contrast, `jsonb` does not preserve white space, does not preserve the order of object keys, and does not keep duplicate object keys. If duplicate keys are specified in the input, only the last value is kept."

🇻🇳 **Dịch**
> "Vì kiểu `json` lưu bản sao y nguyên văn bản đầu vào, nó giữ lại cả khoảng trắng vô nghĩa về mặt ngữ nghĩa giữa các token, lẫn **thứ tự các key** trong object JSON. Ngoài ra, nếu một object JSON trong giá trị chứa cùng một key nhiều lần thì tất cả các cặp key/value đều được giữ. (Các hàm xử lý coi giá trị cuối cùng là giá trị có hiệu lực.) Ngược lại, `jsonb` không giữ khoảng trắng, không giữ thứ tự key của object, và không giữ key trùng lặp. Nếu đầu vào có key trùng thì chỉ giá trị cuối cùng được giữ lại."

📖 **Nguyên văn**
> "In general, most applications should prefer to store JSON data as `jsonb`, unless there are quite specialized needs, such as legacy assumptions about ordering of object keys."

🇻🇳 **Dịch**
> "Nói chung, **phần lớn ứng dụng nên ưu tiên lưu dữ liệu JSON dưới dạng `jsonb`**, trừ khi có nhu cầu khá đặc thù, chẳng hạn các giả định cũ về thứ tự key trong object."

📖 **Nguyên văn** — minh chứng cho sự khác biệt

```sql
SELECT '{"bar": "baz", "balance": 7.77, "active":false}'::json;
                      json
-------------------------------------------------
 {"bar": "baz", "balance": 7.77, "active":false}
(1 row)

SELECT '{"bar": "baz", "balance": 7.77, "active":false}'::jsonb;
                      jsonb
--------------------------------------------------
 {"bar": "baz", "active": false, "balance": 7.77}
(1 row)
```

🇻🇳 Cùng một chuỗi đầu vào: `json` giữ nguyên xi cả khoảng trắng và thứ tự key, còn `jsonb` đã chuẩn hoá lại (thứ tự key đổi, khoảng trắng chuẩn hoá).

## D3. Toán tử truy cập `->`, `->>`, `#>`, `#>>`

📖 **Nguyên văn** (trích Table 9.47)
> "`json -> integer → json` / `jsonb -> integer → jsonb` — Extracts n'th element of JSON array (array elements are indexed from zero, but negative integers count from the end). `'[{"a":"foo"},{"b":"bar"},{"c":"baz"}]'::json -> 2 → {"c":"baz"}`
>
> `json -> text → json` / `jsonb -> text → jsonb` — Extracts JSON object field with the given key. `'{"a": {"b":"foo"}}'::json -> 'a' → {"b":"foo"}`
>
> `json ->> integer → text` / `jsonb ->> integer → text` — Extracts n'th element of JSON array, as `text`. `'[1,2,3]'::json ->> 2 → 3`
>
> `json ->> text → text` / `jsonb ->> text → text` — Extracts JSON object field with the given key, as `text`. `'{"a":1,"b":2}'::json ->> 'b' → 2`
>
> `json #> text[] → json` / `jsonb #> text[] → jsonb` — Extracts JSON sub-object at the specified path, where path elements can be either field keys or array indexes. `'{"a": {"b": ["foo","bar"]}}'::json #> '{a,b,1}' → "bar"`
>
> `json #>> text[] → text` / `jsonb #>> text[] → text` — Extracts JSON sub-object at the specified path as `text`. `'{"a": {"b": ["foo","bar"]}}'::json #>> '{a,b,1}' → bar`"

🇻🇳 **Dịch**
> "`->` với **integer** — Lấy phần tử thứ n của mảng JSON (phần tử mảng đánh chỉ số từ 0, số âm đếm ngược từ cuối).
>
> `->` với **text** — Lấy field của object JSON theo key cho trước.
>
> `->>` với **integer** — Lấy phần tử thứ n của mảng JSON, **dưới dạng `text`**.
>
> `->>` với **text** — Lấy field của object JSON theo key, **dưới dạng `text`**.
>
> `#>` với **text[]** — Lấy sub-object JSON tại đường dẫn chỉ định, trong đó các phần tử đường dẫn có thể là key field hoặc chỉ số mảng.
>
> `#>>` với **text[]** — Lấy sub-object JSON tại đường dẫn chỉ định **dưới dạng `text`**."

> [!tip] Nhớ một câu là đủ
> Một mũi tên `->` trả về **JSON**; hai mũi tên `->>` trả về **text**. `#>` / `#>>` là bản đi sâu nhiều tầng bằng một mảng đường dẫn. Muốn so sánh với chuỗi thường (`= 'abc'`) thì dùng `->>`; muốn truy cập tiếp xuống tầng dưới thì dùng `->`.

📖 **Nguyên văn**
> "Note
>
> The field/element/path extraction operators return NULL, rather than failing, if the JSON input does not have the right structure to match the request; for example if no such key or array element exists."

🇻🇳 **Dịch**
> "Ghi chú
>
> Các toán tử rút field/phần tử/đường dẫn trả về NULL chứ không báo lỗi, nếu dữ liệu JSON đầu vào không có cấu trúc khớp với yêu cầu; ví dụ khi không tồn tại key hay phần tử mảng đó."

## D4. `@>` — toán tử containment, cốt lõi của truy vấn jsonb

📖 **Nguyên văn** (trích Table 9.48. Additional jsonb Operators)
> "`jsonb @> jsonb → boolean` — Does the first JSON value contain the second? `'{"a":1, "b":2}'::jsonb @> '{"b":2}'::jsonb → t`
>
> `jsonb <@ jsonb → boolean` — Is the first JSON value contained in the second? `'{"b":2}'::jsonb <@ '{"a":1, "b":2}'::jsonb → t`
>
> `jsonb ? text → boolean` — Does the text string exist as a top-level key or array element within the JSON value? `'{"a":1, "b":2}'::jsonb ? 'b' → t`"

🇻🇳 **Dịch**
> "`jsonb @> jsonb → boolean` — Giá trị JSON thứ nhất có **chứa** giá trị thứ hai không?
>
> `jsonb <@ jsonb → boolean` — Giá trị JSON thứ nhất có **nằm trong** giá trị thứ hai không?
>
> `jsonb ? text → boolean` — Chuỗi text đó có tồn tại như một key ở tầng trên cùng hoặc một phần tử mảng trong giá trị JSON không?"

📖 **Nguyên văn**
> "Testing containment is an important capability of `jsonb`. There is no parallel set of facilities for the `json` type. Containment tests whether one `jsonb` document has contained within it another one. […] The general principle is that the contained object must match the containing object as to structure and data contents, possibly after discarding some non-matching array elements or object key/value pairs from the containing object. But remember that the order of array elements is not significant when doing a containment match, and duplicate array elements are effectively considered only once."

🇻🇳 **Dịch**
> "Kiểm tra containment là một khả năng quan trọng của `jsonb`. Kiểu `json` **không có** bộ công cụ tương ứng. Containment kiểm tra xem một tài liệu `jsonb` có chứa bên trong nó một tài liệu khác hay không. […] Nguyên tắc chung là object được chứa phải khớp với object chứa nó về cấu trúc và nội dung dữ liệu, có thể sau khi loại bỏ bớt một số phần tử mảng hoặc cặp key/value không khớp khỏi object chứa. Nhưng nhớ rằng thứ tự các phần tử mảng **không quan trọng** khi so khớp containment, và các phần tử mảng trùng nhau thực chất chỉ được tính một lần."

📖 **Nguyên văn** — ví dụ gốc ("These examples return true except as noted")

```sql
-- Simple scalar/primitive values contain only the identical value:
SELECT '"foo"'::jsonb @> '"foo"'::jsonb;

-- The array on the right side is contained within the one on the left:
SELECT '[1, 2, 3]'::jsonb @> '[1, 3]'::jsonb;

-- Order of array elements is not significant, so this is also true:
SELECT '[1, 2, 3]'::jsonb @> '[3, 1]'::jsonb;

-- The object with a single pair on the right side is contained
-- within the object on the left side:
SELECT '{"product": "PostgreSQL", "version": 9.4, "jsonb": true}'::jsonb @> '{"version": 9.4}'::jsonb;

-- Similarly, containment is not reported here:
SELECT '{"foo": {"bar": "baz"}}'::jsonb @> '{"bar": "baz"}'::jsonb;  -- yields false
```

🇻🇳 Các ví dụ gốc minh hoạ: scalar chỉ chứa đúng chính nó; mảng chứa mảng con bất kể thứ tự; object chứa object con; nhưng containment **phải khớp đúng tầng** — `{"bar":"baz"}` nằm ở tầng trong nên không được coi là được chứa ở tầng ngoài.

## D5. jsonb + GIN index

📖 **Nguyên văn**
> "GIN indexes can be used to efficiently search for keys or key/value pairs occurring within a large number of `jsonb` documents (datums). Two GIN “operator classes” are provided, offering different performance and flexibility trade-offs. The default GIN operator class for `jsonb` supports queries with the key-exists operators `?`, `?|` and `?&`, the containment operator `@>`, and the jsonpath match operators `@?` and `@@`. An example of creating an index with this operator class is:"

```sql
CREATE INDEX idxgin ON api USING GIN (jdoc);
```

🇻🇳 **Dịch**
> "GIN index có thể dùng để tìm kiếm hiệu quả các key hoặc cặp key/value xuất hiện trong một lượng lớn tài liệu `jsonb`. Có hai “operator class” GIN được cung cấp, với các đánh đổi khác nhau về hiệu năng và độ linh hoạt. Operator class GIN mặc định cho `jsonb` hỗ trợ truy vấn với các toán tử key-exists `?`, `?|` và `?&`, toán tử containment `@>`, và các toán tử khớp jsonpath `@?` và `@@`. Ví dụ tạo index với operator class này:"

📖 **Nguyên văn**
> "The non-default GIN operator class `jsonb_path_ops` does not support the key-exists operators, but it does support `@>`, `@?` and `@@`. An example of creating an index with this operator class is:"

```sql
CREATE INDEX idxginp ON api USING GIN (jdoc jsonb_path_ops);
```

🇻🇳 **Dịch**
> "Operator class GIN không mặc định là `jsonb_path_ops` không hỗ trợ các toán tử key-exists, nhưng có hỗ trợ `@>`, `@?` và `@@`. Ví dụ tạo index với operator class này:"

📖 **Nguyên văn** — query dùng được index

```sql
-- Find documents in which the key "company" has value "Magnafone"
SELECT jdoc->'guid', jdoc->'name' FROM api WHERE jdoc @> '{"company": "Magnafone"}';
```

🇻🇳 Tìm các tài liệu có key `"company"` mang giá trị `"Magnafone"` — dạng query này tận dụng được GIN index trên cột `jdoc`. (Về GIN nói chung, xem [[04 - Indexes]].)

📖 **Nguyên văn**
> "However, the index could not be used for queries like the following, because though the operator `?` is indexable, it is not applied directly to the indexed column `jdoc`:"

```sql
-- Find documents in which the key "tags" contains key or array element "qui"
SELECT jdoc->'guid', jdoc->'name' FROM api WHERE jdoc -> 'tags' ? 'qui';
```

🇻🇳 **Dịch**
> "Tuy nhiên index sẽ **không** dùng được cho các query như sau, vì tuy toán tử `?` có thể index được nhưng nó không được áp trực tiếp lên cột đã index là `jdoc`:"

📖 **Nguyên văn**
> "Still, with appropriate use of expression indexes, the above query can use an index."

```sql
CREATE INDEX idxgintags ON api USING GIN ((jdoc -> 'tags'));
```

🇻🇳 **Dịch**
> "Dù vậy, nếu dùng expression index cho đúng thì query trên vẫn có thể tận dụng được index:"

## D6. JSON `null` không phải SQL `NULL`

📖 **Nguyên văn** (trích Table 8.23. JSON Primitive Types and Corresponding PostgreSQL Types)
> "`string` → `text` — `\u0000` is disallowed, as are Unicode escapes representing characters not available in the database encoding
>
> `number` → `numeric` — `NaN` and `infinity` values are disallowed
>
> `boolean` → `boolean` — Only lowercase `true` and `false` spellings are accepted
>
> `null` → (none) — SQL NULL is a different concept"

🇻🇳 **Dịch**
> "`string` → `text` — Không cho phép `\u0000`, cũng như các Unicode escape biểu diễn ký tự không có trong encoding của database
>
> `number` → `numeric` — Không cho phép giá trị `NaN` và `infinity`
>
> `boolean` → `boolean` — Chỉ chấp nhận cách viết chữ thường `true` và `false`
>
> `null` → (không có) — **SQL NULL là một khái niệm khác**"

> [!warning] Vòng lại Phần A
> Một field JSON có giá trị `null` (JSON null) khác với việc cả cột `jsonb` là SQL NULL, và cũng khác với việc field đó không tồn tại. Ba tình huống, ba cách kiểm tra khác nhau.

---

## Tóm tắt

- **NULL = "không biết"**, không phải 0 cũng không phải chuỗi rỗng. `= NULL` luôn cho null → luôn dùng `IS NULL` / `IS NOT NULL`.
- Muốn so sánh mà coi null như giá trị bình thường → `IS DISTINCT FROM` / `IS NOT DISTINCT FROM`.
- `COALESCE` thay null bằng mặc định; `NULLIF` biến một giá trị thành null; `CASE WHEN` là if/else của SQL.
- `count(*)` đếm mọi dòng, `count(cột)` chỉ đếm dòng có giá trị khác null. `sum` của không dòng nào ra null, không phải 0.
- String: `||` nối (null nuốt tất cả), `length`, `lower`/`upper`, `btrim`/`ltrim`/`rtrim`/`trim`, `substring`, `replace`, `split_part`, `position`, `left`/`right`, `format` (`%I`/`%L` để dựng SQL động an toàn).
- `LIKE` khớp toàn bộ chuỗi (`%`, `_`), `ILIKE` bỏ qua hoa thường, `~` là regex POSIX — cẩn thận regex từ nguồn không tin cậy.
- **`timestamptz` lưu nội bộ dưới dạng UTC và không giữ lại time zone gốc; `timestamp` bỏ qua mọi chỉ dẫn time zone.** Chọn sai là nguồn của bug lệch giờ.
- `now()`/`current_timestamp` đứng yên trong suốt transaction; `clock_timestamp()` thì không.
- `date_trunc()` để gom theo ngày/tháng, `extract()` để rút năm/tháng/giờ, `+ interval` để cộng trừ thời gian.
- **`jsonb` gần như luôn là lựa chọn đúng** so với `json`: nhị phân đã phân rã, xử lý nhanh hơn, hỗ trợ index (GIN), có `@>`.
- `->` trả JSON, `->>` trả text, `#>`/`#>>` đi theo đường dẫn nhiều tầng.

---

## 🔌 Liên hệ stack thực tế

> Phần này là ghi chú riêng, KHÔNG trích từ tài liệu PostgreSQL.

Điểm đáng chú ý nhất của Phần D với người đang quen Firestore: `jsonb` cho phép lưu **dữ liệu bán cấu trúc ngay bên trong một RDBMS**. Một row vẫn có các cột chặt chẽ (`id`, `shop_id`, `created_at` — với constraint và foreign key như [[02 - Tables, Data Types và Constraints]]), nhưng phần "mỗi shop mỗi khác" (settings, metadata, payload webhook) có thể nằm trong một cột `jsonb` mà không cần `ALTER TABLE` mỗi lần thêm field — tức là không cần một migration mới ([[06 - Database Migrations]]) cho từng thay đổi nhỏ của cấu hình.

Nghĩa là lựa chọn không còn là "document database **hay** relational database". Với PostgreSQL, có thể giữ quan hệ + transaction cho phần dữ liệu cốt lõi, và dùng `jsonb` + GIN index cho phần linh hoạt. Đây là điểm so sánh trực tiếp đáng cân nhắc khi đứng giữa Firestore và Cloud SQL for PostgreSQL cho một tính năng mới.

Hai điều nên nhớ khi đọc note này bằng con mắt JavaScript:
- `NULL` của SQL và `null`/`undefined` của JavaScript không ánh xạ 1-1. Trong JS, `null == null` là `true`; trong SQL, `NULL = NULL` cho ra `NULL`. Driver trả về `null` cho cả hai trường hợp "cột là NULL" và "field JSON là null" — muốn phân biệt phải kiểm tra ở phía SQL.
- `->>` trả về `text`, nên `jdoc->>'amount'` là chuỗi chứ không phải số. Cần ép kiểu (`(jdoc->>'amount')::numeric`) trước khi so sánh hay cộng dồn.

---

## Liên kết
- Bài trước: [[10 - Views và Schemas]]
- Bài kế: [[12 - Window Functions]]
- Khái niệm liên quan: [[02 - Tables, Data Types và Constraints]] (data type, `DEFAULT`, `NOT NULL`), [[03 - Queries - SELECT, JOIN, Aggregate]] (`WHERE`, `GROUP BY`, aggregate), [[04 - Indexes]] (GIN index cho `jsonb`)
- Mục lục phần 05: [[00 - Tổng hợp (Relational Databases)]]

## Nguồn tham khảo
- PostgreSQL Documentation — 9.2. Comparison Functions and Operators : https://www.postgresql.org/docs/current/functions-comparison.html
- PostgreSQL Documentation — 9.18. Conditional Expressions : https://www.postgresql.org/docs/current/functions-conditional.html
- PostgreSQL Documentation — 9.4. String Functions and Operators : https://www.postgresql.org/docs/current/functions-string.html
- PostgreSQL Documentation — 9.7. Pattern Matching : https://www.postgresql.org/docs/current/functions-matching.html
- PostgreSQL Documentation — 8.5. Date/Time Types : https://www.postgresql.org/docs/current/datatype-datetime.html
- PostgreSQL Documentation — 9.9. Date/Time Functions and Operators : https://www.postgresql.org/docs/current/functions-datetime.html
- PostgreSQL Documentation — 8.14. JSON Types : https://www.postgresql.org/docs/current/datatype-json.html
- PostgreSQL Documentation — 9.16. JSON Functions and Operators : https://www.postgresql.org/docs/current/functions-json.html
- PostgreSQL Documentation — 9.21. Aggregate Functions : https://www.postgresql.org/docs/current/functions-aggregate.html
