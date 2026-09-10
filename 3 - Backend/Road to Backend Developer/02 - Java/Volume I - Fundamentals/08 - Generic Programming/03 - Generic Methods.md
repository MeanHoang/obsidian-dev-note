# 03 — Generic Methods

> Chapter 8, Section 8.3 — Core Java Volume I, 13th Edition (Horstmann).
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 8.3. Generic Methods

> *"In the preceding section, you have seen how to define a generic class. You can also define a single method with type parameters."*

```java
class ArrayAlg
{
    public static <T> T getMiddle(T... a)
    {
        return a[a.length / 2];
    }
}
```

**Dịch:** Ở section trước, bạn đã thấy cách định nghĩa một generic class. Bạn cũng **định nghĩa được một method đơn lẻ có type parameter**.

> *"This method is defined inside an ordinary class, not inside a generic class. However, it is a generic method, as you can see from the angle brackets and the type variable. Note that the type variables are inserted after the modifiers (public static, in our case) and before the return type."*

**Dịch:** Method này được định nghĩa **bên trong một class thường**, không phải trong generic class. Nhưng nó vẫn là **generic method**, nhận ra được qua **cặp ngoặc nhọn và type variable**. Lưu ý: type variable được đặt **sau các modifier** (ở đây là `public static`) và **trước return type**.

```
public static <T> T getMiddle(T... a)
       │      │  │
   modifier   │  └─ return type
              └──── type variable (sau modifier, trước return type)
```

> *"You can define generic methods both inside ordinary classes and inside generic classes."*

**Dịch:** Bạn định nghĩa generic method được **cả trong class thường lẫn trong generic class**.

### Gọi generic method

> *"When you call a generic method, you can place the actual types, enclosed in angle brackets, before the method name:"*

```java
String middle = ArrayAlg.<String>getMiddle("John", "Q.", "Public");
```

> *"In this case (and indeed in most cases), you can omit the <String> type parameter from the method call. The compiler has enough information to infer the method that you want. It matches the type of the arguments against the generic type T... and deduces that T must be String. That is, you can simply call"*

```java
String middle = ArrayAlg.getMiddle("John", "Q.", "Public");
```

**Dịch:** Khi gọi một generic method, bạn có thể đặt **type thực tế trong ngoặc nhọn, trước tên method**. Trong trường hợp này (và thật ra là **phần lớn trường hợp**), bạn **bỏ được** type parameter `<String>` khỏi lời gọi. Compiler **có đủ thông tin để suy ra** method mà bạn muốn. Nó **khớp type của argument với generic type `T...`** rồi **suy ra `T` phải là `String`**.

### Khi type inference sai

> *"In almost all cases, type inference for generic methods works smoothly. Occasionally, the compiler gets it wrong, and you'll need to decipher an error report. Consider this example:"*

```java
double middle = ArrayAlg.getMiddle(3.14, 1729, 0);
```

> *"The error message complains, in cryptic terms that vary from one compiler version to another, that there are two ways of interpreting this code, both equally valid. In a nutshell, the compiler autoboxed the arguments into a Double and two Integer objects, and then it tried to find a common supertype of these classes. It actually found two: Number and the Comparable interface, which is itself a generic type. In this case, the remedy is to write all arguments as double values."*

**Dịch:** **Gần như mọi trường hợp**, type inference cho generic method **chạy trơn tru**. Thỉnh thoảng compiler **hiểu sai**, và bạn phải giải mã một báo cáo lỗi. Thông báo lỗi phàn nàn — bằng những từ ngữ khó hiểu và **khác nhau tuỳ phiên bản compiler** — rằng **có hai cách diễn giải đoạn code này, cả hai đều hợp lệ như nhau**. Nói ngắn gọn: compiler đã **autobox** các argument thành **một object `Double` và hai object `Integer`**, rồi cố tìm một **supertype chung** của các class này. Nó tìm được **hai cái**: `Number` và interface `Comparable` (bản thân `Comparable` cũng là một generic type). Trong trường hợp này, **cách chữa là viết mọi argument thành giá trị `double`**.

Xem [[04 - Object Wrappers and Autoboxing]] và [[01 - Interfaces]].

> **Tip (sách):** *"Peter von der Ahé recommends this trick if you want to see which type the compiler infers for a generic method call: Purposefully introduce an error and study the resulting error message. For example, consider the call ArrayAlg.getMiddle("Hello", 0, null). Assign the result to a JButton, which can't possibly be right. You will get an error report:"*
>
> ```
> found: java.lang.Object&java.io.Serializable&java.lang.Comparable<? extends
>        java.lang.Object&java.io.Serializable&java.lang.Comparable<?>>
> ```
>
> *"In plain English, you can assign the result to Object, Serializable, or Comparable."*
>
> **Dịch:** Peter von der Ahé gợi ý mẹo sau nếu bạn muốn **xem compiler suy ra type nào** cho một lời gọi generic method: **cố tình tạo ra lỗi rồi đọc kỹ thông báo lỗi**. Ví dụ, với lời gọi `ArrayAlg.getMiddle("Hello", 0, null)`, hãy **gán kết quả vào một `JButton`** — điều chắc chắn không thể đúng. Bạn sẽ nhận được báo cáo lỗi như trên. Nói cho dễ hiểu: bạn **gán được kết quả vào `Object`, `Serializable`, hoặc `Comparable`**.

> **C++ Note (sách):** *"In C++, you place the type parameters after the method name. That can lead to nasty parsing ambiguities. For example, g(f<a,b>(c)) can mean "call g with the result of f<a,b>(c)," or "call g with the two boolean values f<a and b>(c).""*
>
> **Dịch:** Trong C++, type parameter được đặt **sau tên method**. Điều đó dẫn tới **những mơ hồ khi phân tích cú pháp rất khó chịu**. Ví dụ `g(f<a,b>(c))` có thể nghĩa là "gọi `g` với kết quả của `f<a,b>(c)`", hoặc "gọi `g` với **hai giá trị boolean** `f<a` và `b>(c)`".

---

## Bài kế tiếp

→ [[04 - Bounds for Type Variables]] — giới hạn type variable bằng `extends`, multiple bound, và generic `minmax` trả về `Pair<T>`.
