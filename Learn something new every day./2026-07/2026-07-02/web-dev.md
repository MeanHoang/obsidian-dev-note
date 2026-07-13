# 🌐 Web Dev — 2026-07-02

> Next.js xóa nhòa ranh giới SPA/server với Instant Navigations, Baseline 2026 chốt loạt CSS/JS mới, và Node 26 mang Temporal API vào runtime mặc định.

## ⭐ [Next.js 16.3: Instant Navigations](https://nextjs.org/blog/next-16-3-instant-navigations) — (nextjs.org)
**Đây là gì:** Bộ tính năng opt-in (Preview) đưa cảm giác "instant" của SPA vào app server-driven của Next.js, giải bài toán "click link → đứng hình → chờ server" của Server Components.
**Chi tiết:**
- Bật qua flag `cacheComponents: true`. Mỗi route khi `await` data trên server có 3 lựa chọn: **Stream** với `<Suspense>` (hiện loading shell ngay), **Cache** với `'use cache'` (tái dùng UI đã cache), hoặc **Block** bằng `export const instant = false` (giữ hành vi chờ server cũ).
- **Partial Prefetching** (`partialPrefetching: true`): thay vì prefetch 1 request/link (sidebar 20 chat link = 20 request), Next.js giờ prefetch 1 "shell" tái dùng **per route** và cache ở client — mượn ý tưởng per-route code splitting của SPA. Muốn prefetch sâu hơn thì dùng `<Link prefetch={true}>` + `'use cache'`.
- Dev tooling: **Instant Insights** biến navigation chậm thành lỗi ngay trong dev; **Navigation Inspector** trong DevTools cho pause navigation tại shell để xem phần nào hiện tức thì; helper `instant()` cho Playwright để assert nội dung visible ngay sau click mà không chờ network.
- Còn behind feature flag, đã dùng nội bộ trên v0; cài thử bằng `npm install next@preview`. Có known issue với Instant Insights trên Safari (dev nên dùng Chrome/Firefox).
**Vì sao đáng đọc:** Joy Loyalty nếu chạy React SPA embed trong Shopify admin có thể học pattern "shell per route + cache" để navigation trong dashboard loyalty mượt hơn; mô hình Stream/Cache/Block cũng là khung tư duy tốt cho việc quyết định phần nào của UI cần render tức thì vs chờ data.

## ⭐ [Web Platform Baseline 2026](https://web.dev/baseline/2026) — (web.dev)
**Đây là gì:** Tập hợp các tính năng web đạt trạng thái "Newly available" trong 2026 — nghĩa là đã có mặt trên tất cả trình duyệt chính, an toàn để dùng mà không cần lo polyfill nhiều.
**Chi tiết:**
- HTML/CSS: **Container style queries**, selector `:open`, hàm `contrast-color()` (tự chọn màu chữ tương phản), Custom Highlights, hàm `shape()`, active view transitions, và nhóm relative unit mới (`rcap`, `rch`, `rex`, `ric`).
- JS/Web API: `Math.sumPrecise()`, `Iterator.concat()`, WebTransport, Trusted Types, Navigation API, `Map.prototype.getOrInsert()`, và JavaScript modules chạy trong service worker / shared worker.
- Nhiều tính năng trong nhóm này trước đây phải dùng thư viện thay thế (vd `contrast-color()` thay tính toán màu bằng JS, Navigation API thay router thủ công) — Baseline giúp giảm dependency trong `package.json`.
**Vì sao đáng đọc:** Với stack JS thuần + Polaris, `contrast-color()` và container style queries có thể thay thế nhiều logic style tính bằng JS trong widget loyalty; `Map.getOrInsert()` gọn hơn pattern `if (!map.has(k)) map.set(...)` hay dùng khi gom điểm/tier.

## [Node.js 26.0.0 (Current)](https://nodejs.org/en/blog/release/v26.0.0) — (nodejs.org)
**Đây là gì:** Bản major Node mới (5/5/2026) tập trung hiện đại hóa runtime: Temporal API bật mặc định, V8 14.6, Undici 8, và loạt deprecation mới.
**Vì sao đáng đọc:** **Temporal API** (không cần flag) cho immutable date/time, xử lý timezone tường minh và date arithmetic dự đoán được — cực hữu ích cho Firebase Cloud Functions / Cloud Run của Joy Loyalty khi tính thời hạn điểm thưởng, campaign expiry hay lịch theo timezone của merchant mà không cần kéo `date-fns`/`luxon`. V8 14.6 cũng mang `Map.getOrInsert()` và `Iterator.concat()` vào runtime server-side.
