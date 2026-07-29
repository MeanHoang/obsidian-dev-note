# Shopify Balance - Editions Spring 2026

**Shopify Balance** là money management account cho merchant — quản lý tiền bán hàng, thanh toán chi phí, nhận cashback, tất cả trong một nơi. Shopify không phải ngân hàng; Balance hoạt động qua **Stripe** (money transmission) và **Fifth Third Bank** (giữ tiền), Visa card phát hành bởi **Celtic Bank**.

Editions Spring '26 bổ sung 3 tính năng mới cho Balance: **cashback on ad spend**, **cash deposit qua barcode**, và **domestic wire transfers**.

---

## 1. Cashback on Ad Spend

Merchant nhận **cashback** khi thanh toán chi phí quảng cáo từ Shopify Balance.

### Điều kiện nhận cashback ads (direct debit)

Phải đạt **ít nhất 1 trong 2** tiêu chí:
- Spend **$10,000+ USD** trên Shopify Credit trong tháng dương lịch trước, HOẶC
- Nhận **$10,000+ USD** funding từ Shopify Capital trong 12 tháng qua

Ngoài ra, cần có **physical hoặc virtual Shopify Balance card** set làm primary payment method, và account phải active + good standing vào ngày trả reward.

### Tỷ lệ cashback

| Loại giao dịch | Cashback rate |
|---|---|
| Shopify purchases (shipping labels, messaging, apps, themes, domains) | 2% |
| Marketing ads (Google, Facebook, Instagram, Pinterest, TikTok) | 2% |
| Snapchat ad campaigns | **10%** |
| Direct debit ad payments (Google/Meta từ Shopify Balance) | 1% |

### Giới hạn hàng năm (annual caps)

| Loại | Cap |
|---|---|
| General purchases | Tối đa **$2,000 USD/năm** |
| Ad spend cashback | Tối đa **$100,000 USD ad spend/năm**, tương đương tối đa **$1,000 USD cashback/năm** |

- Caps reset vào **1 tháng 1** hàng năm; phần chưa dùng **không** carry over.
- Cashback được deposit vào Balance account **hàng tháng** (monthly basis).

### Giao dịch KHÔNG đủ điều kiện

ACH transfers nói chung không qualify. Outbound ACH, wire transfers, refunds, và reversals đều bị loại khỏi ad payment cashback.

> **Lưu ý:** Direct debit từ Balance trên supported ad platforms (Google, Meta) thì qualify ở mức 1%, khác với thanh toán qua Balance card (2%).

---

## 2. Cash Deposit qua Barcode

Merchant có thể **nạp tiền mặt** vào Shopify Balance tại cửa hàng bán lẻ, sử dụng barcode từ Shopify mobile app.

### Quy trình

1. Mở Shopify app → tap **Balance**
2. Chọn **"Add cash"** → nhập số tiền muốn nạp
3. Chọn Shopify Balance account nhận tiền
4. Chọn **drop-off location** (qua location sharing hoặc search)
5. Xác nhận → hệ thống tạo **barcode**
6. Mang barcode đến cửa hàng, đưa cashier quét
7. Giữ receipt cho đến khi tiền vào tài khoản

### Chi tiết kỹ thuật

| Thông số | Giá trị |
|---|---|
| Barcode có hiệu lực | **1 giờ** sau khi tạo |
| Barcode request hết hạn | **24 giờ** nếu chưa hoàn thành |
| Thời gian tiền vào account | **1 business day** (liên hệ support nếu >3 ngày) |
| Giao dịch >$500 | Tạo **nhiều barcode**, phải quét tuần tự |

### Giới hạn nạp tiền

| Giới hạn | Số tiền |
|---|---|
| Daily | $1,500 USD |
| Weekly | $3,500 USD |
| Monthly | $5,000 USD |

### Participating retailers

Nạp tiền tại các **GreenDot retail locations**: **Walgreens**, **CVS**, và **Walmart**.

### Lưu ý

- Chỉ **account owner** mới có quyền nạp tiền.
- Đang ở giai đoạn **early access** — chưa available cho tất cả merchant.
- Không thể thay đổi amount hoặc location cho barcode đã active.
- Barcode là **location-specific** (chỉ dùng tại địa điểm đã chọn).
- **Fees:** Docs không đề cập phí nạp tiền.
- **Availability:** US only.

---

## 3. Domestic Wire Transfers

Merchant gửi **wire transfer nội địa** cho vendor/supplier trực tiếp từ Shopify Balance.

### Các phương thức chuyển tiền từ Balance

| Phương thức | Phí | Thời gian xử lý |
|---|---|---|
| **ACH Transfer** | Miễn phí | 1–3 business days |
| **US Domestic Wire** | **$10 USD/transfer** | Same-day nếu trước 1:00 PM EST; next business day nếu sau |
| Balance → Balance | Miễn phí | Gửi ngay, nhận trong tối đa 6 business days |
| Bank → Balance | — | Tối đa 6 business days |

### Quy trình wire transfer

- Thực hiện trong **Balance dashboard** → chọn recipient → chọn wire transfer
- Transfer limit hiển thị trên Balance page trong Shopify admin (giới hạn cụ thể docs chưa nêu rõ)
- Có thể **cancel** transfer trong **2 ngày đầu** sau khi authorize

### Availability

- US domestic wire transfers only.
- Docs không đề cập international transfer.

---

## Nguồn

- [Eligible transactions for cashback rewards](https://help.shopify.com/en/manual/finance/shopify-balance/rewards/cashback-rewards#eligible-transactions-for-cashback-rewards)
- [Adding cash to Shopify Balance](https://help.shopify.com/en/manual/finance/shopify-balance/adding-cash)
- [Managing transfers from Shopify Balance](https://help.shopify.com/en/manual/finance/shopify-balance/managing-account/transfers)
- [Shopify Balance overview](https://help.shopify.com/en/manual/finance/shopify-balance)
