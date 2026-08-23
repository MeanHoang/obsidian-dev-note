---
tags:
  - ai
  - ai-coding
  - context-engineering
timestamp: 12:22 - 17:32
---

# 03 — Steering thua deterministic tools: Lost in the middle

`[12:22 – 17:32]` · [[00 - README|← Mục lục]] · [[04 - Gauntlet 5 agent - Specifier den QA|Tiếp →]]

---

## Hai trường phái xử lý agent bừa bộn

Matt đặt vấn đề rất sắc `[12:22–12:43]`:

> "When most people encounter that, they start **loading the agent with instructions**... I'm going to pour in information into the agent that's doing the implementation. I'm going to pile in on CLAUDE.md or AGENTS.md and every time I see something bad **I'm going to use an instruction** — instead of what you're doing, where it's a **deterministic mechanism**. So you're using automated checks whereas a lot of other people are using, in my terminology, **steering**."

**Dịch:** *"Khi gặp chuyện đó, đa số bắt đầu **nhồi instruction vào agent**... Tôi sẽ đổ thông tin vào agent đang implement. Tôi sẽ chất đống lên CLAUDE.md hoặc AGENTS.md, và mỗi lần thấy điều gì tệ **tôi thêm một instruction** — thay vì cái ông đang làm, tức một **cơ chế xác định**. Nên ông dùng automated check, còn rất nhiều người khác dùng cái mà tôi gọi là **steering**."*

> 💡 **Ý là:** Đây là hai chiến lược đối lập, và hầu hết chúng ta mặc định chọn cái thứ nhất:
>
> | | **Steering** | **Deterministic check** |
> |---|---|---|
> | Cơ chế | Text trong prompt / CLAUDE.md | Tool chạy được, pass/fail |
> | Agent có thể lờ đi? | **Có** | **Không** |
> | Chi phí | Ăn context window | Không ăn context window |
> | Khi codebase lớn lên | Ngày càng loãng | Không đổi |

---

## Uncle Bob cũng từng steering, và bỏ `[12:43–13:24]`

> "Initially I started with that. My early prompts were: here's how you do test-driven development, here's how you do clean code, here's what your code should look like, you should follow all these rules. And you come up with eventually **a document that's five or 10 pages long** describing all the good things about code. **I suppose I could have fed the whole damn book into it.**"

**Dịch:** *"Ban đầu tôi làm đúng thế. Mấy prompt đầu của tôi là: đây là cách làm test-driven development, đây là cách viết clean code, code của mày phải trông thế này, mày phải theo hết đống rule này. Và rốt cuộc bạn có **một tài liệu dài 5-10 trang** mô tả mọi điều tốt đẹp về code. **Chắc tôi có thể nhét cả quyển sách vào cũng được.**"*

Kết quả:

> "What I noticed was that the agents treat those rules in the **Pirates of the Caribbean sense. They're more like guidelines**, you know. Might follow."

**Dịch:** *"Cái tôi nhận ra là agent đối xử với mấy rule đó theo kiểu **Pirates of the Caribbean. Chúng giống guideline hơn**, kiểu vậy. Có thể theo, có thể không."*

Matt cắt ngang thừa nhận đúng cái ẩn dụ đó vừa hiện lên trong đầu mình — chi tiết cho thấy đây là trải nghiệm chung của người dùng agent nặng.

> 💡 **Ý là:** "*The code is more what you'd call guidelines than actual rules*" — câu thoại của Barbossa trong *Pirates of the Caribbean*. Ẩn dụ chuẩn: rule trong prompt là thứ agent **cân nhắc**, không phải thứ nó **buộc phải qua**.

---

## Lý do kỹ thuật: Lost in the middle `[13:44–14:47]`

Đây là phần có giá trị kỹ thuật cao nhất của đoạn này.

> "There's this phenomenon known as **lost in the middle**. As the context window builds up inside the model, **the stuff at the very beginning and the stuff at the very end have more prominence than the stuff in the middle** for technical reasons. The agent will ignore the stuff in the middle."

**Dịch:** *"Có một hiện tượng gọi là **lost in the middle**. Khi context window trong model phình ra, **phần ở ngay đầu và phần ở ngay cuối có độ nổi bật cao hơn phần ở giữa** vì lý do kỹ thuật. Agent sẽ bỏ qua phần ở giữa."*

Và đây là hệ quả mà ít người nghĩ tới:

> "**Anything you say at the very beginning is going to get shoved into the middle if it's long**, right? So maybe the first three sentences you put at the beginning will remain as priority, but the **50th and the 80th sentence in there, they're gone.** They're just in the middle somewhere."

**Dịch:** *"**Bất cứ thứ gì bạn nói ở đầu sẽ bị đẩy vào giữa nếu nó dài.** Nên có lẽ 3 câu đầu bạn đặt ở đầu vẫn giữ được ưu tiên, nhưng **câu thứ 50 và thứ 80 thì mất rồi.** Chúng nằm đâu đó ở giữa."*

> 💡 **Ý là:** Đây là điểm phản trực giác quan trọng nhất trong note này.
>
> Ta hay nghĩ CLAUDE.md nằm ở **đầu** context nên an toàn. Sai — nếu chính CLAUDE.md dài, thì **bên trong nó cũng có phần giữa**, và phần giữa đó bị mất. Một file rule 300 dòng thì dòng 40 đến dòng 260 gần như không tồn tại.
>
> Hệ quả thực tế: **thêm rule vào giữa CLAUDE.md không chỉ vô ích, mà còn đẩy các rule cũ vào vùng chết.** Mỗi rule mới bạn thêm làm loãng các rule đã có.

Kết luận của Uncle Bob:

> "Deterministic tools **don't disappear that way**. The key with agents — and this is really hard to do — is to **trim that initial prompt down to its absolute minimum** so that you can get as much of it as possible into its priority. And then do **deterministic tools after the fact**."

**Dịch:** *"Deterministic tool **không biến mất theo cách đó**. Chìa khoá khi làm với agent — và cái này rất khó làm — là **cắt prompt khởi đầu xuống mức tối thiểu tuyệt đối** để nhét được càng nhiều càng tốt vào vùng ưu tiên. Rồi dùng **deterministic tool ở phía sau**."*

Matt bổ sung mô hình của mình `[15:08–15:48]`:

> "I refer to this as the **smart zone and the dumb zone** of the context window. It's not my term, that's **Dex Horthy's** term... especially at the early part of the context window, like the first 150k tokens, it's pretty smart. But then as you go along, the attention relationships in the transformer get really strained. **It's like every token is shouting in a crowded room and the room's getting more crowded.** You can't hear the signal for the noise."

**Dịch:** *"Tôi gọi cái này là **smart zone và dumb zone** của context window. Không phải từ tôi nghĩ ra, đó là từ của **Dex Horthy**... đặc biệt ở phần đầu context window, kiểu 150k token đầu, nó khá thông minh. Nhưng càng đi xa, các quan hệ attention trong transformer càng bị căng. **Giống như mỗi token đang hét trong một căn phòng đông, và phòng ngày càng đông hơn.** Bạn không nghe được tín hiệu vì nhiễu."*

---

## Đổi prompt lấy loop `[16:50–17:32]`

Deterministic tool không chỉ "thay thế" rule — nó đổi hẳn **cơ chế cưỡng chế**:

> "When you use these deterministic tools, what you are really doing is **you're putting them into a loop**... You're saying: okay, **you must change the code until this tool says that it's okay.** And now the agent is going around and around and around. Okay, I've got to add more tests over here. I've got to cut the cyclomatic complexity. I've got to split these functions apart."

**Dịch:** *"Khi bạn dùng mấy deterministic tool này, thứ bạn thực sự làm là **đẩy agent vào một vòng lặp**... Bạn nói: được rồi, **mày phải sửa code cho tới khi tool này bảo là ổn.** Và giờ agent quay vòng vòng vòng. Được, phải thêm test ở đây. Phải cắt cyclomatic complexity. Phải tách mấy function này ra."*

Cái giá phải trả — và ông ấy thẳng thắn về nó:

> "**You are sacrificing productivity for higher quality** and at some point that's got to give way. **But I haven't found the end point of that yet.**"

**Dịch:** *"**Bạn đang hy sinh năng suất để đổi lấy chất lượng cao hơn** và tới một lúc nào đó nó phải sụp. **Nhưng tôi chưa tìm ra điểm đó.**"*

---

## Bao nhiêu check là quá nhiều? `[16:08–16:50]`

Matt hỏi thẳng: có bao giờ automated check là quá nhiều không?

> "Obviously there has to be a case where there's too much. **Eventually you will slow the agents down to the point where they're slower than humans. And at that point you've lost the game.** But as long as you can keep the **margin of productivity higher than a human**, you're still ahead of the game. And from what I've seen so far, I can get that margin like **a factor of two or three or four.**"

**Dịch:** *"Rõ ràng phải có trường hợp là quá nhiều. **Cuối cùng bạn sẽ làm agent chậm tới mức chậm hơn con người. Và lúc đó bạn thua cuộc.** Nhưng chừng nào **biên năng suất còn cao hơn con người**, bạn vẫn đang thắng. Và theo những gì tôi thấy đến giờ, tôi giữ được biên đó ở mức **gấp 2, 3 hoặc 4 lần.**"*

> 💡 **Ý là:** Đây là **tiêu chí dừng** rất rõ ràng để tự đo workflow của mình:
>
> **Điều kiện thắng: (thời gian agent chạy qua toàn bộ check) < (thời gian bạn tự làm việc đó với cùng chất lượng).**
>
> Không phải "agent phải nhanh nhất có thể". Nếu gauntlet mất 1 tiếng nhưng bạn tự làm mất nửa ngày, thêm check vẫn còn lời.

---

## Áp vào công việc hằng ngày

Chuyển từ steering sang deterministic check, ví dụ cụ thể cho stack JS/Firebase:

| Rule đang nằm trong CLAUDE.md | Biến thành check chạy được |
|---|---|
| "Luôn validate input của Cloud Function" | Test suite có case gửi payload rỗng/sai type cho mọi endpoint |
| "Không query Firestore trong vòng lặp" | ESLint custom rule / grep check trong CI |
| "Đừng để function quá dài" | Đo cyclomatic complexity, fail build nếu vượt ngưỡng |
| "Nhớ viết test cho code mới" | Coverage threshold + mutation testing |
| "Module A không được import module B" | Dependency spec file — xem [[05 - Module structure va deep modules]] |

---

## Ý cần nhớ

- **Rule trong prompt là guideline; tool chạy được là luật.**
- **Lost in the middle:** CLAUDE.md càng dài thì rule ở giữa càng chết — kể cả rule bạn viết ở "đầu file".
- Mỗi rule thêm vào làm loãng rule cũ. Cắt prompt xuống **tối thiểu tuyệt đối**.
- Deterministic tool = đẩy agent vào **loop bắt buộc**, đổi thời gian lấy chất lượng.
- Tiêu chí dừng: còn nhanh hơn người tự làm thì còn thêm check được.

---

[[00 - README|← Mục lục]] · [[04 - Gauntlet 5 agent - Specifier den QA|Tiếp: Gauntlet 5 agent →]]
