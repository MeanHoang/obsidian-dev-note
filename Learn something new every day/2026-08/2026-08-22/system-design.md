# 🏗️ System Design — 2026-08-22

> Chủ đề nổi nhất hôm nay: "bỏ hệ thống chuyên dụng, quay về database cũ" — Shopify thay Redis bằng MySQL cho inventory reservations để lấy lại tính atomic; cộng thêm 2 case study về pooling/pre-warming (Uber GitFarm, Cloudflare computer) và 2 bài kiến trúc nền tảng của Shopify.

## ⭐ [We replaced Redis with MySQL for inventory reservations—and it scaled](https://shopify.engineering/scaling-inventory-reservations) — (Shopify Engineering)
**Đây là gì:** Case study migration. "Inventory reservation" = khi khách vào checkout, hệ thống phải giữ tạm số lượng hàng để không bán trùng (oversell). Shopify từng làm bằng Redis (`DECR` khi giữ, `INCR` khi nhả), giờ chuyển hẳn về MySQL.
**Chi tiết:**
- **Vấn đề gốc không phải performance mà là atomicity:** reservation nằm ở Redis, inventory ledger (sổ cái tồn kho) nằm ở MySQL. Bước "claim" phải update MySQL rồi dọn Redis ở hai thao tác riêng, không gói được vào một transaction → hoặc oversell (thanh toán xong nhưng chưa trừ kho), hoặc undersell (đã trừ kho nhưng vẫn còn bị đánh dấu reserved).
- **Thiết kế mới dùng `SKIP LOCKED` của MySQL 8:** thay vì 1 row/item có cột quantity, họ dùng **1 row cho mỗi sellable unit**. Giữ 3 món = select và move 3 rows trong 1 transaction. `SKIP LOCKED` cho phép MySQL bỏ qua row đang bị lock thay vì chờ → giảm contention mạnh.
- **Bounded pool 1.000 row/cặp (item, location)** thay vì tạo hàng triệu row cho item tồn kho lớn. Đủ lớn để hấp thụ burst flash sale, đủ nhỏ để bảng và scan còn nhanh. Hết pool thì có inline replenishment nạp lại từ ledger, có lock chống thundering herd.
- **Ba tinh chỉnh lock đáng chép lại:** đổi từ auto-increment ID sang composite primary key (`shop_id, inventory_item_id, inventory_group_id, id`) → giảm từ 2 row lock xuống 1 mỗi reservation; đổi isolation từ `REPEATABLE READ` mặc định sang `READ COMMITTED` vì gap lock trên bảng rỗng chặn insert replenishment; chuẩn hoá thứ tự lock trong transaction (reserve: delete rồi insert; claim: chỉ delete) để triệt deadlock do circular wait.
- **Bottleneck thật lại nằm ở connection pool, không phải query:** throughput chững dù latency chấp nhận được và CPU thấp — dấu hiệu kinh điển của connection pool exhaustion. Họ gắn SQL comment tag (`/* conn_tag:checkout_completion */`) ở tầng application + track ở proxy để quy trách nhiệm thời gian giữ connection theo từng business process. Tối ưu phần checkout *không phải* reservation cho ra **giảm 50% reads và 33% transactions trên primary**.
- **Kết quả & rollout:** Black Friday 2025 Shopify đạt đỉnh **5,1 triệu USD doanh số/phút (+11% YoY)**, writer CPU giữ dưới 50%, reader CPU dưới 16%. Rollout bằng dual-write shadow mode (cả hai hệ chạy song song, Redis vẫn là source of truth) rồi mở dần theo pod, có kill-switch.
**Vì sao đáng đọc:** Hai bài học họ tự rút ra đúng với daily code của mình — "constraint cũ có thể đã hết hạn" (feature mới của DB làm thứ từng cần hạ tầng riêng nay không cần nữa) và "đo trước khi tối ưu, low CPU + high queuing thì lỗi nằm ở đường ống chứ không ở động cơ". Với Joy Loyalty: mọi chỗ mình để state ở Redis/memory cache còn source of truth ở Firestore đều mang đúng rủi ro non-atomic này — đáng review lại luồng redeem điểm.

## ⭐ [GitFarm: Git as a Service for Large-Scale Monorepos](https://www.uber.com/us/en/blog/gitfarm-as-a-service/) — (Uber Engineering)
**Đây là gì:** Uber biến Git thành một service tập trung có gRPC API, thay vì mỗi automation service tự clone và giữ một bản checkout local của monorepo nhiều GB. Lưu ý GitFarm **không phải** một Git SCM — nó không lưu trữ, replicate hay serve repository, chỉ chạy lệnh Git hộ client.
**Chi tiết:**
- **Ba thành phần:** Gateway (auth + load balancing, track sandbox khả dụng qua Redis, chọn backend có nhiều checkout rảnh nhất cho repo được yêu cầu); Backend (giữ bare clone, đồng bộ push-based + fetch định kỳ 5 phút, quản lý pool sandbox và checkout dựng sẵn); và clustering theo workload để tránh noisy neighbor.
- **Cốt lõi là pooling + pre-warming:** cấp container và checkout theo từng request mất hơn 3 phút; giữ pool cố định đã dựng sẵn kéo overhead khởi tạo xuống dưới 1 giây, mount checkout vào sandbox và chạy trong **dưới 500ms**.
- **gRPC bidirectional streaming** cho phép nối chuỗi nhiều lệnh Git trong một session bền, giữ nhất quán repo giữa các lệnh mà không phải reconnect.
- **Số liệu production:** service scan code ownership giảm từ 70+ core xuống 16 core (−77%), RAM 400–600GB xuống 32GB (−90%), startup 15–20 phút xuống dưới 1 phút. Compliance auditing (10–20K event/giờ) P50 từ 110–160s xuống 20–30s. Tổng thể giảm hơn **80% tài nguyên phía client**.
- **Trade-off nêu rõ:** mặc định repository state là eventually consistent (client muốn dữ liệu mới phải fetch tường minh), session timeout 30 phút, chỉ hỗ trợ full checkout (sparse checkout còn trong kế hoạch), và khả năng scale bị chặn bởi kích thước pool.
**Vì sao đáng đọc:** Đây là pattern "warm pool" tổng quát, không riêng Git — chính là cách trị cold start. Với Joy Loyalty chạy Cloud Run/Cloud Functions, tư duy này map thẳng sang min-instances và pre-warm connection pool tới Firestore/MySQL, đổi một chút stale để lấy latency ổn định.

## [Under the River — Aquifer, nền tảng chạy AI agent của Shopify](https://shopify.engineering/under-the-river) — (Shopify Engineering)
**Đây là gì:** Bài mô tả kiến trúc Aquifer, platform nội bộ của Shopify để vận hành AI agent trên monorepo. Điểm đáng học không phải phần AI mà là cách họ tách state khỏi compute.
**Chi tiết:**
- **Session** là identity bền, lưu trên Postgres dưới dạng append-only event log — lịch sử hội thoại sống sót qua restart process (đúng tinh thần event sourcing).
- **Harness** là vòng lặp agent dùng-một-lần: đọc history, gọi model, phát tool intent. Vì stateless nên thay được mà không đụng tới hội thoại đã lưu.
- **Sandbox** là môi trường ephemeral (filesystem, shell, repo) nơi code thật sự chạy, cố tình tách khỏi harness để an toàn và quan sát được. Câu chốt của bài: *"The harness lives outside the sandbox. The agent doesn't live where the code lives."*
- Session cell là process ephemeral, idle thì tự thoát; lượt tương tác sau resume từ event log chứ không dựa vào memory còn giữ.
**Vì sao đáng đọc:** Mô hình "state bền trong event log + compute vứt đi được" là cách viết background job đúng trên serverless — instance chết lúc nào cũng được, replay lại từ log. Với Joy Loyalty, mọi job tính điểm/đồng bộ order nên thiết kế theo hướng này thay vì giữ state trong biến của instance.

## [Your agent needs a computer, not a container — introducing @cloudflare/computer](https://blog.cloudflare.com/cloudflare-computer/) — (Cloudflare Blog, 03/08/2026)
**Đây là gì:** Thư viện runtime open-source của Cloudflare, tự động định tuyến workload giữa hai loại compute: **isolate** (chạy trong Durable Object — sandbox JS siêu nhẹ, khởi động tức thì) và **container** (môi trường Linux đầy đủ cho npm, native binary, dependency nặng).
**Chi tiết:**
- Cả hai môi trường dùng chung một virtual filesystem backed bởi SQLite nên dữ liệu đồng bộ giữa hai runtime.
- Lý do thiết kế là bài toán scale thuần tuý, họ nói thẳng: "there's nowhere near enough compute in the world for every company to give each of their users' agents their own containerized compute environment". Mục tiêu là container chỉ gánh **dưới 10%** workload, phần còn lại chạy trên isolate.
- Việc chọn runtime để cho model tự quyết, và theo bài thì các model frontier "very good at making the correct decision" mà không cần lập trình viên chỉ định.
**Vì sao đáng đọc:** Đây là tiered compute — dùng primitive rẻ cho phần lớn request, chỉ escalate lên primitive đắt khi thật sự cần. Áp cho Joy Loyalty: đa số webhook Shopify chỉ cần một function nhỏ, đừng để mọi thứ đi chung một service size lớn; tách hot path nhẹ khỏi vài job nặng thật sự.

## [Building the Universal Commerce Protocol](https://shopify.engineering/UCP) — (Shopify Engineering, 11/01/2026)
**Đây là gì:** UCP là open standard Shopify đồng phát triển với Google, cho AI agent khám phá capability, thương lượng điều khoản và hoàn tất giao dịch với bất kỳ merchant nào. Tác giả là Ilya Grigorik.
**Chi tiết:**
- **Ba tầng:** shopping service (primitive giao dịch lõi) → capabilities (Checkout, Orders, Catalog) → extensions (schema theo domain, ghép bằng composition). Luận điểm của bài: "Monolithic protocols eventually collapse under complexity" còn protocol phân tầng thì sống được nhờ tách trách nhiệm.
- **Discovery:** merchant và agent publish profile tại `/.well-known/ucp`, protocol tính giao (intersection) capability động theo từng giao dịch.
- **Extension đặt tên reverse-domain**, ví dụ bài đưa ra chính là `com.loyaltyprovider.points` — merchant tự định nghĩa chức năng riêng không cần duyệt tập trung.
- Checkout là state machine có các trạng thái `incomplete`, `requires_escalation`, `ready_for_complete` để bàn giao mượt giữa agent và người thật qua embedded checkout.
**Vì sao đáng đọc:** Ví dụ namespace trong chính spec là loyalty points — nếu agentic commerce đi theo hướng này thì Joy Loyalty sẽ cần expose điểm/reward dưới dạng một UCP extension, không chỉ là UI trong storefront. Đáng đọc sớm để hình dung API surface tương lai.
