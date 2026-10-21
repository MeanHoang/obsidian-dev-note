---
tags: [ai, ai-coding, roi, team]
source: https://www.youtube.com/watch?v=EWSUvEyFwjc
timestamp: "47:02–55:05"
---

# 07 · Q&A — Token, ROI và team product

← [[06 - Các lớp enforcement - Hard constraint thắng soft rule]] · Về [[AI/Trust ladder cho AI agent - Lauren Tan (Cursor)/00 - README|README]]

> [!quote] 💬
> Giá trị của agent là cho mình làm được những việc **trước đây không làm nổi**.

---

## 💸 Hỏi: người không có token vô hạn thì có làm được như vậy không?

- Lauren thừa nhận: bà làm ở AI lab, **token không giới hạn**, nên không thể nói ai cũng nên làm y hệt.
- Theo bà, tới được mức này mà không cháy túi là có thể.
- Với engineering leader hoặc người lead startup, đây là câu hỏi **ROI**:
  - Giai đoạn đầu tốn nhiều token: refactor codebase, thêm đủ các ràng buộc.
  - Nếu tương lai agent viết hầu hết code và mình muốn **gọn nhẹ**, không thành tổ chức 10.000 kỹ sư với đủ overhead lên kế hoạch → đáng đầu tư.

> [!note] 📝 Phép so sánh Lauren đưa ra
> Thứ trước đây Lauren **không làm nổi một mình**: enforce mức ràng buộc này trong codebase. Thời chưa có agent, tự build framework, tự refactor, tự test và verify sẽ mất **nhiều năm**, mà lương bà cao.
> Lựa chọn của leader: **thuê người** làm việc đó, hay **chi token** dựng codebase sao cho cả agent "kém nhất" cũng làm tốt.

- Tới mức đó thì **cả model không phải cỡ lớn nhất** cũng viết code rất tốt.
- Lãi kép: PM, designer, kỹ sư không quen Grockbot đều đóng góp được một cách bền vững.
- "Không có gì miễn phí, token khá đắt", nhưng theo Lauren tự phân tích thì ROI **khá dương**: tưởng tượng có cả đội kỹ sư ship như bà mỗi ngày.

**Phần nhắc model (Lauren nói trong buổi):**
- Hôm đó công bố **Grock 4.6** (tên theo phụ đề tự động). Lauren tin giá mỗi token bằng bản 4.5 → thông minh hơn với cùng chi phí. Bà nói thêm là "hy vọng không nói sai".
- Cursor và SpaceX AI cố tối ưu **đường biên Pareto chi phí ↔ trí thông minh**: không cần model to nhất (rất đắt để chạy), mà tìm điểm ngọt: đủ thông minh, inference không đắt.

---

## 🧑‍💼 Hỏi: kỹ sư ship nhanh vậy thì product và các team khác theo kịp thế nào?

- Trước Grockbot, Cursor chỉ có agents window, CLI, IDE: công cụ cho **power user**, xoay quanh developer. Làm knowledge work được nhưng UI không tối ưu. Người GTM, product có dùng Cursor nhưng không phải trải nghiệm dễ chịu.
- Lauren gọi Grockbot là "**khoảnh khắc Cursor cho người không làm tech**": giao diện quen thuộc như **iMessage**, đặt tên vui cho agent, điều phối tự nhiên: mỗi agent như một người.
  - Ví dụ: một agent cho mỗi account mình quản lý.
  - PM có agent tóm tắt mọi việc Lauren làm đêm qua.
- **PM cũng ship code**: "đây là bug, tôi fix rồi, xem giúp" → Lauren review, thấy hoàn hảo → duyệt.
- Theo Lauren, đó là bằng chứng kiến trúc **Dune đứng vững**: ràng buộc chặt cho phép người không chuyên engineering đóng góp ở mức cao. Designer, PM ship tính năng trực tiếp → team Grockbot rất nhanh.

---

## ✅ Checklist
- [ ] Tính ROI: token cho refactor + guardrail vs chi phí người làm cùng việc
- [ ] Hỏi: sau khi có guardrail, model rẻ hơn có đủ làm tốt không?
- [ ] Nghĩ xem PM/designer trong team có thể ship sửa nhỏ an toàn nếu codebase đủ chặt
