# Shop Editor — Blocks & Posts

Hai feature giúp merchant tuỳ chỉnh storefront và tạo content marketing trực tiếp trên Shop app.

---

## 1. Blocks in Shop Editor

**Là gì:** Hệ thống content block cho phép merchant tuỳ chỉnh product detail page (PDP) trên Shop store, tương tự cách customize theme trên online store nhưng dành riêng cho kênh Shop.

### Các loại Block

Theo docs Shopify Help, Shop Editor hỗ trợ 6 loại section:

| Block | Mô tả |
|-------|--------|
| **Image** | Full-width image cho lifestyle shots, size guides, brand visuals. Có thể link đến product, collection, hoặc external URL |
| **Product Details** | Section mặc định, vị trí cố định, giới hạn 1 per page, không move/customize được |
| **Product Group** | Hiển thị 1-4 related products, có headline tuỳ chỉnh — dùng cho cross-selling và bundle |
| **Shoppable Video** | Video với tối đa 10 shoppable products overlay trên video |
| **Slideshow** | Image/video carousel, 3 style (basic, graphic, overlay), có CTA button và link đến product/collection |
| **Video** | Full-width video showcase, hỗ trợ uploaded content hoặc customer-generated material |

### Giới hạn và lưu ý

- **Tối đa 2 section per template** (ngoài Product Details mặc định)
- Format hỗ trợ: JPEG, PNG, WebP (image); MOV, MP4 (video)
- Customization hiển thị **bên dưới** phần Ratings & Reviews
- **Ngôn ngữ:** Chỉ hỗ trợ primary store language trên product pages. Developer bên thứ ba có thể tích hợp đa ngôn ngữ qua Translation API và `translationsRegister` mutation
- Shop template hoạt động **độc lập** với online store theme — customize ở đây không ảnh hưởng theme và ngược lại

### Workflow cho merchant

1. Tạo template cho nhóm sản phẩm
2. Thêm section (block) vào template
3. Assign product vào template (đơn lẻ hoặc batch)
4. Product chưa assign sẽ dùng default template

---

## 2. Posts in Shop App

**Là gì:** Content marketing dạng social-like, cho phép merchant tạo bài đăng trực tiếp trên Shop app — tương tự Instagram posts nhưng nằm trong hệ sinh thái mua sắm.

### Cách tạo Post

Có 3 cách:

1. **Manual:** Upload image/video trực tiếp trong Shop channel
2. **Instagram import:** Kết nối Instagram account (Creator hoặc Business), tự động sync Reels, images, carousels từ 90 ngày gần nhất, sau đó sync liên tục
3. **Third-party apps:** Sync shoppable video qua app từ Shopify App Store

### Yêu cầu nội dung (Manual post)

| Field | Giới hạn |
|-------|----------|
| Headline | Tối đa 50 ký tự |
| Caption | Tối đa 2,200 ký tự |
| Media | Tối đa 20 image/video, mỗi video tối đa 2 phút, tối đa 100 MB |
| Tagged items | Tối đa 10 product hoặc 1 collection |

### Nơi hiển thị

Posts xuất hiện ở 3 vị trí:
- **Shop home feed** — ranked theo product relevance
- **Shop Store** — trên trang store của merchant (cả app lẫn shop.app website)
- **Following tab** — cho shopper đã follow store

### Quyền truy cập

Chỉ staff có cả hai permission **Marketing** và **Discounts** mới tạo được post.

### Quản lý sau khi publish

- **Có thể sửa:** headline, caption, ngày hết hạn
- **Không thể sửa:** media files (phải xoá và tạo lại)
- Có thể unpublish, duplicate, hoặc delete vĩnh viễn

### Compliance

Posts phải tuân thủ Shopify Acceptable Use Policy và Shop content policies.

---

## Góc nhìn Developer

Đối với app developer:
- **Blocks:** Hiện tại các block type là cố định (Shopify-defined), chưa có khả năng tạo custom block type. Tuy nhiên, **Shop Minis** có thể được toggle hiển thị trên product page — xem [[04 - Shop Minis cho Developer]]
- **Posts:** Có thể tích hợp qua third-party app để sync shoppable video. Docs chưa đề cập đến public API cho việc tạo post programmatically ngoài Instagram import flow
- **Translation API:** Developer có thể dùng `translationsRegister` mutation để hỗ trợ đa ngôn ngữ cho product page trên Shop

---

## Nguồn

- [Customize product page - Shopify Help](https://help.shopify.com/en/manual/online-sales-channels/shop/manage-shop-store/customize/product-page)
- [Posts - Shopify Help](https://help.shopify.com/en/manual/online-sales-channels/shop/marketing/posts)
- [Shopify Editions Spring 2026](https://www.shopify.com/editions/spring2026)

Quay lại: [[01 - Shop App Overview]]
