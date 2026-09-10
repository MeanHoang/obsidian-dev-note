# 03 — The Modular Hello World Program

> Chapter 12, Section 12.3 — Core Java Volume I, 13th Edition (Horstmann).
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 12.3. The Modular "Hello, World!" Program

> *"Let us put the traditional “Hello, World!” program into a module. First, we need to put the class into a package—the “unnamed package” cannot be contained in a module. Here it is:"*

```java
package com.horstmann.hello;

public class HelloWorld
{
    public static void main(String[] args)
    {
        System.out.println("Hello, Modular World!");
    }
}
```

**Dịch:** Hãy đưa chương trình "Hello, World!" truyền thống vào một module. Trước hết, phải **đặt class vào một package** — **"unnamed package" không thể nằm trong một module**. → Xem [[08 - Packages]].

### module-info.java

> *"So far, nothing has changed. To make a module v1ch12.hellomod containing this package, you need to add a module declaration. You place it in a file named module-info.java, located in the base directory (that is, the same directory that contains the com directory). By convention, the name of the base directory is the same as the module name."*

**Dịch:** Tới đây thì **chưa có gì thay đổi**. Để tạo module `v1ch12.hellomod` chứa package này, bạn cần **thêm một module declaration**. Đặt nó trong file tên **`module-info.java`**, nằm ở **base directory** (tức thư mục chứa thư mục `com`). Theo quy ước, **tên base directory trùng với tên module**.

```
v1ch12.hellomod/
├ module-info.java
└ com/
  └ horstmann/
    └ hello/
      └ HelloWorld.java
```

> *"The module-info.java file contains the module declaration:"*

```java
module v1ch12.hellomod
{
}
```

> *"This module declaration is empty because the module has nothing to offer to anyone, nor does it need anything."*

**Dịch:** File `module-info.java` chứa module declaration. Khai báo module này **rỗng** vì module **không có gì để cung cấp cho ai**, mà cũng **không cần gì cả**.

### Biên dịch

> *"Now, compile as usual:"*

```bash
javac v1ch12.hellomod/module-info.java \
  v1ch12.hellomod/com/horstmann/hello/HelloWorld.java
```

**Dịch:** Giờ **biên dịch như bình thường**.

### module-info không phải là class

> *"The module-info.java file doesn't look like a Java source file, and of course there can't be a class with the name module-info, since class names cannot contain hyphens. The module keyword, as well as keywords requires, exports, and so on, that you will see in the following sections, are “restricted keywords” that have a special meaning only in module declarations. The file is compiled into a class file module-info.class that contains the module definition in binary form."*

**Dịch:** File `module-info.java` **trông không giống một file nguồn Java**, và dĩ nhiên **không thể có class tên `module-info`** vì tên class **không được chứa dấu gạch nối**. Keyword `module`, cũng như các keyword `requires`, `exports`, v.v. sẽ gặp ở các section sau, là **"restricted keywords"** — chỉ **mang ý nghĩa đặc biệt bên trong module declaration**. File này được biên dịch thành class file **`module-info.class`**, chứa **định nghĩa module ở dạng nhị phân**.

### Chạy bằng module path

> *"To run this program as a modular application, you specify the module path, which is similar to the class path but contains modules. You also specify the main class in the format modulename/classname:"*

```bash
java --module-path v1ch12.hellomod \
  --module v1ch12.hellomod/com.horstmann.hello.HelloWorld
```

**Dịch:** Để chạy chương trình này như một **modular application**, bạn chỉ định **module path** — tương tự class path nhưng **chứa các module**. Bạn cũng chỉ định **main class** theo định dạng **`modulename/classname`**.

> *"Instead of --module-path and --module, you can use the single-letter options -p and -m:"*

```bash
java -p v1ch12.hellomod -m v1ch12.hellomod/com.horstmann.hello.HelloWorld
```

**Dịch:** Thay cho `--module-path` và `--module`, bạn **dùng được option một chữ cái** là **`-p`** và **`-m`**.

| Option dài | Option ngắn |
|---|---|
| `--module-path` | `-p` |
| `--module` | `-m` |

> *"Either way, the "Hello, Modular World!" greeting will appear, demonstrating that you have successfully modularized your first application."*

**Dịch:** Kiểu nào thì lời chào **"Hello, Modular World!"** cũng hiện ra, chứng tỏ bạn đã **module hoá thành công application đầu tiên** của mình.

### Cảnh báo về chữ số cuối tên module

> **Note (sách):** *"When you compile this module, you get a warning:"*
>
> ```
> warning: [module] module name component v1ch12 should avoid terminal digits
> ```
>
> *"This warning is intended to discourage programmers from adding version numbers to module names. You can ignore the warning, or suppress it with an annotation:"*
>
> ```java
> @SuppressWarnings("module")
> module v1ch12.hellomod
> {
> }
> ```
>
> *"In this one respect, the module declaration is just like a class declaration: You can annotate it. (The annotation type must have target ElementType.MODULE.)"*
>
> **Dịch:** Khi biên dịch module này, bạn nhận được một warning. Warning này nhằm **can ngăn lập trình viên gắn số version vào tên module**. Bạn có thể **bỏ qua** nó, hoặc **dập nó bằng một annotation**. Ở riêng điểm này, **module declaration giống hệt class declaration: bạn annotate được nó**. (Annotation type phải có target là **`ElementType.MODULE`**.) → Xem [[01 - Using Annotations]].

---

## Bài kế tiếp

→ [[04 - Requiring Modules]] — khai báo `requires`, module graph, và ý nghĩa của việc một module "reads" module khác.
