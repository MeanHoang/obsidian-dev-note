# 02 – Thị trường và cách AI đọc dữ liệu

Thuộc [[00 - Tổng quan]]. Đây là nền nghiệp vụ của app: phải biết AI lấy dữ liệu shop từ đâu, mỗi nền tảng đã tự làm gì, thì mới biết app còn làm được gì.

> 📖 = trích nguồn. 💭 = nhận định AI. ⚠️ = chưa kiểm tra. Câu trích lấy qua agent, chưa đối chiếu lại.

Note gồm: **phần 0** so sánh mọi nền tảng, **mục 1–6** chi tiết Shopify (nghiên cứu trước), **phần 7** chi tiết các nền tảng khác.

## 0. So sánh các nền tảng

### Số shop

Nguồn: Store Leads (storeleads.app/reports/{nền tảng}), dữ liệu 2026-10-02.

| Nền tảng | Số shop | Nước nhiều nhất |
|---|---|---|
| WooCommerce | 3.998.457 | Mỹ 500.005 · UK 177.054 · Đức 115.088 · Ấn Độ 112.015 · Ý 105.216 · Pháp 93.693 |
| Shopify | 3.103.755 | Mỹ 1.186.833 · UK 231.569 · Canada 147.180 · Úc 138.183 |
| Wix | 966.810 | Mỹ 424.887 · UK 99.440 · Brazil 48.666 |
| Squarespace | 392.467 | Mỹ 306.963 · UK 25.588 |
| PrestaShop | 146.969 | Pháp 21.763 · Tây Ban Nha 15.251 |
| Magento / Adobe Commerce | 100.796 | Mỹ 13.978 · Đức 6.974 |
| BigCommerce | 36.450 | Mỹ 25.453 |
| Shopware | 30.103 | Đức 20.137 |

### AI lấy dữ liệu shop ngoài Shopify bằng đường nào

**Ngoài Shopify, không nền tảng nào tự đưa mọi shop vào ChatGPT, Copilot, Perplexity.** Các đường đi:

| Đường | Kênh AI | Ai dùng được | Ghi chú |
|---|---|---|---|
| Google Merchant Center | Google AI Mode, Gemini | Gần như mọi nền tảng (plugin, app đồng bộ) | Phổ biến nhất |
| Stripe Agentic Commerce Suite | ChatGPT, các agent khác | Shop tải feed CSV lên Stripe, xin kết nối từng agent | Mỹ, Canada, một số nước châu Âu; bản cho nền tảng phải **chờ duyệt**. Stripe nói sẽ triển khai qua Wix, WooCommerce, BigCommerce, Squarespace ([Stripe](https://stripe.com/blog/agentic-commerce-suite), 2025-12-11) |
| Feed trực tiếp cho ChatGPT | ChatGPT | 📖 "Onboarding product feeds in ChatGPT is currently available to approved partners." Chỉ đối tác được duyệt ([OpenAI](https://developers.openai.com/commerce/guides/get-started)) | Ai cũng nộp đơn được, nhưng phải được duyệt |
| PayPal | Perplexity, Copilot | Wix, các shop dùng PayPal | Đang triển khai |
| Dịch vụ feed lớn (Feedonomics) | ChatGPT, Perplexity, Gemini, Copilot | Shopify, BigCommerce, Magento, WooCommerce | Cho doanh nghiệp lớn, trả phí cao |
| **AI tự đọc trang web** | Mọi AI | Mọi shop | Phụ thuộc chữ trên trang và dữ liệu cấu trúc JSON-LD |

💭 Với shop ngoài Shopify, **chữ trên trang, dữ liệu cấu trúc và feed Google Merchant Center** là những gì AI thấy. Dữ liệu này do chủ shop tự lo. Đây là chỗ app có giá trị hơn so với ở Shopify.

## 1. Thị trường

| Chỉ số | Số liệu | Nguồn |
|---|---|---|
| Traffic từ AI vào web bán lẻ Mỹ | +62% so với cùng kỳ (07/2026), +1.219% từ 10/2024 | [Adobe qua Digital Commerce 360](https://www.digitalcommerce360.com/2026/08/19/adobe-ai-referral-traffic-data-july-2026/), 2026-08-19 |
| Chuyển đổi của traffic AI | Cao hơn 60%, doanh thu mỗi lượt cao hơn 53%; tháng thứ 11 liên tiếp cao hơn | Adobe |
| Trang chủ nhà bán lẻ thiếu nội dung cho máy đọc | 39% | Adobe |
| **Dữ liệu Shopify Catalog so với dữ liệu thu thập từ web** | 📖 "AI searches powered by Shopify Catalog convert at 2x the rate of those using scraped data." Tìm kiếm AI dùng Shopify Catalog chuyển đổi **gấp đôi** | [Shopify Spring '26](https://www.shopify.com/news/spring-26-edition-merchant), 2026-06-17 |
| Người mua dự định dùng AI mùa lễ | 65% dùng AI cho ít nhất một việc mua sắm | [Shopify](https://www.shopify.com/news/agentic-holiday-2026), 2026-10-06 |
| Ví dụ shop | Stanley 1913: đơn từ AI ở Mỹ gấp 5 lần cùng kỳ; ILIA gần gấp 3 | Shopify, 2026-10-06 |

💭 Câu "Catalog chuyển đổi gấp đôi" là **bằng chứng chính thức mạnh nhất** rằng dữ liệu tốt giúp bán hàng. Nhưng đây là so dữ liệu Catalog với dữ liệu cào web, không phải so "thuộc tính đầy đủ" với "thiếu thuộc tính".

Bằng chứng ngược: Walmart thanh toán trong ChatGPT kém gấp 3 so với web; nhiều chủ shop nói traffic AI còn quá nhỏ (xem [[01 - Vấn đề và tệp khách hàng]]).

---

## 2. AI lấy dữ liệu shop từ đâu

| Kênh AI | Lấy dữ liệu từ đâu | Chủ shop có gửi feed riêng được không |
|---|---|---|
| **ChatGPT** | Shopify Catalog. 📖 "If you sell through Shopify or Etsy, your catalog is already integrated, and no additional setup or application is required." ([chatgpt.com/merchants](https://chatgpt.com/merchants)) | **Không**. Feed riêng chỉ cho đối tác được duyệt. Đòn bẩy duy nhất là dữ liệu trong Shopify |
| **Google AI Mode, Gemini** | Kênh Google & YouTube → **Google Merchant Center**, không chỉ Shopify Catalog | Có, qua Merchant Center |
| **Microsoft Copilot** | Shopify Catalog, tự đăng ký; Microsoft Merchant Center | Không cần làm gì |
| Meta | Shopify Catalog | — |
| Perplexity | ⚠️ Chưa rõ, có thể nằm trong nhóm "kênh khác" | — |

Mỗi kênh mua hàng khác nhau: ChatGPT chỉ giới thiệu rồi chuyển khách về trang thanh toán của shop; Google, Copilot, Meta có thể thanh toán ngay.

---

## 3. Shopify đã tự làm những gì

Đây là phần **quan trọng nhất**: cái gì Shopify làm miễn phí thì app không nên bán.

| Shopify tự làm | Chi tiết | Nguồn |
|---|---|---|
| Đưa dữ liệu sang ChatGPT, Copilot, Google, Meta | Bật mặc định, không rút khỏi Catalog được | help.shopify.com |
| **Tự tạo llms.txt, agents.md** | 📖 "You don't need a third-party app to generate these files. Shopify Catalog is the authoritative product data feed" (không cần app bên thứ ba để tạo các file này) | [help.shopify.com](https://help.shopify.com/en/manual/online-sales-channels/agentic-storefronts/products) |
| Gợi ý danh mục và thuộc tính bằng AI | Khi tạo sản phẩm, Shopify gợi ý danh mục và tự điền một số thuộc tính | [help.shopify.com](https://help.shopify.com/en/manual/products/details/product-category) |
| **AI của Shopify tự bổ sung dữ liệu** | Các trường `description`, `options`, `metadata.attributes` (chất liệu, kiểu, dịp dùng), `tech_specs`, `top_features`, `unique_selling_points` được đánh dấu "Inferred" (Shopify tự sinh). 📖 "Treat them as discovery and merchandising signals, not as merchant-authored source text." (coi như tín hiệu tham khảo, không phải dữ liệu chủ shop viết) | [shopify.dev](https://shopify.dev/docs/agents/catalog/global-catalog-extension) |
| Chấm điểm chất lượng từng sản phẩm | Độ dài mô tả, số ảnh, đánh giá, biến thể, độ đầy đủ chính sách. **Không chấm thuộc tính theo danh mục** | Admin → Sales channels → Agentic |
| Xem trước kết quả tìm kiếm | Xem sản phẩm hiện và xếp hạng thế nào trong Catalog | Admin → Agentic |
| Bảng số liệu đơn từ AI | Đơn, doanh số, chuyển đổi từ ChatGPT, Copilot, AI Mode; "Search intelligence" cho biết câu hỏi AI phổ biến trong ngành | Shopify Spring '26 |
| **App Knowledge Base** (miễn phí, của Shopify) | Tự tạo FAQ, "sự thật về shop" từ cài đặt (ngôn ngữ, giao hàng, đổi trả) để AI dùng; xem câu hỏi khách hỏi AI và AI trả lời được không | [help.shopify.com](https://help.shopify.com/en/manual/promoting-marketing/knowledge-base) |
| Catalog Mapping | Chọn lấy tiêu đề, mô tả, danh mục từ trường nào (kể cả metafield riêng) | [help.shopify.com](https://help.shopify.com/en/manual/shopify-catalog/mapping) |
| Sidekick | Sửa sản phẩm, viết mô tả, đề xuất thay đổi để duyệt, chạy việc dài ở nền | help.shopify.com |

### Shopify khuyên tối ưu gì

Theo [hướng dẫn tối ưu sản phẩm cho AI](https://help.shopify.com/en/manual/shopify-catalog/optimizing-products), các trường AI xét: tiêu đề, mô tả, ảnh, loại sản phẩm, nhà sản xuất, bộ sưu tập, tag, **mã vạch (GTIN)**, biến thể và tên tuỳ chọn. Thêm: chính sách đầy đủ, dùng Knowledge Base.

⚠️ **Category metafields không có trong danh sách này.** Catalog chỉ lọc theo 3 thuộc tính: **Màu, Size, Giới tính**.

### Google nói gì

📖 "There are no additional requirements to appear in AI Overviews or AI Mode, nor other special optimizations necessary." ([Google](https://developers.google.com/search/docs/appearance/ai-features))

Không cần yêu cầu gì thêm, không cần tối ưu đặc biệt để xuất hiện trong AI Overview, AI Mode. Google cũng nói không cần file AI riêng hay dữ liệu cấu trúc đặc biệt; chỉ cần dữ liệu cấu trúc khớp nội dung trang và Merchant Center cập nhật.

💭 Hệ quả: **"SEO cho AI" bằng file, schema đặc biệt là bán khống**. Giá trị thật nằm ở **dữ liệu đúng và đủ**.

---

## 4. Danh mục chuẩn của Shopify (Standard Product Taxonomy)

Đếm từ bản v2026-08 ([GitHub Shopify/product-taxonomy](https://github.com/Shopify/product-taxonomy/releases), 2026-08-24):

| | Số lượng |
|---|---|
| Ngành lớn | 26 |
| Danh mục | 14.606 (11.942 danh mục cuối) |
| Thuộc tính | 8.240 |
| Giá trị thuộc tính | 74.820 |
| Trung bình mỗi danh mục | khoảng 6,4 thuộc tính |

Ví dụ: Thời trang → Áo → Sơ mi có 16 thuộc tính: độ tuổi, cách giặt, kiểu túi ngực, đặc điểm, màu, vải, cổ áo, hoạ tiết, kiểu măng sét, size, loại size, độ dài tay, kiểu tay, độ co giãn, giới tính, độ dài áo.

Chưa có số liệu công khai về tỷ lệ chủ shop điền các thuộc tính này.

---

## 5. Bảng dữ liệu: trường nào, AI nào dùng, app sửa được không

| Dữ liệu | Kênh AI dùng | Nằm ở đâu trong Shopify | App đọc/ghi được? | Shopify tự làm? |
|---|---|---|---|---|
| Tiêu đề, mô tả | Tất cả | Trường sản phẩm | Có | Một phần: AI Shopify bổ sung mô tả; Sidekick viết |
| Ảnh, alt text | Tất cả | Media | Có | Không (alt text là việc chủ shop) |
| Biến thể, tuỳ chọn | Tất cả | Options, variants | Có | Catalog chuẩn hoá tên tuỳ chọn |
| **GTIN, MPN, thương hiệu** | ChatGPT, Google, dữ liệu cấu trúc | Mã vạch, vendor | Có | **Không. Phải là dữ liệu thật, không được bịa** |
| Danh mục Shopify | Catalog, xét đủ điều kiện, Google | `product.category` | Có (`productSet`) | AI gợi ý khi tạo |
| Thuộc tính theo danh mục (chất liệu, màu, vải…) | Catalog (lọc Màu, Size, Giới tính); Google ⚠️ chưa rõ ánh xạ | Metafield namespace `shopify` → metaobject | Có thể ⚠️ cần thử trên dev store | Một phần |
| **Kích thước, cân nặng** | ChatGPT, Google, dữ liệu cấu trúc | Cân nặng biến thể; kích thước chỉ trong metafield | Có | **Không** |
| Đánh giá | Catalog, ChatGPT, Google | App đánh giá | Tuỳ app đánh giá | Không |
| **Chính sách** (đổi trả, giao hàng, riêng tư) | **Bắt buộc** cho ChatGPT, Copilot, Google | Settings → Policies | Đọc được; ghi ⚠️ chưa rõ | Một phần: Knowledge Base tạo sự thật từ cài đặt |
| FAQ, hỏi đáp | Công cụ MCP chính sách của Shopify, Knowledge Base, Google `question_and_answer` | Metaobject của Knowledge Base, trang | ⚠️ Chưa rõ app ghi được không | Một phần |
| Dữ liệu cấu trúc JSON-LD | Google Search, agent cào web | Theme | Qua theme app extension | Chỉ Product, Offer cơ bản; **không có giao hàng, đổi trả, đánh giá** |
| llms.txt, agents.md | Không thấy AI nào xác nhận dùng | Tự tạo | — | **Có, toàn bộ** |

## 6. 💭 Phần nào thật sự là việc của chủ shop (cơ hội cho app)

1. **Dữ liệu thật AI không đoán được**: GTIN, chất liệu thật, kích thước, cân nặng, cách giặt, chứng nhận, bảo hành, lắp vừa với gì. Chính Shopify nói dữ liệu AI tự bổ sung có thể không chính xác.
2. **Danh mục đúng và thuộc tính đủ**: chọn đúng danh mục cuối (quyết định cả điều kiện vào Catalog), điền đủ thuộc tính, ưu tiên Màu, Size, Giới tính.
3. **Chính sách đầy đủ, nhất quán**: bắt buộc ở 3 kênh; văn bản chính sách phải khớp cài đặt và Merchant Center.
4. **Dữ liệu cấu trúc bổ sung** (đổi trả, giao hàng cấp shop, GTIN, đánh giá): phục vụ Google Search và agent cào web. Phải nói thật: Google không bắt buộc.
5. **Kiểm tra "AI trả lời được không" và chỉ ra trường nào thiếu**: chưa có công cụ gốc nào chỉ ra **vì sao** AI không trả lời được và nối tới trường cần sửa.
6. **Gợi ý Catalog Mapping**: nhiều shop để dữ liệu thật trong metafield riêng, cần hướng dẫn ánh xạ.

---

## 7. Các nền tảng khác

### WooCommerce

| Mục | Tình hình (10/2026) |
|---|---|
| Kênh AI | Google qua plugin Google for WooCommerce (800.000 lượt cài, điểm 54/100). Stripe ACS: 📖 "Agentic checkout is coming to Stripe for WooCommerce" (**sắp có**, [woocommerce.com](https://woocommerce.com/products/stripe/)). UCP, ACP: "Coming Soon" |
| WooCommerce đã làm | MCP (từ bản 10.3) **chỉ cho admin, dev**; "AI Product Advisor" là plugin thử nghiệm trên GitHub, chỉ gợi ý sửa tiêu đề, mô tả, danh mục ([developer.woocommerce.com](https://developer.woocommerce.com/2026/05/25/improve-product-listings/), 2026-05-25) |
| Không có | llms.txt trong lõi, AI tự bổ sung thuộc tính, **danh mục chuẩn** như Shopify |
| Mô hình dữ liệu | Thuộc tính chung và riêng, danh mục, tag, thương hiệu, GTIN (`global_unique_id`) |
| Dữ liệu cấu trúc mặc định | Có: tên, link, mô tả, ảnh, SKU, GTIN, giá, người bán, điểm đánh giá, đánh giá ([mã nguồn](https://github.com/woocommerce/woocommerce/blob/trunk/plugins/woocommerce/includes/class-wc-structured-data.php)). **Thiếu: giao hàng (`shippingDetails`), chính sách đổi trả (`hasMerchantReturnPolicy`), thuộc tính sản phẩm (màu, size, chất liệu)** |

💭 WooCommerce là nơi **khoảng cách giữa cái AI cần và cái nền tảng tự làm lớn nhất**.

### Wix

📖 Wix: "Every Wix site ships with automatic structured data, Site MCP, llms.txt and (for eligible sites) NLWeb." "Wix automatically generates schema.org markup (Product, Offer, MerchantReturnPolicy)." ([Wix](https://www.wix.com/blog/agentic-commerce-on-wix), 2026-07-27)

Mọi web Wix tự có dữ liệu cấu trúc, MCP, llms.txt. Wix tự tạo schema gồm sản phẩm, giá, **chính sách đổi trả**.

Thêm: Wix là CMS đầu tiên ký chuẩn ACP; bán qua nhiều agent bằng Stripe ACS (đang triển khai dần); PayPal đưa sản phẩm lên Perplexity; công cụ "AI Visibility" đếm lượt ChatGPT, Gemini, Perplexity nhắc.

💭 Wix tự làm **gần như Shopify**. Khoảng trống còn lại: độ đầy đủ thuộc tính, thử hỏi trên dữ liệu shop.

### BigCommerce

- Kết nối Google UCP sẵn; ChatGPT, Copilot, Perplexity qua Feedonomics (trả phí).
- **Tự bán bổ sung dữ liệu**: 📖 "BigCommerce Catalog Enrichment… generates titles, descriptions, feature bullets, FAQs, and metadata in bulk while keeping merchants in control of every change" ([BigCommerce](https://www.bigcommerce.com/product/agentic-commerce/)). Bổ sung tiêu đề, mô tả, đặc điểm, FAQ hàng loạt, chủ shop duyệt từng thay đổi. Gần đúng lõi của app.

💭 Không nên vào.

### Squarespace

- Đồng bộ Google Merchant Center sẵn; llms.txt tự viết tay, tắt mặc định; schema tự sinh, **không sửa được**.
- Có công cụ AI Visibility đếm lượt AI nhắc, miễn phí theo gói.
- Mô hình dữ liệu mỏng (chỉ biến thể).

💭 Khoảng trống nhỏ, chủ yếu là shop dịch vụ, sáng tạo.

### Magento, PrestaShop, Shopware, Ecwid

| Nền tảng | Tình hình |
|---|---|
| Magento / Adobe Commerce | Ít tính năng AI sẵn; tới AI qua Feedonomics, feed Google; thuộc tính rất phong phú nhưng lộn xộn; bán qua agency |
| PrestaShop | Gần như chưa có gì cho AI |
| Shopware | Extension chính thức "Agentic Commerce (Beta)" tạo feed OpenAI, Google, UCP, nhưng **1,2/5 sao** (6 đánh giá), bị chê lỗi 500, sập shop |
| Ecwid | Tự đồng bộ Google Shopping; schema tự sinh, **không sửa được** |

### Sàn (Etsy, Amazon, TikTok Shop)

Sàn nắm dữ liệu, tự đưa sang AI (Etsy là đối tác đầu tiên của ChatGPT). Công cụ bên ngoài chỉ sửa được nội dung người bán tự sửa trên sàn. 💭 Không nên vào.

### Bảng tổng hợp

| Nền tảng | AI lấy dữ liệu bằng | Nền tảng tự làm | 💭 Khoảng trống cho app |
|---|---|---|---|
| Shopify | Tự đồng bộ qua Catalog | Feed, llms.txt, AI bổ sung thuộc tính, Knowledge Base | Nhỏ tới vừa |
| **WooCommerce** | Google Merchant Center, AI đọc trang; ChatGPT "sắp có" | MCP cho admin, schema cơ bản thiếu đổi trả, giao hàng, thuộc tính | **Rất lớn** |
| Wix | Stripe ACS, PayPal, AI đọc trang | Schema có đổi trả, llms.txt, MCP, đo lượt nhắc | Nhỏ tới vừa |
| Squarespace | Merchant Center, AI đọc trang | Schema khoá, đo lượt nhắc | Nhỏ |
| BigCommerce | Google UCP, Feedonomics | Tự bán bổ sung dữ liệu | Nhỏ |
| Magento | Feedonomics, feed | Ít | Lớn nhưng bán qua agency |
| Shopware | Extension beta lỗi | MCP cho admin | Vừa tới lớn (Đức) |
