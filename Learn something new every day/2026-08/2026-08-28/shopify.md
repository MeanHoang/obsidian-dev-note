# 🛒 Shopify — 2026-08-28

> Đáng làm ngay: kiểm tra Shopify CLI của mọi môi trường theme/password-protected trước 01/10; đồng thời thử Events preview để phản ứng đúng lúc khi cấu hình metaobject loyalty đổi.

## ⭐ [Bốn topic mới cho Shopify Events: Metaobject, definition và Inventory Transfer](https://shopify.dev/changelog/four-additional-topics-are-now-available-for-events) — (shopify.dev/changelog, 26/08/2026)

**Đây là gì:** Shopify Events là cơ chế event thế hệ mới đang ở developer preview, cho phép app khai báo chính xác dữ liệu nào sẽ kích hoạt delivery và GraphQL query trả về payload. Shopify vừa bổ sung topic `Metaobject`, `MetafieldDefinition`, `MetaobjectDefinition`, `InventoryTransfer`, cùng trigger metafield có chọn lọc trên `InventoryTransfer`.

**Chi tiết:**

- Đăng ký được action cho bốn resource mới; mục tiêu là nhận thay đổi custom content/custom-data trực tiếp thay vì nghe update rộng rồi tự so sánh payload.
- Trigger có thể chỉ vào một field cụ thể, ví dụ `metaobject(type: 'books').field(key: 'title').value`; khi field này đổi, Shopify mới deliver event.
- Subscription khai báo `topic`, `actions`, `triggers`, `uri`, và GraphQL `query`; query dùng `metaobjectId`/`fieldKey` do trigger cung cấp để lấy đúng record và field cần xử lý.
- Payload mẫu có `fields_changed` và `query_variables`, nên handler biết chính xác field nào đã đổi mà không phải đọc lại cả resource.
- Events hiện chỉ có ở API version `unstable` trong developer preview; Shopify nói rõ những topic chưa hỗ trợ vẫn phải dùng webhook song song.

**Vì sao đáng đọc:** Nếu Joy Loyalty lưu tier, rule earn/redeem hoặc campaign bằng metaobject, đây là hướng để invalidate cache/đồng bộ cấu hình đúng khi field liên quan đổi, thay vì xử lý mọi update. Chưa nên thay webhook production ngay: hãy làm spike trên dev store, giữ webhook làm đường chính cho đến khi Events stable và có đủ topic cần thiết.

## [Shopify CLI cũ sẽ không còn chạy theme workflow trên shop có password](https://shopify.dev/changelog/password-protected-shop-dev-flows-on-shopify-theme-cli-v3-83-x-and-older-to-be-deprecated) — (shopify.dev/changelog, 27/08/2026)

**Đây là gì:** Từ **01/10/2026**, các Theme command chạy với storefront có password bắt buộc Shopify CLI **3.84.0+**. CLI 3.83.x trở xuống dùng xác thực storefront legacy và sẽ không còn được Shopify hỗ trợ cho flow này.

**Vì sao đáng đọc:** Mọi môi trường Joy dùng `shopify theme dev`, `shopify theme console`, hoặc `shopify app dev` có theme app extension trên staging/password-protected store đều có thể bị dừng dev/preview đột ngột. Cần audit version trong máy dev và CI, nâng lên bản mới (Shopify hiện khuyến nghị 4.7.0) rồi xác nhận lại preview trước deadline.

## [Commit từ Shopify GitHub app nay ghi tên người sửa theme cuối cùng](https://shopify.dev/changelog/github-commits-now-name-the-last-theme-editor) — (shopify.dev/changelog, 26/08/2026)

**Đây là gì:** Khi merchant chỉnh theme trong Shopify Admin và theme được kết nối GitHub, commit Shopify push vào branch nay thêm `Theme last edited by: <tên>` trong **commit body**. Author vẫn là bot Shopify.

**Vì sao đáng đọc:** Khi widget/app embed của Joy bị merchant chỉnh trực tiếp trong theme editor, team có thêm dấu vết để hỏi đúng người và giải thích thay đổi. Lưu ý các lần save cách nhau khoảng 10 giây được gộp lại và chỉ ghi người save cuối, vì vậy đây là hint điều tra chứ không thay audit log hay `git blame`.

## [App intent `admin.app.intent.link` chuyển sang full-page navigation](https://shopify.dev/changelog/app-intents-on-admin-app-intent-link-now-open-as-a-full-page-navigation) — (shopify.dev/changelog, 19/08/2026)

**Đây là gì:** Khi Sidekick gọi app intent khai báo bằng target `admin.app.intent.link`, Shopify Admin nay điều hướng merchant tới URL của app dưới dạng trang đầy đủ, thay vì mở overlay. Thay đổi đã live cho mọi shop, không phụ thuộc API version và không cần đổi cấu hình intent.

**Vì sao đáng đọc:** Nếu Joy mở intent để Sidekick dẫn merchant đến trang tạo campaign/chỉnh loyalty rule, route đó phải hoạt động tốt ở full width. Cần vẫn hỗ trợ modal: khi merchant có thay đổi chưa lưu ở trang hiện tại, Shopify giữ overlay để tránh mất dữ liệu. `admin.app.intent.render` không bị ảnh hưởng.

## [Đọc hiệu quả Shop Campaigns qua ShopifyQL](https://shopify.dev/changelog/shop-campaigns-shopifyql) — (shopify.dev/changelog, 10/08/2026)

**Đây là gì:** Schema ShopifyQL `shop_campaign_insights` nay cho reporting/analytics app đã được merchant cấp quyền query dữ liệu hiệu quả Shop Campaigns qua field `shopifyqlQuery` hiện có, với scope `read_reports`.

**Vì sao đáng đọc:** Analytics của Joy có thể, nếu merchant sử dụng Shop Campaigns và đã cấp `read_reports`, đặt hiệu quả acquisition campaign cạnh số member mới, earned/redeemed points và repeat purchase để đánh giá campaign mang lại khách trung thành chứ không chỉ order. Shopify cung cấp ad spend, sales, orders, ROAS, AOV và CAC theo campaign/segment, theo thời gian từ giờ đến năm, theo timezone của shop; cần kiểm tra consent/scope trước khi đưa vào sản phẩm.

## [Standard storefront actions hỗ trợ cart attributes](https://shopify.dev/changelog/events-and-actions-cart-attributes-support) — (shopify.dev/changelog, 06/08/2026)

**Đây là gì:** Standard action `updateCart` nay cập nhật được cart attributes. Event mới `shopify:cart:attributes-update` phát ra khi việc cập nhật attributes được khởi tạo, bất kể nguồn là app, theme hay app khác; event mang toàn bộ attributes mới và promise kết quả.

**Vì sao đáng đọc:** Nếu storefront loyalty UI ghi referral code, campaign marker hoặc trạng thái chọn reward vào cart attributes, Joy có thể dùng standard action/event thay vì tự gọi Storefront API và polling/đoán thay đổi từ bên ngoài. UI nên optimistic update theo event nhưng rollback khi promise báo cart bị từ chối.

## [Shopify phát hành package chính thức cho PHP và Python](https://shopify.dev/changelog/build-shopify-apps-in-php-and-python-with-new-official-packages) — (shopify.dev/changelog, 26/08/2026)

**Đây là gì:** Shopify phát hành `shopify/shopify-app-php` (Packagist) và `shopifyapp` (PyPI), đều phiên bản 1.0. Chúng cung cấp primitive không phụ thuộc framework cho verify request, token exchange và Admin GraphQL client có retry tự động.

**Vì sao đáng đọc:** Backend chính của Joy vẫn Node.js nên không có thay đổi bắt buộc. Tuy vậy, đây là lựa chọn chuẩn nếu một integration/service phụ cần PHP hoặc Python: có sẵn verify cho webhook, App Home/App Bridge, app proxy và nhiều extension surface; library PHP/Python cũ vẫn chạy nhưng Shopify xác nhận sẽ không nhận tính năng mới hay security fix. Không cần migrate dịch vụ Node sang ngôn ngữ khác chỉ vì thông báo này.
