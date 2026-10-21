---
tags: [shopify, tax, joy]
created: 2026-10-20
source: bug ghn-oakridge đơn #37314 (ticket JOY-261019-vaNfv5)
---

# Thuế trên Shopify và cách Joy xử lý

> **Một câu:** Shopify có hai kiểu shop — giá **đã gồm thuế** và giá **chưa gồm thuế** — và mỗi đơn hàng báo kiểu của nó qua field `taxes_included`. Joy tính điểm từ giá sản phẩm, nhưng phần trừ / cộng thuế **không phải lúc nào cũng xét field này**, nên có chỗ tính sai.

---

## 1. 🧾 Shopify tính thuế thế nào

### 1.1 Hai kiểu shop

Setting: **Admin › Settings › Taxes and duties › "Include sales tax in product price and shipping rate"** (có chỗ gọi là "All prices include tax"). Áp dụng cho cả giá sản phẩm lẫn phí ship.

| | Giá **chưa gồm thuế** (tax-exclusive) | Giá **đã gồm thuế** (tax-inclusive) |
|---|---|---|
| Nhãn trên sản phẩm | $100 | $110 |
| Lúc thanh toán | cộng thêm thuế → trả $113 (HST 13%) | không cộng thêm → trả $110 |
| Thuế nằm ở đâu | **bên ngoài** giá, cộng thêm | **bên trong** giá, tách ra bằng công thức `thuế = giá × rate / (1 + rate)` → 110 × 0.1 / 1.1 = 10 |
| Nước thường dùng | Mỹ, **Canada** | Anh, Úc, New Zealand, EU, Mexico, Israel, Na Uy, Thuỵ Sĩ, Singapore, Nam Phi, Nhật |
| `taxes_included` trên đơn | `false` | `true` |

Dù kiểu nào, Shopify **vẫn ghi dòng thuế** (tax line) trên đơn. Shop giá gồm thuế cũng có dòng "GST 10.00" — chỉ là số đó đã nằm sẵn trong $110.

Nguồn: https://help.shopify.com/en/manual/taxes/include-exclude-taxes · https://help.shopify.com/en/manual/international/tax-inclusive

### 1.2 Một shop có thể ra đơn của cả hai kiểu

Shopify Markets có **"Dynamic tax display"** (Market › Taxes and duties › Tax display): khách nước giá-gồm-thuế thấy giá đã gồm thuế, khách nước khác thấy giá chưa gồm thuế. Ví dụ shop gốc thuế 10%, sản phẩm $100: khách California thấy $90.91 (thuế cộng lúc thanh toán), khách Anh (VAT 20%) thấy $109.09.

→ Vì vậy **phải đọc `taxes_included` theo từng đơn**, không suy từ nước của shop.

Nguồn: https://help.shopify.com/en/manual/international/pricing/dynamic-tax-inclusive-pricing

### 1.3 Các field thuế trên đơn (webhook REST)

| Field | Nghĩa | Có chứa thuế không |
|---|---|---|
| `taxes_included` | giá trên đơn đã gồm thuế chưa | — |
| `line_items[].price` | giá 1 sản phẩm, **trước giảm giá** | có, nếu `taxes_included = true` |
| `line_items[].discount_allocations` | giảm giá chia cho dòng sản phẩm | — |
| `line_items[].tax_lines[]` | các dòng thuế của sản phẩm: `title` (tên thuế), `rate`, `price` (tiền thuế, **sau giảm giá**) | là chính tiền thuế |
| `shipping_lines[].tax_lines[]` | thuế của phí ship | là tiền thuế |
| `subtotal_price` | tổng tiền hàng sau giảm giá, trước ship | có, nếu `taxes_included = true` (theo docs GraphQL `subtotalPriceSet`; docs REST ghi "before taxes" — hai trang mâu thuẫn) |
| `current_subtotal_price` | như trên nhưng đã trừ hàng trả lại / hoàn tiền | như trên |
| `total_tax` / `current_total_tax` | tổng tiền thuế (current = trừ phần đã hoàn) | là tiền thuế |
| `total_price` | khách trả tất cả: hàng + ship + thuế + tip | luôn đã có thuế |
| `tax_exempt` | khách được miễn thuế | — |
| `source_name` | `web`, `pos`, … | — |

GraphQL tương ứng: `taxesIncluded`, `subtotalPriceSet`, `currentTotalTaxSet`, `taxLines`, `LineItem.taxLines`, `LineItem.taxable`.

Nguồn: https://shopify.dev/docs/api/admin-rest/latest/resources/order · https://shopify.dev/docs/api/admin-graphql/latest/objects/Order · https://shopify.dev/docs/api/admin-graphql/latest/objects/LineItem

### 1.4 Tên dòng thuế (`tax_lines[].title`)

**Canada** (nguồn: https://help.shopify.com/en/manual/taxes/canada/canada-tax-reference):
- Tỉnh dùng **HST** → **một** dòng HST: Ontario 13%, Nova Scotia 14%, New Brunswick / Newfoundland / PEI 15%.
- Tỉnh dùng GST + thuế tỉnh → **hai** dòng: GST 5% + PST (BC 7%, Saskatchewan 6%) / RST (Manitoba 7%) / QST (Quebec 9.975%).
- Alberta và các vùng lãnh thổ → chỉ GST 5%.
- Hàng thuế suất 0% → vẫn có dòng thuế 0%. Hàng miễn thuế → không có dòng.

**Mỹ:** thuế tính theo bang nơi giao hàng (trừ vài bang tính theo nơi bán); phí ship có bị đánh thuế hay không tuỳ bang. Ví dụ trong docs dùng tên "State Tax". Nguồn: https://help.shopify.com/en/manual/taxes/us/us-tax-reference

Chưa xác nhận: tên thuế có bị dịch theo ngôn ngữ / merchant đổi được không. Docs chỉ ghi "The name of the tax". → So khớp theo tên là điểm yếu.

### 1.5 Các trường hợp đặc biệt
- **Giảm giá:** thuế tính **sau** giảm giá (`tax_lines[].price` là sau giảm giá), còn `line_items[].price` là trước giảm giá.
- **Khách miễn thuế:** trong shop giá-gồm-thuế, khách miễn thuế **vẫn trả nguyên giá niêm yết**. Miễn thuế của khách luôn thắng tax override. Nguồn: https://help.shopify.com/en/manual/taxes/tax-overrides
- **Tax override:** đặt thuế suất khác cho một collection (chỉ sản phẩm thêm tay) hoặc cho phí ship.
- **POS:** thuế lấy theo địa điểm cửa hàng gắn với máy; nhân viên chỉnh được thuế ngay trong giỏ. Nguồn: https://help.shopify.com/en/manual/taxes/set-adjust-pos-taxes
- **Hoàn tiền:** `refund_line_items[]` có `subtotal` và `total_tax` riêng. Chưa xác nhận `subtotal` có gồm thuế khi `taxes_included = true` không. Nguồn: https://shopify.dev/docs/api/admin-rest/latest/resources/refund

### 1.6 Ví dụ số (không giảm giá, không ship)

| Field | Ontario, giá chưa gồm thuế (HST 13%, hàng $100) | Úc, giá đã gồm thuế (GST 10%, hàng $110) |
|---|---|---|
| `taxes_included` | `false` | `true` |
| `line_items[].price` | 100.00 | 110.00 |
| `subtotal_price` | 100.00 | 110.00 |
| `tax_lines[].price` | 13.00 (title HST) | 10.00 (title GST) |
| `total_tax` | 13.00 | 10.00 |
| `total_price` | 113.00 | 110.00 |
| **Tiền hàng không thuế** | **100 = subtotal, giữ nguyên** | **100 = 110 − 10** |

Ví dụ trên dựng từ định nghĩa field + công thức trong help center, chưa đối chiếu payload thật.

---

## 2. 🎁 Joy xử lý thuế thế nào (code master, 2026-10-20)

### 2.1 Ba setting thuế trong program Place an order

Popup **"Reward points for additional fee"** của program Place an order (chỉ bật được khi earn theo số tiền chi):

| Ô trên admin | Field lưu | Ý nghĩa theo chữ trên UI |
|---|---|---|
| Reward points for tax — "Allow Tax to be converted to point(s)" | `earnPointTax` | tiền thuế cũng được tính điểm |
| Exclude specific tax types from points — "Exclude specific tax types when calculating points" | `excludeGST` | các loại thuế liệt kê **không** được tính điểm |
| Tax types to exclude — "Enter tax types separated by commas (e.g., GST, GB VAT, HST). These tax amounts will be excluded from point calculations." | `excludeTaxTypes` (mặc định `GST`) | danh sách **tên** thuế, so khớp với `tax_lines[].title` |

Code: `PlaceOrderV2Program.js:829-851`, nhãn ở `locale/input/PlaceOrderV2Program.json:164-173`. Lưu qua REST v2 `validations/restApi/program/earning/placeOrder.js:163-169`.

Joy **không** đọc setting thuế cấp shop ở đâu cả — chỉ đọc `taxes_included` trên từng đơn.

### 2.2 Luồng tính điểm khi đặt hàng (một ví dụ thật: đơn #37314)

1. Webhook đơn hàng đến, Joy dùng nguyên payload Shopify (`orderController.js:137`).
2. **Giá mỗi sản phẩm** = `line_items[].price × số lượng − giảm giá` (`programService.js:3364-3374`). **Không đụng tới thuế** → shop giá-chưa-gồm-thuế: giá sạch; shop giá-gồm-thuế: giá còn nguyên thuế bên trong. Kèm theo `taxLines` của sản phẩm (`programService.js:3450`).
   - Đơn #37314: tổng 174.20, dòng HST 22.64.
3. Cộng giá các sản phẩm hợp lệ, trừ giảm giá đơn / gift card / store credit, rồi vào hàm `getPriceWithShippingFeeAndTax` (`pointCalculatorHelpers.js:1391`):
   - **a. Phí ship** — cộng nếu bật Reward points for shipping fee (`:1396-1401`).
   - **b. Cộng thuế** — chỉ khi bật Reward points for tax **và** `taxes_included = false`. Cộng `totalTaxAmount`, nếu không có thì cộng các dòng thuế **trừ những loại đã loại trừ** (`:1403-1414`).
   - **c. Trừ thuế loại trừ** — nếu bật Exclude specific tax types thì **luôn** trừ tổng các dòng thuế có tên trong danh sách, **không xét** `taxes_included` lẫn Reward points for tax (`:1416-1427`).
     - Đơn #37314: 174.20 − 22.64 = **151.56**.
4. Điểm = số tiền × tỷ lệ → 151.56 × 4 = **606** (đúng phải 174.20 × 4 = 696). Log prod: `Calculated value for 18949223383272 606 174.20000000000002 151.56 0 points`.
5. Số tiền sau bước 3 lưu thành `orderSubTotalValid` trên activity (`orderEarnService.js:476`) — VIP tier "money spent" và milestone "amount spend" cộng dồn từ field này (`customerActivityRepository.js:3919-3951`, `milestoneService.js:996-1005`), nên **cũng ăn theo** mọi sai lệch thuế.

### 2.3 Bảng đầy đủ: code hiện tại so với đúng

Ví dụ hàng $100, thuế cần loại trừ $13 (nếu giá gồm thuế thì nhãn $113).

| Giá shop | Reward points for tax | Exclude tax types | Đúng ra | Joy hiện tại | |
|---|---|---|---|---|---|
| Chưa gồm thuế | Tắt | Tắt | 100 | 100 | ✅ |
| Chưa gồm thuế | Bật | Tắt | 113 | 113 | ✅ |
| Chưa gồm thuế | Tắt | Bật | 100 | **87** | ❌ bug ghn-oakridge |
| Chưa gồm thuế | Bật | Bật | 100 | **87** (bước b đã bỏ HST, bước c lại trừ HST) | ❌ cùng bug |
| Đã gồm thuế | Tắt | Tắt | 100 | **113** (thuế nằm trong giá, không ai bóc) | ⚠️ xem §3.2 |
| Đã gồm thuế | Bật | Tắt | 113 | 113 | ✅ |
| Đã gồm thuế | Tắt | Bật | 100 | 100 | ✅ |
| Đã gồm thuế | Bật | Bật | 100 | 100 | ✅ |

**Quy tắc đúng:** chỉ **trừ** thuế khi thuế **đang nằm trong** số tiền (giá gồm thuế, hoặc vừa được cộng vào ở bước b).

### 2.4 Hoàn tiền (trừ điểm khi refund)
`getPlaceOrderProgramToRefund` (`programService.js:3599`):
- Tiền thuế hoàn = cộng `refund_line_items[].total_tax` (`:3894-3897`), truyền vào thành `totalTaxAmount` cùng `taxes_included` của đơn gốc (`:3933-3935`).
- Có trần theo số tiền hoàn (`calcPointRefundAmount`, `:3997-4108`) — trần này **không xét** setting thuế.

### 2.5 Chỗ khác có đụng thuế
- **Điều kiện đơn hàng** (order subtotal / total): dùng thẳng `current_subtotal_price` / `current_total_price` của Shopify, không chỉnh thuế (`pointCalculatorHelpers.js:461-466`).
- **Điều kiện khách miễn thuế:** `customer_tax_exempt` (`const/conditionPlaceOrder.js:15`).
- **Dự tính điểm trên trang sản phẩm / giỏ** (storefront): không có dòng thuế → không cộng không trừ (`pointCalculatorHelpers.js:1845-1860`, `2038-2076`). Riêng giỏ Hydrogen/fetch lấy `tổng − thuế` (`scripttag/points-calculator/helpers/shopifyRequestHelpers.js:238-246`).
- **POS (dự tính điểm trong giỏ POS):** gửi `taxLines` nhưng không có `taxes_included` (`adaptPOSCartForEarn.js:63-71`) → bật Reward points for tax thì cộng thuế rồi lại trừ thuế loại trừ.
- **Checkout extension:** có `totalTaxAmount`, không có `taxLines` → bật Reward points for tax thì cộng cả thuế, không bỏ được loại loại trừ (`extensions/checkout-ui/src/index.jsx:104, 235-246, 301`).
- **Analytics:** `currentTotalTax` lấy từ `currentTotalTaxSet` (`syncOrderService.js:688`); nhánh REST dùng `parseInt(order.current_total_tax)` (`:865`) → cắt mất phần lẻ.

---

## 3. 🐞 Vấn đề đang mở

### 3.1 Trừ thuế khỏi giá chưa gồm thuế — bug ghn-oakridge (2026-10)
- Shop: ghn-oakridge (Ontario, Canada), program Place an order bật Exclude = `GST, HST`, tắt Reward points for tax.
- Chủ shop: *"I just don't want customers to earn points on taxes, I don't need points to be removed from their subtotal in the amount of taxes."*
- Riêng shop này: 5,158 đơn thiếu điểm từ 12/2025, tổng thiếu 106,435 điểm.
- Shop chỉ bị khi đủ 3 điều kiện: bật Exclude, giá chưa gồm thuế, và tên thuế điền **khớp** tên dòng thuế thật (shop Mỹ để mặc định "GST" không bị vì đơn Mỹ không có dòng tên GST). Toàn prod có 59 program bật Exclude (53 shop).
- Sửa: bước c chỉ chạy khi thuế đang nằm trong số tiền. Bản sửa có sẵn: commit `9e04d0893d` (nhánh `origin/thomasavada/s1792418743`, chưa MR).

### 3.2 Shop giá gồm thuế được tính điểm cả trên thuế dù tắt Reward points for tax
- 2025-04-11 `e3e37a6471` (Marco, "fix: tax include in product price"): khi `taxes_included = true`, bóc toàn bộ thuế khỏi giá sản phẩm.
- 2025-07-18 `6b5ebbd0e4` (Marco, "feat: add option exclude tax"): comment bỏ bước bóc đó; sau đó xoá hẳn ở `ef1a0a6222` (2025-08-13).
- Hệ quả: shop Úc / EU / UK… tắt Reward points for tax vẫn được điểm trên phần thuế nằm trong giá; chỉ loại được khi tự điền tên thuế vào Exclude.
- Chưa rõ đây là cố ý hay sót — cần hỏi Marco / task gốc. Chưa đo số shop.

### 3.3 Điểm yếu thiết kế
- So khớp theo **tên** thuế (`title`) — merchant phải gõ đúng tên ("HST", "GST", "GB VAT"…), tên lại phụ thuộc nước / tỉnh.
- `totalTaxAmount` chỉ có ở refund / checkout, webhook earn không có → bước b chạy nhánh khác tuỳ đường gọi.

---

## 4. 📚 Thuật ngữ
- **Tax-exclusive / giá chưa gồm thuế:** nhãn giá chưa có thuế, thuế cộng thêm lúc thanh toán.
- **Tax-inclusive / giá đã gồm thuế:** nhãn giá đã có thuế bên trong.
- **Tax line / dòng thuế:** một khoản thuế Shopify ghi trên sản phẩm hoặc phí ship (tên, thuế suất, số tiền).
- **GST / HST / PST / QST:** thuế Canada — GST liên bang 5%; HST = GST gộp thuế tỉnh (Ontario 13%); PST / QST thuế tỉnh riêng.
- **VAT:** thuế giá trị gia tăng (Anh, EU) — thường giá đã gồm.
