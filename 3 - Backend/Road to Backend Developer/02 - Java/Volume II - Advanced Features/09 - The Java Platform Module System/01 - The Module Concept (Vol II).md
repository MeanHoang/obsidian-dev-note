# 01 — The Module Concept

> Chapter 9, Section 9.1 — Core Java Volume II: Advanced Features, 11th Edition (Horstmann), Java 11.
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.
> Chủ đề này cũng có trong Volume I chương 12 ([[01 - The Module Concept]]) — bản đó viết cho Java 21, mới hơn.

---

## Mở đầu chương 9

> *"An important characteristic of object-oriented programming is encapsulation. A class declaration consists of a public interface and a private implementation. A class can evolve by changing the implementation without affecting its users. A module system provides the same benefits for programming in the large. A module can make classes and packages selectively available so that its evolution can be controlled."*
>
> *"Several existing Java module systems rely on class loaders to isolate classes. However, Java 9 introduced a new system, called the Java Platform Module System, that is supported by the Java compiler and virtual machine. It was designed to modularize the large code base of the Java platform. You can, if you choose, use this system to modularize your own applications."*
>
> *"Whether or not you use Java platform modules in your own applications, you may be impacted by the modularized Java platform. This chapter shows you how to declare and use Java platform modules. You will also learn how to migrate your applications to work with the modularized Java platform and third-party modules."*

**Dịch:** Một đặc tính quan trọng của lập trình hướng object là **encapsulation**. Một khai báo class gồm **public interface** và **private implementation**. Class có thể tiến hoá bằng cách **đổi implementation mà không ảnh hưởng tới người dùng nó**. **Module system mang lại đúng lợi ích đó cho lập trình quy mô lớn**: một module có thể **chọn lọc phơi bày class và package**, nhờ đó kiểm soát được sự tiến hoá của nó.

Một số module system Java đã có dựa vào **class loader để cô lập class**. Tuy nhiên, **Java 9 giới thiệu một hệ thống mới — Java Platform Module System — được chính compiler và virtual machine của Java hỗ trợ**. Nó được thiết kế để **modular hoá code base khổng lồ của nền tảng Java**. Nếu muốn, bạn cũng có thể dùng hệ thống này để modular hoá ứng dụng của chính mình.

Dù bạn có dùng Java platform module trong ứng dụng của mình hay không, **bạn vẫn có thể bị ảnh hưởng bởi nền tảng Java đã được modular hoá**. Chương này chỉ cho bạn cách **khai báo và dùng Java platform module**, đồng thời cách **migrate ứng dụng để chạy được với nền tảng Java modular hoá và với module của bên thứ ba**.

---

## 9.1 The Module Concept

### Class rồi tới package

> *"In object-oriented programming, the fundamental building block is the class. Classes provide encapsulation. Private features can only be accessed by code that has explicit permission—namely, the methods of the class. This makes it possible to reason about access. If a private variable has changed, you can produce a set of all possible culprits. If you need to modify the private representation, you know which methods are affected."*

**Dịch:** Trong lập trình hướng object, **viên gạch nền tảng là class**. Class cung cấp **encapsulation**. Feature `private` chỉ truy cập được bởi code **có phép tường minh** — tức là các method của chính class đó. Nhờ vậy **lập luận được về access**: nếu một biến private bị đổi, bạn liệt kê được **tập tất cả thủ phạm khả dĩ**; nếu cần sửa cách biểu diễn private, bạn **biết method nào bị ảnh hưởng**.

> *"In Java, packages provide the next larger organizational grouping. A package is a collection of classes. Packages also provide a level of encapsulation. Any feature with package access (neither public nor private) is accessible only from methods in the same package."*

**Dịch:** Trong Java, **package** là cấp gom nhóm lớn hơn kế tiếp. Package là **một tập hợp class**. Package cũng cho **một mức encapsulation**: feature có **package access** (không `public` cũng không `private`) chỉ truy cập được từ method **trong cùng package**. (Xem [[08 - Packages]].)

### Vấn đề: `public` là công khai khắp nơi

> *"However, in large systems, this level of access control is not enough. Any public feature (that is, a feature that is accessible outside a package) is accessible everywhere. Suppose you want to modify or drop a rarely used feature. Once it is public, there is no way to reason about the impact of that change."*

**Dịch:** Nhưng trong **hệ thống lớn**, mức kiểm soát truy cập này **không đủ**. Mọi feature `public` (tức feature truy cập được từ ngoài package) là **truy cập được ở khắp nơi**. Giả sử bạn muốn sửa hoặc bỏ một feature ít dùng — một khi nó đã `public` thì **không cách nào lập luận được tác động của thay đổi đó**.

### Chính JDK gặp vấn đề này

> *"This is the situation that the Java platform designers faced. Over twenty years, the JDK grew by leaps and bounds, but clearly some features are now essentially obsolete. Everyone's favorite example is CORBA. When was the last time you used it? Yet, the org.omg.corba package was shipped with every JDK until Java 10. As of Java 11, those few who still need it must add the required JAR files to their projects."*

**Dịch:** Đây chính là tình cảnh mà **những người thiết kế nền tảng Java** đối mặt. Suốt hơn hai mươi năm, JDK **phình ra nhảy vọt**, nhưng rõ ràng **một số feature nay đã lỗi thời**. Ví dụ khoái khẩu của mọi người là **CORBA**. Lần cuối bạn dùng nó là khi nào? Vậy mà package `org.omg.corba` vẫn được **ship kèm mọi JDK cho tới Java 10**. **Từ Java 11**, số ít người còn cần nó phải **tự thêm JAR** vào project.

> *"What about java.awt? It shouldn't be required in a server-side application, right? Except that the class java.awt.DataFlavor is used in the implementation of SOAP, an XML-based web services protocol."*

**Dịch:** Còn `java.awt` thì sao? Lẽ ra **không cần** trong một ứng dụng server-side chứ? Chỉ có điều class **`java.awt.DataFlavor` lại được dùng trong implementation của SOAP**, một giao thức web service dựa trên XML.

### Ra đời Java Platform Module System

> *"The Java platform designers, faced with a giant hairball of code, decided that they needed a structuring mechanism that provides more control. They looked at existing module systems (such as OSGi) and found them unsuitable for their problem. Instead, they designed a new system, called the Java Platform Module System, that is now a part of the Java language and virtual machine. That system has been used successfully to modularize the Java API, and you can, if you so choose, use it with your own applications."*

**Dịch:** Đứng trước **một búi code khổng lồ rối nùi**, những người thiết kế nền tảng Java quyết định họ cần một **cơ chế cấu trúc cho nhiều kiểm soát hơn**. Họ xem các module system sẵn có (như **OSGi**) và thấy **không phù hợp** với vấn đề của mình. Thay vào đó, họ thiết kế một hệ thống mới gọi là **Java Platform Module System**, nay là **một phần của ngôn ngữ Java và của virtual machine**. Hệ thống đó đã được dùng thành công để **modular hoá Java API**, và bạn cũng **có thể chọn dùng nó cho ứng dụng của mình**.

### Một module gồm những gì

> *"A Java platform module consists of"*
> - *"A collection of packages"*
> - *"Optionally, resource files and other files such as native libraries"*
> - *"A list of the accessible packages in the module"*
> - *"A list of all modules on which this module depends"*

**Dịch:** Một Java platform module gồm:

| Thành phần | Nội dung |
|---|---|
| Packages | Một tập hợp package |
| Tuỳ chọn | Resource file và file khác, ví dụ **native library** |
| Danh sách 1 | Các package **truy cập được** trong module |
| Danh sách 2 | **Mọi module mà module này phụ thuộc vào** |

> *"The Java platform enforces encapsulation and dependencies, both at compile time and in the virtual machine."*

**Dịch:** Nền tảng Java **cưỡng chế encapsulation và dependency**, cả **lúc compile** lẫn **trong virtual machine**.

### Hai lợi thế so với JAR trên class path

> *"Why should you consider using the Java Platform Module System for your own programs instead of following the traditional approach of using JAR files on the class path? There are two advantages."*
>
> 1. *"**Strong encapsulation**: You can control which of your packages are accessible, and you don't have to worry about maintaining code that you didn't intend for public consumption."*
> 2. *"**Reliable configuration**: You avoid common class path problems such as duplicate or missing classes."*

**Dịch:** Vì sao nên cân nhắc dùng Java Platform Module System cho chương trình của mình thay vì cách truyền thống là **để JAR file trên class path** (xem [[09 - JAR Files]])? Có **hai lợi thế**:

| Lợi thế | Nghĩa |
|---|---|
| **Strong encapsulation** | Bạn **kiểm soát được package nào truy cập được**, và **không phải lo bảo trì** code vốn không định cho người ngoài dùng |
| **Reliable configuration** | Tránh được các vấn đề class path thường gặp như **class trùng lặp hoặc thiếu class** |

### Điều module system KHÔNG giải quyết

> *"There are some issues that the Java Platform Module System does not address, such as versioning of modules. There is no support for specifying which version of a module is required, or for using multiple versions of a module in the same program. These can be desirable features, but you must use mechanisms other than the Java Platform Module System if you need them."*

**Dịch:** Có một số vấn đề mà Java Platform Module System **không xử lý**, chẳng hạn **versioning cho module**. **Không có hỗ trợ** để chỉ định **cần version nào** của một module, cũng **không** hỗ trợ dùng **nhiều version của cùng một module** trong cùng chương trình. Đó có thể là những feature đáng mong muốn, nhưng nếu cần thì bạn **phải dùng cơ chế khác**, không phải Java Platform Module System.

---

## Bài kế tiếp

→ [[02 - Naming Modules (Vol II)]] — quy tắc đặt tên module, quy ước reverse domain name, và vì sao module không có quan hệ phân cấp.
