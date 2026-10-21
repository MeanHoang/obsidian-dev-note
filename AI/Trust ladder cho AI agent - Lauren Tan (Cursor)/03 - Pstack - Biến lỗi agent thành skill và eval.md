---
tags: [ai, ai-coding, agent, skill, eval]
source: https://www.youtube.com/watch?v=EWSUvEyFwjc
timestamp: "13:27–23:28"
---

# 03 · Pstack — Biến lỗi agent thành skill, kiểm skill bằng eval

← [[02 - Verification skill và Feature map]] · Tiếp → [[04 - Local trước, cloud sau - Agent Benny]]

> [!quote] 💬
> Mỗi lần thấy agent mắc một kiểu lỗi, tôi biến nó thành một skill.

---

## 🥔 Pstack là gì

- "P" = **potato** (potato stack). Tên đùa theo **GStack** (Gary Stack) của Gary Tan, CEO Y Combinator. Hai người trùng họ, không họ hàng.
- Pstack là bản của Lauren, may theo bộ thực hành engineering riêng của bà.
- Lauren **không định làm plugin từ đầu**. Nó lớn dần từ từng skill lẻ: `control glass`, rồi skill `how`…

---

## 🔍 Cách Lauren tìm ra skill cần viết: quan sát agent

1. Giai đoạn đầu Lauren soi agent cực kỹ (nitpick).
2. Đưa bug report "tính năng này hết chạy, tại sao?" → agent tự tin "chắc chắn là cái này".
3. Mở **tool call** ra xem thì thấy agent **không hề đọc đoạn code** lẽ ra bị ảnh hưởng → hoàn toàn hallucinate → mất hết niềm tin.
4. Thay vì bất lực, Lauren viết skill cho đúng kiểu lỗi đó: *đừng đoán, đi đọc code thật, dùng nhiều sub agent, ngừng guess.*

> [!note] 📝 So sánh dễ hiểu: nhân viên mới giỏi code, zero business context
> Tuyển được kỹ sư code rất giỏi nhưng vừa onboard 5 giây, chưa biết gì về business. Làm sao để người đó làm việc hiệu quả? → **dạy**.
> Với agent, cách dạy là **skill**. Skill chỉ là markdown, nhưng chứa nhiều thông tin, hướng dẫn.

> [!tip] 💡 Vì sao skill làm agent "thông minh hơn"
> Trên Twitter gọi là "kéo agent sang latent space khác". Ý đơn giản: LLM đoán token kế tiếp; đưa vào **token chất lượng cao** từ đầu thì nó pattern-match ở vùng "thông minh hơn".

---

## 🧪 Eval — unit test cho skill

**Câu hỏi từ khán giả:** product đổi liên tục, nhiều người cùng ship → skill được bảo trì thế nào? Làm sao biết verification đủ tốt để tin?

**Eval là gì:** Lauren coi nó như **unit test cho agent/skill**. Không cần framework riêng, tự dựng được, chặt tới đâu tuỳ mình.

**Cách Lauren chạy eval** (Pstack có playbook tên `eval playbook` trong "potato mode"):
1. Agent điều phối chính (coordinator) soạn **rubric**: mình muốn skill làm được gì.
2. Coordinator spawn nhiều **sub agent**, mỗi con một thư mục riêng.
3. Thư mục được **đặt tên khéo để sub agent không biết mình đang bị đánh giá**, vì agent nhận ra được và khi biết thì **đổi hành vi**.
4. Kiểm xem skill vừa viết/sửa có làm đúng điều mình nghĩ không.
5. Chạy trên **nhiều model khác nhau** (Cursor hỗ trợ nhiều model) để biết skill hoạt động thế nào trên từng model, nhất là model mình hay dùng.

Lauren chạy eval **mỗi lần sửa skill**.

---

## ⛰️ Hill climb eval

- Eval cho ra **điểm số** do coordinator chấm.
- Thêm một **judge agent dùng model khác** để đối chiếu, tránh model chấm bị thiên vị.
- **Hill climb**: dùng `/loop` trong Cursor, bảo "cứ lặp eval này cho tới khi mọi thứ 10/10".
- Lauren dựng skill `control` (cả CLI lẫn skill) theo cách này, khá rảnh tay. Nhưng lúc đầu **không suôn sẻ**, cần lặp nhiều.

---

## 🧑‍🍳 Bảo trì skill cần "taste" và quan sát

- Phải giỏi làm **"backseat driver"** (người ngồi sau chỉ đường): như pair programming, xem đồng nghiệp code và hỏi "sao không làm thế này?".
- Giai đoạn đầu đừng làm người xem thụ động. Hãy **cầm lái**.
- Cách tìm chỗ agent hỏng: **mở tool call, đọc code agent viết, đọc hành vi và thinking block** → thấy nó fail ở đâu → viết skill cho chỗ đó.
- Verification skill cũng được kiểm bằng đúng vòng lặp này.

> [!note] 📝 So sánh dễ hiểu: bếp trưởng
> Kỹ sư giờ giống **head chef**: không tự nấu hết nữa. Có line cook, sous chef, nhiều trạm.
> Việc của mình là **thiết kế môi trường**: dựng bếp, giao việc cho từng người.

---

## ✅ Checklist
- [ ] Đọc tool call + thinking block của agent, ghi lại các kiểu lỗi lặp lại
- [ ] Mỗi kiểu lỗi lặp → một skill
- [ ] Viết rubric cho skill, chạy eval bằng sub agent (không để chúng biết đang bị test)
- [ ] Dùng judge agent khác model để chấm chéo
- [ ] Chạy lại eval mỗi lần sửa skill
