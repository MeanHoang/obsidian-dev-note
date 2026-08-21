---
tags:
  - ai
  - ai-coding
  - career
  - fundamentals
timestamp: 44:16 - 56:39
---

# 08 — Học strategic programming và vì sao fundamentals vẫn đúng

`[44:16 – 56:39]` · [[00 - README|← Mục lục]] · [[07 - Chong spec-driven - Cost of change ve gan 0|← Trước]]

---

## Tactical vs strategic — khung của Ousterhout `[45:16–46:20]`

Matt dựng khung câu hỏi cuối bằng khái niệm của **John Ousterhout**:

> "**Tactical** is the sergeant on the ground, the person kind of fighting the battle. The **strategic** stuff is the general, the person directing the course of the war."

**Dịch:** *"**Chiến thuật** là viên trung sĩ dưới mặt đất, người đang đánh trận. Phần **chiến lược** là viên tướng, người định hướng cả cuộc chiến."*

Và câu hỏi:

> "**Agents are really good at tactical, really bad at strategic.** Now, for people who are just starting out and **AI has now eaten all of the tactical stuff — how do they learn to do strategic programming?**"

**Dịch:** *"**Agent rất giỏi chiến thuật, rất dở chiến lược.** Giờ, với những người mới bắt đầu và **AI đã ăn hết phần chiến thuật — làm sao họ học được lập trình chiến lược?**"*

Matt còn nói thẳng cái người xem muốn:

> "They want: **please just give me your brain** so that I can inject it — understand why mutation testing is so good, tell me how to explain these modules. **So that's your job now: to give people your brain.**"

---

## Câu trả lời 1: vẫn phải viết code `[46:40–47:21]`

Uncle Bob mở đầu bằng sự thành thật:

> "**I get this question a lot. I don't have perfect answers to it because I really don't know.** But here's how I would think about this."

**Dịch:** *"**Tôi bị hỏi câu này nhiều. Tôi không có câu trả lời hoàn hảo vì tôi thực sự không biết.** Nhưng đây là cách tôi nghĩ về nó."*

> "The way a programmer should learn — whether it's in university or somewhere else — **should be to write code. You should be writing code for a year.** I don't know how long, but you should be writing code **so that you know what the agents are dealing with.**"

**Dịch:** *"Cách một lập trình viên nên học — dù ở đại học hay đâu khác — **nên là viết code. Bạn nên viết code trong một năm.** Tôi không rõ bao lâu, nhưng bạn nên viết code **để biết agent đang phải xử lý cái gì.**"*

---

## Câu trả lời 2: "become the agent" `[47:21–48:02]`

Đây là ý gây tranh cãi nhất, và cũng đáng nhớ nhất:

> "When you get hired into a company where that company is making heavy use of agents, **you — the young person just coming out of training — should be treated like an agent.** The lead engineer, the guy who's got a bunch of agents running and he's being strategic, **he should look at you as an agent and he should give you the same kind of tasks that the agents have and subject you to the same kind of deterministic tools that the agents have to use.** And **you should spend several months in that state being horribly unproductive but learning a hell of a lot.** And by the time you've gone through that gauntlet, **maybe you can be trusted to run an agent of your own.**"

**Dịch:** *"Khi bạn được tuyển vào một công ty dùng agent nhiều, **bạn — người trẻ vừa ra khỏi khoá đào tạo — nên được đối xử như một agent.** Kỹ sư lead, gã đang chạy một đống agent và đang làm phần chiến lược, **nên nhìn bạn như một agent, giao cho bạn đúng loại task mà agent nhận, và bắt bạn chịu đúng những deterministic tool mà agent phải chịu.** Và **bạn nên ở trạng thái đó vài tháng, năng suất tệ hại nhưng học được kinh khủng.** Và tới khi bạn đi hết cái gauntlet đó, **có thể bạn được tin tưởng để tự chạy agent của mình.**"*

Matt tóm lại thành câu hay `[52:49]`:

> "**Become the agent. Have the agent delegate to you. You become a sub-agent of the agent.**"

**Dịch:** *"**Trở thành agent. Để agent uỷ quyền cho bạn. Bạn thành sub-agent của agent.**"*

> 💡 **Ý là:** Ý tưởng này nghe cực đoan nhưng logic bên dưới rất chặt: **bạn không thể giám sát thứ bạn chưa từng làm.** Người chưa từng bị mutation testing đánh trượt sẽ không biết mutation testing đang bảo vệ mình khỏi cái gì, nên sẽ tắt nó khi nó phiền.
>
> Nhưng có một vấn đề Matt nêu ngay bên dưới mà Uncle Bob **không giải quyết được**.

---

## Chỗ Matt phản biện và Bob không trả lời được `[49:24–50:06]`

> "If you have someone who's just sitting on your books doing tactical work, **surely as a company you're going to look at that and go: why are we hiring this person when we've got Uncle Bob's swarm of five hardeners that can beat it at a fraction of the cost?**"

**Dịch:** *"Nếu bạn có một người chỉ ngồi làm việc chiến thuật, **chắc chắn với tư cách công ty bạn sẽ nhìn vào đó và nghĩ: sao ta phải thuê người này khi ta có bầy 5 hardener của Uncle Bob làm tốt hơn với chi phí bằng một phần nhỏ?**"*

Uncle Bob không có câu trả lời cho câu này. Đoạn hội thoại trôi sang chủ đề khác.

> 💡 **Ý là:** Đây là lỗ hổng thật của lộ trình "become the agent", và đáng ghi nhận là **không ai giả vờ đã giải quyết được**. Junior học bằng cách làm việc chiến thuật, nhưng việc chiến thuật giờ rẻ hơn nếu để agent làm. Nghĩa là **chi phí đào tạo junior đã chuyển từ "gần như miễn phí" (họ vừa học vừa tạo giá trị) sang "chi phí thuần"** (họ học, và cùng lúc làm chậm hệ thống).
>
> Đây là vấn đề kinh tế ngành, không phải vấn đề kỹ thuật, nên đừng kỳ vọng có mẹo nào giải quyết được ở mức cá nhân.

---

## Câu trả lời 3: nhận diện "the thrash" `[50:06–51:28]`

Matt hỏi một câu rất hay: làm sao ông **biết** agent đang làm sai hồi tháng 12?

> "Early on I was just looking at the code and seeing the dog doo. **That wasn't the important part. The important part was the next step where I watched them thrash. I could see the agent struggle — and I recognized the struggle since I have been through that struggle.** And that's one of the issues: **the novice would come in and not recognize the struggle.**"

**Dịch:** *"Ban đầu tôi chỉ nhìn code và thấy cứt chó. **Đó không phải phần quan trọng. Phần quan trọng là bước tiếp theo, khi tôi nhìn chúng vật lộn. Tôi thấy được agent đang chật vật — và tôi nhận ra sự chật vật đó vì chính tôi đã trải qua nó.** Và đó là một trong những vấn đề: **người mới vào sẽ không nhận ra sự chật vật đó.**"*

> 💡 **Ý là:** Đây là câu trả lời thật sự cho câu hỏi "strategic programming là gì".
>
> Nó **không phải** kiến thức về pattern hay nguyên tắc — nó là **khả năng nhận diện cảm giác một hệ thống đang chống lại bạn.** Uncle Bob nhận ra agent thrash vì ông đã tự thrash hàng chục lần trong 50 năm. Junior nhìn cùng màn hình đó chỉ thấy "agent đang làm việc".
>
> Với công việc hằng ngày, dấu hiệu thrash cụ thể đáng chú ý:
> - Agent sửa test A → gãy test B → sửa B → gãy A
> - Agent thêm điều kiện `if` để né một trường hợp thay vì sửa nguyên nhân
> - Agent đọc lại cùng một file lần thứ 4 trong một session
> - Agent bắt đầu đề nghị "hay là ta viết lại module này"
>
> Bốn dấu hiệu đó gần như luôn có nghĩa là **thiết kế sai, không phải prompt sai.**

---

## Câu trả lời 4: đọc sách cũ `[51:28–52:49]`

> "There is **a wealth of information** about this. The old books — **the ones that nobody reads because they're old** — the old books on this topic are **terrific**. Go to the works by **Tom DeMarco** or the works by **Ed Yourdon**... **the Pragmatic Programmer**. There's a lot of these older books, they're very good. **If you study them when you're young you will get a feel for what this higher-level strategic play is.**"

**Dịch:** *"Có **cả một kho thông tin** về chuyện này. Những cuốn sách cũ — **những cuốn không ai đọc vì chúng cũ** — sách cũ về chủ đề này **tuyệt vời**. Hãy tìm tới tác phẩm của **Tom DeMarco** hoặc của **Ed Yourdon**... **The Pragmatic Programmer**. Có rất nhiều sách cũ kiểu vậy, rất hay. **Nếu bạn học chúng lúc còn trẻ, bạn sẽ có cảm giác về cái nước cờ chiến lược ở tầng cao hơn này.**"*

Kèm một lưu ý thực tế:

> "**You'll have to filter out some of the archaic stuff** because a lot of these books were written in the 70s or the 80s. **But that's when these lessons were learned.**"

Và:

> "**And then, of course, you're going to have to learn it by feeling it.** That's why I think they ought to play agents for a few months so they can learn what that's really like."

> 💡 **Ý là:** Trùng khớp với kết luận của Matt ở workshop riêng của ông ("head to Amazon and buy a ton of those old books") — xem [[Workflow for AI Coding - Matt Pocock/01 - Thesis - Software engineering fundamentals vẫn đúng]]. Hai người độc lập đi tới cùng lời khuyên: **thư viện tri thức về việc quản lý độ phức tạp đã tồn tại từ thập niên 70-80, chỉ là không ai đọc.**

---

## Ngoài lề: đoạn assembly `[48:02–49:04]`

Một ẩn dụ ông từng dùng 10 năm trước, giờ áp lại cho AI:

> "**If you've never written assembly language, you should spend the weekend writing assembly language** just so that you know what's really going on behind the scenes. Because **if all you're doing is writing Java all day long, you live in a fantasy world. There is still magic yet that you don't understand.** Spend a weekend doing assembly language and **you will finally understand what's really going on.**"

**Dịch:** *"**Nếu bạn chưa từng viết assembly, bạn nên dành một cuối tuần viết assembly** chỉ để biết thực sự có gì đang diễn ra phía sau. Vì **nếu cả ngày bạn chỉ viết Java, bạn đang sống trong một thế giới thần tiên. Vẫn còn phép thuật mà bạn không hiểu.** Dành một cuối tuần với assembly và **cuối cùng bạn sẽ hiểu chuyện gì thật sự đang xảy ra.**"*

Lộ trình học ông đề xuất:

```
binary → assembly → C (low-level) → Python/JS (high-level)
       → làm việc kiểu agent + deterministic tools
       → chạy agent dưới sự giám sát  ← strategic bắt đầu ở đây
```

---

## Vì sao fundamentals vẫn đúng `[53:09–54:36]`

Câu hỏi cuối của Matt: *"Sounds like then software fundamentals still matter. And why is that? What do you say to the people who say that they don't matter?"*

Câu trả lời — trích dẫn quan trọng nhất của cả video:

> "Software fundamentals matter for the reason they have always mattered. It was **Dijkstra** I think who said it — I'm going to get this wrong, but: **software is the most complicated thing that humans have ever attempted to do.** More complicated than any other task that we've tried.
>
> **And therefore the fundamentals are the way of organizing that complexity into a form that can be conceived — not just by humans, but by our models as well. Since our models are modeled after humans after all.**"

**Dịch:** *"Fundamentals của phần mềm quan trọng vì đúng lý do chúng vẫn luôn quan trọng. Tôi nghĩ là **Dijkstra** đã nói: — tôi sẽ dẫn sai thôi, nhưng — **phần mềm là thứ phức tạp nhất mà con người từng thử làm.** Phức tạp hơn mọi nhiệm vụ khác chúng ta từng thử.*
>
> ***Và do đó fundamentals chính là cách tổ chức độ phức tạp đó thành một dạng có thể nắm bắt được — không chỉ bởi con người, mà bởi cả model của chúng ta. Vì rốt cuộc model được mô hình hoá theo con người.***"*

> 💡 **Ý là:** Đây là **lập luận cốt lõi của toàn bộ video**, và nó chặt hơn hẳn lập luận thông thường ("fundamentals tốt vì fundamentals tốt").
>
> Chuỗi suy luận:
> 1. Fundamentals tồn tại để **tổ chức độ phức tạp thành dạng trí óc nắm được**
> 2. LLM được huấn luyện trên **sản phẩm của trí óc con người**, nên nó **kế thừa cách nắm bắt đó**
> 3. → Thứ giúp người hiểu được code cũng giúp model hiểu được code
> 4. → Fundamentals không sống sót vì truyền thống, chúng sống sót vì **cùng một ràng buộc nhận thức**
>
> Hệ quả thú vị: nếu một ngày AI **không** được huấn luyện trên dữ liệu người, lập luận này sẽ đứt. Nhưng chừng nào còn là LLM, nó còn đúng.

Về những người nói fundamentals đã hết thời:

> "There are folks right now who think that the fundamentals don't matter. **They will learn, and they will learn that the hard way, and it won't take very long.** Might take longer than I think because the agents are pretty good. **But I've watched them hit the wall. So I know that wall is there and I don't want to hit that again.**"

**Dịch:** *"Có những người bây giờ nghĩ fundamentals không quan trọng. **Họ sẽ học, và họ sẽ học theo cách khó, và sẽ không mất lâu đâu.** Có thể lâu hơn tôi nghĩ vì agent khá giỏi. **Nhưng tôi đã chứng kiến chúng đâm vào tường. Nên tôi biết bức tường đó có thật và tôi không muốn đâm lần nữa.**"*

---

## Nấc thang abstraction `[54:36–55:39]`

Matt đặt AI vào chuỗi lịch sử:

> "We're now at a level where we're **above the compiler.** Our abstraction layer used to be the compiler. Before that it was assembly language. Before that it was binary. And now it's up here at **the level of the model.**"

Uncle Bob:

> "**At every one of those steps up the abstraction ladder, the people at the lower step complained: oh, this is going to ruin everything. We're not even going to have jobs anymore. It's become so easy that five-year-olds will be able to write the code.** And back then they were still talking about binary. **At every step it's the same.** And so we're at this next step and the people down here are saying 'oh, it's going to ruin everything'. **No, it's not. The same rules apply. All the same fundamentals exist for all the same reasons.**"

**Dịch:** *"**Ở mỗi nấc thang abstraction đi lên, những người ở nấc dưới đều than: ôi, cái này sẽ phá huỷ mọi thứ. Chúng ta sẽ chẳng còn việc làm. Nó dễ tới mức trẻ 5 tuổi cũng viết được code.** Và hồi đó họ vẫn đang nói về binary. **Ở mỗi bước đều y hệt.** Và giờ ta ở bước tiếp theo và người ở dưới đang nói 'ôi, nó sẽ phá huỷ mọi thứ'. **Không đâu. Cùng những luật đó áp dụng. Tất cả fundamentals vẫn tồn tại vì đúng những lý do đó.**"*

Câu chốt hay nhất:

> "**The rules you throw away are the ones you're going to pick up off the floor in a year and dust off and remember why you need them.**"

**Dịch:** *"**Những luật bạn vứt đi chính là những luật bạn sẽ nhặt lại từ sàn nhà sau một năm, phủi bụi, và nhớ ra vì sao bạn cần chúng.**"*

Matt đáp lại bằng Plato:

> "There's a great quote from I think **Plato** where he says that **writing is going to make people stupider.** So people have had that same abstraction argument since the Greeks."

> 💡 **Ý là:** Lập luận nấc thang abstraction thường bị dùng lười biếng để bác bỏ mọi lo ngại ("hồi xưa cũng lo mà đâu có sao"). Phiên bản của Uncle Bob mạnh hơn vì ông **không** nói "chẳng có gì thay đổi" — ông nói **ngưỡng thay đổi, luật thì không** (xem [[06 - Sua gi trong Clean Code - Threshold vs discipline]]). Đó là điểm khác biệt giữa một lập luận có nội dung và một câu an ủi.

---

## Ý cần nhớ

- **Agent giỏi tactical, dở strategic.** Nút thắt đã dịch lên tầng thiết kế và phán đoán.
- **Strategic programming = nhận diện được "the thrash"** — cảm giác hệ thống đang chống lại mình. Học được bằng cách tự trải qua, không bằng đọc.
- **"Become the agent"**: junior nên bị đối xử như agent vài tháng — nhưng lộ trình này có lỗ hổng kinh tế mà không ai giải quyết được.
- Bốn dấu hiệu thrash: sửa A gãy B, thêm `if` để né, đọc lại cùng file lần thứ 4, đề nghị viết lại module.
- **Fundamentals sống sót vì cùng ràng buộc nhận thức**, không vì truyền thống — model được mô hình hoá theo con người.
- **"The rules you throw away are the ones you're going to pick up off the floor in a year."**

---

[[00 - README|← Mục lục]] · [[07 - Chong spec-driven - Cost of change ve gan 0|← Trước: Chống spec-driven]]
