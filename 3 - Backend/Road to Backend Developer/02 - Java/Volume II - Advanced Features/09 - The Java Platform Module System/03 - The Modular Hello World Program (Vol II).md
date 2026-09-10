# 03 — The Modular "Hello, World!" Program

> Chapter 9, Section 9.3 — Core Java Volume II: Advanced Features, 11th Edition (Horstmann), Java 11.
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 9.3 The Modular "Hello, World!" Program

### Class phải nằm trong package

> *"Let us put the traditional "Hello, World!" program into a module. First, we need to put the class into a package—the "unnamed package" cannot be contained in a module. Here it is:"*

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

**Dịch:** Đưa chương trình "Hello, World!" truyền thống vào một module. Trước hết phải **đặt class vào một package** — **"unnamed package" không nằm trong module được** (xem [[08 - Packages]]).

### `module-info.java` và cấu trúc thư mục

> *"So far, nothing has changed. To make a module v2ch09.hellomod containing this package, you need to add a module declaration. You place it in a file named module-info.java, located in the base directory (that is, the same directory that contains the com directory). By convention, the name of the base directory is the same as the module name."*

```
v2ch09.hellomod/
├ module-info.java
└ com/
  └ horstmann/
    └ hello/
      └ HelloWorld.java
```

**Dịch:** Tới đây **chưa có gì thay đổi**. Để tạo module `v2ch09.hellomod` chứa package này, bạn cần thêm một **module declaration**, đặt trong file tên **`module-info.java`**, nằm ở **base directory** (tức thư mục chứa thư mục `com`). Theo quy ước, **tên base directory trùng tên module**.

### Listing — `v2ch09.hellomod/module-info.java`

> *"The module-info.java file contains the module declaration:"*

```java
module v2ch09.hellomod
{
}
```

> *"This module declaration is empty because the module has nothing to offer to anyone, nor does it need anything."*

**Dịch:** Module declaration này **rỗng** vì module **không có gì để cung cấp cho ai**, mà cũng **không cần gì cả**.

### Compile

> *"Now, compile as usual:"*

```bash
javac v2ch09.hellomod/module-info.java v2ch09.hellomod/com/horstmann/hello/HelloWorld.java
```

**Dịch:** Compile **như bình thường**.

### `module-info` không phải class thường

> *"The module-info.java file doesn't look like a Java source file, and of course there can't be a class with the name module-info, since class names cannot contain hyphens. The module keyword, as well as keywords requires, exports, and so on, that you will see in the following sections, are "restricted keywords" that have a special meaning only in module declarations. The file is compiled into a class file module-info.class that contains the module definition in binary form."*

**Dịch:** File `module-info.java` **trông không giống file nguồn Java**, và dĩ nhiên **không thể có class tên `module-info`** vì tên class **không chứa được dấu gạch nối**. Keyword `module`, cũng như `requires`, `exports`, v.v. mà bạn sẽ thấy ở các phần sau, là **"restricted keywords"** — chỉ **mang nghĩa đặc biệt trong module declaration**. File này được compile thành file class **`module-info.class`**, chứa **định nghĩa module ở dạng nhị phân**.

### Chạy: module path và main class

> *"To run this program as a modular application, you specify the module path, which is similar to the class path but contains modules. You also specify the main class in the format modulename/classname:"*

```bash
java --module-path v2ch09.hellomod --module v2ch09.hellomod/com.horstmann.hello.HelloWorld
```

> *"Instead of --module-path and --module, you can use the single-letter options -p and -m:"*

```bash
java -p v2ch09.hellomod -m v2ch09.hellomod/com.horstmann.hello.HelloWorld
```

> *"Either way, the "Hello, Modular World" greeting will appear, demonstrating that you have successfully modularized your first application."*

**Dịch:** Để chạy chương trình này như một **modular application**, bạn chỉ định **module path** — tương tự class path nhưng **chứa module**. Bạn cũng chỉ định **main class theo định dạng `modulename/classname`**. Thay cho `--module-path` và `--module`, dùng được **option một chữ cái `-p` và `-m`**. Kiểu nào cũng ra lời chào "Hello, Modular World", chứng tỏ bạn đã **modular hoá thành công ứng dụng đầu tiên**.

| Option dài | Option ngắn | Ý nghĩa |
|---|---|---|
| `--module-path` | `-p` | module path (tương tự class path nhưng chứa module) |
| `--module` | `-m` | main class, dạng `modulename/classname` |

### Cảnh báo về chữ số cuối tên module

> **Note (sách):** *"When you compile this module, you get a warning:"*
>
> ```
> warning: [module] module name component v2ch09 should avoid terminal digits
> ```
>
> *"This warning is intended to discourage programmers from adding version numbers to module names. You can ignore the warning, or suppress it with an annotation:"*
>
> ```java
> @SuppressWarnings("module")
> module v2ch09.hellomod
> {
> }
> ```
>
> *"In this one respect, the module declaration is just like a class declaration: You can annotate it. (The annotation type must have target ElementType.MODULE.)"*
>
> **Dịch:** Compile module này sẽ có **warning** rằng thành phần tên module `v2ch09` **nên tránh chữ số ở cuối**. Warning này nhằm **khuyên can lập trình viên đừng thêm số version vào tên module**. Bạn có thể **bỏ qua** warning, hoặc **dập nó bằng annotation** `@SuppressWarnings("module")`. Ở riêng điểm này, module declaration **giống class declaration**: bạn **annotate nó được**. (Kiểu annotation phải có target **`ElementType.MODULE`**.)

---

## Bài kế tiếp

→ [[04 - Requiring Modules (Vol II)]] — `requires`, module graph, `java.base`, và khái niệm module M "reads" module N.
