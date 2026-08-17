---
tags:
  - ai
  - ai-coding
  - architecture
  - testing
timestamp: 01:18:45 - 01:28:10
chapter: "Phase 7: Deployment & Monitoring (tên chapter SAI)"
---

# 08 — Deep Modules: thiết kế codebase cho AI

`[01:18:45 – 01:28:10]` · [[07 - QA và Code Review - Nơi con người áp taste|← Trước]] · [[00 - README|Mục lục]] · [[09 - Parallelization - Sandcastle và Push vs Pull|Tiếp →]]

> ⚠️ Chapter YouTube ghi "Phase 7: Deployment & Monitoring" — **sai hoàn toàn**. Trong đoạn này Matt **không nói một câu nào về deployment hay monitoring**. Nội dung thật là kiến trúc codebase.

> 🏆 Nếu chỉ nhớ một phần của cả workshop, Matt nói hãy nhớ phần này: *"If you take one thing away from today, just try running this skill on your repo and see what happens."*

---

## Câu hỏi mở đầu `[01:13-01:14]`

> "There's probably a question in your mind here, which is: let's say **I have a code base that I'm working on, and it's a bad code base.** It's a code base that's really complicated, **that AI just never does good work in** — and maybe actually **most humans that go into that code base don't do good work either.** How do I improve that code base?"

Câu hỏi này nối thẳng với luận điểm ở [[06 - AFK Agent - Ralph loop và TDD]]: *feedback loop là trần chất lượng*. Và trần đó lại do **kiến trúc** quyết định.

Chuỗi nhân quả đầy đủ:

```
kiến trúc codebase  →  có test được không  →  chất lượng feedback loop  →  chất lượng output của AI
```

Nghĩa là: **muốn AI code tốt hơn thì sửa kiến trúc**, không phải sửa prompt.

---

## Nguồn: John Ousterhout `[01:14]`

> "In his book, ***A Philosophy of Software Design***, **John Ousterhout** talks about **the ideal type of module.**"

---

## Shallow modules — codebase xấu

### Hình dạng

> "Let's imagine that you have a code base that looks like this. **Each of these blocks are individual files.** And these files **export things from them** — things that you pull from the files that you then use in other things. And so you might have **these weird dependencies** where this file over here might rely on this file, or might rely on that file.
>
> Now, if these files are **small and they don't export many things**, then John Ousterhout would call these **shallow modules** essentially... They're essentially **lots and lots of small chunks.**"

```
SHALLOW — nhiều hộp nhỏ, dây nhợ chằng chịt

  ┌──┐   ┌──┐   ┌──┐   ┌──┐
  │  │──▶│  │──▶│  │◀──│  │
  └──┘   └┬─┘   └──┘   └┬─┘
    │      │      ▲      │
    └──────┼──────┘      │
           ▼             ▼
         ┌──┐          ┌──┐
         │  │─────────▶│  │
         └──┘          └──┘
```

### Vấn đề 1: AI không điều hướng được

> "**This is hard for the AI to navigate cuz it doesn't really understand the dependencies between everything.** It can't work out where everything is. It has to **manually track through the entire graph** and go: *okay, this relies on this, this one relies on this one, this one relies on this one.*"

> 🔑 Nối với smart zone: lần theo cả graph dependency **tốn context**. Codebase shallow đốt sạch smart zone ở giai đoạn **explore**, trước cả khi viết dòng code nào.

### Vấn đề 2: không biết vẽ test boundary ở đâu

> "It's also **hard to test this**, because **where do you draw your test boundaries here?** Do you test each module individually — like literally draw a test boundary around this one? And then another test boundary around the next one, and then the next one? Or should you do **big groups** of it — okay, we're going to test all of these related modules together and **just sort of hope and pray that they work.**"

### ⭐ Vấn đề 3: đây chính là nguồn gốc của "test dở"

Đoạn này giải thích **tại sao AI viết test tệ** — và câu trả lời không phải "vì AI ngu", mà **vì codebase không cho phép viết test tốt**:

> "**I think that bad tests mostly look like that**, where the AI essentially tries to **wrap every tiny function in its own test boundary**, and then just test that those individually work.
>
> But what that does is: let's say **this module over here calls those two** — so it depends on both of these. Then **this module might mis-order the functions**, or there might be stuff inside that poor module that's worth testing on its own. And if you then wrap this in a test boundary, **what do you do? Do you mock the other two modules? How does that work?**"

Vấn đề cụ thể: **hàm A đúng, hàm B đúng, nhưng gọi sai thứ tự** → không test nào bắt được, vì mỗi test chỉ nhìn một hàm.

```
Module cha gọi:  B() rồi A()   ← SAI thứ tự
                  ↓
test A: ✅ pass  (A đúng mà)
test B: ✅ pass  (B đúng mà)
                  ↓
        Bug lọt qua hoàn toàn
```

> 🔑 Đây là chỗ nối lại với [[07 - QA và Code Review - Nơi con người áp taste]]: khi Matt nói *"review the tests, make sure the tests were testing reasonable things"*, thứ ông ấy tìm chính là **test boundary đặt sai chỗ**.

Kết luận của phần này:

> "**Figuring out how to build a code base that is easy to test is essential here. Because if our code base is easy to test, then our feedback loops are going to be better, and the AI is going to do better work in our code base.**"

---

## Deep modules — codebase tốt

> "What John Ousterhout calls **deep modules**: modules that **expose a small, simple interface** that **have a lot of functionality inside them.**"

```
DEEP — interface hẹp, ruột dày

  ┌────────┐                 ┌────────┐
  │ ▭▭     │  interface nhỏ  │ ▭      │
  ├────────┤                 ├────────┤
  │        │────────────────▶│        │
  │  RẤT   │                 │  RẤT   │
  │ NHIỀU  │                 │ NHIỀU  │
  │  LOGIC │                 │  LOGIC │
  └────────┘                 └────────┘
   ╰────── 1 test boundary ──────╯
```

Lợi ích:

> "These are **easy to test** cuz — let's say there's a dependency between this one and this one. Then what you do is you just **wrap a big test boundary around that one module**, and **you're going to catch a lot of good stuff** — because there's **lots of functionality that you're testing.** And really **the caller, the person calling the module, is going to have a simple interface to work from.** So it's not too tricky."

### Bảng so sánh

| | Shallow ❌ | Deep ✅ |
|---|---|---|
| Interface | Nhiều export nhỏ | **Ít, đơn giản** |
| Ruột | Mỏng | **Dày, nhiều logic** |
| Dependency graph | Chằng chịt, khó lần | Ít cạnh, rõ ràng |
| AI explore | Tốn context lần graph | Rẻ |
| Test boundary | Không biết vẽ ở đâu → mock loạn | **Bọc quanh 1 module** |
| Bug thứ tự gọi hàm | **Lọt** | Bắt được |
| Người gọi | Phải hiểu nhiều mảnh | Chỉ cần hiểu interface |

---

## ⚠️ AI mặc định sinh ra shallow modules

> "What I find is that **unaided** — or **if you don't watch AI carefully — it's going to produce a code base that looks [shallow].** So **you need to be really, really careful when you're directing it.**"

> 🔑 Đây là **mẫu hình lặp lại lần thứ ba** trong workshop:
>
> | Tầng | AI mặc định làm | Phải ép nó làm |
> |---|---|---|
> | Chia issue | Cắt **ngang** theo layer | Cắt **dọc** (vertical slice) |
> | Viết test | Implement xong rồi **thêm test layer** | **TDD** — test trước |
> | Kiến trúc | Nhiều module **shallow** | Ít module **deep** |
>
> Ba biểu hiện của cùng một xu hướng: **AI thích chia thành nhiều mảnh mỏng, phẳng.** Và cả ba đều cần con người chủ động chống lại.

### Đây là lý do PRD có mục "proposed modules"

Nối ngược về [[04 - PRD - Document điểm đến]]. Matt mở PRD ra chỉ:

> "Inside here — **data model, the modules.** So it's specifically saying: *okay, this **gamification service is a new deep module**, which we're going to test. It's going to have **this particular interface**.* And: *okay, we're **modifying the progress service**, we're **modifying the lesson route**, the **dashboard route**, etc.*
>
> So **I'm being really specific about the modules that I'm editing, and I'm making sure that I keep that module map in my mind at all times — throughout the planning, and then throughout the implementation.**"

→ Kiểm soát kiến trúc **không xảy ra lúc review code**. Nó xảy ra **lúc viết PRD**, bằng cách nêu đích danh module nào là deep module mới, interface ra sao. Lúc review code thì đã muộn.

---

## 🔥 Gray box: giữ lại cảm nhận về codebase `[01:19-01:21]`

### Vấn đề — Matt hỏi phòng

> "Raise your hands if you feel like **you're working harder than ever before** with AI."
>
> "Raise your hands if you feel like **you know your code base less well than you used to.**"

Rất nhiều tay giơ lên. Ông ấy gọi tên vấn đề:

> "**This is a real thing.** Because we're moving fast, because we're delegating more things, **we end up losing a sense of our code base.** And **if we lose the sense of our code base, we're not going to be able to improve it — we're essentially delegating the shape of it to AI. I don't think that's good.**"

> 🔑 Cẩn thận với vòng xoáy này: mất cảm nhận về codebase → không định hướng được kiến trúc → AI tự quyết → codebase thành shallow → AI code tệ hơn → mình càng phải delegate. **Vòng lặp tự siết.**

### Giải pháp

> "How do we make it so that we can **move fast while still keeping enough space in our brains?** I think that this is a way to do it.
>
> Because what you're doing here is: not only are you thinking about **creating big shapes in your code base, big services** — what I think you should do is **design the interface for these modules, but then delegate the implementation.**
>
> In other words, **these modules can become like gray boxes**, where **you just need to know the shape of them, you need to know what they do and how they behave — but you can delegate the implementation of those modules.**"

### Phân chia trách nhiệm

```
┌─────────────────────────────────────┐
│  INTERFACE  ← BẠN thiết kế           │  ✋ giữ trong đầu
│             ← BẠN review             │
├─────────────────────────────────────┤
│                                     │
│  IMPLEMENTATION  ← AI viết           │  🤖 delegate
│                  ← AI test           │
│                  ← không cần đọc hết │
│                                     │
└─────────────────────────────────────┘
```

> "**I don't necessarily need to code review everything inside that module. I don't necessarily need to know everything of what it's doing. I just need to know that it behaves a certain way under certain conditions, and that it does its thing.**
>
> So it's kind of like: **okay, I've got a big overview of my code base, and I understand the shapes inside it, understand what the interfaces all do — but I can delegate what's inside.**
>
> I found that has been **a really nice way to retain my sense of the code base while preserving my sanity.**"

### Vì sao chỉ hoạt động với deep modules

Đây là chỗ hai ý ăn khớp với nhau:

- **Deep module** = interface nhỏ + ruột dày
- **Gray box** = mình giữ interface, giao ruột

→ Với deep module, phần mình phải giữ trong đầu là **interface nhỏ**, phần giao đi là **ruột dày**. Tỉ lệ rất có lợi.

→ Với shallow module, mọi thứ **đều là interface**. Không có gì để giao mà không mất kiểm soát. **Gray box không áp dụng được cho codebase shallow.**

> 🔑 Đây là câu trả lời thực dụng cho câu hỏi "phải review bao nhiêu code AI viết?" — không phải review hết, cũng không phải bỏ hết. **Review ranh giới, giao phần ruột.** Nhưng chỉ làm được nếu ranh giới được thiết kế tử tế trước.

---

## Skill `improve-codebase-architecture` `[01:21-01:22]`, `[01:32-01:33]`

Trả lời câu hỏi đầu phase: làm sao biến codebase shallow thành deep?

> "We have a skill. And that skill is called **`improve-codebase-architecture`. Nice and direct.**"

### Nó làm gì

> "It's essentially just going to do a **scan of our code base**, looking for what's available here. It's **exploring the architecture**, exploring how to work within this code base, and it's going to attempt to **find places to deepen the modules.** Pretty simple."

### Output thực tế trong demo `[01:32-01:33]`

Skill chạy khá lâu (Matt phải làm việc khác trong lúc chờ). Kết quả:

> "It's found a bunch of **architectural improvement candidates**. It's got essentially **a cluster of different modules that are all kind of related that could probably be tested as a unit.**
>
> Got **number one, the quiz scoring service.** There's some **reordering logic extraction** as well. **It has arguments for why they're coupled**, and it has a **dependency category** as well — so *local, substitutable, in SQLite with in-memory test DB.*
>
> **Quiz scoring service currently has zero tests. This is the biggest gap.**"

Cấu trúc output đáng chú ý — mỗi candidate gồm:

| Trường | Nội dung |
|---|---|
| Cluster | Các module liên quan nên gộp thành 1 unit test được |
| Lý do | **Argument** vì sao chúng coupled |
| Dependency category | vd `local, substitutable, in-memory test DB` — tức là **test được không cần mock** |
| Gap | Chỗ thiếu test nghiêm trọng nhất |

---

## ⭐ Case study: video editor trong browser `[01:22-01:23]`

Ví dụ ấn tượng nhất của cả workshop.

### Bối cảnh

> "Part of my **course video manager** app is **a video editor. A video editor built in the browser, which is really hardcore.** It's a decent bit of engineering."

### Vấn đề

Front end và back end tách rời → không test được luồng xuyên suốt → AI làm việc trên đó rất tệ.

### Giải pháp

> "I wanted a way that I could **wrap the entire front end all the way to the back end in like a single big module**, so that I could **test the fact that I press something on the front end and it goes all the way to the back end.**
>
> And so I found a way essentially by using **a kind of discriminated union between the two types** — I was able to use this skill to essentially have **a huge great big module that was testable from the outside**, this video editor infrastructure."

### Kết quả

> "And it meant that **AI could see the entire flow, could act on the entire flow, and test on the entire flow.** And honestly, **it was just night and day** in terms of the ability of AI to actually make changes — cuz **AI working on a video editor is pretty brutal if you don't give it good tests.**"

> 🔑 Đây là **vertical slice ở tầng kiến trúc**. Vertical slice ([[05 - Vertical Slices - Cắt issue thành tracer bullets]]) là cắt *công việc* xuyên qua layer. Cái này là cắt *module* xuyên qua layer.
>
> Bộ ba "see the flow / act on the flow / test on the flow" là tiêu chuẩn đáng dùng để đánh giá bất kỳ module nào: nếu AI không **thấy** được cả luồng thì nó không **sửa** được cả luồng.
>
> Ghi chú kỹ thuật: **discriminated union** là cách ông ấy làm cho ranh giới FE↔BE trở thành một type duy nhất, kiểm được ở compile time. Chi tiết implementation không được nói kỹ trong buổi.

### Lời khuyên chốt

> "If you take **one thing** away from today, **just try running this skill on your repo and see what happens.**"

---

## Ý cần nhớ

- Chuỗi nhân quả: **kiến trúc → khả năng test → feedback loop → chất lượng AI.** Muốn AI tốt hơn thì sửa đầu chuỗi.
- **Deep module** = interface nhỏ + ruột dày. **Shallow** = nhiều mảnh mỏng, graph rối.
- Shallow gây 3 vấn đề: AI tốn context để lần graph, không biết vẽ test boundary, và **bug thứ tự gọi hàm lọt hoàn toàn**.
- **AI mặc định sinh shallow.** Đây là lần thứ ba của cùng một xu hướng (cắt ngang / test sau / module mỏng).
- Kiểm soát kiến trúc xảy ra **lúc viết PRD** (mục proposed modules), không phải lúc review code.
- **Gray box**: thiết kế interface, giao implementation. Cách duy nhất để đi nhanh mà không mất cảm nhận codebase — **và chỉ áp dụng được với deep module**.
- Case study video editor: bọc cả FE↔BE thành **một module test được từ ngoài** → *"night and day"*.
- Chạy `improve-codebase-architecture` là hành động cụ thể nhất rút ra từ workshop.

---

## Sách

**John Ousterhout — *A Philosophy of Software Design***. Đây là nguồn của deep/shallow modules và là cuốn được nhắc kỹ nhất trong buổi.

---

[[07 - QA và Code Review - Nơi con người áp taste|← Trước]] · [[00 - README|Mục lục]] · [[09 - Parallelization - Sandcastle và Push vs Pull|Tiếp: Parallelization →]]
