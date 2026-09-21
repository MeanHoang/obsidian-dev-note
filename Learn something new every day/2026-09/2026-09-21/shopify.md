# 🛒 Shopify — 2026-09-21

> Tuần này Shopify chốt một loạt breaking change quanh **discounts** và **metafields** cho API 2026-10 / 2027-01 — đúng hai thứ app loyalty đụng hằng ngày.

## ⭐ [The `automaticDiscounts` query is removed in API version 2027-01](https://shopify.dev/changelog/automaticdiscounts-query-is-removed-in-api-version-2027-01) — (shopify.dev changelog, 18/09/2026)
**Đây là gì:** `automaticDiscounts` là query cũ trong GraphQL Admin API dùng để liệt kê các **automatic discount** (khuyến mãi tự áp dụng, không cần nhập code). Shopify xoá hẳn nó khỏi version `2027-01`.
**Chi tiết:**
- Request có `automaticDiscounts` chạy trên `2027-01` sẽ **trả về validation error thay vì data** — tức query fail, không phải degrade nhẹ.
- Đường migrate chính thức: dùng query `discountNodes` kèm filter `method:automatic`.
- Khi migrate phải **chuyển inline fragments** từ `nodes` của `automaticDiscounts` sang field `discount` của mỗi `DiscountNode` (changelog có ví dụ before/after).
- App đang chạy `2026-10` trở về trước vẫn hoạt động bình thường trong suốt thời gian version đó còn được support → có thời gian đệm, nhưng đây là breaking change *requires action*.
- App nào đã dùng `discountNodes` sẵn thì không cần đổi gì.
**Vì sao đáng đọc:** Joy Loyalty sinh/đọc discount liên tục (reward, tier perk, referral) — grep codebase tìm `automaticDiscounts` ngay bây giờ rẻ hơn nhiều so với lúc buộc phải nhảy lên `2027-01`.

## ⭐ [Deprecating the `useBuyerJourneyIntercept` API on checkout UI extensions](https://shopify.dev/changelog/deprecating-the-usebuyerjourneyintercept-api-on-checkout-ui-extensions) — (shopify.dev changelog, 02/07/2026)
**Đây là gì:** `useBuyerJourneyIntercept` là hook trong **checkout UI extension** (extension React nhúng vào trang checkout) cho phép app **chặn buyer đi tiếp** nếu điều kiện không thoả — kèm capability `block_progress`. Shopify đang khai tử cả hai.
**Chi tiết:**
- Extension hiện tại vẫn chạy trên API version hiện hành và cũ hơn, nhưng API này **sẽ bị remove ở một version tương lai** — changelog **không nêu deadline cụ thể**.
- Migrate cho business rule của merchant: chuyển sang **cart and checkout validation Function** — chạy server-side nên áp dụng được trên mọi bề mặt checkout, không chỉ nơi extension được render.
- Migrate cho use case từ chối discount code: dùng **discount Function API**, giờ đã cho phép reject code kèm custom message.
- Effective date ghi trên entry là 01/07/2026, và Shopify khuyến nghị lên kế hoạch migrate chủ động thay vì chờ bị remove.
**Vì sao đáng đọc:** Nếu Joy Loyalty đang dùng intercept để chặn redeem sai điều kiện (đủ điểm, đúng tier, đúng sản phẩm), logic đó phải chuyển vào Function — và Function chạy server-side nghĩa là không gọi được API bên ngoài, cần thiết kế lại cách truyền state.

## [Four additional topics are now available for Events](https://shopify.dev/changelog/four-additional-topics-are-now-available-for-events) — (shopify.dev changelog, 26/08/2026)
**Đây là gì:** Events là hệ thống subscription sự kiện mới của Shopify (kế thừa vai trò webhook), cho phép app nhận thông báo khi resource thay đổi. Lần này thêm 4 topic: `Metaobject`, `MetafieldDefinition`, `MetaobjectDefinition`, `InventoryTransfer`.
**Vì sao đáng đọc:** Có thể subscribe **thay đổi metafield có target cụ thể** (vd chỉ khi field `title` của một metaobject đổi) thay vì nhận mọi update — giảm hẳn noise nếu Joy Loyalty lưu config/tier data dưới dạng metaobject.

## [Invalid metafield queries now return errors in the GraphQL Admin API](https://shopify.dev/changelog/invalid-metafield-queries-now-return-errors-in-the-graphql-admin-api) — (shopify.dev changelog, 24/07/2026)
**Đây là gì:** Trước đây filter metafield sai (field không cho phép filter, definition không tồn tại) bị **âm thầm bỏ qua** và query vẫn trả data — nay Admin API validate filter trước khi chạy và **báo lỗi**.
**Vì sao đáng đọc:** Breaking change ở `2026-10` (hiệu lực 01/10/2026): query loyalty filter customer/order theo metafield có thể đang "chạy đúng" nhờ filter bị ignore, và sẽ vỡ ngay khi bump version — nên audit trước mốc tháng 10.

## [App intents on `admin.app.intent.link` now open as a full-page navigation](https://shopify.dev/changelog/app-intents-on-admin-app-intent-link-now-open-as-a-full-page-navigation) — (shopify.dev changelog, 19/08/2026)
**Đây là gì:** App intent là cách Sidekick (AI assistant trong admin) mở thẳng một màn hình của app. Target `admin.app.intent.link` giờ điều hướng **full page** thay vì mở overlay modal, khớp với hành vi intent native của admin.
**Vì sao đáng đọc:** Không cần đổi config, nhưng phải tự kiểm tra route render ổn ở **full width** (layout Polaris đang thiết kế cho modal hẹp sẽ trông lệch) — còn `admin.app.intent.render` vẫn giữ nguyên dạng overlay.

## [Native is now the future of mobile at Shopify](https://shopify.engineering/back-to-native) — (shopify.engineering, Mustafa Ali, 10/09/2026)
**Đây là gì:** Shopify rời React Native, quay lại Swift + Kotlin native, lý do chính là AI coding agent đã làm mất lợi thế kinh tế của việc share code giữa hai platform (LLM implement feature trên platform này rồi dùng platform kia làm reference).
**Vì sao đáng đọc:** Shop app đã ship native, Shopify app đang migrate — đáng theo dõi vì ảnh hưởng tới cách extension/app hiển thị trong mobile admin; ngoài ra Restyle bị archive, FlashList và React Native Skia vẫn được support (Skia đến hết 2026).
