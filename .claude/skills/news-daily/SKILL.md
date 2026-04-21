---
name: news-daily
description: Tổng hợp tin tức kỹ thuật (System Design, Web dev, Firebase/GCP, Shopify, AI) + snapshot tài chính VN (vàng/chứng khoán/crypto) vào file markdown hàng ngày. Dùng khi user muốn update nhanh news dev hoặc hỏi "có gì mới hôm nay".
argument-hint: [topic...]
allowed-tools: WebSearch WebFetch Bash(find:*) Bash(mkdir:*) Write
---

**Context user:** Shopify app developer tại Joy Loyalty. Stack: **JavaScript** (không TS), **Firebase**, **GCP**, React (vì Polaris), Shopify Admin API. Ưu tiên học architecture, coding craft, web dev, Firebase/GCP.

Nếu `$ARGUMENTS` có giá trị → chỉ tìm topic đó. Trống → tất cả theo priority dưới.

## Topic priority

### 🔴 Cao — Dev skill
1. **🏗️ System Design / Architecture** — scaling, distributed, event-driven, design pattern, reliability, case study engineering blog.
2. **🔥 Firebase & GCP** — Firestore, Cloud Run, Functions v2, Pub/Sub, BigQuery, security rules, cost optimization.
3. **🌐 Web development** — React/Next, JS language, performance, CSS/UI, tooling. Code pattern cụ thể, không TS-only listicle.
4. **🛠️ Coding practice / Dev craft** — clean code, refactor, testing, debugging, DX.
5. **🛒 Shopify Platform & API** — GraphQL API, Functions, Checkout Extensibility, Polaris, metafields.

### 🟡 Trung
6. **🤖 AI** — model/tool mới, đặc biệt AI cho dev workflow (Claude Code, Cursor).
7. **📱 Shopify events** — Editions, BFCM, Built for Shopify.
8. **🔒 Security** — CVE, breach, web/e-commerce/data privacy.

### 🟢 Thấp
9. **🎁 Loyalty competitors** — chỉ khi có launch/pricing shock lớn.
10. **🏢 Tech companies & figures** — chỉ khi thực sự nổi bật.
11. **📦 GitHub trending** — repo có giá trị học.

### 💰 Luôn có ở cuối — Tài chính VN
Section luôn render: giá vàng (SJC/9999/thế giới), VN-Index, BTC/ETH.

## Workflow

### Bước 1 — Filter dedupe 7 ngày
```bash
find "Learn something new every day." "AI" "10 - Tech" "2 - Frontend" "3 - Backend" "7 - Software Architecture" "8- System Design" -type f -name "*.md" -mtime -7 2>/dev/null
find "Learn something new every day." -type f -name "*-summary.md" -mtime -7 -exec cat {} \;
```
Thu list URL + tiêu đề đã xuất hiện. Bước 3 bỏ hoàn toàn nếu trùng.

### Bước 2 — Search song song
WebSearch nhiều query cùng lúc theo topic + tài chính VN. Query pattern + nguồn ưu tiên xem [sources.md](sources.md). **Filter ≤7 ngày.**

### Bước 3 — Ghi file (KHÔNG in terminal)
Output path:
```
Learn something new every day./YYYY-MM/YYYY-MM-DD/YYYY-MM-DD-summary.md
```
Tạo folder nếu chưa có, ghi đè nếu cùng ngày. Format chi tiết xem [template.md](template.md). Quy tắc anti-hallucination + nội dung xem [rules.md](rules.md) — **bắt buộc đọc trước khi ghi file**.

### Bước 4 — Confirm 1 dòng
```
✅ Đã lưu: Learn something new every day./YYYY-MM/YYYY-MM-DD/YYYY-MM-DD-summary.md
   X tin, Y ⭐. Mở file để đọc.
```
Không dump digest ra chat.

User tự thêm note topic riêng vào cùng folder ngày (vd `YYYY-MM-DD/topic-research.md`).
