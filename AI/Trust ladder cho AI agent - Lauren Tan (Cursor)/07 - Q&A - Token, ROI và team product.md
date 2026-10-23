---
tags: [ai, ai-coding, roi, team]
source: https://www.youtube.com/watch?v=EWSUvEyFwjc
timestamp: "47:23–55:05"
---

# 07 · Q&A — Token, ROI và team product

← [[06 - Các lớp enforcement - Hard constraint thắng soft rule]] · Về [[AI/Trust ladder cho AI agent - Lauren Tan (Cursor)/00 - README|README]]

> [!quote] 💬
> Giá trị của agent là cho mình làm được những việc **trước đây không làm nổi**.

> [!warning] ⚠️ Về tên riêng trong phụ đề
> Phụ đề tự động viết tên sản phẩm lẫn lộn: "Grockbot", "grathbot", "graphbot", "grabbot" (nhiều khả năng là cùng một sản phẩm, note dùng "Grockbot"). Các chỗ khác cũng không chắc: "Grock 4.6", "SpaceX AI", "fable size", "heredto frontier" (đoán là Pareto frontier), "kusher moment" (đoán là "Cursor moment"), "Dune architecture". Note giữ nguyên cách ghi của phụ đề, không khẳng định tên đúng.

---

## 🎤 Chuyển sang phần hỏi đáp (47:23)

- Trước đó host tự nhận mình chưa có đống rule như Lauren mô tả, nên sau buổi này có việc phải làm để scale agent. Host nói mình đang ở giai đoạn chạy **2–3 agent song song trên máy local**, và đoán phần lớn người xem cũng vậy.
- Còn vài phút, host hỏi Lauren còn muốn nhấn mạnh gì không. Lauren đùa là mình "nói nhiều quá rồi" (yapping), nên chuyển thẳng sang câu hỏi.

---

## 💸 Hỏi: người không có token vô hạn thì có làm được như vậy không? (47:43)

- Host nói câu này được hỏi **nhiều lần**: những gì Lauren mô tả có thực tế với người dùng token ở mức bình thường, không có token gần như vô hạn không?
- Lauren công nhận đây là điểm hay. Bà làm ở một AI lab, nơi **token không giới hạn**, nên bà không thể nói mọi người nên làm y hệt cách bà làm.
- Theo bà, vẫn có thể tới được mức này mà **không cháy túi**.
- Với engineering leader hoặc người lead startup, bà xem đây là câu hỏi **ROI** (48:09):
  - Đúng là giai đoạn đầu tốn nhiều tiền token: refactor codebase tốn nhiều token, thêm tất cả các ràng buộc cũng tốn nhiều token.
  - Nhưng nếu thế giới đang đi tới chỗ agent viết toàn bộ code, và mình muốn giữ team **gọn nhẹ**: không phải tuyển thêm, không muốn "thành **Meta**", tức thành tổ chức engineering 10.000 người.
  - Bà nói có tổ chức to như vậy là "vấn đề sướng" (cool problem to have), nhưng overhead rất lớn: lên kế hoạch đủ thứ; cá nhân bà thấy không vui lắm. Nên mình muốn giữ **nhanh nhẹn** (nimble).

> [!note] 📝 Agent có giá trị ở chỗ nào (48:59)
> - Với Lauren, giá trị thật của agent là cho mình làm được **việc trước đây không làm được**, chứ không phải chỉ là chuyện tiêu token cho từng việc nhỏ (phụ đề ghi "storing tokens on every single little thing", câu này nghe không rõ, có thể là "saving").
> - Việc trước đây bà không làm nổi: **một mình** enforce mức ràng buộc này trong codebase. Bà chỉ là một người; thời chưa có agent, tự build framework, tự refactor, tự test và verify hết sẽ mất **nhiều năm**.
> - Và lương bà khá cao, nên thời gian đó rất đắt.

- Từ đó câu hỏi của engineering leader là một **đánh đổi** (50:02): **thuê người** làm việc này, hay **chi token** để dựng codebase sao cho kể cả agent "ngây ngô nhất", "kém nhất" cũng làm tốt.
- Khi đã tới mức đó, kể cả agent **không phải cỡ lớn** (phụ đề ghi "not fable size", không chắc là tên model nào) cũng viết code rất tốt.
- Bà nói việc này "trả cổ tức" nhiều (pays a lot of dividends) cho chính bà: không chỉ bà, mà **PM, designer, kỹ sư không quen Grockbot** đều đóng góp được theo cách **bền vững**.
- Bà chốt ý: chắc chắn là đánh đổi, không có gì miễn phí, **token khá đắt**.

**Đoạn chen vào về model mới (50:32):**
- Lauren hỏi người xem đã thấy chưa: hôm đó vừa công bố **Grock 4.6** (tên theo phụ đề). Bà nói model này rất thông minh, điểm benchmark rất tốt.
- Bà tin giá mỗi token **bằng bản 4.5**, kèm câu "hy vọng không nói sai", nên theo bà là được thêm trí thông minh với cùng chi phí.
- Theo bà, Cursor và "SpaceX AI" (theo phụ đề) cố tối ưu **đường biên chi phí ↔ trí thông minh** (phụ đề "heredto frontier", đoán là Pareto frontier):
  - Không nhất thiết muốn build model to nhất, vì chạy cực kỳ đắt.
  - Mục tiêu là tìm điểm ngọt: không cần model khổng lồ, nhưng vẫn rất thông minh và inference không đắt.

**Kết câu trả lời (51:52):**
- Lauren nói nếu tự làm phân tích, bà nghĩ kết quả sẽ **khá dương**: ROI từ đầu tư kiểu này giúp không chỉ bản thân mà **cả team** làm việc hiệu quả hơn nhiều.
- Hình ảnh bà đưa ra: tưởng tượng có "một đội quân kỹ sư như tôi", mỗi ngày ship rất nhiều cải tiến và bug fix. Bà thấy điều đó rất hào hứng.

---

## 🧑‍💼 Hỏi: kỹ sư ship nhanh vậy thì product và các team khác theo kịp thế nào? (52:20)

- Host nói đây là câu cuối, dành cho người làm product: nếu có cả đội kỹ sư ship như Lauren, thì team product và các bộ phận khác theo kịp thế nào, họ có dùng AI nhiều hơn không? Host cũng nói rõ Lauren không ở vai trò đó, nên trả lời được tới đâu thì tới.
- Lauren trả lời đây là chỗ Grockbot **cực kỳ mạnh** (52:45):
  - Trước Grockbot, Cursor chỉ có Cursor: agents window, CLI, IDE. Đây là công cụ cho **power user**, thiết kế cho developer, rất xoay quanh developer. Làm knowledge work trong đó được, nhưng UI không tối ưu cho việc đó.
  - Bà bắt đầu nói "nên thật ra chúng tôi chưa có…" rồi **bỏ dở câu**, chuyển sang ý khác.
  - Người làm GTM, product có thể đã dùng Cursor cho công việc, nhưng chắc chắn không phải trải nghiệm dễ chịu.
- Theo bà, Grockbot là "**khoảnh khắc Cursor cho người không làm tech**" (53:22, phụ đề ghi "kusher moment"): cách dùng agent rất dễ tiếp cận, trong giao diện thoải mái, quen thuộc, trông như **iMessage**.
  - Có thể đặt tên vui cho agent.
  - Điều phối nhiều agent một cách tự nhiên: mỗi agent giống một người, mình có cả một team agent.
  - Ví dụ: một agent cho mỗi account mình quản lý.
  - Ví dụ cho PM: một agent tóm tắt mọi việc Lauren làm đêm qua, để sáng ra PM biết bà đã làm gì.
- **PM của họ dùng nhiều và cũng ship code** (54:13): PM hay nhắn "đây là bug, tôi fix rồi, xem giúp" → Lauren review, thấy hoàn hảo → "ok, stamp" (duyệt).
- Theo Lauren, điều đó cho thấy kiến trúc "**Dune**" (theo phụ đề) đang đứng vững: các ràng buộc rất chặt cho phép người không chuyên engineering đóng góp ở mức cao.
- Bà nói đã thấy việc này **đền đáp nhiều**: designer và PM ship tính năng trực tiếp, nhờ vậy team Grockbot ship rất nhanh.
- Bà nói team còn nhiều kế hoạch và rất hào hứng được "ship thêm, ship thêm…" — câu **bị cắt** ở cuối video, không có kết luận.

---

## ✅ Checklist
- [ ] Tính ROI: token cho refactor + guardrail vs chi phí thuê người làm cùng việc
- [ ] Hỏi: sau khi có guardrail, model rẻ hơn có đủ làm tốt không?
- [ ] Nghĩ xem PM/designer trong team có thể ship sửa nhỏ an toàn nếu codebase đủ chặt
- [ ] Tự đánh giá: mình đang ở mức mấy agent song song, cần thêm rule gì để scale
