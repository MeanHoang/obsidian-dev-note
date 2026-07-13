# 🏗️ System Design — 2026-07-06

> Hôm nay xoay quanh một chủ đề: làm sao scale phần "điều phối" (control plane, data movement) mà không vỡ — từ Cloudflare, Netflix tới kiến trúc modular monolith của Shopify.

## ⭐ [Rearchitecting the Workflows control plane for the agentic era](https://blog.cloudflare.com/workflows-v2/) — (blog.cloudflare.com, 2026-04-15)
**Đây là gì:** Case study Cloudflare tái kiến trúc control plane của Workflows V2 — một *durable execution engine* (engine chạy các job nhiều bước, mỗi bước bền vững, tự resume sau lỗi). Vấn đề cốt lõi: gỡ điểm nghẽn coordination tập trung để scale số workflow chạy song song.
**Chi tiết:**
- Nút thắt V1: mọi instance của một account đi qua **một** Durable Object singleton tên `Account` → giới hạn cứng **4.500 instance đồng thời** và **100 lần tạo / 10 giây**.
- Giải pháp V2 tách singleton thành 2 thành phần scale ngang: **SousChef** (metadata manager phân tán, mỗi cái quản một subset instance) và **Gatekeeper** (hệ thống leasing cấp "slot" concurrency theo chu kỳ 1 giây để gộp request, chống overload).
- Kết quả: concurrency **4.500 → 50.000 instance** (11x), tốc độ tạo **300 instance/giây/account**, hàng đợi **1M → 2M instance/workflow**. Mô hình thực thi *deterministic, replayable*: mỗi step isolated + idempotent, lỗi thì resume từ step cuối đã commit chứ không chạy lại toàn bộ.
- Trade-off / bài học: migration in-place — biến các object `Account` cũ thành `SousChef` mà **không downtime**; đánh đổi sự đơn giản của singleton lấy độ phức tạp phân tán (leasing, batching) để phá bottleneck.
**Vì sao đáng đọc:** Joy Loyalty chạy nhiều job nền (sync điểm, xử lý webhook, gửi campaign) trên Cloud Tasks/Firebase — mindset "mỗi step idempotent, resume-from-last-step thay vì retry cả job" và tách "slot leasing" khỏi worker là pattern trực tiếp áp dụng được để job không nhân đôi điểm khi retry.

## [Data Bridge: How Netflix simplifies data movement](https://netflixtechblog.com/data-bridge-how-netflix-simplifies-data-movement-36d10d91c313) — (netflixtechblog.com, 2026-01-31)
**Đây là gì:** Netflix xây **Data Bridge** — một *control plane* thống nhất, pluggable, để khai báo các job di chuyển dữ liệu (batch/stream) tách rời khỏi engine thực thi bên dưới.
**Chi tiết:**
- Quy mô (1/2026): ~**20.000 job** riêng biệt, hỗ trợ **hơn 3 chục cặp source–destination**, chạy ~**300.000 job/tuần**.
- Kiến trúc theo lớp: **Registry** (khai báo connector + map intent→hệ thống thật), **Parameter abstraction** (chuẩn hoá config, validation, type), và tích hợp **Maestro** (orchestrator của Netflix) để thực thi — Data Bridge chỉ quản metadata + governance.
- Điểm hay: nó **không tự viết execution engine mới** mà bọc (abstract) các công cụ batch/stream sẵn có; Data Bridge là "paved path" cho batch, còn Data Mesh cho streaming.
**Vì sao đáng đọc:** Pattern "tách intent khỏi implementation" là bài học để thiết kế lớp abstraction cho các integration Shopify → BigQuery/Firestore export của Joy Loyalty: mô tả "muốn gì" một chỗ, đổi engine bên dưới không phải sửa consumer.

## [E-Commerce at Scale: Inside Shopify's Tech Stack](https://shopify.engineering/e-commerce-at-scale-inside-shopifys-tech-stack) — (shopify.engineering)
**Đây là gì:** Giải thích lựa chọn kiến trúc **modular monolith + pod** của Shopify — thay vì vỡ thành hàng trăm microservice.
**Chi tiết:**
- **Pod** = một bản Shopify cô lập hoàn toàn, có datastore riêng (MySQL, Redis, memcached), spawn được ở bất kỳ region nào; Shopify có hơn 100 pod.
- Kết quả: sự cố chỉ ảnh hưởng **1 pod / 1 region**, không còn outage toàn cục — isolation là chiến lược reliability chính.
- Codebase vẫn là monolith (Ruby on Rails, React, MySQL, Kafka) nhưng chia thành component có ranh giới nghiêm ngặt, deploy độc lập.
**Vì sao đáng đọc:** Là Shopify app dev, hiểu vì sao "pod isolation" quan trọng giúp lý giải hành vi region/latency của Admin API; và modular monolith là lời nhắc rằng team nhỏ như Joy Loyalty không cần chẻ nhỏ microservice mới scale được.

## [The Evolution of Cassandra Data Movement at Netflix](https://netflixtechblog.com/the-evolution-of-cassandra-data-movement-at-netflix-6e13329c80a1) — (netflixtechblog.com, 05/2026)
**Đây là gì:** Netflix thiết kế lại cách di chuyển dữ liệu Cassandra, dựng trên **Apache Cassandra Analytics** + framework nội bộ **Move Data**.
**Vì sao đáng đọc:** Hướng đi "layered, purpose-built stack để tái sử dụng và dễ bảo trì" thay cho công cụ ad-hoc là mindset craft đáng ngẫm khi Joy Loyalty phải build tooling data lặp đi lặp lại — ưu tiên lớp tái dùng thay vì viết lại từng lần.
