# 02 — Naming Modules

> Chapter 12, Section 12.2 — Core Java Volume I, 13th Edition (Horstmann).
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 12.2. Naming Modules

> *"A module is a collection of packages. The package names in the module need not be related. For example, the module java.sql contains packages java.sql, javax.sql, and javax.transaction.xa. Also, as you can see from this example, it is perfectly acceptable for the module name to be the same as a package name."*

**Dịch:** Một module là **một tập hợp các package**. Tên các package trong module **không nhất thiết phải liên quan nhau**. Ví dụ, module `java.sql` chứa các package `java.sql`, `javax.sql`, và `javax.transaction.xa`. Cũng qua ví dụ này, có thể thấy việc **tên module trùng với một tên package** là **hoàn toàn chấp nhận được**.

```
module java.sql
   ├ package java.sql
   ├ package javax.sql
   └ package javax.transaction.xa
```

> *"Just like a package name, a module name is made up of letters, digits, underscores, and periods. Also, just as with package names, there is no hierarchical relationship between modules. If you had a module com.horstmann and another module com.horstmann.corejava, they would be unrelated, as far as the module system is concerned."*

**Dịch:** Giống như tên package, **tên module gồm chữ cái, chữ số, dấu gạch dưới và dấu chấm**. Và cũng giống tên package, **không có quan hệ phân cấp giữa các module**. Nếu bạn có module `com.horstmann` và module `com.horstmann.corejava`, thì đối với module system chúng **hoàn toàn không liên quan gì nhau**. → Xem [[08 - Packages]].

### Tên phải duy nhất toàn cầu

> *"When creating a module for use by others, it is important to ensure that its name is globally unique. It is expected that most module names will follow the “reverse domain name” convention, just like package names."*

**Dịch:** Khi tạo một module cho người khác dùng, việc **đảm bảo tên duy nhất trên phạm vi toàn cầu** là quan trọng. Người ta kỳ vọng hầu hết tên module sẽ theo quy ước **"reverse domain name"** (tên miền viết ngược), y như tên package.

> *"The easiest approach is to name a module after the top-level package that the module provides. For example, the SLF4J logging façade has a module org.slf4j with packages org.slf4j, org.slf4j.spi, org.slf4j.event, and org.slf4j.helpers."*

**Dịch:** Cách dễ nhất là **đặt tên module theo top-level package mà module đó cung cấp**. Ví dụ, SLF4J logging façade có module `org.slf4j` với các package `org.slf4j`, `org.slf4j.spi`, `org.slf4j.event`, và `org.slf4j.helpers`.

> *"This convention prevents package name conflicts in modules. Any given package can only be placed in one module. If your module names are unique and your package names start with the module name, then your package names will also be unique."*

**Dịch:** Quy ước này **ngăn xung đột tên package giữa các module**. **Một package bất kỳ chỉ được đặt trong đúng một module.** Nếu tên module của bạn là duy nhất và tên package của bạn **bắt đầu bằng tên module**, thì **tên package cũng sẽ duy nhất**.

### Tên ngắn cho module không dành cho người khác dùng

> *"You can use shorter module names for modules that are not meant to be used by other programmers, such as a module containing an application program. Just to show that it can be done, I will do the same in this chapter. Modules with what could plausibly be library code will have names such as com.horstmann.util, and modules containing programs (with a class that has a main method) will have catchy names such as v1ch12.hellomod."*

**Dịch:** Bạn **dùng được tên module ngắn hơn** cho những module **không nhằm để lập trình viên khác dùng**, chẳng hạn module chứa một chương trình application. Chỉ để cho thấy là làm được, tác giả cũng làm vậy trong chương này: module nào **trông giống code thư viện** sẽ mang tên kiểu `com.horstmann.util`, còn module **chứa chương trình** (có class với method `main`) sẽ mang tên bắt tai kiểu `v1ch12.hellomod`.

> **Note (sách):** *"Module names are only used in module declarations. In the source files for your Java classes, you never refer to module names; instead, use package names the way they have always been used."*
>
> **Dịch:** Tên module **chỉ được dùng trong module declaration**. Trong file nguồn của các class Java, bạn **không bao giờ nhắc tới tên module**; thay vào đó cứ **dùng tên package** như xưa nay vẫn dùng.

---

## Bài kế tiếp

→ [[03 - The Modular Hello World Program]] — đưa "Hello, World!" vào một module, viết `module-info.java`, biên dịch và chạy bằng module path.
