# Shopify Catalog

**Shopify Catalog** là hệ thống dữ liệu sản phẩm chuẩn hóa của Shopify, cho phép AI agent truy cập product data nhất quán từ merchant mà không cần crawl web. Catalog chia thành hai interface: **Global Catalog** (cross-merchant) và **Storefront Catalog** (single merchant).

---

## Hai loại Catalog

| | Global Catalog | Storefront Catalog |
|---|---|---|
| **Scope** | Toàn bộ Shopify merchant | Một merchant duy nhất |
| **Endpoint** | `https://catalog.shopify.com/api/ucp/mcp` | `https://{storeDomain}/api/ucp/mcp` |
| **Use case** | Cross-merchant discovery, comparison shopping | Single-store agent, storefront AI |
| **lookup_catalog limit** | Tối đa 50 ID/request | Tối đa 10 ID/request |
| **search pagination limit** | 1-50, default 10 | 1-250, default 10 |
| **Max search depth** | 1,000 results | Docs chưa đề cập giới hạn cụ thể |

---

## 3 Tool chung (cả hai interface)

### 1. `search_catalog`

Tìm kiếm sản phẩm bằng text query, image, hoặc product similarity.

**Khả năng search:**
- **Text search**: natural language query ("trail running shoes under $100")
- **Image search**: truyền ảnh qua `catalog.like` để tìm sản phẩm visually similar
- **Multimodal**: kết hợp text + image
- **Semantic intent**: trường `context.intent` cho agent mô tả preference của buyer

### 2. `lookup_catalog`

Tra cứu sản phẩm/variant theo identifier đã biết. Chấp nhận:
- `gid://shopify/p/{upid}` (Universal Product ID — chỉ Global)
- `gid://shopify/Product/{id}`
- `gid://shopify/ProductVariant/{id}`
- HTTP/HTTPS Shopify product URL

### 3. `get_product`

Lấy full detail của 1 sản phẩm, bao gồm variant narrowing theo option selections (Color, Size...). Response gồm `available` và `exists` signal cho từng option value.

---

## Product Data Structure

Mỗi product trong response chứa:

```json
{
  "id": "gid://shopify/Product/1001",
  "handle": "fair-trade-organic-whole-bean",
  "title": "Fair Trade Organic Whole Bean Coffee",
  "description": { "html": "..." },
  "url": "https://business.example.com/products/...",
  "categories": [
    { "value": "413", "taxonomy": "google_product_category" },
    { "value": "fb-1-2-3", "taxonomy": "shopify" },
    { "value": "Food > Coffee", "taxonomy": "merchant" }
  ],
  "price_range": {
    "min": { "amount": 1899, "currency": "USD" },
    "max": { "amount": 3499, "currency": "USD" }
  },
  "media": [{ "type": "image", "url": "...", "alt_text": "..." }],
  "options": [
    {
      "name": "Bag size",
      "values": [{ "label": "12 oz" }, { "label": "2 lb" }]
    }
  ],
  "variants": [
    {
      "id": "gid://shopify/ProductVariant/2001",
      "sku": "FT-ORG-WB-12OZ",
      "title": "12 oz",
      "price": { "amount": 1899, "currency": "USD" },
      "availability": { "available": true },
      "checkout_url": "...",
      "seller": {
        "name": "Example Store",
        "links": [{ "type": "refund_policy", "url": "..." }]
      }
    }
  ],
  "rating": { "value": 4.7, "scale_max": 5, "count": 312 }
}
```

> **Lưu ý**: Giá luôn ở **minor units** (cent cho USD). 1899 = $18.99.

---

## Merchant Participation

- Merchant đủ điều kiện tham gia Global Catalog **mặc định**.
- Agent có thể filter kết quả theo shop cụ thể tại runtime.
- Merchant quản lý product data (title, description, image, category, variant, pricing, inventory) qua Shopify admin bình thường.
- Shopify tự **infer** attribute thiếu và **cluster** sản phẩm trùng lặp giữa các store.
- Image **không được cache** — phải render real-time.

---

## Saved Catalogs

Feature của Global Catalog: lưu configuration parameters (price range, shipping origin, taxonomy...) trong Dev Dashboard để không phải lặp lại mỗi request.

Nếu cung cấp slug của saved catalog, parameters và filters của nó **luôn được ưu tiên** (take precedence) so với request params.

---

## Promoted Placements (Sponsored Products)

Xem chi tiết: [[Promoted Placements]]

---

## Filter Types

| Filter | Mô tả | Giá trị |
|---|---|---|
| `price` | Khoảng giá (minor units) | `{ "min": 5000, "max": 15000 }` |
| `condition` | Tình trạng sản phẩm | `new`, `secondhand` |
| `ships_to` | Quốc gia giao hàng | ISO 3166-1 alpha-2 (`US`, `VN`...) |
| `ships_from` | Quốc gia gốc | ISO 3166-1 alpha-2 |
| `available` | Còn hàng | boolean |
| `attributes` | Taxonomy attribute | Color, Size, Target gender |
| `rating` | Đánh giá tối thiểu | 0-5, kèm review count threshold |
| `price_tier` | Phân khúc giá | `low`, `medium`, `high` |
| `shops` | Giới hạn merchant | Shop GID (tối đa 1,000) |
| `categories` | Danh mục | Taxonomy values |

---

## Pagination

- Cursor-based với opaque string từ response trước
- `total_count` là giá trị **ước lượng**, không chính xác
- `has_next_page` trả `false` khi hết depth limit

---

## Docs gốc

- About Catalogs: https://shopify.dev/docs/agents/catalog
- Global Catalog MCP: https://shopify.dev/docs/agents/catalog/global-catalog
- Storefront Catalog MCP: https://shopify.dev/docs/agents/catalog/storefront-catalog
- Catalog MCP server: https://shopify.dev/docs/agents/catalog/mcp
- Search Catalog walkthrough: https://shopify.dev/docs/agents/get-started/search-catalog
