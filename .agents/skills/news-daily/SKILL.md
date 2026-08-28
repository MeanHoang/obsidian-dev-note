---
name: news-daily
description: Tổng hợp bản tin kỹ thuật hằng ngày cho Joy Loyalty—System Design, Firebase/GCP, web development, Shopify, AI/security, tài chính Việt Nam và AVADA Digest—thành các Markdown trong Learn something new every day. Dùng khi user hỏi “news daily”, “đọc báo”, “có gì mới hôm nay”, hoặc muốn update tin dev hằng ngày.
---

# News Daily for Joy Loyalty

## Mục tiêu

Tạo một thư mục theo ngày với một index và các note topic. Viết bằng tiếng
Việt, ngắn gọn, có link nguồn cụ thể, và luôn nêu một impact thực tế với Joy
Loyalty. Context người dùng: Shopify app developer, JavaScript, Firebase, GCP,
React/Polaris; ưu tiên architecture, coding craft, web, Firebase/GCP.

## Output

```text
Learn something new every day/YYYY-MM/YYYY-MM-DD/
├── YYYY-MM-DD-summary.md
├── system-design.md
├── firebase-gcp.md
├── web-dev.md
├── shopify.md
├── ai-security.md
├── tai-chinh-vn.md
└── avada-digest.md
```

Không tạo file topic khi không tìm được tin đủ chuẩn; riêng `tai-chinh-vn.md`
và `avada-digest.md` luôn thử tạo. Nếu user chỉ định topic, chỉ tạo topic đó và
summary ngắn tương ứng.

## Workflow

1. Lấy ngày từ system context, không đoán. Tạo output folder bằng `YYYY-MM` và
   `YYYY-MM-DD`.
2. Quét toàn bộ Markdown trong `Learn something new every day/` có mtime 7 ngày
   gần nhất. Đọc title/URL để loại tin đã xuất hiện.
3. Research theo topic, có thể chạy song song trong giới hạn agent hiện có:
   - **System Design:** scaling, distributed/event-driven, reliability,
     engineering case studies.
   - **Firebase & GCP:** Firestore, Cloud Run, Functions v2, Pub/Sub,
     BigQuery, security, cost.
   - **Web dev:** JavaScript, React/Next, performance, CSS/UI, testing,
     tooling và DX. Không mặc định TypeScript.
   - **Shopify:** changelog/dev docs, GraphQL, Functions, Checkout,
     Extensions, Polaris, metafields, Editions.
   - **AI & Security:** announcement chính thức, AI dev workflow, CVE/breach
     đáng chú ý, GitHub trending, loyalty competitors khi có tin lớn.
   - **Tài chính VN:** vàng SJC/9999, VN-Index, BTC/ETH, lãi suất VND.
   - **AVADA Digest:** đọc đầy đủ `https://digest.avada.net/d/YYYY-MM-DD`;
     nếu 404, đọc digest gần nhất từ homepage và ghi rõ đó là fallback.
4. Dùng nguồn gốc/official trước: Shopify, Firebase/GCP, Chrome/web.dev,
   Node/V8, OpenAI/Anthropic, engineering blogs. Tin tài chính dùng nguồn VN
   đáng tin hoặc nguồn giá trực tiếp. Mỗi item có URL cụ thể.
5. Với item nổi bật nhất của mỗi topic, mở bài gốc trước khi viết. Không đưa
   fact, ngày, số liệu, version, hay URL chỉ từ suy đoán/search snippet.
6. Dedupe tuyệt đối với 7 ngày gần nhất theo URL hoặc cùng tin. Chất lượng hơn
   số lượng: 3–5 item/topic; Shopify tối đa 7 item khi thực sự có tin.
7. Viết từng note và cuối cùng viết summary index: Top 5 toàn ngày + một dòng
   link/highlight cho mỗi file đã tạo. Không dump toàn bộ tin vào chat.

## Quy tắc nội dung và an toàn

- Mỗi item có: tiêu đề link, **Đây là gì**, **Vì sao đáng đọc**. Item ⭐ có
  **Chi tiết** 3–5 bullet chỉ từ bài đã mở.
- Luôn giải thích thuật ngữ mới cho người chưa quen. Nêu một impact cụ thể với
  Joy Loyalty hoặc workflow dev.
- Không bịa URL, không sửa slug, không dùng một URL làm chứng cứ cho nhiều fact
  rời rạc. URL không mở được hoặc không hỗ trợ claim thì bỏ.
- AVADA Digest phải giữ mọi section và mọi mục đọc được (đặc biệt deadlines);
  đây là bản ghi đầy đủ, không dedupe với các topic khác.
- Tài chính là snapshot có timestamp/nguồn, nhận định ngắn dựa trên số liệu và
  không phải lời khuyên đầu tư.

## Format note

```markdown
# <emoji> <Topic> — YYYY-MM-DD

> Một câu nêu điều đáng chú ý nhất.

## ⭐ [Tiêu đề](url) — (Nguồn)
**Đây là gì:** …
**Chi tiết:**
- …
**Vì sao đáng đọc:** …

## [Tiêu đề](url) — (Nguồn)
**Đây là gì:** …
**Vì sao đáng đọc:** …
```

`YYYY-MM-DD-summary.md` chỉ là index: Top 5 và link Obsidian tới các file con;
không lặp lại nội dung chi tiết. Kết thúc chat bằng đường dẫn folder, số file,
và top pick.
