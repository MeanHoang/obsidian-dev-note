# 01 — Dealing with Errors

> Chapter 7, Section 7.1 — Core Java Volume I, 13th Edition (Horstmann).
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## Mở đầu chương 7

> *"In a perfect world, users would never enter data in the wrong form, files they choose to open would always exist, and code would never have bugs. So far, I've mostly presented code as if we all lived in this kind of perfect world. It is now time to turn to the mechanisms the Java programming language has for dealing with the real world of bad data and buggy code."*

**Dịch:** Trong một thế giới hoàn hảo, người dùng sẽ **không bao giờ nhập sai định dạng data**, file họ mở **luôn tồn tại**, và code **không bao giờ có bug**. Từ đầu tới giờ, sách phần lớn trình bày code như thể ta đang sống trong thế giới hoàn hảo đó. Giờ là lúc quay sang các **cơ chế mà Java có để đối phó với thế giới thực** đầy data hỏng và code lỗi.

> *"Encountering errors is unpleasant. If a user loses all the work he or she did during a program session because of a programming mistake or some external circumstance, that user may forever turn away from your program. At the very least, you must:"*

> *"Notify the user of an error;"*
> *"Save all work; and"*
> *"Allow users to gracefully exit the program."*

**Dịch:** Gặp lỗi là chuyện khó chịu. Nếu người dùng **mất sạch công sức** trong một phiên làm việc vì lỗi lập trình hay vì hoàn cảnh bên ngoài, họ có thể **quay lưng vĩnh viễn** với chương trình của bạn. Tối thiểu, bạn phải:

- **Báo cho người dùng biết có lỗi**;
- **Lưu lại toàn bộ công việc**; và
- **Cho người dùng thoát chương trình một cách êm đẹp**.

> *"For exceptional situations, such as bad input data with the potential to bomb the program, Java uses a form of error trapping called, naturally enough, exception handling. Exception handling in Java is similar to that in C++ or Delphi. The first part of this chapter covers Java's exceptions."*

**Dịch:** Với các tình huống ngoại lệ — ví dụ **input data hỏng có nguy cơ làm nổ chương trình** — Java dùng một dạng bẫy lỗi gọi (rất đúng tên) là **exception handling**. Exception handling trong Java **tương tự C++ hoặc Delphi**. Phần đầu chương này nói về exception của Java.

> *"During testing, you need to run lots of checks to make sure your program does the right thing. But those checks can be time-consuming and unnecessary after testing has completed. You could just remove the checks and stick them back in when additional testing is required—but that is tedious. The second part of this chapter shows you how to use the assertion facility for selectively activating checks."*

**Dịch:** Khi test, bạn cần chạy **rất nhiều phép kiểm tra** để chắc chương trình làm đúng. Nhưng những kiểm tra đó **tốn thời gian và không cần thiết sau khi test xong**. Bạn có thể gỡ chúng ra rồi nhét lại khi cần test tiếp — nhưng **rất phiền**. Phần hai của chương chỉ cách dùng **assertion** để **bật/tắt các phép kiểm tra một cách chọn lọc**.

> *"When your program does the wrong thing, you can't always communicate with the user or terminate. Instead, you may want to record the problem for later analysis. The third part of this chapter discusses the standard Java logging framework."*

**Dịch:** Khi chương trình làm sai, bạn **không phải lúc nào cũng nói được với người dùng hay kết thúc chương trình**. Thay vào đó, bạn có thể muốn **ghi lại vấn đề để phân tích sau**. Phần ba của chương bàn về **logging framework chuẩn của Java**.

---

## 7.1. Dealing with Errors

> *"Suppose an error occurs while a Java program is running. The error might be caused by a file containing wrong information, a flaky network connection, or (I hate to mention it) use of an invalid array index or an object reference that hasn't yet been assigned to an object. Users expect that programs will act sensibly when errors happen. If an operation cannot be completed because of an error, the program ought to either"*

> *"Return to a safe state and enable the user to execute other commands; or"*
> *"Allow the user to save all work and terminate the program gracefully."*

**Dịch:** Giả sử có lỗi xảy ra khi chương trình Java đang chạy. Lỗi có thể do file chứa thông tin sai, kết nối mạng chập chờn, hoặc (rất tiếc phải nhắc) do dùng **array index không hợp lệ** (xem [[09 - Arrays]]) hay một **object reference chưa được gán tới object nào** (xem [[03 - Defining Your Own Classes]]). Người dùng mong chương trình **hành xử hợp lý** khi có lỗi. Nếu một thao tác không hoàn thành được vì lỗi, chương trình nên hoặc là:

- **Quay về trạng thái an toàn** và cho người dùng chạy lệnh khác; hoặc
- **Cho người dùng lưu hết công việc rồi kết thúc chương trình êm đẹp**.

> *"This may not be easy to do, because the code that detects the error condition is usually far away from the code that can roll back the data to a safe state or save the user's work and exit cheerfully. The mission of exception handling is to transfer control from where the error occurred to an error handler that can deal with the situation."*

**Dịch:** Việc này **không dễ**, vì đoạn code **phát hiện ra lỗi** thường **cách rất xa** đoạn code có thể đưa data về trạng thái an toàn hoặc lưu công việc rồi thoát vui vẻ. **Nhiệm vụ của exception handling là chuyển quyền điều khiển từ nơi lỗi xảy ra tới một error handler có thể xử lý tình huống.**

### Những loại vấn đề cần tính đến

> *"To handle exceptional situations in your program, you must take into account the errors and problems that may occur. What sorts of problems do you need to consider?"*

**Dịch:** Muốn xử lý tình huống ngoại lệ, bạn phải tính đến các lỗi và vấn đề có thể xảy ra. Cần cân nhắc những loại nào?

> *"User input errors. In addition to the inevitable typos, some users like to blaze their own trail instead of following directions. Suppose, for example, that a user asks to connect to a URL that is syntactically wrong. Your code should check the syntax, but suppose it does not. Then the network layer will complain."*

**Dịch:** **User input errors** — lỗi nhập liệu. Ngoài mấy lỗi gõ nhầm không tránh khỏi, một số người dùng thích **tự mở đường riêng** thay vì làm theo hướng dẫn. Ví dụ người dùng yêu cầu kết nối tới một URL **sai cú pháp**. Code của bạn lẽ ra phải kiểm tra cú pháp, nhưng giả sử nó không kiểm tra. Thế thì **tầng network sẽ kêu ca**.

> *"Device errors. Hardware does not always do what you want it to. The printer may be turned off. A web page may be temporarily unavailable. Devices will often fail in the middle of a task. For example, a printer may run out of paper during printing."*

**Dịch:** **Device errors** — lỗi thiết bị. Phần cứng **không phải lúc nào cũng làm theo ý bạn**. Máy in có thể đang tắt. Một trang web có thể tạm thời không truy cập được. Thiết bị **thường hỏng giữa chừng một tác vụ** — ví dụ máy in **hết giấy khi đang in**.

> *"Physical limitations. Disks can fill up; you can run out of available memory."*

**Dịch:** **Physical limitations** — giới hạn vật lý. Đĩa có thể **đầy**; bạn có thể **hết memory**.

> *"Code errors. A method may not perform correctly. For example, it could deliver wrong answers or use other methods incorrectly. Computing an invalid array index, trying to find a nonexistent entry in a hash table, or trying to pop an empty stack are all examples of a code error."*

**Dịch:** **Code errors** — lỗi code. Một method có thể **chạy không đúng**: cho ra kết quả sai, hoặc dùng method khác sai cách. **Tính ra một array index không hợp lệ**, tìm một entry không tồn tại trong hash table, hay **pop một stack rỗng** đều là ví dụ của code error.

### Vì sao error code không đủ

> *"The traditional reaction to an error in a method is to return a special error code that the calling method analyzes. For example, methods that read information back from files often return a -1 end-of-file value marker rather than a standard character. Another common return value to denote an error condition is the null reference."*

**Dịch:** Phản ứng truyền thống khi method gặp lỗi là **trả về một error code đặc biệt** để method gọi phân tích. Ví dụ, method đọc thông tin từ file thường trả về **giá trị đánh dấu end-of-file là `-1`** thay vì một ký tự bình thường. Một giá trị trả về phổ biến khác để báo lỗi là **`null` reference**.

> *"However, it is not always possible to return an error code. There may be no obvious way of distinguishing valid and invalid data. A method returning an integer cannot simply return -1 to denote the error; the value -1 might be a perfectly valid result."*

**Dịch:** Tuy nhiên, **không phải lúc nào cũng trả về error code được**. Có thể **chẳng có cách rõ ràng nào** để phân biệt data hợp lệ với data không hợp lệ. Một method trả về `integer` **không thể cứ trả `-1` để báo lỗi**; giá trị `-1` có khi là **một kết quả hoàn toàn hợp lệ**.

> *"Returning null to indicate failure is particularly problematic. Consider the listFiles method of the legacy java.io.File class. It returns a File[] array, or null in case of failure. If the programmer did not check for null, a NullPointerException occurs when the return value is first used, masking the original problem."*

**Dịch:** Trả về `null` để báo thất bại **đặc biệt có vấn đề**. Xét method `listFiles` của class cũ `java.io.File`: nó trả về mảng `File[]`, hoặc `null` nếu thất bại. Nếu lập trình viên **không kiểm tra `null`**, một [[03 - Defining Your Own Classes|NullPointerException]] sẽ xảy ra **khi giá trị trả về được dùng lần đầu**, **che mất vấn đề gốc**.

### Đường thoát thay thế: throw

> *"Java allows every method an alternative exit path if it is unable to complete its task in the normal way. In this situation, the method does not return a value. Instead, it throws an object that encapsulates the error information. Note that the method exits immediately; it does not return its normal (or any) value. Moreover, execution does not resume at the code that called the method; instead, the exception-handling mechanism begins its search for an exception handler that can deal with this particular error condition."*

**Dịch:** Java cho **mọi method một đường thoát thay thế** nếu nó không hoàn thành được nhiệm vụ theo cách bình thường. Trong tình huống đó, method **không trả về giá trị**. Thay vào đó, nó **throw một object đóng gói thông tin lỗi**. Lưu ý method **thoát ngay lập tức**; nó **không trả về giá trị bình thường (hay bất kỳ giá trị nào)**. Hơn nữa, **việc thực thi không tiếp tục ở đoạn code đã gọi method**; thay vào đó, **cơ chế exception handling bắt đầu đi tìm một exception handler** xử lý được đúng loại lỗi này.

> *"Exceptions have their own syntax and are part of a special inheritance hierarchy. I'll take up the syntax first and then give a few hints on how to use this language feature effectively."*

**Dịch:** Exception có **cú pháp riêng** và thuộc về một **inheritance hierarchy đặc biệt**. Sách nói về cú pháp trước, rồi mới gợi ý cách dùng feature này cho hiệu quả.

> **Tip (sách):** *"Favor methods that use exceptions over those that return error codes. It is easy to forget checking error codes, but exceptions cannot be overlooked. Exceptions can also carry more information. For example, the delete method of the legacy java.io.File class returns false if the deletion was unsuccessful. The delete method in the java.nio.file.Files class is more useful. In case of failure it throws an exception of a type that clearly indicates the nature of the problem."*
>
> **Dịch:** **Ưu tiên method dùng exception hơn method trả error code.** **Rất dễ quên kiểm tra error code**, còn **exception thì không thể bỏ qua**. Exception cũng **mang được nhiều thông tin hơn**. Ví dụ, method `delete` của class cũ `java.io.File` trả về `false` nếu xoá không thành công. Method `delete` trong class `java.nio.file.Files` **hữu ích hơn**: khi thất bại nó **throw một exception có kiểu chỉ rõ bản chất vấn đề**.

---

## 7.1.1. The Classification of Exceptions

> *"In the Java programming language, an exception object is always an instance of a class derived from Throwable. As you will soon see, you can create your own exception classes if those built into Java do not suit your needs."*

**Dịch:** Trong Java, **exception object luôn là một instance của một class dẫn xuất từ `Throwable`**. Bạn **tạo được exception class của riêng mình** nếu những class có sẵn không hợp nhu cầu.

> *"Figure 7.1 is a simplified diagram of the exception hierarchy in Java."*
>
> *"Notice that all exceptions descend from Throwable, but the hierarchy immediately splits into two branches: Error and Exception."*

**Dịch:** Mọi exception đều **kế thừa từ `Throwable`**, nhưng hierarchy **lập tức chia làm hai nhánh: `Error` và `Exception`**.

```
                    Throwable
                        │
          ┌─────────────┴─────────────┐
        Error                     Exception
                                      │
                        ┌─────────────┴─────────────┐
                 RuntimeException          các Exception khác
                                           (IOException, ...)
```

> *"The Error hierarchy describes internal errors and resource exhaustion situations inside the Java runtime system. You should not throw an object of this type. There is little you can do if such an internal error occurs, beyond notifying the user and trying to terminate the program gracefully. These situations are quite rare."*

**Dịch:** Nhánh **`Error`** mô tả **lỗi nội bộ và tình huống cạn kiệt tài nguyên bên trong Java runtime system**. Bạn **không nên throw object kiểu này**. Khi lỗi nội bộ như vậy xảy ra thì **chẳng làm được gì nhiều** ngoài báo người dùng và cố kết thúc chương trình êm đẹp. Những tình huống này **khá hiếm**.

> *"When doing Java programming, focus on the Exception hierarchy. The Exception hierarchy also splits into two branches: exceptions that derive from RuntimeException and those that do not. The general rule is this: A RuntimeException happens because you made a programming error. Any other exception occurs because a bad thing, such as an I/O error, happened to your otherwise good program."*

**Dịch:** Khi lập trình Java, hãy **tập trung vào nhánh `Exception`**. Nhánh này cũng **chia làm hai**: exception **dẫn xuất từ `RuntimeException`** và exception **không dẫn xuất từ nó**. Quy tắc chung: **`RuntimeException` xảy ra vì bạn viết code sai.** Mọi exception khác xảy ra vì **một chuyện xấu — như lỗi I/O — ập tới chương trình vốn dĩ tốt của bạn**.

> *"Exceptions that inherit from RuntimeException include such problems as"*
>
> *"A bad cast"*
> *"An out-of-bounds array access"*
> *"A null pointer access"*

**Dịch:** Exception kế thừa từ `RuntimeException` gồm các vấn đề như:

- **cast sai**
- **truy cập array ngoài phạm vi**
- **truy cập qua null pointer**

> *"Exceptions that do not inherit from RuntimeException include"*
>
> *"Trying to read past the end of a file"*
> *"Trying to open a file that doesn't exist"*
> *"Trying to find a Class object for a string that does not denote an existing class"*

**Dịch:** Exception **không** kế thừa từ `RuntimeException` gồm:

- **đọc quá phần cuối của file**
- **mở một file không tồn tại**
- **tìm object `Class` cho một string không ứng với class nào đang tồn tại**

> *"The rule "If it is a RuntimeException, it was your fault" works pretty well. You could have avoided that ArrayIndexOutOfBoundsException by testing the array index against the array bounds. The NullPointerException would not have happened had you checked whether the variable was null before using it."*

**Dịch:** Quy tắc **"nếu là `RuntimeException` thì đó là lỗi của bạn"** khá đúng. Bạn **lẽ ra đã tránh được** `ArrayIndexOutOfBoundsException` bằng cách **kiểm tra index so với biên của array**. `NullPointerException` **đã không xảy ra** nếu bạn kiểm tra biến có `null` không trước khi dùng.

> *"How about a file that doesn't exist? Can't you first check whether the file exists, and then open it? Well, the file might be deleted right after you checked for its existence. Thus, the notion of "existence" depends on the environment, not just on your code."*

**Dịch:** Còn file không tồn tại thì sao? Không thể kiểm tra file có tồn tại rồi mới mở à? Vấn đề là file **có thể bị xoá ngay sau khi bạn vừa kiểm tra**. Vì thế, khái niệm **"tồn tại" phụ thuộc vào môi trường**, chứ không chỉ vào code của bạn.

### Checked vs unchecked exception

> *"The Java Language Specification calls any exception that derives from the class Error or the class RuntimeException an unchecked exception. All other exceptions are called checked exceptions. This is useful terminology that I also adopt in this book. The compiler checks that you provide exception handlers for all checked exceptions."*

**Dịch:** Java Language Specification gọi **mọi exception dẫn xuất từ `Error` hoặc `RuntimeException` là unchecked exception**. **Mọi exception còn lại gọi là checked exception.** Đây là thuật ngữ hữu ích mà sách cũng dùng theo. **Compiler kiểm tra rằng bạn có cung cấp exception handler cho mọi checked exception.**

| Nhóm | Gồm | Compiler kiểm tra? |
|---|---|---|
| **unchecked exception** | dẫn xuất từ `Error` hoặc `RuntimeException` | Không |
| **checked exception** | mọi exception còn lại | **Có** |

> **Note (sách):** *"The name RuntimeException is somewhat confusing. Of course, all of the errors we are discussing occur at runtime. The name originated in prehistoric times, when the "runtime" of Oak, the predecessor of Java, generated out-of-bounds exceptions and null pointer exceptions. Presumably I/O exceptions were produced by some other component."*
>
> **Dịch:** Cái tên `RuntimeException` **hơi gây nhầm lẫn**. Dĩ nhiên **mọi lỗi đang bàn đều xảy ra lúc runtime**. Tên này bắt nguồn từ **thời tiền sử**, khi "runtime" của **Oak** — tiền thân của Java — sinh ra out-of-bounds exception và null pointer exception. Chắc là I/O exception khi đó do **một component khác** sinh ra.

> **C++ Note (sách):** *"If you are familiar with the (much more limited) exception hierarchy of the standard C++ library, you may be really confused at this point. C++ has two fundamental exception classes, runtime_error and logic_error. The logic_error class is the equivalent of Java's RuntimeException and also denotes logical errors in the program. The runtime_error class is the base class for exceptions caused by unpredictable problems. It is equivalent to those exceptions in Java that are not of type RuntimeException."*
>
> **Dịch:** Nếu bạn quen với exception hierarchy (hạn chế hơn nhiều) của thư viện C++ chuẩn thì tới đây có thể **rất bối rối**. C++ có **hai exception class nền tảng**: `runtime_error` và `logic_error`. Class **`logic_error` tương đương `RuntimeException` của Java**, cũng chỉ **lỗi logic trong chương trình**. Class **`runtime_error` là base class cho exception do những vấn đề không đoán trước được**, **tương đương với những exception trong Java không thuộc kiểu `RuntimeException`**.

---

## 7.1.2. Declaring Checked Exceptions

> *"A Java method can throw an exception if it encounters a situation it cannot handle. The idea is simple: A method will not only tell the Java compiler what values it can return, it is also going to tell the compiler what can go wrong. For example, code that attempts to read from a file knows that the file might not exist or that it might be empty. The code that tries to process the information in a file therefore will need to notify the compiler that it can throw some sort of IOException."*

**Dịch:** Một method Java **throw được exception** nếu nó gặp tình huống không xử lý nổi. Ý tưởng rất đơn giản: method **không chỉ nói cho compiler biết nó trả về giá trị gì, mà còn nói cái gì có thể hỏng**. Ví dụ, code đọc file biết rằng file **có thể không tồn tại hoặc rỗng**. Vì thế code xử lý thông tin trong file cần **báo cho compiler biết nó có thể throw một loại `IOException` nào đó**.

> *"The place in which you advertise that your method can throw an exception is the header of the method; the header changes to reflect the checked exceptions the method can throw. For example, here is the declaration of one of the constructors of the FileInputStream class from the standard library. (See Chapter 2 of Volume II for more on input and output.)"*

```java
public FileInputStream(String name) throws FileNotFoundException
```

**Dịch:** Chỗ để **thông báo rằng method có thể throw exception là header của method**; header thay đổi để phản ánh **các checked exception mà method có thể throw**. Trên là khai báo của một trong các [[06 - Object Construction|constructor]] của class `FileInputStream` trong thư viện chuẩn.

> *"The declaration says that this constructor produces a FileInputStream object from a String parameter but that it also can go wrong in a special way—by throwing a FileNotFoundException. If this sad state should come to pass, the constructor call will not initialize a new FileInputStream object but instead will throw an object of the FileNotFoundException class. If it does, the runtime system will begin to search for an exception handler that knows how to deal with FileNotFoundException objects."*

**Dịch:** Khai báo trên nói rằng constructor này tạo ra một object `FileInputStream` từ một parameter [[05 - Strings|String]], nhưng nó cũng **hỏng được theo một cách đặc biệt** — bằng cách **throw một `FileNotFoundException`**. Nếu chuyện buồn đó xảy ra, lời gọi constructor **sẽ không khởi tạo object `FileInputStream` mới** mà **throw một object của class `FileNotFoundException`**. Khi đó, **runtime system bắt đầu đi tìm một exception handler biết cách xử lý object `FileNotFoundException`**.

### Bốn tình huống exception được throw

> *"When you write your own methods, you don't have to advertise every possible throwable object that your method might actually throw. To understand when (and what) you have to advertise in the throws clause of the methods you write, keep in mind that an exception is thrown in any of the following four situations:"*

> *"You call a method that throws a checked exception—for example, the FileInputStream constructor."*
> *"You detect an error and throw a checked exception with the throw statement (the throw statement is covered in the next section)."*
> *"You make a programming error, such as a[-1] = 0 that gives rise to an unchecked exception (in this case, an ArrayIndexOutOfBoundsException)."*
> *"An internal error occurs in the virtual machine or runtime library."*

**Dịch:** Khi tự viết method, bạn **không phải khai báo mọi throwable object mà method có thể throw**. Để hiểu **khi nào (và cái gì)** phải khai báo trong mệnh đề `throws`, nhớ rằng exception được throw trong **bốn tình huống** sau:

1. Bạn **gọi một method throw checked exception** — ví dụ constructor của `FileInputStream`.
2. Bạn **phát hiện lỗi và throw một checked exception bằng câu lệnh `throw`**.
3. Bạn **viết code sai**, ví dụ `a[-1] = 0`, làm phát sinh một **unchecked exception** (ở đây là `ArrayIndexOutOfBoundsException`).
4. **Lỗi nội bộ xảy ra trong virtual machine hoặc runtime library.**

> *"If either of the first two scenarios occurs, you must tell the programmers who will use your method about the possibility of an exception. Why? Any method that throws an exception is a potential death trap. If no handler catches the exception, the current thread of execution terminates."*

**Dịch:** Nếu **hai tình huống đầu** xảy ra, bạn **phải nói cho lập trình viên dùng method của bạn biết về khả năng có exception**. Vì sao? Vì **method nào throw exception cũng là một cái bẫy chết tiềm tàng**. **Nếu không handler nào catch exception, thread thực thi hiện tại bị kết thúc.**

> *"As with Java methods that are part of the supplied classes, you declare that your method may throw an exception with an exception specification in the method header."*

```java
class MyAnimation
{
    . . .
    public Image loadImage(String s) throws IOException
    {
        . . .
    }
}
```

**Dịch:** Giống như method của các class có sẵn, bạn **khai báo method của mình có thể throw exception bằng một exception specification trong header của method**.

> *"If a method might throw more than one checked exception type, you must list all exception classes in the header. Separate them by commas, as in the following example:"*

```java
class MyAnimation
{
    . . .
    public Image loadImage(String s) throws FileNotFoundException, EOFException
    {
        . . .
    }
}
```

**Dịch:** Nếu method có thể throw **nhiều kiểu checked exception**, bạn **phải liệt kê toàn bộ exception class trong header**, **ngăn nhau bằng dấu phẩy**.

### Không khai báo Error và RuntimeException

> *"However, you do not need to advertise internal Java errors—that is, exceptions inheriting from Error. Any code could potentially throw those exceptions, and they are entirely beyond your control."*

**Dịch:** Tuy nhiên, **bạn không cần khai báo lỗi nội bộ của Java** — tức exception kế thừa từ `Error`. **Bất kỳ đoạn code nào cũng có thể throw chúng**, và chúng **hoàn toàn nằm ngoài tầm kiểm soát của bạn**.

> *"Similarly, you should not advertise unchecked exceptions inheriting from RuntimeException."*

```java
class MyAnimation
{
    . . .
    void drawImage(int i) throws ArrayIndexOutOfBoundsException // bad style
    {
        . . .
    }
}
```

**Dịch:** Tương tự, **không nên khai báo unchecked exception kế thừa từ `RuntimeException`**. Ví dụ trên sách ghi rõ là **bad style**.

> *"These runtime errors are completely under your control. If you are so concerned about array index errors, you should spend your time fixing them instead of advertising the possibility that they can happen."*

**Dịch:** Những runtime error này **hoàn toàn nằm trong tầm kiểm soát của bạn**. Nếu bạn lo lắng về lỗi array index đến thế thì **nên dành thời gian sửa chúng** thay vì đi thông báo rằng chúng có thể xảy ra.

> *"In summary, a method must declare all the checked exceptions that it might throw. Unchecked exceptions are either beyond your control (Error) or result from conditions that you should not have allowed in the first place (RuntimeException). If your method fails to faithfully declare all checked exceptions, the compiler will issue an error message."*

**Dịch:** Tóm lại: **method phải khai báo mọi checked exception nó có thể throw**. Unchecked exception thì hoặc **nằm ngoài tầm kiểm soát (`Error`)**, hoặc **là hệ quả của những điều kiện lẽ ra bạn không nên để xảy ra (`RuntimeException`)**. Nếu method **không khai báo trung thực mọi checked exception**, **compiler sẽ báo lỗi**.

> *"Of course, as you have already seen in quite a few examples, instead of declaring the exception, you can also catch it. Then the exception won't be thrown out of the method, and no throws specification is necessary. You will see later in this chapter how to decide whether to catch an exception or to enable someone else to catch it."*

**Dịch:** Dĩ nhiên, thay vì **khai báo** exception, bạn cũng có thể **catch** nó. Khi đó **exception không bị throw ra khỏi method**, và **không cần `throws` specification**. Phần sau của chương sẽ nói cách quyết định **nên catch hay để người khác catch**.

> **Caution (sách):** *"If you override a method from a superclass, the checked exceptions that the subclass method declares cannot be more general than those of the superclass method. (It is OK to throw more specific exceptions, or not to throw any exceptions in the subclass method.) In particular, if the superclass method throws no checked exception at all, neither can the subclass. For example, if you override JComponent.paintComponent, your paintComponent method must not throw any checked exceptions, because the superclass method doesn't throw any."*
>
> **Dịch:** Nếu bạn **override một method từ superclass**, thì **checked exception mà method của subclass khai báo không được tổng quát hơn** method của superclass. (**Throw exception cụ thể hơn thì được**, hoặc **không throw gì cả cũng được**.) Đặc biệt, nếu **method của superclass không throw checked exception nào** thì **subclass cũng không được**. Ví dụ khi override `JComponent.paintComponent`, method `paintComponent` của bạn **không được throw checked exception nào**, vì method của superclass không throw gì.

> *"When a method in a class declares that it throws an exception that is an instance of a particular class, it may throw an exception of that class or of any of its subclasses. For example, the FileInputStream constructor could have declared that it throws an IOException. In that case, you would not have known what kind of IOException it is; it could be a plain IOException or an object of one of the various subclasses, such as FileNotFoundException."*

**Dịch:** Khi một method khai báo throw exception thuộc một class nào đó, nó **được throw exception của chính class đó hoặc của bất kỳ subclass nào**. Ví dụ, constructor `FileInputStream` **đã có thể khai báo là throw `IOException`**. Trong trường hợp đó bạn **sẽ không biết đó là loại `IOException` nào**: có thể là `IOException` thuần, hoặc object của một trong các subclass như `FileNotFoundException`.

> **C++ Note (sách):** *"The throws specifier is the same as the throw specifier in C++, with one important difference. In C++, throw specifiers are enforced at runtime, not at compile time. That is, the C++ compiler pays no attention to exception specifications. But if an exception is thrown in a function that is not part of the throw list, the unexpected function is called, and, by default, the program terminates. Also, in C++, a function may throw any exception if no throw specification is given. In Java, a method without a throws specifier may not throw any checked exceptions at all."*
>
> **Dịch:** `throws` specifier giống `throw` specifier của C++, với **một khác biệt quan trọng**. Trong C++, `throw` specifier được **áp đặt lúc runtime, không phải lúc compile** — tức **compiler C++ chẳng thèm để ý tới exception specification**. Nhưng nếu một exception bị throw trong hàm mà nó không nằm trong `throw` list thì hàm `unexpected` được gọi, và **mặc định chương trình kết thúc**. Ngoài ra, trong C++, **hàm không có `throw` specification thì throw được mọi exception**. Trong Java, **method không có `throws` specifier thì không được throw bất kỳ checked exception nào**.

---

## 7.1.3. How to Throw an Exception

> *"Now, suppose something terrible has happened in your code. You have a method, readData, that is reading in a file whose header promised"*

```
Content-length: 1024
```

> *"but you got an end of file after 733 characters. You may decide this situation is so abnormal that you want to throw an exception."*

**Dịch:** Giả sử có chuyện tệ hại xảy ra trong code. Bạn có method `readData` đọc một file mà header hứa `Content-length: 1024`, **nhưng bạn gặp end of file sau 733 ký tự**. Bạn có thể quyết định tình huống này **bất thường đến mức cần throw exception**.

> *"You need to decide what exception type to throw. Some kind of IOException would be a good choice. Perusing the Java API documentation, you find an EOFException with the description "Signals that an EOF has been reached unexpectedly during input." Perfect. Here is how you throw it:"*

```java
throw new EOFException();
```

> *"or, if you prefer,"*

```java
var e = new EOFException();
throw e;
```

**Dịch:** Bạn cần **quyết định throw kiểu exception nào**. Một loại `IOException` nào đó là lựa chọn tốt. Lục tài liệu Java API, bạn tìm được `EOFException` với mô tả **"Signals that an EOF has been reached unexpectedly during input"** (báo hiệu đã gặp EOF bất ngờ trong lúc nhập). Quá chuẩn.

> *"Here is how it all fits together:"*

```java
String readData(Scanner in) throws EOFException
{
    . . .
    while (. . .)
    {
        if (!in.hasNext()) // EOF encountered
        {
            if (n < len)
                throw new EOFException();
        }
        . . .
    }
    return s;
}
```

**Dịch:** Ghép lại thì code như trên. (Về `Scanner`, xem [[06 - Input and Output]]; về vòng `while`, xem [[07 - Control Flow]].)

> *"The EOFException has a second constructor that takes a string argument. You can put this to good use by describing the exceptional condition more carefully."*

```java
String gripe = "Content-length: " + len + ", Received: " + n;
throw new EOFException(gripe);
```

**Dịch:** `EOFException` có **constructor thứ hai nhận một string argument**. Bạn tận dụng nó để **mô tả tình huống ngoại lệ kỹ hơn**.

> *"As you can see, throwing an exception is easy if one of the existing exception classes works for you. In this case:"*
>
> *"1. Find an appropriate exception class."*
> *"2. Make an object of that class."*
> *"3. Throw it."*

**Dịch:** Throw exception rất dễ nếu **một trong các exception class có sẵn dùng được**. Khi đó:

1. **Tìm một exception class phù hợp.**
2. **Tạo object của class đó.**
3. **Throw nó.**

> *"Once a method throws an exception, it does not return to its caller. This means you do not have to worry about cooking up a default return value or an error code."*

**Dịch:** **Một khi method đã throw exception, nó không quay lại chỗ gọi nó.** Nghĩa là bạn **không phải bận tâm nghĩ ra giá trị trả về mặc định hay error code**.

> **C++ Note (sách):** *"Throwing an exception is the same in C++ and in Java, with one small difference. In Java, you can throw only objects of subclasses of Throwable. In C++, you can throw values of any type."*
>
> **Dịch:** Throw exception ở C++ và Java giống nhau, chỉ khác một chút: trong Java bạn **chỉ throw được object của subclass của `Throwable`**; trong C++ bạn **throw được giá trị của bất kỳ kiểu nào**.

---

## 7.1.4. Creating Exception Classes

> *"Your code may run into a problem which is not adequately described by any of the standard exception classes. In this case, it is easy enough to create your own exception class. Just derive it from Exception, or from a child class of Exception such as IOException. It is customary to give both a default constructor and a constructor that contains a detailed message. (The toString method of the Throwable superclass returns a string containing that detailed message, which is handy for debugging.)"*

```java
class FileFormatException extends IOException
{
    public FileFormatException() {}
    public FileFormatException(String gripe)
    {
        super(gripe);
    }
}
```

**Dịch:** Code của bạn có thể gặp vấn đề **không được exception class chuẩn nào mô tả cho đủ**. Khi đó **tự tạo exception class rất dễ**: chỉ cần **dẫn xuất nó từ `Exception`**, hoặc từ **một class con của `Exception`** như `IOException`. **Thông lệ là cung cấp cả một default constructor lẫn một constructor chứa detailed message.** (Method `toString` của superclass `Throwable` **trả về string chứa detailed message đó**, rất tiện khi debug.)

> *"Now you are ready to throw your very own exception type."*

```java
String readData(Scanner in) throws FileFormatException
{
    . . .
    while (. . .)
    {
        if (ch == -1) // EOF encountered
        {
            if (n < len)
                throw new FileFormatException();
        }
        . . .
    }
    return s;
}
```

**Dịch:** Giờ bạn đã sẵn sàng **throw kiểu exception của riêng mình**.

---

## API — `java.lang.Throwable` (Java 1.0)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `Throwable()` | dựng một object `Throwable` mới **không có detailed message**. |
| `Throwable(String message)` | dựng một object `Throwable` mới với detailed message được chỉ định. Theo quy ước, **mọi exception class dẫn xuất đều hỗ trợ cả default constructor lẫn constructor có detailed message**. |
| `String getMessage()` | lấy **detailed message** của object `Throwable`. |

---

## Bài kế tiếp

→ [[02 - Catching Exceptions]] — try/catch, catch nhiều exception, rethrow và chaining, `finally`, try-with-resources, phân tích stack trace.
