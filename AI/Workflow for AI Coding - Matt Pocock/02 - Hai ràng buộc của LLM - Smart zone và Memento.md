---
tags:
  - ai
  - ai-coding
  - context-window
timestamp: 04:20 - 12:45
chapter: "Phase 1: Research & Prototyping"
---

# 02 — Hai ràng buộc của LLM: Smart zone & Memento

`[04:20 – 12:45]` · [[01 - Thesis - Software engineering fundamentals vẫn đúng|← Trước]] · [[00 - README|Mục lục]] · [[03 - Grill Me - Đạt shared understanding|Tiếp →]]

> ⚠️ Chapter YouTube tên là "Phase 1: Research & Prototyping" nhưng nội dung thực tế là **lý thuyết nền về context window**. Phần research/prototype được nhắc lướt qua ở cuối buổi.

Đây là phần lý thuyết duy nhất của cả workshop. Hiểu 2 ràng buộc này thì mọi quyết định thiết kế ở các phase sau đều tự suy ra được.

---

## Ràng buộc 1 — Smart zone / Dumb zone `[00:03 – 00:05]`

### Nguồn gốc

Ý tưởng của **Dex Hardy**, người sáng lập công ty **Human Layer**. Matt trích lại chứ không nhận là của mình.

### Nội dung

> "When you're working with LLMs, they have a **smart zone** and a **dumb zone**. When you're first kind of working with an LLM, and you've just started a new conversation, **you start from nothing — that's when the LLM is going to do its best work.** Because in that situation, **the attention relationships are the least strained.**"

**Dịch:** *"Khi làm việc với LLM, chúng có một **vùng thông minh** và một **vùng ngu**. Lúc bạn mới bắt đầu làm việc với LLM, khi vừa mở một cuộc hội thoại mới, **bạn xuất phát từ con số không — đó là lúc LLM làm việc tốt nhất.** Bởi vì trong tình huống đó, **các quan hệ attention bị căng ít nhất.**"*

> 💡 **Ý là:** "**strained**" = bị căng, bị kéo giãn. Hình dung attention như sự chú ý của một người: chú ý vào 3 thứ thì sắc nét; chú ý vào 300 thứ thì mỗi thứ được một chút. Không phải model "quên", mà là **sự chú ý bị pha loãng**.

### Analogy: giải bóng đá

Đây là cách Matt giải thích tại sao context đầy làm model ngu đi:

> "Every time you add a token to an LLM, it's kind of like **you're adding a team to a football league**. You think of the number of matches that get added every time you add a team to a football league — it just scales **quadratically**."

**Dịch:** *"Mỗi lần bạn thêm một token vào LLM, nó giống như **bạn thêm một đội vào một giải bóng đá**. Cứ nghĩ xem mỗi lần thêm một đội thì phát sinh thêm bao nhiêu trận đấu — nó tăng theo **bậc hai**."*

Cụ thể hơn: mỗi token phải "để ý" tới mọi token khác, vừa theo **vị trí** vừa theo **ý nghĩa**. Thêm 1 token không phải thêm 1 quan hệ, mà thêm N quan hệ.

> 🧠 **Cách nhớ:** giải 10 đội có 45 cặp đấu. Thêm 1 đội thành 11 → 55 cặp. **Thêm 1 đội mà phát sinh 10 trận.** Càng đông càng loạn, không tuyến tính.
>
> **Quadratically** = theo bậc hai (n²). Input tăng 10 lần → chi phí tăng 100 lần. Hệ quả: **token thứ 90.000 đắt hơn nhiều so với token thứ 900** — không phải vì nó đặc biệt, mà vì nó phải chen vào giữa 90.000 token đã có.

### Con số thực tế: ~100K token

Đây là phần đáng ghi nhất:

> "By around 40%, or around — I would say around **100K is kind of my new marker** for this. Cuz **it doesn't matter whether you're using 1 million context window or 200K, it's always going to be about this.** It starts to just get dumber. As you continually keep adding stuff to the same context window, it just gets dumber and dumber **until it's making stupid decisions.**"

**Dịch:** *"Vào khoảng 40%, hay khoảng — tôi sẽ nói khoảng **100K là mốc mới của tôi** cho chuyện này. Bởi vì **không quan trọng bạn dùng context window 1 triệu hay 200K, nó luôn rơi vào quãng này.** Nó bắt đầu ngu đi. Khi bạn cứ liên tục nhồi thêm thứ vào cùng một context window, nó cứ ngu dần ngu dần **cho tới lúc đưa ra những quyết định ngớ ngẩn.**"*

Hai điều rút ra:

1. Mốc ~100K là **tuyệt đối**, không phải tỉ lệ phần trăm của context window.
2. → **Mua context window to hơn không mua được thông minh hơn.**

### Về 1M context window `[00:37-00:38]`

Có người hỏi thẳng câu này trong Q&A: *"Now that we have 1 million tokens available, do we ever actually want to take advantage of that? I've noticed the dumb zone has become less dumb lately."*

**Dịch câu hỏi:** *"Giờ đã có 1 triệu token, liệu ta có bao giờ thực sự muốn tận dụng nó không? Tôi thấy dạo này vùng ngu đã bớt ngu hơn."*

Trả lời của Matt (kèm câu chuyện: ông ấy quay xong khoá Claude Code với context 200K thì **đúng hôm launch** họ công bố 1M):

> "What Claude Code did is they essentially just did this — **Wee! They shipped a lot more dumb zone to you.**"

**Dịch:** *"Cái Claude Code làm về cơ bản là thế này — **Yeah! Họ ship cho bạn thêm rất nhiều vùng ngu.**"*

> 💡 **Ý là:** Câu đùa nhưng có ý thật. Nới context window từ 200K lên 1M **không dịch chuyển được mốc 100K**. Phần thêm vào toàn bộ nằm trong dumb zone. Bạn được thêm chỗ chứa, không được thêm chất lượng.

Nhưng ông ấy có phân biệt rạch ròi:

| Việc | 1M context |
|---|---|
| **Retrieval** — nhét 5 bản *War and Peace* vào rồi tìm thông tin | ✅ Tốt |
| **Coding** | ❌ Kém hơn |

> "I consider that it is **about 100K at the moment is the smart zone**. The smart zone will get bigger and that will be a really nice improvement."

**Dịch:** *"Tôi cho rằng **hiện tại smart zone vào khoảng 100K**. Smart zone rồi sẽ lớn dần lên và đó sẽ là một cải tiến rất tốt."*

→ Ông ấy không nói 1M vô dụng, mà nói **smart zone chưa nở ra theo**.

> 💡 **Vì sao retrieval khác coding:** Retrieval chỉ cần **tìm ra một chỗ** trong đống dữ liệu — model chỉ phải chú ý sắc nét vào một điểm. Coding cần **giữ đồng thời nhiều thứ trong đầu**: kiến trúc, quy ước, các file liên quan, yêu cầu, những gì vừa sửa. Đó là lúc sự chú ý bị pha loãng gây hại.

### Hệ quả thiết kế

> "This means that we kind of want to **size our tasks in a way that sticks within the smart zone.** We don't want the AI to bite off more than it can chew."

**Dịch:** *"Điều này nghĩa là ta muốn **định cỡ task sao cho nó nằm gọn trong smart zone.** Ta không muốn AI ôm nhiều hơn khả năng nhai của nó."*

> 💡 "**bite off more than you can chew**" là thành ngữ: cắn miếng to hơn mức nhai nổi = ôm đồm quá sức.

Và đây là chỗ ông ấy kéo về sách cũ:

> "This goes back to old advice like **Martin Fowler in refactoring**, the **pragmatic programmer** talks about this. Don't bite off more than you can chew. **Keep your tasks small so that you as a human developer don't freak out and don't start acting and going into the dumb zone.**"

**Dịch:** *"Chuyện này quay về những lời khuyên cũ như của **Martin Fowler trong Refactoring**, **The Pragmatic Programmer** cũng nói về điều này. Đừng ôm nhiều hơn sức nhai. **Giữ task nhỏ để chính bạn — một developer là người — không hoảng loạn và không bắt đầu hành xử theo kiểu đi vào vùng ngu.**"*

> 💡 **Ý là:** Con người cũng có dumb zone. Task quá to thì dev người cũng làm ẩu, cũng quên mất mình đang làm gì. **Cùng một liều thuốc cho cả hai.** Đây chính là thesis ở [[01 - Thesis - Software engineering fundamentals vẫn đúng]] được minh hoạ lần đầu.

---

## Từ multi-phase plan → phase N → Ralph `[00:05 – 00:07]`

### Cách tiếp cận ngây thơ (cái mà AI company muốn bạn làm)

> "Just keep going and going and going, you end up in the dumb zone, **charging you tons of tokens per request**. You then compact back down. And you keep going, keep going, compact back down..."

**Dịch:** *"Cứ thế đi tiếp, đi tiếp, đi tiếp, rồi bạn rơi vào vùng ngu, **họ tính tiền bạn cả đống token cho mỗi request**. Rồi bạn compact nén xuống. Rồi lại đi tiếp, đi tiếp, lại compact xuống..."*

> 💡 **Ý là:** Có một mũi châm chọc ở đây — context càng đầy thì **mỗi request càng đắt**, nên nhà cung cấp không có động lực khuyến khích bạn `/clear`.

Matt: *"I think that doesn't really work very well because the more **sediment**..."* — ông ấy dùng từ **sediment** (cặn lắng) để mô tả rác tích tụ qua các lần compact.

> 💡 **Sediment** = cặn, phù sa lắng đọng. Hình dung: mỗi lần compact để lại một lớp cặn ở đáy. Nén 5 lần thì cái bạn đang làm việc cùng là "bản tóm tắt của bản tóm tắt của bản tóm tắt..." — méo dần và không ai kiểm soát được méo ở đâu.

### Multi-phase plan

> "This is what I was doing for a while... I would use these multi-phase plans. Okay, we have this large task. Let's break it down into small sections so that we can do each little bit of work in the smart zone."

**Dịch:** *"Đây là cái tôi làm một thời gian... Tôi dùng mấy cái multi-phase plan này. Ok, ta có một task lớn. Chia nó thành các phần nhỏ để mỗi mẩu việc đều làm được trong smart zone."*

Matt hỏi phòng ai từng dùng multi-phase plan — gần như cả phòng giơ tay. *"Certainly this is how I was doing it up until December last year."* (*"Chắc chắn đây là cách tôi làm cho tới tận tháng 12 năm ngoái."*)

### Nhận ra nó là một cái loop

> "**Any developer worth their salt will look at this and go: this is a loop.** We've just got phase one, phase two, phase three, phase four. **Why don't we just have phase N?**"

**Dịch:** *"**Bất kỳ developer nào ra hồn nhìn vào cái này cũng sẽ nói: đây là một cái loop.** Ta chỉ có phase một, phase hai, phase ba, phase bốn. **Sao không để luôn là phase N?**"*

> 💡 "**worth their salt**" là thành ngữ: xứng đáng với đồng lương, có nghề. Nguồn gốc từ thời La Mã trả lương lính bằng muối.
>
> **Ý là:** Nếu 4 phase chỉ khác nhau ở nội dung mà giống nhau ở cấu trúc, thì viết tay 4 phase là **unroll một vòng lặp bằng tay**. Dev nào cũng biết đó là code smell.

→ Thay vì viết sẵn 4 phase, chỉ cần: có một plan chạy nền, rồi **loop** lên trên nó cho tới khi xong.

### Ralph Wiggum

> "Raise your hand if you've heard of **Ralph Wiggum as a software practice**."

(Phần lớn phòng **chưa** nghe.) Định nghĩa của Matt:

> "All you need to do is **specify the end of the journey** — you create a PRD, a product requirements document, to say: okay, let's describe where we're going. And then we just say to the AI: **just make a small change. Make a small change that gets us closer and closer to that.**"

**Dịch:** *"Tất cả những gì bạn cần làm là **chỉ định điểm cuối của hành trình** — bạn tạo một PRD, product requirements document, để nói: ok, hãy mô tả xem ta đang đi tới đâu. Rồi ta chỉ nói với AI: **cứ thực hiện một thay đổi nhỏ. Thực hiện một thay đổi nhỏ đưa ta tới gần cái đích đó hơn.**"*

Đánh giá:

> "**Ralph works okay, but I prefer a little bit more structure.**"

**Dịch:** *"**Ralph chạy cũng ổn, nhưng tôi thích có thêm chút cấu trúc.**"*

Cái "more structure" đó chính là toàn bộ phần còn lại của workshop: PRD + Kanban board thay cho việc phó mặc AI tự chọn bước tiếp theo. Nhưng loop chạy AFK ở [[06 - AFK Agent - Ralph loop và TDD]] vẫn được ông ấy gọi thẳng là "Ralph loop".

> 💡 **Ralph Wiggum** là nhân vật trong *The Simpsons* — cậu bé ngây ngô, đơn giản tới mức buồn cười. Đặt tên kỹ thuật này theo cậu ta vì nó **ngu một cách cố ý**: không cần agent thông minh lập kế hoạch, chỉ cần lặp đi lặp lại "làm một việc nhỏ" mãi cho tới khi xong.

---

## Ràng buộc 2 — LLM là anh chàng trong phim Memento `[00:07 – 00:11]`

> "LLMs are kind of like **the guy from Memento** — they just continually forget. They just keep resetting back to the base state."

**Dịch:** *"LLM giống như **anh chàng trong phim Memento** — chúng cứ liên tục quên. Chúng cứ reset về trạng thái gốc."*

> 💡 ***Memento*** (2000, Christopher Nolan): nhân vật chính mất trí nhớ ngắn hạn, cứ vài phút lại quên sạch, phải xăm thông tin quan trọng lên người và chụp ảnh Polaroid ghi chú.
>
> Điểm hay của ẩn dụ: anh ta **không hề ngu** — anh ta vẫn thông minh, vẫn suy luận tốt. Chỉ là **mỗi lần bắt đầu lại từ đúng một trạng thái đã biết**. Và điều đó khiến anh ta **dễ đoán**. Matt coi đây là **ưu điểm**, không phải nhược điểm.

Matt vẽ trên TL Draw thay vì dùng slide — *"I really should use slides, but I just prefer randomly scrolling around an infinite TL draw canvas."*

### Bốn giai đoạn của mọi session

| Giai đoạn | Màu trên diagram | Ghi chú |
|---|---|---|
| **System prompt** | xám | Luôn nằm trong context, **không bao giờ mất** |
| **Explore** | xanh | Agent đi đọc codebase |
| **Implement** | | Viết code |
| **Test** | | Chạy feedback loop |

### ⚠️ System prompt phải cực nhỏ

> "This gray box is essentially the stuff that's **always** in your context. You want this to be **as small as possible**. Cuz if you have a ton of stuff in here — **if you have 250K tokens, like I have seen people put in there** — then you're just going to go **straight into the dumb zone without even being able to do anything.**"

**Dịch:** *"Cái hộp xám này về cơ bản là những thứ **luôn luôn** nằm trong context của bạn. Bạn muốn nó **càng nhỏ càng tốt**. Bởi vì nếu bạn nhét cả đống thứ vào đây — **nếu bạn có 250K token, như tôi từng thấy người ta nhét vào** — thì bạn sẽ **đi thẳng vào vùng ngu mà còn chưa kịp làm gì cả.**"*

> 💡 **Ý là:** Nhớ mốc smart zone ~100K. Nếu system prompt đã ngốn 250K thì bạn **bắt đầu** ở điểm đã vượt xa mốc đó. Agent chưa đọc một dòng code nào đã ở trạng thái tệ nhất.

Liên hệ: sau này ông ấy nói **hầu như không dùng `CLAUDE.md`** (`[00:48]`), và ưu tiên **pull** (skills) hơn **push** (`CLAUDE.md`) — xem [[09 - Parallelization - Sandcastle và Push vs Pull]]. Đây chính là lý do.

### Clear vs Compact

Khi `/clear`: **về thẳng system prompt**. Xoá sạch mọi thứ phía sau.

Khi `/compact`: nén toàn bộ hội thoại thành **một bản tóm tắt / lịch sử viết lại**.

Quan điểm của Matt — đi ngược số đông:

> "**Devs love compacting for some reason, but I hate it.** I much prefer my AI to behave like the guy from Memento, because **this state is always the same. Always the same every time you do it.** You clear and you go back to the beginning. And if you're able to do that and optimize for that, then you're in a great spot."

**Dịch:** *"**Chả hiểu sao dev rất thích compact, còn tôi thì ghét nó.** Tôi thích AI của mình hành xử như anh chàng trong Memento hơn, bởi vì **trạng thái này luôn giống nhau. Luôn giống nhau mỗi lần bạn làm.** Bạn clear và quay về điểm bắt đầu. Và nếu bạn làm được như vậy và tối ưu theo hướng đó, thì bạn đang ở một vị trí rất tốt."*

> 🔑 **Ý là — lý do sâu hơn: tính lặp lại (reproducibility).**
>
> Sau `/clear` bạn **biết chính xác** agent đang ở trạng thái nào. Sau `/compact` bạn **không biết** — nó tuỳ thuộc model tóm tắt được gì, bỏ gì, hiểu sai gì.
>
> Hệ quả thực tế: khi agent làm sai sau khi compact, bạn không thể biết là **prompt tệ** hay **bản tóm tắt đã đánh rơi thông tin**. Không debug được, không tune prompt được. Còn với `/clear`, mỗi lần chạy là một thí nghiệm có điều kiện giống nhau.
>
> Đây là lý do ở [[06 - AFK Agent - Ralph loop và TDD]] ông ấy nhấn mạnh phải chạy `once.sh` **nhiều lần** để tune prompt — chỉ làm được điều đó nếu điểm xuất phát luôn như nhau.

---

## Tip nhỏ nhưng ông ấy nhấn mạnh: status line đếm token `[00:09-00:10]`

> "There's this tiny little status line here that tells me **how many tokens I'm using, the exact number of tokens I'm using.** I have an article on my website **AI Hero** if you want to copy this. This is — **essential information on every coding session**, cuz you need to know exactly how many tokens you're using so that you know **how close you are to the [dumb zone]**. Absolutely essential."

**Dịch:** *"Có cái status line bé tí ở đây cho tôi biết **tôi đang dùng bao nhiêu token, con số chính xác.** Tôi có một bài trên website **AI Hero** nếu bạn muốn copy cái này. Đây là — **thông tin thiết yếu trong mọi session code**, vì bạn cần biết chính xác mình đang dùng bao nhiêu token để biết **mình đã gần vùng ngu tới đâu**. Tuyệt đối thiết yếu."*

> 💡 **Ý là:** Không có con số này thì mọi lý thuyết smart zone ở trên **không hành động được**. Bạn không biết đang ở 30K hay 130K, nên không biết khi nào nên `/clear`.
>
> Nếu chỉ làm được **một** thay đổi sau khi xem video này, ông ấy gợi ý làm cái này — vì nó rẻ nhất và mở khoá cho mọi thứ còn lại.

---

## Ghi chú về tool `[00:09]`

> "I'm using **Claude Code** for this session, but **you don't need to use Claude Code. In fact, it's often nice not to use Claude Code.**"

**Dịch:** *"Tôi dùng **Claude Code** cho buổi này, nhưng **bạn không cần phải dùng Claude Code. Thực tế, không dùng Claude Code nhiều khi lại hay.**"*

Ông ấy nhắc lại nhiều lần trong buổi rằng method này không phụ thuộc tool. Quan điểm đầy đủ về Claude Code ở [[10 - Tổng kết và Q&A]].

---

## Setup bài tập `[00:11 – 00:12]`

Repo demo: **Cadence** — một course management platform / CMS cho instructor và student, lấy từ khoá học của Matt. Có sẵn nhiều service (quiz, team, user, coupon, core) để mô phỏng codebase thật.

Cách chạy workshop: ông ấy làm trên màn hình, khán giả clone repo làm theo. *"You absolutely do not have to, you can just watch me do it if you fancy it."* (*"Bạn hoàn toàn không bắt buộc, cứ ngồi xem tôi làm cũng được nếu thích."*)

Input duy nhất: file **`client-brief.md`** ở root repo — một tin nhắn Slack từ "Sarah Chen":

> Trong Cadence, retention numbers không tốt. Students đăng ký, học vài lesson rồi bỏ. *"I'd love to add some gamification to the platform."* (*"Tôi rất muốn thêm gamification vào platform."*)

Chi tiết vui: *"For some reason Claude always chooses **Sarah Chen** as the name. I don't know why."* (*"Chả hiểu sao Claude lúc nào cũng chọn cái tên Sarah Chen. Tôi không biết vì sao."*)

---

## Ý cần nhớ

- **~100K token** là mốc thực tế của smart zone, bất kể context window bao nhiêu.
- Context window to hơn = **nhiều dumb zone hơn**, không phải thông minh hơn. Tốt cho retrieval, không tốt cho coding.
- **System prompt càng nhỏ càng tốt.** 250K token trong system prompt = chết ngay từ đầu.
- **`/clear` > `/compact`** vì **tính lặp lại**. Đừng để cặn (sediment) tích tụ.
- Gắn **status line đếm token** — không có nó thì không quản lý được smart zone.
- Multi-phase plan chỉ là một cái loop viết tay. Nhận ra điều đó rồi thì mới nghĩ tới AFK loop.

---

[[01 - Thesis - Software engineering fundamentals vẫn đúng|← Trước]] · [[00 - README|Mục lục]] · [[03 - Grill Me - Đạt shared understanding|Tiếp: Grill Me →]]
