# Glossary — Input and Output

> Thuật ngữ chương 2: Input and Output. Định nghĩa lấy từ Core Java Volume II: Advanced Features, 11th Edition (Horstmann), Java 11.

## A

**Appendable**
Interface có **hai method** `append(char c)` và `append(CharSequence s)` để **nối thêm** từng character và chuỗi character; **trả về `this`**. Trong các input/output stream class, **chỉ `Writer` implement `Appendable`**. Xem [[01 - Input Output Streams#2.1.2. The Complete Stream Zoo]].

**available**
Method của `InputStream` cho biết **số byte hiện đang sẵn sàng để đọc** mà **không bị block**. Xem [[01 - Input Output Streams#2.1.1. Reading and Writing Bytes]].

## B

**BasicFileAttributes**
Interface đóng gói **tập attribute cơ bản mà mọi file system đều báo cáo**: thời điểm **tạo / truy cập lần cuối / sửa lần cuối** (kiểu `FileTime`), **loại** (regular file, directory, symbolic link, hay không thuộc loại nào), **file size**, và **file key** — object đặc thù file system, **có thể có hoặc không định danh duy nhất một file**. Xem [[04 - Working with Files#2.4.5. Getting File Information]].

**Big-Endian**
Cách lưu số trong bộ nhớ với **byte có trọng số cao nhất (MSB) đứng trước**: `1234` (hex `4D2`) thành `00 00 04 D2`. **SPARC dùng big-endian.** **Trong Java, mọi giá trị đều được ghi theo big-endian bất kể processor**, khiến file data của Java **độc lập với platform**. Xem [[02 - Reading and Writing Binary Data#2.2.1. The DataInput and DataOutput interfaces]].

**Buffer**
**Một array các giá trị cùng kiểu.** Class `Buffer` là **abstract class** với các subclass `ByteBuffer`, `CharBuffer`, `DoubleBuffer`, `FloatBuffer`, `IntBuffer`, `LongBuffer`, `ShortBuffer`. Có **capacity** (không đổi), **position**, **limit**, và tuỳ chọn **mark**, thoả `0 ≤ mark ≤ position ≤ limit ≤ capacity`. Mục đích chính là **chu trình "ghi, rồi đọc"**. `StringBuffer` **không liên quan** tới các buffer này. Xem [[05 - Memory-Mapped Files#2.5.2. The Buffer Data Structure]].

**Buffered Input Stream**
Stream **đọc byte mà không phải truy cập thiết bị mỗi lần**: khi **buffer rỗng**, một block data mới được đọc vào buffer. Mặc định input stream **không được buffer** — mỗi lần `read` là **hỏi hệ điều hành phát cho thêm một byte**. Xem [[01 - Input Output Streams#2.1.3. Combining Input/Output Stream Filters]].

**Byte Order Mark**
Đại lượng 16-bit **`0xFEFF`** đặt ở **đầu file** để báo file dùng **big-endian hay little-endian UTF-16**. Một số chương trình (kể cả **Microsoft Notepad**) thêm nó vào **file UTF-8** dù **không cần thiết**; **Java không tự gỡ nó**, nên **tự cắt bỏ mọi `﻿` đứng đầu** input. Xem [[01 - Input Output Streams#2.1.8. Character Encodings]].

## C

**Channel**
**Abstraction cho file trên đĩa**, cho phép truy cập tính năng của hệ điều hành như **memory mapping, file locking, và truyền data nhanh giữa các file**. Lấy bằng `FileChannel.open(path, options)`. Xem [[05 - Memory-Mapped Files#2.5.1. Memory-Mapped File Performance]].

**Character Class** (regular expression)
**Một tập các character thay thế nhau, bọc trong ngoặc vuông**, như `[Jj]`, `[0-9]`, `[^0-9]`. Dấu **`-` chỉ một khoảng**, dấu **`^` chỉ phần bù**. Xem [[07 - Regular Expressions#2.7.1. The Regular Expression Syntax]].

**Character Encoding**
Cách **đóng gói các số 21 bit (Unicode code point) thành byte**. Phổ biến nhất là **UTF-8** (1–4 byte mỗi code point) và **UTF-16** (1–2 giá trị 16-bit, dùng trong Java string). **Không có cách nào đáng tin để tự động dò encoding từ một chuỗi byte** — **luôn phải chỉ định encoding tường minh**. Xem [[01 - Input Output Streams#2.1.8. Character Encodings]].

**CharSequence**
Interface mô tả **tính chất cơ bản của một chuỗi giá trị `char`**; được **`String`, `CharBuffer`, `StringBuilder`, `StringBuffer`** implement. Xem [[01 - Input Output Streams#2.1.2. The Complete Stream Zoo]].

**close**
Method đóng input/output stream, **giải phóng tài nguyên hệ điều hành** vốn có hạn. Đóng output stream **cũng flush buffer** — **không đóng file thì packet byte cuối cùng có thể không bao giờ được gửi**. Xem [[01 - Input Output Streams#2.1.1. Reading and Writing Bytes]].

**Closeable**
Interface với method `void close() throws IOException`. **`InputStream`, `OutputStream`, `Reader`, `Writer` đều implement nó.** Nó **extend `java.lang.AutoCloseable`** nên **dùng được với try-with-resources**. Khác biệt: `Closeable.close` **chỉ ném `IOException`**, còn `AutoCloseable.close` **ném được exception bất kỳ**. Xem [[01 - Input Output Streams#2.1.2. The Complete Stream Zoo]].

**CRC32**
**32-bit cyclic redundancy checksum**, thường dùng để **xác định file có bị hỏng không** — file hỏng thì **rất có khả năng checksum đã đổi**. Class `CRC32` nằm ở package `java.util.zip`. Xem [[05 - Memory-Mapped Files#2.5.1. Memory-Mapped File Performance]].

## D

**DataInput / DataOutput**
Cặp interface định nghĩa method **đọc/ghi number, character, `boolean`, string ở dạng binary** (`readInt`/`writeInt`, `readDouble`/`writeDouble`, `readUTF`/`writeUTF`...). `writeInt` **luôn ghi 4 byte**, `writeDouble` **luôn ghi 8 byte**, bất kể số chữ số. Xem [[02 - Reading and Writing Binary Data#2.2.1. The DataInput and DataOutput interfaces]].

**DirectoryStream**
Interface **chuyên cho việc duyệt directory**, lấy bằng `Files.newDirectoryStream`. **Không phải subinterface của `java.util.stream.Stream`** mà là **subinterface của `Iterable`**, nên dùng được trong **enhanced `for` loop**. **Không có thứ tự cụ thể nào** trong việc duyệt các entry. Xem [[04 - Working with Files#2.4.7. Using Directory Streams]].

## E

**Externalizable**
Interface yêu cầu class định nghĩa **`readExternal` và `writeExternal`**, hai method **chịu trách nhiệm hoàn toàn** việc lưu/khôi phục **toàn bộ object, kể cả data của superclass**. Khi đọc object externalizable, object input stream **dựng object bằng constructor không tham số** rồi gọi `readExternal`. Khác `readObject`/`writeObject` (vốn `private`), hai method này là **`public`** — **`readExternal` có khả năng cho phép sửa state của object đang tồn tại**. Xem [[03 - Object Input Output Streams and Serialization#2.3.3. Modifying the Default Serialization Mechanism]].

## F

**File Lock**
Cơ chế **kiểm soát việc truy cập vào một file hoặc một dải byte trong file** khi nhiều chương trình chạy đồng thời cần sửa cùng file. Lấy bằng `lock()` (**block**) hoặc `tryLock()` (**trả về ngay, có thể là `null`**). **Phụ thuộc hệ thống rất nặng** — trên một số hệ thống nó **chỉ mang tính khuyến nghị (advisory)**. **File lock được nắm giữ bởi cả Java virtual machine.** Xem [[06 - File Locking]].

**FileVisitor**
Interface được truyền cho `walkFileTree`, nhận thông báo ở bốn thời điểm: **`visitFile`**, **`preVisitDirectory`**, **`postVisitDirectory`**, **`visitFileFailed`**; mỗi lần trả về một trong **`CONTINUE`, `SKIP_SUBTREE`, `SKIP_SIBLINGS`, `TERMINATE`**. Class tiện lợi **`SimpleFileVisitor`** implement nó: mọi method **trừ `visitFileFailed`** đều không làm gì và tiếp tục. Xem [[04 - Working with Files#2.4.7. Using Directory Streams]].

**Filter (input/output stream)**
Subclass của `FilterInputStream`/`FilterOutputStream` dùng để **thêm khả năng** cho input/output stream xử lý byte. **Lồng nhiều filter** vào nhau thì có nhiều khả năng cùng lúc, ví dụ `new DataInputStream(new BufferedInputStream(new FileInputStream(...)))`. Xem [[01 - Input Output Streams#2.1.3. Combining Input/Output Stream Filters]].

**Fingerprint** (serialization)
**Serial version unique ID** — dấu vân của **kiểu các data field và signature các method**. Có được bằng cách **sắp xếp mô tả class, superclass, interface, kiểu field, signature method theo cách chuẩn tắc** rồi áp **SHA** lên; serialization **chỉ dùng tám byte đầu của mã SHA**. Khi đọc object, **fingerprint được so với fingerprint hiện tại của class** — **không khớp thì sinh exception**. Xem [[03 - Object Input Output Streams and Serialization#2.3.2. Understanding the Object Serialization File Format]].

**flush**
Method **gửi mọi data đang nằm trong buffer tới đích**. Đóng output stream **cũng flush**. Xem [[01 - Input Output Streams#2.1.1. Reading and Writing Bytes]].

**Flushable**
Interface với method `void flush()`. **`OutputStream` và `Writer` implement nó.** Xem [[01 - Input Output Streams#2.1.2. The Complete Stream Zoo]].

## G

**Glob Pattern**
Cú pháp lọc file trong `newDirectoryStream`: `*` (0+ character trong **một path component**), `**` (0+ character, **vượt ranh giới directory**), `?` (một character), `[. . .]` (tập character), `{. . .}` (các lựa chọn ngăn bằng dấu phẩy), `\` (escape). Trên **Windows phải escape backslash hai lần**. Xem [[04 - Working with Files#2.4.7. Using Directory Streams]].

**Greedy / Possessive Quantifier**
Hậu tố **`+`** sau một quantifier: **lấy phần khớp dài nhất, không backtracking**, kể cả khi điều đó **làm toàn bộ phép khớp thất bại**. Ví dụ `cab` khớp `[a-z]*ab` nhưng **không khớp `[a-z]*+ab`**. Xem [[07 - Regular Expressions#2.7.1. The Regular Expression Syntax]].

**Group** (regular expression)
Subexpression bọc trong `( )`. **Group 0 là toàn bộ input**; **group thật đầu tiên có index 1**. **Group lồng nhau được đánh thứ tự theo dấu ngoặc mở.** Trỏ ngược về một group bằng **`\n`**; đặt tên bằng **`(?<name>X)`** và trỏ về bằng **`\k<name>`**; **không capture** bằng **`(?:X)`**. Xem [[07 - Regular Expressions#2.7.2. Matching a String]].

## I

**InputStream / OutputStream**
Hai **abstract class** nền tảng của cây phân cấp I/O **hướng byte**. `InputStream` có abstract method `int read()` (trả về byte đọc được, hoặc **`-1` ở cuối nguồn**); `OutputStream` có `void write(int b)`. **Mọi method khác đều gọi tới method abstract này**, nên **subclass chỉ cần override đúng một method**. Xem [[01 - Input Output Streams#2.1.1. Reading and Writing Bytes]].

**InputStreamReader / OutputStreamWriter**
`OutputStreamWriter` **biến output stream các Unicode code unit thành stream byte** theo encoding đã chọn; `InputStreamReader` **biến input stream chứa byte thành reader phát ra Unicode code unit**. **Luôn phải chọn encoding cụ thể trong constructor.** Xem [[01 - Input Output Streams#2.1.4. Text Input and Output]].

## L

**Little-Endian**
Cách lưu số với **byte có trọng số thấp nhất (LSB) đứng trước**: `1234` thành `D2 04 00 00`. **Pentium dùng little-endian.** Muốn đọc buffer chứa số little-endian thì gọi `buffer.order(ByteOrder.LITTLE_ENDIAN)`. Xem [[02 - Reading and Writing Binary Data#2.2.1. The DataInput and DataOutput interfaces]] và [[05 - Memory-Mapped Files#2.5.1. Memory-Mapped File Performance]].

## M

**mark / reset**
Cặp method của `InputStream` **đánh dấu vị trí hiện tại** và **quay lại marker cuối cùng**. **Không phải stream nào cũng hỗ trợ** — kiểm tra bằng `markSupported()`. Nếu đã đọc quá `readlimit` byte thì stream **được phép quên marker**. Xem [[01 - Input Output Streams#2.1.1. Reading and Writing Bytes]].

**Memory-Mapped File**
File hoặc một vùng file được **"map" vào memory** nhờ virtual memory, sau đó **truy cập như một array trong bộ nhớ**, **nhanh hơn nhiều** thao tác file truyền thống. Ba mapping mode: **`READ_ONLY`**, **`READ_WRITE`**, **`PRIVATE`**. Với **đọc tuần tự file cỡ vừa** thì **không có lý do dùng memory mapping**. Xem [[05 - Memory-Mapped Files]].

**Modified UTF-8**
Biến thể UTF-8 mà `writeUTF`/`readUTF` dùng: chuỗi Unicode code unit **được biểu diễn ở UTF-16 trước**, rồi kết quả **mới được mã hoá theo luật UTF-8**. Khác biệt ở character mã **lớn hơn `0xFFFF`**. Tồn tại để **tương thích ngược** với VM xây khi Unicode chưa vượt 16 bit. Vì **không ai khác dùng nó**, chỉ nên dùng `writeUTF` cho string **dành cho Java virtual machine**; mục đích khác thì dùng **`writeChars`**. Xem [[02 - Reading and Writing Binary Data#2.2.1. The DataInput and DataOutput interfaces]].

## O

**Object Serialization**
Cơ chế **rất tổng quát** cho phép **ghi bất kỳ object nào ra output stream và đọc lại sau đó**. Class phải **implement interface `Serializable`** (interface **không có method nào**). **Mỗi object được lưu kèm một serial number** — vì thế mang tên "serialization"; **object lặp lại được lưu thành reference tới serial number đó**. Ứng dụng quan trọng khác: **truyền collection object qua network tới máy khác**. Xem [[03 - Object Input Output Streams and Serialization#2.3.1. Saving and Loading Serializable Objects]].

## P

**Path**
Interface (Java 7) biểu diễn **một chuỗi tên directory, tuỳ chọn theo sau bởi một tên file**. Bắt đầu bằng **root component** thì là **absolute**, ngược lại là **relative**. **Không nhất thiết ứng với file thực sự tồn tại** — nó **chỉ là một chuỗi tên trừu tượng**. Method chính: `resolve`, `resolveSibling`, `relativize`, `normalize`, `toAbsolutePath`, `getParent`, `getFileName`, `getRoot`. Xem [[04 - Working with Files#2.4.1. Paths]].

**Pattern / Matcher**
`Pattern.compile(patternString)` **compile regular expression thành object pattern**; `pattern.matcher(input)` cho ra **`Matcher`** để **định vị phần khớp**. `matches()` kiểm tra **toàn bộ input**, `lookingAt()` kiểm tra **phần đầu input**, `find()` **tìm phần khớp kế tiếp**, `results()` cho ra **`Stream<MatchResult>`**. Xem [[07 - Regular Expressions#2.7.2. Matching a String]].

**PrintWriter**
Class dùng cho **text output**, có method **`print`, `println`, `printf`** in string và number ở dạng text. **Print writer luôn được buffer**; **autoflush mặc định KHÔNG bật**. Các method `print` **không ném exception** — gọi **`checkError`** để biết có trục trặc không. Xem [[01 - Input Output Streams#2.1.5. How to Write Text Output]].

**PushbackInputStream**
Filter cho phép **nhòm trước byte kế tiếp** rồi **ném trả lại** bằng `unread(b)`. **Đọc và trả lại là hai method duy nhất** áp dụng được cho nó. Xem [[01 - Input Output Streams#2.1.3. Combining Input/Output Stream Filters]].

## R

**RandomAccessFile**
Class cho phép **đọc hoặc ghi data ở bất kỳ đâu trong file**. Mode: **`"r"`**, **`"rw"`**, **`"rws"`** (đồng bộ cả data lẫn metadata), **`"rwd"`** (đồng bộ chỉ data). Có **file pointer** đặt bằng `seek`, đọc bằng `getFilePointer`. **Implement cả `DataInput` lẫn `DataOutput`.** **File trên đĩa là random-access, còn stream với network socket thì không.** Xem [[02 - Reading and Writing Binary Data#2.2.2. Random-Access Files]].

**Readable**
Interface với một method `int read(CharBuffer cb)` — cố đọc **nhiều giá trị `char` nhất có thể** vào `cb`. Xem [[01 - Input Output Streams#2.1.2. The Complete Stream Zoo]].

**Reader / Writer**
Hai **abstract class** nền tảng của cây phân cấp I/O **hướng character**, xử lý **Unicode**. Phép read/write dựa trên **giá trị `char` hai byte** (**UTF-16 code unit**), không phải byte. `read()` trả về **code unit từ 0 tới 65535** hoặc **`-1`** ở cuối file. Xem [[01 - Input Output Streams#2.1. Input/Output Streams]].

**readObject / writeObject**
Cặp method **`private`** mà một class serializable định nghĩa được để **thêm validation hoặc hành động mong muốn** vào hành vi mặc định; khi đó **data field không còn được serialize tự động**. Bên trong chúng gọi **`defaultReadObject`/`defaultWriteObject`**. Chúng **chỉ cần lưu/nạp data field của chính chúng**, **không bận tâm data của superclass**. Xem [[03 - Object Input Output Streams and Serialization#2.3.3. Modifying the Default Serialization Mechanism]].

**readResolve**
Method serialization đặc biệt **được gọi sau khi object đã được deserialize**; **phải trả về một object**, và object đó **trở thành giá trị trả về của `readObject`**. Cần thiết cho **typesafe enumeration** và **class theo singleton design pattern**, vì **dù constructor là `private`, cơ chế serialization vẫn tạo được object mới**. Xem [[03 - Object Input Output Streams and Serialization#2.3.4. Serializing Singletons and Typesafe Enumerations]].

**Reluctant Quantifier**
Hậu tố **`?`** sau một quantifier (còn gọi **stingy**): **thử phần khớp ngắn nhất trước** rồi mới thử dài hơn. Xem [[07 - Regular Expressions#2.7.1. The Regular Expression Syntax]].

## S

**Scanner**
Cách **dễ nhất để xử lý text bất kỳ**; dựng được từ **bất kỳ input stream nào** hoặc từ một `Path`. Đọc **token** ngăn bởi **delimiter** (mặc định là khoảng trắng, đổi được thành **bất kỳ regular expression nào** bằng `useDelimiter`). Khác `BufferedReader` ở chỗ **`Scanner` có method đọc số**. Xem [[01 - Input Output Streams#2.1.6. How to Read Text Input]].

**serialVersionUID**
Static data member khai báo **fingerprint của phiên bản class cũ**, để class **tuyên bố nó tương thích với phiên bản trước của chính nó**. Lấy số này bằng chương trình **`serialver`** của JDK. Khi class có member này, **fingerprint không được tự tính mà dùng giá trị đó**. Sách khuyên: nếu serialization **chỉ dùng cho lưu trữ ngắn hạn** thì **không cần lo về versioning**, và **an toàn hơn** là dùng `@SuppressWarnings("serial")`. Xem [[03 - Object Input Output Streams and Serialization#2.3.5. Versioning]].

**StandardCharsets**
Class chứa static variable kiểu `Charset` cho các encoding **mà mọi JVM đều phải hỗ trợ**: `UTF_8`, `UTF_16`, `UTF_16BE`, `UTF_16LE`, `ISO_8859_1`, `US_ASCII`. **Nên chọn hằng của `StandardCharsets`** để **lỗi gõ sai bị bắt lúc compile**. Xem [[01 - Input Output Streams#2.1.8. Character Encodings]].

**Stream Zoo**
Cách sách gọi bộ **hơn 60 (!) kiểu input/output stream** của Java — khác với C vốn **chỉ cần một kiểu `FILE*`**. Chia thành **hai cây phân cấp riêng**: xử lý **byte** và xử lý **character**. Xem [[01 - Input Output Streams#2.1.2. The Complete Stream Zoo]].

## T

**transferTo**
Method (Java 9) **chuyển toàn bộ byte** từ một input stream sang một output stream. **Không stream nào bị đóng.** Xem [[01 - Input Output Streams#2.1.1. Reading and Writing Bytes]].

**transient**
Keyword đánh dấu field **không bao giờ được serialize** — ví dụ **file handle** hay **handle của window** vốn chỉ có nghĩa với native method, và field **thuộc class không serializable**. **Field `transient` luôn bị bỏ qua khi object được serialize.** Xem [[03 - Object Input Output Streams and Serialization#2.3.3. Modifying the Default Serialization Mechanism]].

## U

**UTF-8**
Encoding **phổ biến nhất**, mã hoá mỗi Unicode code point thành **một tới bốn byte**. Lợi thế: các character **ASCII truyền thống chỉ chiếm một byte mỗi cái**. Xem [[01 - Input Output Streams#2.1.8. Character Encodings]].

**UTF-16**
Encoding mã hoá mỗi code point thành **một hoặc hai giá trị 16-bit**; **đây là encoding dùng trong Java string**. Có **hai dạng big-endian và little-endian**. Xem [[01 - Input Output Streams#2.1.8. Character Encodings]].

## W

**walk / walkFileTree**
`Files.walk` cho ra **`Stream<Path>` duyệt mọi hậu duệ** của directory theo **thứ tự depth-first**; giới hạn độ sâu bằng `Files.walk(pathToRoot, depth)`. `Files.walkFileTree` **cho kiểm soát chi tiết hơn** qua một `FileVisitor` — cần thiết khi **xoá cây directory**, vì phải **xoá con trước khi xoá cha**. Nếu tiêu chí lọc **dính tới file attribute** thì **dùng `find` thay `walk`** cho hiệu quả. Xem [[04 - Working with Files#2.4.6. Visiting Directory Entries]] và [[04 - Working with Files#2.4.7. Using Directory Streams]].

## Z

**ZIP Archive**
Định dạng lưu **một hoặc nhiều file ở dạng (thường là) nén**, có **header** chứa tên từng file và phương pháp nén. Đọc bằng **`ZipInputStream`** (`getNextEntry`, `closeEntry` — **đừng đóng stream cho tới khi đọc xong entry cuối**), ghi bằng **`ZipOutputStream`** (`putNextEntry`, `closeEntry`). **File JAR chỉ là file ZIP có thêm entry manifest** (xem [[09 - JAR Files]]). Xem [[02 - Reading and Writing Binary Data#2.2.3. ZIP Archives]].

**ZIP File System**
Cách truy cập ZIP archive **không cần API riêng**, dùng `FileSystems.newFileSystem` của Java 7: nó **thiết lập một file system chứa mọi file trong archive**, rồi dùng `fs.getPath` như `Paths.get`. Sách nói cách này **đẹp hơn** API `ZipInputStream` vốn đòi hỏi **cả một bộ class mới**. Xem [[04 - Working with Files#2.4.8. ZIP File Systems]].

---

## Bảng đối chiếu hai cây phân cấp

| | Hướng byte | Hướng character |
|---|---|---|
| Abstract class gốc | `InputStream` / `OutputStream` | `Reader` / `Writer` |
| Đơn vị | **byte (8 bit)** | **`char` = UTF-16 code unit (2 byte)** |
| Đọc số/kiểu primitive | `DataInputStream` / `DataOutputStream` | — |
| In text | — | `PrintWriter` |
| Cầu nối | `InputStreamReader` / `OutputStreamWriter` | |
| Nén | `ZipInputStream` / `ZipOutputStream` | — |

Xem [[01 - Input Output Streams#2.1.2. The Complete Stream Zoo]].
