# Operations - Shipping

Shopify Editions Spring '26 có **11 cập nhật** trong nhóm Shipping thuộc Operations, tập trung vào batch fulfillment, mở rộng carrier options (FedEx, DHL, UPS), và cải thiện trải nghiệm shipping labels đa tiền tệ.

---

## Batch fulfillment workflow

Nhóm orders thành batches và xử lý qua **workflow tùy chỉnh**: pick, pack, scan, ship theo từng batch. Giúp warehouse xử lý đơn hàng số lượng lớn hiệu quả hơn nhiều so với từng đơn lẻ.

**Docs:** [Help doc - Fulfill your orders in batches](https://help.shopify.com/en/manual/fulfillment/managing-orders/fulfill-orders)

---

## FedEx One Rate

Flat-rate shipping dựa trên **kích thước package thay vì trọng lượng**. Merchant US được pricing cố định theo dimensions, dễ dự đoán chi phí ship.

**Availability:** Chỉ United States.

**Docs:** [Help doc](https://help.shopify.com/en/manual/shipping/shopify-shipping/rates)

---

## Advanced shipping options

Tùy chỉnh shipping rate conditions với **nhiều parameters**: set order value + weight conditions trong cùng 1 shipping option, thêm consumer descriptions và transit times cho customer thấy.

**Docs:** [Help doc](https://help.shopify.com/en/manual/shipping/setting-up-and-managing-your-shipping/shipping-rates)

---

## Fulfillment status for canceled orders

Orders bị cancel hoặc refund giờ hiển thị status **"not required"** thay vì để trống hoặc gây confusion. Rõ ràng hơn cho team fulfillment.

**Docs:** [Help doc](https://help.shopify.com/en/manual/fulfillment/managing-orders/order-status)

---

## Local pickup emails

Gửi và **re-send pickup notification emails** từ admin cho pickup orders. Apps cũng có thể gửi pickup confirmations qua API. Khách hàng nhận được thông báo khi đơn sẵn sàng lấy tại store.

**Docs:** [Help doc](https://help.shopify.com/en/manual/fulfillment/setup/delivery-methods/pickup-in-store)

---

## Manual delivery confirmation

Đánh dấu orders là **delivered thủ công** khi carrier tracking không tự động available. Hữu ích cho carriers nhỏ hoặc local delivery mà Shopify chưa tích hợp tracking.

**Docs:** [Help doc](https://help.shopify.com/en/manual/fulfillment/managing-orders/fulfill-orders)

---

## Labels billed in local currency

Thanh toán shipping labels bằng **local currency** (CAD, EUR, GBP...) thay vì phải convert. Tránh phí chuyển đổi tiền tệ khi mua labels.

**Availability:** Canada, Eurozone, UK và các regions khác.

**Docs:** [Help doc](https://help.shopify.com/en/manual/your-account/manage-billing/your-invoice/charges-on-your-invoice)

---

## FedEx in Managed Markets

Ship orders quốc tế bằng **FedEx International Connect Plus** với **prepaid duties** tích hợp qua Managed Markets. Khách hàng không bị surprise charges khi nhận hàng.

**Availability:** Managed Markets regions.

**Docs:** [Help doc](https://help.shopify.com/en/manual/markets/managed-markets/shipping)

---

## DHL Kleinpaket Germany

Shipping option giá rẻ cho packages **dưới 1kg tại Đức** bằng DHL Kleinpaket. Tiết kiệm chi phí cho lightweight products.

**Availability:** Chỉ Germany.

**Docs:** [Help doc](https://help.shopify.com/en/manual/shipping/shopify-shipping/rates)

---

## Delivery carrier auto-detection

Tự động nhận diện **shipping carrier từ tracking number**. Hỗ trợ DHL, EVRi, Australia Post và các carriers khác. Merchant nhập tracking number thủ công, hệ thống tự detect carrier tương ứng.

**Docs:** [Help doc](https://help.shopify.com/en/manual/fulfillment/managing-orders/tracking)

---

## UPS return labels

Mua UPS return labels từ admin với mô hình **pay-per-use**: chỉ trả tiền khi label thực sự được sử dụng. Giảm waste cho return labels không dùng đến.

**Availability:** Chỉ United States.

**Docs:** [Help doc](https://help.shopify.com/en/manual/fulfillment/managing-orders/returns/return-labels)

---

> **Nguồn:** [Shopify Editions Spring '26](https://www.shopify.com/editions/spring2026) - Section Operations > Shipping
