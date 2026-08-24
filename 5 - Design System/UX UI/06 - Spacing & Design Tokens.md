---
tags:
  - ui
  - spacing
  - design-tokens
  - design-system
type: note
created: 2026-08-23
---

# 06 - Spacing & Design Tokens

## 📌 Ý chính của bài

Giao diện đẹp không nằm ở màu mè hay hiệu ứng, mà phần lớn đến từ **spacing** (khoảng cách giữa các phần tử) đúng và **nhất quán**. Là dev SaaS, bạn hoàn toàn có thể "chế" giao diện gọn gàng chỉ bằng cách áp dụng vài quy tắc về khoảng cách — không cần khiếu thẩm mỹ bẩm sinh.

Bài này đi từ dễ đến khó:
- Vì sao **whitespace** (khoảng trắng) quan trọng và hay bị bỏ quên.
- **8-Point Grid System** — quy tắc "mọi khoảng cách chia hết cho 8 (hoặc 4)".
- **Spacing Scale** và **Constrained Scale** — dùng một bộ số hữu hạn thay vì gõ số tùy hứng.
- **Design Tokens** — cách "đóng gói" các giá trị design (spacing, màu, font...) thành biến có tên, phân tầng global → alias → component.
- **Naming Convention** và **Single Source of Truth** — để token dùng được lâu dài và đồng bộ giữa design và code.

> Tư duy cốt lõi: **thay vì quyết định từng con số mỗi lần code, bạn quyết định một lần trong "hệ thống", rồi tái sử dụng.** Đây chính là cầu nối sang [[07 - Components & Interaction Design]] và toàn bộ Design System.

---

## 📐 Whitespace & Spacing (Khoảng trắng & Giãn cách)

**Whitespace** (còn gọi là *negative space* — khoảng trống, không nhất thiết màu trắng) là vùng "trống" giữa và xung quanh các phần tử. **Spacing** là cách bạn chủ động phân bổ khoảng trống đó: padding (đệm trong), margin (lề ngoài), gap (khe giữa các item).

### Vì sao quan trọng
- **Dễ đọc & dễ quét mắt:** Khoảng cách tách các nhóm thông tin ra, mắt người dùng biết "cái gì thuộc cái gì". Đây chính là công cụ tạo nhóm trong [[03 - Visual Hierarchy & Layout]].
- **Cảm giác "cao cấp":** Giao diện chật chội trông rẻ tiền; giao diện thoáng trông đắt tiền và đáng tin — rất quan trọng với SaaS.
- **Giảm tải nhận thức (cognitive load):** Người dùng không phải căng mắt phân biệt phần tử nào với phần tử nào.

### Nguyên tắc vàng: "Start with too much, then remove"
Refactoring UI khuyên: **bắt đầu bằng NHIỀU khoảng trắng hơn bạn nghĩ là cần**, rồi bớt dần đến khi vừa mắt. Dev thường làm ngược lại — nhồi cho chật rồi mới nới, nên hầu như luôn thiếu khoảng trắng.

### Một quy tắc thực dụng khác
**Khoảng cách trong một nhóm phải NHỎ HƠN khoảng cách giữa các nhóm.** Ví dụ: label và ô input của nó nên sát nhau; nhưng hai field khác nhau thì cách xa hơn. Nhờ đó mắt tự hiểu "label này thuộc ô input này".

### 💡 Ví dụ mô tả
Một card thông tin user: avatar, tên, email, nút "Chỉnh sửa". Nếu mọi thứ cách nhau đều tăm tắp cùng một khoảng, nó trông như một đống. Nếu tên và email sát nhau (nhóm "danh tính"), rồi cách một khoảng lớn hơn tới nút hành động, mắt lập tức thấy hai cụm rõ ràng.

### ⚠️ Sai lầm hay gặp
- Dùng cùng một khoảng cách cho MỌI thứ → không phân biệt được nhóm.
- Nhồi nội dung cho "đỡ phí chỗ" → giao diện ngột ngạt.
- Chỉ thêm padding ở một phía (ví dụ chỉ trên–dưới, quên trái–phải) → lệch, thiếu cân bằng.

---

## 📏 8-Point Grid System (Lưới 8 điểm)

**8-Point Grid** là quy ước: **mọi khoảng cách và kích thước đều là bội số của 8** (8, 16, 24, 32, 40, 48...). Khi cần giá trị nhỏ hơn, cho phép dùng bội số của 4 (4, 12, 20...) — gọi là "half step".

### Vì sao là số 8?
- **Chia hết đẹp trên nhiều độ phân giải màn hình:** phần lớn kích thước màn hình chia hết cho 8, nên layout scale mượt, ít bị lẻ nửa pixel.
- **Giảm số quyết định:** thay vì phân vân "13px hay 14px?", bạn chỉ chọn trong một tập nhỏ. Nhanh và nhất quán.
- **Là chuẩn phổ biến:** Material Design của Google dùng chính "8dp grid" làm nền tảng layout (dp = density-independent pixel, đơn vị độc lập mật độ màn hình).

### 4-Point vs 8-Point
- **8pt** cho khoảng cách lớn: padding card, khoảng cách giữa các section.
- **4pt** cho tinh chỉnh nhỏ: khoảng cách icon với text, padding bên trong một chip nhỏ. Đây là lý do người ta hay gọi là hệ "4/8".

### 💡 Ví dụ mô tả
Một nút bấm: padding dọc 8px, padding ngang 16px, bo góc 8px, icon cách chữ 8px. Tất cả đều là bội số của 8 → cả bộ nút trong app trông "cùng một gia đình".

### ⚠️ Sai lầm hay gặp
- Áp 8pt một cách máy móc cho **typography line-height** hay **border 1px** — border, hairline, và một số giá trị font không cần theo grid. Grid dành cho *spacing & sizing*, không phải mọi con số.
- Dùng 8pt cho spacing nhưng vẫn gõ font-size tùy hứng → xem [[04 - Typography]] để có type scale riêng.
- Trộn lẫn 8pt với các giá trị lẻ (7, 10, 15) → phá vỡ tính nhất quán, mất luôn lợi ích.

---

## 📊 Spacing Scale (Thang giãn cách nhất quán)

**Spacing Scale** là một **bộ giá trị khoảng cách được định nghĩa sẵn** để bạn chọn, thay vì gõ số tự do. Đây là "bảng số hợp lệ" của dự án.

### Đặc điểm của một scale tốt
- **Có tính hệ thống:** thường tăng theo cấp số nhân hoặc theo bội số grid, ví dụ 4, 8, 12, 16, 24, 32, 48, 64px. Khoảng cách giữa các bước lớn dần để mỗi bước tạo khác biệt *nhìn thấy được* — hai giá trị quá gần nhau (15 và 16) là vô nghĩa với mắt người.
- **Không tuyến tính đều:** không nên là 4, 8, 12, 16, 20, 24... đều tăm tắp cho tới lớn, vì ở khoảng lớn bước nhảy nhỏ không còn tạo khác biệt. Refactoring UI gợi ý scale nên "giãn" ra ở phía trên.

### Vì sao dev cần điều này
Khi bạn có scale, mọi thành viên (kể cả bạn của 3 tháng sau) đều chọn từ cùng một bộ số → giao diện tự động nhất quán mà không cần bàn bạc.

### 💡 Ví dụ mô tả
Một scale mẫu diễn đạt bằng lời: bước cực nhỏ 4px, nhỏ 8px, cơ bản 16px, vừa 24px, lớn 32px, rất lớn 48px, khổng lồ 64px. Khi cần khoảng cách giữa hai section, bạn chọn 48 hoặc 64, không bao giờ gõ 50 hay 55.

### ⚠️ Sai lầm hay gặp
- Scale có quá **nhiều bước gần nhau** → mất tác dụng, lại quay về "chọn số tùy hứng".
- Định nghĩa scale nhưng đội ngũ vẫn hard-code số lẻ ngoài scale → scale trở thành trang trí.

---

## 🎯 Constrained Scales (Dùng scale hữu hạn thay vì số tùy ý)

**Constrained Scale** nghĩa là **giới hạn** — bạn CHỈ được dùng các giá trị trong scale, không được dùng số nằm ngoài. Đây là nâng cấp về mặt kỷ luật của Spacing Scale.

### Ý tưởng cốt lõi
Refactoring UI nhấn mạnh: **"Define your systems in advance"** — định nghĩa hệ thống trước. Khi bạn code mà mỗi lần lại nghĩ ra một con số mới, bạn đang ra quyết định *lúc chạy* (ad-hoc), và kết quả là hàng chục giá trị gần-giống-nhau rải khắp app. Constrained scale loại bỏ chuyện đó: quyết định một lần, dùng mãi.

### Áp dụng cho mọi thứ, không chỉ spacing
Nguyên tắc "scale hữu hạn" áp dụng cho: font-size, line-height, màu (số bậc màu hữu hạn — xem [[05 - Color & Theming]]), độ bo góc (border-radius), độ đổ bóng (shadow), độ rộng viền. Mỗi thuộc tính có một bộ chọn hữu hạn.

### 💡 Ví dụ mô tả
Border-radius chỉ có 3 lựa chọn: nhỏ (4px cho input), vừa (8px cho card), tròn hẳn (999px cho avatar/pill). Bạn không bao giờ phải nghĩ "bo 6px hay 7px?" nữa — chỉ có 3 cửa để chọn.

### Lợi ích thực tế cho dev
- **Ít quyết định = code nhanh hơn.**
- **Review dễ hơn:** thấy một giá trị ngoài scale là biết ngay có gì đó sai.
- **Đây là bước đệm trực tiếp để tạo Design Tokens** ở phần dưới — vì một scale hữu hạn chính là danh sách token bạn sẽ đặt tên.

### ⚠️ Sai lầm hay gặp
- Có scale nhưng cho phép "ngoại lệ một chút" thường xuyên → dần dần scale vô nghĩa.
- Constrain quá gắt (chỉ 2-3 giá trị spacing cho cả app phức tạp) → không đủ diễn đạt, người ta buộc phải phá rào.

---

## 🎟️ Design Tokens (Khái niệm & phân loại)

**Design Tokens** là **các quyết định thiết kế được lưu dưới dạng biến có tên**, thay cho giá trị "trần" (raw value). Thay vì viết trực tiếp `16px` hay `#3B82F6`, bạn tham chiếu tới một cái tên như `spacing.md` hay `color.primary`.

Theo định nghĩa của **W3C Design Tokens Community Group** (nhóm chuẩn hóa format token), token là đơn vị nhỏ nhất, có tên, mang một giá trị thiết kế — và được đóng gói theo một format chuẩn để nhiều công cụ cùng đọc được.

### Vì sao token > biến CSS thông thường?
Biến CSS chỉ sống trong CSS. Token là khái niệm **platform-agnostic** (không phụ thuộc nền tảng): cùng một token có thể xuất ra CSS variable cho web, ra XML cho Android, ra Swift cho iOS, và đọc được trong Figma. Một nguồn, nhiều đầu ra.

### Phân loại 3 tầng (rất quan trọng)
Đây là kiến trúc token phổ biến nhất, đi từ "thô" đến "ngữ cảnh cụ thể":

1. **Global Tokens (token toàn cục) — còn gọi Primitive / Core / Base:**
   Là giá trị thô, chưa mang ý nghĩa sử dụng. Ví dụ (mô tả bằng lời): "blue-500 = mã màu xanh dương bậc 500", "space-4 = 16px". Chúng chỉ là *bảng nguyên liệu*.

2. **Alias Tokens (token bí danh) — còn gọi Semantic / Theme Tokens:**
   Gán *ý nghĩa* cho global token. Ví dụ: "color.action.primary → trỏ tới blue-500", "spacing.card-padding → trỏ tới space-4". Giờ tên nói lên *mục đích*, không phải giá trị. Đây là tầng làm cho theming (light/dark) khả thi — xem [[05 - Color & Theming]]: chỉ cần alias trỏ sang bộ global khác là đổi cả theme.

3. **Component Tokens (token cấp component):**
   Riêng cho một component cụ thể. Ví dụ: "button.padding.x → trỏ tới spacing.md", "button.background → trỏ tới color.action.primary". Tầng này cho phép chỉnh riêng một component mà không đụng phần còn lại. Liên quan trực tiếp tới [[07 - Components & Interaction Design]].

### 💡 Ví dụ chuỗi tham chiếu bằng lời
`button.background` (component) → trỏ tới `color.action.primary` (alias) → trỏ tới `blue-500` (global) → giá trị thật là một mã màu xanh. Khi cần đổi màu thương hiệu, bạn chỉ sửa `blue-500` một chỗ, mọi thứ phía trên tự cập nhật.

### ⚠️ Sai lầm hay gặp
- **Component dùng thẳng global token** (ví dụ nút trỏ trực tiếp vào blue-500) → mất tầng alias, không theme được, đổi màu phải sửa hàng loạt.
- **Tạo alias cho mọi thứ dù không cần** → quá nhiều tầng gián tiếp, khó lần theo. Chỉ tạo alias khi nó mang ý nghĩa tái dùng thật sự.
- Lẫn lộn "token" với "biến ngẫu hứng": token phải nằm trong scale hữu hạn có chủ đích, không phải mọi biến đều là token.

---

## 🏷️ Naming Convention cho Token (Quy ước đặt tên)

Tên token là thứ bạn gõ mỗi ngày, nên đặt tên tốt quan trọng ngang giá trị nó chứa. Quy ước phổ biến là ghép các "tầng ý nghĩa" theo thứ tự, phân cách bằng dấu chấm hoặc gạch ngang.

### Cấu trúc tên thường gặp
Một tên đầy đủ có thể gồm các phần (đọc từ khái quát đến cụ thể):
- **Category (loại):** color, spacing, font, radius, shadow...
- **Concept / Role (vai trò):** action, surface, text, border, primary, danger...
- **Property (thuộc tính):** background, foreground, padding...
- **State / Variant (trạng thái):** default, hover, disabled, active...
- **Scale (bậc):** 100, 200... 500, hoặc sm, md, lg.

Ví dụ mô tả bằng lời: `color.action.primary.hover` = màu, dùng cho hành động, loại primary, ở trạng thái hover. Đọc tên là hiểu công dụng ngay.

### Nguyên tắc đặt tên
- **Mô tả MỤC ĐÍCH, không mô tả GIÁ TRỊ:** đặt `color.text.danger` chứ đừng `color.red`. Vì mai này "danger" có thể đổi sang cam, tên `color.red` sẽ thành nói dối.
- **Nhất quán thứ tự và số nhiều/số ít:** đã dùng `spacing` thì đừng chỗ khác lại `space`; đã dùng `color` thì đừng chỗ khác `colour`.
- **Global token đặt theo giá trị** (blue-500, space-16) là chấp nhận được, vì chúng vốn là nguyên liệu thô; nhưng **alias và component token phải đặt theo ý nghĩa.**
- **Dễ đoán:** người khác nên đoán được tên token mà không cần tra bảng.

### 💡 Ví dụ mô tả
Cùng một sắc xanh: ở tầng global gọi `blue-600`; ở tầng alias gọi `color.action.primary` (trỏ về blue-600); ở tầng component gọi `button.primary.background` (trỏ về color.action.primary). Ba cái tên, ba mức trừu tượng, nhưng ai nhìn cũng hiểu nó dùng để làm gì.

### ⚠️ Sai lầm hay gặp
- Đặt tên theo màu/số ở tầng semantic → khóa cứng, mất khả năng đổi theme.
- Tên quá dài hoặc quá tắt: vừa đủ để hiểu, đừng viết tắt bí hiểm (`clr.act.pr`).
- Không thống nhất quy ước giữa Figma và code → design nói một tên, dev gọi tên khác, đồng bộ thủ công mệt mỏi.

---

## 🔑 Single Source of Truth (Nguồn chân lý duy nhất)

**Single Source of Truth (SSOT)** nghĩa là mọi giá trị thiết kế **chỉ được định nghĩa ở MỘT nơi duy nhất**, và mọi nơi khác (CSS web, app mobile, file Figma) đều *dẫn xuất* từ nguồn đó, không tự chép lại.

### Vì sao đây là mục tiêu cuối của cả bài
Tất cả những gì ở trên — scale, token, naming — chỉ thực sự có giá trị khi có **một nguồn duy nhất**. Nếu spacing được khai báo lặp lại ở 3 nơi, sớm muộn 3 nơi đó lệch nhau.

### Cách vận hành trong thực tế (mô tả bằng lời, không code)
- Token được lưu ở một nơi trung tâm (thường là file theo format chuẩn của **W3C Design Tokens** — dạng dữ liệu có cấu trúc, độc lập nền tảng).
- Một công cụ **build/transform** (ví dụ *Style Dictionary* của Amazon) đọc nguồn đó rồi *sinh ra* nhiều định dạng: biến CSS cho web, resource cho Android, hằng số cho iOS, thư viện biến cho Figma.
- Khi cần đổi một giá trị, bạn sửa ở nguồn, chạy build lại, mọi nền tảng đồng bộ.

### 💡 Ví dụ mô tả
Thương hiệu đổi màu chủ đạo từ xanh sang tím. Với SSOT: sửa một token global, build lại → web, iOS, Android, Figma đổi màu cùng lúc. Không có SSOT: bạn phải tìm-và-thay ở từng codebase, chắc chắn sót một chỗ.

### ⚠️ Sai lầm hay gặp
- **Copy-paste giá trị** giữa web và mobile "cho nhanh" → hai bên trôi dạt (drift) theo thời gian.
- Coi file Figma và code là hai nguồn ngang hàng, mỗi bên tự sửa → không bao giờ khớp. Phải chọn *một* nguồn làm gốc.
- Có SSOT nhưng dev vẫn hard-code giá trị "tạm" trong component → phá vỡ toàn bộ chuỗi.

---

## 🧩 Mối liên hệ với Design System

**Design System** là tập hợp các nguyên tắc, token, component và quy tắc dùng chung để xây sản phẩm nhất quán, có thể mở rộng. **Design Tokens chính là tầng nền móng (foundation layer) của Design System.**

### Token đứng ở đâu trong bức tranh lớn
Có thể hình dung theo lớp:
1. **Tokens (nền móng):** spacing, màu, typography, radius, shadow — chủ đề của bài này.
2. **Components:** nút, input, card... được xây *bằng* token (component token trỏ về alias trỏ về global). Xem [[07 - Components & Interaction Design]].
3. **Patterns & Layout:** cách ghép component thành trang, dựa trên spacing scale. Xem [[03 - Visual Hierarchy & Layout]].
4. **Guidelines:** khi nào dùng cái gì.

Nếu tầng token vững, các tầng trên tự nhiên nhất quán. Nếu token lộn xộn, xây bao nhiêu component cũng vẫn "lệch pha".

### Vì sao dev SaaS đặc biệt cần điều này
SaaS sống lâu, nhiều màn hình, nhiều người cùng code qua nhiều năm. Không có token + SSOT, mỗi feature mới lại thêm một biến thể spacing/màu → "UI debt" (nợ giao diện) tích tụ. Có hệ thống token, feature mới chỉ việc *lắp ráp* từ nguyên liệu có sẵn — nhanh hơn và nhất quán hơn.

### 💡 Ví dụ mô tả
Team thêm màn hình "Billing" mới. Vì đã có token, dev không hỏi "padding bao nhiêu, màu nút gì" — cứ dùng `spacing.md`, `button.primary`. Kết quả trông y hệt phần còn lại của app dù người code chưa từng chạm các màn khác.

### ⚠️ Sai lầm hay gặp
- Xây component trước, token sau (hoặc không bao giờ) → mỗi component một kiểu, ghép lại không đồng bộ.
- Coi Design System chỉ là "thư viện component" mà quên tầng token nền tảng.
- Dựng token nhưng không ai enforce (không lint, không review) → hệ thống mục dần.

---

## ✅ Tóm lại / Checklist

- [ ] **Whitespace:** bắt đầu bằng nhiều khoảng trắng, bớt dần. Khoảng cách trong nhóm < khoảng cách giữa các nhóm.
- [ ] **8-Point Grid:** mọi spacing & sizing là bội số của 8 (dùng 4 cho tinh chỉnh nhỏ). Không áp cho border 1px.
- [ ] **Spacing Scale:** định nghĩa một bộ giá trị hữu hạn (vd 4, 8, 16, 24, 32, 48, 64px), giãn dần ở phía trên.
- [ ] **Constrained Scale:** CHỈ dùng giá trị trong scale — cho spacing, radius, shadow, font-size, màu. Thấy số ngoài scale là red flag khi review.
- [ ] **Design Tokens:** đóng gói giá trị thành biến có tên, chia 3 tầng — **Global** (thô) → **Alias/Semantic** (ý nghĩa) → **Component** (cụ thể).
- [ ] **Naming:** đặt tên theo MỤC ĐÍCH, không theo giá trị (`color.text.danger` chứ không `color.red`). Nhất quán thứ tự và chính tả.
- [ ] **Single Source of Truth:** mỗi giá trị định nghĩa đúng một nơi; các nền tảng dẫn xuất qua build (vd Style Dictionary). Không copy-paste giá trị.
- [ ] **Design System:** token là tầng nền; component và layout xây trên nó. Có enforce (lint/review) để hệ thống không mục.

---

## 🔗 Nguồn tham khảo

- Refactoring UI — Adam Wathan & Steve Schoger (chương "Spacing", "Systemize Everything"): https://www.refactoringui.com/
- Material Design — Spacing & the 8dp grid: https://m2.material.io/design/layout/spacing-methods.html
- Material Design 3 — Layout / Understanding layout: https://m3.material.io/foundations/layout/understanding-layout/overview
- W3C Design Tokens Community Group — Format Specification: https://www.designtokens.org/tr/drafts/format/
- W3C Design Tokens Community Group (trang chính): https://www.w3.org/community/design-tokens/
- Style Dictionary (build token đa nền tảng, ví dụ SSOT): https://styledictionary.com/
- Design Tokens — Nathan Curtis, "Naming Tokens in Design Systems": https://medium.com/eightshapes-llc/naming-tokens-in-design-systems-9e86c7444676

---

Liên kết chéo: [[03 - Visual Hierarchy & Layout]] · [[04 - Typography]] · [[05 - Color & Theming]] · [[07 - Components & Interaction Design]]
