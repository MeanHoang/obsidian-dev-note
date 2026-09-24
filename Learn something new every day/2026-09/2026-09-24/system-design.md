# 🏗️ System Design — 2026-09-24

> Hôm nay có hai bài đáng đọc kỹ: Cloudflare giải bài toán cache phân mảnh do header `Vary`, và GitHub render PR 2,2 triệu dòng mà vẫn cuộn mượt nhờ tách "hai geometry". Thêm Uber ghi log feature lúc inference qua Kafka + Flink, và Meta open-source Rebalancer.

## ⭐ [We just shipped support for the ugliest part of HTTP: Vary](https://blog.cloudflare.com/vary-support/) — (Cloudflare Blog, 22/09/2026)
**Đây là gì:** Case study về caching trên CDN. `Vary` là header HTTP mà origin trả về để nói "response này thay đổi theo header X của request" (ví dụ `Accept-Language`). Bài giải thích vì sao `Vary` làm cache phân mảnh và cách Cloudflare cho người dùng kiểm soát nó bằng Cache Rules.
**Chi tiết:**
- Vấn đề: một URL có thể có nhiều response đúng. Request chỉ khác nhau vài chi tiết (thứ tự, khoảng trắng, quality value) cũng sinh ra cache entry riêng và hiếm khi được dùng lại. Theo bài, có "almost 3,000 sites" vary trên từ 4 field trở lên, có site vary tới 47 field.
- Giải pháp gồm 3 action cho từng header. **Normalize** áp dụng cho `Accept`, `Accept-Language`, `Accept-Encoding`: lowercase, sort theo q-value, bỏ tham số thừa, nên `en-US, fr;q=0.8` và `fr;q=0.8, en-GB` có thể quy về cùng cache key. **Passthrough** giữ nguyên từng byte khi giá trị thật sự làm đổi response. **Bypass** không cache với header có giá trị không giới hạn hoặc cá nhân hoá như `Cookie`, `User-Agent`.
- Chạy theo 2 pha. Pha request: normalize header theo rule trước khi gọi origin. Pha response: khi origin trả `Vary`, Cloudflare áp action của từng header để dựng các cache variant. Origin vẫn quyết định header nào ảnh hưởng tới response, còn cách xử lý từng header do người dùng cấu hình.
- Trade-off: normalize giảm phân mảnh nhưng phải khai báo trước các format và ngôn ngữ hỗ trợ. Passthrough giữ chính xác nhưng dễ sinh quá nhiều variant. Bypass thì mất cache hoàn toàn. Tính năng có trên mọi plan (kể cả Free), cấu hình được qua dashboard, Rulesets API và Terraform.
**Vì sao đáng đọc:** Widget và asset storefront của Joy đi qua CDN và có đa ngôn ngữ. Nếu response vary theo `Accept-Language` hoặc `Cookie` mà không kiểm soát, cache hit rate sẽ giảm mạnh. Firebase Hosting/Cloud CDN cũng xử lý `Vary` và cache key, nên nên xem lại header mà Cloud Functions/Cloud Run đang trả về.

## ⭐ [Rendering huge pull requests in the GitHub Copilot app](https://github.blog/engineering/user-experience/rendering-huge-pull-requests-in-the-github-copilot-app/) — (GitHub Blog, 23/09/2026)
**Đây là gì:** Case study frontend performance về virtualization, tức kỹ thuật chỉ render phần đang nằm trong viewport của một danh sách khổng lồ. Bài kể cách render một PR 2,2 triệu dòng có hơn 400 inline comment.
**Chi tiết:**
- Khó ở chỗ phần code có chiều cao xác định, nhưng comment (markdown, ảnh, phần mở rộng, dữ liệu load async) có chiều cao không đoán trước được, nên virtualization kiểu thường bị giật hoặc hở khoảng trắng.
- Cách làm là tách hai geometry. **Code geometry** có chiều cao chính xác, tính trước bằng prefix sum. **Dynamic block geometry** dùng chiều cao ước lượng cho comment, đo lười và neo theo identity thay vì toạ độ pixel. Chiều cao thực tế của một block lấy theo thứ tự: số đo hợp lệ, rồi đến cache (nếu fingerprint và width còn khớp), cuối cùng mới là ước lượng.
- Tránh vòng lặp `ResizeObserver` gây reflow: chỉ đo một lượt khi idle hoặc khi scroll đã dừng, giới hạn trong viewport cộng margin 2400px. Riêng các thao tác do user kích hoạt (mở details, viết reply) thì được xử lý ngay.
- Scroll anchoring theo identity: khi chiều cao đo được lệch so với ước lượng, hệ thống ghi nhận block user đang xem, áp phần chênh lệch rồi đặt lại viewport để block đó đứng yên. Team cũng dựng health probe và vòng test tự động thay vì cố tái hiện bug bằng tay. Bài không đưa số liệu before/after cụ thể.
**Vì sao đáng đọc:** Admin Joy (React + Polaris) có các danh sách dài như activity log, member list, points history. Pattern "chiều cao ước lượng + đo lười + neo scroll theo identity" dùng thẳng được khi list có row cao không đều.

## [Taming the ML Firehose: Scaling Feature Consistency](https://www.uber.com/us/en/blog/taming-ml-firehose/) — (Uber Blog, 22/09/2026)
**Đây là gì:** Case study data pipeline theo hướng event-driven. Uber log feature ngay lúc inference và đẩy vào Kafka, sau đó dùng Flink join với impression event bằng time-windowed join để có dữ liệu training thống nhất, xử lý lệch dữ liệu giữa online và offline (ví dụ lúc train là "en-US" nhưng lúc serve là "en").
**Vì sao đáng đọc:** Hệ thống chạy 8 triệu QPS. Nhờ allow list, payload giảm 4–5×, độ trễ dữ liệu từ nhiều ngày còn vài giờ, mismatch trên các feature quan trọng từ hơn 10% về 0%. Bài học "log đúng thứ cần tại nguồn, chấp nhận không log đủ hết" áp dụng được khi Joy thiết kế event pipeline Pub/Sub → BigQuery cho analytics.

## [Open-Sourcing Rebalancer: A Generic, High-Performance Library for Solving Assignment Problems](https://engineering.fb.com/2026/09/21/open-source/rebalancer-generic-high-performance-library-assignment-problems/) — (Engineering at Meta, 21/09/2026)
**Đây là gì:** Thư viện giải assignment problem, tức bài toán gán object vào bin (shard vào server, task vào worker) sao cho tối ưu mục tiêu mà vẫn thoả ràng buộc. Có 2 solver: MIP cho lời giải tối ưu và local search đánh giá hàng triệu nước đi mỗi giây. License Apache 2.0, có package Python.
**Vì sao đáng đọc:** Meta giải khoảng 40 triệu bài toán mỗi ngày, P99 là 12 giây cho 265k object × 3,2k bin, và công cụ này chạy phía sau Shard Manager. Đây là ví dụ tốt về cách tách "mô tả bài toán" khỏi "thuật toán giải" khi Joy cần chia shop hoặc job vào các worker hay queue sao cho cân tải.
