# 🌐 Web Dev — 2026-07-03

> Tuần này xoay quanh "agent-driven development": Next.js 16.3 thiết kế lại error/docs cho AI agent, React Compiler viết lại bằng Rust, cùng update về đo lường hiệu năng cho SPA.

## ⭐ [Next.js 16.3: AI Improvements](https://nextjs.org/blog/next-16-3-ai-improvements) — (nextjs.org)
**Đây là gì:** Bản 16.3 định hình lại Next.js cho luồng làm việc với AI agent (Claude Code, Cursor, Codex) — thay vì chỉ để con người đọc lỗi, giờ lỗi và docs được viết để agent tự đọc, tự sửa, tự verify.
**Chi tiết:**
- **AGENTS.md tự động:** `next dev` tự chèn con trỏ tới docs bản-đúng-version trong `node_modules/next/dist/docs/`, chặn agent viết code dựa trên training data cũ đã lỗi thời.
- **Actionable errors:** Mỗi lỗi (vd `fetch()` uncached ngoài `<Suspense>`) hiện menu 3 lựa chọn có trade-off rõ — **Stream** (`<Suspense>`), **Cache** (`"use cache"`), **Block** (`export const instant = false`) — kèm nút **Copy prompt** đóng gói sẵn prompt paste thẳng cho agent.
- **First-party Skills:** `next-dev-loop` (agent tự drive browser, đọc console/network, xem React tree sau mỗi edit), `next-cache-components-adoption`, `next-cache-components-optimizer`.
- **Docs as Markdown:** thêm `.md` vào bất kỳ URL docs nào để lấy bản markdown thuần; có `/docs/llms.txt` theo chuẩn llms.txt.
**Vì sao đáng đọc:** Joy Loyalty embedded app cũng nên đi theo pattern này — viết error message + docs nội bộ để agent tự sửa; nút "Copy prompt" và AGENTS.md version-matched là mẫu tốt để áp cho codebase Firebase/React của team.

## [React Compiler viết lại bằng Rust — build nhanh 20-50%](https://nextjs.org/blog/next-16-3-turbopack) — (nextjs.org)
**Đây là gì:** React team port toàn bộ compiler (vốn viết bằng TypeScript, chạy như Babel plugin) sang Rust, và Vercel nhúng thẳng vào Turbopack. React Compiler tự memoize component, giảm re-render thừa mà không cần sửa code tay.
**Chi tiết:**
- Bật bằng flag experimental `turbopackRustReactCompiler` trong Next.js 16.3 (dùng cùng Turbopack).
- Test sớm trên app React lớn (như v0) cho thấy compile nhanh hơn 20-50% end-to-end.
**Vì sao đáng đọc:** React Compiler bỏ được phần lớn `useMemo`/`useCallback` thủ công trong UI Polaris của Joy Loyalty — hiểu compiler làm gì giúp dọn code memoization thừa, còn bản Rust rút ngắn thời gian build/HMR khi dev.

## [Đo Core Web Vitals cho SPA: Soft Navigations Origin Trial (Chrome 147)](https://developer.chrome.com/blog/final-soft-navigations-origin-trial) — (developer.chrome.com)
**Đây là gì:** "Soft navigation" là khi JS chặn click link và đổi nội dung + URL mà không reload trang (kiểu SPA). Trước đây LCP/INP/CLS chỉ được browser phát ra theo "hard navigation", nên các lần chuyển trang trong SPA gần như không đo được. Origin trial cuối chạy từ Chrome 147 → 149 trước khi release chính thức cuối 2026.
**Chi tiết:**
- Thêm performance entry `SoftNavigationEntry` và `InteractionContentfulPaint`, cùng thuộc tính `navigationId` để gán đúng metric cho đúng lần điều hướng.
- Cho phép đo LCP, CLS, INP, FCP trên từng soft navigation — điều trước đây không làm được ở quy mô lớn.
**Vì sao đáng đọc:** App embedded trong Shopify admin điều hướng kiểu SPA, nên metric CWV thật của các màn hình loyalty sẽ được RUM đo chính xác hơn thay vì chỉ tính lần load đầu.

## [Bun 1.3.13 / 1.3.14: test runner song song + hạ tầng nhanh hơn](https://bun.com/blog) — (bun.com)
**Đây là gì:** Bun ra loạt bản 1.3.x với trọng tâm test runner và tốc độ cài đặt, thay vì nhảy lên 2.0.
**Chi tiết:**
- `bun test` thêm `--parallel`, `--isolate`, `--shard` (chia test qua nhiều máy) và `--changed` (chỉ chạy test của file đổi) — v1.3.13, 20/04/2026.
- v1.3.14 (13/05/2026): `Bun.Image` (xử lý ảnh built-in), install warm nhanh gấp 7x nhờ isolated linker global store, client HTTP/2 & HTTP/3 experimental.
- Các bản trước: gzip nhanh 5.5x (zlib-ng), `Bun.cron()` scheduler in-process.
**Vì sao đáng đọc:** `--changed` + `--shard` cắt mạnh thời gian CI cho test suite JS thuần; `Bun.Image` có thể thay pipeline resize ảnh cho asset loyalty mà không cần lib ngoài.
