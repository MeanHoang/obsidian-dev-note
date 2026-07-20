# 🔥 Firebase & GCP — 2026-06-18

> Tuần này khá thưa ở release notes core (Firestore/Functions/Pub/Sub trống đúng cửa sổ), nhưng BigQuery có 1 tin GA đáng giá — embedding tự sinh & tự đồng bộ ngay trong bảng, bỏ luôn pipeline embedding thủ công.

## ⭐ [BigQuery autonomous embedding generation — GA](https://docs.cloud.google.com/bigquery/docs/autonomous-embedding-generation) — (BigQuery release notes, 17/06/2026)
**Đây là gì:** Tính năng cho phép khai báo 1 cột embedding "generated" ngay trong schema bảng. BigQuery tự sinh vector cho cột này dựa trên 1 cột nguồn (text/ObjectRef), và mỗi khi dữ liệu nguồn thay đổi thì tự cập nhật lại embedding — không cần viết pipeline detect-row → gọi model → ghi lại bảng. Trước đây phải tự dựng quy trình 5 bước này và tự lo rate limit + đồng bộ.
**Chi tiết:**
- Khai báo bằng DDL (chỉ SQL, không dùng `bq mk`/`bq update` để tạo cột này). Cú pháp cốt lõi:
  ```sql
  CREATE TABLE dataset.table (
    source_col STRING,
    embedding_col STRUCT<result ARRAY<FLOAT64>, status STRING>
      GENERATED ALWAYS AS (
        AI.EMBED(source_col, { model => 'embeddinggemma-300m' })
      )
      STORED OPTIONS(asynchronous = TRUE)
  );
  ```
  Cột embedding là `STRUCT` gồm `result` (mảng float) và `status`. Bắt buộc `asynchronous = TRUE`.
- 2 cách chọn model: `model => 'embeddinggemma-300m'` (model built-in, **không tính phí Agent Platform**) hoặc `connection_id => 'project.region.connection'` để gọi endpoint ngoài (vd `text-embedding-005`) — cách sau chịu quota & phí Agent Platform.
- Embedding được ghi bằng background DML job. Mặc định dùng on-demand slots; muốn chi phí ổn định thì tạo reservation `job_type = 'BACKGROUND'`. Theo dõi cost qua label `bigquery_ml_job` trong Cloud Billing.
- Giới hạn cần biết: mỗi bảng **tối đa 1 cột embedding tự sinh**; không ghi trực tiếp vào cột này (cấm DML/streaming/`bq load`/`bq copy -a`); copy/clone/snapshot **chỉ copy data, không copy cấu hình generation**. Khuyến nghị nạp dữ liệu theo batch, tránh DML cập nhật liên tục vì "concurrent DML operations can cause delays and temporary failures in embedding generation".
- Sau khi có embedding, dùng `AI.SEARCH(TABLE dataset.table, 'embedding_col', 'query')` để semantic search; row nào chưa có embedding sẽ bị bỏ qua. Vector index huấn luyện sau khi ≥80% row đã có embedding.
**Vì sao đáng đọc:** Joy Loyalty nếu muốn làm semantic search trên dữ liệu loyalty (vd gom nhóm khách theo hành vi, tìm reward "gần giống", phân tích feedback/review từ Shopify) thì giờ chỉ cần đẩy data thô vào BigQuery và để cột embedding tự cập nhật — bỏ được hẳn 1 Cloud Function/Pub/Sub pipeline chuyên đi gọi embedding model rồi ghi ngược lại bảng, giảm cả code lẫn chi phí vận hành.

## [Firebase CLI v15.20.0 bỏ prompt xoá SQL Connect khi `firebase deploy`](https://firebase.google.com/support/releases) — (Firebase release notes, 11/06/2026)
**Đây là gì:** Bản CLI mới. Release note ghi: "This version removes the prompt and backend deletion of Firebase SQL Connect services during `firebase deploy`" — tức `firebase deploy` không còn tự hỏi rồi xoá service SQL Connect ở backend nữa. Kèm fix lỗi init và hỗ trợ bucket GCS cho test results.
**Vì sao đáng đọc:** Nếu pipeline CI/CD của Joy Loyalty chạy `firebase deploy` không tương tác, việc CLI tự prompt/xoá service từng là rủi ro xoá nhầm tài nguyên; bản này an toàn hơn cho deploy tự động. Nên nâng CLI trong runner CI để tránh hành vi cũ.

## [BigQuery Studio thêm Gemini Code Assist trong Jobs explorer + dời Table Explorer sang Reference panel](https://docs.cloud.google.com/bigquery/docs/release-notes) — (BigQuery release notes, 15–16/06/2026)
**Đây là gì:** Hai cải tiến UI/AI cho BigQuery Studio. (1) 15/06 — dùng Gemini Code Assist ngay trong Jobs explorer, Job details, Job history và Capacity management để troubleshoot và phân tích vấn đề hiệu năng của job (Preview). (2) 16/06 — "Table Explorer behavior is moving to the **Reference** panel", chuyển trong "July 2026 or later".
**Vì sao đáng đọc:** Khi job phân tích loyalty (vd báo cáo điểm thưởng, cohort retention) chạy chậm hoặc lỗi, có thể nhờ Gemini giải thích ngay tại chỗ job đang fail thay vì tự mò slot/stage — rút ngắn debug. Lưu ý thay đổi vị trí Table Explorer để khỏi bối rối khi điều hướng console.

## [Firebase ML sẽ shutdown 15/06/2027 — bắt đầu lên kế hoạch migrate](https://firebase.google.com/support/releases) — (Firebase release notes, 11/06/2026)
**Đây là gì:** Firebase ra thông báo deprecation: Firebase ML sẽ tắt vào 15/06/2027. Hướng migrate: model TensorFlow Lite chuyển sang Cloud Storage; lệnh gọi Cloud Vision API chuyển sang Firebase AI Logic hoặc gọi thẳng Cloud Vision API.
**Vì sao đáng đọc:** Tin "kế hoạch" hơn là "làm ngay", nhưng nếu app/admin của Joy Loyalty có dùng Firebase ML cho bất kỳ tính năng vision/ML nào thì nên đưa vào backlog migrate sớm để khỏi bị ép cuối kỳ.

---
**Đã kiểm tra, KHÔNG có tin mới trong cửa sổ 12–18/06/2026:** Firestore release notes (entry gần nhất là 01/06 rồi nhảy về tháng 4), Cloud Functions / Cloud Run functions release notes (trống cả tháng 6/2026), Pub/Sub release notes (entry mới nhất là tháng 4/2026). App Hosting / Genkit không có release note đề ngày cụ thể trong tuần này nên không đưa vào (tránh trích sai ngày).
