# 04 — Using Assertions

> Chapter 7, Section 7.4 — Core Java Volume I, 13th Edition (Horstmann).
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 7.4. Using Assertions

> *"Assertions are a commonly used idiom of defensive programming. In the following sections, you will learn how to use them effectively."*

**Dịch:** **Assertion là một lối viết quen thuộc của defensive programming** (lập trình phòng thủ). Các mục sau sẽ chỉ cách **dùng chúng cho hiệu quả**.

---

## 7.4.1. The Assertion Concept

> *"Suppose you are convinced that a particular property is fulfilled, and you rely on that property in your code. For example, you may be computing"*

```java
double y = Math.sqrt(x);
```

> *"You are certain that x is not negative. Perhaps it is the result of another computation that can't have a negative result, or it is a parameter of a method that requires its callers to supply only positive inputs. Still, you want to double-check rather than allow confusing "not a number" floating-point values creep into your computation."*

**Dịch:** Giả sử bạn **đinh ninh rằng một tính chất nào đó được thoả mãn**, và **code của bạn dựa vào tính chất đó**. Ví dụ khi tính `Math.sqrt(x)`, bạn **chắc chắn `x` không âm** — có thể vì nó là **kết quả của một phép tính không thể ra giá trị âm**, hoặc là **parameter của một method yêu cầu caller chỉ đưa vào input dương**. Dù vậy bạn vẫn muốn **kiểm tra lại cho chắc**, thay vì để những **giá trị floating-point "not a number" khó hiểu len lỏi vào phép tính**. (Về floating-point và `NaN`, xem [[02 - Data Types]].)

> *"You could, of course, throw an exception:"*

```java
if (x < 0) throw new IllegalArgumentException("x < 0");
```

> *"But this code stays in the program, even after testing is complete. If you have lots of checks of this kind, the program may run quite a bit slower than it should."*
>
> *"The assertion mechanism allows you to put in checks during testing and to have them automatically removed in the production code."*

**Dịch:** Dĩ nhiên bạn **throw exception được**. Nhưng **đoạn code đó nằm lại trong chương trình, kể cả sau khi đã test xong**. Nếu có **rất nhiều phép kiểm tra kiểu này**, chương trình có thể **chạy chậm hơn đáng kể so với mức đáng ra phải có**.

**Cơ chế assertion cho phép bạn đặt các phép kiểm tra vào lúc test, rồi chúng được tự động gỡ bỏ trong code production.**

### Hai dạng của `assert`

> *"The Java language has a keyword assert. There are two forms:"*

```java
assert condition;
```

> *"and"*

```java
assert condition : expression;
```

> *"Both statements evaluate the condition and throw an AssertionError if it is false. In the second statement, the expression is passed to the constructor of the AssertionError object and turned into a message string."*

**Dịch:** Ngôn ngữ Java có **keyword `assert`**, với **hai dạng** như trên. **Cả hai câu lệnh đều tính giá trị của `condition` và throw một `AssertionError` nếu nó là `false`.** Ở dạng thứ hai, **`expression` được truyền vào constructor của object `AssertionError` và biến thành một message string**.

> **Note (sách):** *"The sole purpose of the expression part is to produce a message string. The AssertionError object does not store the actual expression value, so you can't query it later. As the JDK documentation states, doing so "would encourage programmers to attempt to recover from assertion failure, which defeats the purpose of the facility.""*
>
> **Dịch:** **Mục đích duy nhất của phần `expression` là sinh ra một message string.** Object `AssertionError` **không lưu giá trị thật của expression**, nên **bạn không truy vấn lại nó được về sau**. Như tài liệu JDK nói, làm vậy **"sẽ khuyến khích lập trình viên tìm cách phục hồi sau khi assertion thất bại, mà điều đó thì đi ngược lại mục đích của cơ chế này"**.

> *"To assert that x is non-negative, you can simply use the statement"*

```java
assert x >= 0;
```

> *"Or you can pass the actual value of x into the AssertionError object, so that it gets displayed later."*

```java
assert x >= 0 : x;
```

**Dịch:** Để khẳng định `x` **không âm**, chỉ cần dùng `assert x >= 0;`. Hoặc **truyền giá trị thật của `x` vào object `AssertionError`** để nó **được hiển thị về sau**.

> **C++ Note (sách):** *"The assert macro of the C language turns the assertion condition into a string that is printed if the assertion fails. For example, if assert(x >= 0) fails, it prints that "x >= 0" is the failing condition. In Java, the condition is not automatically part of the error report. If you want to see it, you have to pass it as a string into the AssertionError object: assert x >= 0 : "x >= 0"."*
>
> **Dịch:** Macro `assert` của ngôn ngữ C **biến điều kiện assertion thành một string và in ra nếu assertion thất bại**. Ví dụ khi `assert(x >= 0)` thất bại, nó in ra rằng **`"x >= 0"` là điều kiện bị hỏng**. Trong Java, **điều kiện KHÔNG tự động nằm trong báo cáo lỗi**. Muốn thấy nó, bạn **phải truyền nó vào object `AssertionError` dưới dạng string**: `assert x >= 0 : "x >= 0"`.

---

## 7.4.2. Assertion Enabling and Disabling

> *"By default, assertions are disabled. Enable them by running the program with the -enableassertions or -ea option:"*

```
java -enableassertions MyApp
```

**Dịch:** **Mặc định, assertion bị tắt.** Bật chúng bằng cách chạy chương trình với option **`-enableassertions`** hoặc **`-ea`**.

> *"Note that you do not have to recompile your program to enable or disable assertions. Enabling or disabling assertions is a function of the class loader. When assertions are disabled, the class loader strips out the assertion code so that it won't slow execution."*

**Dịch:** Lưu ý bạn **không phải compile lại chương trình** để bật/tắt assertion. Bật hay tắt assertion là **chức năng của class loader**. Khi assertion bị tắt, **class loader lột bỏ luôn code assertion** để **nó không làm chậm quá trình thực thi**.

### Bật theo class và package

> *"You can even turn on assertions in specific classes or in entire packages. For example:"*

```
java -ea:MyClass -ea:com.mycompany.mylib... MyApp
```

> *"This command turns on assertions for the class MyClass and all classes in the com.mycompany.mylib package and its subpackages. The option -ea:... turns on assertions in all classes of the unnamed package."*

**Dịch:** Bạn thậm chí **bật được assertion cho từng class cụ thể hoặc cả package**. Lệnh trên bật assertion cho **class `MyClass`** và **mọi class trong package `com.mycompany.mylib` cùng các subpackage của nó**. Option **`-ea:...`** bật assertion trong **mọi class của unnamed package**. (Về package và unnamed package, xem [[08 - Packages]].)

> *"You can also disable assertions in certain classes and packages with the -disableassertions or -da option:"*

```
java -ea:... -da:MyClass MyApp
```

**Dịch:** Bạn cũng **tắt được assertion ở một số class và package nhất định** bằng option **`-disableassertions`** hoặc **`-da`**.

> *"Some classes are not loaded by a class loader but directly by the virtual machine. You can use these switches to selectively enable or disable assertions in those classes."*
>
> *"However, the -ea and -da switches that enable or disable all assertions do not apply to the "system classes" without class loaders. Use the -enablesystemassertions/-esa switch to enable assertions in system classes."*
>
> *"It is also possible to programmatically control the assertion status of class loaders. See the API notes at the end of this section."*

**Dịch:** Một số class **không được nạp bởi class loader mà nạp trực tiếp bởi virtual machine**. Bạn dùng các switch trên để **bật/tắt assertion có chọn lọc trong những class đó**.

Tuy nhiên, các switch **`-ea` và `-da` bật/tắt toàn bộ assertion KHÔNG áp dụng cho "system class" không có class loader**. Hãy dùng switch **`-enablesystemassertions`/`-esa`** để bật assertion trong system class.

Ngoài ra, **kiểm soát assertion status của class loader bằng code cũng được** — xem phần API cuối mục này.

> **Caution (sách):** *"When assertions are turned off, the assertion condition does not execute. Therefore, it is important that the condition does not have a side effect. Here is an example of something that you should not do:"*
>
> ```java
> File file = new File(filename);
> . . .
> assert file.delete(); // BAD
> ```
>
> *"The intent was to make sure that the delete method returns true, which means the file was properly deleted. But when assertions are turned off, the deletion won't happen!"*
>
> *"The remedy is to move the side effect outside the assert statement:"*
>
> ```java
> boolean deletionSuccessful = file.delete();
> assert deletionSuccessful;
> ```
>
> **Dịch:** Khi assertion bị tắt, **điều kiện của assertion KHÔNG được thực thi**. Vì vậy **rất quan trọng là điều kiện đó không có side effect**. Ví dụ trên là thứ **bạn không nên làm**: ý định là **đảm bảo method `delete` trả về `true`**, tức file đã được xoá đúng cách. Nhưng **khi assertion bị tắt thì việc xoá sẽ không xảy ra!**
>
> Cách chữa: **đưa side effect ra ngoài câu lệnh `assert`**.

> **Note (sách):** *"The source code for the Java library has over four hundred assertions that are commented out. Some programmers comment out assertions after testing because otherwise they take up space in the class files. If you are concerned about that, you can conditionally include them as follows:"*
>
> ```java
> public static final boolean ASSERTS = true; // Recompile with false for production
> . . .
> if (ASSERTS) assert x >= 0;
> ```
>
> **Dịch:** Mã nguồn của thư viện Java có **hơn bốn trăm assertion bị comment out**. Một số lập trình viên **comment out assertion sau khi test xong** vì nếu không **chúng chiếm chỗ trong file class**. Nếu bạn bận tâm chuyện đó, có thể **đưa chúng vào một cách có điều kiện** như trên.

---

## 7.4.3. Using Assertions for Parameter Checking

> *"The Java language gives you three mechanisms to deal with system failures:"*
>
> *"Throwing an exception"*
> *"Logging"*
> *"Using assertions"*

**Dịch:** Ngôn ngữ Java cho bạn **ba cơ chế đối phó với system failure**:

1. **Throw một exception**
2. **Logging**
3. **Dùng assertion**

> *"When should you choose assertions? Keep these points in mind:"*
>
> *"Assertion failures are intended to be fatal, unrecoverable errors."*
>
> *"Assertion checks are turned on only during development and testing. (This is sometimes jokingly described as "wearing a life jacket when you are close to shore, and throwing it overboard once you are in the middle of the ocean.")"*

**Dịch:** Khi nào nên chọn assertion? Ghi nhớ các điểm sau:

- **Assertion thất bại được thiết kế để là lỗi chí mạng, không thể phục hồi.**
- **Assertion chỉ được bật trong lúc phát triển và test.** (Điều này đôi khi bị **đùa** là **"mặc áo phao khi còn gần bờ, rồi vứt nó xuống biển khi đã ra giữa đại dương"**.)

> *"Therefore, you would not use assertions for signaling recoverable conditions to another part of the program or for communicating problems to the program user. Assertions should only be used to locate internal program errors during testing."*

**Dịch:** Vì vậy, **đừng dùng assertion để báo hiệu những tình huống có thể phục hồi cho phần khác của chương trình**, cũng **đừng dùng để truyền đạt vấn đề tới người dùng**. **Assertion chỉ nên dùng để định vị lỗi nội bộ của chương trình trong lúc test.**

### Ví dụ: kiểm tra parameter của method sort

> *"Let's look at a common scenario—the checking of method parameters. Should you use assertions to check for illegal index values or null references? To answer that question, you have to look at the documentation of the method. Suppose you implement a sorting method."*

```java
/**
   Sorts the specified range of the specified array in ascending numerical order.
   The range to be sorted extends from fromIndex, inclusive, to toIndex, exclusive.
   @param a the array to be sorted
   @param fromIndex the index of the first element (inclusive) to be sorted
   @param toIndex the index of the last element (exclusive) to be sorted
   @throws IllegalArgumentException if fromIndex > toIndex
   @throws ArrayIndexOutOfBoundsException if fromIndex < 0 or toIndex > a.length
*/
static void sort(int[] a, int fromIndex, int toIndex)
```

**Dịch:** Hãy xét một kịch bản thường gặp — **kiểm tra parameter của method**. Có nên dùng assertion để **kiểm tra giá trị index không hợp lệ hoặc reference null**? Muốn trả lời, bạn **phải nhìn vào tài liệu của method**. Giả sử bạn implement một method sắp xếp như trên. (Về comment tài liệu và tag `@param`, `@throws`, xem [[10 - Documentation Comments]]; về array, xem [[09 - Arrays]].)

> *"The documentation states that the method throws an exception if the index values are incorrect. That behavior is part of the contract that the method makes with its callers. If you implement the method, you have to respect that contract and throw the indicated exceptions. It would not be appropriate to use assertions instead."*

**Dịch:** Tài liệu **nói rõ method throw exception nếu giá trị index sai**. Hành vi đó là **một phần của hợp đồng (contract) giữa method và caller của nó**. Nếu bạn implement method này, bạn **phải tôn trọng hợp đồng đó và throw đúng những exception đã ghi**. **Dùng assertion thay thế là không phù hợp.**

> *"Should you assert that a is not null? That is not appropriate either. The method documentation is silent on the behavior of the method when a is null. The callers have the right to assume that the method will return successfully in that case and not throw an assertion error."*

**Dịch:** Vậy có nên **assert rằng `a` khác null**? **Cũng không phù hợp.** Tài liệu của method **im lặng về hành vi khi `a` là null**. Caller **có quyền giả định rằng method sẽ trả về thành công trong trường hợp đó**, chứ **không throw một assertion error**.

### Precondition

> *"However, suppose the method contract had been slightly different:"*

```java
@param a the array to be sorted (must not be null)
```

> *"Now the callers of the method have been put on notice that it is illegal to call the method with a null array. Then the method may start with the assertion"*

```java
assert a != null;
```

**Dịch:** Tuy nhiên, giả sử **hợp đồng của method hơi khác đi** như trên. Giờ **caller đã được thông báo rằng gọi method với một array null là bất hợp pháp**. Khi đó **method có thể mở đầu bằng assertion** `assert a != null;`.

> *"Computer scientists call this kind of contract a precondition. The original method had no preconditions on its parameters—it promised a well-defined behavior in all cases. The revised method has a single precondition: that a is not null. If the caller fails to fulfill the precondition, then all bets are off and the method can do anything it wants. In fact, with the assertion in place, the method does just that. It sometimes throws an assertion error, and sometimes a null pointer exception, depending on how its class loader is configured."*

**Dịch:** Giới khoa học máy tính gọi loại hợp đồng này là **precondition (tiền điều kiện)**. Method ban đầu **không có precondition nào trên parameter** — nó **hứa một hành vi được định nghĩa rõ ràng trong mọi trường hợp**. Method sửa lại có **đúng một precondition: `a` không được null**. Nếu caller **không thoả mãn precondition** thì **mọi cam kết đều vô hiệu và method muốn làm gì thì làm**. Thực tế, với assertion đặt ở đó, method **làm đúng như vậy**: **khi thì throw một assertion error, khi thì throw một null pointer exception**, tuỳ vào **class loader của nó được cấu hình thế nào**.

---

## 7.4.4. Using Assertions for Documenting Assumptions

> *"Often, programmers use comments to document their underlying assumptions. Consider this example from https://docs.oracle.com/javase/8/docs/technotes/guides/language/assert.html:"*

```java
if (i % 3 == 0)
    . . .
else if (i % 3 == 1)
    . . .
else // (i % 3 == 2)
    . . .
```

> *"In this case, it makes a lot of sense to use an assertion instead."*

```java
if (i % 3 == 0)
    . . .
else if (i % 3 == 1)
    . . .
else
{
    assert i % 3 == 2;
    . . .
}
```

**Dịch:** Lập trình viên **thường dùng comment để ghi lại các giả định ngầm của mình**. Với ví dụ trên (lấy từ tài liệu Oracle), **dùng assertion thay cho comment hợp lý hơn nhiều**. (Về `if`/`else`, xem [[07 - Control Flow]].)

> *"Of course, it would make even more sense to think through the issue thoroughly. What are the possible values of i % 3? If i is positive, the remainders must be 0, 1, or 2. If i is negative, then the remainders can be -1 or -2. Thus, the real assumption is that i is not negative. A better assertion would be"*

```java
assert i >= 0;
```

> *"before the if statement."*

**Dịch:** Dĩ nhiên, **suy nghĩ thấu đáo về vấn đề còn hợp lý hơn nữa**. Các **giá trị khả dĩ của `i % 3`** là gì? Nếu `i` **dương**, số dư phải là **0, 1 hoặc 2**. Nếu `i` **âm**, số dư có thể là **-1 hoặc -2**. Vậy **giả định thật sự là `i` không âm**. Một assertion tốt hơn sẽ là **`assert i >= 0;` đặt trước câu lệnh `if`**.

> *"At any rate, this example shows a good use of assertions as a self-check for the programmer. As you can see, assertions are a tactical tool for testing and debugging. In contrast, logging is a strategic tool for the entire lifecycle of a program. We will examine logging in the next section."*

**Dịch:** Dù sao, ví dụ này cho thấy **một cách dùng assertion tốt: làm phép tự kiểm tra cho chính lập trình viên**. Như bạn thấy, **assertion là công cụ chiến thuật (tactical) cho việc test và debug**. Ngược lại, **logging là công cụ chiến lược (strategic) cho toàn bộ vòng đời của chương trình**. Mục sau sẽ bàn về logging.

---

## API — `java.lang.ClassLoader` (Java 1.0)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `void setDefaultAssertionStatus(boolean b)` **1.4** | bật hoặc tắt assertion cho **mọi class được nạp bởi class loader này** mà **chưa có assertion status riêng ở mức class hay package**. |
| `void setClassAssertionStatus(String className, boolean b)` **1.4** | bật hoặc tắt assertion cho **class cho trước và các inner class của nó**. |
| `void setPackageAssertionStatus(String packageName, boolean b)` **1.4** | bật hoặc tắt assertion cho **mọi class trong package cho trước và các subpackage của nó**. |
| `void clearAssertionStatus()` **1.4** | **gỡ bỏ mọi thiết lập assertion status tường minh ở mức class và package**, và **tắt assertion cho mọi class được nạp bởi class loader này**. |

---

## Bài kế tiếp

→ [[05 - Logging]] — logging framework của Java: logger, handler, filter, formatter, log level và cấu hình.
