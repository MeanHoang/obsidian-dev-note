# 🔥 Firebase & GCP — 2026-08-28

> Đáng chú ý nhất: BigQuery DTS đã có connector Shopify ở Preview — một đường no-code để đưa đơn hàng, tồn kho và customer profile vào warehouse, nhưng vẫn cần kiểm tra quyền dữ liệu, schema và trạng thái Preview trước khi đặt vào luồng báo cáo production.

## ⭐ [Zero-code, low-cost data ingestion: New BigQuery DTS capabilities](https://cloud.google.com/blog/products/data-analytics/new-bigquery-data-transfer-service-capabilities) — (Google Cloud Blog, 07/08/2026)

**Đây là gì:** BigQuery Data Transfer Service (DTS) là dịch vụ managed để nạp dữ liệu vào BigQuery mà không phải tự vận hành ETL. Bản cập nhật tháng 8 mở rộng connector, trong đó có connector **Shopify ở Preview** — phù hợp trực tiếp với dữ liệu commerce mà Joy Loyalty cần đối chiếu với event điểm thưởng.

**Chi tiết:**

- DTS là dịch vụ managed, zero-code để tự động đưa dữ liệu vào BigQuery; Google mô tả đây là cách giảm công sức vận hành pipeline tự viết.
- Connector **Shopify (Preview)** trích xuất order history, inventory log và customer profile vào schema phân tích.
- Connector **Klaviyo (Preview)** đưa engagement email/SMS như click, send và open vào warehouse — hữu ích nếu muốn nối lifecycle marketing với loyalty.
- Connector PostgreSQL và MySQL đã **GA**, hỗ trợ cả full lẫn incremental transfer, gồm nguồn on-premise, Cloud SQL và cloud khác.
- BigQuery DTS có SLA uptime tháng **≥99,99%**; đồng thời có remote MCP server managed ở Preview để agent khám phá nguồn và cấu hình/chạy transfer theo quyền người dùng.

**Vì sao đáng đọc:** Đây là lối tắt đáng thử cho analytics merchant: đối chiếu order Shopify với `earn/redeem` event của Joy để phát hiện đơn chưa cộng điểm hoặc tính AOV/tỷ lệ quay lại, thay vì duy trì một ETL Shopify riêng. Vì connector vẫn Preview, chỉ nên chạy POC trên dataset tách biệt, xác nhận incremental sync, quota/API scope và độ trễ dữ liệu trước khi thay pipeline production.

## [Cloud Run instances: singleton runtime dài hạn](https://cloud.google.com/blog/products/serverless/introducing-cloud-run-instances) — (Google Cloud Blog, 27/08/2026)

**Đây là gì:** Cloud Run instances (Preview) là loại runtime mới dành cho workload dài hạn, có trạng thái và phục vụ từng người dùng/agent; khác Cloud Run service vốn scale-to-zero và tối ưu cho request stateless.

**Vì sao đáng đọc:** Một worker cá nhân hoá, agent hỗ trợ nội bộ hoặc tiến trình reconciliation cần đúng một bản chạy liên tục có thể hợp với model này: nó chỉ chạy **một instance, không autoscale**, chạy liên tục tối đa 7 ngày rồi tự restart, có HTTPS URL ổn định và có thể stop/resume. Google nêu chi phí tham khảo 1 vCPU + 1 GiB chạy 30 ngày là $5,70. Không thay thế webhook/order processor của Joy — những luồng bursty, stateless vẫn hợp Cloud Run service/Functions hơn — nhưng là lựa chọn cần biết nếu xây agent vận hành lâu dài.

## [Eval-driven development cho Firebase Agent Skills](https://firebase.blog/posts/2026/08/eval-driven-development-agent-skills) — (Firebase Blog, 11/08/2026)

**Đây là gì:** Firebase mô tả cách họ kiểm chứng agent skills thay vì chỉ viết hướng dẫn rồi tin rằng agent sẽ dùng đúng: skills là checklist theo outcome, phối hợp với Firebase CLI và MCP server để agent tiếp cận API/docs mới nhất.

**Vì sao đáng đọc:** Đây là một mẫu rõ ràng để dựng harness code cho Joy. Firebase tách 3 lớp eval: (1) single-skill với 5–10 case cho mỗi critical user journey, (2) activation eval để skill chỉ kích hoạt đúng lúc, và (3) E2E multi-skill chạy trên Firebase project thật. Áp vào Joy, có thể viết regression cho các luồng rủi ro như webhook Shopify idempotency hoặc Firestore Rules multi-tenant, thay vì chỉ kiểm prompt/đầu ra bằng cảm nhận.

## [Firebase JavaScript SDK 12.17.1: thay đổi App Check và bản vá Firestore](https://firebase.google.com/support/release-notes/js) — (Firebase Release Notes, 04/08/2026)

**Đây là gì:** Release note chính thức của Firebase JavaScript SDK 12.17.1. Với app web, điểm cần chú ý là `initializeAppCheck()` không còn khởi tạo được nếu thiếu `provider`; Firestore Node.js cũng tăng HTTP/2 flow-control window mặc định từ 64 KB lên 256 KB và cho phép chỉnh qua `FirestoreSettings.grpcFlowControlWindow`.

**Vì sao đáng đọc:** Nếu admin/web widget của Joy đang nâng Firebase SDK và khởi tạo App Check theo kiểu cũ, build/runtime có thể hỏng ngay — cần cung cấp provider tường minh và chạy smoke test. Bản này cũng vá lỗ hổng ReDoS trong thay thế template của `FirebaseError`; nên đưa vào đợt dependency update có kiểm soát, đặc biệt với surface nhận input/error từ merchant.
