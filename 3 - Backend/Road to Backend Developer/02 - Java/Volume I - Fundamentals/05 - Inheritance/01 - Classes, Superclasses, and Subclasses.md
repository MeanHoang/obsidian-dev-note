# 01 — Classes, Superclasses, and Subclasses

> Chapter 5, Section 5.1 — Core Java Volume I, 13th Edition (Horstmann).
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## Mở đầu chương 5

> *"Chapter 4 introduced you to classes and objects. In this chapter, you will learn about inheritance, another fundamental concept of object-oriented programming. The idea behind inheritance is that you can create new classes that are built on existing classes. When you inherit from an existing class, you reuse (or inherit) its methods, and you can add new methods and fields to adapt your new class to new situations. This technique is essential in Java programming."*

**Dịch:** [[01 - Introduction to Object-Oriented Programming|Chương 4]] đã giới thiệu class và object. Chương này bạn học **inheritance**, một khái niệm nền tảng khác của object-oriented programming. Ý tưởng đằng sau inheritance: bạn **tạo class mới dựng trên class đã có**. Khi kế thừa từ một class có sẵn, bạn **dùng lại (kế thừa) method của nó**, và **thêm được method, field mới** để class mới thích ứng với tình huống mới. Kỹ thuật này là **thiết yếu** trong lập trình Java.

> *"This chapter also covers reflection, the ability to find out more about classes and their properties in a running program. Reflection is a powerful feature, but it is undeniably complex. Since reflection is of greater interest to tool builders than to application programmers, you can probably glance over that part of the chapter upon first reading and come back to it later."*

**Dịch:** Chương này cũng nói về **reflection** — khả năng **tìm hiểu thêm về class và property của chúng trong một chương trình đang chạy**. Reflection mạnh, nhưng **phức tạp không chối cãi được**. Vì reflection hấp dẫn **người làm tool** hơn là người viết ứng dụng, lần đọc đầu bạn có thể **lướt qua** phần đó rồi quay lại sau.

---

## 5.1. Classes, Superclasses, and Subclasses

> *"Let's return to the Employee class discussed in the previous chapter. Suppose (alas) you work for a company where managers are treated differently from other employees. Managers are, of course, just like employees in many respects. Both employees and managers are paid a salary. However, while employees are expected to complete their assigned tasks in return for receiving their salary, managers get bonuses if they actually achieve what they are supposed to do."*

**Dịch:** Quay lại class `Employee` ở [[03 - Defining Your Own Classes|chương trước]]. Giả sử bạn làm cho một công ty nơi **manager được đối xử khác** nhân viên thường. Manager thì cũng **giống employee ở nhiều mặt**: cả hai đều được trả **salary**. Nhưng employee được kỳ vọng hoàn thành công việc được giao để đổi lấy lương, còn **manager thì có bonus** nếu thực sự đạt được điều họ phải đạt.

> *"This is the kind of situation that cries out for inheritance. Why? Well, you need to define a new class, Manager, and add functionality. But you can retain some of what you have already programmed in the Employee class, and all the fields of the original class can be preserved. More abstractly, there is an obvious "is–a" relationship between Manager and Employee. Every manager is an employee: This "is–a" relationship is the hallmark of inheritance."*

**Dịch:** Đây chính là tình huống **kêu gào inheritance**. Vì sao? Bạn cần định nghĩa class mới `Manager` và thêm chức năng. Nhưng bạn **giữ lại được** phần đã viết trong `Employee`, và **mọi field của class gốc được bảo toàn**. Trừu tượng hơn: có một quan hệ **"is–a"** rõ ràng giữa `Manager` và `Employee`. Mọi manager đều là employee — quan hệ **"is–a" chính là dấu hiệu đặc trưng của inheritance**.

> **Note (sách):** *"In this chapter, I use the classic example of employees and managers, but I must ask you to take this example with a grain of salt. In the real world, an employee can become a manager, so you would want to model being a manager as a role of an employee, not a subclass. In my example, however, I assume the corporate world is populated by two kinds of people: those who are forever employees, and those who have always been managers."*
>
> **Dịch:** Chương này dùng ví dụ kinh điển employee/manager, nhưng **hãy tiếp nhận nó có chừng mực**. Ngoài đời, một employee **có thể trở thành** manager, nên bạn sẽ muốn mô hình hoá "làm manager" là một **role** của employee, **không phải subclass**. Trong ví dụ này, tác giả giả định thế giới doanh nghiệp chỉ gồm hai loại người: người **mãi mãi là employee**, và người **luôn luôn là manager**.

---

## 5.1.1. Defining Subclasses

> *"Here is how you define a Manager class that inherits from the Employee class. Use the Java keyword extends to denote inheritance."*

```java
public class Manager extends Employee
{
    added methods and fields
}
```

**Dịch:** Định nghĩa class `Manager` kế thừa từ `Employee` như trên. Dùng keyword `extends` của Java để biểu thị inheritance.

> **C++ Note (sách):** *"Inheritance is similar in Java and C++. Java uses the extends keyword instead of the : token. All inheritance in Java is public inheritance; there is no analog to the C++ features of private and protected inheritance."*
>
> **Dịch:** Inheritance ở Java và C++ tương tự nhau. Java dùng keyword `extends` thay cho token `:`. **Mọi inheritance trong Java đều là public inheritance**; không có thứ tương đương với private/protected inheritance của C++.

> *"The keyword extends indicates that you are making a new class that derives from an existing class. The existing class is called the superclass, base class, or parent class. The new class is called the subclass, derived class, or child class. The terms superclass and subclass are those most commonly used by Java programmers, although some programmers prefer the parent/child analogy, which also ties in nicely with the "inheritance" theme."*

**Dịch:** Keyword `extends` báo rằng bạn đang tạo class mới **dẫn xuất từ class có sẵn**. Class có sẵn gọi là **superclass**, **base class**, hoặc **parent class**. Class mới gọi là **subclass**, **derived class**, hoặc **child class**. Lập trình viên Java hay dùng nhất là **superclass/subclass**, dù một số người thích lối ví von parent/child — vốn cũng ăn khớp với chủ đề "inheritance" (thừa kế).

> *"The Employee class is a superclass, but not because it is superior to its subclass or contains more functionality. In fact, the opposite is true: Subclasses have more functionality than their superclasses. For example, as you will see when we go over the rest of the Manager class code, the Manager class encapsulates more data and has more functionality than its superclass Employee."*

**Dịch:** `Employee` là superclass, nhưng **không phải vì nó "trên cơ" subclass hay chứa nhiều chức năng hơn**. Thực tế **ngược lại**: **subclass có nhiều chức năng hơn superclass**. `Manager` **encapsulate nhiều data hơn** và **có nhiều chức năng hơn** superclass `Employee` của nó.

> **Note (sách):** *"The prefixes super and sub come from the language of sets used in theoretical computer science and mathematics. The set of all employees contains the set of all managers, and thus is said to be a superset of the set of managers. Or, to put it another way, the set of all managers is a subset of the set of all employees."*
>
> **Dịch:** Tiền tố **super** và **sub** đến từ **ngôn ngữ tập hợp** trong khoa học máy tính lý thuyết và toán học. Tập mọi employee **chứa** tập mọi manager, nên nó là **superset** của tập manager. Nói cách khác, tập mọi manager là **subset** của tập mọi employee.

> *"Our Manager class has a new field to store the bonus, and a new method to set it:"*

```java
public class Manager extends Employee
{
    private double bonus;
    . . .
    public void setBonus(double bonus)
    {
        this.bonus = bonus;
    }
}
```

> *"There is nothing special about these methods and fields. If you have a Manager object, you can simply apply the setBonus method."*

```java
Manager boss = . . .;
boss.setBonus(5000);
```

**Dịch:** `Manager` có một field mới lưu **bonus** và một method mới để set nó. **Chẳng có gì đặc biệt** ở các method và field này — có object `Manager` thì cứ gọi `setBonus`.

> *"Of course, if you have an Employee object, you cannot apply the setBonus method—it is not among the methods defined in the Employee class. However, you can use methods such as getName and getHireDay with Manager objects. Even though these methods are not explicitly defined in the Manager class, they are automatically inherited from the Employee superclass."*

**Dịch:** Nhưng nếu có object `Employee` thì **không gọi được** `setBonus` — nó không nằm trong các method định nghĩa ở class `Employee`. Ngược lại, **dùng được** `getName`, `getHireDay` với object `Manager`: dù các method đó không được định nghĩa tường minh trong `Manager`, chúng được **kế thừa tự động** từ superclass `Employee`.

> *"Every Manager object has four fields: name, salary, hireDay, and bonus. The fields name, salary, and hireDay are taken from the superclass."*

**Dịch:** Mọi object `Manager` có **bốn field**: `name`, `salary`, `hireDay`, `bonus`. Ba field `name`, `salary`, `hireDay` **lấy từ superclass**.

> **Note (sách):** *"The Java language specification states: "Members of a class that are declared private are not inherited by subclasses of that class." This has confused my readers over the years. The specification uses the word "inherits" narrowly. It considers the private fields non-inherited because the Manager class cannot access them directly. Thus, every Manager object has three fields from the superclass, but the Manager class does not "inherit" them."*
>
> **Dịch:** Java language specification ghi: *"Các member của một class được khai báo `private` thì không được subclass của class đó kế thừa."* Câu này gây rối cho độc giả suốt nhiều năm. Specification dùng từ **"inherits" theo nghĩa hẹp**: nó coi các private field là **không được kế thừa** vì class `Manager` **không truy cập trực tiếp được**. Vậy nên: **mọi object `Manager` có ba field từ superclass, nhưng class `Manager` không "inherit" chúng.**

> *"When defining a subclass by extending its superclass, you only need to indicate the differences between the subclass and the superclass. When designing classes, you place the most general methods in the superclass and more specialized methods in its subclasses. Factoring out common functionality by moving it to a superclass is routine in object-oriented programming."*

**Dịch:** Khi định nghĩa subclass bằng `extends`, bạn **chỉ cần chỉ ra phần khác biệt** giữa subclass và superclass. Khi thiết kế class, đặt **method tổng quát nhất ở superclass**, method **chuyên biệt hơn ở subclass**. Việc **rút chức năng chung lên superclass** là chuyện thường ngày trong OOP.

> **Note (sách):** *"In Chapter 4, you learned about records: classes whose state is entirely defined by the constructor parameters. You cannot extend a record, and a record cannot extend another class."*
>
> **Dịch:** Chương 4 đã học về [[07 - Records|record]] — class có state được định nghĩa hoàn toàn bởi parameter của constructor. **Không extend được một record, và một record không extend được class khác.**

---

## 5.1.2. Overriding Methods

> *"Some of the superclass methods are not appropriate for the Manager subclass. In particular, the getSalary method should return the sum of the base salary and the bonus. You need to supply a new method to override the superclass method:"*

```java
public class Manager extends Employee
{
    . . .
    public double getSalary()
    {
        . . .
    }
    . . .
}
```

**Dịch:** Một số method của superclass **không phù hợp** với subclass `Manager`. Cụ thể, `getSalary` phải trả về **tổng của base salary và bonus**. Bạn cần cung cấp method mới để **override** method của superclass.

> *"How can you implement this method? At first glance, it appears to be simple—just return the sum of the salary and bonus fields:"*

```java
public double getSalary()
{
    return salary + bonus; // won't work
}
```

> *"However, that won't work. Recall that only the Employee methods have direct access to the private fields of the Employee class. This means that the getSalary method of the Manager class cannot directly access the salary field. If the Manager methods want to access those private fields, they have to do what every other method does—use the public interface, in this case the public getSalary method of the Employee class."*

**Dịch:** Cách này **không chạy**. Nhớ rằng **chỉ method của `Employee`** mới truy cập trực tiếp được private field của `Employee`. Nghĩa là `getSalary` của `Manager` **không truy cập trực tiếp field `salary` được**. Muốn chạm tới các private field đó, method của `Manager` phải làm như mọi method khác: **dùng public interface**, ở đây là method public `getSalary` của `Employee`.

> *"So, let's try again. You need to call getSalary instead of simply accessing the salary field:"*

```java
public double getSalary()
{
    double baseSalary = getSalary(); // still won't work
    return baseSalary + bonus;
}
```

> *"Now, the problem is that the call to getSalary simply calls itself, because the Manager class has a getSalary method (namely, the method we are trying to implement). The consequence is an infinite chain of calls to the same method, leading to a program crash."*

**Dịch:** Thử lại: gọi `getSalary` thay vì truy cập thẳng field `salary`. Nhưng **vẫn không chạy** — lời gọi `getSalary` **tự gọi chính nó**, vì class `Manager` có method `getSalary` (chính là method ta đang implement). Hậu quả là **chuỗi gọi vô hạn** tới cùng một method, dẫn tới **crash chương trình**.

> *"We need to indicate that we want to call the getSalary method of the Employee superclass, not the current class. Use the special keyword super for this purpose."*

```java
super.getSalary()
```

> *"Here is the correct version of the getSalary method for the Manager class:"*

```java
public double getSalary()
{
    double baseSalary = super.getSalary();
    return baseSalary + bonus;
}
```

**Dịch:** Ta cần chỉ rõ mình muốn gọi `getSalary` **của superclass `Employee`**, không phải của class hiện tại. Dùng keyword đặc biệt **`super`** cho mục đích đó. Đoạn trên là **phiên bản đúng** của `getSalary` cho `Manager`.

> **Note (sách):** *"Some people think of super as being analogous to the this reference. However, that analogy is not quite accurate: super is not a reference to an object. For example, you cannot assign the value super to another object variable. Instead, super is a special keyword that directs the compiler to invoke the superclass method."*
>
> **Dịch:** Có người nghĩ `super` tương tự reference [[03 - Defining Your Own Classes|`this`]]. Nhưng **phép so sánh đó không hẳn chính xác**: `super` **không phải là reference tới một object**. Chẳng hạn bạn **không gán được giá trị `super` cho một object variable khác**. `super` là một **keyword đặc biệt chỉ thị compiler gọi method của superclass**.

> *"As you saw, a subclass can add fields, and it can add methods or override the methods of the superclass. However, inheritance can never take away any fields or methods."*

**Dịch:** Subclass **thêm được field**, **thêm được method**, **override được method** của superclass. Nhưng inheritance **không bao giờ lấy đi được** field hay method nào.

> **C++ Note (sách):** *"Java uses the keyword super to call a superclass method. In C++, you would use the name of the superclass with the :: operator instead. For example, the getSalary method of the Manager class would call Employee::getSalary instead of super.getSalary."*
>
> **Dịch:** Java dùng keyword `super` để gọi method của superclass. Trong C++ bạn dùng **tên superclass với toán tử `::`**: `Employee::getSalary` thay cho `super.getSalary`.

---

## 5.1.3. Subclass Constructors

> *"To complete our example, let us supply a constructor."*

```java
public Manager(String name, double salary, int year, int month, int day)
{
    super(name, salary, year, month, day);
    bonus = 0;
}
```

> *"Here, the keyword super has a different meaning. The instruction"*

```java
super(name, salary, year, month, day);
```

> *"is shorthand for "call the constructor of the Employee superclass with name, salary, year, month, and day as arguments.""*

**Dịch:** Ở đây keyword `super` mang **nghĩa khác**. Câu lệnh trên là **cách viết tắt** cho "gọi constructor của superclass `Employee` với `name`, `salary`, `year`, `month`, `day` làm argument".

> *"Since the Manager constructor cannot access the private fields of the Employee class, it must initialize them through a constructor. The constructor is invoked with the special super syntax. The call using super must be the first statement in the constructor for the subclass."*

**Dịch:** Vì constructor của `Manager` **không truy cập được private field** của `Employee`, nó phải **khởi tạo chúng qua một constructor**. Constructor đó được gọi bằng cú pháp `super` đặc biệt. **Lời gọi bằng `super` phải là câu lệnh đầu tiên** trong constructor của subclass.

> *"When a subclass object is constructed without an explicit invocation of a superclass constructor, the superclass must have a no-argument constructor. That constructor is invoked prior to the subclass construction."*

**Dịch:** Khi một object subclass được dựng **mà không gọi tường minh** constructor của superclass, thì **superclass bắt buộc phải có constructor không tham số**. Constructor đó **được gọi trước** khi dựng phần subclass.

> **Note (sách):** *"Recall that the this keyword has two meanings: to denote a reference to the implicit parameter and to call another constructor of the same class. Likewise, the super keyword has two meanings: to invoke a superclass method and to invoke a superclass constructor. When used to invoke constructors, the this and super keywords are closely related. The constructor calls can only occur as the first statement in another constructor. The constructor parameters are either passed to another constructor of the same class (this) or a constructor of the superclass (super)."*
>
> **Dịch:** Nhớ rằng [[06 - Object Construction|`this`]] có **hai nghĩa**: reference tới implicit parameter, và gọi constructor khác của cùng class. Tương tự, **`super` cũng có hai nghĩa**: gọi method của superclass, và gọi constructor của superclass. Khi dùng để gọi constructor, `this` và `super` **rất gần nhau**: lời gọi constructor **chỉ được đứng ở câu lệnh đầu tiên** trong một constructor khác. Parameter được truyền hoặc tới **constructor khác của cùng class (`this`)**, hoặc tới **constructor của superclass (`super`)**.

> **C++ Note (sách):** *"In a C++ constructor, you do not call super, but you use the initializer list syntax to construct the superclass. The Manager constructor would look like this in C++:"*
>
> ```cpp
> // C++
> Manager::Manager(String name, double salary, int year, int month, int day)
>     : Employee(name, salary, year, month, day)
> {
>     bonus = 0;
> }
> ```
>
> **Dịch:** Trong constructor C++ bạn **không gọi `super`** mà dùng **cú pháp initializer list** để dựng superclass.

> *"After you redefine the getSalary method for Manager objects, managers will automatically have the bonus added to their salaries. Here's an example of this at work. We make a new manager and set the manager's bonus:"*

```java
Manager boss = new Manager("Carl Cracker", 80000, 1987, 12, 15);
boss.setBonus(5000);
```

> *"We make an array of three employees:"*

```java
var staff = new Employee[3];
```

> *"We populate the array with a mix of managers and employees:"*

```java
staff[0] = boss;
staff[1] = new Employee("Harry Hacker", 50000, 1989, 10, 1);
staff[2] = new Employee("Tony Tester", 40000, 1990, 3, 15);
```

> *"We print out everyone's salary:"*

```java
for (Employee e : staff)
    System.out.println(e.getName() + " " + e.getSalary());
```

> *"This loop prints the following data:"*

```
Carl Cracker 85000.0
Harry Hacker 50000.0
Tommy Tester 40000.0
```

**Dịch:** Sau khi định nghĩa lại `getSalary` cho object `Manager`, manager **tự động được cộng bonus vào lương**. Ví dụ: tạo manager mới, set bonus, tạo mảng ba employee, đổ vào mảng **hỗn hợp manager và employee**, rồi in lương từng người.

> *"Now staff[1] and staff[2] each print their base salary because they are Employee objects. However, staff[0] is a Manager object whose getSalary method adds the bonus to the base salary."*

**Dịch:** `staff[1]` và `staff[2]` in ra **base salary** vì chúng là object `Employee`. Còn `staff[0]` là object `Manager` — method `getSalary` của nó **cộng bonus vào base salary**.

> *"What is remarkable is that the call"*

```java
e.getSalary()
```

> *"picks out the correct getSalary method. Note that the declared type of e is Employee, but the actual type of the object to which e refers can be either Employee or Manager."*

**Dịch:** Điều đáng chú ý: lời gọi `e.getSalary()` **chọn đúng method `getSalary`**. Lưu ý **kiểu khai báo (declared type)** của `e` là `Employee`, nhưng **kiểu thực tế (actual type)** của object mà `e` trỏ tới có thể là `Employee` **hoặc** `Manager`.

> *"When e refers to an Employee object, the call e.getSalary() calls the getSalary method of the Employee class. However, when e refers to a Manager object, then the getSalary method of the Manager class is called instead. The virtual machine knows about the actual type of the object to which e refers, and therefore can invoke the correct method."*

**Dịch:** Khi `e` trỏ tới object `Employee`, `e.getSalary()` gọi `getSalary` của `Employee`. Khi `e` trỏ tới object `Manager`, `getSalary` của `Manager` được gọi. **Virtual machine biết kiểu thực tế** của object mà `e` trỏ tới, nên **gọi được đúng method**.

> *"The fact that an object variable (such as the variable e) can refer to multiple actual types is called polymorphism. Automatically selecting the appropriate method at runtime is called dynamic binding. I discuss both topics in more detail in this chapter."*

**Dịch:** Việc một **object variable** (như `e`) **trỏ được tới nhiều kiểu thực tế khác nhau** gọi là **polymorphism**. Việc **tự động chọn method phù hợp lúc runtime** gọi là **dynamic binding**.

> **C++ Note (sách):** *"In C++, you need to declare a member function as virtual if you want dynamic binding. In Java, dynamic binding is the default behavior; if you do not want a method to be virtual, you tag it as final. (I discuss the final keyword later in this chapter.)"*
>
> **Dịch:** Trong C++ phải khai báo member function là `virtual` mới có dynamic binding. Trong Java, **dynamic binding là hành vi mặc định**; nếu **không** muốn một method là virtual thì gắn nhãn **`final`**.

> *"Listing 5.1 contains a program that shows how the salary computation differs for Employee (Listing 5.2) and Manager (Listing 5.3) objects."*

### Listing 5.1 — `inheritance/ManagerTest.java`

```java
package inheritance;

/**
 * This program demonstrates inheritance.
 * @version 1.21 2004-02-21
 * @author Cay Horstmann
 */
public class ManagerTest
{
    public static void main(String[] args)
    {
        // construct a Manager object
        var boss = new Manager("Carl Cracker", 80000, 1987, 12, 15);
        boss.setBonus(5000);

        var staff = new Employee[3];

        // fill the staff array with Manager and Employee objects
        staff[0] = boss;
        staff[1] = new Employee("Harry Hacker", 50000, 1989, 10, 1);
        staff[2] = new Employee("Tommy Tester", 40000, 1990, 3, 15);

        // print out information about all Employee objects
        for (Employee e : staff)
            System.out.println("name=" + e.getName() + ",salary=" + e.getSalary());
    }
}
```

### Listing 5.2 — `inheritance/Employee.java`

```java
package inheritance;

import java.time.*;

public class Employee
{
    private String name;
    private double salary;
    private LocalDate hireDay;

    public Employee(String name, double salary, int year, int month, int day)
    {
        this.name = name;
        this.salary = salary;
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

### Listing 5.3 — `inheritance/Manager.java`

```java
package inheritance;

public class Manager extends Employee
{
    private double bonus;

    /**
     * @param name the employee's name
     * @param salary the salary
     * @param year the hire year
     * @param month the hire month
     * @param day the hire day
     */
    public Manager(String name, double salary, int year, int month, int day)
    {
        super(name, salary, year, month, day);
        bonus = 0;
    }

    public double getSalary()
    {
        double baseSalary = super.getSalary();
        return baseSalary + bonus;
    }

    public void setBonus(double b)
    {
        bonus = b;
    }
}
```

---

## 5.1.4. Inheritance Hierarchies

> *"Inheritance need not stop at deriving one layer of classes. We could have an Executive class that extends Manager, for example. The collection of all classes extending a common superclass is called an inheritance hierarchy, as shown in Figure 5.1. The path from a particular class to its ancestors in the inheritance hierarchy is its inheritance chain."*

**Dịch:** Inheritance **không dừng ở một tầng**. Ta có thể có class `Executive` extends `Manager`. Tập hợp **mọi class extend chung một superclass** gọi là **inheritance hierarchy**. **Đường đi từ một class cụ thể lên tổ tiên** của nó trong hierarchy gọi là **inheritance chain**.

**Figure 5.1: Employee inheritance hierarchy**

```
                       ┌────────────┐
                       │  Employee  │
                       └─────△──────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
  ┌─────┴─────┐        ┌─────┴─────┐       ┌──────┴─────┐
  │  Manager  │        │ Secretary │       │ Programmer │
  └─────△─────┘        └───────────┘       └────────────┘
        │
  ┌─────┴─────┐
  │ Executive │
  └───────────┘
```

*△ + nét liền = quan hệ extends, mũi tên trỏ lên superclass.*

> *"There is usually more than one chain of descent from a distant ancestor class. You could form subclasses Programmer or Secretary that extend Employee, and they would have nothing to do with the Manager class (or with each other). This process can continue as long as is necessary."*

**Dịch:** Thường có **nhiều hơn một nhánh hậu duệ** từ một class tổ tiên xa. Bạn có thể tạo subclass `Programmer` hoặc `Secretary` extends `Employee`, và chúng **chẳng liên quan gì** tới `Manager` (hay tới nhau). Quá trình này **tiếp diễn được bao lâu tuỳ nhu cầu**.

> **C++ Note (sách):** *"In C++, a class can have multiple superclasses. Java does not support multiple inheritance. For ways to recover much of the functionality of multiple inheritance, see Chapter 6."*
>
> **Dịch:** Trong C++ một class **có nhiều superclass được**. **Java không hỗ trợ multiple inheritance.** Cách lấy lại phần lớn chức năng của multiple inheritance nằm ở chương 6.

---

## 5.1.5. Polymorphism

> *"A simple rule can help you decide whether or not inheritance is the right design for your data. The "is–a" rule states that every object of the subclass is an object of the superclass. For example, every manager is an employee. Thus, it makes sense for the Manager class to be a subclass of the Employee class. Naturally, the opposite is not true—not every employee is a manager."*

**Dịch:** Một quy tắc đơn giản giúp bạn quyết định inheritance có phải thiết kế đúng không. **Quy tắc "is–a"** nói: **mọi object của subclass đều là một object của superclass**. Mọi manager là một employee, nên để `Manager` là subclass của `Employee` là hợp lý. Dĩ nhiên **chiều ngược lại thì không** — không phải employee nào cũng là manager.

> *"Another way of formulating the "is–a" rule is the substitution principle. That principle states that you can use a subclass object whenever the program expects a superclass object."*

**Dịch:** Một cách phát biểu khác của quy tắc "is–a" là **substitution principle**: bạn **dùng được object của subclass ở bất cứ đâu chương trình mong đợi một object của superclass**.

> *"For example, you can assign a subclass object to a superclass variable."*

```java
Employee e;
e = new Employee(. . .); // Employee object expected
e = new Manager(. . .); // OK, Manager can be used as well
```

> *"In the Java programming language, object variables are polymorphic. A variable of type Employee can refer to an object of type Employee or to an object of any subclass of the Employee class (such as Manager, Executive, Secretary, and so on)."*

**Dịch:** Trong Java, **object variable là polymorphic**. Một biến kiểu `Employee` **trỏ được** tới object kiểu `Employee` **hoặc tới object của bất kỳ subclass nào** của `Employee` (`Manager`, `Executive`, `Secretary`, ...).

> *"We took advantage of this principle in Listing 5.1:"*

```java
Manager boss = new Manager(. . .);
Employee[] staff = new Employee[3];
staff[0] = boss;
```

> *"In this case, the variables staff[0] and boss refer to the same object. However, staff[0] is considered to be only an Employee object by the compiler."*

**Dịch:** `staff[0]` và `boss` **trỏ tới cùng một object**. Nhưng **compiler chỉ coi `staff[0]` là một object `Employee`**.

> *"That means you can call"*

```java
boss.setBonus(5000); // OK
```

> *"but you can't call"*

```java
staff[0].setBonus(5000); // ERROR
```

> *"The declared type of staff[0] is Employee, and the setBonus method is not a method of the Employee class."*

**Dịch:** Kiểu khai báo của `staff[0]` là `Employee`, và **`setBonus` không phải method của `Employee`**.

> *"However, you cannot assign a superclass reference to a subclass variable. For example, it is not legal to make the assignment"*

```java
Manager m = staff[i]; // ERROR
```

> *"The reason is clear: Not all employees are managers. If this assignment were to succeed and m were to refer to an Employee object that is not a manager, then it would later be possible to call m.setBonus(. . .) and a runtime error would occur."*

**Dịch:** **Không gán được superclass reference cho subclass variable.** Lý do rõ ràng: **không phải employee nào cũng là manager**. Nếu phép gán này thành công và `m` trỏ tới một object `Employee` không phải manager, thì sau đó có thể gọi `m.setBonus(...)` và **sinh runtime error**.

> **Caution (sách):** *"In Java, arrays of subclass references can be converted to arrays of superclass references without a cast. For example, consider this array of managers:"*
>
> ```java
> Manager[] managers = new Manager[10];
> ```
>
> *"It is legal to convert this array to an Employee[] array:"*
>
> ```java
> Employee[] staff = managers; // OK
> ```
>
> *"Sure, why not, you may think. After all, if managers[i] is a Manager, it is also an Employee. But actually, something surprising is going on. Keep in mind that managers and staff are references to the same array. Now consider the statement"*
>
> ```java
> staff[0] = new Employee("Harry Hacker", . . .);
> ```
>
> *"The compiler will cheerfully allow this assignment. But staff[0] and managers[0] are the same reference, so it looks as if we managed to smuggle a mere employee into the management ranks. That would be very bad—calling managers[0].setBonus(1000) would try to access a nonexistent instance field and would corrupt neighboring memory."*
>
> *"To make sure no such corruption can occur, all arrays remember the element type with which they were created, and they monitor that only compatible references are stored into them. For example, the array created as new Manager[10] remembers that it is an array of managers. Attempting to store an Employee reference causes an ArrayStoreException."*
>
> **Dịch:** Trong Java, **mảng các subclass reference chuyển được thành mảng các superclass reference mà không cần cast**. Nhưng có chuyện bất ngờ: `managers` và `staff` là **reference tới cùng một mảng**. Compiler **vui vẻ cho phép** gán một `Employee` vào `staff[0]`, mà `staff[0]` và `managers[0]` là **cùng một reference** — nghĩa là ta đã **tuồn được một employee thường vào hàng ngũ quản lý**. Rất tệ: gọi `managers[0].setBonus(1000)` sẽ **truy cập một instance field không tồn tại** và **làm hỏng vùng nhớ kế bên**.
>
> Để đảm bảo không xảy ra chuyện đó, **mọi mảng đều nhớ kiểu phần tử lúc được tạo ra** và **giám sát để chỉ những reference tương thích mới lưu vào được**. Mảng tạo bằng `new Manager[10]` nhớ nó là mảng manager; **cố lưu một reference `Employee` sẽ gây `ArrayStoreException`**.

---

## 5.1.6. Understanding Method Calls

> *"It is important to understand exactly how a method call is applied to an object. Let's say we call x.f(args), and the implicit argument x is declared to be an object of class C. Here is what happens:"*

**Dịch:** Cần hiểu **chính xác cách một lời gọi method được áp lên object**. Giả sử gọi `x.f(args)`, và [[03 - Defining Your Own Classes|implicit argument]] `x` được khai báo là object của class `C`. Đây là những gì xảy ra:

### Bước 1 — compiler liệt kê ứng viên

> *"1. The compiler looks at the declared type of the object and the method name. Note that there may be multiple methods, all with the same name, f, but with different parameter types. For example, there may be a method f(int) and a method f(String). The compiler enumerates all methods called f in the class C and all accessible methods called f in the superclasses of C. (Private methods of the superclass are not accessible.) Now the compiler knows all possible candidates for the method to be called."*

**Dịch:** Compiler nhìn **declared type của object** và **tên method**. Có thể có **nhiều method cùng tên `f` nhưng khác kiểu parameter** (`f(int)`, `f(String)`). Compiler **liệt kê mọi method tên `f` trong class `C`** và **mọi method `f` truy cập được ở các superclass của `C`** (private method của superclass **không** truy cập được). Giờ compiler biết **mọi ứng viên khả dĩ**.

### Bước 2 — overloading resolution

> *"2. Next, the compiler determines the types of the arguments supplied in the method call. If among all the methods called f there is a unique method whose parameter types are a best match for the supplied arguments, that method is chosen to be called. This process is called overloading resolution. For example, in a call x.f("Hello"), the compiler picks f(String) and not f(int). The situation can get complex because of type conversions (int to double, Manager to Employee, and so on). If the compiler cannot find any method with matching parameter types or if multiple methods all match after applying conversions, the compiler reports an error. Now the compiler knows the name and parameter types of the method that needs to be called."*

**Dịch:** Compiler xác định **kiểu của các argument** được truyền. Nếu trong các method tên `f` có **một method duy nhất khớp tốt nhất** với argument thì method đó được chọn. Quá trình này gọi là **[[06 - Object Construction|overloading resolution]]**. Với `x.f("Hello")`, compiler chọn `f(String)` chứ không phải `f(int)`. Tình huống **phức tạp lên vì các phép chuyển kiểu** (`int` → `double`, `Manager` → `Employee`...). Nếu **không tìm được method nào khớp**, hoặc **nhiều method cùng khớp** sau khi áp dụng chuyển kiểu, compiler **báo lỗi**.

> **Note (sách):** *"Recall that the name and parameter type list for a method are called the method's signature. For example, f(int) and f(String) are two methods with the same name but different signatures. If you define a method in a subclass that has the same signature as a superclass method, you override the superclass method."*
>
> *"The return type is not part of the signature. However, when you override a method, you need to keep the return type compatible. A subclass may change the return type to a subtype of the original type. For example, suppose the Employee class has a method"*
>
> ```java
> public Employee getBuddy() { . . . }
> ```
>
> *"A manager would never want to have a lowly employee as a buddy. To reflect that fact, the Manager subclass can override this method as"*
>
> ```java
> public Manager getBuddy() { . . . } // OK to change return type
> ```
>
> *"We say that the two getBuddy methods have covariant return types."*
>
> **Dịch:** Nhớ rằng **tên method + danh sách kiểu parameter** gọi là **signature** của method. `f(int)` và `f(String)` là hai method **cùng tên, khác signature**. Nếu bạn định nghĩa trong subclass một method **cùng signature** với method của superclass thì bạn **override** method đó.
>
> **Kiểu trả về không thuộc signature.** Nhưng khi override, bạn phải **giữ kiểu trả về tương thích**. Subclass **được phép đổi kiểu trả về thành subtype** của kiểu gốc. Ta nói hai method `getBuddy` có **covariant return types**.

### Bước 3 — static binding hay dynamic binding

> *"3. If the method is private, static, final, or a constructor, then the compiler knows exactly which method to call. (The final modifier is explained in the next section.) This is called static binding. Otherwise, the method to be called depends on the actual type of the implicit argument, and dynamic binding must be used at runtime. In our example, the compiler would generate an instruction to call f(String) with dynamic binding."*

**Dịch:** Nếu method là **`private`, `static`, `final`, hoặc constructor**, compiler **biết chính xác method nào được gọi** — gọi là **static binding**. Ngược lại, method được gọi **phụ thuộc actual type của implicit argument**, và phải dùng **dynamic binding lúc runtime**.

### Bước 4 — method table

> *"4. When the program runs and uses dynamic binding to call a method, the virtual machine must call the version of the method that is appropriate for the actual type of the object to which x refers. Let's say the actual type is D, a subclass of C. If the class D defines a method f(String), that method is called. If not, D's superclass is searched for a method f(String), and so on."*

**Dịch:** Khi chương trình chạy và dùng dynamic binding, **virtual machine phải gọi phiên bản method phù hợp với actual type** của object mà `x` trỏ tới. Nếu actual type là `D` (subclass của `C`) và `D` định nghĩa `f(String)` thì method đó được gọi; nếu không thì **tìm lên superclass của `D`**, và cứ thế.

> *"It would be time-consuming to carry out this search every time a method is called. Instead, the virtual machine precomputes a method table for each class. The method table lists all method signatures and the actual methods to be called."*

**Dịch:** **Tìm kiếm như vậy mỗi lần gọi method thì tốn thời gian.** Thay vào đó, virtual machine **tính trước một method table cho mỗi class**. Method table **liệt kê mọi method signature và method thực sự sẽ được gọi**.

> *"The virtual machine can build the method table after loading a class, by combining the methods that it finds in the class file with the method table of the superclass."*

**Dịch:** Virtual machine **dựng method table sau khi load class**, bằng cách **kết hợp các method tìm thấy trong file class với method table của superclass**.

> *"When a method is actually called, the virtual machine simply makes a table lookup. In our example, the virtual machine consults the method table for the class D and looks up the method to call for f(String). That method may be D.f(String) or X.f(String), where X is some superclass of D. There is one twist to this scenario. If the call is super.f(param), then the virtual machine consults the method table of the superclass."*

**Dịch:** Khi method thực sự được gọi, virtual machine chỉ **tra bảng**. Có **một ngoại lệ**: nếu lời gọi là **`super.f(param)`** thì virtual machine **tra method table của superclass**.

> *"Let's look at this process in detail in the call e.getSalary() in Listing 5.1. The declared type of e is Employee. The Employee class has a single method, called getSalary, with no method parameters. Therefore, in this case, we don't worry about overloading resolution."*

**Dịch:** Xét chi tiết lời gọi `e.getSalary()` ở Listing 5.1. Declared type của `e` là `Employee`. Class `Employee` có **duy nhất một method tên `getSalary`, không parameter**, nên **không phải lo overloading resolution**.

> *"The getSalary method is not private, static, or final, so it is dynamically bound. The virtual machine produces method tables for the Employee and Manager classes. The Employee table shows that all methods are defined in the Employee class itself:"*

```
Employee:
getName() -> Employee.getName()
getSalary() -> Employee.getSalary()
getHireDay() -> Employee.getHireDay()
raiseSalary(double) -> Employee.raiseSalary(double)
```

**Dịch:** `getSalary` **không phải `private`, `static`, hay `final`**, nên nó được **dynamic binding**. Bảng của `Employee` cho thấy **mọi method đều định nghĩa ngay trong `Employee`**.

> *"Actually, that isn't the whole story—as you will see later in this chapter, the Employee class has a superclass Object from which it inherits a number of methods. I ignore the Object methods for now."*

**Dịch:** Thực ra **đó chưa phải toàn bộ câu chuyện** — `Employee` có superclass `Object` mà nó kế thừa **một số method**. Tạm bỏ qua các method của `Object`.

> *"The Manager method table is slightly different. Three methods are inherited, one method is redefined, and one method is added."*

```
Manager:
getName() -> Employee.getName()
getSalary() -> Manager.getSalary()
getHireDay() -> Employee.getHireDay()
raiseSalary(double) -> Employee.raiseSalary(double)
setBonus(double) -> Manager.setBonus(double)
```

**Dịch:** Method table của `Manager` **khác một chút**: **ba method được kế thừa**, **một method được định nghĩa lại**, **một method được thêm vào**.

> *"At runtime, the call e.getSalary() is resolved as follows:"*
>
> *"1. First, the virtual machine fetches the method table for the actual type of e. That may be the table for Employee, Manager, or another subclass of Employee."*
> *"2. Then, the virtual machine looks up the defining class for the getSalary() signature. Now it knows which method to call."*
> *"3. Finally, the virtual machine calls the method."*

**Dịch:** Lúc runtime, `e.getSalary()` được phân giải như sau:

| # | Bước |
|---|---|
| 1 | Virtual machine **lấy method table cho actual type của `e`** (có thể là bảng của `Employee`, `Manager`, hoặc subclass khác của `Employee`) |
| 2 | Virtual machine **tra class định nghĩa** cho signature `getSalary()` — giờ nó biết gọi method nào |
| 3 | Virtual machine **gọi method** |

> *"Dynamic binding has a very important property: It makes programs extensible without the need for modifying existing code. Suppose a new class Executive is added and there is the possibility that the variable e refers to an object of that class. The code containing the call e.getSalary() need not be recompiled. The Executive.getSalary() method is called automatically if e happens to refer to an object of type Executive."*

**Dịch:** Dynamic binding có một **tính chất rất quan trọng**: nó làm chương trình **mở rộng được mà không cần sửa code có sẵn**. Thêm class mới `Executive` thì đoạn code chứa `e.getSalary()` **không cần biên dịch lại**; `Executive.getSalary()` **được gọi tự động** nếu `e` tình cờ trỏ tới object kiểu `Executive`.

> **Caution (sách):** *"When you override a method, the subclass method must be at least as visible as the superclass method. In particular, if the superclass method is public, the subclass method must also be declared public. It is a common error to accidentally omit the public specifier for the subclass method. The compiler then complains that you try to supply a more restrictive access privilege."*
>
> **Dịch:** Khi override một method, **method của subclass phải có mức hiển thị ít nhất bằng method của superclass**. Cụ thể, nếu method superclass là `public` thì method subclass **cũng phải khai báo `public`**. **Lỗi thường gặp** là vô tình **quên chữ `public`** ở method subclass; khi đó compiler kêu rằng bạn **đang cấp quyền truy cập hạn chế hơn**.

---

## 5.1.7. Preventing Inheritance: Final Classes and Methods

> *"Occasionally, you want to prevent someone from forming a subclass of one of your classes. Classes that cannot be extended are called final classes, and you use the final modifier in the definition of the class to indicate this. For example, suppose we want to prevent others from subclassing the Executive class. Simply declare the class using the final modifier, as follows:"*

```java
public final class Executive extends Manager
{
    . . .
}
```

**Dịch:** Đôi khi bạn muốn **ngăn người khác tạo subclass** từ class của mình. Class **không extend được** gọi là **final class**, và bạn dùng modifier **`final`** trong định nghĩa class để thể hiện điều đó.

> *"You can also make a specific method in a class final. If you do this, then no subclass can override that method. (All methods in a final class are automatically final.) For example:"*

```java
public class Employee
{
    . . .
    public final String getName()
    {
        return name;
    }
    . . .
}
```

**Dịch:** Bạn cũng **làm `final` cho một method cụ thể** được. Khi đó **không subclass nào override được method đó**. (**Mọi method trong một final class đều tự động là `final`.**)

> **Note (sách):** *"Recall that fields can also be declared as final. A final field cannot be changed after the object has been constructed. However, if a class is declared final, only the methods, not the fields, are automatically final."*
>
> **Dịch:** Nhớ rằng [[03 - Defining Your Own Classes|field cũng khai báo `final` được]]. Một final field **không đổi được sau khi object đã được dựng**. Nhưng nếu **class** được khai báo `final` thì **chỉ method, không phải field**, mới tự động thành `final`.

> *"There is only one good reason to make a method or class final: to make sure its semantics cannot be changed in a subclass. For example, the getTime and setTime methods of the Calendar class are final. This indicates that the designers of the Calendar class have taken over responsibility for the conversion between the Date class and the calendar state. No subclass should be allowed to mess up this arrangement."*

**Dịch:** **Chỉ có một lý do chính đáng** để làm method hay class `final`: **đảm bảo ngữ nghĩa của nó không bị đổi ở subclass**. Ví dụ `getTime` và `setTime` của class `Calendar` là `final` — báo rằng người thiết kế `Calendar` **đã nhận trách nhiệm** chuyển đổi giữa class `Date` và trạng thái calendar. **Không subclass nào được phép phá vỡ sắp đặt này.**

> *"Similarly, the String class is a final class. That means nobody can define a subclass of String. In other words, if you have a String reference, you know it refers to a String and nothing but a String."*

**Dịch:** Tương tự, [[05 - Strings|`String`]] là một **final class**. Nghĩa là **không ai định nghĩa được subclass của `String`**. Nói cách khác, có một `String` reference thì bạn **biết chắc** nó trỏ tới một `String` **và không gì khác ngoài `String`**.

### Đừng gọi method có thể bị override trong constructor

> *"If you call a method in a constructor, you should declare it as final. Otherwise, it can be overridden in a subclass, and it can access a partially constructed subclass instance. Here is an example. For debugging purposes, the Employee constructor displays a description of the constructed object."*

```java
public class Employee
{
    public Employee(String name, double salary, int year, int month, int day)
    {
        this.name = name;
        this.salary = salary;
        hireDay = LocalDate.of(year, month, day);
        System.out.println("Constructed " + description());
    }

    public String description()
    {
        return "An employee with a salary of " + salary;
    }
    . . .
}
```

**Dịch:** Nếu bạn **gọi một method trong constructor**, bạn nên khai báo method đó là **`final`**. Nếu không, nó **có thể bị override ở subclass**, và **truy cập vào một instance subclass mới dựng dở**.

> *"Now a new class is added to the hierarchy of employee classes—executives with titles:"*

```java
public class Executive
{
    private String title;

    public Executive(String name, String title, double salary,
        int year, int month, int day)
    {
        super(name, salary, year, month, day);
        this.title = title;;
    }

    public String getTitle()
    {
        return title;
    }

    public String description()
    {
        if (title.length() >= 30)
            return "An executive with an impressive title";
        else
            return "An executive with a title of " + title;
    }
}
```

> *"When an Executive is constructed, its constructor first calls the Manager constructor, which calls the Employee constructor, which calls the description method. Because of polymorphism, that is the description method in the Executive class! Unfortunately, the Executive constructor hasn't finished yet. The title instance variable is still null, causing a NullPointerException."*

**Dịch:** Khi dựng một `Executive`, constructor của nó **trước tiên gọi constructor `Manager`**, cái này gọi constructor `Employee`, cái này gọi method `description`. **Vì polymorphism, đó là `description` của class `Executive`!** Khổ nỗi constructor của `Executive` **chưa chạy xong**: instance variable `title` **vẫn là `null`**, gây [[03 - Defining Your Own Classes|`NullPointerException`]].

> *"Calling a method in a constructor is inherently dangerous. The constructor must have done enough work for the method to succeed. If the method can be overridden, this becomes very difficult to ensure. Therefore, it is best to call only final or private methods in a constructor."*

**Dịch:** **Gọi method trong constructor tự thân đã nguy hiểm.** Constructor phải **làm đủ việc** thì method mới chạy trót lọt. Nếu method **có thể bị override** thì rất khó đảm bảo điều đó. Vì vậy, **tốt nhất chỉ gọi method `final` hoặc `private` trong constructor**.

> **Tip (sách):** *"Since Java 21, if you compile with the -Xlint or -Xlint:this-escape flag, the compiler issues a warning when the constructor of a public class calls a method that is not final or private."*
>
> *"The name of the flag is a bit unfortunate since there are other situations where the this reference can "escape" from a constructor that the compiler does not currently detect."*
>
> **Dịch:** **Từ Java 21**, nếu biên dịch với cờ `-Xlint` hoặc `-Xlint:this-escape`, compiler **phát cảnh báo** khi constructor của một public class **gọi một method không phải `final` cũng không phải `private`**. Tên cờ này **hơi đáng tiếc** vì còn những tình huống khác mà reference `this` **"thoát" khỏi constructor** mà compiler **hiện chưa phát hiện được**.

> **C++ Note (sách):** *"In C++, method calls in a constructor are not polymorphic. For example, if you call getDescription in an Employee constructor, it always invokes Employee::getDescription."*
>
> **Dịch:** Trong C++, **lời gọi method trong constructor không polymorphic**: gọi `getDescription` trong constructor `Employee` thì **luôn gọi `Employee::getDescription`**.

### final và tối ưu hoá

> *"Some programmers believe that you should declare all methods as final unless you have a good reason to want polymorphism. In fact, in C++ and C#, methods do not use polymorphism unless you specifically request it. That may be a bit extreme, but I agree that it is a good idea to think carefully about final methods and classes when you design a class hierarchy."*

**Dịch:** Một số lập trình viên tin rằng nên khai báo **mọi method là `final`** trừ khi có lý do chính đáng muốn polymorphism. Thực tế ở C++ và C#, method **không dùng polymorphism trừ khi bạn yêu cầu cụ thể**. Quan điểm đó **hơi cực đoan**, nhưng tác giả đồng ý rằng **nên cân nhắc kỹ về final method và final class khi thiết kế class hierarchy**.

> *"In the early days of Java, some programmers used the final keyword hoping to avoid the overhead of dynamic binding. If a method is not overridden, and it is short, then a compiler can optimize the method call away—a process called inlining. For example, inlining the call e.getName() replaces it with the field access e.name. This is a worthwhile improvement—CPUs hate branching because it interferes with their strategy of prefetching instructions while processing the current one. However, if getName can be overridden in another class, then the compiler cannot inline it because it has no way of knowing what the overriding code may do."*

**Dịch:** **Thời Java sơ khai**, một số lập trình viên dùng `final` với hy vọng **tránh chi phí của dynamic binding**. Nếu một method **không bị override** và **ngắn** thì compiler **tối ưu bỏ luôn lời gọi method** — quá trình gọi là **inlining**. Ví dụ inline `e.getName()` sẽ thay nó bằng **truy cập field `e.name`**. Đây là **cải thiện đáng giá**: **CPU ghét branching** vì nó cản chiến lược **nạp trước lệnh** trong lúc xử lý lệnh hiện tại. Nhưng nếu `getName` **có thể bị override** ở class khác thì compiler **không inline được**, vì nó **không có cách nào biết code override sẽ làm gì**.

> *"Fortunately, the just-in-time compiler in the virtual machine can do a better job than a traditional compiler. It knows exactly which classes extend a given class, and it can check whether any class actually overrides a given method. If a method is short, frequently called, and not actually overridden, the just-in-time compiler can inline it. What happens if the virtual machine loads another subclass that overrides an inlined method? Then the optimizer must undo the inlining. That takes time, but it happens rarely."*

**Dịch:** May thay, **just-in-time compiler** trong virtual machine **làm tốt hơn compiler truyền thống**. Nó **biết chính xác class nào extend class nào**, và **kiểm tra được** có class nào thực sự override một method hay không. Nếu method **ngắn, được gọi thường xuyên, và thực tế không bị override** thì JIT compiler **inline được**. Nếu virtual machine **load thêm một subclass override method đã inline**? Thì **optimizer phải huỷ bỏ việc inline**. Việc đó **tốn thời gian nhưng hiếm khi xảy ra**.

> **Note (sách):** *"Enumerations and records are always final—you cannot extend them."*
>
> **Dịch:** **Enumeration và [[07 - Records|record]] luôn là `final`** — bạn **không extend được** chúng.

---

## 5.1.8. Casting

> *"Recall from Chapter 3 that the process of forcing a conversion from one type to another is called casting. The Java programming language has a special notation for casts. For example,"*

```java
double x = 3.405;
int nx = (int) x;
```

> *"converts the value of the expression x into an integer, discarding the fractional part."*

**Dịch:** Nhớ từ [[02 - Data Types|chương 3]] rằng việc **ép chuyển từ kiểu này sang kiểu khác** gọi là **casting**. Java có **ký pháp riêng** cho cast. Ví dụ trên chuyển giá trị của biểu thức `x` thành số nguyên, **bỏ phần thập phân**.

> *"Just as you occasionally need to convert a floating-point number to an integer, you may need to convert an object reference from one class to another. Let's again use the example of an array containing a mix of Employee and Manager objects:"*

```java
var staff = new Employee[3];
staff[0] = new Manager("Carl Cracker", 80000, 1987, 12, 15);
staff[1] = new Employee("Harry Hacker", 50000, 1989, 10, 1);
staff[2] = new Employee("Tony Tester", 40000, 1990, 3, 15);
```

> *"To actually make a cast of an object reference, use a syntax similar to what you use for casting numeric expressions. Surround the target class name with parentheses and place it before the object reference you want to cast. For example:"*

```java
Manager boss = (Manager) staff[0];
```

**Dịch:** Cũng như thỉnh thoảng cần chuyển số thực thành số nguyên, bạn có thể cần **chuyển một object reference từ class này sang class khác**. Cú pháp **tương tự cast biểu thức số**: **bọc tên class đích trong ngoặc đơn** rồi đặt **trước object reference** muốn cast.

> *"There is only one reason why you would want to make a cast—to use an object in its full capacity after its actual type has been temporarily forgotten. For example, in the ManagerTest class, the staff array had to be an array of Employee objects because some of its elements were regular employees. We would need to cast the managerial elements of the array back to Manager to access any of its new variables."*

**Dịch:** **Chỉ có một lý do** để cast: **dùng object với toàn bộ khả năng của nó sau khi actual type của nó tạm thời bị quên đi**. Trong `ManagerTest`, mảng `staff` **buộc phải là mảng `Employee`** vì một số phần tử là employee thường. Ta cần **cast các phần tử là manager về `Manager`** để truy cập các biến mới của nó.

> *"(Note that in the sample code for the first section, I made a special effort to avoid the cast. I initialized the boss variable with a Manager object before storing it in the array. I needed the correct type to set the bonus of the manager.)"*

**Dịch:** (Lưu ý: trong code mẫu ở phần đầu, tác giả **cố ý tránh cast** — khởi tạo biến `boss` bằng một object `Manager` **trước khi** lưu vào mảng, vì cần đúng kiểu để set bonus.)

> *"As you know, in Java every variable has a type. The type describes the kind of object the variable refers to and what it can do. For example, staff[i] refers to an Employee object (so it can also refer to a Manager object)."*

**Dịch:** Trong Java **mọi biến đều có kiểu**. Kiểu mô tả **loại object mà biến trỏ tới** và **nó làm được gì**.

> *"The compiler checks that you do not promise too much when you store a value in a variable. If you assign a subclass reference to a superclass variable, you are promising less, and the compiler will simply let you do it. If you assign a superclass reference to a subclass variable, you are promising more. Then you must use a cast so that your promise can be checked at runtime."*

**Dịch:** Compiler kiểm tra rằng bạn **không hứa quá nhiều** khi lưu giá trị vào biến. Gán **subclass reference vào superclass variable** = bạn **hứa ít hơn**, compiler **cho phép**. Gán **superclass reference vào subclass variable** = bạn **hứa nhiều hơn**; khi đó **phải cast** để lời hứa **được kiểm tra lúc runtime**.

> *"What happens if you try to cast down an inheritance chain and are "lying" about what an object contains?"*

```java
Manager boss = (Manager) staff[1]; // ERROR
```

> *"When the program runs, the Java runtime system notices the broken promise and generates a ClassCastException. If you do not catch the exception, your program terminates. Thus, it is good programming practice to find out whether a cast will succeed before attempting it. Simply use the instanceof operator. For example:"*

```java
if (staff[i] instanceof Manager)
{
    boss = (Manager) staff[i];
    . . .
}
```

**Dịch:** Nếu bạn **cast xuống dọc inheritance chain** mà **"nói dối"** về nội dung object thì: lúc chạy, **Java runtime nhận ra lời hứa bị bội** và sinh **`ClassCastException`**. Không catch exception thì **chương trình bị kết thúc**. Vì vậy, **thói quen tốt** là **kiểm tra xem cast có thành công không trước khi cast** — dùng toán tử **`instanceof`**.

> *"Finally, the compiler will not let you make a cast if there is no chance for the cast to succeed. For example, the cast"*

```java
String c = (String) staff[i];
```

> *"is a compile-time error because String is not a subclass of Employee."*

**Dịch:** Cuối cùng, compiler **không cho bạn cast nếu không có cơ hội nào để cast thành công**. Cast trên là **lỗi compile-time** vì `String` **không phải subclass của `Employee`**.

> *"To sum up: You can cast only within an inheritance hierarchy. Use instanceof to check before casting from a superclass to a subclass."*

**Tóm tắt (dịch):**

| # | Quy tắc |
|---|---|
| 1 | **Chỉ cast được trong phạm vi một inheritance hierarchy** |
| 2 | Dùng **`instanceof` để kiểm tra trước khi cast** từ superclass xuống subclass |

> **Note (sách):** *"The test"*
>
> ```java
> x instanceof C
> ```
>
> *"does not generate an exception if x is null. It simply returns false. That makes sense: null refers to no object, so it certainly doesn't refer to an object of type C."*
>
> **Dịch:** Phép kiểm tra `x instanceof C` **không sinh exception nếu `x` là `null`** — nó chỉ **trả về `false`**. Điều đó hợp lý: **`null` không trỏ tới object nào**, nên chắc chắn không trỏ tới object kiểu `C`.

> *"Actually, converting the type of an object by a cast is not usually a good idea. In our example, you do not need to cast an Employee object to a Manager object for most purposes. The getSalary method will work correctly on both objects of both classes. The dynamic binding that makes polymorphism work locates the correct method automatically."*

**Dịch:** Thực ra, **chuyển kiểu object bằng cast thường không phải ý hay**. Trong ví dụ này, với đa số mục đích bạn **không cần cast** `Employee` sang `Manager`: `getSalary` **chạy đúng trên object của cả hai class**. **Dynamic binding** — thứ làm polymorphism hoạt động — **tự tìm đúng method**.

> *"The only reason to make the cast is to use a method that is unique to managers, such as setBonus. If for some reason you find yourself wanting to call setBonus on Employee objects, ask yourself whether this is an indication of a design flaw in the superclass. It may make sense to redesign the superclass and add a setBonus method. Remember, it takes only one uncaught ClassCastException to terminate your program. In general, it is best to minimize the use of casts and the instanceof operator."*

**Dịch:** **Lý do duy nhất** để cast là **dùng một method riêng của manager**, như `setBonus`. Nếu vì lý do nào đó bạn thấy mình muốn gọi `setBonus` trên object `Employee`, **hãy tự hỏi đó có phải dấu hiệu của một lỗi thiết kế ở superclass không** — có khi nên **thiết kế lại superclass và thêm method `setBonus`**. Nhớ rằng **chỉ cần một `ClassCastException` không được catch là chương trình kết thúc**. Nhìn chung, **tốt nhất là hạn chế tối đa việc dùng cast và toán tử `instanceof`**.

> **C++ Note (sách):** *"Java uses the cast syntax from the "bad old days" of C, but it works like the safe dynamic_cast operation of C++. For example,"*
>
> ```java
> Employee[] staff = ...;
> Manager boss = (Manager) staff[i]; // Java
> ```
>
> *"is equivalent to"*
>
> ```cpp
> Employee* staff[] = ...;
> Manager* boss = dynamic_cast<Manager*>(staff[i]); // C++
> ```
>
> *"There is one important difference. If the dynamic_cast fails, it yields a null pointer instead of throwing an exception."*
>
> **Dịch:** Java dùng **cú pháp cast từ "thời xưa tệ hại" của C**, nhưng nó **hoạt động như thao tác `dynamic_cast` an toàn của C++**. Một khác biệt quan trọng: nếu `dynamic_cast` **thất bại**, nó cho ra **null pointer** thay vì **ném exception**.

---

## 5.1.9. Pattern Matching for instanceof

> *"The code"*
>
> ```java
> if (staff[i] instanceof Manager)
> {
>     Manager boss = (Manager) staff[i];
>     boss.setBonus(5000);
> }
> ```
>
> *"is rather verbose. Do we really need to mention the subclass Manager three times?"*

**Dịch:** Đoạn code trên **khá dài dòng**. Ta có thực sự cần **nhắc tới subclass `Manager` ba lần** không?

> *"As of Java 16, there is an easier way. You can declare the subclass variable right in the instanceof test:"*

```java
if (staff[i] instanceof Manager boss)
{
    boss.setBonus(5000);
}
```

> *"If staff[i] is an instance of the Manager class, then the variable boss is set to staff[i], and you can use it as a Manager. You skip the cast."*

**Dịch:** **Từ Java 16** có cách dễ hơn: **khai báo biến subclass ngay trong phép kiểm tra `instanceof`**. Nếu `staff[i]` là instance của `Manager` thì biến `boss` **được gán bằng `staff[i]`** và dùng được như một `Manager`. **Bỏ được cast.**

> *"If staff[i] doesn't refer to a Manager, boss is not set, and the instanceof operator yields the value false. The body of the if statement is skipped."*

**Dịch:** Nếu `staff[i]` **không trỏ tới một `Manager`** thì `boss` **không được gán**, `instanceof` **cho ra `false`**, và **thân lệnh `if` bị bỏ qua**.

> **Tip (sách):** *"In most situations in which you use instanceof, you need to apply a subclass method. Then use this "pattern-matching" form of instanceof instead of a cast."*
>
> **Dịch:** Trong **đa số tình huống dùng `instanceof`**, bạn cần **gọi một method của subclass**. Khi đó hãy dùng **dạng "pattern-matching" của `instanceof`** thay cho cast.

> *"A useless instanceof pattern is a compile-time error:"*

```java
Manager boss = . . .;
if (boss instanceof Employee e) . . . // ERROR: Of course it's an Employee
```

**Dịch:** Một **`instanceof` pattern vô dụng** là **lỗi compile-time**.

> **Note (sách):** *"The equally useless"*
>
> ```java
> if (boss instanceof Employee) . . .
> ```
>
> *"is allowed, for backward compatibility with Java 1.0."*
>
> **Dịch:** Dạng **vô dụng ngang ngửa** ở trên thì **vẫn được cho phép**, vì **tương thích ngược với Java 1.0**.

> *"When an instanceof pattern introduces a variable, you can use it right away, in the same expression:"*

```java
Employee e;
if (e instanceof Executive exec && exec.getTitle().getLength() >= 20) . . .
```

> *"This works because the right-hand side of an && expression is only evaluated if the left-hand side is true. If the right-hand side is evaluated, exec must have been bound to an Executive instance."*

**Dịch:** Khi một `instanceof` pattern **giới thiệu một biến**, bạn **dùng nó được ngay trong cùng biểu thức**. Điều này chạy được vì **vế phải của `&&` chỉ được tính khi vế trái là `true`** — nếu vế phải được tính thì `exec` **chắc chắn đã được bind vào một instance `Executive`**.

> *"However, the following is a compile-time error:"*

```java
if (e instanceof Manager exec || exec.getTitle.getLength() >= 20) . . . // ERROR
```

> *"The right-hand side of || is executed when the left-hand side is false, and then nothing is bound to the variable exec."*

**Dịch:** Ngược lại, dạng trên là **lỗi compile-time**: vế phải của **`||` được thực thi khi vế trái là `false`**, và khi đó **không có gì được bind vào biến `exec`**.

> *"Here is another example with the conditional operator:"*

```java
String title = e instanceof Executive exec ? exec.getTitle() : "";
```

> *"The variable exec is defined in the subexpression after the ?, but not in the subexpression after the :."*

**Dịch:** Với [[04 - Operators|toán tử điều kiện]]: biến `exec` **được định nghĩa trong biểu thức con sau dấu `?`**, **nhưng không** trong biểu thức con sau dấu `:`.

> **Note (sách):** *"The variable-declaring instanceof forms are called "pattern-matching" because they are similar to type patterns in switch, which are covered in detail in Section 5.9."*
>
> **Dịch:** Các dạng `instanceof` **có khai báo biến** được gọi là **"pattern-matching"** vì chúng **giống type pattern trong `switch`** — chi tiết ở [[09 - Pattern Matching|Section 5.9]].

> **Caution (sách):** *"As any local variable, the local variable defined by a pattern can shadow a field. For example:"*
>
> ```java
> class Value
> {
>     private double v;
>
>     public boolean equals(Object other)
>     {
>         if (other instanceof LabeledValue v)
>             // v is the same as other
>         else
>             // v denotes the field
>     }
>     . . .
> }
> ```
>
> **Dịch:** Như mọi local variable, **local variable do pattern định nghĩa có thể [[03 - Defining Your Own Classes|shadow]] một field**.

### Record pattern

> *"The preceding example showed a type pattern. If the type matches, the object is bound to a variable of that type. When the type is a record, you can, as of Java 21, do better and declare variables that are bound to the components. This is called a record pattern:"*

```java
record Point(double x, double y) {}
Point p = . . .;
if (p instanceof Point(var a, var b)) distance = Math.hypot(a, b);
```

> *"Now a and b are bound to the x and y components of p. Of course, you could also invoke p.x() and p.y(), but a record pattern can be more concise."*

**Dịch:** Ví dụ trước là **type pattern**: nếu kiểu khớp thì object **được bind vào một biến của kiểu đó**. Khi kiểu là một **[[07 - Records|record]]**, **từ Java 21** bạn làm được tốt hơn: **khai báo các biến bind vào các component**. Đó gọi là **record pattern**. Giờ `a` và `b` **được bind vào component `x` và `y` của `p`**. Dĩ nhiên bạn cũng gọi được `p.x()` và `p.y()`, nhưng **record pattern gọn hơn**.

> *"For added clarity, you can also specify explicit types for the introduced variables:"*

```java
if (p instanceof Point(double a, double b)) . . .;
```

> *"Record patterns can be nested:"*

```java
record Circle(Point center, double radius) {}
Circle c = . . .;
if (c instanceof Circle(Point(var a, var b), var r)) . . .;
```

**Dịch:** Để **rõ ràng hơn**, bạn **ghi kiểu tường minh** cho các biến được giới thiệu. **Record pattern lồng nhau được.**

> **Preview Note (sách):** *"JEP 443 introduces unnamed variables as a preview feature. If you don't need one of the variables in a record pattern, you can denote it with an underscore:"*
>
> ```java
> if (p instanceof Point(var a, _)) distance = Math.abs(a);
> ```
>
> *"Until this feature becomes available, you can use var __ with two underscores, since a single underscore is a keyword since Java 9."*
>
> **Dịch:** **JEP 443** giới thiệu **unnamed variable** dưới dạng preview feature. Nếu bạn **không cần một trong các biến** của record pattern, bạn **ký hiệu nó bằng dấu gạch dưới**. Trước khi tính năng này có sẵn, bạn **dùng `var __` với hai dấu gạch dưới**, vì **một dấu gạch dưới đơn đã là keyword từ Java 9**.

---

## 5.1.10. Protected Access

> *"As you know, fields in a class are best tagged as private, and methods are usually tagged as public. Any features declared private won't be accessible in other classes. As explained at the beginning of this chapter, this is also true for subclasses: A subclass cannot access the private fields of its superclass."*

**Dịch:** Field trong class **tốt nhất để `private`**, method thường để `public`. Mọi thứ khai báo `private` **không truy cập được ở class khác** — và điều này **cũng đúng với subclass**: **subclass không truy cập được private field của superclass**.

> *"There are times, however, when you want to restrict a method to subclasses only or, less commonly, to allow subclass methods to access a superclass field. In that case, you declare a class feature as protected. For example, if the superclass Employee declares the hireDay field as protected instead of private, then the Manager methods can access it directly."*

**Dịch:** Nhưng có lúc bạn muốn **giới hạn một method chỉ cho subclass**, hoặc (ít gặp hơn) **cho method của subclass truy cập một field của superclass**. Khi đó khai báo thành phần đó là **`protected`**. Nếu `Employee` khai báo `hireDay` là `protected` thay vì `private` thì **method của `Manager` truy cập trực tiếp được**.

> *"In Java, a protected field is accessible by any class in the same package. Now consider an Administrator subclass in a different package. The methods of the Administrator class can peek inside the hireDay field of Administrator objects only, not of other Employee objects. This restriction is made so that you can't abuse the protected mechanism by forming subclasses just to gain access to the protected fields."*

**Dịch:** Trong Java, một `protected` field **truy cập được bởi bất kỳ class nào trong cùng [[08 - Packages|package]]**. Xét subclass `Administrator` ở **package khác**: method của `Administrator` **chỉ ngó được field `hireDay` của object `Administrator`**, **không phải của object `Employee` khác**. Hạn chế này để bạn **không lạm dụng cơ chế `protected` bằng cách tạo subclass chỉ nhằm chạm tới protected field**.

> *"In practice, use protected fields with caution. Suppose your class is used by other programmers and you designed it with protected fields. Unknown to you, other programmers may inherit classes from your class and start accessing your protected fields. In this case, you can no longer change the implementation of your class without upsetting those programmers. That is against the spirit of OOP, which encourages data encapsulation."*

**Dịch:** Thực tế, **hãy dùng protected field một cách thận trọng**. Người khác có thể **kế thừa class của bạn và bắt đầu truy cập các protected field** mà bạn không hay biết. Khi đó bạn **không còn đổi được implementation của class mà không làm phiền họ**. Điều đó **đi ngược tinh thần OOP**, vốn khuyến khích **[[01 - Introduction to Object-Oriented Programming|data encapsulation]]**.

> *"Protected methods make more sense. A class may declare a method as protected if it is tricky to use. This indicates that the subclasses (which, presumably, know their ancestor well) can be trusted to use the method correctly, but other classes cannot."*

**Dịch:** **Protected method thì hợp lý hơn.** Một class có thể khai báo method là `protected` nếu **method đó khó dùng**. Điều này báo rằng **subclass** (được cho là **hiểu rõ tổ tiên của mình**) **đáng tin để dùng method đúng cách**, còn **class khác thì không**.

> *"A good example of this kind of method is the clone method of the Object class—see Chapter 6 for more details."*

**Dịch:** Ví dụ tốt cho loại method này là **`clone` của class `Object`** — chi tiết ở chương 6.

> **C++ Note (sách):** *"As already mentioned, protected features in Java are accessible to all subclasses as well as to all other classes in the same package. This is slightly different from the C++ meaning of protected, and it makes the notion of protected in Java even less safe than in C++."*
>
> **Dịch:** Thành phần `protected` trong Java truy cập được bởi **mọi subclass** lẫn **mọi class khác trong cùng package**. Điều này **hơi khác nghĩa `protected` của C++**, và làm cho **khái niệm `protected` trong Java còn kém an toàn hơn ở C++**.

### Tóm tắt bốn access control modifier

> *"Here is a summary of the four access control modifiers in Java:"*
>
> *"1. Accessible in the class only (private)."*
> *"2. Accessible by the world (public)."*
> *"3. Accessible in the package and all subclasses (protected)."*
> *"4. Accessible in the package—the (unfortunate) default. No modifiers are needed."*

**Dịch:**

| # | Modifier | Phạm vi truy cập |
|---|---|---|
| 1 | `private` | **Chỉ trong class đó** |
| 2 | `public` | **Cả thế giới** |
| 3 | `protected` | **Trong package và mọi subclass** |
| 4 | *(không ghi gì)* | **Trong package** — mặc định (**đáng tiếc**). Không cần modifier nào. |

---

## Bài kế tiếp

→ [[02 - Object The Cosmic Superclass]] — class `Object` là tổ tiên tối thượng của mọi class Java, cùng ba method `equals`, `hashCode`, `toString`.
