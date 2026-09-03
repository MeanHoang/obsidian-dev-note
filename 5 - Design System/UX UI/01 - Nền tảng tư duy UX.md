---
tags:
  - ux
  - ui
  - design-system
  - mindset
type: note
created: 2026-08-23
---

# 01 - Nền tảng tư duy UX

## 📌 Ý chính của bài

- UX không phải "làm cho đẹp" mà là làm cho **đúng nhu cầu người dùng** — tư duy đi trước con mắt thẩm mỹ.
- Có một bộ khái niệm gốc mà mọi designer/dev đều nhắc tới: **UCD, Don Norman's Principles, Mental Model, UX Honeycomb, Double Diamond**. Nắm được là bạn "nói cùng ngôn ngữ" với team design.
- Là dev SaaS, bạn hưởng lợi trực tiếp: hiểu tại sao user click nhầm, tại sao onboarding rơi rớt, tại sao feature hay mà không ai dùng.
- Bài này chỉ lo **tư duy nền (foundation)**. Nguyên tắc tâm lý chi tiết xem [[02 - Laws of UX - Nguyên tắc tâm lý học]]; cách sắp xếp bố cục xem [[03 - Visual Hierarchy & Layout]].
- Mục tiêu: sau bài này, khi nghe một khái niệm UX bạn biết **nó tên gì (tiếng Anh) để search lại**, và giải thích được bằng lời cho đồng đội.

---

## 🎯 User-Centered Design (UCD) — Thiết kế lấy người dùng làm trung tâm

**Giải thích ngắn:** UCD là triết lý thiết kế mà mọi quyết định đều xuất phát từ **nhu cầu, hành vi và bối cảnh thực tế của người dùng**, chứ không phải từ ý thích của người làm ra sản phẩm hay của sếp. Vòng lặp cốt lõi: hiểu người dùng → thiết kế → cho họ dùng thử → học từ phản hồi → sửa → lặp lại.

**Ví dụ SaaS:** Team làm dashboard analytics. Thay vì tự quyết "cho 20 biểu đồ lên trang chủ cho hoành tráng", họ phỏng vấn 5 khách hàng và phát hiện người dùng chỉ mở dashboard để trả lời đúng 1 câu: "Hôm nay doanh thu tăng hay giảm?". Kết quả: trang chủ chỉ để 1 con số lớn + xu hướng, phần còn lại ẩn vào tab. Đó là UCD.

![[uxui-01-ucd-loop.svg]]
*Cùng một dashboard: bên trái là "20 biểu đồ cho hoành tráng" (tự quyết), bên phải là kết quả sau khi phỏng vấn user — 1 con số lớn + xu hướng, phần còn lại ẩn vào tab; dưới cùng là vòng lặp UCD.*

**Sai lầm hay gặp:** Nhầm "ý kiến của mình" thành "nhu cầu của user" (kiểu "tôi thấy thế này tiện mà"). Dev đặc biệt dễ dính vì bản thân đã quá quen sản phẩm — cái hiển nhiên với bạn thường là rối rắm với người mới.

---

## 🔀 UX vs UI vs IxD vs Usability — Phân biệt các khái niệm hay bị lẫn

Bốn từ này bị dùng thay thế nhau loạn xạ, nhưng chúng ở **các tầng khác nhau**.

### 🧩 UX — User Experience (Trải nghiệm người dùng)
Là **toàn bộ cảm nhận** của người dùng khi tiếp xúc với sản phẩm/dịch vụ: từ lúc nghe quảng cáo, đăng ký, dùng, cho tới lúc liên hệ support. Rộng nhất trong bốn khái niệm. UX tốt = người dùng đạt được việc họ cần một cách dễ chịu.

### 🎨 UI — User Interface (Giao diện người dùng)
Là **lớp bề mặt nhìn thấy và chạm được**: màu, font, nút bấm, khoảng cách, icon, layout. UI là *một phần* của UX, không phải toàn bộ. Một app có UI đẹp long lanh vẫn có thể có UX tệ (đẹp nhưng không tìm được nút cần bấm).

### 🕹️ IxD — Interaction Design (Thiết kế tương tác)
Tập trung vào **hành vi khi tương tác**: bấm nút này thì chuyện gì xảy ra, kéo-thả ra sao, chuyển động (animation) phản hồi thế nào, trạng thái loading/error hiển thị ra sao. Nói cách khác: "cuộc đối thoại" giữa người và máy.

### ✔️ Usability (Tính khả dụng / dễ dùng)
Là **thước đo** một sản phẩm dễ dùng đến đâu: học nhanh không, thao tác có nhanh không, có hay gây lỗi không, nhớ được cách dùng sau vài ngày không. Usability là một *thuộc tính đo được* của UX.

**Ví dụ SaaS để phân biệt:** Trang Settings của một app quản lý team.
- **UI:** màu nút, cỡ chữ tiêu đề, khoảng cách giữa các dòng.
- **IxD:** khi bật toggle "2FA" thì hiện ngay ô nhập mã, không reload trang.
- **Usability:** người dùng lần đầu có tự bật được 2FA trong 30 giây mà không cần đọc hướng dẫn không?
- **UX:** cả hành trình bảo mật tài khoản có khiến họ thấy an tâm và không bực mình không?

![[uxui-01-ux-ui-ixd-usability.svg]]
*UX bọc ngoài cùng, trong đó có IxD rồi tới UI (lớp bề mặt), còn Usability là thước đo bên cạnh — minh hoạ bằng đúng ví dụ trang Settings bật 2FA.*

**Sai lầm hay gặp:** Nói "làm UX/UI" nhưng thực chất chỉ chăm chăm chỉnh màu và bo góc (chỉ đụng UI). Hoặc nghĩ "UX = UI đẹp". Nhớ: **đẹp ≠ dễ dùng ≠ đúng nhu cầu.**

---

## 🚪 Don Norman's Design Principles — Các nguyên tắc thiết kế của Don Norman

Don Norman là người **đặt ra (coined) thuật ngữ "User Experience"** — khi ông làm việc ở Apple đầu thập niên 1990 (1993), vì thấy "human interface" và "usability" quá hẹp — và viết cuốn kinh điển *The Design of Everyday Things*. Ông đưa ra vài nguyên tắc gốc giải thích **vì sao một vật/giao diện dễ hoặc khó dùng**. Đây là "bảng chữ cái" của UX.

### 🤝 Affordance (Khả năng gợi ý hành động)
Là **đặc tính của một vật cho biết có thể làm gì với nó**. Cửa có tay nắm → gợi ý "kéo"; mặt phẳng phẳng → gợi ý "đẩy". Trong giao diện: một ô có viền và nền trắng gợi ý "gõ chữ vào đây được".

*Ví dụ SaaS:* Ô tìm kiếm trông giống một khung nhập liệu (có viền, có icon kính lúp) → người dùng biết ngay là gõ được.

*Sai lầm:* Làm nút trông giống chữ tĩnh (không có nền, không đổi màu khi rê chuột) → người dùng không biết bấm được. Ngược lại, làm chữ thường trông giống nút → user bấm hoài không ăn.

### 🏷️ Signifier (Dấu hiệu chỉ dẫn)
Là **tín hiệu rõ ràng cho biết affordance nằm ở đâu và dùng thế nào**. Affordance là "có thể làm được", còn signifier là "cái mách cho bạn biết điều đó". Ví dụ: dòng chữ "Kéo file vào đây", gạch chân của một link, mũi tên chỉ hướng.

*Ví dụ SaaS:* Vùng upload có đường viền nét đứt + chữ "Kéo & thả file vào đây hoặc bấm để chọn". Cái viền nét đứt và dòng chữ chính là signifier.

*Sai lầm:* Thiết kế "sạch sẽ tối giản" quá đà, giấu hết dấu hiệu → giao diện đẹp nhưng người dùng không biết bấm vào đâu (gọi là "mystery meat navigation").

### 🔔 Feedback (Phản hồi)
Là **hệ thống cho người dùng biết hành động của họ đã được ghi nhận và kết quả ra sao**. Phản hồi phải nhanh và rõ. Bấm mà không thấy gì phản hồi → người dùng bấm lại nhiều lần hoặc tưởng hỏng.

*Ví dụ SaaS:* Bấm "Save" → nút chuyển sang trạng thái loading, rồi hiện toast "Đã lưu thành công". Nếu lỗi → hiện thông báo lỗi cụ thể ngay cạnh chỗ sai.

*Sai lầm:* Thao tác quan trọng (xóa, thanh toán) mà im ru không phản hồi; hoặc phản hồi mơ hồ kiểu "Có lỗi xảy ra" mà không nói lỗi gì.

### 🗺️ Mapping (Sự ánh xạ)
Là **mức độ khớp giữa nút điều khiển và kết quả của nó trong thực tế**. Ánh xạ tốt = bố trí điều khiển giống với bố trí thực tế, trực giác đoán được. Ví dụ kinh điển: các nút chỉnh ghế trên xe hạng sang có hình dạng giống cái ghế.

*Ví dụ SaaS:* Trong công cụ layout, thanh trượt "kéo sang phải = to hơn" (khớp trực giác). Hoặc nút sắp xếp: mũi tên lên = tăng dần.

*Sai lầm:* Đặt nút "tăng" ở dưới, nút "giảm" ở trên; hoặc thứ tự tab lộn xộn không theo logic nào.

### 🚧 Constraint (Ràng buộc)
Là **giới hạn có chủ đích để ngăn người dùng làm sai**. Thay vì để họ tự do làm bậy rồi báo lỗi, ta chặn từ đầu.

*Ví dụ SaaS:* Nút "Gửi" bị mờ (disabled) cho tới khi form điền đủ trường bắt buộc. Ô nhập ngày chỉ cho chọn từ lịch nên không thể gõ sai định dạng. Chỉ cho upload đúng loại file.

*Sai lầm:* Lạm dụng ràng buộc đến mức trói tay người dùng (disable nút mà không nói vì sao) → họ bối rối không biết phải làm gì để "mở khóa".

![[uxui-01-norman-principles.svg]]
*Năm nguyên tắc của Don Norman đặt cạnh nhau theo cặp "sai lầm hay gặp" và "làm đúng", dùng lại đúng các ví dụ SaaS trong bài (nút Save, vùng upload nét đứt, toast phản hồi, thanh trượt, nút disabled).*

> 💡 Liên quan chặt tới tâm lý học nhận thức — xem thêm [[02 - Laws of UX - Nguyên tắc tâm lý học]].

---

## 🧠 Mental Model — Mô hình tư duy (của người dùng)

**Giải thích ngắn:** Mental model là **hình dung sẵn có trong đầu người dùng về "cái này hoạt động thế nào"**, dựa trên kinh nghiệm với các sản phẩm khác. Ví dụ: ai cũng "biết" icon giỏ hàng = giỏ hàng, icon bánh răng = cài đặt, biểu tượng đĩa mềm = lưu (dù nhiều người trẻ chưa từng thấy đĩa mềm thật). Thiết kế tốt là thiết kế **khớp với mental model có sẵn**, để người dùng không phải học lại từ đầu.

Có một cặp khái niệm đi kèm cần biết:
- **Mental model:** người dùng *nghĩ* hệ thống hoạt động thế nào.
- **Conceptual model (mô hình khái niệm):** cách hệ thống *thực sự* được thiết kế/vận hành.
Khoảng cách giữa hai cái này càng lớn thì người dùng càng nhầm lẫn.

**Ví dụ SaaS:** Trong app quản lý file, người dùng có mental model "kéo file vào thư mục = di chuyển vào đó". Nếu app của bạn lại xử lý kéo-thả thành "copy" mà không nói gì, họ sẽ ngạc nhiên và làm sai. Giải pháp khớp mental model: kéo là move, giữ Ctrl mới copy (giống hệ điều hành họ đã quen).

![[uxui-01-mental-model.svg]]
*Khoảng cách giữa cái user nghĩ ("kéo file = di chuyển") và cái app thực sự làm ("kéo file = copy") chính là nguồn gây nhầm lẫn; khớp lại với thói quen của hệ điều hành là cách đóng khoảng cách đó.*

**Sai lầm hay gặp:** Dev sáng tạo ra một cách vận hành "hợp lý về mặt kỹ thuật" nhưng lạ với người dùng (ví dụ đặt tên menu theo tên module trong code chứ không theo cách user gọi). Luôn ưu tiên ngôn ngữ và logic của **người dùng**, không phải của hệ thống.

---

## 🪧 Don't Make Me Think — "Đừng bắt tôi phải suy nghĩ" (Steve Krug)

**Giải thích ngắn:** Đây là tên cuốn sách kinh điển về web usability của **Steve Krug**, và cũng là nguyên tắc cốt lõi: **giao diện nên hiển nhiên đến mức người dùng không phải dừng lại suy nghĩ** "cái này là gì, bấm được không, mình đang ở đâu". Mỗi lần người dùng phải "ngẫm" là một chút năng lượng và thiện cảm bị hao đi (khái niệm cognitive load — tải nhận thức).

Một ý phụ nổi tiếng của Krug: **"We don't read pages. We scan them."** — người dùng không đọc kỹ từng chữ, họ **liếc (scan)** để tìm cái cần. Nên thiết kế phải dễ liếc: tiêu đề rõ, phân cấp rõ, nút hành động nổi bật.

**Ví dụ SaaS:** Trên trang pricing, thay vì đoạn văn dài giải thích gói, dùng bảng so sánh với tiêu đề gói rõ ràng và nút "Chọn gói này" nổi bật ở mỗi cột. Người dùng liếc 3 giây là hiểu.

![[uxui-01-dont-make-me-think.svg]]
*Cùng một trang pricing: đoạn văn dài bắt user dừng lại đọc, còn bảng so sánh với tiêu đề gói rõ và nút "Chọn gói này" nổi bật thì liếc 3 giây là hiểu.*

**Sai lầm hay gặp:** Đặt tên menu "kêu" nhưng mơ hồ ("Khám phá", "Trải nghiệm") thay vì rõ nghĩa ("Bảng giá", "Tài liệu"). Hoặc nhồi quá nhiều lựa chọn ngang hàng khiến user tê liệt vì không biết chọn gì (liên quan Hick's Law — xem [[02 - Laws of UX - Nguyên tắc tâm lý học]]).

---

## 🍯 UX Honeycomb — Tổ ong UX (Peter Morville)

**Giải thích ngắn:** Peter Morville đề xuất mô hình **7 mặt của trải nghiệm tốt**, hình dung như tổ ong. Nó nhắc ta rằng "dùng được" thôi chưa đủ — còn nhiều khía cạnh khác. Bảy yếu tố:

1. **Useful (Hữu ích):** có giải quyết được vấn đề thật không?
2. **Usable (Dễ dùng):** thao tác có dễ không?
3. **Desirable (Đáng khao khát):** hình ảnh, thương hiệu, cảm xúc có tạo thiện cảm không?
4. **Findable (Dễ tìm thấy):** nội dung/chức năng có dễ tìm và điều hướng không?
5. **Accessible (Tiếp cận được):** người khuyết tật có dùng được không (a11y)?
6. **Credible (Đáng tin):** người dùng có tin tưởng sản phẩm/thông tin không?
7. **Valuable (Có giá trị):** rốt cuộc có tạo giá trị cho cả người dùng lẫn doanh nghiệp không?

**Ví dụ SaaS:** Một công cụ ký hợp đồng điện tử.
- *Useful:* ký nhanh hơn in giấy.
- *Usable:* kéo chữ ký vào đúng ô là xong.
- *Credible:* hiện chứng chỉ bảo mật, logo đối tác lớn, badge tuân thủ pháp lý → tạo niềm tin.
- *Accessible:* dùng được bằng bàn phím và trình đọc màn hình.
Thiếu **Credible**, dù dễ dùng đến mấy, khách vẫn ngại ký giấy tờ quan trọng.

![[uxui-01-ux-honeycomb.png]]
*Bảy mặt của trải nghiệm tốt xếp thành tổ ong, với Valuable nằm ở giữa — nhìn là nhớ được đủ 7 yếu tố, không chỉ mỗi Usable — (nguồn: Wikimedia Commons)*

**Sai lầm hay gặp:** Chỉ chăm chăm **Usable** mà quên **Credible** và **Desirable** — thường gặp ở sản phẩm dev tự làm: chạy tốt, dễ bấm, nhưng trông "cây nhà lá vườn" nên khách không tin để trả tiền.

---

## 💎 Double Diamond — Quy trình Kim cương đôi (Discover → Define → Develop → Deliver)

**Giải thích ngắn:** Double Diamond là mô hình quy trình thiết kế do **Design Council (Anh)** phổ biến, mô tả cách đi từ "một vấn đề mơ hồ" đến "một giải pháp được giao". Gồm **hai viên kim cương**, mỗi viên có một pha *mở rộng* (khám phá nhiều khả năng) rồi một pha *thu hẹp* (chốt lại).

**Kim cương 1 — Tìm đúng vấn đề (Designing the right thing):**
- **Discover (Khám phá):** mở rộng — nghiên cứu, phỏng vấn, quan sát để hiểu vấn đề thật. Chưa vội giải.
- **Define (Định nghĩa):** thu hẹp — chốt lại "vấn đề cốt lõi cần giải là gì" (thường viết thành một problem statement).

**Kim cương 2 — Tạo đúng giải pháp (Designing things right):**
- **Develop (Phát triển):** mở rộng — brainstorm nhiều ý tưởng, làm prototype, thử nhiều hướng.
- **Deliver (Bàn giao):** thu hẹp — chọn giải pháp tốt nhất, hoàn thiện, ship ra thị trường.

Ý tưởng lớn: **đừng nhảy thẳng vào code giải pháp đầu tiên nghĩ ra**. Phải "mở rồi mới đóng", và đặc biệt phải chắc mình đang giải *đúng vấn đề* trước khi lo *giải cho đúng*.

**Ví dụ SaaS:** Nhận phàn nàn "user không dùng tính năng report".
- *Discover:* phỏng vấn, xem session recording → phát hiện người dùng không biết tính năng tồn tại (chứ không phải nó khó dùng).
- *Define:* chốt vấn đề = "khả năng khám phá tính năng (discoverability) kém", không phải "report khó dùng".
- *Develop:* thử vài cách — thêm tooltip onboarding, đưa report lên menu chính, gửi email giới thiệu.
- *Deliver:* chọn phương án hiệu quả nhất qua A/B test rồi tung chính thức.
Nếu bỏ qua kim cương 1, có thể bạn đã tốn hàng tuần "làm report dễ dùng hơn" — sai vấn đề ngay từ đầu.

![[uxui-01-double-diamond.png]]
*Hai viên kim cương: viên 1 đi từ "Problem" qua Discover → Define để chốt đúng vấn đề, viên 2 đi qua Develop → Deliver để ra "Solution"; mỗi viên đều mở rộng rồi mới thu hẹp — (nguồn: Wikimedia Commons)*

**Sai lầm hay gặp:** Bỏ pha Discover/Define vì "thấy rõ rồi" → xây rất nhanh một thứ không ai cần. Đây là bẫy kinh điển của team thiên về kỹ thuật. Chi tiết cách áp dụng quy trình và công cụ xem [[10 - Design Process & Tools]].

---

## ✅ Tóm lại / Checklist

- [ ] Tôi phân biệt được **UX / UI / IxD / Usability** và không gọi "chỉnh màu" là "làm UX".
- [ ] Trước khi thiết kế, tôi hỏi **"user thật sự cần gì"** (UCD) chứ không thiết kế theo ý mình.
- [ ] Mỗi thành phần tương tác của tôi có đủ **Affordance + Signifier** (nhìn là biết bấm/gõ được) và **Feedback** (bấm là có phản hồi).
- [ ] Bố cục điều khiển của tôi **Mapping** trực giác, và tôi dùng **Constraint** để chặn lỗi thay vì để user làm sai rồi mới báo.
- [ ] Thiết kế của tôi khớp **Mental Model** có sẵn của người dùng (icon, thuật ngữ, luồng thao tác quen thuộc).
- [ ] Giao diện đủ hiển nhiên để **không bắt user phải suy nghĩ**; nội dung dễ *liếc* (scan) chứ không bắt đọc kỹ.
- [ ] Tôi cân nhắc đủ 7 mặt của **UX Honeycomb**, nhất là **Credible** và **Accessible** (đừng chỉ lo Usable).
- [ ] Với vấn đề lớn, tôi đi theo **Double Diamond**: chắc chắn giải *đúng vấn đề* trước khi lo *giải cho đúng*.

---

## 🔗 Nguồn tham khảo

- Don Norman & Jakob Nielsen — *The Definition of User Experience (UX)*, Nielsen Norman Group: https://www.nngroup.com/articles/definition-user-experience/
- Don Norman — *The Design of Everyday Things* (khái niệm Affordance, Signifier, Feedback, Mapping, Constraint): https://www.nngroup.com/books/design-everyday-things-revised/
- Interaction Design Foundation — *User-Centered Design (UCD)*: https://www.interaction-design.org/literature/topics/user-centered-design
- Steve Krug — *Don't Make Me Think*: https://sensible.com/dont-make-me-think/
- Peter Morville — *User Experience Design (UX Honeycomb)*, Semantic Studios: https://semanticstudios.com/user_experience_design/
- Design Council — *The Double Diamond*: https://www.designcouncil.org.uk/our-resources/the-double-diamond/
- Nielsen Norman Group — *Mental Models*: https://www.nngroup.com/articles/mental-models/
