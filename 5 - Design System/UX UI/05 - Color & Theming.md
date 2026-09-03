---
tags:
  - ui
  - color
  - theming
  - visual-design
type: note
created: 2026-08-23
---

# 🎨 05 - Color & Theming

## 📌 Ý chính của bài

Màu là thứ dev SaaS hay làm hỏng nhất, vì bị cám dỗ "chọn màu đẹp" thay vì **xây một hệ thống màu (color system)**. Bài này không dạy bạn thành colorist. Nó dạy đủ nguyên tắc **có tên gọi** để bạn ra quyết định màu có cơ sở và tra lại nhanh.

Ba ý cốt lõi cần nhớ:

1. **Nghĩ theo HSL, đừng nghĩ theo HEX.** HEX (`#3B82F6`) không cho bạn biết màu này sáng hay tối hơn màu kia. HSL cho bạn "vặn núm" độ sáng, độ đậm một cách có kiểm soát.
2. **Màu không đứng một mình — nó là thang (scale).** Một màu "xanh brand" thực chất là 9-10 sắc độ từ nhạt tới đậm. Bạn cần cả thang, không chỉ 1 giá trị.
3. **Thiết kế đen trắng trước (grayscale-first), rồi mới thêm màu.** Nếu layout đã rõ ràng khi chỉ có xám, thêm màu chỉ làm nó tốt hơn. Nếu phải dựa vào màu để phân biệt các phần thì hierarchy đang yếu.

> [!tip] Liên hệ chéo
> Màu là một công cụ tạo **visual hierarchy** ([[03 - Visual Hierarchy & Layout]]), cần được quản lý như **design token** ([[06 - Spacing & Design Tokens]]), và phải đạt chuẩn tương phản của **accessibility** ([[08 - Accessibility (a11y)]]).

---

### 🎛️ HSL Color Model (Mô hình màu HSL)

**Là gì:** HSL = Hue (màu sắc) + Saturation (độ bão hòa/độ đậm) + Lightness (độ sáng). Đây là cách mô tả màu bằng 3 "núm vặn" trực giác, thay cho HEX/RGB vốn mô tả màu bằng lượng đỏ-xanh lá-xanh dương trộn vào nhau.

- **Hue (0-360°):** vị trí trên vòng tròn màu. 0° đỏ, 120° xanh lá, 240° xanh dương. Đổi Hue = đổi sang màu khác hẳn.
- **Saturation (0-100%):** màu đậm hay nhạt. 0% là xám hoàn toàn, 100% là màu rực nhất.
- **Lightness (0-100%):** màu sáng hay tối. 0% là đen, 100% là trắng, 50% là màu "gốc" rõ nhất.

**Vì sao dev nên nghĩ theo HSL thay vì HEX:** Với HEX, muốn có một phiên bản "sáng hơn một chút" của `#3B82F6` bạn phải mò mẫm hoặc dùng tool. Với HSL, bạn chỉ cần **giữ nguyên Hue + Saturation, tăng Lightness** là ra ngay sắc độ nhạt hơn cùng tông. Điều này khiến việc tạo cả thang màu (shades/tints) trở nên có quy luật thay vì đoán mò. CSS hiện đại hỗ trợ trực tiếp `hsl()` nên không có rào cản kỹ thuật.

**Ví dụ mô tả bằng lời:** Hình dung 3 thanh trượt. Bạn kéo thanh Lightness từ 50% lên 90% → cùng một màu xanh nhưng nhạt dần thành xanh pastel dùng làm nền. Kéo xuống 25% → xanh đậm dùng làm chữ trên nền sáng. Hue và Saturation không đổi nên cả họ màu vẫn "cùng gia đình".

![[uxui-05-hsl-hsv-cylinder.png]]
*Ba "núm vặn" của HSL (trái) so với HSB/HSV (phải): Hue quay quanh trục, Saturation đi từ tâm ra, còn núm thứ ba là Lightness vs Value — cùng ý tưởng nhưng khác nhau, đừng copy số qua lại — (nguồn: Wikimedia Commons)*

> [!warning] Sai lầm hay gặp
> - Nghĩ rằng cứ giảm Lightness là màu sẽ "đẹp hơn". Thực tế khi tăng/giảm Lightness ở hai đầu thang, bạn thường phải **tinh chỉnh cả Saturation và Hue nhẹ** để màu không bị xỉn hoặc "chết" (xem mục Color Shades & Tints).
> - Tưởng HSL và HSB/HSV là một. Chúng khác nhau ở núm thứ ba (Lightness vs Brightness); cùng ý tưởng "vặn núm" nhưng đừng copy số qua lại giữa hai hệ.

---

### 🧩 Color Palette (Bảng màu: Primary / Secondary / Accent)

**Là gì:** Palette là tập hợp các màu "chủ đạo" của sản phẩm, được đặt vai trò rõ ràng thay vì chọn tùy hứng từng chỗ.

- **Primary (màu chính):** màu brand xuất hiện nhiều nhất ở các phần tử quan trọng — nút hành động chính, link, trạng thái active. Đây là màu người dùng gắn với thương hiệu của bạn.
- **Secondary (màu phụ):** màu bổ trợ, dùng cho hành động ít quan trọng hơn hoặc để tạo tương phản với primary khi cần. Nhiều sản phẩm SaaS thực ra **không cần** secondary màu sặc sỡ — dùng xám là đủ.
- **Accent (màu nhấn):** màu dùng rất tiết chế để làm nổi bật một điểm cần chú ý (badge "mới", highlight).

**Ví dụ mô tả bằng lời:** Một dashboard SaaS: nút "Tạo dự án" dùng xanh primary; nút "Hủy" bên cạnh dùng xám (không cần màu); một nhãn "Beta" nhỏ dùng màu accent tím để thu hút mắt đúng một điểm.

![[uxui-05-palette-roles.svg]]
*Mỗi màu trong palette có một vai trò rõ ràng — nút chính dùng primary, nút "Hủy" chỉ cần xám, nhãn "Beta" là accent xuất hiện đúng một điểm.*

> [!warning] Sai lầm hay gặp
> - **Chỉ chọn đúng 1 giá trị cho mỗi màu.** Mỗi vai trò (primary...) cần **cả một thang sắc độ** (xem mục shades), không chỉ 1 màu.
> - Dùng quá nhiều màu chủ đạo ngang hàng khiến không có gì thực sự nổi bật. Refactoring UI khuyên bắt đầu tối giản: một màu primary + một thang xám phong phú là đã đủ chạy cho phần lớn giao diện.

---

### 🚦 Semantic Colors (Màu ngữ nghĩa: success / warning / error / info)

**Là gì:** Là những màu gắn với **ý nghĩa trạng thái** chứ không phải với thương hiệu. Người dùng đã có sẵn kỳ vọng văn hóa về chúng, nên đừng phá vỡ.

- **Success (thành công) — xanh lá:** thao tác hoàn tất, hợp lệ.
- **Warning (cảnh báo) — vàng/cam:** cần chú ý nhưng chưa nguy hiểm.
- **Error / Danger (lỗi) — đỏ:** thất bại, hành động phá hủy, dữ liệu không hợp lệ.
- **Info (thông tin) — xanh dương:** thông báo trung tính, gợi ý.

**Ví dụ mô tả bằng lời:** Form đăng ký: ô email sai định dạng viền đỏ + chữ lỗi đỏ (error); sau khi lưu thành công hiện toast xanh lá (success); banner nhắc "Bản dùng thử còn 3 ngày" màu vàng (warning).

![[uxui-05-semantic-colors.svg]]
*Bốn màu ngữ nghĩa gắn với trạng thái, và luôn đi kèm icon + chữ để không phụ thuộc riêng vào màu.*

> [!warning] Sai lầm hay gặp
> - **Chỉ dùng màu để truyền đạt trạng thái.** Người mù màu (color blindness) sẽ không phân biệt được đỏ/xanh lá. Luôn kèm **icon hoặc chữ** — đây là yêu cầu của [[08 - Accessibility (a11y)]].
> - Dùng đúng một sắc đỏ cho mọi ngữ cảnh. Đỏ trên nền trắng và đỏ làm nền của một badge cần **hai sắc độ khác nhau** trong cùng thang (xem shades) để đảm bảo tương phản.
> - Chọn màu semantic trùng với primary brand (ví dụ brand màu đỏ) khiến user không phân biệt được "màu thương hiệu" và "màu lỗi".

---

### 🪜 Color Shades & Tints (Thang sắc độ 50-900)

**Là gì:** Một màu trong hệ thống thực chất là **một thang nhiều bậc**, thường đánh số 50, 100, 200, ... 900 (phổ biến từ Material Design và Tailwind). Số nhỏ = nhạt, số lớn = đậm. 500 thường là "màu gốc".

- **Shade (sắc tối):** phiên bản đậm hơn của màu (trộn thêm đen về mặt cảm nhận).
- **Tint (sắc nhạt):** phiên bản nhạt hơn (trộn thêm trắng).

Có cả thang giúp bạn luôn có sẵn "màu nền nhạt", "màu viền", "màu chữ đậm" cùng gia đình, đảm bảo tương phản ở mọi ngữ cảnh.

**Ví dụ mô tả bằng lời:** Một alert lỗi: nền dùng đỏ-50 (rất nhạt), viền đỏ-200, icon đỏ-500, chữ đỏ-700 (đậm để đọc rõ). Tất cả cùng một Hue nên trông thống nhất, nhưng đủ tương phản để chữ dễ đọc.

![[uxui-05-color-scale.svg]]
*Thang đỏ 50-900 và cách một alert lỗi dùng 4 bậc khác nhau của cùng thang: nền 50, viền 200, icon 500, chữ 700.*

> [!warning] Sai lầm hay gặp
> - **Tạo thang chỉ bằng cách vặn Lightness lên/xuống.** Nếu chỉ đổi Lightness, các bậc rất sáng sẽ trông "bạc màu" và bậc rất tối trông "bùn". Kỹ thuật đúng (Refactoring UI): **xoay nhẹ Hue** (khi làm sáng thì xoay về phía màu "sáng" gần nhất trong ba mốc vàng 60° / lục-lam 180° / hồng cánh sen 300°; khi làm tối thì xoay về phía màu "tối" gần nhất trong ba mốc đỏ 0° / lục 120° / lam 240°), và **tăng nhẹ Saturation ở cả hai đầu sáng lẫn tối** để màu không bị "bạc" — mỗi lần xoay Hue chỉ nên trong khoảng ~20-30°.
> - Đặt số bậc lung tung (blue-1, blue-2, blue-max). Bám theo chuẩn 50-900 để đồng bộ với thư viện và người khác đọc hiểu ngay.

---

### ⚖️ 60-30-10 Rule (Quy tắc 60-30-10)

**Là gì:** Một quy tắc tỷ lệ phân bổ màu mượn từ thiết kế nội thất: **60% màu chủ đạo (thường là nền trung tính), 30% màu phụ, 10% màu nhấn.** Nó giúp bố cục có sự cân bằng và điểm nhấn thay vì "màu nào cũng đòi được chú ý".

**Ví dụ mô tả bằng lời:** Một trang SaaS: 60% là nền trắng/xám rất nhạt; 30% là các khối card, sidebar màu trung tính đậm hơn; 10% là các nút primary xanh và vài accent — chính 10% này dẫn mắt user tới hành động quan trọng.

![[uxui-05-60-30-10.svg]]
*Bên trái giữ đúng tỷ lệ nên mắt đi thẳng tới nút xanh duy nhất; bên phải màu brand tràn lan nên không còn gì nổi bật.*

> [!warning] Sai lầm hay gặp
> - Hiểu máy móc thành "phải đo đúng 60/30/10 phần trăm pixel". Đây là **tỷ lệ cảm nhận, mang tính hướng dẫn**, không phải công thức toán. Ý cốt lõi: màu nhấn phải **hiếm** thì mới còn sức nhấn.
> - Dùng màu brand rực rỡ cho cả mảng nền lớn (chiếm 60%) → giao diện mệt mắt và mất chỗ để nhấn.

---

### ⬛ Grayscale-first Approach (Thiết kế đen trắng trước)

**Là gì:** Nguyên tắc **thiết kế toàn bộ giao diện bằng thang xám trước**, chỉ thêm màu ở bước cuối. Vì màu là công cụ mạnh nhưng dễ che giấu vấn đề về bố cục.

**Vì sao hiệu quả:** Nếu giao diện đã rõ ràng, có hierarchy tốt khi chỉ dùng xám (chỗ nào quan trọng thì đậm/to hơn, chỗ nào phụ thì nhạt hơn), thì thêm màu chỉ tăng thêm sức mạnh. Ngược lại, nếu bạn **phải** dùng màu để phân biệt các phần thì đó là dấu hiệu spacing, kích thước, độ đậm chữ đang chưa làm tốt việc của chúng — vấn đề thuộc về [[03 - Visual Hierarchy & Layout]].

**Ví dụ mô tả bằng lời:** Dựng dashboard hoàn toàn bằng trắng-xám-đen: dùng độ đậm chữ và khoảng cách để làm nổi tiêu đề, làm mờ chú thích. Khi bố cục đã đọc được rõ ràng, mới tô xanh cho nút chính và đỏ cho cảnh báo.

![[uxui-05-grayscale-first.svg]]
*Bước 1 dựng hierarchy hoàn toàn bằng thang xám; bước 2 thêm màu chỉ để làm mạnh thêm những gì đã rõ.*

> [!warning] Sai lầm hay gặp
> - Chọn màu brand ngay từ phút đầu và dựng layout quanh nó → khi đổi màu brand là vỡ trận.
> - Chỉ dùng vài mức xám. Thực tế cần **một thang xám phong phú** (cũng 50-900) để phân tách nền, viền, chữ chính, chữ phụ một cách tinh tế.

---

### 🔍 Contrast & Accessibility (Tương phản & khả năng tiếp cận)

**Là gì:** Contrast ratio là **tỷ số độ tương phản sáng-tối** giữa màu chữ và màu nền, đo từ 1:1 (không phân biệt được) tới 21:1 (đen trên trắng). Đây là yếu tố quyết định chữ có đọc được không, đặc biệt với người thị lực kém.

Chuẩn **WCAG (Web Content Accessibility Guidelines)** mức **AA**:

- **Text thường:** tối thiểu **4.5:1**.
- **Text lớn** (khoảng ≥ 18pt thường, hoặc ≥ 14pt in đậm): tối thiểu **3:1**.
- (Mức AAA cao hơn: 7:1 cho text thường, 4.5:1 cho text lớn — tham khảo khi cần chặt chẽ hơn.)

**Ví dụ mô tả bằng lời:** Chữ xám nhạt (#999) trên nền trắng trông "sang" nhưng thường chỉ đạt ~2.8:1 → trượt AA, người dùng lớn tuổi đọc không nổi. Đậm lên tới mức đạt 4.5:1 mới hợp lệ.

![[uxui-05-contrast-ratio.svg]]
*Cùng nền trắng: #999 chỉ đạt 2.85:1 (trượt AA), #767676 vừa đủ 4.54:1, #374151 đạt 10.31:1.*

![[uxui-05-color-blind-schemes.jpg]]
*Cùng một bảng màu nhìn qua các dạng mù màu khác nhau — nhiều nhãn không còn phân biệt được nếu chỉ dựa vào màu — (nguồn: Wikimedia Commons)*

> [!warning] Sai lầm hay gặp
> - Đánh giá tương phản bằng mắt. Luôn **kiểm bằng tool** (contrast checker).
> - Tưởng placeholder, chữ disabled, hay chữ trên ảnh được "miễn". Chúng vẫn cần cân nhắc; chi tiết đầy đủ (keyboard nav, focus, ARIA...) ở [[08 - Accessibility (a11y)]].

> [!note] Chi tiết đầy đủ về a11y nằm ở note riêng
> Mục này chỉ nêu ngưỡng liên quan tới màu. Xem [[08 - Accessibility (a11y)]] cho toàn bộ chuẩn WCAG.

---

### 🌙 Dark Mode (Chế độ tối)

**Là gì:** Phiên bản giao diện dùng nền tối, chữ sáng. Không phải chỉ "đảo ngược màu" — nó là một theme riêng cần thiết kế lại quan hệ màu.

**Nguyên tắc quan trọng:**

- **Đừng dùng đen tuyền `#000` làm nền.** Đen tuyền cạnh chữ trắng tinh tạo tương phản gắt gây mỏi mắt, và làm bóng đổ (shadow) vô dụng. Dùng **xám rất đậm** (ví dụ tông gần #121212 kiểu Material) làm nền.
- **Đừng dùng trắng tinh `#FFF` làm chữ.** Hạ nhẹ xuống xám sáng để giảm chói.
- **Nâng độ cao bằng độ sáng, không bằng shadow.** Trong dark mode, bề mặt càng "nổi lên trên" (như card, modal) thì càng sáng hơn một chút so với nền, thay vì đổ bóng như ở light mode.
- **Giảm Saturation của màu brand.** Màu rực trên nền tối sẽ chói và như rung; thường cần bản màu nhạt/dịu hơn một chút cho dark mode.

**Ví dụ mô tả bằng lời:** Nền app là xám-đen #121212, card đặt lên trên sáng hơn thành #1E1E1E để tách lớp, chữ chính là xám #E0E0E0 thay vì trắng tinh, nút primary dùng xanh nhạt hơn so với ở light mode.

![[uxui-05-dark-mode.svg]]
*Invert cứng (#000 + #FFF) so với dark theme thiết kế lại: nền #121212, card #1E1E1E nổi lên bằng độ sáng, chữ #E0E0E0, màu brand giảm saturation.*

> [!warning] Sai lầm hay gặp
> - **Invert cứng** (lật ngược mọi màu) — cho ra kết quả xấu và sai tương phản.
> - Quên rằng màu semantic cũng phải chỉnh cho dark mode; đỏ/xanh lá của light mode có thể quá tối hoặc quá chói trên nền tối.
> - Bỏ qua kiểm tra tương phản lại từ đầu — WCAG áp dụng cho **cả hai** theme.

---

### 🧠 Color Psychology (Tâm lý học màu sắc — sơ lược)

**Là gì:** Ý tưởng rằng màu gợi lên cảm xúc và liên tưởng nhất định: xanh dương → tin cậy/ổn định (nên nhiều app tài chính, SaaS dùng), xanh lá → thành công/tăng trưởng, đỏ → khẩn cấp/nguy hiểm, vàng → chú ý/lạc quan, tím → sáng tạo/cao cấp.

**Cách dùng hợp lý:** Xem đây là **một gợi ý mềm** để chọn tông brand phù hợp ngành, và để tận dụng kỳ vọng có sẵn (đỏ = lỗi). Nó KHÔNG phải quy luật cứng.

![[uxui-05-color-psychology.svg]]
*Liên tưởng màu chỉ là gợi ý mềm để chọn tông brand; hiệu quả thực tế đến từ tương phản và ngữ cảnh, không phải bản thân màu.*

> [!warning] Sai lầm hay gặp (tránh nói quá)
> - **Thổi phồng** kiểu "màu cam làm tăng 30% chuyển đổi". Các con số này phần lớn là huyền thoại marketing, không có cơ sở khoa học vững; hiệu quả nút bấm phụ thuộc **tương phản và ngữ cảnh** hơn là bản thân màu.
> - Liên tưởng màu **phụ thuộc văn hóa** (ví dụ trắng, đỏ mang ý nghĩa khác nhau ở phương Đông và phương Tây) — đừng áp dụng như chân lý toàn cầu.
> - Ưu tiên tính năng và khả năng đọc hơn "ý nghĩa cảm xúc" của màu. Một màu "đúng tâm lý" nhưng trượt contrast là màu sai.

---

## ✅ Tóm lại / Checklist

- [ ] Định nghĩa màu theo **HSL** để tạo thang có quy luật, không mò HEX.
- [ ] Mỗi vai trò màu (primary/secondary/accent) có **cả thang 50-900**, không chỉ 1 giá trị.
- [ ] Có đủ bộ **semantic colors** (success/warning/error/info) và luôn kèm icon/chữ, không chỉ dựa vào màu.
- [ ] Có **thang xám phong phú**; đã thử dựng layout **grayscale-first** trước khi thêm màu.
- [ ] Áp dụng tinh thần **60-30-10**: màu nhấn phải hiếm.
- [ ] Mọi cặp chữ/nền đạt **WCAG AA**: 4.5:1 text thường, 3:1 text lớn (kiểm bằng tool) → [[08 - Accessibility (a11y)]].
- [ ] **Dark mode** không dùng #000/#FFF tuyệt đối; nâng lớp bằng độ sáng; giảm saturation màu brand; kiểm contrast lại.
- [ ] Coi **color psychology** là gợi ý mềm, không thổi phồng; luôn ưu tiên contrast và ngữ cảnh.
- [ ] Quản lý toàn bộ màu như **design token** để đổi theme một chỗ → [[06 - Spacing & Design Tokens]].

## 🔗 Nguồn tham khảo

- Refactoring UI — Adam Wathan & Steve Schoger: https://www.refactoringui.com/
- Material Design 3 — Color system: https://m3.material.io/styles/color/system/overview
- Material Design — Dark theme: https://m2.material.io/design/color/dark-theme.html
- WCAG 2.1 — Success Criterion 1.4.3 Contrast (Minimum): https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html
- WCAG — Understanding Contrast (Enhanced) AAA: https://www.w3.org/WAI/WCAG21/Understanding/contrast-enhanced.html
- MDN — HSL color: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/hsl
- Tailwind CSS — Customizing Colors (thang 50-950): https://tailwindcss.com/docs/customizing-colors

---
> 🤖 Note thuộc bộ [[00 - UX-UI Roadmap (MOC)]]. Tổng hợp từ Refactoring UI, Material Design, WCAG và review lại tính đúng đắn.
