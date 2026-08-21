# 🛒 Shopify — 2026-08-21

> Changelog shopify.dev hôm nay không có entry mới (entry gần nhất là 19/08). Bù lại, có một loạt deadline breaking change đang đến gần mà app loyalty phải chuẩn bị: `useBuyerJourneyIntercept` bị khai tử, offline access token bắt buộc hết hạn từ 01/01/2027, và Polaris web components thành mặc định cho checkout extension.

## ⭐ [Deprecating the useBuyerJourneyIntercept API on checkout UI extensions](https://shopify.dev/changelog/deprecating-the-usebuyerjourneyintercept-api-on-checkout-ui-extensions) — (shopify.dev/changelog, 02/07/2026)

**Đây là gì:** `useBuyerJourneyIntercept` là hook trong Checkout UI extension cho phép app **chặn buyer đi tiếp** trong luồng checkout (ví dụ: chặn khi chưa thoả điều kiện, hiện lỗi validate). Checkout UI extension = đoạn UI do app nhúng vào trang checkout của Shopify. Hook này nay bị deprecated.

**Chi tiết:**
- Hook `useBuyerJourneyIntercept` **và** capability `block_progress` đều bị phase out, bắt đầu từ API version **2026-07**.
- Extension hiện tại vẫn chạy trên API version hiện hành và các version cũ, nhưng API này "sẽ bị gỡ ở một version tương lai" — tức là action required, không phải chờ.
- Đường thay thế 1 — muốn **enforce business rule**: chuyển sang **cart and checkout validation Function**, chạy server-side nên áp dụng nhất quán trên mọi bề mặt checkout (không chỉ web checkout).
- Đường thay thế 2 — muốn **từ chối discount code**: dùng **discount Function API**, nay đã hỗ trợ sẵn việc reject discount code kèm message tuỳ chỉnh.
- Shopify có mở community discussion cho case không migrate sang Functions được.

**Vì sao đáng đọc:** Joy Loyalty gần như chắc chắn có logic kiểu "chỉ cho redeem điểm khi đủ tier / cart đủ điều kiện" hoặc "chặn cộng dồn discount code". Nếu logic đó nằm trong `useBuyerJourneyIntercept`, nó sẽ chết. Cần lên kế hoạch port sang cart-and-checkout-validation Function (và discount Function cho phần reject code) trước khi Shopify gỡ hẳn — đây là việc rewrite thật, không phải đổi tên hàm.

## ⭐ [Expiring offline access tokens required for all public apps as of January 1, 2027](https://shopify.dev/changelog/expiring-offline-access-tokens-required-for-all-public-apps-as-of-january-1-2027) — (shopify.dev/changelog, 20/05/2026)

**Đây là gì:** Offline access token là token app dùng để gọi Admin API **khi merchant không online** (cron job, webhook handler, batch sync). Trước đây token này không hết hạn. Từ 01/01/2027, mọi public app buộc phải dùng token có hạn + tự rotate.

**Chi tiết:**
- Yêu cầu này trước đó chỉ áp dụng cho public app **mới tạo từ 01/04/2026**; nay mở rộng cho **tất cả public app**, kể cả app tạo trước tháng 4/2026.
- Không migrate → app sẽ gặp **authentication error** sau mốc 01/01/2027.
- Lý do Shopify nêu: token không hết hạn nếu bị lộ thì "vẫn valid vô thời hạn"; token có hạn đóng cửa sổ đó trong **60 phút** và tự rotate.
- **Custom app và merchant-created app không bị ảnh hưởng.**
- Merchant **không cần cài lại app** — việc đổi token diễn ra trong code qua token exchange.

**Vì sao đáng đọc:** Joy Loyalty là public app và chạy rất nhiều tác vụ nền (đồng bộ điểm, xử lý webhook order, tính tier định kỳ) — toàn bộ đều dựa vào offline token. Việc token chỉ sống 60 phút nghĩa là layer lưu token trên Firebase/Firestore phải chuyển từ "lưu 1 token vĩnh viễn" sang "cache token + refresh khi hết hạn", và mọi Cloud Function gọi Admin API phải đi qua một helper lấy token thay vì đọc thẳng Firestore. Nên làm sớm, đừng để tháng 12/2026.

## [Shop User Metafields in Shopify Functions](https://shopify.dev/changelog/shop-user-metafields-in-shopify-functions) — (shopify.dev/changelog, 13/06/2026)

**Đây là gì:** Shop User là "cross-merchant buyer identity" của Shopify — danh tính người mua dùng chung nhiều store (gắn với Shop Pay / Shop app). Nay metafield gắn trên Shop User có thể đọc được **bên trong Shopify Functions** tại checkout, từ API version 2026-07.

**Vì sao đáng đọc:** Đây là cách sạch nhất để đưa dữ liệu loyalty (tier, số điểm, trạng thái member) vào discount Function mà không cần gọi API ra ngoài — Functions chạy sandbox không gọi network được, nên metafield là kênh dữ liệu duy nhất. Nếu Joy Loyalty muốn giảm giá tự động theo tier ngay tại checkout, đây là mảnh ghép cần đọc kỹ.

## [Polaris web components migration guides now available for Checkout and Customer Account UI extensions](https://shopify.dev/changelog/polaris-web-components-migration-guides-now-available-for-checkout-and-customer-account-ui-extensions) — (shopify.dev/changelog, 13/05/2026)

**Đây là gì:** Polaris là design system của Shopify. Bản "web components" là phiên bản viết bằng custom element chuẩn web thay vì component React. Shopify đã ra bộ guide migrate cho Checkout UI extension và Customer Account UI extension, gồm **hơn 60 trang migration theo từng component** (Button, Checkbox, TextField, Banner...). Polaris web components là **mặc định từ API version 2025-10**; guide cũng bao gồm hướng dẫn chuyển checkout metafields sang cart metafields.

**Vì sao đáng đọc:** Joy Loyalty dùng React vì Polaris — hướng migrate là từ React/JS extension API sang **Preact + Polaris web components**, tức là phần checkout/customer-account extension sẽ không còn viết theo kiểu React quen thuộc. Vì viết JS thuần (không TS), việc bỏ layer React ở extension thực ra làm code gọn hơn, nhưng phải đọc guide theo từng component thay vì đoán. Đáng ưu tiên vì extension ở API version cũ sẽ không update được nữa.

## [SubscriptionContractCalculation API now available in early access](https://shopify.dev/changelog/subscription-contract-calculation-api-now-available-in-early-access) — (shopify.dev/changelog, 27/07/2026)

**Đây là gì:** Object GraphQL Admin API mới, early access trên release candidate **2026-10**, thay thế workflow `SubscriptionDraft` cũ. Gộp "hơn một tá mutation stateful" thành 3 bước: **calculate → poll → commit**. Điểm mấu chốt: contract edit nay chạy qua **checkout engine thống nhất** của Shopify thay vì hệ thống subscription riêng, nhờ đó mở khoá bundle product và cart transformation function. Hai API cùng tồn tại trong giai đoạn chuyển tiếp.

**Vì sao đáng đọc:** Nếu Joy Loyalty có tính điểm/áp reward lên đơn subscription, việc contract đi qua checkout engine chung nghĩa là discount Function của app sẽ áp được lên subscription giống như đơn thường — trước đây đây là điểm mù cố hữu. Đáng theo dõi khi 2026-10 lên stable.

## [App Pricing: more plans, no-charge plan testing, and negative and fractional App Events](https://shopify.dev/changelog/app-pricing-more-plans-no-charge-plan-testing-and-negative-and-fractional-app-events) — (shopify.dev/changelog, 09/07/2026)

**Đây là gì:** Ba thay đổi về billing của app: (1) nâng giới hạn lên **8 public plan** (trước 4) và **15 private plan** (trước 10) mỗi app; (2) test không tính tiền thật — chọn plan sẵn có khi app review, subscription free trên development store, đánh dấu plan free cho partner test; (3) **App Events API** nay nhận **giá trị âm** (để điều chỉnh/hoàn lại usage đã report) và **số thập phân** như `1.5`.

**Vì sao đáng đọc:** App loyalty hay tính phí theo usage (số order có reward, số điểm phát ra). Việc App Events chấp nhận giá trị âm cho phép sửa sai khi report nhầm mà không phải refund thủ công; còn 8 public plan giúp Joy Loyalty tách gói theo quy mô store mà không phải dồn ép vào 4 bậc.
