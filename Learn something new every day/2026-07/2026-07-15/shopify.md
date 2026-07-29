# 🛒 Shopify — 2026-07-15

> Tháng 7/2026 nặng về deprecation: checkout intercept API và cumulative marketing engagements bị khai tử, cùng loạt tính năng mới cho buyer data (Shop User metafields, WhatsApp consent) — nhiều thứ chạm trực tiếp app loyalty.

## ⭐ [Deprecating useBuyerJourneyIntercept API trên checkout UI extensions](https://shopify.dev/changelog/deprecating-the-usebuyerjourneyintercept-api-on-checkout-ui-extensions) — (shopify.dev/changelog)
**Đây là gì:** `useBuyerJourneyIntercept` là một Preact hook trong checkout UI extension cho phép extension chặn buyer tiến tới bước tiếp theo của checkout (ví dụ: chặn "Continue to payment" nếu chưa thỏa điều kiện). `block_progress` là capability khai báo trong `shopify.extension.toml` để bật quyền chặn đó. Cả hai đang chạy client-side trong UI extension.
**Chi tiết:**
- Deprecated từ **1/7/2026**, áp dụng **API version 2026-07 trở đi**. Extension cũ vẫn chạy trên version hiện tại/cũ hơn, nhưng "sẽ bị remove trong một version tương lai" (chưa công bố ngày sunset cụ thể). Tag **Action Required**.
- Để enforce business rule → chuyển sang **cart and checkout validation Function** (chạy server-side, hoạt động trên mọi bề mặt checkout kể cả express wallets và agentic checkout).
- Để từ chối discount code → chuyển logic sang **discount Function API**, nay đã hỗ trợ reject discount code kèm custom message.
- Trade-off: Function chạy server-side nên không tương tác trực tiếp DOM/UI như hook cũ; phải tách rõ "validation logic" (Function) và "hiển thị" (UI extension).
**Vì sao đáng đọc:** Nếu Joy Loyalty có checkout UI extension chèn logic dạng "phải đăng nhập / phải đạt điều kiện điểm mới cho thanh toán" thì đang phụ thuộc chính xác API này. Cần lên kế hoạch port sang validation Function trước khi Shopify sunset, nếu không extension checkout của app sẽ vỡ ở version mới.

## ⭐ [Deprecation of cumulative marketing engagements](https://shopify.dev/changelog/deprecation-of-cumulative-marketing-engagements) — (shopify.dev/changelog)
**Đây là gì:** `marketingEngagementCreate` là mutation trong Admin GraphQL để app báo cáo số liệu tương tác marketing (impressions, clicks, spend...) của một marketing activity về Shopify, phục vụ dashboard Marketing của merchant. Argument `isCumulative` quyết định cách Shopify hiểu con số gửi lên: `true` = tổng tích lũy đến thời điểm đó, `false` = chỉ delta của kỳ báo cáo.
**Chi tiết:**
- `isCumulative` bị **deprecated** và sẽ **default về `false`** — hệ thống không còn hỗ trợ cumulative tracking mặc định.
- Effective **1/7/2026**, **API version 2026-07**. Áp dụng trên Admin GraphQL API.
- Cần làm: cập nhật integration để gửi engagement dạng **non-cumulative** (delta) khi cần. Activity đang dùng cumulative có thể migrate sang non-cumulative bất kỳ lúc nào — không ép deadline cứng.
- Lưu ý: nếu code cũ vẫn gửi số tích lũy nhưng Shopify diễn giải là delta, số liệu marketing sẽ bị cộng dồn sai (phồng lên).
**Vì sao đáng đọc:** App loyalty/retention thường push engagement của campaign (email/SMS referral, reward reminder) lên Marketing dashboard qua `marketingEngagementCreate`. Nếu Joy Loyalty gửi metrics kiểu tích lũy, phải chuyển sang gửi delta để tránh double-count làm sai attribution/ROI hiển thị cho merchant.

## [Shop User metafields đọc được trong Shopify Functions](https://shopify.dev/changelog/shop-user-metafields-in-shopify-functions) — (shopify.dev/changelog)
**Đây là gì:** Shop User là hệ thống định danh buyer xuyên-merchant của Shopify (một buyer login được nhận diện qua nhiều store). Metafield trên Shop User là custom data gắn theo danh tính buyer đó. Shopify Functions là code chạy server-side tại các điểm logic (discount, checkout validation, delivery...).
**Chi tiết:**
- Partner gắn metafield lên Shop User nay có thể **đọc metafield đó trong lúc checkout thông qua Shopify Functions**.
- Effective **API version 2026-07** (đăng 13/6/2026), status "no action required".
**Vì sao đáng đọc:** Mở đường cho Joy Loyalty đưa dữ liệu buyer (ví dụ tier/điểm loyalty lưu dưới dạng metafield) vào discount/validation Function để tính reward ngay tại checkout mà không cần round-trip ra Admin API — nền tảng cho tiered discount theo hạng thành viên.

## [WhatsApp marketing consent qua Admin & Customer Account API](https://shopify.dev/changelog/whatsapp-marketing-consent-now-available) — (shopify.dev/changelog)
**Đây là gì:** API mới để đọc/ghi trạng thái đồng ý (consent) nhận marketing qua WhatsApp của khách, gắn vào số điện thoại mặc định của customer — bổ sung kênh WhatsApp bên cạnh email/SMS consent sẵn có.
**Chi tiết:**
- Mutation `customerWhatsAppMarketingConsentUpdate` cập nhật consent WhatsApp cho default phone number.
- Query field `whatsAppMarketingConsent` trong object `CustomerPhoneNumber` để đọc giá trị hiện tại.
- Có trên cả **Admin GraphQL API** và **Customer Account API**, effective **version 2026-07** (16/6/2026). Tag Action Required.
**Vì sao đáng đọc:** WhatsApp là kênh retention lớn ở nhiều thị trường. Joy Loyalty có thể tôn trọng/đồng bộ consent WhatsApp khi gửi reward reminder hay VIP notification, tránh gửi cho khách chưa opt-in (rủi ro compliance).

## [Metafields cần có definition mới truy cập được qua Customer Account API](https://shopify.dev/changelog/metafields-now-require-a-definition-to-be-accessed-through-the-customer-account-api) — (shopify.dev/changelog)
**Đây là gì:** Customer Account API là API buyer-facing (dùng ở trang tài khoản khách hàng). Metafield definition là schema khai báo trước cho một metafield (namespace/key/type/quyền truy cập).
**Chi tiết:** Để đọc được qua Customer Account API, metafield lưu trên app resource **bắt buộc phải có metafield definition với quyền "customer accounts"**. Metafield không có definition sẽ không expose ra buyer-facing API nữa.
**Vì sao đáng đọc:** Nếu Joy Loyalty hiển thị điểm/lịch sử reward ở trang tài khoản khách qua Customer Account API và dữ liệu lưu bằng metafield "trần" (không definition), cần tạo definition với customer-accounts permission, nếu không dữ liệu loyalty sẽ biến mất khỏi customer account UI.

## [Built for Shopify: Returns/Exchanges & Subscription apps phải dùng Customer Account API để auth](https://shopify.dev/changelog/built-for-shopify-requirements-for-returns-and-exchanges-and-subscription-apps) — (shopify.dev/changelog)
**Đây là gì:** Built for Shopify (BFS) là chứng nhận chất lượng app trong App Store. Changelog cập nhật yêu cầu auth cho nhóm app Returns/Exchanges và Subscription.
**Chi tiết:** Các app này **phải dùng Customer Account API để xác thực buyer trước 1/12/2026** mới giữ được trạng thái Built for Shopify.
**Vì sao đáng đọc:** Joy Loyalty tuy không phải subscription app, nhưng xu hướng rõ: Shopify đang chuẩn hóa buyer authentication về Customer Account API cho mọi app buyer-facing. Nếu app có bất kỳ surface xác thực khách hàng nào, nên chuẩn bị dịch chuyển theo hướng này để không rớt tiêu chuẩn BFS trong tương lai.
