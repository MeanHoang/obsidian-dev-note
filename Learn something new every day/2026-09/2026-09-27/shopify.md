# 🛒 Shopify — 2026-09-27

> Tuần này Shopify ra Polaris 2.0 RC cho giao diện admin mới, hạn chót 1/10 phải nâng UI extension lên 2026-01 để còn deploy được, Events thay đổi payload và header, và Dev Dashboard được làm lại.

## ⭐ [Polaris 2.0 release candidate](https://shopify.dev/changelog/polaris-2-0-release-candidate) — (shopify.dev changelog, 24/09/2026)
**Đây là gì:** Bản release candidate của Polaris 2.0 (Web Components qua CDN) cho giao diện App Home nhúng trong admin. Giao diện mới khớp với admin redesign, bắt đầu rollout từ 15/09/2026.
**Chi tiết:**
- Load qua CDN `https://cdn.shopify.com/shopifycloud/polaris-2.0-rc.js`. Bản này phải chủ động bật: app đang dùng `polaris-1.js` sẽ không tự lên 2.0.
- Component tự đổi theo phiên bản giao diện admin của từng store. Khi chạy ngoài admin thì mặc định dùng style mới.
- App **Built for Shopify** phải cập nhật trước **1/5/2027**.
- App đang dùng Polaris React phải chuyển sang Web Components trước. Nên làm trước các component Page, Section, Button. Nội dung sticky thì dùng biến CSS `--shopify-safe-area-inset-bottom`.
- Admin UI extension và App Home UI extension tự cập nhật, không cần sửa code.
**Vì sao đáng đọc:** Admin của Joy Loyalty viết bằng React Polaris, nên muốn giữ badge Built for Shopify thì phải lên kế hoạch chuyển sang Polaris Web Components và test trên cả giao diện admin cũ lẫn mới trước tháng 5/2027.

## ⭐ [Request a bundle size exception for existing UI extensions](https://shopify.dev/changelog/request-a-bundle-size-exception-for-existing-ui-extensions) — (shopify.dev changelog, 17/09/2026)
**Đây là gì:** Giới hạn dung lượng bundle cho UI extension (Admin, Checkout UI, Customer Accounts, POS) từ API 2025-10 trở đi, kèm quy trình xin ngoại lệ.
**Chi tiết:**
- Giới hạn là 64 KB JavaScript đã nén cho mỗi extension. Riêng full-page customer account extension được tới 128 KB.
- **Hạn chót 1/10/2026:** mọi UI extension hiện có phải lên API **2026-01** trở lên thì mới deploy tiếp được.
- Đã tối ưu mà vẫn vượt giới hạn thì nộp bundle đã minify kèm esbuild metafile qua Google Form để Shopify xét.
- Shopify chỉ cấp ngoại lệ khi phần dung lượng còn lại "unavoidable". Các lỗi tránh được như thư viện nặng, dependency trùng hay translation thừa sẽ bị từ chối.
**Vì sao đáng đọc:** Chỉ còn khoảng 4 ngày: cần kiểm tra ngay bundle size và API version của các checkout/customer account extension của Joy (widget điểm, đổi thưởng), nếu không sẽ bị chặn deploy ngay trước BFCM.

## ⭐ [Updates to Events payloads and subscription configuration](https://shopify.dev/changelog/updates-to-events-payloads-and-subscription-configuration) — (shopify.dev changelog, 16/09/2026)
**Đây là gì:** Thay đổi cần xử lý (action required) trong Events & webhooks: đổi cấu trúc payload, cú pháp trigger và header khi giao event.
**Chi tiết:**
- `fields_changed` không còn là mảng phẳng mà thành object gồm các mảng `added`, `updated`, `removed`.
- Subscribe ở parent path giờ phải có wildcard ở cuối (vd `product.variants.*`). Subscription cũ vẫn chạy đến lần deploy tiếp theo. Trigger ở cấp leaf không đổi.
- Header `shopify-event-id` và `shopify-resource-id` bị bỏ. Cần gỡ code custom đang phụ thuộc vào hai header này và cập nhật các package Shopify API lên bản mới nhất.
- Trang không nêu deadline cụ thể, chỉ ghi thay đổi có hiệu lực từ 16/09/2026.
**Vì sao đáng đọc:** Nếu handler trên Firebase/GCP của Joy đang dùng Events (vd theo dõi thay đổi customer/metafield) để dedupe theo `shopify-event-id` hoặc đọc `fields_changed` dạng mảng, cần sửa trước lần deploy tới.

## [The new Dev Dashboard: your command center for building](https://shopify.dev/changelog/the-new-dev-dashboard) — (shopify.dev changelog, 25/09/2026)
**Đây là gì:** Dev Dashboard (dev.shopify.com/dashboard) được thiết kế lại. Trang Home hiện doanh thu và lỗi/cảnh báo theo mức ưu tiên. Trang Apps có số install, API request volume, error rate. Trang Stores gộp client/dev/collaborator store. Trang Logs gồm mọi API request, webhook delivery và app event, lưu 30 ngày.
**Vì sao đáng đọc:** Joy có thể dùng Logs để debug webhook delivery hoặc lỗi API trên store của merchant mà không phải tự dựng thêm logging, rất hữu ích trong mùa BFCM.

## [AI Toolkit skills have been consolidated to `shopify`](https://shopify.dev/changelog/ai-toolkit-skills-have-been-consolidated) — (shopify.dev changelog, 25/09/2026)
**Đây là gì:** Các skill lẻ của Shopify AI Toolkit (`shopify-admin`, `shopify-functions`, …) được gộp thành một skill `shopify`. Ai dùng `npx skills` thì chạy `npx skills remove -y ...` rồi `npx skills add Shopify/shopify-ai-toolkit --skill shopify`. Skill `ucp` và Dev MCP không bị ảnh hưởng.
**Vì sao đáng đọc:** Team Joy nếu đang dùng AI agent với các skill Shopify cũ cần cập nhật để agent tiếp tục có đúng context về Admin API và Functions.

## [Delivery options in Shopify Functions input now expose their metafields](https://shopify.dev/changelog/delivery-options-in-shopify-functions-input-now-expose-their-metafields) — (shopify.dev changelog, 15/09/2026)
**Đây là gì:** Từ API 2026-10, function có thể gọi `metafield(namespace:, key:)` trên `cart.deliveryGroups.deliveryOptions` (Delivery Customization và các function có delivery options trong input). Metafield trong namespace của app khác sẽ trả về null.
**Vì sao đáng đọc:** Nếu Joy làm reward kiểu "free shipping cho tier VIP" bằng Functions, giờ có thể gắn dữ liệu có cấu trúc vào delivery option thay vì phải parse text.
