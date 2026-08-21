# 🛒 Shopify — 2026-08-19

> API version 2026-10 mang 2 breaking change đáng lo cho app dùng nhiều metafield, đồng thời Shopify mở hẳn tầng analytics (ShopifyQL + App Events + web components) cho app bên thứ ba — cả hai đều đánh trúng Joy Loyalty.

## ⭐ [Invalid metafield queries now return errors in the GraphQL Admin API](https://shopify.dev/changelog/invalid-metafield-queries-now-return-errors-in-the-graphql-admin-api) — (shopify.dev/changelog)

**Đây là gì:** Metafield là "trường dữ liệu tùy biến" mà app gắn thêm vào customer/order/product (Joy Loyalty dùng để lưu điểm, tier, ngày hết hạn điểm...). Trước đây khi query lọc theo metafield sai, Shopify âm thầm bỏ qua filter; từ nay nó trả về lỗi.

**Chi tiết:**
- Ngày đăng: 24/07/2026. Áp dụng từ **API version 2026-10**, được đánh dấu là **breaking change**.
- Admin GraphQL API giờ validate metafield filter *trước khi* chạy query, thay vì im lặng bỏ qua như trước.
- Query bị reject nếu lọc theo metafield **không có definition**, hoặc definition **không bật cho phép filtering**.
- Migration theo 4 bước Shopify nêu: (1) rà soát toàn bộ query có lọc metafield, (2) kiểm tra từng metafield đã có definition + bật filtering, (3) xác nhận kiểu so sánh trong filter khớp với metafield type, (4) test trên 2026-10 để chắc không còn lỗi.
- App chưa sửa kịp thì phải ở lại API version cũ hơn — không có cơ chế fallback im lặng nữa.

**Vì sao đáng đọc:** Joy Loyalty lọc customer/order theo metafield điểm và tier ở rất nhiều chỗ; nếu có metafield nào chưa bật filtering trong definition thì ngày bump lên 2026-10 sẽ vỡ hàng loạt query thay vì trả kết quả sai âm thầm như trước.

## ⭐ [Full-stack capabilities to power app analytics](https://shopify.dev/changelog/full-stack-capabilities-to-power-app-analytics) — (shopify.dev/changelog)

**Đây là gì:** Shopify mở toàn bộ tầng analytics của mình cho app bên thứ ba — app có thể đẩy dữ liệu riêng vào, query bằng ShopifyQL (ngôn ngữ truy vấn analytics của Shopify), rồi render chart bằng component có sẵn, mà không cần tự dựng data warehouse.

**Chi tiết:**
- Ngày đăng: 21/07/2026, gắn với **API version 2026-10**, đụng tới 4 API: Admin GraphQL, App Events, Metafields và ShopifyQL.
- **Data integration:** đánh dấu metafield là "analytics-queryable" để dùng nó làm dimension trong ShopifyQL bên cạnh dữ liệu gốc của store.
- **Custom events:** App Events API cho phép app phát event riêng và query được ngay trong Shopify Analytics (đang ở early access, phải đăng ký).
- **Query layer:** ShopifyQL API nay là surface hạng nhất, có reference docs ở mức schema.
- **UI components:** Analytics Web Components (`<s-shopifyql-metric-card>`, `<s-metrics-bar>`) dùng được cho app bên thứ ba — khỏi kéo thêm thư viện chart.
- Thêm 2 API phụ: annotation để chú thích lên chart, và metric target để merchant đặt mục tiêu và theo dõi tiến độ.
- Không có breaking change nào được nêu.

**Vì sao đáng đọc:** Dashboard analytics của Joy Loyalty (điểm phát ra, tỉ lệ redeem, retention theo tier) hiện phải tự tính và tự lưu trên Firebase/GCP — hướng này cho phép đẩy metafield điểm/tier thành dimension và để Shopify lo phần aggregate + chart, giảm hẳn chi phí data pipeline.

## [createdAt is now available on the Customer object in Shopify Functions](https://shopify.dev/changelog/createdat-is-now-available-on-the-customer-object-in-shopify-functions) — (shopify.dev/changelog)

**Đây là gì:** Shopify Functions là code chạy trực tiếp trên hạ tầng Shopify để tùy biến logic discount/shipping/payment ngay trong checkout. Nay object `Customer` trong Functions expose thêm `createdAt` — thời điểm tài khoản khách được tạo.

**Vì sao đáng đọc:** Joy Loyalty có thể viết discount function thưởng riêng cho khách "kỳ cựu" hoặc khách mới đăng ký trong X ngày ngay ở tầng checkout, thay vì phải query ngược Admin API — nhớ là phải bump function lên API version 2026-10 và xử lý cả trường hợp guest checkout (không có customer).

## [Standard storefront events and actions now support cart attributes](https://shopify.dev/changelog/events-and-actions-cart-attributes-support) — (shopify.dev/changelog)

**Đây là gì:** Cart attributes là các cặp key-value tùy biến gắn vào giỏ hàng. Action `updateCart` nay xử lý được cart attributes, và có event mới `shopify:cart:attributes-update` bắn ra mỗi khi attribute thay đổi.

**Vì sao đáng đọc:** Joy Loyalty hay ghi số điểm khách chọn redeem vào cart attribute — trước đây phải gọi thẳng Storefront API và không biết khi nào theme hoặc app khác đè lên; giờ event bắn bất kể thay đổi đến từ app mình, theme, hay app thứ ba, và có promise để rollback UI nếu cart từ chối.

## [Shop Campaigns performance data now available via ShopifyQL](https://shopify.dev/changelog/shop-campaigns-shopifyql) — (shopify.dev/changelog)

**Đây là gì:** Shop Campaigns là kênh quảng cáo do Shopify chạy hộ merchant. Schema mới `shop_campaign_insights` trong ShopifyQL cho phép app đọc số liệu hiệu quả chiến dịch: ad spend, sales, orders, ROAS, AOV và chi phí acquisition trung bình, chia theo campaign lẫn segment, granularity từ giờ đến năm.

**Vì sao đáng đọc:** Cho phép Joy Loyalty đặt cạnh nhau chi phí *acquire* khách mới và giá trị *retain* khách cũ trong cùng một báo cáo — và chỉ cần scope `read_reports` đã có sẵn qua field `shopifyqlQuery`, không cần xin scope mới.

## [WebMCP support for Liquid and Hydrogen storefronts](https://shopify.dev/changelog/webmcp-liquid-hydrogen) — (shopify.dev/changelog)

**Đây là gì:** WebMCP là chuẩn web đang đề xuất, cho phép trang web đăng ký "tool" với trình duyệt để AI agent gọi trực tiếp thay vì đọc HTML và giả lập click. Shopify đã bật sẵn tool WebMCP trên mọi storefront Liquid và bản Hydrogen developer preview, không cần setup.

**Vì sao đáng đọc:** Agent giờ có thể search catalog, sửa cart và đi checkout thay khách — đăng 05/08, hiệu lực 21/08/2026, nên Joy Loyalty cần tính trước kịch bản luồng redeem điểm bị một AI agent điều khiển chứ không phải người bấm nút (hiện agent support mới giới hạn trong origin trial trên Chromium).

## [Draft order and transfer/shipment inventory is moving from reserved to committed](https://shopify.dev/changelog/draft-order-and-transfer-shipment-inventory-is-moving-from-reserved-to-committed) — (shopify.dev/changelog)

**Đây là gì:** Shopify gộp cách biểu diễn hàng bị giữ chỗ: phần tồn kho của draft order, transfer và shipment trước đây nằm ở state `reserved` nay chuyển sang `committed`, đồng bộ với cách order vẫn được tính. Đăng và có hiệu lực từ 05/08/2026 trên Admin GraphQL API.

**Vì sao đáng đọc:** Không phải breaking change (không field nào bị xóa hay đổi tên), nhưng nếu Joy Loyalty có logic nào đọc `reserved` để suy ra hàng đang giữ, con số sẽ tụt xuống và phải chuyển sang đọc `committed`.
