# 03 — Java Applets and the Internet

> Chapter 1, Section 1.3 — Core Java Volume I, 13th Edition (Horstmann).
> Câu chuyện: **giấc mơ chạy Java trên web** — từ phấn khích đến sụp đổ.
>
> Bài này ngắn — chủ yếu là lịch sử, nối tiếp câu chuyện sandbox ở [[02 - The Java White Paper Buzzwords|bài 02 (mục Secure)]].

---

## Applet là gì?

> *"The idea here is simple: Users will download Java bytecodes from the Internet and run them on their own machines. Java programs that work on web pages are called applets. To use an applet, you only need a Java-enabled web browser, which will execute the bytecodes for you. You need not install any software. You get the latest version of the program whenever you visit the web page containing the applet. Most importantly, thanks to the security of the virtual machine, you never need to worry about attacks from hostile code."*

**Dịch:** Ý tưởng đơn giản: user tải **[[02 - The Java White Paper Buzzwords#1.2.6 Architecture-Neutral|bytecode]] Java từ Internet** về và chạy trên máy mình. Chương trình Java chạy trên web page gọi là **applet**. Chỉ cần browser hỗ trợ Java — **không cần cài phần mềm**, luôn được **version mới nhất** mỗi lần mở trang, và nhờ [[02 - The Java White Paper Buzzwords#1.2.5 Secure|security]] của JVM — **không lo code độc hại**.

Đây chính là mô hình "chạy code từ Internet" đã học ở bài 02:

```
Mở trang web chứa applet
→ browser tự tải bytecode (.class) về
→ JVM (plugin trong browser) chạy applet trong sandbox
→ applet hiện ngay trong trang — tương tác được
```

**3 lời hứa của applet** (nghe quen không? — đây chính là các đặc tính web app hiện đại):
1. **Không cần cài đặt** — mở trang là chạy
2. **Luôn version mới nhất** — không có chuyện "vui lòng update"
3. **An toàn** — sandbox nhốt code lạ

---

## Applet trong trang web trông thế nào?

> *"Inserting an applet into a web page works much like embedding an image. The applet becomes a part of the page, and the text flows around the space used for the applet. The point is, this image is alive. It reacts to user commands, changes its appearance, and exchanges data between the computer presenting the applet and the computer serving it."*

**Dịch:** Nhúng applet vào web page giống **nhúng 1 tấm ảnh** — applet thành 1 phần của trang, text chảy quanh nó. Nhưng điểm mấu chốt: **tấm ảnh này SỐNG** — nó phản ứng với lệnh user, thay đổi hình dạng, trao đổi dữ liệu với server.

**Ví dụ trong sách — applet Jmol:**

> *"Figure 1.1 shows the Jmol applet that displays molecular structures. By using the mouse, you can rotate and zoom each molecule to better understand its structure. At the time that applets were invented, this kind of direct manipulation was not achievable with web pages—there was only rudimentary JavaScript and no HTML canvas."*

**Dịch:** Applet Jmol hiển thị **cấu trúc phân tử 3D** — dùng chuột xoay, zoom từng phân tử. Thời applet ra đời, web page **không thể** làm được điều này — JS còn **sơ khai** (rudimentary), và **chưa có HTML canvas**.

**Bối cảnh 1995-2000 để thấy applet "vi diệu" cỡ nào:**

| | Web thường (HTML + JS sơ khai) | Java applet |
|---|---|---|
| Khả năng | Text tĩnh, form, ảnh đứng im | Đồ hoạ 3D, game, chart tương tác, animation |
| JS lúc đó làm được gì | Validate form, đổi ảnh khi hover | — |
| Tương tác | Bấm link → load trang mới | Xoay/zoom/kéo thả ngay trong trang |

Applet là **cách duy nhất** đưa "ứng dụng thật" lên web thời đó.

---

## Từ phấn khích đến sụp đổ

> *"When applets first appeared, they created a huge amount of excitement. Many people believe that the lure of applets was responsible for the astonishing popularity of Java."*

**Dịch:** Applet xuất hiện tạo **cơn phấn khích khổng lồ**. Nhiều người tin rằng sức hút của applet chính là **lý do Java nổi tiếng thần tốc**.

⭐ Điểm quan trọng: Java nổi tiếng **nhờ applet** (client-side) — nhưng sống sót và thống trị đến nay **nhờ server-side**. Đúng kiểu "nổi lên nhờ 1 nghề, sống bằng nghề khác."

### Rồi mọi thứ đổ vỡ — 3 đòn chí mạng

> *"However, the initial excitement soon turned into frustration. Various versions of the Netscape and Internet Explorer browsers ran different versions of Java, some of which were seriously outdated. This sorry situation made it increasingly difficult to develop applets that took advantage of the most current Java version. Instead, Adobe's Flash technology became popular for achieving dynamic effects in the browser. Later, when Java was dogged by serious security issues, browsers dropped applet support altogether. Of course, Flash fared no better."*

**Dịch + phân tích từng đòn:**

**Đòn 1 — Phân mảnh version (fragmentation):** Netscape và IE mỗi browser chạy **1 version Java khác nhau**, có cái **lỗi thời nghiêm trọng**. Dev viết applet cho Java mới → user browser cũ không chạy được. Chính [[02 - The Java White Paper Buzzwords#1.2.6 Architecture-Neutral|WORA]] bị phản bội ngay trên web: "Write Once, Run Anywhere" thành *"Write Once, Debug Everywhere"*.

> 💡 **JS cũng từng khổ y hệt:** thời IE6 — mỗi browser 1 kiểu JS, dev phải viết code riêng cho từng browser (jQuery sinh ra chính để che sự phân mảnh đó). Khác biệt: JS **nằm sẵn trong browser** nên được browser vendor tự động update, còn Java là **plugin ngoài** — số phận nằm trong tay Netscape/Microsoft/Oracle.

**Đòn 2 — Flash cướp ngôi:** Adobe Flash **dễ hơn cho designer** (kéo thả, timeline animation), plugin nhẹ hơn, phổ cập nhanh hơn → chiếm hết đất "hiệu ứng động trên browser" (game, video, banner...).

**Đòn 3 — Security issues (đã học kỹ ở bài 02):** hacker liên tục tìm ra lỗ hổng thoát sandbox, Oracle vá không kịp → browser **bỏ hẳn** applet.

> *"Of course, Flash fared no better."*

**Dịch:** Và tất nhiên, **Flash cũng chẳng khá hơn** — chết năm 2020, cùng lý do security. Câu này Horstmann viết kiểu mỉa mai nhẹ: kẻ cướp ngôi applet rồi cũng chung số phận.

---

## Timeline tóm tắt

```
1995   Applet ra mắt cùng Java — cơn sốt, "tương lai của web"
~2000  Flash vượt mặt — applet mất đất dynamic content
2005+  JS + AJAX trỗi dậy (Gmail, Google Maps) — web app không cần plugin
2013+  Lỗ hổng security liên tiếp — browser lần lượt chặn Java plugin
2017   Java 9 deprecate Applet API — chính thức khai tử
2020   Flash cũng chết nốt
       → Kẻ thắng cuối cùng: JavaScript + HTML5 (canvas, WebGL, WASM)
```

## Ai thắng cuộc chiến này? — Chính là stack bạn đang dùng

Mọi thứ applet hứa năm 1995, web hiện đại đều làm được — **không cần plugin**:

| Applet hứa (1995) | Web hiện đại (JS/HTML5) |
|---|---|
| App chạy trong trang, không cần cài | SPA — React, Vue... |
| Đồ hoạ 3D xoay/zoom (Jmol) | HTML canvas, WebGL, Three.js |
| Sandbox an toàn | Browser sandbox (per-tab, permission) |
| Bytecode chạy mọi máy | JS engine mọi browser + WebAssembly |
| Luôn version mới nhất | Deploy web là user có bản mới ngay |

**Bài học lịch sử:** ý tưởng của applet **đúng hết** — chỉ sai ở chỗ đóng vai **plugin ngoài** thay vì tích hợp sẵn trong browser. Công nghệ tích hợp sẵn (JS) thắng công nghệ phải cài thêm (applet, Flash, Silverlight — cùng chết cả cụm).

---

## Tóm tắt section 1.3

> **Applet** = chương trình Java nhúng trong web page, tải bytecode từ Internet chạy trong browser (sandbox). Tạo cơn sốt đưa Java nổi tiếng toàn cầu, nhưng chết vì: phân mảnh version → thua Flash → lỗ hổng security → browser khai tử. Giấc mơ của applet ngày nay sống trong chính JS/HTML5. Còn Java? Rút về **server-side** — và thống trị ở đó (bài kế sẽ kể).

---

## Bài kế tiếp

→ [[04 - A Short History of Java]] — lịch sử Java: từ dự án "Green" cho TV box, cái tên "Oak", đến các mốc version quan trọng (Java 8, 9, 17, 21).
