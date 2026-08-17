---
tags:
  - ai
  - ai-coding
  - agent
  - orchestration
timestamp: 01:28:10 - 01:34:06
chapter: "Designing Codebases for AI Effectiveness (tên chapter SAI)"
---

# 09 — Parallelization: Sandcastle & Push vs Pull

`[01:28:10 – 01:34:06]` · [[08 - Deep Modules - Thiết kế codebase cho AI|← Trước]] · [[00 - README|Mục lục]] · [[10 - Tổng kết và Q&A|Tiếp →]]

> ⚠️ Chapter YouTube ghi "Designing Codebases for AI Effectiveness" — sai. Phần đó nằm ở file trước. Đoạn này thực tế là **orchestration nhiều agent + coding standards**.

---

## Phần 1 — Push vs Pull: áp coding standards lên agent `[01:28-01:29]`

Đây là câu trả lời cho câu hỏi được hỏi **hai lần** trong buổi (`[01:03]` và `[01:27]`): *làm sao ép agent code theo chuẩn của mình, dùng đúng library mình muốn, tôn trọng architecture và security constraint?*

### Hai cơ chế đưa thông tin cho agent

> "There's essentially **two different ways of doing it**: you've got **push**, and you've got **pull**."

**Push** — đẩy vào context, luôn có mặt:

> "Push is where you **push instructions to the LLM**. So you say: okay, if you put something in **`CLAUDE.md`** — *talk like a pirate* — **that instruction is always going to be sent to the agent.** So that is a push — **you're pushing tokens to it.**"

**Pull** — để sẵn, agent tự lấy:

> "Pull is where you **give the agent an opportunity to pull more information.** That's for instance like **skills**. A skill is something that **sits in the repo, and it has a little description header** that says: *okay agent, **you may pull this when you want to**.*"

| | Push | Pull |
|---|---|---|
| Ví dụ | `CLAUDE.md`, system prompt | Skills, docs có description header |
| Có mặt khi nào | **Luôn luôn** | Khi agent thấy cần |
| Tốn context | **Luôn tốn** | Chỉ tốn khi dùng |
| Đảm bảo được đọc? | ✅ Có | ❌ Không |

### ⭐ Quy tắc của Matt

```
IMPLEMENTER  →  cho phép PULL
REVIEWER     →  PUSH thẳng vào
```

> "When you have an **implementer**, then you want **the coding standards to be available via pull.** If it has a question, you want it to be able to answer it.
>
> But **if you then have an automated reviewer afterwards, then you want it to push.** You want to say: *these are our coding standards, **make sure that this code follows them**.* So if you have skills, then **you want to push that stuff to the reviewer**, so **the reviewer has both the code that's written and the coding standards to compare to.**"

### Tại sao chia như vậy

| | Implementer | Reviewer |
|---|---|---|
| Nhiệm vụ | Viết code — cần context về **codebase** | Đối chiếu — cần context về **chuẩn** |
| Context bận rộn không? | **Rất** (explore, implement, test) | Ít — chỉ có diff + chuẩn |
| Nếu push chuẩn vào | Đốt smart zone vào thứ có thể không cần | Đúng thứ nó cần |
| Nếu chỉ để pull | Nó tự lấy phần liên quan → tiết kiệm | ⚠️ **Nó có thể không lấy** → chuẩn không được kiểm |

> 🔑 Ý cốt lõi: **reviewer là chỗ duy nhất bạn đảm bảo được coding standards thực sự được kiểm.** Implementer có thể bỏ sót — không sao, vì reviewer sẽ bắt. Nhưng reviewer mà bỏ sót thì không còn ai kiểm nữa. Nên chỗ đó phải là push.
>
> Đây cũng là hệ quả của nguyên tắc "system prompt phải nhỏ" ([[02 - Hai ràng buộc của LLM - Smart zone và Memento]]) — và lý do Matt gần như không dùng `CLAUDE.md`. Không phải vì push xấu, mà vì **push đúng chỗ**.

### Model split

> "I'm actually using **Sonnet for implementation** and **Opus for reviewing** — cuz **I consider reviewing... I need the smarts then.**"

Ngược với trực giác thông thường (dồn model mạnh vào lúc viết code). Logic của Matt:

- **Implement** = việc cơ học có đặc tả rõ (issue + TDD + feedback loop tự bắt lỗi) → model rẻ đủ dùng
- **Review** = phán đoán, so sánh với chuẩn, tìm thứ *không* hiện ra trong test → cần model mạnh

Cộng thêm: implementer chạy **song song N con** → tiết kiệm nhân N. Reviewer chạy ít hơn → trả giá cho model đắt được.

---

## Phần 2 — Sandcastle `[01:29-01:32]`

### Vì sao ông ấy tự viết

> "I recently spent maybe **a week or so** building this thing called **Sandcastle**. I was sort of **unhappy with the options out there for running agents AFK.**"

### Nó là gì

> "It's essentially **a TypeScript library for running these loops.** You have a **`run` function** that:
> - **creates a work tree**
> - **sandboxes it in a Docker container**
> - and then **allows you to run a prompt inside that**
>
> And in that work tree then — **it's just a Git branch** — you have that code and **you can then merge it later.**"

Ba lớp cách ly, mỗi lớp giải một vấn đề khác nhau:

| Lớp | Giải quyết |
|---|---|
| **Git worktree** | N agent sửa file cùng lúc mà không đạp lên nhau — mỗi con một branch |
| **Docker container** | Agent chạy `accept-edits` không phá máy thật |
| **Context riêng** | Mỗi agent một smart zone riêng ([[03 - Grill Me - Đạt shared understanding]]) |

> "It essentially allows you to **run these kind of automated loops and allows you to parallelize across multiple different agents really simply.**"

### Pipeline trong `main.ts`

> "This is where we take it from **sequential into parallel.**"

```
┌──────────────────────────────────────────────────┐
│ PLANNER                                          │
│   input : toàn bộ backlog                        │
│   prompt: "plan prompt"                          │
│   việc  : tính blocking relationships → ra phases│
│   output: N issue có thể làm SONG SONG           │
│           (title + branch cho mỗi issue)         │
└──────────────────────┬───────────────────────────┘
                       ↓
        ┌──────────────┼──────────────┐
        ↓              ↓              ↓
   ┌─────────┐   ┌─────────┐    ┌─────────┐
   │ sandbox │   │ sandbox │    │ sandbox │   ← worktree + Docker
   │ IMPLEM. │   │ IMPLEM. │    │ IMPLEM. │   ← Sonnet, pull standards
   │ issue#, │   │         │    │         │
   │ title,  │   │         │    │         │
   │ branch  │   │         │    │         │
   └────┬────┘   └────┬────┘    └────┬────┘
        └─────────────┼──────────────┘
                      ↓  (nếu có commit)
              ┌───────────────┐
              │   REVIEWER    │  ← Opus, PUSH coding standards
              └───────┬───────┘
                      ↓
              ┌───────────────┐
              │    MERGER     │
              │ merge prompt  │
              │ + branches    │
              │ + issues      │
              │ tự fix conflict│
              └───────────────┘
```

Nguyên văn từng khâu:

**Planner:**
> "We have first of all **a planner** that has a **plan prompt** — it **looks at the backlog and chooses a certain number of issues to work on in parallel.** Remember I showed you that **Kanban board where it had all the blocking relationships? It works out all the phases.**"

→ Đây chính là chỗ DAG ở [[05 - Vertical Slices - Cắt issue thành tracer bullets]] được **tiêu thụ**. Kanban board không chỉ để người nhìn — planner đọc nó để tính độ rộng của mỗi tầng.

**Implementer:**
> "This is essentially just a set of issues — GitHub issues with a title and with a branch for you to work on. And then **for each issue, we create a sandbox and then we run an implementer in that, passing in the issue number, issue title, and the branch.** **This is like the loop that we ran just before.**"

**Reviewer:**
> "Then **if it created some commits, we then review those commits.** This is essentially the loop."

**Merger:**
> "What do we do with those commits? **We pass those into a merger agent** — which takes in a **merge prompt**, takes in **the branches that were created**, takes in **the issues**, and **it just merges them in. If there are any issues with the merge — with the types and tests and that kind of thing — it solves them.**"

> 🔑 Merger là một **agent riêng**, không phải `git merge` thuần. Nó phải giải conflict ngữ nghĩa: N agent làm việc độc lập trên N branch, gộp lại có thể vỡ type hoặc vỡ test dù không conflict text nào. Đây là cái giá phải trả cho việc chạy song song, và cần một agent chuyên để trả.

### Đánh giá của ông ấy

> "**This has been my flow for quite a while now for working on most projects. It works super super well.** And yeah, **I recommend you check out Sandcastle** if you want to learn more."

---

## Đường tiến hoá — đừng nhảy cóc

Ghép cả [[06 - AFK Agent - Ralph loop và TDD]] và file này lại, có một lộ trình rõ ràng:

| Bước | Cái gì | Mục đích |
|---|---|---|
| 1 | Chạy tay từng session | Hiểu agent hành xử ra sao |
| 2 | `once.sh` — chạy 1 lần | **Tune prompt.** Chạy lại nhiều lần ở đây |
| 3 | Ralph loop tuần tự | *"get your feet wet"* — 1 agent, nhiều issue |
| 4 | Sandcastle — song song | worktree + Docker + planner/reviewer/merger |

Matt đi hết 4 bước này và **nói rõ bước 3 là để làm quen**. Nhảy thẳng từ 1 lên 4 thì không biết prompt sai ở đâu khi 5 agent cùng chạy sai.

---

## Ý cần nhớ

- **Push** = luôn trong context (`CLAUDE.md`). **Pull** = agent tự lấy (skills).
- **Implementer pull, reviewer push.** Reviewer là chỗ duy nhất đảm bảo coding standards được kiểm → không được để nó "tuỳ chọn".
- **Sonnet implement, Opus review.** Review cần phán đoán hơn là viết code; implementer lại chạy song song nhiều con nên phải rẻ.
- Chạy song song cần **3 lớp cách ly**: git worktree (file), Docker (máy), context riêng (smart zone).
- Pipeline: **planner → N implementer → reviewer → merger**. Merger là agent thật vì phải giải conflict về type/test.
- Planner là chỗ **DAG của Kanban board được dùng thật**.
- Đi tuần tự: tay → `once` → loop tuần tự → song song. **Đừng nhảy cóc.**

---

[[08 - Deep Modules - Thiết kế codebase cho AI|← Trước]] · [[00 - README|Mục lục]] · [[10 - Tổng kết và Q&A|Tiếp: Tổng kết →]]
