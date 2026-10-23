---
tags: [ai, ai-coding, architecture, ci, lint, guardrail]
source: https://www.youtube.com/watch?v=EWSUvEyFwjc
timestamp: "37:42–47:43"
---

# 06 · Các lớp enforcement — Hard constraint thắng soft rule

← [[05 - Có nên rewrite - Greenfield và organic architecture]] · Tiếp → [[07 - Q&A - Token, ROI và team product]]

> [!quote] 💬
> "The shortest path is the best path." — Đường ngắn nhất là đường tốt nhất. (43:34)

> [!note] 📝 Về tên riêng trong phụ đề
> Phụ đề tự động ghi tên app lúc là "Grockbot", "graphbot", "Rockbot", "grabbot" — đều là cùng một app, ghi chép này dùng "Grockbot" nhưng không chắc đúng chính tả. "bug bots", "bug bar", "bogbot" trong phụ đề là **Bugbot** (tool review code của Cursor).

---

## ❓ Câu hỏi của host: CI trông thế nào, chặt đến đâu? (37:42)

- Host hỏi tiếp sau phần PR size: không cần share màn hình CI, chỉ cần mô tả chung CI trông ra sao và **chặt cỡ nào**.
- Lauren trả lời riêng cho Grockbot.

---

## 🏜️ Dune là gì (37:55)

- **Dune** là code name "hơi nghịch" (cheeky) cho kiến trúc team dựng cho Grockbot.
- Mental model: có thể coi Dune như **"Next.js cho Electron app"**, được thiết kế **để agent viết**, may riêng cho các app chạy bằng agent của họ.
- Vì vậy các CI check cũng rất đặc thù cho framework này.

---

## 🚫 CI cấm mọi thứ agent hay làm sai (38:05)

Lauren: CI "trông khá phiền vì có check cho mọi thứ".

### 1. Cấm `useEffect` (38:10)
- Ai từng viết React đều biết một trong những "foot gun" (bẫy tự bắn vào chân) lớn nhất của React là `useEffect`.
- Trong Dune và Grockbot, `useEffect` **bị cấm**: dùng là CI fail và "la vào mặt bạn" (yell at you).

### 2. Cấm code comment (38:54)
- Lauren tự nhận đây là luật "nhiều người sẽ nhướn mày".
- Lý do: 99% thời gian agent viết comment mô tả **chuyện lịch sử** hoàn toàn không liên quan tới code.
- Ví dụ: agent hay ghi kiểu "Lauren nói không bao giờ được làm thế này" vào comment. Lauren phản ứng: "Cái gì? Tại sao?" — cô không nói câu đó như một **luật chung lâu dài**, cô chỉ muốn nói "PR này dở, sửa phần đó đi".
- Rút ra: agent **hiểu con người kém đến bất ngờ**, hoặc **đoán quá nhiều**, rồi làm theo những cách rất ngớ ngẩn.

### 3. Nguyên tắc chung (39:39)
> [!quote] 💬
> "Everything you can imagine like the agents are bad at, we ban." — Thứ gì agent làm dở thì cấm hết. (39:39)

### 4. Ví dụ đau thật: Agents window của Cursor và chuyện chặn import main/renderer (39:49)

Chuỗi lập luận Lauren kể:
1. Ai dùng Agents window chắc đã thấy **vấn đề performance**; team liên tục sửa nhưng là "cuộc chiến không hồi kết".
2. Vì có **rất nhiều PR được merge**, PR nào cũng có thể làm tụt performance, độ ổn định (stability) hay độ tin cậy (reliability).
3. Agents window **chưa có kiến trúc kiểu Dune**. Lauren định mang bài học này về và refactor lại mọi thứ ở đó.
4. Một nguyên nhân cụ thể: **tách process rất kém**. Trong Electron có **renderer thread** vẽ UI và **main thread** chạy code khác không cần chặn renderer. Team tách hai thứ này không tốt, nên code hay **vô tình bị kéo sang chạy trên renderer thread**.
5. Khi đó code tranh chỗ với renderer. Muốn **60 fps** thì mỗi frame phải vẽ xong trong **16 ms** — deadline rất nhỏ nếu muốn sản phẩm mượt.
6. Lỡ kéo vào code **nặng tính toán** hoặc **nhiều IO** → giật (jank), FPS tụt, mất frame, xuất hiện **long task > 16 ms** → trải nghiệm rất khựng.

Cách Dune xử lý:
- Mọi pattern học được khi xây Electron app được **mã hoá vào framework** và trở thành **hard failure**.
- Grockbot có hẳn hai thư mục `electron main` và `electron renderer`, kèm một **CI check về import** kiểm tra **dependency graph** để không ai lỡ import code từ thư mục này sang thư mục kia. (41:37)
- Luật này được enforce ở **nhiều nơi cùng lúc**: CI, **Bugbot** (tool review code của Cursor chạy trên CI), và trong `AGENTS.md` — "nó ở khắp nơi". (41:54)

---

## 🧱 Lớp mạnh nhất: codebase theo convention (42:13)

- Lauren mở một slide về **nhiều lớp (layers) để xây codebase tốt**.
- Lớp đầu là **chính codebase**: nếu kiến trúc cực chặt và cách làm tính năng **rất theo khuôn**, đó là mức enforce **mạnh nhất**, **vì agent rất thích copy pattern có sẵn**.
- Ví dụ trong Grockbot: framework có các khái niệm như **feature**, **entry point**, **transcript card** (các card thấy trong chat) — Lauren gọi chúng là các "danh từ" của framework. Mỗi loại có **một cách tạo chuẩn**.
- **Một feature nằm gọn trong một thư mục**: mọi code góp vào feature đó ở cùng chỗ (colocated). Nhờ vậy agent **không phải grep lung tung** để tìm các mảnh; nó chỉ cần nghĩ "mình đang làm onboarding feature, làm trong thư mục này". Khoảng **80% công việc** gói gọn trong đó. (43:07)
- Framework được thiết kế cho **"agent ngu nhất"** (dumbest agent): không cần phải nghĩ.

> [!tip] 💡 Nguyên tắc chính của Dune (43:34)
> **Đường ngắn nhất là đường tốt nhất.** Lý do: agent thích đi tắt, luôn tìm cách nhanh nhất để giải vấn đề → vậy thì **biến cách nhanh nhất thành cách tốt nhất**.

- Lauren nói sẽ không đi vào hết chi tiết. Dune thực chất là **tập hợp ý tưởng và nguyên tắc**, không phải thứ sẽ open source. Người xem có thể chụp lại slide rồi bảo agent dựng thứ tương tự. (43:55)

---

## 🧅 Các lớp enforcement: cứng vs mềm (44:12)

Lauren tóm lại các lớp trên slide (người xem video không thấy rõ slide, nên thứ tự đánh số dưới đây là **suy từ lời nói**, không chắc khớp 100% với slide):

| Lớp (theo thứ tự cô nhắc) | Ví dụ cô nêu | Loại |
|---|---|---|
| Codebase | Feature theo thư mục, chặn import dependency không được import | **Cứng** |
| Static analysis | CI check, nhiều lint cho các pattern xấu đã quan sát được, compiler diagnostic | **Cứng** |
| Rules, Bugbot, skills (và style guide) | — | **Mềm** |

- Nguyên văn: "three four five are more soft, these two actually make CI red" (44:43). Tức là các mục 3, 4, 5 trên slide là **mềm**, còn "hai cái này" mới **làm CI đỏ**. Từ ngữ cảnh có vẻ "hai cái này" là codebase và static analysis, nhưng cô không nói rõ tên; mục 3–5 nhiều khả năng là rules, Bugbot, skills (cô liệt kê ba thứ này ngay sau đó).
- Lớp cứng = **ràng buộc cứng**: agent không thể cứ thế viết code tồi.
- Với rules, skills, Bugbot: agent **vẫn có thể quên**, hoặc **không áp dụng nhất quán**.

> [!warning] ⚠️ Đừng dựa vào lớp mềm (45:04)
> Lauren vẫn **xếp chồng** các lớp mềm lên, nhưng **không dựa vào chúng làm nguồn enforce duy nhất** vì chúng "rất rất mềm".
> Nếu chỉ có rules, Bugbot, skills và style guide → "chỉ là chuyện thời gian trước khi codebase trông như rác hoàn toàn" ("I'm sorry to say that").
> Lời khuyên: **đầu tư vào những thứ có thể enforce cứng**.

---

## 🦀 Chọn tech stack cũng là chọn guardrail (45:36)

- Vì lý do trên, **lựa chọn tech stack cũng rất quan trọng**.
- Ví dụ: Rust đang nổi trở lại, **vì compiler rất chặt**, enforce rất nhiều thứ; có **borrow checker** phải "chiều lòng".
- Miễn là đảm bảo agent **không viết block `unsafe`**, thì có thể **tương đối** yên tâm: code compile được thì "chắc là chạy được và ổn" (cô dùng chữ "probably", "more or less", không khẳng định chắc chắn).
- Điều đó cho người kỹ sư **mức tin tưởng để không cần tự đi kiểm nữa**: dựa vào code và static analysis để mọi thứ trơn tru hơn. (46:07)

---

## 🚨 Chỗ tệ nhất: kẹt ở "code review land" (46:21)

> [!danger] ⛔ Code smell của quy trình
> Chỗ tệ nhất là khi bạn enforce mọi ràng buộc, mọi **invariant** của codebase bằng cách **một người đọc code rồi nói "đừng làm thế này"**.
> Mỗi lần phải làm vậy, coi đó là **code smell / anti-pattern**, và thay vì comment lên PR, tự hỏi:
> 1. Biến cái này thành **luật cứng** (hard rule) thế nào?
> 2. Thành **lint rule** thế nào?
> 3. Thành **CI failure** thế nào?
> 4. Hay **loại bỏ tận gốc cả nhóm vấn đề** này?

- Lauren nói có thể kể thêm về **một cuộc migration khác** cô đã làm, nhưng **dừng ở đây** — câu chuyện đó không được kể trong đoạn này. (47:02)

---

## 🙋 Host thú nhận và chuyển sang Q&A (47:09)

- Host: mình đang **đúng ở chỗ Lauren vừa tả** — chưa có các luật đó, nên sau buổi này có việc phải làm để **scale agent**.
- Host đang ở giai đoạn **vài agent song song ở local, khoảng 2–3**, và đoán **đa số người nghe cũng vậy**.
- Host nói chỉ còn vài phút, hỏi Lauren có muốn nhấn mạnh gì thêm không (còn nhiều câu hỏi). Lauren: "mình nói nhiều quá rồi" (yapping), chuyển sang hỏi đáp luôn. (47:28)

---

## ✅ Checklist
- [ ] Liệt kê các lỗi agent hay mắc trong repo → mỗi lỗi một lint/CI check làm CI đỏ
- [ ] Cân nhắc cấm comment do agent viết nếu chúng toàn ghi chuyện lịch sử hoặc biến góp ý một lần thành "luật"
- [ ] Gom code của một feature vào một thư mục, có một cách chuẩn để tạo mỗi loại "danh từ"
- [ ] Làm cho cách nhanh nhất cũng là cách đúng nhất
- [ ] Chặn import sai tầng bằng check dependency graph trên CI
- [ ] Mỗi lần comment review "đừng làm X" → hỏi: biến X thành luật cứng / lint / CI failure, hay loại bỏ hẳn được không?
- [ ] Rule/skill/Bugbot/`AGENTS.md` chỉ là lớp phụ, không phải lớp duy nhất
- [ ] Khi chọn tech stack, tính cả độ chặt của compiler như một guardrail
