# 14 — Tools for Working with Modules

> Chapter 12, Section 12.14 — Core Java Volume I, 13th Edition (Horstmann).
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 12.14. Tools for Working with Modules

> *"This section covers the jdeps, jlink, and jmod tools that are a part of the Java Development Kit."*

**Dịch:** Section này nói về **ba công cụ `jdeps`, `jlink` và `jmod`** — một phần của **Java Development Kit**.

### `jdeps`

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

> *"That tells you the module graph, as shown in the following figure."*

**Dịch:** Công cụ `jdeps` **phân tích dependency của một tập file JAR cho trước**. Giả sử bạn muốn **modular hoá JUnit 4**. Flag **`-s`** sinh ra **output tóm tắt**. Đó chính là **module graph**.

*(Figure 12.3: The JUnit4 Module Graph — hình ảnh, không có trong bản trích text.)*

```
junit-4.12.jar ──► hamcrest-core-1.3.jar ──► java.base
      │
      ├──────────► java.base
      └──────────► java.management
```

> *"If you omit the -s flag, you get the module summary followed by a mapping from packages to required packages and modules. If you add the v flag, the listing maps classes to required packages and modules."*

**Dịch:** Nếu **bỏ flag `-s`**, bạn nhận được **module summary kèm theo bảng ánh xạ từ package tới các package và module mà nó cần**. Nếu **thêm flag `v`**, danh sách sẽ **ánh xạ từ class tới các package và module cần thiết**.

| Cách dùng `jdeps` | Kết quả |
|---|---|
| `-s` | **Output tóm tắt** — module graph |
| (không có `-s`) | Module summary **+ ánh xạ package → package/module cần** |
| thêm `v` | Ánh xạ **class → package/module cần** |
| `--generate-module-info <dir>` | Sinh file `module-info` cho mỗi module được phân tích |

> *"The --generate-module-info option produces module-info files for each analyzed module:"*

```bash
jdeps --generate-module-info /tmp/junit junit-4.12.jar hamcrest-core-1.3.jar
```

**Dịch:** Option **`--generate-module-info`** **sinh ra file `module-info` cho từng module được phân tích**.

> **Note (sách):** *"There is also an option to generate graphical output in the “dot” language for describing graphs. Assuming you have the dot tool installed, run these commands:"*
>
> ```bash
> jdeps -s -dotoutput /tmp/junit junit-4.12.jar hamcrest-core-1.3.jar
> dot -Tpng /tmp/junit/summary.dot > /tmp/junit/summary.png
> ```
>
> *"Then summary.png looks as in the following figure."*
>
> **Dịch:** Còn có một option **sinh output đồ hoạ ở ngôn ngữ "dot"** dùng để mô tả graph. Giả sử bạn đã cài công cụ `dot`, hãy chạy các lệnh trên; khi đó `summary.png` trông như hình trong sách.

*(Figure 12.4: The Dot Output of jdeps — hình ảnh, không có trong bản trích text.)*

### `jlink`

> *"Use the jlink tool to produce an application that executes without a separate Java runtime. The resulting image is much smaller than the entire JDK. You specify the modules that you want to have included and an output directory."*

```bash
jlink --module-path com.horstmann.greet.jar:v1ch12.exportedpkg.jar:$JAVA_HOME/jmods \
  --add-modules v1ch12.exportedpkg --output /tmp/hello
```

**Dịch:** Dùng công cụ **`jlink`** để tạo ra một **application chạy được mà không cần Java runtime riêng**. **Image kết quả nhỏ hơn nhiều so với toàn bộ JDK**. Bạn **chỉ định những module muốn đưa vào** và **một thư mục output**.

> *"The output directory has a subdirectory bin with a java executable. If you run"*

```bash
bin/java -m v1ch12.exportedpkg
```

> *"the main method of the module's main class is invoked."*

**Dịch:** Thư mục output có **thư mục con `bin` chứa file thực thi `java`**. Nếu bạn chạy lệnh trên, **method `main` của main class của module sẽ được gọi**. → Xem [[06 - Modular JARs]].

> *"The point of jlink is that it bundles up the minimal set of modules required to run the application. You can list them all:"*

```bash
bin/java --list-modules
```

> *"In this example, the output is"*

```
v1ch12.exportedpkg
com.horstmann.greet
java.base@21
```

**Dịch:** Điểm mấu chốt của `jlink` là nó **gói lại tập module tối thiểu cần để chạy application**. Bạn **liệt kê được tất cả chúng**.

> *"All modules are included in a runtime image file lib/modules. On my computer, that file is 29MB, whereas the runtime image of all JDK modules takes up 133MB. The entire application takes up 55MB, a fraction of the size of the JDK."*

**Dịch:** Mọi module được đưa vào **một file runtime image `lib/modules`**. Trên máy của tác giả, file đó **nặng 29MB**, trong khi runtime image của **toàn bộ module JDK chiếm 133MB**. **Cả application chiếm 55MB** — chỉ **một phần nhỏ so với kích thước JDK**.

| Thành phần | Kích thước (theo sách) |
|---|---|
| `lib/modules` của application | **29MB** |
| Runtime image của **toàn bộ module JDK** | **133MB** |
| Toàn bộ application | **55MB** |

> *"This can be the basis of a useful tool for packaging applications. You would still need to produce file sets for multiple platforms and launch scripts for the application."*

**Dịch:** Đây có thể là **nền tảng cho một công cụ đóng gói application hữu ích**. Bạn vẫn sẽ cần **tạo file set cho nhiều nền tảng** và **launch script cho application**.

> **Note (sách):** *"You can inspect the runtime image with the jimage command. However, the format is internal to the JVM, and runtime images are not meant to be generated or used by other tools."*
>
> **Dịch:** Bạn có thể **khảo sát runtime image bằng lệnh `jimage`**. Tuy nhiên, **định dạng này là nội bộ của JVM**, và runtime image **không nhằm để công cụ khác sinh ra hay sử dụng**.

### `jmod`

> *"Finally, the jmod tool builds and inspects the module files that are included with the JDK. When you look into the jmods directory inside the JDK, you will find a file with extension jmod for each module. There is no longer a rt.jar file."*

**Dịch:** Cuối cùng, công cụ **`jmod`** **build và khảo sát các module file đi kèm JDK**. Khi nhìn vào thư mục `jmods` bên trong JDK, bạn sẽ thấy **một file đuôi `jmod` cho mỗi module**. **Không còn file `rt.jar` nữa.**

> *"Like JAR files, these files contain class files. In addition, they can hold native code libraries, commands, header files, configuration files, and legal notices. The JMOD files use the ZIP format. You can inspect their contents with any ZIP tool."*

**Dịch:** Giống file JAR, các file này **chứa file class**. Ngoài ra chúng còn có thể chứa **thư viện native code, command, header file, configuration file và legal notice**. File JMOD dùng **định dạng ZIP** — bạn **mở xem nội dung được bằng bất kỳ công cụ ZIP nào**. → Xem [[09 - JAR Files]].

> *"Unlike JAR files, JMOD files are only useful for linking—that is, for producing runtime images. There is no need for you to produce JMOD files unless you also want to bundle binary files such as native code libraries with your modules."*

**Dịch:** Khác với file JAR, **file JMOD chỉ hữu ích cho việc linking** — tức là **để tạo ra runtime image**. Bạn **không cần tạo file JMOD**, trừ khi bạn cũng muốn **đóng gói file binary như thư viện native code kèm module của mình**.

| Công cụ | Nhiệm vụ |
|---|---|
| `jdeps` | **Phân tích dependency** của một tập file JAR |
| `jlink` | Tạo **application chạy không cần Java runtime riêng** (runtime image) |
| `jmod` | **Build và khảo sát** module file đi kèm JDK; chỉ dùng cho linking |
| `jimage` | Khảo sát runtime image (định dạng nội bộ JVM) |

---

## Hết Volume I

> *"This brings us to the end of the chapter on the Java Platform Module System, and this book. Hopefully you have enjoyed your in-depth tour through the core features of the Java language and platform, and are ready to put your knowledge to work in your projects."*

**Dịch:** Đến đây là **hết chương về Java Platform Module System, và hết cuốn sách này**. Hy vọng bạn đã **tận hưởng chuyến tham quan chuyên sâu qua những tính năng cốt lõi của ngôn ngữ và platform Java**, và **sẵn sàng đem kiến thức của mình ra dùng trong các project**.

→ [[00 - Lộ trình Java (roadmap)]]
