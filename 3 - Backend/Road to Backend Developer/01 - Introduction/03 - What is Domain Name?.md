# 03 — Domain Name (Tên miền) là gì?

> Bài 3 series [Road to Backend Developer](https://roadmap.sh/backend). Nối tiếp [[01 - How does the internet work?]] (đã gặp DNS/IP) & [[02 - What is HTTP?]].
>
> 📖 Thuật ngữ: [[Glossary - Networking]].

## 0. Một câu để nhớ

> **Domain name (tên miền)** = **cái TÊN dễ nhớ cho con người** trỏ tới một server trên Internet (vd `google.com`), thay cho dãy số **[[Glossary - Networking#IP address|IP]]** khó nhớ (`142.250.66.14`).

MDN: *"Domain names provide a human-readable address for any web s`erver available on the Internet."* Máy tính thật ra dùng **IP** để tìm nhau; tên miền chỉ là **lớp tên dễ nhớ phủ lên trên**, và **[[Glossary - Networking#DNS|DNS]]** lo dịch tên → IP (đã học ở [[01 - How does the internet work?#5.3. Domain vs DNS vs IP khác gì? (hay lẫn nhất)|bài 01 mục 5.3]]).

**Vì sao cần tên miền?** IP **khó nhớ** và **có thể đổi** (đổi server, đổi hosting). Tên miền giữ nguyên (`shop.com`), chỉ cần cập nhật "tên này trỏ IP mới" là xong — người dùng không phải nhớ lại gì.

---

## 1. Cấu trúc tên miền — đọc từ PHẢI sang TRÁI

Điểm dễ bỏ sót: tên miền **đọc ngược, từ phải qua trái** (từ tổng quát → cụ thể).

```
        blog . shop . com .
         │      │     │   └── (root, dấu chấm ẩn ở cuối)
         │      │     └────── TLD  (Top-Level Domain)
         │      └──────────── SLD  (Second-Level Domain) — tên bạn đăng ký
         └─────────────────── Subdomain (tên miền con)
```

| Thành phần | Là gì | Ví dụ |
|---|---|---|
| **Root** | Gốc (dấu `.` cuối, thường ẩn) | `.` |
| **TLD** (Top-Level Domain) | Đuôi — cho biết "loại/mục đích" | `.com`, `.org`, `.vn` |
| **SLD** (Second-Level Domain) | **Tên bạn đăng ký** (phần chính) | `shop` trong `shop.com` |
| **Subdomain** (tên miền con) | Nhánh con bạn tự tạo thêm | `blog.`, `www.`, `api.` |

**Vài lưu ý (nguồn [MDN](https://developer.mozilla.org/en-US/docs/Learn/Common_questions/Web_mechanics/What_is_a_domain_name)):**
- Mỗi **label** (đoạn giữa 2 dấu chấm) dài 1–63 ký tự, chỉ chữ A–Z, số 0–9, dấu gạch `-` (không đứng đầu/cuối). **Không phân biệt hoa thường.**
- **Subdomain = một bản ghi DNS ĐỘC LẬP** dưới domain bạn sở hữu; **bạn tự trỏ nó tới IP bất kỳ.** Sở hữu `shop.com` → tạo bao nhiêu subdomain cũng được (`blog.`, `api.`, `dashboard.`...), **miễn phí** (khác với mua thêm domain).
- **Mỗi subdomain CÓ THỂ trỏ server khác nhau — nhưng KHÔNG bắt buộc.** Bạn có thể cho nhiều subdomain về **cùng 1 server**, hoặc mỗi cái 1 server, tùy cấu hình:
  ```
  ① Khác server:  api.shop.com→server B,  cdn.shop.com→server C  (tách dịch vụ)
  ② Cùng server:  www + blog + shop.com  →  cùng server A
  ```
  → Không có luật "mỗi subdomain 1 server"; đó chỉ là 1 lựa chọn.
- `www` cũng chỉ là **một subdomain**. `www.google.com` và `google.com` là **2 bản ghi DNS riêng** → **thực tế trỏ IP khác nhau** (kiểm chứng: `dig +short google.com` vs `dig +short www.google.com` ra 2 tập IP khác). Chúng "cùng ra Google" vì được **cấu hình cùng phục vụ** (thường `google.com` redirect sang `www`), chứ không phải cùng 1 IP.

### 1.0. 1 domain → cả cây subdomain (hệ sinh thái)

Thuê **1 domain gốc** → đẻ ra **vô số subdomain** cho đủ thứ, tất cả **MIỄN PHÍ** (chỉ trả tiền cho domain gốc):
```
                    shop.com   ← chỉ THUÊ cái này (1 domain / năm)
   ┌───────┬───────────┼───────────┬──────────┐
  www.    api.       blog.       app.       admin.
   │
   └─ đẻ tiếp được:  staging.api.shop.com,  v2.api.shop.com ...
```
Ví dụ 1 domain chạy cả hệ sinh thái: `myshop.com` (landing), `app.` (dashboard), `api.` (Cloud Run backend), `cdn.` (ảnh), `docs.`, `staging.` (test). Google cũng vậy: `mail.` / `drive.` / `maps.google.com`...

**Giới hạn về TÊN (rất thoáng — gần như vô hạn):**

| Giới hạn | Con số |
|---|---|
| Số subdomain | Gần như không giới hạn |
| 1 label (đoạn giữa 2 dấu chấm) | ≤ 63 ký tự |
| Tổng cả tên miền | ≤ 253 ký tự |
| Số tầng lồng | ≤ 127 cấp |

**⚠️ Giới hạn THẬT không nằm ở tên, mà ở thứ đằng sau:**
- **Server/hosting:** subdomain chỉ là cái tên — `api.shop.com` phải trỏ tới **server thật đang chạy** (tốn tiền: Cloud Run/VPS). Treo tên suông không đủ.
- **Chứng chỉ HTTPS (TLS):** mỗi subdomain muốn 🔒 cần cert. Dùng **wildcard cert `*.shop.com`** phủ mọi subdomain 1 lần.
- **Giới hạn provider:** vài DNS/hosting giới hạn số bản ghi theo gói.

> 🔑 **Chốt:** 1 domain → đẻ cây subdomain gần như vô hạn, miễn phí. Giới hạn thật = mỗi subdomain cần **server + cert thật** đằng sau mới chạy — đó mới là chỗ tốn tiền/tài nguyên.

### 1.1. Các loại TLD
| Loại | Nghĩa | Ví dụ |
|---|---|---|
| **gTLD** (generic) | Dùng chung, không cần điều kiện | `.com`, `.org`, `.net`, `.app`, `.dev` |
| **ccTLD** (country-code) | Gắn quốc gia | `.vn` (VN), `.us`, `.fr`, `.jp` |
| **Đặc biệt** (có luật riêng) | Chỉ nhóm đủ điều kiện mới đăng ký được | `.gov` (chính phủ), `.edu` (giáo dục) |

> Vui: `.sh` (của đảo Saint Helena) được dân dev thích vì gợi tới **shell script** — nên `roadmap.sh` dùng nó.

---

## 2. Domain vs IP vs DNS vs URL (4 thứ hay lẫn)

Nhắc lại + bổ sung URL:

| | Là gì | Ví dụ |
|---|---|---|
| **Domain** | TÊN dễ nhớ trỏ tới server | `shop.com` |
| **IP** | ĐỊA CHỈ SỐ máy dùng để kết nối | `142.250.66.14` |
| **DNS** | Dịch vụ **dịch** domain → IP | (hệ thống máy chủ) |
| **URL** | **Địa chỉ ĐẦY ĐỦ** của 1 tài nguyên (domain chỉ là 1 phần) | `https://shop.com/products/123?ref=fb` |

**URL "bọc" domain bên trong:**
```
https :// blog.shop.com : 443 /products/123 ? ref=fb
  │           │            │        │           │
scheme     domain        port     path       query
(HTTP/S)  (tên miền)   (cổng)  (đường dẫn)  (tham số)
```
→ **Domain chỉ là 1 mảnh của URL.** URL = scheme + domain + (port) + path + query. (Nhớ [[02 - What is HTTP?|bài 02]]: server đọc path/query trong request.)

---

## 3. "Mua" tên miền — thực chất là THUÊ

MDN nói thẳng: *"You cannot buy a domain name. You pay for the right to use a domain name for one or more years."*

- Bạn **không sở hữu vĩnh viễn** — chỉ **thuê theo năm** (1 năm, 2 năm...). Hết hạn phải **gia hạn** (bạn được ưu tiên gia hạn trước người khác).
- Không gia hạn → domain **nhả ra** cho người khác đăng ký. (Đây là lý do domain hết hạn bị "cướp" mất.)

### Ai quản lý? (chuỗi tổ chức)
```
ICANN (tổ chức tối cao, quản toàn bộ hệ thống tên miền)
   └── Registry (nhà điều hành 1 TLD — giữ "sổ cái" mọi domain .com)
          └── Registrar (đại lý bán domain cho bạn — GoDaddy, Namecheap, Cloudflare...)
                 └── BẠN (người đăng ký)
```

- **Registrar** = nơi bạn vào mua/đăng ký (GoDaddy, Namecheap, Google Domains cũ, Cloudflare...). Phải được **ICANN cấp phép**.
- **Registry** = công ty giữ database gốc của cả một TLD (vd Verisign giữ `.com`).

### Kiểm tra domain còn trống không → WHOIS
```bash
whois shop.com        # còn ai đăng ký, hết hạn khi nào...
whois tenlala123.com  # nếu trả "NOT FOUND" = còn trống, đăng ký được
```
> Đăng ký xong, **vài giờ** sau thông tin lan ra các DNS server toàn cầu thì domain mới "sống" khắp nơi (gọi là *DNS propagation* — cần thời gian lan truyền).

---

## 4. Chuyện gì xảy ra khi bạn gõ 1 domain? (nối bài 01)

Tóm tắt (chi tiết ở [[01 - How does the internet work?#6. Ráp lại: gõ `google.com` + Enter thì sao? (câu phỏng vấn kinh điển)|bài 01 mục 6]]):

1. Gõ `mozilla.org` → trình duyệt hỏi **cache local** trước ("máy mình biết IP chưa?").
2. Chưa biết → hỏi **DNS server** → nó trả IP tương ứng.
3. Có IP rồi → trình duyệt mở TCP/TLS + gửi HTTP request tới server đó.

→ **Domain chỉ có tác dụng ở bước đầu (DNS dịch → IP)**; sau đó mọi thứ chạy bằng IP.

---

## 5. Liên hệ công việc: Shopify + Firebase/GCP 💼

Đây là chỗ tên miền "chạm" trực tiếp việc bạn làm:

- **Custom domain cho Cloud Run / Firebase Hosting:** deploy xong được URL mặc định (`xxx.run.app` / `xxx.web.app`). Muốn dùng domain riêng (`api.myshop.com`) → vào registrar cấu hình **bản ghi DNS**:
  - **[[Glossary - Networking#A record / CNAME|A record]]** → trỏ domain thẳng tới 1 **IP**.
  - **[[Glossary - Networking#A record / CNAME|CNAME]]** → trỏ domain (thường subdomain) tới **1 domain khác** (vd `api.myshop.com` → `xxx.run.app`).
- **Subdomain tách dịch vụ:** rất hay dùng — `api.myshop.com` (backend), `app.myshop.com` (dashboard), `cdn.myshop.com` (ảnh). Cùng 1 domain gốc, khỏi mua nhiều domain.
- **Shopify custom domain:** merchant trỏ domain riêng (`shopcuatoi.com`) về store Shopify cũng bằng **A record / CNAME** y hệt cơ chế trên.
- **DNS propagation:** đổi bản ghi DNS **không ăn ngay** — chờ vài phút đến vài giờ lan truyền. Đừng hoảng khi "đổi rồi mà chưa thấy".
- **HTTPS + domain:** gắn custom domain xong, Cloud Run/Firebase thường **tự cấp chứng chỉ TLS** cho domain đó → ra 🔒 (nhớ [[02 - What is HTTP?#7. HTTP vs HTTPS (nhắc lại từ bài 01)|HTTPS bài 02]]).

---

## 6. Tự kiểm tra

1. Tên miền đọc theo chiều nào? Trong `api.shop.com`, đâu là TLD / SLD / subdomain?
2. Domain, IP, DNS, URL — mỗi cái khác vai trò gì?
3. Bạn "mua đứt" được tên miền không? Ai quản lý (ICANN / registry / registrar)?
4. Muốn `api.myshop.com` trỏ về Cloud Run thì dùng bản ghi DNS loại nào?
5. Vì sao đổi DNS xong không thấy hiệu lực ngay?

Xem tận mắt:
```bash
whois google.com     # thông tin đăng ký domain
dig google.com       # xem DNS trả IP nào (chi tiết hơn nslookup)
nslookup shop.com    # tra nhanh domain → IP
```

---

**Bài tiếp theo:** *"What is Hosting?"* — server đặt ở đâu để chạy web/app.

---

## Nguồn tham khảo
- [MDN — What is a domain name?](https://developer.mozilla.org/en-US/docs/Learn/Common_questions/Web_mechanics/What_is_a_domain_name) (nguồn chính)
- [roadmap.sh — Backend Developer Roadmap](https://roadmap.sh/backend)
