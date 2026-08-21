---
tags:
  - ai
  - ai-coding
  - architecture
  - deep-modules
timestamp: 25:31 - 31:20
---

# 05 — Module structure và deep modules

`[25:31 – 31:20]` · [[00 - README|← Mục lục]] · [[06 - Sua gi trong Clean Code - Threshold vs discipline|Tiếp →]]

---

## Câu hỏi: test tốt có cứu được thiết kế tệ không?

Matt đặt câu hỏi rất đúng chỗ `[25:31–26:12]`:

> "Having a good test suite is good. Having mutation testing, all that stuff is good. **But if you've got badly designed APIs, if you've got badly shaped modules, how does that interact with all of this automated checks?**"

**Dịch:** *"Có test suite tốt là tốt. Có mutation testing, mấy thứ đó đều tốt. **Nhưng nếu API thiết kế tệ, nếu module có hình dạng tệ, thì nó tương tác thế nào với đống automated check này?**"*

> 💡 **Ý là:** Đây là giới hạn của mọi thứ ở note [[03 - Steering thua deterministic tools - Lost in the middle]] và [[04 - Gauntlet 5 agent - Specifier den QA]]. Deterministic tool đo được **chất lượng cục bộ** (function này có phức tạp quá không, test có bắt lỗi không) nhưng **không đo được thiết kế** (module này có nên tồn tại không). Chất lượng cục bộ hoàn hảo vẫn có thể ra một hệ thống sai cấu trúc.

---

## Quy trình thủ công của Uncle Bob `[26:12–26:53]`

Thẳng thắn thừa nhận đây vẫn là phần **làm tay**:

> "Up to the last month or so, what I was doing there was doing that part **manually**. I would have the agents build me up a nice thing and then **I would interrogate the agents**... What's the structure here? How does this module interrelate with that module? What are the modules after all? And how do they talk to each other? I would ask those questions and then **I would get scared to death because the answers were horribly frightening.**"

**Dịch:** *"Cho tới khoảng tháng trước, phần đó tôi làm **thủ công**. Tôi để agent dựng ra một thứ ổn rồi **tôi thẩm vấn agent**... Cấu trúc ở đây là gì? Module này liên hệ với module kia thế nào? Rốt cuộc có những module nào? Chúng nói chuyện với nhau ra sao? Tôi hỏi mấy câu đó rồi **tôi sợ chết khiếp vì câu trả lời kinh khủng khiếp.**"*

Rồi:

> "I would **design a module structure** and I would tell the agent: okay, here's how the modules should really be partitioned and here's how you should communicate with them. And I would give them an **implementation plan** that they would then implement."

> 💡 **Ý là:** Đáng chú ý: đây là chỗ **duy nhất** trong toàn buổi mà Uncle Bob nói ông tự thiết kế rồi giao plan cho agent. Ở [[07 - Chong spec-driven - Cost of change ve gan 0]] ông bác bỏ upfront planning — nhưng ở đây thì làm. Không mâu thuẫn: ông lập plan **sau khi nhìn thấy code thật**, không phải trước khi có code. Đó chính là "agile approach" ông nói tới sau đó.

---

## Hai tool ông tự dựng

### 1. Architecture viewer `[26:53–27:34]`

> "I also had my agents **build me an architecture viewer** so I can pop up on the screen a nice little **UML diagram** that shows me the modular structure of the system and **where the dependencies run**. And I can **click on a module and see inside it** to the submodules, and I can click on the submodules and **it'll actually pop the code up on the screen** for me. So I can drill down as much as I want and view the system architecture **at any level.**"

**Dịch:** *"Tôi cũng bảo agent **dựng cho tôi một architecture viewer** để tôi bật lên màn hình một **sơ đồ UML** nhỏ gọn cho thấy cấu trúc module của hệ thống và **các dependency chạy đi đâu**. Tôi có thể **click vào một module và nhìn vào bên trong** tới các submodule, click tiếp vào submodule và **nó hiện code lên màn hình**. Nên tôi drill xuống bao sâu tuỳ ý và xem kiến trúc hệ thống **ở mọi cấp độ.**"*

> 💡 **Ý là:** Đây là một pattern rất đáng bắt chước và ít người nghĩ tới. Khi agent viết code, thứ con người mất đi **không phải khả năng đọc code** mà là **bản đồ trong đầu** — bạn không còn tự nhiên biết hệ thống có hình dạng gì. Architecture viewer là cách **tái tạo bản đồ đó bằng công cụ**, thay vì bằng việc đọc từng file.
>
> Matt cũng nhấn mạnh "giữ module map trong đầu" xuyên suốt workshop của mình — xem [[Workflow for AI Coding - Matt Pocock/08 - Deep Modules - Thiết kế codebase cho AI]]. Hai người đến cùng kết luận từ hai hướng khác nhau.

### 2. Dependency spec file + checker `[27:34–27:54]`

Đây là ví dụ hoàn hảo cho luận điểm "biến rule thành tool":

> "I've also put together another **deterministic tool** where I can **define which module should depend on which**, which one should not depend on which, how the dependency should flow. That goes into a nice tight little **specification file that the agents cannot violate**. There's another little checker that runs at the end and **if they violate it, they've got to fix it** — usually by **inverting a dependency** or **inserting an interface** or **splitting a module in half**."

**Dịch:** *"Tôi cũng dựng một **deterministic tool** khác cho phép tôi **định nghĩa module nào được phụ thuộc module nào**, cái nào không được, dependency chảy theo hướng nào. Cái đó vào một **file specification nhỏ gọn mà agent không thể vi phạm**. Có một checker khác chạy ở cuối và **nếu chúng vi phạm thì phải sửa** — thường bằng cách **đảo ngược một dependency**, **chèn một interface**, hoặc **chẻ đôi một module**."*

> 💡 **Ý là:** Ba cách sửa vi phạm dependency — invert / insert interface / split — chính là **Dependency Inversion Principle** trong SOLID, thứ Uncle Bob viết ra từ hai thập kỷ trước. Điểm mới không phải nguyên tắc, mà là: nguyên tắc giờ được **cưỡng chế bằng máy** và **agent tự sửa**, thay vì trông chờ dev nhớ.
>
> Với dự án JS: có thể làm bằng `dependency-cruiser` hoặc ESLint `import/no-restricted-paths` — file config chính là "specification file" ông nói tới.

Ông thừa nhận giới hạn hiện tại:

> "I'm working now to see if I can **automate that** and **I'm having not a lot of luck so far.**"

Matt: *"I'm basically in exactly the same boat as you."*

> 💡 **Ý là:** Cả hai đều bị kẹt ở đúng một chỗ: **con người vẫn phải quyết định module structure**. Đây là ranh giới thật sự của AI coding hiện tại, và nó dẫn thẳng tới chủ đề tactical vs strategic ở [[08 - Hoc strategic programming va vi sao fundamentals van dung]].

---

## Vì sao module tốt giúp agent `[28:35–29:38]`

> "It's the **same argument** that we had for the dirty code versus clean code. Anything that is **well partitioned with well-disciplined interfaces** between it is something a human can grasp because **we compartmentalize in our minds well. So do the models. So do the agents** — maybe at a slightly different threshold, I don't know about that yet — but **they work far better if they can focus on a module** and if that module has a **trajectory**, using your term, so that the model does not get confused by the topics inside that module."

**Dịch:** *"Đây là **cùng một lập luận** với code bẩn và code sạch. Bất cứ thứ gì được **phân vùng tốt với interface có kỷ luật** giữa các phần là thứ con người nắm được, vì **chúng ta phân ngăn trong đầu rất tốt. Model cũng vậy. Agent cũng vậy** — có thể ở ngưỡng hơi khác, cái đó tôi chưa rõ — nhưng **chúng làm việc tốt hơn nhiều nếu tập trung được vào một module** và nếu module đó có **trajectory**, dùng từ của anh, để model không bị rối bởi các chủ đề bên trong module đó."*

Và ông nối thẳng về ẩn dụ cà phê/soap opera ở [[04 - Gauntlet 5 agent - Specifier den QA]]:

> "It's the **coffee and soap opera argument**. If you load up a module with **every bit of stuff under the sun**, the poor agent is going to wonder: **what the heck am I doing in here? How do I do anything in here?** If you compartmentalize nicely, works pretty well — **just like a human.**"

**Dịch:** *"Đây là **lập luận cà phê và phim truyền hình**. Nếu bạn nhồi vào một module **đủ mọi thứ trên đời**, agent tội nghiệp sẽ tự hỏi: **rốt cuộc tôi đang làm gì ở đây? Làm sao làm được gì ở đây?** Nếu bạn phân ngăn gọn gàng, nó chạy khá tốt — **y như con người.**"*

> 💡 **Ý là:** Đây là chỗ ghép nối hai khái niệm của hai người thành một ý mới:
>
> **Module = đơn vị trajectory.** Một module lẫn lộn nhiều mối quan tâm sẽ tạo ra context window lẫn lộn khi agent đọc nó, y hệt việc có người đi ngang nói chuyện phim vào giữa cuộc bàn về cà phê. Cohesion cao không còn chỉ là chuyện thẩm mỹ — nó là **context engineering**.

---

## Deep modules — Ousterhout `[29:38–31:01]`

Matt đưa vào khái niệm của **John Ousterhout** (*A Philosophy of Software Design*):

> "You can have **shallow modules** which have a **wide interface and not much hidden inside them**, and you can also have **deep modules** which have a **small interface and lots of hidden information inside** them. And it occurs to me that that is really good with models because **they can read the interface without having to understand the implementation.**"

**Dịch:** *"Bạn có thể có **shallow module** — **interface rộng nhưng bên trong chẳng giấu được bao nhiêu** — và cũng có thể có **deep module** — **interface nhỏ và giấu rất nhiều thông tin bên trong**. Và tôi nghĩ cái đó rất hợp với model vì **chúng đọc được interface mà không cần hiểu implementation.**"*

```
SHALLOW MODULE                    DEEP MODULE
════════════════                  ═══════════
┌──────────────────┐              ┌───┐
│ interface rộng   │              │ i │  ← interface hẹp
├──────────────────┤              ├───┴──────────────┐
│ implementation   │              │                  │
│ mỏng             │              │ implementation   │
└──────────────────┘              │ dày, được giấu   │
                                  │                  │
agent phải đọc gần hết            └──────────────────┘
mới hiểu được gì đang xảy ra      agent chỉ cần đọc interface
```

Uncle Bob xác nhận, kèm một cảnh báo hay:

> "The models pay attention to interface names. They pay attention to the structure. **It can allow them to not read the code beneath them, which is both a danger and an advantage.** As long as the code is consistent, you're okay."

**Dịch:** *"Model chú ý tới tên interface. Chúng chú ý tới cấu trúc. **Điều đó cho phép chúng không đọc code bên dưới — vừa là nguy hiểm vừa là lợi thế.** Chừng nào code còn nhất quán thì bạn ổn."*

> 💡 **Ý là:** "Vừa nguy hiểm vừa lợi thế" là nhận xét sắc. Deep module giúp agent tiết kiệm context — nhưng nếu **tên interface nói dối về implementation**, agent sẽ tin cái tên và không bao giờ phát hiện. Với con người thì thỉnh thoảng có người đọc vào trong và phát hiện; với agent thì không.
>
> Hệ quả: **đặt tên sai giờ nguy hiểm hơn trước.** Một hàm tên `calculatePoints` mà bên trong có side effect ghi Firestore sẽ khiến agent suy luận sai mãi mãi.

Và một điểm nữa:

> "**They also pay attention to the tests. They read tests to understand what the system does.**"

**Dịch:** *"**Chúng cũng chú ý tới test. Chúng đọc test để hiểu hệ thống làm gì.**"*

> 💡 **Ý là:** Test không chỉ là lưới an toàn, nó là **tài liệu mà agent thực sự đọc**. Test viết rõ ràng = spec mà không cần bảo trì file spec riêng. Đây là một lý do nữa để bỏ file spec dài — xem [[07 - Chong spec-driven - Cost of change ve gan 0]].

---

## Ngoài lề: cuộc tranh luận Bob vs Ousterhout `[31:01–31:21]`

> "By the way, in this book there is **a long debate between me and John Ousterhout in the appendix** and it was a lot of fun. He and I had a blast. **Well, I don't know how much fun he had, but I had a lot of fun.**"

**Dịch:** *"Nhân tiện, trong cuốn sách này có **một cuộc tranh luận dài giữa tôi và John Ousterhout ở phần phụ lục** và nó rất vui. Tôi với ông ấy chơi tưng bừng. **À, tôi không biết ông ấy vui đến đâu, nhưng tôi thì rất vui.**"*

Cuộc tranh luận này nằm ở phụ lục **Clean Code, second edition** — cuốn Bob giơ lên đầu buổi. Chủ đề chính là bất đồng về **kích thước function**: Bob chủ trương function rất nhỏ, Ousterhout cho rằng chẻ nhỏ quá tạo ra shallow module. Điểm này nối thẳng sang [[06 - Sua gi trong Clean Code - Threshold vs discipline]], nơi Bob thừa nhận agent làm ông nghiêng về phía Ousterhout hơn.

---

## Áp vào công việc hằng ngày

- [ ] Nhờ agent sinh **sơ đồ module + dependency** cho repo hiện tại, xem nó có khớp với hình dung trong đầu không (Uncle Bob "sợ chết khiếp" ở bước này — kỳ vọng thấp)
- [ ] Viết **dependency spec** bằng `dependency-cruiser` hoặc ESLint `import/no-restricted-paths`, chạy trong CI
- [ ] Soát lại tên hàm/module ở lớp lõi: **tên có nói đúng sự thật về side effect không?**
- [ ] Với module lõi (tính điểm, tier, webhook): ưu tiên **interface hẹp, implementation dày** thay vì export nhiều helper lẻ

---

## Ý cần nhớ

- Automated check đo **chất lượng cục bộ**, không đo **thiết kế**. Module structure vẫn là việc của người.
- **Module = đơn vị trajectory.** Module lẫn lộn chủ đề → context lẫn lộn → agent rối.
- **Deep module** (interface hẹp, implementation dày) giúp agent đọc interface mà không cần đọc code.
- Mặt trái: agent **tin tên interface** và không kiểm chứng → đặt tên sai nguy hiểm hơn trước.
- **Agent đọc test để hiểu hệ thống** — test là tài liệu thật sự được đọc.
- Dependency rule nên là **file config có checker**, không phải một dòng trong CLAUDE.md.

---

[[00 - README|← Mục lục]] · [[06 - Sua gi trong Clean Code - Threshold vs discipline|Tiếp: Sửa gì trong Clean Code →]]
