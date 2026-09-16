# 🛒 Shopify — 2026-09-15

> Tuần này Shopify tung mutation mới cho việc thu thập payment method qua email (2026-10), chốt hạn khai tử Script tags (03/2027), Polaris CDN chuyển sang semantic versioning kèm RC 1.1, và Hydrogen preview thêm variant link + cart refresh.

## ⭐ [New paymentInstrumentSendAddEmail mutation emails customers a link to add a payment method](https://shopify.dev/changelog/new-paymentinstrumentsendaddemail-mutation) — (shopify.dev, 03/09/2026)
**Đây là gì:** Một mutation mới trong GraphQL Admin API (version `2026-10`) cho phép app gửi email cho customer kèm link để họ tự thêm payment method vào một **subscription**, **order** hoặc **draft order**. Trước đây muốn tạo subscription/draft order có thu tiền thì phải có sẵn payment instrument của customer; giờ có thể tạo resource trước rồi mời customer gắn thẻ sau.

**Chi tiết:**
- Mutation: `paymentInstrumentSendAddEmail`, có mặt từ API version **2026-10**.
- Bắt buộc truyền argument `mandate` gồm `resourceType` (`SUBSCRIPTIONS`, `ORDERS`, `DRAFT_ORDERS`) và `resourceId` dạng số.
- Argument `email` (optional) cho phép chỉnh địa chỉ gửi (`from`) và danh sách `bcc`.
- Trả về object `customer` cùng `userErrors` để validate.
- Cần access scope `write_customers`; nếu chạy trong staff context thì staff phải có quyền create/edit customer.
- Đây là thay đổi **thuần additive** — không deprecate hay đổi hành vi mutation nào đang có.

**Vì sao đáng đọc:** Nếu Joy Loyalty mở rộng sang membership/subscription tier có thu phí (hoặc reward dạng draft order cần thanh toán phần chênh), đây là cách gửi link thu payment mà không phải tự build trang nhập thẻ — vừa đỡ PCI scope vừa dùng luôn flow email native của Shopify.

## [Script tags are deprecated and will stop running on March 1, 2027](https://shopify.dev/changelog/online-store-script-tags-deprecation) — (shopify.dev, 24/08/2026)
**Đây là gì:** Script tag là cơ chế cũ để app chèn file JS vào storefront qua Admin API (`scriptTagCreate`). Shopify chốt lịch khai tử: từ **01/10/2026** các mutation create/update sẽ **từ chối** script tag mới, và từ **01/03/2027** Shopify ngừng inject script vào storefront hoàn toàn. Thay thế bằng **app embed block** (ship trong theme app extension) hoặc **web pixel** nếu chỉ phục vụ analytics. Query `scriptTags` và `scriptTagDelete` vẫn sống để audit/dọn dẹp. Chỉ ảnh hưởng script tag có `display_scope` = `online_store`.

**Vì sao đáng đọc:** Widget loyalty nhúng vào storefront mà còn dựa script tag thì phải migrate sang app embed block trước 10/2026 — lưu ý app embed cần merchant **bật thủ công** trong theme editor, nên phải tính trước UX onboarding cho hàng loạt store cũ.

## [The Polaris CDN is adopting semantic versioning](https://shopify.dev/changelog/the-polaris-cdn-is-adopting-semantic-versioning) — (shopify.dev, 31/08/2026)
**Đây là gì:** Polaris Web Components load từ Shopify CDN chuyển sang semver. Có 3 kiểu dùng: major version channel (`polaris-1.js`) tự nhận update tương thích, pinned release để khóa version cụ thể, và release candidate build (`polaris-1.1-rc.js`) để test trước. Áp dụng cho app bên thứ ba dùng Polaris Web Components từ CDN và `@shopify/polaris-types`; **không** áp dụng cho App Home UI extension, Admin UI extension hay App Bridge. App đang chạy không cần làm gì ngay.

**Vì sao đáng đọc:** Admin UI của Joy Loyalty xây trên React + Polaris — semver cho phép pin version để tránh một bản CDN mới làm vỡ layout dashboard giữa mùa BFCM, rồi chủ động upgrade khi có thời gian test.

## [Polaris CDN 1.1 release candidate](https://shopify.dev/changelog/polaris-cdn-1-1-release-candidate) — (shopify.dev, 31/08/2026)
**Đây là gì:** Bản RC của Polaris CDN 1.1, test bằng cách load `https://cdn.shopify.com/shopifycloud/polaris-1.1-rc.js`. Thêm 2 component mới: **EmptyState** (cho list/table/page rỗng) và **Number** (hiển thị số với cột căn thẳng). Thêm prop mới: `fontSize` cho typography, `visibleMonths` cho DatePicker, `supplementalStart` cho Page layout. Nhiều bug fix ở overlay, modal, popover, tooltip, date picker, form field. Prop `fontVariantNumeric` bị deprecate, thay bằng component `Number`.

**Vì sao đáng đọc:** Component `Number` rất hợp với bảng points/tier/redemption của Joy Loyalty (số điểm căn cột dễ đọc hơn), còn `EmptyState` chuẩn hóa màn hình "chưa có member nào" thay vì tự chế UI.

## [More resilient refreshes for expiring offline access tokens](https://shopify.dev/changelog/more-resilient-refreshes-for-expiring-offline-access-tokens) — (shopify.dev, 28/08/2026)
**Đây là gì:** Offline access token là token app dùng để gọi Admin API kể cả khi merchant không online. Trước đây nếu refresh bị lỗi, app chỉ có **60 phút** để retry với refresh token cũ. Giờ app có thể retry bằng refresh token đã lưu **cho tới khi bắt đầu dùng refresh token thay thế**, tức cửa sổ phục hồi lên tới **30 ngày**. Áp dụng cho cả Admin GraphQL và Admin REST, không cần migration hay config. Shopify vẫn khuyến nghị lưu cặp token một cách atomic và coi đây là cơ chế cứu hộ chứ không phải cớ để trì hoãn cập nhật token.

**Vì sao đáng đọc:** Nếu Cloud Function ghi token vào Firestore mà bị timeout/crash giữa chừng, trước đây shop đó gần như chắc chắn mất kết nối; giờ có 30 ngày để job retry cứu lại — đáng rà lại logic refresh token trong backend.

## [Hydrogen developer preview update: September 2, 2026](https://shopify.dev/changelog/hydrogen-developer-preview-update-september-2-2026) — (shopify.dev, 03/09/2026)
**Đây là gì:** Hydrogen là framework React của Shopify để build storefront headless (chạy trên Oxygen). Bản developer preview này thêm 3 thứ: **variant link** giờ trỏ thẳng tới đúng variant thay vì về product page chính (khớp cách variant được submit vào Google Shopping feed), **cart refresh** cho phép reload cart sau khi sửa cart từ phía server, và **local HTTPS certificate** được tự sinh để test Customer Account — setup login local chỉ còn "một lệnh hoặc không cần lệnh nào".

**Vì sao đáng đọc:** Cart refresh là mảnh còn thiếu cho loyalty trên headless: sau khi backend apply discount/redeem points vào cart, storefront Hydrogen có thể đồng bộ lại ngay mà không cần hack reload trang.
