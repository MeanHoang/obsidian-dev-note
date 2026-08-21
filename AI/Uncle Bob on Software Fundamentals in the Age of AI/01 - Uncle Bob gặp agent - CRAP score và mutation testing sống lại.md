---
tags:
  - ai
  - ai-coding
  - testing
timestamp: 00:00 - 10:00
---

# 01 — Uncle Bob gặp agent: CRAP score và mutation testing sống lại

`[00:00 – 10:00]` · [[00 - README|← Mục lục]] · [[02 - Vì sao dog do giết agent|Tiếp →]]

---

## Bối cảnh nhân vật

Robert C. Martin, lập trình từ **1964**, lúc 12 tuổi, trên một máy tính mô hình mẹ mua tặng sinh nhật:

> "The program was a little model computer that my mother had bought me for my 12th birthday and programmed it by putting little white tubes on pegs. It was essentially a **three-bit finite state machine**, but it fascinated the hell out of me at the age of 12."

**Dịch:** *"Chương trình đó chạy trên một máy tính mô hình nhỏ mẹ mua cho tôi nhân sinh nhật 12 tuổi, lập trình bằng cách cắm các ống nhựa trắng lên chốt. Về bản chất nó là một **finite state machine 3 bit**, nhưng nó làm tôi mê mẩn ở tuổi 12."*

Chi tiết đắt: ông ấy đọc sách Fortran, COBOL, PL/1 nhưng **không có máy nào để chạy**, nên:

> "I wrote programs on paper and **executed them in my head**."

**Dịch:** *"Tôi viết chương trình ra giấy và **chạy chúng trong đầu**."*

> 💡 **Ý là:** Chi tiết này không phải kể chơi. Nó giải thích vì sao suốt buổi ông ấy nhấn mạnh "phải hiểu cái đang chạy bên dưới" — kỹ năng gốc của ông là *mô phỏng máy trong đầu*. Quay lại ở [[08 - Hoc strategic programming va vi sao fundamentals van dung]] khi ông bảo dev trẻ nên viết assembly một cuối tuần.

---

## Vì sao là "bathrobe" (áo choàng tắm)

Ngoài lề nhưng vui và giải thích nhân dạng meme của ông trên mạng `[00:42]`:

> "I was on my front porch in my bathrobe. It was 6:00 in the morning and I started thinking about **how awful SQL was** because of all the SQL injections and, you know, makes no sense to have a textual language as your database access for security reasons... I just pulled out my phone and I ranted and that became the **morning bathrobe rant**."

**Dịch:** *"Tôi đang ngồi ở hiên nhà trong áo choàng tắm. 6 giờ sáng và tôi bắt đầu nghĩ **SQL tệ đến thế nào** vì mấy vụ SQL injection — chẳng có lý do gì để dùng một ngôn ngữ dạng text làm cách truy cập database, xét về bảo mật... Tôi rút điện thoại ra và chửi, và thế là thành **morning bathrobe rant**."*

---

## Lần đầu dùng agent: tháng 12/2025 `[04:07–05:30]`

> "This took me a little by surprise around **December of last year, Christmas time**... I'd already been playing with ChatGPT and a little bit of Grok and a little bit of this and a little bit of that. And **I hadn't been real impressed.**"

**Dịch:** *"Chuyện này làm tôi hơi bất ngờ vào khoảng **tháng 12 năm ngoái, dịp Giáng sinh**... Tôi đã nghịch ChatGPT rồi, một chút Grok, một chút thứ này thứ kia. Và **tôi chẳng thấy ấn tượng gì mấy.**"*

Agent đầu tiên là một bản Grok đời đầu. Kết quả:

> "It did a kind of a poor job but it wrote the code... **I was cleaning up after it all the time.** It was always making a mess. Was always leaving little **dog doo** behind. And I thought, you know, it's interesting because it's fast, but **it's frustrating because it makes me slow.**"

**Dịch:** *"Nó làm khá tệ nhưng nó viết ra được code... **Tôi phải dọn dẹp sau nó suốt.** Nó liên tục bày bừa. Liên tục để lại **cứt chó**. Và tôi nghĩ, thú vị đấy vì nó nhanh, nhưng **bực mình vì nó làm tôi chậm đi.**"*

> 💡 **Ý là:** Câu "it's fast but it makes me slow" là hạt giống của toàn bộ workflow sau này. Vấn đề không phải agent chậm — mà là **con người trở thành nút thắt cổ chai** khi phải dọn sau nó. Hai hướng giải quyết: (a) làm agent bớt bừa, (b) rút người ra khỏi vòng lặp. Ông ấy chọn cả hai.

---

## Khoảnh khắc lật ngược: hai ý tưởng cũ bất khả thi `[05:30–08:35]`

Đây là phần hay nhất của đoạn đầu. Uncle Bob nhớ lại hai kỹ thuật ông thích từ **đầu những năm 2000** nhưng phải bỏ vì quá tốn công người.

### 1. CRAP score

**Đây là gì:** CRAP = *Change Risk Anti-Patterns*. Công thức trộn **test coverage** với **cyclomatic complexity** của từng function, ra một điểm số đo mức độ "crappy" (rác) của function đó.

> "You would run code coverage, test coverage over your code and you'd also measure the cyclomatic complexity of every function and you would mix those two in a complicated formula and out would come a score and **the score was a measure of how crappy your function was.**"

**Dịch:** *"Bạn chạy code coverage trên code của mình, đồng thời đo cyclomatic complexity của từng function, rồi trộn hai thứ đó bằng một công thức phức tạp, ra một điểm số — và **điểm đó đo function của bạn rác đến mức nào.**"*

Vì sao ngày đó bỏ:

> "There was a bunch of crappy functions, but then **it took me forever** to go through every one of those functions and try and fix them and rewrite the tests... So although it was interesting, **I kind of set it aside.**"

**Dịch:** *"Có cả đống function rác, nhưng **tôi mất cả đời** để đi qua từng cái, sửa nó, viết lại test... Nên dù thú vị, **tôi tạm gác nó sang một bên.**"*

### 2. Mutation testing

**Đây là gì:** một chương trình quét source code và **lật ngược các toán tử** — `+` thành `-`, `<` thành `>`, `==` thành `!=`. Với mỗi lần lật, nó chạy **toàn bộ test suite** và **kỳ vọng test phải fail**. Nếu test vẫn pass → có một "**surviving mutant**" (đột biến sống sót), nghĩa là test suite của bạn không thực sự kiểm tra logic đó.

> "For each of those flips, it runs your entire test suite and expects the test suite to fail because obviously they've changed something significant. And if it doesn't fail, well, **that's a surviving mutant and it must be killed.**"

**Dịch:** *"Với mỗi lần lật, nó chạy toàn bộ test suite và kỳ vọng test suite sẽ fail, vì rõ ràng có gì đó quan trọng vừa bị đổi. Và nếu không fail — **đó là một đột biến sống sót, và nó phải bị giết.**"*

Vì sao ngày đó bỏ:

> "I had to run it **overnight** because the test suite ran for four minutes and I was running it maybe several hundred times... Once again, **it was impractical.** I could not put that as part of a normal build scenario."

**Dịch:** *"Tôi phải chạy **qua đêm** vì test suite mất 4 phút và tôi chạy nó có khi vài trăm lần... Một lần nữa, **nó bất khả thi.** Tôi không thể đưa nó vào một build bình thường."*

> 💡 **Ý là:** Mutation testing trả lời câu hỏi mà coverage **không** trả lời được. Coverage 100% chỉ nói "dòng code này có được chạy", **không** nói "có test nào fail nếu dòng đó sai". Mutation testing đo đúng thứ đó. Đây là lý do nó nằm ở bước cuối trong gauntlet — xem [[04 - Gauntlet 5 agent - Specifier den QA]].

---

## Cú lật: agent làm được việc nhàm chán `[07:33–08:35]`

> "**These guys are fast and they don't care how boring the work is** and they will do what I tell them to do. So why don't you run CRAP over everything you've just done — and it would run CRAP and then it would clean up the code."

**Dịch:** *"**Mấy anh này nhanh và chẳng quan tâm công việc chán đến mức nào** và chúng làm đúng cái tôi bảo. Thế thì sao không chạy CRAP lên toàn bộ thứ vừa làm — và nó chạy CRAP rồi dọn code luôn."*

Mutation testing cũng vậy:

> "Maybe it took it **30 minutes instead of an overnight run** and then it would **plug all the holes** and make sure there were tests covering everything."

**Dịch:** *"Có khi nó mất **30 phút thay vì chạy qua đêm**, rồi nó **bịt hết các lỗ** và đảm bảo có test phủ mọi thứ."*

> 💡 **Ý là:** Đây là insight tổng quát nhất của cả buổi, và nó áp dụng được ngoài phạm vi hai tool này:
>
> **Rất nhiều kỹ thuật kỹ thuật phần mềm "đúng nhưng không ai làm" chỉ vì chi phí lao động người quá cao.** Khi lao động đó rẻ về gần 0, danh sách "ý tưởng hay nhưng bất khả thi" cần được **mở lại và duyệt lần nữa**.
>
> Ví dụ cho công việc hằng ngày: viết test cho mọi edge case của webhook Shopify, backfill test cho code cũ, viết migration script kèm rollback script, generate fixture data thật cho mọi shop plan — tất cả đều là "đúng nhưng lười".

---

## Nguyên tắc hiện tại `[08:35–09:39]`

> "I will set the agents working. I will have them run these tools and **I'm going to work very hard to get it into a situation where I don't have to look at the code at all.** I can trust what they do."

**Dịch:** *"Tôi cho agent chạy. Tôi bắt chúng chạy mấy tool này và **tôi sẽ cố hết sức để đạt tới trạng thái tôi không cần nhìn vào code chút nào.** Tôi tin được thứ chúng làm."*

Nhưng — và đây là chỗ dễ bị trích dẫn sai — ông ấy **không** bỏ kiểm chứng:

> "And now I do other things to verify that the code is still decent. I will look at the **CRAP scores** and make sure that they're low. And I will do **spot checks** on the code from time to time. And I have a whole bunch of other tests that I run."

**Dịch:** *"Và giờ tôi làm những việc khác để xác minh code vẫn ổn. Tôi nhìn **CRAP score** và đảm bảo nó thấp. Tôi **kiểm tra ngẫu nhiên** code thỉnh thoảng. Và tôi có cả đống test khác để chạy."*

Câu chốt:

> "**They are fast with code. I am slow with code.** So I'm going to let them have the code and I'm going to deal with the stuff around that to make sure it's all okay."

**Dịch:** *"**Chúng nhanh với code. Tôi chậm với code.** Nên tôi để chúng cầm code, còn tôi lo phần xung quanh để chắc mọi thứ ổn."*

Matt tóm lại giúp — cách diễn đạt này rất đắt `[09:39–10:20]`:

> "Your goal is to start pulling yourself away from the code, away from human review, to **construct this scaffolding around the code** so that you don't have to interact with it much yourself and so that the agent is constrained as much as possible **in as tight a straitjacket as possible** so that it can't make a mistake."

**Dịch:** *"Mục tiêu của ông là tự tách mình ra khỏi code, khỏi việc review thủ công, để **dựng một bộ giàn giáo quanh code** sao cho ông không phải động vào nó nhiều, và agent bị ràng buộc tối đa **trong một chiếc áo bó chặt nhất có thể** để nó không thể làm sai."*

---

## Ý cần nhớ

- Vấn đề gốc không phải "AI viết code dở" mà là **"AI nhanh, người dọn chậm"**.
- Danh sách kỹ thuật "hay nhưng bất khả thi vì tốn công người" giờ cần duyệt lại toàn bộ.
- **Coverage ≠ test tốt.** Mutation testing mới đo được test có thực sự bắt lỗi hay không.
- "Không nhìn code" của Uncle Bob = **thay mắt người bằng tool xác định**, không phải bỏ mặc.

---

[[00 - README|← Mục lục]] · [[02 - Vì sao dog do giết agent|Tiếp: Vì sao dog doo giết agent →]]
