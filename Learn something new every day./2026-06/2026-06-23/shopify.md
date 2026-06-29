# 🛒 Shopify — 2026-06-23

> Nóng nhất: **mô hình Collection mới** (Action Required, phải lên API 2026-07) đổi `ruleSet` → multi-source `CollectionSource` và thêm field `inCollections/inAnyCollection` cho Shopify Functions — ảnh hưởng trực tiếp logic target sản phẩm trong app loyalty.

## ⭐ [New Collection model and APIs now available](https://shopify.dev/changelog/new-collection-model-and-apis-now-available) — (shopify.dev/changelog, 17/06/2026)
**Đây là gì:** Collection (bộ sưu tập sản phẩm) được nâng cấp từ mô hình 1 `ruleSet` (1 tập điều kiện duy nhất) sang **multi-source model**: mỗi collection có thể có một hoặc nhiều `CollectionSource`. Cho phép trộn nhiều nguồn (điều kiện theo type, chọn tay, lấy từ collection khác) vào cùng 1 collection.
**Chi tiết:**
- **Action Required — Hiệu lực: API version 2026-07.** Phải migrate lên 2026-07 để đọc được TẤT CẢ collection trong shop; collection dùng feature mới sẽ bị lọc bỏ (không trả về) ở các version cũ hơn.
- Type mới: `CollectionConditionsSource` (gồm sản phẩm qua điều kiện + chọn tay), `CollectionSubCollectionsSource` (kéo từ collection được tham chiếu), enum `CollectionSourceTargetType` (target `PRODUCTS` hoặc `VARIANTS`).
- Mutation: `collectionCreate(collection:)`, `collectionUpdate(collection:)` + nhóm shareable source `collectionConditionsSourceCreate/Update/Delete`. Query: `collectionConditionsSources(appId:)`, `collectionConditionsSourcesByApp`, `collectionConditionMetafieldDefinitions`.
- **Shopify Functions:** `ProductVariant` có thêm `inAnyCollection(ids:)` và `inCollections(ids:)` để kiểm tra membership ở cấp variant.
- App đọc/ghi `ruleSet` phải chuyển sang `sources`. Argument `collection` mới ưu tiên hơn argument `input` đã deprecated nếu truyền cả hai.
**Vì sao đáng đọc:** Joy Loyalty thường target reward/earn rule theo collection ("tích điểm x2 cho collection X", "đổi quà chỉ với sản phẩm trong collection Y"). Nếu Function của bạn đang check membership thủ công hoặc đọc `ruleSet`, hai field `inCollections/inAnyCollection` cho phép check ngay trong Function gọn hơn — nhưng cũng phải migrate API lên 2026-07 trước khi collection mới "biến mất" khỏi response cũ.

## ⭐ [Removal of ITEM_NOT_STOCKED_AT_LOCATION error](https://shopify.dev/changelog/removal-of-itemnotstockedatlocation-error) — (shopify.dev/changelog, 19/06/2026)
**Đây là gì:** Shopify bỏ mã lỗi `ITEM_NOT_STOCKED_AT_LOCATION` khỏi các mutation tồn kho (inventory) của Admin GraphQL API. Trước đây lỗi này bắn ra khi cố chỉnh số lượng tại location chưa "stock" item đó.
**Chi tiết:**
- **Action Required — Hiệu lực: API version 2026-10.**
- Lỗi bị gỡ khỏi 4 operation: `InventoryAdjustQuantities`, `InventoryMoveQuantities`, `InventorySetOnHandQuantities`, `InventorySetQuantitiesUserErrorCode`.
- Lý do: nền tảng giờ cho merchant chỉnh quantity ở bất kỳ location nào mà không cần kích hoạt fulfillment trước → điều kiện gây lỗi không còn xảy ra.
- Yêu cầu hành động: gỡ bỏ an toàn mọi logic phụ thuộc vào mã lỗi cụ thể này.
**Vì sao đáng đọc:** Nếu app có nghiệp vụ chạm tồn kho (ví dụ reward dạng "đổi điểm lấy sản phẩm vật lý" rồi trừ kho), code đang catch/branch theo error code này sẽ thành dead code từ 2026-10 — nên dọn để tránh nhánh xử lý chết.

## [Standard storefront events and actions](https://shopify.dev/changelog/standard-storefront-events-and-actions) — (shopify.dev/changelog, 17/06/2026)
**Đây là gì:** Một lớp giao tiếp chuẩn 2 chiều giữa theme Liquid và code chạy trên đó (app, agent). **Events** = tín hiệu theme phát ra (outbound); **Actions** = lệnh app gọi để theme thực thi (inbound).
**Chi tiết:**
- Events: theme phát DOM event như `shopify:product:view`, `shopify:cart:lines-update`. App subscribe bằng JavaScript thường, nhận payload ngay, không cần gọi thêm API.
- Actions: `Shopify.actions.updateCart`, `getCart`, `openCart`... gọi được trên mọi storefront Liquid. Mặc định action tương tác Storefront API và refresh trang; theme dev có thể custom để bỏ reload và tự quản UI. Action chạy thành công sẽ trigger event tương ứng.
- Cả hai hoạt động trên mọi theme và ship cùng nhau → chỉ implement 1 lần. Action Required: Không.
**Vì sao đáng đọc:** Widget loyalty trên storefront (hiển thị điểm, banner reward, cập nhật cart khi apply điểm) thường phải hack vào theme từng store. Lớp event/action chuẩn này cho bạn lắng nghe `cart:lines-update` để recalc điểm và `updateCart` để áp reward mà không cần custom theo từng theme.

## [Define and set metafields on inventory transfers in the GraphQL Admin API](https://shopify.dev/changelog/define-and-set-metafields-on-inventory-transfers-in-the-admin-graphql-api) — (shopify.dev/changelog, 17/06/2026)
**Đây là gì:** Metafield (trường dữ liệu custom gắn lên resource Shopify) nay hỗ trợ owner type mới `TRANSFER` — tức inventory transfer (phiếu chuyển kho) có thể mang dữ liệu tùy biến.
**Chi tiết:**
- Hiệu lực: API version 2026-07. Action Required: Không.
- Định nghĩa metafield với `MetafieldOwnerType.TRANSFER`.
- Truyền metafield trực tiếp trong mutation: `inventoryTransferCreate`, `inventoryTransferCreateAsReadyToShip`, `inventoryTransferEdit` — không cần gọi `metafieldsSet` riêng sau khi tạo.
- `inventoryTransferDuplicate` tự nhân bản metafield kèm theo.
**Vì sao đáng đọc:** Liên quan gián tiếp với loyalty, nhưng đáng nắm vì metafield là công cụ dùng hàng ngày của bạn — nay có thêm một owner type, và pattern "set metafield ngay trong mutation create" áp dụng được cho các resource khác.

## [Flow action extensions now support relative paths for endpoint URLs](https://shopify.dev/changelog/flow-action-extensions-now-support-relative-paths-for-endpoint-urls) — (shopify.dev/changelog, 18/06/2026)
**Đây là gì:** Flow action extension (extension cho phép app cung cấp "action" dùng trong Shopify Flow — công cụ tự động hóa workflow của merchant) giờ chấp nhận đường dẫn tương đối (bắt đầu bằng `/`) cho endpoint URL, thay vì bắt buộc URL HTTPS tuyệt đối.
**Chi tiết:**
- Action Required: Không.
- Các property như `runtime_url`, `validation_url` nhận được path kiểu `/api/flow/actions/place-bid`.
- Khi dev: Shopify CLI resolve path theo tunnel URL; khi deploy: resolve theo `application_url` của app → không phải sửa URL thủ công mỗi lần đổi tunnel.
- URL tuyệt đối vẫn cần khi endpoint ở domain khác hoặc muốn nhất quán giữa các môi trường.
**Vì sao đáng đọc:** Nếu Joy Loyalty cung cấp Flow action (ví dụ "cộng điểm khi đơn hoàn tất", "nâng tier khi đạt chi tiêu"), QoL nhỏ này giảm friction giữa local dev và production trên Cloud Run/Firebase — đỡ phải đồng bộ tunnel URL bằng tay.

## [Monitor admin web vitals in the Dev Dashboard](https://shopify.dev/changelog/monitor-admin-web-vitals-in-the-dev-dashboard) — (shopify.dev/changelog, 17/06/2026)
**Đây là gì:** Theo dõi Core Web Vitals (chỉ số trải nghiệm web: LCP, INP, CLS) cho phần admin embed của app, dời từ Partner Dashboard sang Dev Dashboard.
**Chi tiết:**
- Action Required: Không. Telemetry hiện có vẫn chạy nguyên, link cũ ở Partner Dashboard tự redirect sang Dev Dashboard.
- Hiển thị rollup P75 theo ngày và 28 ngày, kèm trạng thái pass/fail theo chuẩn Built for Shopify.
**Vì sao đáng đọc:** UI admin của Joy Loyalty (React/Polaris embed) phải đạt chuẩn web vitals để giữ/đạt Built for Shopify. Đây là nơi mới để xem điểm pass/fail trước khi BFS review.
