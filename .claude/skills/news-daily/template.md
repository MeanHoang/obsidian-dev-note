# File output templates

Output tiếng Việt. 2 loại file: **file topic** (mỗi agent ghi 1 file) và **file index** (main agent ghi cuối).

## 1. Template file topic (system-design.md, firebase-gcp.md, web-dev.md, shopify.md, ai-security.md)

Mỗi item gồm các phần:
1. Tiêu đề + link (bold). Item nổi bật nhất topic đánh ⭐.
2. **Đây là gì:** 1-2 câu giải thích khái niệm/feature/công ty cho người chưa biết. Định nghĩa thuật ngữ mới.
3. **Chi tiết:** — *bắt buộc cho 1-2 item ⭐/nổi bật nhất (đã WebFetch bài gốc), khuyến khích cho item khác nếu snippet đủ dữ liệu* — 3-5 bullet ý chính thật của bài: số liệu, pattern, trade-off, kết luận. Không bịa ngoài những gì đã đọc được.
4. **Vì sao đáng đọc:** 1 câu impact cụ thể với Joy Loyalty / dev workflow / skill.

```markdown
# 🏗️ System Design — YYYY-MM-DD

> 1 dòng tổng quan: hôm nay topic này có gì đáng chú ý nhất.

## ⭐ [Tiêu đề bài nổi bật](url) — (nguồn)
**Đây là gì:** case study / pattern / concept.
**Chi tiết:**
- Bullet ý chính 1 (số liệu/scale cụ thể nếu bài nêu).
- Bullet ý chính 2 (pattern/giải pháp họ dùng).
- Bullet ý chính 3 (trade-off / kết quả / bài học).
**Vì sao đáng đọc:** áp dụng cho Joy scale / mindset.

## [Tiêu đề item thường](url) — (nguồn)
**Đây là gì:** …
**Vì sao đáng đọc:** …

…
```

Số lượng item mỗi file:
- Shopify: 5-7 item nếu nhiều tin tốt.
- Các topic khác: 3-5 item, ưu tiên chất lượng — **ít item có Chi tiết sâu > nhiều item 1 dòng**.
- ai-security.md: chia heading nhỏ `## 🤖 AI`, `## 🔒 Security`, `## 📦 GitHub Trending`, `## 🎁 Loyalty` — skip heading rỗng.

## 2. Template tai-chinh-vn.md

```markdown
# 💰 Tài chính Việt Nam — YYYY-MM-DD

## 🪙 Giá vàng
- **SJC:** mua XX.XX — bán XX.XX triệu/lượng ([nguồn](url))
- **Vàng 9999 / nhẫn trơn:** mua XX.XX — bán XX.XX ([nguồn](url))
- **Vàng thế giới:** $X,XXX/oz (+/-X% so hôm qua)

## 📈 Chứng khoán VN
- **VN-Index:** X,XXX.XX (+/-X.XX, +/-X.XX%) ([nguồn](url))
- Thanh khoản: ~X,XXX tỷ. Khối ngoại: mua/bán ròng X tỷ.
- Cổ phiếu ảnh hưởng lớn: [top 2-3 mã].

## ₿ Crypto
- **BTC:** $XX,XXX (+/-X% 24h) ([nguồn](url))
- **ETH:** $X,XXX (+/-X% 24h) ([nguồn](url))
- Tin đáng chú ý: [chỉ nếu có sự kiện lớn].

## 🏦 Lãi suất ngân hàng (tiết kiệm VND)
- **Vietcombank:** 6T X.XX% — 12T X.XX% ([nguồn](url))
- **BIDV / VietinBank / Agribank:** 6T X.XX% — 12T X.XX%
- **Top private (Techcombank/MB/ACB/VPBank…):** 6T X.XX% — 12T X.XX%
- **Cao nhất thị trường:** [tên bank] 12T X.XX% (điều kiện nếu có).
- Xu hướng: [tăng/giảm/đi ngang so tuần trước, chỉ note nếu có thay đổi].

## 🧭 Đánh giá chung
2-4 câu nhận định tổng quan, **dựa trên số liệu vừa render ở trên** (không bịa thêm dữ liệu):
- **Bức tranh chung:** kênh nào đang hút tiền / đi ngang / giảm.
- **Tín hiệu đáng chú ý:** điểm bất thường nếu có (vàng phá đỉnh, VN-Index thủng mốc, lãi suất đảo chiều, BTC biến động mạnh).
- **Gợi ý cho người giữ VND có dư:** kênh nào đang hợp lý theo dữ liệu hôm nay (nhận định ngắn, **không phải lời khuyên đầu tư**).
```

## 2b. Template avada-digest.md

Mục tiêu: **bản tóm tắt đầy đủ** của `https://digest.avada.net/d/YYYY-MM-DD` — mọi section, mọi mục. Ngắn gọn nhưng không bỏ sót.

```markdown
# 📰 AVADA Digest — YYYY-MM-DD

> Nguồn: [digest.avada.net/d/YYYY-MM-DD](https://digest.avada.net/d/YYYY-MM-DD) · 1 dòng: hôm nay digest có gì đáng chú ý nhất.

## ⏰ Deadlines
- **DD/MM:** nội dung deadline (ai bị ảnh hưởng).

## 🛒 Shopify This Week
### Official news
- **[Tiêu đề](url)** — 1 câu tóm tắt.
### Changelog
- **Tên thay đổi** — thay đổi gì, ảnh hưởng ai.
### Developer updates
- …

## 🚀 Launches
- **[Tên sản phẩm](url)** (công ty) — là gì, dùng để làm gì.

## 📦 GitHub Trending
**Hôm nay:** `repo1` — mô tả 1 câu · `repo2` — … (liệt kê đủ)
**Tuần này:** …
**Shopify org:** …

## 🐦 On X — SaaS, Ecom, DTC
- **SaaS:** …
- **Ecom/DTC:** …
- **Shopify community:** …

## 👽 On Reddit
- **r/shopify:** thread 1 — chốt lại 1 câu; thread 2 — …
- **r/shopifyDev:** …
- **r/ecommerce:** …

## 🧭 Analysis & Commentary
- Ý chính 1.
- Ý chính 2.

## 💡 Liên quan Joy Loyalty
2-3 bullet: mục nào trong digest hôm nay ảnh hưởng trực tiếp tới Joy Loyalty / app Shopify của user.
```

Section nào trang không có → bỏ heading đó. Section trang có → **bắt buộc xuất hiện**, không được rút gọn thành "và nhiều mục khác".

## 3. Template index (YYYY-MM-DD-summary.md — main agent ghi cuối)

Ngắn gọn — index để điều hướng, KHÔNG lặp lại nội dung file con.

```markdown
# News — YYYY-MM-DD

## 🔥 Top 5 đáng đọc nhất hôm nay
1. **[Tiêu đề](url)** (topic) — 1 câu: đây là gì + impact.
2. …
3. …

## 📂 Theo chủ đề
- 🏗️ [[system-design]] — X tin · highlight: 1 câu về item ⭐.
- 🔥 [[firebase-gcp]] — X tin · highlight: …
- 🌐 [[web-dev]] — X tin · highlight: …
- 🛒 [[shopify]] — X tin · highlight: …
- 🤖 [[ai-security]] — X tin · highlight: …
- 📰 [[avada-digest]] — X mục · highlight: 1 câu về mục đáng chú ý nhất trong digest.
- 💰 [[tai-chinh-vn]] — 1 câu chốt từ Đánh giá chung.

(Topic không có file hôm nay → bỏ dòng đó.)
```
