# 🛒 Shopify — 2026-09-24

> Tuần này có 2 thay đổi về giới hạn API cần xử lý ngay (Events giảm complexity limit còn 100 điểm, `metafieldsSet` chuyển sang tính cost động), thêm Polaris CDN 1.1 stable và 2 breaking change trên API 2027-01 (discount countries, market currency).

## ⭐ [Events subscription query complexity limit is changing to 100 points](https://shopify.dev/changelog/events-subscription-query-complexity-limit-is-changing-to-100-points) — (shopify.dev changelog, 22/09/2026)
**Đây là gì:** Events là cơ chế subscription thế hệ mới của Shopify (song song với Classic Webhooks): app đăng ký topic kèm một GraphQL query để chọn đúng dữ liệu muốn nhận trong payload. Mỗi query có "complexity" (điểm chi phí) và bị giới hạn trần.
**Chi tiết:**
- Trần complexity cho Events subscription giảm từ **250 xuống 100 điểm**; chỉ áp dụng cho Events subscriptions, **không** áp dụng cho Classic Webhooks.
- Được gắn nhãn breaking change, action required, có hiệu lực từ 22/09/2026.
- Hướng migrate Shopify đưa ra: rà các subscription đang vượt 100 điểm; tách thành nhiều subscription cho cùng một topic với các query khác nhau; chỉ query resource thay đổi thay vì cả object cha; dùng các variables có sẵn để tách subscription theo trigger.
- Ví dụ trong bài: với thay đổi giá variant, hãy query price, SKU và Product ID của chính variant đó, "instead of fetching the Product's first 250 variants".
**Vì sao đáng đọc:** Nếu Joy Loyalty đã (hoặc đang tính) chuyển các luồng như orders/customers sang Events với query lấy luôn line items + customer + metafields, query rất dễ vượt 100 điểm → subscription lỗi, mất event cộng điểm. Nên audit query và tách subscription trước khi mở rộng dùng Events.

## ⭐ [Dynamic complexity cost for `metafieldsSet` mutation](https://shopify.dev/changelog/dynamic-complexity-cost-for-metafieldsset-mutation) — (shopify.dev changelog, 15/09/2026)
**Đây là gì:** `metafieldsSet` là mutation GraphQL Admin API dùng để ghi hàng loạt metafield (trường dữ liệu tuỳ biến gắn vào customer, order, product, shop...). Trước đây mỗi lần gọi có cost cố định.
**Chi tiết:**
- Trước: mỗi call tốn cố định **10 điểm**. Sau: "base cost (10) + the sum of the costs for each distinct resource owner type in your mutation".
- Trọng số theo owner: Order 10 điểm, Product 4, ProductVariant 2, Collection/Customer/Shop mỗi loại 1; các owner type khác 0.
- Ghi 1 resource: gần như không đổi (10–20 điểm). Ghi nhiều owner khác nhau trong 1 call: tăng mạnh, ví dụ cập nhật 25 order khác nhau giờ tốn **260 điểm thay vì 10**.
- Trang changelog không ghi version cụ thể cho thay đổi này.
**Vì sao đáng đọc:** Joy thường sync điểm/tier vào metafield của customer (rẻ, 1 điểm/owner) nhưng nếu có job batch ghi metafield lên **order** (vd lưu points earned theo đơn) thì cost tăng rất nhanh → cần xem lại batch size và cơ chế throttle trong Cloud Functions/Cloud Run worker, nhất là trước mùa BFCM.

## [Polaris CDN 1.1 is now stable](https://shopify.dev/changelog/polaris-cdn-1-1-is-now-stable) — (shopify.dev changelog, 22/09/2026)
**Đây là gì:** Polaris Web Components là bộ UI component chính thức của Shopify cho app admin, load trực tiếp từ CDN (`polaris.js`) thay vì cài package React. Bản 1.1 vừa lên stable.
**Vì sao đáng đọc:** Có component mới `EmptyState`, `Number` (số căn cột, thay `fontVariantNumeric` bị deprecate), `Progress`, prop `fontSize` cho Heading/Paragraph/Text và `visibleMonths` cho DatePicker. App load `polaris.js`/`polaris-1.js` tự nhận bản mới, muốn pin thì dùng `polaris-1.1.js`. Mấy component này dùng được ngay cho dashboard điểm/thống kê của Joy (bảng member rỗng, progress tới tier tiếp theo).

## [Prepare your app for the Shopify admin's new look](https://shopify.dev/changelog/prepare-your-app-for-the-shopify-admins-new-look) — (shopify.dev changelog, 15/09/2026)
**Đây là gì:** Shopify admin được làm mới giao diện (màu, font, spacing, icon, khung mới; search và notifications chuyển vào sidebar thu gọn được), rollout dần cho merchant từ 15/09/2026.
**Vì sao đáng đọc:** Admin UI extension và App Home UI extension tự đổi theo, không cần sửa code. Riêng App Home tự build (như app React/Polaris của Joy) **vẫn giữ style cũ** cho đến khi migrate. Shopify khuyên cân nhắc chuyển sang Polaris Web Components để chuẩn bị cho Polaris 2.0 RC, và ghi rõ "No action is required before the Polaris 2.0 release candidate becomes available" nên đây là lúc lên kế hoạch, chưa phải làm gấp.

## [Setting includeRestOfWorld to true returns an error in API version 2027-01](https://shopify.dev/changelog/setting-includerestofworld-to-true-returns-an-error-in-api-version-2027-01) — (shopify.dev changelog, 23/09/2026)
**Đây là gì:** `DiscountCountriesInput.includeRestOfWorld` là cờ trong input tạo discount (vd free shipping) để áp dụng cho "mọi quốc gia còn lại". Từ API 2027-01, set `true` sẽ trả lỗi `BAD_REQUEST` ("includeRestOfWorld is no longer supported. Specify the applicable country codes explicitly.").
**Vì sao đáng đọc:** Nếu Joy có reward free shipping tạo qua Admin API và đang dùng `includeRestOfWorld: true`, cần đổi sang liệt kê country code trong `add` trước khi nâng lên 2027-01. Truyền `false`/`null` thì không bị ảnh hưởng, và 2026-10 trở về trước vẫn chạy như cũ.

## [Removing marketCurrencySettingsUpdate mutation](https://shopify.dev/changelog/removing-marketcurrencysettingsupdate-mutation) — (shopify.dev changelog, 22/09/2026)
**Đây là gì:** Markets là tính năng bán hàng đa thị trường (tiền tệ, ngôn ngữ, giá theo vùng). Mutation `marketCurrencySettingsUpdate` (vốn đã deprecated và trả lỗi với mọi request) bị gỡ hẳn ở API 2027-01, thay bằng việc truyền currency settings trực tiếp vào `marketCreate`/`marketUpdate`.
**Vì sao đáng đọc:** Ít khả năng Joy gọi mutation này, nhưng nên grep codebase trước khi bump lên 2027-01: sau thay đổi, request sẽ lỗi ngay ở bước validation chứ không còn trả user error nữa, nên có thể làm hỏng cả query nếu còn sót.
