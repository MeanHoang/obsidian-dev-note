# 07 — Enumeration Classes

> Chapter 5, Section 5.7 — Core Java Volume I, 13th Edition (Horstmann).
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 5.7. Enumeration Classes

> *"You saw in Chapter 3 how to define enumerated types. Here is a typical example:"*

```java
public enum Size { SMALL, MEDIUM, LARGE, EXTRA_LARGE }
```

**Dịch:** [[02 - Data Types|Chương 3]] đã cho thấy cách **định nghĩa enumerated type**.

> *"When you refer to these constants, qualify them with the class name, such as Size.SMALL. You can use the unqualified name in three situations:"*

**Dịch:** Khi tham chiếu tới các hằng này, **hãy kèm tên class**, chẳng hạn `Size.SMALL`. Bạn dùng được **tên không kèm tiền tố (unqualified)** trong **ba tình huống**.

> *"1. As you will see shortly, enumerations can have methods. Inside the methods of an enumeration, you can use the unqualified name."*

**Dịch:** Enumeration **có method được**. **Bên trong method của một enumeration**, bạn dùng được tên unqualified.

> *"2. In a case of a switch whose selector has an enumerated type, you don't need the qualification:"*
>
> ```java
> Size s = . . .;
> String abbrev = switch (s)
> {
>     case SMALL -> "S";
>     . . .
> };
> ```

**Dịch:** Trong **`case` của một [[07 - Control Flow|`switch`]]** mà **selector có kiểu enumerated**, bạn **không cần kèm tiền tố**.

> *"3. You can statically import all constants of an enumeration:"*
>
> ```java
> import com.horstmann.util.Size;
> import static com.horstmann.util.Size.*;
> . . .
> Size s = SMALL;
> ```

**Dịch:** Bạn **[[08 - Packages|static import]] được mọi hằng của một enumeration**.

> **Caution (sách):** *"You cannot statically import constants from an enumeration in the default package. For example, if Size is in the default package, you cannot use"*
>
> ```java
> import static Size.*;
> ```
>
> **Dịch:** **Không static import được hằng từ một enumeration nằm trong default package.** Nếu `Size` ở default package thì **không dùng được** `import static Size.*;`.

> *"The type defined by an enum declaration is actually a class. The class has exactly four instances—it is not possible to construct new objects. Therefore, you never need to use equals for values of enumerated types. Simply use == to compare them."*

**Dịch:** Kiểu do một khai báo `enum` định nghĩa **thực chất là một class**. Class đó có **đúng bốn instance** — **không dựng được object mới**. Vì vậy bạn **không bao giờ cần dùng [[02 - Object The Cosmic Superclass|`equals`]] cho giá trị của enumerated type**; **chỉ cần dùng `==` để so sánh**.

> **Note (sách):** *"You are allowed to put a comma after the last value. Trailing commas can be useful if you expect the number of values to grow."*
>
> ```java
> public enum Size
> {
>     SMALL,
>     MEDIUM,
>     LARGE,
>     EXTRA_LARGE,
>     XXL,
>     // add more values here and put a comma after each
> }
> ```
>
> **Dịch:** Bạn **được phép đặt dấu phẩy sau giá trị cuối cùng**. **Dấu phẩy cuối** hữu ích nếu bạn **dự kiến số lượng giá trị sẽ tăng thêm**.

> *"All enumerated types are subclasses of the abstract class Enum. They inherit a number of methods from that class. The most useful one is name, which returns the name of the enumerated constant. For example, Size.SMALL.toString() returns the string "SMALL"."*

**Dịch:** **Mọi enumerated type đều là subclass của [[06 - Abstract Classes|abstract class]] `Enum`.** Chúng **kế thừa một số method** từ class đó. Hữu ích nhất là **`name`**, trả về **tên của hằng enumerated**.

> *"By default, the toString method returns name. However, you can override toString, whereas name is final."*

**Dịch:** Mặc định, method **`toString` trả về `name`**. Nhưng bạn **override được `toString`**, trong khi **`name` là `final`**.

> *"The converse of name is the static valueOf method. For example, the statement"*

```java
Size s = Enum.valueOf(Size.class, "SMALL");
```

> *"sets s to Size.SMALL."*

**Dịch:** **Chiều ngược của `name`** là static method **`valueOf`**.

> *"Each enumerated type has a static values method that returns an array of all values of the enumeration. For example, the call"*

```java
Size[] values = Size.values();
```

> *"returns the array with elements Size.SMALL, Size.MEDIUM, Size.LARGE, and Size.EXTRA_LARGE."*

**Dịch:** Mỗi enumerated type có static method **`values`** trả về **[[09 - Arrays|mảng]] chứa mọi giá trị của enumeration**.

> *"The ordinal method yields the position of an enumerated constant in the enum declaration, counting from zero. For example, Size.MEDIUM.ordinal() returns 1."*

**Dịch:** Method **`ordinal`** cho ra **vị trí của hằng enumerated trong khai báo `enum`**, **đếm từ 0**. Ví dụ `Size.MEDIUM.ordinal()` trả về **1**.

> *"You can, if you like, add constructors, methods, and fields to an enumerated type. Of course, the constructors are only invoked when the instances are constructed. Here is an example:"*

```java
public enum Size
{
    SMALL("S"), MEDIUM("M"), LARGE("L"), EXTRA_LARGE("XL");

    private final String abbreviation;

    Size(String abbreviation) { this.abbreviation = abbreviation; } // automatically private

    public String getAbbreviation() { return abbreviation; }
}
```

**Dịch:** Nếu thích, bạn **thêm được constructor, method và field vào một enumerated type**. Dĩ nhiên **constructor chỉ được gọi khi các instance được dựng**.

> **Note (sách):** *"When an enum has fields or methods, you must terminate the list of constants with a semicolon, as in the example above. It is legal to have a trailing comma and then a semicolon."*
>
> **Dịch:** Khi một `enum` **có field hoặc method**, bạn **phải kết thúc danh sách hằng bằng dấu chấm phẩy**, như ví dụ trên. **Hợp lệ** khi có **dấu phẩy cuối rồi mới tới dấu chấm phẩy**.

> *"You can even override methods in each instance:"*

```java
public enum Size
{
    SMALL,
    MEDIUM,
    LARGE,
    EXTRA_LARGE
    {
        public String toString() { return "XL"; }
    };
}
```

> *"However, this is not common. In the preceding example, EXTRA_LARGE is an instance of a subclass of Size. Apart from this, you cannot form subclasses of an enumeration."*

**Dịch:** Bạn thậm chí **override được method ở từng instance**. Nhưng **cách này không phổ biến**. Trong ví dụ trên, **`EXTRA_LARGE` là instance của một subclass của `Size`**. **Ngoài trường hợp này ra, bạn không tạo được subclass của một enumeration.**

> *"The constructor of an enumeration is always private. You can omit the private modifier, as in the preceding example. It is a syntax error to declare an enum constructor as public or protected."*

**Dịch:** Constructor của một enumeration **luôn là `private`**. Bạn **bỏ được modifier `private`** như ví dụ trên. **Khai báo constructor của `enum` là `public` hay `protected` là lỗi cú pháp.**

> **Caution (sách):** *"The constructor of an enumeration class cannot invoke a switch on the instance that is being constructed:"*
>
> ```java
> public enum Size
> {
>     SMALL, MEDIUM, LARGE, EXTRA_LARGE;
>
>     private final boolean largish;
>
>     Size()
>     {
>         largish = switch (this) // ERROR
>         {
>             case LARGE, EXTRA_LARGE -> true;
>             default -> false;
>         };
>     }
> }
> ```
>
> *"This curious limitation is caused by the implementation strategy for switch on enum. Each switch consults an array that maps the ordinal values of the enum constants, as currently defined, to the ordinal values of the time when the switch was compiled. These arrays can only be built after the enum instances are constructed."*
>
> *"In a method, such a switch works fine."*
>
> **Dịch:** Constructor của một enumeration class **không gọi được `switch` trên chính instance đang được dựng**. **Giới hạn kỳ lạ này** đến từ **chiến lược cài đặt `switch` trên `enum`**: mỗi `switch` **tra một mảng ánh xạ giá trị ordinal của các hằng enum như hiện được định nghĩa sang giá trị ordinal ở thời điểm `switch` được biên dịch**. Các mảng đó **chỉ dựng được sau khi các instance enum đã được dựng xong**. **Trong một method thì `switch` như vậy chạy tốt.**

> *"The short program in Listing 5.12 demonstrates how to work with enumerated types."*

> **Note (sách):** *"The Enum class has a type parameter that I have ignored for simplicity. For example, the enumerated type Size actually extends Enum<Size>. The type parameter is used in the compareTo method. (I discuss the compareTo method in Chapter 6 and type parameters in Chapter 8.)"*
>
> **Dịch:** Class `Enum` **có một type parameter mà tác giả bỏ qua cho gọn**. Ví dụ enumerated type `Size` **thực ra extend `Enum<Size>`**. Type parameter đó **được dùng trong method `compareTo`**. (`compareTo` bàn ở chương 6, type parameter ở chương 8.)

### Listing 5.12 — `enums/EnumTest.java`

```java
package enums;

import java.util.*;

/**
 * This program demonstrates enumerated types.
 * @version 1.0 2004-05-24
 * @author Cay Horstmann
 */
public class EnumTest
{
    public static void main(String[] args)
    {
        var in = new Scanner(System.in);
        System.out.print("Enter a size: (SMALL, MEDIUM, LARGE, EXTRA_LARGE) ");
        String input = in.next().toUpperCase();
        Size size = Enum.valueOf(Size.class, input);
        System.out.println("size=" + size);
        System.out.println("abbreviation=" + size.getAbbreviation());
        if (size == Size.EXTRA_LARGE)
            System.out.println("Good job--you paid attention to the _.");
    }
}

enum Size
{
    SMALL("S"), MEDIUM("M"), LARGE("L"), EXTRA_LARGE("XL");

    private Size(String abbreviation) { this.abbreviation = abbreviation; }
    public String getAbbreviation() { return abbreviation; }

    private String abbreviation;
}
```

## API — `java.lang.Enum<E>` (Java 5.0)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `static Enum valueOf(Class enumClass, String name)` | Trả về **hằng enumerated của class cho trước, mang tên cho trước**. |
| `String name()` | Trả về **tên của hằng enumerated này**. |
| `int ordinal()` | Trả về **vị trí đếm từ 0 của hằng enumerated này trong khai báo `enum`**. |
| `int compareTo(E other)` | Trả về **số nguyên âm** nếu hằng này **đứng trước `other`**, **`0`** nếu `this == other`, và **số nguyên dương** trong trường hợp còn lại. **Thứ tự các hằng do khai báo `enum` quy định.** |

---

## Bài kế tiếp

→ [[08 - Sealed Classes]] — kiểm soát chính xác những class nào được phép extend hoặc implement một type.
