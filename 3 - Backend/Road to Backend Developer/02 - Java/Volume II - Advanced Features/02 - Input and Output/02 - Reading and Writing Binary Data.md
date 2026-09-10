# 02 — Reading and Writing Binary Data

> Chapter 2, Section 2.2 — Core Java Volume II: Advanced Features, 11th Edition (Horstmann), Java 11.
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 2.2. Reading and Writing Binary Data

> *"Text format is convenient for testing and debugging because it is humanly readable, but it is not as efficient as transmitting data in binary format. In the following sections, you will learn how to perform input and output with binary data."*

**Dịch:** Định dạng text **tiện cho test và debug** vì con người đọc được, nhưng **không hiệu quả bằng truyền data ở định dạng binary**. Các phần sau chỉ cách làm input/output với **binary data**.

---

## 2.2.1. The DataInput and DataOutput interfaces

> *"The DataOutput interface defines the following methods for writing a number, a character, a boolean value, or a string in binary format:"*

```
writeChars   writeFloat
writeByte    writeDouble
writeInt     writeChar
writeShort   writeBoolean
writeLong    writeUTF
```

**Dịch:** Interface **`DataOutput`** định nghĩa các method trên để ghi **number, character, giá trị `boolean`, hoặc string ở dạng binary**.

> *"For example, writeInt always writes an integer as a 4-byte binary quantity regardless of the number of digits, and writeDouble always writes a double as an 8-byte binary quantity. The resulting output is not human-readable, but it will use the same space for each value of a given type and reading it back in will be faster than parsing text."*

**Dịch:** Ví dụ `writeInt` **luôn** ghi một số nguyên thành **đại lượng binary 4 byte**, bất kể có bao nhiêu chữ số; `writeDouble` **luôn** ghi một `double` thành **8 byte**. Output không đọc được bằng mắt người, nhưng **mỗi giá trị cùng kiểu chiếm cùng một lượng chỗ**, và **đọc lại nhanh hơn parse text**.

> **Note (sách):** *"There are two different methods of storing integers and floating-point numbers in memory, depending on the processor you are using. Suppose, for example, you are working with a 4-byte int, such as the decimal number 1234, or 4D2 in hexadecimal (1234 = 4 × 256 + 13 × 16 + 2). This value can be stored in such a way that the first of the four bytes in memory holds the most significant byte (MSB) of the value: 00 00 04 D2. This is the so-called big-endian method. Or, we can start with the least significant byte (LSB) first: D2 04 00 00. This is called, naturally enough, the little-endian method. For example, the SPARC uses big-endian; the Pentium, little-endian. This can lead to problems. When a file is saved from C or C++ file, the data are saved exactly as the processor stores them. That makes it challenging to move even the simplest data files from one platform to another. In Java, all values are written in the big-endian fashion, regardless of the processor. That makes Java data files platform-independent."*
>
> **Dịch:** Có **hai cách lưu số nguyên và số dấu phẩy động trong bộ nhớ**, tuỳ processor. Ví dụ `int` 4 byte mang số thập phân `1234` (hex `4D2`). Giá trị này có thể lưu sao cho **byte đầu tiên trong bốn byte giữ byte có trọng số cao nhất (MSB)**: `00 00 04 D2` — gọi là **big-endian**. Hoặc bắt đầu bằng **byte có trọng số thấp nhất (LSB)**: `D2 04 00 00` — gọi là **little-endian**. Ví dụ **SPARC dùng big-endian; Pentium dùng little-endian**. Điều này **gây rắc rối**: khi một file được lưu từ C hoặc C++, data được lưu **đúng như processor lưu chúng**, khiến việc **mang file data đơn giản nhất từ platform này sang platform khác cũng khó**. Trong **Java, mọi giá trị đều được ghi theo kiểu big-endian bất kể processor**, khiến **file data của Java độc lập với platform**.

### writeUTF và "modified UTF-8"

> *"The writeUTF method writes string data using a modified version of the 8-bit Unicode Transformation Format. Instead of simply using the standard UTF-8 encoding, sequences of Unicode code units are first represented in UTF-16, and then the result is encoded using the UTF-8 rules. This modified encoding is different for characters with codes higher than 0xFFFF. It is used for backward compatibility with virtual machines that were built when Unicode had not yet grown beyond 16 bits."*

**Dịch:** Method `writeUTF` ghi data string bằng **một biến thể được sửa đổi của Unicode Transformation Format 8-bit**. Thay vì dùng thẳng **UTF-8 chuẩn**, chuỗi Unicode code unit **được biểu diễn ở UTF-16 trước**, rồi **kết quả đó mới được mã hoá theo luật UTF-8**. Encoding sửa đổi này **khác biệt ở những character có mã lớn hơn `0xFFFF`**. Nó tồn tại để **tương thích ngược** với các virtual machine được xây khi Unicode **chưa vượt quá 16 bit**.

> *"Since nobody else uses this modification of UTF-8, you should only use the writeUTF method to write strings intended for a Java virtual machine—for example, in a program that generates bytecodes. Use the writeChars method for other purposes."*

**Dịch:** Vì **không ai khác dùng bản sửa đổi này của UTF-8**, chỉ nên dùng `writeUTF` để ghi string **dành cho Java virtual machine** — ví dụ trong chương trình sinh bytecode. **Các mục đích khác thì dùng `writeChars`.**

> *"To read the data back in, use the following methods defined in the DataInput interface:"*

```
readInt     readDouble
readShort   readChar
readLong    readBoolean
readFloat   readUTF
```

> *"The DataInputStream class implements the DataInput interface. To read binary data from a file, combine a DataInputStream with a source of bytes such as a FileInputStream:"*

```java
var in = new DataInputStream(new FileInputStream("employee.dat"));
```

> *"Similarly, to write binary data, use the DataOutputStream class that implements the DataOutput interface:"*

```java
var out = new DataOutputStream(new FileOutputStream("employee.dat"));
```

**Dịch:** Class **`DataInputStream` implement interface `DataInput`**. Để đọc binary data từ file, **ghép `DataInputStream` với một nguồn byte** như `FileInputStream`. Tương tự, để ghi binary data thì dùng **`DataOutputStream`** vốn implement `DataOutput`.

## API — `java.io.DataInput` (Java 1.0)

| Method | Mô tả (dịch) |
|---|---|
| `boolean readBoolean()`<br>`byte readByte()`<br>`char readChar()`<br>`double readDouble()`<br>`float readFloat()`<br>`int readInt()`<br>`long readLong()`<br>`short readShort()` | Đọc vào một giá trị thuộc kiểu tương ứng. |
| `void readFully(byte[] b)` | Đọc byte vào array `b`, **block cho tới khi đọc hết mọi byte**. |
| `void readFully(byte[] b, int off, int len)` | Đặt **tối đa `len` byte** vào array `b`, bắt đầu từ `off`, **block cho tới khi đọc hết mọi byte**. |
| `String readUTF()` | Đọc một chuỗi character ở định dạng **"modified UTF-8"**. |
| `int skipBytes(int n)` | Bỏ qua `n` byte, **block cho tới khi bỏ qua hết**. |

## API — `java.io.DataOutput` (Java 1.0)

| Method | Mô tả (dịch) |
|---|---|
| `void writeBoolean(boolean b)`<br>`void writeByte(int b)`<br>`void writeChar(int c)`<br>`void writeDouble(double d)`<br>`void writeFloat(float f)`<br>`void writeInt(int i)`<br>`void writeLong(long l)`<br>`void writeShort(int s)` | Ghi một giá trị thuộc kiểu tương ứng. |
| `void writeChars(String s)` | Ghi **mọi character trong string**. |
| `void writeUTF(String s)` | Ghi một chuỗi character ở định dạng **"modified UTF-8"**. |

---

## 2.2.2. Random-Access Files

> *"The RandomAccessFile class lets you read or write data anywhere in a file. Disk files are random-access, but input/output streams that communicate with a network socket are not. You can open a random-access file either for reading only or for both reading and writing; specify the option by using the string "r" (for read access) or "rw" (for read/write access) as the second argument in the constructor."*

```java
var in = new RandomAccessFile("employee.dat", "r");
var inOut = new RandomAccessFile("employee.dat", "rw");
```

**Dịch:** Class **`RandomAccessFile`** cho phép **đọc hoặc ghi data ở bất kỳ đâu trong file**. **File trên đĩa là random-access**, còn input/output stream giao tiếp với **network socket thì không**. Mở random-access file **chỉ để đọc** hoặc **vừa đọc vừa ghi**; chỉ định bằng string **`"r"`** (read access) hoặc **`"rw"`** (read/write access) làm **argument thứ hai** của constructor.

> *"When you open an existing file as a RandomAccessFile, it does not get deleted."*

**Dịch:** Khi mở một file **đang tồn tại** dưới dạng `RandomAccessFile`, **nó không bị xoá**.

### File pointer

> *"A random-access file has a file pointer that indicates the position of the next byte to be read or written. The seek method can be used to set the file pointer to an arbitrary byte position within the file. The argument to seek is a long integer between zero and the length of the file in bytes."*

> *"The getFilePointer method returns the current position of the file pointer."*

**Dịch:** Random-access file có một **file pointer** chỉ **vị trí byte kế tiếp sẽ được đọc hoặc ghi**. Method **`seek`** đặt file pointer tới **vị trí byte tuỳ ý** trong file. Argument của `seek` là số nguyên **`long` từ 0 tới độ dài file tính bằng byte**. Method **`getFilePointer`** trả về **vị trí hiện tại của file pointer**.

> *"The RandomAccessFile class implements both the DataInput and DataOutput interfaces. To read and write from a random-access file, use methods such as readInt/writeInt and readChar/writeChar that we discussed in the preceding section."*

**Dịch:** `RandomAccessFile` **implement cả hai interface `DataInput` và `DataOutput`**. Đọc/ghi từ random-access file bằng chính các method như `readInt`/`writeInt`, `readChar`/`writeChar` đã nói ở phần trước.

### Record cùng kích thước

> *"Let’s walk through an example program that stores employee records in a random-access file. Each record will have the same size. This makes it easy to read an arbitrary record. Suppose you want to position the file pointer to the third record. Simply set the file pointer to the appropriate byte position and start reading."*

```java
long n = 3;
in.seek((n - 1) * RECORD_SIZE);
var e = new Employee();
e.readData(in);
```

> *"If you want to modify the record and save it back into the same location, remember to set the file pointer back to the beginning of the record:"*

```java
in.seek((n - 1) * RECORD_SIZE);
e.writeData(out);
```

**Dịch:** Chương trình ví dụ lưu record `Employee` vào random-access file. **Mỗi record cùng một kích thước** — nhờ vậy **dễ đọc một record bất kỳ**. Muốn đặt file pointer tới record thứ ba thì cứ **đặt file pointer tới vị trí byte tương ứng rồi đọc**. Nếu muốn **sửa record và lưu lại đúng chỗ cũ**, nhớ **đặt file pointer về đầu record**.

> *"To determine the total number of bytes in a file, use the length method. The total number of records is the length divided by the size of each record."*

```java
long nbytes = in.length(); // length in bytes
int nrecords = (int) (nbytes / RECORD_SIZE);
```

**Dịch:** Xác định **tổng số byte trong file** bằng method **`length`**. **Tổng số record = độ dài chia cho kích thước mỗi record.**

### Chuỗi có kích thước cố định

> *"Integers and floating-point values have a fixed size in binary format, but we have to work harder for strings. We provide two helper methods to write and read strings of a fixed size."*

> *"The writeFixedString writes the specified number of code units, starting at the beginning of the string. If there are too few code units, the method pads the string, using zero values."*

```java
public static void writeFixedString(String s, int size, DataOutput out)
    throws IOException
{
    for (int i = 0; i < size; i++)
    {
        char ch = 0;
        if (i < s.length()) ch = s.charAt(i);
        out.writeChar(ch);
    }
}
```

**Dịch:** Số nguyên và số dấu phẩy động **có kích thước cố định ở dạng binary**, nhưng với **string thì phải làm nhiều việc hơn**. Sách đưa ra **hai helper method** ghi/đọc string **kích thước cố định**. `writeFixedString` ghi **đúng số code unit đã chỉ định**, bắt đầu từ **đầu string**. Nếu **thiếu code unit**, method **đệm (pad) string bằng giá trị 0**.

> *"The readFixedString method reads characters from the input stream until it has consumed size code units or until it encounters a character with a zero value. Then, it skips past the remaining zero values in the input field. For added efficiency, this method uses the StringBuilder class to read in a string."*

```java
public static String readFixedString(int size, DataInput in)
    throws IOException
{
    var b = new StringBuilder(size);
    int i = 0;
    var done = false;
    while (!done && i < size)
    {
        char ch = in.readChar();
        i++;
        if (ch == 0) done = true;
        else b.append(ch);
    }
    in.skipBytes(2 * (size - i));
    return b.toString();
}
```

**Dịch:** `readFixedString` đọc character từ input stream **cho tới khi ăn đủ `size` code unit** hoặc **cho tới khi gặp một character có giá trị 0**. Sau đó nó **nhảy qua các giá trị 0 còn lại** trong trường input. Để **hiệu quả hơn**, method này dùng class **`StringBuilder`** để đọc string.

> *"We placed the writeFixedString and readFixedString methods inside the DataIO helper class."*

**Dịch:** Hai method `writeFixedString` và `readFixedString` được đặt trong **helper class `DataIO`**.

> *"To write a fixed-size record, we simply write all fields in binary."*

```java
DataIO.writeFixedString(e.getName(), Employee.NAME_SIZE, out);
out.writeDouble(e.getSalary());
LocalDate hireDay = e.getHireDay();
out.writeInt(hireDay.getYear());
out.writeInt(hireDay.getMonthValue());
out.writeInt(hireDay.getDayOfMonth());
```

> *"Reading the data back is just as simple."*

```java
String name = DataIO.readFixedString(Employee.NAME_SIZE, in);
double salary = in.readDouble();
int y = in.readInt();
int m = in.readInt();
int d = in.readInt();
```

**Dịch:** Để ghi một record **kích thước cố định**, ta chỉ việc **ghi mọi field ở dạng binary**. **Đọc lại cũng đơn giản y vậy.**

### Tính kích thước record

> *"Let us compute the size of each record. We will use 40 characters for the name strings. Therefore, each record will contain 100 bytes:"*
>
> - *"40 characters = 80 bytes for the name"*
> - *"1 double = 8 bytes for the salary"*
> - *"3 int = 12 bytes for the date"*

**Dịch:** Tính kích thước mỗi record: dùng **40 character cho string tên**. Vậy **mỗi record chứa 100 byte**:

| Thành phần | Tính | Byte |
|---|---|---|
| name | 40 character | **80** |
| salary | 1 `double` | **8** |
| date | 3 `int` | **12** |
| **Tổng** | | **100** |

> *"The program shown in Listing 2.2 writes three records into a data file and then reads them from the file in reverse order. To do this efficiently requires random access—we need to get to the last record first."*

**Dịch:** Chương trình ở Listing 2.2 ghi **ba record** vào file data rồi **đọc chúng theo thứ tự ngược**. Làm việc này **một cách hiệu quả thì cần random access** — ta phải **tới được record cuối trước**.

### Listing 2.2 — `randomAccess/RandomAccessTest.java`

```java
package randomAccess;

import java.io.*;
import java.time.*;

/**
 * @version 1.14 2018-05-01
 * @author Cay Horstmann
 */
public class RandomAccessTest
{
    public static void main(String[] args) throws IOException
    {
        var staff = new Employee[3];

        staff[0] = new Employee("Carl Cracker", 75000, 1987, 12, 15);
        staff[1] = new Employee("Harry Hacker", 50000, 1989, 10, 1);
        staff[2] = new Employee("Tony Tester", 40000, 1990, 3, 15);

        try (var out = new DataOutputStream(new FileOutputStream("employee.dat")))
        {
            // save all employee records to the file employee.dat
            for (Employee e : staff)
                writeData(out, e);
        }

        try (var in = new RandomAccessFile("employee.dat", "r"))
        {
            // retrieve all records into a new array

            // compute the array size
            int n = (int)(in.length() / Employee.RECORD_SIZE);
            var newStaff = new Employee[n];

            // read employees in reverse order
            for (int i = n - 1; i >= 0; i--)
            {
                newStaff[i] = new Employee();
                in.seek(i * Employee.RECORD_SIZE);
                newStaff[i] = readData(in);
            }

            // print the newly read employee records
            for (Employee e : newStaff)
                System.out.println(e);
        }
    }

    /**
     * Writes employee data to a data output
     * @param out the data output
     * @param e the employee
     */
    public static void writeData(DataOutput out, Employee e) throws IOException
    {
        DataIO.writeFixedString(e.getName(), Employee.NAME_SIZE, out);
        out.writeDouble(e.getSalary());

        LocalDate hireDay = e.getHireDay();
        out.writeInt(hireDay.getYear());
        out.writeInt(hireDay.getMonthValue());
        out.writeInt(hireDay.getDayOfMonth());
    }

    /**
     * Reads employee data from a data input
     * @param in the data input
     * @return the employee
     */
    public static Employee readData(DataInput in) throws IOException
    {
        String name = DataIO.readFixedString(Employee.NAME_SIZE, in);
        double salary = in.readDouble();
        int y = in.readInt();
        int m = in.readInt();
        int d = in.readInt();
        return new Employee(name, salary, y, m - 1, d);
    }
}
```

## API — `java.io.RandomAccessFile` (Java 1.0)

| Method | Mô tả (dịch) |
|---|---|
| `RandomAccessFile(String file, String mode)`<br>`RandomAccessFile(File file, String mode)` | Mở file đã cho để **random access**. String `mode` là **`"r"`** cho chế độ chỉ đọc, **`"rw"`** cho chế độ đọc/ghi, **`"rws"`** cho chế độ đọc/ghi có **ghi đĩa đồng bộ cả data lẫn metadata ở mỗi lần cập nhật**, và **`"rwd"`** cho chế độ đọc/ghi có **ghi đĩa đồng bộ chỉ data**. |
| `long getFilePointer()` | Trả về **vị trí hiện tại của file pointer**. |
| `void seek(long pos)` | Đặt file pointer tới vị trí **cách đầu file `pos` byte**. |
| `long length()` | Trả về **độ dài file tính bằng byte**. |

---

## 2.2.3. ZIP Archives

> *"ZIP archives store one or more files in a (usually) compressed format. Each ZIP archive has a header with information such as the name of each file and the compression method that was used. In Java, you can use a ZipInputStream to read a ZIP archive. You need to look at the individual entries in the archive. The getNextEntry method returns an object of type ZipEntry that describes the entry. Read from the stream until the end, which is actually the end of the current entry. Then call closeEntry to read the next entry. Do not close zin until you read the last entry. Here is a typical code sequence to read through a ZIP file:"*

```java
var zin = new ZipInputStream(new FileInputStream(zipname));
ZipEntry entry;
while ((entry = zin.getNextEntry()) != null)
{
    read the contents of zin
    zin.closeEntry();
}
zin.close();
```

**Dịch:** **ZIP archive** lưu một hoặc nhiều file ở định dạng **(thường là) nén**. Mỗi ZIP archive có một **header** chứa thông tin như **tên từng file** và **phương pháp nén** đã dùng. Trong Java, dùng **`ZipInputStream`** để đọc ZIP archive; phải **nhìn vào từng entry** trong archive. Method **`getNextEntry`** trả về object kiểu **`ZipEntry`** mô tả entry đó. **Đọc từ stream cho tới hết**, mà thực chất là **hết entry hiện tại**. Rồi gọi **`closeEntry`** để đọc entry kế tiếp. **Đừng đóng `zin` cho tới khi đọc xong entry cuối cùng.**

> *"To write a ZIP file, use a ZipOutputStream. For each entry that you want to place into the ZIP file, create a ZipEntry object. Pass the file name to the ZipEntry constructor; it sets the other parameters such as file date and decompression method. You can override these settings if you like. Then, call the putNextEntry method of the ZipOutputStream to begin writing a new file. Send the file data to the ZIP output stream. When done, call closeEntry. Repeat for all the files you want to store. Here is a code skeleton:"*

```java
var fout = new FileOutputStream("test.zip");
var zout = new ZipOutputStream(fout);

for all files
{
    var ze = new ZipEntry(filename);
    zout.putNextEntry(ze);
    send data to zout
    zout.closeEntry();
}
zout.close();
```

**Dịch:** Để **ghi file ZIP**, dùng **`ZipOutputStream`**. Với mỗi entry muốn đưa vào file ZIP, tạo một object **`ZipEntry`**: truyền **tên file** vào constructor của `ZipEntry`; nó **tự đặt các parameter khác** như **ngày file** và **phương pháp giải nén**. Muốn thì **override được các thiết lập này**. Rồi gọi **`putNextEntry`** của `ZipOutputStream` để **bắt đầu ghi một file mới**. Gửi data của file vào ZIP output stream. Xong thì gọi **`closeEntry`**. **Lặp lại cho mọi file** muốn lưu.

> **Note (sách):** *"JAR files (which were discussed in Volume I, Chapter 4) are simply ZIP files with a special entry—the so-called manifest. Use the JarInputStream and JarOutputStream classes to read and write the manifest entry."*
>
> **Dịch:** **File JAR** (xem [[09 - JAR Files]]) chỉ đơn giản là **file ZIP có thêm một entry đặc biệt** — cái gọi là **manifest**. Dùng class **`JarInputStream`** và **`JarOutputStream`** để đọc/ghi entry manifest.

> *"ZIP input streams are a good example of the power of the stream abstraction. When you read data stored in compressed form, you don’t need to worry that the data are being decompressed as they are being requested. Moreover, the source of the bytes in a ZIP stream need not be a file—the ZIP data can come from a network connection."*

**Dịch:** ZIP input stream là **ví dụ hay về sức mạnh của abstraction stream**. Khi đọc data lưu dưới dạng nén, bạn **không phải bận tâm rằng data đang được giải nén ngay lúc được yêu cầu**. Hơn nữa, **nguồn byte trong một ZIP stream không nhất thiết phải là file** — data ZIP có thể **đến từ một network connection**.

> **Note (sách):** *"Section 2.4.8, “ZIP File Systems,” on p. 123 shows how to access a ZIP archive without a special API, using the FileSystem class of Java 7."*
>
> **Dịch:** Mục **2.4.8 "ZIP File Systems"** chỉ cách truy cập ZIP archive **không cần API riêng**, dùng class **`FileSystem` của Java 7**. Xem [[04 - Working with Files]].

## API — `java.util.zip.ZipInputStream` (Java 1.1)

| Method | Mô tả (dịch) |
|---|---|
| `ZipInputStream(InputStream in)` | Tạo `ZipInputStream` cho phép **giải nén (inflate) data** từ `InputStream` đã cho. |
| `ZipEntry getNextEntry()` | Trả về object `ZipEntry` cho **entry kế tiếp**, hoặc **`null`** nếu **không còn entry nào**. |
| `void closeEntry()` | **Đóng entry đang mở** trong file ZIP. Sau đó đọc entry kế tiếp bằng `getNextEntry()`. |

## API — `java.util.zip.ZipOutputStream` (Java 1.1)

| Method | Mô tả (dịch) |
|---|---|
| `ZipOutputStream(OutputStream out)` | Tạo `ZipOutputStream` dùng để **ghi data đã nén** vào `OutputStream` chỉ định. |
| `void putNextEntry(ZipEntry ze)` | Ghi thông tin trong `ZipEntry` đã cho vào output stream và **đặt stream vào đúng vị trí cho data**. Sau đó ghi data bằng method `write()`. |
| `void closeEntry()` | **Đóng entry đang mở** trong file ZIP. Dùng `putNextEntry` để bắt đầu entry kế tiếp. |
| `void setLevel(int level)` | Đặt **mức nén mặc định** cho các entry `DEFLATED` sau đó, giá trị từ **`Deflater.NO_COMPRESSION`** tới **`Deflater.BEST_COMPRESSION`**. Mặc định là **`Deflater.DEFAULT_COMPRESSION`**. Ném **`IllegalArgumentException`** nếu level không hợp lệ. |
| `void setMethod(int method)` | Đặt **phương pháp nén mặc định** cho `ZipOutputStream` này, áp dụng cho mọi entry **không tự chỉ định method**; có thể là **`DEFLATED`** hoặc **`STORED`**. |

## API — `java.util.zip.ZipEntry` (Java 1.1)

| Method | Mô tả (dịch) |
|---|---|
| `ZipEntry(String name)` | Dựng một ZIP entry với tên đã cho. |
| `long getCrc()` | Trả về **giá trị checksum CRC32** của `ZipEntry` này. |
| `String getName()` | Trả về **tên** của entry này. |
| `long getSize()` | Trả về **kích thước chưa nén** của entry này, hoặc **`-1`** nếu **không biết** kích thước chưa nén. |
| `boolean isDirectory()` | Trả về `true` nếu entry này là **một directory**. |
| `void setMethod(int method)` | Đặt phương pháp nén cho entry thành **`DEFLATED`** hoặc **`STORED`**. |
| `void setSize(long size)` | Đặt kích thước của entry này. **Chỉ bắt buộc nếu phương pháp nén là `STORED`.** |
| `void setCrc(long crc)` | Đặt **checksum CRC32** của entry này. Dùng class **`CRC32`** để tính checksum. **Chỉ bắt buộc nếu phương pháp nén là `STORED`.** |

## API — `java.util.zip.ZipFile` (Java 1.1)

| Method | Mô tả (dịch) |
|---|---|
| `ZipFile(String name)`<br>`ZipFile(File file)` | Tạo một `ZipFile` để **đọc** từ string hoặc object `File` đã cho. |
| `Enumeration entries()` | Trả về object `Enumeration` **liệt kê các object `ZipEntry`** mô tả các entry của `ZipFile`. |
| `ZipEntry getEntry(String name)` | Trả về entry **ứng với tên đã cho**, hoặc **`null`** nếu không có entry như vậy. |
| `InputStream getInputStream(ZipEntry ze)` | Trả về một `InputStream` cho entry đã cho. |
| `String getName()` | Trả về **path của file ZIP** này. |

---

## Bài kế tiếp

→ [[03 - Object Input Output Streams and Serialization]] — ghi/đọc object bằng serialization, định dạng file, versioning.
