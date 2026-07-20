# 🛒 Shopify — 2026-06-15

> Tin nóng: GraphQL Admin API 2026-07 có `values` mới giúp đọc/ghi metaobject 1 phát không cần (de)serialize — cực hợp cho config reward/tier của loyalty app.

## ⭐ [Streamlined Metaobject API](https://shopify.dev/changelog/streamlined-metaobject-api) — (shopify.dev/changelog)
**Đây là gì:** Metaobject là "bản ghi cấu trúc tùy biến" trong Shopify (vd: định nghĩa 1 reward tier, 1 chương trình điểm). Trước đây query/ghi phải lặp qua từng `field` rồi tự parse JSON từng cái. Bản cập nhật thêm property `values` để làm việc với toàn bộ field trong 1 lần gọi.
**Chi tiết:**
- Đăng 11/06/2026, áp dụng từ **API version 2026-07** (Admin GraphQL API).
- Query: dùng `values` để lấy hết field của metaobject 1 lần, trả về object JSON-compatible dùng được ngay, **không cần tự deserialize**.
- Create/Update: truyền 1 object JSON-style khớp với field keys, API tự lo serialize.
- Lưu ý hành vi: khi upsert bằng `values`, field nào **bỏ trống sẽ bị clear** (khác với patch-style mutation cũ giữ nguyên field không nhắc tới).
- **Không breaking:** `field`/`fields` cũ vẫn còn, dùng song song được — đây là tính năng thêm, không bắt buộc migrate.
**Vì sao đáng đọc:** Joy Loyalty hay lưu cấu hình reward/tier/campaign dưới dạng metaobject; `values` cắt bớt code parse JSON lặp đi lặp lại, gọn hơn nhiều khi đọc/ghi config bằng JS thuần.

## [Next Generation Events giờ có ở developer preview](https://shopify.dev/changelog/next-generation-events-now-available-in-developer-preview) — (shopify.dev/changelog)
**Đây là gì:** Một thế hệ "sự kiện realtime" mới thay cho webhook truyền thống. Thay vì nhận payload cố định mỗi khi entity đổi, bạn tự định nghĩa được trigger và payload muốn nhận.
**Chi tiết:**
- Đăng 19/05/2026, đang ở **developer preview** trên API version `unstable` (API có thể đổi), hiện hỗ trợ topic **Product và Customer**.
- Field-level precision: chỉ fire khi đúng field cụ thể thay đổi, bớt delivery thừa.
- Custom payload: bạn tự khai payload bằng 1 query Admin GraphQL chuẩn, không bị schema cố định.
- Mỗi delivery có `fields_changed` (cho biết field nào trigger) và `query_filter` (lọc theo state hiện tại của entity).
- Subscription khai trong `shopify.app.toml` (config-as-code, version control được).
**Vì sao đáng đọc:** Webhook là xương sống của loyalty (lắng nghe order/customer để cộng điểm); Next Gen Events giúp lọc đúng field cần và tự tùy biến payload — giảm xử lý thừa và call ngược lại API để lấy data thiếu.

## [Local currency gift cards trong GraphQL Admin API](https://shopify.dev/changelog/gift-card-local-currency-support) — (shopify.dev/changelog)
**Đây là gì:** Gift card phát hành theo 1 loại tiền tệ cụ thể, có quyền kiểm soát việc khách đổi (redeem) gift card đó qua tiền tệ khác hay không.
**Chi tiết:**
- Có từ **API version 2026-07**.
- Merchant tạo được gift card product gắn currency cụ thể và kiểm soát cross-currency redemption.
- Field `crossCurrencyRedeemable` quyết định strategy: `false` → `NONE`; `true` không có issuance currency → `MARKET_FX`; `true` có issuance currency → `SPOT_FX`.
- **Breaking khi tạo gift card:** thay field deprecated `initialValue` bằng field mới `initialAmount`.
**Vì sao đáng đọc:** Nếu Joy Loyalty đổi điểm ra gift card (reward), việc đổi `initialValue` → `initialAmount` và xử lý đa tiền tệ là thay đổi phải cập nhật trong mutation tạo gift card.

## [GiftCardCashOutTransaction giờ resolve được từ GiftCardTransaction](https://shopify.dev/changelog/giftcardcashouttransaction-now-resolvable-from-giftcardtransaction) — (shopify.dev/changelog)
**Đây là gì:** Một type GraphQL mới đại diện cho giao dịch rút tiền mặt từ số dư gift card qua POS, tách riêng khỏi các giao dịch debit thông thường.
**Chi tiết:**
- Có từ **API version 2026-07**.
- `GiftCardCashOutTransaction` giờ là 1 variant của interface `GiftCardTransaction`, lấy ra bằng `__typename` (inline fragment) khi query transaction.
- Migration note: ở 2026-04 trở về trước, các giao dịch này bị gộp là `GiftCardDebitTransaction`.
**Vì sao đáng đọc:** Nếu loyalty đối soát lịch sử gift card (reward đã đổi), nay phân biệt được cash-out vs debit để báo cáo/tích điểm chính xác hơn.

## [App Home dựng bằng UI extension](https://shopify.dev/changelog/build-app-home-as-a-ui-extension) — (shopify.dev/changelog)
**Đây là gì:** Cách dựng trang chủ (landing page) của app trực tiếp bằng admin UI extension (nền Preact) thay vì host 1 web server riêng nhúng qua iframe.
**Chi tiết:**
- Đăng 27/05/2026, có từ **API version 2026-07**.
- Dùng target `admin.app.home.render`; App Home được bundle như UI extension, dùng chung Polaris web components, không cần hạ tầng server riêng.
- Hiện dành cho **custom-distribution apps**; app công khai trên App Store vẫn nên dùng giải pháp iframe.
- Scaffold: `shopify app init` (app extension-only) hoặc `shopify app generate extension`.
**Vì sao đáng đọc:** Hướng "ít server hơn" hợp với stack Firebase/GCP; theo dõi để biết khi nào public app (như Joy Loyalty) được hỗ trợ và có thể bớt phần admin UI tự host.

## [Expiring offline access token bắt buộc cho mọi public app từ 01/01/2027](https://shopify.dev/changelog/expiring-offline-access-tokens-required-for-all-public-apps-as-of-january-1-2027) — (shopify.dev/changelog)
**Đây là gì:** Offline access token (token app dùng để gọi Admin API ngầm) sẽ chuyển từ "không hết hạn" sang "hết hạn và tự refresh". Đây là **breaking change** có deadline.
**Chi tiết:**
- Đăng 20/05/2026. **Deadline 01/01/2027** — sau đó public app dùng token không hết hạn sẽ bị lỗi auth.
- Áp dụng cho **mọi public app**, kể cả app tạo trước 01/04/2026.
- Token mới hết hạn trong 60 phút và refresh tự động; phải migrate từ non-expiring sang expiring (Shopify có migration guide).
- Merchant **không cần cài lại app** — app tự exchange token qua code.
- Lý do: token không hết hạn nếu bị lộ sẽ valid mãi; token hết hạn thu hẹp cửa sổ rủi ro còn 60 phút.
**Vì sao đáng đọc:** Joy Loyalty là public app gọi Admin API ngầm (webhook xử lý, cộng điểm) — phải đưa logic refresh token vào trước 01/01/2027 nếu chưa có, nếu không sẽ chết auth.

## [Shopify CLI 4.0: SemVer, auto-update, gỡ flag/command deprecated](https://shopify.dev/changelog/shopify-cli-40-semver-auto-updates-removing-deprecated-flags-and-commands) — (shopify.dev/changelog)
**Đây là gì:** Bản major mới của Shopify CLI (công cụ dòng lệnh để dev/deploy app & extension), chuẩn hóa versioning và dọn các flag/command cũ.
**Chi tiết:**
- Đăng 21/05/2026. Theo SemVer: minor = feature, patch = bugfix, major = breaking.
- Auto-upgrade qua package manager từ 4.0 (bỏ qua CI, bản cài project-local và bản major); tắt bằng `shopify config autoupgrade off`.
- **Breaking:** gỡ flag `--force` ở `app deploy`/`app release` (thay bằng `--allow-updates` và `--allow-deletes`).
- Gỡ 5 command/flag deprecated: `shopify webhook trigger`, `shopify theme serve`, `shopify app generate schema`, `--shared-secret`, và `shopify app generate extension --type`.
**Vì sao đáng đọc:** Script CI/CD deploy extension của Joy Loyalty cần kiểm tra ngay nếu còn dùng `--force` hay các command cũ, kẻo pipeline gãy khi CLI lên 4.0.
