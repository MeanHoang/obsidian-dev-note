# 🛒 Shopify — 2026-06-18

> Bão update từ Summer '26 Editions (stream 17/06): nóng nhất là **Sidekick app extensions** mở cho mọi dev — đối thủ loyalty Smile đã live. Đáng chú ý deadline mới: app Returns/Subscription phải auth bằng Customer Account API trước **01/12/2026** để giữ Built for Shopify.

## ⭐ [Sidekick app extensions available today](https://shopify.dev/changelog/sidekick-app-extensions-available-today) — (shopify.dev/changelog, 17/06/2026)
**Đây là gì:** Sidekick là trợ lý AI tích hợp sẵn trong Shopify admin. "Sidekick app extensions" cho phép app của bên thứ ba cắm dữ liệu và hành động của mình vào trợ lý AI này, để merchant hỏi/thao tác app ngay trong cửa sổ chat Sidekick thay vì mở app riêng.
**Chi tiết:**
- Hiệu lực từ 13/05/2026; nay mở cho **tất cả** app developer (trước đó là early access).
- Có 2 loại extension: **App Data** (làm nội dung app tìm kiếm được trong Sidekick — vd merchant hỏi "email campaign nào hiệu quả nhất" và app trả số liệu) và **App Actions** (merchant thực thi tác vụ trong app ngay từ Sidekick, có pre-fill context + bước confirm trước khi chạy).
- Đã có 18 app live qua early access, gồm **Klaviyo, Loop, Smile, Judge.me** — tức đối thủ loyalty trực tiếp (Smile) đã có mặt.
- Setup qua Shopify CLI scaffold sẵn hạ tầng extension; không nêu yêu cầu kỹ thuật bắt buộc đặc biệt.
**Vì sao đáng đọc:** Đây là kênh phân phối AI mới và Smile đã chiếm chỗ trước. Joy Loyalty nên dựng App Data extension (merchant hỏi "khách nào sắp hết điểm / tier nào active nhất") + App Action ("tạo reward campaign") để không bị tụt lại trong trải nghiệm Sidekick-first.

## ⭐ [Built for Shopify requirements for Returns/exchanges and Subscription apps](https://shopify.dev/changelog/built-for-shopify-requirements-for-returns-and-exchanges-and-subscription-apps) — (shopify.dev/changelog, 17/06/2026)
**Đây là gì:** Built for Shopify (BFS) là huy hiệu chất lượng cao nhất trong App Store, ảnh hưởng ranking và độ tin cậy. Changelog này thêm yêu cầu mới cho nhóm app Returns/exchanges và Subscription có tính năng self-service hướng tới buyer.
**Chi tiết:**
- **Action Required = Yes.** Deadline hiệu lực: **01/12/2026**.
- Mọi app cung cấp tính năng buyer-facing self-service (quản lý return, đổi hàng, cập nhật subscription...) **bắt buộc** xác thực khách bằng **Customer Account API** — để có một lần đăng nhập thống nhất xuyên storefront, app và customer account.
- App không tuân thủ "có nguy cơ mất trạng thái Built for Shopify".
- Cần review lại tài liệu BFS requirements đã cập nhật.
**Vì sao đáng đọc:** Joy Loyalty có các flow buyer-facing (xem điểm/đổi reward trong customer account). Đây là tín hiệu rõ ràng: Shopify đang chuẩn hóa auth qua Customer Account API cho mọi app chạm tới buyer — nên rà ngay phần đăng nhập/định danh khách của Joy để không rủi ro BFS khi quy định lan sang nhóm loyalty.

## [WhatsApp marketing consent trong Admin API & Customer Account API](https://shopify.dev/changelog/whatsapp-marketing-consent-now-available) — (shopify.dev/changelog, 17/06/2026)
**Đây là gì:** Thêm khả năng đọc/ghi trạng thái đồng ý nhận marketing qua WhatsApp của khách hàng — tương tự consent email/SMS nhưng cho kênh WhatsApp.
**Chi tiết:**
- API version **2026-07**, hiệu lực 16/06/2026, **Action Required = Yes**, có webhook bị ảnh hưởng.
- Mutation mới: `customerWhatsAppMarketingConsentUpdate` — cập nhật consent WhatsApp cho số điện thoại mặc định của khách.
- Field mới: `whatsAppMarketingConsent` đọc được từ object `CustomerPhoneNumber`.
**Vì sao đáng đọc:** Joy Loyalty hay gửi thông báo điểm/reward qua nhiều kênh. Nếu mở rộng WhatsApp, phải tôn trọng consent flag mới này (đọc `whatsAppMarketingConsent` trước khi gửi) để tránh vi phạm — đồng thời consent state nằm trên customer là dữ liệu segment hữu ích.

## [purchaseType & recurringCycleLimit trong Discount UI Extension API](https://shopify.dev/changelog/new-purchasetype-and-recurringcyclelimit-fields-available-in-the-discount-ui-extension-api) — (shopify.dev/changelog, 17/06/2026)
**Đây là gì:** Discount UI extensions là giao diện tùy biến cho trang tạo/sửa discount trong admin. Nay thêm 2 field cấu hình mức discount áp cho one-time hay subscription.
**Chi tiết:**
- API version **2026-04**, hoạt động với cả `DiscountCodeApp` và `DiscountAutomaticApp`. **No action required.**
- `purchaseType`: discount áp cho one-time purchase, subscription, hay cả hai.
- `recurringCycleLimit`: số chu kỳ billing mà discount subscription được áp; giá trị `0` = không giới hạn.
- Trước đây chỉ chỉnh được qua GraphQL Admin API; giá trị được enforce bằng purchase-type filtering tại checkout (xem [purchase-type filtering now enforced](https://shopify.dev/changelog/purchase-type-filtering-now-enforced-for-app-discounts)).
**Vì sao đáng đọc:** Joy Loyalty phát discount làm reward. Nếu merchant có subscription, giờ có thể để Joy cấu hình "reward chỉ áp cho subscription, trong 3 cycle đầu" ngay trên UI — kiểm soát chi phí reward chính xác hơn, không phải hardcode qua API.

## [Bulk queries chạy nhanh hơn tới 4X](https://shopify.dev/changelog/bulk-queries-now-execute-faster) — (shopify.dev/changelog, 17/06/2026)
**Đây là gì:** Bulk Operations là cơ chế export dataset lớn (nhiều khách/đơn) bất đồng bộ thay vì phân trang. Tối ưu backend giúp export nhanh hơn tới 4 lần.
**Chi tiết:**
- Đăng 17/06/2026, là cải thiện backend, **không cần action** từ dev.
- Áp cho export dataset lớn qua bulk query.
**Vì sao đáng đọc:** Joy Loyalty thường sync toàn bộ danh sách customer/đơn để tính điểm & tier. Bulk query nhanh hơn nghĩa là job đồng bộ ban đầu (onboarding store lớn) và backfill chạy nhanh hơn, giảm thời gian merchant chờ thấy dữ liệu loyalty.

## [Hydrogen developer preview](https://shopify.dev/changelog/hydrogen-developer-preview) — (shopify.dev/changelog, 17/06/2026)
**Đây là gì:** Hydrogen là framework của Shopify để build storefront headless. Bản preview mới tách logic thương mại ra khỏi React Router thành **core framework-agnostic**.
**Chi tiết:**
- Cho phép build storefront bằng **bất kỳ JS framework nào**, dùng "commerce primitives" của Shopify, không còn buộc vào React Router.
- Đi kèm "skills" để coding agent (AI) scaffold storefront giúp bạn.
- Vẫn là early preview, Shopify đang xin feedback.
**Vì sao đáng đọc:** Stack Joy là JS thuần — hướng framework-agnostic này mở khả năng nhúng widget loyalty (điểm/reward) vào storefront headless mà không bị ép React Router, dễ tích hợp hơn với các store custom.

## [Apps mở được file picker của Shopify qua Intents API](https://shopify.dev/changelog/intents-api-file-picker) — (shopify.dev/changelog, 17/06/2026)
**Đây là gì:** Intents API (App Bridge) cho phép app gọi các giao diện native của Shopify. Intent mới `pick:shopify/File` mở thẳng file picker của thư viện Files trong Shopify thay vì tự dựng UI chọn file.
**Chi tiết:**
- Hiệu lực 18/06/2026. Gọi bằng `shopify.intents.invoke('pick:shopify/File')`.
- Lọc theo media type, cho chọn nhiều file, preselect file; trả về mảng file ID tại `response.data.ids`.
- Dùng được cả từ App Home (iframe) lẫn UI extension.
**Vì sao đáng đọc:** Khi merchant cấu hình reward/badge/banner trong Joy admin cần chọn ảnh, giờ có thể dùng file picker native của Shopify — bớt code upload tự xây, đồng nhất UX với phần còn lại của admin.
