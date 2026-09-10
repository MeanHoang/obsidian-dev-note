# 02 — Naming Modules

> Chapter 9, Section 9.2 — Core Java Volume II: Advanced Features, 11th Edition (Horstmann), Java 11.
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 9.2 Naming Modules

### Tên package trong module không cần liên quan nhau

> *"A module is a collection of packages. The package names in the module need not be related. For example, the module java.sql contains packages java.sql, javax.sql, and javax.transaction.xa. Also, as you can see from this example, it is perfectly acceptable for the module name to be the same as a package name."*

**Dịch:** Module là **một tập hợp package**. Tên các package trong module **không cần liên quan gì với nhau**. Ví dụ module `java.sql` chứa các package `java.sql`, `javax.sql`, và `javax.transaction.xa`. Cũng qua ví dụ này thấy được: **tên module trùng với một tên package là hoàn toàn chấp nhận được**.

### Cú pháp tên và chuyện KHÔNG có phân cấp

> *"Just like a path name, a module name is made up of letters, digits, underscores, and periods. Also, just as with path names, there is no hierarchical relationship between modules. If you had a module com.horstmann and another module com.horstmann.corejava, they would be unrelated, as far as the module system is concerned."*

**Dịch:** Giống như **tên đường dẫn (path name)**, tên module gồm **chữ cái, chữ số, dấu gạch dưới và dấu chấm**. Và cũng giống path name, **không có quan hệ phân cấp nào giữa các module**. Nếu bạn có module `com.horstmann` và module `com.horstmann.corejava` thì với module system, chúng **chẳng liên quan gì tới nhau**.

### Tên phải duy nhất toàn cầu

> *"When creating a module for use by others, it is important to ensure that its name is globally unique. It is expected that most module names will follow the "reverse domain name" convention, just like package names."*

**Dịch:** Khi tạo module **cho người khác dùng**, quan trọng là **đảm bảo tên duy nhất trên toàn cầu**. Người ta kỳ vọng phần lớn tên module sẽ theo quy ước **"reverse domain name"** (tên miền viết ngược), **giống tên package** (xem [[08 - Packages]]).

> *"The easiest approach is to name a module after the top-level package that the module provides. For example, the SLF4J logging façade has a module org.slf4j with packages org.slf4j, org.slf4j.spi, org.slf4j.event, and org.slf4j.helpers."*

**Dịch:** Cách dễ nhất là **đặt tên module theo top-level package mà module đó cung cấp**. Ví dụ SLF4J logging façade có module `org.slf4j` với các package `org.slf4j`, `org.slf4j.spi`, `org.slf4j.event`, `org.slf4j.helpers`.

> *"This convention prevents package name conflicts in modules. Any given package can only be placed in one module. If your module names are unique and your package names start with the module name, then your package names will also be unique."*

**Dịch:** Quy ước này **ngăn xung đột tên package** giữa các module. **Một package bất kỳ chỉ được đặt trong đúng một module.** Nếu tên module của bạn duy nhất và tên package **bắt đầu bằng tên module**, thì **tên package cũng sẽ duy nhất**.

### Tên ngắn cho module không dành cho người khác

> *"You can use shorter module names for modules that are not meant to be used by other programmers, such as a module containing an application program. Just to show that it can be done, I will do the same in this chapter. Modules with what could plausibly be library code will have names such as com.horstmann.util, and modules containing programs (with a class that has a main method) will have catchy names such as v2ch09.hellomod."*

**Dịch:** Bạn **dùng tên module ngắn hơn** được cho những module **không dành cho lập trình viên khác dùng**, ví dụ module chứa một chương trình ứng dụng. Trong chương này tác giả cũng làm vậy: module trông giống **code thư viện** thì đặt tên kiểu `com.horstmann.util`, còn module **chứa chương trình** (có class với method `main`) thì đặt tên gọn kiểu `v2ch09.hellomod`.

| Loại module | Kiểu tên | Ví dụ trong chương |
|---|---|---|
| Code thư viện (cho người khác dùng) | reverse domain name, theo top-level package | `com.horstmann.util`, `com.horstmann.greet` |
| Chương trình ứng dụng | tên ngắn gọn | `v2ch09.hellomod`, `v2ch09.exportedpkg` |

> **Note (sách):** *"Module names are only used in module declarations. In the source files for your Java classes, you never refer to module names; instead, use package names the way they have always been used."*
>
> **Dịch:** Tên module **chỉ dùng trong module declaration**. Trong file nguồn của các class Java, bạn **không bao giờ nhắc tới tên module**; thay vào đó cứ **dùng tên package như xưa nay vẫn dùng**.

---

## Bài kế tiếp

→ [[03 - The Modular Hello World Program (Vol II)]] — `module-info.java`, cấu trúc thư mục module, và cách compile/chạy bằng `--module-path` / `--module`.
