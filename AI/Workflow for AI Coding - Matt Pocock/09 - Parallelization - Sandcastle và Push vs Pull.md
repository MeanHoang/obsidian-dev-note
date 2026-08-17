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

Câu hỏi nguyên văn lần thứ hai:

> "How do you get it to code the way you want it to code — so by the time you get to code review, it's at least familiar, it uses the libraries you wanted to use?"

**Dịch:** *"Làm sao anh khiến nó code theo cách anh muốn — để tới lúc anh code review thì ít nhất nó cũng quen thuộc, nó dùng đúng những thư viện anh muốn dùng?"*

### Hai cơ chế đưa thông tin cho agent

> "There's essentially **two different ways of doing it**: you've got **push**, and you've got **pull**."

**Dịch:** *"Về cơ bản có **hai cách khác nhau để làm việc đó**: bạn có **push**, và bạn có **pull**."*

**Push** — đẩy vào context, luôn có mặt:

> "Push is where you **push instructions to the LLM**. So you say: okay, if you put something in **`CLAUDE.md`** — *talk like a pirate* — **that instruction is always going to be sent to the agent.** So that is a push — **you're pushing tokens to it.**"

**Dịch:** *"Push là khi bạn **đẩy chỉ dẫn tới LLM**. Kiểu: ok, nếu bạn bỏ cái gì đó vào **`CLAUDE.md`** — ví dụ *nói chuyện như cướp biển* — **chỉ dẫn đó sẽ luôn luôn được gửi tới agent.** Đó là push — **bạn đang đẩy token tới nó.**"*

**Pull** — để sẵn, agent tự lấy:

> "Pull is where you **give the agent an opportunity to pull more information.** That's for instance like **skills**. A skill is something that **sits in the repo, and it has a little description header** that says: *okay agent, **you may pull this when you want to**.*"

**Dịch:** *"Pull là khi bạn **cho agent cơ hội tự kéo thêm thông tin về.** Ví dụ như **skills**. Một skill là thứ **nằm trong repo, và nó có một cái header mô tả nhỏ** ghi rằng: ok agent, **bạn có thể lấy cái này khi bạn muốn**."*

| | Push | Pull |
|---|---|---|
| Ví dụ | `CLAUDE.md`, system prompt | Skills, docs có description header |
| Có mặt khi nào | **Luôn luôn** | Khi agent thấy cần |
| Tốn context | **Luôn tốn** | Chỉ tốn khi dùng |
| Đảm bảo được đọc? | ✅ Có | ❌ Không |

> 💡 **Ý là:** Đây là một đánh đổi thuần tuý, không có bên nào thắng tuyệt đối:
> - Push = **chắc chắn được đọc**, nhưng **luôn đốt smart zone**
> - Pull = **tiết kiệm context**, nhưng **có thể bị bỏ qua**
>
> Nên câu hỏi đúng không phải "cái nào tốt hơn" mà là **"chỗ nào cần cái nào"**.

### ⭐ Quy tắc của Matt

```
IMPLEMENTER  →  cho phép PULL
REVIEWER     →  PUSH thẳng vào
```

> "When you have an **implementer**, then you want **the coding standards to be available via pull.** If it has a question, you want it to be able to answer it.
>
> But **if you then have an automated reviewer afterwards, then you want it to push.** You want to say: *these are our coding standards, **make sure that this code follows them**.* So if you have skills, then **you want to push that stuff to the reviewer**, so **the reviewer has both the code that's written and the coding standards to compare to.**"

**Dịch:** *"Khi bạn có một **implementer**, thì bạn muốn **coding standards khả dụng theo kiểu pull.** Nếu nó có thắc mắc, bạn muốn nó tự trả lời được.*
>
> *Nhưng **nếu sau đó bạn có một reviewer tự động, thì bạn muốn push.** Bạn muốn nói: đây là coding standards của chúng ta, **hãy đảm bảo code này tuân theo chúng.** Nên nếu bạn có skills, thì **bạn muốn đẩy thứ đó tới reviewer**, để **reviewer có cả code đã viết lẫn coding standards để đối chiếu.**"*

### Tại sao chia như vậy

| | Implementer | Reviewer |
|---|---|---|
| Nhiệm vụ | Viết code — cần context về **codebase** | Đối chiếu — cần context về **chuẩn** |
| Context bận rộn không? | **Rất** (explore, implement, test) | Ít — chỉ có diff + chuẩn |
| Nếu push chuẩn vào | Đốt smart zone vào thứ có thể không cần | Đúng thứ nó cần |
| Nếu chỉ để pull | Nó tự lấy phần liên quan → tiết kiệm | ⚠️ **Nó có thể không lấy** → chuẩn không được kiểm |

> 🔑 **Ý cốt lõi: reviewer là chỗ DUY NHẤT bạn đảm bảo được coding standards thực sự được kiểm.**
>
> Implementer có thể bỏ sót — **không sao**, vì reviewer sẽ bắt. Nhưng reviewer mà bỏ sót thì **không còn ai kiểm nữa**. Nên chỗ đó phải là push.
>
> Cách nghĩ này áp dụng rộng hơn coding standards: **bất cứ thứ gì bắt buộc phải được kiểm, hãy đặt nó ở khâu cuối cùng dưới dạng push.** Khâu giữa thì để pull cho nhẹ.

> 💡 Đây cũng là hệ quả của nguyên tắc "system prompt phải nhỏ" ở [[02 - Hai ràng buộc của LLM - Smart zone và Memento]] — và lý do Matt gần như không dùng `CLAUDE.md`. **Không phải vì push xấu, mà vì `CLAUDE.md` push tới MỌI agent, kể cả những con không cần.**

### Model split

> "I'm actually using **Sonnet for implementation** and **Opus for reviewing** — cuz **I consider reviewing... I need the smarts then.**"

**Dịch:** *"Thực ra tôi dùng **Sonnet cho implementation** và **Opus cho review** — bởi vì **tôi cho rằng review... lúc đó tôi cần độ thông minh.**"*

Ngược với trực giác thông thường (dồn model mạnh vào lúc viết code). Logic của Matt:

| | Implement | Review |
|---|---|---|
| Bản chất công việc | **Cơ học** — có đặc tả rõ (issue + TDD) | **Phán đoán** — so sánh với chuẩn |
| Có lưới an toàn không? | ✅ Có — feedback loop tự bắt lỗi | ❌ Không — đây *là* lưới an toàn |
| Tìm cái gì | Cái được yêu cầu | Cái **không** hiện ra trong test |
| Chạy bao nhiêu con | **N con song song** | Ít hơn |

> 🔑 **Ý là:** Hai lý do cộng dồn:
> 1. **Implement có lưới an toàn, review thì không.** Nếu Sonnet code sai, test sẽ đỏ và nó phải sửa. Nếu reviewer bỏ sót, không ai bắt được nữa.
> 2. **Kinh tế:** implementer chạy song song N con → tiết kiệm nhân N. Reviewer chạy ít hơn → trả giá model đắt được.
>
> Ghép với ý ở [[07 - QA và Code Review - Nơi con người áp taste]] (reviewer phải clear context): **reviewer được ưu ái mọi thứ** — model mạnh nhất, context sạch nhất, thông tin đầy đủ nhất. Vì nó là chốt chặn cuối trước con người.

---

## Phần 2 — Sandcastle `[01:29-01:32]`

### Vì sao ông ấy tự viết

> "I recently spent maybe **a week or so** building this thing called **Sandcastle**. I was sort of **unhappy with the options out there for running agents AFK.**"

**Dịch:** *"Gần đây tôi bỏ ra khoảng **một tuần** để xây cái thứ tên là **Sandcastle**. Tôi kiểu như **không hài lòng với những lựa chọn hiện có để chạy agent AFK.**"*

> 💡 Tên **Sandcastle** (lâu đài cát) — chơi chữ với **sandbox** (hộp cát), là thuật ngữ chỉ môi trường cách ly để chạy code không tin cậy.

### Nó là gì

> "It's essentially **a TypeScript library for running these loops.** You have a **`run` function** that:
> - **creates a work tree**
> - **sandboxes it in a Docker container**
> - and then **allows you to run a prompt inside that**
>
> And in that work tree then — **it's just a Git branch** — you have that code and **you can then merge it later.**"

**Dịch:** *"Về cơ bản nó là **một thư viện TypeScript để chạy những loop này.** Bạn có một **hàm `run`** mà nó:*
> - ***tạo một work tree***
> - ***đóng hộp nó trong một Docker container***
> - *rồi **cho phép bạn chạy một prompt bên trong đó***
>
> *Và trong cái work tree đó — **nó chỉ là một Git branch** — bạn có code đó và **bạn có thể merge nó sau.**"*

> 💡 **Git worktree** là tính năng của Git cho phép **checkout nhiều branch cùng lúc vào nhiều thư mục khác nhau**, chung một repo. Bình thường một repo chỉ checkout được một branch tại một thời điểm — worktree phá bỏ giới hạn đó. Đây chính xác là thứ cần để N agent làm việc song song.

Ba lớp cách ly, mỗi lớp giải một vấn đề khác nhau:

| Lớp | Giải quyết vấn đề gì |
|---|---|
| **Git worktree** | N agent sửa file cùng lúc mà không đạp lên nhau — mỗi con một branch, một thư mục |
| **Docker container** | Agent chạy `accept-edits` không phá được máy thật |
| **Context riêng** | Mỗi agent một smart zone riêng ([[03 - Grill Me - Đạt shared understanding]]) |

> 💡 **Ý là:** Ba lớp này thường bị gộp làm một trong đầu, nhưng chúng độc lập. Bạn có thể có Docker mà không có worktree (agent vẫn đạp lên nhau trong container). Có worktree mà không có Docker (agent phá được máy thật). Cần cả ba.

> "It essentially allows you to **run these kind of automated loops and allows you to parallelize across multiple different agents really simply.**"

**Dịch:** *"Về cơ bản nó cho phép bạn **chạy những loop tự động kiểu này và song song hoá trên nhiều agent khác nhau một cách rất đơn giản.**"*

### Pipeline trong `main.ts`

> "This is where we take it from **sequential into parallel.**"

**Dịch:** *"Đây là chỗ ta chuyển từ **tuần tự sang song song.**"*

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
   │ IMPLEM. │   │ IMPLEM. │    │ IMPLEM. │   ← Sonnet, PULL standards
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

**Dịch:** *"Trước hết ta có **một planner** với một **plan prompt** — nó **nhìn vào backlog và chọn ra một số lượng issue nhất định để làm song song.** Nhớ cái **Kanban board tôi cho các bạn xem, cái có tất cả các quan hệ chặn nhau đó không? Nó tính ra tất cả các tầng.**"*

> 🔑 **Ý là:** Đây chính là chỗ **DAG ở [[05 - Vertical Slices - Cắt issue thành tracer bullets]] được TIÊU THỤ.**
>
> Kanban board không chỉ để người nhìn cho đẹp — **planner đọc nó để tính độ rộng của mỗi tầng**, tức là chạy được mấy agent song song. Nếu không có blocking relationships thì planner không biết chọn gì.
>
> Đây là lý do phải bỏ công cắt issue tử tế ở phase 4: nó là **đầu vào của máy**, không phải tài liệu trang trí.

**Implementer:**

> "This is essentially just a set of issues — GitHub issues with a title and with a branch for you to work on. And then **for each issue, we create a sandbox and then we run an implementer in that, passing in the issue number, issue title, and the branch.** **This is like the loop that we ran just before.**"

**Dịch:** *"Về cơ bản đây chỉ là một tập issue — GitHub issue với một tiêu đề và một branch để bạn làm việc. Rồi **với mỗi issue, ta tạo một sandbox và chạy một implementer trong đó, truyền vào số issue, tiêu đề issue, và branch.** **Cái này giống hệt cái loop ta vừa chạy lúc nãy.**"*

> 💡 Câu cuối quan trọng: **implementer chính là `once.sh` ở [[06 - AFK Agent - Ralph loop và TDD]]**, chỉ được đóng gói lại và nhân bản. Đây là lý do phải tune `once.sh` cho chuẩn trước — vì nó sẽ được nhân lên N lần.

**Reviewer:**

> "Then **if it created some commits, we then review those commits.** This is essentially the loop."

**Dịch:** *"Rồi **nếu nó tạo ra commit nào đó, ta review những commit đó.** Về cơ bản đây là vòng lặp."*

> 💡 Điều kiện `if it created some commits` — nếu agent không commit gì (task fail, hoặc không có gì để làm) thì **bỏ qua bước review**, không đốt token vô ích.

**Merger:**

> "What do we do with those commits? **We pass those into a merger agent** — which takes in a **merge prompt**, takes in **the branches that were created**, takes in **the issues**, and **it just merges them in. If there are any issues with the merge — with the types and tests and that kind of thing — it solves them.**"

**Dịch:** *"Ta làm gì với những commit đó? **Ta truyền chúng vào một merger agent** — con này nhận một **merge prompt**, nhận **các branch đã được tạo**, nhận **các issue**, và **nó gộp chúng vào. Nếu có vấn đề gì với việc merge — về type, về test, kiểu vậy — nó tự giải quyết.**"*

> 🔑 **Ý là — merger là một AGENT riêng, không phải `git merge` thuần.**
>
> Vì sao cần agent? Vì nó phải giải **conflict ngữ nghĩa**, không phải conflict văn bản:
>
> - Agent A đổi tên hàm `calcPoints` → `calculatePoints` trong service
> - Agent B (branch khác) thêm một chỗ gọi `calcPoints`
> - **Git merge sạch trơn — không conflict text nào.** Nhưng type check đỏ.
>
> Đây là **cái giá phải trả cho việc chạy song song**: các agent làm việc mù nhau, nên phải có một khâu chuyên để dọn. Chạy tuần tự thì không cần merger, nhưng chậm hơn N lần.

### Đánh giá của ông ấy

> "**This has been my flow for quite a while now for working on most projects. It works super super well.** And yeah, **I recommend you check out Sandcastle** if you want to learn more."

**Dịch:** *"**Đây đã là quy trình của tôi khá lâu rồi cho phần lớn dự án. Nó chạy cực kỳ tốt.** Và vâng, **tôi khuyên các bạn xem thử Sandcastle** nếu muốn tìm hiểu thêm."*

---

## Đường tiến hoá — đừng nhảy cóc

Ghép cả [[06 - AFK Agent - Ralph loop và TDD]] và file này lại, có một lộ trình rõ ràng:

| Bước | Cái gì | Mục đích | Rủi ro nếu bỏ qua |
|---|---|---|---|
| 1 | Chạy tay từng session | Hiểu agent hành xử ra sao | Không biết cái gì là "bình thường" |
| 2 | `once.sh` — chạy 1 lần | **Tune prompt.** Chạy lại nhiều lần ở đây | Prompt sai được nhân lên N lần |
| 3 | Ralph loop tuần tự | *"get your feet wet"* — 1 agent, nhiều issue | Không biết loop dừng đúng chưa |
| 4 | Sandcastle — song song | worktree + Docker + planner/reviewer/merger | — |

> 🔑 Matt đi hết 4 bước này và **nói rõ bước 3 là để làm quen**. Nhảy thẳng từ 1 lên 4 thì khi 5 agent cùng chạy sai, bạn không biết sai vì prompt, vì cách cắt issue, hay vì merger.
>
> Nguyên tắc chung: **mỗi bước chỉ thêm MỘT biến mới.** Bước 2 thêm tự động hoá. Bước 3 thêm vòng lặp. Bước 4 thêm song song. Thêm hai biến cùng lúc thì không debug được.

---

## Ý cần nhớ

- **Push** = luôn trong context (`CLAUDE.md`), chắc chắn được đọc nhưng luôn tốn. **Pull** = agent tự lấy (skills), tiết kiệm nhưng có thể bị bỏ qua.
- **Implementer pull, reviewer push.** Reviewer là chỗ duy nhất đảm bảo coding standards được kiểm → không được để nó "tuỳ chọn".
- Nguyên tắc rộng hơn: **thứ gì bắt buộc phải kiểm thì đặt ở khâu cuối, dạng push.**
- **Sonnet implement, Opus review.** Implement có lưới an toàn (test), review thì không. Cộng thêm: implementer chạy N con nên phải rẻ.
- Reviewer được ưu ái mọi thứ: model mạnh nhất, **context sạch nhất**, thông tin đầy đủ nhất.
- Chạy song song cần **3 lớp cách ly độc lập**: git worktree (file), Docker (máy), context riêng (smart zone).
- Pipeline: **planner → N implementer → reviewer → merger**. Merger là agent thật vì phải giải **conflict ngữ nghĩa**, không phải conflict text.
- Planner là chỗ **DAG của Kanban board được dùng thật** — nên cắt issue tử tế là đầu vào của máy, không phải trang trí.
- Đi tuần tự: tay → `once` → loop tuần tự → song song. **Mỗi bước chỉ thêm một biến mới.**

---

[[08 - Deep Modules - Thiết kế codebase cho AI|← Trước]] · [[00 - README|Mục lục]] · [[10 - Tổng kết và Q&A|Tiếp: Tổng kết →]]
