# 05 — DNS và cách nó hoạt động

> Bài 5 series [Road to Backend Developer](https://roadmap.sh/backend). Nối tiếp [[01 - How does the internet work]], [[03 - What is Domain Name]], [[04 - What is Hosting]].
>
> 📖 Thuật ngữ: [[Glossary - Networking]].

## 0. Một câu để nhớ

> **DNS (Domain Name System)** = **"danh bạ" của Internet** — dịch tên miền (`shop.com`) → IP (`142.250.66.14`) để máy tính kết nối.

⚠️ **Cơ chế PHÂN GIẢI DNS** (recursive/iterative, cây root→TLD→authoritative, cache, resolver) đã **đào rất sâu ở [[01 - How does the internet work#6.1. Bước 1 — DNS lookup: tìm IP giữa hàng tỷ máy|bài 01 §6.1]]** — đọc lại ở đó. Bài này tập trung phần **THỰC HÀNH: các loại bản ghi (records), TTL, propagation** — thứ bạn đụng khi cấu hình domain thật.

---

## 1. Tóm tắt cơ chế (chi tiết ở bài 01)

```
Gõ shop.com → ① cache local (máy bạn) → ② resolver (8.8.8.8) tra hộ:
   root → TLD (.com) → authoritative → trả IP → cache lại
```
- **Recursive** (máy bạn↔resolver: giao trọn job) + **Iterative** (resolver↔các tầng: tự đi từng bước).
- Nhanh nhờ **cây phân cấp + cache**, không nhờ server siêu to.

→ Bài này: khi resolver hỏi tới **authoritative**, nó nhận về **DNS RECORDS** — chính là nội dung dưới đây.

---

## 2. DNS Records — các loại bản ghi (phần chính) ⭐

> Nguồn: [Cloudflare — DNS records](https://www.cloudflare.com/learning/dns/dns-records/).

**Record = một dòng khai báo trong authoritative server**, kiểu "tên này → giá trị này". Cấu trúc chung:
```
tên          TTL    loại    giá trị
shop.com     3600   A       142.250.66.14
```

Các loại hay dùng:

| Record | Trỏ tới | Để làm gì | Ví dụ |
|---|---|---|---|
| **A** | **IPv4** | Domain → IPv4 (phổ biến nhất) | `shop.com → 142.250.66.14` |
| **AAAA** | **IPv6** | Domain → IPv6 | `shop.com → 2001:db8::1` |
| **CNAME** | **Một domain khác** (bí danh) | Trỏ tên → tên khác, không phải IP | `www.shop.com → shop.com` |
| **MX** | **Server email** | Mail của domain gửi tới đâu | `shop.com → mail.google.com` |
| **TXT** | **Text bất kỳ** | Xác minh domain, chống giả mạo mail (SPF/DKIM) | `shop.com → "v=spf1 ..."` |
| **NS** | **Authoritative nameserver** | Ai giữ DNS của domain này | `shop.com → ns1.cloudflare.com` |
| **SOA** | (thông tin quản trị) | Admin + phiên bản zone | (tự sinh) |

### 2.1. A record — trỏ thẳng tới IP

**A = trỏ tên → một IP SỐ cụ thể.**
```
shop.com   A   142.250.66.14
```
- **Dùng khi:** bạn có **IP cố định** (IP tĩnh của server/VPS), hoặc trỏ **domain gốc** (`shop.com`) tới IP.
- **Điểm cần lưu:** IP đích **đổi** → bạn phải **tự vào sửa** A record. Hợp với thứ IP không đổi.

### 2.2. CNAME record — bí danh (alias): trỏ tên → tên khác

> Nguồn: [Cloudflare — CNAME record](https://www.cloudflare.com/learning/dns/dns-records/dns-cname-record/), [Google Cloud — Mapping custom domains](https://docs.cloud.google.com/run/docs/mapping-custom-domains).

**CNAME (Canonical Name) = một BÍ DANH: trỏ tên này → MỘT TÊN KHÁC** (không trỏ thẳng IP). Tên khác đó được tra tiếp cho tới khi ra IP.

**Ví dụ thật (verify `dig www.github.com`):**
```
www.github.com   CNAME   github.com          ← www chỉ là "bí danh" của github.com
github.com       A        20.205.243.166      ← rồi github.com mới ra IP thật
```
→ Hỏi `www.github.com` → DNS thấy CNAME → **tra tiếp `github.com`** → ra IP. Tức CNAME thêm **1 bước "đổi hướng tên"**.

#### Vì sao cần CNAME? (không dùng A cho gọn?)

Ý chính: **trỏ tới TÊN của nhà cung cấp, để HỌ tự quản IP đằng sau — bạn khỏi động tới.** [Google Cloud docs](https://docs.cloud.google.com/run/docs/mapping-custom-domains) nêu rõ:

1. **Nhà cung cấp dùng NHIỀU IP + có quyền đổi.** Cloud Run trỏ qua tên `ghs.googlehosted.com` — tên này ứng với **tới 4 IPv4 + 4 IPv6** (cho tin cậy), và Google **có thể đổi** khi nâng cấp hạ tầng.
   - Dùng A record → phải khai **cả 8 IP** + **tự sửa mỗi khi Google đổi** → mệt, dễ chết web.
   - Dùng **1 CNAME** → Google đổi IP thế nào, domain bạn **tự theo**. Docs: *"if Google's underlying infrastructure changes, your DNS configuration doesn't need to be updated."*
2. **Tự có cả IPv4 + IPv6.** 1 CNAME phủ luôn cả hai ([[04 - What is Hosting#1.2. Hosting chạy IPv4 hay IPv6? → Cả hai (dual-stack)|dual-stack bài 04]]), khỏi khai riêng A + AAAA.

> ⚠️ **Đính chính:** không phải "IP cloud nhảy loạn mỗi phút" — IP client thấy khá **ổn định**. Lý do CNAME là **nhà cung cấp có NHIỀU IP + GIỮ QUYỀN đổi** → trỏ tới TÊN để họ tự lo. Chi tiết: [[04 - What is Hosting#1.3. Cloud xử lý IP thế nào (GFE anycast vs backend)|bài 04 §1.3]].

#### Dùng CNAME khi nào

| Trường hợp | Ví dụ |
|---|---|
| Gắn **subdomain** vào cloud/SaaS (họ đưa TÊN, không đưa IP) | Cloud Run (`api → ghs.googlehosted.com`), **Shopify** (`www → shops.myshopify.com`), GitHub Pages, Vercel |
| Trỏ qua **CDN** | `www → shop.cdn.cloudflare.net` |
| **www → domain gốc** | `www.shop.com → shop.com` |
| Gom nhiều subdomain về 1 đích | `app.`/`docs.shop.com → target.com` |

#### Giới hạn CNAME
- **Chỉ cho SUBDOMAIN**, **KHÔNG cho domain gốc** (`shop.com`) — vì gốc bắt buộc có sẵn record khác (SOA/NS), mà **CNAME không được đứng chung tên với record khác**. Trỏ gốc vào cloud → dùng **A/AAAA** (Cloud Run cho IP để khai gốc) hoặc **ALIAS/ANAME** (nếu provider hỗ trợ).

### 2.3. MX & TXT — cho email
- **MX:** "mail của `@shop.com` gửi tới server nào". Không có MX → domain **không nhận được mail**.
- **TXT:** ghi chú text — dùng để **chứng minh bạn sở hữu domain** (Google/Shopify bảo "thêm TXT này vào DNS để xác minh") + **SPF/DKIM** chống mạo danh email.

---

## 3. TTL — bản ghi được cache bao lâu

> Nguồn: [Cloudflare — TTL](https://developers.cloudflare.com/dns/manage-dns-records/reference/ttl/).

**TTL (Time To Live)** = số giây mà một record được **cache** trước khi phải hỏi lại (nhớ cache ở [[01 - How does the internet work#6.1. Bước 1 — DNS lookup: tìm IP giữa hàng tỷ máy|bài 01 §6.1]]).

```
shop.com   3600   A   1.2.3.4
           └─ TTL = 3600s (1 giờ): resolver nhớ IP này 1 giờ rồi mới hỏi lại
```

**Đánh đổi:**

| | TTL cao (vd 24h) | TTL thấp (vd 300s) |
|---|---|---|
| Tốc độ tra | Nhanh (hit cache nhiều) | Chậm hơn (hỏi lại nhiều) |
| Đổi record thì | **Lâu có hiệu lực** (tới 24h) | **Nhanh có hiệu lực** |
| Tải lên nameserver | Nhẹ | Nặng hơn |

→ **Mẹo thực tế:** trước khi **đổi IP/chuyển hosting**, hạ TTL xuống thấp (300s) **vài ngày trước** → lúc đổi thật, thay đổi lan nhanh, ít downtime. Xong ổn định thì nâng lại.

---

## 4. DNS Propagation — vì sao đổi DNS không ăn ngay

**Propagation = thời gian một thay đổi DNS lan ra các resolver/cache toàn cầu.** Nhớ [[03 - What is Domain Name|bài 03]] — bạn sửa record ở authoritative, nhưng khắp thế giới **vẫn còn cache bản CŨ tới hết TTL.**

```
Bạn đổi:  shop.com  A  1.2.3.4 → 5.6.7.8   (ở authoritative, ngay lập tức)
Nhưng:    resolver A đã cache 1.2.3.4, TTL 1h → 1h nữa mới thấy 5.6.7.8
          resolver B cache TTL 24h → 24h sau mới đổi
→ Trong lúc đó, người dùng khác nhau thấy IP khác nhau (cũ/mới lẫn lộn)
```

- → Đổi DNS **không tức thì** — chờ **tới bằng TTL cũ** (vài phút đến vài chục giờ).
- Đây là lý do đổi hosting/domain hay dặn "**chờ 24–48h cho DNS lan hết**". Đừng hoảng khi "đổi rồi mà máy tôi vẫn vào IP cũ" — cache local/resolver chưa hết hạn.

---

## 5. Zone file & nơi records "sống"

- Tất cả record của 1 domain gom trong **zone file**, đặt tại **authoritative nameserver** của domain (nhớ [[01 - How does the internet work#6.1. Bước 1 — DNS lookup: tìm IP giữa hàng tỷ máy|bài 01]]: authoritative = nơi cầm câu trả lời thật).
- Bạn mua domain, dùng **Cloudflare/registrar** quản DNS → đó chính là **authoritative của bạn**; bạn thêm/sửa A, CNAME, MX... **ngay tại đó.**
- **NS record** khai "authoritative của tôi là ai" — khi trỏ domain sang Cloudflare, bạn đổi NS ở registrar về `ns1.cloudflare.com`... để Cloudflare thành nơi quản.

### 5.1. Record do AI đặt? — Server (chủ domain), KHÔNG phải máy bạn

Record **KHÔNG phụ thuộc phần mềm máy bạn** — nó do **chủ domain cấu hình trên authoritative server** (qua Cloudflare/registrar), và **giống hệt nhau cho cả thế giới**.

```
CHỦ DOMAIN (bạn) → vào Cloudflare → thêm/sửa record → lưu ở AUTHORITATIVE
                                                            │
Máy bạn / mọi người  ──chỉ ĐỌC──►  nhận record giống nhau (trừ khác biệt do cache)
```

| Ai | Làm gì với record |
|---|---|
| **Chủ domain** (bạn) | **ĐẶT/SỬA** record ở authoritative |
| **Authoritative server** | **GIỮ** record, trả lời khi được hỏi |
| **Máy bạn / phần mềm** | **ĐỌC + DÙNG** — không đặt được; chỉ **chọn** A hay AAAA nếu có cả hai (Happy Eyeballs) |

> **Ngoại lệ duy nhất — file `hosts` trên máy bạn:** ép cục bộ "shop.com → IP tôi tự ghi", nhưng **chỉ tác dụng trên MÁY ĐÓ** (dùng để test/chặn web), không đổi record thật của cả thế giới.

> 🔑 **Chốt:** record = **server config (chủ domain đặt ở authoritative)**, không phải do máy tính/trình duyệt quyết. Máy bạn chỉ đọc và dùng.

---

## 6. Liên hệ công việc: Shopify + Firebase/GCP 💼

Đây là chỗ bạn **thực sự chạm DNS record:**

- **Gắn custom domain cho Cloud Run:** Google cho bạn giá trị → bạn khai **A/AAAA** (domain gốc) hoặc **CNAME** (subdomain `api.myshop.com → ghs.googlehosted.com` / `xxx.run.app`).
- **Firebase Hosting custom domain:** thường khai **A record** trỏ tới IP Firebase cấp, hoặc TXT để xác minh.
- **Shopify custom domain:** trỏ **A record** về IP Shopify + **CNAME** `www` → `shops.myshopify.com`.
- **Xác minh domain (Google/Shopify):** thêm **TXT record** họ đưa → chứng minh bạn sở hữu.
- **Email cho domain** (`@myshop.com`): khai **MX** trỏ tới Google Workspace + **TXT (SPF/DKIM)** để mail không vào spam.
- **Đổi hosting an toàn:** hạ **TTL** trước vài ngày (mục 3) → đổi record → chờ propagation (mục 4).

> 🔑 Nhớ: **DNS record là "công tắc" nối domain ↔ hạ tầng.** Sai record = web/mail không chạy; sửa record phải chờ **TTL/propagation** mới ăn.

---

## 7. Tự kiểm tra

1. Recursive vs iterative khác gì? (ôn bài 01)
2. A vs AAAA vs CNAME — mỗi cái trỏ tới gì?
3. Muốn `api.myshop.com` trỏ về Cloud Run, dùng record nào?
4. TTL là gì? Vì sao trước khi đổi IP nên hạ TTL trước?
5. Vì sao đổi DNS không có hiệu lực ngay? (propagation)
6. MX và TXT dùng để làm gì?

Xem tận mắt:
```bash
dig shop.com A          # bản ghi IPv4
dig shop.com AAAA       # IPv6
dig shop.com MX         # server mail
dig shop.com TXT        # text (SPF, xác minh)
dig shop.com NS         # authoritative nameserver
dig +trace shop.com     # xem đi từ root xuống (ôn bài 01)
```

---

**Bài tiếp theo:** *"What are Browsers and how do they work"* — kết thúc nhóm Internet cơ bản.

---

## Nguồn tham khảo
- [Cloudflare — DNS records](https://www.cloudflare.com/learning/dns/dns-records/) (nguồn chính)
- [Cloudflare — TTL](https://developers.cloudflare.com/dns/manage-dns-records/reference/ttl/)
- [roadmap.sh — Backend Developer Roadmap](https://roadmap.sh/backend)
