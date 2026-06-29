# 🏗️ System Design — 2026-06-18

> Hôm nay xoay quanh "đẩy việc xuống client để giảm latency" (GitHub Issues), kinh tế hạ tầng của Kafka diskless, và 2 pattern nền tảng cho hệ phân tán: cell-based isolation và push-based consumer.

## ⭐ [From latency to instant: Modernizing GitHub Issues navigation performance](https://github.blog/engineering/architecture-optimization/from-latency-to-instant-modernizing-github-issues-navigation-performance/) — (github.blog, 14/05/2026)
**Đây là gì:** Case study GitHub tăng tốc điều hướng trang Issues bằng kiến trúc "client-first" — thay vì tối ưu backend, họ chuyển việc xuống trình duyệt: lưu dữ liệu vào **IndexedDB** (database trong browser) và dùng pattern **stale-while-revalidate** (render ngay từ cache cũ, rồi âm thầm fetch lại bản mới ở background). Kết hợp **Service Worker** (script chạy nền trong browser, chặn request mạng) để trả về cache thay vì gọi server.
**Chi tiết:**
- Render tức thì từ cache local, sau đó revalidate nền → tỷ lệ "instant navigation" tăng từ **4% lên 22%** số lần chuyển trang React.
- Chiến lược **preheating**: chủ động nạp cache từ các trang "high-intent" (danh sách issue, dashboard) thay vì prefetch bừa → cache-hit ratio nhảy lên **96%**, instant navigation đạt **~70%** cho luồng React.
- Kết quả P10 (10% request nhanh nhất): từ ~600ms xuống **70ms (nhanh 8.5x)**; P50 từ ~1200ms xuống 700ms; nhưng P90 gần như không đổi (~2400ms → 2100ms) vì hard navigation vẫn phải chờ JS boot.
- Trade-off họ chấp nhận: **staleness có kiểm soát** — server/cache lệch nhau 4.7% là mức chấp nhận được để đổi lấy cảm giác nhanh; preheating tốn thêm băng thông nền.
**Vì sao đáng đọc:** Joy Loyalty embed trong Shopify Admin (Polaris/React), latency điều hướng tab loyalty là chất lượng cảm nhận trực tiếp — pattern IndexedDB + stale-while-revalidate cho dữ liệu ít đổi (danh sách reward, tier) có thể biến trang loyalty từ "loading spinner" thành "instant" mà không đụng tới Cloud Run.

## [Architecting Cloud-Native Kafka: from Tiered Storage towards a Diskless Future](https://www.infoq.com/articles/architecting-cloud-native-kafka/) — (infoq.com, 26/05/2026)
**Đây là gì:** Bài phân tích hướng tiến hóa của Kafka về cloud-native. **Tiered Storage (KIP-405)** tách lưu trữ thành 2 lớp: lớp local tối ưu độ trễ + lớp remote dùng object storage (S3) tối ưu dung lượng. **Diskless (KIP-1150)** là đề xuất đẩy toàn bộ "ranh giới durability" sang object storage, bỏ luôn đĩa broker làm nguồn sự thật.
**Vì sao đáng đọc:** Joy Loyalty đang dùng Pub/Sub trên GCP, nhưng tư duy "tách hot tier (latency) khỏi cold tier (object storage rẻ)" áp thẳng được vào việc archive event loyalty vào Cloud Storage/BigQuery — diskless hứa hẹn giảm tới 94% chi phí hạ tầng nhưng đổi lại latency ~1.5s, nhắc ta rằng "rẻ" luôn có cái giá về độ trễ.

## [How Cell-Based Architecture Enhances / Adoption Guidelines](https://www.infoq.com/articles/cell-based-architecture-adoption-guidelines/) — (infoq.com, 04/11/2024)
**Đây là gì:** **Cell-based architecture** là cách chia hệ thống thành nhiều "cell" tự trị, mỗi cell có đủ tài nguyên riêng (data store, compute) và **không share state**. Dùng **bulkhead pattern** (vách ngăn như khoang tàu thủy) để cô lập lỗi: 1 cell sập chỉ ảnh hưởng phần nhỏ user, giảm **blast radius** (bán kính ảnh hưởng của sự cố).
**Vì sao đáng đọc:** Khi Joy Loyalty có nhiều merchant lớn, "noisy neighbor" — 1 merchant traffic khủng làm chậm cả hệ — là rủi ro thật; tư duy cell (shard merchant vào nhóm Firestore/Cloud Run riêng) là cách giới hạn để sự cố 1 cụm không kéo sập toàn bộ app.

## [Building and Scaling a Platform with Project-as-a-Service](https://www.infoq.com/news/2026/06/platform-project-as-a-service/) — (infoq.com, 11/06/2026)
**Đây là gì:** **Project-as-a-Service** là cách platform team cho dev tạo nguyên môi trường (namespace, RBAC, resource quota) chỉ bằng **1 file YAML** — gói sẵn setup để dev khỏi tự cấu hình. Bài học cốt lõi: chuyển từ "tự do tuyệt đối" (gây phân mảnh, mỗi team giải quyết 1 kiểu) sang "paved road" (đường mòn chuẩn hóa, làm đúng = làm dễ nhất).
**Vì sao đáng đọc:** Dù team nhỏ, mindset "paved road" rất đáng cho dev Firebase/GCP — chuẩn hóa template Cloud Functions/Firestore rules + IAM thành 1 cấu hình lặp lại được giúp khỏi setup lại từ đầu mỗi feature loyalty mới, và giảm cấu hình lệch nhau giữa các môi trường.

## [Uforwarder: Uber's Scalable Kafka Consumer Proxy for Event-Driven Microservices](https://www.infoq.com/news/2026/02/uber-uforwarder-kafka-push-proxy/) — (infoq.com, 23/02/2026)
**Đây là gì:** **uForwarder** là proxy **push-based** cho Kafka của Uber (open source). Thay vì service tự **pull** message, proxy đứng giữa và dùng gRPC **push** event xuống consumer. Giải quyết **head-of-line blocking** (1 message lỗi làm kẹt cả partition) bằng "out-of-order commit tracker": đẩy message hỏng sang dead letter queue rồi cho commit pointer chạy tiếp.
**Vì sao đáng đọc:** Joy Loyalty xử lý event Shopify qua Pub/Sub (vốn đã push-based) — nhưng pattern **DelayProcessManager** (pause/resume từng partition để backpressure mượt) và tách message lỗi sang DLQ thay vì retry kẹt là bài học trực tiếp để webhook/event handler không bị 1 order lỗi làm nghẽn cả luồng tích điểm.
