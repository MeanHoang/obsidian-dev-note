# 07 — Modules and Reflective Access

> Chapter 9, Section 9.7 — Core Java Volume II: Advanced Features, 11th Edition (Horstmann), Java 11.
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 9.7 Modules and Reflective Access

### Reflection không còn chọc thủng được module

> *"In the preceding sections, you saw that the module system enforces encapsulation. A module can only access explicitly exported packages from another module. In the past, it was always possible to overcome pesky access restrictions by using reflection. As you have seen in Chapter 5 of Volume I, reflection can access private members of any class."*

**Dịch:** Ở các phần trước, module system **cưỡng chế encapsulation**: một module **chỉ truy cập được các package được export tường minh** từ module khác. Trước kia, luôn có thể **vượt qua các hạn chế truy cập phiền phức bằng reflection** — như đã thấy ở [[10 - Reflection]], reflection **truy cập được private member của bất kỳ class nào**.

> *"However, in the modular world, that is no longer true. If a class is inside a module, reflective access to non-public members will fail. Specifically, recall how we accessed private fields:"*

```java
Field f = obj.getClass().getDeclaredField("salary");
f.setAccessible(true);
double value = f.getDouble(obj);
f.setDouble(obj, value * 1.1);
```

**Dịch:** Nhưng trong **thế giới modular thì không còn đúng nữa**. Nếu một class **nằm trong module**, truy cập bằng reflection tới **member không public sẽ thất bại**.

> *"The call f.setAccessible(true) succeeds unless a security manager disallows private field access. However, it is not common to run Java applications with security managers, and there are many libraries that use reflective access. Typical examples are object-relational mappers, such as JPA, that automatically persist objects in databases and libraries that convert between objects and XML or JSON, such as JAXB and JSON-B."*

**Dịch:** Lời gọi `f.setAccessible(true)` **thành công trừ khi có security manager cấm** truy cập private field. Nhưng **chạy ứng dụng Java với security manager là chuyện không phổ biến**, và **rất nhiều thư viện dùng reflective access**. Ví dụ điển hình là **object-relational mapper** như **JPA** (tự động lưu object xuống database) và các thư viện **chuyển đổi object sang XML hoặc JSON** như **JAXB** và **JSON-B**.

### Ví dụ minh hoạ lỗi

> *"If you use such a library, and you also want to use modules, you have to be careful. To demonstrate this issue, let us place the ObjectAnalyzer class from Chapter 5 of Volume I into a module com.horstmann.util. That class has a toString method that prints the fields of an object, using reflection."*

**Dịch:** Nếu bạn dùng thư viện kiểu đó mà cũng muốn dùng module thì **phải cẩn thận**. Để minh hoạ, đặt class `ObjectAnalyzer` (từ chương 5 Volume I) vào module `com.horstmann.util`. Class đó có method `toString` **in ra các field của một object bằng reflection**.

### `v2ch09.openpkg/com/horstmann/places/Country.java`

> *"A separate v2ch09.openpkg module contains a simple Country class:"*

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

### `v2ch09.openpkg/com/horstmann/places/Demo.java`

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

### Chạy thử → exception

> *"Now compile both modules and the Demo program:"*

```bash
javac com.horstmann.util/module-info.java \
  com.horstmann.util/com/horstmann/util/ObjectAnalyzer.java

javac -p com.horstmann.util v2ch09.openpkg/module-info.java \
  v2ch09.openpkg/com/horstmann/places/*.java

java -p v2ch09.openpkg:com.horstmann.util -m v2ch09.openpkg/com.horstmann.places.Demo
```

> *"The program will fail with an exception:"*

```
Exception in thread "main" java.lang.reflect.InaccessibleObjectException:
Unable to make field private java.lang.String com.horstmann.places.Country.name
accessible: module v2ch09.openpkg does not "opens com.horstmann.places" to module
com.horstmann.util
```

**Dịch:** Chương trình **thất bại với exception `InaccessibleObjectException`**: không làm cho field private `Country.name` thành accessible được, vì module `v2ch09.openpkg` **không "opens com.horstmann.places" cho module `com.horstmann.util`**.

### `opens` — mở package cho reflective access

> *"Of course, in pristine theory, it is wrong to violate encapsulation and poke around in the private members of an object. But mechanisms such as object-relational mapping or XML/JSON binding are so common that the module system must accommodate them."*

**Dịch:** Dĩ nhiên, **về lý thuyết thuần khiết** thì **vi phạm encapsulation** và **chọc ngoáy vào private member** của object là **sai**. Nhưng các cơ chế như **object-relational mapping** hay **XML/JSON binding** **quá phổ biến** đến mức module system **buộc phải chiều theo**.

> *"Using the opens keyword, a module can open a package, which enables reflective access to all instances of classes in the given package. Here is what our module has to do:"*

```java
module v2ch09.openpkg
{
    requires com.horstmann.util;
    opens com.horstmann.places;
}
```

> *"With this change, the ObjectAnalyzer will work correctly."*

**Dịch:** Dùng keyword **`opens`**, một module **mở (open) một package**, cho phép **reflective access tới mọi instance của class trong package đó**. Với thay đổi này, `ObjectAnalyzer` **chạy đúng**.

### Open module

> *"A module can be declared as open, such as"*

```java
open module v2ch09.openpkg
{
    requires com.horstmann.util;
}
```

> *"An open module grants runtime access to all of its packages, as if all packages had been declared with exports and opens. However, only explicitly exported packages are accessible at compile time. Open modules combine the compile-time safety of the module system with the classic permissive runtime behavior."*

**Dịch:** Một module có thể được khai báo là **`open`**. **Open module cấp quyền truy cập lúc runtime cho MỌI package của nó**, như thể mọi package đều đã được khai báo `exports` và `opens`. Tuy nhiên **lúc compile time thì chỉ package được export tường minh mới truy cập được**. Open module **kết hợp sự an toàn compile-time của module system với hành vi runtime dễ dãi kiểu cổ điển**.

| Khai báo | Compile time | Runtime (reflection) |
|---|---|---|
| `exports p` | package `p` truy cập được | (public/protected member) |
| `opens p` | — | reflective access tới **mọi instance** của class trong `p` |
| `open module` | **chỉ package được export** | **mọi package** |

### Resource trong module

> *"Recall from Chapter 5 of Volume I that JAR files can contain, in addition to class files and a manifest, file resources which can be loaded with the method Class.getResourceAsStream, and now also with Module.getResourceAsStream. If a resource is stored in a directory that matches a package in a module, then the package must be opened to the caller. Resources in other directories, as well as the class files and manifest, can be read by anyone."*

**Dịch:** Nhớ lại rằng file JAR, ngoài file class và manifest, còn **chứa được resource** — load bằng method **`Class.getResourceAsStream`**, và nay còn bằng **`Module.getResourceAsStream`**. Nếu resource nằm trong **thư mục khớp với một package trong module** thì **package đó phải được open cho bên gọi**. Resource ở **thư mục khác**, cũng như **file class và manifest**, thì **ai đọc cũng được**.

### Các module bị gỡ khỏi Java 11

> **Note (sách):** *"For a more realistic example, we could convert the Country object to XML or JSON. Java 9 and 10 included the java.xml.bind module for conversion to XML. That module has been removed from Java 11 (together with the modules java.activation, java.corba, java.transaction, java.xml.ws, and java.xml.ws.annotation). These modules contain packages that are also part of the Jakarta EE (formerly Java EE) specification, where the APIs are more encompassing than with Java SE. Enterprise application servers can not be modularized if the JDK has conflicting packages. Unfortunately, as this book is being written, there is no modularized replacement for XML binding."*
>
> *"However, the JSON-B implementation provides modular JAR files if one builds it from source. Hopefully, these JAR files will make it to Maven Central by the time you read this. Place the JAR files on the module path and run the com.horstmann.places.Demo2 program. When the com.horstmann.places package is opened, conversion to JSON succeeds."*
>
> **Dịch:** Ví dụ thực tế hơn là **chuyển object `Country` sang XML hoặc JSON**. Java 9 và 10 có module **`java.xml.bind`** cho chuyển đổi XML. Module đó **đã bị gỡ khỏi Java 11**, cùng với **`java.activation`, `java.corba`, `java.transaction`, `java.xml.ws`, `java.xml.ws.annotation`**. Các module này chứa package **cũng thuộc đặc tả Jakarta EE** (trước là Java EE), nơi API **bao quát hơn Java SE**. **Enterprise application server không modular hoá được nếu JDK có package xung đột.** Đáng tiếc, lúc sách được viết **chưa có bản thay thế đã modular hoá cho XML binding**. Còn **implementation của JSON-B** thì **có modular JAR nếu build từ source**.

### VarHandle thay cho reflection

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
> **Dịch:** Có khả năng **các thư viện tương lai sẽ dùng variable handle thay cho reflection** để đọc/ghi field. Một **`VarHandle` tương tự một `Field`**: dùng nó để đọc/ghi **một field cụ thể của bất kỳ instance nào của một class cụ thể**. Nhưng để lấy được `VarHandle`, code thư viện **cần một object `Lookup`**. Cách này chạy được **với điều kiện object `Lookup` được sinh ra trong module có quyền truy cập field đó**. Một method nào đó trong module chỉ cần gọi **`MethodHandles.lookup()`**, cho ra object **đóng gói quyền truy cập của bên gọi**. Bằng cách này, **một module cấp được quyền truy cập private member cho module khác**. Vấn đề thực tế là **làm sao cấp các quyền đó cho ít phiền phức nhất**.

---

## Bài kế tiếp

→ [[08 - Automatic Modules (Vol II)]] — biến JAR thường thành module bằng cách đặt lên module path.
