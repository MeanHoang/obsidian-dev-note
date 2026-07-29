# WhatsApp & SMS Messaging

Shopify Messaging (truoc day la Shopify Email) mo rong thanh multi-channel messaging platform ho tro **email, SMS, va WhatsApp** - tat ca quan ly truc tiep trong Shopify admin.

---

## Shopify Messaging app - Tong quan

- **Truoc day**: Shopify Email (chi ho tro email)
- **Hien tai**: Shopify Messaging - ho tro email, SMS, WhatsApp
- **Availability**: Basic, Grow, Advanced, va Shopify Plus plans
- **Pricing**: Tinh theo so luong message gui ("Pricing is calculated based on how many messages you send to your customers")
- **Yeu cau**: Shopify Network Intelligence phai duoc bat trong privacy settings

### Cai dat

App co san (pre-installed) tren Shopify stores. Neu can cai lai:
1. Vao [Shopify Messaging App](https://apps.shopify.com/shopify-messaging)
2. Click **Add app > Install app**

---

## WhatsApp Marketing Channel

Tich hop WhatsApp marketing campaign truc tiep trong Shopify Messaging.

### Tinh nang chinh
- Tao va quan ly WhatsApp marketing campaign ngay trong Shopify admin
- Khong can app ben thu ba
- Campaign Autopilot co the dieu phoi WhatsApp cung voi cac channel khac (xem [[02 - Campaign Autopilot]])

### WhatsApp Consent Management

Quan ly WhatsApp marketing consent **tap trung** trong customer profile, cung cho voi email va SMS consent:

- **Desktop**: Vao customer profile > **Manage > Edit marketing settings** trong Customer overview section
- **Mobile**: Vao customer profile > tap **Marketing subscriptions** > toggle WhatsApp marketing on/off

Merchant co the kiem soat consent cho ca 3 channel (email, SMS, WhatsApp) tu mot noi duy nhat.

---

## SMS Marketing

### Kha nang
- Gui text messages truc tiep toi customers o supported countries da opt-in
- Chi ap dung cho **marketing SMS** - transactional messages (order confirmation, shipping notification) quan ly rieng

### Setup
1. Vao **Apps > Messaging**
2. Set up countries muon gui SMS marketing
3. Dam bao da thu thap SMS consent tu customers

### SMS Consent Collection
- Bat trong **Settings > Checkout**
- Dat phone field la optional hoac required
- Dat SMS marketing opt-in la "Checkout only"
- Customer preference luu khi hoan thanh checkout

### SMS Campaigns
- Tao campaign trong **Apps > Messaging**
- Docs chua de cap chi tiet ve character limits, pricing rates cu the tren tung page - merchant can xem trong app

---

## Marketing Automations (Email & SMS)

Shopify Messaging ho tro automation cho ca **email va SMS**. Truoc day chi co email automation, gio bo sung them SMS.

### Cac loai automation co san

**Recover Site Visitors** (Email + SMS):
- Convert abandoned product browse
- Recover abandoned cart
- Recover abandoned checkout

**Welcome New Subscribers** (Email only):
- Welcome with discount email
- Welcome with discount series (bao gom follow-up emails)

**Post-Purchase** (Email only):
- Drive customers to retail locations
- Thank customers after purchase
- Upsell after first purchase
- Win back inactive customers

**Customer Appreciation** (Email only):
- Celebrate customer birthdays (can birthdate metafield)
- Welcome VIP customers

### Setup automation

1. Vao **Apps > Messaging > Automations**
2. Click **Create automation**
3. Chon template
4. Chon channel (Email hoac SMS)
5. Edit message
6. Send test (optional)
7. **Turn on** automation

### Luu y
- Mot so automations can data dac biet (birthdate metafields, retail location addresses)
- Custom automations can cai them **Shopify Flow** app
- Abandoned checkout emails **khong tinh** vao Shopify Messaging email limits
- Tren mobile chi co 3 automations: abandoned checkout, product browse, va cart recovery

---

## Nguon

- [Help doc - Shopify Messaging](https://help.shopify.com/en/manual/promoting-marketing/create-marketing/shopify-messaging)
- [Help doc - Set up Shopify Messaging](https://help.shopify.com/en/manual/promoting-marketing/create-marketing/shopify-messaging/setup)
- [Help doc - SMS Marketing](https://help.shopify.com/en/manual/promoting-marketing/create-marketing/shopify-messaging/sms)
- [Help doc - Create Marketing Automations](https://help.shopify.com/en/manual/promoting-marketing/create-marketing/shopify-messaging/marketing-automations/create)
- [Help doc - Manage Customers](https://help.shopify.com/en/manual/customers/manage-customers#edit-customer-profiles)
- [Shopify Messaging App](https://apps.shopify.com/shopify-messaging)
