# 09 — The Unnamed Module

> Chapter 9, Section 9.9 — Core Java Volume II: Advanced Features, 11th Edition (Horstmann), Java 11.
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 9.9 The Unnamed Module

### Định nghĩa

> *"Any class that is not on the module path is part of an unnamed module. Technically, there may be more than one unnamed module, but all of them together act as if they are a single module which is called the unnamed module. As with automatic modules, the unnamed module can access all other modules, and all of its packages are exported and opened."*

**Dịch:** **Mọi class không nằm trên module path** đều thuộc về một **unnamed module**. Về mặt kỹ thuật **có thể có nhiều hơn một unnamed module**, nhưng **tất cả chúng gộp lại hành xử như một module duy nhất** gọi là **the unnamed module**. Giống automatic module, unnamed module **truy cập được mọi module khác**, và **mọi package của nó đều được exported và opened**.

### Explicit module KHÔNG đọc được unnamed module

> *"However, no explicit module can access the unnamed module. (An explicit module is a module that is neither automatic nor unnamed—that is, a module with a module-info.class on the module path.) In other words, explicit modules are always free from the "class path hell.""*

**Dịch:** Tuy nhiên **không explicit module nào truy cập được unnamed module**. (**Explicit module** là module **không phải automatic cũng không phải unnamed** — tức module **có `module-info.class` trên module path**.) Nói cách khác, **explicit module luôn thoát khỏi "class path hell"**.

| Loại module | Có `module-info.class`? | Ở đâu | Đọc được unnamed module? |
|---|---|---|---|
| **explicit** | có | module path | **không** |
| **automatic** | không | module path | **có** |
| **unnamed** | — | không ở module path | — |

### Ví dụ: đặt nhầm lên class path

> *"Consider, for example, the program of the preceding section. Suppose you put commons-csv-1.5.jar onto the class path instead of the module path:"*

```bash
java --module-path v2ch09.automod \
  --class-path commons-csv-1.5.jar \
  -m v2ch09.automod/com.horstmann.places.CSVDemo
```

> *"Now the program won't start:"*

```
Error occurred during initialization of boot layer
java.lang.module.FindException: Module commons.csv not found, required by v2ch09.automod
```

**Dịch:** Xét chương trình ở phần trước. Nếu bạn đặt `commons-csv-1.5.jar` lên **class path thay vì module path**, chương trình **không khởi động được**: **không tìm thấy module `commons.csv`** mà `v2ch09.automod` require.

### Migration phải đi từ dưới lên

> *"Therefore, migration to the Java Platform Module System is necessarily a bottom-up process:"*
>
> 1. *"The Java platform itself is modularized."*
> 2. *"Next, libraries are modularized, either by using automatic modules or by turning them into explicit modules."*
> 3. *"Once all libraries used by your application are modularized, you can turn the code of your application into a module."*

**Dịch:** Do đó, việc chuyển sang Java Platform Module System **tất yếu là một quá trình từ dưới lên (bottom-up)**:

| # | Bước |
|---|---|
| 1 | **Bản thân nền tảng Java** được modular hoá |
| 2 | Kế đến là **các thư viện**, hoặc bằng **automatic module**, hoặc **biến chúng thành explicit module** |
| 3 | Khi **mọi thư viện mà ứng dụng dùng đã modular hoá**, bạn mới **biến code ứng dụng của mình thành module** |

> **Note (sách):** *"Automatic modules can read the unnamed module, so their dependencies can go onto the class path."*
>
> **Dịch:** **Automatic module đọc được unnamed module**, nên **các dependency của chúng đặt lên class path được**.

---

## Bài kế tiếp

→ [[10 - Command-Line Flags for Migration (Vol II)]] — `--illegal-access`, `--add-exports`, `--add-opens`, và file `@options`.
