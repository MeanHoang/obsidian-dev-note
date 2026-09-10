# 14 — Tools for Working with Modules

> Chapter 9, Section 9.14 — Core Java Volume II: Advanced Features, 11th Edition (Horstmann), Java 11.
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 9.14 Tools for Working with Modules

### `jdeps` — phân tích dependency

> *"The jdeps tool analyzes the dependencies of a given set of JAR files. Suppose, for example, that you want to modularize JUnit 4. Run"*

```bash
jdeps -s junit-4.12.jar hamcrest-core-1.3.jar
```

> *"The -s flag generates a summary output:"*

```
hamcrest-core-1.3.jar -> java.base
junit-4.12.jar -> hamcrest-core-1.3.jar
junit-4.12.jar -> java.base
junit-4.12.jar -> java.management
```

> *"That tells you the module graph:"*

**Dịch:** Công cụ **`jdeps` phân tích dependency của một tập file JAR**. Flag **`-s` sinh ra output tóm tắt**, cho biết **module graph**.

```
   junit-4.12.jar ──► hamcrest-core-1.3.jar ──► java.base
        │  └─────────────────────────────────► java.base
        └────────────────────────────────────► java.management
```

> *"If you omit the -s flag, you get the module summary followed by a mapping from packages to required packages and modules. If you add the -v flag, the listing maps classes to required packages and modules."*

**Dịch:** **Bỏ flag `-s`** thì bạn có **module summary kèm theo ánh xạ từ package tới các package và module cần thiết**. **Thêm flag `-v`** thì listing **ánh xạ từ class tới package và module cần thiết**.

> *"The --generate-module-info option produces module-info files for each analyzed module:"*

```bash
jdeps --generate-module-info /tmp/junit junit-4.12.jar hamcrest-core-1.3.jar
```

**Dịch:** Option **`--generate-module-info` sinh ra file `module-info` cho mỗi module được phân tích**.

> **Note (sách):** *"There is also an option to generate graphical output in the "dot" language for describing graphs. Assuming you have the dot tool installed, run these commands:"*
>
> ```bash
> jdeps -s -dotoutput /tmp/junit junit-4.12.jar hamcrest-core-1.3.jar
> dot -Tpng /tmp/junit/summary.dot > /tmp/junit/summary.png
> ```
>
> *"You get this summary.png image:"*
>
> **Dịch:** Còn có option **sinh output đồ hoạ ở ngôn ngữ "dot"** để mô tả graph. Giả sử bạn đã cài công cụ `dot`, chạy các lệnh trên sẽ ra ảnh `summary.png`.

| Flag của `jdeps` | Công dụng |
|---|---|
| `-s` | output **tóm tắt** (module graph) |
| *(không có `-s`)* | summary + **ánh xạ package → package/module cần thiết** |
| `-v` | ánh xạ **class → package/module cần thiết** |
| `--generate-module-info <dir>` | sinh file `module-info` cho từng module phân tích |
| `-dotoutput <dir>` | sinh output đồ hoạ ở ngôn ngữ **dot** |

### `jlink` — tạo runtime image tối thiểu

> *"Use the jlink tool to produce an application that executes without a separate Java runtime. The resulting image is much smaller than the entire JDK. You specify the modules that you want to have included and an output directory."*

```bash
jlink --module-path com.horstmann.greet.jar:v2ch09.exportedpkg.jar:$JAVA_HOME/jmods \
  --add-modules v2ch09.exportedpkg --output /tmp/hello
```

**Dịch:** Dùng **`jlink`** để tạo ra một ứng dụng **chạy được mà không cần Java runtime riêng**. Image thu được **nhỏ hơn nhiều so với toàn bộ JDK**. Bạn chỉ định **các module muốn đưa vào** và **một thư mục output**.

> *"The output directory has a subdirectory bin with a java executable. If you run"*

```bash
bin/java -m v2ch09.exportedpkg
```

> *"the main method of the module's main class is invoked."*

**Dịch:** Thư mục output có **thư mục con `bin` chứa file thực thi `java`**. Chạy lệnh trên thì **method `main` của main class của module được gọi**.

> *"The point of jlink is that it bundles up the minimal set of modules required to run the application. You can list them all:"*

```bash
bin/java --list-modules
```

> *"In this example, the output is"*

```
v2ch09.exportedpkg
com.horstmann.greet
java.base@9
```

**Dịch:** Điểm mấu chốt của `jlink` là nó **gói lại tập module tối thiểu cần để chạy ứng dụng**. Bạn **liệt kê được hết chúng** bằng `--list-modules`.

> *"All modules are included in a runtime image file lib/modules. On my computer, that file is 23MB, whereas the runtime image of all JDK modules takes up 181MB. The entire application takes up 45MB, less than 10% of the JDK which is 486MB."*

**Dịch:** Mọi module được gộp vào một **file runtime image `lib/modules`**.

| Hạng mục | Kích thước (máy tác giả) |
|---|---|
| `lib/modules` của ứng dụng này | **23MB** |
| runtime image của **toàn bộ module JDK** | **181MB** |
| **toàn bộ ứng dụng** | **45MB** |
| **toàn bộ JDK** | **486MB** (ứng dụng chưa tới **10%**) |

> *"This can be the basis of a useful tool for packaging applications. You would still need to produce file sets for multiple platforms and launch scripts for the application."*

**Dịch:** Đây **có thể là nền tảng cho một công cụ đóng gói ứng dụng hữu ích**. Bạn **vẫn phải tự tạo bộ file cho nhiều nền tảng** và **script khởi chạy** cho ứng dụng.

> **Note (sách):** *"You can inspect the runtime image with the jimage command. However, the format is internal to the JVM, and runtime images are not meant to be generated or used by other tools."*
>
> **Dịch:** Bạn **soi được runtime image bằng lệnh `jimage`**. Tuy nhiên **định dạng này là nội bộ của JVM**, và runtime image **không nhằm để công cụ khác sinh ra hay sử dụng**.

### `jmod` — file module của JDK

> *"Finally, the jmod tool builds and inspects the module files that are included with the JDK. When you look into the jmods directory inside the JDK, you will find a file with extension jmod for each module. There is no longer a rt.jar file. Like JAR files, these files contain class files. In addition, they can hold native code libraries, commands, header files, configuration files, and legal notices. The JMOD files use the ZIP format. You can inspect their contents with any ZIP tool."*

**Dịch:** Cuối cùng, công cụ **`jmod` build và soi các file module đi kèm JDK**. Nhìn vào thư mục **`jmods`** bên trong JDK, bạn sẽ thấy **một file đuôi `.jmod` cho mỗi module**. **Không còn file `rt.jar` nữa.** Giống file JAR, các file này **chứa file class**; ngoài ra chúng còn giữ được **thư viện native code, command, header file, file cấu hình, và thông báo pháp lý**. File JMOD dùng **định dạng ZIP**, nên **soi nội dung bằng công cụ ZIP bất kỳ** được.

> *"Unlike JAR files, JMOD files are only useful for linking—that is, for producing runtime images. There is no need for you to produce JMOD files unless you also want to bundle binary files such as native code libraries with your modules."*

**Dịch:** Khác file JAR, **file JMOD chỉ hữu ích cho việc linking** — tức **tạo ra runtime image**. Bạn **không cần tạo file JMOD** trừ khi cũng muốn **gói kèm file nhị phân như thư viện native code** vào module của mình.

> **Note (sách):** *"Since the rt.jar and tools.jar files are no longer included with Java 9, you need to update any references to them. For example, if you referred to tools.jar in a security policy file, change it to a reference to the module:"*
>
> ```
> grant codeBase "jrt:/jdk.compiler"
> {
>     permission java.security.AllPermission;
> };
> ```
>
> *"The jrt: syntax denotes the Java runtime file."*
>
> **Dịch:** Vì **`rt.jar` và `tools.jar` không còn đi kèm Java 9**, bạn phải **cập nhật mọi tham chiếu tới chúng**. Ví dụ nếu bạn tham chiếu `tools.jar` trong **security policy file** thì **đổi sang tham chiếu tới module**. Cú pháp **`jrt:` chỉ file Java runtime**.

| Công cụ | Vai trò |
|---|---|
| `jdeps` | **phân tích dependency** của tập JAR |
| `jlink` | tạo **runtime image tối thiểu** chạy không cần Java runtime riêng |
| `jimage` | **soi** runtime image (định dạng nội bộ JVM) |
| `jmod` | build và soi **file `.jmod`** của JDK, chỉ dùng cho **linking** |

### Kết chương

> *"This brings us to the end of the chapter on the Java Platform Module System. The following chapter covers another important topic: security. Security has always been a core feature of the Java platform. As the world in which we live and compute gets more dangerous, a thorough understanding of Java security will be of increasing importance for many developers."*

**Dịch:** Tới đây kết thúc chương về Java Platform Module System. **Chương sau bàn một chủ đề quan trọng khác: security.** Security **luôn là feature cốt lõi của nền tảng Java**. Khi thế giới ta sống và tính toán **ngày càng nguy hiểm hơn**, việc **hiểu thấu đáo về Java security** sẽ **ngày càng quan trọng với nhiều lập trình viên**.

---

## Chương kế tiếp

→ [[01 - Class Loaders]] — Chapter 10: Security.
