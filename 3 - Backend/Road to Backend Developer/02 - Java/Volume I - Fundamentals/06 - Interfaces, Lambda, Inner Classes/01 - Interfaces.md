# 01 — Interfaces

> Chapter 6, Section 6.1 — Core Java Volume I, 13th Edition (Horstmann).
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## Mở đầu chương 6

> *"You have now learned about classes and inheritance, the key concepts of object-oriented programming in Java. This chapter shows you several advanced techniques that are commonly used. Despite their less obvious nature, you will need to master them to complete your Java tool chest."*

**Dịch:** Bạn đã học về class và [[01 - Classes, Superclasses, and Subclasses|inheritance]], hai khái niệm then chốt của object-oriented programming trong Java. Chương này giới thiệu **vài kỹ thuật nâng cao thường dùng**. Dù bản chất chúng không hiển nhiên, bạn **vẫn phải thành thạo** để hoàn thiện bộ đồ nghề Java của mình.

> *"The first technique, called interfaces, is a way of describing what classes should do, without specifying how they should do it. A class can implement one or more interfaces. You can then use objects of these implementing classes whenever conformance to the interface is required. After discussing interfaces, we move on to lambda expressions, a concise way to create blocks of code that can be executed at a later point in time. Using lambda expressions, you can express code that uses callbacks or variable behavior in an elegant and concise fashion."*

**Dịch:** Kỹ thuật đầu tiên — **interface** — là cách mô tả **class nên làm gì**, mà **không quy định làm bằng cách nào**. Một class có thể implement **một hoặc nhiều** interface. Sau đó bạn dùng được object của các class implement đó ở bất cứ đâu đòi hỏi sự tuân thủ interface. Sau interface là **lambda expression**, cách viết gọn để tạo ra **khối code chạy sau này**. Với lambda expression, bạn diễn đạt code dùng **callback** hay **hành vi thay đổi được** một cách **thanh thoát và ngắn gọn**.

> *"We then discuss the mechanism of inner classes. Inner classes are technically somewhat complex—they are defined inside other classes, and their methods can access the fields of the surrounding class. Inner classes are useful when you design collections of cooperating classes."*

**Dịch:** Tiếp đó là cơ chế **inner class**. Inner class **hơi phức tạp về mặt kỹ thuật** — chúng được định nghĩa **bên trong class khác**, và method của chúng **truy cập được field của class bao quanh**. Inner class hữu ích khi bạn thiết kế **tập hợp các class hợp tác với nhau**.

> *"This chapter concludes with a discussion of proxies, objects that implement arbitrary interfaces. A proxy is a very specialized construct that is useful for building system-level tools. You can safely skip that section on first reading."*

**Dịch:** Chương kết thúc bằng **proxy** — object implement **các interface tuỳ ý**. Proxy là cấu trúc **rất chuyên biệt**, hữu ích khi xây dựng **công cụ ở tầng hệ thống**. Lần đọc đầu **bỏ qua phần đó cũng được**.

---

## 6.1. Interfaces

> *"In the following sections, you will learn what Java interfaces are and how to use them. You will also find out how interfaces have been made more powerful in recent versions of Java."*

**Dịch:** Các phần sau sẽ nói interface trong Java **là gì**, **dùng thế nào**, và interface đã được làm **mạnh hơn** ra sao trong các phiên bản Java gần đây.

---

## 6.1.1. The Interface Concept

> *"In the Java programming language, an interface is not a class but a set of requirements for the classes that want to conform to the interface."*

**Dịch:** Trong Java, **interface không phải là một class** mà là **một tập yêu cầu** dành cho những class muốn tuân thủ interface đó.

> *"Typically, the supplier of some service states: “If your class conforms to a particular interface, then I’ll perform the service.” Let’s look at a concrete example. The sort method of the Arrays class promises to sort an array of objects, but under one condition: The objects must belong to classes that implement the Comparable interface."*

**Dịch:** Thông thường, bên cung cấp dịch vụ tuyên bố: *"Nếu class của bạn tuân thủ một interface nhất định thì tôi sẽ thực hiện dịch vụ."* Ví dụ cụ thể: method `sort` của class `Arrays` hứa sắp xếp một [[09 - Arrays|array]] các object, nhưng **với một điều kiện**: object phải thuộc class **implement interface `Comparable`**.

> *"Here is what the Comparable interface looks like:"*

```java
public interface Comparable
{
    int compareTo(Object other);
}
```

> *"In the interface, the compareTo method is abstract—it has no implementation. A class that implements the Comparable interface needs to have a compareTo method, and the method must have an Object parameter and return an integer. Otherwise, the class is also abstract—that is, you cannot construct any objects."*

**Dịch:** Trong interface, method `compareTo` là **abstract** — **không có implementation**. Class implement `Comparable` **phải có** method `compareTo`, method đó **phải nhận parameter kiểu `Object`** và **trả về integer**. Nếu không, class đó **cũng là abstract** — nghĩa là **không dựng được object nào**. (Xem thêm [[06 - Abstract Classes]].)

> **Note (sách):** *"As of Java 5, the Comparable interface has been enhanced to be a generic type."*
>
> ```java
> public interface Comparable<T>
> {
>     int compareTo(T other); // parameter has type T
> }
> ```
>
> *"For example, a class that implements Comparable\<Employee> must supply a method"*
>
> ```java
> int compareTo(Employee other)
> ```
>
> *"You can still use the “raw” Comparable type without a type parameter. Then the compareTo method has a parameter of type Object, and you have to manually cast that parameter of the compareTo method to the desired type. I will do just that for a little while so that you don't have to worry about two new concepts at the same time."*
>
> **Dịch:** Từ **Java 5**, `Comparable` được nâng cấp thành **generic type**. Class implement `Comparable<Employee>` phải cung cấp method `int compareTo(Employee other)`. Bạn **vẫn dùng được** kiểu `Comparable` **"raw"** không có type parameter — khi đó `compareTo` nhận parameter kiểu `Object` và bạn **phải tự cast** parameter đó về kiểu mong muốn. Tác giả sẽ làm đúng như vậy trong ít trang tới để bạn **không phải bận tâm hai khái niệm mới cùng lúc**.

> *"All methods of an interface are automatically public. For that reason, it is not necessary to supply the keyword public when declaring a method in an interface."*

**Dịch:** **Mọi method của interface đều tự động là `public`.** Vì vậy **không cần ghi keyword `public`** khi khai báo method trong interface.

> *"Of course, there is an additional requirement that the interface syntax cannot express: When calling x.compareTo(y), the compareTo method must compare the two objects and return an indication whether x or y is larger. The method is supposed to return a negative number if x is smaller than y, zero if they are equal, and a positive number otherwise."*

**Dịch:** Dĩ nhiên còn một yêu cầu nữa mà **cú pháp interface không diễn đạt được**: khi gọi `x.compareTo(y)`, method phải so sánh hai object và cho biết `x` hay `y` lớn hơn. Method phải trả về **số âm nếu `x` nhỏ hơn `y`**, **0 nếu bằng nhau**, và **số dương** trong trường hợp còn lại.

> *"This particular interface has a single method. Some interfaces have multiple methods. As you will see later, interfaces can also define constants. What is more important, however, is what interfaces cannot supply. Interfaces never have instance fields. Before Java 8, all methods in an interface were abstract. As you will see in Section 6.1.4 and Section 6.1.5, it is now possible to have other methods in interfaces. Of course, those methods cannot refer to instance fields—interfaces don't have any."*

**Dịch:** Interface này chỉ có **một method**. Có interface nhiều method. Interface cũng **định nghĩa được constant**. Nhưng quan trọng hơn là những gì interface **không cung cấp được**: **interface không bao giờ có instance field**. Trước Java 8, **mọi method trong interface đều là abstract**. Nay có thể có method loại khác (mục 6.1.4 và 6.1.5). Dĩ nhiên những method đó **không tham chiếu tới instance field được** — interface làm gì có instance field.

### Hai bước để class implement một interface

> *"To make a class implement an interface, you carry out two steps:"*
>
> *"1. You declare that your class intends to implement the given interface."*
> *"2. You supply definitions for all methods in the interface."*

**Dịch:**

| Bước | Việc phải làm |
|---|---|
| 1 | **Khai báo** rằng class của bạn có ý định implement interface đó |
| 2 | **Cung cấp định nghĩa cho mọi method** trong interface |

> *"To declare that a class implements an interface, use the implements keyword:"*

```java
class Employee implements Comparable
```

> *"Of course, now the Employee class needs to supply the compareTo method. Let’s suppose that we want to compare employees by their salary. Here is an implementation of the compareTo method:"*

```java
public int compareTo(Object otherObject)
{
    Employee other = (Employee) otherObject;
    return Double.compare(salary, other.salary);
}
```

> *"Here, we use the static Double.compare method that returns a negative if the first argument is less than the second argument, 0 if they are equal, and a positive value otherwise."*

**Dịch:** Dùng keyword **`implements`**. Ở đây ta dùng static method `Double.compare`, trả về **số âm** nếu argument thứ nhất nhỏ hơn argument thứ hai, **0** nếu bằng nhau, **số dương** trong trường hợp còn lại.

> **Caution (sách):** *"In the interface declaration, the compareTo method was not declared public because all methods in an interface are automatically public. However, when implementing the interface, you must declare the method as public. Otherwise, the compiler assumes that the method has package access—the default for a class. The compiler then complains that you're trying to supply a more restrictive access privilege."*
>
> **Dịch:** Trong khai báo interface, `compareTo` **không ghi `public`** vì mọi method của interface **tự động public**. Nhưng **khi implement interface, bạn BẮT BUỘC phải khai báo method là `public`**. Nếu không, compiler cho rằng method có [[08 - Packages|package access]] — mức mặc định của class — rồi báo lỗi vì bạn **đang cấp quyền truy cập hạn chế hơn**.

> *"We can do a little better by supplying a type parameter for the generic Comparable interface:"*

```java
class Employee implements Comparable<Employee>
{
    public int compareTo(Employee other)
    {
        return Double.compare(salary, other.salary);
    }
    . . .
}
```

> *"Note that the unsightly cast of the Object parameter has gone away."*

**Dịch:** Làm tốt hơn được bằng cách **đưa type parameter** vào interface generic `Comparable`. Khi đó **cái cast xấu xí** của parameter `Object` **biến mất**.

> **Tip (sách):** *"The compareTo method of the Comparable interface returns an integer. If the objects are not equal, it does not matter what negative or positive value you return. This flexibility can be useful when you are comparing integer fields. For example, suppose each employee has a unique integer id and you want to sort by the employee ID number. Then you can simply return id - other.id. That value will be some negative value if the first ID number is less than the other, 0 if they are the same ID, and some positive value otherwise. However, there is one caveat: The range of the integers must be small enough so that the subtraction does not overflow. If you know that the IDs are not negative or that their absolute value is at most (Integer.MAX_VALUE - 1) / 2, you are safe. Otherwise, call the static Integer.compare method."*
>
> *"Of course, the subtraction trick doesn’t work for floating-point numbers. The difference salary - other.salary can round to 0 if the salaries are close together but not identical. The call Double.compare(x, y) simply returns -1 if x < y or 1 if x > y."*
>
> **Dịch:** `compareTo` trả về integer. Nếu hai object **không bằng nhau**, việc bạn trả về **giá trị âm/dương cụ thể nào cũng không quan trọng**. Sự linh hoạt này tiện khi so sánh field integer: cứ `return id - other.id`. Tuy vậy có **một cảnh báo**: khoảng giá trị của integer phải **đủ nhỏ để phép trừ không tràn số (overflow)**. Nếu biết ID **không âm** hoặc **trị tuyệt đối tối đa là `(Integer.MAX_VALUE - 1) / 2`** thì an toàn. Ngược lại, hãy gọi static method `Integer.compare`.
>
> Mẹo trừ này **không dùng được cho số floating-point**: hiệu `salary - other.salary` **có thể làm tròn thành 0** nếu hai mức lương gần nhau nhưng không bằng nhau. Lời gọi `Double.compare(x, y)` **đơn giản trả về `-1` nếu `x < y`, `1` nếu `x > y`**.

> **Note (sách):** *"The documentation of the Comparable interface suggests that the compareTo method should be compatible with the equals method. That is, x.compareTo(y) should be zero exactly when x.equals(y). Most classes in the Java API that implement Comparable follow this advice."*
>
> *"A notable exception is BigDecimal. Consider x = new BigDecimal("1.0") and y = new BigDecimal("1.00"). Then x.equals(y) is false because the numbers differ in precision. But x.compareTo(y) is zero. Ideally, it shouldn't be, but there is no obvious way of deciding which one should come first."*
>
> *"Another exception is StringBuilder, which implements Comparable but does not override equals:"*
>
> ```java
> StringBuilder x = new StringBuilder("Hello");
> StringBuilder y = new StringBuilder("Hello");
> x.equals(y) // false
> x.compareTo(y) // 0
> ```
>
> **Dịch:** Tài liệu của `Comparable` khuyến nghị `compareTo` nên **tương thích với `equals`**: `x.compareTo(y)` bằng 0 **đúng khi** `x.equals(y)`. Phần lớn class trong Java API implement `Comparable` đều theo lời khuyên này.
>
> **Ngoại lệ đáng chú ý là `BigDecimal`**: với `new BigDecimal("1.0")` và `new BigDecimal("1.00")` thì `equals` cho `false` (khác nhau về **độ chính xác**) nhưng `compareTo` cho **0**. Lý tưởng thì không nên vậy, nhưng **không có cách hiển nhiên** để quyết định cái nào đứng trước.
>
> Ngoại lệ khác là **`StringBuilder`** — implement `Comparable` nhưng **không override `equals`**.

> **Caution (sách):** *"There are minor differences between comparison operators with double operand and the corresponding methods of the Double class."*
>
> *"The first issue is negative zero, or -0.0. When compared with a relational operator such as == or <, it is indistinguishable from 0.0:"*
>
> ```java
> -0.0 == 0.0 // true
> -0.0 < 0.0 // false
> ```
>
> *"However, wrapped into Double instances, they are different:"*
>
> ```java
> Double.valueOf(-0.0).equals(Double.valueOf(0.0)) // false
> Double.valueOf(-0.0).compareTo(Double.valueOf(0.0)) // -1
> ```
>
> *"The other issue is Double.NaN. Any comparison with a relational operator where an operand is NaN returns false:"*
>
> ```java
> Double.NaN == Double.NaN // false
> Double.NaN < Double.NaN // false
> ```
>
> *"However, wrapped into a Double value, it behaves differently:"*
>
> ```java
> Double.valueOf(Double.NaN).equals(Double.valueOf(Double.NaN)) // true
> Double.valueOf(Double.NaN).compareTo(Double.valueOf(Double.NaN)) // 0
> ```
>
> *"The static Double.compare method follows the logic of the wrapper class:"*
>
> ```java
> Double.compare(-0.0, 0.0) // -1
> ```
>
> *"Remarkably, Double.NaN is deemed larger than Double.POSITIVE_INFINITY:"*
>
> ```java
> Double.compare(Double.POSITIVE_INFINITY, Double.NaN) // -1
> ```
>
> *"Note that the equals method of a record with double components uses Double.compare."*
>
> **Dịch:** Có **khác biệt nhỏ** giữa [[04 - Operators|toán tử so sánh]] trên toán hạng `double` và các method tương ứng của class `Double`.
>
> Vấn đề thứ nhất là **số không âm `-0.0`**: với toán tử quan hệ (`==`, `<`) nó **không phân biệt được với `0.0`**; nhưng khi **bọc vào instance `Double`** thì **chúng khác nhau**.
>
> Vấn đề thứ hai là **`Double.NaN`**: mọi so sánh bằng toán tử quan hệ có toán hạng là `NaN` đều trả về `false`; nhưng khi bọc vào `Double` thì **hành xử khác hẳn**.
>
> Static method `Double.compare` **theo logic của wrapper class**. Đáng chú ý: **`Double.NaN` được coi là lớn hơn `Double.POSITIVE_INFINITY`**. Và method `equals` của một [[07 - Records|record]] có component kiểu `double` **dùng `Double.compare`**.

### Vì sao phải có interface?

> *"Now you saw what a class must do to avail itself of the sorting service—it must implement a compareTo method. That’s eminently reasonable. There needs to be some way for the sort method to compare objects. But why can’t the Employee class simply provide a compareTo method without implementing the Comparable interface?"*

> *"The reason for interfaces is that the Java programming language is strongly typed. When making a method call, the compiler needs to be able to check that the method actually exists. Somewhere in the sort method will be statements like this:"*

```java
if (a[i].compareTo(a[j]) > 0)
{
    // rearrange a[i] and a[j]
    . . .
}
```

> *"The compiler must know that a[i] actually has a compareTo method. If a is an array of Comparable objects, then the existence of the method is assured because every class that implements the Comparable interface must supply the method."*

**Dịch:** Nhưng **tại sao class `Employee` không thể chỉ cung cấp method `compareTo` mà khỏi implement interface `Comparable`?**

Lý do phải có interface là vì Java là ngôn ngữ **strongly typed**. Khi gọi method, **compiler cần kiểm tra được rằng method thực sự tồn tại**. Bên trong method `sort` sẽ có câu lệnh như trên. Compiler **phải biết `a[i]` thực sự có method `compareTo`**. Nếu `a` là array các object `Comparable` thì **sự tồn tại của method được đảm bảo**, vì mọi class implement `Comparable` **đều phải cung cấp method đó**.

> **Note (sách):** *"You would expect that the sort method in the Arrays class is defined to accept a Comparable[] array so that the compiler can complain if anyone ever calls sort with an array whose element type doesn’t implement the Comparable interface. Sadly, that is not the case. Instead, the sort method accepts an Object[] array and uses a clumsy cast:"*
>
> ```java
> // approach used in the standard library--not recommended
> if (((Comparable) a[i]).compareTo(a[j]) > 0)
> {
>     // rearrange a[i] and a[j]
>     . . .
> }
> ```
>
> *"If a[i] does not belong to a class that implements the Comparable interface, the virtual machine throws an exception."*
>
> **Dịch:** Bạn hẳn mong method `sort` của `Arrays` được định nghĩa nhận **array `Comparable[]`** để compiler báo lỗi nếu ai đó gọi `sort` với array có kiểu phần tử không implement `Comparable`. **Đáng tiếc là không phải vậy.** `sort` nhận **array `Object[]`** và dùng một **cast vụng về**. Nếu `a[i]` không thuộc class implement `Comparable` thì **virtual machine ném exception**.

### Listing 6.1 — `interfaces/EmployeeSortTest.java`

```java
package interfaces;

import java.util.*;

/**
 * This program demonstrates the use of the Comparable interface.
 * @version 1.30 2004-02-27
 * @author Cay Horstmann
 */
public class EmployeeSortTest
{
    public static void main(String[] args)
    {
        var staff = new Employee[3];

        staff[0] = new Employee("Harry Hacker", 35000);
        staff[1] = new Employee("Carl Cracker", 75000);
        staff[2] = new Employee("Tony Tester", 38000);

        Arrays.sort(staff);

        // print out information about all Employee objects
        for (Employee e : staff)
            System.out.println("name=" + e.getName() + ",salary=" + e.getSalary());
    }
}
```

### Listing 6.2 — `interfaces/Employee.java`

```java
package interfaces;

public class Employee implements Comparable<Employee>
{
    private String name;
    private double salary;

    public Employee(String name, double salary)
    {
        this.name = name;
        this.salary = salary;
    }

    public String getName()
    {
        return name;
    }

    public double getSalary()
    {
        return salary;
    }

    public void raiseSalary(double byPercent)
    {
        double raise = salary * byPercent / 100;
        salary += raise;
    }

    /**
     * Compares employees by salary.
     * @param other another Employee object
     * @return a negative value if this employee has a lower salary than
     * other, 0 if the salaries are the same, a positive value otherwise
     */
    public int compareTo(Employee other)
    {
        return Double.compare(salary, other.salary);
    }
}
```

## API — `java.lang.Comparable<T>` (Java 1.0)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `int compareTo(T other)` | So sánh object này với `other`, trả về **số nguyên âm** nếu object này nhỏ hơn `other`, **0** nếu bằng nhau, **số nguyên dương** trong trường hợp còn lại. |

## API — `java.util.Arrays` (Java 1.2)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `static void sort(Object[] a)` | Sắp xếp các phần tử trong array `a`. Mọi phần tử **phải thuộc class implement interface `Comparable`**, và **phải so sánh được với nhau**. |

## API — `java.lang.Integer` (Java 1.0)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `static int compare(int x, int y)` *(Java 7)* | Trả về **số nguyên âm** nếu `x < y`, **0** nếu `x` và `y` bằng nhau, **số nguyên dương** trong trường hợp còn lại. |

## API — `java.lang.Double` (Java 1.0)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `static int compare(double x, double y)` *(Java 1.4)* | Trả về **số nguyên âm** nếu `x < y`, **0** nếu `x` và `y` bằng nhau, **số nguyên dương** trong trường hợp còn lại. |

> **Note (sách):** *"According to the language standard: “The implementor must ensure sgn(x.compareTo(y)) = -sgn(y.compareTo(x)) for all x and y. (This implies that x.compareTo(y) must throw an exception if y.compareTo(x) throws an exception.)” Here, sgn is the sign of a number: sgn(n) is –1 if n is negative, 0 if n equals 0, and 1 if n is positive. In plain English, if you flip the arguments of compareTo, the sign (but not necessarily the actual value) of the result must also flip."*
>
> *"As with the equals method, problems can arise when inheritance comes into play. Since Manager extends Employee, it implements Comparable\<Employee> and not Comparable\<Manager>. If Manager chooses to override compareTo, it must be prepared to compare managers to employees. It can’t simply cast an employee to a manager:"*
>
> ```java
> class Manager extends Employee
> {
>     public int compareTo(Employee other)
>     {
>         Manager otherManager = (Manager) other; // NO
>         . . .
>     }
>     . . .
> }
> ```
>
> *"That violates the “antisymmetry” rule. If x is an Employee and y is a Manager, then the call x.compareTo(y) doesn’t throw an exception—it simply compares x and y as employees. But the reverse, y.compareTo(x), throws a ClassCastException."*
>
> *"This is the same situation as with the equals method discussed in Chapter 5, and the remedy is the same. There are two distinct scenarios."*
>
> *"If subclasses have different notions of comparison, then you should outlaw comparison of objects that belong to different classes. Each compareTo method should start out with the test"*
>
> ```java
> if (getClass() != other.getClass()) throw new ClassCastException();
> ```
>
> *"If there is a common algorithm for comparing subclass objects, simply provide a single compareTo method in the superclass and declare it as final."*
>
> *"For example, suppose you want managers to be better than regular employees, regardless of salary. What about other subclasses such as Executive and Secretary? If you need to establish a pecking order, supply a method such as rank in the Employee class. Have each subclass override rank, and implement a single compareTo method that takes the rank values into account."*
>
> **Dịch:** Theo chuẩn ngôn ngữ: *"Người implement phải đảm bảo `sgn(x.compareTo(y)) = -sgn(y.compareTo(x))` với mọi `x` và `y`. (Điều này hàm ý `x.compareTo(y)` phải ném exception nếu `y.compareTo(x)` ném exception.)"* Ở đây `sgn` là **dấu của một số**: `sgn(n)` bằng **–1** nếu `n` âm, **0** nếu `n` bằng 0, **1** nếu `n` dương. Nói nôm na: **đảo argument của `compareTo` thì dấu của kết quả cũng phải đảo** (giá trị cụ thể thì không nhất thiết).
>
> Giống method `equals`, **vấn đề nảy sinh khi có inheritance**. Vì `Manager` extends `Employee` nên nó implement `Comparable<Employee>` **chứ không phải** `Comparable<Manager>`. Nếu `Manager` override `compareTo` thì nó **phải sẵn sàng so sánh manager với employee**, **không được cast thẳng** một employee thành manager. Làm vậy là **vi phạm quy tắc "antisymmetry"**: `x.compareTo(y)` không ném exception, chỉ so sánh như employee; còn chiều ngược lại `y.compareTo(x)` **ném `ClassCastException`**.
>
> Đây đúng là tình huống đã bàn với `equals` ở Chapter 5, và cách chữa cũng vậy. Có **hai kịch bản riêng biệt**:
>
> | Kịch bản | Cách xử lý |
> |---|---|
> | Các subclass có **quan niệm so sánh khác nhau** | **Cấm** so sánh object thuộc class khác nhau: mỗi `compareTo` bắt đầu bằng `if (getClass() != other.getClass()) throw new ClassCastException();` |
> | Có **thuật toán chung** để so sánh object subclass | Cung cấp **một `compareTo` duy nhất ở superclass** và khai báo nó là **`final`** |
>
> Ví dụ: muốn manager **luôn hơn** nhân viên thường bất kể lương thì sao? Còn các subclass khác như `Executive`, `Secretary`? Nếu cần lập **thứ bậc**, hãy cung cấp một method kiểu `rank` trong class `Employee`, cho mỗi subclass **override `rank`**, rồi implement **một `compareTo` duy nhất** có tính tới giá trị `rank`.

---

## 6.1.2. Properties of Interfaces

> *"Interfaces are not classes. In particular, you can never use the new operator to instantiate an interface:"*

```java
x = new Comparable(. . .); // ERROR
```

> *"However, even though you can’t construct interface objects, you can still declare interface variables."*

```java
Comparable x; // OK
```

> *"An interface variable must refer to an object of a class that implements the interface:"*

```java
x = new Employee(. . .); // OK provided Employee implements Comparable
```

**Dịch:** **Interface không phải class.** Cụ thể, **không bao giờ dùng được toán tử `new` để tạo instance của interface**. Nhưng dù không dựng được object interface, bạn **vẫn khai báo được biến kiểu interface**. Biến interface **phải trỏ tới object của một class implement interface đó**.

> *"Next, just as you use instanceof to check whether an object is of a specific class, you can use instanceof to check whether an object implements an interface:"*

```java
if (anObject instanceof Comparable) { . . . }
```

**Dịch:** Giống như dùng `instanceof` để kiểm tra object có thuộc một class cụ thể không, bạn **dùng `instanceof` để kiểm tra object có implement một interface hay không**.

### Interface extends interface

> *"Just as you can build hierarchies of classes, you can extend interfaces. This allows for multiple chains of interfaces that go from a greater degree of generality to a greater degree of specialization. For example, suppose you had an interface called Moveable."*

```java
public interface Moveable
{
    void move(double x, double y);
}
```

> *"Then, you could imagine an interface called Powered that extends it:"*

```java
public interface Powered extends Moveable
{
    double milesPerGallon();
}
```

**Dịch:** Giống như xây **cây phân cấp class**, bạn **extend được interface**. Nhờ vậy có **nhiều chuỗi interface** đi từ **tổng quát hơn** tới **chuyên biệt hơn**.

### Constant trong interface

> *"Although you cannot put instance fields in an interface, you can supply constants in them. For example:"*

```java
public interface Powered extends Moveable
{
    double milesPerGallon();
    double SPEED_LIMIT = 95; // a public static final constant
}
```

> *"Just as methods in an interface are automatically public, fields are always public static final."*

**Dịch:** Dù **không đặt được instance field vào interface**, bạn **cung cấp được constant**. Giống như method trong interface tự động `public`, **field thì luôn luôn là `public static final`**.

> **Note (sách):** *"It is legal to tag interface methods as public, and fields as public static final. Some programmers do that, either out of habit or for greater clarity. However, the Java Language Specification recommends that the redundant keywords not be supplied, and I follow that recommendation."*
>
> **Dịch:** Ghi `public` cho method interface và `public static final` cho field là **hợp lệ**. Vài lập trình viên làm vậy do thói quen hoặc cho rõ ràng hơn. Tuy nhiên **Java Language Specification khuyến nghị không ghi các keyword thừa** đó, và tác giả theo khuyến nghị này.

### Implement nhiều interface

> *"While each class can have only one superclass, classes can implement multiple interfaces. This gives you the maximum amount of flexibility in defining a class’s behavior. For example, the Java programming language has an important interface built into it, called Cloneable. (This interface is discussed in detail in Section 6.1.9.) If your class implements Cloneable, the clone method in the Object class will make an exact copy of your class’s objects. If you want both cloneability and comparability, simply implement both interfaces. Use commas to separate the interfaces that you want to implement:"*

```java
class Employee implements Cloneable, Comparable
```

**Dịch:** Mỗi class **chỉ có một superclass**, nhưng class **implement được nhiều interface**. Điều này cho bạn **mức linh hoạt tối đa** khi định nghĩa hành vi của class. Ví dụ Java có sẵn interface quan trọng **`Cloneable`**: nếu class implement `Cloneable` thì method `clone` trong class `Object` sẽ **tạo bản sao y hệt** của object thuộc class đó. Muốn vừa clone được vừa so sánh được thì **implement cả hai interface**, **ngăn cách bằng dấu phẩy**.

> **Note (sách):** *"Records and enumeration classes cannot extend other classes (since they implicitly extend the Record and Enum class). However, they can implement interfaces."*
>
> **Dịch:** [[07 - Records|Record]] và enumeration class **không extend class khác được** (vì chúng **ngầm extend class `Record` và `Enum`**). Nhưng chúng **implement interface được**.

> **Note (sách):** *"Interfaces can be sealed. As with sealed classes, the direct subtypes (which can be classes or interfaces) must be declared in a permits clause or be located in the same source file."*
>
> **Dịch:** Interface **có thể là sealed**. Giống sealed class, các **subtype trực tiếp** (có thể là class hoặc interface) phải được **khai báo trong mệnh đề `permits`** hoặc **nằm trong cùng file nguồn**.

---

## 6.1.3. Interfaces and Abstract Classes

> *"If you read the section about abstract classes in Chapter 5, you may wonder why the designers of the Java programming language bothered with introducing the concept of interfaces. Why can’t Comparable simply be an abstract class:"*

```java
abstract class Comparable // why not?
{
    public abstract int compareTo(Object other);
}
```

> *"The Employee class would then simply extend this abstract class and supply the compareTo method:"*

```java
class Employee extends Comparable // why not?
{
    public int compareTo(Object other) { . . . }
}
```

**Dịch:** Nếu đã đọc phần [[06 - Abstract Classes|abstract class ở Chapter 5]], bạn có thể thắc mắc **tại sao nhà thiết kế Java lại phải giới thiệu khái niệm interface**. Sao `Comparable` không đơn giản là một **abstract class**?

> *"There is, unfortunately, a major problem with using an abstract base class to express a generic property. A class can only extend a single class. Suppose the Employee class already extends a different class, say, Person. Then it can’t extend a second class."*

```java
class Employee extends Person, Comparable // ERROR
```

> *"But each class can implement as many interfaces as it likes:"*

```java
class Employee extends Person implements Comparable // OK
```

**Dịch:** Đáng tiếc, dùng **abstract base class** để diễn đạt một **tính chất tổng quát** có **vấn đề lớn**: **một class chỉ extend được duy nhất một class**. Giả sử `Employee` đã extend class khác, chẳng hạn `Person`, thì **không extend thêm class thứ hai được**. Nhưng mỗi class **implement bao nhiêu interface tuỳ thích**.

> *"Other programming languages, in particular C++, allow a class to have more than one superclass. This feature is called multiple inheritance. The designers of Java chose not to support multiple inheritance, because it makes the language either very complex (as in C++) or less efficient (as in Eiffel)."*

> *"Instead, interfaces afford most of the benefits of multiple inheritance while avoiding the complexities and inefficiencies."*

**Dịch:** Vài ngôn ngữ khác, đặc biệt là C++, cho phép một class có **nhiều superclass** — tính năng gọi là **multiple inheritance**. Nhà thiết kế Java **chọn không hỗ trợ multiple inheritance**, vì nó khiến ngôn ngữ **hoặc rất phức tạp** (như C++) **hoặc kém hiệu quả** (như Eiffel). Thay vào đó, **interface mang lại phần lớn lợi ích của multiple inheritance** mà **tránh được sự phức tạp và kém hiệu quả**.

> **C++ Note (sách):** *"C++ has multiple inheritance and all the complications that come with it, such as virtual base classes, dominance rules, and transverse pointer casts. Few C++ programmers use multiple inheritance, and some say it should never be used. Other programmers recommend using multiple inheritance only for the “mix-in” style of inheritance. In the mix-in style, a primary base class describes the parent object, and additional base classes (the so-called mix-ins) may supply auxiliary characteristics. That style is similar to a Java class with a single superclass and additional interfaces."*
>
> **Dịch:** C++ có multiple inheritance cùng **mọi rắc rối đi kèm**: virtual base class, dominance rule, transverse pointer cast. **Rất ít lập trình viên C++ dùng multiple inheritance**, một số người bảo **không bao giờ nên dùng**. Số khác khuyến nghị chỉ dùng theo **kiểu "mix-in"**: một base class chính mô tả object cha, các base class thêm (gọi là **mix-in**) cung cấp **đặc tính phụ trợ**. Kiểu đó **tương tự một class Java có một superclass duy nhất cộng thêm các interface**.

> **Tip (sách):** *"You have seen the CharSequence interface in Chapter 3. Both String and StringBuilder (as well as a few more esoteric string-like classes) implement this interface. The interface contains methods that are common to all classes that manage sequences of characters. A common interface encourages programmers to write methods that use the CharSequence interface. Those methods work with instances of String, StringBuilder, and the other string-like classes."*
>
> *"Sadly, the CharSequence interface is rather paltry. You can get the length, iterate over the code points or code units, extract subsequences, and lexicographically compare two sequences. Java 17 adds an isEmpty method."*
>
> *"If you process strings, and those operations suffice for your tasks, accept CharSequence instances instead of strings."*
>
> **Dịch:** Bạn đã gặp interface **`CharSequence`** ở [[05 - Strings|Chapter 3]]. Cả `String` lẫn `StringBuilder` (và vài class kiểu chuỗi ít gặp hơn) đều implement interface này. Interface chứa các method **chung cho mọi class quản lý dãy ký tự**. Một interface chung **khuyến khích lập trình viên viết method dùng `CharSequence`** — những method đó chạy được với instance của `String`, `StringBuilder` và các class kiểu chuỗi khác.
>
> Đáng tiếc, `CharSequence` **khá nghèo nàn**: lấy được độ dài, duyệt code point hay code unit, trích subsequence, và so sánh hai dãy theo thứ tự từ điển. **Java 17 thêm method `isEmpty`.**
>
> Nếu bạn xử lý chuỗi và các thao tác đó là đủ, hãy **nhận `CharSequence` thay vì `String`**.

---

## 6.1.4. Static and Private Methods

> *"As of Java 8, you are allowed to add static methods to interfaces. There was never a technical reason why this should be outlawed. It simply seemed to be against the spirit of interfaces as abstract specifications."*

> *"Previously, it had been common to place static methods in companion classes. In the standard library, you'll find pairs of interfaces and utility classes such as Collection/Collections."*

**Dịch:** Từ **Java 8**, bạn được phép **thêm [[04 - Static Fields and Methods|static method]] vào interface**. Chưa từng có lý do kỹ thuật nào cấm chuyện này — nó chỉ **có vẻ trái với tinh thần** của interface như một **bản đặc tả abstract**. Trước đây thường **đặt static method vào companion class**: trong standard library có những cặp interface/utility class như **`Collection`/`Collections`**.

> *"As an example, you can construct a path to a file or directory from a URI, or from a sequence of strings, using static methods in the Path interface:"*

```java
public interface Path
{
    public static Path of(URI uri) { . . . }
    public static Path of(String first, String... more) { . . . }
    . . .
}
```

> *"In previous versions of Java, there was a separate Paths class to hold these methods. Nowadays, there is no longer a reason to provide a separate companion class for utility methods."*

**Dịch:** Ví dụ: dựng path tới file hay directory từ một `URI` hoặc một dãy string bằng **static method trong interface `Path`**. Ở các phiên bản Java trước có **class `Paths` riêng** chứa các method này. Ngày nay **không còn lý do gì phải cung cấp companion class riêng** cho utility method nữa.

> *"Methods in an interface can be private. A private method can be static or an instance method. Since private methods can only be used in the methods of the interface itself, their use is limited to being helper methods for the other methods of the interface."*

**Dịch:** Method trong interface **có thể là `private`**. Một private method **có thể là static hoặc instance method**. Vì private method **chỉ dùng được trong chính các method của interface**, công dụng của chúng **giới hạn ở vai trò helper method** cho các method khác của interface.

---

## 6.1.5. Default Methods

> *"You can supply a default implementation for any interface method. You must tag such a method with the default modifier."*

```java
public interface Comparable<T>
{
    default int compareTo(T other) { return 0; }
    // by default, all elements are the same
}
```

**Dịch:** Bạn **cung cấp được implementation mặc định cho bất kỳ method nào của interface**. Phải **gắn modifier `default`** cho method như vậy.

> *"Of course, that is not very useful since every realistic implementation of Comparable would override this method. But there are other situations where default methods can be useful. For example, in Chapter 9 you will see an Iterator interface for visiting elements in a data structure. It declares a remove method as follows:"*

```java
public interface Iterator<E>
{
    boolean hasNext();
    E next();
    default void remove() { throw new UnsupportedOperationException("remove"); }
    . . .
}
```

> *"If you implement an iterator, you need to provide the hasNext and next methods. There are no defaults for these methods—they depend on the data structure that you are traversing. But if your iterator is read-only, you don't have to worry about the remove method."*

**Dịch:** Ví dụ trên **không hữu ích lắm** vì mọi implementation thực tế của `Comparable` đều sẽ override method này. Nhưng có tình huống khác default method **rất có ích**: interface `Iterator` (Chapter 9) khai báo `remove` như trên. Khi implement một iterator, bạn **phải cung cấp `hasNext` và `next`** — hai method này **không có default** vì chúng **phụ thuộc vào cấu trúc dữ liệu** bạn đang duyệt. Nhưng nếu iterator của bạn **chỉ đọc** thì **khỏi bận tâm tới `remove`**.

> *"A default method can call other methods. For example, a Collection interface can define a convenience method"*

```java
public interface Collection
{
    int size(); // an abstract method
    default boolean isEmpty() { return size() == 0; }
    . . .
}
```

> *"Then a programmer implementing Collection doesn't have to worry about implementing an isEmpty method."*

**Dịch:** **Default method gọi được method khác.** Khi đó lập trình viên implement `Collection` **khỏi phải bận tâm implement `isEmpty`**.

> **Note (sách):** *"The Collection interface in the Java API does not actually do this. Instead, there is a class AbstractCollection that implements Collection and defines isEmpty in terms of size. Implementors of a collection are advised to extend AbstractCollection. That technique is obsolete. Just implement the methods in the interface."*
>
> **Dịch:** Interface `Collection` trong Java API **thực ra không làm vậy**. Thay vào đó có class **`AbstractCollection`** implement `Collection` và định nghĩa `isEmpty` dựa trên `size`. Người viết collection được khuyên extend `AbstractCollection`. **Kỹ thuật đó đã lỗi thời.** Cứ **implement thẳng method trong interface**.

### Interface evolution

> *"An important use for default methods is interface evolution. Consider, for example, the Collection interface that has been a part of Java for many years. Suppose that a long time ago, you provided a class"*

```java
public class Bag implements Collection
```

> *"Later, in Java 8, a stream method was added to the interface."*

> *"Suppose the stream method was not a default method. Then the Bag class would no longer compile since it doesn't implement the new method. Adding a nondefault method to an interface is not source-compatible."*

> *"But suppose you don't recompile the class and simply use an old JAR file containing it. The class will still load, even with the missing method. Programs can still construct Bag instances, and nothing bad will happen. (Adding a method to an interface is binary compatible.) However, if a program calls the stream method on a Bag instance, an AbstractMethodError occurs."*

> *"Making the method a default method solves both problems. The Bag class will again compile. And if the class is loaded without being recompiled and the stream method is invoked on a Bag instance, the Collection.stream method is called."*

**Dịch:** Một công dụng quan trọng của default method là **interface evolution** (tiến hoá interface). Giả sử từ lâu bạn viết class `Bag implements Collection`. Về sau, ở **Java 8**, method `stream` được **thêm vào interface**.

| Tình huống | Hậu quả |
|---|---|
| `stream` **không phải** default method | Class `Bag` **không compile được nữa** — thêm method non-default vào interface **không source-compatible** |
| Không recompile, dùng file [[09 - JAR Files\|JAR]] cũ | Class **vẫn load được** dù thiếu method; vẫn dựng được instance `Bag`, **không có gì tệ xảy ra** (thêm method vào interface là **binary compatible**). Nhưng nếu chương trình **gọi `stream` lên instance `Bag`** thì xảy ra **`AbstractMethodError`** |
| Biến `stream` thành **default method** | **Giải quyết cả hai vấn đề**: `Bag` compile lại được; và nếu class được load mà không recompile rồi `stream` được gọi lên instance `Bag` thì **`Collection.stream` được gọi** |

---

## 6.1.6. Resolving Default Method Conflicts

> *"What happens if the exact same method is defined as a default method in one interface and then again as a method of a superclass or another interface? Languages such as Scala and C++ have complex rules for resolving such ambiguities. Fortunately, the rules in Java are much simpler. Here they are:"*
>
> *"1. Superclasses win. If a superclass provides a concrete method, default methods with the same name and parameter types are simply ignored."*
> *"2. Interfaces clash. If an interface provides a default method, and another interface contains a method with the same name and parameter types (default or not), then you must resolve the conflict by overriding that method."*

**Dịch:** Chuyện gì xảy ra nếu **cùng một method** được định nghĩa vừa là **default method ở một interface**, vừa là method của **superclass hoặc interface khác**? Scala và C++ có **luật phức tạp**; may thay **luật của Java đơn giản hơn nhiều**:

| # | Luật |
|---|---|
| 1 | **Superclass thắng.** Nếu superclass cung cấp **concrete method**, các default method **trùng tên và trùng kiểu parameter bị bỏ qua** |
| 2 | **Interface xung đột.** Nếu một interface cung cấp default method, và interface khác chứa method **trùng tên, trùng kiểu parameter** (default hay không cũng vậy), thì bạn **phải giải quyết xung đột bằng cách override method đó** |

> *"Let’s look at the second rule. Consider two interfaces with a getName method:"*

```java
interface Person
{
    default String getName() { return ""; }
}

interface Named
{
    default String getName() { return getClass().getName() + "_" + hashCode(); }
}
```

> *"What happens if you form a class that implements both of them?"*

```java
class Student implements Person, Named { . . . }
```

> *"The class inherits two inconsistent getName methods provided by the Person and Named interfaces. Instead of choosing one over the other, the Java compiler reports an error and leaves it up to the programmer to resolve the ambiguity. Simply provide a getName method in the Student class. In that method, you can choose one of the two conflicting methods, like this:"*

```java
class Student implements Person, Named
{
    public String getName() { return Person.super.getName(); }
    . . .
}
```

**Dịch:** Class thừa hưởng **hai method `getName` mâu thuẫn nhau** từ `Person` và `Named`. Thay vì tự chọn một trong hai, **compiler Java báo lỗi** và **để lập trình viên tự giải quyết**. Chỉ cần cung cấp method `getName` trong class `Student`, và trong đó **chọn một trong hai method xung đột** bằng cú pháp **`Person.super.getName()`**.

> *"Now assume that the Named interface does not provide a default implementation for getName:"*

```java
interface Named
{
    String getName();
}
```

> *"Can the Student class inherit the default method from the Person interface? This might be reasonable, but the Java designers decided in favor of uniformity. It doesn’t matter how two interfaces conflict. If at least one interface provides an implementation, the compiler reports an error, and the programmer must resolve the ambiguity."*

> *"If neither interface provides a default for a shared method, then there is no conflict. An implementing class has two choices: implement the method, or leave it unimplemented. In the latter case, the class is itself abstract."*

**Dịch:** Giả sử `Named` **không cung cấp implementation mặc định** cho `getName` — `Student` có thừa hưởng default method từ `Person` được không? Hợp lý đấy, nhưng **nhà thiết kế Java chọn tính nhất quán**: **hai interface xung đột kiểu gì không quan trọng** — chỉ cần **ít nhất một interface cung cấp implementation** là **compiler báo lỗi**, lập trình viên **phải tự khử nhập nhằng**.

Nếu **không interface nào cung cấp default** cho method dùng chung thì **không có xung đột**. Class implement có **hai lựa chọn**: **implement method**, hoặc **để nguyên không implement** — trường hợp sau thì **chính class đó là abstract**.

### Luật "class wins"

> *"We just discussed name clashes between two interfaces. Now consider a class that extends a superclass and implements an interface, inheriting the same method from both. For example, suppose that Person is a class and Student is defined as"*

```java
class Student extends Person implements Named { . . . }
```

> *"In that case, only the superclass method matters, and any default method from the interface is simply ignored. In our example, Student inherits the getName method from Person, and it doesn’t make any difference whether the Named interface provides a default for getName or not. This is the “class wins” rule."*

> *"The “class wins” rule ensures compatibility with old versions of Java. If you add default methods to an interface, it has no effect on code that worked before there were default methods."*

**Dịch:** Nay xét class vừa extend superclass vừa implement interface, **thừa hưởng cùng một method từ cả hai**. Trong trường hợp đó, **chỉ method của superclass là có ý nghĩa**, mọi default method từ interface **đơn giản bị bỏ qua**. Đây là luật **"class wins"**.

Luật "class wins" **đảm bảo tương thích với các phiên bản Java cũ**: thêm default method vào interface **không ảnh hưởng gì tới code đã chạy được từ trước khi có default method**.

> **Caution (sách):** *"You can never make a default method that redefines one of the methods in the Object class. For example, you can’t define a default method for toString or equals, even though that might be attractive for interfaces such as List. As a consequence of the “class wins” rule, such a method could never win against Object.toString or Object.equals."*
>
> **Dịch:** **Không bao giờ tạo được default method định nghĩa lại một method của class `Object`.** Ví dụ **không định nghĩa được default method cho `toString` hay `equals`**, dù điều đó nghe hấp dẫn với interface như `List`. Hệ quả của luật **"class wins"**: method như vậy **không bao giờ thắng nổi `Object.toString` hay `Object.equals`**.

---

## 6.1.7. Interfaces and Callbacks

> *"A common pattern in programming is the callback pattern. In this pattern, you specify the action that should occur whenever a particular event happens. For example, you may want a particular action to occur when a button is clicked or a menu item is selected. However, as you have not yet seen how to implement user interfaces, we will consider a similar but simpler situation."*

**Dịch:** Một pattern phổ biến trong lập trình là **callback pattern**: bạn **chỉ định hành động sẽ xảy ra mỗi khi một sự kiện cụ thể diễn ra** — ví dụ khi bấm nút hay chọn mục menu.

> *"The javax.swing package contains a Timer class that is useful if you want to be notified whenever a time interval has elapsed. For example, if a part of your program contains a clock, you can ask to be notified every second so that you can update the clock face."*

> *"When you construct a timer, you set the time interval and tell it what it should do whenever the time interval has elapsed."*

**Dịch:** Package `javax.swing` có class **`Timer`**, hữu ích khi bạn muốn **được thông báo mỗi khi một khoảng thời gian trôi qua**. Khi dựng timer, bạn **đặt khoảng thời gian** và **bảo nó phải làm gì** mỗi khi khoảng đó trôi qua.

> *"How do you tell the timer what it should do? In many programming languages, you supply the name of a function that the timer should call periodically. However, the classes in the Java standard library take an object-oriented approach. You pass an object of some class. The timer then calls one of the methods on that object. Passing an object is more flexible than passing a function because the object can carry additional information."*

**Dịch:** Ở nhiều ngôn ngữ khác, bạn đưa **tên một hàm** để timer gọi định kỳ. Nhưng các class trong Java standard library **theo hướng object-oriented**: bạn **truyền vào một object**, timer **gọi một trong các method của object đó**. **Truyền object linh hoạt hơn truyền hàm** vì object **mang theo được thông tin bổ sung**.

> *"Of course, the timer needs to know what method to call. The timer requires that you specify an object of a class that implements the ActionListener interface of the java.awt.event package. Here is that interface:"*

```java
public interface ActionListener
{
    void actionPerformed(ActionEvent event);
}
```

> *"The timer calls the actionPerformed method when the time interval has expired."*

**Dịch:** Timer đòi bạn chỉ định **object của class implement interface `ActionListener`** (package `java.awt.event`). Timer **gọi method `actionPerformed`** khi khoảng thời gian hết.

> *"Suppose you want to print a message “At the tone, the time is . . .”, followed by a beep, once every second. You would define a class that implements the ActionListener interface. You would then place whatever statements you want to have executed inside the actionPerformed method."*

```java
class TimePrinter implements ActionListener
{
    public void actionPerformed(ActionEvent event)
    {
        System.out.println("At the tone, the time is "
            + Instant.ofEpochMilli(event.getWhen()));
        Toolkit.getDefaultToolkit().beep();
    }
}
```

> *"Note the ActionEvent parameter of the actionPerformed method. This parameter gives information about the event, such as the time when the event happened. The call event.getWhen() returns the event time, measured in milliseconds since the “epoch” (January 1, 1970). By passing it to the static Instant.ofEpochMilli method, we get a more readable description."*

**Dịch:** Chú ý parameter `ActionEvent` của `actionPerformed`. Parameter này cho **thông tin về sự kiện**, chẳng hạn **thời điểm sự kiện xảy ra**. Lời gọi `event.getWhen()` trả về thời điểm sự kiện, tính bằng **millisecond kể từ "epoch" (1/1/1970)**. Truyền nó vào static method `Instant.ofEpochMilli` để có **mô tả dễ đọc hơn**.

> *"Next, construct an object of this class and pass it to the Timer constructor."*

```java
var listener = new TimePrinter();
Timer t = new Timer(1000, listener);
```

> *"The first argument of the Timer constructor is the time interval that must elapse between notifications, measured in milliseconds. We want to be notified every second. The second argument is the listener object."*

> *"Finally, start the timer."*

```java
t.start();
```

> *"Every second, a message like"*

```
At the tone, the time is 2017-12-16T05:01:49.550Z
```

> *"is displayed, followed by a beep."*

**Dịch:** Argument thứ nhất của constructor `Timer` là **khoảng thời gian giữa hai lần thông báo, tính bằng millisecond**; argument thứ hai là **object listener**. Cuối cùng **khởi động timer**. Mỗi giây một thông điệp được hiển thị, kèm tiếng bíp.

> **Caution (sách):** *"Be sure to import javax.swing.Timer. There is also a java.util.Timer class that is slightly different."*
>
> **Dịch:** Nhớ **import `javax.swing.Timer`**. Còn có class **`java.util.Timer`** hơi khác.

> *"Listing 6.3 puts the timer and its action listener to work. After the timer is started, the program puts up a message dialog and waits for the user to click the OK button to stop. While the program waits for the user, the current time is displayed every second. (If you omit the dialog, the program would terminate as soon as the main method exits.)"*

**Dịch:** Listing 6.3 cho timer và action listener của nó chạy. Sau khi timer khởi động, chương trình **bật một message dialog** và chờ người dùng bấm OK để dừng. Trong lúc chờ, thời gian hiện tại được hiển thị mỗi giây. (Nếu **bỏ dialog đi**, chương trình sẽ **kết thúc ngay khi method `main` thoát**.)

### Listing 6.3 — `timer/TimerTest.java`

```java
package timer;

/**
   @version 1.02 2017-12-14
   @author Cay Horstmann
*/

import java.awt.*;
import java.awt.event.*;
import java.time.*;
import javax.swing.*;

public class TimerTest
{
    public static void main(String[] args)
    {
        var listener = new TimePrinter();

        // construct a timer that calls the listener once every second
        var timer = new Timer(1000, listener);
        timer.start();

        // keep program running until the user selects "OK"
        JOptionPane.showMessageDialog(null, "Quit program?");
        System.exit(0);
    }
}

class TimePrinter implements ActionListener
{
    public void actionPerformed(ActionEvent event)
    {
        System.out.println("At the tone, the time is " + Instant.ofEpochMilli(event.getWhen()));
        Toolkit.getDefaultToolkit().beep();
    }
}
```

## API — `javax.swing.JOptionPane` (Java 1.2)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `static void showMessageDialog(Component parent, Object message)` | Hiển thị **hộp thoại** với một message prompt và **nút OK**. Hộp thoại được **canh giữa trên component `parent`**. Nếu `parent` là `null` thì **canh giữa màn hình**. |

## API — `javax.swing.Timer` (Java 1.2)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `Timer(int interval, ActionListener listener)` | Dựng một timer **thông báo cho `listener` mỗi khi `interval` millisecond trôi qua**. |
| `void start()` | **Khởi động** timer. Khi đã khởi động, timer **gọi `actionPerformed` lên các listener của nó**. |
| `void stop()` | **Dừng** timer. Khi đã dừng, timer **không còn gọi `actionPerformed`** lên các listener nữa. |

## API — `java.awt.Toolkit` (Java 1.0)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `static Toolkit getDefaultToolkit()` | Lấy **toolkit mặc định**. Một toolkit chứa **thông tin về môi trường GUI**. |
| `void beep()` | **Phát tiếng bíp.** |

---

## 6.1.8. The Comparator Interface

> *"In Section 6.1.1, you have seen how you can sort an array of objects, provided they are instances of classes that implement the Comparable interface. For example, you can sort an array of strings since the String class implements Comparable\<String>, and the String.compareTo method compares strings in dictionary order."*

> *"Now suppose we want to sort strings by increasing length, not in dictionary order. We can't have the String class implement the compareTo method in two ways—and at any rate, the String class isn't ours to modify."*

**Dịch:** Bạn đã biết cách sắp xếp array object miễn chúng là instance của class implement `Comparable`. Ví dụ sắp xếp array [[05 - Strings|string]] được vì `String` implement `Comparable<String>`, và `String.compareTo` so sánh **theo thứ tự từ điển**.

Giờ giả sử ta muốn **sắp xếp string theo độ dài tăng dần**, không theo thứ tự từ điển. Ta **không thể bắt class `String` implement `compareTo` theo hai kiểu** — mà đằng nào **`String` cũng không phải của ta để sửa**.

> *"To deal with this situation, there is a second version of the Arrays.sort method whose parameters are an array and a comparator—an instance of a class that implements the Comparator interface."*

```java
public interface Comparator<T>
{
    int compare(T first, T second);
}
```

> *"To compare strings by length, define a class that implements Comparator\<String>:"*

```java
class LengthComparator implements Comparator<String>
{
    public int compare(String first, String second)
    {
        return first.length() - second.length();
    }
}
```

**Dịch:** Để xử lý tình huống này có **phiên bản thứ hai của `Arrays.sort`**, nhận **một array và một comparator** — instance của class implement interface **`Comparator`**.

> *"To actually do the comparison, you need to make an instance:"*

```java
var comp = new LengthComparator();
if (comp.compare(words[i], words[j]) > 0) . . .
```

> *"Contrast this call with words[i].compareTo(words[j]). The compare method is called on the comparator object, not the string itself."*

**Dịch:** Để so sánh, bạn **phải tạo một instance**. So sánh lời gọi này với `words[i].compareTo(words[j])`: method `compare` **được gọi lên object comparator, chứ không phải lên chính string**.

> **Note (sách):** *"Even though the LengthComparator object has no state, you still need to make an instance of it. You need the instance to call the compare method—it is not a static method."*
>
> **Dịch:** Dù object `LengthComparator` **không có state nào**, bạn **vẫn phải tạo instance của nó**. Cần instance để gọi method `compare` — **nó không phải static method**.

> *"To sort an array, pass a LengthComparator object to the Arrays.sort method:"*

```java
String[] friends = { "Peter", "Paul", "Mary" };
Arrays.sort(friends, new LengthComparator());
```

> *"Now the array is either ["Paul", "Mary", "Peter"] or ["Mary", "Paul", "Peter"]."*

> *"You will see in Section 6.2 how to use a Comparator much more easily with a lambda expression."*

**Dịch:** Sau lời gọi, array **hoặc là** `["Paul", "Mary", "Peter"]` **hoặc là** `["Mary", "Paul", "Peter"]`. Mục 6.2 sẽ cho thấy cách dùng `Comparator` **dễ hơn nhiều với lambda expression**.

> **Note (sách):** *"The String class provides a Comparator for case-insensitive comparison. Here is how you can use it:"*
>
> ```java
> Arrays.sort(friends, String.CASE_INSENSITIVE_ORDER);
> ```
>
> **Dịch:** Class `String` cung cấp sẵn một `Comparator` để so sánh **không phân biệt hoa thường**.

> **Caution (sách):** *"Do not try to shuffle an array by sorting it with a comparator that randomly returns positive or negative integers."*
>
> *"There are three rules that a comparator needs to fulfill:"*
>
> *"1. Reflexivity: When x and y are equal, the comparator yields 0."*
> *"2. Antisymmetry: When swapping the arguments of the comparator, the sign of the result is swapped."*
> *"3. Transitivity: When x comes before y and y comes before z, then x must come before z."*
>
> *"The algorithm that Arrays.sort uses (called “Timsort”) doesn't check these rules for all elements, but it can sometimes detect a rule violation at a trivial cost. Then it throws an exception with the message “Comparison method violates its general contract!”. With an array of 1,000 elements, the chance of this occurring with a random comparator is over 10%."*
>
> *"The Collections.shuffle method randomly shuffles a list. To shuffle an array, first turn it into a list and then shuffle that."*
>
> **Dịch:** **Đừng thử xáo trộn array bằng cách sort nó với comparator trả về số dương/âm ngẫu nhiên.**
>
> Một comparator phải thoả **ba quy tắc**:
>
> | # | Quy tắc | Nội dung |
> |---|---|---|
> | 1 | **Reflexivity** | Khi `x` và `y` bằng nhau, comparator cho **0** |
> | 2 | **Antisymmetry** | Đảo argument của comparator thì **dấu của kết quả đảo theo** |
> | 3 | **Transitivity** | `x` đứng trước `y`, `y` đứng trước `z` thì `x` **phải** đứng trước `z` |
>
> Thuật toán `Arrays.sort` dùng (gọi là **"Timsort"**) **không kiểm tra các quy tắc này cho mọi phần tử**, nhưng đôi khi **phát hiện vi phạm với chi phí không đáng kể**. Khi đó nó ném exception với thông điệp *"Comparison method violates its general contract!"*. Với array **1.000 phần tử**, xác suất xảy ra chuyện này với comparator ngẫu nhiên là **trên 10%**.
>
> Method **`Collections.shuffle`** xáo trộn ngẫu nhiên một list. Muốn xáo trộn array thì **biến nó thành list trước rồi xáo trộn list đó**.

---

## 6.1.9. Object Cloning

> *"In this section, we discuss the Cloneable interface that indicates that a class has provided a safe clone method. Since cloning is not all that common, and the details are quite technical, you may just want to glance at this material until you need it."*

**Dịch:** Phần này bàn về interface **`Cloneable`**, thứ báo hiệu rằng class **đã cung cấp một method `clone` an toàn**. Vì cloning **không phổ biến lắm** và chi tiết **khá kỹ thuật**, bạn **cứ liếc qua** cho tới khi cần.

> *"To understand what cloning means, recall what happens when you make a copy of a variable holding an object reference. The original and the copy are references to the same object (see Figure 6.1). This means a change to either variable also affects the other."*

```java
var original = new Employee("John Public", 50000);
Employee copy = original;
copy.raiseSalary(10); // oops--also changed original
```

**Dịch:** Nhớ lại chuyện gì xảy ra khi bạn **copy một biến giữ object reference**: bản gốc và bản copy **là reference tới cùng một object**. Nghĩa là **thay đổi ở biến nào cũng ảnh hưởng tới biến kia**.

**Figure 6.1: Copying and cloning**

```
 Copying
   original = ┌────────┐──┐
              └────────┘  │      ┌────────────┐
                          ├─────►│  Employee  │
   copy     = ┌────────┐  │      │            │
              └────────┘──┘      └────────────┘


 Cloning
   original = ┌────────┐         ┌────────────┐
              └────────┘────────►│  Employee  │
                                 │            │
                                 └────────────┘

   copy     = ┌────────┐         ┌────────────┐
              └────────┘────────►│  Employee  │
                                 │            │
                                 └────────────┘
```

*Copying: hai biến trỏ chung một object. Cloning: mỗi biến trỏ tới một object riêng.*

> *"If you would like copy to be a new object that begins its life being identical to original but whose state can diverge over time, use the clone method."*

```java
Employee copy = original.clone();
copy.raiseSalary(10); // OK--original unchanged
```

**Dịch:** Nếu muốn `copy` là **object mới**, khởi đầu **y hệt** `original` nhưng **state có thể phân kỳ theo thời gian**, hãy dùng method **`clone`**.

> *"But it isn’t quite so simple. The clone method is a protected method of Object, which means that your code cannot simply call it. Only the Employee class can clone Employee objects. There is a reason for this restriction. Think about the way in which the Object class can implement clone. It knows nothing about the object at all, so it can make only a field-by-field copy. If all instance fields in the object are numbers or other basic types, copying the fields is just fine. But if the object contains references to subobjects, then copying the field gives you another reference to the same subobject, so the original and the cloned objects still share some information."*

**Dịch:** Nhưng **không đơn giản vậy**. `clone` là method **`protected` của `Object`**, nghĩa là code của bạn **không gọi thẳng được**. **Chỉ class `Employee` mới clone được object `Employee`.** Có lý do cho hạn chế này: class `Object` **chẳng biết gì về object cả**, nên nó **chỉ copy được từng field một**. Nếu mọi instance field là **số hay kiểu cơ bản** thì copy field là ổn. Nhưng nếu object **chứa reference tới subobject** thì copy field cho bạn **một reference nữa tới cùng subobject** — bản gốc và bản clone **vẫn chia sẻ một phần thông tin**.

> *"To visualize that, consider the Employee class that was introduced in Chapter 4. Figure 6.2 shows what happens when you use the clone method of the Object class to clone such an Employee object. As you can see, the default cloning operation is “shallow”—it doesn’t clone objects that are referenced inside other objects. (The figure shows a shared Date object. For reasons that will become clear shortly, this example uses a version of the Employee class in which the hire day is represented as a Date.)"*

**Dịch:** Thao tác cloning mặc định là **"shallow" (nông)** — nó **không clone những object được tham chiếu bên trong object khác**. (Hình minh hoạ cho thấy một object `Date` **được dùng chung**. Ví dụ này dùng phiên bản `Employee` biểu diễn ngày vào làm bằng **`Date`**.)

**Figure 6.2: A shallow copy**

```
 original = ┌──────┐    ┌─────────────────────┐        ┌──────────┐
            └──────┘───►│      Employee       │   ┌───►│  String  │
                        │ name    = ──────────┼───┤    │          │
                        │ salary  = 50000.0   │   │    └──────────┘
                        │ hireDay = ──────────┼─┐ │
                        └─────────────────────┘ │ │
                                                │ │
 copy     = ┌──────┐    ┌─────────────────────┐ │ │    ┌──────────┐
            └──────┘───►│      Employee       │ ├─┼───►│   Date   │
                        │ name    = ──────────┼─┼─┘    │          │
                        │ salary  = 50000.0   │ │      └──────────┘
                        │ hireDay = ──────────┼─┘
                        └─────────────────────┘
```

*Hai object `Employee` riêng biệt, nhưng cùng trỏ tới một `String` và một `Date` — subobject bị dùng chung.*

> *"Does it matter if the copy is shallow? It depends. If the subobject shared between the original and the shallow clone is immutable, then the sharing is safe. This certainly happens if the subobject belongs to an immutable class, such as String. Alternatively, the subobject may simply remain constant throughout the lifetime of the object, with no mutators touching it and no methods yielding a reference to it."*

> *"Quite frequently, however, subobjects are mutable, and you must redefine the clone method to make a deep copy that clones the subobjects as well. In our example, the hireDay field is a Date, which is mutable, so it too must be cloned. (For that reason, this example uses a field of type Date, not LocalDate, to demonstrate the cloning process. Had hireDay been an instance of the immutable LocalDate class, no further action would have been required.)"*

**Dịch:** Copy nông **có sao không? Còn tuỳ.** Nếu subobject dùng chung giữa bản gốc và bản clone nông là **immutable** thì **chia sẻ vẫn an toàn** — chắc chắn vậy nếu subobject thuộc **class immutable như `String`**. Hoặc subobject **giữ nguyên suốt vòng đời** của object, **không mutator nào đụng vào** và **không method nào trả ra reference tới nó**.

Tuy nhiên **subobject thường là mutable**, và bạn **phải định nghĩa lại `clone` để tạo deep copy** — clone luôn cả subobject. Trong ví dụ, field `hireDay` là `Date` (**mutable**) nên **cũng phải clone**. (Nếu `hireDay` là instance của class immutable `LocalDate` thì **không cần làm gì thêm**.)

### Ba lựa chọn cho mỗi class

> *"For every class, you need to decide whether"*
>
> *"1. The default clone method is good enough;"*
> *"2. The default clone method can be patched up by calling clone on the mutable subobjects; or"*
> *"3. clone should not be attempted."*
>
> *"The third option is actually the default. To choose either the first or the second option, a class must"*
>
> *"1. Implement the Cloneable interface; and"*
> *"2. Redefine the clone method with the public access modifier."*

**Dịch:** Với mỗi class bạn phải quyết định:

| # | Lựa chọn |
|---|---|
| 1 | Method `clone` **mặc định là đủ tốt** |
| 2 | Method `clone` mặc định **vá lại được** bằng cách gọi `clone` lên các **mutable subobject** |
| 3 | **Không nên thử clone** |

**Lựa chọn thứ ba thực ra là mặc định.** Để chọn lựa chọn 1 hoặc 2, class **phải**: (1) **implement interface `Cloneable`**; và (2) **định nghĩa lại method `clone` với access modifier `public`**.

> **Note (sách):** *"The clone method is declared protected in the Object class, so that your code can’t simply call anObject.clone(). But aren’t protected methods accessible from any subclass, and isn’t every class a subclass of Object? Fortunately, the rules for protected access are more subtle (see Chapter 5). A subclass can call a protected clone method only to clone its own objects. You must redefine clone to be public to allow objects to be cloned by any method."*
>
> **Dịch:** `clone` được khai báo `protected` trong `Object` để code của bạn **không gọi thẳng `anObject.clone()`** được. Nhưng chẳng phải method `protected` truy cập được từ **mọi subclass**, và mọi class đều là subclass của `Object` sao? May thay, **luật về protected access tinh tế hơn** (Chapter 5): một subclass **chỉ gọi được `clone` protected để clone object của chính nó**. Bạn **phải định nghĩa lại `clone` thành `public`** để object được clone bởi bất kỳ method nào.

> *"In this case, the appearance of the Cloneable interface has nothing to do with the normal use of interfaces. In particular, it does not specify the clone method—that method is inherited from the Object class. The interface merely serves as a tag, indicating that the class designer understands the cloning process. Objects are so paranoid about cloning that they generate a checked exception if an object requests cloning but does not implement that interface."*

**Dịch:** Ở đây, sự xuất hiện của `Cloneable` **chẳng liên quan gì tới cách dùng interface thông thường**. Cụ thể, nó **không đặc tả method `clone`** — method đó **thừa hưởng từ class `Object`**. Interface chỉ đóng vai trò **một cái tag**, cho biết **người thiết kế class hiểu quy trình cloning**. Object **hoang tưởng về cloning** tới mức **sinh ra checked exception** nếu một object yêu cầu clone mà **không implement interface đó**.

> **Note (sách):** *"The Cloneable interface is one of a handful of tagging interfaces that Java provides. (Some programmers call them marker interfaces.) Recall that the usual purpose of an interface such as Comparable is to ensure that a class implements a particular method or set of methods. A tagging interface has no methods; its only purpose is to allow the use of instanceof in a type inquiry:"*
>
> ```java
> if (obj instanceof Cloneable) . . .
> ```
>
> *"I recommend that you do not use tagging interfaces in your own programs."*
>
> **Dịch:** `Cloneable` là một trong số ít **tagging interface** mà Java cung cấp. (Một số lập trình viên gọi chúng là **marker interface**.) Mục đích thường thấy của interface như `Comparable` là **đảm bảo class implement một method hay một bộ method**. **Tagging interface không có method nào**; mục đích duy nhất của nó là **cho phép dùng `instanceof` để hỏi kiểu**. Tác giả **khuyến nghị bạn KHÔNG dùng tagging interface trong chương trình của mình**.

> *"Even if the default (shallow copy) implementation of clone is adequate, you still need to implement the Cloneable interface, redefine clone to be public, and call super.clone(). Here is an example:"*

```java
class Employee implements Cloneable
{
    // public access, change return type
    public Employee clone() throws CloneNotSupportedException
    {
        return (Employee) super.clone();
    }
    . . .
}
```

**Dịch:** Kể cả khi implementation mặc định (**shallow copy**) của `clone` là đủ, bạn **vẫn phải**: implement `Cloneable`, **định nghĩa lại `clone` thành `public`**, và **gọi `super.clone()`**.

> **Note (sách):** *"Note that in the Object class, the clone method has return type Object. In a subclass, you can specify the correct return type for your clone methods. This is an example of covariant return types (see Chapter 5)."*
>
> **Dịch:** Trong class `Object`, `clone` có **kiểu trả về `Object`**. Ở subclass, bạn **chỉ định được kiểu trả về đúng** cho method `clone` của mình. Đây là ví dụ về **covariant return type** (Chapter 5).

> *"The clone method that you just saw adds no functionality to the shallow copy provided by Object.clone. It merely makes the method public. To make a deep copy, you have to work harder and clone the mutable instance fields."*

> *"Here is an example of a clone method that creates a deep copy:"*

```java
class Employee implements Cloneable
{
    . . .
    public Employee clone() throws CloneNotSupportedException
    {
        // call Object.clone()
        Employee cloned = (Employee) super.clone();

        // clone mutable fields
        cloned.hireDay = (Date) hireDay.clone();

        return cloned;
    }
}
```

**Dịch:** Method `clone` vừa xem **không thêm chức năng gì** so với shallow copy của `Object.clone` — nó **chỉ làm method thành `public`**. Muốn **deep copy** thì phải làm nhiều hơn: **clone các mutable instance field**.

> *"The clone method of the Object class threatens to throw a CloneNotSupportedException—it does that whenever clone is invoked on an object whose class does not implement the Cloneable interface. Of course, the Employee and Date classes implement the Cloneable interface, so the exception won’t be thrown. However, the compiler does not know that. Therefore, we declared the exception:"*

```java
public Employee clone() throws CloneNotSupportedException
```

**Dịch:** Method `clone` của `Object` **đe doạ ném `CloneNotSupportedException`** — nó ném mỗi khi `clone` được gọi lên object có class **không implement `Cloneable`**. `Employee` và `Date` đều implement `Cloneable` nên exception **sẽ không bị ném**. Nhưng **compiler không biết điều đó**, nên ta **khai báo exception**.

> **Note (sách):** *"Would it be better to catch the exception instead? (See Chapter 7 for details on catching exceptions.)"*
>
> ```java
> public Employee clone()
> {
>     try
>     {
>         Employee cloned = (Employee) super.clone();
>         . . .
>     }
>     catch (CloneNotSupportedException e) { return null; }
>     // this won't happen, since we are Cloneable
> }
> ```
>
> *"This is appropriate for final classes. Otherwise, it is better to leave the throws specifier in place. That gives subclasses the option of throwing a CloneNotSupportedException if they can’t support cloning."*
>
> **Dịch:** **Catch exception có tốt hơn không?** Cách đó **phù hợp với class `final`**. Ngược lại, **tốt hơn là để nguyên `throws`** — như vậy subclass **có lựa chọn ném `CloneNotSupportedException`** nếu chúng **không hỗ trợ được cloning**.

> *"You have to be careful about cloning of subclasses. For example, once you have defined the clone method for the Employee class, anyone can use it to clone Manager objects. Can the Employee clone method do the job? It depends on the fields of the Manager class. In our case, there is no problem because the bonus field has primitive type. But Manager might have acquired fields that require a deep copy or are not cloneable. There is no guarantee that the implementor of the subclass has fixed clone to do the right thing. For that reason, the clone method is declared as protected in the Object class. But you don’t have that luxury if you want the users of your classes to invoke clone."*

**Dịch:** Phải **cẩn thận khi clone subclass**. Sau khi định nghĩa `clone` cho `Employee`, **ai cũng dùng nó để clone object `Manager`** được. Method `clone` của `Employee` có làm nổi việc đó không? **Còn tuỳ vào field của class `Manager`.** Trong trường hợp này không sao vì field `bonus` có **kiểu primitive**. Nhưng `Manager` **có thể đã thêm field cần deep copy hoặc không clone được**. **Không gì đảm bảo** người implement subclass **đã sửa `clone` cho đúng**. Đó là lý do `clone` được khai báo `protected` trong `Object`. Nhưng bạn **không có được sự xa xỉ đó** nếu muốn người dùng class của bạn gọi được `clone`.

> *"Should you implement clone in your own classes? If your clients need to make deep copies, then you probably should. Some authors feel that you should avoid clone altogether and instead implement another method for the same purpose. I agree that clone is rather awkward, but you’ll run into the same issues if you shift the responsibility to another method. At any rate, cloning is less common than you may think. Less than five percent of the classes in the standard library implement clone."*

**Dịch:** **Có nên implement `clone` trong class của mình không?** Nếu client cần **deep copy** thì có lẽ nên. Vài tác giả cho rằng **nên tránh `clone` hoàn toàn** và implement method khác cho cùng mục đích. Tác giả đồng ý `clone` **hơi vụng**, nhưng **chuyển trách nhiệm sang method khác thì cũng gặp đúng những vấn đề đó**. Dù sao, **cloning ít gặp hơn bạn tưởng**: **dưới 5% class trong standard library implement `clone`**.

> *"The program in Listing 6.4 clones an instance of the class Employee (Listing 6.5), then invokes two mutators. The raiseSalary method changes the value of the salary field, whereas the setHireDay method changes the state of the hireDay field. Neither mutation affects the original object because clone has been defined to make a deep copy."*

**Dịch:** Chương trình Listing 6.4 clone một instance `Employee` rồi gọi **hai mutator**: `raiseSalary` đổi giá trị field `salary`, `setHireDay` đổi state của field `hireDay`. **Không thay đổi nào ảnh hưởng tới object gốc** vì `clone` đã được định nghĩa để **deep copy**.

> **Note (sách):** *"All array types have a clone method that is public, not protected. You can use it to make a new array that contains copies of all elements. For example:"*
>
> ```java
> int[] luckyNumbers = { 2, 3, 5, 7, 11, 13 };
> int[] cloned = luckyNumbers.clone();
> cloned[5] = 12; // doesn't change luckyNumbers[5]
> ```
>
> **Dịch:** **Mọi kiểu array đều có method `clone` là `public`, không phải `protected`.** Dùng nó để tạo **array mới chứa bản sao của mọi phần tử**.

### Listing 6.4 — `clone/CloneTest.java`

```java
package clone;

/**
 * This program demonstrates cloning.
 * @version 1.11 2018-03-16
 * @author Cay Horstmann
 */
public class CloneTest
{
    public static void main(String[] args) throws CloneNotSupportedException
    {
        var original = new Employee("John Q. Public", 50000);
        original.setHireDay(2000, 1, 1);
        Employee copy = original.clone();
        copy.raiseSalary(10);
        copy.setHireDay(2002, 12, 31);
        System.out.println("original=" + original);
        System.out.println("copy=" + copy);
    }
}
```

### Listing 6.5 — `clone/Employee.java`

```java
package clone;

import java.time.*;
import java.util.*;

public class Employee implements Cloneable
{
    private String name;
    private double salary;
    private Date hireDay;

    public Employee(String name, double salary)
    {
        this.name = name;
        this.salary = salary;
        hireDay = new Date();
    }

    public Employee clone() throws CloneNotSupportedException
    {
        // call Object.clone()
        Employee cloned = (Employee) super.clone();

        // clone mutable fields
        cloned.hireDay = (Date) hireDay.clone();

        return cloned;
    }

    /**
     * Set the hire day to a given date.
     * @param year the year of the hire day
     * @param month the month of the hire day
     * @param day the day of the hire day
     */
    public void setHireDay(int year, int month, int day)
    {
        long epochMillis = LocalDate.of(year, month, day)
            .atStartOfDay(ZoneId.systemDefault())
            .toEpochSecond() * 1000;

        // example of instance field mutation
        hireDay.setTime(epochMillis);
    }

    public void raiseSalary(double byPercent)
    {
        double raise = salary * byPercent / 100;
        salary += raise;
    }

    public String toString()
    {
        return "Employee[name=" + name + ",salary=" + salary + ",hireDay=" + hireDay + "]";
    }
}
```

---

## Bài kế tiếp

→ [[02 - Lambda Expressions]] — cú pháp lambda, functional interface, function type, method reference, constructor reference, variable scope, và cách tạo comparator.
