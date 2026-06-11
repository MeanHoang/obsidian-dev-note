# Rules

**Áp dụng cho MỌI agent.** Subagent không tự đọc được file này — main agent phải nhúng toàn bộ rules vào prompt của từng agent khi spawn.

## 🚨 Anti-hallucination (ƯU TIÊN SỐ 1)

**Sự thật quan trọng:** WebSearch trả URL từ result list — nhưng **URL có thể đã 404, moved, hoặc fabricated bởi search index**. KHÔNG tin tuyệt đối URL từ WebSearch, phải verify.

### URL Allowlist — không cần WebFetch verify
Domain sau đã structured URL đáng tin, miễn verify khi chỉ lấy URL root / docs / changelog:
- `shopify.dev`, `shopify.engineering`, `changelog.shopify.com`, `shopify.com/editions`, `shopify.com/news`
- `cloud.google.com` (docs, blog), `firebase.google.com`, `firebase.blog`
- `web.dev`, `developer.chrome.com`, `developer.mozilla.org`, `nodejs.org`, `v8.dev`
- `github.com` (đường dẫn thật), `nextjs.org`
- `anthropic.com`, `openai.com` (news, docs)
- `techcrunch.com`, `theverge.com`, `arstechnica.com`, `news.ycombinator.com`
- Vietnam: `vietstock.vn`, `cafef.vn`, `vneconomy.vn`, `vnexpress.net`, `sjc.com.vn`

### URL cần WebFetch verify BẮT BUỘC trước khi ghi file
- **Item ⭐ / nổi bật nhất của mỗi topic** — luôn verify (đằng nào cũng phải WebFetch để viết section Chi tiết) vì user sẽ click đầu tiên.
- **Mọi URL thuộc domain ngoài allowlist** — đặc biệt:
  - Blog cá nhân / medium.com / substack.com
  - Dev platform posts: `dev.to/*`, `medium.com/@*`, `hashnode.com/*` (URL cá biệt dễ fabricate)
  - Company blog không nổi tiếng (random `.ai`, `.io`, `.dev`)
  - Aggregator/comparison sites (`*compare*`, `*vs*`, `*best*`)
  - Listicle/SEO sites (`*top-*`, `*complete-guide*`)

Verify bằng WebFetch với prompt `"Does this page exist? Title? If 404 say so."` — tối đa 6-8 URL parallel. URL 404 → **xóa item** hoặc **thay URL khác verified**.

### Quy tắc chung
- **Mỗi item có 1 URL cụ thể từ WebSearch.** Không sửa, không rút gọn, không đoán slug.
- **Cấm bịa/đoán URL.** Không viết URL dạng `example.com/blog/something` dù đoán hợp lý.
- **Cấm tái sử dụng 1 URL chung** cho nhiều fact khác nhau. Mỗi fact có URL riêng hoặc gộp thành 1 entry.
- **Claim không URL rõ → bỏ claim.** Ít item thật > nhiều item sai.
- **Ngày/số/phiên bản** — chỉ ghi nếu snippet nêu rõ. Không chắc → bỏ số.

### Self-check cuối (mỗi agent bắt buộc làm trước khi Write file của mình)
1. Liệt kê mọi URL trong file.
2. Đánh dấu URL nào thuộc allowlist.
3. Verify WebFetch song song các URL không thuộc allowlist + item ⭐.
4. URL 404 → fix hoặc xóa item.
5. Chỉ ghi file sau khi 100% URL đã pass check.

## Nội dung

- **Topic không có tin → không tạo file**, không viết "không tìm thấy tin". (Trừ `tai-chinh-vn.md` luôn có.)
- Mỗi file topic **3-5 item**, ưu tiên chất lượng. Shopify: **5-7 item** nếu nhiều tin tốt.
- **Ít item có Chi tiết sâu > nhiều item 1 dòng.** Mỗi file phải có ít nhất 1 item ⭐ được WebFetch bài gốc và viết **Chi tiết** 3-5 bullet thật (số liệu, pattern, trade-off, kết luận). Đây là điểm "nổi bật" của file — không được bỏ.
- Web Dev + System Design: ưu tiên bài có concept/pattern rõ, không listicle.
- **Bắt buộc giải thích "đây là gì"** cho mỗi item: định nghĩa thuật ngữ/framework/công ty nếu user có thể chưa biết. Không viết "Hydrogen 2026.4.0 ra" mà không nói Hydrogen là gì.
- Tóm tắt đủ để user quyết định click, không copy nguyên đoạn.
- Section **Chi tiết** chỉ chứa nội dung đã đọc được từ WebFetch/snippet — không suy diễn thêm.

## Filter dedupe

- Main agent scan file 7 ngày qua, nhúng list URL/tiêu đề đã xuất hiện vào prompt từng agent theo topic.
- Mỗi agent so khớp tin tìm được với list đó. Trùng → **bỏ hẳn khỏi file**, không ghi chú.
- Cùng chủ đề nhưng cũ >7 ngày → có thể giữ nếu có góc nhìn mới, ghi chú "(đã note tuần trước)".

## Context Joy Loyalty

- Khi tóm tắt tin Shopify/Firebase/GCP/web dev → luôn thêm 1 câu "impact với Joy Loyalty / code daily".
- Không bias TypeScript — user dùng JavaScript thuần. Code example default JS, không mặc định TS.

## Ngày

- Lấy từ `currentDate` trong system context. Không đoán.
