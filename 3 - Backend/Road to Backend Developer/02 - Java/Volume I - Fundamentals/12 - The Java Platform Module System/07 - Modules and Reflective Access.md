# 07 — Modules and Reflective Access

> Chapter 12, Section 12.7 — Core Java Volume I, 13th Edition (Horstmann).
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 12.7. Modules and Reflective Access

> *"In the preceding sections, you saw that the module system enforces encapsulation. A module can only access explicitly exported packages from another module. In the past, it was always possible to overcome pesky access restrictions by using reflection. As you have seen in Chapter 5, reflection can access private members of any class."*

**Dịch:** Ở các section trước, bạn thấy module system **cưỡng chế encapsulation**: một module **chỉ truy cập được các package được export tường minh** từ module khác. Trước đây, ta **luôn có thể vượt qua** những hạn chế truy cập phiền phức bằng **reflection** — như đã thấy ở Chapter 5, reflection **truy cập được private member của bất kỳ class nào**. → Xem [[10 - Reflection]].

> *"However, in the modular world, that is no longer true. If a class is inside a module, reflective access to non-public members will fail. Specifically, recall how we accessed private fields:"*

```java
Field f = obj.getClass().getDeclaredField("salary");
f.setAccessible(true);
double value = f.getDouble(obj);
f.setDouble(obj, value * 1.1);
```

**Dịch:** Nhưng trong **thế giới module**, điều đó **không còn đúng**. Nếu một class nằm trong một module thì **truy cập reflective tới non-public member sẽ thất bại**.

> *"The call f.setAccessible(true) succeeds unless a security manager disallows private field access. However, it is not common to run Java applications with security managers, and there are many libraries that use reflective access. Typical examples are object-relational mappers, such as JPA, that automatically persist objects in databases and libraries that convert between objects and XML or JSON, such as JAXB and JSON-B."*

**Dịch:** Lời gọi `f.setAccessible(true)` **thành công trừ khi một security manager cấm truy cập private field**. Nhưng chạy Java application với security manager **không phổ biến**, trong khi **rất nhiều library dùng reflective access**: điển hình là các **object-relational mapper** như **JPA** (tự động lưu object xuống database), và các library **chuyển đổi giữa object và XML hoặc JSON** như **JAXB** và **JSON-B**.

### Ví dụ thất bại

> *"If you use such a library, and you also want to use modules, you have to be careful. To demonstrate this issue, let us place the ObjectAnalyzer class from Chapter 5 into a module com.horstmann.util. That class has a toString method that prints the fields of an object, using reflection."*

**Dịch:** Nếu dùng library kiểu đó **và** muốn dùng module, bạn phải **cẩn thận**. Để minh hoạ, ta đặt class `ObjectAnalyzer` ở Chapter 5 vào module `com.horstmann.util`. Class đó có method `toString` **in ra các field của một object bằng reflection**.

> *"A separate v1ch12.openpkg module contains a simple Country class:"*

```java
package com.horstmann.places;

public class Country
{
    private String name;
    private double area;

    public Country(String name, double area)
    {
        this.name = name;
        this.area = area;
    }

    // . . .
}
```

**Dịch:** Một module riêng `v1ch12.openpkg` chứa class `Country` đơn giản.

> *"A short program demonstrates how to analyze a Country object:"*

```java
package com.horstmann.places;

import com.horstmann.util.*;

public class Demo
{
    public static void main(String[] args) throws ReflectiveOperationException
    {
        var belgium = new Country("Belgium", 30510);
        var analyzer = new ObjectAnalyzer();
        System.out.println(analyzer.toString(belgium));
    }
}
```

**Dịch:** Một chương trình ngắn minh hoạ cách phân tích một object `Country`.

> *"Now compile both modules and the Demo program:"*

```bash
javac com.horstmann.util/module-info.java \
  com.horstmann.util/com/horstmann/util/ObjectAnalyzer.java

javac -p com.horstmann.util v1ch12.openpkg/module-info.java \
  v1ch12.openpkg/com/horstmann/places/*.java

java -p v1ch12.openpkg:com.horstmann.util -m v1ch12.openpkg/com.horstmann.places.Demo
```

> *"The program will fail with an exception:"*

```
Exception in thread "main" java.lang.reflect.InaccessibleObjectException:
Unable to make field private java.lang.String com.horstmann.places.Country.name
accessible: module v1ch12.openpkg does not "opens com.horstmann.places" to module
com.horstmann.util
```

**Dịch:** Chương trình sẽ **thất bại với một exception**.

### Keyword opens

> *"Of course, in pristine theory, it is wrong to violate encapsulation and poke around in the private members of an object. But mechanisms such as object-relational mapping or XML/JSON binding are so common that the module system must accommodate them."*

**Dịch:** Dĩ nhiên, **về lý thuyết thuần khiết** thì việc **vi phạm encapsulation** và **thọc vào private member** của một object là **sai**. Nhưng các cơ chế như **object-relational mapping** hay **XML/JSON binding** **quá phổ biến**, nên module system **buộc phải chiều theo chúng**.

> *"Using the opens keyword, a module can open a package, which enables reflective access to all instances of classes in the given package. Here is what our module has to do:"*

```java
module v1ch12.openpkg
{
    requires com.horstmann.util;
    opens com.horstmann.places;
}
```

> *"With this change, the ObjectAnalyzer will work correctly."*

**Dịch:** Dùng keyword **`opens`**, một module có thể **open một package**, cho phép **reflective access tới mọi instance của các class trong package đó**. Với thay đổi này, `ObjectAnalyzer` **sẽ chạy đúng**.

### open module

> *"A module can be declared as open, such as"*

```java
open module v1ch12.openpkg
{
    requires com.horstmann.util;
}
```

> *"An open module grants runtime access to all of its packages, as if all packages had been declared with exports and opens. However, only explicitly exported packages are accessible at compile time. Open modules combine the compile-time safety of the module system with the classic permissive runtime behavior."*

**Dịch:** Một module có thể được **khai báo là `open`**. Một **open module cấp quyền truy cập runtime tới toàn bộ package của nó**, như thể **mọi package đều được khai báo với `exports` và `opens`**. Tuy nhiên, **ở compile time chỉ những package được export tường minh mới truy cập được**. Open module **kết hợp tính an toàn ở compile time của module system với hành vi runtime dễ dãi kiểu cổ điển**.

| | Compile time | Runtime |
|---|---|---|
| **open module** | chỉ package **được `exports` tường minh** | **mọi package** đều truy cập được |

### Resource trong module

> *"Recall from Chapter 5 that JAR files can contain, in addition to class files and a manifest, file resources which can be loaded with the method Class.getResourceAsStream, and now also with Module.getResourceAsStream. If a resource is stored in a directory that matches a package in a module, then the package must be opened to the caller. Resources in other directories, as well as the class files and manifest, can be read by anyone."*

**Dịch:** Nhớ lại Chapter 5: ngoài class file và manifest, file JAR còn chứa được **file resource**, load bằng method `Class.getResourceAsStream`, và **nay còn bằng `Module.getResourceAsStream`**. Nếu một resource **được lưu trong thư mục khớp với một package trong module**, thì **package đó phải được `opens` cho bên gọi**. Resource ở các thư mục khác, cũng như class file và manifest, thì **ai đọc cũng được**.

> **Note (sách):** *"For a more realistic example, we can convert the Country object to XML or JSON, using the JSON-B specification. To use the Yasson implementation of JSON-B, download the JAR files jakarta.json-api-2.1.2.jar, jakarta.json.bind-api-3.0.0.jar, parsson-1.1.4.jar, and yasson-3.0.3.jar from the Maven Central Repository. Place the JAR files on the module path and run the com.horstmann.places.Demo program in the v1ch12.openpkg2 module. When the com.horstmann.places package is opened, conversion to JSON succeeds."*
>
> **Dịch:** Để có ví dụ **thực tế hơn**, ta có thể chuyển object `Country` sang XML hoặc JSON bằng **đặc tả JSON-B**. Để dùng implementation **Yasson** của JSON-B, tải các file JAR `jakarta.json-api-2.1.2.jar`, `jakarta.json.bind-api-3.0.0.jar`, `parsson-1.1.4.jar`, và `yasson-3.0.3.jar` từ **Maven Central Repository**. Đặt các file JAR lên **module path** rồi chạy chương trình `com.horstmann.places.Demo` trong module `v1ch12.openpkg2`. Khi package `com.horstmann.places` **được opened**, việc chuyển sang JSON **thành công**.

> **Note (sách):** *"It is possible that future libraries will use variable handles instead of reflection for reading and writing fields. A VarHandle is similar to a Field. You can use it to read or write a specific field of any instance of a specific class. However, to obtain a VarHandle, the library code needs a Lookup object:"*
>
> ```java
> public Object getFieldValue(Object obj, String fieldName, Lookup lookup)
>     throws NoSuchFieldException, IllegalAccessException
> {
>     Class<?> cl = obj.getClass();
>     Field field = cl.getDeclaredField(fieldName);
>     VarHandle handle = MethodHandles.privateLookupIn(cl, lookup)
>         .unreflectVarHandle(field);
>     return handle.get(obj);
> }
> ```
>
> *"This works provided the Lookup object is generated in the module that has the permission to access the field. Some method in the module simply calls MethodHandles.lookup(), which yields an object encapsulating the access rights of the caller. In this way, one module can give permission for accessing private members to another module. The practical issue is how those permissions can be given with a minimum of hassle."*
>
> **Dịch:** Có khả năng **các library trong tương lai sẽ dùng variable handle thay cho reflection** để đọc và ghi field. Một **`VarHandle` tương tự một `Field`**: dùng nó để đọc/ghi **một field cụ thể của bất kỳ instance nào của một class cụ thể**. Nhưng để lấy được `VarHandle`, code của library **cần một object `Lookup`**. Cách này chạy được **với điều kiện object `Lookup` được sinh ra trong module có quyền truy cập field đó**. Một method nào đó trong module chỉ cần gọi **`MethodHandles.lookup()`**, cho ra một object **đóng gói quyền truy cập của bên gọi**. Bằng cách này, **một module có thể trao quyền truy cập private member cho module khác**. Vấn đề thực tế là **làm sao trao những quyền đó với ít phiền toái nhất**.

---

## Bài kế tiếp

→ [[08 - Automatic Modules]] — biến một file JAR bất kỳ thành module bằng cách đặt nó lên module path.
