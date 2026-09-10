# 06 — Debugging Tips

> Chapter 7, Section 7.6 — Core Java Volume I, 13th Edition (Horstmann).
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 7.6. Debugging Tips

> *"Suppose you wrote your program and made it bulletproof by catching and properly handling all exceptions. Then you run it, and it does not work right. Now what? (If you never have this problem, you can skip the remainder of this chapter.)"*

**Dịch:** Giả sử bạn đã viết xong chương trình và **làm nó chống đạn** bằng cách **catch và xử lý đúng mọi exception**. Rồi bạn chạy nó, và **nó chạy sai**. Giờ sao? (Nếu bạn **chưa bao giờ gặp vấn đề này**, bạn có thể **bỏ qua phần còn lại của chương**.)

> *"Of course, it is best if you have a convenient and powerful debugger. Debuggers are available as a part of professional development environments such as Eclipse, IntelliJ, and NetBeans. In this section, I offer a number of tips that may be worth trying before you launch the debugger."*

**Dịch:** Dĩ nhiên, **tốt nhất là có một debugger tiện lợi và mạnh mẽ**. Debugger có sẵn trong các **môi trường phát triển chuyên nghiệp** như **Eclipse, IntelliJ và NetBeans**. Mục này đưa ra **một số mẹo đáng thử trước khi bạn mở debugger lên**.

---

## 1. In hoặc log giá trị của biến

> *"You can print or log the value of any variable with code like this:"*

```java
System.out.println("x=" + x);
```

> *"or"*

```java
logger.log(DEBUG, "x=" + x);
```

> *"If x is a number, it is converted to its string equivalent. If x is an object, Java calls its toString method. It can also be useful to log the state of the this object."*

```java
logger.log(DEBUG, "this=" + this);
```

**Dịch:** Bạn **in hoặc log được giá trị của bất kỳ biến nào**. Nếu `x` là **một số**, nó **được chuyển thành string tương ứng**. Nếu `x` là **một object**, Java **gọi method `toString` của nó**. **Log state của object `this` cũng hữu ích.** (Về `toString` và `this`, xem [[03 - Defining Your Own Classes]]; về nối string, xem [[05 - Strings]].)

> *"Most of the classes in the Java library are very conscientious about overriding the toString method to give you useful information about the class. This is a real boon for debugging. You should make the same effort in your classes."*

**Dịch:** **Phần lớn class trong thư viện Java rất chỉn chu trong việc override method `toString`** để cho bạn **thông tin hữu ích về class**. Đó là **món lợi thật sự khi debug**. Bạn **nên bỏ công tương tự cho các class của mình**.

---

## 2. Đặt method main riêng trong mỗi class

> *"You can put a separate main method in each class. Inside it, put code that demonstrates how the class should be used."*

```java
public class MyClass
{
    methods and fields
    . . .
    public static void main(String[] args)
    {
        demo code
    }
}
```

> *"Make a few objects, call methods, and show that each of them does the right thing."*

**Dịch:** Bạn **đặt được một method `main` riêng trong mỗi class**. Bên trong nó, **đặt code minh hoạ cách class nên được dùng**. Hãy **tạo vài object, gọi method, và cho thấy mỗi cái làm đúng việc của nó**.

---

## 3. Unit testing chuyên nghiệp hơn: JUnit

> *"For more professional unit testing, you should check out JUnit from https://junit.org. JUnit is a very popular unit testing framework that makes it easy to organize suites of test cases. Run the tests whenever you make changes to a class, and add another test case whenever you find a bug."*

**Dịch:** Muốn **unit testing chuyên nghiệp hơn**, hãy tìm hiểu **JUnit** tại https://junit.org. JUnit là một **framework unit testing rất phổ biến**, giúp **tổ chức các bộ test case dễ dàng**. **Chạy test mỗi khi bạn thay đổi một class**, và **thêm một test case mỗi khi bạn tìm ra một bug**.

---

## 4. Logging proxy

> *"A logging proxy is an object of a subclass that intercepts method calls, logs them, and then calls the original method. For example, if you have trouble with the nextDouble method of the Random class, you can create a proxy object as an instance of an anonymous subclass:"*

```java
var generator = new Random()
{
    public double nextDouble()
    {
        double result = super.nextDouble();
        logger.log(DEBUG, "nextDouble: " + result);
        return result;
    }
};
```

> *"Whenever the nextDouble method is called, a log message is generated."*
>
> *"Note that this only works if the class is not final. With interfaces, one can implement a proxy that logs all methods, as shown in Chapter 6."*

**Dịch:** **Logging proxy là một object của một subclass, có nhiệm vụ chặn các lời gọi method, log chúng lại, rồi gọi method gốc.** Ví dụ nếu bạn **gặp trục trặc với method `nextDouble` của class `Random`**, bạn **tạo được một object proxy dưới dạng instance của một anonymous subclass**.

Mỗi khi method `nextDouble` được gọi, **một log message được sinh ra**.

Lưu ý cách này **chỉ hoạt động nếu class không phải `final`**. Với **interface**, ta **implement được một proxy log mọi method**, như đã trình bày ở **Chapter 6**.

---

## 5. Lấy stack trace từ object exception

> *"You can get a stack trace from any exception object with the printStackTrace method in the Throwable class. The following code catches any exception, prints the exception object and the stack trace, and rethrows the exception so it can find its intended handler."*

```java
try
{
    . . .
}
catch (Throwable t)
{
    t.printStackTrace();
    throw t;
}
```

> *"You don't even need to catch an exception to generate a stack trace. Simply insert the statement"*

```java
Thread.dumpStack();
```

> *"anywhere into your code to get a stack trace."*

**Dịch:** Bạn **lấy được stack trace từ bất kỳ object exception nào** bằng method **`printStackTrace`** trong class `Throwable`. Đoạn code trên **catch mọi exception, in ra object exception và stack trace, rồi rethrow exception** để nó **tìm được handler dành cho nó**. (Xem thêm [[02 - Catching Exceptions#7.2.6. Analyzing Stack Trace Elements]].)

Bạn **thậm chí không cần catch exception mới sinh được stack trace** — chỉ cần **chèn câu lệnh `Thread.dumpStack();` vào bất cứ đâu trong code**.

---

## 6. Bắt stack trace vào một string

> *"Normally, the stack trace is displayed on System.err. If you want to log or display the stack trace, here is how you can capture it into a string:"*

```java
var out = new StringWriter();
new Throwable().printStackTrace(new PrintWriter(out));
String description = out.toString();
```

**Dịch:** Bình thường **stack trace được hiển thị trên `System.err`**. Nếu bạn muốn **log hoặc hiển thị stack trace**, đây là cách **bắt nó vào một string**.

---

## 7. Chuyển hướng lỗi vào file

> *"It is often handy to trap program errors in a file. However, errors are sent to System.err, not System.out. Therefore, you cannot simply trap them by running"*

```
java MyProgram > errors.txt
```

> *"Instead, capture the error stream as"*

```
java MyProgram 2> errors.txt
```

> *"To capture both System.err and System.out in the same file, use"*

```
java MyProgram 1> errors.txt 2>&1
```

> *"This works in bash and the Windows shell."*

**Dịch:** **Hứng lỗi chương trình vào một file thường rất tiện.** Tuy nhiên, **lỗi được gửi tới `System.err`, không phải `System.out`**. Vì vậy bạn **không thể chỉ đơn giản hứng chúng** bằng `java MyProgram > errors.txt`. Thay vào đó, hãy **bắt error stream** bằng `2>`. Để **bắt cả `System.err` lẫn `System.out` vào cùng một file**, dùng `1> errors.txt 2>&1`. Cách này **chạy được trên bash và Windows shell**. (Về `System.err`/`System.out`, xem [[06 - Input and Output]].)

---

## 8. Log các uncaught exception

> *"Having the stack traces of uncaught exceptions show up in System.err is not ideal. These messages are confusing to end users if they happen to see them, and they are not available for diagnostic purposes when you need them. A better approach is to log them. You can change the handler for uncaught exceptions with the static Thread.setDefaultUncaughtExceptionHandler method:"*

```java
Thread.setDefaultUncaughtExceptionHandler((Thread t, Throwable e) ->
    logger.log(TRACE, "Uncaught exception in " + t, e));
```

**Dịch:** Việc **để stack trace của uncaught exception hiện ra ở `System.err` là không lý tưởng**. Những message này **gây bối rối cho người dùng cuối nếu họ lỡ thấy chúng**, và **không có sẵn để phục vụ chẩn đoán khi bạn cần**. **Cách tốt hơn là log chúng lại.** Bạn **đổi được handler cho uncaught exception** bằng static method **`Thread.setDefaultUncaughtExceptionHandler`**. (Xem thêm lời khuyên số 8 ở [[03 - Tips for Using Exceptions]].)

---

## 9. Theo dõi việc nạp class với `-verbose`

> *"To watch class loading, launch the Java virtual machine with the -verbose flag. You will get a printout such as the following:"*

```
[0.012s][info][class,load] opened: /opt/jdk-21.0.1/lib/modules
[0.034s][info][class,load] java.lang.Object source: jrt:/java.base
[0.035s][info][class,load] java.io.Serializable source: jrt:/java.base
[0.035s][info][class,load] java.lang.Comparable source: jrt:/java.base
[0.035s][info][class,load] java.lang.CharSequence source: jrt:/java.base
[0.035s][info][class,load] java.lang.String source: jrt:/java.base
[0.036s][info][class,load] java.lang.reflect.AnnotatedElement source: jrt:/java.base
[0.036s][info][class,load] java.lang.reflect.GenericDeclaration source: jrt:/java.base
[0.036s][info][class,load] java.lang.reflect.Type source: jrt:/java.base
[0.036s][info][class,load] java.lang.Class source: jrt:/java.base
[0.036s][info][class,load] java.lang.Cloneable source: jrt:/java.base
[0.037s][info][class,load] java.lang.ClassLoader source: jrt:/java.base
[0.037s][info][class,load] java.lang.System source: jrt:/java.base
[0.037s][info][class,load] java.lang.Throwable source: jrt:/java.base
[0.037s][info][class,load] java.lang.Error source: jrt:/java.base
[0.037s][info][class,load] java.lang.ThreadDeath source: jrt:/java.base
[0.037s][info][class,load] java.lang.Exception source: jrt:/java.base
[0.037s][info][class,load] java.lang.RuntimeException source: jrt:/java.base
[0.038s][info][class,load] java.lang.SecurityManager source: jrt:/java.base
. . .
```

> *"This can occasionally be helpful to diagnose class path problems."*

**Dịch:** Để **theo dõi việc nạp class**, hãy **khởi động Java virtual machine với cờ `-verbose`**. Chuyện này **thi thoảng có ích để chẩn đoán các vấn đề về class path**. (Về class path, xem [[08 - Packages]].)

---

## 10. Option `-Xlint` của compiler

> *"The -Xlint option tells the compiler to spot common code problems. For example, if you compile with the command"*

```
javac -Xlint sourceFiles
```

> *"the compiler will report missing break statements in switch statements. (The term "lint" originally described a tool for locating potential problems in C programs, but is now generically applied to any tools that flag constructs that are questionable but not illegal.)"*
>
> *"You will get messages such as"*

```
warning: [fallthrough] possible fall-through into case
```

**Dịch:** Option **`-Xlint` bảo compiler phát hiện các vấn đề code thường gặp**. Ví dụ, compiler sẽ **báo cáo những câu lệnh `break` bị thiếu trong câu lệnh `switch`**. (Thuật ngữ **"lint"** ban đầu chỉ **một công cụ định vị vấn đề tiềm ẩn trong chương trình C**, nay được **dùng chung cho mọi công cụ đánh dấu các cấu trúc đáng ngờ nhưng không bất hợp pháp**.) (Về `switch` và `break`, xem [[07 - Control Flow]].)

> *"The string in square brackets identifies the warning category. You can enable and disable each category. Since most of them are quite useful, it seems best to leave them all in place and disable only those that you don't care about, like this:"*

```
javac -Xlint:all,-fallthrough,-serial sourceFiles
```

> *"You get a list of all warnings from the command"*

```
javac --help -X
```

**Dịch:** **String trong ngoặc vuông cho biết category của warning.** Bạn **bật hoặc tắt được từng category**. Vì **phần lớn chúng khá hữu ích**, tốt nhất là **để nguyên tất cả và chỉ tắt những cái bạn không quan tâm**. Lấy **danh sách mọi warning** bằng lệnh `javac --help -X`.

---

## 11. Monitoring bằng `jconsole`

> *"The Java VM has support for monitoring and management of Java applications, allowing the installation of agents in the virtual machine that track memory consumption, thread usage, class loading, and so on. This feature is particularly important for large and long-running Java programs. As a demonstration of these capabilities, the JDK ships with a graphical tool called jconsole that displays statistics about the performance of a virtual machine (see Figure 7.2). Start your program, then start jconsole and pick your program from the list of running Java programs."*
>
> *"This program gives you a wealth of information about your running program."*

**Dịch:** Java VM **hỗ trợ monitoring và quản lý ứng dụng Java**, cho phép **cài các agent vào virtual machine** để **theo dõi mức tiêu thụ bộ nhớ, việc dùng thread, việc nạp class, v.v.** Tính năng này **đặc biệt quan trọng với các chương trình Java lớn và chạy lâu dài**. Để minh hoạ, **JDK đi kèm một công cụ đồ hoạ tên `jconsole`** hiển thị **thống kê về hiệu năng của một virtual machine**. Hãy **khởi động chương trình của bạn, rồi khởi động `jconsole` và chọn chương trình đó từ danh sách các chương trình Java đang chạy**.

Chương trình này cho bạn **cả kho thông tin về chương trình đang chạy**.

---

## 12. Java Flight Recorder

> *"Java Flight Recorder is an instrumentation technology of the OpenJDK virtual machine that collects diagnostic and profiling data. You can use the open-source VisualVM (https://visualvm.github.io) and Java Mission Control (https://adoptium.net/jmc) to collect and view flight recording data. These tools also do everything that you can do with jconsole."*

**Dịch:** **Java Flight Recorder** là một **công nghệ instrumentation của virtual machine OpenJDK**, thu thập **dữ liệu chẩn đoán và profiling**. Bạn dùng được **VisualVM mã nguồn mở** (https://visualvm.github.io) và **Java Mission Control** (https://adoptium.net/jmc) để **thu thập và xem dữ liệu flight recording**. Các công cụ này **cũng làm được mọi thứ mà `jconsole` làm được**.

---

## 13. Các công cụ dòng lệnh của JDK, đặc biệt là `jcmd`

> *"The JDK comes with a number of command-line tools with overlapping use cases for monitoring the virtual machine (jcmd, jhsdb, jinfo, jmap, jps, jstat). The jcmd tool is a good starting point since it covers several of those use cases. Run"*

```
jcmd
```

> *"to get a list of all Java processes on your computer, with process ID and the name of the main class."*

**Dịch:** JDK đi kèm **một loạt công cụ dòng lệnh có công dụng chồng chéo nhau để monitor virtual machine** (`jcmd`, `jhsdb`, `jinfo`, `jmap`, `jps`, `jstat`). **`jcmd` là điểm khởi đầu tốt** vì nó **bao trùm nhiều trong số các use case đó**. Chạy `jcmd` để lấy **danh sách mọi process Java trên máy bạn**, kèm **process ID và tên của class main**.

> *"To list system properties or VM flags, run"*

```
jcmd pidOrMainClass VM.system_properties
jcmd pidOrMainClass VM.flags
```

> *"You can configure the virtual machine log:"*

```
jcmd pidOrMainClass VM.log output=gc.log what=gc=trace decorators=uptime,tid
```

> *"To get a thread dump, run"*

```
jcmd pidOrMainClass Thread.print
```

> *"or"*

```
jcmd pidOrMainClass Thread.dump_to_file -overwrite -format=json dump.json
```

> *"To start Java Flight Recorder, run"*

```
jcmd pidOrMainClass JFR.start filename=filename
```

> *"To stop recording, run"*

```
jcmd pidOrMainClass JFR.stop name=1
```

> *"To get a list of all available commands, run"*

```
jcmd pidOrMainClass
```

> *"To get help for a particular command, run"*

```
jcmd pidOrMainClass help commandName
```

**Dịch:** Các lệnh trên lần lượt để: **liệt kê system property hoặc VM flag** · **cấu hình log của virtual machine** · **lấy thread dump** · **khởi động Java Flight Recorder** · **dừng recording** · **lấy danh sách mọi lệnh khả dụng** · **lấy trợ giúp cho một lệnh cụ thể**.

---

## Kết chương

> *"This chapter introduced you to exception handling and logging. You also saw useful hints for testing and debugging. The next two chapters cover generic programming and its most important application: the Java collections framework."*

**Dịch:** Chương này **giới thiệu về exception handling và logging**. Bạn cũng đã thấy **những gợi ý hữu ích cho việc test và debug**. **Hai chương tiếp theo bàn về generic programming và ứng dụng quan trọng nhất của nó: Java collections framework.**

---

## Chương kế tiếp

→ [[01 - Why Generic Programming]] — generic class và method có type parameter, mô tả chính xác cách các kiểu được dùng trong implementation.
