---
tags:
  - ux
  - process
  - tools
  - research
type: note
created: 2026-08-23
---

# 10 - Design Process & Tools

## 📌 Ý chính của bài

Note này là "bản đồ quy trình" đi từ lúc chưa hiểu người dùng → đến lúc bàn giao thiết kế cho dev code. Mỗi bước là một **artifact** (sản phẩm trung gian) hoặc một **hoạt động** có tên riêng trong ngành UX. Bạn không cần làm đủ hết — mục tiêu là hiểu mỗi thứ *để làm gì*, rồi chọn bản tối giản phù hợp với dev solo/team nhỏ làm SaaS.

Mạch logic tự nhiên của quy trình:

> **Nghiên cứu** (hiểu người dùng) → **Tổng hợp** (Persona, Journey Map) → **Cấu trúc** (IA, User Flow) → **Dựng hình** (Wireframe → Prototype) → **Kiểm chứng** (Usability Testing, A/B Testing) → **Bàn giao** (Handoff) → **Cải thiện liên tục** (Critique).

Một điều quan trọng cần thấm ngay: đây **không phải quy trình thẳng một chiều**. Nó lặp (iterative). Bạn thường xuyên quay lại bước trước khi phát hiện điều mới. Xem thêm tư duy nền ở [[01 - Nền tảng tư duy UX]] và cách áp dụng riêng cho SaaS ở [[09 - UX cho SaaS]].

---

## 🔬 UX Research (Nghiên cứu người dùng)

**Là gì:** Hoạt động thu thập thông tin thật về người dùng — họ là ai, họ đang cố làm gì, họ vướng ở đâu. Mục tiêu là ra quyết định thiết kế dựa trên *bằng chứng* thay vì cảm tính hoặc "sếp thích màu xanh".

Có hai kiểu chia thường gặp:
- **Qualitative (định tính)** — trả lời câu hỏi *"tại sao"*. Ví dụ: phỏng vấn để hiểu vì sao user bỏ giữa chừng lúc đăng ký.
- **Quantitative (định lượng)** — trả lời câu hỏi *"bao nhiêu"*. Ví dụ: khảo sát 500 người xem bao nhiêu % thấy tính năng X hữu ích.

Hai công cụ nghiên cứu phổ biến nhất với team nhỏ:

### 🗣️ User Interview (Phỏng vấn người dùng)

**Là gì:** Nói chuyện 1-1 với người dùng thật (30–45 phút), hỏi mở để hiểu suy nghĩ và hành vi của họ.

**Khi nào dùng:** Giai đoạn đầu khi bạn còn *chưa hiểu vấn đề*, hoặc khi số liệu cho thấy có chỗ lạ (ví dụ nhiều người bỏ ở bước 2) mà bạn không rõ nguyên nhân.

**Sai lầm hay gặp:**
- Hỏi câu **dẫn dắt** (leading question) như "Bạn thấy tính năng này tiện đúng không?" → user gật cho xong. Nên hỏi về hành vi quá khứ cụ thể: "Lần gần nhất bạn làm việc X, bạn làm thế nào?".
- Hỏi user *muốn tính năng gì* rồi coi đó là chân lý. User giỏi mô tả **vấn đề của họ**, nhưng thường dở trong việc **tự thiết kế giải pháp**.

**Dev solo/team nhỏ áp dụng tối giản:** Chỉ cần phỏng vấn 5 khách hàng hiện tại qua Google Meet, ghi âm (xin phép), rút ra 3–5 pain point. Không cần thuê researcher.

### 📋 Survey (Khảo sát)

**Là gì:** Bảng câu hỏi gửi cho nhiều người cùng lúc, thu về dữ liệu định lượng (con số, %).

**Khi nào dùng:** Khi bạn *đã có giả thuyết* và muốn kiểm tra nó trên diện rộng. Ví dụ: sau khi phỏng vấn thấy vài người phàn nàn về tốc độ, gửi survey xem đó là vấn đề của số đông hay chỉ vài người.

**Sai lầm hay gặp:** Dùng survey để *khám phá* thay vì để *đo lường*. Survey không cho bạn hiểu chiều sâu "tại sao" — nó chỉ đếm. Đừng thay phỏng vấn bằng survey ở giai đoạn đầu.

**Dev solo/team nhỏ áp dụng tối giản:** Nhúng 1 câu hỏi ngắn trong app (in-app survey) hoặc gửi email 3 câu. Tránh bảng 20 câu — tỉ lệ trả lời sẽ rất thấp.

---

## 👤 Personas (Chân dung người dùng)

**Là gì:** Một nhân vật *hư cấu nhưng dựa trên dữ liệu thật*, đại diện cho một nhóm người dùng điển hình. Persona gói gọn: mục tiêu, bối cảnh công việc, và nỗi đau chính. Ví dụ: "Minh — trưởng nhóm marketing ở startup 10 người, cần xuất báo cáo nhanh cuối tuần, ghét phần mềm nhiều bước".

**Khi nào dùng:** Khi team cần một "ngôn ngữ chung" để nhắc nhau đang thiết kế *cho ai*. Thay vì cãi nhau chung chung, cả team hỏi "cái này có giúp Minh không?".

**Sai lầm hay gặp:**
- Tạo persona **bịa hoàn toàn** từ trí tưởng tượng (ảnh đẹp, tên hay, nhưng không dựa trên research nào). Persona bịa còn nguy hiểm hơn không có, vì tạo cảm giác an tâm giả.
- Nhồi quá nhiều chi tiết vô nghĩa (thú cưng, sở thích cà phê) mà không liên quan gì đến sản phẩm.

**Dev solo/team nhỏ áp dụng tối giản:** 1–2 persona ngắn gọn nửa trang là đủ. Với SaaS B2B, hãy nghĩ theo **role/vai trò** (admin, member, viewer) thay vì nhân khẩu học (tuổi, giới tính) — vì hành vi trong SaaS phụ thuộc vào công việc họ làm, không phải họ bao nhiêu tuổi.

---

## 🗺️ User Journey Map (Bản đồ hành trình người dùng)

**Là gì:** Một sơ đồ mô tả từng bước (stage) mà người dùng đi qua để đạt một mục tiêu, kèm theo *hành động*, *suy nghĩ*, và *cảm xúc* ở mỗi bước. Điểm quý nhất là nó bộc lộ các **pain point** (điểm đau) và **moment of truth** (khoảnh khắc quyết định) mà bạn dễ bỏ sót khi chỉ nhìn từng màn hình rời rạc.

**Khi nào dùng:** Khi trải nghiệm trải dài nhiều bước/nhiều kênh và bạn muốn nhìn bức tranh tổng thể. Ví dụ hành trình: nghe về sản phẩm → đăng ký → onboarding → dùng lần đầu → nâng cấp trả phí.

**Sai lầm hay gặp:** Vẽ journey map cho một quy trình *bạn tưởng tượng* thay vì quy trình *thực tế người dùng trải qua*. Map phải dựa trên research, nếu không nó chỉ là sơ đồ đẹp treo tường.

**Dev solo/team nhỏ áp dụng tối giản:** Tập trung vào hành trình **onboarding** (từ lúc đăng ký đến "aha moment" — khoảnh khắc user nhận ra giá trị sản phẩm). Đây là đoạn quyết định giữ chân hay mất khách trong SaaS. Vẽ bằng bảng đơn giản: hàng = bước, cột = hành động / cảm xúc / cơ hội cải thiện.

---

## 🧭 Information Architecture / IA (Kiến trúc thông tin)

**Là gì:** Cách **tổ chức, sắp xếp và đặt tên** cho nội dung/chức năng sao cho người dùng tìm được thứ họ cần và hiểu mình đang ở đâu. Nói nôm na: IA là "sơ đồ tủ hồ sơ" — quyết định cái gì nằm trong ngăn nào, ngăn tên gì, menu có mấy tầng.

**Khi nào dùng:** Trước khi vẽ giao diện. Nếu cấu trúc sai (menu lộn xộn, đặt tên khó hiểu), thì màn hình đẹp đến mấy user vẫn lạc.

**Sai lầm hay gặp:**
- Đặt tên menu theo **cấu trúc nội bộ công ty** (theo phòng ban, theo tên module code) thay vì theo cách người dùng nghĩ.
- Menu quá sâu (phải click 5 tầng mới tới nơi).

**Kỹ thuật kiểm chứng IA đáng biết:** **Card Sorting** (cho user tự nhóm các thẻ nội dung để hiểu họ kỳ vọng nhóm thế nào) và **Tree Testing** (cho user tìm mục trong cây menu chỉ bằng chữ, không có giao diện, để kiểm tra cấu trúc có dễ tìm không).

**Dev solo/team nhỏ áp dụng tối giản:** Vẽ sitemap SaaS của bạn (Dashboard, Settings, Billing, Team…) trên một tờ giấy, đảm bảo mọi thứ user cần đều trong 1–2 click từ dashboard.

---

## 🔀 User Flow (Luồng thao tác)

**Là gì:** Sơ đồ từng bước *hành động* mà user thực hiện để hoàn thành **một nhiệm vụ cụ thể**, kèm các nhánh rẽ (điều kiện, lỗi). Khác với Journey Map (nói về cảm xúc, tầm nhìn rộng), User Flow tập trung vào **thao tác cụ thể trên màn hình**: bấm nút này → hiện màn kia → điền form → thành công/thất bại.

**Khi nào dùng:** Khi thiết kế một tính năng có nhiều bước hoặc nhiều trường hợp rẽ nhánh. Ví dụ: flow "quên mật khẩu" phải xử lý cả trường hợp email không tồn tại, link hết hạn…

**Sai lầm hay gặp:** Chỉ vẽ **happy path** (đường đi lý tưởng khi mọi thứ suôn sẻ) mà quên **edge case** (lỗi mạng, dữ liệu trống, hết quyền). Dev thường thấy điều này rõ hơn designer — đây là chỗ dev đóng góp cực mạnh.

**Dev solo/team nhỏ áp dụng tối giản:** Vì bạn đã tư duy bằng logic code, hãy tận dụng: vẽ flow như vẽ flowchart, liệt kê đủ các trạng thái (loading, empty, error, success). Điều này giúp bạn không phải sửa UI đi sửa lại sau.

---

## 📐 Wireframe (Khung sườn - low-fidelity)

**Là gì:** Bản phác *bố cục* màn hình ở mức đơn giản — hộp, đường, chữ giả — **không** màu sắc, **không** hình ảnh thật, **không** font đẹp. "Low-fidelity" nghĩa là *độ chi tiết thấp*, cố tình xấu để mọi người tập trung vào **cấu trúc và luồng**, không sa đà bàn màu nút.

**Khi nào dùng:** Ngay sau khi có User Flow, để nhanh chóng thử vài phương án bố cục với chi phí gần như bằng 0.

**Sai lầm hay gặp:** Đánh bóng wireframe quá sớm (thêm màu, thêm chi tiết) → biến nó thành mockup, làm mất đi ưu điểm "nhanh và dễ vứt bỏ". Wireframe *nên* trông thô.

**Dev solo/team nhỏ áp dụng tối giản:** Nhiều dev thích nhảy thẳng vào code luôn. Nhưng vẽ wireframe 10 phút trên giấy/Figma trước khi code sẽ tiết kiệm hàng giờ refactor. Vẽ tay cũng hoàn toàn ổn.

---

## 🎨 Prototype (Bản mẫu - high-fidelity)

**Là gì:** Bản mô phỏng gần giống sản phẩm thật — có màu, font, nội dung thật, và **bấm được** (interactive): click nút thì chuyển màn, mở popup… nhưng phía sau **không có logic/backend thật**, chỉ là các màn hình nối với nhau. "High-fidelity" = *độ chi tiết cao*, trông như thật.

**Khi nào dùng:** Khi cần trình bày cho khách/nhà đầu tư, hoặc để đem đi **Usability Testing** — cho user bấm thử trước khi tốn công code.

**Sai lầm hay gặp:**
- Đầu tư prototype quá công phu đến mức *tiếc công* và ngại thay đổi khi nhận feedback xấu (sunk cost).
- Nhầm prototype (mô phỏng) với sản phẩm thật (có code chạy). Prototype chỉ giả vờ hoạt động.

**Dev solo/team nhỏ áp dụng tối giản:** Cân nhắc — đôi khi với dev giỏi, dựng một prototype code thật (dùng component có sẵn) còn nhanh hơn kéo thả trong Figma. Chọn cách nào *nhanh nhất để lấy feedback*, đừng máy móc.

---

## 🧪 Usability Testing (Kiểm thử khả dụng)

**Là gì:** Cho người dùng thật *thực hiện nhiệm vụ* trên sản phẩm/prototype trong khi bạn **quan sát im lặng** xem họ vướng ở đâu. Đây là cách rẻ và mạnh nhất để phát hiện lỗi trải nghiệm mà bạn — người quá quen sản phẩm — không còn nhìn ra.

Kỹ thuật cốt lõi: **think-aloud** (nghĩ ra tiếng) — yêu cầu user nói to suy nghĩ khi thao tác, để bạn hiểu *tại sao* họ bối rối.

**Khi nào dùng:** Bất cứ khi nào có prototype hoặc sản phẩm bấm được. Làm sớm, làm thường xuyên, mỗi lần vài người.

### 🖐️ Quy tắc "5 users" của Nielsen

Jakob Nielsen (NN/g) nêu: **kiểm thử với 5 người dùng thường tìm ra khoảng 85% vấn đề khả dụng** trong một lần lặp. Lý do: các vấn đề nghiêm trọng bị nhiều người vấp phải, nên chỉ vài người là đủ lộ ra; thêm người thứ 6, 7 chủ yếu thấy lại lỗi cũ, hiệu quả giảm dần.

**Sắc thái quan trọng (đừng hiểu máy móc):**
- Con số 85% và "5 người" là *ước lượng thống kê* (dựa trên mô hình toán của Nielsen & Landauer, 1993), không phải luật cứng. Sản phẩm phức tạp hoặc có **nhiều nhóm người dùng khác nhau** (ví dụ admin và end-user hành vi rất khác) thì cần test cho *từng nhóm*: NN/g gợi ý khoảng **3–4 người mỗi nhóm** khi có 2 nhóm, và **~3 người mỗi nhóm** khi từ 3 nhóm trở lên (do các nhóm vẫn có phần trùng lặp về vấn đề).
- Tinh thần cốt lõi không phải "chỉ cần 5 người rồi thôi", mà là: **thà test nhiều đợt nhỏ (5 người) rồi sửa liên tục, còn hơn một đợt lớn tốn kém rồi mới sửa một lần**. Test → sửa → test lại.

**Sai lầm hay gặp:**
- Người quan sát *gợi ý/giải cứu* khi thấy user loay hoay ("Bạn bấm nút góc trên kia kìa"). Làm vậy là phá kết quả — phải để họ tự vật lộn.
- Test với đồng nghiệp/bạn bè (họ đã quen sản phẩm hoặc nể bạn) thay vì người dùng đại diện thật.

**Dev solo/team nhỏ áp dụng tối giản:** Mời 5 người gần giống khách hàng mục tiêu, giao 2–3 nhiệm vụ, ngồi im quan sát 20 phút mỗi người. Ghi lại chỗ họ khựng. Bạn sẽ sốc vì thấy được bao nhiêu vấn đề.

---

## 📊 Nielsen's 10 Usability Heuristics (10 nguyên tắc khả dụng của Nielsen)

**Là gì:** Bộ 10 nguyên tắc kinh nghiệm do Jakob Nielsen đúc kết (bản cập nhật 1994, còn dùng đến nay), dùng làm "checklist thô" để **tự soi** giao diện — gọi là **Heuristic Evaluation** (đánh giá theo kinh nghiệm). Không thay thế được test với user thật, nhưng rẻ và bắt được lỗi rõ ràng trước khi mang đi test.

Đủ 10 nguyên tắc (giữ nguyên tên gốc + diễn giải):

1. **Visibility of system status** (Hiển thị trạng thái hệ thống) — luôn cho user biết đang có chuyện gì: loading spinner, "đã lưu", thanh tiến trình.
2. **Match between system and the real world** (Tương đồng giữa hệ thống và thế giới thực) — dùng từ ngữ, khái niệm quen thuộc với user, không dùng thuật ngữ kỹ thuật nội bộ.
3. **User control and freedom** (Người dùng kiểm soát và tự do) — luôn có "lối thoát": nút Undo, Cancel, quay lại, thoát khỏi chỗ họ lỡ bấm nhầm.
4. **Consistency and standards** (Nhất quán và theo chuẩn) — cùng một thứ trông và hoạt động giống nhau khắp app; tuân theo quy ước chung của ngành.
5. **Error prevention** (Ngăn lỗi từ đầu) — thiết kế để lỗi khó xảy ra (ví dụ hỏi xác nhận trước hành động nguy hiểm) tốt hơn là báo lỗi sau.
6. **Recognition rather than recall** (Nhận ra thay vì phải nhớ) — hiện sẵn lựa chọn để user *nhận ra*, đừng bắt họ *nhớ* thông tin từ màn trước.
7. **Flexibility and efficiency of use** (Linh hoạt và hiệu quả) — có lối tắt (keyboard shortcut, thao tác nhanh) cho power user, mà vẫn dễ cho người mới.
8. **Aesthetic and minimalist design** (Thiết kế tối giản, thẩm mỹ) — chỉ hiển thị thông tin cần thiết; mỗi thứ thừa làm loãng thứ quan trọng.
9. **Help users recognize, diagnose, and recover from errors** (Giúp nhận biết, chẩn đoán và khắc phục lỗi) — thông báo lỗi bằng ngôn ngữ rõ ràng, nói *đã sai gì* và *cách sửa*, tránh mã lỗi khó hiểu.
10. **Help and documentation** (Trợ giúp và tài liệu) — khi cần, có tài liệu/hướng dẫn dễ tìm, tập trung vào nhiệm vụ của user.

**Sai lầm hay gặp:** Coi 10 heuristic là "luật" tuyệt đối phải tuân 100%. Chúng là *nguyên tắc hướng dẫn* — đôi khi mâu thuẫn nhau (ví dụ tối giản vs. hiển thị đủ trạng thái) và cần cân nhắc theo bối cảnh.

**Dev solo/team nhỏ áp dụng tối giản:** Dùng đúng 10 dòng trên làm checklist, tự rà lướt màn hình chính trước mỗi lần release. 30 phút bắt được nhiều lỗi ngớ ngẩn.

---

## 🆎 A/B Testing (Kiểm thử A/B)

**Là gì:** Cho *một nửa* người dùng thấy phiên bản A, *nửa kia* thấy phiên bản B (chỉ khác nhau một điểm), rồi so **số liệu thật** (tỉ lệ click, đăng ký, mua…) xem bản nào thắng. Đây là kiểm chứng bằng dữ liệu định lượng trên người dùng thật, ở quy mô lớn.

**Khi nào dùng:** Khi bạn *đã có lượng traffic đủ lớn* và muốn tối ưu một thay đổi cụ thể có thể đo được (màu nút, tiêu đề, vị trí CTA).

**Sai lầm hay gặp:**
- **Kết luận quá sớm** khi số mẫu còn nhỏ (chưa đạt statistical significance — ý nghĩa thống kê), dẫn tới tin vào kết quả may rủi.
- Test A/B khi *chưa hiểu vấn đề*. A/B giỏi tối ưu ("cái nào tốt hơn"), nhưng dở khám phá ("tại sao user bỏ đi") — cái đó cần Usability Testing/phỏng vấn.

**Dev solo/team nhỏ áp dụng tối giản:** SaaS mới ít traffic thì A/B testing thường *chưa hợp* (không đủ mẫu để có kết luận đáng tin). Ở giai đoạn đầu, ưu tiên phỏng vấn + usability test 5 người. Để dành A/B cho lúc đã có nhiều người dùng.

---

## 🛠️ Design Tools (Công cụ thiết kế - Figma và hệ sinh thái)

**Là gì:** Bộ công cụ dựng giao diện. Hiện **Figma** là chuẩn de-facto (mặc định của ngành): chạy trên trình duyệt, nhiều người **cùng chỉnh real-time**, và có tính năng phục vụ handoff cho dev.

Vài khái niệm trong hệ sinh thái Figma đáng biết:
- **Components & Variants** — thành phần tái sử dụng (như "component" trong code), có các biến thể trạng thái (default, hover, disabled).
- **Auto Layout** — bố cục tự co giãn theo nội dung, tư duy rất giống Flexbox trong CSS nên dev thấy quen ngay.
- **FigJam** — bảng trắng (whiteboard) của Figma, hợp để vẽ user flow, journey map, brainstorm.
- **Dev Mode** — chế độ dành cho dev: xem thông số spacing, màu, và gợi ý code khi bàn giao.

**Khi nào dùng:** Figma cho việc dựng UI và prototype; FigJam cho việc tư duy/sơ đồ giai đoạn đầu.

**Sai lầm hay gặp:** Nghĩ "phải giỏi Figma mới làm được UX". Sai — Figma chỉ là cái bút. Tư duy UX mới là cái quyết định. Học đủ dùng, đừng sa đà.

**Dev solo/team nhỏ áp dụng tối giản:** Figma có gói miễn phí đủ cho dự án nhỏ. Nếu team dùng design system riêng, bạn có thể nối Figma với code qua **design tokens** (biến chung về màu/spacing) — nhưng đó là tối ưu về sau, không cần vội.

---

## 🤝 Design Handoff (Bàn giao cho dev)

**Là gì:** Bước chuyển thiết kế từ Figma sang cho dev triển khai. Ở đây designer cung cấp: spec (thông số spacing, màu, font), asset (icon, ảnh), và mô tả các **trạng thái** cùng **hành vi tương tác**.

**Khi nào dùng:** Sau khi thiết kế được duyệt, trước khi code.

**Sai lầm hay gặp (bạn là dev nên sẽ thấy rõ):**
- Bàn giao chỉ có **happy path**, thiếu các state mà code bắt buộc phải xử lý: **empty state** (chưa có dữ liệu), **loading**, **error**, **trạng thái quá dài/tràn** (tên 100 ký tự thì hiển thị sao?).
- Không nói rõ **responsive** hoạt động thế nào ở màn nhỏ.
- Ném file Figma qua rồi biến mất — handoff tốt là *đối thoại hai chiều*, không phải quăng file.

**Dev solo/team nhỏ áp dụng tối giản:** Nếu bạn vừa design vừa code (rất phổ biến ở solo), thì "handoff" là cuộc đối thoại với chính bạn — hãy chủ động tự hỏi đủ các state ngay từ khâu thiết kế. Lập một checklist state chung (empty/loading/error/success/overflow) và soi mọi màn hình theo nó.

---

## 💬 Design Critique (Phản biện thiết kế)

**Là gì:** Buổi *xem và góp ý* thiết kế có cấu trúc: người trình bày nêu **bối cảnh và mục tiêu** thiết kế cần đạt, người góp ý phản hồi *dựa trên mục tiêu đó* — không phải khen chê theo gu cá nhân.

**Khi nào dùng:** Định kỳ trong lúc thiết kế (không phải chỉ lúc cuối), để bắt vấn đề sớm khi còn dễ sửa.

**Sai lầm hay gặp:**
- Góp ý kiểu **sở thích** ("tôi không thích màu này") thay vì **lý do gắn với mục tiêu/người dùng** ("màu này contrast thấp, user khó đọc — vi phạm nguyên tắc khả dụng").
- Biến critique thành *chỉ đạo* ("đổi thành thế này"). Critique tốt nêu *vấn đề*, để người thiết kế tự tìm giải pháp.
- Không nêu mục tiêu trước khi xin góp ý → nhận về mớ ý kiến lộn xộn không dùng được.

**Dev solo/team nhỏ áp dụng tối giản:** Không có team design? Dùng chính 10 heuristic của Nielsen làm "người phản biện" — tự soi thiết kế theo từng nguyên tắc. Hoặc nhờ một dev/khách hàng xem thử với câu hỏi cụ thể ("màn này có giúp user làm xong việc X không?").

---

## ✅ Tóm lại / Checklist

- **Quy trình là vòng lặp, không phải đường thẳng.** Nghiên cứu → tổng hợp → cấu trúc → dựng hình → kiểm chứng → bàn giao → lặp lại.
- [ ] Trước khi code tính năng mới: đã nói chuyện với ít nhất vài user thật chưa? (User Interview)
- [ ] Đã biết mình thiết kế *cho ai* chưa? (Persona theo role với SaaS)
- [ ] Với luồng nhiều bước: đã vẽ User Flow gồm cả edge case (empty/error) chưa?
- [ ] Đã phác Wireframe nhanh trước khi lao vào code chưa?
- [ ] Đã cho **5 người** thật bấm thử và ngồi im quan sát chưa? (Usability Testing)
- [ ] Đã tự soi màn hình chính qua **10 heuristic của Nielsen** chưa?
- [ ] Handoff (dù là cho chính mình) đã đủ mọi **state**: empty, loading, error, success, overflow, responsive chưa?
- **Nhớ về "5 users":** ~85% vấn đề trong *một đợt* — hãy test nhiều đợt nhỏ, sửa liên tục; nhiều nhóm user thì test riêng từng nhóm (NN/g gợi ý ~3–4 người/nhóm khi có 2 nhóm, ~3 người/nhóm khi từ 3 nhóm trở lên).
- **Ưu tiên theo giai đoạn:** SaaS mới ít traffic → phỏng vấn + usability test. Có traffic lớn → thêm A/B Testing.
- Liên hệ nền tảng: [[01 - Nền tảng tư duy UX]] · Áp dụng cho SaaS: [[09 - UX cho SaaS]]

---

## 🔗 Nguồn tham khảo

- Nielsen's 10 Usability Heuristics — NN/g: https://www.nngroup.com/articles/ten-usability-heuristics/
- Why You Only Need to Test with 5 Users — NN/g: https://www.nngroup.com/articles/why-you-only-need-to-test-with-5-users/
- Usability Testing 101 — NN/g: https://www.nngroup.com/articles/usability-testing-101/
- User Interviews: How, When, and Why to Conduct Them — NN/g: https://www.nngroup.com/articles/user-interviews/
- Personas: Study Guide — NN/g: https://www.nngroup.com/articles/persona/
- Journey Mapping 101 — NN/g: https://www.nngroup.com/articles/journey-mapping-101/
- Information Architecture: Study Guide — NN/g: https://www.nngroup.com/articles/information-architecture-study-guide/
- Card Sorting — NN/g: https://www.nngroup.com/articles/card-sorting-definition/
- The A/B Testing Controversy... / A/B Testing 101 — NN/g: https://www.nngroup.com/articles/putting-ab-testing-in-its-place/
- Design Critiques — NN/g: https://www.nngroup.com/articles/design-critiques/
- Figma (công cụ & Dev Mode): https://www.figma.com/
