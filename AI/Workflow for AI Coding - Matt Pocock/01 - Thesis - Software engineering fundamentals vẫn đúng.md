---
tags:
  - ai
  - ai-coding
timestamp: 00:00 - 04:20
chapter: Introduction + The Thesis of AI Engineering
---

# 01 — Thesis: Software engineering fundamentals vẫn đúng

`[00:00 – 04:20]` · [[00 - README|← Mục lục]] · [[02 - Hai ràng buộc của LLM - Smart zone và Memento|Tiếp →]]

---

## Bối cảnh

Matt Pocock tự giới thiệu: *"My name's Matt, I'm a teacher, and I suppose now I teach AI."* Phòng workshop kín chỗ, cửa đóng, không có điều hoà — chi tiết này sẽ quay lại nhiều lần trong buổi.

Ông ấy khảo sát phòng bằng cách giơ tay, và kết quả nói lên hiện trạng của cả ngành:

| Câu hỏi | Kết quả |
|---|---|
| Ai đã từng code với AI? | Gần như cả phòng |
| Ai code với AI **mỗi ngày**? | Vẫn rất nhiều |
| Ai đã từng **bực mình** với AI? | Vẫn giơ tay hết |

→ Đây là điểm xuất phát của buổi workshop: ai cũng dùng, ai cũng bực.

---

## Luận điểm gốc `[00:00-00:01]`

> "The theory behind this talk, or at least the thesis under which I've been operating for the last kind of 6 months or so, is that **we all think that AI is a new paradigm**... And I feel that when we talk about AI being a new paradigm, we forget that actually **software engineering fundamentals, the stuff that's really crucial to working with humans, also works super well with [AI]**."

Đọc kỹ câu này vì nó quyết định cách hiểu toàn bộ phần sau. Matt không nói "AI không thay đổi gì". Ông ấy nói: **những thứ khiến việc cộng tác giữa người với người hiệu quả, cũng khiến việc cộng tác với AI hiệu quả.**

Hệ quả thực tế: mọi kỹ thuật ông ấy dạy đều là kỹ thuật cũ, chỉ đổi đối tượng áp dụng.

| Kỹ thuật cũ | Vốn để làm gì | Giờ dùng cho AI thế nào |
|---|---|---|
| Task nhỏ (Fowler, Pragmatic Programmer) | Dev người không bị ngợp | Task nhỏ để AI không vào **dumb zone** |
| Design concept (Brooks) | Cả team cùng một hình dung | Mình và AI cùng một hình dung → **grill me** |
| Tracer bullets (Pragmatic Programmer) | Có feedback sớm | AI có feedback sớm thay vì code mù |
| Deep modules (Ousterhout) | Code dễ đọc dễ test | Codebase mà AI **navigate và test được** |
| Kanban / Agile | Nhiều người làm song song | Nhiều **agent** làm song song |

Câu chốt cuối buổi `[01:36]` cũng chính là câu này:

> "You should head to Amazon and just buy a ton of those old books... **pre-AI writing is always really fun to read anyway.** On every single page I found that there was something useful."

---

## Cách tổ chức buổi workshop

Đáng chú ý vì nó cũng là một quan điểm.

Matt **ghét format Q&A truyền thống**:

> "I sort of have a hatred of Q&As cuz they're not very democratic. They're mostly the sort of most talkative people get to participate and share."

→ Ông ấy dùng **Slido**: mọi người post câu hỏi async, **vote cho nhau**, câu hay nhất nổi lên. Trong suốt buổi ông ấy trả lời theo thứ tự vote, xen kẽ lúc chờ AI chạy.

Cách này rất hợp với workshop có AI: **thời gian chờ agent chạy được lấp bằng Q&A** thay vì ngồi nhìn màn hình. Đây là một pattern hay ho để bắt chước khi demo AI cho team.

---

## Phản luận điểm: chống "specs to code" `[00:12-00:13]`

Phần này thực ra nằm ở chapter sau, nhưng để đây vì nó là **mặt đối lập của thesis** — cần hiểu ngay từ đầu.

Matt hỏi phòng có ai nghe về "specs to code movement" không. Ông ấy mô tả nó:

> "People say: okay, the best way to build that app is to take some specifications, write some sort of document, and then turn that document into code. How do you do that? You pass it to AI. **If there's something wrong with the resulting code, you don't look at the code, you look back at the specs.** You change the specs and you sort of just keep going like this."

Đánh giá của ông ấy, không vòng vo:

> "This is kind of like **vibe coding by another name** where you're essentially ignoring the code... And I tried this. I really tried it. **And it sucks. It doesn't work.** Because you need to keep a handle on the code. You need to understand what's in it. You need to shape it because **the code is your battleground.**"

### Tại sao điều này quan trọng

Cả workflow trong workshop **trông rất giống** specs-to-code từ bên ngoài: có document, có PRD, có issue, AI tự code. Khác biệt nằm ở chỗ:

- Specs-to-code: **code là output**, không ai nhìn. Sai thì sửa spec.
- Workflow của Matt: **code là chiến trường**. PRD có hẳn mục *proposed modules to modify*, QA là người làm tay, và ông ấy giữ **module map trong đầu suốt cả quá trình**.

Nghịch lý thú vị: Matt **không đọc PRD** (xem [[04 - PRD - Document điểm đến]]) nhưng **rất quan tâm code**. Đó không phải mâu thuẫn — ông ấy dịch chuyển sự chú ý từ *document* sang *code + alignment*, chứ không phải từ *code* sang *document* như specs-to-code.

---

## Ý cần nhớ

- Đừng coi AI coding là địa hạt mới cần phát minh lại mọi thứ. **Phần lớn câu trả lời nằm trong sách cũ.**
- Cẩn thận với mọi workflow bảo bạn *đừng nhìn code nữa*. Đó là dấu hiệu của vibe coding được đổi tên.
- Format Q&A vote-based rất hợp khi demo AI (lấp thời gian chờ agent).

---

[[00 - README|← Mục lục]] · [[02 - Hai ràng buộc của LLM - Smart zone và Memento|Tiếp: Hai ràng buộc của LLM →]]
