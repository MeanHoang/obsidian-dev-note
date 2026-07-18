# 🏗️ System Design — 2026-06-15

> Hôm nay xoay quanh chủ đề "biết hệ thống mình đang chạy ra sao": Netflix dựng bản đồ dependency real-time cho hàng nghìn microservice, OpenAI ép 1 primary Postgres gánh ChatGPT, cùng pattern event-driven idempotency và recommender thế hệ mới của Shopify.

## ⭐ [How Netflix Maps Thousands of Microservices in Real-Time](https://www.infoq.com/news/2026/06/netflix-microservices-realtime/) — (InfoQ, 06/2026)
**Đây là gì:** Netflix xây "Service Topology" — một hệ thống gộp nhiều nguồn dữ liệu để dựng đồ thị phụ thuộc (dependency graph) giữa các service, có thể query real-time. Mục tiêu: khi sự cố, engineer biết ngay service nào phụ thuộc service nào, "blast radius" (phạm vi ảnh hưởng) ra sao, và lỗi đến từ chính service mình hay từ upstream.

**Chi tiết:**
- Gộp 3 nguồn dữ liệu bù trừ điểm yếu cho nhau: (1) **eBPF network flows** lấy từ kernel — đầy đủ nhưng thiếu ngữ cảnh ứng dụng; (2) **IPC metrics** — có endpoint/protocol nhưng coverage hạn chế; (3) **distributed traces** — đường đi thật của request nhưng bị sampling.
- Pipeline 3 tầng "collapse" các đường đi nhiều hop qua trung gian (load balancer, NAT) thành cạnh trực tiếp app-to-app, dùng phân phối tải dạng "graduated" để tránh hotspot.
- Chạy trên Apache Pekko Streams + Kafka consumer đa region; lưu graph trên key-value store nội bộ của Netflix; API gRPC với yêu cầu cứng "phản hồi dưới 1 giây".
- Bài học quan trọng: bản đồ tĩnh/cập nhật trễ vô dụng khi deploy nhiều lần/ngày; và **dữ liệu thiếu còn tệ hơn không có dữ liệu** vì dẫn engineer đi sai hướng lúc incident. Truy vấn lịch sử dùng time-window aggregation thay vì snapshot để giảm chi phí lưu trữ.
**Vì sao đáng đọc:** Joy Loyalty chạy nhiều Cloud Run service + Cloud Functions + Pub/Sub — tư duy "merge eBPF/metrics/traces thành 1 dependency graph có blast radius" áp dụng được khi bạn dùng Cloud Trace + Cloud Monitoring để biết một thay đổi Firestore/Pub/Sub ảnh hưởng tới đâu trước khi deploy.

## [The generative recommender behind Shopify's commerce engine](https://shopify.engineering/generative-recommendations) — (Shopify Engineering, 25/02/2026)
**Đây là gì:** Shopify mô tả recommender thế hệ mới: thay vì feature engineering thủ công, họ coi hành vi mua sắm là **chuỗi sự kiện tuần tự** (search, view, add-to-cart, favorite, purchase) và dùng mô hình autoregressive (giống cách LLM dự đoán token tiếp theo) để đoán sản phẩm kế tiếp buyer sẽ tương tác.
**Chi tiết:**
- Mô hình tự học pattern từ raw event sequence: dịch chuyển ý định, sở thích dài hạn, hành vi theo mùa — không cần đặc trưng thủ công.
- Ràng buộc production: phải chạy trong latency serving real-time với hàng tỷ event và hàng triệu sản phẩm; team đạt **tốc độ tăng 7.3x** nhờ tối ưu CUDA kernel để vừa budget bộ nhớ/latency.
- Trade-off chính: negative sampling chia sẻ qua batch để tiết kiệm GPU memory; cân bằng độ dài chuỗi vs tốc độ inference; tối ưu cho "giá trị gia tăng" (lấp khoảng trống các model retrieval khác bỏ sót) thay vì chỉ chạy theo recall thô.
- Kết quả online: +0.94% đơn hàng trên Shop, +5% click-through chất lượng cao; nền tảng xử lý 2.2 nghìn tỷ edge request phục vụ 81 triệu người mua dịp BFCM 2025.
**Vì sao đáng đọc:** Đây là lõi recommendation ngay trên nền tảng Joy Loyalty đang sống — hiểu cách Shopify mô hình hóa event sequence giúp bạn thiết kế feature gợi ý phần thưởng/sản phẩm dựa trên chuỗi hành vi loyalty (Firestore event → Pub/Sub → BigQuery) thay vì chỉ tính điểm tĩnh.

## [Event-Driven Patterns for Cloud-Native Banking: What Works and What Hurts](https://www.infoq.com/articles/event-driven-banking-architecture/) — (InfoQ, 31/03/2026)
**Đây là gì:** Bài tổng hợp các pattern reliability cho hệ event-driven trong môi trường ngân hàng (đòi hỏi không mất/không trùng message): outbox/inbox, idempotency, xử lý "poison message". "Outbox" = ghi event vào cùng transaction với thay đổi state; "inbox" = ghi nhận event đã xử lý để bỏ qua bản trùng.
**Vì sao đáng đọc:** Pub/Sub của GCP là at-least-once — bài này cho công thức rõ ràng (inbox để idempotent consumer, dead-letter cho message lỗi) bạn áp thẳng vào các Cloud Function xử lý event loyalty để tránh cộng điểm 2 lần khi message bị deliver lặp.

## [OpenAI Scales a Single Primary PostgreSQL to Millions of QPS for ChatGPT](https://www.infoq.com/news/2026/02/openai-runs-chatgpt-postgres/) — (InfoQ, 12/02/2026)
**Đây là gì:** Case study OpenAI gánh 800 triệu user ChatGPT trên **một primary PostgreSQL duy nhất** (không sharding write), bằng cách tối ưu cả tầng app lẫn DB: gần 50 read replica địa lý (p99 vài chục ms), PgBouncer transaction-mode pooling, cascading replication để giảm tải WAL streaming.
**Vì sao đáng đọc:** Ngược với phản xạ "scale là phải sharding ngay" — kỹ thuật giảm write pressure (loại write thừa, rate-limit backfill, lazy write, đẩy workload shardable sang hệ khác) là tư duy đáng nhớ khi tối ưu chi phí/độ ổn định Firestore và các bảng nóng trong BigQuery của Joy Loyalty.
