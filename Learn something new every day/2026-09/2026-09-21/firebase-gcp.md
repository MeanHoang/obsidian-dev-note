# 🔥 Firebase & GCP — 2026-09-21

> Cloud Run cho phép tự tay chốt số instance thay vì autoscaling, Pub/Sub có export subscription thẳng vào Bigtable, Cloud Storage có advisor phát hiện bất thường chi phí, và Firebase CLI vá lỗi Auth trigger gen 2 trong emulator.

## ⭐ [Manual scaling cho Cloud Run services](https://docs.cloud.google.com/run/docs/configuring/services/manual-scaling) — (Google Cloud Documentation)
**Đây là gì:** Thay vì để Cloud Run tự co giãn theo traffic/utilization, bạn ấn định cứng số instance chạy liên tục. Docs nói thẳng: "Manual scaling lets you set a specific instance count, regardless of traffic or utilization" — hữu ích khi bạn muốn tự viết logic scaling từ hệ thống bên ngoài.
**Chi tiết:**
- Bật bằng một flag duy nhất: `gcloud run services update SERVICE --scaling=10`. Đặt `--scaling=0` để tắt service, `--scaling=auto` để quay lại autoscaling.
- Đổi scaling mode (auto ↔ manual) hoặc đổi số instance **không tạo revision mới** — khác hẳn phần lớn thay đổi config khác của Cloud Run.
- Khi bật manual scaling, các setting min/max instances ở cấp revision bị **bỏ qua**. Nếu traffic split cho nhiều revision mà tổng instance count không đủ, sẽ có revision nhận 0 instance và trả lỗi.
- Billing: với instance-based billing, "manually scaled idle instances are billed as *active* instances" — tức là trả giá active 24/7. Chuyển sang request-based billing thì instance rảnh tính theo giá min-instances, rẻ hơn.
- Launch stage: API request dùng `launchStage: BETA` (Preview/Beta), chưa GA.
**Vì sao đáng đọc:** Với Joy Loyalty, các service Cloud Run xử lý webhook Shopify có traffic dạng burst — manual scaling là cách giữ warm pool cố định để né cold start dịp flash sale, nhưng cảnh báo billing "idle = active" ở trên là thứ phải cân trước khi bật, vì nó đắt hơn min-instances thông thường.

## [Bigtable subscriptions cho Pub/Sub (Preview)](https://docs.cloud.google.com/pubsub/docs/bigtable-subscriptions) — (Google Cloud Documentation)
**Đây là gì:** Một loại export subscription ghi thẳng message Pub/Sub vào bảng Bigtable, không cần viết subscriber client hay dựng pipeline Dataflow — "zero ETL".
**Chi tiết:**
- Đang ở Preview, áp dụng điều khoản Pre-GA ("available as is and might have limited support").
- Cần sẵn bảng Bigtable, topic Pub/Sub, và app profile dùng single-cluster routing.
- Vẫn là **at-least-once delivery** → phải tự xử lý duplicate ở phía consumer/schema.
- Docs khuyến nghị: nếu cần transform phức tạp thì dùng Dataflow chứ không dùng subscription này.
**Vì sao đáng đọc:** Pattern "event stream → datastore không cần worker" đúng với luồng activity/points event của app loyalty; kể cả không dùng Bigtable, nó cho thấy hướng Google đang đẩy export subscription để bỏ bớt tầng Cloud Functions trung gian.

## [Storage Intelligence Advisor cho Cloud Storage](https://docs.cloud.google.com/storage/docs/storage-intelligence/advisor-overview) — (Google Cloud Documentation, GA tuần 14–18/09/2026)
**Đây là gì:** Công cụ tự động soi trend và bất thường trong cách bạn dùng Cloud Storage rồi đưa recommendation tối ưu chi phí/hiệu năng, không cần setup gì.
**Chi tiết:**
- Phát hiện 4 nhóm bất thường: spike Class A/B operations trên storage tier lạnh; lỗi rate limiting gây latency/timeout; spike cross-region egress đội chi phí; và storage consumption tăng vượt trend trong 30 ngày.
- Chạy được ở scope organization, folder và project; hỗ trợ VPC Service Controls cho project nằm trong service perimeter.
- Trình bày theo bộ ba metrics → findings → next steps, kèm drill-down xuống resource gây ra thay đổi.
**Vì sao đáng đọc:** Nhóm anomaly "Class A/B operations trên cold tier" và "cross-region egress" chính là hai cách phổ biến nhất để hoá đơn GCS phình ra âm thầm khi app lưu asset/export báo cáo cho merchant.

## [Firebase CLI 15.30.2](https://firebase.google.com/support/release-notes/cli) — (Firebase Release Notes, 17/09/2026)
**Đây là gì:** Bản vá CLI mới nhất, đáng chú ý nhất là sửa lỗi emulator làm 2nd gen Firebase Authentication triggers (`onUserCreated` và `onUserDeleted`) không chạy được ở local.
**Chi tiết:**
- Sửa bug emulator với Auth triggers gen 2 — trước đó test local flow tạo/xoá user gần như vô nghĩa.
- Cải thiện format cho prompt về parameter và secret của Cloud Functions.
- Cập nhật Firebase SQL Connect local toolkit lên v3.4.20.
**Vì sao đáng đọc:** Nếu bạn đang chuyển Cloud Functions sang v2 và dùng Auth trigger để khởi tạo hồ sơ member, đây là bản đầu tiên cho phép test toàn bộ flow đó trong emulator thay vì phải deploy lên môi trường thật.
