# 08 – Xu thế tương lai ra sản phẩm

Thuộc [[Ý tưởng app - Goal]]. [[07 - Ngách theo thị trường]] đi từ **vấn đề hôm nay** (lỗi đồng bộ, luật EU…), nhưng những vấn đề đó phần lớn đã có người giải, hoặc cần chuyên môn sâu và gánh trách nhiệm lớn. Note này đi ngược lại: **nhìn thế giới sẽ dịch chuyển đi đâu 2026–2035, rồi hỏi cái gì bắt buộc phải có xung quanh sự dịch chuyển đó**.

> 📖 = trích nguồn. 💭 = nhận định AI. ⚠️ = chưa mở được trang gốc, hoặc chỉ thấy tiêu đề. Nguồn đọc ngày 2026-10-10.
>
> ⚠️ Khác note 07: câu trích trong note này **lấy qua agent, chưa đối chiếu lại từng câu**. Hạn mức tìm kiếm web đã hết, nên agent đọc thẳng trang đã biết địa chỉ, Hacker News và Reddit RSS. Nhiều nguồn lớn (Gartner, McKinsey, IEA, Euromonitor) không mở được.

## Khung phân tích

Mỗi xu thế đi theo 5 bước:

1. **Dự báo**: thế giới dịch chuyển đi đâu, có số liệu và mốc năm.
2. **Tín hiệu hôm nay**: người dùng sớm đang làm gì, đang vướng gì. Có bước này thì không chỉ là đoán.
3. **Cái phải có xung quanh**: khi xu thế xảy ra, cần thêm những thứ gì.
4. **Ai đã làm**: nền tảng lớn, startup, mức đông.
5. **Chỗ còn trống → sản phẩm**: kèm thời điểm, mức trách nhiệm, độ khớp với anh.

---

## Nguyên lý rút ra: lõi thuộc về nền tảng, chỗ trống nằm ở rìa

💭 Ở gần như mọi xu thế, **phần lõi rơi vào tay nền tảng lớn**:

| Xu thế | Phần lõi | Ai chiếm |
|---|---|---|
| Agent mua hàng | Danh mục, giỏ hàng, thanh toán cho agent | Shopify + Google (UCP), OpenAI + Stripe (ACP), Google (AP2) |
| Agent tiêu tiền | Ví, token thanh toán, danh tính agent | Visa, Mastercard, Stripe, Cloudflare |
| Hạ tầng MCP | Hosting, xác thực, thanh toán theo lượt gọi | Cloudflare, chuẩn MCP tự làm |
| Trợ lý AI cá nhân | Trí nhớ, kết nối dữ liệu, agent tự làm việc | OpenAI, Google, Apple, Meta, Amazon |
| Bằng chứng nội dung thật | Ký số ảnh, xác minh người thật | Google, Adobe, World ID |

**Chỗ cho nhóm nhỏ nằm ở rìa**, nơi nền tảng không đi được vì mô hình kinh doanh của họ:

| Chỗ nền tảng không đi được | Vì sao | Bằng chứng |
|---|---|---|
| **Trung lập giữa các nền tảng** | Mỗi bên chỉ lo phần của mình, muốn giữ người dùng | Claude cho nhập trí nhớ, không ai cho xuất ra. Mỗi hãng chỉ kiểm thử MCP trên client của mình. Amazon chặn agent của Meta mua hàng |
| **Nhiều người, hộ gia đình** | Tài khoản thiết kế cho từng cá nhân | 📖 "Apple doesn't think of families as a product category. They think of them as a collection of individual customers who happen to share a payment method." ([taoofmac](https://taoofmac.com), 2026-05-14). Apple không coi gia đình là một loại sản phẩm, mà là nhiều khách lẻ dùng chung một phương thức thanh toán |
| **Đo lường, kiểm chứng** | Nền tảng không có động cơ báo cáo trung thực về mình | Startup YC Sitefire tự nhận số liệu traffic từ AI chỉ là "mức sàn" |
| **Theo ngành, theo chợ app** | Nền tảng làm cho số đông | Shopify, Atlassian, Xero, Firebase |

---

## Xu thế 1: Phần mềm mà người dùng là AI agent

### Dự báo

| Chỉ số | Số liệu | Nguồn |
|---|---|---|
| Lượt tải SDK MCP mỗi tuần | **65,4 triệu** (10/2026), gấp **9,3 lần** năm trước (7 triệu) | npm API, 2026-10-10 |
| Số máy chủ trong MCP Registry chính thức | **41.432** (gồm cả rác, trùng) | registry.modelcontextprotocol.io, 2026-10-10 |
| SDK A2A (agent nói chuyện với agent) | 3,8 triệu lượt tải/tuần | npm API |
| Gartner | 40% app doanh nghiệp có agent riêng cho từng việc vào 2026, từ dưới 5% năm 2025 ⚠️ | Gartner 2025-08-26 (chỉ thấy tiêu đề) |
| Gartner | **Hơn 40% dự án agent sẽ bị huỷ trước cuối 2027** ⚠️ | Gartner 2025-06-25 (tiêu đề) |

💭 Agent sẽ có mặt trong hầu hết phần mềm, nhưng nhiều dự án thất bại. Nhu cầu thật là **kiểm soát, chất lượng, quan sát được agent làm gì**, không phải thêm agent.

### Tín hiệu hôm nay

Lập trình viên làm máy chủ MCP than (Hacker News):

📖 "MCP servers have been the hardest part to create adapters for. For a two year old spec, there's far too many permutations." ([HN](https://news.ycombinator.com/item?id=49559823), 2026-09-04, chủ đề 198 điểm, 201 bình luận)

Máy chủ MCP là phần khó viết bộ chuyển đổi nhất. Chuẩn mới 2 năm tuổi mà có quá nhiều biến thể.

📖 "token costs vary 440x (GitHub official: 20,444 tokens; sqlite: 46). 100% have at least one quality issue." ([HN](https://news.ycombinator.com/item?id=47488461), 2026-03-23)

Chi phí token chênh nhau 440 lần (máy chủ GitHub chính thức 20.444 token, sqlite 46 token). 100% máy chủ có ít nhất một lỗi chất lượng.

📖 "we have so many problems with MCP related to auth, scopes etc" ([HN](https://news.ycombinator.com/item?id=48763424), 2026-07-02)

Chúng tôi gặp rất nhiều vấn đề với MCP về xác thực, phạm vi quyền.

📖 "it's pretty much a standard request from our clients now: that they are able to use their chatbot to interact with the ERP systems." ([HN](https://news.ycombinator.com/item?id=49561896), 2026-09-04)

Giờ gần như khách nào cũng yêu cầu: dùng chatbot của họ để thao tác với hệ thống ERP.

Chính tài liệu lộ trình MCP thừa nhận: 📖 "A server developer today has no way to know which form a given client will put in front of the model." ([MCP roadmap](https://blog.modelcontextprotocol.io/posts/mcp-roadmap/), 2026-08-22). Người viết máy chủ hiện không có cách biết mỗi client sẽ đưa kết quả cho mô hình ở dạng nào.

Repo chuẩn MCP có issue đang mở xin đúng thứ này: [SEP-1814 "Caniuse-style Compatibility Matrix for MCP Clients"](https://github.com/modelcontextprotocol/modelcontextprotocol/issues/1814) (bảng tương thích giữa các client MCP, mở từ 2025-11-14).

### Cái phải có xung quanh

| Thứ cần có | Ai đã làm | Đông? |
|---|---|---|
| Tài liệu, trang web cho agent đọc (llms.txt, WebMCP) | Cloudflare, Chrome, Mintlify | Vừa, chuẩn còn đang hình thành |
| Biến API thành MCP và hosting | Cloudflare, Manufact (YC), Metorial (YC) | **Đông** |
| Xác thực, phân quyền cho agent | Chuẩn MCP tự làm (06/2026), nhiều startup YC | **Đông** |
| Thanh toán theo lượt gọi | Cloudflare (x402), Stripe, OpenAI, Google, Shopify | **Nền tảng chiếm** |
| Danh bạ máy chủ MCP | Registry chính thức, Smithery | Đông, nhưng **chấm chất lượng còn thưa** |
| Quan sát, đánh giá, chi phí | Armature (YC), HyprMCP | Vừa, đang tăng |
| **Kiểm thử một máy chủ trên nhiều client** | MCP Inspector (miễn phí, chỉ một client) | **Thưa** |
| Bảo mật (mã độc trong máy chủ, tấn công qua prompt) | Cisco, nhiều startup | Vừa tới đông |

### Sản phẩm

| Sản phẩm | Làm gì | Người trả | Thời điểm | Trách nhiệm | 💭 Rủi ro |
|---|---|---|---|---|---|
| **canimcp** | GitHub Action + bảng điều khiển: chạy máy chủ MCP trên hành vi thật của Claude, ChatGPT, Cursor, Copilot; bắt lỗi schema, lỗi truyền tải; chấm chi phí token và chất lượng mô tả; cấp huy hiệu công khai | Công ty SaaS có máy chủ MCP | Bây giờ | Thấp | Chuẩn thay đổi liên tục, phải bám sát; khó thu tiền từ dev |
| Danh bạ có chấm điểm cho một ngành | Danh bạ máy chủ MCP của một ngành (ví dụ thương mại điện tử), tự kiểm tra sức khoẻ, chi phí token, client nào chạy được | Phí xác minh từ hãng | Bây giờ, có thể đóng cửa 2027 | Thấp | Registry chính thức thêm dữ liệu chất lượng |
| Cổng MCP có duyệt cho một chợ app | Cho admin chọn đúng vài thao tác mở cho agent, mỗi lệnh ghi có người duyệt, có nhật ký, có hạn mức | Admin doanh nghiệp nhỏ | 2026–2027 | Vừa | Cloudflare, các cổng doanh nghiệp |

---

## Xu thế 2: Agent đi mua hàng thay người

### Dự báo (⚠️ phần lớn qua bài viết lại)

| Chỉ số | Số liệu | Nguồn |
|---|---|---|
| McKinsey | Đến 1.000 tỷ USD doanh thu bán lẻ Mỹ do agent điều phối vào 2030 | McKinsey 10/2025 ⚠️ |
| Morgan Stanley | Agent chiếm 10–20% chi tiêu thương mại điện tử Mỹ vào 2030 | [[01 - Hiện tại]] nguồn 8 |
| Adobe | Traffic từ AI vào web bán lẻ Mỹ +62% (07/2026), chuyển đổi cao hơn 60% | [[07.1 - Lane 1 - Thương mại điện tử]] |
| Anthropic | Shop dùng agent mua sắm trên Claude: giỏ hàng lớn hơn tới 35% (số của nhà bán) | [claude.com](https://claude.com/blog/claude-for-commerce-agents), 2026-09-02 |

### Tín hiệu ngược (phải để ý)

- OpenAI thu hẹp Instant Checkout (03/2026); tỷ lệ mua trong ChatGPT thấp ⚠️.
- eBay cấm agent tự đặt hàng không qua người duyệt (hiệu lực 2026-02-20). Chủ đề trên HN 340 điểm, 352 bình luận.
- Amazon chặn agent Muse của Meta mua hàng trên amazon.com (2026-09).
- 📖 "I cannot get myself to give one of these things access to my bank account or allow it to do price comparsion and shopping without oversight." ([HN](https://news.ycombinator.com/item?id=49978280), 2026-10-06). Tôi không thể để mấy thứ này vào tài khoản ngân hàng, hay tự so giá và mua mà không có ai giám sát.

### Cái phải có xung quanh

| Phía | Thứ cần có | Ai đã làm |
|---|---|---|
| Người bán | Danh mục, giỏ hàng, thanh toán cho agent | **Shopify làm sẵn** (UCP: Catalog, Cart, Checkout MCP) |
| Người bán | Dữ liệu sản phẩm, chính sách rõ để agent chọn đúng | Shop tự làm, app feed và SEO đang chuyển hướng |
| Người bán | Đo agent "nhìn" shop mình thế nào, doanh số từ AI | Ít, phần lớn nhắm doanh nghiệp lớn |
| Người mua | Hạn mức, duyệt trước, nhật ký agent đã mua gì | Mỗi nền tảng làm cho agent của mình |
| Người mua | Gỡ khi agent mua sai, khiếu nại | Chưa rõ, có chủ đề "The AI Chargeback Apocalypse" trên r/shopify ⚠️ |

### Sản phẩm

| Sản phẩm | Làm gì | Người trả | Thời điểm | Trách nhiệm | 💭 Rủi ro |
|---|---|---|---|---|---|
| **Agent Shelf** (app Shopify) | Kiểm tra agent (Shopify Catalog, ChatGPT, Gemini, Perplexity) đọc sản phẩm và chính sách của shop thế nào; sửa chỗ thiếu; chạy agent thử định kỳ xem shop có được giới thiệu không; đo doanh số đến từ AI | Chủ shop, 19–99 USD/tháng | Bây giờ | Thấp | Shopify có thể tự làm điểm "sẵn sàng cho agent"; mảng đo AI đã đông (xem xu thế 4). Gần ý Feed Guard ở note 07 |
| **Agent Inbox** | Một chỗ cho mọi agent gửi yêu cầu "duyệt mua / gửi mail / đặt chỗ"; hạn mức, danh sách cho phép, tóm tắt hằng tuần "agent đã làm gì" | Người dùng nhiều agent, 10 USD/tháng; sau là gia đình | 2027 | Vừa (gần thanh toán, không giữ tiền) | Mỗi nền tảng tự làm phần duyệt cho agent của mình |

---

## Xu thế 3: Ai cũng có trợ lý AI riêng

### Dự báo

| Chỉ số | Số liệu | Nguồn |
|---|---|---|
| ChatGPT | Hơn 800 triệu người dùng mỗi tuần | TechCrunch 2025-10-06 |
| Dùng ngoài công việc | Hơn 70% lượng dùng ChatGPT | NBER w34255, 09/2025 |
| Người Mỹ dùng AI | 61%, 19% dùng hằng ngày; chỉ 3% trả tiền | Menlo Ventures 2025-06-26 |
| Việc đời sống giao cho AI | Email 19%, việc cần làm 18%, lên thực đơn 16%, chi tiêu 15% | Menlo Ventures |
| Nền tảng 2026 | Siri dùng Gemini; OpenAI "Dots" (agent chạy liên tục); Meta "Muse"; Alexa+ | HN, OpenAI DevDay 2026-09-29 |

### Tín hiệu hôm nay

📖 "Take a picture of my son's printed basketball calendar and add it to my shared iCloud family calendar. Apple/Siri couldn't do it, Claude couldn't do it. Things STILL can't talk to each other, seemingly intentionally… 20 minutes later she was done adding each event manually." ([HN](https://news.ycombinator.com/item?id=49616884), 2026-09-08)

Chụp lịch bóng rổ in giấy của con rồi thêm vào lịch iCloud chung của gia đình. Siri không làm được, Claude không làm được. Các thứ VẪN không nói chuyện được với nhau, có vẻ là cố ý… 20 phút sau vợ tôi mới nhập tay xong từng sự kiện.

📖 "I want to give it access to my bank account to track my budget, and my email… Nether service has a way to configure fine-grained access for a secondary user." ([HN](https://news.ycombinator.com/item?id=49906345), 2026-09-30)

Tôi muốn cho nó vào tài khoản ngân hàng để theo dõi ngân sách, và vào email… Không dịch vụ nào cho cấp quyền giới hạn cho người dùng phụ.

📖 "It's very helpful until it scales with time, at which point it becomes useless due to staleness or mis-application across contexts." ([HN](https://news.ycombinator.com/item?id=49513521), 2026-08-31, nói về trí nhớ của AI)

Trí nhớ rất hữu ích cho tới khi nó tích nhiều theo thời gian, lúc đó thành vô dụng vì cũ và bị áp sai ngữ cảnh.

📖 "PSA: Export your ChatGPT conversations before cancelling" ([HN](https://news.ycombinator.com/item?id=47196697), 2026-02-28). Nhắc nhau: xuất hết hội thoại ChatGPT trước khi huỷ.

Alexa+ bị chê: r/alexa có các bài "After a decade of Alexa in my home, I'm Done." (2026-09-14) ⚠️ chỉ thấy tiêu đề.

### Cái phải có xung quanh

| Thứ cần có | Ai đã làm | Đông? |
|---|---|---|
| Trí nhớ chung chung | ChatGPT, Claude, Gemini đều có | Nền tảng chiếm |
| **Trí nhớ của mình, xuất ra được, sửa được, mang qua lại** | Basic Memory, Core, Stash, Mem0 (đều cho dev) | Đông với dev, **thưa với người thường** |
| **Agent chung cho cả hộ gia đình** (nhiều hệ: iPhone, Android, ông bà dùng điện thoại thường) | Alexa+ (khoá trong Amazon, bị chê) | **Thưa** |
| Trợ lý cho người không dùng app (SMS, gọi điện) | Dự án mã nguồn mở nhỏ (FortyOne, Coco) | Vừa |
| Hộp duyệt việc agent xin làm | Pizza Bot, Agent.email (cho dev) | Sớm |

### Sản phẩm

| Sản phẩm | Làm gì | Người trả | Thời điểm | Trách nhiệm | 💭 Rủi ro |
|---|---|---|---|---|---|
| **Family Ops** | "Bộ não" chung cho cả nhà: lịch, giấy tờ trường, đi chợ, việc nhà, đưa đón. Mỗi người dùng kênh quen: iMessage/SMS, WhatsApp, email. Chụp lịch → tự vào lịch iCloud lẫn Google | Bố mẹ có con 6–17 tuổi, 8–15 USD/tháng mỗi nhà | Bây giờ | Thấp | Chi phí và luật WhatsApp Business API; Apple làm "Siri cho gia đình" (ít khả năng) |
| **Context Passport** | Nhập bản xuất từ ChatGPT, Claude, Gemini → hồ sơ đọc được, sửa được (sở thích, người quen, dự án), mỗi dữ kiện có hạn dùng → đẩy ngược ra các trợ lý | Người dùng nhiều trợ lý, người chuyển nhà cung cấp; 5 USD/tháng hoặc trả một lần | Bây giờ – 2027 | Thấp | OpenAI, Google cho xuất trí nhớ thật; "Sign in with ChatGPT" thành đường ống ngữ cảnh mặc định |
| Trợ lý qua điện thoại cho người già, con cái quản lý | Người già chỉ cần gọi hoặc nhắn một số: nhắc việc, hôm nay có gì, chuyển lời cho con, đọc thư đã chụp. Con cái chỉnh trên web, nhận tóm tắt hằng ngày. Không tư vấn y tế | Con cái, 15–30 USD/tháng | Bây giờ | Vừa (người dễ tổn thương) | Chi phí và độ ổn định của gọi thoại |

---

## Xu thế 4: AI thay Google tìm kiếm

### Dự báo

| Chỉ số | Số liệu | Nguồn |
|---|---|---|
| Tỷ lệ bấm link khi có AI tóm tắt | **8%**, so với 15% khi không có | [Pew](https://www.pewresearch.org/short-reads/2025/07/22/google-users-are-less-likely-to-click-on-links-when-an-ai-summary-appears-in-the-results/), 2025-07-22 (900 người, 68.879 lượt tìm) |
| Tỷ lệ bấm kết quả đầu | Giảm 34,5% khi có AI Overview | [Ahrefs](https://ahrefs.com/blog/ai-overviews-reduce-clicks/), 2025-04-17 |
| Tìm tin không bấm link | Từ 56% lên gần 69% | Similarweb qua CJR, 08/2025 |
| Healthline | Mất 48% lượng đọc trong một năm | Press Gazette 2026-05-14 |
| Gartner | Lượng tìm kiếm giảm 25% vào 2026 ⚠️ | Gartner 2024-02-19 (không mở được) |

### Ai đã làm

| Mảng | Ai | Tình trạng |
|---|---|---|
| Đo thương hiệu xuất hiện trong câu trả lời AI | **Profound** (định giá 1 tỷ USD, 02/2026), **Peec AI** (21 triệu USD, 4 triệu USD doanh thu năm trong 10 tháng), Semrush, AirOps, nhiều app nhỏ | **Đông, nhiều tiền**. Profound đã ra gói rẻ cho doanh nghiệp nhỏ |
| Thu tiền khi AI dùng nội dung | Cloudflare pay-per-crawl, chuẩn RSL (hơn 1.500 bên ủng hộ), TollBit, AWS, Akamai | Nền tảng chiếm; chừa lại các web nhỏ |

📖 SparkToro (2026-01-28): xác suất ChatGPT hay AI của Google đưa ra **cùng một danh sách** khi hỏi 100 lần là dưới 1/100 ([SparkToro](https://sparktoro.com/blog/new-research-ais-are-highly-inconsistent-when-recommending-brands-or-products-marketers-should-take-care-when-tracking-ai-visibility/)). 💭 Công cụ nào nói đo được "thứ hạng" trong AI là không đáng tin; chỉ đo tỷ lệ xuất hiện là hợp lý.

### Chỗ còn trống

- **Đo đơn hàng đến từ AI**: chính startup YC Sitefire nói số liệu chỉ là "mức sàn", vì ChatGPT app bị tính là truy cập trực tiếp.
- **Bản cho từng chợ app**: Shopify, WooCommerce, Google Business Profile.
- **Thị trường không nói tiếng Anh**: chưa thấy công cụ cho tiếng Việt, Đông Nam Á.

### Sản phẩm

| Sản phẩm | Làm gì | Người trả | Thời điểm | Trách nhiệm | 💭 Rủi ro |
|---|---|---|---|---|---|
| Đo traffic và đơn hàng từ AI cho shop | Plugin Shopify/WooCommerce gắn nhãn phiên đến từ ChatGPT, Perplexity, Gemini, nối với đơn; bộ câu hỏi theo ngôn ngữ địa phương | Shop, agency, 19–79 USD/tháng | Bây giờ | Thấp | GA4 thêm kênh "AI"; gộp được vào Agent Shelf |
| Phân tích traffic agent cho web (GA cho agent) | Phân loại lượt vào: bot huấn luyện, bot tìm kiếm, agent thao tác thay người, agent có ký số | Web nội dung, SaaS | Bây giờ – 2027 | Thấp | Phân loại chính xác là phần khó |

---

## Xu thế 5: Nội dung AI tràn ngập, khủng hoảng niềm tin

### Dự báo

- EU AI Act Điều 50 (nghĩa vụ đánh dấu nội dung do AI tạo) áp dụng từ 02/08/2026 ⚠️ (có thể bị lùi, chưa kiểm tra).
- WEF Global Risks 2026: thông tin sai lệch đứng thứ 2 trong rủi ro 2 năm tới.
- Deloitte: gian lận dùng AI có thể gây thiệt hại 40 tỷ USD ở Mỹ vào 2027, từ 12,3 tỷ năm 2023.
- World ID: gần 18 triệu người đã xác minh, đối tác Tinder, Zoom, Docusign, Okta (2026-04-17).

### Tín hiệu hôm nay

📖 Chủ đề "AI slop is killing online communities" ([HN](https://news.ycombinator.com/item?id=48053203), 2026-05-07, **834 điểm, 734 bình luận**). Nội dung rác do AI đang giết các cộng đồng online. Người kiểm duyệt HN nói phải lọc bỏ phần lớn bài Show HN từ tài khoản mới.

📖 "I do not want to set a precedent of accepting PRs that materially improve nothing, nor do I want our contributor list to become a reward for asking a robot to fix typos." ([neilalexander.dev](https://neilalexander.dev/2026/06/30/flooding-contributions), 2026-06-30, HN 213 điểm)

Tôi không muốn tạo tiền lệ nhận các PR chẳng cải thiện gì, cũng không muốn danh sách người đóng góp thành phần thưởng cho việc nhờ robot sửa lỗi chính tả.

📖 "In under a week, I've gotten almost 400 applications for an associate, early level software support role." ([r/recruitinghell](https://www.reddit.com/r/recruitinghell/comments/1wjf82k/), 2026-09-18)

Chưa tới một tuần, tôi nhận gần 400 hồ sơ cho một vị trí hỗ trợ phần mềm cấp thấp.

Ký số ảnh (C2PA) bị phá trên thực tế: "C2PA Cameras Do Not Survive Contact with Reality" ([HN](https://news.ycombinator.com/item?id=49439499), 2026-08-25, 183 điểm).

### Ai đã làm

| Mảng | Ai | Đông? |
|---|---|---|
| Ký số ảnh, xác minh nguồn gốc | Google, Adobe, hãng máy ảnh | Nền tảng chiếm, và đang bị phá |
| Xác minh người thật | World ID, Okta, Apple/Google | Nền tảng chiếm |
| Lọc rác trong tìm kiếm | Kagi SlopStop, Google | Vừa |
| **Lọc rác trong quy trình cụ thể** (PR GitHub, cộng đồng, hộp hồ sơ tuyển dụng) | GitHub làm sơ sài | **Thưa** |

### Sản phẩm

| Sản phẩm | Làm gì | Người trả | Thời điểm | Trách nhiệm | 💭 Rủi ro |
|---|---|---|---|---|---|
| **Lọc rác cho người giữ dự án, cộng đồng** | GitHub App và bot Discord/Discourse: chấm PR, issue, bài đăng làm cẩu thả hoặc do AI; yêu cầu "bằng chứng đã bỏ công" (tái hiện lỗi, link test); danh sách người tin cậy | Công ty có dự án mã nguồn mở, đội DevRel, cộng đồng trả phí; miễn phí cho cá nhân | Bây giờ | Thấp | GitHub, Discord tự làm (khoảng 2027–2028) |
| Bộ công cụ đánh dấu nội dung AI cho SaaS nhỏ | SDK gắn nhãn "do AI tạo", nhật ký, báo cáo tuân thủ EU Điều 50 | SaaS tạo ảnh, video, giọng nói | Bây giờ – 2027 | Vừa (dễ bị hiểu là cam kết tuân thủ luật) | Lớp ký số bị nền tảng chiếm |
| Hộp tuyển dụng xác minh người thật | Kiểm tra video ngắn, so người phỏng vấn với người đi làm | Doanh nghiệp nhỏ tuyển dụng | 2027 | **Cao** (luật sinh trắc học, phân biệt đối xử) | Nên tránh |

---

## Xu thế 6: Già hoá dân số

### Dự báo

| Chỉ số | Số liệu | Nguồn |
|---|---|---|
| Người từ 60 tuổi | 1/6 dân số thế giới vào 2030 | WHO, 2025-10-01 |
| Người từ 80 tuổi | Tăng gấp 3 từ 2020 tới 2050, lên 426 triệu | WHO |
| Người từ 80 tuổi đông hơn trẻ sơ sinh | Giữa những năm 2030 (265 triệu) | UN WPP 2024 |
| Người chăm sóc người thân ở Mỹ | 63 triệu, tăng 20 triệu từ 2015 | NAC/AARP 2025 |
| Người từ 60 tuổi bị lừa | Mất 4,8 tỷ USD năm 2024, nhiều khiếu nại nhất | FBI IC3 2024 |

YC đang chủ động kêu gọi ([YC RFS](https://www.ycombinator.com/rfs), mùa thu 2026): 📖 "By 2030, one in five Americans will be over 65, and there's nowhere near enough people to take care of everyone." Tới 2030, cứ 5 người Mỹ thì 1 người trên 65 tuổi, và không đủ người chăm sóc. Danh sách gợi ý có "software coordinating care among family members" (phần mềm điều phối chăm sóc giữa các thành viên gia đình).

### ⚠️ Mâu thuẫn phải nhớ

Lần kiểm tra ở [[07.5 - Lane 5 - Người dùng cá nhân theo nhóm]] cho thấy:
- **Caring Village** làm gần y hệt (lịch, thuốc, giao việc, AI) và **miễn phí**.
- App nào cho gia đình cũng miễn phí; app sống được (ianacare) thì **công ty và bảo hiểm trả**.

💭 Xu thế đúng và YC kêu gọi **chưa chắc** có người trả tiền. Nếu làm, phải tìm người trả khác (công ty làm phúc lợi cho nhân viên), hoặc một việc hẹp gia đình chịu trả.

### Sản phẩm

| Sản phẩm | Làm gì | Người trả | Thời điểm | Trách nhiệm | 💭 Rủi ro |
|---|---|---|---|---|---|
| Lớp bảo vệ gia đình chống lừa đảo | Mật mã gia đình để xác minh cuộc gọi; "gọi con trước khi chuyển tiền"; báo cho con khi có tin nhắn đáng ngờ | Con cái | Bây giờ | Vừa (chỉ cảnh báo, không giữ tiền) | Ngân hàng, Google tự làm (xem ứng viên B ở [[06 - Vấn đề đời sống từ diễn đàn]]) |
| Điều phối chăm sóc gia đình (bán qua công ty) | Như Parent Desk, nhưng bán cho công ty làm phúc lợi nhân viên | Công ty | Bây giờ | Vừa | Bán cho doanh nghiệp lâu; ianacare đã làm |

---

## Xu thế 7: Công việc và công ty một người

### Dự báo

| Chỉ số | Số liệu | Nguồn |
|---|---|---|
| Kỹ năng đổi | 39% kỹ năng hiện có đổi hoặc lỗi thời vào 2030; 11/100 người lao động cần học lại mà không được học | WEF Future of Jobs 2025 |
| Người trẻ mất việc | Việc làm người 22–25 tuổi ở nghề dễ bị AI thay thấp hơn **19%** so với mức lẽ ra phải có | [Stanford](https://digitaleconomy.stanford.edu/publications/canaries-in-the-coal-mine/), 2026-08-12 |
| Tuyển mới ở công ty công nghệ lớn | Giảm hơn 50% trong 3 năm | SignalFire qua Rest of World, 12/2025 |
| Công ty một người | Trung Quốc trợ cấp: Tô Châu nhắm 1.000 doanh nghiệp một người vào 2028 | Rest of World, 2026-03-18 |

### Tín hiệu hôm nay

📖 "one tool for landing pages ($97/mo), an email automated service ($49/mo), and maybe something for scheduling or automation ($15-$29/mo)." ([r/Solopreneur](https://www.reddit.com/r/Solopreneur/comments/1u5itmj/), 2026-06-14, bài "The 'SaaS Tax' is quietly killing early-stage solo businesses")

Một công cụ làm trang đích (97 USD/tháng), một dịch vụ email tự động (49 USD/tháng), thêm cái gì đó để đặt lịch hay tự động hoá (15–29 USD/tháng).

📖 "I ended up connected to Claude, ChatGPT, Gemini, Copilot, a couple of video AI tools, and 13 apps inside Shopify itself. I never sat down and actually checked what each one does with my content" ([r/Solopreneur](https://www.reddit.com/r/Solopreneur/comments/1wj37pd/), 2026-09-17)

Cuối cùng tôi kết nối với Claude, ChatGPT, Gemini, Copilot, vài công cụ AI làm video, và 13 app ngay trong Shopify. Tôi chưa bao giờ ngồi kiểm tra xem mỗi cái làm gì với nội dung của tôi.

### Sản phẩm

| Sản phẩm | Làm gì | Người trả | Thời điểm | Trách nhiệm | 💭 Rủi ro |
|---|---|---|---|---|---|
| Back office cho công ty một người **trong một ngành** | Một hộp thư: AI soạn trả lời, đòi hoá đơn, xử lý giao hàng; người duyệt; nhật ký agent đã làm gì | Người làm một mình, 29–79 USD/tháng | Bây giờ | Thấp | Làm chung thì đông (Lindy, Zapier, Notion AI); phải chọn **một ngành anh hiểu sâu**, ví dụ chủ shop Shopify một người |
| Hồ sơ năng lực bằng việc thật cho người mới ra trường | Người trẻ làm việc nhỏ có thật cho doanh nghiệp nhỏ, kết quả được xác minh, thành trang bằng chứng | Doanh nghiệp trả theo việc | Bây giờ – 2027 | Vừa | Chợ hai chiều, khó khởi động |

---

## Xu thế 8: Thế giới vật chất

### Dự báo và tín hiệu

| Dịch chuyển | Số liệu | Nguồn |
|---|---|---|
| Pin lưu trữ cho nhà | Úc lắp **hơn 500.000** pin trong khoảng 1 năm nhờ trợ giá 30% | [Yale e360](https://e360.yale.edu/digest/australia-home-batteries), 08/2026 |
| Nhà máy điện ảo | Tesla + Sunrun + Renew Home gom 16,8 GW từ hàng trăm nghìn pin và hơn 8 triệu máy điều hoà thông minh | Electrek, 2026-06-24 |
| Bơm nhiệt | Châu Âu +17% quý 1/2026; ở Mỹ bán nhiều hơn lò sưởi gas mỗi năm từ 2022 | pv magazine, heatpumped.org |
| Ưu đãi thuế Mỹ | Hết hạn cuối 2025 (bơm nhiệt, điện mặt trời, pin), xe điện hết 30/09/2025 | IRS |
| Bảo hiểm nhà | **Gần nửa** hồ sơ bồi thường không được trả đồng nào ⚠️ | WSJ 2026-05-31 (tiêu đề) |
| Nắng nóng | 546.000 người chết vì nóng mỗi năm, tăng 23% từ những năm 1990 | Lancet Countdown 2025 |
| Robot trong nhà | Figure thử dọn nhà ở 30 căn; Tau Robotics dọn nhà 30 USD/giờ (có người điều khiển từ xa) | Figure 09/2026, NBC 2026-09-03 |

📖 "The supply charge is 6% higher for the Solar Sharer plan, while the peak rate is 92% higher." ([HN](https://news.ycombinator.com/item?id=49299273), 2026-08-14). Phí cố định của gói Solar Sharer cao hơn 6%, còn giá giờ cao điểm cao hơn 92%. 💭 Biểu giá điện đang rối, người dùng tự tính.

### Sản phẩm

| Sản phẩm | Làm gì | Người trả | Thời điểm | Trách nhiệm | 💭 Rủi ro |
|---|---|---|---|---|---|
| So sánh biểu giá điện cho nhà đã điện khí hoá | Tải hoá đơn hoặc nối đồng hồ thông minh → so biểu giá, chương trình nhà máy điện ảo, gói thuê pin; giải thích vì sao hoá đơn tăng sau khi lắp bơm nhiệt. Bắt đầu ở Úc, UK | Hộ gia đình, hoặc phí giới thiệu từ nhà bán điện | Bây giờ | Thấp | Phải học ngành điện, mỗi nước một luật; app của Octopus, hãng pin |
| Hồ sơ bằng chứng nhà cho bảo hiểm | Kiểm kê từng phòng, hoá đơn, bằng chứng nâng cấp chống cháy/lũ, theo dõi hạn hồ sơ bồi thường | Hộ gia đình ở vùng rủi ro | Bây giờ | Vừa (không tư vấn bảo hiểm) | Mảng kiểm kê nhà đã có nhiều app nhỏ |
| Robot: đặt lịch, vận hành cho dịch vụ robot | Đặt lịch, sơ đồ nhà, ca người điều khiển từ xa | Công ty dịch vụ robot | **2028+** | Vừa – cao | Thị trường chưa hình thành. Chỉ theo dõi |

---

## Tổng hợp ứng viên

| # | Sản phẩm | Xu thế | Thời điểm | Trách nhiệm | Mức đông | Khớp anh | Kênh tìm khách |
|---|---|---|---|---|---|---|---|
| 1 | Agent Shelf | Agent mua hàng + AI tìm kiếm | Bây giờ | Thấp | Vừa | Rất khớp (Shopify) | Shopify App Store |
| 2 | canimcp | Phần mềm cho agent | Bây giờ | Thấp | Thưa | Khớp (JS) | GitHub, cộng đồng dev |
| 3 | Family Ops | Trợ lý AI, hộ gia đình | Bây giờ | Thấp | Thưa | Khớp (Firebase) | Không có chợ app; phụ huynh trên mạng xã hội |
| 4 | Context Passport | Trợ lý AI | Bây giờ – 2027 | Thấp | Vừa | Khớp | Người chuyển đổi trợ lý, cộng đồng AI |
| 5 | Lọc rác cho cộng đồng | Nội dung AI tràn ngập | Bây giờ | Thấp | Thưa | Khớp | GitHub Marketplace |
| 6 | Agent Inbox | Agent tiêu tiền | 2027 | Vừa | Sớm | Khớp | Chưa rõ |
| 7 | Back office một người theo ngành | Công ty một người | Bây giờ | Thấp | Tuỳ ngành | Khớp nếu chọn chủ shop Shopify một người | Chợ app của ngành đó |
| 8 | So sánh biểu giá điện | Điện khí hoá | Bây giờ | Thấp | Vừa | Cần học ngành | Diễn đàn năng lượng, phí giới thiệu |

## Nên tránh

| Mảng | Lý do |
|---|---|
| Thanh toán, ví, stablecoin cho agent | Dính giấy phép chuyển tiền; nền tảng chiếm |
| Hosting, xác thực, thanh toán MCP dạng chung | Cloudflare, chuẩn MCP đã làm |
| Đo thương hiệu trong câu trả lời AI dạng chung | Profound, Peec nhiều tiền; đã đông |
| Ký số ảnh, xác minh người thật bằng sinh trắc | Nền tảng chiếm; trách nhiệm cao |
| Y tế lâm sàng, thuốc GLP-1 | Trách nhiệm y tế |
| AI nói chuyện với trẻ em | An toàn trẻ em, luật COPPA |
| Robot | Phải sau 2028 |

## Hạn chế của note này

1. Hạn mức tìm kiếm web đã hết. Các nguồn lớn (Gartner, McKinsey, IEA, Euromonitor) chưa mở được, số liệu từ đó đánh dấu ⚠️.
2. Câu trích lấy qua agent, **chưa đối chiếu lại** như note 07.
3. Hacker News là dân công nghệ ở Mỹ, châu Âu, nên tín hiệu nghiêng về mảng dev và agent. Xu thế đời sống (gia đình, người già) cần nguồn khác.
4. Chưa làm bước kiểm tra thực tế (đối thủ trực tiếp, bằng chứng trả tiền, trần doanh thu) cho từng ứng viên. Bài học từ note 07: ứng viên nhìn mạnh ở vòng đầu thường yếu đi khi kiểm tra kỹ.

## Mẫu tự chấm

Giống [[07 - Ngách theo thị trường]], thêm 2 tiêu chí cho cách nhìn tương lai:

| Tiêu chí | Trọng số |
|---|---|
| Xu thế chắc chắn xảy ra (có số liệu, có mốc) | ? |
| Thời điểm vào đúng (không quá sớm, không quá muộn) | ? |
| Tín hiệu người dùng sớm hôm nay | ? |
| Nằm ở rìa, nền tảng khó tự làm | ? |
| Bằng chứng chịu trả tiền | ? |
| Có kênh tìm khách | ? |
| Trách nhiệm thấp, không cần chuyên môn sâu | ? |
| Anh làm được, anh hiểu (founder khớp thị trường) | ? |

## Bước tiếp theo đề xuất

1. Anh chọn 2–3 ứng viên từ bảng tổng hợp.
2. Với mỗi ứng viên: làm đủ bước kiểm tra thực tế như ở note 07 (đối thủ trực tiếp, nền tảng đã làm gì, bằng chứng trả tiền, trần doanh thu), và đối chiếu lại câu trích.
3. Nói chuyện với 5 người đúng đối tượng ([[13 - How to Talk to Users]]).
