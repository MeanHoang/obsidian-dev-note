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

> 💡 **PRD** = *Product Requirements Document* — tài liệu mô tả yêu cầu sản phẩm. Thuật ngữ chuẩn trong ngành product.

---

## Khung tư duy: destination vs journey `[00:28-00:29]`

Sau grilling session, mình có 25K token hội thoại chất lượng cao. Vấn đề: **biến nó thành cái gì?**

> "The plan here is that we take our Grill Me [session] and we need to essentially find some way of **turning it into a destination**. **We're figuring out the shape of the tasks during the grilling session**, and in order to turn it into a bunch of actionable actions for the AI, we essentially need to figure out the destination. **We need to know where we're going. We need to know the shape of this entire thing.**"

**Dịch:** *"Kế hoạch ở đây là ta lấy phiên Grill Me và cần tìm cách **biến nó thành một điểm đến**. **Ta đang tìm ra hình dạng của các task trong lúc grilling**, và để biến nó thành một loạt hành động cụ thể cho AI, ta cần xác định được điểm đến. **Ta cần biết mình đang đi đâu. Ta cần biết hình dạng của toàn bộ thứ này.**"*

> 💡 **Ý là:** Từ "**shape**" (hình dạng) lặp lại rất nhiều trong cả workshop. Nó không phải là chi tiết — nó là **đường bao**: hệ thống này gồm những phần nào, chúng nối với nhau ra sao, ranh giới ở đâu. Biết shape thì mới chia nhỏ được mà không cắt nhầm chỗ.

Hai document cần có:

| Document | Trả lời câu hỏi | Là gì | File |
|---|---|---|---|
| **Destination document** | *Đích đến trông như thế nào?* | **PRD** — user stories + definition of done | File này |
| **Journey document** | *Đi tới đó bằng đường nào?* | **Kanban board** — các issue + quan hệ blocking | [[05 - Vertical Slices - Cắt issue thành tracer bullets]] |

> "We need something to document **the destination**. And we need something to document **the journey**."

**Dịch:** *"Ta cần một thứ để ghi lại **điểm đến**. Và ta cần một thứ để ghi lại **hành trình**."*

---

## Skill `write-a-prd`

### Các bước bên trong skill

1. Hỏi user một **mô tả dài, chi tiết** về vấn đề
2. Explore repo (nếu là session mới)
3. **Interview the user relentlessly** — tức là grill lần nữa
4. Điền vào **PRD template**

> "You can use write-a-PRD **without** grilling first, but **I just like to grill first and then write the PRD afterwards.**"

**Dịch:** *"Bạn có thể dùng write-a-PRD mà **không** grill trước, nhưng **tôi thích grill trước rồi mới viết PRD sau.**"*

→ Tức là skill này **tự đủ**, grill-me là bước tăng cường. Nhưng Matt luôn làm cả hai.

### Gọi

Trong demo ông ấy chỉ gõ đúng:

```
write a PRD
```

...ngay trong session grill-me đang chạy (không clear), nên nó thừa hưởng toàn bộ 25K token hội thoại.

> 💡 **Ý là:** Đây là **ngoại lệ có chủ đích** với nguyên tắc `/clear` ở [[02 - Hai ràng buộc của LLM - Smart zone và Memento]]. Không clear vì 25K token đó **chính là nguyên liệu** để viết PRD. Clear ở đây thì mất sạch alignment vừa xây.
>
> Quy tắc thật không phải "luôn clear", mà là: **clear khi context hiện tại không còn giúp gì cho việc tiếp theo.**

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

**Dịch:** *"Kiểu như **hình dạng của nó không quan trọng lắm.** Tôi có một cấu trúc tôi thích, nhưng **bạn cứ chọn cấu trúc của riêng bạn, hoặc bất cứ cái gì công ty bạn đang dùng.** Tất cả những gì ta đang làm chỉ là **tóm tắt lại design concept mà ta đã có tới lúc này.**"*

> 💡 **Ý là:** Một câu rất giải phóng. Đừng tốn thời gian tranh cãi về template. PRD **không phải nơi tạo ra giá trị** — giá trị đã được tạo ở grilling session rồi. Đây chỉ là chỗ đổ ra.

Về user stories, ông ấy nhắc: *"you know, there are — **cucumber** is a language you can use to write these in, or we just sort of write them ourselves essentially."*

> 💡 **Cucumber** là công cụ BDD dùng cú pháp Gherkin (`Given... When... Then...`) để viết user story thành test chạy được.

---

## ⭐ Mục 1: Proposed modules to modify `[00:32-00:33]`

Đây là mục **quan trọng nhất** trong PRD, và là điểm phân biệt workflow này với specs-to-code.

Việc đầu tiên skill đưa ra trước khi viết PRD:

> "The first thing that it's going to give me are **a set of proposed modules it wants to modify.** Now, **there's a deep reason why I'm thinking about this.**"

**Dịch:** *"Thứ đầu tiên nó đưa cho tôi là **một danh sách các module mà nó đề xuất sẽ sửa.** Và **có một lý do sâu xa vì sao tôi nghĩ về chuyện này.**"*

Lý do:

> "At this stage we have an idea, we have sort of specced out the idea, we've reached an understanding of what we're trying to do — and then **we need to start thinking about the code**. Because at this point — **this is not specs to code. This is not where we're ignoring the code. We actually keep the code in mind throughout the whole process.**"

**Dịch:** *"Ở giai đoạn này ta đã có một ý tưởng, ta đã đặc tả nó ra, ta đã đạt được hiểu biết về thứ mình đang cố làm — và giờ **ta cần bắt đầu nghĩ về code**. Bởi vì tới điểm này — **đây không phải specs-to-code. Đây không phải chỗ ta phớt lờ code. Ta thực sự giữ code trong đầu suốt cả quá trình.**"*

Output thực tế trong demo:

> "It's saying: *recommend tests for the gamification service — it is the only **deep module** with meaningful logic.*"

**Dịch:** *"Nó nói: đề xuất viết test cho gamification service — đây là **deep module** duy nhất có logic thực chất."*

Matt duyệt: *"These modules look right."* (*"Mấy module này trông đúng rồi."*)

Và trong PRD sinh ra `[01:18]`, mục data model / modules ghi rõ:

- `gamification service` — **module deep mới**, sẽ được test, có interface cụ thể
- Sửa `progress service`
- Sửa `lesson route`
- Sửa `dashboard route`

> "**I'm being really specific about the modules that I'm editing, and I'm making sure that I keep that module map in my mind at all times — throughout the planning, and then throughout the implementation.**"

**Dịch:** *"**Tôi rất cụ thể về những module mình sẽ sửa, và tôi đảm bảo giữ cái bản đồ module đó trong đầu mọi lúc — suốt quá trình planning, rồi suốt quá trình implementation.**"*

> 🔑 **Ý là:** Chữ **deep module** ở đây không phải ngẫu nhiên — nó là khái niệm của Ousterhout, xem [[08 - Deep Modules - Thiết kế codebase cho AI]]. Tức là **ngay từ lúc viết PRD, Matt đã đang thiết kế kiến trúc**, chứ không phải chỉ mô tả tính năng.
>
> Đây là chỗ then chốt: kiểm soát kiến trúc **không xảy ra lúc review code**. Lúc đó đã muộn — code viết xong rồi, sửa thì tốn. Nó xảy ra ở đây, khi mọi thứ còn là chữ.

---

## ⭐ Mục 2: Out of scope `[00:58]`

Chỗ lưu **quyết định phủ định** — những thứ đã cân nhắc trong grilling session rồi quyết định loại.

Câu hỏi từ Slido: *"How do you retain negative decisions, things that you decided against, and rationales, when persisting the results from the grill me session?"*

**Dịch câu hỏi:** *"Làm sao anh giữ lại các quyết định phủ định — những thứ anh đã quyết định không làm — cùng với lý do, khi lưu lại kết quả từ phiên grill me?"*

> "There's a very simple answer: in the write-a-PRD section, there is a section at the bottom of **the things that are out of scope**. So the things we're not going to tackle in this PRD — **which is very important for giving a definition of done.**"

**Dịch:** *"Câu trả lời rất đơn giản: trong phần write-a-PRD, có một mục ở cuối về **những thứ nằm ngoài phạm vi**. Tức những thứ ta sẽ không đụng tới trong PRD này — **điều này rất quan trọng để có được definition of done.**"*

Ví dụ từ grilling session ở phase trước, những thứ lẽ ra nằm ở mục này: bỏ video-watch events (noisy, gameable), streaks đứng riêng không tính điểm.

> 🔑 **Ý là:** Không có mục này thì thông tin *"tại sao không làm X"* biến mất hoàn toàn. Hai tuần sau sẽ có người — hoặc chính AI — đề xuất lại X, và cả team lại ngồi tranh luận từ đầu.
>
> **Quyết định phủ định đắt ngang quyết định khẳng định**, nhưng hầu như không ai ghi lại.

---

## 🔥 "Tôi không đọc PRD" `[00:35]`

Đây là tuyên bố gây tranh cãi nhất buổi. Matt hỏi phòng: *"Should I be reviewing this document?"* — nhiều tay giơ lên. Rồi:

> "**I don't look at these. I don't look at these.**
>
> The reason I don't look at these is because — **what am I testing at this point?** When I read it, what am I testing? **What are the failure modes I'm trying to test for?**
>
> I know that **LLMs are great at summarization** — cuz they are, they're really good at summarization. And **I have reached the same wavelength as the LLM** — using the grill me skill, we have a **shared design concept**. So if I have a shared design concept, **all I'm doing is essentially checking the LLM's ability to summarize.** So I don't tend to read these."

**Dịch:** *"**Tôi không đọc mấy cái này. Tôi không đọc.***
>
> *Lý do tôi không đọc là vì — **tới thời điểm này tôi đang kiểm tra cái gì?** Khi tôi đọc nó, tôi đang kiểm tra cái gì? **Những failure mode nào tôi đang cố tìm?***
>
> *Tôi biết rằng **LLM rất giỏi tóm tắt** — thật đấy, chúng tóm tắt cực tốt. Và **tôi đã ở cùng tần số với LLM rồi** — nhờ dùng skill grill me, chúng tôi có một **design concept chung**. Vậy nếu tôi đã có design concept chung, thì **tất cả những gì tôi làm chỉ là kiểm tra khả năng tóm tắt của LLM.** Nên tôi thường không đọc."*

> 💡 "**failure mode**" (chế độ hỏng) là thuật ngữ kỹ thuật: **cách thức mà một thứ có thể hỏng**. Câu hỏi "what are the failure modes I'm trying to test for?" rất đắt — nó áp dụng được cho **mọi** hoạt động review, không chỉ PRD.

### Lập luận tách ra cho rõ

1. Review là để **bắt failure mode**. Nếu không nêu được failure mode đang tìm thì việc review là **nghi lễ**, không phải công việc.
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

**Dịch câu hỏi:** *"Anh có cân nhắc dùng một model deep-think như ChatGPT để bảo nó: nhìn cái PRD này và cho tôi biết nó có ổn không? Mất khoảng một tiếng."*

Matt diễn giải lại: *"Should I in the early planning stage be trying to optimize the plan? This is something I actually see a lot of people doing."*

Trả lời:

> "**I don't think there's a lot of value in [it].** Because I think the journey is really just **a hint of where you want to go**, and **the place that you need to be putting the work is in QA.** You can sort of do that AFK I suppose, but in my experience **you're not going to get a lot of juice out of it.**
>
> **The thing that really matters is getting alignment with the AI, which you do in the grilling session initially.**"

**Dịch:** *"**Tôi không nghĩ nó có nhiều giá trị.** Bởi tôi cho rằng hành trình thực ra chỉ là **một gợi ý về nơi bạn muốn đến**, và **chỗ bạn cần bỏ công sức vào là QA.** Bạn có thể làm cái đó kiểu AFK, nhưng theo kinh nghiệm của tôi **bạn sẽ không vắt ra được nhiều nước cốt từ nó đâu.***
>
> ***Thứ thực sự quan trọng là đạt được alignment với AI, và bạn làm điều đó ở phiên grilling ngay từ đầu.**"*

> 💡 "**get juice out of it**" = vắt được nước cốt, tức **thu được lợi ích đáng kể**.

### Bản đồ phân bổ công sức theo Matt

```
Grilling (alignment)  ████████████  ← đầu tư nhiều
PRD                   ▏             ← gần như không
Cắt issue             ███           ← rẻ nhưng phải làm
Implementation        ▏             ← AFK, agent lo
QA + code review      ████████████  ← đầu tư nhiều
```

Hai đầu nặng, giữa nhẹ. Đây là hình dạng đặc trưng của workflow này.

> 💡 **Người mới thường làm ngược lại**: viết PRD thật kỹ (vì nó cảm giác như "làm việc nghiêm túc"), rồi QA qua loa (vì nó chán). Kết quả: tài liệu đẹp, sản phẩm tệ.

---

## Nơi lưu PRD: local file vs GitHub issues `[00:33-00:35]`

Trong workshop, để dễ setup, PRD được ghi ra **local markdown** trong thư mục `issues/`.

Nhưng cách Matt làm thật:

> "The way I usually do it — you can check this out yourself — you can go to my essentially what I consider **my work repo**, which is `github.com/mattpocock/course-video-manager`."

**Dịch:** *"Cách tôi thường làm — bạn có thể tự xem — vào cái mà tôi coi là **repo công việc của mình**, là `github.com/mattpocock/course-video-manager`."*

Về repo đó:

- Là app ông ấy tự viết để quay video. *"I think I've recorded like a thousand videos in here or something nuts."* (*"Tôi nghĩ tôi đã quay khoảng một nghìn video trong này, con số điên rồ."*)
- **744 closed issues** — *"this is essentially all of the PRDs and all of the implementation issues that I've put into here."*
  **Dịch:** *"đây về cơ bản là toàn bộ PRD và toàn bộ issue implementation mà tôi đã đưa vào đây."*

→ Tức là **GitHub issues chính là hệ thống PRD của ông ấy**. Không có Notion, không có Confluence.

Lý do quan trọng của lựa chọn này liên quan tới **doc rot** — xem phần dưới.

---

## Doc rot: có nên giữ PRD trong repo không? `[01:23-01:25]`

Câu hỏi từ Slido: *"Do you keep the markdown plans and issues for later reference?"*

> 💡 **Doc rot** = *tài liệu mục nát*. Hiện tượng tài liệu vẫn nằm đó nhưng nội dung đã lệch khỏi thực tế, và **vì trông vẫn còn nguyên vẹn nên người đọc tin nó**. Nguy hiểm hơn không có tài liệu.

Matt hỏi lại cả phòng — và ông ấy tự nhận **câu này không có đáp án rõ ràng**. Nhưng đây là nỗi sợ của ông ấy:

> "What I'm really scared of with any documentation decision is: let's say we have a PRD for this gamification system, we keep it in the repo. We go on, go on, go on. **Let's say a month later, we want some edits to the gamification system.** And we go in with Claude, and it **finds this old PRD** and says: *yes, I found the original documentation for the PRD.*
>
> Well, it turns out that **the actual code has changed so much from the original PRD that it's almost unrecognizable.** The names of things have changed, the file structure has changed, **even the requirements may have changed** — we might have actually tested it with users.
>
> **This is doc rot**, where the documentation for something is **rotting away in your repo and influencing agents badly.**"

**Dịch:** *"Điều tôi thực sự sợ với mọi quyết định về tài liệu là: giả sử ta có một PRD cho hệ thống gamification này, ta giữ nó trong repo. Ta đi tiếp, đi tiếp, đi tiếp. **Giả sử một tháng sau, ta muốn chỉnh sửa hệ thống gamification.** Ta mở Claude lên, và nó **tìm thấy cái PRD cũ** rồi nói: vâng, tôi đã tìm thấy tài liệu gốc của PRD.*
>
> *Ơ nhưng hoá ra **code thực tế đã thay đổi nhiều tới mức gần như không nhận ra so với PRD gốc.** Tên gọi các thứ đã đổi, cấu trúc file đã đổi, **thậm chí cả requirement cũng có thể đã đổi** — có khi ta đã test với user thật rồi.*
>
> ***Đây chính là doc rot**, khi tài liệu của một thứ đang **mục dần trong repo và tác động xấu tới agent.**"*

Kết luận:

> "**So I tend to not keep it around. I tend to get rid of it.** And for me, because my setup uses **GitHub issues**, I just **mark it as closed**. It can fetch it if it wants to, but **it's got a visual indicator that it's done.**"

**Dịch:** *"**Nên tôi có xu hướng không giữ nó lại. Tôi vứt đi.** Và với tôi, vì setup của tôi dùng **GitHub issues**, tôi chỉ **đánh dấu closed**. Nó vẫn fetch được nếu muốn, nhưng **nó có một dấu hiệu trực quan rằng việc này đã xong.**"*

### Vì sao GitHub issues giải quyết được vấn đề này

| | Markdown trong repo | GitHub issue đã close |
|---|---|---|
| Agent có tìm thấy không | **Có** — nó grep ra và tưởng là sự thật hiện tại | Chỉ khi chủ động fetch |
| Có dấu hiệu "đã cũ" không | **Không** | **Có** — trạng thái closed |
| Truy vết lịch sử | Mất khi xoá | Giữ nguyên |
| Người mới đọc được không | Có | Có |

> 🔑 **Ý là:** Đây không phải câu hỏi "lưu hay xoá", mà là **"lưu ở nơi agent không nhầm nó với sự thật hiện tại"**. Con người nhìn tag `closed` là hiểu ngay; agent grep file markdown thì không có tín hiệu nào cả.

### Câu hỏi phụ hay: thế database migration thì sao? `[01:25-01:26]`

Một khán giả hỏi: nếu markdown gây doc rot thì migration file có nên squash không?

Matt:

> "I think **database migrations are a different thing** because you have a sort of **running record of exactly what changed, and it's more deterministic.**"

**Dịch:** *"Tôi nghĩ **database migration là chuyện khác** vì bạn có một dạng **bản ghi liên tục về chính xác cái gì đã thay đổi, và nó mang tính deterministic hơn.**"*

Rồi thừa nhận thẳng: *"It's an interesting analogy. I'm not sure. Let's talk about it afterwards."* — và tự cười: *"That's a good way of saying I've no [idea]."*

**Dịch:** *"Đó là một phép so sánh thú vị. Tôi không chắc. Nói chuyện sau nhé."* — *"Đó là cách nói hoa mỹ của 'tôi chịu'."*

> 🔑 **Phân biệt đúng:** migration là **bản ghi của thay đổi đã thực sự xảy ra** (deterministic, append-only, không sửa cái cũ). PRD là **bản ghi của ý định** — mà ý định thì lệch khỏi thực tế theo thời gian.
>
> **Doc rot chỉ xảy ra với loại thứ hai.** Đây cũng là lý do ADR (Architecture Decision Record) không rot: nó ghi "ngày X ta quyết định Y vì Z" — một sự kiện đã xảy ra, không phải một dự định.

---

## Q&A khác trong phase này

### Bỏ tip "be extremely concise, sacrifice grammar for concision" `[00:48-00:49]`

Đây là tip ông ấy từng chia sẻ 5 tháng trước: bỏ vào `CLAUDE.md` dòng

```markdown
When talking to me, sacrifice grammar for the sake of concision.
```

**Dịch:** *"Khi nói chuyện với tôi, hãy hy sinh ngữ pháp để đổi lấy sự ngắn gọn."*

Mục đích: plan sinh ra ngắn gọn, dễ đọc.

> "But **I've since dropped this idea in preference to a grilling session.** Because what I noticed — **I didn't want to read the plans. I wanted to get on the same wavelength as the LLM. I wanted it to ask aggressive questions to me. And when I stopped reading the plans, I stopped needing them to be concise.**"

**Dịch:** *"Nhưng **từ đó tôi đã bỏ ý tưởng này để chuyển sang phiên grilling.** Bởi vì cái tôi nhận ra là — **tôi không muốn đọc plan. Tôi muốn ở cùng tần số với LLM. Tôi muốn nó hỏi tôi những câu hỏi gắt gao. Và khi tôi ngừng đọc plan, tôi cũng ngừng cần chúng phải ngắn gọn.**"*

> "I think of the plans, really the destination document, as the **end state**. And **I don't need that end state to be concise.**"

**Dịch:** *"Tôi coi plan, thực chất là destination document, như một **trạng thái cuối**. Và **tôi không cần trạng thái cuối đó phải ngắn gọn.**"*

> 💡 **Ý là:** Một ví dụ đẹp về việc **tối ưu sai chỗ**. Ông ấy từng tối ưu để plan dễ đọc hơn. Rồi nhận ra vấn đề thật không phải "plan khó đọc" mà là "**tôi đang phải đọc plan**". Giải quyết vấn đề gốc thì tối ưu kia trở thành thừa.
>
> Đây là pattern đáng nhớ: **trước khi tối ưu một việc, hỏi xem việc đó có cần làm không.**

Chi tiết bên lề: khi mở `CLAUDE.md` ra để demo, ông ấy phát hiện **repo không có file này** — *"Do I have a Claude.md? Maybe I don't. **I really don't use Claude.md very much.**"* Nhất quán với nguyên tắc system prompt tối thiểu ở [[02 - Hai ràng buộc của LLM - Smart zone và Memento]].

### Có cần PRD cho prototype không? `[01:02]`

> "**You don't need a PRD for your prototype.** The prototype is just — you know, **it's messy. It's supposed to give you feedback earlier on in the process.**"

**Dịch:** *"**Bạn không cần PRD cho prototype.** Prototype chỉ là — bạn biết đấy, **nó lộn xộn. Nó tồn tại để cho bạn feedback sớm hơn trong quy trình.**"*

Chi tiết đầy đủ về prototype (đặc biệt cho front end) ở [[10 - Tổng kết và Q&A]].

### Dev có cần hiểu sâu TypeScript nữa không? `[00:36-00:37]`

> "I believe that **code is very important**, and **bad code bases make bad agents**. If you have a garbage code base, you're going to get garbage out of the agent that's working in that code base. So I think **understanding these tools very deeply, understanding code deeply, is going to make you a much much better developer and get more out of AI.**"

**Dịch:** *"Tôi tin rằng **code rất quan trọng**, và **codebase tệ tạo ra agent tệ**. Nếu bạn có một codebase rác, bạn sẽ nhận về rác từ agent làm việc trong codebase đó. Nên tôi nghĩ **hiểu thật sâu những công cụ này, hiểu thật sâu về code, sẽ khiến bạn thành một developer giỏi hơn rất nhiều và vắt được nhiều hơn từ AI.**"*

> 💡 **Ý là:** "garbage in, garbage out" phiên bản codebase. Đây là hạt giống của [[08 - Deep Modules - Thiết kế codebase cho AI]] — và là lý do ông ấy dành hẳn một phần cuối buổi cho kiến trúc.

*(Nhưng ở `[01:10]` ông ấy lại đùa khi AI tự fix một type error: *"**you see why I stopped teaching TypeScript** — cuz AI knows everything."* — *"thấy chưa, vì sao tôi ngừng dạy TypeScript — vì AI biết hết rồi."* Không mâu thuẫn: hiểu sâu để **thiết kế và đánh giá**, không phải để gõ.)*

---

## Ý cần nhớ

- PRD = **destination document**. Kanban = **journey document**. Hai thứ khác nhau, đừng gộp.
- Hình thức PRD không quan trọng. **Hai mục bắt buộc**: `proposed modules to modify` và `out of scope`.
- `proposed modules` là chỗ workflow này **không phải specs-to-code** — code được giữ trong tầm mắt ngay từ khâu plan. Kiểm soát kiến trúc xảy ra **ở đây**, không phải lúc review code.
- **Không đọc PRD** — nhưng chỉ hợp lệ khi đã grill kỹ. Review được dời lên sớm, không bị bỏ.
- Câu hỏi vàng cho mọi lần review: **"failure mode nào tôi đang cố tìm?"** Không trả lời được thì đó là nghi lễ.
- **Đừng mài PRD.** Công sức để dành cho grilling và QA.
- **Doc rot có thật.** Lưu PRD ở nơi có dấu hiệu "đã đóng" (GitHub issue closed), đừng để markdown trần trong repo.

---

[[03 - Grill Me - Đạt shared understanding|← Trước]] · [[00 - README|Mục lục]] · [[05 - Vertical Slices - Cắt issue thành tracer bullets|Tiếp: Cắt issue →]]
