---
tags:
  - ai
  - ai-coding
  - architecture
  - kanban
timestamp: 35:50 - 48:15
chapter: "Phase 4: Slicing Work into Issues"
---

# 05 — Vertical Slices: cắt issue thành tracer bullets

`[35:50 – 48:15]` · [[04 - PRD - Document điểm đến|← Trước]] · [[00 - README|Mục lục]] · [[06 - AFK Agent - Ralph loop và TDD|Tiếp →]]

> Đây là phase mà **con người phải can thiệp bằng tay** và Matt chứng minh tại sao — bằng việc bác bỏ đề xuất đầu tiên của AI ngay trên sân khấu.

---

## Vấn đề: chia PRD ra sao? `[00:39-00:40]`

Có PRD rồi, giờ chia nhỏ để không rơi vào dumb zone. Cách hiển nhiên:

> "Probably what you would do at this point is you would say: *okay Claude, give me a **multi-phase plan** that gets me to this destination.* That sort of makes sense. **This is what we've been doing before.** But **I have a better way of doing it now — I like creating a Kanban board out of this.**"

---

## Tại sao Kanban board thay vì multi-phase plan

### Kanban board là gì (Matt giải thích cho phòng)

> "A Kanban board is essentially just **a set of tickets that you put on the wall that have blocking relationships to each other.** This is how we've worked as developers for a long time, really **since Agile came around**."

### ⭐ Lý do quyết định: parallelize

> "This plan here — **this is really only one loop.** **Only one agent can work on these** because we have numbered phases and **they're not parallelizable.**"

Ngược lại, Kanban với quan hệ blocking:

> "This means that you can **start to parallelize. You can start to get agents working at the same time on these tasks.** This allows you to turn those plans **optimally into a directed acyclic graph**, where you're able to have three phases..."

| | Multi-phase plan | Kanban board (DAG) |
|---|---|---|
| Cấu trúc | Danh sách tuần tự 1→2→3→4 | Đồ thị có hướng, không chu trình |
| Số agent chạy được | **1** | **N** (tuỳ độ rộng của mỗi tầng) |
| Thứ tự | Cứng, do người viết áp đặt | Suy ra từ dependency thật |
| Thêm việc giữa chừng | Phải sửa lại cả plan | Chỉ thêm ticket + cạnh blocking |

Điểm cuối rất quan trọng — QA sẽ liên tục nạp issue mới vào board, xem [[07 - QA và Code Review - Nơi con người áp taste]].

### Kết quả demo: 5 issue

| # | Issue | Blocked by | Type |
|---|---|---|---|
| 1 | Schema + gamification service | — | **AFK** |
| 2 | Streak tracking | — | AFK |
| 3 | Wire points & streaks vào lesson/quiz completion | 1, 2 | AFK |
| 4 | Retroactive backfill | 1 | AFK |
| 5 | (tổng hợp cuối) | tất cả | AFK |

Đọc thành DAG:

```
        ┌── issue 1 ──┬──────────┐
tầng 1: │             │          │
        └── issue 2 ──┤          │
                      ↓          ↓
tầng 2:          issue 3     issue 4      ← 2 agent chạy SONG SONG
                      └─────┬────┘
                            ↓
tầng 3:                 issue 5
```

Nhãn **AFK** gắn thẳng vào từng issue — đây là cái mà Ralph loop sẽ lọc theo ở [[06 - AFK Agent - Ralph loop và TDD]].

---

## Tracer bullets — analogy gốc `[00:44-00:45]`

Khái niệm lấy từ ***The Pragmatic Programmer***. Matt kể nguyên văn:

> "It's quite a **violent** idea actually. You're like an **anti-aircraft gunner**, and you're looking up in the sky and **it's night**. If you're just shooting normal bullets, **you have no idea what you're firing at** — you see the plane but you don't see where your bullets are going.
>
> **Tracer bullets** — they attach a tiny bit of **phosphor** to make it glow as it goes. So **every sixth bullet you actually see a line in the sky. So you have feedback on where you're aiming.**"

Áp vào AI:

> "This is the idea here: **we increase our level of feedback and we get near instant feedback on what we're building.** Cuz without that, **the AI is kind of coding blind** until it reaches the later phases."

> 🧠 Điểm cốt lõi của analogy: viên đạn tracer **không mạnh hơn** viên thường. Nó chỉ **nhìn thấy được**. Vertical slice cũng vậy — không nhiều tính năng hơn, chỉ là **kiểm chứng được ngay**.

---

## 🔥 AI thích code ngang `[00:42-00:44]`

### Hệ thống có layer

> "Systems have layers. These might be **different deployable units** — you might have a database that lives somewhere, an API that lives maybe close to the database but in a separate bit, a **front end that lives somewhere totally different like a CDN.** Or **within these deployable units, you might have different layers within those.**"

Ví dụ từ chính repo demo:

> "In the code base that we're working in, we have a ton of different services: **quiz service, team service, user service, coupon service, core service.** And these services have dependencies on each other. **So they're kind of like individual layers.**"

→ "Layer" ở đây không chỉ là DB/API/FE. **Service phụ thuộc nhau cũng là layer.** Nhận xét này quan trọng vì nhiều codebase không có kiến trúc 3 tầng rõ ràng nhưng vẫn có vấn đề y hệt.

### Bệnh

> "**AI loves to code horizontally. So it loves to code layer by layer.**
> In phase one, it will do **all** of the database stuff, all of the schema. Then it will go into phase two and do **all** of the API stuff. Then it will add the front end on top of that."

### Tại sao đó là sai — khán giả trả lời đúng

Matt hỏi phòng: *"Can anyone tell me what's wrong with that picture?"*

Một khán giả: *"[You don't] have that whole feedback loop."*

> "**Exactly.** You don't get feedback on your work **until you've really completed phase three.** Until you get to phase three, **you're not actually testing that all the layers work together. You haven't got an integrated system that you can test against.**"

### So sánh

```
CẮT NGANG (horizontal) — AI mặc định làm thế này
┌──────────────────────────────────────┐
│ Front end                            │  ← phase 3
├──────────────────────────────────────┤
│ API / Service                        │  ← phase 2
├──────────────────────────────────────┤
│ Database / Schema                    │  ← phase 1
└──────────────────────────────────────┘
   ⚠️ feedback đầu tiên: cuối phase 3


CẮT DỌC (vertical) — cái mình cần ép nó làm
┌────┬────┬────┬──────────────────────┐
│ FE │ FE │ FE │                      │
├────┼────┼────┤                      │
│ API│ API│ API│                      │
├────┼────┼────┤                      │
│ DB │ DB │ DB │                      │
└────┴────┴────┴──────────────────────┘
  s1   s2   s3
   ✅ feedback ngay cuối slice 1
```

> "During phase one it can get feedback on **its entire flow**."

---

## Skill `prd-to-issues`

Nhiệm vụ ghi trong skill:

> "Break a PRD into **independently grabbable issues** using **vertical slices / tracer bullets**, written as **local markdown files**."

Cụm **"independently grabbable"** là điểm mấu chốt: mỗi issue phải đủ độc lập để **một agent bất kỳ nhặt lên và làm** mà không cần biết agent khác đang làm gì.

Các bước bên trong skill:

1. Locate the PRD
2. Explore the codebase (nếu là session mới)
3. **Draft vertical slices** — chia PRD thành tracer issues
4. Áp **vertical slice rules**
5. **Quiz the user** ← lại grill
6. Create the issue files

---

## 🔥 Demo thất bại và cách sửa `[00:45-00:47]`

Đây là đoạn giá trị nhất của cả phase — vì nó cho thấy **kể cả khi skill đã nói rõ "vertical slices", AI vẫn làm sai.**

### AI đề xuất sai

> "What I see here is that **even though I've told it to do vertical slices**, it's proposing to **create the gamification service first, on its own.** That's just one slice there. And **that to me feels like a horizontal slice.**"

### Tiêu chuẩn của Matt cho slice đầu tiên

> "What I want to see in the first vertical slice especially is:
> - I want to see **the schema changes**, or some schema changes
> - I want to see **some new service being created**
> - and I want **a minimal representation of that on the front end**
>
> So I want it to go through the vertical slices, **not just the horizontal.**"

### Cách sửa: một câu duy nhất

Ông ấy suýt gõ "bad boy" rồi dừng lại:

> "So I'm going to give the AI a rollicking. Uh — bad boy. **No, I'm not. I'm not going to waste tokens just being — just naming.**"

Thay vào đó gõ đúng:

```
The first slice is too horizontal.
```

> "I'll just start with that and see if it picks it up."

> 🔑 Hai bài học nhỏ nhưng thực dụng:
> 1. **Đừng mắng AI.** Tốn token, không đổi kết quả.
> 2. **Feedback ngắn nhất có thể trước.** Đừng viết một đoạn dài giải thích lại vertical slice — thử một câu, nếu nó hiểu thì xong.

### Kết quả sau khi sửa

Slice mới: **"Award points for lesson completion, visible on dashboard"**

> "**That's a beautiful vertical slice**, because it's definitely a big chunk of stuff — it's doing a lot of stories there — **but we're going to see something visible at the end**, and **the AI will then just be able to add to that.**"

Phân tích tại sao slice này tốt:

| Tiêu chí | Slice này |
|---|---|
| Có schema change? | ✅ bảng point events |
| Có service mới? | ✅ gamification service |
| Có biểu hiện trên FE? | ✅ hiện trên dashboard |
| Có kiểm chứng được bằng tay không? | ✅ hoàn thành 1 lesson → thấy điểm |
| Có nền để slice sau xây tiếp không? | ✅ *"the AI will then just be able to add to that"* |

Lưu ý: slice tốt **không có nghĩa là nhỏ**. Matt thừa nhận nó *"a big chunk of stuff"*. Tiêu chí là **xuyên hết layer**, không phải **ít việc**.

---

## Tại sao con người phải review bước này? `[00:41-00:42]`

Matt tự đặt câu hỏi phản biện:

> "You could say: *why don't we just hand that over to the AI? Why do I need to be involved here?* Cuz it's given us quite a good selection of tools here. **Why do I need to review this?**"

Trả lời:

> "My take here is that **this is really cheap to do — very quick to do once I've done the PRD — and I can immediately see some issues here.**"

### Kinh tế học của việc review

| Bước | Chi phí review | Giá trị bắt được lỗi |
|---|---|---|
| PRD | Cao (đọc cả tài liệu dài) | Thấp (chỉ là tóm tắt) → **bỏ qua** |
| **Cắt issue** | **Rất thấp** (liếc qua 5 dòng tiêu đề) | **Rất cao** (sai ở đây = cả loop AFK chạy sai hướng) |
| QA | Cao | Rất cao → **làm kỹ** |

→ Đây là lý do Matt bỏ review PRD nhưng **không bỏ** review issue. Không phải "ít review hơn", mà là **review đúng chỗ**.

---

## Về giá trị của sách cũ `[00:46]`

Ngay giữa phase này Matt dừng lại nói một câu đáng ghi:

> "What I really like about going back to those old books is that **we're really trying, in this day and age, to verbalize best software practices in English.** And **these books — 20-year-old books — have already done that.** And it's **an absolute gold mine if you want to throw that into prompts.**"

> 🔑 Đây là insight về **prompt engineering**, không chỉ về sách. Prompt tốt cần **thuật ngữ chính xác đã được đặt tên**. "Vertical slice", "tracer bullet", "deep module" — model **biết** những từ này vì chúng nằm trong training data. Viết `use vertical slices, tracer bullets` hiệu quả hơn nhiều so với mô tả dài dòng bằng lời của mình.

Nhưng ông ấy cũng cảnh báo ngay:

> "But even with that, **it's not going to do a perfect job each time.**"

— và demo ngay phía trên đã chứng minh.

---

## Trục trặc thực tế trong demo `[00:51-00:52]`

Đáng ghi vì nó rất đời:

AI cứ đòi tạo issue **trên GitHub** trong khi Matt muốn file local.

> "Ah, come on. Stop asking me for — I know it's creating them on GitHub. **I really don't want that. Oh no. You fool.** *Create them in issues instead.* — **That's not precise enough.** — *You fool. **Create them in local markdown files instead**, referencing the local version.*"

> 🔑 Bài học: khi AI làm sai, thường không phải nó ngu mà là **prompt chưa đủ chính xác**. "Create them in issues" mơ hồ (issues = thư mục local hay GitHub issues?). "Create them in local markdown files" thì rõ.
>
> Ngoài ra: đây chính là hệ quả của việc ông ấy **thường** dùng GitHub issues (xem [[04 - PRD - Document điểm đến]]) — skill đã học thói quen đó, và workshop là ngoại lệ.

---

## Ý cần nhớ

- **Kanban board (DAG) > multi-phase plan** vì plan tuần tự chỉ 1 agent chạy được.
- Mỗi issue phải **independently grabbable** và có nhãn AFK / human-in-the-loop.
- **Tracer bullet**: viên đạn không mạnh hơn, chỉ **nhìn thấy được**. Slice không cần nhỏ, cần **xuyên hết layer**.
- **AI mặc định code ngang.** Phải chủ động ép nó cắt dọc — và nó vẫn sẽ làm sai kể cả khi prompt đã nói.
- Slice đầu tiên cần đủ: **schema + service + biểu hiện tối thiểu trên FE**.
- Sửa AI bằng **câu ngắn nhất có thể**. Đừng mắng, đừng giải thích dài.
- **Review issue thì rẻ, review PRD thì đắt.** Đó là lý do bỏ cái sau, giữ cái trước.
- Dùng **thuật ngữ đã được đặt tên trong sách** khi viết prompt — model biết chúng.

---

[[04 - PRD - Document điểm đến|← Trước]] · [[00 - README|Mục lục]] · [[06 - AFK Agent - Ralph loop và TDD|Tiếp: AFK Agent →]]
