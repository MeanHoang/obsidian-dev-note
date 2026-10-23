# 00 – Loyalty trong mua sắm qua AI

> 📖 = trích nguồn chính thức đã mở. 💭 = nhận định AI. ⚠️ = nguồn phụ / chưa kiểm.
> Ngày nghiên cứu: 2026-10-23. Đi ra từ [[Shopify - Hướng đi và mục tiêu 2026]] và [[9 - App AR thử sản phẩm cho Shopify/07 - Shopify và thế giới đang đi về đâu|App AR – 07]].

**Kết luận trước:** 💭 Khi khách hỏi và mua trong ChatGPT, Gemini, Copilot, chương trình loyalty của shop **chỉ hiện được nếu nằm ở dạng dữ liệu chuẩn**. Hôm nay AI phải đọc trang chính sách bằng chữ rồi tự đoán (như ảnh dưới, AI còn phải viết "Cần hỏi cửa hàng…"). 📖 Đã có 3 chuẩn để đưa loyalty vào AI và tìm kiếm: **UCP loyalty** (`dev.ucp.common.loyalty`), **schema.org `MemberProgram`** (Google Search), **thuộc tính `loyalty_program`** (Google Merchant Center). Ý tưởng: **lấy dữ liệu loyalty sẵn có (cách tích điểm, hạng VIP, quyền lợi) và tự xuất ra cả 3 chuẩn**, để AI hiện đúng, đủ, theo từng khách. Câu hỏi sống còn chưa trả lời: ⚠️ app bên thứ ba có được cắm vào phần loyalty của UCP trên Shopify không.

---

## 1. Ảnh mẫu: AI đang đọc loyalty kiểu gì

![[AI trả lời chính sách tích điểm - Sữa Đại Việt.png]]

Ảnh anh gửi (2026-10-23). ⚠️ Chưa rõ là AI nào.

| AI hiện gì | Nhận xét 💭 |
|---|---|
| Tên shop + "Có chính sách tích điểm tại Hà Nội" | AI tóm tắt từ trang web, không phải dữ liệu chuẩn |
| "Mỗi 100.000đ mua hàng được 1 điểm, tương đương 1.000đ dùng cho đơn sau" | Đúng thứ chuẩn `MemberProgram` có trường riêng (`membershipPointsEarned`) |
| "Hỗ trợ giao hàng miễn phí trong nội thành Hà Nội" | Quyền lợi thành viên, chuẩn có chỗ cho "member shipping" |
| "Cần hỏi cửa hàng xem đơn sữa chua có được áp dụng và có gói đặt định kỳ không" | **AI không chắc** vì không có dữ liệu theo từng sản phẩm |
| Nút "Xem chính sách tích điểm ↗" + chip nguồn "Sữa Đại Việt" | Khách phải rời AI để đọc tiếp |

💭 Ba thứ ảnh này **thiếu**: (1) điểm cho **đúng sản phẩm** đang xem, (2) thông tin **của riêng khách** (hạng, số điểm đang có), (3) **giá thành viên** ngay trên giá sản phẩm.

## 2. Ba chuẩn đã có

### 2.1. UCP loyalty – cho AI mua hàng (ChatGPT, Gemini, Copilot…)

📖 [ucp.dev – Loyalty Extension, bản 2026-04-08](http://ucp.dev/2026-04-08/specification/loyalty/):
- Tên: `dev.ucp.common.loyalty`. Gắn vào tìm sản phẩm (`catalog.search`, `catalog.lookup`), giỏ (`cart`), thanh toán (`checkout`).
- Mục đích: "designed to facilitate high-fidelity loyalty experiences" để thành viên dùng quyền lợi ở cả 3 bước.
- Dữ liệu:

| Phần | Trường | Ghi chú |
|---|---|---|
| Thành viên (membership) | `id`, `name` (tên chương trình), `display_id` (mã che, vd `****5678`), `tiers`, `rewards`, `provisional` | `display_id` chỉ trả khi đã xác minh |
| Hạng (tier) | `id`, `name`, `benefits` | |
| Quyền lợi (benefit) | `id`, `description` (chữ hiện sẵn) | Quyền lợi về giá đi vào giá và phần giảm giá |
| Phần thưởng (reward) | `currency` (vd "Points", `PTS`), `earning_forecast` | |
| Dự báo điểm nhận | `amount` ("Total rewards to be earned if the transaction completes"), `breakdown[]` (từng luật: `amount`, `description`, `benefit_id`) | |

- Giá thành viên: nằm trong `price` / `list_price` khi tìm sản phẩm; trong `totals` (`items_discount`) và `discounts.applied[]` ở giỏ/thanh toán.
- Nhận ra khách: AI gửi "claims" trong `context.eligibility` ("claims, not proof"), hoặc shop tự nhận ra khách đã đăng nhập.
- Không xác minh được → lỗi `eligibility_invalid`, AI tiếp tục mà không có quyền lợi.
- **Đổi điểm: chưa có.** "Redeemable balances and stored value are modeled by the negotiated payment instrument or a future redemption capability."

📖 [Google, 2026-03-19](https://blog.google/products-and-platforms/products/shopping/ucp-updates/): khách trên nền tảng có UCP "receive the same loyalty or member benefits" như khi đăng nhập trên site của shop, ví dụ giá thành viên, miễn phí giao hàng. Có thêm Identity Linking để nối tài khoản khách.

### 2.2. schema.org `MemberProgram` – cho Google Search

📖 [Google Search Central](https://developers.google.com/search/docs/appearance/structured-data/loyalty-program):
- Google hiện quyền lợi loyalty "with your products and knowledge panels in Search results".
- Nước: Úc, Brazil, Canada, Pháp, Đức, Mexico, Anh, Mỹ. **Chưa có Việt Nam.**
- `MemberProgram` bắt buộc: `name`, `description`, `hasTiers`; nên có `url` (trang đăng ký).
- `MemberProgramTier` bắt buộc: `name`, `hasTierBenefit`; nên có `hasTierRequirement`, `membershipPointsEarned` ("number of loyalty points earned ... per currency unit spent"), `url`.
- `hasTierBenefit`: `TierBenefitLoyaltyPoints` (tích điểm) hoặc `TierBenefitLoyaltyPrice` (giá riêng thành viên).
- Theo từng sản phẩm: `UnitPriceSpecification` trong `Offer`, dùng `validForMemberTier` và `membershipPointsEarned`.
- Gắn vào `Organization` / `OnlineStore` bằng `hasMemberProgram`.

### 2.3. `loyalty_program` – cho Google Merchant Center (Shopping)

⚠️ Qua kết quả tìm kiếm, chưa mở trang gốc ([Google Merchant help](https://support.google.com/merchants/answer/12922446)):
- Thuộc tính `loyalty_program` có giá thành viên, điểm theo hạng, nhãn giao hàng thành viên.
- Giá thành viên phải nằm trong thuộc tính này, không được đặt vào `price` / `sale_price`.
- Có cho shop ở Mỹ, Úc, Nhật.

## 3. Hiển thị loyalty thế nào: 5 lớp

💭 Mockup chữ, theo ví dụ khách hỏi "tìm sữa chua cho bé" ở shop Sữa Đại Việt (dùng lại số trong ảnh):

| Lớp | Khi nào | AI hiện gì | Chuẩn chở dữ liệu |
|---|---|---|---|
| 1. Chương trình | Ai cũng thấy, chưa đăng nhập | "Thành viên: 100.000đ = 1 điểm, 1 điểm = 1.000đ. Hạng Vàng miễn phí giao nội thành. [Tham gia]" | `MemberProgram` (Search), UCP catalog |
| 2. Theo sản phẩm | Khi xem 1 sản phẩm | "Sữa chua Hy Lạp 6 hộp – 89.000đ · **Giá thành viên 80.000đ** · Nhận **0 điểm** (dưới 100.000đ)" | `UnitPriceSpecification` + `validForMemberTier`, `loyalty_program`, UCP `price` |
| 3. Của riêng khách | Khách đã nối tài khoản | "Bạn hạng **Vàng** (`****5678`) · có **42 điểm** (= 42.000đ)" | UCP `membership`, `tiers`, `display_id` · ⚠️ số dư điểm chưa có trường riêng |
| 4. Giỏ / thanh toán | Lúc chốt đơn | "Đơn 320.000đ → nhận **3 điểm** (1 điểm / 100.000đ) · giảm giá thành viên −20.000đ · miễn phí giao" | UCP `earning_forecast.breakdown`, `totals`, `discounts.applied[]` |
| 5. Đổi điểm | Muốn dùng điểm | "Dùng 42 điểm giảm 42.000đ?" | ❌ UCP chưa có ("future redemption capability") |

💭 Lớp 1 giải quyết đúng chỗ AI trong ảnh còn đoán. Lớp 2–4 là thứ ảnh chưa có. Lớp 5 phải chờ chuẩn.

## 4. App làm gì

💭 Một nguồn dữ liệu loyalty (cách tích điểm, hạng VIP, quyền lợi, giá thành viên) → tự xuất ra mọi nơi AI và tìm kiếm đọc:

| Xuất ra | Cách | Làm được hôm nay? |
|---|---|---|
| JSON-LD `MemberProgram` trên trang shop | App embed / theme app extension chèn vào trang | 📖 Chuẩn có, Google đọc; chỉ hiện ở 8 nước |
| Giá thành viên + điểm theo sản phẩm | JSON-LD `Offer` + `UnitPriceSpecification` | 📖 Chuẩn có |
| Merchant Center `loyalty_program` | Qua feed | ⚠️ Chưa kiểm app Google & YouTube của Shopify có đồng bộ không |
| UCP loyalty khi AI tìm / giỏ / thanh toán | Shop trả về `loyalty` trong phản hồi UCP | ⚠️ **Chưa biết app có được cắm vào UCP của Shopify không** |
| Trang chính sách viết rõ, đủ | Tự sinh từ cài đặt loyalty | 💭 Làm được; giúp cả AI đọc chữ như ảnh |

## 5. Liên quan tới Joy

📖 Đã kiểm code Joy (`~/WebstormProjects/joy`, `master` `a5f95999da`, 2026-09-30):
- Có Sidekick cho merchant (`extensions/sidekick-tools/`, changelog 1.198, 06/2026).
- Có thiết kế `docs/design/features/shopify-agents-integration.md`: kéo Catalog MCP vào widget Joy. **Chưa có code** (`shopifyAgentService.js` không tồn tại).
- Không thấy `dev.ucp`, `MemberProgram`, `loyalty_program` trong code.

💭 Ý tưởng này có thể là **tính năng của Joy** hơn là app riêng. Anh quyết.

## 6. Đã gọi thử UCP của shop Shopify thật (2026-10-23)

📖 `GET https://www.allbirds.com/.well-known/ucp` → UCP bản `2026-08-25`. Shop khai báo các capability:
`checkout`, `fulfillment`, `discount`, `cart`, `buyer_consent`, `order`, `catalog.search`, `catalog.lookup`, `dev.shopify.catalog`, `location.search`, `location.lookup`, `identity_linking`, `permalink`.

- **Không có `dev.ucp.common.loyalty`.** Cùng kết quả với `www.luluandgeorgia.com` (`tools/list` giống hệt).
- Chữ "loyalty" chỉ xuất hiện ở trường `eligibility`: "Buyer claims about eligible benefits such as loyalty membership, payment perks, and similar."
- Đã có `identity_linking` và `discount` → nền để nối tài khoản khách và áp giảm giá thành viên đã có.

💭 Nghĩa là: chuẩn có phần loyalty, nhưng **Shopify chưa bật cho store** (ít nhất 2 store này). Khoảng trống đang mở; chưa biết Shopify sẽ tự làm hay mở cho app.

### 6.1. Trường `eligibility`: ai khai, khai theo cấu trúc gì

📖 Định nghĩa trong `tools/list` của allbirds.com:
```json
"eligibility": {"type":"array",
  "description":"Buyer claims about eligible benefits such as loyalty membership, payment perks, and similar.",
  "items":{"type":"string",
    "description":"Reverse-domain identifier. Must contain at least two dot-separated segments (e.g., 'com.example.loyalty')."}}
```
📖 Đặc tả loyalty (ucp.dev 2026-04-08):
- **Nền tảng AI gửi, không phải khách gõ:** "Platforms MAY send buyer loyalty membership claims via `context.eligibility`".
- Chỉ là **lời khai**: "MUST treat all `context.eligibility` values ... as buyer claims rather than proof."
- Tên theo kiểu tên miền đảo ngược, ví dụ `com.example.loyalty.store_card`, `com.example.retail_club`.
- Shop xác minh được → `provisional: false`; nhận nhưng chưa xác minh → `provisional: true`; không xác minh được → `message` báo lỗi, AI bỏ lời khai và mua tiếp không có quyền lợi.
- Khách đã đăng nhập (vd qua `identity_linking`) → shop tự điền loyalty, không cần lời khai.

💭 Lời khai **chỉ là 1 cái tên chương trình**, không chở điểm, hạng hay mã thành viên. Toàn bộ chi tiết loyalty do **shop trả về** trong `loyalty` (mục 2.1). → Ai giữ dữ liệu loyalty của shop (app loyalty) là bên trả lời được.

## 7. Việc cần kiểm tiếp

1. ⚠️ **Sống còn:** Shopify chưa bật `dev.ucp.common.loyalty` cho store (mục 6). Còn phải tìm: shopify.dev / changelog có kế hoạch mở cho app không (vd qua Shopify Functions, metafield, Customer Accounts).
2. ⚠️ Đối thủ (Smile.io, Yotpo, Rivo, BON) đã xuất `MemberProgram` / UCP loyalty chưa.
3. ⚠️ Google đã hiện loyalty từ `MemberProgram` ở đâu, ảnh thật.
4. ⚠️ Ảnh mẫu là của AI nào, AI đó lấy dữ liệu từ đâu.
5. ⚠️ Số dư điểm của khách (lớp 3) đặt ở đâu trong UCP: chưa thấy trường riêng.
