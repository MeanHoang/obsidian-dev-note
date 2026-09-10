# 01 — The Module Concept

> Chapter 12, Section 12.1 — Core Java Volume I, 13th Edition (Horstmann).
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## Mở đầu chương

> *"An important characteristic of object-oriented programming is encapsulation. A class declaration consists of a public interface and a private implementation. A class can evolve by changing the implementation without affecting its users. A module system provides the same benefits for programming in the large. A module can make classes and packages selectively available so that its evolution can be controlled."*

**Dịch:** Một đặc điểm quan trọng của lập trình hướng đối tượng là **encapsulation**. Khai báo một class gồm một **public interface** và một **private implementation**. Một class có thể tiến hoá bằng cách đổi implementation mà **không ảnh hưởng người dùng nó**. Một **module system** mang lại đúng những lợi ích đó cho **lập trình quy mô lớn**. Một module có thể làm cho các class và package **available một cách chọn lọc**, nhờ đó sự tiến hoá của nó được kiểm soát.

> *"Several existing Java module systems rely on class loaders to isolate classes. However, Java 9 introduced a new system, called the Java Platform Module System, that is supported by the Java compiler and virtual machine. It was designed to modularize the large code base of the Java platform. You can, if you choose, use this system to modularize your own applications."*

**Dịch:** Một số module system sẵn có của Java dựa vào **class loader** để cô lập class. Nhưng **Java 9** giới thiệu một hệ thống mới, gọi là **Java Platform Module System**, được **compiler và virtual machine của Java hỗ trợ**. Nó được thiết kế để **module hoá code base khổng lồ của Java platform**. Bạn cũng có thể dùng hệ thống này để module hoá application của chính mình, nếu muốn.

> *"Whether or not you use Java platform modules in your own applications, you may be impacted by the modularized Java platform. This chapter shows you how to declare and use Java platform modules. You will also learn how to migrate your applications to work with the modularized Java platform and third-party modules."*

**Dịch:** Dù bạn có dùng Java platform module trong application của mình hay không, bạn **vẫn có thể bị ảnh hưởng** bởi Java platform đã được module hoá. Chương này chỉ cách **khai báo và sử dụng** Java platform module, và cách **migrate** application để chạy được với Java platform đã module hoá cùng các module bên thứ ba.

---

## 12.1. The Module Concept

> *"In object-oriented programming, the fundamental building block is the class. Classes provide encapsulation. Private features can only be accessed by code that has explicit permission—namely, the methods of the class. This makes it possible to reason about access. If a private variable has changed, you can produce a set of all possible culprits. If you need to modify the private representation, you know which methods are affected."*

**Dịch:** Trong lập trình hướng đối tượng, **viên gạch nền tảng là class**. Class cung cấp encapsulation. Các thành phần `private` **chỉ được truy cập bởi code có quyền tường minh** — tức là các method của chính class đó. Điều này khiến ta **lập luận được về truy cập**: nếu một biến private bị thay đổi, bạn có thể liệt kê ra **toàn bộ thủ phạm khả dĩ**; nếu cần sửa cách biểu diễn private, bạn **biết những method nào bị ảnh hưởng**.

> *"In Java, packages provide the next larger organizational grouping. A package is a collection of classes. Packages also provide a level of encapsulation. Any feature with package access (neither public nor private) is accessible only from methods in the same package."*

**Dịch:** Trong Java, **package** là cấp gom nhóm lớn hơn kế tiếp. Một package là **một tập hợp các class**. Package cũng cung cấp **một mức encapsulation**: bất kỳ thành phần nào có **package access** (không `public` cũng không `private`) chỉ truy cập được **từ các method trong cùng package**. → Xem [[08 - Packages]].

> *"However, in large systems, this level of access control is not enough. Any public feature (that is, a feature that is accessible outside a package) is accessible everywhere. Suppose you want to modify or drop a rarely used feature. Once it is public, there is no way to reason about the impact of that change."*

**Dịch:** Nhưng trong **hệ thống lớn**, mức kiểm soát truy cập này **chưa đủ**. Bất kỳ thành phần `public` nào (tức thành phần truy cập được từ ngoài package) đều **truy cập được ở khắp mọi nơi**. Giả sử bạn muốn sửa hoặc bỏ một thành phần hiếm khi dùng: một khi nó đã `public` thì **không có cách nào lập luận được về tác động** của thay đổi đó.

### CORBA và java.awt — ví dụ của sách

> *"This is the situation that the Java platform designers faced. Over twenty years, the JDK grew by leaps and bounds, but clearly some features are now essentially obsolete. Everyone's favorite example is CORBA. When was the last time you used it? Yet, the org.omg.corba package was shipped with every JDK until Java 10. As of Java 11, those few who still need it must add the required JAR files to their projects."*

**Dịch:** Đây chính là tình cảnh mà những người thiết kế Java platform gặp phải. Hơn hai mươi năm, JDK **phình ra nhảy vọt**, nhưng rõ ràng một số thành phần giờ **về cơ bản đã lỗi thời**. Ví dụ ai cũng thích nhắc là **CORBA**. Lần cuối bạn dùng nó là khi nào? Vậy mà package `org.omg.corba` vẫn được **ship kèm mọi JDK cho tới Java 10**. Từ **Java 11**, số ít người còn cần nó phải **tự thêm các file JAR** vào project của mình.

> *"What about java.awt? It shouldn't be required in a server-side application, right? Except that the class java.awt.DataFlavor is used in the implementation of SOAP, an XML-based web services protocol."*

**Dịch:** Còn `java.awt` thì sao? Đáng lẽ **không cần thiết** trong một application phía server, đúng không? Trừ việc class `java.awt.DataFlavor` **được dùng trong implementation của SOAP**, một giao thức web service dựa trên XML.

> *"The Java platform designers, faced with a giant hairball of code, decided that they needed a structuring mechanism that provides more control. They looked at existing module systems (such as OSGi) and found them unsuitable for their problem. Instead, they designed a new system, called the Java Platform Module System, that is now a part of the Java language and virtual machine. That system has been used successfully to modularize the Java API, and you can, if you so choose, use it with your own applications."*

**Dịch:** Đối mặt với **một búi code khổng lồ**, những người thiết kế Java platform kết luận rằng họ cần **một cơ chế cấu trúc cho phép kiểm soát nhiều hơn**. Họ nhìn qua các module system sẵn có (như **OSGi**) và thấy **không phù hợp** với vấn đề của mình. Thay vào đó, họ thiết kế một hệ thống mới — **Java Platform Module System** — nay là **một phần của ngôn ngữ Java và virtual machine**. Hệ thống đó đã được dùng thành công để module hoá **Java API**, và bạn cũng có thể dùng nó cho application của mình.

### Một Java platform module gồm những gì

> *"A Java platform module consists of"*
> - *"A collection of packages"*
> - *"Optionally, resource files and other files such as native libraries"*
> - *"A list of the accessible packages in the module"*
> - *"A list of all modules on which this module depends"*

**Dịch:** Một Java platform module gồm:

| Thành phần | Nội dung |
|---|---|
| Packages | **Một tập hợp các package** |
| Files (tuỳ chọn) | **resource file** và các file khác, chẳng hạn **native library** |
| Accessible packages | **Danh sách các package truy cập được** trong module |
| Dependencies | **Danh sách mọi module mà module này phụ thuộc vào** |

> *"The Java platform enforces encapsulation and dependencies, both at compile time and in the virtual machine."*

**Dịch:** Java platform **cưỡng chế** encapsulation và dependency, **cả ở compile time lẫn trong virtual machine**.

### Hai lợi thế so với JAR trên class path

> *"Why should you consider using the Java Platform Module System for your own programs instead of following the traditional approach of using JAR files on the class path? There are two advantages."*
>
> *"1. Strong encapsulation: You can control which of your packages are accessible, and you don't have to worry about maintaining code that you didn't intend for public consumption."*
>
> *"2. Reliable configuration: You avoid common class path problems such as duplicate or missing classes."*

**Dịch:** Vì sao nên cân nhắc dùng Java Platform Module System cho chương trình của mình thay cho cách truyền thống là đặt **JAR files trên class path**? Có **hai lợi thế**:

| Lợi thế | Nội dung |
|---|---|
| **Strong encapsulation** | Bạn **kiểm soát được package nào truy cập được**, và **không phải lo bảo trì** phần code vốn không định cho người ngoài dùng |
| **Reliable configuration** | Bạn **tránh được các vấn đề class path quen thuộc**, như class **trùng lặp** hoặc **thiếu** |

→ Xem [[09 - JAR Files]] và [[08 - Packages]].

### Điều module system KHÔNG giải quyết

> *"There are some issues that the Java Platform Module System does not address, such as versioning of modules. There is no support for specifying which version of a module is required, or for using multiple versions of a module in the same program. These can be desirable features, but you must use mechanisms other than the Java Platform Module System if you need them."*

**Dịch:** Có những vấn đề mà Java Platform Module System **không xử lý**, chẳng hạn **versioning của module**. **Không có hỗ trợ** để chỉ định **cần version nào** của một module, cũng **không hỗ trợ dùng nhiều version của cùng một module** trong cùng một chương trình. Đó có thể là những tính năng đáng mong muốn, nhưng nếu cần thì bạn **phải dùng cơ chế khác** ngoài Java Platform Module System.

---

## Bài kế tiếp

→ [[02 - Naming Modules]] — quy tắc đặt tên module, quy ước "reverse domain name", và vì sao tên module không có quan hệ phân cấp.
