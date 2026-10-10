# 05 – Rủi ro và câu hỏi cần kiểm chứng

Thuộc [[00 - Tổng quan]]. 💭 = nhận định AI.

## 1. Rủi ro

| # | Rủi ro | Mức | Bằng chứng | Cách giảm |
|---|---|---|---|---|
| 1 | **Shopify tự làm nốt** (thêm chấm thuộc tính theo danh mục, Sidekick điền hàng loạt) | Cao | Shopify đã có điểm chất lượng sản phẩm, Knowledge Base, llms.txt, AI tự bổ sung thuộc tính. Người đánh giá Knowledge Base: "Shopify is already building most of this" | Đứng ở chỗ Shopify ít làm: độ tin cậy, có nguồn, đa ngôn ngữ, câu hỏi theo ngành |
| 2 | **Thị trường đông** | Cao | Ít nhất 15 app ra mắt 02–09/2026; Verity Score gần y tính năng thử hỏi | Định vị hẹp; một ngành trước |
| 3 | **Chủ shop chưa chịu trả tiền** | Cao | "merchants are not ready for extra costs regarding AI search visibility"; nhiều shop chọn app miễn phí | Kiểm chứng bằng bán trước, trước khi viết nhiều code |
| 4 | **Traffic AI còn nhỏ** | Vừa | Walmart: chuyển đổi trong ChatGPT kém gấp 3; chủ shop không dọn gì vẫn có đơn | Bán bằng "AI nói đúng, giảm đơn sai, trả hàng", không bán bằng traffic |
| 5 | **Chưa chứng minh được thuộc tính đầy đủ giúp được AI chọn** | Vừa | Shopify chỉ nói Catalog chuyển đổi gấp đôi so với dữ liệu cào web; Catalog chỉ lọc theo Màu, Size, Giới tính; Google nói không cần tối ưu đặc biệt | Không hứa xếp hạng |
| 6 | **Chỉ ở Mỹ** | Vừa | Agentic Storefronts chưa mở nước khác | Bắt đầu ở Mỹ; UK, EU nhắm Google Merchant Center |
| 7 | **Giới hạn kỹ thuật** | Vừa | Chưa chắc ghi được category metafield, chính sách, FAQ Knowledge Base qua API | Thử trên dev store **trước khi làm** |
| 8 | **Chi phí AI ăn lãi** | Vừa | Đối thủ bán 0,2–1 cent mỗi sản phẩm | Dùng mô hình rẻ; chỉ quét lại sản phẩm thay đổi |
| 9 | **Hợp đồng công ty** | Chưa biết | App Shopify, cùng hệ sinh thái với Joy | Anh đọc hợp đồng trước tiên |
| 10 | Dữ liệu nguồn của shop quá tệ (dropship) | Thấp | Chủ shop than dữ liệu nhà cung cấp sai | Không nhắm tệp này lúc đầu |
| 11 | **Shop WooCommerce trả ít hơn** | Cao | Store Leads: giá trị trung bình mỗi shop Shopify cao hơn nhiều; văn hoá plugin miễn phí | Plugin miễn phí cho phần kiểm tra; thu tiền phần AI bổ sung theo lượng sản phẩm |
| 12 | **Yoast, Rank Math, AIOSEO thêm tính năng tương tự** | Vừa | Đều đã gắn nhãn "AI visibility", hàng triệu lượt cài | Tập trung vào thuộc tính sản phẩm, không làm SEO chung |
| 13 | **WooCommerce, Stripe ra mắt kết nối AI làm sẵn** | Vừa | Stripe ACS, UCP đang "sắp có" | Kết nối chỉ là đường ống; chất lượng dữ liệu vẫn là việc của shop. Khi kết nối ra mắt, nhu cầu dữ liệu sạch còn tăng |
| 14 | **Gánh nặng hỗ trợ trên WordPress** | Vừa | Plugin feed bị chê hỏng sau mỗi lần cập nhật; đủ loại host, theme, plugin xung đột | Plugin PHP thật mỏng, xử lý ở lõi; thử với Yoast, Rank Math trước |
| 15 | Phải viết PHP | Thấp | Anh quen JS | Chỉ phần kết nối, phần còn lại JS |
| 16 | Kết nối AI của WooCommerce chưa ra, nỗi đau "AI nói sai" chưa rõ bằng Shopify | Vừa | Hiện shop WooCommerce chủ yếu tới AI qua Google, AI đọc trang | Bán bằng nỗi đau đang có: lỗi thuộc tính khi đồng bộ Google, schema thiếu |

## 2. Câu hỏi cần kiểm chứng

| # | Câu hỏi | Kiểm chứng thế nào | Ai làm |
|---|---|---|---|
| 1 | Hợp đồng có cấm làm app Shopify riêng không? | Đọc hợp đồng, hỏi HR nếu cần | Anh |
| 2 | Có ghi được category metafield qua API không, đúng định dạng metaobject chuẩn? | Thử trên dev store | Anh hoặc AI |
| 3 | App có đọc, ghi được chính sách, FAQ Knowledge Base không? | Đọc tài liệu Admin API, thử | Anh hoặc AI |
| 4 | Thuộc tính đầy đủ có làm sản phẩm hiện tốt hơn trong xem trước tìm kiếm của Shopify Catalog không? | Thử trên dev store: so trước và sau khi điền thuộc tính, dùng phần xem trước trong Admin → Agentic | Anh |
| 5 | Chủ shop có chịu trả 29–79 USD/tháng không? | Nói chuyện 5–10 chủ shop ([[13 - How to Talk to Users]]), hỏi họ đang làm gì, tốn bao nhiêu thời gian, đã trả cho cái gì. Không hỏi "có mua không" | Anh |
| 6 | Verity Score, AgentIQ đang có bao nhiêu khách, khách chê gì? | Theo dõi đánh giá mới; thử cài bản miễn phí | AI |
| 7 | Ngành nào đau nhất, nên làm trước? | Hỏi 5–10 chủ shop; đọc thêm Shopify Community | Anh hoặc AI |
| 8 | Agency có chịu trả theo số shop không? | Nói chuyện 3 agency | Anh |
| 9 | Chi phí AI thật cho một shop 2.000 sản phẩm là bao nhiêu? | Chạy thử trên dữ liệu mẫu | AI |
| 10 | Bắt đầu từ nền tảng nào? | So bảng trong [[00 - Tổng quan]]; hỏi chủ shop WooCommerce và Shopify | Anh |
| 11 | Shop WooCommerce có trả tiền cho việc này không, bao nhiêu? | Nói chuyện chủ shop WooCommerce chạy Google Shopping; xem họ đang trả cho plugin feed, SEO bao nhiêu | Anh |
| 12 | Bổ sung schema đổi trả, giao hàng, thuộc tính vào WooCommerce có xung đột với Yoast, Rank Math không? | Thử trên site WordPress thử nghiệm | Anh hoặc AI |
| 13 | Bao giờ WooCommerce, Stripe mở kết nối ChatGPT? Khi đó cần dữ liệu gì? | Theo dõi trang woocommerce.com/agentic-commerce, tài liệu Stripe ACS | AI |

## 3. Khi nào nên dừng

💭 Đặt trước để không làm theo quán tính:

| Tín hiệu dừng | Lý do |
|---|---|
| Hợp đồng công ty cấm | — |
| Không ghi được category metafield, chính sách qua API | Mất phần cốt lõi |
| Nói chuyện 10 chủ shop mà không ai coi đây là vấn đề top 3 | Không đủ đau |
| Shopify công bố chấm, điền thuộc tính hàng loạt theo danh mục | Mất chỗ đứng chính |
| Bản đầu có 10 shop cài, không shop nào duyệt đề xuất | Không có giá trị |

## 4. Thứ tự việc tiếp theo

1. Anh chọn nền tảng khởi đầu (câu 10). Nếu có Shopify thì đọc hợp đồng công ty trước.
2. Thử kỹ thuật trên nền tảng đã chọn: WooCommerce (câu 12) hoặc Shopify dev store (câu 2, 3, 4).
3. Nói chuyện 5–10 chủ shop của nền tảng đó, 3 agency (câu 5, 7, 8, 11).
4. Đủ tín hiệu thì làm bản đầu tiên ([[04 - Giải pháp và nghiệp vụ]] mục 6), lõi viết chung để sau thêm nền tảng khác.
