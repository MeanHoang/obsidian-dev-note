---
tags:
  - ai
  - ai-coding
  - workflow
  - agent
  - clean-code
  - moc
source: https://www.youtube.com/watch?v=zcLPGC-tvgk
speaker: Robert C. Martin (Uncle Bob)
host: Matt Pocock
channel: Matt Pocock
duration: 56:39
uploaded: 2026-08-19
created: 2026-08-20
---

# LIVE: Uncle Bob on Software Fundamentals in the Age of AI

Livestream 56 phút trên kênh **Matt Pocock**, khách mời **Robert C. Martin (Uncle Bob)** — tác giả *Clean Code*. Mô tả chính thức của video:

> "Matt Pocock talks with Robert C. Martin (Uncle Bob) about why software fundamentals still matter when working with coding agents, where they agree, and where they disagree."

Nội dung: Uncle Bob kể lại hành trình từ tháng 12/2025 khi lần đầu thử agent, tới workflow hiện tại — một **gauntlet 5 agent** với deterministic tools thay vì prompt dài.

> ⚠️ Video là livestream, **không có chapter chính thức**. Timestamp bên dưới do mình tự cắt theo mạch nội dung, dựa trên transcript auto-caption của YouTube.

---

## Mục lục theo timestamp

| Timestamp | File | Nội dung |
|---|---|---|
| `00:00–10:00` | [[01 - Uncle Bob gặp agent - CRAP score và mutation testing sống lại]] | Bathrobe rant, Grok đầu tiên, hai ý tưởng cũ bất khả thi giờ khả thi |
| `10:20–12:20` | [[02 - Vì sao dog do giết agent]] | Agent cũng chết vì code bẩn, chỉ khác ngưỡng |
| `12:22–17:32` | [[03 - Steering thua deterministic tools - Lost in the middle]] | Rule = "guidelines", lost in the middle, đổi prompt lấy loop |
| `17:32–25:30` | [[04 - Gauntlet 5 agent - Specifier den QA]] | specifier → coder → cleaner → hardener → QA, trajectory |
| `25:31–31:20` | [[05 - Module structure va deep modules]] | Architecture viewer, dependency spec file, Ousterhout |
| `31:21–35:35` | [[06 - Sua gi trong Clean Code - Threshold vs discipline]] | Nới threshold được, ép discipline thì không |
| `35:35–44:16` | [[07 - Chong spec-driven - Cost of change ve gan 0]] | Waterfall quay lại, ẩn dụ xây nhà $1, spec là ephemeral |
| `44:16–56:39` | [[08 - Hoc strategic programming va vi sao fundamentals van dung]] | Tactical vs strategic, "become the agent", abstraction ladder |

---

## Luận điểm một câu

> **Fundamentals vẫn đúng vì chúng là cách tổ chức độ phức tạp — và model được mô hình hoá theo con người, nên nó cũng cần đúng cách tổ chức đó.**

Uncle Bob `[53:29–54:14]`:

> "Software is the most complicated thing that humans have ever attempted to do... And therefore the fundamentals are the way of organizing that complexity into a form that can be conceived not just by humans, but by our models as well. **Since our models are modeled after humans after all.**"

---

## Sự dịch chuyển lớn nhất trong tư duy Uncle Bob

Đây là điểm gây bất ngờ nhất của buổi nói chuyện — tác giả *Clean Code* **không đọc code của agent nữa**:

```
NGÀY XƯA (con người viết)          BÂY GIỜ (agent viết)
─────────────────────────          ────────────────────
Người viết code           →        Agent viết code (nhanh)
Người review code         →        Deterministic tools review
Người chạy test           →        Hardener chạy mutation testing
Người là bottleneck chất  →        Người là bottleneck TỐC ĐỘ
lượng                              → phải tự rút ra khỏi vòng lặp
```

`[09:17–09:39]`:

> "They are fast with code. I am slow with code. So I'm going to let them have the code and I'm going to deal with the stuff around that to make sure it's all okay."

**Dịch:** *"Chúng nhanh với code. Tôi chậm với code. Nên tôi sẽ để chúng cầm code, còn tôi lo phần xung quanh để đảm bảo mọi thứ ổn."*

> 💡 **Ý là:** Đây **không** phải "đừng nhìn code nữa" kiểu vibe coding. Ông ấy thay việc đọc code bằng **đo code bằng máy** — CRAP score, mutation testing, dependency checker. Trách nhiệm về chất lượng không mất đi, nó chuyển từ *mắt người* sang *tool xác định*.

---

## Sơ đồ gauntlet

```
   Human document (viết tay, ngắn)
        ↓
   SPECIFIER  → sinh 2 file: Gherkin (given/when/then) + QA procedure
        ↓
   CODER      → unit test + code + làm Gherkin pass  (để lại "a horrible mess")
        ↓
   CLEANER    → chạy CRAP analysis + code review, dọn mess
        ↓
   HARDENER   → mutation testing, "absolutely merciless", 100% coverage
        ↓
   QA AGENT   → biến QA document thành script chạy được qua UI
        ↓
   Kết quả deterministic

   Chi phí: 1 agent làm 5 phút (kết quả đáng ngờ) → gauntlet ~1 tiếng
   So sánh: người làm nửa ngày → vẫn lãi 4-5x, chất lượng cao hơn nhiều
```

---

## Ba ý đắt nhất

1. **Steering (prompt/rules) sẽ bị lãng quên, deterministic tool thì không.** Rule nằm giữa context window là rule chết. `[[03 - Steering thua deterministic tools - Lost in the middle]]`
2. **Nới threshold cho agent được, ép discipline của người lên agent thì không.** Uncle Bob — người truyền đạo TDD — không bắt agent làm TDD. `[[06 - Sua gi trong Clean Code - Threshold vs discipline]]`
3. **Cost of change về gần 0 → upfront planning lại thành lãng phí như thời waterfall.** `[[07 - Chong spec-driven - Cost of change ve gan 0]]`

---

## Chỗ Matt và Bob KHÔNG đồng ý

Video được quảng cáo là "where they agree, and where they disagree". Điểm bất đồng rõ nhất:

| Chủ đề | Matt Pocock | Uncle Bob |
|---|---|---|
| Multi-agent | Nghi ngờ; chỉ chấp nhận **implementer + reviewer** (2 vai) | Chạy hẳn **5 vai** nối tiếp, đang thử agent nói chuyện với nhau |
| Spec-driven | Ghét cái **label**, nhưng vẫn làm alignment upfront (grill session, PRD) | Bỏ hẳn; spec là **ephemeral**, không lưu repo |
| Đọc code | "**Code là chiến trường**", phải giữ handle trên code | Mục tiêu là **không phải nhìn code chút nào** |

> 💡 **Ý là:** Hai người xuất phát từ cùng một tiền đề (fundamentals vẫn đúng) nhưng đi ngược hướng ở khâu con người. Matt giữ con người ở **alignment trước** khi code; Bob đẩy con người ra **kiểm chứng sau** bằng tool. Đối chiếu với [[Workflow for AI Coding - Matt Pocock/00 - README|workflow của Matt]] để thấy rõ.

---

## Checklist áp dụng

**Dễ, làm ngay được**
- [ ] Rút CLAUDE.md / AGENTS.md xuống **cực ngắn**, chỉ giữ 3-5 câu đầu thật sự quan trọng
- [ ] Chuyển mọi rule "nên viết code thế này" từ prompt sang **lint/test chạy được**
- [ ] Tách reviewer sang session riêng để context sạch (Matt và Bob đồng ý điểm này)

**Trung bình**
- [ ] Thêm bước **cleaner** sau implement: agent riêng chỉ để dọn mess, không thêm feature
- [ ] Dựng **dependency spec file** — module nào được phụ thuộc module nào — + checker chạy cuối build
- [ ] Bỏ thói quen viết plan dài; chuyển sang **1-2 story rồi nhìn lại architecture**

**Nặng**
- [ ] Dựng **mutation testing** vào pipeline agent (hardener)
- [ ] Đo **CRAP score** (coverage × cyclomatic complexity), đặt ngưỡng ~6 cho agent
- [ ] Dựng **architecture viewer** tự sinh sơ đồ module + dependency, click drill-down tới code

---

## Ghi chú về transcript

Note dùng auto-caption của YouTube (ASR), nên có lỗi nhận dạng tên riêng. Mình đã sửa lại trong phần trích dẫn và ghi rõ:

| ASR nghe nhầm | Đúng là |
|---|---|
| "John Asterhow / John Ora / John Alart" | **John Ousterhout** — tác giả *A Philosophy of Software Design* |
| "Dystra" | **Edsger Dijkstra** |
| "girkin" | **Gherkin** — cú pháp given/when/then của Cucumber |
| "cyclatic complexity" | **cyclomatic complexity** |
| "Grock" | **Grok** (agent của xAI) |
| "claw.md / agents.mmd" | **CLAUDE.md / AGENTS.md** |
| "Ed Yordan" | **Ed Yourdon** |
| "dog dew / dog do" | **dog doo** — Uncle Bob gọi rác mà agent để lại |

---

## Liên quan

- [[Workflow for AI Coding - Matt Pocock/00 - README|Workflow for AI Coding — Matt Pocock]] (cùng host, cùng chủ đề, khác quan điểm)
- [[Harness trong AI là gì]]
- [[Harness design cho app chạy dài (Anthropic)]]
- [[Glossary AI]]
