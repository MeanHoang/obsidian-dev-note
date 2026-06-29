# 🏗️ System Design — 2026-06-23

> Chủ đề nổi bật hôm nay: **operations-as-code** cho hệ phân tán — Discord và Cloudflare đều biến các thao tác vận hành nguy hiểm (nâng cấp DB, chạy workflow nhiều bước) thành workflow khai báo, idempotent, có thể resume; cộng thêm case study lưu trữ graph quy mô internet của Netflix.

## ⭐ [How Discord Automates ScyllaDB Clusters at Scale](https://discord.com/blog/how-discord-automates-scylladb-clusters-at-scale) — (Discord Engineering, 08/05/2026)
**Đây là gì:** Discord xây **Scylla Control Plane (SCP)** — một framework biến các thao tác vận hành database "nguy hiểm" (nâng cấp OS, mở rộng cluster, dựng shadow cluster, khôi phục node) thành các *workflow khai báo bằng YAML*, có safeguard và resume được. "Shadow cluster" = bản sao sống ngắn hạn của cluster production, nhận cùng read/write như production để test thay đổi trước khi đụng vào dữ liệu thật. Bài cũng được InfoQ điểm lại: [Discord Rebuilds Database Operations around Automation](https://www.infoq.com/news/2026/05/discord-scylladb-automation/) (22/05/2026).
**Chi tiết:**
- **Quy mô:** đội Persistence Infrastructure chỉ ~7 người quản lý hàng chục cluster ScyllaDB với hàng trăm node. Thao tác như mở rộng production hay dựng shadow cluster trước đây mất **36+ giờ** thao tác tay (sequencing, validate, ngồi canh terminal); sau SCP còn **dưới 2 giờ** và engineer chỉ cần check lại sau.
- **Pattern thiết kế:** các "task" nhỏ (drain node, check repair status) ghép thành workflow YAML; workflow khai báo ràng buộc parallelism (vd "không bao giờ restart node ở nhiều availability zone cùng lúc"). **Mọi task bắt buộc idempotent.**
- **Reliability / state:** dùng **SQLite** lưu tiến độ job → job bị ngắt giữa chừng resume được mà không làm lại bước đã xong. Có precondition check bắt buộc trước mỗi task, retry tự động cho lỗi tạm thời, phân biệt lỗi recoverable / unrecoverable và bắn alert qua webhook.
- **Trade-off / bài học:** thay vì viết một "automation script" khổng lồ dễ sai, họ tách thành các đơn vị nhỏ idempotent + state bền vững — chính là cách bạn nên nghĩ về mọi job vận hành dài (backup, migration).
**Vì sao đáng đọc:** Joy Loyalty cũng có những thao tác hạ tầng dài và rủi ro (backfill Firestore, replay Pub/Sub, migrate data BigQuery). Pattern "task idempotent + workflow khai báo + state resume-able trong SQLite/Firestore" áp dụng trực tiếp cho Cloud Run job hay Cloud Functions của bạn để khỏi phải "ngồi canh terminal".

## [How we built Cloudflare's data platform and an AI agent on top of it](https://blog.cloudflare.com/our-unified-data-platform/) — (Cloudflare Blog, 28/05/2026)
**Đây là gì:** Cloudflare xây **Town Lake** — một data platform kiểu *lakehouse* gom dữ liệu rải rác khắp Postgres, ClickHouse, BigQuery, R2, Kafka về **một interface SQL duy nhất**. Lakehouse = query engine đọc thẳng từ object storage + một lớp metadata làm cho storage "hành xử như database" (schema, time-travel). Trên nền đó họ dựng **Skipper**, AI agent dịch câu hỏi tiếng tự nhiên thành SQL đã validate.
**Chi tiết:**
- Cloudflare xử lý **hơn 1 tỷ event/giây** trên toàn mạng; Town Lake cho phép một câu SQL join bảng Postgres + ClickHouse + Iceberg trên R2 mà không cần materialize bảng trung gian (query engine = **Apache Trino**).
- Dữ liệu cold/warm nằm trong **R2 Data Catalog (Apache Iceberg)** với schema evolution + time-travel; dữ liệu tự compact theo tuổi (per-minute → hourly → daily). Các thành phần phụ: DataHub (metadata catalog), Lifeguard (access control), Skimmer (PII detection bằng Workers AI), Transformer (ELT trên Workflows).
- **Skipper** dùng nhiều lớp context (schema, annotation của người, doc SQL, data model curated, runtime introspection) để tránh "hallucinate join". Kết quả: query billing chiếm 53% workload — "91.760 query từ 324 nhân viên"; query legacy 200–300 dòng rút còn 5 dòng.
**Vì sao đáng đọc:** Bạn đã có dữ liệu loyalty rải khắp Firestore + BigQuery; mô hình "một SQL interface gom nhiều nguồn + agent text-to-SQL có grounding chặt bằng metadata" là blueprint để dựng analytics/self-service query cho merchant mà không lo agent bịa schema.

## [Cloudflare Introduces Workflows V2 with Deterministic Execution and 50K Concurrent Workflows](https://www.infoq.com/news/2026/05/cloudflare-workflows-v2-release/) — (InfoQ, 15/05/2026)
**Đây là gì:** Cloudflare Workflows V2 — engine orchestrate workflow nhiều bước, stateful, với mô hình **deterministic & replayable**: mỗi step bị cô lập, idempotent và replay-safe nên khi lỗi có thể khôi phục từ checkpoint cuối thay vì chạy lại từ đầu. "Deterministic execution" = chạy lại cùng input luôn cho cùng kết quả, nền tảng để replay an toàn.
**Chi tiết:**
- Mỗi step độc lập, re-execute được an toàn; hệ thống tự persist state giữa các step và quản lý retry/timeout/failure → resume từ checkpoint thành công gần nhất.
- Nâng giới hạn scale: **50.000 workflow đồng thời** (trước là 4.500), 300 execution mới/giây mỗi account, 2 triệu instance queued mỗi workflow — nhắm vào AI agent và background processing quy mô lớn.
**Vì sao đáng đọc:** Cùng triết lý "step idempotent + replay từ checkpoint" như Discord SCP — đây là pattern chuẩn cho mọi long-running job. Khi viết Cloud Functions/Cloud Run orchestration cho loyalty (vd xử lý chuỗi event đổi điểm, gửi reward), thiết kế từng bước idempotent + lưu state để replay sẽ cứu bạn khi job fail giữa chừng.

## [How and Why Netflix Built a Real-Time Distributed Graph: Part 2 — Building a Scalable Storage Layer](https://netflixtechblog.medium.com/how-and-why-netflix-built-a-real-time-distributed-graph-part-2-building-a-scalable-storage-layer-ff4a8dbd3d1f) — (Netflix Tech Blog, 14/11/2025)
**Đây là gì:** Netflix xây Real-Time Distributed Graph (RDG) mô hình tương tác của member ở quy mô internet; Part 2 nói về lớp lưu trữ. Họ KHÔNG dùng graph database chuyên dụng mà chọn **KVDAL (Key-Value Data Abstraction Layer)** trên nền Apache Cassandra — map node/edge thành record key-value (node ID làm record ID, edge lưu dạng adjacency list).
**Chi tiết:**
- Quy mô production: **8 tỷ+ node, 150 tỷ+ edge**, duy trì **2 triệu read/giây và 6 triệu write/giây**; hạ tầng ~27 namespace trên 12 cluster Cassandra / 2.400 EC2 instance. EVCache đặt trước Cassandra cho latency sub-ms với hot data.
- **Vì sao loại Neo4j / Neptune:** performance giảm khi số node/edge và độ sâu query tăng; kiến trúc single-writer gây nghẽn ingestion; ít expertise nội bộ so với DB quan hệ/document.
- Mỗi loại node/edge có namespace riêng → scale độc lập, đổi storage backend linh hoạt, cô lập sự cố giữa các hệ.
**Vì sao đáng đọc:** Bài học "đừng mặc định chọn công nghệ chuyên dụng (graph DB) — đôi khi map bài toán graph lên key-value store quen thuộc (Cassandra ~ Firestore) lại scale tốt và dễ vận hành hơn" rất hợp với mindset Firestore-first của bạn.

---
*Mọi URL đã WebFetch xác minh tồn tại đúng tiêu đề/ngày trước khi ghi.*
