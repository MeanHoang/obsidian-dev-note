# 🏗️ System Design — 2026-08-19

> Chủ đề chung hôm nay: **hệ thống tự chữa lành và tự điều tiết**. Stripe biến việc khôi phục database thành bài toán tìm đường trên graph, Airbnb thay rate limit tĩnh bằng cơ chế thích ứng theo tài nguyên, Cloudflare tăng 10x throughput mà không thêm phần cứng — cả ba đều là chuyện "tối ưu cái đang có" thay vì "mua thêm server".

## ⭐ [The generative recommender behind Shopify's commerce engine](https://shopify.engineering/generative-recommendations) — (shopify.engineering)
**Đây là gì:** Case study Shopify xây recommender system kiểu **generative** (mô hình tự hồi quy — autoregressive — dự đoán sản phẩm tiếp theo trong chuỗi hành vi của buyer, giống cách LLM dự đoán token tiếp theo) thay cho cách feature engineering truyền thống.
**Chi tiết:**
- Scale bối cảnh: BFCM 2025 Shopify ghi nhận **2.2 nghìn tỷ edge request**, **81 triệu người mua**; catalog hàng triệu sản phẩm, hàng tỷ event để học.
- Kiến trúc: mô hình autoregressive với causal masking, học thẳng từ raw event sequence (dữ liệu từ Shop app + storefront) thay vì từ feature đã tổng hợp sẵn.
- Kỹ thuật đáng chú ý: mã hoá thời gian bằng rotary encoding (lấy cảm hứng RoPE) cộng relative attention bias để bắt tính mùa vụ; negative sampling chia sẻ negative giữa các batch + hard negative có nhận biết positive để tránh false negative.
- Trade-off & hiệu năng: bài nhấn mạnh "recommender mạnh mà chậm thì không giúp được buyer" — họ tối ưu CUDA kernel, đạt **7.3x speedup** pipeline training, coi systems efficiency là một phần của bài toán mô hình.
- Kết quả online: Shop orders **+0.94%**, high-quality CTR **+5%**, conversion rate **+0.71%**, product recall **+4.8%** (đều là relative).
**Vì sao đáng đọc:** Đây chính là hạ tầng recommendation của platform mà Joy Loyalty đang sống trên đó — hiểu cách Shopify mô hình hoá event sequence của buyer giúp bạn thiết kế event schema cho loyalty (earn/redeem/tier change) theo hướng có thể tái sử dụng cho ML sau này, thay vì chỉ log phẳng vào Firestore.

## ⭐ [How Stripe uses graph search and state machines to auto-remediate a global database fleet](https://stripe.dev/blog/how-stripe-uses-graph-search-and-state-machines-to-auto-remediate-a-global-database-fleet) — (stripe.dev/blog, 16/07/2026)
**Đây là gì:** Stripe mô hình hoá toàn bộ fleet MongoDB thành **graph có hướng** (node = trạng thái shard, edge = thao tác vận hành) rồi dùng thuật toán tìm đường để tự động sinh và chạy kế hoạch khôi phục shard bị suy giảm — thay vì on-call phải tự nghĩ ra chuỗi thao tác.
**Chi tiết:**
- **State = node:** sức khoẻ shard được biểu diễn qua thuộc tính từng node (votes, priority, hidden status) và thuộc tính cluster. **Operation = edge:** đổi vote/priority, rebuild node, resize oplog.
- **Simulation layer:** interface `CommonContext` cho phép mô phỏng hàng nghìn state transition trong vài mili-giây bằng in-memory, tách khỏi việc thực thi thật qua Temporal workflow. Nguyên tắc cốt lõi: *"what you simulate is what you execute"* — cùng một business logic chạy ở cả hai chế độ, không duy trì code planning riêng.
- **Tiến hoá thuật toán:** bắt đầu bằng BFS tìm đường ngắn nhất, sau chuyển sang **Dijkstra với edge có trọng số** để vẫn khắc phục được một phần khi không thể phục hồi hoàn toàn.
- **Safety model:** hệ thống validate invariant (số vote chẵn, node voting thiểu số, cấu hình node không hợp lệ) để không bao giờ đề xuất một trạng thái trung gian nguy hiểm.
- **Kết quả:** giảm **30% số page on-call** (~200 page/năm), fleet khoẻ thêm **12 ngày/năm**, hỗ trợ shard layout mới với **zero effort** thủ công.
**Vì sao đáng đọc:** Bài học chuyển được ngay sang scale nhỏ — khi Joy có runbook thủ công lặp lại (retry sync Shopify, backfill điểm, reconcile webhook lỡ), hãy mô hình hoá nó thành state machine + simulation "dry-run dùng chung code với execution" thay vì viết script one-off; đó là cách biến on-call thành code.

## [Scaling Security Insights: how we achieved a 10x increase in global scanning capacity](https://blog.cloudflare.com/scaling-security-scans/) — (blog.cloudflare.com, 12/06/2026)
**Đây là gì:** Cloudflare kể chuyện tăng throughput hệ thống quét bảo mật từ 10 scan/giây lên **hơn 120 scan/giây** mà **không thêm phần cứng** — thuần tối ưu Kafka consumer, query Postgres và API.
**Chi tiết:**
- Kiến trúc: Kafka làm event streaming, các "checker" là Go microservice consume message, ghi kết quả qua internal API xuống PostgreSQL.
- **Kafka consumer:** chuyển sang batch processing với goroutine song song, tránh việc một message chặn cả luồng.
- **Head-of-line blocking:** tách checker thành hai consumer group "slow lane" và "fast lane" — message nhanh không phải xếp hàng sau message chậm. Đây là pattern rất đáng nhớ cho mọi hệ queue.
- **Database:** bỏ insert từng dòng, dùng chiến lược lai — `UNNEST` cho batch nhỏ và `COPY` cho batch lớn — cắt mạnh số round trip.
- **Latency & scheduler:** chuyển API từ active-active sang active-passive để API active bám theo primary database (Portland ~10ms so với Amsterdam ~3 giây trước khi sửa); scheduler được randomize timestamp, lên lịch từng zone độc lập và thêm adaptive rate limiting theo số account.
**Vì sao đáng đọc:** Bài này gần nhất với công việc hằng ngày — Joy Loyalty xử lý webhook Shopify theo lô, và cả ba pattern (fast/slow lane, batch insert thay vì từng row, randomize scheduler để tránh thundering herd) áp dụng trực tiếp cho Pub/Sub + Cloud Run + Firestore/Postgres mà không cần tăng chi phí hạ tầng.

## [From Static Rate Limiting to Adaptive Traffic Management in Airbnb's Key-Value Store](https://airbnb.tech/infrastructure/from-static-rate-limiting-to-adaptive-traffic-management-in-airbnbs-key-value-store/) — (airbnb.tech)
**Đây là gì:** Mussel là key-value store multi-tenant của Airbnb. Bài mô tả việc thay **rate limit tĩnh theo QPS** (đếm bằng Redis counter, vượt hạn mức thì trả 429) bằng hệ thống điều tiết **thích ứng theo tài nguyên thực tế**.
**Chi tiết:**
- **Resource-Aware Rate Control (RARC):** tính chi phí request theo "request unit" (RU) — công thức tuyến tính gồm overhead cố định, số row xử lý, số byte và latency — thay vì đếm số request. Token bucket ở mỗi dispatcher nạp lại định kỳ và trừ RU theo chi phí thật.
- **Load shedding theo criticality tier:** dùng latency ratio (p95 dài hạn ÷ p95 ngắn hạn) làm chỉ báo stress; khi tỷ lệ tụt về ~0.3, hệ thống tự tăng giá RU cho traffic không quan trọng. Kết hợp giám sát hàng đợi kiểu **CoDel** để fail sớm khi bão hoà.
- **Hot-key defense:** thuật toán Space-Saving phát hiện key nóng theo thời gian thực, phục vụ từ local cache của dispatcher và gộp (coalesce) các request trùng đang bay.
- **Kết quả:** trong drill DDoS một triệu QPS nhắm vào vài key cụ thể, mỗi dispatcher chỉ chuyển tiếp lác đác vài request xuống dưới; phần lớn trường hợp **chỉ một request/hot key/dispatcher pod** chạm tới storage layer. Load shedding **giảm một nửa thời gian phục hồi**.
**Vì sao đáng đọc:** Joy Loyalty cũng là hệ multi-tenant (nhiều shop dùng chung backend) — ý tưởng "tính chi phí theo tài nguyên thay vì đếm request" và "hạ cấp traffic không quan trọng trước khi hệ sập" là mô hình đúng để bảo vệ shop lớn trong flash sale mà không phạt oan shop nhỏ.
