**Google Wallet API** là bộ API của Google cho phép **app/web tạo, quản lý và hiển thị thẻ kỹ thuật số** trong **Google Wallet** (ví dụ: vé máy bay, vé sự kiện, thẻ thành viên, thẻ quà tặng…).
Mình tóm gọn cho dev dễ hình dung 👇

---
## Google Wallet API là gì?
- Cho phép **tạo “Pass” (thẻ)** và **lưu vào Google Wallet của user**
- Thay thế cho Google Pay Passes API (bản cũ)
- Dùng cho **Android app, Web backend (Node, Java, Python…)**
---
## Dùng Google Wallet API để làm gì?
Các loại thẻ phổ biến:
- 🎫 Event ticket (vé xem phim, concert)
- ✈️ Boarding pass (vé máy bay)
- 🏬 **Loyalty / Membership card (thẻ thành viên)**
- 🎁 Gift card
- 🎟️ Transit pass (một số quốc gia)
👉 **Không dùng để thanh toán tiền** (cái đó là Google Pay API).
## Kiến trúc tổng quát (rất quan trọng)
```json
User → App/Web
        ↓
     Backend (Node.js)
        ↓
Google Wallet API
        ↓
User lưu thẻ vào Google Wallet
```
⚠️ **API chỉ nên gọi từ backend**, không gọi trực tiếp từ frontend.
## Các khái niệm cốt lõi
### 1. **Issuer**
- Là tổ chức phát hành thẻ (bạn)
- Đăng ký trong Google Cloud Console
### 2. **Class**
- Định nghĩa “khuôn mẫu” thẻ
- Ví dụ: EventTicketClass, LoyaltyClass
- Chứa logo, màu sắc, policy chung
### 3. **Object**
- Thẻ cụ thể của **một user**
- Ví dụ: vé concert của Hoàng, ghế A1
👉 Quan hệ:
```json
1 Class → nhiều Object
```
## Flow tạo thẻ (chuẩn Google)
1. Tạo **Class** (chỉ cần 1 lần)
2. Tạo **Object** cho user
3. Sinh **JWT**
4. Trả link cho user:
```json
https://pay.google.com/gp/v/save/{JWT}
```
5. User bấm → **Save to Google Wallet**

# 1️⃣ Tổng quan thiết lập Google Wallet API (chuẩn 2026)

Để **generate Loyalty Pass**, bạn cần **4 thứ BẮT BUỘC**:
```json
Google Cloud Project
→ Google Wallet API enabled
→ Issuer account
→ Service Account + key
```
❌ Thiếu **1 trong 4** → `GaxiosError: Permission denied`
# 2️⃣ Các bước thiết lập đúng chuẩn (đừng skip)
## BƯỚC 1: Tạo / chọn Google Cloud Project
Vào: **Google Cloud Console**
- Chọn Project (hoặc tạo mới)
- Ghi nhớ `PROJECT_ID`
## BƯỚC 2: Enable Google Wallet API (rất hay quên)
Vào:
```
APIs & Services → Library → Google Wallet API
```
👉 **Enable**
⚠️ Nếu chỉ enable Google Pay API → KHÔNG ĐỦ
## BƯỚC 3: Tạo Issuer (cực kỳ quan trọng)
Vào:
```
Google Wallet Console
```
👉 [https://pay.google.com/business/console](https://pay.google.com/business/console)
- Tạo **Issuer**
- Lấy:
    - `Issuer ID` (vd: `3388000000023456789`)
📌 **Issuer ID ≠ Project ID**
## BƯỚC 4: Tạo Service Account
Vào:
```
IAM & Admin → Service Accounts
```
- Create service account
- Tạo **JSON key**
- Download file `.json`
Ví dụ: 
```json
{
  "client_email": "wallet-sa@xxx.iam.gserviceaccount.com",
  "private_key": "-----BEGIN PRIVATE KEY-----"
}
```
## BƯỚC 5: GÁN QUYỀN (chỗ 99% dev bị lỗi)
Trong **Google Wallet Console**:
👉 Issuer → Settings → **Users & permissions**
Add:
```json
wallet-sa@xxx.iam.gserviceaccount.com
```
Role:
```json
Developer
```
❗ Nếu không add service account vào Issuer  
→ **Permission denied khi gọi API**
