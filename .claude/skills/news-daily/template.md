# File output template

Output tiếng Việt. **Chỉ render section có tin, skip section rỗng** (trừ section Tài chính VN luôn có).

Mỗi item gồm **3 phần bắt buộc**:
1. Tiêu đề + link (bold).
2. **Đây là gì:** 1-2 câu giải thích khái niệm/feature/công ty cho người chưa biết. Định nghĩa thuật ngữ mới.
3. **Vì sao đáng đọc:** 1 câu impact cụ thể (với Joy Loyalty / dev workflow / skill).

```markdown
# News Summary — YYYY-MM-DD

## 🔥 Top 3 đáng đọc nhất
1. **[Tiêu đề](url)** — gộp 1-2 câu: đây là gì + impact.
2. …
3. …

## 🏗️ System Design / Architecture
- ⭐ **[Tiêu đề]** ([nguồn](url))
  **Đây là gì:** case study / pattern / concept.
  **Vì sao đáng đọc:** áp dụng cho Joy scale / mindset.

## 🔥 Firebase & GCP
- **[Tiêu đề]** ([url](url))
  **Đây là gì:** feature/service/pattern.
  **Vì sao đáng đọc:** áp dụng vào Joy stack, giảm cost / tránh pitfall.

## 🌐 Web Development
- **[Tiêu đề]** ([url](url))
  **Đây là gì:** framework/feature/pattern giải quyết vấn đề nào.
  **Vì sao đáng đọc:** dùng ở đâu, thay thế cái gì.

## 🛠️ Coding Practice / Dev Craft
- **[Tiêu đề]** ([url](url))
  **Đây là gì:** technique/pattern/refactor concept.
  **Vì sao đáng đọc:** áp dụng vào code daily.

## 🛒 Shopify Platform & API
- ⭐ **[Tiêu đề]** ([url](url))
  **Đây là gì:** giải thích feature (vd "Hydrogen là framework headless storefront…").
  **Vì sao đáng đọc:** impact với Joy Loyalty.

## 🤖 AI
- **[Tiêu đề]** ([url](url))
  **Đây là gì:** model/tool mới.
  **Vì sao đáng đọc:** dùng trong workflow dev / e-commerce.

## 📱 Shopify Events & Ecosystem
…

## 🔒 Security
- **[Tiêu đề]** ([url](url))
  **Đây là gì:** CVE/breach, phạm vi.
  **Vì sao đáng đọc:** action cần làm.

## 🎁 Loyalty Competitors
…

## 🏢 Tech Companies & Figures
…

## 📦 GitHub Trending
- **[repo name]** ([url](url))
  **Đây là gì:** project làm gì, stack, scale.
  **Vì sao đáng đọc:** code pattern học được.

---

## 💰 Tài chính Việt Nam (snapshot)

### 🪙 Giá vàng
- **SJC:** mua XX.XX — bán XX.XX triệu/lượng ([nguồn](url))
- **Vàng 9999 / nhẫn trơn:** mua XX.XX — bán XX.XX ([nguồn](url))
- **Vàng thế giới:** $X,XXX/oz (+/-X% so hôm qua)

### 📈 Chứng khoán VN
- **VN-Index:** X,XXX.XX (+/-X.XX, +/-X.XX%) ([nguồn](url))
- Thanh khoản: ~X,XXX tỷ. Khối ngoại: mua/bán ròng X tỷ.
- Cổ phiếu ảnh hưởng lớn: [top 2-3 mã].

### ₿ Crypto
- **BTC:** $XX,XXX (+/-X% 24h) ([nguồn](url))
- **ETH:** $X,XXX (+/-X% 24h) ([nguồn](url))
- Tin đáng chú ý: [chỉ nếu có sự kiện lớn].

### 🏦 Lãi suất ngân hàng (tiết kiệm VND)
- **Vietcombank:** 6T X.XX% — 12T X.XX% ([nguồn](url))
- **BIDV / VietinBank / Agribank:** 6T X.XX% — 12T X.XX%
- **Top private (Techcombank/MB/ACB/VPBank…):** 6T X.XX% — 12T X.XX%
- **Cao nhất thị trường:** [tên bank] 12T X.XX% (điều kiện nếu có).
- Xu hướng: [tăng/giảm/đi ngang so tuần trước, chỉ note nếu có thay đổi].

### 🧭 Đánh giá chung
2-4 câu nhận định tổng quan, **dựa trên số liệu vừa render ở trên** (không bịa thêm dữ liệu):
- **Bức tranh chung:** kênh nào đang hút tiền / đi ngang / giảm (vàng vs chứng vs crypto vs gửi tiết kiệm).
- **Tín hiệu đáng chú ý:** điểm bất thường nếu có (vàng phá đỉnh, VN-Index thủng mốc, lãi suất đảo chiều, BTC biến động mạnh).
- **Gợi ý cho người giữ VND có dư:** kênh nào đang hợp lý theo dữ liệu hôm nay (chỉ nhận định ngắn, **không phải lời khuyên đầu tư**).

---
**Đề xuất đọc trước:** 2-3 item impact cao nhất với Joy Loyalty / skill dev của bạn.
```
