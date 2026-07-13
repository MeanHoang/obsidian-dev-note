# 🔥 Firebase & GCP — 2026-07-03

> Firestore Enterprise mở loạt tính năng "SQL-like" (full-text search, JOIN, DML), cộng các pattern tối ưu chi phí BigQuery và độ tin cậy Pub/Sub cho stack loyalty daily.

## ⭐ [What's new from Firebase at Cloud Next 2026](https://firebase.blog/posts/2026/04/cloud-next-2026-announcements) — (firebase.blog)
**Đây là gì:** Tổng hợp các thông báo lớn của Firebase tại Cloud Next 2026, đáng chú ý nhất là **Firestore Enterprise** — nâng Firestore từ NoSQL thuần lên gần với khả năng của một DB quan hệ.
**Chi tiết:**
- **Firestore Enterprise**: pipeline operations đã GA. Bộ tính năng mới đang ở preview gồm **native full-text search**, **geospatial queries**, **relational-style JOINs qua subqueries**, và **DML** (data manipulation language) — tức có thể query kiểu quan hệ ngay trong Firestore.
- **Firebase SQL Connect** (tiến hoá từ Data Connect): hỗ trợ realtime sync, offline cache và native SQL, chạy trên Cloud SQL for PostgreSQL, có bản trial no-cost.
- **Cloud Functions for Firebase**: thêm hỗ trợ **Dart** (experimental) cho HTTP + callable functions.
- **Firebase Phone Number Verification**: graduating lên GA tháng 5/2026, hỗ trợ 10+ carrier qua 6 region, không cần gửi SMS.
**Vì sao đáng đọc:** Joy Loyalty hay phải denormalize và tự maintain aggregate vì Firestore không JOIN được. Native full-text search + JOIN-via-subquery (dù còn preview) có thể thay thế nhiều collection phụ tự build cho search member/reward — theo dõi sớm để plan data model.

## [Best practices for Cloud Firestore](https://firebase.google.com/docs/firestore/best-practices) — (firebase.google.com)
**Đây là gì:** Trang best practices chính chủ về data modeling và query performance của Firestore.
**Chi tiết:**
- **Không dùng document ID tăng đơn điệu** (kiểu `Customer1`, `Customer2` hoặc timestamp): dễ tạo hotspot làm tăng latency khi write nhiều — nên để Firestore auto-gen ID hoặc hash.
- **Không dùng offset, dùng cursor** (`startAfter`) khi phân trang: offset vẫn đọc ngầm các document bị skip → bị tính tiền và tăng latency cho phần dữ liệu không nhận được.
- Cân bằng normalize/denormalize: Firestore không hỗ trợ JOIN/group by/aggregation phức tạp nên phải denormalize có chủ đích, tránh nhân bản dữ liệu quá mức.
**Vì sao đáng đọc:** Query danh sách member/lịch sử điểm trong Joy Loyalty nếu đang dùng offset thì đang trả tiền oan; đổi sang cursor pagination cắt cả cost lẫn latency.

## [Estimate and control BigQuery costs](https://docs.cloud.google.com/bigquery/docs/best-practices-costs) — (cloud.google.com)
**Đây là gì:** Hướng dẫn chính chủ kiểm soát chi phí BigQuery (on-demand hiện $6.25/TiB scan).
**Chi tiết:**
- Tránh `SELECT *`: BigQuery tính tiền theo bytes quét trên **các cột được chọn**; chỉ định đúng cột cần có thể giảm 80–90% dữ liệu quét trên bảng nhiều cột.
- **Partition theo ngày** + query có `WHERE date`: chỉ quét partition của ngày đó thay vì cả bảng.
- **Materialized views** pre-compute kết quả aggregate: query được serve từ view chỉ tính bytes của view, không phải bảng gốc — giảm cost aggregate lặp lại tới cả một bậc độ lớn.
**Vì sao đáng đọc:** Nếu Joy Loyalty đẩy event điểm thưởng/đơn hàng vào BigQuery để phân tích, partition theo ngày + tránh `SELECT *` là cách nhanh nhất cắt hóa đơn analytics mà không đổi logic.

## [Pub/Sub exactly-once delivery](https://docs.cloud.google.com/pubsub/docs/exactly-once-delivery) — (cloud.google.com)
**Đây là gì:** Tính năng exactly-once delivery của Pub/Sub cho pull/StreamingPull subscription, chống redeliver sau khi ack thành công.
**Chi tiết:**
- Guarantee dựa trên **message ID** và **scoped theo region** — cross-region không được đảm bảo.
- Best practice: **xử lý xong rồi mới ack**; đặt ack deadline đủ dài cho thời gian xử lý.
- Vẫn nên làm **consumer idempotent** (dedup bằng business key qua Redis/DB) vì exactly-once tuyệt đối là bất khả thi — thiết kế để nuốt được duplicate hiếm gặp.
**Vì sao đáng đọc:** Các event như "cộng điểm", "phát reward" phải idempotent — nếu Joy Loyalty dùng Pub/Sub cho pipeline event, bật exactly-once + dedup theo orderId/eventId tránh cộng điểm 2 lần cho member.

## [Firebase Security Rules](https://firebase.google.com/docs/rules) — (firebase.google.com)
**Đây là gì:** Tài liệu gốc về Security Rules — cơ chế path-matching + điều kiện cho phép read/write.
**Vì sao đáng đọc:** Nhắc lại các trụ cột dễ quên khi ship nhanh: bắt đầu từ **locked mode** (không bao giờ `allow read, write: if true` trên production), check `request.auth != null` và `request.auth.uid` khớp owner, validate schema bằng `request.resource.data`, và chạy Emulator test suite trong CI trước khi deploy — đúng thứ cần cho collection member/points của app loyalty multi-tenant.
