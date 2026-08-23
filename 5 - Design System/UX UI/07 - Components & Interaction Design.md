---
tags:
  - ui
  - ux
  - components
  - interaction-design
type: note
created: 2026-08-23
---

# 07 - Components & Interaction Design

## 📌 Ý chính của bài

Một component (thành phần giao diện, ví dụ nút bấm, ô nhập liệu) không chỉ là "cái hình nhìn thấy được". Nó là một **vật thể có hành vi**: nó phản ứng khi người dùng rê chuột, bấm vào, gõ chữ, hoặc khi hệ thống đang xử lý. Phần "hành vi" đó chính là **Interaction Design (thiết kế tương tác)** — và đây là thứ tách biệt một app trông "xịn, mượt, đáng tin" với một app trông "sơ sài, đơ, nghiệp dư".

Với dân dev SaaS, bạn code component mỗi ngày. Vấn đề thường không phải ở code, mà ở chỗ **quên mất các trạng thái và phản hồi** mà một component tử tế cần có. Bài này đi qua từng khái niệm theo tên gọi chuẩn, để bạn có một checklist tinh thần: mỗi khi dựng một component, bạn biết chính xác cần lo những gì.

Liên quan: các nguyên tắc tâm lý học đứng sau nhiều quy tắc ở đây nằm ở [[02 - Laws of UX - Nguyên tắc tâm lý học]]; khoảng cách và kích thước lấy từ [[06 - Spacing & Design Tokens]]; khả năng dùng được cho mọi người ở [[08 - Accessibility (a11y)]]; và cách áp dụng vào sản phẩm thật ở [[09 - UX cho SaaS]].

---

## 🔘 Component States (Các trạng thái của component)

**Là gì:** State (trạng thái) là "bộ mặt" khác nhau mà một component thể hiện tùy theo tình huống. Cùng một cái nút, nhưng lúc bình thường, lúc bạn rê chuột lên, lúc bạn đang bấm, lúc bị khóa... phải trông khác nhau. Người dùng đọc những khác biệt hình ảnh này để hiểu "cái này bấm được không, đang xảy ra chuyện gì".

Các trạng thái phổ biến cần lo:

- **Default (mặc định):** trạng thái nghỉ, chưa ai đụng vào.
- **Hover (rê chuột lên):** báo hiệu "cái này tương tác được". Chỉ có trên thiết bị có con trỏ chuột — trên mobile không có hover, nên đừng để thông tin quan trọng chỉ hiện khi hover.
- **Focus (được chọn/đang nhắm tới):** khi người dùng dùng phím Tab để di chuyển tới, hoặc click vào ô input. Đây là trạng thái sống còn cho người dùng bàn phím và screen reader — xem [[08 - Accessibility (a11y)]]. Tuyệt đối không xóa viền focus chỉ vì thấy "xấu".
- **Active/Pressed (đang bấm):** khoảnh khắc ngón tay/chuột đang nhấn xuống. Phản hồi tức thì cho biết "hệ thống nhận được cú bấm rồi".
- **Disabled (bị khóa):** không dùng được lúc này (ví dụ nút Submit khi form chưa hợp lệ). Thường làm mờ đi và bỏ con trỏ pointer.
- **Loading (đang xử lý):** hành động đã được ghi nhận và đang chạy — thường kèm spinner và khóa nút để tránh bấm hai lần.
- **Error (lỗi):** component đang ở tình trạng có vấn đề (ví dụ ô input nhập sai định dạng), thường viền đỏ kèm thông báo.

**Ví dụ SaaS:** Nút "Invite member" trong trang team settings: default (xanh) → hover (xanh đậm hơn) → active (lún xuống) → loading (spinner + chữ "Inviting...") → thành công đổi thành toast xanh, hoặc error nếu email trùng.

**Sai lầm hay gặp:** Chỉ thiết kế mỗi trạng thái default rồi coi như xong. Kết quả: nút bấm không có hover, không có loading, người dùng bấm 3 lần vì tưởng máy đơ → gửi 3 lời mời trùng nhau. Một component "chưa xong" là component thiếu state.

---

## ⚡ Interactive Feedback (Phản hồi tức thì)

**Là gì:** Mỗi hành động của người dùng phải nhận được một phản hồi từ hệ thống, và phản hồi càng nhanh càng tốt. Đây là nguyên tắc "Visibility of System Status" (khả năng nhìn thấy trạng thái hệ thống) — heuristic số 1 của Nielsen Norman Group. Con người cần biết "hệ thống có nghe mình không".

Có mấy mốc thời gian đáng nhớ (theo NN/g): dưới ~0.1 giây cảm giác **tức thì**; tới ~1 giây người dùng vẫn thấy liền mạch nhưng nhận ra có độ trễ; quá ~10 giây là mất tập trung, nên hiển thị tiến trình rõ ràng.

**Ví dụ SaaS:** Bấm "Save settings" mà mất 2 giây gọi API → phải đổi ngay nút sang loading. Bật/tắt một toggle → nó phải nhảy ngay lập tức chứ không đợi server (xem thêm Optimistic UI bên dưới). Kéo thả một card trong bảng Kanban → card phải "dính" theo con trỏ tức thì.

**Sai lầm hay gặp:** Bấm nút xong "không có gì xảy ra" trong 1-2 giây rồi mới nhảy. Trong khoảng im lặng đó, người dùng nghĩ là hỏng và bấm lại. Luôn lấp đầy khoảng trống giữa "hành động" và "kết quả" bằng một dấu hiệu.

---

## 🎯 Affordance & Signifier trong component

**Là gì:** Hai khái niệm của Don Norman, thường bị nhầm lẫn:

- **Affordance (khả năng cho phép):** khả năng hành động mà một vật cho phép. Một cái nút *có thể* bấm được — đó là affordance của nó.
- **Signifier (dấu hiệu chỉ báo):** tín hiệu hình ảnh cho người dùng *biết* affordance đó tồn tại. Cái nút trông có bóng đổ, có màu nổi, con trỏ đổi thành hình bàn tay → đó là các signifier báo "bấm được đây".

Nói ngắn: affordance là "làm được gì", signifier là "làm sao người dùng biết mình làm được".

**Ví dụ SaaS:** Trong một bảng dữ liệu, một ô text có thể click để sửa tại chỗ (inline edit). Nếu nhìn y hệt text thường thì không ai biết bấm được (thiếu signifier). Thêm một icon bút chì mờ hiện khi hover, hoặc gạch chân nét đứt → người dùng hiểu ngay "sửa được".

**Sai lầm hay gặp:** Chạy theo thẩm mỹ "phẳng, tối giản" đến mức nút không còn trông như nút, link không trông như link. Đẹp nhưng người dùng không biết đâu là thứ bấm được — gọi là "flat design gây mù tương tác". Giữ đủ signifier: màu, viền, con trỏ, gạch chân cho link.

---

## 🥇 Button Hierarchy (Thứ bậc của nút bấm)

**Là gì:** Trên một màn hình thường có nhiều hành động, nhưng chúng không quan trọng ngang nhau. **Button hierarchy** là dùng độ nổi bật của nút để nói cho người dùng biết "đâu là hành động chính, đâu là phụ". Mắt người tự động bị hút về thứ nổi nhất — đây là ứng dụng của visual hierarchy trong Refactoring UI.

Các cấp thường dùng:

- **Primary (nút chính):** hành động quan trọng nhất trên màn hình. Nổi bật nhất — thường nền đặc, màu thương hiệu. Nguyên tắc: **mỗi khu vực chỉ nên có một primary**.
- **Secondary (nút phụ):** hành động thứ yếu nhưng vẫn quan trọng. Thường viền (outline) hoặc nền nhạt, không đặc.
- **Tertiary (nút hạng ba):** hành động ít quan trọng, thường trông gần như một link có màu.
- **Ghost (nút trong suốt):** không nền, không viền, chỉ có chữ; nổi lên khi hover. Dùng cho hành động rất phụ để không gây nhiễu.

**Ví dụ SaaS:** Trong modal xác nhận xóa project: "Delete project" là hành động chính của modal nhưng lại **nguy hiểm**, nên thường làm màu đỏ (destructive primary); "Cancel" làm ghost hoặc secondary để không cạnh tranh sự chú ý. Ngược lại trong form tạo mới: "Create" là primary xanh, "Cancel" là ghost.

**Sai lầm hay gặp:** Để hai, ba nút primary cạnh nhau cùng nổi như nhau. Người dùng bị "tê liệt lựa chọn", không biết nên bấm cái nào — vi phạm nguyên tắc giảm tải nhận thức ở [[02 - Laws of UX - Nguyên tắc tâm lý học]]. Quy tắc vàng: nếu mọi thứ đều nổi bật thì chẳng có gì nổi bật.

---

## 📝 Form Design (Thiết kế biểu mẫu)

**Là gì:** Form là nơi người dùng "nói chuyện" với hệ thống bằng cách nhập dữ liệu — và cũng là nơi SaaS mất khách nhiều nhất nếu làm ẩu. Bốn thành phần cần làm đúng:

- **Label (nhãn):** chữ mô tả ô input dùng để làm gì. **Luôn hiển thị label riêng, đặt phía trên ô** (dễ đọc, dễ scan nhất theo NN/g). Label phải luôn nhìn thấy được kể cả khi người dùng đã gõ chữ.
- **Placeholder (chữ gợi ý mờ trong ô):** chỉ để cho *ví dụ định dạng*, ví dụ "vd: yourname@company.com". **Không được dùng placeholder thay cho label** — vì khi người dùng bắt đầu gõ, placeholder biến mất, họ quên ô này là gì, và placeholder màu xám thường không đạt chuẩn tương phản (xem [[08 - Accessibility (a11y)]]).
- **Validation (kiểm tra tính hợp lệ):** kiểm tra dữ liệu có đúng không. Tốt nhất là kiểm tra **khi người dùng rời khỏi ô (on blur)**, không phải gõ từng ký tự đã báo đỏ (gây khó chịu), cũng không đợi đến lúc bấm Submit mới báo hết một loạt.
- **Error message (thông báo lỗi):** phải nói **rõ lỗi gì và cách sửa**, đặt ngay cạnh ô bị lỗi, không phải một dòng chung chung trên đầu trang. "Mật khẩu cần ít nhất 8 ký tự" tốt hơn nhiều so với "Dữ liệu không hợp lệ".

**Ví dụ SaaS:** Form đăng ký: ô email có label "Work email" ở trên, placeholder "you@company.com" bên trong, khi rời ô mà sai định dạng thì viền đỏ + dòng chữ "Email này chưa đúng định dạng" ngay bên dưới, và nút "Create account" chỉ bật khi mọi ô hợp lệ.

**Sai lầm hay gặp:** Dùng placeholder làm label (lỗi kinh điển), báo lỗi chung chung, hoặc bắt người dùng đoán yêu cầu mật khẩu rồi mới báo sai sau khi bấm Submit. Hãy nói trước yêu cầu, và báo lỗi đúng chỗ đúng lúc.

---

## 💬 Microcopy (Chữ nghĩa trong UI)

**Là gì:** Microcopy là những đoạn chữ nhỏ nhưng cực quan trọng trong giao diện: chữ trên nút, nhãn, tooltip, thông báo lỗi, dòng trạng thái rỗng (empty state), placeholder. Chúng nhỏ nhưng định hình cảm giác tin cậy và sự rõ ràng của cả sản phẩm.

Nguyên tắc: viết như đang nói với một con người, **rõ ràng hơn là "kêu"**. Chữ trên nút nên là **động từ mô tả kết quả** thay vì chung chung.

**Ví dụ SaaS:** Nút "Get started free" tốt hơn "Submit". Trong dialog xóa: nút "Delete 3 files" (nói rõ hậu quả) tốt hơn "OK". Empty state của trang Projects: thay vì để trống trơn, viết "Chưa có project nào — tạo cái đầu tiên để bắt đầu" kèm nút tạo. Thông báo thành công: "Đã lưu thay đổi" thay vì "Success".

**Sai lầm hay gặp:** Dùng "OK / Yes / Submit" ở khắp nơi khiến người dùng phải đọc lại câu hỏi mới biết mình đang đồng ý cái gì. Nút nên tự mô tả hành động của chính nó, đọc rời ra vẫn hiểu.

---

## ✨ Micro-interactions (Tương tác nhỏ)

**Là gì:** Micro-interaction là một khoảnh khắc tương tác nhỏ, đơn nhiệm, xoay quanh một hành động duy nhất — ví dụ: bật/tắt một toggle, nhấn "thích", kéo để refresh, hộp thư báo có tin mới. Khái niệm được Dan Saffer đặt tên. Nó gồm 4 phần: **trigger** (kích hoạt), **rules** (luật), **feedback** (phản hồi), và **loops/modes** (vòng lặp/chế độ).

Chúng nhỏ nhưng làm sản phẩm "có hồn" và cho phản hồi tức thì.

**Ví dụ SaaS:** Toggle bật tính năng: khi bấm, nút trượt mượt từ trái sang phải và đổi màu — đó là feedback trực quan xác nhận trạng thái đã đổi. Icon chuông thông báo rung nhẹ một cái khi có notification mới. Nút "Copy API key" bấm xong đổi thành dấu tích "Copied!" trong 2 giây rồi trở lại.

**Sai lầm hay gặp:** Nhồi micro-interaction ở mọi nơi cho "vui mắt" khiến giao diện rối và chậm. Micro-interaction tốt phải **phục vụ một mục đích** (xác nhận, hướng dẫn, cho biết trạng thái), không phải trang trí.

---

## 🎬 Motion & Animation (Chuyển động & hoạt họa)

**Là gì:** Animation trong UI không phải để "cho đẹp" mà để **giúp người dùng hiểu chuyện gì đang xảy ra**: cái gì xuất hiện, biến mất, di chuyển đi đâu, cái gì liên quan cái gì. Material Design gọi đây là motion có mục đích. Ba yếu tố kỹ thuật cần nắm:

- **Duration (thời lượng):** animation UI nên **nhanh và gọn**. Material Design gợi ý chuyển đổi trên **desktop nhanh hơn (~150–200ms)**, còn trên **mobile** chuyển đổi lớn khoảng ~300–400ms và phần tử nhỏ ~150–200ms; nhìn chung phần lớn chuyển đổi UI rơi vào khoảng ~200–300ms — phần tử nhỏ nhanh hơn, phần tử to/di chuyển xa lâu hơn một chút. Quá dài (nửa giây trở lên) là người dùng thấy chậm chạp.
- **Easing (gia tốc):** đường cong tốc độ, để chuyển động trông tự nhiên thay vì máy móc. Vật thật không di chuyển với tốc độ đều tăm tắp (linear) — chúng tăng tốc rồi giảm dần. "Ease-out" (nhanh lúc đầu, chậm lại lúc cuối) thường dùng cho thứ đang xuất hiện.
- **Purpose (mục đích):** mỗi animation phải trả lời "nó giúp người dùng hiểu điều gì?". Ví dụ: modal trượt lên từ nút vừa bấm → cho thấy mối liên hệ giữa nút và modal.

**Ví dụ SaaS:** Menu dropdown mở ra với hiệu ứng trượt xuống + mờ dần trong ~200ms → mắt kịp theo dõi nó xuất hiện từ đâu. Một dòng vừa được thêm vào bảng thì highlight vàng nhạt rồi phai đi → mắt biết ngay dòng nào mới.

**Sai lầm hay gặp:** Lạm dụng animation dài, nảy tưng tưng, hoặc chạy ở mọi thao tác lặp lại nhiều lần (ví dụ mỗi lần chuyển tab) → gây khó chịu và làm chậm cảm giác thao tác. Ngoài ra phải tôn trọng cài đặt "reduced motion" của người dùng (xem [[08 - Accessibility (a11y)]]) vì animation mạnh có thể gây chóng mặt. Nguyên tắc: animation nên **mờ nhạt đến mức người dùng gần như không nhận ra**, chỉ cảm thấy mọi thứ mượt.

---

## 💀 Loading States & Skeleton Screens (Trạng thái tải & màn hình khung xương)

**Là gì:** Khi dữ liệu đang được tải, đừng để màn hình trống hoặc đứng hình. Có hai kiểu chỉ báo chờ:

- **Spinner (vòng xoay):** phù hợp cho **chờ ngắn, ở một chỗ nhỏ** (ví dụ nút đang loading, hoặc một widget nhỏ).
- **Skeleton screen (màn hình khung xương):** những khối xám mờ mô phỏng bố cục sắp hiện ra (khung tiêu đề, dòng chữ, avatar tròn...). Phù hợp cho **tải cả trang/khối lớn**. Skeleton khiến người dùng *cảm thấy* nhanh hơn vì họ thấy cấu trúc nội dung đang thành hình, thay vì nhìn một spinner quay vô định.

Có nguyên tắc quan trọng: với chờ **rất ngắn (dưới ~1 giây)**, đôi khi *không hiện* chỉ báo gì lại tốt hơn, vì một spinner chớp tắt gây cảm giác giật.

**Ví dụ SaaS:** Mở dashboard analytics: thay vì spinner giữa màn hình trống, hiện skeleton của các thẻ số liệu và biểu đồ (các khối xám) → khi dữ liệu về thì "lấp" vào đúng chỗ, chuyển tiếp mượt mà.

**Sai lầm hay gặp:** Dùng spinner toàn màn hình cho mọi thứ (kể cả khi chỉ đổi một phần nhỏ). Hoặc để layout "nhảy giật" (layout shift) khi nội dung load xong đẩy mọi thứ xuống — skeleton nên chiếm đúng kích thước của nội dung thật để tránh nhảy. Vấn đề khoảng cách/kích thước liên quan [[06 - Spacing & Design Tokens]].

---

## 🚀 Optimistic UI (Giao diện lạc quan) — sơ lược

**Là gì:** Bình thường, khi người dùng làm gì đó cần gọi server, giao diện *đợi* server trả lời rồi mới cập nhật. **Optimistic UI** làm ngược lại: giả định thao tác sẽ **thành công** và cập nhật giao diện **ngay lập tức**, đồng thời âm thầm gọi server ở nền. Nếu server báo lỗi thì mới hoàn tác (rollback) lại và báo cho người dùng.

Lợi ích: giao diện phản hồi tức thì, cảm giác cực nhanh — dù mạng có độ trễ. Đây là một dạng cao cấp của Interactive Feedback ở trên.

**Ví dụ SaaS:** Bấm "thích" một comment → tim đỏ lên ngay và số đếm tăng ngay, không đợi API. Kéo một task từ cột "To do" sang "Done" trong Kanban → task nhảy sang ngay. Nếu chẳng may server lỗi, nó lặng lẽ quay về chỗ cũ kèm một thông báo nhỏ "Không lưu được, thử lại".

**Sai lầm hay gặp:** Dùng optimistic UI cho hành động **có hậu quả nặng hoặc dễ thất bại** (ví dụ thanh toán, thao tác tiền bạc) — nếu rollback sẽ gây hoang mang và mất niềm tin. Chỉ nên dùng cho thao tác nhẹ, khả năng thành công cao (thích, đổi trạng thái, sắp xếp). Ngoài ra phải xử lý rollback tử tế; nếu "báo thành công giả" rồi âm thầm mất dữ liệu thì còn tệ hơn không dùng.

---

## ✅ Tóm lại / Checklist

Khi dựng bất kỳ component nào, tự hỏi:

- [ ] **States:** Đã lo đủ default / hover / focus / active / disabled / loading / error chưa?
- [ ] **Focus:** Có viền focus rõ ràng cho người dùng bàn phím không? (đừng xóa)
- [ ] **Feedback:** Mỗi hành động có phản hồi tức thì không? Không để "khoảng lặng chết".
- [ ] **Affordance/Signifier:** Người dùng có nhìn ra thứ nào bấm/sửa được không?
- [ ] **Button hierarchy:** Mỗi khu vực chỉ một primary? Nút phụ có bị nổi tranh không?
- [ ] **Form:** Label luôn hiện (không thay bằng placeholder)? Lỗi báo rõ ràng, đúng chỗ, đúng lúc (on blur)?
- [ ] **Microcopy:** Chữ trên nút là động từ mô tả kết quả, đọc rời vẫn hiểu?
- [ ] **Micro-interaction & Motion:** Có mục đích rõ ràng? Nhanh (~200–300ms), easing tự nhiên, không lạm dụng, tôn trọng reduced motion?
- [ ] **Loading:** Skeleton cho khối lớn, spinner cho chỗ nhỏ, tránh layout shift?
- [ ] **Optimistic UI:** Chỉ dùng cho thao tác nhẹ, khả năng thành công cao, và có rollback tử tế?

Quy tắc bao trùm: **một component chưa lo hết các trạng thái và phản hồi là một component chưa hoàn thành**, dù nó nhìn đẹp đến mấy.

---

## 🔗 Nguồn tham khảo

- Nielsen Norman Group — Visibility of System Status: https://www.nngroup.com/articles/visibility-system-status/
- Nielsen Norman Group — Response Times: The 3 Important Limits: https://www.nngroup.com/articles/response-times-3-important-limits/
- Nielsen Norman Group — Placeholders in Form Fields Are Harmful: https://www.nngroup.com/articles/form-design-placeholders/
- Nielsen Norman Group — Skeleton Screens: https://www.nngroup.com/articles/skeleton-screens/
- Nielsen Norman Group — Error Message Guidelines: https://www.nngroup.com/articles/error-message-guidelines/
- Material Design — Motion (Speed / Duration & Easing): https://m2.material.io/design/motion/speed.html
- Material Design — States: https://m2.material.io/design/interaction/states.html
- Material Design 3 — Buttons: https://m3.material.io/components/buttons/overview
- Refactoring UI (Adam Wathan & Steve Schoger): https://www.refactoringui.com/
- Don Norman — Affordances and Signifiers (The Design of Everyday Things): https://jnd.org/signifiers_not_affordances/
- Dan Saffer — Microinteractions: https://microinteractions.com/
