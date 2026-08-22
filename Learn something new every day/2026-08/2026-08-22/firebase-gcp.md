# 🔥 Firebase & GCP — 2026-08-22

> Hôm nay tập trung vào 2 thứ ảnh hưởng trực tiếp tới app production: Cloud Run tự động fail-over khi 1 region chết, và Firestore Pipeline mở ra loại query mà trước giờ phải tự build ngoài DB.

## ⭐ [Making highly available, multi-region Cloud Run services just got easier](https://cloud.google.com/blog/products/serverless/cloud-run-multi-region-services-enhanced-for-high-availability) — (Google Cloud Blog, 21/07/2026)

**Đây là gì:** Cloud Run bổ sung 2 tính năng health-check cấp instance và cấp region — **Readiness probes** và **Service Health** — để load balancer tự động ngừng đẩy traffic vào region đang hỏng, thay vì phải tự viết script monitor + đổi DNS.

**Chi tiết:**
- **Readiness probe** là health check ở mức instance: quyết định khi nào container thực sự sẵn sàng nhận traffic. Bạn cũng theo dõi được số instance healthy/unhealthy theo từng region.
- **Service Health** gom kết quả các readiness probe lại và tính ra "sức khỏe" của service theo region, rồi expose qua **serverless network endpoint groups (NEGs)**.
- Khi service được gắn vào **global application load balancer**, traffic tự động fail away khỏi region unhealthy. Bài nêu 2 use case: app public dùng *global external application load balancer*, app nội bộ dùng *cross-regional internal application load balancer*.
- Hoạt động với cả single-region lẫn multi-region service.
- **Có sẵn ở tất cả Cloud Run regions, không tính phí thêm** — chỉ trả CPU/memory tiêu chuẩn cho việc chạy readiness probe.

**Vì sao đáng đọc:** Joy Loyalty phục vụ merchant Shopify ở nhiều múi giờ, downtime 1 region = widget loyalty tắt ở storefront khách. Readiness probe còn giải quyết cả vấn đề "instance nhận request khi chưa init xong Firebase Admin SDK / chưa warm connection" — thêm probe là bớt hẳn lỗi 5xx lúc cold start sau deploy.

## ⭐ [Unveiling Firestore Pipeline operations](https://firebase.blog/posts/2026/01/firestore-enterprise-pipeline-operations/) — (Firebase Blog, 15/01/2026)

**Đây là gì:** Firestore **Enterprise edition** có query engine viết lại hoàn toàn, cho phép *chain nhiều stage* trong một query (giống pipeline của MongoDB/SQL) thay vì chỉ where + orderBy + limit như Standard.

**Chi tiết:**
- Bài công bố **hơn 100 khả năng query mới**: unnest array, aggregation tùy ý, map operations, và string matching bằng **regular expression** — những thứ trước đây Firestore không làm được.
- Ví dụ trong bài: query database công thức nấu ăn để bóc tag do user tự đặt rồi đếm tần suất, trả về **limit 10** tag phổ biến nhất. Trước đây phải nuôi một collection counter riêng hoặc export sang BigQuery mới làm được.
- Pipeline operations có mặt trên **4 nền tảng**: Android, iOS, web và Admin SDKs.
- **Trade-off quan trọng:** đây là tính năng riêng của Enterprise edition. Chạy pipeline trên database **Standard edition sẽ trả về server error**. Enterprise cũng khác Standard ở chỗ gộp write/delete thành một operation duy nhất và dùng indexing linh hoạt (không tự tạo index).

**Vì sao đáng đọc:** Loại query "đếm/nhóm theo field động" là đúng bài toán analytics của Joy Loyalty (top reward được redeem, phân bố tier khách hàng). Nếu shop lớn, cân nhắc Enterprise edition để bỏ bớt collection aggregate viết tay — nhưng phải tính chi phí index thủ công vì Enterprise không auto-index.

## [Estimate and control costs — BigQuery](https://docs.cloud.google.com/bigquery/docs/best-practices-costs) — (Google Cloud Documentation)

**Đây là gì:** Trang doc chính thức tổng hợp các cơ chế chặn chi phí BigQuery, chia theo compute / storage / workload management.

**Chi tiết:**
- Compute: đặt **custom daily query quota** giới hạn lượng data xử lý mỗi ngày; dùng **dry run / query validator** để ước tính trước khi chạy; set **maximum bytes billed** để chặn query lỡ tay quét cả bảng.
- Doc cảnh báo rõ: **đừng dùng `LIMIT` như biện pháp giảm chi phí** trên bảng không clustered — vẫn bị tính tiền toàn bộ data quét.
- Storage: **long-term storage giảm 50% giá sau 90 ngày** không sửa đổi (tự động); chọn billing model logical vs physical bytes; set table expiration cho bảng tạm; **giảm time-travel window** khỏi mặc định 7 ngày; archive data cũ sang Cloud Storage.

**Vì sao đáng đọc:** Bảng event loyalty (earn/redeem) là loại append-only ghi liên tục nhưng hiếm khi sửa — chính là ứng viên hoàn hảo cho long-term storage 50% off, và giảm time-travel từ 7 ngày xuống là tiết kiệm ngay mà không mất gì.

## [Best practices to subscribe to a Pub/Sub topic](https://docs.cloud.google.com/pubsub/docs/subscribe-best-practices) — (Google Cloud Documentation)

**Đây là gì:** Hướng dẫn chính thức về cách viết subscriber đúng, đặc biệt phần exactly-once delivery và message ordering.

**Chi tiết:**
- Muốn không có duplicate thì bật **exactly-once delivery**; nếu không bật, phải tự viết logic stateful để loại trùng.
- Giảm khả năng duplicate bằng cách **process và ack message càng nhanh càng tốt** (đừng làm việc nặng trước khi ack).
- Với **ordered delivery**: message cùng ordering key và cùng region mới được đảm bảo thứ tự, và phải **ack theo đúng thứ tự** — ví dụ có message 1, 2, 3 cùng ordering key mà chỉ ack message 3 thì service không coi 3 là đã ack cho tới khi 1 và 2 được ack.

**Vì sao đáng đọc:** Webhook Shopify (`orders/create`, `refunds/create`) đẩy qua Pub/Sub mà xử lý trùng = cộng điểm 2 lần cho khách. Dùng `order_id` làm ordering key cho các event của cùng 1 đơn là pattern hợp lý, nhưng nhớ rule ack tuần tự nếu không muốn subscriber bị kẹt.

## [Firebase Security Rules — Basic Security Rules](https://firebase.google.com/docs/rules/basics) — (Firebase Documentation)

**Đây là gì:** Trang doc nền tảng về cấu trúc Security Rules: mọi rule đều gồm phần **match path** và phần **allow + condition**.

**Vì sao đáng đọc:** Pattern gốc `match /users/{userId}` + so `request.auth.uid == userId` là khuôn để viết rule multi-tenant cho Joy Loyalty — mỗi shop chỉ đọc được document thuộc `shopId` của mình. Firestore/Storage rules dùng **CEL**, còn Realtime Database dùng cú pháp JSON kiểu JavaScript — hai ngôn ngữ khác nhau, đừng copy nhầm giữa hai sản phẩm.
