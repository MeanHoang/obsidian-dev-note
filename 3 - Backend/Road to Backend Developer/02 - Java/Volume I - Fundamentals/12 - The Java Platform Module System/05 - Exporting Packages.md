# 05 — Exporting Packages

> Chapter 12, Section 12.5 — Core Java Volume I, 13th Edition (Horstmann).
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 12.5. Exporting Packages

> *"In the preceding section, you saw that a module must require another module if it wants to use its packages. However, that does not automatically make all packages in the required module available. A module states which of its packages are accessible, using the exports keyword. For example, here is a part of the module declaration for the java.xml module:"*

```java
module java.xml
{
    exports javax.xml;
    exports javax.xml.catalog;
    exports javax.xml.datatype;
    exports javax.xml.namespace;
    exports javax.xml.parsers;
    . . .
}
```

**Dịch:** Ở section trước, bạn đã thấy một module **phải require module khác** nếu muốn dùng package của module đó. Nhưng điều đó **không tự động làm mọi package trong module được require trở nên available**. Một module **tuyên bố package nào của nó truy cập được**, bằng keyword **`exports`**.

> *"This module makes many packages available, but hides others (such as jdk.xml.internal) by not exporting them."*

**Dịch:** Module này **mở nhiều package**, nhưng **giấu những package khác** (như `jdk.xml.internal`) bằng cách **không export chúng**.

### Export nghĩa là gì

> *"When a package is exported, its public and protected classes and interfaces, and their public and protected members, are accessible outside the module. (As always, protected types and members are accessible only in subclasses and the same package.)"*

**Dịch:** Khi một package được **export**, các class và interface **`public` và `protected`** của nó, cùng các member **`public` và `protected`** của chúng, **truy cập được từ ngoài module**. (Như mọi khi, type và member `protected` chỉ truy cập được **trong subclass và trong cùng package**.)

> *"However, a package that is not exported is not accessible outside its own module. This is quite different from Java before modules. In the past, you were able to use public classes from any package, even if it was not part of the public API. For example, it was commonly recommended to use classes such as sun.misc.BASE64Encoder or com.sun.rowset.CachedRowSetImpl when the public API did not provide the appropriate functionality."*

**Dịch:** Ngược lại, package **không được export thì không truy cập được từ ngoài module của chính nó**. Điều này **khác hẳn Java thời chưa có module**. Trước đây, bạn dùng được class `public` từ **bất kỳ package nào**, kể cả khi nó **không thuộc public API**. Ví dụ, người ta thường khuyên dùng những class như `sun.misc.BASE64Encoder` hay `com.sun.rowset.CachedRowSetImpl` khi public API không cung cấp chức năng phù hợp.

> *"Nowadays, you can no longer access unexported packages from the Java platform API since all of them are contained inside modules. As a result, some programs will no longer run with Java 9. Of course, nobody ever committed to keeping non-public APIs available, so this should not come as a shock."*

**Dịch:** Ngày nay, bạn **không còn truy cập được các package không export** từ Java platform API, vì **tất cả chúng đều nằm trong module**. Hệ quả là **một số chương trình sẽ không còn chạy được với Java 9**. Dĩ nhiên, **chưa từng có ai cam kết giữ cho non-public API luôn khả dụng**, nên chuyện này **không nên gây sốc**.

### Ví dụ: giấu implementation

> *"Let us put exports to use in a simple situation. We will prepare a module com.horstmann.greet that exports a package, also called com.horstmann.greet, following the convention that a module that provides code for others should be named after the top-level package inside it. There is also a package com.horstmann.greet.internal that we don't export."*

**Dịch:** Hãy dùng `exports` trong một tình huống đơn giản. Ta chuẩn bị module `com.horstmann.greet` **export một package cũng tên `com.horstmann.greet`**, theo quy ước rằng module cung cấp code cho người khác nên **được đặt tên theo top-level package bên trong nó**. Ngoài ra còn có package `com.horstmann.greet.internal` mà ta **không export**.

> *"A public Greeter interface is in the first package."*

```java
package com.horstmann.greet;

public interface Greeter
{
    static Greeter newInstance()
    {
        return new com.horstmann.greet.internal.GreeterImpl();
    }

    String greet(String subject);
}
```

**Dịch:** Một interface `Greeter` `public` nằm trong package thứ nhất.

> *"The second package has a class that implements the interface. The class is public since it is accessed in the first package."*

```java
package com.horstmann.greet.internal;

import com.horstmann.greet.Greeter;

public class GreeterImpl implements Greeter
{
    public String greet(String subject)
    {
        return "Hello, " + subject + "!";
    }
}
```

**Dịch:** Package thứ hai có một class **implement interface đó**. Class này là `public` vì **nó được truy cập từ package thứ nhất**.

> *"The com.horstmann.greet module contains both packages but only exports the first:"*

```java
module com.horstmann.greet
{
    exports com.horstmann.greet;
}
```

> *"The second package is inaccessible outside the module."*

**Dịch:** Module `com.horstmann.greet` **chứa cả hai package nhưng chỉ export package thứ nhất**. Package thứ hai **không truy cập được từ ngoài module**.

> *"We put our application into a second module, which will require the first module:"*

```java
module v1ch12.exportedpkg
{
    requires com.horstmann.greet;
}
```

**Dịch:** Ta đặt application vào **module thứ hai**, module này sẽ **require module thứ nhất**.

> **Note (sách):** *"The exports statement is followed by a package name, whereas requires is followed by a module name."*
>
> **Dịch:** Sau `exports` là **tên package**, còn sau `requires` là **tên module**.

| Statement | Theo sau là |
|---|---|
| `exports` | **package name** |
| `requires` | **module name** |

> *"Our application now uses a Greeter to obtain a greeting:"*

```java
package com.horstmann.hello;

import com.horstmann.greet.Greeter;

public class HelloWorld
{
    public static void main(String[] args)
    {
        Greeter greeter = Greeter.newInstance();
        System.out.println(greeter.greet("Modular World"));
    }
}
```

**Dịch:** Application của ta giờ dùng một `Greeter` để lấy lời chào.

### Cấu trúc thư mục nguồn

> *"Here is the source file structure for these two modules:"*

```
com.horstmann.greet
├ module-info.java
└ com
  └ horstmann
    └ greet
      ├ Greeter.java
      └ internal
        └ GreeterImpl.java

v1ch12.exportedpkg
├ module-info.java
└ com
  └ horstmann
    └ hello
      └ HelloWorld.java
```

### Build và chạy

> *"To build this application, first compile the com.horstmann.greet module:"*

```bash
javac com.horstmann.greet/module-info.java \
  com.horstmann.greet/com/horstmann/greet/Greeter.java \
  com.horstmann.greet/com/horstmann/greet/internal/GreeterImpl.java
```

> *"Then compile the application module with the first module on the module path:"*

```bash
javac -p com.horstmann.greet v1ch12.exportedpkg/module-info.java \
  v1ch12.exportedpkg/com/horstmann/hello/HelloWorld.java
```

> *"Finally, run the program with both modules on the module path:"*

```bash
java -p v1ch12.exportedpkg:com.horstmann.greet \
  -m v1ch12.exportedpkg/com.horstmann.hello.HelloWorld
```

**Dịch:** Để build application này, **trước hết biên dịch module `com.horstmann.greet`**. Sau đó **biên dịch module application với module thứ nhất nằm trên module path**. Cuối cùng **chạy chương trình với cả hai module trên module path**.

> *"This example demonstrates how an implementation can be hidden in a module. The implementing class is inaccessible outside the module. Clients use an interface and a factory method, instead of instantiating the implementing class."*

**Dịch:** Ví dụ này minh hoạ cách **giấu một implementation bên trong module**. Class implement **không truy cập được từ bên ngoài module**. Client **dùng một interface và một factory method**, thay vì khởi tạo trực tiếp class implement.

> **Note (sách):** *"In the Windows cmd shell, you have to enclose v1ch12.exportedpkg:com.horstmann.greet in quotation marks because the colon character has a special meaning. You also need to use ^ instead of \ for multiline commands."*
>
> **Dịch:** Trong Windows cmd shell, bạn phải **đặt `v1ch12.exportedpkg:com.horstmann.greet` trong dấu nháy** vì **dấu hai chấm có ý nghĩa đặc biệt**. Bạn cũng cần dùng **`^` thay cho `\`** cho lệnh nhiều dòng.

> **Tip (sách):** *"To build this application with Eclipse, make a separate project for each module. In the v1ch12.exportedpkg project, edit the project properties. In the Projects tab, add the com.horstmann.greet module to the module path—see Figure 12.2."*
>
> **Dịch:** Để build application này bằng Eclipse, hãy **tạo một project riêng cho mỗi module**. Trong project `v1ch12.exportedpkg`, sửa **project properties**; ở tab **Projects**, **thêm module `com.horstmann.greet` vào module path**.

### Tổng kết requires + exports

> *"You have now seen the requires and exports statements that form the backbone of the Java Platform Module System. As you can see, the module system is conceptually simple. Modules specify what modules they need, and which packages they offer to other modules. Section 12.12 shows a minor variation of the exports statement."*

**Dịch:** Bạn đã thấy hai statement **`requires` và `exports`** — **xương sống của Java Platform Module System**. Như bạn thấy, module system **đơn giản về mặt khái niệm**: module **chỉ định nó cần module nào**, và **nó cung cấp package nào cho module khác**. Section 12.12 giới thiệu một **biến thể nhỏ** của statement `exports`. → Xem [[12 - Qualified Exporting and Opening]].

> **Caution (sách):** *"A module does not provide a scope. You cannot have two packages with the same name in different modules. This is true even for hidden packages (that is, packages that are not exported.)"*
>
> **Dịch:** Module **không tạo ra một scope**. Bạn **không thể có hai package trùng tên ở hai module khác nhau**. Điều này **đúng ngay cả với package bị giấu** (tức package không được export).

---

## Bài kế tiếp

→ [[06 - Modular JARs]] — đóng gói module thành file JAR có `module-info.class` ở gốc, gắn main class và version number.
