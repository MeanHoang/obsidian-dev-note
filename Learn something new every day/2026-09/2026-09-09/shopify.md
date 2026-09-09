# 🛒 Shopify — 2026-09-09

> Tuần này changelog xoay quanh API version **2026-10**: variant có nhiều barcode, Customer Account API đổi `territoryCode` → `countryCode`, cùng vài update về Events (webhook thế hệ mới), app intents và ShopifyQL.

## ⭐ [Variants now support multiple barcodes](https://shopify.dev/changelog/product-variant-barcode-is-being-replaced-by-barcodes) — (shopify.dev/changelog, 08/09/2026)
**Đây là gì:** Trước giờ mỗi product variant trên Shopify chỉ có đúng **một** field `barcode` (string) để chứa mã vạch. Từ API version **2026-10**, Shopify thay bằng một connection `barcodes` cho phép một variant mang nhiều mã định danh cùng lúc.
**Chi tiết:**
- Mỗi variant giờ chứa được **tối đa 20 barcode, mỗi cái tối đa 255 ký tự**.
- Mỗi barcode có thể khai báo **type**: UPC, EAN, ISBN, GTIN hoặc ASIN — và Shopify **validate** giá trị theo đúng chuẩn đó.
- Field `barcode` cũ bị **deprecate** nhưng vẫn chạy: nó chỉ trả về **barcode đầu tiên**, không có tín hiệu nào cho biết còn barcode khác. Shopify gọi rủi ro này là "potential silent truncation".
- Nguyên văn cảnh báo: *"Once a second barcode is added to a variant, an integration reading only `barcode` sees one of them with no signal that others exist."*
- **Chưa có removal date**. Shopify nói sẽ thông báo trong bài sau, và cho **trọn một API version notice** trước khi xoá field.
- Đối tượng ảnh hưởng: app/integration đồng bộ product identifier sang ERP, marketplace, POS hoặc supplier feed.
**Vì sao đáng đọc:** Joy Loyalty không đọc barcode trực tiếp, nhưng đây là **pattern deprecation điển hình của Shopify** cần nhận diện sớm: một scalar field bị thay bằng connection, field cũ vẫn trả về data "đúng nhưng thiếu". Nếu Joy có bất kỳ chỗ nào map product/variant (earning rule theo sản phẩm, reward là product cụ thể, export dữ liệu variant) thì nên rà GraphQL query xem có đang đọc `barcode` không — và quan trọng hơn là ghi nhớ cơ chế "silent truncation" này khi bump lên 2026-10.

## ⭐ [Customer Address APIs now support countryCode](https://shopify.dev/changelog/customer-address-apis-now-support-countrycode) — (shopify.dev/changelog, 08/09/2026)
**Đây là gì:** Customer Account API (API mà app dùng để đọc/ghi dữ liệu khách hàng khi khách đã đăng nhập ở storefront) bổ sung field `countryCode` cho customer address, thay cho `territoryCode` cũ.
**Chi tiết:**
- `countryCode` nhận **ISO 3166-1 alpha-2** (`US`, `CA`, `VN`…) và là **enum `CountryCode` strongly typed**, không còn là string tự do.
- Áp dụng từ **API version 2026-10**.
- `territoryCode` bị **deprecate nhưng vẫn hoạt động**: *"There is no immediate disruption for existing clients, and no removal version has been announced."*
- Nếu truyền **cả hai field**, `countryCode` **thắng** (takes precedence).
- Việc cần làm khi lên 2026-10: audit lại toàn bộ query/mutation address đang dùng `territoryCode`, đổi sang `countryCode`, rồi test lại create/update/read address.
**Vì sao đáng đọc:** Đây là item ảnh hưởng trực tiếp nhất tới Joy Loyalty. Địa chỉ khách hàng là input cho **tier/segment theo quốc gia, reward giới hạn theo market, và tính shipping-based reward**. Nếu Joy có customer account extension hoặc bất kỳ mutation address nào, việc bump API version lên 2026-10 sẽ cần đổi field — và vì `territoryCode` vẫn chạy (không lỗi), bug dạng này sẽ **âm thầm** chứ không nổ ngay.

## [Four additional topics are now available for Events](https://shopify.dev/changelog/four-additional-topics-are-now-available-for-events) — (shopify.dev/changelog, 26/08/2026)
**Đây là gì:** "Events" là hệ thống subscribe sự kiện thế hệ mới của Shopify, định hướng thay thế dần webhook truyền thống — cho phép **target field cụ thể trong trigger** và query lại resource vừa đổi, thay vì phải subscribe nguyên topic rộng rồi tự lọc.
**Chi tiết:** 4 topic mới được thêm: **Metaobject**, **MetafieldDefinition**, **MetaobjectDefinition**, **InventoryTransfer**. Tính năng hiện nằm trong developer preview ở API version `unstable`; Shopify khuyến nghị vẫn dùng webhook cho các topic chưa được hỗ trợ.
**Vì sao đáng đọc:** Joy Loyalty sống bằng metafield/metaobject (lưu điểm, tier, cấu hình rule). Có event cho **MetafieldDefinition** và **Metaobject** nghĩa là tương lai Joy có thể phản ứng chính xác khi definition bị merchant sửa/xoá — thay vì phát hiện muộn qua lỗi read. Chưa nên dùng production vì còn `unstable`, nhưng đáng theo dõi để chuẩn bị migration khỏi `webhooks` thường.

## [Shopify storefronts now support UCP 2026-08-25](https://shopify.dev/changelog/08-25-is-now-supported) — (shopify.dev/changelog, 04/09/2026)
**Đây là gì:** UCP (Universal Commerce Protocol) là protocol để các platform và **AI agent** "bắt tay" với storefront Shopify — agent đọc discovery profile ở endpoint `/.well-known/ucp` để biết storefront hỗ trợ những capability gì.
**Chi tiết:** Storefront giờ khai báo hỗ trợ protocol version `2026-08-25` trong discovery profile. Nguyên văn: *"the set of capabilities that Shopify supports is unchanged. Only the advertised protocol version and associated compatibility have been updated."* **Không cần action gì**, integration hiện tại chạy bình thường.
**Vì sao đáng đọc:** Bản thân update này vô hại, nhưng nó xác nhận Shopify đang **đầu tư nghiêm túc vào agentic commerce** (cùng hướng với WebMCP). Với Joy Loyalty, câu hỏi trung hạn là: khi AI agent mua hàng thay khách, **điểm loyalty và referral được attribute thế nào**? Đáng nắm sớm vì nó sẽ định hình cách reward/discount được apply ngoài luồng checkout truyền thống.

## [App intents on `admin.app.intent.link` now open as a full-page navigation](https://shopify.dev/changelog/app-intents-on-admin-app-intent-link-now-open-as-a-full-page-navigation) — (shopify.dev/changelog, 19/08/2026)
**Đây là gì:** App intent là cơ chế cho phép merchant nhảy thẳng từ một chỗ trong Shopify Admin sang một màn hình cụ thể trong app của bạn. Extension target `admin.app.intent.link` trước đây mở URL đó trong **overlay/modal**; giờ mở thành **full page navigation**.
**Chi tiết:** Áp dụng cho mọi API version và mọi store, với `admin_link` extension. Vẫn có fallback về modal khi trang hiện tại đang có **unsaved changes**. Extension dùng `admin.app.intent.render` **không bị ảnh hưởng**. Shopify nói *"no action is required to keep your extension working"*, nhưng khuyên verify route hoạt động tốt khi đứng độc lập như một trang riêng.
**Vì sao đáng đọc:** Nếu Joy Loyalty có admin link extension (ví dụ từ trang Customer trong Admin nhảy sang màn hình điểm/tier của khách đó), route đích giờ phải render được **standalone** — tức là không phụ thuộc state từ modal parent, phải tự load data từ param, và có nav/breadcrumb riêng. Đây là loại thay đổi "không breaking về API nhưng breaking về UX" dễ bị bỏ sót.

## [Shop Campaigns performance data now available via ShopifyQL](https://shopify.dev/changelog/shop-campaigns-shopifyql) — (shopify.dev/changelog, 10/08/2026)
**Đây là gì:** ShopifyQL là ngôn ngữ truy vấn analytics của Shopify, gọi qua field `shopifyqlQuery` trong Admin GraphQL API. Schema mới `shop_campaign_insights` mở dữ liệu hiệu suất Shop Campaigns (kênh quảng cáo của Shopify) cho app.
**Chi tiết:** Metric ở cả cấp campaign và segment: **ad spend, sales, orders, ROAS, average order value, average customer acquisition cost**. Không cần setup mới — dùng scope `read_reports` sẵn có và field `shopifyqlQuery`.
**Vì sao đáng đọc:** Có **CAC (chi phí thu hút khách)** ở cấp segment là mảnh ghép đắt giá cho Joy Loyalty: đặt cạnh LTV/repeat-rate của member loyalty, ta chứng minh được "khách qua loyalty rẻ hơn khách mua qua ads bao nhiêu lần". Đây chính là con số merchant cần để justify việc trả tiền cho app — dashboard so sánh CAC vs loyalty-driven revenue là một tính năng khả thi ngay với scope hiện có.
