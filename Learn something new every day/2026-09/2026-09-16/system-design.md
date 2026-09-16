# 🏗️ System Design — 2026-09-16

> Chủ đề nổi bật hôm nay: **kiểm soát tải và kiểm soát chi phí ở quy mô lớn** — Uber công bố kiến trúc rate limiter 80M RPS, Shopify mở hộp recommender generative đứng sau commerce engine, còn Airbnb viết lại key-value store cấp petabyte.

## ⭐ [The generative recommender behind Shopify's commerce engine](https://shopify.engineering/generative-recommendations) — (shopify.engineering, 25/02/2026)

**Đây là gì:** Case study về hệ recommendation thế hệ mới của Shopify. Thay vì tính "feature" tổng hợp cho từng user (kiểu: đã mua bao nhiêu đơn, category ưa thích...), họ dùng **generative model tự hồi quy (autoregressive)** — coi hành trình mua hàng của buyer như một **chuỗi sự kiện** (search → view → add-to-cart → favorite → purchase) và dự đoán "item tiếp theo", đúng cách một LLM dự đoán token tiếp theo.

**Chi tiết:**
- Scale bối cảnh bài nêu: **2.2 nghìn tỷ edge request** trong BFCM 2025, **81 triệu người mua** trong cuối tuần đó, catalog hàng triệu sản phẩm và hàng tỷ event.
- Model nền là **HSTU** (kiến trúc sequential recommendation) với **causal masking** cho bài toán next-item prediction; học trực tiếp từ raw event sequence trên storefront và Shop app — không cần feature engineering thủ công.
- Ba tối ưu kỹ thuật đáng chú ý: **rotary time-encoding kiểu RoPE** để model "hiểu" tính mùa vụ; **shared negative sampling** để mở rộng pool ứng viên mà không nổ memory; và **CUDA kernel tự viết** cho tốc độ training nhanh **7.3x**.
- Trade-off chính họ nêu rõ: cân giữa **độ biểu đạt của model** và **tốc độ serving + memory** — recommender phải trả kết quả trong ràng buộc latency production thật, không phải offline benchmark.
- Kết quả online (số tương đối, bài nêu): **+0.94% đơn hàng Shop**, **+5% click-through rate chất lượng cao**, **+0.71% conversion rate**.

**Vì sao đáng đọc:** Đây là bài học trực tiếp cho Joy Loyalty. Dữ liệu loyalty vốn đã là **chuỗi event có thứ tự thời gian** (earn point → redeem → referral → tier up → churn) — cùng dạng dữ liệu mà HSTU ăn vào. Bài này cho thấy mô hình "sequence-first" thắng mô hình "aggregate feature" khi muốn dự đoán hành vi tiếp theo. Ở scale Joy, thay vì train model riêng, ý tưởng có thể áp dụng ngay là **thiết kế event log dạng chuỗi bất biến trong Firestore/BigQuery** (mỗi hành động là 1 event có timestamp, không overwrite state) — vì nếu sau này muốn làm predictive churn hay next-best-reward, dữ liệu dạng chuỗi là điều kiện cần, mà không thể dựng lại từ snapshot.

---

## ⭐ [Uber's Rate Limiting System](https://www.uber.com/us/en/blog/ubers-rate-limiting-system/) — (Uber Engineering, 12/02/2026)

**Đây là gì:** Uber mô tả hệ **rate limiting toàn cục (Global Rate Limiter)** — cơ chế giới hạn số request để bảo vệ service khỏi quá tải. Điểm mới: họ bỏ thuật toán **token bucket** cổ điển (mỗi client có "xô token", hết token thì chặn cứng) và chuyển sang mô hình **probabilistic dropping** (drop ngẫu nhiên theo tỉ lệ được điều khiển động).

**Chi tiết:**
- Kiến trúc **3 tầng**: (1) rate-limit client nằm ngay trong service mesh, tự quyết định local; (2) zone-level aggregator gom metric và tính usage; (3) regional/global controller tính utilization rồi **push xuống "drop-ratio directive"**. Control plane cập nhật **mỗi giây**.
- Điểm mấu chốt: **enforcement hoàn toàn ở client layer trong data plane** — mỗi proxy nhận config và drop-ratio từ control plane, nên quyết định chặn không cần round-trip tới service trung tâm. Đây là pattern control plane / data plane kinh điển: tính toán tập trung, thực thi phân tán.
- Số liệu bài nêu: **~80 triệu request/giây** trên **1.100+ service**; P50 giảm ~**1ms**, P99.5 cải thiện tới **90%**. Một service quan trọng chịu được cú **tăng 15 lần** (22K → 367K RPS) mà không degrade.
- Có thêm lớp tự động hóa **Rate Limit Configurator (RLC)**: tự chỉnh config dựa trên traffic history, hỗ trợ cả predictive model lẫn fixed quota, và **chạy shadow-mode để validate trước khi enforce thật**.

**Vì sao đáng đọc:** Joy Loyalty sống trong thế giới rate limit — Shopify Admin API có leaky bucket riêng, và Cloud Run của chúng ta cũng có giới hạn concurrency. Bài này đổi mindset theo hai hướng dùng được ngay. Thứ nhất, **soft control thay vì hard stop**: khi bị quá tải, drop theo tỉ lệ (ví dụ chặn 20% job đồng bộ point không khẩn cấp) giữ hệ thống sống tốt hơn là chặn cứng một nhóm merchant. Thứ hai, **shadow mode trước khi enforce** là quy trình nên copy nguyên vẹn: trước khi bật một giới hạn mới cho merchant lớn, log xem "nếu bật thì sẽ chặn bao nhiêu" trong vài ngày, rồi mới thật sự bật.

---

## [Building a Next-Generation Key-Value Store at Airbnb](https://airbnb.tech/infrastructure/building-a-next-generation-key-value-store-at-airbnb/) — (Airbnb Engineering)

**Đây là gì:** Airbnb viết lại **Mussel** — key-value store nội bộ lưu "derived data" (dữ liệu dẫn xuất: kết quả tính sẵn từ data warehouse, dùng cho pricing, personalization, fraud check). Mussel v2 chuyển sang backend **NewSQL** (database phân tán nhưng vẫn giữ SQL + transaction/consistency, khác NoSQL truyền thống).

**Chi tiết:**
- Vấn đề gốc: hệ cũ không gánh nổi **hai kiểu ghi cùng lúc** — bulk ingestion (đổ hàng chục TB từ warehouse) và streaming write (ghi real-time) — nên phải tách cluster, vận hành phức tạp. v2 gộp cả hai vào **một cluster, một API duy nhất cho caller**.
- Kiến trúc: **Dispatcher** là service stateless trên Kubernetes, lo dịch API, dual-write và shadow read; **Kafka** persist write để đảm bảo durability trước khi apply vào backend; **TTL service** xóa dữ liệu hết hạn song song, có nhận biết topology; **bulk loading** qua pipeline Airflow đi từ warehouse → S3 → table.
- Số liệu bài nêu: **100k+ streaming write/giây**, **p99 read dưới 25ms** ngay cả trên bảng **vượt 100TB**; migration kiểu **blue/green** chuyển **hơn 1 petabyte** qua hàng nghìn table mà **zero downtime**.
- Trade-off được nói thẳng: chuyển sang strong consistency thì phải tự viết **dedup + write repair**; caller phải chọn giữa **primary replica (data mới nhất)** và **secondary replica (rẻ hơn)**; range partitioning dễ tạo hotspot nên cần **presplit** trước khi ingest.

**Vì sao đáng đọc:** Bài này mô tả đúng bài toán Joy đang có với Firestore: dữ liệu "derived" (tier hiện tại, điểm khả dụng, segment retention risk) vừa bị ghi real-time bởi webhook Shopify, vừa bị ghi hàng loạt bởi job tính lại từ BigQuery — và hai luồng đó đánh nhau. Hai chi tiết đáng nhặt: **cho caller chọn replica theo yêu cầu freshness** (báo cáo analytics chấp nhận dữ liệu chậm và rẻ, còn widget hiển thị điểm thì phải mới nhất), và **presplit trước bulk load** để tránh hotspot — với Firestore là chống hotspot do document ID tuần tự khi import khối lượng lớn.

---

## [Running a Software Factory Efficiently at Uber Scale](https://www.uber.com/us/en/blog/efficient-software-factory/) — (Uber Engineering, 27/08/2026)

**Đây là gì:** Uber công bố cách họ vận hành **fleet coding agent** ở quy mô công ty mà không nổ ngân sách. Điểm hay không nằm ở AI mà ở **tư duy kiến trúc chi phí**: họ phân rã chi phí thành một phương trình nhân, rồi tối ưu từng thừa số độc lập.

**Chi tiết:**
- Phương trình chi phí: `users × sessions/user × turns/session × requests/turn × tokens/request × price/token`. Mỗi thừa số đo được và tối ưu riêng — đây là cách tiếp cận dùng được cho bất kỳ chi phí cloud nào, không riêng AI.
- Số liệu giai đoạn Feb–Aug 2026: weekly active user tăng **7x**, agent request tăng **9.4x**, nhưng **chi phí/1.000 request giảm 34%** và **chi phí/session giảm 52%** so với đỉnh tháng 6. Hơn **70% pull request** đến từ agent.
- Tối ưu context: dùng **prompt caching** (TTL 5 phút và 1 giờ) cùng CLI tool resolution, cắt được **50K–70K token schema overhead mỗi session**.
- "Code-mode execution": gộp nhiều thao tác SQL vào một vòng lặp Python thay vì để model gọi tuần tự từng turn — tiết kiệm **55–100% token**.
- Bài nêu quy mô nền tảng: hơn **3.600 agent skill**, **30K+ skill run/ngày**, và một **AI Context Graph 24 triệu node / 80 triệu edge** giúp giảm thời gian truy vấn từ **hơn 20 phút xuống 38 giây**.

**Vì sao đáng đọc:** Với dev workflow của Joy, bài học chuyển giao trực tiếp là **phân rã chi phí thành tích các thừa số rồi đo từng cái**. Cùng công thức đó áp cho Cloud Run: `số merchant × request/merchant × instance-second/request × giá/instance-second` — nhìn vậy sẽ thấy ngay giảm cold start hay giảm số webhook thừa mới là đòn bẩy, chứ không phải hạ giá máy. Phần prompt caching và code-mode cũng dùng được luôn nếu Joy có tính năng AI gọi LLM theo lượt.

---

## [Why We Use Separate Tech Stacks for Personalization and Experimentation](https://engineering.atspotify.com/2026/1/why-we-use-separate-tech-stacks-for-personalization-and-experimentation) — (Spotify Engineering, 07/01/2026)

**Đây là gì:** Spotify giải thích vì sao họ **cố tình giữ hai stack tách rời**: ML stack để *phục vụ* recommendation, và Confidence (experimentation platform) để *đánh giá* recommendation qua A/B test. Đây là một lập luận thuần về separation of concerns ở tầng platform.

**Chi tiết theo bài:**
- Câu chốt của bài: *"The ML stack serves recommendations; the experimentation stack evaluates recommendation systems"* — hai mục đích khác nhau thì yêu cầu hạ tầng cũng khác nhau.
- Personalization cần **truy cập feature low-latency, thu thập dữ liệu real-time, tính toán nhanh**; công cụ experimentation không được thiết kế cho những ràng buộc đó.
- Trộn hai mối quan tâm sinh ra **technical debt ẩn**, càng khó gỡ khi hệ lớn dần.
- Một kết luận phản trực giác: **multi-armed bandit** nghe hấp dẫn về lý thuyết nhưng vật lộn khi có nhiều mục tiêu cạnh tranh và pattern thời gian thực tế; **A/B test đơn giản chạy cho 300+ team** lại giá trị hơn.

**Vì sao đáng đọc:** Joy Loyalty rồi cũng sẽ muốn A/B test các chương trình thưởng (tier threshold nào tăng retention tốt hơn, reward nào được redeem nhiều hơn). Bài này cảnh báo trước một sai lầm rất dễ mắc: nhét logic thí nghiệm vào thẳng service đang chạy runtime tính điểm. Tách ra — service tính điểm lo latency, một lớp riêng lo phân nhóm và đo lường — sẽ rẻ hơn nhiều so với gỡ rối về sau. Và lời khuyên "A/B test đơn giản thắng bandit phức tạp" rất đáng nghe với team nhỏ.
