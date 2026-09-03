# 🌐 Web Dev & Craft — 2026-09-03

> Next.js 16.3 đưa "app-like" thành pattern có tên gọi, Bun 1.4 viết lại core bằng Rust, Chrome bước sang chu kỳ release 2 tuần, và một bài craft về việc xoá bớt dependency nhờ Baseline.

## ⭐ [Building App-like Experiences with Next.js 16.3](https://nextjs.org/blog/building-app-like-experiences-with-nextjs-16-3) — (Next.js Blog, 18/08/2026)
**Đây là gì:** Bài hướng dẫn dài của Vercel gom các tính năng Instant Navigations (Cache Components + Partial Prefetching) thành công thức dựng app cảm giác như SPA mà vẫn render trên server, minh hoạ qua 4 demo app open-source.
**Chi tiết:**
- Bật bằng 2 flag trong `next.config`: `cacheComponents: true` và `partialPrefetching: true`. Cache Components đảm bảo route luôn có "App Shell" hiển thị ngay; Partial Prefetching kéo shell đó về trước khi user click.
- Mặc định mỗi `<Link>` trong viewport prefetch một App Shell dùng chung cho cả route. Muốn resolve thêm `params`/`searchParams` thì thêm `prefetch={true}` — trade-off là link đó gọi server ngay khi vào viewport, nên chỉ dùng ở chỗ đáng.
- Caching + revalidate: đánh dấu hàm đọc dữ liệu bằng `'use cache'` + `cacheTag('drop-${id}')`, rồi Server Action gọi `updateTag(...)` sau khi ghi để expire đúng view bị ảnh hưởng. `cacheLife('minutes')` chỉnh độ tươi.
- Mẹo Suspense đáng chú ý: thay vì đặt các boundary song song (dễ đẩy nhau gây CLS), **lồng** boundary con vào boundary cha — vẫn chạy song song nhưng trang "settle" từ trên xuống.
- Có `useOffline` hook + `experimental.useOffline` để soft navigation/Server Action tự retry khi mất mạng (đang experimental, Vercel nói rõ chưa nên dùng production). Test bằng helper `instant()` của `@next/playwright`.
**Vì sao đáng đọc:** Pattern `'use cache'` + `cacheTag` + `updateTag` là đúng bài toán của Joy Loyalty (điểm/reward thay đổi sau mutation phải phản ánh ngay trên nhiều màn), còn `useOptimistic` + `useTransition` áp thẳng được vào các nút toggle trong UI Polaris.

## ⭐ [Bun 1.4](https://bun.com/blog/bun-v1.4) — (Bun Blog, 20/08/2026)
**Đây là gì:** Bản release lớn nhất của Bun từ trước tới nay — core runtime được viết lại bằng Rust, kèm loạt API built-in thay cho các package quen thuộc.
**Chi tiết:**
- Đây là bản đầu tiên Bun chạy trên core Rust. Bun nói Claude Code đã dùng bản này trong production.
- Số liệu: idle CPU giảm 5x, memory của HTTP server giảm 13–48%, startup nhanh hơn 2.5× trên Windows và 2× trên Linux, binary nhỏ hơn tới 17%.
- Node compat: thêm 1.517 test lấy từ test suite của Node; `node:http`, `node:fs`, `node:stream` nay pass 97% test gốc của Node.
- API mới built-in: `Bun.Image`, `Bun.WebView`, `Bun.markdown`, `Bun.cron()`, `Bun.Terminal`, cùng native `CompressionStream`/`DecompressionStream`/`TextDecoderStream`.
- Tooling: `bun install` nhanh hơn npm 15–33×; thêm `bun audit fix`, `bun dedupe`, `bun prune`; `bun test` có `--parallel`, `--isolate`, `--shard`, `--timings`, `--changed`.
**Vì sao đáng đọc:** Ngay cả khi backend vẫn ở Node/Cloud Run, dùng Bun làm test runner + package manager cho repo app Shopify có thể cắt mạnh thời gian CI mà không phải đổi runtime production.

## [How Baseline Can Help You Ship Less JavaScript](https://www.smashingmagazine.com/2026/08/how-baseline-can-help-ship-less-javascript/) — (Smashing Magazine, 07/08/2026)
**Đây là gì:** Bài craft của Jad Joubran về cách dùng Baseline như một công cụ audit `package.json`: soi xem dependency nào đã được trình duyệt hỗ trợ native và gỡ đi được.
**Chi tiết:**
- Tác giả ước tính một app JS cỡ trung có thể gỡ được khoảng 60–90KB (min+gzip) dependency mà platform đã làm thay.
- Các cụm gỡ được: i18n ~14KB (`timeago.js`, `pluralize`, `numeral` → `Intl.RelativeTimeFormat`, `Intl.NumberFormat`); HTTP client ~17KB (`axios` → `fetch` + `AbortController`); UI primitives ~24KB (modal/tooltip/focus-trap → `<dialog>`, Popover API, CSS anchor positioning); lodash ~8KB (`structuredClone`, `Object.groupBy`, Set methods).
- Khung 3 câu hỏi trước khi gỡ: có an toàn với browser của *đúng* tệp user mình không, chi phí swap thật là bao nhiêu (polyfill có thể ăn hết lợi ích), và feature native có phủ hết use case thật không.
- Ngoại lệ được nêu rõ: Temporal API tốt hơn `Date` nhưng vẫn cần polyfill 44KB tới khi Safari ship stable, nên chưa nên bỏ thư viện date.
**Vì sao đáng đọc:** App embed trong Shopify Admin bị tính từng KB vào thời gian load, và đây là checklist audit cụ thể có thể chạy ngay trên bundle hiện tại.

## [Get features faster with Chrome's two-week release cycle](https://developer.chrome.com/blog/chrome-two-week-release) — (Chrome for Developers, 03/03/2026)
**Đây là gì:** Thông báo Chrome chuyển từ chu kỳ release 4 tuần sang 2 tuần, chính thức bắt đầu từ bản stable Chrome 153 ngày 08/09/2026.
**Vì sao đáng đọc:** Feature web platform sẽ tới tay user nhanh gấp đôi, nhưng cũng có nghĩa cửa sổ test hồi quy của app Shopify hẹp lại — nên bắt đầu theo dõi kênh Beta (ship trước stable 3 tuần) thay vì đợi stable.

## [Chrome 153 beta](https://developer.chrome.com/blog/chrome-153-beta) — (Chrome for Developers, 20/08/2026)
**Đây là gì:** Bản beta đầu tiên của chu kỳ 2 tuần, mang theo vài bổ sung CSS và JS iterator đáng chú ý.
**Vì sao đáng đọc:** `scroll-axis-lock` và `overflow` hỗ trợ giá trị scrollable kèm `clip` giải quyết đúng nhóm bug scroll/`position: sticky` hay gặp trong layout bảng dài của admin app; phía JS có Iterator Join và Joint Iteration (kiểu "zip") giảm nhu cầu helper tự viết.
