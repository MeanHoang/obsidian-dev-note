# 12 — Qualified Exporting and Opening

> Chapter 12, Section 12.12 — Core Java Volume I, 13th Edition (Horstmann).
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 12.12. Qualified Exporting and Opening

> *"In this section, you will see a variant of the exports and opens statement that narrows their scope to a specified set of modules. For example, the java.base module contains a statement"*

```java
exports sun.net to
    java.net.http,
    jdk.naming.dns;
```

> *"Such a statement is called a qualified export. The listed modules can access the exported package, but other modules cannot."*

**Dịch:** Trong section này bạn sẽ thấy một **biến thể của statement `exports` và `opens`** giúp **thu hẹp phạm vi của chúng về một tập module được chỉ định**. Ví dụ, module `java.base` có một statement như trên. Statement kiểu này gọi là **qualified export**. **Chỉ các module được liệt kê mới truy cập được package đã export**, các module khác **thì không**. → Xem [[05 - Exporting Packages]].

### Vì sao có qualified export

> *"Excessive use of qualified exports can indicate a poor modular structure. Nevertheless, they can arise when modularizing an existing code base. Here, the sun.net package is placed inside the java.base module because that is where it is mostly needed. However, a couple of other modules also use that package. The Java platform designers didn't want to make java.base even bigger, and they didn't want to make the internal sun.net package generally available. In a greenfield project, one can instead design a more modular API."*

**Dịch:** **Lạm dụng qualified export có thể là dấu hiệu của cấu trúc module tồi**. Dù vậy, chúng **vẫn nảy sinh khi modular hoá một code base có sẵn**. Ở đây, package `sun.net` được đặt trong module `java.base` vì **đó là nơi nó được cần đến nhiều nhất**. Nhưng **vài module khác cũng dùng package đó**. Những người thiết kế Java platform **không muốn làm `java.base` phình to thêm**, và cũng **không muốn phơi bày package internal `sun.net` ra cho mọi người**. Với một **greenfield project**, người ta có thể thay vào đó **thiết kế một API modular hơn**.

### Qualified opens

> *"Similarly, you can restrict the opens statement to specific modules. For example, in Section 12.7 we could have used a qualified opens statement, like this:"*

```java
module v1ch12.openpkg
{
    requires com.horstmann.util;
    opens com.horstmann.places to com.horstmann.util;
}
```

> *"Now the com.horstmann.places package is only opened to the com.horstmann.util module."*

**Dịch:** Tương tự, bạn có thể **giới hạn statement `opens` về những module cụ thể**. Ví dụ, ở Section 12.7 ta đã có thể dùng một **qualified `opens`** như trên. Khi đó package `com.horstmann.places` **chỉ được opened cho module `com.horstmann.util`**. → Xem [[07 - Modules and Reflective Access]].

| Statement | Phạm vi |
|---|---|
| `exports P;` | Mở package `P` cho **mọi module** |
| `exports P to M1, M2;` | **Qualified export** — chỉ `M1`, `M2` truy cập được `P` |
| `opens P;` | Cho **mọi module** reflective access vào `P` |
| `opens P to M;` | **Qualified opens** — chỉ `M` được reflective access vào `P` |

---

## Bài kế tiếp

→ [[13 - Service Loading]] — statement `provides` và `uses` giúp `ServiceLoader` khớp service interface với implementation.
