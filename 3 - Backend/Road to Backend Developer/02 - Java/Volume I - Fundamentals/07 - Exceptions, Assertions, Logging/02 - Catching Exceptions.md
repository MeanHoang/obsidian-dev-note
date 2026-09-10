# 02 — Catching Exceptions

> Chapter 7, Section 7.2 — Core Java Volume I, 13th Edition (Horstmann).
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 7.2. Catching Exceptions

> *"You now know how to throw an exception. It is pretty easy: You throw it and you forget it. Of course, some code has to catch the exception. Catching exceptions requires more planning. That's what the next sections will cover."*

**Dịch:** Giờ bạn đã biết cách **throw** exception. Khá dễ: **throw rồi quên nó đi**. Dĩ nhiên, **phải có đoạn code nào đó catch exception**. **Catch exception đòi hỏi tính toán nhiều hơn.** Đó là nội dung các mục sau.

---

## 7.2.1. Catching an Exception

> *"If an exception occurs that is not caught anywhere, the program will terminate and print a message to the console, giving the type of the exception and a stack trace. However, GUI programs may catch exceptions, print stack trace messages, and then go back to the user interface processing loop. (When you are debugging a GUI program, it is a good idea to keep the console on the screen and not minimized.)"*

**Dịch:** Nếu một exception xảy ra mà **không được catch ở đâu cả**, chương trình **sẽ kết thúc** và **in ra console** một thông báo kèm **kiểu exception và stack trace**. Tuy nhiên, chương trình GUI có thể catch exception, in stack trace, rồi **quay lại vòng lặp xử lý giao diện**. (Khi debug chương trình GUI, **nên để console hiện trên màn hình chứ đừng thu nhỏ**.)

> *"To catch an exception, set up a try/catch block. The simplest form of the try block is as follows:"*

```java
try
{
    code
    more code
    more code
}
catch (ExceptionType e)
{
    handler for this type
}
```

**Dịch:** Để catch một exception, hãy **dựng một block `try`/`catch`**. Dạng đơn giản nhất như trên.

> *"Suppose any code inside the try block throws an exception of the class specified in the catch clause, or its subclass. In that case:"*
>
> *"1. The program skips the remainder of the code in the try block."*
> *"2. The program executes the handler code inside the catch clause."*

**Dịch:** Giả sử code nào đó trong block `try` throw exception thuộc class ghi trong mệnh đề `catch`, **hoặc subclass của nó**. Khi đó:

1. Chương trình **bỏ qua phần code còn lại trong block `try`**.
2. Chương trình **chạy code handler trong mệnh đề `catch`**.

> *"If none of the code inside the try block throws an exception, then the program skips the catch clause."*
>
> *"If any of the code in a method throws an exception of a type other than the one named in the catch clause, this method exits immediately. (Hopefully, one of its callers has already provided a catch clause for that type.)"*

**Dịch:** Nếu **không đoạn code nào trong `try` throw exception**, chương trình **bỏ qua mệnh đề `catch`**.

Nếu code trong method throw exception **thuộc kiểu khác với kiểu ghi trong `catch`**, thì **method này thoát ngay lập tức**. (Hy vọng một trong những nơi gọi nó **đã có sẵn mệnh đề `catch` cho kiểu đó**.)

> *"To show this at work, here's some fairly typical code for reading in data:"*

```java
public void read(String filename)
{
    try
    {
        var in = new FileInputStream(filename);
        int b;
        while ((b = in.read()) != -1)
        {
            process input
        }
    }
    catch (IOException exception)
    {
        exception.printStackTrace();
    }
}
```

**Dịch:** Trên là đoạn code **khá điển hình để đọc data**.

> *"Notice that most of the code in the try clause is straightforward: It reads and processes bytes until it encounters the end of the file. As you can see by looking at the Java API, there is the possibility that the read method will throw an IOException. In that case, we skip out of the entire while loop, enter the catch clause, and generate a stack trace. For a toy program, that seems like a reasonable way to deal with this exception. What other choice do you have?"*

**Dịch:** Phần lớn code trong mệnh đề `try` rất thẳng thắn: **đọc và xử lý byte cho tới khi gặp end of file**. Nhìn Java API sẽ thấy method `read` **có khả năng throw `IOException`**. Khi đó ta **nhảy ra khỏi toàn bộ vòng `while`**, **vào mệnh đề `catch`**, và **sinh ra một stack trace**. Với chương trình đồ chơi thì đó là cách xử lý hợp lý. **Còn lựa chọn nào khác?**

### Hoặc là truyền exception lên trên

> *"Often, the best choice is to do nothing at all and simply pass the exception on to the caller. If an error occurs in the read method, let the caller of the read method worry about it! If we take that approach, then we have to advertise the fact that the method may throw an IOException."*

```java
public void read(String filename) throws IOException
{
    var in = new FileInputStream(filename);
    int b;
    while ((b = in.read()) != -1)
    {
        process input
    }
}
```

**Dịch:** Thường thì **lựa chọn tốt nhất là chẳng làm gì cả và cứ chuyển exception lên cho caller**. Nếu lỗi xảy ra trong method `read`, **để người gọi `read` lo!** Nếu theo hướng đó thì ta **phải khai báo rằng method có thể throw `IOException`**.

> *"Remember, the compiler strictly enforces the throws specifiers. If you call a method that throws a checked exception, you must either handle it or pass it on."*

**Dịch:** Nhớ rằng **compiler áp đặt `throws` specifier rất nghiêm**. Nếu bạn gọi một method throw checked exception thì **hoặc phải xử lý nó, hoặc phải chuyển nó lên trên**.

> *"Which of the two is better? As a general rule, you should catch those exceptions that you know how to handle and propagate those that you do not know how to handle."*

**Dịch:** Cách nào tốt hơn? Quy tắc chung: **catch những exception bạn biết cách xử lý, và propagate (đẩy lên) những exception bạn không biết cách xử lý**.

> *"When you propagate an exception, you must add a throws specifier to alert the caller that an exception may be thrown."*
>
> *"Look at the Java API documentation to see what methods throw which exceptions. Then decide whether you should handle them or add them to the throws list. There is nothing embarrassing about the latter choice. It is better to direct an exception to a competent handler than to squelch it."*

**Dịch:** Khi propagate một exception, bạn **phải thêm `throws` specifier** để **báo cho caller biết có thể có exception**.

Hãy xem tài liệu Java API để biết method nào throw exception nào, rồi quyết định nên xử lý hay đưa vào `throws` list. **Chọn cách sau chẳng có gì đáng xấu hổ.** **Dẫn exception tới một handler có năng lực còn hơn là bóp nghẹt nó.**

> *"However, when overriding a method, you are not allowed to add more throws specifiers to a subclass method than are present in the superclass method. Then you must catch the undeclared checked exceptions. In particular, if you override a method which throws no exceptions (such as compareTo in Comparable), then you have no choice but to catch each checked exception."*

**Dịch:** Tuy nhiên, khi **override một method**, bạn **không được thêm `throws` specifier vào method của subclass nhiều hơn method của superclass**. Khi đó bạn **buộc phải catch các checked exception không khai báo được**. Đặc biệt, nếu override một method **không throw exception nào** (như `compareTo` trong `Comparable`) thì bạn **không còn lựa chọn nào ngoài catch từng checked exception**.

> **C++ Note (sách):** *"Catching exceptions is almost the same in Java and in C++. Strictly speaking, the analog of"*
>
> ```java
> catch (Exception e) // Java
> ```
>
> *"is"*
>
> ```cpp
> catch (Exception& e) // C++
> ```
>
> *"There is no analog to the C++ catch (...). This is not needed in Java because all exceptions derive from a common superclass."*
>
> **Dịch:** Catch exception ở Java và C++ **gần như giống nhau**. Nói chặt chẽ, tương ứng của `catch (Exception e)` trong Java là `catch (Exception& e)` trong C++. **Không có thứ tương ứng với `catch (...)` của C++** — Java **không cần** vì **mọi exception đều dẫn xuất từ một superclass chung**.

> **Preview Note (sách):** *"Sometimes, you do not need the exception object in a catch clause. Starting in Java 21, as a preview feature, you can use an underscore as an unnamed variable:"*
>
> ```java
> catch (FileNotFoundException _)
> {
>     System.exit(0);
> }
> ```
>
> **Dịch:** Đôi khi bạn **không cần tới object exception trong mệnh đề `catch`**. **Từ Java 21**, dưới dạng **preview feature**, bạn dùng được **dấu gạch dưới làm unnamed variable**.

---

## 7.2.2. Catching Multiple Exceptions

> *"You can catch multiple exception types in a try block and handle each type differently. Use a separate catch clause for each type, as in the following example:"*

```java
try
{
    code that might throw exceptions
}
catch (FileNotFoundException e)
{
    emergency action for missing files
}
catch (UnknownHostException e)
{
    emergency action for unknown hosts
}
catch (IOException e)
{
    emergency action for all other I/O problems
}
```

**Dịch:** Bạn **catch được nhiều kiểu exception trong một block `try`** và **xử lý mỗi kiểu một khác**. Dùng **một mệnh đề `catch` riêng cho mỗi kiểu**.

> *"You need to order the catch clauses so that the more specific exception types come before the more general ones."*

**Dịch:** Bạn phải **sắp xếp các mệnh đề `catch` sao cho kiểu exception cụ thể hơn đứng trước kiểu tổng quát hơn**.

> *"The exception object may contain information about the nature of the exception. To find out more about the object, try"*
>
> ```java
> e.getMessage()
> ```
>
> *"to get the detailed error message (if there is one), or"*
>
> ```java
> e.getClass().getName()
> ```
>
> *"to get the actual type of the exception object."*

**Dịch:** Object exception có thể chứa **thông tin về bản chất của exception**. Muốn biết thêm về object, dùng `e.getMessage()` để lấy **detailed error message** (nếu có), hoặc `e.getClass().getName()` để lấy **kiểu thật sự của object exception**.

### Gộp nhiều kiểu vào một catch

> *"You can catch multiple exception types in the same catch clause. For example, suppose that the action for missing files and unknown hosts is the same. Then you can combine the catch clauses:"*

```java
try
{
    code that might throw exceptions
}
catch (FileNotFoundException | UnknownHostException e)
{
    emergency action for missing files and unknown hosts
}
catch (IOException e)
{
    emergency action for all other I/O problems
}
```

**Dịch:** Bạn **catch được nhiều kiểu exception trong cùng một mệnh đề `catch`**. Ví dụ nếu hành động cho **file thiếu** và **host không rõ** là như nhau thì **gộp các mệnh đề `catch` lại**.

> *"This feature is only needed when catching exception types that are not subclasses of one another."*

**Dịch:** Tính năng này **chỉ cần khi catch các kiểu exception không phải subclass của nhau**.

> *"When you catch multiple exceptions, the exception variable is implicitly final. For example, you cannot assign a different value to e in the body of the clause"*
>
> ```java
> catch (FileNotFoundException | UnknownHostException e) { . . . }
> ```

**Dịch:** Khi catch nhiều exception, **biến exception mặc nhiên là `final`**. Bạn **không gán được giá trị khác cho `e`** trong thân mệnh đề.

> *"Catching multiple exceptions doesn't just make your code look simpler but also more efficient. The generated bytecodes contain a single block for the shared catch clause."*

**Dịch:** Catch nhiều exception **không chỉ làm code trông gọn hơn mà còn hiệu quả hơn**: **bytecode sinh ra chỉ chứa một block duy nhất** cho mệnh đề `catch` dùng chung.

> **Caution (sách):** *"The type of the variable e is not the "union type" FileNotFoundException | UnknownHostException, even if your IDE reports it as such. Java variables cannot have such union types. The actual type of e is the least upper bound of those types; in this case, IOException."*
>
> *"In most cases, you don't care. But it matters if you analyze e with a switch. The obvious switch has a problem—it is not exhaustive:"*
>
> ```java
> catch (FileNotFoundException | UnknownHostException e)
> {
>     switch (e) // ERROR: not exhaustive
>     {
>         case FileNotFoundException fe -> . . .;
>         case UnknownHostException ue -> . . .;
>     }
>     . . .
> }
> ```
>
> *"You can fix the problem by adding a default clause. However, it might be clearer to reorganize the code and use separate catch clauses."*
>
> **Dịch:** Kiểu của biến `e` **không phải "union type"** `FileNotFoundException | UnknownHostException`, **kể cả khi IDE báo như vậy**. **Biến Java không có union type.** Kiểu thật của `e` là **least upper bound (cận trên nhỏ nhất) của các kiểu đó**; ở đây là **`IOException`**.
>
> Phần lớn trường hợp bạn chẳng bận tâm. Nhưng nó **quan trọng nếu bạn phân tích `e` bằng `switch`**: `switch` hiển nhiên như trên **có vấn đề — nó không exhaustive**. Sửa được bằng cách **thêm mệnh đề `default`**. Tuy nhiên, **sắp xếp lại code và dùng các mệnh đề `catch` riêng có khi rõ ràng hơn**. (Về `switch`, xem [[07 - Control Flow]].)

> **Caution (sách):** *"Catch clauses do not pay attention to sealed exception hierarchies. Suppose you provide"*
>
> ```java
> sealed abstract class DomainException extends Exception
>     permits FatalDomainException, SurvivableDomainException {}
> ```
>
> *"Then the catch clauses"*
>
> ```java
> try
> {
>     domainMethod(); // throws DomainException
> }
> catch (FatalDomainException e) { . . . }
> catch (SurvivableDomainException e) { . . . }
> ```
>
> *"are not sufficient, even though there can be no other checked exception instances."*
>
> **Dịch:** **Mệnh đề `catch` không để ý tới sealed exception hierarchy.** Giả sử bạn khai báo class `sealed` như trên; thì các mệnh đề `catch` trên **vẫn không đủ**, **dù không thể có instance checked exception nào khác**.

---

## 7.2.3. Rethrowing and Chaining Exceptions

> *"You can throw an exception in a catch clause. Typically, you do this when you want to change the exception type. If you build a subsystem that other programmers use, it makes a lot of sense to use an exception type that indicates a failure of the subsystem. An example of such an exception type is the ServletException. The code that executes a servlet may not want to know in minute detail what went wrong, but it definitely wants to know that the servlet was at fault."*

**Dịch:** Bạn **throw được exception ngay trong mệnh đề `catch`**. Thường bạn làm vậy khi muốn **đổi kiểu exception**. Nếu bạn xây một **subsystem** cho lập trình viên khác dùng thì **rất hợp lý khi dùng một kiểu exception chỉ ra rằng subsystem đã thất bại**. Ví dụ là `ServletException`: code chạy servlet **có thể không cần biết chi li chuyện gì đã hỏng**, nhưng **chắc chắn muốn biết lỗi nằm ở servlet**.

> *"Here is how you can catch an exception and rethrow it:"*

```java
try
{
    access the database
}
catch (SQLException e)
{
    throw new ServletException("database error: " + e.getMessage());
}
```

> *"Here, the ServletException is constructed with the message text of the exception."*

**Dịch:** Trên là cách **catch một exception rồi rethrow**. Ở đây `ServletException` được dựng với **phần text message của exception**.

### Tốt hơn: đặt exception gốc làm "cause"

> *"However, it is a better idea to set the original exception as the "cause" of the new exception:"*

```java
try
{
    access the database
}
catch (SQLException original)
{
    var e = new ServletException("database error", original);
    throw e;
}
```

**Dịch:** Tuy nhiên, **ý hay hơn là đặt exception gốc làm "cause" của exception mới**.

> *"The ServletException class has a constructor to which you can pass the cause. If you use an exception type for which that is not the case, you can instead call"*
>
> ```java
> e.initCause(original);
> ```
>
> *"When the exception is caught, the original exception can be retrieved:"*
>
> ```java
> Throwable original = caughtException.getCause();
> ```

**Dịch:** Class `ServletException` có **constructor nhận cause**. Nếu dùng kiểu exception không có constructor như vậy thì **gọi `e.initCause(original)`** thay thế. Khi exception được catch, **lấy lại được exception gốc** bằng `getCause()`.

> *"This wrapping technique is highly recommended. It allows you to throw high-level exceptions in subsystems without losing the details of the original failure."*

**Dịch:** **Kỹ thuật bọc (wrapping) này rất được khuyến nghị.** Nó cho phép bạn **throw exception cấp cao trong subsystem mà không mất chi tiết của thất bại gốc**.

> **Tip (sách):** *"The wrapping technique is also useful if a checked exception occurs in a method that is not allowed to throw a checked exception. You can catch the checked exception and wrap it into a runtime exception. As this situation often arises with input/output, the Java API provides an UncheckedIOException that you can use as a wrapper for the checked IOException."*
>
> **Dịch:** Kỹ thuật wrapping cũng hữu ích khi **checked exception xảy ra trong một method không được phép throw checked exception**. Bạn **catch checked exception rồi bọc nó vào một runtime exception**. Vì tình huống này hay gặp với input/output, Java API cung cấp sẵn **`UncheckedIOException`** để bọc `IOException` checked.

### Log rồi rethrow nguyên vẹn

> *"Sometimes, you just want to log an exception and rethrow it without any change:"*

```java
try
{
    access the database
}
catch (Exception e)
{
    logger.log(level, message, e);
    throw e;
}
```

**Dịch:** Đôi khi bạn **chỉ muốn log exception rồi rethrow nguyên vẹn**.

> *"There is a subtle point here. Suppose the code is inside a method"*
>
> ```java
> public void updateRecord() throws SQLException
> ```
>
> *"The Java compiler tracks the fact that e originates from the try block. Provided that the only checked exceptions in that block are SQLException instances, and provided that e is not changed in the catch block, it is valid to declare the enclosing method as throws SQLException."*

**Dịch:** Có một **điểm tinh tế** ở đây. Giả sử đoạn code nằm trong method `public void updateRecord() throws SQLException`. **Compiler Java theo dõi được rằng `e` bắt nguồn từ block `try`.** Miễn là **checked exception duy nhất trong block đó là `SQLException`**, và **`e` không bị thay đổi trong block `catch`**, thì **khai báo method bao ngoài là `throws SQLException` là hợp lệ**.

---

## 7.2.4. The finally Clause

> *"When your code throws an exception, it stops processing the remaining code in your method and exits the method. This is a problem if the method has acquired some local resource, which only this method knows about, and that resource must be cleaned up. One solution is to catch all exceptions, carry out the cleanup, and rethrow the exceptions. But this solution is tedious because you need to clean up the resource allocation in two places—in the normal code and in the exception code. The finally clause can solve this problem."*

**Dịch:** Khi code throw exception, nó **ngừng xử lý phần code còn lại và thoát khỏi method**. Đây là **vấn đề nếu method đã chiếm một tài nguyên cục bộ mà chỉ nó biết**, và tài nguyên đó **phải được dọn dẹp**. Một cách là **catch mọi exception, dọn dẹp, rồi rethrow**. Nhưng cách này **phiền phức** vì bạn phải **dọn tài nguyên ở hai chỗ** — ở code bình thường và ở code xử lý exception. **Mệnh đề `finally` giải quyết vấn đề này.**

> **Note (sách):** *"There is a more elegant solution, the try-with-resources statement that you will see in the following section. We discuss the finally mechanism in detail because it is the conceptual foundation. But in practice, you will use try-with-resources statements far more often than finally clauses."*
>
> **Dịch:** Có một **giải pháp thanh lịch hơn** là **try-with-resources**, sẽ thấy ở mục sau. Sách bàn kỹ về cơ chế `finally` vì đó là **nền tảng khái niệm**. Nhưng **trong thực tế bạn sẽ dùng try-with-resources nhiều hơn `finally` rất nhiều**.

> *"The code in the finally clause executes whether or not an exception was caught. In the following example, the program will close the input stream under all circumstances:"*

```java
var in = new FileInputStream(. . .);
try
{
    // 1
    code that might throw exceptions
    // 2
}
catch (IOException e)
{
    // 3
    show error message
    // 4
}
finally
{
    // 5
    in.close();
}
// 6
```

**Dịch:** Code trong mệnh đề `finally` **chạy bất kể exception có được catch hay không**. Trong ví dụ trên, chương trình **đóng input stream trong mọi hoàn cảnh**.

### Ba tình huống chạy finally

> *"Let us look at the three possible situations in which the program will execute the finally clause."*

> *"1. The code throws no exceptions. In this case, the program first executes all the code in the try block. Then, it executes the code in the finally clause. Afterwards, execution continues with the first statement after the finally clause. In other words, execution passes through points 1, 2, 5, and 6."*

**Dịch:** **1. Code không throw exception nào.** Chương trình chạy hết code trong block `try`, rồi chạy code trong `finally`, sau đó tiếp tục với câu lệnh đầu tiên sau `finally`. Tức là đi qua các điểm **1, 2, 5, 6**.

> *"2. The code throws an exception that is caught in a catch clause—in our case, an IOException. For this, the program executes all code in the try block, up to the point at which the exception was thrown. The remaining code in the try block is skipped. The program then executes the code in the matching catch clause, and then the code in the finally clause."*
>
> *"If the catch clause does not throw an exception, the program executes the first line after the finally clause. In this scenario, execution passes through points 1, 3, 4, 5, and 6."*
>
> *"If the catch clause throws an exception, then the exception is thrown back to the caller of this method, and execution passes through points 1, 3, and 5 only."*

**Dịch:** **2. Code throw một exception được catch trong mệnh đề `catch`** — ở đây là `IOException`. Chương trình chạy code trong `try` **tới điểm exception được throw**; phần còn lại trong `try` **bị bỏ qua**. Rồi chạy code trong **mệnh đề `catch` khớp**, rồi code trong `finally`.

- Nếu mệnh đề `catch` **không throw exception**: chương trình chạy tiếp dòng đầu tiên sau `finally`. Đi qua các điểm **1, 3, 4, 5, 6**.
- Nếu mệnh đề `catch` **có throw exception**: exception **được ném ngược lên caller** của method này, và chỉ đi qua các điểm **1, 3, 5**.

> *"3. The code throws an exception that is not caught in any catch clause. Here, the program executes all code in the try block until the exception is thrown. The remaining code in the try block is skipped. Then, the code in the finally clause is executed, and the exception is thrown back to the caller of this method. Execution passes through points 1 and 5 only."*

**Dịch:** **3. Code throw một exception không được catch ở mệnh đề `catch` nào.** Chương trình chạy code trong `try` cho tới khi exception được throw; phần còn lại bị bỏ qua. Rồi **code trong `finally` được chạy**, và **exception được ném ngược lên caller**. Chỉ đi qua các điểm **1 và 5**.

| Tình huống | Điểm đi qua |
|---|---|
| Không có exception | 1, 2, 5, 6 |
| Exception được catch, `catch` không throw | 1, 3, 4, 5, 6 |
| Exception được catch, `catch` có throw | 1, 3, 5 |
| Exception không được catch | 1, 5 |

### finally không cần catch

> *"You can use the finally clause without a catch clause. For example, consider the following try statement:"*

```java
InputStream in = . . .;
try
{
    code that might throw exceptions
}
finally
{
    in.close();
}
```

> *"The in.close() statement in the finally clause is executed whether or not an exception is encountered in the try block. Of course, if an exception is encountered, it is rethrown and must be caught in another catch clause."*

```java
InputStream in = . . .;
try
{
    try
    {
        code that might throw exceptions
    }
    finally
    {
        in.close();
    }
}
catch (IOException e)
{
    show error message
}
```

**Dịch:** **Dùng `finally` mà không có `catch` cũng được.** Câu lệnh `in.close()` trong `finally` **luôn chạy** bất kể block `try` có gặp exception hay không. Dĩ nhiên, nếu gặp exception thì **nó được rethrow và phải được catch ở một mệnh đề `catch` khác**.

> *"The inner try block has a single responsibility: to make sure that the input stream is closed. The outer try block has a single responsibility: to ensure that errors are reported. Not only is this solution clearer, it is also more functional: Errors in the finally clause are reported."*

**Dịch:** Block `try` **bên trong có một trách nhiệm duy nhất: đảm bảo input stream được đóng**. Block `try` **bên ngoài có một trách nhiệm duy nhất: đảm bảo lỗi được báo cáo**. Giải pháp này **không chỉ rõ ràng hơn mà còn đầy đủ chức năng hơn: lỗi phát sinh trong chính mệnh đề `finally` cũng được báo cáo**.

> **Caution (sách):** *"A finally clause can yield unexpected results when it contains return statements. Suppose you exit the middle of a try block with a return statement. Before the method returns, the finally block is executed. If the finally block also contains a return statement, then it masks the original return value. Consider this example:"*
>
> ```java
> public static int parseInt(String s)
> {
>     try
>     {
>         return Integer.parseInt(s);
>     }
>     finally
>     {
>         return 0; // ERROR
>     }
> }
> ```
>
> *"It looks as if in the call parseInt("42"), the body of the try block returns the integer 42. However, the finally clause is executed before the method actually returns and causes the method to return 0, ignoring the original return value."*
>
> *"And it gets worse. Consider the call parseInt("zero"). The Integer.parseInt method throws a NumberFormatException. Then the finally clause is executed, and the return statement swallows the exception!"*
>
> *"The body of the finally clause is intended for cleaning up resources. Don't put statements that change the control flow (return, throw, break, continue) inside a finally clause."*
>
> **Dịch:** Mệnh đề `finally` **có thể cho kết quả bất ngờ khi nó chứa câu lệnh `return`**. Giả sử bạn thoát giữa chừng block `try` bằng `return`. **Trước khi method thật sự trả về, block `finally` được chạy.** Nếu block `finally` **cũng có `return`** thì nó **che mất giá trị trả về gốc**.
>
> Trông thì có vẻ khi gọi `parseInt("42")`, thân block `try` trả về **42**. Nhưng mệnh đề `finally` chạy **trước khi method thực sự trả về**, khiến method **trả về 0**, **bỏ qua giá trị trả về gốc**.
>
> **Còn tệ hơn nữa.** Xét lời gọi `parseInt("zero")`: `Integer.parseInt` throw `NumberFormatException`. Rồi mệnh đề `finally` chạy, và **câu lệnh `return` nuốt luôn exception!**
>
> **Thân mệnh đề `finally` là để dọn dẹp tài nguyên.** **Đừng đặt các câu lệnh đổi luồng điều khiển (`return`, `throw`, `break`, `continue`) vào trong `finally`.** (Về `break`, `continue`, xem [[07 - Control Flow]].)

---

## 7.2.5. The try-with-Resources Statement

> *"There is a useful shortcut to the code pattern"*

```java
open a resource
try
{
    work with the resource
}
finally
{
    close the resource
}
```

> *"provided the resource belongs to a class that implements the AutoCloseable interface. That interface has a single method"*

```java
void close() throws Exception
```

**Dịch:** Có một **lối tắt hữu ích** cho mẫu code trên, **với điều kiện tài nguyên thuộc một class implement interface `AutoCloseable`**. Interface đó **chỉ có một method** là `void close() throws Exception`.

> **Note (sách):** *"There is also a Closeable interface. It is a subinterface of AutoCloseable, also with a single close method. However, that method is declared to throw an IOException."*
>
> **Dịch:** Còn có interface **`Closeable`**. Nó là **subinterface của `AutoCloseable`**, cũng chỉ có một method `close`. Nhưng method đó **được khai báo là throw `IOException`**.

> *"In its simplest variant, the try-with-resources statement has the form"*

```java
try (Resource res = . . .)
{
    work with res
}
```

> *"When the try block exits, then res.close() is called automatically. Here is a typical example—reading all words of a file:"*

```java
try (var in = new Scanner(Path.of("in.txt")))
{
    while (in.hasNext())
        System.out.println(in.next());
}
```

**Dịch:** Ở dạng đơn giản nhất, câu lệnh try-with-resources có dạng trên. **Khi block `try` thoát ra thì `res.close()` được gọi tự động.** Ví dụ điển hình: **đọc mọi từ trong một file**.

> *"When the block exits normally, or when there was an exception, the in.close() method is called, exactly as if you had used a finally block."*

**Dịch:** Dù block thoát bình thường hay có exception, method `in.close()` **đều được gọi**, **y hệt như khi bạn dùng block `finally`**.

### Nhiều resource

> *"You can specify multiple resources. For example,"*

```java
try (var in = new Scanner(Path.of("in.txt"));
     var out = new PrintWriter("out.txt"))
{
    while (in.hasNext())
        out.println(in.next().toUpperCase());
}
```

> *"No matter how the block exits, both in and out are closed. If you programmed this by hand, you would have needed two nested try/finally statements."*

**Dịch:** Bạn **chỉ định được nhiều resource**. Dù block thoát ra kiểu gì, **cả `in` lẫn `out` đều được đóng**. Nếu tự viết tay, bạn **sẽ cần hai câu lệnh `try`/`finally` lồng nhau**.

> *"You can provide previously declared effectively final variables in the try header:"*

```java
public static void printAll(String[] lines, PrintWriter out)
{
    try (out) // effectively final variable
    {
        for (String line : lines)
            out.println(line);
    } // out.close() called here
}
```

> *"This is not common, since one generally prefers to invoke close in the same scope in which the object was constructed."*

**Dịch:** Bạn **đưa được vào header của `try` những biến effectively final đã khai báo trước đó**. Chuyện này **không phổ biến**, vì người ta thường **thích gọi `close` trong cùng scope nơi object được dựng**.

### Suppressed exception

> *"A difficulty arises when the try block throws an exception and the close method also throws an exception. The try-with-resources statement handles this situation quite elegantly. The original exception is rethrown, and any exceptions thrown by close methods are considered "suppressed." They are automatically caught and added to the original exception with the addSuppressed method. If you are interested in them, call the getSuppressed method which yields an array of the suppressed expressions from close methods."*

**Dịch:** Khó khăn nảy sinh khi **block `try` throw exception và method `close` cũng throw exception**. Câu lệnh try-with-resources **xử lý tình huống này khá thanh lịch**: **exception gốc được rethrow**, còn **mọi exception do method `close` throw ra bị coi là "suppressed" (bị nén)**. Chúng **tự động được catch và thêm vào exception gốc bằng method `addSuppressed`**. Nếu quan tâm, gọi **`getSuppressed`** để lấy **mảng các exception bị nén từ các method `close`**.

> *"You don't want to program this by hand. Use the try-with-resources statement whenever you need to close a resource."*

**Dịch:** Bạn **không muốn tự lập trình chuyện này bằng tay đâu**. **Hãy dùng try-with-resources mỗi khi cần đóng một resource.**

> **Note (sách):** *"A try-with-resources statement can itself have catch clauses and even a finally clause. These are executed after closing the resources."*
>
> **Dịch:** Bản thân câu lệnh try-with-resources **có thể có mệnh đề `catch` và cả `finally`**. Chúng **được chạy sau khi các resource đã được đóng**.

---

## 7.2.6. Analyzing Stack Trace Elements

> *"A stack trace is a listing of all pending method calls at a particular point in the execution of a program. You have almost certainly seen stack trace listings—they are displayed whenever a Java program terminates with an uncaught exception."*

**Dịch:** **Stack trace là danh sách mọi lời gọi method đang chờ (pending) tại một thời điểm nhất định trong quá trình thực thi chương trình.** Bạn gần như chắc chắn đã thấy stack trace — chúng **hiện ra mỗi khi chương trình Java kết thúc vì một exception không được catch**.

> *"You can access the text description of a stack trace by calling the printStackTrace method of the Throwable class."*

```java
var t = new Throwable();
var out = new StringWriter();
t.printStackTrace(new PrintWriter(out));
String description = out.toString();
```

**Dịch:** Bạn **lấy được phần mô tả dạng text của stack trace** bằng cách gọi method **`printStackTrace`** của class `Throwable`.

> *"A more flexible approach is the StackWalker class that yields a stream of StackWalker.StackFrame instances, each describing one stack frame. You can iterate over the stack frames with this call:"*

```java
StackWalker walker = StackWalker.getInstance();
walker.forEach(frame -> analyze frame)
```

> *"If you want to process the Stream<StackWalker.StackFrame> lazily, call"*

```java
walker.walk(stream -> process stream)
```

> *"Stream processing is described in detail in Chapter 1 of Volume II."*

**Dịch:** Cách **linh hoạt hơn** là class **`StackWalker`**, cho ra **một stream các instance `StackWalker.StackFrame`**, mỗi cái **mô tả một stack frame**. Muốn xử lý `Stream<StackWalker.StackFrame>` một cách **lazy** thì gọi `walker.walk(...)`. Xử lý stream được nói kỹ ở **Chapter 1 của Volume II**.

> *"The StackWalker.StackFrame class has methods to obtain the file name and line number, as well as the class object and method name, of the executing line of code. The toString method yields a formatted string containing all of this information."*

**Dịch:** Class `StackWalker.StackFrame` có các method để lấy **tên file và số dòng**, cũng như **object class và tên method** của dòng code đang chạy. Method `toString` cho ra **một string đã định dạng chứa toàn bộ thông tin đó**.

> **Note (sách):** *"The Throwable.getStackTrace method yields a StackTraceElement[] array with similar information as the stream of StackWalker.StackFrame instances. However, that call is less efficient since it captures the entire stack even though the caller may only need a few frames, and it only provides access to the class names, but not the class objects, of the pending methods."*
>
> **Dịch:** Method `Throwable.getStackTrace` cho ra mảng **`StackTraceElement[]`** với thông tin tương tự stream các `StackWalker.StackFrame`. Tuy nhiên lời gọi đó **kém hiệu quả hơn** vì nó **chụp lại toàn bộ stack** dù caller có khi chỉ cần vài frame, và nó **chỉ cho truy cập tên class chứ không cho object class** của các method đang chờ.

### Ví dụ output

> *"Listing 7.1 prints the stack trace of a recursive factorial function. For example, if you compute factorial(3), the printout is"*

```
factorial(3):
stackTrace.StackTraceTest.factorial(StackTraceTest.java:20)
stackTrace.StackTraceTest.main(StackTraceTest.java:36)
factorial(2):
stackTrace.StackTraceTest.factorial(StackTraceTest.java:20)
stackTrace.StackTraceTest.factorial(StackTraceTest.java:26)
stackTrace.StackTraceTest.main(StackTraceTest.java:36)
factorial(1):
stackTrace.StackTraceTest.factorial(StackTraceTest.java:20)
stackTrace.StackTraceTest.factorial(StackTraceTest.java:26)
stackTrace.StackTraceTest.factorial(StackTraceTest.java:26)
stackTrace.StackTraceTest.main(StackTraceTest.java:36)
return 1
return 2
return 6
```

**Dịch:** Listing 7.1 **in ra stack trace của một hàm giai thừa đệ quy**. Ví dụ khi tính `factorial(3)` thì output như trên.

### Listing 7.1 — `stackTrace/StackTraceTest.java`

```java
package stackTrace;

import java.util.*;

/**
 * A program that displays a trace feature of a recursive method call.
 * @version 1.10 2017-12-14
 * @author Cay Horstmann
 */
public class StackTraceTest
{
    /**
     * Computes the factorial of a number
     * @param n a non-negative integer
     * @return n! = 1 * 2 * . . . * n
     */
    public static int factorial(int n)
    {
        System.out.println("factorial(" + n + "):");
        var walker = StackWalker.getInstance();
        walker.forEach(System.out::println);
        int r;
        if (n <= 1) r = 1;
        else r = n * factorial(n - 1);
        System.out.println("return " + r);
        return r;
    }

    public static void main(String[] args)
    {
        try (var in = new Scanner(System.in))
        {
            System.out.print("Enter n: ");
            int n = in.nextInt();
            factorial(n);
        }
    }
}
```

(Về comment tài liệu `/** ... */` và tag `@param`, `@return`, xem [[10 - Documentation Comments]]; về [[08 - Packages|package]].)

---

## API — `java.lang.Throwable` (Java 1.0)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `Throwable(Throwable cause)` **1.4**<br>`Throwable(String message, Throwable cause)` **1.4** | dựng một `Throwable` với một **cause** cho trước. |
| `Throwable initCause(Throwable cause)` **1.4** | đặt cause cho object này, **hoặc throw một exception nếu object này đã có cause rồi**. Trả về `this`. |
| `Throwable getCause()` **1.4** | lấy object exception đã được đặt làm cause cho object này, hoặc **`null` nếu chưa đặt cause nào**. |
| `StackTraceElement[] getStackTrace()` **1.4** | lấy **trace của call stack tại thời điểm object này được dựng**. |
| `void addSuppressed(Throwable t)` **7** | thêm một exception **"suppressed"** vào exception này. Chuyện này xảy ra trong câu lệnh try-with-resources, khi `t` là exception được throw bởi một method `close`. |
| `Throwable[] getSuppressed()` **7** | lấy **mọi exception "suppressed"** của exception này. Thường đó là các exception do method `close` throw ra trong câu lệnh try-with-resources. |

## API — `java.lang.Exception` (Java 1.0)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `Exception(Throwable cause)` **1.4**<br>`Exception(String message, Throwable cause)` | dựng một `Exception` với một cause cho trước. |

## API — `java.lang.RuntimeException` (Java 1.0)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `RuntimeException(Throwable cause)` **1.4**<br>`RuntimeException(String message, Throwable cause)` **1.4** | dựng một `RuntimeException` với một cause cho trước. |

## API — `java.lang.StackWalker` (Java 9)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `static StackWalker getInstance()`<br>`static StackWalker getInstance(StackWalker.Option option)`<br>`static StackWalker getInstance(Set<StackWalker.Option> options)` | lấy một instance `StackWalker`. Các option gồm `RETAIN_CLASS_REFERENCE`, `SHOW_HIDDEN_FRAMES`, và `SHOW_REFLECT_FRAMES` từ enumeration `StackWalker.Option`. |
| `forEach(Consumer<? super StackWalker.StackFrame> action)` | thực hiện action cho trước **trên từng stack frame**, bắt đầu từ method được gọi gần nhất. |
| `walk(Function<? super Stream<StackWalker.StackFrame>,? extends T> function)` | áp dụng function cho trước lên **stream các stack frame** và trả về kết quả của function. |

## API — `java.lang.StackWalker.StackFrame` (Java 9)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `String getFileName()` | lấy **tên file nguồn** chứa điểm thực thi của element này, hoặc `null` nếu không có thông tin. |
| `int getLineNumber()` | lấy **số dòng** trong file nguồn chứa điểm thực thi của element này, hoặc `-1` nếu không có thông tin. |
| `String getClassName()` | lấy **fully qualified name của class** có method chứa điểm thực thi của element này. |
| `Class<?> getDeclaringClass()` | lấy **object `Class`** của method chứa điểm thực thi. **Một exception được throw nếu stack walker không được dựng với option `RETAIN_CLASS_REFERENCE`.** |
| `String getMethodName()` | lấy **tên method** chứa điểm thực thi. Tên của constructor là **`<init>`**, tên của static initializer là **`<clinit>`**. **Không phân biệt được các method overload cùng tên.** |
| `boolean isNativeMethod()` | trả về `true` nếu điểm thực thi của element này **nằm trong một native method**. |
| `String toString()` | trả về **một string đã định dạng** chứa tên class, tên method, tên file và số dòng nếu có. |

## API — `java.lang.StackTraceElement` (Java 1.4)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `String getFileName()` | lấy tên file nguồn chứa điểm thực thi của element này, hoặc `null` nếu không có thông tin. |
| `int getLineNumber()` | lấy số dòng trong file nguồn chứa điểm thực thi, hoặc `-1` nếu không có thông tin. |
| `String getClassName()` | lấy **fully qualified name của class** chứa điểm thực thi của element này. |
| `String getMethodName()` | lấy tên method chứa điểm thực thi. Tên của constructor là `<init>`, tên của static initializer là `<clinit>`. Không phân biệt được các method overload cùng tên. |
| `boolean isNativeMethod()` | trả về `true` nếu điểm thực thi nằm trong một native method. |
| `String toString()` | trả về một string đã định dạng chứa tên class, tên method, tên file và số dòng nếu có. |

---

## Bài kế tiếp

→ [[03 - Tips for Using Exceptions]] — tám lời khuyên của sách về cách dùng exception cho đúng.
