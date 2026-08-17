---
tags:
  - ai
  - ai-coding
  - prompt-engineering
timestamp: 12:45 - 22:10
chapter: "Phase 2: The Grill Session"
---

# 03 — Grill Me: đạt "shared understanding"

`[12:45 – 22:10]` · [[02 - Hai ràng buộc của LLM - Smart zone và Memento|← Trước]] · [[00 - README|Mục lục]] · [[04 - PRD - Document điểm đến|Tiếp →]]

> Đây là phase quan trọng nhất của cả workflow. Matt nói thẳng: **toàn bộ công sức review nằm ở đây**, không nằm ở PRD.

> 💡 **"Grill" nghĩa là gì:** động từ `to grill someone` = **quay, tra hỏi dồn dập**. Nghĩa đen là nướng trên vỉ. Cảnh sát "grill" nghi phạm = hỏi liên tục không cho nghỉ. Tên skill `grill-me` = *"hãy quay tôi đi"* — chủ động yêu cầu AI tra hỏi mình.

---

## Vấn đề: brief mơ hồ

Input là `client-brief.md` — tin nhắn Slack từ Sarah Chen: retention kém, học viên bỏ giữa chừng, muốn thêm gamification. Không có gì hơn.

Matt hỏi phòng sẽ làm gì đầu tiên:

- Có người trả lời **"ask for more info"** — hỏi lại mục đích và tình trạng hiện tại. Matt: *"Yes, exactly."*
- Nhưng rồi ông ấy chốt bằng ràng buộc thực tế:

> "Let's imagine that Sarah Chen's gone on holiday, you have no idea. She's just posted this thing, you need to action it before you go."

**Dịch:** *"Hãy tưởng tượng Sarah Chen đi nghỉ mát rồi, bạn không biết gì cả. Cô ấy vừa post cái này lên, và bạn phải xử lý nó trước khi đi."*

→ Tình huống rất đời: người ra yêu cầu **không có mặt** để hỏi. Đây chính là lúc grill-me có giá trị.

*(Ông ấy cũng hỏi ai dùng plan mode — khá nhiều tay giơ lên. Câu trả lời của ông ấy là: plan mode chưa đủ, xem bên dưới.)*

---

## Skill `grill-me` — nguyên văn

Skill nằm trong repo, và điểm đáng chú ý nhất là nó **cực ngắn**. Matt nhấn: *"It's extremely short."*

Phần lõi, nguyên văn ông ấy đọc trên màn hình:

```markdown
Interview me relentlessly about every aspect of this plan
until we reach a shared understanding.

Walk down each branch of the decision tree,
resolving dependencies one by one.

For each question, provide your recommended answer.
Ask the questions one at a time.
```

**Dịch:**

```
Hãy phỏng vấn tôi không khoan nhượng về mọi khía cạnh của kế hoạch này
cho tới khi chúng ta đạt được một hiểu biết chung.

Đi xuống từng nhánh của cây quyết định,
giải quyết các phụ thuộc từng cái một.

Với mỗi câu hỏi, hãy đưa ra câu trả lời mà bạn đề xuất.
Hỏi từng câu một.
```

💡 **Từng chữ đều có lý do:**

| Cụm | Nghĩa | Chống lại điều gì |
|---|---|---|
| `relentlessly` | không khoan nhượng, không ngơi nghỉ | AI vội kết thúc để đi làm plan |
| `until we reach a shared understanding` | cho tới khi đạt hiểu biết chung | AI tự quyết định khi nào là "đủ" |
| `walk down each branch of the decision tree` | đi xuống từng nhánh cây quyết định | Hỏi lan man, không có hệ thống |
| `resolving dependencies one by one` | giải quyết phụ thuộc từng cái | Hỏi câu B khi câu A còn chưa chốt |
| `provide your recommended answer` | kèm đề xuất | Bắt mình nghĩ từ đầu cho mọi câu → mệt |
| `one at a time` | từng câu một | Dội 20 câu cùng lúc → mình bỏ đi làm việc khác |

Cách gọi:

```
/grill-me @client-brief.md
```

> Sau khi gọi, context của LLM **chỉ có 2 thứ**: nội dung skill + mô tả việc muốn làm. Không gì khác. Đúng nguyên tắc system prompt tối thiểu ở [[02 - Hai ràng buộc của LLM - Smart zone và Memento]].

Matt:

> "**This is virtually how I start every piece of work with AI.**"

**Dịch:** *"**Đây gần như là cách tôi bắt đầu mọi công việc với AI.**"*

---

## Tại sao cần skill này? Vấn đề với plan mode `[00:16-00:17]`

> "What I noticed when I was working with AI, **especially in plan mode actually**, is it would **really eagerly** try to produce a plan for me. It would say: *okay, I think I've got enough, I'm just going to — poof — plan, plan.*"

**Dịch:** *"Cái tôi để ý khi làm việc với AI, **đặc biệt là trong plan mode**, là nó **rất hăng hái** muốn đẻ ra một cái plan cho tôi. Nó sẽ kiểu: ok, tôi nghĩ tôi có đủ rồi, giờ tôi sẽ — phụt — plan, plan."*

> 💡 **Ý là:** "**eagerly**" (hăng hái) là chỗ mấu chốt. AI **được tối ưu để đưa ra artifact** — nó cảm thấy "thành công" khi sản xuất được cái gì đó. Nhưng thứ bạn cần ở giai đoạn này lại là **quá trình**, không phải sản phẩm. Hai mục tiêu này lệch nhau, nên phải viết `relentlessly` để ép nó ở lại giai đoạn hỏi.

Vấn đề: AI **vội** kết thúc giai đoạn hỏi. Matt nói ông ấy loay hoay khá lâu để **gọi tên** thứ mình thực sự muốn.

---

## Nền tảng lý thuyết: "design concept" của Brooks `[00:17-00:18]`

Câu trả lời ông ấy tìm thấy trong **Frederick P. Brooks, *The Design of Design***:

> "He has a great quote talking about the **design concept**. When you're working on something new with someone, when you're all trying to build something together, then there's **this shared idea that's shared between all participants** — and that is the design concept."

**Dịch:** *"Ông ấy có một câu rất hay nói về **design concept**. Khi bạn làm một thứ mới cùng ai đó, khi tất cả cùng nhau xây một cái gì đó, thì tồn tại **một ý tưởng chung được chia sẻ giữa mọi người tham gia** — và đó chính là design concept."*

Và đây là câu chốt của cả phase:

> "That's what I realized I needed with Claude. **I needed to reach a shared understanding. I didn't need a plan — I needed to be on the same wavelength as the AI, as my agent.** And this is an extremely effective way of doing it."

**Dịch:** *"Đó là thứ tôi nhận ra mình cần với Claude. **Tôi cần đạt được một hiểu biết chung. Tôi không cần một cái plan — tôi cần ở cùng tần số với AI, với agent của mình.** Và đây là cách cực kỳ hiệu quả để làm điều đó."*

> 💡 "**on the same wavelength**" là thành ngữ: cùng tần số sóng, tức là **hiểu nhau, nghĩ giống nhau** mà không cần giải thích dài. Giống hai người làm chung lâu năm, nói nửa câu là hiểu.

### Phân biệt cho rõ

| | Plan | Design concept |
|---|---|---|
| Là gì | Một **artifact**, file markdown | Một **trạng thái** chung trong đầu 2 bên |
| Kiểm tra thế nào | Đọc nó | Không đọc được — chỉ đạt được qua đối thoại |
| Khi sai thì sao | Sửa file | Phải hỏi lại từ đầu |
| Giá trị | Thấp (chỉ là tóm tắt) | Cao — **đây mới là thứ đắt** |

Hiểu phân biệt này thì mới hiểu tại sao Matt **không đọc PRD** ở [[04 - PRD - Document điểm đến]].

---

## Sub agent: nó explore mà không tốn context của mình `[00:17-00:18]`

Khi chạy grill-me, việc đầu tiên nó làm là **explore codebase**. Con số cụ thể trong demo:

> "It has done its exploration first of all. It's invoked a sub agent which spent **97 — 93.7k tokens on Opus**. And we can see that even though the sub agent burned a ton of tokens, **I haven't actually increased my token usage that much.**"

**Dịch:** *"Trước hết nó đã đi explore. Nó gọi một sub agent, con này tiêu **97 — 93,7k token trên Opus**. Và ta thấy là mặc dù sub agent đốt cả đống token, **lượng token tôi dùng thực ra không tăng lên bao nhiêu.**"*

### Sub agent là gì (Matt giải thích cho phòng)

> "This explore sub agent has essentially gone and **called another LLM which has an isolated context window**. And then that LLM has **reported a summary back**. So a sub agent is kind of like a **delegation**. You're delegating a task to a sub agent — it goes, eagerly does all the thing, explores a ton of stuff, and then just **drip feeds the important stuff back up to the orchestrator agent**, to the parent agent."

**Dịch:** *"Con explore sub agent này về cơ bản đã đi **gọi một LLM khác có context window riêng biệt**. Rồi LLM đó **báo cáo lại một bản tóm tắt**. Nên sub agent giống như một sự **uỷ quyền**. Bạn giao một task cho sub agent — nó đi, hăng hái làm hết mọi thứ, explore cả đống, rồi chỉ **nhỏ giọt những thứ quan trọng ngược lên cho orchestrator agent**, cho agent cha."*

> 💡 "**drip feed**" nghĩa đen là truyền dịch nhỏ giọt (như truyền nước biển). Ở đây: **đưa lại thông tin từng chút một, có chọn lọc** — chứ không đổ ào cả 94K token lên agent cha.

> 🔑 **Ý là — đây là kỹ thuật cốt lõi để ở lại trong smart zone:** việc đọc codebase tốn 94K token, nhưng 94K đó **cháy trong context của thằng khác**. Context chính chỉ nhận về bản tóm tắt vài nghìn token.
>
> Cùng nguyên lý sẽ quay lại ở [[07 - QA và Code Review - Nơi con người áp taste]] (review phải clear context) và [[09 - Parallelization - Sandcastle và Push vs Pull]] (mỗi implementer một sandbox riêng). **Nguyên lý chung: đẩy việc tốn context ra khỏi context chính.**

---

## Chất lượng câu hỏi — phần đáng học nhất

### Câu hỏi 1: Points economy

> "**What actions earn points and how much?**
> My recommendation: keep it simple, two point sources to start."

**Dịch:** *"**Những hành động nào được tính điểm và bao nhiêu điểm?** Đề xuất của tôi: giữ đơn giản, khởi đầu với hai nguồn điểm."*

Matt đồng ý, và bổ sung lý do:

> "skip video watch events, **they're noisy and gameable**. Sarah's asked, we'll keep the lessons as the bread and butter."

**Dịch:** *"bỏ qua sự kiện xem video, **chúng nhiễu và dễ bị lách luật**. Sarah đã yêu cầu rồi, ta sẽ giữ lesson làm phần cốt lõi."*

> 💡 "**gameable**" = có thể bị "game" tức **lách luật để trục lợi**. Nếu tính điểm theo lượt xem video, học viên chỉ cần mở video rồi đi làm việc khác. "**Bread and butter**" = bánh mì và bơ, tức **phần chính, phần nuôi sống**.

### Câu hỏi 2 — ⭐ câu đắt nhất: Retroactive

> "**Should points be retroactive? There are existing lesson progress records with `completed_at` timestamps.**"

**Dịch:** *"**Điểm có nên tính hồi tố không? Hiện đã có sẵn các bản ghi lesson progress kèm timestamp `completed_at`.**"*

Phản ứng của Matt:

> "This is a really nasty question. Should we actually go back and backfill all of the lesson progress events? This is the kind of question that you need to be aligned on if you're going to fulfill the feature properly. **This is not something I considered, and Sarah Chen certainly didn't consider.**"

**Dịch:** *"Đây là một câu hỏi cực khó chịu. Ta có thực sự nên quay lại và điền bù toàn bộ các sự kiện lesson progress không? Đây là loại câu hỏi bạn phải thống nhất được nếu muốn làm feature cho tử tế. **Đây là thứ tôi đã không nghĩ tới, và Sarah Chen chắc chắn cũng không nghĩ tới.**"*

Ông ấy còn cho cả phòng bỏ phiếu — và *"there are a lot of fence-sitters in the room"* (*"trong phòng có rất nhiều người ngồi trên hàng rào"* = **nhiều người lưỡng lự không chọn bên nào**), tức là **kể cả người thật cũng không chắc**.

> 🔑 **Ý là — đây là giá trị thật của grill-me:** nó tìm ra **những câu hỏi mà cả bạn lẫn client đều chưa nghĩ tới**, và đó chính là chỗ dự án chết.
>
> Giá trị không phải là "AI trả lời hộ mình", mà là **"AI hỏi hộ mình"**. Câu retroactive này nếu không hỏi bây giờ thì sẽ nổ ra sau khi ship — lúc đó user cũ mở app thấy 0 điểm và đi khiếu nại.

### Câu hỏi khác trong demo

- **Levels: what's the progression curve?** (*"Level: đường cong tiến triển thế nào?"*)
- **Do streaks earn points?** (*"Chuỗi ngày liên tiếp có được tính điểm không?"*) → Matt: *"streaks are standalone"* (*"streak đứng độc lập"*)
- **Where does the gamification UI live?** (*"Giao diện gamification đặt ở đâu?"*) → Matt: *"let's have it in the dashboard"*
- **Question 5:** *"Descriptions exist on some lessons but not others. Should we (a) include descriptions where they exist, leave blank where they don't, or (b) drop all descriptions?"*
  **Dịch:** *"Một số lesson có description, số khác không. Ta nên (a) hiển thị description ở đâu có, để trống ở đâu không có, hay (b) bỏ hết description?"*
  → Recommendation: **(a)** — *"include what's there. They add useful context... a few lessons have them."* (*"dùng cái nào đang có. Chúng bổ sung ngữ cảnh hữu ích... một số lesson có sẵn rồi."*)

---

## Vì sao mỗi câu hỏi phải kèm recommendation

Dòng `For each question, provide your recommended answer` trong skill không phải trang trí:

> "What's so nice about this is that **not only does it give us a question that kind of aligns us here, we get a recommendation too.** And often what I'll find is **the AI's recommendations are really good.**"

**Dịch:** *"Điểm hay ở đây là **không chỉ nó đưa ra câu hỏi giúp ta thống nhất, mà ta còn nhận được cả đề xuất nữa.** Và tôi thường thấy **đề xuất của AI rất tốt.**"*

Kết quả thực tế trong demo: Matt trả lời rất nhiều câu chỉ bằng *"yeah, looks good"* hoặc:

> "I'm just going to go with his recommendation cuz I'm lazy."

**Dịch:** *"Tôi cứ theo đề xuất của nó thôi vì tôi lười."*

> 💡 **Ý là:** Nghe như đùa nhưng đây là thiết kế có chủ đích. Không có recommendation thì **mỗi câu hỏi là một gánh nặng nhận thức** — bạn phải nghĩ từ số 0. Có recommendation thì phần lớn câu chỉ cần **xác nhận** (rẻ), chỉ số ít cần suy nghĩ thật (đắt). Nhờ vậy mới ngồi trả lời được 80 câu mà không bỏ cuộc.

Và dòng `Ask the questions one at a time` cũng có lý do:

> "Notice too how **I'm able to keep in the loop here with AI.** It's pinging me these questions pretty quickly. **I'm not having to go off and check Twitter or something.**"

**Dịch:** *"Cũng để ý là **tôi giữ được nhịp trong vòng lặp với AI.** Nó ping cho tôi các câu hỏi khá nhanh. **Tôi không phải bỏ đi lướt Twitter hay gì đó.**"*

> 💡 **Ý là:** Hỏi từng câu một → chu kỳ phản hồi ngắn → mình ở lại. Hỏi 20 câu cùng lúc → mình phải ngồi đọc hết rồi soạn câu trả lời dài → não bỏ cuộc, mở tab khác, mất luồng.

---

## Session dài bao lâu?

> "This grill me skill — this can last a long time. **I've had it ask me 40 questions. I've had it ask me 80 questions. I've had some people that it asks 100 questions too.** Literally you're sat there for an hour chatting to the [AI]."

**Dịch:** *"Cái skill grill me này — nó có thể kéo dài rất lâu. **Tôi từng bị nó hỏi 40 câu. Từng bị hỏi 80 câu. Có người bị nó hỏi tới 100 câu.** Đúng nghĩa là bạn ngồi đó cả tiếng đồng hồ nói chuyện với AI."*

Trong demo, vì đang chạy workshop nên ông ấy **ép nó nhanh lại**:

```
Give me a long list of all your recommendations.
I'm running a workshop right now, so I artificially need you to pull more weight.
```

**Dịch:** *"Đưa tôi một danh sách dài tất cả các đề xuất của bạn. Tôi đang chạy workshop, nên tôi cần bạn gánh nhiều hơn phần của mình một cách nhân tạo."*

> 💡 "**pull more weight**" là thành ngữ: **gánh phần việc của mình** (từ hình ảnh ngựa kéo xe). "Pull *more* weight" = gánh nhiều hơn bình thường.

Kết quả: **nó tự trả lời 22 câu hỏi của chính nó**, tổng context dùng hết **25k token**.

> "That's quite representative of what a grilling session looks like. At this point I have used 25k tokens and **all of that stuff is gold. I want to keep that around. I've got 25k great tokens there.**"

**Dịch:** *"Cái này khá tiêu biểu cho một phiên grilling. Tới lúc này tôi đã dùng 25k token và **toàn bộ chỗ đó là vàng. Tôi muốn giữ nó lại. Tôi có 25k token chất lượng ở đó.**"*

> 💡 **Ý là:** Đây là chỗ phân biệt **token tốt** và **token rác**. 25K token hội thoại grill = mật độ quyết định rất cao. 25K token từ việc agent đọc lung tung 40 file = gần như vô giá trị. Cùng một con số, giá trị khác hẳn — và đó là lý do phải chủ động chọn cái gì được vào context.

---

## Biến thể: dùng với meeting transcript `[00:21-00:22]`

> "This can also function like this. You can have a meeting with someone who's a domain expert. Maybe I have a meeting with Sarah, I feed that meeting transcript into — I don't know, Gemini meetings or whatever you guys are using. **You take that, you feed it into a grilling session, and you grill through the assumptions that you didn't have.**"

**Dịch:** *"Nó cũng có thể hoạt động thế này. Bạn họp với một domain expert. Giả sử tôi họp với Sarah, tôi đưa transcript cuộc họp đó vào — không biết nữa, Gemini meetings hay bất cứ thứ gì các bạn đang dùng. **Bạn lấy cái đó, đưa vào một phiên grilling, và quay qua những giả định mà bạn đã không có.**"*

> "This ends up being a really nice way of just **taking inputs from the world and then validating them.**"

**Dịch:** *"Nó hoá ra là một cách rất hay để **lấy các đầu vào từ thế giới thật rồi kiểm chứng chúng.**"*

→ Pattern tổng quát: **bất kỳ input mơ hồ nào từ thế giới thật** (meeting note, ticket, email, feedback khách) đều có thể ném vào grilling session để đào ra các giả định ngầm.

---

## Phân loại task: Human-in-the-loop vs AFK `[00:26-00:27]`

Có người trên Slido gợi ý *"okay, Ralph loop this"* (tức tự động hoá luôn cả grilling). Matt bác:

> "**This is crucial because I can't loop over this.** I think of there being **two types of tasks in the AI age**:
> - **Human in the loop tasks**, where a human needs to sit there and do it — which is this. We are the human in the loop, with **multiple humans** in the loop.
> - And there are **AFK tasks**, where the human can be away from the keyboard and it doesn't matter. Implementation, as we'll see, can be turned into an AFK task.
>
> **But planning, this alignment phase, has to be human in the loop. Has to be.**"

**Dịch:** *"**Chỗ này rất quan trọng vì tôi không thể loop cái này được.** Tôi cho rằng có **hai loại task trong thời đại AI**:*
> - *Task **human in the loop**, nơi một con người phải ngồi đó và làm — chính là cái này. Chúng ta là con người trong vòng lặp, và có thể là **nhiều con người** trong vòng lặp.*
> - *Và có **task AFK**, nơi con người có thể rời bàn phím mà không sao cả. Implementation, như ta sẽ thấy, có thể biến thành task AFK.*
>
> ***Nhưng planning, giai đoạn alignment này, bắt buộc phải là human in the loop. Bắt buộc.***"

> 💡 **AFK** = *Away From Keyboard*, thuật ngữ từ thời chat/game online: rời bàn phím.

| | Human in the loop | AFK |
|---|---|---|
| Phase nào | Idea, grilling, PRD, cắt issue, **QA** | Implementation |
| Ai làm | Người (có thể nhiều người) | Agent |
| Automate được không | **Không** | Có |

Sau này nhãn `AFK` sẽ được gắn thẳng vào từng issue trên Kanban board — xem [[05 - Vertical Slices - Cắt issue thành tracer bullets]].

---

## Q&A trong phase này

### Có nên dùng Spec Kit / OpenSpec / Taskmaster thay vì tự viết skill? `[00:23-00:24]`

> "There are a ton of different frameworks out there that allow you to build up this planning process for you. I personally believe — at this stage, **when there's no clear winner, when there's no one true way, and when things are changing all the time — you need to own as much of your planning stack as you possibly can.**"

**Dịch:** *"Ngoài kia có cả đống framework khác nhau giúp bạn dựng sẵn quy trình planning này. Cá nhân tôi tin rằng — ở giai đoạn này, **khi chưa có người thắng rõ ràng, khi chưa có một con đường đúng duy nhất, và khi mọi thứ thay đổi liên tục — bạn cần sở hữu càng nhiều phần trong planning stack của mình càng tốt.**"*

Lý do rất cụ thể, lấy từ việc dạy học:

> "What I've noticed — a lot of my students, they tend to **overuse a certain stack**. They get into trouble, and because they **don't own the stack and they don't have observability over the whole thing**, they just go: *this isn't working, this sucks.* Whereas if you have control over the whole thing, then **at least you know how to fix it**, or potentially know how to fix it."

**Dịch:** *"Cái tôi để ý — rất nhiều học viên của tôi có xu hướng **lạm dụng một stack nào đó**. Họ gặp rắc rối, và vì họ **không sở hữu stack đó và không có khả năng quan sát vào bên trong nó**, họ chỉ biết kêu: cái này không chạy, cái này tệ. Trong khi nếu bạn kiểm soát được toàn bộ, thì **ít nhất bạn biết cách sửa nó**, hoặc có khả năng biết cách sửa."*

> 💡 "**observability**" (khả năng quan sát) là thuật ngữ mượn từ DevOps: khả năng nhìn vào trong hệ thống để hiểu nó đang làm gì. Dùng framework đóng hộp = **zero observability** vào quy trình planning của chính mình.

Và ông ấy tự áp lên chính mình:

> "So even though I'm sort of giving you a stack basically, **I believe in inversion of control and you should be in control of the stack.**"

**Dịch:** *"Nên mặc dù về cơ bản tôi đang đưa cho các bạn một stack, **tôi tin vào inversion of control và chính bạn mới nên là người kiểm soát stack.**"*

> 🔑 **Áp dụng:** đừng chép nguyên skill của Matt rồi dùng như hộp đen. Skill của ông ấy ngắn (5 dòng) **chính là để bạn đọc hiểu và sửa được**. Nếu skill dài 300 dòng thì nó đã trở thành cái framework mà ông ấy đang chê.

### Grill Me hợp với PO hơn là dev — trong team lớn thì ai dùng? `[00:24-00:25]`

Matt trả lời bằng cách hỏi ngược: ai từng pair programming? Ai từng **pair programming với AI**?

> "I think pair programming sessions with AI is a great idea because **you've got a third person in the room who will relentlessly quiz you and ask you questions.**"

**Dịch:** *"Tôi nghĩ pair programming với AI là ý tưởng hay vì **bạn có một người thứ ba trong phòng, người sẽ tra hỏi bạn không ngừng.**"*

Nguyên tắc ông ấy đưa ra:

- Câu hỏi **domain** → trong phòng phải có: **bạn + domain expert + AI**
- Câu hỏi **implementation** → trong phòng phải có: **bạn + một dev khác + AI**

> "The really crucial decisions, the ones you need humans for — **you actually need a lot of humans**, and it doesn't really matter how many humans are in there. You can throw a bunch — **kind of like mob programming with AI** essentially."

**Dịch:** *"Những quyết định thực sự quan trọng, những cái cần con người — **bạn thực sự cần nhiều người**, và không quan trọng có bao nhiêu người trong đó. Bạn có thể ném cả đống người vào — **kiểu như mob programming với AI** vậy."*

> 💡 **Mob programming**: cả nhóm (một "đám đông") cùng làm trên một máy, một task. Khác pair programming (2 người).

### Sao không dùng `AskUserQuestion` UI của Claude Code? `[00:27-00:28]`

Ông ấy demo thử luôn rồi chê:

> "This UI is just **sort of broken in Claude and I really hate it.** You notice **I'm using Claude, but I don't like Claude very much.** You really are free with this method to choose any system you like."

**Dịch:** *"Cái UI này **kiểu như bị hỏng trong Claude và tôi thực sự ghét nó.** Các bạn để ý là **tôi đang dùng Claude, nhưng tôi không thích Claude lắm.** Với phương pháp này bạn hoàn toàn tự do chọn hệ thống nào bạn thích."*

> "It's **very pleasing when you first encounter it**, but then you realize it is **actually broken in a ton of different ways**."

**Dịch:** *"Nó **rất dễ chịu khi bạn gặp nó lần đầu**, nhưng rồi bạn nhận ra nó **thực sự hỏng theo cả tá cách khác nhau**."*

→ Nên grill-me hỏi bằng **text thường**, không dùng UI đặc biệt. Cũng là lý do method này port sang tool khác được.

### Làm sao lưu lại các quyết định **phủ định**? `[00:58]`

*(Câu này hỏi ở phase sau nhưng thuộc về đây.)*

> "There's a very simple answer, which is: in the **write-a-PRD** section, there is a section at the bottom of **the things that are out of scope**. So the things we're not going to tackle in this PRD — **which is very important for giving a definition of done.**"

**Dịch:** *"Có một câu trả lời rất đơn giản: trong phần **write-a-PRD**, có một mục ở cuối về **những thứ nằm ngoài phạm vi**. Tức là những thứ ta sẽ không đụng tới trong PRD này — **điều này rất quan trọng để đưa ra được definition of done.**"*

> 💡 "**definition of done**" (định nghĩa hoàn thành) là thuật ngữ Agile: tiêu chí rõ ràng để biết khi nào một việc coi là xong. Không có nó thì việc không bao giờ kết thúc, vì lúc nào cũng có thể làm thêm.

---

## Ý cần nhớ

- Thứ cần đạt là **shared understanding**, không phải plan. Plan là hệ quả, không phải mục tiêu.
- Skill chỉ **5 dòng** — ngắn để bạn sửa được, và để không chiếm context.
- 3 chi tiết trong skill đều có lý do: `relentlessly` (chống AI vội), `provide your recommended answer` (giảm tải nhận thức), `one at a time` (giữ nhịp).
- **Sub agent** cho phép explore 94K token mà context chính gần như không đổi.
- Giá trị thật: nó hỏi những câu **cả bạn lẫn client đều chưa nghĩ tới** (retroactive backfill).
- Session 22–100 câu hỏi là bình thường. 25K token ở đây là **25K token vàng**.
- Phase này **không automate được**. Đây là ranh giới human-in-the-loop.

---

[[02 - Hai ràng buộc của LLM - Smart zone và Memento|← Trước]] · [[00 - README|Mục lục]] · [[04 - PRD - Document điểm đến|Tiếp: Viết PRD →]]
