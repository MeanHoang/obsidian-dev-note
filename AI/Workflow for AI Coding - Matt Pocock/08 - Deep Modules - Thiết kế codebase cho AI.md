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

**Dịch:** *"Có lẽ trong đầu bạn đang có một câu hỏi: giả sử **tôi đang làm việc trên một codebase, và nó là một codebase tệ.** Một codebase thực sự phức tạp, **mà AI chẳng bao giờ làm việc tốt trong đó** — và thực ra có khi **phần lớn con người bước vào codebase đó cũng chẳng làm tốt được.** Làm sao tôi cải thiện được codebase đó?"*

> 💡 **Ý là:** Để ý mệnh đề thứ hai — *"most humans... don't do good work either"*. Đây lại là thesis ở [[01 - Thesis - Software engineering fundamentals vẫn đúng]]: **codebase làm khổ AI cũng chính là codebase làm khổ người.** Không có loại codebase nào "người đọc được mà AI không đọc được".

Câu hỏi này nối thẳng với luận điểm ở [[06 - AFK Agent - Ralph loop và TDD]]: *feedback loop là trần chất lượng*. Và trần đó lại do **kiến trúc** quyết định.

Chuỗi nhân quả đầy đủ:

```
kiến trúc codebase → có test được không → chất lượng feedback loop → chất lượng output của AI
```

> 🔑 Nghĩa là: **muốn AI code tốt hơn thì sửa kiến trúc**, không phải sửa prompt. Đây là một chỗ nhìn hoàn toàn khác so với phản xạ thông thường.

---

## Nguồn: John Ousterhout `[01:14]`

> "In his book, ***A Philosophy of Software Design***, **John Ousterhout** talks about **the ideal type of module.**"

**Dịch:** *"Trong cuốn ***A Philosophy of Software Design***, **John Ousterhout** nói về **loại module lý tưởng.**"*

> 💡 John Ousterhout là giáo sư khoa học máy tính tại Stanford, cũng là người tạo ra ngôn ngữ Tcl. *A Philosophy of Software Design* là cuốn sách mỏng, nổi tiếng vì đi ngược một số lời khuyên phổ biến (ví dụ: nó phản đối việc chia hàm thật nhỏ).

---

## Shallow modules — codebase xấu

### Hình dạng

> "Let's imagine that you have a code base that looks like this. **Each of these blocks are individual files.** And these files **export things from them** — things that you pull from the files that you then use in other things. And so you might have **these weird dependencies** where this file over here might rely on this file, or might rely on that file.
>
> Now, if these files are **small and they don't export many things**, then John Ousterhout would call these **shallow modules** essentially... They're essentially **lots and lots of small chunks.**"

**Dịch:** *"Hãy tưởng tượng bạn có một codebase trông như thế này. **Mỗi khối này là một file riêng lẻ.** Và các file này **export ra các thứ** — những thứ bạn lấy từ file rồi dùng ở chỗ khác. Và thế là bạn có **những phụ thuộc kỳ quặc** kiểu file này ở đây dựa vào file kia, hoặc dựa vào file nọ.*
>
> *Bây giờ, nếu những file này **nhỏ và không export nhiều thứ**, thì John Ousterhout về cơ bản sẽ gọi chúng là **shallow module**... Chúng về cơ bản là **rất rất nhiều mẩu nhỏ.**"*

> 💡 **Shallow** = nông, cạn. **Deep** = sâu. Ẩn dụ về **độ sâu** của module: nhìn từ ngoài vào qua interface, bên trong nó sâu tới đâu?

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

**Dịch:** *"**Cái này khó cho AI điều hướng vì nó không thực sự hiểu được các phụ thuộc giữa mọi thứ.** Nó không tìm ra được mọi thứ nằm ở đâu. Nó phải **lần thủ công qua toàn bộ đồ thị** và nghĩ: ok, cái này dựa vào cái kia, cái kia dựa vào cái nọ, cái nọ dựa vào cái ấy."*

> 🔑 **Ý là — nối với smart zone:** lần theo cả graph dependency **tốn context**. Mỗi file phải đọc, mỗi import phải theo dấu.
>
> Codebase shallow **đốt sạch smart zone ở giai đoạn explore**, trước cả khi viết dòng code nào. Tới lúc bắt đầu implement thì agent đã ở dumb zone.
>
> Đây là một cách nhìn rất cụ thể về "codebase tệ": không phải nó xấu về mặt thẩm mỹ, mà là **nó đắt về mặt context**.

### Vấn đề 2: không biết vẽ test boundary ở đâu

> "It's also **hard to test this**, because **where do you draw your test boundaries here?** Do you test each module individually — like literally draw a test boundary around this one? And then another test boundary around the next one, and then the next one? Or should you do **big groups** of it — okay, we're going to test all of these related modules together and **just sort of hope and pray that they work.**"

**Dịch:** *"Nó cũng **khó test**, bởi vì **bạn vẽ ranh giới test ở đâu đây?** Bạn test từng module riêng lẻ — kiểu vẽ đúng một ranh giới quanh cái này? Rồi một ranh giới nữa quanh cái tiếp theo, rồi cái tiếp theo nữa? Hay bạn nên gom **thành nhóm lớn** — ok, ta sẽ test tất cả các module liên quan này cùng nhau rồi **kiểu như hy vọng và cầu nguyện rằng chúng chạy được.**"*

> 💡 **"Test boundary"** = ranh giới kiểm thử: bạn vẽ một vòng quanh phần nào của hệ thống và coi đó là "đơn vị" cần test. Bên trong vòng thì chạy thật, bên ngoài vòng thì mock.
>
> Câu hỏi "vẽ ở đâu" là câu hỏi khó nhất trong testing, và **codebase shallow làm cho nó không có câu trả lời tốt** — vẽ nhỏ thì vô nghĩa, vẽ to thì không kiểm soát được.

### ⭐ Vấn đề 3: đây chính là nguồn gốc của "test dở"

Đoạn này giải thích **tại sao AI viết test tệ** — và câu trả lời không phải "vì AI ngu", mà **vì codebase không cho phép viết test tốt**:

> "**I think that bad tests mostly look like that**, where the AI essentially tries to **wrap every tiny function in its own test boundary**, and then just test that those individually work.
>
> But what that does is: let's say **this module over here calls those two** — so it depends on both of these. Then **this module might mis-order the functions**, or there might be stuff inside that poor module that's worth testing on its own. And if you then wrap this in a test boundary, **what do you do? Do you mock the other two modules? How does that work?**"

**Dịch:** *"**Tôi nghĩ test dở phần lớn trông như thế**, khi AI về cơ bản cố **bọc từng hàm bé tí vào một ranh giới test riêng**, rồi chỉ test rằng từng cái chạy được riêng lẻ.*
>
> *Nhưng hệ quả là: giả sử **module này ở đây gọi hai cái kia** — tức nó phụ thuộc vào cả hai. Thế thì **module này có thể gọi các hàm sai thứ tự**, hoặc có thể có thứ bên trong cái module tội nghiệp đó đáng được test riêng. Và nếu bạn bọc cái này vào một ranh giới test, **bạn làm gì? Bạn mock hai module kia à? Cái đó hoạt động thế nào?**"*

Vấn đề cụ thể: **hàm A đúng, hàm B đúng, nhưng gọi sai thứ tự** → không test nào bắt được, vì mỗi test chỉ nhìn một hàm.

```
Module cha gọi:  B() rồi A()   ← SAI thứ tự
                  ↓
test A: ✅ pass  (A đúng mà)
test B: ✅ pass  (B đúng mà)
                  ↓
        Bug lọt qua hoàn toàn
```

> 💡 **Ví dụ đời thường:** test riêng "cho gạo vào nồi" ✅, test riêng "bật nút nấu" ✅. Nhưng nếu chương trình bật nút **trước khi** cho gạo, cả hai test vẫn xanh và bạn vẫn có một nồi cháy.
>
> Đây là loại bug mà **unit test quá nhỏ về nguyên tắc không thể bắt được** — vì lỗi nằm ở *giữa* các đơn vị, không nằm *trong* đơn vị nào.

> 🔑 **Ý là:** Đây là chỗ nối lại với [[07 - QA và Code Review - Nơi con người áp taste]]. Khi Matt nói *"review the tests, make sure the tests were testing reasonable things"*, thứ ông ấy tìm chính là **test boundary đặt sai chỗ** — chứ không phải test viết sai cú pháp.
>
> Và quan trọng hơn: **đây không phải lỗi của AI.** Đưa cho con người một codebase shallow, họ cũng sẽ viết ra đúng loại test đó.

Kết luận của phần này:

> "**Figuring out how to build a code base that is easy to test is essential here. Because if our code base is easy to test, then our feedback loops are going to be better, and the AI is going to do better work in our code base.**"

**Dịch:** *"**Tìm ra cách xây một codebase dễ test là thiết yếu ở đây. Bởi vì nếu codebase của ta dễ test, thì feedback loop của ta sẽ tốt hơn, và AI sẽ làm việc tốt hơn trong codebase của ta.**"*

---

## Deep modules — codebase tốt

> "What John Ousterhout calls **deep modules**: modules that **expose a small, simple interface** that **have a lot of functionality inside them.**"

**Dịch:** *"Cái mà John Ousterhout gọi là **deep module**: những module **phơi ra một interface nhỏ, đơn giản** nhưng **chứa rất nhiều chức năng bên trong.**"*

```
DEEP — interface hẹp, ruột dày

  ┌────────┐                 ┌────────┐
  │ ▭▭     │  interface nhỏ  │ ▭      │
  ├────────┤                 ├────────┤
  │        │────────────────▶│        │
  │  RẤT   │                 │  RẤT   │
  │ NHIỀU  │                 │  NHIỀU │
  │  LOGIC │                 │  LOGIC │
  └────────┘                 └────────┘
   ╰────── 1 test boundary ──────╯
```

Lợi ích:

> "These are **easy to test** cuz — let's say there's a dependency between this one and this one. Then what you do is you just **wrap a big test boundary around that one module**, and **you're going to catch a lot of good stuff** — because there's **lots of functionality that you're testing.** And really **the caller, the person calling the module, is going to have a simple interface to work from.** So it's not too tricky."

**Dịch:** *"Mấy cái này **dễ test** vì — giả sử có một phụ thuộc giữa cái này và cái kia. Thì cái bạn làm là chỉ cần **bọc một ranh giới test lớn quanh đúng một module đó**, và **bạn sẽ bắt được rất nhiều thứ hay ho** — bởi vì **có rất nhiều chức năng đang được test.** Và thực sự thì **người gọi, kẻ gọi module đó, sẽ có một interface đơn giản để làm việc.** Nên nó không quá rắc rối."*

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

> 💡 **Lưu ý chống hiểu nhầm:** "deep module" **không có nghĩa là file dài 2000 dòng lộn xộn**. Nó có nghĩa là **tỉ lệ giữa lượng chức năng và độ rộng của interface** cao. Một module 800 dòng nhưng chỉ export 2 hàm là deep. Một module 100 dòng export 15 hàm là shallow.

---

## ⚠️ AI mặc định sinh ra shallow modules

> "What I find is that **unaided** — or **if you don't watch AI carefully — it's going to produce a code base that looks [shallow].** So **you need to be really, really careful when you're directing it.**"

**Dịch:** *"Cái tôi thấy là **nếu không có hỗ trợ** — hoặc **nếu bạn không theo dõi AI cẩn thận — nó sẽ tạo ra một codebase trông [shallow].** Nên **bạn cần thực sự, thực sự cẩn thận khi điều hướng nó.**"*

🔑 **Ý là — đây là mẫu hình lặp lại LẦN THỨ BA trong workshop:**

| Tầng | AI mặc định làm | Phải ép nó làm |
|---|---|---|
| Chia issue | Cắt **ngang** theo layer | Cắt **dọc** (vertical slice) |
| Viết test | Implement xong rồi **thêm test layer** | **TDD** — test trước |
| Kiến trúc | Nhiều module **shallow** | Ít module **deep** |

Ba biểu hiện của cùng một xu hướng: **AI thích chia thành nhiều mảnh mỏng, phẳng.**

Vì sao? Có thể vì mảnh nhỏ dễ sinh ra hơn, dễ "trông có vẻ đúng" hơn, và mỗi mảnh nhỏ đều vừa smart zone. Nhưng tổng thể thì tệ.

**Cả ba đều cần con người chủ động chống lại**, và cả ba đều không tự khắc phục bằng cách viết prompt dài hơn.

### Đây là lý do PRD có mục "proposed modules"

Nối ngược về [[04 - PRD - Document điểm đến]]. Matt mở PRD ra chỉ:

> "Inside here — **data model, the modules.** So it's specifically saying: *okay, this **gamification service is a new deep module**, which we're going to test. It's going to have **this particular interface**.* And: *okay, we're **modifying the progress service**, we're **modifying the lesson route**, the **dashboard route**, etc.*
>
> So **I'm being really specific about the modules that I'm editing, and I'm making sure that I keep that module map in my mind at all times — throughout the planning, and then throughout the implementation.**"

**Dịch:** *"Trong này — **data model, các module.** Nó nói cụ thể: ok, cái **gamification service này là một deep module mới**, ta sẽ test nó. Nó sẽ có **interface cụ thể như thế này**. Và: ok, ta đang **sửa progress service**, ta đang **sửa lesson route**, **dashboard route**, vân vân.*
>
> *Nên **tôi rất cụ thể về những module mình sẽ sửa, và tôi đảm bảo giữ bản đồ module đó trong đầu mọi lúc — suốt quá trình planning, rồi suốt quá trình implementation.**"*

> 🔑 **Ý là:** Kiểm soát kiến trúc **không xảy ra lúc review code**. Nó xảy ra **lúc viết PRD**, bằng cách nêu đích danh module nào là deep module mới, interface ra sao.
>
> Lúc review code thì đã muộn — nếu agent đã đẻ ra 14 file shallow, bảo nó gộp lại là một cuộc refactor tốn kém. Nêu trước một dòng trong PRD thì miễn phí.

---

## 🔥 Gray box: giữ lại cảm nhận về codebase `[01:19-01:21]`

### Vấn đề — Matt hỏi phòng

> "Raise your hands if you feel like **you're working harder than ever before** with AI."
>
> "Raise your hands if you feel like **you know your code base less well than you used to.**"

**Dịch:** *"Giơ tay nếu bạn cảm thấy **mình đang làm việc vất vả hơn bao giờ hết** với AI."* / *"Giơ tay nếu bạn cảm thấy **mình hiểu codebase của mình kém hơn trước.**"*

Rất nhiều tay giơ lên. Ông ấy gọi tên vấn đề:

> "**This is a real thing.** Because we're moving fast, because we're delegating more things, **we end up losing a sense of our code base.** And **if we lose the sense of our code base, we're not going to be able to improve it — we're essentially delegating the shape of it to AI. I don't think that's good.**"

**Dịch:** *"**Đây là chuyện có thật.** Bởi vì ta đang đi nhanh, bởi vì ta đang giao đi nhiều thứ hơn, **cuối cùng ta mất đi cảm nhận về codebase của mình.** Và **nếu mất cảm nhận về codebase, ta sẽ không thể cải thiện nó — về cơ bản ta đang giao luôn cả hình dạng của nó cho AI. Tôi không nghĩ đó là điều tốt.**"*

> 🔑 **Cẩn thận với vòng xoáy này:**
>
> ```
> mất cảm nhận codebase
>        ↓
> không định hướng được kiến trúc
>        ↓
> AI tự quyết → codebase thành shallow
>        ↓
> AI code tệ hơn, mình đọc cũng khó hơn
>        ↓
> càng phải delegate nhiều hơn
>        ↓
>    (quay lại đầu)
> ```
>
> **Vòng lặp tự siết.** Và nó siết chậm nên khó nhận ra — mỗi tuần chỉ tệ đi một chút.

### Giải pháp

> "How do we make it so that we can **move fast while still keeping enough space in our brains?** I think that this is a way to do it.
>
> Because what you're doing here is: not only are you thinking about **creating big shapes in your code base, big services** — what I think you should do is **design the interface for these modules, but then delegate the implementation.**
>
> In other words, **these modules can become like gray boxes**, where **you just need to know the shape of them, you need to know what they do and how they behave — but you can delegate the implementation of those modules.**"

**Dịch:** *"Làm sao để ta có thể **đi nhanh mà vẫn giữ đủ chỗ trống trong đầu?** Tôi nghĩ đây là một cách.*
>
> *Bởi vì cái bạn đang làm ở đây là: không chỉ nghĩ về việc **tạo ra những hình khối lớn trong codebase, những service lớn** — cái tôi nghĩ bạn nên làm là **thiết kế interface cho các module này, rồi giao phần implementation đi.***
>
> *Nói cách khác, **những module này có thể trở thành các hộp xám**, nơi **bạn chỉ cần biết hình dạng của chúng, cần biết chúng làm gì và hành xử ra sao — nhưng bạn có thể giao phần implementation của chúng đi.**"*

> 💡 **Gray box** (hộp xám) — nằm giữa hai khái niệm quen thuộc:
> - **Black box** (hộp đen): chỉ biết đầu vào/đầu ra, hoàn toàn không biết bên trong
> - **White box** (hộp trắng): biết hết mọi chi tiết bên trong
> - **Gray box**: **biết interface và hành vi, không biết chi tiết implementation** — và chủ động chọn như vậy

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

**Dịch:** *"**Tôi không nhất thiết phải code review mọi thứ bên trong module đó. Tôi không nhất thiết phải biết hết nó đang làm gì. Tôi chỉ cần biết rằng nó hành xử theo một cách nhất định trong những điều kiện nhất định, và rằng nó làm đúng việc của nó.***
>
> *Nên nó kiểu như: **ok, tôi có một cái nhìn tổng quan lớn về codebase của mình, tôi hiểu các hình khối bên trong nó, hiểu tất cả các interface làm gì — nhưng tôi có thể giao đi phần bên trong.***
>
> *Tôi thấy đó là **một cách rất hay để giữ lại cảm nhận về codebase mà vẫn bảo toàn được sự tỉnh táo của mình.**"*

> 💡 "**preserving my sanity**" = giữ cho mình khỏi phát điên. Cách nói hài hước nhưng chỉ đúng vấn đề: không ai đọc nổi 100% code do agent sinh ra.

### Vì sao chỉ hoạt động với deep modules

Đây là chỗ hai ý ăn khớp với nhau:

- **Deep module** = interface nhỏ + ruột dày
- **Gray box** = mình giữ interface, giao ruột

→ Với **deep module**: phần mình phải giữ trong đầu là **interface nhỏ**, phần giao đi là **ruột dày**. Tỉ lệ rất có lợi.

→ Với **shallow module**: mọi thứ **đều là interface**. Không có "ruột" để mà giao. Giao đi = mất kiểm soát hoàn toàn. **Gray box không áp dụng được cho codebase shallow.**

> 🔑 **Ý là — đây là câu trả lời thực dụng cho câu hỏi "phải review bao nhiêu code AI viết?"**
>
> Không phải review hết (không khả thi), cũng không phải bỏ hết (thành slop). Mà là: **review ranh giới, giao phần ruột.**
>
> Nhưng nó **chỉ làm được nếu ranh giới được thiết kế tử tế trước.** Đây là lý do phần kiến trúc này không phải "nice to have" — nó là điều kiện tiên quyết để làm việc với agent ở quy mô lớn.
>
> Và nó cũng trả lời một phần cho vấn đề chưa có lời giải ở [[06 - AFK Agent - Ralph loop và TDD]] (review nhiều hơn khả năng review): **giảm lượng cần review bằng cách thiết kế ranh giới**, thay vì cố đọc nhanh hơn.

---

## Skill `improve-codebase-architecture` `[01:21-01:22]`, `[01:32-01:33]`

Trả lời câu hỏi đầu phase: làm sao biến codebase shallow thành deep?

> "We have a skill. And that skill is called **`improve-codebase-architecture`. Nice and direct.**"

**Dịch:** *"Chúng ta có một skill. Và skill đó tên là **`improve-codebase-architecture`. Ngắn gọn và thẳng thắn.**"*

### Nó làm gì

> "It's essentially just going to do a **scan of our code base**, looking for what's available here. It's **exploring the architecture**, exploring how to work within this code base, and it's going to attempt to **find places to deepen the modules.** Pretty simple."

**Dịch:** *"Về cơ bản nó sẽ **quét codebase của ta**, xem có gì ở đây. Nó **khảo sát kiến trúc**, khảo sát cách làm việc trong codebase này, và nó sẽ cố **tìm ra những chỗ có thể làm sâu các module lại.** Khá đơn giản."*

### Output thực tế trong demo `[01:32-01:33]`

Skill chạy khá lâu (Matt phải làm việc khác trong lúc chờ). Kết quả:

> "It's found a bunch of **architectural improvement candidates**. It's got essentially **a cluster of different modules that are all kind of related that could probably be tested as a unit.**
>
> Got **number one, the quiz scoring service.** There's some **reordering logic extraction** as well. **It has arguments for why they're coupled**, and it has a **dependency category** as well — so *local, substitutable, in SQLite with in-memory test DB.*
>
> **Quiz scoring service currently has zero tests. This is the biggest gap.**"

**Dịch:** *"Nó đã tìm ra một loạt **ứng viên cải tiến kiến trúc**. Về cơ bản nó có **một cụm các module khác nhau đều có liên quan với nhau, có thể test chung như một đơn vị.***
>
> *Có **số một, quiz scoring service.** Cũng có phần **tách logic sắp xếp lại**. **Nó có lập luận vì sao chúng bị coupled**, và nó cũng có một **phân loại phụ thuộc** — kiểu local, thay thế được, chạy trong SQLite với test DB nằm trong bộ nhớ.*
>
> ***Quiz scoring service hiện tại có 0 test. Đây là khoảng trống lớn nhất.**"*

Cấu trúc output đáng chú ý — mỗi candidate gồm:

| Trường | Nội dung |
|---|---|
| Cluster | Các module liên quan nên gộp thành 1 unit test được |
| **Lý do** | **Argument** vì sao chúng coupled — không chỉ nêu, mà **biện luận** |
| Dependency category | vd `local, substitutable, in-memory test DB` — tức là **test được không cần mock** |
| Gap | Chỗ thiếu test nghiêm trọng nhất |

> 💡 Trường **dependency category** là chỗ tinh tế. Nó trả lời câu hỏi: *"module này có test được không, hay nó bám vào thứ gì đó bên ngoài?"* Nếu phụ thuộc là `local, substitutable` (thay được bằng SQLite in-memory) thì bọc test boundary rất rẻ. Nếu nó gọi API bên thứ ba thì đắt hơn nhiều.

---

## ⭐ Case study: video editor trong browser `[01:22-01:23]`

Ví dụ ấn tượng nhất của cả workshop.

### Bối cảnh

> "Part of my **course video manager** app is **a video editor. A video editor built in the browser, which is really hardcore.** It's a decent bit of engineering."

**Dịch:** *"Một phần trong app **course video manager** của tôi là **một trình sửa video. Một video editor xây trong trình duyệt, thứ này thực sự khoai.** Nó là một mảng kỹ thuật ra trò."*

### Vấn đề

Front end và back end tách rời → không test được luồng xuyên suốt → AI làm việc trên đó rất tệ.

### Giải pháp

> "I wanted a way that I could **wrap the entire front end all the way to the back end in like a single big module**, so that I could **test the fact that I press something on the front end and it goes all the way to the back end.**
>
> And so I found a way essentially by using **a kind of discriminated union between the two types** — I was able to use this skill to essentially have **a huge great big module that was testable from the outside**, this video editor infrastructure."

**Dịch:** *"Tôi muốn có cách để **bọc toàn bộ front end kéo dài tới tận back end thành một module lớn duy nhất**, để tôi có thể **kiểm thử được cái sự thật là tôi bấm một nút trên front end và nó chạy suốt tới back end.***
>
> *Và tôi tìm ra cách, về cơ bản bằng cách dùng **một dạng discriminated union giữa hai kiểu dữ liệu** — tôi đã dùng được skill này để có **một module cực lớn có thể test được từ bên ngoài**, chính là cái hạ tầng video editor này."*

> 💡 **Discriminated union** (union có phân biệt) là một kỹ thuật type trong TypeScript: một kiểu dữ liệu có thể là một trong nhiều dạng, và có một trường "nhãn" để phân biệt đang là dạng nào. Ví dụ:
>
> ```typescript
> type Event =
>   | { type: 'trim';  start: number; end: number }
>   | { type: 'split'; at: number }
>   | { type: 'merge'; ids: string[] }
> ```
>
> Ở đây ông ấy dùng nó để biến ranh giới FE↔BE thành **một kiểu dữ liệu duy nhất, kiểm được ở compile time**. Nhờ vậy cả hai đầu nói cùng một "ngôn ngữ" và test được từ bên ngoài. Chi tiết implementation không được nói kỹ trong buổi.

### Kết quả

> "And it meant that **AI could see the entire flow, could act on the entire flow, and test on the entire flow.** And honestly, **it was just night and day** in terms of the ability of AI to actually make changes — cuz **AI working on a video editor is pretty brutal if you don't give it good tests.**"

**Dịch:** *"Và điều đó có nghĩa là **AI nhìn thấy được toàn bộ luồng, tác động được lên toàn bộ luồng, và test được trên toàn bộ luồng.** Và thành thật mà nói, **khác nhau một trời một vực** về khả năng AI thực sự thay đổi được gì — bởi vì **để AI làm việc trên một video editor mà không cho nó test tốt thì khá là tàn khốc.**"*

> 💡 "**night and day**" = khác nhau như đêm với ngày, tức **khác biệt hoàn toàn**.

> 🔑 **Ý là — đây là vertical slice ở tầng kiến trúc.**
>
> - **Vertical slice** ([[05 - Vertical Slices - Cắt issue thành tracer bullets]]) = cắt *công việc* xuyên qua layer
> - **Cái này** = cắt *module* xuyên qua layer
>
> Cùng một tư duy, áp ở hai chỗ khác nhau. Đây là lần thứ tư nguyên lý "dọc thay vì ngang" xuất hiện trong workshop.
>
> Bộ ba **"see the flow / act on the flow / test on the flow"** là tiêu chuẩn đáng dùng để đánh giá bất kỳ module nào: **nếu AI không thấy được cả luồng thì nó không sửa được cả luồng.**

### Lời khuyên chốt

> "If you take **one thing** away from today, **just try running this skill on your repo and see what happens.**"

**Dịch:** *"Nếu bạn chỉ mang về **một thứ** từ hôm nay, **hãy thử chạy cái skill này trên repo của bạn và xem chuyện gì xảy ra.**"*

---

## Ý cần nhớ

- Chuỗi nhân quả: **kiến trúc → khả năng test → feedback loop → chất lượng AI.** Muốn AI tốt hơn thì sửa đầu chuỗi, không sửa prompt.
- **Deep module** = interface nhỏ + ruột dày. **Shallow** = nhiều mảnh mỏng, graph rối. Không phải chuyện độ dài file, mà là **tỉ lệ chức năng / độ rộng interface**.
- Shallow gây 3 vấn đề: AI **đốt context** để lần graph, không biết vẽ test boundary, và **bug thứ tự gọi hàm lọt hoàn toàn**.
- **AI mặc định sinh shallow.** Đây là lần thứ ba của cùng một xu hướng (cắt ngang / test sau / module mỏng).
- Kiểm soát kiến trúc xảy ra **lúc viết PRD** (mục proposed modules), không phải lúc review code.
- **Gray box**: thiết kế interface, giao implementation. Cách duy nhất để đi nhanh mà không mất cảm nhận codebase — **và chỉ áp dụng được với deep module**.
- Case study video editor: bọc cả FE↔BE thành **một module test được từ ngoài** → *"night and day"*.
- Tiêu chuẩn đánh giá module: **AI có see / act / test trên toàn bộ luồng được không?**
- Chạy `improve-codebase-architecture` là hành động cụ thể nhất rút ra từ workshop.

---

## Sách

**John Ousterhout — *A Philosophy of Software Design***. Đây là nguồn của deep/shallow modules và là cuốn được nhắc kỹ nhất trong buổi.

---

[[07 - QA và Code Review - Nơi con người áp taste|← Trước]] · [[00 - README|Mục lục]] · [[09 - Parallelization - Sandcastle và Push vs Pull|Tiếp: Parallelization →]]
