# 04 — Static Fields and Methods

> Chapter 4, Section 4.4 — Core Java Volume I, 13th Edition (Horstmann).
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 4.4. Static Fields and Methods

> *"In all sample programs that you have seen, the main method is tagged with the static modifier. We are now ready to discuss the meaning of this modifier."*

**Dịch:** Trong mọi chương trình ví dụ từ đầu tới giờ, method `main` đều gắn modifier `static`. Giờ là lúc bàn về ý nghĩa của modifier này.

---

## 4.4.1. Static Fields

> *"If you define a field as static, then the field is not present in the objects of the class. There is only a single copy of each static field. You can think of static fields as belonging to the class, not to the individual objects."*

**Dịch:** Khai báo một field là `static` thì field đó **không tồn tại trong các object của class**. Mỗi static field **chỉ có duy nhất một bản**. Cứ hình dung static field **thuộc về class, không thuộc về từng object**.

> *"For example, let's suppose we want to assign a unique identification number to each employee. We add an instance field id and a static field nextId to the Employee class:"*

```java
class Employee
{
    private static int nextId = 1;
    private int id;
    . . .
}
```

> *"Every Employee object now has its own id field, but there is only one nextId field that is shared among all instances of the class. Let's put it another way. If there are 1,000 objects of the Employee class, then there are 1,000 instance fields id, one for each object. But there is a single static field nextId. Even if there are no Employee objects, the static field nextId is present. It belongs to the class, not to any individual object."*

**Dịch:** Mỗi object `Employee` có field `id` riêng, nhưng **chỉ có một field `nextId`** dùng chung cho mọi instance của class. Nói cách khác: có 1.000 object `Employee` thì có **1.000 instance field `id`**, mỗi object một cái. Nhưng chỉ có **một static field `nextId`**. Kể cả khi **không có object `Employee` nào**, static field `nextId` vẫn tồn tại. Nó thuộc về class, không thuộc object riêng lẻ nào.

```
                 class Employee
              ┌──────────────────────┐
              │  static nextId = 4   │  ← MỘT bản duy nhất, thuộc class
              └──────────────────────┘
                        ▲
        ┌───────────────┼───────────────┐
        │               │               │
  ┌───────────┐   ┌───────────┐   ┌───────────┐
  │ id = 1    │   │ id = 2    │   │ id = 3    │  ← mỗi object một bản riêng
  │ name=Tom  │   │ name=Dick │   │ name=Harry│
  └───────────┘   └───────────┘   └───────────┘
```

> **Note (sách):** *"In some object-oriented programming languages, static fields are called class fields. The term "static" is a meaningless holdover from C++."*
>
> **Dịch:** Ở một số ngôn ngữ OOP khác, static field được gọi là **class field**. Từ "static" là **di sản vô nghĩa còn sót lại từ C++**.

### Dùng static field để cấp id

> *"In the constructor, we assign the next available ID to the new Employee object and then increment it:"*

```java
id = nextId;
nextId++;
```

> *"Suppose we construct the object harry. Then the id field of harry is set to the current value of the static field nextId, and the value of the static field is incremented:"*

```java
harry.id = Employee.nextId;
Employee.nextId++;
```

> **Caution (sách):** *"If you accidentally declare what you want to be an instance field as static, the compiler won't help you find your mistake."*
>
> *"Conceptually, a static field (such as nextId in the preceding example) belongs to the class, not to any object. Nevertheless, in Java, you can refer to the field as Employee.nextId, or e.nextId, where e is any Employee object. And inside the methods of the Employee class, you can use nextId, this.nextId, or Employee.nextId."*
>
> *"Therefore, it is a good idea to pay attention to any static declarations in a class. Static variables are uncommon and deserve close scrutiny. Static constants, discussed in the following section, stand out because their names are typically in all caps."*
>
> **Dịch:** Nếu lỡ tay khai báo `static` cho thứ lẽ ra phải là instance field, **compiler sẽ không giúp bạn phát hiện lỗi**.
>
> Về mặt khái niệm, static field thuộc về class. Nhưng trong Java bạn vẫn tham chiếu được bằng `Employee.nextId`, hoặc `e.nextId` với `e` là object `Employee` bất kỳ. Và bên trong method của class `Employee`, dùng được cả `nextId`, `this.nextId`, lẫn `Employee.nextId`.
>
> Vì vậy nên **để ý mọi khai báo `static`** trong class. **Static variable rất hiếm gặp**, đáng soi kỹ. **Static constant** thì dễ nhận ra vì tên chúng thường **viết hoa toàn bộ**.

---

## 4.4.2. Static Constants

> *"Static variables are quite rare. However, static constants are more common. For example, the Math class defines a static constant:"*

```java
public class Math
{
    . . .
    public static final double PI = 3.14159265358979323846;
    . . .
}
```

> *"You can access this constant in your programs as Math.PI."*

**Dịch:** Static variable khá hiếm, nhưng **static constant thì phổ biến hơn**. Truy cập bằng `Math.PI`.

> *"If the keyword static had been omitted, then PI would have been an instance field of the Math class. That is, you would need an object of this class to access PI, and every Math object would have its own copy of PI."*

**Dịch:** Nếu bỏ keyword `static` thì `PI` sẽ thành **instance field** của class `Math`. Tức là phải có **object của class này mới truy cập được `PI`**, và **mỗi object `Math` sẽ có bản `PI` riêng**.

> *"Another static constant that you have used many times is System.out. It is declared in the System class as follows:"*

```java
public class System
{
    . . .
    public static final PrintStream out = . . .;
    . . .
}
```

> *"As mentioned several times, it is never a good idea to have public fields, because everyone can modify them. However, public constants (that is, final fields) are fine. Since out has been declared as final, you cannot reassign another print stream to it:"*

```java
System.out = new PrintStream(. . .); // ERROR--out is final
```

**Dịch:** Như đã nhắc nhiều lần, **để field public không bao giờ là ý hay** vì ai cũng sửa được. Nhưng **public constant (field `final`) thì ổn**. Vì `out` được khai báo `final` nên không gán lại print stream khác cho nó được.

> **Note (sách):** *"If you look at the System class, you will notice a method setOut that sets System.out to a different stream. You may wonder how that method can change the value of a final variable. However, the setOut method is a native method, not implemented in the Java programming language. Native methods can bypass the access control mechanisms of the Java language. This is a very unusual workaround that you should not emulate in your programs."*
>
> **Dịch:** Class `System` có method `setOut` đặt `System.out` sang stream khác. Bạn sẽ thắc mắc sao nó đổi được giá trị của một biến `final`. Lý do: `setOut` là **native method**, không implement bằng Java. **Native method vượt qua được cơ chế kiểm soát truy cập của Java**. Đây là cách lách **rất bất thường**, **đừng bắt chước** trong chương trình của bạn.

---

## 4.4.3. Static Methods

> *"Static methods are methods that do not operate on objects. For example, the pow method of the Math class is a static method. The expression"*

```java
Math.pow(x, a)
```

> *"computes the power x^a. It does not use any Math object to carry out its task. In other words, it has no implicit parameter."*

**Dịch:** **Static method là method không thao tác lên object**. Ví dụ `Math.pow` tính luỹ thừa mà **không dùng object `Math`** nào. Nói cách khác, nó **không có implicit parameter**.

> *"You can think of static methods as methods that don't have a this parameter. (In a nonstatic method, the this parameter refers to the implicit parameter of the method—see Section 4.3.7.)"*

**Dịch:** Cứ hình dung static method là method **không có parameter `this`**. (Ở method non-static, `this` trỏ tới implicit parameter của method — xem [[03 - Defining Your Own Classes#4.3.7. Implicit and Explicit Parameters|Section 4.3.7]].)

> *"A static method of the Employee class cannot access the id instance field because it does not operate on an object. However, a static method can access a static field. Here is an example of such a static method:"*

```java
public static int advanceId()
{
    int r = nextId; // obtain next available id
    nextId++;
    return r;
}
```

> *"To call this method, you supply the name of the class:"*

```java
int n = Employee.advanceId();
```

**Dịch:** Static method của `Employee` **không truy cập được instance field `id`** vì nó không thao tác lên object nào. Nhưng static method **truy cập được static field**. Gọi method này thì đưa **tên class** vào.

| | Truy cập được instance field? | Truy cập được static field? |
|---|---|---|
| method thường | ✅ | ✅ |
| **static method** | ❌ | ✅ |

> *"Could you have omitted the keyword static for this method? Yes, but then you would need to have an object reference of type Employee to invoke the method."*

**Dịch:** Bỏ `static` đi có được không? **Được**, nhưng khi đó phải **có một object reference kiểu `Employee`** mới gọi được method.

> **Note (sách):** *"It is legal to use an object to call a static method. For example, if harry is an Employee object, then you can call harry.advanceId() instead of Employee.advanceId(). However, I find that notation confusing. The advanceId method doesn't look at harry at all to compute the result. I recommend that you use class names, not objects, to invoke static methods. (Your IDE will probably suggest a refactoring otherwise.)"*
>
> **Dịch:** Dùng object để gọi static method là **hợp lệ**: `harry.advanceId()` thay cho `Employee.advanceId()`. Nhưng tác giả thấy cách viết đó **gây nhầm lẫn**, vì `advanceId` **chả hề nhìn vào `harry`** để tính kết quả. Khuyến nghị: **dùng tên class, không dùng object**, để gọi static method. IDE nhiều khả năng cũng sẽ gợi ý refactor.

### Khi nào dùng static method

> *"Use static methods in two situations:*
> - *When a method doesn't need to access the object state because all needed parameters are supplied as explicit parameters (example: Math.pow)*
> - *When a method only needs to access static fields of the class (example: Employee.advanceId)"*

**Dịch — hai tình huống dùng static method:**

| # | Tình huống | Ví dụ |
|---|---|---|
| 1 | Method **không cần truy cập state của object** vì mọi parameter cần thiết đều được đưa vào dưới dạng explicit parameter | `Math.pow` |
| 2 | Method **chỉ cần truy cập static field** của class | `Employee.advanceId` |

> **C++ Note (sách):** *"Static fields and methods have the same functionality in Java and C++. However, the syntax is slightly different. In C++, you use the :: operator to access a static field or method outside its scope, such as Math::PI."*
>
> *"The term "static" has a curious history. At first, the keyword static was introduced in C to denote local variables that don't go away when a block is exited. In that context, the term "static" makes sense: The variable stays around and is still there when the block is entered again. Then static got a second meaning in C, to denote global variables and functions that cannot be accessed from other files. The keyword static was simply reused to avoid introducing a new keyword. Finally, C++ reused the keyword for a third, unrelated, interpretation—to denote variables and functions that belong to a class but not to any particular object of the class. That is the same meaning the keyword has in Java."*
>
> **Dịch — lịch sử của từ "static":**
>
> | Lần | Ngôn ngữ | Nghĩa |
> |---|---|---|
> | 1 | C | local variable **không biến mất khi thoát block** (nghĩa này hợp lý với từ "static") |
> | 2 | C | global variable và function **không truy cập được từ file khác** (tái dùng keyword để khỏi phải thêm keyword mới) |
> | 3 | C++ | variable và function **thuộc về class chứ không thuộc object cụ thể nào** |
>
> Nghĩa thứ ba chính là nghĩa keyword này mang trong Java.

---

## 4.4.4. Factory Methods

> *"Here is another common use for static methods. Classes such as LocalDate and NumberFormat use static factory methods that construct objects. You have already seen the factory methods LocalDate.now and LocalDate.of. Here is how to obtain formatter objects for various styles:"*

```java
NumberFormat currencyFormatter = NumberFormat.getCurrencyInstance();
NumberFormat percentFormatter = NumberFormat.getPercentInstance();
double x = 0.1;
System.out.println(currencyFormatter.format(x)); // prints $0.10
System.out.println(percentFormatter.format(x));  // prints 10%
```

**Dịch:** Một công dụng phổ biến khác của static method. Các class như `LocalDate` và `NumberFormat` dùng **static factory method** để dựng object.

### Ba lý do ưu tiên factory method hơn constructor

> *"Why doesn't the NumberFormat class use a constructor instead? There are three reasons to prefer a factory method over a constructor:*
> - *You can't give names to constructors. The constructor name is always the same as the class name. But we want two different names to get the currency instance and the percent instance.*
> - *When you use a constructor, you can't vary the type of the constructed object. But the factory methods actually return objects of the class DecimalFormat, a more specialized class that inherits from NumberFormat. (See Chapter 5 for more on inheritance.)*
> - *A constructor always constructs a new object. You may want to share instances. For example, the Integer.valueOf factory method yields the same instance when you call it twice with the same small argument."*

**Dịch:**

| # | Lý do |
|---|---|
| 1 | **Không đặt tên được cho constructor** — tên constructor luôn trùng tên class. Mà ở đây ta muốn **hai tên khác nhau** để lấy currency instance và percent instance |
| 2 | Dùng constructor thì **không thay đổi được kiểu của object được dựng**. Còn factory method thực chất trả về object của class `DecimalFormat`, một class **chuyên biệt hơn kế thừa từ `NumberFormat`** |
| 3 | Constructor **luôn dựng object mới**. Đôi khi bạn muốn **chia sẻ instance**. Ví dụ factory method `Integer.valueOf` **trả về cùng một instance** khi gọi hai lần với cùng một argument nhỏ |

---

## 4.4.5. The main Method

> *"Note that you can call static methods without having any objects. For example, you never construct any objects of the Math class to call Math.pow."*

> *"For the same reason, the main method is a static method."*

```java
public class Application
{
    public static void main(String[] args)
    {
        // construct objects here
        . . .
    }
}
```

> *"The main method does not operate on any objects. In fact, when a program starts, there aren't any objects yet. The static main method executes, and constructs the objects that the program needs."*

**Dịch:** Gọi static method được mà **không cần object nào**. Cùng lý do đó, **`main` là static method**. `main` không thao tác lên object nào. Thực tế **lúc chương trình khởi động thì chưa có object nào cả**. Static method `main` chạy, rồi **dựng ra các object mà chương trình cần**.

> **Tip (sách):** *"Every class can have a main method. That is a handy trick for adding demonstration code to a class. For example, you can add a main method to the Employee class:"*

```java
class Employee
{
    public Employee(String n, double s, int year, int month, int day)
    {
        name = n;
        salary = s;
        hireDay = LocalDate.of(year, month, day);
    }
    . . .
    public static void main(String[] args) // unit test
    {
        var e = new Employee("Romeo", 50000, 2003, 3, 31);
        e.raiseSalary(10);
        System.out.println(e.getName() + " " + e.getSalary());
    }
    . . .
}
```

> *"To see a demo of the Employee class, simply execute"*
>
> ```
> java Employee
> ```
>
> *"If the Employee class is a part of a larger application, you start the application with"*
>
> ```
> java Application
> ```
>
> *"and the main method of the Employee class is never executed."*
>
> **Dịch:** **Mọi class đều có thể có method `main`**. Đó là mẹo tiện để **thêm code demo vào một class**. Muốn xem demo của class `Employee` thì chạy `java Employee`. Nếu `Employee` là một phần của ứng dụng lớn hơn, bạn khởi động ứng dụng bằng `java Application`, và **method `main` của class `Employee` không bao giờ được chạy**.

### Preview Note — `main` ở Java 21

> **Preview Note (sách):** *"As a preview feature of Java 21, the main method no longer needs to be public or static, and it need not have a parameter of type String[] args. Here are the new rules:*
> - *If there is more than one main method, static main methods are preferred over instance methods, and methods with a String[] parameter are preferred over those with no parameters.*
> - *If main is not static, the class must have a no-argument constructor. Then the launcher constructs an instance of the class and invokes the main method.*
>
> *If you want to try out this preview feature, remember to compile and run with the --enable-preview flag."*
>
> **Dịch:** Là **preview feature của Java 21**: `main` **không còn bắt buộc phải `public` hay `static`**, và **không nhất thiết có parameter `String[] args`**. Quy tắc mới:
>
> - Nếu có **nhiều hơn một** method `main`: static main được ưu tiên hơn instance method, và method **có parameter `String[]`** được ưu tiên hơn method không có parameter.
> - Nếu `main` **không static**, class **phải có constructor không tham số**. Khi đó launcher dựng một instance của class rồi gọi `main`.
>
> Muốn thử thì nhớ compile và chạy với cờ `--enable-preview`.

---

## Listing 4.3 — `StaticTest/StaticTest.java`

> *"The program in Listing 4.3 contains a simple version of the Employee class with a static field nextId and a static method advanceId. We fill an array with three Employee objects and then print the employee information. Finally, we print the next available identification number, to demonstrate the static method."*

> *"Note that the Employee class also has a static main method that runs a simple demo. Try executing both:"*

```
java Employee
java StaticTest
```

```java
/**
 * This program demonstrates static methods.
 * @version 1.03 2021-09-03
 * @author Cay Horstmann
 */
public class StaticTest
{
    public static void main(String[] args)
    {
        // fill the staff array with three Employee objects
        var staff = new Employee[3];

        staff[0] = new Employee("Tom", 40000);
        staff[1] = new Employee("Dick", 60000);
        staff[2] = new Employee("Harry", 65000);

        // print out information about all Employee objects
        for (Employee e : staff)
        {
            System.out.println("name=" + e.getName() + ",id=" + e.getId() + ",salary="
                + e.getSalary());
        }

        int n = Employee.advanceId(); // calls static method
        System.out.println("Next issued id=" + n);
    }
}

class Employee
{
    private static int nextId = 1;

    private String name;
    private double salary;
    private int id;

    public Employee(String n, double s)
    {
        name = n;
        salary = s;
        id = advanceId();
    }

    public String getName()
    {
        return name;
    }

    public double getSalary()
    {
        return salary;
    }

    public int getId()
    {
        return id;
    }

    public static int advanceId()
    {
        int r = nextId; // obtain next available id
        nextId++;
        return r;
    }

    public static void main(String[] args) // runs demo
    {
        var e = new Employee("Harry", 50000);
        System.out.println(e.getName() + " " + e.getSalary());
    }
}
```

---

## API — `java.util.Objects` (Java 7)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `static <T> void requireNonNull(T obj)` | nếu `obj` là null thì ném `NullPointerException` **không kèm message** |
| `static <T> void requireNonNull(T obj, String message)` | nếu `obj` là null thì ném `NullPointerException` **kèm message cho trước** |
| `static <T> void requireNonNull(T obj, Supplier<String> messageSupplier)` *(Java 8)* | như trên, message lấy lười qua supplier (Chapter 6 giải thích supplier, Chapter 8 giải thích cú pháp `<T>`) |
| `static <T> T requireNonNullElse(T obj, T defaultObj)` *(Java 9)* | trả về `obj` nếu nó không null, ngược lại trả về object mặc định |
| `static <T> T requireNonNullElseGet(T obj, Supplier<T> defaultSupplier)` *(Java 9)* | như trên, giá trị mặc định lấy qua supplier |

---

## Bài kế tiếp

→ [[05 - Method Parameters]] — call by value vs call by reference, vì sao method `swap` trong Java không chạy.
