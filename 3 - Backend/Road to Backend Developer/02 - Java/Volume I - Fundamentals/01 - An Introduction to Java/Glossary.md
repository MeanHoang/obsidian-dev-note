# Glossary — An Introduction to Java

> Thuật ngữ chương 1: An Introduction to Java.

## A

**Architecture-neutral**
Bytecode không phụ thuộc CPU (x86, ARM...) — JVM lo phần dịch sang machine code. Lý do Java chạy mọi nơi.

**Applet**
Chương trình Java nhúng trong web page — browser tải bytecode từ Internet, chạy trong sandbox. Làm Java nổi tiếng (1995) nhưng chết vì phân mảnh version + thua Flash + lỗ hổng security. Java 9 (2017) chính thức khai tử.

## B

**Backward Compatibility**
Code viết bằng version cũ vẫn chạy được trên version mới. Lý do Java không bỏ được thiết kế xấu cũ.

**Buzzword**
Từ khoá "kêu", nghe ấn tượng, hay dùng để quảng bá công nghệ. Trong sách, Horstmann dùng hơi mỉa mai — ý là "lời hứa của Java, xem thực tế có đúng không."

**Bounds Checking**
Kiểm tra chỉ số mảng có vượt quá giới hạn không — Java kiểm tra tự động, C thì không. Lỗi: `ArrayIndexOutOfBoundsException`.

**Bytecode**
Mã trung gian (`.class`) — không phải source code, không phải machine code — JVM hiểu. Là chìa khoá cho WORA.

## C

**Checked Exception**
Exception mà compiler **bắt buộc** phải xử lý (try/catch hoặc `throws`) — không xử lý = compile lỗi. Ví dụ: `IOException`, `SQLException`. JS không có concept này.

**Condition Variable**
Cho thread **đợi** cho đến khi điều kiện nào đó đúng, rồi mới tiếp tục. Trong Java: `wait()` / `notify()`.

## D

**Dynamic Linking**
Load class vào runtime bằng tên (string), không cần biết lúc compile. Ví dụ: `Class.forName("...")`.

## E

**Execution Environment**
Môi trường chạy — lo hết phần "hậu đài" (bộ nhớ, GC, security, JIT, thread) để code chỉ việc chạy logic. JVM = execution env của Java, V8 = của JS.

## G

**Garbage Collection (GC)**
JVM tự dọn bộ nhớ không dùng — developer không cần gọi `free()`. Java, JS đều có GC.

**Green Project**
Mật danh dự án khai sinh Java (1991) — làm ngôn ngữ nhỏ gọn cho thiết bị gia dụng (TV box). Yêu cầu "mỗi hãng 1 CPU" chính là lý do bytecode + JVM ra đời.

## I

**IEEE 754**
Chuẩn quốc tế cho số thực dấu phẩy động — Java `float`/`double` tuân theo chuẩn này. Lý do `0.1 + 0.2 != 0.3` (JS cũng bị).

## J

**java**
Lệnh chạy bytecode trên JVM. `java Hello` = chạy `Hello.class`.

**javac**
Java Compiler — biên dịch `.java` → `.class` (bytecode). Nằm trong JDK.

**JDK** (Java Development Kit)
JRE + compiler (`javac`) + dev tools — đủ để **phát triển** app. Developer cài JDK để code.

**JIT** (Just-In-Time Compiler)
Bộ phận trong JVM biến bytecode → native machine code **lúc chạy**, tối ưu hot path. Giống TurboFan trong V8.

**JRE** (Java Runtime Environment)
JVM + thư viện chuẩn — đủ để **chạy** app Java. User cài JRE để chạy app.

**JVM** (Java Virtual Machine)
Máy ảo chạy bytecode Java — trái tim của platform. Tương tự V8 engine bên JS.

## L

**LTS** (Long-Term Support)
Bản Java được vá lỗi + security nhiều năm — production chỉ nên dùng LTS. Các bản: 8, 11, 17, 21. Giống Node LTS (18, 20, 22).

## M

**Monitor**
Cơ chế đồng bộ hoá thread — chỉ 1 thread vào critical section tại 1 thời điểm. Từ khoá `synchronized` trong Java.

**Multiple Inheritance**
1 class kế thừa từ nhiều class cha — Java **bỏ**, thay bằng interface. Tránh "diamond problem".

**Multithreaded**
Chạy nhiều luồng song song thật sự trên nhiều CPU core. Khác JS: single-threaded + event loop.

## O

**Operator Overloading**
Cho phép toán tử (+, -, ...) hoạt động khác nhau tuỳ kiểu dữ liệu — Java **bỏ** tính năng này của C++. JS cũng không có.

## P

**Platform**
Ngôn ngữ + runtime (JVM) + thư viện chuẩn + công cụ — không chỉ là cú pháp. Java = platform, không chỉ language.

**Pointer Arithmetic**
Tính toán trực tiếp trên địa chỉ bộ nhớ (C/C++) — Java **bỏ hoàn toàn**. Lý do Java robust + secure.

**Portable**
Kiểu dữ liệu kích thước cố định trên mọi platform (`int` luôn = 32 bit). Khác C: `int` tuỳ máy.

**Portability** (tính di động)
Code chạy được trên mọi OS mà không cần sửa — nhờ bytecode + JVM. Như sạc USB-C: 1 cái dùng mọi máy.

## R

**Reflection**
Tên chính thức của runtime introspection đầy đủ trong Java — soi + gọi method, tạo object động lúc runtime. Học kỹ ở Chapter 5 (5.10). Spring DI, JUnit dựa trên đây.

**Robust**
Thiết kế chống lỗi: compile-time checking, bounds checking, no pointer arithmetic. Lỗi bắt trước khi chạy.

**Runtime Introspection**
Khả năng chương trình **tự soi chính nó lúc đang chạy**: object thuộc class nào, có method/field nào. Java: `getClass()`, `instanceof`. JS: `typeof`, `Object.keys()`, `instanceof`. Giống "soi gương" — object tự biết mình là ai.

## S

**Standard Library**
~4000 class đi kèm JDK (Collections, I/O, Networking...) — không cần download thêm. Node.js built-in modules ít hơn rất nhiều.

**Static Typing**
Khai kiểu dữ liệu lúc viết code (`int x = 5`), compiler bắt lỗi kiểu trước khi chạy. Khác JS: dynamic typing.

**Syntax Sugar**
Cú pháp viết **ngọt hơn, dễ đọc hơn** nhưng **không thêm tính năng mới** — bên dưới máy làm y hệt cách cũ. Như nói "8h tối" thay vì "20:00". JS: `class` là sugar của prototype, `async/await` là sugar của Promise. Java: for-each là sugar của Iterator. ⚠️ Java `class` là **thật** (JVM có class từ lõi), JS `class` chỉ là sugar.

## U

**Unchecked Exception**
Exception compiler không bắt — chỉ nổ lúc runtime. Ví dụ: `NullPointerException`, `ArithmeticException`.

## W

**White Paper**
Tài liệu kỹ thuật chính thức, giải thích tầm nhìn/thiết kế/triết lý của 1 sản phẩm. Trong context Java: bài "Java: an Overview" (1995) của James Gosling, chứa 11 buzzwords mô tả đặc tính thiết kế.

**WORA** (Write Once, Run Anywhere)
Compile 1 lần ra bytecode → chạy trên mọi OS có JVM. Slogan chính của Java.
