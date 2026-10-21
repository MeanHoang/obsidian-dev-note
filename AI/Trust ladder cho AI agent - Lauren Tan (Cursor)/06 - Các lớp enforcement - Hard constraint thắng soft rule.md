---
tags: [ai, ai-coding, architecture, ci, lint, guardrail]
source: https://www.youtube.com/watch?v=EWSUvEyFwjc
timestamp: "35:21–47:02"
---

# 06 · Các lớp enforcement — Hard constraint thắng soft rule

← [[05 - Có nên rewrite - Greenfield và organic architecture]] · Tiếp → [[07 - Q&A - Token, ROI và team product]]

> [!quote] 💬
> Đường ngắn nhất phải là đường đúng nhất.

---

## 🏜️ Dune là gì

- Code name cho kiến trúc của Grockbot.
- Mental model: **"giống Next.js nhưng cho Electron app"**, thiết kế **để agent viết**, may riêng cho các app chạy bằng agent.
- Lauren nói nó là **tập hợp ý tưởng và nguyên tắc**, không định open source. Có thể chụp lại slide và bảo agent dựng thứ tương tự.

---

## 🚫 CI cấm mọi thứ agent hay làm sai

"CI trông rất phiền vì có check cho mọi thứ." Ví dụ Lauren nêu:

| Luật | Lý do Lauren đưa ra |
|---|---|
| **Cấm `useEffect`** (React) | Một trong những "foot gun" (cái bẫy tự bắn vào chân) lớn nhất của React. Dùng là CI fail |
| **Cấm code comment** | 99% comment agent viết mô tả chuyện lịch sử không liên quan tới code. Ví dụ agent ghi "Lauren nói không bao giờ được làm thế này" vào comment, trong khi đó chỉ là góp ý cho PR đó, không phải luật chung |
| **Chặn import chéo `electron main` ↔ `electron renderer`** | Có 2 thư mục riêng; CI kiểm **dependency graph** để không lỡ import code từ thư mục này sang thư mục kia |

> [!note] 📝 Vì sao cần chặn import main/renderer
> Electron có **renderer thread** vẽ UI và **main thread** chạy code khác không cần chặn renderer.
> Muốn 60 fps thì mỗi frame phải xong trong **16 ms**. Lỡ kéo code nặng tính toán hoặc nhiều IO vào renderer → "long task" > 16 ms → rớt frame, giật.
> Agents window của Cursor đang bị đúng chuyện này: tách process kém, PR merge nhiều, PR nào cũng có thể làm tụt performance, ổn định, độ tin cậy. Lauren định mang bài học Dune về đó.

- Nguyên tắc chung: **thứ gì agent làm dở là cấm**. Theo Lauren, agent hiểu con người kém đến ngạc nhiên, hay đoán quá đà và làm theo cách ngớ ngẩn.
- Luật được enforce ở nhiều chỗ: CI, **Bugbot** (tool review code của Cursor chạy trên CI), `AGENTS.md`.

---

## 🧱 Codebase theo convention: agent thích copy pattern

- Lớp enforcement **mạnh nhất**: kiến trúc cực chặt, cách làm tính năng **rất theo khuôn**, vì **agent rất thích copy pattern có sẵn**.
- Grockbot có các "danh từ" của framework: **feature**, **entry point**, **transcript card** (các card trong chat). Mỗi loại có một cách tạo chuẩn.
- **Feature nằm gọn trong 1 thư mục**: mọi code góp vào feature đó ở cùng một chỗ (colocated). Agent làm "onboarding feature" thì chỉ cần làm trong thư mục đó. ~80% việc gói gọn trong đó.
- Thiết kế cho **agent "kém nhất"**: không cần nghĩ.

> [!tip] 💡 Nguyên tắc chính của Dune
> **Đường ngắn nhất là đường tốt nhất.** Agent luôn tìm cách nhanh nhất để giải → vậy thì biến cách nhanh nhất thành cách đúng.

---

## 🧅 Các lớp enforcement: cứng vs mềm

| Lớp | Ví dụ trong video | Loại |
|---|---|---|
| Codebase / kiến trúc | Feature theo thư mục, chặn import sai, convention | **Cứng**, mạnh nhất |
| Static analysis | CI check, lint cho các pattern xấu đã thấy, compiler diagnostic | **Cứng**: làm CI đỏ |
| Rules, Bugbot, skills, style guide | `AGENTS.md`, rule, skill | **Mềm**: agent vẫn có thể quên hoặc áp dụng không đều |

> [!warning] ⚠️
> Lauren vẫn xếp các lớp mềm chồng lên, nhưng **không dựa vào chúng làm nguồn enforce duy nhất**. Chỉ có rule, Bugbot, skill, style guide → "chỉ là chuyện thời gian trước khi codebase thành rác".

---

## 🦀 Chọn tech stack cũng là chọn guardrail

- Ví dụ Rust đang hot trở lại vì **compiler rất chặt** (borrow checker).
- Miễn agent không viết `unsafe`, code compile được thì khá yên tâm là chạy được và ổn.
- Ý chính: để **code và static analysis** làm việc kiểm thay cho người.

---

## 🚨 Chỗ tệ nhất: kẹt ở "code review land"

> [!danger] ⛔ Code smell của quy trình
> Enforce ràng buộc (invariant) của codebase bằng cách **người đọc code rồi comment "đừng làm thế này"**.
> Mỗi lần phải comment như vậy, coi đó là anti-pattern và tự hỏi:
> 1. Biến cái này thành **luật cứng** được không?
> 2. Thành **lint rule**?
> 3. Thành **CI failure**?
> 4. Hay **loại bỏ hẳn cả nhóm vấn đề** này?

Người dẫn chương trình thú nhận mình đang ở đúng chỗ đó: chưa có các luật này, mới chạy 2–3 agent song song ở local, và đoán đa số người nghe cũng vậy.

---

## ✅ Checklist
- [ ] Liệt kê các lỗi agent hay mắc trong repo → mỗi lỗi một lint/CI check
- [ ] Cân nhắc cấm comment do agent viết nếu chúng toàn ghi chuyện lịch sử
- [ ] Gom code của một feature vào một thư mục
- [ ] Chặn import sai tầng bằng check dependency graph trên CI
- [ ] Mỗi lần comment review "đừng làm X" → hỏi: biến X thành luật cứng được không?
- [ ] Rule/skill/`AGENTS.md` chỉ là lớp phụ, không phải lớp duy nhất
