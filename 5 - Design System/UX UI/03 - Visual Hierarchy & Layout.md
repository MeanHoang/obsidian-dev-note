---
tags:
  - ui
  - visual-design
  - layout
type: note
created: 2026-08-23
---

# 03 - Visual Hierarchy & Layout

## 📌 Ý chính của bài

Là dev, khi build một màn hình SaaS bạn thường ném hết dữ liệu ra rồi để mọi thứ "trông giống nhau": chữ nào cũng đen, size gần bằng nhau, box nào cũng viền như nhau. Kết quả là mắt người dùng không biết nhìn vào đâu trước, màn hình trông "amateur" dù logic code rất chuẩn.

**Visual Hierarchy** (thứ bậc thị giác) và **Layout** (cách sắp đặt các phần tử) là bộ kỹ năng giúp bạn *dẫn dắt ánh mắt* người dùng: cái gì quan trọng thì nổi lên, cái phụ thì lùi xuống, khoảng trống được dùng có chủ đích. Bài này gom lại các kỹ thuật kinh điển từ cuốn **Refactoring UI** (Adam Wathan & Steve Schoger) và các nguyên tắc thị giác cổ điển, giải thích bằng lời — không code — để bạn áp dụng ngay được.

> [!tip] Nguyên tắc gốc
> Thiết kế đẹp không phải là "thêm cho nhiều", mà là **kiểm soát mức độ nổi bật** của từng phần tử. Mọi kỹ thuật dưới đây đều phục vụ một câu hỏi duy nhất: *"Mắt người dùng nên nhìn vào đâu trước, đâu sau?"*

---

## 📐 Visual Hierarchy (Thứ bậc thị giác)

**Là gì:** Sắp xếp các phần tử theo *mức độ quan trọng*, để mắt người dùng tự động lướt từ cái quan trọng nhất xuống cái ít quan trọng hơn. Đây là "xương sống" của cả bài — mọi kỹ thuật khác chỉ là công cụ để tạo ra nó.

**Giải thích dễ hiểu:** Trong một nhóm thông tin, không phải thứ gì cũng ngang hàng. Ví dụ trong một card sản phẩm: tên sản phẩm quan trọng hơn mã SKU, giá quan trọng hơn nhãn "giá:". Việc của bạn là làm cho *tầm quan trọng đó nhìn thấy được bằng mắt*, thông qua kích thước, độ đậm, màu sắc và vị trí.

**Ví dụ mô tả bằng lời:**
- Trong một dashboard hiển thị doanh thu: con số "$42,000" nên to và đậm, còn chữ "Tổng doanh thu tháng này" bên trên nên nhỏ và nhạt màu hơn. Người dùng liếc mắt là thấy con số trước — đúng thứ họ quan tâm.
- Nút hành động chính (vd "Tạo dự án") nên là nút đặc, màu nổi; nút phụ ("Hủy") nên là chữ xám hoặc viền mờ. Không để hai nút "cùng cân nặng".

![[uxui-03-visual-hierarchy.svg]]
*Cùng một card doanh thu: bên trái mọi thứ "cùng cân nặng", bên phải con số to đậm còn nhãn và SKU lùi lại — mắt biết nhìn vào đâu trước.*

**Sai lầm hay gặp:** Làm mọi thứ *nổi bật như nhau*. Khi tất cả đều in đậm, đều màu đậm, đều to — thì thực chất *không có gì nổi bật cả*. Hierarchy bị "phẳng", mắt người dùng phải tự vật lộn để tìm điểm quan trọng.

> Xem thêm nền tảng tâm lý về việc mắt bị hút vào đâu ở [[02 - Laws of UX - Nguyên tắc tâm lý học]].

---

## 🔽 Emphasis by De-emphasis (Nhấn mạnh bằng cách làm mờ đi)

**Là gì:** Một cú "twist" tư duy quan trọng của Refactoring UI: muốn làm nổi bật một phần tử, đừng lúc nào cũng *tăng* độ mạnh cho nó — thường hiệu quả hơn là *giảm* độ mạnh của những phần tử xung quanh.

**Giải thích dễ hiểu:** Nếu bạn cứ tăng size, tăng đậm, tăng màu cho cái cần nhấn, bạn sẽ nhanh chóng "hết chỗ để tăng" (chữ to quá, màu chói quá). Thay vào đó, hãy để phần chính ở mức bình thường và *hạ* các phần phụ xuống (làm nhạt màu, giảm đậm, thu nhỏ). Sự tương phản vẫn xuất hiện, nhưng nhìn tinh tế hơn nhiều.

**Ví dụ mô tả bằng lời:**
- Một dòng thông tin "Trạng thái: Đang hoạt động". Thay vì tô đậm chữ "Đang hoạt động", hãy làm chữ "Trạng thái:" nhạt màu xám đi. Tự nhiên "Đang hoạt động" nổi lên mà không cần đụng gì tới nó.
- Trong menu điều hướng: mục đang được chọn để màu chữ bình thường/đậm, còn các mục khác để màu xám nhạt. Không cần vẽ khung hay tô nền chói cho mục đang chọn.

![[uxui-03-emphasis-de-emphasis.svg]]
*Dòng "Trạng thái: Đang hoạt động": bên trái tô đậm phần chính nên hai vế nặng ngang nhau; bên phải chỉ làm nhạt chữ "Trạng thái:" — phần còn lại tự nổi lên mà không đụng gì tới nó.*

**Sai lầm hay gặp:** Cứ dồn hết năng lượng vào việc "làm cho nó to hơn, đậm hơn, đỏ hơn" cho tới khi giao diện trở nên ồn ào, chói mắt. Quên mất rằng *hạ tông phần phụ* là cách nhẹ nhàng và hiệu quả hơn.

---

## ⚖️ Contrast & Scale (Tương phản & Tỉ lệ)

**Là gì:** **Contrast** là sự khác biệt giữa hai phần tử (đậm/nhạt, to/nhỏ, sáng/tối). **Scale** là chênh lệch về kích thước. Đây là hai công cụ *vật lý* mạnh nhất để tạo hierarchy.

**Giải thích dễ hiểu:** Mắt người bị thu hút bởi *sự khác biệt*. Nếu tiêu đề chỉ to hơn nội dung một chút xíu, não bộ gần như không nhận ra sự phân cấp. Muốn phân cấp rõ, chênh lệch phải *dứt khoát* — tiêu đề phải to hơn hẳn, không phải nhỉnh hơn.

**Ví dụ mô tả bằng lời:**
- Tiêu đề trang nên lớn và đậm hơn *hẳn* so với đoạn văn — đủ để nhìn phát biết ngay đâu là tiêu đề. Nếu hai cái xấp xỉ nhau, hãy mạnh dạn kéo giãn khoảng cách size.
- Đừng chỉ dùng size để tạo tương phản. Refactoring UI khuyên: kết hợp *nhiều tín hiệu* — size + độ đậm (font weight) + màu. Ví dụ một label phụ có thể vừa nhỏ, vừa nhạt màu, vừa mảnh; nhờ đó nó lùi hẳn ra sau mà không cần thu nhỏ đến mức khó đọc.
- Với **weight**: dùng đậm để nhấn, dùng màu nhạt để lùi — tránh dùng chữ mảnh (thin/light) cho chữ nhỏ vì sẽ khó đọc.

![[uxui-03-contrast-scale.svg]]
*Bên trái tiêu đề chỉ nhỉnh hơn nội dung 1px nên phân cấp vô hình; bên phải kết hợp size + weight + màu tạo ba mức rõ rệt: tiêu đề → nội dung → ghi chú.*

**Sai lầm hay gặp:**
- Tương phản *nửa vời*: chênh lệch quá nhỏ khiến hierarchy vô hình.
- Dùng màu xám quá nhạt trên nền trắng làm chữ phụ mất khả năng đọc — de-emphasis không có nghĩa là làm biến mất.

> Chi tiết về cỡ chữ, font weight, tỉ lệ typographic xem [[04 - Typography]]. Cách chọn thang màu xám để nhấn/mờ xem [[05 - Color & Theming]].

---

## 🕳️ Whitespace / Negative Space (Khoảng trắng / Khoảng âm)

**Là gì:** **Whitespace** (hay negative space) là *khoảng trống* giữa và xung quanh các phần tử. Nó không phải chỗ "bỏ phí" — nó là một thành phần thiết kế chủ động.

**Giải thích dễ hiểu:** Khoảng trống giúp mắt "thở", tách nhóm thông tin, và tạo cảm giác cao cấp. Refactoring UI có một lời khuyên rất thực dụng cho dev: **bắt đầu với quá nhiều khoảng trống rồi bớt dần đi**, thay vì bắt đầu chật chội rồi cố nhét thêm khoảng trống sau. Dev thường mắc lỗi nhồi nhét vì sợ "trống trải".

**Ví dụ mô tả bằng lời:**
- Một form đăng ký với các trường cách nhau thoáng đãng, có lề rộng hai bên, sẽ trông chuyên nghiệp hơn hẳn form dồn sát mép màn hình.
- Khoảng trống cũng *mã hóa quan hệ*: nếu label nằm sát trường input của nó nhưng cách xa trường phía trên, mắt tự hiểu label thuộc về trường bên dưới. Khoảng cách trong-nhóm phải nhỏ hơn khoảng cách giữa-các-nhóm.
- Không cần nhồi cho đầy chiều rộng màn hình. Một khối nội dung text giới hạn bề ngang (không kéo dài hết màn hình) sẽ dễ đọc hơn.

![[uxui-03-whitespace.svg]]
*Cùng một form đăng ký: bên trái sát mép và khoảng cách đều tăm tắp gây ngột ngạt; bên phải có lề rộng và khoảng cách trong-nhóm (6) nhỏ hơn khoảng cách giữa-các-nhóm (28).*

**Sai lầm hay gặp:**
- Sợ khoảng trống, cố lấp đầy mọi pixel → giao diện ngột ngạt.
- Dùng khoảng cách *đồng đều* khắp nơi khiến các phần tử không liên quan trông như một nhóm, còn nhóm thật thì bị xé lẻ.

> Việc chuẩn hóa các mức khoảng cách thành hệ thống (spacing scale) được nói kỹ ở [[06 - Spacing & Design Tokens]].

---

## 📏 Alignment (Căn chỉnh)

**Là gì:** Sắp các phần tử theo những *đường thẳng vô hình* chung — căn trái, căn phải, căn theo tâm, hoặc căn theo mép trên/dưới.

**Giải thích dễ hiểu:** Não người rất nhạy với sự thẳng hàng. Chỉ cần một phần tử lệch vài pixel là mắt lập tức thấy "sai sai" dù không gọi tên được. Căn chỉnh nhất quán tạo cảm giác gọn gàng, có trật tự, đáng tin.

**Ví dụ mô tả bằng lời:**
- Trong một form, tất cả label và input nên có chung một mép trái. Mắt lướt dọc theo một đường thẳng, đọc rất nhanh.
- Hạn chế trộn nhiều kiểu căn trong cùng một khối. Một card mà tiêu đề căn giữa, nội dung căn trái, nút căn phải sẽ trông rối. Chọn một trục chủ đạo (thường là căn trái với ngôn ngữ đọc từ trái sang) và bám theo.
- Text dài nên căn trái, không nên căn giữa — căn giữa làm mỗi dòng bắt đầu ở một vị trí khác nhau, mắt khó tìm điểm đầu dòng.

![[uxui-03-alignment.svg]]
*Bên trái một card trộn tiêu đề căn giữa, nội dung căn trái, nút căn phải nên có tới 4 "đường căn ngầm" lộn xộn; bên phải mọi thứ bám chung một trục căn trái.*

**Sai lầm hay gặp:**
- Căn giữa những đoạn văn dài nhiều dòng → khó đọc.
- Có những "đường căn" ngầm khác nhau lộn xộn khắp trang, tạo cảm giác cẩu thả dù từng phần tử đều đẹp.

---

## 🧱 Grid System (12-column) (Hệ lưới 12 cột)

**Là gì:** Chia bề ngang màn hình thành các *cột đều nhau* (phổ biến nhất là 12 cột) với khoảng cách giữa các cột (gutter) cố định. Mọi phần tử được đặt sao cho mép của chúng khớp vào các đường cột này.

**Giải thích dễ hiểu:** Số 12 được chọn vì nó chia hết cho nhiều số (2, 3, 4, 6), nên rất linh hoạt: bạn có thể tạo bố cục 2 cột (6+6), 3 cột (4+4+4), 4 cột (3+3+3+3)... mà vẫn giữ được sự cân đối. Grid cho bạn một bộ khung để mọi thứ tự động thẳng hàng, đỡ phải "canh bằng mắt" từng phần tử.

**Ví dụ mô tả bằng lời:**
- Một trang dashboard: sidebar chiếm 3 cột bên trái, khu vực nội dung chính chiếm 9 cột bên phải. Bên trong khu 9 cột đó lại chia tiếp thành các card 3 cột mỗi cái (4 card một hàng).
- Khi responsive: trên màn hình nhỏ, các cột "gộp lại" — thay vì 4 card một hàng thì thành 1 card mỗi hàng (mỗi card chiếm đủ 12 cột).

![[uxui-03-grid-12-column.svg]]
*Lưới 12 cột với sidebar chiếm 3 cột (nên để rộng cố định) và khu nội dung 9 cột, bên trong chia tiếp thành 4 card 3 cột mỗi cái.*

**Lưu ý quan trọng (Refactoring UI):** Đừng thần thánh hóa việc "mọi thứ phải chia theo %". Một số phần tử nên có *kích thước cố định* (ví dụ sidebar nên rộng cố định để menu không bị bóp méo khi màn hình co giãn), chỉ phần nội dung chính mới co giãn theo grid. Grid là công cụ, không phải luật cứng.

**Sai lầm hay gặp:**
- Ép mọi thành phần (kể cả những cái nên cố định như avatar, icon) phải co giãn theo % của grid → phần tử bị méo, quá to hoặc quá nhỏ ở các kích thước màn hình khác nhau.
- Chọn số cột lẻ khó chia, gây khó khi cần bố cục 3 hoặc 4 phần bằng nhau.

---

## 🧲 Law of Proximity trong Layout (Quy luật Cận kề)

**Là gì:** Một nguyên tắc từ tâm lý học thị giác Gestalt: các phần tử *đặt gần nhau* được não bộ hiểu là *thuộc cùng một nhóm*; các phần tử *cách xa nhau* được hiểu là thuộc các nhóm khác nhau.

**Giải thích dễ hiểu:** Bạn không cần vẽ khung, kẻ đường, tô nền để "gom nhóm" thông tin. Chỉ cần *khoảng cách* là đủ để mắt tự phân nhóm. Đây là cách gom nhóm rẻ nhất và sạch nhất.

**Ví dụ mô tả bằng lời:**
- Một danh sách thông tin liên hệ: nhóm "tên + chức danh" đặt sát nhau, rồi chừa một khoảng trống rõ, rồi mới đến nhóm "email + số điện thoại". Mắt lập tức hiểu đây là hai cụm thông tin.
- Label của một trường input phải nằm *gần trường của nó* và *xa* trường phía trên. Nếu khoảng cách trên–dưới bằng nhau, người dùng sẽ bối rối không biết label thuộc trường nào.
- Nút "Lưu" và "Hủy" của một dialog nên nằm gần nhau (cùng nhóm hành động), tách khỏi nội dung phía trên.

![[uxui-03-proximity.svg]]
*Cùng một khối thông tin liên hệ: bên trái khoảng cách đều nhau nên 5 dòng rời rạc như nhau; bên phải chỉ đổi khoảng cách là mắt tự tách thành 3 cụm, không cần kẻ đường hay vẽ khung.*

**Sai lầm hay gặp:**
- Dùng khoảng cách đều tăm tắp cho mọi thứ → phá vỡ khả năng phân nhóm, mọi phần tử trông rời rạc như nhau.
- Lạm dụng đường kẻ và khung viền để chia nhóm trong khi chỉ cần điều chỉnh khoảng cách là đủ → giao diện đầy vạch kẻ, rối mắt.

> Đây là một trong các "Laws of UX" — xem thêm bối cảnh ở [[02 - Laws of UX - Nguyên tắc tâm lý học]].

---

## 👁️ Z-Pattern & F-Pattern (Mẫu đọc chữ Z và chữ F)

**Là gì:** Hai mô hình mô tả *đường đi của mắt* khi người dùng quét một trang (với ngôn ngữ đọc từ trái sang phải, trên xuống dưới).

**Giải thích dễ hiểu:**
- **Z-Pattern:** Mắt đi từ góc trên-trái → sang góc trên-phải → chéo xuống góc dưới-trái → sang góc dưới-phải, vẽ thành hình chữ Z. Thường xảy ra với các trang *ít chữ, nhiều mảng* như landing page, hero section.
- **F-Pattern:** Mắt quét ngang dòng đầu tiên, rồi ngang dòng thứ hai (ngắn hơn), rồi trượt dọc theo mép trái xuống dưới, vẽ thành hình chữ F. Thường xảy ra với các trang *nhiều text* như blog, danh sách kết quả, tài liệu.

**Ví dụ mô tả bằng lời:**
- Landing page theo Z-Pattern: logo đặt góc trên-trái, nút "Đăng ký" đặt góc trên-phải, thông điệp chính ở giữa, nút hành động chính (call-to-action) đặt ở vùng dưới-phải nơi mắt kết thúc hành trình.
- Trang blog theo F-Pattern: đặt thông tin quan trọng (tiêu đề, câu mở đầu, từ khóa) dồn về *đầu dòng bên trái* và *phần trên của trang*, vì mắt quét dọc mép trái và ít khi đọc kỹ phần cuối các dòng.

![[uxui-03-z-f-pattern.svg]]
*Bên trái: landing page với logo góc trên-trái, nút "Đăng ký" góc trên-phải và CTA ở vùng dưới-phải nơi chữ Z kết thúc; bên phải: trang nhiều chữ với mắt quét hai dòng đầu rồi trượt dọc mép trái thành chữ F.*

**Sai lầm hay gặp:**
- Giấu nút call-to-action ở vị trí mắt không đi qua (ví dụ góc dưới-trái trong bố cục Z).
- Nhồi thông tin quan trọng vào cuối các dòng dài trong trang nhiều text (F-Pattern) — nơi mắt lướt qua mà không đọc.
- Áp dụng máy móc: đây là *xu hướng thống kê*, không phải luật bất biến. Một trang có hierarchy mạnh (dùng contrast, whitespace tốt) có thể *dẫn* mắt theo ý bạn, vượt lên trên mẫu Z/F mặc định.

---

## 🃏 Depth & Elevation (Chiều sâu & Độ nổi) — sơ lược

**Là gì:** Tạo cảm giác các phần tử *nổi lên hoặc chìm xuống* so với mặt phẳng nền, giả lập không gian 3 chiều trên màn hình phẳng. Công cụ chính là **shadow** (bóng đổ) và sắc độ màu.

**Giải thích dễ hiểu:** Trong thế giới thật, vật ở gần nguồn sáng và nhô cao thì có bóng đổ *nhẹ và gần*; vật càng cao/càng nổi thì bóng càng *lớn, mềm và tỏa rộng*. Refactoring UI khuyên dùng *hai lớp bóng* cho mỗi độ cao: một bóng nhỏ sắc nét (mô phỏng vật chặn ánh sáng trực tiếp) và một bóng lớn mờ (mô phỏng ánh sáng khuếch tán). "Độ nổi" nên tương ứng với *tầm quan trọng và mức độ tương tác*: phần tử càng tương tác/nổi bật thì càng nên "nổi cao".

**Ví dụ mô tả bằng lời:**
- Một card thông thường có bóng rất nhẹ, gần như dán sát mặt nền. Khi người dùng rê chuột vào (hover) hoặc kéo thả, bóng lớn hơn và mềm hơn — tạo cảm giác nó "nhấc lên khỏi mặt bàn".
- Dropdown menu, modal, tooltip là những thứ "nổi cao nhất" (chúng đè lên nội dung khác), nên có bóng rõ và lớn để thể hiện rằng chúng ở lớp trên cùng.
- Ngược lại, một ô input có thể trông như "lõm xuống" nhẹ để mời gọi người dùng điền vào.

![[uxui-03-depth-elevation.svg]]
*Bên trái bóng đen đặc và cứng dùng chung cho mọi thứ; bên phải là thang độ nổi nhất quán (card nghỉ → card hover → modal), mỗi mức dùng hai lớp bóng mờ, còn ô input thì "lõm xuống".*

**Sai lầm hay gặp:**
- Bóng đen đặc, cứng, không mờ → trông giả và rẻ tiền. Bóng thật gần như luôn *mờ và hơi trong suốt*.
- Dùng cùng một mức bóng cho mọi thứ → mất luôn ý nghĩa phân lớp. Nên có một *thang độ nổi* (elevation scale) nhất quán: nghỉ, nổi nhẹ, nổi cao.
- Lạm dụng bóng ở mọi phần tử → giao diện "bồng bềnh" mệt mắt. Phần lớn nội dung nên phẳng, chỉ những gì cần nhấn mới nổi.

---

## ✅ Tóm lại / Checklist

- [ ] **Visual Hierarchy:** Xác định rõ đâu là phần tử quan trọng nhất trong mỗi khối, và nó có *thật sự nổi bật nhất* bằng mắt không?
- [ ] **Emphasis by De-emphasis:** Trước khi tăng độ mạnh cho phần chính, thử *hạ tông* các phần phụ (làm nhạt màu, giảm đậm) xem có đủ chưa.
- [ ] **Contrast & Scale:** Chênh lệch giữa tiêu đề và nội dung có *dứt khoát* không, hay chỉ nhỉnh hơn một chút? Đã kết hợp size + weight + màu chưa?
- [ ] **Whitespace:** Bắt đầu với nhiều khoảng trống rồi bớt dần. Khoảng cách trong-nhóm có nhỏ hơn khoảng cách giữa-các-nhóm không?
- [ ] **Alignment:** Mọi phần tử có bám vào các đường căn chung không? Đã tránh căn giữa cho text dài chưa?
- [ ] **Grid System:** Dùng lưới 12 cột để mọi thứ thẳng hàng, nhưng cho phép một số phần tử (sidebar, icon) có kích thước cố định.
- [ ] **Law of Proximity:** Gom nhóm bằng *khoảng cách* trước khi nghĩ tới đường kẻ hay khung viền.
- [ ] **Z/F-Pattern:** Đặt thông tin quan trọng và call-to-action vào đường đi tự nhiên của mắt; nhưng nhớ hierarchy mạnh có thể dẫn mắt vượt lên mẫu mặc định.
- [ ] **Depth & Elevation:** Dùng bóng mờ, nhiều lớp; độ nổi tương ứng với tầm quan trọng; đừng cho mọi thứ đều nổi.

> [!summary] Một câu để nhớ
> Layout đẹp không đến từ việc thêm hiệu ứng, mà từ việc *kiểm soát mức độ nổi bật*: cho mắt biết nhìn vào đâu trước, và để khoảng trống làm phần lớn công việc.

---

## 🔗 Nguồn tham khảo

- Refactoring UI — Adam Wathan & Steve Schoger (sách gốc): https://www.refactoringui.com/
- Refactoring UI — Bài viết "7 Practical Tips for Cheating at Design": https://medium.com/refactoring-ui/7-practical-tips-for-cheating-at-design-40c736799886
- Laws of UX — Law of Proximity: https://lawsofux.com/law-of-proximity/
- Nielsen Norman Group — F-Shaped Pattern For Reading Web Content: https://www.nngroup.com/articles/f-shaped-pattern-reading-web-content/
- Interaction Design Foundation — Gestalt Principles: https://www.interaction-design.org/literature/topics/gestalt-principles
- Interaction Design Foundation — Visual Hierarchy: https://www.interaction-design.org/literature/topics/visual-hierarchy
- Material Design — Elevation: https://m2.material.io/design/environment/elevation.html

---
*Liên kết chéo: [[02 - Laws of UX - Nguyên tắc tâm lý học]] · [[04 - Typography]] · [[05 - Color & Theming]] · [[06 - Spacing & Design Tokens]]*
