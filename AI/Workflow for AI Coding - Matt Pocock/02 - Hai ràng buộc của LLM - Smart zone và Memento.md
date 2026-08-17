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

### Analogy: giải bóng đá

Đây là cách Matt giải thích tại sao context đầy làm model ngu đi:

> "Every time you add a token to an LLM, it's kind of like **you're adding a team to a football league**. You think of the number of matches that get added every time you add a team to a football league — it just scales **quadratically**."

Cụ thể hơn: mỗi token phải "để ý" tới mọi token khác, vừa theo **vị trí** vừa theo **ý nghĩa**. Thêm 1 token không phải thêm 1 quan hệ, mà thêm N quan hệ.

> 🧠 Cách nhớ: giải 10 đội có 45 cặp đấu. Thêm 1 đội thành 11 → 55 cặp. Thêm 1 đội mà phát sinh 10 trận. Càng đông càng loạn, không tuyến tính.

### Con số thực tế: ~100K token

Đây là phần đáng ghi nhất:

> "By around 40%, or around — I would say around **100K is kind of my new marker** for this. Cuz **it doesn't matter whether you're using 1 million context window or 200K, it's always going to be about this.** It starts to just get dumber. As you continually keep adding stuff to the same context window, it just gets dumber and dumber **until it's making stupid decisions.**"

Hai điều rút ra:

1. Mốc ~100K là **tuyệt đối**, không phải tỉ lệ phần trăm của context window.
2. → **Mua context window to hơn không mua được thông minh hơn.**

### Về 1M context window `[00:37-00:38]`

Có người hỏi thẳng câu này trong Q&A: *"Now that we have 1 million tokens available, do we ever actually want to take advantage of that? I've noticed the dumb zone has become less dumb lately."*

Trả lời của Matt (kèm câu chuyện: ông ấy quay xong khoá Claude Code với context 200K thì **đúng hôm launch** họ công bố 1M):

> "What Claude Code did is they essentially just did this — **Wee! They shipped a lot more dumb zone to you.**"

Nhưng ông ấy có phân biệt rạch ròi:

| Việc | 1M context |
|---|---|
| **Retrieval** — nhét 5 bản *War and Peace* vào rồi tìm thông tin | ✅ Tốt |
| **Coding** | ❌ Kém hơn |

> "I consider that it is **about 100K at the moment is the smart zone**. The smart zone will get bigger and that will be a really nice improvement."

→ Ông ấy không nói 1M vô dụng, mà nói **smart zone chưa nở ra theo**.

### Hệ quả thiết kế

> "This means that we kind of want to **size our tasks in a way that sticks within the smart zone.** We don't want the AI to bite off more than it can chew."

Và đây là chỗ ông ấy kéo về sách cũ:

> "This goes back to old advice like **Martin Fowler in refactoring**, the **pragmatic programmer** talks about this. Don't bite off more than you can chew. **Keep your tasks small so that you as a human developer don't freak out and don't start acting and going into the dumb zone.**"

Con người cũng có dumb zone. Task quá to thì dev người cũng làm ẩu. Cùng một liều thuốc.

---

## Từ multi-phase plan → phase N → Ralph `[00:05 – 00:07]`

### Cách tiếp cận ngây thơ (cái mà AI company muốn bạn làm)

> "Just keep going and going and going, you end up in the dumb zone, **charging you tons of tokens per request**. You then compact back down. And you keep going, keep going, compact back down..."

Matt: *"I think that doesn't really work very well because the more **sediment**..."* — ông ấy dùng từ **sediment** (cặn lắng) để mô tả rác tích tụ qua các lần compact.

### Multi-phase plan

> "This is what I was doing for a while... I would use these multi-phase plans. Okay, we have this large task. Let's break it down into small sections so that we can do each little bit of work in the smart zone."

Matt hỏi phòng ai từng dùng multi-phase plan — gần như cả phòng giơ tay. *"Certainly this is how I was doing it up until December last year."*

### Nhận ra nó là một cái loop

> "**Any developer worth their salt will look at this and go: this is a loop.** We've just got phase one, phase two, phase three, phase four. **Why don't we just have phase N?**"

→ Thay vì viết sẵn 4 phase, chỉ cần: có một plan chạy nền, rồi **loop** lên trên nó cho tới khi xong.

### Ralph Wiggum

> "Raise your hand if you've heard of **Ralph Wiggum as a software practice**."

(Phần lớn phòng **chưa** nghe.) Định nghĩa của Matt:

> "All you need to do is **specify the end of the journey** — you create a PRD, a product requirements document, to say: okay, let's describe where we're going. And then we just say to the AI: **just make a small change. Make a small change that gets us closer and closer to that.**"

Đánh giá:

> "**Ralph works okay, but I prefer a little bit more structure.**"

Cái "more structure" đó chính là toàn bộ phần còn lại của workshop: PRD + Kanban board thay cho việc phó mặc AI tự chọn bước tiếp theo. Nhưng loop chạy AFK ở [[06 - AFK Agent - Ralph loop và TDD]] vẫn được ông ấy gọi thẳng là "Ralph loop".

---

## Ràng buộc 2 — LLM là anh chàng trong phim Memento `[00:07 – 00:11]`

> "LLMs are kind of like **the guy from Memento** — they just continually forget. They just keep resetting back to the base state."

*(Memento: nhân vật chính mất trí nhớ ngắn hạn, cứ vài phút lại quên sạch, phải xăm thông tin lên người.)*

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

Liên hệ: sau này ông ấy nói **hầu như không dùng `CLAUDE.md`** (`[00:48]`), và ưu tiên **pull** (skills) hơn **push** (`CLAUDE.md`) — xem [[09 - Parallelization - Sandcastle và Push vs Pull]]. Đây chính là lý do.

### Clear vs Compact

Khi `/clear`: **về thẳng system prompt**. Xoá sạch mọi thứ phía sau.

Khi `/compact`: nén toàn bộ hội thoại thành **một bản tóm tắt / lịch sử viết lại**.

Quan điểm của Matt — đi ngược số đông:

> "**Devs love compacting for some reason, but I hate it.** I much prefer my AI to behave like the guy from Memento, because **this state is always the same. Always the same every time you do it.** You clear and you go back to the beginning. And if you're able to do that and optimize for that, then you're in a great spot."

> 🔑 Lý do sâu hơn: **tính lặp lại**. Sau `/clear` bạn biết chính xác agent đang ở trạng thái nào. Sau `/compact` bạn không biết — nó tuỳ thuộc model tóm tắt được gì, bỏ gì. Không debug được, không tune prompt được.

---

## Tip nhỏ nhưng ông ấy nhấn mạnh: status line đếm token `[00:09-00:10]`

> "There's this tiny little status line here that tells me **how many tokens I'm using, the exact number of tokens I'm using.** I have an article on my website **AI Hero** if you want to copy this. This is — **essential information on every coding session**, cuz you need to know exactly how many tokens you're using so that you know **how close you are to the [dumb zone]**. Absolutely essential."

Nếu chỉ làm được **một** thay đổi sau khi xem video này, ông ấy gợi ý làm cái này — vì không có nó thì mọi lý thuyết smart zone ở trên đều không hành động được.

---

## Ghi chú về tool `[00:09]`

> "I'm using **Claude Code** for this session, but **you don't need to use Claude Code. In fact, it's often nice not to use Claude Code.**"

Ông ấy nhắc lại nhiều lần trong buổi rằng method này không phụ thuộc tool. Quan điểm đầy đủ về Claude Code ở [[10 - Tổng kết và Q&A]].

---

## Setup bài tập `[00:11 – 00:12]`

Repo demo: **Cadence** — một course management platform / CMS cho instructor và student, lấy từ khoá học của Matt. Có sẵn nhiều service (quiz, team, user, coupon, core) để mô phỏng codebase thật.

Cách chạy workshop: ông ấy làm trên màn hình, khán giả clone repo làm theo. *"You absolutely do not have to, you can just watch me do it if you fancy it."*

Input duy nhất: file **`client-brief.md`** ở root repo — một tin nhắn Slack từ "Sarah Chen":

> Trong Cadence, retention numbers không tốt. Students đăng ký, học vài lesson rồi bỏ. *"I'd love to add some gamification to the platform."*

Chi tiết vui: *"For some reason Claude always chooses **Sarah Chen** as the name. I don't know why."*

---

## Ý cần nhớ

- **~100K token** là mốc thực tế của smart zone, bất kể context window bao nhiêu.
- Context window to hơn = **nhiều dumb zone hơn**, không phải thông minh hơn. Tốt cho retrieval, không tốt cho coding.
- **System prompt càng nhỏ càng tốt.** 250K token trong system prompt = chết ngay từ đầu.
- **`/clear` > `/compact`** vì tính lặp lại. Đừng để cặn tích tụ.
- Gắn **status line đếm token** — không có nó thì không quản lý được smart zone.
- Multi-phase plan chỉ là một cái loop viết tay. Nhận ra điều đó rồi thì mới nghĩ tới AFK loop.

---

[[01 - Thesis - Software engineering fundamentals vẫn đúng|← Trước]] · [[00 - README|Mục lục]] · [[03 - Grill Me - Đạt shared understanding|Tiếp: Grill Me →]]
