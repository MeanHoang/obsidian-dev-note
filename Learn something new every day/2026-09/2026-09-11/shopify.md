# 🛒 Shopify — 2026-09-11

> Tuần này Shopify khai tử Discounts Allocator Function API (có deadline gấp 29/09), thêm lệnh quản lý dev store trong CLI 4.8, mở WhatsApp marketing consent ở checkout, và bổ sung cart attributes vào standard storefront events.

## ⭐ [Discounts Allocator Function API developer preview has ended](https://shopify.dev/changelog/discounts-allocator-function-api-developer-preview-has-ended) — (shopify.dev, 10/09/2026)
**Đây là gì:** Discounts Allocator Function là một loại Shopify Function (code chạy trên hạ tầng Shopify, can thiệp vào logic cart/checkout) từng cho phép app tự quyết định discount được phân bổ như thế nào trên từng cart line. Shopify vừa đóng developer preview và **gỡ hẳn API này**, không release stable.

**Chi tiết:**
- Ngày hiệu lực: **29/09/2026**. Sau mốc này API biến mất, không có bản stable.
- Hai mutation `discountsAllocatorFunctionRegister` và `discountsAllocatorFunctionUnregister` bị xoá khỏi Admin GraphQL API phiên bản `unstable`.
- Mọi function đã đăng ký sẽ **tự động bị unregister**; docs và tutorial trên shopify.dev cũng gỡ luôn.
- **Breaking nguy hiểm:** nếu app vẫn khai báo extension target `purchase.discounts-allocator.run` trong config thì `shopify app deploy` **fail cho TOÀN BỘ app**, lỗi `API not found for target: purchase.discounts-allocator.run`. Phải xoá extension đó khỏi config.
- Lý do Shopify đưa ra: native control về cách discount áp dụng đã tốt hơn, bao gồm **stacking nhiều product discount trên cùng một line**. Đường migrate chính thức là dùng Discount Function API tiêu chuẩn.

**Vì sao đáng đọc:** Joy Loyalty phát sinh discount từ điểm/tier/reward — nếu team từng thử nghiệm allocator function để kiểm soát thứ tự cộng dồn discount, phải gỡ target ngay kẻo deploy chết cả app; đồng thời tin "stacking multiple product discounts on same line" đã native là cơ hội bỏ bớt workaround trong reward engine.

## [Create and delete dev stores in Shopify CLI](https://shopify.dev/changelog/create-and-delete-dev-stores-in-shopify-cli) — (shopify.dev, 09/09/2026)
**Đây là gì:** Shopify CLI 4.8 thêm nhóm lệnh `shopify store` để tạo/xoá/liệt kê development store ngay từ terminal: `shopify store create dev`, `shopify store delete` (cần quyền owner hoặc admin), `shopify store list`, `shopify store info`.

**Chi tiết đáng lưu ý:** Shopify áp **giới hạn 250 dev store mỗi organization** (không tính client transfer store và collaborator store); org đang vượt hạn mức được gia hạn tạm thời. Shopify gợi ý script cleanup dựa trên `shopify store list`.

**Vì sao đáng đọc:** Joy Loyalty test nhiều kịch bản loyalty (tier, referral, POS, multi-currency) trên nhiều store riêng — giờ có thể script tạo/huỷ store trong CI thay vì bấm tay, nhưng phải rà lại xem org đã gần chạm trần 250 store chưa.

## [Collect WhatsApp marketing consent at checkout](https://changelog.shopify.com/posts/collect-whatsapp-marketing-consent-at-checkout) — (changelog.shopify.com, 10/09/2026)
**Đây là gì:** Merchant có thể bật thu thập opt-in marketing qua WhatsApp ngay trong checkout, cấu hình trong Checkout settings. Theo Shopify, tính năng này "capture opt-ins when customers make a purchase, expanding your subscriber list and helping you convert new leads through WhatsApp".

**Vì sao đáng đọc:** Đây là một kênh consent mới song song email/SMS — Joy Loyalty nên theo dõi xem consent state này có expose qua Customer API / customer marketing consent field không, vì các flow "tặng điểm khi subscribe" của app hiện chỉ bám email/SMS.

## [Standard storefront events and actions now support cart attributes](https://shopify.dev/changelog/events-and-actions-cart-attributes-support) — (shopify.dev, 06/08/2026)
**Đây là gì:** Standard storefront events/actions là lớp API chuẩn hoá để app và theme cùng đọc/ghi trạng thái cart trên storefront mà không phải gọi thẳng Storefront API. Bản cập nhật này đưa **cart attributes** vào lớp đó.

**Chi tiết đáng lưu ý:** Có event mới `shopify:cart:attributes-update` bắn ra khi attributes đổi — bất kể do app của bạn, theme, hay app khác gây ra; action `updateCart` giờ xử lý luôn attributes. Event trả về **toàn bộ set attributes mới cộng một promise cho kết quả**, cho phép cập nhật UI ngay và rollback nếu thất bại.

**Vì sao đáng đọc:** Joy Loyalty hay nhét state vào cart attributes (điểm redeem, reward code đang áp dụng) — giờ có thể nghe event thay vì polling, và tránh tình trạng app khác ghi đè attributes mà mình không biết.

## [Build Shopify apps in PHP and Python with new official packages](https://shopify.dev/changelog/build-shopify-apps-in-php-and-python-with-new-official-packages) — (shopify.dev, 26/08/2026)
**Đây là gì:** Shopify phát hành hai package chính thức open-source đạt v1.0 GA: `shopify/shopify-app-php` (Packagist) và `shopifyapp` (PyPI). Chúng cung cấp "framework-agnostic primitives": verify request (webhooks, App Home, App Bridge, checkout, POS, extension), token exchange kèm client credentials và refresh, và Admin GraphQL client có auto-retry. Thư viện cũ `shopify-api-php` và `shopify_python_api` bị deprecated (vẫn chạy nhưng không có tính năng/security update mới).

**Vì sao đáng đọc:** Stack Joy Loyalty là JS thuần nên không ảnh hưởng trực tiếp, nhưng bộ primitive này là tài liệu tham chiếu tốt về cách Shopify *chuẩn hoá* verify request và retry GraphQL — đối chiếu được với helper tự viết của app.

## [Meta is now an AI channel in your admin](https://changelog.shopify.com/posts/meta-is-now-an-ai-channel-in-your-admin) — (changelog.shopify.com, 08/09/2026)
**Đây là gì:** Meta xuất hiện như một AI channel trong mục Agentic Storefronts của Shopify admin. Theo changelog: "Your products are shared with Meta by default through Shopify Catalog". Merchant chỉnh được quyền truy cập cho Catalog lẫn direct checkout và xem performance trong agentic settings.

**Vì sao đáng đọc:** Đơn hàng phát sinh từ agentic channel vẫn là order trong Admin API — Joy Loyalty cần xác nhận các order này có `sourceName`/channel riêng không, để quyết định có cộng điểm loyalty cho chúng hay loại trừ.
