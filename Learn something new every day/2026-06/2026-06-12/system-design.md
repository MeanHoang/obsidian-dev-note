# 🏗️ System Design — 2026-06-12

> Hôm nay nổi bật: AWS bỏ kiến trúc mạng fat-tree truyền thống để chuyển sang topology dựa trên lý thuyết đồ thị ngẫu nhiên (giảm 69% router), và Uber chia sẻ pattern Data Abstraction Layer giúp rút thời gian build báo cáo từ vài tuần xuống dưới 2 ngày.

## ⭐ [AWS thay fat-tree data center bằng Resilient Network Graphs — giảm 69% router](https://www.infoq.com/news/2026/06/aws-random-graph-data-center/) — (InfoQ)
**Đây là gì:** Fat-tree là kiến trúc mạng data center phân tầng kinh điển (top-of-rack → aggregation → spine) mà gần như mọi cloud đều dùng. AWS vừa công bố Resilient Network Graphs (RNG) — kiến trúc mạng "phẳng" dựa trên quasi-random graph theory, trong đó mỗi rack nối trực tiếp tới các rack khác theo cách bán-ngẫu nhiên thay vì đi qua các tầng switch. Đây là lần đầu tiên expander-based network fabric được triển khai production ở quy mô lớn.
**Chi tiết:**
- Số liệu: giảm 69% thiết bị mạng, throughput cao hơn tới 33%, dự kiến giảm 40% điện năng cho thiết bị mạng, tiết kiệm chi phí 9-45% so với fat-tree.
- Vấn đề của fat-tree: traffic phải leo qua nhiều tầng switch, spine link nghẽn là nghẽn cả hệ thống; muốn mở rộng capacity phải thêm nguyên một tầng switch (tốn điện + vốn).
- Hai sáng chế chính: **ShuffleBox** — thiết bị quang thụ động với dây quang được "xáo trộn" sẵn bên trong, tạo randomization logic mà không gây hỗn loạn vật lý khi đi dây; **Spraypoint** — protocol phân tán tự viết, "phun" traffic ra nhiều router lân cận cùng lúc.
- Resilience: fat-tree mất 1 spine switch có thể gây cascading failure; RNG degrade tuyến tính — mất 1% router thì chỉ mất ~1% capacity.
- Trade-off: RNG chỉ dành cho compute đa dụng với traffic ngẫu nhiên; GPU cluster (traffic tập trung, có điều phối) vẫn dùng kiến trúc UltraServer riêng. Triển khai production đầu tiên gần Dublin cuối 2024, thành default cho data center mới từ tháng 4/2026.
**Vì sao đáng đọc:** Bài học lớn về trade-off hierarchy vs flat topology và "graceful degradation" — tư duy áp dụng được khi thiết kế bất kỳ hệ thống nào trên GCP: tránh single point tập trung, ưu tiên kiến trúc degrade tuyến tính thay vì sụp dây chuyền.

## ⭐ [Simplifying Data and Product Integrations with a Data Abstraction Layer](https://www.uber.com/us/en/blog/data-abstraction-layer/) — (Uber Engineering, 11/06/2026)
**Đây là gì:** Uber xây Data Abstraction Layer (DAL) — một RPC service đứng giữa bên tiêu thụ dữ liệu (dashboard, report cho advertiser) và bên sản xuất dữ liệu, lo việc route request, điều phối query và ghép kết quả trên nhiều hệ database khác nhau. Mục tiêu: engineer chỉ cần khai báo *cần dữ liệu gì*, không phải biết *lấy thế nào*.
**Chi tiết:**
- Trước DAL, tạo một loại ad report mới mất "vài tuần đến vài tháng" vì phải xử lý tay các biến thể data model (nhiều version bảng, tên cột khác nhau). Sau DAL: dưới 2 ngày.
- Endpoint **FetchData** nhận request khai báo: tên bảng, schema, time range, filter — phía sau là quy trình table resolution 3 pha (schema eligibility → dataset availability → column continuity) để quyết định query bảng vật lý nào.
- Result assembly hỗ trợ concatenation, join, rollup, scalar transformation; các query chạy song song để giảm latency.
- Hỗ trợ nhiều backend cùng lúc: OLAP, Hive, Docstore, MySQL, và cả RPC service — consumer không cần biết dữ liệu nằm đâu.
**Vì sao đáng đọc:** Pattern này map thẳng vào bài toán analytics/report của Joy Loyalty — thay vì mỗi dashboard tự query Firestore/BigQuery với logic riêng, một lớp abstraction khai báo (table + range + filter) giúp thêm report mới nhanh hơn nhiều và đổi backend không vỡ consumer.

## [Microsoft open-source pg_durable — durable execution chạy ngay trong PostgreSQL](https://www.infoq.com/news/2026/06/postgresql-pg-durable/) — (InfoQ)
**Đây là gì:** "Durable execution" là kỹ thuật cho workflow dài hơi sống sót qua crash/restart bằng cách persist trạng thái thực thi (Temporal là tên tuổi lớn nhất mảng này). pg_durable là extension của Microsoft đưa khả năng này vào thẳng PostgreSQL: định nghĩa workflow bằng SQL với DSL (`~>` chạy tuần tự, `&` chạy song song), state lưu trong bảng Postgres, lõi viết bằng Rust (duroxide). Thay thế được đống "cron job + background worker + message queue + orchestrator ngoài".
**Vì sao đáng đọc:** Đáng học về mặt pattern — cùng bài toán mà Joy giải bằng Cloud Tasks/Scheduler trên GCP (gửi reward, retry webhook Shopify): hiểu durable execution giúp thiết kế các flow tích điểm/đổi thưởng chịu lỗi tốt hơn, kể cả khi không dùng Postgres.

## [OpenTelemetry ra mắt "Blueprints" — kiến trúc mẫu cho observability quy mô lớn](https://www.infoq.com/news/2026/06/opentelemetry-blueprints-launch/) — (InfoQ)
**Đây là gì:** OpenTelemetry là chuẩn mở vendor-neutral cho traces/metrics/logs. Initiative "Blueprints" mới cung cấp hướng dẫn prescriptive, architectural pattern và reference implementation thật (từ Adobe, Mastodon, Skyscanner) cho các kịch bản cụ thể: Kubernetes observability, infrastructure instrumentation, kiến trúc telemetry platform tập trung. Điểm hay: họ tách "essential complexity" (vốn có của observability) khỏi "accidental complexity" (do adopt thiếu điều phối).
**Vì sao đáng đọc:** Nếu sau này Joy cần distributed tracing xuyên Cloud Run/Firebase Functions thay vì chỉ đọc log rời rạc, đây là điểm bắt đầu có pattern sẵn thay vì tự mò cấu hình OTel từ đầu.
