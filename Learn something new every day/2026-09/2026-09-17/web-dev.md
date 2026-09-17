# 🌐 Web Dev & Craft — 2026-09-17

> Hôm nay: bài "đập lại" tư duy container queries của Smashing, Node.js 26.9.0 với `node:bench` built-in, playbook app-like UX của Next.js 16.3, và Bun 1.4 viết lại bằng Rust.

## ⭐ [Stop Treating CSS Container Queries Like Traditional Media Queries](https://www.smashingmagazine.com/2026/09/stop-treating-css-container-queries-traditional-media-queries/) — (Smashing Magazine, Victor Ayomipo, 16/09/2026)

**Đây là gì:** Bài phân tích vì sao rất nhiều dev viết container query y hệt media query — chỉ đổi `@media` thành `@container` — và tại sao cách nghĩ đó làm mất gần hết giá trị của container queries. Container query hỏi "component này đang được cấp bao nhiêu chỗ", không phải "viewport rộng bao nhiêu".

**Chi tiết:**
- Khác biệt gốc về phạm vi: media query nhìn viewport (macro, layout cấp trang), container query nhìn không gian được cấp cho một component cụ thể (micro, layout cấp component). Bài trích Kevin Powell: media query "don't know very much" về nội dung bên trong component.
- Yêu cầu wrapper: container query cần quan hệ cha–con, một element **không thể query chính nó**. Nên component muốn được query phải có thêm 1 wrapper — media query thì viết ở đâu trong block cũng chạy.
- Use case media query không làm được: phát hiện **flex wrap** / thay đổi layout nội bộ mà không cần JavaScript (kiểu hành vi `ResizeObserver`), vì media query không quan sát được state bên trong component.
- Typography: các unit `cqi`, `cqw` cho phép font scale theo kích thước component thay vì theo viewport — đây là thứ làm component thật sự "portable" khi nhét vào sidebar, modal hay full-width.
- Bẫy lớn: query theo `size` (chiều cao / block size) có thể làm layout sập về 0px nếu container không set height tường minh — bài khuyên mặc định dùng `inline-size` cho an toàn.
- Giới hạn: container query **không dùng được CSS custom properties** trong điều kiện query, do rắc rối cascade và nguy cơ vòng lặp vô hạn.
- Khung quyết định: container query cho component tái sử dụng ở nhiều ngữ cảnh; media query giữ lại cho element cấp trang phụ thuộc trực tiếp vào kích thước viewport.

**Vì sao đáng đọc:** Đây đúng bài toán của widget loyalty — cùng một block "điểm thưởng / tier / reward list" bị nhúng vào sidebar, product page, cart drawer, popup với chiều rộng khác nhau hoàn toàn. Dùng breakpoint viewport sẽ luôn sai ở ít nhất một chỗ; chuyển sang `@container` + `cqi` là cách để widget Joy tự đúng ở mọi theme của merchant mà không cần JS đo đạc.

## [Node.js 26.9.0 (Current)](https://nodejs.org/en/blog/release/v26.9.0) — (nodejs.org, 16/09/2026)

**Đây là gì:** Bản Current mới nhất của Node, mang khá nhiều SEMVER-MINOR đáng chú ý: module benchmark built-in `node:bench` (kèm histogram `meanCI` API và export/import CBOR để trao đổi histogram), module FFI nay **bật mặc định** (trước là experimental), API DTLS thử nghiệm, Virtual File System (VFS) tích hợp với cả CommonJS lẫn ESM loader + ZipProvider, hỗ trợ Web Workers API native (có ref/unref), và nhóm crypto mới: generic MAC API, discovery cipher/hash từ OpenSSL providers. Kèm nhiều fix hiệu năng cho stream, fs (`cp`, glob options), HTTP/HTTP2, SQLite session.

**Vì sao đáng đọc:** `node:bench` có nghĩa là đo hiệu năng một hàm JS (ví dụ logic tính điểm, parse webhook Shopify) không còn cần kéo về `benchmark`/`tinybench` — viết bench ngay trong repo bằng JS thuần. Lưu ý: 26.x là nhánh **Current**, không phải LTS — Cloud Run / Cloud Functions của Joy nên vẫn bám nhánh 24 LTS, coi đây là preview những gì sắp xuống LTS.

## [Building App-like Experiences with Next.js 16.3](https://nextjs.org/blog/building-app-like-experiences-with-nextjs-16-3) — (nextjs.org, Aurora Scharff, 18/08/2026)

**Đây là gì:** Bài tổng hợp pattern (kèm 4 demo app open-source: Next Beats, Drop, Flow, Huddle) cho thấy cách ghép Instant Navigations (Cache Components + Partial Prefetching), `'use cache'` + `cacheTag`/`cacheLife`, `updateTag` trong Server Action, Suspense **lồng nhau** để trang "settle" từ trên xuống thay vì nhảy layout, `useTransition` + `useOptimistic` cho mutation, SWR/TanStack Query preload từ Server Component, và `<ViewTransition>` của React cho reveal/morph/page transition. Có cả `useOffline` (experimental) để soft navigation treo chờ rồi tự retry khi mất mạng.

**Vì sao đáng đọc:** Phần optimistic update (`useOptimistic` + `useTransition`, rollback về giá trị confirmed khi Action fail) và pattern nested Suspense chống CLS áp thẳng được vào Joy: nút "Redeem" / "Claim reward" nên đổi UI ngay rồi rollback nếu API trả lỗi, thay vì để merchant nhìn spinner. Code trong bài là TS nhưng bỏ type đi là JS chạy y nguyên.

## [Bun 1.4](https://bun.com/blog/bun-v1.4) — (bun.com, 20/08/2026)

**Đây là gì:** Bản major của Bun, viết lại toàn bộ runtime từ Zig sang Rust trong khi giữ nguyên chức năng. Thêm API built-in: `Bun.Image` (xử lý ảnh), `Bun.WebView` (headless browser automation), `Bun.markdown`. Chạy thêm 1.517 test từ Node.js test suite cho phần tương thích. Hiệu năng: giảm CPU lúc idle 5x, giảm memory tới 35%, khởi động trên Linux nhanh hơn 50%. Tooling: test và script chạy song song, profiling `--cpu-prof-md` / `--heap-prof-md`, thêm `bun audit fix`, `bun dedupe`, `bun prune` — và "15 dependencies now built in".

**Vì sao đáng đọc:** Ngay cả khi production Joy vẫn chạy Node trên Cloud Run, Bun đáng dùng làm test runner / script runner local: test song song + startup nhanh cắt thẳng vòng lặp feedback khi viết logic earning rule. `bun audit fix` và `bun dedupe` cũng là cách rẻ để dọn cây dependency của app Shopify trước khi build image.
