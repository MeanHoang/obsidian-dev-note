# 🏗️ System Design — 2026-08-25

> Hôm nay đọc được 1 case study migration cực sát với dev app web (Cloudflare tự dogfood CMS mới cho blog của họ), 1 bài về giới hạn vật lý của JVM khi đếm distinct ở scale tỷ bản ghi, và 2 bài Shopify về kiến trúc hệ agentic — trong đó có 1 bài dạy pattern "hạ tầng bền hơn model".

## ⭐ [The Cloudflare Blog – Brought to you by EmDash](https://blog.cloudflare.com/cloudflare-blog-uses-emdash/) — (Cloudflare Blog, 24/08/2026)
**Đây là gì:** Case study migration. **EmDash** là một CMS (content management system) mới của Cloudflare, build riêng để chạy trên **Astro** (static-site framework) + hạ tầng Cloudflare. Cloudflare tự làm "Customer Zero" — đem chính blog của mình (traffic thật, spike thật) lên EmDash trước khi bán cho enterprise.

**Chi tiết:**
- **Kiến trúc nhiều tầng cache**, xếp theo độ gần user: (1) Workers Cache ở edge → (2) EmDash object cache dựng trên **Workers KV** → (3) database là **PlanetScale** truy cập qua **Hyperdrive** (lớp connection pooling/caching của Cloudflare cho DB ngoài). Kết quả: phục vụ 99.5% static file từ cache và 70% tổng request từ cache.
- **Con số tải thật:** traffic bình thường ~75 RPS, spike đỉnh vượt 5.000 RPS, test burst chịu được 7.000 RPS sustained; trong production đã phục vụ tới 850 RPS với lỗi tối thiểu. SLO đặt ra: P95 < 500ms, P99 < 1.000ms. Trong Agents Week, frontend đạt đỉnh 450 RPS.
- **Chiến lược rollout:** bắt đầu ở 1% traffic rồi tăng dần lên 100%, kèm một **Proxy Worker** làm fallback — lỗi thì tự động rơi về blog cũ. Đây là cách deploy zero-downtime cho migration hạ tầng, không phải feature flag thường.
- **Trade-off thật thà:** EmDash lúc đó còn pre-1.0, thiếu/lỗi ở scheduled post, xử lý media và localization — phải vá trước khi lên production. Bù lại, đường latency mới "phẳng" đều, còn platform cũ có spike latency định kỳ dưới tải.

**Vì sao đáng đọc:** Đây gần như là bản đồ trực tiếp cho kiến trúc Joy Loyalty — tier cache (edge → KV/Firestore cache → DB) là đúng bài toán mình đang giải, còn pattern proxy-fallback + rollout 1%→100% là cách an toàn nhất để migrate một service đang chạy production mà không dám tắt cái cũ.

## [Scaling Exact COUNT(DISTINCT) for High-Cardinality Non-Rollup Metrics in Distributed Data Pipelines](https://www.uber.com/us/en/blog/scaling-exact-count/) — (Uber Engineering, 30/07/2026)
**Đây là gì:** Bài về **non-rollup metric** — loại metric không thể cộng dồn từ số liệu thô hơn. Ví dụ: MAU quý không bằng tổng MAU từng tháng, vì cùng một user đếm nhiều lần. Muốn chính xác thì phải giữ toàn bộ ID unique trong bộ nhớ cùng lúc — với Uber là hơn 3,6 tỷ UUID. Công cụ chuẩn ngành là **RoaringBitmap** (cấu trúc bitmap nén, đếm distinct chính xác), nhưng nó đụng trần cứng của JVM: mảng bị giới hạn `Integer.MAX_VALUE` (~2GB), vượt là `OutOfMemoryError` deterministic, không có config nào cứu.

**Chi tiết:** Giải pháp là **chunk hóa aggregation buffer** — lấy 16 bit cao của hash ID làm key chia bitmap thành nhiều chunk, mỗi chunk serialize độc lập nên peak memory chỉ bằng chunk lớn nhất. Ngưỡng cardinality an toàn nhảy từ ~179 triệu lên ~11,7 nghìn tỷ (cải thiện 65.000 lần). Triển khai trên 75 metric family: zero OOM, thời gian backfill 2 năm giảm trung bình từ 8,58 ngày còn 2,96 ngày (-65%), pipeline cardinality cao nhất cải thiện tới 94%.

**Vì sao đáng đọc:** Bài học chuyển thẳng sang analytics của loyalty app: các chỉ số kiểu "unique member tham gia chương trình trong quý" cũng là non-rollup, không được phép cộng dồn theo ngày. Ngoài ra đây là ví dụ đẹp về việc bottleneck không nằm ở thuật toán mà ở giới hạn runtime — partition là cách thoát ra.

## [Gisting: Compressing LLM Agent context to ↑ throughput and ↓ cost](https://shopify.engineering/gisting) — (Shopify Engineering, 19/08/2026)
**Đây là gì:** **Gisting** là kỹ thuật nén system prompt dài thành một nhúm token đặc biệt gọi là **gist token** — token mới thêm vào vocabulary của model, được train bằng **knowledge distillation** (teacher đọc prompt đầy đủ, student chỉ đọc gist token, tối thiểu hóa KL divergence giữa hai logit) để model hành xử như thể đã đọc trọn prompt. Shopify áp dụng cho agent GraphQL của họ.

**Chi tiết:** Tỷ lệ nén 4:1 (6.000 token → 1.500 gist token). TTFT giảm 19% (438ms → 354ms), latency end-to-end giảm 38% (6,8s → 4,2s), throughput tăng 16% (20,2 → 23,4 query/s), tiết kiệm 14% GPU. Deploy không cần hạ tầng serving riêng — gist embedding nhét thẳng vào embedding matrix lúc inference. Đánh đổi: tốn một lần train, và tỷ lệ nén tối ưu phụ thuộc độ phức tạp domain (4:1 hợp với agent GraphQL, chưa chắc hợp chỗ khác).

**Vì sao đáng đọc:** Nếu Joy Loyalty có tính năng AI đọc/ghi qua Shopify Admin GraphQL, phần system prompt mô tả schema chính là thứ đắt nhất và lặp lại mọi request — bài này chỉ ra chi phí context là một bài toán kiến trúc chứ không phải chuyện prompt engineering.

## [Building an agentic harness that outlasts the model](https://shopify.engineering/building-an-agentic-harness-that-outlasts-the-model) — (Shopify Engineering, 29/07/2026)
**Đây là gì:** **Harness** ở đây nghĩa là toàn bộ lớp hạ tầng bao quanh LLM (orchestration, tool, kiểm chứng) — không phải bản thân model. Shopify mô tả **Dispatch**, hệ điều phối nhiều agent để tìm lỗ hổng bảo mật, tự viết test chứng minh khai thác được, rồi đề xuất fix.

**Chi tiết:** Pipeline nhiều stage tuần tự (bootstrap test → document → partition → hunt → verify → remediate), mỗi stage là một checkpoint lọc false positive. "Hunter" quét song song nhiều partition cho nhanh, còn agent verify chạy tuần tự và dùng **model khác** để soi lại — adversarial review giảm nhiễu và tránh điểm mù chung. Code được partition thành chunk cỡ 20-30% context window để cân bằng chi phí với recall. Thao tác nguy hiểm (credential, git, storage) giao cho script deterministic, không để agent tự quyết. Kết luận: lợi thế bền vững đến từ việc tune harness theo hệ sinh thái của mình, không phải chạy theo model mới.

**Vì sao đáng đọc:** Đây là pattern thiết kế hệ AI nghiêm túc và áp thẳng được vào dev workflow — tách rõ phần deterministic (JS thuần, script, tool có contract) khỏi phần xác suất (LLM), rồi kiểm chứng đầu ra bằng thứ chạy được chứ không tin lời model.
