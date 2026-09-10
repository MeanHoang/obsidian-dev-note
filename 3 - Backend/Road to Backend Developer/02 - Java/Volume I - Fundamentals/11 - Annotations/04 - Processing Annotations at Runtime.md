# 04 — Processing Annotations at Runtime

> Chapter 11, Section 11.4 — Core Java Volume I, 13th Edition (Horstmann).
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 11.4. Processing Annotations at Runtime

> *"So far, you have seen how to add annotations to source files and how to define annotation types. Now the time has come to see what good can come out of that."*

**Dịch:** Tới giờ bạn đã biết **cách thêm annotation vào file nguồn** và **cách định nghĩa annotation type**. Giờ là lúc xem **những thứ đó mang lại lợi ích gì**.

> *"In this section, I show you a simple example of processing an annotation at runtime using the reflection API that you have already seen in Chapter 5."*

**Dịch:** Trong section này, tác giả trình bày **một ví dụ đơn giản về xử lý annotation lúc runtime** bằng **reflection API** đã thấy ở Chapter 5 — xem [[10 - Reflection]].

> *"Suppose we want to reduce the tedium of implementing toString methods. Of course, one can write a generic toString method using reflection that simply includes all field names and values. But suppose we want to customize that process. We may not want to include all fields, or we may want to skip class and variable names. For example, for the Point class we may prefer [5,10] instead of Point[x=5,y=10]. Of course, any number of other enhancements would be plausible, but let's keep it simple. The point is to demonstrate what an annotation processor can do."*

**Dịch:** Giả sử ta muốn **giảm bớt sự nhàm chán khi implement method `toString`**. Tất nhiên có thể viết một `toString` tổng quát bằng reflection, đơn giản là **gộp hết tên field và giá trị**. Nhưng giả sử ta muốn **tuỳ biến quá trình đó**: có thể **không muốn gộp hết mọi field**, hoặc muốn **bỏ qua tên class và tên biến**. Ví dụ với class `Point`, ta thích **`[5,10]`** hơn `Point[x=5,y=10]`. Mục đích ở đây là **minh hoạ một annotation processor làm được gì**.

> *"Annotate all classes that you want to benefit from this service with the @ToString annotation. In addition, all fields that should be included need to be annotated as well. The annotation is defined like this:"*

```java
@Target({ElementType.FIELD, ElementType.RECORD_COMPONENT, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface ToString
{
    boolean includeName() default true;
}
```

**Dịch:** **Annotate mọi class muốn hưởng dịch vụ này bằng `@ToString`.** Ngoài ra, **mọi field cần được đưa vào cũng phải được annotate**.

> *"Here are annotated Point and Rectangle classes:"*

```java
@ToString(includeName=false)
public class Point
{
    @ToString(includeName=false) private int x;
    @ToString(includeName=false) private int y;
    . . .
}

@ToString
public record Rectangle(
    @ToString(includeName=false) Point topLeft,
    @ToString int width,
    @ToString int height)
{}
```

> *"The intent is for a rectangle to be represented as string as Rectangle[[5,10],width=20,height=30]."*

**Dịch:** Ý đồ là một rectangle **được biểu diễn thành string là `Rectangle[[5,10],width=20,height=30]`**. Xem [[07 - Records]].

> *"At runtime, we cannot modify the implementation of the toString method for a given class. Instead, let us provide a method that can format any object, discovering and using the ToString annotations if they are present."*

**Dịch:** **Lúc runtime, ta không sửa được implementation của method `toString` của một class.** Thay vào đó, ta **cung cấp một method format được bất kỳ object nào**, **phát hiện và dùng annotation `ToString` nếu chúng có mặt**.

> *"The key are the methods"*

```java
T getAnnotation(Class<T>)
T getDeclaredAnnotation(Class<T>)
T[] getAnnotationsByType(Class<T>)
T[] getDeclaredAnnotationsByType(Class<T>)
Annotation[] getAnnotations()
Annotation[] getDeclaredAnnotations()
boolean isAnnotationPresent(Class<? extends Annotation> annotationClass)
```

> *"of the AnnotatedElement interface. The reflection classes Class, Field, Parameter, Method, Constructor, and Package implement that interface."*

**Dịch:** **Chìa khoá là các method trên của interface `AnnotatedElement`.** Các reflection class **`Class`, `Field`, `Parameter`, `Method`, `Constructor` và `Package`** đều **implement interface đó**.

> *"As with other reflection methods, the methods with Declared in their name yield annotations in the class itself, whereas the others include inherited ones. In the context of annotations, this means that the annotation is @Inherited and applied to a superclass."*

**Dịch:** Cũng như các reflection method khác, **những method có chữ `Declared` trong tên trả về annotation nằm ngay trong chính class đó**, còn **các method kia bao gồm cả annotation kế thừa**. Trong ngữ cảnh annotation, điều này nghĩa là annotation ấy **là `@Inherited` và được áp lên một superclass**.

> *"If an annotation is not repeatable, call getAnnotation to locate it. For example:"*

```java
Class<?> cl = obj.getClass();
ToString ts = cl.getAnnotation(ToString.class);
if (ts != null && ts.includeName()) . . .
```

**Dịch:** Nếu annotation **không repeatable**, gọi **`getAnnotation`** để tìm nó.

> *"Note that you pass the class object for the annotation (here, ToString.class) and you get back an object of some proxy class that implements the ToString interface. You can then invoke the interface methods to get the values of the annotation elements. If the annotation is not present, the getAnnotation method returns null."*

**Dịch:** Lưu ý bạn **truyền vào class object của annotation** (ở đây là `ToString.class`) và **nhận về một object thuộc một proxy class nào đó implement interface `ToString`** — xem [[05 - Proxies]]. Sau đó bạn **gọi các method của interface để lấy giá trị của các annotation element**. Nếu **annotation không có mặt**, method `getAnnotation` **trả về `null`**.

> *"It gets a bit messy if an annotation is repeatable. If you call getAnnotation to look up a repeatable annotation, and the annotation was actually repeated, then you also get null. That is because the repeated annotations were wrapped inside the container annotation."*

**Dịch:** **Chuyện hơi rối nếu annotation là repeatable.** Nếu bạn gọi `getAnnotation` để tra một repeatable annotation, và annotation ấy **thực sự bị lặp lại**, thì bạn **cũng nhận về `null`**. Lý do là **các annotation lặp lại đã bị gói vào bên trong container annotation**.

> *"In this case, you should call getAnnotationsByType. That call "looks through" the container and gives you an array of the repeated annotations. If there was just one annotation, you get it in an array of length 1. With this method, you don't have to worry about the container annotation."*

**Dịch:** Trong trường hợp này, bạn **nên gọi `getAnnotationsByType`**. Lời gọi ấy **"nhìn xuyên qua" container** và trả về một **array các annotation lặp lại**. Nếu chỉ có **một annotation**, bạn nhận nó trong một **array độ dài 1**. Với method này, bạn **không phải bận tâm tới container annotation**.

> *"The getAnnotations method gets all annotations (of any type) with which an item is annotated, with repeated annotations wrapped into containers."*

**Dịch:** Method **`getAnnotations`** lấy **mọi annotation (thuộc bất kỳ type nào)** mà một item được annotate, với **các annotation lặp lại đã gói vào container**.

> *"Listing 11.2 shows the implementation of the annotation-aware toString method."*

> *"When a class is annotated with ToString, the method iterates over its fields and prints the ones that are also annotated. If the includeName element is true, then the class or field name is included in the string."*

**Dịch:** Khi một class được annotate bằng `ToString`, method **duyệt qua các field của nó và in ra những field cũng được annotate**. Nếu element **`includeName` là `true`**, thì **tên class hoặc tên field được đưa vào string**.

> *"Note that the method calls itself recursively. Whenever an object belongs to a class that isn't annotated, its regular toString method is used and the recursion stops."*

**Dịch:** Lưu ý method **tự gọi chính nó theo kiểu đệ quy**. Hễ một object **thuộc về một class không được annotate**, thì **method `toString` thông thường của nó được dùng và đệ quy dừng lại**.

**Figure 11.2: Processing annotations at runtime**

```
                                                    ┌──────────────────────┐
                                                    │ Program uses         │
                                                    │ reflection API       │
                                                    │ to process           │
                                                    │ annotations          │
                                                    └───────────┬──────────┘
                                                                │
   ┌────────────┐    ┌───────────────┐    ┌────────────┐    ┌───┴──────────────┐
   │ @ToString  │───►│ Java Compiler │───►│ @ToString  │───►│ Java Virtual     │
   │            │    │               │    │            │    │ Machine          │
   └────────────┘    └───────────────┘    └────────────┘    └──────────────────┘
    Source File                            Class File
```

Annotation `@ToString` **sống sót qua compiler** và nằm trong class file, để JVM/reflection đọc lúc runtime.

> *"This is a simple but typical use of the runtime annotation API. Look up classes, fields, and so on, using reflection; call getAnnotation or getAnnotationsByType on the potentially annotated elements to retrieve the annotations; then, invoke the methods of the annotation interfaces to obtain the element values."*

**Dịch:** Đây là một cách dùng **đơn giản nhưng điển hình** của runtime annotation API:

```
1. Tra cứu class, field, ... bằng reflection
        │
        ▼
2. Gọi getAnnotation / getAnnotationsByType trên các element
   có khả năng được annotate  →  lấy về annotation
        │
        ▼
3. Gọi các method của annotation interface  →  lấy giá trị element
```

---

### Listing 11.1 — `runtimeAnnotations/RuntimeAnnotationDemo.java`

```java
package runtimeAnnotations;

public class RuntimeAnnotationDemo
{
    public static void main(String[] args)
    {
        var rect = new Rectangle(new Point(5, 10), 20, 30);
        System.out.println(ToStrings.toString(rect));
    }
}
```

### Listing 11.2 — `runtimeAnnotations/ToStrings.java`

```java
package runtimeAnnotations;

import java.lang.reflect.*;

public class ToStrings
{
    public static String toString(Object obj)
    {
        if (obj == null) return "null";
        Class<?> cl = obj.getClass();
        ToString ts = cl.getAnnotation(ToString.class);
        if (ts == null) return obj.toString();
        var result = new StringBuilder();
        if (ts.includeName()) result.append(cl.getName());
        result.append("[");
        boolean first = true;
        for (Field f : cl.getDeclaredFields())
        {
            ts = f.getAnnotation(ToString.class);
            if (ts != null) {
                if (first) first = false; else result.append(",");
                f.setAccessible(true);
                if (ts.includeName())
                {
                    result.append(f.getName());
                    result.append("=");
                }
                try
                {
                    result.append(ToStrings.toString(f.get(obj)));
                }
                catch (ReflectiveOperationException ex)
                {
                    ex.printStackTrace();
                }
            }
        }
        result.append("]");
        return result.toString();
    }
}
```

---

## API — `java.lang.reflect.AnnotatedElement` (Java 5.0)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `boolean isAnnotationPresent(Class<? extends Annotation> annotationType)` | Trả về `true` nếu item này **có một annotation thuộc type cho trước**. |
| `<T extends Annotation> T getAnnotation(Class<T> annotationType)` | Lấy annotation thuộc type cho trước, hoặc **`null` nếu item này không có annotation như vậy**. |
| `<T extends Annotation> T[] getAnnotationsByType(Class<T> annotationType)` **(Java 8)** | Lấy **mọi annotation của một repeatable annotation type** (xem Section 11.3.2). Nếu **không có cái nào, trả về array độ dài 0**. |
| `Annotation[] getAnnotations()` | Lấy **mọi annotation hiện có của item này, kể cả annotation kế thừa**. Nếu không có cái nào, trả về **array độ dài 0**. |
| `Annotation[] getDeclaredAnnotations()` | Lấy **mọi annotation được khai báo cho item này, không kể annotation kế thừa**. Nếu không có cái nào, trả về **array độ dài 0**. |

---

## Bài kế tiếp

→ [[05 - Source-Level Annotation Processing]] — annotation processor tích hợp trong compiler, language model API, và dùng annotation để sinh source code.
