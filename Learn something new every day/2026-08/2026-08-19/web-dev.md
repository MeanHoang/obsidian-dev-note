# 🌐 Web Dev — 2026-08-19

> Next.js 16.3 mang navigation kiểu SPA về framework server-driven, Chrome đẩy streaming HTML thành API khai báo, còn Node.js đổi hẳn nhịp release sang 1 major/năm.

## ⭐ [Next.js 16.3 — Instant Navigations, dev server nhẹ RAM, build nhanh hơn](https://nextjs.org/blog/next-16-3) — (nextjs.org, 03/08/2026)
**Đây là gì:** Bản Next.js lớn nhất kể từ 16.0, xoay quanh "Instant Navigations" — bộ công cụ opt-in giúp app server-driven phản hồi nhanh như SPA — cộng với hàng loạt cải thiện performance áp dụng ngay khi upgrade mà không sửa code.
**Chi tiết:**
- Dev server dùng **tới 90% ít RAM** nhờ disk caching + memory eviction bật mặc định trong Turbopack: dashboard vercel.com từ 21.5 GB xuống 2 GB, nextjs.org từ 4.600 MB xuống 840 MB (sau khi compile 50 route).
- Build lặp lại đọc artifact từ FileSystem Cache: nextjs.org 21s → 9.2s (~2.3×), vercel.com/geist 30s → 5.5s (**~5.5× nhanh hơn** trên CI).
- Thay web streams bằng native Node.js streams trong tầng render App Router → app chịu tải **nhiều hơn 22% request**, zero code change.
- Instant Navigations gồm: Partial Prefetching (kiểm soát mức prefetch từng `<Link>`), Instant Insights (devtool tự chỉ ra navigation chậm), Navigation Inspector, và helper Playwright `instant()` để viết test chống regression khi refactor làm mất loading shell. Bật bằng 2 flag `cacheComponents: true` + `partialPrefetching: true`.
- Experimental: React Compiler viết lại bằng Rust chạy thẳng trong Turbopack thay vì Babel — trên app v0 giảm **34% thời gian cold build** và **46% warm build** tới lúc page sẵn sàng (chỉ đạt mức này nếu đã bỏ hẳn Babel). Ngoài ra có `experimental.useOffline` + hook `useOffline` giữ navigation/Server Action pending rồi retry khi có mạng lại.
**Vì sao đáng đọc:** Nếu embedded app / admin dashboard của Joy Loyalty chạy Next.js, chỉ riêng việc upgrade đã lấy được +22% throughput SSR và dev server bớt ngốn RAM; còn `instant()` helper là cách rẻ để chốt SLA "merchant click tab là thấy UI ngay".

## ⭐ [Declarative Partial Updates — stream HTML không theo thứ tự, không cần DOM hack](https://developer.chrome.com/blog/declarative-partial-updates) — (Chrome for Developers, 19/05/2026)
**Đây là gì:** Hai API web platform mới của Chrome cho phép chèn HTML vào trang không theo thứ tự top-to-bottom: out-of-order streaming bằng `<template>` + processing instruction, và một bộ method chèn HTML chuẩn hoá thay cho `innerHTML` các kiểu.
**Chi tiết:**
- Vấn đề gốc: HTML vốn stream tuần tự, phần chậm (ví dụ block cần query DB) chặn luôn phần đã sẵn sàng phía sau.
- Cơ chế khai báo: đặt placeholder `<?marker name="placeholder">` ở vị trí mong muốn, rồi stream `<template for="placeholder">…</template>` xuống sau — nội dung tự nhảy vào đúng chỗ.
- 12 method JS mới đặt tên nhất quán: bản tĩnh (`setHTML`, `appendHTML`…) và bản streaming (`streamHTML`, `streamAppendHTML`…), kèm biến thể `Unsafe` khi muốn tắt sanitization. Ví dụ: `const writer = el.streamHTMLUnsafe().getWriter(); await writer.write('<p>…</p>')`.
- Lợi ích: ưu tiên nội dung linh hoạt, ít boilerplate, hợp kiến trúc islands.
- Trade-off được nêu rõ: giới hạn scope vì security, polyfill **không** hỗ trợ đầy đủ phần streaming, và di chuyển element trong lúc stream đang chạy có thể sinh lỗi.
**Vì sao đáng đọc:** Đây là hướng đi "server-rendered + streaming" native không cần framework — hữu ích khi làm widget loyalty nhúng vào storefront, nơi mỗi KB React thêm vào đều ăn trực tiếp vào LCP của merchant.

## [Evolving the Node.js Release Schedule — 1 major/năm, mọi bản đều thành LTS](https://nodejs.org/en/blog/announcements/evolving-the-nodejs-release-schedule) — (nodejs.org)
**Đây là gì:** Node.js bỏ mô hình 2 major/năm với quy ước chẵn-lẻ. Từ Node 27.x (alpha bắt đầu 10/2026, release 04/2027), mỗi năm chỉ 1 major, phát hành tháng 4 và lên LTS tháng 10; **mọi** release đều thành LTS, thêm kênh Alpha 6 tháng cho phép semver-major change. Vòng đời: 6 tháng alpha + 6 tháng Current + 30 tháng LTS = 36 tháng, và số version khớp năm dương lịch (28.0.0 vào 2028).
**Vì sao đáng đọc:** Ảnh hưởng trực tiếp tới kế hoạch pin runtime của Cloud Functions / Cloud Run — từ 2027 việc chọn Node version cho backend Joy Loyalty đơn giản hơn nhiều vì không còn phải né bản lẻ.

## [Advanced Tree Counting: layout toán học với sibling-index() và sibling-count()](https://www.smashingmagazine.com/2026/05/mathematical-layouts-sibling-index-sibling-count/) — (Smashing Magazine, 21/05/2026)
**Đây là gì:** Hai hàm CSS (CSS Values and Units Level 5) trả về vị trí 1-based của element trong danh sách anh em và tổng số anh em, không cần tham số. Cho phép stagger animation, chia đều hue, tab width tự động, menu tròn... bằng CSS thuần — "hoạt động với 5 item hay 5.000 item, không event listener, không mutation observer". Bài nêu cả gotcha: scoping trong Shadow DOM, element `display: none` vẫn bị đếm, và lưu ý accessibility cho screen reader. Support: Chrome/Edge 138+, Safari 26.2+, Firefox chưa có.
**Vì sao đáng đọc:** Danh sách reward/tier trong widget loyalty là số lượng động — thay vì generate `:nth-child()` hay tính index bằng JS, một dòng CSS xử lý được, bớt JS chạy trên storefront khách hàng.

## [Node.js Security Releases — 26.5.1, 24.18.1, 22.23.2 (max severity HIGH)](https://nodejs.org/en/blog/vulnerability/july-2026-security-releases) — (nodejs.org, 29/07/2026)
**Đây là gì:** Bản vá bảo mật cho cả ba nhánh 26.x, 24.x và 22.x, mức nghiêm trọng cao nhất được đánh giá HIGH.
**Vì sao đáng đọc:** Runtime Node của Cloud Run / Cloud Functions không tự nhảy patch version theo lịch của bạn — nên rà lại base image và `engines` trong package.json của các service Joy Loyalty, đây là loại nợ bảo mật rẻ nhất để trả.
