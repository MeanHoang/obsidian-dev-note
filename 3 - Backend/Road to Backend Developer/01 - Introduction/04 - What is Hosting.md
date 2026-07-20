# 04 — Hosting là gì?

> Bài 4 series [Road to Backend Developer](https://roadmap.sh/backend). Nối tiếp [[01 - How does the internet work]], [[02 - What is HTTP]], [[03 - What is Domain Name]].
>
> 📖 Thuật ngữ: [[Glossary - Networking]].

## 0. Một câu để nhớ

> **Hosting = thuê chỗ trên một MÁY CHỦ (server) chạy 24/7 để ĐẶT file web/app của bạn**, cho cả thế giới truy cập được qua Internet.

Nhớ mạch 3 bài trước: **domain** (tên) → DNS dịch ra **IP** → IP đó trỏ tới **server đang chạy hosting** → server trả file qua **HTTP**. Hosting chính là **cái server ở cuối** — nơi code/file của bạn thật sự "sống".

---

## 1. Vì sao cần hosting? (không tự chạy máy ở nhà à?)

Web/app của bạn = **một đống file** (HTML, CSS, JS, ảnh, code backend, database). Muốn người khác xem, các file đó phải nằm trên **một máy:**
- **Bật 24/7** (tắt máy = web sập).
- **Nối Internet + có IP công khai** (để ai cũng tới được — nhớ [[01 - How does the internet work|bài 01]]).
- **Đủ mạnh** để phục vụ nhiều người cùng lúc.

→ Máy tính ở nhà bạn **không hợp**: tắt máy là web chết, IP nhà thường **đổi liên tục + bị NAT** (không public), đường mạng nhà yếu. Nên người ta **thuê hosting** — máy đặt trong **data center** (trung tâm dữ liệu: điện dự phòng, mạng cực mạnh, chạy 24/7).

*Ví đời sống:* mở quán bán hàng — bạn không bán ở phòng ngủ (khách khó tới, giờ giấc thất thường), mà **thuê mặt bằng ngoài phố** (data center) — chỗ ai cũng ghé được, mở cửa suốt.

### 1.1. Nhà mạng cấp IP cho máy bạn thế nào? (IP động + NAT) — và VÌ SAO

Gốc rễ của cả 2 vấn đề ("IP đổi liên tục" + "bị NAT") là: **IPv4 chỉ có ~4 tỷ địa chỉ và đã CẠN** (nhớ [[01 - How does the internet work#2.2. Ba loại địa chỉ (dễ lẫn nhau)|bài 01]]). Không đủ cấp cố định 1 IP công khai cho mỗi người → nhà mạng phải "xoay xở" bằng 2 kỹ thuật:

**① IP ĐỘNG (DHCP) — vì sao IP nhà đổi liên tục:**
- Nhà mạng có **ít IP công khai hơn số khách** → không cấp cố định, mà **cho thuê tạm** từ 1 kho chung, mỗi IP có **thời hạn thuê (lease)**. Cơ chế này gọi là **DHCP**.
- Hết hạn / **restart router** / mất mạng → bạn có thể được cấp **IP khác**. Nên IP nhà **không ổn định**.
- *Vì sao phải thế:* tiết kiệm IP — chỉ ai đang online mới chiếm IP, offline thì trả lại cho người khác.
- *Ví:* như **xe ôm công nghệ** — không có xe cố định, mỗi lần gọi được cấp 1 xe đang rảnh; lần sau xe khác.

**② NAT — vì sao "bị NAT":**
- Cả nhà (laptop, điện thoại, TV) **dùng chung 1 IP công khai**; mỗi thiết bị chỉ có **IP private nội bộ** (`192.168.x.x`). Router làm **NAT (Network Address Translation)** — dịch qua lại private ↔ public.
```
              IP CÔNG KHAI (1 cái)  115.78.x.x
                       ▲
                  ┌────┴────┐
                  │ Router  │  ← NAT: dịch private ↔ public
                  └────┬────┘
     ┌──────────┬──────┴──────┐
  Laptop     Điện thoại      TV     (IP private, chỉ trong nhà)
 192.168.1.2 192.168.1.3  192.168.1.4
```
- *Vì sao phải thế:* cả chục thiết bị ra Internet chỉ tốn **1 IP công khai** → cứu IPv4 cạn.
- **Hệ quả xấu cho hosting:** từ **trong ra ngoài** thì ổn (router nhớ đường về); nhưng từ **ngoài vào trong KHÔNG tới thẳng máy bạn** — người ngoài chỉ thấy IP chung, router chặn kết nối lạ. → Server nhà **"vô hình"** với thế giới.
- *Ví:* NAT giống **tổng đài công ty có 1 số ngoài**, bên trong nhiều máy lẻ. Bạn gọi ra thoải mái; người ngoài gọi vào chỉ gặp tổng đài, **không gọi thẳng máy lẻ** của bạn được.

**→ Gộp lại — vì sao KHÔNG host web ở nhà:**

| Vấn đề          | Do đâu           | Hậu quả                        |
| --------------- | ---------------- | ------------------------------ |
| IP đổi liên tục | IP động (DHCP)   | Khách mất dấu server           |
| Bị NAT          | Núp sau IP chung | Ngoài không vào thẳng máy được |

→ Host thật cần **IP tĩnh (cố định) + công khai (không NAT chặn)** = thứ **hosting/data center** cung cấp. (Ở nhà có thể "vá" bằng port forwarding / Dynamic DNS / ngrok — nhưng chỉ để dev/test, không chạy thật.)

### 1.2. Hosting chạy IPv4 hay IPv6? → Cả hai (dual-stack)

Không có "luật" ép v4 hay v6 — server có thể có **IPv4, IPv6, hoặc CẢ HAI** (gọi *dual-stack*, **phổ biến nhất**). Đa số cloud (Google Cloud, AWS) cấp cả hai.

**Cái "quy định" domain dùng loại nào = BẢN GHI DNS** (nhớ [[03 - What is Domain Name#Ai quản lý? (chuỗi tổ chức)|A record bài 03]]):

| Bản ghi DNS | Trỏ tới | Ví dụ |
|---|---|---|
| **A record** | **IPv4** | `shop.com → 142.250.66.14` |
| **AAAA record** ("quad-A") | **IPv6** | `shop.com → 2001:db8::1` |

- Khai **A** → có IPv4; khai **AAAA** → có IPv6; khai **cả hai** → client tự chọn (ưu tiên IPv6, không được thì fallback IPv4 — cơ chế *Happy Eyeballs*).
- Thực tế **IPv4 vẫn chủ đạo** (tương thích ngược, mọi client vào được); **IPv6 đang tăng** → nhiều nơi giữ **dual-stack** cho chắc.
- **Với bạn:** Cloud Run / Firebase thường **dual-stack sẵn**, provider lo hết — chỉ cần nhớ **A = v4, AAAA = v6**, khai cả hai là phủ hết.

```bash
dig +short google.com A      # IPv4
dig +short google.com AAAA   # IPv6  → có cả 2 = dual-stack
```

---

## 2. Bên trong hosting có gì? Web server

Hosting = máy chủ, và trên máy đó chạy một phần mềm **web server** — thứ **nhận HTTP request → trả file/response** (nhớ [[02 - What is HTTP|bài 02]]).

> MDN: *"A web server is a computer that stores a website's files (HTML, images, CSS, JS) and serves them via HTTP."*

Phân biệt 2 nghĩa chữ "server":
- **Server (phần cứng)** = cái máy vật lý chạy 24/7.
- **Web server (phần mềm)** = chương trình xử lý HTTP, vd **Nginx, Apache** (web tĩnh) hoặc app Node/Python của bạn (web động).

**Luồng khi có khách (ghép cả series):**
```
Khách gõ shop.com → DNS ra IP → tới SERVER (hosting)
   → Web server (Nginx / app bạn) nhận HTTP request
   → đọc file / chạy code / query DB
   → trả HTTP response (HTML / JSON) về trình duyệt
```

---

## 3. Các loại hosting (từ rẻ→đắt, ít→nhiều quyền)

> Nguồn: [Hostinger](https://www.hostinger.com/tutorials/what-is-web-hosting/), [AWS](https://aws.amazon.com/what-is/web-hosting/).

| Loại | Ý tưởng | Ví như (nhà ở) | Hợp cho |
|---|---|---|---|
| **Shared** | Nhiều web **chung 1 server**, chia sẻ tài nguyên | **Ở ghép phòng trọ** — rẻ, nhưng chung bếp/wifi, đông thì chậm | Web nhỏ, blog, mới bắt đầu |
| **VPS** (Virtual Private Server) | Chia 1 server vật lý thành nhiều **server ảo**, mỗi cái tài nguyên riêng + quyền root | **Căn hộ chung cư** — có phòng riêng, tự sửa trong phòng | Web vừa, cần tùy chỉnh |
| **Dedicated** | Thuê **nguyên 1 server vật lý** cho mình | **Nhà nguyên căn** — mạnh nhất, đắt nhất, tự lo hết | Web lớn, traffic cực cao |
| **Cloud** | Web chạy trên **nhiều server nối nhau như 1 hệ thống**; co giãn tài nguyên theo tải | **Khách sạn** — cần thêm phòng có ngay, trả theo dùng | Web cần scale, chống spike |

**Điểm mấu chốt:**
- **Shared → Dedicated:** càng lên càng **nhiều quyền + mạnh + đắt**, nhưng phải **tự quản nhiều hơn**.
- **Cloud** khác về chất: không phải "1 máy" mà là **nhiều máy hợp lại**, **tự co giãn** (traffic tăng → tự thêm máy), **trả tiền theo lượng dùng**. Đây là hướng hiện đại.

### 3.1. Serverless — bạn còn chẳng thấy "server"
Một nhánh của cloud: bạn **chỉ đưa code**, nhà cung cấp lo **toàn bộ server + tự scale từ 0 → nhiều** khi có request, **không dùng thì không tốn tiền**.
- Vd **Cloud Run, Cloud Functions (Firebase Functions), AWS Lambda**.
- "Serverless" **không phải "không có server"** — mà là **bạn không phải quản server**, nó ẩn đi hết.

---

## 4. Domain + DNS + Hosting ghép lại (bức tranh đầy đủ)

3 mảnh của 1 website (nhớ [[03 - What is Domain Name|bài 03]]):

| Mảnh | Vai trò | Ví như |
|---|---|---|
| **Domain** | Cái tên (`shop.com`) | Biển tên quán |
| **Hosting** | Máy chứa file + chạy code | Mặt bằng quán thật |
| **DNS** | Trỏ tên → IP của hosting | Bản đồ chỉ đường tới quán |

```
shop.com  ──DNS trỏ──►  IP của server hosting  ──►  file/app của bạn chạy ở đó
(domain)               (A record / CNAME)          (hosting)
```
→ Mua domain **chưa đủ** để có web — phải có **hosting** (chỗ đặt file) + **trỏ DNS** domain về IP hosting. Thiếu 1 trong 3, web không chạy.

---

## 5. Liên hệ công việc: Firebase / GCP / Shopify 💼

Đây là phần **trực tiếp việc bạn làm** — bạn đang dùng hosting kiểu **cloud/serverless** hằng ngày:

| Dịch vụ bạn dùng | Loại hosting | Để làm gì |
|---|---|---|
| **Cloud Run** | Cloud / serverless (container) | Chạy backend API — tự scale 0→N theo request |
| **Cloud Functions / Firebase Functions** | Serverless (hàm) | Xử lý webhook Shopify, trigger sự kiện |
| **Firebase Hosting** | Cloud (static + CDN) | Đặt frontend (HTML/CSS/JS), tự có HTTPS + CDN toàn cầu |
| **Cloud Storage** | Lưu trữ file | Chứa ảnh/asset (không phải "chạy code") |

**Điểm thực tế nối với bài trước:**
- **Deploy Cloud Run** → được URL `xxx.run.app` (hosting đã có IP + HTTPS sẵn). Gắn domain riêng → **trỏ DNS (A/CNAME)** như [[03 - What is Domain Name|bài 03]].
- **Serverless = không lo server:** không phải vá OS, không lo máy sập — Google lo. Bạn chỉ đẩy code. Hợp với **HTTP stateless** ([[02 - What is HTTP#5. HTTP là STATELESS (không nhớ) — điểm CỐT LÕI ⭐|bài 02]]): mỗi request rơi vào instance nào cũng chạy → **tự scale thoải mái**, đừng lưu state trong RAM instance (để ở **Firestore**).
- **Trả tiền theo dùng:** Cloud Run/Functions **không request = gần như $0** — hợp app Shopify tải thất thường.
- **Shopify app:** backend bạn (trên Cloud Run) là "hosting" nhận webhook/API call từ Shopify; frontend embed có thể trên Firebase Hosting.

> 🔑 Với bạn: **hosting hiện đại = cloud/serverless (Cloud Run, Firebase)** — không cần thuê/quản 1 máy vật lý như kiểu Shared/VPS/Dedicated truyền thống. Nhưng hiểu 4 loại kia giúp bạn biết mình đang đứng ở đâu và vì sao cloud tiện.

---

## 6. Tự kiểm tra

1. Hosting là gì? Vì sao không tự chạy web bằng máy ở nhà?
2. Phân biệt "server (phần cứng)" và "web server (phần mềm)".
3. Shared / VPS / Dedicated / Cloud khác nhau ra sao? (dùng ví dụ nhà ở)
4. "Serverless" có thật sự không có server không?
5. Để 1 website chạy cần đủ 3 mảnh nào? (gợi ý: domain, ?, ?)
6. Vì sao HTTP stateless + serverless (Cloud Run) hợp nhau?

Xem tận mắt:
```bash
curl -I https://xxx.run.app     # xem server nào trả về (header Server)
dig +short shop.com             # domain đang trỏ IP hosting nào
```

---

**Bài tiếp theo:** *"DNS and how it works"* (đào sâu DNS) hoặc *"What are Browsers"* — tùy roadmap.

---

## Nguồn tham khảo
- [MDN — What is a web server?](https://developer.mozilla.org/en-US/docs/Learn_web_development/Howto/Web_mechanics/What_is_a_web_server) (nguồn chính)
- [Hostinger — What is web hosting](https://www.hostinger.com/tutorials/what-is-web-hosting/)
- [AWS — What is web hosting](https://aws.amazon.com/what-is/web-hosting/)
- [roadmap.sh — Backend Developer Roadmap](https://roadmap.sh/backend)
