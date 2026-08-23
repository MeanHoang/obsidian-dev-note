---
tags:
  - ai
  - ai-coding
  - clean-code
timestamp: 10:20 - 12:20
---

# 02 — Vì sao "dog doo" giết agent

`[10:20 – 12:20]` · [[00 - README|← Mục lục]] · [[03 - Steering thua deterministic tools - Lost in the middle|Tiếp →]]

---

## Câu hỏi phản biện của Matt

Đoạn ngắn nhưng là **nền móng logic** của cả buổi. Matt đặt đúng câu hỏi mà người hoài nghi sẽ hỏi `[10:20–10:41]`:

> "Why is bad code bad? Like why do we care about that? **Because these things are so fast and they can move so quickly, why do we care? Why are we bothering with all of this harness? Can't we just push through until the bugs just disappear?**"

**Dịch:** *"Vì sao code tệ lại là tệ? Kiểu, sao ta phải quan tâm? **Mấy thứ này nhanh thế, di chuyển nhanh thế, sao ta phải quan tâm? Sao phải mất công với đống harness này? Không thể cứ cày tiếp cho tới khi bug tự biến mất à?**"*

> 💡 **Ý là:** Đây là lập luận "brute force" — nếu AI viết code nhanh vô hạn thì chất lượng code không còn quan trọng, cứ sửa tới khi hết bug. Nếu lập luận này đúng, toàn bộ *Clean Code* thành vô nghĩa trong kỷ nguyên AI. Nên câu trả lời bên dưới là bản lề.

---

## Câu trả lời: agent cũng thrash `[10:41–12:02]`

Uncle Bob không trả lời bằng lý thuyết, ông trả lời bằng thứ quan sát được:

> "I would have it do something and it would leave all this mess around and **instead of cleaning the mess, I would have it do the next thing** and it would leave even more mess around and then I would have it do the next thing. **And I noticed it slowing down** and I noticed it having difficulty."

**Dịch:** *"Tôi bảo nó làm một việc và nó để lại đống bừa bộn, và **thay vì dọn, tôi bảo nó làm việc tiếp theo** và nó để lại còn bừa hơn, rồi tôi lại bảo nó làm việc tiếp. **Và tôi thấy nó chậm lại** và tôi thấy nó gặp khó khăn."*

Mô tả chính xác cái vòng lặp chết:

> "It would get into a mode where it would **change one thing but inadvertently break another** and then it would have to fix that but inadvertently break another. **Started going around in circles.**"

**Dịch:** *"Nó rơi vào trạng thái **sửa một thứ nhưng vô tình làm hỏng thứ khác**, rồi phải sửa cái đó nhưng lại vô tình làm hỏng cái khác nữa. **Bắt đầu chạy vòng tròn.**"*

> 💡 **Ý là:** Đây là hiện tượng ai dùng agent lâu cũng gặp: nó sửa test A → gãy test B → sửa B → gãy A. Điểm quan trọng là **nguyên nhân không phải model dốt**, mà là code không có ranh giới rõ ràng nên một thay đổi lan ra khắp nơi. Đây chính là định nghĩa cổ điển của **coupling cao**.

---

## Kết luận: cùng bệnh, khác ngưỡng `[11:22–12:02]`

> "Okay, these agents, they may be fast and they may be relatively smart, but **they are as subject as humans are to messy code.** Now maybe not as subject. **Maybe there's a difference in threshold, but the threshold is still there.** The code can get messy enough that the agents cannot deal with it any longer and then they'll just start to spin and make a mess even worse and be unable."

**Dịch:** *"Được rồi, mấy agent này có thể nhanh và tương đối thông minh, nhưng **chúng chịu ảnh hưởng của code bẩn y như con người.** Có lẽ không nhiều bằng. **Có thể ngưỡng khác nhau, nhưng cái ngưỡng vẫn ở đó.** Code có thể bẩn tới mức agent không xử lý nổi nữa, rồi nó bắt đầu quay vòng, làm mọi thứ bẩn hơn và bất lực."*

Và chi tiết buồn cười nhất buổi:

> "**I've actually had them just give up.** One agent one time said, 'I just can't deal with this anymore.' I'm paraphrasing it. It didn't use those words, but that was obviously what was going on."

**Dịch:** *"**Tôi từng gặp agent bỏ cuộc thật.** Có lần một agent nói: 'Tôi không xử lý nổi cái này nữa.' Tôi diễn đạt lại thôi. Nó không dùng đúng những từ đó, nhưng rõ ràng là đang xảy ra chuyện đó."*

---

## Vì sao "khác ngưỡng, cùng bệnh" là công thức quan trọng

Cụm **"difference in threshold, but the threshold is still there"** quay lại nhiều lần trong buổi và nó là cách Uncle Bob điều hoà hai thứ tưởng mâu thuẫn:

| Nếu chỉ nói... | Hệ quả sai |
|---|---|
| "AI khác hẳn người, luật cũ vứt đi" | Bỏ hết fundamentals → hit the wall |
| "AI y hệt người" | Ép TDD từng dòng, giữ function 20 dòng → phí năng lực agent |
| **"Cùng bệnh, khác ngưỡng"** | **Giữ nguyên tắc, chỉnh con số** |

Chính công thức này dẫn tới quyết định ở [[06 - Sua gi trong Clean Code - Threshold vs discipline]]: nới CRAP score từ 4 lên 6, nhưng **không** bỏ CRAP score.

---

## Đối chiếu với Matt Pocock

Matt gọi hiện tượng tương tự bằng thuật ngữ khác — **smart zone / dumb zone** (mượn từ Dex Horthy) — nhưng ông ấy quy nguyên nhân về **độ dài context window**, còn Uncle Bob quy về **độ bẩn của codebase**. Hai cái không loại trừ nhau: code bẩn → agent phải đọc nhiều file hơn để hiểu → context phình → vào dumb zone nhanh hơn.

Xem [[Workflow for AI Coding - Matt Pocock/02 - Hai ràng buộc của LLM - Smart zone và Memento]].

---

## Ý cần nhớ

- **Không cứu được bằng brute force.** Code bẩn làm agent thrash, và thrash không tự hết dù model nhanh cỡ nào.
- Dấu hiệu nhận biết: agent **sửa A gãy B, sửa B gãy A** — đó là coupling, không phải model kém.
- Công thức xuyên suốt: **cùng bệnh, khác ngưỡng** → giữ nguyên tắc, chỉnh con số.
- Với Joy Loyalty: nếu agent liên tục quay vòng trong một module, đó là tín hiệu **module đó cần tách**, không phải cần prompt dài hơn.

---

[[00 - README|← Mục lục]] · [[03 - Steering thua deterministic tools - Lost in the middle|Tiếp: Steering thua deterministic tools →]]
