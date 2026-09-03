---
tags:
  - ux
  - ui
  - accessibility
  - a11y
type: note
created: 2026-08-23
---

# 08 - Accessibility (a11y)

> [!info] a11y là gì?
> **Accessibility** (viết tắt **a11y** — vì giữa chữ "a" và "y" có 11 ký tự) nghĩa là làm cho sản phẩm dùng được với **mọi người**, kể cả người khiếm thị, khiếm thính, khó vận động tay, hoặc chỉ đơn giản là đang dùng bàn phím thay chuột. Với dev SaaS, đây không phải "tính năng thêm" — ở nhiều thị trường (EU, US) nó là **yêu cầu pháp lý**, và với mọi thị trường nó mở rộng tệp khách hàng.

## 📌 Ý chính của bài

- **a11y không phải làm cho người khuyết tật, mà làm cho tất cả.** Người bình thường cũng hưởng lợi: dùng bàn phím khi chuột hỏng, xem web ngoài nắng chói (cần contrast tốt), tay bận bế con nên phóng to chữ.
- Có **1 bộ chuẩn quốc tế** để bám vào: **WCAG** — không phải cảm tính, mà có tiêu chí đo được.
- Phần lớn a11y đến **miễn phí** nếu bạn viết HTML đúng ngay từ đầu (dùng đúng thẻ `button`, `label`, `nav`...). Chỉ khi làm component phức tạp mới cần thêm ARIA.
- Nguyên tắc vàng: **"No ARIA is better than bad ARIA"** — ARIA sai còn hại hơn không có.

---

## ♿ WCAG & POUR Principles (Web Content Accessibility Guidelines — Nguyên tắc POUR)

**WCAG** là bộ hướng dẫn chính thức về khả năng tiếp cận web, do **W3C** (tổ chức đặt chuẩn cho web) ban hành. Đây là "hiến pháp" của a11y mà cả thế giới, luật pháp và tòa án đều tham chiếu.

Bản mới nhất hiện nay là **WCAG 2.2** (công bố tháng 10/2023). Nó bổ sung thêm tiêu chí so với WCAG 2.1 chứ không bỏ cái cũ — nên bám theo 2.2 là an toàn.

WCAG xây trên 4 nguyên tắc gốc, viết tắt là **POUR**:

- **P — Perceivable (Cảm nhận được):** Người dùng phải *nhận biết* được nội dung bằng ít nhất một giác quan. Ví dụ: ảnh cần alt text để người khiếm thị "nghe" được; video cần phụ đề để người khiếm thính "đọc" được.
- **O — Operable (Thao tác được):** Mọi chức năng phải dùng được mà *không bắt buộc phải có chuột*. Ví dụ: bấm được menu bằng phím Tab và Enter.
- **U — Understandable (Hiểu được):** Nội dung và cách vận hành phải *dễ đoán*. Ví dụ: form báo lỗi rõ ràng "Email sai định dạng" chứ không chỉ tô đỏ ô input.
- **R — Robust (Bền vững):** Code phải *đủ chuẩn* để các công nghệ hỗ trợ (screen reader, trình duyệt cũ...) đọc đúng. Ví dụ: HTML hợp lệ, không lồng thẻ lung tung.

> [!example] Ví dụ dễ nhớ
> Một cái nút "Mua hàng" đạt POUR khi: nhìn thấy rõ (P), Tab tới bấm Enter được (O), chữ ghi rõ hành động (U), và screen reader đọc đúng là "nút Mua hàng" (R).

![[uxui-08-pour.svg]]
*Bốn nguyên tắc POUR — thiếu bất kỳ cột nào thì nút vẫn fail a11y.*

> [!warning] Sai lầm hay gặp
> Nghĩ a11y là "thêm alt text cho ảnh là xong". Alt text chỉ là 1 phần của chữ P trong POUR. Bỏ quên O (bàn phím) và R (semantic đúng) mới là lỗi phổ biến nhất.

---

## 🎯 Mức tuân thủ A / AA / AAA (Conformance Levels)

WCAG chia tiêu chí thành 3 mức độ khó tăng dần:

- **Mức A (tối thiểu):** Những thứ cơ bản nhất, thiếu là sản phẩm gần như không dùng được với người khuyết tật. Ví dụ: ảnh phải có alt text, dùng được bằng bàn phím.
- **Mức AA (tiêu chuẩn ngành):** Mức mà **hầu hết luật pháp và hợp đồng B2B yêu cầu**. Ví dụ: contrast chữ đạt tỷ lệ nhất định, focus phải nhìn thấy được. **Đây là mục tiêu thực tế bạn nên nhắm tới cho SaaS.**
- **Mức AAA (cao nhất):** Rất khắt khe, thường *không* bắt buộc áp cho toàn bộ trang vì đôi khi bất khả thi. Ví dụ: contrast chữ tới 7:1.

> [!tip] Chốt cho dev SaaS
> Đặt mục tiêu **AA**. Đây là con số bạn cần khi khách hàng doanh nghiệp hỏi "sản phẩm có accessible không?" — họ thường đòi bản **VPAT/AA compliance**.

![[uxui-08-contrast-thresholds.png]]
*Vùng màu đạt từng ngưỡng contrast 3:1 / 4.5:1 / 7:1 — càng lên mức AAA (7:1) thì lựa chọn màu càng bị bó hẹp — (nguồn: Wikimedia Commons)*

> [!warning] Sai lầm hay gặp
> Cố ép AAA cho toàn site rồi kiệt sức bỏ cuộc. WCAG chính thức khuyến nghị không nên coi AAA là mục tiêu cho toàn bộ nội dung.

---

## 🌗 Color Contrast Ratio (Tỷ lệ tương phản màu)

**Contrast ratio** là mức chênh lệch độ sáng giữa **màu chữ** và **màu nền**, biểu diễn dạng tỷ lệ (vd 4.5:1). Chữ xám nhạt trên nền trắng = contrast thấp = khó đọc, nhất là với người thị lực kém hoặc màn hình ngoài nắng.

Ngưỡng WCAG mức **AA**:

- **Text thường: tối thiểu 4.5:1**
- **Text lớn** (khoảng ≥ 18pt, hoặc ≥ 14pt in đậm): **tối thiểu 3:1** — chữ to nên dễ đọc hơn, được nới lỏng
- **Thành phần UI và icon** (viền input, biểu tượng...): tối thiểu **3:1** với nền xung quanh

Mức **AAA** khắt khe hơn: 7:1 cho text thường, 4.5:1 cho text lớn.

> [!example] Ví dụ
> Nút primary màu xanh nhạt với chữ trắng trông "sang" nhưng có thể chỉ đạt 2:1 → fail. Đậm màu nền lên một chút là đạt 4.5:1.

![[uxui-08-contrast.svg]]
*Cùng một nút: contrast thấp thì fail, đậm nền lên một chút là đạt 4.5:1.*

> [!warning] Sai lầm hay gặp
> - Dùng **placeholder màu xám nhạt** làm nhãn chính cho input → gần như luôn fail contrast, và biến mất khi gõ chữ.
> - Đặt **chữ đè lên ảnh** mà không có lớp phủ tối → contrast thay đổi tùy vùng ảnh, chỗ đạt chỗ không.
> - Quên rằng **dark mode** cần kiểm tra contrast riêng — xem thêm [[05 - Color & Theming]].

---

## ⌨️ Keyboard Navigation & Focus Management (Điều hướng bàn phím & Quản lý focus)

Rất nhiều người **không dùng chuột được**: người khiếm thị (dùng screen reader vốn điều khiển bằng phím), người khó vận động tay, và cả power-user thích phím tắt. Nguyên tắc: **mọi thứ click được thì cũng phải Tab tới và Enter/Space kích hoạt được.**

Ba khái niệm cốt lõi:

- **Focus ring (vòng viền focus):** Đường viền sáng bao quanh phần tử đang được chọn bằng bàn phím. Nó cho người dùng biết "tôi đang ở đâu trên trang". **Đừng bao giờ xóa focus ring** (`outline: none`) mà không thay bằng chỉ báo khác rõ ràng hơn — xóa nó là làm mù người dùng bàn phím.
- **Tab order (thứ tự Tab):** Thứ tự con trỏ nhảy khi nhấn Tab. Nó nên đi **theo trình tự đọc tự nhiên** (trái→phải, trên→xuống). Thứ tự này bám theo *thứ tự trong HTML*, nên đừng dùng CSS đảo vị trí phần tử tùy tiện làm lệch logic Tab.
- **Skip link (liên kết bỏ qua):** Một link ẩn, hiện ra khi Tab lần đầu, cho phép nhảy thẳng "Bỏ qua menu, tới nội dung chính". Không có nó, người dùng bàn phím phải Tab qua 30 mục menu trên *mọi* trang mới tới nội dung.

**Focus management** đặc biệt quan trọng với **modal/dialog**: khi mở popup, focus phải nhảy vào trong popup và **bị "nhốt" (focus trap)** ở đó cho tới khi đóng — nếu không, người dùng Tab ra ngoài popup vào phần nền bị che mà không biết.

![[uxui-08-focus-tab.svg]]
*Xóa focus ring là làm mù người dùng bàn phím; tab order đi theo trình tự đọc, modal thì focus trap.*

> [!warning] Sai lầm hay gặp
> - `outline: none` cho "đẹp" mà không thay thế → lỗi a11y kinh điển nhất.
> - Modal mở ra nhưng focus vẫn ở nút ngoài nền → người dùng lạc.
> - Dùng `<div onclick>` làm nút → không Tab tới được (xem mục Semantic HTML bên dưới).

---

## 🔊 Screen Reader & Semantic HTML (Trình đọc màn hình & HTML ngữ nghĩa)

**Screen reader** (vd NVDA, JAWS, VoiceOver) là phần mềm *đọc thành tiếng* nội dung màn hình cho người khiếm thị. Nó không "nhìn" giao diện — nó **đọc cấu trúc HTML**. Vì vậy HTML bạn viết thế nào, người khiếm thị nghe thấy y như vậy.

**Semantic HTML** (HTML ngữ nghĩa) nghĩa là **dùng đúng thẻ cho đúng mục đích**: nút thì dùng thẻ `button`, tiêu đề dùng `h1`–`h6`, danh sách dùng `ul/li`, vùng điều hướng dùng `nav`, ô nhập dùng `input` gắn với `label`.

**Vì sao quan trọng?** Vì các thẻ chuẩn đã "gói sẵn" hành vi a11y **miễn phí**:

- Thẻ `button` tự động: Tab tới được, bấm Enter/Space kích hoạt, screen reader tự đọc "nút". Còn `<div>` bị "trang trí" cho giống nút thì **không có gì trong số đó** — bạn phải tự vá lại tất cả bằng tay và thường vá thiếu.
- Thẻ heading (`h1`, `h2`...) tạo ra "mục lục" để người khiếm thị nhảy nhanh giữa các phần. Dùng heading đúng cấp bậc = tặng họ bản đồ trang.
- **Mọi input phải có `label` gắn với nó**, để screen reader đọc được "ô này là gì" khi con trỏ nhảy vào. Ô input không label = người khiếm thị chỉ nghe "edit text" mà không biết điền gì.

> [!example] Ví dụ
> Người khiếm thị nhấn phím tắt "liệt kê các heading" để lướt nhanh trang, y như người sáng mắt liếc qua các tiêu đề. Nếu bạn giả heading bằng `<div>` in đậm cỡ lớn, tính năng đó không hoạt động — với họ trang thành một khối chữ phẳng.

![[uxui-08-semantic-html.svg]]
*Cùng nhìn giống nút, nhưng `<div>` thì screen reader không biết đó là nút và Tab không tới được.*

> [!warning] Sai lầm hay gặp
> - `<div class="button">` thay cho `<button>`.
> - Chọn cấp heading theo **cỡ chữ mong muốn** thay vì theo cấu trúc (nhảy từ `h1` sang `h4` cho "nhỏ hơn") — hãy chọn cấp theo logic, rồi chỉnh cỡ bằng CSS. Xem [[04 - Typography]].
> - Input không có label (chỉ có placeholder).

---

## 🏷️ ARIA (Accessible Rich Internet Applications)

**ARIA** là bộ **thuộc tính bổ sung** thêm vào HTML để *mô tả* vai trò, trạng thái, tên gọi của phần tử cho screen reader — dùng khi HTML thường **không đủ diễn đạt**. Ví dụ: một tab UI tự chế, một menu dropdown phức tạp, một thanh trượt (slider) tùy biến — những thứ HTML không có sẵn thẻ.

Nguyên tắc **tối quan trọng**: **"No ARIA is better than bad ARIA"** (Không dùng ARIA còn hơn dùng ARIA sai). Vì ARIA chỉ *nói dối* screen reader về ngữ nghĩa chứ không thêm hành vi — nếu bạn gán sai vai trò, người khiếm thị nghe một đằng, phần tử làm một nẻo → tệ hơn là không có gì.

Thứ tự ưu tiên nên nhớ:

1. **Ưu tiên số 1: dùng HTML chuẩn.** Nếu dùng được `<button>`, `<nav>`, `<label>` thì **đừng đụng tới ARIA** — chúng đã accessible sẵn.
2. Chỉ khi HTML *không có* thứ bạn cần (component phức tạp) mới thêm ARIA, và phải **tuân đúng pattern chuẩn** (W3C có bộ "ARIA Authoring Practices" mô tả từng loại component).
3. ARIA thường phải đi kèm **xử lý bàn phím tự viết** — thêm role thôi chưa đủ, phải cho nó Tab và phím mũi tên hoạt động đúng.

> [!example] Ví dụ đúng
> `aria-label` để đặt tên cho **nút chỉ có icon** (vd nút icon thùng rác không có chữ) → screen reader đọc "nút Xóa" thay vì im lặng. Đây là một trong số ít ca ARIA thật sự cần và đơn giản.

![[uxui-08-aria-priority.svg]]
*Thứ tự ưu tiên: HTML chuẩn trước, ARIA chỉ khi thiếu, và luôn kèm xử lý bàn phím.*

> [!warning] Sai lầm hay gặp
> - Rắc `role="button"` lên `<div>` rồi tưởng đã xong — vẫn thiếu xử lý phím và focus. Chi bằng dùng thẳng `<button>`.
> - Gắn ARIA thừa lên thẻ vốn đã có ngữ nghĩa (vd `role="navigation"` cho `<nav>`) → dư thừa, dễ gây nhiễu.

---

## 🖼️ Alt Text cho hình (Text thay thế cho ảnh)

**Alt text** là dòng mô tả văn bản gắn vào ảnh (thuộc tính `alt`). Screen reader đọc nó thay cho ảnh; nó cũng hiện ra khi ảnh lỗi không tải được. Đây là biểu hiện trực tiếp của chữ **P (Perceivable)** trong POUR.

Cách viết alt text đúng tùy **vai trò của ảnh**:

- **Ảnh mang thông tin:** mô tả *nội dung/ý nghĩa*, ngắn gọn. Vd ảnh biểu đồ doanh thu → "Biểu đồ doanh thu tăng đều từ tháng 1 đến tháng 6", không phải "hình ảnh".
- **Ảnh chỉ trang trí** (icon nền, đường kẻ, hoa văn): để **alt rỗng** (`alt=""`) để screen reader **bỏ qua**, tránh đọc rác làm phiền người dùng.
- **Ảnh là link/nút** (logo bấm về trang chủ): alt mô tả *đích đến/hành động*, vd "Trang chủ", không phải "logo công ty".

![[uxui-08-alt-text.svg]]
*Ba vai trò của ảnh ứng với ba cách viết alt khác nhau.*

> [!warning] Sai lầm hay gặp
> - Nhồi từ khóa SEO vào alt → phản tác dụng và gây phiền.
> - Bắt đầu bằng "Hình ảnh của..." → screen reader đã tự thông báo "image" rồi, thừa.
> - Bỏ trống thuộc tính `alt` hoàn toàn với ảnh trang trí *nhưng viết sai* → có ảnh không `alt` khiến screen reader đọc cả tên file (vd "IMG_2938 dot png"). Trang trí thì phải `alt=""` (rỗng có chủ đích), khác với *thiếu* `alt`.

---

## 👆 Touch Target Size (Kích thước vùng chạm)

**Touch target** là vùng bấm được của một phần tử (nút, link, icon). Trên điện thoại, đầu ngón tay to hơn con trỏ chuột nhiều, nên vùng bấm quá nhỏ → bấm nhầm, bấm trượt. Ảnh hưởng đặc biệt tới người run tay, người lớn tuổi, hoặc bất kỳ ai đang đi bộ.

Các con số cần nhớ (lưu ý chúng khác nhau):

- **WCAG 2.2 — SC 2.5.8 Target Size (Minimum), mức AA: tối thiểu 24×24 CSS pixel** (đây là ngưỡng *chuẩn WCAG* mới, mức sàn để không fail).
- **WCAG 2.2 — SC 2.5.5, mức AAA: 44×44 CSS pixel** (khắt khe hơn).
- **Khuyến nghị của hãng thiết bị (không phải WCAG):** **Apple HIG ~44×44pt**, **Google Material ~48×48dp**. Đây là mức *nên nhắm* để trải nghiệm chạm thực sự thoải mái.

Nói gọn: **24px là mức tối thiểu để đạt AA, còn ~44–48px là mức "nên làm" cho UX tốt.** Nếu target buộc phải nhỏ, WCAG cho phép bù bằng **khoảng cách (spacing)** đủ rộng giữa các target để không bấm nhầm.

![[uxui-08-touch-target.svg]]
*Giữ icon nhỏ về mặt hình nhưng nới vùng bấm bằng padding — 24px là sàn AA, ~44–48px là mức nên làm.*

> [!warning] Sai lầm hay gặp
> - Icon 16px nằm sát nhau (vd nút edit/xóa trong bảng) → ngón tay bấm nhầm liên tục. Giữ icon nhỏ về mặt hình, nhưng nới **vùng bấm** (padding) ra ≥ mức tối thiểu.
> - Link text trong đoạn văn nằm quá sát nhau trên mobile.

---

## 🎞️ Motion Sensitivity (Nhạy cảm với chuyển động — prefers-reduced-motion)

Với một số người, **animation mạnh** (parallax, phóng to đột ngột, hiệu ứng trượt lớn, chớp nháy) không chỉ khó chịu mà gây **chóng mặt, buồn nôn, đau đầu** — gọi là *vestibular disorder* (rối loạn tiền đình). Với người động kinh, nội dung **nhấp nháy** còn có thể gây co giật.

Hệ điều hành cho phép người dùng bật tùy chọn **"Reduce Motion"** (giảm chuyển động). Trình duyệt truyền tín hiệu này qua media query **`prefers-reduced-motion`**. Việc của bạn: khi người dùng đã bật cờ này, hãy **tắt hoặc giảm** các animation không thiết yếu (thay hiệu ứng bay/nảy bằng fade nhẹ hoặc đổi tức thì).

Đây là tinh thần của **WCAG SC 2.3.3 (Animation from Interactions)** và liên quan tới việc tránh nội dung nhấp nháy quá 3 lần/giây.

> [!example] Ví dụ
> Trang có hiệu ứng cuộn parallax mạnh: khi phát hiện `prefers-reduced-motion`, bạn cho nội dung hiện ra tĩnh, bỏ parallax — vẫn đẹp mà không gây chóng mặt.

![[uxui-08-reduced-motion.svg]]
*Khi người dùng bật Reduce Motion, thay hiệu ứng bay/nảy bằng fade nhẹ hoặc đổi tức thì.*

> [!warning] Sai lầm hay gặp
> - Nhồi animation "cho xịn" và **không** hề tôn trọng `prefers-reduced-motion` → một nhóm người dùng thực sự không dùng nổi sản phẩm.
> - Coi đây là chuyện nhỏ: nó là tín hiệu người dùng đã *chủ động khai báo nhu cầu y tế*, cần tôn trọng. Xem thêm cách thiết kế animation ở [[07 - Components & Interaction Design]].

---

## 🌍 Inclusive Design vs Accessibility (Thiết kế bao trùm và Khả năng tiếp cận — phân biệt)

Hai khái niệm hay bị nhầm là một, nhưng khác nhau:

- **Accessibility (a11y):** Tập trung vào **kết quả có đo được** — sản phẩm *có dùng được* với người khuyết tật không, *có đạt WCAG* không. Nó là **thuộc tính của sản phẩm** và thường gắn với tuân thủ/chuẩn (đạt AA hay không).
- **Inclusive Design (thiết kế bao trùm):** Là một **phương pháp/tư duy làm việc** — chủ động thiết kế cho *dải người dùng đa dạng nhất có thể* ngay từ đầu, xét cả yếu tố tạm thời và hoàn cảnh, không chỉ khuyết tật vĩnh viễn.

Cách phân biệt dễ nhớ: **Inclusive Design là *quá trình* (cách bạn làm), Accessibility là *kết quả* (sản phẩm đạt chuẩn).** Làm inclusive design tốt thì thường tự nhiên đạt accessibility; nhưng bạn vẫn có thể tick đủ checklist WCAG mà sản phẩm vẫn khó dùng với nhiều nhóm.

> [!example] Ví dụ "khuyết tật tạm thời & hoàn cảnh" (Microsoft Inclusive Design)
> Cùng nhu cầu "dùng một tay": người **cụt tay** (vĩnh viễn), người **gãy tay bó bột** (tạm thời), và người **đang bế em bé** (hoàn cảnh). Thiết kế cho một tay giúp *cả ba* — đó là tinh thần inclusive design: giải pháp cho nhóm rìa thường nâng trải nghiệm cho tất cả.

![[uxui-08-inclusive.svg]]
*Inclusive Design là quá trình, Accessibility là kết quả — vĩnh viễn/tạm thời/hoàn cảnh dùng chung một giải pháp.*

> [!warning] Sai lầm hay gặp
> Coi a11y là "chạy tool audit, sửa cho hết lỗi đỏ là xong". Tool tự động chỉ bắt được ~30–40% vấn đề; phần còn lại (alt text *có ý nghĩa* không, tab order *có hợp lý* không) cần con người kiểm và tư duy inclusive.

---

## ✅ Tóm lại / Checklist

- [ ] Nhắm mục tiêu **WCAG 2.2 mức AA** cho SaaS (mức luật & khách B2B thường đòi).
- [ ] Nhớ 4 nguyên tắc **POUR**: Perceivable, Operable, Understandable, Robust.
- [ ] **Contrast** đạt: text thường **4.5:1**, text lớn **3:1**, UI/icon **3:1** (mức AA).
- [ ] **Dùng được bằng bàn phím** 100%: Tab tới mọi thứ click được, Enter/Space kích hoạt.
- [ ] **Không xóa focus ring** trừ khi thay bằng chỉ báo rõ hơn.
- [ ] Có **skip link** để bỏ qua menu; **tab order** theo thứ tự đọc; modal có **focus trap**.
- [ ] Ưu tiên **Semantic HTML** (đúng `button`/`nav`/heading); **mọi input có label**.
- [ ] Chỉ thêm **ARIA** khi HTML không đủ, và làm đúng pattern — *"No ARIA better than bad ARIA"*.
- [ ] **Alt text** đúng vai trò: mô tả nếu mang tin, `alt=""` nếu trang trí.
- [ ] **Touch target** ≥ 24×24px (AA tối thiểu), nên nhắm ~44–48px cho UX tốt.
- [ ] Tôn trọng **`prefers-reduced-motion`**: giảm/tắt animation không thiết yếu.
- [ ] Tư duy **Inclusive Design** (quá trình) để đạt **Accessibility** (kết quả) — đừng chỉ dựa vào tool tự động.

## 🔗 Nguồn tham khảo

- WCAG 2.2 (bản chính thức, W3C): https://www.w3.org/TR/WCAG22/
- WAI — Introduction to WCAG (W3C): https://www.w3.org/WAI/standards-guidelines/wcag/
- WCAG — 4 nguyên tắc POUR (glance): https://www.w3.org/WAI/WCAG22/quickref/
- Contrast (Minimum) — SC 1.4.3 (AA): https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html
- Target Size (Minimum) — SC 2.5.8 (AA, 24×24px): https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
- Focus Visible — SC 2.4.7: https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html
- Bypass Blocks (skip link) — SC 2.4.1: https://www.w3.org/WAI/WCAG22/Understanding/bypass-blocks.html
- WAI-ARIA Authoring Practices (APG): https://www.w3.org/WAI/ARIA/apg/
- ARIA — "No ARIA is better than bad ARIA" (Read Me First): https://www.w3.org/WAI/ARIA/apg/practices/read-me-first/
- Images Tutorial / Alt text (WAI): https://www.w3.org/WAI/tutorials/images/
- prefers-reduced-motion — SC 2.3.3 Animation from Interactions: https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html
- Microsoft Inclusive Design: https://inclusive.microsoft.design/
- Apple Human Interface Guidelines — Accessibility: https://developer.apple.com/design/human-interface-guidelines/accessibility

---

*Xem thêm trong bộ roadmap:* [[04 - Typography]] · [[05 - Color & Theming]] · [[07 - Components & Interaction Design]]
