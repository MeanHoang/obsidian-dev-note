# 04 — Annotation Syntax

> Chapter 8, Section 8.4 — Core Java Volume II: Advanced Features, 11th Edition (Horstmann), Java 11.
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

> Chủ đề này Volume I cũng có, viết ở bản khác: xem [[02 - Defining Annotations]] (Vol I).

---

## 8.4. Annotation Syntax

> *"In the following sections, we cover everything you need to know about the annotation syntax."*

**Dịch:** Các mục sau bao quát **mọi thứ cần biết về cú pháp annotation**.

---

## 8.4.1. Annotation Interfaces

> *"An annotation is defined by an annotation interface:"*

```java
modifiers @interface AnnotationName
{
    elementDeclaration1
    elementDeclaration2
    . . .
}
```

> *"Each element declaration has the form"*

```java
type elementName();
```

> *"or"*

```java
type elementName() default value;
```

**Dịch:** **Một annotation được định nghĩa bởi một annotation interface.** Mỗi **element declaration** có một trong hai dạng trên (có hoặc không có `default`).

> *"For example, the following annotation has two elements, assignedTo and severity:"*

```java
public @interface BugReport
{
    String assignedTo() default "[none]";
    int severity();
}
```

**Dịch:** Annotation trên có **hai element**: `assignedTo` và `severity`.

> *"All annotation interfaces implicitly extend the java.lang.annotation.Annotation interface. That interface is a regular interface, not an annotation interface. See the API notes at the end of this section for the methods provided by this interface."*

**Dịch:** **Mọi annotation interface đều ngầm extend interface `java.lang.annotation.Annotation`.** Interface đó là **một interface bình thường, không phải annotation interface**.

> *"You cannot extend an annotation interface—in other words, all annotation interfaces directly extend java.lang.annotation.Annotation. You never supply classes that implement annotation interfaces."*

**Dịch:** **Bạn không extend được một annotation interface** — nói cách khác, **mọi annotation interface đều extend trực tiếp `java.lang.annotation.Annotation`**. Bạn **không bao giờ tự cung cấp class implement annotation interface**. (Xem [[01 - Interfaces]] ở Volume I.)

> *"The methods of an annotation interface have no parameters and no throws clauses. They cannot be default or static methods, and they cannot have type parameters."*

**Dịch:** Method của annotation interface **không có parameter và không có mệnh đề `throws`**. Chúng **không được là default method hay static method**, và **không có type parameter**.

### Kiểu hợp lệ cho element

> *"The type of an annotation element is one of the following:"*
>
> - *"A primitive type (int, short, long, byte, char, double, float, or boolean)"*
> - *"String"*
> - *"Class (with an optional type parameter such as Class<? extends MyClass>)"*
> - *"An enum type"*
> - *"An annotation type"*
> - *"An array of the preceding types (an array of arrays is not a legal element type)"*

**Dịch:** Kiểu của một annotation element là một trong:

| Kiểu |
|---|
| **primitive type** (`int`, `short`, `long`, `byte`, `char`, `double`, `float`, `boolean`) |
| **`String`** |
| **`Class`** (có thể kèm type parameter, ví dụ `Class<? extends MyClass>`) |
| một **enum type** |
| một **annotation type** |
| **array của các kiểu trên** (**array của array không phải kiểu element hợp lệ**) |

> *"Here are examples of valid element declarations:"*

```java
public @interface BugReport
{
    enum Status { UNCONFIRMED, CONFIRMED, FIXED, NOTABUG };
    boolean showStopper() default false;
    String assignedTo() default "[none]";
    Class<?> testCase() default Void.class;
    Status status() default Status.UNCONFIRMED;
    Reference ref() default @Reference(); // an annotation type
    String[] reportedBy();
}
```

### API: `java.lang.annotation.Annotation` 5.0

| Method | Mô tả (sách) |
|---|---|
| `Class<? extends Annotation> annotationType()` | returns the `Class` object that represents the annotation interface of this annotation object. Note that calling `getClass` on an annotation object would return the actual class, not the interface. |
| `boolean equals(Object other)` | returns `true` if `other` is an object that implements the same annotation interface as this annotation object and if all elements of this object and `other` are equal. |
| `int hashCode()` | returns a hash code, compatible with the `equals` method, derived from the name of the annotation interface and the element values. |
| `String toString()` | returns a string representation that contains the annotation interface name and the element values, for example `@BugReport(assignedTo=[none], severity=0)`. |

---

## 8.4.2. Annotations

> *"Each annotation has the format"*

```java
@AnnotationName(elementName1=value1, elementName2=value2, . . .)
```

> *"For example,"*

```java
@BugReport(assignedTo="Harry", severity=10)
```

> *"The order of the elements does not matter. The annotation"*

```java
@BugReport(severity=10, assignedTo="Harry")
```

> *"is identical to the preceding one."*

**Dịch:** **Thứ tự các element không quan trọng** — hai annotation trên **giống hệt nhau**.

> *"The default value of the declaration is used if an element value is not specified. For example, consider the annotation"*

```java
@BugReport(severity=10)
```

> *"The value of the assignedTo element is the string "[none]"."*

**Dịch:** **Giá trị `default` trong khai báo được dùng nếu không chỉ định giá trị element.**

> **Caution (sách):** *"Defaults are not stored with the annotation; instead, they are dynamically computed. For example, if you change the default for the assignedTo element to "[]" and recompile the BugReport interface, the annotation @BugReport(severity=10) will use the new default, even in class files that have not been recompiled after the default changed."*
>
> **Dịch:** **Giá trị default không được lưu cùng annotation**; chúng **được tính động (dynamically computed)**. Nếu bạn đổi default của element `assignedTo` thành `"[]"` rồi recompile interface `BugReport`, thì annotation `@BugReport(severity=10)` sẽ **dùng default mới**, **kể cả trong những file class chưa được recompile sau khi default thay đổi**.

### Hai lối viết tắt

> *"Two special shortcuts can simplify annotations."*

> *"If no elements are specified, either because the annotation doesn't have any or because all of them use the default value, you don't need to use parentheses. For example,"*

```java
@BugReport
```

> *"is the same as"*

```java
@BugReport(assignedTo="[none]", severity=0)
```

> *"Such an annotation is called a marker annotation."*

**Dịch:** Nếu **không chỉ định element nào** — vì annotation không có element nào, hoặc vì mọi element đều dùng giá trị default — thì **không cần ngoặc đơn**. Annotation như vậy gọi là **marker annotation**.

> *"The other shortcut is the single-value annotation. If an element has the special name value and no other element is specified, you can omit the element name and the = symbol. For example, had we defined the ActionListenerFor annotation interface of the preceding section as"*

```java
public @interface ActionListenerFor
{
    String value();
}
```

> *"then the annotations could be written as"*

```java
@ActionListenerFor("yellowButton")
```

> *"instead of"*

```java
@ActionListenerFor(value="yellowButton")
```

**Dịch:** Lối tắt thứ hai là **single-value annotation**. Nếu một element có **cái tên đặc biệt `value`** và **không element nào khác được chỉ định**, bạn **bỏ được tên element và dấu `=`**.

### Nhiều annotation, annotation lặp lại

> *"An item can have multiple annotations:"*

```java
@Test
@BugReport(showStopper=true, reportedBy="Joe")
public void checkRandomInsertions()
```

> *"If the author of an annotation declared it to be repeatable, you can repeat the same annotation multiple times:"*

```java
@BugReport(showStopper=true, reportedBy="Joe")
@BugReport(reportedBy={"Harry", "Carl"})
public void checkRandomInsertions()
```

**Dịch:** **Một item có nhiều annotation được.** Nếu tác giả annotation **khai báo nó là repeatable** thì bạn **lặp lại cùng một annotation nhiều lần được**.

> **Note (sách):** *"Since annotations are evaluated by the compiler, all element values must be compile-time constants. For example,"*
>
> ```java
> @BugReport(showStopper=true, assignedTo="Harry", testCase=MyTestCase.class,
>     status=BugReport.Status.CONFIRMED, . . .)
> ```
>
> **Dịch:** Vì **annotation được compiler đánh giá**, **mọi giá trị element phải là compile-time constant**.

> **Caution (sách):** *"An annotation element can never be set to null. Not even a default of null is permissible. This can be rather inconvenient in practice. You will need to find other defaults, such as "" or Void.class."*
>
> **Dịch:** Một annotation element **không bao giờ được set thành `null`**. Ngay cả **default là `null` cũng không cho phép**. Thực tế điều này **khá bất tiện** — bạn phải **tìm default khác**, ví dụ `""` hay `Void.class`.

### Element kiểu array và annotation lồng nhau

> *"If an element value is an array, enclose its values in braces:"*

```java
@BugReport(. . ., reportedBy={"Harry", "Carl"})
```

> *"You can omit the braces if the element has a single value:"*

```java
@BugReport(. . ., reportedBy="Joe") // OK, same as {"Joe"}
```

**Dịch:** Nếu giá trị element là **array** thì **bọc các giá trị trong dấu ngoặc nhọn**. **Bỏ được ngoặc nhọn nếu element chỉ có một giá trị.**

> *"Since an annotation element can be another annotation, you can build arbitrarily complex annotations. For example,"*

```java
@BugReport(ref=@Reference(id="3352627"), . . .)
```

**Dịch:** Vì một annotation element **có thể là một annotation khác**, bạn **dựng được annotation phức tạp tuỳ ý**.

> **Note (sách):** *"It is an error to introduce circular dependencies in annotations. For example, BugReport has an element of the annotation type Reference, therefore Reference cannot have an element of type BugReport."*
>
> **Dịch:** **Đưa phụ thuộc vòng (circular dependency) vào annotation là lỗi.** Ví dụ `BugReport` có một element kiểu annotation `Reference`, nên **`Reference` không được có element kiểu `BugReport`**.

---

## 8.4.3. Annotating Declarations

> *"There are many places where annotations can occur. They fall into two categories: declarations and type uses. Declaration annotations can appear at the declarations of"*
>
> - *"Packages"*
> - *"Classes (including enum)"*
> - *"Interfaces (including annotation interfaces)"*
> - *"Methods"*
> - *"Constructors"*
> - *"Instance fields (including enum constants)"*
> - *"Local variables"*
> - *"Parameter variables"*
> - *"Type parameters"*

**Dịch:** Annotation xuất hiện được ở **rất nhiều chỗ**, chia làm **hai loại: declaration và type use**. **Declaration annotation** xuất hiện được ở khai báo của:

| Nơi khai báo |
|---|
| **Package** |
| **Class** (kể cả `enum`) |
| **Interface** (kể cả annotation interface) |
| **Method** |
| **Constructor** |
| **Instance field** (kể cả enum constant) |
| **Local variable** |
| **Parameter variable** |
| **Type parameter** |

> *"For classes and interfaces, put the annotations before the class or interface keyword:"*

```java
@Entity public class User { . . . }
```

> *"For variables, put them before the type:"*

```java
@SuppressWarnings("unchecked") List<User> users = . . .;
public User getUser(@Param("id") String userId)
```

> *"A type parameter in a generic class or method can be annotated like this:"*

```java
public class Cache<@Immutable V> { . . . }
```

**Dịch:** Với **class và interface**, đặt annotation **trước keyword `class` hay `interface`**. Với **variable**, đặt **trước kiểu**. **Type parameter** trong generic class/method annotate như trên.

> *"A package is annotated in a file package-info.java that contains only the package statement preceded by annotations."*

```java
/**
   Package-level Javadoc
*/
@GPL(version="3")
package com.horstmann.corejava;
import org.gnu.GPL;
```

**Dịch:** **Package được annotate trong một file `package-info.java`** chỉ chứa **câu lệnh `package` có annotation đứng trước**. (Xem [[08 - Packages]] ở Volume I.)

> **Note (sách):** *"Annotations for local variables can only be processed at the source level. Class files do not describe local variables. Therefore, all local variable annotations are discarded when a class is compiled. Similarly, annotations for packages are not retained beyond the source level."*
>
> **Dịch:** Annotation cho **local variable chỉ xử lý được ở mức source**. **File class không mô tả local variable**, nên **mọi local variable annotation bị bỏ đi khi class được compile**. Tương tự, **annotation cho package không được giữ lại quá mức source**.

---

## 8.4.4. Annotating Type Uses

> *"A declaration annotation provides some information about the item being declared. For example, in the declaration"*

```java
public User getUser(@NonNull String userId)
```

> *"it is asserted that the userId parameter is not null."*

**Dịch:** **Declaration annotation cung cấp thông tin về item đang được khai báo.** Ở ví dụ trên, **khẳng định rằng parameter `userId` không null**.

> **Note (sách):** *"The @NonNull annotation is a part of the Checker Framework (https://checkerframework.org). With that framework, you can include assertions in your program—for example, that a parameter is non-null or that a String contains a regular expression. A static analysis tool then checks whether the assertions are valid in a given body of source code."*
>
> **Dịch:** Annotation `@NonNull` thuộc **Checker Framework**. Với framework đó, bạn **đưa assertion vào chương trình** — ví dụ một parameter là non-null, hay một `String` chứa một regular expression. Rồi một **công cụ static analysis kiểm tra xem các assertion có hợp lệ** trong một khối source code hay không.

> *"Now, suppose we have a parameter of type List<String>, and we want to express that all of the strings are non-null. That is where type use annotations come in. Place the annotation before the type argument: List<@NonNull String>."*

**Dịch:** Giả sử có một parameter kiểu `List<String>` và ta muốn diễn đạt rằng **mọi string đều non-null**. Đó là lúc **type use annotation** vào cuộc: **đặt annotation trước type argument**.

> *"Type use annotations can appear in the following places:"*
>
> - *"With generic type arguments: `List<@NonNull String>`, `Comparator.<@NonNull String>reverseOrder()`."*
> - *"In any position of an array: `@NonNull String[][] words` (`words[i][j]` is not null), `String @NonNull [][] words` (`words` is not null), `String[] @NonNull [] words` (`words[i]` is not null)."*
> - *"With superclasses and implemented interfaces: `class Warning extends @Localized Message`."*
> - *"With constructor invocations: `new @Localized String(. . .)`."*
> - *"With casts and instanceof checks: `(@Localized String) text`, `if (text instanceof @Localized String)`. (The annotations are only for use by external tools. They have no effect on the behavior of a cast or an instanceof check.)"*
> - *"With exception specifications: `public String read() throws @Localized IOException`."*
> - *"With wildcards and type bounds: `List<@Localized ? extends Message>`, `List<? extends @Localized Message>`."*
> - *"With method and constructor references: `@Localized Message::getText`."*

**Dịch:** Type use annotation xuất hiện được ở:

| Vị trí | Ví dụ |
|---|---|
| **generic type argument** | `List<@NonNull String>`, `Comparator.<@NonNull String>reverseOrder()` |
| **bất kỳ vị trí nào của array** | `@NonNull String[][] words` (`words[i][j]` không null) · `String @NonNull [][] words` (`words` không null) · `String[] @NonNull [] words` (`words[i]` không null) |
| **superclass và interface được implement** | `class Warning extends @Localized Message` |
| **lời gọi constructor** | `new @Localized String(. . .)` |
| **cast và kiểm tra `instanceof`** | `(@Localized String) text`, `if (text instanceof @Localized String)` — annotation **chỉ dành cho công cụ bên ngoài dùng**, **không ảnh hưởng gì tới hành vi** của cast hay `instanceof` |
| **exception specification** | `public String read() throws @Localized IOException` |
| **wildcard và type bound** | `List<@Localized ? extends Message>`, `List<? extends @Localized Message>` |
| **method reference và constructor reference** | `@Localized Message::getText` |

> *"There are a few type positions that cannot be annotated:"*

```java
@NonNull String.class // ERROR: Cannot annotate class literal
import java.lang.@NonNull String; // ERROR: Cannot annotate import
```

**Dịch:** Có **vài vị trí kiểu không annotate được**: **class literal** và **import**.

> *"You can place annotations before or after other modifiers such as private and static. It is customary (but not required) to put type use annotations after other modifiers, and declaration annotations before other modifiers. For example,"*

```java
private @NonNull String text; // Annotates the type use
@Id private String userId;    // Annotates the variable
```

**Dịch:** Bạn **đặt annotation trước hoặc sau các modifier khác** như `private`, `static` đều được. **Thông lệ (không bắt buộc)**: **type use annotation đặt sau** các modifier khác, **declaration annotation đặt trước**.

> **Note (sách):** *"An annotation author needs to specify where a particular annotation can appear. If an annotation is permissible both for a variable and a type use, and it is used in a variable declaration, then both the variable and the type use are annotated. For example, consider"*
>
> ```java
> public User getUser(@NonNull String userId)
> ```
>
> *"If @NonNull can apply both to parameters and to type uses, the userId parameter is annotated, and the parameter type is @NonNull String."*
>
> **Dịch:** **Tác giả annotation phải chỉ định annotation đó xuất hiện được ở đâu.** Nếu một annotation **hợp lệ cho cả variable lẫn type use**, và nó **được dùng trong khai báo variable**, thì **cả variable lẫn type use đều được annotate**.

---

## 8.4.5. Annotating `this`

> *"Suppose you want to annotate parameters that are not being mutated by a method."*

```java
public class Point
{
    public boolean equals(@ReadOnly Object other) { . . . }
}
```

> *"Then a tool that processes this annotation would, upon seeing a call"*
>
> ```java
> p.equals(q)
> ```
>
> *"reason that q has not been changed."*

**Dịch:** Giả sử bạn muốn **annotate các parameter không bị method mutate**. Khi đó một công cụ xử lý annotation này, khi thấy lời gọi `p.equals(q)`, sẽ **suy ra rằng `q` không bị thay đổi**.

> *"But what about p?"*

> *"When the method is called, the this variable is bound to p. But this is never declared, so you cannot annotate it."*

**Dịch:** **Nhưng còn `p` thì sao?** Khi method được gọi, **biến `this` được bind vào `p`**. Nhưng **`this` không bao giờ được khai báo**, nên **không annotate được nó**.

> *"Actually, you can declare it, with a rarely used syntax variant, just so that you can add an annotation:"*

```java
public class Point
{
    public boolean equals(@ReadOnly Point this, @ReadOnly Object other) { . . . }
}
```

> *"The first parameter is called the receiver parameter. It must be named this. Its type is the class that is being constructed."*

**Dịch:** Thực ra **bạn khai báo được nó**, bằng một **biến thể cú pháp hiếm dùng**, chỉ để **thêm annotation vào**. Parameter đầu tiên gọi là **receiver parameter**. Nó **bắt buộc phải tên là `this`**, và **kiểu của nó là class đang được dựng**.

> **Note (sách):** *"You can provide a receiver parameter only for methods, not for constructors. Conceptually, the this reference in a constructor is not an object of the given type until the constructor has completed. Instead, an annotation placed on the constructor describes a property of the constructed object."*
>
> **Dịch:** Bạn **chỉ cung cấp được receiver parameter cho method, không cho constructor**. Về mặt khái niệm, **reference `this` trong một constructor chưa phải là object của kiểu đã cho cho tới khi constructor hoàn tất**. Thay vào đó, **annotation đặt lên constructor mô tả một thuộc tính của object được dựng ra**.

> *"A different hidden parameter is passed to the constructor of an inner class, namely the reference to the enclosing class object. You can make that parameter explicit as well:"*

```java
public class Sequence
{
    private int from;
    private int to;

    class Iterator implements java.util.Iterator<Integer>
    {
        private int current;

        public Iterator(@ReadOnly Sequence Sequence.this)
        {
            this.current = Sequence.this.from;
        }
        . . .
    }
    . . .
}
```

> *"The parameter must be named just like when you refer to it, EnclosingClass.this, and its type is the enclosing class."*

**Dịch:** Một **hidden parameter khác được truyền cho constructor của inner class**, đó là **reference tới object của enclosing class**. Bạn **làm parameter đó tường minh được** luôn. Parameter **phải được đặt tên đúng như khi bạn tham chiếu tới nó**, tức `EnclosingClass.this`, và **kiểu của nó là enclosing class**.

---

## Bài kế tiếp

→ [[05 - Standard Annotations]] — bảng annotation chuẩn, annotation cho compilation, quản lý resource, và meta-annotation.
