# 06 — Object Construction

> Chapter 4, Section 4.6 — Core Java Volume I, 13th Edition (Horstmann).
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 4.6. Object Construction

> *"You have seen how to write simple constructors that define the initial state of your objects. However, since object construction is so important, Java offers quite a variety of mechanisms for writing constructors. We go over these mechanisms in the sections that follow."*

**Dịch:** Vì việc dựng object quá quan trọng nên Java cung cấp **khá nhiều cơ chế** để viết constructor.

---

## 4.6.1. Overloading

> *"Some classes have more than one constructor. For example, you can construct an empty StringBuilder object as"*

```java
var messages = new StringBuilder();
```

> *"Alternatively, you can specify an initial string:"*

```java
var todoList = new StringBuilder("To do:\n");
```

> *"This capability is called overloading. Overloading occurs if several methods have the same name (in this case, the StringBuilder constructor method) but different parameters. The compiler must sort out which method to call. It picks the correct method by matching the parameter types in the declarations of the various methods with the types of the arguments used in the specific method call. A compile-time error occurs if the compiler cannot match the parameters, either because there is no match at all or because there is not one that is better than all others. (The process of finding a match is called overloading resolution.)"*

**Dịch:** Khả năng này gọi là **overloading**. Overloading xảy ra khi **nhiều method cùng tên nhưng khác parameter**. Compiler phải xác định gọi method nào: nó chọn method đúng bằng cách **khớp kiểu parameter** trong khai báo với **kiểu argument** trong lời gọi cụ thể.

**Lỗi compile-time** xảy ra khi compiler không khớp được parameter, do **không có cái nào khớp**, hoặc do **không có cái nào tốt hơn hẳn tất cả những cái còn lại**. Quá trình tìm cái khớp gọi là **overloading resolution**.

### Signature của method

> **Note (sách):** *"Java allows you to overload any method—not just constructor methods. Thus, to completely describe a method, you need to specify its name together with its parameter types. This is called the signature of the method. For example, the String class has four public methods called indexOf. They have signatures"*

```java
indexOf(int)
indexOf(int, int)
indexOf(int, int, int)
indexOf(String)
indexOf(String, int)
indexOf(String, int, int)
```

> *"The return type is not part of the method signature. That is, you cannot have two methods with the same names and parameter types but different return types."*

**Dịch:** Java cho phép overload **mọi method**, không riêng constructor. Nên muốn mô tả đầy đủ một method thì phải nêu **tên method cùng với các kiểu parameter** — đó gọi là **signature** của method.

> ⚠️ **Kiểu trả về KHÔNG thuộc signature.** Tức là **không thể** có hai method cùng tên, cùng kiểu parameter, mà khác kiểu trả về.

```
signature = tên method + danh sách kiểu parameter
            (KHÔNG gồm return type)
```

### ⚠️ Caution — overloading khi kiểu không khớp chính xác

> **Caution (sách):** *"The statement"*
>
> ```java
> StringBuilder builder = new StringBuilder('\n'); // ERROR
> ```
>
> *"does not produce a StringBuilder containing a newline. There is a constructor with an int parameter, which yields a StringBuilder with a preallocated capacity. The char literal '\n' can be converted to an int but not to a String. The result is a builder with no contents and capacity 10, the integer value of '\n'."*
>
> *"In general, be careful with overloading when the argument types do not match the parameter types exactly."*
>
> **Dịch:** Câu lệnh trên **không** tạo ra `StringBuilder` chứa ký tự xuống dòng. Có một constructor nhận parameter `int`, cho ra `StringBuilder` với **dung lượng cấp phát sẵn**. Char literal `'\n'` **chuyển sang `int` được**, nhưng **không chuyển sang `String` được**. Kết quả: một builder **không có nội dung gì**, dung lượng **10** — đúng bằng giá trị số nguyên của `'\n'`.
>
> Nói chung, **cẩn thận với overloading khi kiểu argument không khớp chính xác kiểu parameter**.

---

## 4.6.2. Default Field Initialization

> *"If you don't set a field explicitly in a constructor, it is automatically set to a default value: numbers to 0, boolean values to false, and object references to null. Some people consider it poor programming practice to rely on the defaults. Certainly, it makes it harder for someone to understand your code if fields are being initialized invisibly."*

**Dịch:** Không set field tường minh trong constructor thì nó **tự động nhận giá trị mặc định**:

| Kiểu field | Giá trị mặc định |
|---|---|
| kiểu số | `0` |
| `boolean` | `false` |
| object reference | `null` |

Một số người coi việc **dựa vào giá trị mặc định là thói quen lập trình kém**. Chắc chắn là nó làm người khác **khó hiểu code hơn** khi field được khởi tạo một cách vô hình.

> **Note (sách):** *"This is an important difference between fields and local variables. You must always explicitly initialize local variables in a method. But in a class, if you don't initialize a field, it is automatically initialized to a default (0, false, or null)."*
>
> **Dịch:** Đây là **khác biệt quan trọng giữa field và local variable**. Local variable trong method thì **luôn phải khởi tạo tường minh**. Còn field trong class thì **tự động** nhận giá trị mặc định.

> *"For example, consider the Employee class. Suppose you don't specify how to initialize some of the fields in a constructor. By default, the salary field would be initialized with 0 and the name and hireDay fields would be initialized with null."*

> *"However, that would not be a good idea. If anyone called the getName or getHireDay method, they would get a null reference that they probably don't expect:"*

```java
LocalDate h = harry.getHireDay();
int year = h.getYear(); // throws exception if h is null
```

**Dịch:** Nhưng đó **không phải ý hay**. Ai gọi `getName` hay `getHireDay` sẽ nhận về một **null reference mà họ chắc không ngờ tới**.

---

## 4.6.3. The Constructor with No Arguments

> *"Many classes contain a constructor with no arguments that creates an object whose state is set to an appropriate default. For example, here is a no-argument constructor for the Employee class:"*

```java
public Employee()
{
    name = "";
    salary = 0;
    hireDay = LocalDate.now();
}
```

**Dịch:** Nhiều class có **constructor không tham số**, tạo object với state đặt về mặc định hợp lý.

> *"If you write a class with no constructors whatsoever, then a no-argument constructor is provided for you. This constructor sets all the instance fields to their default values. So, all numeric data contained in the instance fields would be 0, all boolean values would be false, and all object variables would be null."*

**Dịch:** Viết một class **không có constructor nào cả** thì **Java cấp cho bạn một constructor không tham số**. Constructor này đặt mọi instance field về giá trị mặc định.

> *"If a class supplies at least one constructor but does not supply a no-argument constructor, it is illegal to construct objects without supplying arguments. For example, our original Employee class in Listing 4.2 provided a single constructor:"*

```java
public Employee(String n, double s, int year, int month, int day)
```

> *"With that class, it was not legal to construct default employees. That is, the call"*

```java
e = new Employee();
```

> *"would have been an error."*

**Dịch:** Nếu class cung cấp **ít nhất một constructor** nhưng **không** có constructor không tham số, thì **dựng object mà không đưa argument là bất hợp lệ**.

```
class KHÔNG có constructor nào    →  được tặng no-arg constructor miễn phí ✅
class có ≥ 1 constructor tự viết  →  KHÔNG được tặng ❌
```

> **Caution (sách):** *"Please keep in mind that you get a free no-argument constructor only when your class has no other constructors. If you write your class with even a single constructor of your own and you want the users of your class to have the ability to create an instance by a call to"*
>
> ```java
> new ClassName()
> ```
>
> *"then you must provide a no-argument constructor. Of course, if you are happy with the default values for all fields, you can simply supply"*
>
> ```java
> public ClassName()
> {
> }
> ```
>
> **Dịch:** Nhớ rằng bạn **chỉ được tặng constructor không tham số khi class không có constructor nào khác**. Chỉ cần bạn tự viết **một** constructor thôi, mà vẫn muốn người dùng class tạo instance bằng `new ClassName()`, thì **phải tự cung cấp constructor không tham số**. Tất nhiên nếu hài lòng với giá trị mặc định cho mọi field thì cứ viết một constructor **rỗng**.

> **C++ Note (sách):** *"C++ has a special initializer list syntax for constructing fields... C++ uses this special syntax to avoid unnecessary invocations of no-argument constructors. In Java, there is no need for that because objects have no subobjects, only references to other objects."*
>
> **Dịch:** C++ có cú pháp **initializer list** riêng để dựng field, nhằm tránh gọi thừa các constructor không tham số. Java **không cần** vì object Java **không có subobject**, chỉ có **reference tới object khác**.

---

## 4.6.4. Explicit Field Initialization

> *"By overloading the constructor methods in a class, you can build many ways to set the initial state of the instance fields of your classes. It is always a good idea to make sure that, regardless of the constructor call, every instance field is set to something meaningful."*

**Dịch:** Nhờ overload constructor, bạn dựng được nhiều cách đặt state ban đầu. Luôn nên đảm bảo rằng **dù gọi constructor nào đi nữa, mọi instance field đều được đặt về giá trị có ý nghĩa**.

> *"You can simply assign a value to any field in the class definition. For example:"*

```java
class Employee
{
    private String name = "";
    . . .
}
```

> *"This assignment is carried out before the constructor executes. This syntax is particularly useful if all constructors of a class need to set a particular instance field to the same value."*

**Dịch:** Gán thẳng giá trị cho field ngay trong định nghĩa class. Phép gán này được thực hiện **TRƯỚC khi constructor chạy**. Cú pháp này đặc biệt hữu ích khi **mọi constructor của class đều cần đặt một instance field về cùng một giá trị**.

> *"The initialization value doesn't have to be a constant value. Here is an example in which a field is initialized with a method call. Consider the Employee class where each employee has an id field. You can initialize it as follows:"*

```java
class Employee
{
    private static int nextId;
    private int id = advanceId();
    . . .
    private static int advanceId()
    {
        int r = nextId;
        nextId++;
        return r;
    }
    . . .
}
```

**Dịch:** Giá trị khởi tạo **không nhất thiết là hằng số**. Ví dụ trên khởi tạo field bằng **một lời gọi method**.

---

## 4.6.5. Parameter Names

> *"When you write very trivial constructors (and you'll write a lot of them), it can be somewhat frustrating to come up with parameter names."*

**Dịch:** Viết những constructor tầm thường (mà bạn sẽ viết rất nhiều), việc **nghĩ tên parameter** khá bực mình.

**Cách 1 — tên một chữ cái:**

> *"We have generally opted for single-letter parameter names:"*

```java
public Employee(String n, double s)
{
    name = n;
    salary = s;
}
```

> *"However, the drawback is that you need to read the code to tell what the n and s parameters mean."*

**Dịch:** Nhược điểm: **phải đọc code mới biết `n` và `s` nghĩa là gì**.

**Cách 2 — thêm tiền tố "a":**

> *"Some programmers prefix each parameter with an "a":"*

```java
public Employee(String aName, double aSalary)
{
    name = aName;
    salary = aSalary;
}
```

> *"That is better. Any reader can immediately figure out the meaning of the parameters."*

**Dịch:** Cách này **tốt hơn**. Người đọc **hiểu ngay** ý nghĩa của parameter.

**Cách 3 — trùng tên field, dùng `this`:**

> *"Another commonly used trick relies on the fact that parameter variables shadow instance fields with the same name. For example, if you call a parameter salary, then salary refers to the parameter, not the instance field. But you can still access the instance field as this.salary. Recall that this denotes the implicit parameter—that is, the object being constructed. Here is an example:"*

```java
public Employee(String name, double salary)
{
    this.name = name;
    this.salary = salary;
}
```

**Dịch:** Mẹo phổ biến khác dựa trên việc **biến parameter che khuất (shadow) instance field cùng tên**. Đặt tên parameter là `salary` thì `salary` trỏ tới **parameter**, không phải instance field. Nhưng vẫn truy cập được instance field bằng **`this.salary`**. Nhớ lại: `this` chỉ **implicit parameter**, tức **object đang được dựng**.

> **C++ Note (sách):** *"In C++, it is common to prefix instance fields with an underscore or a fixed letter. (The letters m and x are common choices.) For example, the salary field might be called _salary, mSalary, or xSalary. Java programmers don't usually do that."*
>
> **Dịch:** C++ thường thêm tiền tố gạch dưới hoặc một chữ cái cố định cho instance field (`_salary`, `mSalary`, `xSalary`). **Dân Java thường không làm vậy**.

---

## 4.6.6. Calling Another Constructor

> *"The keyword this refers to the implicit parameter of a method. However, this keyword has a second meaning."*

> *"If the first statement of a constructor has the form this(. . .), then the constructor calls another constructor of the same class. Here is a typical example:"*

```java
public Employee(double s)
{
    // calls Employee(String, double)
    this("Employee #" + nextId, s);
    nextId++;
}
```

> *"When you call new Employee(60000), the Employee(double) constructor calls the Employee(String, double) constructor."*

> *"Using the this keyword in this manner is useful—you only need to write common construction code once."*

**Dịch:** Keyword `this` chỉ implicit parameter của method. Nhưng keyword này có **nghĩa thứ hai**: nếu **câu lệnh đầu tiên** của constructor có dạng `this(. . .)` thì constructor đó **gọi một constructor khác của cùng class**.

Dùng `this` kiểu này rất hữu ích — **code dựng chung chỉ cần viết một lần**.

```
new Employee(60000)
      │
      ▼
Employee(double s)
      │  câu lệnh đầu: this("Employee #" + nextId, s)
      ▼
Employee(String, double)   ← code dựng chung nằm ở đây
```

> **C++ Note (sách):** *"The this reference in Java is identical to the this pointer in C++. However, in C++, you call another constructor in the member initialization list:"*
>
> ```cpp
> Employee(double s) : Employee("Employee #" + nextId, s) { nextId++; }
> ```

---

## 4.6.7. Initialization Blocks

> *"You have already seen two ways to initialize an instance field:*
> - *By setting a value in a constructor*
> - *By assigning a value in the declaration"*

> *"There is a third mechanism in Java, called an initialization block. Class declarations can contain arbitrary blocks of code. These blocks are executed whenever an object of that class is constructed. For example:"*

```java
class Employee
{
    private static int nextId;

    private int id;
    private String name;
    private double salary;

    // object initialization block
    {
        id = nextId;
        nextId++;
    }

    public Employee(String n, double s)
    {
        name = n;
        salary = s;
    }

    public Employee()
    {
        name = "";
        salary = 0;
    }
    . . .
}
```

**Dịch:** Đã biết **hai cách** khởi tạo instance field: set giá trị trong constructor, và gán giá trị ngay tại khai báo. Java có **cơ chế thứ ba** là **initialization block**. Khai báo class chứa được **các block code tuỳ ý**, và những block này **chạy mỗi khi một object của class đó được dựng**.

> *"In this example, the id field is initialized in the object initialization block, no matter which constructor is used to construct an object. The initialization block runs first, and then the body of the constructor is executed."*

**Dịch:** Trong ví dụ này, field `id` được khởi tạo trong object initialization block, **bất kể dùng constructor nào**. **Initialization block chạy trước**, rồi mới tới thân constructor.

> *"This mechanism is never necessary and is not common. It is usually more straightforward to place the initialization code inside a constructor."*

**Dịch:** Cơ chế này **chưa bao giờ là bắt buộc** và **không phổ biến**. Thường thì **đặt code khởi tạo bên trong constructor sẽ rõ ràng hơn**.

> **Note (sách):** *"It is legal to set fields in initialization blocks even if they are only defined later in the class. However, to avoid circular definitions, it is not legal to read from fields that are only initialized later. The exact rules are spelled out in Section 8.3.3 of the Java Language Specification. The rules are complex enough to baffle the compiler implementors—early versions of Java implemented them with subtle errors. Therefore, you should always place initialization blocks after the field definitions."*
>
> **Dịch:** **Ghi** vào field trong initialization block là hợp lệ kể cả khi field đó được định nghĩa **ở phía dưới** trong class. Nhưng để tránh định nghĩa vòng, **đọc** từ field chỉ được khởi tạo sau đó là **bất hợp lệ**. Quy tắc chính xác nằm ở Section 8.3.3 của Java Language Specification. Quy tắc **phức tạp tới mức làm rối chính người viết compiler** — các phiên bản Java đầu implement chúng với những lỗi tinh vi. Vì vậy **luôn đặt initialization block SAU phần định nghĩa field**.

### ⭐ Thứ tự chi tiết khi một constructor được gọi

> *"With so many ways of initializing instance fields, it can be quite confusing to give all possible pathways for the construction process. Here is what happens in detail when a constructor is called:*
> 1. *If the first statement of the constructor calls a second constructor, then the second constructor executes with the provided arguments.*
> 2. *Otherwise,*
>    - *All instance fields are initialized to their default values (0, false, or null).*
>    - *All field initializers and initialization blocks are executed, in the order in which they occur in the class declaration.*
> 3. *The body of the constructor is executed."*

**Dịch — trình tự khi gọi constructor:**

```
1. Câu lệnh đầu của constructor có gọi constructor thứ hai (this(...)) không?
   │
   ├─ CÓ  → constructor thứ hai chạy với argument được đưa vào
   │
   └─ KHÔNG →
        a. Mọi instance field được khởi tạo về giá trị mặc định (0 / false / null)
        b. Mọi field initializer và initialization block chạy,
           THEO ĐÚNG THỨ TỰ xuất hiện trong khai báo class
   │
   ▼
3. Thân constructor chạy
```

> *"Naturally, it is always a good idea to organize your initialization code so that another programmer could easily understand it without having to be a language lawyer. For example, it would be quite strange and somewhat error-prone to have a class whose constructors depend on the order in which the instance fields are declared."*

**Dịch:** Nên tổ chức code khởi tạo sao cho lập trình viên khác hiểu được **mà không cần phải là "language lawyer"**. Ví dụ, một class có constructor **phụ thuộc vào thứ tự khai báo instance field** thì khá kỳ quặc và **dễ sinh lỗi**.

### Static initialization block

> *"To initialize a static field, either supply an initial value or use a static initialization block. You have already seen the first mechanism:"*

```java
private static int nextId = 1;
```

> *"If the static fields of your class require complex initialization code, use a static initialization block. Place the code inside a block and tag it with the keyword static. Here is an example. We want the employee ID numbers to start at a random integer less than 10,000."*

```java
private static RandomGenerator generator = RandomGenerator.getDefault();

// static initialization block
static
{
    nextId = generator.nextInt(10000);
}
```

**Dịch:** Khởi tạo static field bằng **một trong hai cách**: cấp giá trị ban đầu, hoặc dùng **static initialization block**. Nếu static field cần code khởi tạo phức tạp thì dùng block, đặt code trong block và gắn keyword `static`.

> *"Static initialization occurs when the class is first loaded. Like instance fields, static fields are 0, false, or null unless you explicitly set them to another value. All static field initializers and static initialization blocks are executed in the order in which they occur in the class declaration."*

**Dịch:** **Khởi tạo static xảy ra khi class được load lần đầu tiên**. Giống instance field, static field mang giá trị `0`, `false` hoặc `null` trừ khi bạn đặt tường minh giá trị khác. Mọi static field initializer và static initialization block chạy **theo đúng thứ tự xuất hiện trong khai báo class**.

> **Note (sách):** *"Amazingly enough, up to Java 6, it was possible to write a "Hello, World" program in Java without ever writing a main method."*
>
> ```java
> public class Hello
> {
>     static
>     {
>         System.out.println("Hello, World");
>     }
> }
> ```
>
> *"When you invoked the class with java Hello, the class was loaded, the static initialization block printed "Hello, World", and only then was a message displayed that main is not defined. Since Java 7, the java program first checks that there is a main method."*
>
> **Dịch:** Đáng kinh ngạc là **tới tận Java 6**, viết được chương trình "Hello, World" **mà không hề có method `main`**. Chạy `java Hello` thì class được load, static initialization block in ra "Hello, World", rồi **sau đó** mới hiện thông báo là `main` chưa được định nghĩa. **Từ Java 7**, chương trình `java` **kiểm tra sự tồn tại của `main` trước**.

### `RandomGenerator`

> *"This example uses a RandomGenerator instance for generating random numbers. Since JDK 17, the java.util.random package provides implementations of strong algorithms with various tradeoffs. There is a default that works well for most purposes, but if you are interested in alternatives, read through the API documentation of the java.util.random package for advice which algorithm to choose. You obtain a specific instance like this:"*

```java
RandomGenerator generator = RandomGenerator.of("L64X128MixRandom");
```

> *"Generate random numbers by calling generator.nextInt(n) or other RandomGenerator methods. (Technically, RandomGenerator is an interface, a concept introduced in Chapter 6. You don't need to worry about that when you invoke methods on a RandomGenerator instance.)"*

**Dịch:** Từ **JDK 17**, package `java.util.random` cung cấp implementation của các thuật toán mạnh với những đánh đổi khác nhau. Có một cái mặc định chạy tốt cho hầu hết mục đích. Về mặt kỹ thuật, `RandomGenerator` là một **interface** (khái niệm ở Chapter 6), nhưng khi gọi method lên instance của nó thì **khỏi cần bận tâm**.

> **Tip (sách):** *"The RandomGenerator interface improves upon the Random class from Java 1.0, which has a fairly short period of 2^48, after which the internal state repeats. As a rule of thumb, to generate n random numbers, the period should be at least n^2. By that rule, the classic Random generator is unsuitable if n exceeds 2^24, which is not that large—about 17 million. These days, much better algorithms are known, and it is a good idea to move away from the Random class."*
>
> *"If you want to use strong random number generators with legacy code that uses the Random class, use the static from method like this:"*
>
> ```java
> Random generator = Random.from(RandomGenerator.getDefault());
> ```
>
> **Dịch:** `RandomGenerator` cải thiện so với class `Random` từ Java 1.0 — class này có **chu kỳ khá ngắn là 2^48**, sau đó state nội bộ lặp lại. Quy tắc kinh nghiệm: muốn sinh **n** số ngẫu nhiên thì chu kỳ nên **ít nhất là n²**. Theo quy tắc đó, `Random` cổ điển **không phù hợp khi n vượt 2^24**, tức khoảng **17 triệu** — không lớn lắm. Ngày nay đã có thuật toán tốt hơn nhiều, nên **rời khỏi class `Random`**.

---

## Listing 4.5 — `ConstructorTest/ConstructorTest.java`

> *"The program in Listing 4.5 shows many of the features discussed in this section:*
> - *Overloaded constructors*
> - *A call to another constructor with this(. . .)*
> - *A no-argument constructor*
> - *An object initialization block*
> - *A static initialization block*
> - *An instance field initialization"*

```java
import java.util.random.*;

/**
 * This program demonstrates object construction.
 * @version 1.02 2018-04-10
 * @author Cay Horstmann
 */
public class ConstructorTest
{
    public static void main(String[] args)
    {
        // fill the staff array with three Employee objects
        var staff = new Employee[3];

        staff[0] = new Employee("Harry", 40000);
        staff[1] = new Employee(60000);
        staff[2] = new Employee();

        // print out information about all Employee objects
        for (Employee e : staff)
            System.out.println("name=" + e.getName() + ",id=" + e.getId() + ",salary="
                + e.getSalary());
    }
}

class Employee
{
    private static int nextId;

    private int id;
    private String name = ""; // instance field initialization
    private double salary;

    private static RandomGenerator generator = RandomGenerator.getDefault();

    // static initialization block
    static
    {
        // set nextId to a random number between 0 and 9999
        nextId = generator.nextInt(10000);
    }

    // object initialization block
    {
        id = nextId;
        nextId++;
    }

    // three overloaded constructors
    public Employee(String n, double s)
    {
        name = n;
        salary = s;
    }

    public Employee(double s)
    {
        // calls the Employee(String, double) constructor
        this("Employee #" + nextId, s);
    }

    // the default constructor
    public Employee()
    {
        // name initialized to ""--see above
        // salary not explicitly set--initialized to 0
        // id initialized in initialization block
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
}
```

---

## API

### `java.util.random.RandomGenerator` (Java 17)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `int nextInt(int n)` | trả về số nguyên ngẫu nhiên trong khoảng 0 tới n − 1 |
| `static RandomGenerator of(String name)` | cho ra generator theo tên thuật toán. Thuật toán `"L64X128MixRandom"` phù hợp với hầu hết ứng dụng |
| `static RandomGenerator getDefault()` | cho ra một generator mạnh với **64 bit state trở lên** |

### `java.util.Random` (Java 1.0)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `static from(RandomGenerator generator)` *(Java 19)* | trả về một instance `Random` mà các method của nó uỷ thác sang `RandomGenerator` cho trước. Hữu ích với **legacy code** |

---

## 4.6.8. Object Destruction and the finalize Method

> *"Some object-oriented programming languages, notably C++, have explicit destructor methods for any cleanup code that may be needed when an object is no longer used. The most common activity in a destructor is reclaiming the memory set aside for objects. Since Java does automatic garbage collection, manual memory reclamation is not needed, so Java does not support destructors."*

**Dịch:** Một số ngôn ngữ OOP, đáng chú ý là C++, có **destructor method tường minh** để chạy code dọn dẹp khi object không còn được dùng. Việc phổ biến nhất trong destructor là **thu hồi bộ nhớ** dành cho object. Vì Java có **garbage collection tự động**, thu hồi bộ nhớ thủ công là không cần thiết, nên **Java không hỗ trợ destructor**.

> *"Of course, some objects utilize a resource other than memory, such as a file or a handle to another object that uses system resources. In this case, it is important that the resource be reclaimed and recycled when it is no longer needed."*

**Dịch:** Tất nhiên có những object dùng **tài nguyên khác ngoài bộ nhớ**, ví dụ một file hay một handle tới object khác đang dùng tài nguyên hệ thống. Trong trường hợp đó, việc **thu hồi và tái sử dụng tài nguyên khi không cần nữa** là quan trọng.

> *"If a resource needs to be closed as soon as you have finished using it, supply a close method that does the necessary cleanup. You can call the close method when you are done with the object. In Chapter 7, you will see how you can ensure that this method is called automatically."*

**Dịch:** Nếu một tài nguyên cần được đóng ngay khi dùng xong, hãy **cung cấp một method `close`** làm phần dọn dẹp cần thiết. Chapter 7 sẽ chỉ cách đảm bảo method này **được gọi tự động**.

> *"If you can wait until the virtual machine exits, add a "shutdown hook" with the method Runtime.addShutdownHook. You can use the Cleaner class to register an action that is carried out when an object is no longer reachable (other than by the cleaner). These are uncommon situations in practice. See the API documentation for details on these two approaches."*

**Dịch:** Nếu chờ được tới lúc virtual machine thoát, thêm một **"shutdown hook"** bằng `Runtime.addShutdownHook`. Dùng class **`Cleaner`** để đăng ký một hành động chạy khi object không còn reachable nữa (ngoài chính cleaner). Đây là các tình huống **hiếm gặp trong thực tế**.

> **Caution (sách):** *"Do not use the finalize method for cleanup. That method was intended to be called before the garbage collector sweeps away an object. However, you simply cannot know when this method will be called, and it is now deprecated for removal."*
>
> **Dịch:** **Đừng dùng method `finalize` để dọn dẹp.** Method đó vốn được thiết kế để chạy trước khi garbage collector quét bỏ một object. Nhưng bạn **đơn giản là không biết được khi nào nó được gọi**, và nó **hiện đã bị deprecated để gỡ bỏ**.

---

## Bài kế tiếp

→ [[07 - Records]] — khi data chỉ là data, `record`, canonical / compact / custom constructor.
