# 🛒 Shopify — 2026-07-02

> API version 2026-07 vừa lên changelog với loạt cập nhật quan trọng: gift card, metafields trong Functions, metaobject, marketing engagements — nhiều thứ chạm trực tiếp tới loyalty/retention.

## ⭐ [Shop User metafields đọc được trong Shopify Functions](https://shopify.dev/changelog/shop-user-metafields-in-shopify-functions) — (shopify.dev/changelog)
**Đây là gì:** Từ API 2026-07, Functions có thể đọc metafields gắn trên Shop User (buyer identity xuyên merchant của Shopify) ngay trong luồng checkout, cho phép cá nhân hóa theo từng buyer.
**Chi tiết:**
- Phạm vi: đọc metafields của Shop User trong các checkout operations chạy bằng Functions.
- Áp dụng từ API version 2026-07 trở lên.
- Dựa trên cross-merchant buyer identity của Shopify — dữ liệu buyer có thể mang tính xuyên nền tảng.
- Changelog chưa liệt kê cụ thể metafields nào truy cập được; chi tiết nằm trong Shop User metafields guide.
- Không nói rõ giới hạn đọc — cần đọc guide trước khi tích hợp.
**Vì sao đáng đọc:** Đây là mảnh ghép quý cho Joy Loyalty: một Discount Function có thể đọc trực tiếp hạng thành viên / điểm / trạng thái VIP lưu trên buyer để quyết định ưu đãi ngay tại checkout, thay vì phải nhét mọi thứ vào cart attributes hay gọi API ngoài.

## ⭐ [GiftCard object có thêm field `lineItem`](https://shopify.dev/changelog/new-lineitem-field-on-the-giftcard-graphql-object) — (shopify.dev/changelog)
**Đây là gì:** Object `GiftCard` trong Admin GraphQL API nay có field `lineItem` trỏ về line item của order đã tạo ra gift card đó.
**Chi tiết:**
- `lineItem` trả về `LineItem` từ order khởi tạo gift card.
- Có từ Admin GraphQL API version 2026-07.
- Gift card issue thủ công (không từ order) → field trả `null`.
- Chỉ gift card sinh từ order của khách mới có dữ liệu line item.
- Use case: truy vết gift card về đúng order/line item gốc để báo cáo và đối soát.
**Vì sao đáng đọc:** Joy Loyalty thường phát gift card làm phần thưởng; giờ có thể phân biệt gift card sinh từ đơn mua thật với gift card issue thủ công (reward), phục vụ analytics và chống lạm dụng chính xác hơn.

## [Deprecation cumulative marketing engagements](https://shopify.dev/changelog/deprecation-of-cumulative-marketing-engagements) — (shopify.dev/changelog)
**Đây là gì:** Argument `isCumulative` trong mutation `marketingEngagementCreate` bị deprecate, mặc định về `false` (engagement không cộng dồn).
**Vì sao đáng đọc:** Nếu Joy Loyalty ghi nhận marketing engagement (email/campaign retention) qua API này, cần rà lại code để không phụ thuộc hành vi cộng dồn cũ, tránh sai lệch số liệu.

## [Streamlined Metaobject API](https://shopify.dev/changelog/streamlined-metaobject-api) — (shopify.dev/changelog)
**Đây là gì:** Metaobject API có thêm property `values` giúp đọc/ghi metaobject gọn hơn, tự động convert JSON.
**Vì sao đáng đọc:** Nhiều cấu hình loyalty (tier, rule thưởng, campaign) hay lưu dưới dạng metaobject; property `values` cắt bớt boilerplate parse/serialize JSON trong JS thuần, code Firebase functions gọn hơn.

## [Shopify AI Toolkit hỗ trợ nâng cấp extension lên Polaris web components](https://shopify.dev/changelog/shopify-ai-toolkit-for-upgrading-extensions-to-polaris-web-components) — (shopify.dev/changelog)
**Đây là gì:** Bộ toolkit AI hỗ trợ migrate extension sang Polaris web components, với deadline hoàn tất bắt buộc là 01/10/2026.
**Vì sao đáng đọc:** Các admin/checkout UI extension của Joy Loyalty cần lên lịch migrate trước hạn 01/10/2026; toolkit có thể rút ngắn công sửa tay khá nhiều.

## [Metafields cần definition mới truy cập qua Customer Account API](https://shopify.dev/changelog/metafields-now-require-a-definition-to-be-accessed-through-the-customer-account-api) — (shopify.dev/changelog)
**Đây là gì:** Metafields nay bắt buộc có definition (kèm quyền customer accounts) mới đọc được qua Customer Account API.
**Vì sao đáng đọc:** Nếu Joy Loyalty hiển thị điểm/hạng cho khách qua Customer Account API, phải đảm bảo metafield có definition và quyền phù hợp, nếu không sẽ mất quyền truy cập.
