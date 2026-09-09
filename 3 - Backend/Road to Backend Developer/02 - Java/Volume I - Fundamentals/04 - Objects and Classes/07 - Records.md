# 07 — Records

> Chapter 4, Section 4.7 — Core Java Volume I, 13th Edition (Horstmann).
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 4.7. Records

> *"Sometimes, data is just data, and the data hiding that object-oriented programming provides gets in the way. Consider a class Point that describes a point in the plane, with x- and y-coordinates."*

> *"Sure, you can create a class:"*

```java
class Point
{
    private final double x;
    private final double y;

    public Point(double x, double y) { this.x = x; this.y = y; }
    public getX() { return x; }
    public getY() { return y; }
    public String toString() { return "Point[x=%d, y=%d]".formatted(x, y); }
    // More methods . . .
}
```

**Dịch:** Đôi khi **data chỉ là data**, và việc **giấu data** mà OOP mang lại lại **gây vướng**. Xét class `Point` mô tả một điểm trên mặt phẳng với toạ độ x, y.

> *"But does it really buy us anything to hide x and y, and then make the values available through the getter methods?"*

> *"Would we ever want to change the implementation of a Point? Sure, there are polar coordinates, but you would not use them with a graphics API. In practice, a point in the plane is completely described by its x- and y-coordinates."*

**Dịch:** Nhưng giấu `x` và `y` đi rồi lại cho truy cập qua getter thì **thực sự được lợi gì**? Có bao giờ ta muốn đổi implementation của `Point` không? Có toạ độ cực đấy, nhưng bạn sẽ **không dùng nó với một graphics API**. Trên thực tế, một điểm trên mặt phẳng **được mô tả trọn vẹn bởi toạ độ x và y của nó**.

> *"To define such classes more concisely, JDK 14 introduced "records" as a preview feature. The final version was delivered in JDK 16."*

**Dịch:** Để định nghĩa những class như vậy **gọn hơn**, **JDK 14** giới thiệu **record** dưới dạng preview feature. Bản chính thức có ở **JDK 16**.

---

## 4.7.1. The Record Concept

> *"A record is a special form of a class whose state is immutable and readable by the public. To declare a record, provide the name and the instance variables that hold the object state. Here is how you define Point as a record:"*

```java
record Point(double x, double y) { }
```

**Dịch:** **Record là một dạng đặc biệt của class**, có state **immutable** và **đọc được công khai**. Khai báo record thì đưa vào **tên** và **các instance variable giữ state của object**.

> *"The result is a class with instance fields:"*

```java
private final double x;
private final double y;
```

> *"In the Java language specification, the instance fields of a record are called its components."*

**Dịch:** Kết quả là một class với các instance field như trên. Trong Java language specification, **instance field của một record được gọi là components** của nó.

> *"The class has a constructor"*

```java
Point(double x, double y)
```

> *"and accessor methods"*

```java
public double x()
public double y()
```

> *"Note that the accessors are called x and y, not getX and getY. (It is legal in Java to have an instance field and a method with the same name.)"*

```java
var p = new Point(3, 4);
System.out.println(p.x() + " " + p.y());
```

**Dịch:** Accessor tên là **`x` và `y`**, chứ **không phải `getX`, `getY`**. Trong Java, việc có một instance field và một method **trùng tên** là **hợp lệ**.

```
record Point(double x, double y) { }
                │
                ▼  compiler tự sinh ra
  ┌──────────────────────────────────────┐
  │ private final double x;              │  ← components
  │ private final double y;              │
  │ Point(double x, double y)            │  ← canonical constructor
  │ public double x()                    │  ← accessor (KHÔNG phải getX)
  │ public double y()                    │
  │ public String toString()             │  ┐
  │ public boolean equals(Object)        │  ├ 3 method tự sinh
  │ public int hashCode()                │  ┘
  └──────────────────────────────────────┘
```

> **Note (sách):** *"Java doesn't follow the get convention because it is a bit messy. For boolean fields, it is common to use is instead of get. And the capitalization of the first letter can be problematic. What should happen if a class has fields x and X? Some programmers are unhappy because their legacy classes cannot trivially become records. But in practice, many of those legacy classes are mutable and therefore not candidates for conversion to records."*
>
> **Dịch:** Java **không theo quy ước `get`** vì nó hơi lộn xộn. Với field `boolean` thì người ta hay dùng `is` thay cho `get`. Và chuyện **viết hoa chữ cái đầu** cũng thành vấn đề: nếu một class có cả field `x` lẫn `X` thì sao? Một số lập trình viên không vui vì legacy class của họ **không dễ dàng chuyển thành record**. Nhưng thực tế, **nhiều legacy class trong số đó là mutable**, nên vốn dĩ **không phải ứng viên** để chuyển thành record.

### Ba method tự sinh

> *"In addition to the field accessor methods, every record has three methods defined automatically: toString, equals, and hashCode. You will learn more about these methods in the next chapter."*

**Dịch:** Ngoài các field accessor method, **mọi record đều có ba method được định nghĩa tự động**: `toString`, `equals`, `hashCode`. Chi tiết ở chương sau.

### Thêm method của riêng mình

> *"You can add your own methods to a record:"*

```java
record Point(double x, double y)
{
    public double distanceFromOrigin() { return Math.hypot(x, y); }
}
```

> **Caution (sách):** *"You can define your own versions of the automatically provided methods, as long as they have the same parameter and return types. For example, this definition is legal:"*
>
> ```java
> record Point(double x, double y)
> {
>     public double x() { return 2 * x; } // BAD
> }
> ```
>
> *"But it is surely not a good idea."*
>
> **Dịch:** Bạn **định nghĩa lại được** các method tự sinh, miễn giữ nguyên kiểu parameter và kiểu trả về. Ví dụ trên là **hợp lệ**, nhưng **chắc chắn không phải ý hay**.

### Không thêm được instance field

> *"You cannot add instance fields to a record."*

```java
record Point(double x, double y)
{
    private double r; // ERROR
    . . .
}
```

**Dịch:** **Không thêm được instance field vào record.**

### ⚠️ Record chứa object mutable thì instance mutable

> **Caution (sách):** *"Instance fields of a record are automatically final. However, they may be references to mutable objects:"*
>
> ```java
> record PointInTime(double x, double y, Date when) { }
> ```
>
> *"Then record instances are mutable:"*
>
> ```java
> var pt = new PointInTime(0, 0, new Date());
> pt.when().setTime(0);
> ```
>
> *"If you intend record instances to be immutable, don't use mutable types for fields."*
>
> **Dịch:** Instance field của record **tự động là `final`**. Nhưng chúng **có thể là reference tới object mutable**. Khi đó **instance của record trở thành mutable**. Nếu muốn instance của record là immutable thì **đừng dùng kiểu mutable cho field**.

```
   record PointInTime            heap
  ┌──────────────────┐      ┌──────────────────┐
  │ x = 0   (final)  │      │   Date object    │
  │ y = 0   (final)  │      │   MUTABLE ⚠️     │
  │ when  ───────────┼─────►│  setTime() đổi   │
  └──────────────────┘      └──────────────────┘
   reference final ✅        nội dung vẫn sửa được ❌
```

### Static field và static method

> *"A record, like any class, can have static fields and methods:"*

```java
record Point(double x, double y)
{
    public static Point ORIGIN = new Point(0, 0);

    public static double distance(Point p, Point q)
    {
        return Math.hypot(p.x - q.x, p.y - q.y);
    }
    . . .
}
```

**Dịch:** Record, cũng như mọi class khác, **có static field và static method được**.

### ⭐ Khi nào dùng record, khi nào dùng class

> **Tip (sách):** *"Use a record instead of a class for immutable data that is completely represented by a set of variables. Use a class if the data is mutable, or if the representation may evolve over time. Records are easier to read, more efficient, and safer in concurrent programs."*
>
> **Dịch:**

| Dùng | Khi nào |
|---|---|
| **record** | data **immutable** và **được mô tả trọn vẹn bởi một tập biến** |
| **class** | data **mutable**, hoặc **cách biểu diễn có thể tiến hoá theo thời gian** |

Record **dễ đọc hơn, hiệu quả hơn, và an toàn hơn trong chương trình concurrent**.

---

## 4.7.2. Constructors: Canonical, Compact, and Custom

> *"The automatically defined constructor that sets all instance fields is called the canonical constructor."*

**Dịch:** Constructor được định nghĩa tự động, đặt giá trị cho **mọi instance field**, gọi là **canonical constructor**.

### Compact form

> *"To validate or normalize the parameters for the canonical constructor, use a compact form. Don't specify the parameter list:"*

```java
record Range(int from, int to)
{
    public Range // Compact form, validating parameters
    {
        if (from > to) throw new IllegalArgumentException();
    }
}
```

> *"or"*

```java
record Range(int from, int to)
{
    public Range // Compact form, normalizing parameters
    {
        if (from > to) // Swap the bounds
        {
            int temp = from;
            from = to;
            to = temp;
        }
    }
}
```

**Dịch:** Muốn **kiểm tra hợp lệ (validate)** hay **chuẩn hoá (normalize)** parameter cho canonical constructor thì dùng **compact form**. **Không ghi danh sách parameter**.

> *"The body of the compact form is the "prelude" to the canonical constructor. It merely modifies the parameter variables from and to before they are assigned to the instance fields this.from and this.to. You cannot read or modify the instance fields in the body of the compact constructor."*

**Dịch:** Thân của compact form là **phần "dạo đầu" (prelude)** cho canonical constructor. Nó **chỉ sửa các biến parameter** `from` và `to` **trước khi** chúng được gán vào instance field `this.from` và `this.to`. Trong thân compact constructor, bạn **không đọc cũng không sửa được instance field**.

```
new Range(4, 3)
      │
      ▼
 compact constructor body   ← chỉ sửa parameter from, to
      │  (from=3, to=4 sau khi swap)
      ▼
 canonical constructor      ← gán this.from = from; this.to = to
```

### Custom constructor

> *"You can define additional custom constructors. The first statement of such a constructor must call another constructor, so that ultimately the canonical constructor is invoked. Here is an example:"*

```java
record Point(double x, double y)
{
    public Point() { this(0, 0); }
}
```

> *"This record has two constructors: the canonical constructor and a no-argument constructor yielding the origin."*

**Dịch:** Định nghĩa thêm **custom constructor** được. **Câu lệnh đầu tiên** của constructor như vậy **phải gọi một constructor khác**, để rốt cuộc **canonical constructor được gọi tới**. Record trên có hai constructor: canonical constructor và một constructor không tham số cho ra gốc toạ độ.

### Tự implement canonical constructor

> *"If the canonical constructor needs to do additional work, you can provide your own implementation. But this is very uncommon. For example, the following implementation is valid, but, as you have seen, the same effect is easier to achieve with a compact constructor."*

```java
record Range(int from, int to)
{
    public Range(int from, int to) // legal, but more work than a compact constructor
    {
        if (from <= to)
        {
            this.from = from;
            this.to = to;
        }
        else
        {
            this.from = to;
            this.to = from;
        }
    }
}
```

**Dịch:** Nếu canonical constructor cần làm thêm việc, bạn tự implement được. Nhưng chuyện này **rất hiếm gặp**. Ví dụ trên hợp lệ, nhưng **cùng hiệu quả đó thì compact constructor làm dễ hơn**.

| Loại constructor | Đặc điểm |
|---|---|
| **canonical** | tự sinh, đặt mọi instance field |
| **compact** | không ghi danh sách parameter, chỉ sửa **parameter** trước khi gán, **không đụng được instance field** |
| **custom** | câu lệnh đầu **phải** gọi constructor khác, để cuối cùng canonical constructor được gọi |

---

## Listing 4.6 — `RecordTest/RecordTest.java`

```java
import java.util.*;

/**
 * This program demonstrates records.
 * @version 1.0 2021-05-13
 * @author Cay Horstmann
 */
public class RecordTest
{
    public static void main(String[] args)
    {
        var p = new Point(3, 4);
        System.out.println("Coordinates of p: " + p.x() + " " + p.y());
        System.out.println("Distance from origin: " + p.distanceFromOrigin());

        // Same computation with static field and method
        System.out.println("Distance from origin: " + Point.distance(Point.ORIGIN, p));

        // A mutable record
        var pt = new PointInTime(3, 4, new Date());
        System.out.println("Before: " + pt);
        pt.when().setTime(0);
        System.out.println("After: " + pt);

        // Invoking a compact constructor
        var r = new Range(4, 3);
        System.out.println("r: " + r);
    }
}

record Point(double x, double y)
{
    // A custom constructor
    public Point() { this(0, 0); }

    // A method
    public double distanceFromOrigin()
    {
        return Math.hypot(x, y);
    }

    // A static field and method
    public static Point ORIGIN = new Point();

    public static double distance(Point p, Point q)
    {
        return Math.hypot(p.x - q.x, p.y - q.y);
    }
}

record PointInTime(double x, double y, Date when) { }

record Range(int from, int to)
{
    // A compact constructor
    public Range
    {
        if (from > to) // Swap the bounds
        {
            int temp = from;
            from = to;
            to = temp;
        }
    }
}
```

---

## Bài kế tiếp

→ [[08 - Packages]] — tên package, import class, static import, thêm class vào package, package access.
