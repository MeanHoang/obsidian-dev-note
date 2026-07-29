# Email & Attribution

Nhom feature lien quan den email delivery thong minh, marketing analytics, discount attribution, va consent management.

---

## Smart Email Delivery

He thong tu dong loc audience truoc moi lan gui campaign, chi gui cho subscribers thuc su engaged.

### Cach hoat dong

- **Dieu kien kich hoat**: Chi apply khi send list co **hon 1,000 subscribers**. Campaigns nho hon 1,000 subscribers gui cho tat ca, khong loc
- **Loc gi**:
  - Remove customers khong tuong tac voi cac email marketing gan day
  - Loai bo SMS subscribers co phone number inactive
  - Luon bat: bot filtering va list health protections (doc lap voi Smart Delivery toggle)

### Merchant control

- **Default**: Bat (enabled) cho ca email va SMS
- **Toggle**: **Apps > Messaging > Settings > Delivery**
- **Canh bao khi tat**: "can increase bounce rates, spam complaints, and costs over time"

### Muc dich

"Helps protect deliverability and reduce costs by filtering your campaign audience so that your message is sent only to engaged subscribers." Tranh gui qua nhieu email khien khach unsubscribe, dong thoi dam bao message quan trong gui dung luc.

> Docs chua cung cap so lieu cu the ve conversion rate impact.

---

## Marketing Data in Analytics

Dua marketing performance metrics vao Shopify Analytics dashboard, giup merchant danh gia hieu qua marketing ma khong can roi Shopify admin.

### Report types co san

| Report | Mo ta |
|--------|-------|
| Sales attributed to marketing | Sales tu cac trackable marketing efforts |
| Sessions attributed to marketing campaigns | Sessions tu marketing activities |
| Performance by referring channel | Hieu qua theo kenh gioi thieu |
| Performance by marketing activity | Hieu qua theo hoat dong marketing |
| Performance by UTM campaign | Hieu qua theo UTM campaign |

### Metrics chinh

- **Orders** (first hoac last interaction)
- **Average order value** (first hoac last interaction)
- **Gross sales**
- **Sessions** attributed to marketing campaigns
- **Visitors** (tracked qua cookies)

### Attribution models (5 models)

| Model | Mo ta |
|-------|-------|
| **Last click** (default) | Attribute cho channel cuoi cung bao gom direct |
| **Last non-direct click** | Attribute cho channel cuoi cung KHONG phai direct |
| **First click** | Attribute cho channel dau tien |
| **Any click** | Credit cho tat ca channels trong customer journey |
| **Linear** | Chia deu credit cho tat ca interactions |

### Cach truy cap

- **Desktop**: Analytics > Reports > Category filter > Marketing
- **Mobile**: Shopify app > Analytics > Reports > filter icon > Category > Marketing

### Data sources

- Online Store channel orders
- UTM parameter campaigns
- Shopify Marketing app campaigns
- External marketing efforts
- **Loai tru**: test orders va deleted orders
- **Bao gom**: canceled, pending, va unpaid orders

### Deprecated reports (da bo)
- Conversion by first interaction
- Conversion by last interaction
- Attribution model comparison

---

## Discount Links Attributed to Campaigns

Gan discount link vao campaign de track chinh xac nguon traffic va conversion.

### Cach hoat dong

Khi tao shareable discount link, merchant co the "select an existing marketing campaign. The campaign's UTM identifier and source are automatically added to the shareable link, so you can monitor the discount's performance in your marketing campaign reports."

### Setup

1. Vao **Discounts** trong Shopify admin
2. Chon discount muon promote
3. Click **Promote > Get a shareable discount code**
4. Chon destination page (home page, collection, hoac product)
5. **Chon existing marketing campaign** de tu dong attach UTM parameters
6. Copy link hoac download QR code

### Ket qua

UTM data tu dong populate vao marketing campaign reports, cho visibility vao discount-driven traffic va conversions.

---

## Marketing Consent on Sign-in

Thu thap email marketing consent ngay tai trang sign-in cua customer.

### Cach hoat dong

- Hien thi marketing consent checkbox tren **customer sign-in page** trong qua trinh dang ky/dang nhap
- Customer subscribe bang cach tick checkbox va proceed to payment

### Cau hinh

**Tu dong theo region:**
- Chon "Regions recommended by Shopify" → tu dong align checkbox state voi local jurisdiction requirements

**Thu cong:**
- Chon "Regions you choose" → chi dinh regions nao checkbox duoc preselected
- Chon 0 region = bat buoc tat ca customers phai active opt-in

### SMS consent tai checkout

1. Bat trong **Settings > Checkout**
2. Dat phone field la optional hoac required
3. Dat SMS marketing opt-in la "Checkout only"

### Compliance

- **Germany**: Bat buoc enable "Require customers to confirm their subscription" (double opt-in)
- **Double opt-in**: Customer xac nhan qua email link, tao "a more engaged subscriber list"

---

## Nguon

- [Help doc - Smart Delivery](https://help.shopify.com/manual/promoting-marketing/create-marketing/shopify-messaging/delivery#smart-delivery)
- [Help doc - Marketing Reports](https://help.shopify.com/en/manual/reports-and-analytics/shopify-reports/report-types/default-reports/marketing-reports)
- [Help doc - Managing Discounts](https://help.shopify.com/en/manual/discounts/managing-discounts#promote-a-discount-using-a-shareable-link-or-qr-code)
- [Help doc - Collect Customer Emails](https://help.shopify.com/en/manual/promoting-marketing/create-marketing/customer-contact-information#collect-customer-emails-from-checkout-and-sign-in)
