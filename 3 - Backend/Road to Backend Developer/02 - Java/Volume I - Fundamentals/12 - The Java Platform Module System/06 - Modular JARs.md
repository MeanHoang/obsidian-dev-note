# 06 — Modular JARs

> Chapter 12, Section 12.6 — Core Java Volume I, 13th Edition (Horstmann).
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 12.6. Modular JARs

> *"So far, we have simply compiled modules into the directory tree of the source code. Clearly, that is not satisfactory for deployment. Instead, a module can be deployed by placing all its classes in a JAR file, with a module-info.class in the root. Such a JAR file is called a modular JAR."*

**Dịch:** Tới giờ ta mới chỉ biên dịch module **vào ngay cây thư mục của source code**. Rõ ràng cách đó **không ổn khi deploy**. Thay vào đó, một module được deploy bằng cách **đặt toàn bộ class của nó vào một file JAR**, với **`module-info.class` nằm ở thư mục gốc**. File JAR như vậy gọi là **modular JAR**. → Xem [[09 - JAR Files]].

### Tạo modular JAR

> *"To create a modular JAR file, use the jar tool in the usual way. If you have multiple packages, it is best to compile with the -d option which places class files into a separate directory. The directory is created if it doesn't already exists. Then use the -C option of the jar command to change to that directory when collecting files."*

```bash
javac -d modules/com.horstmann.greet \
  com.horstmann.greet/module-info.java \
  com.horstmann.greet/com/horstmann/greet/internal/GreeterImpl.java \
  com.horstmann.greet/com/horstmann/greet/Greeter.java

jar -c -v -f com.horstmann.greet.jar -C modules/com.horstmann.greet .
```

**Dịch:** Để tạo modular JAR, **dùng công cụ `jar` như bình thường**. Nếu có nhiều package, tốt nhất là biên dịch với option **`-d`** để đưa class file vào **một thư mục riêng** (thư mục sẽ được tạo nếu chưa tồn tại). Sau đó dùng option **`-C`** của lệnh `jar` để **chuyển sang thư mục đó khi thu gom file**.

> *"If you use a build tool such as Maven, Ant, or Gradle, just keep building your JAR file as you always do. As long as module-info.class is included, you get a modular JAR."*

**Dịch:** Nếu bạn dùng build tool như **Maven, Ant, hay Gradle**, cứ **build JAR như xưa nay**. Miễn là **`module-info.class` được đưa vào**, bạn có một modular JAR.

> *"Then, include the modular JAR in the module path, and the module will be loaded."*

**Dịch:** Sau đó **đưa modular JAR vào module path**, và module sẽ **được load**.

> **Caution (sách):** *"In the past, classes of a package were sometimes distributed over multiple JAR files. (Such a package is called a “split package”.) This was probably never a good idea, and it is not possible with modules."*
>
> **Dịch:** Trước đây, class của một package đôi khi được **phân tán qua nhiều file JAR** (package như vậy gọi là **"split package"**). Điều đó **có lẽ chưa bao giờ là ý hay**, và **không làm được với module**.

### Chỉ định main class

> *"As with regular JAR files, you can specify a main class in a modular JAR:"*

```bash
javac -p com.horstmann.greet.jar \
  -d modules/v1ch12.exportedpkg \
  v1ch12.exportedpkg/module-info.java \
  v1ch12.exportedpkg/com/horstmann/hello/HelloWorld.java

jar -c -v -f v1ch12.exportedpkg.jar -e com.horstmann.hello.HelloWorld \
  -C modules/v1ch12.exportedpkg .
```

**Dịch:** Cũng như với file JAR thường, bạn **chỉ định được main class** trong một modular JAR.

> *"When you launch the program, you specify the module containing the main class:"*

```bash
java -p com.horstmann.greet.jar:v1ch12.exportedpkg.jar -m v1ch12.exportedpkg
```

**Dịch:** Khi khởi chạy chương trình, bạn **chỉ định module chứa main class**.

### Version number

> *"When creating a JAR file, you can optionally specify a version number. Use the --module-version argument, and also add the version number to the JAR file name:"*

```bash
jar -c -v -f com.horstmann.greet-1.0.jar --module-version 1.0 -C com.horstmann.greet .
```

**Dịch:** Khi tạo file JAR, bạn **tuỳ ý chỉ định được một version number**. Dùng argument **`--module-version`**, và **thêm cả số version vào tên file JAR**.

> *"As already discussed, the version number is not used by the Java Platform Module System for resolving modules, but it can be queried by other tools and frameworks."*

**Dịch:** Như đã nói, **Java Platform Module System không dùng số version để resolve module**, nhưng **các công cụ và framework khác truy vấn được nó**.

> **Note (sách):** *"You can find out the version number through the reflection API. In our example:"*
>
> ```java
> Optional<String> version = Greeter.class.getModule().getDescriptor().rawVersion();
> ```
>
> *"yields an Optional containing the version string "1.0"."*
>
> **Dịch:** Bạn **tra được số version qua reflection API**. Trong ví dụ trên, biểu thức này cho ra một `Optional` chứa chuỗi version `"1.0"`. → Xem [[10 - Reflection]].

> **Note (sách):** *"The module equivalent to a class loader is a layer. The Java Platform Module System loads the JDK modules and application modules into the boot layer. A program can load other modules, using the layer API (which is not covered in this book). Such a program may choose to take module versions into account. It is expected that developers of programs such as Java EE application servers will make use of the layer API to provide support for modules."*
>
> **Dịch:** Thứ tương đương với **class loader** trong thế giới module là **layer**. Java Platform Module System load các module của JDK và của application vào **boot layer**. Một chương trình có thể load thêm module khác bằng **layer API** (sách không bàn tới). Chương trình như vậy **có thể chọn tính đến version của module**. Người ta kỳ vọng những người phát triển chương trình như **Java EE application server** sẽ dùng layer API để hỗ trợ module.

> **Tip (sách):** *"If you want to load a module into JShell, include the JAR on the module path and use the --add-modules option:"*
>
> ```bash
> jshell --module-path com.horstmann.greet-1.0.jar --add-modules com.horstmann.greet
> ```
>
> **Dịch:** Muốn load một module vào **JShell** thì **đưa file JAR lên module path** và dùng option **`--add-modules`**.

---

## Bài kế tiếp

→ [[07 - Modules and Reflective Access]] — vì sao reflection bị chặn trong thế giới module, và keyword `opens` / `open module`.
