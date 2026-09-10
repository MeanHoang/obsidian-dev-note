# 06 — Text Input and Output

> Chapter 7, Section 7.6 — Core Java Volume II: Advanced Features, 11th Edition (Horstmann), Java 11.
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 7.6. Text Input and Output

> *"As you know, the Java programming language itself is fully Unicode-based. However, Windows and Mac OS X still support legacy character encodings such as Windows-1252 or Mac Roman in Western European countries, or Big5 in Taiwan. Therefore, communicating with your users through text is not as simple as it should be. The following sections discuss the complications that you may encounter."*

**Dịch:** Như bạn biết, bản thân ngôn ngữ Java **hoàn toàn dựa trên Unicode**. Tuy nhiên Windows và Mac OS X **vẫn hỗ trợ các character encoding cũ** như Windows-1252 hay Mac Roman ở Tây Âu, hay Big5 ở Đài Loan. Do đó **giao tiếp với người dùng qua text không đơn giản như lẽ ra phải thế**.

Xem [[06 - Input and Output]] (Volume I) và [[02 - Data Types]] (Volume I) về Unicode.

---

## 7.6.1. Text Files

> *"Nowadays, it is best to use UTF-8 for saving and loading text files. But you may need to work with legacy files. If you know the expected character encoding, you can specify it when writing or reading text files:"*

```java
var out = new PrintWriter(filename, "Windows-1252");
```

> *"For a guess of the best encoding to use, get the "platform encoding" by calling"*

```java
Charset platformEncoding = Charset.defaultCharset();
```

**Dịch:** Ngày nay **tốt nhất là dùng UTF-8** để lưu và nạp file text. Nhưng bạn có thể phải làm việc với **file cũ**. Nếu biết character encoding mong đợi, **chỉ định nó được** khi ghi hoặc đọc file text. Để **đoán encoding tốt nhất**, lấy **"platform encoding"** bằng `Charset.defaultCharset()`.

---

## 7.6.2. Line Endings

> *"This isn't an issue of locales but of platforms. On Windows, text files are expected to use \r\n at the end of each line, where UNIX-based systems only require a \n character. Nowadays, most Windows programs can deal with just a \n. The notable exception is Notepad. If it is important to you that users can double-click on a text file that your application produces and view it in Notepad, make sure that the text file has proper line endings."*

**Dịch:** Đây **không phải vấn đề của locale mà của platform**. Trên Windows, file text được kỳ vọng dùng `\r\n` ở cuối mỗi dòng, còn hệ thống dựa trên UNIX **chỉ cần ký tự `\n`**. Ngày nay đa số chương trình Windows xử lý được chỉ mỗi `\n`. **Ngoại lệ đáng chú ý là Notepad.**

> *"Any line written with the println method will be properly terminated. The only problem is if you print strings that contain \n characters. They are not automatically modified to the platform line ending."*

**Dịch:** **Mọi dòng ghi bằng method `println` đều được kết thúc đúng cách.** Vấn đề duy nhất là khi bạn in ra string **chứa ký tự `\n`** — chúng **không tự động được sửa** thành line ending của platform.

> *"Instead of using \n in strings, you can use printf and the %n format specifier to produce platform-dependent line endings. For example,"*

```java
out.printf("Hello%nWorld%n");
```

> *"produces `Hello\r\nWorld\r\n` on Windows and `Hello\nWorld\n` everywhere else."*

**Dịch:** Thay vì dùng `\n` trong string, dùng `printf` với format specifier **`%n`** để sinh ra line ending **phụ thuộc platform**.

---

## 7.6.3. The Console

> *"If you write programs that communicate with the user through System.in/System.out or System.console(), you have to face the possibility that the console may use a character encoding that is different from the platform encoding reported by Charset.defaultCharset(). This is particularly noticeable when working with the cmd shell on Windows. In the US version of Windows 10, the command shell still uses the archaic IBM437 encoding that originated with IBM personal computers in 1982. There is no official API for revealing that information. The Charset.defaultCharset() method will return the Windows-1252 character set, which is quite different. For example, the euro symbol € is present in Windows-1252 but not in IBM437. When you call"*

```java
System.out.println("100 €");
```

> *"the console will display `100 ?`"*

**Dịch:** Nếu viết chương trình giao tiếp với người dùng qua `System.in`/`System.out` hay `System.console()`, bạn phải đối mặt với khả năng **console dùng character encoding khác với platform encoding** mà `Charset.defaultCharset()` báo cáo. Điều này **đặc biệt dễ thấy với cmd shell trên Windows**. Bản Windows 10 Mỹ, command shell **vẫn dùng encoding IBM437 cổ lỗ** có từ máy tính cá nhân IBM năm 1982. **Không có API chính thức** để tiết lộ thông tin đó. Ví dụ **ký hiệu euro `€` có trong Windows-1252 nhưng không có trong IBM437**.

> *"You can advise your users to switch the character encoding of the console. In Windows, that is achieved with the chcp command. For example,"*

```
chcp 1252
```

> *"changes the console to the Windows-1252 code page. Ideally, of course, your users should switch the console to UTF-8. In Windows, the command is"*

```
chcp 65001
```

> *"Unfortunately, that is not enough to make Java use UTF-8 in the console. It is also necessary to set the platform encoding with the unofficial file.encoding system property:"*

```
java -Dfile.encoding=UTF-8 MyProg
```

**Dịch:** Bạn khuyên người dùng **đổi character encoding của console** được. Trên Windows dùng lệnh **`chcp`**. Lý tưởng thì người dùng nên chuyển console sang **UTF-8** (`chcp 65001`). Đáng tiếc **như thế vẫn chưa đủ** để Java dùng UTF-8 trong console — **còn cần set platform encoding** bằng system property **không chính thức** `file.encoding`.

---

## 7.6.4. Log Files

> *"When log messages from the java.util.logging library are sent to the console, they are written in the console encoding. You saw how to control that in the preceding section. However, log messages in a file use a FileHandler which, by default, uses the platform encoding."*

**Dịch:** Khi log message từ library `java.util.logging` được gửi ra console, chúng được ghi **theo console encoding**. Tuy nhiên log message **trong file** dùng **`FileHandler`**, mà mặc định dùng **platform encoding**.

> *"To change the encoding to UTF-8, you need to change the log manager settings. In the logging configuration file, set"*

```
java.util.logging.FileHandler.encoding=UTF-8
```

**Dịch:** Để đổi encoding sang UTF-8, phải **đổi thiết lập của log manager** trong logging configuration file.

---

## 7.6.5. The UTF-8 Byte Order Mark

> *"As already mentioned, it is a good idea to use UTF-8 for text files when you can. However, if your application has to read UTF-8 text files created by other programs, you run into another potential problem. It is perfectly legal to add a "byte order mark" character U+FEFF as the first character of a file."*

**Dịch:** Nên dùng UTF-8 cho file text khi có thể. Tuy nhiên nếu ứng dụng của bạn phải **đọc file text UTF-8 do chương trình khác tạo ra**, bạn gặp một vấn đề tiềm tàng khác: **hoàn toàn hợp lệ** khi thêm ký tự **"byte order mark" `U+FEFF`** làm **ký tự đầu tiên của file**.

> *"In the UTF-16 encoding, where each code unit is a two-byte quantity, the byte order mark tells a reader whether the file uses "big-endian" or "little-endian" byte ordering. UTF-8 is a single-byte encoding, so there is no need to specify a byte ordering. But if a file starts with bytes 0xEF 0xBB 0xBF (the UTF-8 encoding of U+FEFF), that is a strong indication that it uses UTF-8. For that reason, the Unicode standard encourages this practice. Any reader is supposed to discard an initial byte order mark."*

**Dịch:** Trong UTF-16 encoding, nơi mỗi code unit là **đại lượng hai byte**, byte order mark cho reader biết file dùng thứ tự byte **"big-endian" hay "little-endian"**. **UTF-8 là single-byte encoding**, nên không cần chỉ định thứ tự byte. Nhưng nếu một file bắt đầu bằng các byte **`0xEF 0xBB 0xBF`** (UTF-8 encoding của `U+FEFF`) thì đó là **dấu hiệu mạnh** rằng nó dùng UTF-8. Vì vậy chuẩn Unicode **khuyến khích thực hành này**. **Mọi reader lẽ ra phải loại bỏ byte order mark đứng đầu.**

> *"There is just one fly in the ointment. The Oracle Java implementation stubbornly refuses to follow the Unicode standard, citing potential compatibility issues. That means that you, the programmer, must do what the platform won't do. When you read a text file and encounter a U+FEFF at the beginning, ignore it."*

**Dịch:** Chỉ có **một hạt sạn**: implementation Java của Oracle **ngoan cố từ chối theo chuẩn Unicode**, viện dẫn các vấn đề tương thích tiềm tàng. Nghĩa là **bạn — lập trình viên — phải làm cái mà platform không làm**: khi đọc file text và gặp `U+FEFF` ở đầu, **hãy bỏ qua nó**.

> **Caution (sách):** *"Unfortunately, the JDK implementors do not follow this advice. When you pass the javac compiler a valid UTF-8 source file that starts with a byte order mark, compilation fails with an error message "illegal character: \65279"."*
>
> **Dịch:** Đáng tiếc là **chính người implement JDK cũng không theo lời khuyên này**. Khi bạn đưa cho compiler `javac` một source file UTF-8 hợp lệ **bắt đầu bằng byte order mark**, việc biên dịch **thất bại** với thông báo lỗi `illegal character: \65279`.

---

## 7.6.6. Character Encoding of Source Files

> *"You, the programmer, will need to communicate with the Java compiler—and you do that with tools on your local system. For example, you can use the Chinese version of Notepad to write your Java source code files. The resulting source code files are not portable because they use the local character encoding (GB or Big5, depending on which Chinese operating system you use). Only the compiled class files are portable—they will automatically use the "modified UTF-8" encoding for identifiers and strings. That means that when a program is compiling and running, three character encodings are involved:"*

**Dịch:** Bạn — lập trình viên — cần giao tiếp với Java compiler, và làm điều đó bằng công cụ trên hệ thống local. Ví dụ dùng bản Notepad tiếng Trung để viết file source code Java. File source code sinh ra **không portable** vì dùng **character encoding bản địa** (GB hay Big5, tùy hệ điều hành Trung Quốc nào bạn dùng). **Chỉ file class đã biên dịch mới portable** — chúng tự động dùng encoding **"modified UTF-8"** cho identifier và string. Nghĩa là khi một chương trình biên dịch và chạy, **có ba character encoding tham gia**:

| Thành phần | Encoding |
|---|---|
| Source files | **platform encoding** |
| Class files | **modified UTF-8** |
| Virtual machine | **UTF-16** |

> *"(See Chapter 1 for a definition of the modified UTF-8 and UTF-16 formats.)"*

**Dịch:** Xem Chapter 1 cho định nghĩa các định dạng modified UTF-8 và UTF-16.

> **Tip (sách):** *"You can specify the character encoding of your source files with the -encoding flag, for example:"*
>
> ```
> javac -encoding UTF-8 Myfile.java
> ```
>
> **Dịch:** Chỉ định được character encoding của source file bằng **flag `-encoding`**.

---

## Bài kế tiếp

→ [[07 - Resource Bundles]] — tách chuỗi ra file resource, quy ước đặt tên bundle, property file và bundle class.
