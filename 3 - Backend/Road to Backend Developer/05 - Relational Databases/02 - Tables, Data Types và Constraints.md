# 02 — Tables, Data Types và Constraints

> **Nguồn chính:** PostgreSQL Documentation — https://www.postgresql.org/docs/current/ddl-basics.html
> Bài này bám Chapter 5 (Data Definition): 5.1 Table Basics, 5.2 Default Values, 5.5 Constraints, cùng Chapter 8 (Data Types) mục 8.1 Numeric và 8.3 Character.

---

## 1. Table Basics — bảng là gì

📖 **Nguyên văn**
> "A table in a relational database is much like a table on paper: It consists of rows and columns. The number and order of the columns is fixed, and each column has a name. The number of rows is variable — it reflects how much data is stored at a given moment. SQL does not make any guarantees about the order of the rows in a table. When a table is read, the rows will appear in an unspecified order, unless sorting is explicitly requested."

🇻🇳 **Dịch**
> "Một table trong relational database rất giống một cái bảng trên giấy: nó gồm các row và các column. Số lượng và thứ tự các column là cố định, và mỗi column có một tên. Số lượng row thì thay đổi — nó phản ánh lượng dữ liệu đang được lưu tại một thời điểm. SQL không đưa ra bất kỳ đảm bảo nào về thứ tự các row trong một table. Khi đọc một table, các row sẽ xuất hiện theo thứ tự không xác định, trừ khi việc sắp xếp được yêu cầu một cách tường minh."

📖 **Nguyên văn**
> "Furthermore, SQL does not assign unique identifiers to rows, so it is possible to have several completely identical rows in a table. This is a consequence of the mathematical model that underlies SQL but is usually not desirable."

🇻🇳 **Dịch**
> "Hơn nữa, SQL không gán định danh duy nhất cho các row, nên hoàn toàn có thể tồn tại nhiều row giống hệt nhau trong một table. Đây là hệ quả của mô hình toán học nằm dưới SQL nhưng thường là điều không mong muốn."

> [!note]
> Chính câu này dẫn tới lý do phải có **primary key** ở mục 6 bên dưới — table không tự động phân biệt được các row trùng nhau.

### Data type gắn với column

📖 **Nguyên văn**
> "Each column has a data type. The data type constrains the set of possible values that can be assigned to a column and assigns semantics to the data stored in the column so that it can be used for computations. For instance, a column declared to be of a numerical type will not accept arbitrary text strings, and the data stored in such a column can be used for mathematical computations."

🇻🇳 **Dịch**
> "Mỗi column có một data type. Data type giới hạn tập giá trị có thể gán cho column đó và gán ý nghĩa cho dữ liệu được lưu trong column để nó có thể dùng cho việc tính toán. Ví dụ, một column được khai báo kiểu số sẽ không chấp nhận chuỗi text tùy ý, và dữ liệu lưu trong column đó có thể dùng cho các phép tính toán học."

---

## 2. CREATE TABLE

📖 **Nguyên văn**
> "To create a table, you use the aptly named CREATE TABLE command. In this command you specify at least a name for the new table, the names of the columns and the data type of each column. For example:"

🇻🇳 **Dịch**
> "Để tạo một table, bạn dùng lệnh có tên rất đúng bản chất là CREATE TABLE. Trong lệnh này bạn chỉ định tối thiểu: tên cho table mới, tên các column và data type của từng column. Ví dụ:"

```sql
CREATE TABLE my_first_table (
    first_column text,
    second_column integer
);
```

🇻🇳 Tạo table `my_first_table` gồm 2 column: `first_column` kiểu `text`, `second_column` kiểu `integer`.

📖 **Nguyên văn**
> "Of course, the previous example was heavily contrived. Normally, you would give names to your tables and columns that convey what kind of data they store. So let's look at a more realistic example:"

🇻🇳 **Dịch**
> "Tất nhiên, ví dụ trước đó là ví dụ đặt ra cho có. Bình thường, bạn sẽ đặt tên table và column sao cho truyền tải được loại dữ liệu mà chúng lưu. Vậy hãy xem một ví dụ thực tế hơn:"

```sql
CREATE TABLE products (
    product_no integer,
    name text,
    price numeric
);
```

🇻🇳 Table `products` — số hiệu sản phẩm (integer), tên (text), giá (numeric, lưu được phần thập phân nên hợp với tiền tệ).

📖 **Nguyên văn**
> "(The `numeric` type can store fractional components, as would be typical of monetary amounts.)"

🇻🇳 **Dịch**
> "(Kiểu `numeric` có thể lưu phần thập phân, đúng như đặc trưng của các giá trị tiền tệ.)"

Ví dụ trong phần tutorial của tài liệu:

```sql
CREATE TABLE weather (
    city            varchar(80),
    temp_lo         int,           -- low temperature
    temp_hi         int,           -- high temperature
    prcp            real,          -- precipitation
    date            date
);
```

🇻🇳 Table `weather` lưu thời tiết theo thành phố; `--` là cú pháp comment trong SQL.

📖 **Nguyên văn**
> "White space (i.e., spaces, tabs, and newlines) can be used freely in SQL commands. That means you can type the command aligned differently than above, or even all on one line. Two dashes ("--") introduce comments. Whatever follows them is ignored up to the end of the line. SQL is case-insensitive about key words and identifiers, except when identifiers are double-quoted to preserve the case (not done above)."

🇻🇳 **Dịch**
> "Khoảng trắng (dấu cách, tab, xuống dòng) có thể dùng thoải mái trong câu lệnh SQL. Nghĩa là bạn có thể gõ lệnh canh lề khác ở trên, hoặc thậm chí viết tất cả trên một dòng. Hai dấu gạch ngang ("--") mở đầu comment. Mọi thứ theo sau chúng bị bỏ qua cho tới hết dòng. SQL không phân biệt hoa thường với key word và identifier, trừ khi identifier được đặt trong dấu nháy kép để giữ nguyên chữ hoa thường (ví dụ trên không làm vậy)."

> [!tip]
> 📖 "When you create many interrelated tables it is wise to choose a consistent naming pattern for the tables and columns. For instance, there is a choice of using singular or plural nouns for table names, both of which are favored by some theorist or other."
> 🇻🇳 "Khi bạn tạo nhiều table liên quan nhau, nên chọn một quy ước đặt tên nhất quán cho table và column. Ví dụ, có lựa chọn dùng danh từ số ít hay số nhiều cho tên table, cả hai đều được một vài nhà lý thuyết nào đó ủng hộ."

📖 **Nguyên văn**
> "There is a limit on how many columns a table can contain. Depending on the column types, it is between 250 and 1600. However, defining a table with anywhere near this many columns is highly unusual and often a questionable design."

🇻🇳 **Dịch**
> "Có một giới hạn về số column mà một table có thể chứa. Tùy theo kiểu column, giới hạn đó nằm trong khoảng 250 đến 1600. Tuy nhiên, định nghĩa một table với số column gần mức đó là rất bất thường và thường là thiết kế đáng nghi ngờ."

---

## 3. DROP TABLE

📖 **Nguyên văn**
> "If you no longer need a table, you can remove it using the DROP TABLE command. For example:"

🇻🇳 **Dịch**
> "Nếu bạn không còn cần một table nữa, bạn có thể xóa nó bằng lệnh DROP TABLE. Ví dụ:"

```sql
DROP TABLE my_first_table;
DROP TABLE products;
```

🇻🇳 Xóa hẳn table khỏi database (cả cấu trúc lẫn dữ liệu).

📖 **Nguyên văn**
> "Attempting to drop a table that does not exist is an error. Nevertheless, it is common in SQL script files to unconditionally try to drop each table before creating it, ignoring any error messages, so that the script works whether or not the table exists. (If you like, you can use the `DROP TABLE IF EXISTS` variant to avoid the error messages, but this is not standard SQL.)"

🇻🇳 **Dịch**
> "Cố gắng drop một table không tồn tại là một lỗi. Dù vậy, trong các file script SQL người ta vẫn thường vô điều kiện thử drop từng table trước khi tạo nó, bỏ qua mọi thông báo lỗi, để script chạy được bất kể table có tồn tại hay không. (Nếu thích, bạn có thể dùng biến thể `DROP TABLE IF EXISTS` để tránh thông báo lỗi, nhưng đây không phải SQL chuẩn.)"

> [!danger]
> `DROP TABLE` xóa toàn bộ dữ liệu trong table và không có bước hỏi lại. Đây là thao tác không đảo ngược được nếu không có backup.

---

## 4. Data Types — bảng tổng quan

📖 **Nguyên văn**
> "PostgreSQL has a rich set of native data types available to users. Users can add new types to PostgreSQL using the CREATE TYPE command."

🇻🇳 **Dịch**
> "PostgreSQL có một tập data type native phong phú dành cho người dùng. Người dùng cũng có thể thêm type mới vào PostgreSQL bằng lệnh CREATE TYPE."

**Table 8.1. Data Types** (Name + Description nguyên văn, cột cuối là ghi chú tiếng Việt)

| Name | Aliases | Description (nguyên văn) | Ghi chú tiếng Việt |
|---|---|---|---|
| `bigint` | `int8` | signed eight-byte integer | số nguyên có dấu 8 byte |
| `bigserial` | `serial8` | autoincrementing eight-byte integer | số nguyên 8 byte tự tăng |
| `bit [ (n) ]` | | fixed-length bit string | chuỗi bit độ dài cố định |
| `bit varying [ (n) ]` | `varbit [ (n) ]` | variable-length bit string | chuỗi bit độ dài thay đổi |
| `boolean` | `bool` | logical Boolean (true/false) | giá trị logic đúng/sai |
| `box` | | rectangular box on a plane | hình chữ nhật trên mặt phẳng |
| `bytea` | | binary data ("byte array") | dữ liệu nhị phân |
| `character [ (n) ]` | `char [ (n) ]` | fixed-length character string | chuỗi ký tự độ dài cố định |
| `character varying [ (n) ]` | `varchar [ (n) ]` | variable-length character string | chuỗi ký tự độ dài thay đổi |
| `cidr` | | IPv4 or IPv6 network address | địa chỉ network IPv4/IPv6 |
| `circle` | | circle on a plane | hình tròn trên mặt phẳng |
| `date` | | calendar date (year, month, day) | ngày lịch (năm, tháng, ngày) |
| `double precision` | `float`, `float8` | double precision floating-point number (8 bytes) | số thực dấu phẩy động độ chính xác kép |
| `inet` | | IPv4 or IPv6 host address | địa chỉ host IPv4/IPv6 |
| `integer` | `int`, `int4` | signed four-byte integer | số nguyên có dấu 4 byte |
| `interval [ fields ] [ (p) ]` | | time span | khoảng thời gian |
| `json` | | textual JSON data | dữ liệu JSON dạng text |
| `jsonb` | | binary JSON data, decomposed | dữ liệu JSON dạng nhị phân, đã phân rã |
| `line` | | infinite line on a plane | đường thẳng vô hạn trên mặt phẳng |
| `lseg` | | line segment on a plane | đoạn thẳng trên mặt phẳng |
| `macaddr` | | MAC (Media Access Control) address | địa chỉ MAC |
| `macaddr8` | | MAC (Media Access Control) address (EUI-64 format) | địa chỉ MAC dạng EUI-64 |
| `money` | | currency amount | giá trị tiền tệ |
| `numeric [ (p, s) ]` | `decimal [ (p, s) ]` | exact numeric of selectable precision | số chính xác với precision tùy chọn |
| `path` | | geometric path on a plane | đường hình học trên mặt phẳng |
| `pg_lsn` | | PostgreSQL Log Sequence Number | số thứ tự log của PostgreSQL |
| `pg_snapshot` | | user-level transaction ID snapshot | snapshot transaction ID mức user |
| `point` | | geometric point on a plane | điểm trên mặt phẳng |
| `polygon` | | closed geometric path on a plane | đa giác khép kín trên mặt phẳng |
| `real` | `float4` | single precision floating-point number (4 bytes) | số thực dấu phẩy động độ chính xác đơn |
| `smallint` | `int2` | signed two-byte integer | số nguyên có dấu 2 byte |
| `smallserial` | `serial2` | autoincrementing two-byte integer | số nguyên 2 byte tự tăng |
| `serial` | `serial4` | autoincrementing four-byte integer | số nguyên 4 byte tự tăng |
| `text` | | variable-length character string | chuỗi ký tự độ dài không giới hạn |
| `time [ (p) ] [ without time zone ]` | | time of day (no time zone) | giờ trong ngày, không time zone |
| `time [ (p) ] with time zone` | `timetz` | time of day, including time zone | giờ trong ngày, có time zone |
| `timestamp [ (p) ] [ without time zone ]` | | date and time (no time zone) | ngày + giờ, không time zone |
| `timestamp [ (p) ] with time zone` | `timestamptz` | date and time, including time zone | ngày + giờ, có time zone |
| `tsquery` | | text search query | truy vấn full-text search |
| `tsvector` | | text search document | document đã index cho full-text search |
| `txid_snapshot` | | user-level transaction ID snapshot (deprecated; see `pg_snapshot`) | đã deprecated, dùng `pg_snapshot` |
| `uuid` | | universally unique identifier | định danh duy nhất toàn cục |
| `xml` | | XML data | dữ liệu XML |

---

## 5. Numeric Types — nhóm dùng nhiều nhất (1)

📖 **Nguyên văn**
> "Numeric types consist of two-, four-, and eight-byte integers, four- and eight-byte floating-point numbers, and selectable-precision decimals."

🇻🇳 **Dịch**
> "Các numeric type gồm: số nguyên 2, 4 và 8 byte; số dấu phẩy động 4 và 8 byte; và số thập phân với precision tùy chọn."

**Table 8.2. Numeric Types**

| Name | Storage Size | Description (nguyên văn) | Range |
|---|---|---|---|
| `smallint` | 2 bytes | small-range integer | -32768 to +32767 |
| `integer` | 4 bytes | typical choice for integer | -2147483648 to +2147483647 |
| `bigint` | 8 bytes | large-range integer | -9223372036854775808 to +9223372036854775807 |
| `decimal` | variable | user-specified precision, exact | up to 131072 digits before the decimal point; up to 16383 digits after the decimal point |
| `numeric` | variable | user-specified precision, exact | up to 131072 digits before the decimal point; up to 16383 digits after the decimal point |
| `real` | 4 bytes | variable-precision, inexact | 6 decimal digits precision |
| `double precision` | 8 bytes | variable-precision, inexact | 15 decimal digits precision |
| `smallserial` | 2 bytes | small autoincrementing integer | 1 to 32767 |
| `serial` | 4 bytes | autoincrementing integer | 1 to 2147483647 |
| `bigserial` | 8 bytes | large autoincrementing integer | 1 to 9223372036854775807 |

### 5.1 Integer Types

📖 **Nguyên văn**
> "The types `smallint`, `integer`, and `bigint` store whole numbers, that is, numbers without fractional components, of various ranges. Attempts to store values outside of the allowed range will result in an error."
>
> "The type `integer` is the common choice, as it offers the best balance between range, storage size, and performance. The `smallint` type is generally only used if disk space is at a premium. The `bigint` type is designed to be used when the range of the `integer` type is insufficient."

🇻🇳 **Dịch**
> "Các kiểu `smallint`, `integer` và `bigint` lưu số nguyên, tức là số không có phần thập phân, với các khoảng giá trị khác nhau. Cố gắng lưu giá trị ngoài khoảng cho phép sẽ gây ra lỗi."
>
> "Kiểu `integer` là lựa chọn phổ biến, vì nó cho sự cân bằng tốt nhất giữa khoảng giá trị, dung lượng lưu trữ và hiệu năng. Kiểu `smallint` thường chỉ dùng khi dung lượng đĩa rất quý. Kiểu `bigint` được thiết kế để dùng khi khoảng giá trị của `integer` không đủ."

### 5.2 Arbitrary Precision Numbers — `numeric`

📖 **Nguyên văn**
> "The type `numeric` can store numbers with a very large number of digits. It is especially recommended for storing monetary amounts and other quantities where exactness is required. Calculations with `numeric` values yield exact results where possible, e.g., addition, subtraction, multiplication. However, calculations on `numeric` values are very slow compared to the integer types, or to the floating-point types described in the next section."

🇻🇳 **Dịch**
> "Kiểu `numeric` có thể lưu số với rất nhiều chữ số. Nó đặc biệt được khuyến nghị để lưu giá trị tiền tệ và các đại lượng khác đòi hỏi sự chính xác. Các phép tính với giá trị `numeric` cho kết quả chính xác khi có thể, ví dụ cộng, trừ, nhân. Tuy nhiên, tính toán trên giá trị `numeric` rất chậm so với các kiểu integer, hoặc so với các kiểu floating-point mô tả ở mục kế tiếp."

📖 **Nguyên văn**
> "The _precision_ of a `numeric` is the total count of significant digits in the whole number, that is, the number of digits to both sides of the decimal point. The _scale_ of a `numeric` is the count of decimal digits in the fractional part, to the right of the decimal point. So the number 23.5141 has a precision of 6 and a scale of 4. Integers can be considered to have a scale of zero."

🇻🇳 **Dịch**
> "*Precision* của một `numeric` là tổng số chữ số có nghĩa trong cả số, tức số chữ số ở cả hai phía dấu thập phân. *Scale* của một `numeric` là số chữ số thập phân ở phần lẻ, bên phải dấu thập phân. Vậy số 23.5141 có precision là 6 và scale là 4. Số nguyên có thể coi là có scale bằng 0."

```
NUMERIC(precision, scale)
```

🇻🇳 Cú pháp khai báo column `numeric` với precision và scale cụ thể.

📖 **Nguyên văn**
> "For example, a column declared as `NUMERIC(3, 1)` will round values to 1 decimal place and can store values between -99.9 and 99.9, inclusive."

🇻🇳 **Dịch**
> "Ví dụ, một column khai báo là `NUMERIC(3, 1)` sẽ làm tròn giá trị về 1 chữ số thập phân và có thể lưu các giá trị từ -99.9 đến 99.9, bao gồm cả hai đầu."

> [!warning]
> 📖 "The maximum precision that can be explicitly specified in a `numeric` type declaration is 1000."
> 🇻🇳 "Precision tối đa có thể khai báo tường minh trong một kiểu `numeric` là 1000."

### 5.3 Serial Types

📖 **Nguyên văn**
> "The data types `smallserial`, `serial` and `bigserial` are not true types, but merely a notational convenience for creating unique identifier columns (similar to the `AUTO_INCREMENT` property supported by some other databases). In the current implementation, specifying:"

🇻🇳 **Dịch**
> "Các data type `smallserial`, `serial` và `bigserial` không phải type thực sự, mà chỉ là cách viết tắt tiện lợi để tạo column định danh duy nhất (tương tự thuộc tính `AUTO_INCREMENT` mà một số database khác hỗ trợ). Trong hiện thực hiện tại, việc viết:"

```sql
CREATE TABLE tablename (
    colname SERIAL
);
```

🇻🇳 Khai báo column tự tăng dạng rút gọn.

📖 **Nguyên văn**
> "is equivalent to specifying:"

🇻🇳 **Dịch**
> "là tương đương với việc viết:"

```sql
CREATE SEQUENCE tablename_colname_seq AS integer;
CREATE TABLE tablename (
    colname integer NOT NULL DEFAULT nextval('tablename_colname_seq')
);
ALTER SEQUENCE tablename_colname_seq OWNED BY tablename.colname;
```

🇻🇳 Bản chất: tạo một sequence object, cho column lấy default từ `nextval()` của sequence đó, rồi gắn sequence "thuộc sở hữu" của column.

📖 **Nguyên văn**
> "Thus, we have created an integer column and arranged for its default values to be assigned from a sequence generator. A `NOT NULL` constraint is applied to ensure that a null value cannot be inserted. (In most cases you would also want to attach a `UNIQUE` or `PRIMARY KEY` constraint to prevent duplicate values from being inserted by accident, but this is not automatic.)"

🇻🇳 **Dịch**
> "Như vậy, ta đã tạo một column integer và sắp xếp để giá trị default của nó được gán từ một sequence generator. Một constraint `NOT NULL` được áp dụng để đảm bảo không thể insert giá trị null. (Trong hầu hết trường hợp bạn cũng sẽ muốn gắn thêm constraint `UNIQUE` hoặc `PRIMARY KEY` để tránh vô tình insert giá trị trùng, nhưng điều này không tự động.)"

> [!warning]
> 📖 "Because `smallserial`, `serial` and `bigserial` are implemented using sequences, there may be "holes" or gaps in the sequence of values which appears in the column, even if no rows are ever deleted. A value allocated from the sequence is still "used up" even if a row containing that value is never successfully inserted into the table column. This may happen, for example, if the inserting transaction rolls back."
> 🇻🇳 "Vì `smallserial`, `serial` và `bigserial` được hiện thực bằng sequence, có thể xuất hiện "lỗ hổng" hay khoảng trống trong dãy giá trị của column, ngay cả khi không row nào bị xóa. Một giá trị đã cấp phát từ sequence vẫn bị coi là "đã dùng" kể cả khi row chứa giá trị đó chưa từng được insert thành công vào column. Điều này có thể xảy ra, ví dụ, khi transaction insert bị rollback."

---

## 6. Character Types — nhóm dùng nhiều nhất (2)

**Table 8.4. Character Types**

| Name | Description (nguyên văn) | Ghi chú tiếng Việt |
|---|---|---|
| `character varying(n)`, `varchar(n)` | variable-length with limit | độ dài thay đổi, có giới hạn n |
| `character(n)`, `char(n)`, `bpchar(n)` | fixed-length, blank-padded | độ dài cố định, đệm khoảng trắng |
| `bpchar` | variable unlimited length, blank-trimmed | độ dài tùy ý, cắt khoảng trắng cuối |
| `text` | variable unlimited length | độ dài tùy ý, không giới hạn |

📖 **Nguyên văn**
> "SQL defines two primary character types: `character varying(n)` and `character(n)`, where `n` is a positive integer. Both of these types can store strings up to `n` characters (not bytes) in length. An attempt to store a longer string into a column of these types will result in an error, unless the excess characters are all spaces, in which case the string will be truncated to the maximum length. […] If the string to be stored is shorter than the declared length, values of type `character` will be space-padded; values of type `character varying` will simply store the shorter string."

🇻🇳 **Dịch**
> "SQL định nghĩa hai character type chính: `character varying(n)` và `character(n)`, với `n` là số nguyên dương. Cả hai kiểu này đều lưu được chuỗi dài tới `n` ký tự (không phải byte). Cố lưu chuỗi dài hơn vào column các kiểu này sẽ gây lỗi, trừ khi các ký tự thừa đều là khoảng trắng, khi đó chuỗi sẽ bị cắt về độ dài tối đa. […] Nếu chuỗi cần lưu ngắn hơn độ dài khai báo, giá trị kiểu `character` sẽ được đệm thêm khoảng trắng; giá trị kiểu `character varying` chỉ đơn giản lưu chuỗi ngắn đó."

📖 **Nguyên văn**
> "In addition, PostgreSQL provides the `text` type, which stores strings of any length. Although the `text` type is not in the SQL standard, several other SQL database management systems have it as well. `text` is PostgreSQL's native string data type, in that most built-in functions operating on strings are declared to take or return `text` not `character varying`."

🇻🇳 **Dịch**
> "Ngoài ra, PostgreSQL cung cấp kiểu `text`, lưu chuỗi với độ dài bất kỳ. Dù kiểu `text` không nằm trong SQL chuẩn, một số hệ quản trị database SQL khác cũng có nó. `text` là kiểu chuỗi native của PostgreSQL, theo nghĩa hầu hết built-in function xử lý chuỗi đều khai báo nhận vào hoặc trả về `text` chứ không phải `character varying`."

📖 **Nguyên văn**
> "If specified, the length `n` must be greater than zero and cannot exceed 10,485,760."

🇻🇳 **Dịch**
> "Nếu có chỉ định, độ dài `n` phải lớn hơn 0 và không được vượt quá 10.485.760."

> [!tip]
> 📖 "There is no performance difference among these three types, apart from increased storage space when using the blank-padded type, and a few extra CPU cycles to check the length when storing into a length-constrained column. While `character(n)` has performance advantages in some other database systems, there is no such advantage in PostgreSQL; in fact `character(n)` is usually the slowest of the three because of its additional storage costs. In most situations `text` or `character varying` should be used instead."
> 🇻🇳 "Không có khác biệt hiệu năng giữa ba kiểu này, ngoài việc tốn thêm dung lượng lưu trữ khi dùng kiểu đệm khoảng trắng, và vài chu kỳ CPU để kiểm tra độ dài khi lưu vào column có giới hạn độ dài. Trong khi `character(n)` có lợi thế hiệu năng ở một vài hệ database khác, ở PostgreSQL thì không có lợi thế đó; thực tế `character(n)` thường là kiểu chậm nhất trong ba kiểu vì chi phí lưu trữ phụ trội. Trong hầu hết trường hợp nên dùng `text` hoặc `character varying` thay thế."

**Example 8.1. Using the Character Types**

```sql
CREATE TABLE test1 (a character(4));
INSERT INTO test1 VALUES ('ok');
SELECT a, char_length(a) FROM test1;
  a   | char_length
------+-------------
 ok   |           2

CREATE TABLE test2 (b varchar(5));
INSERT INTO test2 VALUES ('ok');
INSERT INTO test2 VALUES ('good      ');
INSERT INTO test2 VALUES ('too long');
ERROR:  value too long for type character varying(5)
INSERT INTO test2 VALUES ('too long'::varchar(5)); -- explicit truncation
SELECT b, char_length(b) FROM test2;
   b   | char_length
-------+-------------
 ok    |           2
 good  |           5
 too l |           5
```

🇻🇳 Minh họa: `character(4)` đệm khoảng trắng nhưng `char_length` vẫn trả 2; `varchar(5)` báo lỗi khi chuỗi quá dài, trừ khi cast tường minh thì bị cắt bớt.

---

## 7. Default Values

📖 **Nguyên văn**
> "A column can be assigned a default value. When a new row is created and no values are specified for some of the columns, those columns will be filled with their respective default values. A data manipulation command can also request explicitly that a column be set to its default value, without having to know what that value is."

🇻🇳 **Dịch**
> "Một column có thể được gán giá trị default. Khi một row mới được tạo mà không chỉ định giá trị cho một số column, các column đó sẽ được điền bằng giá trị default tương ứng. Một lệnh thao tác dữ liệu cũng có thể yêu cầu tường minh rằng một column được đặt về giá trị default của nó, mà không cần biết giá trị đó là gì."

📖 **Nguyên văn**
> "If no default value is declared explicitly, the default value is the null value. This usually makes sense because a null value can be considered to represent unknown data."

🇻🇳 **Dịch**
> "Nếu không khai báo giá trị default tường minh, giá trị default là null. Điều này thường hợp lý vì null có thể coi là biểu diễn dữ liệu chưa biết."

```sql
CREATE TABLE products (
    product_no integer,
    name text,
    price numeric DEFAULT 9.99
);
```

🇻🇳 Column `price` mặc định là 9.99 nếu INSERT không đưa giá trị.

📖 **Nguyên văn**
> "The default value can be an expression, which will be evaluated whenever the default value is inserted (_not_ when the table is created). A common example is for a `timestamp` column to have a default of `CURRENT_TIMESTAMP`, so that it gets set to the time of row insertion."

🇻🇳 **Dịch**
> "Giá trị default có thể là một expression, được tính mỗi lần giá trị default được insert (*không phải* lúc table được tạo). Một ví dụ phổ biến là column `timestamp` có default là `CURRENT_TIMESTAMP`, để nó được đặt bằng thời điểm insert row."

```sql
CREATE TABLE products (
    product_no integer DEFAULT nextval('products_product_no_seq'),
    ...
);
```

🇻🇳 Lấy giá trị default từ một sequence object — đây chính là thứ mà `SERIAL` viết tắt lại.

---

## 8. CONSTRAINTS — vì sao data type là chưa đủ

📖 **Nguyên văn**
> "Data types are a way to limit the kind of data that can be stored in a table. For many applications, however, the constraint they provide is too coarse. For example, a column containing a product price should probably only accept positive values. But there is no standard data type that accepts only positive numbers. Another issue is that you might want to constrain column data with respect to other columns or rows. For example, in a table containing product information, there should be only one row for each product number."

🇻🇳 **Dịch**
> "Data type là một cách giới hạn loại dữ liệu có thể lưu trong table. Tuy nhiên với nhiều ứng dụng, ràng buộc mà chúng cung cấp là quá thô. Ví dụ, một column chứa giá sản phẩm có lẽ chỉ nên chấp nhận giá trị dương. Nhưng không có data type chuẩn nào chỉ chấp nhận số dương. Một vấn đề khác là bạn có thể muốn ràng buộc dữ liệu của column theo các column hay row khác. Ví dụ, trong một table chứa thông tin sản phẩm, chỉ nên có một row cho mỗi số hiệu sản phẩm."

📖 **Nguyên văn**
> "To that end, SQL allows you to define constraints on columns and tables. Constraints give you as much control over the data in your tables as you wish. If a user attempts to store data in a column that would violate a constraint, an error is raised. This applies even if the value came from the default value definition."

🇻🇳 **Dịch**
> "Vì lý do đó, SQL cho phép bạn định nghĩa constraint trên column và table. Constraint cho bạn mức kiểm soát dữ liệu trong table tùy ý bạn muốn. Nếu một user cố lưu dữ liệu vào column mà vi phạm constraint, một lỗi sẽ được báo. Điều này áp dụng cả khi giá trị đó đến từ định nghĩa giá trị default."

Tài liệu liệt kê 6 loại constraint theo thứ tự: **Check → Not-Null → Unique → Primary Key → Foreign Key → Exclusion**.

---

## 9. Check Constraints

📖 **Nguyên văn**
> "A check constraint is the most generic constraint type. It allows you to specify that the value in a certain column must satisfy a Boolean (truth-value) expression. For instance, to require positive product prices, you could use:"

🇻🇳 **Dịch**
> "Check constraint là loại constraint tổng quát nhất. Nó cho phép bạn quy định rằng giá trị trong một column nhất định phải thỏa mãn một expression Boolean (giá trị đúng/sai). Ví dụ, để yêu cầu giá sản phẩm phải dương, bạn có thể dùng:"

```sql
CREATE TABLE products (
    product_no integer,
    name text,
    price numeric CHECK (price > 0)
);
```

🇻🇳 Chỉ cho phép `price` lớn hơn 0.

📖 **Nguyên văn**
> "You can also give the constraint a separate name. This clarifies error messages and allows you to refer to the constraint when you need to change it. The syntax is:"

🇻🇳 **Dịch**
> "Bạn cũng có thể đặt cho constraint một cái tên riêng. Điều này làm thông báo lỗi rõ ràng hơn và cho phép bạn tham chiếu tới constraint khi cần thay đổi nó. Cú pháp là:"

```sql
CREATE TABLE products (
    product_no integer,
    name text,
    price numeric CONSTRAINT positive_price CHECK (price > 0)
);
```

🇻🇳 Đặt tên constraint là `positive_price` bằng từ khóa `CONSTRAINT`.

### Column constraint vs table constraint

📖 **Nguyên văn**
> "A check constraint can also refer to several columns. Say you store a regular price and a discounted price, and you want to ensure that the discounted price is lower than the regular price:"

🇻🇳 **Dịch**
> "Một check constraint cũng có thể tham chiếu tới nhiều column. Giả sử bạn lưu giá gốc và giá khuyến mãi, và bạn muốn đảm bảo giá khuyến mãi thấp hơn giá gốc:"

```sql
CREATE TABLE products (
    product_no integer,
    name text,
    price numeric CHECK (price > 0),
    discounted_price numeric CHECK (discounted_price > 0),
    CHECK (price > discounted_price)
);
```

🇻🇳 Hai constraint đầu là column constraint; dòng `CHECK (price > discounted_price)` là table constraint vì nó đứng riêng, không gắn vào column nào.

📖 **Nguyên văn**
> "We say that the first two constraints are column constraints, whereas the third one is a table constraint because it is written separately from any one column definition. Column constraints can also be written as table constraints, while the reverse is not necessarily possible, since a column constraint is supposed to refer to only the column it is attached to."

🇻🇳 **Dịch**
> "Ta nói hai constraint đầu là column constraint, còn cái thứ ba là table constraint vì nó được viết tách rời khỏi bất kỳ định nghĩa column nào. Column constraint cũng có thể viết dưới dạng table constraint, còn chiều ngược lại thì không hẳn được, vì một column constraint được giả định chỉ tham chiếu tới column mà nó gắn vào."

📖 **Nguyên văn**
> "It should be noted that a check constraint is satisfied if the check expression evaluates to true or the null value. Since most expressions will evaluate to the null value if any operand is null, they will not prevent null values in the constrained columns. To ensure that a column does not contain null values, the not-null constraint described in the next section can be used."

🇻🇳 **Dịch**
> "Cần lưu ý rằng một check constraint được coi là thỏa mãn nếu expression kiểm tra cho ra true *hoặc* giá trị null. Vì hầu hết expression sẽ cho ra null nếu có toán hạng nào là null, chúng sẽ không ngăn được giá trị null trong các column bị ràng buộc. Để đảm bảo một column không chứa giá trị null, có thể dùng not-null constraint mô tả ở mục kế tiếp."

> [!warning]
> 📖 "PostgreSQL does not support `CHECK` constraints that reference table data other than the new or updated row being checked. While a `CHECK` constraint that violates this rule may appear to work in simple tests, it cannot guarantee that the database will not reach a state in which the constraint condition is false (due to subsequent changes of the other row(s) involved). […] If possible, use `UNIQUE`, `EXCLUDE`, or `FOREIGN KEY` constraints to express cross-row and cross-table restrictions."
> 🇻🇳 "PostgreSQL không hỗ trợ `CHECK` constraint tham chiếu tới dữ liệu table khác ngoài chính row đang được insert/update. Dù một `CHECK` constraint vi phạm quy tắc này trông có vẻ chạy được trong các test đơn giản, nó không thể đảm bảo database sẽ không rơi vào trạng thái mà điều kiện constraint là sai (do các row liên quan bị thay đổi sau đó). […] Nếu có thể, hãy dùng constraint `UNIQUE`, `EXCLUDE` hoặc `FOREIGN KEY` để diễn đạt ràng buộc liên row và liên table."

---

## 10. Not-Null Constraints

📖 **Nguyên văn**
> "A not-null constraint simply specifies that a column must not assume the null value. A syntax example:"

🇻🇳 **Dịch**
> "Một not-null constraint đơn giản quy định rằng một column không được mang giá trị null. Một ví dụ cú pháp:"

```sql
CREATE TABLE products (
    product_no integer NOT NULL,
    name text NOT NULL,
    price numeric
);
```

🇻🇳 `product_no` và `name` bắt buộc phải có giá trị; `price` được phép null.

📖 **Nguyên văn**
> "A not-null constraint is functionally equivalent to creating a check constraint `CHECK (column_name IS NOT NULL)`, but in PostgreSQL creating an explicit not-null constraint is more efficient."

🇻🇳 **Dịch**
> "Một not-null constraint tương đương về mặt chức năng với việc tạo check constraint `CHECK (column_name IS NOT NULL)`, nhưng trong PostgreSQL thì tạo not-null constraint tường minh hiệu quả hơn."

📖 **Nguyên văn**
> "Of course, a column can have more than one constraint. Just write the constraints one after another:"

🇻🇳 **Dịch**
> "Tất nhiên, một column có thể có nhiều hơn một constraint. Chỉ cần viết các constraint nối tiếp nhau:"

```sql
CREATE TABLE products (
    product_no integer NOT NULL,
    name text NOT NULL,
    price numeric NOT NULL CHECK (price > 0)
);
```

🇻🇳 `price` vừa bắt buộc có giá trị, vừa phải lớn hơn 0.

📖 **Nguyên văn**
> "The order doesn't matter. It does not necessarily determine in which order the constraints are checked."
>
> "However, a column can have at most one explicit not-null constraint."

🇻🇳 **Dịch**
> "Thứ tự không quan trọng. Nó không nhất thiết quyết định thứ tự các constraint được kiểm tra."
>
> "Tuy nhiên, một column chỉ có thể có tối đa một not-null constraint tường minh."

> [!tip]
> 📖 "In most database designs the majority of columns should be marked not null."
> 🇻🇳 "Trong hầu hết thiết kế database, phần lớn column nên được đánh dấu not null."

---

## 11. Unique Constraints

📖 **Nguyên văn**
> "Unique constraints ensure that the data contained in a column, or a group of columns, is unique among all the rows in the table. The syntax is:"

🇻🇳 **Dịch**
> "Unique constraint đảm bảo dữ liệu chứa trong một column, hoặc một nhóm column, là duy nhất trong toàn bộ các row của table. Cú pháp là:"

```sql
CREATE TABLE products (
    product_no integer UNIQUE,
    name text,
    price numeric
);
```

🇻🇳 Dạng column constraint — mỗi `product_no` chỉ xuất hiện một lần.

```sql
CREATE TABLE products (
    product_no integer,
    name text,
    price numeric,
    UNIQUE (product_no)
);
```

🇻🇳 Cùng ý nghĩa nhưng viết dưới dạng table constraint.

📖 **Nguyên văn**
> "To define a unique constraint for a group of columns, write it as a table constraint with the column names separated by commas:"

🇻🇳 **Dịch**
> "Để định nghĩa unique constraint cho một nhóm column, viết nó dưới dạng table constraint với các tên column ngăn cách bằng dấu phẩy:"

```sql
CREATE TABLE example (
    a integer,
    b integer,
    c integer,
    UNIQUE (a, c)
);
```

🇻🇳 Cặp giá trị `(a, c)` phải duy nhất, còn riêng `a` hay riêng `c` thì không cần duy nhất.

📖 **Nguyên văn**
> "Adding a unique constraint will automatically create a unique B-tree index on the column or group of columns listed in the constraint. A uniqueness restriction covering only some rows cannot be written as a unique constraint, but it is possible to enforce such a restriction by creating a unique partial index."

🇻🇳 **Dịch**
> "Thêm một unique constraint sẽ tự động tạo một unique B-tree index trên column hoặc nhóm column được liệt kê trong constraint. Một ràng buộc duy nhất chỉ áp cho một phần row thì không thể viết dưới dạng unique constraint, nhưng có thể áp đặt ràng buộc đó bằng cách tạo một unique partial index."

📖 **Nguyên văn**
> "In general, a unique constraint is violated if there is more than one row in the table where the values of all of the columns included in the constraint are equal. By default, two null values are not considered equal in this comparison. That means even in the presence of a unique constraint it is possible to store duplicate rows that contain a null value in at least one of the constrained columns. This behavior can be changed by adding the clause `NULLS NOT DISTINCT`, like"

🇻🇳 **Dịch**
> "Nói chung, một unique constraint bị vi phạm nếu có nhiều hơn một row trong table mà giá trị của tất cả column thuộc constraint đều bằng nhau. Mặc định, hai giá trị null *không* được coi là bằng nhau trong phép so sánh này. Nghĩa là ngay cả khi có unique constraint, vẫn có thể lưu các row trùng lặp chứa giá trị null ở ít nhất một trong các column bị ràng buộc. Hành vi này có thể thay đổi bằng cách thêm mệnh đề `NULLS NOT DISTINCT`, như:"

```sql
CREATE TABLE products (
    product_no integer UNIQUE NULLS NOT DISTINCT,
    name text,
    price numeric
);
```

🇻🇳 Khi đó hai giá trị null bị coi là trùng nhau và bị chặn.

---

## 12. Primary Keys

📖 **Nguyên văn**
> "A primary key constraint indicates that a column, or group of columns, can be used as a unique identifier for rows in the table. This requires that the values be both unique and not null. So, the following two table definitions accept the same data:"

🇻🇳 **Dịch**
> "Một primary key constraint chỉ ra rằng một column, hoặc nhóm column, có thể dùng làm định danh duy nhất cho các row trong table. Điều này đòi hỏi các giá trị vừa duy nhất vừa không null. Vậy nên, hai định nghĩa table sau chấp nhận cùng một tập dữ liệu:"

```sql
CREATE TABLE products (
    product_no integer UNIQUE NOT NULL,
    name text,
    price numeric
);
```

```sql
CREATE TABLE products (
    product_no integer PRIMARY KEY,
    name text,
    price numeric
);
```

🇻🇳 `PRIMARY KEY` = `UNIQUE` + `NOT NULL` gộp lại thành một khai báo.

📖 **Nguyên văn**
> "Primary keys can span more than one column; the syntax is similar to unique constraints:"

🇻🇳 **Dịch**
> "Primary key có thể trải trên nhiều column; cú pháp tương tự unique constraint:"

```sql
CREATE TABLE example (
    a integer,
    b integer,
    c integer,
    PRIMARY KEY (a, c)
);
```

🇻🇳 Primary key ghép (composite key) gồm hai column `a` và `c`.

📖 **Nguyên văn**
> "Adding a primary key will automatically create a unique B-tree index on the column or group of columns listed in the primary key, and will force the column(s) to be marked `NOT NULL`."
>
> "A table can have at most one primary key. (There can be any number of unique constraints, which combined with not-null constraints are functionally almost the same thing, but only one can be identified as the primary key.) Relational database theory dictates that every table must have a primary key. This rule is not enforced by PostgreSQL, but it is usually best to follow it."

🇻🇳 **Dịch**
> "Thêm primary key sẽ tự động tạo một unique B-tree index trên column hoặc nhóm column nằm trong primary key, và sẽ buộc các column đó được đánh dấu `NOT NULL`."
>
> "Một table có nhiều nhất một primary key. (Có thể có bao nhiêu unique constraint tùy ý, mà kết hợp với not-null constraint thì gần như tương đương về chức năng, nhưng chỉ một cái được xác định là primary key.) Lý thuyết relational database quy định rằng mọi table phải có primary key. PostgreSQL không áp đặt quy tắc này, nhưng thường tốt nhất là nên tuân theo."

📖 **Nguyên văn**
> "Primary keys are useful both for documentation purposes and for client applications. For example, a GUI application that allows modifying row values probably needs to know the primary key of a table to be able to identify rows uniquely. There are also various ways in which the database system makes use of a primary key if one has been declared; for example, the primary key defines the default target column(s) for foreign keys referencing its table."

🇻🇳 **Dịch**
> "Primary key hữu ích cả cho mục đích tài liệu hóa lẫn cho client application. Ví dụ, một ứng dụng GUI cho phép sửa giá trị row hẳn cần biết primary key của table để xác định row một cách duy nhất. Cũng có nhiều cách hệ database tận dụng primary key nếu nó đã được khai báo; ví dụ, primary key định nghĩa column đích mặc định cho các foreign key tham chiếu tới table đó."

---

## 13. Foreign Keys — trái tim của "relational"

📖 **Nguyên văn**
> "A foreign key constraint specifies that the values in a column (or a group of columns) must match the values appearing in some row of another table. We say this maintains the _referential integrity_ between two related tables."

🇻🇳 **Dịch**
> "Một foreign key constraint quy định rằng các giá trị trong một column (hoặc một nhóm column) phải khớp với các giá trị xuất hiện ở một row nào đó của table khác. Ta nói điều này duy trì *referential integrity* (toàn vẹn tham chiếu) giữa hai table có quan hệ."

💡 **Ví dụ đời sống**
Hãy nghĩ tới **sổ hộ khẩu và giấy khai sinh**. Giấy khai sinh của một đứa trẻ ghi tên bố mẹ — nhưng tên bố mẹ đó phải là người *có thật* trong sổ hộ tịch, không thể ghi bừa một cái tên không tồn tại. Foreign key chính là người cán bộ hộ tịch đứng ở cửa: mỗi lần bạn nộp giấy khai sinh mới, họ lật sổ gốc ra kiểm tra. Không tìm thấy người đó trong sổ → từ chối nhận hồ sơ.

*Referential integrity* là lời hứa: "mọi tham chiếu trong hệ thống này đều trỏ tới một thứ có thật". Nếu không có nó, database sẽ đầy những "đơn hàng của sản phẩm không tồn tại" — giống như giấy khai sinh ghi tên một người bố không có thật, giấy tờ vẫn còn nhưng vô nghĩa.

### 13.1 Ví dụ cơ bản

```sql
CREATE TABLE products (
    product_no integer PRIMARY KEY,
    name text,
    price numeric
);
```

🇻🇳 Table được tham chiếu (`products`), có primary key là `product_no`.

📖 **Nguyên văn**
> "Let's also assume you have a table storing orders of those products. We want to ensure that the orders table only contains orders of products that actually exist. So we define a foreign key constraint in the orders table that references the products table:"

🇻🇳 **Dịch**
> "Cũng giả sử bạn có một table lưu các đơn hàng của những sản phẩm đó. Ta muốn đảm bảo table orders chỉ chứa đơn hàng của các sản phẩm thực sự tồn tại. Nên ta định nghĩa một foreign key constraint trong table orders tham chiếu tới table products:"

```sql
CREATE TABLE orders (
    order_id integer PRIMARY KEY,
    product_no integer REFERENCES products (product_no),
    quantity integer
);
```

🇻🇳 `orders.product_no` bắt buộc phải trùng với một `products.product_no` đang tồn tại.

📖 **Nguyên văn**
> "Now it is impossible to create orders with non-NULL `product_no` entries that do not appear in the products table."
>
> "We say that in this situation the orders table is the _referencing_ table and the products table is the _referenced_ table. Similarly, there are referencing and referenced columns."

🇻🇳 **Dịch**
> "Giờ thì không thể tạo order với giá trị `product_no` khác NULL mà không xuất hiện trong table products."
>
> "Ta nói trong tình huống này table orders là table *referencing* (tham chiếu đi) và table products là table *referenced* (được tham chiếu). Tương tự, có column referencing và column referenced."

📖 **Nguyên văn**
> "You can also shorten the above command to:"

🇻🇳 **Dịch**
> "Bạn cũng có thể rút gọn lệnh trên thành:"

```sql
CREATE TABLE orders (
    order_id integer PRIMARY KEY,
    product_no integer REFERENCES products,
    quantity integer
);
```

🇻🇳 Bỏ danh sách column thì PostgreSQL tự dùng primary key của table được tham chiếu.

### 13.2 Foreign key nhiều column & self-referential

```sql
CREATE TABLE t1 (
  a integer PRIMARY KEY,
  b integer,
  c integer,
  FOREIGN KEY (b, c) REFERENCES other_table (c1, c2)
);
```

🇻🇳 Foreign key ghép: cặp `(b, c)` phải khớp cặp `(c1, c2)` bên `other_table`.

📖 **Nguyên văn**
> "Sometimes it is useful for the "other table" of a foreign key constraint to be the same table; this is called a _self-referential_ foreign key. For example, if you want rows of a table to represent nodes of a tree structure, you could write"

🇻🇳 **Dịch**
> "Đôi khi "table kia" của một foreign key constraint lại chính là cùng table đó; điều này gọi là foreign key *self-referential* (tự tham chiếu). Ví dụ, nếu bạn muốn các row của một table biểu diễn các node của cấu trúc cây, bạn có thể viết:"

```sql
CREATE TABLE tree (
    node_id integer PRIMARY KEY,
    parent_id integer REFERENCES tree,
    name text,
    ...
);
```

🇻🇳 Mỗi node trỏ tới node cha trong cùng table; node gốc có `parent_id` là NULL.

### 13.3 Quan hệ many-to-many

📖 **Nguyên văn**
> "A table can have more than one foreign key constraint. This is used to implement many-to-many relationships between tables. Say you have tables about products and orders, but now you want to allow one order to contain possibly many products (which the structure above did not allow). You could use this table structure:"

🇻🇳 **Dịch**
> "Một table có thể có nhiều hơn một foreign key constraint. Điều này được dùng để hiện thực quan hệ many-to-many giữa các table. Giả sử bạn có table về products và orders, nhưng giờ bạn muốn cho phép một order chứa nhiều product (cấu trúc ở trên không cho phép). Bạn có thể dùng cấu trúc table này:"

```sql
CREATE TABLE products (
    product_no integer PRIMARY KEY,
    name text,
    price numeric
);

CREATE TABLE orders (
    order_id integer PRIMARY KEY,
    shipping_address text,
    ...
);

CREATE TABLE order_items (
    product_no integer REFERENCES products,
    order_id integer REFERENCES orders,
    quantity integer,
    PRIMARY KEY (product_no, order_id)
);
```

🇻🇳 `order_items` là bảng trung gian: mỗi row nối một product với một order; primary key ghép `(product_no, order_id)` trùng luôn với hai foreign key.

📖 **Nguyên văn**
> "Notice that the primary key overlaps with the foreign keys in the last table."

🇻🇳 **Dịch**
> "Chú ý rằng primary key chồng lấn với các foreign key trong table cuối cùng."

### 13.4 ON DELETE — điều gì xảy ra khi row được tham chiếu bị xóa

📖 **Nguyên văn**
> "We know that the foreign keys disallow creation of orders that do not relate to any products. But what if a product is removed after an order is created that references it? SQL allows you to handle that as well. Intuitively, we have a few options:
>
> - Disallow deleting a referenced product
> - Delete the orders as well
> - Something else?"

🇻🇳 **Dịch**
> "Ta biết foreign key không cho phép tạo order không liên quan tới product nào. Nhưng nếu một product bị xóa *sau khi* đã có order tham chiếu tới nó thì sao? SQL cũng cho phép bạn xử lý điều đó. Một cách trực giác, ta có vài lựa chọn:
>
> - Không cho xóa product đang được tham chiếu
> - Xóa luôn các order
> - Hoặc cách gì khác?"

📖 **Nguyên văn**
> "To illustrate this, let's implement the following policy on the many-to-many relationship example above: when someone wants to remove a product that is still referenced by an order (via `order_items`), we disallow it. If someone removes an order, the order items are removed as well:"

🇻🇳 **Dịch**
> "Để minh họa, hãy hiện thực chính sách sau trên ví dụ quan hệ many-to-many ở trên: khi ai đó muốn xóa một product vẫn đang được một order tham chiếu (qua `order_items`), ta không cho phép. Nếu ai đó xóa một order, các order item cũng bị xóa theo:"

```sql
CREATE TABLE order_items (
    product_no integer REFERENCES products ON DELETE RESTRICT,
    order_id integer REFERENCES orders ON DELETE CASCADE,
    quantity integer,
    PRIMARY KEY (product_no, order_id)
);
```

🇻🇳 Xóa product → bị chặn (`RESTRICT`). Xóa order → các order item của nó bị xóa theo (`CASCADE`).

#### Các action đầy đủ

📖 **Nguyên văn**
> "The default `ON DELETE` action is `ON DELETE NO ACTION`; this does not need to be specified. This means that the deletion in the referenced table is allowed to proceed. But the foreign-key constraint is still required to be satisfied, so this operation will usually result in an error. But checking of foreign-key constraints can also be deferred to later in the transaction (not covered in this chapter). In that case, the `NO ACTION` setting would allow other commands to "fix" the situation before the constraint is checked, for example by inserting another suitable row into the referenced table or by deleting the now-dangling rows from the referencing table."

🇻🇳 **Dịch**
> "Action `ON DELETE` mặc định là `ON DELETE NO ACTION`; không cần khai báo. Nghĩa là việc xóa ở table được tham chiếu được phép tiến hành. Nhưng foreign-key constraint vẫn phải được thỏa mãn, nên thao tác này thường sẽ dẫn tới lỗi. Tuy nhiên việc kiểm tra foreign-key constraint cũng có thể được hoãn (defer) tới cuối transaction (không nói tới trong chương này). Khi đó, thiết lập `NO ACTION` cho phép các lệnh khác "sửa" tình huống trước khi constraint được kiểm tra, ví dụ bằng cách insert một row phù hợp khác vào table được tham chiếu hoặc xóa các row đang lơ lửng ở table tham chiếu."

📖 **Nguyên văn**
> "`RESTRICT` is a stricter setting than `NO ACTION`. It prevents deletion of a referenced row. `RESTRICT` does not allow the check to be deferred until later in the transaction."
>
> "`CASCADE` specifies that when a referenced row is deleted, row(s) referencing it should be automatically deleted as well."
>
> "There are two other options: `SET NULL` and `SET DEFAULT`. These cause the referencing column(s) in the referencing row(s) to be set to nulls or their default values, respectively, when the referenced row is deleted. Note that these do not excuse you from observing any constraints. For example, if an action specifies `SET DEFAULT` but the default value would not satisfy the foreign key constraint, the operation will fail."

🇻🇳 **Dịch**
> "`RESTRICT` là thiết lập chặt hơn `NO ACTION`. Nó ngăn việc xóa một row đang được tham chiếu. `RESTRICT` không cho phép hoãn việc kiểm tra tới cuối transaction."
>
> "`CASCADE` quy định rằng khi một row được tham chiếu bị xóa, các row tham chiếu tới nó cũng sẽ tự động bị xóa theo."
>
> "Có hai tùy chọn khác: `SET NULL` và `SET DEFAULT`. Chúng làm cho các column tham chiếu trong các row tham chiếu được đặt về null hoặc về giá trị default tương ứng, khi row được tham chiếu bị xóa. Lưu ý rằng điều này không miễn cho bạn khỏi việc tuân thủ các constraint khác. Ví dụ, nếu một action chỉ định `SET DEFAULT` nhưng giá trị default lại không thỏa mãn foreign key constraint, thao tác sẽ thất bại."

**Tóm tắt 5 action** (tổng hợp từ đoạn trích trên):

| Action | Khi row được tham chiếu bị xóa |
|---|---|
| `NO ACTION` (mặc định) | Cho phép xóa tiến hành, nhưng constraint vẫn phải thỏa → thường ra lỗi; có thể defer |
| `RESTRICT` | Chặn thẳng việc xóa, không cho defer |
| `CASCADE` | Xóa luôn các row đang tham chiếu |
| `SET NULL` | Đặt column tham chiếu về null |
| `SET DEFAULT` | Đặt column tham chiếu về giá trị default |

### 13.5 Chọn action nào?

📖 **Nguyên văn**
> "The appropriate choice of `ON DELETE` action depends on what kinds of objects the related tables represent. When the referencing table represents something that is a component of what is represented by the referenced table and cannot exist independently, then `CASCADE` could be appropriate. If the two tables represent independent objects, then `RESTRICT` or `NO ACTION` is more appropriate; an application that actually wants to delete both objects would then have to be explicit about this and run two delete commands. In the above example, order items are part of an order, and it is convenient if they are deleted automatically if an order is deleted. But products and orders are different things, and so making a deletion of a product automatically cause the deletion of some order items could be considered problematic. The actions `SET NULL` or `SET DEFAULT` can be appropriate if a foreign-key relationship represents optional information."

🇻🇳 **Dịch**
> "Lựa chọn action `ON DELETE` phù hợp phụ thuộc vào loại đối tượng mà các table liên quan biểu diễn. Khi table tham chiếu biểu diễn thứ gì đó là *thành phần* của thứ mà table được tham chiếu biểu diễn và không thể tồn tại độc lập, thì `CASCADE` có thể phù hợp. Nếu hai table biểu diễn các đối tượng độc lập, thì `RESTRICT` hoặc `NO ACTION` phù hợp hơn; một ứng dụng thực sự muốn xóa cả hai đối tượng khi đó phải nói rõ điều này và chạy hai lệnh delete. Trong ví dụ trên, order item là một phần của order, nên sẽ tiện nếu chúng bị xóa tự động khi order bị xóa. Nhưng product và order là hai thứ khác nhau, nên để việc xóa một product tự động kéo theo xóa một số order item có thể bị coi là có vấn đề. Các action `SET NULL` hoặc `SET DEFAULT` có thể phù hợp nếu quan hệ foreign key biểu diễn thông tin tùy chọn."

💡 **Ví dụ đời sống**
- `CASCADE` = **hủy một đơn hàng thì các dòng món trong đơn cũng biến mất**. Dòng món không có lý do tồn tại nếu không có đơn — giống các trang trong một cuốn sách, xé sách thì trang cũng đi theo.
- `RESTRICT` = **không cho xóa một sản phẩm khi vẫn còn đơn hàng đang mua nó**. Giống nhân viên kho từ chối ký lệnh hủy mã hàng khi kế toán báo "mã này còn trong hóa đơn tháng trước".
- `SET NULL` = **nhân viên phụ trách nghỉ việc, hồ sơ khách hàng không bị xóa mà chỉ để trống ô "người phụ trách"**. Thông tin đó là tùy chọn, mất đi không làm hồ sơ vô nghĩa.

### 13.6 ON UPDATE

📖 **Nguyên văn**
> "Analogous to `ON DELETE` there is also `ON UPDATE` which is invoked when a referenced column is changed (updated). The possible actions are the same, except that column lists cannot be specified for `SET NULL` and `SET DEFAULT`. In this case, `CASCADE` means that the updated values of the referenced column(s) should be copied into the referencing row(s). There is also a noticeable difference between `ON UPDATE NO ACTION` (the default) and `ON UPDATE RESTRICT`. The former will allow the update to proceed and the foreign-key constraint will be checked against the state after the update. The latter will prevent the update to run even if the state after the update would still satisfy the constraint."

🇻🇳 **Dịch**
> "Tương tự `ON DELETE` còn có `ON UPDATE`, được kích hoạt khi một column được tham chiếu bị thay đổi (update). Các action có thể dùng là như nhau, ngoại trừ việc không thể chỉ định danh sách column cho `SET NULL` và `SET DEFAULT`. Trong trường hợp này, `CASCADE` nghĩa là các giá trị mới của column được tham chiếu sẽ được sao chép vào các row tham chiếu. Cũng có một khác biệt đáng chú ý giữa `ON UPDATE NO ACTION` (mặc định) và `ON UPDATE RESTRICT`. Cái trước cho phép update tiến hành và foreign-key constraint sẽ được kiểm tra dựa trên trạng thái *sau* khi update. Cái sau ngăn update chạy ngay cả khi trạng thái sau update vẫn thỏa mãn constraint."

### 13.7 MATCH FULL và index

📖 **Nguyên văn**
> "Normally, a referencing row need not satisfy the foreign key constraint if any of its referencing columns are null. If `MATCH FULL` is added to the foreign key declaration, a referencing row escapes satisfying the constraint only if all its referencing columns are null (so a mix of null and non-null values is guaranteed to fail a `MATCH FULL` constraint). If you don't want referencing rows to be able to avoid satisfying the foreign key constraint, declare the referencing column(s) as `NOT NULL`."

🇻🇳 **Dịch**
> "Bình thường, một row tham chiếu không cần thỏa mãn foreign key constraint nếu bất kỳ column tham chiếu nào của nó là null. Nếu thêm `MATCH FULL` vào khai báo foreign key, một row tham chiếu chỉ thoát khỏi việc phải thỏa mãn constraint khi *tất cả* column tham chiếu của nó đều null (nên việc trộn lẫn giá trị null và không-null chắc chắn sẽ vi phạm constraint `MATCH FULL`). Nếu bạn không muốn các row tham chiếu có thể né việc thỏa mãn foreign key constraint, hãy khai báo các column tham chiếu là `NOT NULL`."

📖 **Nguyên văn**
> "A foreign key must reference columns that either are a primary key or form a unique constraint, or are columns from a non-partial unique index. This means that the referenced columns always have an index to allow efficient lookups on whether a referencing row has a match. Since a `DELETE` of a row from the referenced table or an `UPDATE` of a referenced column will require a scan of the referencing table for rows matching the old value, it is often a good idea to index the referencing columns too. Because this is not always needed, and there are many choices available on how to index, the declaration of a foreign key constraint does not automatically create an index on the referencing columns."

🇻🇳 **Dịch**
> "Một foreign key phải tham chiếu tới các column hoặc là primary key, hoặc tạo thành một unique constraint, hoặc là các column thuộc một unique index không phải partial. Nghĩa là các column được tham chiếu luôn có index để tra cứu hiệu quả xem một row tham chiếu có khớp hay không. Vì việc `DELETE` một row khỏi table được tham chiếu hoặc `UPDATE` một column được tham chiếu sẽ đòi hỏi quét table tham chiếu để tìm các row khớp giá trị cũ, nên thường nên index cả các column tham chiếu. Vì điều này không phải lúc nào cũng cần, và có nhiều lựa chọn về cách index, nên khai báo một foreign key constraint *không* tự động tạo index trên các column tham chiếu."

> [!tip]
> Điểm dễ bỏ sót trong thực tế: PostgreSQL tự tạo index cho **phía được tham chiếu**, nhưng **không** tự tạo cho phía tham chiếu. Bảng con (ví dụ `order_items.order_id`) thường cần bạn tự `CREATE INDEX`.

---

## 14. Exclusion Constraints

📖 **Nguyên văn**
> "Exclusion constraints ensure that if any two rows are compared on the specified columns or expressions using the specified operators, at least one of these operator comparisons will return false or null. The syntax is:"

🇻🇳 **Dịch**
> "Exclusion constraint đảm bảo rằng nếu so sánh hai row bất kỳ trên các column hoặc expression được chỉ định bằng các operator được chỉ định, thì ít nhất một trong các phép so sánh đó sẽ trả về false hoặc null. Cú pháp là:"

```sql
CREATE TABLE circles (
    c circle,
    EXCLUDE USING gist (c WITH &&)
);
```

🇻🇳 Không cho phép hai hình tròn trong table chồng lấn nhau (`&&` là operator "overlaps").

📖 **Nguyên văn**
> "Adding an exclusion constraint will automatically create an index of the type specified in the constraint declaration."

🇻🇳 **Dịch**
> "Thêm một exclusion constraint sẽ tự động tạo một index thuộc loại được chỉ định trong khai báo constraint."

---

## 🔌 Liên hệ stack thực tế

> Phần này là ghi chú riêng, KHÔNG trích từ tài liệu PostgreSQL.

Nếu bạn quen Firestore, điểm khác biệt lớn nhất của phần bài này nằm ở chỗ: các ràng buộc trên đây được **database tự áp đặt**. Trong PostgreSQL, một `NOT NULL` hay `FOREIGN KEY` là lời hứa mà engine giữ — không app nào, không script migration nào ghi sai được, vì lệnh sẽ báo lỗi ngay.

Firestore là document database schemaless: không có khái niệm column data type khai báo trước, không có foreign key constraint do engine kiểm. Khi một document trỏ tới document khác bằng một field ID, việc "ID đó có thật không" là trách nhiệm của code ứng dụng hoặc của security rules — không phải của database. Xóa document cha cũng không tự động xóa các document con: hành vi kiểu `ON DELETE CASCADE` phải tự viết (thường bằng Cloud Function hoặc batch write trong app).

Đó chính là cái giá và cái lợi của mô hình relational: bạn phải thiết kế schema trước, đổi lại bạn nhận được đảm bảo *referential integrity* miễn phí và tuyệt đối.

---

## Liên kết
- Bài trước: [[01 - Relational Database và PostgreSQL là gì]]
- Bài kế: [[03 - Queries - SELECT, JOIN, Aggregate]]

## Nguồn tham khảo
- PostgreSQL Documentation — 5.1. Table Basics : https://www.postgresql.org/docs/current/ddl-basics.html
- PostgreSQL Documentation — 5.2. Default Values : https://www.postgresql.org/docs/current/ddl-default.html
- PostgreSQL Documentation — 5.5. Constraints : https://www.postgresql.org/docs/current/ddl-constraints.html
- PostgreSQL Documentation — Chapter 8. Data Types : https://www.postgresql.org/docs/current/datatype.html
- PostgreSQL Documentation — 8.1. Numeric Types : https://www.postgresql.org/docs/current/datatype-numeric.html
- PostgreSQL Documentation — 8.3. Character Types : https://www.postgresql.org/docs/current/datatype-character.html
- PostgreSQL Documentation — 2.3. Creating a New Table : https://www.postgresql.org/docs/current/tutorial-table.html
