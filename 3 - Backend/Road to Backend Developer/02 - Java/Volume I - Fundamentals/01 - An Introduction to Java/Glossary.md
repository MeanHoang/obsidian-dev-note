# Glossary — An Introduction to Java

> Thuật ngữ chương 1: Java as a Programming Platform.

| Thuật ngữ | Nghĩa | Ghi chú |
|---|---|---|
| **JVM** (Java Virtual Machine) | Máy ảo chạy bytecode Java — trái tim của platform | Tương tự V8 engine bên JS |
| **JRE** (Java Runtime Environment) | JVM + thư viện chuẩn — đủ để **chạy** app Java | User cài JRE để chạy app |
| **JDK** (Java Development Kit) | JRE + compiler (`javac`) + dev tools — đủ để **phát triển** app | Developer cài JDK để code |
| **Bytecode** | Mã trung gian (`.class`) — không phải source, không phải machine code — JVM hiểu | Là chìa khoá cho WORA |
| **WORA** (Write Once, Run Anywhere) | Compile 1 lần ra bytecode → chạy trên mọi OS có JVM | Slogan chính của Java |
| **JIT** (Just-In-Time Compiler) | Bộ phận trong JVM biến bytecode → native machine code **lúc chạy**, tối ưu hot path | Giống TurboFan trong V8 |
| **Garbage Collection (GC)** | JVM tự dọn bộ nhớ không dùng — developer không cần gọi `free()` | Java, JS đều có GC |
| **Static Typing** | Khai kiểu dữ liệu lúc viết code (`int x = 5`), compiler bắt lỗi kiểu trước khi chạy | Khác JS: dynamic typing |
| **Platform** | Ngôn ngữ + runtime (JVM) + thư viện chuẩn + công cụ — không chỉ là cú pháp | Java = platform, không chỉ language |
| **Multithreaded** | Chạy nhiều luồng song song thật sự trên nhiều CPU core | Khác JS: single-threaded + event loop |
| **Robust** | Thiết kế chống lỗi: compile-time checking, bounds checking, no pointer arithmetic | Lỗi bắt trước khi chạy |
| **Architecture-neutral** | Bytecode không phụ thuộc CPU (x86, ARM...) — JVM lo phần dịch sang machine code | Lý do Java chạy mọi nơi |
| **Portable** | Kiểu dữ liệu kích thước cố định trên mọi platform (`int` luôn = 32 bit) | Khác C: `int` tuỳ máy |
| **javac** | Java Compiler — biên dịch `.java` → `.class` (bytecode) | Nằm trong JDK |
| **java** | Lệnh chạy bytecode trên JVM | `java Hello` = chạy `Hello.class` |
