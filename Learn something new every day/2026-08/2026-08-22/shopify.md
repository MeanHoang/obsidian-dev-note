# 🛒 Shopify — 2026-08-22

> Changelog tuần này của Shopify đã được điểm hết ở các note trước, nên hôm nay đào ngược lại các mục còn "nợ" nhưng cực sát Joy Loyalty: migration sang Shopify App Pricing, loạt breaking change của API version **2026-10**, Metaobject API gọn hơn, và deadline Polaris web components 01/10/2026.

## ⭐ [Prepare your app for migration to Shopify App Pricing](https://shopify.dev/changelog/prepare-your-app-for-migration-to-shopify-app-pricing) — (shopify.dev/changelog, 07/07/2026)

**Đây là gì:** Từ trước tới nay app tính tiền merchant qua **Billing API** — mỗi app tự khai plan, tự tạo `appSubscriptionCreate`, tự quản lý trial/upgrade. **Shopify App Pricing** là mô hình mới: bạn khai báo pricing plan ngay trong Partner Dashboard, còn Shopify lo phần hiển thị trên App Store listing, màn hình chọn plan, quản lý subscription và billing cho merchant. Changelog này thông báo **công cụ migration (phase 1)** đã mở để chuẩn bị chuyển từ Billing API sang App Pricing.

**Chi tiết:**
- Công cụ nằm ở mục **Pricing Details** trong Partner Dashboard; nó **tự sinh draft pricing plan** từ các plan bạn đang khai thủ công.
- Quy trình 4 bước: mở Pricing Details → generate draft plan → review/edit → **test trên development store** trước khi apply.
- Các field có badge **"Action needed"** là chỗ tool không map tự động được (thường là plan có logic usage/tier lạ) — phải sửa tay.
- **Đây mới là phase 1: chỉ generate + test plan.** Việc **migrate các subscription đang chạy** của merchant hiện hữu nằm ở release sau; muốn thử trước thì đăng ký early access qua form trong bài.
- Changelog **không nêu deadline bắt buộc** — hiện là voluntary, nhưng nên chuẩn bị sớm vì phase 2 mới là phần rủi ro (đụng vào subscription đang thu tiền).

**Vì sao đáng đọc:** Joy Loyalty là public app có nhiều tier (Free/Starter/Pro/…) đang chạy trên Billing API — nghĩa là toàn bộ logic `appSubscriptionCreate`, trial days, và màn hình pricing tự build trong React + Polaris sẽ có ngày bị thay bằng flow của Shopify. Chạy tool generate draft plan trên dev store **ngay bây giờ** để biết plan nào bị "Action needed" (nhiều khả năng là các plan usage-based hoặc plan legacy grandfather của merchant cũ) là việc rẻ nhất có thể làm trước khi phase 2 đụng vào subscription thật.

## ⭐ [Customer Account API: `Customer.lastIncompleteCheckout` và các type `Checkout` bị xoá ở 2026-10](https://shopify.dev/changelog/customer-account-api-last-incomplete-checkout-and-checkout-types-removed) — (shopify.dev/changelog, 06/07/2026)

**Đây là gì:** **Customer Account API** là GraphQL API mà app dùng để đọc/ghi dữ liệu của chính khách hàng đang đăng nhập trên storefront (trang tài khoản, lịch sử đơn, địa chỉ…). Field `Customer.lastIncompleteCheckout` trả về checkout dở dang gần nhất của khách — field này đã deprecated và nay bị **xoá hẳn** ở API version **2026-10**.

**Chi tiết:**
- Bị xoá không chỉ mỗi field: kéo theo cả type `Checkout` và các type phụ thuộc **`AppliedGiftCard`**, **`CheckoutLineItem`**, **`ShippingRate`**.
- **Đây là breaking change**, không có replacement field trong Customer Account API. Query cũ sẽ fail validation ngay khi bump version.
- Thay thế: cần giỏ hàng/checkout đang mở → dùng **cart flow của Storefront API**; cần lịch sử mua hàng → dùng **`Customer.orders`**.
- Cần làm: grep toàn bộ query Customer Account API tìm `lastIncompleteCheckout` / `AppliedGiftCard` và sửa **trước khi** nâng lên 2026-10.

**Vì sao đáng đọc:** App loyalty rất hay đọc `AppliedGiftCard` để biết khách đã áp reward/gift card vào checkout chưa, và đọc checkout dở dang để làm abandoned-cart reward nudge. Nếu Joy Loyalty có extension customer account nào chạm vào mấy type này thì phải viết lại theo hướng Storefront API cart + `Customer.orders` trước khi bump version — bump mù sẽ vỡ trang tài khoản của merchant.

## [Streamlined Metaobject API — thêm property `values`](https://shopify.dev/changelog/streamlined-metaobject-api) — (shopify.dev/changelog, 11/06/2026)

**Đây là gì:** **Metaobject** là "bảng dữ liệu tự định nghĩa" của Shopify (khác metafield ở chỗ nó là record độc lập, không gắn vào product/customer). Trước đây đọc metaobject phải duyệt mảng `fields` rồi tự `JSON.parse` từng field theo type. API version **2026-07** thêm property **`values`** trả về nguyên object JSON.

**Vì sao đáng đọc:** Joy Loyalty thường lưu cấu hình chương trình (tier, rule earn/redeem, campaign) dưới dạng metaobject. `values` bỏ được cả tầng helper deserialize thủ công trong code JS, và ở phía mutation nó nhận thẳng object JS — đổi lại nhớ rằng **field optional bị bỏ trống sẽ bị clear**, khác hẳn hành vi patch của `fields` cũ. Non-breaking, `field`/`fields` vẫn còn.

## [Cập nhật shipping address của order sẽ tự tính lại thuế từ API version 2026-10](https://shopify.dev/changelog/updating-an-orders-shipping-address-returns-accurate-financial-data) — (shopify.dev/changelog, 30/07/2026)

**Đây là gì:** Trước đây đổi địa chỉ giao hàng trên một order chưa fulfill thì Shopify chỉ đổi địa chỉ, **giữ nguyên thuế đã tính** — dẫn tới tổng tiền lệch so với địa điểm giao thật. Từ **2026-10**, thuế được tính lại tự động theo địa chỉ mới, áp dụng cho cả GraphQL lẫn REST Admin API.

**Vì sao đáng đọc:** Điểm nguy hiểm là bài viết nói rõ thay đổi này **có thể tạo chênh lệch số dư trên order đã thanh toán**, merchant phải gửi invoice hoặc refund bù. Nếu Joy Loyalty tính điểm thưởng theo tổng tiền order (`currentTotalPriceSet` hay tương đương), tổng đó giờ có thể đổi sau khi order đã tạo → logic cộng điểm cần dựa trên số liệu tại thời điểm chốt, hoặc lắng nghe `orders/updated` để reconcile. Thuế được skip khi order đã fulfill một phần/toàn phần.

## [Storefront API `@inContext` hỗ trợ `channelId`](https://shopify.dev/changelog/new-channelid-argument-for-incontext-directive-in-storefront-api-2026-10) — (shopify.dev/changelog, 15/07/2026)

**Đây là gì:** `@inContext` là directive của Storefront API dùng để đặt "ngữ cảnh" cho query (country, language…) để nhận đúng giá và tồn kho. Storefront API **2026-10** thêm argument **`channelId`** — áp ngữ cảnh của một sales channel cụ thể vào query.

**Vì sao đáng đọc:** Cho phép lấy đúng giá/availability theo từng channel mà không phải tự viết logic mapping. Lưu ý ràng buộc: chỉ dùng được **channel ID thuộc chính API client của mình**, và nếu không truyền thì mặc định lấy channel đầu tiên mà client sở hữu — với Joy Loyalty, nó quan trọng khi tính reward theo giá hiển thị ở storefront thay vì giá gốc.

## [Shopify AI Toolkit để nâng extension lên Polaris web components](https://shopify.dev/changelog/shopify-ai-toolkit-for-upgrading-extensions-to-polaris-web-components) — (shopify.dev/changelog, 11/06/2026)

**Đây là gì:** **Polaris web components** là thế hệ mới của design system Shopify — dùng custom element chuẩn web thay cho component React cũ, render nhanh hơn trong checkout/customer account. Shopify phát hành một **AI Toolkit** để AI coding agent tự migrate extension lên API version mới.

**Vì sao đáng đọc:** Deadline cứng: **sau 01/10/2026, app có extension chạy trên API version 2025-07 trở về trước sẽ không update được nữa** — phải lên **2025-10 hoặc mới hơn**, và version đó mặc định dùng Polaris web components. Nếu Joy Loyalty còn checkout UI extension hoặc customer account extension pin ở version cũ thì đây là việc phải xong trong ~6 tuần tới, không phải nice-to-have.

## [Build App Home as a UI extension](https://shopify.dev/changelog/build-app-home-as-a-ui-extension) — (shopify.dev/changelog, 01/06/2026)

**Đây là gì:** Bình thường trang chính của app trong Shopify Admin ("App Home") là một web app do bạn tự host, nhúng qua iframe. Từ API version **2026-07**, app **custom-distribution** có thể build App Home thành **UI extension do Shopify host**, dùng target `admin.app.home.render` với Preact + Polaris.

**Vì sao đáng đọc:** Không áp dụng trực tiếp cho Joy Loyalty (đây là public app, và Shopify vẫn khuyến nghị giữ iframe cho app có server-side logic), nhưng đáng biết vì bundle limit rất chặt — **64 KB nén** — cho thấy hướng Shopify đang đẩy: dashboard nhẹ chạy hẳn trong admin, không round-trip về server. Hữu ích nếu team làm custom app riêng cho merchant Plus.
