# 00 – Tổng quan: App AI-ready cho cửa hàng online

> ⛔ **ĐÃ DỪNG (2026-10-10).** Lý do: ý tưởng không đủ mới. Đây là một nhánh của GEO/AEO (tối ưu để AI trích dẫn, giới thiệu), mảng đã nổi tiếng và đông: Profound, Peec; trên Shopify có ít nhất 15 app mới năm 2026 và Shopify tự làm; trên WooCommerce có Yoast, Rank Math, AIOSEO gắn nhãn AI. Phần khác biệt (không bịa, có nguồn, kiểm thuộc tính theo ngành) chỉ là tính năng, nền tảng hoặc plugin lớn dễ thêm vào; không có hào chắn. Giữ folder làm tài liệu tham khảo.

Đi ra từ [[08 - Xu thế tương lai ra sản phẩm]] (ứng viên số 1). Chốt ngày 2026-10-10. Ban đầu chỉ nhắm Shopify, sau đổi sang **nhiều nền tảng**: Shopify chỉ là một trong nhiều nơi có shop, và là nơi khó vào nhất.

> 📖 = trích nguồn. 💭 = nhận định AI. ⚠️ = chưa mở được trang gốc hoặc chưa kiểm tra.
>
> ⚠️ Câu trích trong folder này lấy qua agent (đọc thẳng trang chợ app, tài liệu nền tảng, OpenAI, Google, Stripe, diễn đàn, Reddit RSS), **chưa đối chiếu lại từng câu**. Hạn mức tìm kiếm web của phiên đã hết.

## App là gì

Công cụ giúp chủ shop online **sửa và bổ sung dữ liệu của chính shop mình** (thuộc tính sản phẩm, danh mục, chính sách, dữ liệu cấu trúc) để các AI như ChatGPT, Gemini, Copilot, Perplexity **hiểu đúng và trả lời đúng** về sản phẩm.

Một câu chính xác: **"Giúp shop có dữ liệu đầy đủ và đúng, để AI trả lời được và trả lời đúng về sản phẩm, từ đó có cơ hội được giới thiệu nhiều hơn."**

| App làm được | App không làm được |
|---|---|
| Đảm bảo AI có đủ thông tin đúng về sản phẩm | Hứa "AI giới thiệu shop nhiều hơn X%" |
| Đo "AI trả lời đúng bao nhiêu câu khách hay hỏi", chỉ dùng dữ liệu shop | Đo shop được ChatGPT nhắc bao nhiêu lần (không có dữ liệu thật) |

## Đã chốt

| Quyết định | Lý do |
|---|---|
| Bỏ phần đo "AI nhắc shop bao nhiêu lần" | Không lấy được dữ liệu thật |
| Chỉ làm phần cải thiện dữ liệu shop | Chỉ cần dữ liệu của shop, đọc và sửa được qua API nền tảng |
| Bán bằng "AI trả lời đúng", không hứa tăng đơn | Không ai biết AI xếp hạng thế nào |
| **Nhiều nền tảng**: lõi dùng chung, mỗi nền tảng một lớp kết nối | Shop có ở khắp nơi; Shopify đông đối thủ và tự làm nhiều nhất |

## Kiến trúc: lõi dùng chung, kết nối riêng

```
            ┌──────────────────────────────────────┐
            │ LÕI DÙNG CHUNG (viết một lần)        │
            │ - Danh sách thuộc tính theo ngành    │
            │ - Bộ câu hỏi khách hay hỏi           │
            │ - AI rút thuộc tính có nguồn         │
            │ - Thử hỏi, chấm điểm, kiểm chính sách │
            └──────────────────────────────────────┘
               ▲           ▲           ▲          ▲
          WooCommerce   Shopify       Wix     Bản web: dán link
           (plugin)    (app)        (app)    hoặc tải feed
```

## Phát hiện chính

| Nền tảng | Số shop | Nền tảng đã tự làm cho AI | Đối thủ "AI-ready" | 💭 Khoảng trống |
|---|---|---|---|---|
| **WooCommerce** | **khoảng 4,0 triệu** (Mỹ khoảng 0,5 triệu, mạnh ở UK, EU) | Rất ít: kết nối ChatGPT, Google AI vẫn "sắp có"; dữ liệu cấu trúc mặc định **thiếu chính sách đổi trả, giao hàng, thuộc tính** | Plugin SEO lớn gắn nhãn "AI"; plugin agent chỉ 10–60 lượt cài; **không có công cụ kiểm tra độ đầy đủ dữ liệu** | **Lớn nhất** |
| Shopify | 3,1 triệu (Mỹ 1,19 triệu) | **Nhiều nhất**: tự đưa sang ChatGPT, Copilot, Google; llms.txt; Knowledge Base; AI tự bổ sung thuộc tính | **Ít nhất 15 app** ra mắt 2026 | Nhỏ tới vừa |
| Wix | 967.000 (Mỹ 425.000) | Nhiều: schema có đổi trả, llms.txt, đo lượt AI nhắc | Khoảng 10 app mới, hầu hết 0 đánh giá | Vừa |
| Squarespace | 392.000 | Có đo lượt AI nhắc | Ít | Nhỏ (ít shop nhiều sản phẩm) |
| BigCommerce | 36.000 | **Tự bán** bổ sung dữ liệu (Feedonomics, Catalog Enrichment) | Vài app | Nhỏ |
| Magento | 101.000 | Ít | Có (chưa xem tên) | Lớn nhưng bán qua agency, chu kỳ dài |
| PrestaShop, Shopware | 147.000, 30.000 | Ít; Shopware có bản beta chính thức bị chê lỗi | Chưa xem | Ngách EU |

💭 **Shopify là nơi khó vào nhất** vì Shopify tự làm nhiều và đối thủ đông. **WooCommerce có khoảng trống lớn nhất**: nhiều shop nhất, nền tảng tự làm ít nhất, chưa có đối thủ đúng mảng.

## 💭 Lựa chọn nền tảng khởi đầu (anh tự quyết)

| Lựa chọn | Ưu | Nhược |
|---|---|---|
| **WooCommerce trước** | Nhiều shop nhất; khoảng trống lớn nhất; chưa có đối thủ đúng mảng; chủ shop đang than lỗi thuộc tính khi đồng bộ Google | Chủ shop quen miễn phí, trả ít hơn Shopify; plugin phải viết bằng **PHP** (phần lõi vẫn JS, Firebase); hỗ trợ nhiều host, theme; Yoast, Rank Math có thể thêm tính năng |
| Shopify trước | Anh thạo nhất; chủ shop trả tiền tốt nhất | Đông đối thủ; Shopify tự làm; đụng hệ sinh thái Joy |
| Wix trước | Năm đầu Wix không lấy phí; đối thủ chưa có đánh giá; app viết bằng JS | Wix tự làm khá nhiều; chủ shop ít chuyên nghiệp hơn |
| Bản web độc lập | Dùng cho mọi shop | Không có chợ app để tìm khách |

## Đọc theo thứ tự

| # | Note | Trả lời câu hỏi |
|---|---|---|
| 1 | [[01 - Vấn đề và tệp khách hàng]] | Chủ shop đau gì, đánh vào tệp nào, theo từng nền tảng |
| 2 | [[02 - Thị trường và cách AI đọc dữ liệu]] | Quy mô từng nền tảng, AI lấy dữ liệu shop từ đâu, nền tảng nào đã tự làm gì |
| 3 | [[03 - Đối thủ]] | Đối thủ trên từng chợ app, tính năng, bị chê gì, còn trống chỗ nào |
| 4 | [[04 - Giải pháp và nghiệp vụ]] | Tính năng, luồng sử dụng, quy tắc nghiệp vụ, kiến trúc nhiều nền tảng, bản đầu tiên, giá |
| 5 | [[05 - Rủi ro và câu hỏi cần kiểm chứng]] | Cái gì chưa chắc, kiểm chứng thế nào, khi nào nên dừng |

## Việc anh phải tự quyết

1. **Nền tảng khởi đầu** (bảng trên).
2. **Hợp đồng ở công ty**: nếu có Shopify trong kế hoạch thì cùng hệ sinh thái với Joy.
3. Note Goal ở [[Ý tưởng app - Goal]] đang ghi "không gắn Shopify". Nếu bắt đầu bằng WooCommerce hoặc Wix thì vẫn đúng tinh thần đó.
