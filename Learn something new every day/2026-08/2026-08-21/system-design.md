# 🏗️ System Design — 2026-08-21

> Chủ đề nổi bật hôm nay: **đo lường & quy trách nhiệm** — Airbnb nén metrics 100 triệu sample/giây bằng streaming aggregation, Discord gán chi phí hosting về từng feature, Uber chống chịu mất nguyên một availability zone, còn Cloudflare biến engineering standards thành thứ AI agent đọc được.

## ⭐ [Building a high-volume metrics pipeline with OpenTelemetry and vmagent](https://airbnb.tech/infrastructure/building-a-high-volume-metrics-pipeline-with-opentelemetry-and-vmagent/) — (Airbnb Engineering)

**Đây là gì:** Case study Airbnb tự xây pipeline metrics thay cho vendor SaaS. Hai thuật ngữ cần biết: **cardinality** = số lượng chuỗi time-series khác nhau sinh ra bởi tổ hợp label (ví dụ `shop_id` làm label → mỗi shop là 1 series → nổ cardinality); **streaming aggregation** = cộng gộp metric ngay trên đường truyền trước khi ghi vào storage, thay vì lưu hết rồi mới query gộp.

**Chi tiết:**
- Kiến trúc cũ: app bắn giao thức **StatsD** qua sidecar Veneur → backend của vendor. Khoảng **40% service** dùng chung một metrics library, nên Airbnb chọn đúng library đó làm điểm khởi đầu migration.
- Kiến trúc mới 3 lớp: **OpenTelemetry Collector** (nhận cả OTLP lẫn StatsD theo kiểu dual-write) → **vmagent routers + aggregators** → **Grafana Mimir** (storage kiểu Prometheus).
- Lớp giữa là điểm hay nhất: **router stateless** shard metric bằng consistent hashing trên các label *không* tham gia aggregation, còn **aggregator stateful** giữ running total và cộng gộp. Nhờ tách stateless/stateful, phần scale ra được thì scale, phần cần state thì được pin đúng shard.
- Quy mô: cụm production ingest **hơn 100 triệu sample/giây** với **hàng trăm aggregator**. Sau khi chuyển sang OTLP, CPU dành cho xử lý metrics trong app **giảm từ 10% xuống dưới 1%**; chi phí giảm **một bậc độ lớn (order of magnitude)** nhờ aggregation.
- Trade-off thật: service cardinality cao bị **memory pressure** ở aggregator → xử lý bằng **delta temporality** (gửi phần chênh lệch thay vì giá trị tích lũy). Hàm `rate()` của Prometheus **đếm thiếu** counter thưa khi pod restart → họ vá bằng "zero injection" trong suốt ở tầng aggregation.

**Vì sao đáng đọc:** Bài học cardinality áp thẳng vào Joy Loyalty — nếu bạn gắn `shop_id` vào mọi metric của app (mà app loyalty thì có rất nhiều shop), bạn đang tự tạo bom cardinality trên Cloud Monitoring và trả tiền cho nó. Pattern "aggregate trước khi ghi", cộng chi tiết `rate()` sai khi Cloud Run instance restart, là hai thứ đáng nhớ khi làm observability trên GCP.

## [Cost Attribution in Discord's API](https://discord.com/blog/cost-attribution-in-discords-api) — (Discord Engineering, 30/06/2026)

**Đây là gì:** Discord chạy **một codebase Python duy nhất** với hơn **1700 endpoint** và khoảng **700 background task**, deploy ra hàng trăm Kubernetes deployment. Cloud provider chỉ bóc tách chi phí được tới mức deployment — mà mỗi deployment lại chạy chung toàn bộ code — nên không ai biết feature nào tốn tiền. Họ giải bằng cách gán chi phí theo **thời gian CPU thực sự chạy code của feature đó**.

**Chi tiết:**
- Mở rộng CPU profiler sẵn có: sampling theo signal ở **10Hz** với `ITIMER_VIRTUAL` — chỉ đo thời gian *on-CPU*, không tính I/O wait, nên số liệu phản ánh đúng phần tiêu thụ tài nguyên.
- Mỗi endpoint khai báo feature của nó bằng một **decorator**; feature hiện tại được giữ trong **`ContextVar`** của Python để mọi chỗ trong quá trình xử lý request đều đọc được.
- Dữ liệu profile được gắn label `{feature=X, endpoint=Y}` và đẩy sang **Pyroscope mỗi 5 giây**.
- Kết quả: bảng % CPU theo giờ cho từng feature/endpoint, **join với billing data** của cloud provider để ra con số tiền thật — không cần đụng vào deployment topology.

**Vì sao đáng đọc:** Đây chính là bài toán của một Shopify app: một service Cloud Run phục vụ webhook, Admin API sync, tính điểm, gửi email… và bill GCP về chỉ là một cục. Ý tưởng "context variable mang tên feature + profiler gắn label" là thứ dựng được ở quy mô nhỏ để biết feature loyalty nào đang ăn tiền.

## [Zone-Failure-Resilient OpenSearch® at Uber](https://www.uber.com/us/en/blog/zone-failure-resilient/) — (Uber Engineering, 25/06/2026)

**Đây là gì:** **Zone Failure Resilience (ZFR)** = hệ thống vẫn query và ingest bình thường khi mất trọn một availability zone. Uber ghép tính năng **shard-allocation awareness** sẵn có của OpenSearch với hạ tầng **isolation group** tự xây trên Odin (container orchestration của Uber).

**Chi tiết:**
- **Isolation group** phân bổ node đều qua các failure domain, và bảo đảm "một node cùng node thay thế nó luôn thuộc cùng isolation group, kể cả khi host vật lý bên dưới đổi". Uber dùng **3 isolation group**, nên mất một zone chỉ mất khoảng **33% capacity**.
- Mỗi index giữ tối thiểu **2 replica (tổng 3 bản sao)** trải đều trên 3 isolation group — đây là mức nền tối thiểu để sống sót qua sự cố một zone.
- **Forced** shard allocation awareness là mấu chốt: khi một zone chết, OpenSearch nhận ra attribute bị thiếu và **để shard ở trạng thái unassigned thay vì rebalance ồ ạt**. Nếu không, cơn bão copy dữ liệu sẽ giết nốt các zone còn sống.
- **5 cluster manager node** cho phép giữ quorum qua kịch bản mất một zone *cộng thêm* một node lẻ, với voting configuration tự co lại.

**Vì sao đáng đọc:** Bài học chống mode failure kiểu "hệ thống tự chữa quá hăng nên tự giết mình" là universal — cùng logic với retry storm khi Shopify webhook fail hàng loạt. Nếu Joy Loyalty tự vận hành cluster search/index nào đó trên GCP, phần multi-zone replica factor và quorum lẻ là checklist trực tiếp.

## [How Cloudflare enforces engineering standards using AI](https://blog.cloudflare.com/engineering-standards-enforcement/) — (Cloudflare, 04/08/2026)

**Đây là gì:** Cloudflare gom mọi chuẩn kỹ thuật đang nằm rải rác — "tài liệu chính thức, file trong repo, thread chat, và kiến thức tích lũy trong đầu người" — vào một kho tập trung tên **Codex**, viết theo dạng RFC dùng từ khóa MUST/SHOULD của RFC 2119, rồi **trích xuất từng câu ra JSON** để AI agent tiêu thụ được.

**Chi tiết:**
- Chuẩn được chia theo domain (architecture, security, reliability, languages), mỗi domain có domain owner chịu trách nhiệm.
- Vòng đời hai trạng thái tách bạch: **approved** (cảnh báo, không chặn) và **enforced** (chặn merge) — cho phép rollout một chuẩn mới mà không làm tắc nghẽn team ngay.
- Con số thực tế: AI code reviewer đã gắn cờ khoảng **230.000 vi phạm** và **chặn 16.000 merge**; spec reviewer duyệt khoảng **600 technical design**; incident report reviewer đánh giá **hơn 200 postmortem**.

**Vì sao đáng đọc:** Với team nhỏ, thông điệp cốt lõi có thể áp dụng ngay và rẻ: viết convention (JavaScript thuần, quy tắc gọi Admin API, chuẩn Firestore schema) thành văn bản có cấu trúc, MUST/SHOULD rõ ràng, đặt trong repo cho AI agent đọc — hiệu quả hơn nhiều so với để convention nằm trong ký ức của người review.
