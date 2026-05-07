# 📖 Glossary — Cloud / Serverless / DevOps

> Gặp thuật ngữ nào khó hiểu thì note vào đây. Mỗi lần quay lại đọc là nhớ thêm 1 chút. Tra nhanh bằng `Ctrl+F`.

---

## A
**At-least-once delivery** — Message/event được giao **ít nhất 1 lần** (đôi khi 2+). Consumer **bắt buộc** dedupe. Pub/Sub default. Đối lập: exactly-once.

**Auto-scaling** — Tự động tăng/giảm số instance theo metric (CPU%, request rate, queue length). Đặc trưng cốt lõi của serverless. Xem [[0-Serverless]].

## B
**Backpressure** — Cơ chế consumer **báo ngược** producer "tao xử lý không kịp, gửi chậm lại". Tránh queue/memory phình to. Pub/Sub có flow control (`maxOutstandingMessages`).

**BaaS (Backend-as-a-Service)** — Provider cho sẵn DB + auth + storage + push, dev không viết backend code. Vd Firebase, Supabase. Đối lập với FaaS. Chi tiết [[0-Serverless]].

**Blue-Green deployment** — 2 env y hệt: Blue đang serve, Green deploy version mới. Test xong → switch traffic sang Green. Rollback = switch lại Blue. Zero-downtime + rollback tức thì.

## C
**Cache (Hit / Miss / TTL / Eviction)** — Hit = tìm thấy trong cache (nhanh). Miss = không có, fetch từ source. TTL = thời gian cache valid. Eviction = chính sách đẩy bản nào ra khi đầy (LRU phổ biến nhất).

**Canary deployment** — Deploy version mới cho **% nhỏ user** (vd 5%) trước, monitor metric. OK thì tăng dần. Cloud Run: `gcloud run services update-traffic --to-revisions=v2=10`.

**CDN (Content Delivery Network)** — Mạng cache static content ở nhiều edge location, user gần edge nào fetch từ đó. GCP có Cloud CDN, Firebase Hosting built-in CDN.

**CI/CD** — CI (Continuous Integration) = mỗi commit tự build + test. CD (Continuous Delivery/Deployment) = tự deploy lên staging/prod. GCP có Cloud Build.

**CIDR** — Notation đặt range IP, vd `10.0.0.0/24` = 256 IP. Cheat: `/32` = 1 IP, `/24` = 256 IP, `/16` = 65k IP. Số sau `/` càng nhỏ = range càng lớn.

**Cold start** — Thời gian từ request đầu đến lúc code chạy được, khi instance phải khởi tạo từ đầu. Vấn đề chung của mọi serverless. Chi tiết [[1-Cold Start]].

**Concurrency vs Parallelism** — Concurrency = "đang xử lý nhiều việc cùng lúc" (có thể time-slicing 1 CPU). Parallelism = "thực sự chạy đồng thời" (cần nhiều CPU). Cloud Run `--concurrency 80` = concurrent, không nhất thiết parallel.

**Container / Image / Registry** — Container = process isolated chạy app. Image = snapshot file system + config để spawn container. Registry = nơi lưu image (Artifact Registry GCP, Docker Hub).

## D
**Data Lake vs Data Warehouse** — Lake = lưu raw, mọi format (JSON, parquet, log). Vd Cloud Storage. Warehouse = structured, query SQL nhanh. Vd BigQuery. Pattern: lake staging → warehouse analytics.

## E
**Egress** — Data **ra** ngoài service (response, gọi API ngoài, download). **Tính tiền** ($0.12/GB cross-continent). Cost trap: serve ảnh từ Cloud Storage = mỗi MB download tốn tiền.

**ETL vs ELT** — ETL = Extract → Transform → Load (transform trước khi vào warehouse). ELT = Extract → Load → Transform (transform sau bằng SQL trong warehouse). BigQuery thường ELT vì compute rẻ.

**Event-driven Architecture** — Service giao tiếp qua event (Pub/Sub) thay vì gọi REST trực tiếp → decouple producer/consumer. Đặc điểm: async, eventual consistency, fan-out dễ.

**Eventual consistency** — Read sau write có thể thấy giá trị cũ trong vài ms-giây trước khi sync. Cloud Storage default. BigQuery streaming insert. Đối lập: strong consistency.

**Exactly-once delivery** — Message giao đúng 1 lần. Đắt + chậm hơn at-least-once. Pub/Sub có nhưng giảm throughput. Pattern thực tế: at-least-once + idempotent code = đạt hiệu ứng exactly-once mà rẻ.

## F
**FaaS (Function-as-a-Service)** — Viết function ngắn (1 file, 1 endpoint), platform chạy theo trigger. Vd AWS Lambda, Cloud Functions, Azure Functions. Stateless, pay-per-execution. Chi tiết [[0-Serverless]].

## G
**Graceful shutdown** — Khi instance bị scale down/restart, app cần xử lý xong request đang dở rồi mới tắt. Cloud Run signal `SIGTERM` → có **10 giây** để cleanup trước `SIGKILL`. Code: `process.on("SIGTERM", () => server.close())`.

## H
**Health check** — Check instance còn "sống" và "sẵn sàng" không. 2 loại: Liveness (fail = kill + restart) và Readiness (fail = không route traffic, không kill). Cloud Run mặc định check `/` trong 240s.

**Horizontal vs Vertical scaling** — Vertical = scale up (máy lớn hơn). Có giới hạn. Horizontal = scale out (nhiều máy chạy song song). Phổ biến hơn cho cloud. Serverless luôn horizontal.

## I
**IaC (Infrastructure as Code)** — Định nghĩa hạ tầng bằng code/config thay vì click UI. Cho phép version control + replay y hệt mọi env. Tool: Terraform, Pulumi, CloudFormation, Deployment Manager.

**IAM (Identity & Access Management)** — Hệ thống phân quyền: ai (principal) được làm gì (permission) trên cái gì (resource). Cấu trúc: Principal + Role + Resource. Role = tập permission (vd `roles/firestore.admin`).

**Idempotent / Idempotency** — Property: chạy operation **nhiều lần** vẫn cho **kết quả y hệt 1 lần**. Cực kỳ quan trọng cho retry safety. `set({merge: true})` Firestore là idempotent. `increment(50)` **KHÔNG** idempotent.

**Idempotency Key** — Token client tự gen + gửi kèm request → server dedupe theo token. Pattern chuẩn cho payment API (Stripe). Header `Idempotency-Key: uuid-abc-123`.

**Ingress** — Data **vào** service (request đến API). Thường free. Đối lập: egress.

## J
**JWT (JSON Web Token)** — Token dạng `header.payload.signature` (base64), self-contained — chứa info user + claim, verify bằng signature không cần query DB. Không revoke được trước khi hết hạn (trừ khi maintain blacklist). Firebase ID token là JWT.

## L
**Latency** — Bao **lâu** mỗi request mất (ms). Đo bằng percentile p50/p95/p99. Đối lập với throughput.

**Liveness probe** — Health check kiểm tra "instance còn sống không". Fail = kill + restart instance. Khác readiness (fail = chỉ unroute).

## M
**Microservice vs Monolith** — Monolith = 1 codebase, 1 deploy, share DB. Microservice = N service nhỏ, mỗi cái deploy riêng, DB riêng. Microservice scale + team độc lập, nhưng debug khó + cost ops cao.

**mTLS (mutual TLS)** — TLS 2 chiều — cả client và server verify cert lẫn nhau. Dùng cho service-to-service auth high-security.

**Multi-region** — Data replicate qua 2+ region → chống region-wide outage. Latency cao hơn + giá đắt hơn single-region.

## N
**NAT (Network Address Translation)** — Cho instance không có public IP **vẫn gọi ra internet** qua 1 IP chung. Cloud NAT là service GCP. Use case: Cloud Run egress qua NAT → có **fixed IP** để bên ngoài (Shopify, Stripe) whitelist.

## O
**OAuth scope** — Quyền cụ thể app xin user khi authorize. Vd Shopify scope `read_orders` ≠ `write_orders`. Best practice: xin scope tối thiểu cần thiết.

## P
**p50 / p95 / p99** — Cách đo latency phân bố thay vì trung bình. p50 = median (50% request nhanh hơn). p95 = 95% nhanh hơn (số đáng quan tâm cho UX). p99 = phản ánh worst case 1% user gặp phải, thường là cold start.

**Parallelism** — Xem Concurrency.

**Partition / Partitioning** — Chia table/topic thành nhiều phần (partition) lưu riêng → scale + query nhanh hơn. BigQuery partition table by date. Pub/Sub partition topic.

**PoLP (Principle of Least Privilege)** — Cấp quyền **tối thiểu** đủ làm việc, không hơn. Service chỉ read Firestore → cho `firestore.viewer`, không phải `firestore.admin`. Nếu bị hack, attacker chỉ leak read được.

**Provisioning** — Quá trình **cấp phát tài nguyên** (CPU, RAM, network, storage) cho service trước khi chạy. Có thể manual (click console) hoặc tự động (IaC). Vd `gcloud run deploy ...` = yêu cầu Google provision Cloud Run service.

## Q
**Quota vs Limit** — Quota = giới hạn **mềm**, có thể request tăng (vd Cloud Functions concurrent execution). Limit = giới hạn **cứng**, không xin tăng (vd Firestore document max 1 MiB).

## R
**Rate limiting** — Xem Throttling.

**Readiness probe** — Health check kiểm tra "instance sẵn sàng nhận request chưa". Fail = route traffic đi chỗ khác nhưng KHÔNG kill instance. Khác liveness.

**Region vs Zone** — Region = vùng địa lý (vd `asia-southeast1` = Singapore). Zone = data center cụ thể trong region (vd `asia-southeast1-a/b/c`) — failure isolation.

**Replica / Replication** — Bản copy của data trên nhiều node để đọc nhanh + chống mất data. Read replica = chỉ đọc, write vẫn về primary. Multi-master = write nhiều nơi nhưng phải resolve conflict.

**Rollback** — Quay lại version cũ khi deploy mới có bug. Cloud Run lưu lịch sử revision → rollback 1 lệnh: `gcloud run services update-traffic SERVICE --to-revisions=REVISION-OLD=100`.

## S
**Service Account** — "User máy" cho service-to-service auth, không phải người. Cloud Run/Functions chạy dưới identity của 1 SA → IAM cho phép truy cập service khác. Best practice: tạo SA riêng cho mỗi service.

**Sharding** — Chia data lớn thành nhiều phần nhỏ (shard) lưu trên node khác nhau → scale horizontal. Firestore tự shard, bạn không quản lý — nhưng nên rải write tránh **hot doc** (>1 write/s/doc → throttle).

**SLI / SLO / SLA** — SLI (Indicator) = metric đo độ khoẻ (vd uptime %, p99 latency). SLO (Objective) = mục tiêu nội bộ team đặt (vd p99 < 500ms 99.9% time). SLA (Agreement) = **cam kết với khách hàng** (vd 99.9% uptime, vi phạm hoàn tiền).

**Stateful vs Stateless** — Stateless = không nhớ state giữa request. Scale dễ, restart không mất gì. Stateful = nhớ state in-memory hoặc disk. Cần sticky session, scale khó. Serverless ép stateless — state đẩy ra Firestore/Redis.

**Strong consistency** — Read sau write **luôn** thấy giá trị mới. Firestore default cho single-doc. Đối lập: eventual consistency.

## T
**Throttling** — **Chặn** request khi vượt quota để bảo vệ service. Trả `429 Too Many Requests`. Vd Shopify API rate limit 2 req/s/app → vượt = bị throttle, phải retry với backoff.

**Throughput** — Bao **nhiêu** request/giây xử lý được (RPS, TPS). Tăng concurrency thường tăng throughput nhưng cũng tăng latency (queue chờ). Đối lập với latency.

## V
**VPC (Virtual Private Cloud)** — Mạng ảo private trong cloud, isolated với mạng khác. Cho phép service nội bộ giao tiếp qua internal IP, không qua public internet. Use case: Cloud Run kết nối Cloud SQL trong VPC → không expose DB ra internet.

## W
**Webhook** — Bên A gọi HTTP POST đến URL của bên B mỗi khi có event. Ngược với polling (B liên tục hỏi A "có gì mới không"). Joy: Shopify gửi webhook `orders/paid` → Cloud Functions nhận → cộng điểm.

## Z
**Zone** — Xem Region vs Zone.

---
## 📚 Nguồn ngoài
- [Cloud Terminology Glossary — Lucidchart](https://www.lucidchart.com/blog/cloud-terminology-glossary)
- [Cloud Computing Glossary — Hava.io](https://www.hava.io/blog/cloud-computing-glossary-of-terms)
- [What is IaC — Microsoft Learn](https://learn.microsoft.com/en-us/devops/deliver/what-is-infrastructure-as-code)
- [Cloud Provisioning — DevX](https://www.devx.com/terms/cloud-provisioning/)
