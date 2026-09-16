# 🌐 Web Dev & Craft — 2026-09-15

> Tuần này toolchain JS nhích mạnh: Bun 1.4.1 tối ưu runtime + bundler, Chrome chuyển sang chu kỳ release 2 tuần, Node 24 LTS lên 24.21.0, còn Vercel kể chuyện cắt 91% latency lookup metadata CDN.

## ⭐ [Bun v1.4.1](https://bun.com/blog/bun-v1.4.1) — (Bun blog, 04/09/2026)
**Đây là gì:** Bản minor của Bun tập trung vào 3 mảng: runtime performance, bundler/tree-shaking và package manager. Đây là bản đầu tiên sau Bun 1.4 (bản viết lại bằng Rust).
**Chi tiết:**
- `Bun.serve` hỗ trợ HTTP/2 chạy song song HTTP/1.1 trên cùng một port, tự negotiate bằng ALPN khi có TLS.
- Buffer read/write nhanh "up to 9x" nhờ JIT inlining; `AsyncLocalStorage` nhanh ~2x do giảm allocation mỗi lần `await`; inspect object lớn nhanh 43x (từ độ phức tạp bậc hai xuống tuyến tính).
- Tree-shaking hiểu pattern `export * as` — bài viết nêu bundle của zod giảm 79%; dynamic import cũng bị tree-shake để loại export không dùng.
- Code splitting sinh ít chunk hơn và nhỏ hơn, thêm cờ `--min-chunk-size` để gộp chunk vụn, và tự phát `<link rel="modulepreload">` để fetch chunk song song.
- `Bun.write()` giờ stream thẳng body của Response/Request xuống disk thay vì buffer toàn bộ; thêm `crypto.argon2()` / `argon2Sync()`; `bun install --offline` và `--prefer-offline`.
**Vì sao đáng đọc:** Nếu Joy Loyalty còn chạy script build/test/CLI bằng Node, phần tree-shaking + `--min-chunk-size` là lý do thực tế để thử Bun cho bundle widget — bundle nhỏ hơn đồng nghĩa storefront load nhanh hơn; còn `AsyncLocalStorage` nhanh 2x rất hợp với pattern request-context/logging ở backend.

## [Get features faster with Chrome's two-week release cycle](https://developer.chrome.com/blog/chrome-two-week-release) — (Chrome for Developers)
**Đây là gì:** Chrome đổi từ chu kỳ 4 tuần sang 2 tuần, bắt đầu từ bản stable Chrome 153 ngày 08/09/2026 — cứ 2 tuần có một beta và một stable mới trên Desktop, Android, iOS. Extended Stable vẫn giữ chu kỳ 8 tuần cho enterprise. Beta ship trước stable 3 tuần, nên đội dev được khuyến nghị test trên Chrome Beta.
**Vì sao đáng đọc:** Widget loyalty nhúng vào storefront khách hàng giờ phải chịu nhịp thay đổi trình duyệt gấp đôi — nên đưa việc smoke-test trên Chrome Beta vào lịch đều đặn thay vì đợi báo lỗi từ merchant.

## [How we cut CDN metadata lookup latency by 91%](https://vercel.com/blog/how-we-cut-cdn-metadata-lookup-latency-by-91-percent) — (Vercel, 10/09/2026)
**Đây là gì:** Bài engineering kể cách Vercel thay việc fetch metadata từng path bằng cách gom path thành "shard" ~200 KB, mỗi shard là JSONL xen kẽ path + metadata kèm index inline để binary search O(log n) mà không phải parse cả shard. Shard quá lớn thì LRU miss chậm, quá nhỏ thì tăng regional cache miss — 200 KB là điểm cân bằng đo được từ production. Bỏ bước upload metadata per-path còn cắt ~16.6 giây khỏi deploy.
**Vì sao đáng đọc:** Một case study sạch về pattern batching + index để đổi nhiều round-trip nhỏ lấy một lần fetch — áp thẳng được vào chỗ đọc Firestore theo từng document lẻ trong hot path của app.

## [Node.js 24.21.0 (LTS)](https://nodejs.org/en/blog/release/v24.21.0) — (nodejs.org, 08/09/2026)
**Đây là gì:** Bản LTS 'Krypton' mới. Đáng chú ý: tối ưu parse WHATWG URL và `URLSearchParams`, `readFileUtf8` dùng sized read cho file lớn, cải thiện hiệu năng `net.BlockList`, thêm `util.MIMEType.parse()` dạng non-throwing, OpenSSL lên 3.5.8, undici 7.29.1.
**Vì sao đáng đọc:** `util.MIMEType.parse()` không throw là thứ dùng ngay khi validate content-type của webhook/upload mà không cần bọc try/catch; còn URL parsing nhanh hơn có lợi cho service xử lý nhiều query param như Shopify Admin API pagination.

## [The Death Of The Button: Why The Best Interface Is No Interface](https://www.smashingmagazine.com/2026/09/death-button-why-best-interface-is-no-interface/) — (Smashing Magazine, 09/09/2026)
**Đây là gì:** Carrie Webster lập luận UI đang dịch từ point-and-click sang "Intent-Driven Design": người dùng nói mục tiêu, hệ thống tự thực thi. Bài nêu 3 trụ cột (high-level goal, generative UI, autonomous execution) và 2 rủi ro là "illusion of control" và "black box problem" khi user không hiểu AI quyết định thế nào.
**Vì sao đáng đọc:** Đúng câu hỏi thiết kế cho admin app loyalty: thay vì bắt merchant click qua 5 form để dựng earning rule, cho họ mô tả mục tiêu — nhưng phải giữ được phần "hiện lại cho user thấy hệ thống sắp làm gì" để tránh black box.
