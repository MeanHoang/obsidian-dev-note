---
tags:
  - ai
  - ai-coding
  - code-review
  - qa
timestamp: 01:05:30 - 01:18:45
chapter: "Phase 6: Human-in-the-Loop Review"
---

# 07 — QA & Code Review: nơi con người áp taste

`[01:05:30 – 01:18:45]` · [[06 - AFK Agent - Ralph loop và TDD|← Trước]] · [[00 - README|Mục lục]] · [[08 - Deep Modules - Thiết kế codebase cho AI|Tiếp →]]

> Cùng với grilling session, đây là một trong hai chỗ Matt đầu tư công sức nhiều nhất.

---

## 🔥 Automated review phải clear context `[01:05-01:06]`

Đây là kỹ thuật **dễ bỏ sót nhất nhưng rẻ nhất** trong cả workshop.

### Bối cảnh

Câu hỏi: *"Why not AI QA everything?"* Matt đồng ý là **nên có** bước automated review:

> "You definitely should do an automated review step as part of implementation. So you have your implementation, you should then — **because tokens are pretty cheap and AI is actually really good at reviewing stuff** — you should get it to **review its own code before you then QA. I found that that catches a ton of different bugs.**"

### Nhưng — cái bẫy

> "The way that works is: if you have an implementation that used up a bunch of tokens in the smart zone, **if you get it to do its reviewing [ngay sau đó], it's going to be doing the reviewing in the dumb zone.** And so **the reviewer will be dumber than the thing that actually implemented it.**
>
> Whereas **if you clear the context, then you're essentially going to be able to review in the smart zone**, which is where you want to be."

### Hình dung

```
❌ SAI — review nối tiếp trong cùng session

context: 0 ────────────────── 100K ────────────── 200K
         │◄── implement ────►│◄─── review ─────►│
              SMART ZONE          DUMB ZONE
                                      ▲
                        reviewer NGU HƠN implementer


✅ ĐÚNG — clear rồi mới review

session A: 0 ──── implement ──── 100K   → commit → /clear
                  SMART ZONE

session B: 0 ──── review ──── 60K
                  SMART ZONE
                      ▲
            reviewer cũng ở smart zone
```

> 🔑 Nghịch lý phải nhớ: **agent vừa viết xong code là agent tệ nhất để review nó.** Không chỉ vì thiên vị — mà vì nó đang ở phần ngu nhất của context window.
>
> Đây là hệ quả trực tiếp của smart zone ở [[02 - Hai ràng buộc của LLM - Smart zone và Memento]]. Chi phí để làm đúng gần bằng 0: chỉ là tách thành hai session.

Liên hệ: cùng nguyên lý với **sub agent** ở [[03 - Grill Me - Đạt shared understanding]] và với kiến trúc **implementer → reviewer riêng biệt** trong Sandcastle ở [[09 - Parallelization - Sandcastle và Push vs Pull]].

---

## Thứ tự code review của Matt `[01:10-01:11]`

Rất cụ thể, và thứ tự có lý do:

```
1. Đọc TEST trước
   → "make sure the tests were testing reasonable things"

2. Rồi mới đọc CODE
   → "just to make sure that it's not doing anything too crazy"

3. Rồi QA THỦ CÔNG
   → "the essential thing is I need to actually look at the dashboard"
```

Nguyên văn:

> "If I was doing code review here, **I would first go to review the tests**, make sure the tests were testing reasonable things, **and then go and review the code itself** just to make sure that it's not doing anything too crazy. **The essential thing is I need to actually look at the dashboard.**"

### Vì sao test trước?

Vì test là **đặc tả hành vi** mà AI tự đặt ra cho chính nó. Nếu test sai chỗ (test nhầm thứ, hoặc test quá nông), thì:

- Code pass hết test cũng vô nghĩa
- Và mọi thay đổi sau này sẽ được "bảo vệ" bởi một bộ test sai

Vấn đề **test dở trông như thế nào** được nói kỹ ở [[08 - Deep Modules - Thiết kế codebase cho AI]] — AI có xu hướng bọc từng hàm nhỏ vào một test boundary riêng.

Con số cuối buổi: repo có **284 tests**.

Matt cũng thừa nhận giới hạn: *"I do find **front end really hard to test** here. We're essentially just testing the service."*

---

## Demo QA thất bại — phần thật nhất của workshop `[01:11-01:12]`

Matt cảnh báo trước: *"There's nothing less exciting than watching someone else QA something."* Nhưng đoạn này lại là đoạn giá trị.

### Diễn biến

1. Log in với tài khoản student **Emma Wilson** (*"Oh, if it'll let me. Maybe it won't let — come on, son. There we go."*)
2. Vào Courses → "Introduction to TypeScript" → Continue learning
3. Đánh dấu hoàn thành 1 lesson
4. **💥 "Something went wrong"**

### Lỗi

> "I imagine it's because I don't have — **SQLite error. I don't have the right table. So I need a table `point_events`.**"

Và nhận xét kèm theo:

> "**`point events` is a strange table name. I'm not sure quite what it was thinking there.**"

### Cách xử lý

> "Let's run `npm db migrate` — **push, I think. I can't remember which one it was.**"

### Ba điều rút ra từ một lỗi nhỏ

1. **Agent chạy hết test, hết type check, vẫn xanh — nhưng app không chạy.** Migration chưa được apply. Feedback loop tự động **không phủ** được chỗ này. Đây chính là lý do QA thủ công không bỏ được.

2. **Chỉ QA thủ công mới bắt được vấn đề đặt tên.** `point_events` pass mọi test, nhưng con người nhìn vào thấy gợn. Không có công cụ tự động nào báo "tên bảng này hơi lạ".

3. **Vertical slice làm cho QA khả thi.** Vì slice này xuyên từ schema tới dashboard, Matt **bấm được vào app** ngay sau một vòng loop. Nếu là horizontal slice, sau vòng đầu chỉ có schema — không QA được gì.

---

## 🔥 QA = nơi con người áp taste `[01:12-01:13]`

Đây là lập luận cốt lõi về vì sao không automate hết được:

> "It's so important to **QA it manually** here, because **QA is how I then impose my opinions back onto the code base, how I impose my taste.**
>
> What you'll often find is that there are **teams out there who are trying to automate everything** — like every part of this process. And if you try to automate the creation of the idea, automate the QA, automate the research, automate the prototype, **you end up with apps that I feel just lack taste and are bad.** Maybe they just don't work, or they don't even work as intended, or there's just no —
>
> **You need a human touch when you're building this stuff, because without that, you just end up with slop. And we are not producing slop here. We're trying to produce high-quality stuff — and so that's what the QA is for.**"

### Vì sao đây không phải câu nói suông

Nhìn lại workflow, chỗ nào con người thực sự có mặt:

| Phase | Người có mặt? | Người đóng góp gì |
|---|---|---|
| Grilling | ✅ | **Quyết định** — trả lời câu hỏi nghiệp vụ |
| PRD | ❌ (không đọc) | — |
| Cắt issue | ✅ | **Phán đoán kiến trúc** — "slice này quá ngang" |
| Implementation | ❌ (AFK) | — |
| **QA** | ✅ | **Taste** — cái này dùng có ổn không, tên này có kỳ không |

→ Ba điểm chạm, mỗi điểm một loại phán đoán khác nhau mà AI không thay được. Bỏ QA đi thì workflow mất **toàn bộ** kênh phản hồi về chất lượng cảm nhận.

---

## ⭐ QA sinh ra issue mới `[01:34]`

*(Nói ở phần tổng kết nhưng thuộc về đây — và Matt tự nhận ông ấy quên nhắc.)*

> "**One thing I didn't really mention** is that in the QA phase — **what the QA phase is for is creating more issues for that Kanban board.** So **while it's implementing even, you can be QAing the stuff and going back, adding more issues.** And **the Kanban board just allows you to add blocking issues kind of infinitely really.**"

Đây là chỗ workflow **thôi là đường thẳng và thành vòng lặp**:

```
      ┌─────────────────────────────────────┐
      │                                     │
      ↓                                     │
  Kanban board                              │
      ↓                                     │
  agent implement (AFK) ──→ commit          │
      ↓                                     │
  người QA ──→ tìm ra vấn đề ──→ issue mới ─┘
      ↓
  (chạy SONG SONG với implement)
```

> 🔑 Điểm tinh tế: **QA và implementation chạy đồng thời.** Agent đang làm issue #5 thì mình QA issue #2 và nạp issue #9, #10 vào board. Đây mới là lúc mô hình "day shift / night shift" thực sự có lãi — không có thời gian chết ở cả hai phía.
>
> Và đây cũng là lý do **Kanban board tốt hơn multi-phase plan** ([[05 - Vertical Slices - Cắt issue thành tracer bullets]]): thêm ticket vào board là chuyện thường; chèn phase vào giữa một plan tuần tự thì phải viết lại.

---

## Bàn giao cho team `[01:35]`

> "Once that's all done, once you've got code that you're happy with, **then you can share it with your team and you can get a full review.** So once you get here, **this is kind of one developer, or maybe a couple of developers, managing this** — and then **it's kind of up to you to figure out how to merge it back in.**"

→ Toàn bộ workflow này là quy mô **1 dev (hoặc vài dev)**. Bước hoà vào quy trình team chung Matt để ngỏ.

---

## Ý cần nhớ

- **Clear context trước khi review.** Agent vừa implement xong đang ở dumb zone — reviewer sẽ ngu hơn implementer. Chi phí sửa: bằng 0.
- **Nên có automated review** — token rẻ, AI review tốt, bắt được nhiều bug. Nhưng nó **không thay** QA người.
- Thứ tự review: **test → code → QA tay**. Test trước vì nó là đặc tả AI tự đặt cho mình.
- **Test xanh không có nghĩa app chạy.** Demo thật fail vì thiếu migration.
- **QA là kênh duy nhất để áp taste.** Automate hết = slop.
- **QA nạp issue ngược vào Kanban**, và chạy **song song** với implementation. Đây mới là vòng lặp thật.

---

[[06 - AFK Agent - Ralph loop và TDD|← Trước]] · [[00 - README|Mục lục]] · [[08 - Deep Modules - Thiết kế codebase cho AI|Tiếp: Deep Modules →]]
