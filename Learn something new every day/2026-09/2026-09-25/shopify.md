# 🛒 Shopify — 2026-09-25

> Polaris 2.0 RC ra mắt, kèm hạn chót Built for Shopify; UI extensions phải lên API 2026-01 trước 01/10/2026; Events đổi payload; Discounts Allocator bị khai tử.

## ⭐ [Polaris 2.0 release candidate](https://shopify.dev/changelog/polaris-2-0-release-candidate) — (shopify.dev changelog, 24/09/2026)
**Đây là gì:** Polaris là design system (bộ UI component) chính thức của Shopify để app trông giống giao diện Shopify admin. Bản mới phát qua CDN dưới dạng **Polaris Web Components** (custom element HTML chuẩn, không phụ thuộc React). 2.0 RC là bản release candidate của major version tiếp theo, đi cùng giao diện admin mới.
**Chi tiết:**
- Khi app dùng `polaris-2.0-rc.js` trong Shopify admin, Polaris Web Components sẽ tự khớp với visual design hiện tại của store đó. URL CDN: `https://cdn.shopify.com/shopifycloud/polaris-2.0-rc.js`.
- Không tự nâng cấp: app đang dùng `polaris-1.js` hoặc URL cũ `polaris.js` sẽ không tự lên Polaris 2.0 — phải đổi URL chủ động.
- Admin UI extensions và App Home UI extensions được cập nhật tự động; phần cần tự làm là giao diện App Home (embedded app).
- App còn dùng **Polaris React** phải migrate sang Polaris Web Components trước (có migration guide); nên test trên store có cả giao diện admin cũ và mới; dùng CSS variable `--shopify-safe-area-inset-bottom` cho nội dung fixed/sticky ở đáy.
- **Hạn chót 01/05/2027**: app Built for Shopify phải cập nhật giao diện App Home embedded.
**Vì sao đáng đọc:** Admin của Joy Loyalty đang viết bằng React + Polaris, nên muốn giữ badge Built for Shopify thì phải lên kế hoạch migrate sang Web Components rồi mới lên 2.0 trước 01/05/2027. Việc này nên đưa vào roadmap từ Q4.

## ⭐ [Request a bundle size exception for existing UI extensions](https://shopify.dev/changelog/request-a-bundle-size-exception-for-existing-ui-extensions) — (shopify.dev changelog, 17/09/2026)
**Đây là gì:** UI extension là phần code của app chạy ngay trong giao diện Shopify (checkout, customer account, admin, POS). Shopify giới hạn dung lượng JS bundle để trang tải nhanh, và bây giờ cho phép app đang có extension xin nới giới hạn này.
**Chi tiết:**
- Giới hạn chuẩn là 64 KB JS bundle đã nén cho mỗi extension. Full page customer account extension được tối đa 128 KB.
- Áp dụng cho Admin, Checkout UI, Customer Accounts và POS extensions dùng API version 2025-10 trở lên.
- Cách xin: chạy `shopify app build`, sau đó nộp minified bundle cùng esbuild metafile qua form xin ngoại lệ.
- Shopify sẽ từ chối nếu phần nặng là tránh được, ví dụ thư viện nặng, dependency bị trùng hoặc translation bị bundle vào.
- **Deadline 01/10/2026**: để app còn deploy được, mọi UI extension đang có phải dùng API version 2026-01 trở lên.
**Vì sao đáng đọc:** Joy có checkout UI extension và customer account extension (widget điểm, reward). Cần kiểm tra ngay API version trong các `shopify.extension.toml` trước 01/10, đo lại size bundle và bỏ các thư viện nặng nếu vượt 64 KB.

## [Updates to Events payloads and subscription configuration](https://shopify.dev/changelog/updates-to-events-payloads-and-subscription-configuration) — (shopify.dev changelog, 16/09/2026)
**Đây là gì:** Shopify Events là cơ chế subscription sự kiện thế hệ mới (bên cạnh webhooks). App khai báo trong `shopify.app.toml` và nhận thông báo khi resource thay đổi, có thể lọc theo field bằng trigger.
**Chi tiết:**
- `fields_changed` đổi từ mảng phẳng thành object gồm 3 mảng: `added`, `updated`, `removed`.
- Khi subscribe parent path phải ghi wildcard rõ ràng, ví dụ `product.variants.*` thay cho `product.variants`.
- Bỏ 2 header `shopify-event-id` và `shopify-resource-id`.
- Subscription có action `update` phải có ít nhất 1 trigger. Subscription cũ vẫn chạy, nhưng phải sửa ở lần deploy `shopify.app.toml` tiếp theo.
**Vì sao đáng đọc:** Nếu Joy đã thử Events (ví dụ theo dõi customer/order để cộng điểm), handler trên Cloud Functions/Cloud Run đang đọc `fields_changed` dạng mảng hoặc dùng header `shopify-event-id` để dedupe sẽ bị lỗi. Cần sửa trước lần deploy tới.

## [Discounts Allocator Function API developer preview has ended](https://shopify.dev/changelog/discounts-allocator-function-api-developer-preview-has-ended) — (shopify.dev changelog, 10/09/2026)
**Đây là gì:** Shopify Functions là đoạn code nhỏ (compile sang WebAssembly) do app viết, chạy ngay trên hạ tầng Shopify để tùy biến logic backend như discount, delivery, payment. Discounts Allocator là Function API ở dạng preview, dùng để tự quyết cách phân bổ discount lên các line.
**Vì sao đáng đọc:** API này sẽ không được release. Mutations `discountsAllocatorFunctionRegister`/`Unregister` đã bị gỡ, và app nào còn khai báo target `purchase.discounts-allocator.run` thì `shopify app deploy` sẽ fail toàn bộ app. Joy cần rà lại config (nếu đã từng thử) và dùng Discount Function API cho reward discount của loyalty.

## [Delivery options in Shopify Functions input now expose their metafields](https://shopify.dev/changelog/delivery-options-in-shopify-functions-input-now-expose-their-metafields) — (shopify.dev changelog, 15/09/2026)
**Đây là gì:** Metafield là field dữ liệu tùy biến (namespace + key) gắn vào resource Shopify. Từ API version `2026-10`, input của Shopify Functions có thể gọi `metafield(namespace:, key:)` trên mọi option trong `cart.deliveryGroups.deliveryOptions`, và không cần action gì với function cũ.
**Vì sao đáng đọc:** Nếu Joy làm perk "free shipping cho VIP tier", function có thể đọc metafield trên delivery option để biết option nào đủ điều kiện, thay vì hard-code theo tên/handle của shipping rate.
