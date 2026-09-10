# 11 — Transitive and Static Requirements

> Chapter 12, Section 12.11 — Core Java Volume I, 13th Edition (Horstmann).
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 12.11. Transitive and Static Requirements

> *"In Section 12.4, you have seen the basic form of the requires statement. In this section, you will see two variants that are occasionally useful."*

**Dịch:** Ở Section 12.4 bạn đã thấy **dạng cơ bản của statement `requires`**. Trong section này bạn sẽ thấy **hai biến thể** thỉnh thoảng có ích. → Xem [[04 - Requiring Modules]].

### `requires transitive`

> *"In some situations, it can be tedious for a user of a given module to declare all required modules. Consider, for example, the java.desktop module. It requires three modules: java.prefs, java.datatransfer and java.xml. The java.prefs module is only used internally. However, classes from java.datatransfer and java.xml appear in the public API, in methods such as"*

```java
java.awt.datatransfer.Clipboard java.awt.Toolkit.getSystemClipboard()
java.beans.XMLDecoder(org.xml.sax.InputSource is)
```

**Dịch:** Trong một số tình huống, việc người dùng một module phải **khai báo tất cả module cần thiết** là **rất phiền**. Hãy xét module `java.desktop`: nó require **ba module** — `java.prefs`, `java.datatransfer` và `java.xml`. Module `java.prefs` **chỉ dùng nội bộ**. Nhưng class từ `java.datatransfer` và `java.xml` **xuất hiện trong public API**, ở những method như trên.

> *"That is not something that a user of the java.desktop module should have to think about. For that reason, the java.desktop module declares the requirement with the transitive modifier:"*

```java
module java.desktop
{
    requires java.prefs;
    requires transitive java.datatransfer;
    requires transitive java.xml;
    . . .
}
```

> *"Any module that declares a requirement on java.desktop now automatically requires these two modules."*

**Dịch:** Đó **không phải thứ mà người dùng module `java.desktop` phải bận tâm**. Vì vậy, module `java.desktop` **khai báo requirement kèm modifier `transitive`**. Bây giờ **bất kỳ module nào khai báo require `java.desktop` đều tự động require hai module kia**.

```
module của bạn
   │ requires
   ▼
java.desktop ──requires transitive──► java.datatransfer   (bạn cũng có)
   │         └─requires transitive──► java.xml            (bạn cũng có)
   └─requires──────────────────────► java.prefs           (chỉ nội bộ)
```

> **Note (sách):** *"Some programmers recommend that you should always use requires transitive when a package from another module is used in the public API. But that is not a requirement of the Java language. Consider, for example, the java.sql module:"*
>
> ```java
> module java.sql
> {
>     requires transitive java.logging;
>     . . .
> }
> ```
>
> *"There is a single use of a package from the java.logging module in the entire java.sql API, namely the java.sql.Driver.parentLogger method that returns a java.util.logging.Logger. It would have been perfectly acceptable to not declare this module requirement as transitive. Then, those modules—and only those—who actually use that method would need to declare that they require java.logging."*
>
> **Dịch:** Một số lập trình viên khuyên **luôn dùng `requires transitive` khi một package từ module khác được dùng trong public API**. Nhưng đó **không phải yêu cầu của ngôn ngữ Java**. Ví dụ module `java.sql`: trong **toàn bộ API của `java.sql` chỉ có duy nhất một chỗ** dùng package từ module `java.logging`, đó là method `java.sql.Driver.parentLogger` trả về một `java.util.logging.Logger`. Việc **không khai báo requirement này là transitive cũng hoàn toàn chấp nhận được** — khi đó **chỉ những module thực sự dùng method đó** mới cần khai báo là chúng require `java.logging`.

### Aggregator module

> *"One compelling use of the requires transitive statement is an aggregator module—a module with no packages and only transitive requirements. One such module is the java.se module, declared like this:"*

```java
module java.se
{
    requires transitive java.compiler;
    requires transitive java.datatransfer;
    requires transitive java.desktop;
    . . .
    requires transitive java.sql;
    requires transitive java.sql.rowset;
    requires transitive java.xml;
    requires transitive java.xml.crypto;
}
```

> *"A programmer who isn't interested in fine-grained module dependencies can simply require java.se and get all modules of the Java SE platform."*

**Dịch:** Một ứng dụng thuyết phục của statement `requires transitive` là **aggregator module** — **module không có package nào, chỉ toàn transitive requirement**. Một module như vậy là `java.se`. Lập trình viên **không quan tâm tới dependency chi tiết** chỉ cần **require `java.se`** là **có toàn bộ module của Java SE platform**.

### `requires static`

> *"Finally, there is an uncommon requires static variant that declares that a module must be present at compile time but is optional at runtime. There are two use cases:"*

**Dịch:** Cuối cùng, có một biến thể **ít gặp là `requires static`**, khai báo rằng một module **phải có mặt lúc compile time nhưng là tuỳ chọn lúc runtime**. Có **hai trường hợp sử dụng**:

> *"1. To access an annotation that is processed at compile time and declared in a different module.
> 2. To use a class in a different module if it is available, and otherwise do something else, such as:"*

```java
try
{
    new oracle.jdbc.driver.OracleDriver();
    . . .
}
catch (NoClassDefFoundError er)
{
    Do something else
}
```

| # | Use case của `requires static` |
|---|---|
| 1 | Truy cập một **annotation được xử lý lúc compile time** và **khai báo ở module khác** — xem [[01 - Using Annotations]] |
| 2 | **Dùng một class ở module khác nếu class đó có sẵn**, còn không thì **làm việc khác** (bắt `NoClassDefFoundError`) |

---

## Bài kế tiếp

→ [[12 - Qualified Exporting and Opening]] — biến thể của `exports` và `opens` thu hẹp phạm vi về một tập module cụ thể.
