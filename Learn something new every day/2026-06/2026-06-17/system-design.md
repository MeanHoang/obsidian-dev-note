# 🏗️ System Design — 2026-06-17

> Tuần này là "phiên chợ" các engineering blog lớn: Uber khoe cách batch ledger tài chính ở 30+ update/giây/account, Shopify tăng tốc GraphQL 15X bằng engine duyệt theo chiều rộng — cả hai gần như viết riêng cho người làm loyalty app trên Shopify.

## ⭐ [30+ Updates per Second per Account: Uber Scales Ledger Processing with Batching](https://www.infoq.com/news/2026/06/uber-payment-batching-system/) — (InfoQ, 2026-06-04)

**Đây là gì:** "Ledger" là sổ cái tài chính ghi mọi chuyển động tiền (theo mô hình double-entry: mỗi giao dịch có 2 bút toán nợ/có cân bằng nhau). Bài kể cách Uber xử lý lượng cập nhật ghi vào cùng một account cực cao mà vẫn đảm bảo chính xác tuyệt đối.

**Chi tiết:**
- Vấn đề: ledger yêu cầu **strict serialization** (tuần tự nghiêm ngặt) các update ở cấp account — nhưng một account "nóng" có thể nhận **hơn 30 update/giây**, gây contention (tranh chấp) nặng nếu ghi từng cái một.
- Giải pháp: gom update vào **batch theo cửa sổ thời gian 250ms** theo từng account, rồi thực thi cả batch như **một đơn vị atomic duy nhất**, cuối cùng mới persist xuống downstream. Redis làm nơi điều phối gom nhóm.
- Đảm bảo đúng đắn nhờ **optimistic atomic update** (cập nhật lạc quan — giả định không xung đột, kiểm tra lúc commit) để xử lý truy cập đồng thời.
- Trade-off cốt lõi: cửa sổ nhỏ → latency thấp nhưng overhead cao; cửa sổ lớn → throughput tốt hơn nhưng xử lý trễ. Con số **250ms** là điểm cân bằng giữa "gần real-time" và hiệu quả hệ thống.
- Kết quả: giảm thời gian xử lý workload lượng lớn và tăng tốc độ đối soát (reconciliation) tài chính.

**Vì sao đáng đọc:** Joy Loyalty về bản chất cũng là một ledger điểm thưởng — merchant lớn dịp sale có thể bắn dồn dập transaction vào cùng một customer; pattern "batch theo cửa sổ + atomic update" này áp thẳng được khi bạn cộng/trừ điểm trong Firestore (gom write trong Cloud Function thay vì mỗi event một transaction để né contention/cost).

## ⭐ [Shopify Reports 15X Faster GraphQL Execution with Breadth First Engine](https://www.infoq.com/news/2026/06/shopify-graphql-cardinal-bfs/) — (InfoQ, 2026-06-01)

**Đây là gì:** Shopify viết lại engine thực thi GraphQL (tên nội bộ Cardinal) chuyển từ duyệt cây theo chiều sâu (depth-first, resolve từng object một) sang **breadth-first** — xử lý theo từng tầng (level-by-level) của query.

**Chi tiết:**
- Số liệu production cho list query lớn: **15x nhanh hơn ở mức field-level execution, 6x ít GC overhead, giảm hơn 4 giây ở P50** end-to-end.
- Cơ chế: thay vì resolve object-by-object đệ quy, engine **gom (batch) việc chạy resolver trên cả nhóm object cùng độ sâu** rồi mới đi sâu xuống tầng tiếp theo.
- Hệ quả lớn nhất: **batching trở thành hành vi thực thi mặc định (native)** chứ không còn là một optimization gắn thêm — tức là vấn đề **N+1 query** gần như bị triệt từ gốc.
- Lợi ích phụ: cải thiện CPU cache locality, giảm memory churn, và **không phải viết lại schema/API** — tương thích ngược trong lúc rollout.
- Trade-off: cái khó nhất là giữ nguyên semantics mà developer đang thấy trong khi đổi cách thực thi bên dưới — phải sửa đồng bộ orchestration, resolver behavior và tracing.

**Vì sao đáng đọc:** Bạn gọi Shopify Admin API (GraphQL) hằng ngày — hiểu engine batch theo tầng giúp viết query gọn hơn (nhóm field cùng tầng, tránh nested sâu vô tội vạ) để tận dụng tối ưu phía Shopify và giảm cost/rate-limit cho Joy Loyalty.

## [Inside Google's System for Coordinated A/B Testing across its Global Service Fleet](https://www.infoq.com/news/2026/06/google-fleet-ab-experimentation/) — (InfoQ, 2026-06-03)

**Đây là gì:** Cách Google chạy A/B test (thử nghiệm chia nhóm user để so sánh) một cách phối hợp trên toàn bộ "fleet" dịch vụ toàn cầu, thay vì mỗi product tự dựng cơ chế riêng.

**Chi tiết:**
- Dùng một **framework thử nghiệm tập trung** điều phối việc gán user/request vào các variant, thay cho cách làm rời rạc từng đội.
- Chống xung đột bằng **hierarchical allocation** (phân bổ theo tầng) — cho phép test ở nhiều tầng của stack mà giảm chồng lấn giữa các thử nghiệm overlap nhau.
- **Deterministic assignment** (gán cố định, có thể tái lập) giữ cho một user luôn nằm đúng nhóm; thống nhất cả logic gán lẫn đo lường qua unified exposure logging.

**Vì sao đáng đọc:** Khi Joy Loyalty muốn A/B test cơ chế thưởng (ví dụ tier mới vs cũ), bài nhắc bài học quan trọng: phải gán nhóm deterministic (cùng customerId → cùng variant) và log exposure thống nhất để kết quả còn ý nghĩa thống kê.

## [Slack Eliminates SSH in EMR Pipelines, Migrates 700+ Jobs to REST-Based Architecture](https://www.infoq.com/news/2026/06/slack-ssh-rest-quarry-migration/) — (InfoQ, 2026-06-12)

**Đây là gì:** Slack thay cơ chế chạy job data bằng SSH (đăng nhập trực tiếp vào cluster) bằng "Quarry" — lớp điều phối submit job qua REST/HTTP API, có server-side tracking bằng job ID.

**Chi tiết:**
- Lý do bỏ SSH: lỗ hổng bảo mật do truy cập trực tiếp production, gánh nặng phân phối/xoay vòng SSH key, audit trail khó, và job chết khi connection rớt.
- Quy mô migrate: **hơn 700 Airflow operator** chuyển sang REST trên **8 region dữ liệu**, rollout từ từ qua **3 quý**, không downtime cho workload quan trọng; xử lý riêng cho Spark/Hive/shell (Livy, HiveServer2, YARN Distributed Shell).
- Lợi ích: bảo mật (hết SSH trực tiếp), observability (structured logging + metric tập trung thay vì log rải rác), reliability (server-side tracking chặn silent failure).

**Vì sao đáng đọc:** Mindset "đừng để pipeline phụ thuộc connection sống" rất hợp khi bạn chạy job batch trên Cloud Run/BigQuery — submit-rồi-track-bằng-job-id (fire then poll) bền hơn nhiều so với giữ một process kết nối lâu chờ kết quả.
