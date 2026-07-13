# 🛒 Shopify — 2026-07-06

> Tuần đầu tháng 7 xoay quanh discount/subscription API cho UI extensions (rất sát Joy Loyalty), enforcement purchase-type filtering, cùng deadline lớn Scripts đã tắt (30/6) và Checkout Extensibility (26/8).

## ⭐ [New purchaseType and recurringCycleLimit fields in the discounts API for discount UI extensions](https://shopify.dev/changelog/new-purchasetype-and-recurringcyclelimit-fields-available-in-the-discount-ui-extension-api) — (shopify.dev/changelog)
**Đây là gì:** Discount UI extension (giao diện app nhúng vào trang discount trong Admin) giờ có thêm 2 field để cấu hình discount cho subscription ngay trong extension, thay vì phải gọi GraphQL Admin API riêng.
**Chi tiết:**
- `purchaseType`: chọn discount áp dụng cho one-time purchase, subscription, hay cả hai — set trực tiếp từ UI extension.
- `recurringCycleLimit`: số chu kỳ billing của subscription mà discount còn hiệu lực (`0` = không giới hạn).
- Áp dụng cho cả 2 loại discount app: `DiscountCodeApp` và `DiscountAutomaticApp`.
- Có trong Admin Extensions API version **2026-04**, hiệu lực từ **2027-04-03**.
- Trước đây các lựa chọn này chỉ config được qua GraphQL Admin API, giờ đưa hẳn vào UI extension.
**Vì sao đáng đọc:** Nếu Joy Loyalty phát hành app discount (reward = discount code/automatic), đây là cách chuẩn để merchant tự chọn discount có ăn vào subscription hay không và giới hạn số chu kỳ — quan trọng khi loyalty reward gắn với subscription. Nên chuẩn bị UI extension hỗ trợ 2 field này trước mốc hiệu lực.

## ⭐ [Purchase-type filtering now enforced for app discounts](https://shopify.dev/changelog/purchase-type-filtering-now-enforced-for-app-discounts) — (shopify.dev/changelog)
**Đây là gì:** 2 field `appliesOnSubscription` và `appliesOnOneTimePurchase` trên discount app input trước đây tồn tại nhưng KHÔNG có tác dụng thật; giờ được enforce ở checkout.
**Chi tiết:**
- `appliesOnSubscription` / `appliesOnOneTimePurchase` trên `DiscountCodeAppInput` và `DiscountAutomaticAppInput` giờ thực sự quyết định discount có áp dụng hay không theo loại mua hàng.
- Filtering xảy ra ở **platform level, SAU khi discount function chạy** — các line đã được function target nhưng không khớp purchase type sẽ bị loại bỏ.
- Backward compatible: mọi discount hiện có được tự động update để hỗ trợ cả 2 purchase type → không đổi hành vi discount cũ.
**Vì sao đáng đọc:** Impact trực tiếp lên discount function của Joy Loyalty — nếu app từng dựa vào việc 2 field này "vô hại", giờ hành vi có thể đổi. Cần review lại config discount reward để chắc chắn nó vẫn áp đúng cho one-time vs subscription như mong đợi.

## [WhatsApp marketing consent now available in the Admin API and Customer Account API](https://shopify.dev/changelog/whatsapp-marketing-consent-now-available) — (shopify.dev/changelog)
**Đây là gì:** Quản lý và đọc consent (đồng ý nhận marketing) qua WhatsApp của khách trực tiếp bằng Shopify API.
**Chi tiết:**
- Mutation `customerWhatsAppMarketingConsentUpdate` để cập nhật preference nhận WhatsApp promo.
- Đọc trạng thái qua field `whatsAppMarketingConsent` trên số điện thoại.
- Có ở cả GraphQL Admin API và Customer Account API.
**Vì sao đáng đọc:** Joy Loyalty là retention app — WhatsApp là kênh nhắc reward/point rất mạnh ở nhiều thị trường. Có channel consent chuẩn nghĩa là có thể mở rộng loyalty notification sang WhatsApp mà vẫn tuân thủ consent, thay vì chỉ email/SMS.

## [Payment mandates now expose an id field](https://shopify.dev/changelog/payment-mandates-id-field) — (shopify.dev/changelog)
**Đây là gì:** `PaymentMandateResource` (object đại diện quyền tính tiền định kỳ trên một payment method) giờ có field `id`.
**Chi tiết:**
- `id` mới trùng với `CustomerPaymentMethod.id` tương ứng.
- Giúp xác định payment method nào dùng cho từng mandate scope khi một payment instrument gắn nhiều loại mandate (ví dụ scope `SUBSCRIPTIONS`).
- Có từ API version **2026-07** trở đi.
**Vì sao đáng đọc:** Nếu Joy Loyalty đụng tới reward gắn subscription/recurring billing, việc map chính xác mandate → payment method giúp xử lý các case một khách có nhiều mandate mà không nhầm.

## [Shopify Summer '26 "Everywhere" Editions — 150+ updates, Scripts đã tắt 30/6](https://www.shopify.com/editions) — (shopify.com)
**Đây là gì:** Bản Editions lớn nhất năm (công bố 17/6/2026) với 150+ update, theme "commerce ở mọi nơi", nhấn mạnh AI/agentic commerce.
**Chi tiết:**
- **Legacy Shopify Scripts đã retire hoàn toàn 30/6/2026** — mọi discount/shipping/payment customization còn chạy trên Scripts ngừng hoạt động từ 1/7, phải migrate sang Shopify Functions.
- Universal Commerce Protocol (UCP) bật mặc định trên mọi store để AI shopping agent đọc catalog và dựng cart.
- Native A/B testing và Checkout Components GA trên Plus.
**Vì sao đáng đọc:** Bất kỳ logic loyalty nào của Joy còn dựa trên Scripts (discount tính point/tier) đã chết từ 1/7 — nếu chưa migrate sang Functions thì đây là ưu tiên số 1. UCP nổi lên là hướng cần theo dõi cho khả năng phát hiện reward qua AI agent.

## [Checkout Extensibility: deadline 26/8/2026 cho store không phải Plus](https://shopify.dev/docs/apps/build/checkout) — (shopify.dev)
**Đây là gì:** Store Basic/Shopify/Advanced phải rời `checkout.liquid` + Additional Scripts sang Checkout Extensibility (Checkout UI Extensions + Functions + editor branding).
**Chi tiết:**
- Từ **26/8/2026**, mọi customization `checkout.liquid`, Additional Scripts và order-status script box ngừng chạy.
- Checkout Extensibility là stack 3 lớp: editor (branding) + Checkout UI Extensions (module front-end) + Shopify Functions (logic backend).
- Web Pixels thay cho analytics script cũ.
**Vì sao đáng đọc:** Widget loyalty của Joy hiển thị ở checkout (điểm/reward/redeem) phải chạy dưới dạng Checkout UI Extension trước mốc này; đồng thời đảm bảo merchant khách hàng của Joy trên plan thấp không mất tính năng loyalty ở checkout sau 26/8.
