---
tags:
  - ux
  - ui
  - psychology
  - laws-of-ux
type: note
created: 2026-08-23
---

# 🧠 Laws of UX — Nguyên tắc tâm lý học trong thiết kế

> [!abstract] Note này là gì?
> "Laws of UX" là bộ **nguyên tắc tâm lý học** (phần lớn không phải "luật" theo nghĩa vật lý, mà là **heuristic** — quy tắc kinh nghiệm — và **cognitive bias** — thiên kiến nhận thức) giúp bạn hiểu *tại sao* người dùng hành xử như vậy trước một giao diện. Biết tên gọi giúp bạn **ra quyết định thiết kế có cơ sở** và tra cứu lại nhanh, thay vì "cảm thấy đẹp".

## 📌 Ý chính của bài

- Đây là phần **"tại sao"** bổ sung cho tư duy nền tảng ở [[01 - Nền tảng tư duy UX]]. Mỗi luật giải thích một khía cạnh của cách não người xử lý thông tin, ghi nhớ và ra quyết định.
- Chia làm **3 nhóm** cho dễ nhớ:
  1. **Heuristics / Cognitive** — cách con người *ra quyết định & xử lý thông tin*.
  2. **Cognitive bias / Memory** — cách con người *ghi nhớ & cảm nhận trải nghiệm*.
  3. **Gestalt Principles** — cách mắt *nhóm các phần tử* thành một tổng thể có nghĩa.
- Lưu ý quan trọng: nhiều "luật" trong danh sách này là **quan sát thống kê hoặc quy tắc kinh nghiệm**, không phải chân lý tuyệt đối. Bài này nêu rõ chỗ nào còn tranh luận (đặc biệt là Miller's Law).

---

## ⚙️ Phần 1 — Heuristics & Cognitive (Ra quyết định)

### 🎯 Hick's Law (Định luật Hick)

**Phát biểu:** Thời gian để ra một quyết định **tăng lên** theo **số lượng và độ phức tạp** của các lựa chọn. Càng nhiều option, người dùng càng lâu chọn (và dễ bỏ cuộc).

**Ví dụ SaaS:**
- Menu điều hướng 15 mục ngang hàng → gom lại còn 5 nhóm chính, đẩy phần còn lại vào submenu.
- Trang Pricing 6 gói khiến khách "tê liệt lựa chọn" → rút còn 3 gói và **highlight 1 gói "recommended"** để dẫn hướng.
- Onboarding: hỏi từng bước một (progressive disclosure) thay vì bày cả form 20 field cùng lúc.

> [!tip] Đừng lạm dụng
> Hick's Law không có nghĩa "luôn ít lựa chọn hơn". Gộp quá tay khiến mỗi bước lại nhiều bước con. Mục tiêu là giảm **độ phức tạp cảm nhận tại mỗi thời điểm**, không phải giảm tổng số tính năng.

### 🖱️ Fitts's Law (Định luật Fitts)

**Phát biểu:** Thời gian để chạm/click tới một mục tiêu phụ thuộc vào **khoảng cách** tới nó và **kích thước** của nó. Mục tiêu **càng to và càng gần** thì càng nhanh và dễ trúng.

**Ví dụ SaaS:**
- Nút CTA chính ("Save", "Upgrade") nên **to, vùng click rộng**, không phải một link chữ nhỏ xíu.
- Nút hành động nguy hiểm (Delete) nên **để xa** nút thường dùng, tránh bấm nhầm.
- Trên mobile, target nên tối thiểu ~44px để ngón tay chạm trúng.
- Menu ngữ cảnh (right-click) xuất hiện **ngay tại con trỏ** → khoảng cách gần bằng 0 → thao tác cực nhanh.

Liên kết: kích thước & vùng click của component xem thêm ở [[07 - Components & Interaction Design]].

### 🔢 Miller's Law (Định luật Miller)

**Phát biểu chính xác:** Người bình thường chỉ giữ được khoảng **7 (±2) "chunk" (khối) thông tin** trong **working memory (trí nhớ làm việc)** cùng lúc — theo bài báo 1956 của George Miller.

> [!warning] Đây là chỗ hay bị hiểu sai
> - Miller nói về **số chunk trong trí nhớ ngắn hạn**, KHÔNG phải quy tắc "menu chỉ được có 7 mục". Việc suy ra "mọi list phải ≤7 item" là **áp dụng sai** — chính lawsofux.com cũng ghi chú điều này.
> - Con số "7±2" còn **gây tranh luận**. Nghiên cứu sau này (Nelson Cowan, 2001) cho rằng dung lượng thực tế gần **~4 chunk** hơn.
> - Bài học thực dụng: đừng bắt người dùng ghi nhớ nhiều thứ cùng lúc, và hãy **"chunking"** — nhóm thông tin thành khối có nghĩa.

**Ví dụ SaaS:**
- Số điện thoại / mã OTP hiển thị theo nhóm (VD 3-3-4) dễ đọc và nhớ hơn dãy liền.
- Form dài chia thành các **section có tiêu đề** (thông tin cá nhân / thanh toán / xác nhận).
- Đừng bắt user nhớ dữ liệu từ màn trước — hiển thị lại (recognition over recall).

### 👥 Jakob's Law (Định luật Jakob)

**Phát biểu:** Người dùng dành **phần lớn thời gian trên các sản phẩm KHÁC**. Vì vậy họ mong sản phẩm của bạn **hoạt động giống những gì họ đã quen**.

**Ví dụ SaaS:**
- Logo góc trên-trái click về trang chủ; giỏ hàng góc trên-phải; icon bánh răng = settings. Đừng "sáng tạo" phá vỡ những quy ước này.
- Dùng pattern quen thuộc cho login, search, filter, table — người dùng không phải học lại.
- Khi buộc phải làm khác chuẩn (vì lý do chính đáng), hãy có chỉ dẫn rõ ràng để giảm cú sốc.

Đây là lý do dùng **design pattern & convention** thay vì phát minh lại — liên quan tới mental model ở [[01 - Nền tảng tư duy UX]].

### 🧩 Tesler's Law (Định luật Tesler — Conservation of Complexity / Bảo toàn độ phức tạp)

**Phát biểu:** Mỗi ứng dụng có một mức **độ phức tạp cố hữu** không thể loại bỏ. Câu hỏi chỉ là: **ai gánh phần phức tạp đó** — hệ thống hay người dùng?

**Ví dụ SaaS:**
- Điền địa chỉ giao hàng: hệ thống **tự suy ra thành phố/quận từ mã bưu điện** → nhận phần phức tạp về phía mình, người dùng gõ ít hơn.
- Email client tự nhận diện "có vẻ bạn quên đính kèm file" → hệ thống gánh việc kiểm tra.
- Ngược lại, đẩy quá nhiều phức tạp sang user (bắt tự cấu hình mọi thứ) làm sản phẩm khó dùng.

> [!note] Bài học
> Nhiệm vụ của developer/designer là **hút độ phức tạp về phía hệ thống** càng nhiều càng tốt, để trải nghiệm phía người dùng thật đơn giản.

### 🤝 Postel's Law (Định luật Postel — Robustness Principle / Nguyên tắc bền vững)

**Phát biểu gốc (từ thiết kế mạng TCP):** *"Be conservative in what you do, be liberal in what you accept from others"* — **Nghiêm khắc với đầu ra của mình, khoan dung với đầu vào từ người khác.**

**Ví dụ SaaS (áp dụng vào UX):**
- Ô nhập số điện thoại / số thẻ chấp nhận cả khi user gõ có dấu cách hay dấu gạch, rồi **hệ thống tự chuẩn hóa** — thay vì báo lỗi bắt gõ lại.
- Field ngày tháng hiểu nhiều định dạng nhập vào nhưng lưu trữ một định dạng chuẩn.
- Với dev: hãy **khoan dung khi nhận input đa dạng** từ người dùng, nhưng **chặt chẽ, nhất quán khi xuất dữ liệu/ hiển thị**.

### 🪒 Occam's Razor (Dao cạo Occam)

**Phát biểu:** Trong các phương án cùng giải quyết được vấn đề, hãy chọn phương án có **ít giả định / ít phần tử thừa nhất**. "Đừng thêm cái gì nếu không cần thiết."

**Ví dụ SaaS:**
- Rà soát từng phần tử trên màn hình và hỏi: "Bỏ cái này đi thì luồng có gãy không?" Nếu không → cân nhắc bỏ.
- Onboarding chỉ hỏi những field **thật sự cần** để user bắt đầu; phần còn lại thu thập sau.
- Ưu tiên giải pháp đơn giản trước khi thêm tùy chọn, cấu hình, animation phức tạp.

---

## 🧠 Phần 2 — Cognitive Bias & Memory (Ghi nhớ & cảm nhận)

### 🏔️ Peak-End Rule (Quy tắc Đỉnh–Kết)

**Phát biểu:** Con người đánh giá một trải nghiệm chủ yếu dựa trên cảm xúc tại **thời điểm cao trào (peak)** và tại **lúc kết thúc (end)** — chứ không phải trung bình của toàn bộ quá trình.

**Ví dụ SaaS:**
- Đầu tư mạnh vào **"aha moment"** (khoảnh khắc user thấy giá trị lần đầu) và vào **màn hình thành công** cuối luồng (VD sau khi thanh toán: animation chúc mừng, tóm tắt gọn gàng).
- Trạng thái lỗi/loading là điểm dễ trở thành "peak tiêu cực" → chăm chút thông báo lỗi tử tế, có hướng khắc phục.
- Kết thúc onboarding bằng một chiến thắng nhỏ để lại ấn tượng tốt.

### 📋 Serial Position Effect (Hiệu ứng Vị trí chuỗi)

**Phát biểu:** Người dùng nhớ tốt nhất **phần tử đầu (primacy)** và **phần tử cuối (recency)** trong một chuỗi; phần giữa dễ bị quên.

**Ví dụ SaaS:**
- Đặt các mục **quan trọng nhất ở đầu và cuối** navigation/menu; mục ít quan trọng để giữa.
- Trong danh sách tính năng, để tính năng "đinh" ở đầu và một tính năng mạnh ở cuối.
- Thanh tab: item hay dùng nhất đặt ở hai đầu.

### 🌈 Von Restorff Effect (Hiệu ứng Von Restorff — Isolation Effect / Hiệu ứng nổi bật)

**Phát biểu:** Khi có nhiều phần tử **giống nhau**, phần tử **khác biệt** sẽ được chú ý và ghi nhớ nhiều nhất.

**Ví dụ SaaS:**
- Nút CTA chính có màu nổi, các nút phụ để dạng ghost/outline → mắt bị hút vào CTA.
- Gói "Pro" trên trang Pricing được **viền màu + badge "Popular"** để bật khỏi các gói còn lại.
- Nhãn "New" hay chấm đỏ notification làm mục đó nổi bật.

> [!tip] Đừng làm loãng
> Nếu **mọi thứ đều nổi bật** thì chẳng gì nổi bật cả. Chỉ chọn 1 điểm nhấn cho mỗi ngữ cảnh. Xem thêm về emphasis ở [[03 - Visual Hierarchy & Layout]].

### 🔓 Zeigarnik Effect (Hiệu ứng Zeigarnik)

**Phát biểu:** Con người **nhớ về các nhiệm vụ dang dở / bị gián đoạn** rõ hơn các nhiệm vụ đã hoàn thành. Việc chưa xong tạo một "căng thẳng nhận thức" thôi thúc hoàn tất.

**Ví dụ SaaS:**
- **Progress bar / checklist onboarding** kiểu "Hồ sơ của bạn hoàn thành 60%" thúc user hoàn tất các bước còn thiếu.
- Hiển thị số bước còn lại trong một quy trình nhiều bước.
- Badge "còn 2 bước để kích hoạt tài khoản" tận dụng cảm giác muốn "đóng vòng lặp".

### ✨ Aesthetic-Usability Effect (Hiệu ứng Thẩm mỹ–Khả dụng)

**Phát biểu:** Người dùng thường **cảm nhận** một giao diện **đẹp là dễ dùng hơn**, ngay cả khi khả năng dùng thực tế tương đương. Vẻ đẹp tạo thiện cảm và khiến người dùng khoan dung hơn với lỗi nhỏ.

**Ví dụ SaaS:**
- Một dashboard chỉn chu về spacing, typography, màu sắc sẽ được đánh giá "chuyên nghiệp, đáng tin" hơn dù logic y hệt bản xấu.
- Đẹp có thể **che giấu** vấn đề usability trong lúc test → đừng chỉ dựa vào cảm nhận, vẫn phải làm usability testing thật ([[10 - Design Process & Tools]]).

> [!note] Đẹp không thay thế được dễ dùng
> Hiệu ứng này giải thích *vì sao* đầu tư vào visual craft (Chương 3–6) đáng giá — nhưng nó là **lớp phủ**, không phải cái cớ để bỏ qua khả năng dùng.

### ⏱️ Doherty Threshold (Ngưỡng Doherty)

**Phát biểu:** Năng suất và sự hài lòng tăng vọt khi máy tính và người dùng tương tác ở tốc độ **dưới ~400 mili-giây (0.4 giây)** — đủ nhanh để không ai phải "chờ" ai.

**Ví dụ SaaS:**
- Phản hồi tức thì cho mọi thao tác: click là có hiệu ứng ngay (optimistic UI, hover state).
- Khi tác vụ thật sự lâu, dùng **skeleton screen / progress indicator** để lấp khoảng chờ, làm cảm giác nhanh hơn.
- Tối ưu để các thao tác thường xuyên (mở modal, chuyển tab, search-as-you-type) phản hồi gần như tức thời.

Liên quan tới feedback & micro-interaction ở [[07 - Components & Interaction Design]].

---

## 🔷 Phần 3 — Gestalt Principles (Cách mắt nhóm phần tử)

> [!info] Gestalt là gì?
> "Gestalt" (tiếng Đức: *hình thái/tổng thể*) là nhóm nguyên lý mô tả cách não **tự động nhóm các phần tử rời rạc** thành một tổng thể có nghĩa. Đây là nền tảng của bố cục — chi tiết áp dụng ở [[03 - Visual Hierarchy & Layout]].

### 📍 Law of Proximity (Định luật Cận kề)

**Phát biểu:** Các phần tử **đặt gần nhau** được não hiểu là **thuộc cùng một nhóm**, dù chúng không giống nhau.

**Ví dụ SaaS:**
- Nhãn (label) đặt sát ô input tương ứng → user hiểu chúng đi cùng nhau; khoảng cách giữa các cặp field thì rộng hơn.
- Nhóm các nút liên quan lại gần; tách nút "Cancel" xa "Delete".
- Đây là lý do **spacing quan trọng hơn đường kẻ**: chỉ cần chỉnh khoảng cách là đã phân nhóm được. Xem [[06 - Spacing & Design Tokens]].

### 🎨 Law of Similarity (Định luật Tương đồng)

**Phát biểu:** Các phần tử **trông giống nhau** (cùng màu, hình dạng, kích thước, kiểu) được cảm nhận là **cùng loại / cùng chức năng**.

**Ví dụ SaaS:**
- Mọi link cùng một màu; mọi nút primary cùng một style → user học một lần, nhận ra ở mọi nơi.
- Ngược lại: nếu hai thứ **không cùng chức năng** thì đừng cho chúng trông giống nhau (tránh hiểu nhầm text thường là link).

### 🔲 Law of Common Region (Định luật Vùng chung)

**Phát biểu:** Các phần tử nằm **trong cùng một vùng bao rõ ràng** (khung viền, nền màu, card) được cảm nhận là **cùng một nhóm** — hiệu ứng này mạnh, có thể "thắng" cả proximity.

**Ví dụ SaaS:**
- **Card** gom tiêu đề + mô tả + nút của một item vào một khối nền/viền → rõ ràng đây là một cụm.
- Section có nền màu khác để tách khỏi phần còn lại của trang.
- Dropdown/panel dùng nền và bóng đổ để "khoanh vùng" nội dung nổi lên trên.

### 🟢 Law of Prägnanz (Định luật Prägnanz — Law of Simplicity / Good Figure)

**Phát biểu:** Não người có xu hướng diễn giải hình ảnh phức tạp theo **dạng đơn giản nhất** có thể — vì hình đơn giản tốn ít công sức nhận thức hơn.

**Ví dụ SaaS:**
- Logo và icon nên dựa trên **hình khối đơn giản** — dễ nhận ra và nhớ ở mọi kích thước.
- Bố cục sạch, ít nhiễu giúp user "quét" nhanh và không mệt.
- Đây là cơ sở tâm lý cho câu "less is more" và cho Occam's Razor ở trên.

### 🔗 Law of Uniform Connectedness (Định luật Kết nối đồng nhất)

**Phát biểu:** Các phần tử được **nối với nhau bằng một yếu tố thị giác** (đường kẻ, khung bao, cùng một nền liền) được cảm nhận là **liên quan hơn** so với các phần tử không được nối — đây là nguyên lý nhóm **mạnh nhất** trong Gestalt.

**Ví dụ SaaS:**
- Các bước trong một wizard được nối bằng một **đường timeline / stepper** → user hiểu chúng là một chuỗi.
- Dòng trong bảng dùng đường kẻ hoặc màu nền xen kẽ để buộc các ô cùng một hàng lại với nhau.
- Menu items nằm trên cùng một dải nền được hiểu là cùng một nhóm điều hướng.

---

## ✅ Tóm lại / Checklist

- [ ] **Hick:** Mỗi màn hình / bước giảm số lựa chọn cạnh tranh; Pricing có gói "recommended".
- [ ] **Fitts:** CTA chính đủ to & vùng click rộng; action nguy hiểm để xa; target mobile ≥ ~44px.
- [ ] **Miller:** Không bắt user ghi nhớ giữa các màn; chia thông tin thành chunk có nghĩa (nhớ: "7±2" còn tranh luận, thực tế có thể ~4).
- [ ] **Jakob:** Dùng convention quen thuộc (logo trái-trên, settings = bánh răng…).
- [ ] **Tesler:** Hệ thống gánh phần phức tạp thay cho user (auto-fill, auto-detect).
- [ ] **Postel:** Input khoan dung + tự chuẩn hóa; output nhất quán.
- [ ] **Occam:** Bỏ mọi phần tử/field không thực sự cần.
- [ ] **Peak-End:** Chăm chút "aha moment" và màn hình kết thúc.
- [ ] **Serial Position:** Item quan trọng ở đầu & cuối danh sách/menu.
- [ ] **Von Restorff:** Một điểm nhấn nổi bật mỗi ngữ cảnh (không làm loãng).
- [ ] **Zeigarnik:** Progress bar / checklist để thúc hoàn tất.
- [ ] **Aesthetic-Usability:** Đầu tư visual craft — nhưng vẫn test khả năng dùng thật.
- [ ] **Doherty:** Phản hồi < ~400ms; dùng skeleton/loading khi lâu.
- [ ] **Gestalt:** Dùng proximity + common region + uniform connectedness để phân nhóm; similarity cho nhất quán; Prägnanz cho sự đơn giản.

> [!summary] Một câu để nhớ
> Ba nhóm luật = **quyết định** (Phần 1) + **cảm nhận & trí nhớ** (Phần 2) + **thị giác nhóm** (Phần 3). Chúng là *lý do tâm lý* đứng sau các quy tắc visual bạn sẽ gặp ở [[03 - Visual Hierarchy & Layout]], và đặc biệt hữu ích khi thiết kế luồng SaaS ở [[09 - UX cho SaaS]].

## 🔗 Nguồn tham khảo

- Laws of UX — bộ sưu tập gốc của Jon Yablonski: https://lawsofux.com/
- Hick's Law: https://lawsofux.com/hicks-law/
- Fitts's Law: https://lawsofux.com/fittss-law/
- Miller's Law (kèm lưu ý hiểu sai phổ biến): https://lawsofux.com/millers-law/
- Jakob's Law: https://lawsofux.com/jakobs-law/
- Tesler's Law (Conservation of Complexity): https://lawsofux.com/teslers-law/
- Postel's Law: https://lawsofux.com/postels-law/
- Occam's Razor: https://lawsofux.com/occams-razor/
- Peak-End Rule: https://lawsofux.com/peak-end-rule/
- Serial Position Effect: https://lawsofux.com/serial-position-effect/
- Von Restorff Effect: https://lawsofux.com/von-restorff-effect/
- Zeigarnik Effect: https://lawsofux.com/zeigarnik-effect/
- Aesthetic-Usability Effect: https://lawsofux.com/aesthetic-usability-effect/
- Doherty Threshold: https://lawsofux.com/doherty-threshold/
- Gestalt — Proximity: https://lawsofux.com/law-of-proximity/
- Gestalt — Similarity: https://lawsofux.com/law-of-similarity/
- Gestalt — Common Region: https://lawsofux.com/law-of-common-region/
- Gestalt — Prägnanz: https://lawsofux.com/law-of-pragnanz/
- Gestalt — Uniform Connectedness: https://lawsofux.com/law-of-uniform-connectedness/
- Miller, G. A. (1956), "The Magical Number Seven, Plus or Minus Two": https://en.wikipedia.org/wiki/The_Magical_Number_Seven,_Plus_or_Minus_Two
- Nelson Cowan (2001) — dung lượng working memory ~4: https://en.wikipedia.org/wiki/Working_memory
- Nielsen Norman Group — Gestalt principles: https://www.nngroup.com/articles/gestalt-principles/
- Interaction Design Foundation — Laws of UX: https://www.interaction-design.org/literature/topics/laws-of-ux

---
> 🤖 Note thuộc bộ "UX/UI Roadmap cho Dev SaaS". Nội dung được kiểm chứng qua lawsofux.com, NN/g và Interaction Design Foundation; các điểm còn tranh luận (Miller's Law) đã nêu rõ.
