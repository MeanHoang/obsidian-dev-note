# 🏗️ System Design — 2026-09-04

> Tuần này chủ đề chung là "chia nhỏ để giảm blast radius và tiết kiệm tài nguyên": Uber phân vùng cluster M3DB thành subcluster, Cloudflare vắt kiệt từng byte RAM/disk trong cache, còn Uber + Shopify thì tối ưu chi phí token cho hệ thống agent.

## ⭐ [From Chaos to Control: Addressing Shard Distribution Challenges in M3DB with Subclusters](https://www.uber.com/us/en/blog/from-chaos-to-control/) — (Uber Engineering, 01/09/2026)
**Đây là gì:** Case study về sharding trong distributed database. **M3DB** là time-series database mã nguồn mở do Uber xây (lưu metrics giám sát). **Shard** = một lát dữ liệu; **replica factor (RF)** = số bản sao của mỗi shard; **blast radius** = phạm vi bị ảnh hưởng khi một node chết.

**Chi tiết:**
- Vấn đề: thuật toán placement cũ rải shard tự do trên toàn cluster. Hệ quả là một node có thể chia sẻ dữ liệu với tới **66,67% cluster** (với RF=3), và khi node chết thì **tối đa (n-1)/n số node** trong cluster phải cùng gánh việc recovery → bão I/O và network.
- Giải pháp — **subcluster**: chia node thành các nhóm cố định, mỗi subcluster sở hữu một phần shard space **không chồng lấn** và tự chứa. Bên trong subcluster vẫn dùng đúng thuật toán rải shard cũ (vẫn tôn trọng isolation group). Ví dụ bài đưa ra: cluster 12 node, RF=3, mỗi subcluster 6 node → 2 subcluster.
- Kết quả: mức độ shard sharing giảm từ **O(cluster) xuống O(subcluster)**; recovery chỉ giới hạn trong một subcluster; các subcluster khác nhau có thể bảo trì **song song**.
- Trade-off phải chấp nhận: hardware phải đồng nhất (homogeneous), scale cluster chỉ theo bội số kích thước subcluster, không đổi được replica factor động, và mỗi lúc chỉ được có một subcluster "dở dang" khi scale.
- Quyết định thiết kế đáng chú ý: họ **giữ nguyên API ở mức instance** thay vì thêm thao tác atomic trên cả subcluster — để tránh "bootstrapping storm" (nhiều node cùng khởi động lại và cùng nạp dữ liệu một lúc) và giữ an toàn vận hành.

**Vì sao đáng đọc:** Đây là bài học partition-để-giới-hạn-blast-radius áp dụng thẳng vào Joy Loyalty — khi Firestore/Pub/Sub sharding theo `shopId`, việc nhóm shop thành các "subcluster" logic (theo region, theo tier, theo topic riêng) giúp một shop khủng hoặc một batch job lỗi không kéo sập pipeline tính điểm của toàn bộ merchant còn lại.

## [Optimizing DNS cache memory in 1.1.1.1](https://blog.cloudflare.com/dns-cache-memory-optimization-1111/) — (Cloudflare, 27/08/2026)
**Đây là gì:** Deep-dive về tối ưu bộ nhớ của DNS resolver 1.1.1.1 (codename "Big Pineapple"). Bài mô tả 5 thủ thuật ở tầng data structure Rust: dùng `Box<[T]>` thay `Vec` để bỏ phần capacity thừa, gộp 3 section của DNS record thành một list dùng offset 2 byte (tiết kiệm 28 byte/entry), chỉ lưu owner name khi khác query name, box các enum variant lớn, và cuối cùng lưu record ở dạng wire format thô.
**Con số:** hơn **250 tỷ cache entry** trên toàn fleet — mỗi byte thừa/entry = hơn 250 GB. Kết quả: bộ nhớ mỗi entry giảm **56% (953 → 420 byte)**, giải phóng khoảng **100 TB**, insert throughput **+43%**, lookup latency **−19%**.
**Vì sao đáng đọc:** Nhắc rằng ở scale lớn, "kích thước một object" chính là chi phí hạ tầng. Với Joy Loyalty, cùng logic áp cho document Firestore và cache in-memory trên Cloud Run: bỏ field thừa, không lưu lại giá trị suy ra được, gộp array thay vì nested map — mỗi byte nhân với hàng triệu member là tiền billing thật.

## [How we could save petabytes of cache storage with Zstandard and Pingora](https://blog.cloudflare.com/cache-transcoding/) — (Cloudflare, 01/09/2026)
**Đây là gì:** Prototype nén cache-at-rest. **Pingora** là proxy framework viết bằng Rust của Cloudflare; **Zstandard (zstd)** là thuật toán nén lossless. Ý tưởng: khi một response đủ điều kiện đi vào cache thì encode bằng zstd trước khi ghi xuống disk, giải nén khi phục vụ.
**Con số:** tỉ lệ nén **2,8x** với text asset; chi phí encode **4,31 ns/byte (~232 MB/s, trả 1 lần)**, decode **1,56 ns/byte (~641 MB/s, trả mỗi lần serve)**; CPU tăng "vài phần trăm". Chỉ áp dụng cho text chưa nén (HTML, JSON, CSS, JS) trên 4 KiB — bỏ qua ảnh/video/font vì đã nén sẵn.
**Vì sao đáng đọc:** Mẫu trade-off kinh điển "trả CPU để mua storage/bandwidth", với con số cụ thể để tự tính. Joy Loyalty có thể áp cho các payload JSON lớn (export member, snapshot rule, log activity) trước khi ghi vào Cloud Storage — nhưng nhớ chú ý bài học asymmetry: giải nén trả phí mỗi lần đọc, nên chỉ đáng khi write-once/read-few.

## [Running a Software Factory Efficiently at Uber Scale](https://www.uber.com/us/en/blog/efficient-software-factory/) — (Uber Engineering, 27/08/2026)
**Đây là gì:** Case study về kiến trúc chi phí của một internal AI platform. "Software Factory" là hệ thống nội bộ Uber nhúng AI agent vào toàn bộ vòng đời phát triển phần mềm. Bài phân rã chi tiêu thành một **cost equation**: users × sessions/user × turns/session × requests/turn × tokens/request × price/token — rồi tối ưu từng thừa số.
**Con số:** **70%** pull request có đóng góp của AI agent, **3.600+** agent skill, **30K+** lượt chạy skill/ngày; user hoạt động tuần tăng **7x** và số request agentic tăng **9,4x** (02→08/2026), nhưng cost/1.000 request giảm **34%** và cost/session giảm **52%**. Đòn bẩy chính: chọn model theo Pareto benchmark, prompt caching với TTL 5 phút vs 1 giờ, giải quyết tool qua CLI để kéo schema overhead từ 50–70K token về gần 0, và "code-mode batching" tiết kiệm 55–100% token cho tương tác tool.
**Vì sao đáng đọc:** Cách phân rã "cost equation" là một design pattern có thể mượn cho bất kỳ hệ thống nào tính tiền theo đơn vị. Áp cho Joy Loyalty: chi phí Firestore = shops × jobs/shop × queries/job × docs/query — viết ra công thức đó rồi tấn công thừa số đắt nhất sẽ hiệu quả hơn là đi tối ưu ngẫu nhiên từng query.

## [Gisting: Compressing LLM Agent context to ↑ throughput and ↓ cost](https://shopify.engineering/gisting) — (Shopify Engineering, 19/08/2026)
**Đây là gì:** Kỹ thuật nén system prompt dài thành một chuỗi ngắn các "gist token" — token đặc biệt có embedding được huấn luyện bằng knowledge distillation (chạy 2 forward pass: teacher với prompt đầy đủ, student với gist token, tối ưu KL divergence; weight của model bị đóng băng, chỉ train embedding).
**Con số Shopify công bố:** tỉ lệ nén **4:1** (6.000 token → 1.500 gist token), TTFT giảm **19%** (438ms → 354ms ở 350 RPM), latency end-to-end giảm **38%** (6,8s → 4,2s), throughput tăng **16%** (20,2 → 23,4 QPS), và số GPU cấp phát giảm **14%**.
**Vì sao đáng đọc:** Nếu Joy Loyalty có feature AI (chatbot hỗ trợ merchant, gợi ý rule loyalty) với system prompt dài cố định, đây là hướng giảm chi phí inference mà không phải đổi model — và ở tầm nhìn kiến trúc, nó là ví dụ tốt cho nguyên tắc "trả chi phí một lần offline thay vì mỗi request".
