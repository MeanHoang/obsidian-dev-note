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

**Dịch:** *"Có lẽ ở điểm này bạn sẽ nói: ok Claude, cho tôi một **multi-phase plan** đưa tôi tới điểm đến này. Nghe cũng hợp lý. **Đây là cách ta vẫn làm từ trước.** Nhưng **giờ tôi có cách tốt hơn — tôi thích tạo một Kanban board từ cái này.**"*

---

## Tại sao Kanban board thay vì multi-phase plan

### Kanban board là gì (Matt giải thích cho phòng)

> "A Kanban board is essentially just **a set of tickets that you put on the wall that have blocking relationships to each other.** This is how we've worked as developers for a long time, really **since Agile came around**."

**Dịch:** *"Kanban board về cơ bản chỉ là **một tập các ticket bạn dán lên tường, có quan hệ chặn nhau.** Đây là cách chúng ta làm việc với tư cách developer từ rất lâu rồi, thực ra là **từ khi Agile xuất hiện**."*

> 💡 "**blocking relationship**" (quan hệ chặn) = ticket A phải xong thì ticket B mới làm được. Đây là thứ biến một danh sách phẳng thành một **đồ thị**.
>
> **Kanban** (看板) là từ tiếng Nhật nghĩa là "bảng hiệu", xuất phát từ hệ thống sản xuất của Toyota.

### ⭐ Lý do quyết định: parallelize

> "This plan here — **this is really only one loop.** **Only one agent can work on these** because we have numbered phases and **they're not parallelizable.**"

**Dịch:** *"Cái plan này — **thực chất nó chỉ là một cái loop duy nhất.** **Chỉ một agent làm việc trên nó được** vì ta có các phase đánh số và **chúng không song song hoá được.**"*

Ngược lại, Kanban với quan hệ blocking:

> "This means that you can **start to parallelize. You can start to get agents working at the same time on these tasks.** This allows you to turn those plans **optimally into a directed acyclic graph**, where you're able to have three phases..."

**Dịch:** *"Điều này nghĩa là bạn có thể **bắt đầu song song hoá. Bạn có thể cho nhiều agent làm việc cùng lúc trên các task này.** Nó cho phép bạn biến các plan đó **thành một đồ thị có hướng không chu trình một cách tối ưu**, nơi bạn có thể có ba tầng..."*

> 💡 **Directed acyclic graph (DAG)** = đồ thị có hướng, không có chu trình.
> - *Directed* (có hướng): A → B nghĩa là A phải xong trước B, không ngược lại.
> - *Acyclic* (không chu trình): không có vòng A → B → C → A. Nếu có thì deadlock — không việc nào bắt đầu được.
>
> Điểm hay: từ một DAG bạn **tự động tính ra được** có thể chạy song song bao nhiêu việc ở mỗi tầng. Từ một danh sách tuần tự thì không.

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

**Dịch:** *"Thực ra đây là một ý tưởng khá **bạo lực**. Bạn giống như một **xạ thủ phòng không**, đang nhìn lên bầu trời và **trời thì tối**. Nếu bạn chỉ bắn đạn thường, **bạn không biết mình đang bắn vào cái gì** — bạn thấy máy bay nhưng không thấy đạn của mình đi đâu.*
>
> ***Đạn vạch đường** — người ta gắn một chút **phốt pho** vào để nó phát sáng khi bay. Nên **cứ mỗi viên thứ sáu là bạn thấy được một vệt sáng trên trời. Nhờ vậy bạn có phản hồi về việc mình đang ngắm vào đâu.**"*

> 💡 **Tracer bullet** = **đạn vạch đường**. Trong quân sự, cứ vài viên lại xen một viên có chất phát sáng ở đuôi để xạ thủ nhìn thấy quỹ đạo và chỉnh hướng.

Áp vào AI:

> "This is the idea here: **we increase our level of feedback and we get near instant feedback on what we're building.** Cuz without that, **the AI is kind of coding blind** until it reaches the later phases."

**Dịch:** *"Ý tưởng ở đây là: **ta tăng mức độ phản hồi và nhận được phản hồi gần như tức thì về thứ mình đang xây.** Bởi vì không có nó, **AI kiểu như đang code mù** cho tới khi tới được các phase sau."*

> 🧠 **Điểm cốt lõi của analogy:** viên đạn tracer **không mạnh hơn** viên thường. Nó không bắn xa hơn, không sát thương cao hơn. Nó chỉ **nhìn thấy được**.
>
> Vertical slice cũng vậy — nó **không nhiều tính năng hơn** horizontal slice, chỉ là **kiểm chứng được ngay**. Đây là lý do một slice tốt có thể vẫn rất to (xem demo bên dưới).

---

## 🔥 AI thích code ngang `[00:42-00:44]`

### Hệ thống có layer

> "Systems have layers. These might be **different deployable units** — you might have a database that lives somewhere, an API that lives maybe close to the database but in a separate bit, a **front end that lives somewhere totally different like a CDN.** Or **within these deployable units, you might have different layers within those.**"

**Dịch:** *"Hệ thống có các tầng. Chúng có thể là **các đơn vị triển khai khác nhau** — bạn có thể có database nằm ở đâu đó, một API nằm gần database nhưng ở phần tách riêng, một **front end nằm ở nơi hoàn toàn khác như một CDN.** Hoặc **bên trong các đơn vị triển khai đó, bạn lại có các tầng khác nữa.**"*

Ví dụ từ chính repo demo:

> "In the code base that we're working in, we have a ton of different services: **quiz service, team service, user service, coupon service, core service.** And these services have dependencies on each other. **So they're kind of like individual layers.**"

**Dịch:** *"Trong codebase ta đang làm, có cả đống service khác nhau: **quiz service, team service, user service, coupon service, core service.** Và các service này phụ thuộc lẫn nhau. **Nên chúng cũng giống như các tầng riêng biệt.**"*

> 💡 **Ý là:** Nhận xét này quan trọng hơn vẻ ngoài của nó. "Layer" ở đây **không chỉ** là DB/API/FE. **Service phụ thuộc nhau cũng là layer.**
>
> Nghĩa là: kể cả codebase của bạn không có kiến trúc 3 tầng rõ ràng, kể cả nó là một mớ service phẳng, **bạn vẫn có vấn đề y hệt.**

### Bệnh

> "**AI loves to code horizontally. So it loves to code layer by layer.**
> In phase one, it will do **all** of the database stuff, all of the schema. Then it will go into phase two and do **all** of the API stuff. Then it will add the front end on top of that."

**Dịch:** *"**AI rất thích code theo chiều ngang. Nó thích code từng tầng một.** Ở phase một, nó sẽ làm **hết** phần database, hết schema. Rồi sang phase hai làm **hết** phần API. Rồi mới đắp front end lên trên."*

### Tại sao đó là sai — khán giả trả lời đúng

Matt hỏi phòng: *"Can anyone tell me what's wrong with that picture?"*

Một khán giả: *"[You don't] have that whole feedback loop."*

> "**Exactly.** You don't get feedback on your work **until you've really completed phase three.** Until you get to phase three, **you're not actually testing that all the layers work together. You haven't got an integrated system that you can test against.**"

**Dịch:** *"**Chính xác.** Bạn không nhận được phản hồi về công việc của mình **cho tới khi thực sự hoàn thành phase ba.** Trước khi tới phase ba, **bạn thực ra chưa hề kiểm tra rằng tất cả các tầng hoạt động được với nhau. Bạn chưa có một hệ thống tích hợp để kiểm thử.**"*

> 💡 **Ý là:** Vấn đề không phải "làm chậm". Vấn đề là **mọi giả định ở phase 1 và 2 đều chưa được kiểm chứng** cho tới phase 3. Nếu schema thiết kế sai ngay từ đầu, bạn phát hiện ra sau khi đã xây cả API lên trên nó.

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

**Dịch:** *"Ngay trong phase một nó đã nhận được phản hồi về **toàn bộ luồng của nó**."*

---

## Skill `prd-to-issues`

Nhiệm vụ ghi trong skill:

> "Break a PRD into **independently grabbable issues** using **vertical slices / tracer bullets**, written as **local markdown files**."

**Dịch:** *"Chia một PRD thành **các issue có thể nhặt lên độc lập**, dùng **vertical slices / tracer bullets**, viết ra thành **file markdown local**."*

> 💡 Cụm "**independently grabbable**" (có thể nhặt lên độc lập) là điểm mấu chốt: mỗi issue phải đủ độc lập để **một agent bất kỳ nhặt lên và làm** mà không cần biết agent khác đang làm gì, không cần hỏi ai. Đây là điều kiện tiên quyết để chạy song song ở [[09 - Parallelization - Sandcastle và Push vs Pull]].

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

**Dịch:** *"Cái tôi thấy ở đây là **mặc dù tôi đã bảo nó làm vertical slice**, nó vẫn đề xuất **tạo gamification service trước, đứng một mình.** Đó chỉ là một slice thôi. Và **với tôi cái đó cảm giác như một horizontal slice.**"*

### Tiêu chuẩn của Matt cho slice đầu tiên

> "What I want to see in the first vertical slice especially is:
> - I want to see **the schema changes**, or some schema changes
> - I want to see **some new service being created**
> - and I want **a minimal representation of that on the front end**
>
> So I want it to go through the vertical slices, **not just the horizontal.**"

**Dịch:** *"Cái tôi muốn thấy ở vertical slice đầu tiên đặc biệt là:*
> - *Tôi muốn thấy **các thay đổi schema**, hoặc một vài thay đổi schema*
> - *Tôi muốn thấy **một service mới được tạo ra***
> - *và tôi muốn **một biểu diễn tối thiểu của nó trên front end***
>
> *Nên tôi muốn nó đi xuyên qua các vertical slice, **không chỉ theo chiều ngang.**"*

> 💡 **Đây là một checklist dùng được ngay.** Ba gạch đầu dòng này chính là "định nghĩa vertical slice" ở dạng thao tác được. Khi nhìn một issue, hỏi: có đụng schema không? có logic mới không? có thấy được trên UI không? Thiếu một trong ba → nghi ngờ là horizontal.

### Cách sửa: một câu duy nhất

Ông ấy suýt gõ "bad boy" rồi dừng lại:

> "So I'm going to give the AI a rollicking. Uh — bad boy. **No, I'm not. I'm not going to waste tokens just being — just naming.**"

**Dịch:** *"Nên giờ tôi sẽ mắng cho AI một trận. Ờ — hư quá. **Không, thôi. Tôi sẽ không phí token chỉ để — chỉ để chửi.**"*

> 💡 "**give someone a rollicking**" (Anh-Anh) = mắng ai đó một trận ra trò.

Thay vào đó gõ đúng:

```
The first slice is too horizontal.
```

**Dịch:** *"Slice đầu tiên quá ngang."*

> "I'll just start with that and see if it picks it up."

**Dịch:** *"Tôi cứ bắt đầu bằng câu đó và xem nó có bắt được ý không."*

> 🔑 **Hai bài học nhỏ nhưng thực dụng:**
> 1. **Đừng mắng AI.** Tốn token, không đổi kết quả. Nó không có cảm xúc để mà tự ái, nhưng bạn thì tốn tiền thật.
> 2. **Feedback ngắn nhất có thể trước.** Đừng viết một đoạn dài giải thích lại vertical slice là gì — thử một câu, nếu nó hiểu thì xong. Nếu không hiểu mới nói thêm. Đây cũng là cách tiết kiệm smart zone.

### Kết quả sau khi sửa

Slice mới: **"Award points for lesson completion, visible on dashboard"**
(*"Trao điểm khi hoàn thành lesson, hiển thị được trên dashboard"*)

> "**That's a beautiful vertical slice**, because it's definitely a big chunk of stuff — it's doing a lot of stories there — **but we're going to see something visible at the end**, and **the AI will then just be able to add to that.**"

**Dịch:** *"**Đó là một vertical slice đẹp**, vì nó chắc chắn là một khối việc lớn — nó gánh khá nhiều user story — **nhưng cuối cùng ta sẽ thấy được một thứ hữu hình**, và **sau đó AI chỉ việc đắp thêm vào cái đó.**"*

Phân tích tại sao slice này tốt:

| Tiêu chí | Slice này |
|---|---|
| Có schema change? | ✅ bảng point events |
| Có service mới? | ✅ gamification service |
| Có biểu hiện trên FE? | ✅ hiện trên dashboard |
| Có kiểm chứng được bằng tay không? | ✅ hoàn thành 1 lesson → thấy điểm |
| Có nền để slice sau xây tiếp không? | ✅ *"the AI will then just be able to add to that"* |

> ⚠️ **Lưu ý ngược trực giác:** slice tốt **không có nghĩa là nhỏ**. Matt thừa nhận nó *"a big chunk of stuff"*. Tiêu chí là **xuyên hết layer**, không phải **ít việc**.
>
> Nhiều người nghe "chia nhỏ task" rồi chia thành các mẩu tí hon theo layer — đó chính là horizontal slice ở dạng vụn hơn, và tệ hơn.

---

## Tại sao con người phải review bước này? `[00:41-00:42]`

Matt tự đặt câu hỏi phản biện:

> "You could say: *why don't we just hand that over to the AI? Why do I need to be involved here?* Cuz it's given us quite a good selection of tools here. **Why do I need to review this?**"

**Dịch:** *"Bạn có thể hỏi: sao ta không giao luôn việc đó cho AI? Sao tôi cần dính vào đây? Vì nó đã đưa ra một lựa chọn khá tốt rồi mà. **Sao tôi cần review cái này?**"*

Trả lời:

> "My take here is that **this is really cheap to do — very quick to do once I've done the PRD — and I can immediately see some issues here.**"

**Dịch:** *"Quan điểm của tôi là **việc này rất rẻ — rất nhanh khi đã có PRD — và tôi thấy ngay vài vấn đề ở đây.**"*

### Kinh tế học của việc review

| Bước | Chi phí review | Giá trị bắt được lỗi |
|---|---|---|
| PRD | Cao (đọc cả tài liệu dài) | Thấp (chỉ là tóm tắt) → **bỏ qua** |
| **Cắt issue** | **Rất thấp** (liếc qua 5 dòng tiêu đề) | **Rất cao** (sai ở đây = cả loop AFK chạy sai hướng) |
| QA | Cao | Rất cao → **làm kỹ** |

> 🔑 **Ý là:** Đây là lý do Matt bỏ review PRD nhưng **không bỏ** review issue. Không phải "ít review hơn", mà là **review đúng chỗ** — chỗ có tỉ lệ giá trị/chi phí cao nhất.
>
> Và tỉ lệ ở bước cắt issue cực cao: đọc 5 dòng tiêu đề mất 30 giây, nhưng nếu sai thì agent sẽ chạy sai hướng hàng giờ trong lúc bạn ngủ.

---

## Về giá trị của sách cũ `[00:46]`

Ngay giữa phase này Matt dừng lại nói một câu đáng ghi:

> "What I really like about going back to those old books is that **we're really trying, in this day and age, to verbalize best software practices in English.** And **these books — 20-year-old books — have already done that.** And it's **an absolute gold mine if you want to throw that into prompts.**"

**Dịch:** *"Điều tôi thực sự thích khi quay lại mấy cuốn sách cũ đó là **thời buổi này chúng ta đang cố diễn đạt các best practice phần mềm ra thành tiếng Anh.** Và **những cuốn sách này — sách 20 năm tuổi — đã làm điều đó rồi.** Và nó là **một mỏ vàng đúng nghĩa nếu bạn muốn ném chúng vào prompt.**"*

> 🔑 **Ý là — đây là insight về prompt engineering, không chỉ về sách.**
>
> Prompt tốt cần **thuật ngữ chính xác đã được đặt tên**. "Vertical slice", "tracer bullet", "deep module" — model **biết** những từ này vì chúng nằm trong training data, gắn với hàng nghìn trang giải thích.
>
> Viết `use vertical slices, tracer bullets` (4 từ) hiệu quả hơn nhiều so với mô tả dài dòng bằng lời của mình (200 từ) — vừa ngắn hơn (tiết kiệm context), vừa chính xác hơn (không bị diễn giải lệch).
>
> **Đọc sách cũ = mở rộng vốn từ để nói chuyện với model.**

Nhưng ông ấy cũng cảnh báo ngay:

> "But even with that, **it's not going to do a perfect job each time.**"

**Dịch:** *"Nhưng kể cả vậy, **nó cũng sẽ không làm hoàn hảo mỗi lần đâu.**"*

— và demo ngay phía trên đã chứng minh.

---

## Trục trặc thực tế trong demo `[00:51-00:52]`

Đáng ghi vì nó rất đời:

AI cứ đòi tạo issue **trên GitHub** trong khi Matt muốn file local.

> "Ah, come on. Stop asking me for — I know it's creating them on GitHub. **I really don't want that. Oh no. You fool.** *Create them in issues instead.* — **That's not precise enough.** — *You fool. **Create them in local markdown files instead**, referencing the local version.*"

**Dịch:** *"Ây, thôi nào. Đừng hỏi tôi nữa — tôi biết nó đang tạo trên GitHub. **Tôi thực sự không muốn thế. Ôi không. Đồ ngốc.** Tạo chúng trong issues thay vì thế. — **Câu đó chưa đủ chính xác.** — Đồ ngốc. **Tạo chúng thành file markdown local thay vì thế**, tham chiếu tới bản local."*

> 🔑 **Ý là:** Khi AI làm sai, thường **không phải nó ngu mà là prompt chưa đủ chính xác.** "Create them in issues" mơ hồ — `issues` là tên thư mục local hay là GitHub issues? Cả hai cách hiểu đều hợp lý. "Create them in **local markdown files**" thì không thể hiểu nhầm.
>
> Ông ấy tự nhận ra điều đó ngay: *"That's not precise enough"* — tự sửa mình chứ không đổ lỗi cho AI.
>
> Ngoài ra: đây chính là hệ quả của việc ông ấy **thường** dùng GitHub issues (xem [[04 - PRD - Document điểm đến]]) — skill đã học thói quen đó, và workshop mới là ngoại lệ.

---

## Ý cần nhớ

- **Kanban board (DAG) > multi-phase plan** vì plan tuần tự chỉ 1 agent chạy được.
- Mỗi issue phải **independently grabbable** và có nhãn AFK / human-in-the-loop.
- **Tracer bullet**: viên đạn không mạnh hơn, chỉ **nhìn thấy được**. Slice không cần nhỏ, cần **xuyên hết layer**.
- Checklist slice đầu tiên: **schema + service mới + biểu hiện tối thiểu trên FE**.
- **AI mặc định code ngang.** Phải chủ động ép nó cắt dọc — và nó vẫn sẽ làm sai kể cả khi prompt đã nói rõ.
- Sửa AI bằng **câu ngắn nhất có thể**. Đừng mắng, đừng giải thích dài.
- **Review issue thì rẻ, review PRD thì đắt.** Đó là lý do bỏ cái sau, giữ cái trước.
- Dùng **thuật ngữ đã được đặt tên trong sách** khi viết prompt — model biết chúng, và nó ngắn hơn.
- AI làm sai thường là **prompt chưa đủ chính xác**, không phải AI ngu.

---

[[04 - PRD - Document điểm đến|← Trước]] · [[00 - README|Mục lục]] · [[06 - AFK Agent - Ralph loop và TDD|Tiếp: AFK Agent →]]
