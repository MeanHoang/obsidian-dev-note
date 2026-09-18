# 🛒 Shopify — 2026-09-18

> Tuần này Shopify khai tử developer preview của Discounts Allocator Function API, siết bundle size cho UI extension (deadline 01/10), và mở loạt API mới trên version 2026-10: market hierarchy, pricing audit trail.

## ⭐ [Discounts Allocator Function API developer preview đã kết thúc](https://shopify.dev/changelog/discounts-allocator-function-api-developer-preview-has-ended) — (shopify.dev/changelog)

**Đây là gì:** Discounts Allocator Function API là một loại Shopify Function (code WASM chạy trên hạ tầng Shopify, can thiệp vào logic checkout) cho phép app tự quyết định **cách phân bổ số tiền giảm giá xuống từng cart line**. Nó từng ở giai đoạn developer preview, và Shopify vừa tuyên bố ngừng hẳn — không lên production.

**Chi tiết:**
- Lý do Shopify đưa ra: khả năng kiểm soát discount native đã cải thiện, "including stacking multiple product discounts on the same line" — tức là đã cho stack nhiều product discount trên cùng một dòng, nên không cần allocator riêng.
- Hai mutation `discountsAllocatorFunctionRegister` và `discountsAllocatorFunctionUnregister` bị gỡ khỏi Admin GraphQL API bản `unstable`. Các function đã register bị **tự động unregister**.
- Mốc thời gian: preview đóng **10/09/2026**, hiệu lực **29/09/2026**. Docs và tutorial đã bị delist.
- **Action required:** phải xoá extension target `purchase.discounts-allocator.run` khỏi app config. Nếu còn để lại, deploy sẽ fail với lỗi `API not found for target: purchase.discounts-allocator.run`.
- Đường đi tiếp theo: dùng **Discount Function API** thông thường (`cartLinesDiscountsGenerate` / discount function targets) thay thế.

**Vì sao đáng đọc:** Joy Loyalty sinh discount từ điểm/tier/reward, và bài toán "phân bổ giảm giá khi khách redeem trùng nhiều reward" đúng là thứ allocator API hứa giải quyết. Nếu team từng thử nghiệm target này trong app config (kể cả chỉ để test), phải grep và xoá trước 29/09 kẻo build/deploy gãy. Mặt tích cực: native stacking nhiều product discount trên cùng line nghĩa là reward của Joy có thể cộng dồn với discount khác mà không cần hack.

## ⭐ [Xin exception cho bundle size của UI extension đang có](https://shopify.dev/changelog/request-a-bundle-size-exception-for-existing-ui-extensions) — (shopify.dev/changelog)

**Đây là gì:** UI extension (Admin extension, Checkout UI, Customer Accounts, POS) là các mảnh giao diện app nhúng thẳng vào Shopify. Từ API version `2025-10` trở đi, Shopify áp **giới hạn 64 KB JS đã nén mỗi extension** (riêng full-page customer account extension được 128 KB). Changelog này mở form xin nâng giới hạn cho extension cũ trót vượt ngưỡng.

**Chi tiết:**
- Giới hạn: **64 KB compressed JS / extension**; full page customer account extension tối đa **128 KB**. Áp dụng cho API version 2025-10 trở lên.
- Hiệu lực **18/09/2026**. Deadline quan trọng: **01/10/2026** — mọi UI extension đang tồn tại phải chạy **API version 2026-01 trở lên** thì mới còn deploy được.
- Loại extension bị ảnh hưởng: Admin Extensions, Checkout UI, Customer Accounts, POS Extensions.
- Quy trình xin exception: chạy `shopify app build`, rồi nộp bundle đã minify kèm **esbuild metafile** qua form chính thức. Shopify review nội dung bundle và "may grant a limit increase if the remaining bundle weight is unavoidable".
- Sẽ bị **từ chối** nếu phần nặng là thứ tránh được: thư viện nặng, dependency trùng lặp, hoặc nhét bản dịch vào bundle thay vì dùng localization API native.

**Vì sao đáng đọc:** Joy Loyalty có widget/extension hiển thị điểm và reward ở checkout + customer account — đây là nơi dễ phình bundle nhất (date lib, i18n strings, icon set). Deadline 01/10 rất gần: cần kiểm tra `shopify.extension.toml` xem api_version đã ≥ 2026-01 chưa, chạy `shopify app build` đọc esbuild metafile để biết cái gì đang ngốn KB. Bản dịch tiếng Việt/đa ngôn ngữ nếu đang hardcode trong JS thì nên chuyển sang locale files ngay, vì đó chính là lý do bị reject.

## [Query market hierarchy bằng GraphQL Admin API](https://shopify.dev/changelog/market-relationships) — (shopify.dev/changelog)

**Đây là gì:** Markets là tính năng Shopify để merchant bán ra nhiều quốc gia/vùng với giá, tiền tệ, domain riêng. Admin API 2026-10 bổ sung khả năng đọc **quan hệ cha–con giữa các market**: query mới `marketRelationships` (trả về connection của `MarketRelationship` gồm parent và child), cùng field `parentMarkets`/`parentMarketsCount` và `childMarkets`/`childMarketsCount` trên object `Market`. Có thêm query `marketRelationshipsStatus` trả về một giá trị `version` mờ (opaque) để biết dữ liệu quan hệ — vốn được rebuild bất đồng bộ — đã cập nhật xong chưa. Yêu cầu API 2026-10+ và scope `read_markets`.

**Vì sao đáng đọc:** Nếu Joy Loyalty có logic earning/redemption phân biệt theo thị trường (ví dụ tỉ lệ điểm khác nhau theo currency/market), giờ có thể suy ra market cha để kế thừa cấu hình thay vì bắt merchant set tay từng market. Lưu ý pattern Shopify khuyến nghị: đọc `version` trước khi đổi hierarchy, poll lại sau, nếu version đổi thì **restart pagination và refetch** — đừng cache phẳng kết quả.

## [Pricing audit trail cho contextual product variant price](https://shopify.dev/changelog/pricing-audit-trail-for-contextual-product-variant-prices) — (shopify.dev/changelog)

**Đây là gì:** "Contextual pricing" là giá của một variant sau khi Shopify áp price list, quy đổi tiền tệ, thuế, phí, làm tròn cho một ngữ cảnh cụ thể (market/company location). Trước đây app chỉ thấy con số cuối. Admin API 2026-10 thêm field `ProductVariantContextualPricing.auditTrail` trả về object `PricingAuditTrail` chứa danh sách `AuditTrailAdjustment`, mỗi bước có `type` (ADDITION, MULTIPLICATION, REPLACEMENT), `value`, `price` sau điều chỉnh và `label` mô tả cho người đọc. Cần scope `read_products`, hiệu lực **30/09/2026**. Hạn chế: mới chỉ hỗ trợ product variant, **chưa** hỗ trợ order line item hay draft order line item; nếu không dựng được audit trail đầy đủ thì trả về list rỗng chứ không trả một phần.

**Vì sao đáng đọc:** Hữu ích khi support merchant thắc mắc "sao đơn này tính điểm ít hơn giá niêm yết" — giờ có thể truy ngược từng bước giá. Nhưng đọc kỹ giới hạn: Joy Loyalty tính điểm theo order line, mà order line thì audit trail chưa cover, nên đây là công cụ debug/đối chiếu chứ chưa thay được logic tính điểm.

## [POS UI Extensions bỏ `session.currentSession.staffMemberId` ở version 2026-10](https://shopify.dev/changelog/removed-session-currentsession-staffmemberid-from-pos-ui-extensions-2026-10) — (shopify.dev/changelog)

**Đây là gì:** Breaking change trong POS UI Extensions (phần mở rộng giao diện cho app Shopify POS bán tại cửa hàng). Field tĩnh `session.currentSession.staffMemberId` bị gỡ vì không phản ánh được việc nhân viên đổi ca theo thời gian thực. Thay bằng `session.staffMember.value?.id` để đọc, và `session.staffMember.subscribe()` (hoặc để component Preact tự re-render khi import từ `@shopify/ui-extensions/preact`) để nhận cập nhật khi staff đổi. Chỉ ảnh hưởng API version **2026-10**, hiệu lực **17/09/2026**; extension nhắm 2026-07 trở về trước không bị ảnh hưởng. Field `session.staffMemberId` riêng cho receipt target giữ nguyên.

**Vì sao đáng đọc:** Nếu Joy Loyalty có POS extension để nhân viên cộng/trừ điểm tại quầy, phần attribute "ai là người thao tác" sẽ vỡ ngay khi bump lên 2026-10. Đây là kiểu chuyển từ giá trị tĩnh sang signal reactive — sửa không khó nhưng phải nhớ handle `undefined` vì dấu `?.` trong signature đã ngụ ý giá trị có thể chưa sẵn sàng.

## [Tạo và xoá dev store ngay trong Shopify CLI](https://shopify.dev/changelog/create-and-delete-dev-stores-in-shopify-cli) — (shopify.dev/changelog)

**Đây là gì:** Shopify CLI 4.8 thêm 4 lệnh `shopify store`: `create dev` (tạo dev store trong organization để build/test app, theme), `delete` (chỉ store owner, org owner hoặc admin chạy được), `list` (liệt kê store trong org) và `info` (xem chi tiết một store). Mỗi organization được tối đa **250 dev store** — giới hạn này chỉ tính dev store, không tính client transfer store và collaborator store.

**Vì sao đáng đọc:** Trước đây tạo dev store phải bấm tay trong Partner Dashboard. Giờ có thể script hoá vòng đời môi trường test: tạo store sạch → seed dữ liệu customer/order → chạy test kịch bản tích điểm → xoá. Rất hợp cho CI của app loyalty, nơi state điểm/tier hay bị bẩn sau mỗi lần test thủ công.

## [Inventory Shipments API có thêm action `canceled receive`](https://shopify.dev/changelog/adding-a-canceled-receive-action-to-the-inventory-shipments-api) — (shopify.dev/changelog)

**Đây là gì:** Inventory Shipments API là phần Admin GraphQL API quản lý các lô hàng nhập kho (chuyển hàng giữa location, nhận hàng từ nhà cung cấp). Changelog ngày 17/09 bổ sung một action mới cho tình huống **huỷ việc nhận hàng** đã ghi nhận.

**Vì sao đáng đọc:** Không trực tiếp chạm tới loyalty, nhưng đáng biết nếu Joy Loyalty có tính năng liên quan tồn kho (ví dụ reward là sản phẩm vật lý, cần trừ kho khi khách đổi điểm) — luồng huỷ nhận hàng có thể làm inventory level nhảy ngược, ảnh hưởng tính khả dụng của reward.
