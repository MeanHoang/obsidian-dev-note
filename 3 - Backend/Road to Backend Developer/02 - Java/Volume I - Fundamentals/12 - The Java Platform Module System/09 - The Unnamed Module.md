# 09 — The Unnamed Module

> Chapter 12, Section 12.9 — Core Java Volume I, 13th Edition (Horstmann).
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 12.9. The Unnamed Module

> *"Any class that is not on the module path is part of an unnamed module. Technically, there may be more than one unnamed module, but all of them together act as if they are a single module which is called the unnamed module. As with automatic modules, the unnamed module can access all other modules, and all of its packages are exported and opened."*

**Dịch:** **Mọi class không nằm trên module path đều thuộc về unnamed module.** Về mặt kỹ thuật **có thể có nhiều hơn một unnamed module**, nhưng tất cả chúng gộp lại **hành xử như một module duy nhất**, gọi là **unnamed module**. Giống như [[08 - Automatic Modules|automatic module]], unnamed module **truy cập được mọi module khác**, và **toàn bộ package của nó được export và opened**.

> *"However, no explicit module can access the unnamed module. (An explicit module is a module that is neither automatic nor unnamed—that is, a module with a module-info.class on the module path.) In other words, explicit modules are always free from the “class path hell.”"*

**Dịch:** Tuy nhiên, **không explicit module nào truy cập được unnamed module**. (**Explicit module** là module **không phải automatic cũng không phải unnamed** — tức là module **có `module-info.class` nằm trên module path**.) Nói cách khác, explicit module **luôn thoát khỏi "class path hell"**. → Xem [[01 - The Module Concept]].

| Loại module | Đọc được module khác? | Package được export/opened? | Bị explicit module đọc? |
|---|---|---|---|
| **Automatic module** | Có (mọi module) | Toàn bộ | Có |
| **Unnamed module** | Có (mọi module) | Toàn bộ | **Không** |
| **Explicit module** | Chỉ những gì `requires` | Chỉ những gì `exports`/`opens` | Có |

### Ví dụ: đặt JAR lên class path thì hỏng

> *"Consider, for example, the program of the preceding section. Suppose you put commons-csv-1.9.0.jar onto the class path instead of the module path:"*

```bash
java --module-path v1ch12.automod \
  --class-path commons-csv-1.10.0.jar \
  -m v1ch12.automod/com.horstmann.places.CSVDemo
```

> *"Now the program won't start:"*

```
Error occurred during initialization of boot layer
java.lang.module.FindException: Module commons.csv not found, required by v1ch12.automod
```

**Dịch:** Hãy xét chương trình ở section trước. Giả sử bạn đặt `commons-csv-1.9.0.jar` lên **class path thay vì module path**. Khi đó chương trình **không khởi động được**.

### Migration là quá trình bottom-up

> *"Therefore, migration to the Java Platform Module System is necessarily a bottom-up process:"*

> *"1. The Java platform itself is modularized.
> 2. Next, libraries are modularized, either by using automatic modules or by turning them into explicit modules.
> 3. Once all libraries used by your application are modularized, you can turn the code of your application into a module."*

**Dịch:** Do đó, migration sang Java Platform Module System **nhất thiết phải là quá trình bottom-up**:

| # | Bước |
|---|---|
| 1 | **Bản thân Java platform** được modular hoá |
| 2 | Tiếp theo, **các thư viện** được modular hoá — bằng automatic module, hoặc bằng cách biến chúng thành **explicit module** |
| 3 | Khi mọi thư viện mà application dùng đã modular hoá, bạn **mới biến code application của mình thành module** |

```
Java platform  →  libraries  →  application của bạn
   (dưới cùng)                        (trên cùng)
```

> **Note (sách):** *"Automatic modules can read the unnamed module, so their dependencies can go onto the class path."*
>
> **Dịch:** **Automatic module đọc được unnamed module**, nên **dependency của chúng có thể nằm trên class path**.

---

## Bài kế tiếp

→ [[10 - Command-Line Flags for Migration]] — các flag `--illegal-access`, `--add-exports`, `--add-opens` để chạy ứng dụng legacy trên Java hiện đại.
