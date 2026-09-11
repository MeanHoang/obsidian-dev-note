# 🏗️ System Design — 2026-09-11

> Ngày của **latency engineering**: Uber Eats cắt đôi latency search bằng cách "làm ít việc hơn, làm sớm hơn, đo liên tục"; Uber tách scaling intent khỏi execution bằng CRD mới; Shopify tuyên bố quay lại native mobile vì coding agents đã đổi bài toán kinh tế của cross-platform.

## ⭐ [Halving the Time: How Uber Eats Rebuilt Its Search Pipeline](https://www.uber.com/us/en/blog/uber-eats-search-pipeline/) — (Uber Engineering, 10/09/2026)

**Đây là gì:** Case study tối ưu latency của một **multi-stage retrieval & ranking pipeline** — kiến trúc search phổ biến: tầng retrieval lấy ra hàng chục nghìn candidate, rồi các tầng ranking lọc dần xuống danh sách hiển thị. Pipeline được mô hình hóa thành **DAG** (directed acyclic graph — đồ thị các bước phụ thuộc nhau).

**Chi tiết:**
- **Bối cảnh scale:** catalog cỡ vài tỷ item, thu về khoảng 100 triệu ở mức product. Mỗi query peak phải chạy nhiều retrieval strategy, hydration multi-billion-item, ads scoring và ranking nhiều tầng.
- **Vấn đề tích tụ qua nhiều năm:** retrieval fetch hàng chục nghìn candidate rồi ranking vứt gần hết; hydration là khối monolithic chặn các bước downstream; DAG chứa **false dependency** khiến việc lẽ ra chạy song song lại bị serialize.
- **Các đòn tối ưu và mức tiết kiệm bài nêu rõ:** đổi metric latency từ API response time sang **Above-the-Fold (ATF) completion** (~200ms); bỏ các retrieval path năng suất thấp (~120ms); tách hydration thành 2 pha song song ranking/presentation (~100ms); parallelize các stage từng bị serialize (~35ms); đổi dữ liệu ads từ **row-oriented sang column-oriented** (~130ms); tuning hạ tầng — parallel encoding, giảm precision, connection pooling, GC tuning (~200ms).
- **Kết quả:** cắt đôi latency search end-to-end mà vẫn giữ nguyên result quality và conversion metrics.
- **Trade-off bài thừa nhận:** parallelize làm kiến trúc phức tạp hơn, và phải đầu tư đáng kể vào measurement infrastructure thì mới tối ưu được.

**Vì sao đáng đọc:** Nguyên tắc "do less work, start work earlier, measure continuously" áp thẳng vào Joy — ví dụ màn Members list / analytics report: đừng query full dataset rồi filter ở app, và hãy đo theo thời điểm **merchant nhìn thấy được data đầu tiên** (ATF) thay vì thời điểm API trả xong.

## [From One Horizontal Scaling Controller to Many: Evolving Uber's Compute Platform](https://www.uber.com/us/en/blog/evolving-ubers-compute-platform/) — (Uber Engineering, 09/09/2026)

**Đây là gì:** Uber thêm **ServiceScale CRD** (Custom Resource Definition — cách mở rộng Kubernetes bằng kiểu resource tự định nghĩa) và một Service Scale Controller riêng, để **nhiều orchestrator cùng quyết định số replica** của một workload. Trước đó chỉ có một controller duy nhất; nhưng khi failover vùng, họ cần scale down workload tier thấp để nhường chỗ cho traffic tier cao — tức cần thêm một "người ra quyết định" thứ hai.

**Chi tiết:**
- Scale nền tảng: hơn 100 compute cluster, ~4.000 service trên 3 triệu core, 1,5 triệu pod launch mỗi ngày.
- Pattern cốt lõi: **tách scaling intent khỏi execution** — orchestrator chỉ ghi ý định vào ServiceScale object, controller reconcile xuống resource Kubernetes thật.
- Lý do không nhét vào deployment controller cũ: tránh tăng blast radius trên đường đi critical của deploy.
- Bài học production: informer cache lag làm hỏng state machine → phải làm **read-your-own-write consistency** qua generation annotation; hệ multi-writer lộ bug proportional scaling khi update đồng thời; rollout kéo dài cả năm qua staging + canary.

**Vì sao đáng đọc:** Bài mẫu rất sạch về pattern "desired state vs actual state" và cái giá của hệ **multi-writer** — đúng thứ cần cảnh giác khi nhiều nguồn (webhook Shopify, cron, admin action) cùng ghi vào một document Firestore của member.

## [Native is now the future of mobile at Shopify](https://shopify.engineering/back-to-native) — (Shopify Engineering, 10/09/2026)

**Đây là gì:** Bài architecture decision: Shopify quay ngược từ **React Native** (framework viết một codebase JS chạy cả iOS lẫn Android) về native Swift/Kotlin. Lập luận không phải "React Native tệ", mà là **coding agents đã làm chi phí viết cùng một feature hai lần giảm mạnh**, nên lợi thế code-sharing không còn đủ để bù các lớp framework trung gian.

**Chi tiết:**
- Timeline: 2020 chọn React Native → 01/2025 vẫn cam kết đầu tư → cuối 2025 LLM đạt ngưỡng năng lực khiến họ đánh giá lại.
- Shop app được rebuild hoàn toàn native, production-ready trong **12 tuần**; Shopify app (300+ screen) đang làm, ship cuối 2026.
- Trade-off thẳng thắn: vẫn phải build & maintain trên hai platform, nhưng agent lo phần implementation, translation, testing, review.

**Vì sao đáng đọc:** Một precedent quan trọng cho mọi quyết định tech-stack thời agent: các tiêu chí chọn abstraction (DRY, code-sharing) có thể bị định giá lại khi chi phí viết code giảm. Với Joy, câu hỏi tương tự là còn nên gánh abstraction layer nào chỉ để "đỡ viết hai lần".

## [How we rebuilt Cloudflare Workers' module registry for Node.js compatibility](https://blog.cloudflare.com/workers-module-registry-nodejs/) — (Cloudflare, 09/09/2026)

**Đây là gì:** Cloudflare viết lại **module registry** (thành phần trong runtime `workerd` chịu trách nhiệm resolve và load các `import`) của Workers. Bản cũ resolve specifier như **filesystem path**, nên không hỗ trợ được `import.meta.url` / `import.meta.resolve()`; ngoài ra nó compile cả bundle upfront và giữ bản copy riêng cho từng **V8 isolate** (sandbox JS độc lập mỗi request/worker), gây compile thừa và tốn memory.

**Chi tiết:**
- Thiết kế mới coi specifier là **URL ngay từ đầu**, đúng chuẩn ES modules.
- Thêm **lazy module compilation** và **shared code cache dùng chung giữa các isolate** — giảm compile lặp và memory.
- Hỗ trợ đúng chuẩn Node: `import.meta`, validation cho import attributes, hành vi `require(esm)`; bật qua compatibility flag `new_module_registry`.

**Vì sao đáng đọc:** Ví dụ đẹp về việc chọn sai **đơn vị định danh** (path thay vì URL) ở tầng nền sẽ chặn cả một lớp tính năng phía trên — và về pattern lazy + shared cache khi cùng một code chạy trong nhiều instance cô lập, giống hệt tình huống cold start / module loading trên Cloud Run và Cloud Functions của Joy.
