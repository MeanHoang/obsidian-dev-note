# 🔥 Firebase & GCP — 2026-06-12

> Hôm nay nổi bật 2 thứ rất "production": Firestore có dashboard Usage Insights (soi chi phí read/write theo từng collection, miễn phí) và IAP giờ bật trực tiếp trên Cloud Run không cần load balancer.

## ⭐ [Firestore Usage Insights dashboard — soi billable usage theo từng collection (GA)](https://docs.cloud.google.com/firestore/native/docs/usage-insights) — (cloud.google.com docs)
**Đây là gì:** Dashboard mới trong Google Cloud console (GA từ 13/04/2026) cho phép xem **billable operations** (reads/writes/TTL deletes) của từng database Firestore, breakdown theo dimension `collection`, `collectionGroup` hoặc `namespace`. Trước đây metrics Firestore chỉ có tổng số ops toàn database — muốn biết collection nào "đốt tiền" phải tự log hoặc đoán.
**Chi tiết:**
- Track được reads, writes (gồm deletes), TTL deletes; Enterprise edition thêm cả Eventarc events. Ngoài số ops còn có bytes scanned, document count, index entries, document size written.
- Breakdown theo collection/collection group, hiển thị **top 100** collections — đủ để tìm thủ phạm hot collection.
- Dữ liệu giữ **45 ngày** để xem trend theo thời gian; chỉ cần role `roles/datastore.viewer` (permission `datastore.insights.get`); **không tốn thêm phí**.
- Giới hạn cần biết: streaming queries (realtime listeners) đóng góp vào billable reads nhưng **không được track** ở đây; admin ops (import/export, bulk delete, restore) cũng không tính.
**Vì sao đáng đọc:** Joy Loyalty chạy Firestore hàng ngày — giờ có thể trả lời câu "collection points/rewards nào đang ăn nhiều reads nhất?" bằng 1 dashboard miễn phí thay vì đoán từ billing tổng, rất hợp để audit cost trước khi tối ưu query/denormalize.

## ⭐ [Bật IAP trực tiếp trên Cloud Run — không cần load balancer (GA)](https://docs.cloud.google.com/run/docs/securing/identity-aware-proxy-cloud-run) — (cloud.google.com docs)
**Đây là gì:** Identity-Aware Proxy (IAP) là lớp xác thực Google đứng trước service — chỉ user/identity được cấp quyền mới gọi vào được. Trước đây muốn dùng IAP với Cloud Run phải dựng load balancer phía trước; giờ (GA, release note 13/03/2026) bật thẳng trên service.
**Chi tiết:**
- Deploy 1 flag là xong: `gcloud run deploy SERVICE --no-allow-unauthenticated --iap` (service có sẵn thì `gcloud run services update SERVICE --iap`), nhớ grant invoker cho IAP service agent.
- Bảo vệ **mọi ingress path** — cả URL `run.app` mặc định lẫn traffic qua load balancer, không phải cấu hình IAP riêng ở tầng LB nữa.
- Mặc định dùng Google-managed OAuth client (identity trong organization); user ngoài org cần tạo custom OAuth client.
- Trade-off: không được bật IAP đồng thời ở cả LB và service; IAP check **trước** IAM nên service nhận Pub/Sub push (tự auth bằng OIDC) có thể fail — đừng bật IAP cho mấy endpoint đó.
**Vì sao đáng đọc:** Các internal tool/admin dashboard của team (cron trigger, ops panel) chạy Cloud Run giờ khóa lại bằng 1 flag thay vì dựng LB ~18$/tháng hoặc tự viết middleware auth — nhưng phải tách riêng service nhận Pub/Sub push.

## [Cloud Run worker pools (GA) — chạy Pub/Sub pull subscriber không cần HTTP endpoint](https://docs.cloud.google.com/run/docs/deploy-worker-pools) — (cloud.google.com docs)
**Đây là gì:** Worker pool là loại resource Cloud Run mới (GA, release note 14/04/2026) cho workload chạy nền liên tục: không có URL/endpoint, container không cần listen port, không autoscale tự động (tự set instance count, hoặc tự dựng autoscaler theo queue depth).
**Vì sao đáng đọc:** Pattern chuẩn để consume Pub/Sub bằng **pull subscription** trên Cloud Run — thay vì ép mọi thứ thành push endpoint HTTP; hợp với job xử lý điểm thưởng/webhook Shopify dạng batch, kiểm soát tốc độ xử lý chủ động hơn push.

## [Cloud Run ephemeral disk (Preview) — volume tạm sống theo vòng đời instance](https://docs.cloud.google.com/run/docs/release-notes) — (Cloud Run release notes)
**Đây là gì:** Mount một volume disk chỉ tồn tại trong vòng đời của instance service/job/worker pool (Preview, release note 20/04/2026) — khác in-memory filesystem mặc định vốn ăn vào RAM của container.
**Vì sao đáng đọc:** Job export CSV/report lớn (vd. xuất danh sách members, gift card) trên Cloud Run hết cảnh file tạm chiếm RAM gây OOM — ghi ra ephemeral disk rồi upload lên Cloud Storage.

## [Pub/Sub AI Inference Single Message Transform (GA)](https://docs.cloud.google.com/pubsub/docs/release-notes) — (Pub/Sub release notes)
**Đây là gì:** Single Message Transform (SMT) là cơ chế biến đổi message ngay trong Pub/Sub không cần subscriber trung gian. Bản GA mới (06/04/2026) thêm loại SMT gọi model Vertex AI: inference của model được gắn vào từng message trước khi xuống subscriber. Cùng đợt còn có Bigtable subscriptions (Preview, 16/04) — stream message thẳng vào Bigtable không cần Dataflow.
**Vì sao đáng đọc:** Nếu sau này cần enrich event (vd. phân loại sentiment review, scoring khách hàng) trong pipeline Pub/Sub của app, giờ làm được ở tầng infra thay vì viết thêm 1 Cloud Run service trung gian.
