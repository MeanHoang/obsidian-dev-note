# 05 — Methods with a Variable Number of Arguments

> Chapter 5, Section 5.5 — Core Java Volume I, 13th Edition (Horstmann).
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 5.5. Methods with a Variable Number of Arguments

> *"It is possible to provide methods that can be called with a variable number of arguments. These are sometimes called "varargs" methods."*

**Dịch:** Có thể **cung cấp method gọi được với số lượng argument thay đổi**. Chúng đôi khi được gọi là **method "varargs"**.

> *"You have already seen such a method: printf. For example, the calls"*

```java
System.out.printf("%d", n);
```

> *"and"*

```java
System.out.printf("%d %s", n, "widgets");
```

> *"both call the same method, even though one call has two arguments and the other has three."*

**Dịch:** Bạn **đã gặp một method như vậy: `printf`**. Cả hai lời gọi trên **đều gọi cùng một method**, dù **một bên có hai argument, bên kia ba argument**.

> *"The printf method is defined like this:"*

```java
public class PrintStream
{
    public PrintStream printf(String fmt, Object... args)
    {
        return format(fmt, args);
    }
}
```

> *"Here, the ellipsis ... is part of the Java code. It denotes that the method can receive an arbitrary number of objects (in addition to the fmt parameter)."*

**Dịch:** Ở đây **dấu ba chấm `...` là một phần của code Java**. Nó biểu thị rằng method **nhận được số lượng object tuỳ ý** (bên cạnh parameter `fmt`).

> *"The printf method actually receives two parameters: the format string and an Object[] array that holds all other arguments. (If the caller supplies integers or other primitive type values, autoboxing turns them into objects.) It now faces the unenviable task of scanning the fmt string and matching up the ith format specifier with the value args[i]."*

**Dịch:** Thực ra `printf` **nhận hai parameter**: **format string** và **một mảng `Object[]` chứa mọi argument còn lại**. (Nếu người gọi truyền số nguyên hay giá trị primitive khác thì [[04 - Object Wrappers and Autoboxing|autoboxing]] **biến chúng thành object**.) Sau đó nó đối mặt với **nhiệm vụ chẳng ai thèm ganh tị**: **quét chuỗi `fmt`** và **khớp format specifier thứ `i` với giá trị `args[i]`**.

> *"In other words, for the implementor of printf, the Object... parameter type is exactly the same as Object[]."*

**Dịch:** Nói cách khác, với **người cài đặt `printf`**, kiểu parameter **`Object...` hoàn toàn giống `Object[]`**.

> *"The compiler needs to transform each call to printf, bundling the arguments into an array and autoboxing as necessary:"*

```java
System.out.printf("%d %s", new Object[] { Integer.valueOf(n), "widgets" } );
```

**Dịch:** Compiler phải **biến đổi mỗi lời gọi `printf`**, **gói các argument thành một [[09 - Arrays|mảng]]** và **autoboxing khi cần**.

> *"You can define your own methods with variable arguments, and you can specify any type for the arguments, even a primitive type. Here is a simple example: a function that computes the maximum of a variable number of values."*

```java
public static double max(double... values)
{
    double largest = Double.NEGATIVE_INFINITY;
    for (double v : values) if (v > largest) largest = v;
    return largest;
}
```

> *"Simply call the function like this:"*

```java
double m = max(3.1, 40.4, -5);
```

> *"The compiler passes a new double[] { 3.1, 40.4, -5 } to the max function."*

**Dịch:** Bạn **tự định nghĩa được method có argument thay đổi**, và **chỉ định được kiểu bất kỳ cho argument, kể cả primitive type**. Ví dụ đơn giản: một hàm **tính giá trị lớn nhất của một số lượng giá trị thay đổi**. Compiler **truyền `new double[] { 3.1, 40.4, -5 }` vào hàm `max`**.

> **Note (sách):** *"It is legal to pass an array of the variable argument type instead of the variable arguments. For example:"*
>
> ```java
> System.out.printf("%d %s", new Object[] { Integer.valueOf(1), "widgets" } );
> ```
>
> *"Therefore, you can redefine an existing function whose last argument is an array to a method with variable arguments, without breaking any existing code. For example, MessageFormat.format was enhanced in this way in Java 5. If you like, you can even declare the main method as"*
>
> ```java
> public static void main(String... args)
> ```
>
> **Dịch:** **Hợp lệ** khi truyền **một mảng của kiểu variable argument thay cho các variable argument**. Do đó bạn **định nghĩa lại được một hàm có sẵn mà argument cuối là mảng thành method có variable argument, mà không phá vỡ code hiện có**. Ví dụ `MessageFormat.format` **đã được nâng cấp theo cách này ở Java 5**. Nếu thích, bạn **khai báo được cả method `main`** theo dạng `public static void main(String... args)`.

---

## Bài kế tiếp

→ [[06 - Abstract Classes]] — class abstract, method abstract và vai trò của chúng ở đỉnh inheritance hierarchy.
