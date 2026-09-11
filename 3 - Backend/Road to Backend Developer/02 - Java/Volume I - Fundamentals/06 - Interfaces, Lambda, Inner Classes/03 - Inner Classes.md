# 03 — Inner Classes

> Chapter 6, Section 6.3 — Core Java Volume I, 13th Edition (Horstmann).
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 6.3. Inner Classes

> *"An inner class is a class that is defined inside another class. Why would you want to do that? There are two reasons:"*
>
> *"Inner classes can be hidden from other classes in the same package."*
>
> *"Inner class methods can access the data from the scope in which they are defined—including the data that would otherwise be private."*

**Dịch:** **Inner class là class được định nghĩa bên trong một class khác.** Tại sao lại muốn làm vậy? Có **hai lý do**:

| # | Lý do |
|---|---|
| 1 | Inner class **giấu được khỏi các class khác trong cùng [[08 - Packages\|package]]** |
| 2 | Method của inner class **truy cập được dữ liệu từ scope nơi chúng được định nghĩa** — kể cả dữ liệu vốn là **`private`** |

> *"Inner classes used to be very important for concisely implementing callbacks, but nowadays lambda expressions do a much better job. Still, inner classes can be very useful for structuring your code. The following sections walk you through all the details."*

**Dịch:** Inner class **từng rất quan trọng** để implement [[01 - Interfaces#6.1.7. Interfaces and Callbacks|callback]] một cách gọn gàng, nhưng **ngày nay [[02 - Lambda Expressions|lambda expression]] làm việc đó tốt hơn nhiều**. Dù vậy inner class **vẫn rất hữu ích để tổ chức code**.

> **C++ Note (sách):** *"C++ has nested classes. A nested class is contained inside the scope of the enclosing class. Here is a typical example: A linked list class defines a nested class to hold the nodes."*
>
> ```cpp
> template<typename T>
> class LinkedList
> {
> public:
>     class Node // a nested class
>     {
>     public:
>         . . .
>     private:
>         T data;
>         Node* next;
>     };
>     . . .
> private:
>     Node* head;
>     Node* tail;
> };
> ```
>
> *"Nested classes are similar to inner classes in Java. However, the Java inner classes have an additional feature that makes them richer and more useful than nested classes in C++. An object that comes from an inner class has an implicit reference to the outer class object that instantiated it. Through this pointer, it gains access to the total state of the outer object. For example, in Java, the Iterator class would not need an explicit pointer to the LinkedList into which it points."*
>
> *"In Java, nested classes that are declared as static do not have this added pointer. They are the Java analog to nested classes in C++."*
>
> **Dịch:** C++ có **nested class** — class nằm trong scope của class bao quanh. Nested class **tương tự inner class trong Java**. Tuy nhiên inner class của Java có **thêm một tính năng** khiến chúng **giàu có và hữu dụng hơn** nested class của C++: **object sinh ra từ inner class có một reference ngầm tới object của outer class đã tạo ra nó**. Qua con trỏ này nó **truy cập được toàn bộ state của object bên ngoài**. Ví dụ, trong Java class `Iterator` **không cần con trỏ tường minh** trỏ tới `LinkedList` mà nó đang duyệt.
>
> Trong Java, nested class **khai báo `static` thì KHÔNG có con trỏ thêm này** — chúng chính là **bản tương ứng trong Java của nested class C++**.

---

## 6.3.1. Use of an Inner Class to Access Object State

> *"The syntax for inner classes is rather complex. For that reason, I present a simple but somewhat artificial example to demonstrate the use of inner classes. Let's refactor the TimerTest example and extract a TalkingClock class. The constructor for a talking clock has two parameters: the interval between announcements and a flag to turn beeps on or off."*

```java
public class TalkingClock
{
    private int interval;
    private boolean beep;

    public TalkingClock(int interval, boolean beep) { . . . }
    public void start() { . . . }

    public class TimePrinter implements ActionListener
    // an inner class
    {
        . . .
    }
}
```

**Dịch:** Cú pháp inner class **khá phức tạp**, nên tác giả dùng một ví dụ **đơn giản nhưng hơi giả tạo**. Ta refactor ví dụ `TimerTest` và **tách ra một class `TalkingClock`**. Constructor của talking clock có **hai parameter**: **khoảng thời gian giữa hai lần thông báo** và **cờ bật/tắt tiếng bíp**.

> *"Note that the TimePrinter class is now located inside the TalkingClock class. This does not mean that every TalkingClock has a TimePrinter instance field. As you will see, the TimePrinter objects are constructed by methods of the TalkingClock class."*

**Dịch:** Chú ý class `TimePrinter` **nay nằm bên trong class `TalkingClock`**. Điều đó **không có nghĩa mọi `TalkingClock` đều có một instance field `TimePrinter`**. Object `TimePrinter` **được dựng bởi method của class `TalkingClock`**.

> *"Here is the TimePrinter class in greater detail. Note that the actionPerformed method checks the beep flag before emitting a beep."*

```java
public class TimePrinter implements ActionListener
{
    public void actionPerformed(ActionEvent event)
    {
        System.out.println("At the tone, the time is "
            + Instant.ofEpochMilli(event.getWhen()));
        if (beep) Toolkit.getDefaultToolkit().beep();
    }
}
```

> *"Something surprising is going on. The TimePrinter class has no instance field or variable named beep. Instead, beep refers to the field of the TalkingClock object that created this TimePrinter. As you can see, an inner class method gets to access both its own instance fields and those of the outer object creating it."*

**Dịch:** **Có chuyện đáng ngạc nhiên ở đây.** Class `TimePrinter` **không có instance field hay biến nào tên `beep`**. Thay vào đó, `beep` **trỏ tới field của object `TalkingClock` đã tạo ra `TimePrinter` này**. Vậy là **method của inner class truy cập được cả instance field của chính nó lẫn của object bên ngoài đã tạo ra nó**.

> *"For this to work, an object of an inner class always gets an implicit reference to the object that created it (see Figure 6.3)."*
>
> *(Figure 6.3: An inner class object has a reference to an outer class object.)*

**Dịch:** Để làm được vậy, **object của inner class LUÔN nhận một reference ngầm tới object đã tạo ra nó**. *(Figure 6.3 trong sách: object inner class có một reference trỏ tới object outer class.)*

**Figure 6.3: An inner class object has a reference to an outer class object.**

```
 ┌──────────────────────────┐
 │       TimePrinter        │
 │                          │
 │  outer = ┌──────────┐    │
 │          └──────────┘────┼──┐
 └──────────────────────────┘  │
                               │   ┌──────────────────────────┐
                               └──►│      TalkingClock        │
                                   │                          │
                                   │  interval = ┌────────┐   │
                                   │             │  1000  │   │
                                   │             └────────┘   │
                                   │  beep     = ┌────────┐   │
                                   │             │  true  │   │
                                   │             └────────┘   │
                                   └──────────────────────────┘
```

> *"This reference is invisible in the definition of the inner class. However, to illuminate the concept, let us call the reference to the outer object outer. Then the actionPerformed method is equivalent to the following:"*

```java
public void actionPerformed(ActionEvent event)
{
    System.out.println("At the tone, the time is "
        + Instant.ofEpochMilli(event.getWhen()));
    if (outer.beep) Toolkit.getDefaultToolkit().beep();
}
```

**Dịch:** Reference này **vô hình trong định nghĩa của inner class**. Để làm rõ khái niệm, tạm gọi reference trỏ tới object bên ngoài là **`outer`** — khi đó `actionPerformed` **tương đương** với đoạn trên.

> *"The outer class reference is set in the constructor. The compiler modifies all inner class constructors, adding a parameter for the outer class reference. The TimePrinter class defines no constructors; therefore, the compiler synthesizes a no-argument constructor, generating code like this:"*

```java
public TimePrinter(TalkingClock clock) // automatically generated code
{
    outer = clock;
}
```

> *"Again, please note that outer is not a Java keyword. We just use it to illustrate the mechanism involved in an inner class."*

**Dịch:** **Reference tới outer class được đặt trong constructor.** Compiler **sửa mọi constructor của inner class, thêm một parameter cho reference outer class**. Class `TimePrinter` **không định nghĩa constructor nào**, nên compiler **tự tổng hợp một constructor không argument**. Xin nhắc lại: **`outer` KHÔNG phải keyword của Java** — chỉ dùng để minh hoạ cơ chế.

> *"When a TimePrinter object is constructed in the start method, the compiler passes the this reference to the current talking clock into the constructor:"*

```java
var listener = new TimePrinter(this); // parameter automatically added
```

**Dịch:** Khi object `TimePrinter` được dựng trong method `start`, compiler **truyền reference [[03 - Defining Your Own Classes#4.3.7. Implicit and Explicit Parameters|`this`]] của talking clock hiện tại vào constructor**.

> *"Listing 6.7 shows the complete program that tests the inner class. Have another look at the access control. Had the TimePrinter class been a regular class, it would have needed to access the beep flag through a public method of the TalkingClock class. Using an inner class is an improvement. There is no need to provide accessors that are of interest only to one other class."*

**Dịch:** Hãy nhìn lại phần **kiểm soát truy cập**. Nếu `TimePrinter` là **class thường**, nó sẽ phải **truy cập cờ `beep` qua một public method của `TalkingClock`**. Dùng inner class là **một cải tiến**: **khỏi phải cung cấp accessor mà chỉ đúng một class khác quan tâm**.

> **Note (sách):** *"We could have declared the TimePrinter class as private. Then only TalkingClock methods would be able to construct TimePrinter objects. Only inner classes can be private. Regular classes always have either package or public access."*
>
> **Dịch:** Ta **có thể khai báo `TimePrinter` là `private`** — khi đó **chỉ method của `TalkingClock` mới dựng được object `TimePrinter`**. **Chỉ inner class mới được là `private`**; class thường **luôn có [[08 - Packages#4.8.5. Package Access|package access]] hoặc `public`**.

### Listing 6.7 — `innerClass/InnerClassTest.java`

```java
package innerClass;

import java.awt.*;
import java.awt.event.*;
import java.time.*;
import javax.swing.*;

/**
 * This program demonstrates the use of inner classes.
 * @version 1.11 2017-12-14
 * @author Cay Horstmann
 */
public class InnerClassTest
{
    public static void main(String[] args)
    {
        var clock = new TalkingClock(1000, true);
        clock.start();

        // keep program running until the user selects "OK"
        JOptionPane.showMessageDialog(null, "Quit program?");
        System.exit(0);
    }
}

/**
 * A clock that prints the time in regular intervals.
 */
class TalkingClock
{
    private int interval;
    private boolean beep;

    /**
     * Constructs a talking clock.
     * @param interval the interval between messages (in milliseconds)
     * @param beep true if the clock should beep
     */
    public TalkingClock(int interval, boolean beep)
    {
        this.interval = interval;
        this.beep = beep;
    }

    /**
     * Starts the clock.
     */
    public void start()
    {
        var listener = new TimePrinter();
        var timer = new Timer(interval, listener);
        timer.start();
    }

    public class TimePrinter implements ActionListener
    {
        public void actionPerformed(ActionEvent event)
        {
            System.out.println("At the tone, the time is "
                + Instant.ofEpochMilli(event.getWhen()));
            if (beep) Toolkit.getDefaultToolkit().beep();
        }
    }
}
```

---

## 6.3.2. Special Syntax Rules for Inner Classes

> *"In the preceding section, we explained the outer class reference of an inner class by calling it outer. Actually, the proper syntax for the outer reference is a bit more complex. The expression"*
>
> `OuterClass.this`
>
> *"denotes the outer class reference. For example, you can write the actionPerformed method of the TimePrinter inner class as"*

```java
public void actionPerformed(ActionEvent event)
{
    . . .
    if (TalkingClock.this.beep) Toolkit.getDefaultToolkit().beep();
}
```

**Dịch:** Cú pháp **đúng** cho reference tới outer class **phức tạp hơn một chút**: biểu thức **`OuterClass.this`** chính là reference tới outer class.

> *"Conversely, you can write the inner object constructor more explicitly, using the syntax"*
>
> `outerObject.new InnerClass(construction arguments)`
>
> *"For example:"*

```java
ActionListener listener = this.new TimePrinter();
```

> *"Here, the outer class reference of the newly constructed TimePrinter object is set to the this reference of the method that creates the inner class object. This is the most common case. As always, the this. qualifier is redundant. However, it is also possible to set the outer class reference to another object by explicitly naming it. For example, since TimePrinter is a public inner class, you can construct a TimePrinter for any talking clock:"*

```java
var jabberer = new TalkingClock(1000, true);
TalkingClock.TimePrinter listener = jabberer.new TimePrinter();
```

> *"Note that you refer to an inner class as"*
>
> `OuterClass.InnerClass`
>
> *"when it occurs outside the scope of the outer class."*

**Dịch:** Ngược lại, bạn **viết constructor của object inner class tường minh hơn** bằng cú pháp **`outerObject.new InnerClass(...)`**. Ở đây reference outer class của object `TimePrinter` vừa dựng **được đặt bằng reference `this` của method tạo ra nó** — đây là **trường hợp phổ biến nhất**, và như thường lệ **tiền tố `this.` là thừa**. Tuy nhiên, bạn cũng **đặt được reference outer class sang một object khác bằng cách gọi tên nó tường minh**. Chú ý: **ngoài scope của outer class**, bạn tham chiếu tới inner class bằng **`OuterClass.InnerClass`**.

> **Note (sách):** *"As of Java 16, inner classes can have static members. Previously, static methods in inner classes were disallowed, and static fields declared in an inner class had to be final and initialized with a compile-time constant."*
>
> *"Static methods of an inner class can access static fields and methods from the inner class or enclosing classes."*
>
> **Dịch:** Từ **Java 16**, inner class **có được [[04 - Static Fields and Methods|static member]]**. Trước đó **static method trong inner class bị cấm**, và **static field khai báo trong inner class phải là `final` và được khởi tạo bằng một compile-time constant**. Static method của inner class **truy cập được static field và method của chính inner class hoặc của các class bao quanh**.

---

## 6.3.3. Are Inner Classes Useful? Actually Necessary? Secure?

> *"When inner classes were added to the Java language in Java 1.1, many programmers considered them a major new feature that was out of character with the Java philosophy of being simpler than C++. The inner class syntax is undeniably complex. (It gets more complex as we study anonymous inner classes later in this chapter.) It is not obvious how inner classes interact with other features of the language, such as access control and security."*

**Dịch:** Khi inner class được thêm vào Java ở **Java 1.1**, nhiều lập trình viên coi đó là **tính năng lớn nhưng lạc điệu** với triết lý "Java đơn giản hơn C++". Cú pháp inner class **phức tạp không thể chối cãi** (và **còn phức tạp hơn** khi tới anonymous inner class). **Không hiển nhiên** chuyện inner class **tương tác thế nào với các tính năng khác** của ngôn ngữ như kiểm soát truy cập và bảo mật.

> *"Inner classes are translated into regular class files with $ (dollar signs) separating the outer and inner class names. For example, the TimePrinter class inside the TalkingClock class is translated to a class file TalkingClock$TimePrinter.class. To see this at work, try the following experiment: run the ReflectionTest program of Chapter 5, and give it the class TalkingClock$TimePrinter to reflect upon. Alternatively, simply use the javap utility:"*

```
javap -private ClassName
```

**Dịch:** Inner class **được dịch thành file class thông thường**, với **dấu `$` ngăn cách tên outer và inner class**. Ví dụ `TimePrinter` bên trong `TalkingClock` được dịch thành file `TalkingClock$TimePrinter.class`. Muốn kiểm chứng thì chạy chương trình `ReflectionTest` ở [[10 - Reflection|Chapter 5]] và đưa class đó vào để reflect, hoặc **đơn giản dùng công cụ `javap`**.

> **Note (sách):** *"If you use UNIX, remember to escape the $ character when you supply the class name on the command line. That is, run the ReflectionTest or javap program as"*
>
> ```
> java --classpath .:../v1ch05 reflection.ReflectionTest \
>     innerClass.TalkingClock\$TimePrinter
> ```
>
> *"or"*
>
> ```
> javap -private innerClass.TalkingClock\$TimePrinter
> ```
>
> **Dịch:** Trên **UNIX**, nhớ **escape ký tự `$`** khi đưa tên class trên dòng lệnh.

> *"You will get the following printout:"*

```java
public class innerClass.TalkingClock$TimePrinter
    implements java.awt.event.ActionListener
{
    final innerClass.TalkingClock this$0;
    public innerClass.TalkingClock$TimePrinter(innerClass.TalkingClock);
    public void actionPerformed(java.awt.event.ActionEvent);
}
```

> *"You can plainly see that the compiler has generated an additional instance field, this$0, for the reference to the outer class. (The name this$0 is synthesized by the compiler—you cannot refer to it in your code.) You can also see the TalkingClock parameter for the constructor."*

**Dịch:** Thấy rõ compiler **đã sinh thêm một instance field `this$0`** cho reference tới outer class. (**Tên `this$0` do compiler tổng hợp — bạn không tham chiếu tới nó trong code của mình được.**) Cũng thấy luôn **parameter `TalkingClock` của constructor**.

> **Note (sách):** *"Since Java 18, the this$0 field is only provided when it is actually needed. It is dropped if no methods of the inner class access the outer class."*
>
> **Dịch:** Từ **Java 18**, field `this$0` **chỉ được cung cấp khi thực sự cần**. Nó **bị bỏ đi nếu không method nào của inner class truy cập outer class**.

> *"If the compiler can automatically do this transformation, couldn’t you simply program the same mechanism by hand? Let’s try it. We would make TimePrinter a regular class, outside the TalkingClock class. When constructing a TimePrinter object, we pass it the this reference of the object that is creating it."*

```java
class TalkingClock
{
    . . .
    public void start()
    {
        var listener = new TimePrinter(this);
        var timer = new Timer(interval, listener);
        timer.start();
    }
}

class TimePrinter implements ActionListener
{
    private TalkingClock outer;
    . . .
    public TimePrinter(TalkingClock clock)
    {
        outer = clock;
    }
}
```

> *"Now let us look at the actionPerformed method. It needs to access outer.beep."*

```java
if (outer.beep) . . . // ERROR
```

> *"Here we run into a problem. The inner class can access the private data of the outer class, but our external TimePrinter class cannot."*

> *"Thus, inner classes are genuinely more powerful than regular classes because they have more access privileges."*

**Dịch:** Nếu compiler tự làm được phép biến đổi này, sao **ta không tự tay lập trình đúng cơ chế đó**? Thử xem: biến `TimePrinter` thành **class thường, nằm ngoài `TalkingClock`**, và khi dựng object thì **truyền reference `this` của object tạo ra nó**. Nhưng `actionPerformed` cần truy cập `outer.beep` — và **ta gặp vấn đề**: **inner class truy cập được dữ liệu `private` của outer class, còn class `TimePrinter` bên ngoài thì không**.

Vậy nên **inner class thực sự mạnh hơn class thường vì chúng có nhiều đặc quyền truy cập hơn**.

---

## 6.3.4. Local Inner Classes

> *"If you look carefully at the code of the TalkingClock example, you will find that you need the name of the type TimePrinter only once: when you create an object of that type in the start method."*

> *"In a situation like this, you can define the class locally in a single method."*

```java
public void start()
{
    class TimePrinter implements ActionListener
    {
        public void actionPerformed(ActionEvent event)
        {
            System.out.println("At the tone, the time is "
                + Instant.ofEpochMilli(event.getWhen()));
            if (beep) Toolkit.getDefaultToolkit().beep();
        }
    }

    var listener = new TimePrinter();
    var timer = new Timer(interval, listener);
    timer.start();
}
```

**Dịch:** Nhìn kỹ code ví dụ `TalkingClock` sẽ thấy bạn **chỉ cần tới tên kiểu `TimePrinter` đúng một lần**: khi tạo object của kiểu đó trong method `start`. Trong tình huống như vậy, bạn **định nghĩa class ngay tại chỗ, bên trong một method duy nhất**.

> *"Local classes are never declared with an access specifier (that is, public or private). Their scope is always restricted to the block in which they are declared."*

> *"Local classes have one great advantage: They are completely hidden from the outside world—not even other code in the TalkingClock class can access them. No method except start has any knowledge of the TimePrinter class."*

**Dịch:** **Local class không bao giờ được khai báo kèm access specifier** (`public` hay `private`). **Scope của chúng luôn giới hạn trong block nơi chúng được khai báo.**

Local class có **một lợi thế lớn**: chúng **hoàn toàn ẩn khỏi thế giới bên ngoài** — **ngay cả code khác trong class `TalkingClock` cũng không truy cập được**. **Không method nào ngoài `start` biết tới sự tồn tại của class `TimePrinter`.**

---

## 6.3.5. Accessing Variables from Outer Methods

> *"Local classes have another advantage over other inner classes. Not only can they access the fields of their outer classes; they can even access local variables! However, those local variables must be effectively final. That means, they may never change once they have been assigned."*

**Dịch:** Local class còn **một lợi thế nữa** so với inner class khác: chúng **không chỉ truy cập được field của outer class, mà còn truy cập được cả local variable!** Tuy nhiên các local variable đó **phải là [[02 - Lambda Expressions#6.2.7. Variable Scope|effectively final]]**, nghĩa là **không bao giờ được thay đổi sau khi đã gán**.

> *"Here is a typical example. Let’s move the interval and beep parameters from the TalkingClock constructor to the start method."*

```java
public void start(int interval, boolean beep)
{
    class TimePrinter implements ActionListener
    {
        public void actionPerformed(ActionEvent event)
        {
            System.out.println("At the tone, the time is "
                + Instant.ofEpochMilli(event.getWhen()));
            if (beep) Toolkit.getDefaultToolkit().beep();
        }
    }

    var listener = new TimePrinter();
    var timer = new Timer(interval, listener);
    timer.start();
}
```

> *"Note that the TalkingClock class no longer needs to store a beep instance field. It simply refers to the beep parameter variable of the start method."*

> *"Maybe this should not be so surprising. The line"*
>
> `if (beep) . . .`
>
> *"is, after all, ultimately inside the start method, so why shouldn’t it have access to the value of the beep variable?"*

**Dịch:** Chú ý `TalkingClock` **không còn cần lưu instance field `beep`** nữa — nó **chỉ đơn giản trỏ tới biến parameter `beep` của method `start`**. Có lẽ chuyện này **cũng không quá đáng ngạc nhiên**: rốt cuộc dòng `if (beep) . . .` **nằm bên trong method `start`**, vậy **cớ gì nó không được truy cập giá trị của biến `beep`**?

> *"To see why there is a subtle issue here, let’s consider the flow of control more closely."*
>
> *"1. The start method is called."*
> *"2. The object variable listener is initialized by a call to the constructor of the inner class TimePrinter."*
> *"3. The listener reference is passed to the Timer constructor, the timer is started, and the start method exits. At this point, the beep parameter variable of the start method no longer exists."*
> *"4. A second later, the actionPerformed method executes if (beep) . . ."*

**Dịch:** Để thấy **vấn đề tinh tế** ở đây, hãy xét kỹ luồng điều khiển:

| # | Diễn biến |
|---|---|
| 1 | Method `start` được gọi |
| 2 | Object variable `listener` được khởi tạo bằng lời gọi constructor của inner class `TimePrinter` |
| 3 | Reference `listener` được truyền cho constructor `Timer`, timer khởi động, và **`start` thoát**. Tại thời điểm này **biến parameter `beep` của `start` không còn tồn tại** |
| 4 | Một giây sau, method `actionPerformed` chạy `if (beep) . . .` |

> *"For the code in the actionPerformed method to work, the TimePrinter class must have copied the beep field as a local variable of the start method, before the beep parameter value went away. That is indeed exactly what happens. In our example, the compiler synthesizes the name TalkingClock$1TimePrinter for the local inner class. If you use the ReflectionTest program or the javap utility again to spy on the TalkingClock$1TimePrinter class, you will get the following output:"*

```java
class TalkingClock$1TimePrinter
{
    TalkingClock$1TimePrinter();
    public void actionPerformed(java.awt.event.ActionEvent);
    final boolean val$beep;
    final TalkingClock this$0;
}
```

> *"When an object is created, the current value of the beep variable is stored in the val$beep field. As of Java 11, this happens with “nest mate” access. Previously, the inner class constructor had an additional parameter to set the field. Either way, the inner class field persists even if the local variable goes out of scope."*

**Dịch:** Để code trong `actionPerformed` chạy được, class `TimePrinter` **phải đã copy `beep` lại trước khi giá trị parameter đó biến mất** — và **đúng là chuyện đó xảy ra thật**. Compiler **tổng hợp tên `TalkingClock$1TimePrinter`** cho local inner class.

Khi một object được tạo, **giá trị hiện tại của biến `beep` được lưu vào field `val$beep`**. Từ **Java 11**, việc này diễn ra qua **truy cập "nest mate"**; trước đó **constructor của inner class có thêm một parameter để set field**. Dù bằng cách nào, **field của inner class vẫn tồn tại kể cả khi local variable đã ra khỏi scope**.

---

## 6.3.6. Anonymous Inner Classes

> *"When using local inner classes, you can often go a step further. If you want to make only a single object of this class, you don’t even need to give the class a name. Such a class is called an anonymous inner class."*

```java
public void start(int interval, boolean beep)
{
    var listener = new ActionListener()
    {
        public void actionPerformed(ActionEvent event)
        {
            System.out.println("At the tone, the time is "
                + Instant.ofEpochMilli(event.getWhen()));
            if (beep) Toolkit.getDefaultToolkit().beep();
        }
    };

    var timer = new Timer(interval, listener);
    timer.start();
}
```

**Dịch:** Với local inner class, thường bạn **đi thêm được một bước nữa**: nếu **chỉ muốn tạo đúng một object** của class này thì **thậm chí khỏi cần đặt tên cho class**. Class như vậy gọi là **anonymous inner class**.

> *"This syntax is very cryptic indeed. What it means is this: Create a new object of a class that implements the ActionListener interface, where the required method actionPerformed is the one defined inside the braces { }."*

> *"In general, the syntax is"*

```java
new SuperType(construction arguments)
{
    inner class methods and data
}
```

> *"Here, SuperType can be an interface, such as ActionListener; then, the inner class implements that interface. SuperType can also be a class; then, the inner class extends that class."*

**Dịch:** Cú pháp này **quả thật rất khó hiểu**. Ý nghĩa của nó là: **tạo một object mới của một class implement interface `ActionListener`**, trong đó **method bắt buộc `actionPerformed` chính là method định nghĩa trong cặp ngoặc `{ }`**.

Ở đây **`SuperType` có thể là một interface** (như `ActionListener`) — khi đó inner class **implement interface đó**; **`SuperType` cũng có thể là một class** — khi đó inner class **[[01 - Classes, Superclasses, and Subclasses|extend]] class đó**.

> *"An anonymous inner class cannot have constructors because the name of a constructor must be the same as the name of a class, and the class has no name. Instead, the construction arguments are given to the superclass constructor. In particular, whenever an inner class implements an interface, it cannot have any construction arguments. Nevertheless, you must supply a set of parentheses as in"*

```java
new InterfaceType()
{
    methods and data
}
```

**Dịch:** Anonymous inner class **không thể có constructor**, vì **tên constructor phải trùng tên class** mà **class này lại không có tên**. Thay vào đó, **các construction argument được đưa cho constructor của superclass**. Đặc biệt, **khi inner class implement một interface thì nó không có construction argument nào**. Dù vậy **bạn vẫn phải ghi cặp ngoặc đơn**.

> *"You have to look carefully to see the difference between the construction of a new object of a class and the construction of an object of an anonymous inner class extending that class."*

```java
var queen = new Person("Mary");
// a Person object
var count = new Person("Dracula") { . . . };
// an object of an inner class extending Person
```

> *"If the closing parenthesis of the construction argument list is followed by an opening brace, then an anonymous inner class is being defined."*

**Dịch:** Phải **nhìn kỹ** mới thấy khác biệt giữa việc dựng object mới của một class và dựng object của một anonymous inner class extend class đó: **nếu sau dấu đóng ngoặc của danh sách construction argument là một dấu mở ngoặc nhọn thì đang định nghĩa một anonymous inner class**.

> **Note (sách):** *"Even though an anonymous class cannot have constructors, you can provide an object initialization block:"*
>
> ```java
> var count = new Person("Dracula")
> {
>     { initialization }
>     . . .
> };
> ```
>
> **Dịch:** Dù anonymous class **không có constructor**, bạn **vẫn cung cấp được [[06 - Object Construction#4.6.7. Initialization Blocks|object initialization block]]**.

> *"Listing 6.8 contains the complete source code for the talking clock program with an anonymous inner class. If you compare this program with Listing 6.7, you will see that in this case, the solution with the anonymous inner class is quite a bit shorter and, hopefully, with some practice, as easy to comprehend."*

> *"For many years, Java programmers routinely used anonymous inner classes for event listeners and other callbacks. Nowadays, you are better off using a lambda expression. For example, the start method from the beginning of this section can be written much more concisely with a lambda expression like this:"*

```java
public void start(int interval, boolean beep)
{
    var timer = new Timer(interval, event ->
    {
        System.out.println("At the tone, the time is "
            + Instant.ofEpochMilli(event.getWhen()));
        if (beep) Toolkit.getDefaultToolkit().beep();
    });
    timer.start();
}
```

**Dịch:** So với Listing 6.7, phương án dùng anonymous inner class **ngắn hơn kha khá** và (hy vọng, sau chút luyện tập) **cũng dễ hiểu tương đương**. **Nhiều năm liền**, lập trình viên Java **thường xuyên dùng anonymous inner class** cho event listener và các callback khác. **Ngày nay dùng lambda expression tốt hơn.**

> **Note (sách):** *"If you store an anonymous class instance in a variable defined with var, the variable knows about added methods or fields:"*
>
> ```java
> var bob = new Object() { String name = "Bob"; }
> System.out.println(bob.name);
> ```
>
> *"If you declare bob as having type Object, then bob.name does not compile."*
>
> *"The object constructed with new Object() { String name = "Bob"; } has type “Object with a Sting name field.” This is a nondenotable type—a type that you cannot express with Java syntax. Nevertheless, the compiler understands the type, and it can set it as the type for the bob variable."*
>
> **Dịch:** Nếu lưu instance của anonymous class vào một biến khai bằng **`var`** thì **biến đó biết về các method hay field được thêm vào**. Nếu khai `bob` có kiểu `Object` thì **`bob.name` không compile được**.
>
> Object dựng bằng `new Object() { String name = "Bob"; }` có kiểu **"`Object` có thêm field `name` kiểu `String`"**. Đây là một **nondenotable type** — **kiểu mà bạn không diễn đạt được bằng cú pháp Java**. Dù vậy **compiler hiểu kiểu đó** và **đặt được nó làm kiểu cho biến `bob`**.

> **Note (sách):** *"The following trick, called double brace initialization, takes advantage of the inner class syntax. Suppose you want to construct an array list and pass it to a method:"*
>
> ```java
> var friends = new ArrayList<String>();
> friends.add("Harry");
> friends.add("Tony");
> invite(friends);
> ```
>
> *"If you don't need the array list again, it would be nice to make it anonymous. But then how can you add the elements? Here is how:"*
>
> ```java
> invite(new ArrayList<String>() {{ add("Harry"); add("Tony"); }});
> ```
>
> *"Note the double braces. The outer braces make an anonymous subclass of ArrayList. The inner braces are an object initialization block (see Chapter 4)."*
>
> *"In practice, this trick is rarely useful. More likely than not, the invite method is willing to accept any List\<String>, and you can simply pass List.of("Harry", "Tony")."*
>
> **Dịch:** Mẹo sau, gọi là **double brace initialization**, tận dụng cú pháp inner class. Chú ý **hai lớp ngoặc nhọn**: **lớp ngoài tạo ra một anonymous subclass của `ArrayList`**, **lớp trong là một object initialization block** (xem Chapter 4).
>
> **Thực tế mẹo này ít khi hữu ích.** Nhiều khả năng method `invite` **sẵn sàng nhận bất kỳ `List<String>` nào**, và bạn **chỉ cần truyền `List.of("Harry", "Tony")`**.

> **Caution (sách):** *"It is often convenient to make an anonymous subclass that is almost, but not quite, like its superclass. But you need to be careful with the equals method. In Chapter 5, I recommended that your equals methods use a test"*
>
> ```java
> if (getClass() != other.getClass()) return false;
> ```
>
> *"An anonymous subclass will fail this test."*
>
> **Dịch:** Việc tạo một **anonymous subclass gần giống nhưng không hẳn giống superclass** thường rất tiện. Nhưng **phải cẩn thận với method `equals`**: ở Chapter 5 tác giả khuyến nghị `equals` dùng phép kiểm tra `getClass() != other.getClass()` — **anonymous subclass sẽ trượt phép kiểm tra này**.

> **Tip (sách):** *"When you produce logging or debugging messages, you often want to include the name of the current class, such as"*
>
> ```java
> System.err.println("Something awful happened in " + getClass());
> ```
>
> *"But that fails in a static method. After all, the call to getClass calls this.getClass(), and a static method has no this. Use the following expression instead:"*
>
> ```java
> new Object(){}.getClass().getEnclosingClass() // gets class of static method
> ```
>
> *"Here, new Object(){} makes an anonymous object of an anonymous subclass of Object, and getEnclosingClass gets its enclosing class—that is, the class containing the static method."*
>
> **Dịch:** Khi sinh thông điệp log hay debug, bạn thường muốn **kèm tên class hiện tại**. Nhưng cách đó **hỏng trong [[04 - Static Fields and Methods#4.4.3. Static Methods|static method]]**: lời gọi `getClass()` thực chất là `this.getClass()`, mà **static method không có `this`**. Hãy dùng biểu thức thay thế: `new Object(){}` **tạo một object vô danh của một anonymous subclass của `Object`**, còn **`getEnclosingClass` lấy class bao quanh nó** — tức **class chứa static method đó**.

### Listing 6.8 — `anonymousInnerClass/AnonymousInnerClassTest.java`

```java
package anonymousInnerClass;

import java.awt.*;
import java.awt.event.*;
import java.time.*;
import javax.swing.*;

/**
 * This program demonstrates anonymous inner classes.
 * @version 1.12 2017-12-14
 * @author Cay Horstmann
 */
public class AnonymousInnerClassTest
{
    public static void main(String[] args)
    {
        var clock = new TalkingClock();
        clock.start(1000, true);

        // keep program running until the user selects "OK"
        JOptionPane.showMessageDialog(null, "Quit program?");
        System.exit(0);
    }
}

/**
 * A clock that prints the time in regular intervals.
 */
class TalkingClock
{
    /**
     * Starts the clock.
     * @param interval the interval between messages (in milliseconds)
     * @param beep true if the clock should beep
     */
    public void start(int interval, boolean beep)
    {
        var listener = new ActionListener()
        {
            public void actionPerformed(ActionEvent event)
            {
                System.out.println("At the tone, the time is "
                    + Instant.ofEpochMilli(event.getWhen()));
                if (beep) Toolkit.getDefaultToolkit().beep();
            }
        };

        var timer = new Timer(interval, listener);
        timer.start();
    }
}
```

---

## 6.3.7. Static Classes

> *"Occasionally, you may want to nest one class inside another, but you don’t need the nested class to have a reference to the outer class object. You can suppress the generation of that reference by declaring the nested class static."*

> *"The Java Language Specification uses the term “nested class” for any class that is declared inside another class or interface, “static class” for a (necessarily nested) static class, and “inner class” for a nested class that is not static."*

**Dịch:** Đôi khi bạn muốn **lồng một class vào class khác** nhưng **không cần nested class có reference tới object của outer class**. Bạn **chặn việc sinh ra reference đó bằng cách khai báo nested class là `static`**.

**Java Language Specification** dùng thuật ngữ:

| Thuật ngữ | Nghĩa |
|---|---|
| **nested class** | Bất kỳ class nào **khai báo bên trong class hoặc interface khác** |
| **static class** | Một class `static` (**tất nhiên là nested**) |
| **inner class** | Một nested class **không phải static** |

> *"Here is a typical example of where you would want to do this. In an ArrayAlg class, we have a task that finds a range of elements of an array. Then you need to return the start and the end of the range. We can achieve that by defining a class Range that holds two values:"*

```java
class Range
{
    private int from;
    private int to;

    public Range(int from) { . . . }
    public void extend() { . . . }
    . . .
}
```

> *"Of course, Range is an exceedingly common name, and in a large project, it is quite possible that some other programmer had the same bright idea and defined another Range class in the same package. We can solve this potential name clash by making Range a public inner class inside ArrayAlg. Then the class will be known to the public as ArrayAlg.Range:"*

```java
ArrayAlg.Range r = ArrayAlg.longestRun(numbers);
```

**Dịch:** Trong class `ArrayAlg` ta có công việc **tìm một dải phần tử của [[09 - Arrays|array]]**, và cần **trả về điểm đầu và điểm cuối của dải**. Làm được bằng cách định nghĩa class `Range` giữ hai giá trị. Dĩ nhiên **`Range` là cái tên cực kỳ phổ biến**, và trong dự án lớn **rất có thể lập trình viên khác cũng có ý tưởng sáng láng đó** rồi định nghĩa một class `Range` khác **trong cùng package**. Ta **giải quyết nguy cơ trùng tên** bằng cách biến `Range` thành **public inner class bên trong `ArrayAlg`** — khi đó bên ngoài biết tới class này với tên **`ArrayAlg.Range`**.

> *"However, unlike the inner classes used in previous examples, we do not want to have a reference to any other object inside a Range object. That reference can be suppressed by declaring the nested class static:"*

```java
class ArrayAlg
{
    public static class Range
    {
        . . .
    }
    . . .
}
```

> *"A static class is exactly like an inner class, except that an object of a static class does not have a reference to the outer class object that generated it. In our example, we must use a static class because the nested class instance is constructed inside a static method:"*

```java
public static Pair longestRun(double[] values)
{
    . . .
    Range current = new Range(. . .);
    . . .
    if (. . .) longest = current;
    . . .
    return longest;
}
```

> *"Had the Range class not been declared as static, the compiler would have flagged the constructor call as an error. After all, there is no implicit object of type ArrayAlg available to initialize the inner class instance."*

**Dịch:** Khác với inner class ở các ví dụ trước, **ta không muốn object `Range` chứa reference tới bất kỳ object nào khác**. Reference đó **bị chặn bằng cách khai báo nested class là `static`**.

**Static class giống hệt inner class**, chỉ khác ở chỗ **object của static class KHÔNG có reference tới object outer class đã sinh ra nó**. Ở ví dụ này ta **bắt buộc phải dùng static class** vì **instance của nested class được dựng bên trong một static method**. Nếu `Range` **không khai `static`**, compiler sẽ **báo lỗi ở lời gọi constructor** — bởi **không có object ngầm kiểu `ArrayAlg` nào sẵn có để khởi tạo instance của inner class**.

> *"You should use a static class whenever a nested class does not need to access an outer class object."*

> *"Here, I purposefully made the Range class mutable. It might be better to make the Range class immutable, and to declare it as a record. A record is automatically static."*

**Dịch:** **Hãy dùng static class mỗi khi nested class không cần truy cập object của outer class.**

Ở đây tác giả **cố ý làm `Range` mutable**. Có lẽ **tốt hơn là làm `Range` immutable và khai báo nó thành một [[07 - Records|record]]** — **record thì tự động là static**.

> **Note (sách):** *"Just like records, interfaces and enumerations that are declared inside a class or interface are automatically static."*
>
> **Dịch:** Giống record, **interface và enumeration khai báo bên trong một class hoặc interface đều tự động là static**.

> **Note (sách):** *"Classes that are declared inside an interface are automatically static and public."*
>
> **Dịch:** Class **khai báo bên trong một interface** thì **tự động là `static` và `public`**.

> **Note (sách):** *"Prior to Java 16, it was not possible to declare a static class inside an inner class. This restriction has now been removed."*
>
> **Dịch:** Trước **Java 16**, **không khai báo được static class bên trong một inner class**. **Hạn chế này nay đã được gỡ bỏ.**

> *"Listing 6.9 contains the complete source code of the ArrayAlg class and the nested Pair class."*

### Listing 6.9 — `staticInnerClass/StaticInnerClassTest.java`

```java
package staticInnerClass;

/**
 * This program demonstrates the use of static inner classes.
 * @version 1.1 2023-12-19
 * @author Cay Horstmann
 */
public class StaticInnerClassTest
{
    public static void main(String[] args)
    {
        double[] numbers = { 1, 2, 2, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 5, 6, 6, 6, 6 };
        ArrayAlg.Range r = ArrayAlg.longestRun(numbers);
        System.out.println("from = " + r.getFrom());
        System.out.println("to = " + r.getTo());
    }
}

class ArrayAlg
{
    /**
     * A range of index values.
     */
    public static class Range
    {
        private int from;
        private int to;

        /**
         * Constructs a range of length 1.
         * @param from the initial index value of this range
         */
        public Range(int from)
        {
            this.from = from;
            this.to = from + 1;
        }

        /**
         * Extends this range by one element.
         */
        public void extend()
        {
            this.to++;
        }

        /**
         * Gets the starting index value of this range.
         * @return the starting index
         */
        public int getFrom()
        {
            return from;
        }

        /**
         * Gets the first index past the end of this range.
         * @return the past-the-end index
         */
        public int getTo()
        {
            return to;
        }

        /**
         * Returns the number of elements in this range.
         * @return the number of elements
         */
        public int length()
        {
            return to - from;
        }
    }

    /**
     * A "run" is a sequence of repeating adjacent elements. For example, in the array
     * 1 2 3 3 3 4 4, the runs are (trivially) 1 and 2, and 3 3 3 3 and 4 4.
     * Returns the range of the longest run.
     * @param values an array of length at least 1
     * @return the range of the longest run
     */
    public static Range longestRun(double[] values)
    {
        Range longest = new Range(0);
        Range current = new Range(0);
        for (int i = 1; i < values.length; i++)
        {
            if (values[i] == values[i - 1]) current.extend();
            else
            {
                if (longest.length() < current.length()) longest = current;
                current = new Range(i);
            }
        }
        if (longest.length() < current.length()) longest = current;
        return longest;
    }
}
```

---

## Bài kế tiếp

→ [[04 - Service Loaders]] — cơ chế `ServiceLoader` của JDK để nạp các implementation tuân theo một interface chung.
