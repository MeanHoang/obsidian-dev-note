# 🔥 Firebase & GCP — 2026-06-17

> Tuần này BigQuery dồn dập update: billing per-giây tiết kiệm chi phí, Gemini Cloud Assist tối ưu query, và vài cải tiến nhỏ cho AI functions + streaming.

## ⭐ [BigQuery fluid scaling — billing per-giây cho autoscaling reservations (GA)](https://docs.cloud.google.com/bigquery/docs/release-notes) — (Google Cloud release notes, 03/06/2026)

**Đây là gì:** Fluid scaling là mô hình autoscaling mới của BigQuery, tính tiền slot theo **từng giây** thay vì áp mức tối thiểu, để chi phí slot khớp sát với lượng query thực tế. "Slot" là đơn vị compute của BigQuery; "reservation" là khối slot bạn đặt trước. Đã GA (general availability).

**Chi tiết:**
- Nguyên văn release note: *"BigQuery fluid scaling, which provides per-second billing with no minimum duration for autoscaling reservations, is generally available (GA)."*
- Bỏ mức **tối thiểu 1 phút** của autoscaling cũ — slot capacity điều chỉnh lên/xuống theo từng giây, phù hợp workload bursty (lúc cao lúc thấp).
- Theo các nguồn FinOps, tiết kiệm tới **~34%** so với mô hình autoscaling cũ với workload biến động nhanh (xác nhận thêm tại [FinOps Weekly 13/06/2026](https://finopsweekly.com/news/gcp-updates-2026-06-13/)).
- Cách bật: enable ở cấp **administration-project**, liệt kê reservation trong option `preflight_fluid_autoscaling_reservations`.
- Trade-off: chỉ có lợi nếu workload thực sự bursty; query chạy đều/dài thì lợi ích billing per-giây không đáng kể.

**Vì sao đáng đọc:** Joy Loyalty đẩy event loyalty (earn/redeem points) vào BigQuery để phân tích — các batch query chạy theo đợt là dạng bursty điển hình, bật fluid scaling có thể cắt hoá đơn BigQuery rõ rệt mà không sửa code.

## [Gemini Cloud Assist tối ưu SQL query + theo dõi cost trong BigQuery (Preview/GA)](https://docs.cloud.google.com/bigquery/docs/release-notes) — (Google Cloud release notes, 11–15/06/2026)

**Đây là gì:** BigQuery editions giờ có Gemini Cloud Assist phân tích SQL của bạn và **đề xuất cách viết lại để query nhanh/rẻ hơn**, đồng thời hỗ trợ performance monitoring và cost optimization.

**Chi tiết:**
- 15/06: nguyên văn *"Use Gemini Cloud Assist to analyze your SQL queries and receive recommendations to optimize query performance in BigQuery."* (cho khách BigQuery editions).
- 11/06: Gemini Cloud Assist hỗ trợ **performance monitoring + cost optimization** (Preview); khôi phục hàm `AI.KEY_DRIVERS` để tìm segment dữ liệu tác động đến metric.
- 15/06 còn có: tích hợp Gemini Code Assist vào **Jobs explorer / job performance pages** để debug query chậm ngay tại chỗ.

**Vì sao đáng đọc:** Thay vì tự đoán vì sao query loyalty analytics tốn slot, bạn có thể nhờ Gemini chỉ thẳng chỗ thiếu partition/cluster — tiết kiệm thời gian tối ưu cost hằng ngày.

## [BigQuery continuous queries hỗ trợ ARRAY_AGG và STRING_AGG (Preview)](https://docs.cloud.google.com/bigquery/docs/release-notes) — (Google Cloud release notes, 10/06/2026)

**Đây là gì:** Continuous queries là query **chạy liên tục theo thời gian thực** trên dữ liệu streaming vào BigQuery. Giờ chúng hỗ trợ thêm 2 hàm aggregate phổ biến: `ARRAY_AGG` (gom giá trị thành mảng) và `STRING_AGG` (nối chuỗi).

**Vì sao đáng đọc:** Nếu Joy Loyalty stream event qua Pub/Sub → BigQuery, continuous query có thể gom realtime danh sách action gần nhất của 1 customer (ARRAY_AGG) mà không cần job batch riêng.

## [BigQuery AI functions nhận trực tiếp ObjectRef (không cần OBJ.GET_ACCESS_URL)](https://docs.cloud.google.com/bigquery/docs/release-notes) — (Google Cloud release notes, 12/06/2026)

**Đây là gì:** Các hàm AI trong BigQuery giờ chấp nhận thẳng giá trị `ObjectRef` (tham chiếu tới object trong Cloud Storage) mà không phải bọc qua `OBJ.GET_ACCESS_URL` để lấy URL truy cập trước.

**Vì sao đáng đọc:** Giảm bước boilerplate khi chạy AI/ML trên dữ liệu (ảnh, file) lưu ở GCS — ít SQL phải viết hơn cho các query phân tích có dùng AI function.

---
*Tuần này Firestore / Cloud Run / Cloud Functions / Pub/Sub không có release note mới trong cửa sổ 10–17/06 (đã kiểm tra trực tiếp các trang release notes); các tin nổi bật của chúng đã đăng ở các kỳ trước nên bỏ để tránh trùng.*
