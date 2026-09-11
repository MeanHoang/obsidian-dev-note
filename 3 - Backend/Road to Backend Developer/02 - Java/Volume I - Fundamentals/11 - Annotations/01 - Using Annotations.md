# 01 — Using Annotations

> Chapter 11, Section 11.1 — Core Java Volume I, 13th Edition (Horstmann).
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## Mở đầu chương 11 — Annotations

> *"Annotations are tags that you insert into your source code so that some tool can process them. The tools can operate on the source level, or they can process class files into which the compiler has placed annotations."*

**Dịch:** **Annotation là các tag bạn chèn vào source code để một công cụ nào đó xử lý chúng.** Công cụ có thể làm việc **ở mức source**, hoặc **xử lý file class** — nơi compiler đã đặt annotation vào.

> *"Annotations do not change the way your programs are compiled. The Java compiler generates the same virtual machine instructions with or without the annotations."*

**Dịch:** **Annotation không làm thay đổi cách chương trình được compile.** Java compiler sinh ra **đúng những virtual machine instruction như nhau**, có hay không có annotation.

> *"To benefit from annotations, you need to select a processing tool and use annotations that your processing tool understands, before you can apply that tool to your code."*

**Dịch:** Muốn hưởng lợi từ annotation, bạn phải **chọn một processing tool** và **dùng những annotation mà tool đó hiểu**, rồi mới áp tool ấy lên code của mình.

> *"There is a wide range of uses for annotations. For example, JUnit (available at https://junit.org) uses annotations to mark methods that execute tests and to specify how the tests should be run. Jakarta Persistence (https://jakarta.ee/specifications/persistence/) uses annotations to define mappings between classes and database tables, so that objects can be persisted automatically without the developer having to write SQL queries."*

**Dịch:** Annotation có **rất nhiều công dụng**. Ví dụ **JUnit** dùng annotation để **đánh dấu method chạy test** và **quy định cách chạy test**. **Jakarta Persistence** dùng annotation để **định nghĩa ánh xạ giữa class và bảng database**, nhờ đó object được persist tự động mà lập trình viên **không phải viết SQL query**.

> *"In this chapter, you will learn the details of the annotation syntax, how to define your own annotations, and how to write annotation processors."*

**Dịch:** Trong chương này bạn sẽ học **chi tiết cú pháp annotation**, cách **tự định nghĩa annotation**, và cách **viết annotation processor**.

> **Note (sách):** *"For a compelling use of annotations, check out JCommander (https://jcommander.org) and picocli (https://picocli.info). These libraries use annotations for the processing of command-line arguments."*
>
> **Dịch:** Muốn thấy một ứng dụng thuyết phục của annotation thì xem **JCommander** và **picocli**. Các library này dùng annotation để **xử lý command-line argument**.

---

## 11.1. Using Annotations

> *"Here is an example of a simple annotation:"*

```java
class CacheTest
{
    . . .
    @Test void checkRandomInsertions()
}
```

> *"The annotation @Test annotates the checkRandomInsertions method. In Java, an annotation is used like a modifier (such as public or static). The name of each annotation is preceded by an @ symbol."*

**Dịch:** Annotation `@Test` **annotate cho method** `checkRandomInsertions`. Trong Java, annotation **được dùng như một modifier** (kiểu `public` hay `static`). Tên mỗi annotation **đứng sau ký hiệu `@`**.

> *"By itself, the @Test annotation does not do anything. It needs a tool to be useful. When running JUnit, it finds the methods that are annotated with @Test and calls them."*

**Dịch:** **Bản thân `@Test` không làm gì cả.** Nó **cần một tool** thì mới có tác dụng. Khi chạy JUnit, JUnit **tìm các method được annotate bằng `@Test` rồi gọi chúng**.

---

## 11.1.1. Annotation Elements

> *"Annotations can have key/value pairs called elements, such as"*

```java
@RepeatedTest(value=10, failureThreshold=3)
```

**Dịch:** Annotation có thể mang các **cặp key/value gọi là element**.

> *"The names and types of the permissible elements are defined by each annotation (see Section 11.2). The elements can be processed by the tools that read the annotations."*

**Dịch:** **Tên và kiểu của các element hợp lệ là do từng annotation định nghĩa** (xem Section 11.2). Element được **các tool đọc annotation** xử lý.

> *"An annotation element is one of the following:"*
> - *"A primitive type value"*
> - *"A String"*
> - *"A Class object"*
> - *"An instance of an enum"*
> - *"An annotation"*
> - *"An array of the preceding (but not an array of arrays)"*

**Dịch:** Một annotation element là một trong các thứ sau:

| Kiểu element được phép |
|---|
| Giá trị kiểu **primitive** |
| Một **`String`** |
| Một **`Class` object** |
| Một **instance của enum** |
| Một **annotation** |
| **Array** của các thứ trên (**nhưng không phải array của array**) |

> *"To illustrate these possibilities, here is a @BugReport annotation, not from an actual library:"*

```java
@BugReport(showStopper=true,
    assignedTo="Harry",
    testCase=CacheTest.class,
    status=BugReport.Status.CONFIRMED,
    ref=@Reference(id=11235811),
    reportedBy={"Harry", "Fred"})
```

**Dịch:** Để minh hoạ các khả năng đó, đây là annotation `@BugReport` — **không lấy từ library thật nào cả**.

> **Note (sách):** *"Since annotations are processed by the compiler, all element values must be compile-time constants."*
>
> **Dịch:** Vì annotation **được compiler xử lý**, mọi giá trị element **phải là compile-time constant**.

> **Caution (sách):** *"An annotation element can never have the value null."*
>
> **Dịch:** Một annotation element **không bao giờ được mang giá trị `null`**.

> *"If an element value is an array with a single element, you can omit the braces:"*

```java
@BugReport(reportedBy="Harry") // Same as reportedBy={"Harry"}
```

**Dịch:** Nếu giá trị element là **array chỉ có một phần tử**, bạn **bỏ được cặp ngoặc nhọn**.

> *"Elements can have default values. For example, the failureThreshold element of the JUnit @RepeatedTest annotation has default Integer.MAX_VALUE. Therefore, the annotation @RepeatedTest(value=10) is equivalent to @RepeatedTest(value=10, failureThreshold=Integer.MAX_VALUE). When running this test, it is repeated ten times, no matter how often it failed."*

**Dịch:** Element **có giá trị mặc định được**. Ví dụ element `failureThreshold` của annotation `@RepeatedTest` trong JUnit có default là `Integer.MAX_VALUE`. Vì vậy `@RepeatedTest(value=10)` **tương đương** `@RepeatedTest(value=10, failureThreshold=Integer.MAX_VALUE)`. Khi chạy test này, nó **lặp mười lần, bất kể fail bao nhiêu lần**.

> *"If the element name is value, and that is the only element you specify, you can omit value=. For example, @RepeatedTest(10) is the same as @RepeatedTest(value=10)."*

**Dịch:** Nếu tên element là **`value`** và đó là **element duy nhất** bạn ghi, thì **bỏ được `value=`**. Ví dụ `@RepeatedTest(10)` **giống hệt** `@RepeatedTest(value=10)`.

---

## 11.1.2. Multiple and Repeated Annotations

> *"An item can have multiple annotations:"*

```java
@Test
@Tag("localized")
void testHello()
```

**Dịch:** Một item **có nhiều annotation được**.

> *"If the author of an annotation declared it to be repeatable, you can repeat the same annotation multiple times:"*

```java
@Tag("localized")
@Tag("showstopper")
void testHello()
```

**Dịch:** Nếu tác giả của annotation **khai báo nó là repeatable**, bạn **lặp lại cùng một annotation nhiều lần được**.

---

## 11.1.3. Annotating Declarations

> *"So far, you have seen annotations applied to method declarations. There are many other places where annotations can occur. They fall into two categories: declarations and type uses. Declaration annotations can appear at the declarations of"*
> - *"Classes (including enum) and interfaces (including annotation interfaces)"*
> - *"Methods"*
> - *"Constructors"*
> - *"Fields (including enum constants and record components)"*
> - *"Local variables (including those declared in for and try-with-resources statements)"*
> - *"Parameter variables and catch clause parameters"*
> - *"Type parameters"*
> - *"Packages and modules"*

**Dịch:** Tới giờ bạn mới thấy annotation đặt lên **khai báo method**. Còn **rất nhiều chỗ khác** annotation xuất hiện được. Chúng chia làm **hai nhóm: declaration và type use**. **Declaration annotation** xuất hiện được ở khai báo của:

| Nơi đặt declaration annotation |
|---|
| **Class** (kể cả `enum`) và **interface** (kể cả annotation interface) — xem [[01 - Interfaces]] |
| **Method** |
| **Constructor** |
| **Field** (kể cả enum constant và **record component**) |
| **Local variable** (kể cả biến khai báo trong `for` và `try`-with-resources) |
| **Parameter variable** và parameter của mệnh đề `catch` |
| **Type parameter** |
| **Package** và **module** — xem [[08 - Packages]] |

> *"For classes, interfaces, and modules, put the annotations before the class, interface, or module keyword and any modifiers:"*

```java
@Entity public class User { . . . }
```

**Dịch:** Với class, interface và module thì **đặt annotation trước keyword** `class` / `interface` / `module` và trước mọi modifier.

> *"For variables, put them before the type:"*

```java
@SuppressWarnings("unchecked") List<User> users = . . .;
public User getUser(@Param("id") String userId)
```

**Dịch:** Với variable thì **đặt annotation trước kiểu**.

> *"This also holds for record components:"*

```java
public record Rectangle(@ToString(includeName=false) Point topLeft,
    int width, int height) {}
```

**Dịch:** Điều này cũng đúng với **record component** — xem [[07 - Records]].

> *"A type parameter in a generic class or method can be annotated like this:"*

```java
public class Cache<@NonNull V> { . . . }
```

**Dịch:** **Type parameter** trong generic class hoặc generic method **được annotate như trên**.

> *"A package is annotated in a file package-info.java that contains only the package statement preceded by annotations."*

```java
/**
   Package-level documentation
*/
@Generated("com.horstmann.generator")
package com.horstmann.corejava.generated;

import javax.annotation.processing.Generated;
```

**Dịch:** Một **package được annotate trong file `package-info.java`**, file này **chỉ chứa câu lệnh `package`** với các annotation đứng trước nó.

> *"Note that the import statement for the annotation comes after the package declaration."*

**Dịch:** Lưu ý **câu lệnh `import` cho annotation nằm SAU khai báo `package`**.

> **Note (sách):** *"Annotations for local variables and packages are discarded when a class is compiled. Therefore, they can only be processed at the source level."*
>
> **Dịch:** Annotation cho **local variable** và **package** **bị bỏ đi khi class được compile**. Vì vậy chúng **chỉ xử lý được ở mức source**.

---

## 11.1.4. Annotating Type Uses

> *"A declaration annotation provides some information about the item being declared. For example, in the declaration"*

```java
public User getUser(@NonNull String userId)
```

> *"it is asserted that the userId parameter is not null."*

**Dịch:** **Declaration annotation cung cấp thông tin về chính item được khai báo.** Ví dụ trong khai báo trên, ta **khẳng định parameter `userId` không phải null**.

> **Note (sách):** *"The @NonNull and @Localized annotations are a part of the Checker Framework (https://types.cs.washington.edu/checker-framework). With that framework, you can include assertions in your program, such that a parameter is non-null or that a String has been localized—that is, adapted to the user's local language and usage. A static analysis tool then checks whether the assertions are valid in a given body of source code."*
>
> **Dịch:** `@NonNull` và `@Localized` là **một phần của Checker Framework**. Với framework này, bạn **đưa được các assertion vào chương trình**, chẳng hạn một parameter là non-null, hoặc một `String` đã được localize — tức đã **thích ứng với ngôn ngữ và cách dùng bản địa của người dùng**. Rồi một **static analysis tool** sẽ **kiểm tra xem các assertion đó có đúng** trong một khối source code cho trước hay không.

> *"Now, suppose we have a parameter of type List\<String>, and we want to express that all of the strings are non-null. That is where type use annotations come in. Place the annotation before the type argument: List<@NonNull String>"*

**Dịch:** Giờ giả sử ta có parameter kiểu `List<String>` và muốn diễn đạt rằng **mọi string trong đó đều non-null**. Đó là lúc **type use annotation** vào cuộc. **Đặt annotation trước type argument**: `List<@NonNull String>`.

> *"Type use annotations can appear in the following places:"*

| Vị trí | Ví dụ trong sách |
|---|---|
| Với **generic type argument** | `List<@NonNull String>`, `Comparator.<@NonNull String> reverseOrder()` |
| Ở **bất kỳ vị trí nào của array** | `@NonNull String[][] words` (`words[i][j]` không null), `String @NonNull [][] words` (`words` không null), `String[] @NonNull [] words` (`words[i]` không null) |
| Với **superclass và interface được implement** | `class Warning extends @Localized Message` |
| Với **constructor invocation** | `new @Localized String(. . .)` |
| Với **nested type** | `Map.@Localized Entry` |
| Với **cast và phép kiểm tra `instanceof`** | `(@Localized String) text`, `if (text instanceof @Localized String)` |
| Với **exception specification** | `public String read() throws @Localized IOException` |
| Với **wildcard type và type bound** | `List<@Localized ? extends Message>`, `List<? extends @Localized Message>` |
| Với **method reference và constructor reference** | `@Localized Message::getText` |

> *"(The annotations are only for use by external tools. They have no effect on the behavior of a cast or an instanceof check.)"*

**Dịch:** (Các annotation này **chỉ dành cho external tool dùng**. Chúng **không ảnh hưởng gì tới hành vi** của một cast hay một phép kiểm tra `instanceof`.)

> *"There are a few type positions that cannot be annotated:"*

```java
@NonNull String.class // Error--cannot annotate class literal
import java.lang.@NonNull String; // Error--cannot annotate import
```

**Dịch:** Có **vài vị trí type không annotate được**: **class literal** và **câu lệnh `import`**.

> *"You can place annotations before or after other modifiers such as private and static. It is customary (but not required) to put type use annotations after other modifiers, and declaration annotations before other modifiers. For example,"*

```java
private @NonNull String text; // Annotates the type use
@Id private String userId; // Annotates the variable
```

**Dịch:** Bạn **đặt annotation trước hay sau các modifier khác** (như `private`, `static`) **đều được**. Theo **thông lệ** (không bắt buộc): **type use annotation đặt SAU** các modifier khác, **declaration annotation đặt TRƯỚC** các modifier khác.

> **Note (sách):** *"As you will see in Section 11.2, an annotation author needs to specify where a particular annotation can appear. If an annotation is permissible both for a variable and a type use, and it is used in a variable declaration, then both the variable and the type use are annotated. For example, consider"*
>
> ```java
> public User getUser(@NonNull String userId)
> ```
>
> *"if @NonNull can apply both to parameters and to type uses, the userId parameter is annotated, and the parameter type is @NonNull String."*
>
> **Dịch:** Như bạn sẽ thấy ở Section 11.2, **tác giả của annotation phải chỉ rõ annotation đó xuất hiện được ở đâu**. Nếu một annotation **được phép cho cả variable lẫn type use**, và nó được dùng trong một khai báo variable, thì **cả variable lẫn type use đều được annotate**. Trong ví dụ trên, nếu `@NonNull` áp được cho cả parameter lẫn type use, thì **parameter `userId` được annotate**, và **kiểu của parameter là `@NonNull String`**.

---

## 11.1.5. Making Receivers Explicit

> *"Suppose you want to annotate parameters that are not being mutated by a method."*

```java
public class Point
{
    public boolean equals(@Nullable Object other) { . . . }
}
```

> *"Then a tool that processes this annotation would, upon seeing a call"*

```java
p.equals(q)
```

> *"reason that q has not been changed."*

**Dịch:** Giả sử bạn muốn annotate **những parameter không bị method mutate**. Khi đó một tool xử lý annotation này, khi thấy lời gọi `p.equals(q)`, sẽ **suy ra rằng `q` không bị thay đổi**.

> *"But what about p?"*

> *"When the method is called, the receiver variable this is bound to p, but this is never declared, so you cannot annotate it."*

**Dịch:** **Nhưng còn `p` thì sao?** Khi method được gọi, **biến receiver `this` được gắn vào `p`**, nhưng **`this` chẳng bao giờ được khai báo cả**, nên **bạn không annotate nó được**.

> *"Actually, you can declare it, with a rarely used syntax variant, just so that you can add an annotation:"*

```java
public class Point
{
    public boolean equals(@NonNull Point this, @Nullable Object other) { . . . }
}
```

> *"The first parameter is called the receiver parameter. It must be named this. Its type is the class that is being constructed."*

**Dịch:** Thực ra **bạn khai báo nó được**, bằng một **biến thể cú pháp rất hiếm dùng**, chỉ để có chỗ thêm annotation. **Parameter đầu tiên gọi là receiver parameter.** Nó **bắt buộc phải tên là `this`**. **Kiểu của nó là class đang được dựng.**

> **Note (sách):** *"You can provide a receiver parameter only for methods, not for constructors. Conceptually, the this reference in a constructor is not an object of the given type until the constructor has completed. Instead, an annotation placed on the constructor describes a property of the constructed object."*
>
> **Dịch:** Bạn **chỉ cung cấp receiver parameter cho method, không cho constructor**. Về mặt khái niệm, reference `this` trong một constructor **chưa phải là object thuộc kiểu đó cho tới khi constructor chạy xong**. Thay vào đó, **annotation đặt trên constructor mô tả một tính chất của object được dựng ra**.

> *"A different hidden parameter is passed to the constructor of an inner class, namely the reference to the enclosing class object. You can make this parameter explicit as well:"*

```java
static class Sequence
{
    private int from;
    private int to;

    class Iterator implements java.util.Iterator<Integer>
    {
        private int current;

        public Iterator(@NonNull Sequence Sequence.this)
        {
            this.current = Sequence.this.from;
        }
        . . .
    }
    . . .
}
```

> *"The parameter must be named just like when you refer to it, EnclosingClass.this, and its type is the enclosing class."*

**Dịch:** Một **hidden parameter khác** được truyền vào constructor của một **inner class**, đó là **reference tới object của enclosing class**. Bạn cũng **làm cho parameter này tường minh được**. Parameter **phải được đặt tên đúng như khi bạn tham chiếu tới nó**, tức `EnclosingClass.this`, và **kiểu của nó là enclosing class**.

---

## Bài kế tiếp

→ [[02 - Defining Annotations]] — khai báo annotation bằng `@interface`, meta-annotation `@Target` / `@Retention`, giá trị default cho element, và interface `java.lang.annotation.Annotation`.
