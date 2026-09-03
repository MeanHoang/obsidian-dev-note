# 🏗️ System Design — 2026-09-03

> Chủ đề xuyên suốt hôm nay: **bỏ state ra khỏi đường xử lý** — Shopify để agent chạy pipeline có ledger + verification, MCP bỏ session để scale ngang, Canva bỏ DB lookup thay bằng index nhị phân in-memory, Cloudflare bỏ hạ tầng GCP thay bằng Workers/R2/Workflows.

## ⭐ [How River takes security work from a fix to merge](https://shopify.engineering/river-vulnerability-remediation) — (Shopify Engineering, 02/09/2026)
**Đây là gì:** River là AI agent chạy trong Slack của Shopify, tự động vá lỗ hổng bảo mật (vulnerability remediation) trên monorepo "World" — không dừng ở việc *phát hiện* bản vá mà đẩy fix đi tới tận lúc PR được merge. Bài viết bởi Erin Son và Kaiyi Li.

**Chi tiết:**
- River dùng **chính bộ reproducible dev environment, "written-down skills" và engineering conventions** mà dev người dùng — tức là context đặc thù Shopify được đưa vào agent mà không cần retrain model.
- Pipeline là một state machine 4 giai đoạn: **Validation** (đối chiếu ledger nội bộ với trạng thái thật của repo/PR/issue tracker) → **Repair** (rebase code, regenerate lockfile, xử lý lỗi cơ học) → **Handoff** (escalate cho người khi cần phán đoán rủi ro, kèm full context) → **Verification** (xác nhận đã đóng ở repo head và trên mọi hệ thống liên quan).
- Số liệu: **giảm 70% backlog trong 11 ngày đầu** của dependency workflow; tỉ lệ security merge qua freshness-gated queue tăng từ ~10% lên **80%**; hai phần ba issue được giải quyết là merge trực tiếp, phần còn lại xác nhận là đã lỗi thời/đã fix sẵn.
- Trade-off được tuyên bố rõ: **tách automation (vá routine) khỏi judgment (quyết định rủi ro)**. Khi hành vi code thay đổi hoặc bằng chứng mâu thuẫn với khuyến nghị, River *dừng lại* chứ không tự quyết. Human approval vẫn bắt buộc — agent không được tự merge.

**Vì sao đáng đọc:** Đây là blueprint sát nhất cho việc tự động hoá dependency-bump/security-patch trên codebase Joy Loyalty — đặc biệt pattern "ledger + reconcile với trạng thái thật + verification ở head" là thứ chống được lỗi kinh điển của bot vá deps: báo xong nhưng thực tế chưa merge.

## [MCP went stateless: Is your AWS MCP server deployment well-architected?](https://aws.amazon.com/blogs/architecture/mcp-went-stateless-is-your-aws-mcp-server-deployment-well-architected/) — (AWS Architecture Blog, 01/09/2026)
**Đây là gì:** Bản revision MCP ngày 28/07/2026 bỏ mô hình session-based, biến protocol thành **stateless ở lõi** — server không còn giữ per-client session trong memory hay external store. Bài phân tích lại kiến trúc deploy MCP server theo 6 pillar của AWS Well-Architected.

**Chi tiết:**
- **Trước:** phải sticky routing trên ALB để ghim client vào 1 instance, phải lưu session state ở DynamoDB/ElastiCache, phải có handshake init mỗi session. **Sau:** round-robin sang bất kỳ instance nào, bỏ hẳn hạ tầng session; version + client context nhúng vào từng request.
- Thay session bằng **server-minted identifier truyền như tool argument**, và pattern **MRTR (Multi Round-Trip Requests)** cho các bước cần user input; continuation token (`requestState`) để resume các luồng nhiều bước.
- Routing chuyển từ parse body sang **HTTP header** (`Mcp-Method`, `Mcp-Name`); protocol tự khai báo cache qua field `ttlMs` và `cacheScope`.
- Câu chốt của bài: *"the old design fought horizontal scaling"* — thiết kế cũ buộc phải chọn giữa sticky routing (giảm hiệu quả fleet) hoặc externalize state (tăng độ phức tạp vận hành). Stateless đánh đổi "server giữ continuity" lấy identifier tường minh, và nhờ đó hợp tự nhiên với serverless (Lambda) — bài dẫn ví dụ tiết kiệm ~$23/tháng cho mỗi ElastiCache micro instance bị loại bỏ.

**Vì sao đáng đọc:** Nếu Joy Loyalty định expose MCP server cho merchant/AI agent, chọn stateless từ đầu nghĩa là deploy thẳng lên Cloud Run/Cloud Functions không cần sticky session hay Redis — đúng bài toán scale-to-zero của stack Firebase/GCP.

## [Session revocations at scale](https://www.canva.dev/blog/engineering/session-revocations-at-scale/) — (Canva Engineering, 22/07/2026)
**Đây là gì:** Canva thiết kế lại hệ thống thu hồi session (revocation — huỷ hiệu lực token khi user logout/đổi mật khẩu) cho hàng trăm triệu session active, bỏ DB lookup và thay bằng index nhị phân nạp sẵn trong memory của gateway.

**Chi tiết:**
- Bài toán: gateway phải verify user "hàng trăm nghìn lần mỗi giây"; mỗi lần deploy, hàng trăm gateway pod cùng lúc kéo hơn 1 triệu record từ MySQL → nghẽn.
- Giải pháp: chia dữ liệu revocation thành **chunk 30 phút lưu trên S3**; pod khi khởi động chỉ tải **12 giờ gần nhất**, sau đó poll S3 bằng **conditional GET**. Chọn S3 thay Redis để khỏi phải vận hành thêm một datastore.
- Mỗi revocation được pack **đúng 16 byte** (principal + login timestamp, bit manipulation) thành mảng phẳng đã sort → binary search. Format nhị phân này **giảm 87.5% memory** của cache so với cách cũ dùng Java object.
- Trade-off: ghi revocation mới là O(N²) vì phải re-upload cả chunk, nhưng batch hàng trăm revocation cho ra **>2.000 writes/giây** — thừa so với nhu cầu thực tế. Dùng **optimistic concurrency control qua S3 conditional PUT** để nhiều worker không ghi đè nhau.

**Vì sao đáng đọc:** Pattern "object storage + snapshot nhị phân + poll bằng conditional GET" thay cho Redis là cách rẻ và ít vận hành để phát tán config/blocklist/feature-flag tới nhiều instance — dùng được nguyên xi với Cloud Storage trước các service Cloud Run của Joy Loyalty.

## [Dogfooding at scale: migrating cdnjs to Cloudflare's Developer Platform](https://blog.cloudflare.com/cdnjs-dev-platform-migration/) — (Cloudflare Blog, 30/07/2026)
**Đây là gì:** Cloudflare chuyển toàn bộ cdnjs (CDN mã nguồn mở cho thư viện JS/CSS) từ GCP sang chính nền tảng dev của mình, làm case study "ăn thức ăn chó nhà nấu" của một serverless pipeline hoàn chỉnh.

**Chi tiết:**
- Quy mô: **9 tỉ request/ngày**, trung bình **108.000 req/s** qua hơn **330 data center**, cache hit rate **98,6%**; xuất hiện trên ~**12% tổng số website**, chiếm **48,3%** thị phần JavaScript CDN.
- Hệ cũ: 26 Google Cloud Function shard theo chữ cái đầu + GCS object events + Pub/Sub + VM git-sync mirror lên GitHub (repo phình tới **1.1TB** packed).
- Hệ mới ghép từ: **R2** (single source of truth cho file), **KV** (metadata: version, hash), **Workers Cache** (tiered cache), **Workflows** (orchestrate ingest), **Queues** (phân phối việc async), **Containers** (service nén tách riêng), **Durable Objects** (counter đồng bộ workflow), và DigitalOcean Spaces làm fallback DR.
- Pipeline ingest: cron 10 phút kích `PackageUpdatesWorkflow` dò npm/GitHub → `DownloadPackageWorkflow` kéo tarball vào R2 → `ProcessingWorkflow` mỗi file (extract, minify, compress) → `PublishingWorkflow` ghi R2 + KV và cập nhật index Algolia.

**Vì sao đáng đọc:** Đây là bản đồ rõ ràng "workflow orchestration + object storage + queue + durable counter" cho một pipeline xử lý hàng loạt — chính hình dạng của các job import/sync đơn hàng & tính điểm loyalty, và cho thấy khi nào nên tách bước nặng (nén/xử lý file) ra container riêng thay vì nhồi vào function.
