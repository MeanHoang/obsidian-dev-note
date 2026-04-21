Tìm tin tức/bài báo kỹ thuật mới cho user học hôm nay. Topic: $ARGUMENTS (để trống = tìm tất cả topic mặc định).

**Context user:** User là Shopify app developer tại **Joy Loyalty** (loyalty/rewards app). Luôn ưu tiên topic Shopify + loyalty.

## Topic mặc định (khi $ARGUMENTS trống), theo thứ tự ưu tiên

### 🔴 Ưu tiên cao — Shopify ecosystem
1. **🛒 Shopify Platform & API** — thay đổi GraphQL Admin API / Storefront API, REST deprecation, API version mới, Shopify Functions, Checkout Extensibility / Checkout UI Extensions, Theme App Extensions, Customer Accounts, Polaris, App Bridge, metafields/metaobjects, webhooks.
2. **🎁 Loyalty apps & đối thủ** — cập nhật của Rivo, BON, Smile.io, LoyaltyLion, Yotpo Loyalty, Rise.ai, Stamped.io, Growave, Joy Loyalty. Feature launches, pricing change, review trending trên Shopify App Store, changelog.
3. **📱 Shopify events & ecosystem** — Shopify Editions (summer/winter), BFCM updates, Shopify earnings call, Built for Shopify requirements, App Store policy changes, partner news.
4. **🔗 Integration partners** — cập nhật API/feature của Klaviyo, Postscript, Gorgias, Judge.me, reviews apps, POS integrations (có thể ảnh hưởng workflow merchant dùng Joy Loyalty).

### 🟡 Ưu tiên trung — Kỹ thuật chung
5. **🤖 AI** — model mới, tool AI, Claude/OpenAI/Gemini updates (đặc biệt tin về AI agent cho e-commerce).
6. **🌐 Web development** — framework, best practice, performance, browser API (đặc biệt React/Next.js vì Shopify dùng Polaris React, Hydrogen dùng Remix/React).
7. **🛠️ Dev skills** — system design, architecture, coding practice.
8. **🔒 Security** — CVE lớn, breach notable (đặc biệt liên quan web/app, e-commerce, data privacy GDPR/CCPA/ATT).

### 🟢 Ưu tiên thấp — Bối cảnh
9. **🏢 Tech companies & figures** — động thái lớn của Google/Meta/Apple/OpenAI/Anthropic, phát ngôn nổi bật của tech leader. Chỉ nêu nếu thực sự nổi bật.
10. **📦 GitHub trending** — repo mới nổi liên quan topic trên.
11. **💰 Crypto** — chỉ tin thực sự lớn (1 item max), có thể bỏ qua nếu không có gì đáng kể.

Nếu user truyền topic cụ thể (vd: `/news-daily shopify`, `/news-daily AI security`) → chỉ tìm topic đó.

## Cách thực hiện

### Bước 1: Cross-reference với dev-note TRƯỚC khi search

**1a. Lấy danh sách file đã note + các digest cũ trong 7 ngày qua** (quan trọng nhất — filter trùng lặp):
```bash
find "Learn something new every day." "AI" "10 - Tech" "2 - Frontend" "3 - Backend" "7 - Software Architecture" "8- System Design" -type f -name "*.md" -mtime -7 2>/dev/null
```

**Đọc toàn bộ nội dung các file digest `*-summary.md` trong 7 ngày qua** (những file tạo bởi chính skill này những lần trước) — đây là nguồn chính để filter URL/topic đã liệt kê rồi:
```bash
find "Learn something new every day." -type f -name "*-summary.md" -mtime -7 -exec cat {} \;
```
Thu thập **danh sách URL + tiêu đề** đã xuất hiện → bước 3 phải skip hoàn toàn.

**1b. Liếc tổng quan** các folder để hiểu bối cảnh lâu dài (không bắt buộc đọc nội dung):
- `Learn something new every day./` (toàn bộ subfolder YYYY-MM) — list tên file
- `AI/` — Claude Code, Cursor, Lang, OpenClaw
- `10 - Tech/Shopify/` nếu có
- `2 - Frontend/`, `3 - Backend/`

Khi search ra tin trùng tên/chủ đề với file cũ → skip hoặc ghi chú "(đã note)".

### Bước 2: Search
Dùng **WebSearch** song song. Query mẫu — ưu tiên có site: khi biết nguồn:

**Shopify:**
- `Shopify changelog [current month year]`
- `site:shopify.dev/changelog [current month]`
- `Shopify Functions GraphQL API update [year]`
- `Shopify Checkout Extensibility news [year]`
- `Shopify Editions [season year]`

**Loyalty apps (cạnh tranh):**
- `Rivo loyalty app update [year]`
- `BON loyalty Shopify new feature`
- `Smile.io LoyaltyLion Yotpo launch [year]`
- `Shopify loyalty app comparison [year]`
- `site:shopify.com/partners/blog loyalty`

**Integration:**
- `Klaviyo API update [year]`, `Postscript new feature`

**AI / Web dev / Security:**
- `"Claude Anthropic release this week"`, `"OpenAI announcement this week"`
- `"Next.js release [year]"`, `"React compiler update"`
- `CVE Shopify vulnerability [year]`, `"security breach [month year]"`

**Ưu tiên nguồn:**
- Shopify: `shopify.dev`, `shopify.com/partners/blog`, `shopify.engineering`, `shopify.com/plus/news`
- Loyalty: blog chính thức từng app (rivo.io, bon.cm, smile.io, loyaltylion.com, yotpo.com), Shopify App Store listing updates
- Tech: Hacker News, TechCrunch, The Verge, dev.to, InfoQ, blog chính thức (anthropic.com, vercel.com…), GitHub trending.

**Filter:** chỉ lấy tin ≤7 ngày. Nếu quá cũ → skip.

### Bước 3: Ghi digest vào file (KHÔNG in ra terminal)

**Không trả text dài trên chat.** Viết toàn bộ digest vào file:

```
Learn something new every day./YYYY-MM/YYYY-MM-DD/YYYY-MM-DD-summary.md
```

Tạo folder `YYYY-MM/YYYY-MM-DD/` nếu chưa có. Nếu file cùng ngày đã tồn tại → ghi đè.

User có thể tự thêm note chủ đề vào cùng folder ngày (vd `2026-04-21/shopify-flow-research.md`) — file digest chỉ là 1 trong nhiều file của ngày đó.

**Format file (tiếng Việt, chỉ render section có tin, skip section rỗng):**

```markdown
# News Summary — YYYY-MM-DD

## 🔥 Top 3 đáng đọc nhất
1. [Tiêu đề](url) — 1 câu tại sao đáng đọc với Joy Loyalty.
2. …
3. …

## 🛒 Shopify Platform & API
- ⭐ **[Tiêu đề]** ([nguồn](url))
  Tóm tắt 1-2 câu. Ảnh hưởng gì tới Joy Loyalty.

## 🎁 Loyalty Apps & Đối thủ
- **[Tên app — feature]** ([url](url))
  …

## 📱 Shopify Events & Ecosystem
…

## 🔗 Integration Partners
…

## 🤖 AI
…

## 🌐 Web Development
…

## 🛠️ Dev Skills / Architecture
…

## 🔒 Security
…

## 🏢 Tech Companies & Figures
…

## 📦 GitHub Trending
…

## 💰 Crypto
…

---
**Đề xuất đọc trước:** 2-3 item impact cao nhất với công việc Joy Loyalty.
```

### Bước 4: Trả về chat chỉ 1 dòng confirm

Sau khi ghi file xong, chỉ hiển thị trên terminal **ngắn gọn** — không dump lại digest:

```
✅ Đã lưu digest tại: Learn something new every day./YYYY-MM/YYYY-MM-DD/YYYY-MM-DD-summary.md
   X tin tổng, highlight Y tin ⭐. Mở file để đọc.
```

Không hiển thị thêm. User sẽ tự mở file trong Obsidian để đọc.

**Cấu trúc folder:** `Learn something new every day./YYYY-MM/YYYY-MM-DD/YYYY-MM-DD-summary.md`. Khi user dùng `/note` để note bài riêng lẻ thì cũng bỏ vào cùng folder tháng.

## Quy tắc

### 🚨 Anti-hallucination (ƯU TIÊN SỐ 1)
- **Mỗi item BẮT BUỘC có 1 URL cụ thể lấy nguyên văn từ kết quả WebSearch.** Không sửa, không rút gọn, không đoán slug.
- **Cấm 100% việc tự bịa/đoán URL.** Không viết URL dạng `example.com/blog/something` dù đoán rất hợp lý — chỉ dùng URL đúng như WebSearch trả về.
- **Cấm tái sử dụng 1 URL chung (vd `shopify.dev/changelog`) cho nhiều item khác nhau** — mỗi fact cần 1 URL cụ thể tới bài viết gốc. Nếu không có URL riêng → gộp các item đó thành 1 entry tham chiếu URL tổng.
- **Nếu 1 claim không có URL rõ ràng trong search result → bỏ claim đó**, không cố điền. Thà ít item thật còn hơn nhiều item sai.
- **Ngày/số/phiên bản** (vd "ra mắt 15/04", "API version 2026-04", "+500-1000%") — chỉ ghi nếu WebSearch snippet nêu rõ. Nếu không chắc → bỏ số liệu, chỉ nói định tính.
- **Nếu nghi ngờ** 1 item quan trọng nhưng link/số liệu chưa chắc → dùng **WebFetch** verify URL đó tồn tại và đọc được content khớp trước khi đưa vào digest.
- **Tự kiểm tra trước khi gửi:** quét lại digest, mỗi URL phải đúng copy-paste từ 1 WebSearch result cụ thể. Không qua kiểm tra thì không gửi.

### Nội dung
- **Skip section rỗng** — không viết "không tìm thấy tin" cho từng topic, gộp lại ở cuối nếu cần.
- Mỗi topic tối đa **3-5 item**, ưu tiên chất lượng.
- Section Shopify + Loyalty apps: có thể nêu **5-7 item** vì đây là ưu tiên cao nhất.
- Tóm tắt đủ để user quyết định click hay không, không copy nguyên đoạn.
- **Filter trùng 7 ngày (bắt buộc):** so khớp tiêu đề/chủ đề tin tìm được với list file đã note trong 7 ngày qua (bước 1a). Nếu trùng → **bỏ hẳn khỏi digest**, không ghi chú. Tin cùng chủ đề cũ hơn 7 ngày → có thể giữ nếu có góc nhìn mới, ghi chú "(đã note tuần trước)".
- **Ngữ cảnh Joy Loyalty:** khi tóm tắt tin Shopify/loyalty, luôn thêm 1 câu "ảnh hưởng gì tới công việc" (API phải migrate, đối thủ ra feature cần check, etc.).
- Ngày hôm nay lấy từ currentDate trong system context.
