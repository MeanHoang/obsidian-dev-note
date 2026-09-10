# 10 — Command-Line Flags for Migration

> Chapter 12, Section 12.10 — Core Java Volume I, 13th Edition (Horstmann).
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 12.10. Command-Line Flags for Migration

> *"Even if your programs do not use modules, you cannot escape the modular world when using Java 9 and beyond. Your application code may reside on the class path in an unnamed module, so that all packages are exported and opened. Still, the code interacts with the Java platform, which is modularized."*

**Dịch:** **Ngay cả khi chương trình của bạn không dùng module**, bạn vẫn **không thoát khỏi thế giới modular** khi dùng Java 9 trở đi. Code application của bạn có thể nằm trên class path trong một [[09 - The Unnamed Module|unnamed module]], nên **mọi package đều được export và opened**. Nhưng code đó vẫn **tương tác với Java platform — thứ đã được modular hoá**.

### `--illegal-access`

> *"As of Java 11, compile-time encapsulation is strictly enforced. However, before Java 16, runtime access was permitted. The default behavior was to display a warning on the console for the first instance of each offense. As of Java 16, reflective access at runtime is also enforced. In order to give you time to prepare for that change, the java launcher in Java 9 through 16 had an --illegal-access flag with four possible settings:"*

**Dịch:** **Từ Java 11**, **encapsulation lúc compile-time được thực thi nghiêm ngặt**. Tuy nhiên, **trước Java 16**, **truy cập lúc runtime vẫn được cho phép** — hành vi mặc định là **hiện một cảnh báo trên console cho lần vi phạm đầu tiên của mỗi loại lỗi**. **Từ Java 16**, **reflective access lúc runtime cũng bị thực thi**. Để cho bạn thời gian chuẩn bị cho thay đổi đó, **launcher `java` từ Java 9 tới Java 16 có flag `--illegal-access`** với **bốn giá trị** khả dĩ.

> *"1. --illegal-access=permit was the Java 9 default behavior, printing a message for the first instance of illegal access.
> 2. --illegal-access=warn prints a message for each illegal access.
> 3. --illegal-access=debug prints a message and stack trace for each illegal access.
> 4. --illegal-access=deny was the Java 16 default behavior, denying all illegal access."*

| Setting | Mô tả (dịch từ sách) |
|---|---|
| `--illegal-access=permit` | Là **hành vi mặc định của Java 9**; in một thông báo cho **lần illegal access đầu tiên** |
| `--illegal-access=warn` | In một thông báo cho **mỗi lần illegal access** |
| `--illegal-access=debug` | In một thông báo **kèm stack trace** cho mỗi lần illegal access |
| `--illegal-access=deny` | Là **hành vi mặc định của Java 16**; **từ chối mọi illegal access** |

> *"The --illegal-access flag is no longer usable as of Java 17."*

**Dịch:** Flag `--illegal-access` **không còn dùng được từ Java 17**.

### `--add-exports`

> *"The --add-exports and --add-opens flags allow you to tweak legacy applications. Consider an application that uses an internal API which is no longer accessible, such as com.sun.rowset.CachedRowSetImpl. The best remedy is to change the implementation. (As of Java 7, you can get a cached row set from a RowSetProvider.) But suppose you don't have access to the source code."*

**Dịch:** Hai flag **`--add-exports` và `--add-opens`** cho phép bạn **chỉnh sửa các application legacy**. Hãy xét một application dùng **internal API không còn truy cập được**, chẳng hạn `com.sun.rowset.CachedRowSetImpl`. **Cách chữa tốt nhất là sửa implementation** (từ Java 7, bạn lấy được cached row set từ một `RowSetProvider`). Nhưng giả sử bạn **không có source code**.

> *"In that case, start the application with the --add-exports flag. Specify the module and the package that you want to export, and the module to which you want to export the package, which in our case is the unnamed module."*

```bash
java --add-exports java.sql.rowset/com.sun.rowset=ALL_UNNAMED \
  -jar MyApp.jar
```

**Dịch:** Khi đó, hãy **khởi động application với flag `--add-exports`**. Chỉ định **module và package bạn muốn export**, cùng **module mà bạn muốn export package đó tới** — trong trường hợp này là **unnamed module**.

```
--add-exports  <module>/<package>=<module đích>
                  ↑          ↑          ↑
             java.sql.rowset  com.sun.rowset  ALL_UNNAMED
```

### `--add-opens`

> *"Now, suppose your application uses reflection to access private fields or methods. Reflection inside the unnamed module is OK, but it is no longer possible to reflectively access non-public members of the Java platform classes. For example, some libraries that dynamically generate Java classes call the protected ClassLoader.defineClass method through reflection. If an application uses such a library, add the flag"*

```bash
--add-opens java.base/java.lang=ALL-UNNAMED
```

**Dịch:** Giờ giả sử application của bạn dùng **reflection để truy cập private field hoặc method**. **Reflection bên trong unnamed module thì không sao**, nhưng **không còn truy cập reflective được các member non-public của class thuộc Java platform**. Ví dụ, một số thư viện sinh class Java động **gọi method `protected` `ClassLoader.defineClass` qua reflection**. Nếu application dùng thư viện như vậy, hãy **thêm flag trên**. → Xem [[10 - Reflection]] và [[07 - Modules and Reflective Access]].

### File chứa option

> *"When adding all those command-line options to get a legacy app to work, you may well end up with the command line from hell. To better manage multiple options, you can put them in one or more files specified with an @ prefix. For example,"*

```bash
java @options1 @options2 -jar MyProg.java
```

> *"where the files options1 and options2 contain options for the java command."*

**Dịch:** Khi phải thêm hàng loạt command-line option để một app legacy chạy được, bạn rất dễ có một **"command line from hell"**. Để quản lý nhiều option tốt hơn, bạn có thể **đặt chúng vào một hoặc nhiều file, chỉ định bằng tiền tố `@`**. Ở ví dụ trên, file `options1` và `options2` **chứa các option cho lệnh `java`**.

> *"There are a few syntax rules for the options files:"*

> *"Separate options with spaces, tabs, or newlines.
> Use double quotes around arguments that include spaces, such as "Program Files".
> A line ending in a \ is merged with the next line.
> Backslashes must be escaped, such as C:\\Users\\Fred.
> Comment lines start with #."*

**Dịch:** Có vài **quy tắc cú pháp** cho file option:

| Quy tắc |
|---|
| **Ngăn cách các option** bằng **space, tab hoặc newline** |
| Dùng **dấu nháy kép** quanh argument có chứa space, ví dụ `"Program Files"` |
| Dòng **kết thúc bằng `\`** sẽ được **nối với dòng kế tiếp** |
| **Backslash phải được escape**, ví dụ `C:\\Users\\Fred` |
| **Dòng comment bắt đầu bằng `#`** |

---

## Bài kế tiếp

→ [[11 - Transitive and Static Requirements]] — hai biến thể `requires transitive` và `requires static` của statement `requires`.
