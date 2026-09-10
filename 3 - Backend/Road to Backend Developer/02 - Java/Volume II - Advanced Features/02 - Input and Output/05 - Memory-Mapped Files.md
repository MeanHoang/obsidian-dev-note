# 05 — Memory-Mapped Files

> Chapter 2, Section 2.5 — Core Java Volume II: Advanced Features, 11th Edition (Horstmann), Java 11.
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 2.5. Memory-Mapped Files

> *"Most operating systems can take advantage of a virtual memory implementation to “map” a file, or a region of a file, into memory. Then the file can be accessed as if it were an in-memory array, which is much faster than the traditional file operations."*

**Dịch:** **Hầu hết hệ điều hành** tận dụng được cơ chế **virtual memory** để **"map" một file, hoặc một vùng của file, vào memory**. Khi đó file **được truy cập như thể nó là một array nằm trong bộ nhớ**, **nhanh hơn nhiều** so với thao tác file truyền thống.

---

## 2.5.1. Memory-Mapped File Performance

> *"At the end of this section, you can find a program that computes the CRC32 checksum of a file using traditional file input and a memory-mapped file. On one machine, we got the timing data shown in Table 2.5 when computing the checksum of the 37MB file rt.jar in the jre/lib directory of the JDK."*

**Dịch:** Cuối mục này có chương trình tính **CRC32 checksum** của một file bằng **file input truyền thống** và bằng **memory-mapped file**. Trên **một máy**, sách thu được số liệu thời gian dưới đây khi tính checksum của file **`rt.jar` 37MB** trong directory `jre/lib` của JDK.

### Table 2.5 — Timing Data for File Operations

| Method | Time |
|---|---|
| Plain input stream | **110 seconds** |
| Buffered input stream | **9.9 seconds** |
| Random access file | **162 seconds** |
| Memory-mapped file | **7.2 seconds** |

> *"As you can see, on this particular machine, memory mapping is a bit faster than using buffered sequential input and dramatically faster than using a RandomAccessFile."*

> *"Of course, the exact values will differ greatly from one machine to another, but it is obvious that the performance gain, compared to random access, can be substantial. For sequential reading of files of moderate size, on the other hand, there is no reason to use memory mapping."*

**Dịch:** Trên **chính chiếc máy đó**, memory mapping **nhanh hơn một chút** so với dùng buffered sequential input và **nhanh hơn hẳn** so với dùng `RandomAccessFile`. Dĩ nhiên **giá trị chính xác khác nhau rất nhiều giữa các máy**, nhưng rõ ràng **lợi ích hiệu năng so với random access có thể là đáng kể**. Ngược lại, với việc **đọc tuần tự các file cỡ vừa** thì **không có lý do gì để dùng memory mapping**.

### Channel

> *"The java.nio package makes memory mapping quite simple. Here is what you do."*

> *"First, get a channel for the file. A channel is an abstraction for a disk file that lets you access operating system features such as memory mapping, file locking, and fast data transfers between files."*

```java
FileChannel channel = FileChannel.open(path, options);
```

**Dịch:** Package **`java.nio`** làm memory mapping **khá đơn giản**. Trước hết, **lấy một channel cho file**. **Channel là một abstraction cho file trên đĩa**, cho phép truy cập các tính năng của hệ điều hành như **memory mapping, file locking, và truyền data nhanh giữa các file**.

> *"Then, get a ByteBuffer from the channel by calling the map method of the FileChannel class. Specify the area of the file that you want to map and a mapping mode. Three modes are supported:"*
>
> - *"FileChannel.MapMode.READ_ONLY: The resulting buffer is read-only. Any attempt to write to the buffer results in a ReadOnlyBufferException."*
> - *"FileChannel.MapMode.READ_WRITE: The resulting buffer is writable, and the changes will be written back to the file at some time. Note that other programs that have mapped the same file might not see those changes immediately. The exact behavior of simultaneous file mapping by multiple programs depends on the operating system."*
> - *"FileChannel.MapMode.PRIVATE: The resulting buffer is writable, but any changes are private to this buffer and not propagated to the file."*

**Dịch:** Rồi **lấy một `ByteBuffer` từ channel** bằng cách gọi method **`map`** của `FileChannel`. **Chỉ định vùng file muốn map và một mapping mode**. Có **ba mode**:

| Mode | Ý nghĩa |
|---|---|
| `READ_ONLY` | Buffer thu được **chỉ đọc**. **Mọi nỗ lực ghi vào buffer đều sinh `ReadOnlyBufferException`.** |
| `READ_WRITE` | Buffer thu được **ghi được**, và **các thay đổi sẽ được ghi ngược lại file vào một lúc nào đó**. Lưu ý **các chương trình khác đã map cùng file có thể không thấy thay đổi ngay lập tức**. Hành vi chính xác khi **nhiều chương trình map file cùng lúc là tuỳ hệ điều hành**. |
| `PRIVATE` | Buffer thu được **ghi được**, nhưng **mọi thay đổi là riêng tư với buffer này và không lan tới file**. |

### Đọc/ghi trên buffer

> *"Once you have the buffer, you can read and write data using the methods of the ByteBuffer class and the Buffer superclass."*

> *"Buffers support both sequential and random data access. A buffer has a position that is advanced by get and put operations. For example, you can sequentially traverse all bytes in the buffer as"*

```java
while (buffer.hasRemaining())
{
    byte b = buffer.get();
    . . .
}
```

> *"Alternatively, you can use random access:"*

```java
for (int i = 0; i < buffer.limit(); i++)
{
    byte b = buffer.get(i);
    . . .
}
```

**Dịch:** Khi đã có buffer, **đọc và ghi data bằng method của class `ByteBuffer` và của superclass `Buffer`**. Buffer **hỗ trợ cả truy cập tuần tự lẫn ngẫu nhiên**. Buffer có một **position được đẩy tới bởi các phép `get` và `put`**.

> *"You can also read and write arrays of bytes with the methods"*

```java
get(byte[] bytes)
get(byte[] bytes, int offset, int length)
```

> *"Finally, there are methods"*

```
getInt     getChar
getLong    getFloat
getShort   getDouble
```

> *"to read primitive-type values that are stored as binary values in the file."*

**Dịch:** Cũng **đọc/ghi được array byte**. Và có các method trên để **đọc giá trị kiểu primitive lưu dưới dạng binary trong file**.

### Byte order

> *"As we already mentioned, Java uses big-endian ordering for binary data. However, if you need to process a file containing binary numbers in little-endian order, simply call"*

```java
buffer.order(ByteOrder.LITTLE_ENDIAN);
```

> *"To find out the current byte order of a buffer, call"*

```java
ByteOrder b = buffer.order();
```

**Dịch:** Như đã nói, **Java dùng thứ tự big-endian cho binary data**. Nhưng nếu cần xử lý file chứa **số binary theo thứ tự little-endian** thì chỉ việc gọi `buffer.order(ByteOrder.LITTLE_ENDIAN)`. Muốn biết **byte order hiện tại** của buffer thì gọi `buffer.order()`.

> **Caution (sách):** *"This pair of methods does not use the set/get naming convention."*
>
> **Dịch:** Cặp method này **không theo quy ước đặt tên `set`/`get`**.

> *"To write numbers to a buffer, use one of the methods"*

```
putInt     putChar
putLong    putFloat
putShort   putDouble
```

> *"At some point, and certainly when the channel is closed, these changes are written back to the file."*

**Dịch:** Để **ghi số vào buffer**, dùng các method trên. **Vào một lúc nào đó — và chắc chắn là khi channel được đóng — các thay đổi này được ghi ngược lại file.**

### CRC32

> *"Listing 2.5 computes the 32-bit cyclic redundancy checksum (CRC32) of a file. That checksum is often used to determine whether a file has been corrupted. Corruption of a file makes it very likely that the checksum has changed. The java.util.zip package contains a class CRC32 that computes the checksum of a sequence of bytes, using the following loop:"*

```java
var crc = new CRC32();
while (more bytes)
    crc.update(next byte);
long checksum = crc.getValue();
```

> *"The details of the CRC computation are not important. We just use it as an example of a useful file operation. (In practice, you would read and update data in larger blocks, not a byte at a time. Then the speed differences are not as dramatic.)"*

**Dịch:** Listing 2.5 tính **32-bit cyclic redundancy checksum (CRC32)** của một file. Checksum này thường dùng để **xác định file có bị hỏng không**: file hỏng thì **rất có khả năng checksum đã thay đổi**. Package `java.util.zip` có class **`CRC32`** tính checksum của một chuỗi byte. **Chi tiết phép tính CRC không quan trọng** — sách chỉ dùng nó làm ví dụ về một thao tác file hữu ích. (Trên thực tế bạn sẽ **đọc và cập nhật data theo block lớn hơn, không phải từng byte một**; khi đó **chênh lệch tốc độ không còn ghê gớm như vậy**.)

> *"Run the program as"*

```
java memoryMap.MemoryMapTest filename
```

### Listing 2.5 — `memoryMap/MemoryMapTest.java`

```java
package memoryMap;

import java.io.*;
import java.nio.*;
import java.nio.channels.*;
import java.nio.file.*;
import java.util.zip.*;

/**
 * This program computes the CRC checksum of a file in four ways. <br>
 * Usage: java memoryMap.MemoryMapTest filename
 * @version 1.02 2018-05-01
 * @author Cay Horstmann
 */
public class MemoryMapTest
{
    public static long checksumInputStream(Path filename) throws IOException
    {
        try (InputStream in = Files.newInputStream(filename))
        {
            var crc = new CRC32();

            int c;
            while ((c = in.read()) != -1)
                crc.update(c);
            return crc.getValue();
        }
    }

    public static long checksumBufferedInputStream(Path filename) throws IOException
    {
        try (var in = new BufferedInputStream(Files.newInputStream(filename)))
        {
            var crc = new CRC32();

            int c;
            while ((c = in.read()) != -1)
                crc.update(c);
            return crc.getValue();
        }
    }

    public static long checksumRandomAccessFile(Path filename) throws IOException
    {
        try (var file = new RandomAccessFile(filename.toFile(), "r"))
        {
            long length = file.length();
            var crc = new CRC32();

            for (long p = 0; p < length; p++)
            {
                file.seek(p);
                int c = file.readByte();
                crc.update(c);
            }
            return crc.getValue();
        }
    }

    public static long checksumMappedFile(Path filename) throws IOException
    {
        try (FileChannel channel = FileChannel.open(filename))
        {
            var crc = new CRC32();
            int length = (int) channel.size();
            MappedByteBuffer buffer = channel.map(FileChannel.MapMode.READ_ONLY, 0, length);

            for (int p = 0; p < length; p++)
            {
                int c = buffer.get(p);
                crc.update(c);
            }
            return crc.getValue();
        }
    }

    public static void main(String[] args) throws IOException
    {
        System.out.println("Input Stream:");
        long start = System.currentTimeMillis();
        Path filename = Paths.get(args[0]);
        long crcValue = checksumInputStream(filename);
        long end = System.currentTimeMillis();
        System.out.println(Long.toHexString(crcValue));
        System.out.println((end - start) + " milliseconds");

        System.out.println("Buffered Input Stream:");
        start = System.currentTimeMillis();
        crcValue = checksumBufferedInputStream(filename);
        end = System.currentTimeMillis();
        System.out.println(Long.toHexString(crcValue));
        System.out.println((end - start) + " milliseconds");

        System.out.println("Random Access File:");
        start = System.currentTimeMillis();
        crcValue = checksumRandomAccessFile(filename);
        end = System.currentTimeMillis();
        System.out.println(Long.toHexString(crcValue));
        System.out.println((end - start) + " milliseconds");

        System.out.println("Mapped File:");
        start = System.currentTimeMillis();
        crcValue = checksumMappedFile(filename);
        end = System.currentTimeMillis();
        System.out.println(Long.toHexString(crcValue));
        System.out.println((end - start) + " milliseconds");
    }
}
```

## API — `java.io.FileInputStream` (Java 1.0)

| Method | Mô tả (dịch) |
|---|---|
| `FileChannel getChannel()` *(1.4)* | Trả về một **channel để truy cập input stream này**. |

## API — `java.io.FileOutputStream` (Java 1.0)

| Method | Mô tả (dịch) |
|---|---|
| `FileChannel getChannel()` *(1.4)* | Trả về một **channel để truy cập output stream này**. |

## API — `java.io.RandomAccessFile` (Java 1.0)

| Method | Mô tả (dịch) |
|---|---|
| `FileChannel getChannel()` *(1.4)* | Trả về một **channel để truy cập file này**. |

## API — `java.nio.channels.FileChannel` (Java 1.4)

| Method | Mô tả (dịch) |
|---|---|
| `static FileChannel open(Path path, OpenOption... options)` *(7)* | **Mở một file channel** cho path đã cho. **Mặc định channel được mở để đọc.** Parameter `options` là một trong các giá trị **`WRITE`, `APPEND`, `TRUNCATE_EXISTING`, `CREATE`** của enumeration `StandardOpenOption`. |
| `MappedByteBuffer map(FileChannel.MapMode mode, long position, long size)` | **Map một vùng của file vào memory.** Parameter `mode` là một trong các hằng **`READ_ONLY`, `READ_WRITE`, `PRIVATE`** của class `FileChannel.MapMode`. |

## API — `java.nio.Buffer` (Java 1.4)

| Method | Mô tả (dịch) |
|---|---|
| `boolean hasRemaining()` | Trả về `true` nếu **position hiện tại của buffer chưa chạm tới vị trí limit**. |
| `int limit()` | Trả về **vị trí limit của buffer** — tức **vị trí đầu tiên mà không còn giá trị nào khả dụng**. |

## API — `java.nio.ByteBuffer` (Java 1.4)

| Method | Mô tả (dịch) |
|---|---|
| `byte get()` | Lấy một byte **từ position hiện tại** và **đẩy position tới byte kế tiếp**. |
| `byte get(int index)` | Lấy một byte **tại index chỉ định**. |
| `ByteBuffer put(byte b)` | Đặt một byte **tại position hiện tại** và đẩy position tới byte kế tiếp. **Trả về reference tới buffer này.** |
| `ByteBuffer put(int index, byte b)` | Đặt một byte **tại index chỉ định**. Trả về reference tới buffer này. |
| `ByteBuffer get(byte[] destination)`<br>`ByteBuffer get(byte[] destination, int offset, int length)` | **Điền vào một array byte** (hoặc một vùng của nó) bằng byte lấy từ buffer, và **đẩy position lên bằng số byte đã đọc**. Nếu **buffer không còn đủ byte** thì **không byte nào được đọc** và **`BufferUnderflowException` được ném**. Trả về reference tới buffer này. |
| `ByteBuffer put(byte[] source)`<br>`ByteBuffer put(byte[] source, int offset, int length)` | **Đặt mọi byte từ một array byte** (hoặc từ một vùng của nó) vào buffer, và đẩy position lên bằng số byte đã đọc. Nếu **buffer không còn đủ byte** thì **không byte nào được ghi** và **`BufferOverflowException` được ném**. Trả về reference tới buffer này. |
| `Xxx getXxx()`<br>`Xxx getXxx(int index)`<br>`ByteBuffer putXxx(Xxx value)`<br>`ByteBuffer putXxx(int index, Xxx value)` | **Lấy hoặc đặt một số binary.** `Xxx` là một trong **`Int`, `Long`, `Short`, `Char`, `Float`, `Double`**. |
| `ByteBuffer order(ByteOrder order)`<br>`ByteOrder order()` | **Đặt hoặc lấy byte order.** Giá trị của `order` là một trong các hằng **`BIG_ENDIAN`** hoặc **`LITTLE_ENDIAN`** của class `ByteOrder`. |
| `static ByteBuffer allocate(int capacity)` | Dựng một buffer **với capacity đã cho**. |
| `static ByteBuffer wrap(byte[] values)` | Dựng một buffer **được chống lưng (backed) bởi array đã cho**. |
| `CharBuffer asCharBuffer()` | Dựng một **character buffer được chống lưng bởi buffer này**. **Thay đổi ở character buffer sẽ hiện ra trong buffer này**, nhưng character buffer **có position, limit, và mark riêng**. |

## API — `java.nio.CharBuffer` (Java 1.4)

| Method | Mô tả (dịch) |
|---|---|
| `char get()`<br>`CharBuffer get(char[] destination)`<br>`CharBuffer get(char[] destination, int offset, int length)` | Lấy **một giá trị `char`**, hoặc **một dải giá trị `char`**, bắt đầu từ position của buffer và **đẩy position vượt qua các character đã đọc**. **Hai method sau trả về `this`.** |
| `CharBuffer put(char c)`<br>`CharBuffer put(char[] source)`<br>`CharBuffer put(char[] source, int offset, int length)`<br>`CharBuffer put(String source)`<br>`CharBuffer put(CharBuffer source)` | Đặt **một giá trị `char`**, hoặc **một dải giá trị `char`**, bắt đầu từ position của buffer và **đẩy position vượt qua các character đã ghi**. Khi **đọc từ một `CharBuffer`**, **mọi character còn lại đều được đọc**. **Mọi method đều trả về `this`.** |

---

## 2.5.2. The Buffer Data Structure

> *"When you use memory mapping, you make a single buffer that spans the entire file or the area of the file that you’re interested in. You can also use buffers to read and write more modest chunks of information."*

> *"In this section, we briefly describe the basic operations on Buffer objects. A buffer is an array of values of the same type. The Buffer class is an abstract class with concrete subclasses ByteBuffer, CharBuffer, DoubleBuffer, FloatBuffer, IntBuffer, LongBuffer, and ShortBuffer."*

**Dịch:** Khi dùng memory mapping, bạn **tạo một buffer duy nhất trải khắp toàn bộ file** hoặc vùng file bạn quan tâm. Nhưng cũng **dùng buffer để đọc/ghi những mẩu thông tin khiêm tốn hơn** được. **Buffer là một array các giá trị cùng kiểu.** Class **`Buffer` là abstract class** với các concrete subclass **`ByteBuffer`, `CharBuffer`, `DoubleBuffer`, `FloatBuffer`, `IntBuffer`, `LongBuffer`, `ShortBuffer`** (xem [[09 - Arrays]]).

> **Note (sách):** *"The StringBuffer class is not related to these buffers."*
>
> **Dịch:** Class **`StringBuffer` không liên quan gì** tới các buffer này.

> *"In practice, you will most commonly use ByteBuffer and CharBuffer. As shown in Figure 2.9, a buffer has"*
>
> - *"A capacity that never changes"*
> - *"A position at which the next value is read or written"*
> - *"A limit beyond which reading and writing is meaningless"*
> - *"Optionally, a mark for repeating a read or write operation"*

**Dịch:** Trên thực tế bạn **dùng nhiều nhất là `ByteBuffer` và `CharBuffer`**. Một buffer có:

| Thành phần | Ý nghĩa |
|---|---|
| **capacity** | **không bao giờ thay đổi** |
| **position** | vị trí **giá trị kế tiếp được đọc hoặc ghi** |
| **limit** | **vượt quá nó thì đọc/ghi là vô nghĩa** |
| **mark** *(tuỳ chọn)* | để **lặp lại một phép đọc hoặc ghi** |

> *"These values fulfill the condition"*
>
> `0 ≤ mark ≤ position ≤ limit ≤ capacity`

**Dịch:** Các giá trị này **thoả điều kiện** trên.

### Chu trình "write, then read"

> *"The principal purpose of a buffer is a “write, then read” cycle. At the outset, the buffer’s position is 0 and the limit is the capacity. Keep calling put to add values to the buffer. When you run out of data or reach the capacity, it is time to switch to reading."*

**Dịch:** **Mục đích chính của buffer là chu trình "ghi, rồi đọc"**. **Ban đầu position của buffer là 0 và limit là capacity.** Cứ gọi **`put`** để **thêm giá trị vào buffer**. Khi **hết data hoặc chạm capacity** thì **đến lúc chuyển sang đọc**.

> *"Call flip to set the limit to the current position and the position to 0. Now keep calling get while the remaining method (which returns limit – position) is positive. When you have read all values in the buffer, call clear to prepare the buffer for the next writing cycle. The clear method resets the position to 0 and the limit to the capacity."*

**Dịch:** Gọi **`flip`** để **đặt limit về position hiện tại và position về 0**. Rồi cứ gọi **`get`** chừng nào method **`remaining`** (trả về **`limit – position`**) còn **dương**. Khi đã đọc hết mọi giá trị trong buffer, gọi **`clear`** để **chuẩn bị buffer cho chu trình ghi kế tiếp**: `clear` **đặt lại position về 0 và limit về capacity**.

> *"If you want to reread the buffer, use rewind or mark/reset (see the API notes for details)."*

**Dịch:** Muốn **đọc lại buffer** thì dùng **`rewind`** hoặc **`mark`/`reset`**.

> *"To get a buffer, call a static method such as ByteBuffer.allocate or ByteBuffer.wrap. Then, you can fill a buffer from a channel, or write its contents to a channel. For example,"*

```java
ByteBuffer buffer = ByteBuffer.allocate(RECORD_SIZE);
channel.read(buffer);
channel.position(newpos);
buffer.flip();
channel.write(buffer);
```

> *"This can be a useful alternative to a random-access file."*

**Dịch:** Để lấy một buffer, gọi static method như **`ByteBuffer.allocate`** hoặc **`ByteBuffer.wrap`**. Rồi **đổ đầy buffer từ một channel**, hoặc **ghi nội dung của nó ra một channel**. Đây có thể là **một lựa chọn thay thế hữu ích cho random-access file**.

## API — `java.nio.Buffer` (Java 1.4) — cấu trúc buffer

| Method | Mô tả (dịch) |
|---|---|
| `Buffer clear()` | **Chuẩn bị buffer này để ghi** bằng cách đặt **position về 0** và **limit về capacity**; trả về `this`. |
| `Buffer flip()` | **Chuẩn bị buffer này để đọc sau khi ghi**, bằng cách đặt **limit về position** và **position về 0**; trả về `this`. |
| `Buffer rewind()` | **Chuẩn bị buffer này để đọc lại cùng các giá trị** bằng cách đặt **position về 0** và **giữ nguyên limit**; trả về `this`. |
| `Buffer mark()` | **Đặt mark của buffer này bằng position**; trả về `this`. |
| `Buffer reset()` | **Đặt position của buffer này về mark**, nhờ vậy **phần đã đánh dấu được đọc hoặc ghi lại**; trả về `this`. |
| `int remaining()` | Trả về **số giá trị còn đọc/ghi được** — tức **hiệu giữa limit và position**. |
| `int position()`<br>`void position(int newValue)` | **Lấy và đặt position** của buffer này. |
| `int capacity()` | Trả về **capacity** của buffer này. |

---

## Bài kế tiếp

→ [[06 - File Locking]] — khoá file hoặc một dải byte trong file, những điểm phụ thuộc hệ thống cần đề phòng.
