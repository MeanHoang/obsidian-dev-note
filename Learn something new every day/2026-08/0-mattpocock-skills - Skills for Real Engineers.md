# 0 — mattpocock/skills: bộ skill lấy thẳng từ thư mục `.agents` thật

> [!quote] 💬
> "My agent skills that I use every day to do real engineering - not vibe coding." — README của [mattpocock/skills](https://github.com/mattpocock/skills)

---
## 🎯 Repo này là gì
[mattpocock/skills](https://github.com/mattpocock/skills) là bộ **agent skill** mà Matt Pocock (Total TypeScript / AI Hero) dùng hằng ngày, được bê nguyên từ thư mục `.agents` trong repo thật của tác giả ra open-source.

| Thông tin | Giá trị |
|---|---|
| Description | *"Skills for Real Engineers. Straight from my `.agents` directory."* |
| Star / Fork | 230,448 ⭐ · 19,690 forks *(GitHub API, 22/08/2026)* |
| License | MIT · ngôn ngữ chính GitHub nhận diện: Shell |
| Ngày tạo | 03/02/2026 · push gần nhất 21/08/2026 |
| Homepage | [aihero.dev/skills](https://aihero.dev/skills) |
| Số skill | 29 skill đã ship (18 engineering · 7 productivity · 4 misc) + 2 skill `in-progress` *(đếm từ repo tree 22/08/2026)* |

README nói rõ nó định vị ngược lại đâu:

> "Approaches like GSD, BMAD, and Spec-Kit try to help by owning the process. But while doing so, they take away your control and make bugs in the process hard to resolve."
>
> "These skills are designed to be small, easy to adapt, and composable. They work with any model."

Tức là: **không phải framework nuốt trọn quy trình của bạn**, mà là những mảnh nhỏ ghép được, sửa được.

> [!note] 📝 So sánh dễ hiểu
> Giống bộ dao trong bếp. **Framework kiểu GSD/BMAD** là cái máy đa năng "cho nguyên liệu vào, bấm nút, ra món" — nhanh cho tới lúc nó băm sai, bạn không mở ra sửa được vì mọi thứ nằm trong hộp. **Bộ skill này** là 29 con dao rời: dao thái, dao lọc, dao chặt. Bạn phải biết cầm con nào, nhưng con nào cùn thì mài đúng con đó, và bạn thấy được mình đang cắt cái gì.

---
## 🔑 Ý tưởng lõi: hai loại invocation, và cái giá của mỗi loại
Đây là phần đáng học nhất trong repo, còn giá trị hơn cả nội dung từng skill. File [`.agents/invocation.md`](https://github.com/mattpocock/skills/blob/main/.agents/invocation.md) mở đầu:

> "Every `SKILL.md` in this repo is a skill. The one axis that splits them is **invocation**, who can reach it"

| | **User-invoked** | **Model-invoked** |
|---|---|---|
| Ai gọi được | Chỉ con người gõ tên (`/grill-me`) | Cả model lẫn người |
| Frontmatter | `disable-model-invocation: true` | bỏ trống (mặc định) |
| Codex (`agents/openai.yaml`) | `policy.allow_implicit_invocation: false` | bỏ khối `policy` |
| `description` viết cho ai | **Con người** — 1 dòng tóm tắt, bỏ hết trigger | **Model** — giàu trigger: *"Use when the user wants…, mentions…, asks for…"* |
| Vai trò | Điều phối (orchestrate) | Giữ kỷ luật tái dùng được |

Và đây là câu giải thích cơ chế, trong [`writing-for-agents/SKILL-MECHANICS.md`](https://github.com/mattpocock/skills/blob/main/skills/productivity/writing-for-agents/SKILL-MECHANICS.md):

> "The description is the skill's top-level context pointer, forced to stay loaded at all times: **permanent context load in exchange for discoverability**."
>
> "A user-invoked skill strips the description from the agent's reach… **Zero context load, but it spends cognitive load: you are the index that must remember it exists.**"

> [!tip] 💡 Đây là chỗ "aha"
> Mỗi skill model-invoked **luôn tốn token của bạn ở mọi lượt chat**, kể cả lượt không dùng tới nó — vì `description` phải nằm sẵn trong context để model biết mà với tới. Skill user-invoked thì miễn phí token, nhưng đổi lại **bạn** phải nhớ nó tồn tại.
>
> Quy tắc chốt của repo: *"Pick model-invocation only when the agent must reach the skill on its own, or another skill must. If it only ever fires by hand, make it user-invoked and pay no context load."*

Hệ quả kéo theo, repo ghi rõ chứ không bỏ lửng:

- **Skill user-invoked không bao giờ gọi được skill user-invoked khác.** Không có description thì không ai với tới được, kể cả skill khác. Chỉ có chiều: user-invoked → gọi model-invoked.
- **Reference dùng chung giữa 2 skill user-invoked phải nằm ngoài hệ skill** — đẩy ra file thường, vì "with no descriptions, neither can fire the other".
- Khi số skill user-invoked nhiều quá sức nhớ → dựng **router skill** (ở đây là [`ask-matt`](https://github.com/mattpocock/skills/blob/main/skills/engineering/ask-matt/SKILL.md)): một skill user-invoked liệt kê những cái còn lại, để bạn chỉ phải nhớ đúng một cái. Nó **chỉ gợi ý, không bắn được** skill khác.

> [!warning] ⚠️ Cách khai báo dependency giữa các skill
> Repo không dùng cross-reference kiểu `../other-skill/FILE.md`, cũng không thả `/skill-name` vào văn xuôi rồi hy vọng model hiểu. Nó viết thẳng **tên tool**:
> ```
> Call the Skill tool with "grilling"
> ```
> Lý do trong `invocation.md`: *"most harnesses expose skill invocation as a tool the model calls, and spelling that out gets a higher hit rate than dropping a `/name` into prose and hoping it's read as a command."* Bỏ dấu `/` còn giúp trung lập giữa các harness.
>
> Và: Skill tool **mỗi lần gọi một skill**. Cần 2 skill là 2 lệnh gọi — repo bắt viết `Call the Skill tool twice, for "grilling" and "domain-modeling"`, chứ không viết "call it with X and Y".

---
## 🧱 Anatomy một SKILL.md
Frontmatter cực gọn — chỉ `name` + `description`, không có gì thừa. Trích nguyên văn [`skills/productivity/grilling/SKILL.md`](https://github.com/mattpocock/skills/blob/main/skills/productivity/grilling/SKILL.md):

```yaml
---
name: grilling
description: Grill the user relentlessly about a plan, decision, or idea. Use when the user wants to stress-test their thinking, or uses any 'grill' trigger phrases.
---
```

Cấu trúc thư mục một skill:

```
skills/engineering/tdd/
├── SKILL.md              # thân skill, nạp khi được gọi
├── tests.md              # reference con, chỉ đọc khi SKILL.md trỏ tới
├── mocking.md
└── agents/openai.yaml    # metadata cho Codex (display_name, short_description, policy)
```

Skill nào cũng có `agents/openai.yaml` đi kèm để chạy được trên cả Claude Code lẫn Codex. Repo yêu cầu **giữ hai file đồng bộ**: *"a skill is user-invoked in both harnesses or neither."*

---
## 🔥 Skill đáng chú ý nhất: `grilling`
Repo gọi nhóm grilling là *"my most popular skills"*. Vấn đề nó trị, theo README:

> "The most common failure mode in software development is misalignment. You think the dev knows what you want. Then you see what they've built - and you realize it didn't understand you at all."

Cơ chế: model hình dung yêu cầu của bạn thành một **design tree**. Mỗi vòng, nó tính ra **frontier** — tập những quyết định mà tiền đề đã chốt xong, tức những câu hỏi hỏi được *ngay bây giờ* mà không phải đoán. Hỏi hết frontier trong một vòng, mỗi câu **kèm sẵn phương án nó đề xuất**:

```
❓ **Q1** - **<question title>**: <question body...>

➡️ <your recommended answer>

---

❓ **Q2** - **<question title>**: <question body...>

➡️ <your recommended answer>
```

Bạn trả lời → cây được định hình lại → frontier đẩy ra ngoài → vòng tiếp theo. Xong khi frontier rỗng: *"every branch of the design tree visited, nothing left silently assumed."*

Hai luật hay trong đó:

- **Fact là việc của agent, decision là việc của bạn.** Câu hỏi nào cần dữ kiện từ môi trường (đọc file, chạy tool) thì nó tự dispatch sub-agent đi tìm, không được hỏi bạn thứ nó tra được. Nhưng nó **không chặn cả vòng** để đợi — chỉ những câu phụ thuộc sub-agent mới chờ, phần frontier còn lại hỏi luôn.
- **Không được hành động cho tới khi bạn xác nhận.**

> [!note] 📝 So sánh dễ hiểu
> Giống kiến trúc sư trước khi vẽ nhà. Ông ta không hỏi "anh thích nhà thế nào?" rồi vẽ luôn. Ông hỏi một loạt: mấy người ở, hướng nào, ngân sách bao nhiêu — hỏi hết những gì **trả lời được ngay**. Chuyện "phòng ngủ tầng 2 kê giường đâu" phải đợi bạn chốt có tầng 2 hay không đã. Đúng cái frontier đó.

---
## 🧪 `tdd` — ví dụ về "skill là reference, không phải script"
Skill `tdd` không phải danh sách bước. Nó tự mô tả:

> "This skill is the reference that makes that loop produce tests worth keeping: what a good test is, where tests go, the anti-patterns, and the rules of the loop."

Khái niệm trung tâm là **seam** — biên công khai mà bạn quan sát hành vi từ bên ngoài. Luật gắt nhất:

> "**Test only at pre-agreed seams.** Before writing any test, write down the seams under test and confirm them with the user. No test is written at an unconfirmed seam."

Ba anti-pattern nó chặn (nguyên văn tên gọi trong skill):

| Anti-pattern | Dấu hiệu nhận biết |
|---|---|
| **Implementation-coupled** | Test vỡ khi refactor dù hành vi không đổi |
| **Tautological** | Assertion tính lại giá trị kỳ vọng đúng theo cách code tính → luôn pass |
| **Horizontal slicing** | Viết hết test rồi mới viết hết code → test verify hành vi *tưởng tượng* |

Ví dụ tautological, dịch sang JS trong context Shopify app:

```js
// ❌ Tautological — assertion tự tính lại theo đúng công thức của code
const points = calcPoints(order);
expect(points).toBe(Math.floor(order.total * RATE)); // pass bằng cách xây dựng

// ✅ Giá trị kỳ vọng đến từ nguồn độc lập: một ví dụ đã tính tay / lấy từ spec
expect(calcPoints({ total: 250_000 })).toBe(25); // spec: 10k VND = 1 point
```

Và nó bắt làm **vertical slice**: một test → một implementation → lặp, mỗi test là một *tracer bullet* phản ứng theo thứ vòng trước vừa dạy được.

---
## 📦 Cài đặt — hai đường, hai triết lý
README nói thẳng sự khác nhau, và cảnh báo đừng cài cả hai:

> "Pick one: installing both leaves you with every skill twice."

**1. Claude Code plugin — "subscribe rather than fork"** (bundle read-only, tự update khi tác giả ship):
```bash
claude plugins install mattpocock-skills
```
Hoặc trong session: `/plugin install mattpocock-skills`. Nó nằm trong marketplace chính thức của Claude Code nên không phải add marketplace trước.

**2. skills.sh — "copies editable skill files into your project"** (bạn sở hữu file, sửa thoải mái, không có gì tự đổi sau lưng):
```bash
npx skills@latest add mattpocock/skills
npx skills update   # kéo bản mới khi bạn muốn
```
Installer cho chọn lấy skill nào — README nhấn: **nhớ tick `setup-matt-pocock-skills`**.

**3. Chạy một lần mỗi repo:**
```
/setup-matt-pocock-skills
```
Nó hỏi 3 thứ: dùng issue tracker nào (GitHub / Linear / file local), bạn gắn label gì khi triage, và lưu docs sinh ra ở đâu.

---
## 🗺️ Bảng skill (rút gọn từ README)

**Engineering — user-invoked** *(bạn phải tự gõ)*

| Skill | Làm gì |
|---|---|
| `ask-matt` | Router: hỏi xem tình huống này nên dùng skill nào |
| `grill-with-docs` | Grilling + dựng domain model, cập nhật `CONTEXT.md` và ADR ngay trong lúc hỏi |
| `to-spec` | Biến hội thoại hiện tại thành spec, đẩy lên issue tracker (không phỏng vấn lại) |
| `to-tickets` | Bẻ plan/spec thành các ticket tracer-bullet, khai báo rõ cạnh blocking |
| `implement` | Build theo spec/ticket, lái `/tdd` ở các seam đã chốt, kết bằng `/code-review` |
| `wayfinder` | Lập bản đồ khối việc lớn hơn 1 session agent, dạng decision ticket, gỡ từng cái |
| `triage` | Đẩy issue qua state machine các vai trò triage |
| `improve-codebase-architecture` | Quét codebase tìm cơ hội "deepening", xuất report HTML để bạn chọn |

**Engineering — model-invoked** *(agent tự với tới được)*

| Skill | Làm gì |
|---|---|
| `tdd` | Red-green-refactor, một vertical slice mỗi vòng |
| `code-review` | Review diff theo 2 trục: **Standards** (chuẩn repo + Fowler smell) và **Spec** (có làm đúng issue gốc không), chạy sub-agent song song để 2 trục không nhiễm nhau |
| `diagnosing-bugs` | Vòng chẩn đoán có gate từng phase: dựng feedback loop đỏ → minimise → hypothesise → instrument → fix → regression test |
| `codebase-design` | Từ vựng chung để thiết kế **deep module**: nhiều hành vi sau một interface nhỏ |
| `domain-modeling` | Chủ động mài domain model: chất vấn thuật ngữ, ép edge case, viết ADR |
| `research` | Điều tra một câu hỏi từ nguồn primary, xuất file Markdown có trích dẫn, chạy nền |
| `prototype` | Prototype vứt đi để trả lời 1 câu hỏi thiết kế |
| `resolving-merge-conflicts` | Gỡ conflict từng hunk theo *intent*, và **không bao giờ `--abort`** |
| `wizard` | Sinh bash wizard tương tác cho các bước chỉ con người làm được (provision hạ tầng, set CI secret…) |

**Productivity**

| Skill | Loại | Làm gì |
|---|---|---|
| `grill-me` | user | Bị phỏng vấn không thương tiếc về plan/design |
| `handoff` | user | Nén hội thoại thành handoff doc cho agent khác tiếp tục |
| `teach` | user | Dạy bạn một khái niệm qua nhiều session, dùng thư mục hiện tại làm workspace có state |
| `to-questionnaire` | user | Biến quyết định bạn không tự trả lời được thành bảng hỏi Markdown gửi đúng người |
| `wait-what` | user | Bắn ngay khi một câu trả lời không lọt tai — agent pitch lại bằng tiếng người, dùng từ vựng `CONTEXT.md` |
| `grilling` | model | Primitive phỏng vấn nằm dưới `grill-me`, `grill-with-docs`, `triage`, `wayfinder`… |
| `writing-for-agents` | model | Cách viết tài liệu cho agent: skill, `AGENTS.md`/`CLAUDE.md`, mọi doc agent đọc qua pointer |

---
## 🗣️ `CONTEXT.md` — kỹ thuật tác giả tự đánh giá cao nhất
Vấn đề #2 trong README: agent bị thả vào project, phải tự đoán jargon, nên *"they use 20 words where 1 will do"*.

Cách sửa: một file từ vựng chung. Ví dụ README đưa ra:

- **BEFORE**: "There's a problem when a lesson inside a section of a course is made 'real' (i.e. given a spot in the file system)"
- **AFTER**: "There's a problem with the materialization cascade"

Lợi ích README liệt kê, không chỉ mỗi ngắn gọn:
- Biến, hàm, file được **đặt tên nhất quán** theo ngôn ngữ chung đó
- Codebase **dễ điều hướng hơn cho agent**
- Agent **tốn ít token thinking hơn**, vì có sẵn ngôn ngữ cô đọng

Tác giả viết về `grill-with-docs`: *"It might be the single coolest technique in this repo."*

---
## 🛠️ Áp vào công việc thế nào
- **`CONTEXT.md` là thứ nên làm đầu tiên cho app loyalty.** Domain của Joy Loyalty đầy từ dễ hiểu nhầm: *point* vs *credit*, *tier* vs *segment*, *earn rule* vs *reward*, *redeem* vs *issue*. Không có file này, mỗi session bạn lại giải thích lại từ đầu, và agent đặt tên biến mỗi chỗ một kiểu.
- **`grill-me` trước mọi feature đụng tới tiền/điểm.** Đây là chỗ misalignment đắt nhất: build xong mới phát hiện hiểu sai luật tích điểm thì phải migrate dữ liệu khách hàng thật.
- **Luật "test only at pre-agreed seams" hợp với app Firebase.** Seam tự nhiên trong stack của mình là ranh giới HTTP function / callable, không phải hàm nội bộ:
  ```js
  // ✅ Seam: hành vi quan sát được qua interface công khai của function
  const res = await earnPointsHandler({ shop, orderId, total: 250_000 });
  expect(res.pointsAwarded).toBe(25);

  // ❌ Test vào ruột — vỡ ngay lần refactor đầu tiên
  expect(_internalRoundingHelper(250_000)).toBe(25);
  ```
- **Cân nhắc context load trước khi cài cả bộ.** 29 skill nhưng chỉ nhóm model-invoked mới ăn token thường trực. Nếu dùng `npx skills add`, installer cho chọn — lấy đúng cái mình dùng, phần user-invoked thì thoải mái vì tốn 0 token.
- **Đối chiếu với thứ đã có trong vault:** [[0-ECC - Agent Harness OS cho Claude Code]] đi hướng ngược lại hoàn toàn — 286 skill, hook, memory, security scan, tức là hệ thống lớn "cài một lần rồi sống trong đó". Repo này là 29 mảnh rời để bạn tự ghép. Đọc `SKILL-MECHANICS.md` ở đây rồi mới quyết cài ECC full hay không thì sáng nước hơn. Cùng tinh thần "đừng xây thừa" với [[0-Ponytail - Lazy Senior Dev cho AI Agent]].

---
## 📚 Tham khảo
- 🔥 [mattpocock/skills — README](https://github.com/mattpocock/skills) — 4 failure mode mà bộ skill này trị, bảng skill đầy đủ chia user-invoked/model-invoked, 2 đường cài kèm lời cảnh báo đừng cài cả hai.
- 🔥 [`.agents/invocation.md`](https://github.com/mattpocock/skills/blob/main/.agents/invocation.md) — file quan trọng nhất repo: định nghĩa trục user-invoked vs model-invoked, invariant "user-invoked không gọi được user-invoked", và convention `Call the Skill tool with "..."`.
- [`writing-for-agents/SKILL-MECHANICS.md`](https://github.com/mattpocock/skills/blob/main/skills/productivity/writing-for-agents/SKILL-MECHANICS.md) — đánh đổi context load vs cognitive load, khi nào tách skill mới, router skill là gì. Ngắn (22 dòng) nhưng đậm đặc.
- [`skills/productivity/grilling/SKILL.md`](https://github.com/mattpocock/skills/blob/main/skills/productivity/grilling/SKILL.md) — toàn văn cơ chế design tree / frontier / rounds, kèm format câu hỏi.
- [`skills/engineering/tdd/SKILL.md`](https://github.com/mattpocock/skills/blob/main/skills/engineering/tdd/SKILL.md) — định nghĩa seam, 3 anti-pattern, luật của vòng red-green; có `tests.md` và `mocking.md` đi kèm.
- [`.agents/adr/`](https://github.com/mattpocock/skills/tree/main/.agents/adr) — ADR của chính repo (vì sao ship dạng Claude Code plugin, vì sao chỉ trỏ setup khi là hard dependency). Đọc để thấy cách viết ADR thật, ngắn.
- [Ví dụ `CONTEXT.md` thật](https://github.com/mattpocock/course-video-manager/blob/076a5a7a182db0fe1e62971dd7a68bcadf010f1c/CONTEXT.md) — README trỏ tới file này làm mẫu shared language.

---
## ✅ Checklist
- [ ] Hiểu trục **user-invoked vs model-invoked** và cái giá của mỗi bên (token vs trí nhớ)
- [ ] Nhớ invariant: user-invoked **không** gọi được user-invoked khác; shared reference phải đẩy ra ngoài
- [ ] Chỉ chọn 1 đường cài (plugin hoặc `npx skills add`), không cài cả hai
- [ ] Chạy `/setup-matt-pocock-skills` một lần cho mỗi repo
- [ ] Dựng `CONTEXT.md` cho domain loyalty trước khi làm gì khác
- [ ] Dùng `grill-me` / `grill-with-docs` trước mọi thay đổi đụng điểm & reward
- [ ] Chốt seam với người trước khi viết test, không test vào hàm nội bộ
- [ ] Tránh 3 anti-pattern: implementation-coupled, tautological, horizontal slicing
- [ ] Khi tự viết skill: description model-facing thì giàu trigger, human-facing thì 1 dòng gọn
- [ ] Khai báo dependency bằng `Call the Skill tool with "<name>"`, mỗi lần một skill
