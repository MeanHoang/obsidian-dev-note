# 06 — Modular JARs

> Chapter 9, Section 9.6 — Core Java Volume II: Advanced Features, 11th Edition (Horstmann), Java 11.
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 9.6 Modular JARs

### Modular JAR là gì

> *"So far, we have simply compiled modules into the directory tree of the source code. Clearly, that is not satisfactory for deployment. Instead, a module can be deployed by placing all its classes in a JAR file, with a module-info.class in the root. Such a JAR file is called a modular JAR."*

**Dịch:** Tới giờ ta chỉ compile module vào **cây thư mục của source code**. Rõ ràng cách đó **không ổn cho deployment**. Thay vào đó, một module được deploy bằng cách **đặt mọi class của nó vào một file JAR, với `module-info.class` ở thư mục gốc**. File JAR như vậy gọi là **modular JAR**. (Xem [[09 - JAR Files]].)

### Tạo modular JAR

> *"To create a modular JAR file, use the jar tool in the usual way. If you have multiple packages, it is best to compile with the -d option which places class files into a separate directory. The directory is created if it doesn't already exists. Then use the -C option of the jar command to change to that directory when collecting files."*

```bash
javac -d modules/com.horstmann.greet $(find com.horstmann.greet -name *.java)
jar -cvf com.horstmann.greet.jar -C modules/com.horstmann.greet .
```

**Dịch:** Để tạo modular JAR, dùng **công cụ `jar` như bình thường**. Nếu có nhiều package thì nên compile với **option `-d`** để đặt file class vào **thư mục riêng** (thư mục được tạo nếu chưa tồn tại). Rồi dùng **option `-C`** của lệnh `jar` để **chuyển vào thư mục đó khi thu gom file**.

> *"If you use a build tool such as Maven, Ant, or Gradle, just keep building your JAR file as you always do. As long as module-info.class is included, you get a modular JAR."*

**Dịch:** Nếu dùng build tool như **Maven, Ant, Gradle** thì cứ **build JAR như thường lệ**. Miễn là **`module-info.class` được đưa vào**, bạn có một modular JAR.

> *"Then, include the modular JAR in the module path, and the module will be loaded."*

**Dịch:** Sau đó **đưa modular JAR vào module path**, và module sẽ được load.

### ⚠️ Split package không còn được

> **Caution (sách):** *"In the past, classes of a package were sometimes distributed over multiple JAR files. (Such a package is called a "split package".) This was probably never a good idea, and it is not possible with modules."*
>
> **Dịch:** Trước kia, class của một package **đôi khi bị rải ra nhiều file JAR** (package như vậy gọi là **"split package"**). Chuyện đó **có lẽ chưa bao giờ là ý hay**, và **với module thì không làm được**.

### Main class trong modular JAR

> *"As with regular JAR files, you can specify a main class in a modular JAR:"*

```bash
javac -p com.horstmann.greet.jar \
  -d modules/v2ch09.exportedpkg $(find v2ch09.exportedpkg -name *.java)

jar -c -v -f v2ch09.exportedpkg.jar -e com.horstmann.hello.HelloWorld \
  -C modules/v2ch09.exportedpkg .
```

> *"When you launch the program, you specify the module containing the main class:"*

```bash
java -p com.horstmann.greet.jar:v2ch09.exportedpkg.jar -m v2ch09.exportedpkg
```

**Dịch:** Như với JAR thường, bạn **chỉ định được main class trong modular JAR**. Khi khởi chạy chương trình, bạn **chỉ định module chứa main class** (không cần ghi tên class nữa).

### Version number cho JAR

> *"When creating a JAR file, you can optionally specify a version number. Use the --module-version parameter, and also add @ and the version number to the JAR file name:"*

```bash
jar -c -v -f com.horstmann.greet@1.0.jar --module-version 1.0 -C com.horstmann.greet .
```

> *"As already discussed, the version number is not used by the Java Platform Module System for resolving modules, but it can be queried by other tools and frameworks."*

**Dịch:** Khi tạo file JAR, bạn **tuỳ chọn chỉ định số version**. Dùng parameter **`--module-version`**, đồng thời **thêm `@` và số version vào tên file JAR**. Như đã bàn, **số version không được Java Platform Module System dùng để resolve module**, nhưng **các công cụ và framework khác truy vấn được nó**.

> **Note (sách):** *"You can find out the version number through the reflection API. In our example:"*
>
> ```java
> Optional<String> version = Greeter.class.getModule().getDescriptor().rawVersion();
> ```
>
> *"yields an Optional containing the version string "1.0"."*
>
> **Dịch:** Bạn tra được số version qua **reflection API** (xem [[10 - Reflection]]). Lời gọi trên cho ra một `Optional` **chứa chuỗi version `"1.0"`**.

### Layer — "class loader của module"

> **Note (sách):** *"The module equivalent to a class loader is a layer. The Java Platform Module System loads the JDK modules and application modules into the boot layer. A program can load other modules, using the layer API (which is not covered in this book). Such a program may choose to take module versions into account. Is is expected that developers of programs such as Java EE application servers will make use of the layer API to provide support for modules."*
>
> **Dịch:** Thứ tương đương với **class loader** ở cấp module là **layer**. Java Platform Module System load **module của JDK và module ứng dụng vào boot layer**. Một chương trình **load được module khác** bằng **layer API** (sách không bàn tới). Chương trình như vậy **có thể chọn tính tới version của module**. Người ta kỳ vọng lập trình viên của các chương trình như **Java EE application server** sẽ dùng layer API để **hỗ trợ module**.

> **Tip (sách):** *"If you want to load a module into JShell, include the JAR on the module path and use the --add-modules option:"*
>
> ```bash
> jshell --module-path com.horstmann.greet@1.0.jar --add-modules com.horstmann.greet
> ```
>
> **Dịch:** Muốn load một module vào **JShell**, đưa JAR vào **module path** và dùng option **`--add-modules`**.

---

## Bài kế tiếp

→ [[07 - Modules and Reflective Access (Vol II)]] — `opens`, open module, và vì sao JPA/JAXB/JSON-B cần chúng.
