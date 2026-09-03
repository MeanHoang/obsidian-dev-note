# 🔥 Firebase & GCP — 2026-09-03

> Firebase ra bài mẫu kiến trúc auth + security rules cho e-commerce cart (rất sát Joy Loyalty), Remote Config bắt đầu tính tiền theo usage từ 01/09/2026, Cloud Run thêm Agent Platform + Go 1.27 GA, và BigQuery tự tối ưu query dựa trên lịch sử chạy.

## ⭐ [Authentication made easy: Building a secure e-commerce shopping cart with Firebase](https://firebase.blog/posts/2026/09/secure-shopping-cart-firebase) — (firebase.blog, 01/09/2026)
**Đây là gì:** Bài hướng dẫn kiến trúc end-to-end cho giỏ hàng e-commerce: khách vãng lai dùng Anonymous Auth để mua ngay không cần đăng ký, sau đó "nâng cấp" thành user thật mà không mất dữ liệu giỏ hàng.
**Chi tiết:**
- Hai đường nâng cấp guest → user: khách **mới** dùng `linkWithCredential()` để giữ nguyên anonymous UID (giỏ hàng còn nguyên, không cần migrate); khách **cũ** thì client đọc item của guest vào memory, xóa bản ghi guest, `signInWithEmailAndPassword()` rồi merge quantity vào giỏ cũ.
- Phân tách trách nhiệm rõ 3 tầng: browser lo UI + số lượng; **Firestore rules lo ownership + schema**; **Cloud Run lo giá tiền và ghi order immutable** — client không bao giờ được gửi giá lên.
- Rules chốt 3 invariant: path-scoped `/carts/{uid}/items/{id}` chỉ owner đọc/ghi; `.keys().hasOnly(['qty'])` chặn client nhét field `price`; và chặn biên `request.resource.data.qty > 0 && ... <= 99`.
- Nhấn mạnh nguyên tắc kinh điển hay bị hiểu nhầm: **"Rules are not filters"** — query collection không có `where()` khớp điều kiện trong rules sẽ **fail toàn bộ**, kể cả khi mọi document đều thuộc về người gọi.
- Merge giỏ hàng cũng cap ở 99 để tránh injection số lượng; checkout handler chạy trên Cloud Run dùng IAM service account nên bypass rules, verify ID token server-side trước khi ghi order và clear cart.
**Vì sao đáng đọc:** Đúng khuôn mẫu Joy Loyalty đang cần — pattern "client chỉ gửi intent, backend Cloud Run tính điểm/giá trị thật" chính là cách chặn user tự bơm points, và mẹo `hasOnly()` + cảnh báo "rules are not filters" áp thẳng được vào rules hiện tại của app.

## [3 ways to optimize Firebase Remote Config fetch usage](https://firebase.blog/posts/2026/08/optimize-remote-config-usage) — (firebase.blog, 31/08/2026)
**Đây là gì:** Remote Config là dịch vụ đổi tham số/feature flag của app từ xa mà không cần deploy lại. Bài này hướng dẫn giảm số lần fetch — quan trọng vì Remote Config bắt đầu tính tiền theo usage.
**Chi tiết:**
- Free tier: **100.000 fetch request/ngày**, đầy đủ tính năng; vượt thì chuyển sang pay-as-you-go. Mô hình tính tiền theo usage có hiệu lực từ **01/09/2026**, khách hàng hiện hữu có grace period 3–5 tháng.
- Cách 1 — *fetch for next session*: tách `fetch()` và `activate()`, đặt minimum fetch interval dài (≥12–24h), activate giá trị cache ngay lúc mở app rồi mới fetch nền cho lần sau.
- Cách 2 — *conditional fetching*: chỉ fetch tại các mốc có ý nghĩa (sign-in, vào checkout) thay vì gắn vào screen load hay app foreground.
- Cách 3 — dùng realtime listener (`addOnConfigUpdateListener`) chỉ cho phần thật sự cần cập nhật tức thì, và **remove listener** để đóng HTTP connection, đỡ tốn pin.
- Trade-off được nêu thẳng: interval dài giảm chi phí/pin nhưng tăng độ trễ giữa lúc đổi config và lúc client nhận.
**Vì sao đáng đọc:** Nếu Joy Loyalty dùng Remote Config để bật/tắt feature flag cho merchant, mốc 01/09/2026 nghĩa là hóa đơn có thể xuất hiện từ tháng này — nên rà lại chỗ nào đang fetch mỗi lần mở embedded app trong Shopify Admin.

## [Cloud Run release notes — Agent Platform features & Go 1.27 GA](https://docs.cloud.google.com/run/docs/release-notes) — (Cloud Run release notes, 01/09/2026)
**Đây là gì:** Release notes chính thức của Cloud Run. Bản 01/09/2026 bổ sung khả năng cấu hình Agent Platform trên service/job, và đưa runtime Go 1.27 lên General Availability.
**Vì sao đáng đọc:** Nếu Joy Loyalty tách phần xử lý webhook/points sang Cloud Run, phần Agent Identity tự đăng ký vào Agent Registry (Preview) là hướng để service-to-service auth không phải tự quản key.

## [BigQuery Performance Optimizations](https://cloud.google.com/blog/products/data-analytics/bigquery-performance-optimizations) — (Google Cloud Blog, 06/08/2026)
**Đây là gì:** Bài giới thiệu *history-based optimizations* — BigQuery học từ các lần chạy query trước, tự ghi nhận optimization nào có lợi và tự áp dụng cho lần chạy sau, không cần sửa SQL hay schema.
**Vì sao đáng đọc:** Dashboard analytics và ELT pipeline của Joy Loyalty chạy lặp lại hằng ngày — đúng loại workload hưởng lợi nhất mà không phải viết lại query nào.

## [Firebase JS SDK v12.18.0](https://firebase.google.com/support/release-notes/js) — (Firebase release notes, 19/08/2026)
**Đây là gì:** Bản release mới nhất của Firebase JS SDK, mới hơn 12.17.1 đã ghi nhận trước đó.
**Vì sao đáng đọc:** Đáng nâng cấp vì `FunctionsError` giờ kèm HTTP status code và URL (debug callable function đỡ mò), Auth fix lỗi "Database is closing/hidden" khi tab chạy nền — đúng tình huống embedded app Shopify bị ẩn tab lâu.
