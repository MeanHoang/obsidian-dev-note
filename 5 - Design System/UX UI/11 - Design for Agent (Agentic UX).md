---
tags:
  - ux
  - ui
  - ai
  - agent
  - agentic-commerce
  - shopify
type: note
created: 2026-09-03
---

# 11 - Design for Agent (Agentic UX)

## 📌 Ý chính của bài

Mười chương trước đều giả định một điều: **người dùng cuối là con người**. Người đó có mắt, liếc màn hình, bị màu đỏ hút sự chú ý, thấy spinner thì hiểu là "đang chạy".

Giả định đó đang vỡ dần. Ngày càng nhiều người **không tự đi tìm app nữa** — họ hỏi ChatGPT/Gemini/Claude "có app loyalty nào cho Shopify tốt không", rồi chỉ mở đúng cái được gợi ý. Và ngày càng nhiều thao tác **không do người bấm** — agent bấm hộ.

> [!tip] Ví dụ đời sống
> Trước đây bạn mở nhà hàng ở mặt phố: khách đi ngang, thấy biển đẹp, mùi thơm, thì ghé. Bạn thiết kế cho **người đi đường**.
> Bây giờ 3 trong 10 khách không đi ngang nữa — họ hỏi anh tài xế taxi "quán nào ngon quanh đây?". Anh tài xế chưa từng ăn ở quán bạn; anh ta chỉ nhớ **những gì người khác kể lại** và **những gì đọc được trên bảng hiệu**. Muốn được giới thiệu, bạn phải thiết kế thêm cho **anh tài xế** — người trung gian không nếm được món ăn.
> Rồi khách gửi luôn anh tài xế vào quán gọi món hộ. Lúc này cửa quán phải đủ rõ để **người chưa từng vào** vẫn tìm được bàn, đọc được menu, gọi đúng món. Đó chính là hai nửa của bài này.

Vậy nên có **hai loại "agent" hoàn toàn khác nhau**, đừng lẫn:

| | Agent **giới thiệu** app (discovery) | Agent **thao tác** app (operability) |
|---|---|---|
| Nó làm gì | Trả lời "app nào tốt?" cho user | Thay user click, điền form, mua hàng |
| Nó đọc gì | Nội dung web nói **về** bạn | Giao diện **của** bạn: screenshot / DOM / accessibility tree |
| Bạn tối ưu bằng | Cách viết nội dung, được nhắc tên ở đâu | Semantic HTML, ARIA, selector ổn định |
| Phần nào của bài | Mục 1–4 | Mục 5–9 |

![[uxui-11-two-agent-types.svg]]
*Hai loại agent đọc hai thứ hoàn toàn khác nhau: một bên đọc nội dung web nói **về** bạn, một bên đọc giao diện **của** bạn — nên cách tối ưu cũng khác nhau hoàn toàn.*

Câu hỏi trung tâm của bài — *"viết text thế nào để agent chú ý?"* — có câu trả lời **đã được đo bằng nghiên cứu**, và nó khá phản trực giác: không phải nhồi keyword (nhồi làm **giảm** hiệu quả), mà là **trích dẫn có nguồn + số liệu cụ thể**.

> [!warning] Cảnh báo về chất lượng nguồn
> Đây là chủ đề bị marketing thổi phồng nặng nhất hiện nay. Note này chỉ ghi những gì có nghiên cứu hoặc tài liệu chính thức chống lưng, và có hẳn một mục [[#⚠️ Những claim phổ biến KHÔNG có bằng chứng]] để bạn không mất tiền vào thứ vô ích. Nhiều thứ nghe rất hợp lý (llms.txt, schema.org cho AI) hoá ra chưa có bằng chứng nào.

---

## 🔍 Agent tìm app bằng gì (Discovery)

**Là gì:** Cơ chế một AI assistant quyết định nhắc tên app nào khi user hỏi "app X nào tốt?". Không phải nó "biết" app bạn — nó **đọc lại những gì web nói về bạn**, rồi tổng hợp.

**Giải thích dễ hiểu:** Google trả về một *danh sách link*, bạn cạnh tranh vị trí. LLM trả về **một đoạn văn** trộn nhiều nguồn — bạn không cạnh tranh "hạng 1", bạn cạnh tranh **được nhắc tên trong đoạn văn đó**. Đây là khác biệt gốc rễ, và nó đổi cả chiến thuật.

**Bằng chứng — cái gì tương quan mạnh nhất với việc được nhắc tên:** Ahrefs phân tích **75.000 brand** trên hàng triệu AI Overview response (26/05/2025), hệ số tương quan Spearman:

| Yếu tố | Tương quan |
|---|---|
| **Branded web mentions** (được nhắc tên khắp web) | **0,664** |
| Branded anchors | 0,527 |
| Branded search volume | 0,392 |
| Domain Rating | 0,326 |
| Referring domains | 0,295 |
| **Backlinks** | **0,218** |

**Đọc bảng này thế nào:** *được người khác nhắc tên* mạnh gấp **3 lần** *có backlink*. Nghĩa là một bài Reddit khen app bạn (không kèm link) đáng giá hơn một backlink mua từ site rác. Tác giả Ahrefs nói rõ đây là **tương quan, không phải nhân quả**, và mọi hệ số đều ở mức "trung bình đến rất yếu" — đừng coi là công thức.

![[uxui-11-discovery-correlation.svg]]
*Được nhắc tên khắp web (0,664) tương quan mạnh gấp ~3 lần backlink (0,218) — nhìn thấy ngay khoảng cách giữa hai đầu biểu đồ.*

**Agent lấy nội dung từ đâu:** Similarweb đo ~600.000 citation event trên ChatGPT + Google AI Mode (tháng 1–2/2026, thị trường Mỹ):

- **ChatGPT:** Wikipedia 13,15% · Reddit 11,97% · OpenAI.com 6,21% · Walmart 2,90% · YouTube 2,67%
- **Google AI Mode:** Fandom 7,16% · Wikipedia 5,21% · YouTube 4,91% · Reddit 4,19%

**Ví dụ mô tả bằng lời:**
- Bạn viết 20 bài blog trên chính domain của mình về "loyalty program best practice". Hữu ích, nhưng chỉ là **một nguồn** trong hàng chục nguồn agent đọc.
- Một thread r/shopify có người hỏi "app loyalty nào ổn?" và 5 người trả lời nhắc tên app bạn kèm lý do cụ thể — nằm trong nhóm nguồn có trọng số cao nhất trên ChatGPT.
- Trọng số này **không cố định**: Semrush đo 230.000 prompt trong 13 tuần (14/07–12/10/2025) và thấy Reddit trên ChatGPT **sụt từ ~60% số response xuống ~10%** trong khoảng đầu tháng 8 → giữa tháng 9, trong khi trên Perplexity thì không đổi. Nhà cung cấp đổi trọng số lúc nào cũng được.

**Sai lầm hay gặp:** Dồn hết ngân sách vào SEO on-page và link building cho domain nhà, trong khi thứ tương quan mạnh nhất (0,664) lại là **được nhắc tên ở nơi khác**. Và giả định "G2/Capterra chắc chắn là nguồn AI tin nhất cho SaaS" — hai site này **không có trong top-20** của cả ChatGPT lẫn Google AI Mode theo dữ liệu Similarweb. Đó là giả định, không phải sự thật.

---

## ✍️ Viết text thế nào để agent trích dẫn

**Là gì:** **GEO — Generative Engine Optimization**, đặt tên trong paper cùng tên của Aggarwal và cộng sự (arXiv 2311.09735, accepted **KDD 2024**). Đây là phần **có bằng chứng peer-reviewed mạnh nhất** trong toàn bộ chủ đề này.

**Giải thích dễ hiểu:** Nhóm tác giả dựng **GEO-bench** (10.000 query, 25 domain), thử từng cách viết lại nội dung, rồi đo xem nội dung đó có được engine đưa vào câu trả lời không (metric *Position-Adjusted Word Count*, baseline = 19.3):

| Cách viết lại nội dung | Điểm |
|---|---|
| **Quotation Addition** — thêm trích dẫn nguyên văn từ nguồn có thẩm quyền | **27,2** |
| **Statistics Addition** — thêm số liệu định lượng | **25,2** |
| Fluency Optimization — viết cho trôi chảy, đúng ngữ pháp | 24,7 |
| **Cite Sources** — ghi rõ nguồn cho từng claim | **24,6** |
| Technical Terms — dùng thuật ngữ chuyên ngành | 22,7 |
| Easy-to-Understand — diễn đạt dễ hiểu | 22,0 |
| Authoritative — giọng văn quả quyết | 21,3 |
| Unique Words | 20,5 |
| **Keyword Stuffing — nhồi từ khoá** | **17,7 ⛔ THẤP HƠN baseline** |

![[uxui-11-geo-bench.svg]]
*Đường vàng đứt nét là baseline 19,3: trích dẫn và số liệu vượt xa nó, còn nhồi từ khoá (đỏ) là chiến thuật duy nhất nằm dưới.*

**Ba kết luận rút ra được ngay:**

1. **Nhồi keyword phản tác dụng thật sự** — 17,7 so với baseline 19,3, tức viết bình thường còn hơn đi nhồi. Chiến thuật SEO cũ không chỉ vô dụng mà còn **có hại** ở đây.
2. **Trích dẫn + số liệu là hai thứ thắng đậm nhất.** Lý do trực giác: LLM sinh câu trả lời cần thứ **trích thẳng ra được**. Một câu "app của chúng tôi rất mạnh mẽ và linh hoạt" không có gì để trích. Một câu "tăng tỉ lệ mua lại trung bình 18% trên 400 store, theo dữ liệu nội bộ Q2/2026" thì có.
3. **Hiệu quả phụ thuộc domain:** *Cite Sources* mạnh nhất ở nhóm Law & Government / Facts; *Statistics Addition* mạnh ở Law & Government, Debate, Opinion; *Authoritative* mạnh ở Debate, History, Science.

**Ví dụ mô tả bằng lời — cùng một ý, hai cách viết:**

- ❌ *"Joy Loyalty là giải pháp loyalty hàng đầu, mạnh mẽ, dễ dùng, tối ưu cho mọi cửa hàng Shopify. Loyalty app Shopify, app tích điểm Shopify, phần mềm loyalty tốt nhất."*
  → Không có gì trích được, lại còn nhồi keyword ở cuối (nhóm điểm 17,7).
- ✅ *"Joy Loyalty hỗ trợ 4 loại phần thưởng: điểm, tier, referral, và VIP. Theo Shopify (Q1/2026), đơn hàng đến từ AI assistant có AOV cao hơn 14% so với organic search — nên chương trình loyalty cần hiển thị được cả trong luồng agent, không chỉ trên storefront."*
  → Có số liệu cụ thể, có nguồn ghi rõ, có câu khẳng định trích nguyên văn được (nhóm điểm 25–27).

**Sai lầm hay gặp:** Viết marketing copy thuần tính từ ("mạnh mẽ", "linh hoạt", "hàng đầu") rồi thắc mắc sao AI không bao giờ nhắc tên mình. Tính từ **không trích được**; con số và trích dẫn thì trích được.

> [!warning] Đừng đọc quá con số "40%"
> Paper gốc quảng bá "GEO boosts visibility by up to 40%". Survey phản biện 2026 (*Optimizing Visibility in Generative Engines: A Critical Survey*, arXiv 2607.14035) chỉ rõ: đó là **mức tăng tương đối tối đa trên MỘT metric, trong điều kiện context cố định 5 document** — không phải cải thiện ranking tổng quát. Survey này cũng đo được các engine bất ổn định đến mức nào: overlap URL giữa các engine chỉ **11–18% Jaccard**, và chỉ đổi cách hỏi nhẹ đã làm đổi **9–28%** kết quả.
>
> Và một sắc thái quan trọng: survey xếp "evidence dễ trích xuất giúp được dùng" ở mức bằng chứng **trung bình**, kèm điều kiện **"khi nó đúng sự thật"**. Bịa số liệu không những vô ích mà còn rủi ro.

---

## 🚦 Đừng chặn nhầm bot của chính mình

**Là gì:** Các nhà cung cấp AI dùng **nhiều user-agent khác nhau cho mục đích khác nhau**. Chặn nhầm một cái là app của bạn biến mất khỏi kết quả AI — và rất nhiều người đang chặn nhầm.

**Giải thích dễ hiểu:** Nhiều team nghe "không muốn AI train trên nội dung của mình" rồi chặn sạch mọi bot có chữ AI. Nhưng **crawl để train** và **crawl để trả lời user** là hai bot khác nhau:

**OpenAI** (tài liệu chính thức):

| Bot | Mục đích | Chặn nó thì sao |
|---|---|---|
| `GPTBot` | Thu thập content **để train** model | Không ảnh hưởng việc xuất hiện trong ChatGPT search |
| `OAI-SearchBot` | Đưa website **vào kết quả search của ChatGPT** | ⛔ **Biến mất khỏi ChatGPT search** |
| `ChatGPT-User` | Fetch khi user chủ động yêu cầu | Agent không mở được trang bạn |
| `OAI-AdsBot` | Kiểm tra an toàn trang làm quảng cáo | — |

**Anthropic** cũng tách tương tự: `ClaudeBot` (training) · `Claude-User` (khi user hỏi Claude) · `Claude-SearchBot` (index cho search). Lưu ý: robots.txt phải đặt ở top-level của **từng subdomain**.

![[uxui-11-bot-blocking.svg]]
*Chặn `GPTBot` chỉ ngăn việc train model, còn chặn `OAI-SearchBot` là tự xoá app mình khỏi ChatGPT search — hai bot, hai hậu quả khác hẳn.*

> [!danger] Mốc cần kiểm tra: 15/09/2026 (Cloudflare)
> Với domain mới onboard, Cloudflare đặt mặc định: bot nhóm **Training và Agent bị chặn** trên trang có hiển thị quảng cáo; nhóm **Search vẫn được phép**.
> Điểm nguy hiểm: crawler **đa mục đích** (vừa Search vừa Training) bị xử theo *tất cả* hành vi của nó — nên khách hàng đã chọn chặn Training sẽ **chặn luôn Googlebot, Applebot, BingBot**. Nếu bạn dùng Cloudflare, vào Security settings kiểm tra trước mốc này.

**Sai lầm hay gặp:** Copy một file `robots.txt` "chặn AI" từ blog nào đó về dán vào, chặn sạch cả `OAI-SearchBot` lẫn `Claude-SearchBot`, rồi vài tháng sau thắc mắc sao ChatGPT không bao giờ biết app mình tồn tại. Quyết định "chặn training" là hợp lệ; chặn nhầm "discovery" thì tự bắn vào chân.

---

## 🏷️ Structured data — cái gì còn giá trị, cái gì đã chết

**Là gì:** JSON-LD / schema.org — đánh dấu dữ liệu để máy hiểu trang bạn nói về cái gì.

**Giải thích dễ hiểu:** Cần tách bạch hai giá trị hoàn toàn khác nhau, vì đây là chỗ marketing nói sai nhiều nhất:

- ✅ **Giá trị đã xác minh: rich result của Google Search.** `SoftwareApplication` vẫn được Google hỗ trợ, không bị deprecate. Bắt buộc: `name`, `offers.price` (app free thì `"price": 0`), và **một trong hai**: `aggregateRating` hoặc `review`. Khuyến nghị thêm `applicationCategory` (có sẵn giá trị `BusinessApplication` — hợp cho Shopify app) và `operatingSystem`.
- ⛔ **`FAQPage` đã mất rich result.** Google ghi nguyên văn: *"This feature will no longer appear in Google Search starting May 7, 2026."* Vocabulary vẫn hợp lệ và Google vẫn parse, nhưng **không còn hiển thị rich result**. (`QAPage` là type khác, vẫn được hỗ trợ.)
- ❓ **"Schema giúp LLM hiểu và trích dẫn app của bạn" — không có bằng chứng.** Không tìm được nghiên cứu hay tuyên bố chính thức nào từ OpenAI/Anthropic/Google xác nhận LLM đọc JSON-LD để quyết định trích dẫn. Mọi bài nói vậy đều là suy đoán.

**Sai lầm hay gặp:** Đầu tư một sprint để rải schema khắp site **với mục tiêu "để AI hiểu"**. Làm schema là đúng — nhưng lý do đúng là *Google rich result*, không phải *LLM citation*. Đặt sai kỳ vọng thì đo KPI kiểu gì cũng thấy thất bại.

---

## 👁️ Agent "nhìn" giao diện bằng cái gì (Operability)

**Là gì:** Từ đây trở đi là nửa thứ hai — agent **thao tác** trên app bạn. Muốn thiết kế cho nó, phải biết nó *nhìn thấy gì*.

**Giải thích dễ hiểu:** Có đúng **3 cách** agent tri giác một trang, và agent hiện đại kết hợp cả ba:

1. **Screenshot (pixel)** — chụp màn hình rồi "nhìn" như người.
2. **HTML/DOM** — đọc mã nguồn trang.
3. **Accessibility tree** — cây ngữ nghĩa mà trình duyệt dựng cho screen reader, **bỏ hết "nhiễu thị giác" của CSS**, chỉ giữ phần dùng được.

![[uxui-11-agent-perception.svg]]
*Ba modality đặt cạnh nhau: pixel thì phải OCR nên dễ sai, DOM thì chính xác nhưng dài dòng, còn a11y tree chỉ hiện đúng những gì bạn khai báo tử tế.*

**Ví dụ mô tả bằng lời:**
- **Claude computer use là thuần screenshot**: tài liệu ghi *"Coordinates are in screenshot pixels"* — mọi toạ độ tính theo pixel của ảnh chụp toàn màn hình. Không có DOM, không có accessibility tree. Nó thật sự đang "nhìn ảnh và đoán chỗ bấm".
- **Điểm yếu của nhìn-bằng-pixel là OCR**, và OpenAI thừa nhận bằng số trong system card của Operator: khi phải chép giá trị phức tạp từ màn hình (API key, địa chỉ ví Bitcoin), *"the model would almost always decide to read the text visually from the screen"* → sai OCR. Có task nó fail **0/10**.
- **Claude in Chrome thì đọc được DOM** — nó phát hiện được *"hidden malicious form fields in a webpage's DOM invisible to humans"*, tức extension có truy cập DOM chứ không chỉ ảnh.

**Sai lầm hay gặp:** Cho rằng "agent thông minh thì tự hiểu được thôi". Không — một agent screenshot-only nhìn nút của bạn hệt như người bị cận không đeo kính: thấy hình khối và màu, đọc chữ có thể sai. Mọi thông tin bạn *chỉ* truyền tải bằng màu sắc hoặc icon là thông tin bạn **đang giấu** khỏi nó.

---

## ♿ Accessibility tốt = agent đọc được

**Là gì:** Hoá ra toàn bộ [[08 - Accessibility (a11y)]] bạn đã học không chỉ phục vụ người khuyết tật — nó chính là **định dạng dữ liệu mà agent dùng**.

**Giải thích dễ hiểu:** Chrome nói thẳng accessibility tree là **primary data model** của agent: *"Agents rely on the accessibility tree... as their primary data model — a high-fidelity map that ignores the visual 'noise' of CSS to focus on pure utility."*

Và Chrome đã biến điều này thành công cụ chấm điểm: **Lighthouse từ M150 có hẳn category "Agentic Browsing"**, kiểm 3 nhóm:
- **Names and labels** — mọi element tương tác phải có tên máy đọc được
- **Tree integrity** — cây a11y không bị vỡ
- **Visibility**

Lý do được nêu tường minh: *"missing labels can block users with visual disabilities **and agents** from completing a task."*

**Ví dụ mô tả bằng lời:**

```html
<!-- ❌ div giả nút: không role, không vào a11y tree, không focus được,
     bên trong chỉ có icon nên không có tên nào để agent gọi -->
<div class="sc-1x9k2j" onclick="redeemPoints()">
  <svg class="icon-gift"></svg>
</div>

<!-- ✅ button thật + tên bằng text thật -->
<button type="button" id="redeem-points" data-testid="redeem-points"
        onclick="redeemPoints()">
  <svg class="icon-gift" aria-hidden="true"></svg>
  Redeem 500 points
</button>
```

![[uxui-11-a11y-name.svg]]
*Cùng một nút, người nhìn thấy gần như y hệt, nhưng `<div onclick>` chỉ có icon để lại accessibility tree rỗng — agent không có tên nào để gọi.*

Playwright — chuẩn de-facto của automation — cũng chọn đúng hướng này: *"We recommend prioritizing role locators... as it is the closest way to how users and assistive technology perceive the page."*

**Sai lầm hay gặp:** Coi a11y là "việc phải làm cho đủ compliance, làm sau". Giờ nó có ROI trực tiếp: nút không có accessible name = agent không gọi tên được = không bấm được = app bạn không dùng được qua agent.

> [!note] Sắc thái: a11y tree không phải lúc nào cũng thắng HTML
> Một paper 04/2026 đo được model **mạnh** làm tốt hơn khi được cho HTML đầy đủ thay vì a11y tree (gpt-5.1 high reasoning **+17,5 điểm phần trăm**; Claude Sonnet 4.6 **+14,6 pp**), nhưng model **yếu** thì ngược lại (gpt-oss-20b **−18,8 pp**). Kết luận: observation gọn (a11y) hợp với model yếu, observation chi tiết (HTML) hợp với model mạnh. Dù theo hướng nào thì **semantic HTML vẫn thắng cả hai** — vì nó cải thiện đồng thời cả DOM lẫn a11y tree.

---

## 🔩 Selector ổn định & layout không nhảy

**Là gì:** Agent định vị element bằng vai trò + tên, hoặc bằng toạ độ. Cả hai đều vỡ nếu code bạn sinh class ngẫu nhiên hoặc layout nhảy sau khi load.

**Giải thích dễ hiểu:**

- **Class hash là kẻ thù.** Playwright ghi rõ: *"CSS and XPath selectors can be tied to the DOM structure or implementation. These selectors can break when the DOM structure changes."* Chuỗi kiểu `#tsf > div:nth-child(2) > div.A8SBwf...` bị gọi thẳng là *"bad practice that leads to unstable tests"* — đúng dạng CSS-in-JS sinh ra mỗi lần build.
- **Thứ tự ưu tiên chính thức của Playwright:** role locator → **test id** → CSS/XPath (chỉ khi cùng đường). Về test id: *"Testing by test ids is the most resilient way of testing."*
- **Layout nhảy = agent bấm trượt.** Chrome đưa **CLS vào audit agentic browsing** với lý do trực tiếp là tránh **"agent misclicks"**. Với agent screenshot-based, banner chèn vào sau khi fetch xong làm nút tụt xuống 40px là đủ để nó click vào chỗ trống.
- **Element quá nhỏ bị lọc bỏ:** cần diện tích hiển thị **lớn hơn 8 pixel vuông** mới được coi là tương tác được. (Liên hệ [[02 - Laws of UX - Nguyên tắc tâm lý học]] — Fitts's Law: nút to thì cả người lẫn máy đều bấm dễ hơn.)
- **Canvas/WebGL là vùng chết hoàn toàn.** MDN: `<canvas>` *"is just a bitmap and does not provide information about any drawn objects"*, và *"Text painted to the canvas is not available to the DOM"*. Chart vẽ bằng canvas → agent không đọc được **một con số nào**, chỉ còn nước OCR, mà OCR thì ta đã biết là điểm yếu.

**Ví dụ mô tả bằng lời:**

```html
<!-- ✅ canvas để người nhìn, bảng thật để máy đọc -->
<canvas id="loyalty-chart" width="600" height="300"
        role="img" aria-label="Points redeemed per month, 2026"></canvas>

<table data-testid="loyalty-chart-data">
  <caption>Points redeemed per month, 2026</caption>
  <thead><tr><th scope="col">Month</th><th scope="col">Points</th></tr></thead>
  <tbody>
    <tr><td>January</td><td>12400</td></tr>
    <tr><td>February</td><td>15800</td></tr>
  </tbody>
</table>
```

**Sai lầm hay gặp:** Dashboard analytics đẹp long lanh vẽ toàn bộ bằng canvas, không có bảng dữ liệu kèm theo. Với screen reader nó là hộp đen; với agent cũng vậy. Xem thêm [[09 - UX cho SaaS]] về dashboard.

---

## 🚥 Trạng thái phải máy đọc được

**Là gì:** loading / disabled / error phải nằm trong **attribute**, không chỉ nằm trong CSS class.

**Giải thích dễ hiểu:** MDN nói một câu quyết định tất cả: **"ARIA *only* modifies the accessibility tree."** Suy ngược lại: đổi màu bằng CSS thì accessibility tree **không đổi gì cả** — agent đọc a11y tree sẽ không thấy trạng thái nào hết. Nút đang loading và nút bình thường, với nó, là một.

Ba attribute chuẩn cần biết (định nghĩa W3C/MDN):
- **`aria-busy`** — *"indicates whether an element is currently being modified... they may want to wait before informing users of the update."* Đây chính là tín hiệu "khoan, đang chạy".
- **`aria-invalid`** — *"the entered value does not conform to the format expected by the application."*
- **`aria-disabled`** — *"perceivable but disabled, so it is not editable or otherwise operable"*, và nó lan xuống mọi descendant focus được.

**Ví dụ mô tả bằng lời:**

```html
<!-- ❌ agent chỉ thấy pixel mờ mờ, không biết đang chạy hay đã hỏng -->
<button class="btn is-loading" onclick="saveTier()">
  <span class="spinner"></span>
</button>
```

```html
<!-- ✅ trạng thái nằm trong attribute -->
<button type="button" id="save-tier" data-testid="save-tier" onclick="saveTier()">
  Save tier
</button>

<script>
  function setBusy(el, busy) {
    el.setAttribute('aria-busy', busy ? 'true' : 'false');
    el.setAttribute('aria-disabled', busy ? 'true' : 'false');
    el.textContent = busy ? 'Saving tier…' : 'Save tier';
  }

  async function saveTier() {
    var btn = document.getElementById('save-tier');
    if (btn.getAttribute('aria-busy') === 'true') return;
    setBusy(btn, true);
    try {
      await fetch('/api/tiers', { method: 'POST' });
    } finally {
      setBusy(btn, false);
    }
  }
</script>
```

![[uxui-11-machine-readable-state.svg]]
*Spinner bằng CSS class không để lại dấu vết nào trong accessibility tree; `aria-busy` + text thật thì trạng thái "đang chạy" mới đến được agent.*

Tương tự với lỗi form: viền đỏ + icon cảnh báo là **không đủ**. Thông báo lỗi phải là **text thật trong DOM**, kèm `aria-invalid` trên input và `aria-describedby` trỏ tới đoạn text đó — nếu không, agent buộc phải OCR chữ trong ảnh, và đó là việc nó làm tệ nhất.

**Sai lầm hay gặp:** Toàn bộ hệ thống states trong [[07 - Components & Interaction Design]] được cài đặt bằng class CSS thuần. Nhìn thì đúng đủ 5 trạng thái, nhưng chỉ đúng **với mắt người**.

> [!note] Trung thực về mức bằng chứng
> Việc agent đọc accessibility tree là **có tài liệu chính thức** (Chrome, Lighthouse). Nhưng câu "vendor X poll `aria-busy` để biết đang loading" thì **chưa có tài liệu agent-specific nào xác nhận** — đó là suy luận từ cơ chế a11y tree. Hãy hiểu đúng: đặt state vào ARIA làm nó **đến được** agent, chứ không đảm bảo agent nào cũng dùng đúng cách đó.

---

## 🧱 Cái gì làm agent tắc — và agent giỏi đến đâu

**Là gì:** Bức tranh thật về tỉ lệ hoàn thành task của agent trên web thật. Cần biết để **không thiết kế dựa trên kỳ vọng sai**.

**Giải thích dễ hiểu — số liệu benchmark:**

| Benchmark | Kết quả |
|---|---|
| **WebArena** (2023, môi trường mô phỏng) | GPT-4 + CoT **11,70%** · Con người **78,24%** |
| **Online-Mind2Web** (COLM 2025) — 300 task trên **136 website thật** | Operator **61,3%** · Claude Computer Use 3.7 **56,3%** · SeeAct 30,7% · Browser Use 30,0% · Agent-E 28,0% |
| **OSWorld** (OpenAI tự báo cáo) | CUA **38,1%** |

Kết luận nguyên văn của nhóm Online-Mind2Web: kết quả cho thấy **"over-optimism in previously reported results"** — phần lớn agent chỉ xong ~30% task, và nhiều agent mới còn **thua SeeAct ra đời đầu 2024**. OpenAI thì tự nhận CUA *"is not yet highly reliable for automating tasks on OS"*.

> [!important] Chi tiết dễ bỏ qua nhưng rất quan trọng
> Nhóm tác giả Online-Mind2Web đã **lọc bỏ các website có CAPTCHA** khi dựng dataset. Nghĩa là **61,3% của Operator là con số đã trừ đi mọi site có CAPTCHA**. Con số thật trên web mở còn thấp hơn.

![[uxui-11-agent-benchmark.svg]]
*Agent tốt nhất mới đạt 61,3% so với 78,24% của con người — và con số đó đã được đo trên dataset đã loại bỏ mọi site có CAPTCHA.*

**5 nhóm lỗi được paper phân loại** — đây là danh sách cần dán lên tường:
1. **Filter & Sorting Errors** — lọc/sắp xếp sai, hoặc quên bấm áp dụng
2. **Incomplete Steps** — điển hình: *"not clicking the Submit button after filling out a form"*
3. **Navigation Errors**
4. **Misunderstanding**
5. Others

**Ví dụ mô tả bằng lời:** Nhóm lỗi số 2 nói thẳng với bạn một điều thiết kế: **form nhiều bước mà nút Submit nằm xa, mờ, hoặc chỉ hiện sau khi scroll là công thức để agent bỏ dở giữa chừng.** Người dùng còn cảm thấy "hình như chưa xong"; agent thì không.

**Sai lầm hay gặp:** Hai thái cực đều sai — "agent làm được hết rồi, không cần lo" (thực tế ~30–61%), và "agent còn dở lắm, kệ đi" (Shopify đo AI-referred orders **tăng gần 13x YoY** trong Q1/2026).

> [!warning] Chưa xác minh được
> Không tìm được số liệu định lượng đáng tin riêng cho: infinite scroll, iframe, drag-drop, menu chỉ hiện khi hover, OTP/2FA. Chúng **hợp lý về mặt trực giác** là gây khó cho agent, nhưng note này không có bằng chứng để khẳng định — và các blog nói về chúng phần lớn là quảng cáo dịch vụ bypass CAPTCHA.

---

## 🛡️ Prompt injection & hành động không thể hoàn tác

**Là gì:** Khi agent đọc nội dung trang bạn, **nội dung đó có thể chứa lệnh** khiến agent làm việc khác. Đây là rủi ro số 1 (**LLM01**) trong OWASP Top 10 cho ứng dụng LLM.

**Giải thích dễ hiểu:** Tài liệu Claude computer use cảnh báo thẳng: *"In some circumstances, Claude will follow commands found in content even when they conflict with your instructions. For example, instructions on webpages or contained in images might override your instructions."*

Con số thật về mức độ nghiêm trọng:
- **Claude in Chrome:** ở chế độ tự chủ chưa có phòng thủ, tỉ lệ tấn công thành công **23,6%**; sau mitigation còn **11,2%**. Riêng nhóm tấn công browser-specific: **35,7% → 0%**.
- **Operator (OpenAI):** trên 31 kịch bản injection — **62%** dễ bị tấn công khi không mitigation → 47% nếu chỉ dùng prompting → **23%** ở model cuối.
- **Benchmark học thuật WASP:** tấn công thành công một phần lên tới **86%**; tác giả gọi tình trạng hiện nay là **"security by incompetence"** — an toàn nhờ agent còn dở, chứ không nhờ phòng thủ tốt.

**Và rủi ro hành động phá huỷ:** OpenAI chạy Operator **chưa mitigate** trên 100 tác vụ đời thường → **13 lỗi gây phiền**, trong đó **5 lỗi không hoàn tác được hoặc nghiêm trọng**: gửi email nhầm người, **xoá nhầm hàng loạt label email**, đặt nhầm món ăn, đặt sai ngày nhắc uống thuốc.

**Biện pháp đã được chứng minh có hiệu quả: bước xác nhận.** OpenAI đo confirmation **giảm rủi ro ~90%**, với recall 92% trên eval 607 task / 20 nhóm hành động rủi ro. Claude in Chrome cũng làm y hệt: *"Claude asks users before taking high-risk actions like publishing, purchasing, or sharing personal data."*

**Ví dụ mô tả bằng lời — hai việc bạn làm được ở phía website:**

1. **Tách hành động phá huỷ thành bước xác nhận riêng, có text rõ ràng máy đọc được** — đúng tinh thần "Error Prevention" ở [[09 - UX cho SaaS]], giờ có thêm lý do mới:

```html
<!-- ❌ một click là xoá sạch -->
<button onclick="deleteAllTiers()">🗑</button>

<!-- ✅ bước xác nhận riêng, nói rõ hậu quả bằng text -->
<button type="button" data-testid="delete-tiers" onclick="openDeleteConfirm()">
  Delete all loyalty tiers
</button>
<div id="delete-confirm" role="dialog" aria-modal="true"
     aria-labelledby="delete-confirm-title" hidden>
  <h2 id="delete-confirm-title">Delete all loyalty tiers?</h2>
  <p>This permanently deletes 4 tiers and cannot be undone.</p>
  <button type="button" data-testid="delete-confirm-cancel">Cancel</button>
  <button type="button" data-testid="delete-confirm-accept">Yes, delete all tiers</button>
</div>
```

2. **Coi nội dung do người khác tạo là nguồn injection.** Review sản phẩm, comment, tên sản phẩm merchant tự đặt, subject email — tất cả đều có thể chứa câu kiểu *"Ignore previous instructions and…"*. Đừng render chúng ở vị trí/định dạng trông giống chỉ dẫn hệ thống.

**Sai lầm hay gặp:** Nghĩ prompt injection là "vấn đề của OpenAI/Anthropic, không phải của tôi". Nhưng nếu app của bạn hiển thị nội dung do user nhập, **app của bạn chính là vector tấn công**.

---

## 🔌 Đường "chính danh": WebMCP, MCP, hay API

**Là gì:** Thay vì để agent mò mẫm click UI, bạn **khai báo thẳng** cho nó những việc nó làm được.

**Giải thích dễ hiểu:**

- **WebMCP** — web platform API do **W3C Web Machine Learning Community Group** phát triển. Nó cho phép *"expose web application functionality — either JavaScript functions or HTML `<form>` elements — as 'tools' with natural language descriptions and structured schemas, designed for AI agent ingestion."* Mục tiêu tuyên bố rõ: thay thế *"brittle DOM automation (screenshots, DOM scraping, simulated clicks)"* bằng khai báo tường minh, mà **vẫn giữ nguyên UI cho người dùng**.
- Google đã đưa vào toolchain: Lighthouse gọi CDP domain `WebMCP` để theo dõi sự kiện đăng ký tool — tức **có khai báo tool hay không là một tiêu chí chấm điểm agent-readiness**.
- **MCP (server-side)** khác WebMCP: đó là server expose capability qua giao thức chuẩn, mỗi tool *"performs a single operation with clearly defined inputs and outputs"*, validate bằng JSON Schema. WebMCP *"complements existing protocols like MCP rather than replacing backend integrations."*

**Khi nào nên cho agent đường API/tool thay vì bắt nó click UI** (suy luận có căn cứ từ các số liệu ở trên):
- Thao tác **không hoàn tác được** — Operator 5/100 lỗi loại này.
- Dữ liệu là **chuỗi chính xác dễ sai OCR** — API key, mã đơn, SKU.
- Luồng **nhiều bước dễ bỏ sót Submit** — "Incomplete Steps" là một trong 5 nhóm lỗi chính.

**Sai lầm hay gặp:** Nghĩ phải chọn một trong hai — hoặc UI cho người, hoặc API cho máy. WebMCP sinh ra đúng để không phải chọn: cùng một app, người vẫn thấy UI, agent thì gọi tool đã khai báo.

> [!note] Spec còn đang đổi
> Có mâu thuẫn giữa các nguồn về tên API cuối cùng (`document.modelContext` theo README repo, `navigator.modelContext` theo một số tin tức). Đây là spec **đang phát triển** — đừng viết code production dựa trên nó lúc này, nhưng nên biết hướng đi.

---

## 🛒 Agentic commerce trong hệ Shopify

**Là gì:** Người mua hỏi AI rồi mua **qua** AI. Với dev Shopify thì đây không còn là chuyện tương lai — nó đã có chuẩn, có API, có số liệu.

**Giải thích dễ hiểu — bức tranh giao thức:**

- **UCP (Universal Commerce Protocol)** — chuẩn mở do **Google + Shopify** đồng phát triển, công bố **11/01/2026**, đồng phát triển cùng Etsy, Wayfair, Target, Walmart; 20+ bên endorse (Adyen, Amex, Mastercard, Stripe, Visa…). Capabilities: catalog search/lookup, cart building, **identity linking qua OAuth 2.0**, checkout, order management. **Đã GA** ở Spring '26 Edition (17/06/2026), và **self-serve**: *"developers don't apply for UCP access, they register their agent profile in the Developer Dashboard."*
- **ACP (Agentic Commerce Protocol)** — OpenAI + Stripe, đi cùng "Instant Checkout". Nhưng **đã bị thu hẹp**: 12/03/2026 OpenAI tuyên bố *"Instant Checkout is moving to Apps"*.
- **Agentic Storefronts** — nơi quản lý tập trung trong Shopify Admin cho ChatGPT, Perplexity, Microsoft Copilot, Google AI Mode/Gemini (ra mắt Winter '26 Edition, 10/12/2025).
- **MCP servers của Shopify:** Cart MCP, Checkout MCP, Order MCP + Catalog APIs. Ngoài ra có Storefront MCP và Customer Accounts MCP.
- **`/agents.md` và `/llms.txt` đã có sẵn trên mọi storefront** (changelog 28/05/2026, hiệu lực 29/05): merchant override bằng `templates/agents.md.liquid`, `templates/llms.txt.liquid`, `templates/llms-full.txt.liquid`.

**Số liệu thật (có nguồn, có kỳ đo):**

| Chỉ số | Con số | Nguồn / kỳ đo |
|---|---|---|
| Referral sessions từ AI chatbot | **+8x YoY** | Shopify, Q1 2026 |
| **AI-referred orders** | **+13x YoY** | Shopify, Q1 2026 |
| AOV của đơn AI-referred | **+14%** so với organic | Shopify, Q1 2026 |
| Conversion trên product detail page | **+~50%** so với organic search | Shopify, Q1 2026 |
| Thắng organic ở | **23/25 category**, trung bình +56% | Shopify, Q1 2026 |
| AI search dùng Shopify Catalog | convert **2x** so với dữ liệu scrape | Shopify, Spring '26 |
| AI-referred traffic tới US retail | **+138% YoY** | Adobe Analytics, tháng 5/2026 |

**Nhưng đọc kèm câu cân bằng của chính Shopify:** *"Organic still refers more sessions to Shopify merchants than all tracked AI platforms combined."* Đây là kênh **tăng rất nhanh từ nền thấp**, không phải kênh đã thay thế search.

**Sai lầm hay gặp:** Nhầm lẫn hai thứ hoàn toàn khác nhau — **product discovery** (agent tìm *sản phẩm* của merchant, đã có chuẩn UCP/Catalog) và **app discovery** (agent gợi ý *app* trên App Store). Cái thứ hai **không có tài liệu chính thức nào** từ Shopify.

---

## 🎁 Nghĩa là gì với một app loyalty như Joy

Phần này gộp các phát hiện cụ thể nhất, và cũng là phần có nhiều **khoảng trống chưa ai lấp** nhất.

**✅ Tin tốt — checkout vẫn chạy trên storefront merchant.** Tài liệu Shopify về agentic checkout nói rõ agent nhận `continue_url` và *"Direct the buyer to the `continue_url` in the response to finish checkout on the merchant's storefront."* Modern Retail (12/03/2026) xác nhận cùng điều: buyer đến từ ChatGPT vẫn hoàn tất mua trên site merchant, đơn về Shopify admin như mọi sales channel khác.
→ Trong kịch bản handoff này, checkout của merchant vẫn là checkout Shopify bình thường. *(Lưu ý: tài liệu **không nói rõ** Checkout UI extension và Shopify Functions có chạy hay không — đây là suy luận, cần tự verify trước khi dựa vào.)*

**⛔ Tin xấu — Cart MCP không có chỗ nào cho loyalty.** Đã kiểm schema: các tool là `create_cart`, `get_cart`, `update_cart`, `cancel_cart`; object `cart` chỉ có `line_items`, `context` (country/region/postal_code), `attribution` (utm_source, utm_campaign), `buyer`, `signals`.
**Không có field nào cho discount code, gift card, cart attributes, hay note.** Trang `carts-and-checkout` cũng không đề cập discount, loyalty point, hay checkout UI extension.
→ Cách duy nhất áp discount tìm được trong tài liệu agent là qua **cart permalink**: append query params vào checkout URL để *"prefill buyer information, apply discounts, add custom tracking data"* — tức discount đi kèm ở **bước handoff sang storefront**, không nằm trong cart của agent.

![[uxui-11-loyalty-agent-flow.svg]]
*Loyalty rơi mất ở bước Cart MCP (không có field discount/gift card), nhưng bám lại được ở bước `continue_url` khi buyer về checkout trên storefront merchant.*

**❓ Khoảng trống thật sự — hãy biết là mình chưa biết:**
- **Điểm thưởng / tier / reward hiển thị thế nào trong luồng agent**: không có tài liệu Shopify hay UCP nào mô tả. Mảnh ghép gần nhất là identity linking OAuth 2.0 của UCP + Customer Accounts MCP, nhưng **không tìm được tài liệu nào nói loyalty balance được expose qua đó**.
- **Widget/popup loyalty trong bề mặt agent**: không có tài liệu. Về bản chất bề mặt agent là khung chat của ChatGPT/Gemini — app không kiểm soát UI ở đó.
- **App bên thứ ba tự expose MCP server cho agent của buyer**: không có tài liệu Shopify. Kênh chính thức duy nhất là **Sidekick app extensions** (Klaviyo, Loop, Smile, Judge.me, Yotpo là launch partner) — nhưng đó là **AI cho merchant trong Admin**, không phải agent của người mua.
- **Built for Shopify**: đã kiểm trang requirements — **không có bất kỳ tiêu chí nào** về AI, agent, MCP, UCP, hay llms.txt. Đây là kết luận chắc chắn, không phải "chưa tìm thấy".

**🪧 Một chi tiết kiến trúc đáng để mắt:** UCP dùng **reverse-domain namespace** để phân quyền, và bài Shopify Engineering lấy đúng ví dụ **`com.loyaltyprovider.*` thuộc về loyaltyprovider.com**. Nghĩa là spec **có chừa chỗ** cho một loyalty vendor định nghĩa extension riêng. Chưa có extension loyalty nào được publish mà tra ra được — đây là khoảng trống, và khoảng trống thì có thể là cơ hội.

**Việc làm được ngay, không cần chờ ai:**
1. Kiểm robots.txt / Cloudflare của landing page + docs site — đừng chặn nhầm `OAI-SearchBot`, `Claude-SearchBot` (xem mốc 15/09/2026 ở trên).
2. Viết lại nội dung docs/landing theo công thức thắng của GEO: **trích dẫn có nguồn + số liệu cụ thể**, bỏ hết đoạn nhồi keyword.
3. Chạy **Lighthouse → category Agentic Browsing** trên admin app và storefront widget, sửa hết lỗi "Names and labels".
4. Rà lại widget storefront: có nút nào là `<div onclick>` không? Có chart nào là canvas không kèm bảng không? Có trạng thái nào chỉ tồn tại dưới dạng class CSS không?

---

## ⚠️ Những claim phổ biến KHÔNG có bằng chứng

Mục này quan trọng ngang phần còn lại của bài — để bạn không đốt thời gian và tiền vào thứ chưa ai chứng minh.

| Claim bạn sẽ nghe rất nhiều | Sự thật kiểm chứng được |
|---|---|
| **"llms.txt giúp AI hiểu và giới thiệu sản phẩm của bạn"** | Ahrefs quét **137.210 domain** (tháng 5/2026): 28% có publish file, nhưng **97% file nhận 0 request**. Trong số request ít ỏi còn lại, **96% đến từ bot** và **77% bot đó không phải AI** (SEO tool, BuiltWith…). Chỉ **1,1%** là AI retrieval bot. **0%** AI bot chủ động đi dò file này ở site không có. John Mueller (Google, 17/06/2025): *"FWIW no AI system currently uses llms.txt."* — Nghịch lý: OpenAI, Anthropic, Google đều **publish** llms.txt cho docs của họ, và Lighthouse có audit nó, nhưng **không lab nào cam kết đọc nó**. Chi phí thấp nên làm cũng chẳng hại; chỉ đừng kỳ vọng. |
| **"Schema.org/JSON-LD giúp LLM trích dẫn bạn"** | Không có bằng chứng nào. Giá trị đã xác minh của schema là **Google rich result**, không phải LLM citation. Và `FAQPage` thì rich result đã bị gỡ từ **07/05/2026**. |
| **"Reddit chiếm ~40% mọi citation của AI"** | Mâu thuẫn trực tiếp với dữ liệu Similarweb (Reddit **11,97%** trên ChatGPT, **4,19%** trên Google AI Mode). Nguồn của con số 40% không truy được. |
| **"G2/Capterra là nguồn AI tin nhất khi gợi ý SaaS"** | Hợp lý về trực giác nhưng **không có trong top-20** của cả hai engine theo Similarweb, và không có nghiên cứu định lượng nào. Là giả định, không phải sự thật. |
| **"GEO tăng visibility 40%"** | Con số có thật trong paper, nhưng là **mức tương đối tối đa trên một metric với context cố định 5 document** — survey phản biện 2026 nói rõ không tổng quát hoá được sang ranking thực tế. |
| **"Heading dạng câu hỏi làm tăng khả năng được cite"** | Chỉ có bằng chứng **gián tiếp** về tỉ lệ *kích hoạt* AI Overview (13,7% chung → **64,7%** với query dạng câu hỏi), **không phải** về việc bạn được trích dẫn. Là suy luận, không phải bằng chứng. |
| **"Bảng so sánh / ngày cập nhật giúp được AI trích dẫn"** | Không tìm được nghiên cứu nào. Kinh nghiệm cộng đồng. |
| **`noai` meta tag** | Không có nhà cung cấp lớn nào cam kết tôn trọng nó. Đừng dựa vào. |
| **"AEO / LLMO là bộ môn riêng"** | Không tìm được định nghĩa từ nguồn chuẩn hay học thuật. Là nhãn marketing đặt sau **GEO** — thuật ngữ duy nhất có paper peer-reviewed (KDD 2024). |

---

## ✅ Tóm lại / Checklist

**Nửa Discovery — để agent giới thiệu app của bạn:**
- [ ] Tôi biết **web mention (r=0,664) mạnh gấp ~3 lần backlink (r=0,218)** và đầu tư tương ứng — vào việc được cộng đồng nhắc tên, không phải đi mua link.
- [ ] Nội dung của tôi có **trích dẫn có nguồn** và **số liệu cụ thể** (hai chiến thuật điểm cao nhất trong GEO-bench: 27,2 và 25,2).
- [ ] Tôi đã **bỏ hết đoạn nhồi keyword** — nó cho điểm 17,7, **thấp hơn** cả baseline 19,3.
- [ ] Tôi kiểm robots.txt và **không chặn nhầm** `OAI-SearchBot` / `Claude-SearchBot` / `ChatGPT-User`.
- [ ] Tôi đã kiểm setting Cloudflare trước mốc **15/09/2026** (chặn Training có thể kéo theo chặn Googlebot).
- [ ] Schema `SoftwareApplication` của tôi đủ `name` + `offers.price` + (`aggregateRating` hoặc `review`) — và tôi hiểu nó phục vụ **Google rich result**, không phải LLM.

**Nửa Operability — để agent dùng được app của bạn:**
- [ ] Mọi element tương tác là **`<button>` / `<a>` thật**, không phải `<div onclick>`.
- [ ] Mọi element tương tác có **accessible name bằng text**, không chỉ icon.
- [ ] Element quan trọng có **id / `data-testid` ổn định**, không phụ thuộc class hash của CSS-in-JS.
- [ ] **Layout không nhảy** sau khi load (CLS) — Chrome đo cái này chính vì "agent misclicks".
- [ ] Chart canvas luôn kèm **bảng dữ liệu thật** — canvas không lộ gì ra DOM/a11y tree.
- [ ] Trạng thái loading/disabled/error nằm trong **`aria-busy` / `aria-disabled` / `aria-invalid`**, không chỉ trong class CSS.
- [ ] Thông báo lỗi là **text thật trong DOM**, không phải ảnh/icon (agent OCR rất tệ).
- [ ] Hành động phá huỷ có **bước xác nhận riêng, nói rõ hậu quả bằng text** (giảm rủi ro ~90%).
- [ ] Nội dung do user khác tạo (review, comment) được coi là **nguồn prompt injection**.
- [ ] Tôi đã chạy **Lighthouse → Agentic Browsing** và sửa hết lỗi Names and labels.

**Riêng Shopify / loyalty:**
- [ ] Tôi biết **Cart MCP hiện không có field discount / gift card / cart attribute** — và đã tính đường đi cho reward qua cart permalink ở bước `continue_url`.
- [ ] Tôi phân biệt được **product discovery** (đã có chuẩn UCP) và **app discovery** (chưa có tài liệu nào).
- [ ] Tôi biết **Built for Shopify chưa có tiêu chí nào về AI/agent** — nên đây là việc làm vì lợi ích thật, không phải để qua review.

---

## 🔗 Nguồn tham khảo

**Discovery / GEO**
- Aggarwal et al. — *GEO: Generative Engine Optimization* (KDD 2024): https://arxiv.org/abs/2311.09735 — bảng kết quả từng chiến thuật: https://arxiv.org/html/2311.09735v2
- Martinez — *Optimizing Visibility in Generative Engines: A Critical Survey (2023–2026)*: https://arxiv.org/html/2607.14035v1
- Ahrefs — *AI Overview brand correlation study* (75.000 brand): https://ahrefs.com/blog/ai-overview-brand-correlation/
- Ahrefs — *llms.txt study* (137.210 domain): https://ahrefs.com/blog/llmstxt-study/
- Similarweb — *Most cited domains in LLMs*: https://aisearch.similarweb.com/blog/most-cited-domains-llms/
- Semrush — *Most cited domains in AI*: https://www.semrush.com/blog/most-cited-domains-ai/
- Search Engine Roundtable — phát biểu của John Mueller về llms.txt: https://www.seroundtable.com/google-ai-llms-txt-39607.html
- llms.txt spec gốc (Jeremy Howard, Answer.AI): https://llmstxt.org/

**Crawler & structured data**
- OpenAI — tài liệu bot chính thức: https://developers.openai.com/api/docs/bots
- Anthropic — crawler và cách chặn: https://privacy.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler
- Cloudflare — thay đổi mặc định AI traffic 15/09/2026: https://blog.cloudflare.com/content-independence-day-ai-options/
- Google — `SoftwareApplication` structured data: https://developers.google.com/search/docs/appearance/structured-data/software-app
- Google — deprecation của FAQ rich result: https://developers.google.com/search/docs/appearance/structured-data/faqpage

**Agent thao tác giao diện**
- Chrome — *The agent-ready toolkit* (22/06/2026): https://developer.chrome.com/blog/agent-ready-toolkit
- Chrome — Lighthouse Agentic Browsing, accessibility for agents: https://developer.chrome.com/docs/lighthouse/agentic-browsing/accessibility-for-agents
- web.dev — *AI agent site UX*: https://web.dev/articles/ai-agent-site-ux
- Anthropic — Computer use (toạ độ theo screenshot pixel, cảnh báo injection): https://platform.claude.com/docs/en/docs/build-with-claude/computer-use
- Anthropic — Claude for Chrome (23,6% → 11,2%): https://claude.com/blog/claude-for-chrome
- OpenAI — *Operator System Card*: https://cdn.openai.com/operator_system_card.pdf
- Playwright — Locators (role → test id → CSS): https://playwright.dev/docs/locators
- MDN — `<canvas>` không lộ nội dung ra DOM: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/canvas
- MDN — `aria-busy`: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-busy
- MDN — `aria-invalid`: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-invalid
- WebMCP (W3C Web Machine Learning CG): https://github.com/webmachinelearning/webmcp
- Model Context Protocol — server concepts: https://modelcontextprotocol.io/docs/learn/server-concepts

**Benchmark & bảo mật**
- Online-Mind2Web (COLM 2025) — 300 task / 136 site thật: https://arxiv.org/abs/2504.01382
- WebArena: https://arxiv.org/html/2307.13854v4
- WASP — prompt injection benchmark, *"security by incompetence"*: https://arxiv.org/abs/2504.18575
- OWASP — LLM01:2025 Prompt Injection: https://genai.owasp.org/llmrisk/llm01-prompt-injection/
- Anthropic — *Prompt injection defenses*: https://www.anthropic.com/research/prompt-injection-defenses

**Shopify / agentic commerce**
- Shopify Engineering — *UCP* (ví dụ namespace `com.loyaltyprovider.*`): https://shopify.engineering/UCP
- UCP spec chính thức: https://ucp.dev/
- Shopify — *AI commerce at scale* (11/01/2026): https://www.shopify.com/news/ai-commerce-at-scale
- Shopify — Spring '26 Edition for developers (UCP/Catalog API GA): https://www.shopify.com/news/spring-26-edition-dev
- Shopify — Winter '26 Edition, Agentic Storefronts: https://www.shopify.com/news/winter-26-edition-agentic-storefronts
- shopify.dev — Agents (Cart/Checkout/Order MCP): https://shopify.dev/docs/agents
- shopify.dev — Cart MCP schema (chứng minh không có field discount): https://shopify.dev/docs/agents/carts-and-checkout/cart-mcp
- shopify.dev — Agentic checkout & `continue_url`: https://shopify.dev/docs/agents/checkout
- shopify.dev — changelog `/agents.md`, `/llms.txt` cho storefront: https://shopify.dev/changelog/customize-llmstxt-llms-fulltxt-and-agentsmd
- shopify.dev — Built for Shopify requirements (không có tiêu chí AI): https://shopify.dev/docs/apps/launch/built-for-shopify/requirements
- Shopify — số liệu AI search Q1 2026 (8x sessions, 13x orders): https://www.shopify.com/enterprise/blog/ai-search-insights
- Modern Retail (12/03/2026) — OpenAI thu hẹp Instant Checkout: https://www.modernretail.co/technology/shopify-says-purchases-are-coming-inside-chatgpt-through-agentic-storefronts-as-openai-retreats-on-instant-checkout/
- Digital Commerce 360 — số liệu Adobe Analytics tháng 5/2026: https://www.digitalcommerce360.com/2026/06/17/adobe-ai-referred-traffic-to-retail-sites-doubles-in-a-year/

---

> 🤖 Note tổng hợp ngày 03/09/2026 từ nghiên cứu peer-reviewed (KDD 2024, COLM 2025), tài liệu chính thức của Google/Chrome, OpenAI, Anthropic, Cloudflare và Shopify. Mọi claim không có bằng chứng đã được tách riêng vào mục [[#⚠️ Những claim phổ biến KHÔNG có bằng chứng]] thay vì viết lẫn vào nội dung chính.
