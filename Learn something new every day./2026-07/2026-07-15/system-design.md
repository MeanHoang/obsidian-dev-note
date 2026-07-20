# 🏗️ System Design — 2026-07-15

> Hôm nay xoay quanh "durable event log" làm xương sống cho hệ AI-agent (Shopify), bản đồ dependency real-time ở Netflix, và các pattern giữ hệ event-driven không sập khi tải dồn.

## ⭐ [Under the River — kiến trúc Aquifer chạy AI agent của Shopify](https://shopify.engineering/under-the-river) — (shopify.engineering, 28/05/2026)
**Đây là gì:** Aquifer là platform nội bộ của Shopify để chạy AI agent (ví dụ "River" — agent sống trong Slack, đọc code, chạy test, mở PR). Nguyên tắc thiết kế cốt lõi: *"the session must survive"* — phiên làm việc của agent phải sống sót kể cả khi process chết. Cách họ đạt được điều đó là tách bạch "trí nhớ" khỏi "nơi thực thi".
**Chi tiết:**
- **Session (durable identity):** lịch sử hội thoại canonical được lưu bằng *append-only event log* trên Postgres. Không lưu state trong RAM của process — mọi thứ replay được từ log, nên process crash không mất phiên. Đây chính là pattern **event sourcing**: state = kết quả replay chuỗi event bất biến.
- **Harness (vòng lặp agent):** đọc history → gọi model → phát ra "tool intent". Được thiết kế *disposable* (dùng xong vứt), có thể tạo lại hoặc swap mà không đụng tới session.
- **Sandbox:** nơi code thật sự chạy (filesystem, shell, repo). Ephemeral, thay thế được, thường tạo mới cho từng phiên. Điểm mấu chốt: **harness chạy NGOÀI sandbox** → 3 lợi ích: cô lập blast radius (an toàn), swap model/runtime dễ (replaceable), log toàn bộ luồng quyết định tập trung (observable).
- **Gateway:** đóng vai credentials proxy + observability pipeline, giữ harness tách khỏi môi trường thực thi.
- **Kết quả 30 ngày:** 59.918 session trên 5.170 channel, 7.000+ nhân viên tham gia, 3.536 PR được agent coauthor merge. Phiên trung vị 19 phút với 50 tool call. Bài học đắt giá: hạ tầng "thân thiện với con người" (monorepo, môi trường reproducible, skill có tài liệu) hóa ra cũng "thân thiện với agent".
**Vì sao đáng đọc:** Nếu Joy Loyalty muốn nhét AI agent vào workflow (xử lý ticket, tự động cấu hình loyalty rule), bài này cho thấy mấu chốt không phải model mà là *durable event log tách khỏi runtime* — đúng thứ Firestore/Postgres append-only có thể làm được để agent không mất trạng thái giữa chừng.

## [Building Service Topology at Scale — bản đồ phụ thuộc dịch vụ real-time của Netflix](https://netflixtechblog.com/building-service-topology-at-scale-architecture-challenges-and-lessons-learned-f4b792f3f0d8) — (netflixtechblog.com, 14/07/2026)
**Đây là gì:** "Service topology" = bản đồ real-time cho biết dịch vụ nào gọi dịch vụ nào. Netflix xây hệ này để khi có sự cố thì đo được *blast radius* (một dịch vụ chết kéo theo những dịch vụ nào) và troubleshoot nhanh trong kiến trúc microservice khổng lồ.
**Chi tiết:**
- Gộp 3 nguồn dữ liệu vào các lớp graph tách biệt vật lý: **eBPF network flow** (bắt lưu lượng ở tầng kernel), **IPC metric**, và **distributed tracing**.
- Xử lý hàng triệu flow record/giây, dựng lại topology tại *bất kỳ thời điểm nào trong quá khứ* (time-travel query), trả kết quả sub-second, giữ độ tươi gần real-time.
- Đang chạy production, được các team dùng hằng ngày cho điều tra sự cố, phân tích blast radius và quản lý thay đổi.
**Vì sao đáng đọc:** Mindset "muốn debug hệ phân tán phải quan sát được dependency động, không đoán bằng sơ đồ tĩnh" — áp dụng ngay cả ở quy mô nhỏ: log quan hệ gọi giữa các Cloud Run service / webhook Shopify để biết cái gì gãy thì kéo theo cái gì.

## [Designing Resilient Event-Driven Systems at Scale](https://www.infoq.com/articles/scalable-resilient-event-systems/) — (infoq.com)
**Đây là gì:** Bài phân tích tại sao kiến trúc event-driven hay "vỡ trận" khi tải dồn, và các pattern giữ nó bền. Giới thiệu **shuffle sharding**: chia consumer thành nhiều nhóm nhỏ ngẫu nhiên sao cho một "khách hàng độc hại" chỉ làm sập vài shard chứ không kéo sập toàn hệ.
**Chi tiết:**
- Hệ event-driven thường gãy vì: retry chồng chất, backpressure, và startup latency — nhất là lúc load spike.
- Pattern cứu: **shuffle sharding** (cô lập lỗi), **provisioning** (chuẩn bị năng lực trước), và **fail fast** (thất bại nhanh thay vì retry vô tận) giúp tăng độ bền và tối ưu chi phí.
- Cạm bẫy kinh điển: quá phụ thuộc retry và bỏ quên observability.
**Vì sao đáng đọc:** Joy Loyalty xử lý webhook Shopify (order, refund) qua queue — hiểu shuffle sharding + fail fast giúp một shop "spam" event không làm nghẽn queue của mọi merchant khác.

## [Event-Driven Patterns for Cloud-Native Banking — inbox/outbox trong thực chiến](https://www.infoq.com/articles/event-driven-banking-architecture/) — (infoq.com)
**Đây là gì:** Case study áp dụng event-driven cho hệ ngân hàng, nơi *không được phép mất event hay xử lý trùng*. Giới thiệu **outbox pattern** (ghi event vào bảng "outbox" trong cùng transaction DB rồi mới publish → tránh mất event khi DB commit nhưng publish fail) và **inbox pattern** (khử trùng lặp phía consumer).
**Chi tiết:**
- Kết hợp *domain event* + *integration event* với inbox/outbox để hệ vừa resilient, vừa scale, vừa auditable.
- Trọng tâm là tính nhất quán giữa "ghi DB" và "phát event" — vấn đề dual-write kinh điển mà outbox giải quyết gọn.
**Vì sao đáng đọc:** Bất kỳ chỗ nào Joy Loyalty vừa update Firestore vừa cần trigger event (cộng điểm rồi gửi email), outbox pattern là cách chuẩn để không rơi vào cảnh "điểm đã cộng mà email không bao giờ gửi".
