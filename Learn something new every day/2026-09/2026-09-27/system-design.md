# 🏗️ System Design — 2026-09-27

> Tuần này nổi bật về reliability: Uber chặn retry storm bằng "error ownership", Cloudflare công khai lỗ hổng rò dữ liệu giữa các tenant, cùng các bài về dependency analysis, preview environment cô lập và bỏ CSS-in-JS.

## ⭐ [How Uber Protects Against Retry Storms](https://www.uber.com/us/en/blog/protecting-against-retry-storms/) — (Uber Engineering, 17/09/2026)
**Đây là gì:** Case study về **retry storm**: khi một service sâu trong call chain lỗi, mọi tầng phía trên cùng retry nên lượng request bị nhân lên theo cấp số nhân với độ sâu của chain. Uber xử lý bằng **error ownership**: chỉ service gây ra lỗi mới "claim" lỗi và cho caller trực tiếp của nó retry. Các service chỉ chuyển tiếp lỗi lên trên thì đánh dấu lỗi là đã xử lý, nên các tầng xa hơn không retry lại nữa.
**Chi tiết:**
- Retry với policy đồng đều ở mọi tầng khiến tải tăng theo cấp số nhân với độ sâu call chain. Khi hệ thống đã suy giảm vừa hoặc nặng, retry chỉ làm service đang yếu càng quá tải. Retry budget và tinh chỉnh config từng service giúp được phần nào, nhưng phải chỉnh tay và không thấy được hiệu ứng khuếch đại xuyên service.
- Thông tin ownership đi ngược lên qua header HTTP `x-uber-error-claim`. Retry middleware kết hợp với Service Dependency Analysis đối chiếu lỗi inbound với outbound để biết lỗi là "gốc" hay chỉ "lây" từ downstream.
- **At-least-once-retry guarantee:** khi đủ điều kiện retry thì hệ thống vẫn đảm bảo có ít nhất 1 lần retry ở đâu đó trong chain, để không mất availability. Service nào không có retry sẽ báo cho caller biết để caller retry thay.
- Kết quả: trong một sự cố tháng 11/2025, cơ chế này chặn **9,5 triệu request thừa**. Bán kính tối đa của retry storm giảm từ 25 tầng xuống 3 (trung bình từ 20 xuống 2).
- Trade-off: hệ thống phức tạp hơn vì phụ thuộc vào shared infra và dependency analysis. Nếu có lỗi trùng hợp không liên quan thì một lần retry hợp lệ có thể bị chặn nhầm, nhưng dữ liệu production cho thấy trường hợp này hiếm (≤2% số edge có tỉ lệ lỗi cao).

**Vì sao đáng đọc:** Joy có chuỗi gọi Cloud Functions → Shopify Admin API → Firestore, trong đó cả client, Pub/Sub và function đều có thể retry. Bài này giúp bạn quyết định tầng nào được retry (chỉ tầng gần lỗi nhất) để một sự cố rate-limit của Shopify không bị nhân thành bão request.

## ⭐ [How Cloudflare addressed a cross-tenant data exposure vulnerability in Containers](https://blog.cloudflare.com/containers-cross-tenant-vulnerability/) — (Cloudflare Blog, 24/09/2026)
**Đây là gì:** Postmortem về một lỗi **multi-tenant isolation**. Disk của container dùng Linux device-mapper **thin provisioning** (dm-thin: cấp phát block vật lý dần theo nhu cầu từ một pool dùng chung). Vì bật `skip_block_zeroing`, khi một block chuyển từ tenant cũ sang tenant mới thì dữ liệu cũ không bị xóa, nên tenant mới đọc được dữ liệu còn sót.
**Chi tiết:**
- Container chạy trên Firecracker VM multi-tenant. Block vật lý 64 KiB được chia sẻ trong một pool chung cho nhiều account. Khi tenant mới chỉ ghi 4 KiB vào một block vừa được cấp, 60 KiB còn lại vẫn giữ dữ liệu của chủ trước và đọc được qua raw device.
- Trong proof of concept, nhóm kiểm tra 5.614 directory block và tìm thấy 2.700 inode thư mục thuộc tenant khác. 18/24 lần đặt workload có dữ liệu sót lại. Không có dấu hiệu bị khai thác thật.
- Cách sửa: bỏ `skip_block_zeroing` (triển khai 4–7/9), loại bỏ toàn bộ disk và snapshot cache tạo trước khi vá, rồi dọn image cache trên toàn fleet (xong 19/9).
- Bài học chính: phải làm sạch dữ liệu **tại thời điểm cấp phát cho tenant mới**, không chỉ lúc giải phóng. Các artifact được cache từ cấu hình cũ vẫn mang theo lỗ hổng.

**Vì sao đáng đọc:** Joy là app multi-tenant (mỗi shop là một tenant trên cùng Firestore và Cloud Functions). Bài này nhắc bạn kiểm tra những chỗ có thể "rò" dữ liệu giữa các shop: cache ở global scope của function được tái sử dụng giữa các request, object dùng lại, hoặc query quên lọc `shopId`.

## [Large-Scale Automated Dependency Analysis Across Uber's Service Mesh](https://www.uber.com/us/en/blog/automated-dependency-analysis/) — (Uber Engineering, 15/09/2026)
**Đây là gì:** Bài nền tảng cho bài retry storm ở trên. Uber gắn middleware vào YARPC (framework RPC của Uber) để đối chiếu request đến và request đi, từ đó tính xác suất **fail-close** của từng dependency: khi callee lỗi thì caller có lỗi theo hay không. Dependency được xếp loại fail-close (≥0.8), fail-open (≤0.2) hoặc unknown. Cách này ghi nhận mọi lỗi trên production, trong khi tracing với tỉ lệ sampling 0,01% có thể mất hơn 5 giờ mới thấy được một lỗi.
**Vì sao đáng đọc:** Có thể áp dụng ở quy mô nhỏ cho Joy: truyền một `requestId` qua context và log kết quả mỗi lần gọi Shopify hoặc Firestore. Từ đó biết dependency nào khi lỗi sẽ làm hỏng cả flow (fail-close) và dependency nào nên bị bỏ qua an toàn, ví dụ ghi analytics nên là fail-open.

## [Introducing Worker Previews: Isolated preview environments for every change your agent makes](https://blog.cloudflare.com/worker-previews/) — (Cloudflare Blog, 22/09/2026)
**Đây là gì:** Mỗi Git branch có một môi trường preview riêng: URL riêng, bản copy riêng của config, secret và binding, namespace Durable Object riêng. Nhờ vậy hàng trăm preview chạy song song mà không đụng tới state production hay tranh nhau một môi trường staging chung.
**Vì sao đáng đọc:** Đây là pattern "ephemeral environment per branch" mà Joy có thể học theo với Firebase Hosting preview channels cộng với dữ liệu tách riêng. Nhất là khi AI agent sinh nhiều thay đổi song song cần được test độc lập.

## [Improving site performance by shipping more CSS](https://github.blog/engineering/architecture-optimization/improving-site-performance-by-shipping-more-css/) — (GitHub Blog, 25/09/2026)
**Đây là gì:** GitHub chuyển toàn bộ từ CSS-in-JS (`styled-components`, prop `sx`) sang CSS Modules. Việc xử lý style dời từ runtime sang build-time, giúp giảm 55% thời gian SSR của các component Primer và khởi tạo component nhanh hơn 25%. Dự án kéo dài 13 tháng, chuyển đổi khoảng 7.760 prop `sx` và dùng feature flag để giữ tương thích ngược.
**Vì sao đáng đọc:** Đây là bài học về trade-off kiến trúc frontend. Style tính ở runtime có giá mỗi lần render. Khi viết custom UI quanh Polaris trong admin của Joy, nên ưu tiên CSS tĩnh thay vì inline style động.
