# 04 — Requiring Modules

> Chapter 9, Section 9.4 — Core Java Volume II: Advanced Features, 11th Edition (Horstmann), Java 11.
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 9.4 Requiring Modules

### Compile lỗi khi chưa khai báo requires

> *"Let us make a new module v2ch09.requiremod in which a program uses a JOptionPane to show the "Hello, Modular World" message:"*

```java
package com.horstmann.hello;

import javax.swing.JOptionPane;

public class HelloWorld
{
    public static void main(String[] args)
    {
        JOptionPane.showMessageDialog(null, "Hello, Modular World!");
    }
}
```

> *"Now compilation fails with this message:"*

```
error: package javax.swing is not visible
  (package javax.swing is declared in module java.desktop,
   but module v2ch09.requiremod does not read it)
```

**Dịch:** Tạo module mới `v2ch09.requiremod` trong đó chương trình dùng `JOptionPane` để hiện thông điệp. Lúc này **compile thất bại**: package `javax.swing` **không nhìn thấy được** — nó được khai báo trong module `java.desktop`, nhưng module `v2ch09.requiremod` **không "read" module đó**.

### Khai báo `requires`

> *"The JDK has been modularized, and the javax.swing package is now contained in the java.desktop module. Our module needs to declare that it relies on that module:"*

```java
module v2ch09.requiremod
{
    requires java.desktop;
}
```

**Dịch:** JDK **đã được modular hoá**, và package `javax.swing` nay **nằm trong module `java.desktop`**. Module của ta cần **khai báo là nó dựa vào module đó**.

> *"It is a design goal of the module system that modules are explicit about their requirements, so the virtual machine can ensure that all requirements are fulfilled before starting a program."*

**Dịch:** Đó là **mục tiêu thiết kế** của module system: module phải **tường minh về các yêu cầu của mình**, để virtual machine **đảm bảo mọi yêu cầu được thoả mãn trước khi khởi động chương trình**.

### `java.base` được require mặc định

> *"In the preceding section, the need for explicit requirements did not arise because we only used the java.lang and java.io packages. These packages are included in the java.base module which is required by default."*

**Dịch:** Ở phần trước, chưa cần khai báo yêu cầu tường minh vì ta **chỉ dùng package `java.lang` và `java.io`**. Các package này nằm trong module **`java.base`**, module **được require mặc định**.

### Module chỉ liệt kê yêu cầu của chính mình

> *"Note that our v2ch09.requiremod module lists only its own module requirements. It requires the java.desktop module so that it can use the javax.swing package. The java.desktop module itself declares that it requires three other modules, namely java.datatransfer, java.prefs, and java.xml."*

**Dịch:** Lưu ý module `v2ch09.requiremod` **chỉ liệt kê yêu cầu của riêng nó**. Nó require `java.desktop` để dùng được package `javax.swing`. Bản thân module `java.desktop` **khai báo rằng nó require ba module khác**: `java.datatransfer`, `java.prefs`, và `java.xml`.

### Module graph

> *"Figure 9.1 shows the module graph whose nodes are modules. The edges of the graph—the arrows joining nodes—are either declared requirements or the implied requirement on java.base when none is declared."*

**Dịch:** Figure 9.1 cho thấy **module graph** với **node là các module**. **Cạnh** của graph — mũi tên nối các node — **hoặc là yêu cầu được khai báo**, **hoặc là yêu cầu ngầm định lên `java.base`** khi không khai báo gì.

**Figure 9.1: The module graph of the Swing "Hello, Modular World" application**

```
                    ( v2ch09.requiremod )
                              │
                              ▼
                      ( java.desktop )
                     ╱        │        ╲
                    ╱         │         ╲
                   ▼          │          ▼
     ( java.datatransfer )    │      ( java.prefs )
              ╲               │          ╱
               ╲              ▼         ▼
                ╲        ( java.xml )
                 ╲            │
                  ╲           │
                   ▼          ▼
                    ( java.base )
```

> *"You cannot have cycles in the module graph—that is, a module cannot directly or indirectly require itself."*

**Dịch:** **Không được có chu trình (cycle) trong module graph** — tức một module **không được require chính nó**, dù trực tiếp hay gián tiếp.

### `requires` KHÔNG transitive

> *"A module does not automatically pass on access rights to other modules. In our example, the java.desktop module declares that it requires java.prefs, and the java.prefs module declares that it requires java.xml. That does not give java.desktop the right to use packages from the java.xml module. It needs to explicitly declare that requirement. In mathematical terms, the requires relationship is not "transitive." Generally, this behavior is desirable because it makes requirements explicit, but as you will see in Section 9.11, "Transitive and Static Requirements," on p. 519, you can relax it in some cases."*

**Dịch:** Một module **không tự động chuyển tiếp quyền truy cập** cho module khác. Trong ví dụ, `java.desktop` khai báo require `java.prefs`, và `java.prefs` khai báo require `java.xml`. Điều đó **không cho `java.desktop` quyền dùng package từ `java.xml`** — nó **phải khai báo tường minh** yêu cầu đó. Nói theo toán học, quan hệ `requires` **không "transitive"**. Nhìn chung hành vi này **đáng mong muốn** vì nó làm các yêu cầu trở nên tường minh, nhưng như sẽ thấy ở [[11 - Transitive and Static Requirements (Vol II)]], bạn **nới lỏng được nó trong một số trường hợp**.

### Khi nào module M "reads" module N

> **Note (sách):** *"The error message at the beginning of this section stated that our v2ch09.requiremod module did not "read" the java.desktop module. In the parlance of the Java Platform Module System, module M reads module N in the following cases:"*
>
> 1. *"M requires N."*
> 2. *"M requires a module that transitively requires N (see Section 9.11, "Transitive and Static Requirements," on p. 519)."*
> 3. *"N is M or java.base."*
>
> **Dịch:** Thông báo lỗi đầu phần này nói module `v2ch09.requiremod` **không "read"** module `java.desktop`. Theo cách nói của Java Platform Module System, **module M reads module N** trong các trường hợp:

| # | Trường hợp |
|---|---|
| 1 | **M requires N** |
| 2 | M requires một module mà module đó **transitively requires N** |
| 3 | **N chính là M**, hoặc **N là `java.base`** |

---

## Bài kế tiếp

→ [[05 - Exporting Packages (Vol II)]] — `exports`, package ẩn, và ví dụ hai module `com.horstmann.greet` / `v2ch09.exportedpkg`.
