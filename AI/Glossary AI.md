# Glossary AI

Thuật ngữ hay gặp khi đọc tài liệu AI / agent / LLM. Gặp từ bài [[Harness design cho app chạy dài (Anthropic)]].

---

## Coherence
**Nghĩa:** Sự mạch lạc / gắn kết — các phần ăn khớp thành một khối logic, nhất quán trước sau, không mâu thuẫn hay rời rạc. Adj: *coherent* ↔ *incoherent* (lộn xộn).

- Bài văn mạch lạc, người nói năng nhất quán → có coherence.
- Trong AI: *"model mất coherence"* = khi task dài, model quên tổng thể, code phần sau không khớp phần đầu.
- Liên quan: **cache coherence** (phần cứng — các bản copy dữ liệu phải nhất quán).

**Ví dụ:** "Task càng dài, model càng mất coherence."

---

## Iteration
**Nghĩa:** Một vòng lặp / một lần lặp — làm một việc nhiều lần, mỗi lần chỉnh dựa trên kết quả lần trước để tốt dần lên. Verb: *iterate*.

- Vẽ tranh qua nhiều vòng: phác thảo → thêm chi tiết → đổ bóng, mỗi lần là một iteration.
- Trong code: mỗi lần chạy qua body của `for`/`while`, hay duyệt phần tử với `.map()`/`.forEach()` ("iterate over an array").
- **Iterative development:** làm phần mềm chia nhỏ, cải tiến từng vòng.

**Ví dụ:** "The design improved with each iteration."

---

## Anxiety
**Nghĩa:** Sự lo âu, bồn chồn, thấp thỏm — cảm giác lo lắng về điều sắp xảy ra.

- Trong AI (bài harness của Anthropic): **"context anxiety"** = model *tưởng* mình sắp hết context window nên vội vàng kết luận "xong rồi" dù chưa xong.
- Đời thường: "test anxiety" (lo khi thi), "social anxiety" (lo âu khi giao tiếp).

**Ví dụ:** "The model exhibited context anxiety, ending its work prematurely."
