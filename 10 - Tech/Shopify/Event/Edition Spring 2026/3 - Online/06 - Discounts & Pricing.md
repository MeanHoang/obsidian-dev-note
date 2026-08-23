# Discounts & Pricing - Editions Spring 2026

Các update liên quan đến discount stacking, discounts by market, và Smart Pricing app.

---

## Stacking multiple product discounts

Áp dụng nhiều discount cùng lúc lên cùng một sản phẩm trong một đơn hàng.

### 3 discount classes

1. **Product discounts** - target specific items/collections
2. **Order discounts** - apply to cart subtotals
3. **Shipping discounts** - modify shipping costs

### Thứ tự áp dụng

> "Product discounts apply first to individual items. Order discounts apply to the revised subtotal after product discounts. Shipping discounts apply last."

### Combination matrix

| Combination | Ai dùng được? |
|---|---|
| Product + Shipping | Tất cả merchant |
| Order + Shipping | Tất cả merchant |
| Product + Product (items khác nhau) | Tất cả merchant |
| Product + Order | Cần không dùng checkout.liquid customizations |
| Order + Order | Cần không dùng checkout.liquid customizations |
| Product + Product (cùng item) | **Shopify Plus only** |
| Shipping + Shipping | **Không hỗ trợ** |

### Cách tính

**Percentage order discounts:** Cả 2 percentages tính từ original subtotal, KHÔNG sequential.
> Ví dụ: "10% off the order, and 20% off the order, and the order subtotal is $100 USD, then the total after discounts is $70 USD or 30% off the original subtotal."

**Multiple product discounts cùng item:** Percentage discounts áp dụng trước fixed amounts để tối ưu savings cho khách.

### Setup

Discounts **KHÔNG tự combine**. Merchant phải manual configure **Combinations** section trong mỗi discount để chỉ định compatible discount classes.

### Giới hạn

- Tối đa **25 active automatic discounts** per store
- Khách có thể áp dụng tối đa **5 product/order codes + 1 shipping code** per order
- Chỉ hoạt động trên **Online Store, Storefront API, và Shopify POS**
- Buy X Get Y products không eligible cho additional product discounts (trừ Plus cho "get" items)

### Best discount selection

Khi discounts không tương thích conflict nhau, "the best discount for the customer's cart is always applied" tự động.

**Availability:** Tất cả plan (product stacking cùng item chỉ Plus).

---

## Discounts by market

Tạo promotion nhắm đến từng market/khu vực cụ thể.

### Cách hoạt động

Merchant chạy targeted promotions cho:
- Khách hàng ở các region cụ thể
- Các retail location khác nhau
- B2B setups

Giúp linh hoạt trong chiến lược giá theo thị trường. Assign discount vào market cụ thể thông qua discount settings trong Shopify admin.

**Availability:** Merchant sử dụng Shopify Markets với discount functionality.

---

## Shopify Smart Pricing app

Xem chi tiết tại [[01 - Online Overview#Shopify Smart Pricing app]].

---

## Nguon

- [Discount combinations](https://help.shopify.com/en/manual/discounts/discount-combinations)
- [Discounts](https://help.shopify.com/en/manual/discounts)
- [Get Smart Pricing](https://apps.shopify.com/shopify-smart-pricing)
- [Shopify Editions Spring 2026](https://www.shopify.com/editions/spring2026) - truy cap 2026-07-29
