# 04 — Requiring Modules

> Chapter 12, Section 12.4 — Core Java Volume I, 13th Edition (Horstmann).
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 12.4. Requiring Modules

> *"Let us make a new module v1ch12.requiremod in which a program uses a JOptionPane to show the “Hello, Modular World!” message:"*

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

**Dịch:** Hãy tạo một module mới `v1ch12.requiremod`, trong đó chương trình dùng `JOptionPane` để hiện thông điệp "Hello, Modular World!".

> *"Now compilation fails with this message:"*

```
error: package javax.swing is not visible
  (package javax.swing is declared in module java.desktop,
   but module v1ch12.requiremod does not read it)
```

**Dịch:** Lúc này **việc biên dịch thất bại** với thông báo trên.

### Khai báo requires

> *"The JDK has been modularized, and the javax.swing package is now contained in the java.desktop module. Our module needs to declare that it relies on that module:"*

```java
module v1ch12.requiremod
{
    requires java.desktop;
}
```

**Dịch:** JDK **đã được module hoá**, và package `javax.swing` giờ **nằm trong module `java.desktop`**. Module của ta cần **khai báo rằng nó dựa vào module đó**.

> *"It is a design goal of the module system that modules are explicit about their requirements, so the virtual machine can ensure that all requirements are fulfilled before starting a program."*

**Dịch:** Một **mục tiêu thiết kế** của module system là các module phải **tường minh về những gì mình cần**, để virtual machine **đảm bảo mọi yêu cầu đều được thoả mãn trước khi khởi động chương trình**.

### java.base được require mặc định

> *"In the preceding section, the need for explicit requirements did not arise because we only used the java.lang and java.io packages. These packages are included in the java.base module which is required by default."*

**Dịch:** Ở section trước, nhu cầu khai báo tường minh **chưa phát sinh** vì ta chỉ dùng package `java.lang` và `java.io`. Các package này nằm trong module **`java.base`**, vốn **được require mặc định**.

> *"Note that our v1ch12.requiremod module lists only its own module requirements. It requires the java.desktop module so that it can use the javax.swing package. The java.desktop module itself declares that it requires three other modules, namely java.datatransfer, java.prefs, and java.xml."*

**Dịch:** Lưu ý module `v1ch12.requiremod` **chỉ liệt kê yêu cầu của chính nó**. Nó require module `java.desktop` để dùng được package `javax.swing`. Bản thân module `java.desktop` khai báo rằng **nó require ba module khác**: `java.datatransfer`, `java.prefs`, và `java.xml`.

### Module graph

> *"Figure 12.1 shows the module graph whose nodes are modules. The edges of the graph (that is, the arrows joining nodes) are either declared requirements or, when no requirement is declared, the implied requirement of java.base."*

**Dịch:** Figure 12.1 cho thấy **module graph** với **node là các module**. **Cạnh của graph** (các mũi tên nối node) hoặc là **requirement được khai báo**, hoặc — khi không khai báo requirement nào — là **requirement ngầm định tới `java.base`**.

**Figure 12.1: A module graph**

```
        v1ch12.requiremod
                │ requires
                ▼
          java.desktop
           │      │      │  requires
           ▼      ▼      ▼
  java.datatransfer  java.prefs  java.xml
           │      │      │
           └──────┼──────┘  (requirement ngầm định)
                  ▼
              java.base
```

### Không có chu trình, và requires KHÔNG transitive

> *"You cannot have cycles in the module graph—that is, a module cannot directly or indirectly require itself."*

**Dịch:** **Không được có chu trình (cycle) trong module graph** — tức một module **không được require chính nó**, dù trực tiếp hay gián tiếp.

> *"A module does not automatically pass on access rights to other modules. In our example, the java.desktop module declares that it requires java.prefs, and the java.prefs module declares that it requires java.xml. That does not give java.desktop the right to use packages from the java.xml module. It needs to explicitly declare that requirement. In mathematical terms, the requires relationship is not “transitive.” Generally, this behavior is desirable because it makes requirements explicit, but as you will see in Section 12.11, you can relax it in some cases."*

**Dịch:** Một module **không tự động chuyển tiếp quyền truy cập** sang module khác. Trong ví dụ trên, `java.desktop` khai báo require `java.prefs`, và `java.prefs` khai báo require `java.xml`. Điều đó **không cho `java.desktop` quyền dùng package từ module `java.xml`** — nó phải **khai báo requirement đó một cách tường minh**. Nói theo ngôn ngữ toán học, quan hệ `requires` **không có tính "transitive"**. Nhìn chung hành vi này là **đáng mong muốn** vì nó khiến các requirement trở nên tường minh, nhưng như sẽ thấy ở Section 12.11, **có thể nới lỏng nó trong một số trường hợp**. → Xem [[11 - Transitive and Static Requirements]].

### Khi nào module M "reads" module N

> **Note (sách):** *"The error message at the beginning of this section stated that our v1ch12.requiremod module did not “read” the java.desktop module. In the parlance of the Java Platform Module System, module M reads module N in the following cases:"*
>
> *"1. M requires N."*
>
> *"2. M requires a module that transitively requires N (see Section 12.11)."*
>
> *"3. N is M or java.base."*
>
> **Dịch:** Thông báo lỗi ở đầu section nói rằng module `v1ch12.requiremod` **không "read"** module `java.desktop`. Theo cách nói của Java Platform Module System, **module M reads module N** trong các trường hợp sau:

| # | Trường hợp |
|---|---|
| 1 | **M `requires` N** |
| 2 | M require một module mà module đó **transitively requires N** (xem [[11 - Transitive and Static Requirements]]) |
| 3 | **N chính là M**, hoặc **N là `java.base`** |

---

## Bài kế tiếp

→ [[05 - Exporting Packages]] — keyword `exports`, giấu implementation trong module, và cách build ứng dụng nhiều module.
