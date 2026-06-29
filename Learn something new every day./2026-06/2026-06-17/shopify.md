# 🛒 Shopify — 2026-06-17

> Breaking change đã có hiệu lực (16/06): app-owned metafield giờ BẮT BUỘC có definition mới đọc được qua Customer Account API — app loyalty hiển thị balance/tier trên trang customer account phải kiểm tra ngay.

## ⭐ [Metafields now require a definition to be accessed through the Customer Account API](https://shopify.dev/changelog/metafields-now-require-a-definition-to-be-accessed-through-the-customer-account-api) — (shopify.dev/changelog, 16/06/2026)

**Đây là gì:** Customer Account API là API mà UI extension chạy bên trong trang tài khoản khách hàng (customer account) dùng để đọc/ghi dữ liệu. Metafield là trường dữ liệu tùy biến gắn vào resource (customer, order, shop...). "App-owned metafield" là metafield do app của bạn sở hữu (namespace riêng). Trước đây app có thể đọc metafield của chính mình qua Customer Account API kể cả khi metafield đó chưa có "definition" (bản khai báo schema chính thức). Thay đổi này chặn điều đó.

**Chi tiết:**
- Có hiệu lực NGAY từ 16/06/2026 (không có thời gian ân hạn) — app metafield **không có definition sẽ không trả về giá trị** (return null) khi query qua Customer Account API.
- Chỉ ảnh hưởng **app-owned metafields**. Metafield trên resource Customer và Order (loại thường) **không bị ảnh hưởng**.
- Để fix: tạo definition bằng mutation `metafieldDefinitionCreate`, bật quyền Customer Account API trên definition đó; với app-owned metafield thì khai báo declarative metafield trong file TOML của app.
- Yêu cầu hành động rõ ràng: mọi metafield mà app dùng cho customer account UI extension đều phải có definition.

**Vì sao đáng đọc:** Nếu Joy Loyalty có UI extension hiển thị điểm/hạng thành viên ngay trong trang customer account và đọc từ app-owned metafield chưa khai definition, dữ liệu sẽ im lặng trả về null từ hôm nay — cần audit toàn bộ metafield dùng trong extension và tạo definition + bật quyền.

## ⭐ [Shop User Metafields in Shopify Functions](https://shopify.dev/changelog/shop-user-metafields-in-shopify-functions) — (shopify.dev/changelog, 13/06/2026)

**Đây là gì:** Shopify Functions là code (JS/Rust) bạn deploy lên Shopify để chạy logic tùy biến tại checkout (discount, shipping, payment...) ngay trong hạ tầng Shopify, không qua server riêng. "Shop User" là danh tính người mua xuyên-merchant của Shopify (cross-merchant buyer identity) — cùng một người mua được nhận diện qua nhiều cửa hàng. Metafield gắn vào Shop User là dữ liệu tùy biến theo người mua đó.

**Chi tiết:**
- Cho phép đọc metafield của Shop User **trong lúc checkout** thông qua Shopify Functions.
- Áp dụng từ API version **2026-07**.
- Mục đích: cá nhân hóa trải nghiệm checkout dựa trên dữ liệu gắn theo buyer identity (vd áp logic riêng cho từng nhóm người mua).
- Changelog dẫn tới "Shop User metafields guide" trong docs để biết chi tiết cách truy cập; entry gắn tag "New", chưa yêu cầu hành động bắt buộc.

**Vì sao đáng đọc:** Mở hướng để Joy Loyalty áp logic loyalty tại checkout (vd discount theo hạng thành viên) dựa trên metafield gắn theo buyer identity, thay vì chỉ dựa vào customer của một store — phù hợp khi muốn reward đi theo người mua.

## [New appSubscriptionCancel mutation in the Partner API](https://shopify.dev/changelog/new-appsubscriptioncancel-mutation-in-the-partner-api) — (shopify.dev/changelog, 16/06/2026)

**Đây là gì:** Partner API là API ở cấp Partner account (không phải cấp store) để quản lý app, billing, payout... `appSubscriptionCancel` là mutation hủy gói subscription (gói trả phí định kỳ) mà merchant đăng ký cho app của bạn. Trước đây hủy thường làm qua Admin API ở phía store; nay có bản dùng được từ Partner API cho public app.

**Chi tiết:**
- Cho phép Partner hủy subscription của **public app mà mình sở hữu**, từ Partner API version **2026-07**.
- Các lựa chọn: hủy ngay lập tức; hủy hoãn đến cuối chu kỳ billing hiện tại; xin prorated credit (hoàn tỷ lệ phần chưa dùng) khi áp dụng được; tùy chọn bỏ qua usage charge cuối với gói tính theo usage.
- Chỉ Partner API client có quyền **"View financials"** trong Partner Dashboard mới gọi được.

**Vì sao đáng đọc:** Joy Loyalty là public app trả phí — mutation này cho phép tự động hóa quy trình hủy/hoàn tiền ở cấp Partner (vd offboarding, churn handling) với kiểm soát prorate, giảm vé support hoàn tiền.

## [Customer tax settings now available in Admin API](https://shopify.dev/changelog/customer-tax-settings-now-available-in-admin-api) — (shopify.dev/changelog, 24/04/2026)

**Đây là gì:** Admin GraphQL API là API chính bạn dùng để đọc/ghi dữ liệu store. `taxSettings` là trường mới trên object `Customer`, cho phép đọc tax ID (vd số VAT) mà khách nhập và được xác thực lúc checkout.

**Chi tiết:**
- Trường `taxSettings` trên `Customer` thành public từ API version **2026-07**.
- Cần access scope `read_customers` HOẶC `read_taxes`.
- Query: `{ customer(id: "gid://shopify/Customer/...") { taxSettings { taxId } } }`.
- `taxId` trả về string, hoặc null nếu khách chưa cung cấp. Sub-field `taxIdValidation` (trạng thái xác thực) **không** có trong public API.
- Là thay đổi **read-only**; app cần có protected customer data access đã được duyệt.

**Vì sao đáng đọc:** Nếu Joy Loyalty phân khúc khách B2B/VAT để áp tier hoặc reward riêng, giờ đọc được tax ID trực tiếp từ Customer thay vì suy ra từ order — lưu ý cần protected customer data access.

## [Shopify Scripts will be deprecated on June 30, 2026](https://shopify.dev/changelog/shopify-scripts-will-be-deprecated-on-june-30-2026) — (shopify.dev/changelog, 09/04/2026)

**Đây là gì:** Shopify Scripts là hệ thống script (Ruby) cũ chạy logic discount/shipping/payment tại checkout, chỉ dành cho Plus. Shopify đang khai tử để thay bằng Shopify Functions (JS/Rust). Đây là nhắc deadline vì mốc cuối đã rất gần.

**Chi tiết:**
- **15/04/2026** (đã qua): không còn tạo/publish Script mới.
- **30/06/2026** (sắp tới): toàn bộ Shopify Scripts **ngừng chạy hoàn toàn**.
- Đường di trú: chuyển sang Shopify Functions (đã hỗ trợ discount, shipping, payment); dùng "Shopify Scripts customizations report" để xem customization nào chuyển được sang Functions/public app.

**Vì sao đáng đọc:** Nếu bất kỳ reward/discount nào của Joy Loyalty (hoặc merchant dùng Joy) còn dựa vào logic Scripts cũ ở checkout, nó sẽ chết sau 30/06 — cần đảm bảo discount engine đã chạy bằng Functions trước hạn.
