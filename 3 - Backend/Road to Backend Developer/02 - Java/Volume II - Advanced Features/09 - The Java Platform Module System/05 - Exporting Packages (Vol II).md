# 05 — Exporting Packages

> Chapter 9, Section 9.5 — Core Java Volume II: Advanced Features, 11th Edition (Horstmann), Java 11.
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 9.5 Exporting Packages

### `exports` khai báo package nào truy cập được

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

> *"This module makes many packages available, but hides others (such as jdk.xml.internal) by not exporting them."*

**Dịch:** Ở phần trước, một module **phải require** module khác nếu muốn dùng package của module đó. Nhưng điều đó **không tự động làm mọi package trong module được require trở nên dùng được**. Module **tuyên bố package nào của nó truy cập được** bằng keyword **`exports`**. Module `java.xml` cho dùng nhiều package, nhưng **giấu các package khác** (như `jdk.xml.internal`) bằng cách **không export chúng**.

### Export nghĩa là gì

> *"When a package is exported, its public and protected classes and interfaces, and their public and protected members, are accessible outside the module. (As always, protected types and members are accessible only in subclasses.)"*

**Dịch:** Khi một package được export, các **class và interface `public` và `protected`** của nó, cùng các **member `public` và `protected`** của chúng, **truy cập được từ ngoài module**. (Như mọi khi, type và member `protected` **chỉ truy cập được trong subclass**.)

> *"However, a package that is not exported is not accessible outside its own module. This is quite different from Java before modules. In the past, you were able to use public classes from any package, even if it was not part of the public API. For example, it was commonly recommended to use classes such as sun.misc.BASE64Encoder or com.sun.rowset.CachedRowSetImpl when the public API did not provide the appropriate functionality."*

**Dịch:** Ngược lại, package **không được export thì không truy cập được từ ngoài module của nó**. Đây là điều **khác hẳn Java thời chưa có module**. Trước kia bạn **dùng được class `public` từ bất kỳ package nào**, kể cả khi nó không thuộc public API. Ví dụ người ta thường khuyên dùng class như `sun.misc.BASE64Encoder` hay `com.sun.rowset.CachedRowSetImpl` khi public API **không cung cấp chức năng phù hợp**.

> *"Nowadays, you can no longer access unexported packages from the Java platform API since all of them are contained inside modules. As a result, some programs will no longer run with Java 9. Of course, nobody ever committed to keeping non-public APIs available, so this should not come as a shock."*

**Dịch:** Ngày nay bạn **không còn truy cập được các package không export** từ Java platform API, vì **tất cả chúng đều nằm trong module**. Hệ quả là **một số chương trình sẽ không chạy được nữa với Java 9**. Dĩ nhiên **chẳng ai từng cam kết giữ các API không public** luôn có sẵn, nên chuyện này **không nên gây sốc**.

### Ví dụ: module `com.horstmann.greet`

> *"Let us put exports to use in a simple situation. We will prepare a module com.horstmann.greet that exports a package, also called com.horstmann.greet, following the convention that a module that provides code for others should be named after the top-level package inside it. There is also a package com.horstmann.greet.internal that we don't export."*

**Dịch:** Áp dụng `exports` vào một tình huống đơn giản. Ta chuẩn bị module `com.horstmann.greet` **export package cũng tên `com.horstmann.greet`**, theo quy ước **module cung cấp code cho người khác nên đặt tên theo top-level package bên trong nó**. Còn có package `com.horstmann.greet.internal` mà ta **không export**.

### `com.horstmann.greet/com/horstmann/greet/Greeter.java`

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

### `com.horstmann.greet/com/horstmann/greet/internal/GreeterImpl.java`

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

**Dịch:** Package thứ hai chứa class **implement interface**. Class này để **`public`** vì nó **được truy cập từ package thứ nhất**.

### `com.horstmann.greet/module-info.java`

> *"The com.horstmann.greet module contains both packages but only exports the first:"*

```java
module com.horstmann.greet
{
    exports com.horstmann.greet;
}
```

> *"The second package is inaccessible outside the module."*

**Dịch:** Module `com.horstmann.greet` **chứa cả hai package nhưng chỉ export package thứ nhất**. Package thứ hai **không truy cập được từ ngoài module**.

### `v2ch09.exportedpkg/module-info.java`

> *"We put our application into a second module, which will require the first module:"*

```java
module v2ch09.exportedpkg
{
    requires com.horstmann.greet;
}
```

> **Note (sách):** *"The exports statement is followed by a package name, whereas requires is followed by a module name."*
>
> **Dịch:** Sau `exports` là **tên package**, còn sau `requires` là **tên module**.

| Statement | Theo sau là |
|---|---|
| `exports` | **tên package** |
| `requires` | **tên module** |

### `v2ch09.exportedpkg/com/horstmann/hello/HelloWorld.java`

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

### Cấu trúc thư mục

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

v2ch09.exportedpkg
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
javac -p com.horstmann.greet v2ch09.exportedpkg/module-info.java \
  v2ch09.exportedpkg/com/horstmann/hello/HelloWorld.java
```

> *"Finally, run the program with both modules on the module path:"*

```bash
java -p v2ch09.exportedpkg:com.horstmann.greet \
  -m v2ch09.exportedpkg/com.horstmann.hello.HelloWorld
```

**Dịch:** Để build ứng dụng này: **compile module `com.horstmann.greet` trước**; rồi **compile module ứng dụng với module thứ nhất trên module path**; cuối cùng **chạy chương trình với cả hai module trên module path**.

> **Tip (sách):** *"To build this application with Eclipse, make a separate project for each module. In the v2ch09.exportedpkg project, edit the project properties. In the Projects tab, add the com.horstmann.greet module to the module path—see Figure 9.2."*
>
> **Dịch:** Để build ứng dụng này bằng **Eclipse**, tạo **project riêng cho mỗi module**. Trong project `v2ch09.exportedpkg`, sửa **project properties**; ở tab **Projects**, **thêm module `com.horstmann.greet` vào module path**.

### Tổng kết `requires` + `exports`

> *"You have now seen the requires and exports statements that form the backbone of the Java Platform Module System. As you can see, the module system is conceptually simple. Modules specify what modules they need, and which packages they offer to other modules. Section 9.12, "Qualified Exporting and Opening," on p. 521 shows a minor variation of the exports statement."*

**Dịch:** Bạn đã thấy `requires` và `exports` — **xương sống của Java Platform Module System**. Về mặt khái niệm, module system **đơn giản**: module **chỉ định nó cần module nào**, và **cung cấp package nào cho module khác**. Xem thêm một biến thể nhỏ của `exports` ở [[12 - Qualified Exporting and Opening (Vol II)]].

### ⚠️ Module KHÔNG tạo scope

> **Caution (sách):** *"A module does not provide a scope. You cannot have two packages with the same name in different modules. This is true even for hidden packages (that is, packages that are not exported.)"*
>
> **Dịch:** Module **không tạo ra một scope**. Bạn **không thể có hai package trùng tên ở hai module khác nhau**. Điều này đúng **kể cả với package bị giấu** (tức package không được export).

---

## Bài kế tiếp

→ [[06 - Modular JARs (Vol II)]] — đóng gói module thành JAR, `--module-version`, split package, và layer.
