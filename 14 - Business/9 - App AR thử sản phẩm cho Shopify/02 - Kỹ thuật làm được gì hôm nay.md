# 02 – Kỹ thuật: làm được gì hôm nay

Thuộc [[9 - App AR thử sản phẩm cho Shopify/00 - Tổng quan|00 - Tổng quan]]. Số nguồn trong ngoặc khớp bảng nguồn ở note đó.

**Kết luận trước:** 💭 Đặt đồ 3D trong phòng bằng điện thoại **đã chạy được trên mọi theme Shopify hiện đại**, không cần app. Thứ thiếu là file 3D đúng kích thước. AR "ở lại trong trình duyệt" trên iPhone thì chưa có bằng chứng là làm được: iPhone mở AR Quick Look của hệ thống rồi quay lại trang.

## 1. Shopify có sẵn gì (📖 đã mở tài liệu chính thức)

**Định dạng và dung lượng** (nguồn 1)
> "File type: `GLB`, `USDZ`"
> "File size: Up to 500 MB"
> "Files are converted to ensure both a .USDZ and .GLB version of the model is available."
> "If you upload a 3D model file that exceeds 15 MB, then your file is automatically optimized."

Shopify nhận GLB và USDZ tới 500 MB, tự tạo bản còn lại, tự nén file trên 15 MB.

**Xem 3D và mở AR trên theme** (nguồn 2)
> "Shopify-hosted 3D models use Google's model viewer component"
> "you can use the Shopify-XR library to support AR Quick Look in iOS's Safari, and Android's Scene Viewer"

Mô hình 3D trên Shopify dùng `<model-viewer>` của Google. Thư viện Shopify-XR mở AR Quick Look trên iPhone và Scene Viewer trên Android. Theme gọi bằng filter `{{ media | model_viewer_tag }}` hoặc `window.ShopifyXR.launchXR`.

💭 Hệ quả: một app chỉ làm "nút xem AR" là làm lại thứ Shopify cho miễn phí.

## 2. Ba mức khả thi

| Tính năng | Mức | Ghi chú |
|---|---|---|
| Đặt 1 sản phẩm 3D đúng kích thước trong phòng | ✅ Làm được hôm nay | 📖 Shopify gốc (nguồn 1, 2). Cần file 3D đúng tỉ lệ |
| Tranh, thảm, gương, giấy dán tường (hàng phẳng) | ✅ Làm được hôm nay, chính xác | 💭 Chỉ là một tấm phẳng dán ảnh SP + kích thước thật. Sinh GLB bằng code được, không cần AI |
| Thử kính, trang sức, đồng hồ bằng camera | ⚠️ Làm được nhưng có giới hạn | 💭 Theo dõi mặt/tay trong trình duyệt có thư viện sẵn; mỗi loại cần cách gắn riêng; ánh sáng, che khuất làm lệch |
| Thử quần áo | ⚠️ Làm được dạng ảnh AI tĩnh | 📖 GenLook làm từ ảnh 2D. 💭 Ra ảnh đẹp, không cho biết vừa size thật; tốn tiền theo lượt tạo |
| Biến ảnh SP thường thành 3D | ⚠️ Làm được, chất lượng không đều | 📖 Meshy có API image-to-3D tính theo credit (nguồn 16). 💭 Đồ có hình khối đơn giản ổn hơn; đồ mỏng, trong suốt, phản chiếu dễ hỏng; tỉ lệ phải chỉnh bằng kích thước merchant nhập |
| Nhiều sản phẩm cùng lúc trong 1 cảnh AR | ⚠️ Chưa kiểm | ⚠️ Chưa thấy tài liệu Shopify nói có. 💭 AR Quick Look / Scene Viewer mở từng file; muốn gộp phải ghép thành 1 file hoặc tự viết WebXR |
| AR ở lại trong trang web trên iPhone (WebXR) | ❌ Chưa có bằng chứng | ⚠️ Không tìm được nguồn chính thức 2026 nói Safari iOS hỗ trợ `immersive-ar`. Có bài nói WebXR được đề xuất vào Interop 2026 nhưng đoạn trích bị cắt, không rõ kết quả (nguồn 18) |
| Kính AR / MR | 🔮 Tương lai | 💭 Giữ dữ liệu SP (GLB + kích thước thật) chuẩn là đủ để dùng lại sau |

## 3. Luồng kỹ thuật một khách mua (nội thất, file 3D có sẵn)

1. Khách mở trang SP trên iPhone. Theme render `model-viewer` từ product media (nguồn 2).
2. Khách bấm nút AR. Shopify-XR mở AR Quick Look với file USDZ Shopify đã tự tạo (nguồn 1).
3. Khách đặt ghế xuống sàn, đi vòng quanh. Đây là app của hệ thống, không phải trang web.
4. Khách đóng Quick Look, quay lại trang SP, chọn variant, thêm giỏ.
5. 💭 Đổi variant (màu) trong AR: mỗi variant cần một file 3D riêng gắn vào ảnh variant.

## 4. Chi phí và quyền riêng tư

- 📖 Lưu trữ file 3D: Shopify giữ, không tốn tiền app (nguồn 1).
- 📖 Sinh 3D từ ảnh qua Meshy API: Image to 3D (Meshy-6) 20–35 credit/lần tuỳ texture; lỗi thì không trừ credit (nguồn 16). ⚠️ Chưa đổi credit ra USD.
- 💭 AR Quick Look / Scene Viewer chạy trên máy khách, ảnh camera không gửi về server app → ít rủi ro riêng tư. Try-on quần áo bằng AI thì **phải gửi ảnh người** lên server → cần chính sách xoá ảnh rõ ràng.
