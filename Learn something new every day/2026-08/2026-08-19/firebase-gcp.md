# 🔥 Firebase & GCP — 2026-08-19

> Firestore mở khoá full-text search + JOIN qua Pipelines, Cloud Run thêm SSH/Instances/billing caps, và Firebase công bố số liệu eval cho Agent Skills — toàn bộ đều chạm trực tiếp vào stack hàng ngày của Joy Loyalty.

## ⭐ [Firestore at Next '26: Unlock agentic development, search and MongoDB compatibility](https://cloud.google.com/blog/products/databases/firestore-agentic-ai-search-and-mongodb-compatibility) — (cloud.google.com/blog, 05/05/2026)

**Đây là gì:** Bản cập nhật lớn nhất của Firestore từ trước tới nay: bổ sung "Pipeline operations" cho Enterprise edition — cách viết query kiểu pipeline thay cho API `where().orderBy()` truyền thống, mở đường cho full-text search, geospatial và cả JOIN mà trước đây Firestore không làm được.

**Chi tiết:**
- **JOIN đã GA** trong Pipelines, hiện thực bằng subquery giữa các collection — trước đây muốn ghép dữ liệu là phải denormalize hoặc query nhiều vòng ở client.
- **Full-text search (preview)** dùng chính công nghệ search của Google, hỗ trợ 40+ ngôn ngữ, index **strongly consistent** (khác hẳn Algolia/Typesense phải sync bất đồng bộ).
- **Geospatial queries (preview)**: query theo bán kính trực tiếp trong pipeline, ví dụ `field('location').geoDistance(new GeoPoint(38.989177, -107.065076)).lessThan(1000)`.
- **Firestore Skills + Firestore remote MCP service đã GA** cho agent bên thứ ba (Claude Code, Cursor, Codex) — agent có thể query/inspect schema Firestore trực tiếp.
- **MongoDB compatibility**: document size nâng lên **16MiB**, change streams GA (sync realtime sang BigQuery), drop collection bằng 1 lệnh, TTL offset linh hoạt hơn.
- Bài viết nêu quy mô: **750.000 developer hoạt động hàng tháng**, **10M+ database**, SLA **99.999%**; case study FlutterFlow: 750 tỷ read, 75 tỷ write, 0 outage trong 5 năm.

**Vì sao đáng đọc:** Nếu Joy Loyalty đang phải bơm dữ liệu customer/reward sang một search engine ngoài hoặc tự viết vòng lặp "query rồi ghép tay" giữa collection `shops`/`customers`/`transactions`, thì JOIN GA + full-text search consistent có thể xoá luôn cả một lớp hạ tầng đồng bộ.

## ⭐ [Eval-driven development: How we build better agent skills for Firebase](https://firebase.blog/posts/2026/08/eval-driven-development-agent-skills) — (firebase.blog, 11/08/2026)

**Đây là gì:** Firebase Agent Skills là các "cheat sheet hướng kết quả" nhét vào AI coding agent để nó dùng đúng API Firebase, tránh feature deprecated và viết Security Rules an toàn. Bài này công bố quy trình eval và số liệu đo thực tế.

**Chi tiết:**
- Skills không phải bản docs đầy đủ mà là hướng dẫn ngắn theo outcome, nhắm đúng những chỗ agent hay sai: setup Firestore an toàn và viết Firebase Security Rules.
- Ba loại eval: single-skill, skill activation (skill có được kích hoạt đúng lúc không), và end-to-end nhiều skill.
- **Pass rate: 31,7% → 78,0%** khi bật Skills.
- Đồng thời giảm chi phí chứ không đánh đổi: input token trung bình **285,1k → 169,5k**, output token **9,5k → 5,8k**, thời gian chạy **144,3s → 101,2s**.
- Quy trình eval-driven này còn kéo theo cải tiến cho Firebase CLI: help text rõ hơn, luồng agent login mượt hơn.

**Vì sao đáng đọc:** Bạn dùng Claude Code hàng ngày trên codebase Firebase — cài Firebase Agent Skills là cách rẻ nhất để agent thôi sinh ra Security Rules hớ hênh và API cũ, với bằng chứng định lượng chứ không phải marketing.

## [What's new in Cloud Run at Next '26](https://cloud.google.com/blog/products/serverless/whats-new-for-cloud-run-at-next26) — (cloud.google.com/blog, 23/04/2026)

**Đây là gì:** Tổng hợp các tính năng mới của Cloud Run, trong đó có vài thứ vá đúng những điểm đau kinh điển của serverless: không debug được container đang chạy, và không chặn được hoá đơn.

**Chi tiết:**
- **SSH vào service (preview)**: `gcloud run services ssh SERVICE` — vào thẳng container đang chạy để soi filesystem, không còn phải đoán qua log.
- **Ephemeral disk (preview)**: ổ tạm theo từng instance, xử lý file lớn mà không ăn vào RAM container.
- **Billing caps (coming soon)**: đặt trần chi tiêu tháng, vượt thì resource tự deactivate.
- **Cloud Run Instances (preview)**: truy cập primitive từng instance, mount Cloud Storage volume, hợp cho background agent chạy dài.
- **Remote MCP server GA** và **GPU NVIDIA RTX PRO 6000 Blackwell GA** (serve model 70B+, scale to zero).
- **Service bindings (coming soon)** cho giao tiếp service-to-service, và **Cloud Run Sandboxes** cho chạy code sinh bởi agent trong môi trường cô lập.

**Vì sao đáng đọc:** SSH + billing caps là hai thứ trực tiếp giảm rủi ro vận hành cho backend Joy Loyalty trên Cloud Run: debug sự cố production nhanh hơn và chặn được kịch bản một webhook loop đốt hoá đơn cuối tháng.

## [Realtime PostgreSQL: From Data Connect to SQL Connect](https://firebase.blog/posts/2026/04/whats-new-sql-connect/) — (firebase.blog, 29/04/2026)

**Đây là gì:** Firebase Data Connect đổi tên thành **Firebase SQL Connect**, vẫn là lớp Postgres managed của Firebase nhưng nay tập trung khai thác hết sức mạnh Postgres thay vì bó trong GraphQL.

**Vì sao đáng đọc:** Có realtime subscription qua directive `@refresh`, offline caching, và cho phép chạy raw SQL (kể cả PostGIS) trong operation file — đáng cân nhắc nếu phần analytics/report của Joy Loyalty cần quan hệ và aggregate mà Firestore vốn làm gượng ép; giá công bố từ 01/05 là **0,90 USD / triệu operation**, miễn phí 250.000 operation/tháng trên Blaze.

## [What's new from Firebase at Google I/O 2026](https://firebase.blog/posts/2026/05/google-io-2026-announcements/) — (firebase.blog, 19/05/2026)

**Đây là gì:** Tổng hợp công bố Firebase tại I/O 2026, đáng chú ý nhất là App Check chuyển sang one-time token và Google Cloud Starter Tier cho deploy miễn phí.

**Vì sao đáng đọc:** **App Check replay attack protection bằng one-time token** là thay đổi bảo mật cần để mắt — token bị replay là con đường trực tiếp để ai đó bào quota Firestore/Functions của app Joy Loyalty, và cơ chế mới chặn đúng lỗ hổng đó.

---

**Nguồn:** [Firestore at Next '26](https://cloud.google.com/blog/products/databases/firestore-agentic-ai-search-and-mongodb-compatibility) · [Firebase Agent Skills eval](https://firebase.blog/posts/2026/08/eval-driven-development-agent-skills) · [Cloud Run at Next '26](https://cloud.google.com/blog/products/serverless/whats-new-for-cloud-run-at-next26) · [SQL Connect](https://firebase.blog/posts/2026/04/whats-new-sql-connect/) · [Firebase at I/O 2026](https://firebase.blog/posts/2026/05/google-io-2026-announcements/)
