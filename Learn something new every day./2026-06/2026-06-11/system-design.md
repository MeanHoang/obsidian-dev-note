# 🏗️ System Design — 2026-06-11

> Tuần này nổi bật triết lý "simple at scale": Shopify chạy 50k+ site nội bộ trên 1 VM $200/tháng, Cloudflare giảm 50% query time chỉ bằng cách sửa lock contention, Pinterest dedupe URL bằng content fingerprint thay vì rule thủ công.

## ⭐ [Quick: Shopify's internal hosting platform for the AI era](https://shopify.engineering/quick) — (shopify.engineering, 10/06/2026)
**Đây là gì:** Bài viết về Quick — platform hosting nội bộ của Shopify, cho phép bất kỳ nhân viên nào (kể cả non-engineer dùng AI sinh code) drop 1 folder HTML và nhận về 1 URL bảo mật chỉ nhân viên truy cập được.
**Chi tiết:**
- Scale: hơn **50.000 site** đã được tạo, hơn **50% nhân viên Shopify** từng deploy ít nhất 1 site — tất cả chạy trên **1 VM duy nhất giá ~$200/tháng**.
- Kiến trúc tối giản trên GCP: file site nằm trong **Google Cloud Storage bucket**, NGINX mount bucket qua **gcsfuse** như filesystem local, **Identity-Aware Proxy** lo authentication, 1 backend server (Node.js, sau migrate sang Go để tăng hiệu năng) cung cấp shared API: database, file upload, LLM access, data warehouse, WebSockets, user identity.
- Lệnh `quick deploy` thực chất chỉ wrap `gcloud rsync` — deploy = sync folder lên bucket, không build pipeline, không container.
- Trade-off chủ đích: **không** custom backend, không cron job, không permission per-site — mọi site public với toàn bộ nhân viên. Sự ràng buộc này lại thúc đẩy sáng tạo: hình thành hệ sinh thái shared library, dashboard, game, tool cộng tác nội bộ.
- Bài học chính: khi AI khiến việc "build" trở nên rẻ, bottleneck mới là việc "share" — platform tốt là platform loại bỏ friction deploy chứ không phải thêm tính năng.
**Vì sao đáng đọc:** Bạn đang dùng đúng stack này (GCP, Node/JS) — pattern GCS + gcsfuse + IAP + 1 server API dùng chung là blueprint rẻ và thực dụng để Joy Loyalty dựng internal tools/prototype hub mà không cần thêm hạ tầng.

## [Cloudflare Identifies Query Planning Bottleneck in ClickHouse](https://www.infoq.com/news/2026/06/cloudflare-clickhouse-bottleneck/) — (InfoQ, 06/06/2026)
**Đây là gì:** Case study Cloudflare profiling pipeline billing trên ClickHouse (2+ petabyte, hàng triệu rows/giây) và phát hiện 45% CPU time nằm trong 1 hàm `filterPartsByPartition` — gốc rễ là lock contention trên 1 mutex bảo vệ danh sách parts của bảng.
**Vì sao đáng đọc:** Bài học "coordination layer mới là thủ phạm, không phải resource exhaustion" + fix bằng shared lock thay exclusive lock giúp giảm 50% query duration — tư duy profiling low-level này áp dụng được khi app Joy gặp nghẽn ở Firestore/BigQuery mà metric high-level không chỉ ra nguyên nhân.

## [Pinterest Uses Content Fingerprints for URL Deduplication across Millions of Domains](https://www.infoq.com/news/2026/06/pinterest-miqps-url-dedup/) — (InfoQ, 08/06/2026)
**Đây là gì:** Pinterest xây MIQPS (Minimal Important Query Param Set) — hệ thống xác định query param nào thực sự thay đổi nội dung trang bằng cách render + so content fingerprint, thay vì allowlist tĩnh; phần render đắt đỏ chạy offline, runtime chỉ apply rule đã precompute.
**Vì sao đáng đọc:** Pattern "offline expensive analysis → precomputed rules ở runtime + conservative defaults" rất hợp với app Shopify xử lý data merchant đa dạng — ví dụ chuẩn hóa referral/UTM links hoặc dedupe webhook events trong Joy Loyalty.

## [Building a File Semantic Analyzer: Guarding Outbound Data at Scale with AI](https://www.uber.com/us/en/blog/ubers-file-analyzer/) — (Uber Engineering, 04/06/2026)
**Đây là gì:** Uber xây hệ thống DLP (Data Loss Prevention) dùng LLM phân loại ~150.000 file/năm rời khỏi tổ chức theo ngữ nghĩa thay vì keyword matching; pipeline gồm 5 khối: file connectors → processing (OCR) → prompt building → rule-based decision engine → human-in-the-loop.
**Vì sao đáng đọc:** Kiến trúc "LLM phân loại + decision engine rule-based + human validation" (giảm 97% false positive) là template tốt nếu Joy muốn thêm AI vào pipeline xử lý data merchant mà vẫn giữ output có thể giải trình được.
