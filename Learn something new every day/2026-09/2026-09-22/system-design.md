# 🏗️ System Design — 2026-09-22

> Chủ đề nổi bật hôm nay: tối ưu **execution engine** thay vì scale máy — Shopify viết lại GraphQL theo hướng breadth-first (15x nhanh hơn), Stripe tự viết proxy thay Envoy (giảm 50% CPU), Cloudflare tháo bottleneck single-coordinator trong control plane.

## ⭐ [Shopify's journey to faster breadth-first GraphQL execution](https://shopify.engineering/faster-breadth-first-graphql-execution) — (shopify.engineering, 12/03/2026, Greg MacWilliam)

**Đây là gì:** Case study Shopify xây **GraphQL Cardinal** — một execution engine GraphQL chạy theo kiểu *breadth-first* (duyệt theo tầng) thay cho *depth-first* (duyệt sâu từng object) mặc định của GraphQL spec. "Execution engine" = phần runtime quyết định gọi resolver nào theo thứ tự nào để dựng response.

**Chi tiết:**
- Vấn đề với depth-first: engine đệ quy hết subtree của 1 object rồi mới sang object tiếp theo. Bài nêu 3 chi phí ẩn: (1) thời gian xử lý scale tuyến tính theo kích thước response, (2) **field overhead** — mỗi field phải trả phí platform (tracing, authorization, instrumentation) và phí này lặp lại cho *từng object*, (3) **promise bloat** — dataloader tạo hàng loạt promise gây memory pressure và backpressure cho GC.
- Giải pháp Cardinal: "resolves each field once across all objects instead of once per object" — resolve 1 field **một lần trên toàn bộ tập object**. Thay vì xử lý xong subtree của product #1 rồi sang #2, Cardinal xử lý cùng 1 field trên tất cả products đồng thời.
- Mô hình thực thi 3 pha: build tree → planning bottom-up → execution top-down; resolver nhận vào cả bộ object và trả về kết quả đã map sẵn.
- Số liệu: **15x nhanh hơn** với query list lớn, **giảm 90% memory**, **tiết kiệm 4+ giây ở P50** cho query lớn nhất trong bộ test. Scaling tuyến tính bị triệt tiêu — lợi ích càng lớn khi list càng lặp nhiều.
- Trade-off thật: error handling kém "phẫu thuật" hơn — breadth execution chạy xong gần hết operation dù có lỗi, rồi mới dùng depth traversal để định vị lỗi sau. Cardinal vẫn tuân thủ GraphQL spec.

**Vì sao đáng đọc:** Joy Loyalty gọi Shopify Admin API GraphQL hàng ngày — hiểu vì sao query list lớn (ví dụ `customers(first: 250) { orders { ... } }`) đắt đến vậy giúp bạn viết query gọn hơn và đoán đúng cost. Mindset lớn hơn: khi hot path chậm, nhìn vào **mô hình thực thi** (bao nhiêu lần gọi cùng một logic) trước khi nghĩ đến thêm cache hay thêm instance — đúng logic cho mọi vòng lặp `for (const c of customers) await getX(c)` trong code Cloud Functions của bạn.

## [Building a data plane from scratch: Stripe's own high-performance distributed proxy](https://stripe.dev/blog/building-a-data-plane-from-scratch-stripes-own-high-performance-distributed-proxy) — (stripe.dev/blog, 26/08/2026)

**Đây là gì:** Stripe bỏ **Envoy** (proxy open-source phổ biến nhất cho service mesh) và tự viết **mesh-proxy** bằng Go. *Service mesh* = lớp hạ tầng đứng giữa mọi service nội bộ, lo routing/retry/TLS; *data plane* = phần thực sự đẩy traffic (khác *control plane* là phần ra lệnh).

**Chi tiết đáng lưu:** mục tiêu reliability 99.9995%; giảm ~50% CPU và ~50% latency so với Envoy dưới tải cao; chuyển từ 1 connection/worker-core sang **1 connection/host** (goroutine-based concurrency thay worker model) nên connection cardinality giảm mạnh; tích hợp trực tiếp service registry hiệu quả hơn giao thức xDS; tổng cộng tiết kiệm "khoảng 3.000 ngày latency inter-service cộng dồn mỗi ngày", riêng hạ tầng Ruby có thêm 15–20% headroom. Trade-off nhận: phối hợp goroutine phức tạp hơn worker model của Envoy.

**Vì sao đáng đọc:** Bài học "build vs buy" ở đúng thời điểm — họ chỉ tự viết khi scale và traffic pattern đã đặc thù đến mức giải pháp tổng quát thành thuế. Với Joy thì ngược chiều: bạn nên tiếp tục dùng đồ có sẵn của GCP, nhưng nhớ con số **connection cardinality** — mỗi Cloud Run instance mở connection riêng ra Firestore/API bên ngoài, và đó là nguồn cạn quota quen thuộc.

## [Rearchitecting the Workflows control plane for the agentic era](https://blog.cloudflare.com/workflows-v2/) — (blog.cloudflare.com, 15/04/2026)

**Đây là gì:** Cloudflare Workflows là **durable execution engine** (engine chạy workflow nhiều bước, tự resume sau crash — cùng họ với Temporal, Vercel Workflow). Bài kể lại việc mổ lại control plane của nó.

**Chi tiết đáng lưu:** V1 dồn mọi thứ vào **một Durable Object cấp account** → đúng anti-pattern single coordinator, bị trần cứng 4.500 instance đồng thời và 100 lần tạo / 10 giây. V2 tách thành 2 thành phần: **SousChef** (quản metadata + lifecycle cho từng tập con workflow, chia tải khỏi Account) và **Gatekeeper** (cơ chế *leasing* cấp slot concurrency, gom batch nói chuyện với SousChef 1 lần/giây để không dội tải). Nguyên tắc thiết kế cốt lõi: "source of truth cho sự tồn tại của một instance phải là Engine của chính nó, không gì khác". Kết quả: 50.000 instance đồng thời, 300 instance/giây, 2 triệu instance queued mỗi workflow; migrate hàng triệu instance cũ zero-downtime nhờ background task + Durable Object alarms.

**Vì sao đáng đọc:** Pattern **leasing + batched coordination** áp trực tiếp được khi Joy phải rate-limit lời gọi Shopify Admin API từ nhiều Cloud Function song song — thay vì mỗi worker đọc/ghi 1 document Firestore chung (đúng bottleneck của V1), cấp lease theo batch. Và câu "source of truth là chính engine đó" là liều thuốc cho mọi bug lệch state giữa bảng tổng và bản ghi thật.

## [Building the Universal Commerce Protocol](https://shopify.engineering/ucp) — (shopify.engineering, 11/01/2026)

**Đây là gì:** UCP là open standard Shopify đồng phát triển với Google, cho AI agent **discover capability rồi giao dịch** với merchant. Kiến trúc phân lớp: shopping service (primitive checkout/line item/total) → capabilities (Checkout, Orders) → extensions (schema theo domain).

**Chi tiết đáng lưu:** Discovery kiểu **negotiation hai chiều** — merchant và agent đều publish profile khai capability, merchant tính *giao* của hai bên rồi shape response động cho từng transaction. Extension dùng **reverse-domain naming**, và ví dụ bài đưa ra chính là `com.loyaltyprovider.points` — "own the domain, own the namespace", không cần hội đồng phê duyệt. Checkout là state machine `incomplete` → `requires_escalation` → `ready_for_complete` để hand off cho người thật qua Embedded Checkout Protocol khi agent hết khả năng.

**Vì sao đáng đọc:** Đây là bài gần nhất với miếng cơm của Joy Loyalty — Shopify đã lấy **loyalty points làm ví dụ mẫu cho extension**. Nếu agentic commerce đi đúng hướng này, câu hỏi sản phẩm sắp tới là: agent sẽ đọc số điểm và apply reward của Joy bằng đường nào, và Joy có nên khai một namespace UCP riêng.

## [Under the River](https://shopify.engineering/under-the-river) — (shopify.engineering, 28/05/2026)

**Đây là gì:** Mô tả **Aquifer** — platform nội bộ Shopify chạy AI agent, với River (agent Slack-native) chỉ là *một profile* đặt lên trên.

**Chi tiết đáng lưu:** Kiến trúc tách **"brain" (model + harness) khỏi "hands" (sandbox nơi code chạy)**. **Durable sessions** dựng trên **append-only event log trong Postgres** nên session sống sót qua crash process/máy — đây đúng là event sourcing kinh điển. **Session cell** là process Go ephemeral, restart được mà không mất context hội thoại. Ba mode: Interactive (River), Automation (PR review), Job (CI/batch). Nền móng đặt từ đầu 2024: gộp monorepo ("World") + chuẩn hóa Nix để môi trường reproducible. Insight họ nhấn: "agent-friendly ≈ human-friendly".

**Vì sao đáng đọc:** Cặp pattern "state ngoài, process ephemeral" là *đúng* mô hình bạn buộc phải theo trên Cloud Run — Aquifer là ví dụ hoàn chỉnh về event log làm source of truth. Và "agent-friendly ≈ human-friendly" là lý do thực dụng để đầu tư vào CLAUDE.md / docs / repo structure của Joy: nó trả lãi hai lần.
