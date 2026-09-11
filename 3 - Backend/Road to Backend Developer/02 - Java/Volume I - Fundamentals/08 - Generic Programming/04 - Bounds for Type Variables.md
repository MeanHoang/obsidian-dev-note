# 04 — Bounds for Type Variables

> Chapter 8, Section 8.4 — Core Java Volume I, 13th Edition (Horstmann).
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 8.4. Bounds for Type Variables

> *"Sometimes, a class or a method needs to place restrictions on type variables. Here is a typical example. We want to compute the smallest element of an array:"*

```java
class ArrayAlg
{
    public static <T> T min(T[] a) // almost correct
    {
        if (a == null || a.length == 0) return null;
        T smallest = a[0];
        for (int i = 1; i < a.length; i++)
            if (smallest.compareTo(a[i]) > 0) smallest = a[i];
        return smallest;
    }
}
```

**Dịch:** Đôi khi một class hoặc method cần **đặt ràng buộc lên type variable**. Ví dụ điển hình: ta muốn tính element nhỏ nhất của một array.

> *"But there is a problem. Look inside the code of the min method. The variable smallest has type T, which means it could be an object of an arbitrary class. How do we know that the class to which T belongs has a compareTo method?"*

**Dịch:** Nhưng **có vấn đề**. Nhìn vào code của method `min`: biến `smallest` có type `T`, nghĩa là nó **có thể là object của một class bất kỳ**. Làm sao ta biết class mà `T` thuộc về **có method `compareTo`**?

> *"The solution is to restrict T to a class that implements the Comparable interface—a standard interface with a single method, compareTo. You can achieve this by giving a bound for the type variable T:"*

```java
public static <T extends Comparable> T min(T[] a) . . .
```

**Dịch:** Giải pháp là **giới hạn `T` vào một class implement interface `Comparable`** — một interface chuẩn với **duy nhất một method là `compareTo`**. Làm được điều đó bằng cách đặt một **bound** cho type variable `T`.

> *"Actually, the Comparable interface is itself a generic type. For now, ignore that complexity and the warnings that the compiler generates. Section 8.7 discusses how to properly use type parameters with the Comparable interface."*

**Dịch:** Thật ra bản thân interface `Comparable` **cũng là một generic type**. Tạm thời **bỏ qua sự phức tạp đó** và các warning mà compiler sinh ra. Section 8.7 sẽ nói cách dùng type parameter đúng cách với `Comparable` — xem [[07 - Wildcard Types]].

> *"Now, the generic min method can only be called with arrays of classes that implement the Comparable interface, such as String, LocalDate, and so on. Calling min with a Rectangle array is a compile-time error because the Rectangle class does not implement Comparable."*

**Dịch:** Giờ generic method `min` **chỉ gọi được với array của những class implement interface `Comparable`**, như `String`, `LocalDate`, v.v. Gọi `min` với một array `Rectangle` là **lỗi lúc compile**, vì class `Rectangle` **không implement `Comparable`**.

> **C++ Note (sách):** *"In C++, you cannot restrict the types of template parameters. If a programmer instantiates a template with an inappropriate type, an (often obscure) error message is reported inside the template code."*
>
> **Dịch:** Trong C++, bạn **không giới hạn được type của template parameter**. Nếu lập trình viên instantiate một template với type không phù hợp, thông báo lỗi (thường **rất tối nghĩa**) sẽ được báo **bên trong code của template**.

### Vì sao dùng `extends` chứ không phải `implements`

> *"You may wonder why I use the extends keyword rather than the implements keyword in this situation—after all, Comparable is an interface. The notation"*

```java
<T extends BoundingType>
```

> *"expresses that T should be a subtype of the bounding type. Both T and the bounding type can be either a class or an interface. The extends keyword was chosen because it is a reasonable approximation of the subtype concept, and the Java designers did not want to add a new keyword (such as sub) to the language."*

**Dịch:** Bạn có thể thắc mắc vì sao dùng keyword **`extends`** thay vì **`implements`** trong tình huống này — dù sao `Comparable` cũng là một interface. Ký pháp `<T extends BoundingType>` diễn đạt rằng **`T` phải là subtype của bounding type**. **Cả `T` lẫn bounding type đều có thể là class hoặc interface.** Keyword `extends` được chọn vì nó là **xấp xỉ hợp lý của khái niệm subtype**, và người thiết kế Java **không muốn thêm keyword mới** (kiểu như `sub`) vào ngôn ngữ.

### Multiple bounds

> *"A type variable can have multiple bounds. For example:"*

```java
T extends Comparable & Serializable
```

> *"The bounding types are separated by ampersands (&) because commas are used to separate type variables."*

> *"As with Java inheritance, you can have as many interface supertypes as you like, but at most one of the bounds can be a class. If you have a class as a bound, it must be the first one in the bounds list."*

**Dịch:** Một type variable **có nhiều bound được**. Các bounding type **ngăn nhau bằng dấu `&`**, vì **dấu phẩy đã dùng để ngăn các type variable**. Giống như inheritance trong Java: bạn **có bao nhiêu interface supertype tuỳ ý**, nhưng **tối đa một trong các bound được là class**. Nếu có một class làm bound, nó **phải đứng đầu tiên trong danh sách bound**.

| Quy tắc bound | Nội dung |
|---|---|
| Ký pháp | `<T extends BoundingType>` — `T` là **subtype** của bounding type |
| Bound có thể là | **class hoặc interface** |
| Nhiều bound | ngăn bằng **`&`** (dấu phẩy dành cho ngăn type variable) |
| Số interface bound | **bao nhiêu tuỳ ý** |
| Số class bound | **tối đa 1**, và **phải đứng đầu** danh sách |

> *"In the next sample program (Listing 8.2), we rewrite the minmax method to be generic. The method computes the minimum and maximum of a generic array, returning a Pair\<T>."*

**Dịch:** Ở chương trình mẫu tiếp theo (Listing 8.2), method `minmax` được viết lại thành generic. Method tính min và max của một **generic array**, trả về `Pair<T>`.

---

### Listing 8.2 — `pair2/PairTest2.java`

```java
package pair2;

import java.time.*;

/**
 * @version 1.02 2015-06-21
 * @author Cay Horstmann
 */
public class PairTest2
{
    public static void main(String[] args)
    {
        LocalDate[] birthdays =
        {
            LocalDate.of(1906, 12, 9),  // G. Hopper
            LocalDate.of(1815, 12, 10), // A. Lovelace
            LocalDate.of(1903, 12, 3),  // J. von Neumann
            LocalDate.of(1910, 6, 22),  // K. Zuse
        };
        Pair<LocalDate> mm = ArrayAlg.minmax(birthdays);
        System.out.println("min = " + mm.getFirst());
        System.out.println("max = " + mm.getSecond());
    }
}

class ArrayAlg
{
    /**
       Gets the minimum and maximum of an array of objects of type T.
       @param a an array of objects of type T
       @return a pair with the min and max values, or null if a is null or empty
    */
    public static <T extends Comparable> Pair<T> minmax(T[] a)
    {
        if (a == null || a.length == 0) return null;
        T min = a[0];
        T max = a[0];
        for (int i = 1; i < a.length; i++)
        {
            if (min.compareTo(a[i]) > 0) min = a[i];
            if (max.compareTo(a[i]) < 0) max = a[i];
        }
        return new Pair<>(min, max);
    }
}
```

---

## Bài kế tiếp

→ [[05 - Generic Code and the Virtual Machine]] — type erasure, raw type, bridge method, gọi legacy code và generic record pattern.
