# 05 — Method Parameters

> Chapter 4, Section 4.5 — Core Java Volume I, 13th Edition (Horstmann).
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 4.5. Method Parameters

### Thuật ngữ

> *"Let us review the computer science terms that describe how parameters can be passed to a method (or a function) in a programming language. The term call by value means that the method gets just the value that the caller provides. In contrast, call by reference means that the method gets the location of the variable that the caller provides. Thus, a method can modify the value stored in a variable passed by reference but not in one passed by value. These "call by . . ." terms are standard computer science terminology describing the behavior of method parameters in various programming languages, not just Java. (There is also a call by name that is mainly of historical interest, being employed in the Algol programming language, one of the oldest high-level languages.)"*

**Dịch:**

| Thuật ngữ | Method nhận được gì | Sửa được biến của caller không |
|---|---|---|
| **call by value** | chỉ nhận **giá trị** mà caller đưa vào | ❌ |
| **call by reference** | nhận **vị trí (location) của biến** mà caller đưa vào | ✅ |

Các thuật ngữ "call by ..." là **thuật ngữ chuẩn của khoa học máy tính**, mô tả hành vi của method parameter ở nhiều ngôn ngữ chứ không riêng Java. Còn có **call by name**, chủ yếu mang giá trị lịch sử, dùng trong Algol — một trong những ngôn ngữ bậc cao lâu đời nhất.

### Java LUÔN dùng call by value

> *"The Java programming language always uses call by value. That means that the method gets a copy of all arguments. In particular, the method cannot modify the contents of any variables in the method call. For example, consider the following call:"*

```java
double percent = 10;
harry.raiseSalary(percent);
```

> *"No matter how the method is implemented, we know that after the method call, the value of percent is still 10."*

**Dịch:** Java **luôn luôn dùng call by value**. Nghĩa là method nhận **bản copy của mọi argument**. Cụ thể, method **không sửa được nội dung của bất kỳ biến nào trong lời gọi method**. Dù `raiseSalary` được implement thế nào đi nữa, sau lời gọi thì `percent` **vẫn là 10**.

---

## Trường hợp 1: parameter kiểu primitive — không sửa được

> *"Let us look a little more closely at this situation. Suppose a method tried to triple the value of a method parameter:"*

```java
public static void tripleValue(double x) // doesn't work
{
    x = 3 * x;
}
```

> *"Let's call this method:"*

```java
double percent = 10;
tripleValue(percent);
```

> *"However, this does not work. After the method call, the value of percent is still 10. Here is what happens:*
> 1. *x is initialized with a copy of the value of percent (that is, 10).*
> 2. *x is tripled—it is now 30. But percent is still 10 (see Figure 4.6).*
> 3. *The method ends, and the parameter variable x is no longer in use."*

**Dịch — ba bước xảy ra:**

1. `x` được khởi tạo bằng **bản copy giá trị** của `percent` (tức là 10).
2. `x` được nhân ba, giờ là 30. Nhưng `percent` **vẫn là 10**.
3. Method kết thúc, biến parameter `x` **không còn được dùng nữa**.

**Figure 4.6: Modifying a parameter variable has no lasting effect.**

```
   TRƯỚC gọi              TRONG method             SAU khi method kết thúc
  ┌───────────┐          ┌───────────┐            ┌───────────┐
  │percent=10 │          │percent=10 │            │percent=10 │  ← không đổi
  └───────────┘          ├───────────┤            └───────────┘
                         │ x = 30    │  ← copy         x biến mất
                         └───────────┘
```

---

## Trường hợp 2: parameter là object reference — sửa STATE được

> *"There are, however, two kinds of method parameters:*
> - *Primitive types (number types, char, boolean)*
> - *Object references"*

**Dịch:** Có **hai loại method parameter**: kiểu **primitive** (kiểu số, `char`, `boolean`), và **object reference**.

> *"You have seen that it is impossible for a method to change a primitive type parameter. The situation is different for object parameters. You can easily implement a method that triples the salary of an employee:"*

```java
public static void tripleSalary(Employee x) // works
{
    x.raiseSalary(200);
}
```

> *"When you call"*

```java
harry = new Employee(. . .);
tripleSalary(harry);
```

> *"then the following happens:*
> 1. *x is initialized with a copy of the value of harry—that is, an object reference.*
> 2. *The raiseSalary method is applied to that object reference. The Employee object to which both x and harry refer gets its salary raised by 200 percent.*
> 3. *The method ends, and the parameter variable x is no longer in use. Of course, the object variable harry continues to refer to the object whose salary was tripled (see Figure 4.7)."*

**Dịch — ba bước:**

1. `x` được khởi tạo bằng **bản copy giá trị của `harry`**, tức **một object reference**.
2. Method `raiseSalary` được gọi lên object reference đó. Object `Employee` mà **cả `x` lẫn `harry` cùng trỏ tới** được tăng lương 200%.
3. Method kết thúc, biến parameter `x` không còn dùng nữa. Còn object variable `harry` **vẫn tiếp tục trỏ tới object đã bị tăng lương gấp ba**.

**Figure 4.7: Modifying an object referenced by a parameter has a lasting effect.**

```
  ┌───────────┐                    heap
  │ harry  ───┼──────────┐   ┌──────────────────┐
  └───────────┘          ├──►│  Employee object │
  ┌───────────┐          │   │  salary: 150000  │  ← state ĐÃ đổi thật
  │ x (copy) ─┼──────────┘   └──────────────────┘
  └───────────┘
   hai biến, MỘT object → sửa state qua x là sửa luôn object của harry
```

> *"As you have seen, it is easily possible—and in fact very common—to implement methods that change the state of an object parameter. The reason is simple. The method gets a copy of the object reference, and both the original and the copy refer to the same object."*

**Dịch:** Viết method làm **đổi state của object parameter** là chuyện dễ, và thực tế **rất phổ biến**. Lý do đơn giản: method nhận **bản copy của object reference**, và **bản gốc lẫn bản copy đều trỏ tới cùng một object**.

---

## Hiểu lầm phổ biến: "Java dùng call by reference cho object"

> *"Many programming languages (in particular, C++ and Pascal) have two mechanisms for parameter passing: call by value and call by reference. Some programmers (and unfortunately even some book authors) claim that Java uses call by reference for objects. That is false. As this is such a common misunderstanding, it is worth examining a counterexample in detail."*

**Dịch:** Nhiều ngôn ngữ (đặc biệt C++ và Pascal) có **hai cơ chế truyền parameter**. Một số lập trình viên — và đáng tiếc là cả **một số tác giả sách** — khẳng định Java dùng call by reference cho object. **Điều đó sai**. Vì đây là hiểu lầm rất phổ biến nên đáng xem kỹ một **phản ví dụ**.

### Phản ví dụ: method `swap`

> *"Let's try to write a method that swaps two Employee objects:"*

```java
public static void swap(Employee x, Employee y) // doesn't work
{
    Employee temp = x;
    x = y;
    y = temp;
}
```

> *"If Java used call by reference for objects, this method would work:"*

```java
var a = new Employee("Alice", . . .);
var b = new Employee("Bob", . . .);
swap(a, b);
// does a now refer to Bob, b to Alice?
```

> *"However, the method does not actually change the object references that are stored in the variables a and b. The x and y parameters of the swap method are initialized with copies of these references. The method then proceeds to swap these copies."*

```java
// x refers to Alice, y to Bob
Employee temp = x;
x = y;
y = temp;
// now x refers to Bob, y to Alice
```

> *"But ultimately, this is a wasted effort. When the method ends, the parameter variables x and y are abandoned. The original variables a and b still refer to the same objects as they did before the method call (see Figure 4.8)."*

**Dịch:** Nếu Java dùng call by reference cho object thì method này sẽ chạy được. Nhưng thực tế method **không hề đổi object reference đang lưu trong biến `a` và `b`**. Parameter `x` và `y` được khởi tạo bằng **bản copy của các reference đó**, rồi method đi hoán đổi **các bản copy**.

Rốt cuộc đó là **công cốc**. Method kết thúc thì biến parameter `x` và `y` **bị bỏ đi**. Biến gốc `a` và `b` **vẫn trỏ tới đúng object như trước khi gọi method**.

**Figure 4.8: Swapping parameter variables has no lasting effect.**

```
  TRƯỚC                          TRONG method                 SAU
  a ──► Alice                    x ──► Bob   (copy đã swap)   a ──► Alice
  b ──► Bob                      y ──► Alice                  b ──► Bob
                                 a ──► Alice  (không đổi)     x, y biến mất
                                 b ──► Bob
```

> *"This demonstrates that the Java programming language does not use call by reference for objects. Instead, object references are passed by value."*

**Dịch:** Điều này chứng minh Java **không dùng call by reference cho object**. Thay vào đó, **object reference được truyền theo giá trị (passed by value)**.

---

## Tổng kết — làm được gì và không làm được gì

> *"Here is a summary of what you can and cannot do with method parameters in Java:*
> - *A method cannot modify a parameter of a primitive type (that is, number types, char, or boolean).*
> - *A method can change the state of an object parameter.*
> - *A method cannot make an object parameter refer to a new object."*

**Dịch:**

| # | Điều luật |
|---|---|
| 1 | Method **KHÔNG sửa được** parameter kiểu primitive (kiểu số, `char`, `boolean`) |
| 2 | Method **CÓ THỂ đổi state** của object parameter |
| 3 | Method **KHÔNG làm được** object parameter trỏ sang một object mới |

---

## Output của chương trình demo

> *"The program in Listing 4.4 demonstrates these facts. The program first tries to triple the value of a number parameter and does not succeed:"*

```
Testing tripleValue:
Before: percent=10.0
End of method: x=30.0
After: percent=10.0
```

> *"It then successfully triples the salary of an employee:"*

```
Testing tripleSalary:
Before: salary=50000.0
End of method: salary=150000.0
After: salary=150000.0
```

> *"After the method, the state of the object to which harry refers has changed. This is possible because the method modified the state through a copy of the object reference."*

**Dịch:** Sau khi gọi method, **state của object mà `harry` trỏ tới đã thay đổi**. Làm được vì method sửa state **thông qua một bản copy của object reference**.

> *"Finally, the program demonstrates the failure of the swap method:"*

```
Testing swap:
Before: a=Alice
Before: b=Bob
End of method: x=Bob
End of method: y=Alice
After: a=Alice
After: b=Bob
```

> *"As you can see, the parameter variables x and y are swapped, but the variables a and b are not affected."*

**Dịch:** Biến parameter `x` và `y` **đã bị hoán đổi**, nhưng biến `a` và `b` **không hề bị ảnh hưởng**.

> **C++ Note (sách):** *"C++ has both call by value and call by reference. You tag reference parameters with &. For example, you can easily implement methods void tripleValue(double& x) or void swap(Employee& x, Employee& y) that modify their reference parameters."*
>
> **Dịch:** C++ có **cả hai**: call by value và call by reference. Reference parameter được đánh dấu bằng `&`. Nhờ vậy C++ viết được `void tripleValue(double& x)` hay `void swap(Employee& x, Employee& y)` **sửa được reference parameter của chúng**.

---

## Listing 4.4 — `ParamTest/ParamTest.java`

```java
/**
 * This program demonstrates parameter passing in Java.
 * @version 1.01 2018-04-10
 * @author Cay Horstmann
 */
public class ParamTest
{
    public static void main(String[] args)
    {
        /*
         * Test 1: Methods can't modify numeric parameters
         */
        System.out.println("Testing tripleValue:");
        double percent = 10;
        System.out.println("Before: percent=" + percent);
        tripleValue(percent);
        System.out.println("After: percent=" + percent);

        /*
         * Test 2: Methods can change the state of object parameters
         */
        System.out.println("\nTesting tripleSalary:");
        var harry = new Employee("Harry", 50000);
        System.out.println("Before: salary=" + harry.getSalary());
        tripleSalary(harry);
        System.out.println("After: salary=" + harry.getSalary());

        /*
         * Test 3: Methods can't attach new objects to object parameters
         */
        System.out.println("\nTesting swap:");
        var a = new Employee("Alice", 70000);
        var b = new Employee("Bob", 60000);
        System.out.println("Before: a=" + a.getName());
        System.out.println("Before: b=" + b.getName());
        swap(a, b);
        System.out.println("After: a=" + a.getName());
        System.out.println("After: b=" + b.getName());
    }

    public static void tripleValue(double x) // doesn't work
    {
        x = 3 * x;
        System.out.println("End of method: x=" + x);
    }

    public static void tripleSalary(Employee x) // works
    {
        x.raiseSalary(200);
        System.out.println("End of method: salary=" + x.getSalary());
    }

    public static void swap(Employee x, Employee y)
    {
        Employee temp = x;
        x = y;
        y = temp;
        System.out.println("End of method: x=" + x.getName());
        System.out.println("End of method: y=" + y.getName());
    }
}

class Employee // simplified Employee class
{
    private String name;
    private double salary;

    public Employee(String n, double s)
    {
        name = n;
        salary = s;
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
}
```

---

## Bài kế tiếp

→ [[06 - Object Construction]] — overloading, khởi tạo field mặc định, constructor không tham số, `this(...)`, initialization block.
