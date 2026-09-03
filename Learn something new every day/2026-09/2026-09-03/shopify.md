# 🛒 Shopify — 2026-09-03

> Tuần này Shopify chốt deadline khai tử Script Tags (03/2027), làm OAuth token refresh chịu lỗi tốt hơn, và Polaris CDN chuyển sang semantic versioning kèm bản RC 1.1.

## ⭐ [Script tags are deprecated and will stop running on March 1, 2027](https://shopify.dev/changelog/online-store-script-tags-deprecation) — (shopify.dev/changelog, 24/08/2026)
**Đây là gì:** Script Tag là cơ chế cũ cho phép app chèn file JavaScript vào storefront của merchant thông qua Admin API (REST/GraphQL) — trước đây là cách phổ biến nhất để app hiển thị widget trên theme mà không cần merchant sửa code. Shopify nay chính thức khai tử cơ chế này.
**Chi tiết:**
- **01/10/2026:** mutation GraphQL và endpoint REST để *tạo/cập nhật* script tag sẽ trả về lỗi. Script tag đang tồn tại vẫn chạy bình thường.
- **01/03/2027:** Shopify ngừng hẳn việc inject script vào storefront.
- Áp dụng cho **mọi version** của Admin GraphQL API và Admin REST API, kể cả version cũ (không có đường thoát bằng cách pin version).
- Phạm vi ảnh hưởng: script tag có `display_scope` là `online_store`.
- Đường migrate Shopify khuyến nghị: **app embed block** qua theme app extension (cho JS chức năng chung), hoặc **Web Pixels** (cho analytics/conversion tracking, không cần merchant kích hoạt thủ công).
**Vì sao đáng đọc:** Nếu Joy Loyalty còn bất kỳ đoạn nào dùng Script Tag để render launcher/widget điểm thưởng trên storefront, phải audit và chuyển sang app embed block trước 01/10/2026 — vì sau mốc đó không thể tạo script tag mới cho merchant vừa cài app, tức là onboarding sẽ vỡ.

## ⭐ [More resilient refreshes for expiring offline access tokens](https://shopify.dev/changelog/more-resilient-refreshes-for-expiring-offline-access-tokens) — (shopify.dev/changelog, 28/08/2026)
**Đây là gì:** Offline access token là token app dùng để gọi Admin API cho merchant kể cả khi không có ai đang mở app (background job, webhook handler). Shopify đang chuyển sang loại token có hạn, phải refresh định kỳ bằng refresh token — và lần này họ nới lỏng cửa sổ retry.
**Chi tiết:**
- Trước đây: sau khi dùng refresh token, app chỉ được retry lại refresh token cũ trong **60 phút**.
- Bây giờ: app có thể retry refresh token đã lưu **cho tới khi bắt đầu dùng refresh token thay thế**, tối đa **30 ngày** kể từ lần dùng đầu tiên.
- Access token vẫn giữ vòng đời chuẩn **90 ngày**.
- Áp dụng cho cả Admin GraphQL API và Admin REST API, **không cần đổi API version**, không cần opt-in — tự động có hiệu lực.
- Yêu cầu phía app không đổi: vẫn phải lưu cặp token một cách atomic và luôn dùng refresh token mới nhất cho lần sau.
**Vì sao đáng đọc:** Đúng tình huống Joy Loyalty hay gặp — Cloud Run function refresh token xong nhưng Firestore write fail, trước đây chỉ có 60 phút để cứu, giờ có 30 ngày trước khi merchant phải reinstall app.

## [The Polaris CDN is adopting semantic versioning](https://shopify.dev/changelog/the-polaris-cdn-is-adopting-semantic-versioning) — (shopify.dev/changelog, 31/08/2026)
**Đây là gì:** Polaris Web Components là bộ UI component chính chủ của Shopify (dạng web component, load thẳng từ CDN thay vì npm) để app embedded trông giống Shopify Admin. Nay bộ này có quy tắc versioning rõ ràng thay vì "always latest".
**Chi tiết:**
- **Stable** (ví dụ `polaris-1.js`): tự nhận minor update và bug fix, nhưng major version phải chủ động đổi.
- **Pinned** (ví dụ `polaris-1.1.js`): đóng băng hoàn toàn, dùng khi muốn kiểm soát chặt thay đổi trên production.
- **Release candidate** (ví dụ `polaris-1.1-rc.js`): để test trước khi bản stable ra.
- Áp dụng cho app bên thứ ba dùng Polaris CDN và package `@shopify/polaris-types`; **không** ảnh hưởng App Home và Admin UI extensions.
**Vì sao đáng đọc:** Cho phép Joy Loyalty pin version Polaris trên production để một bản update của Shopify không tự đổi layout admin dashboard, rồi test RC riêng ở staging.

## [Polaris CDN 1.1 release candidate](https://shopify.dev/changelog/polaris-cdn-1-1-release-candidate) — (shopify.dev/changelog, 31/08/2026)
**Đây là gì:** Bản RC đầu tiên theo cơ chế versioning mới ở trên, thêm component và prop mới cho Polaris Web Components. Load thử qua `https://cdn.shopify.com/shopifycloud/polaris-1.1-rc.js`.
**Chi tiết:**
- Component mới: `EmptyState` (cho list/table rỗng) và `Number` (canh chữ số bằng tabular figures).
- Prop mới: `fontSize` cho text component, `visibleMonths` cho `DatePicker`, `supplementalStart` cho `Page`.
- Nhiều bug fix ở overlay, modal, popover, tooltip, date picker, form field — ví dụ event của overlay không còn bubble, khớp hành vi `toggle`.
- `fontVariantNumeric` trên `Text`/`Paragraph` vẫn chạy nhưng khuyến khích chuyển sang component `Number`.
**Vì sao đáng đọc:** `EmptyState` và `Number` đúng thứ Joy Loyalty cần cho màn hình "chưa có customer nào tham gia chương trình" và bảng số dư điểm thưởng canh cột số cho đẹp.

## [Invalid metafield queries now return errors in the GraphQL Admin API](https://shopify.dev/changelog/invalid-metafield-queries-now-return-errors-in-the-graphql-admin-api) — (shopify.dev/changelog, 24/07/2026)
**Đây là gì:** Metafield là trường dữ liệu tùy biến app gắn thêm vào product/customer/order. Trước đây nếu bạn filter query theo một metafield không hợp lệ cho việc filter, Shopify âm thầm trả kết quả sai; nay nó báo lỗi.
**Chi tiết:**
- Áp dụng từ **API version 2026-10** trở đi; version **2026-07 trở về trước giữ hành vi cũ**.
- Chỉ ảnh hưởng query filter theo metafield **không hợp lệ để filter**; metafield đã setup đúng cho filtering với comparison được hỗ trợ vẫn hoạt động y hệt.
- Lý do Shopify đưa ra: trả kết quả sai một cách im lặng khiến bug rất khó phát hiện, báo lỗi giúp bắt được ngay ở giai đoạn dev thay vì filter trả rỗng trên production.
**Vì sao đáng đọc:** Joy Loyalty lưu tier/điểm khách hàng trong metafield và filter customer theo đó — khi nâng lên 2026-10 cần test kỹ, query đang "chạy được" hôm nay có thể vỡ thành lỗi.

## [Draft order and transfer/shipment inventory is moving from reserved to committed](https://shopify.dev/changelog/draft-order-and-transfer-shipment-inventory-is-moving-from-reserved-to-committed) — (shopify.dev/changelog, 05/08/2026)
**Đây là gì:** Shopify tách tồn kho thành nhiều trạng thái (`available`, `on_hand`, `reserved`, `committed`). Bản cập nhật này gộp phần tồn kho bị giữ bởi draft order và transfer/shipment từ `reserved` sang `committed`.
**Chi tiết:**
- Sau thay đổi, `committed` bao gồm **toàn bộ tồn kho đã được "đặt chỗ" nhưng chưa fulfill**.
- Chỉ ảnh hưởng draft order đang active và transfer/shipment đang mở; đơn đã hoàn tất hoặc hủy không đổi.
- `available` và `on_hand` **không thay đổi**; tổng tồn kho giữ nguyên, chỉ dịch chuyển giữa các nhóm unavailable.
- Cả `reserved` và `committed` vẫn là field query được.
**Vì sao đáng đọc:** Nếu Joy Loyalty có tính năng reward dạng đổi điểm lấy sản phẩm qua draft order, mọi dashboard/logic đọc `reserved` sẽ thấy số về 0 — cần đọc `committed`.

## [WebMCP support for Liquid and Hydrogen storefronts](https://shopify.dev/changelog/webmcp-liquid-hydrogen) — (shopify.dev/changelog, 05/08/2026)
**Đây là gì:** WebMCP là đề xuất chuẩn web cho phép AI agent tương tác trực tiếp với website qua trình duyệt. Shopify bật sẵn cho storefront, để agent có thể "search catalog, quản lý giỏ hàng, và đi tới checkout thay cho người mua".
**Chi tiết:**
- Có sẵn trên **mọi Liquid storefront** và bản developer preview của Hydrogen, **không cần cài gì**.
- Agent truy cập tool theo 4 nhóm: tìm/duyệt catalog, quản lý cart, checkout/order, và policy/FAQ của shop.
- Hoạt động qua trình duyệt và trigger đúng các action như storefront thường, nên trải nghiệm nhất quán.
- Hiện chỉ hỗ trợ **trình duyệt nhân Chromium** trong giai đoạn origin trial; Shopify đang phát triển chuẩn này cùng Google và Microsoft.
**Vì sao đáng đọc:** Nếu shopper mua hàng qua AI agent, luồng widget loyalty truyền thống (click để đổi điểm) bị bỏ qua hoàn toàn — Joy Loyalty cần nghĩ sớm cách expose discount/điểm thưởng ở tầng cart/checkout thay vì chỉ ở UI.
