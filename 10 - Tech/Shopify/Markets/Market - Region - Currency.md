# Shopify Markets: Market, Region và Currency thực sự là gì?

> [!summary] Kết luận ngắn
> **Market không phải là country, region hay currency.** Market là một **nhóm khách hàng (audience)** mà Shopify xác định bằng các **conditions**, sau đó áp một bộ **customizations** cho nhóm đó.
>
> Với cross-border commerce, country/region là điều kiện dùng để đưa khách vào market; currency là một trong các cấu hình trải nghiệm được áp sau khi đã xác định market.

Tài liệu này đối chiếu theo Shopify Help Center và Shopify Developer Docs, kiểm tra ngày **2026-08-12**.

---

## 1. Mental model đúng

```text
Customer/request
      |
      v
Conditions: customer này thuộc nhóm nào?
(country/region, B2B company location, POS location, sales channel...)
      |
      v
MARKET = tập khách hàng được Shopify match
      |
      v
Customizations: nhóm này nhận trải nghiệm gì?
(catalog/product availability, price, currency, language, domain,
theme content, tax/duty, business entity...)
```

Công thức nhớ nhanh:

```text
Market = Audience/segment + Experience configuration
```

Hoặc theo cách Shopify mô tả:

```text
Market = Conditions + Customizations
```

Ví dụ:

- `Europe` có thể là tên một market.
- `France`, `Germany`, `Italy` là các country/region conditions nằm trong market đó.
- `EUR`, catalog EU, tiếng Pháp/Đức/Ý và `/en-eu` là các customizations.

Tên `Europe` chỉ là tên quản trị; chính conditions mới quyết định ai thuộc market.

---

## 2. Phân biệt từng khái niệm

| Khái niệm | Bản chất | Dùng để làm gì? | Không nên hiểu là |
|---|---|---|---|
| **Market** | Một tập khách hàng được định nghĩa trong store | Gom các khách cần cùng chiến lược bán hàng/trải nghiệm | Một quốc gia, một đồng tiền, hoặc một location |
| **Condition** | Quy tắc xác định audience | Match khách vào market | Cấu hình giá/currency |
| **Country/region market** | Market có condition dựa trên địa lý | Bán cross-border/international | Mọi loại market của Shopify |
| **Country/region** | Địa lý của khách; thường biểu diễn bằng country code | Match market, localization, checkout | Currency |
| **Customization** | Giá trị ghi đè/inherit cho market | Quyết định khách thấy sản phẩm, giá, currency, ngôn ngữ... nào | Điều kiện match khách |
| **Currency** | Đơn vị tiền tệ | Hiển thị giá, charge, refund hoặc payout tùy loại currency | Market hay country |
| **Catalog** | Tập sản phẩm và optional custom pricing | Quyết định sản phẩm nào được bán và giá theo market | Currency conversion |
| **Language/locale** | Ngôn ngữ và quy ước hiển thị | Nội dung dịch, URL và format | Country; một country có thể dùng nhiều language |

### Vì sao dễ hiểu sai?

Trong một cấu hình đơn giản, quan hệ trông gần như 1-1:

```text
Japan market -> Japan -> JPY
```

Nhưng đó chỉ là default thuận tiện. Shopify vẫn cho đổi market Japan sang một supported currency khác. Với multi-country market, một market có thể chứa nhiều country và hiển thị nhiều local currencies. Vì vậy:

```text
Market != Country/Region != Currency
```

---

## 3. “Region” trong Shopify nghĩa là gì?

Từ `region` bị dùng ở vài tầng khác nhau, cần đọc theo ngữ cảnh:

1. **Country or region**: đơn vị địa lý Shopify hỗ trợ để target cross-border. Trong API thường được biểu diễn bằng `CountryCode`, nhìn chung theo ISO 3166-1 alpha-2.
2. **Một nhóm địa lý mang tính kinh doanh**: ví dụ merchant đặt market tên `Europe`, chứa France + Germany + Italy. Tên nhóm này không tự mang ý nghĩa địa lý kỹ thuật; danh sách conditions mới có ý nghĩa.
3. **Sub-region**: state/province nằm trong một country, ví dụ California. Tính năng sub-region market hiện được Shopify ghi là early access và chỉ tùy chỉnh shipping; currency/catalog/theme/domain inherit từ parent.
4. **Backup region**: trải nghiệm fallback khi visitor không match active market nào. Đây không phải một market quốc tế mặc định để bán cho mọi nơi.

> [!warning] Điểm cần sửa trong cách nghĩ
> Đừng map chuỗi `region -> currency` trong code. Hãy map **country/customer context -> resolved market -> currency configuration**. Một “Europe market” vẫn có thể bật local currencies để France dùng EUR, Sweden dùng SEK, Poland dùng PLN.

---

## 4. Market được dùng làm gì?

Market là ranh giới để merchant tái sử dụng một chiến lược bán hàng cho một audience. Tùy loại market, có thể kiểm soát:

- Product availability và pricing qua catalog.
- Currency khách nhìn thấy và thanh toán.
- Language, domain/subdomain/subfolder.
- Theme sections, blocks và content.
- Tax-inclusive pricing, duties và taxes.
- Business entity xử lý giao dịch (Shopify Plus).
- Shipping trong các trường hợp Shopify hỗ trợ.

Shopify hiện không chỉ có geographic market:

- **Country or region market**: condition là vị trí địa lý; dùng cho cross-border.
- **B2B market**: condition là company locations/nhóm B2B.
- **Retail market**: condition là POS locations.
- **Channel market**: condition là sales channels.
- **Submarket**: market con, inherit cấu hình từ parent rồi override phần cần khác.

Do đó, định nghĩa tổng quát đúng là **customer segment**, không phải **geographic territory**. Geography chỉ là loại market phổ biến nhất khi nói về international selling.

---

## 5. Single-country và multi-country market

### Single-country market

- Chứa đúng một country/region.
- Khi tạo, Shopify tự đặt currency thành local currency của country đó.
- Merchant có thể đổi sang supported currency khác.
- Phù hợp khi country có chiến lược riêng: catalog, fixed price, content, tax hoặc domain riêng.

Ví dụ:

```text
Market: Japan
Condition: JP
Default currency: JPY
```

### Multi-country market

- Chứa nhiều country/region có cùng chiến lược bán hàng.
- Khi tạo, base currency mặc định là store base currency và **Local currencies bật mặc định**.
- Khi Local currencies bật, mỗi country hiển thị local currency của nó nếu payment setup hỗ trợ.
- Khi tắt Local currencies, mọi customer trong market nhìn thấy market base currency.

Ví dụ:

```text
Market: Europe
Conditions: FR, DE, SE, PL
Local currencies ON:
  FR -> EUR
  DE -> EUR
  SE -> SEK
  PL -> PLN

Local currencies OFF; market base currency = EUR:
  FR, DE, SE, PL -> EUR
```

Nên tách một country thành market riêng khi cần khác biệt thực sự về catalog/giá/content/domain/tax, hoặc cần manual FX riêng. Không cần tạo một market cho mỗi country chỉ vì local currency khác nhau.

---

## 6. Các loại currency — đừng trộn lẫn

| Currency | Ý nghĩa | Ví dụ |
|---|---|---|
| **Store currency / store base currency** | Currency dùng đặt giá gốc trong admin/primary context và làm báo cáo | USD |
| **Market base currency** | Currency nền của cấu hình market; đặc biệt quan trọng với multi-country market | EUR |
| **Local / customer / presentment currency** | Currency customer thấy, checkout và trả tiền | CAD |
| **Payout currency** | Currency Shopify gửi vào bank account của merchant | USD |

Một order có thể đồng thời liên quan nhiều currency:

```text
Product/store price: 100 USD
Customer sees and pays: 93.38 EUR
Merchant payout: USD
```

Trong dữ liệu order/API:

- `presentment_money`: số tiền theo currency khách bị charge; đây là phía customer.
- `shop_money`: số tiền quy về shop currency; dùng cho góc nhìn merchant/reporting.

Không nên lấy `shop_money` để render lại số tiền khách đã trả, và không nên giả định `currencyCode` luôn bằng store currency.

### Điều kiện quan trọng của multi-currency

Theo Shopify, để **process payments** bằng nhiều currencies, store cần Shopify Payments hoặc Adyen. Với payment provider khác, khách ở các markets thanh toán bằng store default currency. Currency khả dụng còn phụ thuộc country của store và payment processor. Nếu local currency của một country không được Shopify Payments hỗ trợ, Shopify hiển thị market base currency cho country đó.

---

## 7. Shopify chọn market/currency cho customer như thế nào?

### Khi browse storefront

Shopify dùng kết hợp các tín hiệu:

1. Lần đầu visit: IP geographic location để match country/region market.
2. Market-specific domain, subdomain hoặc subfolder nếu customer đi vào URL đó.
3. Country/language selector nếu customer chủ động chọn; preference được lưu cho lần sau.
4. Browser language để chọn language đã cấu hình trong market; language không tự quyết định currency.

### Khi checkout

Shipping address là tín hiệu cuối cùng cho geographic experience. Ví dụ visitor đang xem US/USD nhưng nhập shipping address Canada, checkout cập nhật sang Canada market, gồm currency và các customizations liên quan.

### Không match active market

- Customer nhận **backup region experience** khi browse.
- Theo tài liệu market types hiện tại, customer từ country không nằm trong active market vẫn browse được nhưng không thể complete purchase.

Do đó IP detection không phải chân lý cố định. VPN, du lịch hoặc ship sang country khác đều có thể làm context thay đổi. Store nên có country/language selector ngay cả khi bật automatic redirection.

---

## 8. Giá được tạo ra như thế nào?

Currency chỉ là đơn vị; giá cuối cùng còn phụ thuộc catalog/fixed price, adjustment, FX, conversion fee và rounding.

Trường hợp dynamic conversion cơ bản Shopify mô tả:

```text
Customer price = Base price x Exchange rate x (1 + Conversion fee)
```

Sau đó có thể áp rounding. Ví dụ Shopify đưa ra:

```text
100 USD x 0.92 x 1.015 = 93.38 EUR
```

Quy tắc đáng nhớ:

- **Fixed international price** có precedence cao hơn manual conversion rate.
- **Dynamic/automatic FX** được cập nhật thường xuyên và fee được đưa vào customer-facing price.
- **Manual FX** giúp ổn định giá; merchant chịu trách nhiệm cập nhật. Fee không cộng vào customer-facing price mà phản ánh trong payout.
- **Rounding** diễn ra sau conversion và price adjustments.
- FX dùng lúc capture/refund có thể khác nhau, nên merchant có rủi ro lời/lỗ tỷ giá.

> [!note]
> Fee và khả năng cụ thể có thể phụ thuộc store location, processor, plan và Markets version. Không hard-code tỷ lệ fee từ note này; kiểm tra Help Center/admin của store trước khi tính business logic.

---

## 9. Inheritance: market không có setting riêng thì sao?

- Market mới ban đầu inherit store defaults.
- Submarket inherit từ parent market.
- Nếu thêm customization vào submarket, nó override giá trị inherit tương ứng.
- Nếu bỏ customization, giá trị quay lại inherited value.
- Không phải mọi loại customization merge giống nhau; catalog có thể được kết hợp, nên cần xem rule riêng của từng loại.

Riêng currency:

- Submarket mặc định inherit currency customization của parent.
- Override currency tại submarket thì dùng override đó.
- Nếu submarket có nhiều parents với currency khác nhau, Shopify ưu tiên currency match local currency của customer; nếu không có match thì customization được update gần nhất được ưu tiên.

---

## 10. Developer mental model: truyền country context, không truyền market name

Ở Storefront API, cách phổ biến để lấy kết quả contextualized là `@inContext(country:, language:)`. Country context giúp Shopify resolve trải nghiệm market đã cấu hình; nó không có nghĩa API tự đổi giá sang currency bất kỳ mà app muốn.

```graphql
query ProductForCountry($country: CountryCode!, $language: LanguageCode!)
  @inContext(country: $country, language: $language) {
  localization {
    country {
      isoCode
      currency {
        isoCode
      }
    }
  }
  product(handle: "example") {
    title
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
  }
}
```

Checklist khi `@inContext(country: US)` vẫn trả currency ngoài dự kiến:

1. US có nằm trong một **active country/region market** không?
2. Currency customization của market đó là gì?
3. Multi-country market đang bật hay tắt Local currencies?
4. Currency có được payment processor/store location hỗ trợ không?
5. Product có publish trong catalog/market không, và có fixed contextual price không?
6. Request/cart buyer identity có cùng country context không?
7. Đọc `currencyCode` đi kèm amount, không suy đoán bằng country code.

> [!important]
> `country = US` là input ngữ cảnh, không phải lệnh `currency = USD`. Shopify resolve currency từ Markets + payment/configuration. Muốn biết currency thực tế, luôn đọc `MoneyV2.currencyCode`/localization response.

---

## 11. Các hiểu nhầm thường gặp

### “Một market chỉ có một currency”

Sai với multi-country market bật Local currencies. Một market có thể trả nhiều local currencies theo country.

### “Region Europe nghĩa là EUR”

Sai. Europe có countries không dùng EUR. `Europe` thường chỉ là market name/group do merchant tổ chức.

### “Biết IP là biết currency cuối cùng”

Sai. Customer có thể đổi country selector; domain có thể cung cấp context; shipping address tại checkout có thể đổi market; processor có thể không hỗ trợ local currency.

### “Language quyết định market/currency”

Sai. Browser language chọn language đã bật trong market. Country/region context mới là phần địa lý chính; cùng tiếng Anh có thể là US/USD, GB/GBP, AU/AUD.

### “Currency selector và country selector là một”

Trong Markets, country selector chọn localized country/market experience, từ đó Shopify resolve currency. Chỉ thay ký hiệu tiền trên front end mà không đổi Shopify context có thể khiến product/cart/checkout không nhất quán.

### “Market giống shipping zone”

Sai. Market điều khiển audience + selling experience; shipping zone/rate điều khiển khả năng và giá vận chuyển. Chúng có liên hệ theo destination nhưng không phải cùng object.

### “Market giống location/inventory location”

Sai. Location là nơi stock/fulfillment/POS vận hành. Retail market có thể dùng POS location làm condition, nhưng market vẫn là lớp segmentation/configuration.

---

## 12. Cách thiết kế cấu hình thực tế

Giả sử store currency/payout là USD và bán US, Canada, France, Germany:

```text
Market: United States
  condition: US
  currency: USD
  catalog: US catalog

Market: Canada
  condition: CA
  currency: CAD
  catalog: Canada catalog / fixed CAD prices nếu cần

Market: EU Core
  conditions: FR, DE
  local currencies: ON
  resolved currency: EUR cho cả FR và DE
  catalog: EU catalog
```

Tách Canada riêng không phải vì Canada “là một market” theo tự nhiên, mà vì business muốn chiến lược Canada khác: CAD pricing, catalog, margin, shipping/content riêng.

Nguyên tắc tạo market:

- Group countries khi **business rules giống nhau**.
- Split country khi cần **override khác nhau**.
- Đừng group chỉ dựa vào continent hoặc cùng currency nếu catalog/tax/content/shipping strategy khác.
- Đừng split chỉ vì mỗi country có local currency khác nếu Local currencies đã giải quyết được.

---

## 13. Checklist debug nhanh

Khi market/currency “sai”, kiểm tra theo đúng thứ tự:

```text
1. Customer country context hiện tại là gì?
2. Country đó match active market nào?
3. Nếu không match: backup region nào đang hiển thị?
4. Market đang inherit hay override currency?
5. Single-country hay multi-country?
6. Local currencies ON/OFF?
7. Payment processor có hỗ trợ currency này không?
8. Catalog/fixed price/adjustment nào đang áp dụng?
9. Storefront, cart và checkout có cùng country/buyer identity không?
10. Shipping address có làm checkout đổi market không?
11. API response thực trả amount + currencyCode nào?
12. Đang nhầm presentment_money với shop_money/payout currency không?
```

---

## 14. Một câu định nghĩa để dùng trong team

> **Shopify Market là một segment khách hàng có điều kiện nhận diện và bộ cấu hình bán hàng riêng. Với international commerce, Shopify dùng country/region để match khách vào market; sau đó market quyết định catalog, giá, currency, language, domain và các trải nghiệm liên quan.**

---

## Nguồn chính thức

- [Overview of markets features and concepts](https://help.shopify.com/en/manual/markets/getting-started/overview) — định nghĩa Market = audience, conditions và customizations.
- [Understanding market types](https://help.shopify.com/en/manual/markets/getting-started/market-types) — country/region, single-country, multi-country, retail, B2B, channel và sub-region markets.
- [Setting up currencies for markets](https://help.shopify.com/en/manual/markets/customizations/local-currencies) — single/multi-country currency, local currencies, FX, rounding, fee và fallback.
- [Setting up localization for markets](https://help.shopify.com/en/manual/markets/getting-started/localization) — IP, browser language, URL, selector và shipping address tại checkout.
- [Adding and removing market customizations](https://help.shopify.com/en/manual/markets/customizations/overview) — customization và inheritance.
- [Currency conversions and exchange rates](https://help.shopify.com/en/manual/international/pricing/exchange-rates) — currency definitions, fixed price precedence, manual FX, capture/refund risks.
- [International domains](https://help.shopify.com/en/manual/international/managing-international-domains) — URL theo market/country và localization.
- [Storefront API `@inContext`](https://shopify.dev/docs/api/storefront/latest/directives/inContext) — contextualize Storefront API theo country/language/buyer.
- [Storefront API `localization`](https://shopify.dev/docs/api/storefront/latest/queries/localization) — countries, languages và currency khả dụng trong Storefront context.
- [Admin API `CountryCode`](https://shopify.dev/docs/api/admin-graphql/latest/enums/CountryCode) — country/region codes Shopify dùng trong API.

