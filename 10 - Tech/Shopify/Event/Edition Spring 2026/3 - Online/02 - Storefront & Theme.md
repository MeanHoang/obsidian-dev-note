# Storefront & Theme - Editions Spring 2026

Các update liên quan đến storefront search, AI store analysis, và trải nghiệm chỉnh sửa theme trên mobile/laptop.

---

## Storefront search delivers more results

Cải thiện search trên storefront để trả về kết quả chính xác hơn, kể cả khi khách hàng gõ sai chính tả hoặc dùng cách diễn đạt khác thường.

### Cách hoạt động

Search engine của Shopify được xây dựng trên "AI-powered search infrastructure", available by default cho tất cả merchant có online store. Hệ thống search across products, blog posts, và pages.

**Built-in features (không cần cài gì thêm):**
- **Typo tolerance** - "typing mistakes are automatically matched to words that closely resemble the misspelling"
- **Predictive search** - dropdown suggestions khi khách gõ
- **Natural language search** - hiểu conversational queries

### Shopify Search & Discovery app (nâng cao)

Cài thêm app [Search & Discovery](https://apps.shopify.com/search-and-discovery) để có:
- **Custom product filters** - lọc sản phẩm theo category
- **Synonym groups** - đồng nghĩa, đảm bảo kết quả nhất quán dù khách dùng từ khác
- **Product boosting** - đẩy sản phẩm cụ thể lên đầu kết quả
- **Related product recommendations** - gợi ý trên product page

**Yêu cầu:** Bật Shopify Network Intelligence trong privacy settings. Staff cần permission: Products, Online Store Search and Navigation, và/hoặc Reports.

### Custom storefront

Storefront API hỗ trợ implement Search & Discovery features cho headless commerce, có search tracking để optimize performance.

**Availability:** Tất cả Shopify store.

---

## AI-powered store analysis (SimGym)

Phân tích theme của store bằng AI-simulated shoppers để nhận gợi ý cải thiện.

### Cách hoạt động

SimGym là một Shopify app (đang ở **AI Research Preview**) deploy các AI-powered shoppers để mô phỏng hành vi khách hàng. Các virtual shoppers "browse your store the way real customers do" - tương tác với products, navigate collections, và add items vào cart.

**2 loại simulation:**
1. **Theme Comparison** - so sánh active theme với draft theme, đo lường add-to-cart performance
2. **Single Theme Analysis** - đánh giá 1 theme (live hoặc draft) độc lập

**Insights bao gồm:**
- Navigation experience và product discoverability
- Checkout và cart addition ease
- Overall store layout intuitiveness
- "Strengths, areas for improvement, and prioritized recommendations ordered by conversion impact"

### Cách sử dụng

1. Install từ Shopify App Store
2. Truy cập qua Shopify admin: Apps > SimGym
3. Tạo simulation, chọn type và theme(s)
4. Monitor live progress khi AI shoppers browse
5. Review completed analysis và individual shopper recordings

### Yêu cầu

- **Liquid storefront** (Hydrogen/headless KHÔNG hỗ trợ)
- Shopify Network Intelligence phải bật
- Store không được password-protected
- Tối thiểu 1 product listing

### Pricing model

Pay-per-use: "each simulation you run costs one credit." Free credits trong research preview; mua thêm credits nếu cần.

### Limitations

- Theme comparison yêu cầu active theme + ít nhất 1 draft theme
- Kết quả có thể khác actual buyer behavior
- Hoạt động tốt nhất với established product catalogs

**Availability:** Tất cả plan (không giới hạn plan cụ thể).

---

## Better online store editing on mobile

Cải thiện trải nghiệm chỉnh sửa store trên Shopify mobile app.

### Cách hoạt động

Theme editor trên mobile app cho phép:
- Truy cập qua Menu icon > **Online Store** > **Edit**
- Adjust theme settings qua menu (⋮) > "Theme settings"
- Customize templates qua "Home page" dropdown
- Edit sections và blocks từ Sections panel
- Search elements bằng built-in search bar
- Add, remove, edit, và rearrange content

Ngoài theme editor, app còn hỗ trợ: blog post, page management, menu configuration, store preferences, password protection, Web Performance dashboard.

**Availability:** Tất cả user sử dụng Shopify app.

---

## Better editing experience on laptops

Cải thiện giao diện editor trên laptop với layout side-by-side.

### Cách hoạt động

Theme editor và checkout editor hiển thị sections và settings cạnh nhau (side by side), tận dụng không gian màn hình laptop tốt hơn thay vì phải scroll qua lại.

**Checkout editor** (tách biệt khỏi theme editor) cho phép customize:
- Checkout, thank you, order status, và customer account pages
- Branding: logo, background color/image, colors, fonts
- App integration (upsells, etc.)

| Feature | Basic+ | Shopify Plus |
|---------|--------|--------------|
| Editor access | Co | Co |
| Apps cho thank you/order status pages | Co | Co |
| Apps cho information/shipping/payments pages | Khong | Co |
| Checkout Branding API access | Khong | Co |

**Availability:** Tất cả plan (checkout customization nâng cao chỉ Plus).

---

## Nguon

- [Storefront search docs](https://help.shopify.com/en/manual/online-store/storefront-search)
- [SimGym simulations](https://help.shopify.com/en/manual/online-store/simgym#simulations)
- [Mobile theme editor](https://help.shopify.com/en/manual/shopify-admin/shopify-app/mobile-online-store#theme-editor)
- [Theme editor](https://help.shopify.com/en/manual/online-store/themes/customizing-themes)
- [Checkout editor](https://help.shopify.com/en/manual/checkout-settings/customize-checkout-configurations)
- [Shopify Editions Spring 2026](https://www.shopify.com/editions/spring2026) - truy cap 2026-07-29
