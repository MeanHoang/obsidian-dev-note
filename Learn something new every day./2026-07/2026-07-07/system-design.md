# 🏗️ System Design — 2026-07-07

> Hôm nay nghiêng về pattern thực chiến: dùng LLM làm thành phần trong pipeline dữ liệu (Shopify), và bài học tỉnh táo về chi phí vận hành microservices.

## ⭐ [The generative recommender behind Shopify's commerce engine](https://shopify.engineering/generative-recommendations) — (shopify.engineering)
**Đây là gì:** Shopify xây một recommender "generative" — thay vì tính điểm từng cặp user–product rời rạc, nó mô hình hoá cả hành trình mua sắm như một **chuỗi sự kiện** (search → view → add-to-cart → purchase) rồi dùng mô hình tự hồi quy (autoregressive, kiểu như GPT dự đoán từ tiếp theo) để đoán **sản phẩm kế tiếp** buyer sẽ quan tâm.
**Chi tiết:**
- Kiến trúc dựa trên **HSTU** (một họ sequence model cho recommendation), xử lý event theo thứ tự thời gian thay vì feature tĩnh.
- **Time-aware attention** kiểu RoPE (rotary encoding): mã hoá cả timestamp tuyệt đối lẫn khoảng cách thời gian giữa các event → tự bắt được tính mùa vụ mà không cần rule thủ công.
- **Negative sampling** được coi là "đòn bẩy scaling" chứ không phải chi tiết phụ: shared negatives dùng chung pool giữa các batch cho hiệu quả, cộng positive-aware hard negatives để tránh false negative.
- Số liệu: training nhanh hơn **7.3x** so với baseline; A/B test online cho **+0.94% Shop orders**, **+5% high-quality CTR**, **+0.71% conversion rate**, **+4.8% recall** sản phẩm phục vụ cuối cùng.
- Trade-off/hạn chế hiện tại: bảng embedding rất lớn do không gian product ID khổng lồ → đang thử **semantic IDs** (biểu diễn theo token) để giảm phụ thuộc và tích hợp text/query.
**Vì sao đáng đọc:** Đây chính là bài toán lõi của Joy Loyalty nếu muốn gợi ý reward/sản phẩm cá nhân hoá — mô hình hoá hành vi khách hàng như chuỗi sự kiện (earn/redeem/view) thay vì đếm điểm rời rạc là hướng đi rất chuyển giao được.

## ⭐ [Clustering billions of products for agentic commerce with Catalog API](https://shopify.engineering/catalog-clustering) — (shopify.engineering)
**Đây là gì:** Hàng tỉ listing trên Shopify không có schema chung — cùng một sản phẩm nhưng mỗi merchant cấu trúc khác nhau (mỗi vị một listing, hay gộp tất cả vị thành variant). Bài này mô tả pipeline gom (cluster) các listing "cùng một sản phẩm thật" để AI shopping agent nhận diện được.
**Chi tiết:**
- Cách tiếp cận **precision-first, hai tầng**. Triết lý: kết quả sai (gộp nhầm áo nam với áo nữ) tệ hơn kết quả thiếu (bỏ sót 1 màu variant).
- Tầng 1 (trong cùng store): **singleton detector** dựa trên rule parse code theme để lọc trước những shop đã tự link sản phẩm; rồi **pre-chunking** bằng ANN embedding + sparse average linkage tạo cụm ≤200 item.
- **Pipeline LLM 2 giai đoạn**: (1) trích chuỗi brand/model, gán Universal Product Identifier; (2) một LLM khác "phản biện" đề xuất, gắn cờ outlier.
- Mẹo kỹ thuật đáng học: **dynamic structured output schema** buộc mọi product phải được phân loại — model không thể bỏ sót ID hay bịa dữ liệu.
- Đo bằng dataset human-label làm ground truth + LLM-as-judge. Tầng 2 (cluster xuyên store) là hướng tiếp theo.
**Vì sao đáng đọc:** Pattern "LLM 2 giai đoạn có bước phản biện + schema bắt buộc output" là cách dùng LLM đáng tin trong production — áp dụng được khi Joy cần chuẩn hoá/khử trùng lặp dữ liệu sản phẩm hay merchant nhập liệu lộn xộn.

## [Reviewing the Microservices Architecture: Impacts, Operational Complexity, and Alternatives](https://www.infoq.com/articles/reviewing-microservices-architecture-operational-complexity/) — (infoq.com)
**Đây là gì:** Bài đánh giá tỉnh táo về cái giá vận hành của microservices và các phương án thay thế. Nhắc lại case kinh điển Segment: chuyển sang microservices được cô lập môi trường nhưng chi phí vận hành quá cao, 3 năm sau **quay lại monolith**. Nêu **modular monolith** (ép ranh giới module trong một deployment unit) và mô hình "monolith with satellites" (tách riêng search/recommendation/image processing) làm lựa chọn trung gian. Kết luận: đa số e-commerce không bao giờ đạt scale biện minh cho microservices.
**Vì sao đáng đọc:** Nhắc dev tránh over-engineering — với app Shopify chạy trên Cloud Run/Firebase, monolith gọn + tách vài service chuyên biệt thường đúng hơn là xé nhỏ mọi thứ.

## [Scaling Java-Based Real-Time Systems: the Hidden Tradeoffs of Event-Driven Design](https://www.infoq.com/articles/tradeoffs-event-driven-design/) — (infoq.com)
**Đây là gì:** Phân tích các trade-off ẩn khi scale hệ thống real-time bằng event-driven: mỗi hop Kafka (publish → consume → process) cộng thêm latency, và một action người dùng kéo theo chuỗi event downstream (routing → state → presence → notification) khiến độ trễ tích luỹ. Đề xuất tư duy at-least-once + idempotency thay vì đuổi theo exactly-once.
**Vì sao đáng đọc:** Nếu Joy dùng webhook/queue (Pub/Sub) để xử lý event Shopify async, đây là checklist về latency tích luỹ và idempotency cần thiết kế từ đầu.

## [The Human Infrastructure: How Netflix Built the Operations Layer Behind Live at Scale](https://netflixtechblog.com/the-human-infrastructure-how-netflix-built-the-operations-layer-behind-live-at-scale-33e2a311c597) — (netflixtechblog.com)
**Đây là gì:** Netflix kể về lớp "hạ tầng con người" — Live Operations Center — đứng sau các sự kiện live scale lớn. Điểm thú vị: dù hệ thống đã tự vận hành phần lớn, live vẫn cần đội ngũ + quy trình chuyên trách vì lỗi lúc phát trực tiếp không có "làm lại".
**Vì sao đáng đọc:** Reliability không chỉ là code và autoscaling — với các thời điểm peak (BFCM, flash sale) của merchant, runbook và quy trình on-call cũng là một phần kiến trúc.
