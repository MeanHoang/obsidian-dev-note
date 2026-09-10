# Glossary — The Java Platform Module System (Vol II)

> Thuật ngữ Chapter 9: The Java Platform Module System. Định nghĩa lấy từ Core Java Volume II: Advanced Features, 11th Edition (Horstmann), Java 11.

## A

**Aggregator Module**
Module **không có package nào và chỉ có các transitive requirement**. Ví dụ `java.se`: require nó là có toàn bộ module của nền tảng Java SE. Xem [[11 - Transitive and Static Requirements (Vol II)#9.11 Transitive and Static Requirements]].

**Automatic Module**
File JAR **không có `module-info.class`** nhưng nằm **trên module path**. Bốn tính chất: ngầm có `requires` tới **mọi module khác** · **mọi package đều exported và opened** · tên module lấy từ entry **`Automatic-Module-Name`** trong manifest · nếu không có thì lấy từ **tên file JAR**, bỏ số version ở đuôi và thay ký tự không phải chữ-số bằng dấu chấm. Xem [[08 - Automatic Modules (Vol II)#9.8 Automatic Modules]].

**`Automatic-Module-Name`**
Entry trong `META-INF/MANIFEST.MF` của file JAR, giá trị của nó **trở thành tên của automatic module**. Xem [[08 - Automatic Modules (Vol II)#9.8 Automatic Modules]].

## B

**Boot Layer**
Layer mà Java Platform Module System **load module của JDK và module ứng dụng vào**. Xem [[06 - Modular JARs (Vol II)#Layer — "class loader của module"]].

## E

**`exports`**
Keyword khai báo **package nào của module truy cập được từ ngoài**. Theo sau `exports` là **tên package** (còn theo sau `requires` là **tên module**). Package được export thì class/interface `public` và `protected` cùng member `public`/`protected` của chúng truy cập được ngoài module; package **không export thì không truy cập được từ ngoài module**. Xem [[05 - Exporting Packages (Vol II)#9.5 Exporting Packages]].

**Explicit Module**
Module **không phải automatic cũng không phải unnamed** — tức module **có `module-info.class` trên module path**. Explicit module **không truy cập được unnamed module**, nhờ vậy **luôn thoát khỏi "class path hell"**. Xem [[09 - The Unnamed Module (Vol II)#9.9 The Unnamed Module]].

## J

**`jdeps`**
Công cụ **phân tích dependency của một tập file JAR**. Flag `-s` cho summary (module graph), `-v` ánh xạ class → package/module, `--generate-module-info` sinh file `module-info`, `-dotoutput` sinh output ngôn ngữ "dot". Xem [[14 - Tools for Working with Modules (Vol II)#`jdeps` — phân tích dependency]].

**`jimage`**
Lệnh để **soi runtime image**. Định dạng này **nội bộ của JVM**, runtime image **không nhằm để công cụ khác sinh ra hay dùng**. Xem [[14 - Tools for Working with Modules (Vol II)#`jlink` — tạo runtime image tối thiểu]].

**`jlink`**
Công cụ tạo ứng dụng **chạy được mà không cần Java runtime riêng**, gói lại **tập module tối thiểu**. Ví dụ trong sách: ứng dụng 45MB so với JDK 486MB (**chưa tới 10%**). Xem [[14 - Tools for Working with Modules (Vol II)#`jlink` — tạo runtime image tối thiểu]].

**`jmod` / JMOD file**
Công cụ **build và soi file module đi kèm JDK**; mỗi module trong thư mục `jmods` có một file đuôi `.jmod`. **Không còn `rt.jar`.** Ngoài file class, JMOD giữ được **native code library, command, header file, file cấu hình, thông báo pháp lý**. Dùng **định dạng ZIP**. Khác JAR, **chỉ hữu ích cho linking** (tạo runtime image). Xem [[14 - Tools for Working with Modules (Vol II)#`jmod` — file module của JDK]].

**`jrt:`**
Cú pháp **chỉ file Java runtime**, dùng thay cho tham chiếu tới `rt.jar` / `tools.jar` (đã bị gỡ từ Java 9), ví dụ trong security policy file: `grant codeBase "jrt:/jdk.compiler"`. Xem [[14 - Tools for Working with Modules (Vol II)#`jmod` — file module của JDK]].

## L

**Layer**
Thứ **tương đương với class loader ở cấp module**. Chương trình load được module khác bằng **layer API** (sách không bàn tới); chương trình như vậy **có thể tính tới version của module**. Xem [[06 - Modular JARs (Vol II)#Layer — "class loader của module"]].

## M

**Module (Java platform module)**
Gồm: **một tập package** · tuỳ chọn **resource file và file khác** như native library · **danh sách package truy cập được** · **danh sách mọi module mà nó phụ thuộc**. Nền tảng Java **cưỡng chế encapsulation và dependency cả lúc compile lẫn trong virtual machine**. Xem [[01 - The Module Concept (Vol II)#9.1 The Module Concept]].

**Module Declaration**
Khai báo module, đặt trong file **`module-info.java`** ở **base directory** (theo quy ước, tên base directory trùng tên module). Compile thành **`module-info.class`** chứa định nghĩa module ở dạng nhị phân. **Annotate được** (kiểu annotation phải có target `ElementType.MODULE`). Xem [[03 - The Modular Hello World Program (Vol II)#`module-info.java` và cấu trúc thư mục]].

**Module Graph**
Graph có **node là module**, **cạnh là yêu cầu được khai báo** hoặc **yêu cầu ngầm định lên `java.base`**. **Không được có cycle** — một module không được require chính nó, dù trực tiếp hay gián tiếp. Xem [[04 - Requiring Modules (Vol II)#Module graph]].

**Module Name**
Gồm **chữ cái, chữ số, dấu gạch dưới và dấu chấm**, giống path name. **Không có quan hệ phân cấp giữa các module.** Nên theo quy ước **reverse domain name**, đặt theo **top-level package** mà module cung cấp. Tên module **chỉ dùng trong module declaration**, không bao giờ nhắc tới trong file nguồn class. Xem [[02 - Naming Modules (Vol II)#9.2 Naming Modules]].

**Module Path**
Tương tự class path nhưng **chứa module**. Option `--module-path` (ngắn: `-p`). Xem [[03 - The Modular Hello World Program (Vol II)#Chạy: module path và main class]].

**Modular JAR**
File JAR chứa mọi class của module, với **`module-info.class` ở thư mục gốc**. Build tool như Maven/Ant/Gradle cứ build như thường — **miễn có `module-info.class` là thành modular JAR**. Chỉ định version bằng **`--module-version`** kèm **`@version` trong tên file JAR** (version **không dùng để resolve module**, nhưng công cụ khác truy vấn được). Xem [[06 - Modular JARs (Vol II)#9.6 Modular JARs]].

## O

**Open Module**
Module khai báo với keyword **`open`**. Cấp **quyền truy cập lúc runtime cho MỌI package**, như thể mọi package đều `exports` và `opens`; nhưng **lúc compile time chỉ package được export tường minh mới truy cập được**. Kết hợp **an toàn compile-time** với **hành vi runtime dễ dãi kiểu cổ điển**. Xem [[07 - Modules and Reflective Access (Vol II)#Open module]].

**`opens`**
Keyword **mở một package**, cho phép **reflective access tới mọi instance của class trong package đó**. Cần thiết cho các thư viện như **JPA, JAXB, JSON-B**. Thiếu nó thì reflection ném **`InaccessibleObjectException`**. Xem [[07 - Modules and Reflective Access (Vol II)#`opens` — mở package cho reflective access]].

**Options File (`@`)**
File chứa option cho lệnh `java`, chỉ định với **tiền tố `@`** (ví dụ `java @options1 @options2`). Quy tắc: ngăn cách bằng **dấu cách/tab/xuống dòng** · **nháy kép** quanh argument có dấu cách · dòng kết thúc bằng `\` **gộp với dòng kế** · **backslash phải escape** · **comment bắt đầu bằng `#`**. Xem [[10 - Command-Line Flags for Migration (Vol II)#File `@options` cho dòng lệnh dài]].

## P

**`provides ... with`**
Statement trong module descriptor **thay cho file `META-INF/services`**: liệt kê **service interface** (định nghĩa ở module bất kỳ) và **class implement** (**phải thuộc module này**). Xem [[13 - Service Loading (Vol II)#`provides` thay cho file `META-INF/services`]].

## Q

**Qualified Export / Qualified Opens**
Biến thể **thu hẹp phạm vi** của `exports` / `opens` về **một tập module được chỉ định**: `exports p to M1, M2;` và `opens p to M;`. **Dùng quá nhiều qualified export có thể là dấu hiệu cấu trúc modular kém**, nhưng hay phát sinh khi **modular hoá code base có sẵn**. Xem [[12 - Qualified Exporting and Opening (Vol II)#9.12 Qualified Exporting and Opening]].

## R

**"Reads" (module M reads module N)**
Cách nói của Java Platform Module System. M reads N khi: **M requires N** · M requires một module **transitively requires N** · **N chính là M hoặc là `java.base`**. Xem [[04 - Requiring Modules (Vol II)#Khi nào module M "reads" module N]].

**Reliable Configuration**
Một trong hai lợi thế của module system: **tránh các vấn đề class path thường gặp** như **class trùng lặp hoặc thiếu class**. Xem [[01 - The Module Concept (Vol II)#Hai lợi thế so với JAR trên class path]].

**`requires`**
Keyword khai báo module này **dựa vào module khác**. Mục tiêu thiết kế: module **tường minh về yêu cầu của mình** để VM **đảm bảo mọi yêu cầu được thoả mãn trước khi chạy**. Quan hệ `requires` **KHÔNG transitive**. `java.base` **được require mặc định**. Xem [[04 - Requiring Modules (Vol II)#9.4 Requiring Modules]].

**`requires static`**
Biến thể **ít gặp**: module **phải có mặt lúc compile time nhưng tuỳ chọn lúc runtime**. Hai trường hợp dùng: **annotation xử lý lúc compile time ở module khác** · **dùng class ở module khác nếu có sẵn**, không thì làm việc khác (bắt `NoClassDefFoundError`). Xem [[11 - Transitive and Static Requirements (Vol II)#`requires static`]].

**`requires transitive`**
Biến thể khiến **mọi module require module này cũng tự động require module được nêu**. Ví dụ `javafx.controls requires transitive javafx.base`. Sách nhấn mạnh: khuyến nghị "luôn dùng transitive khi package của module khác xuất hiện trong public API" **không phải quy tắc của ngôn ngữ Java**. Xem [[11 - Transitive and Static Requirements (Vol II)#`requires transitive`]].

**Restricted Keyword**
Keyword như `module`, `requires`, `exports`, ... **chỉ mang nghĩa đặc biệt trong module declaration**. Xem [[03 - The Modular Hello World Program (Vol II)#`module-info` không phải class thường]].

## S

**Split Package**
Package có class **bị rải ra nhiều file JAR**. Sách nói **có lẽ chưa bao giờ là ý hay**, và **với module thì không làm được**. Xem [[06 - Modular JARs (Vol II)#⚠️ Split package không còn được]].

**Strong Encapsulation**
Lợi thế thứ nhất của module system: **kiểm soát được package nào truy cập được**, **không phải lo bảo trì code vốn không định cho người ngoài dùng**. Xem [[01 - The Module Concept (Vol II)#Hai lợi thế so với JAR trên class path]].

## U

**Unnamed Module**
**Mọi class không nằm trên module path**. Về kỹ thuật có thể có nhiều, nhưng **tất cả hành xử như một module duy nhất**. Giống automatic module: **truy cập được mọi module khác**, **mọi package đều exported và opened**. Nhưng **không explicit module nào truy cập được nó**. Xem [[09 - The Unnamed Module (Vol II)#9.9 The Unnamed Module]].

**`uses`**
Statement trong module descriptor của **bên tiêu thụ service**, khai báo service interface đang dùng. Khi gọi `ServiceLoader.load(...)`, **class provider khớp sẽ được load kể cả khi không nằm trong package truy cập được**. Xem [[13 - Service Loading (Vol II)#`uses` ở phía tiêu thụ]].

## V

**`VarHandle`**
Thứ **tương tự một `Field`**, dùng để đọc/ghi **một field cụ thể của bất kỳ instance nào của một class cụ thể**. Muốn lấy `VarHandle` thì code thư viện **cần một object `Lookup`**, sinh ra trong module có quyền truy cập field (qua `MethodHandles.lookup()`). Nhờ đó **một module cấp được quyền truy cập private member cho module khác**. Xem [[07 - Modules and Reflective Access (Vol II)#VarHandle thay cho reflection]].

**Versioning (điều module system KHÔNG làm)**
Java Platform Module System **không hỗ trợ versioning module**: không chỉ định được **cần version nào**, cũng không dùng được **nhiều version của cùng module trong một chương trình**. Cần thì **phải dùng cơ chế khác**. Xem [[01 - The Module Concept (Vol II)#Điều module system KHÔNG giải quyết]].

---

## Flag dòng lệnh cho migration

| Flag | Ý nghĩa |
|---|---|
| `--illegal-access=permit` | mặc định Java 9 — báo **lần vi phạm đầu tiên** |
| `--illegal-access=warn` | báo **mỗi lần** vi phạm |
| `--illegal-access=debug` | báo **kèm stack trace** mỗi lần vi phạm |
| `--illegal-access=deny` | **mặc định trong tương lai** — từ chối mọi illegal access |
| `--add-exports module/package=target` | export thủ công một package tới module đích |
| `--add-opens module/package=target` | open thủ công một package cho reflective access |

Xem [[10 - Command-Line Flags for Migration (Vol II)]].

## Module bị gỡ khỏi Java 11

`java.xml.bind` · `java.activation` · `java.corba` · `java.transaction` · `java.xml.ws` · `java.xml.ws.annotation` — vì chứa package **cũng thuộc đặc tả Jakarta EE**, và **enterprise application server không modular hoá được nếu JDK có package xung đột**. Xem [[07 - Modules and Reflective Access (Vol II)#Các module bị gỡ khỏi Java 11]].
