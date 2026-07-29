# Shop Sign-in & AI Agents

Ba feature liên quan đến authentication, AI integration, và kết nối online-offline.

---

## 1. Seamless Shop Sign-in and Account Experience

**Là gì:** Cải thiện trải nghiệm đăng nhập và quản lý tài khoản trên Shop, đảm bảo tính nhất quán across experiences.

### Cách hoạt động

Shop sign-in giờ hoạt động với nhiều loại customer account hơn, và feature được giữ **consistent** — dù shopper đăng nhập ở đâu (Shop app, Shop Pay, merchant store), trải nghiệm đều giống nhau.

### Chi tiết từ docs

**One-Tap Checkout:** Customer đã sign in với Shop hoàn thành mua hàng chỉ 1 tap — shipping và billing info được tự động pre-fill bởi Shop Pay.

**Account Syncing:** Syncing features across Shopify experience — tạo unified ecosystem cho Shop user.

**Auto Authentication:** Customer tự động sign in vào online store sau khi checkout bằng Shop Pay.

### Phân loại theo store

| Loại store | Hành vi |
|------------|---------|
| **Có Shop Pay** | Sign in with Shop tự động bật, **không tắt được** trừ khi deactivate Shop Pay |
| **Không có Shop Pay** | Mặc định bật, có thể toggle on/off qua Settings > Customer Accounts > Authentication |

### Feature bổ sung

- **Lead Capture Integration:** Khi customer dùng Shop email trên lead capture form, họ được prompt authenticate với Shop
- **Theme Customization:** Merchant thêm button "Sign in with Shop" và "Follow on Shop" vào storefront

---

## 2. Shop Skill for Personal AI Agents

**Là gì:** Tích hợp cho phép các AI agent bên thứ ba truy cập vào hệ sinh thái sản phẩm Shopify thông qua Shop.

### Cách hoạt động

Shop cung cấp một "skill" mà các AI agent platform có thể gọi. Shopper sử dụng AI agent cá nhân có thể:
- **Discover products** trên toàn bộ Shopify thông qua agent
- **Approve purchases** (duyệt mua) qua Shop

### Ý nghĩa

Đây là kênh bán hàng hoàn toàn mới — shopper không cần mở Shop app hay website, chỉ cần nói với AI agent "tìm cho tôi đôi giày chạy bộ dưới 100 đô" và agent sẽ dùng Shop skill để tìm + đề xuất + hoàn tất mua hàng.

Về bản chất, Shopify đang position Shop app như **commerce layer** cho AI agent ecosystem — bất kỳ AI agent nào cũng có thể tích hợp khả năng mua sắm qua Shop skill.

**Link:** [shop.app/skill](https://shop.app/skill)

> Lưu ý: Tại thời điểm viết, docs chưa công bố chi tiết về API/SDK cho developer muốn tích hợp Shop skill vào AI agent platform. Trang shop.app/skill trả về 429 (rate limited) khi fetch.

---

## 3. Online to In Person with Shop App

**Là gì:** Kết nối shopper trên Shop app với cửa hàng vật lý (retail store) gần đó, tạo trải nghiệm omnichannel liền mạch.

### Cách hoạt động

Merchant có thể:
- Được **discover** bởi shopper trong khu vực (local discovery)
- Cung cấp tùy chọn **in-store pickup** (mua online, nhận tại cửa hàng)
- Hỗ trợ quy trình **trả hàng dễ dàng** (easy returns) qua cả hai kênh

### Ý nghĩa

Feature này biến Shop app thành cầu nối online-offline. Shopper research trên app, mua online, nhận hoặc trả tại cửa hàng — full omnichannel loop.

**Link docs:** [Returns - Shop Help](https://help.shop.app/en/shop/managing-orders/returns#request-return)

---

## Tổng kết

Ba feature này nằm ở **tầng platform** — không phải feature cho từng merchant mà là cách Shopify mở rộng Shop app thành:
1. **Identity layer** (seamless sign-in) — một account cho mọi nơi
2. **Commerce API cho AI** (Shop skill) — AI agent mua hàng qua Shop
3. **O2O bridge** (online to in person) — nối digital và physical retail

Đối với app developer, phần **Shop Skill** đáng theo dõi nhất — khi Shopify mở API/SDK cho việc tích hợp skill vào AI agent, đây sẽ là cơ hội lớn.

---

## Nguồn

- [Sign-in features - Shopify Help](https://help.shopify.com/en/manual/online-sales-channels/shop/sign-in-features)
- [shop.app/skill](https://shop.app/skill)
- [Returns - Shop Help](https://help.shop.app/en/shop/managing-orders/returns#request-return)
- [Shopify Editions Spring 2026](https://www.shopify.com/editions/spring2026)

Quay lại: [[01 - Shop App Overview]]
