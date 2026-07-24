# Glossary — The Java Programming Environment

> Thuật ngữ chương 2: The Java Programming Environment.

## A

**Adoptium**
Dự án trong Eclipse Foundation cung cấp bản OpenJDK + hạ tầng phân phối. Trang tải: adoptium.net.

**AOT** (Ahead-Of-Time compilation)
Biên dịch **trước khi chạy** ra thẳng machine code (ngược với JIT dịch lúc chạy). GraalVM dùng cách này — khởi động nhanh, hợp serverless, nhưng thiếu một số feature Java động.

## C

**Corretto**
Bản OpenJDK do **Amazon** build và phân phối, miễn phí. Ruột = OpenJDK, chỉ khác thương hiệu + cam kết hỗ trợ.

## G

**GraalVM**
Compiler "ahead-of-time" — tạo executable khởi động cực nhanh nhưng không hỗ trợ đủ feature Java. Sách khuyên **không dùng** khi học. Hợp cho serverless/Cloud Run về sau.

## H

**HotSpot**
Tên chính thức của **JIT compiler** trong JVM do Oracle phát triển — tên nghĩa đen: săn "hot spots" (code chạy nhiều) để tối ưu. Sách: "if asked, choose this one".

## I

**IDE** (Integrated Development Environment)
Môi trường phát triển tích hợp — editor + compiler ngầm + debugger + nút Run trong 1 app. Java: IntelliJ IDEA (phổ biến nhất), Eclipse (sách dùng), NetBeans. Nút Run = `javac` + `java` đóng gói.

## J

**jar** (lệnh)
Tool trong JDK thao tác file `.jar`/zip. `jar xvf file.zip` = giải nén (x=extract, v=verbose, f=file).

**JShell**
REPL của Java (Java 9+, 2017) — gõ biểu thức là tự tính + tự in, không cần class/main/compile. Kết quả lưu vào `$1, $2...`, Tab completion khám phá thư viện. Tương đương DevTools Console bên JS.

**Java SE** (Standard Edition)
Java cho desktop + server thông thường — bản mà sách (và hầu hết mọi người) dùng. Phân biệt với ME (thiết bị nhỏ) và EE (enterprise, nay là Jakarta EE).

## O

**OpenJDK**
Bản hiện thực Java SE **miễn phí, open source** (GPL, từ 2007) — nền tảng chung mà mọi vendor (Oracle, Amazon, Eclipse...) lấy về build thành sản phẩm của mình. Như kernel Linux với các distro.

## P

**PATH**
Biến môi trường liệt kê các thư mục hệ điều hành tìm lệnh. Cài JDK phải đảm bảo `jdk/bin` nằm trong PATH thì gõ `javac`/`java` mới chạy. Test: `javac --version`.

## R

**REPL** (Read-Evaluate-Print Loop)
Vòng lặp Đọc lệnh → Tính → In kết quả → chờ lệnh tiếp. Công cụ của exploratory programming. Java: JShell. JS: DevTools Console, `node`. Python: `python`.

## S

**src.zip**
File nén chứa **source code toàn bộ thư viện chuẩn**, nằm sẵn tại `jdk/lib/src.zip`. Giải nén ra để đọc ruột `String`, `ArrayList`... — IDE dùng nó cho tính năng nhảy vào source.

## T

**Temurin**
Tên thương hiệu bản OpenJDK do **Eclipse Foundation** (dự án Adoptium) phân phối — miễn phí, sách khuyên dùng để học.

## Z

**Zulu**
Bản OpenJDK do công ty **Azul** build và phân phối.
