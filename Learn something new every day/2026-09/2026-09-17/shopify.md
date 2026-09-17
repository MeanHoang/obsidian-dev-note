# 🛒 Shopify — 2026-09-17

> Tin nóng nhất là breaking change của Events (webhook thế hệ mới): payload `fields_changed` đổi cấu trúc, trigger phải thêm wildcard, 2 header bị bỏ — app nào subscribe event đều phải sửa.

## ⭐ [Updates to Events payloads and subscription configuration](https://shopify.dev/changelog/updates-to-events-payloads-and-subscription-configuration) — (shopify.dev/changelog, 16/09/2026)
**Đây là gì:** "Events" là hệ thống thông báo thay đổi dữ liệu thế hệ mới của Shopify (kế thừa/mở rộng webhooks), app khai báo subscription trong `shopify.app.toml` và nhận payload khi resource thay đổi. Entry này được Shopify gắn nhãn **Action required**.
**Chi tiết:**
- `fields_changed` không còn là mảng phẳng nữa mà thành object với 3 mảng con: `added`, `updated`, `removed` — để phân biệt được resource/relationship được thêm, giá trị bị đổi, hay bị xoá mà không cần query lại.
- Subscription theo **parent path** giờ phải viết wildcard tường minh với terminal `.*`, ví dụ `product.variants.*`. Trigger ở mức leaf không bị ảnh hưởng, nhưng config cũ phải cập nhật ở lần deploy `shopify.app.toml` tiếp theo.
- Hai header khi delivery bị bỏ: `shopify-event-id` và `shopify-resource-id`. Phải update package API và gỡ code nào đang phụ thuộc vào 2 header này.
- Event subscription có action `update` giờ bắt buộc khai báo ít nhất một trigger.
**Vì sao đáng đọc:** Joy Loyalty sống bằng event `orders/*` và `customers/*` để cộng điểm — nếu handler đang đọc `fields_changed` như một mảng string (kiểu `fieldsChanged.includes('tags')` để detect đổi tag/tier), code sẽ vỡ im lặng sau khi payload đổi shape; và nếu Cloud Function đang dedupe theo header `shopify-event-id` thì phải chuyển sang ID trong body trước khi header biến mất, nếu không sẽ cộng điểm trùng.

## [Filter Catalog search results by media type](https://shopify.dev/changelog/filter-catalog-search-results-by-media-type) — (shopify.dev/changelog, 15/09/2026)
**Đây là gì:** Catalog API là bề mặt dữ liệu sản phẩm dành cho agent/AI client (`search_catalog`, `get_product`, `lookup_catalog`). Nay thêm filter `catalog.filters.media` nhận `image`, `video`, hoặc `model_3d`, và trả kèm URL media asset để client render sản phẩm mà không cần request thứ hai. Muốn lấy video/3D phải khai báo bản draft của `dev.shopify.catalog.global` trong agent profile.
**Vì sao đáng đọc:** Nếu Joy làm reward catalog / gift-with-purchase trong widget, việc lấy được ảnh sản phẩm ngay trong 1 response cắt bớt vòng fetch product media riêng — bớt latency cho widget hiển thị phần thưởng.

## [Variants now support multiple barcodes](https://shopify.dev/changelog/product-variant-barcode-is-being-replaced-by-barcodes) — (shopify.dev/changelog, 08/09/2026)
**Đây là gì:** Một product variant giờ chứa được tối đa 20 barcode (mỗi cái 255 ký tự) với type riêng (UPC, EAN, ISBN, GTIN, ASIN) qua connection `barcodes`; ghi bằng `productSet`, `productVariantsBulkCreate`, `productVariantsBulkUpdate`. Field `barcode` cũ vẫn chạy nhưng đã deprecated và chỉ trả barcode đầu tiên — Shopify cảnh báo integration chỉ đọc `barcode` sẽ không có tín hiệu nào biết là còn barcode khác.
**Vì sao đáng đọc:** Nếu Joy sync product/variant về Firestore để tính earning rule theo sản phẩm hoặc map reward theo SKU/barcode, query cũ vẫn chạy nhưng dữ liệu sẽ thiếu — cần rà lại GraphQL query variant trước khi merchant bắt đầu dùng nhiều barcode.

## [Customer Address APIs now support countryCode](https://shopify.dev/changelog/customer-address-apis-now-support-countrycode) — (shopify.dev/changelog, 08/09/2026)
**Đây là gì:** Customer Account API bản 2026-10 thêm field `countryCode` (ISO 3166-1 alpha-2, ví dụ "US", "CA") cho address input/object; `territoryCode` bị deprecated nhưng vẫn hoạt động. Nếu truyền cả hai thì `countryCode` được ưu tiên.
**Vì sao đáng đọc:** Joy đọc customer data từ Customer Account API cho phần profile/địa chỉ trong loyalty page; khi nâng lên 2026-10 phải đổi field, còn ở version cũ thì chưa cần đụng — nhưng nên ghi vào checklist nâng API version.

## [Shopify storefronts now support UCP 2026-08-25](https://shopify.dev/changelog/08-25-is-now-supported) — (shopify.dev/changelog, 04/09/2026)
**Đây là gì:** UCP (Universal Commerce Protocol) là protocol chuẩn để platform/agent khám phá và thương lượng capability với storefront; Shopify storefront công bố khả năng tương thích qua discovery profile tại `/.well-known/ucp`. Bản `2026-08-25` nay đã được hỗ trợ, integration hiện có không cần đổi gì.
**Vì sao đáng đọc:** Hướng agentic commerce đang thành hạ tầng mặc định của Shopify — về lâu dài đây là kênh mà loyalty (điểm, tier, reward) sẽ phải expose được cho AI agent, đáng theo dõi dù hôm nay chưa phải sửa code.

## [Payouts page redesign: see all your payouts in one view](https://changelog.shopify.com/posts/payouts-page-redesign-see-all-your-payouts-in-one-view) — (changelog.shopify.com, 16/09/2026)
**Đây là gì:** Trang Payouts trong Shopify admin đổi layout: danh sách payout bên trái, chi tiết payout đang chọn hiển thị ngay cạnh, xem được cả payout đã xong lẫn sắp tới theo thứ tự thời gian, chi tiết từng khoản có thể thu gọn, và rõ ràng hơn khi payout gặp trục trặc. Đang rollout dần cho toàn bộ merchant trên web và mobile admin.
**Vì sao đáng đọc:** Đây là tin merchant-facing (không phải API), nhưng là ví dụ mới nhất về nhịp đổi UI của admin — cùng đợt với việc admin đổi diện mạo, nên màn hình app của Joy nhúng trong admin cần trông đồng bộ với style mới.

## [Keep the cart in view on mobile POS](https://changelog.shopify.com/posts/keep-the-cart-in-view-on-mobile-pos) — (changelog.shopify.com, 14/09/2026)
**Đây là gì:** Shopify POS v11.15 thay tab Cart cũ trên điện thoại bằng một nút cart luôn hiển thị: thấy item vừa thêm, số lượng và tổng tiền ở mọi màn hình, một chạm là mở full cart, có thông báo realtime khi cart thay đổi.
**Vì sao đáng đọc:** Nếu Joy có POS UI extension để nhân viên cộng/đổi điểm tại quầy, điều hướng trên mobile POS đã đổi — cần kiểm tra lại flow của extension trên phone chứ không chỉ trên tablet.
