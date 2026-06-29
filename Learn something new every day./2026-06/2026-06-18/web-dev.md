# 🌐 Web Dev & Craft — 2026-06-18

> CSS có conditional logic inline với `if()`, Vite 8 chuyển hẳn sang bundler Rust Rolldown, Node.js 26 + Bun đẩy mạnh "native-first" giảm phụ thuộc — toolchain JS ngày càng nhanh và ít dependency hơn.

## ⭐ [CSS conditionals với hàm `if()` mới](https://developer.chrome.com/blog/if-article) — (Chrome for Developers)
**Đây là gì:** `if()` là hàm CSS cho phép gán giá trị property khác nhau ngay inline dựa trên một điều kiện — style query, media query, hoặc feature query — thay vì phải tách logic ra nhiều block CSS riêng.
**Chi tiết:**
- Cú pháp dùng các cặp condition-value, phân tách bằng dấu `;`, có nhánh `else`:
  ```css
  button {
    aspect-ratio: 1;
    /* mouse precision → 30px, còn lại (touch) → 44px */
    width: if(media(any-pointer: fine): 30px; else: 44px);
  }
  ```
- 3 loại điều kiện: `style()` (kiểm tra giá trị custom property hiện tại), `media()` (media query inline), `supports()` (feature query inline). Có thể nối nhiều cặp: `if(cond-1: val-1; cond-2: val-2; else: val-fallback)`.
- Hỗ trợ từ Chrome 137 (bài gốc Chrome dev, 2025-07-01); Firefox đang triển khai, Safari trên roadmap 2026–2027 → **chưa Baseline**. Khuyến nghị viết giá trị default an toàn trước, layer `if()` đè lên sau `@supports` để progressive enhancement.
- Use case mạnh nhất: đọc một custom property rồi đổi nhiều property theo nó (ví dụ một biến `--variant: primary` quyết định màu nền + màu chữ + border) mà không cần class trung gian hay JS.
**Vì sao đáng đọc:** Joy Loyalty build UI bằng Polaris/React, nhiều component biến thể (badge tier, nút trạng thái) đang phải nhồi class hoặc inline style theo state — `if()` cho phép gom logic style vào CSS, giảm prop điều kiện. Nhưng vì chưa Baseline, hiện chỉ nên dùng cho enhancement không critical trên admin Shopify (Chromium-heavy), luôn giữ fallback.

## [Vite 8 ra mắt — một bundler Rust duy nhất Rolldown](https://vite.dev/blog/announcing-vite8) — (vite.dev)
**Đây là gì:** Vite 8 thay kiến trúc 2-bundler cũ (esbuild cho dev + Rollup cho production) bằng một bundler Rust thống nhất là **Rolldown** dùng cho cả dev lẫn build, mà vẫn tương thích plugin Rollup hiện có.
**Vì sao đáng đọc:** Build nhanh 10–30x, số liệu thực tế: Linear 46s → 6s, Beehiiv giảm 64%, Ramp giảm 57%. Yêu cầu Node 20.19+/22.12+ (không đổi so với Vite 7). Có thêm `resolve.tsconfigPaths` resolve path alias built-in và `server.forwardConsole` đẩy log browser về terminal dev — nếu repo frontend của Joy Loyalty đang dùng Vite, đây là nâng cấp giảm thời gian CI build đáng kể, nhưng nên test kỹ plugin custom trước khi lên production.

## [Node.js 26.2.0 (Current)](https://nodejs.org/en/blog/release/v26.2.0) — (nodejs.org)
**Đây là gì:** Bản phát hành Current của Node.js 26 (2026-05-20), tiếp tục hướng "native-first" — bổ sung khả năng cho test runner, crypto và stream tích hợp sẵn để giảm dependency ngoài.
**Vì sao đáng đọc:** Test runner `node:test` nay thêm `tags` option + filter theo tag-name (chạy có chọn lọc subset test), `stream.compose` đã stable, thêm hỗ trợ ML-DSA/ML-KEM (post-quantum) và AES-KW trong Web Crypto. Với backend Cloud Run của Joy Loyalty chạy Node thuần, việc dùng `node:test` built-in giúp bỏ Jest/dependency test nặng — nhẹ container hơn, cold start nhanh hơn; lưu ý `node:test` vẫn thiếu watch mode/snapshot polish của Vitest nên cân nhắc theo loại service.

## [Bun v1.3.14 — Bun.Image + isolated linker nhanh 7x](https://bun.com/blog/bun-v1.3.14) — (bun.com)
**Đây là gì:** Bản Bun v1.3.14 (2026-05-13) bổ sung `Bun.Image` (API xử lý ảnh built-in) và tối ưu package manager qua isolated linker với global store.
**Vì sao đáng đọc:** `Bun.Image` xử lý JPEG/PNG/WebP/AVIF/HEIC với transform chainable (resize/rotate/flip), benchmark ~70x nhanh hơn `sharp` cho việc đọc metadata — hữu ích nếu xử lý ảnh logo/banner reward. Isolated linker materialize package một lần vào store chung rồi symlink, cho warm install nhanh ~7x (115ms vs 841ms trên Apple Silicon) → vòng lặp `bun install` trong CI/dev nhanh hơn rõ. Vẫn nên coi đây là runtime để thử nghiệm tooling/script, chưa thay Node trên Cloud Run production.

## [Scroll-driven animations: reveal-on-scroll thuần CSS, không JS](https://www.smashingmagazine.com/2024/12/introduction-css-scroll-driven-animations/) — (Smashing Magazine)
**Đây là gì:** Bộ tính năng CSS gắn animation vào tiến trình scroll thay vì timeline thời gian, dùng `scroll-timeline` (theo vị trí scroll của container — progress bar, parallax) và `view-timeline` (theo độ hiển thị của element trong viewport — hiệu ứng reveal khi cuộn vào).
**Vì sao đáng đọc:** Animation chạy off-main-thread (trên compositor), GPU-accelerated, không cần thư viện JS hay scroll event listener gây jank. Với widget loyalty hiển thị tiến trình tích điểm / unlock tier trên storefront, đây là cách làm hiệu ứng mượt mà không tốn JS bundle — đúng tinh thần giảm dependency. Lưu ý kiểm tra support trước khi dùng cho UI critical (luôn để trạng thái tĩnh làm fallback).
