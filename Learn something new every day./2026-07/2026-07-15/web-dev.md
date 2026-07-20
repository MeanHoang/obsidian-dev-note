# 🌐 Web Dev — 2026-07-15

> Tuần này xoay quanh tooling performance: Turbopack cắt 90% RAM dev + tích hợp Rust React Compiler, cộng với loạt web-platform mới (Baseline 2026, web UI 2026).

## ⭐ [Turbopack: What's New in Next.js 16.3](https://nextjs.org/blog/next-16-3-turbopack) — (nextjs.org, 29/06/2026)
**Đây là gì:** Turbopack là bundler viết bằng Rust, tích hợp sẵn trong Next.js (thay webpack). Bản 16.3 tập trung vào giảm CPU/RAM và tăng tốc build, cộng thêm bản Rust của React Compiler.
**Chi tiết:**
- **Giảm RAM dev tới ~90%:** nhờ cơ chế *memory eviction* — đẩy cache đã tính ra đĩa (dựa trên filesystem cache có từ 16.1) thay vì giữ hết trong RAM. Ví dụ dashboard vercel.com: 21.5 GB → 2 GB; nextjs.org: 4,600 MB → 840 MB. Bật mặc định ở 16.3, tắt bằng `experimental.turbopackMemoryEviction: false`.
- **Persistent FS cache cho `next build`:** cache trên đĩa giúp build kế thừa công việc trước đó — nextjs.org nhanh ~2.3×, vercel.com/geist ~5.5× (30s → 5.5s). Bật bằng `experimental.turbopackFileSystemCacheForBuild: true`. CI có thể copy thư mục `.next` giữa các lần chạy để tận dụng.
- **Rust React Compiler (experimental):** trước đây React Compiler chỉ chạy qua Babel transform (chậm khi tranh chấp tài nguyên JS). Bản Rust native được nhúng thẳng vào Turbopack, thử nghiệm trên app lớn như v0 cho lợi 20–50% thời gian compile. Bật `reactCompiler: true` + `experimental.turbopackRustReactCompiler: true`.
- Thêm `import.meta.glob` (kiểu Vite) để import hàng loạt module theo pattern, và cắt >15% cold-start dev nhờ gộp HMR subscription.
**Vì sao đáng đọc:** App Joy Loyalty (React/Polaris) build trong CI mỗi lần deploy — persistent FS cache + memory eviction đánh trực tiếp vào 2 điểm đau: RAM máy dev (khi chạy song song agent/IDE/typecheck) và thời gian build CI. Rust React Compiler nghĩa là bỏ dần `useMemo`/`useCallback` thủ công mà không phải trả giá build chậm.

## [Baseline 2026 — tập tính năng web mới an toàn dùng](https://web.dev/baseline/2026) — (web.dev)
**Đây là gì:** Baseline là nhãn "an toàn dùng cross-browser" của web platform. Trang Baseline 2026 gom các tính năng CSS/JS/Web API đạt độ phủ trình duyệt ổn định trong năm.
**Chi tiết:**
- CSS: container **style queries**, selector `:open`, hàm `contrast-color()`, `shape()`, active view transitions, nhóm đơn vị font-relative mới `rcap`/`rch`/`rex`/`ric`.
- JS/Web API: `Math.sumPrecise()`, `Iterator.concat()`, `Map.getOrInsert()`, Zstandard compression, Navigation API, JS modules trong service/shared worker, Trusted Types.
**Vì sao đáng đọc:** Danh sách "được phép bỏ polyfill/prefix" giúp mạnh dạn dùng native trong widget Joy Loyalty embed trên storefront — ví dụ `contrast-color()` cho contrast tự động theo màu brand merchant, hay container style queries cho component adaptive.

## [What's new in web UI (2026)](https://developer.chrome.com/blog/new-in-web-ui-io26) — (developer.chrome.com, 01/07/2026)
**Đây là gì:** Tổng hợp 35 tính năng UI mới của web platform, sắp theo 5 nguyên tắc UX (tôn trọng preference người dùng, tương tác tự nhiên, điều hướng, tối ưu nội dung, thích ứng form factor).
**Chi tiết:**
- **Respect preferences:** `contrast-color()`, at-rule `@function` (hàm CSS tự định nghĩa), hàm `if()` inline conditional, container style queries.
- **Tương tác tự nhiên:** easing `linear()`, `@starting-style` + `transition-behavior: allow-discrete` cho entry animation, `sibling-index()`/`sibling-count()` cho stagger delay động, `dialog[closedby]` cho light-dismiss.
- **Điều hướng & nội dung:** view transitions (same/cross-document, element-scoped), `scroll-target-group: auto` (scroll-spy thuần CSS), scroll-state queries cho "hidey bar", `moveBefore()` reparent giữ nguyên state DOM.
**Vì sao đáng đọc:** Nhiều pattern loyalty UI (modal reward, progress bar tier, sticky bar điểm) đang phải viết JS thủ công — `@starting-style`, `closedby`, `sibling-index()` cho phép làm bằng CSS thuần, giảm bundle JS cho widget nhúng vào storefront merchant.
