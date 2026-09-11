# 08 — INSERT, UPDATE, DELETE

> **Nguồn chính:** PostgreSQL 18 Documentation — *Chapter 6. Data Manipulation* — https://www.postgresql.org/docs/current/dml.html
> Bài này bám đúng 4 mục của chương 6 (`6.1 Inserting Data`, `6.2 Updating Data`, `6.3 Deleting Data`, `6.4 Returning Data from Modified Rows`), bổ sung phần `ON CONFLICT` (upsert) lấy từ trang tham chiếu lệnh `INSERT`.

---

## 0. Vì sao cần bài này — DDL vs DML

Các bài trước của phần 05 mới chỉ dạy hai việc:

- **Tạo cấu trúc** (DDL — Data Definition Language): `CREATE TABLE`, data type, constraint → [[02 - Tables, Data Types và Constraints]]
- **Đọc dữ liệu** (query): `SELECT`, `JOIN`, aggregate → [[03 - Queries - SELECT, JOIN, Aggregate]]

Còn **ghi dữ liệu** thì chưa. Đó chính là DML — Data Manipulation Language — nội dung của chương 6.

📖 **Nguyên văn** — *Chapter 6. Data Manipulation*
> "The previous chapter discussed how to create tables and other structures to hold your data. Now it is time to fill the tables with data. This chapter covers how to insert, update, and delete table data. The chapter after this will finally explain how to extract your long-lost data from the database."

🇻🇳 **Dịch**
> "Chương trước đã bàn về cách tạo table và các cấu trúc khác để chứa dữ liệu của bạn. Giờ là lúc đổ dữ liệu vào các table đó. Chương này nói về cách insert, update, và delete dữ liệu trong table. Chương sau đó sẽ giải thích cách lấy lại dữ liệu đã thất lạc từ lâu của bạn ra khỏi database."

Thứ tự trong tài liệu gốc là: Chapter 5 (tạo table) → **Chapter 6 (ghi dữ liệu)** → Chapter 7 (đọc dữ liệu). Bài 02 và 03 của mình đi theo thứ tự khác, nên bài 08 này là phần **lấp vào giữa**.

| Nhóm lệnh | Tên gọi | Ví dụ | Bài |
|---|---|---|---|
| Định nghĩa cấu trúc | DDL | `CREATE TABLE`, `ALTER TABLE` | [[02 - Tables, Data Types và Constraints]] |
| **Ghi dữ liệu** | **DML** | **`INSERT`, `UPDATE`, `DELETE`** | **bài này** |
| Đọc dữ liệu | Query | `SELECT` | [[03 - Queries - SELECT, JOIN, Aggregate]] |

---

## 1. INSERT — chèn dữ liệu

### 1.1. Nguyên tắc: chỉ chèn được nguyên một row

📖 **Nguyên văn** — *6.1. Inserting Data*
> "When a table is created, it contains no data. The first thing to do before a database can be of much use is to insert data. Data is inserted one row at a time. You can also insert more than one row in a single command, but it is not possible to insert something that is not a complete row. Even if you know only some column values, a complete row must be created."

🇻🇳 **Dịch**
> "Khi một table vừa được tạo, nó không chứa dữ liệu nào. Việc đầu tiên phải làm trước khi database trở nên hữu ích là insert dữ liệu vào. Dữ liệu được insert mỗi lần một row. Bạn cũng có thể insert nhiều hơn một row trong một lệnh duy nhất, nhưng không thể insert một thứ gì đó không phải là một row hoàn chỉnh. Ngay cả khi bạn chỉ biết giá trị của một vài column, một row hoàn chỉnh vẫn phải được tạo ra."

📖 **Nguyên văn** — *6.1. Inserting Data*
> "To create a new row, use the INSERT command. The command requires the table name and column values. For example, consider the products table from Chapter 5:"

🇻🇳 **Dịch**
> "Để tạo một row mới, dùng lệnh INSERT. Lệnh này cần tên table và các giá trị column. Ví dụ, xét table products từ Chapter 5:"

```sql
CREATE TABLE products (
    product_no integer,
    name text,
    price numeric
);
```

🇻🇳 Tạo table `products` gồm 3 column — đây là table mẫu dùng xuyên suốt cả chương 6.

### 1.2. Dạng cơ bản — VALUES theo đúng thứ tự column

📖 **Nguyên văn** — *6.1. Inserting Data*
> "An example command to insert a row would be:"

🇻🇳 **Dịch**
> "Một lệnh ví dụ để insert một row sẽ là:"

```sql
INSERT INTO products VALUES (1, 'Cheese', 9.99);
```

🇻🇳 Chèn một row với 3 giá trị, xếp đúng theo thứ tự column đã khai báo lúc `CREATE TABLE`.

📖 **Nguyên văn** — *6.1. Inserting Data*
> "The data values are listed in the order in which the columns appear in the table, separated by commas. Usually, the data values will be literals (constants), but scalar expressions are also allowed."

🇻🇳 **Dịch**
> "Các giá trị dữ liệu được liệt kê theo thứ tự mà các column xuất hiện trong table, ngăn cách bằng dấu phẩy. Thông thường các giá trị dữ liệu sẽ là literal (hằng số), nhưng scalar expression cũng được cho phép."

### 1.3. Liệt kê column rõ ràng — cách nên dùng

📖 **Nguyên văn** — *6.1. Inserting Data*
> "The above syntax has the drawback that you need to know the order of the columns in the table. To avoid this you can also list the columns explicitly. For example, both of the following commands have the same effect as the one above:"

🇻🇳 **Dịch**
> "Cú pháp ở trên có nhược điểm là bạn phải biết thứ tự của các column trong table. Để tránh điều đó, bạn cũng có thể liệt kê các column một cách rõ ràng. Ví dụ, cả hai lệnh sau đây đều cho kết quả giống hệt lệnh ở trên:"

```sql
INSERT INTO products (product_no, name, price) VALUES (1, 'Cheese', 9.99);
INSERT INTO products (name, price, product_no) VALUES ('Cheese', 9.99, 1);
```

🇻🇳 Hai lệnh tương đương nhau: khi đã ghi tên column thì **thứ tự liệt kê không còn quan trọng**, miễn là giá trị khớp với tên column tương ứng.

> [!tip] Tài liệu khuyến nghị luôn ghi tên column
> 📖 **Nguyên văn** — *6.1. Inserting Data*
> > "Many users consider it good practice to always list the column names."
>
> 🇻🇳 **Dịch**
> > "Nhiều người dùng coi việc luôn liệt kê tên column là một good practice."
>
> Lý do thực dụng: hôm nay ai đó `ALTER TABLE ... ADD COLUMN`, lệnh `INSERT ... VALUES` không ghi tên column của bạn sẽ lệch cột hoặc lỗi ngay — trong khi bản có ghi tên column vẫn chạy đúng.

### 1.4. Bỏ bớt column — DEFAULT tự điền

📖 **Nguyên văn** — *6.1. Inserting Data*
> "If you don't have values for all the columns, you can omit some of them. In that case, the columns will be filled with their default values. For example:"

🇻🇳 **Dịch**
> "Nếu bạn không có giá trị cho tất cả các column, bạn có thể bỏ qua một vài column. Trong trường hợp đó, các column sẽ được điền bằng giá trị default của chúng. Ví dụ:"

```sql
INSERT INTO products (product_no, name) VALUES (1, 'Cheese');
INSERT INTO products VALUES (1, 'Cheese');
```

🇻🇳 Cả hai lệnh chỉ cung cấp 2 giá trị; column `price` còn lại sẽ nhận giá trị default.

📖 **Nguyên văn** — *6.1. Inserting Data*
> "The second form is a PostgreSQL extension. It fills the columns from the left with as many values as are given, and the rest will be defaulted."

🇻🇳 **Dịch**
> "Dạng thứ hai là một PostgreSQL extension. Nó điền các column từ bên trái với số lượng giá trị được đưa vào, phần còn lại sẽ lấy giá trị default."

> [!warning] Dạng thứ hai không chuẩn SQL
> Tài liệu nói rõ đây là "a PostgreSQL extension" — tức database khác có thể không chấp nhận. Trang `INSERT` còn ghi thêm: *"Also, the case in which a column name list is omitted, but not all the columns are filled from the VALUES clause or query, is disallowed by the standard."* (Trường hợp bỏ qua danh sách tên column nhưng không phải mọi column đều được điền từ mệnh đề VALUES hoặc query là bị SQL standard cấm.)

📖 **Nguyên văn** — *6.1. Inserting Data*
> "For clarity, you can also request default values explicitly, for individual columns or for the entire row:"

🇻🇳 **Dịch**
> "Để rõ ràng hơn, bạn cũng có thể yêu cầu giá trị default một cách tường minh, cho từng column riêng lẻ hoặc cho toàn bộ row:"

```sql
INSERT INTO products (product_no, name, price) VALUES (1, 'Cheese', DEFAULT);
INSERT INTO products DEFAULT VALUES;
```

🇻🇳 Dòng 1: ghi thẳng từ khoá `DEFAULT` vào vị trí `price`. Dòng 2: `DEFAULT VALUES` tạo một row mà **mọi** column đều lấy giá trị default.

> Khái niệm `DEFAULT` của column đã được nói ở [[02 - Tables, Data Types và Constraints]].

### 1.5. Chèn nhiều row trong một lệnh

📖 **Nguyên văn** — *6.1. Inserting Data*
> "You can insert multiple rows in a single command:"

🇻🇳 **Dịch**
> "Bạn có thể insert nhiều row trong một lệnh duy nhất:"

```sql
INSERT INTO products (product_no, name, price) VALUES
    (1, 'Cheese', 9.99),
    (2, 'Bread', 1.99),
    (3, 'Milk', 2.99);
```

🇻🇳 Một lệnh `INSERT` duy nhất chèn 3 row — mỗi cặp ngoặc là một row.

> [!tip] Đây là cách chữa "N+1 khi ghi"
> [[07 - N+1 Problem]] nói về N+1 khi **đọc**. Vấn đề tương tự tồn tại khi **ghi**: gọi 1000 lệnh `INSERT` riêng lẻ tốn 1000 round-trip tới database. Gộp thành một lệnh multi-row `VALUES` là cách rẻ nhất để giảm số round-trip.

### 1.6. INSERT ... SELECT — chèn kết quả của một query

📖 **Nguyên văn** — *6.1. Inserting Data*
> "It is also possible to insert the result of a query (which might be no rows, one row, or many rows):"

🇻🇳 **Dịch**
> "Cũng có thể insert kết quả của một query (kết quả đó có thể là không row nào, một row, hoặc nhiều row):"

```sql
INSERT INTO products (product_no, name, price)
  SELECT product_no, name, price FROM new_products
    WHERE release_date = 'today';
```

🇻🇳 Lấy các row thoả điều kiện từ table `new_products` rồi chèn thẳng sang table `products`, không cần đưa dữ liệu về phía application.

📖 **Nguyên văn** — *6.1. Inserting Data*
> "This provides the full power of the SQL query mechanism (Chapter 7) for computing the rows to be inserted."

🇻🇳 **Dịch**
> "Điều này cho bạn toàn bộ sức mạnh của cơ chế query SQL (Chapter 7) để tính ra các row cần được insert."

Chapter 7 ở đây chính là nội dung đã học ở [[03 - Queries - SELECT, JOIN, Aggregate]] — nghĩa là mọi thứ `JOIN`, `WHERE`, `GROUP BY` đều dùng được ở vế `SELECT` này.

### 1.7. Chèn dữ liệu số lượng lớn — dùng COPY

📖 **Nguyên văn** — *6.1. Inserting Data*, khối `Tip`
> "When inserting a lot of data at the same time, consider using the COPY command. It is not as flexible as the INSERT command, but is more efficient. Refer to Section 14.4 for more information on improving bulk loading performance."

🇻🇳 **Dịch**
> "Khi insert một lượng lớn dữ liệu cùng lúc, hãy cân nhắc dùng lệnh COPY. Nó không linh hoạt bằng lệnh INSERT, nhưng hiệu quả hơn. Xem Section 14.4 để biết thêm về việc cải thiện performance khi bulk loading."

### 1.8. INSERT trả về gì

📖 **Nguyên văn** — trang `INSERT`, mục *Outputs*
> "On successful completion, an INSERT command returns a command tag of the form"

🇻🇳 **Dịch**
> "Khi hoàn thành thành công, một lệnh INSERT trả về một command tag có dạng"

```
INSERT oid count
```

🇻🇳 Command tag mà server trả về: `oid` luôn là `0`, `count` là số row đã chèn.

📖 **Nguyên văn** — trang `INSERT`, mục *Outputs*
> "The count is the number of rows inserted or updated. oid is always 0 (it used to be the OID assigned to the inserted row if count was exactly one and the target table was declared WITH OIDS and 0 otherwise, but creating a table WITH OIDS is not supported anymore)."

🇻🇳 **Dịch**
> "count là số row đã được insert hoặc update. oid luôn bằng 0 (trước đây nó là OID được gán cho row vừa insert nếu count đúng bằng một và table đích được khai báo WITH OIDS, còn lại là 0; nhưng việc tạo table WITH OIDS không còn được hỗ trợ nữa)."

---

## 2. UPDATE — sửa dữ liệu đã có

### 2.1. Ba thông tin bắt buộc

📖 **Nguyên văn** — *6.2. Updating Data*
> "The modification of data that is already in the database is referred to as updating. You can update individual rows, all the rows in a table, or a subset of all rows. Each column can be updated separately; the other columns are not affected."

🇻🇳 **Dịch**
> "Việc sửa đổi dữ liệu vốn đã nằm trong database được gọi là updating. Bạn có thể update từng row riêng lẻ, tất cả các row trong một table, hoặc một tập con của tất cả các row. Mỗi column có thể được update riêng; các column khác không bị ảnh hưởng."

📖 **Nguyên văn** — *6.2. Updating Data*
> "To update existing rows, use the UPDATE command. This requires three pieces of information:
> >
> > The name of the table and column to update
> >
> > The new value of the column
> >
> > Which row(s) to update"

🇻🇳 **Dịch**
> "Để update các row đã tồn tại, dùng lệnh UPDATE. Lệnh này cần ba mẩu thông tin:
> >
> > Tên của table và column cần update
> >
> > Giá trị mới của column
> >
> > (Các) row nào cần update"

### 2.2. Không có "địa chỉ row" — chỉ có điều kiện

📖 **Nguyên văn** — *6.2. Updating Data*
> "Recall from Chapter 5 that SQL does not, in general, provide a unique identifier for rows. Therefore it is not always possible to directly specify which row to update. Instead, you specify which conditions a row must meet in order to be updated. Only if you have a primary key in the table (independent of whether you declared it or not) can you reliably address individual rows by choosing a condition that matches the primary key. Graphical database access tools rely on this fact to allow you to update rows individually."

🇻🇳 **Dịch**
> "Nhớ lại từ Chapter 5 rằng SQL nói chung không cung cấp một unique identifier cho các row. Do đó không phải lúc nào cũng có thể chỉ định trực tiếp row nào cần update. Thay vào đó, bạn chỉ định những điều kiện mà một row phải thoả mãn để được update. Chỉ khi bạn có một primary key trong table (bất kể bạn có khai báo nó hay không) thì bạn mới có thể trỏ tới từng row riêng lẻ một cách đáng tin cậy, bằng cách chọn một điều kiện khớp với primary key đó. Các công cụ truy cập database dạng đồ hoạ dựa vào chính điều này để cho phép bạn update từng row một."

💡 **Ví dụ đời sống**
Database giống một kho hàng **không đánh số kệ**. Bạn không thể nói "sửa cái hộp thứ 47", bạn chỉ có thể nói "sửa mọi hộp màu đỏ nặng dưới 2kg". Nếu trong kho có một nhãn duy nhất không trùng — mã vạch chẳng hạn (chính là primary key) — thì câu "sửa hộp có mã vạch X" mới chắc chắn chạm đúng một hộp.

> Primary key đã được giải thích ở [[02 - Tables, Data Types và Constraints]].

### 2.3. Ví dụ cơ bản

📖 **Nguyên văn** — *6.2. Updating Data*
> "For example, this command updates all products that have a price of 5 to have a price of 10:"

🇻🇳 **Dịch**
> "Ví dụ, lệnh này update tất cả product có price bằng 5 thành price bằng 10:"

```sql
UPDATE products SET price = 10 WHERE price = 5;
```

🇻🇳 Đổi `price` từ 5 thành 10 cho mọi row thoả điều kiện `WHERE`.

📖 **Nguyên văn** — *6.2. Updating Data*
> "This might cause zero, one, or many rows to be updated. It is not an error to attempt an update that does not match any rows."

🇻🇳 **Dịch**
> "Việc này có thể khiến không row nào, một row, hoặc nhiều row được update. Thực hiện một lệnh update không khớp với row nào thì không phải là lỗi."

> [!note] "Không khớp row nào" không phải lỗi
> Đây là chi tiết hay bị bỏ sót. Nếu code của bạn cần biết row có thực sự tồn tại hay không, **phải tự kiểm tra `count`** trả về (xem mục 2.6) hoặc dùng `RETURNING` (mục 4) — database sẽ không ném lỗi giúp bạn.

### 2.4. Giá trị mới có thể là biểu thức — và cảnh báo thiếu WHERE

📖 **Nguyên văn** — *6.2. Updating Data*
> "Let's look at that command in detail. First is the key word UPDATE followed by the table name. As usual, the table name can be schema-qualified, otherwise it is looked up in the path. Next is the key word SET followed by the column name, an equal sign, and the new column value. The new column value can be any scalar expression, not just a constant. For example, if you want to raise the price of all products by 10% you could use:"

🇻🇳 **Dịch**
> "Hãy xem lệnh đó chi tiết hơn. Đầu tiên là từ khoá UPDATE theo sau bởi tên table. Như thường lệ, tên table có thể kèm schema, nếu không thì nó được tra trong path. Tiếp theo là từ khoá SET theo sau bởi tên column, một dấu bằng, và giá trị column mới. Giá trị column mới có thể là bất kỳ scalar expression nào, không chỉ là một hằng số. Ví dụ, nếu bạn muốn tăng price của tất cả product lên 10% thì bạn có thể dùng:"

```sql
UPDATE products SET price = price * 1.10;
```

🇻🇳 Nhân `price` hiện tại lên 1.10 — **không có `WHERE`, nên áp dụng cho toàn bộ table**.

> [!danger] UPDATE không có WHERE sửa TOÀN BỘ table
> 📖 **Nguyên văn** — *6.2. Updating Data*
> > "As you see, the expression for the new value can refer to the existing value(s) in the row. We also left out the WHERE clause. If it is omitted, it means that all rows in the table are updated. If it is present, only those rows that match the WHERE condition are updated."
>
> 🇻🇳 **Dịch**
> > "Như bạn thấy, biểu thức cho giá trị mới có thể tham chiếu tới (các) giá trị đang có trong row. Chúng ta cũng đã bỏ đi mệnh đề WHERE. Nếu nó bị bỏ qua, điều đó có nghĩa là **tất cả các row trong table đều bị update**. Nếu nó có mặt, chỉ những row khớp với điều kiện WHERE mới được update."
>
> Một dấu chấm phẩy gõ sớm trước khi kịp viết `WHERE` là đủ để ghi đè cả bảng. Xem mục 6 — bọc trong transaction để còn `ROLLBACK` được.

📖 **Nguyên văn** — *6.2. Updating Data*
> "Note that the equals sign in the SET clause is an assignment while the one in the WHERE clause is a comparison, but this does not create any ambiguity. Of course, the WHERE condition does not have to be an equality test. Many other operators are available (see Chapter 9). But the expression needs to evaluate to a Boolean result."

🇻🇳 **Dịch**
> "Lưu ý rằng dấu bằng trong mệnh đề SET là một phép gán trong khi dấu bằng trong mệnh đề WHERE là một phép so sánh, nhưng điều này không tạo ra sự nhập nhằng nào. Tất nhiên, điều kiện WHERE không nhất thiết phải là một phép kiểm tra bằng nhau. Nhiều operator khác cũng có sẵn (xem Chapter 9). Nhưng biểu thức cần phải cho ra kết quả kiểu Boolean."

### 2.5. Cập nhật nhiều column cùng lúc

📖 **Nguyên văn** — *6.2. Updating Data*
> "You can update more than one column in an UPDATE command by listing more than one assignment in the SET clause. For example:"

🇻🇳 **Dịch**
> "Bạn có thể update nhiều hơn một column trong một lệnh UPDATE bằng cách liệt kê nhiều phép gán trong mệnh đề SET. Ví dụ:"

```sql
UPDATE mytable SET a = 5, b = 3, c = 1 WHERE a > 0;
```

🇻🇳 Gán giá trị mới cho 3 column `a`, `b`, `c` trong cùng một lệnh, chỉ với các row có `a > 0`.

Trang tham chiếu `UPDATE` còn cho phép dạng gán theo nhóm column:

```sql
UPDATE weather SET (temp_lo, temp_hi, prcp) = (temp_lo+1, temp_lo+15, DEFAULT)
  WHERE city = 'San Francisco' AND date = '2003-07-03';
```

🇻🇳 Dạng "column-list assignment": gán một lúc 3 column bằng một bộ giá trị tương ứng, `prcp` lấy giá trị `DEFAULT`.

📖 **Nguyên văn** — trang `UPDATE`, mục *Description*
> "UPDATE changes the values of the specified columns in all rows that satisfy the condition. Only the columns to be modified need be mentioned in the SET clause; columns not explicitly modified retain their previous values."

🇻🇳 **Dịch**
> "UPDATE thay đổi giá trị của các column được chỉ định trong tất cả các row thoả mãn điều kiện. Chỉ những column cần sửa mới phải được nhắc tới trong mệnh đề SET; các column không được sửa một cách tường minh sẽ giữ nguyên giá trị trước đó."

### 2.6. UPDATE trả về gì

📖 **Nguyên văn** — trang `UPDATE`, mục *Outputs*
> "The count is the number of rows updated, including matched rows whose values did not change. Note that the number may be less than the number of rows that matched the condition when updates were suppressed by a BEFORE UPDATE trigger. If count is 0, no rows were updated by the query (this is not considered an error)."

🇻🇳 **Dịch**
> "count là số row đã được update, bao gồm cả những row khớp điều kiện nhưng giá trị không thay đổi. Lưu ý rằng con số này có thể nhỏ hơn số row khớp điều kiện khi các update bị chặn bởi một BEFORE UPDATE trigger. Nếu count bằng 0, không row nào được update bởi query này (điều đó không bị coi là lỗi)."

```
UPDATE count
```

🇻🇳 Command tag của `UPDATE`: chỉ có một con số — số row đã update.

---

## 3. DELETE — xoá dữ liệu

### 3.1. Chỉ xoá được nguyên row, và chỉ bằng điều kiện

📖 **Nguyên văn** — *6.3. Deleting Data*
> "So far we have explained how to add data to tables and how to change data. What remains is to discuss how to remove data that is no longer needed. Just as adding data is only possible in whole rows, you can only remove entire rows from a table. In the previous section we explained that SQL does not provide a way to directly address individual rows. Therefore, removing rows can only be done by specifying conditions that the rows to be removed have to match. If you have a primary key in the table then you can specify the exact row. But you can also remove groups of rows matching a condition, or you can remove all rows in the table at once."

🇻🇳 **Dịch**
> "Tới đây chúng ta đã giải thích cách thêm dữ liệu vào table và cách thay đổi dữ liệu. Việc còn lại là bàn cách gỡ bỏ dữ liệu không còn cần thiết. Cũng giống như việc thêm dữ liệu chỉ có thể làm theo nguyên row, bạn cũng chỉ có thể gỡ bỏ nguyên row khỏi một table. Ở mục trước chúng ta đã giải thích rằng SQL không cung cấp cách trỏ trực tiếp tới từng row riêng lẻ. Do đó, việc gỡ bỏ row chỉ có thể làm bằng cách chỉ định các điều kiện mà những row cần gỡ phải khớp. Nếu bạn có một primary key trong table thì bạn có thể chỉ định chính xác row đó. Nhưng bạn cũng có thể gỡ bỏ nhóm các row khớp một điều kiện, hoặc gỡ bỏ tất cả các row trong table cùng một lúc."

### 3.2. Cú pháp

📖 **Nguyên văn** — *6.3. Deleting Data*
> "You use the DELETE command to remove rows; the syntax is very similar to the UPDATE command. For instance, to remove all rows from the products table that have a price of 10, use:"

🇻🇳 **Dịch**
> "Bạn dùng lệnh DELETE để gỡ bỏ các row; cú pháp rất giống lệnh UPDATE. Ví dụ, để gỡ bỏ tất cả các row trong table products có price bằng 10, dùng:"

```sql
DELETE FROM products WHERE price = 10;
```

🇻🇳 Xoá mọi row có `price = 10`. Các row khác không bị đụng tới.

### 3.3. ⚠️ DELETE không có WHERE

> [!danger] DELETE không WHERE xoá sạch bảng — "Caveat programmer"
> 📖 **Nguyên văn** — *6.3. Deleting Data*
> > "If you simply write:"
>
> 🇻🇳 **Dịch**
> > "Nếu bạn chỉ đơn giản viết:"
>
> ```sql
> DELETE FROM products;
> ```
>
> 🇻🇳 Lệnh này **xoá toàn bộ row** trong table `products`.
>
> 📖 **Nguyên văn** — *6.3. Deleting Data*
> > "then all rows in the table will be deleted! Caveat programmer."
>
> 🇻🇳 **Dịch**
> > "thì tất cả các row trong table sẽ bị xoá! Lập trình viên hãy coi chừng."
>
> (*"Caveat programmer"* là cách chơi chữ từ thành ngữ Latin *caveat emptor* — "người mua hãy coi chừng".)

📖 **Nguyên văn** — trang `DELETE`, mục *Description*
> "DELETE deletes rows that satisfy the WHERE clause from the specified table. If the WHERE clause is absent, the effect is to delete all rows in the table. The result is a valid, but empty table."

🇻🇳 **Dịch**
> "DELETE xoá khỏi table được chỉ định những row thoả mãn mệnh đề WHERE. Nếu mệnh đề WHERE vắng mặt, tác dụng là xoá tất cả các row trong table. Kết quả là một table hợp lệ, nhưng rỗng."

Chú ý cách diễn đạt: table **vẫn tồn tại**, chỉ rỗng. Muốn xoá cả cấu trúc thì dùng `DROP TABLE` — đó là DDL, xem [[02 - Tables, Data Types và Constraints]].

> [!tip] Xoá sạch bảng thì có lệnh nhanh hơn
> 📖 **Nguyên văn** — trang `DELETE`, khối `Tip`
> > "TRUNCATE provides a faster mechanism to remove all rows from a table."
>
> 🇻🇳 **Dịch**
> > "TRUNCATE cung cấp một cơ chế nhanh hơn để gỡ bỏ tất cả các row khỏi một table."

### 3.4. Xoá dựa trên dữ liệu ở table khác

📖 **Nguyên văn** — trang `DELETE`, mục *Notes*
> "PostgreSQL lets you reference columns of other tables in the WHERE condition by specifying the other tables in the USING clause. For example, to delete all films produced by a given producer, one can do:"

🇻🇳 **Dịch**
> "PostgreSQL cho phép bạn tham chiếu tới column của các table khác trong điều kiện WHERE bằng cách chỉ định các table đó trong mệnh đề USING. Ví dụ, để xoá tất cả film được sản xuất bởi một producer nào đó, có thể làm:"

```sql
DELETE FROM films USING producers
  WHERE producer_id = producers.id AND producers.name = 'foo';
```

🇻🇳 Xoá các row trong `films` bằng cách join sang `producers` qua mệnh đề `USING`.

📖 **Nguyên văn** — trang `DELETE`, mục *Notes*
> "What is essentially happening here is a join between films and producers, with all successfully joined films rows being marked for deletion. This syntax is not standard. A more standard way to do it is:"

🇻🇳 **Dịch**
> "Cái thực sự diễn ra ở đây là một join giữa films và producers, với tất cả các row films join thành công đều bị đánh dấu để xoá. Cú pháp này không chuẩn. Cách chuẩn hơn để làm điều đó là:"

```sql
DELETE FROM films
  WHERE producer_id IN (SELECT id FROM producers WHERE name = 'foo');
```

🇻🇳 Cùng kết quả, nhưng dùng subquery `IN (...)` — chuẩn SQL, chạy được trên database khác.

📖 **Nguyên văn** — trang `DELETE`, mục *Notes*
> "In some cases the join style is easier to write or faster to execute than the sub-select style."

🇻🇳 **Dịch**
> "Trong một số trường hợp, kiểu join dễ viết hơn hoặc chạy nhanh hơn kiểu sub-select."

> `JOIN` và subquery đã học ở [[03 - Queries - SELECT, JOIN, Aggregate]].

### 3.5. DELETE trả về gì

📖 **Nguyên văn** — trang `DELETE`, mục *Outputs*
> "The count is the number of rows deleted. Note that the number may be less than the number of rows that matched the condition when deletes were suppressed by a BEFORE DELETE trigger. If count is 0, no rows were deleted by the query (this is not considered an error)."

🇻🇳 **Dịch**
> "count là số row đã bị xoá. Lưu ý rằng con số này có thể nhỏ hơn số row khớp điều kiện khi các lệnh xoá bị chặn bởi một BEFORE DELETE trigger. Nếu count bằng 0, không row nào bị xoá bởi query này (điều đó không bị coi là lỗi)."

---

## 4. RETURNING — lấy dữ liệu ngay từ lệnh ghi

> [!tip] Đây là tính năng đáng nhớ nhất của bài này
> Rất nhiều người viết `INSERT` rồi `SELECT` lại để lấy `id` vừa sinh ra. Không cần. `RETURNING` làm cả hai việc trong **một round-trip**, và quan trọng hơn: nó **chính xác** ngay cả khi có nhiều session ghi đồng thời.

### 4.1. RETURNING là gì

📖 **Nguyên văn** — *6.4. Returning Data from Modified Rows*
> "Sometimes it is useful to obtain data from modified rows while they are being manipulated. The INSERT, UPDATE, DELETE, and MERGE commands all have an optional RETURNING clause that supports this. Use of RETURNING avoids performing an extra database query to collect the data, and is especially valuable when it would otherwise be difficult to identify the modified rows reliably."

🇻🇳 **Dịch**
> "Đôi khi việc lấy dữ liệu từ các row đã bị sửa đổi ngay trong lúc chúng đang được thao tác là hữu ích. Các lệnh INSERT, UPDATE, DELETE, và MERGE đều có một mệnh đề RETURNING tuỳ chọn hỗ trợ điều này. Việc dùng RETURNING tránh phải thực hiện thêm một query nữa tới database để thu thập dữ liệu, và **đặc biệt có giá trị khi nếu không có nó thì sẽ khó xác định các row đã bị sửa đổi một cách đáng tin cậy**."

📖 **Nguyên văn** — *6.4. Returning Data from Modified Rows*
> "The allowed contents of a RETURNING clause are the same as a SELECT command's output list (see Section 7.3). It can contain column names of the command's target table, or value expressions using those columns. A common shorthand is RETURNING *, which selects all columns of the target table in order."

🇻🇳 **Dịch**
> "Nội dung được phép trong một mệnh đề RETURNING giống hệt danh sách output của lệnh SELECT (xem Section 7.3). Nó có thể chứa tên column của table đích của lệnh, hoặc các value expression dùng những column đó. Một cách viết tắt phổ biến là RETURNING *, tức chọn tất cả các column của table đích theo thứ tự."

💡 **Ví dụ đời sống**
`RETURNING` chính là **tờ hoá đơn ở quầy thu ngân**.

- **Không có RETURNING:** bạn đưa hàng cho thu ngân, trả tiền, đi ra — rồi quay lại quầy hỏi "vừa nãy tôi mua hết bao nhiêu, mã đơn số mấy?". Nhân viên phải lục lại sổ. Tệ hơn: lúc đó có 5 người khác cũng vừa mua, bạn phải mô tả "tôi mua lúc 3 giờ 12, hai hộp sữa" để họ dò đúng đơn của bạn — và vẫn có thể dò nhầm.
- **Có RETURNING:** thu ngân **in hoá đơn đưa ngay tại chỗ**, ghi rõ mã đơn, tổng tiền. Một lần giao dịch, không phải quay lại, không thể nhầm với đơn của người khác.

Cái "không thể nhầm với đơn của người khác" chính là ý *"difficult to identify the modified rows reliably"* trong tài liệu.

### 4.2. INSERT ... RETURNING — lấy id vừa sinh

📖 **Nguyên văn** — *6.4. Returning Data from Modified Rows*
> "In an INSERT, the default data available to RETURNING is the row as it was inserted. This is not so useful in trivial inserts, since it would just repeat the data provided by the client. But it can be very handy when relying on computed default values. For example, when using a serial column to provide unique identifiers, RETURNING can return the ID assigned to a new row:"

🇻🇳 **Dịch**
> "Trong một lệnh INSERT, dữ liệu mặc định mà RETURNING có được là chính row vừa được insert. Điều này không hữu ích lắm với các lệnh insert tầm thường, vì nó chỉ lặp lại dữ liệu do client cung cấp. Nhưng nó có thể rất tiện khi bạn dựa vào các giá trị default được tính toán. Ví dụ, khi dùng một column serial để cấp unique identifier, RETURNING có thể trả về ID đã được gán cho row mới:"

```sql
CREATE TABLE users (firstname text, lastname text, id serial primary key);

INSERT INTO users (firstname, lastname) VALUES ('Joe', 'Cool') RETURNING id;
```

🇻🇳 Tạo table có column `id serial primary key` (tự tăng), rồi insert một row và **lấy luôn giá trị `id` mà database vừa sinh ra** — không cần query lại.

📖 **Nguyên văn** — *6.4. Returning Data from Modified Rows*
> "The RETURNING clause is also very useful with INSERT ... SELECT."

🇻🇳 **Dịch**
> "Mệnh đề RETURNING cũng rất hữu ích với INSERT ... SELECT."

### 4.3. UPDATE ... RETURNING

📖 **Nguyên văn** — *6.4. Returning Data from Modified Rows*
> "In an UPDATE, the default data available to RETURNING is the new content of the modified row. For example:"

🇻🇳 **Dịch**
> "Trong một lệnh UPDATE, dữ liệu mặc định mà RETURNING có được là nội dung **mới** của row đã bị sửa đổi. Ví dụ:"

```sql
UPDATE products SET price = price * 1.10
  WHERE price <= 99.99
  RETURNING name, price AS new_price;
```

🇻🇳 Tăng giá 10% cho các product có giá ≤ 99.99, đồng thời trả về tên và **giá mới** của từng row vừa sửa.

### 4.4. DELETE ... RETURNING

📖 **Nguyên văn** — *6.4. Returning Data from Modified Rows*
> "In a DELETE, the default data available to RETURNING is the content of the deleted row. For example:"

🇻🇳 **Dịch**
> "Trong một lệnh DELETE, dữ liệu mặc định mà RETURNING có được là nội dung của row đã bị xoá. Ví dụ:"

```sql
DELETE FROM products
  WHERE obsoletion_date = 'today'
  RETURNING *;
```

🇻🇳 Xoá các product hết hạn và trả về **toàn bộ nội dung** các row vừa bị xoá — cực hữu ích để ghi vào bảng audit/log.

Trang tham chiếu `DELETE` có ví dụ tương tự:

```sql
DELETE FROM tasks WHERE status = 'DONE' RETURNING *;
```

🇻🇳 Xoá các task đã xong, trả về đầy đủ chi tiết của các row bị xoá.

### 4.5. Lấy cả giá trị cũ và giá trị mới

📖 **Nguyên văn** — *6.4. Returning Data from Modified Rows*
> "In each of these commands, it is also possible to explicitly return the old and new content of the modified row. For example:"

🇻🇳 **Dịch**
> "Trong mỗi lệnh kể trên, cũng có thể trả về một cách tường minh nội dung **cũ** và **mới** của row đã bị sửa đổi. Ví dụ:"

```sql
UPDATE products SET price = price * 1.10
  WHERE price <= 99.99
  RETURNING name, old.price AS old_price, new.price AS new_price,
            new.price - old.price AS price_change;
```

🇻🇳 Trả về cùng lúc giá cũ (`old.price`), giá mới (`new.price`), và phần chênh lệch — một lệnh duy nhất đủ dữ liệu để ghi lịch sử thay đổi.

📖 **Nguyên văn** — *6.4. Returning Data from Modified Rows*
> "In this example, writing new.price is the same as just writing price, but it makes the meaning clearer."

🇻🇳 **Dịch**
> "Trong ví dụ này, viết new.price cũng giống như chỉ viết price, nhưng nó làm cho ý nghĩa rõ ràng hơn."

📖 **Nguyên văn** — *6.4. Returning Data from Modified Rows*
> "This syntax for returning old and new values is available in INSERT, UPDATE, DELETE, and MERGE commands, but typically old values will be NULL for an INSERT, and new values will be NULL for a DELETE. However, there are situations where it can still be useful for those commands. For example, in an INSERT with an ON CONFLICT DO UPDATE clause, the old values will be non-NULL for conflicting rows. Similarly, if a DELETE is turned into an UPDATE by a rewrite rule, the new values may be non-NULL."

🇻🇳 **Dịch**
> "Cú pháp trả về giá trị cũ và mới này có sẵn trong các lệnh INSERT, UPDATE, DELETE, và MERGE, nhưng thông thường giá trị cũ sẽ là NULL với một lệnh INSERT, và giá trị mới sẽ là NULL với một lệnh DELETE. Tuy nhiên, vẫn có những tình huống nó hữu ích cho các lệnh đó. Ví dụ, trong một lệnh INSERT có mệnh đề ON CONFLICT DO UPDATE, giá trị cũ sẽ khác NULL với các row bị conflict. Tương tự, nếu một lệnh DELETE bị một rewrite rule biến thành UPDATE, giá trị mới có thể khác NULL."

### 4.6. RETURNING và trigger

📖 **Nguyên văn** — *6.4. Returning Data from Modified Rows*
> "If there are triggers (Chapter 37) on the target table, the data available to RETURNING is the row as modified by the triggers. Thus, inspecting columns computed by triggers is another common use-case for RETURNING."

🇻🇳 **Dịch**
> "Nếu có các trigger (Chapter 37) trên table đích, dữ liệu mà RETURNING có được là row **sau khi đã bị các trigger sửa đổi**. Do đó, việc xem các column được tính bởi trigger là một use-case phổ biến khác của RETURNING."

---

## 5. ON CONFLICT — upsert (INSERT hoặc UPDATE)

> Phần này lấy từ trang tham chiếu lệnh `INSERT`, không nằm trong chương 6 giới thiệu.

### 5.1. Vị trí trong cú pháp

📖 **Nguyên văn** — trang `INSERT`, mục *Synopsis*

```
[ WITH [ RECURSIVE ] with_query [, ...] ]
INSERT INTO table_name [ AS alias ] [ ( column_name [, ...] ) ]
    [ OVERRIDING { SYSTEM | USER } VALUE ]
    { DEFAULT VALUES | VALUES ( { expression | DEFAULT } [, ...] ) [, ...] | query }
    [ ON CONFLICT [ conflict_target ] conflict_action ]
    [ RETURNING [ WITH ( { OLD | NEW } AS output_alias [, ...] ) ]
                { * | output_expression [ [ AS ] output_name ] } [, ...] ]

where conflict_target can be one of:

    ( { index_column_name | ( index_expression ) } [ COLLATE collation ] [ opclass ] [, ...] ) [ WHERE index_predicate ]
    ON CONSTRAINT constraint_name

and conflict_action is one of:

    DO NOTHING
    DO UPDATE SET { column_name = { expression | DEFAULT } |
                    ( column_name [, ...] ) = [ ROW ] ( { expression | DEFAULT } [, ...] ) |
                    ( column_name [, ...] ) = ( sub-SELECT )
                  } [, ...]
              [ WHERE condition ]
```

🇻🇳 Sơ đồ cú pháp đầy đủ của `INSERT`: `ON CONFLICT` đứng sau phần `VALUES`/query và trước `RETURNING`; nó gồm hai phần — *conflict_target* (conflict ở đâu) và *conflict_action* (`DO NOTHING` hoặc `DO UPDATE`).

### 5.2. ON CONFLICT giải quyết vấn đề gì

📖 **Nguyên văn** — trang `INSERT`, mục *ON CONFLICT Clause*
> "The optional ON CONFLICT clause specifies an alternative action to raising a unique violation or exclusion constraint violation error. For each individual row proposed for insertion, either the insertion proceeds, or, if an arbiter constraint or index specified by conflict_target is violated, the alternative conflict_action is taken. ON CONFLICT DO NOTHING simply avoids inserting a row as its alternative action. ON CONFLICT DO UPDATE updates the existing row that conflicts with the row proposed for insertion as its alternative action."

🇻🇳 **Dịch**
> "Mệnh đề ON CONFLICT tuỳ chọn chỉ định một hành động thay thế cho việc ném ra lỗi unique violation hoặc exclusion constraint violation. Với từng row được đề xuất insert, hoặc là việc insert diễn ra bình thường, hoặc là — nếu một arbiter constraint hay index được chỉ định bởi conflict_target bị vi phạm — hành động thay thế conflict_action sẽ được thực hiện. ON CONFLICT DO NOTHING đơn giản là bỏ qua việc insert row đó như hành động thay thế của nó. ON CONFLICT DO UPDATE update chính row đang tồn tại bị conflict với row được đề xuất insert, như hành động thay thế của nó."

📖 **Nguyên văn** — trang `INSERT`, mục *ON CONFLICT Clause*
> "ON CONFLICT DO UPDATE guarantees an atomic INSERT or UPDATE outcome; provided there is no independent error, one of those two outcomes is guaranteed, even under high concurrency. This is also known as UPSERT — “UPDATE or INSERT”."

🇻🇳 **Dịch**
> "ON CONFLICT DO UPDATE đảm bảo một kết cục INSERT hoặc UPDATE mang tính atomic; với điều kiện không có lỗi độc lập nào khác, một trong hai kết cục đó được đảm bảo, **kể cả dưới mức đồng thời (concurrency) cao**. Điều này còn được gọi là UPSERT — “UPDATE or INSERT”."

💡 **Ví dụ đời sống**
Upsert là **ghi tên vào sổ điểm danh ở cửa lớp**.

- **Cách thủ công (đọc rồi ghi):** bạn dò cả trang sổ xem tên mình đã có chưa; nếu chưa thì viết thêm dòng mới, nếu có rồi thì sửa dòng cũ. Vấn đề: giữa lúc bạn *dò xong* và lúc bạn *hạ bút viết*, người đứng sau cũng vừa dò xong và cũng viết tên bạn vào (hai người cùng cầm hộ giúp). Kết quả: **hai dòng trùng tên**. Đây chính xác là race condition của cặp `SELECT` rồi `INSERT` trong code.
- **Cách upsert:** bạn đưa phiếu cho **một người gác cửa duy nhất** và nói: "ghi tên tôi; nếu đã có rồi thì cập nhật giờ vào lớp". Người đó làm cả hai bước liền một mạch, không ai chen được vào giữa.

Cụm *"even under high concurrency"* trong tài liệu chính là người gác cửa đó. Đây là lý do upsert **không thể thay thế được** bằng `SELECT` rồi `INSERT` trong code application.

### 5.3. conflict_target — bắt buộc hay không

📖 **Nguyên văn** — trang `INSERT`, mục *ON CONFLICT Clause*, tham số `conflict_target`
> "Specifies which conflicts ON CONFLICT takes the alternative action on by choosing arbiter indexes. Either performs unique index inference, or names a constraint explicitly. For ON CONFLICT DO NOTHING, it is optional to specify a conflict_target; when omitted, conflicts with all usable constraints (and unique indexes) are handled. For ON CONFLICT DO UPDATE, a conflict_target must be provided."

🇻🇳 **Dịch**
> "Chỉ định những conflict nào thì ON CONFLICT sẽ thực hiện hành động thay thế, bằng cách chọn ra các arbiter index. Hoặc là thực hiện unique index inference, hoặc là nêu tên một constraint một cách tường minh. Với ON CONFLICT DO NOTHING, việc chỉ định conflict_target là tuỳ chọn; khi bỏ qua, mọi conflict với tất cả các constraint (và unique index) khả dụng đều được xử lý. Với ON CONFLICT DO UPDATE, **bắt buộc phải cung cấp một conflict_target**."

📖 **Nguyên văn** — trang `INSERT`, mục *ON CONFLICT Clause*, tham số `conflict_action`
> "conflict_action specifies an alternative ON CONFLICT action. It can be either DO NOTHING, or a DO UPDATE clause specifying the exact details of the UPDATE action to be performed in case of a conflict. The SET and WHERE clauses in ON CONFLICT DO UPDATE have access to the existing row using the table's name (or an alias), and to the row proposed for insertion using the special excluded table. SELECT privilege is required on any column in the target table where corresponding excluded columns are read."

🇻🇳 **Dịch**
> "conflict_action chỉ định một hành động ON CONFLICT thay thế. Nó có thể là DO NOTHING, hoặc một mệnh đề DO UPDATE mô tả chi tiết chính xác hành động UPDATE sẽ được thực hiện trong trường hợp có conflict. Các mệnh đề SET và WHERE trong ON CONFLICT DO UPDATE có thể truy cập tới row đang tồn tại thông qua tên table (hoặc một alias), và tới row được đề xuất insert thông qua table đặc biệt tên là **excluded**. Quyền SELECT là bắt buộc trên bất kỳ column nào của table đích mà các column excluded tương ứng được đọc."

> [!note] `excluded` là gì
> Trong `DO UPDATE`, có hai "phiên bản" của row: row **đang nằm trong table** (gọi bằng tên table), và row **bạn vừa định chèn vào nhưng bị chặn** — cái này gọi là `excluded`. Nhờ vậy mới viết được `SET dname = EXCLUDED.dname` = "lấy giá trị mới đè lên giá trị cũ".

### 5.4. DO UPDATE — ví dụ upsert kinh điển

📖 **Nguyên văn** — trang `INSERT`, mục *Examples*
> "Insert or update new distributors as appropriate. Assumes a unique index has been defined that constrains values appearing in the did column. Note that the special excluded table is used to reference values originally proposed for insertion:"

🇻🇳 **Dịch**
> "Insert hoặc update các distributor mới tuỳ trường hợp. Giả định rằng đã có một unique index được định nghĩa để ràng buộc các giá trị xuất hiện trong column did. Lưu ý rằng table đặc biệt excluded được dùng để tham chiếu tới các giá trị ban đầu được đề xuất insert:"

```sql
INSERT INTO distributors (did, dname)
    VALUES (5, 'Gizmo Transglobal'), (6, 'Associated Computing, Inc')
    ON CONFLICT (did) DO UPDATE SET dname = EXCLUDED.dname;
```

🇻🇳 Chèn 2 distributor; row nào có `did` đã tồn tại thì thay vì báo lỗi, cập nhật `dname` bằng giá trị mới vừa định chèn.

### 5.5. DO UPDATE kết hợp RETURNING old/new

📖 **Nguyên văn** — trang `INSERT`, mục *Examples*
> "Insert or update new distributors as above, returning information about any existing values that were updated, together with the new data inserted. Note that the returned values for old_did and old_dname will be NULL for non-conflicting rows:"

🇻🇳 **Dịch**
> "Insert hoặc update các distributor mới như trên, đồng thời trả về thông tin về bất kỳ giá trị đang tồn tại nào đã bị update, kèm theo dữ liệu mới được insert. Lưu ý rằng các giá trị trả về cho old_did và old_dname sẽ là NULL với những row không bị conflict:"

```sql
INSERT INTO distributors (did, dname)
    VALUES (5, 'Gizmo Transglobal'), (6, 'Associated Computing, Inc')
    ON CONFLICT (did) DO UPDATE SET dname = EXCLUDED.dname
    RETURNING old.did AS old_did, old.dname AS old_dname,
              new.did AS new_did, new.dname AS new_dname;
```

🇻🇳 Vừa upsert vừa trả về cả giá trị cũ lẫn giá trị mới — nhìn `old_did` có NULL hay không là biết row đó được **insert mới** hay bị **update**.

### 5.6. DO NOTHING — bỏ qua row trùng

📖 **Nguyên văn** — trang `INSERT`, mục *Examples*
> "Insert a distributor, or do nothing for rows proposed for insertion when an existing, excluded row (a row with a matching constrained column or columns after before row insert triggers fire) exists. Example assumes a unique index has been defined that constrains values appearing in the did column:"

🇻🇳 **Dịch**
> "Insert một distributor, hoặc không làm gì cả với các row được đề xuất insert khi đã tồn tại một row excluded (một row có column bị ràng buộc khớp nhau, xét sau khi các before row insert trigger đã chạy). Ví dụ giả định rằng đã có một unique index được định nghĩa để ràng buộc các giá trị xuất hiện trong column did:"

```sql
INSERT INTO distributors (did, dname) VALUES (7, 'Redline GmbH')
    ON CONFLICT (did) DO NOTHING;
```

🇻🇳 Nếu `did = 7` đã tồn tại thì lệnh im lặng bỏ qua, không lỗi, không sửa gì cả.

📖 **Nguyên văn** — trang `INSERT`, mục *Examples*
> "Insert or update new distributors as appropriate. Example assumes a unique index has been defined that constrains values appearing in the did column. WHERE clause is used to limit the rows actually updated (any existing row not updated will still be locked, though):"

🇻🇳 **Dịch**
> "Insert hoặc update các distributor mới tuỳ trường hợp. Ví dụ giả định rằng đã có một unique index được định nghĩa để ràng buộc các giá trị xuất hiện trong column did. Mệnh đề WHERE được dùng để giới hạn những row thực sự được update (tuy vậy, mọi row đang tồn tại dù không được update thì vẫn bị lock):"

```sql
-- Don't update existing distributors based in a certain ZIP code
INSERT INTO distributors AS d (did, dname) VALUES (8, 'Anvil Distribution')
    ON CONFLICT (did) DO UPDATE
    SET dname = EXCLUDED.dname || ' (formerly ' || d.dname || ')'
    WHERE d.zipcode <> '21201';

-- Name a constraint directly in the statement (uses associated
-- index to arbitrate taking the DO NOTHING action)
INSERT INTO distributors (did, dname) VALUES (9, 'Antwerp Design')
    ON CONFLICT ON CONSTRAINT distributors_pkey DO NOTHING;
```

🇻🇳 Lệnh 1: upsert có điều kiện — chỉ update khi zipcode khác `21201`, và tên mới ghép chuỗi với tên cũ. Lệnh 2: chỉ đích danh constraint `distributors_pkey` thay vì suy ra index.

### 5.7. Vài lưu ý quan trọng

📖 **Nguyên văn** — trang `INSERT`, mục *ON CONFLICT Clause*
> "Note that exclusion constraints are not supported as arbiters with ON CONFLICT DO UPDATE. In all cases, only NOT DEFERRABLE constraints and unique indexes are supported as arbiters."

🇻🇳 **Dịch**
> "Lưu ý rằng exclusion constraint không được hỗ trợ làm arbiter với ON CONFLICT DO UPDATE. Trong mọi trường hợp, chỉ các constraint NOT DEFERRABLE và các unique index mới được hỗ trợ làm arbiter."

📖 **Nguyên văn** — trang `INSERT`, mục *ON CONFLICT Clause*
> "INSERT with an ON CONFLICT DO UPDATE clause is a “deterministic” statement. This means that the command will not be allowed to affect any single existing row more than once; a cardinality violation error will be raised when this situation arises. Rows proposed for insertion should not duplicate each other in terms of attributes constrained by an arbiter index or constraint."

🇻🇳 **Dịch**
> "INSERT có mệnh đề ON CONFLICT DO UPDATE là một câu lệnh “deterministic”. Điều này nghĩa là lệnh sẽ không được phép tác động lên bất kỳ một row đang tồn tại nào quá một lần; một lỗi cardinality violation sẽ được ném ra khi tình huống này xảy ra. Các row được đề xuất insert không nên trùng lặp lẫn nhau ở các thuộc tính bị ràng buộc bởi một arbiter index hoặc constraint."

> [!tip] Nên suy ra index hơn là gọi tên constraint
> 📖 **Nguyên văn** — trang `INSERT`, mục *ON CONFLICT Clause*
> > "It is often preferable to use unique index inference rather than naming a constraint directly using ON CONFLICT ON CONSTRAINT constraint_name. Inference will continue to work correctly when the underlying index is replaced by another more or less equivalent index in an overlapping way, for example when using CREATE UNIQUE INDEX ... CONCURRENTLY before dropping the index being replaced."
>
> 🇻🇳 **Dịch**
> > "Thường thì dùng unique index inference sẽ tốt hơn là gọi thẳng tên một constraint bằng ON CONFLICT ON CONSTRAINT constraint_name. Việc suy ra index sẽ vẫn hoạt động đúng khi index bên dưới được thay bằng một index khác ít nhiều tương đương theo kiểu chồng lấn, ví dụ khi dùng CREATE UNIQUE INDEX ... CONCURRENTLY trước khi drop index đang bị thay thế."

> [!warning] Cảnh báo khi đang build index
> 📖 **Nguyên văn** — trang `INSERT`, mục *ON CONFLICT Clause*
> > "While CREATE INDEX CONCURRENTLY or REINDEX CONCURRENTLY is running on a unique index, INSERT ... ON CONFLICT statements on the same table may unexpectedly fail with a unique violation."
>
> 🇻🇳 **Dịch**
> > "Trong lúc CREATE INDEX CONCURRENTLY hoặc REINDEX CONCURRENTLY đang chạy trên một unique index, các câu lệnh INSERT ... ON CONFLICT trên cùng table đó có thể thất bại một cách bất ngờ với lỗi unique violation."
>
> Liên quan tới [[04 - Indexes]] và [[06 - Database Migrations]]: một migration tạo index concurrently có thể làm hỏng đường ghi của app đang chạy.

### 5.8. ON CONFLICT không chuẩn SQL — chuẩn là MERGE

📖 **Nguyên văn** — trang `INSERT`, mục *Compatibility*
> "INSERT conforms to the SQL standard, except that the RETURNING clause is a PostgreSQL extension, as is the ability to use WITH with INSERT, and the ability to specify an alternative action with ON CONFLICT. Also, the case in which a column name list is omitted, but not all the columns are filled from the VALUES clause or query, is disallowed by the standard. If you prefer a more SQL standard conforming statement than ON CONFLICT, see MERGE."

🇻🇳 **Dịch**
> "INSERT tuân theo SQL standard, ngoại trừ việc mệnh đề RETURNING là một PostgreSQL extension, cũng như khả năng dùng WITH với INSERT, và khả năng chỉ định một hành động thay thế bằng ON CONFLICT. Ngoài ra, trường hợp danh sách tên column bị bỏ qua nhưng không phải mọi column đều được điền từ mệnh đề VALUES hoặc query là bị standard cấm. Nếu bạn muốn một câu lệnh tuân theo SQL standard hơn ON CONFLICT, hãy xem MERGE."

📖 **Nguyên văn** — trang `INSERT`, mục *Notes*
> "You may also wish to consider using MERGE, since that allows mixing INSERT, UPDATE, and DELETE within a single statement. See MERGE."

🇻🇳 **Dịch**
> "Bạn cũng có thể cân nhắc dùng MERGE, vì nó cho phép trộn lẫn INSERT, UPDATE, và DELETE trong một câu lệnh duy nhất. Xem MERGE."

`MERGE ... RETURNING` cũng được nhắc trong chương 6:

```sql
MERGE INTO products p USING new_products n ON p.product_no = n.product_no
  WHEN NOT MATCHED THEN INSERT VALUES (n.product_no, n.name, n.price)
  WHEN MATCHED THEN UPDATE SET name = n.name, price = n.price
  RETURNING p.*;
```

🇻🇳 `MERGE` đối chiếu hai table: chưa khớp thì `INSERT`, đã khớp thì `UPDATE`, và trả về row của table đích `p`.

---

## 6. Lệnh ghi và transaction

Mọi lệnh ở bài này đều **thay đổi dữ liệu vĩnh viễn**. Khi một thao tác nghiệp vụ gồm nhiều bước ghi liên quan tới nhau (trừ tồn kho **và** tạo đơn hàng **và** cộng điểm), tất cả phải nằm trong cùng một transaction — xem [[05 - Transactions, ACID và MVCC]].

Chính tài liệu PostgreSQL cũng minh hoạ điều này bằng một ví dụ upsert thủ công dùng savepoint:

📖 **Nguyên văn** — trang `UPDATE`, mục *Examples*
> "Attempt to insert a new stock item along with the quantity of stock. If the item already exists, instead update the stock count of the existing item. To do this without failing the entire transaction, use savepoints:"

🇻🇳 **Dịch**
> "Thử insert một mặt hàng tồn kho mới cùng với số lượng tồn. Nếu mặt hàng đó đã tồn tại, thay vào đó hãy update số lượng tồn của mặt hàng đang có. Để làm điều này mà không làm hỏng toàn bộ transaction, hãy dùng savepoint:"

```sql
BEGIN;
-- other operations
SAVEPOINT sp1;
INSERT INTO wines VALUES('Chateau Lafite 2003', '24');
-- Assume the above fails because of a unique key violation,
-- so now we issue these commands:
ROLLBACK TO sp1;
UPDATE wines SET stock = stock + 24 WHERE winename = 'Chateau Lafite 2003';
-- continue with other operations, and eventually
COMMIT;
```

🇻🇳 Đặt một `SAVEPOINT` trước khi `INSERT`; nếu `INSERT` lỗi vì trùng key thì `ROLLBACK TO sp1` để cứu transaction, rồi `UPDATE` thay thế, cuối cùng `COMMIT`.

> [!tip] Đây chính là "upsert thời chưa có ON CONFLICT"
> So sánh đoạn savepoint dài dòng ở trên với một dòng `ON CONFLICT (did) DO UPDATE ...` ở mục 5.4 để thấy upsert tiết kiệm bao nhiêu công. Nhưng đoạn savepoint vẫn hữu ích để hiểu **transaction bị hỏng thì cả khối ghi bị huỷ** — lý do phải học [[05 - Transactions, ACID và MVCC]].

> [!danger] Thói quen nên có khi gõ tay trên production
> 1. `BEGIN;`
> 2. Chạy `SELECT` với **đúng mệnh đề `WHERE`** định dùng, đếm xem trúng bao nhiêu row.
> 3. Đổi `SELECT` thành `UPDATE`/`DELETE`, giữ nguyên `WHERE`, thêm `RETURNING *`.
> 4. Nhìn số row và nội dung trả về. Đúng thì `COMMIT;`, sai thì `ROLLBACK;`.

---

## 7. Tóm tắt

| Lệnh | Làm gì | Thiếu `WHERE` thì sao | `RETURNING` mặc định trả về gì |
|---|---|---|---|
| `INSERT` | Thêm row mới | không áp dụng | row **như vừa được insert** |
| `UPDATE` | Sửa column của row đã có | **sửa toàn bộ table** | nội dung **mới** của row |
| `DELETE` | Xoá nguyên row | **xoá sạch table** | nội dung của row **đã bị xoá** |

Các điểm cần nhớ:

- `INSERT` luôn nên **liệt kê tên column**.
- Chèn nhiều row → gộp vào **một lệnh `VALUES` nhiều bộ**, đừng lặp N lệnh.
- SQL **không có "địa chỉ row"** — muốn chạm đúng một row phải có primary key.
- `UPDATE`/`DELETE` **không khớp row nào thì không phải lỗi** → tự kiểm tra `count` hoặc `RETURNING`.
- `RETURNING` = ghi và đọc trong **một round-trip**, và là cách đáng tin cậy nhất để biết row nào vừa bị đụng tới.
- `ON CONFLICT DO UPDATE` = upsert atomic, an toàn dưới concurrency cao — thứ mà `SELECT` rồi `INSERT` trong code không làm được.

---

## Liên kết
- Bài trước: [[07 - N+1 Problem]]
- Bài kế: [[09 - Subquery, CTE và Set Operations]]
- Liên quan: [[02 - Tables, Data Types và Constraints]] — DDL, `DEFAULT`, primary key, unique constraint (nền tảng để `ON CONFLICT` hoạt động)
- Liên quan: [[03 - Queries - SELECT, JOIN, Aggregate]] — `SELECT`, `JOIN`, subquery dùng trong `INSERT ... SELECT` và `DELETE ... USING`
- Liên quan: [[04 - Indexes]] — unique index là thứ `ON CONFLICT` dựa vào để phát hiện conflict
- Liên quan: [[05 - Transactions, ACID và MVCC]] — `BEGIN`/`COMMIT`/`ROLLBACK`/`SAVEPOINT` cho nhiều bước ghi
- Liên quan: [[06 - Database Migrations]] — `CREATE INDEX CONCURRENTLY` có thể làm `INSERT ... ON CONFLICT` lỗi bất ngờ
- Liên quan: [[07 - N+1 Problem]] — N+1 cũng xảy ra ở đường ghi, chữa bằng multi-row `INSERT`
- Quay lại mục lục: [[00 - Tổng hợp (Relational Databases)]]

## Nguồn tham khảo
- PostgreSQL 18 Documentation — *Chapter 6. Data Manipulation* : https://www.postgresql.org/docs/current/dml.html
- PostgreSQL 18 Documentation — *6.1. Inserting Data* : https://www.postgresql.org/docs/current/dml-insert.html
- PostgreSQL 18 Documentation — *6.2. Updating Data* : https://www.postgresql.org/docs/current/dml-update.html
- PostgreSQL 18 Documentation — *6.3. Deleting Data* : https://www.postgresql.org/docs/current/dml-delete.html
- PostgreSQL 18 Documentation — *6.4. Returning Data from Modified Rows* : https://www.postgresql.org/docs/current/dml-returning.html
- PostgreSQL 18 Documentation — *INSERT* (cú pháp đầy đủ, `ON CONFLICT`, Examples) : https://www.postgresql.org/docs/current/sql-insert.html
- PostgreSQL 18 Documentation — *UPDATE* (Outputs, Examples, savepoint) : https://www.postgresql.org/docs/current/sql-update.html
- PostgreSQL 18 Documentation — *DELETE* (Synopsis, Notes, Examples) : https://www.postgresql.org/docs/current/sql-delete.html
- Trang nguồn không có hình minh hoạ nên bài này không có ảnh.
