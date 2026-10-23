---
tags: [ai, ai-coding, agent, skill, eval]
source: https://www.youtube.com/watch?v=EWSUvEyFwjc
timestamp: "13:27–23:28"
---

# 03 · Pstack — Biến lỗi agent thành skill, kiểm skill bằng eval

← [[02 - Verification skill và Feature map]] · Tiếp → [[04 - Local trước, cloud sau - Agent Benny]]

> [!quote] 💬
> "Every time I saw that I just — okay, I'm just going to make that a skill." (16:47)
> (Mỗi lần thấy agent mắc một kiểu lỗi, tôi biến nó thành một skill.)

---

## 🔗 Nối từ phần trước (13:27)

- Kết của phần feature map: Pstack ship cả skill **tạo** verification skill (create verification skill) lẫn skill **bảo trì** nó (maintain verification skill), để feature map/verification skill luôn được cập nhật theo product.
- Host hỏi tiếp hai việc: Lauren đã làm ra cái đó thế nào, và Pstack là gì cho người chưa biết.

---

## 🥔 Pstack là gì (13:40)

- Lauren tự nhận cái tên "hơi ngớ ngẩn" (goofy): "P" = **potato** → potato stack.
- Nguồn gốc tên: **Gary Tan**, CEO Y Combinator, có plugin tên **GStack** (Gary Stack). Lauren và Gary **trùng họ Tan nhưng không có quan hệ họ hàng**. Lauren đặt tên Pstack để trêu Gary một chút: đây là phiên bản của riêng Lauren cho plugin kiểu đó.
- Khác biệt: Pstack được may theo **bộ thực hành engineering của riêng Lauren**. (Caption ghi "my own set of p engineering practices", chữ "p" không rõ nghĩa, có thể là lỗi caption.)
- Lauren **chưa bao giờ đặt mục tiêu làm Pstack** (14:27). Nó bắt đầu chỉ là một đống skill lẻ:
  - Đầu tiên là skill `control glass` (xem [[02 - Verification skill và Feature map]]).
  - Rồi một skill khác mà caption ghi là "how" (tên không chắc, caption có thể sai). Skill này Lauren cũng tìm ra nhờ **quan sát agent**.

---

## 🔍 Cách Lauren tìm ra skill cần viết: quan sát agent (14:40)

1. Giai đoạn đầu khi mới "leo thang" trust ladder, Lauren **ở trong vòng lặp rất sát** (super in the loop) và soi agent tới mức cực đoan (nitpick).
2. Lauren đưa bug report kiểu "tính năng này đã ngừng chạy, tại sao?" → agent thường **tự tin khẳng định** "chắc chắn là do cái này".
3. Mở **tool call** ra xem thì thấy agent **không hề đọc đoạn code mà Lauren nghĩ lẽ ra bị ảnh hưởng** → Lauren cực kỳ nghi ngờ.
4. Tới lúc đó Lauren nghĩ: không thể tin agent này nữa, vì nó **hoàn toàn đang hallucinate**.
5. Lauren nhận xét (15:20): rất dễ tích tụ sự mất niềm tin như vậy và **thấy bất lực**, vì không biết làm sao giúp agent làm đúng.

> [!note] 📝 So sánh dễ hiểu: nhân viên mới giỏi code, zero business context (15:30)
> Lauren cho rằng phép so sánh với **quản lý** rất hữu ích ở đây. Hãy tưởng tượng mình là manager một team engineering, vừa tuyển một kỹ sư **code rất giỏi** nhưng **không có chút business context nào**, mới onboard "5 giây trước". Làm sao dạy người đó làm việc hiệu quả?
> → Với agent, câu trả lời là **skill**. Skill "chỉ là markdown", nhưng nó mã hoá rất nhiều thông tin và hướng dẫn, và giúp "rút" được nhiều trí thông minh hơn từ agent.

> [!tip] 💡 Vì sao skill làm agent "thông minh hơn" (16:05)
> Một số người trên Twitter gọi là "kéo agent sang một **latent space** khác". Lauren giải thích đó chỉ là cách nói hoa mỹ: LLM dự đoán token kế tiếp, nên khi đưa vào **token chất lượng cao** ngay từ đầu, nó sẽ pattern-match ở một vùng "cao hơn", thông minh hơn. Lauren gọi đây là một mô hình tư duy thú vị.

**Pstack lớn lên từng chút một (16:30):**
- Lauren xây Pstack **rất tăng dần** (very incrementally): quan sát mọi **failure mode** của agent.
- Mỗi lần thấy một kiểu lỗi → biến nó thành một skill. Ví dụ nội dung các skill như vậy: *ngừng hallucinate, đi tìm và đọc code thật, dùng nhiều sub agent, ngừng đoán.*

---

## 🧪 Eval — unit test cho skill (16:58)

**Câu hỏi follow-up của host (gộp từ host và nhiều người trong chat), gồm hai phần:**
1. Bảo trì skill thế nào, khi product đổi theo thời gian và có rất nhiều người cùng ship vào codebase?
2. Làm sao biết verification đã **đủ tốt**, để tin được output của các verification loop khi chúng chạy xong?

Lauren nói hai câu này "có liên quan với nhau", và bắt đầu từ câu bảo trì skill.

**Eval là gì (17:35):**
- Mô hình tư duy của Lauren: eval giống như **unit test cho agent**.
- **Tự làm eval được**, không cần framework đặc biệt. Chặt chẽ, "khoa học" tới đâu là tuỳ mình muốn.

> [!note] 📝 Ngắt quãng ngoài lề (18:06)
> Giữa chừng màn hình Lauren bị phủ đỏ vì người xem vẽ lên màn hình chia sẻ. Host nhờ mọi người ngừng vẽ, có người hỏi đùa "Is that a troll?", host chỉ Lauren nút dropdown để xoá. Sau đó Lauren nói tiếp.

**Eval playbook trong Pstack (18:28):**
- Lauren nhắc lại: eval về cơ bản là cách **unit test skill**.
- Pstack ship một playbook tên **`eval playbook`** nằm trong "potato mode" (search là thấy). Lauren nói cách làm trong đó "khá chặt chẽ".

**Cách Lauren chạy eval:**
1. Agent điều phối chính (**coordinator**) soạn **rubric**: mình muốn skill làm được gì.
2. Coordinator spawn **nhiều sub agent**, tạo **thư mục riêng** cho từng con.
3. Thư mục được **đặt tên khéo để sub agent không biết mình đang bị đánh giá**, vì agent **có thể nhận ra** việc bị eval, và khi nhận ra thì **đổi hành vi**.
4. Playbook còn làm "một loạt việc tương tự như vậy" (Lauren không kể hết), tất cả để kiểm xem skill vừa viết/sửa có thật sự làm đúng điều mình nghĩ không.
5. (19:37) Điểm hay của Cursor: hỗ trợ **rất nhiều model**, nên có thể eval skill trên nhiều model khác nhau, xem skill chạy tốt thế nào trên cả "ma trận" model đó, **nhất là các model mình hay dùng**.

Lauren làm việc này thường xuyên: **mỗi lần sửa một skill** đều chạy eval playbook để chắc nó dẫn tới kết quả mình muốn.

---

## 🧑‍🍳 Bảo trì skill cần "taste" và quan sát (20:08)

- Lauren nói thẳng: **bảo trì skill khá khó**, cần nhiều **taste** (gu, khả năng đánh giá) và quan sát.
- Phải giỏi làm **"backseat driver"** (người ngồi ghế sau chỉ đường). Ví dụ pair programming: xem đồng nghiệp code và nghĩ "chắc mình làm cái này tốt hơn", hỏi rất nhiều câu kiểu "sao không làm thế này?".
- Với agent cũng vậy: **đừng làm người xem thụ động**. Ở giai đoạn đầu, khi đang dựng bộ skill của riêng mình, hãy **ngồi ghế lái**.
- Lauren nói "tất nhiên có thể dùng sẵn thứ như Pstack", nhưng nếu tự dựng bộ skill riêng thì cách tốt để thấy agent fail ở đâu là: **mở hết tool call, đọc code, đọc hành vi của agent và thinking block** của nó → thấy chỗ nó hỏng → viết skill cho chỗ đó.

---

## ⛰️ Tin verification thế nào: cùng vòng lặp + hill climb eval (21:00)

- Trả lời câu hỏi thứ hai (làm sao tin verification): theo Lauren cũng là **một vòng lặp iterate tương tự**. Lauren đã dùng đúng quy trình này để **kiểm chính verification skill**.
- Câu "where I actually get um…" bị **bỏ dở giữa chừng**, Lauren chuyển sang giải thích eval.
- (21:22) Một điểm thú vị của eval: có thể **hill climb** (leo dần điểm số):
  - Eval cho ra **điểm số**, có thể để coordinator chấm.
  - Thêm một **judge agent dùng model khác** để đối chiếu, đảm bảo model thứ nhất (model đang chấm tất cả sub agent chạy bài test) không bị thiên vị.
  - **Hill climb**: dùng `/loop` trong Cursor, bảo "cứ lặp eval này cho tới khi mọi thứ đạt 10/10" (Lauren nói đây chỉ là ví dụ).
- (22:00) Lauren dùng gần như đúng cách này với skill `control`: dựng cả CLI lẫn skill theo cách đó, và nói việc này **khá rảnh tay** (very hands-off). Theo thời gian skill đã **trở nên rất tốt**.
- Nhưng lúc đầu **chắc chắn không suôn sẻ**, cần lặp rất nhiều.

> [!note] 📝 So sánh dễ hiểu: bếp trưởng (22:25)
> Lauren nói sẽ dùng phép so sánh này ở một slide sau. Kỹ sư bây giờ giống một **manager**, hay theo cách Lauren thích hơn: **head chef** trong nhà hàng. Không còn tự nấu hết món nữa; có cả đội: line cook, sous chef, nhiều trạm khác nhau.
> Việc của head chef là **thiết kế môi trường**: dựng bếp, giao việc cho từng người. Lauren gọi đây là một cách làm việc rất thú vị.

Lauren chốt: đó về cơ bản là cách Lauren đã xây các verification skill.

> [!note] 📝 Chuyển sang phần sau (23:20)
> Host bắt đầu hỏi sâu hơn: muốn dựng eval/skill tự tốt lên thì làm trong worktree cô lập với sub agent + reviewer agent, hay trên môi trường cloud? Câu trả lời ở [[04 - Local trước, cloud sau - Agent Benny]].

---

## ✅ Checklist
- [ ] Đọc tool call + thinking block của agent, ghi lại các kiểu lỗi lặp lại
- [ ] Mỗi kiểu lỗi lặp → một skill
- [ ] Viết rubric cho skill, chạy eval bằng sub agent (không để chúng biết đang bị test)
- [ ] Chạy eval trên nhiều model, nhất là model mình hay dùng
- [ ] Dùng judge agent khác model để chấm chéo
- [ ] Chạy lại eval mỗi lần sửa skill
- [ ] Muốn skill tự tốt lên: lặp eval (`/loop`) tới khi đạt điểm mục tiêu, và chuẩn bị cho nhiều vòng lặp lúc đầu
