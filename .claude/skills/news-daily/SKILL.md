---
name: news-daily
description: Tổng hợp tin tức kỹ thuật (System Design, Web dev, Firebase/GCP, Shopify, AI) + snapshot tài chính VN (vàng/chứng khoán/crypto) thành nhiều file markdown theo chủ đề hàng ngày, chạy bằng nhiều agent song song. Dùng khi user muốn update nhanh news dev hoặc hỏi "có gì mới hôm nay".
argument-hint: [topic...]
allowed-tools: WebSearch WebFetch Bash(find:*) Bash(mkdir:*) Bash(cat:*) Write Agent
---

**Context user:** Shopify app developer tại Joy Loyalty. Stack: **JavaScript** (không TS), **Firebase**, **GCP**, React (vì Polaris), Shopify Admin API. Ưu tiên học architecture, coding craft, web dev, Firebase/GCP.

Nếu `$ARGUMENTS` có giá trị → chỉ chạy agent của topic đó. Trống → chạy đủ 7 agent.

## Kiến trúc output — mỗi chủ đề 1 file riêng

```
Learn something new every day/YYYY-MM/YYYY-MM-DD/
├── YYYY-MM-DD-summary.md   ← index: Top 5 + highlight từng topic, link tới file con
├── system-design.md
├── firebase-gcp.md
├── web-dev.md
├── shopify.md
├── ai-security.md
├── avada-digest.md
└── tai-chinh-vn.md
```

Topic không có tin → **không tạo file đó** (trừ `tai-chinh-vn.md` luôn có).

## Phân công 7 agent (chạy song song)

| Agent | File | Phạm vi |
|---|---|---|
| 1. System Design | `system-design.md` | scaling, distributed, event-driven, design pattern, reliability, case study engineering blog |
| 2. Firebase & GCP | `firebase-gcp.md` | Firestore, Cloud Run, Functions v2, Pub/Sub, BigQuery, security rules, cost optimization |
| 3. Web Dev & Craft | `web-dev.md` | React/Next, JS language, performance, CSS/UI, tooling + clean code, refactor, testing, debugging, DX |
| 4. Shopify | `shopify.md` | GraphQL API, Functions, Checkout Extensibility, Polaris, metafields + Editions/BFCM/Built for Shopify |
| 5. AI, Security & Khác | `ai-security.md` | AI (model/tool mới, AI cho dev workflow), CVE/breach, GitHub trending, loyalty competitors + tech companies (chỉ tin thực sự lớn) |
| 6. Tài chính VN | `tai-chinh-vn.md` | vàng SJC/9999/thế giới, VN-Index, BTC/ETH, lãi suất ngân hàng + **Đánh giá chung** |
| 7. AVADA Digest | `avada-digest.md` | đọc **toàn bộ** bản digest ngày hôm đó tại `https://digest.avada.net/d/YYYY-MM-DD` — tóm tắt tất cả section |

### Agent 7 — AVADA Digest (bắt buộc chạy mỗi ngày)

- URL **luôn theo ngày đang chạy**: `https://digest.avada.net/d/<YYYY-MM-DD>` (vd hôm nay `2026-08-19` → `https://digest.avada.net/d/2026-08-19`). Không hardcode ngày cũ, không dùng `https://digest.avada.net` trần trừ khi trang ngày trả 404.
- Nếu trang ngày đó chưa có / 404 → WebFetch `https://digest.avada.net` để lấy link bản digest mới nhất, ghi rõ trong file là "digest ngày X (bản gần nhất, chưa có bản hôm nay)". Không có gì cả → `FILE: none`.
- **Đọc và tóm tắt TẤT CẢ section** của bản digest, không chọn lọc bỏ bớt section. Trang có các section dạng: Shopify This Week (deadlines / official news `#official-news` / changelog / developer updates), Launches, GitHub Trending, On X (SaaS, Ecom, DTC), On Reddit (r/shopify, r/shopifyDev, r/ecommerce), Analysis & Commentary. Section nào có trong trang thì phải xuất hiện trong file.
- Trong mỗi section: liệt kê **mọi mục** có trong trang (tiêu đề + link gốc nếu digest có link), mỗi mục 1 dòng tóm tắt tiếng Việt. Section dài (Reddit, GitHub Trending) được gộp bullet ngắn, nhưng không được bỏ mục.
- Digest thường dài → nếu 1 lần WebFetch không lấy đủ, WebFetch lại cùng URL với prompt nhắm vào từng section còn thiếu (vd "liệt kê đầy đủ phần On Reddit"), cho tới khi đủ section.
- Riêng phần **Deadlines** của Shopify This Week: giữ nguyên ngày deadline, đưa lên đầu file.
- Chỉ dùng dữ liệu đọc được từ trang; không suy diễn thêm nội dung bài gốc chưa đọc.
- Dedupe: mục trùng với tin agent khác đã có vẫn giữ trong file này (đây là bản ghi đầy đủ của digest), nhưng ở `TOP:` thì chọn mục chưa xuất hiện ở topic khác.

## Workflow

### Bước 1 — Dedupe scan (main agent, trước khi spawn)
```bash
find "Learn something new every day" -type f -name "*.md" -mtime -7 2>/dev/null
```
`cat` các file topic 7 ngày gần nhất, rút ra **list URL + tiêu đề đã xuất hiện theo từng topic**. List này sẽ nhúng vào prompt của agent tương ứng.

### Bước 2 — Spawn 7 agent SONG SONG (1 message, 7 tool call Agent)
Mỗi agent prompt phải chứa đầy đủ (agent không tự đọc được skill file, phải nhúng):
1. **Ngày hôm nay** (lấy từ `currentDate`, không để agent đoán).
2. **Phạm vi topic + file output path tuyệt đối** của nó.
3. **Context user** (đoạn đầu file này) + quy tắc "impact với Joy Loyalty", không bias TS.
4. **Query pattern + nguồn ưu tiên** cho topic đó — copy từ [sources.md](sources.md).
5. **Format file** — copy section tương ứng từ [template.md](template.md).
6. **Toàn bộ rules anti-hallucination** từ [rules.md](rules.md) (allowlist, verify WebFetch, cấm bịa URL, self-check).
7. **List URL/tiêu đề đã xuất hiện 7 ngày** của topic đó → trùng thì bỏ.
8. **Yêu cầu độ sâu:** với 1-2 item nổi bật nhất của topic, WebFetch bài gốc để viết section **Chi tiết** 3-5 bullet thật (số liệu, pattern, kết luận của bài) — không chỉ dựa snippet search.
9. **Return format:** sau khi Write file xong, trả về đúng 1 block:
   ```
   FILE: <path>
   ITEMS: <số item>
   STARRED: <số item ⭐>
   TOP: <tiêu đề> | <url> | <1 câu vì sao nổi bật>
   ```
   Topic không có tin → trả `FILE: none`.

Riêng agent 7: prompt phải nhúng **URL digest đã ghép sẵn theo ngày hôm nay** + toàn bộ mục "Agent 7 — AVADA Digest" ở trên + template `avada-digest.md`.

### Bước 3 — Main agent ghi index (sau khi 7 agent xong)
Ghi `YYYY-MM-DD-summary.md` theo format index trong [template.md](template.md):
- **Top 5 đáng đọc nhất hôm nay** — chọn từ các `TOP:` agent trả về, xếp theo impact với Joy Loyalty / skill dev.
- Mỗi topic 1 dòng: link Obsidian `[[file]]` + số item + highlight 1 câu.
- 1 dòng chốt từ Đánh giá chung tài chính.

### Bước 4 — Confirm ngắn gọn
```
✅ Đã lưu Learn something new every day/YYYY-MM/YYYY-MM-DD/ — N file:
   📌 summary (index) · 🏗️ system-design (X tin) · 🔥 firebase-gcp (X) · …
   Top pick: <tiêu đề top 1>
```
Không dump digest ra chat.

User tự thêm note topic riêng vào cùng folder ngày (vd `YYYY-MM-DD/topic-research.md`).
