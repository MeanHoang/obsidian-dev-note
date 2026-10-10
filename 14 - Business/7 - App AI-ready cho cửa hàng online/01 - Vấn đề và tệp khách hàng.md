# 01 – Vấn đề và tệp khách hàng

Thuộc [[00 - Tổng quan]].

> 📖 = trích nguồn. 💭 = nhận định AI. ⚠️ = chưa kiểm tra. [M] = có vẻ là chủ shop thật. [V] = nhà bán app, agency, dev. Câu trích lấy qua agent, chưa đối chiếu lại.

Note gồm 2 phần: **phần A** nỗi đau chung và trên Shopify (nghiên cứu trước), **phần B** các nền tảng khác (WooCommerce, Wix), ở cuối note.

# Phần A: Shopify

⚠️ Lưu ý về nguồn: phần lớn chủ đề về AI trên Shopify Community là **do nhà bán app và agency viết** để thử nhu cầu. Bài của chủ shop thật ít hơn, và những bài nhiều tương tác nhất của chủ shop lại là **đòi tắt** kênh AI, không phải đòi tối ưu.

---

## Bối cảnh: kênh AI đã bật mặc định

📖 Shopify: "Agentic storefronts is active by default for eligible stores." ([help.shopify.com](https://help.shopify.com/en/manual/online-sales-channels/agentic-storefronts)). Kênh bán qua AI bật mặc định cho shop đủ điều kiện.

📖 "You can't opt out of Shopify Catalog itself." ([help.shopify.com](https://help.shopify.com/en/manual/shopify-catalog)). Không thể rút khỏi Shopify Catalog.

Hiện **chỉ ở Mỹ**: 📖 "Only for us shops btw" ([r/shopify](https://www.reddit.com/r/shopify/comments/1ucg6bw/), 2026-06-22).

💭 Mọi shop ở Mỹ giờ đều bị AI đọc dữ liệu và giới thiệu (hoặc không giới thiệu) cho khách, dù muốn hay không. Dữ liệu sai giờ lộ ra công khai.

---

## 3 nỗi đau chính

### Nỗi đau 1: AI nói sai về sản phẩm của tôi

📖 [M] beckyfmartin, "LLMs think my product is out of stock when it is not" ([Shopify Community](https://community.shopify.com/t/677281), 2026-09-06, 321 lượt xem, 14 bài)

> "LLMs are repeatedly saying that my product is out of stock when they are sent to look at my website. The product is not out of stock."

AI liên tục nói sản phẩm của tôi hết hàng khi được gửi vào xem web của tôi. Sản phẩm không hề hết hàng.

📖 [M] phb1, "Product feed in chatgpt?" ([Shopify Community](https://community.shopify.com/t/575962), 2025-11-17, 556 lượt xem)

> "We noticed our products are in chatgpt as shopping cards, but we are wondering if all of them are 'indexed'? if price and stock information is accurate?"

Chúng tôi thấy sản phẩm hiện trong ChatGPT dạng thẻ mua hàng, nhưng không biết đã được đưa vào hết chưa, giá và tồn kho có đúng không.

📖 [M] CasimirCK, "Why Can't We Opt Out of Agentic Storefronts?" ([Shopify Community](https://community.shopify.com/t/631140), 2026-06-05, 456 lượt xem, 9 thích)

> "we sell products that serve a niche within a niche… I do not trust AI to connect people with the correct part. At best, we will see an uptick in sales that need to be amended or returned; at worst, our products will be shown in misleading contexts."

Chúng tôi bán sản phẩm cho một ngách trong ngách… Tôi không tin AI ghép đúng người với đúng linh kiện. Tốt nhất thì thêm đơn phải sửa hoặc trả hàng; tệ nhất thì sản phẩm bị giới thiệu sai ngữ cảnh.

### Nỗi đau 2: Điền thuộc tính cho hàng nghìn sản phẩm không làm nổi, AI của Shopify chỉ làm lượt đầu

📖 [M] Kekti, "Category metafields not included in google merchant center" ([Shopify Community](https://community.shopify.com/t/630492), 2026-06-02, 223 lượt xem)

> "Workarounds require duplicating data across 3,000+ products, which is not scalable"

Cách chữa tạm phải nhân bản dữ liệu cho hơn 3.000 sản phẩm, không làm nổi khi nhiều.

📖 [M] merchant2010 ([Shopify Community](https://community.shopify.com/t/686939), 2026-09-24)

> "For merchants managing hundreds or thousands of products, this creates unnecessary repetitive work."

Với người quản lý hàng trăm, hàng nghìn sản phẩm, việc này tạo ra công việc lặp lại không cần thiết.

📖 [V, agency] trong [r/shopify](https://www.reddit.com/r/shopify/comments/1ucg6bw/) (2026-06-22)

> "Sidekick did an OK first pass on the catalog, but we still had to rewrite a bunch of attributes so ChatGPT actually 'understands' who it's for and when to recommend it."

Sidekick làm lượt đầu cho danh mục tạm được, nhưng chúng tôi vẫn phải viết lại nhiều thuộc tính để ChatGPT thật sự "hiểu" sản phẩm dành cho ai và khi nào nên giới thiệu.

📖 [M] cùng chủ đề: "'who is this for' and 'when would you actually use this' matter way more than the standard spec fields, but it's a lot of rewriting at scale." "Dành cho ai" và "khi nào dùng" quan trọng hơn thông số chuẩn nhiều, nhưng viết lại số lượng lớn rất mệt.

📖 [M] Maverick187, "How are you optimizing product listings when the supplier data is poor?" ([Shopify Community](https://community.shopify.com/t/683933), 2026-09-18, 263 lượt xem, 25 bài): "weak product descriptions, missing metadata, generic images used by many other sellers…" Mô tả yếu, thiếu dữ liệu, ảnh chung chung nhiều người bán cùng dùng.

### Nỗi đau 3: Không biết bắt đầu từ đâu

📖 [M] olgapapodoki, "Getting traffic from ChatGPT & AI agents, where do I even start?" ([Shopify Community](https://community.shopify.com/t/667253), 2026-08-16, **1.014 lượt xem, 23 bài, 14 thích**)

> "Do they look at product descriptions, schema markup, reviews…? I'm kinda lost on how this works tbh."

AI xem mô tả sản phẩm, dữ liệu cấu trúc, đánh giá…? Nói thật tôi khá mù về cách nó hoạt động.

Kèm: shop đã "sẵn sàng" mà Shopify Catalog vẫn hiện 0 sản phẩm ([Shopify Community](https://community.shopify.com/t/570706), 2026-10-01); xét duyệt Catalog treo "Pending" 4 ngày ([Shopify Community](https://community.shopify.com/t/692248), 2026-10-05).

---

## Bằng chứng ngược

| Bằng chứng | Nguồn |
|---|---|
| Walmart: thanh toán trong ChatGPT chuyển đổi **kém gấp 3** so với web | [HN](https://news.ycombinator.com/item?id=47444812), 2026-03-19, 439 điểm |
| [M] "I didn't clean up any data, and i have been getting consistent sales (like a few hundred dollars) from chat gpt" (không dọn dữ liệu gì vẫn có vài trăm USD từ ChatGPT) | r/shopify 1ucg6bw, 2026-06-23 |
| [M] Shopify nói kênh AI mang về 7.000 USD trong 30 ngày, nhưng app Shop tự nhận 95% số đó | r/shopify 1ucg6bw, 2026-06-22 |
| Nhiều người nói đánh giá và bài nhắc trên Reddit, báo quan trọng hơn thuộc tính trên trang | [Shopify Community](https://community.shopify.com/t/667253) |
| [V/?] "merchants are not ready for extra costs regarding AI search visibility" (chủ shop chưa sẵn sàng trả thêm cho AI) | [Shopify Community](https://community.shopify.com/t/615230), 2026-05-05 |

Tín hiệu tích cực: [M] "conversion has doubled from it. it's wild!" (chuyển đổi tăng gấp đôi, chocolate thủ công); [M] "I've been seeing more and more orders come through directly from ChatGPT" (ngày càng nhiều đơn từ ChatGPT, [r/shopify](https://www.reddit.com/r/shopify/comments/1uly7ub/), 2026-07-02).

---

## Tệp khách hàng

### Số shop theo số sản phẩm

Nguồn: [Store Leads](https://storeleads.app/reports/shopify), dữ liệu 2026-10-02. Tổng 3.103.755 shop; Mỹ 1.186.833 (38,2%); Shopify Plus 80.050.

| Số sản phẩm | Số shop | 💭 Ý nghĩa |
|---|---|---|
| 1–49 | khoảng 1,74 triệu (56%) | Tự sửa tay được, không cần app |
| 50–249 | khoảng 695.000 | Bắt đầu mệt |
| **250–4.999** | **khoảng 435.000** | **Sửa tay không nổi, vẫn trả được 29–99 USD/tháng** |
| 5.000 trở lên | khoảng 48.000 | Thường dùng PIM, agency, dịch vụ lớn (Feedonomics) |

### Ngành nhiều thuộc tính

Thời trang 836.839 shop (27%), nhà cửa và vườn 384.192, làm đẹp 341.100, điện tử 55.438, phụ tùng xe 73.986. Ngành phải khai nhiều thuộc tính: thời trang (size, form, chất liệu), nhà cửa (kích thước, chất liệu), làm đẹp (thành phần, loại da), điện tử (thông số), phụ tùng (lắp vừa xe nào).

### 💭 Đề xuất tệp

| Tệp | Ai | Vì sao |
|---|---|---|
| **Chính** | Shop **ở Mỹ**, **250–5.000 sản phẩm**, ngành nhiều thuộc tính (nhà cửa, thời trang, làm đẹp, linh kiện cần lắp vừa) | Kênh AI chỉ bật ở Mỹ; sửa tay không nổi; trả được tiền; có bằng chứng AI của Shopify chưa đủ. Ước khoảng 170.000 shop (435.000 × 38% ở Mỹ, ước thô) |
| Phụ | **Agency và người quản lý nhiều shop** | Đang dọn dữ liệu bằng tay cho khách, đau vì khối lượng; tính phí theo shop hoặc theo sản phẩm |
| Sau | Shop **UK, EU nhiều ngôn ngữ** | Kênh AI của Shopify chưa mở ở đây; nỗi đau hiện là dữ liệu Google Merchant Center, Google AI Mode |
| Không nhắm | Shop dưới 50 sản phẩm; shop dropship dữ liệu nhà cung cấp quá tệ (có thể nhắm sau) | Tự sửa được, hoặc dữ liệu gốc sai không cứu nổi |

### Họ đang làm gì hôm nay

| Cách làm | Ví dụ |
|---|---|
| Sửa tay từng sản phẩm | Bỏ chọn khoảng 30 thuộc tính Shopify tự chọn sẵn mỗi lần (merchant2010) |
| Dùng Sidekick, Shopify Magic | Lượt đầu, rồi viết lại (agency trên Reddit) |
| Thuê agency, dịch vụ | Feedonomics, agency dọn danh mục |
| Mặc kệ | Vẫn có đơn từ ChatGPT dù không dọn gì |

---

# Phần B: Các nền tảng khác

## WooCommerce

### Bối cảnh: phải tự lắp nhiều mảnh

Shopify bật kênh AI mặc định cho mọi shop ở Mỹ từ 24/03/2026. WooCommerce thì không: kết nối với ChatGPT (qua Stripe) và Google AI (UCP) vẫn ghi **"Coming Soon"** ([woocommerce.com/agentic-commerce](https://woocommerce.com/agentic-commerce/)). Shop WooCommerce tới AI bằng: plugin Google for WooCommerce đồng bộ sang Google Merchant Center, hoặc AI tự đọc trang web.

📖 [r/woocommerce: Is anyone implementing agentic commerce on WooCommerce yet?](https://www.reddit.com/r/woocommerce/comments/1sa3esx/) (2026-04-02)

> "Shopify turned on agentic storefronts by default for every merchant on March 24… On the WooCommerce side, you need a UCP plugin…, a separate ACP plugin…, the developer-preview MCP flag enabled, Yoast schema optimization… That's a lot of moving parts vs. zero"

Shopify bật kênh AI mặc định cho mọi shop từ 24/3… Bên WooCommerce thì cần một plugin UCP, một plugin ACP riêng, bật cờ MCP bản thử nghiệm, tối ưu schema bằng Yoast… Quá nhiều mảnh phải lắp, so với không phải làm gì (bên Shopify).

### Nỗi đau: đồng bộ thuộc tính sang Google bị lỗi

Plugin chính thức Google for WooCommerce: 800.000 lượt cài, điểm **54/100** ([wordpress.org](https://wordpress.org/plugins/google-listings-and-ads/)).

📖 "Google for WooCommerce is not syncing my product attributes correctly. Wrong images in GMC, it's telling me that some attributes (size, color) are missing even though they are not." ([wordpress.org](https://wordpress.org/support/topic/incorrect-sync/), 2025-12-14)

Plugin không đồng bộ đúng thuộc tính sản phẩm. Ảnh sai trên Merchant Center, báo thiếu size, màu trong khi không hề thiếu.

📖 "During integration, data is transferred incorrectly; many fields are not filled in or filled in incorrectly due to the plugin's poor and insufficient interface." ([wordpress.org](https://wordpress.org/support/topic/a-huge-number-of-errors/), 2026-01-11)

Khi đồng bộ, dữ liệu chuyển sai; nhiều trường không được điền hoặc điền sai vì giao diện plugin kém.

📖 "Constant issues with field data mismatches and fields not being passed through the API. Not worth the time and effort." ([wordpress.org](https://wordpress.org/support/topic/field-mismatches/), 2026-03-11)

Liên tục lệch dữ liệu các trường, trường không được gửi qua API. Không đáng thời gian công sức.

Plugin feed Product Feed PRO: 📖 "With every update feed breaks… I have spent hours and hours" (mỗi lần cập nhật là feed hỏng… tôi đã mất hàng giờ liền, [wordpress.org](https://wordpress.org/support/topic/so-many-glitches-its-just-not-worth-my-time-anymore/), 2025-11-19).

### Nỗi đau: làm đủ cách mà AI vẫn không nhắc

📖 [r/woocommerce: Zero brand LLMs visibility after trying everything for SEO](https://www.reddit.com/r/woocommerce/comments/1slysin/) (2026-04-15): "added structured data… when I test ChatGPT or Claude asking 'best x products'… my brand never gets mentioned." Đã thêm dữ liệu cấu trúc… khi thử hỏi ChatGPT, Claude "sản phẩm X tốt nhất", thương hiệu tôi không bao giờ được nhắc. ⚠️ Bài có nhắc tên một nhà bán công cụ, có thể là quảng cáo.

📖 [r/woocommerce](https://www.reddit.com/r/woocommerce/comments/1q83uz5/) (2026-01-09): "How do you make your sites show up in AI searches like ChatGPT? Structured content, FAQs, wording, or something else?" Làm sao để web hiện trong tìm kiếm AI? Nội dung có cấu trúc, FAQ, cách viết, hay cái gì khác?

### Tệp WooCommerce

| | Số liệu ([Store Leads](https://storeleads.app/reports/woocommerce), 2026-10-02) |
|---|---|
| Tổng shop | 3.998.457 |
| Mỹ | 500.005 |
| UK | 177.054 |
| Đức | 115.088 |
| Ý | 105.216 |
| Pháp | 93.693 |

💭 Shop WooCommerce **nghiêng về UK, EU** hơn Shopify. Store Leads nhận xét giá trị trung bình mỗi shop Shopify cao hơn nhiều so với WooCommerce. Tệp nên nhắm: shop WooCommerce **nhiều sản phẩm, đang chạy Google Shopping**, đang vật lộn với lỗi thuộc tính.

## Wix

Diễn đàn Wix Studio có các câu hỏi về llms.txt, chặn bot AI ([forum.wixstudio.com](https://forum.wixstudio.com/t/how-to-add-a-llms-txt-to-my-wix-website/71520), 2025-06-14; [chặn bot AI](https://forum.wixstudio.com/t/big-issue-blocking-ai-bot-crawlers-in-wix/73024), 2025-08-25). Nhưng Wix đã tự làm llms.txt, schema có chính sách đổi trả. Chưa thu được bài nào trên Reddit (bị giới hạn tốc độ).

Số shop: 966.810, Mỹ 424.887, UK 99.440 ([Store Leads](https://storeleads.app/reports/wix)).

## 💭 Tổng hợp tệp theo nền tảng

| Nền tảng | Tệp chính | Nỗi đau rõ nhất |
|---|---|---|
| WooCommerce | Shop nhiều sản phẩm, chạy Google Shopping, UK, EU, Mỹ | Lỗi thuộc tính khi đồng bộ; phải tự lắp nhiều mảnh để tới AI |
| Shopify | Shop Mỹ 250–5.000 sản phẩm, ngành nhiều thuộc tính | AI nói sai; điền thuộc tính hàng nghìn sản phẩm |
| Wix | Shop nhỏ, ít kỹ thuật | Không biết bắt đầu từ đâu |
| Agency (mọi nền tảng) | Agency quản lý nhiều shop | Dọn dữ liệu bằng tay cho khách |
