# 10 — Reflection

> Chapter 5, Section 5.10 — Core Java Volume I, 13th Edition (Horstmann).
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 5.10. Reflection

> *"The reflection library gives you a very rich and elaborate toolset to write programs that manipulate Java code dynamically. Using reflection, Java can support user interface builders, object-relational mappers, and many other development tools that dynamically inquire about the capabilities of classes."*

**Dịch:** Thư viện reflection cho bạn **một bộ công cụ rất phong phú và tinh vi** để viết chương trình **thao tác code Java một cách động**. Nhờ reflection, Java **hỗ trợ được các trình dựng giao diện người dùng, object-relational mapper**, và **nhiều công cụ phát triển khác** vốn **hỏi han khả năng của class một cách động**.

> *"A program that can analyze the capabilities of classes is called reflective. The reflection mechanism is extremely powerful. As the next sections show, you can use it to"*
> *"Analyze the capabilities of classes at runtime"*
> *"Inspect objects at runtime—for example, to write a single toString method that works for all classes"*
> *"Implement generic array manipulation code"*
> *"Take advantage of Method objects that work just like function pointers in languages such as C++"*

**Dịch:** Một chương trình **phân tích được khả năng của class** gọi là **reflective**. Cơ chế reflection **cực kỳ mạnh**. Bạn dùng nó để:

| Công dụng |
|---|
| **Phân tích khả năng của class lúc runtime** |
| **Xem xét object lúc runtime** — ví dụ viết **một method [[02 - Object The Cosmic Superclass\|`toString`]] duy nhất chạy được cho mọi class** |
| **Cài code thao tác [[09 - Arrays\|mảng]] một cách generic** |
| **Tận dụng object `Method`** — hoạt động **y như function pointer** trong các ngôn ngữ như C++ |

> *"Reflection is a powerful and complex mechanism; however, it is of interest mainly to tool builders, not application programmers. If you are interested in programming applications rather than tools for other Java programmers, you can safely skip the remainder of this chapter and return to it later."*

**Dịch:** Reflection là cơ chế **mạnh và phức tạp**; nhưng nó **chủ yếu hấp dẫn người làm tool**, chứ không phải người viết ứng dụng. Nếu bạn quan tâm tới **viết ứng dụng** hơn là **viết công cụ cho lập trình viên Java khác**, bạn **cứ yên tâm bỏ qua phần còn lại của chương này** và quay lại sau.

---

## 5.10.1. The Class Class

> *"While your program is running, the Java runtime system always maintains what is called runtime type identification on all objects. This information keeps track of the class to which each object belongs. Runtime type information is used by the virtual machine to select the correct methods to execute."*

**Dịch:** Khi chương trình đang chạy, hệ thống runtime của Java **luôn duy trì cái gọi là runtime type identification trên mọi object**. Thông tin này **theo dõi class mà mỗi object thuộc về**. **Virtual machine dùng runtime type information để chọn đúng method cần thực thi.**

> *"However, you can also access this information by working with a special Java class. The class that holds this information is called, somewhat confusingly, Class. The getClass() method in the Object class returns an instance of Class type."*

```java
Employee e;
. . .
Class cl = e.getClass();
```

**Dịch:** Bạn cũng **truy cập được thông tin này** thông qua một class Java đặc biệt. Class giữ thông tin đó được gọi là — **hơi dễ nhầm** — **`Class`**. Method `getClass()` trong class `Object` **trả về một instance của kiểu `Class`**.

> *"Just like an Employee object describes the properties of a particular employee, a Class object describes the properties of a particular class. Probably the most commonly used method of Class is getName. This returns the name of the class. For example, the statement"*

```java
System.out.println(e.getClass().getName() + " " + e.getName());
```

> *"prints"*

```
Employee Harry Hacker
```

> *"if e is an employee, or"*

```
Manager Harry Hacker
```

> *"if e is a manager."*

**Dịch:** Cũng như một object `Employee` mô tả các thuộc tính của một employee cụ thể, **một object `Class` mô tả các thuộc tính của một class cụ thể**. Method **hay dùng nhất của `Class` có lẽ là `getName`** — trả về **tên của class**.

> *"If the class is in a package, the package name is part of the class name:"*

```java
var in = new Scanner(System.in);
Class cl = in.getClass();
String className = cl.getName(); // name is set to "java.util.Scanner"
```

**Dịch:** Nếu class nằm trong một [[08 - Packages|package]] thì **tên package là một phần của tên class**.

> *"You can obtain a Class object corresponding to a class name by using the static forName method."*

```java
String className = "java.util.Scanner";
Class cl = Class.forName(className);
```

> *"Use this method if the class name is stored in a string that varies at runtime. This works if className is the name of a class or interface. Otherwise, the forName method throws a checked exception. See Section 5.10.2 for how to supply an exception handler whenever you use this method."*

**Dịch:** Bạn lấy được object `Class` ứng với một tên class bằng static method **`forName`**. Dùng method này khi **tên class được lưu trong một string thay đổi lúc runtime**. Nó chạy được nếu `className` là **tên của một class hoặc interface**; ngược lại `forName` **ném một checked exception**.

> *"A third method for obtaining an object of type Class is a convenient shorthand. If T is any Java type (or the void keyword), then T.class is the matching class object. For example:"*

```java
Class cl1 = Scanner.class; // if you import java.util.*;
Class cl2 = int.class;
Class cl3 = Double[].class;
```

> *"Note that a Class object really describes a type, which may or may not be a class. For example, int is not a class, but int.class is nevertheless an object of type Class."*

**Dịch:** **Cách thứ ba** để lấy object kiểu `Class` là một **lối viết tắt tiện lợi**: nếu `T` là **kiểu Java bất kỳ** (hoặc keyword `void`) thì **`T.class` là class object tương ứng**. Lưu ý object `Class` **thực chất mô tả một kiểu**, **có thể là class mà cũng có thể không**. Ví dụ `int` **không phải class**, nhưng `int.class` **vẫn là một object kiểu `Class`**.

> **Note (sách):** *"The Class class is actually a generic class. For example, Employee.class is of type Class\<Employee>. In this chapter, I'm not dwelling on this issue because it would further complicate an already abstract concept. For most practical purposes, you can ignore the type parameter and work with the raw Class type. See Chapter 8 for more information on the type parameter of Class."*
>
> **Dịch:** `Class` **thực ra là một generic class**: `Employee.class` có kiểu **`Class<Employee>`**. Chương này **không sa đà vào chuyện đó** vì sẽ **làm một khái niệm vốn đã trừu tượng thêm rối**. Với **hầu hết mục đích thực tế**, bạn **bỏ qua type parameter và làm việc với kiểu `Class` raw**.

> **Caution (sách):** *"For historical reasons, the getName method returns somewhat strange names for array types:"*
>
> *"Double[].class.getName() returns "[Ljava.lang.Double;"."*
> *"int[].class.getName() returns "[I"."*
>
> **Dịch:** **Vì lý do lịch sử**, method `getName` **trả về những cái tên hơi kỳ quặc cho kiểu mảng**.

> *"The virtual machine manages a unique Class object for each type. Therefore, you can use the == operator to compare class objects. For example:"*

```java
if (e.getClass() == Employee.class) . . .
```

> *"This test passes if e is an instance of Employee. Unlike the condition e instanceof Employee, this test fails if e is an instance of a subclass such as Manager."*

**Dịch:** Virtual machine **quản lý một object `Class` duy nhất cho mỗi kiểu**, nên bạn **dùng được toán tử `==` để so sánh class object**. Phép kiểm tra trên **đúng nếu `e` là instance của `Employee`**. **Khác với** điều kiện `e instanceof Employee`, phép kiểm tra này **thất bại nếu `e` là instance của một subclass** như `Manager`.

> **Caution (sách):** *"You would expect the instances in an enumeration to have as their class the enumeration class. Generally, this is true:"*
>
> ```java
> public enum Size { SMALL, MEDIUM, LARGE, EXTRA_LARGE; }
> Size.SMALL.getClass() == Size.class // true
> ```
>
> *"However, if you override a method in an instance, then it belongs to a different class:"*
>
> ```java
> public enum Size
> {
>     SMALL,
>     MEDIUM,
>     LARGE,
>     EXTRA_LARGE
>     {
>         public String toString() { return "XL"; }
>     };
> }
> Size.EXTRA_LARGE.getClass() == Size.class // false
> ```
>
> **Dịch:** Bạn sẽ **kỳ vọng** các instance trong một [[07 - Enumeration Classes|enumeration]] **có class chính là enumeration class đó**. **Nói chung là đúng.** Nhưng nếu bạn **override một method ở một instance** thì **instance đó thuộc về một class khác**.

> *"If you have an object of type Class, you can use it to construct instances of the class. Call the getConstructor method to get an object of type Constructor, then use the newInstance method to construct an instance. For example:"*

```java
var className = "java.util.Date"; // or any other name of a class with a no-arg constructor
Class cl = Class.forName(className);
Object obj = cl.getConstructor().newInstance();
```

> *"If the class doesn't have a constructor without arguments, the getConstructor method throws an exception. You will see in Section 5.10.7 how to invoke other constructors."*

**Dịch:** Có object kiểu `Class` thì **dùng nó để dựng instance của class đó được**: gọi **`getConstructor`** để lấy một object kiểu `Constructor`, rồi dùng **`newInstance`** để dựng một instance. Nếu class **không có constructor không tham số** thì `getConstructor` **ném exception**.

> **Note (sách):** *"There is a Class.newInstance method that also constructs an instance with the no-argument constructor. However, it is deprecated for a subtle reason. Any exception thrown in the constructor is rethrown as is. For checked exceptions, this violates the compile-time checking. In contrast, Constructor.newInstance wraps any constructor exception into an InvocationTargetException."*
>
> **Dịch:** Có một method **`Class.newInstance`** cũng dựng instance bằng constructor không tham số. Nhưng nó **deprecated vì một lý do tinh tế**: **mọi exception ném ra trong constructor bị ném lại nguyên trạng**. Với **checked exception**, điều này **vi phạm kiểm tra lúc compile-time**. Ngược lại, **`Constructor.newInstance` gói mọi exception của constructor vào một `InvocationTargetException`**.

> **C++ Note (sách):** *"The newInstance method corresponds to the idiom of a virtual constructor in C++. However, virtual constructors in C++ are not a language feature but just an idiom that needs to be supported by a specialized library. The Class class is similar to the type_info class in C++, and the getClass method is equivalent to the typeid operator. The Java Class is quite a bit more versatile than type_info, though. The C++ type_info can only reveal a string with the name of the type, not create new objects of that type."*
>
> **Dịch:** `newInstance` ứng với **idiom "virtual constructor" trong C++**. Nhưng virtual constructor ở C++ **không phải tính năng ngôn ngữ**, chỉ là một **idiom cần library chuyên biệt hỗ trợ**. Class `Class` **tương tự class `type_info` của C++**, và `getClass` **tương đương toán tử `typeid`**. Nhưng **`Class` của Java linh hoạt hơn `type_info` khá nhiều**: `type_info` của C++ **chỉ tiết lộ được một string chứa tên kiểu**, **không tạo được object mới thuộc kiểu đó**.

## API — `java.lang.Class` (Java 1.0)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `static Class forName(String className)` | Trả về **object `Class` đại diện cho class có tên `className`**. |
| `Constructor getConstructor(Class... parameterTypes)` *(1.1)* | Cho ra **một object mô tả constructor có các kiểu parameter cho trước**. |

## API — `java.lang.reflect.Constructor` (Java 1.1)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `Object newInstance(Object... initargs)` | **Dựng một instance mới của class khai báo constructor này**, truyền `initargs` vào constructor. |

## API — `java.lang.Throwable` (Java 1.0)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `void printStackTrace()` | **In object `Throwable` và stack trace ra luồng standard error.** |

---

## 5.10.2. A Primer on Declaring Exceptions

> *"I cover exception handling fully in Chapter 7, but in the meantime you will occasionally encounter methods that threaten to throw exceptions."*

**Dịch:** Xử lý exception được nói đầy đủ ở chương 7, nhưng trong lúc chờ, bạn **thỉnh thoảng sẽ gặp method doạ ném exception**.

> *"When an error occurs at runtime, a program can "throw an exception." Throwing an exception is more flexible than terminating the program because you can provide a handler that "catches" the exception and deals with it."*

**Dịch:** Khi có lỗi lúc runtime, chương trình **"ném một exception"**. Ném exception **linh hoạt hơn kết thúc chương trình**, vì bạn **cung cấp được một handler "bắt" exception và xử lý nó**.

> *"If you don't provide a handler, the program terminates and prints a message to the console, giving the type of the exception. You may have already seen exception reports when you accidentally used a null reference or overstepped the bounds of an array."*

**Dịch:** Nếu **không cung cấp handler**, chương trình **kết thúc và in một thông báo ra console**, cho biết **kiểu của exception**. Bạn có lẽ **đã thấy báo cáo exception** khi lỡ **dùng một [[03 - Defining Your Own Classes|null reference]]** hoặc **vượt quá biên của một mảng**.

> *"There are two kinds of exceptions: unchecked exceptions and checked exceptions. With checked exceptions, the compiler checks that you, the programmer, are aware of the exception and are prepared to deal with the consequences. However, many common exceptions, such as bounds errors, or accessing a null reference, are unchecked. The compiler does not expect that you provide a handler—after all, you should spend your mental energy on avoiding these mistakes rather than coding handlers for them."*

**Dịch:** Có **hai loại exception**: **unchecked exception** và **checked exception**. Với checked exception, **compiler kiểm tra rằng bạn — lập trình viên — biết về exception đó và sẵn sàng xử lý hậu quả**. Nhưng **nhiều exception phổ biến**, như **lỗi vượt biên** hay **truy cập null reference**, là **unchecked**: compiler **không kỳ vọng bạn cung cấp handler** — dù sao thì bạn **nên dồn năng lượng vào việc tránh các lỗi đó hơn là viết handler cho chúng**.

> *"But not all errors are avoidable. If an exception can occur despite your best efforts, then most Java APIs will throw a checked exception. One example is the Class.forName method. There is no way for you to ensure that a class with the given name exists. In Chapter 7, you will see several strategies for exception handling. For now, I just show you the simplest strategy."*

**Dịch:** Nhưng **không phải lỗi nào cũng tránh được**. Nếu một exception **có thể xảy ra dù bạn đã cố hết sức** thì **phần lớn API của Java sẽ ném checked exception**. Ví dụ là `Class.forName`: **bạn không có cách nào đảm bảo tồn tại một class mang cái tên cho trước**.

> *"Whenever a method contains a statement that might throw a checked exception, add a throws clause to the method name."*

```java
public static void doSomethingWithClass(String name)
    throws ReflectiveOperationException
{
    Class cl = Class.forName(name); // might throw exception
    do something with cl
}
```

**Dịch:** Bất cứ khi nào một method **chứa câu lệnh có thể ném checked exception**, hãy **thêm mệnh đề `throws` vào tên method**.

> *"Any method that calls this method also needs a throws declaration. This includes the main method. If an exception actually occurs, the main method terminates with a stack trace. (You will learn in Chapter 7 how to catch exceptions instead of having them terminate your programs.)"*

**Dịch:** **Mọi method gọi method này cũng cần khai báo `throws`**, kể cả method `main`. Nếu exception **thực sự xảy ra**, method `main` **kết thúc kèm một stack trace**.

> *"You only need to supply a throws clause for checked exceptions. It is easy to find out which methods throw checked exceptions—the compiler will complain whenever you call a method that threatens to throw a checked exception and you don't supply a handler."*

**Dịch:** Bạn **chỉ cần mệnh đề `throws` cho checked exception**. **Dễ tìm ra method nào ném checked exception**: compiler **sẽ kêu ca** mỗi khi bạn gọi một method doạ ném checked exception mà **không cung cấp handler**.

---

## 5.10.3. Resources

> *"Classes often have associated data files, such as:"*
> *"Image and sound files"*
> *"Text files with message strings and button labels"*
> *"In Java, such an associated file is called a resource."*

**Dịch:** Class thường có **file dữ liệu đi kèm**, chẳng hạn **file ảnh và âm thanh**, **file text chứa chuỗi thông báo và nhãn nút bấm**. Trong Java, một file đi kèm như vậy gọi là **resource**.

> *"Of course, the book title and copyright year in the panel will change for the next edition of the book. To make it easy to track this change, we will put the text inside a file and not hardcode it as a string."*

**Dịch:** Tiêu đề sách và năm bản quyền **sẽ đổi ở lần tái bản sau**. Để **dễ theo dõi thay đổi**, ta **đặt phần chữ vào một file** thay vì **gắn cứng thành một string**.

> *"But where should you put a file such as about.txt? Of course, it would be convenient to simply place it with the rest of the program files inside a JAR file. The Class class provides a useful service for locating resource files. Here are the necessary steps:"*

> *"1. Get the Class object of the class that has a resource—for example, ResourceTest.class."*
> *"2. Some methods, such as the getImage method of the ImageIcon class, accept URLs that describe resource locations. Then you call"*
>
> ```java
> URL url = cl.getResource("about.png");
> ```
>
> *"3. Otherwise, use the getResourceAsStream method to obtain an input stream for reading the data in the file."*

**Dịch:** Nhưng **đặt file kiểu `about.txt` ở đâu**? Tiện nhất là **để chung với các file chương trình khác trong một file JAR**. Class `Class` **cung cấp một dịch vụ hữu ích để định vị file resource**. Các bước:

| # | Bước |
|---|---|
| 1 | **Lấy object `Class` của class có resource** — ví dụ `ResourceTest.class` |
| 2 | Một số method (như `getImage` của `ImageIcon`) **nhận URL mô tả vị trí resource** → gọi `cl.getResource("about.png")` |
| 3 | Ngược lại, dùng **`getResourceAsStream`** để lấy **một input stream đọc dữ liệu trong file** |

> *"The point is that the Java virtual machine knows how to locate a class, so it can then search for the associated resource in the same location. For example, suppose the ResourceTest class is in a package resources. Then the ResourceTest.class file is located in a resources directory, and you place an icon file into the same directory."*

**Dịch:** Điểm mấu chốt: **virtual machine biết cách định vị một class**, nên nó **tìm được resource đi kèm ở cùng vị trí đó**.

> *"Instead of placing a resource file inside the same directory as the class file, you can provide a relative or absolute path such as"*

```
data/about.txt
/corejava/title.txt
```

**Dịch:** Thay vì đặt file resource **cùng thư mục với file class**, bạn **cung cấp được đường dẫn tương đối hoặc tuyệt đối**.

> *"Automating the loading of files is all the resource loading feature does. There are no standard methods for interpreting the contents of resource files. Each program must have its own way of interpreting its resource files."*

**Dịch:** **Tự động hoá việc nạp file là tất cả những gì tính năng resource loading làm.** **Không có method chuẩn nào để diễn giải nội dung file resource** — **mỗi chương trình phải có cách diễn giải riêng**.

> *"Another common application of resources is the internationalization of programs. Language-dependent strings, such as messages and user interface labels, are stored in resource files, with one file per language. The internationalization API, which is discussed in Chapter 7 of Volume II, supports a standard method for organizing and accessing these localization files."*

**Dịch:** Một ứng dụng phổ biến khác của resource là **quốc tế hoá chương trình**: các chuỗi **phụ thuộc ngôn ngữ** được lưu trong file resource, **mỗi ngôn ngữ một file**.

> *"Listing 5.16 is a program that demonstrates resource loading. (Do not worry about the code for reading text and displaying dialogs—we cover those details later.) Compile, build a JAR file, and execute it:"*

```
javac resources/ResourceTest.java
jar cvfe ResourceTest.jar resources.ResourceTest \
    resources/*.class resources/*.gif resources/data/*.txt corejava/*.txt
java -jar ResourceTest.jar
```

> *"Move the JAR file to a different directory and run it again to check that the program reads the resource files from the JAR file, not from the current directory."*

**Dịch:** **Chuyển file JAR sang thư mục khác rồi chạy lại** để kiểm tra chương trình **đọc file resource từ trong JAR**, **không phải từ thư mục hiện tại**.

### Listing 5.16 — `resources/ResourceTest.java`

```java
package resources;

import java.io.*;
import java.net.*;
import javax.swing.*;

/**
 * @version 1.51 2023-08-16
 * @author Cay Horstmann
 */
public class ResourceTest
{
    public static void main(String[] args) throws IOException
    {
        Class cl = ResourceTest.class;
        URL aboutURL = cl.getResource("about.gif");
        var icon = new ImageIcon(aboutURL);

        InputStream stream = cl.getResourceAsStream("data/about.txt");
        var about = new String(stream.readAllBytes());

        InputStream stream2 = cl.getResourceAsStream("/corejava/title.txt");
        var title = new String(stream2.readAllBytes()).strip();

        JOptionPane.showMessageDialog(null, about, title, JOptionPane.INFORMATION_MESSAGE, icon);
    }
}
```

## API — `java.lang.Class` (Java 1.0)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `URL getResource(String name)` *(1.1)*<br>`InputStream getResourceAsStream(String name)` *(1.1)* | **Tìm resource ở cùng nơi với class** rồi trả về **một `URL` hoặc input stream** để nạp resource. Trả về **`null` nếu không tìm thấy resource**, nên **không ném exception cho lỗi I/O**. |

---

## 5.10.4. Using Reflection to Analyze the Capabilities of Classes

> *"Here is a brief overview of the most important parts of the reflection mechanism for letting you examine the structure of a class."*

> *"The three classes Field, Method, and Constructor in the java.lang.reflect package describe the fields, methods, and constructors of a class, respectively. All three classes have a method called getName that returns the name of the item. The Field class has a method getType that returns an object, again of type Class, that describes the field type. The Method and Constructor classes have methods to report the types of the parameters, and the Method class also reports the return type."*

**Dịch:** Ba class **`Field`, `Method`, `Constructor`** trong package `java.lang.reflect` lần lượt mô tả **field, method và constructor của một class**. **Cả ba class đều có method `getName`** trả về **tên của mục đó**. Class `Field` có method **`getType`** trả về **một object (cũng kiểu `Class`) mô tả kiểu của field**. Class `Method` và `Constructor` có method **báo cáo kiểu của các parameter**, và `Method` **còn báo cả kiểu trả về**.

> *"All three of these classes also have a method called getModifiers that returns an integer, with various bits turned on and off, that describes the modifiers used, such as public and static. You can then use the static methods in the Modifier class in the java.lang.reflect package to analyze the integer that getModifiers returns. Use methods like isPublic, isPrivate, or isFinal in the Modifier class to tell whether a method or constructor was public, private, or final. All you have to do is have the appropriate method in the Modifier class work on the integer that getModifiers returns. You can also use the Modifier.toString method to print the modifiers."*

**Dịch:** Cả ba class cũng có method **`getModifiers`** trả về **một số nguyên, với các bit bật/tắt khác nhau**, mô tả **các modifier được dùng** như `public` và `static`. Bạn dùng **static method trong class `Modifier`** (ở package `java.lang.reflect`) để **phân tích số nguyên đó**: `isPublic`, `isPrivate`, `isFinal`... Bạn cũng dùng được **`Modifier.toString` để in các modifier**.

> *"Alternatively, the accessFlags method returns a set of values of the AccessFlag enumeration. For example, here is how you can test whether a method is static:"*

```java
if (Modifiers.isStatic(m.getModifiers())) . . .
if (m.accessFlags().contains(AccessFlag.STATIC)) . . .
```

**Dịch:** Hoặc, method **`accessFlags`** trả về **một tập giá trị của enumeration `AccessFlag`**.

> *"The getFields, getMethods, and getConstructors methods of the Class class return arrays of the public fields, methods, and constructors that the class supports. This includes public members of superclasses. The getDeclaredFields, getDeclaredMethods, and getDeclaredConstructors methods of the Class class return arrays consisting of all fields, methods, and constructors that are declared in the class. This includes private, package, and protected members, as well as members with package access, but not members of superclasses."*

**Dịch:** Các method **`getFields`, `getMethods`, `getConstructors`** của class `Class` trả về **mảng các field, method, constructor `public`** mà class hỗ trợ — **bao gồm cả public member của superclass**. Các method **`getDeclaredFields`, `getDeclaredMethods`, `getDeclaredConstructors`** trả về **mảng gồm mọi field, method, constructor được khai báo trong chính class đó** — bao gồm **member `private`, package, và `protected`**, cũng như **member có [[08 - Packages|package access]]**, **nhưng không gồm member của superclass**.

> *"Listing 5.17 shows you how to print out all information about a class. The program prompts you for the name of a class and writes out the signatures of all methods and constructors as well as the names of all instance fields of a class. For example, if you enter"*

```
java.lang.Double
```

> *"the program prints"*

```java
public final class java.lang.Double extends java.lang.Number
{
    public java.lang.Double(double);
    public java.lang.Double(java.lang.String);
    public boolean equals(java.lang.Object);
    public static java.lang.String toString(double);
    public java.lang.String toString();
    public static int hashCode(double);
    public int hashCode();
    public static double min(double, double);
    public static double max(double, double);
    public static native long doubleToRawLongBits(double);
    public static long doubleToLongBits(double);
    public static native double longBitsToDouble(long);
    public int compareTo(java.lang.Double);
    public volatile int compareTo(java.lang.Object);
    public static int compare(double, double);
    public byte byteValue();
    public short shortValue();
    public int intValue();
    public long longValue();
    public float floatValue();
    public double doubleValue();
    public static java.lang.Double valueOf(java.lang.String);
    public static java.lang.Double valueOf(double);
    public static java.lang.String toHexString(double);
    public volatile java.lang.Object resolveConstantDesc(
        java.lang.invoke.MethodHandles$Lookup);
    public java.lang.Double resolveConstantDesc(java.lang.invoke.MethodHandles$Lookup);
    public java.util.Optional describeConstable();
    public boolean isNaN();
    public static boolean isNaN(double);
    public static double sum(double, double);
    public boolean isInfinite();
    public static boolean isInfinite(double);
    public static boolean isFinite(double);
    public static double parseDouble(java.lang.String);
    public static final double POSITIVE_INFINITY;
    public static final double NEGATIVE_INFINITY;
    public static final double NaN;
    public static final double MAX_VALUE;
    public static final double MIN_NORMAL;
    public static final double MIN_VALUE;
    public static final int MAX_EXPONENT;
    public static final int MIN_EXPONENT;
    public static final int SIZE;
    public static final int BYTES;
    public static final java.lang.Class TYPE;
    private final double value;
    private static final long serialVersionUID;
}
```

> *"What is remarkable about this program is that it can analyze any class that the Java interpreter can load, not just the classes that were available when the program was compiled. We will use this program in the next chapter to peek inside the inner classes that the Java compiler generates automatically."*

**Dịch:** Điều **đáng chú ý** ở chương trình này: nó **phân tích được bất kỳ class nào mà trình thông dịch Java nạp được**, **không chỉ các class có sẵn lúc chương trình được biên dịch**. Chương sau sẽ dùng chương trình này để **ngó vào các inner class mà compiler Java tự sinh ra**.

### Listing 5.17 — `reflection/ReflectionTest.java`

```java
package reflection;

import java.util.*;
import java.lang.reflect.*;

/**
 * This program uses reflection to print all features of a class.
 * @version 1.12 2021-06-15
 * @author Cay Horstmann
 */
public class ReflectionTest
{
    public static void main(String[] args)
        throws ReflectiveOperationException
    {
        // read class name from command line args or user input
        String name;
        if (args.length > 0) name = args[0];
        else
        {
            var in = new Scanner(System.in);
            System.out.println("Enter class name (e.g. java.util.Date): ");
            name = in.next();
        }

        // print class modifiers, name, and superclass name (if != Object)
        Class cl = Class.forName(name);
        String modifiers = Modifier.toString(cl.getModifiers());
        if (modifiers.length() > 0) System.out.print(modifiers + " ");
        if (cl.isSealed())
            System.out.print("sealed ");
        if (cl.isEnum())
            System.out.print("enum " + name);
        else if (cl.isRecord())
            System.out.print("record " + name);
        else if (cl.isInterface())
            System.out.print("interface " + name);
        else
            System.out.print("class " + name);
        Class supercl = cl.getSuperclass();
        if (supercl != null && supercl != Object.class) System.out.print(" extends "
            + supercl.getName());

        printInterfaces(cl);
        printPermittedSubclasses(cl);

        System.out.print("\n{\n");
        printConstructors(cl);
        System.out.println();
        printMethods(cl);
        System.out.println();
        printFields(cl);
        System.out.println("}");
    }

    /**
     * Prints all constructors of a class
     * @param cl a class
     */
    public static void printConstructors(Class cl)
    {
        Constructor[] constructors = cl.getDeclaredConstructors();

        for (Constructor c : constructors)
        {
            String name = c.getName();
            System.out.print("   ");
            String modifiers = Modifier.toString(c.getModifiers());
            if (modifiers.length() > 0) System.out.print(modifiers + " ");
            System.out.print(name + "(");

            // print parameter types
            Class[] paramTypes = c.getParameterTypes();
            for (int j = 0; j < paramTypes.length; j++)
            {
                if (j > 0) System.out.print(", ");
                System.out.print(paramTypes[j].getName());
            }
            System.out.println(");");
        }
    }

    /**
     * Prints all methods of a class
     * @param cl a class
     */
    public static void printMethods(Class cl)
    {
        Method[] methods = cl.getDeclaredMethods();

        for (Method m : methods)
        {
            Class retType = m.getReturnType();
            String name = m.getName();

            System.out.print("   ");
            // print modifiers, return type and method name
            String modifiers = Modifier.toString(m.getModifiers());
            if (modifiers.length() > 0) System.out.print(modifiers + " ");
            System.out.print(retType.getName() + " " + name + "(");

            // print parameter types
            Class[] paramTypes = m.getParameterTypes();
            for (int j = 0; j < paramTypes.length; j++)
            {
                if (j > 0) System.out.print(", ");
                System.out.print(paramTypes[j].getName());
            }
            System.out.println(");");
        }
    }

    /**
     * Prints all fields of a class
     * @param cl a class
     */
    public static void printFields(Class cl)
    {
        Field[] fields = cl.getDeclaredFields();

        for (Field f : fields)
        {
            Class type = f.getType();
            String name = f.getName();
            System.out.print("   ");
            String modifiers = Modifier.toString(f.getModifiers());
            if (modifiers.length() > 0) System.out.print(modifiers + " ");
            System.out.println(type.getName() + " " + name + ";");
        }
    }

    /**
     * Prints all permitted subtypes of a sealed class
     * @param cl a class
     */
    public static void printPermittedSubclasses(Class cl)
    {
        if (cl.isSealed())
        {
            Class<?>[] permittedSubclasses = cl.getPermittedSubclasses();
            for (int i = 0; i < permittedSubclasses.length; i++)
            {
                if (i == 0)
                    System.out.print(" permits ");
                else
                    System.out.print(", ");
                System.out.print(permittedSubclasses[i].getName());
            }
        }
    }

    /**
     * Prints all directly implemented interfaces of a class
     * @param cl a class
     */
    public static void printInterfaces(Class cl)
    {
        Class<?>[] interfaces = cl.getInterfaces();
        for (int i = 0; i < interfaces.length; i++)
        {
            if (i == 0)
                System.out.print(cl.isInterface() ? " extends " : " implements ");
            else
                System.out.print(", ");
            System.out.print(interfaces[i].getName());
        }
    }
}
```

## API — `java.lang.Class` (Java 1.0)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `Field[] getFields()` *(1.1)*<br>`Field[] getDeclaredFields()` *(1.1)* | `getFields` trả về mảng object `Field` cho **các field `public` của class này hoặc superclass của nó**; `getDeclaredFields` trả về mảng object `Field` cho **mọi field của class này**. Trả về **mảng độ dài 0** nếu **không có field nào** hoặc **object `Class` đại diện cho primitive type hay kiểu mảng**. |
| `Method[] getMethods()` *(1.1)*<br>`Method[] getDeclaredMethods()` *(1.1)* | Trả về mảng object `Method`: `getMethods` trả về **method `public` và bao gồm method kế thừa**; `getDeclaredMethods` trả về **mọi method của class/interface này nhưng không bao gồm method kế thừa**. |
| `Constructor[] getConstructors()` *(1.1)*<br>`Constructor[] getDeclaredConstructors()` *(1.1)* | Trả về mảng object `Constructor` cho **mọi constructor `public`** (`getConstructors`) hoặc **mọi constructor** (`getDeclaredConstructors`) của class mà object `Class` này đại diện. |
| `isInterface()` | Trả về `true` nếu object `Class` này **mô tả một interface**. |
| `isEnum()` *(1.5)* | Trả về `true` nếu object `Class` này **mô tả một `enum`**. |
| `isRecord()` *(16)* | Trả về `true` nếu object `Class` này **mô tả một [[07 - Records\|record]]**. |
| `RecordComponent[] getRecordComponents()` *(16)* | Trả về mảng object `RecordComponent` **mô tả các field của record**, hoặc **`null` nếu class này không phải record**. |
| `String getPackageName()` *(9)* | Lấy **tên package chứa kiểu này**, hoặc **package của kiểu phần tử nếu đây là kiểu mảng**, hoặc **`"java.lang"` nếu đây là primitive type**. |

## API — `java.lang.reflect.Field` / `Method` / `Constructor` (Java 1.1)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `Class getDeclaringClass()` | Trả về **object `Class` cho class định nghĩa constructor, method, hoặc field này**. |
| `Class[] getExceptionTypes()` *(trong `Constructor` và `Method`)* | Trả về mảng object `Class` đại diện **các kiểu exception mà method ném ra**. |
| `int getModifiers()` | Trả về **một số nguyên mô tả các modifier** của constructor, method, hoặc field này. Dùng method trong class `Modifier` để phân tích giá trị trả về. |
| `Set<AccessFlag> accessFlags()` *(20)* | Trả về **tập giá trị trong enumeration `AccessFlag`** mô tả **access modifier** của constructor, method, hoặc field này. |
| `String getName()` | Trả về **string là tên của constructor, method, hoặc field**. |
| `Class[] getParameterTypes()` *(trong `Constructor` và `Method`)* | Trả về mảng object `Class` đại diện **các kiểu của parameter**. |
| `Class getReturnType()` *(trong `Method`)* | Trả về object `Class` đại diện **kiểu trả về**. |

## API — `java.lang.reflect.RecordComponent` (Java 16)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `String getName()`<br>`Class getType()` | Lấy **tên và kiểu của record component này**. |
| `Method getAccessor()` | Trả về **object `Method` để truy cập record component này**. |

## API — `java.lang.reflect.Modifier` (Java 1.1)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `static String toString(int modifiers)` | Trả về **string chứa các modifier ứng với các bit được bật trong `modifiers`**. |
| `static boolean isAbstract(int modifiers)`<br>`static boolean isFinal(int modifiers)`<br>`static boolean isInterface(int modifiers)`<br>`static boolean isNative(int modifiers)`<br>`static boolean isPrivate(int modifiers)`<br>`static boolean isProtected(int modifiers)`<br>`static boolean isPublic(int modifiers)`<br>`static boolean isStatic(int modifiers)`<br>`static boolean isStrict(int modifiers)`<br>`static boolean isSynchronized(int modifiers)`<br>`static boolean isVolatile(int modifiers)` | **Kiểm tra bit trong giá trị `modifiers` ứng với modifier có tên trong tên method.** |

---

## 5.10.5. Using Reflection to Analyze Objects at Runtime

> *"In the preceding section, we saw how we can find out the names and types of the instance fields of any object:"*
> *"Get the corresponding Class object."*
> *"Call getDeclaredFields on the Class object."*

**Dịch:** Phần trước cho thấy cách **tìm ra tên và kiểu của instance field của bất kỳ object nào**: **lấy object `Class` tương ứng**, rồi **gọi `getDeclaredFields`** trên nó.

> *"In this section, we will go one step further and actually look at the contents of the fields. Of course, it is easy to look at the contents of a specific field of an object whose name and type are known when you write a program. But reflection lets you look at fields of objects that were not known at compile time."*

**Dịch:** Phần này **đi thêm một bước**: **thực sự nhìn vào nội dung của các field**. Reflection cho phép bạn **xem field của những object chưa biết lúc compile time**.

> *"The key method to achieve this is the get method in the Field class. If f is an object of type Field (for example, one obtained from getDeclaredFields) and obj is an object of the class of which f is a field, then f.get(obj) returns an object whose value is the current value of the field of obj. This is all a bit abstract, so let's run through an example."*

```java
var harry = new Employee("Harry Hacker", 50000, 10, 1, 1989);
Class cl = harry.getClass();
    // the class object representing Employee
Field f = cl.getDeclaredField("name");
    // the name field of the Employee class
Object v = f.get(harry);
    // the value of the name field of the harry object, i.e.,
    // the String object "Harry Hacker"
```

**Dịch:** Method then chốt là **`get` trong class `Field`**. Nếu `f` là object kiểu `Field` và `obj` là object của class mà `f` là một field, thì **`f.get(obj)` trả về một object có giá trị là giá trị hiện tại của field đó trên `obj`**.

> *"Of course, you can also set the values that you can get. The call f.set(obj, value) sets the field represented by f of the object obj to the new value."*

**Dịch:** Dĩ nhiên bạn cũng **set được những giá trị mà bạn get được**: `f.set(obj, value)` **đặt field do `f` đại diện, trên object `obj`, thành giá trị mới**.

> *"Actually, there is a problem with this code. Since the name field is a private field, the get and set methods will throw an IllegalAccessException. You can only use get and set with accessible fields. The security mechanism of Java lets you find out what fields an object has, but it won't let you read and write the values of those fields unless you have permission."*

**Dịch:** Thực ra đoạn code trên **có vấn đề**: vì `name` là **private field**, `get` và `set` **sẽ ném `IllegalAccessException`**. Bạn **chỉ dùng được `get`/`set` với field truy cập được**. Cơ chế bảo mật của Java **cho bạn biết object có những field nào**, nhưng **không cho bạn đọc/ghi giá trị các field đó trừ khi bạn có quyền**.

> *"The default behavior of the reflection mechanism is to respect Java access control. However, you can override access control by invoking the setAccessible method on a Field, Method, or Constructor object. For example:"*

```java
f.setAccessible(true); // now OK to call f.get(harry)
```

**Dịch:** Hành vi mặc định của reflection là **tôn trọng access control của Java**. Nhưng bạn **ghi đè được access control** bằng cách gọi **`setAccessible`** trên một object `Field`, `Method`, hoặc `Constructor`.

> *"The setAccessible method is a method of the AccessibleObject class, the common superclass of the Field, Method, and Constructor classes. This feature is provided for debuggers, persistent storage, and similar mechanisms. We will use it for a generic toString method later in this section."*

**Dịch:** `setAccessible` là method của class **`AccessibleObject`** — **superclass chung của `Field`, `Method`, `Constructor`**. Tính năng này **dành cho debugger, lưu trữ bền vững, và các cơ chế tương tự**.

> *"The call to setAccessible throws an exception if the access is not granted. The access can be denied by the module system (Chapter 12) or a security manager (Chapter 9 of Volume II). The use of security managers is not common, and they are deprecated since Java 17."*

**Dịch:** Lời gọi `setAccessible` **ném exception nếu quyền truy cập không được cấp**. Quyền có thể bị từ chối bởi **module system** (chương 12) hoặc **security manager**. Việc dùng security manager **không phổ biến**, và chúng **deprecated từ Java 17**.

> *"For example, the sample program at the end of this section looks into the internals of ArrayList and Integer objects. When you run it with Java 9 to Java 16, the following ominous message appears:"*

```
WARNING: An illegal reflective access operation has occurred
WARNING: Illegal reflective access by objectAnalyzer.ObjectAnalyzer (file:/home/cay
    /books/cj11/code/v1ch05/bin/) to field java.util.ArrayList.serialVersionUID
WARNING: Please consider reporting this to the maintainers of objectAnalyzer.ObjectAnalyzer
WARNING: Use --illegal-access=warn to enable warnings of further illegal
    reflective access operations
WARNING: All illegal access operations will be denied in a future release
```

> *"When you run the program with Java 17, an InaccessibleObjectException exception occurs."*

**Dịch:** Chạy chương trình mẫu ở cuối phần này với **Java 9 tới Java 16** thì hiện **thông báo đầy điềm gở** ở trên. Chạy với **Java 17** thì **sinh exception `InaccessibleObjectException`**.

> *"To keep the program running, "open" the java.util and java.lang packages in the java.base module to the "unnamed module." The details are in Chapter 12. Here is the syntax:"*

```
java --add-opens java.base/java.util=ALL-UNNAMED \
    --add-opens java.base/java.lang=ALL-UNNAMED \
    objectAnalyzer.ObjectAnalyzerTest
```

**Dịch:** Để chương trình **vẫn chạy được**, hãy **"mở" package `java.util` và `java.lang` trong module `java.base` cho "unnamed module"**.

> **Note (sách):** *"It is possible that future libraries will use variable handles instead of reflection for reading and writing fields. A VarHandle is similar to a Field. You can use it to read or write a specific field of any instance of a specific class. However, to obtain a VarHandle, the library code needs a Lookup object:"*
>
> ```java
> public Object getFieldValue(Object obj, String fieldName, Lookup lookup)
>     throws NoSuchFieldException, IllegalAccessException
> {
>     Class cl = obj.getClass();
>     Field field = cl.getDeclaredField(fieldName);
>     VarHandle handle = MethodHandles.privateLookupIn(cl, lookup)
>         .unreflectVarHandle(field);
>     return handle.get(obj);
> }
> ```
>
> *"This works provided the Lookup object is generated in the module that has the permission to access the field. Some method in the module simply calls MethodHandles.lookup(), which yields an object encapsulating the access rights of the caller. In this way, one module can give permission for accessing private members to another module. The practical issue is how those permissions can be given with a minimum of hassle."*
>
> **Dịch:** **Có thể các library tương lai sẽ dùng variable handle thay cho reflection** để đọc/ghi field. Một **`VarHandle` tương tự một `Field`**: dùng nó để **đọc hoặc ghi một field cụ thể của bất kỳ instance nào của một class cụ thể**. Nhưng để **lấy được `VarHandle`**, code library **cần một object `Lookup`**. Cách này chạy được **miễn là object `Lookup` được sinh ra trong module có quyền truy cập field đó**. Một method nào đó trong module **chỉ cần gọi `MethodHandles.lookup()`**, cho ra **một object đóng gói quyền truy cập của người gọi**. Bằng cách này, **một module cấp được quyền truy cập private member cho module khác**. **Vấn đề thực tế** là **làm sao cấp các quyền đó với ít phiền toái nhất**.

> *"While we can still do so, let us look at a generic toString method that works for any class (see Listing 5.18). The generic toString method uses getDeclaredFields to obtain all instance fields and the setAccessible convenience method to make all fields accessible. For each field, it obtains the name and the value. Each value is turned into a string by recursively invoking toString."*

**Dịch:** **Trong lúc còn làm được**, hãy xem một **method `toString` generic chạy được cho mọi class**. Nó dùng **`getDeclaredFields` để lấy mọi instance field** và **method tiện lợi `setAccessible` để làm mọi field truy cập được**. Với mỗi field, nó **lấy tên và giá trị**; mỗi giá trị được **biến thành string bằng cách gọi đệ quy `toString`**.

> *"The generic toString method needs to address a couple of complexities. Cycles of references could cause an infinite recursion. Therefore, the ObjectAnalyzer keeps track of objects that were already visited. Also, to peek inside arrays, you need a different approach. You'll learn about the details in the next section."*

**Dịch:** Method `toString` generic phải **xử lý vài chỗ phức tạp**: **chu trình reference có thể gây đệ quy vô hạn**, nên `ObjectAnalyzer` **theo dõi các object đã ghé thăm**. Ngoài ra, để **ngó vào bên trong mảng** thì cần **cách tiếp cận khác**.

> *"You can use this toString method to peek inside any object. For example, the call"*

```java
var squares = new ArrayList<Integer>();
for (int i = 1; i <= 5; i++) squares.add(i * i);
System.out.println(new ObjectAnalyzer().toString(squares));
```

> *"yields the printout"*

```
java.util.ArrayList[elementData=class java.lang.Object[]
{java.lang.Integer[value=1][][],
java.lang.Integer[value=4][][],java.lang.Integer[value=9][][],
java.lang.Integer[value=16][][],
java.lang.Integer[value=25][][],null,null,null,null,null},size=5][modCount=5][][]
```

> *"You can use this generic toString method to implement the toString methods of your own classes, like this:"*

```java
public String toString()
{
    return new ObjectAnalyzer().toString(this);
}
```

> *"This is a hassle-free and undoubtedly useful method for supplying a universal toString method. However, before you get too excited about never having to implement toString again, remember that the days of uncontrolled access to internals are numbered."*

**Dịch:** Đây là **cách không phiền toái và chắc chắn hữu ích** để có một **`toString` phổ quát**. Nhưng **trước khi bạn quá hào hứng** rằng sẽ không bao giờ phải cài `toString` nữa, hãy nhớ rằng **những ngày tháng truy cập nội bộ không kiểm soát đã đếm được trên đầu ngón tay**.

### Listing 5.18 — `objectAnalyzer/ObjectAnalyzerTest.java`

```java
package objectAnalyzer;

import java.util.*;

/**
 * This program uses reflection to spy on objects.
 * @version 1.13 2018-03-16
 * @author Cay Horstmann
 */
public class ObjectAnalyzerTest
{
    public static void main(String[] args)
        throws ReflectiveOperationException
    {
        var squares = new ArrayList<Integer>();
        for (int i = 1; i <= 5; i++)
            squares.add(i * i);
        System.out.println(new ObjectAnalyzer().toString(squares));
    }
}
```

### Listing 5.19 — `objectAnalyzer/ObjectAnalyzer.java`

```java
package objectAnalyzer;

import java.lang.reflect.AccessibleObject;
import java.lang.reflect.Array;
import java.lang.reflect.Field;
import java.lang.reflect.Modifier;
import java.util.ArrayList;

public class ObjectAnalyzer
{
    private ArrayList<Object> visited = new ArrayList<>();

    /**
     * Converts an object to a string representation that lists all fields.
     * @param obj an object
     * @return a string with the object's class name and all field names and values
     */
    public String toString(Object obj)
        throws ReflectiveOperationException
    {
        if (obj == null) return "null";
        if (visited.contains(obj)) return "...";
        visited.add(obj);
        Class cl = obj.getClass();
        if (cl == String.class) return (String) obj;
        if (cl.isArray())
        {
            String r = cl.getComponentType() + "[]{";
            for (int i = 0; i < Array.getLength(obj); i++)
            {
                if (i > 0) r += ",";
                Object val = Array.get(obj, i);
                if (cl.getComponentType().isPrimitive()) r += val;
                else r += toString(val);
            }
            return r + "}";
        }

        String r = cl.getName();
        // inspect the fields of this class and all superclasses
        do
        {
            r += "[";
            Field[] fields = cl.getDeclaredFields();
            AccessibleObject.setAccessible(fields, true);
            // get the names and values of all fields
            for (Field f : fields)
            {
                if (!Modifier.isStatic(f.getModifiers()))
                {
                    if (!r.endsWith("[")) r += ",";
                    r += f.getName() + "=";
                    Class t = f.getType();
                    Object val = f.get(obj);
                    if (t.isPrimitive()) r += val;
                    else r += toString(val);
                }
            }
            r += "]";
            cl = cl.getSuperclass();
        }
        while (cl != null);

        return r;
    }
}
```

## API — `java.lang.reflect.AccessibleObject` (Java 1.2)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `void setAccessible(boolean flag)` | **Đặt hoặc xoá cờ accessibility** cho accessible object này, hoặc **ném `IllegalAccessException` nếu quyền truy cập bị từ chối**. |
| `boolean trySetAccessible()` *(9)* | Đặt cờ accessibility cho object này, hoặc **trả về `false` nếu quyền truy cập bị từ chối**. |
| `boolean canAccess(Object obj)` *(9)* | Kiểm tra **người gọi có truy cập được `obj` qua field/method/constructor object này không**. Truyền **`null` cho static field hoặc static method, hoặc cho constructor**. |
| `static void setAccessible(AccessibleObject[] array, boolean flag)` | Method **tiện lợi để đặt cờ accessibility cho cả một mảng object**. |

## API — `java.lang.Class` (Java 1.1)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `Field getField(String name)`<br>`Field[] getFields()` | Lấy **field `public` mang tên cho trước**, hoặc **mảng mọi field**. |
| `Field getDeclaredField(String name)`<br>`Field[] getDeclaredFields()` | Lấy **field được khai báo trong class này mang tên cho trước**, hoặc **mảng mọi field**. |

## API — `java.lang.reflect.Field` (Java 1.1)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `Object get(Object obj)` | Lấy **giá trị của field mà object `Field` này mô tả, trong object `obj`**. |
| `void set(Object obj, Object newValue)` | Đặt **field mà object `Field` này mô tả, trong object `obj`, thành giá trị mới**. |

---

## 5.10.6. Using Reflection to Write Generic Array Code

> *"The Array class in the java.lang.reflect package allows you to create arrays dynamically. This is used, for example, in the implementation of the copyOf method in the Arrays class. Recall how this method can be used to grow an array that has become full."*

```java
var a = new Employee[100];
. . .
// array is full
a = Arrays.copyOf(a, 2 * a.length);
```

**Dịch:** Class **`Array`** trong package `java.lang.reflect` cho phép **tạo mảng một cách động**. Nó được dùng, chẳng hạn, trong bản cài method **`copyOf`** của class `Arrays` — dùng để **làm lớn một mảng đã đầy**.

> *"How can one write such a generic method? It helps that an Employee[] array can be converted to an Object[] array. That sounds promising. Here is a first attempt:"*

```java
public static Object[] badCopyOf(Object[] a, int newLength) // not useful
{
    var newArray = new Object[newLength];
    System.arraycopy(a, 0, newArray, 0, Math.min(a.length, newLength));
    return newArray;
}
```

**Dịch:** Viết một method generic như vậy thế nào? Có ích ở chỗ **mảng `Employee[]` chuyển được thành mảng `Object[]`**. Nghe hứa hẹn. Đây là **thử nghiệm đầu tiên**.

> *"However, there is a problem with actually using the resulting array. The type of array that this code returns is an array of objects (Object[]) because we created the array using the line of code"*

```java
new Object[newLength]
```

> *"An array of objects cannot be cast to an array of employees (Employee[]). The virtual machine would generate a ClassCastException at runtime. The point is that, as mentioned earlier, a Java array remembers the type of its entries—that is, the element type used in the new expression that created it. It is legal to cast an Employee[] temporarily to an Object[] array and then cast it back, but an array that started its life as an Object[] array can never be cast into an Employee[] array."*

**Dịch:** Nhưng **có vấn đề khi thực sự dùng mảng kết quả**: kiểu mảng mà đoạn code này trả về là **mảng object (`Object[]`)**, vì ta tạo mảng bằng `new Object[newLength]`. **Mảng object không cast được thành mảng employee (`Employee[]`)** — virtual machine **sẽ sinh `ClassCastException` lúc runtime**. Mấu chốt: **mảng Java nhớ kiểu các phần tử của nó** — tức **kiểu phần tử dùng trong biểu thức `new` tạo ra nó**. **Hợp lệ** khi cast tạm một `Employee[]` thành `Object[]` rồi cast ngược lại, nhưng **một mảng khởi đời là `Object[]` thì không bao giờ cast thành `Employee[]` được**.

> *"To write this kind of generic array code, we need to be able to make a new array of the same type as the original array. For this, we need the methods of the Array class in the java.lang.reflect package. The key is the static newInstance method of the Array class that constructs a new array. You must supply the type for the entries and the desired length as arguments to this method."*

```java
Object newArray = Array.newInstance(componentType, newLength);
```

**Dịch:** Để viết loại code mảng generic này, ta cần **tạo được một mảng mới cùng kiểu với mảng gốc**. Chìa khoá là static method **`newInstance` của class `Array`**: bạn phải **cung cấp kiểu phần tử và độ dài mong muốn** làm argument.

> *"To actually carry this out, we need to get the length and the component type of the new array."*

> *"We obtain the length by calling Array.getLength(a). The static getLength method of the Array class returns the length of an array. To get the component type of the new array:"*

> *"1. First, get the class object of a."*
> *"2. Confirm that it is indeed an array."*
> *"3. Use the getComponentType method of the Class class (which is defined only for class objects that represent arrays) to find the right type for the array."*
> *"4. Conversely, for any Class object representing a class C, the arrayType method yields the Class object representing C[]."*

**Dịch:** Ta lấy độ dài bằng **`Array.getLength(a)`**. Để lấy **component type** của mảng mới:

| # | Bước |
|---|---|
| 1 | Lấy **class object của `a`** |
| 2 | **Xác nhận nó đúng là một mảng** |
| 3 | Dùng **`getComponentType` của class `Class`** (chỉ được định nghĩa cho class object đại diện cho mảng) để **tìm đúng kiểu cho mảng** |
| 4 | Ngược lại, với mọi object `Class` đại diện cho class `C`, method **`arrayType`** cho ra **object `Class` đại diện cho `C[]`** |

> *"Why is getLength a method of Array but getComponentType a method of Class? I don't know—the distribution of the reflection methods seems a bit ad hoc at times."*

**Dịch:** **Vì sao `getLength` là method của `Array` mà `getComponentType` lại là method của `Class`?** Tác giả **không biết** — **cách phân bố các method reflection đôi lúc trông khá tuỳ tiện**.

> *"Here's the code:"*

```java
public static Object goodCopyOf(Object a, int newLength)
{
    Class cl = a.getClass();
    if (!cl.isArray()) return null;
    Class componentType = cl.getComponentType();
    int length = Array.getLength(a);
    Object newArray = Array.newInstance(componentType, newLength);
    System.arraycopy(a, 0, newArray, 0, Math.min(length, newLength));
    return newArray;
}
```

> *"Note that this copyOf method can be used to grow arrays of any type, not just arrays of objects."*

```java
int[] a = { 1, 2, 3, 4, 5 };
a = (int[]) goodCopyOf(a, 10);
```

> *"To make this possible, the parameter of goodCopyOf is declared to be of type Object, not an array of objects (Object[]). The integer array type int[] can be converted to an Object, but not to an array of objects!"*

**Dịch:** Method `copyOf` này **dùng được để làm lớn mảng thuộc bất kỳ kiểu nào**, **không chỉ mảng object**. Để làm được thế, parameter của `goodCopyOf` **được khai báo kiểu `Object`**, **không phải mảng object (`Object[]`)**. Kiểu mảng số nguyên `int[]` **chuyển được thành `Object`, nhưng không chuyển thành mảng object được!**

> *"Listing 5.20 shows both methods in action. Note that the cast of the return value of badCopyOf will throw an exception."*

### Listing 5.20 — `arrays/CopyOfTest.java`

```java
package arrays;

import java.lang.reflect.*;
import java.util.*;

/**
 * This program demonstrates the use of reflection for manipulating arrays.
 * @version 1.2 2012-05-04
 * @author Cay Horstmann
 */
public class CopyOfTest
{
    public static void main(String[] args)
    {
        int[] a = { 1, 2, 3 };
        a = (int[]) goodCopyOf(a, 10);
        System.out.println(Arrays.toString(a));

        String[] b = { "Tom", "Dick", "Harry" };
        b = (String[]) goodCopyOf(b, 10);
        System.out.println(Arrays.toString(b));

        System.out.println("The following call will generate an exception.");
        b = (String[]) badCopyOf(b, 10);
    }

    /**
     * This method attempts to grow an array by allocating a new array and
     * copying all elements.
     * @param a the array to grow
     * @param newLength the new length
     * @return a larger array that contains all elements of a. However, the returned
     * array has type Object[], not the same type as a
     */
    public static Object[] badCopyOf(Object[] a, int newLength) // not useful
    {
        var newArray = new Object[newLength];
        System.arraycopy(a, 0, newArray, 0, Math.min(a.length, newLength));
        return newArray;
    }

    /**
     * This method grows an array by allocating a new array of the same type and
     * copying all elements.
     * @param a the array to grow. This can be an object array or a primitive
     * type array
     * @return a larger array that contains all elements of a
     */
    public static Object goodCopyOf(Object a, int newLength)
    {
        Class cl = a.getClass();
        if (!cl.isArray()) return null;
        Class componentType = cl.getComponentType();
        int length = Array.getLength(a);
        Object newArray = Array.newInstance(componentType, newLength);
        System.arraycopy(a, 0, newArray, 0, Math.min(length, newLength));
        return newArray;
    }
}
```

## API — `java.lang.Class` (Java 1.1)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `boolean isArray()` | Trả về `true` nếu object này **đại diện cho một kiểu mảng**. |
| `Class getComponentType()`<br>`Class componentType()` *(12)* | Trả về `Class` mô tả **component type** nếu object này đại diện cho kiểu mảng, **ngược lại trả về `null`**. |
| `Class arrayType()` *(12)* | Trả về `Class` mô tả **kiểu mảng có component type do object này đại diện**. |

## API — `java.lang.reflect.Array` (Java 1.1)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `static Object get(Object array, int index)`<br>`static xxx getXxx(Object array, int index)` | (`xxx` là một trong các primitive type `boolean`, `byte`, `char`, `double`, `float`, `int`, `long`, `short`.) Các method này **trả về giá trị của mảng cho trước lưu tại index cho trước**. |
| `static void set(Object array, int index, Object newValue)`<br>`static setXxx(Object array, int index, xxx newValue)` | (`xxx` là một trong các primitive type nêu trên.) Các method này **lưu một giá trị mới vào mảng cho trước tại index cho trước**. |
| `static int getLength(Object array)` | Trả về **độ dài của mảng cho trước**. |
| `static Object newInstance(Class componentType, int length)`<br>`static Object newInstance(Class componentType, int[] lengths)` | Trả về **mảng mới có component type cho trước với các chiều cho trước**. |

---

## 5.10.7. Invoking Arbitrary Methods and Constructors

> *"In C and C++, you can execute an arbitrary function through a function pointer. On the surface, Java does not have method pointers—that is, ways of giving the location of a method to another method, so that the second method can invoke it later. In fact, the designers of Java have said that method pointers are dangerous and error-prone, and that Java interfaces and lambda expressions (discussed in the next chapter) are a superior solution. However, the reflection mechanism allows you to call arbitrary methods."*

**Dịch:** Ở C và C++, bạn **thực thi được một hàm bất kỳ qua function pointer**. **Bề ngoài, Java không có method pointer** — tức cách **đưa vị trí của một method cho một method khác** để method thứ hai **gọi nó sau này**. Thực tế, người thiết kế Java **đã nói method pointer nguy hiểm và dễ sinh lỗi**, và **interface cùng lambda expression của Java là giải pháp ưu việt hơn**. Nhưng **cơ chế reflection cho phép bạn gọi method tuỳ ý**.

> *"Recall that you can inspect a field of an object with the get method of the Field class. Similarly, the Method class has an invoke method that lets you call the method that is wrapped in the current Method object. The signature for the invoke method is"*

```java
Object invoke(Object obj, Object... args)
```

> *"The first parameter is the implicit argument, and the remaining objects provide the explicit arguments."*

> *"For a static method, the first argument is ignored—you can set it to null."*

**Dịch:** Tương tự `get` của class `Field`, class `Method` có method **`invoke`** cho phép **gọi method được gói trong object `Method` hiện tại**. Parameter đầu tiên là **[[03 - Defining Your Own Classes|implicit argument]]**, các object còn lại là **explicit argument**. Với **static method**, argument đầu tiên **bị bỏ qua** — **đặt nó là `null`** cũng được.

> *"For example, if m1 represents the getName method of the Employee class, the following code shows how you can call it:"*

```java
String n = (String) m1.invoke(harry);
```

> *"If the return type is a primitive type, the invoke method will return the wrapper type instead. For example, suppose that m2 represents the getSalary method of the Employee class. Then, the returned object is actually a Double, and you must cast it accordingly. Use automatic unboxing to turn it into a double:"*

```java
double s = (Double) m2.invoke(harry);
```

**Dịch:** Nếu **kiểu trả về là primitive type** thì `invoke` **trả về [[04 - Object Wrappers and Autoboxing|wrapper type]] thay thế**. Dùng **auto-unboxing để biến nó thành `double`**.

> *"How do you obtain a Method object? You can, of course, call getDeclaredMethods and search through the returned array of Method objects until you find the method you want. Or, you can call the getMethod method of the Class class. This is similar to the getField method that takes a string with the field name and returns a Field object. However, there may be several methods with the same name, so you need to be careful that you get the right one. For that reason, you must also supply the parameter types of the desired method. The signature of getMethod is"*

```java
Method getMethod(String name, Class... parameterTypes)
```

> *"For example, here is how you can get method pointers to the getName and raiseSalary methods of the Employee class:"*

```java
Method m1 = Employee.class.getMethod("getName");
Method m2 = Employee.class.getMethod("raiseSalary", double.class);
```

**Dịch:** Lấy object `Method` thế nào? Bạn **gọi `getDeclaredMethods` và lục qua mảng trả về**, hoặc **gọi `getMethod` của class `Class`**. Nhưng **có thể có nhiều method cùng tên**, nên phải **cẩn thận để lấy đúng cái** — vì thế **bạn cũng phải cung cấp các kiểu parameter của method mong muốn**.

> *"Use a similar approach for invoking arbitrary constructors. Supply the constructor's parameter types to the Class.getConstructor method, and supply the argument values to the Constructor.newInstance method:"*

```java
Class cl = Scanner.class;
    // or any other class with a constructor that has a String parameter
Constructor cons = cl.getConstructor(String.class);
Object obj = cons.newInstance("Mary had a little lamb");
```

**Dịch:** Dùng **cách tương tự để gọi constructor tuỳ ý**: cung cấp **kiểu parameter của constructor cho `Class.getConstructor`**, và cung cấp **giá trị argument cho `Constructor.newInstance`**.

> **Note (sách):** *"The Method and Constructor classes extend the Executable class. As of Java 17, the Executable class is sealed, permitting only Method and Constructor as subclasses."*
>
> **Dịch:** Class `Method` và `Constructor` **extend class `Executable`**. **Từ Java 17**, `Executable` là **[[08 - Sealed Classes|sealed]]**, **chỉ cho phép `Method` và `Constructor` làm subclass**.

> *"Now that you have seen the rules for using Method objects, let's put them to work. Listing 5.21 is a program that prints a table of values for a mathematical function such as Math.sqrt or Math.sin. The printout looks like this:"*

```
public static native double java.lang.Math.sqrt(double)
    1.0000 |     1.0000
    2.0000 |     1.4142
    3.0000 |     1.7321
    4.0000 |     2.0000
    5.0000 |     2.2361
    6.0000 |     2.4495
    7.0000 |     2.6458
    8.0000 |     2.8284
    9.0000 |     3.0000
   10.0000 |     3.1623
```

> *"The code for printing a table is, of course, independent of the actual function that is being tabulated."*

```java
double dx = (to - from) / (n - 1);
for (double x = from; x <= to; x += dx)
{
    double y = (Double) f.invoke(null, x);
    System.out.printf("%10.4f | %10.4f%n", x, y);
}
```

> *"Here, f is an object of type Method. The first argument of invoke is null because we are calling a static method."*

**Dịch:** Code in bảng **độc lập với hàm thực tế đang được lập bảng**. `f` là object kiểu `Method`; **argument đầu tiên của `invoke` là `null` vì ta đang gọi một static method**.

> *"To tabulate the Math.sqrt function, we set f to"*

```java
Math.class.getMethod("sqrt", double.class)
```

> *"That is the method of the Math class that has the name sqrt and a single parameter of type double."*

**Dịch:** Đó là **method của class `Math` mang tên `sqrt` và có đúng một parameter kiểu `double`**.

### Listing 5.21 — `methods/MethodTableTest.java`

```java
package methods;

import java.lang.reflect.*;

/**
 * This program shows how to invoke methods through reflection.
 * @version 1.2 2012-05-04
 * @author Cay Horstmann
 */
public class MethodTableTest
{
    public static void main(String[] args)
        throws ReflectiveOperationException
    {
        // get method pointers to the square and sqrt methods
        Method square = MethodTableTest.class.getMethod("square", double.class);
        Method sqrt = Math.class.getMethod("sqrt", double.class);

        // print tables of x- and y-values
        printTable(1, 10, 10, square);
        printTable(1, 10, 10, sqrt);
    }

    /**
     * Returns the square of a number
     * @param x a number
     * @return x squared
     */
    public static double square(double x)
    {
        return x * x;
    }

    /**
     * Prints a table with x- and y-values for a method
     * @param from the lower bound for the x-values
     * @param to the upper bound for the x-values
     * @param n the number of rows in the table
     * @param f a method with a double parameter and double return value
     */
    public static void printTable(double from, double to, int n, Method f)
        throws ReflectiveOperationException
    {
        // print out the method as table header
        System.out.println(f);

        double dx = (to - from) / (n - 1);

        for (double x = from; x <= to; x += dx)
        {
            double y = (Double) f.invoke(null, x);
            System.out.printf("%10.4f | %10.4f%n", x, y);
        }
    }
}
```

> *"As this example clearly shows, you can do anything with Method objects that you can do with function pointers in C (or delegates in C#). Just as in C, this style of programming is usually quite inconvenient, and always error-prone. What happens if you invoke a method with the wrong arguments? The invoke method throws an exception."*

**Dịch:** Ví dụ này cho thấy rõ: **bạn làm được với object `Method` mọi thứ bạn làm được với function pointer trong C** (hay delegate trong C#). Cũng như trong C, **lối lập trình này thường khá bất tiện và luôn dễ sinh lỗi**. Gọi method với **sai argument** thì sao? **`invoke` ném exception.**

> *"Also, the parameters and return values of invoke are necessarily of type Object. That means you must cast back and forth a lot. As a result, the compiler is deprived of the chance to check your code, so errors surface only during testing, when they are more tedious to find and fix. Moreover, code that uses reflection to get at method pointers is significantly slower than code that simply calls methods directly."*

**Dịch:** Ngoài ra, parameter và giá trị trả về của `invoke` **nhất thiết có kiểu `Object`**, nghĩa là bạn **phải cast qua lại rất nhiều**. Hệ quả: **compiler bị tước mất cơ hội kiểm tra code của bạn**, nên **lỗi chỉ lộ ra khi kiểm thử**, lúc đó **tìm và sửa mệt hơn**. Hơn nữa, **code dùng reflection để lấy method pointer chậm hơn đáng kể so với code gọi thẳng method**.

> *"For that reason, I suggest that you use Method objects in your own programs only when absolutely necessary. Using interfaces and lambda expressions (the subject of the next chapter) is almost always a better idea."*

**Dịch:** Vì vậy tác giả **khuyên chỉ dùng object `Method` trong chương trình của bạn khi thực sự cần thiết**. **Dùng interface và lambda expression** (chủ đề chương sau) **gần như luôn là ý hay hơn**.

## API — `java.lang.reflect.Method` (Java 1.1)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `public Object invoke(Object obj, Object[] args)` | **Gọi method mà object này mô tả**, truyền các argument cho trước và **trả về giá trị mà method trả về**. Với **static method, truyền `null` làm implicit argument**. **Truyền giá trị primitive type bằng wrapper.** **Giá trị trả về kiểu primitive phải được mở hộp (unwrap).** |

---

## Bài kế tiếp

→ [[11 - Design Hints for Inheritance]] — bảy lời khuyên thiết kế khi dùng inheritance.
