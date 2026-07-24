# 03 — Using an Integrated Development Environment

> Chapter 2, Section 2.3 — Core Java Volume I, 13th Edition (Horstmann).
> Xong "cách khổ" (terminal) → giờ lắp **IDE** cho công việc hằng ngày.

---

## Khi nào terminal, khi nào IDE?

> *"In the preceding section, you saw how to compile and run a Java program from the command line. That is a useful skill for troubleshooting, but for most day-to-day work, you should use an integrated development environment. These environments are so powerful and convenient that it simply doesn't make much sense to labor on without them."*

**Dịch:** Compile/run bằng terminal là kỹ năng hữu ích để **troubleshoot** — nhưng việc hằng ngày nên dùng IDE. IDE mạnh và tiện đến mức **không có lý do gì tự hành xác** mà không dùng.

Phân vai rõ ràng:
- **Terminal (bài 02):** hiểu bản chất, kiểm tra cài đặt, sửa sự cố
- **IDE (bài này):** làm việc thật — vì nút Run của nó chính là `javac` + `java` đóng gói, giờ bạn đã biết bên trong là gì

## Chọn IDE nào?

> *"Excellent choices are the freely available Eclipse, IntelliJ IDEA, and NetBeans. In this chapter, you will learn how to get started with Eclipse. Of course, if you prefer a different development environment, you can certainly use it with this book."*

**Dịch:** 3 lựa chọn tốt đều miễn phí: **Eclipse, IntelliJ IDEA, NetBeans**. Sách demo bằng **Eclipse** — nhưng dùng cái khác cũng được.

| IDE | Ghi chú thực tế (ngoài sách) |
|---|---|
| **IntelliJ IDEA** | Thực tế ngành **đã nghiêng hẳn về đây** (Community Edition free). Cùng hãng JetBrains làm ra WebStorm — nếu bạn quen VS Code/WebStorm sẽ thấy thân thuộc |
| **Eclipse** | Sách dùng — miễn phí, lâu đời, vẫn phổ biến ở doanh nghiệp/dự án cũ |
| **VS Code + Extension Pack for Java** | Không có trong sách — nhưng là đường **ít ma sát nhất cho bạn**: giữ nguyên editor đang dùng hằng ngày |

> 💡 Học theo sách thì cài Eclipse cũng được, nhưng lời khuyên thực dụng: **IntelliJ Community** — đi làm Java gần như chắc chắn gặp nó.

## Các bước tạo project với Eclipse (theo sách)

Tải từ [eclipse.org/downloads](https://eclipse.org/downloads) → bản **"Eclipse IDE for Java Developers"**. Rồi:

1. **File → New → Project** → chọn **Java Project**
2. Next → bỏ check "Use default location" → Browse tới `corejava/v1ch02/Welcome` (mở code có sẵn thành project)
3. **Finish** — project được tạo
4. Mở cây thư mục bên trái → double-click `Welcome.java` → thấy code
5. Chuột phải tên project → **Run As → Java Application** → output hiện ở **console pane**

(Quy trình IntelliJ/VS Code tương đương: Open Folder → mở file → bấm nút ▶️.)

## Sức mạnh thật của IDE — bắt lỗi NGAY KHI GÕ

Sách bảo thử **cố tình phá code**:

> *"Try it out—ruin your file, for example, by changing the capitalization of String as follows: `string greeting = "Welcome to Core Java!";` Note the wiggly line under string."*

**Dịch:** đổi `String` thành `string` (thường) → lập tức có **gạch sóng đỏ** (wiggly line) dưới chữ `string`. Tab **Problems** liệt kê lỗi "unknown string type" — click vào lỗi là con trỏ **nhảy đúng dòng sai**.

> *"Tip: Often, an Eclipse error report is accompanied by a lightbulb icon. Click on the lightbulb to get a list of suggested fixes."*

**Dịch:** cạnh lỗi thường có **icon bóng đèn 💡** — click để xem **gợi ý sửa tự động** (quick fix).

⭐ Đây là "kiểm tra lỗi sớm" (bài 1.2.4) đạt cực đại: pipeline bắt lỗi của Java giờ đầy đủ 3 tầng —

```
GÕ CODE          COMPILE            RUNTIME
IDE gạch đỏ  →   javac chặn     →   JVM ném exception
(tức thì!)       (chưa chạy)        (fail rõ ràng)
```

IDE làm được vì nó **chạy compiler ngầm liên tục** trong lúc bạn gõ — không phải magic, vẫn là `javac` đó thôi.

> 💡 **So với JS:** cảm giác này giống ESLint/TS gạch đỏ trong VS Code — nhưng khác bản chất: bên Java, gạch đỏ = **compiler thật** từ chối, chương trình **không thể tồn tại** khi còn lỗi. ESLint với JS thuần chỉ là lời khuyên — code sai vẫn chạy được.

---

## Tóm tắt section 2.3

> Ngày thường dùng IDE (Eclipse — sách / IntelliJ — ngành / VS Code — quen tay), terminal để troubleshoot. Nút Run = `javac` + `java` đóng gói. Giá trị lớn nhất: **compiler chạy ngầm khi gõ** — gạch đỏ tức thì + bóng đèn quick fix — tầng bắt lỗi sớm nhất trong 3 tầng của Java.

---

## Bài kế tiếp

→ [[04 - JShell]] — REPL của Java: nghịch code không cần class, không cần main, không cần compile tay — món Java "nợ" cộng đồng suốt 22 năm.
