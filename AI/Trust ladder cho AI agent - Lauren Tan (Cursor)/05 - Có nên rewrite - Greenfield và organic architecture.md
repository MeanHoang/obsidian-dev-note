---
tags: [ai, ai-coding, architecture, refactor]
source: https://www.youtube.com/watch?v=EWSUvEyFwjc
timestamp: "29:21–37:50"
---

# 05 · Có nên rewrite? Greenfield và "organic architecture"

← [[04 - Local trước, cloud sau - Agent Benny]] · Tiếp → [[06 - Các lớp enforcement - Hard constraint thắng soft rule]]

> [!quote] 💬
> "Before AI slop, we had human slop." (31:07): trước AI slop, chúng ta đã có **human slop** (code dở do người viết).

---

## 🎯 Phần thứ ba: refactor và rewrite (29:21)

- Lauren hỏi host còn thời gian nói thêm một phần không; host bảo cứ nói, câu hỏi khán giả sẽ gom lại hỏi sau.
- Đây là "phần thứ ba" mà Lauren chưa nói tới: **refactor và rewrite**.
- "Có nên rewrite app không" theo Lauren là **một trong những chủ đề gây tranh cãi nhất ngành**.
- Lý do nó hay nổ ra: kỹ sư rất dễ có xu hướng này, nhất là khi **mới vào công ty**: nhìn codebase rồi nghĩ "trời, ai viết code này vậy, tệ quá, muốn viết lại hết". Lauren gọi đây là xu hướng **rất phổ biến**.
- Trước thời agent, và "có lẽ cả bây giờ", người ta **chắc chắn sẽ can** bạn rewrite.
- Nhưng Lauren nói bà ở đây để đưa ra lập luận **vì sao bạn có thể nên cân nhắc rewrite**, vì câu trả lời là **tuỳ trường hợp**.

---

## 🏢 Brownfield (app đã có) có hạ tầng tốt → agent đã làm tốt (30:15)

- Ý mở đầu: app brownfield (app đang chạy sẵn) thật ra đang ở **vị trí khá tốt**, nhất là khi **đã được set up tốt từ trước**.
- Lauren kể gần đây nói chuyện với vài người và nhận ra một điểm song song: **nhiều vấn đề của big tech giờ thành vấn đề của mọi người**.
- Vấn đề của big tech, lấy ví dụ Meta (nơi Lauren từng làm):
  - Một **monorepo khổng lồ**, khoảng "chục nghìn kỹ sư" (Lauren nói "I don't know, tens of thousands", tức con số ước chừng) cùng gõ phím và ship code.
  - Ở Meta có rất nhiều kỹ sư giỏi, **nhưng** "bạn sẽ bất ngờ là chất lượng code thật ra không tốt lắm" (31:01).
  - Từ đó Lauren hay đùa: **trước AI slop đã có human slop**. Ý của câu đùa: code kém không phải chuyện mới do AI sinh ra; người viết đông thì code cũng xuống cấp.
- Vì vậy hạ tầng của big tech (Meta, Google...) **được thiết kế đúng cho tình huống đó**: phục vụ **kỹ sư kém nhất trong team**. Lauren tự rào "nói ra nghe tệ lắm" trước khi nói câu này (31:26).
  - Cụ thể: dựng framework, dựng convention, dựng guardrail, **giới hạn credential** để intern không xoá database production.
- Hệ quả: nếu đã có hạ tầng cỡ đó, **agent đã làm việc khá ổn rồi**, vì guardrail có sẵn khiến agent không gây loạn, "hoặc không gây loạn quá nhiều", trong codebase.
- Và lúc nào cũng có thể **thêm guardrail**.

---

## 🌱 Greenfield (app mới, vibe code) → rủi ro lớn nhất, cũng là cơ hội lớn nhất (31:58)

- Theo Lauren, app greenfield (app làm mới hoàn toàn) là **rủi ro lớn nhất**, và cũng là **cơ hội lớn nhất**.
  - Bà bắt đầu giải thích "vì nếu bạn vibe code một project, một prototype..." rồi chuyển sang ví dụ Grockbot; câu giải thích vì sao là "cơ hội" không được nói trọn ở đoạn này.
- Ví dụ: **Grockbot**, dựng lên **rất, rất nhanh**.
  - Grockbot là app mới của Cursor, **launch hôm qua** (so với ngày nói chuyện). Nó cho bạn tạo từng agent riêng có **danh tính riêng** và **điều phối** chúng. Lauren quảng cáo "rất hay, nên thử".
  - Giống phần lớn prototype, Grockbot là app greenfield điển hình: **vibe code rất nhanh, con người hoàn toàn không đọc code**.
  - Lưu ý tên: caption tự động ghi "Grockbot" (có chỗ ghi "graph web", xem bên dưới); tên chính xác chưa kiểm.

> [!danger] ⛔ "Organic architecture" (32:52)
> Lauren nhắc một tweet gần đây của bà về **organic architecture** (định tìm tweet để chiếu nhưng không thấy chiếu trong đoạn này).
> - App vibe code hoàn toàn = **không có guardrail nào**.
> - Vì vậy giao task cho agent → nó giải bằng **cách tiện nhất** lúc đó.
> - Lâu dần codebase **xoáy ra ngoài tầm kiểm soát**, vì **mình không hiểu nó**.
> - Agent thì "theo một nghĩa nào đó" hiểu nó, nhưng thứ agent dựng ra **tối ưu cho đường tắt**.
> - Kết quả: "bạn sẽ khổ", app sẽ gặp rất nhiều vấn đề.

→ Kết luận của Lauren: **codebase mới rất cần bắt đầu với ràng buộc rất chặt**, vì khi có codebase đáng tin, có guardrail thật sự giúp agent viết code tốt, mình mới leo được lên phần trên của đường cong trust.

---

## 🔁 Lauren đã làm gì với Grockbot (33:57)

- Lauren nhắc lại chuyện đã kể ở đầu buổi: "sáng nay thức dậy đã có ~20 PR agent merge". Bà nói làm được vậy **là nhờ đã đầu tư rất nhiều thời gian**.
- Cụ thể: **hơn 600 PR** (Lauren tự đếm hôm trước) để **refactor toàn bộ Grockbot** sang **kiến trúc mới mà bà đang xây**. (Tên code name **Dune** của kiến trúc này chỉ được nói ở đoạn sau, xem [[06 - Các lớp enforcement - Hard constraint thắng soft rule]].)
- Giờ Lauren nói thẳng "**I really don't look at the code anymore**" (34:26): bà không còn đọc code nữa.
- Bà nói câu này **không phải để bán token cho bạn**, mà vì **phải tốn rất nhiều công** để tới được đó: tốn rất nhiều token để đưa codebase tới mức không cần nhìn vào nữa.

**Vì sao Lauren hào hứng (lợi ích lan ra):**
- Không chỉ có lợi cho riêng bà: **mọi người đóng góp vào Grockbot** đều được hưởng.
- Nó trao quyền cho **designer, PM, thậm chí người GTM** (go-to-market) tự thêm tính năng vào Grockbot.
- Lauren **không phải giật mình thức giữa đêm** lo "ai vừa merge một perf regression".
- Lý do: bà có **hàng tấn ràng buộc trong CI**. Viết code trong đó **thật sự rất phiền**, nhưng **agent hấp thụ hết cái phiền đó**.
  - Caption tự động ghi "write code in **graph web**" (35:14), nhiều khả năng là nghe nhầm "Grockbot"; chưa kiểm.
- Lauren nói sẵn sàng kể cụ thể các ràng buộc đó là gì, thì host chen vào hỏi.

---

## 📏 Q&A nhỏ: kích thước PR (35:23)

**Câu hỏi của host:** trước khi vào phần tiếp, host hỏi về CI và các ràng buộc trông ra sao, kèm **kích thước PR trung bình** (có khán giả hỏi trước đó). Không cần trung bình chính xác theo toán, chỉ cần cảm nhận chung: PR chỉ vài dòng hay lớn hơn.

**Trả lời của Lauren:**
- Đầu tiên nói "tuỳ". Bà mở danh sách PR trên màn hình và lưỡng lự: "đang cố làm sao để không..." (câu bị bỏ dở). Host trấn an là không cần chia sẻ con số trung bình thật.
- Lauren chen một **fun fact** (36:06), tự nói "không quan trọng lắm": phần **virtualization** trong Grockbot và trong Cursor chạy bằng **Pretext**, một thư viện mới do một người khác viết, đáng xem thử. (Tên "Pretext" theo caption tự động, chưa kiểm.)
- Về con số: Lauren **thật sự không biết** kích thước PR trung bình, và không muốn bấm vào từng PR để xem.
- Ước lượng: từ **~50 dòng, vài trăm dòng tới ~1.000 dòng**, tuỳ PR đó làm gì.
  - Ví dụ ngay trên màn hình: một PR **xoá nhiều file**, nên bà đoán phần lớn là dòng bị xoá.
- Host hỏi lại: có giới hạn cứng không, hay PR nào cũng 50 dòng? → **Không có giới hạn cứng**, "chắc chắn không có".

**Nhưng Lauren khuyến khích agent chia việc thành nhiều PR (36:57)**, vì:
- Bà thích ý tưởng **git history là nguồn context rất giàu**. Bà tự thừa nhận việc này có lẽ **khó hơn trong thời agent**, khi có quá nhiều commit.
- Bà muốn **mỗi PR mô tả trọn vẹn (atomic) đúng một việc nhỏ** nó làm.
- Nhờ vậy **dễ revert** và **dễ khoanh vùng bug**: "à, mình ship bug và nó nằm ở đây", chứ không lẫn trong một **PR 40.000 dòng** mà không ai biết bên trong có gì.
- Chốt lại: vẫn **không đặt giới hạn cứng** cho kích thước PR.

> [!note] 📝 Phần tiếp theo
> Ngay sau đó host hỏi CI của Lauren nghiêm tới mức nào → bà kể về CI của **Dune** (cấm `useEffect`, cấm code comment...). Nội dung đó ở [[06 - Các lớp enforcement - Hard constraint thắng soft rule]].

---

## ✅ Checklist
- [ ] App đang có: kiểm hạ tầng guardrail (convention, framework, giới hạn credential) đã đủ cho agent chưa; thiếu thì thêm
- [ ] App mới: dựng ràng buộc chặt ngay từ đầu, đừng để agent tự "mọc" kiến trúc theo đường tắt
- [ ] Chấp nhận CI "phiền" với người: để agent gánh phần phiền đó
- [ ] Bảo agent chia việc thành nhiều PR nhỏ, mỗi PR một việc (atomic), để git history thành context và dễ revert
