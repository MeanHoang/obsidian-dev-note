# 03 — Defining Your Own Classes

> Chapter 4, Section 4.3 — Core Java Volume I, 13th Edition (Horstmann).
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 4.3. Defining Your Own Classes

> *"In Chapter 3, you started writing simple classes. However, all those classes had just a single main method. Now the time has come to show you how to write the kind of "workhorse classes" that are needed for more sophisticated applications. These classes typically do not have a main method. Instead, they have their own instance fields and methods. To build a complete program, you combine several classes, one of which has a main method."*

**Dịch:** Ở Chapter 3, các class bạn viết chỉ có mỗi method `main`. Giờ là lúc viết loại **"workhorse class"** cần cho ứng dụng phức tạp hơn. Những class này **thường không có method `main`**, mà có instance field và method riêng. Muốn dựng chương trình hoàn chỉnh thì kết hợp nhiều class lại, **trong đó một class có `main`**.

---

## 4.3.1. An Employee Class

> *"The simplest form for a class definition in Java is"*

```java
class ClassName
{
    field1
    field2
    . . .
    constructor1
    constructor2
    . . .
    method1
    method2
    . . .
}
```

> *"Consider the following, very simplified, version of an Employee class that might be used by a business in writing a payroll system:"*

```java
class Employee
{
    // instance fields
    private String name;
    private double salary;
    private LocalDate hireDay;

    // constructor
    public Employee(String n, double s, int year, int month, int day)
    {
        name = n;
        salary = s;
        hireDay = LocalDate.of(year, month, day);
    }

    // a method
    public String getName()
    {
        return name;
    }

    // more methods
    . . .
}
```

### Chương trình dùng class `Employee`

> *"In the program, we construct an Employee array and fill it with three Employee objects:"*

```java
Employee[] staff = new Employee[3];
staff[0] = new Employee("Carl Cracker", . . .);
staff[1] = new Employee("Harry Hacker", . . .);
staff[2] = new Employee("Tony Tester", . . .);
```

> *"Next, we use the raiseSalary method of the Employee class to raise each employee's salary by 5%:"*

```java
for (Employee e : staff)
    e.raiseSalary(5);
```

> *"Finally, we print out information about each employee, by calling the getName, getSalary, and getHireDay methods:"*

```java
for (Employee e : staff)
    System.out.println("name=" + e.getName()
        + ",salary=" + e.getSalary()
        + ",hireDay=" + e.getHireDay());
```

### Quy tắc file nguồn

> *"Note that the example program consists of two classes: the Employee class and a class EmployeeTest with the public access specifier. The main method with the instructions that we just described is contained in the EmployeeTest class."*

> *"The name of the source file is EmployeeTest.java because the name of the file must match the name of the public class. You can only have one public class in a source file, but you can have any number of nonpublic classes."*

**Dịch:** Chương trình ví dụ gồm **hai class**: `Employee` và `EmployeeTest` (class có `public`). Method `main` nằm trong `EmployeeTest`.

Tên file nguồn là `EmployeeTest.java` vì **tên file phải khớp tên class public**. Một file nguồn chỉ được có **một class public**, nhưng **bao nhiêu class không public cũng được**.

> *"Next, when you compile this source code, the compiler creates two class files in the directory: EmployeeTest.class and Employee.class."*

> *"You then start the program by giving the bytecode interpreter the name of the class that contains the main method of your program:"*

```
java EmployeeTest
```

> *"The bytecode interpreter starts running the code in the main method in the EmployeeTest class. This code in turn constructs three new Employee objects and shows you their state."*

**Dịch:** Compile xong, compiler tạo **hai file class**: `EmployeeTest.class` và `Employee.class`. Chạy chương trình bằng cách đưa cho bytecode interpreter **tên class chứa `main`**.

```
EmployeeTest.java  ──javac──►  EmployeeTest.class
   (2 class)                   Employee.class
                                    │
                               java EmployeeTest
                                    │
                          chạy main trong EmployeeTest
```

### Listing 4.2 — `EmployeeTest/EmployeeTest.java`

```java
import java.time.*;

/**
 * This program tests the Employee class.
 * @version 1.13 2018-04-10
 * @author Cay Horstmann
 */
public class EmployeeTest
{
    public static void main(String[] args)
    {
        // fill the staff array with three Employee objects
        Employee[] staff = new Employee[3];

        staff[0] = new Employee("Carl Cracker", 75000, 1987, 12, 15);
        staff[1] = new Employee("Harry Hacker", 50000, 1989, 10, 1);
        staff[2] = new Employee("Tony Tester", 40000, 1990, 3, 15);

        // raise everyone's salary by 5%
        for (Employee e : staff)
            e.raiseSalary(5);

        // print out information about all Employee objects
        for (Employee e : staff)
            System.out.println("name=" + e.getName() + ",salary=" + e.getSalary() + ",hireDay="
                + e.getHireDay());
    }
}

class Employee
{
    private String name;
    private double salary;
    private LocalDate hireDay;

    public Employee(String n, double s, int year, int month, int day)
    {
        name = n;
        salary = s;
        hireDay = LocalDate.of(year, month, day);
    }

    public String getName()
    {
        return name;
    }

    public double getSalary()
    {
        return salary;
    }

    public LocalDate getHireDay()
    {
        return hireDay;
    }

    public void raiseSalary(double byPercent)
    {
        double raise = salary * byPercent / 100;
        salary += raise;
    }
}
```

---

## 4.3.2. Use of Multiple Source Files

> *"The program in Listing 4.2 has two classes in a single source file. Many programmers prefer to put each class into its own source file. For example, you can place the Employee class into a file Employee.java and the EmployeeTest class into EmployeeTest.java."*

> *"If you like this arrangement, you have two choices for compiling the program. You can invoke the Java compiler with a wildcard:"*

```
javac Employee*.java
```

> *"Then, all source files matching the wildcard will be compiled into class files. Or, you can simply type"*

```
javac EmployeeTest.java
```

> *"You may find it surprising that the second choice works even though the Employee.java file is never explicitly compiled. However, when the Java compiler sees the Employee class being used inside EmployeeTest.java, it will look for a file named Employee.class. If it does not find that file, it automatically searches for Employee.java and compiles it. Moreover, if the timestamp of the version of Employee.java that it finds is newer than that of the existing Employee.class file, the Java compiler will automatically recompile the file."*

**Dịch:** Nhiều lập trình viên thích mỗi class một file nguồn. Có hai cách compile: dùng **wildcard**, hoặc chỉ gõ `javac EmployeeTest.java`.

Cách thứ hai vẫn chạy dù `Employee.java` không hề được compile tường minh. Lý do: khi compiler thấy class `Employee` được dùng trong `EmployeeTest.java`, nó **tìm file `Employee.class`**; không thấy thì **tự tìm `Employee.java` và compile**. Hơn nữa, nếu timestamp của `Employee.java` **mới hơn** `Employee.class` đang có, compiler **tự recompile**.

```
javac EmployeeTest.java
        │
        ├─ thấy dùng class Employee
        ├─ tìm Employee.class ────► không có ──► tìm Employee.java ──► compile
        └─ có rồi ──► so timestamp ──► .java mới hơn ──► recompile
```

> **Note (sách):** *"If you are familiar with the make tool of UNIX (or one of its Windows cousins, such as nmake), you can think of the Java compiler as having the make functionality already built in."*
>
> **Dịch:** Quen công cụ `make` của UNIX thì cứ hình dung Java compiler đã **có sẵn chức năng của `make` bên trong**.

---

## 4.3.3. Dissecting the Employee Class

> *"In the sections that follow, we will dissect the Employee class. Let's start with the methods in this class. As you can see by examining the source code, this class has one constructor and four methods:"*

```java
public Employee(String n, double s, int year, int month, int day)
public String getName()
public double getSalary()
public LocalDate getHireDay()
public void raiseSalary(double byPercent)
```

> *"All methods of this class are tagged as public. The keyword public means that any method in any class can call the method."*

**Dịch:** Mọi method của class này đều gắn `public`. Keyword `public` nghĩa là **method ở bất kỳ class nào cũng gọi được** method này. (Bốn mức access được nói ở chương này và chương sau.)

> *"Next, notice the three instance fields that will hold the data manipulated inside an instance of the Employee class."*

```java
private String name;
private double salary;
private LocalDate hireDay;
```

> *"The private keyword makes sure that the only methods that can access these instance fields are the methods of the Employee class itself. No outside method can read or write to these fields."*

**Dịch:** Keyword `private` đảm bảo **chỉ method của chính class `Employee`** mới truy cập được các instance field này. Method bên ngoài **không đọc cũng không ghi** được.

> **Note (sách):** *"You could use the public keyword with your instance fields, but it would be a very bad idea. Having public instance fields would allow any part of the program to read and modify the instance fields, completely ruining encapsulation. Any method of any class can modify public fields—and, in my experience, some code will take advantage of that access privilege when you least expect it. I strongly recommend to make all your instance fields private."*
>
> **Dịch:** Để instance field là `public` cũng được, nhưng **rất tệ**. Field public cho phép **mọi phần của chương trình** đọc và sửa, **phá sạch encapsulation**. Theo kinh nghiệm tác giả, sẽ có đoạn code lợi dụng quyền đó vào **đúng lúc bạn không ngờ nhất**. Khuyến nghị mạnh: **để mọi instance field là `private`**.

> *"Finally, notice that two of the instance fields are themselves objects: The name and hireDay fields are references to String and LocalDate objects. This is quite usual: Classes will often contain instance fields of class type."*

**Dịch:** Hai trong ba instance field **bản thân là object**: `name` và `hireDay` là reference tới object `String` và `LocalDate`. Chuyện này rất bình thường — class thường chứa instance field có kiểu là class.

```
   Employee object
  ┌────────────────────────┐
  │ name    ──────────────►│──► String object
  │ salary   [ 75000.0 ]   │     (giá trị nằm ngay trong object, vì double là primitive)
  │ hireDay ──────────────►│──► LocalDate object
  └────────────────────────┘
```

---

## 4.3.4. First Steps with Constructors

> *"Let's look at the constructor listed in our Employee class."*

```java
public Employee(String n, double s, int year, int month, int day)
{
    name = n;
    salary = s;
    hireDay = LocalDate.of(year, month, day);
}
```

> *"As you can see, the name of the constructor is the same as the name of the class. This constructor runs when you construct objects of the Employee class—giving the instance fields the initial state you want them to have."*

**Dịch:** Tên constructor **trùng tên class**. Constructor chạy khi bạn dựng object của class `Employee`, đặt cho instance field **state ban đầu** mà bạn muốn.

> *"For example, when you create an instance of the Employee class with code like this:"*

```java
new Employee("James Bond", 100000, 1950, 1, 1)
```

> *"you have set the instance fields as follows:"*

```java
name = "James Bond";
salary = 100000;
hireDay = LocalDate.of(1950, 1, 1); // January 1, 1950
```

### Constructor khác method thường

> *"There is an important difference between constructors and other methods. A constructor can only be called in conjunction with the new operator. You can't apply a constructor to an existing object to reset the instance fields. For example,"*

```java
james.Employee("James Bond", 250000, 1950, 1, 1) // ERROR
```

> *"is a compile-time error."*

**Dịch:** Constructor **chỉ gọi được kèm toán tử `new`**. Không thể gọi constructor lên một object đã có để reset instance field. Viết như trên là **lỗi compile-time**.

> *"We will have more to say about constructors later in this chapter. For now, keep the following in mind:*
> - *A constructor has the same name as the class.*
> - *A class can have more than one constructor.*
> - *A constructor can have zero, one, or more parameters.*
> - *A constructor has no return value.*
> - *A constructor is always called with the new operator."*

**Dịch — 5 điều cần nhớ về constructor:**

| # | Quy tắc |
|---|---|
| 1 | Constructor **trùng tên class** |
| 2 | Một class có thể có **nhiều constructor** |
| 3 | Constructor có **0, 1 hoặc nhiều parameter** |
| 4 | Constructor **không có giá trị trả về** |
| 5 | Constructor **luôn được gọi bằng `new`** |

> **C++ Note (sách):** *"Constructors work the same way in Java as they do in C++. Keep in mind, however, that all Java objects are constructed on the heap and that a constructor must be combined with new. It is a common error of C++ programmers to forget the new operator:"*
>
> ```cpp
> Employee number007("James Bond", 100000, 1950, 1, 1); // C++, not Java
> ```
>
> **Dịch:** Constructor hoạt động giống nhau ở Java và C++. Nhưng **mọi object Java được dựng trên heap** và constructor **bắt buộc đi kèm `new`**. Lỗi phổ biến của dân C++ là quên `new`. Cú pháp trên chạy trong C++ nhưng **không chạy trong Java**.

> **Caution (sách):** *"Be careful not to introduce local variables with the same names as the instance fields. For example, the following constructor will not set the name or salary instance fields:"*
>
> ```java
> public Employee(String n, double s, . . .)
> {
>     String name = n;   // ERROR
>     double salary = s; // ERROR
>     . . .
> }
> ```
>
> **Dịch:** Cẩn thận đừng khai báo **local variable trùng tên với instance field**. Constructor trên **không hề set** instance field `name` hay `salary`. Nó khai báo local variable `name` và `salary`, chỉ truy cập được bên trong constructor, và chúng **che khuất (shadow)** instance field cùng tên. Một số người vô tình viết như vậy vì gõ nhanh hơn nghĩ, tay quen thêm kiểu dữ liệu vào. Đây là **lỗi khó chịu, khó lần ra**. Phải cẩn thận trong mọi method: **đừng đặt tên biến trùng tên instance field**.

```
    public Employee(String n, double s, ...)
    {
        String name = n;   ← local variable MỚI, che instance field `name`
        ...
    }                      ← hết constructor: local variable biến mất,
                             instance field `name` vẫn là null
```

---

## 4.3.5. Declaring Local Variables with var

> *"You can declare local variables with the var keyword instead of specifying their type, provided their type can be inferred from the initial value. For example, instead of declaring"*

```java
Employee harry = new Employee("Harry Hacker", 50000, 1989, 10, 1);
```

> *"you simply write"*

```java
var harry = new Employee("Harry Hacker", 50000, 1989, 10, 1);
```

> *"This is nice since it avoids the repetition of the type name Employee."*

**Dịch:** Khai báo local variable bằng keyword `var` thay vì ghi kiểu, **miễn là kiểu suy ra được từ giá trị khởi tạo**. Cách này tránh **lặp lại tên kiểu** `Employee`.

> *"From now on, I will use the var notation in those cases where the type is obvious from the right-hand side without any knowledge of the Java API. But I won't use var with numeric types such as int, long, or double so that you don't have to look out for the difference between 0, 0L, and 0.0. Once you are more experienced with the Java API, you may want to use the var keyword more frequently."*

**Dịch:** Từ đây sách sẽ dùng `var` ở những chỗ kiểu rõ ràng từ vế phải mà **không cần biết Java API**. Nhưng sách **không dùng `var` với kiểu số** như `int`, `long`, `double`, để bạn khỏi phải để ý phân biệt `0`, `0L`, `0.0`.

> *"Note that the var keyword can only be used with local variables inside methods. You must always declare the types of parameters and fields."*

**Dịch:** `var` **chỉ dùng được cho local variable bên trong method**. Parameter và field thì **luôn phải khai báo kiểu**.

| Vị trí | Dùng `var` được không |
|---|---|
| local variable trong method | ✅ |
| parameter của method | ❌ |
| instance field / static field | ❌ |

> **Note (sách):** *"Many programmers use the var keyword quite liberally, whenever they think that the variable type is obvious or obviously uninteresting. A good set of guidelines is at https://openjdk.org/projects/amber/guides/lvti-style-guide."*

---

## 4.3.6. Working with null References

> *"In Section 4.2.1, you saw that an object variable holds a reference to an object, or the special value null to indicate the absence of an object."*

> *"This sounds like a convenient mechanism for dealing with special situations, such as an unknown name or hire date. But you need to be very careful with null values."*

> *"If you apply a method to a null value, a NullPointerException occurs."*

```java
LocalDate rightNow = null;
String s = rightNow.toString(); // NullPointerException
```

**Dịch:** Object variable giữ **reference tới object**, hoặc giá trị đặc biệt `null` để báo **không có object nào**. Nghe thì tiện cho các tình huống đặc biệt (chưa biết tên, chưa biết ngày vào làm), nhưng **phải rất cẩn thận với `null`**. Gọi method lên giá trị `null` thì sinh ra **`NullPointerException`**.

> *"This is a serious error, similar to an "index out of bounds" exception. If your program does not "catch" an exception, it is terminated. Normally, programs don't catch these kinds of exceptions but rely on programmers not to cause them in the first place."*

**Dịch:** Đây là **lỗi nghiêm trọng**, tương tự exception "index out of bounds". Chương trình không "catch" exception thì **bị kết thúc**. Thường thì chương trình **không catch** loại exception này, mà **trông cậy vào việc lập trình viên đừng gây ra nó ngay từ đầu**.

> **Tip (sách):** *"When your program is terminated with a NullPointerException, the stack trace shows you in which line of your code the problem occurred. Since Java 14, the error message includes the name of the variable or method with the null value. For example, in a call"*
>
> ```java
> String s = e.getHireDay().toString();
> ```
>
> *"the error message tells you whether e was null or getHireDay returned null."*
>
> **Dịch:** Khi chương trình chết vì `NullPointerException`, **stack trace** chỉ ra dòng nào bị lỗi. **Từ Java 14**, thông báo lỗi còn kèm **tên biến hoặc method** đang mang giá trị null. Ví dụ với lời gọi trên, thông báo cho biết `e` là null, hay `getHireDay` trả về null.

### Hai cách xử lý null argument

> *"When you define a class, it is a good idea to be clear about which fields can be null. In our example, we don't want the name or hireDay field to be null. (We don't have to worry about the salary field. It has primitive type and can never be null.)"*

> *"The hireDay field is guaranteed to be non-null because it is initialized with a new LocalDate object. But name will be null if the constructor is called with a null argument for n."*

**Dịch:** Khi định nghĩa class, nên **nói rõ field nào được phép null**. Trong ví dụ này ta không muốn `name` hay `hireDay` là null. Field `salary` khỏi lo, nó là **primitive type nên không bao giờ null được**.

`hireDay` chắc chắn non-null vì được khởi tạo bằng object `LocalDate` mới. Nhưng `name` **sẽ là null** nếu constructor được gọi với argument `n` là null.

> *"There are two solutions. The "permissive" approach is to turn a null argument into an appropriate non-null value:"*

```java
if (n == null) name = "unknown"; else name = n;
```

> *"The Objects class has a convenience method for this purpose:"*

```java
public Employee(String n, double s, int year, int month, int day)
{
    name = Objects.requireNonNullElse(n, "unknown");
    . . .
}
```

> *"The "tough love" approach is to reject a null argument:"*

```java
public Employee(String n, double s, int year, int month, int day)
{
    name = Objects.requireNonNull(n, "The name cannot be null");
    . . .
}
```

**Dịch — hai hướng xử lý:**

| Hướng | Cách làm | Method |
|---|---|---|
| **"permissive"** (dễ dãi) | biến argument null thành giá trị non-null hợp lý | `Objects.requireNonNullElse(n, "unknown")` |
| **"tough love"** (cứng rắn) | **từ chối** argument null | `Objects.requireNonNull(n, "The name cannot be null")` |

> *"If someone constructs an Employee object with a null name, then a NullPointerException occurs. At first glance, that may not seem a useful remedy. But there are two advantages:*
> 1. *The exception report has a description of the problem.*
> 2. *The exception report pinpoints the location of the problem. Otherwise, a NullPointerException would have occurred elsewhere, with no easy way of tracing it back to the faulty constructor argument."*

**Dịch:** Với hướng cứng rắn, ai dựng `Employee` với name null thì lập tức `NullPointerException`. Thoạt nhìn cách chữa này có vẻ vô ích, nhưng có **hai lợi thế**:

1. Báo cáo exception **có mô tả vấn đề**.
2. Báo cáo exception **chỉ đúng vị trí** vấn đề. Nếu không, `NullPointerException` sẽ nổ **ở chỗ khác**, và **không dễ lần ngược** về argument constructor sai.

> **Note (sách):** *"Whenever a parameter is an object reference, ask yourself whether you really intend to model values that can be present or absent. If not, the "tough love" approach of throwing an exception is preferred."*
>
> **Dịch:** Mỗi khi một parameter là object reference, **tự hỏi**: có thật sự định mô hình hoá giá trị **có thể có hoặc không có** không? Nếu không, thì **ưu tiên hướng "tough love"** — ném exception.

---

## 4.3.7. Implicit and Explicit Parameters

> *"Methods operate on objects and access their instance fields. For example, the method"*

```java
public void raiseSalary(double byPercent)
{
    double raise = salary * byPercent / 100;
    salary += raise;
}
```

> *"sets a new value for the salary instance field in the object on which this method is invoked. Consider the call"*

```java
number007.raiseSalary(5);
```

> *"The effect is to increase the value of the number007.salary field by 5%. More specifically, the call executes the following instructions:"*

```java
double raise = number007.salary * 5 / 100;
number007.salary += raise;
```

**Dịch:** Method thao tác lên object và truy cập instance field của nó. Method trên đặt giá trị mới cho instance field `salary` **của object mà method được gọi lên**.

### Implicit vs explicit argument

> *"The raiseSalary method is called with two arguments. The first argument, called the implicit argument, is the object of type Employee that appears before the method name. The second argument, the number inside the parentheses after the method name, is an explicit argument. (Some people call the implicit argument the target or receiver of the method call.)"*

**Dịch:** `raiseSalary` được gọi với **hai argument**:

```java
number007.raiseSalary(5);
└───┬───┘             └┬┘
implicit argument   explicit argument
(object Employee     (số trong ngoặc)
 đứng trước tên method)
```

| Loại argument | Là gì | Tên gọi khác |
|---|---|---|
| **implicit argument** | object `Employee` đứng **trước** tên method | *target*, *receiver* của lời gọi |
| **explicit argument** | giá trị trong ngoặc **sau** tên method | |

> *"The method declaration has a parameter variable for the explicit argument, namely double byPercent. However, no parameter variable is declared for the implicit argument."*

**Dịch:** Khai báo method có biến parameter cho explicit argument, tức `double byPercent`. Nhưng **không có biến parameter nào được khai báo cho implicit argument**.

### Keyword `this`

> *"Every method has an implicit parameter, whose name is the keyword this, which is initialized with the implicit argument. If you like, you can write the raiseSalary method as follows:"*

```java
public void raiseSalary(double byPercent)
{
    double raise = this.salary * byPercent / 100;
    this.salary += raise;
}
```

> *"Some programmers prefer that style because it clearly distinguishes between instance fields and local variables."*

**Dịch:** **Mọi method đều có một implicit parameter**, tên của nó là keyword **`this`**, được khởi tạo bằng implicit argument. Viết `this.salary` cũng được. Một số lập trình viên thích style đó vì nó **phân biệt rõ instance field với local variable**.

> **C++ Note (sách):** *"In C++, you generally define methods outside the class... If you define a method inside a class, then it is, automatically, an inline method. In Java, all methods are defined inside the class itself. This does not make them inline. Finding opportunities for inline replacement is the job of the Java virtual machine. The just-in-time compiler watches for calls to methods that are short and commonly called. If they are only one or two implementations, the code is inlined, avoiding the method call."*
>
> **Dịch:** C++ thường định nghĩa method **ngoài** class; định nghĩa trong class thì method **tự động thành inline**. Java thì **mọi method đều định nghĩa bên trong class**, và điều đó **không làm chúng thành inline**. Tìm cơ hội inline là **việc của JVM**: **JIT compiler** theo dõi các lời gọi tới method ngắn và hay được gọi; nếu chỉ có một hai implementation thì code được inline, **bỏ qua được lời gọi method**.

---

## 4.3.8. Benefits of Encapsulation

> *"Finally, let's look more closely at the rather simple getName, getSalary, and getHireDay methods."*

```java
public String getName()      { return name; }
public double getSalary()    { return salary; }
public LocalDate getHireDay(){ return hireDay; }
```

> *"These are obvious examples of accessor methods. As they simply return the values of instance fields, they are sometimes called field accessors."*

**Dịch:** Đây là ví dụ rõ ràng của **accessor method**. Vì chúng chỉ đơn giản trả về giá trị của instance field nên đôi khi gọi là **field accessor**.

> *"Wouldn't it be easier to make the name, salary, and hireDay fields public, instead of having separate accessor methods?"*

> *"Using methods gives you more control and safety. Consider the salary field which is only changed by the raiseSalary method. Should the value ever turn out wrong, only that method needs to be debugged. Had the salary field been public, the culprit for messing up the value could have been anywhere."*

**Dịch:** Để `name`, `salary`, `hireDay` là public cho gọn có phải dễ hơn không? — Dùng method cho bạn **nhiều quyền kiểm soát và an toàn hơn**. Field `salary` chỉ bị đổi bởi `raiseSalary`; giá trị mà sai thì **chỉ cần debug đúng method đó**. Nếu `salary` là public thì **thủ phạm có thể ở bất cứ đâu**.

### Ba thứ cần cung cấp

> *"Sometimes, it happens that you want to get and set the value of an instance field. Then you need to supply three items:*
> - *A private instance field;*
> - *A public field accessor method; and*
> - *A public field mutator method."*

**Dịch:** Khi cần vừa đọc vừa ghi giá trị của một instance field, phải cung cấp **ba thứ**:

```
private   instance field          ← data, giấu đi
public    field accessor method   ← đọc
public    field mutator method    ← ghi
```

> *"This is a lot more tedious than supplying a single public instance field, but there are considerable benefits."*

**Dịch:** Cách này **rườm rà hơn nhiều** so với chỉ để một public instance field, nhưng **lợi ích đáng kể**.

**Lợi ích 1 — đổi implementation nội bộ mà không ảnh hưởng code khác:**

> *"First, you can change the internal implementation without affecting any code other than the methods of the class. For example, if the storage of the name is changed to"*

```java
String firstName;
String lastName;
```

> *"then the getName method can be changed to return"*

```java
firstName + " " + lastName
```

> *"This change is completely invisible to the remainder of the program."*

**Dịch:** Đổi cách lưu `name` thành hai field, rồi sửa `getName` trả về chuỗi ghép. Thay đổi này **hoàn toàn vô hình với phần còn lại của chương trình**.

**Lợi ích 2 — mutator method kiểm tra lỗi được:**

> *"Of course, the accessor and mutator methods may need to do a lot of work to convert between the old and the new data representation. That leads us to our second benefit: Mutator methods can perform error checking, whereas code that simply assigns to a field may not go into the trouble. For example, a setSalary method might check that the salary is never less than 0."*

**Dịch:** Accessor và mutator method có thể phải làm nhiều việc để chuyển đổi giữa cách biểu diễn data cũ và mới. Từ đó ra **lợi ích thứ hai**: mutator method **kiểm tra lỗi được**, trong khi code gán thẳng vào field thì thường **chả buồn làm** chuyện đó. Ví dụ `setSalary` có thể kiểm tra lương **không bao giờ nhỏ hơn 0**.

### ⚠️ Caution — đừng trả về reference tới mutable object

> **Caution (sách):** *"Be careful not to write accessor methods that return references to mutable objects. In a previous edition of this book, I violated that rule in the Employee class in which the getHireDay method returned an object of class Date:"*

```java
class Employee
{
    private Date hireDay;
    . . .
    public Date getHireDay()
    {
        return hireDay; // BAD
    }
    . . .
}
```

> *"Unlike the LocalDate class, which has no mutator methods, the Date class has a mutator method, setTime, where you can set the number of milliseconds."*

> *"The fact that Date objects are mutable breaks encapsulation! Consider the following rogue code:"*

```java
Employee harry = . . .;
Date d = harry.getHireDay();
double tenYearsInMilliseconds = 10 * 365.25 * 24 * 60 * 60 * 1000;
d.setTime(d.getTime() - (long) tenYearsInMilliseconds);
// let's give Harry ten years of added seniority
```

> *"The reason is subtle. Both d and harry.hireDay refer to the same object (see Figure 4.5). Applying mutator methods to d automatically changes the private state of the Employee object!"*

**Dịch:** Cẩn thận đừng viết accessor method **trả về reference tới object mutable**. Trong một ấn bản trước, chính tác giả vi phạm quy tắc này: `getHireDay` trả về object class `Date`.

Khác `LocalDate` (không có mutator method), class `Date` **có** mutator method `setTime`, cho phép đặt số millisecond.

Việc object `Date` mutable **phá vỡ encapsulation**. Lý do tinh vi: `d` và `harry.hireDay` **trỏ tới cùng một object**. Gọi mutator method lên `d` là **tự động đổi luôn private state của object `Employee`**.

**Figure 4.5: Returning a reference to a mutable instance field**

```
   Employee object (harry)                 heap
  ┌────────────────────────┐        ┌──────────────────┐
  │ hireDay ──────────────►│───────►│   Date object    │◄──┐
  └────────────────────────┘        │  (mutable!)      │   │
         private ??                 └──────────────────┘   │
                                                           │
   Date d = harry.getHireDay();  ────────────────────────  ┘
   d.setTime(...)  →  sửa luôn state bên trong Employee
```

> *"You will see in Chapter 6 how to solve this problem by cloning the mutable object before returning it. A better remedy is to use immutable objects when possible, such as LocalDate instead of the legacy Date class."*

**Dịch:** Chapter 6 sẽ chỉ cách giải quyết bằng **clone** object mutable trước khi trả về. Cách chữa **tốt hơn**: dùng **object immutable** khi có thể, ví dụ `LocalDate` thay cho class `Date` cũ.

---

## 4.3.9. Class-Based Access Privileges

> *"You know that a method can access the private data of the object on which it is invoked. What people often find surprising is that a method can access the private data of all objects of its class. For example, consider a method equals that compares two employees."*

```java
class Employee
{
    . . .
    public boolean equals(Employee other)
    {
        return name.equals(other.name);
    }
}
```

> *"A typical call is"*

```java
if (harry.equals(boss)) . . .
```

> *"This method accesses the private fields of harry, which is not surprising. It also accesses the private fields of boss. This is legal because boss is an object of type Employee, and a method of the Employee class is permitted to access the private fields of any object of type Employee."*

**Dịch:** Ai cũng biết method truy cập được private data của object mà nó được gọi lên. Điều **nhiều người thấy bất ngờ**: method truy cập được private data của **mọi object thuộc class của nó**.

Method `equals` trên truy cập private field của `harry` (chuyện thường), **và cũng truy cập private field của `boss`**. Hợp lệ, vì `boss` là object kiểu `Employee`, và method của class `Employee` **được phép** truy cập private field của **bất kỳ object kiểu `Employee`** nào.

```
private = riêng tư ở mức CLASS, không phải ở mức OBJECT
```

> **C++ Note (sách):** *"C++ has the same rule. A method can access the private features of any object of its class, not just of the implicit parameter."*

---

## 4.3.10. Private Methods

> *"When implementing a class, we make all instance fields private because public data are dangerous. But what about the methods? While most methods are public, private methods are useful in certain circumstances. Sometimes, you may wish to break up the code for a computation into separate helper methods. Typically, these helper methods should not be part of the public interface—they may be too close to the current implementation or require a special protocol or calling order. Such methods are best implemented as private."*

**Dịch:** Khi implement class, ta để **mọi instance field là private** vì data public thì nguy hiểm. Còn method? Đa số method là public, nhưng **private method hữu ích trong một số tình huống**. Đôi khi bạn muốn tách code tính toán thành các **helper method** riêng. Thường thì helper method **không nên nằm trong public interface** — chúng có thể **quá gắn với implementation hiện tại**, hoặc **đòi hỏi giao thức / thứ tự gọi đặc biệt**. Những method như vậy tốt nhất để **private**.

> *"To implement a private method in Java, simply change the public keyword to private."*

**Dịch:** Cách làm: **đổi keyword `public` thành `private`**.

> *"By making a method private, you are under no obligation to keep it available if you change your implementation. The method may well be harder to implement or unnecessary if the data representation changes; this is irrelevant. The point is that as long as the method is private, the designers of the class can be assured that it is never used elsewhere, so they can simply drop it. If a method is public, you cannot simply drop it because other code might rely on it."*

**Dịch:** Để method là private thì bạn **không có nghĩa vụ giữ nó** khi đổi implementation. Method đó có thể trở nên khó implement hoặc không cần thiết khi cách biểu diễn data thay đổi; **chuyện đó không quan trọng**. Điểm mấu chốt: chừng nào method còn private, người thiết kế class **chắc chắn nó không được dùng ở đâu khác**, nên **cứ việc xoá bỏ**. Method public thì **không xoá bừa được** vì code khác có thể đang dựa vào nó.

---

## 4.3.11. Final Instance Fields

> *"You can define an instance field as final. Such a field must be initialized when the object is constructed. That is, you must guarantee that the field value has been set after the end of every constructor. Afterwards, the field may not be modified again. For example, the name field of the Employee class may be declared as final because it never changes after the object is constructed—there is no setName method."*

```java
class Employee
{
    private final String name;
    . . .
}
```

**Dịch:** Instance field khai báo được là `final`. Field như vậy **phải được khởi tạo khi object được dựng** — tức phải đảm bảo giá trị field đã được set **sau khi kết thúc MỌI constructor**. Sau đó **không sửa lại được nữa**. Field `name` của `Employee` khai báo `final` được, vì nó không bao giờ đổi sau khi object dựng xong — **không có method `setName`**.

> *"The final modifier is particularly useful for fields whose type is primitive or an immutable class. (A class is immutable if none of its methods ever mutate its objects. For example, the String class is immutable.)"*

**Dịch:** Modifier `final` **đặc biệt hữu ích** với field có kiểu là **primitive** hoặc **class immutable**. Định nghĩa: một class là **immutable nếu không method nào của nó mutate object của nó**. Ví dụ class `String` là immutable.

### `final` với class mutable thì gây nhầm

> *"For mutable classes, the final modifier can be confusing. For example, consider a field"*

```java
private final StringBuilder evaluations;
```

> *"that is initialized in the Employee constructor as"*

```java
evaluations = new StringBuilder();
```

> *"The final keyword merely means that the object reference stored in the evaluations variable will never again refer to a different StringBuilder object. But the object can be mutated:"*

```java
public void giveGoldStar()
{
    evaluations.append(LocalDate.now() + ": Gold star!\n");
}
```

**Dịch:** Với class mutable, `final` **dễ gây nhầm**. Keyword `final` **chỉ có nghĩa** là reference lưu trong biến `evaluations` **sẽ không bao giờ trỏ sang một object `StringBuilder` khác**. Nhưng **bản thân object thì mutate được**.

```
   final StringBuilder evaluations
  ┌──────────┐              ┌───────────────────────┐
  │ địa chỉ ─┼─────────────►│  StringBuilder object │
  └──────────┘              │  nội dung SỬA ĐƯỢC ✅ │
   ✗ không trỏ sang         └───────────────────────┘
     object khác được
```

> **Note (sách):** *"A final field can be null:"*
>
> ```java
> name = n != null && n.length() == 0 ? null : n;
> ```
>
> *"Of course, it can then never be changed to a non-null value."*
>
> **Dịch:** Field `final` **có thể là null**. Và tất nhiên, sau đó **không bao giờ đổi được sang giá trị non-null**.

---

## Bài kế tiếp

→ [[04 - Static Fields and Methods]] — `static` field, static constant, static method, factory method, method `main`.
