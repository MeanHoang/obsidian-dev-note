# 🏗️ System Design — 2026-09-15

> Chủ đề xuyên suốt hôm nay: **thu hẹp blast radius và bỏ bớt lớp trung gian** — Uber chia lại shard placement của M3DB thành subcluster, Stripe vứt Envoy viết proxy Go riêng, Shopify bỏ React Native quay về native cho Shop app.

## ⭐ [From Chaos to Control: Addressing Shard Distribution Challenges in M3DB with Subclusters](https://www.uber.com/us/en/blog/from-chaos-to-control/) — (Uber Engineering, 01/09/2026)

**Đây là gì:** M3DB là time-series database phân tán do Uber tự viết (lưu metrics). Bài này nói về *shard placement* — thuật toán quyết định node nào giữ shard nào. Uber thay thuật toán "sharded" cũ bằng "subclustered placement".

**Chi tiết:**
- **Vấn đề cũ:** thuật toán sharded rải shard tự do khắp cluster, chỉ ràng buộc bởi isolation group (rack/AZ). Hệ quả: một node chết kéo theo recovery work lan tới `(n-1)/n` cluster — "extensive I/O, network strain, and operational noise across many nodes".
- **Con số blast radius:** với RF=3 + zone-based isolation, mỗi node chia sẻ dữ liệu với tới **66,67% cluster**. Không thể maintenance song song, buộc phải serialize từng node một.
- **Giải pháp subcluster:** chia node thành nhóm cố định, mỗi subcluster **sở hữu một lát shard space riêng, không chồng lấn**. Ví dụ cluster 12 node, RF=3, 6 node/subcluster → 2 subcluster, mỗi cái giữ đúng nửa số shard. Node chết → recovery chỉ chạy trong subcluster đó.
- **Thuật toán:** greedy minimize *skew* (độ lệch tải giữa các node trong subcluster). Khi scale-up, lấp đầy subcluster dở dang trước khi tạo cái mới; với mỗi shard cần donate thì simulate việc bỏ nó ra, xếp hạng theo skew tăng dần rồi donate từ lựa chọn skew thấp nhất. Độ phức tạp `O(S log S)` thời gian, `O(S × N)` công simulate. Nhờ vậy donor subcluster tự cân bằng, không cần pass rebalance thứ hai.
- **Trade-off phải trả:** yêu cầu hardware đồng nhất (instance weight bằng nhau), cluster chỉ scale theo bội số kích thước subcluster, **không hỗ trợ đổi replication factor**, và subcluster phải nhỏ so với tổng cluster. Interface vẫn giữ mức instance chứ không atomic theo subcluster, để tránh "bootstrapping storms" làm sập cluster.
- **Kết quả:** shard sharing giữa 2 node bất kỳ giảm từ `O(cluster)` xuống `O(subcluster)`, dependency graph "much sparser", maintenance chạy song song được. Kết luận của bài: subclustered hợp với cluster lớn và nhiều thao tác vận hành; cluster nhỏ thì sharded vẫn ổn.

**Vì sao đáng đọc:** đây là bài học kinh điển về *failure domain design* — thay vì tối ưu cân bằng tải toàn cục, cố tình hy sinh tính linh hoạt để nhốt lỗi vào một ô nhỏ. Với Joy, cùng tư duy này áp cho việc phân vùng dữ liệu theo shop: nếu job/collection Firestore của một merchant lớn có thể kéo chậm cả pipeline chung, thì partition theo nhóm shop (thay vì rải đều) giúp một shop "nổ" không lan sang shop khác.

## ⭐ [Building a data plane from scratch: Stripe's own high-performance distributed proxy](https://stripe.dev/blog/building-a-data-plane-from-scratch-stripes-own-high-performance-distributed-proxy) — (Stripe Engineering, 26/08/2026)

**Đây là gì:** *Data plane* là lớp proxy đứng giữa mọi service-to-service call trong service mesh. Stripe dùng **Envoy** (proxy mã nguồn mở của Lyft, chuẩn de-facto cho service mesh) gần 10 năm, giờ thay bằng `mesh-proxy` viết bằng Go.

**Chi tiết:**
- **Mục tiêu độ tin cậy:** Stripe nhắm **99,9995%** reliability, xử lý lưu lượng tương đương ~1,6% GDP toàn cầu, hàng triệu request/giây qua hàng nghìn service.
- **Lý do bỏ Envoy:** mô hình threading kiểu worker khiến *connection cardinality* bùng nổ — mỗi worker giữ connection riêng tới từng upstream endpoint, làm các infra service phải ôm "hundreds of thousands of connections". Thêm nữa, rủi ro upgrade: một thay đổi phòng thủ HTTP/2 DDoS năm 2024 đã từ chối cả traffic hợp lệ.
- **Kiến trúc mới:** đổi concurrency model sang **một goroutine đọc + một goroutine ghi cho mỗi connection**, thay vì worker-per-CPU-core. Nhờ multiplexing trên connection dùng chung, chỉ cần **1 connection/host** thay vì 1 connection/worker. Proxy nối thẳng vào service registry nội bộ thay vì đi qua xDS.
- **Trade-off:** phải xử lý việc chia sẻ state của request giữa các goroutine — phần khó nhất của thiết kế.
- **Kết quả:** giảm khoảng **50% CPU** và **50% latency** so với Envoy, tiết kiệm ~**3.000 ngày latency inter-service cộng dồn mỗi ngày**.

**Vì sao đáng đọc:** bài mẫu về "khi nào nên tự viết thay vì dùng tool chuẩn" — lý do không phải performance suông mà là *mô hình đồng thời sai với hình dạng workload*. Áp dụng cho Joy: khi thấy Cloud Run/Firebase Function tốn tài nguyên bất thường, hãy hỏi connection/instance đang nhân lên theo chiều nào trước khi nghĩ tới scale up.

## [Migrating Shop app from React Native to native](https://shopify.engineering/shop-app-migration) — (Shopify Engineering, 10/09/2026)

**Đây là gì:** case study migration: Shopify viết lại Shop app (app mua sắm cho buyer) từ **React Native** (framework dùng JS để build app iOS/Android chung một codebase) sang **Swift (iOS) + Kotlin (Android)** thuần.

**Chi tiết đáng chú ý:** POC 1 engineer × 1 tuần dùng coding agent port màn hình React Native sang SwiftUI; sau đó 6 engineer core xây nền native, tổng **12 tuần** từ POC tới lúc lên store. Kết quả: startup nhanh hơn **23% (iOS)** / **50% (Android)**, app size Android giảm **109 MB (−37%)**, build time Android giảm **75%**, stability đạt 99,95%+ (cải thiện ~10 lần). Họ tự build tool hỗ trợ: `Pi` (agent extension) và `Tardis` (debug so sánh state/log/event giữa 2 phiên bản).

**Vì sao đáng đọc:** lập luận cốt lõi là **coding agent đã làm thay đổi bài toán kinh tế của việc chia sẻ code** — lý do chính chọn cross-platform (tiết kiệm nhân lực) yếu đi khi agent viết được 2 codebase. Đây là góc nhìn nên cân nhắc mỗi khi Joy định thêm một lớp abstraction "để đỡ viết 2 lần".

## [Under the River](https://shopify.engineering/under-the-river) — (Shopify Engineering, 28/05/2026)

**Đây là gì:** mô tả **Aquifer** — platform substrate Shopify dùng để chạy AI agent nội bộ (session, sandbox, gateway, durable event log, credentials proxy, observability pipeline). River là agent chạy trong Slack.

**Chi tiết đáng chú ý:** nguyên tắc thiết kế trung tâm là **"decouple the brain from the hands"** — vòng lặp agent chạy tách khỏi sandbox nơi code thực thi, để có 3 thứ: safety (cô lập lệnh phá hoại), replaceability (đổi model mà không đụng execution), observability (log quyết định tập trung). Số liệu 30 ngày: 59.918 session trên 5.170 kênh Slack, 7.000+ nhân viên dùng, 3.536 PR đã merge có River đồng tác giả; session tương tác trung vị 19 phút, ~50 tool call. Trade-off họ chọn: mọi hội thoại agent đều public (không DM) — hy sinh riêng tư để kiến thức tổ chức tích lũy.

**Vì sao đáng đọc:** "tách brain khỏi hands" là một pattern hạ tầng chứ không phải mẹo prompt — nếu Joy làm feature AI (gợi ý loyalty program, agent hỗ trợ merchant), tách lớp quyết định khỏi lớp thực thi giúp đổi model mà không phải viết lại toàn bộ.

## [1.1.1.1 now supports post-quantum DNSSEC, all 2,420 bytes of it](https://blog.cloudflare.com/post-quantum-dnssec-1111/) — (Cloudflare Blog)

**Đây là gì:** DNSSEC là cơ chế ký số cho bản ghi DNS để chống giả mạo. Cloudflare bật validate chữ ký bằng **ML-DSA-44** — thuật toán hậu lượng tử NIST chuẩn hóa — trên resolver 1.1.1.1.

**Chi tiết đáng chú ý:** mỗi chữ ký ML-DSA-44 nặng **2.420 byte**, vượt giới hạn DNS-over-UDP thông thường (~1.232–1.400 byte), buộc phải rơi xuống TCP; bài nhấn mạnh "fragmented UDP is unreliable and should be avoided". Vấn đề thứ hai là **downgrade attack**: giai đoạn chuyển tiếp zone phải publish cả chữ ký cũ lẫn mới, mà spec cho phép validator chấp nhận "any single valid path" → kẻ tấn công có thể giả chữ ký thuật toán cũ, nên validator bắt buộc phải ưu tiên xác minh bản hậu lượng tử khi có sẵn.

**Vì sao đáng đọc:** ví dụ rất rõ về việc **đổi crypto không chỉ là đổi thư viện mà là đổi ràng buộc kích thước gói tin của cả protocol** — và về bẫy kinh điển "hỗ trợ song song cả cũ lẫn mới" tạo ra lỗ hổng downgrade. Tư duy này áp thẳng vào mọi lần Joy làm migration có giai đoạn dual-support (v1/v2 API, hai kiểu token).
