# 🔥 Firebase & GCP — 2026-09-04

> Cloud Run có health check + failover đa region không tốn thêm phí, upgrade tool 1st gen lên Cloud Run functions GA, BigQuery thêm identity column, và Remote Config chuyển sang tính tiền theo lượt fetch.

## ⭐ [Making highly available, multi-region Cloud Run services just got easier](https://cloud.google.com/blog/products/serverless/cloud-run-multi-region-services-enhanced-for-high-availability) — (Google Cloud Blog, 21/07/2026)

**Đây là gì:** Google bổ sung 2 tính năng cho Cloud Run — **readiness probes** (health check ở mức instance) và **service health** (tổng hợp health theo từng region) — để service đa region tự động fail traffic sang region khỏe mạnh khi có sự cố, thay vì phải xử lý thủ công.

**Chi tiết:**
- **Readiness probes**: health check ở mức từng instance, quyết định khi nào container sẵn sàng nhận traffic; cho phép theo dõi số instance healthy/unhealthy theo từng region.
- **Service health**: gom kết quả readiness probe của các instance để tính health của service trong mỗi region, rồi expose ra qua serverless network endpoint group (NEG) của region đó. Hoạt động cho cả single-region lẫn multi-region service.
- Khi ghép với **global external application load balancer**, traffic tự động fail away khỏi region unhealthy **trong vòng vài giây**. App chạy private network thì dùng cross-regional internal application load balancer.
- **Multi-region services** cho phép deploy sang nhiều region bằng **một lệnh duy nhất** — đây là phần bỏ đi cấu hình phức tạp trước đây.
- **Giá**: có ở tất cả region của Cloud Run, **không tính thêm phí**; chỉ trả CPU/memory tiêu chuẩn để chạy readiness probe.
- Bài viết nhấn mạnh trade-off quan trọng: HA ở tầng compute là chưa đủ — phải loại bỏ single point of failure ở **mọi tầng, kể cả database**, có replication cross-region và khớp với yêu cầu RPO. Google gợi ý dùng các managed multi-region như Firestore, Spanner, Cloud Storage, Cloud SQL.

**Vì sao đáng đọc:** Joy Loyalty phục vụ merchant Shopify toàn cầu và webhook Shopify không chờ được — nếu Cloud Run service ở một region chết, readiness probe + global LB sẽ đẩy traffic sang region khác trong vài giây mà không tốn thêm tiền; và vì Firestore đã là multi-region nên phần data layer coi như đã sẵn sàng cho mô hình này.

## [Cloud Run functions upgrade tool đạt GA + Go 1.27 GA](https://docs.cloud.google.com/functions/docs/release-notes) — (Cloud Run functions release notes, 19/08/2026 & 01/09/2026)

**Đây là gì:** Công cụ tự động upgrade **Cloud Functions 1st gen sang Cloud Run functions** đã lên General Availability (ghi nhận 10/08 và 19/08/2026). Cùng nhóm release notes, ngày 01/09/2026 runtime **Go 1.27 lên GA**.

**Vì sao đáng đọc:** Nếu Joy Loyalty còn function 1st gen sót lại (webhook handler cũ, cron job cũ), đây là đường migration chính thức có tool hỗ trợ thay vì viết lại tay — đáng rà soát danh sách function 1st gen trong project ngay tuần này.

## [BigQuery: identity column, BigQuery Graph GA, pipeline lưu trong Git folder](https://docs.cloud.google.com/bigquery/docs/release-notes) — (BigQuery release notes, 31/08/2026)

**Đây là gì:** Đợt release notes cuối tháng 8 của BigQuery gồm: **identity columns** (cột auto-increment, tự sinh số nguyên duy nhất khi insert row) ở bản preview; khả năng **create/store/manage pipelines trong Git folders** (preview, và quản lý pipeline theo folder đạt GA); **BigQuery Graph GA** kèm câu lệnh `CALL` và các hàm path inspection `IS_ACYCLIC`, `IS_SIMPLE`, `IS_TRAIL`; hỗ trợ **TabFM** — foundation model cho dữ liệu dạng bảng của Google, chạy regression/classification zero-shot qua hàm `AI.PREDICT` (preview).

**Vì sao đáng đọc:** Identity column bỏ được cái pattern tự sinh ID khi ETL dữ liệu loyalty từ Firestore sang BigQuery; còn TabFM qua `AI.PREDICT` mở ra hướng chấm điểm churn/retention của member ngay trong SQL mà không phải dựng pipeline ML riêng.

## [Firebase Remote Config chuyển sang usage-based pricing, A/B Testing thành tính năng native](https://firebase.google.com/support/releases) — (Firebase release notes, 01/09/2026)

**Đây là gì:** Remote Config áp dụng giá theo mức sử dụng: **free tier 100.000 fetch request/ngày**, vượt thì trả theo pay-as-you-go trên gói Blaze. Toàn bộ tính năng (Personalization, Rollouts, tích hợp A/B Testing) vẫn miễn phí. Đồng thời **A/B Testing được tích hợp thẳng vào Remote Config** như tính năng native, chạy experiment ngay trong vòng đời template của Remote Config.

**Vì sao đáng đọc:** Nếu Joy Loyalty dùng Remote Config để bật/tắt feature flag cho widget loyalty phía storefront, số fetch giờ là một dòng chi phí thật — cần cache config phía client và tránh fetch mỗi lần page load.

## [Firestore hỗ trợ region Bangkok `asia-southeast3`](https://docs.cloud.google.com/firestore/docs/release-notes) — (Firestore release notes, 11/08/2026)

**Đây là gì:** Firestore bổ sung region `asia-southeast3` (Bangkok) vào danh sách location được hỗ trợ.

**Vì sao đáng đọc:** Thêm một lựa chọn region gần Việt Nam bên cạnh `asia-southeast1` (Singapore) — đáng cân nhắc khi tạo database mới hoặc khi merchant khu vực Đông Nam Á nhạy cảm với latency đọc/ghi điểm thưởng.
