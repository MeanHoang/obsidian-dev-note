# 🌐 Web Dev & Craft — 2026-09-24

> Next.js đã có bản vá thật cho lỗi RCE trong `next/og` và báo trước đợt vá 9 lỗ hổng ngày 30/9; Node.js 26.10 thêm sẵn `util.debounce()`/`util.throttle()`; Chrome 155 beta và DevTools tháng 10 có nhiều tính năng dùng được ngay.

## ⭐ [Next.js Security Update for a Critical Upstream Issue](https://nextjs.org/blog/nextjs-security-update-september-22-2026) — (nextjs.org)
**Đây là gì:** Bản vá out-of-band ngày 22/09/2026, là bản vá thật sau bài báo trước "Upcoming Next.js Security Update" (đã note 22/9). Có 2 bản: v16.3.6 (Active LTS) và v15.5.26 (Maintenance LTS).
**Chi tiết:**
- Lỗi **Remote Code Execution (Critical)** nằm trong phần `ImageResponse` chạy trên Node.js của `next/og`. Advisory là [GHSA-vcvr-r3jv-pc5j](https://github.com/vercel/next.js/security/advisories/GHSA-vcvr-r3jv-pc5j), và advisory upstream của Satori là [GHSA-wx4j-mvgx-mqwp](https://github.com/vercel/satori/security/advisories/GHSA-wx4j-mvgx-mqwp).
- Nguyên nhân: SVG do Satori sinh ra không escape đúng cách. Trong một số điều kiện nhất định, kết hợp với lỗ hổng ở các dependency upstream khác, lỗi này có thể dẫn tới RCE. Bản vá nâng cấp các dependency đó.
- Phiên bản bị ảnh hưởng: `>=16.2.0 <16.3.6`. Next.js 15.x **không** dính RCE, bản 15.5.26 chỉ bổ sung hardening.
- App dùng `ImageResponse` bản **Edge** thì không bị ảnh hưởng.
- Cách vá: `npm install next@16.3.6` (bản 16.3) hoặc `npm install next@15.5.26` (bản 15.5, chỉ hardening).
**Vì sao đáng đọc:** Service nào của Joy chạy Next.js 16.2+ trên Cloud Run/Node và có sinh ảnh OG động (ví dụ ảnh share referral, ảnh reward card) thì đang nằm đúng vùng lỗi RCE. Cần grep `next/og` trong repo và bump lên 16.3.6 ngay.

## [Upcoming Next.js September Security Release](https://nextjs.org/blog/upcoming-nextjs-security-release-september-2026) — (nextjs.org)
**Đây là gì:** Thông báo trước (đăng 23/09/2026) về đợt vá định kỳ ngày **30/09/2026**. Đợt này sửa 9 lỗ hổng: 1 critical, 2 high, 5 medium, 1 low. Next.js sẽ phát hành 16.3.7 và 15.5.27, kèm advisory đầy đủ.
**Vì sao đáng đọc:** Đây là bài riêng, khác với bản vá out-of-band ở trên. Nên xếp lịch upgrade Next.js ngay đầu tuần sau cho các dashboard/landing dùng Next, và gộp luôn lần bump 16.3.6 → 16.3.7 để khỏi phải deploy hai lần lệch nhau.

## [Node.js 26.10.0 (Current)](https://nodejs.org/en/blog/release/v26.10.0) — (nodejs.org)
**Đây là gì:** Bản release ngày 22/09/2026. Các thay đổi semver-minor gồm: `util.debounce()`, `util.throttle()`, `util.markPromiseAsHandled()`, `fs.openAsBlobSync()`, `crypto.parsePKCS12()`, `perf_hooks.SlidingWindowHistogram`, và `node:sqlite` bind `undefined` thành `NULL`. Ngoài ra có cải thiện hiệu năng stream và độ ổn định HTTP/2.
**Vì sao đáng đọc:** `util.debounce`/`throttle` có sẵn trong core giúp bớt phụ thuộc lodash trong code backend JS. `SlidingWindowHistogram` hữu ích để đo latency theo cửa sổ thời gian cho webhook handler. Lưu ý đây là dòng Current, chưa phải LTS, nên chỉ thử ở local/dev chứ chưa đưa lên Cloud Functions/Cloud Run production.

## [Chrome 155 beta](https://developer.chrome.com/blog/chrome-155-beta) — (developer.chrome.com)
**Đây là gì:** Bản beta ra ngày 16/09/2026. Về CSS có `symbols()` inline, shorthand cho góc (`border-radius` + `corner-shape`), `margin-trim`, `text-decoration-skip-spaces`. Về JS có Text Modules (`import … with { type: "text" }`), và `import()` không còn cache kết quả khi module load lỗi nên có thể retry. Ngoài ra WebCrypto hỗ trợ thêm thuật toán post-quantum (ML-KEM, ML-DSA…) và Chrome giải mã được JPEG XL.
**Vì sao đáng đọc:** Việc không cache module load lỗi giải quyết đúng một bug hay gặp: widget storefront lazy-load bằng `import()` gặp mạng chập chờn là hỏng luôn cho tới khi reload trang. Từ bản này có thể viết retry trực tiếp. `margin-trim` cũng giúp bớt các hack `:last-child { margin: 0 }` trong CSS của widget.

## [New in DevTools - October 2026](https://developer.chrome.com/blog/new-in-devtools-october-2026) — (developer.chrome.com)
**Đây là gì:** Tổng hợp tính năng DevTools cho Chrome 153–154, đăng 22/09/2026. Gồm: Performance panel đo soft navigation từ đầu đến cuối, override CPU performance tier để test lặp lại được, Elements đánh dấu các CSS rule không còn áp dụng, "Edit and resend as fetch" trong Console, heap snapshot lọc và sắp xếp được theo retained size, và thêm công cụ cho coding agent qua Chrome DevTools MCP server.
**Vì sao đáng đọc:** Admin app embedded dùng Polaris là SPA, chuyển trang toàn là soft navigation. Giờ đo được INP/LCP cho các lần chuyển này. "Edit and resend as fetch" cũng giúp debug nhanh request tới backend Firebase/Cloud Run mà không phải copy qua Postman.
