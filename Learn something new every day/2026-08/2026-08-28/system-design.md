# 🏗️ System Design — 2026-08-28

> Điểm chung của các bài hôm nay: scale không chỉ là tăng tài nguyên — cần kiểm soát retry, độ nhất quán của dữ liệu, ranh giới quyền hạn và phần việc nào thật sự phải chạy trên đường nóng.

## ⭐ [The August 17 outage, and the work ahead](https://github.blog/news-insights/company-news/the-august-17-outage-and-the-work-ahead/) — (GitHub Blog, 20/08/2026)

**Đây là gì:** Bản cập nhật sau sự cố của GitHub là một case study reliability rất thực tế: một thành phần hạ tầng ở Central US không scale kịp traffic đỉnh, rồi áp lực capacity lan sang authentication và nhiều dịch vụ khác. **Retry storm** là vòng lặp client retry quá nhiều khi dịch vụ đang lỗi, làm tải phục hồi còn nặng hơn tải ban đầu.

**Chi tiết:**
- Sự cố ngày 17/08 kéo dài **7 giờ 47 phút**, ảnh hưởng github.com, authentication, Actions, API, pull request, issues và Copilot.
- Khi khôi phục, lỗi ở một số dịch vụ Copilot kích hoạt client-side retry loop, tăng traffic; GitHub phải giảm vòng retry này trước khi mở traffic an toàn.
- GitHub xác định đây là capacity failure chứ không phải code/config change; monthly commits đã tăng từ **1,4 tỷ lên 2,9 tỷ** kể từ tháng 4.
- Hành động trực tiếp sau các sự cố tháng 8: áp retry limit, retry budget và timeout biến thiên nhất quán cho giao tiếp service-to-service; đồng thời rà lại các cảnh báo CPU/RAM mức ưu tiên thấp.
- Hướng kiến trúc tiếp theo là cô lập critical systems, gỡ shared dependency và làm read capacity scale tuyến tính theo số reader, rollout từ các monorepo lớn.

**Vì sao đáng đọc:** Shopify webhook bị lỗi/retry hàng loạt có thể tạo cùng một cascade trong Joy Loyalty. Cần xem retry budget, exponential backoff + jitter, idempotency key và alert saturation là một thiết kế xuyên dịch vụ — không phải chi tiết riêng của từng handler.

## [Closing the AI agent trust gap with graduated autonomy](https://aws.amazon.com/blogs/architecture/closing-the-ai-agent-trust-gap-with-graduated-autonomy/) — (AWS Architecture Blog, 26/08/2026)

**Đây là gì:** Pattern **graduated autonomy** không cấp toàn quyền hoặc read-only cố định cho AI agent. Agent bắt đầu ở tier thấp, chỉ được nâng quyền khi duy trì độ tin cậy; nếu chất lượng/safety giảm thì hạ quyền ngay. Mục tiêu là biến quyền hạn thành state động, có thể audit và thu hồi.

**Vì sao đáng đọc:** Nếu Joy có agent thao tác merchant data — tạo program, sửa reward, gửi email hay hoàn điểm — hãy chia quyền thành tier: draft-only → cần phê duyệt → thao tác giới hạn. Bài này gợi ý sáu lớp tách rời: scoring, tiering, chặn trước thực thi, policy enforcement ngoài process agent, đánh giá sau thực thi và delivery gate; đặc biệt phù hợp với các hành động không đảo ngược dễ dàng.

## [From User Sequences to Scaling Laws: A Multi-Stage Architecture for Meta’s Ads Ranking](https://engineering.fb.com/2026/08/05/ml-applications/from-user-sequences-to-scaling-laws-a-multi-stage-architecture-for-metas-ads-ranking/) — (Engineering at Meta, 05/08/2026)

**Đây là gì:** Meta tách recommendation thành hai stage: model offline xử lý bất đồng bộ lịch sử hành vi dài và cache embedding theo user; model online nhỏ hơn kết hợp embedding đó với tín hiệu mới/candidate để xếp hạng trong budget latency. Đây là một cách tách **heavy compute** khỏi **hot path** thay vì cố làm mọi thứ đồng bộ trong request.

**Vì sao đáng đọc:** Loyalty cũng có một bản nhẹ của bài toán này: segment/score/khả năng nhận ưu đãi có thể được tính trước bằng job, còn storefront/admin chỉ đọc projection đã chuẩn bị và kiểm tra vài điều kiện realtime. Lợi ích là không đẩy query/aggregation nặng vào lúc customer mở widget; đồng thời vẫn giữ chỗ cho dữ liệu vừa phát sinh (purchase, point activity) ở bước online.

## [Consistency is the new latency: AI at the data layer](https://aws.amazon.com/blogs/architecture/consistency-is-the-new-latency-ai-at-the-data-layer/) — (AWS Architecture Blog, 18/08/2026)

**Đây là gì:** Bài giải thích vì sao dữ liệu stale nguy hiểm hơn với autonomous agent so với UI thông thường: agent có thể đọc replica chậm, suy luận hoàn toàn logic từ dữ liệu cũ rồi ghi kết luận sai trở lại thành “memory”. Tác giả gọi vòng lặp này là **hallucination debt**.

**Vì sao đáng đọc:** Với số dư điểm, trạng thái redeem và quyền customer, Joy không nên để agent hay background worker đọc projection/cache eventual-consistent rồi ra quyết định ghi. Áp dụng nguyên tắc theo mức độ rủi ro: ledger/redeem cần read-your-own-writes hoặc conditional write/version check; analytics, dashboard hay gợi ý ưu đãi có thể chấp nhận eventual consistency. Điều quan trọng là ghi rõ “nguồn sự thật nào được phép dùng cho quyết định nào”.
