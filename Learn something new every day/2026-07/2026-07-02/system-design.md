# 🏗️ System Design — 2026-07-02

> Chủ đề nổi lên hôm nay: dùng chính database (MySQL/Postgres) như lớp orchestration/reservation thay vì hệ thống rời — và `SKIP LOCKED` xuất hiện ở cả Shopify lẫn DBOS.

## ⭐ [We replaced Redis with MySQL for inventory reservations—and it scaled](https://shopify.engineering/scaling-inventory-reservations) — (Shopify Engineering, 2026)
**Đây là gì:** Câu chuyện Shopify bỏ Redis, chuyển hệ thống "giữ chỗ tồn kho" (inventory reservation) khi checkout sang MySQL 8. Reservation = tạm khóa 1 đơn vị hàng trong lúc khách thanh toán để tránh bán quá (oversell) hoặc báo hết hàng ảo (undersell).
**Chi tiết:**
- Scale thật: BFCM 2025 đạt đỉnh **$5.1 triệu doanh số/phút**. Redis không giữ được ACID giữa reservation và inventory ledger nên có nguy cơ oversell/undersell.
- Pattern chính: đổi từ "1 row/mặt hàng có cột quantity" sang **1 row cho mỗi đơn vị bán được**, giữ pool giới hạn **1.000 row/mỗi item-location**. Khi giữ chỗ thì `SELECT ... FOR UPDATE SKIP LOCKED` — row nào đang bị transaction khác khóa thì MySQL bỏ qua thay vì chờ, giảm mạnh contention trên hot item.
- Tối ưu khóa: composite primary key `(shop_id, inventory_item_id, inventory_group_id, id)` giảm số lock từ 2 xuống 1/reservation; dùng isolation `READ COMMITTED` để bỏ gap lock; đảm bảo thứ tự khóa nhất quán để tránh deadlock; gộp multi-item cart bằng `UNION ALL`.
- Trade-off / bài học lớn nhất: sau khi tối ưu query vẫn đụng trần throughput dù CPU thấp. Thủ phạm thật là **connection pool exhaustion** do code checkout khác giữ connection quá lâu — họ gắn tag SQL comment theo caller để lộ ra "hàng xóm" chiếm 50% read và 33% transaction. Kết quả cuối: writer CPU < 50%, reader CPU < 16% trong flash sale.
**Vì sao đáng đọc:** Đúng stack của Joy Loyalty (Shopify + relational DB). Bài học "high-throughput system phải là hàng xóm tốt, không chỉ nhanh" rất áp dụng được khi bạn thêm feature loyalty vào đường checkout — connection pool và transaction của bạn có thể vô tình bóp nghẹt hệ thống chung. `SKIP LOCKED` là kỹ thuật đáng thêm vào toolbox cho mọi bài toán "hàng đợi/giữ chỗ" trên SQL.

## ⭐ [Under the River](https://shopify.engineering/under-the-river) — (Shopify Engineering, 2026)
**Đây là gì:** Kiến trúc phía sau *River* — AI agent sống trong Slack của Shopify (gõ `@river` để đọc code, chạy test, mở PR, query data warehouse) — và *Aquifer*, nền tảng chạy agent bên dưới.
**Chi tiết:**
- Nguyên tắc thiết kế cốt lõi: **tách "não" khỏi "tay"**. Aquifer gồm 3 phần — **Session** (event log append-only, bền, backed by Postgres, sống sót qua process crash), **Harness** (vòng lặp agent dùng-một-lần, đọc lịch sử rồi gọi model), **Sandbox** (môi trường ephemeral để chạy code).
- Câu chốt kiến trúc: "session là thứ phải sống sót" — harness và sandbox có thể chết/thay mới, nhưng trạng thái nằm trong durable event log nên workflow phục hồi được.
- Số liệu 30 ngày: **59.918 session** trên 5.170 kênh Slack, **3.536 PR đã merge** do River đồng tác giả, chạm 7.000+ nhân viên; median 19 phút và 50 tool call/session.
**Vì sao đáng đọc:** Mindset "durable event log là source of truth, còn compute là thứ vứt đi được" là pattern chuẩn để tự build agent/automation trên Firebase (Firestore + Cloud Tasks/Functions làm harness ephemeral). Nếu Joy Loyalty làm agent tự động hoá campaign, tách state khỏi worker là bài học đắt giá.

## [Airbnb's Mussel V2: Next-Gen Key Value Storage to Unify Streaming and Bulk Ingestion](https://www.infoq.com/news/2025/10/airbnb-nextgen-kv-storage-mussel/) — (InfoQ)
**Đây là gì:** Airbnb re-architect Mussel, key-value store nội bộ, để hợp nhất 2 kiểu nạp dữ liệu (streaming realtime và bulk hàng loạt) trong một hệ thống.
**Chi tiết:** Sustain **>100.000 write/giây**, bảng **>100TB** với p99 read **< 25ms**; backend NewSQL + control plane Kubernetes-native; dynamic range sharding có presplitting để chống hotspot; lớp Dispatcher stateless scale ngang, hỗ trợ dual-write và shadow-read, write ghi vào Kafka trước để đảm bảo durability.
**Vì sao đáng đọc:** Mẫu "shadow read / dual write khi migrate" giống hệt cách Shopify validate ở trên — là quy trình chuẩn để đổi storage mà không sợ mất dữ liệu, hữu ích khi bạn cần đổi schema/DB cho hệ loyalty đang chạy production.

## [QCon SF: Database-Backed Workflow Orchestration Challenges Traditional Architecture](https://www.infoq.com/news/2025/11/database-backed-workflow/) — (InfoQ)
**Đây là gì:** DBOS (Jeremy Edberg & Qian Li) trình bày cách coi **PostgreSQL chính là lớp orchestration** cho workflow, thay vì đặt một hệ điều phối riêng lên trên DB. DBOS Transact là thư viện open-source (MIT) cho Python, TypeScript, Go, Java.
**Chi tiết:** Cơ chế checkpoint — ghi input vào DB trước mỗi step, ghi output sau mỗi step; khi gián đoạn thì resume từ checkpoint cuối thay vì chạy lại từ đầu, tận dụng ACID của Postgres để đạt exactly-once. Quản lý workflow (list/search/cancel/resume) bằng SQL thường; xử lý lock contention bằng chính `FOR UPDATE SKIP LOCKED`.
**Vì sao đáng đọc:** Cùng triết lý với 2 bài Shopify — "để database làm việc nặng, đừng dựng thêm hạ tầng". Với dev JS thuần + Firebase, đây là góc nhìn để cân nhắc: nhiều bài toán workflow/retry không cần Kafka hay queue riêng, một transactional store là đủ.
