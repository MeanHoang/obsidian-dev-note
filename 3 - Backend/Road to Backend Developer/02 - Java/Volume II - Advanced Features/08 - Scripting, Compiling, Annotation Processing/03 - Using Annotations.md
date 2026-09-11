# 03 — Using Annotations

> Chapter 8, Section 8.3 — Core Java Volume II: Advanced Features, 11th Edition (Horstmann), Java 11.
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

> Chủ đề này Volume I cũng có, viết ở bản khác: xem [[01 - Using Annotations]] (Vol I).

---

## 8.3. Using Annotations

> *"Annotations are tags that you insert into your source code so that some tool can process them. The tools can operate on the source level, or they can process class files into which the compiler has placed annotations."*

**Dịch:** **Annotation là những cái tag bạn chèn vào source code để một công cụ nào đó xử lý chúng.** Công cụ có thể **thao tác ở mức source**, hoặc **xử lý các file class mà compiler đã đặt annotation vào**.

> *"Annotations do not change the way in which your programs are compiled. The Java compiler generates the same virtual machine instructions with or without the annotations."*

**Dịch:** **Annotation không làm thay đổi cách chương trình của bạn được compile.** Java compiler **sinh ra cùng những virtual machine instruction dù có hay không có annotation**.

> *"To benefit from annotations, you need to select a processing tool. Use annotations that your processing tool understands, then apply the processing tool to your code."*

**Dịch:** Muốn hưởng lợi từ annotation thì phải **chọn một công cụ xử lý (processing tool)**. **Dùng những annotation mà công cụ đó hiểu**, rồi **áp công cụ lên code của bạn**.

> *"There is a wide range of uses for annotations, and that generality can be confusing at first. Here are some uses for annotations:"*
>
> - *"Automatic generation of auxiliary files, such as deployment descriptors or bean information classes"*
> - *"Automatic generation of code for testing, logging, transaction semantics, and so on"*

**Dịch:** Annotation có **rất nhiều công dụng**, và tính tổng quát đó **thoạt đầu có thể gây bối rối**. Một số công dụng:

- **Tự động sinh file phụ trợ**, như deployment descriptor hay bean information class
- **Tự động sinh code** cho testing, logging, transaction semantics, v.v.

---

## 8.3.1. An Introduction into Annotations

> *"We'll start our discussion of annotations with the basic concepts and put them to use in a concrete example, in which we will mark methods as event listeners for AWT components and show you an annotation processor that analyzes the annotations and hooks up the listeners. We'll then discuss the syntax rules in detail and finish the chapter with two advanced examples of annotation processing. One of them processes source-level annotations, the other uses the Apache Bytecode Engineering Library to process class files, injecting additional bytecodes into annotated methods."*

**Dịch:** Sách bắt đầu bằng **khái niệm cơ bản**, rồi áp vào một ví dụ cụ thể: **đánh dấu method làm event listener cho component AWT**, và trình bày một **annotation processor** phân tích annotation rồi **nối các listener lại**. Sau đó bàn **luật cú pháp** chi tiết, và kết chương bằng **hai ví dụ nâng cao về annotation processing**: một xử lý **source-level annotation**, một dùng **Apache Bytecode Engineering Library** xử lý file class, **tiêm thêm bytecode vào các method được annotate**.

> *"Here is an example of a simple annotation:"*

```java
public class MyClass
{
    . . .
    @Test public void checkRandomInsertions()
}
```

> *"The annotation @Test annotates the checkRandomInsertions method."*

**Dịch:** Annotation `@Test` **annotate method `checkRandomInsertions`**.

> *"In Java, an annotation is used like a modifier and is placed before the annotated item without a semicolon. (A modifier is a keyword such as public or static.) The name of each annotation is preceded by an @ symbol, similar to Javadoc comments. However, Javadoc comments occur inside the /** . . . */ delimiters, whereas annotations are part of the code."*

**Dịch:** Trong Java, **annotation được dùng như một modifier** và **đặt trước item được annotate, không có dấu chấm phẩy**. (Modifier là keyword kiểu `public` hay `static`.) Tên mỗi annotation **có ký hiệu `@` đứng trước**, giống comment Javadoc. Nhưng **comment Javadoc nằm trong cặp `/** . . . */`**, còn **annotation là một phần của code**. (Xem [[10 - Documentation Comments]] ở Volume I.)

> *"By itself, the @Test annotation does not do anything. It needs a tool to be useful. For example, the JUnit testing tool (available at http://junit.org) calls all methods that are labeled @Test when testing a class. Another tool might remove all test methods from a class file so they are not shipped with the program after it has been tested."*

**Dịch:** **Bản thân annotation `@Test` không làm gì cả** — **nó cần một công cụ mới hữu dụng**. Ví dụ, công cụ testing **JUnit** gọi **mọi method được gắn nhãn `@Test`** khi test một class. Một công cụ khác có thể **gỡ hết method test khỏi file class** để chúng **không bị ship cùng chương trình** sau khi test xong.

> *"Annotations can be defined to have elements, such as"*

```java
@Test(timeout="10000")
```

> *"These elements can be processed by the tools that read the annotations. Other forms of elements are possible; we'll discuss them later in this chapter."*

**Dịch:** Annotation **định nghĩa được để có các element**. Các element này **được các công cụ đọc annotation xử lý**.

> *"Besides methods, you can annotate classes, fields, and local variables—an annotation can be anywhere you could put a modifier such as public or static. In addition, as you will see in Section 8.4, "Annotation Syntax," on p. 471, you can annotate packages, parameter variables, type parameters, and type uses."*

**Dịch:** Ngoài method, bạn **annotate được class, field, và local variable** — **annotation đặt được ở bất cứ đâu bạn đặt được modifier như `public` hay `static`**. Ngoài ra còn annotate được **package, parameter variable, type parameter, và type use** (xem [[04 - Annotation Syntax]]).

### Annotation interface

> *"Each annotation must be defined by an annotation interface. The methods of the interface correspond to the elements of the annotation. For example, the JUnit Test annotation is defined by the following interface:"*

```java
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface Test
{
    long timeout() default 0L;
    . . .
}
```

**Dịch:** **Mỗi annotation phải được định nghĩa bởi một annotation interface.** **Các method của interface tương ứng với các element của annotation.**

> *"The @interface declaration creates an actual Java interface. Tools that process annotations receive objects that implement the annotation interface. A tool would call the timeout method to retrieve the timeout element of a particular Test annotation."*

**Dịch:** Khai báo **`@interface` tạo ra một Java interface thực sự**. Công cụ xử lý annotation **nhận các object implement annotation interface đó**. Một công cụ sẽ **gọi method `timeout`** để lấy element `timeout` của một annotation `Test` cụ thể.

> *"The Target and Retention annotations are meta-annotations. They annotate the Test annotation, marking it as an annotation that can be applied to methods only and is retained when the class file is loaded into the virtual machine. We'll discuss these in detail in Section 8.5.3, "Meta-Annotations," on p. 481."*

**Dịch:** `Target` và `Retention` là **meta-annotation**. Chúng **annotate chính annotation `Test`**, đánh dấu nó là annotation **chỉ áp được lên method** và **được giữ lại khi file class được load vào virtual machine**. Chi tiết ở [[05 - Standard Annotations]].

> *"You have now seen the basic concepts of program metadata and annotations. In the next section, we'll walk through a concrete example of annotation processing."*

**Dịch:** Đến đây bạn đã thấy **khái niệm cơ bản về program metadata và annotation**.

> **Note (sách):** *"For a compelling use of annotations, check out JCommander (http://jcommander.org) and picocli (http://picocli.info). These libraries use annotations for the processing of command-line parameters."*
>
> **Dịch:** Một ứng dụng thuyết phục của annotation: **JCommander** và **picocli** — hai library **dùng annotation để xử lý command-line parameter**.

---

## 8.3.2. An Example: Annotating Event Handlers

> *"One of the more boring tasks in user interface programming is the wiring of listeners to event sources. Many listeners are of the form"*

```java
myButton.addActionListener(() -> doSomething());
```

> *"In this section, we'll design an annotation to reverse the wiring. The annotation, defined in Listing 8.8, is used as follows:"*

```java
@ActionListenerFor(source="myButton") void doSomething() { . . . }
```

**Dịch:** Một trong những việc **chán nhất khi lập trình giao diện** là **nối listener vào event source**. Ở mục này sách thiết kế một annotation để **đảo ngược chiều nối**.

> *"The programmer no longer has to make calls to addActionListener. Instead, each method is tagged with an annotation. Listing 8.7 shows the ButtonFrame class from Volume I, Chapter 10, reimplemented with these annotations."*

**Dịch:** Lập trình viên **không còn phải gọi `addActionListener`** nữa; thay vào đó **mỗi method được gắn tag bằng một annotation**.

> *"We also need to define an annotation interface. The code is in Listing 8.8."*

> *"Of course, the annotations don't do anything by themselves. They sit in the source file. The compiler places them in the class file, and the virtual machine loads them. We now need a mechanism to analyze them and install action listeners. That is the job of the ActionListenerInstaller class. The ButtonFrame constructor calls"*

```java
ActionListenerInstaller.processAnnotations(this);
```

**Dịch:** Dĩ nhiên **bản thân annotation không làm gì**. Chúng **nằm trong file source**; **compiler đặt chúng vào file class**, và **virtual machine load chúng**. Ta cần một **cơ chế phân tích chúng và cài đặt action listener** — đó là việc của class `ActionListenerInstaller`.

> *"The static processAnnotations method enumerates all methods of the object it received. For each method, it gets the ActionListenerFor annotation object and processes it."*

```java
Class<?> cl = obj.getClass();
for (Method m : cl.getDeclaredMethods())
{
    ActionListenerFor a = m.getAnnotation(ActionListenerFor.class);
    if (a != null) . . .
}
```

**Dịch:** Static method `processAnnotations` **liệt kê mọi method của object nó nhận được**. Với mỗi method, nó **lấy object annotation `ActionListenerFor` và xử lý**.

> *"Here, we use the getAnnotation method defined in the AnnotatedElement interface. The classes Method, Constructor, Field, Class, and Package implement this interface."*

**Dịch:** Ở đây dùng method **`getAnnotation`** định nghĩa trong interface **`AnnotatedElement`**. Các class **`Method`, `Constructor`, `Field`, `Class`, và `Package`** đều implement interface này. (Xem [[10 - Reflection]] ở Volume I.)

> *"The name of the source field is stored in the annotation object. We retrieve it by calling the source method, and then look up the matching field."*

```java
String fieldName = a.source();
Field f = cl.getDeclaredField(fieldName);
```

> *"This shows a limitation of our annotation. The source element must be the name of a field. It cannot be a local variable."*

**Dịch:** Tên của field nguồn **được lưu trong object annotation**. Ta lấy nó bằng cách gọi method `source`, rồi **tra ra field khớp**. Điều này cho thấy một **hạn chế**: element `source` **phải là tên của một field**, **không thể là local variable**.

> *"The remainder of the code is rather technical. For each annotated method, we construct a proxy object, implementing the ActionListener interface, with an actionPerformed method that calls the annotated method. (For more information about proxies, see Volume I, Chapter 6.) The details are not important. The key observation is that the functionality of the annotations was established by the processAnnotations method."*

**Dịch:** Phần code còn lại **khá kỹ thuật**. Với mỗi method được annotate, ta **dựng một proxy object implement interface `ActionListener`**, với method `actionPerformed` **gọi tới method được annotate**. Chi tiết không quan trọng; **điều mấu chốt là chức năng của annotation được thiết lập bởi method `processAnnotations`**.

> *"Figure 8.1 shows how annotations are handled in this example."*

**Figure 8.1: Processing annotations at runtime**

```
                                                          ┌──────────────────┐
                                                          │ Program uses     │
                                                          │ reflection API   │
                                                          │ to process       │
                                                          │ annotations      │
                                                          └────────┬─────────┘
                                                                   │
                                                            ┌──────┘
                                                            │
 ┌─────────────────────┐    ┌────────────────┐    ┌─────────────────────┐    ┌───────────────────────┐
 │ @ActionListenerFor  │───▶│ Java Compiler  │───▶│ @ActionListenerFor  │───▶│ Java Virtual Machine  │
 └─────────────────────┘    └────────────────┘    └─────────────────────┘    └───────────────────────┘
   Source File                                      Class File
```

> *"In this example, the annotations were processed at runtime. It is also possible to process them at the source level: A source code generator would then produce the code for adding the listeners. Alternatively, the annotations can be processed at the bytecode level: A bytecode editor could inject the calls to addActionListener into the frame constructor. This sounds complex, but libraries are available to make this task relatively straightforward. You can see an example in Section 8.7, "Bytecode Engineering," on p. 489."*

**Dịch:** Trong ví dụ này, annotation **được xử lý lúc runtime**. Cũng có thể xử lý **ở mức source**: một **source code generator** sẽ sinh code thêm listener. Hoặc xử lý **ở mức bytecode**: một **bytecode editor** có thể **tiêm các lời gọi `addActionListener` vào constructor của frame**. Nghe phức tạp, nhưng **có sẵn library làm việc này khá đơn giản** — xem [[07 - Bytecode Engineering]].

> *"Our example was not intended as a serious tool for user interface programmers. A utility method for adding a listener could be just as convenient for the programmer as the annotation. (In fact, the java.beans.EventHandler class tries to do just that. You could make the class truly useful by supplying a method that adds the event handler instead of just constructing it.)"*

**Dịch:** Ví dụ này **không nhằm làm một công cụ nghiêm túc** cho lập trình viên giao diện. Một **utility method thêm listener** cũng tiện chẳng kém annotation. (Thực tế class **`java.beans.EventHandler`** cố làm đúng điều đó.)

> *"However, this example shows the mechanics of annotating a program and of analyzing the annotations. Having seen a concrete example, you are now more prepared (we hope) for the following sections that describe the annotation syntax in complete detail."*

**Dịch:** Tuy vậy, ví dụ này cho thấy **cơ chế annotate một chương trình và phân tích annotation**.

### Listing 8.6 — `runtimeAnnotations/ActionListenerInstaller.java`

```java
package runtimeAnnotations;

import java.awt.event.*;
import java.lang.reflect.*;

/**
 * @version 1.00 2004-08-17
 * @author Cay Horstmann
 */
public class ActionListenerInstaller
{
    /**
     * Processes all ActionListenerFor annotations in the given object.
     * @param obj an object whose methods may have ActionListenerFor annotations
     */
    public static void processAnnotations(Object obj)
    {
        try
        {
            Class<?> cl = obj.getClass();
            for (Method m : cl.getDeclaredMethods())
            {
                ActionListenerFor a = m.getAnnotation(ActionListenerFor.class);
                if (a != null)
                {
                    Field f = cl.getDeclaredField(a.source());
                    f.setAccessible(true);
                    addListener(f.get(obj), obj, m);
                }
            }
        }
        catch (ReflectiveOperationException e)
        {
            e.printStackTrace();
        }
    }

    /**
     * Adds an action listener that calls a given method.
     * @param source the event source to which an action listener is added
     * @param param the implicit parameter of the method that the listener calls
     * @param m the method that the listener calls
     */
    public static void addListener(Object source, final Object param, final Method m)
            throws ReflectiveOperationException
    {
        var handler = new InvocationHandler()
        {
            public Object invoke(Object proxy, Method mm, Object[] args) throws Throwable
            {
                return m.invoke(param);
            }
        };

        Object listener = Proxy.newProxyInstance(null,
            new Class[] { java.awt.event.ActionListener.class }, handler);
        Method adder = source.getClass().getMethod("addActionListener", ActionListener.class);
        adder.invoke(source, listener);
    }
}
```

### Listing 8.7 — `buttons3/ButtonFrame.java`

```java
package buttons3;

import java.awt.*;
import javax.swing.*;
import runtimeAnnotations.*;

/**
 * A frame with a button panel.
 * @version 1.00 2004-08-17
 * @author Cay Horstmann
 */
public class ButtonFrame extends JFrame
{
    private static final int DEFAULT_WIDTH = 300;
    private static final int DEFAULT_HEIGHT = 200;

    private JPanel panel;
    private JButton yellowButton;
    private JButton blueButton;
    private JButton redButton;

    public ButtonFrame()
    {
        setSize(DEFAULT_WIDTH, DEFAULT_HEIGHT);

        panel = new JPanel();
        add(panel);

        yellowButton = new JButton("Yellow");
        blueButton = new JButton("Blue");
        redButton = new JButton("Red");

        panel.add(yellowButton);
        panel.add(blueButton);
        panel.add(redButton);

        ActionListenerInstaller.processAnnotations(this);
    }

    @ActionListenerFor(source = "yellowButton")
    public void yellowBackground()
    {
        panel.setBackground(Color.YELLOW);
    }

    @ActionListenerFor(source = "blueButton")
    public void blueBackground()
    {
        panel.setBackground(Color.BLUE);
    }

    @ActionListenerFor(source = "redButton")
    public void redBackground()
    {
        panel.setBackground(Color.RED);
    }
}
```

### Listing 8.8 — `runtimeAnnotations/ActionListenerFor.java`

```java
package runtimeAnnotations;

import java.lang.annotation.*;

/**
 * @version 1.00 2004-08-17
 * @author Cay Horstmann
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface ActionListenerFor
{
    String source();
}
```

---

## API tham chiếu

### `java.lang.reflect.AnnotatedElement` 5.0

| Method | Mô tả (sách) |
|---|---|
| `boolean isAnnotationPresent(Class<? extends Annotation> annotationType)` | returns `true` if this item has an annotation of the given type. |
| `<T extends Annotation> T getAnnotation(Class<T> annotationType)` | gets the annotation of the given type, or `null` if this item has no such annotation. |
| `<T extends Annotation> T[] getAnnotationsByType(Class<T> annotationType)` **8** | gets all annotations of a repeatable annotation type, or an array of length 0. |
| `Annotation[] getAnnotations()` | gets all annotations present for this item, **including inherited annotations**. If no annotations are present, an array of length 0 is returned. |
| `Annotation[] getDeclaredAnnotations()` | gets all annotations declared for this item, **excluding inherited annotations**. If no annotations are present, an array of length 0 is returned. |

---

## Bài kế tiếp

→ [[04 - Annotation Syntax]] — annotation interface, cú pháp annotation, annotate declaration, annotate type use, annotate `this`.
