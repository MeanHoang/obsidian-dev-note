# 04 — A Short History of Java

> Chapter 1, Section 1.4 — Core Java Volume I, 13th Edition (Horstmann).
> Câu chuyện: Java sinh ra để làm... **remote TV**, thất bại 3 năm liền, rồi vô tình gặp web đúng lúc — và đổi đời.

---

## 1991 — Dự án "Green": Java sinh ra KHÔNG phải cho web

> *"Java goes back to 1991, when a group of Sun engineers, led by Patrick Naughton and James Gosling (a Sun Fellow and an all-around computer wizard), wanted to design a small computer language that could be used for consumer devices like cable TV switchboxes. Since these devices do not have a lot of power or memory, the language had to be small and generate very tight code. Also, as different manufacturers may choose different central processing units (CPUs), it was important that the language not be tied to any single architecture. The project was code-named 'Green.'"*

**Dịch:** Java bắt đầu năm 1991 — nhóm kỹ sư Sun (dẫn đầu: Patrick Naughton và James Gosling) muốn thiết kế ngôn ngữ **nhỏ gọn** cho **thiết bị điện tử gia dụng** như hộp cáp TV. Thiết bị này **yếu, ít RAM** → ngôn ngữ phải nhỏ, code gọn. Và mỗi hãng dùng **CPU khác nhau** → ngôn ngữ **không được dính vào 1 kiến trúc**. Dự án mang mật danh **"Green"**.

> *"The requirements for small, tight, and platform-neutral code led the team to design a portable language that generated intermediate code for a virtual machine."*

**Dịch:** Chính yêu cầu **nhỏ + gọn + không phụ thuộc CPU** dẫn đến thiết kế: ngôn ngữ portable sinh **mã trung gian chạy trên virtual machine**.

⭐ **Điểm mấu chốt:** bytecode + JVM — thứ làm nên WORA — **không phải thiết kế cho web hay server**. Nó sinh ra vì... **cái TV box**: mỗi hãng TV 1 loại chip, không lẽ compile lại cho từng hãng? Sau này web có bài toán **y hệt** (mỗi user 1 loại máy) → Java "vô tình" có sẵn lời giải. May mắn của Java = giải đúng bài toán, nhầm khách hàng, rồi khách hàng đúng tự xuất hiện.

> *"The Sun people came from a UNIX background, so they based their language on C++ rather than Lisp, Smalltalk, or Pascal. But, as Gosling says in the interview, 'All along, the language was a tool, not the end.'"*

**Dịch:** Dân Sun gốc UNIX → chọn nền C++ (thay vì Lisp, Smalltalk, Pascal). Gosling: **"Ngôn ngữ luôn chỉ là công cụ, không phải đích đến."** (Nối bài 1.2.1: đây là lý do Java cố giống C++ hết mức — để dân C++ chuyển sang dễ.)

## Cái tên: Oak → Java

> *"Gosling decided to call his language 'Oak' (presumably because he liked the look of an oak tree that was right outside his window at Sun). The people at Sun later realized that Oak was the name of an existing computer language, so they changed the name to Java. This turned out to be an inspired choice."*

**Dịch:** Gosling đặt tên **"Oak"** (cây sồi) — có lẽ vì thích cây sồi **ngoài cửa sổ phòng làm việc**. Sau phát hiện tên Oak đã có ngôn ngữ khác dùng → đổi thành **"Java"** (tiếng lóng Mỹ = cà phê ☕). Hoá ra là **lựa chọn xuất thần** — tên ngắn, dễ nhớ, và cho ra logo tách cà phê kinh điển.

---

## 1992-1994 — Chuỗi thất bại ê chề

> *"In 1992, the Green project delivered its first product, called '*7.' It was an extremely intelligent remote control. Unfortunately, no one was interested in producing this at Sun."*

**Dịch:** 1992, nhóm Green ra sản phẩm đầu: **"\*7"** — chiếc **remote thông minh**. Không ai ở Sun muốn sản xuất.

> *"The group then bid on a project to design a cable TV box... They did not get the contract. (Amusingly, the company that did was led by the same Jim Clark who started Netscape—a company that did much to make Java successful.)"*

**Dịch:** Nhóm đấu thầu dự án hộp cáp TV (video-on-demand) → **trượt thầu**. Trớ trêu: công ty thắng thầu do **Jim Clark** lãnh đạo — người sau này sáng lập **Netscape**, chính công ty góp công lớn làm Java thành công. (Đánh bại bạn hôm nay, cứu bạn ngày mai 😄)

> *"The Green project (with a new name of 'First Person, Inc.') spent all of 1993 and half of 1994 looking for people to buy its technology. No one was found. (Patrick Naughton... claims to have accumulated 300,000 air miles in trying to sell the technology.) First Person was dissolved in 1994."*

**Dịch:** Đổi tên thành First Person Inc., **cả 1993 + nửa 1994 rao bán công nghệ — không ai mua**. Naughton bay **300.000 dặm** đi chào hàng vô vọng. 1994: công ty **giải thể**.

**Tóm cảnh này:** công nghệ về sau thống trị thế giới, từng **3 năm liền không bán nổi cho ai** — vì nhắm sai thị trường (TV box). Bài học: công nghệ tốt chưa đủ — phải **đúng bài toán, đúng thời điểm**.

---

## 1994-1995 — Gặp web: khoảnh khắc đổi đời

> *"While all of this was going on at Sun, the World Wide Web part of the Internet was growing bigger and bigger... In 1994, most people were using Mosaic... (Mosaic was partially written by Marc Andreessen as an undergraduate student on a work-study project, for $6.85 an hour.)"*

**Dịch:** Trong lúc đó, **web đang bùng nổ**. 1994 đa số dùng browser **Mosaic** — viết một phần bởi sinh viên **Marc Andreessen** với lương... **$6.85/giờ** (sau thành đồng sáng lập Netscape, giờ là quỹ đầu tư a16z).

> *"In the SunWorld interview, Gosling says that in mid-1994, the language developers realized that 'We could build a real cool browser. It was one of the few things in the client/server mainstream that needed some of the weird things we'd done: architecture-neutral, real-time, reliable, secure—issues that weren't terribly important in the workstation world. So we built a browser.'"*

**Dịch — khoảnh khắc "aha":** giữa 1994, nhóm nhận ra: *"Mình có thể xây 1 browser xịn. Browser là một trong số ít thứ mainstream **cần đúng những thứ kỳ quặc mình đã làm**: architecture-neutral, real-time, đáng tin, an toàn — những thứ chẳng ai cần ở thế giới workstation."*

⭐ Đây là câu **đắt nhất bài**: 4 "thứ kỳ quặc" làm cho TV box = chính xác 4 thứ web cần (mọi máy khác nhau → architecture-neutral; tải code lạ → secure...). Bài toán TV box và bài toán web **là một** — chỉ khác vỏ.

> *"The actual browser... evolved into the HotJava browser, which was designed to show off the power of Java. The browser was capable of executing Java code inside web pages. This 'proof of technology' was shown at SunWorld '95 on May 23, 1995, and inspired the Java craze that continues today."*

**Dịch:** Họ xây browser **HotJava** — chạy được Java code **trong trang web** (= applet, bài 03). Demo tại SunWorld **23/5/1995** → châm ngòi **cơn sốt Java** kéo dài đến nay.

---

## 1996-2006 — Trưởng thành: từ đồ chơi đến server

> *"Sun released the first version of Java in early 1996. People quickly realized that Java 1.0 was not going to cut it for serious application development... you couldn't even print in Java 1.0."*

**Dịch:** Java 1.0 (1996) **chưa xài thật được** — đến chức năng **in** còn không có. 1.1 vá những lỗ hổng lớn nhất.

> *"Three days (!) after its release in December 1998, Sun's marketing department changed the name to the catchy Java 2 Standard Edition Software Development Kit Version 1.2."*

**Dịch:** Java 1.2 (12/1998) nâng cấp lớn về GUI. **3 ngày (!) sau khi phát hành**, phòng marketing đổi tên thành "Java 2 Standard Edition SDK Version 1.2" — dấu (!) là Horstmann mỉa trò đặt tên loạn xạ của Sun. Từ đây có 3 editions:

| Edition | Cho | |
|---|---|---|
| **J2SE** (Standard) | Desktop, nền tảng chung | ← sách này học cái này |
| **J2ME** (Micro) | Điện thoại, thiết bị nhúng | (thời trước smartphone) |
| **J2EE** (Enterprise) | Server-side | (tiền thân hệ sinh thái enterprise) |

> *"During this time, much of the initial hype about Java applets and client-side applications abated, but Java became the platform of choice for server-side applications."*

**Dịch:** Thời 1.3-1.4, cơn sốt applet/client **xẹp dần**, nhưng Java trở thành **lựa chọn số 1 cho server-side**. ⭐ Đây là khúc quanh đã nhắc ở bài 03: nổi nhờ applet, **sống nhờ server** — và ở lại đó đến nay.

> *"Version 5.0 was the first release since version 1.1 that updated the Java language in significant ways... generic types (roughly comparable to C++ templates) have been added—the challenge was to add this feature without requiring changes in the virtual machine."*

**Dịch:** Java 5.0 (2004) — nâng cấp ngôn ngữ lớn đầu tiên sau nhiều năm: **generics** (kiểu `List<String>`), for-each, autoboxing, annotations (mấy thứ này học từ Chapter 8, 11). Chú ý câu "thêm generics mà **không được đổi JVM**" — đây chính là gốc của **type erasure** đã nhắc ở bài 01 (backward compatibility đẻ ra thiết kế gượng ép).

---

## 2009-nay — Thời Oracle: trầm rồi thăng

> *"Sun Microsystems fell on hard times and was purchased by Oracle in 2009. Development of Java stalled for a long time."*

**Dịch:** Sun sa sút, bị **Oracle mua năm 2009**. Java **đứng im** một thời gian dài (Java 7 năm 2011 chỉ là vá nhẹ).

> *"In 2014, the release of Java 8 followed, with the most significant changes to the Java language in almost two decades. Java 8 embraces a 'functional' style of programming that makes it easy to express computations that can be executed concurrently."*

**Dịch:** **Java 8 (2014)** — thay đổi lớn nhất trong **gần 2 thập kỷ**: lambda, streams — phong cách **functional** giúp diễn đạt tính toán chạy **concurrent** dễ dàng. (Nối bài concurrency: Moore's law hết → cần code đa core dễ viết → functional style. Java 8 đến nay vẫn là version huyền thoại, nhiều công ty dùng mãi.)

> 💡 **Với bạn:** lambda/stream của Java 8 chính là họ hàng của arrow function + `map/filter/reduce` bên JS — học Chapter 6 và Vol II Ch1 sẽ thấy quen thuộc.

> *"The main feature of Java 9 goes all the way back to 2008... introducing modules... It took eleven years to design and implement a module system."*

**Dịch:** Java 9 (2017) — **modules** (chia nhỏ platform khổng lồ), mất **11 năm** thiết kế. (Chapter 12.)

### Nhịp phát hành mới + LTS — quan trọng thực tế

> *"Starting in 2018, Java versions are released every six months... Ever so often, a version is designated by Oracle and other vendors to have long-term support (LTS), with bug fixes and security updates provided for several years. When using Java in production, it is common to stick to a LTS release and not use any preview features. So far, this has happened with Java 11, Java 17, and Java 21."*

**Dịch:** Từ 2018: ra version mới **mỗi 6 tháng** (trước đó: vài năm 1 bản). Định kỳ có bản **LTS (Long-Term Support)** — được vá lỗi + security **nhiều năm**. Production **chỉ nên dùng LTS**, tránh preview features. Các bản LTS: **11, 17, 21**.

```
Trước 2018:  1.0 ──1.2──── 5 ──── 8 ────── 9     (vài năm 1 bản, dồn cục)
Sau 2018:    10,11,12,13,...,21,22,...           (đều 6 tháng 1 bản)
                 ↑        ↑     ↑
                LTS      LTS   LTS  ← production dùng mấy bản này
```

> 💡 **Giống hệt Node.js của bạn:** Node cũng ra bản đều + bản LTS chẵn (18, 20, 22) — Cloud Run của bạn chạy Node LTS đúng không? Java y chang: đi làm gặp toàn 8/11/17/21, không ai xài bản lẻ.

---

## Bảng tiến hoá (Table 1.1 trong sách — rút gọn các mốc chính)

| Version | Năm | Tính năng mới đáng nhớ | Số class/interface |
|---|---|---|---|
| 1.0 | 1996 | Bản thân ngôn ngữ | 211 |
| 1.1 | 1997 | Inner classes | 477 |
| 1.2 | 1998 | "Java 2", GUI mới | 1.524 |
| **5.0** | 2004 | **Generics**, for-each, autoboxing, annotations | 3.279 |
| **8** | 2014 | **Lambda, streams**, default methods | 4.240 |
| **9** | 2017 | **Modules** | 6.005 |
| **11** (LTS) | 2018 | `var`, HTTP client | 4.410 |
| **17** (LTS) | 2021 | Records, sealed classes, pattern matching | 4.859 |
| **21** (LTS) | 2023 | **Virtual threads**, pattern matching hoàn thiện | 4.882 |

(Sách 13th edition dạy theo **Java 21** — bản LTS mới nhất, có virtual threads sẽ học ở Chapter 10.)

---

## Tóm tắt section 1.4 — cả câu chuyện trong 5 dòng

```
1991  Green project — ngôn ngữ cho TV box → bytecode + JVM ra đời (vì mỗi hãng 1 CPU)
1992-94  Thất bại toàn tập: remote *7 ế, trượt thầu, không ai mua, giải thể
1994-95  Nhận ra web cần đúng "những thứ kỳ quặc" mình có → HotJava → cơn sốt applet
1996-2006  Applet xẹp → Java rút về server và thống trị; Java 5 thêm generics
2009-nay  Oracle mua; Java 8 (lambda) hồi sinh; 6 tháng/bản; production bám LTS 11→17→21
```

---

## Bài kế tiếp

→ [[05 - Common Misconceptions about Java]] — bài cuối chương 1: 10 hiểu lầm phổ biến về Java (trong đó có màn "JavaScript không liên quan gì Java" chính thức).
