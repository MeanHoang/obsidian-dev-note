---
tags:
  - ai
  - ai-coding
  - agile
  - spec-driven
timestamp: 35:35 - 44:16
---

# 07 — Chống spec-driven: Cost of change về gần 0

`[35:35 – 44:16]` · [[00 - README|← Mục lục]] · [[08 - Hoc strategic programming va vi sao fundamentals van dung|Tiếp →]]

---

## Câu hỏi: lập kế hoạch bao nhiêu trước khi vào gauntlet?

Matt hỏi rất thực tế `[35:55–36:16]`:

> "What do you do **before** you kick things off to your specifier? How much planning are you doing before you actually go into this gauntlet loop? Because **putting the wrong work in a gauntlet is super wasteful.**"

**Dịch:** *"Ông làm gì **trước khi** đẩy việc cho specifier? Ông lập kế hoạch bao nhiêu trước khi thực sự vào cái vòng gauntlet? Vì **đưa nhầm việc vào gauntlet thì cực kỳ lãng phí.**"*

---

## Uncle Bob: đây chính là waterfall quay lại `[36:16–37:39]`

> "The temptation is to get the human to **specify, specify, specify, specify** and then give it to the agent. **This is a very old temptation. It was a temptation we underwent in the 70s. It led us to the waterfall process** and all of that. And **the agile revolution was the answer back to that** — it was a way to say: wait a minute, **all this heavy upfront planning makes a mess of everything, because what comes out at the end doesn't look anything like the plan and never has.**"

**Dịch:** *"Cám dỗ là bắt con người **đặc tả, đặc tả, đặc tả, đặc tả** rồi đưa cho agent. **Đây là một cám dỗ rất cũ. Đó là cám dỗ chúng ta đã trải qua ở thập niên 70. Nó dẫn chúng ta tới quy trình waterfall** và tất cả những thứ đó. Và **cuộc cách mạng agile là câu trả lời cho nó** — một cách để nói: khoan đã, **toàn bộ việc lập kế hoạch nặng nề từ đầu làm hỏng mọi thứ, vì thứ ra ở cuối chẳng giống bản kế hoạch chút nào, và chưa bao giờ giống.**"*

Ông kể trải nghiệm trực tiếp, và mô tả **cơ chế thất bại** rất cụ thể:

> "I have tried this. In fact, **I've been in the middle of trying this just this week** and **it's always a disaster.** And it's always the same outcome: you make all these plans and then, as the agents are running, **you the human realize that they can't follow that plan because you didn't think of everything and they're not as wise as you are.** So they're **running half-cocked off on some nonsense** that you have to stop, back up, rewrite the plan, and then **start them over again.**"

**Dịch:** *"Tôi đã thử. Thực ra **tôi đang thử chính tuần này** và **lúc nào cũng là thảm hoạ.** Và luôn cùng một kết cục: bạn lập đủ thứ kế hoạch rồi, khi agent đang chạy, **bạn — con người — nhận ra chúng không thể theo kế hoạch đó vì bạn đã không nghĩ tới mọi thứ, và chúng không khôn ngoan như bạn.** Nên chúng **chạy lệch nòng vào một mớ vô nghĩa** mà bạn phải dừng lại, lùi về, viết lại kế hoạch, rồi **cho chúng chạy lại từ đầu.**"*

> 💡 **Ý là:** Cơ chế thất bại ở đây rất đáng chú ý và khác với "plan sai thì sửa plan".
>
> Vấn đề là **plan chi tiết không thể đầy đủ**, và agent — không đủ khôn để tự nhận ra chỗ thiếu — sẽ **lấp chỗ trống bằng thứ vô nghĩa** thay vì dừng lại hỏi. Với người thì lỗ hổng trong spec khiến họ nhắn hỏi bạn; với agent thì lỗ hổng khiến nó bịa. Plan càng dài, càng nhiều lỗ hổng, càng nhiều chỗ để bịa.

Hướng ông chuyển sang:

> "**Let's try the agile approach now.** And I don't know how this is going to work out. **It might not work out all that well**, but let's just **let them do a story or two, and then we'll look at the architecture at the end**, and maybe I'll have to **manually get involved**, sort a few things out, and then a few more stories and so on. **We may never escape that manual organizing step at the end.**"

**Dịch:** *"**Giờ hãy thử cách agile.** Và tôi không biết nó sẽ ra sao. **Có thể không ổn lắm**, nhưng cứ **để chúng làm một hai story, rồi nhìn lại kiến trúc ở cuối**, và có thể tôi phải **nhúng tay thủ công**, dọn vài thứ, rồi thêm vài story nữa, và cứ thế. **Có lẽ ta sẽ không bao giờ thoát khỏi bước tổ chức thủ công ở cuối đó.**"*

> 💡 **Ý là:** Ông rất thành thật về mức độ chưa chắc chắn — "I don't know how this is going to work out". Đây là quan điểm đang hình thành, không phải kết luận đã chốt. Đọc note này như **một giả thuyết đáng thử**, không phải chân lý.

---

## "Agent yêu viết plan" `[39:07–39:27]`

Một câu ngắn nhưng chua:

> "**The agents love to write plans. Oh my goodness, they love it.** And they will **embellish** the plans and the plans will be **gorgeous and beautiful and spell out all kinds of details.**"

Matt tiếp lời: *"Yeah. And then they fall apart at the end."*

**Dịch:** *"**Agent thích viết plan lắm. Trời ơi, chúng mê viết plan.** Và chúng sẽ **tô vẽ** kế hoạch, và kế hoạch sẽ **lộng lẫy, đẹp đẽ, liệt kê đủ mọi chi tiết.**" — "Ừ. Rồi tới cuối thì sụp hết."*

> 💡 **Ý là:** Đây là một cái bẫy tâm lý thật. Plan do agent viết **trông** rất thuyết phục — có heading, có bullet, có phase, có risk section. Cảm giác "đã suy nghĩ kỹ" đến từ **hình thức** của tài liệu, không phải từ việc nó có đúng hay không. Và vì bạn không đọc kỹ (xem phần dưới), bạn không phát hiện.

Nhận định của ông về xu hướng spec-driven development:

> "There's this movement towards **spec-driven development**. My impression there is that **that's probably not going to work. My experiments did not work particularly well.** And I'm thinking now maybe we should once again look at the agile ideas: **do a little bit, get some feedback, do a little bit more, get some feedback, reorganize.**"

---

## Ẩn dụ xây nhà $1 `[39:49–41:31]`

Đây là phần hay nhất của note này. Uncle Bob kể lại câu chuyện ông dùng thời còn đi giảng về agile:

> "**If it cost you $1 to make a change to a house** — including the initial laying of the foundation, the initial roof, everything; **every change you gave to the contractor would cost you a dollar** — how would you build that house?"

**Dịch:** *"**Nếu mỗi thay đổi cho một căn nhà tốn của bạn 1 đô** — kể cả đổ móng lần đầu, lợp mái lần đầu, mọi thứ; **mỗi thay đổi bạn giao cho nhà thầu tốn đúng một đô** — bạn sẽ xây căn nhà đó thế nào?"*

Hai lựa chọn:

> "Would you **hire an architect and pay thousands of dollars** to come up with the perfect plan, that they then paid a dollar to the contractor so that he could build it in one shot?
>
> **Or would you walk up to the contractor and say: I want the foundation here, make it that shape.** Oh no, that's bad. Okay, let's change that foundation. Put the kitchen over here, put the living room there. **There's $2.** Oh heck no, let's change those around. Let the kids walk through — oh, the traffic pattern is crappy, move the stairs."

**Dịch:** *"Bạn sẽ **thuê một kiến trúc sư và trả hàng nghìn đô** để có bản thiết kế hoàn hảo, rồi trả 1 đô cho nhà thầu để anh ta xây một phát ăn ngay?*
>
> *Hay bạn sẽ **đi tới chỗ nhà thầu và nói: tôi muốn móng ở đây, hình dạng như thế.** Ồ không, tệ quá. Được, đổi cái móng đó đi. Đặt bếp ở đây, phòng khách ở kia. **Mất 2 đô.** Ôi không được, đổi chỗ hai cái đó đi. Cho lũ trẻ đi thử — à, luồng di chuyển tệ quá, dời cầu thang đi."*

Kết luận:

> "Obviously **the latter is probably better** and that's what we are looking at right now. It costs a dollar — well, maybe two, maybe five. But **the cost of change has plummeted to as close to zero as I think we're ever going to get it.** The cost of change has gone so far down that **why would you do this upfront planning, because that's expensive? Why wouldn't you just fiddle, fiddle, fiddle, fiddle until it looks right?**"

**Dịch:** *"Rõ ràng **cách sau có lẽ tốt hơn**, và đó là thứ ta đang đối mặt lúc này. Nó tốn 1 đô — à, có khi 2, có khi 5. Nhưng **chi phí thay đổi đã rơi xuống gần bằng 0 nhất mức tôi nghĩ ta từng đạt được.** Chi phí thay đổi giảm sâu tới mức **tại sao bạn còn lập kế hoạch từ đầu, khi mà cái đó mới đắt? Sao không cứ vọc, vọc, vọc, vọc cho tới khi nó trông đúng?**"*

> 💡 **Ý là:** Ẩn dụ này nắm đúng bản chất kinh tế của vấn đề.
>
> **Upfront planning không phải một đức tính — nó là phản ứng với chi phí thay đổi cao.** Kiến trúc sư đắt tiền chỉ đáng thuê khi xây sai phải đập đi xây lại. Khi sửa nhà tốn 1 đô, tiền thuê kiến trúc sư trở thành phần **đắt nhất** của dự án.
>
> Dịch sang phần mềm: khi agent viết lại một module mất 10 phút, thì **2 tiếng bạn ngồi mài spec chính là chi phí lớn nhất**, không phải phần code.
>
> Điều kiện đi kèm — không được quên: ẩn dụ chỉ đúng nếu **thay đổi thật sự rẻ**. Thay đổi chỉ rẻ khi có test suite bắt được hồi quy và module tách bạch. Nếu codebase bẩn, cost of change **không** về 0 và luận điểm này sụp. Nên [[02 - Vì sao dog do giết agent]] là điều kiện tiên quyết của note này.

---

## "Spec là ephemeral" `[42:12–43:13]`

Matt hỏi có lưu spec trong repo không. Trả lời dứt khoát:

> "**No, I do not.** The specifications are **ephemeral. They go away.** They change a lot. I fiddle with them and that goes away. **There is no equivalent to source code.** We humans wrote the source code — so that was the final specification. Well, **that doesn't exist anymore.** There is still source code but **we humans aren't the ones writing it. And a lot of people feel that lack.**"

**Dịch:** *"**Không, tôi không lưu.** Các specification là **phù du. Chúng biến mất.** Chúng đổi liên tục. Tôi vọc chúng rồi chúng biến mất. **Không có thứ gì tương đương với source code cả.** Chúng ta — con người — viết source code, nên đó chính là bản đặc tả cuối cùng. Ừ thì, **cái đó không còn nữa.** Vẫn có source code nhưng **không phải con người viết nó. Và rất nhiều người cảm thấy thiếu hụt vì điều đó.**"*

> 💡 **Ý là:** Đây là chẩn đoán tâm lý sắc bén về phong trào spec-driven development.
>
> Ngày xưa **source code là artifact cuối cùng do con người tạo ra** — nó vừa là sản phẩm, vừa là bản đặc tả chính xác nhất. Khi agent viết code, con người mất chỗ đứng đó và cảm thấy **hụt hẫng**. Spec-driven development là nỗ lực đi tìm một artifact mới để con người "sở hữu".
>
> Uncle Bob cho rằng nỗi hụt hẫng đó là thật, nhưng cách giải quyết thì sai — thay vì tạo ra artifact mới để bám vào, hãy chấp nhận rằng vai trò người đã dịch chuyển sang **kiểm chứng và cấu trúc**.

Thay vào đó, ông làm gì:

> "Instead of creating a specification that defines what I want or defines what I have, **I look at the end result and say: well, that is the specification.**"

Và ví dụ cụ thể về tool ông tự viết:

> "I've got the CRAP tool — it runs for Clojure, it runs for Java, it runs for Go. I've got the mutation tester. I've got my agent harness. **What I tell people is: don't download those. I wrote them for me. What you should do is point your agents at them, have the agents look at them, and then build one for you.**"

**Dịch:** *"Tôi có tool CRAP — chạy cho Clojure, cho Java, cho Go. Tôi có mutation tester. Tôi có agent harness của mình. **Điều tôi nói với mọi người là: đừng tải chúng về. Tôi viết chúng cho tôi. Thứ bạn nên làm là chỉ agent của bạn tới chúng, cho agent xem, rồi dựng một cái cho chính bạn.**"*

Matt: *"That's a far better way of specifying the essence of something and then customizing it to your particular need."*

> 💡 **Ý là:** Đây là một mô hình chia sẻ công cụ mới và khá lạ: **code cũ đóng vai trò spec cho code mới.** Thay vì phát hành thư viện có API ổn định, bạn phát hành **một triển khai tham chiếu** để agent của người khác đọc và tái tạo phiên bản hợp với họ. Sản phẩm bàn giao không còn là artifact, mà là **ý tưởng đã được hiện thực hoá đủ rõ để sao chép lại.**

---

## Bất đối xứng đọc/viết `[43:55–44:56]`

Một quan sát ngắn nhưng rất đúng:

Uncle Bob:
> "**If you send them something, they read it.** Which is very different to humans. You can maybe get a **20% hit rate** if you send someone a massive specification — and 20% is maybe a bit generous, **5% maybe**. If you pass a spec to an agent, **they're probably going to read it.**"

Matt:
> "**The opposite side of that is: the things that the agents write, the humans don't read.**"

Uncle Bob: *"Yes. Exactly."*

Matt: *"**They're expecting us to read everything they write and we just don't. God, it's so one-sided.**"

**Dịch:** *"— **Nếu bạn gửi cho agent thứ gì đó, nó đọc.** Rất khác với con người. Bạn may ra được **20% tỉ lệ đọc** nếu gửi ai đó một bản đặc tả đồ sộ — và 20% có khi là hào phóng, **5% thì đúng hơn**. Nếu bạn đưa spec cho agent, **nó gần như chắc chắn sẽ đọc.**"*
*"— **Mặt ngược lại là: những thứ agent viết ra thì con người không đọc.**" — "Đúng vậy." — "**Chúng kỳ vọng ta đọc mọi thứ chúng viết và ta thì không. Trời ạ, một chiều quá.**"*

> 💡 **Ý là:** Bất đối xứng này giải thích chính xác vì sao **agent-writes-plan → human-approves-plan** là một nghi thức rỗng.
>
> ```
> Người → Agent:  agent ĐỌC HẾT     (nên spec ngắn vẫn có tác dụng)
> Agent → Người:  người ĐỌC LƯỚT    (nên plan dài của agent là vô ích)
> ```
>
> Hệ quả thực tế: **tài liệu đi theo chiều agent → người phải cực ngắn hoặc không tồn tại.** Nếu agent phải báo cáo, bắt nó viết 5 dòng chứ đừng 5 trang — vì 5 trang sẽ không ai đọc, và cái cảm giác "đã review" là giả.

---

## Đối chiếu với Matt Pocock

Đây là chỗ hai người khác nhau rõ nhất. Matt phản đối cái **label** spec-driven nhưng **vẫn làm alignment trước**:

> "I think I have a massive issue with the **spec-driven development label**. Because what is spec-driven development? You can have 10 different interpretations of it. And **every time you pass information to an agent — is prompt engineering spec-driven development? Like it kind of is.**... For me the difference is: **are you persisting your specifications? Are you returning to those specifications?**"

**Dịch:** *"Tôi nghĩ tôi có vấn đề lớn với **cái nhãn spec-driven development**. Vì spec-driven development là gì? Có thể có 10 cách hiểu khác nhau. Và **mỗi lần bạn đưa thông tin cho agent — prompt engineering có phải spec-driven development không? Kiểu, cũng phải mà.**... Với tôi khác biệt là: **bạn có lưu lại spec không? Bạn có quay lại spec đó không?**"*

| | Matt Pocock | Uncle Bob |
|---|---|---|
| Alignment trước khi code | **Có** — grill session, PRD | Tối thiểu — một document ngắn cho specifier |
| Lưu spec trong repo | Có PRD, nhưng **tự thừa nhận không đọc lại** | **Không lưu, spec ephemeral** |
| Định nghĩa spec-driven "xấu" | **Quay lại sửa spec khi code sai** | **Bất kỳ upfront planning nặng nào** |

> 💡 **Ý là:** Thực ra hai người gần nhau hơn vẻ ngoài. Matt viết PRD nhưng **không đọc lại PRD** — nghĩa là với ông PRD cũng gần như ephemeral, giá trị của nó nằm ở **quá trình viết** (đạt shared understanding), không ở tài liệu. Khác biệt thật sự chỉ là Matt tin quá trình alignment đó cần con người tham gia sâu, Bob thì muốn cắt ngắn nó.

---

## Ý cần nhớ

- **Upfront planning nặng = waterfall quay lại**, chỉ khác là agent thay vì đội dev.
- Cơ chế hỏng: plan thiếu chỗ nào, **agent bịa chỗ đó** thay vì dừng hỏi. Plan dài → nhiều chỗ bịa.
- **Agent mê viết plan.** Plan trông đẹp không có nghĩa là plan đúng.
- **Cost of change ≈ 0 → upfront planning thành phần đắt nhất.** Nhưng chỉ đúng khi test suite và module đủ tốt.
- **Spec là ephemeral.** Nỗi hụt hẫng "mất artifact của con người" là thật, nhưng lấp bằng spec là sai hướng.
- **Bất đối xứng đọc/viết:** agent đọc hết thứ ta viết; ta không đọc thứ agent viết. Đừng bắt agent viết dài.

---

[[00 - README|← Mục lục]] · [[08 - Hoc strategic programming va vi sao fundamentals van dung|Tiếp: Học strategic programming →]]
