# 05 – Shopify tự làm AR tới đâu

Thuộc [[9 - App AR thử sản phẩm cho Shopify/00 - Tổng quan|00 - Tổng quan]].

> 📖 = trích nguồn. 💭 = nhận định AI. ⚠️ = chưa kiểm chứng.
> Ngày nghiên cứu: 2026-10-23.

**Kết luận trước:** 📖 Shopify làm AR **từ 2018**, nhưng chỉ làm phần "cái máy chiếu": nhận file 3D, hiện 3D trên trang, mở AR trên điện thoại. 📖 Phần "làm ra file 3D" Shopify **không tự làm**: năm 2018 họ đẩy cho đối tác, hiện nay các app bên thứ ba làm. ⚠️ Em không tìm được nguồn chính thức nào nói Shopify sắp tự sinh 3D từ ảnh. 💭 Rủi ro lớn hơn không đến từ Shopify mà từ **mấy app ảnh → 3D mới ra năm 2026**.

## 1. Shopify AR là gì (so sánh đời thường)

💭 Nghĩ như **cái máy chiếu phim**: Shopify cho sẵn máy chiếu (hiện 3D, bật AR). Nhưng **cuộn phim** (file 3D của từng sản phẩm) thì merchant phải tự có. Không có phim thì máy chiếu vô dụng.

## 2. Dòng thời gian

| Thời điểm | Shopify làm gì | Nguồn |
|---|---|---|
| 2018-09-17 | Ra mắt Shopify AR, dựa trên AR Quick Look của Apple, xem AR ngay từ Safari iOS, không cần app riêng | 📖 [Shopify News](https://www.shopify.com/news/shopify-ar-offers-the-tools-to-build-augmented-shopping-experiences) |
| 2018 | Kèm chợ dịch vụ đối tác chuyên làm mô hình 3D + app "3D Warehouse" để lưu mô hình | 📖 theo [Retail Dive](https://www.retaildive.com/news/shopify-brings-ar-features-to-mobile-commerce-platform/532622) (⚠️ thông cáo Shopify không nhắc 2 thứ này) |
| 2020-07-23 | Shopify Engineering đăng clip 33 giây "Shopify AR Stroller" (đặt xe đẩy em bé vào phòng thật), trích từ buổi nói "AR/VR at Shopify" của Daniel Beauchamp, Head of AR/VR | 📖 [YouTube](https://www.youtube.com/watch?v=ntX0cOr4r08) |
| ⚠️ khoảng 2019–2020 | Shopify cho tải 3D + video thẳng vào product media, không cần app | ⚠️ [Retail Dive](https://www.retaildive.com/news/shopify-launches-3d-model-video-integration-for-merchants/574459), chưa mở trang |
| Hiện tại | Nhận `GLB`/`USDZ` tới 500 MB, tự đổi định dạng, tự nén file > 15 MB; theme dùng `model-viewer` + Shopify-XR | 📖 xem [[9 - App AR thử sản phẩm cho Shopify/02 - Kỹ thuật làm được gì hôm nay\|02]] |
| 2025-11 → 2026-03 | Nút AR "View in your space" **hỏng trên Safari iOS 26**. Shopify nói đã sửa 12/2025, nhưng 03/2026 vẫn có người báo hỏng trên theme Horizon | 📖 [Shopify dev community](https://community.shopify.dev/t/view-in-space-ar-button-no-longer-works-on-safari/25947) |

Trích nguyên văn:

> "a set of tools and services that make creating AR shopping experiences accessible for all of our merchants." (Shopify, 2018)

Một bộ công cụ và dịch vụ giúp mọi merchant làm được trải nghiệm mua sắm AR.

> "We have a fix for this that should be going out soon." (nhân viên Shopify, 2025-12-04)
> "Looks like this particular issue was fixed in December." (2026-01-27)

## 3. Shopify đang **không** làm gì (theo những gì em tìm)

| Thứ | Tình trạng |
|---|---|
| Tự sinh 3D từ ảnh sản phẩm (Shopify Magic / Sidekick) | ⚠️ Không tìm được nguồn chính thức nói có |
| Quét 3D sản phẩm bằng iPhone | 📖 Có video demo "the new Shopify feature to generate 3D scans of products" (THE ECOM BULL, 2023-11-11, [YouTube](https://www.youtube.com/watch?v=pmgLziCO2yo)). ⚠️ Chưa có tài liệu Shopify, chưa xem nội dung video |
| Thử quần áo / kính | Không thấy, toàn app bên thứ ba |
| App Shopify cho Apple Vision Pro | ⚠️ Không tìm được. Các app Vision Pro mua sắm là của Best Buy, Wayfair, StockX, e.l.f. |
| Editions 2026 có tính năng 3D/AR mới | ⚠️ Không tìm được. Cần mở trang Editions chính thức để chắc |

💭 Nhận định: 8 năm qua Shopify giữ AR ở mức "hạ tầng", và chính nút AR còn hỏng vài tháng trên iOS 26. Có vẻ AR không phải ưu tiên của họ. Nhưng **không loại trừ** được việc Shopify thêm "ảnh → 3D" vào Sidekick, vì AI tạo ảnh/mô tả SP họ đã làm.

## 4. Nguy cơ thật: app ảnh → 3D đã có

📖 Mở trực tiếp App Store ngày 2026-10-23:

| App | Ra mắt | Giá | Cách làm | Đúng kích thước thật? | Review |
|---|---|---|---|---|---|
| [AI 3D Model Generator](https://apps.shopify.com/ai-3d-models-generator) (Polar Bear Commerce) | 2026-02-04 | Miễn phí | "Select 2-3 images, and our AI generates a model in 3-10 minutes." Đăng lên trang SP 1 click | Không nhắc | 0 |
| [3Dify](https://apps.shopify.com/3dify) (eCommerce360) | 2026-05-28 | $0 (3 lượt/tháng) / $9.99 không giới hạn | "supports single-image and multi-view generation workflows"; hiện qua theme app extension riêng | Không nhắc | 0 |
| Viewly | 2026-05-06 | $0–19 | Tải GLB; ảnh chụp màn hình có nút "Generate" chưa rõ | Có đặt "life-size" nhưng từ GLB có sẵn | 0 |

💭 Hệ quả cho ý tưởng của anh:
1. **"Ảnh → 3D" không còn là chỗ trống.** Đã có app miễn phí và $9.99.
2. Chỗ còn hở (chưa thấy app nào ghi rõ): **đúng kích thước thật** (scale theo số đo) + **merchant duyệt** + **đẩy vào product media gốc** (để nút AR của Shopify dùng luôn, không cần widget riêng).
3. Cả 3 app đều 0 review → chưa ai chứng minh merchant chịu dùng. Đây vừa là cơ hội, vừa là tín hiệu cầu yếu.

## 5. Nếu Shopify làm thì sao

| Shopify làm | Ý tưởng anh còn gì |
|---|---|
| Ảnh → 3D miễn phí trong admin | 💭 Gần như mất phần lõi. Chỉ còn nhập hàng loạt + chỉnh kích thước, khó tính tiền |
| Không làm (giữ như 8 năm qua) | 💭 Cạnh tranh với app ảnh → 3D khác bằng độ đúng kích thước |

💭 Cách giảm rủi ro: **không đặt cược vào "AI sinh 3D"** (thứ Shopify hoặc app khác dễ chép). Đặt cược vào thứ hẹp hơn: hàng phẳng đúng cỡ + kiểm tra kích thước trước khi đăng, rồi đo xem khách có bấm AR không. Nếu 2 tuần kiểm chứng ở [[9 - App AR thử sản phẩm cho Shopify/04 - Rủi ro và kế hoạch kiểm chứng|04]] cho thấy khách ít bấm, dừng luôn.
