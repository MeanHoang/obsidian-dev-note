# 🏗️ System Design — 2026-09-25

> Hôm nay nổi bật về reliability: Uber chặn "retry storm" bằng cơ chế **error ownership** và lập bản đồ dependency fail-close cho service mesh. Cloudflare công bố postmortem một lỗ hổng rò dữ liệu giữa các tenant, bài học trực tiếp cho app multi-tenant như Joy.

## ⭐ [How Uber Protects Against Retry Storms](https://www.uber.com/us/en/blog/protecting-against-retry-storms/) — (Uber Engineering, 17/09/2026)
**Đây là gì:** Case study về reliability. **Retry storm** là khi mỗi tầng trong chuỗi gọi service đều tự retry request lỗi, khiến lượng request dồn xuống service đang yếu tăng theo cấp số nhân và làm nó càng khó hồi phục. Uber giải quyết bằng **error ownership**: chỉ service *gây ra* lỗi mới cho caller trực tiếp của nó retry. Các service chỉ *chuyển tiếp* lỗi lên trên thì đánh dấu lỗi đó là "đã xử lý", để các tầng xa hơn không retry lại lần nữa.
**Chi tiết:**
- Mức khuếch đại: với chuỗi gọi 7 node, node D lỗi và mỗi service retry 1 lần thì D phải nhận gấp **8×** số request. Có retry budget giới hạn 10% thì vẫn còn **1.33×**, vẫn gây hại khi hệ thống đang suy giảm nặng. Gốc vấn đề: "retries are applied uniformly rather than conditionally".
- Cơ chế: nếu một service lỗi *vì* có outbound call bị lỗi, lỗi đó chỉ là "symptom". Nếu service lỗi mà không có outbound call nào hỏng, service đó là "owner". Quyền sở hữu lỗi được truyền đi qua HTTP header `x-uber-error-claim`, và chỉ lỗi "claimed" mới được caller retry.
- Toàn bộ logic nằm ở tầng hạ tầng dùng chung (retry middleware + Service Dependency Analysis Solution), nên các service được bảo vệ mà không phải tự viết logic xử lý lỗi riêng.
- Kết quả trong sự cố Core Entity ngày 18/11/2025 (lan qua hơn 5 tầng call chain): chặn được **9,5 triệu request thừa**. Bán kính retry storm tối đa giảm từ 25 xuống 3, trung bình từ 20 xuống 2. Nếu không có cơ chế này, service đang yếu sẽ phải nhận thêm **46–135%** traffic.
- Trade-off: nếu mất context propagation, node đầu tiên thấy thiếu header sẽ bỏ claim lỗi, nên có thể chặn nhầm retry hợp lệ. Lỗi trùng thời điểm ở các dependency fail-open không liên quan có thể bị quy sai chủ, chiếm khoảng 2% trong các kịch bản xấu nhất.
**Vì sao đáng đọc:** Joy có chuỗi gọi Shopify webhook → Cloud Run/Functions → Admin API → Firestore, và tầng nào cũng có thể retry (Shopify retry webhook, Cloud Tasks/PubSub retry, code tự retry). Bài này giúp soát lại: tầng nào thật sự nên retry, và nên tránh retry chồng retry khi Shopify API trả 429/5xx.

## ⭐ [How Cloudflare addressed a cross-tenant data exposure vulnerability in Containers](https://blog.cloudflare.com/containers-cross-tenant-vulnerability/) — (Cloudflare Blog, 24/09/2026)
**Đây là gì:** Postmortem về **multi-tenant isolation**, tức việc bảo đảm dữ liệu của khách hàng này không lộ sang khách hàng khác dù cùng chạy trên hạ tầng dùng chung. Lỗi nằm ở tầng storage của Cloudflare Containers.
**Chi tiết:**
- Root cause: storage dùng Linux **dm-thin** (thin provisioning, chỉ cấp phát ổ đĩa vật lý khi có ghi) với block 64 KiB, và bật `skip_block_zeroing`, nên block mới cấp phát không được xóa trắng trước khi tái sử dụng.
- Cách khai thác: ghi 4 KiB vào vùng chưa map sẽ kích hoạt cấp phát nguyên block 64 KiB. Chỉ 4 KiB bị ghi đè, còn **60 KiB vẫn giữ dữ liệu của tenant trước**.
- Timeline: Oren Yomtov (Accomplish) báo lỗi lúc 15:26 UTC ngày 4/9. Fix được merge lúc 21:27 UTC cùng ngày, rollout xong ngày 7/9, dọn dẹp toàn fleet xong ngày 19/9.
- Khắc phục: bỏ `skip_block_zeroing`, thu hồi toàn bộ disk container tạo trước khi vá cùng các image snapshot đã cache, drain host vào giờ thấp điểm, rồi tạo lại disk với vùng cấp phát đã zero.
- Bài học: chỉ **một tham số cấu hình** đã đủ vô hiệu hóa một lớp cách ly. Sửa đúng cách không dừng ở đổi config mà còn phải dọn các artifact có thể đã bị nhiễm.
**Vì sao đáng đọc:** Joy lưu dữ liệu của hàng nghìn shop trên chung Firestore/BigQuery. Bài này là lời nhắc kiểm tra lại mọi đường đọc/ghi đã luôn scope theo `shopId`, và cache, bucket, file export tạm có bị "tái sử dụng" giữa các shop hay không.

## [Large-Scale Automated Dependency Analysis Across Uber's Service Mesh](https://www.uber.com/us/en/blog/automated-dependency-analysis/) — (Uber Engineering, 15/09/2026)
**Đây là gì:** Hệ thống tự động phân loại dependency giữa các service thành **fail-close** (hard dependency: callee lỗi thì caller chắc chắn lỗi theo) và **fail-open** (soft dependency: callee lỗi nhưng caller vẫn trả kết quả, lỗi dừng lại ở đó). Uber dùng metrics thay cho distributed tracing. Lý do: với tỉ lệ sampling 0,01% và availability 99,9%, phải mất khoảng 5,5 giờ mới bắt được một request lỗi qua tracing. Chỉ cần 10 mẫu lỗi giống nhau là đủ xác lập quan hệ nhân quả (Pc ≥ 0,8 là fail-close, Pc ≤ 0,2 là fail-open). Đây cũng là nền tảng cho cơ chế error ownership ở bài ⭐ phía trên.
**Vì sao đáng đọc:** Một bài tập nên làm cho Joy: liệt kê dependency nào là fail-close (ví dụ ghi điểm vào Firestore) và cái nào nên là fail-open (ví dụ gửi email, analytics). Khi Klaviyo hay một API phụ sập, luồng cộng điểm của khách không nên sập theo.

## [Halving the Time: How Uber Eats Rebuilt Its Search Pipeline](https://www.uber.com/us/en/blog/uber-eats-search-pipeline/) — (Uber Engineering, 10/09/2026)
**Đây là gì:** Case study tối ưu latency, đạt giảm **50% latency end-to-end**. Có ba kỹ thuật chính:
- **Lazy hydration split**: tách phần lấy dữ liệu ra hai pha. Một pha chỉ lấy tín hiệu cần để ranking, pha kia lấy thuộc tính cần hiển thị. Cách này giảm được hơn 100ms.
- **Xóa false dependency trong DAG**: bỏ những bước đang chờ nhau dù không thực sự cần dữ liệu của nhau, giảm khoảng 35ms.
- **Đổi metric sang ATF (Above-the-Fold)**: đo thời gian đến khi màn hình đầu tiên render xong kèm ảnh, thay vì đo backend response time.
**Vì sao đáng đọc:** Áp dụng thẳng cho widget/loyalty page của Joy: chỉ fetch dữ liệu cần cho màn hình đầu, và dùng `Promise.all` cho các call độc lập thay vì `await` tuần tự. Đồng thời nên đo thời gian khách thật sự nhìn thấy widget, không chỉ latency của API.
