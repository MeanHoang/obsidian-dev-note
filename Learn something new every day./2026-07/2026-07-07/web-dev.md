# 🌐 Web Dev — 2026-07-07

> Temporal chính thức vào ES2026 và bật mặc định trong Node 26, cùng làn sóng "để browser lo" ở CSS Baseline và bài chuẩn về cắt long task để cứu INP.

## ⭐ [Optimize long tasks — cắt task dài & scheduler.yield()](https://web.dev/articles/optimize-long-tasks) — (web.dev)
**Đây là gì:** Bài hướng dẫn chính chủ của Chrome team về cách chia nhỏ tác vụ JS dài (>50ms) để main thread có cơ hội xử lý input người dùng, trực tiếp cải thiện INP (Interaction to Next Paint — đo độ trễ từ lúc user tương tác đến khi màn hình vẽ lại).
**Chi tiết:**
- Bất kỳ task nào chạy >50ms là "long task" chặn main thread; khi user click/gõ đúng lúc đó, tương tác bị treo → INP tệ.
- `scheduler.yield()` là API mới trả về Promise: `await scheduler.yield()` tạm dừng, đẩy phần code còn lại vào task riêng nhưng ưu tiên chèn lên đầu hàng đợi → code của bạn chạy tiếp ngay sau khi browser xử lý input, không bị script bên thứ ba "chen hàng" như `setTimeout()`.
- Support: Chrome/Edge 129+, Firefox 142+ (Safari chưa có → cần polyfill).
- Nguyên tắc: yield SAU khi hoàn tất phần render user nhìn thấy, TRƯỚC khi chạy việc nền như analytics; không còn khuyến nghị `isInputPending()` cũ nữa.
**Vì sao đáng đọc:** Widget loyalty của Joy nhúng vào storefront khách — nếu vòng lặp render rewards/tính điểm chạy đồng bộ dài sẽ ăn vào INP của cả trang merchant. Rải `await scheduler.yield()` giữa các chunk là fix rẻ nhất, không đụng logic.

## ⭐ [Baseline tháng 5/2026 — CSS & web platform mới an toàn dùng](https://web.dev/blog/baseline-digest-may-2026) — (web.dev)
**Đây là gì:** Digest hằng tháng liệt kê các tính năng vừa đạt Baseline. "Newly available" = đã chạy trên phiên bản stable của cả 4 engine (Chrome, Edge, Firefox, Safari); "Widely available" = đã ổn định ~2.5 năm, dùng thoải mái không lo.
**Chi tiết:**
- **Newly available:** Container style queries (style con dựa trên custom property của container cha), pseudo-class `:open` (match `<dialog>`/`<details>` đang mở), `ToggleEvent.source` (biết control nào trigger popover), `image-rendering`, `text-decoration-skip-ink: all`, và `SharedWorker`.
- **Widely available:** đơn vị `lh`/`rlh` (theo line-height của element/root — canh vertical rhythm), `Navigator.userActivation`, `clip-path`, pseudo-class `:user-invalid` (chỉ style lỗi form SAU khi user đã nhập).
**Vì sao đáng đọc:** `:user-invalid` và `:open` giúp form/dialog trong Polaris-style UI bớt phụ thuộc state React; container style queries cho phép widget loyalty tự đổi theme theo container merchant nhúng vào — đều là JS bớt viết.

## [ES2026 chốt: Temporal lên Stage 4](https://socket.dev/blog/tc39-advances-temporal-to-stage-4) — (socket.dev)
**Đây là gì:** Tổng hợp cuộc họp TC39 tháng 3/2026. Temporal — API date/time thay thế `Date` cũ, với kiểu bất biến (immutable), hỗ trợ timezone và calendar sẵn — chính thức đạt Stage 4, tức nằm chắc trong spec ECMAScript 2026.
**Chi tiết:**
- Temporal được gọi là "bổ sung lớn nhất cho ECMAScript kể từ ES2015", kết thúc gần một thập kỷ phát triển.
- Cùng lên Stage 4: `Intl` era & monthCode (lịch không phải Gregorian). Stage 3: import text file trực tiếp như module. Stage 2.7: chuẩn hóa `Error.prototype.stack` và `Iterator.prototype.includes`.
- Immutable design nghĩa là mọi phép cộng/trừ ngày trả về object mới, tránh bug mutate ngầm của `Date`.
**Vì sao đáng đọc:** Joy xử lý expiry điểm, campaign theo mốc thời gian, chênh lệch timezone merchant khắp thế giới — `Date` hiện tại dễ sai lệch giờ địa phương. Temporal (dùng JS thuần) sẽ dọn sạch mảng logic này khi runtime hỗ trợ ổn định.

## [Node.js 26: bật Temporal mặc định, V8 14.6](https://github.com/nodejs/nodejs.org/blob/main/apps/site/pages/en/blog/release/v26.0.0.md) — (github/nodejs)
**Đây là gì:** Release note Node.js 26.0.0 (5/5/2026), bản Current, sẽ vào LTS tháng 10/2026.
**Chi tiết:**
- Temporal API bật mặc định, không còn cần flag experimental — Node là runtime lớn đầu tiên đưa Temporal ra production mặc định.
- V8 nâng lên 14.6 (Chromium 146): thêm `Map`/`WeakMap.getOrInsert()` & `getOrInsertComputed()` (upsert 1 dòng thay vì check-rồi-set), và `Iterator.concat()` nối nhiều iterator.
- Undici (HTTP client) lên 8.0.2; gỡ bỏ hẳn các module stream nội bộ legacy (`_stream_wrap`, `_stream_readable`...) và `http.Server.prototype.writeHeader()`.
- Node 26 là bản cuối theo release cycle hiện tại; từ v27 dự án đổi chiến lược phát hành.
**Vì sao đáng đọc:** Backend Joy trên Cloud Run/Firebase Functions chạy Node — `getOrInsert()` gọn cho gom điểm theo customer; nhưng lưu ý các module stream bị gỡ có thể phá lib cũ khi bump runtime, nên đọc trước khi nâng.
