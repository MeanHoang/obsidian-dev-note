# 🛒 Shopify — 2026-07-03

> API version 2026-07 vừa lên hàng loạt: discount cho draft order trên Customer Account API, order attribution mới, draft order deposit, market-driven shipping — nhiều thứ chạm trực tiếp tới loyalty/discount.

## ⭐ [Discount application info cho draft order trên Customer Account API](https://shopify.dev/changelog/discount-application-information-now-available-for-draft-orders-on-the-customer-account-api) — (shopify.dev/changelog)
**Đây là gì:** Customer Account API là GraphQL API cho phép app đọc/ghi dữ liệu ở phía tài khoản khách (customer-facing, không phải Admin). Trước đây với draft order (đơn nháp), bên Customer Account API bạn không xem được discount nào đang áp và áp ra sao. Nay Shopify thêm field để truy vấn chi tiết đó.
**Chi tiết:**
- API version: GraphQL Customer Account API `2026-07`, hiệu lực 01/07/2026.
- Thêm `discountApplications` trên object `DraftOrder` → liệt kê các discount đang áp cho cả đơn nháp.
- Thêm `discountAllocations` trên `DraftOrderLineItem` → discount được phân bổ xuống từng line item thế nào.
- Query được cả loại discount (code-based hay manual), allocation method, target selection/type, và giá trị (tiền hay %).
**Vì sao đáng đọc:** Joy Loyalty phát discount/reward và cần hiển thị đúng "khách được giảm bao nhiêu, ở dòng nào" ngay trong customer account UI. Với draft order (ví dụ đơn báo giá, đơn B2B), giờ có thể đọc allocation per-line thay vì tự tính lại — giảm sai lệch số tiền reward hiển thị cho khách.

## [`discountedUnitPrice` trên `DraftOrderLineItem` bị deprecate](https://shopify.dev/changelog/discountedunitprice-on-draftorderlineitem-customer-account-api-deprecation) — (shopify.dev/changelog)
**Đây là gì:** Trên Customer Account API, field `discountedUnitPrice` (giá mỗi đơn vị sau giảm) của draft order line item bị thay bằng `approximateDiscountedUnitPrice`.
**Vì sao đáng đọc:** Nếu Joy Loyalty query giá sau giảm để tính điểm/hiển thị, cần đổi sang field mới trước khi field cũ bị gỡ — kiểm tra chỗ nào đang dùng `discountedUnitPrice`.

## [Order attribution definitions cho sales channel app](https://shopify.dev/changelog/order-attribution-definitions-are-available-in-order-channel-filters) — (shopify.dev/changelog)
**Đây là gì:** Cơ chế mới để app gắn "nguồn tạo đơn" chi tiết hơn mức app/channel. Có mutation `orderAttributionDefinitionUpsert`, query `orderAttributionDefinitions`, field `Order.attribution` để đọc nguồn đã resolve, và truyền handle qua `sourceName` khi `orderCreate` (hoặc `source_name` trong Storefront `cartCreate`).
**Chi tiết:** API `2026-07` (hiệu lực 09/06/2026). `Order.channelInformation` vẫn còn nhưng đã deprecated, thay bằng `Order.attribution`.
**Vì sao đáng đọc:** Nếu Joy phân tích đơn theo nguồn (ví dụ đơn phát sinh từ campaign loyalty, referral, redeem link), attribution definitions cho phép gắn nhãn nguồn riêng và đọc lại chính xác thay vì đoán từ channel.

## [Draft order deposit fields lên Admin & Customer Account API](https://shopify.dev/changelog/draft-order-deposit-fields-now-available-in-the-admin-and-customer-account-graphql-apis) — (shopify.dev/changelog)
**Đây là gì:** Thêm field cấu hình đặt cọc/thanh toán một phần (partial payment) cho draft order qua Admin GraphQL; khách xem chi tiết deposit qua Customer Account API. Dành cho merchant Shopify Plus.
**Vì sao đáng đọc:** Nếu Joy tính điểm dựa trên số tiền đơn hàng, đơn có deposit (trả một phần) làm "giá trị đã trả" khác tổng đơn — cần biết field deposit để tính reward đúng thời điểm.

## [Market-driven shipping Admin API (feature preview)](https://shopify.dev/changelog/market-driven-delivery-profiles-admin-api) — (shopify.dev/changelog)
**Đây là gì:** API GraphQL mới để cấu hình shipping rate theo market (thị trường), hỗ trợ nhiều loại rate và carrier. Đi kèm: delivery profile do merchant sở hữu theo kiểu cũ bị deprecate, buộc migrate sang market-driven.
**Vì sao đáng đọc:** Ít chạm trực tiếp Joy Loyalty, nhưng nếu app có feature "free shipping reward" thì kiến trúc shipping/market thay đổi có thể ảnh hưởng cách reward free-ship được áp — theo dõi để không vỡ khi merchant migrate.

## [`BusinessEntity` expose `legalEntityId` trên Admin API](https://shopify.dev/changelog/businessentity-now-exposes-legalentityid-in-the-admin-api) — (shopify.dev/changelog)
**Đây là gì:** Object `BusinessEntity` giờ có `legalEntityId` — ID pháp nhân ổn định xuyên suốt các shop và market, dùng cho tích hợp partner.
**Vì sao đáng đọc:** Nếu Joy làm multi-shop / merchant có nhiều pháp nhân, `legalEntityId` là khóa ổn định để nhóm dữ liệu loyalty theo đúng entity thay vì theo từng shop rời rạc.
