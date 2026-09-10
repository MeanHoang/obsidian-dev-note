# 04 — Working with Files

> Chapter 2, Section 2.4 — Core Java Volume II: Advanced Features, 11th Edition (Horstmann), Java 11.
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 2.4. Working with Files

> *"You have learned how to read and write data from a file. However, there is more to file management than reading and writing. The Path interface and Files class encapsulate the functionality required to work with the file system on the user’s machine. For example, the Files class can be used to remove or rename a file, or to find out when a file was last modified. In other words, the input/output stream classes are concerned with the contents of files, whereas the classes that we discuss here are concerned with the storage of files on a disk."*

**Dịch:** Bạn đã học cách đọc và ghi data từ file. Nhưng **quản lý file còn nhiều thứ hơn đọc và ghi**. Interface **`Path`** và class **`Files`** đóng gói các chức năng cần thiết để làm việc với **file system trên máy của user**. Ví dụ `Files` dùng để **xoá hoặc đổi tên file**, hay **biết file được sửa lần cuối khi nào**. Nói cách khác: **class input/output stream quan tâm tới nội dung file**, còn **các class bàn ở đây quan tâm tới việc lưu trữ file trên đĩa**.

> *"The Path interface and Files class were added in Java 7. They are much more convenient to use than the File class which dates back all the way to JDK 1.0. We expect them to be very popular with Java programmers and discuss them in depth."*

**Dịch:** `Path` và `Files` **được thêm vào ở Java 7**. Chúng **tiện dùng hơn nhiều** so với class **`File`** vốn có từ tận **JDK 1.0**.

---

## 2.4.1. Paths

> *"A Path is a sequence of directory names, optionally followed by a file name. The first component of a path may be a root component such as / or C:\. The permissible root components depend on the file system. A path that starts with a root component is absolute. Otherwise, it is relative. For example, here we construct an absolute and a relative path. For the absolute path, we assume a UNIX-like file system."*

```java
Path absolute = Paths.get("/home", "harry");
Path relative = Paths.get("myprog", "conf", "user.properties");
```

**Dịch:** Một **`Path` là một chuỗi tên directory**, **tuỳ chọn theo sau bởi một tên file**. **Thành phần đầu tiên** của path có thể là một **root component** như `/` hay `C:\`. **Root component nào hợp lệ thì tuỳ file system.** Path **bắt đầu bằng root component là absolute**; ngược lại là **relative**.

> *"The static Paths.get method receives one or more strings, which it joins with the path separator of the default file system (/ for a UNIX-like file system, \ for Windows). It then parses the result, throwing an InvalidPathException if the result is not a valid path in the given file system. The result is a Path object."*

**Dịch:** Static method **`Paths.get`** nhận **một hoặc nhiều string**, **nối chúng bằng dấu phân cách path của file system mặc định** (`/` với file system kiểu UNIX, `\` với Windows). Rồi nó **parse kết quả**, ném **`InvalidPathException`** nếu kết quả **không phải path hợp lệ** trong file system đó. Kết quả là một **object `Path`**.

> *"The get method can get a single string containing multiple components. For example, you can read a path from a configuration file like this:"*

```java
String baseDir = props.getProperty("base.dir");
// May be a string such as /opt/myprog or c:\Program Files\myprog
Path basePath = Paths.get(baseDir); // OK that baseDir has separators
```

**Dịch:** Method `get` nhận được **một string duy nhất chứa nhiều thành phần**. Ví dụ đọc một path từ **file cấu hình** như trên.

> **Note (sách):** *"A path does not have to correspond to a file that actually exists. It is merely an abstract sequence of names. As you will see in the next section, when you want to create a file, you first make a path and then call a method to create the corresponding file."*
>
> **Dịch:** Một path **không nhất thiết phải ứng với một file thực sự tồn tại**. Nó **chỉ là một chuỗi tên trừu tượng**. Khi muốn tạo file, **trước hết dựng một path rồi gọi method để tạo file tương ứng**.

### resolve và resolveSibling

> *"It is very common to combine or resolve paths. The call p.resolve(q) returns a path according to these rules:"*
>
> - *"If q is absolute, then the result is q."*
> - *"Otherwise, the result is “p then q,” according to the rules of the file system."*

**Dịch:** Việc **kết hợp hay resolve path rất phổ biến**. Lời gọi `p.resolve(q)` trả về path theo hai luật:

| Điều kiện | Kết quả |
|---|---|
| `q` là **absolute** | kết quả là **`q`** |
| ngược lại | kết quả là **"`p` rồi tới `q`"**, theo luật của file system |

> *"For example, suppose your application needs to find its working directory relative to a given base directory that is read from a configuration file, as in the preceding example."*

```java
Path workRelative = Paths.get("work");
Path workPath = basePath.resolve(workRelative);
```

> *"There is a shortcut for the resolve method that takes a string instead of a path:"*

```java
Path workPath = basePath.resolve("work");
```

> *"There is a convenience method resolveSibling that resolves against a path’s parent, yielding a sibling path. For example, if workPath is /opt/myapp/work, the call"*

```java
Path tempPath = workPath.resolveSibling("temp");
```

> *"creates /opt/myapp/temp."*

**Dịch:** Có **lối tắt** cho `resolve` nhận **string thay vì path**. Có method tiện lợi **`resolveSibling`** resolve **đối với parent của path**, cho ra **một path anh em (sibling)**. Ví dụ `workPath` là `/opt/myapp/work` thì lời gọi trên tạo ra **`/opt/myapp/temp`**.

### relativize, normalize, toAbsolutePath

> *"The opposite of resolve is relativize. The call p.relativize(r) yields the path q which, when resolved with p, yields r. For example, relativizing /home/harry against /home/fred/input.txt yields ../fred/input.txt. Here, we assume that .. denotes the parent directory in the file system."*

**Dịch:** **Ngược với `resolve` là `relativize`**. Lời gọi `p.relativize(r)` cho ra path `q` mà **khi resolve với `p` sẽ ra `r`**. Ví dụ relativize `/home/harry` với `/home/fred/input.txt` cho ra **`../fred/input.txt`**, ở đây giả định **`..` chỉ parent directory**.

> *"The normalize method removes any redundant . and .. components (or whatever the file system may deem redundant). For example, normalizing the path /home/harry/../fred/./input.txt yields /home/fred/input.txt."*

**Dịch:** Method **`normalize`** **bỏ các thành phần `.` và `..` thừa** (hoặc bất kỳ thứ gì file system coi là thừa). Ví dụ normalize `/home/harry/../fred/./input.txt` cho ra **`/home/fred/input.txt`**.

> *"The toAbsolutePath method yields the absolute path of a given path, starting at a root component, such as /home/fred/input.txt or c:\Users\fred\input.txt."*

**Dịch:** Method **`toAbsolutePath`** cho ra **absolute path** của một path, **bắt đầu từ một root component**.

> *"The Path interface has many useful methods for taking paths apart. This code sample shows some of the most useful ones:"*

```java
Path p = Paths.get("/home", "fred", "myprog.properties");
Path parent = p.getParent(); // the path /home/fred
Path file = p.getFileName(); // the path myprog.properties
Path root = p.getRoot(); // the path /
```

> *"As you have already seen in Volume I, you can construct a Scanner from a Path object:"*

```java
var in = new Scanner(Paths.get("/home/fred/input.txt"));
```

**Dịch:** Interface `Path` có nhiều method hữu ích để **tách path ra**. Cũng **dựng được `Scanner` từ một object `Path`**.

> **Note (sách):** *"Occasionally, you may need to interoperate with legacy APIs that use the File class instead of the Path interface. The Path interface has a toFile method, and the File class has a toPath method."*
>
> **Dịch:** Thi thoảng bạn cần **làm việc chung với API cũ dùng class `File`** thay vì interface `Path`. Interface `Path` có method **`toFile`**, còn class `File` có method **`toPath`**.

## API — `java.nio.file.Paths` (Java 7)

| Method | Mô tả (dịch) |
|---|---|
| `static Path get(String first, String... more)` | Dựng một path bằng cách **nối các string đã cho**. |

## API — `java.nio.file.Path` (Java 7)

| Method | Mô tả (dịch) |
|---|---|
| `Path resolve(Path other)`<br>`Path resolve(String other)` | Nếu `other` là **absolute** thì trả về `other`; ngược lại trả về path có được bằng cách **nối `this` với `other`**. |
| `Path resolveSibling(Path other)`<br>`Path resolveSibling(String other)` | Nếu `other` là absolute thì trả về `other`; ngược lại trả về path có được bằng cách **nối parent của `this` với `other`**. |
| `Path relativize(Path other)` | Trả về **relative path** mà khi resolve với `this` sẽ cho ra `other`. |
| `Path normalize()` | **Bỏ các phần tử path thừa** như `.` và `..` |
| `Path toAbsolutePath()` | Trả về một **absolute path tương đương** với path này. |
| `Path getParent()` | Trả về **parent**, hoặc **`null`** nếu path này **không có parent**. |
| `Path getFileName()` | Trả về **thành phần cuối cùng** của path này, hoặc `null` nếu path không có thành phần nào. |
| `Path getRoot()` | Trả về **root component** của path này, hoặc `null` nếu path **không có root component**. |
| `toFile()` | Dựng một **`File`** từ path này. |

## API — `java.io.File` (Java 1.0)

| Method | Mô tả (dịch) |
|---|---|
| `Path toPath()` *(7)* | Dựng một **`Path`** từ file này. |

---

## 2.4.2. Reading and Writing Files

> *"The Files class makes quick work of common file operations. For example, you can easily read the entire contents of a file:"*

```java
byte[] bytes = Files.readAllBytes(path);
```

> *"you can read the content of a text file as"*

```java
var content = Files.readString(path, charset);
```

> *"But if you want the file as a sequence of lines, call"*

```java
List<String> lines = Files.readAllLines(path, charset);
```

> *"Conversely, if you want to write a string, call"*

```java
Files.write(path, content.getBytes(charset));
```

> *"To append to a given file, use"*

```java
Files.write(path, content.getBytes(charset), StandardOpenOption.APPEND);
```

> *"You can also write a collection of lines with"*

```java
Files.write(path, lines, charset);
```

**Dịch:** Class **`Files` làm nhanh gọn các thao tác file thông dụng**: đọc **toàn bộ nội dung file**, đọc nội dung **file text thành string**, đọc file thành **chuỗi các dòng**, **ghi một string**, **ghi thêm (append)** vào file bằng option **`StandardOpenOption.APPEND`**, và **ghi một collection các dòng**.

> *"These simple methods are intended for dealing with text files of moderate length. If your files are large or binary, you can still use the familiar input/output streams or readers/writers:"*

```java
InputStream in = Files.newInputStream(path);
OutputStream out = Files.newOutputStream(path);
Reader in = Files.newBufferedReader(path, charset);
Writer out = Files.newBufferedWriter(path, charset);
```

> *"These convenience methods save you from dealing with FileInputStream, FileOutputStream, BufferedReader, or BufferedWriter."*

**Dịch:** Các method đơn giản đó **dành cho file text độ dài vừa phải**. Nếu file **lớn hoặc binary**, vẫn dùng được **input/output stream hay reader/writer quen thuộc**. Các method tiện lợi này **giúp bạn khỏi phải đụng tới** `FileInputStream`, `FileOutputStream`, `BufferedReader`, hay `BufferedWriter`.

## API — `java.nio.file.Files` (Java 7) — đọc/ghi

| Method | Mô tả (dịch) |
|---|---|
| `static byte[] readAllBytes(Path path)`<br>`static String readString(Path path, Charset charset)`<br>`static List<String> readAllLines(Path path, Charset charset)` | **Đọc nội dung của một file.** |
| `static Path write(Path path, byte[] contents, OpenOption... options)`<br>`static Path write(Path path, String contents, Charset charset, OpenOption... options)`<br>`static Path write(Path path, Iterable<? extends CharSequence> contents, OpenOption options)` | **Ghi nội dung đã cho vào file** và **trả về `path`**. |
| `static InputStream newInputStream(Path path, OpenOption... options)`<br>`static OutputStream newOutputStream(Path path, OpenOption... options)`<br>`static BufferedReader newBufferedReader(Path path, Charset charset)`<br>`static BufferedWriter newBufferedWriter(Path path, Charset charset, OpenOption... options)` | **Mở một file để đọc hoặc ghi.** |

---

## 2.4.3. Creating Files and Directories

> *"To create a new directory, call"*

```java
Files.createDirectory(path);
```

> *"All but the last component in the path must already exist. To create intermediate directories as well, use"*

```java
Files.createDirectories(path);
```

> *"You can create an empty file with"*

```java
Files.createFile(path);
```

> *"The call throws an exception if the file already exists. The check for existence and creation are atomic. If the file doesn’t exist, it is created before anyone else has a chance to do the same."*

**Dịch:** Tạo directory mới bằng `Files.createDirectory`. **Mọi thành phần trừ thành phần cuối trong path phải đã tồn tại sẵn.** Muốn **tạo cả các directory trung gian** thì dùng **`createDirectories`**. Tạo **file rỗng** bằng `Files.createFile`; lời gọi này **ném exception nếu file đã tồn tại**. **Việc kiểm tra tồn tại và việc tạo là atomic**: nếu file chưa có, nó **được tạo trước khi bất kỳ ai khác có cơ hội làm điều tương tự**.

> *"There are convenience methods for creating a temporary file or directory in a given or system-specific location."*

```java
Path newPath = Files.createTempFile(dir, prefix, suffix);
Path newPath = Files.createTempFile(prefix, suffix);
Path newPath = Files.createTempDirectory(dir, prefix);
Path newPath = Files.createTempDirectory(prefix);
```

> *"Here, dir is a Path, and prefix/suffix are strings which may be null. For example, the call Files.createTempFile(null, ".txt") might return a path such as /tmp/1234405522364837194.txt."*

**Dịch:** Có method tiện lợi tạo **file hoặc directory tạm** ở **vị trí đã cho hoặc vị trí đặc thù hệ thống**. Ở đây `dir` là một `Path`, còn `prefix`/`suffix` là string **có thể là `null`**.

> *"When you create a file or directory, you can specify attributes, such as owners or permissions. However, the details depend on the file system, and we won’t cover them here."*

**Dịch:** Khi tạo file hay directory, bạn **chỉ định được attribute** như **owner hoặc permission**. Nhưng **chi tiết tuỳ file system**, sách **không bàn ở đây**.

## API — `java.nio.file.Files` (Java 7) — tạo file/directory

| Method | Mô tả (dịch) |
|---|---|
| `static Path createFile(Path path, FileAttribute<?>... attrs)`<br>`static Path createDirectory(Path path, FileAttribute<?>... attrs)`<br>`static Path createDirectories(Path path, FileAttribute<?>... attrs)` | Tạo một file hoặc directory. Method **`createDirectories` tạo cả các directory trung gian**. |
| `static Path createTempFile(String prefix, String suffix, FileAttribute<?>... attrs)`<br>`static Path createTempFile(Path parentDir, String prefix, String suffix, FileAttribute<?>... attrs)`<br>`static Path createTempDirectory(String prefix, FileAttribute<?>... attrs)`<br>`static Path createTempDirectory(Path parentDir, String prefix, FileAttribute<?>... attrs)` | Tạo một **file hoặc directory tạm**, ở vị trí **phù hợp cho file tạm** hoặc trong **parent directory đã cho**. Trả về **path tới file/directory vừa tạo**. |

---

## 2.4.4. Copying, Moving, and Deleting Files

> *"To copy a file from one location to another, simply call"*

```java
Files.copy(fromPath, toPath);
```

> *"To move the file (that is, copy and delete the original), call"*

```java
Files.move(fromPath, toPath);
```

> *"The copy or move will fail if the target exists. If you want to overwrite an existing target, use the REPLACE_EXISTING option. If you want to copy all file attributes, use the COPY_ATTRIBUTES option. You can supply both like this:"*

```java
Files.copy(fromPath, toPath, StandardCopyOption.REPLACE_EXISTING,
    StandardCopyOption.COPY_ATTRIBUTES);
```

**Dịch:** **Copy** file bằng `Files.copy`; **move** (tức copy rồi xoá bản gốc) bằng `Files.move`. **Copy hay move sẽ thất bại nếu target đã tồn tại.** Muốn **ghi đè target đang có** thì dùng option **`REPLACE_EXISTING`**; muốn **copy mọi file attribute** thì dùng **`COPY_ATTRIBUTES`**; **đưa cả hai vào cũng được**.

> *"You can specify that a move should be atomic. Then you are assured that either the move completed successfully, or the source continues to be present. Use the ATOMIC_MOVE option:"*

```java
Files.move(fromPath, toPath, StandardCopyOption.ATOMIC_MOVE);
```

**Dịch:** Chỉ định được rằng một lệnh move phải **atomic**. Khi đó bạn được đảm bảo **hoặc move hoàn tất thành công, hoặc source vẫn còn nguyên đó**. Dùng option **`ATOMIC_MOVE`**.

> *"You can also copy an input stream to a Path, which just means saving the input stream to disk. Similarly, you can copy a Path to an output stream. Use the following calls:"*

```java
Files.copy(inputStream, toPath);
Files.copy(fromPath, outputStream);
```

> *"As with the other calls to copy, you can supply copy options as needed."*

**Dịch:** Cũng **copy được một input stream vào một `Path`**, tức là **lưu input stream xuống đĩa**. Tương tự, **copy được một `Path` ra một output stream**.

> *"Finally, to delete a file, simply call"*

```java
Files.delete(path);
```

> *"This method throws an exception if the file doesn’t exist, so instead you may want to use"*

```java
boolean deleted = Files.deleteIfExists(path);
```

> *"The deletion methods can also be used to remove an empty directory."*

**Dịch:** Cuối cùng, **xoá file** bằng `Files.delete`. Method này **ném exception nếu file không tồn tại**, nên có thể dùng **`deleteIfExists`** thay thế. Các method xoá cũng dùng được để **xoá một directory rỗng**.

## API — `java.nio.file.Files` (Java 7) — copy/move/delete

| Method | Mô tả (dịch) |
|---|---|
| `static Path copy(Path from, Path to, CopyOption... options)`<br>`static Path move(Path from, Path to, CopyOption... options)` | **Copy hoặc move** `from` tới vị trí target đã cho và **trả về `to`**. |
| `static long copy(InputStream from, Path to, CopyOption... options)`<br>`static long copy(Path from, OutputStream to, CopyOption... options)` | Copy **từ input stream vào file**, hoặc **từ file ra output stream**, trả về **số byte đã copy**. |
| `static void delete(Path path)`<br>`static boolean deleteIfExists(Path path)` | Xoá file hoặc **directory rỗng** đã cho. Method thứ nhất **ném exception nếu file/directory không tồn tại**; method thứ hai **trả về `false`** trong trường hợp đó. |

### Table 2.3 — Standard Options for File Operations

**`StandardOpenOption`** — dùng với `newBufferedWriter`, `newInputStream`, `newOutputStream`, `write`

| Option | Description (dịch) |
|---|---|
| `READ` | Mở để **đọc** |
| `WRITE` | Mở để **ghi** |
| `APPEND` | Nếu mở để ghi thì **ghi nối vào cuối file** |
| `TRUNCATE_EXISTING` | Nếu mở để ghi thì **xoá nội dung đang có** |
| `CREATE_NEW` | **Tạo file mới và thất bại nếu file đã tồn tại** |
| `CREATE` | **Tạo file mới một cách atomic nếu file chưa tồn tại** |
| `DELETE_ON_CLOSE` | **Cố hết sức ("best effort") xoá file khi nó được đóng** |
| `SPARSE` | Một **gợi ý cho file system** rằng file này sẽ **sparse** |
| `DSYNC` hoặc `SYNC` | Yêu cầu **mỗi lần cập nhật data (hoặc data và metadata) của file phải được ghi đồng bộ xuống thiết bị lưu trữ** |

**`StandardCopyOption`** — dùng với `copy`, `move`

| Option | Description (dịch) |
|---|---|
| `ATOMIC_MOVE` | **Move file một cách atomic** |
| `COPY_ATTRIBUTES` | **Copy các file attribute** |
| `REPLACE_EXISTING` | **Thay thế target nếu nó đã tồn tại** |

**`LinkOption`** — dùng với **mọi method trên** và `exists`, `isDirectory`, `isRegularFile`

| Option | Description (dịch) |
|---|---|
| `NOFOLLOW_LINKS` | **Không đi theo symbolic link** |

**`FileVisitOption`** — dùng với `find`, `walk`, `walkFileTree`

| Option | Description (dịch) |
|---|---|
| `FOLLOW_LINKS` | **Đi theo symbolic link** |

---

## 2.4.5. Getting File Information

> *"The following static methods return a boolean value to check a property of a path:"*
>
> - `exists`
> - `isHidden`
> - `isReadable, isWritable, isExecutable`
> - `isRegularFile, isDirectory, isSymbolicLink`

> *"The size method returns the number of bytes in a file."*

```java
long fileSize = Files.size(path);
```

> *"The getOwner method returns the owner of the file, as an instance of java.nio.file.attribute.UserPrincipal."*

**Dịch:** Các static method trên trả về **giá trị `boolean`** để **kiểm tra một tính chất của path**. Method **`size`** trả về **số byte trong file**. Method **`getOwner`** trả về **owner của file**, dưới dạng instance của `java.nio.file.attribute.UserPrincipal`.

> *"All file systems report a set of basic attributes, encapsulated by the BasicFileAttributes interface, which partially overlaps with that information. The basic file attributes are"*
>
> - *"The times at which the file was created, last accessed, and last modified, as instances of the class java.nio.file.attribute.FileTime"*
> - *"Whether the file is a regular file, a directory, a symbolic link, or none of these"*
> - *"The file size"*
> - *"The file key—an object of some class, specific to the file system, that may or may not uniquely identify a file"*

**Dịch:** **Mọi file system đều báo cáo một tập attribute cơ bản**, đóng gói trong interface **`BasicFileAttributes`**, **trùng lặp một phần** với thông tin trên. Các basic file attribute gồm:

| Attribute | Nội dung |
|---|---|
| **Thời điểm** | file được **tạo**, **truy cập lần cuối**, và **sửa lần cuối**, dưới dạng instance của class `java.nio.file.attribute.FileTime` |
| **Loại** | file là **regular file**, **directory**, **symbolic link**, hay **không thuộc loại nào** |
| **Kích thước** | file size |
| **File key** | một object thuộc class nào đó, **đặc thù cho file system**, **có thể có hoặc không định danh duy nhất một file** |

> *"To get these attributes, call"*

```java
BasicFileAttributes attributes = Files.readAttributes(path, BasicFileAttributes.class);
```

> *"If you know that the user’s file system is POSIX-compliant, you can instead get an instance of PosixFileAttributes:"*

```java
PosixFileAttributes attributes = Files.readAttributes(path, PosixFileAttributes.class);
```

> *"Then you can find out the group owner and the owner, group, and world access permissions of the file. We won’t dwell on the details since so much of this information is not portable across operating systems."*

**Dịch:** Nếu biết file system của user **tuân thủ POSIX**, lấy được instance **`PosixFileAttributes`** thay thế. Khi đó biết được **group owner** cùng **quyền truy cập của owner, group, và world** đối với file. Sách **không sa đà vào chi tiết** vì **phần lớn thông tin này không portable giữa các hệ điều hành**.

## API — `java.nio.file.Files` (Java 7) — thông tin file

| Method | Mô tả (dịch) |
|---|---|
| `static boolean exists(Path path)`<br>`static boolean isHidden(Path path)`<br>`static boolean isReadable(Path path)`<br>`static boolean isWritable(Path path)`<br>`static boolean isExecutable(Path path)`<br>`static boolean isRegularFile(Path path)`<br>`static boolean isDirectory(Path path)`<br>`static boolean isSymbolicLink(Path path)` | Kiểm tra **tính chất tương ứng** của file cho bởi path. |
| `static long size(Path path)` | Lấy **kích thước file tính bằng byte**. |
| `A readAttributes(Path path, Class<A> type, LinkOption... options)` | Đọc **các file attribute thuộc kiểu `A`**. |

## API — `java.nio.file.attribute.BasicFileAttributes` (Java 7)

| Method | Mô tả (dịch) |
|---|---|
| `FileTime creationTime()`<br>`FileTime lastAccessTime()`<br>`FileTime lastModifiedTime()`<br>`boolean isRegularFile()`<br>`boolean isDirectory()`<br>`boolean isSymbolicLink()`<br>`long size()`<br>`Object fileKey()` | Lấy **attribute được yêu cầu**. |

---

## 2.4.6. Visiting Directory Entries

> *"The static Files.list method returns a Stream<Path> that reads the entries of a directory. The directory is read lazily, making it possible to efficiently process directories with huge numbers of entries."*

> *"Since reading a directory involves a system resource that needs to be closed, you should use a try block:"*

```java
try (Stream<Path> entries = Files.list(pathToDirectory))
{
    . . .
}
```

**Dịch:** Static method **`Files.list`** trả về một **`Stream<Path>`** đọc các entry của một directory. **Directory được đọc lười (lazily)**, nhờ vậy **xử lý hiệu quả được các directory có số entry cực lớn**. Vì đọc directory **dùng tới một system resource cần được đóng**, nên **phải dùng khối `try`**.

> *"The list method does not enter subdirectories. To process all descendants of a directory, use the Files.walk method instead."*

```java
try (Stream<Path> entries = Files.walk(pathToRoot))
{
    // Contains all descendants, visited in depth-first order
}
```

**Dịch:** Method `list` **không đi vào subdirectory**. Muốn xử lý **mọi hậu duệ (descendant)** của một directory thì dùng **`Files.walk`** — duyệt theo **thứ tự depth-first**.

> *"Here is a sample traversal of the unzipped src.zip tree:"*

```
java
java/nio
java/nio/DirectCharBufferU.java
java/nio/ByteBufferAsShortBufferRL.java
java/nio/MappedByteBuffer.java
. . .
java/nio/ByteBufferAsDoubleBufferB.java
java/nio/charset
java/nio/charset/CoderMalfunctionError.java
java/nio/charset/CharsetDecoder.java
java/nio/charset/UnsupportedCharsetException.java
java/nio/charset/spi
java/nio/charset/spi/CharsetProvider.java
java/nio/charset/StandardCharsets.java
java/nio/charset/Charset.java
. . .
java/nio/charset/CoderResult.java
java/nio/HeapFloatBufferR.java
. . .
```

> *"As you can see, whenever the traversal yields a directory, it is entered before continuing with its siblings."*

**Dịch:** Như thấy ở trên, **hễ quá trình duyệt cho ra một directory thì nó được đi vào ngay trước khi tiếp tục với các sibling của nó**.

> *"You can limit the depth of the tree that you want to visit by calling Files.walk(pathToRoot, depth). Both walk methods have a varargs parameter of type FileVisitOption..., but there is only one option you can supply: FOLLOW_LINKS to follow symbolic links."*

**Dịch:** **Giới hạn được độ sâu** của cây muốn duyệt bằng `Files.walk(pathToRoot, depth)`. Cả hai method `walk` đều có **parameter varargs kiểu `FileVisitOption...`**, nhưng **chỉ có một option duy nhất** đưa vào được: **`FOLLOW_LINKS`** để đi theo symbolic link.

> **Note (sách):** *"If you filter the paths returned by walk and your filter criterion involves the file attributes stored with a directory, such as size, creation time, or type (file, directory, symbolic link), then use the find method instead of walk. Call that method with a predicate function that accepts a path and a BasicFileAttributes object. The only advantage is efficiency. Since the directory is being read anyway, the attributes are readily available."*
>
> **Dịch:** Nếu bạn **lọc các path do `walk` trả về** và **tiêu chí lọc dính tới file attribute** lưu cùng directory (như **size, creation time, hay type**) thì **dùng method `find` thay cho `walk`**. Gọi method đó với một **predicate function nhận vào một path và một object `BasicFileAttributes`**. **Lợi thế duy nhất là hiệu quả**: vì directory **dù sao cũng đang được đọc**, nên **các attribute đã sẵn có**.

> *"This code fragment uses the Files.walk method to copy one directory to another:"*

```java
Files.walk(source).forEach(p ->
{
    try
    {
        Path q = target.resolve(source.relativize(p));
        if (Files.isDirectory(p))
            Files.createDirectory(q);
        else
            Files.copy(p, q);
    }
    catch (IOException ex)
    {
        throw new UncheckedIOException(ex);
    }
});
```

> *"Unfortunately, you cannot easily use the Files.walk method to delete a tree of directories since you need to delete the children before deleting the parent. The next section shows you how to overcome that problem."*

**Dịch:** Đáng tiếc là **không dễ dùng `Files.walk` để xoá một cây directory**, vì bạn **phải xoá các con trước khi xoá cha**. Mục kế tiếp chỉ cách khắc phục.

---

## 2.4.7. Using Directory Streams

> *"As you saw in the preceding section, the Files.walk method produces a Stream<Path> that traverses the descendants of a directory. Sometimes, you need more fine-grained control over the traversal process. In that case, use the Files.newDirectoryStream object instead. It yields a DirectoryStream. Note that this is not a subinterface of java.util.stream.Stream but an interface that is specialized for directory traversal. It is a subinterface of Iterable so that you can use directory stream in an enhanced for loop. Here is the usage pattern:"*

```java
try (DirectoryStream<Path> entries = Files.newDirectoryStream(dir))
{
    for (Path entry : entries)
        Process entries
}
```

> *"The try-with-resources block ensures that the directory stream is properly closed."*

> *"There is no specific order in which the directory entries are visited."*

**Dịch:** Đôi khi cần **kiểm soát chi tiết hơn** quá trình duyệt. Khi đó dùng **`Files.newDirectoryStream`**, nó cho ra một **`DirectoryStream`**. Lưu ý đây **không phải subinterface của `java.util.stream.Stream`** mà là **một interface chuyên cho việc duyệt directory**. Nó là **subinterface của `Iterable`** nên **dùng được trong enhanced `for` loop**. Khối **try-with-resources đảm bảo directory stream được đóng đúng cách**. **Không có thứ tự cụ thể nào** trong việc duyệt các directory entry.

> *"You can filter the files with a glob pattern:"*

```java
try (DirectoryStream<Path> entries = Files.newDirectoryStream(dir, "*.java"))
```

**Dịch:** **Lọc file bằng glob pattern** được.

### Table 2.4 — Glob Patterns

| Pattern | Description (dịch) | Example |
|---|---|---|
| `*` | Khớp **0 hoặc nhiều character của một path component** | `*.java` khớp **mọi file Java trong directory hiện tại** |
| `**` | Khớp 0 hoặc nhiều character, **vượt qua ranh giới directory** | `**.java` khớp **mọi file Java trong bất kỳ subdirectory nào** |
| `?` | Khớp **đúng một character** | `????.java` khớp **mọi file Java tên bốn ký tự** (không tính phần mở rộng) |
| `[. . .]` | Khớp **một tập character**. Dùng được **dấu gạch nối `[0-9]`** và **phủ định `[!0-9]`** | `Test[0-9A-F].java` khớp `Testx.java`, với `x` là **một chữ số hexadecimal** |
| `{. . .}` | Khớp **các lựa chọn thay thế, ngăn nhau bằng dấu phẩy** | `*.{java,class}` khớp **mọi file Java và class** |
| `\` | **Escape** bất kỳ ký tự nào ở trên, **cũng như chính `\`** | `*\**` khớp **mọi file có dấu `*` trong tên** |

> **Caution (sách):** *"If you use the glob syntax on Windows, you have to escape backslashes twice: once for the glob syntax, and once for the Java string syntax: Files.newDirectoryStream(dir, "C:\\\\")."*
>
> **Dịch:** Nếu dùng cú pháp glob **trên Windows**, phải **escape backslash hai lần**: **một lần cho cú pháp glob**, và **một lần cho cú pháp string của Java**.

### FileVisitor

> *"If you want to visit all descendants of a directory, call the walkFileTree method instead and supply an object of type FileVisitor. That object gets notified"*
>
> - *"When a file is encountered: `FileVisitResult visitFile(T path, BasicFileAttributes attrs)`"*
> - *"Before a directory is processed: `FileVisitResult preVisitDirectory(T dir, IOException ex)`"*
> - *"After a directory is processed: `FileVisitResult postVisitDirectory(T dir, IOException ex)`"*
> - *"When an error occurred trying to visit a file or directory, such as trying to open a directory without the necessary permissions: `FileVisitResult visitFileFailed(T path, IOException ex)`"*

**Dịch:** Muốn **duyệt mọi hậu duệ của một directory** thì gọi **`walkFileTree`** và đưa vào một object kiểu **`FileVisitor`**. Object đó **được thông báo** ở bốn thời điểm:

| Thời điểm | Method |
|---|---|
| Khi **gặp một file** | `visitFile(T path, BasicFileAttributes attrs)` |
| **Trước khi** một directory được xử lý | `preVisitDirectory(T dir, IOException ex)` |
| **Sau khi** một directory được xử lý | `postVisitDirectory(T dir, IOException ex)` |
| Khi **xảy ra lỗi** lúc cố duyệt một file/directory (ví dụ mở directory mà **không có quyền cần thiết**) | `visitFileFailed(T path, IOException ex)` |

> *"In each case, you can specify whether you want to"*
>
> - *"Continue visiting the next file: `FileVisitResult.CONTINUE`"*
> - *"Continue the walk, but without visiting the entries in this directory: `FileVisitResult.SKIP_SUBTREE`"*
> - *"Continue the walk, but without visiting the siblings of this file: `FileVisitResult.SKIP_SIBLINGS`"*
> - *"Terminate the walk: `FileVisitResult.TERMINATE`"*

**Dịch:** Ở mỗi trường hợp, **chỉ định được** bạn muốn gì:

| Giá trị trả về | Ý nghĩa |
|---|---|
| `FileVisitResult.CONTINUE` | **Tiếp tục duyệt file kế tiếp** |
| `FileVisitResult.SKIP_SUBTREE` | Tiếp tục duyệt, nhưng **không duyệt các entry trong directory này** |
| `FileVisitResult.SKIP_SIBLINGS` | Tiếp tục duyệt, nhưng **không duyệt các sibling của file này** |
| `FileVisitResult.TERMINATE` | **Kết thúc việc duyệt** |

> *"If any of the methods throws an exception, the walk is also terminated, and that exception is thrown from the walkFileTree method."*

**Dịch:** Nếu **bất kỳ method nào ném exception** thì việc duyệt **cũng bị kết thúc**, và **exception đó được ném ra từ method `walkFileTree`**.

> **Note (sách):** *"The FileVisitor interface is a generic type, but it isn’t likely that you’ll ever want something other than a FileVisitor<Path>. The walkFileTree method is willing to accept a FileVisitor<? super Path>, but Path does not have an abundance of supertypes."*
>
> **Dịch:** Interface `FileVisitor` là **generic type**, nhưng **khó có khả năng bạn muốn thứ gì khác `FileVisitor<Path>`**. Method `walkFileTree` **sẵn lòng nhận `FileVisitor<? super Path>`**, nhưng **`Path` không có nhiều supertype cho lắm**. (Xem [[08 - Generic Programming]].)

> *"A convenience class SimpleFileVisitor implements the FileVisitor interface. All methods except visitFileFailed do nothing and continue. The visitFileFailed method throws the exception that caused the failure, thereby terminating the visit."*

**Dịch:** Class tiện lợi **`SimpleFileVisitor`** implement interface `FileVisitor`. **Mọi method trừ `visitFileFailed` đều không làm gì và tiếp tục.** Method `visitFileFailed` **ném lại exception gây ra lỗi**, do đó **kết thúc việc duyệt**.

> *"For example, here is how to print out all subdirectories of a given directory:"*

```java
Files.walkFileTree(Paths.get("/"), new SimpleFileVisitor<Path>()
{
    public FileVisitResult preVisitDirectory(Path path, BasicFileAttributes attrs)
        throws IOException
    {
        System.out.println(path);
        return FileVisitResult.CONTINUE;
    }

    public FileVisitResult postVisitDirectory(Path dir, IOException exc)
    {
        return FileVisitResult.CONTINUE;
    }

    public FileVisitResult visitFileFailed(Path path, IOException exc)
        throws IOException
    {
        return FileVisitResult.SKIP_SUBTREE;
    }
});
```

> *"Note that we need to override postVisitDirectory and visitFileFailed. Otherwise, the visit would fail as soon as it encounters a directory that it’s not allowed to open or a file it’s not allowed to access."*

**Dịch:** Lưu ý **phải override `postVisitDirectory` và `visitFileFailed`**. Nếu không, việc duyệt **sẽ hỏng ngay khi gặp một directory không được phép mở hoặc một file không được phép truy cập**.

> *"Also note that the attributes of the path are passed as a parameter to the preVisitDirectory and visitFile methods. The visitor already had to make an OS call to get the attributes, since it needs to distinguish between files and directories. This way, you don’t need to make another call."*

**Dịch:** Cũng lưu ý **attribute của path được truyền làm parameter** cho `preVisitDirectory` và `visitFile`. Visitor **dù sao cũng đã phải gọi OS để lấy attribute** vì nó cần **phân biệt file với directory**. Nhờ vậy **bạn khỏi phải gọi thêm lần nữa**.

> *"The other methods of the FileVisitor interface are useful if you need to do some work when entering or leaving a directory. For example, when you delete a directory tree, you need to remove the current directory after you have removed all of its files. Here is the complete code for deleting a directory tree:"*

```java
// Delete the directory tree starting at root
Files.walkFileTree(root, new SimpleFileVisitor<Path>()
{
    public FileVisitResult visitFile(Path file, BasicFileAttributes attrs)
        throws IOException
    {
        Files.delete(file);
        return FileVisitResult.CONTINUE;
    }

    public FileVisitResult postVisitDirectory(Path dir, IOException e) throws IOException
    {
        if (e != null) throw e;
        Files.delete(dir);
        return FileVisitResult.CONTINUE;
    }
});
```

**Dịch:** Các method khác của `FileVisitor` hữu ích khi cần **làm việc gì đó lúc vào hoặc ra khỏi một directory**. Ví dụ khi **xoá một cây directory**, bạn **phải xoá directory hiện tại SAU KHI đã xoá hết file của nó**.

## API — `java.nio.file.Files` (Java 7) — duyệt directory

| Method | Mô tả (dịch) |
|---|---|
| `static DirectoryStream<Path> newDirectoryStream(Path path)`<br>`static DirectoryStream<Path> newDirectoryStream(Path path, String glob)` | Lấy một **iterator trên các file và directory** trong một directory. Method thứ hai **chỉ nhận những entry khớp glob pattern** đã cho. |
| `static Path walkFileTree(Path start, FileVisitor<? super Path> visitor)` | **Duyệt mọi hậu duệ** của path đã cho, **áp dụng visitor lên mọi hậu duệ**. |

## API — `java.nio.file.SimpleFileVisitor<T>` (Java 7)

| Method | Mô tả (dịch) |
|---|---|
| `static FileVisitResult visitFile(T path, BasicFileAttributes attrs)` | Được gọi khi **một file hoặc directory được duyệt**; trả về một trong **`CONTINUE`, `SKIP_SUBTREE`, `SKIP_SIBLINGS`, `TERMINATE`**. Implementation mặc định **không làm gì và tiếp tục**. |
| `static FileVisitResult preVisitDirectory(T dir, BasicFileAttributes attrs)`<br>`static FileVisitResult postVisitDirectory(T dir, IOException exc)` | Được gọi **trước và sau** khi duyệt một directory. Implementation mặc định **không làm gì và tiếp tục**. |
| `static FileVisitResult visitFileFailed(T path, IOException exc)` | Được gọi nếu **có exception bị ném khi cố lấy thông tin về file** đã cho. Implementation mặc định **ném lại exception**, khiến việc duyệt **kết thúc với exception đó**. **Override nó nếu bạn muốn tiếp tục.** |

---

## 2.4.8. ZIP File Systems

> *"The Paths class looks up paths in the default file system—the files on the user’s local disk. You can have other file systems. One of the more useful ones is a ZIP file system. If zipname is the name of a ZIP file, then the call"*

```java
FileSystem fs = FileSystems.newFileSystem(Paths.get(zipname), null);
```

> *"establishes a file system that contains all files in the ZIP archive. It’s an easy matter to copy a file out of that archive if you know its name:"*

```java
Files.copy(fs.getPath(sourceName), targetPath);
```

> *"Here, fs.getPath is the analog of Paths.get for an arbitrary file system."*

**Dịch:** Class `Paths` **tra path trong file system mặc định** — các file trên **đĩa local của user**. Nhưng bạn **có thể có file system khác**. Một trong những cái hữu ích hơn cả là **ZIP file system**. Lời gọi trên **thiết lập một file system chứa mọi file trong ZIP archive**. **Copy một file ra khỏi archive rất dễ** nếu biết tên nó. Ở đây **`fs.getPath` là bản tương ứng của `Paths.get` cho một file system bất kỳ**.

> *"To list all files in a ZIP archive, walk the file tree:"*

```java
FileSystem fs = FileSystems.newFileSystem(Paths.get(zipname), null);
Files.walkFileTree(fs.getPath("/"), new SimpleFileVisitor<Path>()
{
    public FileVisitResult visitFile(Path file, BasicFileAttributes attrs)
        throws IOException
    {
        System.out.println(file);
        return FileVisitResult.CONTINUE;
    }
});
```

> *"That is nicer than the API described in Section 2.2.3, “ZIP Archives,” on p. 85 which required a set of new classes just to deal with ZIP archives."*

**Dịch:** Cách này **đẹp hơn API mô tả ở mục 2.2.3 "ZIP Archives"** ([[02 - Reading and Writing Binary Data]]) vốn **đòi hỏi cả một bộ class mới chỉ để xử lý ZIP archive**.

## API — `java.nio.file.FileSystems` (Java 7)

| Method | Mô tả (dịch) |
|---|---|
| `static FileSystem newFileSystem(Path path, ClassLoader loader)` | Duyệt qua **các file system provider đã cài đặt** và, nếu `loader` **không `null`**, cả các file system mà **class loader đó nạp được**. Trả về file system **do provider đầu tiên chấp nhận path đã cho tạo ra**. Mặc định **có sẵn một provider cho ZIP file system**, chấp nhận file có tên **kết thúc bằng `.zip` hoặc `.jar`**. |

## API — `java.nio.file.FileSystem` (Java 7)

| Method | Mô tả (dịch) |
|---|---|
| `static Path getPath(String first, String... more)` | Dựng một path bằng cách **nối các string đã cho**. |

---

## Bài kế tiếp

→ [[05 - Memory-Mapped Files]] — map file vào memory, cấu trúc buffer, thao tác file có thể nạp vào memory.
