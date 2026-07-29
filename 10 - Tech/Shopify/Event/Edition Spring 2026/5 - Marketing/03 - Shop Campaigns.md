# Shop Campaigns

Shop Campaigns la he thong quang cao performance-based cua Shopify, cho phep merchant chay **mot campaign duy nhat** va deploy dong thoi len nhieu platform. Merchant "pay only for successful customer acquisitions."

---

## Mo rong channel moi (Editions Spring '26)

Ngoai cac channel hien co, Editions Spring '26 bo sung them:
- **ChatGPT**
- **Microsoft Monetize** (programmatic ads)
- **Pinterest**

### Danh sach day du cac channel

**Default (luon bat, khong tat duoc):**
- Shop (app va web)
- Shopify Product Network

**Third-party platforms (US-only, tru Meta va Google):**
- Bing
- ChatGPT
- Facebook
- Google
- Instagram
- Microsoft Monetize
- Pinterest
- Snapchat
- X

> **Luu y**: Merchant phai opt-in tat ca third-party platforms cung luc; khong chon rieng tung channel duoc.

---

## Simplified Setup & Segment-based Bidding

Thay vi bidding chung cho tat ca khach hang, merchant co the dat **custom bid** cho tung customer segment:

### Campaign creation flow

1. Vao **Sales channels > Shop > Advertising > Create campaign**
2. Chon objective: **Grow sales**, **Acquisition**, hoac **Win back** (voi time period selection)
3. Cau hinh:
   - **Customer acquisition cost (CAC)**: Dat muc toi da bang slider - merchant "are never charged more than this amount"
   - **Target order value**: Transaction amount mong muon
   - **Daily budget**: Gioi han chi tieu hang ngay (roll weekly Sunday-Saturday, unused daily amounts carry forward)
   - **Countries**: Chon target markets
   - **Channels**: Shop va Shopify Product Network tu dong; optional add third-party platforms
   - **Schedule**: Start time va optional end date

### Segment overrides

Merchant co the dat **CAC khac nhau** cho tung nhom khach hang (new customer, lapsed customer...), giup phan bo ngan sach hieu qua hon.

### Sau khi launch - co the chinh sua:
- Daily budget
- Campaign end date/time

### Khong the chinh sua sau khi launch:
- Customer acquisition cost
- Target order value
- Countries

### Branded keyword ads
- Available tren third-party platforms
- **Default: tat** - merchant phai bat thu cong
- Shop name la default branded keyword
- Toggle trong **campaign > Manage channels > Show search ads for branded keywords**
- Thay doi mat toi 1 gio de apply

---

## Standardized Ads Billing

Tu January 2026, Shop Campaigns billing duoc hop nhat:

- Chi phi hien thi tren **Shopify invoice** duoi muc "Shop campaigns"
- **Khong can prefunding** - "There's no prefunding required to create a Shop Campaign"
- **Khong tru tu Shopify Payments payouts** nua (thay doi tu Jan 2026)
- Shopify Credit promotional credits apply truoc, phan con lai charge vao bill
- Thue co the ap dung tuy theo location cua store
- Weekly spending cap = Daily budget x 7 (vi du: $100/ngay = $700/tuan max)

### Cach tinh phi
- Charge moi khi mot order duoc attribute cho Shop Campaigns
- **Partial charges**: Mot so orders chi bi charge mot phan CAC
- Order attribution tag "Shop Cash offers acquired" co the mat toi 8 gio de hien thi

---

## Performance Metrics

Xem trong **Sales channels > Shop > Advertising** dashboard:

| Metric | Mo ta |
|--------|-------|
| Sales | Gross transaction revenue (bao gom refunds/cancellations) |
| Customers | So khach hang mua tu campaign |
| ROAS | Sales / Ad spend |
| Average order value | Trung binh gia tri don hang |
| Spend | Tong chi phi |

### Customer segmentation
- Khach hang tu Shop Campaigns nhan tag **"Shop Cash offer acquired"**
- Xem segment theo campaign hoac tat ca campaigns: **More actions > View segment**

### Chay nhieu campaign cung luc
- Campaigns co overlapping audiences → Shopify tu dong reallocate budget ve campaign hieu qua nhat truoc
- De toi uu: giam overlap giua cac campaigns, pause campaign kem hieu qua

---

## Gioi han

- Subscriptions, bundles, va preorders **khong duoc ho tro** tren Product Network
- Checkout extensions khong tuong thich voi network ads
- Third-party platform ads chu yeu target khach hang US

---

## Yeu cau quyen han

Store owner hoac user co ca hai quyen **"Shop channel"** va **"Marketing"**.

---

## Nguon

- [Help doc - Understanding Campaigns](https://help.shopify.com/en/manual/online-sales-channels/shop/shop-campaigns/understanding-campaigns#other-platforms)
- [Help doc - Create Campaign](https://help.shopify.com/en/manual/online-sales-channels/shop/shop-campaigns/manage#create-campaign)
- [Help doc - Billing](https://help.shopify.com/en/manual/online-sales-channels/shop/shop-campaigns/payment#billing)
