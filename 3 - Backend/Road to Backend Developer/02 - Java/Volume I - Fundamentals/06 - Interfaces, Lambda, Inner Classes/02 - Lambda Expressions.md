# 02 — Lambda Expressions

> Chapter 6, Section 6.2 — Core Java Volume I, 13th Edition (Horstmann).
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 6.2. Lambda Expressions

> *"In the following sections, you will learn how to use lambda expressions for defining blocks of code with a concise syntax, and how to write code that consumes lambda expressions."*

**Dịch:** Các phần sau sẽ chỉ cách dùng lambda expression để **định nghĩa khối code bằng cú pháp ngắn gọn**, và cách **viết code tiêu thụ lambda expression**.

---

## 6.2.1. Why Lambdas?

> *"A lambda expression is a block of code that you can pass around so it can be executed later, once or multiple times. Before getting into the syntax (or even the curious name), let’s step back and observe where we have used such code blocks in Java."*

**Dịch:** Lambda expression là **một khối code bạn truyền đi được** để nó **chạy sau này**, **một lần hoặc nhiều lần**.

> *"In Section 6.1.7, you saw how to do work in timed intervals. Put the work into the actionPerformed method of an ActionListener:"*

```java
class Worker implements ActionListener
{
    public void actionPerformed(ActionEvent event)
    {
        // do some work
    }
}
```

> *"Then, when you want to repeatedly execute this code, you construct an instance of the Worker class. You then submit the instance to a Timer object."*

> *"The key point is that the actionPerformed method contains code that you want to execute later."*

**Dịch:** Ở [[01 - Interfaces#6.1.7. Interfaces and Callbacks|mục 6.1.7]] bạn đã thấy cách làm việc theo khoảng thời gian: đặt công việc vào method `actionPerformed` của một `ActionListener`. Muốn chạy code này lặp đi lặp lại thì dựng một instance của class `Worker` rồi **đưa instance đó cho object `Timer`**. **Điểm mấu chốt: `actionPerformed` chứa code mà bạn muốn chạy sau này.**

> *"Or consider sorting with a custom comparator. If you want to sort strings by length instead of the default dictionary order, you can pass a Comparator object to the sort method:"*

```java
class LengthComparator implements Comparator<String>
{
    public int compare(String first, String second)
    {
        return first.length() - second.length();
    }
}
. . .
Arrays.sort(strings, new LengthComparator());
```

> *"The compare method isn't called right away. Instead, the sort method keeps calling the compare method, rearranging the elements if they are out of order, until the array is sorted. You give the sort method a snippet of code needed to compare elements, and that code is integrated into the rest of the sorting logic, which you’d probably not care to reimplement."*

**Dịch:** Hoặc xét việc sắp xếp bằng comparator tuỳ biến. Muốn sắp [[05 - Strings|string]] theo **độ dài** thay vì thứ tự từ điển mặc định, bạn truyền một object `Comparator` cho method `sort`. Method `compare` **không được gọi ngay**. Thay vào đó `sort` **liên tục gọi `compare`**, đảo chỗ các phần tử sai thứ tự cho tới khi array được sắp xong. Bạn đưa cho `sort` **một mẩu code cần thiết để so sánh phần tử**, và mẩu code đó **được tích hợp vào phần còn lại của logic sắp xếp** — thứ mà chắc bạn chẳng muốn tự viết lại.

> *"Both examples have something in common. A block of code was passed to someone—a timer, or a sort method. That code block was called at some later time."*

> *"In early versions of Java, giving someone a block of code was not easy. You couldn’t just pass code blocks around. Java is an object-oriented language, so you had to construct an object belonging to a class that has a method with the desired code."*

**Dịch:** Hai ví dụ có điểm chung: **một khối code được truyền cho ai đó** — timer, hoặc method sort — và khối code đó **được gọi vào lúc nào đó sau này**. Ở các phiên bản Java đầu, **đưa cho ai đó một khối code không hề dễ**: bạn **không truyền thẳng khối code đi được**. Java là ngôn ngữ object-oriented, nên bạn phải **dựng một object thuộc class có method chứa code mong muốn**.

> *"In other languages, it is possible to work with blocks of code directly. The Java designers have resisted adding this feature for a long time. After all, a great strength of Java is its simplicity and consistency. A language can become an unmaintainable mess if it includes every feature that yields marginally more concise code. However, in those other languages it isn’t just easier to spawn a thread or to register a button click handler; large swaths of their APIs are simpler, more consistent, and more powerful. In Java, one could have written similar APIs taking objects of classes that implement a particular interface, but such APIs would be unpleasant to use."*

> *"For some time, the question was not whether to augment Java for functional programming, but how to do it. It took several years of experimentation before a design emerged that is a good fit for Java."*

**Dịch:** Ở ngôn ngữ khác, **làm việc trực tiếp với khối code là chuyện được phép**. Nhà thiết kế Java **chống lại tính năng này rất lâu** — sức mạnh lớn của Java là **sự đơn giản và nhất quán**, và ngôn ngữ **có thể thành mớ hỗn độn không bảo trì nổi** nếu nhét vào mọi tính năng chỉ đổi lấy chút code ngắn hơn. Tuy vậy, ở các ngôn ngữ kia **không chỉ dễ tạo thread hay đăng ký handler cho nút bấm** — mà **cả mảng lớn API của chúng đơn giản hơn, nhất quán hơn, mạnh hơn**. Java cũng viết được API tương tự nhận object của class implement một interface nhất định, nhưng **API kiểu đó dùng rất khó chịu**.

Suốt một thời gian, câu hỏi **không phải có nên** bổ sung functional programming cho Java, mà là **làm thế nào**. Phải **mất vài năm thử nghiệm** mới ra được thiết kế hợp với Java.

---

## 6.2.2. The Syntax of Lambda Expressions

> *"Consider again the sorting example from the preceding section. We pass code that checks whether one string is shorter than another. We compute"*

```java
first.length() - second.length()
```

> *"What are first and second? They are both strings. Java is a strongly typed language, and we must specify that as well:"*

```java
(String first, String second) ->
    first.length() - second.length()
```

> *"You have just seen your first lambda expression. Such an expression is simply a block of code, together with the specification of any variables that must be passed to the code."*

**Dịch:** `first` và `second` là gì? Cả hai đều là string. Java là ngôn ngữ **strongly typed** nên **phải khai cả điều đó**. Bạn vừa thấy lambda expression đầu tiên: nó đơn giản là **một khối code, kèm khai báo những biến phải được truyền vào khối code đó**.

> *"Why the name? Many years ago, before there were any computers, the logician Alonzo Church wanted to formalize what it means for a mathematical function to be effectively computable. (Curiously, there are functions that are known to exist, but nobody knows how to compute their values.) He used the Greek letter lambda (λ) to mark parameters. Had he known about the Java API, he would have written"*

```
λfirst.λsecond.first.length() - second.length()
```

**Dịch:** **Sao lại tên đó?** Nhiều năm trước, khi chưa có máy tính, nhà logic học **Alonzo Church** muốn hình thức hoá **thế nào là một hàm toán học tính được một cách hiệu quả**. (Lạ thay, có những hàm **biết là tồn tại** nhưng **không ai biết tính giá trị của chúng ra sao**.) Ông dùng chữ Hy Lạp **lambda (λ)** để đánh dấu parameter.

> **Note (sách):** *"Why the letter λ? Did Church run out of other letters of the alphabet? Actually, the venerable Principia Mathematica used the ^ accent to denote free variables, which inspired Church to use an uppercase lambda Λ for parameters. But in the end, he switched to the lowercase version. Ever since, an expression with parameter variables has been called a lambda expression."*
>
> **Dịch:** Sao lại là chữ **λ**? Church hết chữ cái rồi à? Thực ra bộ **Principia Mathematica** đáng kính dùng **dấu `^`** để ký hiệu **free variable**, điều đó gợi cho Church dùng **lambda hoa `Λ`** cho parameter. Nhưng cuối cùng ông **chuyển sang bản chữ thường**. Từ đó tới nay, biểu thức có biến parameter được gọi là **lambda expression**.

> *"What you have just seen is a simple form of lambda expressions in Java: parameters, the -> arrow, and an expression. If the code carries out a computation that doesn’t fit in a single expression, write it exactly like you would have written a method: enclosed in {} and with explicit return statements. For example,"*

```java
(String first, String second) ->
{
    if (first.length() < second.length()) return -1;
    else if (first.length() > second.length()) return 1;
    else return 0;
}
```

**Dịch:** Dạng đơn giản của lambda expression trong Java gồm: **parameter**, **mũi tên `->`**, và **một biểu thức**. Nếu phép tính **không gói gọn được trong một biểu thức**, hãy viết y như viết một method: **bọc trong `{}`** và có **câu lệnh `return` tường minh**.

> *"If a lambda expression has no parameters, you still supply empty parentheses, just as with a parameterless method:"*

```java
() -> { return 1 + (int)(Math.random() * 6); }
```

**Dịch:** Nếu lambda expression **không có parameter**, bạn **vẫn phải ghi cặp ngoặc rỗng**, giống như một method không parameter.

> *"If the parameter types of a lambda expression can be inferred, you can omit them. For example,"*

```java
Comparator<String> comp =
    (first, second) // same as (String first, String second)
        -> first.length() - second.length();
```

> *"Here, the compiler can deduce that first and second must be strings because the lambda expression is assigned to a string comparator."*

**Dịch:** Nếu **kiểu parameter suy ra được**, bạn **bỏ chúng đi được**. Ở đây compiler **suy ra** `first` và `second` phải là string vì lambda expression được **gán cho một comparator của string**.

> *"If a method has a single parameter with inferred type, you can even omit the parentheses:"*

```java
ActionListener listener = event ->
    System.out.println("The time is "
        + Instant.ofEpochMilli(event.getWhen()));
// instead of (event) -> . . . or (ActionEvent event) -> . . .
```

**Dịch:** Nếu chỉ có **một parameter với kiểu được suy ra**, bạn **bỏ luôn cặp ngoặc được**.

> *"You never specify the result type of a lambda expression. It is always inferred from context. For example, the expression"*

```java
(String first, String second) -> first.length() - second.length()
```

> *"can be used in a context where a result of type int is expected."*

**Dịch:** Bạn **không bao giờ khai kiểu kết quả** của lambda expression — nó **luôn được suy ra từ ngữ cảnh**. Biểu thức trên dùng được ở nơi **mong đợi kết quả kiểu `int`**.

> *"Finally, you can use var to denote an inferred type. This isn't common. The syntax was invented for attaching annotations (see Chapter 11):"*

```java
(@NonNull var first, @NonNull var second) -> first.length() - second.length()
```

**Dịch:** Cuối cùng, dùng được [[03 - Defining Your Own Classes#4.3.5. Declaring Local Variables with var|`var`]] để chỉ kiểu được suy ra. Chuyện này **không phổ biến** — cú pháp này được nghĩ ra để **gắn annotation** (xem Chapter 11).

> **Note (sách):** *"It is illegal for a lambda expression to return a value in some branches but not in others. For example, (int x) -> { if (x >= 0) return 1; } is invalid."*
>
> **Dịch:** Lambda expression **trả về giá trị ở nhánh này mà không trả về ở nhánh kia là bất hợp lệ**. Ví dụ `(int x) -> { if (x >= 0) return 1; }` là **không hợp lệ**.

> **Preview Note (sách):** *"If a parameter of a lambda expression is never used, you can denote it with an underscore:"*
>
> ```java
> ActionListener listener = _ ->
>     System.out.println("The action occurred at " + Instant.now());
> Comparator<String> comp = (_, _) -> 0;
> ```
>
> *"This is a preview feature in Java 21."*
>
> **Dịch:** Nếu một parameter của lambda expression **không bao giờ được dùng**, bạn ký hiệu nó bằng **dấu gạch dưới `_`**. Đây là **preview feature ở Java 21**.

> *"The program in Listing 6.6 shows how to use lambda expressions for a comparator and an action listener."*

**Dịch:** Chương trình ở Listing 6.6 minh hoạ dùng lambda expression cho **một comparator** và **một action listener**.

### Listing 6.6 — `lambda/LambdaTest.java`

```java
package lambda;

import java.util.*;
import javax.swing.*;
import javax.swing.Timer;

/**
 * This program demonstrates the use of lambda expressions.
 * @version 1.0 2015-05-12
 * @author Cay Horstmann
 */
public class LambdaTest
{
    public static void main(String[] args)
    {
        var planets = new String[] { "Mercury", "Venus", "Earth", "Mars",
            "Jupiter", "Saturn", "Uranus", "Neptune" };
        System.out.println(Arrays.toString(planets));
        System.out.println("Sorted in dictionary order:");
        Arrays.sort(planets);
        System.out.println(Arrays.toString(planets));
        System.out.println("Sorted by length:");
        Arrays.sort(planets, (first, second) -> first.length() - second.length());
        System.out.println(Arrays.toString(planets));

        var timer = new Timer(1000, event ->
            System.out.println("The time is " + new Date()));
        timer.start();

        // keep program running until user selects "OK"
        JOptionPane.showMessageDialog(null, "Quit program?");
        System.exit(0);
    }
}
```

---

## 6.2.3. Functional Interfaces

> *"As we discussed, there are many existing interfaces in Java that encapsulate blocks of code, such as ActionListener or Comparator. Lambdas are compatible with these interfaces."*

> *"You can supply a lambda expression whenever an object of an interface with a single abstract method is expected. Such an interface is called a functional interface."*

**Dịch:** Java có **sẵn nhiều interface đóng gói khối code**, như `ActionListener` hay `Comparator`. **Lambda tương thích với các interface đó.** Bạn **cung cấp được lambda expression ở bất cứ đâu mong đợi object của một interface chỉ có DUY NHẤT một abstract method**. Interface như vậy gọi là **functional interface**.

> **Note (sách):** *"You may wonder why a functional interface must have a single abstract method. Aren’t all methods in an interface abstract? Actually, it has always been possible for an interface to redeclare methods from the Object class such as toString or clone, and these declarations do not make the methods abstract. (Some interfaces in the Java API redeclare Object methods in order to attach javadoc comments. Check out the Comparator API for an example.) More importantly, as you saw in Section 6.1.5, interfaces can declare nonabstract methods."*
>
> **Dịch:** Bạn có thể thắc mắc **tại sao lại nhấn mạnh "một abstract method"** — chẳng phải **mọi method trong interface đều abstract** sao? Thực ra interface **xưa nay vẫn khai báo lại được method của class `Object`** như `toString` hay `clone`, và **những khai báo đó không làm method trở thành abstract**. (Vài interface trong Java API khai báo lại method của `Object` để **gắn comment javadoc** — xem API của `Comparator`.) Quan trọng hơn, như đã thấy ở [[01 - Interfaces#6.1.5. Default Methods|mục 6.1.5]], interface **khai báo được method không abstract**.

> *"To demonstrate the conversion to a functional interface, consider the Arrays.sort method. Its second parameter requires an instance of Comparator, an interface with a single method. Simply supply a lambda:"*

```java
Arrays.sort(words,
    (first, second) -> first.length() - second.length());
```

> *"Behind the scenes, the Arrays.sort method receives an object of some class that implements Comparator<String>. Invoking the compare method on that object executes the body of the lambda expression. The management of these objects and classes is completely implementation-dependent, and it can be much more efficient than using traditional inner classes. It is best to think of a lambda expression as a function, not an object, and to accept that it can be passed to a functional interface."*

**Dịch:** Đằng sau hậu trường, `Arrays.sort` **nhận về object của một class nào đó implement `Comparator<String>`**. Gọi method `compare` lên object đó thì **thân của lambda expression được chạy**. Việc quản lý các object và class này **hoàn toàn phụ thuộc implementation**, và **có thể hiệu quả hơn nhiều so với dùng inner class truyền thống**. Tốt nhất hãy **nghĩ về lambda expression như một hàm, không phải một object**, và chấp nhận rằng **nó truyền được vào một functional interface**.

> *"This conversion to interfaces is what makes lambda expressions so compelling. The syntax is short and simple. Here is another example:"*

```java
var timer = new Timer(1000, event ->
{
    System.out.println("At the tone, the time is "
        + Instant.ofEpochMilli(event.getWhen()));
    Toolkit.getDefaultToolkit().beep();
});
```

> *"That’s a lot easier to read than the alternative with a class that implements the ActionListener interface."*

**Dịch:** Chính **việc chuyển đổi sang interface** làm lambda expression hấp dẫn đến vậy: cú pháp **ngắn và đơn giản**, **dễ đọc hơn hẳn** so với phương án viết hẳn một class implement `ActionListener`.

> *"In fact, conversion to a functional interface is the only thing that you can do with a lambda expression in Java. In other programming languages that support function literals, you can declare function types such as (String, String) -> int, declare variables of those types, and use the variables to save function expressions. However, the Java designers decided to stick with the familiar concept of interfaces instead of adding function types to the language."*

**Dịch:** Thực tế, **chuyển đổi sang functional interface là việc DUY NHẤT bạn làm được với lambda expression trong Java**. Ở các ngôn ngữ hỗ trợ **function literal**, bạn khai báo được **kiểu hàm** như `(String, String) -> int`, khai báo biến kiểu đó, và dùng biến để lưu function expression. Nhưng nhà thiết kế Java **quyết định bám vào khái niệm interface quen thuộc** thay vì **thêm kiểu hàm vào ngôn ngữ**.

> **Note (sách):** *"You can’t even assign a lambda expression to a variable of type Object—Object is not a functional interface."*
>
> **Dịch:** Bạn **thậm chí không gán được lambda expression cho biến kiểu `Object`** — vì **`Object` không phải functional interface**.

---

## 6.2.4. Function Types

> *"The Java API defines a number of very generic functional interfaces in the java.util.function package. One of the interfaces, BiFunction<T, U, R>, describes functions with parameter types T and U and return type R. You can save your string comparison lambda in a variable of that type:"*

```java
BiFunction<String, String, Integer> comp =
    (first, second) -> first.length() - second.length();
```

**Dịch:** Java API định nghĩa **một loạt functional interface rất tổng quát** trong package **`java.util.function`**. Một trong số đó, **`BiFunction<T, U, R>`**, mô tả hàm có **kiểu parameter `T` và `U`**, **kiểu trả về `R`**.

> *"Note that this interface does not help you with sorting. There is no Arrays.sort method that wants a BiFunction. If you have used a functional programming language before, you may find this curious. But for Java programmers, it’s pretty natural. An interface such as Comparator has a specific purpose, not just a method with given parameter and return types. When you want to do something with lambda expressions, you still want to keep the purpose of the expression in mind, and have a specific functional interface for it."*

**Dịch:** Lưu ý interface này **không giúp gì cho việc sắp xếp** — **không có method `Arrays.sort` nào nhận `BiFunction`**. Nếu từng dùng ngôn ngữ functional, bạn thấy chuyện này lạ; nhưng với lập trình viên Java thì **khá tự nhiên**: interface như `Comparator` có **mục đích cụ thể**, chứ không chỉ là một method với kiểu parameter và kiểu trả về cho trước. Khi làm gì đó với lambda expression, bạn vẫn nên **giữ mục đích của biểu thức trong đầu** và **có một functional interface cụ thể cho nó**.

> *"A particularly useful interface in the java.util.function package is Predicate:"*

```java
public interface Predicate<T>
{
    boolean test(T t);
    // additional default and static methods
}
```

> *"The ArrayList class has a removeIf method whose parameter is a Predicate. It is specifically designed to pass a lambda expression. For example, the following statement removes all null values from an array list:"*

```java
list.removeIf(e -> e == null);
```

**Dịch:** Một interface **đặc biệt hữu ích** trong `java.util.function` là **`Predicate`**. Class `ArrayList` có method **`removeIf`** nhận parameter kiểu `Predicate`, **được thiết kế riêng để truyền lambda expression** vào.

> *"Another useful functional interface is Supplier<T>:"*

```java
public interface Supplier<T>
{
    T get();
}
```

> *"A supplier has no parameters and yields a value of type T when the get method is called:"*

```java
Supplier<Integer> die = () -> (int)(Math.random() * 6) + 1;
int outcome = die.get();
```

**Dịch:** Một functional interface hữu ích khác là **`Supplier<T>`**: supplier **không có parameter** và **sinh ra một giá trị kiểu `T`** khi method `get` được gọi.

> *"Suppliers are used for lazy evaluation. For example, consider the call"*

```java
LocalDate hireDay = Objects.requireNonNullElse(day,
    LocalDate.of(1970, 1, 1));
```

> *"This is not optimal. We expect that day is rarely null, so we only want to construct the default LocalDate when necessary. By using the supplier, we can defer the computation:"*

```java
LocalDate hireDay = Objects.requireNonNullElseGet(day,
    () -> LocalDate.of(1970, 1, 1));
```

> *"The requireNonNullElseGet method only calls the supplier when the value is needed."*

**Dịch:** Supplier được dùng cho **lazy evaluation** (tính lười). Lời gọi đầu **không tối ưu**: ta kỳ vọng `day` **hiếm khi null**, nên **chỉ muốn dựng `LocalDate` mặc định khi cần thiết**. Dùng supplier thì **hoãn được phép tính**: `requireNonNullElseGet` **chỉ gọi supplier khi giá trị thực sự cần đến**.

> *"Functional interfaces that involve primitive types are a little cumbersone. Consider a function consuming an int and yielding an object of type T. You could use a Function<Integer, T>, but then the argument must be boxed in each call. Instead, there is a functional interface IntFunction<T>. Conversely, if a function has a return value of type int, the ToIntFunction<T> interface is more efficient than Function<T, Integer>. Finally, if both argument and return value are int, there is an IntUnaryOperator interface."*

**Dịch:** Functional interface dính tới **[[02 - Data Types|kiểu primitive]] thì hơi lằng nhằng**. Xét một hàm **nhận `int`** và **sinh object kiểu `T`**: dùng `Function<Integer, T>` được, nhưng **argument phải bị box ở mỗi lời gọi**. Thay vào đó có **`IntFunction<T>`**. Ngược lại, nếu hàm **trả về `int`** thì **`ToIntFunction<T>` hiệu quả hơn** `Function<T, Integer>`. Cuối cùng, nếu **cả argument lẫn giá trị trả về đều là `int`** thì có **`IntUnaryOperator`**.

> *"As the user of an API, you don't usually care about this subtlety. Consider the Arrays.setAll method. It sets all values of an array to the result of a function whose argument is the array index. Here, we set all elements to the square of the index:"*

```java
var values = new int[100];
Arrays.setAll(values, i -> i * i); // [0, 1, 4, 9, 16, . . ., 9801]
```

> *"There are overloaded versions of setAll for arrays of type int[], long[], double[], and a generic array T[]. Here, the int[] overload has as second parameter an IntUnaryOperator. But as the user of the method, you don't care. You just supply the lambda expression, which you can do without worrying about the difference between primitive types and their wrapper classes."*

**Dịch:** Với tư cách **người dùng API**, bạn thường **không cần bận tâm sự tinh tế này**. Method `Arrays.setAll` đặt **mọi giá trị của [[09 - Arrays|array]] bằng kết quả của một hàm nhận argument là chỉ số phần tử**. `setAll` có các bản **overload** cho array kiểu `int[]`, `long[]`, `double[]`, và array generic `T[]`. Bản `int[]` có parameter thứ hai là `IntUnaryOperator` — nhưng **bạn cứ đưa lambda expression vào, khỏi lo phân biệt kiểu primitive với wrapper class**.

> **Caution (sách):** *"It is nice that a lambda expression can match primitive and wrapper types in a functional interface. But it is an error if both matches could occur. Consider a utility class that provides these methods:"*
>
> ```java
> public static int[] fill(int n, IntUnaryOperator op)
> public static Object[] fill(int n, IntFunction<Object> op)
> ```
>
> *"A call fill(n, i -> i * i) will not compile since it is ambiguous."*
>
> *"You can catch such problems in your API by compiling with the -Xlint or Xlint:overloads flag."*
>
> **Dịch:** Việc lambda expression **khớp được cả kiểu primitive lẫn wrapper** là hay, **nhưng nếu cả hai đều khớp thì đó là lỗi**. Lời gọi `fill(n, i -> i * i)` **sẽ không compile vì nhập nhằng**. Bắt được vấn đề kiểu này bằng cách **compile với cờ `-Xlint` hoặc `Xlint:overloads`**.

---

## 6.2.5. Method References

> *"Sometimes, a lambda expression involves a single method. For example, suppose you simply want to print the event object whenever a timer event occurs. Of course, you could call"*

```java
var timer = new Timer(1000, event -> System.out.println(event));
```

> *"It would be nicer if you could just pass the println method to the Timer constructor. Here is how you do that:"*

```java
var timer = new Timer(1000, System.out::println);
```

> *"The expression System.out::println is a method reference. It directs the compiler to produce an instance of a functional interface, overriding the single abstract method of the interface to call the given method. In this example, an ActionListener is produced whose actionPerformed(ActionEvent e) method calls System.out.println(e)."*

**Dịch:** Đôi khi lambda expression **chỉ dính tới một method duy nhất**. Biểu thức `System.out::println` là một **method reference**. Nó **chỉ thị cho compiler tạo ra một instance của functional interface**, **override method abstract duy nhất** của interface đó **để gọi method đã cho**. Ở ví dụ này, một `ActionListener` được tạo ra với method `actionPerformed(ActionEvent e)` **gọi `System.out.println(e)`**.

> **Note (sách):** *"Like a lambda expression, a method reference is not an object. It gives rise to an object when assigned to a variable whose type is a functional interface."*
>
> **Dịch:** Giống lambda expression, **method reference không phải là object**. Nó **sinh ra một object khi được gán cho biến có kiểu là functional interface**.

> **Note (sách):** *"There are ten overloaded println methods in the PrintStream class (of which System.out is an instance). The compiler needs to figure out which one to use, depending on context. In our example, the method reference System.out::println must be turned into an ActionListener instance with a method"*
>
> ```java
> void actionPerformed(ActionEvent e)
> ```
>
> *"The println(Object x) method is selected from the ten overloaded println methods since Object is the best match for ActionEvent. When the actionPerformed method is called, the event object is printed."*
>
> *"Now suppose we assign the same method reference to a different functional interface:"*
>
> ```java
> Runnable task = System.out::println;
> ```
>
> *"The Runnable functional interface has a single abstract method with no parameters"*
>
> ```java
> void run()
> ```
>
> *"In this case, the println() method with no parameters is chosen. Calling task.run() prints a blank line to System.out."*
>
> **Dịch:** Class `PrintStream` (mà `System.out` là một instance) có **mười method `println` overload**. Compiler **phải tự tìm ra dùng cái nào tuỳ ngữ cảnh**. Ở ví dụ trên, `System.out::println` phải biến thành instance `ActionListener` có method `void actionPerformed(ActionEvent e)`, nên **`println(Object x)` được chọn** vì **`Object` khớp tốt nhất với `ActionEvent`**.
>
> Nay gán **đúng method reference đó** cho **một functional interface khác** là `Runnable` — interface này có method abstract duy nhất **không parameter** là `void run()`. Khi đó **`println()` không parameter được chọn**, và gọi `task.run()` sẽ **in ra một dòng trống**.

> *"As another example, suppose you want to sort strings regardless of letter case. You can pass this method expression:"*

```java
Arrays.sort(strings, String::compareToIgnoreCase)
```

> *"As you can see from these examples, the :: operator separates the method name from the name of an object or class. There are three variants:"*
>
> *"1. object::instanceMethod"*
> *"2. Class::instanceMethod"*
> *"3. Class::staticMethod"*

> *"In the first variant, the method reference is equivalent to a lambda expression whose parameters are passed to the method. In the case of System.out::println, the object is System.out, and the method expression is equivalent to x -> System.out.println(x)."*

> *"In the second variant, the first parameter becomes the implicit parameter of the method. For example, String::compareToIgnoreCase is the same as (x, y) -> x.compareToIgnoreCase(y)."*

> *"In the third variant, all parameters are passed to the static method: Math::pow is equivalent to (x, y) -> Math.pow(x, y)."*

**Dịch:** Toán tử **`::`** ngăn cách **tên method** với **tên object hoặc class**. Có **ba biến thể**:

| # | Dạng | Ý nghĩa |
|---|---|---|
| 1 | `object::instanceMethod` | Tương đương lambda expression mà **parameter được truyền vào method**. `System.out::println` ↔ `x -> System.out.println(x)` |
| 2 | `Class::instanceMethod` | **Parameter thứ nhất trở thành [[03 - Defining Your Own Classes#4.3.7. Implicit and Explicit Parameters\|implicit parameter]] của method**. `String::compareToIgnoreCase` ↔ `(x, y) -> x.compareToIgnoreCase(y)` |
| 3 | `Class::staticMethod` | **Mọi parameter được truyền cho static method**. `Math::pow` ↔ `(x, y) -> Math.pow(x, y)` |

> *"Note that a lambda expression can only be rewritten as a method reference if the body of the lambda expression calls a single method and doesn't do anything else. Consider the lambda expression"*

```java
s -> s.length() == 0
```

> *"There is a single method call. But there is also a comparison, so you can't use a method reference here."*

**Dịch:** Lambda expression **chỉ viết lại được thành method reference nếu thân của nó gọi đúng MỘT method và không làm gì khác**. Ở ví dụ trên tuy chỉ có một lời gọi method, **nhưng còn có phép so sánh**, nên **không dùng method reference được**.

### Table 6.1 — Method Reference Examples

| Method Reference | Lambda expression tương đương | Ghi chú (dịch từ sách) |
|---|---|---|
| `separator::equals` | `x -> separator.equals(x)` | Method expression với **một object và một instance method**. Parameter của lambda được **truyền vào làm explicit parameter** của method. |
| `String::strip` | `x -> x.strip()` | Method expression với **một class và một instance method**. Parameter của lambda **trở thành implicit parameter**. |
| `String::concat` | `(x, y) -> x.concat(y)` | Lại là instance method, nhưng lần này **có explicit parameter**. Như trên, **parameter đầu của lambda thành implicit parameter**, **các parameter còn lại được truyền vào method**. |
| `Integer::valueOf` | `x -> Integer.valueOf(x)` | Method expression với **một static method**. Parameter của lambda **được truyền cho static method**. |
| `Integer::sum` | `(x, y) -> Integer.sum(x, y)` | Một static method khác, lần này **hai parameter**. **Cả hai parameter của lambda được truyền cho static method.** Method `Integer.sum` **được tạo ra chính là để dùng làm method reference**; viết dạng lambda thì chỉ cần `(x, y) -> x + y`. |
| `String::new` | `x -> new String(x)` | Đây là **constructor reference** — xem mục 6.2.6. Các parameter của lambda **được truyền cho constructor**. |
| `String[]::new` | `n -> new String[n]` | Đây là **array constructor reference** — xem mục 6.2.6. Parameter của lambda là **độ dài array**. |

> **Note (sách):** *"When there are multiple overloaded methods with the same name, the compiler will try to find from the context which one you mean. For example, there are two versions of the Math.max method, one for integers and one for double values. Which one gets picked depends on the method parameters of the functional interface to which Math::max is converted. Just like lambda expressions, method references don’t live in isolation. They are always turned into instances of functional interfaces."*
>
> **Dịch:** Khi có **nhiều method overload cùng tên**, compiler sẽ **dựa vào ngữ cảnh để tìm ra bạn muốn cái nào**. Ví dụ `Math.max` có hai bản, một cho integer và một cho `double`; chọn bản nào **phụ thuộc vào parameter của functional interface mà `Math::max` được chuyển đổi sang**. Giống lambda expression, **method reference không tồn tại một mình** — chúng **luôn được biến thành instance của functional interface**.

> **Note (sách):** *"Sometimes, the API contains methods that are specifically intended to be used as method references. For example, the Objects class has a method isNull to test whether an object reference is null. At first glance, this doesn't seem useful because the test obj == null is easier to read than Objects.isNull(obj). But you can pass the method reference to any method with a Predicate parameter. For example, to remove all null references from a list, you can call"*
>
> ```java
> list.removeIf(Objects::isNull);
> // A bit easier to read than list.removeIf(e -> e == null);
> ```
>
> **Dịch:** Đôi khi API chứa **method sinh ra chỉ để dùng làm method reference**. Ví dụ class `Objects` có method **`isNull`** kiểm tra một object reference có null không. Thoạt nhìn **có vẻ vô dụng** vì `obj == null` dễ đọc hơn `Objects.isNull(obj)`. Nhưng bạn **truyền được method reference đó vào bất kỳ method nào có parameter `Predicate`**.

> **Note (sách):** *"There is a tiny difference between a method reference with an object and its equivalent lambda expression. Consider a method reference such as separator::equals. If separator is null, forming separator::equals immediately throws a NullPointerException. The lambda expression x -> separator.equals(x) only throws a NullPointerException if it is invoked."*
>
> **Dịch:** Có **khác biệt nhỏ** giữa method reference gắn với một object và lambda expression tương đương. Với `separator::equals`: nếu `separator` là `null` thì **việc tạo ra `separator::equals` ném ngay `NullPointerException`**. Còn lambda expression `x -> separator.equals(x)` **chỉ ném `NullPointerException` khi nó được gọi**.

> *"You can capture the this parameter in a method reference. For example, this::equals is the same as x -> this.equals(x). It is also valid to use super. The method expression"*

```java
super::instanceMethod
```

> *"uses this as the target and invokes the superclass version of the given method. Here is an artificial example that shows the mechanics:"*

```java
class Greeter
{
    public void greet(ActionEvent event)
    {
        System.out.println("Hello, the time is "
            + Instant.ofEpochMilli(event.getWhen()));
    }
}

class RepeatedGreeter extends Greeter
{
    public void greet(ActionEvent event)
    {
        var timer = new Timer(1000, super::greet);
        timer.start();
    }
}
```

> *"When the RepeatedGreeter.greet method starts, a Timer is constructed that executes the super::greet method on every timer tick."*

**Dịch:** Bạn **bắt được parameter `this` trong method reference**: `this::equals` giống `x -> this.equals(x)`. Dùng **`super` cũng hợp lệ**: method expression `super::instanceMethod` **lấy `this` làm target** và **gọi bản method của [[01 - Classes, Superclasses, and Subclasses|superclass]]**. Khi `RepeatedGreeter.greet` khởi động, một `Timer` được dựng, **chạy method `super::greet` ở mỗi nhịp timer**.

---

## 6.2.6. Constructor References

> *"Constructor references are just like method references, except that the name of the method is new. For example, Person::new is a reference to a Person constructor. Which constructor? It depends on the context. Suppose you have a list of strings. Then you can turn it into an array of Person objects, by calling the constructor on each of the strings, with the following invocation:"*

```java
ArrayList<String> names = . . .;
Stream<Person> stream = names.stream().map(Person::new);
List<Person> people = stream.toList();
```

> *"We will discuss the details of the stream, map, and toList methods in Chapter 1 of Volume II. For now, what’s important is that the map method calls the Person(String) constructor for each list element. If there are multiple Person constructors, the compiler picks the one with a String parameter because it infers from the context that the constructor is called with a string."*

**Dịch:** **Constructor reference giống hệt method reference**, chỉ khác **tên method là `new`**. Ví dụ `Person::new` là reference tới một [[03 - Defining Your Own Classes#4.3.4. First Steps with Constructors|constructor]] của `Person`. **Constructor nào? Tuỳ ngữ cảnh.** Ở đây method `map` **gọi constructor `Person(String)` cho mỗi phần tử của list**. Nếu `Person` có **nhiều constructor**, compiler **chọn cái có parameter `String`** vì nó **suy ra từ ngữ cảnh** rằng constructor được gọi với một string.

> *"You can form constructor references with array types. For example, int[]::new is a constructor reference with one parameter: the length of the array. It is equivalent to the lambda expression n -> new int[n]."*

**Dịch:** Bạn **tạo được constructor reference với kiểu array**. `int[]::new` là constructor reference có **một parameter: độ dài array**, tương đương lambda `n -> new int[n]`.

> *"Array constructor references are useful to overcome a limitation of Java. As you will see in Chapter 8, it is not possible to construct an array of a generic type T. (The expression new T[n] is an error since it would be “erased” to new Object[n]). That is a problem for library authors. For example, suppose we want to have an array of Person objects. The Stream interface has a toArray method that returns an Object array:"*

```java
Object[] people = stream.toArray();
```

> *"But that is unsatisfactory. The user wants an array of references to Person, not references to Object. The stream library solves that problem with constructor references. Pass Person[]::new to the toArray method:"*

```java
Person[] people = stream.toArray(Person[]::new);
```

> *"The toArray method invokes this constructor to obtain an array of the correct type. Then it fills and returns the array."*

**Dịch:** Array constructor reference hữu ích để **vượt qua một hạn chế của Java**: như sẽ thấy ở Chapter 8, **không dựng được array của generic type `T`** (biểu thức `new T[n]` là lỗi vì nó **bị "erase" thành `new Object[n]`**). Đó là **vấn đề cho tác giả thư viện**. Thư viện stream **giải quyết bằng constructor reference**: truyền `Person[]::new` vào method `toArray`, method này **gọi constructor đó để lấy array đúng kiểu**, rồi **điền dữ liệu và trả về array**.

> **Caution (sách):** *"Sometimes, it is surprising which overloaded variant is chosen when passing a method or constructor reference. Consider this code snippet:"*
>
> ```java
> var dates = new Date[100];
> Arrays.setAll(dates, Date::new);
> ```
>
> *"At first glance, it looks as if all elements would be set to the current date, by calling the no-argument constructor new Date() each time. But actually, the second parameter of setAll is an IntFunction, which receives the index of the element. Therefore, an entirely different constructor is invoked, new Date(i), where i ranges from 0 to 99. That constructor sets the date to a given number of milliseconds from the “epoch,” January 1, 1970."*
>
> **Dịch:** Đôi khi **bản overload được chọn khiến bạn bất ngờ**. Thoạt nhìn có vẻ mọi phần tử sẽ được đặt bằng **ngày hiện tại**, do gọi constructor không argument `new Date()` mỗi lần. Nhưng thực ra **parameter thứ hai của `setAll` là `IntFunction`**, nhận **chỉ số của phần tử**. Vì vậy **một constructor hoàn toàn khác được gọi**: `new Date(i)` với `i` chạy từ 0 tới 99 — constructor đó đặt ngày theo **số millisecond kể từ "epoch" 1/1/1970**.

---

## 6.2.7. Variable Scope

> *"Often, you want to be able to access variables from an enclosing method or class in a lambda expression. Consider this example:"*

```java
public static void repeatMessage(String text, int delay)
{
    ActionListener listener = event ->
    {
        System.out.println(text);
        Toolkit.getDefaultToolkit().beep();
    };
    new Timer(delay, listener).start();
}
```

> *"Consider a call"*

```java
repeatMessage("Hello", 1000); // prints Hello every 1,000 milliseconds
```

> *"Now look at the variable text inside the lambda expression. Note that this variable is not defined in the lambda expression. Instead, it is a parameter variable of the repeatMessage method."*

> *"If you think about it, something nonobvious is going on here. The code of the lambda expression may run long after the call to repeatMessage has returned and the parameter variables are gone. How does the text variable stay around?"*

**Dịch:** Thường bạn muốn **truy cập được biến từ method hoặc class bao quanh** bên trong lambda expression. Chú ý biến `text`: nó **không được định nghĩa trong lambda expression** mà là **biến parameter của method `repeatMessage`**. Nghĩ kỹ thì ở đây **có chuyện không hiển nhiên**: code của lambda expression **có thể chạy rất lâu sau khi lời gọi `repeatMessage` đã trả về** và **các biến parameter đã biến mất**. Vậy **biến `text` trụ lại bằng cách nào?**

> *"To understand what is happening, we need to refine our understanding of a lambda expression. A lambda expression has three ingredients:"*
>
> *"1. A block of code"*
> *"2. Parameters"*
> *"3. Values for the free variables—that is, the variables that are not parameters and not defined inside the code"*

**Dịch:** Lambda expression có **ba thành phần**:

| # | Thành phần |
|---|---|
| 1 | **Một khối code** |
| 2 | **Parameter** |
| 3 | **Giá trị cho các free variable** — tức những biến **không phải parameter** và **không được định nghĩa bên trong khối code** |

> *"In our example, the lambda expression has one free variable, text. The data structure representing the lambda expression must store the values for the free variables—in our case, the string "Hello". We say that such values have been captured by the lambda expression. (It's an implementation detail how that is done. For example, one can translate a lambda expression into an object with a single method, so that the values of the free variables are copied into instance variables of that object.)"*

**Dịch:** Ở ví dụ trên, lambda expression có **một free variable là `text`**. Cấu trúc dữ liệu biểu diễn lambda expression **phải lưu giá trị cho các free variable** — ở đây là string `"Hello"`. Ta nói những giá trị đó **đã bị lambda expression "capture" (bắt giữ)**. (Làm cách nào là **chi tiết implementation** — ví dụ có thể dịch lambda expression thành một object có một method duy nhất, để **giá trị free variable được copy vào instance variable của object đó**.)

> **Note (sách):** *"The technical term for a block of code together with the values of the free variables is a closure. If someone gloats that their language has closures, rest assured that Java has them as well. In Java, lambda expressions are closures."*
>
> **Dịch:** Thuật ngữ kỹ thuật cho **một khối code kèm giá trị của các free variable** là **closure**. Nếu ai đó khoe ngôn ngữ của họ có closure thì **yên tâm, Java cũng có**: **trong Java, lambda expression chính là closure**.

> *"As you have seen, a lambda expression can capture the value of a variable in the enclosing scope. In Java, to ensure that the captured value is well-defined, there is an important restriction. In a lambda expression, you can only reference variables whose value doesn't change. For example, the following is illegal:"*

```java
public static void countDown(int start, int delay)
{
    ActionListener listener = event ->
    {
        start--; // ERROR: Can't mutate captured variable
        System.out.println(start);
    };
    new Timer(delay, listener).start();
}
```

> *"There is a reason for this restriction. Mutating variables in a lambda expression is not safe when multiple actions are executed concurrently. This won't happen for the kinds of actions that we have seen so far, but in general, it is a serious problem. See Chapter 10 for more information on this important issue."*

**Dịch:** Để **đảm bảo giá trị bị capture là xác định rõ ràng**, Java có **một hạn chế quan trọng**: trong lambda expression, bạn **chỉ tham chiếu được tới biến mà giá trị của nó không đổi**. Có lý do cho hạn chế này: **mutate biến trong lambda expression là không an toàn khi nhiều hành động chạy đồng thời**. Chuyện đó không xảy ra với các hành động ta đã gặp, nhưng **nói chung đây là vấn đề nghiêm trọng** (xem Chapter 10).

> *"It is also illegal to refer, in a lambda expression, to a variable that is mutated outside. For example, the following is illegal:"*

```java
public static void repeat(String text, int count)
{
    for (int i = 1; i <= count; i++)
    {
        ActionListener listener = event ->
        {
            System.out.println(i + ": " + text);
            // ERROR: Cannot refer to changing i
        };
        new Timer(1000, listener).start();
    }
}
```

> *"The rule is that any captured variable in a lambda expression must be effectively final. An effectively final variable is a variable that is never assigned a new value after it has been initialized. In our case, text always refers to the same String object, and it is OK to capture it. However, the value of i is mutated, and therefore i cannot be captured."*

**Dịch:** Cũng **bất hợp lệ** khi tham chiếu tới **biến bị mutate ở bên ngoài**. Luật là: **mọi biến bị capture trong lambda expression phải là "effectively final"**. Biến **effectively final** là biến **không bao giờ được gán giá trị mới sau khi đã khởi tạo**. Ở đây `text` **luôn trỏ tới cùng một object `String`** nên capture được; còn **giá trị của `i` bị mutate** nên **`i` không capture được**.

> *"The body of a lambda expression has the same scope as a nested block. The same rules for name conflicts and shadowing apply. It is illegal to declare a parameter or a local variable in the lambda that has the same name as a local variable."*

```java
Path first = Path.of("/usr/bin");
Comparator<String> comp =
    (first, second) -> first.length() - second.length();
    // ERROR: Variable first already defined
```

> *"Inside a method, you can’t have two local variables with the same name, and therefore, you can’t introduce such variables in a lambda expression either."*

**Dịch:** Thân của lambda expression có **cùng scope với một nested block**, áp dụng **cùng luật về xung đột tên và shadowing**. **Khai báo parameter hay local variable trong lambda trùng tên với một local variable là bất hợp lệ.** Trong một method bạn **không thể có hai local variable cùng tên**, nên cũng **không đưa được biến như vậy vào lambda expression**.

> *"When you use the this keyword in a lambda expression, you refer to the this parameter of the method that creates the lambda. For example, consider"*

```java
public class Application
{
    public void init()
    {
        ActionListener listener = event ->
        {
            System.out.println(this.toString());
            . . .
        }
        . . .
    }
}
```

> *"The expression this.toString() calls the toString method of the Application object, not the ActionListener instance. There is nothing special about the use of this in a lambda expression. The scope of the lambda expression is nested inside the init method, and this has the same meaning anywhere in that method."*

**Dịch:** Khi dùng keyword **`this`** trong lambda expression, bạn **đang trỏ tới parameter `this` của method tạo ra lambda**. Biểu thức `this.toString()` gọi `toString` của **object `Application`**, **không phải** của instance `ActionListener`. **Không có gì đặc biệt** ở việc dùng `this` trong lambda expression: scope của lambda **nằm lồng bên trong method `init`**, và `this` **mang cùng ý nghĩa ở bất cứ đâu trong method đó**.

---

## 6.2.8. Processing Lambda Expressions

> *"Up to now, you have seen how to produce lambda expressions and pass them to a method that expects a functional interface. Now let us see how to write methods that can consume lambda expressions."*

> *"The point of using lambdas is deferred execution. After all, if you wanted to execute some code right now, you’d do that, without wrapping it inside a lambda. There are many reasons for executing code later, such as:"*
>
> *"Running the code in a separate thread"*
> *"Running the code multiple times"*
> *"Running the code at the right point in an algorithm (for example, the comparison operation in sorting)"*
> *"Running the code when something happens (a button was clicked, data has arrived, and so on)"*
> *"Running the code only when necessary"*

**Dịch:** Điểm mấu chốt của lambda là **deferred execution** (thi hành trì hoãn). Nếu muốn chạy code **ngay lúc này** thì bạn cứ chạy, **khỏi bọc nó vào lambda**. Có nhiều lý do để chạy code sau này:

| Lý do chạy code sau |
|---|
| Chạy code trong **một thread riêng** |
| Chạy code **nhiều lần** |
| Chạy code **đúng chỗ trong một thuật toán** (ví dụ phép so sánh khi sắp xếp) |
| Chạy code **khi có chuyện gì đó xảy ra** (nút được bấm, dữ liệu về, v.v.) |
| **Chỉ chạy code khi cần thiết** |

> *"Let's look at a simple example. Suppose you want to repeat an action n times. The action and the count are passed to a repeat method:"*

```java
repeat(10, () -> System.out.println("Hello, World!"));
```

> *"To accept the lambda, we need to pick (or, in rare cases, provide) a functional interface. Table 6.2 lists the most important functional interfaces that are provided in the Java API. In this case, we can use the Runnable interface:"*

```java
public static void repeat(int n, Runnable action)
{
    for (int i = 0; i < n; i++) action.run();
}
```

> *"Note that the body of the lambda expression is executed when action.run() is called."*

**Dịch:** Để **nhận lambda**, ta phải **chọn (hoặc hiếm khi là tự cung cấp) một functional interface**. Ở đây dùng interface **`Runnable`**. Chú ý: **thân của lambda expression được chạy khi `action.run()` được gọi**.

> *"Now let's make this example a bit more sophisticated. We want to tell the action in which iteration it occurs. For that, we need to pick a functional interface that has a method with an int parameter and a void return. The standard interface for processing int values is"*

```java
public interface IntConsumer
{
    void accept(int value);
}
```

> *"Here is the improved version of the repeat method:"*

```java
public static void repeat(int n, IntConsumer action)
{
    for (int i = 0; i < n; i++) action.accept(i);
}
```

> *"And here is how you call it:"*

```java
repeat(10, i -> System.out.println("Countdown: " + (9 - i)));
```

**Dịch:** Nâng ví dụ lên một chút: ta muốn **báo cho action biết nó đang ở vòng lặp thứ mấy**. Muốn vậy phải **chọn functional interface có method nhận parameter `int` và trả về `void`** — interface chuẩn để xử lý giá trị `int` là **`IntConsumer`**.

### Table 6.2 — Common Functional Interfaces

| Functional Interface | Parameter Types | Return Type | Abstract Method Name | Mô tả (dịch từ sách) | Other Methods |
|---|---|---|---|---|---|
| `Runnable` | none | `void` | `run` | Chạy một hành động **không parameter, không giá trị trả về** | |
| `Supplier<T>` | none | `T` | `get` | **Cung cấp** một giá trị kiểu `T` | |
| `Consumer<T>` | `T` | `void` | `accept` | **Tiêu thụ** một giá trị kiểu `T` | `andThen` |
| `BiConsumer<T, U>` | `T, U` | `void` | `accept` | **Tiêu thụ** các giá trị kiểu `T` và `U` | `andThen` |
| `Function<T, R>` | `T` | `R` | `apply` | Một hàm có **parameter kiểu `T`** | `compose`, `andThen`, `identity` |
| `BiFunction<T, U, R>` | `T, U` | `R` | `apply` | Một hàm có **parameter kiểu `T` và `U`** | `andThen` |
| `UnaryOperator<T>` | `T` | `T` | `apply` | Một **toán tử một ngôi** trên kiểu `T` | `compose`, `andThen`, `identity` |
| `BinaryOperator<T>` | `T, T` | `T` | `apply` | Một **toán tử hai ngôi** trên kiểu `T` | `andThen`, `maxBy`, `minBy` |
| `Predicate<T>` | `T` | `boolean` | `test` | Một hàm **trả về giá trị boolean** | `and`, `or`, `negate`, `isEqual`, `not` |
| `BiPredicate<T, U>` | `T, U` | `boolean` | `test` | Một hàm **trả về giá trị boolean** với **hai parameter** | `and`, `or`, `negate` |

> *"Table 6.3 lists the 34 available specializations for primitive types int, long, and double. As you will see in Chapter 8, it is more efficient to use these specializations than the generic interfaces. For that reason, I used an IntConsumer instead of a Consumer<Integer> in the example of the preceding section."*

**Dịch:** Table 6.3 liệt kê **34 bản chuyên biệt hoá** cho kiểu primitive **`int`, `long`, `double`**. Như sẽ thấy ở Chapter 8, **dùng các bản chuyên biệt này hiệu quả hơn interface generic**. Vì vậy tác giả dùng **`IntConsumer`** thay vì `Consumer<Integer>` ở ví dụ mục trước.

### Table 6.3 — Functional Interfaces for Primitive Types

> *"p, q is int, long, double; P, Q is Int, Long, Double"*

**Dịch chú thích bảng:** `p`, `q` là `int`, `long`, `double`; `P`, `Q` là `Int`, `Long`, `Double`.

| Functional Interface | Parameter Types | Return Type | Abstract Method Name |
|---|---|---|---|
| `BooleanSupplier` | none | `boolean` | `getAsBoolean` |
| `PSupplier` | none | `p` | `getAsP` |
| `PConsumer` | `p` | `void` | `accept` |
| `ObjPConsumer<T>` | `T, p` | `void` | `accept` |
| `PFunction<T>` | `p` | `T` | `apply` |
| `PToQFunction` | `p` | `q` | `applyAsQ` |
| `ToPFunction<T>` | `T` | `p` | `applyAsP` |
| `ToPBiFunction<T, U>` | `T, U` | `p` | `applyAsP` |
| `PUnaryOperator` | `p` | `p` | `applyAsP` |
| `PBinaryOperator` | `p, p` | `p` | `applyAsP` |
| `PPredicate` | `p` | `boolean` | `test` |

> **Tip (sách):** *"Use the standard interfaces for function types whenever you can. For example, suppose you write a method to process files that match a certain criterion. There is a legacy interface java.io.FileFilter. But if you use the standard Predicate<File> interface, you can take advantage of methods for creating, adapting, and combining predicates. The only reason not to do so would be if you already have many useful methods producing FileFilter instances."*
>
> **Dịch:** **Hãy dùng interface chuẩn cho kiểu hàm bất cứ khi nào có thể.** Ví dụ khi viết method xử lý file khớp một tiêu chí nào đó: có interface cũ `java.io.FileFilter`, nhưng nếu dùng interface chuẩn **`Predicate<File>`** thì bạn **tận dụng được các method tạo, thích nghi và kết hợp predicate**. **Lý do duy nhất để không làm vậy** là khi bạn **đã có sẵn nhiều method hữu ích sinh ra instance `FileFilter`**.

> **Note (sách):** *"Most of the standard functional interfaces have nonabstract methods for producing or combining functions. For example, Predicate.isEqual(a) is the same as a::equals, but it also works if a is null. There are default methods and, or, negate for combining predicates. For example, Predicate.isEqual(a).or(Predicate.isEqual(b)) is the same as x -> a.equals(x) || b.equals(x)."*
>
> **Dịch:** **Phần lớn functional interface chuẩn có các method không abstract** để **tạo ra hoặc kết hợp hàm**. Ví dụ `Predicate.isEqual(a)` giống `a::equals`, **nhưng vẫn chạy được khi `a` là `null`**. Có các [[01 - Interfaces#6.1.5. Default Methods|default method]] **`and`, `or`, `negate`** để kết hợp predicate.

> **Note (sách):** *"If you design your own interface with a single abstract method, you can tag it with the @FunctionalInterface annotation. This has two advantages. The compiler gives an error message if you accidentally add another abstract method. And the javadoc page includes a statement that your interface is a functional interface."*
>
> *"It is not required to use the annotation. Any interface with a single abstract method is, by definition, a functional interface. But using the @FunctionalInterface annotation is a good idea."*
>
> **Dịch:** Nếu tự thiết kế interface có **một abstract method duy nhất**, bạn **gắn được annotation `@FunctionalInterface`**. Có **hai lợi ích**: compiler **báo lỗi nếu bạn lỡ thêm một abstract method nữa**, và **trang javadoc ghi rõ** interface của bạn là functional interface.
>
> **Không bắt buộc dùng annotation này** — theo định nghĩa, **mọi interface có một abstract method duy nhất đều là functional interface**. Nhưng **dùng `@FunctionalInterface` là ý hay**.

> **Note (sách):** *"Some programmers love chains of method calls, such as"*
>
> ```java
> String input = " 618970019642690137449562111 ";
> boolean isPrime =
>     input.strip().transform(BigInteger::new).isProbablePrime(20);
> ```
>
> *"The transform method of the String class (added in Java 12) applies a Function to the string and yields the result. You could have equally well written"*
>
> ```java
> boolean prime = new BigInteger(input.strip()).isProbablePrime(20);
> ```
>
> *"But then your eyes jump inside-out and left-to-right to find out what happens first and what happens next: Calling strip, then constructing the BigInteger, and finally testing if it is a probable prime."*
>
> *"I am not sure that the eyes-jumping-inside-out-and-left-to-right is a huge problem. But if you prefer the orderly left-to-right sequence of chained method calls, then transform is your friend."*
>
> *"Sadly, it only works for strings. Why isn't there a transform(java.util.function.Function) method in the Object class?"*
>
> *"The Java API designers weren't fast enough. They had one chance to do this right—in Java 8, when the java.util.function.Function interface was added to the API. Up to that point, nobody could have added a transform(java.util.function.Function) method to their own classes. But in Java 12, it was too late. Someone somewhere could have defined transform(java.util.function.Function) in their class, with a different meaning. Admittedly, it is unlikely that this ever happened, but there is no way to know. That is how Java works. It takes its commitments seriously, and won't renege on them for convenience."*
>
> **Dịch:** Vài lập trình viên **mê chuỗi lời gọi method**. Method **`transform`** của class `String` (thêm ở **Java 12**) **áp dụng một `Function` lên string và trả về kết quả**. Viết cách kia cũng được, nhưng khi đó **mắt bạn phải nhảy từ trong ra ngoài rồi từ trái sang phải** để biết cái gì xảy ra trước, cái gì sau: gọi `strip`, rồi dựng `BigInteger`, cuối cùng kiểm tra số nguyên tố xác suất.
>
> Tác giả **không chắc chuyện nhảy mắt đó là vấn đề to tát**. Nhưng nếu bạn thích **trình tự trái-sang-phải ngăn nắp** của chuỗi lời gọi method thì **`transform` là bạn của bạn**.
>
> Đáng tiếc **nó chỉ dùng được cho string**. Sao class `Object` không có method `transform(java.util.function.Function)`? Vì **nhà thiết kế Java API không đủ nhanh**: họ **chỉ có một cơ hội duy nhất** để làm đúng — ở **Java 8**, khi interface `java.util.function.Function` được thêm vào API. Tới trước thời điểm đó, **chưa ai có thể thêm method `transform(java.util.function.Function)` vào class của mình**. Nhưng tới **Java 12 thì đã quá muộn**: ai đó ở đâu đó **có thể đã định nghĩa `transform(java.util.function.Function)` trong class của họ với ý nghĩa khác**. Đành rằng chuyện đó **khó xảy ra**, nhưng **không có cách nào biết chắc**. **Java vận hành như vậy: nó xem trọng cam kết của mình và không nuốt lời chỉ vì tiện.**

---

## 6.2.9. Creating Comparators

> *"The Comparator interface has a number of convenient static methods for creating comparators. These methods are intended to be used with lambda expressions or method references."*

**Dịch:** Interface `Comparator` có **một loạt static method tiện lợi để tạo comparator**. Các method này **sinh ra để dùng cùng lambda expression hoặc method reference**.

> *"The static comparing method takes a “key extractor” function that maps a type T to a comparable type (such as String). The function is applied to the objects to be compared, and the comparison is then made on the returned keys. For example, suppose you have an array of Person objects. Here is how you can sort them by name:"*

```java
Arrays.sort(people, Comparator.comparing(Person::getName));
```

> *"This is certainly much easier than implementing a Comparator by hand. Moreover, the code is clearer since it is obvious that we want to compare people by name."*

**Dịch:** Static method **`comparing`** nhận một hàm **"key extractor"** ánh xạ kiểu `T` sang **một kiểu so sánh được** (chẳng hạn `String`). Hàm này **được áp lên các object cần so sánh**, và **phép so sánh thực hiện trên các key trả về**. Cách này **dễ hơn hẳn tự tay implement một `Comparator`**, và code **rõ ràng hơn** vì **thấy ngay ta muốn so sánh người theo tên**.

> *"You can chain comparators with the thenComparing method for breaking ties. For example,"*

```java
Arrays.sort(people,
    Comparator.comparing(Person::getLastName)
        .thenComparing(Person::getFirstName));
```

> *"If two people have the same last name, then the second comparator is used."*

**Dịch:** Bạn **xâu chuỗi comparator bằng method `thenComparing` để phá thế hoà**. Nếu hai người **trùng họ** thì **comparator thứ hai được dùng**.

> *"There are a few variations of these methods. You can specify a comparator to be used for the keys that the comparing and thenComparing methods extract. For example, here we sort people by the length of their names:"*

```java
Arrays.sort(people, Comparator.comparing(Person::getName,
    (s, t) -> Integer.compare(s.length(), t.length())));
```

> *"Moreover, both the comparing and thenComparing methods have variants that avoid boxing of int, long, or double values:"*

```java
Arrays.sort(people, Comparator.comparing(Person::getName,
    Comparator.comparingInt(String::length)))
```

> *"A shorter but perhaps less elegant way of producing the preceding operation would be:"*

```java
Arrays.sort(people, Comparator.comparingInt(p -> p.getName().length()));
```

**Dịch:** Các method này có **vài biến thể**. Bạn **chỉ định được comparator dùng cho các key** mà `comparing` và `thenComparing` trích ra. Hơn nữa, cả `comparing` lẫn `thenComparing` đều có **biến thể tránh boxing** cho giá trị `int`, `long`, `double`. Cách **ngắn hơn nhưng có lẽ kém thanh thoát hơn** để làm cùng việc đó là dùng `comparingInt` trực tiếp.

> *"If your key function can return null, you will like the nullsFirst and nullsLast adapters. These static methods take an existing comparator and modify it so that it doesn’t throw an exception when encountering null values but ranks them as smaller or larger than regular values. For example, suppose getMiddleName returns a null when a person has no middle name. Then you can use Comparator.comparing(Person::getMiddleName, Comparator.nullsFirst(. . .))."*

**Dịch:** Nếu hàm key **có thể trả về `null`**, bạn sẽ thích hai adapter **`nullsFirst`** và **`nullsLast`**. Hai static method này **nhận một comparator có sẵn và sửa nó** để **không ném exception khi gặp giá trị `null`**, mà **xếp `null` là nhỏ hơn hoặc lớn hơn giá trị thường**.

> *"The nullsFirst method needs a comparator—in this case, one that compares two strings. The naturalOrder method makes a comparator for any class implementing Comparable. A Comparator.<String>naturalOrder() is what we need. (See Chapter 8 for an explanation of this syntax. Fortunately, the generic type can usually be inferred.) Here is the complete call for sorting by potentially null middle names. I use a static import of java.util.Comparator.*, to make the expression more legible."*

```java
Arrays.sort(people, comparing(Person::getMiddleName,
    nullsFirst(naturalOrder())));
```

**Dịch:** `nullsFirst` **cần một comparator** — ở đây là comparator so sánh hai string. Method **`naturalOrder`** tạo comparator cho **bất kỳ class nào implement `Comparable`**. Thứ ta cần là `Comparator.<String>naturalOrder()`. (Cú pháp này giải thích ở Chapter 8; may thay **generic type thường suy ra được**.) Tác giả dùng **[[08 - Packages#4.8.3. Static Imports|static import]] `java.util.Comparator.*`** để biểu thức **dễ đọc hơn**.

> *"The static reverseOrder method gives the reverse of the natural order. To reverse any comparator, use the reversed instance method. For example, naturalOrder().reversed() is the same as reverseOrder()."*

**Dịch:** Static method **`reverseOrder`** cho **thứ tự ngược của thứ tự tự nhiên**. Muốn đảo ngược **bất kỳ comparator nào**, dùng **instance method `reversed`**: `naturalOrder().reversed()` **giống hệt** `reverseOrder()`.

---

## Bài kế tiếp

→ [[03 - Inner Classes]] — class định nghĩa bên trong class khác: local class, anonymous class, static nested class và cách chúng truy cập state của object bao ngoài.
