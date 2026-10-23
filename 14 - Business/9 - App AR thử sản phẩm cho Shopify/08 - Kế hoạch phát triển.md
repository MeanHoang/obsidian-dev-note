# 08 – Kế hoạch phát triển

Thuộc [[9 - App AR thử sản phẩm cho Shopify/00 - Tổng quan|00 - Tổng quan]]. Hướng: [[9 - App AR thử sản phẩm cho Shopify/03 - Phương án MVP và đề xuất|03]]. Stack: [[9 - App AR thử sản phẩm cho Shopify/06 - Stack công nghệ|06]]. Xu hướng: [[9 - App AR thử sản phẩm cho Shopify/07 - Shopify và thế giới đang đi về đâu|07]].

> Chốt hướng ngày 2026-10-23 (anh chốt): **bộ dữ liệu 3D đúng kích thước gắn với variant là tài sản lõi; màn AR đổi variant trong cảnh là cách dùng hôm nay; sẵn sàng cho AI agent và kính.**
> Thời gian là 💭 ước tính cho 1 dev, chưa đo.

**Kết luận trước:** Chưa viết app vội. Làm 3 việc thử nhanh **song song** trong 1 tuần (kỹ thuật, chất lượng sinh 3D, merchant). Qua cả 3 cửa mới thiết kế dữ liệu và làm MVP.

## Các bước

| # | Bước | Làm gì | Thời gian | Qua cửa khi | Ra gì |
|---|---|---|---|---|---|
| 1 | Thử kỹ thuật | Trang HTML tĩnh: three.js WebGPU + WebXR đặt 1 cái bàn lên sàn trên Android, thanh 2–3 variant (đổi màu `KHR_materials_variants` + đổi file GLB), mở bằng link `?variant=`; iPhone rơi về Quick Look | 1–2 ngày | Đặt được, không trôi khi đi quanh, đổi variant không mất vị trí, tải < ⚠️ chưa có ngưỡng trên 4G | Video ngắn + số đo dung lượng |
| 2 | Thử sinh 3D | 10 món nội thất thật (ảnh public) × Meshy / Tripo / Rodin / TRELLIS.2; chấm hình khối, texture, đúng cỡ sau khi scale | 2–3 ngày | ≥ ⚠️ 7/10 món dùng được với ít nhất 1 hãng (số để anh sửa) | Bảng chấm điểm + chọn hãng mặc định |
| 3 | Kiểm chứng merchant | Script lọc shop nội thất Shopify đang có `model-viewer` trên trang sản phẩm; nhắn 20 shop; phỏng vấn 8–10 | 1 tuần | ≥ 3 shop muốn dùng thử | Danh sách shop + câu trả lời gốc |
| 4 | Thiết kế dữ liệu lõi | Schema "sản phẩm 3D": GLB đúng mét, material variants, số đo từng variant, map variant Shopify, ảnh gốc; chọn metafield/metaobject + trường kích thước chuẩn; kiểm Catalog API đọc được gì | 2–3 ngày | Một bộ dữ liệu chạy được cả AR web, Quick Look, `model-viewer` | Tài liệu schema + định nghĩa metafield |
| 5 | MVP | Admin (React Router + Polaris web components): chọn SP, sinh 3D, duyệt, map variant. Storefront (theme app extension): nút + màn AR + thanh variant + thêm giỏ. Đếm sự kiện | 4–6 tuần | Chạy trên 2–3 shop thật | App bản beta |
| 6 | Beta và đo | 2–3 shop dùng thật 2–4 tuần | 2–4 tuần | Có số: % mở AR, đổi variant / phiên, thêm giỏ từ AR | Báo cáo số liệu → quyết định làm tiếp / dừng |
| 7 | Sau MVP | Sidekick App Extension, Gaussian Splatting, nhiều món cùng lúc, App Clip iPhone, link AR cho AI agent | — | Theo số liệu bước 6 | — |

## Luật dừng

- Bước 3 dưới 3 shop quan tâm → **dừng**, không viết MVP.
- Bước 2 không hãng nào đạt → bỏ "sinh 3D trong app", chỉ nhận GLB merchant có sẵn (thị trường nhỏ hơn).
- Bước 1 không đổi variant mượt trên Android → xem lại `model-viewer` thay cho three.js tự viết.

## Cần anh chuẩn bị

| Việc | Cho bước |
|---|---|
| 1 máy Android có ARCore (Chrome mới) | 1 |
| Tài khoản Meshy, Tripo, Rodin (gói thấp nhất có API) | 2 |
| 1 dev store Shopify trống cho app này | 4, 5 |
| Kênh nhắn merchant (email / form liên hệ shop) và lời nhắn anh duyệt | 3 |
