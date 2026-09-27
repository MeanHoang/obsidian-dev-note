# 🌐 Web Dev & Craft — 2026-09-27

> Tuần này nổi bật về CSS/UI: iframe tự resize theo nội dung (Chrome 154) và cách dùng container queries cho đúng; thêm bản vá Node 22 LTS và một mẹo publish package npm gọn hơn.

## ⭐ [New in Chrome 154: iframes that automatically resize themselves to their content](https://www.bram.us/2026/09/23/responsive-iframes/) — (bram.us)
**Đây là gì:** "Responsively-sized iframes" là tính năng mới trong Chrome 154: `<iframe>` tự co giãn theo kích thước nội dung của document bên trong, không cần hack `postMessage` + tự set height bằng JS như trước.
**Chi tiết:**
- Phía trang nhúng (embedder) bật bằng CSS: `iframe { frame-sizing: content-height; width: 100%; }`. `frame-sizing` nhận các giá trị `auto`, `content-height`, `content-width` và các biến thể logical.
- Phía document được nhúng phải opt-in bằng meta tag: `<meta name="responsive-embedded-sizing" content="allow-origins=*">`. Phải opt-in cả hai phía thì mới chạy.
- `allow-origins` giới hạn origin nào được nhận thông tin kích thước. Đây là ranh giới bảo mật để trang lạ không đọc được kích thước nội dung của bạn.
- Document bên trong báo size sau khi load và có thể gọi `window.requestResize()` khi nội dung đổi kích thước (ví dụ mở accordion, load thêm list).
- Hỗ trợ: Chrome 154+. Firefox (Bug 2035008) và Safari (Bug 314713) chưa hỗ trợ, nên vẫn phải giữ fallback.
**Vì sao đáng đọc:** Widget/loyalty page của Joy nhúng qua iframe trên storefront đang phải tự đo chiều cao rồi `postMessage` lên parent. Trên Chrome có thể thay đoạn đó bằng 1 dòng CSS + 1 meta tag, còn code cũ giữ lại làm fallback cho Safari/Firefox. Lưu ý: iframe của Shopify Admin do Shopify điều khiển, nên chỉ áp dụng được cho iframe mình tự nhúng.

## ⭐ [Stop Treating CSS Container Queries Like Traditional Media Queries](https://www.smashingmagazine.com/2026/09/stop-treating-css-container-queries-traditional-media-queries/) — (Smashing Magazine, Victor Ayomipo)
**Đây là gì:** Container queries (`@container`) cho component đổi layout theo kích thước của container cha thay vì theo viewport như media queries. Bài phân tích vì sao nhiều dev dùng sai công cụ này.
**Chi tiết:**
- Mỗi loại một việc: media query nhìn viewport, dùng cho layout cấp trang (macro). Container query nhìn không gian mà component được cấp, dùng cho layout cấp component (micro).
- Số liệu: container queries được khoảng 94% trình duyệt hỗ trợ, nhưng theo State of CSS 2025 thì 86% dev biết mà chỉ 41.4% thực sự dùng.
- Pattern đáng học: fluid typography theo container, ví dụ `font-size: clamp(1rem, .5rem + 3cqi, 2rem)`. Kỹ thuật phát hiện flex-wrap: đặt `container-type: inline-size` trên chính flex item (`flex: 1 1 390px`) rồi dùng `@container (min-width: 600px)` để đổi `flex-direction`.
- Caveat 1: container không query được chính nó (query `.card` để sửa `.card` sẽ thành vòng lặp), nên cần một wrapper cha.
- Caveat 2: `container-type: size` mà không set height thì container bị collapse về 0px, nên mặc định dùng `inline-size`. Caveat 3: không dùng được custom property trong điều kiện, ví dụ `@container (min-width: var(--breakpoint))` sẽ không chạy.
**Vì sao đáng đọc:** Widget Joy bị merchant đặt vào đủ loại slot trong theme (sidebar, full-width, popup). Dùng container query thay media query thì layout widget đúng theo chỗ nó được đặt, không phụ thuộc màn hình.

## [Node.js 22.23.3 (LTS)](https://nodejs.org/en/blog/release/v22.23.3) — (nodejs.org)
**Đây là gì:** Bản patch ngày 23/09/2026 cho dòng Node 22 LTS "Jod". Chủ yếu là cập nhật dependency: OpenSSL 3.5.8, root certificates NSS 3.125, npm 10.9.9, Undici 6.28.1, ICU 78.3, corepack 0.36.0. Có thêm một fix HTTP/2 use-after-free khi nhận/gửi `RST_STREAM`, và Node-API hỗ trợ `SharedArrayBuffer` trong `napi_create_typedarray`.
**Vì sao đáng đọc:** Cloud Functions/Cloud Run của Joy nếu còn chạy runtime Node 22 thì nên bump lên bản này (đặc biệt vì có OpenSSL mới và fix HTTP/2), rồi chạy lại test cho các chỗ gọi Shopify Admin API qua `fetch`/Undici.

## [Ship cleaner packages (without the ./dist or ./src folder) by publishing a subfolder to NPM](https://www.bram.us/2026/09/20/npm-publish-subfolder/) — (bram.us)
**Đây là gì:** Một mẹo tooling: `npm publish ./dist` coi thư mục `dist` là root của package. Nhờ vậy người dùng import `pkg/file.css` thay vì `pkg/dist/file.css`. Cần một script `postbuild` để copy `package.json`/`README.md`/`LICENSE` vào `dist` và bỏ prefix `./dist/` trong các path. Nên có script `"pub": "PUBLISH=true npm run build && npm publish ./dist"` để tránh lỡ tay publish từ root, và kiểm tra trước bằng `npm publish ./dist --dry-run` hoặc `npm pack ./dist`. npm chưa có field `publishDirectory`, còn pnpm thì có `publishConfig.directory`.
**Vì sao đáng đọc:** Nếu Joy có package nội bộ dùng chung (util, UI component Polaris wrapper), cách này giúp import path gọn và không lộ cấu trúc build.
