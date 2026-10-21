---
tags: [ai, ai-coding, agent, trust]
source: https://www.youtube.com/watch?v=EWSUvEyFwjc
timestamp: "00:00–05:53"
---

# 01 · Trust curve — Từ micromanage tới auto-merge

← [[AI/Trust ladder cho AI agent - Lauren Tan (Cursor)/00 - README|README]] · Tiếp → [[02 - Verification skill và Feature map]]

> [!quote] 💬 Mở đầu video
> AI dùng tốt nhất là như **người pair programming cùng mình**, không phải công cụ thay việc viết code, càng không phải chỗ để **outsource việc suy nghĩ**.

---

## 🎯 Áp lực "phải dùng AI cho thật nhiều"

- AI đang hot nên ai cũng muốn nhét AI vào mọi chỗ để tỏ ra bắt kịp.
- Áp lực kiểu: tuần này phải ship 100 PR, hiểu code chẳng bao nhiêu, "vibe code tới 1 triệu ARR".
- Trải nghiệm thật của Lauren: dùng AI **tiết kiệm thời gian viết code**, nhưng **tốn thêm thời gian review và sửa** cái AI làm.
- Đã thử cách nhiều người khuyên: bắt AI viết spec trước, review spec, rồi mới build. Vẫn chưa giải quyết gốc vấn đề.

---

## 🧭 Vấn đề gốc: làm sao TIN được agent?

- Kỹ sư code lâu năm có nhiều quan điểm và bài học về "engineering tốt".
- Agent thì đoán mò, hallucinate, tự tin tuyên bố đã tìm ra "smoking gun" (thủ phạm) lần thứ 100, nhưng sai.
- Mỗi lần như vậy là **mất niềm tin**. Không tin agent thì **không khai thác hết được nó**.

> [!note] 📝 So sánh dễ hiểu: làm quản lý
> Engineering manager không tin team → rơi vào **micromanagement**: lúc nào cũng nhìn qua vai nhân viên, soi xem có ship bug lên production không.
> Với agent cũng vậy: không tin thì phải ngồi canh từng output.

---

## 📈 Biểu đồ "trust curve" của Lauren

Lauren tự vẽ (nói rõ là "không khoa học lắm") để mô tả hành trình của mình:

| Giai đoạn | Mức tin | Cách làm việc |
|---|---|---|
| Khoảng 1 năm trước | Thấp | Ngồi trong vòng lặp (in the loop) với 1 vài agent, xem từng output, tự prompt liên tục. **Không song song hoá được** |
| 5 tháng gần đây | Tăng dần | Leo dần lên đường cong nhờ verification + skill + guardrail (các file sau) |
| Hiện tại | Cao | Agent **tự merge PR**. Sáng dậy thấy ~20 PR đã land, review lại trên `main`, và chúng ổn |

> [!warning] ⚠️ Logic cốt lõi
> Không thể spawn 100 agent khi còn chưa tin output của **1** agent.

---

## 📊 Số liệu Lauren chia sẻ (tại Cursor)

- Vào Cursor 5 tháng trước. Tháng đầu năng suất thấp vì đang học codebase.
- Càng tin agent, số PR càng tăng — đường cong contribution khớp với đường cong niềm tin.
- Tháng trước: **~1.000 PR**. Tháng này mới ngày 12 đã **gần 800 PR** landed.
- Lauren thừa nhận câu hỏi "bao nhiêu trong số đó là code tốt" là chính đáng. Câu trả lời của bà: setup agent đúng cách thì đạt được mức tương tự.

---

## ✅ Checklist
- [ ] Tự hỏi: mình đang ở đâu trên trust curve? (canh từng output hay để agent tự chạy)
- [ ] Đo xem AI đang tiết kiệm thời gian viết hay chỉ dời thời gian sang review/sửa
- [ ] Chưa tin 1 agent thì chưa tăng số agent song song
