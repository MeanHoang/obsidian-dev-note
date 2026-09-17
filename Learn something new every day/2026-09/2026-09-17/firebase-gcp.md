# 🔥 Firebase & GCP — 2026-09-17

> Tuần này GCP đẩy mạnh hướng tiết kiệm chi phí batch job và công cụ kiểm thử trước khi deploy: Cloud Run có delayed jobs giá rẻ, Firestore có Security Rules simulator ngay trong console, BigQuery thêm migration lineage, Firebase CLI siết lại kiểm tra quyền khi deploy.

## ⭐ [Delay execution of a job — Cloud Run](https://docs.cloud.google.com/run/docs/delayed-jobs) — (Cloud Run docs / release notes, 08/09/2026 — Preview)

**Đây là gì:** Cloud Run Jobs là dạng workload chạy-tới-khi-xong (khác Cloud Run Services vốn phục vụ HTTP request) — hợp cho batch: sync dữ liệu, tính toán định kỳ, export report. Tính năng mới "delayed execution" cho phép bạn **đánh dấu job là không gấp**, Google sẽ xếp lịch chạy nó trong cửa sổ thấp tải, đổi lại bạn trả **giá rẻ hơn**.

**Chi tiết:**
- Thời gian hoãn tối đa: **12 giờ** provisioning. Runtime tối đa cho toàn bộ task cũng là 12 giờ, và task timeout tối đa 12 giờ.
- Cam kết của Google: delayed execution **hoàn tất trong vòng 24 giờ** (12h chờ + 12h chạy).
- Bật bằng gcloud (kênh beta):
  ```bash
  gcloud beta run jobs create JOB_NAME \
    --image IMAGE_URL \
    --delay-execution \
    --region=REGION
  ```
  Hoặc YAML: `delayExecution: "true"`. Hoặc tick "Delay execution" trong Console.
- Không cần tạo lại job: một job thường có thể được *execute* ở chế độ delayed và ngược lại, qua flag `--delay-execution` / `--no-delay-execution` trên lệnh execute/update.
- Có `--execute-now` để kích hoạt chạy ngay lúc create — job sẽ chạy trong vòng 12 giờ kế tiếp.
- Giá delayed jobs là **giá động, có thể thay đổi tối đa 1 lần mỗi 30 ngày** (xem trang Cloud Run pricing), nên đừng hardcode giả định chi phí vào budget dài hạn.

**Vì sao đáng đọc:** Joy Loyalty có kha khá job kiểu "chạy được lúc nào cũng được": recompute tier cho toàn bộ member cuối ngày, expire điểm hết hạn, sync lại đơn hàng Shopify bị miss webhook, export dữ liệu sang BigQuery. Những job này hoàn toàn chịu được độ trễ vài giờ → chuyển sang `--delay-execution` là cắt chi phí compute mà không đụng gì tới code. Ngược lại, tuyệt đối **không** dùng cho job ảnh hưởng trải nghiệm merchant/khách (ví dụ cấp điểm sau order, phát coupon) vì hoãn tới 12 tiếng là không chấp nhận được. Ranh giới "urgent vs non-urgent" nên được đặt ngay ở tầng thiết kế job.

## [Security Rules simulator cho Firestore trong Google Cloud console](https://docs.cloud.google.com/firestore/docs/release-notes) — (Firestore release notes, 04/09/2026)

**Đây là gì:** Firestore Security Rules là lớp phân quyền chạy phía server, quyết định request từ client (web/mobile) được đọc/ghi document nào — thứ duy nhất đứng giữa dữ liệu và internet khi bạn cho client truy cập Firestore trực tiếp. Bản cập nhật này đưa **Security Rules simulator** vào Google Cloud console cho cả Firestore Standard và Enterprise edition: bạn "test draft security rules against simulated database requests and evaluate authentication tokens before deploying rules" — tức mô phỏng request và auth token để kiểm tra rule *trước khi* deploy.

**Vì sao đáng đọc:** Widget loyalty của Joy chạy trên storefront của merchant, nghĩa là rules là hàng rào cuối cùng chống việc một khách hàng đọc được dữ liệu điểm/tier của khách khác hoặc của shop khác. Mô phỏng token (ví dụ token mang custom claim `shopId`) trước khi deploy giúp bắt lỗi rule sai ở môi trường an toàn, thay vì phát hiện qua incident. Kết hợp với emulator local là một quy trình review rules khá đủ.

## [Migration lineage service cho BigQuery (Preview)](https://docs.cloud.google.com/bigquery/docs/migration/migration-lineage) — (BigQuery release notes, 16/09/2026)

**Đây là gì:** Một service mới thuộc BigQuery Migration Services, **sinh ra lineage graph** để trực quan hóa dữ liệu chảy như thế nào và các bảng/nguồn kết nối với nhau ra sao trong hệ thống nguồn, phục vụ việc lập kế hoạch migrate sang BigQuery. Quy trình: chạy tool `dwh-migration-dumper` để sinh file log SQL từ nguồn, upload lên Cloud Storage, rồi trace lineage qua Google Cloud console hoặc BigQuery Migration API. Hỗ trợ nguồn như Snowflake và chính BigQuery, và có thể kết hợp với validation để phát hiện sai lệch giữa source và target.

**Vì sao đáng đọc:** Nếu pipeline analytics của Joy Loyalty còn dữ liệu nằm rải rác (Firestore export, warehouse cũ, bảng trung gian), lineage graph giúp trả lời câu hỏi "bảng report này thực sự phụ thuộc vào những nguồn nào" trước khi bạn dám xóa hay đổi schema — đặc biệt hữu ích khi refactor các bảng feed dashboard loyalty revenue.

## [Firebase CLI v15.30.1](https://firebase.google.com/support/release-notes/cli) — (Firebase CLI release notes, 14/09/2026)

**Đây là gì:** Firebase CLI là công cụ dòng lệnh để deploy Functions/Rules/Hosting và chạy emulator. Bản 15.30.1 có vài thay đổi đáng chú ý với người deploy Functions hằng ngày:
- "Fixed declarative security checks to fail fast with an actionable error" khi API cần thiết đang bị disable — tức lỗi thiếu API sẽ báo sớm và rõ ràng thay vì fail giữa chừng.
- Dọn dẹp managed service account khi deploy theo codebase có filter, và xóa service account khi toàn bộ function trong một codebase bị xóa (thay đổi này có từ 15.30.0, 09/09/2026).
- Sinh ETag tất định cho declarative security roles; thêm retry logic khi cập nhật IAM policy để chịu được replication lag.
- Cập nhật Pub/Sub emulator lên 0.8.36.

**Vì sao đáng đọc:** Deploy Functions theo codebase (`firebase deploy --only functions:xxx`) là thao tác hằng ngày ở Joy; retry cho IAM replication lag và fail-fast khi thiếu API trực tiếp giảm số lần deploy hỏng nửa chừng phải chạy lại. Phần dọn service account cũng đáng để ý: nếu bạn từng xóa function mà service account rác vẫn còn, bản này xử lý.
