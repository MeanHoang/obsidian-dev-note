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

---

## Vấn đề: brief mơ hồ

Input là `client-brief.md` — tin nhắn Slack từ Sarah Chen: retention kém, học viên bỏ giữa chừng, muốn thêm gamification. Không có gì hơn.

Matt hỏi phòng sẽ làm gì đầu tiên:

- Có người trả lời **"ask for more info"** — hỏi lại mục đích và tình trạng hiện tại. Matt: *"Yes, exactly."*
- Nhưng rồi ông ấy chốt bằng ràng buộc thực tế: **"Let's imagine that Sarah Chen's gone on holiday, you have no idea. She's just posted this thing, you need to action it before you go."**

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

Cách gọi:

```
/grill-me @client-brief.md
```

> Sau khi gọi, context của LLM **chỉ có 2 thứ**: nội dung skill + mô tả việc muốn làm. Không gì khác. Đúng nguyên tắc system prompt tối thiểu ở [[02 - Hai ràng buộc của LLM - Smart zone và Memento]].

Matt: *"**This is virtually how I start every piece of work with AI.**"*

---

## Tại sao cần skill này? Vấn đề với plan mode `[00:16-00:17]`

> "What I noticed when I was working with AI, **especially in plan mode actually**, is it would **really eagerly** try to produce a plan for me. It would say: *okay, I think I've got enough, I'm just going to — poof — plan, plan.*"

Vấn đề: AI **vội** kết thúc giai đoạn hỏi. Nó tối ưu cho việc *đưa ra artifact*, trong khi thứ mình cần lại chưa đạt được.

Matt nói ông ấy loay hoay khá lâu để **gọi tên** thứ mình thực sự muốn.

---

## Nền tảng lý thuyết: "design concept" của Brooks `[00:17-00:18]`

Câu trả lời ông ấy tìm thấy trong **Frederick P. Brooks, *The Design of Design***:

> "He has a great quote talking about the **design concept**. When you're working on something new with someone, when you're all trying to build something together, then there's **this shared idea that's shared between all participants** — and that is the design concept."

Và đây là câu chốt của cả phase:

> "That's what I realized I needed with Claude. **I needed to reach a shared understanding. I didn't need a plan — I needed to be on the same wavelength as the AI, as my agent.** And this is an extremely effective way of doing it."

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

### Sub agent là gì (Matt giải thích cho phòng)

> "This explore sub agent has essentially gone and **called another LLM which has an isolated context window**. And then that LLM has **reported a summary back**. So a sub agent is kind of like a **delegation**. You're delegating a task to a sub agent — it goes, eagerly does all the thing, explores a ton of stuff, and then just **drip feeds the important stuff back up to the orchestrator agent**, to the parent agent."

> 🔑 Đây là kỹ thuật cốt lõi để **ở lại trong smart zone**: việc đọc codebase tốn 94K token, nhưng 94K đó **cháy trong context của thằng khác**. Context chính chỉ nhận về bản tóm tắt.
>
> Cùng nguyên lý sẽ quay lại ở [[07 - QA và Code Review - Nơi con người áp taste]] (review phải clear context) và [[09 - Parallelization - Sandcastle và Push vs Pull]] (mỗi implementer một sandbox riêng).

---

## Chất lượng câu hỏi — phần đáng học nhất

### Câu hỏi 1: Points economy

> "**What actions earn points and how much?**
> My recommendation: keep it simple, two point sources to start."

Matt đồng ý, và bổ sung lý do: *"skip video watch events, **they're noisy and gameable**. Sarah's asked, we'll keep the lessons as the bread and butter."*

### Câu hỏi 2 — ⭐ câu đắt nhất: Retroactive

> "**Should points be retroactive? There are existing lesson progress records with `completed_at` timestamps.**"

Phản ứng của Matt:

> "This is a really nasty question. Should we actually go back and backfill all of the lesson progress events? This is the kind of question that you need to be aligned on if you're going to fulfill the feature properly. **This is not something I considered, and Sarah Chen certainly didn't consider.**"

Ông ấy còn cho cả phòng bỏ phiếu — và *"there are a lot of fence-sitters in the room"*, tức là **kể cả người thật cũng không chắc**.

> 🔑 Đây là giá trị thật của grill-me: nó tìm ra **những câu hỏi mà cả bạn lẫn client đều chưa nghĩ tới**, và đó chính là chỗ dự án chết. Không phải "AI trả lời hộ mình", mà là "AI hỏi hộ mình".

### Câu hỏi khác trong demo

- **Levels: what's the progression curve?**
- **Do streaks earn points?** → Matt: *"streaks are standalone"*
- **Where does the gamification UI live?** → Matt: *"let's have it in the dashboard"*
- **Question 5 (thấy trên màn hình): Descriptions exist on some lessons but not others. Should we (a) include descriptions where they exist, leave blank where they don't, or (b) drop all descriptions?** → recommendation: **(a)** — *"include what's there. They add useful context... a few lessons have them."*

---

## Vì sao mỗi câu hỏi phải kèm recommendation

Dòng `For each question, provide your recommended answer` trong skill không phải trang trí:

> "What's so nice about this is that **not only does it give us a question that kind of aligns us here, we get a recommendation too.** And often what I'll find is **the AI's recommendations are really good.**"

Kết quả thực tế trong demo: Matt trả lời rất nhiều câu chỉ bằng *"yeah, looks good"* / *"I'm just going to go with his recommendation cuz I'm lazy."*

→ Không có recommendation thì mỗi câu hỏi là một gánh nặng nhận thức. Có recommendation thì phần lớn câu chỉ cần **xác nhận**, chỉ số ít cần suy nghĩ thật.

Và dòng `Ask the questions one at a time` cũng có lý do:

> "Notice too how **I'm able to keep in the loop here with AI.** It's pinging me these questions pretty quickly. **I'm not having to go off and check Twitter or something.**"

→ Hỏi từng câu một giữ được nhịp. Hỏi 20 câu cùng lúc thì mình bỏ đi làm việc khác và mất luồng.

---

## Session dài bao lâu?

> "This grill me skill — this can last a long time. **I've had it ask me 40 questions. I've had it ask me 80 questions. I've had some people that it asks 100 questions too.** Literally you're sat there for an hour chatting to the [AI]."

Trong demo, vì đang chạy workshop nên ông ấy **ép nó nhanh lại**:

```
Give me a long list of all your recommendations.
I'm running a workshop right now, so I artificially need you to pull more weight.
```

Kết quả: **nó tự trả lời 22 câu hỏi của chính nó**, tổng context dùng hết **25k token**.

> "That's quite representative of what a grilling session looks like. At this point I have used 25k tokens and **all of that stuff is gold. I want to keep that around. I've got 25k great tokens there.**"

---

## Biến thể: dùng với meeting transcript `[00:21-00:22]`

> "This can also function like this. You can have a meeting with someone who's a domain expert. Maybe I have a meeting with Sarah, I feed that meeting transcript into — I don't know, Gemini meetings or whatever you guys are using. **You take that, you feed it into a grilling session, and you grill through the assumptions that you didn't have.**"

> "This ends up being a really nice way of just **taking inputs from the world and then validating them.**"

→ Pattern tổng quát: **bất kỳ input mơ hồ nào từ thế giới thật** (meeting note, ticket, email, feedback khách) đều có thể ném vào grilling session để đào ra các giả định ngầm.

---

## Phân loại task: Human-in-the-loop vs AFK `[00:26-00:27]`

Có người trên Slido gợi ý *"okay, Ralph loop this"* (tức tự động hoá luôn cả grilling). Matt bác:

> "**This is crucial because I can't loop over this.** I think of there being **two types of tasks in the AI age**:
> - **Human in the loop tasks**, where a human needs to sit there and do it — which is this. We are the human in the loop, with **multiple humans** in the loop.
> - And there are **AFK tasks**, where the human can be away from the keyboard and it doesn't matter. Implementation, as we'll see, can be turned into an AFK task.
>
> **But planning, this alignment phase, has to be human in the loop. Has to be.**"

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

Lý do rất cụ thể, lấy từ việc dạy học:

> "What I've noticed — a lot of my students, they tend to **overuse a certain stack**. They get into trouble, and because they **don't own the stack and they don't have observability over the whole thing**, they just go: *this isn't working, this sucks.* Whereas if you have control over the whole thing, then **at least you know how to fix it**, or potentially know how to fix it."

Và ông ấy tự áp lên chính mình:

> "So even though I'm sort of giving you a stack basically, **I believe in inversion of control and you should be in control of the stack.**"

> 🔑 Áp dụng: đừng chép nguyên skill của Matt rồi dùng như hộp đen. Skill của ông ấy ngắn (5 dòng) **chính là để bạn đọc hiểu và sửa được**.

### Grill Me hợp với PO hơn là dev — trong team lớn thì ai dùng? `[00:24-00:25]`

Matt trả lời bằng cách hỏi ngược: ai từng pair programming? Ai từng **pair programming với AI**?

> "I think pair programming sessions with AI is a great idea because **you've got a third person in the room who will relentlessly quiz you and ask you questions.**"

Nguyên tắc ông ấy đưa ra:

- Câu hỏi **domain** → trong phòng phải có: **bạn + domain expert + AI**
- Câu hỏi **implementation** → trong phòng phải có: **bạn + một dev khác + AI**

> "The really crucial decisions, the ones you need humans for — **you actually need a lot of humans**, and it doesn't really matter how many humans are in there. You can throw a bunch — **kind of like mob programming with AI** essentially."

### Sao không dùng `AskUserQuestion` UI của Claude Code? `[00:27-00:28]`

Ông ấy demo thử luôn rồi chê:

> "This UI is just **sort of broken in Claude and I really hate it.** You notice **I'm using Claude, but I don't like Claude very much.** You really are free with this method to choose any system you like."

> "It's **very pleasing when you first encounter it**, but then you realize it is **actually broken in a ton of different ways**."

→ Nên grill-me hỏi bằng **text thường**, không dùng UI đặc biệt. Cũng là lý do method này port sang tool khác được.

### Làm sao lưu lại các quyết định **phủ định**? `[00:58]`

*(Câu này hỏi ở phase sau nhưng thuộc về đây.)*

> "There's a very simple answer, which is: in the **write-a-PRD** section, there is a section at the bottom of **the things that are out of scope**. So the things we're not going to tackle in this PRD — **which is very important for giving a definition of done.**"

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
