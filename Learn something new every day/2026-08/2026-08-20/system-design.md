# 🏗️ System Design — 2026-08-20

> Chủ đề xuyên suốt hôm nay: **bỏ single-point coordinator**. Cloudflare tách 1 Durable Object trung tâm thành nhiều shard để scale 10x, GitHub đẩy cache xuống client để bỏ round-trip, Stripe tự động hoá migration để không bao giờ phải downtime.

## ⭐ [Rearchitecting the Workflows control plane for the agentic era](https://blog.cloudflare.com/workflows-v2/) — (Cloudflare Blog)

**Đây là gì:** Case study re-architect control plane. *Cloudflare Workflows* là dịch vụ chạy long-running job có state (giống Temporal / Step Functions) trên edge. *Durable Object* (DO) là primitive của Cloudflare: một object single-threaded, có storage riêng, chỉ tồn tại đúng 1 instance toàn cầu — rất tiện để làm coordinator, nhưng chính vì single-threaded nên nó là **bottleneck cổ điển**.

**Chi tiết:**
- **Vấn đề V1:** mỗi account chỉ có **một** Durable Object quản lý toàn bộ metadata + lifecycle của workflow. Khi workflow chuyển từ "người bấm nút" sang "AI agent tự tạo" (agentic era), pattern tạo instance đổi từ vài cái/phút thành **hàng nghìn instance trong vài giây** → DO đơn lẻ chết ngộp.
- **Giải pháp — 2 component mới:**
  - **SousChef**: shard hoá coordinator. Thay vì 1 DO ôm hết, mỗi account có nhiều SousChef, mỗi cái quản một *subset* workflow → phân tán tải theo chiều ngang.
  - **Gatekeeper**: cấp phát concurrency slot theo cơ chế **leasing**, và **batch mỗi giây một lần** thay vì hỏi coordinator từng request. Đây là pattern kinh điển: đổi độ chính xác tức thời lấy throughput.
- **Kết quả (số liệu bài nêu):** concurrent instances **4.500 → 50.000**; tốc độ tạo **100 → 300 instance/giây/account**; queued instances **1M → 2M mỗi workflow**.
- **Trade-off có chủ đích:** họ đẩy việc ra **background task + alarm** thay vì làm đồng bộ. Chấp nhận execution trễ một chút để giữ critical path nhanh — nghĩa là hệ thống ưu tiên *reliability + throughput* hơn *latency worst-case của một instance đơn lẻ*.
- **Chiêu migration đáng học:** họ **không** migrate metadata của hàng triệu instance. Thay vào đó, convert luôn DO account cũ thành một SousChef — dữ liệu cũ ở nguyên chỗ, chỉ đổi vai trò. Migration zero-copy.

**Vì sao đáng đọc:** Đây gần như là bản mô tả tương lai của Joy Loyalty. Mọi app Shopify đều có một dạng "account-level coordinator" — ví dụ 1 document Firestore giữ config/counter cho cả shop, hay 1 Cloud Task queue cho mỗi merchant. Ngày thường không sao; đến BFCM hoặc khi merchant chạy bulk campaign thì đúng cái pattern V1 này nổ. Hai bài học áp thẳng: (1) shard coordinator theo subset thay vì một object duy nhất — Firestore distributed counter cũng chính là ý này; (2) **leasing + batch mỗi giây** cho rate limit / concurrency thay vì đọc-ghi counter mỗi request, tiết kiệm cả latency lẫn hoá đơn Firestore. Và mẹo migration "đổi vai trò thay vì copy dữ liệu" là thứ nên nhớ cho lần refactor schema tiếp theo.

## [From latency to instant: Modernizing GitHub Issues navigation performance](https://github.blog/engineering/architecture-optimization/from-latency-to-instant-modernizing-github-issues-navigation-performance/) — (GitHub Blog, 14/05/2026)

**Đây là gì:** Case study performance architecture ở tầng client. GitHub viết lại luồng điều hướng của Issues bằng React, dùng **IndexedDB** (database trong browser) làm cache bền vững, kèm in-memory cache phía trên.

Hai pattern chính:
- **Stale-while-revalidate**: render ngay từ dữ liệu local, rồi mới gọi server xác thực lại ở background. Người dùng thấy nội dung tức thì, dữ liệu cũ được thay êm.
- **Preheating** (khác prefetch mù): chỉ nạp trước khi dữ liệu *chưa* có local, kích hoạt từ các "high-intent surface" như danh sách issue, chạy trên low-priority worker có **rate-limit + circuit breaker** để không tự DDoS chính mình.

Kết quả bài nêu: P10 ~600ms → **70ms**, P50 ~1.200ms → **700ms**, P90 2.400ms → 2.100ms; cache-hit ratio **~33% → 96%**; khoảng **70%** lượt điều hướng React về dưới 200ms ("instant").

**Vì sao đáng đọc:** Admin Polaris của Joy Loyalty là SPA nhúng trong iframe Shopify — mọi lần merchant nhảy giữa danh sách reward, campaign, customer đều là một round-trip. Chi tiết đắt nhất ở đây là **P90 gần như không cải thiện** (2.400 → 2.100ms): caching kéo phần lớn người dùng lên "instant" nhưng không cứu được đuôi phân phối. Muốn sửa P90 phải sửa query/backend, không phải cache. Đó là cách đọc metric đúng — đừng nhìn mỗi median rồi tuyên bố thắng lợi. Ngoài ra circuit breaker cho preheat là chi tiết dễ quên: prefetch quá tay thì chính app tự tạo tải.

## [Durable Objects aren't just durable, they're fast: a 10x speedup for Cloudflare Queues](https://blog.cloudflare.com/how-we-built-cloudflare-queues/) — (Cloudflare Blog, 24/10/2024)

**Đây là gì:** Bài "tiền truyện" của item ⭐ ở trên, cùng một căn bệnh và cùng một bài thuốc — nên đọc cặp với nhau để thấy pattern lặp lại. Queues v1 dùng **một** Durable Object cho mỗi queue, lại đặt cố định ở Western North America → vừa nghẽn single-thread vừa ăn latency xuyên lục địa cho user ở xa.

V2 tách thành: nhiều **Storage Shard** DO rải khắp các region, một **Coordinator** DO giữ **Shard Map** lưu trong Workers KV để load-balance và autoscale, cộng **Consumer Shard** scale ngang thay cho consumer đơn luồng.

Số liệu bài nêu: median latency gửi message ~200ms → **~60ms**; throughput **400 → 5.000 message/giây**; consumer concurrency **20 → 250**.

**Vì sao đáng đọc:** Joy Loyalty chạy rất nhiều việc bất đồng bộ qua queue — webhook Shopify, tính điểm, gửi email. Bài này cho một checklist rất cụ thể khi queue bắt đầu nghẽn: (1) shard phần *storage* trước, (2) tách riêng scale của *consumer* khỏi scale của *producer*, (3) đặt shard gần người dùng thay vì gom một region. Điểm thứ ba đáng lưu ý với Cloud Tasks/Pub-Sub: chọn region theo merchant chứ đừng mặc định us-central1 cho mọi shop, vì merchant EU/APAC trả giá bằng latency.

## [How Stripe's document databases supported 99.999% uptime with zero-downtime data migrations](https://stripe.dev/blog/how-stripes-document-databases-supported-99.999-uptime-with-zero-downtime-data-migrations) — (Stripe Engineering, 06/06/2024)

**Đây là gì:** Stripe mô tả **Data Movement Platform** — hạ tầng cho phép đổi schema và tổ chức lại dữ liệu trên fleet document database (MongoDB) mà không dừng service, giữ uptime **99,999%** (tức ~5 phút downtime mỗi năm).

Ý cốt lõi: ở quy mô đó, migration không thể là "một script chạy tay lúc 2h sáng". Nó phải là một **platform** — có tooling, có kiểm chứng, có rollback — vì mâu thuẫn giữa "phải cực kỳ ổn định" và "vẫn phải liên tục tiến hoá schema" là mâu thuẫn thường trực, không phải sự cố nhất thời.

**Vì sao đáng đọc:** Firestore cũng là document database, và Joy Loyalty chắc chắn đã có lần phải backfill field mới cho hàng triệu customer document. Framing của Stripe rất đáng mượn: coi migration là **năng lực hạ tầng lặp đi lặp lại**, không phải sự kiện một lần. Cụ thể là dựng sẵn một backfill runner có checkpoint, resume được, throttle được và dry-run được — thay vì viết lại script mới mỗi lần đổi schema. Ghép với mẹo của Cloudflare ở item ⭐ (đổi vai trò dữ liệu thay vì copy nó), ta có hai hướng bổ trợ nhau cho cùng một bài toán.

---

**Tổng kết cho dev daily:** ba trong bốn bài hôm nay kể cùng một câu chuyện — hệ thống bắt đầu bằng một coordinator duy nhất vì nó *đơn giản và đúng*, rồi chết vì chính sự duy nhất đó. Cách thoát ra luôn giống nhau: shard theo subset, phát quyền bằng lease thay vì hỏi liên tục, và tách trục scale của storage khỏi consumer. Đáng soi lại: chỗ nào trong Joy Loyalty đang có "một document / một queue / một job cho mỗi shop"?
