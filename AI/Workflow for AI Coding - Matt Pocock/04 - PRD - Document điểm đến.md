---
tags:
  - ai
  - ai-coding
  - prd
timestamp: 22:10 - 35:50
chapter: "Phase 3: Writing the PRD"
---

# 04 — PRD: document điểm đến

`[22:10 – 35:50]` · [[03 - Grill Me - Đạt shared understanding|← Trước]] · [[00 - README|Mục lục]] · [[05 - Vertical Slices - Cắt issue thành tracer bullets|Tiếp →]]

---

## Khung tư duy: destination vs journey `[00:28-00:29]`

Sau grilling session, mình có 25K token hội thoại chất lượng cao. Vấn đề: **biến nó thành cái gì?**

> "The plan here is that we take our Grill Me [session] and we need to essentially find some way of **turning it into a destination**. **We're figuring out the shape of the tasks during the grilling session**, and in order to turn it into a bunch of actionable actions for the AI, we essentially need to figure out the destination. **We need to know where we're going. We need to know the shape of this entire thing.**"

Hai document cần có:

| Document | Trả lời câu hỏi | Là gì | File |
|---|---|---|---|
| **Destination document** | *Đích đến trông như thế nào?* | **PRD** — user stories + definition of done | File này |
| **Journey document** | *Đi tới đó bằng đường nào?* | **Kanban board** — các issue + quan hệ blocking | [[05 - Vertical Slices - Cắt issue thành tracer bullets]] |

> "We need something to document **the destination**. And we need something to document **the journey**."

---

## Skill `write-a-prd`

### Các bước bên trong skill

1. Hỏi user một **mô tả dài, chi tiết** về vấn đề
2. Explore repo (nếu là session mới)
3. **Interview the user relentlessly** — tức là grill lần nữa
4. Điền vào **PRD template**

> "You can use write-a-PRD **without** grilling first, but **I just like to grill first and then write the PRA afterwards.**"

→ Tức là skill này **tự đủ**, grill-me là bước tăng cường. Nhưng Matt luôn làm cả hai.

### Gọi

Trong demo ông ấy chỉ gõ đúng:

```
write a PRD
```

...ngay trong session grill-me đang chạy (không clear), nên nó thừa hưởng toàn bộ 25K token hội thoại.

---

## PRD template — cấu trúc

```markdown
## Problem statement
   Vấn đề user đang gặp

## Solution
   Giải pháp cho vấn đề đó

## User stories
   (demo sinh ra 18 cái)

## Implementation decisions
   ├── ⭐ Proposed modules to modify
   └── Các quyết định kỹ thuật (vd: level thresholds)

## Testing decisions
   Test cái gì, ở đâu, bằng cách nào

## ⭐ Out of scope
   Những gì đã cân nhắc và quyết định KHÔNG làm
```

Matt về hình thức PRD:

> "It sort of **doesn't matter what shape it is.** I've got a shape that I prefer and I quite like, but **you can just choose your own shape, or whatever your company uses.** All we're really doing is **summarizing the design concept that we have so far.**"

Về user stories, ông ấy nhắc: *"you know, there are — cucumber is a language you can use to write these in, or we just sort of write them ourselves essentially."*

---

## ⭐ Mục 1: Proposed modules to modify `[00:32-00:33]`

Đây là mục **quan trọng nhất** trong PRD, và là điểm phân biệt workflow này với specs-to-code.

Việc đầu tiên skill đưa ra trước khi viết PRD:

> "The first thing that it's going to give me are **a set of proposed modules it wants to modify.** Now, **there's a deep reason why I'm thinking about this.**"

Lý do:

> "At this stage we have an idea, we have sort of specced out the idea, we've reached an understanding of what we're trying to do — and then **we need to start thinking about the code**. Because at this point — **this is not specs to code. This is not where we're ignoring the code. We actually keep the code in mind throughout the whole process.**"

Output thực tế trong demo:

> "It's saying: *recommend tests for the gamification service — it is the only **deep module** with meaningful logic.*"

Matt duyệt: *"These modules look right. Yeah."*

Và trong PRD sinh ra `[01:18]`, mục data model / modules ghi rõ:

- `gamification service` — **module deep mới**, sẽ được test, có interface cụ thể
- Sửa `progress service`
- Sửa `lesson route`
- Sửa `dashboard route`

> "**I'm being really specific about the modules that I'm editing, and I'm making sure that I keep that module map in my mind at all times — throughout the planning, and then throughout the implementation.**"

> 🔑 Chữ **deep module** ở đây không phải ngẫu nhiên — nó là khái niệm của Ousterhout, xem [[08 - Deep Modules - Thiết kế codebase cho AI]]. Tức là ngay từ lúc viết PRD, Matt đã đang **thiết kế kiến trúc**, chứ không phải chỉ mô tả tính năng.

---

## ⭐ Mục 2: Out of scope `[00:58]`

Chỗ lưu **quyết định phủ định** — những thứ đã cân nhắc trong grilling session rồi quyết định loại.

Câu hỏi từ Slido: *"How do you retain negative decisions, things that you decided against, and rationales, when persisting the results from the grill me session?"*

> "There's a very simple answer: in the write-a-PRD section, there is a section at the bottom of **the things that are out of scope**. So the things we're not going to tackle in this PRD — **which is very important for giving a definition of done.**"

Ví dụ từ grilling session ở phase trước, những thứ lẽ ra nằm ở mục này: bỏ video-watch events (noisy, gameable), streaks đứng riêng không tính điểm.

> 🔑 Không có mục này thì thông tin *"tại sao không làm X"* biến mất, và 2 tuần sau sẽ có người (hoặc chính AI) đề xuất lại X.

---

## 🔥 "Tôi không đọc PRD" `[00:35]`

Đây là tuyên bố gây tranh cãi nhất buổi. Matt hỏi phòng: *"Should I be reviewing this document?"* — nhiều tay giơ lên. Rồi:

> "**I don't look at these. I don't look at these.**
>
> The reason I don't look at these is because — **what am I testing at this point?** When I read it, what am I testing? **What are the failure modes I'm trying to test for?**
>
> I know that **LLMs are great at summarization** — cuz they are, they're really good at summarization. And **I have reached the same wavelength as the LLM** — using the grill me skill, we have a **shared design concept**. So if I have a shared design concept, **all I'm doing is essentially checking the LLM's ability to summarize.** So I don't tend to read these."

### Lập luận tách ra cho rõ

1. Review là để **bắt failure mode**. Nếu không nêu được failure mode đang tìm thì việc review là nghi lễ, không phải công việc.
2. PRD là **bản tóm tắt** của grilling session.
3. Tóm tắt là việc LLM làm **rất tốt**.
4. Nội dung cần review đã được review rồi — **từng câu một, trong grilling session**.
5. → Đọc PRD chỉ là kiểm tra kỹ năng tóm tắt. Không đáng.

### Điều kiện để lập luận này đúng

⚠️ Nó **chỉ đúng nếu bạn đã grill thật kỹ**. Nếu bỏ qua grilling và nhảy thẳng vào write-a-PRD, thì PRD chứa hàng loạt giả định chưa ai duyệt — lúc đó **bắt buộc phải đọc**.

Nói cách khác: Matt không bỏ review, ông ấy **dời review lên sớm hơn**, vào lúc nó rẻ và hiệu quả hơn.

---

## Có nên tối ưu PRD bằng deep-think model? `[01:26-01:27]`

Câu hỏi từ khán giả: *"Have you considered using a deep think like ChatGPT to say — look at this PRD and tell me if it [is good]? It takes about an hour."*

Matt diễn giải lại: *"Should I in the early planning stage be trying to optimize the plan? This is something I actually see a lot of people doing."*

Trả lời:

> "**I don't think there's a lot of value in [it].** Because I think the journey is really just **a hint of where you want to go**, and **the place that you need to be putting the work is in QA.** You can sort of do that AFK I suppose, but in my experience **you're not going to get a lot of juice out of it.**
>
> **The thing that really matters is getting alignment with the AI, which you do in the grilling session initially.**"

### Bản đồ phân bổ công sức theo Matt

```
Grilling (alignment)  ████████████  ← đầu tư nhiều
PRD                   ▏             ← gần như không
Cắt issue             ███           ← rẻ nhưng phải làm
Implementation        ▏             ← AFK, agent lo
QA + code review      ████████████  ← đầu tư nhiều
```

Hai đầu nặng, giữa nhẹ. Đây là hình dạng đặc trưng của workflow này.

---

## Nơi lưu PRD: local file vs GitHub issues `[00:33-00:35]`

Trong workshop, để dễ setup, PRD được ghi ra **local markdown** trong thư mục `issues/`.

Nhưng cách Matt làm thật:

> "The way I usually do it — you can check this out yourself — you can go to my essentially what I consider **my work repo**, which is `github.com/mattpocock/course-video-manager`."

Về repo đó:

- Là app ông ấy tự viết để quay video. *"I think I've recorded like a thousand videos in here or something nuts."*
- **744 closed issues** — *"this is essentially all of the PRDs and all of the implementation issues that I've put into here."*

→ Tức là **GitHub issues chính là hệ thống PRD của ông ấy**. Không có Notion, không có Confluence.

Lý do quan trọng của lựa chọn này liên quan tới **doc rot** — xem phần dưới.

---

## Doc rot: có nên giữ PRD trong repo không? `[01:23-01:25]`

Câu hỏi từ Slido: *"Do you keep the markdown plans and issues for later reference?"*

Matt hỏi lại cả phòng — và ông ấy tự nhận **câu này không có đáp án rõ ràng**. Nhưng đây là nỗi sợ của ông ấy:

> "What I'm really scared of with any documentation decision is: let's say we have a PRD for this gamification system, we keep it in the repo. We go on, go on, go on. **Let's say a month later, we want some edits to the gamification system.** And we go in with Claude, and it **finds this old PRD** and says: *yes, I found the original documentation for the PRD.*
>
> Well, it turns out that **the actual code has changed so much from the original PRD that it's almost unrecognizable.** The names of things have changed, the file structure has changed, **even the requirements may have changed** — we might have actually tested it with users.
>
> **This is doc rot**, where the documentation for something is **rotting away in your repo and influencing agents badly.**"

Kết luận:

> "**So I tend to not keep it around. I tend to get rid of it.** And for me, because my setup uses **GitHub issues**, I just **mark it as closed**. It can fetch it if it wants to, but **it's got a visual indicator that it's done.**"

### Vì sao GitHub issues giải quyết được vấn đề này

| | Markdown trong repo | GitHub issue đã close |
|---|---|---|
| Agent có tìm thấy không | **Có** — nó grep ra và tưởng là sự thật hiện tại | Chỉ khi chủ động fetch |
| Có dấu hiệu "đã cũ" không | **Không** | **Có** — trạng thái closed |
| Truy vết lịch sử | Mất khi xoá | Giữ nguyên |

→ Đây không phải "lưu hay xoá", mà là **lưu ở nơi agent không nhầm nó với sự thật hiện tại**.

### Câu hỏi phụ hay: thế database migration thì sao? `[01:25-01:26]`

Một khán giả hỏi: nếu markdown gây doc rot thì migration file có nên squash không?

Matt:

> "I think **database migrations are a different thing** because you have a sort of **running record of exactly what changed, and it's more deterministic.**"

Rồi thừa nhận thẳng: *"It's an interesting analogy. I'm not sure. Let's talk about it afterwards."* — và tự cười: *"That's a good way of saying I've no [idea]."*

> 🔑 Phân biệt đúng: migration là **bản ghi của thay đổi đã thực sự xảy ra** (deterministic, append-only). PRD là **bản ghi của ý định** — mà ý định thì lệch khỏi thực tế theo thời gian. Doc rot chỉ xảy ra với loại thứ hai.

---

## Q&A khác trong phase này

### Bỏ tip "be extremely concise, sacrifice grammar for concision" `[00:48-00:49]`

*(Hỏi ở phase sau nhưng liên quan trực tiếp tới việc đọc plan.)*

Đây là tip ông ấy từng chia sẻ 5 tháng trước: bỏ vào `CLAUDE.md` dòng

```markdown
When talking to me, sacrifice grammar for the sake of concision.
```

Mục đích: plan sinh ra ngắn gọn, dễ đọc.

> "But **I've since dropped this idea in preference to a grilling session.** Because what I noticed — **I didn't want to read the plans. I wanted to get on the same wavelength as the LLM. I wanted it to ask aggressive questions to me. And when I stopped reading the plans, I stopped needing them to be concise.**"

> "I think of the plans, really the destination document, as the **end state**. And **I don't need that end state to be concise.**"

Chi tiết bên lề: khi mở `CLAUDE.md` ra để demo, ông ấy phát hiện **repo không có file này** — *"Do I have a Claude.md? Maybe I don't. **I really don't use Claude.md very much.**"* Nhất quán với nguyên tắc system prompt tối thiểu ở [[02 - Hai ràng buộc của LLM - Smart zone và Memento]].

### Có cần PRD cho prototype không? `[01:02]`

> "**You don't need a PRD for your prototype.** The prototype is just — you know, **it's messy. It's supposed to give you feedback earlier on in the process.**"

Chi tiết đầy đủ về prototype (đặc biệt cho front end) ở [[10 - Tổng kết và Q&A]].

### Dev có cần hiểu sâu TypeScript nữa không? `[00:36-00:37]`

> "I believe that **code is very important**, and **bad code bases make bad agents**. If you have a garbage code base, you're going to get garbage out of the agent that's working in that code base. So I think **understanding these tools very deeply, understanding code deeply, is going to make you a much much better developer and get more out of AI.**"

Đây là hạt giống của [[08 - Deep Modules - Thiết kế codebase cho AI]].

*(Nhưng ở `[01:10]` ông ấy lại đùa khi AI tự fix một type error: "**you see why I stopped teaching TypeScript** — cuz AI knows everything." Không mâu thuẫn: hiểu sâu để **thiết kế và đánh giá**, không phải để gõ.)*

---

## Ý cần nhớ

- PRD = **destination document**. Kanban = **journey document**. Hai thứ khác nhau, đừng gộp.
- Hình thức PRD không quan trọng. **Hai mục bắt buộc**: `proposed modules to modify` và `out of scope`.
- `proposed modules` là chỗ workflow này **không phải specs-to-code** — code được giữ trong tầm mắt ngay từ khâu plan.
- **Không đọc PRD** — nhưng chỉ hợp lệ khi đã grill kỹ. Review được dời lên sớm, không bị bỏ.
- **Đừng mài PRD.** Công sức để dành cho grilling và QA.
- **Doc rot có thật.** Lưu PRD ở nơi có dấu hiệu "đã đóng" (GitHub issue closed), đừng để markdown trần trong repo.

---

[[03 - Grill Me - Đạt shared understanding|← Trước]] · [[00 - README|Mục lục]] · [[05 - Vertical Slices - Cắt issue thành tracer bullets|Tiếp: Cắt issue →]]
