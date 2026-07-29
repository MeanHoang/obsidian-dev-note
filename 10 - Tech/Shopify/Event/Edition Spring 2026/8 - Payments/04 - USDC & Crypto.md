# USDC & Crypto

## USDC là gì?

USDC là một **stablecoin** -- cryptocurrency gắn với đồng US dollar, giá trị ổn định hơn nhiều so với các crypto khác. Khách hàng có thể thanh toán bằng bất kỳ ví nào trong **480 supported crypto wallets** mà không chịu foreign exchange hay transaction processing fees.

---

## Accept More USDC (Ethereum, Base, Auto-Bridging)

Shopify chấp nhận USDC trên **5 blockchain networks**:

| Network | Ghi chú |
|---|---|
| **Base** | Network chính, hỗ trợ buyer cashback |
| **Ethereum L1** | |
| **Optimism** | |
| **Polygon** | |
| **Arbitrum** | |

> **Lưu ý:** Docs chính thức không đề cập cụ thể tính năng auto-bridging giữa các chain. Thông tin về auto-bridging có thể từ Editions announcement nhưng chưa được phản ánh trong help docs.

### Yêu cầu

- Shopify Payments phải active
- Business ở supported regions
- Account representatives có residential address tại USDC-eligible regions
- Hoàn tất identity verification

### Regional availability

| Region | Quốc gia |
|---|---|
| **North America** | Mexico, hầu hết US states (**trừ** Alaska, New York, Texas) |
| **Europe** | 29+ quốc gia (France, Germany, UK, Spain...) |
| **Asia-Pacific** | Hong Kong only |

### Setup

1. Shopify admin: Settings > Payments
2. Trong Shopify Payments section → click **Manage**
3. Chọn **Manage payment methods**
4. Activate **USDC** dưới mục Crypto

### Payout options

Merchant chọn 1 trong 2:

| Option | Chi tiết |
|---|---|
| **Local currency conversion** | USDC tự động convert sang payout currency theo lịch Shopify Payments thông thường |
| **Direct USDC transfers** | Chuyển USDC payouts thẳng vào crypto wallet, claim thủ công (phụ thuộc region) |

### Merchant credits

Khi khách thanh toán bằng USDC, merchant nhận **credit cho transaction**. Credits áp dụng tự động vào payouts/USDC balances và **không bị trừ** nếu order được refund.

---

## Cashback for USDC

Khách hàng thanh toán bằng USDC trên **Base blockchain** sẽ nhận cashback tự động.

### Chi tiết

- **Maximum:** 100 USDC per transaction
- **Thời điểm:** Deposit vào crypto wallet của khách sau **30 ngày** kể từ purchase
- **Không cần thao tác:** Khách không cần làm gì để nhận cashback
- **Chỉ trên Base network** -- các network khác không có cashback

### Refund & cashback

Refund caps apply khi cashback đã được phân phối.

---

## Hạn chế USDC payments

- **Không** partial fund captures
- **Không** hỗ trợ subscriptions và post-purchase upsells
- Khách **không thể dispute** USDC orders
- Docs **không nêu** cụ thể transaction fees, gas fees, hay merchant discount rates

---

## Docs

- [USDC payments](https://help.shopify.com/en/manual/payments/shopify-payments/usdc-payments)
- [USDC buyer cashback](https://help.shopify.com/en/manual/payments/shopify-payments/usdc-payments#buyer-cashback)
