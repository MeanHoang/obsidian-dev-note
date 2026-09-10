# Glossary — The Java Platform Module System

> Thuật ngữ chương 12: The Java Platform Module System. Định nghĩa lấy từ Core Java Volume I, 13th Edition (Horstmann).

## A

**Aggregator Module**
Module **không có package nào, chỉ toàn transitive requirement**. Ví dụ điển hình là module `java.se`, chỉ gồm một loạt `requires transitive`. Lập trình viên không quan tâm tới dependency chi tiết chỉ cần require `java.se` là có **toàn bộ module của Java SE platform**. Xem [[11 - Transitive and Static Requirements#Aggregator module]].

**Automatic Module**
Một file **JAR không có `module-info.class` nằm trên module path**. Bốn tính chất: ngầm có `requires` tới **mọi module khác** · **toàn bộ package được export và opened** · tên module lấy từ `Automatic-Module-Name` trong manifest nếu có · nếu không thì lấy từ **tên file JAR** (bỏ số version đuôi, thay chuỗi ký tự không phải chữ-số bằng dấu chấm). Là một trong hai cơ chế bắc cầu migration. Xem [[08 - Automatic Modules#12.8. Automatic Modules]].

**Automatic-Module-Name**
Entry trong manifest `META-INF/MANIFEST.MF` của file JAR; **giá trị của nó trở thành tên module** khi JAR được dùng làm automatic module. Cho phép người bảo trì thư viện **kiểm soát tên module của mình** trước khi thực sự thêm `module-info.java`. Xem [[08 - Automatic Modules#Ví dụ: Apache Commons CSV]].

## C

**Class Path**
Cách truyền thống đặt file JAR để chương trình dùng. Class **không nằm trên module path** thì thuộc [[09 - The Unnamed Module|unnamed module]]. Sách nói explicit module **luôn thoát khỏi "class path hell"**. Xem [[01 - The Module Concept#Hai lợi thế so với JAR trên class path]].

## E

**Encapsulation (ở quy mô module)**
Module system mang lại lợi ích của encapsulation cho **lập trình quy mô lớn**: module làm cho class và package **available một cách chọn lọc**, nhờ đó sự tiến hoá của nó được kiểm soát. Java platform **cưỡng chế** encapsulation và dependency **cả ở compile time lẫn trong virtual machine**. Xem [[01 - The Module Concept#12.1. The Module Concept]].

**Explicit Module**
Module **không phải automatic cũng không phải unnamed** — tức module **có `module-info.class` trên module path**. Không explicit module nào truy cập được unnamed module. Xem [[09 - The Unnamed Module#12.9. The Unnamed Module]].

**exports**
Keyword khai báo **package nào của module truy cập được từ bên ngoài**. Khi một package được export, các class/interface `public` và `protected` cùng member `public`/`protected` của chúng **truy cập được từ ngoài module**. Package **không được export thì không truy cập được từ ngoài module của chính nó**. Sau `exports` là **tên package** (khác `requires`, theo sau là tên module). Xem [[05 - Exporting Packages#12.5. Exporting Packages]].

## J

**java.base**
Module chứa các package cơ bản như `java.lang`, `java.io`. Được **require mặc định**, không cần khai báo. Xem [[04 - Requiring Modules#java.base được require mặc định]].

**Java Platform Module System**
Hệ thống module do Java 9 giới thiệu, **được compiler và virtual machine của Java hỗ trợ**, thiết kế để module hoá **code base khổng lồ của Java platform**. Những người thiết kế đã xem qua các module system sẵn có (như **OSGi**) và thấy không phù hợp nên làm hệ thống mới. **Không xử lý versioning** của module. Xem [[01 - The Module Concept#12.1. The Module Concept]] và [[01 - The Module Concept#Điều module system KHÔNG giải quyết]].

**jdeps**
Công cụ JDK **phân tích dependency của một tập file JAR**. Flag `-s` cho **output tóm tắt** (module graph); bỏ `-s` thì thêm ánh xạ package → package/module cần; thêm `v` thì ánh xạ class → package/module. Option `--generate-module-info` **sinh file `module-info`** cho mỗi module được phân tích; `-dotoutput` sinh output đồ hoạ ngôn ngữ "dot". Xem [[14 - Tools for Working with Modules#jdeps]].

**jimage**
Lệnh **khảo sát runtime image**. Định dạng là **nội bộ của JVM**, runtime image **không nhằm để công cụ khác sinh ra hay sử dụng**. Xem [[14 - Tools for Working with Modules#jlink]].

**jlink**
Công cụ tạo ra **application chạy được mà không cần Java runtime riêng**. Bundle **tập module tối thiểu** cần để chạy application; image kết quả **nhỏ hơn nhiều so với toàn bộ JDK** (ví dụ của sách: 29MB so với 133MB). Output có thư mục `bin` chứa file thực thi `java`. Xem [[14 - Tools for Working with Modules#jlink]].

**jmod**
Công cụ **build và khảo sát các module file đi kèm JDK** (đuôi `.jmod` trong thư mục `jmods`; **không còn `rt.jar`**). Ngoài class file còn chứa được **native code library, command, header file, configuration file, legal notice**. Dùng **định dạng ZIP**. Khác JAR ở chỗ **chỉ hữu ích cho linking** — tạo runtime image. Xem [[14 - Tools for Working with Modules#jmod]].

## M

**Modular JAR**
File JAR chứa toàn bộ class của một module, với **`module-info.class` nằm ở thư mục gốc**. Tạo bằng công cụ `jar` như bình thường (thường kèm `-d` khi biên dịch và `-C` khi thu gom). Build tool như Maven/Ant/Gradle vẫn build như xưa, miễn `module-info.class` được đưa vào. Xem [[06 - Modular JARs#12.6. Modular JARs]] và [[09 - JAR Files]].

**Module**
**Một tập hợp các package.** Tên các package trong module **không nhất thiết liên quan nhau** (ví dụ `java.sql` chứa `java.sql`, `javax.sql`, `javax.transaction.xa`). Module **không tạo ra một scope**: không thể có hai package trùng tên ở hai module khác nhau, kể cả package bị giấu. Xem [[02 - Naming Modules#12.2. Naming Modules]] và [[05 - Exporting Packages#Tổng kết requires + exports]].

**Module Graph**
Đồ thị có **node là các module**, **cạnh** là requirement được khai báo — hoặc, khi không khai báo requirement nào, là **requirement ngầm định tới `java.base`**. **Không được có chu trình (cycle)**: một module không được require chính nó, dù trực tiếp hay gián tiếp. Xem [[04 - Requiring Modules#Module graph]].

**Module Path**
Nơi đặt module để compiler và virtual machine tìm thấy (option `-p` / `--module-path`). Đặt một JAR lên module path thay vì class path là cách biến nó thành [[08 - Automatic Modules|automatic module]]. Xem [[03 - The Modular Hello World Program#Chạy bằng module path]].

**module-info.java**
File khai báo module. **Không phải là class** dù được biên dịch thành `module-info.class`. Chứa các statement `requires`, `exports`, `opens`, `provides`, `uses`. Xem [[03 - The Modular Hello World Program#module-info.java]].

## O

**open module**
Module được khai báo với keyword `open` ở đầu. Nó **cấp quyền truy cập runtime tới toàn bộ package của nó**, như thể mọi package đều được khai báo với `exports` và `opens`. Nhưng **ở compile time chỉ những package được export tường minh mới truy cập được**. Kết hợp **an toàn compile-time** với **hành vi runtime dễ dãi kiểu cổ điển**. Xem [[07 - Modules and Reflective Access#open module]].

**opens**
Keyword cho phép **reflective access tới mọi instance của các class trong một package**. Cần thiết cho các library như **JPA, JAXB, JSON-B** vốn thọc vào private member. Nếu resource được lưu trong thư mục khớp với một package trong module thì **package đó phải được `opens` cho bên gọi**. Xem [[07 - Modules and Reflective Access#Keyword opens]] và [[10 - Reflection]].

## P

**provides**
Statement mà module **cung cấp implementation cho một service** dùng: liệt kê **service interface** (có thể định nghĩa ở bất kỳ module nào) và **các class implement** (phải thuộc chính module này). Cú pháp `provides I with C1, C2;`. Thay thế cho cách cũ là đặt file text vào `META-INF/services`. Xem [[13 - Service Loading#provides và uses]] và [[04 - Service Loaders]].

## Q

**Qualified Export**
Biến thể của `exports` **thu hẹp phạm vi về một tập module được chỉ định**: `exports P to M1, M2;`. **Chỉ các module được liệt kê mới truy cập được** package đó. **Lạm dụng qualified export có thể là dấu hiệu của cấu trúc module tồi**, nhưng chúng nảy sinh khi modular hoá code base có sẵn. Xem [[12 - Qualified Exporting and Opening#12.12. Qualified Exporting and Opening]].

**Qualified Opens**
Biến thể của `opens` giới hạn về những module cụ thể: `opens P to M;`. Xem [[12 - Qualified Exporting and Opening#Qualified opens]].

## R

**Reads**
Quan hệ giữa hai module trong module graph — module M "reads" module N. Xem [[04 - Requiring Modules#Khi nào module M "reads" module N]].

**Reverse Domain Name**
Quy ước đặt tên module: **tên miền viết ngược**, y như tên package. Cách dễ nhất là **đặt tên module theo top-level package mà module cung cấp** (ví dụ `org.slf4j`). Quy ước này **ngăn xung đột tên package giữa các module** — **một package bất kỳ chỉ được đặt trong đúng một module**. Xem [[02 - Naming Modules#Tên phải duy nhất toàn cầu]].

**requires**
Statement khai báo module mà module hiện tại **dựa vào**. Mục tiêu thiết kế: module phải **tường minh về những gì mình cần**, để virtual machine **đảm bảo mọi yêu cầu được thoả mãn trước khi khởi động chương trình**. Quan hệ `requires` **không có tính transitive** theo mặc định. Sau `requires` là **tên module**. Xem [[04 - Requiring Modules#Khai báo requires]].

**requires static**
Biến thể **ít gặp**, khai báo rằng module **phải có mặt lúc compile time nhưng tuỳ chọn lúc runtime**. Hai use case: truy cập **annotation được xử lý lúc compile time** ở module khác; hoặc **dùng một class ở module khác nếu có sẵn**, không thì làm việc khác (bắt `NoClassDefFoundError`). Xem [[11 - Transitive and Static Requirements#requires static]].

**requires transitive**
Modifier khiến **mọi module require module này cũng tự động require module được khai báo transitive**. Ví dụ `java.desktop` khai báo `requires transitive java.datatransfer` và `java.xml` vì các class đó **xuất hiện trong public API**. Sách nhấn mạnh đây **không phải yêu cầu của ngôn ngữ Java**. Xem [[11 - Transitive and Static Requirements#requires transitive]].

## S

**Service**
Một interface cùng **một hoặc nhiều implementation khả dĩ**. Service consumer phải **chọn một implementation** trong số các implementation được cung cấp, dựa trên tiêu chí nó thấy phù hợp. Xem [[13 - Service Loading#Nhắc lại service loading]].

**ServiceLoader**
Class cung cấp **cơ chế nhẹ để khớp service interface với implementation**. Khi code trong module tiêu thụ gọi `ServiceLoader.load(ServiceInterface.class)`, **các provider class khớp sẽ được load, kể cả khi chúng không nằm trong package truy cập được**. Xem [[13 - Service Loading#12.13. Service Loading]] và [[04 - Service Loaders]].

## U

**Unnamed Module**
Mọi class **không nằm trên module path** đều thuộc unnamed module. Về kỹ thuật **có thể có nhiều hơn một**, nhưng tất cả **hành xử như một module duy nhất**. Truy cập được mọi module khác, toàn bộ package **được export và opened**, nhưng **không explicit module nào truy cập được nó**. Xem [[09 - The Unnamed Module#12.9. The Unnamed Module]].

**uses**
Statement mà module **tiêu thụ service** khai báo: `uses I;`. Nhờ `provides` và `uses`, module tiêu thụ **được phép truy cập các class implementation vốn là module-private**. Xem [[13 - Service Loading#provides và uses]].

## V

**Version Number (của module)**
Tuỳ chọn chỉ định khi tạo file JAR bằng argument **`--module-version`** (và thêm số version vào tên file JAR). **Java Platform Module System không dùng số version để resolve module**, nhưng **các công cụ và framework khác truy vấn được nó**. Xem [[06 - Modular JARs#Version number]].

---

## Command-line flag cho migration

| Flag | Mô tả |
|---|---|
| `--illegal-access=permit` | Mặc định của **Java 9** — in thông báo cho **lần illegal access đầu tiên** |
| `--illegal-access=warn` | In thông báo cho **mỗi lần** illegal access |
| `--illegal-access=debug` | In thông báo **kèm stack trace** cho mỗi lần |
| `--illegal-access=deny` | Mặc định của **Java 16** — **từ chối mọi** illegal access |
| `--add-exports M/P=ALL_UNNAMED` | Export package `P` của module `M` cho unnamed module |
| `--add-opens M/P=ALL-UNNAMED` | Mở `P` cho reflective access từ unnamed module |
| `@file` | Đọc option từ file |

Flag `--illegal-access` **không còn dùng được từ Java 17**. Xem [[10 - Command-Line Flags for Migration]].
