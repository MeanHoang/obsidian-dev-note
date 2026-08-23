# Fixed Bundles tren Google & Meta

Publish pre-configured product bundle len Google Shopping va Meta platforms.

---

## Cach hoat dong

Bundle san pham da cau hinh san trong Shopify duoc sync tu dong len cac platform quang cao:

- **Google & YouTube sales channel**: Ho tro **fixed product bundles only** (theo docs: "sell bundles through the Online Store, Shop, and Shopify POS sales channels, and on the Google & YouTube sales channel with fixed product bundles only")
- **Meta (Facebook, Instagram)**: Product data duoc sync qua Meta Commerce Manager, nhung **bundles khong duoc ho tro trong Meta's direct checkout** ("custom pixels or product bundles, aren't supported in Meta's direct checkout")

### Sync process

- **Google**: Google & YouTube channel tu dong sync products va store info voi Google Merchant Center
- **Meta**: Product details trong Shopify tu dong sync sang Facebook, bao gom Google Product Category va product data khac

---

## Fixed Bundle la gi?

Fixed bundle la loai bundle voi cac component co dinh, khong cho customer chon variant:

| Thong so | Gioi han |
|----------|----------|
| So component toi da | 30 |
| So unit toi da moi component | 2,000 |
| So options toi da | 3 |
| So variants toi da | 100 |

### Tao fixed bundle

1. Cai **Shopify Bundles** app
2. Chon individual products lam components
3. Dieu chinh quantities va variants
4. Chuyen status tu Draft sang **Active** de publish

---

## Gioi han

- Chi **fixed bundles** duoc ho tro tren Google & YouTube channel - cac loai bundle khac (multipack, mix-and-match) khong ho tro
- Tren Meta: bundles **khong ho tro direct checkout** tren Meta surfaces
- "Bundled products don't appear under option filters due to index naming" - co the anh huong discoverability tren comparison shopping platforms
- Subscriptions, bundles, va preorders khong duoc ho tro tren **Shopify Product Network** (trong Shop Campaigns - xem [[03 - Shop Campaigns]])

---

## Supported platforms

| Platform | Ho tro | Ghi chu |
|----------|--------|---------|
| Google Search | Co | Qua Google & YouTube channel |
| Google Ads | Co | Qua Google Merchant Center |
| YouTube | Co | Qua Google & YouTube channel |
| Facebook | Co (*) | Sync product data, nhung khong ho tro direct checkout |
| Instagram | Co (*) | Sync product data, nhung khong ho tro direct checkout |

(*) Product data sync duoc, nhung customer phai checkout tren Shopify store, khong checkout truc tiep tren Meta.

---

## Nguon

- [Help doc - Bundles](https://help.shopify.com/en/manual/products/bundles/index)
- [Help doc - Shopify Bundles](https://help.shopify.com/en/manual/products/bundles/shopify-bundles)
- [Help doc - Publishing Products on Meta](https://help.shopify.com/en/manual/online-sales-channels/social-commerce/facebook-instagram-by-meta/publishing-products)
- [Help doc - Syncing Products to Google](https://help.shopify.com/en/manual/promoting-marketing/create-marketing/google/syncing-products)
