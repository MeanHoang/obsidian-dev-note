# 06 — Abstract Classes

> Chapter 5, Section 5.6 — Core Java Volume I, 13th Edition (Horstmann).
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 5.6. Abstract Classes

> *"As you move up the inheritance hierarchy, classes become more general and probably more abstract. At some point, the ancestor class becomes so general that you think of it more as a basis for other classes than as a class with specific instances you want to use. Consider, for example, an extension of our Employee class hierarchy. An employee is a person, and so is a student. Let us extend our class hierarchy to include classes Person and Student. Figure 5.2 shows the inheritance relationships between these classes."*

**Dịch:** Càng đi lên [[01 - Classes, Superclasses, and Subclasses|inheritance hierarchy]], class càng **tổng quát hơn** và **có lẽ trừu tượng hơn**. Tới một điểm nào đó, class tổ tiên **tổng quát tới mức bạn nghĩ về nó như một nền tảng cho các class khác**, hơn là một class có **instance cụ thể mà bạn muốn dùng**. Ví dụ: mở rộng hierarchy `Employee`. **Một employee là một person, và một student cũng vậy.** Ta mở rộng hierarchy để có thêm class `Person` và `Student`.

**Figure 5.2: Inheritance diagram for Person and its subclasses**

```
                  ┌──────────┐
                  │  Person  │
                  └────△─────┘
                       │
          ┌────────────┴────────────┐
          │                         │
   ┌──────┴─────┐            ┌──────┴────┐
   │  Employee  │            │  Student  │
   └────────────┘            └───────────┘
```

> *"Why bother with so high a level of abstraction? There are some attributes that make sense for every person, such as a name. Both students and employees have names, and introducing a common superclass lets us factor out the getName method to a higher level in the inheritance hierarchy."*

**Dịch:** Sao phải bận tâm tới **mức trừu tượng cao như vậy**? Vì có **một số thuộc tính có nghĩa với mọi person**, chẳng hạn **name**. Cả student lẫn employee đều có tên, và **đưa vào một superclass chung cho phép ta rút method `getName` lên mức cao hơn trong hierarchy**.

> *"Now let's add another method, getDescription, whose purpose is to return a brief description of the person, such as"*

```
an employee with a salary of $50,000.00
a student majoring in computer science
```

> *"It is easy to implement this method for the Employee and Student classes. But what information can you provide in the Person class? The Person class knows nothing about the person except the name. Of course, you could implement Person.getDescription() to return an empty string. But there is a better way. If you use the abstract keyword, you do not need to implement the method at all."*

```java
public abstract String getDescription();
// no implementation required
```

**Dịch:** Giờ thêm method `getDescription`, mục đích là **trả về mô tả ngắn về person**. Cài method này cho `Employee` và `Student` thì **dễ**. Nhưng **`Person` cung cấp được thông tin gì**? Class `Person` **chẳng biết gì về person ngoài cái tên**. Dĩ nhiên bạn có thể cài `Person.getDescription()` **trả về chuỗi rỗng**. Nhưng **có cách tốt hơn**: dùng keyword **`abstract`** thì **bạn không cần cài method chút nào**.

> *"For added clarity, a class with one or more abstract methods must itself be declared abstract."*

```java
public abstract class Person
{
    . . .
    public abstract String getDescription();
}
```

**Dịch:** Để **rõ ràng hơn**, một class **có một hay nhiều abstract method thì bản thân nó phải được khai báo `abstract`**.

> *"In addition to abstract methods, abstract classes can have fields and concrete methods. For example, the Person class stores the name of the person and has a concrete method that returns it."*

```java
public abstract class Person
{
    private String name;

    public Person(String name)
    {
        this.name = name;
    }

    public abstract String getDescription();

    public String getName()
    {
        return name;
    }
}
```

**Dịch:** Ngoài abstract method, **abstract class có được field và concrete method**. Ví dụ `Person` **lưu tên của person** và có **một concrete method trả về tên đó**.

> **Tip (sách):** *"Some programmers don't realize that abstract classes can have concrete methods. You should always move common fields and methods (whether abstract or not) to the superclass (whether abstract or not)."*
>
> **Dịch:** Một số lập trình viên **không nhận ra abstract class có thể có concrete method**. Bạn nên **luôn dời field và method chung** (dù abstract hay không) **lên superclass** (dù abstract hay không).

> *"Abstract methods act as placeholders for methods that are implemented in the subclasses. When you extend an abstract class, you have two choices. You can leave some or all of the abstract methods undefined; then, you must tag the subclass as abstract as well. Or, you can define all methods, and the subclass is no longer abstract."*

**Dịch:** Abstract method **đóng vai trò chỗ giữ chỗ (placeholder)** cho các method **được cài ở subclass**. Khi extend một abstract class, bạn có **hai lựa chọn**: **để một phần hoặc toàn bộ abstract method chưa định nghĩa** — khi đó **phải gắn nhãn `abstract` cho cả subclass**; hoặc **định nghĩa hết mọi method**, và **subclass không còn abstract nữa**.

> *"For example, we will define a Student class that extends the abstract Person class and implements the getDescription method. None of the methods of the Student class are abstract, so it does not need to be declared as an abstract class."*

> *"A class can even be declared as abstract though it has no abstract methods."*

**Dịch:** Không method nào của `Student` là abstract, nên **không cần khai báo nó là abstract class**. Thậm chí **một class vẫn khai báo được là `abstract` dù nó chẳng có abstract method nào**.

> *"Abstract classes cannot be instantiated. That is, if a class is declared as abstract, no objects of that class can be created. For example, the expression"*

```java
new Person("Vince Vu")
```

> *"is an error. However, you can create objects of concrete subclasses."*

**Dịch:** **Abstract class không instantiate được** — nếu một class khai báo `abstract` thì **không tạo được object của class đó**. Nhưng bạn **tạo được object của các concrete subclass**.

> *"Note that you can still create object variables of an abstract class, but such a variable must refer to an object of a nonabstract subclass. For example:"*

```java
Person p = new Student("Vince Vu", "Economics");
```

> *"Here p is a variable of the abstract type Person that refers to an instance of the nonabstract subclass Student."*

**Dịch:** Lưu ý: bạn **vẫn tạo được object variable của một abstract class**, nhưng **biến đó phải trỏ tới object của một subclass không abstract**.

> **C++ Note (sách):** *"In C++, an abstract method is called a pure virtual function and is tagged with a trailing = 0, such as in"*
>
> ```cpp
> class Person // C++
> {
> public:
>     virtual string getDescription() = 0;
>     . . .
> };
> ```
>
> *"A C++ class is abstract if it has at least one pure virtual function. In C++, there is no special keyword to denote abstract classes."*
>
> **Dịch:** Trong C++, abstract method gọi là **pure virtual function** và được gắn nhãn bằng **`= 0` ở cuối**. Một class C++ là abstract nếu nó **có ít nhất một pure virtual function**. C++ **không có keyword riêng để chỉ abstract class**.

> *"Let us define a concrete subclass Student that extends the abstract class Person:"*

```java
public class Student extends Person
{
    private String major;

    public Student(String name, String major)
    {
        super(name);
        this.major = major;
    }

    public String getDescription()
    {
        return "a student majoring in " + major;
    }
}
```

> *"The Student class defines the getDescription method. Therefore, all methods in the Student class are concrete, and the class is no longer an abstract class."*

**Dịch:** `Student` **định nghĩa method `getDescription`**, nên **mọi method trong `Student` đều concrete** và **class này không còn là abstract class**.

> *"The program shown in Listing 5.8 defines the abstract superclass Person (Listing 5.9) and two concrete subclasses, Employee (Listing 5.10) and Student (Listing 5.11). We fill an array of Person references with employee and student objects:"*

```java
var people = new Person[2];
people[0] = new Employee(. . .);
people[1] = new Student(. . .);
```

> *"We then print the names and descriptions of these objects:"*

```java
for (Person p : people)
    System.out.println(p.getName() + ", " + p.getDescription());
```

**Dịch:** Ta **đổ một mảng các reference `Person`** bằng object employee và student, rồi **in tên và mô tả** của chúng.

> *"Some people are baffled by the call"*

```java
p.getDescription()
```

> *"Isn't this a call to an undefined method? Keep in mind that the variable p never refers to a Person object because it is impossible to construct an object of the abstract Person class. The variable p always refers to an object of a concrete subclass such as Employee or Student. For these objects, the getDescription method is defined."*

**Dịch:** Có người **bối rối** với lời gọi `p.getDescription()`: **chẳng phải đây là gọi một method chưa được định nghĩa sao?** Nhớ rằng biến `p` **không bao giờ trỏ tới một object `Person`**, vì **không thể dựng object của abstract class `Person`**. Biến `p` **luôn trỏ tới object của một concrete subclass** như `Employee` hay `Student` — **với những object đó, `getDescription` đã được định nghĩa**.

> *"Could you have omitted the abstract method altogether from the Person superclass, simply defining the getDescription methods in the Employee and Student subclasses? If you did that, you wouldn't have been able to invoke the getDescription method on the variable p. The compiler ensures that you invoke only methods that are declared in the class."*

**Dịch:** Có thể **bỏ hẳn abstract method khỏi superclass `Person`**, chỉ định nghĩa `getDescription` trong `Employee` và `Student` không? Nếu làm vậy thì bạn **sẽ không gọi được `getDescription` trên biến `p`**. **Compiler đảm bảo bạn chỉ gọi những method được khai báo trong class.**

> *"Abstract methods are an important concept in the Java programming language. You will encounter them most commonly inside interfaces. For more information about interfaces, turn to Chapter 6."*

**Dịch:** Abstract method là **khái niệm quan trọng** trong Java. Bạn sẽ **gặp chúng thường xuyên nhất bên trong interface** — xem chương 6.

### Listing 5.8 — `abstractClasses/PersonTest.java`

```java
package abstractClasses;

/**
 * This program demonstrates abstract classes.
 * @version 1.01 2004-02-21
 * @author Cay Horstmann
 */
public class PersonTest
{
    public static void main(String[] args)
    {
        var people = new Person[2];

        // fill the people array with Student and Employee objects
        people[0] = new Employee("Harry Hacker", 50000, 1989, 10, 1);
        people[1] = new Student("Maria Morris", "computer science");

        // print out names and descriptions of all Person objects
        for (Person p : people)
            System.out.println(p.getName() + ", " + p.getDescription());
    }
}
```

### Listing 5.9 — `abstractClasses/Person.java`

```java
package abstractClasses;

public abstract class Person
{
    public abstract String getDescription();

    private String name;

    public Person(String name)
    {
        this.name = name;
    }

    public String getName()
    {
        return name;
    }
}
```

### Listing 5.10 — `abstractClasses/Employee.java`

```java
package abstractClasses;

import java.time.*;

public class Employee extends Person
{
    private double salary;
    private LocalDate hireDay;

    public Employee(String name, double salary, int year, int month, int day)
    {
        super(name);
        this.salary = salary;
        hireDay = LocalDate.of(year, month, day);
    }

    public double getSalary()
    {
        return salary;
    }

    public LocalDate getHireDay()
    {
        return hireDay;
    }

    public String getDescription()
    {
        return "an employee with a salary of $%.2f".formatted(salary);
    }

    public void raiseSalary(double byPercent)
    {
        double raise = salary * byPercent / 100;
        salary += raise;
    }
}
```

### Listing 5.11 — `abstractClasses/Student.java`

```java
package abstractClasses;

public class Student extends Person
{
    private String major;

    /**
     * @param name the student's name
     * @param major the student's major
     */
    public Student(String name, String major)
    {
        // pass name to superclass constructor
        super(name);
        this.major = major;
    }

    public String getDescription()
    {
        return "a student majoring in " + major;
    }
}
```

---

## Bài kế tiếp

→ [[07 - Enumeration Classes]] — kiểu enum thực chất là một class, cùng các method `name`, `valueOf`, `values`, `ordinal`.
