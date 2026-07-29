# Markets & Localization - Editions Spring 2026

Các update liên quan đến Shopify Markets: graph view trực quan, sales channel control, variant-level publishing, và product compliance disclosure.

---

## Visualized markets graph

Hiển thị toàn cảnh cấu hình Shopify Markets dưới dạng graph trực quan, cho thấy cách settings flow từ parent markets xuống submarkets.

### Cách hoạt động

Markets được hiển thị dưới dạng interconnected nodes. Mỗi node chứa các expandable sections:

| Section | Hiển thị |
|---------|----------|
| **Countries and Regions** | Flag icons; click để xem active sales channels |
| **Localization** | Domain, languages, theme và language settings |
| **Products** | Product count, currency, catalog và price override details |
| **Discounts** | Discount count với types (Automatic, Code) |
| **Business Entity** | Entity name, full entity details |
| **Checkout** | Configuration; editable qua checkout editor |
| **Taxes and Duties** | Collection status, detailed tax/duty settings |

### Cách truy cập

Markets page trong Shopify admin > click **"Graph view"** > dùng search function để tìm market cụ thể.

**Tính năng đặc biệt:**
- **Checkout Preview** - chỉ available cho Online Store markets; truy cập qua Taxes and Duties section
- **Sidekick Integration** - preset prompts ở bottom của graph cho quick configuration questions

**Availability:** Merchant sử dụng Shopify Markets.

---

## Sales channel control in markets

Tùy chỉnh product availability, pricing, và currency cho từng sales channel trong Shopify Markets.

### Cách hoạt động

Channel markets cho phép merchant group nhiều channels dưới 1 market hoặc tạo individual market cho từng channel.

**Cấu hình:**
- **Product availability** - products từ cả channel và parent market hiển thị cùng nhau; tất cả products phải được publish lên sales channel
- **Pricing & currency** - channel market có thể set giá riêng; currency nên match với preferred option của sales channel
- **Regions** - selected regions phải align với sales channel's supported regions

### Traffic-generating vs Order-generating channels

| Channel type | Purchase location | Pricing flexibility |
|---|---|---|
| **Traffic-generating** (Facebook, Google) | Online store | Phải match store pricing |
| **Order-generating** (TikTok, Temu) | Third-party platform | Có thể khác store pricing |

### Limitations

- Agentic storefronts hiện chưa available cho channel markets
- Custom catalog pricing trên traffic-generating channels sẽ tạo warning

**Availability:** Merchant sử dụng Shopify Markets.

---

## Variant-level publishing for products

Kiểm soát việc publish từng variant riêng lẻ theo channel và market.

### Cách hoạt động

**Nguyên tắc chính:** Cả parent product VÀ variant đều phải được publish lên channel/catalog mới hiển thị.

- Nếu product chưa publish lên channel → tất cả variants ẩn, bất kể variant settings
- Khi product đã publish → chỉ những variant được publish mới hiển thị
- Nếu tất cả variants bị unpublish → parent product tự ẩn cho đến khi ít nhất 1 variant được republish

### Setup

3 cách:
1. Quản lý individual variant trên product details page
2. Edit qua variant details page
3. **Bulk editing tool** (chỉ desktop) cho nhiều products cùng lúc

**New variants** mặc định ở trạng thái published, trừ khi parent product chưa publish hoặc merchant manual unpublish trước khi save.

### Limitations

- Không thể set publishing date cho individual variants
- Custom catalog pricing không áp dụng cho unpublished variants
- Variant publishing settings chỉ hoạt động khi parent product đã publish lên channel/catalog đó

**Availability:** Tất cả Shopify store (desktop và mobile app).

---

## Product compliance disclosure

Thêm cảnh báo bắt buộc (mandatory warnings) lên sản phẩm và hiển thị trên nhiều channel.

### Cách hoạt động

Merchant thêm disclosures vào product, chúng hiển thị trên:
- Online store
- Shop app (version 2.239.0+ required)
- Custom storefronts (qua Storefront API)
- Third-party sales channels

**Loại disclosures phổ biến:**
- **Chemical Exposure** - Prop 65 Cancer Warning (California Proposition 65)
- **Choking Hazards** - cảnh báo cho trẻ em dưới 3 hoặc 5 tuổi

### Implementation

Sử dụng **Shopify Disclosures Metaobject** với editable fields cho title, content, và symbol. Connect qua metafield references trên product.

**Cách thêm:**
1. Products > chọn product > Product metafields > Disclosures
2. Chọn existing disclosure hoặc tạo custom entry
3. Edit title, content, symbol, jurisdictions, display preferences
4. Save

**Bulk methods:** Products bulk editor, CSV import (field `shopify.disclosure`), hoặc thêm khi tạo product bundles.

### Hiển thị

- Product pages (online store và Shop)
- Cart page (optional qua Display preferences)
- Third-party channels qua Storefront API

**Theme:** Shopify free themes cần update lên latest version và thêm Disclosures block/section. Third-party themes cần verify với developer.

### Lưu ý

- Merchant chịu trách nhiệm xác nhận suitability cho products và business
- Jurisdictions field xác định legal display requirements theo region
- Staff cần View + Create/edit permissions cho Products và Metaobjects
- Changes tới disclosure entry áp dụng cho TẤT CẢ associated products

**Availability:** Tất cả plan.

---

## Nguon

- [Markets graph view](https://help.shopify.com/manual/markets/graph-view)
- [Channel markets](https://help.shopify.com/manual/online-sales-channels/channel-markets)
- [Publish variants](https://help.shopify.com/en/manual/products/variants/publish-variants)
- [Product disclosures](https://help.shopify.com/manual/products/product-disclosures)
- [Shopify Editions Spring 2026](https://www.shopify.com/editions/spring2026) - truy cap 2026-07-29
