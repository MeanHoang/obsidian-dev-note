# 🏗️ System Design — 2026-09-09

> Chủ đề xuyên suốt hôm nay: **dữ liệu tiền/tồn kho phải chính xác tuyệt đối** — Uber kể 10 năm xây ledger double-entry, Shopify bỏ Redis quay về MySQL để giữ ACID, và Shopify cũng đang rời sharding thủ công sang distributed SQL.

## ⭐ [Zero-Sum by Design: 10 Years of Uber's Payments Platform](https://www.uber.com/us/en/blog/ubers-payments-platform/) — (Uber Engineering, 06/08/2026)
**Đây là gì:** Case study kiến trúc nền tảng thanh toán của Uber sau 10 năm — cách họ thiết kế **ledger (sổ cái)** để mọi dòng tiền luôn cân bằng. "Zero-sum" = nguyên tắc kế toán **double-entry** (ghi sổ kép): mỗi giao dịch phải có tổng nợ = tổng có, không bao giờ lệch.
**Chi tiết:**
- Scale: gross bookings tăng từ **$50 tỷ lên $217 tỷ/năm**, hệ thống xử lý dòng tiền gần **2x gross bookings**, và giữ số dư ledger cho hơn **1.2 tỷ entity** (tài xế, khách, merchant, đối tác...).
- 5 nguyên tắc nền: (1) **Immutable Money Order** — bản ghi giao dịch bất biến, muốn sửa thì ghi thêm bản ghi điều chỉnh chứ không UPDATE; (2) zero-sum bắt buộc; (3) ledger balance **strongly consistent**; (4) microservice rời rạc theo từng giai đoạn vòng đời (tạo → xử lý → thu → chi) nối bằng **Apache Kafka**; (5) abstraction-first — money order không gắn với business line cụ thể.
- Trade-off consistency vs performance được chia rõ: **strong consistency cho ledger**, còn phần lớn luồng chạy **async qua Kafka**; chỉ giao dịch đồng bộ user-facing mới dùng workflow engine **Cadence**.
- Với entity "nóng" (ledger B2B traffic cao), họ làm cơ chế **serialized batch-write** riêng → tăng **10x** throughput ghi ledger. Row entity giữ cỡ ~1KB bằng cách prune các sub-account có số dư 0.
- Ban đầu ledger nằm trên **DynamoDB**, sau tự xây **LedgerStore** để đạt yêu cầu **tamper-evident** (chống sửa lén phục vụ audit). Nhờ abstraction sớm, họ mở rộng sang Freight, Transit, Hotels, Grocery, Ads, Memberships "gần như không phải sửa gì".
**Vì sao đáng đọc:** Joy Loyalty về bản chất là một **ledger điểm** — earn/redeem/expire/refund. Bài này là blueprint chuẩn nhất: đừng UPDATE cột `points_balance`, hãy **append transaction bất biến** rồi tính số dư; đó là cách duy nhất để trace được "vì sao khách này mất 200 điểm" khi merchant khiếu nại.

## ⭐ [We replaced Redis with MySQL for inventory reservations—and it scaled](https://shopify.engineering/scaling-inventory-reservations) — (Shopify Engineering, 12/05/2026)
**Đây là gì:** Shopify bỏ Redis, chuyển hệ thống **giữ chỗ tồn kho** (reservation lúc đang thanh toán, chống oversell) về MySQL. Điểm mấu chốt là `SKIP LOCKED` — tính năng MySQL 8 cho phép câu SELECT ... FOR UPDATE **bỏ qua các row đang bị lock** thay vì đứng chờ.
**Chi tiết:**
- Bối cảnh: Black Friday 2025 merchant Shopify đạt đỉnh **$5.1 triệu doanh số/phút**, traffic peak tăng **11% YoY**; mọi giao dịch đó đều chạm tồn kho.
- Vấn đề của Redis: reservation nằm ở Redis còn inventory ledger nằm ở MySQL → bước claim phải ghi 2 hệ thống, **không thể gói trong 1 transaction atomic**. Sinh ra failure mode "thanh toán thành công nhưng inventory chưa claim" (hoặc ngược lại) → oversell/undersell.
- Thiết kế mới: **1 row cho 1 đơn vị bán được** thay vì 1 row có cột quantity cho cả item (thiết kế cũ này từng thất bại vì contention dồn hết vào 1 row). Giữ 3 cái = SELECT rồi move 3 row trong 1 transaction. Pool giới hạn **1.000 row per item/location**, khi cạn thì replenish inline.
- Chi tiết tuning đáng học: **composite primary key** `(shop_id, inventory_item_id, inventory_group_id, id)` giảm số lock từ 2 xuống 1 mỗi row; đổi isolation sang **READ COMMITTED** để tránh gap lock chặn insert replenish; chuẩn hoá **thứ tự lock** để khỏi deadlock; gộp query đa item bằng **UNION ALL**. Sau tuning: writer CPU **<50%**, reader CPU **<16%**.
- Bài học lớn nhất lại không phải về query: nút thắt thật là **connection pool bị chiếm dụng** bởi code khác trong luồng checkout. Họ gắn **SQL tagging theo caller** + tracking ở tầng proxy mới nhìn ra, rồi dọn được **50% số read** và **33% transaction** trên primary DB.
**Vì sao đáng đọc:** Hai bài học áp thẳng vào Joy: (1) **xem lại quyết định cũ** — thứ 5 năm trước không làm được nay DB đã hỗ trợ, đừng thêm Redis chỉ vì "Firestore/SQL chắc không chịu nổi"; (2) khi API chậm, hãy **đo xem ai đang giữ connection** trước khi đi optimize query.

## [How Shopify Is Re-Architecting for an Agentic Commerce Future with YugabyteDB](https://www.yugabyte.com/blog/how-shopify-is-re-architecting-for-an-agentic-commerce-future-with-yugabytedb/) — (Yugabyte, 04/02/2026)
**Đây là gì:** YugabyteDB là **distributed SQL** — DB tương thích PostgreSQL nhưng tự động phân tán/replicate qua consensus, cho phép scale ngang mà app vẫn thấy một namespace duy nhất. Bài mô tả Shopify đang thử thay lớp sharding MySQL thủ công bằng nó.
**Chi tiết:**
- Hiện trạng: Shopify chạy **hàng chục nghìn node MySQL** (chủ yếu trên GCP); replication overhead đẩy chi phí lưu trữ lên hàng **petabyte**, và logic sharding rò rỉ vào tầng application.
- Cluster YugabyteDB họ dựng thuộc loại lớn nhất thế giới: **7.000 CPU core**, **1.4 PB dữ liệu**, khoảng **200.000 query/giây**, dùng tablespace scope theo châu lục/khu vực để giữ data locality và đáp ứng data sovereignty mà không cần code sharding.
**Vì sao đáng đọc:** Cho thấy chi phí thật của "tự shard": nó không nằm ở DB mà ở **độ phức tạp application** kéo dài nhiều năm. Với Joy, đây là lý do nên để Firestore/Cloud SQL lo phân tán thay vì tự tay chia shard theo `shop_id`.

## [GitFarm: Git as a Service for Large-Scale Monorepos](https://www.uber.com/us/en/blog/gitfarm-as-a-service/) — (Uber Engineering, 09/07/2026)
**Đây là gì:** Uber biến Git thành một **service tập trung**: thay vì mỗi service tự clone monorepo khổng lồ, chúng gọi gRPC tới GitFarm để GitFarm chạy lệnh git hộ.
**Chi tiết:**
- Kiến trúc 4 lớp: **Gateway** (auth + load balance, dùng Redis giữ state) → **Backend** (giữ repo "ấm" bằng sync định kỳ) → **Sandbox** (container ephemeral chạy lệnh git, cô lập hoàn toàn) → **Repository Pool** (checkout dựng sẵn, mount vào sandbox để truy cập **dưới 500ms**).
- Workflow nhiều lệnh liên tiếp dùng **bidirectional gRPC streaming** để giữ nguyên state repo trong cùng session.
- Kết quả: giảm **>80% compute** cho service read-heavy, p50 của compliance audit từ **110–160 giây xuống 20–30 giây**, xoá hẳn cold-start **10–15 phút**.
**Vì sao đáng đọc:** Pattern **resource pooling + warm pool** (giữ sẵn tài nguyên đắt tiền đã khởi tạo) áp dụng được cho Cloud Run/Cloud Functions của Joy — cold start và khởi tạo lặp lại thường là nguồn latency lớn hơn logic nghiệp vụ.

## [Scaling Security Insights: how we achieved a 10x increase in global scanning capacity](https://blog.cloudflare.com/scaling-security-scans/) — (Cloudflare Blog, 12/06/2026)
**Đây là gì:** Postmortem-style về việc scale một **pipeline xử lý bất đồng bộ** (Kafka → worker → Postgres) từ 10 scan/giây lên mục tiêu 100/giây, khi hệ thống đang gãy: Kafka backlog phình, API timeout, process crash.
**Chi tiết:**
- Thay vì tăng partition Kafka (tốn hạ tầng chung), họ dùng **batch consumption + xử lý song song bằng goroutine**, và tách **consumer group "fast lane"/"slow lane"** để tránh **head-of-line blocking** (một message chậm chặn cả hàng đợi).
- Ghi DB: bỏ INSERT từng dòng, chuyển sang hybrid — `UNNEST` khi batch nhỏ, `COPY` khi batch lớn.
- Setup **active-active** giữa Portland và Amsterdam gây thêm **50ms latency** và cạn connection pool; đổi sang **active-passive** bám theo primary DB thì hết timeout.
- Scheduler được thiết kế lại để hết spike: lịch độc lập theo zone, **randomize timestamp** (jitter), và rate limit thích ứng theo số account. Kết quả cuối: **>120 scan/giây**.
**Vì sao đáng đọc:** Bộ ba **fast/slow lane + batch write + jitter khi scheduling** là công thức trực tiếp cho các job nền của Joy (sync order, tính điểm, gửi email tier) — nhất là jitter, để tránh mọi shop cùng bắn job vào phút 0.
