# 🛒 Shopify — 2026-07-07

> Đợt changelog đầu tháng 7/2026: dọn dẹp Customer Account API (bỏ `lastIncompleteCheckout`), thay đổi field cảnh báo discount draft order, thêm metafields cho inventory transfer, và market-driven shipping vào feature preview.

## ⭐ [Customer Account API: `Customer.lastIncompleteCheckout` và các type Checkout bị gỡ ở 2026-10](https://shopify.dev/changelog/customer-account-api-last-incomplete-checkout-and-checkout-types-removed) — (shopify.dev/changelog)
**Đây là gì:** Từ Customer Account API version 2026-10, Shopify gỡ hẳn field `Customer.lastIncompleteCheckout` cùng cả nhánh type `Checkout` (gồm `AppliedGiftCard`, `AvailableShippingRates`, `CheckoutLineItem`, `ShippingRate`). Customer Account API là API dùng trong customer account UI extensions — nơi khách đăng nhập xem đơn hàng, quản lý tài khoản.
**Chi tiết:**
- Đăng ngày 6/7/2026, áp dụng ở version **2026-10**.
- Thay thế: với giỏ/checkout đang hoạt động → dùng **Storefront API cart flows**; với lịch sử mua → dùng field `Customer.orders`.
- **Action required:** phải xóa mọi selection query tới `lastIncompleteCheckout` hoặc field Checkout lồng bên trong *trước khi* nâng lên 2026-10.
- Đây là bước hoàn tất quá trình chuyển checkout sang mô hình cart-based (một phần của Checkout Extensibility).
**Vì sao đáng đọc:** Nếu Joy Loyalty có customer account UI extension (hiển thị điểm, đổi thưởng ngay trong trang tài khoản khách), bất kỳ query nào chạm tới `lastIncompleteCheckout` sẽ vỡ khi bump API version — cần audit query GraphQL Customer Account trước khi lên 2026-10.

## ⭐ [`DraftOrderDiscountNotAppliedWarning.priceRule` bị gỡ ở GraphQL Admin API 2026-10](https://shopify.dev/changelog/remove-pricerule-from-draft-order-discount-warning) — (shopify.dev/changelog)
**Đây là gì:** Field `priceRule` trong object cảnh báo `DraftOrderDiscountNotAppliedWarning` (trả về khi discount không apply được vào draft order) bị loại bỏ khỏi Admin GraphQL API. Object này xuất hiện ở response của các mutation `draftOrderCalculate`, `draftOrderCreate`, `draftOrderUpdate`.
**Chi tiết:**
- Đăng 23/6/2026, hiệu lực 21/7/2026, gỡ hẳn ở version **2026-10**.
- Thay thế: dùng `discountTitle` (thay `priceRule.title`) và `discountCode` (thay dữ liệu discount code lồng trong `priceRule`).
- **Action required:** cập nhật query tham chiếu `priceRule` sang field mới trước khi nâng lên 2026-10.
- Nằm trong xu hướng Shopify khai tử dần khái niệm PriceRule cũ, chuyển toàn bộ sang Discounts API mới.
**Vì sao đáng đọc:** Joy Loyalty tạo discount cho reward (đổi điểm lấy mã giảm giá) — nếu flow có tạo draft order kèm discount và đọc warning để báo lỗi cho merchant, phải chuyển sang `discountTitle`/`discountCode` để không mất thông tin khi lên 2026-10.

## [Định nghĩa và set metafields trực tiếp trên Inventory Transfer (GraphQL Admin API 2026-07)](https://shopify.dev/changelog/define-and-set-metafields-on-inventory-transfers-in-the-admin-graphql-api) — (shopify.dev/changelog)
**Đây là gì:** Từ version 2026-07, có thể tạo metafield definition cho inventory transfer qua `MetafieldOwnerType.TRANSFER` và gán metafield ngay trong lúc tạo/sửa transfer, thay vì gọi `metafieldsSet` riêng.
**Vì sao đáng đọc:** Không trực tiếp cho loyalty, nhưng là ví dụ điển hình về pattern Shopify đang mở rộng — set metafield inline ngay trong mutation tạo resource; cùng tư duy này áp dụng khi Joy Loyalty gắn dữ liệu tùy biến (namespace app-reserved) lên order/customer.

## [Market-driven shipping vào feature preview (Admin GraphQL API 2026-07)](https://shopify.dev/changelog/market-driven-shipping-now-available-in-feature-preview) — (shopify.dev/changelog)
**Đây là gì:** Cấu hình shipping của merchant chuyển từ delivery profile sang gắn trực tiếp vào Markets — merchant đặt rate theo từng market, biến đổi theo điều kiện. Rate do app cung cấp (app delivery profile) vẫn hiển thị song song.
**Chi tiết (timeline):** Preview có ngay; rollout bắt đầu 1/10/2026; migrate toàn bộ merchant xong 1/7/2027. App đọc/tạo/sửa shipping merchant qua delivery profile API cần cập nhật.
**Vì sao đáng đọc:** Joy Loyalty không quản lý shipping, nhưng nếu có tính năng free-shipping reward, cần biết mô hình rate đang dịch chuyển sang Markets — ảnh hưởng cách reward "miễn phí ship" tương tác với rate của merchant.

## [Markets API hỗ trợ `MarketRegionSubdivision` (Admin GraphQL API 2026-07)](https://shopify.dev/changelog/markets-apis-now-support-marketregionsubdivision) — (shopify.dev/changelog)
**Đây là gì:** Admin GraphQL 2026-07 thêm type `MarketRegionSubdivision` cho vùng cấp tỉnh/bang. Nên dùng `market.conditions.regionsCondition.regions` thay cho field `market.regions` đã deprecated. Hiện chỉ hỗ trợ cấu hình shipping; dùng cho discounts/catalog sẽ báo lỗi validation.
**Vì sao đáng đọc:** Nếu về sau Joy Loyalty làm reward theo vùng địa lý, cần lưu ý subdivision hiện chưa dùng được cho discounts — tránh thiết kế logic phụ thuộc vào điều chưa được hỗ trợ.

## [`OrderDisplayFulfillmentStatus` trả về `FULFILLMENT_NOT_REQUIRED` cho đơn không có item cần fulfill (2026-10)](https://shopify.dev/changelog/orderdisplayfulfillmentstatus-now-returns-fulfillmentnotrequired) — (shopify.dev/changelog)
**Đây là gì:** Từ version 2026-10, đơn không còn item cần fulfill (đã hủy/hoàn toàn bộ) trả về giá trị enum mới `FULFILLMENT_NOT_REQUIRED` thay vì `UNFULFILLED` như trước.
**Vì sao đáng đọc:** Joy Loyalty thường cộng/trừ điểm dựa trên trạng thái đơn — nếu code có switch/filter theo `UNFULFILLED` thì cần thêm nhánh xử lý `FULFILLMENT_NOT_REQUIRED`, kẻo phân loại sai đơn hủy/hoàn khi tính điểm.
