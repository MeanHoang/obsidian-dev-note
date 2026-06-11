# 🛒 Shopify — 2026-06-11

> Tuần này thiên về DX & deadline: app audit chuyển hết vào Partner Dashboard, Storefront API 2026-07 thêm `view_key` cho cart mutations, headless checkout chuẩn hóa `sso=silent`, và preview giao diện customer accounts mới đóng **ngày mai 12/06**.

## ⭐ [App quality checks giờ quản lý trong Partner Dashboard](https://shopify.dev/changelog/app-quality-checks-now-managed-in-partner-dashboard) — (shopify.dev/changelog, 02/06/2026)
**Đây là gì:** App quality check (audit) là quy trình Shopify định kỳ rà soát các app đã publish trên App Store để đảm bảo đạt chuẩn chất lượng. Trước đây mọi feedback audit gửi qua email; giờ Shopify đưa toàn bộ vào Partner Dashboard, dùng chung trải nghiệm review từng ra mắt cho app submission.
**Chi tiết:**
- Feedback audit của app đã publish giờ hiển thị tại **App > Distribution** trong Partner Dashboard, trên status page riêng của app.
- Có **requirement-level tracking**: từng yêu cầu cần sửa được liệt kê và theo dõi riêng, kèm structured fix workflow thay vì một email tổng.
- Có **direct messaging** với review team ngay trong dashboard — update app, phản hồi reviewer ở cùng một chỗ.
- Action: nếu app đang có audit mở với issue chưa xử lý, chuyển từ theo dõi email sang kiểm tra Partner Dashboard để không lỡ deadline yêu cầu.
**Vì sao đáng đọc:** Joy Loyalty là app published nên audit định kỳ (và các đợt rà soát Built for Shopify) giờ phải theo dõi qua App > Distribution — nên check ngay xem app có audit nào đang mở để khỏi sót feedback nằm ngoài inbox.

## [Storefront API 2026-07: định danh cart line bằng `view_key` trong `cartLinesUpdate`/`cartLinesRemove`](https://shopify.dev/changelog/cart-line-mutations-accept-view-key) — (shopify.dev/changelog, 02/06/2026)
**Đây là gì:** Storefront GraphQL API là API để app/storefront thao tác giỏ hàng phía buyer. Từ version 2026-07, hai mutation cập nhật/xóa cart line chấp nhận `view_key` (khóa hiển thị của line) thay cho cart line `id`: `cartLinesUpdate` nhận `viewKey` trên mỗi `CartLineUpdateInput`, `cartLinesRemove` nhận list `viewKeys` — mutually exclusive với `id`/`lineIds`, code cũ dùng id vẫn chạy nguyên.
**Vì sao đáng đọc:** Nếu Joy thao tác cart từ theme extension/storefront (thêm/gỡ line item quà redeem, free gift), `view_key` cho cách target line ổn định hơn khi cart line bị merge/split mà không phải query lại id.

## [Headless checkout SSO chính thức document với `sso=silent`](https://shopify.dev/changelog/headless-checkout-sso-is-now-documented-with-ssosilent) — (shopify.dev/changelog, 08/06/2026)
**Đây là gì:** Khi storefront headless (Hydrogen/Customer Account API) đẩy buyer đã đăng nhập sang checkout, cần query param để giữ session (silent SSO). Shopify đổi chuẩn tài liệu từ `logged_in=true` sang `sso=silent` — chỉ là thay đổi terminology/docs, URL cũ dùng `logged_in=true` vẫn hoạt động, không breaking.
**Vì sao đáng đọc:** Merchant headless dùng Joy mà có flow build checkout URL kèm `logged_in=true` thì giữ nguyên vẫn chạy, nhưng code/docs mới nên viết theo `sso=silent` để khớp tài liệu chính thức về sau.

## [Deadline 12/06 (ngày mai): hết hạn feature preview giao diện Customer Accounts mới](https://shopify.dev/changelog/feature-preview-customer-account-improvements) — (shopify.dev/changelog, preview đến 12/06/2026)
**Đây là gì:** Shopify đang redesign trang customer accounts: layout single-column thống nhất trên mọi thiết bị, navigation đơn giản hóa, order action extension và order summary nổi bật hơn trên mobile, kèm mapping tương thích cho các extension target hiện có. Feature preview để dev test trước chỉ mở đến **12/06/2026**.
**Vì sao đáng đọc:** Nếu Joy có customer account UI extension (hiển thị điểm/reward trong trang tài khoản), hôm nay là ngày cuối để bật preview kiểm tra extension render đúng trên layout mới trước khi Shopify roll out cho merchant.
