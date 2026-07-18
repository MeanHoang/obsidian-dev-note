# 🔥 Firebase & GCP — 2026-06-15

> Firestore mở full-text + geospatial search ngay trong DB, Cloud Run cho chỉnh CPU/concurrency target chính xác hơn, và Pub/Sub stream thẳng vào Bigtable không cần subscriber app.

## ⭐ [Firestore mở full-text search + geospatial search (Preview) — không cần Algolia/Elastic](https://cloud.google.com/blog/products/databases/firestore-agentic-ai-search-and-mongodb-compatibility) — (cloud.google.com/blog)
**Đây là gì:** Firestore Enterprise edition (Native mode) giờ có full-text search và geospatial search chạy ngay trong database, thay vì phải đẩy data sang dịch vụ search bên ngoài (Algolia, Elasticsearch, Typesense). Full-text search = tìm theo từ/cụm từ trong nội dung document; geospatial = tìm theo vị trí địa lý (điểm gần nhất).
**Chi tiết:**
- Full-text search (Preview) dùng công nghệ search của Google, hỗ trợ 40+ ngôn ngữ, index strongly consistent (kết quả phản ánh ngay sau khi ghi). Geospatial queries (Preview) cho phép tìm các điểm gần một vị trí.
- Cú pháp dùng Pipeline operations với stage `search(...)` + `documentMatches()`. Ví dụ Node.js: `documentMatches('"belgian waffles"')` khớp cụm từ chính xác; `documentMatches('coffee -waffles')` tìm "coffee" loại trừ "waffles"; nhiều từ `documentMatches('waffles eggs')` là AND.
- Mặc định sort theo thời gian tạo document; có thể sort theo độ liên quan bằng `score().descending()`, và gắn `score()` vào kết quả qua `addFields` để hiện điểm relevance.
- Phải tạo text index trước cho field cần search; tính năng chỉ có ở Enterprise edition, không có ở Standard.
- Cùng đợt: JOIN qua subquery đã GA, document size limit tăng lên 16MiB (MongoDB compatibility mode), và data manipulation operators (Preview) để normalize/sanitize/backfill hàng loạt.
- Doc chính thức + ví dụ code: [Use text search | Firestore](https://firebase.google.com/docs/firestore/enterprise/text-search) (có sample cho Web, Node.js, Python, Go, Kotlin, Java, iOS).
**Vì sao đáng đọc:** Joy Loyalty hiện muốn search rewards/customers/orders thường phải maintain pipeline đồng bộ sang Algolia/Elastic — nếu chuyển sang Enterprise edition có thể search loyalty data ngay trong Firestore, bớt 1 hệ thống phải nuôi và bớt độ trễ đồng bộ.

## ⭐ [Cloud Run scaling controls: tự đặt CPU/concurrency target để autoscale chính xác hơn (Preview)](https://docs.cloud.google.com/run/docs/configuring/scaling-controls) — (docs.cloud.google.com)
**Đây là gì:** Cloud Run cho phép tự đặt ngưỡng utilization mà autoscaler dùng để quyết định scale instance. Trước đây Cloud Run mặc định scale khi đạt 60% utilization (CPU và concurrency); giờ bạn opt-in để đặt target riêng, dùng mô hình autoscaling "high precision" bám sát target hơn — kể cả khi service chỉ có ít instance.
**Chi tiết:**
- Mặc định cũ: utilization target 60% cho cả CPU lẫn concurrency, ưu tiên hiệu năng cao.
- Đặt CPU target: `gcloud beta run services update SERVICE --scaling-cpu-target=CPU_TARGET`; đặt concurrency target: `--scaling-concurrency-target`.
- Giá trị hợp lệ: từ 0.1 đến 0.95 (10%–95%), tối đa 2 chữ số sau dấu thập phân.
- Mỗi thay đổi config tạo một revision mới; các revision sau tự kế thừa setting này trừ khi bạn đổi rõ ràng.
- Mô hình high precision phản ứng sát target hơn ngay cả ở số instance thấp — hữu ích cho service traffic không đều.
**Vì sao đáng đọc:** Webhook/sync worker của Joy Loyalty chạy trên Cloud Run thường spike theo đợt; hạ CPU target xuống (vd 0.5) giúp scale sớm hơn tránh nghẽn lúc burst, hoặc nâng lên để tiết kiệm khi muốn nhồi instance kỹ hơn.

## [Pub/Sub stream thẳng vào Bigtable bằng Bigtable subscription (Preview)](https://docs.cloud.google.com/pubsub/docs/release-notes) — (docs.cloud.google.com)
**Đây là gì:** Pub/Sub thêm loại subscription đẩy message trực tiếp vào bảng Bigtable, bỏ luôn nhu cầu viết app subscriber riêng (như Dataflow) chỉ để ghi message vào DB (release ngày 2026-04-16).
**Vì sao đáng đọc:** Nếu Joy Loyalty cần lưu stream sự kiện loyalty (earn/redeem) vào key-value store tốc độ cao để tra cứu, đây là đường ống Pub/Sub→Bigtable không cần nuôi service trung gian.

## [Firebase I/O 2026: Agent Mode tự sinh Firestore + security rules ngay trong IDE](https://firebase.blog/posts/2026/05/google-io-2026-announcements/) — (firebase.blog)
**Đây là gì:** Tại Google I/O 2026, Firebase công bố Agent Skills/Agent Mode (tích hợp mặc định trong Android Studio, mở rộng cho mobile + Antigravity 2.0) có thể tự set up Firestore, Firebase Authentication, sinh code Firestore và viết security rules từ prompt ngôn ngữ tự nhiên. Kèm App Check replay attack protection (token dùng 1 lần).
**Vì sao đáng đọc:** Viết security rules đúng cho Firestore là phần dễ sai và tốn thời gian của Joy Loyalty — dùng agent sinh nháp rules rồi review tay có thể rút ngắn vòng lặp, miễn không tin tuyệt đối output.
