---
tags:
  - ui
  - typography
  - visual-design
type: note
created: 2026-08-23
---

# 04 - Typography

## 📌 Ý chính của bài

Typography (nghệ thuật sắp đặt chữ) là phần cốt lõi của giao diện một web app hay dashboard SaaS — vì hầu hết những gì người dùng nhìn thấy trên màn hình đều là chữ. Nhà thiết kế Oliver Reichenstein từng có một câu nói nổi tiếng "Web Design is 95% Typography" (2006) — đây là một **quan điểm** để nhấn mạnh tầm quan trọng của chữ, không phải một con số thống kê đo đạc được. Ý tưởng đằng sau: bạn có thể không giỏi vẽ icon hay minh họa, nhưng nếu chữ được sắp xếp tốt thì sản phẩm đã trông chuyên nghiệp hơn hẳn.

Bài này không dạy bạn thẩm mỹ cao siêu, mà đưa ra các **quy tắc có thể áp dụng máy móc**: chọn thang cỡ chữ như thế nào, giãn dòng bao nhiêu, một dòng nên dài bao nhiêu ký tự, dùng mấy độ đậm... Đây là những con số và nguyên tắc bạn cứ tuân theo là ra kết quả ổn, không cần "có mắt thẩm mỹ".

Điều quan trọng nhất cần nhớ: **hệ thống hóa mọi thứ**. Đừng chọn cỡ chữ, độ giãn dòng theo cảm tính từng chỗ. Hãy định nghĩa sẵn một bộ giá trị hữu hạn và chỉ dùng trong bộ đó (liên quan chặt tới [[06 - Spacing & Design Tokens]]).

---

## 🔤 Type Scale (Thang cỡ chữ modular)

**Type Scale** là một tập hợp hữu hạn các cỡ chữ được định nghĩa sẵn để dùng cho toàn bộ sản phẩm — ví dụ chỉ dùng 12, 14, 16, 18, 20, 24, 30, 36, 48px chứ không dùng bừa 15, 17, 19, 23px...

**Giải thích dễ hiểu:** Hãy tưởng tượng bạn đi mua áo. Cửa hàng chỉ bán size S, M, L, XL chứ không may đo từng cm. Type Scale cũng vậy: thay vì mỗi lần cần chữ to hơn một chút lại tự nghĩ ra một con số mới, bạn giới hạn mình trong một "bảng size" cố định. Điều này giúp giao diện nhất quán và giảm quyết định phải đưa ra.

Chữ "modular" nghĩa là các cỡ có quan hệ theo một **tỉ lệ** (ratio) nhất định. Ví dụ tỉ lệ 1.25 (major third): mỗi cỡ lớn hơn cỡ trước khoảng 25%. Nhưng theo Refactoring UI, các thang tính bằng tỉ lệ toán học thuần túy đôi khi cho ra các cỡ quá gần nhau ở phần lớn (ví dụ 40px và 50px khó phân biệt) hoặc bước nhảy quá thô ở phần nhỏ. Vì thế lời khuyên thực dụng là: **tự chọn tay một bộ cỡ cố định** (hard-coded) hợp lý, thay vì bám cứng công thức nhân.

**Ví dụ một thang thực dụng:** 12, 14, 16, 18, 20, 24, 30, 36, 48, 60, 72px. Bạn thấy khoảng cách giữa các cỡ nhỏ thì sít, cỡ lớn thì thưa dần — đúng như mắt cần.

![[uxui-04-type-scale.svg]]
*Trái: chọn cỡ chữ tùy tiện mỗi chỗ một kiểu; phải: thang cỡ cố định 12/14/16/18/20/24/30/36/48px.*

**Sai lầm hay gặp:**
- Dùng cỡ chữ tùy tiện mỗi component một kiểu (15px chỗ này, 17px chỗ kia) → giao diện trông lộn xộn mà không hiểu vì sao.
- Định nghĩa thang bằng đơn vị `em` lồng nhau khiến cỡ chữ bị nhân chồng theo cây DOM, cuối cùng không kiểm soát được. Nên định nghĩa thang bằng giá trị tuyệt đối (px) hoặc `rem`.

> [!tip] Liên hệ: Việc giới hạn cỡ chữ trong một bộ hữu hạn chính là tư tưởng design token — xem [[06 - Spacing & Design Tokens]].

---

## 🅰️ Font Family & Font Pairing (Serif / Sans-serif / Monospace)

**Font Family** là "họ" font, tức kiểu dáng con chữ. Có ba nhóm chính:

- **Serif** (font có chân): mỗi nét chữ có phần "chân" nhỏ ở đầu/cuối, ví dụ Georgia, Times, Merriweather. Cảm giác cổ điển, trang trọng, "giấy in". Thường dùng cho nội dung đọc dài (bài báo, sách).
- **Sans-serif** (font không chân): nét chữ trơn, không có chân, ví dụ Inter, Roboto, Helvetica, Arial. Cảm giác hiện đại, sạch sẽ. Đây là lựa chọn mặc định cho hầu hết web app và dashboard SaaS.
- **Monospace** (font đơn cách): mọi ký tự rộng bằng nhau, ví dụ Menlo, Consolas, JetBrains Mono. Dùng cho code, số liệu cần thẳng cột, API key, terminal.

**Font Pairing (ghép font)** là việc dùng hai font khác nhau trong cùng sản phẩm — thường một font cho heading (tiêu đề) và một font cho body (nội dung).

**Giải thích dễ hiểu:** Ghép font giống ghép đồ. Cách an toàn nhất là chỉ dùng **một font family duy nhất** cho cả sản phẩm, rồi tạo phân cấp bằng cỡ và độ đậm (nhiều font hiện đại như Inter có đủ độ đậm để làm việc này). Nếu muốn ghép hai font, quy tắc thực dụng: chọn font tương phản rõ (ví dụ một serif cho heading + một sans-serif cho body) chứ đừng ghép hai font quá giống nhau.

**Ví dụ:** Một SaaS dashboard dùng Inter cho toàn bộ giao diện, chỉ đổi sang một font monospace (như JetBrains Mono) ở chỗ hiển thị mã lệnh và ID. Đó là ghép font "an toàn và có mục đích".

![[uxui-04-serif-vs-sans.jpg]]
*Cặp chữ "Sy": font serif (đỏ) có phần "chân" ở đầu/cuối nét, sans-serif thì trơn — (nguồn: Wikimedia Commons)*

**Sai lầm hay gặp:**
- Dùng 3-4 font khác nhau trong một trang → rối, thiếu chuyên nghiệp.
- Chọn font quá "cá tính"/trang trí cho body text → khó đọc khi hiển thị nhiều dòng.
- Quên khai báo font dự phòng (fallback stack), khiến khi font chính chưa load thì layout nhảy giật.

---

## 🏋️ Font Weight & Hierarchy (Độ đậm của chữ)

**Font Weight** là độ đậm/mảnh của nét chữ, thường đánh số từ 100 (mỏng nhất) đến 900 (đậm nhất): 400 là Regular (thường), 500 Medium, 600 Semibold, 700 Bold.

**Giải thích dễ hiểu:** Độ đậm là công cụ mạnh để tạo **phân cấp** (hierarchy) mà không cần đổi cỡ chữ. Một tiêu đề đậm hơn nội dung xung quanh sẽ tự động "nổi" lên, dù cùng cỡ.

Hai lời khuyên thực dụng theo Refactoring UI:
1. **Đừng dùng font weight dưới 400 cho chữ nhỏ.** Chữ mảnh (weight 100-300) trông đẹp ở cỡ rất lớn (như tiêu đề landing page 60px), nhưng ở cỡ body 14-16px thì mờ nhạt, khó đọc, nhất là trên màn hình độ phân giải thấp.
2. **Tạo tương phản bằng cách hạ độ đậm của chữ phụ, thay vì tăng độ đậm của chữ chính.** Ví dụ để làm text phụ (secondary) mờ đi, người ta hay đổi màu xám nhạt — nhưng cách tốt hơn nhiều khi trên nền có màu là giảm độ đậm hoặc dùng màu cùng tông ít tương phản, tránh làm chữ bị "bẩn".

**Ví dụ:** Trong một card thống kê: con số "1,204" dùng weight 600, nhãn "Người dùng mới" bên dưới dùng weight 400 và cỡ nhỏ hơn. Chỉ hai mức đậm là đủ tạo phân cấp rõ ràng.

![[uxui-04-font-weight.svg]]
*Card "1,204 / Người dùng mới": bôi đậm tất cả thì không gì nổi bật; và weight dưới 400 làm chữ nhỏ mờ nhạt.*

**Sai lầm hay gặp:**
- Dùng quá nhiều mức độ đậm (400, 500, 600, 700, 800 lẫn lộn) → mất kiểm soát phân cấp. Thực tế 2-3 mức là đủ.
- Bôi đậm quá nhiều thứ → khi mọi thứ đều nổi bật thì chẳng có gì nổi bật (liên quan [[03 - Visual Hierarchy & Layout]]).

---

## 📏 Line Height / Leading (Giãn dòng)

**Line Height** (tiếng in ấn cổ gọi là **Leading**, đọc là "led-ding") là khoảng cách giữa các dòng chữ, tính từ đường baseline dòng này tới baseline dòng kế.

![[uxui-04-line-terms.png]]
*Các đường chuẩn của một dòng chữ: baseline, x-height, ascender, descender — line-height đo từ baseline dòng này tới baseline dòng kế — (nguồn: Wikimedia Commons)*

**Giải thích dễ hiểu:** Nếu các dòng quá sát nhau, mắt dễ bị "lạc" khi nhảy từ cuối dòng này sang đầu dòng sau, đọc mệt. Nếu quá thưa, các dòng rời rạc, không còn cảm giác là một khối văn bản liền mạch.

Quy tắc thực dụng:
- Với **body text** (nội dung đọc), line-height khoảng **1.5** (tức 150% cỡ chữ) là điểm khởi đầu an toàn. Butterick khuyên vùng 1.2-1.45 cho in ấn, nhưng trên web nhiều nguồn (gồm Material Design và WCAG) nghiêng về 1.5 cho dễ đọc.
- Có mối quan hệ nghịch quan trọng: **dòng càng dài thì cần line-height càng lớn**, và **chữ càng nhỏ cũng cần line-height lớn hơn** tương đối. Ngược lại, tiêu đề cỡ lớn cần line-height nhỏ hơn (khoảng 1.0-1.25) vì để 1.5 sẽ khiến các dòng tiêu đề rời nhau quá xa.

**Ví dụ:** Đoạn mô tả trong bảng giá dùng cỡ 16px, line-height 1.5. Tiêu đề section 36px thì hạ line-height xuống khoảng 1.1 cho gọn khối.

![[uxui-04-line-spacing.png]]
*Cùng một đoạn văn với các mức giãn dòng khác nhau — quá sít thì mắt lạc dòng, quá thưa thì rời rạc — (nguồn: Wikimedia Commons)*

![[uxui-04-line-height-ui.svg]]
*Đúng ví dụ trong bài: mô tả bảng giá 16px nên để 1.5, còn tiêu đề section 36px phải hạ xuống ~1.1.*

**Sai lầm hay gặp:**
- Đặt một line-height cố định (ví dụ luôn 1.5) cho cả tiêu đề lẫn body → tiêu đề bị "banh" ra.
- Dùng line-height có đơn vị cứng (ví dụ 24px) áp cho nhiều cỡ chữ khác nhau → chỗ hợp chỗ không. Nên dùng hệ số không đơn vị để nó co giãn theo cỡ chữ.

---

## 📐 Measure / Line Length (Độ dài dòng ~50-75 ký tự)

**Measure** là thuật ngữ typography chỉ **độ dài của một dòng văn bản** — đo bằng số ký tự trên một dòng (tính cả dấu cách).

**Giải thích dễ hiểu:** Khi mắt đọc hết một dòng, nó phải "nhảy" ngược về đầu dòng dưới. Nếu dòng quá dài, cú nhảy này dễ trượt (đọc lại dòng cũ hoặc nhảy hụt dòng). Nếu dòng quá ngắn, mắt phải nhảy liên tục, mệt và mất nhịp.

Con số vàng: **khoảng 45-75 ký tự mỗi dòng** cho văn bản đọc dài, lý tưởng quanh **66 ký tự** (theo cả Butterick và các giáo trình typography). Butterick nêu vùng 45-90 ký tự, thực dụng nhất là nhắm 50-75.

**Ví dụ:** Bạn không kiểm soát điều này bằng cách đếm ký tự thủ công, mà bằng cách giới hạn **chiều rộng tối đa** của khối văn bản (max-width). Một đoạn văn body 16px giới hạn bề rộng cỡ 600-700px thường cho ra khoảng 60-75 ký tự/dòng.

![[uxui-04-measure.svg]]
*Ba trường hợp: dòng ~150 ký tự chạy hết màn hình, cột sidebar dưới 40 ký tự, và khối vừa ~66 ký tự nhờ max-width 600-700px.*

**Sai lầm hay gặp:**
- Để đoạn văn dài chạy hết chiều ngang màn hình lớn (dòng dài cả 150 ký tự) → cực khó đọc. Đây là lỗi phổ biến nhất trên trang tài liệu (docs) và blog trong app.
- Nhồi văn bản vào cột quá hẹp (dưới 40 ký tự) trong sidebar → ngắt dòng lộn xộn, nhiều dấu gạch nối.

---

## ↔️ Letter Spacing / Tracking & Kerning (Giãn ký tự)

Ba khái niệm liên quan tới khoảng cách ngang giữa các chữ cái:

- **Letter Spacing / Tracking**: điều chỉnh khoảng cách **đồng đều** giữa tất cả các ký tự trong một khối chữ (giãn ra hoặc bóp lại toàn bộ).
- **Kerning**: điều chỉnh khoảng cách giữa **từng cặp ký tự cụ thể** cho cân mắt (ví dụ cặp "AV" hay "To" tự nhiên bị hở, cần bóp lại). Cái này font chất lượng tốt tự lo, dev hầu như không phải đụng tới.

**Giải thích dễ hiểu:** Với body text, font đã được nhà thiết kế cân sẵn khoảng cách tối ưu — **đừng đụng vào**. Letter spacing chỉ thực sự hữu ích ở hai chỗ:
1. **Tiêu đề rất lớn**: chữ càng to thì khoảng cách mặc định trông càng thừa, nên **bóp letter-spacing âm một chút** (giãn âm, ví dụ -0.02em) cho chặt và sang.
2. **Chữ IN HOA (uppercase)**, đặc biệt là nhãn nhỏ như "OVERVIEW", "SETTINGS": chữ hoa mặc định trông bị chật, nên **nới letter-spacing dương một chút** cho dễ đọc và trông có chủ ý.

**Ví dụ:** Nhãn danh mục viết hoa cỡ 12px trong sidebar → tăng letter-spacing nhẹ. Tiêu đề hero 60px → giảm letter-spacing nhẹ.

![[uxui-04-tracking-kerning.png]]
*Phân biệt tracking (giãn đều toàn khối) với kerning (chỉnh riêng từng cặp ký tự như "AV") — (nguồn: Wikimedia Commons)*

**Sai lầm hay gặp:**
- Giãn letter-spacing cho body text thường (không hoa) → làm chữ khó đọc hơn, phá nhịp mà font đã cân.
- Nhầm rằng phải tự chỉnh kerning bằng tay — với web app gần như không bao giờ cần.

---

## 🪜 Hierarchy chữ (Heading / Body / Caption)

**Typographic Hierarchy** là cách tổ chức chữ thành các "cấp" rõ ràng để mắt biết đâu là chính, đâu là phụ, đọc theo thứ tự nào.

Ba cấp cơ bản nhất:
- **Heading (tiêu đề)**: cỡ lớn, đậm, dẫn dắt cấu trúc trang (h1, h2, h3...).
- **Body (nội dung)**: cỡ vừa (14-16px web app), độ đậm thường, dễ đọc — chiếm phần lớn văn bản.
- **Caption / Label (chú thích, nhãn)**: cỡ nhỏ (12-13px), thường mờ hơn hoặc viết hoa, dùng cho nhãn field, chú thích ảnh, metadata (thời gian, trạng thái).

**Giải thích dễ hiểu:** Bạn tạo phân cấp bằng **ba đòn bẩy** kết hợp: **cỡ chữ** (size), **độ đậm** (weight), và **màu/độ tương phản** (color/contrast). Mẹo quan trọng từ Refactoring UI: đừng chỉ dựa vào cỡ chữ. Nhiều khi giảm độ đậm và làm chữ phụ nhạt màu hơn còn hiệu quả hơn là phóng to chữ chính. Ba mức tương phản màu thường dùng cho chữ: **màu chính (primary, đậm nhất) cho nội dung quan trọng, màu phụ (secondary) cho nội dung thường, màu mờ (tertiary/muted) cho thông tin phụ trợ.**

**Ví dụ:** Một dòng trong danh sách thông báo: tiêu đề thông báo dùng màu primary weight 600, nội dung tóm tắt dùng màu secondary weight 400, thời gian "2 giờ trước" dùng caption cỡ 12px màu muted. Ba cấp rõ ràng chỉ trong một dòng.

![[uxui-04-hierarchy.svg]]
*Dòng thông báo với "2 giờ trước" làm caption, và ba đòn bẩy tạo phân cấp: cỡ chữ, độ đậm, màu.*

**Sai lầm hay gặp:**
- Tạo phân cấp chỉ bằng cỡ chữ, khiến phải dùng chữ rất to mới phân biệt được → tốn diện tích.
- Không có cấp caption/label riêng → metadata (giờ, trạng thái) tranh chấp sự chú ý với nội dung chính.

> [!info] Đây là ứng dụng trực tiếp của nguyên tắc thị giác trong [[03 - Visual Hierarchy & Layout]].

---

## 👁️ Readability vs Legibility (Dễ đọc dài vs Nhận diện ký tự)

Hai từ tiếng Anh nghe giống nhau nhưng nghĩa khác nhau:

- **Legibility (khả năng nhận diện ký tự)**: các chữ cái có phân biệt được với nhau không? Font có legibility tốt là font mà bạn không nhầm chữ "l" (L thường), "I" (i hoa) và "1" (số một); phân biệt được "O" (chữ) và "0" (số không). Đây là **thuộc tính của bản thân font**.
- **Readability (khả năng đọc trôi chảy)**: cả một đoạn văn có dễ đọc liền mạch không? Cái này phụ thuộc **cách bạn sắp đặt**: line-height, độ dài dòng, cỡ chữ, độ tương phản màu nền/chữ, khoảng cách giữa đoạn.

**Giải thích dễ hiểu:** Legibility là "nhìn một ký tự có rõ không", Readability là "đọc cả đống chữ có mệt không". Một font legibility tốt vẫn có thể bị bạn sắp đặt kém khiến readability tệ (ví dụ dòng dài 150 ký tự, line-height 1.0, chữ xám nhạt trên nền trắng).

**Ví dụ với SaaS:** Chọn font legibility cao đặc biệt quan trọng ở dashboard vì có nhiều **số, ID, mã**. Nếu người dùng không phân biệt được `0` và `O` trong một API key thì đó là lỗi legibility nghiêm trọng. Nhiều font (như Inter, JetBrains Mono) có tính năng "slashed zero" (số 0 có gạch chéo) để giải quyết đúng vấn đề này.

![[uxui-04-legibility-readability.svg]]
*Legibility là chuyện của font (phân biệt 0/O, 1/l/I trong API key); readability là chuyện của cách sắp đặt (dòng dài, line-height 1.0, chữ xám nhạt).*

**Sai lầm hay gặp:**
- Chọn font trông đẹp trên poster nhưng có các ký tự dễ nhầm → tệ cho app hiển thị dữ liệu.
- Nghĩ rằng "chọn font tốt là xong" mà bỏ qua sắp đặt (readability). Font tốt là điều kiện cần, không đủ.

> [!warning] Độ tương phản giữa màu chữ và nền là một phần cốt lõi của readability — và cũng là yêu cầu bắt buộc về khả năng tiếp cận. Xem [[08 - Accessibility (a11y)]] cho các mức tương phản tối thiểu (WCAG).

---

## 🧰 Mẹo chọn font cho SaaS / Dashboard

Tổng hợp các mẹo thực dụng riêng cho web app dữ liệu:

- **Mặc định chọn một sans-serif hiện đại, trung tính.** Inter, Roboto, và system font stack (font mặc định của hệ điều hành) là các lựa chọn an toàn, nhẹ, quen mắt. Dùng system font còn giúp app load nhanh (không phải tải font ngoài).
- **Ưu tiên legibility cho dữ liệu.** Vì dashboard đầy số và mã, hãy ưu tiên font phân biệt rõ `0/O`, `1/l/I`. Cân nhắc bật slashed zero nếu font hỗ trợ.
- **Dùng tabular figures (chữ số đều cột) cho bảng số.** Đây là biến thể chữ số mà mọi số rộng bằng nhau (số 1 rộng bằng số 8), giúp các số thẳng cột trong bảng và không bị "nhảy" khi cập nhật realtime. Rất quan trọng cho bảng tài chính, thống kê.
- **Một font monospace cho code/ID/terminal.** Tách riêng phần kỹ thuật (mã lệnh, key) bằng monospace giúp người dùng nhận ra ngay "đây là thứ máy đọc".
- **Giữ số lượng font tối thiểu.** Lý tưởng: một sans-serif cho UI + một monospace cho code. Thêm font là thêm cân nặng tải về và rủi ro layout shift.
- **Chú ý web font loading.** Font tải chậm gây nhấp nháy chữ (FOUT/FOIT) và nhảy layout. Dùng cơ chế `font-display: swap` và khai báo fallback stack cùng metric gần giống để giảm giật (đây là mô tả kỹ thuật, không cần thuộc lòng con số).
- **Body 14-16px là chuẩn web app.** Dashboard mật độ cao thường dùng 14px cho body và bảng; landing/marketing thường 16-18px. Đừng nhỏ hơn 12px cho bất kỳ chữ nào cần đọc.

![[uxui-04-tabular-figures.svg]]
*Bảng doanh thu: chữ số tỉ lệ làm cột số lệch nhau, tabular figures giúp mọi số rộng bằng nhau và thẳng cột.*

---

## ✅ Tóm lại / Checklist

- [ ] Đã định nghĩa một **Type Scale** cố định (bộ cỡ hữu hạn), không dùng cỡ chữ tùy tiện.
- [ ] Chọn **font family** trung tính, hiện đại (sans-serif) làm mặc định; chỉ thêm monospace cho code/ID.
- [ ] Dùng tối đa 2-3 mức **font weight**; không dùng weight < 400 cho chữ nhỏ.
- [ ] **Line-height** body khoảng 1.5; tiêu đề lớn hạ xuống 1.0-1.25.
- [ ] Giới hạn **độ dài dòng** (measure) khoảng 50-75 ký tự bằng max-width.
- [ ] Chỉ chỉnh **letter-spacing** cho tiêu đề rất lớn (âm nhẹ) và nhãn IN HOA (dương nhẹ); để yên body.
- [ ] Có **hierarchy** rõ 3 cấp (heading / body / caption) bằng cỡ + đậm + màu.
- [ ] Ưu tiên **legibility** (phân biệt 0/O, 1/l/I) và **readability** (sắp đặt); bật tabular figures cho bảng số.
- [ ] Kiểm tra **tương phản màu chữ/nền** đạt chuẩn a11y — xem [[08 - Accessibility (a11y)]].

---

## 🔗 Nguồn tham khảo

- Oliver Reichenstein — "Web Design is 95% Typography" (iA, 2006): https://ia.net/topics/the-web-is-all-about-typography-period
- Refactoring UI (Adam Wathan & Steve Schoger) — chương Typography: https://www.refactoringui.com/
- Butterick's Practical Typography — Point size, Line spacing, Line length: https://practicaltypography.com/
- Butterick — Line length (measure): https://practicaltypography.com/line-length.html
- Butterick — Line spacing (leading): https://practicaltypography.com/line-spacing.html
- Material Design 3 — Typography: https://m3.material.io/styles/typography/overview
- Material Design 2 — The type system: https://material.io/design/typography/the-type-system.html
- Inter font (đặc điểm cho UI, slashed zero, tabular figures): https://rsms.me/inter/
