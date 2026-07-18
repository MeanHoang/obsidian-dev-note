# 🏗️ System Design — 2026-07-03

> Chủ đề hôm nay: resilience và fault isolation — từ Write-Ahead Log của Netflix, cell-based architecture, đến rủi ro region-level trong thế giới bất ổn địa chính trị.

## ⭐ [Building a Resilient Data Platform with Write-Ahead Log at Netflix](https://netflixtechblog.com/building-a-resilient-data-platform-with-write-ahead-log-at-netflix-127b6712359a) — (Netflix TechBlog)
**Đây là gì:** Netflix xây một hệ thống Write-Ahead Log (WAL) độc lập ở tầng data platform — ghi mọi thay đổi dữ liệu vào một log bền vững TRƯỚC khi apply xuống database/cache downstream, để không mất dữ liệu và có thể recover khi outage. Đây là pattern kinh điển (giống WAL trong Postgres) nhưng được nâng lên thành một dịch vụ dùng chung cho nhiều team.
**Chi tiết:**
- **Vấn đề giải quyết:** data loss, entropy của hệ thống replication, multi-partition failure, và data corruption — những lỗi mà retry đơn giản không cứu được.
- **Kiến trúc producer/consumer tách rời:** Producer là "cửa vào" nhận mutation từ app và ghi an toàn vào queue; Consumer là "cửa ra" đọc từ queue rồi đẩy tới đích (DB, cache, service khác). Vì chạy tách nhau nên consumer xử lý theo nhịp riêng, không làm chậm phần còn lại. Cả hai group tự động scale theo ngưỡng CPU/network.
- **Pluggable backend:** cùng một framework nhưng mỗi namespace chọn được backend khác nhau — Kafka hoặc Amazon SQS (mặc định bật dead-letter queue) — mà KHÔNG đổi code ứng dụng.
- **Use case nhờ log tập trung:** delayed queue (hoãn xử lý mutation khi downstream đang throttle/không sẵn sàng), cross-region replication (consumer ở mỗi region đọc topic rồi ghi lại vào EVCache region đó), và multi-table mutation. Đổi config (thêm consumer, bật delay queue) làm qua control plane trung tâm, không cần deploy code.
**Vì sao đáng đọc:** Với Joy Loyalty, mọi thao tác ghi điểm/đổi thưởng chạy qua Shopify webhook — một WAL/durable-log-trước-khi-apply chính là cách chống mất event và cho phép retry an toàn khi Firestore hoặc downstream tạm lỗi, thay vì xử lý trực tiếp rồi mất dữ liệu.

## [How Cell-Based Architecture Enhances Modern Distributed Systems](https://www.infoq.com/articles/cell-based-architecture-distributed-systems/) — (InfoQ)
**Đây là gì:** Cell-based architecture chia hệ thống thành nhiều "cell" độc lập, mỗi cell là một bản sao đầy đủ stack phục vụ một tập user/tenant riêng, dựa trên ba nguyên tắc: isolation, autonomy, replication.
**Chi tiết:**
- Dùng bulkhead pattern để cô lập lỗi: một cell chết chỉ ảnh hưởng phần user trong cell đó, không lan ra toàn hệ thống ("blast radius" nhỏ).
- Đây là câu trả lời cho vấn đề của microservice truyền thống: một service lỗi có thể kéo sập cả cụm qua chuỗi dependency.
**Vì sao đáng đọc:** Mindset "giới hạn blast radius" áp dụng trực tiếp khi thiết kế multi-tenant loyalty app — cô lập merchant lớn (BFCM traffic) để một shop đột biến không làm chậm toàn bộ platform.

## [When a Cloud Region Fails: Rethinking High Availability in a Geopolitically Unstable World](https://www.infoq.com/articles/sovereign-fault-domains-cloud-resilience/) — (InfoQ)
**Đây là gì:** Bài đề xuất khái niệm "sovereign fault domain" — ranh giới lỗi được định nghĩa theo pháp lý/chính trị/địa lý (chủ quyền), chứ không chỉ theo topology phần cứng như AZ.
**Chi tiết:**
- Luận điểm chính: multi-region design đang thay thế multi-AZ làm baseline HA cho hệ thống vượt biên giới pháp lý, vì rủi ro không chỉ là hardware failure mà cả jurisdiction (lệnh cấm, luật data residency).
**Vì sao đáng đọc:** Nhắc dev không mặc định "1 region GCP là đủ" — với data khách hàng EU/nhiều nước, region là một trục thất bại thật cần tính khi thiết kế backup/replication.

## [Slack Outlines Four-Phase Journey to a Multi-Cloud AI Serving Platform](https://www.infoq.com/news/2026/06/slack-multicloud/) — (InfoQ)
**Đây là gì:** Slack kể lại hành trình 4 giai đoạn xây một nền tảng serving AI chạy đa cloud, thay vì khoá cứng vào một nhà cung cấp.
**Vì sao đáng đọc:** Case study thực tế về việc tách abstraction serving khỏi hạ tầng cụ thể — bài học về tránh vendor lock-in khi ghép thêm tính năng AI/ML vào một stack GCP-first như Joy.
