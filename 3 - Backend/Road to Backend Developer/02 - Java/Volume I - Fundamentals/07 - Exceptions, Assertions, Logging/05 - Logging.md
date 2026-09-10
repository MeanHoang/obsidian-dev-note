# 05 — Logging

> Chapter 7, Section 7.5 — Core Java Volume I, 13th Edition (Horstmann).
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 7.5. Logging

> *"Every Java programmer is familiar with the process of inserting System.out.println calls into troublesome code to gain insight into program behavior. Of course, once you have figured out the cause of trouble, you remove the print statements—only to put them back in when the next problem surfaces. Logging frameworks are designed to overcome this problem."*

**Dịch:** Lập trình viên Java nào cũng quen với việc **nhét các lời gọi `System.out.println` vào đoạn code rắc rối** để **hiểu hành vi chương trình**. Dĩ nhiên, khi đã tìm ra nguyên nhân, bạn **xoá các câu lệnh print đi** — rồi **nhét lại khi vấn đề tiếp theo nổi lên**. **Logging framework sinh ra để khắc phục chuyện này.**

---

## 7.5.1. Should You Use the Java Logging Framework?

> *"Java has a standard logging framework, usually called after its package name java.util.logging and sometimes abbreviated as j.u.l. However, other logging frameworks have more features and are in common use, such as Log4j (https://logging.apache.org/log4j/2.x) and Logback (https://logback.qos.ch)."*

**Dịch:** Java có **một logging framework chuẩn**, thường được gọi theo tên package của nó là **`java.util.logging`**, đôi khi viết tắt là **j.u.l**. Tuy nhiên **các logging framework khác có nhiều tính năng hơn và đang được dùng phổ biến**, như **Log4j** (https://logging.apache.org/log4j/2.x) và **Logback** (https://logback.qos.ch).

### Façade: frontend và backend

> *"If you want to give users of your code the choice of logging framework, then you should use a "façade" library that sends log messages to the preferred framework. A commonly used façade with a pleasant API is SLF4J (https://www.slf4j.org). Another façade is the "platform logging API" (also known as JEP 264). It is very basic but a part of the JDK. The façade is sometimes called the frontend. It provides the API that programmers use to log messages. The backend is in charge of filtering and formatting the messages, and putting them somewhere. The backend needs to be configurable by deployers, usually by editing configuration files."*

**Dịch:** Nếu bạn muốn **cho người dùng code của mình được chọn logging framework**, hãy dùng một **thư viện "façade"** để **gửi log message tới framework mà họ ưa thích**. Một façade phổ biến với **API dễ chịu** là **SLF4J** (https://www.slf4j.org). Một façade khác là **"platform logging API"** (còn gọi là **JEP 264**) — **rất cơ bản nhưng là một phần của JDK**.

Façade **đôi khi được gọi là frontend**: nó **cung cấp API mà lập trình viên dùng để log message**. Còn **backend chịu trách nhiệm lọc (filter), định dạng (format) message, và đặt chúng vào đâu đó**. Backend **cần cấu hình được bởi người triển khai (deployer)**, thường là bằng cách **sửa file cấu hình**.

> *"In the following sections, I will show you how to use the platform logging API as frontend and java.util.logging as a backend. This can be a reasonable choice if you find the frontend API sufficient, since you can always swap out the backend."*

**Dịch:** Các mục sau sẽ chỉ cách dùng **platform logging API làm frontend** và **`java.util.logging` làm backend**. Đây là **lựa chọn hợp lý nếu bạn thấy API frontend là đủ dùng**, vì bạn **luôn có thể thay backend khác**.

> *"The java.util.logging backend has fewer features than its more popular alternatives, but it suffices for many use cases. Because of its simplicity, it is less susceptible to attacks. In contrast, obscure features of Log4j allowed hackers to craft program inputs that, when logged, caused malicious code execution."*
>
> *"Whether or not you end up using them, studying the platform logging API and java.util.logging backend gives you a good foundation of the capabilities of logging frameworks."*

**Dịch:** Backend `java.util.logging` **ít tính năng hơn các lựa chọn phổ biến hơn nó**, nhưng **đủ dùng cho nhiều trường hợp**. Nhờ **sự đơn giản**, nó **ít bị tấn công hơn**. Ngược lại, **các tính năng ít ai biết của Log4j đã cho phép hacker chế ra input mà khi được log sẽ khiến code độc hại được thực thi**.

Dù cuối cùng bạn có dùng chúng hay không, **học platform logging API và backend `java.util.logging` cho bạn một nền tảng tốt về khả năng của các logging framework**.

> **Note (sách):** *"The API and backend that the following sections describe is for application logging. You can also turn on logging for the virtual machine, for example to log garbage collection. Use the -Xlog command-line option when starting the VM. For example,"*
>
> ```
> java -Xlog:gc=trace:file=gc.log:uptime,tid MyApp
> ```
>
> *"See https://docs.oracle.com/en/java/javase/21/docs/specs/man/java.html#enablelogging-with-the-jvm-unified-logging-framework for details."*
>
> **Dịch:** API và backend mô tả ở các mục sau là dành cho **application logging**. Bạn cũng **bật được logging cho virtual machine**, ví dụ để **log garbage collection**. Dùng option dòng lệnh **`-Xlog`** khi khởi động VM.

---

## 7.5.2. Logging 101

> *"Platform loggers implement the System.Logger interface. Each logger has a name. The name can be arbitrary, but it is often the package name of the class whose methods generate logging messages. You get a platform logger like this:"*

```java
System.Logger logger = System.getLogger("com.mycompany.myapp");
```

**Dịch:** **Platform logger implement interface `System.Logger`.** **Mỗi logger có một cái tên.** Tên **có thể tuỳ ý**, nhưng **thường là tên package của class có method sinh ra log message**. (Về package, xem [[08 - Packages]].)

> *"When you request a logger with a given name for the first time, it is created. Subsequent calls to the same name yield the same logger object."*

**Dịch:** **Lần đầu bạn yêu cầu một logger với một tên nào đó, nó được tạo ra.** Những lần gọi sau với cùng tên **cho ra đúng object logger đó**.

> *"Now you are ready to log:"*

```java
logger.log(System.Logger.Level.INFO, "Opening file " + filename);
```

> *"The record is printed like this:"*

```
Aug 04, 2022 09:53:34 AM com.mycompany.myapp.Main read
INFO: Opening file data.txt
```

> *"Note that the time and the names of the calling class and method are automatically included."*

**Dịch:** Giờ bạn đã sẵn sàng log. Record được in ra như trên. Lưu ý rằng **thời điểm cùng tên class và tên method đang gọi được tự động đưa vào**.

### Tắt bớt message bằng cấu hình backend

> *"To turn off these informational messages when your program is deployed, you can configure the backend. In the case of the java.util.logging backend, prepare a file logging.properties with the following contents:"*

```
handlers=java.util.logging.ConsoleHandler
com.mycompany.myapp.level=WARNING
```

> *"Then start the application like this:"*

```
java -Djava.util.logging.config.file=logging.properties com.mycompany.myapp.Main
```

> *"Since the INFO level is below the WARNING level, the message no longer shows up."*

**Dịch:** Để **tắt các message mang tính thông tin này khi chương trình được triển khai**, bạn **cấu hình backend**. Với backend `java.util.logging`, hãy **chuẩn bị file `logging.properties`** với nội dung trên rồi **khởi động ứng dụng** như trên. Vì **level `INFO` thấp hơn level `WARNING`**, **message không còn hiện ra nữa**.

> *"The API for getting the logger and logging a message is part of the frontend—in this case, the platform logging API. If you use a different frontend, the API will be different."*
>
> *"The message destination, formatting, and filtering, as well as the mechanisms for the configuration are part of the backend—here, java.util.logging. If you use a different backend, follow its instructions for configuration."*

**Dịch:** **API để lấy logger và log message thuộc về frontend** — ở đây là platform logging API. Dùng frontend khác thì **API sẽ khác**.

**Đích đến của message, việc định dạng và lọc, cùng các cơ chế cấu hình đều thuộc về backend** — ở đây là `java.util.logging`. Dùng backend khác thì **làm theo hướng dẫn cấu hình của nó**.

---

## 7.5.3. The Platform Logging API

> *"As you saw in the preceding section, each logged message has a level. The enumeration System.Logger.Level has the following values, in decreasing severity: ERROR, WARNING, INFO, DEBUG, and TRACE."*

**Dịch:** Như đã thấy ở mục trước, **mỗi message được log đều có một level**. Enumeration **`System.Logger.Level`** có các giá trị sau, **theo thứ tự mức nghiêm trọng giảm dần**: **`ERROR`, `WARNING`, `INFO`, `DEBUG`, `TRACE`**.

> **Tip (sách):** *"With the import statement"*
>
> ```java
> import static java.lang.System.Logger.Level.*;
> ```
>
> *"you can shorten the levels:"*
>
> ```java
> logger.log(INFO, "Opening file " + filename);
> // Instead of System.Logger.Level.INFO
> ```
>
> **Dịch:** Với câu lệnh static import trên, bạn **viết tắt được tên các level**. (Về static import, xem [[08 - Packages#4.8.3. Static Imports]].)

### Trì hoãn việc dựng message bằng lambda

> *"In the above example, the message "Opening file " + filename is created even if the message is suppressed. If you are concerned with the cost of creating the message string, you can use a lambda expression instead:"*

```java
logger.log(INFO, () -> "Opening file " + filename);
```

> *"Then the message is only computed when it is actually logged."*

**Dịch:** Trong ví dụ trên, message `"Opening file " + filename` **vẫn được tạo ra kể cả khi message bị chặn (suppressed)**. Nếu bạn **bận tâm về chi phí tạo message string**, hãy **dùng lambda expression** thay thế. Khi đó **message chỉ được tính khi nó thực sự được log**.

### Log một exception

> *"It is common to log an exception. The log includes the stack trace."*

```java
catch (IOException ex)
{
    logger.log(WARNING, "Cannot open file " + filename, ex);
}
```

**Dịch:** **Log một exception là chuyện thường gặp.** Bản log **có kèm stack trace**.

### Định dạng message bằng pattern

> *"You can format the message using a pattern:"*

```java
logger.log(WARNING, "Cannot open file {0}", filename);
```

**Dịch:** Bạn **định dạng message bằng một pattern** được.

> **Caution (sách):** *"This is not a printf style pattern. The pattern is processed by the MessageFormat class that is used for localization of program messages (see Volume II for details). Here, you just need to know that string placeholders are {0}, {1}, and so on. Braces must be escaped with single quotes: '{', '}'. Use two single quotes '' to include a literal single quote in the message."*
>
> **Dịch:** Đây **không phải pattern kiểu `printf`**. Pattern được xử lý bởi class **`MessageFormat`**, thứ dùng để **localize message của chương trình** (chi tiết ở Volume II). Ở đây bạn chỉ cần biết: **placeholder cho string là `{0}`, `{1}`, v.v.** **Dấu ngoặc nhọn phải được escape bằng dấu nháy đơn**: `'{'`, `'}'`. Dùng **hai dấu nháy đơn `''`** để **đưa một dấu nháy đơn nguyên văn vào message**.

### Localization bằng resource bundle

> *"Log messages can be localized to different languages, using the resource bundle mechanism that is introduced in Volume II."*
>
> *"Supply the bundle and the key for the formatting string:"*

```java
logger.log(WARNING, bundle, "file.bad", filename);
// Looks up file.bad in the bundle
```

> *"Alternatively, get the logger as"*

```java
System.Logger logger = System.getLogger("com.mycompany.myapp", bundle);
```

> *"When calling one of the logger methods with a String parameter for the message or format, the argument is interpreted as a key in the bundle. The methods with Object or Supplier<String> parameters are unaffected."*

**Dịch:** Log message **localize được sang các ngôn ngữ khác nhau**, dùng **cơ chế resource bundle** giới thiệu ở Volume II. Hãy **đưa vào bundle và key của format string**. Hoặc **lấy logger kèm bundle** như trên.

Khi gọi một method của logger **với parameter `String` cho message hoặc format**, argument đó **được hiểu là một key trong bundle**. Các method có **parameter `Object` hoặc `Supplier<String>` thì không bị ảnh hưởng**.

> *"Some, but not all combinations of these features (deferred message computation, adding a throwable, formatting, using a bundle) are supported. See the API notes for details."*

**Dịch:** **Một số — chứ không phải tất cả — tổ hợp của các tính năng này** (trì hoãn tính message, thêm một throwable, định dạng, dùng bundle) **được hỗ trợ**. Xem phần API để biết chi tiết.

---

## 7.5.4. Logging Configuration

> *"Let us now turn to the logging backend. As already mentioned, the default backend of the platform logging API is java.util.logging. The information in the following sections is specific to that backend."*
>
> *"You can change various properties of the backend by editing a configuration file. The default configuration file is located at conf/logging.properties in the JDK. To use another file, set the java.util.logging.config.file property to the file location by starting your application with"*

```
java -Djava.util.logging.config.file=configFile MainClass
```

**Dịch:** Giờ chuyển sang **logging backend**. Như đã nói, **backend mặc định của platform logging API là `java.util.logging`**. Thông tin ở các mục sau là **riêng cho backend đó**.

Bạn **đổi được nhiều property của backend bằng cách sửa một file cấu hình**. **File cấu hình mặc định nằm ở `conf/logging.properties` trong JDK.** Để dùng file khác, hãy **đặt property `java.util.logging.config.file`** trỏ tới vị trí file khi khởi động ứng dụng.

> **Caution (sách):** *"Calling System.setProperty("java.util.logging.config.file", configFile) in main has no effect because the log manager is initialized during VM startup, before main executes."*
>
> **Dịch:** Gọi `System.setProperty("java.util.logging.config.file", configFile)` trong `main` **không có tác dụng gì**, vì **log manager được khởi tạo trong lúc VM khởi động, tức trước khi `main` chạy**.

### Đặt level cho logger

> *"You can specify the logging levels for your own loggers by adding lines such as"*

```
com.mycompany.myapp.level=WARNING
```

> *"That is, append the .level suffix to the logger name."*

**Dịch:** Bạn **chỉ định được logging level cho logger của mình** bằng cách thêm những dòng như trên — tức **gắn hậu tố `.level` vào sau tên logger**.

> **Note (sách):** *"Properties in the logging configuration are not system properties. You cannot set them with the -D command-line option. Instead, place the logging properties into a file that you specify with -Djava.util.logging.config.file=configFile."*
>
> **Dịch:** **Property trong cấu hình logging không phải system property.** Bạn **không set chúng bằng option dòng lệnh `-D` được**. Thay vào đó, **đặt các logging property vào một file** rồi chỉ định file đó bằng `-Djava.util.logging.config.file=configFile`.

> *"You can also specify the root level:"*

```
.level=WARNING
```

**Dịch:** Bạn cũng **chỉ định được root level**.

> **Caution (sách):** *"For historical reasons, some of the levels have different names in the platform logging API and the java.util.logging framework. You need to use the latter in the configuration file. Table 7.1 shows the correspondences."*
>
> **Dịch:** **Vì lý do lịch sử, một số level có tên khác nhau giữa platform logging API và framework `java.util.logging`.** Trong **file cấu hình bạn phải dùng tên của cái sau**.

### Table 7.1 — Level tương ứng giữa Platform Logging và Java Logging Framework

| Platform Logging | `java.util.logging` |
|---|---|
| `ERROR` | `SEVERE` |
| `WARNING` | `WARNING` |
| `INFO` | `INFO` |
| `DEBUG` | `FINE` |
| `TRACE` | `FINER` |

### Logger name có tính phân cấp

> *"Similar to package names, logger names are hierarchical. In fact, they are more hierarchical than packages. There is no semantic relationship between a package and its parent, but logger parents and children share certain properties. For example, if you turn off messages to the logger "com.mycompany", then its child loggers are also deactivated."*

**Dịch:** **Giống tên package, tên logger có tính phân cấp.** Thực ra chúng **còn phân cấp hơn cả package**: **giữa một package và package cha của nó không có quan hệ ngữ nghĩa nào**, nhưng **logger cha và con chia sẻ một số property**. Ví dụ, nếu bạn **tắt message của logger `"com.mycompany"`** thì **các logger con của nó cũng bị vô hiệu hoá**.

> *"As you will see in the next section, loggers don't actually send the messages to the console—that is the job of the handlers. Handlers also have levels. To see DEBUG/FINE messages on the console, you also need to set"*

```
java.util.logging.ConsoleHandler.level=FINE
```

**Dịch:** Như mục sau sẽ thấy, **logger không thực sự gửi message ra console — đó là việc của handler**. **Handler cũng có level.** Muốn **thấy message `DEBUG`/`FINE` trên console**, bạn **còn phải set thêm** dòng trên.

> **Caution (sách):** *"The settings in the log manager configuration are not system properties. Starting a program with -Dcom.mycompany.myapp.level=FINE does not have any effect on the logger."*
>
> **Dịch:** **Các thiết lập trong cấu hình log manager không phải system property.** Khởi động chương trình với `-Dcom.mycompany.myapp.level=FINE` **không có tác dụng gì lên logger**.

> *"It is also possible to change logging levels in a running program by using the jconsole program."*

**Dịch:** Cũng **đổi được logging level trong một chương trình đang chạy** bằng công cụ **`jconsole`**.

> **Note (sách):** *"As of Java 21, the system logger with name java.lang.Runtime logs calls to the Runtime.exit method (which System.exit calls to terminate the virtual machine). The log contains the stack trace, so you can tell how termination was requested. To receive the log message, set"*
>
> ```
> java.lang.Runtime.level=FINE
> ```
>
> *"in the log configuration."*
>
> **Dịch:** **Từ Java 21**, system logger tên **`java.lang.Runtime`** sẽ **log các lời gọi tới method `Runtime.exit`** (thứ mà `System.exit` gọi để kết thúc virtual machine). Bản log **chứa stack trace**, nên bạn **biết được việc kết thúc đã được yêu cầu từ đâu**. Để nhận message này, hãy set `java.lang.Runtime.level=FINE` trong cấu hình log.

---

## 7.5.5. Log Handlers

> *"The backend of the java.util.logging API is based on handlers. The simplest handler is the ConsoleHandler that prints log records to the System.err stream."*

**Dịch:** Backend của API `java.util.logging` **dựa trên handler**. **Handler đơn giản nhất là `ConsoleHandler`**, in log record ra **stream `System.err`**.

> *"Each handler has a parent. By default, the handler simply sends each record to the parent handler. The standard logging configuration uses a ConsoleHandler by default. Its default logging level is INFO."*

**Dịch:** **Mỗi handler có một parent.** Mặc định, handler **chỉ đơn giản gửi từng record lên handler cha**. Cấu hình logging chuẩn **mặc định dùng một `ConsoleHandler`**, với **logging level mặc định là `INFO`**.

> *"To send log records elsewhere, add another handler. The java.util.logging API provides two handlers for this purpose: a FileHandler and a SocketHandler. The SocketHandler sends records to a specified host and port. Of greater interest is the FileHandler that collects records in a file."*

**Dịch:** Muốn **gửi log record đi chỗ khác**, hãy **thêm một handler khác**. API `java.util.logging` cung cấp **hai handler cho mục đích này: `FileHandler` và `SocketHandler`**. **`SocketHandler` gửi record tới một host và port chỉ định.** Đáng chú ý hơn là **`FileHandler`, thu thập record vào một file**.

> *"To add a file handler, provide this entry in the logging properties:"*

```
handlers=java.util.logging.ConsoleHandler,java.util.logging.FileHandler
```

> *"The records are sent to a file javan.log in the user's home directory, where n is a number to make the file unique. By default, the records are formatted in XML. A typical log record has the form"*

```xml
<record>
  <date>2014-08-04T09:53:34</date>
  <millis>1407146014072</millis>
  <sequence>1</sequence>
  <logger>com.mycompany.myapp</logger>
  <level>INFO</level>
  <class>com.horstmann.corejava.Employee</class>
  <method>read</method>
  <thread>10</thread>
  <message>Opening file staff.txt</message>
</record>
```

**Dịch:** Để thêm một file handler, hãy đưa entry trên vào logging properties. Record **được gửi tới file `javan.log` trong home directory của user**, trong đó **`n` là một con số để làm file trở nên duy nhất**. **Mặc định record được định dạng XML.**

> *"You can modify the default behavior of the file handler by setting various parameters in the logging properties (see Table 7.2)."*
>
> *"You probably don't want to use the default log file name. Use a pattern such as %h/myapp%u.log (see Table 7.3 for an explanation of the pattern variables.) The %u in the file name pattern yields a unique copy of the log for each application run."*

**Dịch:** Bạn **sửa được hành vi mặc định của file handler** bằng cách set các parameter trong logging properties. Bạn hẳn **không muốn dùng tên file log mặc định** — hãy **dùng một pattern như `%h/myapp%u.log`**. **`%u` trong pattern tên file cho ra một bản log riêng biệt cho mỗi lần chạy ứng dụng.**

> *"For long-running programs, it is a good idea to turn file rotation on. Log files are kept in a rotation sequence, such as myapp.log.0, myapp.log.1, myapp.log.2, and so on. Whenever a file exceeds the size limit, the oldest log is deleted, the other files are renamed, and a new file with generation number 0 is created."*

**Dịch:** Với **chương trình chạy lâu dài**, nên **bật file rotation**. File log được giữ trong một **chuỗi luân phiên (rotation sequence)** như `myapp.log.0`, `myapp.log.1`, `myapp.log.2`... Mỗi khi **một file vượt giới hạn kích thước**, **bản log cũ nhất bị xoá**, **các file khác được đổi tên**, và **một file mới với generation number 0 được tạo ra**.

### Table 7.2 — Parameter cấu hình của File Handler

| Configuration Property | Mô tả (dịch từ sách) | Mặc định |
|---|---|---|
| `java.util.logging.FileHandler.level` | Level của handler. | `Level.ALL` |
| `java.util.logging.FileHandler.append` | Khi `true`, log record được **nối thêm vào file có sẵn**; ngược lại **mở file mới cho mỗi lần chạy chương trình**. | `false` |
| `java.util.logging.FileHandler.limit` | **Số byte tối đa xấp xỉ** ghi vào một file trước khi mở file khác (**0 = không giới hạn**). | `0` trong class `FileHandler`, `50000` trong cấu hình log manager mặc định |
| `java.util.logging.FileHandler.pattern` | Pattern tên file (xem Table 7.3). | `%h/java%u.log` |
| `java.util.logging.FileHandler.count` | **Số bản log trong một rotation sequence.** | `1` (không rotation) |
| `java.util.logging.FileHandler.filter` | Filter để **lọc log record** (xem mục 7.5.6). | Không lọc |
| `java.util.logging.FileHandler.encoding` | **Character encoding.** | Character encoding của platform |
| `java.util.logging.FileHandler.formatter` | **Formatter cho từng log record.** | `java.util.logging.XMLFormatter` |

### Table 7.3 — Biến trong pattern tên file log

| Variable | Mô tả (dịch từ sách) |
|---|---|
| `%h` | **Home directory của user** (property `user.home`). |
| `%t` | **Thư mục tạm của hệ thống.** |
| `%u` | **Một con số duy nhất.** |
| `%g` | **Generation number cho các bản log luân phiên.** Hậu tố `.%g` được dùng nếu **có chỉ định rotation mà pattern lại không chứa `%g`**. |
| `%%` | **Ký tự phần trăm.** |

> **Caution (sách):** *"When java.util.logging.FileHandler.append is true, and the log format is XML, then a new XML header is emitted when appending to an existing log file. The result is not valid XML."*
>
> **Dịch:** Khi `java.util.logging.FileHandler.append` là `true` **và định dạng log là XML**, thì **một XML header mới sẽ được phát ra khi nối vào file log có sẵn**. **Kết quả không phải XML hợp lệ.**

---

## 7.5.6. Filters and Formatters

> *"Besides filtering by logging levels, each handler can have an additional filter that implements the Filter interface, a functional interface with a method"*

```java
boolean isLoggable(LogRecord record)
```

> *"To install a filter into a handler, add an entry such as the following into the logging configuration:"*

```
java.util.logging.ConsoleHandler.filter=com.mycompany.myapp.MyFilter
```

**Dịch:** Ngoài **lọc theo logging level**, mỗi handler còn **có thể có thêm một filter** implement interface **`Filter`** — một **functional interface** với method `boolean isLoggable(LogRecord record)`. Để **cài một filter vào handler**, thêm entry như trên vào cấu hình logging.

> *"The ConsoleHandler and FileHandler classes emit the log records in text and XML formats. However, you can define your own formats as well. Extend the java.util.logging.Formatter class and override the method"*

```java
String format(LogRecord record)
```

> *"Format the record in any way you like and return the resulting string. In your format method, you can get information about the LogRecord by calling one of the methods in the API notes."*

**Dịch:** Class `ConsoleHandler` và `FileHandler` **phát ra log record ở định dạng text và XML**. Tuy nhiên bạn **định nghĩa được định dạng riêng**: **extend class `java.util.logging.Formatter` và override method `format`**. Hãy **định dạng record theo ý bạn rồi trả về string kết quả**. Trong method `format`, bạn **lấy được thông tin về `LogRecord`** bằng cách gọi một trong các method ở phần API.

> *"In your format method, you may want to call the method"*

```java
String formatMessage(LogRecord record)
```

> *"That method formats the message part of the record, looking up the message key in a resource bundle and substituting message format parameters."*

**Dịch:** Trong method `format` của bạn, có thể bạn sẽ **muốn gọi method `formatMessage`**. Method đó **định dạng phần message của record**, **tra key của message trong một resource bundle** và **thay thế các parameter của message format**.

> *"Many file formats (such as XML) require head and tail parts that surround the formatted records. To achieve this, override the methods"*

```java
String getHead(Handler h)
String getTail(Handler h)
```

> *"Finally, set the formatter in the logging configuration:"*

```
java.util.logging.FileHandler.formatter=com.mycompany.myapp.MyFormatter
```

**Dịch:** Nhiều định dạng file (như XML) **cần phần head và tail bao quanh các record đã định dạng**. Muốn vậy hãy **override hai method `getHead` và `getTail`**. Cuối cùng, **set formatter trong cấu hình logging**.

---

## 7.5.7. A Logging Recipe

> *"With so many options for logging, it is easy to lose track of the fundamentals. The following recipe summarizes the most common operations."*

**Dịch:** Với **quá nhiều lựa chọn cho logging**, ta **dễ mất dấu những điều căn bản**. Công thức sau **tóm tắt các thao tác thường gặp nhất**.

### 1. Chọn một logger duy nhất

> *"For a simple application, choose a single logger. It is a good idea to give the logger the same name as your main application package, such as com.mycompany.myprog. You can always get the logger by calling"*

```java
System.Logger logger = System.getLogger("com.mycompany.myprog");
```

> *"For convenience, you may want to add static fields"*

```java
private static final System.Logger logger
    = System.getLogger("com.mycompany.myprog");
```

> *"to classes with a lot of logging activity."*

**Dịch:** Với **ứng dụng đơn giản, hãy chọn một logger duy nhất**. Nên **đặt tên logger trùng với tên package chính của ứng dụng**, ví dụ `com.mycompany.myprog`. Cho tiện, bạn có thể **thêm static field** như trên vào **các class có nhiều hoạt động logging**. (Về static field, xem [[04 - Static Fields and Methods]].)

### 2. Cấu hình backend

> *"The default logging configuration of the java.util.logging backend logs all messages of level INFO or higher to the console. To customize, prepare a file logging.properties with entries such as the following:"*

```
handlers=java.util.logging.ConsoleHandler,java.util.logging.FileHandler
com.mycompany.myapp.level=FINER
java.util.logging.ConsoleHandler.level=FINE
```

> *"Then start your app with"*

```
java -Djava.util.logging.config.file=logging.properties com.mycompany.myapp.Main
```

**Dịch:** Cấu hình logging mặc định của backend `java.util.logging` **log mọi message từ level `INFO` trở lên ra console**. Muốn tuỳ chỉnh, **chuẩn bị file `logging.properties`** với các entry như trên rồi khởi động ứng dụng như vậy.

### 3. Log thoải mái

> *"Now you are ready to log to your heart's content. Whenever you are tempted to call System.out.println, emit a log message instead:"*

```java
logger.log(System.Logger.Level.TRACE, "File open dialog canceled");
```

> *"It is also a good idea to log unexpected exceptions. For example:"*

```java
try
{
    . . .
}
catch (SomeException e)
{
    logger.log(System.Logger.Level.WARNING, string describing context, e);
}
```

**Dịch:** Giờ bạn **thoải mái log tuỳ thích**. **Mỗi khi bị cám dỗ gọi `System.out.println`, hãy phát ra một log message thay vì thế.** Cũng **nên log các exception ngoài dự kiến**.

> *"Listing 7.2 puts this recipe to use with an added twist: Logging messages are also displayed in a log window, thanks to a handler whose code is in Listing 7.3."*
>
> *"Run the program as"*

```
java -Djava.util.logging.config.file=logging.properties logging.LoggingImageViewer
```

**Dịch:** Listing 7.2 **áp dụng công thức này kèm một điểm nhấn**: **log message còn được hiển thị trong một cửa sổ log**, nhờ một **handler có code ở Listing 7.3**.

### Listing 7.2 — `logging/LoggingImageViewer.java`

```java
package logging;

import java.awt.*;
import java.awt.event.*;
import java.io.*;
import javax.swing.*;
import static java.lang.System.Logger.Level.*;

/**
 * A modification of the image viewer program that logs various events. Run as
 * java -Djava.util.logging.config.file=logging.properties logging.LoggingImageViewer
 * @version 1.1 2023-09-26
 * @author Cay Horstmann
 */
public class LoggingImageViewer
{
    public static void main(String[] args)
    {
        EventQueue.invokeLater(() ->
        {
            var frame = new ImageViewerFrame();
            frame.setTitle("LoggingImageViewer");
            frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
            System.Logger logger = System.getLogger("com.horstmann.corejava");
            logger.log(INFO, "Showing frame");
            frame.setVisible(true);
        });
    }
}

/**
 * The frame that shows the image.
 */
class ImageViewerFrame extends JFrame
{
    private static final int DEFAULT_WIDTH = 300;
    private static final int DEFAULT_HEIGHT = 400;

    private JLabel label;
    private static System.Logger logger = System.getLogger("com.horstmann.corejava");

    public ImageViewerFrame()
    {
        logger.log(TRACE, "Entering ImageViewerFrame()");
        setSize(DEFAULT_WIDTH, DEFAULT_HEIGHT);

        // set up menu bar
        var menuBar = new JMenuBar();
        setJMenuBar(menuBar);

        var menu = new JMenu("File");
        menuBar.add(menu);

        var openItem = new JMenuItem("Open");
        menu.add(openItem);
        openItem.addActionListener(new FileOpenListener());

        var exitItem = new JMenuItem("Exit");
        menu.add(exitItem);
        exitItem.addActionListener(new ActionListener()
            {
                public void actionPerformed(ActionEvent event)
                {
                    logger.log(INFO, "Exiting.");
                    System.exit(0);
                }
            });

        // use a label to display the images
        label = new JLabel();
        add(label);
        logger.log(TRACE, "Exiting ImageViewerFrame()");
    }

    private class FileOpenListener implements ActionListener
    {
        public void actionPerformed(ActionEvent event)
        {
            logger.log(TRACE, "Entering ImageViewerFrame.FileOpenListener.actionPerformed(%s)",
                event);

            // set up file chooser
            var chooser = new JFileChooser();
            chooser.setCurrentDirectory(new File("."));

            // accept all files ending with .gif
            chooser.setFileFilter(new javax.swing.filechooser.FileFilter()
                {
                    public boolean accept(File f)
                    {
                        return f.getName().toLowerCase().endsWith(".gif") || f.isDirectory();
                    }

                    public String getDescription()
                    {
                        return "GIF Images";
                    }
                });

            // show file chooser dialog
            int r = chooser.showOpenDialog(ImageViewerFrame.this);

            // if image file accepted, set it as icon of the label
            if (r == JFileChooser.APPROVE_OPTION)
            {
                String name = chooser.getSelectedFile().getPath();
                logger.log(DEBUG, "Reading file %s", name);
                label.setIcon(new ImageIcon(name));
            }
            else logger.log(DEBUG, "File open dialog canceled.");
            logger.log(TRACE, "Exiting ImageViewerFrame.FileOpenListener.actionPerformed");
        }
    }
}
```

### Listing 7.3 — `logging/WindowHandler.java`

```java
package logging;

import java.awt.*;
import java.awt.event.*;
import java.io.*;
import java.util.logging.*;
import javax.swing.*;

/**
 * A handler for displaying log records in a window.
 */
public class WindowHandler extends StreamHandler
{
    private JFrame frame;

    public WindowHandler()
    {
        frame = new JFrame();
        var output = new JTextArea();
        output.setEditable(false);
        frame.setSize(200, 200);
        frame.add(new JScrollPane(output));
        frame.setFocusableWindowState(false);
        frame.setVisible(true);
        setOutputStream(new OutputStream()
            {
                public void write(int b)
                {
                } // not called

                public void write(byte[] b, int off, int len)
                {
                    output.append(new String(b, off, len));
                }
            });
    }

    public void publish(LogRecord record)
    {
        if (!frame.isVisible()) return;
        super.publish(record);
        flush();
    }
}
```

---

## API — `java.lang.System.Logger` (Java 9)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `String getName()` | trả về **tên của logger này**. |
| `boolean isLoggable(System.Logger.Level level)` | trả về `true` nếu logger này **xử lý log ở level cho trước**. |
| `void log(System.Logger.Level level, String msg)`<br>`void log(System.Logger.Level level, String msg, Throwable thrown)`<br>`void log(System.Logger.Level level, Object obj)` | log message cho trước và **`Throwable` nếu có cung cấp**, hoặc `obj.toString`. |
| `void log(System.Logger.Level level, Supplier<String> msgSupplier)`<br>`void log(System.Logger.Level level, Supplier<String> msgSupplier, Throwable thrown)` | **nếu logger này xử lý log ở level cho trước** thì **gọi supplier** và log kết quả cùng `Throwable` nếu có. |
| `void log(System.Logger.Level level, String format, Object... params)` | log **message đã định dạng** với các parameter cho trước. |
| `void log(System.Logger.Level level, ResourceBundle bundle, String format, Object... params)` | nếu `bundle` là `null` thì **dùng thẳng format string**, ngược lại **tra nó trong bundle bằng `format` làm key**. Sau đó dùng format string như một **`MessageFormat`** với các parameter cho trước và log kết quả. |
| `void log(System.Logger.Level level, ResourceBundle bundle, String msg, Throwable thrown)` | nếu `bundle` là `null` thì log `msg`, ngược lại log **string có `msg` làm key trong bundle**. Sau đó **log `thrown` nếu nó khác `null`**. |

## API — `java.util.logging.Handler` (Java 1.4)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `abstract void publish(LogRecord record)` | **gửi record tới đích đã định**. |
| `abstract void flush()` | **đẩy hết dữ liệu đang nằm trong buffer ra**. |
| `abstract void close()` | đẩy hết dữ liệu trong buffer ra và **giải phóng mọi tài nguyên liên quan**. |
| `Filter getFilter()`<br>`void setFilter(Filter f)` | lấy và đặt **filter của handler này**. |
| `Formatter getFormatter()`<br>`void setFormatter(Formatter f)` | lấy và đặt **formatter của handler này**. |
| `Level getLevel()`<br>`void setLevel(Level l)` | lấy và đặt **level của handler này**. |

## API — `java.util.logging.ConsoleHandler` (Java 1.4)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `ConsoleHandler()` | dựng một **console handler mới**. |

## API — `java.util.logging.FileHandler` (Java 1.4)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `FileHandler(String pattern)`<br>`FileHandler(String pattern, boolean append)`<br>`FileHandler(String pattern, int limit, int count)`<br>`FileHandler(String pattern, int limit, int count, boolean append)`<br>`FileHandler(String pattern, long limit, int count, boolean append)` **9** | dựng một file handler. Xem Table 7.3 cho định dạng của `pattern`. **`limit` là số byte tối đa xấp xỉ trước khi mở file log mới.** **`count` là số file trong một rotation sequence.** Nếu **`append` là `true`** thì **record được nối thêm vào file log có sẵn**. |

## API — `java.util.logging.LogRecord` (Java 1.4)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `Level getLevel()` | lấy **logging level của record này**. |
| `String getLoggerName()` | lấy **tên của logger đang log record này**. |
| `ResourceBundle getResourceBundle()`<br>`String getResourceBundleName()` | lấy **resource bundle, hoặc tên của nó**, dùng để localize message, hoặc `null` nếu không có. |
| `String getMessage()` | lấy message **"thô"**, trước khi localize hay định dạng. |
| `Object[] getParameters()` | lấy **các object parameter**, hoặc `null` nếu không có. |
| `Throwable getThrown()` | lấy **object đã được throw**, hoặc `null` nếu không có. |
| `String getSourceClassName()`<br>`String getSourceMethodName()` | lấy **vị trí của đoạn code đã log record này**. Thông tin này **có thể do code logging cung cấp hoặc được suy ra tự động từ runtime stack**. Nó **có thể không chính xác** nếu code logging đưa vào giá trị sai, hoặc nếu code đang chạy đã được tối ưu khiến không suy ra được vị trí chính xác. |
| `long getMillis()` | lấy **thời điểm tạo, tính bằng millisecond kể từ 1970**. |
| `Instant getInstant()` **9** | lấy thời điểm tạo dưới dạng **`java.time.Instant`** (xem Chapter 6 của Volume II). |
| `long getSequenceNumber()` | lấy **sequence number duy nhất của record này**. |
| `long getLongThreadID()` **16** | lấy **ID duy nhất của thread nơi record này được tạo ra**. (Method `getThreadID` trả về ID kiểu `int`; nó **nay đã deprecated** vì một chương trình chạy lâu **có thể sinh ra hơn `Integer.MAX_VALUE` thread ID**.) |

## API — `java.util.logging.Filter` (Java 1.4)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `boolean isLoggable(LogRecord record)` | trả về `true` nếu **log record cho trước nên được log**. |

## API — `java.util.logging.Formatter` (Java 1.4)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `abstract String format(LogRecord record)` | trả về **string thu được từ việc định dạng log record cho trước**. |
| `String getHead(Handler h)`<br>`String getTail(Handler h)` | trả về **các string nên xuất hiện ở đầu và cuối tài liệu chứa các log record**. Superclass `Formatter` **định nghĩa hai method này trả về string rỗng**; override chúng nếu cần. |
| `String formatMessage(LogRecord record)` | trả về **phần message của log record đã được localize và định dạng**. |

---

## Bài kế tiếp

→ [[06 - Debugging Tips]] — những mẹo đáng thử trước khi phải mở debugger.
