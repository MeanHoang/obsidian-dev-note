# Shopify Tax Canada - Editions Spring 2026

**Shopify Tax** mở rộng sang **Canada** trong Editions Spring '26, giúp merchant tự động tính thuế bán hàng theo từng tỉnh bang (province).

---

## Tổng quan

Shopify Tax Canada tự động monitor sales + locations để xác định tax liability tại các province khác nhau. Hệ thống dựa trên **product categories** để tính tax rate phù hợp, đặc biệt cho sản phẩm tax exempt hoặc zero-rated (ví dụ: groceries).

---

## Các loại thuế được hỗ trợ

| Loại thuế | Mô tả |
|---|---|
| **GST** | Goods and Services Tax (liên bang) |
| **HST** | Harmonized Sales Tax (liên bang + tỉnh, áp dụng ở một số province) |
| **PST** | Provincial Sales Tax |
| **QST** | Quebec Sales Tax |
| **RST** | Retail Sales Tax (Manitoba) |

---

## Product categorization

- Shopify Tax dùng **automatic categorization** để xác định tax rate.
- Hệ thống tự nhận diện sản phẩm **tax exempt** hoặc **zero-rated** (ví dụ groceries) dựa trên product categories.
- **Merchant có trách nhiệm** verify category accuracy — phân loại sai có thể dẫn đến thu thuế thiếu hoặc thừa.

---

## Liability thresholds & tracking

- **Tax liability insights** tự động track sales + locations để xác định province nào yêu cầu đăng ký thu thuế.
- Monitor dựa trên:
  - **Merchant location** (nơi đặt doanh nghiệp)
  - **Shipping destinations** (nơi giao hàng)
- Giúp merchant biết **khi nào cần bắt đầu thu thuế** tại một province cụ thể.

---

## Pricing & fees

| Plan | Phí | Cap |
|---|---|---|
| Tất cả plans | **Miễn phí** đến **$100,000 CAD** global sales/store | — |
| **Plus** plan (sau threshold) | **0.15%** per transaction | $0.99 CAD/order |
| Các plan khác (sau threshold) | **0.25%** per transaction | $0.99 CAD/order |

---

## Setup & migration

1. Review **Shopify Tax considerations** cho Canada
2. Verify **product categories** chính xác
3. Remove **tax overrides** không cần thiết (có thể conflict với automatic calculations)

---

## Limitations

Shopify Tax calculations **KHÔNG** áp dụng cho:
- Shipments **ngoài Canada** (non-Canadian destinations)
- Orders từ **third-party channels** (Facebook, Amazon)
- Orders có **product hoặc shipping rate tax overrides**

---

## Nguồn

- [Shopify Tax Canada](https://help.shopify.com/en/manual/taxes/shopify-tax/shopify-tax-canada)
