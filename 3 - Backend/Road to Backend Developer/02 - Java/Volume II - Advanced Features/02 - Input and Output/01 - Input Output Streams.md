# 01 — Input/Output Streams

> Chapter 2, Section 2.1 — Core Java Volume II: Advanced Features, 11th Edition (Horstmann), Java 11.
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## Mở đầu chương 2

> *"In this chapter, we cover the Java Application Programming Interfaces (APIs) for input and output. You will learn how to access files and directories and how to read and write data in binary and text format. This chapter also shows you the object serialization mechanism that lets you store objects as easily as you can store text or numeric data. Next, we will turn to working with files and directories. We finish the chapter with a discussion of regular expressions, even though they are not actually related to input and output. We couldn't find a better place to handle that topic, and apparently neither could the Java team—the regular expression API specification was attached to a specification request for "new I/O" features."*

**Dịch:** Chương này nói về **Java Application Programming Interface (API) cho input và output**. Bạn sẽ học cách **truy cập file và directory** và cách **đọc/ghi dữ liệu ở dạng binary và text**. Chương này cũng trình bày cơ chế **object serialization**, cho phép lưu object dễ dàng như lưu text hay số. Tiếp đó sẽ chuyển sang **làm việc với file và directory**. Kết chương là phần bàn về **regular expression**, dù thực ra nó **không liên quan gì tới input và output**. Tác giả không tìm được chỗ nào đặt tốt hơn cho chủ đề đó, và có vẻ **Java team cũng vậy** — bản đặc tả regular expression API được đính kèm vào một specification request cho các tính năng **"new I/O"**.

---

## 2.1. Input/Output Streams

> *"In the Java API, an object from which we can read a sequence of bytes is called an input stream. An object to which we can write a sequence of bytes is called an output stream. These sources and destinations of byte sequences can be—and often are—files, but they can also be network connections and even blocks of memory. The abstract classes InputStream and OutputStream are the basis for a hierarchy of input/output (I/O) classes."*

**Dịch:** Trong Java API, object mà **ta đọc được một chuỗi byte từ nó** gọi là **input stream**. Object mà **ta ghi được một chuỗi byte vào nó** gọi là **output stream**. Nguồn và đích của chuỗi byte **có thể là — và thường là — file**, nhưng cũng có thể là **network connection** và thậm chí **block of memory**. Hai abstract class **`InputStream`** và **`OutputStream`** là nền tảng của cả một cây phân cấp class I/O.

> **Note (sách):** *"These input/output streams are unrelated to the streams that you saw in the preceding chapter. For clarity, we will use the terms input stream, output stream, or input/output stream whenever we discuss streams that are used for input and output."*
>
> **Dịch:** Những input/output stream này **không liên quan gì** tới stream ở chương trước ([[01 - From Iterating to Stream Operations|chương 1 Streams]]). Cho rõ ràng, sách sẽ dùng đúng các từ **input stream**, **output stream**, hoặc **input/output stream** khi nói về stream dùng cho input và output.

> *"Byte-oriented input/output streams are inconvenient for processing information stored in Unicode (recall that Unicode uses multiple bytes per character). Therefore, a separate hierarchy provides classes, inheriting from the abstract Reader and Writer classes, for processing Unicode characters. These classes have read and write operations that are based on two-byte char values (that is, UTF-16 code units) rather than byte values."*

**Dịch:** Input/output stream **hướng byte** thì **bất tiện** khi xử lý thông tin lưu dưới dạng Unicode (nhớ rằng Unicode dùng **nhiều byte cho mỗi character**). Vì thế có **một cây phân cấp riêng**, kế thừa từ hai abstract class **`Reader`** và **`Writer`**, để xử lý Unicode character. Các class này có phép read/write dựa trên **giá trị `char` hai byte** (tức **UTF-16 code unit**) chứ không phải giá trị byte.

```
       Hai cây phân cấp song song
  ┌───────────────┐        ┌───────────────┐
  │  InputStream  │        │    Reader     │  ← đọc
  │  OutputStream │        │    Writer     │  ← ghi
  └───────────────┘        └───────────────┘
      byte (8 bit)          char = UTF-16 code unit (2 byte)
```

---

## 2.1.1. Reading and Writing Bytes

> *"The InputStream class has an abstract method:"*

```java
abstract int read()
```

> *"This method reads one byte and returns the byte that was read, or -1 if it encounters the end of the input source. The designer of a concrete input stream class overrides this method to provide useful functionality. For example, in the FileInputStream class, this method reads one byte from a file. System.in is a predefined object of a subclass of InputStream that allows you to read information from “standard input,” that is, the console or a redirected file."*

**Dịch:** Method này **đọc một byte** và trả về byte vừa đọc, hoặc **`-1`** nếu gặp **cuối nguồn input**. Người thiết kế một concrete input stream class sẽ **override** method này để cung cấp chức năng hữu ích. Ví dụ trong class `FileInputStream`, method này đọc một byte từ file. **`System.in`** là object định sẵn thuộc một subclass của `InputStream`, cho phép đọc thông tin từ **"standard input"**, tức console hoặc file được redirect vào.

> *"The InputStream class also has nonabstract methods to read an array of bytes or to skip a number of bytes. Since Java 9, there is a very useful method to read all bytes of a stream:"*

```java
byte[] bytes = in.readAllBytes();
```

> *"There are also methods to read a given number of bytes—see the API notes. These methods call the abstract read method, so subclasses need to override only one method."*

**Dịch:** `InputStream` còn có các method **không abstract** để đọc một array byte hoặc **bỏ qua** một số byte. **Từ Java 9** có method rất hữu ích là `readAllBytes` để đọc **toàn bộ byte** của stream. Cũng có method đọc **một số byte cho trước**. Những method này đều **gọi tới method abstract `read`**, nên subclass **chỉ cần override đúng một method**.

> *"Similarly, the OutputStream class defines the abstract method"*

```java
abstract void write(int b)
```

> *"which writes one byte to an output location."*

> *"If you have an array of bytes, you can write them all at once:"*

```java
byte[] values = . . .;
out.write(values);
```

**Dịch:** Tương tự, `OutputStream` định nghĩa abstract method `write(int b)` **ghi một byte** tới vị trí output. Nếu có sẵn một array byte thì **ghi tất cả cùng lúc** được.

### transferTo

> *"The transferTo method transfers all bytes from an input stream to an output stream:"*

```java
in.transferTo(out);
```

**Dịch:** Method `transferTo` **chuyển toàn bộ byte** từ một input stream sang một output stream.

### Blocking

> *"Both the read and write methods block until the byte is actually read or written. This means that if the input stream cannot immediately be accessed (usually because of a busy network connection), the current thread blocks. This gives other threads the chance to do useful work while the method is waiting for the input stream to become available again."*

**Dịch:** Cả `read` lẫn `write` đều **block cho tới khi byte thực sự được đọc hoặc ghi xong**. Nghĩa là nếu input stream **không truy cập được ngay** (thường vì network connection đang bận) thì **thread hiện tại bị block**. Điều này cho **các thread khác cơ hội làm việc có ích** trong lúc method đang chờ input stream sẵn sàng trở lại.

> *"The available method lets you check the number of bytes that are currently available for reading. This means a fragment like the following is unlikely to block:"*

```java
int bytesAvailable = in.available();
if (bytesAvailable > 0)
{
    var data = new byte[bytesAvailable];
    in.read(data);
}
```

**Dịch:** Method `available` cho biết **số byte hiện đang sẵn sàng để đọc**. Nhờ vậy đoạn code như trên **ít khả năng bị block**.

### close và flush

> *"When you have finished reading or writing to an input/output stream, close it by calling the close method. This call frees up the operating system resources that are in limited supply. If an application opens too many input/output streams without closing them, system resources can become depleted. Closing an output stream also flushes the buffer used for the output stream: Any bytes that were temporarily placed in a buffer so that they could be delivered as a larger packet are sent off. In particular, if you do not close a file, the last packet of bytes might never be delivered. You can also manually flush the output with the flush method."*

**Dịch:** Đọc/ghi xong thì **đóng input/output stream bằng `close`**. Lời gọi này **giải phóng tài nguyên hệ điều hành** vốn có hạn. Nếu ứng dụng **mở quá nhiều** input/output stream mà không đóng thì **tài nguyên hệ thống cạn kiệt**. Đóng một output stream còn **flush buffer** của nó: mọi byte đang tạm nằm trong buffer để được gửi đi thành một packet lớn hơn sẽ được **đẩy đi**. Đặc biệt, **nếu không đóng file thì packet byte cuối cùng có thể không bao giờ được gửi**. Cũng có thể **flush thủ công** bằng method `flush`.

> *"Even if an input/output stream class provides concrete methods to work with the raw read and write functions, application programmers rarely use them. The data that you are interested in probably contain numbers, strings, and objects, not raw bytes. Instead of working with bytes, you can use one of many input/output classes that build upon the basic InputStream and OutputStream classes."*

**Dịch:** Dù input/output stream class có sẵn method cụ thể để làm việc với hàm `read`/`write` thô, **lập trình viên ứng dụng hiếm khi dùng chúng**. Data mà bạn quan tâm thường là **number, string, object** chứ không phải byte thô. Thay vì làm việc với byte, hãy dùng **một trong nhiều class I/O xây dựng bên trên** `InputStream` và `OutputStream`.

## API — `java.io.InputStream` (Java 1.0)

| Method | Mô tả (dịch) |
|---|---|
| `abstract int read()` | Đọc một byte data và trả về byte đọc được; trả về **`-1`** ở cuối input stream. |
| `int read(byte[] b)` | Đọc vào một array byte, trả về **số byte thực sự đọc được**, hoặc `-1` ở cuối input stream; đọc **nhiều nhất `b.length` byte**. |
| `int read(byte[] b, int off, int len)`<br>`int readNBytes(byte[] b, int off, int len)` *(9)* | Đọc **tối đa `len` byte**, nếu có sẵn mà không block (`read`), hoặc **block cho tới khi đọc đủ** (`readNBytes`). Giá trị đặt vào `b` bắt đầu từ `off`. Trả về số byte thực sự đọc, hoặc `-1` ở cuối input stream. |
| `byte[] readAllBytes()` *(9)* | Cho ra array chứa **toàn bộ byte** đọc được từ stream này. |
| `long transferTo(OutputStream out)` *(9)* | Chuyển **mọi byte** từ input stream này sang output stream đã cho, trả về số byte đã chuyển. **Không stream nào bị đóng.** |
| `long skip(long n)` | Bỏ qua `n` byte, trả về số byte **thực sự** bỏ qua (có thể ít hơn `n` nếu gặp cuối input stream). |
| `int available()` | Trả về **số byte có sẵn** mà không bị block (block nghĩa là thread hiện tại mất lượt). |
| `void close()` | Đóng input stream. |
| `void mark(int readlimit)` | Đặt **marker** tại vị trí hiện tại trong input stream (**không phải stream nào cũng hỗ trợ**). Nếu đã đọc quá `readlimit` byte thì stream **được phép quên marker**. |
| `void reset()` | Quay về **marker cuối cùng**. Các lần `read` sau sẽ đọc lại các byte đó. Nếu không có marker hiện hành thì input stream **không được reset**. |
| `boolean markSupported()` | Trả về `true` nếu input stream **hỗ trợ đánh marker**. |

## API — `java.io.OutputStream` (Java 1.0)

| Method | Mô tả (dịch) |
|---|---|
| `abstract void write(int n)` | Ghi một byte data. |
| `void write(byte[] b)`<br>`void write(byte[] b, int off, int len)` | Ghi **toàn bộ byte**, hoặc `len` byte bắt đầu từ `off`, trong array `b`. |
| `void close()` | **Flush rồi đóng** output stream. |
| `void flush()` | Flush output stream — tức **gửi mọi data đang nằm trong buffer** tới đích. |

---

## 2.1.2. The Complete Stream Zoo

> *"Unlike C, which gets by just fine with a single type FILE*, Java has a whole zoo of more than 60 (!) different input/output stream types (see Figures 2.1 and 2.2)."*

**Dịch:** Khác với C — vốn chỉ cần **một kiểu `FILE*`** là xong — Java có hẳn một **"sở thú"** với **hơn 60 (!) kiểu input/output stream** khác nhau.

> *"Let’s divide the animals in the input/output stream zoo by how they are used. There are separate hierarchies for classes that process bytes and characters."*

**Dịch:** Hãy chia đám "thú" trong sở thú input/output stream **theo cách dùng**. Có **hai cây phân cấp riêng biệt**: class xử lý **byte** và class xử lý **character**.

> *"As you saw, the InputStream and OutputStream classes let you read and write individual bytes and arrays of bytes. These classes form the basis of the hierarchy shown in Figure 2.1. To read and write strings and numbers, you need more capable subclasses. For example, DataInputStream and DataOutputStream let you read and write all the primitive Java types in binary format. Finally, there are input/output streams that do useful stuff; for example, the ZipInputStream and ZipOutputStream let you read and write files in the familiar ZIP compression format."*

**Dịch:** `InputStream` và `OutputStream` cho phép đọc/ghi **từng byte và array byte**. Muốn đọc/ghi **string và number** thì cần **subclass mạnh hơn**. Ví dụ **`DataInputStream`** và **`DataOutputStream`** cho phép đọc/ghi **mọi kiểu primitive của Java ở dạng binary**. Cuối cùng là những input/output stream **làm việc có ích**; ví dụ **`ZipInputStream`** và **`ZipOutputStream`** đọc/ghi file ở **định dạng nén ZIP** quen thuộc.

**Figure 2.1: Input and output stream hierarchy**

```
InputStream
 ├─△ AudioInputStream
 ├─△ ByteArrayInputStream
 ├─△ FileInputStream
 ├─△ PipedInputStream
 ├─△ FilterInputStream
 │    ├─△ BufferedInputStream
 │    ├─△ CheckedInputStream
 │    ├─△ CipherInputStream
 │    ├─△ DigestInputStream
 │    ├─△ InflaterInputStream
 │    │    ├─△ GZIPInputStream
 │    │    └─△ ZipInputStream
 │    │         └─△ JarInputStream
 │    ├─△ LineNumberInputStream
 │    ├─△ ProgressMonitorInputStream
 │    ├─△ PushbackInputStream
 │    └─△ DataInputStream ┈┈▷ <<interface>> DataInput
 ├─△ SequenceInputStream
 ├─△ StringBufferInputStream
 └─△ ObjectInputStream ┈┈▷ <<interface>> ObjectInput ──△ <<interface>> DataInput

OutputStream
 ├─△ ByteArrayOutputStream
 ├─△ FileOutputStream
 ├─△ FilterOutputStream
 │    ├─△ BufferedOutputStream
 │    ├─△ CheckedOutputStream
 │    ├─△ CipherOutputStream
 │    ├─△ DigestOutputStream
 │    ├─△ DeflaterOutputStream
 │    │    ├─△ GZIPOutputStream
 │    │    └─△ ZipOutputStream
 │    │         └─△ JarOutputStream
 │    ├─△ PrintStream
 │    └─△ DataOutputStream ┈┈▷ <<interface>> DataOutput
 ├─△ PipedOutputStream
 └─△ ObjectOutputStream ┈┈▷ <<interface>> ObjectOutput ──△ <<interface>> DataOutput

RandomAccessFile ┈┈▷ <<interface>> DataInput
RandomAccessFile ┈┈▷ <<interface>> DataOutput

(△ + nét liền = extends · ┈▷ = implements)
```

> *"For Unicode text, on the other hand, you can use subclasses of the abstract classes Reader and Writer (see Figure 2.2). The basic methods of the Reader and Writer classes are similar to those of InputStream and OutputStream."*

```java
abstract int read()
abstract void write(int c)
```

> *"The read method returns either a UTF-16 code unit (as an integer between 0 and 65535) or -1 when you have reached the end of the file. The write method is called with a Unicode code unit. (See Volume I, Chapter 3 for a discussion of Unicode code units.)"*

**Dịch:** Với **text Unicode**, dùng subclass của hai abstract class **`Reader`** và **`Writer`**. Method cơ bản của chúng tương tự `InputStream`/`OutputStream`. Method `read` trả về **một UTF-16 code unit** (số nguyên trong khoảng **0 đến 65535**) hoặc **`-1`** khi tới **cuối file**. Method `write` được gọi với **một Unicode code unit**. (Xem [[05 - Strings]] về code unit.)

**Figure 2.2: Reader and writer hierarchy**

```
Reader
 ├─△ BufferedReader
 │    └─△ LineNumberReader
 ├─△ CharArrayReader
 ├─△ FilterReader
 │    └─△ PushbackReader
 ├─△ InputStreamReader
 │    └─△ FileReader
 ├─△ PipedReader
 └─△ StringReader

Writer
 ├─△ BufferedWriter
 ├─△ CharArrayWriter
 ├─△ FilterWriter
 ├─△ OutputStreamWriter
 │    └─△ FileWriter
 ├─△ PipedWriter
 ├─△ PrintWriter
 └─△ StringWriter
```

### Bốn interface bổ sung

> *"There are four additional interfaces: Closeable, Flushable, Readable, and Appendable (see Figure 2.3). The first two interfaces are very simple, with methods"*

```java
void close() throws IOException
```

> *"and"*

```java
void flush()
```

> *"respectively. The classes InputStream, OutputStream, Reader, and Writer all implement the Closeable interface."*

**Dịch:** Có **bốn interface bổ sung**: `Closeable`, `Flushable`, `Readable`, `Appendable`. Hai interface đầu **rất đơn giản**, mỗi cái một method như trên. Cả bốn class `InputStream`, `OutputStream`, `Reader`, `Writer` đều **implement `Closeable`**.

**Figure 2.3: The `Closeable`, `Flushable`, `Readable`, and `Appendable` interfaces**

```
InputStream   ┈┈▷ <<interface>> Closeable
OutputStream  ┈┈▷ <<interface>> Closeable
OutputStream  ┈┈▷ <<interface>> Flushable
Reader        ┈┈▷ <<interface>> Closeable
Reader        ┈┈▷ <<interface>> Readable
Writer        ┈┈▷ <<interface>> Closeable
Writer        ┈┈▷ <<interface>> Flushable
Writer        ┈┈▷ <<interface>> Appendable
StringBuilder ┈┈▷ <<interface>> Appendable
CharBuffer    ┈┈▷ <<interface>> Appendable
CharBuffer    ┈┈▷ <<interface>> Readable

(┈▷ nét đứt = implements)
```

> **Note (sách):** *"The java.io.Closeable interface extends the java.lang.AutoCloseable interface. Therefore, you can use the try-with-resources statement with any Closeable. Why have two interfaces? The close method of the Closeable interface only throws an IOException, whereas the AutoCloseable.close method may throw any exception."*
>
> **Dịch:** Interface `java.io.Closeable` **extend `java.lang.AutoCloseable`**. Nhờ vậy **dùng được câu lệnh try-with-resources với bất kỳ `Closeable` nào** (xem [[02 - Catching Exceptions]]). Vì sao lại có **hai interface**? Vì method `close` của `Closeable` **chỉ ném `IOException`**, còn `AutoCloseable.close` **có thể ném bất kỳ exception nào**.

> *"OutputStream and Writer implement the Flushable interface."*

**Dịch:** `OutputStream` và `Writer` **implement `Flushable`**.

> *"The Readable interface has a single method"*

```java
int read(CharBuffer cb)
```

> *"The CharBuffer class has methods for sequential and random read/write access. It represents an in-memory buffer or a memory-mapped file."*

**Dịch:** Interface `Readable` có **đúng một method**. Class **`CharBuffer`** có method cho truy cập đọc/ghi **tuần tự lẫn ngẫu nhiên**. Nó biểu diễn một **buffer trong bộ nhớ** hoặc một **memory-mapped file** (xem [[05 - Memory-Mapped Files]]).

> *"The Appendable interface has two methods for appending single characters and character sequences:"*

```java
Appendable append(char c)
Appendable append(CharSequence s)
```

> *"The CharSequence interface describes basic properties of a sequence of char values. It is implemented by String, CharBuffer, StringBuilder, and StringBuffer. Of the input/output stream classes, only Writer implements Appendable."*

**Dịch:** Interface `Appendable` có **hai method** để **nối thêm** từng character và chuỗi character. Interface **`CharSequence`** mô tả các tính chất cơ bản của một chuỗi giá trị `char`; nó được **`String`, `CharBuffer`, `StringBuilder`, `StringBuffer` implement**. Trong các input/output stream class, **chỉ `Writer` implement `Appendable`**.

## API — `java.io.Closeable` (Java 5.0)

| Method | Mô tả (dịch) |
|---|---|
| `void close()` | Đóng `Closeable` này. Method này **có thể ném `IOException`**. |

## API — `java.io.Flushable` (Java 5.0)

| Method | Mô tả (dịch) |
|---|---|
| `void flush()` | Flush `Flushable` này. |

## API — `java.lang.Readable` (Java 5.0)

| Method | Mô tả (dịch) |
|---|---|
| `int read(CharBuffer cb)` | Cố đọc **nhiều giá trị `char` nhất có thể** vào `cb`. Trả về số giá trị đọc được, hoặc `-1` nếu `Readable` này **không còn giá trị nào**. |

## API — `java.lang.Appendable` (Java 5.0)

| Method | Mô tả (dịch) |
|---|---|
| `Appendable append(char c)`<br>`Appendable append(CharSequence cs)` | Nối thêm code unit đã cho, hoặc **mọi code unit trong chuỗi đã cho**, vào `Appendable` này; **trả về `this`**. |

## API — `java.lang.CharSequence` (Java 1.4)

| Method | Mô tả (dịch) |
|---|---|
| `char charAt(int index)` | Trả về **code unit tại index** đã cho. |
| `int length()` | Trả về **số code unit** trong chuỗi này. |
| `CharSequence subSequence(int startIndex, int endIndex)` | Trả về một `CharSequence` gồm các code unit từ index `startIndex` tới **`endIndex - 1`**. |
| `String toString()` | Trả về **string** gồm các code unit của chuỗi này. |

---

## 2.1.3. Combining Input/Output Stream Filters

> *"FileInputStream and FileOutputStream give you input and output streams attached to a disk file. You need to pass the file name or full path name of the file to the constructor. For example,"*

```java
var fin = new FileInputStream("employee.dat");
```

> *"looks in the user directory for a file named employee.dat."*

**Dịch:** `FileInputStream` và `FileOutputStream` cho ta input/output stream **gắn vào một file trên đĩa**. Truyền **tên file hoặc full path name** vào constructor. Ví dụ trên **tìm file `employee.dat` trong user directory**.

> **Tip (sách):** *"All the classes in java.io interpret relative path names as starting from the user’s working directory. You can get this directory by a call to System.getProperty("user.dir")."*
>
> **Dịch:** Mọi class trong `java.io` đều hiểu **relative path name là tính từ working directory của user**. Lấy thư mục này bằng `System.getProperty("user.dir")`.

> **Caution (sách):** *"Since the backslash character is the escape character in Java strings, be sure to use \\ for Windows-style path names (for example, C:\\Windows\\win.ini). In Windows, you can also use a single forward slash (C:/Windows/win.ini) because most Windows file-handling system calls will interpret forward slashes as file separators. However, this is not recommended—the behavior of the Windows system functions is subject to change. Instead, for portable programs, use the file separator character for the platform on which your program runs. It is available as the constant string java.io.File.separator."*
>
> **Dịch:** Vì **backslash là escape character** trong Java string, nhớ dùng **`\\`** cho path name kiểu Windows (ví dụ `C:\\Windows\\win.ini`). Trên Windows cũng dùng được **một forward slash** (`C:/Windows/win.ini`) vì hầu hết system call xử lý file của Windows hiểu forward slash là dấu phân cách. Tuy nhiên **không khuyến nghị** — hành vi của hàm hệ thống Windows **có thể thay đổi**. Với chương trình **portable**, hãy dùng **file separator character của platform** đang chạy, có sẵn ở hằng string **`java.io.File.separator`**.

### Vì sao phải ghép filter

> *"Like the abstract InputStream and OutputStream classes, these classes only support reading and writing at the byte level. That is, we can only read bytes and byte arrays from the object fin."*

```java
byte b = (byte) fin.read();
```

> *"As you will see in the next section, if we just had a DataInputStream, we could read numeric types:"*

```java
DataInputStream din = . . .;
double x = din.readDouble();
```

> *"But just as the FileInputStream has no methods to read numeric types, the DataInputStream has no method to get data from a file."*

**Dịch:** Giống như abstract class `InputStream`/`OutputStream`, hai class file này **chỉ hỗ trợ đọc ghi ở mức byte**. `DataInputStream` thì đọc được kiểu số — nhưng cũng như `FileInputStream` **không có method đọc kiểu số**, `DataInputStream` **không có method lấy data từ file**.

> *"Java uses a clever mechanism to separate two kinds of responsibilities. Some input streams (such as the FileInputStream and the input stream returned by the openStream method of the URL class) can retrieve bytes from files and other more exotic locations. Other input streams (such as the DataInputStream) can assemble bytes into more useful data types. The Java programmer has to combine the two. For example, to be able to read numbers from a file, first create a FileInputStream and then pass it to the constructor of a DataInputStream."*

```java
var fin = new FileInputStream("employee.dat");
var din = new DataInputStream(fin);
double x = din.readDouble();
```

**Dịch:** Java dùng một cơ chế **thông minh để tách hai loại trách nhiệm**. **Một số input stream** (như `FileInputStream`, và input stream trả về bởi method `openStream` của class `URL`) **lấy byte** từ file và những nơi kỳ lạ hơn. **Một số input stream khác** (như `DataInputStream`) **lắp ráp byte thành kiểu data hữu ích hơn**. Lập trình viên Java phải **kết hợp cả hai**.

> *"If you look at Figure 2.1 again, you can see the classes FilterInputStream and FilterOutputStream. The subclasses of these classes are used to add capabilities to input/output streams that process bytes."*

**Dịch:** Nhìn lại Figure 2.1 sẽ thấy class **`FilterInputStream`** và **`FilterOutputStream`**. Subclass của chúng dùng để **thêm khả năng** cho input/output stream xử lý byte.

### Lồng nhiều filter

> *"You can add multiple capabilities by nesting the filters. For example, by default, input streams are not buffered. That is, every call to read asks the operating system to dole out yet another byte. It is more efficient to request blocks of data instead and store them in a buffer. If you want buffering and the data input methods for a file, use the following rather monstrous sequence of constructors:"*

```java
var din = new DataInputStream(
    new BufferedInputStream(
        new FileInputStream("employee.dat")));
```

> *"Notice that we put the DataInputStream last in the chain of constructors because we want to use the DataInputStream methods, and we want them to use the buffered read method."*

**Dịch:** **Lồng các filter** vào nhau thì thêm được nhiều khả năng. Ví dụ, mặc định input stream **không được buffer**: mỗi lần gọi `read` là **hỏi hệ điều hành phát cho thêm một byte**. **Hiệu quả hơn** là yêu cầu **cả block data** rồi lưu vào buffer. Chú ý đặt **`DataInputStream` ở ngoài cùng** trong chuỗi constructor, vì ta muốn dùng method của `DataInputStream` và muốn chúng dùng **method read đã được buffer**.

### PushbackInputStream

> *"Sometimes you’ll need to keep track of the intermediate input streams when chaining them together. For example, when reading input, you often need to peek at the next byte to see if it is the value that you expect. Java provides the PushbackInputStream for this purpose."*

```java
var pbin = new PushbackInputStream(
    new BufferedInputStream(
        new FileInputStream("employee.dat")));
```

> *"Now you can speculatively read the next byte"*

```java
int b = pbin.read();
```

> *"and throw it back if it isn’t what you wanted."*

```java
if (b != '<') pbin.unread(b);
```

**Dịch:** Đôi khi cần **giữ tham chiếu tới các input stream trung gian** khi nối chuỗi. Ví dụ khi đọc input, ta thường cần **nhòm trước byte kế tiếp** xem có đúng giá trị mong đợi không. Java có **`PushbackInputStream`** cho việc này: đọc thử byte kế tiếp, rồi **ném trả lại** nếu không phải thứ mình muốn.

> *"However, reading and unreading are the only methods that apply to a pushback input stream. If you want to look ahead and also read numbers, then you need both a pushback input stream and a data input stream reference."*

```java
var pbin = new PushbackInputStream(
    new BufferedInputStream(
        new FileInputStream("employee.dat")));
var din = new DataInputStream(pbin);
```

**Dịch:** Tuy nhiên **đọc và trả lại là hai method duy nhất** áp dụng được cho pushback input stream. Muốn vừa nhòm trước vừa đọc số thì cần **giữ cả reference tới pushback input stream lẫn data input stream**.

> *"Of course, in the input/output libraries of other programming languages, niceties such as buffering and lookahead are automatically taken care of—so it is a bit of a hassle to resort, in Java, to combining stream filters. However, the ability to mix and match filter classes to construct useful sequences of input/output streams does give you an immense amount of flexibility. For example, you can read numbers from a compressed ZIP file by using the following sequence of input streams (see Figure 2.4):"*

```java
var zin = new ZipInputStream(new FileInputStream("employee.zip"));
var din = new DataInputStream(zin);
```

**Dịch:** Dĩ nhiên trong thư viện I/O của **ngôn ngữ khác**, những tiện nghi như buffering và lookahead **được lo tự động** — nên phải ghép stream filter trong Java thì **hơi phiền**. Nhưng khả năng **trộn và ghép các filter class** để dựng nên chuỗi input/output stream hữu ích lại cho ta **độ linh hoạt cực lớn**. Ví dụ đọc số từ **file ZIP nén** bằng chuỗi input stream trên.

**Figure 2.4: A sequence of filtered input streams**

```
      ┌─────────────────┐   ┌────────────────┐   ┌─────────────────┐
      │ DataInputStream │   │ ZipInputStream │   │ FileInputStream │
      └────────┬────────┘   └───────┬────────┘   └────────┬────────┘
               ┊                    ┊                     ┊
   read      ┌─┴─┐                  ┊                     ┊
 ───────────▶│   │      read      ┌─┴─┐                   ┊
             │   │───────────────▶│   │      read       ┌─┴─┐
             │   │                │   │────────────────▶│   │
             │   │                │   │                 │   │
             └─┬─┘                └─┬─┘                 └─┬─┘
               ┊                    ┊                     ┊
```

## API — `java.io.FileInputStream` (Java 1.0)

| Method | Mô tả (dịch) |
|---|---|
| `FileInputStream(String name)`<br>`FileInputStream(File file)` | Tạo file input stream mới dùng file có path name cho bởi **string `name`** hoặc **object `File`**. Path name **không tuyệt đối** được phân giải **tương đối với working directory lúc VM khởi động**. |

## API — `java.io.FileOutputStream` (Java 1.0)

| Method | Mô tả (dịch) |
|---|---|
| `FileOutputStream(String name)`<br>`FileOutputStream(String name, boolean append)`<br>`FileOutputStream(File file)`<br>`FileOutputStream(File file, boolean append)` | Tạo file output stream mới chỉ định bởi string `name` hoặc object `File`. Nếu parameter **`append` là `true`** thì **file cùng tên đang có sẽ không bị xoá** và data được **thêm vào cuối file**. Ngược lại, method này **xoá mọi file đang tồn tại cùng tên**. |

## API — `java.io.BufferedInputStream` (Java 1.0)

| Method | Mô tả (dịch) |
|---|---|
| `BufferedInputStream(InputStream in)` | Tạo một buffered input stream. Buffered input stream **đọc byte từ stream mà không phải truy cập thiết bị mỗi lần**. Khi **buffer rỗng**, một block data mới được đọc vào buffer. |

## API — `java.io.BufferedOutputStream` (Java 1.0)

| Method | Mô tả (dịch) |
|---|---|
| `BufferedOutputStream(OutputStream out)` | Tạo một buffered output stream. Nó **gom byte cần ghi lại** mà không truy cập thiết bị mỗi lần. Khi **buffer đầy** hoặc khi stream **được flush**, data mới được ghi. |

## API — `java.io.PushbackInputStream` (Java 1.0)

| Method | Mô tả (dịch) |
|---|---|
| `PushbackInputStream(InputStream in)`<br>`PushbackInputStream(InputStream in, int size)` | Dựng input stream có **lookahead một byte** hoặc **pushback buffer với kích thước chỉ định**. |
| `void unread(int b)` | **Đẩy trả lại** một byte, byte đó **được lấy lại ở lần gọi `read` kế tiếp**. |

---

## 2.1.4. Text Input and Output

> *"When saving data, you have the choice between binary and text formats. For example, if the integer 1234 is saved in binary, it is written as the sequence of bytes 00 00 04 D2 (in hexadecimal notation). In text format, it is saved as the string "1234". Although binary I/O is fast and efficient, it is not easily readable by humans."*

**Dịch:** Khi lưu data, ta chọn giữa **định dạng binary và text**. Ví dụ số nguyên `1234` lưu binary thì được ghi thành chuỗi byte **`00 00 04 D2`** (hex); ở định dạng text nó là string **`"1234"`**. Binary I/O **nhanh và hiệu quả** nhưng **không dễ đọc với con người**.

> *"When saving text strings, you need to consider the character encoding. In the UTF-16 encoding that Java uses internally, the string "José" is encoded as 00 4A 00 6F 00 73 00 E9 (in hex). However, many programs expect that text files use a different encoding. In UTF-8, the encoding most commonly used on the Internet, the string would be written as 4A 6F 73 C3 A9, without the zero bytes for the first three letters and with two bytes for the é character."*

**Dịch:** Khi lưu text string thì phải tính tới **character encoding**. Với **UTF-16** mà Java dùng bên trong, string `"José"` được mã hoá thành `00 4A 00 6F 00 73 00 E9` (hex). Nhưng nhiều chương trình lại mong file text dùng **encoding khác**. Với **UTF-8**, encoding phổ biến nhất trên Internet, string đó được ghi là `4A 6F 73 C3 A9` — **không có byte 0** cho ba chữ cái đầu và **hai byte** cho ký tự `é`.

> *"The OutputStreamWriter class turns an output stream of Unicode code units into a stream of bytes, using a chosen character encoding. Conversely, the InputStreamReader class turns an input stream that contains bytes (specifying characters in some character encoding) into a reader that emits Unicode code units."*

**Dịch:** Class **`OutputStreamWriter`** biến một output stream **các Unicode code unit** thành **stream byte**, dùng character encoding đã chọn. Ngược lại, class **`InputStreamReader`** biến một input stream **chứa byte** (biểu diễn character theo một encoding nào đó) thành một **reader phát ra Unicode code unit**.

> *"For example, here is how you make an input reader that reads keystrokes from the console and converts them to Unicode:"*

```java
var in = new InputStreamReader(System.in);
```

> *"This input stream reader assumes the default character encoding used by the host system. On desktop operating systems, that can be an archaic encoding such as Windows 1252 or MacRoman. You should always choose a specific encoding in the constructor for the InputStreamReader, for example:"*

```java
var in = new InputStreamReader(new FileInputStream("data.txt"), StandardCharsets.UTF_8);
```

**Dịch:** Input stream reader không chỉ định gì thì **giả định character encoding mặc định của hệ thống**. Trên desktop OS, đó có thể là encoding **cổ lỗ** như **Windows 1252** hoặc **MacRoman**. **Luôn luôn phải chọn encoding cụ thể** trong constructor của `InputStreamReader`.

> *"The Reader and Writer classes have only basic methods to read and write individual characters. As with streams, you use subclasses for processing strings and numbers."*

**Dịch:** `Reader` và `Writer` chỉ có method cơ bản đọc/ghi **từng character**. Cũng như với stream, dùng **subclass** để xử lý string và number.

---

## 2.1.5. How to Write Text Output

> *"For text output, use a PrintWriter. That class has methods to print strings and numbers in text format. In order to print to a file, construct a PrintStream from a file name and a character encoding:"*

```java
var out = new PrintWriter("employee.txt", StandardCharsets.UTF_8);
```

**Dịch:** Với **text output**, dùng **`PrintWriter`**. Class này có method **in string và number ở dạng text**. Để in ra file, dựng nó từ **tên file và character encoding**.

> *"To write to a print writer, use the same print, println, and printf methods that you used with System.out. You can use these methods to print numbers (int, short, long, float, double), characters, boolean values, strings, and objects."*

> *"For example, consider this code:"*

```java
String name = "Harry Hacker";
double salary = 75000;
out.print(name);
out.print(' ');
out.println(salary);
```

> *"This writes the characters"*

```
Harry Hacker 75000.0
```

> *"to the writer out. The characters are then converted to bytes and end up in the file employee.txt."*

**Dịch:** Ghi vào print writer bằng đúng các method **`print`, `println`, `printf`** đã dùng với `System.out`. Chúng in được **number (`int`, `short`, `long`, `float`, `double`), character, giá trị `boolean`, string, và object**. Các character sau đó **được chuyển thành byte** và nằm trong file `employee.txt`.

> *"The println method adds the correct end-of-line character for the target system ("\r\n" on Windows, "\n" on UNIX) to the line. This is the string obtained by the call System.getProperty("line.separator")."*

**Dịch:** Method `println` **thêm ký tự xuống dòng đúng với hệ thống đích** (`"\r\n"` trên Windows, `"\n"` trên UNIX). Đó chính là string lấy được từ `System.getProperty("line.separator")`.

### Autoflush

> *"If the writer is set to autoflush mode, all characters in the buffer are sent to their destination whenever println is called. (Print writers are always buffered.) By default, autoflushing is not enabled. You can enable or disable autoflushing by using the PrintWriter(Writer writer, boolean autoFlush) constructor:"*

```java
var out = new PrintWriter(
    new OutputStreamWriter(
        new FileOutputStream("employee.txt"), StandardCharsets.UTF_8),
    true); // autoflush
```

**Dịch:** Nếu writer bật **autoflush mode**, **mọi character trong buffer được gửi tới đích mỗi khi gọi `println`**. (**Print writer luôn được buffer.**) Mặc định **autoflush KHÔNG được bật**. Bật/tắt bằng constructor `PrintWriter(Writer writer, boolean autoFlush)`.

> *"The print methods don’t throw exceptions. You can call the checkError method to see if something went wrong with the output stream."*

**Dịch:** Các method `print` **không ném exception**. Gọi **`checkError`** để xem output stream có trục trặc gì không.

> **Note (sách):** *"Java veterans might wonder whatever happened to the PrintStream class and to System.out. In Java 1.0, the PrintStream class simply truncated all Unicode characters to ASCII characters by dropping the top byte. (At the time, Unicode was still a 16-bit encoding.) Clearly, that was not a clean or portable approach, and it was fixed with the introduction of readers and writers in Java 1.1. For compatibility with existing code, System.in, System.out, and System.err are still input/output streams, not readers and writers. But now the PrintStream class internally converts Unicode characters to the default host encoding in the same way the PrintWriter does. Objects of type PrintStream act exactly like print writers when you use the print and println methods, but unlike print writers they allow you to output raw bytes with the write(int) and write(byte[]) methods."*
>
> **Dịch:** Dân Java kỳ cựu có thể thắc mắc **class `PrintStream` và `System.out` giờ ra sao**. Ở **Java 1.0**, `PrintStream` chỉ đơn giản **cắt cụt mọi Unicode character thành ASCII bằng cách vứt byte cao đi** (thời đó Unicode vẫn là encoding 16-bit). Rõ ràng đó **không sạch cũng không portable**, và đã được sửa khi **reader và writer ra đời ở Java 1.1**. Để **tương thích với code cũ**, `System.in`, `System.out`, `System.err` **vẫn là input/output stream**, không phải reader/writer. Nhưng nay `PrintStream` **tự chuyển Unicode character sang encoding mặc định của host** y như `PrintWriter`. Object kiểu `PrintStream` hành xử **giống hệt print writer** khi dùng `print`/`println`, nhưng **khác print writer ở chỗ cho phép xuất byte thô** bằng `write(int)` và `write(byte[])`.

## API — `java.io.PrintWriter` (Java 1.1)

| Method | Mô tả (dịch) |
|---|---|
| `PrintWriter(OutputStream out)`<br>`PrintWriter(Writer writer)` | Tạo `PrintWriter` mới ghi tới writer đã cho. |
| `PrintWriter(String filename, String encoding)`<br>`PrintWriter(File file, String encoding)` | Tạo `PrintWriter` mới ghi tới file đã cho, dùng **character encoding đã cho**. |
| `void print(Object obj)` | In một object bằng cách in **string kết quả của `toString`**. |
| `void print(String s)` | In một string chứa **Unicode code unit**. |
| `void println(String s)` | In một string **kèm dấu kết thúc dòng**. **Flush output stream nếu đang ở autoflush mode.** |
| `void print(char[] s)` | In **mọi Unicode code unit** trong array đã cho. |
| `void print(char c)` | In **một Unicode code unit**. |
| `void print(int i)`<br>`void print(long l)`<br>`void print(float f)`<br>`void print(double d)`<br>`void print(boolean b)` | In giá trị đã cho **ở dạng text**. |
| `void printf(String format, Object... args)` | In các giá trị đã cho **theo format string**. |
| `boolean checkError()` | Trả về `true` nếu **có lỗi format hoặc lỗi output**. Một khi output stream đã gặp lỗi, nó **bị "nhiễm"** và **mọi lời gọi `checkError` sau đó đều trả về `true`**. |

---

## 2.1.6. How to Read Text Input

> *"The easiest way to process arbitrary text is the Scanner class that we used extensively in Volume I. You can construct a Scanner from any input stream."*

**Dịch:** Cách **dễ nhất** để xử lý text bất kỳ là class **`Scanner`**. Dựng được `Scanner` từ **bất kỳ input stream nào**.

> *"Alternatively, you can read a short text file into a string like this:"*

```java
var content = Files.readString(path, charset);
```

> *"But if you want the file as a sequence of lines, call"*

```java
List<String> lines = Files.readAllLines(path, charset);
```

> *"If the file is large, process the lines lazily as a Stream\<String>:"*

```java
try (Stream<String> lines = Files.lines(path, charset))
{
    . . .
}
```

**Dịch:** Hoặc đọc **file text ngắn thành một string** bằng `Files.readString`. Muốn file **thành chuỗi các dòng** thì gọi `Files.readAllLines`. Nếu **file lớn**, xử lý các dòng **lười (lazily)** dưới dạng `Stream<String>` bằng `Files.lines`.

### Token và delimiter

> *"You can also use a scanner to read tokens—strings that are separated by a delimiter. The default delimiter is white space. You can change the delimiter to any regular expression. For example,"*

```java
Scanner in = . . .;
in.useDelimiter("\\PL+");
```

> *"accepts any non-Unicode letters as delimiters. The scanner then accepts tokens consisting only of Unicode letters."*

> *"Calling the next method yields the next token:"*

```java
while (in.hasNext())
{
    String word = in.next();
    . . .
}
```

> *"Alternatively, you can obtain a stream of all tokens as"*

```java
Stream<String> words = in.tokens();
```

**Dịch:** Cũng dùng scanner để đọc **token** — các string được **ngăn cách bởi một delimiter**. Delimiter mặc định là **khoảng trắng**. Đổi delimiter thành **bất kỳ regular expression** nào cũng được (xem [[07 - Regular Expressions]]). Ví dụ trên **nhận mọi ký tự không phải chữ cái Unicode làm delimiter**, nên scanner chỉ nhận token **gồm toàn chữ cái Unicode**. Gọi `next` cho ra token kế tiếp; hoặc lấy **stream mọi token** bằng `in.tokens()`.

### BufferedReader

> *"In early versions of Java, the only game in town for processing text input was the BufferedReader class. Its readLine method yields a line of text, or null when no more input is available. A typical input loop looks like this:"*

```java
InputStream inputStream = . . .;
try (var in = new BufferedReader(new InputStreamReader(inputStream, charset)))
{
    String line;
    while ((line = in.readLine()) != null)
    {
        do something with line
    }
}
```

> *"Nowadays, the BufferedReader class also has a lines method that yields a Stream\<String>. However, unlike a Scanner, a BufferedReader has no methods for reading numbers."*

**Dịch:** Ở **các phiên bản Java đầu**, lựa chọn duy nhất để xử lý text input là class **`BufferedReader`**. Method **`readLine`** cho ra **một dòng text**, hoặc **`null`** khi không còn input. Ngày nay `BufferedReader` cũng có method **`lines`** cho ra `Stream<String>`. Tuy nhiên, **khác với `Scanner`, `BufferedReader` không có method đọc số**.

---

## 2.1.7. Saving Objects in Text Format

> *"In this section, we walk you through an example program that stores an array of Employee records in a text file. Each record is stored in a separate line. Instance fields are separated from each other by delimiters. We use a vertical bar (|) as our delimiter. (A colon (:) is another popular choice. Part of the fun is that everyone uses a different delimiter.) Naturally, we punt on the issue of what might happen if a | actually occurs in one of the strings we save."*

**Dịch:** Phần này đi qua một chương trình ví dụ lưu **array các record `Employee` vào file text**. **Mỗi record một dòng riêng.** Các instance field ngăn nhau bằng **delimiter**; sách dùng **dấu gạch đứng `|`**. (Dấu hai chấm `:` cũng là lựa chọn phổ biến — cái vui là **ai cũng dùng một delimiter khác nhau**.) Dĩ nhiên sách **né vấn đề** chuyện gì xảy ra nếu bản thân string chứa dấu `|`.

> *"Here is a sample set of records:"*

```
Harry Hacker|35500|1989-10-01
Carl Cracker|75000|1987-12-15
Tony Tester|38000|1990-03-15
```

> *"Writing records is simple. Since we write to a text file, we use the PrintWriter class. We simply write all fields, followed by either a | or, for the last field, a newline character. This work is done in the following writeData method that we add to our Employee class:"*

```java
public static void writeEmployee(PrintWriter out, Employee e)
{
    out.println(e.getName() + "|" + e.getSalary() + "|" + e.getHireDay());
}
```

**Dịch:** **Ghi record thì đơn giản.** Vì ghi ra file text nên dùng `PrintWriter`: ghi mọi field, sau mỗi field là **`|`**, riêng field cuối là **ký tự xuống dòng**.

> *"To read records, we read in a line at a time and separate the fields. We use a scanner to read each line and then split the line into tokens with the String.split method."*

```java
public static Employee readEmployee(Scanner in)
{
    String line = in.nextLine();
    String[] tokens = line.split("\\|");
    String name = tokens[0];
    double salary = Double.parseDouble(tokens[1]);
    LocalDate hireDate = LocalDate.parse(tokens[2]);
    int year = hireDate.getYear();
    int month = hireDate.getMonthValue();
    int day = hireDate.getDayOfMonth();
    return new Employee(name, salary, year, month, day);
}
```

> *"The parameter of the split method is a regular expression describing the separator. We discuss regular expressions in more detail at the end of this chapter. As it happens, the vertical bar character has a special meaning in regular expressions, so it needs to be escaped with a \ character. That character needs to be escaped by another \, yielding the "\\|" expression."*

**Dịch:** **Đọc record** thì đọc từng dòng rồi tách field: dùng scanner đọc mỗi dòng, sau đó **tách thành token bằng `String.split`**. Parameter của `split` là một **regular expression mô tả dấu phân cách**. Chuyện là **dấu gạch đứng có ý nghĩa đặc biệt trong regular expression**, nên phải **escape bằng `\`**, và ký tự đó lại phải **escape bằng một `\` nữa**, thành biểu thức **`"\\|"`**.

> *"The complete program is in Listing 2.1. The static method"*

```java
void writeData(Employee[] e, PrintWriter out)
```

> *"first writes the length of the array, then writes each record. The static method"*

```java
Employee[] readData(Scanner in)
```

> *"first reads in the length of the array, then reads in each record. This turns out to be a bit tricky:"*

```java
int n = in.nextInt();
in.nextLine(); // consume newline
var employees = new Employee[n];
for (int i = 0; i < n; i++)
{
    employees[i] = new Employee();
    employees[i].readData(in);
}
```

> *"The call to nextInt reads the array length but not the trailing newline character. We must consume the newline so that the readData method can get the next input line when it calls the nextLine method."*

**Dịch:** Method `writeData` **ghi độ dài array trước**, rồi ghi từng record. Method `readData` **đọc độ dài array trước**, rồi đọc từng record — chỗ này **hơi hóc**: lời gọi `nextInt` **đọc độ dài array nhưng không đọc ký tự xuống dòng đứng sau**. Ta **phải "ăn" (consume) ký tự xuống dòng đó** thì `readData` mới lấy được dòng input kế tiếp khi nó gọi `nextLine`.

### Listing 2.1 — `textFile/TextFileTest.java`

```java
package textFile;

import java.io.*;
import java.nio.charset.*;
import java.time.*;
import java.util.*;

/**
 * @version 1.15 2018-03-17
 * @author Cay Horstmann
 */
public class TextFileTest
{
    public static void main(String[] args) throws IOException
    {
        var staff = new Employee[3];

        staff[0] = new Employee("Carl Cracker", 75000, 1987, 12, 15);
        staff[1] = new Employee("Harry Hacker", 50000, 1989, 10, 1);
        staff[2] = new Employee("Tony Tester", 40000, 1990, 3, 15);

        // save all employee records to the file employee.dat
        try (var out = new PrintWriter("employee.dat", StandardCharsets.UTF_8))
        {
            writeData(staff, out);
        }

        // retrieve all records into a new array
        try (var in = new Scanner(
                new FileInputStream("employee.dat"), "UTF-8"))
        {
            Employee[] newStaff = readData(in);

            // print the newly read employee records
            for (Employee e : newStaff)
                System.out.println(e);
        }
    }

    /**
     * Writes all employees in an array to a print writer
     * @param employees an array of employees
     * @param out a print writer
     */
    private static void writeData(Employee[] employees, PrintWriter out)
        throws IOException
    {
        // write number of employees
        out.println(employees.length);

        for (Employee e : employees)
            writeEmployee(out, e);
    }

    /**
     * Reads an array of employees from a scanner
     * @param in the scanner
     * @return the array of employees
     */
    private static Employee[] readData(Scanner in)
    {
        // retrieve the array size
        int n = in.nextInt();
        in.nextLine(); // consume newline

        var employees = new Employee[n];
        for (int i = 0; i < n; i++)
        {
            employees[i] = readEmployee(in);
        }
        return employees;
    }

    /**
     * Writes employee data to a print writer
     * @param out the print writer
     */
    public static void writeEmployee(PrintWriter out, Employee e)
    {
        out.println(e.getName() + "|" + e.getSalary() + "|" + e.getHireDay());
    }

    /**
     * Reads employee data from a buffered reader
     * @param in the scanner
     */
    public static Employee readEmployee(Scanner in)
    {
        String line = in.nextLine();
        String[] tokens = line.split("\\|");
        String name = tokens[0];
        double salary = Double.parseDouble(tokens[1]);
        LocalDate hireDate = LocalDate.parse(tokens[2]);
        int year = hireDate.getYear();
        int month = hireDate.getMonthValue();
        int day = hireDate.getDayOfMonth();
        return new Employee(name, salary, year, month, day);
    }
}
```

---

## 2.1.8. Character Encodings

> *"Input and output streams are for sequences of bytes, but in many cases you will work with texts—that is, sequences of characters. It then matters how characters are encoded into bytes."*

> *"Java uses the Unicode standard for characters. Each character, or “code point,” has a 21-bit integer number. There are different character encodings—methods for packaging those 21-bit numbers into bytes."*

**Dịch:** Input/output stream là dành cho **chuỗi byte**, nhưng nhiều khi ta làm việc với **text** — tức chuỗi character. Khi đó **cách character được mã hoá thành byte trở nên quan trọng**. Java dùng **chuẩn Unicode**: mỗi character, hay **"code point"**, là một **số nguyên 21 bit**. Có **nhiều character encoding** khác nhau — tức **cách đóng gói những số 21 bit đó thành byte**.

> *"The most common encoding is UTF-8, which encodes each Unicode code point into a sequence of one to four bytes (see Table 2.1). UTF-8 has the advantage that the characters of the traditional ASCII character set, which contains all characters used in English, only take up one byte each."*

**Dịch:** Encoding **phổ biến nhất là UTF-8**, mã hoá mỗi Unicode code point thành chuỗi **một tới bốn byte**. Lợi thế của UTF-8: các character trong bộ **ASCII truyền thống** (chứa mọi character dùng trong tiếng Anh) **chỉ chiếm một byte mỗi cái**.

### Table 2.1 — UTF-8 Encoding

| Character Range | Encoding |
|---|---|
| `0. . .7F` | `0a6a5a4a3a2a1a0` |
| `80. . .7FF` | `110a10a9a8a7a6  10a5a4a3a2a1a0` |
| `800. . .FFFF` | `1110a15a14a13a12  10a11a10a9a8a7a6  10a5a4a3a2a1a0` |
| `10000. . .10FFFF` | `11110a20a19a18  10a17a16a15a14a13a12  10a11a10a9a8a7a6  10a5a4a3a2a1a0` |

> *"Another common encoding is UTF-16, which encodes each Unicode code point into one or two 16-bit values (see Table 2.2). This is the encoding used in Java strings. Actually, there are two forms of UTF-16, called “big-endian” and “little-endian.” Consider the 16-bit value 0x2122. In the big-endian format, the more significant byte comes first: 0x21 followed by 0x22. In the little-endian format, it is the other way around: 0x22 0x21. To indicate which of the two is used, a file can start with the “byte order mark,” the 16-bit quantity 0xFEFF. A reader can use this value to determine the byte order and then discard it."*

**Dịch:** Một encoding phổ biến khác là **UTF-16**, mã hoá mỗi code point thành **một hoặc hai giá trị 16-bit**. Đây là **encoding dùng trong Java string**. Thực ra UTF-16 có **hai dạng**: **"big-endian"** và **"little-endian"**. Xét giá trị 16-bit `0x2122`: ở **big-endian**, **byte có trọng số cao đứng trước** — `0x21` rồi `0x22`; ở **little-endian** thì ngược lại — `0x22 0x21`. Để chỉ rõ dùng dạng nào, file có thể **bắt đầu bằng "byte order mark"**, đại lượng 16-bit **`0xFEFF`**. Reader dùng giá trị này để **xác định byte order rồi vứt nó đi**.

### Table 2.2 — UTF-16 Encoding

| Character Range | Encoding |
|---|---|
| `0. . .FFFF` | `a15a14a13a12a11a10a9a8  a7a6a5a4a3a2a1a0` |
| `10000. . .10FFFF` | `110110b19b18  b17b16a15a14a13a12a11a10  110111a9a8  a7a6a5a4a3a2a1a0` |

> *"where b19b18b17b16 = a20a19a18a17a16 - 1"*

**Dịch:** trong đó `b19b18b17b16 = a20a19a18a17a16 - 1`.

> **Caution (sách):** *"Some programs, including Microsoft Notepad, add a byte order mark at the beginning of UTF-8 encoded files. Clearly, this is unnecessary since there are no byte ordering issues in UTF-8. But the Unicode standard allows it, and even suggests that it’s a pretty good idea since it leaves little doubt about the encoding. It is supposed to be removed when reading a UTF-8 encoded file. Sadly, Java does not do that, and bug reports against this issue are closed as “will not fix.” Your best bet is to strip out any leading \uFEFF that you find in your input."*
>
> **Dịch:** Một số chương trình, kể cả **Microsoft Notepad**, thêm **byte order mark vào đầu file mã hoá UTF-8**. Rõ ràng điều này **không cần thiết** vì UTF-8 **không có vấn đề thứ tự byte**. Nhưng chuẩn Unicode **cho phép**, thậm chí gợi ý rằng đó là ý hay vì **để lại rất ít nghi ngờ về encoding**. Lẽ ra nó **phải bị gỡ bỏ khi đọc file UTF-8**. Đáng buồn là **Java không làm vậy**, và các bug report về việc này bị đóng với lý do **"will not fix"**. Cách tốt nhất là **tự cắt bỏ mọi `\uFEFF` đứng đầu** mà bạn thấy trong input.

> *"In addition to the UTF encodings, there are partial encodings that cover a character range suitable for a given user population. For example, ISO 8859-1 is a one-byte code that includes accented characters used in Western European languages. Shift-JIS is a variable-length code for Japanese characters. A large number of these encodings are still in widespread use."*

**Dịch:** Ngoài các encoding UTF, còn có **encoding từng phần** phủ một khoảng character phù hợp với một nhóm người dùng nhất định. Ví dụ **ISO 8859-1** là mã **một byte** gồm cả các ký tự có dấu dùng trong ngôn ngữ **Tây Âu**. **Shift-JIS** là mã **độ dài thay đổi** cho character tiếng Nhật. **Rất nhiều encoding loại này vẫn đang được dùng rộng rãi.**

> *"There is no reliable way to automatically detect the character encoding from a stream of bytes. Some API methods let you use the “default charset”—the character encoding preferred by the operating system of the computer. Is that the same encoding that is used by your source of bytes? These bytes may well originate from a different part of the world. Therefore, you should always explicitly specify the encoding. For example, when reading a web page, check the Content-Type header."*

**Dịch:** **Không có cách nào đáng tin để tự động dò character encoding từ một chuỗi byte.** Một số method API cho dùng **"default charset"** — encoding mà hệ điều hành ưa dùng. Nhưng liệu đó có đúng là encoding mà **nguồn byte của bạn** dùng không? Những byte này **rất có thể đến từ một nơi khác trên thế giới**. Vì vậy **luôn luôn phải chỉ định encoding tường minh**. Ví dụ khi đọc một trang web thì **kiểm tra header `Content-Type`**.

> **Note (sách):** *"The platform encoding is returned by the static method Charset.defaultCharset. The static method Charset.availableCharsets returns all available Charset instances, as a map from canonical names to Charset objects."*
>
> **Dịch:** Encoding của platform lấy bằng static method **`Charset.defaultCharset`**. Static method **`Charset.availableCharsets`** trả về **mọi instance `Charset` khả dụng**, dưới dạng **map từ canonical name tới object `Charset`**.

> **Caution (sách):** *"The Oracle implementation of Java has a system property file.encoding for overriding the platform default. This is not an officially supported property, and it is not consistently followed by all parts of Oracle’s implementation of the Java library. You should not set it."*
>
> **Dịch:** Bản Java của Oracle có system property **`file.encoding`** để **ghi đè mặc định của platform**. Đây **không phải property được hỗ trợ chính thức**, và **không phải phần nào của thư viện Java bản Oracle cũng tuân theo nó**. **Bạn không nên set nó.**

### StandardCharsets

> *"The StandardCharsets class has static variables of type Charset for the character encodings that every Java virtual machine must support:"*

```java
StandardCharsets.UTF_8
StandardCharsets.UTF_16
StandardCharsets.UTF_16BE
StandardCharsets.UTF_16LE
StandardCharsets.ISO_8859_1
StandardCharsets.US_ASCII
```

> *"To obtain the Charset for another encoding, use the static forName method:"*

```java
Charset shiftJIS = Charset.forName("Shift-JIS");
```

> *"Use the Charset object when reading or writing text. For example, you can turn an array of bytes into a string as"*

```java
var str = new String(bytes, StandardCharsets.UTF_8);
```

**Dịch:** Class **`StandardCharsets`** có các static variable kiểu `Charset` cho những encoding mà **mọi Java virtual machine đều phải hỗ trợ**. Muốn lấy `Charset` cho encoding khác thì dùng static method **`forName`**. Hãy **dùng object `Charset` khi đọc/ghi text**.

> **Tip (sách):** *"As of Java 10, all methods in the java.io package allow you to specify a character encoding with a Charset object or a string. Choose the StandardCharsets constants, so that any spelling errors are caught at compile time."*
>
> **Dịch:** **Từ Java 10**, mọi method trong package `java.io` cho phép chỉ định character encoding bằng **object `Charset` hoặc string**. Hãy **chọn hằng của `StandardCharsets`** để **mọi lỗi gõ sai bị bắt ngay lúc compile**.

> **Caution (sách):** *"Some methods (such as the String(byte[]) constructor) use the default platform encoding if you don’t specify any; others (such as Files.readAllLines) use UTF-8."*
>
> **Dịch:** Một số method (như constructor `String(byte[])`) dùng **encoding mặc định của platform** nếu bạn không chỉ định; **số khác** (như `Files.readAllLines`) **dùng UTF-8**.

---

## Bài kế tiếp

→ [[02 - Reading and Writing Binary Data]] — interface `DataInput`/`DataOutput`, random-access file, ZIP archive.
