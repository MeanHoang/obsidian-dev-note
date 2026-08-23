# Shopify Editions Spring '26 — APIs: Metafields, Metaobjects, Collections, Inventory

> Nhóm updates lớn nhất về data layer: metafield/metaobject API đơn giản hóa, ShopifyQL hỗ trợ metafields, bulk queries nhanh 4x, Collections API mới, Inventory idempotency, SKU sharing mặc định, webhook field triggers.

---

## 1. Streamlined Metafields and Metaobjects API

API version **2026-07** thêm property `values` mới cho metaobject — read/write gọn hơn đáng kể.

### Thay đổi chính

| Aspect | `values` (mới) | `field`/`fields` (legacy) |
|--------|----------------|--------------------------|
| Read | JSON-compatible object, không cần deserialize | Cần xử lý từng field riêng |
| Write | Gửi JSON object match field keys, API tự serialize | Gửi từng field definition |
| Behavior | **Replace-style** — field không gửi sẽ bị clear | **Patch-style** — field không gửi giữ nguyên |
| Status | Mới, recommended | Vẫn available cho metadata access (field `type`) |

### Impact

- Giảm boilerplate khi CRUD metaobject phức tạp (loyalty tier, custom entity)
- **Lưu ý:** `values` dùng replace-style — nếu omit field trong mutation, field đó bị clear. Dùng `fields` nếu cần patch-style update

**Availability:** GA (API version 2026-07)
**Docs:** https://shopify.dev/changelog/streamlined-metaobject-api

---

## 2. Declarative Metaobjects Don't Require Scopes

App-owned metaobject **không cần khai báo scope** nữa. Data migrate tự động khi app install.

**Impact:** Đơn giản hóa app setup — giảm friction khi merchant install app.

**Availability:** GA
**Docs:** https://shopify.dev/changelog/metaobject-scopes-not-required-for-app-metaobjects

---

## 3. Metafields in ShopifyQL

ShopifyQL hỗ trợ **metafield** làm dimension và filter, sử dụng **dot-syntax** trong Analytics API và online editor.

### Ví dụ

Filter revenue theo custom metafield:
```
product.custom.tier
```

**Impact:** Query analytics dựa trên custom data mà không cần export ra hệ thống ngoài.

**Availability:** GA
**Docs:** https://shopify.dev/docs/api/shopifyql#metafields

---

## 4. Parallel Reads for Bulk Queries (4x Faster)

Bulk query nhanh **gấp 4 lần** nhờ parallel read — nhiều read operation chạy đồng thời.

### Cải tiến thêm

- Hỗ trợ **tất cả mutation types** cho bulk operations
- Cho phép **tối đa 5 concurrent bulk operations** cùng lúc
- Tích hợp trong [[03 - Shopify CLI|Shopify CLI]]

**Impact:** Data sync/export lớn (product catalog, order history) nhanh hơn đáng kể. Không cần thay đổi code — optimization tự động.

**Availability:** GA
**Docs:** https://shopify.dev/changelog/bulk-queries-now-execute-faster

---

## 5. New Collections API

API mới cho collection với **composable source group**, **variant-level condition**, và **exclusion rule**.

### Mutation chính

```graphql
mutation collectionConditionsSourceCreate($input: CollectionCreateConditionsSourceInput!) {
  collectionConditionsSourceCreate(input: $input) {
    source {
      id
      title
      description
      shareable
      targetType    # PRODUCTS
      inclusion {
        matchType   # ALL | ANY
        conditions { ... }
        selections { ... }
      }
    }
    userErrors { field message }
  }
}
```

### Input fields

| Field | Type | Mô tả |
|-------|------|--------|
| `title` | String | Tên source |
| `description` | String | Mô tả |
| `inclusion.matchType` | Enum: `ALL`, `ANY` | Logic match conditions |
| `inclusion.conditions` | Array | Conditions (ví dụ: `ProductTag` với `TAGGED_WITH`) |
| `inclusion.selections` | Array | Explicit product selections via `productId` |

### Condition types

Ví dụ `CollectionSourceInclusionConditionProductTag`:
- `relation`: `TAGGED_WITH`
- `values`: array of tag strings
- `matchType`: `ANY` hoặc `ALL`

### Đặc điểm

- Source **shareable** — có thể link vào nhiều collections
- Hỗ trợ variant-level conditions (không chỉ product level)
- Scope cần: `write_products`
- Không available trên Starter/Retail plans

**Availability:** Beta/Preview (API version 2026-07)
**Docs:** https://shopify.dev/docs/api/admin-graphql/2026-07/mutations/collectionConditionsSourceCreate

---

## 6. Inventory API — Idempotency

Inventory API có **idempotency protection** — ngăn duplicate write khi retry.

### Cách implement

**Method 1: Idempotency key argument**
```graphql
inventoryAdjustQuantities(input: $input) {
  idempotencyKey: "3f5b6ebf-143c-4da5-8d0f-fb8553bfd85d"
}
```

**Method 2: @idempotent directive**
```graphql
inventoryAdjustQuantities(input: $input) @idempotent(key: "3f5b6ebf-143c-4da5-8d0f-fb8553bfd85d") {
  ...
}
```

### Mutations hỗ trợ

| Mutation | Idempotency |
|----------|-------------|
| `inventoryAdjustQuantities` | Cần idempotency key |
| `inventoryTransferSetItems` | Cần idempotency key (non-idempotent side operations) |
| `inventoryShipmentUpdateItemQuantities` | Naturally idempotent (không cần key) |

### Bulk operations

Trong bulk operations, idempotency key truyền qua variables trong JSONL input file — apply **per row**, không phải toàn bộ operation.

**Best practice:** Dùng UUID v4 random cho idempotency key. Retry khi gặp `5xx`, `429`, timeout, network error. Token invalid chỉ khi nhận `401` với `error: "invalid_request"`.

**Availability:** GA
**Docs:** https://shopify.dev/docs/api/usage/idempotent-requests

---

## 7. SKU Sharing by Default — Breaking Change

Field **`permitsSkuSharing`** bị remove từ `FulfillmentService` object.

### Timeline

| Mốc | Sự kiện |
|------|---------|
| 19/12/2025 | Announced |
| 16/02/2026 | Effective — field removed |
| API 2026-04+ | Query/mutation dùng field này sẽ error |

### Breaking changes

| API | Impact |
|-----|--------|
| **GraphQL** | Query `permitsSkuSharing` hoặc gửi trong `fulfillmentServiceCreate`/`fulfillmentServiceUpdate` → error |
| **REST** | GET không trả field, POST/PUT ignore argument |

### Migration

1. Remove tất cả reads/writes `permitsSkuSharing` trong code targeting API 2026-04+
2. Audit business logic rely on single-location inventory restriction
3. Test multi-location inventory scenarios

**Behavior mới:** Inventory mặc định stock tại **nhiều location** cho bất kỳ fulfillment service nào.

**Availability:** GA
**Docs:** https://shopify.dev/changelog/removing-permitsskusharing-field-from-fulfillment-service

---

## 8. Webhook Field Triggers

Cấu hình webhook chỉ fire khi **field cụ thể** thay đổi + custom GraphQL query cho payload.

### TOML configuration

```toml
[[events.subscription]]
handle = "subscription-name"
topic = "Product"
actions = ["update"]
triggers = ["product.variants.price"]
uri = "https://your-app.example.com/events"
```

### Custom GraphQL query cho payload

```graphql
query product_with_metafields($productId: ID!) {
  product(id: $productId) {
    id
    title
    metafield(namespace: "$app", key: "my_key") {
      namespace
      key
      value
    }
  }
}
```

### Query filters

Suppress deliveries theo condition:
```toml
query_filter = "product.status:'ACTIVE'"
```

### Limitations

- Hiện ở **developer preview** trên `unstable` API version
- Không phải tất cả GraphQL Admin objects đều supported — check Events reference

**Impact:** Giảm noise webhook đáng kể. App chỉ nhận event + data cần thiết, tiết kiệm compute và bandwidth.

**Availability:** GA (triggers), Developer Preview (custom queries trên unstable)
**Docs:** https://shopify.dev/docs/apps/build/events

---

## Nguồn

- https://shopify.dev/changelog/streamlined-metaobject-api
- https://shopify.dev/changelog/metaobject-scopes-not-required-for-app-metaobjects
- https://shopify.dev/docs/api/shopifyql#metafields
- https://shopify.dev/changelog/bulk-queries-now-execute-faster
- https://shopify.dev/docs/api/admin-graphql/2026-07/mutations/collectionConditionsSourceCreate
- https://shopify.dev/docs/api/usage/idempotent-requests
- https://shopify.dev/changelog/removing-permitsskusharing-field-from-fulfillment-service
- https://shopify.dev/docs/apps/build/events
