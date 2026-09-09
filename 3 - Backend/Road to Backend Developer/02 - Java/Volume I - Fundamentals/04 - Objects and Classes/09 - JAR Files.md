# 09 — JAR Files

> Chapter 4, Section 4.9 — Core Java Volume I, 13th Edition (Horstmann).
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 4.9. JAR Files

> *"When you package your application, you want to give your users a single file, not a directory structure filled with class files. Java Archive (JAR) files were designed for this purpose. A JAR file can contain both class files and other file types such as image and sound files. Moreover, JAR files are compressed, using the familiar ZIP compression format."*

**Dịch:** Khi đóng gói ứng dụng, bạn muốn đưa cho người dùng **một file duy nhất**, không phải một cấu trúc thư mục đầy file class. File **JAR (Java Archive)** được thiết kế cho mục đích đó. File JAR chứa được **cả file class lẫn loại file khác** như ảnh và âm thanh. Hơn nữa, file JAR được **nén theo định dạng ZIP quen thuộc**.

---

## 4.9.1. Creating JAR files

> *"Use the jar tool to make JAR files. (In the default JDK installation, it's in the jdk/bin directory.) The most common command to make a new JAR file uses the following syntax:"*

```
jar cvf jarFileName file1 file2 . . .
```

> *"For example:"*

```
jar cvf CalculatorClasses.jar *.class icon.png
```

> *"In general, the jar command has the following format:"*

```
jar options file1 file2 . . .
```

> *"Table 4.2 lists all the options for the jar program. They are similar to the options of the UNIX tar command."*

**Dịch:** Dùng công cụ **`jar`** để tạo file JAR. Trong bản cài JDK mặc định, nó nằm ở thư mục `jdk/bin`. Các option **giống với option của lệnh `tar` trên UNIX**.

### Table 4.2: jar Program Options

| Option | Mô tả (dịch từ sách) |
|---|---|
| `c` | **Tạo** archive mới hoặc rỗng rồi thêm file vào. Nếu tên file nào là thư mục thì `jar` xử lý **đệ quy** |
| `C` | **Tạm đổi thư mục.** Ví dụ `jar cvf jarFileName.jar -C classes *.class` chuyển vào thư mục con `classes` để thêm file class |
| `e` | Tạo **entry point** trong manifest (xem 4.9.3) |
| `f` | Chỉ định **tên file JAR** làm argument thứ hai. Thiếu argument này thì `jar` ghi kết quả ra **standard output** (khi tạo JAR) hoặc đọc từ **standard input** (khi giải nén / liệt kê) |
| `i` | Tạo **file index** (tăng tốc tra cứu trong archive lớn) |
| `m` | **Thêm manifest** vào file JAR. Manifest là mô tả nội dung và nguồn gốc archive. Mọi archive đều có manifest mặc định, nhưng bạn cấp cái riêng được nếu muốn xác thực nội dung |
| `M` | **Không** tạo file manifest cho các entry |
| `t` | Hiển thị **mục lục** (table of contents) |
| `u` | **Cập nhật** một file JAR đã có |
| `v` | Sinh output **verbose** |
| `x` | **Giải nén** file. Nếu đưa vào một hay nhiều tên file thì chỉ giải nén những file đó, ngược lại giải nén tất cả |
| `0` | Lưu **không nén ZIP** |

> *"You can package application programs and code libraries into JAR files. For example, if you want to send mail in a Java program, you use a library that is packaged in a file javax.mail.jar."*

**Dịch:** Đóng gói được cả **chương trình ứng dụng** lẫn **thư viện code** vào file JAR. Ví dụ muốn gửi mail trong chương trình Java thì dùng thư viện đóng gói trong file `javax.mail.jar`.

---

## 4.9.2. The Manifest

> *"In addition to class files, images, and other resources, each JAR file contains a manifest file that describes special features of the archive."*

> *"The manifest file is called MANIFEST.MF and is located in a special META-INF subdirectory of the JAR file. The minimum legal manifest is quite boring—just"*

```
Manifest-Version: 1.0
```

**Dịch:** Ngoài file class, ảnh và tài nguyên khác, **mỗi file JAR chứa một file manifest** mô tả các đặc điểm riêng của archive. File manifest tên là **`MANIFEST.MF`**, nằm trong thư mục con đặc biệt **`META-INF`** của file JAR. **Manifest hợp lệ tối thiểu** khá nhàm chán, chỉ có một dòng như trên.

> *"Complex manifests can have many more entries. The manifest entries are grouped into sections. The first section in the manifest is called the main section. It applies to the whole JAR file. Subsequent entries can specify properties of named entities such as individual files, packages, or URLs. Those entries must begin with a Name entry. Sections are separated by blank lines. For example:"*

```
Manifest-Version: 1.0
lines describing this archive

Name: Woozle.class
lines describing this file

Name: com/mycompany/mypkg/
lines describing this package
```

**Dịch:** Manifest phức tạp thì có nhiều entry hơn. Các entry được gom thành **section**:

```
┌─ main section ────────────  áp dụng cho TOÀN BỘ file JAR
│  Manifest-Version: 1.0
│                              ← dòng trống ngăn cách section
├─ section có tên ──────────  bắt đầu bằng entry `Name:`
│  Name: Woozle.class            (mô tả một file cụ thể)
│
└─ section có tên ──────────
   Name: com/mycompany/mypkg/    (mô tả một package)
```

Các entry sau main section chỉ định thuộc tính của **thực thể có tên** như từng file, package, hoặc URL. Chúng **phải bắt đầu bằng một entry `Name`**. Các section **ngăn cách nhau bằng dòng trống**.

### Sửa manifest

> *"To edit the manifest, place the lines that you want to add to the manifest into a text file. Then run"*

```
jar cfm jarFileName manifestFileName . . .
```

> *"For example, to make a new JAR file with a manifest, run"*

```
jar cfm MyArchive.jar manifest.mf com/mycompany/mypkg/*.class
```

> *"To update the manifest of an existing JAR file, place the additions into a text file and use a command such as"*

```
jar ufm MyArchive.jar manifest-additions.mf
```

**Dịch:** Muốn sửa manifest thì đặt các dòng cần thêm vào **một file text**, rồi chạy `jar cfm`. Muốn **cập nhật** manifest của file JAR đã có thì dùng `jar ufm`.

> **Note (sách):** *"See https://docs.oracle.com/en/java/javase/21/docs/specs/jar/jar.html for more information on the JAR and manifest file formats."*

---

## 4.9.3. Executable JAR Files

> *"You can use the e option of the jar command to specify the entry point of your program—the class that you would normally specify when invoking the java program launcher:"*

```
jar cvfe MyProgram.jar com.mycompany.mypkg.MainAppClass files to add
```

> *"Alternatively, you can specify the main class of your program in the manifest, including a statement of the form"*

```
Main-Class: com.mycompany.mypkg.MainAppClass
```

> *"Do not add a .class extension to the main class name."*

**Dịch:** Dùng option **`e`** của lệnh `jar` để chỉ định **entry point** — chính là class bạn thường đưa vào khi gọi launcher `java`. Cách khác: khai báo main class **trong manifest**. **Đừng thêm đuôi `.class`** vào tên main class.

> **Caution (sách):** *"The last line in the manifest must end with a newline character. Otherwise, the manifest will not be read correctly. It is a common error to produce a text file containing just the Main-Class line without a line terminator."*
>
> **Dịch:** **Dòng cuối trong manifest phải kết thúc bằng ký tự xuống dòng.** Nếu không, manifest **sẽ không được đọc đúng**. Lỗi phổ biến là tạo file text chỉ có mỗi dòng `Main-Class` **mà không có ký tự kết thúc dòng**.

> *"With either method, users can simply start the program as"*

```
java -jar MyProgram.jar
```

> *"Depending on the operating system configuration, users may even be able to launch the application by double-clicking the JAR file icon. Here are behaviors for various operating systems:*
> - *On Windows, the Java runtime installer creates a file association for the ".jar" extension that launches the file with the javaw -jar command. (Unlike the java command, the javaw command doesn't open a shell window.)*
> - *On Mac OS X, the operating system recognizes the ".jar" file extension and executes the Java program when you double-click a JAR file."*

**Dịch:** Với cả hai cách, người dùng khởi động chương trình bằng `java -jar`. Tuỳ cấu hình hệ điều hành, họ thậm chí **nháy đúp vào icon file JAR** để chạy được:

| Hệ điều hành | Hành vi |
|---|---|
| **Windows** | Java runtime installer tạo file association cho đuôi `.jar`, chạy file bằng lệnh **`javaw -jar`**. Khác lệnh `java`, lệnh `javaw` **không mở cửa sổ shell** |
| **Mac OS X** | Hệ điều hành nhận diện đuôi `.jar` và thực thi chương trình Java khi nháy đúp |

> *"However, a Java program in a JAR file does not have the same feel as a native application. On Windows, you can use third-party wrapper utilities that turn JAR files into Windows executables. A wrapper is a Windows program with the familiar .exe extension that locates and launches the Java virtual machine (JVM) or tells the user what to do when no JVM is found. There are a number of commercial and open source products, such as Launch4J (https://launch4j.sourceforge.net) and IzPack (https://github.com/izpack/izpack)."*

**Dịch:** Tuy vậy, chương trình Java trong file JAR **không cho cảm giác giống ứng dụng native**. Trên Windows, dùng được các **wrapper utility bên thứ ba** biến file JAR thành file thực thi Windows. **Wrapper** là chương trình Windows có đuôi `.exe` quen thuộc, làm nhiệm vụ **định vị và khởi động JVM**, hoặc **báo cho người dùng biết phải làm gì khi không tìm thấy JVM**. Có một số sản phẩm thương mại và mã nguồn mở như **Launch4J** và **IzPack**.

---

## 4.9.4. Multi-Release JAR Files

> *"With the introduction of modules and strong encapsulation of packages, some previously accessible internal APIs are no longer available. This may require library providers to distribute different code for different Java versions. Multi-release JARs take care of this use case."*

**Dịch:** Với sự ra đời của **module** và **strong encapsulation** cho package, một số internal API trước đây truy cập được **nay không còn**. Điều này khiến người cung cấp thư viện phải **phân phối code khác nhau cho các phiên bản Java khác nhau**. **Multi-release JAR** giải quyết trường hợp này.

> *"For backward compatibility, version-specific class files are placed in the META-INF/versions directory:"*

```
Application.class
BuildingBlocks.class
Util.class
META-INF
├─ MANIFEST.MF  (with line Multi-Release: true)
└─ versions
   ├─ 9
   │  ├─ Application.class
   │  └─ BuildingBlocks.class
   └─ 10
      └─ BuildingBlocks.class
```

**Dịch:** Để tương thích ngược, các file class riêng cho từng phiên bản được đặt trong thư mục **`META-INF/versions`**.

> *"Suppose the Application class makes use of the CssParser class. Then the legacy Application.class file can be compiled to use com.sun.javafx.css.CssParser, while the Java 9 version uses javafx.css.CssParser."*

> *"Java 8 knows nothing about the META-INF/versions directory and will simply load the legacy classes. When the JAR file is read by Java 9, the new version is used instead."*

**Dịch:** Giả sử class `Application` dùng class `CssParser`. File `Application.class` cũ compile để dùng `com.sun.javafx.css.CssParser`, còn bản Java 9 dùng `javafx.css.CssParser`.

**Java 8 chả biết gì về thư mục `META-INF/versions`** nên nó **load class cũ**. Khi file JAR được **Java 9 đọc**, bản mới **được dùng thay thế**.

### Lệnh tạo

> *"To add versioned class files, use the --release flag:"*

```
jar uf MyProgram.jar --release 9 Application.class
```

> *"To build a multi-release JAR file from scratch, use the -C option and switch to a different class file directory for each version:"*

```
jar cf MyProgram.jar -C bin/8 . --release 9 -C bin/9 Application.class
```

> *"When compiling for different releases, use the --release flag and the -d flag to specify the output directory:"*

```
javac -d bin/8 --release 8 . . .
```

> *"The -d option creates the directory if it doesn't exist."*

> *"The JDK ships with symbol files for two prior versions of the API. In Java 21, you can compile with --release set to 21, 20, or 19."*

**Dịch:** Option `-d` **tự tạo thư mục nếu chưa có**. JDK đi kèm **symbol file cho hai phiên bản API trước đó**: ở Java 21, bạn compile được với `--release` đặt là **21, 20, hoặc 19**.

> *"Multi-release JARs are not intended for different versions of a program or library. The public API of all classes should be the same for both releases. The sole purpose of multi-release JARs is to enable a particular version of your program or library to work with multiple JDK releases. If you add functionality or change an API, you should provide a new version of the JAR instead."*

**Dịch:** Multi-release JAR **không nhằm phục vụ các phiên bản khác nhau của chương trình hay thư viện**. **Public API của mọi class phải giống nhau ở cả hai release.** Mục đích **duy nhất** của multi-release JAR là **giúp MỘT phiên bản chương trình/thư viện của bạn chạy được với NHIỀU release JDK**. Nếu thêm chức năng hoặc đổi API thì **phải ra một phiên bản JAR mới**.

> **Note (sách):** *"Tools such as javap are not retrofitted to handle multi-release JAR files. If you call"*
>
> ```
> javap -classpath MyProgram.jar Application.class
> ```
>
> *"you get the base version of the class (which, after all, is supposed to have the same public API as the newer version). If you must look at the newer version, call"*
>
> ```
> javap -classpath MyProgram.jar\!/META-INF/versions/9/Application.class
> ```
>
> **Dịch:** Các công cụ như `javap` **chưa được cải tiến để xử lý multi-release JAR**. Gọi như dòng đầu thì bạn nhận về **bản base** của class (mà dù sao cũng phải có cùng public API với bản mới hơn). Muốn xem bản mới hơn thì gọi như dòng thứ hai.

---

## 4.9.5. A Note about Command-Line Options

> *"The options of commands in the Java Development Kit have traditionally used single dashes followed by multiletter option names, such as"*

```
java -jar . . .
javac -Xlint:unchecked -classpath . . .
```

> *"The exception was the jar command, which followed the classic option format of the tar command without dashes:"*

```
jar cvf . . .
```

**Dịch:** Theo truyền thống, option của các lệnh trong JDK dùng **một dấu gạch ngang** rồi tới tên option **nhiều chữ cái**. **Ngoại lệ là lệnh `jar`**, vốn theo định dạng option cổ điển của lệnh `tar` — **không có dấu gạch ngang**.

> *"JEP 293 (https://openjdk.org/jeps/293) provides guidelines for moving towards a more common option format, starting with Java 9. With most Linux tools, multiletter option names are preceded by double dashes, with single-letter shortcuts for common options. For example, the Linux ls command can be called with a "human-readable" option as"*

```
ls --human-readable
```

> *"or"*

```
ls -h
```

> *"With javac and java, you can now use --version instead of -version and --class-path instead of -classpath. As you will see in Chapter 12, the --module-path option has a shortcut -p."*

**Dịch:** **JEP 293** đưa ra hướng dẫn chuyển sang định dạng option phổ biến hơn, **bắt đầu từ Java 9**. Đa số công cụ Linux dùng **hai dấu gạch ngang** cho tên option nhiều chữ cái, kèm **shortcut một chữ cái** cho option thông dụng.

| Cũ | Mới |
|---|---|
| `-version` | `--version` |
| `-classpath` | `--class-path` |
| | `--module-path` (shortcut `-p`) |

> *"Arguments of options with -- and multiple letters are separated by whitespace or an = sign:"*

```
java --class-path /home/user/classdir . . .
```

> *"or"*

```
java --class-path=/home/user/classdir . . .
```

> *"The = form is useful when an option needs to be passed through to another tool, where the passthrough mechanism cannot handle white space."*

**Dịch:** Argument của option dạng `--` nhiều chữ cái được ngăn cách bằng **khoảng trắng** hoặc **dấu `=`**. Dạng `=` hữu ích khi option cần **truyền tiếp sang công cụ khác** mà cơ chế truyền tiếp đó **không xử lý được khoảng trắng**.

> **Tip (sách):** *"You can use the JDK_JAVA_OPTIONS environment variable to pass command-line options to the java launcher:"*
>
> ```
> export JDK_JAVA_OPTIONS='--class-path /home/user/classdir --enable-assertions'
> ```

> **Caution (sách):** *"According to JEP 293, single-letter options without arguments can be grouped together:"*
>
> ```
> jar -c -v -f myapp.jar -m MANIFEST.MF *.class
> ```
>
> *"can be simplified to"*
>
> ```
> jar -cv -f myapp.jar -m MANIFEST.MF *.class
> ```
>
> *"But that does not currently work. Strangely,"*
>
> ```
> jar -cvfm myapp.jar MANIFEST.MF *.class
> ```
>
> *"works even though it should not. Until this is sorted out, it seems best to stick with the classic tar-style options for the jar command."*
>
> **Dịch:** Theo JEP 293, các option một chữ cái không có argument **gom chung lại được**. Nhưng **hiện tại điều đó không chạy**. Kỳ lạ là dạng `jar -cvfm` lại **chạy được dù lẽ ra không nên**. Chừng nào chuyện này chưa được giải quyết thì **tốt nhất cứ dùng option kiểu `tar` cổ điển cho lệnh `jar`**.

> **Caution (sách):** *"According to JEP 293, arguments of single-letter options can be separated by whitespace or directly follow the option:"*
>
> ```
> javac -d outputdir . . .
> ```
>
> *"or"*
>
> ```
> javac -doutputdir . . .
> ```
>
> *"The latter doesn't currently work. It also seems like a bad idea since it would invite conflicts with legacy options. For example, what should happen if the output directory happens to be named eprecation?"*
>
> **Dịch:** Theo JEP 293, argument của option một chữ cái được ngăn cách bằng khoảng trắng **hoặc đi liền ngay sau option**. **Dạng sau hiện không chạy.** Nó cũng có vẻ là ý tồi vì **mời gọi xung đột với option cũ**: chuyện gì xảy ra nếu thư mục output tình cờ tên là `eprecation`?

---

## Bài kế tiếp

→ [[10 - Documentation Comments]] — `javadoc`, các tag `@param` / `@return` / `@throws`, comment cho class, method, field, package.
