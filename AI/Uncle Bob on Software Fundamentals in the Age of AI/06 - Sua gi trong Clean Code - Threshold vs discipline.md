---
tags:
  - ai
  - ai-coding
  - clean-code
  - tdd
timestamp: 31:21 - 35:35
---

# 06 — Sửa gì trong Clean Code: Threshold vs discipline

`[31:21 – 35:35]` · [[00 - README|← Mục lục]] · [[07 - Chong spec-driven - Cost of change ve gan 0|Tiếp →]]

---

## Câu hỏi khó nhất buổi

Matt hỏi thẳng, và tự thừa nhận là câu hỏi nặng `[31:21–32:28]`:

> "Is there in your book anything that you would **change or update** now? Specifically I'm thinking about some advice like **'create small functions'**... Is there anything that we need to **throw out** that's just done? **I don't like asking this question because it puts a lot of pressure on you**, but do you have an answer for that one?"

**Dịch:** *"Trong sách của ông có thứ gì ông sẽ **thay đổi hoặc cập nhật** bây giờ không? Cụ thể tôi đang nghĩ tới lời khuyên kiểu **'viết function nhỏ'**... Có thứ gì cần **vứt đi** vì đã xong đời không? **Tôi không thích hỏi câu này vì nó tạo nhiều áp lực cho ông**, nhưng ông có câu trả lời không?"*

Câu trả lời của Uncle Bob chia làm **hai loại rất rõ ràng**, và đây là đóng góp trí tuệ lớn nhất của cả buổi.

---

## Loại 1: THRESHOLD — nới được `[32:28–33:53]`

> "**Thresholds**, for one thing. It seems to me that the agents can deal with **different levels of complexity** than humans. They have a much better short-term memory — I mean, **a huge short-term memory and a perfectly accurate short-term memory.**"

**Dịch:** *"**Ngưỡng**, là một thứ. Tôi thấy agent xử lý được **mức độ phức tạp khác** với con người. Chúng có bộ nhớ ngắn hạn tốt hơn nhiều — ý tôi là **bộ nhớ ngắn hạn khổng lồ và chính xác tuyệt đối.**"*

Con số cụ thể:

> "One of the things that I do is **I widen the allowed size of a function** and I do that by adjusting the **CRAP score**. So **for a human I would keep CRAP numbers below four**, right? **But for the agents I've set this at six** and I'm thinking maybe I'll **push it to eight**. I'm trying to find where the threshold is and **it's not an easy threshold to find.**"

**Dịch:** *"Một trong những thứ tôi làm là **nới rộng kích thước function cho phép**, và tôi làm điều đó bằng cách chỉnh **CRAP score**. Với **con người tôi giữ CRAP dưới 4**. **Nhưng với agent tôi đặt là 6** và tôi đang nghĩ có khi **đẩy lên 8**. Tôi đang tìm xem ngưỡng nằm ở đâu và **không dễ tìm.**"*

Matt hỏi lại con số đó nghĩa là gì trong thực tế, và câu trả lời làm rõ CRAP score:

> "It really boils down to the **cyclomatic complexity, which is the number of pathways through the function**. And if you've got **100% coverage** then a CRAP score of six means that there are **six pathways through the function. They're all covered with tests.** So that's really the goal of CRAP: **get it all covered with tests and then limit the cyclomatic complexity.**"

**Dịch:** *"Nó quy về **cyclomatic complexity, tức số đường đi xuyên qua function**. Và nếu bạn có **100% coverage** thì CRAP score bằng 6 nghĩa là có **6 đường đi qua function, và tất cả đều được test phủ.** Nên mục tiêu thật sự của CRAP là: **phủ hết bằng test rồi giới hạn cyclomatic complexity.**"*

Và một câu ngoài lề rất đáng nhớ `[33:31]`:

> "I've had a number of debates with the agents — and by the way, **you can't trust any debate you have with an agent** — but I still have them anyway. And they seem to think that, oh yeah, six is probably pretty good. Well, **you don't really trust them**, but okay."

**Dịch:** *"Tôi đã tranh luận với agent vài lần — và nhân tiện, **bạn không thể tin bất cứ cuộc tranh luận nào với agent** — nhưng tôi vẫn cứ tranh luận. Và chúng có vẻ nghĩ rằng, ừ, 6 chắc là ổn. Ừ thì, **bạn đâu có thực sự tin chúng**, nhưng thôi được."*

> 💡 **Ý là:** Câu này nhỏ nhưng rất giá trị: **đừng dùng agent làm trọng tài cho quyết định thiết kế của chính nó.** Agent sẽ đồng ý với con số bạn đưa ra vì nó thiên về đồng thuận. Đây là lý do phải có deterministic tool — tool không nịnh.

---

## Loại 2: DISCIPLINE — không ép được `[33:53–35:15]`

Đây là phần gây bất ngờ nhất: **tác giả truyền đạo TDD từ chối bắt agent làm TDD.**

> "In my books, I talk about **disciplines**. One of them was test-driven development. **I'm a big advocate of test-driven development. But that's a human discipline that's done because humans are wired a certain way. I cannot and will not enforce that on the agents.**"

**Dịch:** *"Trong sách tôi nói về **các kỷ luật**. Một trong số đó là test-driven development. **Tôi là người cổ vũ mạnh cho TDD. Nhưng đó là một kỷ luật của con người, tồn tại vì con người được đấu dây theo một kiểu nhất định. Tôi không thể và sẽ không áp nó lên agent.**"*

Lý do:

> "**I don't think it makes any sense to make an agent write a single line of a test and then write a single line of the production code and then the next line of the test.** I don't think that makes any sense. **For a human, it does.**"

**Dịch:** *"**Tôi không nghĩ có nghĩa lý gì khi bắt agent viết một dòng test rồi một dòng production code rồi dòng test tiếp theo.** Tôi không nghĩ điều đó có nghĩa lý gì. **Với con người thì có.**"*

Ông để agent làm theo kiểu Ousterhout:

> "So I **allow the agents to behave more like John Ousterhout would** — which is to **write a function and then write the test for that function**, and then write the next function and write the test for that function. I allow them to do that **even when I have told them to do test-driven development at high discipline. They always fall back on doing that. They always end up doing that.** So I figure that's probably okay."

**Dịch:** *"Nên tôi **cho agent hành xử giống John Ousterhout hơn** — tức là **viết một function rồi viết test cho function đó**, rồi viết function tiếp theo và test cho nó. Tôi cho phép chúng làm vậy **ngay cả khi tôi đã bảo chúng làm TDD với kỷ luật cao. Chúng luôn quay về làm kiểu đó. Chúng luôn kết thúc bằng cách đó.** Nên tôi cho là chắc ổn thôi."*

> 💡 **Ý là:** Chú ý chi tiết ẩn ở đây — đây là một **ví dụ sống của "rule là guideline"** ở [[03 - Steering thua deterministic tools - Lost in the middle]]. Ông ra lệnh làm TDD, agent vẫn không làm. Thay vì nhồi thêm rule, ông **chấp nhận thực tế và kiểm chứng bằng tool** (mutation testing kiểm tra kết quả cuối, không quan tâm quá trình).

---

## Câu chốt: nguyên tắc phân loại `[35:04–35:15]`

Đây là câu đáng ghi nhớ nhất trong toàn bộ video:

> "So the bottom line there is: **it's probably a mistake to impose a human discipline on an agent. It is not a mistake to impose human values on the agent** — but there may be **thresholds that we need to change**. But **the disciplines themselves, the behaviors, I don't think it's wise to impose those.**"

**Dịch:** *"Nên chốt lại là: **áp một kỷ luật của con người lên agent có lẽ là sai lầm. Áp các giá trị của con người lên agent thì không sai** — nhưng có thể có **những ngưỡng ta cần thay đổi**. Còn **bản thân các kỷ luật, các hành vi, tôi không nghĩ áp chúng lên là khôn ngoan.**"*

Matt gọi đó là "a lovely way of phrasing it", và giải thích tiếp vì sao TDD là kỷ luật của người:

> "TDD is great when you have **very low short-term memory, like humans**. You have enough short-term memory to write the test and then enough short-term memory, just enough, to make the test pass. **You can go out and get a coffee** or something."

**Dịch:** *"TDD tuyệt vời khi bạn có **bộ nhớ ngắn hạn rất thấp, như con người**. Bạn có đủ bộ nhớ ngắn hạn để viết test, rồi vừa đủ để làm test pass. **Bạn có thể ra ngoài lấy cà phê** rồi quay lại."*

---

## Bảng phân loại: giá trị / ngưỡng / kỷ luật

Áp dụng công thức của Uncle Bob vào các nguyên tắc quen thuộc:

| Nguyên tắc | Loại | Với agent |
|---|---|---|
| Code phải test được, test phải bắt được lỗi | **Giá trị** | Giữ nguyên, cưỡng chế bằng mutation testing |
| Module phải có ranh giới rõ | **Giá trị** | Giữ nguyên, cưỡng chế bằng dependency checker |
| Đặt tên phải nói đúng sự thật | **Giá trị** | Giữ nguyên, quan trọng hơn trước ([[05 - Module structure va deep modules]]) |
| Function ≤ 20 dòng / CRAP < 4 | **Ngưỡng** | **Nới** — CRAP 6, đang thử 8 |
| "Giữ 7±2 thứ trong đầu" | **Ngưỡng** | Nới rất nhiều — short-term memory của agent lớn và chính xác |
| Red-green-refactor từng dòng (TDD) | **Kỷ luật** | **Bỏ** — kiểm chứng kết quả thay vì ép quá trình |
| Pair programming, code review từng dòng | **Kỷ luật** | Bỏ / thay bằng cleaner + reviewer agent |
| Commit nhỏ, thường xuyên | **Kỷ luật** | Bỏ với agent, giữ cho ranh giới người review |

> 💡 **Ý là:** Cách phân loại này là công cụ tư duy dùng lại được, không chỉ cho video này. Mỗi khi định viết một rule vào CLAUDE.md, hỏi ba câu:
>
> 1. Đây là **giá trị** (kết quả mong muốn) hay **kỷ luật** (cách thức đạt tới)?
> 2. Nếu là giá trị → **có tool nào kiểm chứng được không?** (nếu có, dùng tool, đừng viết rule)
> 3. Nếu là kỷ luật → **nó tồn tại vì giới hạn nào của con người?** Agent có giới hạn đó không? Nếu không → **bỏ**.

---

## Áp vào công việc hằng ngày

Rà lại CLAUDE.md / AGENTS.md hiện tại theo bảng trên. Ví dụ thường gặp trong dự án JS/Firebase:

| Rule đang viết | Phân loại | Nên làm gì |
|---|---|---|
| "Viết test trước khi viết code" | Kỷ luật | Bỏ. Thay bằng coverage/mutation check ở cuối |
| "Mọi Cloud Function phải có error handling" | Giá trị | Giữ, nhưng chuyển thành test/lint rule |
| "Giữ function dưới 30 dòng" | Ngưỡng | Nới, và đo bằng complexity thay vì đếm dòng |
| "Đừng dùng `any`" | (không áp dụng — dự án dùng JS thuần) | — |
| "Commit sau mỗi thay đổi nhỏ" | Kỷ luật | Bỏ với agent |

---

## Ý cần nhớ

- **Giá trị thì giữ, ngưỡng thì nới, kỷ luật thì bỏ.** Công thức gọn nhất của cả buổi.
- CRAP score: **4 cho người, 6 cho agent**, đang thử 8. Con số này là **cyclomatic complexity khi coverage = 100%**.
- Tác giả TDD **không bắt agent làm TDD** — vì TDD là cách bù cho bộ nhớ ngắn hạn kém của người.
- **Đừng dùng agent làm trọng tài** cho quyết định thiết kế của chính nó.
- Trước khi thêm rule vào CLAUDE.md: nó là giá trị hay kỷ luật? có tool kiểm được không?

---

[[00 - README|← Mục lục]] · [[07 - Chong spec-driven - Cost of change ve gan 0|Tiếp: Chống spec-driven →]]
