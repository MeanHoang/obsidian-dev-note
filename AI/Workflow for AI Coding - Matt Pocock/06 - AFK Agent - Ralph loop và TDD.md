---
tags:
  - ai
  - ai-coding
  - agent
  - tdd
timestamp: 48:15 - 01:05:30
chapter: "Phase 5: Implementation with AI Agents"
---

# 06 — AFK Agent: Ralph loop & TDD

`[48:15 – 01:05:30]` · [[05 - Vertical Slices - Cắt issue thành tracer bullets|← Trước]] · [[00 - README|Mục lục]] · [[07 - QA và Code Review - Nơi con người áp taste|Tiếp →]]

> Đây là chỗ **con người rời khỏi vòng lặp**.

---

## Ẩn dụ: day shift / night shift `[00:52-00:53]`

Matt tóm tắt lại toàn bộ hành trình tới lúc này:

> "So far we have taken an idea. We've **grilled** ourselves about the idea. We can skip over research and prototype, but we turn that into a **PRD, into a destination document.** We then turn that PRD into a **Kanban board.** And **all of those steps are human reviewed.**
>
> And now the implementation stage — **we step back.** And we let an agent work through that Kanban board, **or multiple agents** work through the Kanban board."

Ẩn dụ:

> "Yeah, we spent a lot of time planning here, but it means that **we've queued up a lot of work for the agent.** We can think of this as kind of like **the day shift and the night shift.** This is **the day shift for the human** — planning everything, getting all the stuff ready. And then **once we kick it over to the night shift, the AI can just work AFK.**"

> 🔑 Cách nghĩ này định hình lại cả ngày làm việc: ban ngày mình **nạp backlog**, agent chạy khi mình không ngồi đó. Toàn bộ phần plan phía trước tồn tại là để **có đủ việc chất lượng cho ca đêm**.

---

## `once.sh` — chạy một lần trước, loop sau `[00:54-00:55]`

Matt cố tình bắt đầu bằng **bản không loop**.

### Script làm gì

```bash
# 1. Gom toàn bộ issue markdown vào một biến
ISSUES=$(cat issues/*.md)

# 2. Lấy 5 commit gần nhất
RECENT=$(git log -5 ...)

# 3. Chạy Claude Code với accept-edits, nhét hết vào
claude --permission-mode acceptEdits "$PROMPT ... $ISSUES ... $RECENT"
```

Nguyên văn:

> "It's essentially just a bash script where we **grab all of the issues, which are inside markdown files, and we `cat` them into a local variable.** So that issues variable contains **all of the issues that are in our entire backlog.** Then we grab **the last five commits** — I'll explain why in a minute. And then we grab the prompt and we just **run Claude Code with permission mode accept edits.**"

> ⚠️ Matt nói *"I'll explain why in a minute"* về 5 commit gần nhất — nhưng trong transcript **ông ấy không quay lại giải thích**. Suy đoán hợp lý: để agent biết vừa có gì thay đổi mà không phải đọc lại toàn bộ git history (và không nhặt nhầm issue đã xong). Nếu tự dựng thì đây là chỗ cần tự quyết.

### Vì sao phải chạy `once` nhiều lần trước

> "This is the **human in the loop version**. And **this is essential.** Running this again and again is essential because **you're going to see what the agent does and see how it ends up working.** And **any tuning that you need to add to the prompt, then you can do that.**"

> 🔑 Đây là lời khuyên vận hành quan trọng nhất của phase này. Nhảy thẳng vào loop AFK = agent chạy sai 5 lần liên tiếp khi bạn đang ngủ. Chạy `once` = thấy nó sai ở đâu, sửa prompt, rồi mới thả.

### Về Docker sandbox

Bản AFK thật *"is a fair bit more complicated"* và **chạy trong Docker sandbox**.

Ông ấy **không bắt khán giả cài** — lý do rất thực tế: *"You need to download a special image and **we're going to tank the conference Wi-Fi** if we do that."*

---

## Prompt của Ralph loop `[00:56-00:57]`

Cấu trúc prompt, theo thứ tự:

### 1. Đầu vào

> "Local issue files from `issues/` are provided at the start of context."

### 2. Lọc theo nhãn

> "You're going to **work on the AFK issues only.**"

→ Chỗ này là nơi nhãn AFK gắn ở [[05 - Vertical Slices - Cắt issue thành tracer bullets]] phát huy tác dụng. Issue cần người thì agent **không được đụng vào**.

### 3. Điều kiện dừng

> "**If all AFK tasks are complete, output this `no more tasks` thing.**"

→ Một **chuỗi sentinel**. Script bên ngoài grep chuỗi này để biết khi nào thoát loop. Không có nó thì loop chạy vô hạn.

### 4. ⭐ Thứ tự ưu tiên chọn task

> "It's prioritizing:
> 1. **critical bug fixes**
> 2. **development infrastructure**
> 3. **trace bullets**
> 4. **polishing, quick wins and refactors**"

Đọc kỹ thứ tự này — nó là một quan điểm engineering:

| Ưu tiên | Tại sao ở vị trí đó |
|---|---|
| 1. Critical bug fixes | Codebase hỏng thì mọi việc sau đều xây trên nền hỏng |
| 2. **Development infrastructure** | Cải thiện **feedback loop** → nâng trần chất lượng của mọi task sau |
| 3. Tracer bullets | Việc tính năng chính |
| 4. Polish / quick wins / refactor | Việc làm khi rảnh |

> 🔑 Vị trí số 2 rất đáng chú ý. **Dev infrastructure được ưu tiên cao hơn cả tính năng.** Điều này nhất quán với câu ở phase sau: *"the quality of your feedback loops... that is the ceiling."* Agent tự đầu tư vào công cụ của chính nó trước.

### 5. Quy trình thực thi

> "We explore the repo. **Use TDD** to complete the task. We then **run some feedback loops.**"

### Cơ chế backlog

> "What we're doing here is essentially **running a backlog, or curating a backlog, that our AFK agent is going to pick up.** That's **the purpose of all of these setups in the beginning** — all the way to this Kanban board — **we're just essentially creating a backlog of tasks for the night shift to pick up.** And the night shift, this Ralph prompt, **it's got its own idea about what a good task looks like to pick up next.**"

> 🔑 Phân chia trách nhiệm rất rõ:
> - **Con người** quyết định *có những việc gì* và *việc nào chặn việc nào* (Kanban board)
> - **Agent** quyết định *làm việc nào trước* (thứ tự ưu tiên trong prompt)
>
> Không phải người xếp lịch từng bước, cũng không phải agent tự nghĩ ra việc.

### Bản này vẫn là tuần tự

> "I did talk about parallelization — **I will show you this later, but this is essentially a sequential loop here. We're just going to run one coding agent at a time.** This is a good way to just sort of **get your feet wet** essentially."

Bản song song ở [[09 - Parallelization - Sandcastle và Push vs Pull]].

---

## 🔥 TDD: không phải để cho đẹp `[01:06-01:08]`

*(Đoạn này nằm ở đầu chapter Phase 6 nhưng thuộc về implementation nên để ở đây.)*

> "**TDD I found is absolutely essential for getting the most out of agents.**"

### Red → Green → Refactor

Có hẳn một **skill riêng** trong repo mô tả cách làm red-green-refactor và dạy AI làm theo.

> "It's writing **a failing test first.** So it's saying: *okay, I've broken down the idea of what I'm doing and I'm just going to **write a single test that fails**, and then I need to **make the implementation pass**.*"

Diễn biến thật trong demo:

1. Nó tạo test cho `gamification service`, dùng lại hạ tầng có sẵn để tạo test database
2. **Test fail vì module chưa tồn tại** → *"Okay, we've confirmed red"*
3. Viết implementation
4. Chạy lại → pass

### ⭐ Lý do thật: chống AI gian lận test

Matt hỏi phòng: *"Raise your hand if you've ever had AI write bad tests."* — rất nhiều tay.

> "**It tends to try to cheat at the tests** because it's sort of **doing it in layers**. It will do **the entire implementation** and then it will do **the entire test layer just below it.**
>
> Using this technique, **it generally is a lot harder to cheat**, because it's **instrumenting the code before it's then writing the code.**"

> 🔑 Để ý: đây **chính là bệnh code-ngang** từ [[05 - Vertical Slices - Cắt issue thành tracer bullets]], chỉ ở quy mô nhỏ hơn. AI coi "test" là một layer, viết sau cùng. Khi test viết sau, nó biết implementation trông thế nào → **viết test vừa khít với code đã có**, kể cả khi code sai.
>
> TDD ép đảo thứ tự: test viết khi **chưa có gì để bám vào** → test buộc phải mô tả **hành vi mong muốn**, không phải hành vi hiện có.
>
> Cùng một nguyên lý (ép AI làm dọc thay vì ngang) áp ở hai tầng khác nhau.

### Nó tốt tới mức Matt thiết kế lại cả cách viết code

> "I find that **TDD is so, so good for places where you can pull it off.** In fact, **it's so good that I sort of warped my whole technique around getting TDD to work better.**"

→ Câu này dẫn thẳng sang [[08 - Deep Modules - Thiết kế codebase cho AI]]. Deep modules được chọn **vì chúng dễ test hơn**, chứ không phải vì lý do thẩm mỹ.

---

## 🔥 Feedback loop là trần chất lượng `[01:09-01:10]`

Sau khi loop chạy xong, nó tự chạy `npm run test` và `npm run type check`. Nó bắt được **1 type error** và tự sửa (*"Yeah, `typeof levelThreshold` number. Okay."*).

Đây là chỗ Matt phát biểu câu quan trọng nhất về chất lượng:

> "TDD is obviously really important, and it's really important because **these feedback loops are essential to AI, essential to get AI to produce anything reasonable.** Because without this, **AI is totally coding blind.**
>
> **If your code base doesn't have feedback loops, you're never ever ever going to get decent output out of AI.**
>
> And often what you'll find is that **the quality of your feedback loops influences how good your AI can code. That is the ceiling.**
>
> **So if you're getting bad outputs from your AI, you often need to increase the quality of your feedback loops.**"

### Đây là một công cụ chẩn đoán

Khi AI code tệ, phản xạ thông thường là đổ tại prompt hoặc đổi model. Matt đề xuất chỗ nhìn khác:

```
AI code tệ
   ↓
Feedback loop của repo có tốt không?
   ├── Có test không? Test có chạy nhanh không?
   ├── Có type check không?
   ├── Có lint không?
   ├── Agent có tự chạy được chúng không?
   └── Test có test đúng thứ đáng test không?  ← xem 08
   ↓
Không tốt → sửa cái này TRƯỚC, đừng đổi prompt
```

Con số cuối buổi: repo có **284 tests**.

---

## Kết quả một vòng loop `[01:08-01:09]`

> "We have ended up with a commit. So we have something to test. **Issue number two is complete.** This is kind of what it looks like when a Ralph loop completes — **you end up with a little summary.** And **we have now something we can QA.**"

Và đây là chỗ vertical slice trả công:

> "**Because we did the feedback loops, because we did the trace bullets, because we said: okay, give us something reviewable at the end of this — we can immediately go and QA it.**"

> 🔑 Nếu slice là horizontal (chỉ có schema), sau một vòng loop sẽ **không có gì để QA**. Vertical slice làm cho mỗi vòng loop kết thúc bằng **một thứ con người bấm vào được**.

---

## Q&A trong phase này

### Code review nhiều hơn trước — có cách nào không? `[00:59-01:00]`

Câu hỏi kép: *"How to deal with agents producing more code than we can review? How to properly parallelize?"*

Matt hỏi phòng: *"Raise your hand if you feel like you're doing more code review now than you used to."* — rất nhiều tay.

> "**I don't think there's a way to avoid this.** If we delegate all of our coding to agents — **the implementation here is really the only AFK bit.** We then also need to **QA the work and code review the work.**
>
> And if we are running these loops where it's going to implement four issues in one, **it's hard to pair that with the dictum that you should keep pull requests small and self-contained.** Small self-contained PRs means you're needing to do **fewer loops or shorter loops**. Or maybe you do a **big stack of PRs, but that seems horrible as well** — that's still just more separated code to review.
>
> **I don't honestly know what the answer to this yet.** I think **we just need to be ready to be doing more code review**, essentially. Which is not fun. **I don't feel good saying that, but I do think it's probably the way things are going.**"

> 🔑 Đây là **vấn đề mở chưa có lời giải** — và đáng giá vì Matt không giả vờ có. Có một mâu thuẫn thật:
>
> - Loop AFK hiệu quả **khi chạy dài** (nhiều issue một mạch)
> - Code review hiệu quả **khi PR nhỏ**
>
> Hai thứ này kéo ngược nhau, và hiện chưa ai giải được. Nếu áp dụng workflow này, hãy chuẩn bị tinh thần đây là chỗ đau.

### Áp dụng trong team thì sao? Thực tế lộn xộn hơn nhiều `[01:00-01:02]`

Câu hỏi từ khán giả (rất hay): *"The approach is very linear from idea to QA/code review. Of course the real world is a lot more messy — you have all these ideas in parallel and nobody has the full picture. While you're working on something, something else comes in as a bug. How do you deal with the messiness?"*

> "If you have an idea up there, **the journey from the idea to the destination is something you need to figure out with the team.** All of this stuff up here — **this is kind of team stuff.**
>
> If you have an idea and you do a grilling session on it and **you have a question that you don't know how to answer, then you need to loop in your team.** Then you might need to go: *okay, we just need to **build a prototype** of this. We need something that **the domain experts can fiddle with**.* Or: *we might need to **integrate a third-party library**. We might need to **do some research**, find a third-party service.*
>
> **We might need to go back with the information that we gathered there to the idea phase.**
>
> So all the way up to the PRD and the journey — **that's something you need to involve your team with. That's something where these assets are going to be shared over, and you're going to have requests for comments on them, and that loop is going to just keep grinding and grinding until you figure out where you're going.**
>
> **Once you figure out where you're going, then you can start doing the Kanban board implementation.** But this is essentially super arguable and **you'll be bouncing back and forth between the phases.**"

Sơ đồ đúng hơn:

```
        ┌──── vòng lặp lộn xộn, có người, có tranh cãi ────┐
        │                                                   │
   idea ⇄ grill ⇄ research ⇄ prototype ⇄ PRD ─────────────┘
                                          │
                    ═══════ chốt đích ════╪══════
                                          ↓
                              Kanban → implement (tuyến tính, AFK)
```

→ Phần **trên** vạch: lộn xộn, lặp, cần người, cần team. Phần **dưới**: tuyến tính và tự động được. Đừng nhầm hai vùng này với nhau.

### Sao không để AI QA luôn? `[01:04-01:05]`

Câu trả lời đầy đủ nằm ở [[07 - QA và Code Review - Nơi con người áp taste]], nhưng ý chính:

> "Of course you absolutely can. **You definitely should do an automated review step as part of implementation** — because **tokens are pretty cheap and AI is actually really good at reviewing stuff.** You should get it to review its own code before you then QA. **I found that that catches a ton of different bugs.**"

⚠️ Kèm điều kiện quan trọng về clear context — xem file tiếp theo.

### Về architecture, API contract, security constraint `[01:03-01:04]`

Khán giả hỏi: *"How do you integrate respecting an architecture and design with API contracts, fitting with your larger system, security constraints?"*

Matt hoãn: *"There's a lot in that question... I'm going to answer that in a bit."* → trả lời ở [[09 - Parallelization - Sandcastle và Push vs Pull]] (push vs pull).

---

## Ý cần nhớ

- **Day shift (người, plan) / night shift (agent, implement).** Plan tồn tại để nạp đủ việc cho ca đêm.
- **Chạy `once.sh` nhiều lần trước khi loop.** Đây là lúc tune prompt.
- Prompt Ralph cần: lọc nhãn AFK, **sentinel để dừng**, thứ tự ưu tiên, quy trình TDD.
- **Dev infrastructure đứng trên tính năng** trong thứ tự ưu tiên — vì nó nâng trần cho mọi việc sau.
- Người quyết *có việc gì*, agent quyết *làm việc nào trước*.
- **TDD để chống AI gian lận test**, không phải để cho đẹp. Cùng một nguyên lý "ép làm dọc" như vertical slice.
- **Chất lượng feedback loop = trần chất lượng của AI.** AI code tệ → sửa feedback loop trước, đừng đổi prompt.
- **Chưa ai giải được** mâu thuẫn giữa loop dài và PR nhỏ. Chuẩn bị tinh thần review nhiều hơn.

---

[[05 - Vertical Slices - Cắt issue thành tracer bullets|← Trước]] · [[00 - README|Mục lục]] · [[07 - QA và Code Review - Nơi con người áp taste|Tiếp: QA →]]
