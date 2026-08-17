---
tags:
  - ai
  - ai-coding
  - qa-notes
timestamp: 01:34:06 - 01:36:30 (+ Q&A rải rác cả buổi)
chapter: Final Takeaways & Summary
---

# 10 — Tổng kết & Q&A

`[01:34:06 – 01:36:30]` + Q&A rải rác · [[09 - Parallelization - Sandcastle và Push vs Pull|← Trước]] · [[00 - README|Mục lục]]

---

## Phần A — Lời tổng kết của Matt `[01:33-01:36]`

Ông ấy tự nhận đã kiệt sức: *"We have nominally 17 minutes left. I don't know about you guys, but **I'm knackered.**"*

### Tóm tắt nguyên văn

> "This is essentially the flow, where **throughout this whole process, we're bearing in mind the shape of our code base.**
>
> **This is not a spec-to-code compiler. This is not an AI that's just churning out code.** We are being **very intentional with the kind of modules and the shape of the code base that we want.**
>
> We are making sure that **we are as aligned as possible by using the grilling session**, by really hammering out our idea.
>
> **We're not over-indexing into the PRD. We're not trying to read every part of it. We're not thinking too much about it even.**
>
> We're then just turning that into **a set of parallelizable issues** which can be worked on by agents in parallel.
>
> We implement it, and **we QA and code review the hell out of it**, and then keep going back to that implementation."

Rồi bổ sung phần ông ấy quên nhắc:

> "One thing I didn't really mention is that **the QA phase is for creating more issues for that Kanban board.** So while it's implementing even, **you can be QAing the stuff and going back, adding more issues.**"

Và bàn giao cho team:

> "Once you've got work that you're happy with, then **you can share it with your team and you can get a full review.** So this is kind of **one developer, or maybe a couple of developers, managing this** — and then it's up to you to figure out how to merge it back in."

### Lời khuyên chốt buổi

Đầu tiên là một lời từ chối:

> "**Of course all of this can be customized by you. This is just something that I have found works. I'm not trying to sell you on an approach here.**"

Rồi mới tới lời khuyên thật:

> "**What I recommend, if you take one thing away from this session:** you should head back, you should **head to Amazon and just buy a ton of those old books.** Because I just found it **so enlightening** reading them. **Pre-AI writing is always really fun to read anyway.** I just — **on every single page I found that there was something useful and something interesting to read.**"

*(Trước đó ở `[01:23]` ông ấy cũng nói "if you take one thing away from today" nhưng về skill `improve-codebase-architecture`. Hai lời khuyên "một thứ duy nhất" — cái thứ hai là lời kết chính thức.)*

---

## Phần B — Bốn ý xuyên suốt

Đọc lại toàn bộ 10 file, có bốn mẫu hình lặp đi lặp lại:

### 1. Quản lý smart zone là kỹ năng nền

| Kỹ thuật | Ở file nào |
|---|---|
| System prompt tối thiểu | [[02 - Hai ràng buộc của LLM - Smart zone và Memento]] |
| `/clear` thay vì `/compact` | [[02 - Hai ràng buộc của LLM - Smart zone và Memento]] |
| Sub agent explore (94K token cháy ở nơi khác) | [[03 - Grill Me - Đạt shared understanding]] |
| Task nhỏ vừa smart zone | [[05 - Vertical Slices - Cắt issue thành tracer bullets]] |
| Clear context trước khi review | [[07 - QA và Code Review - Nơi con người áp taste]] |
| Codebase deep để explore rẻ | [[08 - Deep Modules - Thiết kế codebase cho AI]] |
| Pull thay vì push cho implementer | [[09 - Parallelization - Sandcastle và Push vs Pull]] |
| Mỗi agent song song một context riêng | [[09 - Parallelization - Sandcastle và Push vs Pull]] |

→ **Tám kỹ thuật, một nguyên lý.**

### 2. AI luôn thích chia mỏng và phẳng — phải chống lại

| Tầng | AI mặc định | Phải ép |
|---|---|---|
| Chia việc | Cắt **ngang** theo layer | **Vertical slice** |
| Viết test | Implement xong mới thêm test layer | **TDD** — test trước |
| Kiến trúc | Nhiều module **shallow** | Ít module **deep** |

Ba biểu hiện của cùng một xu hướng. Và **prompt nói rõ vẫn không đủ** — demo ở [[05 - Vertical Slices - Cắt issue thành tracer bullets]] chứng minh: skill đã ghi "vertical slices" mà nó vẫn đề xuất horizontal.

### 3. Đầu tư hai đầu, bỏ trống ở giữa

```
Grilling  ████████████   ← alignment, không thay thế được
PRD       ▏              ← chỉ là tóm tắt, không đọc
Cắt issue ███            ← rẻ mà bắt được lỗi to
Implement ▏              ← AFK
QA        ████████████   ← taste, sinh issue mới
```

Người mới thường làm ngược: viết PRD thật kỹ, rồi QA qua loa.

### 4. Ranh giới human-in-the-loop rất rõ

| Phase | Người | Đóng góp gì |
|---|---|---|
| Grilling | ✅ | Quyết định nghiệp vụ |
| PRD | ❌ | — |
| Cắt issue | ✅ | Phán đoán kiến trúc |
| Implement | ❌ AFK | — |
| QA | ✅ | Taste |

---

## Phần C — Toàn bộ Q&A

Slido, sắp theo chủ đề. Timestamp để tua.

### Về tool & model

**Nếu không thích Claude Code thì thích cái nào?** `[00:36]`
> "Have you ever heard the phrase: **democracy is the worst way to run a country apart from all the other ways?** That's how I feel about Claude Code."

Ông ấy nói thẳng nhiều lần: *"I'm using Claude, but **I don't like Claude very much**"* và *"**you don't need to use Claude Code. In fact, it's often nice not to use Claude Code.**"* Method không phụ thuộc tool.

**Sao không dùng `AskUserQuestion` UI?** `[00:27-00:28]`
> "**It's very pleasing when you first encounter it, but then you realize it is actually broken in a ton of different ways.**"

**Claude auto mode để tránh permission check?** `[01:23]`
Được hỏi, không trả lời trực tiếp. Nhưng trong thực tế ông ấy dùng `--permission-mode acceptEdits` **trong Docker sandbox** — tức là giải bằng cách ly, không phải bằng cấp quyền bừa.

**1M context window có dùng không?** `[00:37-00:38]`
Xem [[02 - Hai ràng buộc của LLM - Smart zone và Memento]]. Tóm: tốt cho **retrieval**, không tốt cho **coding**. *"They shipped a lot more dumb zone to you."*

**BEADS framework?** `[01:25]`
> "**I've not tested it**, but it seems like another way to manage Kanban boards and issues. Seems very good, but **I've not tried it.**"

**Spec Kit / OpenSpec / Taskmaster?** `[00:23-00:24]`
Xem [[03 - Grill Me - Đạt shared understanding]]. Tóm: **own your planning stack** — vì không có winner rõ ràng, và không sở hữu thì không debug được.

**Model split?** `[01:32]`
**Sonnet implement, Opus review.** Xem [[09 - Parallelization - Sandcastle và Push vs Pull]].

---

### Về workflow

**Có giữ PRD/issue markdown lại không?** `[01:23-01:25]`
Không — **doc rot**. Ông ấy dùng GitHub issues và **close** thay vì xoá. Xem [[04 - PRD - Document điểm đến]].

**Thế database migration có squash không?** `[01:25-01:26]`
> "Database migrations are a **different thing** because you have a **running record of exactly what changed, and it's more deterministic.**" Rồi thừa nhận không chắc: *"Let's talk about it afterwards."*

**Lưu quyết định phủ định ở đâu?** `[00:58]`
Mục **out of scope** trong PRD. Quan trọng cho definition of done.

**Có nên dùng deep-think model để tối ưu PRD không?** `[01:26-01:27]`
Không đáng. *"The place that you need to be putting the work is in **QA**."* Xem [[04 - PRD - Document điểm đến]].

**Còn dùng "sacrifice grammar for concision" không?** `[00:48-00:49]`
Đã bỏ. Tip đó có ích khi còn đọc plan; giờ không đọc plan nữa. Ông ấy cũng **gần như không dùng `CLAUDE.md`**.

**AI grill hoài không dừng — có cách nào thông minh hơn không?** `[00:47-00:48]`
> "Yeah, those grilling sessions can be super intense. And the thing about these skills is **you can tune them if you want to.** If you feel like the AI is just absolutely **hammering you, hammering you, hammering you**, then **you can just tell it to pull back a little bit**, or get it to do **stop points** and that kind of thing. **If that's a failure mode that you run into a lot, then you just change the skill.**"

→ Nhất quán với "own your stack": skill là của bạn, sửa được.

---

### Về team & tổ chức

**Workflow này quá tuyến tính — thực tế lộn xộn hơn nhiều?** `[01:00-01:02]`
Câu Q&A hay nhất buổi. Xem [[06 - AFK Agent - Ralph loop và TDD]]. Tóm: phần **trên PRD** là lộn xộn, lặp, cần team; phần **dưới PRD** mới tuyến tính.

**Grill Me hợp PO hơn dev — trong team lớn ai dùng?** `[00:24-00:25]`
Xem [[03 - Grill Me - Đạt shared understanding]]. *"Kind of like mob programming with AI."*

**Nghĩ gì về PM / role không phải dev đi vibe code?** `[00:27]`
> "**Hmm. I'm going to return to this later, I think. I'm going to leave this unanswered. A bit of mystery.**"

Và ông ấy **không quay lại thật**. Câu này bỏ ngỏ.

**Kết cục của cuộc "Mexican standoff" giữa vai trò PM và dev?** `[00:49-00:50]`
> "**I've no idea. I'm not a pundit. I've no idea.**"

**Ba discipline nên học?** `[00:39]`
Đùa: *"**Taekwondo is good, I've heard.** I've no idea how to answer this question."* Khán giả hô "plumbing" — *"the plumbers I've hired are **not usually very disciplined**."*

---

### Về code review & chất lượng

**Agent sinh code nhanh hơn khả năng review — làm sao?** `[00:59-01:00]`
**Chưa có lời giải.** Mâu thuẫn thật giữa loop dài và PR nhỏ. Xem [[06 - AFK Agent - Ralph loop và TDD]].

**Sao không để AI QA hết?** `[01:04-01:06]`
Nên có automated review, **nhưng phải clear context trước**, và **không thay được QA người**. Xem [[07 - QA và Code Review - Nơi con người áp taste]].

**Làm sao ép agent theo architecture / API contract / security constraint?** `[01:03]`, `[01:27-01:29]`
**Push vs pull.** Xem [[09 - Parallelization - Sandcastle và Push vs Pull]].

**Dev có cần hiểu sâu TypeScript nữa không?** `[00:36-00:37]`
> "**Bad code bases make bad agents.** If you have a garbage code base, you're going to get garbage out of the agent."

Hiểu sâu để **thiết kế và đánh giá**, không phải để gõ.

---

### ⭐ Về front end `[01:02-01:03]`

Câu hỏi được hỏi 2 lần, đáng tách riêng.

**Vấn đề:**
> "**Front end is really sensitive to human eyes.** You need human eyes looking at the front end all the time to make sure that it looks good. **AI doesn't really have any eyes. It can look at code, but front end is multimodal.**"

**Về Playwright MCP / agent browser:**
> "You can give it tools to allow it to look through a front end and look at images, but **in my experience it's not very good at that yet**, and **it can't create a nice front end in a mature code base.** It can sort of spit one out."

**Cách làm thay thế — prototype:**
> "What it *can* do is you say: *okay, I want some ideas on how this front end might look. **Give me three prototypes that I can click between in a throwaway route**, that I can decide which one looks best.*
>
> And **you take the asset of that prototype and you then feed it back into the grilling session**, or you get feedback on it."

**Về prototype nói chung:**
> "**You don't need a PRD for your prototype.** The prototype is just — **it's messy. It's supposed to give you feedback earlier in the process.** So that's a great way of working with front end code, **great way of looking at software architecture in general.**"

> 🔑 Pattern quan trọng: prototype **không phải bước đầu của implementation**. Nó là một **công cụ để sinh input cho grilling session**. Vòng đời của nó: sinh 3 bản → chọn → **ném ngược lên phase alignment** → vứt bản prototype đi.
>
> Đây cũng là chỗ duy nhất chapter "Phase 1: Research & Prototyping" thực sự được nói tới — và nó nằm ở phút 62, không phải phút 4.

---

## Phần D — Những chỗ Matt không có câu trả lời

Đáng ghi riêng, vì đây là **ranh giới hiểu biết hiện tại** chứ không phải thiếu sót của note:

| Câu hỏi | Trạng thái |
|---|---|
| Review nhiều hơn khả năng review — giải thế nào? | *"I don't honestly know what the answer to this yet."* |
| PR nhỏ vs loop dài — dung hoà? | Chưa có |
| Migration có bị doc rot như PRD không? | *"I'm not sure. Let's talk about it afterwards."* |
| PM / non-dev vibe coding? | Cố tình bỏ ngỏ |
| Front end automation | *"not very good at that yet"* |
| Hoà workflow 1-dev vào quy trình team | *"it's kind of up to you"* |
| Vì sao lấy đúng **5** commit gần nhất trong `once.sh` | Hứa giải thích, **không quay lại** |

---

## Phần E — Sách được nhắc

| Sách | Tác giả | Dùng cho | File |
|---|---|---|---|
| ***A Philosophy of Software Design*** | John Ousterhout | **Deep vs shallow modules** | [[08 - Deep Modules - Thiết kế codebase cho AI]] |
| ***The Pragmatic Programmer*** | Hunt & Thomas | **Tracer bullets**, task nhỏ | [[05 - Vertical Slices - Cắt issue thành tracer bullets]] |
| ***The Design of Design*** | Frederick P. Brooks | **Design concept** | [[03 - Grill Me - Đạt shared understanding]] |
| ***Refactoring*** | Martin Fowler | Task nhỏ | [[02 - Hai ràng buộc của LLM - Smart zone và Memento]] |

Và lý do sâu hơn để đọc chúng, từ `[00:46]`:

> "**We're really trying, in this day and age, to verbalize best software practices in English. And these 20-year-old books have already done that. It's an absolute gold mine if you want to throw that into prompts.**"

→ Không chỉ để hiểu. Để có **từ vựng chính xác mà model đã biết** khi viết prompt.

---

## Phần F — Người & thứ được nhắc

| | Là gì | Timestamp |
|---|---|---|
| **Dex Hardy / Human Layer** | Người nghĩ ra smart zone / dumb zone | `[00:03]` |
| **Ralph Wiggum** | Tên một software practice: PRD + "make a small change" lặp mãi | `[00:06]` |
| **Sandcastle** | TS library của Matt để chạy agent AFK song song | `[01:29]` |
| **`mattpocock/course-video-manager`** | Repo thật của ông ấy, **744 closed issues** | `[00:34]` |
| **Cadence** | Repo demo trong workshop (course platform) | `[00:11]` |
| **AI Hero** | Website của Matt, có bài về status line đếm token | `[00:09]` |
| **BEADS** | Framework quản lý Kanban/issue — ông ấy chưa thử | `[01:25]` |

---

[[09 - Parallelization - Sandcastle và Push vs Pull|← Trước]] · [[00 - README|Mục lục]]
