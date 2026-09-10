# 11 — Transitive and Static Requirements

> Chapter 9, Section 9.11 — Core Java Volume II: Advanced Features, 11th Edition (Horstmann), Java 11.
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 9.11 Transitive and Static Requirements

> *"In Section 9.4, "Requiring Modules," on p. 504, you have seen the basic form of the requires statement. In this section, you will see two variants that are occasionally useful."*

**Dịch:** Ở [[04 - Requiring Modules (Vol II)]] bạn đã thấy **dạng cơ bản của `requires`**. Phần này giới thiệu **hai biến thể thỉnh thoảng hữu ích**.

### `requires transitive`

> *"In some situation, it can be tedious for a user of a given module to declare all required modules. Consider, for example, the javafx.controls module that contains JavaFX user interface elements such as buttons. The javafx.controls requires the javafx.base module, and everyone using javafx.controls will also need javafx.base. (You can't do much with a user interface control such as a Button if you don't have packages from the javafx.base module available.) For that reason, the javafx.controls module declares the requirement with the transitive modifier:"*

```java
module javafx.controls
{
    requires transitive javafx.base;
    . . .
}
```

> *"Any module that declares a requirement on javafx.controls now automatically requires javafx.base."*

**Dịch:** Trong một số tình huống, **việc người dùng module phải khai báo hết mọi module cần thiết là nhọc nhằn**. Ví dụ module `javafx.controls` chứa các thành phần giao diện JavaFX như button. `javafx.controls` **requires `javafx.base`**, và **ai dùng `javafx.controls` thì cũng sẽ cần `javafx.base`** (làm được gì nhiều với một control như `Button` nếu **không có sẵn package từ `javafx.base`**?). Vì vậy `javafx.controls` **khai báo yêu cầu đó với modifier `transitive`**. Từ đó, **mọi module khai báo requires `javafx.controls` sẽ tự động requires `javafx.base`**.

> **Note (sách):** *"Some programmers recommend that you should always use requires transitive when a package from another module is used in the public API. But that is not a rule of the Java language. Consider, for example, the java.sql module:"*
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
> **Dịch:** Một số lập trình viên khuyên **luôn dùng `requires transitive` khi một package từ module khác được dùng trong public API**. Nhưng **đó không phải quy tắc của ngôn ngữ Java**. Xét module `java.sql`: trong **toàn bộ API của `java.sql`** chỉ có **đúng một chỗ** dùng package từ module `java.logging`, đó là method `java.sql.Driver.parentLogger` trả về `java.util.logging.Logger`. **Hoàn toàn chấp nhận được nếu không khai báo yêu cầu này là transitive** — khi đó **chỉ những module thực sự dùng method đó** mới phải khai báo requires `java.logging`.

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

**Dịch:** Một ứng dụng thuyết phục của `requires transitive` là **aggregator module** — **module không có package nào và chỉ có các transitive requirement**. Một module như vậy là **`java.se`**. Lập trình viên **không quan tâm tới dependency chi tiết** chỉ cần **require `java.se`** là **có toàn bộ module của nền tảng Java SE**.

### `requires static`

> *"Finally, there is an uncommon requires static variant that declares that a module must be present at compile time but is optional at runtime. There are two use cases:"*
>
> 1. *"To access an annotation that is processed at compile time and declared in a different module."*
> 2. *"To use a class in a different module if it is available, and otherwise do something else, such as:"*
>
> ```java
> try
> {
>     new oracle.jdbc.driver.OracleDriver();
>     . . .
> }
> catch (NoClassDefFoundError er)
> {
>     Do something else
> }
> ```

**Dịch:** Cuối cùng, có một biến thể **ít gặp là `requires static`**, khai báo rằng module đó **phải có mặt lúc compile time nhưng là tuỳ chọn lúc runtime**. Có **hai trường hợp dùng**:

| # | Trường hợp |
|---|---|
| 1 | Truy cập một **annotation được xử lý lúc compile time** và **được khai báo ở module khác** |
| 2 | **Dùng một class ở module khác nếu nó có sẵn**, còn không thì **làm việc khác** (bắt `NoClassDefFoundError`) |

| Biến thể | Ý nghĩa |
|---|---|
| `requires M` | Module này **read** M |
| `requires transitive M` | Mọi module require module này **cũng tự động require M** |
| `requires static M` | M **phải có lúc compile time**, **tuỳ chọn lúc runtime** |

---

## Bài kế tiếp

→ [[12 - Qualified Exporting and Opening (Vol II)]] — `exports ... to` và `opens ... to`.
