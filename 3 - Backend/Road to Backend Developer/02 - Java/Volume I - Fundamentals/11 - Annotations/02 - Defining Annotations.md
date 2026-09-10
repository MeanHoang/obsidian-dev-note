# 02 — Defining Annotations

> Chapter 11, Section 11.2 — Core Java Volume I, 13th Edition (Horstmann).
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 11.2. Defining Annotations

> *"Each annotation must be declared by an annotation interface, with the @interface syntax. The methods of the interface correspond to the elements of the annotation. For example, the JUnit Test annotation is defined by the following interface:"*

```java
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface RepeatedTest
{
    int failureThreshold();
    . . .
}
```

**Dịch:** **Mỗi annotation phải được khai báo bằng một annotation interface**, dùng cú pháp **`@interface`**. **Các method của interface tương ứng với các element của annotation.** Ví dụ annotation `Test` của JUnit được định nghĩa bằng interface trên.

> *"The @interface declaration creates an actual Java interface. Tools that process annotations receive objects that implement the annotation interface. When the JUnit test runner tool gets an object that implements RepeatedTest, it simply invokes the failureThreshold method to retrieve the failure threshold of a particular RepeatedTest annotation."*

**Dịch:** Khai báo `@interface` **tạo ra một Java interface thực sự** — xem [[01 - Interfaces]]. Các tool xử lý annotation **nhận về object implement annotation interface đó**. Khi JUnit test runner nhận một object implement `RepeatedTest`, nó **chỉ việc gọi method `failureThreshold`** để lấy failure threshold của annotation `RepeatedTest` cụ thể ấy.

> *"The element declarations in the annotation interface are actually method declarations. The methods of an annotation interface can have no parameters and no throws clauses, and they cannot be generic."*

**Dịch:** Các khai báo element trong annotation interface **thực chất là khai báo method**. Method của một annotation interface **không được có parameter**, **không có mệnh đề `throws`**, và **không được generic**.

---

### Meta-annotation `@Target`

> *"The @Target and @Retention annotations are meta-annotations. They annotate the @RepeatedTest annotation, indicating the places where the annotation can occur and where it can be accessed."*

**Dịch:** `@Target` và `@Retention` là **meta-annotation**. Chúng **annotate cho chính annotation `@RepeatedTest`**, chỉ ra **những nơi annotation đó xuất hiện được** và **nơi nó truy cập được**.

> *"The value of the @Target meta-annotation is an array of ElementType objects, specifying the items to which the annotation can apply. You can specify any number of element types, enclosed in braces. For example,"*

```java
@Target({ElementType.FIELD, ElementType.RECORD_COMPONENT, ElementType.TYPE})
public @interface ToString
```

**Dịch:** Giá trị của meta-annotation `@Target` là một **array các object `ElementType`**, chỉ định **những item mà annotation áp được lên**. Bạn ghi **bao nhiêu element type cũng được**, đặt trong cặp ngoặc nhọn.

> *"Table 11.1 shows all possible targets. The compiler checks that you use an annotation only where permitted. For example, if you apply @ToString to a method, a compile-time error results."*

**Dịch:** Table 11.1 liệt kê **mọi target có thể có**. **Compiler kiểm tra rằng bạn chỉ dùng annotation ở nơi được phép.** Ví dụ nếu áp `@ToString` lên một method thì **sinh compile-time error**.

> **Note (sách):** *"An annotation without an @Target restriction can be used with any declarations but not with type parameters and type uses. (These were the only possible targets in the first Java release that supported annotations.)"*
>
> **Dịch:** Một annotation **không có ràng buộc `@Target`** thì **dùng được với mọi declaration**, **nhưng không dùng được với type parameter và type use**. (Đó là **những target duy nhất có thể có** ở bản Java đầu tiên hỗ trợ annotation.)

### Table 11.1: Element Types for the `@Target` Annotation

| Element Type | Annotation Applies To | Dịch |
|---|---|---|
| `ANNOTATION_TYPE` | Annotation type declarations | Khai báo annotation type |
| `MODULE` | Modules | Module |
| `PACKAGE` | Packages | Package |
| `TYPE` | Classes (including enum) and interfaces (including annotation types) | Class (kể cả `enum`) và interface (kể cả annotation type) |
| `METHOD` | Methods | Method |
| `CONSTRUCTOR` | Constructors | Constructor |
| `FIELD` | Fields (including enum constants) | Field (kể cả enum constant) |
| `PARAMETER` | Method or constructor parameters | Parameter của method hoặc constructor |
| `RECORD_COMPONENT` | Record components | Record component |
| `LOCAL_VARIABLE` | Local variables | Local variable |
| `TYPE_PARAMETER` | Type parameters | Type parameter |
| `TYPE_USE` | Uses of a type | Chỗ sử dụng một type |

> *"When you annotate a record component, the annotation is applied to the fields and methods to which the component gives rise, provided the annotation is permitted on fields or methods. For example, in the annotation"*

```java
public record Rectangle(@ToString(includeName=false) Point topLeft,
    int width, int height) {}
```

> *"the topLeft field receives the annotation if its target types include ElementType.FIELD."*

**Dịch:** Khi bạn annotate một **record component**, annotation **được áp lên các field và method mà component đó sinh ra**, với điều kiện annotation **được phép trên field hoặc method**. Trong ví dụ trên, **field `topLeft` nhận annotation** nếu target type của annotation **bao gồm `ElementType.FIELD`**. Xem [[07 - Records]].

---

### Meta-annotation `@Retention`

> *"The @Retention meta-annotation specifies where the annotation can be accessed. There are three choices."*
> 1. *"RetentionPolicy.SOURCE: The annotation is available to source processors, but it is not included in class files."*
> 2. *"RetentionPolicy.CLASS: The annotation is included in class files, but the virtual machine does not load them. This is the default."*
> 3. *"RetentionPolicy.RUNTIME: The annotation is available at runtime and can be accessed through the reflection API."*

**Dịch:** Meta-annotation `@Retention` chỉ định **nơi annotation truy cập được**. Có **ba lựa chọn**:

| Retention policy | Ý nghĩa |
|---|---|
| `RetentionPolicy.SOURCE` | Annotation **dùng được cho source processor**, nhưng **không được đưa vào file class** |
| `RetentionPolicy.CLASS` | Annotation **được đưa vào file class**, nhưng **virtual machine không load chúng**. **Đây là mặc định** |
| `RetentionPolicy.RUNTIME` | Annotation **dùng được lúc runtime** và **truy cập được qua reflection API** — xem [[10 - Reflection]] |

> *"You will see examples of all three scenarios later in this chapter."*

**Dịch:** Bạn sẽ thấy **ví dụ cho cả ba tình huống** ở phần sau của chương.

> *"There are several other meta-annotations—see Section 11.3 for a complete list."*

**Dịch:** Còn **vài meta-annotation khác** — xem Section 11.3 để có danh sách đầy đủ ([[03 - Annotations in the Java API]]).

---

### Giá trị default cho element

> *"To specify a default value for an element, add a default clause after the method defining the element. For example,"*

```java
public @interface RepeatedTest
{
    int failureThreshold() default Integer.MAX_VALUE;
    . . .
}
```

**Dịch:** Để chỉ định **giá trị mặc định cho một element**, thêm **mệnh đề `default`** sau method định nghĩa element đó.

> *"This example shows how to denote a default of an empty array and a default for an annotation:"*

```java
public @interface BugReport
{
    String[] reportedBy() default {}; // Defaults to empty array
    Reference ref() default @Reference(id=0); // Default for an annotation
    . . .
}
```

**Dịch:** Ví dụ trên cho thấy cách ghi **default là một array rỗng** và **default là một annotation**.

> **Caution (sách):** *"Defaults are not stored with the annotation; instead, they are dynamically computed. If you change a default and recompile the annotation class, all annotated elements will use the new default, even in class files that have been compiled before the default changed."*
>
> **Dịch:** **Giá trị default không được lưu cùng annotation**; thay vào đó chúng **được tính động**. Nếu bạn **đổi một default rồi recompile annotation class**, thì **mọi element đã annotate sẽ dùng default mới**, **kể cả trong những file class đã compile trước khi default thay đổi**.

---

### Mọi annotation interface đều extend `Annotation`

> *"All annotation interfaces implicitly extend the java.lang.annotation.Annotation interface. That interface is a regular interface, not an annotation interface. See the API notes at the end of this section for the methods provided by this interface."*

**Dịch:** **Mọi annotation interface đều ngầm extend interface `java.lang.annotation.Annotation`.** Interface đó là **một interface bình thường, không phải annotation interface**.

> *"You cannot extend annotation interfaces, and you never supply classes that implement annotation interfaces. Instead, source processing tools and the virtual machine generate proxy classes and objects when needed."*

**Dịch:** Bạn **không extend được annotation interface**, và bạn **không bao giờ tự cung cấp class implement annotation interface**. Thay vào đó, **source processing tool và virtual machine sinh ra proxy class và proxy object khi cần** — xem [[05 - Proxies]].

---

## API — `java.lang.annotation.Annotation` (Java 5.0)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `Class<? extends Annotation> annotationType()` | Trả về object `Class` **đại diện cho annotation interface** của annotation object này. Lưu ý gọi `getClass` trên một annotation object sẽ trả về **class thực sự, không phải interface**. |
| `boolean equals(Object other)` | Trả về `true` nếu `other` là object **implement cùng annotation interface** với annotation object này, **và mọi element của hai object đều bằng nhau**. |
| `int hashCode()` | Trả về **hash code tương thích với method `equals`**, dẫn xuất từ **tên của annotation interface và các giá trị element**. |
| `String toString()` | Trả về **biểu diễn dạng string** chứa **tên annotation interface** cùng **tên và giá trị của các element**. |

---

## Bài kế tiếp

→ [[03 - Annotations in the Java API]] — các annotation có sẵn trong Java API: nhóm annotation cho compilation và nhóm meta-annotation.
