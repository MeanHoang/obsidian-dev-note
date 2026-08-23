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

**Dịch:** *"Tới giờ ta đã lấy một ý tưởng. Ta đã **tự quay** mình về ý tưởng đó. Ta có thể bỏ qua research và prototype, nhưng ta biến nó thành một **PRD, thành một destination document.** Rồi ta biến PRD đó thành một **Kanban board.** Và **tất cả các bước đó đều được con người review.***
>
> *Và giờ tới giai đoạn implementation — **ta lùi lại.** Và ta để một agent xử lý cái Kanban board đó, **hoặc nhiều agent** cùng xử lý nó."*

Ẩn dụ:

> "Yeah, we spent a lot of time planning here, but it means that **we've queued up a lot of work for the agent.** We can think of this as kind of like **the day shift and the night shift.** This is **the day shift for the human** — planning everything, getting all the stuff ready. And then **once we kick it over to the night shift, the AI can just work AFK.**"

**Dịch:** *"Đúng là ta đã tốn nhiều thời gian cho việc planning, nhưng nó có nghĩa là **ta đã xếp sẵn một hàng dài công việc cho agent.** Ta có thể nghĩ về nó như **ca ngày và ca đêm.** Đây là **ca ngày của con người** — lên kế hoạch mọi thứ, chuẩn bị sẵn sàng. Rồi **khi ta đá nó sang ca đêm, AI cứ thế làm việc AFK.**"*

> 🔑 **Ý là:** Cách nghĩ này định hình lại cả ngày làm việc. Ban ngày mình **nạp backlog**; agent chạy khi mình không ngồi đó (đêm, hoặc đơn giản là lúc mình đang họp).
>
> Và nó trả lời câu hỏi ngầm "sao phải plan lâu thế?" — **toàn bộ phần plan phía trước tồn tại là để có đủ việc chất lượng cho ca đêm.** Plan sơ sài = ca đêm hết việc sau 20 phút, hoặc tệ hơn: chạy sai suốt đêm.

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

**Dịch:** *"Về cơ bản nó chỉ là một script bash, nơi ta **lấy toàn bộ issue nằm trong các file markdown, và `cat` chúng vào một biến local.** Nên biến issues đó chứa **toàn bộ issue trong cả backlog của ta.** Rồi ta lấy **5 commit gần nhất** — tôi sẽ giải thích vì sao ngay đây. Rồi ta lấy prompt và **chạy Claude Code với permission mode accept edits.**"*

> 💡 **`--permission-mode acceptEdits`** = chế độ tự động chấp nhận mọi thay đổi file, không hỏi xác nhận. Bắt buộc phải có để chạy AFK — nhưng cũng là lý do phải chạy trong **Docker sandbox**.

> ⚠️ Matt nói *"I'll explain why in a minute"* về 5 commit gần nhất — nhưng trong transcript **ông ấy không quay lại giải thích**.
>
> Suy đoán hợp lý: để agent biết vừa có gì thay đổi mà không phải đọc lại toàn bộ git history (tốn context), và để **không nhặt nhầm issue vừa mới xong** ở vòng lặp trước. Nếu tự dựng thì đây là chỗ cần tự quyết.

### Vì sao phải chạy `once` nhiều lần trước

> "This is the **human in the loop version**. And **this is essential.** Running this again and again is essential because **you're going to see what the agent does and see how it ends up working.** And **any tuning that you need to add to the prompt, then you can do that.**"

**Dịch:** *"Đây là **phiên bản human in the loop**. Và **cái này là thiết yếu.** Chạy nó lặp đi lặp lại là thiết yếu bởi vì **bạn sẽ thấy agent làm gì và nó vận hành ra sao.** Và **mọi điều chỉnh bạn cần thêm vào prompt, bạn có thể làm ở đây.**"*

> 🔑 **Đây là lời khuyên vận hành quan trọng nhất của phase này.** Nhảy thẳng vào loop AFK = agent chạy sai 5 lần liên tiếp trong lúc bạn đang ngủ, và sáng ra bạn không biết nó sai ở vòng nào.
>
> Chạy `once` = thấy nó sai ở đâu, sửa prompt, chạy lại. Và điều này **chỉ khả thi vì mỗi lần chạy đều bắt đầu từ trạng thái giống nhau** — quay lại nguyên tắc `/clear` ở [[02 - Hai ràng buộc của LLM - Smart zone và Memento]].

### Về Docker sandbox

Bản AFK thật *"is a fair bit more complicated"* và **chạy trong Docker sandbox**.

Ông ấy **không bắt khán giả cài** — lý do rất thực tế:

> "You need to download a special image and **we're going to tank the conference Wi-Fi** if we do that."

**Dịch:** *"Bạn phải tải một image đặc biệt và **chúng ta sẽ làm sập Wi-Fi của hội nghị** nếu làm vậy."*

---

## Prompt của Ralph loop `[00:56-00:57]`

Cấu trúc prompt, theo thứ tự:

### 1. Đầu vào

> "Local issue files from `issues/` are provided at the start of context."

**Dịch:** *"Các file issue local từ thư mục `issues/` được cung cấp ở đầu context."*

### 2. Lọc theo nhãn

> "You're going to **work on the AFK issues only.**"

**Dịch:** *"Bạn sẽ **chỉ làm các issue có nhãn AFK.**"*

→ Chỗ này là nơi nhãn AFK gắn ở [[05 - Vertical Slices - Cắt issue thành tracer bullets]] phát huy tác dụng. Issue cần người thì agent **không được đụng vào**.

### 3. Điều kiện dừng

> "**If all AFK tasks are complete, output this `no more tasks` thing.**"

**Dịch:** *"**Nếu tất cả task AFK đã xong, hãy in ra cái chuỗi `no more tasks` này.**"*

> 💡 **Ý là:** Đây là một **chuỗi sentinel** (chuỗi canh gác). Script bash bên ngoài grep chuỗi này để biết khi nào thoát vòng lặp.
>
> Không có nó thì loop chạy vô hạn — và tệ hơn: khi hết việc thật, agent sẽ **tự bịa ra việc** để làm, vì nó được yêu cầu "chọn task tiếp theo". Đây là một failure mode rất thật khi chạy AFK.

### 4. ⭐ Thứ tự ưu tiên chọn task

> "It's prioritizing:
> 1. **critical bug fixes**
> 2. **development infrastructure**
> 3. **trace bullets**
> 4. **polishing, quick wins and refactors**"

**Dịch:** *"Nó ưu tiên theo thứ tự: 1. **sửa bug nghiêm trọng**, 2. **hạ tầng phát triển**, 3. **tracer bullet**, 4. **đánh bóng, việc nhanh gọn và refactor**."*

Đọc kỹ thứ tự này — nó là một quan điểm engineering:

| Ưu tiên | Tại sao ở vị trí đó |
|---|---|
| 1. Critical bug fixes | Codebase hỏng thì mọi việc sau đều xây trên nền hỏng |
| 2. **Development infrastructure** | Cải thiện **feedback loop** → nâng trần chất lượng của mọi task sau |
| 3. Tracer bullets | Việc tính năng chính |
| 4. Polish / quick wins / refactor | Việc làm khi rảnh |

> 🔑 **Vị trí số 2 rất đáng chú ý. Dev infrastructure được ưu tiên cao hơn cả tính năng.**
>
> Điều này nhất quán với câu ở phần dưới: *"the quality of your feedback loops... that is the ceiling."* Nếu feedback loop là trần, thì **nâng trần trước rồi hãy xây tiếp** — nếu không, mọi tính năng làm sau đều bị giới hạn bởi cái trần thấp đó.
>
> Nói cách khác: **agent được yêu cầu tự đầu tư vào công cụ của chính nó trước khi làm việc chính.** Ít ai viết prompt như vậy.

### 5. Quy trình thực thi

> "We explore the repo. **Use TDD** to complete the task. We then **run some feedback loops.**"

**Dịch:** *"Ta explore repo. **Dùng TDD** để hoàn thành task. Rồi ta **chạy các feedback loop.**"*

### Cơ chế backlog

> "What we're doing here is essentially **running a backlog, or curating a backlog, that our AFK agent is going to pick up.** That's **the purpose of all of these setups in the beginning** — all the way to this Kanban board — **we're just essentially creating a backlog of tasks for the night shift to pick up.** And the night shift, this Ralph prompt, **it's got its own idea about what a good task looks like to pick up next.**"

**Dịch:** *"Cái ta đang làm ở đây về cơ bản là **vận hành một backlog, hay tuyển chọn một backlog, để agent AFK của ta nhặt lên.** Đó là **mục đích của tất cả các bước setup ban đầu** — cho tới tận cái Kanban board này — **về cơ bản ta chỉ đang tạo ra một backlog công việc cho ca đêm nhặt lên.** Và ca đêm, cái prompt Ralph này, **nó có ý kiến riêng về việc task nào là task tốt để nhặt tiếp theo.**"*

🔑 **Ý là — phân chia trách nhiệm rất rõ:**

| Quyết định gì | Ai quyết |
|---|---|
| *Có những việc gì* | **Con người** (Kanban board) |
| *Việc nào chặn việc nào* | **Con người** (blocking relationships) |
| *Làm việc nào trước* | **Agent** (thứ tự ưu tiên trong prompt) |

Không phải người xếp lịch từng bước (quá cứng, không tận dụng được agent), cũng không phải agent tự nghĩ ra việc (quá lỏng, nó sẽ đi lạc).

### Bản này vẫn là tuần tự

> "I did talk about parallelization — **I will show you this later, but this is essentially a sequential loop here. We're just going to run one coding agent at a time.** This is a good way to just sort of **get your feet wet** essentially."

**Dịch:** *"Tôi có nói về song song hoá — **tôi sẽ cho các bạn xem sau, nhưng cái này về cơ bản là một loop tuần tự. Ta chỉ chạy một coding agent tại một thời điểm.** Đây là cách tốt để **làm quen dần** thôi."*

> 💡 "**get your feet wet**" = nhúng chân xuống nước, tức **thử nghiệm ở mức nhẹ trước khi lao vào**.

Bản song song ở [[09 - Parallelization - Sandcastle và Push vs Pull]].

---

## 🔥 TDD: không phải để cho đẹp `[01:06-01:08]`

*(Đoạn này nằm ở đầu chapter Phase 6 nhưng thuộc về implementation nên để ở đây.)*

> "**TDD I found is absolutely essential for getting the most out of agents.**"

**Dịch:** *"**Tôi thấy TDD là tuyệt đối thiết yếu để vắt được nhiều nhất từ agent.**"*

> 💡 **TDD** = *Test-Driven Development*, phát triển hướng kiểm thử: viết test **trước**, code **sau**.

### Red → Green → Refactor

Có hẳn một **skill riêng** trong repo mô tả cách làm red-green-refactor và dạy AI làm theo.

> 💡 **Red-green-refactor** là chu trình của TDD:
> - 🔴 **Red**: viết một test — nó **fail** (vì code chưa có)
> - 🟢 **Green**: viết code tối thiểu để test **pass**
> - ♻️ **Refactor**: dọn dẹp code, test vẫn phải xanh

> "It's writing **a failing test first.** So it's saying: *okay, I've broken down the idea of what I'm doing and I'm just going to **write a single test that fails**, and then I need to **make the implementation pass**.*"

**Dịch:** *"Nó viết **một test fail trước.** Nó kiểu: ok, tôi đã chia nhỏ ý tưởng về việc mình đang làm và giờ tôi sẽ **viết một test duy nhất mà nó fail**, rồi tôi cần **làm cho implementation pass được test đó**."*

Diễn biến thật trong demo:

1. Nó tạo test cho `gamification service`, dùng lại hạ tầng có sẵn để tạo test database
2. **Test fail vì module chưa tồn tại** → *"Okay, we've confirmed red"* (*"Ok, ta đã xác nhận trạng thái đỏ"*)
3. Viết implementation
4. Chạy lại → pass

### ⭐ Lý do thật: chống AI gian lận test

Matt hỏi phòng: *"Raise your hand if you've ever had AI write bad tests."* — rất nhiều tay.

> "**It tends to try to cheat at the tests** because it's sort of **doing it in layers**. It will do **the entire implementation** and then it will do **the entire test layer just below it.**
>
> Using this technique, **it generally is a lot harder to cheat**, because it's **instrumenting the code before it's then writing the code.**"

**Dịch:** *"**Nó có xu hướng gian lận ở phần test** vì nó **làm theo từng tầng**. Nó sẽ làm **toàn bộ phần implementation** rồi mới làm **toàn bộ tầng test ngay bên dưới.***
>
> *Dùng kỹ thuật này thì **nói chung khó gian lận hơn nhiều**, bởi vì nó **đặt sẵn thiết bị đo lên code trước khi viết code.**"*

> 💡 "**instrumenting**" = gắn thiết bị đo vào (như gắn cảm biến vào máy móc để theo dõi). Ở đây: test được đặt sẵn như một bộ đo, rồi code mới được viết để thoả mãn bộ đo đó.

> 🔑 **Ý là — để ý: đây chính là bệnh code-ngang từ [[05 - Vertical Slices - Cắt issue thành tracer bullets]], chỉ ở quy mô nhỏ hơn.**
>
> AI coi "test" là một **layer**, và viết layer đó sau cùng. Khi test viết sau, nó **đã biết implementation trông thế nào** → nó viết test **vừa khít với code đã có**, kể cả khi code sai.
>
> Ví dụ: hàm tính điểm bị sai công thức, trả về 150 thay vì 100. AI viết test sau sẽ ghi `expect(result).toBe(150)` — test xanh, bug vẫn còn.
>
> TDD ép đảo thứ tự: test viết khi **chưa có gì để bám vào** → test buộc phải mô tả **hành vi mong muốn**, không phải hành vi hiện có.
>
> **Cùng một nguyên lý (ép AI làm dọc thay vì ngang) áp ở hai tầng khác nhau.**

### Nó tốt tới mức Matt thiết kế lại cả cách viết code

> "I find that **TDD is so, so good for places where you can pull it off.** In fact, **it's so good that I sort of warped my whole technique around getting TDD to work better.**"

**Dịch:** *"Tôi thấy **TDD cực kỳ tốt ở những chỗ bạn làm được nó.** Thực tế, **nó tốt tới mức tôi đã bẻ cong toàn bộ kỹ thuật của mình xoay quanh việc làm cho TDD chạy tốt hơn.**"*

> 🔑 **Ý là:** Câu này dẫn thẳng sang [[08 - Deep Modules - Thiết kế codebase cho AI]]. **Deep modules được chọn vì chúng dễ test hơn**, chứ không phải vì lý do thẩm mỹ hay "kiến trúc sạch".
>
> Chuỗi lý luận: muốn AI code tốt → cần feedback loop tốt → cần test tốt → cần TDD chạy được → cần codebase dễ test → cần deep modules.

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

**Dịch:** *"TDD rõ ràng rất quan trọng, và nó quan trọng bởi vì **những feedback loop này là thiết yếu với AI, thiết yếu để AI tạo ra được bất cứ thứ gì hợp lý.** Bởi vì không có nó, **AI hoàn toàn code trong mù loà.***
>
> ***Nếu codebase của bạn không có feedback loop, bạn sẽ không bao giờ, không bao giờ nhận được output tử tế từ AI.***
>
> *Và thứ bạn sẽ thường thấy là **chất lượng feedback loop của bạn quyết định AI có thể code tốt tới đâu. Đó chính là cái trần.***
>
> ***Nên nếu bạn đang nhận output tệ từ AI, thường thì bạn cần nâng chất lượng feedback loop lên.**"*

### Đây là một công cụ chẩn đoán

Khi AI code tệ, phản xạ thông thường là đổ tại prompt hoặc đổi model. Matt đề xuất chỗ nhìn khác:

```
AI code tệ
   ↓
Feedback loop của repo có tốt không?
   ├── Có test không? Test có chạy nhanh không?
   ├── Có type check không?
   ├── Có lint không?
   ├── Agent có TỰ CHẠY được chúng không?
   └── Test có test đúng thứ đáng test không?  ← xem file 08
   ↓
Không tốt → sửa cái này TRƯỚC, đừng đổi prompt
```

> 💡 Gạch đầu dòng thứ tư đáng chú ý: có test mà agent **không tự chạy được** (phải setup phức tạp, phải có DB thật, phải VPN) thì coi như không có. Feedback loop chỉ có giá trị khi nó **nằm trong tầm với của agent**.

Con số cuối buổi: repo có **284 tests**.

---

## Kết quả một vòng loop `[01:08-01:09]`

> "We have ended up with a commit. So we have something to test. **Issue number two is complete.** This is kind of what it looks like when a Ralph loop completes — **you end up with a little summary.** And **we have now something we can QA.**"

**Dịch:** *"Ta kết thúc với một commit. Nên ta có thứ để kiểm thử. **Issue số hai đã hoàn thành.** Đây là hình dạng khi một Ralph loop kết thúc — **bạn nhận được một bản tóm tắt nhỏ.** Và **giờ ta có thứ để QA.**"*

Và đây là chỗ vertical slice trả công:

> "**Because we did the feedback loops, because we did the trace bullets, because we said: okay, give us something reviewable at the end of this — we can immediately go and QA it.**"

**Dịch:** *"**Bởi vì ta đã làm feedback loop, bởi vì ta đã làm tracer bullet, bởi vì ta đã nói: ok, cho chúng tôi một thứ review được ở cuối — nên ta có thể đi QA nó ngay lập tức.**"*

> 🔑 **Ý là:** Nếu slice là horizontal (chỉ có schema), sau một vòng loop sẽ **không có gì để QA**. Bạn phải đợi tới vòng thứ 3 mới bấm được vào app.
>
> Vertical slice làm cho **mỗi vòng loop kết thúc bằng một thứ con người bấm vào được**. Đây là lý do phase 4 và phase 5 phải đi cùng nhau — cắt sai ở phase 4 thì phase 5 mất hết giá trị.

---

## Q&A trong phase này

### Code review nhiều hơn trước — có cách nào không? `[00:59-01:00]`

Câu hỏi kép: *"How to deal with agents producing more code than we can review? How to properly parallelize?"*

**Dịch câu hỏi:** *"Làm sao xử lý việc agent sinh ra nhiều code hơn khả năng review của chúng ta? Làm sao song song hoá cho đúng?"*

Matt hỏi phòng: *"Raise your hand if you feel like you're doing more code review now than you used to."* — rất nhiều tay.

> "**I don't think there's a way to avoid this.** If we delegate all of our coding to agents — **the implementation here is really the only AFK bit.** We then also need to **QA the work and code review the work.**
>
> And if we are running these loops where it's going to implement four issues in one, **it's hard to pair that with the dictum that you should keep pull requests small and self-contained.** Small self-contained PRs means you're needing to do **fewer loops or shorter loops**. Or maybe you do a **big stack of PRs, but that seems horrible as well** — that's still just more separated code to review.
>
> **I don't honestly know what the answer to this yet.** I think **we just need to be ready to be doing more code review**, essentially. Which is not fun. **I don't feel good saying that, but I do think it's probably the way things are going.**"

**Dịch:** *"**Tôi không nghĩ có cách nào tránh được chuyện này.** Nếu ta giao toàn bộ việc code cho agent — **implementation ở đây thực sự là phần AFK duy nhất.** Rồi ta vẫn phải **QA công việc đó và code review công việc đó.***
>
> *Và nếu ta chạy những loop mà nó implement bốn issue trong một lượt, **rất khó ghép cái đó với châm ngôn rằng pull request nên nhỏ và độc lập.** PR nhỏ và độc lập nghĩa là bạn phải chạy **ít loop hơn hoặc loop ngắn hơn**. Hoặc có thể bạn làm **một chồng PR lớn, nhưng cái đó nghe cũng kinh khủng** — vẫn chỉ là nhiều code bị tách rời ra để review.*
>
> ***Thành thật mà nói tôi chưa biết câu trả lời cho chuyện này.** Tôi nghĩ **ta chỉ cần sẵn sàng cho việc phải code review nhiều hơn**, về cơ bản là vậy. Điều đó không vui. **Tôi không thấy thoải mái khi nói ra điều này, nhưng tôi nghĩ đó có lẽ là hướng mọi thứ đang đi.**"*

> 💡 "**dictum**" = châm ngôn, lời răn được coi là chuẩn mực.

> 🔑 **Ý là — đây là vấn đề mở chưa có lời giải**, và đáng giá vì Matt không giả vờ có. Mâu thuẫn thật:
>
> - Loop AFK hiệu quả **khi chạy dài** (nhiều issue một mạch, ít overhead)
> - Code review hiệu quả **khi PR nhỏ** (dễ đọc, dễ bắt lỗi)
>
> Hai thứ này **kéo ngược nhau**, và hiện chưa ai giải được. Nếu áp dụng workflow này, hãy chuẩn bị tinh thần đây là chỗ đau.

### Áp dụng trong team thì sao? Thực tế lộn xộn hơn nhiều `[01:00-01:02]`

Câu hỏi từ khán giả (rất hay):

> "The approach is very linear from an idea to QA/code review. Of course the real world is a lot more messy. You have all these ideas in parallel and nobody has the full picture. And while you're working on something, something else comes in as a bug. How do you deal with the messiness? How do you tighten that feedback loop?"

**Dịch câu hỏi:** *"Cách tiếp cận này rất tuyến tính, từ ý tưởng tới QA/code review. Nhưng tất nhiên thế giới thật thì lộn xộn hơn nhiều. Bạn có cả đống ý tưởng chạy song song và không ai nắm được bức tranh toàn cảnh. Và trong lúc bạn đang làm một việc, một việc khác ập tới dưới dạng bug. Anh xử lý sự lộn xộn đó thế nào? Làm sao siết chặt được feedback loop đó?"*

> "If you have an idea up there, **the journey from the idea to the destination is something you need to figure out with the team.** All of this stuff up here — **this is kind of team stuff.**
>
> If you have an idea and you do a grilling session on it and **you have a question that you don't know how to answer, then you need to loop in your team.** Then you might need to go: *okay, we just need to **build a prototype** of this. We need something that **the domain experts can fiddle with**.* Or: *we might need to **integrate a third-party library**. We might need to **do some research**, find a third-party service.*
>
> **We might need to go back with the information that we gathered there to the idea phase.**
>
> So all the way up to the PRD and the journey — **that's something you need to involve your team with. That's something where these assets are going to be shared over, and you're going to have requests for comments on them, and that loop is going to just keep grinding and grinding until you figure out where you're going.**
>
> **Once you figure out where you're going, then you can start doing the Kanban board implementation.** But this is essentially super arguable and **you'll be bouncing back and forth between the phases.**"

**Dịch:** *"Nếu bạn có một ý tưởng ở trên đó, **hành trình từ ý tưởng tới điểm đến là thứ bạn cần tìm ra cùng với team.** Toàn bộ phần phía trên này — **đây là việc của team.***
>
> *Nếu bạn có ý tưởng và bạn làm một phiên grilling về nó, và **bạn gặp một câu hỏi bạn không biết trả lời, thì bạn cần kéo team vào.** Rồi bạn có thể phải nói: ok, ta chỉ cần **dựng một prototype** cho cái này. Ta cần một thứ mà **các domain expert có thể vọc vào được**. Hoặc: ta có thể phải **tích hợp một thư viện bên thứ ba**. Ta có thể phải **nghiên cứu chút**, tìm một dịch vụ bên thứ ba.*
>
> ***Ta có thể phải quay ngược lại giai đoạn ý tưởng với những thông tin thu thập được ở đó.***
>
> *Nên toàn bộ phần cho tới PRD và hành trình — **đó là thứ bạn cần lôi kéo team vào. Đó là chỗ những tài sản này được chia sẻ, và bạn sẽ nhận được các yêu cầu góp ý về chúng, và vòng lặp đó cứ nghiến đi nghiến lại cho tới khi bạn tìm ra mình đang đi đâu.***
>
> ***Một khi bạn xác định được mình đi đâu, thì bạn mới bắt đầu triển khai Kanban board.** Nhưng cái này về cơ bản là cực kỳ tranh cãi được và **bạn sẽ nảy qua nảy lại giữa các phase.**"*

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

> 🔑 **Ý là:** Phần **trên** vạch: lộn xộn, lặp, cần người, cần team, không automate được. Phần **dưới** vạch: tuyến tính và tự động được.
>
> **Đừng nhầm hai vùng này với nhau.** Sai lầm phổ biến là cố automate phần trên (vì nó chậm và mệt) — kết quả là ship nhanh những thứ sai.

### Sao không để AI QA luôn? `[01:04-01:05]`

Câu trả lời đầy đủ nằm ở [[07 - QA và Code Review - Nơi con người áp taste]], nhưng ý chính:

> "Of course you absolutely can. **You definitely should do an automated review step as part of implementation** — because **tokens are pretty cheap and AI is actually really good at reviewing stuff.** You should get it to review its own code before you then QA. **I found that that catches a ton of different bugs.**"

**Dịch:** *"Tất nhiên là bạn hoàn toàn có thể. **Bạn chắc chắn nên có một bước review tự động như một phần của implementation** — bởi vì **token khá rẻ và AI thực sự rất giỏi review.** Bạn nên bắt nó review chính code của nó trước khi bạn QA. **Tôi thấy cái đó bắt được cả tá bug khác nhau.**"*

⚠️ Kèm điều kiện quan trọng về clear context — xem file tiếp theo.

### Về architecture, API contract, security constraint `[01:03-01:04]`

Khán giả hỏi: *"In your system, how do you integrate respecting an architecture and design with API contracts and fitting with your larger system, security constraints?"*

**Dịch câu hỏi:** *"Trong hệ thống của anh, làm sao anh tích hợp việc tôn trọng một kiến trúc và thiết kế với các API contract, và khớp với hệ thống lớn hơn, các ràng buộc bảo mật?"*

Matt hoãn: *"There's a lot in that question... I'm going to answer that in a bit."* → trả lời ở [[09 - Parallelization - Sandcastle và Push vs Pull]] (push vs pull).

---

## Ý cần nhớ

- **Day shift (người, plan) / night shift (agent, implement).** Plan tồn tại để nạp đủ việc cho ca đêm.
- **Chạy `once.sh` nhiều lần trước khi loop.** Đây là lúc tune prompt — và chỉ làm được vì mỗi lần chạy đều xuất phát giống nhau.
- Prompt Ralph cần: lọc nhãn AFK, **sentinel để dừng** (không có thì agent tự bịa việc), thứ tự ưu tiên, quy trình TDD.
- **Dev infrastructure đứng trên tính năng** trong thứ tự ưu tiên — vì nó nâng trần cho mọi việc sau.
- Người quyết *có việc gì*, agent quyết *làm việc nào trước*.
- **TDD để chống AI gian lận test**, không phải để cho đẹp. Cùng một nguyên lý "ép làm dọc" như vertical slice.
- **Chất lượng feedback loop = trần chất lượng của AI.** AI code tệ → sửa feedback loop trước, đừng đổi prompt. Và test phải nằm trong tầm tự chạy của agent.
- **Chưa ai giải được** mâu thuẫn giữa loop dài và PR nhỏ. Chuẩn bị tinh thần review nhiều hơn.
- Phần **trên PRD** lộn xộn và cần team. Phần **dưới PRD** mới tuyến tính. Đừng automate nhầm phần.

---

[[05 - Vertical Slices - Cắt issue thành tracer bullets|← Trước]] · [[00 - README|Mục lục]] · [[07 - QA và Code Review - Nơi con người áp taste|Tiếp: QA →]]
