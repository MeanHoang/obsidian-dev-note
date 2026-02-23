## 1️⃣ Loyalty Pass là gì? (nói thẳng, dễ hình dung)
**Loyalty pass = thẻ thành viên số** nằm trong **Google Wallet** của user.
Thay cho:
- Thẻ nhựa
- QR code rời rạc
- Thông tin thành viên nằm chết trong app/web
User chỉ cần:
> 📱 Mở Google Wallet → quét QR → xong
---
## 2️⃣ Loyalty Pass dùng để làm gì?
Phổ biến nhất:
- 🧾 Thẻ thành viên (Silver / Gold / Platinum)
- ⭐ Tích điểm
- 🎁 Ưu đãi cá nhân
- 🔁 Check-in cửa hàng / sự kiện
- 📊 Theo dõi cấp độ thành viên
Ví dụ:
> User mua hàng → tích điểm → **điểm cập nhật realtime trong Wallet**
---
## 3️⃣ Kiến trúc chuẩn của Loyalty Pass
Google Wallet dùng **2 tầng**:
```json 
LoyaltyClass   (khuôn)
   ↓
LoyaltyObject  (thẻ của từng user)
```
### 🔹 LoyaltyClass – định nghĩa chung
- Logo thương hiệu
- Màu sắc
- Tên chương trình (VD: WahnX Loyalty)
- Điều khoản sử dụng
👉 **Tạo 1 lần, dùng mãi**
### 🔹 LoyaltyObject – thẻ của user
Mỗi user = 1 object
Chứa:
- Member ID
- Họ tên
- Điểm hiện tại
- Cấp độ
- QR code / barcode
- Trạng thái (active / suspended)
👉 **Update liên tục theo hành vi user**
## 4️⃣ Các field quan trọng (dev cần nhớ)
### LoyaltyObject thường có:
```json
{

"genericClass": {

"id": "3388000000022345678.loyaltyclass_shop_123456",

"issuerName": "Loyalty Class shop_123456",

"genericType": "GENERIC_LOYALTY_CARD",

"callbackOptions": {

"url": "https://your-app.com/app/api/v1/google-wallet/callback"

},

"classTemplateInfo": {

"cardTemplateOverride": {

"cardRowTemplateInfos": [

{

"twoItems": {

"startItem": {

"firstValue": {

"fields": [

{

"fieldPath": "object.textModulesData['customer_point_start_0']"

}

]

}

},

"endItem": {

"firstValue": {

"fields": [

{

"fieldPath": "object.textModulesData['customer_tier_end_0']"

}

]

}

}

}

}

]

}

}

},

"genericObject": {

"id": "3388000000022345678.loyaltyObj_customer_789",

"classId": "3388000000022345678.loyaltyclass_shop_123456",

"logo": {

"sourceUri": {

"uri": "https://cdn.shopify.com/s/files/1/0123/4567/files/logo.png?width=50"

},

"contentDescription": {

"defaultValue": {

"language": "en-US",

"value": "LOGO_IMAGE_DESCRIPTION"

}

}

},

"cardTitle": {

"defaultValue": {

"language": "en-US",

"value": "Joy Loyalty Rewards"

}

},

"header": {

"defaultValue": {

"language": "en-US",

"value": "John Doe"

}

},

"textModulesData": [

{

"id": "customer_point_start_0",

"header": "Point",

"body": "1,250"

},

{

"id": "customer_tier_end_0",

"header": "Tier",

"body": "Gold"

}

],

"barcode": {

"type": "QR_CODE",

"value": "joy_gid://shopify/Customer/12345_customer_789_avada",

"alternateText": ""

},

"heroImage": {

"sourceUri": {

"uri": "https://cdn.shopify.com/s/files/1/0123/4567/files/loyalty-banner.png"

},

"contentDescription": {

"defaultValue": {

"language": "en-US",

"value": "Hero Image"

}

}

},

"hexBackgroundColor": "#25272C"

}

}
```
📌 **QR code cực quan trọng** → dùng để scan tại quầy.
