# Glossary — Exceptions, Assertions, and Logging

> Thuật ngữ chương 7: Exceptions, Assertions, and Logging. Định nghĩa lấy từ Core Java Volume I, 13th Edition (Horstmann).

## A

**AssertionError**
Error được throw khi điều kiện của một câu lệnh `assert` cho ra `false`. Ở dạng `assert condition : expression`, **`expression` được truyền vào constructor của `AssertionError` và biến thành message string**. Object `AssertionError` **không lưu giá trị thật của expression**, nên không truy vấn lại được — theo tài liệu JDK, làm vậy "sẽ khuyến khích lập trình viên tìm cách phục hồi sau khi assertion thất bại, mà điều đó đi ngược lại mục đích của cơ chế này". Xem [[04 - Using Assertions#7.4.1. The Assertion Concept]].

**Assertion**
Một **lối viết quen thuộc của defensive programming**. Cơ chế assertion cho phép **đặt các phép kiểm tra vào lúc test rồi tự động gỡ bỏ chúng trong code production**. Keyword là `assert`, có hai dạng: `assert condition;` và `assert condition : expression;`. **Assertion thất bại được thiết kế là lỗi chí mạng, không thể phục hồi**, và **chỉ được bật trong lúc phát triển và test**. Là **công cụ chiến thuật (tactical)** cho test và debug, đối lập với logging là **công cụ chiến lược (strategic)**. Xem [[04 - Using Assertions]].

**AutoCloseable**
Interface có **duy nhất một method** `void close() throws Exception`. Resource dùng được trong try-with-resources phải thuộc class implement interface này. Xem [[02 - Catching Exceptions#7.2.5. The try-with-Resources Statement]].

## B

**Backend (logging)**
Phần **chịu trách nhiệm lọc, định dạng message và đặt chúng vào đâu đó**. Backend **cần cấu hình được bởi người triển khai (deployer)**, thường bằng cách sửa file cấu hình. Backend mặc định của platform logging API là **`java.util.logging`**. Xem [[05 - Logging#7.5.1. Should You Use the Java Logging Framework?]].

## C

**Cause**
Exception gốc được **đặt vào exception mới** khi rethrow, bằng constructor nhận cause hoặc method `initCause`. Lấy lại bằng `getCause()`. Kỹ thuật bọc (wrapping) này **rất được khuyến nghị**: nó cho phép **throw exception cấp cao trong subsystem mà không mất chi tiết của thất bại gốc**. Xem [[02 - Catching Exceptions#7.2.3. Rethrowing and Chaining Exceptions]].

**Checked Exception**
Exception mà **compiler kiểm tra**: nếu gọi một method throw checked exception thì **hoặc phải xử lý nó, hoặc phải chuyển nó lên trên** bằng `throws` specifier. Sách nói checked exception **vốn dĩ đã nặng nề — đừng throw chúng cho lỗi logic**. Khi override một method, **không được thêm `throws` specifier nhiều hơn method của superclass**. Xem [[01 - Dealing with Errors#7.1.1. The Classification of Exceptions]] và [[03 - Tips for Using Exceptions]].

**Closeable**
**Subinterface của `AutoCloseable`**, cũng chỉ có một method `close`, nhưng method đó **được khai báo throw `IOException`**. Xem [[02 - Catching Exceptions#7.2.5. The try-with-Resources Statement]].

**ConsoleHandler**
**Handler đơn giản nhất** của `java.util.logging`, in log record ra stream **`System.err`**. Cấu hình logging chuẩn **mặc định dùng một `ConsoleHandler`** với **logging level mặc định là `INFO`**. Xem [[05 - Logging#7.5.5. Log Handlers]].

## F

**Façade (logging)**
Thư viện **gửi log message tới framework mà người dùng ưa thích**, để cho người dùng code của bạn được quyền chọn logging framework. Ví dụ **SLF4J** và **platform logging API** (JEP 264). Façade **đôi khi được gọi là frontend**. Xem [[05 - Logging#7.5.1. Should You Use the Java Logging Framework?]].

**FileHandler**
Handler **thu thập log record vào một file**. Mặc định record được gửi tới file `javan.log` trong home directory của user và **được định dạng XML**. Hỗ trợ **file rotation**: log giữ trong chuỗi luân phiên `myapp.log.0`, `myapp.log.1`... — khi một file vượt giới hạn kích thước thì **bản cũ nhất bị xoá, các file khác được đổi tên, và file mới với generation number 0 được tạo**. Xem [[05 - Logging#7.5.5. Log Handlers]].

**Filter**
**Functional interface** với method `boolean isLoggable(LogRecord record)`, cho phép mỗi handler **lọc thêm ngoài việc lọc theo logging level**. Cài vào handler bằng entry `...ConsoleHandler.filter=...` trong cấu hình logging. Xem [[05 - Logging#7.5.6. Filters and Formatters]].

**finally**
Mệnh đề mà **code trong đó chạy bất kể exception có được catch hay không**, dùng để **dọn dẹp tài nguyên**. Dùng được **mà không cần `catch`**. **Đừng đặt các câu lệnh đổi luồng điều khiển (`return`, `throw`, `break`, `continue`) vào trong `finally`** — `return` trong `finally` **che mất giá trị trả về gốc** và thậm chí **nuốt luôn exception**. Xem [[02 - Catching Exceptions#7.2.4. The finally Clause]].

**Formatter**
Class định dạng log record. `ConsoleHandler` và `FileHandler` phát ra record ở **định dạng text và XML**, nhưng bạn **định nghĩa được định dạng riêng** bằng cách extend `java.util.logging.Formatter` và override `String format(LogRecord record)`. Có thể override thêm `getHead`/`getTail` cho các định dạng cần phần đầu/cuối bao quanh (như XML). Xem [[05 - Logging#7.5.6. Filters and Formatters]].

**Frontend (logging)**
Xem **Façade**. Phần **cung cấp API mà lập trình viên dùng để log message**. Xem [[05 - Logging#7.5.1. Should You Use the Java Logging Framework?]].

## H

**Handler**
Thứ **thực sự gửi log message đi** — logger không tự làm việc đó. **Mỗi handler có một parent** và mặc định **gửi từng record lên handler cha**. **Handler cũng có level** riêng, nên muốn thấy message `DEBUG`/`FINE` trên console phải set cả `java.util.logging.ConsoleHandler.level=FINE`. Xem [[05 - Logging#7.5.5. Log Handlers]].

## L

**Log Level**
Mỗi message được log đều có một level. Enumeration `System.Logger.Level` có các giá trị theo **mức nghiêm trọng giảm dần**: `ERROR`, `WARNING`, `INFO`, `DEBUG`, `TRACE`. **Vì lý do lịch sử**, tên level ở platform logging API và ở `java.util.logging` **khác nhau** — trong file cấu hình phải dùng tên của `java.util.logging`. Xem [[05 - Logging#7.5.3. The Platform Logging API]] và bảng Table 7.1 ở [[05 - Logging#7.5.4. Logging Configuration]].

**Logger**
Object platform logger implement interface **`System.Logger`**, lấy bằng `System.getLogger(name)`. **Mỗi logger có một tên**, thường là **tên package của class có method sinh ra log message**. **Lần đầu yêu cầu một tên thì logger được tạo; những lần sau cùng tên cho ra đúng object đó.** Tên logger **có tính phân cấp** — tắt message của logger cha thì **các logger con cũng bị vô hiệu hoá**. Xem [[05 - Logging#7.5.2. Logging 101]].

**Logging Proxy**
**Object của một subclass, chặn các lời gọi method, log chúng lại, rồi gọi method gốc.** Ví dụ tạo instance của một anonymous subclass của `Random` để log `nextDouble`. **Chỉ hoạt động nếu class không phải `final`.** Xem [[06 - Debugging Tips#4. Logging proxy]].

## M

**MessageFormat**
Class **xử lý pattern của log message**, dùng cho **localization**. **Không phải pattern kiểu `printf`**: placeholder là `{0}`, `{1}`...; **dấu ngoặc nhọn phải escape bằng nháy đơn** (`'{'`, `'}'`), và **hai nháy đơn `''`** để đưa một nháy đơn nguyên văn vào message. Xem [[05 - Logging#7.5.3. The Platform Logging API]].

## P

**Platform Logging API**
Façade/frontend **là một phần của JDK** (còn gọi là **JEP 264**), **rất cơ bản**. Logger của nó implement `System.Logger`. Xem [[05 - Logging#7.5.1. Should You Use the Java Logging Framework?]].

**Precondition (tiền điều kiện)**
Tên gọi trong khoa học máy tính cho **điều kiện mà caller phải thoả mãn** khi gọi method (ví dụ `@param a the array to be sorted (must not be null)`). Nếu caller **không thoả mãn precondition** thì **mọi cam kết đều vô hiệu và method muốn làm gì thì làm**. Đây là chỗ **assertion phù hợp**; ngược lại, hành vi đã ghi trong tài liệu là **contract** và **phải throw đúng exception, không được thay bằng assertion**. Xem [[04 - Using Assertions#7.4.3. Using Assertions for Parameter Checking]].

**Propagate**
Việc **không catch mà đẩy exception lên cho caller**. Quy tắc chung: **catch những exception bạn biết cách xử lý, propagate những cái bạn không biết cách xử lý**. Khi propagate **phải thêm `throws` specifier**. Sách nói **propagate không phải điều đáng xấu hổ** — method ở tầng cao hơn **thường được trang bị tốt hơn** để báo lỗi hoặc huỷ lệnh. Xem [[02 - Catching Exceptions#7.2.1. Catching an Exception]] và [[03 - Tips for Using Exceptions#6. Propagate exception không phải điều đáng xấu hổ]].

## R

**Resource Bundle**
Cơ chế **localize log message sang các ngôn ngữ khác nhau** (giới thiệu ở Volume II). Đưa vào bundle và key của format string, hoặc lấy logger kèm bundle. Khi gọi method của logger với **parameter `String`**, argument **được hiểu là key trong bundle**; method có parameter `Object` hoặc `Supplier<String>` **không bị ảnh hưởng**. Xem [[05 - Logging#7.5.3. The Platform Logging API]].

**Rethrow**
Việc **throw exception ngay trong mệnh đề `catch`**, thường để **đổi kiểu exception** — ví dụ subsystem throw `ServletException` để cho biết lỗi nằm ở servlet. Nên **đặt exception gốc làm cause**. Xem [[02 - Catching Exceptions#7.2.3. Rethrowing and Chaining Exceptions]].

## S

**SLF4J**
Một **façade thường dùng với API dễ chịu** (https://www.slf4j.org). Xem [[05 - Logging#7.5.1. Should You Use the Java Logging Framework?]].

**SocketHandler**
Handler **gửi record tới một host và port chỉ định**. Xem [[05 - Logging#7.5.5. Log Handlers]].

**Squelch (bóp nghẹt exception)**
Việc **catch rồi lờ đi exception trong im lặng** (`catch (Exception e) {}`) để **bịt miệng compiler**. Code sẽ **compile trơn tru và chạy ổn — trừ khi có exception xảy ra**. Sách khuyên **đừng làm vậy**. Xem [[03 - Tips for Using Exceptions#4. Đừng bóp nghẹt exception]].

**Stack Trace**
**Danh sách mọi lời gọi method đang chờ (pending) tại một thời điểm nhất định trong quá trình thực thi.** Lấy dạng text bằng `printStackTrace` của `Throwable`; cách linh hoạt hơn là class **`StackWalker`** cho ra stream các `StackWalker.StackFrame`. **Đừng hiện stack trace cho người dùng cuối** vì nó có thể **chứa chi tiết implementation lộ ra cho kẻ tấn công** — hãy **log lại và chỉ hiện thông báo tóm tắt**. Sinh stack trace mà không cần exception bằng `Thread.dumpStack();`. Xem [[02 - Catching Exceptions#7.2.6. Analyzing Stack Trace Elements]], [[03 - Tips for Using Exceptions#8. Đừng hiện stack trace cho người dùng cuối]] và [[06 - Debugging Tips#5. Lấy stack trace từ object exception]].

**Suppressed Exception**
Exception **do method `close` throw ra** trong try-with-resources khi block `try` cũng đã throw exception. **Exception gốc được rethrow**, các exception từ `close` **bị coi là "suppressed"**, tự động được thêm vào exception gốc bằng `addSuppressed` và lấy lại bằng `getSuppressed`. Xem [[02 - Catching Exceptions#7.2.5. The try-with-Resources Statement]].

## T

**throws Specifier**
Phần khai báo **báo cho caller biết method có thể throw exception nào**. **Compiler áp đặt `throws` specifier rất nghiêm.** **Không khai báo `Error` và `RuntimeException`.** Xem [[01 - Dealing with Errors#7.1.2. Declaring Checked Exceptions]].

**"Throw early, catch late"**
Câu tóm tắt của sách cho **quy tắc 5 và 6** trong phần tips: khi phát hiện lỗi thì **"tough love" tốt hơn nuông chiều** (throw ngay tại điểm thất bại thay vì trả về giá trị giả), và **propagate exception không đáng xấu hổ**. Xem [[03 - Tips for Using Exceptions]].

**try-with-Resources**
**Lối tắt** cho mẫu "mở resource → `try` → `finally` đóng resource", với điều kiện resource thuộc class implement **`AutoCloseable`**. Khi block `try` thoát ra thì **`res.close()` được gọi tự động**, dù thoát bình thường hay do exception. **Chỉ định được nhiều resource**, và **đưa được vào header những biến effectively final đã khai báo trước**. Sách khuyên **dùng try-with-resources mỗi khi cần đóng một resource**. Xem [[02 - Catching Exceptions#7.2.5. The try-with-Resources Statement]].

## U

**UncheckedIOException**
Class Java API cung cấp sẵn để **bọc `IOException` checked vào một runtime exception**, hữu ích khi checked exception xảy ra trong một method **không được phép throw checked exception**. Xem [[02 - Catching Exceptions#7.2.3. Rethrowing and Chaining Exceptions]].

**Unchecked Exception**
Exception mà **compiler không bắt khai báo**: các exception dẫn xuất từ `Error` và `RuntimeException`. Xem [[01 - Dealing with Errors#7.1.1. The Classification of Exceptions]].

**Union Type**
Thứ mà kiểu của biến `e` trong `catch (A | B e)` **KHÔNG phải**, dù IDE có báo vậy. **Biến Java không có union type**; kiểu thật của `e` là **least upper bound (cận trên nhỏ nhất)** của các kiểu đó. Điều này **quan trọng khi phân tích `e` bằng `switch`** vì `switch` sẽ **không exhaustive**. Xem [[02 - Catching Exceptions#7.2.2. Catching Multiple Exceptions]].

## X

**-Xlint**
Option bảo compiler **phát hiện các vấn đề code thường gặp**, ví dụ **`break` bị thiếu trong `switch`**. String trong ngoặc vuông của warning **cho biết category**; nên **để nguyên tất cả và chỉ tắt những cái không quan tâm** (`javac -Xlint:all,-fallthrough,-serial ...`). Thuật ngữ **"lint"** ban đầu chỉ **công cụ định vị vấn đề tiềm ẩn trong chương trình C**. Xem [[06 - Debugging Tips#10. Option `-Xlint` của compiler]].

**-Xlog**
Option dòng lệnh **bật logging cho virtual machine** (ví dụ log garbage collection) khi khởi động VM. Xem [[05 - Logging#7.5.1. Should You Use the Java Logging Framework?]].

---

## Ba cơ chế đối phó với system failure

| # | Cơ chế | Đặc điểm theo sách |
|---|---|---|
| 1 | **Throw một exception** | Dùng cho **tình huống ngoại lệ thật sự**; hành vi đã ghi trong tài liệu là **contract phải tôn trọng** |
| 2 | **Logging** | **Công cụ chiến lược cho toàn bộ vòng đời chương trình** |
| 3 | **Dùng assertion** | **Công cụ chiến thuật cho test và debug**; **chí mạng, không phục hồi được**, chỉ bật lúc phát triển |

Xem [[04 - Using Assertions#7.4.3. Using Assertions for Parameter Checking]].
