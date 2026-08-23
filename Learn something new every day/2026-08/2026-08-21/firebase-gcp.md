# 🔥 Firebase & GCP — 2026-08-21

> BigQuery công bố loạt tối ưu tự động (nhanh hơn tới 35%, giảm tới 40% slot) mà dev không phải sửa 1 dòng SQL; bên cạnh đó Cloud Run functions chốt GA công cụ migrate gen1 → gen2 và bổ sung runtime Node.js 26.

## ⭐ [Agentic Future Ready With BigQuery: Continually Improving Price-Performance, Zero Effort](https://cloud.google.com/blog/products/data-analytics/bigquery-performance-optimizations) — (cloud.google.com/blog, 07/08/2026)

**Đây là gì:** Bài tổng kết các tối ưu engine mà BigQuery đã âm thầm bật cho mọi khách hàng. Điểm mấu chốt: đây là *transparent optimization* — tối ưu chạy ở tầng engine, không yêu cầu rewrite query, đổi schema hay đổi pipeline. "Slot" là đơn vị năng lực tính toán của BigQuery, và giảm slot usage = giảm tiền trực tiếp.

**Chi tiết:**
- **History-Based Optimizations (HBO)**: hệ thống tự học, thu thập runtime statistics từ các lần chạy trước của cùng một query rồi tự áp dụng tối ưu có lợi. Kết quả bài nêu: giảm tới **50% P90 execution time** và tới **15% slot usage**. Cơ chế closed-loop tự sửa: nếu tối ưu không cải thiện thì bị reject → tránh regression.
- **Advanced Runtime — enhanced vectorization**: tận dụng SIMD của CPU, xử lý trực tiếp dữ liệu ở dạng dictionary/run-length encoding thay vì giải nén trước. Bài nêu tăng tốc **tới 10x** trên query đủ điều kiện, giảm **tới 40% slot time** tổng thể.
- **Short query optimizations**: giảm số stage phân tán để bớt shuffle, dùng symmetric multi-processing (SMP) bên trong mô hình MPP. Kết quả: slot usage thấp hơn **tới 10x** cho query ngắn, **P99 sub-second latency**, throughput cao hơn **tới 3x** ở một số workload.
- **Fluid scaling (autoscaler)**: billing slot theo **từng giây**, đưa về đúng mô hình pay-per-use. Bài nêu giảm trung bình **tới 34%** chi phí cho workload autoscaling.
- **Open lakehouse (Apache Iceberg)**: các kỹ thuật vốn dành cho bảng native nay áp cho format mở — automatic filter pushdown, CMETA (Column Metadata Index) pruning, page skipping và asynchronous read ở tầng I/O.
- Tổng kết 2025: hiệu năng query tốt hơn **tới 35%**, chi phí xử lý query (slot) giảm **tới 40%**. Bài khẳng định rõ: *"Users literally do nothing"* — không cần rewrite app, sửa SQL hay đổi schema.

**Vì sao đáng đọc:** Joy Loyalty đẩy event loyalty (earn/redeem/tier change) sang BigQuery để làm analytics và merchant report — đây đúng là loại workload recurring dashboard + ELT pipeline mà HBO nhắm tới. Nghĩa là hoá đơn BigQuery tháng này có thể tự giảm mà không cần làm gì; nhưng cũng đáng review lại: nếu đang dùng slot reservation cố định thay vì autoscaling, bạn đang bỏ lỡ phần per-second billing. Đây là lúc benchmark lại vài query report nặng nhất trước khi quyết định tối ưu thủ công — có thể engine đã làm hộ rồi.

## [Cloud Run functions release notes — upgrade tool GA, Node.js 26, Go 1.27](https://docs.cloud.google.com/functions/docs/release-notes) — (docs.cloud.google.com)

**Đây là gì:** Release notes chính thức của Cloud Run functions (tên mới của Cloud Functions). Ba mục đáng chú ý gần nhất: **10/08/2026** công cụ upgrade từ Cloud Functions gen 1 sang nền tảng Cloud Run functions chuyển sang **General Availability**; **27/07/2026** runtime **Node.js 26** vào Preview; **19/08/2026** runtime **Go 1.27** vào Preview, đồng thời vòng đời hỗ trợ Go được đồng bộ theo chu kỳ release của cộng đồng Go.

**Vì sao đáng đọc:** Nếu Joy Loyalty còn function gen 1 sót lại (webhook Shopify cũ, cron job scheduled), tool migrate giờ đã GA — tức có SLA và không còn rủi ro "preview đổi API". Chuyển sang Cloud Run functions kéo theo concurrency > 1 mỗi instance, tiết kiệm đáng kể cho webhook traffic bursty của Shopify. Node.js 26 mới Preview nên chưa nên đưa vào production path xử lý order webhook.

## [Zero-flicker Firestore SSR with React](https://firebase.blog/posts/2026/06/firestore-serialization-react) — (firebase.blog, 24/06/2026)

**Đây là gì:** Bài của Jeff Huleatt (Developer Relations Engineer) xử lý bài toán kinh điển khi kết hợp server-side rendering với database realtime: server render xong một lần, client mount lại và fetch lần nữa → màn hình nháy (flicker) và tốn thêm 1 lượt đọc Firestore. Giải pháp dùng bộ API dành riêng cho SSR: `querySnapshotFromJSON` và `onSnapshotResume` — serialize kết quả query ở server, deserialize ở client để render ngay lập tức, rồi *resume* listener realtime từ đúng điểm đó thay vì mở listener mới.

**Vì sao đáng đọc:** App Shopify embedded của Joy Loyalty chạy React (vì Polaris) và mọi lượt đọc Firestore thừa đều nhân lên theo số merchant. Pattern resume listener này cắt được vòng fetch trùng khi load trang admin, đồng thời bỏ được state loading nhấp nháy trên bảng danh sách reward/customer — vừa giảm chi phí đọc vừa cải thiện cảm giác tốc độ.

## [Pub/Sub release notes — AI Inference SMT lên GA, Bigtable subscriptions](https://docs.cloud.google.com/pubsub/docs/release-notes) — (docs.cloud.google.com)

**Đây là gì:** **SMT (Single Message Transform)** là cơ chế biến đổi từng message ngay trong Pub/Sub — validate, filter, enrich, mask — mà không cần dựng service trung gian. Release notes ghi nhận **06/04/2026** AI Inference SMT đạt **general availability**: cho phép lấy inference từ model Vertex AI trên message Pub/Sub, kết quả được gắn kèm vào message để downstream xử lý. Ngoài ra **16/04/2026** có Bigtable subscriptions (stream thẳng Pub/Sub → Bigtable, Preview) và **17/04/2026** Pub/Sub remote MCP server lên GA để quản lý topic/subscription/snapshot.

**Vì sao đáng đọc:** Pipeline event của app loyalty (order created → tính điểm) hiện thường phải qua một Cloud Function chỉ để reshape hoặc lọc payload webhook Shopify. SMT (bao gồm JavaScript UDF — viết JS thuần, đúng stack) cho phép đẩy logic đó xuống tầng Pub/Sub, bớt một hop function và bớt tiền invocation.
