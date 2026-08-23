# 🌐 Web Dev & Craft — 2026-08-21

> Chủ đề chính hôm nay: "bớt code, dùng platform" — Baseline giúp gỡ 60-90 KB npm deps, Chrome 151 thêm metric đo hiệu năng SPA (soft navigation), Node 26.7.0 thêm Perfetto tracing.

## ⭐ [How Baseline Can Help You Ship Less JavaScript](https://www.smashingmagazine.com/2026/08/how-baseline-can-help-ship-less-javascript/) — (Smashing Magazine, 07/08/2026, Jad Joubran)

**Đây là gì:** *Baseline* là hệ thống phân loại của web platform cho biết một API đã chạy ổn trên mọi trình duyệt chính hay chưa — chia làm "Newly available" (vừa đủ mọi browser) và "Widely available" (đã ổn định đủ lâu, an toàn cho production). Bài này dùng Baseline như tiêu chí quyết định: dependency npm nào có thể xoá vì trình duyệt đã làm được natively.

**Chi tiết:**
- Tác giả điểm danh khoảng **60-90 KB gzipped** dependency phổ biến có thể bỏ, gom thành 5 cụm.
- **i18n (~14 KB):** `timeago.js` → `Intl.RelativeTimeFormat`; `numeral` → `Intl.NumberFormat`; `humanize-duration` → `Intl.DurationFormat` (mới Newly available, cần feature check trước khi dùng).
- **HTTP client (~17 KB):** `fetch` + `AbortController` thay `axios`, nhưng bài nói rõ khoảng trống còn lại: fetch không tự reject khi HTTP error, không có interceptors, không retry, không báo upload progress.
- **UI primitives (~24 KB):** `<dialog>` thay modal library, Popover API cho dropdown/tooltip (Newly available từ 01/2025), CSS anchor positioning thay Popper.
- **Lodash (~8 KB+):** `Object.groupBy` thay `lodash.groupby`, `structuredClone` thay `lodash.clonedeep`, các method của `Set` lo union/intersection.
- **Trade-off — case study Temporal:** API thay `Date` nhưng polyfill hiện nặng **44 KB**, nên gỡ dep date lúc này chưa lời cho tới khi Safari ổn định.

**Vì sao đáng đọc:** App embed trong Shopify Admin tải qua App Bridge, bundle nhỏ đi = TTI nhanh hơn cho merchant. Joy Loyalty rất dễ thu lợi ở cụm i18n (format ngày/điểm thưởng cho merchant nhiều locale) và cụm lodash — đổi sang `Intl.NumberFormat` / `Object.groupBy` bằng JavaScript thuần, không cần thư viện, không cần TS.

## [New in Chrome 151](https://developer.chrome.com/blog/new-in-chrome-151) — (Chrome for Developers, 28/07/2026)

**Đây là gì:** Chrome 151 thêm hai loại `PerformanceEntry` mới dành riêng cho SPA: `soft-navigation` (đo các lần chuyển route do JavaScript điều khiển, không reload trang) và `interaction-contentful-paint` (đo thời điểm nội dung được vẽ ra sau một tương tác của người dùng). Ngoài ra có element `<usermedia>` — control khai báo, do người dùng kích hoạt, cho stream camera/mic mà không cần gọi `getUserMedia()` riêng; và `shadowrootslotassignment` cho phép manual slot assignment thẳng trong HTML.

**Vì sao đáng đọc:** Trước giờ LCP gần như vô dụng với app SPA vì chỉ đo lần load đầu — mọi màn hình sau đó không được đo. `soft-navigation` + `interaction-contentful-paint` cho phép đo thật độ trễ khi merchant bấm qua tab Rewards / Campaigns trong Joy Loyalty, thay vì chỉ đoán.

## [What's new in DevTools (Chrome 151)](https://developer.chrome.com/blog/new-in-devtools-151) — (Chrome for Developers, 28/07/2026, Matthias Rohmer)

**Đây là gì:** Bản DevTools tập trung vào debug memory và CSS. Panel Styles giờ hiện tooltip **specificity chi tiết dạng (a, b, c)** cho từng selector; hỗ trợ pseudo-element `::interest-button`; stylesheet trên 200 property được lazy render. Phần Memory có V8 context attribution native, cùng filter **"Retained by Context"** để lọc object bị closure giữ lại.

**Vì sao đáng đọc:** Filter "Retained by Context" là công cụ trực tiếp để truy memory leak kiểu closure giữ state trong React — loại bug hay xảy ra ở màn hình admin mở lâu. Tooltip specificity cũng đỡ đau đầu khi CSS custom phải đè lên Polaris.

## [New to the web platform in July](https://web.dev/blog/web-platform-07-2026) — (web.dev, 31/07/2026)

**Đây là gì:** Bản tổng kết tính năng browser tháng 7. Đáng chú ý: Firefox 153 cho phép **mọi element lồng nhau parse được bên trong `<select>`** (bước tiến của customizable select); Firefox 153 thêm **`Intl.Locale` Info API** với các getter như `getCalendars()`, `getTimeZones()`; và **IndexedDB `getAllRecords()`** trên `IDBObjectStore` / `IDBIndex` để lấy dữ liệu gọn hơn. Chrome 151 bổ sung property `ruby-overhang` và thuộc tính `animation` trên `AnimationEvent` / `TransitionEvent`.

**Vì sao đáng đọc:** `getAllRecords()` gọn hơn hẳn pattern cursor lặp tay khi cache dữ liệu offline phía client; `Intl.Locale` Info API hữu ích khi hiển thị lịch/timezone đúng theo store của merchant mà không cần thư viện ngoài.

## [Node.js 26.7.0 (Current)](https://nodejs.org/en/blog/release/v26.7.0) — (nodejs.org, 05/08/2026)

**Đây là gì:** Bản Current mới của Node. Điểm nổi bật semver-minor: hỗ trợ **Perfetto tracing** native (Perfetto là format/tooling trace của Google để xem timeline chi tiết của process), `Symbol.dispose` trong `ModuleHooks` (explicit resource management), và flag `--test-coverage-include-all` cho test runner. Ngoài ra có tối ưu allocation trong stream (`pipeTo`) và HTTP/HTTP2, cùng loạt fix crash cho SQLite và FFI.

**Vì sao đáng đọc:** `--test-coverage-include-all` tính coverage cả file chưa được test chạm tới — con số coverage thật hơn cho backend Cloud Run của Joy Loyalty. Lưu ý 26.x là nhánh Current, không phải LTS, nên production nên bám nhánh 24.x LTS.
