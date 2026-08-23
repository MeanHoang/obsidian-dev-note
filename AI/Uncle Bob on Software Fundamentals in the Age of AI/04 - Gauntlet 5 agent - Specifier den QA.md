---
tags:
  - ai
  - ai-coding
  - agent
  - multi-agent
timestamp: 17:32 - 25:30
---

# 04 — Gauntlet 5 agent: Specifier đến QA

`[17:32 – 25:30]` · [[00 - README|← Mục lục]] · [[05 - Module structure va deep modules|Tiếp →]]

---

## Chỗ Matt và Bob bất đồng

Matt nói thẳng sự hoài nghi của mình về multi-agent `[17:52–18:36]`:

> "I've always had a bit of a suspicion of people who say 'I've got rid of all my workforce, I now have a hundred agents, every one of them has a different role, they all talk to each other, **they've got their own email accounts**, all that rubbish.'"

**Dịch:** *"Tôi vẫn luôn hơi nghi ngờ những người nói 'tôi đã bỏ hết nhân sự, giờ tôi có một trăm agent, mỗi con một vai, chúng nói chuyện với nhau, **chúng có email riêng**, đủ thứ nhảm nhí đó.'"*

Ngoại lệ duy nhất Matt chấp nhận: **implementer + reviewer**, và lý do rất rõ:

> "It's kind of like a **red-green-refactor** approach, where the implementer, all it has to do is write the bad test and then make it work. **It doesn't have to make it beautiful.** And then the reviewer comes in. It **doesn't have to do the exploration** because it's already got the diff from the implementer. It knows exactly what it's reviewing. And then you can pile in **quite a lot more steering instructions** in there because the task is much less constrained."

**Dịch:** *"Kiểu như cách tiếp cận **red-green-refactor**: implementer chỉ cần viết cái test dở rồi làm cho nó chạy. **Nó không cần làm cho đẹp.** Rồi reviewer vào. Reviewer **không phải đi khám phá** vì đã có sẵn diff từ implementer. Nó biết chính xác đang review cái gì. Và lúc đó bạn nhồi được **nhiều steering instruction hơn hẳn** vào đó vì task bị ràng buộc ít hơn nhiều."*

> 💡 **Ý là:** Lý lẽ của Matt tinh tế hơn "chia vai cho vui". Reviewer nhận **diff** làm input nên context của nó nhỏ → nằm sâu trong smart zone → **chịu được nhiều rule hơn**. Đây là cách lách giới hạn "lost in the middle" ở [[03 - Steering thua deterministic tools - Lost in the middle]]: không phải nhồi rule vào một agent, mà **chia rule cho nhiều agent context nhỏ**.

---

## Hai lợi thế thật của multi-agent `[19:17–20:18]`

Uncle Bob liệt kê rõ ràng, không lãng mạn hoá:

**1. Chạy song song**

> "You can run them in parallel. So you could have three coders running at the same time. And **my little laptop can support a lot more than three.**"

**2. Giữ context nhỏ**

> "When you focus the agents down to a single task, **you're keeping the context window under control. The lost-in-the-middle problem becomes much less of a problem.** So you can pile a few more — not a lot more, but a few more — rules up at the top and they'll tend to follow them better."

**Dịch:** *"Khi bạn thu hẹp agent xuống một task duy nhất, **bạn giữ được context window trong tầm kiểm soát. Vấn đề lost-in-the-middle nhẹ đi nhiều.** Nên bạn chất thêm được vài rule nữa lên đầu — không nhiều lắm, nhưng vài cái — và chúng có xu hướng tuân theo tốt hơn."*

**3. Agent sinh ra rồi chết**

> "You can also set up a system where the agents are **born, do the task, and die** so that the next one comes in with a **clean context**."

**Dịch:** *"Bạn cũng có thể dựng hệ thống mà agent **sinh ra, làm task, rồi chết** để con tiếp theo vào với **context sạch**."*

**Nhược điểm — ông ấy không giấu:**

> "The startup times are high. An agent takes 10-15 seconds to even start up, and then **it's got to figure out its whole context all over again.**"

**Dịch:** *"Thời gian khởi động cao. Một agent mất 10-15 giây chỉ để khởi động, rồi **nó phải tự tìm hiểu lại toàn bộ context từ đầu.**"*

> 💡 **Ý là:** "Born, do the task, and die" là câu đáng nhớ nhất về context management. Agent sống lâu = context tích tụ = trajectory nhiễm bẩn. Agent dùng một lần thì mỗi task đều bắt đầu ở smart zone. Cái giá là **overhead tái khám phá context** — đó là lý do phải có module structure tốt, xem [[05 - Module structure va deep modules]].

---

## Gauntlet: 5 vai nối tiếp `[20:18–22:27]`

### 1. SPECIFIER

Input: một document do **người** viết. Output: **2 file**.

> "The job of the specifier is to take a human-written document and turn it into a **Gherkin** and a **QA procedure**. Gherkin is, you know, given-when-then stuff. It's a **high-level acceptance test**. And a QA procedure is essentially a **system test** — you run the system through the UI with a QA procedure."

**Đây là gì:** **Gherkin** là cú pháp ngôn ngữ tự nhiên có cấu trúc của Cucumber, viết acceptance test dạng `Given <trạng thái> / When <hành động> / Then <kết quả>`. Nó chạy được, không phải văn xuôi.

Điểm quan trọng — góc nhìn khi viết:

> "And I have them write it **from a human's point of view. You are a human. You are operating this system at the UI. You must prove that the system works.**"

**Dịch:** *"Và tôi bắt nó viết **từ góc nhìn của con người. Mày là người. Mày đang thao tác hệ thống này qua UI. Mày phải chứng minh hệ thống chạy được.**"*

> 💡 **Ý là:** Ép góc nhìn "người dùng thao tác UI" là cách chống lại xu hướng agent tự viết test dễ pass. Test viết từ góc nhìn implementation sẽ test **cái code đang làm**; test viết từ góc nhìn người dùng test **cái đáng lẽ phải làm**.

### 2. CODER

> "The coder's job is to **write unit tests and the code** that implements the described story and also **get the Gherkin working**."

Và Uncle Bob nói trước kết quả:

> "The implementer will have made **a horrible mess** by that point."

**Dịch:** *"Đến lúc đó implementer sẽ đã bày ra **một đống hỗn độn kinh khủng**."*

> 💡 **Ý là:** Đây là thiết kế có chủ ý, không phải chấp nhận thất bại. Coder được **cho phép** bừa bộn vì mess sẽ có agent khác dọn. Giống hệt logic red-green-refactor của Matt: tách "làm cho chạy" khỏi "làm cho sạch" để mỗi agent chỉ có **một trajectory duy nhất**.

### 3. CLEANER

> "The cleaner's job is to **run CRAP analysis and just general code review**, clean up whatever mess the implementer made."

### 4. HARDENER

> "The hardener is the guy who runs the **mutation testing** and he's **absolutely merciless**. It's going to mutate it and it's going to have 100% coverage and every equal sign and every less-than — it's going to do that work, which takes a good long time."

**Dịch:** *"Hardener là gã chạy **mutation testing** và hắn **hoàn toàn không khoan nhượng**. Nó sẽ đột biến code, đòi 100% coverage, mọi dấu bằng, mọi dấu bé hơn — nó làm hết chỗ việc đó, và mất khá lâu."*

### 5. QA AGENT

> "The QA agent takes the written QA document, turns it into an **executable script that manipulates the system** and comes up with a **deterministic result**."

**Dịch:** *"QA agent lấy tài liệu QA đã viết, biến nó thành **script chạy được thao tác hệ thống** và cho ra **kết quả xác định**."*

---

## Kinh tế học của gauntlet `[22:27–23:08]`

Đây là con số đáng nhớ nhất của cả buổi:

> "If I give it a task that takes **a single agent five minutes** to complete with questionable results, this will take it **about an hour**. Which is still a benefit because **a person would take about a half a day.** So maybe I've got a **factor of four, factor of five improvement in productivity** and very high quality — much more quality than the human would ever put into it."

**Dịch:** *"Nếu tôi giao một task mà **một agent đơn lẻ mất 5 phút** để làm xong với kết quả đáng ngờ, cái này sẽ mất **khoảng một tiếng**. Vẫn có lợi vì **một người sẽ mất khoảng nửa ngày.** Nên có lẽ tôi được **cải thiện năng suất gấp 4-5 lần** và chất lượng rất cao — cao hơn nhiều so với mức con người từng bỏ vào đó."*

```
1 agent, không check   →  5 phút   → kết quả đáng ngờ
Gauntlet 5 agent       →  60 phút  → chất lượng cao hơn cả người làm
Người tự làm           →  4 tiếng  → chất lượng trung bình
                                      ↑
                          gauntlet chậm hơn agent trần 12x
                          nhưng vẫn nhanh hơn người 4x
```

Matt bổ sung góc nhìn tài chính:

> "You're **spending productivity early to gain it later.** This is an **investment in your own codebase.**"

**Dịch:** *"Bạn **tiêu năng suất sớm để thu lại về sau.** Đây là **khoản đầu tư vào chính codebase của bạn.**"*

> 💡 **Ý là:** Cách so sánh dễ nhầm là "gauntlet chậm gấp 12 lần agent trần". Nhưng mốc so sánh đúng **không phải** agent trần — vì output của agent trần là *questionable*, tức là bạn vẫn phải bỏ thời gian người vào để dọn. Mốc đúng là **thời gian tới khi code thực sự dùng được**.

---

## Trajectory của context window `[23:08–24:50]`

Matt đưa ra một khái niệm mà Uncle Bob đồng ý ngay — đáng nhớ:

> "It's not only the context window that you're manipulating. There's this idea of a **trajectory** of a context window. If you get the agent to do one thing and you steer it in a certain way, then **everything that follows in that same session will continue following that trajectory.** If you get it to say 'okay, maybe we should test the UI here', then **every single time it will test the UI again**, no matter how many changes you get it to make. And **the only way to clear the trajectory is to clear the context window.**"

**Dịch:** *"Không chỉ context window là thứ bạn thao tác. Còn có ý niệm về **quỹ đạo** của một context window. Nếu bạn cho agent làm một việc và lái nó theo một hướng, thì **mọi thứ theo sau trong cùng session sẽ tiếp tục theo quỹ đạo đó.** Nếu bạn khiến nó nói 'ok, chắc nên test UI ở đây', thì **lần nào nó cũng sẽ test UI lại**, bất kể bạn bắt nó sửa bao nhiêu lần. Và **cách duy nhất xoá quỹ đạo là xoá context window.**"*

Uncle Bob xác nhận bằng một ví dụ ngoài lập trình — **ẩn dụ cà phê và soap opera** `[24:09–24:50]`:

> "You're talking to a model about what's the best coffee to have and how do you brew it nicely... And then **somebody walks by and they happen to be talking about the latest soap opera** that they saw on television and that gets into the context window. **You didn't put it there.** This guy walking by put it in there. But then **from that point on all the coffee references have to do with the soap opera.** The model doesn't know. It can't differentiate."

**Dịch:** *"Bạn đang nói chuyện với model về cà phê nào ngon nhất và pha thế nào cho khéo... Rồi **có người đi ngang qua và tình cờ đang nói về bộ phim truyền hình mới nhất** họ xem trên TV, và cái đó lọt vào context window. **Bạn không đưa nó vào.** Gã đi ngang qua đưa nó vào. Nhưng **từ điểm đó trở đi mọi tham chiếu về cà phê đều dính tới bộ phim.** Model không biết. Nó không phân biệt được."*

> 💡 **Ý là:** Ẩn dụ này giải thích tại sao "**clear, đừng compact**" là lời khuyên đúng. `/compact` giữ lại tóm tắt của trajectory cũ — nghĩa là giữ lại chính cái ô nhiễm. `/clear` mới thực sự reset.
>
> Nó cũng giải thích vì sao gauntlet 5 vai hoạt động: mỗi vai có **một trajectory sạch và duy nhất**. Cleaner không bị nhiễm bởi trajectory "làm cho chạy đi đã" của coder.

Uncle Bob kết:

> "As long as you can keep the direction of the model **unconfused** — it knows the direction it's going in, everything in the context window is consistent — then it's not going to have these crazy hallucinations."

---

## Áp vào công việc hằng ngày

Không cần dựng đủ 5 vai ngay. Thứ tự ưu tiên hợp lý:

| Bước | Vai | Đáng làm khi |
|---|---|---|
| 1 | **Coder + Cleaner** (tách 2 session) | Ngay lập tức — rẻ nhất, hiệu quả rõ nhất |
| 2 | **Specifier** sinh acceptance test trước khi code | Feature có luồng người dùng rõ (vd luồng earn/redeem điểm) |
| 3 | **QA agent** chạy script qua UI | Có Playwright/Puppeteer sẵn |
| 4 | **Hardener** mutation testing | Module lõi, ít thay đổi, hậu quả sai cao (tính điểm, tính tier) |

> 💡 Với Joy Loyalty, module đáng đưa vào hardener nhất là **logic tính điểm và tier** — nơi một dấu `>=` thành `>` không làm crash, không fail test coverage, nhưng sai tiền của merchant.

---

## Ý cần nhớ

- Multi-agent có **2 lý do kỹ thuật thật**: chạy song song + giữ context nhỏ. Không phải "mô phỏng công ty".
- **"Born, do the task, and die"** — agent dùng một lần, context luôn sạch.
- Cho phép coder bừa **có chủ ý**, vì có cleaner dọn. Mỗi agent một trajectory.
- **Trajectory** ô nhiễm chỉ xoá được bằng clear context, không phải bằng thêm chỉ dẫn.
- Mốc so sánh đúng là **thời gian tới lúc code dùng được**, không phải thời gian agent chạy.

---

[[00 - README|← Mục lục]] · [[05 - Module structure va deep modules|Tiếp: Module structure và deep modules →]]
