# 03 — Tips for Using Exceptions

> Chapter 7, Section 7.3 — Core Java Volume I, 13th Edition (Horstmann).
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 7.3. Tips for Using Exceptions

> *"There is a certain amount of controversy about the proper use of exceptions. Some programmers believe that all checked exceptions are a nuisance, others can't seem to throw enough of them. I think that exceptions (even checked exceptions) have their place, so I offer you these tips for their proper use."*

**Dịch:** Có **kha khá tranh cãi** về việc dùng exception thế nào cho đúng. Có lập trình viên cho rằng **mọi checked exception đều phiền toái**, người khác thì **throw bao nhiêu cũng chưa đủ**. Tác giả cho rằng exception (kể cả checked exception) **đều có chỗ đứng của nó**, nên đưa ra những lời khuyên sau về cách dùng cho đúng.

---

## 1. Exception handling không phải để thay cho một phép kiểm tra đơn giản

> *"Exception handling is not supposed to replace a simple test."*
>
> *"As an example of this, here's code that tries 10,000,000 times to pop an empty stack. It first does this by finding out whether the stack is empty."*

```java
if (!s.empty()) s.pop();
```

> *"Next, we force it to pop the stack no matter what and catch the EmptyStackException that tells us we should not have done that."*

```java
try
{
    s.pop();
}
catch (EmptyStackException e)
{
}
```

> *"On my test machine, the version that calls isEmpty ran in 0.167 seconds. The version that catches the EmptyStackException ran in 3.629 seconds."*
>
> *"As you can see, it took far longer to catch an exception than to perform a simple test. The moral is: Use exceptions for exceptional circumstances only."*

**Dịch:** Ví dụ minh hoạ: đoạn code thử **pop một stack rỗng 10.000.000 lần**. Cách đầu là **kiểm tra xem stack có rỗng không**. Cách sau là **cứ pop bừa** rồi **catch `EmptyStackException`** — thứ báo cho ta biết lẽ ra không nên làm vậy.

Trên máy test của tác giả, **bản gọi `isEmpty` chạy hết 0,167 giây**, còn **bản catch `EmptyStackException` chạy hết 3,629 giây**.

Như bạn thấy, **catch một exception tốn thời gian hơn nhiều so với làm một phép kiểm tra đơn giản**. Bài học rút ra: **chỉ dùng exception cho những tình huống ngoại lệ thật sự**.

---

## 2. Đừng quản lý exception ở mức vi mô

> *"Do not micromanage exceptions."*
>
> *"Some programmers wrap every statement in a separate try block."*

```java
PrintStream out;
Stack s;
for (i = 0; i < 100; i++)
{
    try
    {
        n = s.pop();
    }
    catch (EmptyStackException e)
    {
        // stack was empty
    }
    try
    {
        out.writeInt(n);
    }
    catch (IOException e)
    {
        // problem writing to file
    }
}
```

**Dịch:** Có lập trình viên **bọc từng câu lệnh trong một block `try` riêng**.

> *"This approach blows up your code dramatically. Think about the task that you want the code to accomplish. Here, we want to pop 100 numbers off a stack and save them to a file. (Never mind why—it is just a toy example.) There is nothing we can do if a problem rears its ugly head. If the stack is empty, it will not become occupied. If the file contains an error, the error will not magically go away. It therefore makes sense to wrap the entire task in a try block. If any one operation fails, you can then abandon the task."*

```java
try
{
    for (i = 0; i < 100; i++)
    {
        n = s.pop();
        out.writeInt(n);
    }
}
catch (IOException e)
{
    // problem writing to file
}
catch (EmptyStackException e)
{
    // stack was empty
}
```

**Dịch:** Cách làm đó **thổi phồng code lên khủng khiếp**. Hãy nghĩ về **nhiệm vụ mà code cần hoàn thành**: ở đây là **pop 100 số khỏi stack và lưu vào file**. (Đừng bận tâm để làm gì — chỉ là ví dụ đồ chơi.) **Chẳng làm được gì nếu sự cố ló mặt ra**: stack đã rỗng thì **không tự dưng đầy lại**; file có lỗi thì **lỗi không tự nhiên biến mất**. Vì vậy **bọc cả nhiệm vụ trong một block `try` là hợp lý**. Nếu **bất kỳ thao tác nào thất bại**, bạn **bỏ luôn cả nhiệm vụ**.

> *"This code looks much cleaner. It fulfills one of the promises of exception handling: to separate normal processing from error handling."*

**Dịch:** Code này **trông sạch hơn nhiều**. Nó thực hiện đúng **một trong các lời hứa của exception handling: tách xử lý bình thường khỏi xử lý lỗi**.

---

## 3. Tận dụng tốt exception hierarchy

> *"Make good use of the exception hierarchy."*
>
> *"Don't just throw an Exception or RuntimeException. Find an appropriate subclass or create your own."*
>
> *"Don't just catch Exception. It makes your code hard to read and maintain. Catch only those exception classes that you expect. And don't catch Throwable. You might hide an OutOfMemoryError."*

**Dịch:** **Đừng cứ thế throw `Exception` hay `RuntimeException`.** Hãy **tìm một subclass phù hợp hoặc tự tạo class của mình**.

**Đừng cứ thế catch `Exception`** — nó làm code **khó đọc và khó bảo trì**. Chỉ catch **những class exception mà bạn thực sự lường trước**. Và **đừng catch `Throwable`**: bạn **có thể che giấu mất một `OutOfMemoryError`**.

> *"Respect the difference between checked and unchecked exceptions. Checked exceptions are inherently burdensome—don't throw them for logic errors. (For example, the reflection library gets this wrong. Callers often need to catch exceptions that they know can never happen.)"*

**Dịch:** **Tôn trọng sự khác biệt giữa checked và unchecked exception.** Checked exception **vốn dĩ đã nặng nề** — **đừng throw chúng cho lỗi logic**. (Ví dụ, **thư viện reflection làm sai chuyện này**: caller thường **phải catch những exception mà họ biết chắc không bao giờ xảy ra**.)

> *"Do not hesitate to turn an exception into another exception that is more appropriate. For example, when you parse an integer in a file, catch the NumberFormatException and set it as the cause of a subclass of IOException or MySubsystemException."*

**Dịch:** **Đừng ngần ngại biến một exception thành một exception khác phù hợp hơn.** Ví dụ khi parse một số nguyên trong file, hãy **catch `NumberFormatException` rồi đặt nó làm cause** của một subclass của `IOException` hoặc `MySubsystemException`. (Về cơ chế cause, xem [[02 - Catching Exceptions#7.2.3. Rethrowing and Chaining Exceptions]].)

---

## 4. Đừng bóp nghẹt exception

> *"Do not squelch exceptions."*
>
> *"In Java, there is a tremendous temptation to shut up exceptions. If you're writing a method that calls a method that might throw an exception once a century, the compiler whines because you have not declared the exception in the throws list of your method. You do not want to put it in the throws list because then the compiler will whine about all the methods that call your method. So you just shut it up:"*

```java
public Image loadImage(String s)
{
    try
    {
        code that threatens to throw checked exceptions
    }
    catch (Exception e)
    {} // so there
}
```

**Dịch:** Trong Java có **một cám dỗ cực lớn là bịt miệng exception**. Nếu bạn viết một method gọi tới một method **cả thế kỷ mới throw exception một lần**, compiler sẽ **rên rỉ** vì bạn **không khai báo exception đó trong `throws` list**. Bạn **không muốn đưa nó vào `throws` list** vì rồi compiler sẽ **rên rỉ tiếp về mọi method gọi tới method của bạn**. Thế là bạn **bịt miệng nó luôn**.

> *"Now your code will compile without a hitch. It will run fine, except when an exception occurs. Then, the exception will be silently ignored. If you believe that exceptions are at all important, you should make some effort to handle them right."*

**Dịch:** Giờ code **compile trơn tru**. Nó **chạy ổn — trừ khi có exception xảy ra**. Khi đó **exception bị lờ đi trong im lặng**. Nếu bạn tin rằng exception **có chút quan trọng nào**, bạn **nên bỏ chút công sức xử lý chúng cho đúng**.

---

## 5. Khi phát hiện lỗi, "tough love" hiệu quả hơn nuông chiều

> *"When you detect an error, "tough love" works better than indulgence."*
>
> *"Some programmers worry about throwing exceptions when they detect errors. Maybe it would be better to return a dummy value rather than throw an exception when a method is called with invalid arguments? For example, should Stack.pop return null, or throw an exception when a stack is empty? I think it is better to throw an EmptyStackException at the point of failure than to have a NullPointerException occur at later time."*

**Dịch:** Có lập trình viên **lo lắng khi phải throw exception lúc phát hiện lỗi**. Liệu **trả về một giá trị giả (dummy value)** có tốt hơn throw exception khi method bị gọi với argument không hợp lệ? Ví dụ, `Stack.pop` nên **trả về `null`** hay **throw exception** khi stack rỗng? Tác giả cho rằng **throw `EmptyStackException` ngay tại điểm thất bại thì tốt hơn** là để một **`NullPointerException` xảy ra vào lúc nào đó sau này**. (Về `NullPointerException`, xem [[03 - Defining Your Own Classes]].)

---

## 6. Propagate exception không phải điều đáng xấu hổ

> *"Propagating exceptions is not a sign of shame."*
>
> *"Some programmers feel compelled to catch all exceptions that are thrown. If they call a method that throws an exception, such as the FileInputStream constructor or the readLine method, they instinctively catch the exception that may be generated. In many situations, it is actually better to propagate the exception instead of catching it:"*

```java
public void readStuff(String filename) throws IOException // not a sign of shame!
{
    var in = new FileInputStream(filename);
    . . .
}
```

**Dịch:** Có lập trình viên **cảm thấy buộc phải catch mọi exception được throw ra**. Khi gọi một method throw exception — như **constructor của `FileInputStream`** hay **method `readLine`** — họ **theo bản năng catch ngay exception có thể sinh ra**. Trong nhiều tình huống, **propagate exception thực ra tốt hơn là catch nó**.

> *"Higher-level methods are often better equipped to inform the user of errors or to abandon unsuccessful commands."*

**Dịch:** **Các method ở tầng cao hơn thường được trang bị tốt hơn** để **báo lỗi cho người dùng** hoặc **huỷ bỏ những lệnh không thành công**.

---

## 7. Dùng các method chuẩn để báo lỗi null-pointer và out-of-bounds

> *"Use standard methods for reporting null-pointer and out-of-bounds exceptions."*
>
> *"The Objects class has methods"*

```java
requireNonNull
checkIndex
checkFromToIndex
checkFromIndexSize
```

> *"for these common checks. Use them for parameter validation:"*

```java
public void putData(int position, Object newValue)
{
    Objects.checkIndex(position, data.length);
    Objects.requireNonNull(newValue);
    . . .
}
```

> *"If the method is called with an invalid index or a null argument, an exception is thrown, using the familiar message that the Java library uses."*

**Dịch:** Class `Objects` có sẵn các method trên **cho những phép kiểm tra thường gặp này**. Hãy **dùng chúng để validate parameter**. Nếu method bị gọi với **index không hợp lệ** hoặc **argument null**, một exception sẽ được throw, **dùng đúng thông báo quen thuộc mà thư viện Java vẫn dùng**.

---

## 8. Đừng hiện stack trace cho người dùng cuối

> *"Don't show stack traces to end users."*
>
> *"If your program encounters an unexpected exception, it may seem a good idea to display the stack trace so the users can report it, making it easier for you to pinpoint the issue. However, stack traces can contain implementation details that you do not want to reveal to potential attackers, such as the versions of libraries that you are using."*
>
> *"Log the stack trace so that you can retrieve it, but only display a summary message to your users."*

**Dịch:** Nếu chương trình gặp một exception ngoài dự kiến, **hiện stack trace ra cho người dùng báo lại** nghe có vẻ là ý hay, giúp bạn **khoanh vùng vấn đề dễ hơn**. Tuy nhiên, **stack trace có thể chứa chi tiết implementation mà bạn không muốn lộ cho kẻ tấn công tiềm tàng**, ví dụ **phiên bản các thư viện bạn đang dùng**.

**Hãy log stack trace lại để bạn truy xuất được, còn với người dùng thì chỉ hiện một thông báo tóm tắt.**

---

> **Note (sách):** *"Rules 5 and 6 can be summarized as "throw early, catch late.""*
>
> **Dịch:** Quy tắc 5 và 6 tóm gọn lại thành: **"throw sớm, catch muộn"**.

---

## Bài kế tiếp

→ [[04 - Using Assertions]] — cơ chế `assert`, cách bật/tắt, và khi nào nên dùng assertion thay vì exception.
