# 1) Khái niệm cơ bản (rất ngắn gọn)

- **Rate limit** = giới hạn số lượng / “sức chịu đựng” của API trong 1 khoảng thời gian để bảo vệ hệ thống. Khi bạn gọi quá nhanh hoặc gọi “nặng” quá nhiều lần, Shopify sẽ _throttle_ (trả `429 Too Many Requests`) để bảo toàn nền tảng. [Shopify+1](https://shopify.dev/docs/api/usage/limits?utm_source=chatgpt.com)
    
# 2) Shopify dùng _leaky-bucket_ / cost-based model — nghĩa là gì?

- **Leaky-bucket**: tưởng tượng một xô có dung tích (bucket). Mỗi request “ném” một số điểm (cost) vào xô. Xô có 2 thuộc tính quan trọng:
1. **Bucket size** (tối đa x điểm bạn có thể giữ tại 1 thời điểm).
2. **Leak rate** (số điểm xô “tự phục hồi” mỗi giây).
- Nếu bạn ném quá nhiều (xô đầy), request tiếp theo sẽ bị **throttle** ngay lập tức (429). Với GraphQL, mỗi query có _chi phí khác nhau_ tùy độ phức tạp — không phải 1 request = 1 như REST. [Shopify+1](https://shopify.dev/docs/apps/build/graphql/migrate/learn-how?utm_source=chatgpt.com)
---
# 3) Các con số quan trọng (mặc định & khác nhau theo API / plan)

> **Những số này hay được cập nhật** (check docs nếu nghi ngờ). Dưới đây là các giá trị chuẩn trên tài liệu chính thức:

- **GraphQL Admin API (mặc định)**
    - _Leak rate_: **50 points / second** (mặc định).
    - _Bucket size_: **1,000 points** (tức bạn có thể “tích” tối đa 1.000 points trước khi bị block).
    - Mỗi query có cost khác nhau (tùy độ phức tạp và các trường nested). [Shopify+1](https://shopify.dev/docs/apps/build/graphql/migrate/learn-how?utm_source=chatgpt.com)
- **REST Admin API (legacy)**
    - _Leak rate_: **2 requests / second** (tức trung bình 2 req/s). Nếu bạn gửi nhanh hơn, có khả năng bị 429. [Shopify](https://shopify.dev/docs/api/admin-rest/usage/rate-limits?utm_source=chatgpt.com)
- **Plan nâng cấp (Advanced / Plus)**
    - Advanced, Plus có giới hạn cao hơn (ví dụ Advanced tăng lên ~100 points/sec cho GraphQL, Plus có thể lên rất cao — changelog nêu rõ các mức tăng theo từng plan). Nếu app cài trên Shopify Plus store thì rate limit được tăng. (xem changelog cụ thể cho từng plan). [Shopify+1](https://shopify.dev/changelog/increased-admin-api-rate-limits-for-the-advanced-plan?utm_source=chatgpt.com)

---
# 4) Cách Shopify tính _cost_ cho GraphQL (về mặt thực tế)

- Mỗi field / connection trong GraphQL có "cost" — gọi nhiều nested fields, nhiều edges = cost tăng.
- **Mutations** thường tốn nhiều điểm hơn một query đơn giản.
- Một query lớn có thể tiêu vài chục -> vài trăm điểm; tổng cost của tất cả query đang “ngồi” trong bucket không được vượt quá bucket size. [Shopify+1](https://shopify.dev/docs/apps/build/graphql/migrate/learn-how?utm_source=chatgpt.com)

---

# 5) Triệu chứng khi bạn bị throttle / bị rate-limited

- API trả **HTTP 429 Too Many Requests**.
- GraphQL có thể trả extension/headers cho biết: còn bao nhiêu points, restore rate, ... — bạn nên đọc response để điều chỉnh.
- Ứng dụng sẽ chậm/treo nếu không xử lý retry/backoff đúng. [Shopify+1](https://shopify.dev/docs/api/usage/limits?utm_source=chatgpt.com)
---

# 6) Nguyên tắc thiết kế để tránh 429 (một checklist thực tế)

1. **Dùng cache** cho dữ liệu ít đổi (products list, metafields nếu ít thay đổi).
2. **Gộp request khi có thể** (GraphQL có thể lấy nhiều resource trong 1 query, nhưng beware cost).
3. **Dùng Bulk Operations** (Shopify cung cấp bulk operations cho thao tác lớn, non-interactive). Khi cần sync hàng loạt, dùng bulk thay vì loop nhiều request. [Shopify+1](https://shopify.dev/docs/api/usage/limits?utm_source=chatgpt.com)
4. **Thay polling bằng webhooks** khi có thể (webhook → update local store), tránh crawl liên tục.
5. **Queue + Throttle client-side**: kiểm soát tốc độ gửi (token-bucket / leaky-bucket client), không gửi tất cả cùng lúc.
6. **Exponential backoff** cho các 429 (kết hợp với header `Retry-After` nếu server trả).
7. **Theo dõi usage**: log số 429, thời điểm, cost query — dùng metrics & alert.
8. **Test với store có dữ liệu thật** (số product/variants lớn dễ gây throttle) để tune. [Shopify](https://www.shopify.com/partners/blog/implement-api-rate-limit?utm_source=chatgpt.com)

---

# 7) Chiến lược cụ thể (kèm ví dụ minh hoạ)

## A — Nếu bạn xài **REST** (2 req/s)

- **Đơn gian**: throttle client để gửi **trung bình ≤ 2 request/s**.
- Nếu có 200 objects: xử lý theo batch (2 req/s → ~100 s) hoặc dùng background bulk process.

## B — Nếu bạn xài **GraphQL** (points model)

- **Bước 1:** estimate cost mỗi query (bằng cách test/trial hoặc đọc extensions trả về).
- **Bước 2:** maintain local variable `currentPoints` (bắt đầu = bucketSize) và **phục hồi** `currentPoints += leakRate * elapsedSeconds`.
- **Bước 3:** trước khi gửi query, nếu `currentPoints >= queryCost` → gửi và `currentPoints -= queryCost`. Nếu không đủ → đẩy query vào queue, chờ (sleep) đến khi phục hồi đủ.
- **Tip**: đưa thêm “buffer” (ví dụ giữ 10–20% free) để tránh race conditions.

---
# 8) Vài mẹo tinh tế (advanced)

- **Dynamic cost estimation**: đọc `extensions.cost` (GraphQL response) để cập nhật cost thực tế của query — dùng để adjust `estimateCost`. [Shopify](https://shopify.dev/docs/api/usage/limits?utm_source=chatgpt.com)
    
- **Parallelism có điều kiện**: cho phép N worker nhẹ (ví dụ 3–5) xử lý queue, nhưng mỗi worker vẫn check bucket trước khi gửi.
    
- **Bulk ops cho large writes**: nếu bạn cần tạo/cập nhật hàng ngàn item, sử dụng Bulk Operation (asynchronous) thay vì loop synchronous requests. [Shopify](https://www.shopify.com/id/partners/blog/shopify-metafields?utm_source=chatgpt.com)
    

---

# 9) Tóm tắt ngắn — làm sao để không bị 429 trong 3 câu

1. Hiểu model: GraphQL = **points** (bucket & leak rate); REST = **requests/sec**. [Shopify+1](https://shopify.dev/docs/apps/build/graphql/migrate/learn-how?utm_source=chatgpt.com)
2. Thay polling bằng webhooks, dùng cache, gộp request, dùng bulk cho thao tác lớn. [Shopify](https://www.shopify.com/id/partners/blog/shopify-metafields?utm_source=chatgpt.com)
3. Kiểm soát ở client: giữ queue + token/leaky-bucket + exponential backoff khi gặp 429. [Shopify](https://www.shopify.com/partners/blog/implement-api-rate-limit?utm_source=chatgpt.com)

---
# 11) Tài liệu chính nên đọc (link chính)

- Shopify — API usage limits (tổng quan): [https://shopify.dev/docs/api/usage/limits](https://shopify.dev/docs/api/usage/limits?utm_source=chatgpt.com). [Shopify](https://shopify.dev/docs/api/usage/limits?utm_source=chatgpt.com)
    
- REST Admin API rate limits: [https://shopify.dev/docs/api/admin-rest/usage/rate-limits](https://shopify.dev/docs/api/admin-rest/usage/rate-limits?utm_source=chatgpt.com). [Shopify](https://shopify.dev/docs/api/admin-rest/usage/rate-limits?utm_source=chatgpt.com)
    
- GraphQL Admin API / calculated cost: [https://shopify.dev/docs/apps/build/graphql/migrate/learn-how](https://shopify.dev/docs/apps/build/graphql/migrate/learn-how?utm_source=chatgpt.com). [Shopify](https://shopify.dev/docs/apps/build/graphql/migrate/learn-how?utm_source=chatgpt.com)
    
- Changelog (Advanced / Plus rate increases): changelog pages. [Shopify+1](https://shopify.dev/changelog/increased-admin-api-rate-limits-for-the-advanced-plan?utm_source=chatgpt.com)