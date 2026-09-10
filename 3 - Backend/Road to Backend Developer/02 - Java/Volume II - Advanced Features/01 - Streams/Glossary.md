# Glossary — Streams

> Thuật ngữ chương 1: Streams. Định nghĩa lấy từ Core Java Volume II: Advanced Features, 11th Edition (Horstmann), Java 11.

## A

**Associative**
Tính chất bắt buộc của một reduction operation nếu muốn dùng với **parallel stream**: **thứ tự kết hợp các element không quan trọng**, tức `(x op y) op z` phải bằng `x op (y op z)`. Ví dụ phép toán **không associative** là **phép trừ**: `(6 − 3) − 2 ≠ 6 − (3 − 2)`. Xem [[12 - Reduction Operations#1.12. Reduction Operations]].

**Accumulator**
Function được gọi lặp đi lặp lại để **tạo thành tổng tích luỹ** trong `reduce`. Ở dạng ba tham số, accumulator có kiểu `(U, T) -> U` nên **xử lý được trường hợp element và kết quả khác kiểu**. Trong `collect` ba tham số, accumulator là thứ **thêm một element vào object đích**, ví dụ method `add`. Xem [[12 - Reduction Operations#1.12. Reduction Operations]].

## B

**boxed**
Method chuyển một **primitive type stream** thành **object stream** gồm các wrapper object. Ví dụ `IntStream.range(0, 100).boxed()` cho ra `Stream<Integer>`. Xem [[13 - Primitive Type Streams#1.13. Primitive Type Streams]].

## C

**Classifier Function**
Function truyền vào `groupingBy`, quyết định **key của phép nhóm**. Ví dụ `Locale::getCountry`. Khi classifier function là một **predicate function** (trả về `boolean`) thì nên dùng `partitioningBy` cho hiệu quả hơn. Xem [[10 - Grouping and Partitioning#1.10. Grouping and Partitioning]].

**Collector**
Object **tích luỹ element và sinh ra kết quả**. Truyền vào method `collect`. Class `Collectors` cung cấp **rất nhiều factory method** cho các collector thông dụng (`toList`, `toSet`, `toCollection`, `joining`, `summarizing*`, `toMap`, `groupingBy`, ...). Xem [[08 - Collecting Results#1.8. Collecting Results]].

**Combiner**
Function **merge hai object thành một** trong `collect` ba tham số (ví dụ `addAll`), hoặc **kết hợp các tổng của những segment được tích luỹ riêng rẽ** trong `reduce` ba tham số. Cần thiết vì khi song song hoá sẽ có **nhiều phép tính bộ phận**. Xem [[12 - Reduction Operations#1.12. Reduction Operations]].

## D

**distinct**
Intermediate operation trả về stream sinh ra element của stream gốc, **giữ nguyên thứ tự**, nhưng **loại bỏ các bản trùng**. Các bản trùng **không cần nằm liền kề**. Trên **ordered stream**, `distinct` giữ lại **cái đầu tiên** trong các element bằng nhau — điều này **cản trở song song hoá**. Xem [[05 - Other Stream Transformations#1.5. Other Stream Transformations]] và [[14 - Parallel Streams#1.14. Parallel Streams]].

**Downstream Collector**
Collector truyền thêm vào `groupingBy` để **xử lý các list value** mà phép nhóm sinh ra. Ví dụ `groupingBy(Locale::getCountry, toSet())`. Sách khuyên: **cách dùng tốt nhất của việc compose collector là với `groupingBy`/`partitioningBy`**, ngoài ra thì cứ áp `map`, `reduce`, `count`, `max`, `min` thẳng lên stream. Xem [[11 - Downstream Collectors#1.11. Downstream Collectors]].

**dropWhile**
Intermediate operation (Java 9) **bỏ element chừng nào điều kiện còn đúng**, rồi sinh ra stream **mọi element bắt đầu từ element đầu tiên mà điều kiện sai**. Xem [[04 - Extracting Substreams and Combining Streams#1.4. Extracting Substreams and Combining Streams]].

## F

**filter**
Intermediate operation sinh ra stream mới **chỉ chứa các element thoả một điều kiện**. Argument là một **`Predicate<T>`** — function từ `T` sang `boolean`. **Không xoá element khỏi stream gốc.** Xem [[03 - The filter, map, and flatMap Methods#1.3. The filter, map, and flatMap Methods]].

**flatMap**
Intermediate operation **nối (concatenate) các kết quả** của việc áp mapper lên từng element, trong đó **mỗi kết quả bản thân là một stream** — tức **làm phẳng stream của các stream**. Là **khái niệm tổng quát trong khoa học máy tính**, **ý tưởng then chốt trong lý thuyết monad**, nhưng sách nói **dùng được mà không cần biết gì về monad**. `Optional` cũng có `flatMap` hoạt động y hệt nếu coi optional là stream 0 hoặc 1 element. Xem [[03 - The filter, map, and flatMap Methods#1.3. The filter, map, and flatMap Methods]] và [[07 - The Optional Type#1.7.6. Composing Optional Value Functions with flatMap]].

**Fork-Join Pool**
Pool mà parallel stream dùng **mặc định**, trả về bởi `ForkJoinPool.commonPool`. **Ổn nếu thao tác không blocking** và bạn không chia sẻ pool với task khác. Thay được bằng pool khác qua method `submit` của một custom pool. Xem [[14 - Parallel Streams#1.14. Parallel Streams]].

## I

**Identity**
Phần tử `e` sao cho `e op x = x`, dùng làm **điểm khởi đầu của phép reduction**. Ví dụ **`0` là identity của phép cộng**. Khi cung cấp identity, **giá trị này được trả về nếu stream rỗng**, nên **không phải xử lý `Optional`** nữa. Xem [[12 - Reduction Operations#1.12. Reduction Operations]].

**Intermediate Operation**
Giai đoạn 2 của stream pipeline: các thao tác **biến đổi stream ban đầu thành stream khác**, có thể qua nhiều bước. Là **lazy** — không thực thi cho tới khi terminal operation chạy. Xem [[01 - From Iterating to Stream Operations#Pipeline ba giai đoạn]].

## L

**Lazy**
Đặc tính của stream operation: **không được thực thi cho tới khi kết quả được cần đến**. Hệ quả: **cho phép infinite stream**, và `filter` **ngừng lọc** khi đã đủ số kết quả yêu cầu. Method `peek` giúp **kiểm chứng tính lazy** này. Xem [[01 - From Iterating to Stream Operations#Ba khác biệt giữa stream và collection]] và [[05 - Other Stream Transformations#peek]].

## M

**map**
Intermediate operation **áp một function lên từng element** và sinh ra stream mới chứa các kết quả. `Optional` cũng có method `map` **tương ứng**. Xem [[03 - The filter, map, and flatMap Methods#map]] và [[07 - The Optional Type#1.7.3. Pipelining Optional Values]].

**Merge Function**
Function argument thứ ba của `Collectors.toMap`, **giải quyết xung đột khi hai element cho ra cùng key**. Không có nó thì collector **ném `IllegalStateException`**. Function này trả về **giá trị cũ, giá trị mới, hoặc kết hợp cả hai**. Bắt buộc phải có nếu muốn truyền thêm **map supplier**. Xem [[09 - Collecting into Maps#Xử lý xung đột key: merge function]].

## N

**Noninterference**
Tên gọi trong tài liệu JDK cho yêu cầu: **không được sửa collection đứng sau một stream** trong lúc thực hiện stream operation. Vì **stream không gom data của nó** — data luôn nằm ở collection riêng — nên sửa collection đó khiến **kết quả trở nên không xác định**. Chính xác hơn: vì intermediate operation là lazy, vẫn mutate được **cho tới thời điểm terminal operation thực thi**. Xem [[02 - Stream Creation#Noninterference — đừng sửa collection nền]].

## O

**Optional**
Wrapper cho **hoặc một object kiểu `T`, hoặc không có object nào**. Thay thế **an toàn hơn** cho reference có thể `null`, **nhưng chỉ khi dùng đúng**. Ba nguyên tắc: biến kiểu `Optional` **không bao giờ được là `null`**; **đừng dùng field kiểu `Optional`**; **đừng cho vào set hay dùng làm key của map**. Dùng `get`/`isPresent` thì **chẳng an toàn hơn kiểm tra null**. Xem [[07 - The Optional Type]].

**Ordered**
Đặc tính mặc định của stream sinh ra từ **ordered collection (array, list)**, từ **range, generator, iterator**, hoặc từ `Stream.sorted`. Kết quả được **tích luỹ theo thứ tự element gốc** và **hoàn toàn dự đoán được**. **Ordering không loại trừ song song hoá hiệu quả** — stream chia thành `n` segment rồi ghép lại theo thứ tự. Xem [[14 - Parallel Streams#Ordering và unordered]].

## P

**Parallel Stream**
Stream cho phép library thực hiện thao tác **song song**. Lấy từ `Collection.parallelStream()` hoặc method `parallel()`. **Miễn stream ở parallel mode khi terminal method thực thi**, mọi intermediate operation đều được song song hoá. **Trách nhiệm của bạn** là đảm bảo mọi function truyền vào **an toàn khi chạy song song** — **cách tốt nhất là tránh xa mutable state**. Xem [[14 - Parallel Streams]].

**partitioningBy**
Collector sinh ra map có **key là `true`/`false`**, value là **list các element thoả / không thoả predicate**. **Hiệu quả hơn `groupingBy`** khi classifier function là predicate. Xem [[10 - Grouping and Partitioning#partitioningBy]].

**peek**
Intermediate operation sinh ra stream **có cùng element**, nhưng **gọi một function mỗi khi một element được lấy ra**. Tiện để **debug** và **kiểm chứng tính lazy**. Xem [[05 - Other Stream Transformations#peek]].

**Pipeline**
Chuỗi thao tác trên stream, dựng theo **ba giai đoạn**: (1) **create a stream**, (2) **intermediate operations**, (3) **terminal operation**. Xem [[01 - From Iterating to Stream Operations#Pipeline ba giai đoạn]].

**Primitive Type Stream**
Các kiểu chuyên biệt **`IntStream`, `LongStream`, `DoubleStream`** lưu **giá trị primitive trực tiếp, không dùng wrapper**. Dùng `IntStream` cho `short`, `char`, `byte`, `boolean`; dùng `DoubleStream` cho `float`. Khác object stream ở bốn điểm: **`toArray` trả về primitive array**; **kết quả optional là `OptionalInt`/`OptionalLong`/`OptionalDouble`**; **có `sum`, `average`, `max`, `min`**; **có `summaryStatistics`**. Xem [[13 - Primitive Type Streams]].

## R

**Race Condition**
Lỗi kinh điển khi function truyền vào parallel stream operation **chạy concurrent trên nhiều thread và cùng cập nhật một array/state dùng chung**. Sách gọi code kiểu đó là **"very, very bad code"**: chạy nhiều lần cho **kết quả khác nhau và đều sai**. Xem [[14 - Parallel Streams#Không được có mutable state — race condition]].

**Reduction**
Nhóm **terminal operation** **rút gọn stream thành một giá trị không phải stream** để dùng trong chương trình. Reduction đơn giản: `count`, `max`, `min`, `findFirst`, `findAny`, `anyMatch`, `allMatch`, `noneMatch`. Reduction tổng quát: method `reduce`. Xem [[06 - Simple Reductions#1.6. Simple Reductions]] và [[12 - Reduction Operations]].

## S

**skip**
Intermediate operation **bỏ đi `n` element đầu tiên**. Ngược với `limit`. Tiện để loại **chuỗi rỗng đầu tiên** mà `split` sinh ra. Xem [[04 - Extracting Substreams and Combining Streams#1.4. Extracting Substreams and Combining Streams]].

**Spliterator**
"Splittable iterator" — dùng để biến một `Iterable` không phải collection, hoặc một `Iterator`, thành stream qua `StreamSupport.stream`. Implementation mặc định của `Iterable.spliterator()` **không split và không báo kích thước**. Xem [[02 - Stream Creation#Các method khác trong Java API trả về stream]].

**Stream**
Khác collection ở ba điểm: **không lưu element** (chúng nằm ở collection nền hoặc được sinh khi cần) · **không mutate nguồn** · **lazy khi có thể** (nên có cả **infinite stream**). Theo nguyên tắc **"what, not how"**. Sau khi terminal operation chạy, **stream không dùng lại được nữa**. Xem [[01 - From Iterating to Stream Operations]].

**SplittableRandom**
Class nên dùng thay `Random` khi cần **số ngẫu nhiên trong parallel stream**, vì stream từ `Random.ints`/`longs`/`doubles` **không split được**. Xem [[13 - Primitive Type Streams#1.13. Primitive Type Streams]] và [[14 - Parallel Streams#Đừng biến mọi stream thành parallel stream]].

## T

**takeWhile**
Intermediate operation (Java 9) **lấy element chừng nào predicate còn đúng**, rồi **dừng**. Ngược với `dropWhile`. Xem [[04 - Extracting Substreams and Combining Streams#takeWhile và dropWhile]].

**Terminal Operation**
Giai đoạn 3 của pipeline: thao tác **sinh ra kết quả**, **buộc mọi lazy operation phía trước phải thực thi**. Sau đó **stream không dùng lại được nữa**. Ví dụ: `count`, `collect`, `forEach`, `toArray`, `max`, `min`, `findFirst`, `iterator`. Xem [[01 - From Iterating to Stream Operations#Pipeline ba giai đoạn]].

## U

**unordered**
Method báo rằng bạn **không quan tâm tới thứ tự**, giúp một số thao tác **song song hoá hiệu quả hơn** — điển hình là `distinct` và `limit`. Xem [[14 - Parallel Streams#Ordering và unordered]].

## W

**"What, not how"**
Nguyên tắc mà stream tuân theo: **mô tả việc cần làm** chứ không chỉ định thứ tự hay thread. Ngược lại, vòng lặp quy định **chính xác cách tính toán phải diễn ra** và vì thế **từ bỏ mọi cơ hội tối ưu hoá**. Xem [[01 - From Iterating to Stream Operations#1.1. From Iterating to Stream Operations]].
