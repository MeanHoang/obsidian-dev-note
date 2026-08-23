# 🛒 Shopify — 2026-08-20

> Changelog nửa cuối tháng 8/2026 xoay quanh app intents mở full-page trong Admin, bản Hydrogen developer preview mới, Oxygen mở cho dev store, cùng vài thay đổi Admin API và Built for Shopify.

## ⭐ [App intents on `admin.app.intent.link` now open as a full-page navigation](https://shopify.dev/changelog/app-intents-on-admin-app-intent-link-now-open-as-a-full-page-navigation) — (shopify.dev/changelog, 19/08/2026)

**Đây là gì:** "App intents" là cơ chế để app khai báo các hành động mà Shopify Admin (và AI assistant trong Admin) có thể gọi vào app của bạn. Extension target `admin.app.intent.link` là loại intent trỏ merchant tới một URL trong app. Trước đây intent này mở dưới dạng overlay modal; giờ Shopify đổi thành điều hướng full-page.

**Chi tiết:**
- Intent khai báo trên target `admin.app.intent.link` giờ điều hướng merchant tới URL đã khai báo dưới dạng trải nghiệm full-page, khớp với cách intent native của Admin hoạt động.
- Thay đổi này "live for all shops, isn't gated by API version, and doesn't require any changes to your extension's configuration" — tức không có cờ API version để opt-out, đã áp dụng cho mọi shop.
- Có cơ chế fallback: nếu merchant đang có công việc chưa lưu (unsaved work), Shopify vẫn giữ kiểu overlay để tránh mất dữ liệu.
- Việc dev cần làm: kiểm tra route render đúng ở full width, xử lý payload invocation qua `shopify.intents.request.value`, đăng ký tool và resolve intent đúng cách; test bằng `shopify app dev` trên development store.
- Phạm vi ảnh hưởng: chỉ app dùng target `admin.app.intent.link`; extension dùng `admin.app.intent.render` không bị ảnh hưởng.

**Vì sao đáng đọc:** Joy Loyalty là embedded app trong Admin — nếu team đã (hoặc đang định) khai báo app intent kiểu link để merchant nhảy nhanh vào màn hình cấu hình loyalty program / customer points, layout giờ là full page chứ không còn là modal hẹp. Các trang Polaris đang thiết kế cho khung modal cần review lại ở full width, và luồng đọc payload phải chuyển sang `shopify.intents.request.value`. Vì thay đổi không gate theo API version nên nó đã có hiệu lực rồi, không chờ upgrade.

## [Hydrogen developer preview update: August 18, 2026](https://shopify.dev/changelog/hydrogen-developer-preview-update-august-18-2026) — (shopify.dev/changelog, 18/08/2026)

**Đây là gì:** Hydrogen là framework React của Shopify để build custom storefront (headless), chạy trên Storefront API. Bản developer preview ngày 18/08 bổ sung 6 nhóm tính năng: cart session attribution (giỏ hàng đồng bộ với customer account session để shopper đã đăng nhập không rơi vào guest checkout), cart attributes (gắn dữ liệu cấp order và cấp line item), standard page view events (mỗi lần navigate đều phát page view giống Liquid theme), Shop Pay button render sẵn trước khi JS chạy, local HTTPS cho Customer Account development, và pluggable logging để forward warning/error sang observability tooling riêng.

**Vì sao đáng đọc:** Hai điểm sát với loyalty app: **cart attributes** là kênh chuẩn để nhét dữ liệu loyalty (points redeem, tier, referral code) vào cart rồi chuyển sang order, và **cart session attribution** đảm bảo shopper đã login được nhận diện đúng tại checkout — điều kiện tiên quyết để cộng/trừ điểm đúng customer. Nếu có merchant Joy Loyalty chạy storefront Hydrogen, đây là nền để tích hợp mà không cần hack localStorage.

## [Oxygen is now available on development stores](https://shopify.dev/changelog/oxygen-is-now-available-on-development-stores) — (shopify.dev/changelog, 03/08/2026)

**Đây là gì:** Oxygen là hạ tầng hosting của Shopify dành riêng cho storefront Hydrogen. Trước đây muốn deploy lên Oxygen phải có subscription trả phí; giờ có thể deploy Hydrogen storefront lên Oxygen từ development store. Lưu ý: dev store không có public environment, nên mọi deployment URL đều yêu cầu xác thực vào store.

**Vì sao đáng đọc:** Giảm rào cản để team Joy Loyalty dựng một storefront Hydrogen thử nghiệm mà không tốn plan trả phí — hữu ích khi cần môi trường thật để test widget loyalty / cart attributes trên headless storefront thay vì chỉ test trên theme Liquid. Nhớ là URL bị khoá sau authentication nên không dùng để demo public cho merchant.

## [The `orderCreate` mutation now supports multiple tracking numbers for each fulfillment](https://shopify.dev/changelog/order-create-fulfillment-tracking-numbers) — (shopify.dev/changelog, 03/08/2026)

**Đây là gì:** `orderCreate` là mutation GraphQL Admin API dùng để import/tạo order. Shopify thêm field `trackingNumbers` (số nhiều) vào `OrderCreateFulfillmentInput`, cho phép gắn nhiều tracking number cùng lúc cho một fulfillment. Giá trị `trackingCompany` áp dụng chung cho toàn bộ mảng, và nếu truyền cả `trackingNumber` (số ít) lẫn `trackingNumbers` thì "the singular value takes precedence". Có từ API version 2026-10, áp dụng cho cả Admin GraphQL API và Admin REST API.

**Vì sao đáng đọc:** Joy Loyalty không tự tạo order, nhưng đây là tín hiệu về shape của `OrderCreateFulfillmentInput` trong 2026-10 — nếu có luồng import order lịch sử để backfill điểm cho merchant mới onboard, cần biết field mới và quy tắc ưu tiên singular/plural để không ghi nhầm dữ liệu fulfillment.

## [Updated Built for Shopify requirements for Fulfillment services apps](https://shopify.dev/changelog/updated-built-for-shopify-requirements-for-fulfillment-services-apps) — (shopify.dev/changelog, 01/08/2026)

**Đây là gì:** Built for Shopify (BFS) là chương trình gắn badge chất lượng cho app trên App Store, đi kèm bộ tiêu chí đo tự động. Shopify nới 3 tiêu chí dành riêng cho app fulfillment service: tỉ lệ hoàn thành fulfillment order được assign, cửa sổ + tỉ lệ phản hồi fulfillment request, và cửa sổ phản hồi cancellation request. Shopify nói thay đổi này giúp tiêu chí "better reflect how fulfillment operations run in practice" và "no action is required" vì tiêu chí được đánh giá tự động.

**Vì sao đáng đọc:** Không áp trực tiếp lên Joy Loyalty (không phải app fulfillment), nhưng đáng theo dõi vì cho thấy Shopify đang tinh chỉnh tiêu chí BFS theo từng category app thay vì một bộ chung. Nếu tiêu chí cho category loyalty/marketing cũng được điều chỉnh theo hướng tương tự, checklist BFS nội bộ của team sẽ cần rà lại theo changelog thay vì tin bản snapshot cũ.

## [Metafield triggers and additional topics are now available for Events](https://shopify.dev/changelog/metafield-triggers-and-additional-topics-are-now-available-for-events) — (shopify.dev/changelog, 21/07/2026)

**Đây là gì:** Events API là thế hệ mới của webhook, cho phép app subscribe thay đổi trên resource. Bản cập nhật này mở subscribe cho Order, Collection, InventoryItem, InventoryShipment, Location, và quan trọng nhất là subscribe **thay đổi metafield** trên Product, Order, Customer, Collection và Location. App khai báo trong `shopify.app.toml`: "Apps can target the fields that matter in `triggers`, query the resource that changed, and avoid subscribing to every resource update." Hỗ trợ cả metafield app-scoped (prefix `$app`) lẫn metafield thường, vẫn giữ nguyên giới hạn quyền truy cập. Events API còn ở version `unstable` trong developer preview; topic chưa hỗ trợ thì vẫn dùng webhook.

**Vì sao đáng đọc:** Đây là thứ đáng giá nhất cho Joy Loyalty trong danh sách này. Điểm thưởng, tier, referral thường lưu ở customer metafield — hiện muốn biết chúng đổi thì phải nghe `customers/update` rồi tự diff, tốn call và tốn xử lý rác. Với metafield trigger, có thể subscribe đúng namespace/key điểm số và bỏ qua mọi update không liên quan, giảm đáng kể lượng event Cloud Run phải xử lý. Vì còn `unstable`, nên prototype trước ở dev store chứ chưa đưa lên production pipeline.
