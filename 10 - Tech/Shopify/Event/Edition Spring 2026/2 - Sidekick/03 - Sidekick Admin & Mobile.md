# Sidekick trong Admin & Mobile

Chi tiet ve cac tinh nang Sidekick tren Shopify admin (desktop + mobile), Apple Watch, va cac interaction patterns.

---

## Sidekick everywhere trong Shopify app

Truoc day Sidekick chi xuat hien o mot so man hinh. Gio merchant co the truy cap Sidekick **tren bat ky man hinh nao** trong Shopify mobile app.

**Cach mo Sidekick:**
- **Desktop:** click Sidekick icon tu bat ky admin page nao. Hoac truy cap truc tiep qua `admin.shopify.com/sidekick`. Go message va click up arrow icon de gui.
- **Mobile:** tap Sidekick icon tren bat ky store page nao. Go cau hoi va tap up arrow de gui.

**Display modes:**
- Desktop: giu **Shift + click Sidekick icon** de mo fullscreen
- Desktop: click maximize icon cung duoc
- Mobile: tap maximize icon de expand conversation area; swipe down de quay lai compact mode
- Minimize: dung minimize icon de quay lai compact mode

**Mobile-specific:**
- Sidekick hien thi tren Orders, Analytics, Products screens va moi man hinh khac
- iOS: them Sidekick lam **lock screen widget**
- Ho tro 3D scanning, barcode printing, tap-to-pay

Sidekick hoat dong theo **context cua man hinh hien tai** -- dang o trang product thi Sidekick hieu merchant can ho tro ve product do.

---

## Sidekick tren Apple Watch

### Setup
- Yeu cau pair Apple Watch voi iPhone
- Download Shopify app tren iPhone, dung Watch app de install
- Scan QR code de authenticate
- Chon preferred stores khi setup

### Metrics tren Watch
Home view hien thi:
- Sessions over time
- Total sales over time
- Orders over time
- Conversion rate over time
- Dung calendar icon de thay doi date range

### Complications (Watch Face Widgets)

| Complication | Hien thi |
|---|---|
| Total Sales | Sales theo store va date range |
| Sessions | Online store session count |
| Unfulfilled Orders | So orders can fulfill |
| Combined Metrics | Sales + sessions (chi rectangular) |
| Sidekick | Truy cap voice truc tiep tu watch face |
| Shopify button | Mo app nhanh |

Data refresh moi **15 phut**. Co the bat privacy mode qua **Settings > Passcode** de an data khi locked.

### Sidekick Voice Mode
Mo Shopify app hoac tap **Sidekick complication** tren watch face, tap de bat dau noi.

> "After you ask your question, your answer is spoken aloud, and a text summary is displayed on your watch."

**Vi du cau hoi:**
- "How many unfulfilled orders do I have?"
- "What were my total sales today?"
- "Do I have any low stock products?"
- "How many returns do I have?"

**Multiple stores:** response dua tren active store, xac nhan tu complication label.

### Gioi han Apple Watch
- Chi ho tro **voice mode** (khong go duoc)
- Khong navigate den pages trong admin
- Khong thay doi store (edit products, update settings)
- Khong generate content hoac apps
- Khong screen sharing

### Ket noi
- Can iPhone gan do hoac chung Wi-Fi
- Models co mobile data rieng thi khong can iPhone
- Real-time updates khong xay ra khi app dang mo (can dong/mo lai)

Cho advanced features, dung Sidekick tren desktop hoac mobile.

---

## Multi-task voi Sidekick

Sidekick ho tro multi-tasking thuc su:

- **Background processing:** Sidekick tiep tuc xu ly task ngay ca khi merchant chuyen sang lam viec khac hoac dong cua so chat -- "continues working in the background, even if you close the chat or navigate away, and notifies you when it's ready for review"
- **Multiple chats:** chay nhieu cuoc hoi thoai cung luc
- **Notification:** khi task chay nen xong, Sidekick thong bao de merchant review
- **Track tu Home:** merchant co the "track its progress from Shopify Home" -- hien thi active tasks va status

Dac biet huu ich cho task ton thoi gian nhu generate app, phan tich data lon, tao noi dung hang loat.

---

## Follow-up questions

> "If Sidekick needs more details to complete your request, then it asks a follow-up question."

Thay vi bat merchant go cau tra loi dai, Sidekick dua ra **lua chon dang multiple choice**. Merchant chi can chon dap an phu hop.

Vi du: khi yeu cau "tao discount", Sidekick co the hoi lai: loai discount nao (percentage / fixed amount / free shipping), ap dung cho collection nao, thoi han ra sao -- tat ca duoi dang lua chon nhanh.

---

## Actionable guidance (Sidekick Pulse + Home cards)

### Sidekick Pulse
Hien thi "proactive recommendation cards in your Home feed" goi y next-best actions dua tren store data. Dang rollout dan (early access feature).

### Home cards
"Blocks of information that change regularly to adapt to your business":
- Updates ve Shopify features moi lien quan den business
- Loi khuyen su dung Shopify hieu qua
- Data-driven insights ve store performance
- Guides cho recommended tasks

**Dismiss:** hover + click X tren desktop hoac swipe tren mobile (tru order task cards). Co the gui feedback ve ly do dismiss.

**Permanent section:** "Discover more of Shopify" o cuoi feed, khong dismiss duoc.

### Insights section

**Dieu kien:** stores trung binh **10+ orders/tuan** (6 thang gan nhat)
**Tan suat:** toi da **3 insights/ngay**, het han sau **24 gio**

3 loai insights:
1. **Trends over time:** so sanh performance voi giai doan truoc
2. **Streaks:** patterns tich cuc/tieu cuc lien tuc qua nhieu giai doan
3. **Top 5 values:** thay doi giua cac dimensions hoat dong tot nhat

3 linh vuc:
- **Sales:** revenue, orders, product performance theo product/region/channel/vendor
- **Sessions:** visitor changes, cart additions, checkout sessions, conversion rates theo city/country/device type/landing page
- **Fulfillments:** shipping/delivery efficiency theo carrier/channel/shipping location

Truy cap report chi tiet qua nut **"View report"** va co the nho Sidekick guidance.

---

## Sidekick creates customers & fills forms

Merchant mo ta customer bang ngon ngu tu nhien, Sidekick tu dong dien form. "Fields that Sidekick updates are highlighted in purple so you can review the changes."

### Cac form Sidekick ho tro:

| Loai | Chi tiet |
|------|---------|
| Customers | Tao customer moi va them thong tin |
| Products | Tao/edit products, discounts, collections |
| B2B | "Create new companies with available information" (cho store B2B) |
| Orders | Edit order: them product/custom items, tang/giam so luong, them/update/remove line item discounts, dieu chinh custom shipping fees, set edit reasons, control customer notifications |
| General | Dien field tren bat ky trang admin nao, dung reference images hoac direct instructions |

> "The order updates only after you review the changes and click **Update order**."

### Guided workflows
Sidekick tao **guided workflows** cho onboarding va custom task lists -- "guides you through each item" khi tao products hang loat.

---

## Input features

- **Attach/upload files:** gui file tu admin hoac device
- **Target mode:** click icon target de chon phan cu the -- "click directly on components like buttons, sections, or fields" cho contextual assistance
- **Mention:** @mention products, orders, customers, collections, hoac apps
- **Third-party apps:** tich hop qua Sidekick app extensions (xem [[02 - Sidekick App Extensions]])
- **Reusable skills:** save prompts thanh shortcuts de dung lai

---

## Response actions

Tuy vao response cua Sidekick, merchant co the:
- Click right arrow icon de navigate den trang duoc chi dinh
- Click **"Apply"** de ap dung generated content vao store

---

## Feedback

Rate responses voi thumbs up/down icons. Co the them chi tiet qua **Add comment** dialog.

---

## Limitations

Sidekick **khong the**:
- Xu ly customer support
- Chia se private merchant data
- Edit images trong themes
- Thay doi bat ky gi ma khong co merchant approval
- Hoat dong tren tablet devices

---

## Nguon

- [Sidekick overview - Help doc](https://help.shopify.com/en/manual/shopify-admin/productivity-tools/sidekick/index)
- [Sidekick setup & use - Help doc](https://help.shopify.com/en/manual/shopify-admin/productivity-tools/sidekick/set-up)
- [Sidekick forms & guidance - Help doc](https://help.shopify.com/en/manual/shopify-admin/productivity-tools/sidekick/help-and-guidance)
- [Apple Watch - Help doc](https://help.shopify.com/en/manual/shopify-admin/shopify-app/watch-app)
- [Shopify Home - Help doc](https://help.shopify.com/en/manual/shopify-admin/shopify-home)
