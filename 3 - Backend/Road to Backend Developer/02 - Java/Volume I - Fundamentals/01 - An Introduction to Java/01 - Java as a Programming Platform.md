# 01 — Java as a Programming Platform

> Chapter 1, Section 1.1 — Core Java Volume I (Horstmann).
> Câu hỏi trung tâm: **Java chỉ là 1 ngôn ngữ lập trình, hay còn hơn thế?**

---

## Sách nói gì?

### Java như một ngôn ngữ — "tốt, nhưng không hoàn hảo"

> *"As a computer language, Java's hype is overdone: Java is certainly a good programming language. There is no doubt that it is one of the better languages available to serious programmers. We think it could potentially have been a great programming language, but it is probably too late for that. Once a language is out in the field, the ugly reality of compatibility with existing code sets in."*

**Dịch:** Java bị thổi phồng quá. Nó là ngôn ngữ **tốt**, thuộc nhóm tốt nhất cho dân chuyên nghiệp. Nhưng lẽ ra nó có thể **tuyệt vời** — nếu không bị ràng buộc bởi backward compatibility (tương thích ngược với code cũ).

**Ví dụ đời sống:** Giống như 1 con đường xây từ 30 năm trước. Bây giờ biết thiết kế sai, nhưng **không thể đập đi xây lại** vì hàng triệu nhà đã xây dọc đường đó. Chỉ có thể vá víu, mở rộng — chứ không làm lại từ đầu.

**Ví dụ thực tế trong Java:**
- `checked exceptions` — nhiều developer ghét, nhưng bỏ = break mọi code có `throws`
- `null` ở khắp nơi — gây `NullPointerException` triền miên, nhưng không bỏ được
- Generics dùng **type erasure** — thiết kế tệ nhưng phải giữ để code Java 4 vẫn chạy

> 💡 **So sánh JS:** `typeof null === "object"` là bug từ 1995, ai cũng biết sai nhưng không sửa được — cùng lý do: backward compatibility.

---

### Java không chỉ là ngôn ngữ — nó là Platform

> *"Java was never just a language. There are lots of programming languages out there, but few of them make much of a splash. Java is a whole platform, with a huge library, containing lots of reusable code, and an execution environment that provides services such as security, portability across operating systems, and automatic garbage collection."*

**Dịch:** Java **chưa bao giờ chỉ là ngôn ngữ**. Có rất nhiều ngôn ngữ ngoài kia, nhưng ít cái nào tạo được ảnh hưởng lớn. Java là **cả một platform**: thư viện khổng lồ chứa code tái dùng, cùng môi trường thực thi cung cấp bảo mật, chạy đa nền tảng, và tự động dọn bộ nhớ.

**Ví dụ đời sống:**
- **Ngôn ngữ** = công thức nấu ăn (recipe) — hướng dẫn nấu món gì, bước nào trước sau.
- **Platform** = cả **căn bếp** — bếp gas, lò nướng, tủ lạnh, dao, thớt, nguyên liệu sẵn, và đội ngũ phụ bếp. 

Biết công thức (ngôn ngữ) mà không có căn bếp (platform) thì **nấu không được**.

**Áp vào Java:**

```
┌─────────────────────────────────┐
│            JDK                  │
│  ┌───────────────────────────┐  │
│  │          JRE              │  │
│  │  ┌─────────────────────┐  │  │
│  │  │        JVM          │  │  │
│  │  │  (chạy bytecode)    │  │  │
│  │  └─────────────────────┘  │  │
│  │  + Standard Library       │  │
│  └───────────────────────────┘  │
│  + javac (compiler)             │
│  + jdb (debugger)               │
│  + jar, javadoc, jshell...      │
└─────────────────────────────────┘
```

| Thành phần | Vai trò | So sánh với JS |
|---|---|---|
| **Java Language** | Cú pháp, cách viết code | Bản thân ngôn ngữ JS |
| **JVM** (Java Virtual Machine) | Máy ảo chạy bytecode — **trái tim** | Giống V8 engine |
| **JRE** (Java Runtime Environment) | JVM + thư viện chuẩn để **chạy** app | Giống Node.js runtime |
| **JDK** (Java Development Kit) | JRE + compiler + dev tools để **phát triển** | Giống Node.js + npm + dev tools |
| **Standard Library** | ~4000 class sẵn: Collections, I/O, Networking, Concurrency... | Giống built-in modules của Node |

---

### Tại sao Java thắng? — Tổ hợp 3 thứ

> *"As a programmer, you will want a language with a pleasant syntax and comprehensible semantics (i.e., not C++). Java fits the bill, as do dozens of other fine languages. Some languages give you portability, garbage collection, and the like, but they don't have much of a library, forcing you to roll your own if you want fancy graphics or networking or database access. Well, Java has everything—a good language, a high-quality execution environment, and a vast library. That combination is what makes Java an irresistible proposition to so many programmers."*

**Dịch:** Lập trình viên muốn ngôn ngữ có cú pháp dễ chịu, ngữ nghĩa dễ hiểu (tức **không phải C++**). Java đáp ứng được, nhưng hàng chục ngôn ngữ khác cũng vậy. Một số ngôn ngữ cho bạn portability, GC, nhưng **không có thư viện** — bạn phải tự viết nếu muốn đồ hoạ, networking, database. Java thì **có tất cả**: ngôn ngữ tốt + môi trường chạy chất lượng cao + thư viện khổng lồ. **Tổ hợp đó** mới là thứ khiến Java hấp dẫn.

**Tóm lại — 3 chân kiềng:**

```
        Ngôn ngữ tốt
        (cú pháp rõ ràng, OOP bài bản)
              │
    ┌─────────┴─────────┐
    │                   │
Execution Env       Vast Library
(JVM: portable,     (~4000 class:
 GC, security,      Collections, I/O,
 JIT)               Networking, JDBC...)
```

Nhiều ngôn ngữ có 1 hoặc 2 chân → Java có cả 3 → **platform hoàn chỉnh**.

> 💡 **So sánh JS:** JS cũng có tổ hợp tương tự: ngôn ngữ (JS) + runtime (V8/Node) + thư viện (npm). Nhưng npm là **cộng đồng**, còn Java Standard Library là **built-in chính thức** — ổn định, chuẩn hoá, không phụ thuộc package bên thứ 3.

---

### "Vast Library" — thư viện khổng lồ gồm những gì?

Cần phân biệt **2 loại thư viện** trong hệ sinh thái Java:
#### Standard Library — do Sun/Oracle xây, đi kèm JDK

Cài JDK là có luôn, **không cần download thêm**:

```java
import java.util.ArrayList;    // Collections
import java.io.FileReader;     // Đọc file
import java.net.HttpClient;    // HTTP
import java.sql.Connection;    // Database
```

Khoảng **~4000 class** — cover gần hết nhu cầu cơ bản: collections, I/O, networking, concurrency, database, security...

> 💡 **So sánh JS:** Node.js built-in modules (`fs`, `http`, `path`...) chỉ có vài chục — rất ít so với Java. Nên JS phải **phụ thuộc npm** cho gần như mọi thứ.

#### Ecosystem — do cộng đồng/công ty xây

Thư viện bên thứ 3, cài qua Maven/Gradle (giống npm):
- **Spring** — framework web (Pivotal/VMware)
- **Hibernate** — ORM database (Red Hat)
- **Apache Kafka** — message queue (LinkedIn → Apache)
- **Hadoop/Spark** — big data (Yahoo → Apache)

#### Tại sao Java có nhiều thư viện?

Lâu đời (1995) + nhiều người dùng → **vòng lặp tự tăng trưởng**:

```
1995: Java ra đời
  → Sun xây Standard Library lớn ngay từ đầu
  → Doanh nghiệp lớn adopt (banking, telco, enterprise)
  → Họ xây thư viện → open source → cộng đồng dùng
  → Càng nhiều thư viện → càng nhiều người dùng
  → Càng nhiều người dùng → càng nhiều thư viện
  → Vòng lặp 30 năm
```

Nhưng điểm khác biệt mà Horstmann nhấn mạnh: Java **không chỉ thắng nhờ cộng đồng** — mà vì **Standard Library đã rất đầy đủ sẵn**. Nhiều ngôn ngữ khác cũng lâu đời, cũng có cộng đồng, nhưng thư viện chuẩn ít → phải phụ thuộc bên thứ 3 → kém ổn định hơn.

---

### Editor bị sếp Sun "mắng" vì đoạn đầu

> *"Our editor got a lot of flack for this paragraph from someone very high up at Sun Microsystems, the company that originally developed Java."*

Horstmann kể: đoạn "Java's hype is overdone" ở trên khiến editor của sách bị **sếp lớn tại Sun Microsystems** (công ty tạo ra Java) phàn nàn. Nhưng tác giả vẫn giữ nguyên — vì đó là sự thật: **Java mạnh nhờ platform, không phải nhờ ngôn ngữ hoàn hảo**.

---

## Tóm tắt section 1.1

> **Java không chỉ là ngôn ngữ — nó là platform.** Ngôn ngữ Java tốt nhưng không hoàn hảo (backward compatibility). Thứ khiến Java mạnh là **tổ hợp 3 thứ**: ngôn ngữ tốt + JVM (portable, GC, security) + thư viện khổng lồ. Ít ngôn ngữ nào có cả 3.

---

## Bài kế tiếp

→ [[02 - The Java White Paper Buzzwords]] — 11 đặc tính thiết kế ("lời hứa") của Java: Simple, Object-Oriented, Distributed, Robust, Secure, Architecture-Neutral, Portable, Interpreted, High-Performance, Multithreaded, Dynamic.
