# 🛒 Shopify — 2026-09-16

> Ngày 15/09 Shopify đẩy một loạt tin nặng ký cho app dev: `metafieldsSet` đổi sang tính cost động (ảnh hưởng trực tiếp rate limit của app ghi metafield hàng loạt), admin thay giao diện mới kèm lộ trình Polaris 2.0, và Shopify Functions đọc được metafield của delivery option.

## ⭐ [Dynamic complexity cost for `metafieldsSet` mutation](https://shopify.dev/changelog/dynamic-complexity-cost-for-metafieldsset-mutation) — (shopify.dev/changelog, 15/09/2026)
**Đây là gì:** `metafieldsSet` là mutation trong GraphQL Admin API dùng để ghi/cập nhật metafield (dữ liệu tuỳ biến gắn lên product, customer, order…). Shopify chuyển cách tính chi phí query của mutation này từ giá cố định sang giá động theo số resource bị đụng tới.

**Chi tiết:**
- Trước đây: mỗi call tốn cố định **10 điểm**, bất kể ghi bao nhiêu metafield lên bao nhiêu owner.
- Bây giờ: `cost = 10 điểm nền + tổng (số owner distinct mỗi loại × trọng số loại)`.
- Trọng số theo owner type: **Order = 10**, **Product = 4**, **ProductVariant = 2**, **Collection / Customer / Shop = 1 điểm mỗi cái**, các type còn lại = 0.
- Trần chi phí cho một mutation là **260 điểm** (tương ứng 25 order distinct).
- Nếu gọi nhiều `metafieldsSet` trong cùng một request bằng GraphQL alias thì **mỗi alias tính cost độc lập**, cộng dồn lại.
- Khuyến nghị của Shopify: gom metafield theo owner, đừng tách request vô ích, đọc cost thật từ response header (`extensions.cost`), và xử lý throttling tử tế.

**Vì sao đáng đọc:** Joy Loyalty ghi metafield rất nhiều — điểm thưởng, tier hiện tại, referral code lên **Customer** (trọng số 1, nhẹ) nhưng nếu có job nào ghi metafield lên **Order** (ví dụ đánh dấu order đã cộng điểm / đã redeem) thì mỗi order distinct tốn 10 điểm, một batch 25 order = 260 điểm, gần chạm bucket 1000 điểm của Plus và ăn gần hết bucket của shop thường. Cần rà lại các bulk job sync điểm và job backfill: gom theo owner, giảm số alias trong 1 request, và bắt buộc đọc `throttleStatus` để backoff thay vì retry mù.

## ⭐ [Prepare your app for the Shopify admin's new look](https://shopify.dev/changelog/prepare-your-app-for-the-shopify-admins-new-look) — (shopify.dev/changelog, 15/09/2026)
**Đây là gì:** Shopify admin (giao diện merchant dùng hằng ngày) được thay đổi thị giác toàn diện từ 15/09/2026, rollout dần theo shop. Kèm theo đó là thông báo về **Polaris 2.0** — major version mới của design system Shopify.

**Chi tiết:**
- Merchant sẽ thấy: bảng màu, typography, spacing, icon mới; **frame layout** mới cho admin.
- Search, notifications và store picker được dời vào **side navigation thu gọn được**; Sidekick đổi từ side panel sang **widget chat nổi ở đáy trang**.
- **Admin UI extensions** và **App Home UI extensions** tự động ăn theo style mới — **không cần sửa code**.
- App có **App Home giao diện tự custom** thì giữ nguyên style hiện tại cho tới khi dev chủ động opt-in Polaris 2.0. Shopify nói rõ: "adopting the new major version is explicit, so merchants never see your app partially updated".
- **Polaris 2.0 release candidate sắp ra**. Đường dẫn chuẩn bị được gợi ý là migrate sang **Polaris Web Components**.
- Rollout là progressive → trong giai đoạn chuyển tiếp, merchant này thấy admin cũ, merchant kia thấy admin mới.

**Vì sao đáng đọc:** Đây là tin có action item rõ nhất cho Joy Loyalty. App admin của Joy là React + Polaris custom App Home → **không tự động đổi style**, nghĩa là từ giờ sẽ có giai đoạn app Joy trông "lệch tông" so với admin mới xung quanh nó, merchant sẽ cảm nhận được. Chưa cần migrate gấp (Polaris 2.0 mới ở giai đoạn RC, opt-in là explicit), nhưng nên bắt đầu khảo sát Polaris Web Components ngay: đây là đường migrate được Shopify chỉ định, và nó chạy được với JS thuần + React nên không kéo theo yêu cầu TypeScript nào. Ngược lại, các phần Joy làm bằng Admin UI extension (nếu có) thì khỏi lo — tự cập nhật.

## [Delivery options in Shopify Functions input now expose their metafields](https://shopify.dev/changelog/delivery-options-in-shopify-functions-input-now-expose-their-metafields) — (shopify.dev/changelog, 15/09/2026)
**Đây là gì:** Shopify Functions là code tuỳ biến (Wasm) chạy ngay trong backend Shopify để can thiệp logic checkout — discount, delivery customization, cart validation. Từ API version **2026-10**, function có thể đọc metafield gắn trên delivery option của cart qua method `metafield(namespace:, key:)` trên `CartDeliveryOption`.

**Vì sao đáng đọc:** Joy Loyalty có perk theo tier kiểu "free shipping cho tier Gold" — trước đây muốn function biết một delivery option là loại gì thì phải hack bằng cách nhét dữ liệu vào title hoặc handle của option. Giờ có data contract sạch: gắn metafield lên delivery option rồi đọc thẳng trong Delivery Customization Function. Lưu ý metafield này **chỉ tồn tại trong phiên checkout đó**, không persist sau khi checkout hoàn tất — nên không dùng để lưu trạng thái loyalty lâu dài. Không bắt buộc migrate gì, chỉ là tuỳ chọn khi nâng lên API 2026-10.

## [family_name is optional for B2B orders in Payments Apps API requests](https://shopify.dev/changelog/family_name-is-optional-for-b2b-orders-in-payments-apps-api-requests) — (shopify.dev/changelog, 15/09/2026)
**Đây là gì:** Payments Apps API là API cho app đóng vai payment provider. Shopify cập nhật docs để nói rõ: với đơn **B2B**, payment session request có thể thiếu `family_name` trong `shipping_address` và `billing_address`. Hành vi này vốn đã được chấp nhận từ trước, chỉ là tài liệu giờ mới ghi đúng.

**Vì sao đáng đọc:** Joy Loyalty không phải payment app nên **không phải migrate gì**. Nhưng đáng ghi nhớ như một mẫu hình: dữ liệu tên khách B2B trên Shopify có thể khuyết họ. Nếu Joy có chỗ nào ghép `first_name + last_name` để hiển thị tên member hoặc làm khoá đối chiếu, code cần chịu được `last_name` rỗng — đặc biệt với merchant bán B2B.

## [A new look for the Shopify admin](https://changelog.shopify.com/posts/see-the-shopify-admin-s-new-look) — (changelog.shopify.com, 15/09/2026)
**Đây là gì:** Bản thông báo dành cho merchant của cùng đợt redesign admin ở trên — frame, màu, typography, spacing và icon mới, search/notifications/store picker dời vào side navigation thu gọn được, Sidekick thành chat nổi. Rollout dần, merchant không cần làm gì.

**Vì sao đáng đọc:** Đây là bản merchant sẽ thực sự đọc, nên support team của Joy nên nắm: khi merchant báo "không tìm thấy app Joy trong admin" hoặc "menu bị đổi chỗ" trong vài tuần tới, nguyên nhân nhiều khả năng là đợt rollout này chứ không phải lỗi app. Cũng là mốc để canh screenshot trong tài liệu hướng dẫn cài Joy — ảnh chụp admin cũ sẽ lỗi thời dần.

## [Multi-currency payouts now available in Australia and France](https://changelog.shopify.com/posts/multi-currency-payouts-now-available-in-australia-and-france) — (changelog.shopify.com, 11/09/2026)
**Đây là gì:** Shopify Payments mở rộng tính năng nhận payout theo nhiều loại tiền tệ cho merchant đủ điều kiện ở Úc và Pháp, trên gói Advanced và Shopify Plus. Úc nhận payout ở 13 loại tiền (gồm AUD, USD, EUR, GBP), Pháp ở 18 loại với EUR là mặc định; có thể trỏ vào thêm tài khoản ngân hàng cho các tiền tệ khác.

**Vì sao đáng đọc:** Đây là chuyện payout, **không đụng tới logic loyalty và không cần migrate**. Nhưng nó là dấu hiệu tệp merchant Plus đa tiền tệ đang lớn lên ở Úc và Pháp — đúng nhóm hay dùng store credit và reward quy đổi tiền. Nhắc lại rủi ro cũ mà Joy vẫn phải tự lo: điểm và store credit của Joy cần quy chiếu rõ theo currency nào, vì payout đa tiền tệ không đồng nghĩa với việc giá trị reward tự động quy đổi.
