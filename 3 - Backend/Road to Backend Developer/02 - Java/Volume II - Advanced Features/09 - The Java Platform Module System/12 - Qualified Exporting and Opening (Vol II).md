# 12 — Qualified Exporting and Opening

> Chapter 9, Section 9.12 — Core Java Volume II: Advanced Features, 11th Edition (Horstmann), Java 11.
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 9.12 Qualified Exporting and Opening

### Qualified export

> *"In this section, you will see a variant of the exports and opens statement that narrows their scope to a specified set of modules. For example, the javafx.base module contains a statement"*

```java
exports com.sun.javafx.collections to
    javafx.controls, javafx.graphics, javafx.fxml, javafx.swing;
```

> *"Such a statement is called a qualified export. The listed modules can access the package, but other modules cannot."*

**Dịch:** Phần này giới thiệu **biến thể của `exports` và `opens`** giúp **thu hẹp phạm vi của chúng về một tập module được chỉ định**. Ví dụ module `javafx.base` có một statement như trên. Statement như vậy gọi là **qualified export**: **các module được liệt kê thì truy cập được package**, còn **module khác thì không**.

### Khi nào qualified export xuất hiện

> *"Excessive use of qualified exports can indicate a poor modular structure. Nevertheless, they can arise when modularizing an existing code base. Here, the Java platform designers distributed the code for JavaFX into multiple modules, which is a good idea because not all JavaFX applications need FXML or Swing interoperability. However, the JavaFX implementors liberally used internal classes such as com.sun.javafx.collections.ListListenerHelper in their code. In a greenfield project, one can instead design a more robust public API."*

**Dịch:** **Dùng qualified export quá nhiều có thể là dấu hiệu của cấu trúc modular kém**. Dù vậy chúng **hay phát sinh khi modular hoá một code base có sẵn**. Ở đây, những người thiết kế nền tảng Java **chia code của JavaFX ra nhiều module** — một ý hay vì **không phải ứng dụng JavaFX nào cũng cần FXML hay khả năng tương tác với Swing**. Nhưng những người implement JavaFX lại **dùng thoải mái các internal class** như `com.sun.javafx.collections.ListListenerHelper` trong code của họ. **Với một project làm mới từ đầu (greenfield), ta thiết kế được một public API vững chắc hơn.**

### Qualified opens

> *"Similarly, you can restrict the opens statement to specific modules. For example, in Section 9.7, "Modules and Reflective Access," on p. 511 we could have used a qualified opens statement, like this:"*

```java
module v2ch09.openpkg
{
    requires com.horstmann.util;
    opens com.horstmann.places to com.horstmann.util;
}
```

> *"Now the com.horstmann.places package is only opened to the com.horstmann.util module."*

**Dịch:** Tương tự, bạn **giới hạn được `opens` về những module cụ thể**. Ví dụ ở [[07 - Modules and Reflective Access (Vol II)]], ta đã có thể dùng một **qualified opens**. Khi đó package `com.horstmann.places` **chỉ được open cho module `com.horstmann.util`**.

| Statement | Phạm vi |
|---|---|
| `exports p` | mọi module |
| `exports p to M1, M2` | **chỉ M1, M2** (qualified export) |
| `opens p` | mọi module (reflective access) |
| `opens p to M1` | **chỉ M1** (qualified opens) |

---

## Bài kế tiếp

→ [[13 - Service Loading (Vol II)]] — `provides ... with`, `uses`, và `ServiceLoader` trong thế giới module.
