# 10 — Command-Line Flags for Migration

> Chapter 9, Section 9.10 — Core Java Volume II: Advanced Features, 11th Edition (Horstmann), Java 11.
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 9.10 Command-Line Flags for Migration

### Không dùng module vẫn không thoát khỏi thế giới modular

> *"Even if your programs do not use modules, you cannot escape the modular world when using Java 9 and beyond. Even if the application code resides on the class path in an unnamed module and all packages are exported and opened, it interacts with the Java platform, which is modularized."*

**Dịch:** Ngay cả khi chương trình của bạn **không dùng module**, bạn **cũng không thoát khỏi thế giới modular** khi dùng Java 9 trở đi. Dù code ứng dụng **nằm trên class path trong unnamed module** và **mọi package đều exported và opened**, nó **vẫn tương tác với nền tảng Java — thứ đã được modular hoá**.

### `--illegal-access` — bốn mức

> *"Up to Java 11, the default behavior is to permit illegal module access but to display a warning on the console for the first instance of each offense. In a future version of Java, the default behavior will change, and illegal access with be denied. In order to give you time to prepare for that change, you should test your applications with the --illegal-access flag. There are four possible settings:"*
>
> 1. *"--illegal-access=permit is the Java 9 default behavior, printing a message for the first instance of illegal access."*
> 2. *"--illegal-access=warn prints a message for each illegal access."*
> 3. *"--illegal-access=debug prints a message and stack trace for each illegal access."*
> 4. *"--illegal-access=deny is the future default behavior, denying all illegal access."*

**Dịch:** **Tới Java 11**, hành vi mặc định là **cho phép truy cập module bất hợp lệ** nhưng **hiện warning trên console cho lần vi phạm đầu tiên của mỗi loại**. Ở **phiên bản Java tương lai**, hành vi mặc định **sẽ đổi và truy cập bất hợp lệ bị từ chối**. Để bạn có thời gian chuẩn bị, **nên test ứng dụng với flag `--illegal-access`**. Có **bốn mức**:

| Giá trị | Hành vi |
|---|---|
| `--illegal-access=permit` | **Mặc định của Java 9** — in thông báo cho **lần illegal access đầu tiên** |
| `--illegal-access=warn` | In thông báo cho **mỗi lần** illegal access |
| `--illegal-access=debug` | In thông báo **kèm stack trace** cho mỗi lần illegal access |
| `--illegal-access=deny` | **Hành vi mặc định trong tương lai** — **từ chối mọi** illegal access |

> *"Now is the time to test with --illegal-access=deny so you can be ready when that behavior becomes the default."*

**Dịch:** **Giờ là lúc test với `--illegal-access=deny`** để **sẵn sàng khi hành vi đó thành mặc định**.

### `--add-exports` — export thủ công từ dòng lệnh

> *"Consider an application that uses an internal API that is no longer accessible, such as com.sun.rowset.CachedRowSetImpl. The best remedy is to change the implementation. (As of Java 7, you can get a cached row set from a RowSetProvider.) But suppose you don't have access to the source code."*

**Dịch:** Xét một ứng dụng dùng **internal API không còn truy cập được**, ví dụ `com.sun.rowset.CachedRowSetImpl`. **Cách chữa tốt nhất là sửa implementation** (từ Java 7, lấy cached row set từ `RowSetProvider` được). Nhưng giả sử bạn **không có source code**.

> *"In that case, start the application with the --add-exports flag. Specify the module and the package that you want to export, and the module to which you want to export the package, which in our case is the unnamed module."*

```bash
java --illegal-access=deny --add-exports java.sql.rowset/com.sun.rowset=ALL_UNNAMED \
  -jar MyApp.jar
```

**Dịch:** Khi đó, khởi chạy ứng dụng với flag **`--add-exports`**. Chỉ định **module và package muốn export**, cùng **module mà bạn muốn export package đó tới** — trong trường hợp này là **unnamed module**.

> *(Chép nguyên văn bản in trang 518: `--add-exports java.sql.rowset/com.sun.rowset=ALL_UNNAMED` — dùng dấu gạch dưới, trong khi bản in trang 519 ở ví dụ `--add-opens` lại ghi `ALL-UNNAMED` với dấu gạch nối. Đã đối chiếu ảnh trang PDF: đây không phải lỗi bóc tách văn bản mà là typo của bản in; tên module đích đúng theo `java` launcher là `ALL-UNNAMED`.)*

### `--add-opens` — mở package cho reflection từ dòng lệnh

> *"Now, suppose your application uses reflection to access private fields or methods. Reflection inside the unnamed module is OK, but it is no longer possible to reflectively access non-public members of the Java platform classes. For example, some libraries that dynamically generate Java classes call the protected ClassLoader.defineClass method through reflection. If an application uses such a library, add the flag"*

```bash
--add-opens java.base/java.lang=ALL-UNNAMED
```

**Dịch:** Giả sử ứng dụng của bạn **dùng reflection để truy cập private field hoặc method**. **Reflection bên trong unnamed module thì không sao**, nhưng **không còn truy cập được member không public của các class thuộc nền tảng Java bằng reflection**. Ví dụ, một số thư viện **sinh class Java động** gọi method `protected` **`ClassLoader.defineClass`** qua reflection. Nếu ứng dụng dùng thư viện như vậy thì **thêm flag `--add-opens`**.

| Flag | Công dụng |
|---|---|
| `--add-exports module/package=target` | **export** package của một module tới module đích (thường là `ALL-UNNAMED`) |
| `--add-opens module/package=target` | **open** package cho **reflective access** tới module đích |

### File `@options` cho dòng lệnh dài

> *"When adding all those command-line options to get a legacy app to work, you may well end up with the command line from hell. To better manage multiple options, you can put them in one or more files specified with an @ prefix. For example,"*

```bash
java @options1 @options2 -jar MyProg.java
```

> *"where the files options1 and options2 contain options for the java command. There are a few syntax rules for the options files:"*
>
> - *"Separate options with spaces, tabs, or newlines."*
> - *"Use double quotes around arguments that include spaces, such as "Program Files"."*
> - *"A line ending in a \ is merged with the next line."*
> - *"Backslashes must be escaped, such as C:\\Users\\Fred."*
> - *"Comment lines start with #."*

**Dịch:** Khi phải thêm hết đống option dòng lệnh để một **legacy app** chạy được, bạn rất dễ có **một dòng lệnh địa ngục**. Để quản lý nhiều option cho tốt, **đặt chúng vào một hoặc nhiều file** rồi chỉ định với **tiền tố `@`**. Quy tắc cú pháp của file option:

| Quy tắc |
|---|
| Ngăn cách các option bằng **dấu cách, tab, hoặc xuống dòng** |
| Dùng **dấu nháy kép** quanh argument có chứa dấu cách, ví dụ `"Program Files"` |
| Dòng **kết thúc bằng `\`** được **gộp với dòng kế tiếp** |
| **Dấu backslash phải được escape**, ví dụ `C:\\Users\\Fred` |
| **Dòng comment bắt đầu bằng `#`** |

---

## Bài kế tiếp

→ [[11 - Transitive and Static Requirements (Vol II)]] — `requires transitive`, aggregator module, và `requires static`.
