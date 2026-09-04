# 🛒 Shopify — 2026-09-04

> Tuần này changelog dev khá yên: Hydrogen ra bản preview mới, còn phần lớn tin đáng chú ý là các breaking change đang chờ trong API version 2026-10 (release candidate) — thời điểm tốt để test app trước khi bản stable ra mắt.

## ⭐ [Hydrogen developer preview update: September 2, 2026](https://shopify.dev/changelog/hydrogen-developer-preview-update-september-2-2026) — (shopify.dev/changelog, 03/09/2026)
**Đây là gì:** Hydrogen là framework React (chạy trên Remix/React Router) do Shopify làm ra để dựng headless storefront, deploy lên hạ tầng Oxygen của Shopify. "Developer preview" là kênh phát hành sớm để dev thử tính năng trước khi vào bản stable.
**Chi tiết:**
- **Variant links:** link tới product variant giờ trỏ thẳng đến variant cụ thể thay vì rơi về trang product mặc định — khớp với cách Google Shopping feed submit sản phẩm.
- **Cart refresh:** có cơ chế reload lại dữ liệu cart sau khi bạn sửa cart ở phía server, để state client không bị lệch.
- **Local HTTPS certificates:** môi trường dev tự sinh certificate cần cho việc test Customer Account, bỏ bước tự tạo cert thủ công khi test luồng đăng nhập ở local.
- Shopify đánh dấu đây là **API update, "no action required"** — không có deadline, không bắt buộc migrate.
- Ảnh hưởng: chỉ các team đang chạy storefront Hydrogen; store Liquid/theme truyền thống không bị động gì.
**Vì sao đáng đọc:** Joy Loyalty chủ yếu sống trong Admin + theme app extension nên không phải sửa code. Nhưng điểm **cart refresh** đáng ghi nhớ: nếu có merchant dùng Hydrogen và Joy sửa cart phía server (áp discount đổi điểm chẳng hạn), đây chính là API để họ đồng bộ lại cart — hữu ích cho tài liệu hỗ trợ headless.

## ⭐ [Updating an order's shipping address recalculates taxes as of API version 2026-10](https://shopify.dev/changelog/updating-an-orders-shipping-address-returns-accurate-financial-data) — (shopify.dev/changelog, 30/07/2026)
**Đây là gì:** Một breaking change trong Admin API. Trước đây khi bạn đổi shipping address của một order qua API, Shopify lưu địa chỉ mới nhưng **giữ nguyên tiền thuế cũ**, dẫn tới tổng tiền không khớp với nơi giao hàng. Từ version 2026-10 thì thuế được tính lại theo địa chỉ mới.
**Chi tiết:**
- Áp dụng cho **cả GraphQL Admin API và REST Admin API**, chỉ từ version `2026-10` trở đi.
- Chỉ recalculate với order **chưa fulfill**. Order đã fulfill một phần / toàn bộ, hoặc order không đủ điều kiện edit, thì **không** bị tính lại.
- Các version API cũ hơn giữ nguyên hành vi cũ → app pin version cũ chưa bị ảnh hưởng ngay.
- Shopify khuyến nghị: sau khi update địa chỉ, **so sánh balance của order với giá trị trước đó** rồi xử lý trạng thái thanh toán tương ứng — vì tính lại thuế có thể tạo ra khoản dư cần refund hoặc khoản thiếu cần thu thêm.
- Không có deadline cứng, nhưng nó đến cùng bản stable 2026-10 nên là mốc cần canh khi nâng version.
**Vì sao đáng đọc:** Joy Loyalty tính điểm dựa trên giá trị order. Nếu total của order **đổi sau khi đã ghi điểm** (do thuế được tính lại), số điểm đã cộng có thể sai. Cần rà lại logic xử lý `orders/updated` webhook: xem có recalculate điểm khi order total thay đổi không, và quyết định chính sách (tính theo subtotal trước thuế thì an toàn hơn).

## [SubscriptionContractCalculation API now available in early access](https://shopify.dev/changelog/subscription-contract-calculation-api-now-available-in-early-access) — (shopify.dev/changelog, 27/07/2026)
**Đây là gì:** API mới thay thế object `SubscriptionDraft` cũ để sửa subscription contract. Cách cũ cần "hơn chục mutation stateful" theo vòng đời draft chỉ để sửa một contract; cách mới gọn thành 3 bước **calculate → poll → commit**, chạy trên checkout engine hợp nhất (C1) của Shopify nên hỗ trợ được cả bundle và cart transform function. Hiện có trên release candidate `2026-10`. `SubscriptionDraft` sẽ bị deprecate khi API mới GA, kèm migration guide.
**Vì sao đáng đọc:** Joy Loyalty không phải app subscription, nên chưa phải sửa code. Nhưng nếu về sau làm tính năng "reward cho khách subscription" hoặc tích hợp app subscription, đây là API sẽ phải dùng — và biết trước rằng `SubscriptionDraft` sắp hết đời giúp tránh xây trên nền sắp bỏ.

## [The `orderCreate` mutation now supports multiple tracking numbers for each fulfillment](https://shopify.dev/changelog/order-create-fulfillment-tracking-numbers) — (shopify.dev/changelog, 03/08/2026)
**Đây là gì:** Trong API version `2026-10`, `OrderCreateFulfillmentInput` có thêm field `trackingNumbers` (dạng mảng) để gắn nhiều mã vận đơn cho một fulfillment khi import order. Một `trackingCompany` áp cho cả mảng. Nếu truyền cả `trackingNumber` (số ít) lẫn `trackingNumbers` thì bản số ít thắng — giữ backward compatibility.
**Vì sao đáng đọc:** Không phải sửa code ở Joy Loyalty. Nhưng nếu có luồng đọc fulfillment để trigger reward "đơn đã giao", cần biết từ 2026-10 một fulfillment có thể mang nhiều tracking number — parser giả định "một fulfillment = một tracking" sẽ đọc thiếu dữ liệu.

## [Permitted store staff can now see an identified customer's online cart in POS](https://changelog.shopify.com/posts/permitted-store-staff-can-now-see-an-identified-customer-s-online-cart-in-pos) — (changelog.shopify.com, 03/09/2026)
**Đây là gì:** Shopify POS v11.14 cho nhân viên cửa hàng xem các sản phẩm trong abandoned checkout online của khách đã được nhận diện (có email), để hỗ trợ khách hoàn tất mua tại cửa hàng. Cần bật quyền "View abandoned checkouts" trong Settings > Users > Roles. Chỉ hiện sản phẩm trong cart, không hiện lịch sử duyệt web.
**Vì sao đáng đọc:** Không phải sửa code. Đáng chú ý ở góc độ sản phẩm: đây là thêm một điểm chạm online → offline cho cùng một customer profile, củng cố lý do Joy Loyalty phải nhận diện member ở POS chuẩn (POS extension, hiển thị điểm/tier khi nhân viên tra khách) — merchant omnichannel sẽ ngày càng kỳ vọng điều đó.

## [Updated Built for Shopify requirements for Fulfillment services apps](https://shopify.dev/changelog/updated-built-for-shopify-requirements-for-fulfillment-services-apps) — (shopify.dev/changelog, 01/08/2026)
**Đây là gì:** Built for Shopify (BFS) là huy hiệu chất lượng cao nhất trên App Store, xét theo bộ tiêu chí đo được. Shopify chỉnh 3 tiêu chí dành riêng cho app nhóm fulfillment services: tỷ lệ hoàn tất fulfillment order (5.8.2), nới cửa sổ phản hồi + chỉnh tỷ lệ phản hồi fulfillment request (5.8.6), nới cửa sổ phản hồi cancellation request (5.8.7). Shopify ghi rõ "no action is required", thay đổi tự áp vào đánh giá hiện có, không nêu deadline.
**Vì sao đáng đọc:** Joy Loyalty thuộc nhóm loyalty nên **không bị ảnh hưởng trực tiếp** — 3 tiêu chí này chỉ áp cho category fulfillment. Nhưng nó xác nhận Shopify đang tinh chỉnh BFS theo từng category, nên nếu team theo đuổi/giữ huy hiệu BFS thì nên định kỳ soi lại bộ tiêu chí áp cho nhóm mình thay vì coi là bất biến.

## [Oxygen is now available on development stores](https://shopify.dev/changelog/oxygen-is-now-available-on-development-stores) — (shopify.dev/changelog, 03/08/2026)
**Đây là gì:** Oxygen là hosting do Shopify vận hành dành riêng cho storefront Hydrogen. Trước đây muốn deploy lên Oxygen phải có store trả phí; giờ deploy được từ development store. Lưu ý: dev store không có public environment, nên URL deploy đòi hỏi phải đăng nhập store mới xem được.
**Vì sao đáng đọc:** Không phải sửa code. Giá trị là ở khâu test: nếu cần dựng một storefront Hydrogen thật để kiểm thử widget/theme extension của Joy trên môi trường headless, giờ làm được trên dev store miễn phí thay vì phải mở store trả phí.
