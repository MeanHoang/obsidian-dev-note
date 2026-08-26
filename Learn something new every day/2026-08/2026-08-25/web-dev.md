# 🌐 Web Dev & Craft — 2026-08-25

> Next.js đang biến "navigation chậm" thành lỗi hiển thị ngay trong dev, DevTools Chrome 150 mở khoá edit `@container`/`@function`, và Vite 8 đổi hẳn sang bundler Rust.

## ⭐ [Next.js 16.3: Instant Navigations](https://nextjs.org/blog/next-16-3-instant-navigations) — (nextjs.org, 25/06/2026)

**Đây là gì:** Bài giới thiệu bộ tính năng *Instant Navigations* của Next.js 16.3 — mục tiêu là làm cho app server-driven (Server Components) chuyển trang "tức thì" như SPA, thay vì click xong đứng im chờ network roundtrip.

**Chi tiết:**
- Bật bằng flag `cacheComponents: true` trong `next.config`. Khi một route `await` data trên server, bạn buộc phải chọn 1 trong 3 hướng: **Stream** (bọc `<Suspense>`, user thấy loading shell ngay), **Cache** (`'use cache'`, user thấy UI đã cache), hoặc **Block** (`export const instant = false`) để cố ý cho route chặn navigation.
- Panel mới **Instant Insights** biến navigation chậm thành *error trong development* — tức là regression về tốc độ chuyển trang bị chặn ngay lúc code, không đợi đo production.
- **Partial Prefetching** (flag `partialPrefetching: true`) đổi mô hình prefetch: trước đây Next gửi 1 request prefetch **cho mỗi link** trong viewport (sidebar 20 link chat = 20 request); giờ chỉ prefetch **1 shell dùng chung cho mỗi route** (`/chat/[id]` một shell) rồi cache ở client cả session. Bài viết nói đây cũng là nền tảng cho offline navigation trong tương lai.
- Có helper test `instant()` từ package `@next/playwright`: bọc block assertion để khẳng định phần UI nào phải hiện ra **trước khi** network trả về — chống regression bằng test thay vì cảm tính.
- Thêm **Navigation Inspector** trong Next.js DevTools: pause mọi navigation ngay tại shell để xem chính xác phần nào render tức thì, phần nào phải chờ server. Prefetch thật vẫn chỉ bật ở production.
- Trade-off được nêu thẳng: muốn instant thì phải chấp nhận Stream (user thấy skeleton) hoặc Cache (user thấy data cũ); Vercel áp dụng cho v0 và có biểu đồ thời gian navigation giảm, nhưng bài không công bố con số cụ thể. Vẫn là Preview (`npm install next@preview`), còn known issues với Safari.

**Vì sao đáng đọc:** Mô hình "Stream / Cache / Block" là một khung tư duy tốt cho bất kỳ app nào có server data, kể cả app Shopify embedded không dùng Next. **Impact với Joy Loyalty:** admin app Polaris của mình chuyển tab/route rất hay bị đứng chờ Admin API — cách phân loại từng màn hình thành "stream skeleton / cache được / chấp nhận block" và biến navigation chậm thành lỗi dev là pattern có thể bê nguyên vào React app + Firebase của Joy.

## [Next.js 16.3: AI Improvements](https://nextjs.org/blog/next-16-3-ai-improvements) — (nextjs.org, 26/06/2026)

**Đây là gì:** Phần 2 của series 16.3, tập trung vào việc làm framework "dễ đọc" cho coding agent: `next dev` tự chèn block rules vào `AGENTS.md` trỏ agent đọc docs bundled trong `node_modules/next/dist/docs/` (thay vì đọc training data cũ), 3 Skill first-party (`next-dev-loop`, `next-cache-components-adoption`, `next-cache-components-optimizer`), `agent-browser` 0.27 với React DevTools introspection, và mọi error đều có nút **Copy prompt** + trang docs riêng viết theo cấu trúc Patterns / Trade-offs / Gotchas. Docs cũng hỗ trợ append `.md` vào URL và có `/docs/llms.txt`.

**Vì sao đáng đọc:** Đây là ví dụ cụ thể nhất hiện nay về "thiết kế DX cho agent" — error message không chỉ nói sai gì mà đưa sẵn menu fix có nhãn và prompt paste-ready. **Impact với Joy Loyalty:** ý tưởng đưa docs version-matched vào repo qua `AGENTS.md` và viết error/docs nội bộ theo khuôn Patterns/Trade-offs/Gotchas áp dụng được ngay cho codebase Joy, giúp Claude Code bớt bịa API Shopify/Firebase phiên bản cũ.

## [What's new in DevTools (Chrome 150)](https://developer.chrome.com/blog/new-in-devtools-150) — (Chrome for Developers, 30/06/2026)

**Đây là gì:** Bản ghi chú tính năng DevTools đi kèm Chrome 150. Điểm chính: hỗ trợ **edit đầy đủ** các at-rule CSS `@container`, `@function`, `@counter-style` kèm code completion; agent có thể tự chụp và phân tích **V8 heap snapshot** để chẩn đoán memory leak; AI assistance panel thêm 9 widget lấy dữ liệu từ Lighthouse, Network, Sources, Performance; breakpoint được de-duplicate giữa các bundle code-split và hỗ trợ recursive source map; thêm loạt security hardening (chống self-XSS cho Live Expressions, allowlist navigation trong Recorder).

**Vì sao đáng đọc:** Edit `@container` trực tiếp trong Styles tab là thứ tiết kiệm thời gian thật khi làm responsive component. **Impact với Joy Loyalty:** widget loyalty nhúng vào theme khách hàng phải responsive theo container chứ không theo viewport — sửa `@container` live trong DevTools rút ngắn vòng lặp chỉnh UI; còn de-dupe breakpoint trên bundle code-split giúp debug app admin build ra nhiều chunk đỡ đau đầu.

## [Vite 8.0 is out!](https://vite.dev/blog/announcing-vite8) — (vite.dev, 12/03/2026)

**Đây là gì:** Vite 8 thay cả esbuild lẫn Rollup bằng **Rolldown** (bundler viết bằng Rust) làm bundler duy nhất, giữ nguyên tương thích plugin. Bài nêu build nhanh hơn 10–30x và dẫn số thực tế từ người dùng: Linear từ 46s xuống 6s, Ramp giảm 57%, Mercedes-Benz.io giảm tới 38%, Beehiiv giảm 64%. Đổi lại, install size tăng khoảng 15 MB (lightningcss ~10 MB, Rolldown ~5 MB). Yêu cầu Node 20.19+ / 22.12+ (giữ như Vite 7).

**Vì sao đáng đọc:** Đây là một trong số ít bài release có con số benchmark từ codebase thật, kèm trade-off được nói rõ (đổi dung lượng cài đặt lấy tốc độ build). **Impact với Joy Loyalty:** app Shopify embedded của mình build bằng Vite — nâng lên Vite 8 là cách rẻ nhất để cắt thời gian CI/CD trên Cloud Run mà không phải đụng vào code, chỉ cần cân nhắc image size tăng thêm ~15 MB.
