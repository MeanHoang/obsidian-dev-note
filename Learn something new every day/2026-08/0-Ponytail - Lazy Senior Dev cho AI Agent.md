# 0 — Ponytail: bắt AI agent "lười" như senior dev

> [!quote] 💬
> "The best code is the code you never wrote." — tagline của [ponytail](https://github.com/DietrichGebert/ponytail)

---
## 🎯 Ponytail là gì
[DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail) là một **agent skill / plugin** (bộ instruction cắm vào AI coding agent) ép agent chọn giải pháp *lười nhất mà vẫn chạy đúng*, thay vì tự dựng abstraction thừa.

| Thông tin | Giá trị |
|---|---|
| Ngôn ngữ | JavaScript · MIT license |
| Star | ~105.5k ⭐ (repo tạo 12/06/2026) |
| Hỗ trợ | 20+ agent: Claude Code, Codex, Copilot, Cursor, Windsurf, Cline, Gemini/Antigravity, Grok, OpenCode, Kiro… |
| Topic | `yagni`, `agent-skills`, `prompt-engineering` |

Điểm mấu chốt: nó **không** bảo agent "viết ít dòng hơn" (kiểu đó agent sẽ nén code thành thứ khó đọc). Nó ép agent đi qua một **decision ladder** — thang quyết định — trước khi gõ dòng code đầu tiên.

> [!note] 📝 So sánh dễ hiểu
> Giống thuê thợ sửa vòi nước. Thợ mới ra nghề thấy vòi rỉ liền đề xuất **thay toàn bộ hệ thống ống**, lắp thêm bộ lọc, đi lại đường nước "cho sau này dễ nâng cấp". Thợ lành nghề nhìn 5 giây rồi **vặn lại cái ron cao su 2.000đ** — xong việc, về sớm. Ponytail là cái bản năng "vặn ron trước đã" nhét vào đầu AI agent.

---
## 🪜 The Ladder — dừng ở nấc đầu tiên chịu được tải
Đây là phần lõi của skill, agent phải leo theo đúng thứ tự:

1. **Cái này có cần tồn tại không?** Nhu cầu suy đoán → bỏ, nói 1 dòng lý do. (YAGNI — *You Aren't Gonna Need It*)
2. **Codebase đã có sẵn chưa?** Helper/util/pattern đã nằm đâu đó → tái dùng. Repo ghi rõ: *viết lại thứ đã có cách vài file là loại slop phổ biến nhất*.
3. **Stdlib làm được không?** Có thì dùng.
4. **Native platform feature phủ được chưa?** `<input type="date">` thay vì thư viện date picker; CSS thay vì JS; DB constraint thay vì check ở tầng app.
5. **Dependency đã cài sẵn giải quyết được không?** Đừng thêm package mới cho thứ vài dòng code làm được.
6. **Gói được vào 1 dòng không?** Thì 1 dòng.
7. **Chỉ đến lúc đó:** viết phần code tối thiểu chạy được.

> [!warning] ⚠️ Ladder rút ngắn *lời giải*, không rút ngắn *việc đọc hiểu*
> Repo nhấn mạnh: đọc hiểu task và trace luồng thật end-to-end **trước** rồi mới leo thang. "Diff nhỏ nhất đặt sai chỗ không phải lười, đó là bug thứ hai." Bug fix cũng vậy — grep hết caller, sửa ở chỗ chung, chứ không vá đúng cái path mà ticket nêu.

---
## 🎚️ 3 mức intensity
| Level | Hành vi |
|---|---|
| **lite** | Vẫn build đúng thứ được yêu cầu, nhưng nêu 1 dòng phương án lười hơn để user tự chọn. |
| **full** *(mặc định)* | Áp ladder đầy đủ. Stdlib & native trước. Diff ngắn nhất, giải thích ngắn nhất. |
| **ultra** | YAGNI cực đoan. Xoá trước khi thêm. Ship one-liner rồi chất vấn luôn phần yêu cầu còn lại. |

Ví dụ repo đưa ra với request *"Add a cache for these API responses"*:
- **lite:** "Đã thêm cache. FYI: `functools.lru_cache` làm được trong 1 dòng nếu bạn không muốn tự quản cache class."
- **full:** "`@lru_cache(maxsize=1000)` lên hàm fetch. Skipped custom cache class, thêm khi lru_cache thật sự không đủ."
- **ultra:** "Chưa cache cho tới khi profiler bảo cần. Lúc đó: `@lru_cache`. TTL cache class tự viết là một cái nông trại bug có kèm hit rate."

---
## 💻 Bad ❌ vs Good ✅
Request: *"Cho user chọn ngày sinh trong form onboarding"* — code JS/React trong app Shopify.

**❌ Agent chưa có ponytail** — nhảy thẳng xuống nấc 7 của ladder:
```js
// Tự dựng abstraction cho đúng 1 use case
import DatePickerFactory from './date-picker-factory'; // factory cho 1 loại picker
import { DateFormatStrategy } from './strategies';     // interface 1 implementation

const picker = DatePickerFactory.create({
  strategy: new DateFormatStrategy('DD/MM/YYYY'),
  locale: config.locale,   // config cho giá trị không bao giờ đổi
  theme: config.theme,
});
// + 1 dependency date picker 40kb, + 3 file mới, + 1 file config
```

**✅ Agent có ponytail** — dừng ở nấc 4 (native platform):
```js
// Native input, trình duyệt lo luôn locale + keyboard + a11y
<input type="date" name="birthday" max={today} required />
// skipped: date picker lib + factory. Thêm khi cần range picker đa tháng.
```

> [!tip] 💡 Format output của ponytail
> `[code] → skipped: [X], add when [Y].` — code trước, tối đa 3 dòng giải thích. Repo nói thẳng: *"đoạn văn nào đi bảo vệ một simplification chính là complexity tuồn ngược vào dưới dạng văn xuôi."*

---
## 🚫 Khi nào ponytail KHÔNG được lười
Đây là phần quan trọng nhất khi đưa vào app production:
- **Input validation ở trust boundary** — không bao giờ cắt.
- **Error handling chống mất dữ liệu** — không cắt.
- **Security** và **accessibility cơ bản** — không cắt.
- Bất cứ thứ gì user yêu cầu tường minh — user đòi bản đầy đủ thì build, không cãi lại.
- Logic không tầm thường (branch, loop, parser, path tiền/security) phải để lại **đúng 1 check chạy được** — cái nhỏ nhất mà sẽ fail nếu logic hỏng. Không framework, không fixture.

Có convention riêng cho chỗ cố tình cắt góc: comment `ponytail:` ghi rõ trần chịu tải + đường nâng cấp, ví dụ:
```js
// ponytail: global lock, chuyển sang per-account lock nếu throughput thành vấn đề
```

---
## 📊 Benchmark — đọc số cho tỉnh táo
Repo có 2 bộ số, và tự nói rõ bộ nào mới đáng tin:

**Single-shot (3 model Claude × 5 task, median 10 run, 13/06/2026):**

| arm | Haiku | Sonnet | Opus |
|---|--:|--:|--:|
| baseline (không skill) | 518 | 693 | 256 |
| caveman | 116 | 120 | 67 |
| **ponytail** | **39** | **44** | **51** |
*(số dòng code; ponytail cũng rẻ hơn 42-75% và nhanh hơn 3-6x ở bộ này)*

> [!warning] ⚠️ Chính repo cảnh báo con số trên bị thổi phồng
> Baseline single-shot trả lời kèm nhiều option + bình luận, nên phép đếm LOC tính cả văn xuôi. Sau [issue #126](https://github.com/DietrichGebert/ponytail/issues/126), tác giả cập nhật (18/06/2026): con số **honest** đến từ [agentic benchmark](https://github.com/DietrichGebert/ponytail/tree/main/benchmarks/agentic) chạy session Claude Code thật trên repo public thật — giảm **60-94%** ở feature có bẫy over-build (component tự viết vs native input), **hoà** ở code vốn đã tối giản, **không bao giờ viết nhiều hơn**, và giữ **100% safe** trong khi prompt "one-liner" trần làm rơi mất guard.

Ngoài ra: skill này ăn theo khả năng follow instruction của model — repo ghi rõ nó **transfer kém sang model local nhỏ** (llama3.2) vì ladder nhiều bước không được tuân thủ ổn định.

---
## ⚙️ Cài & dùng trong Claude Code
Gửi **2 prompt riêng** (repo lưu ý gộp 1 lần sẽ không ăn):
```
/plugin marketplace add DietrichGebert/ponytail
```
```
/plugin install ponytail@ponytail
```
Cần `node` nằm trong PATH của non-interactive shell (lưu ý cho ai xài nvm/Nix) vì plugin chạy 2 lifecycle hook nhỏ.

**Bộ command:**

| Command | Làm gì |
|---|---|
| `/ponytail [lite\|full\|ultra\|off]` | Bật/đổi mức độ lười |
| `/ponytail-review` | Soi diff hiện tại, chỉ ra chỗ over-engineer |
| `/ponytail-audit` | Quét toàn repo |
| `/ponytail-debt` | Gom các shortcut đã đánh dấu `ponytail:` thành một ledger, để "later" không thành "never" |
| `/ponytail-gain` | Xem scoreboard impact từ benchmark |
| `/ponytail-help` | Quick reference |

Với Cursor/Windsurf/Cline/Kiro: chỉ là bản instruction-only — copy file rule vào project, có ruleset always-on nhưng **không có command**.

---
## 🛠️ Áp vào công việc thế nào
- **Trị đúng bệnh của agent trong app Shopify:** agent hay đẻ ra service layer/factory cho một use case duy nhất. Nấc 2 (đã có trong codebase chưa) và nấc 5 (dependency đã cài) là hai nấc cắt được nhiều rác nhất khi codebase đã lớn.
- **Chạy `/ponytail-review` lên diff trước khi mở PR** — rẻ, không đụng code, chỉ đọc.
- **Nấc 4 (native platform) hợp với Polaris:** component Polaris có sẵn thường phủ đủ, không cần tự wrap thêm một lớp component nữa.
- **Cẩn thận vùng không được lười:** webhook handler, tính điểm loyalty, redeem reward — đây là path tiền, giữ nguyên validation và error handling.
- **Đối chiếu với harness sẵn có:** xem [[parallel-agent-workflow-research]] trước khi nhét thêm một always-on ruleset vào mọi prompt — ruleset always-on nào cũng tốn token mỗi turn.

---
## 📚 Tham khảo
- 🔥 [DietrichGebert/ponytail — README](https://github.com/DietrichGebert/ponytail) — repo gốc: ladder, install cho 20+ agent, bảng command, triết lý "code you never wrote scales infinitely".
- [skills/ponytail/SKILL.md](https://github.com/DietrichGebert/ponytail/blob/main/skills/ponytail/SKILL.md) — toàn văn skill: ladder 7 nấc, rules, 3 mức intensity, mục "when NOT to be lazy". Đọc file này là hiểu 90%.
- [benchmarks/README.md](https://github.com/DietrichGebert/ponytail/blob/main/benchmarks/README.md) — cách reproduce bằng promptfoo/Ollama + bảng số LOC/cost/latency, kèm đoạn tự đính chính số liệu.
- [Issue #126](https://github.com/DietrichGebert/ponytail/issues/126) — issue chỉ ra benchmark single-shot thổi phồng kết quả; đáng đọc như case study về cách nhận phản biện.
- [JuliusBrussee/caveman](https://github.com/JuliusBrussee/caveman) — skill "arm" thứ ba trong benchmark, tối giản *lời nói* của agent (ponytail lo code, caveman lo prose); repo khuyến nghị dùng kèm.

---
## ✅ Checklist
- [ ] Hiểu ladder 7 nấc và biết dừng ở nấc đầu tiên đủ dùng
- [ ] Nhớ: ladder rút ngắn lời giải, KHÔNG rút ngắn việc đọc hiểu code
- [ ] Cài plugin bằng 2 prompt riêng, kiểm tra `node` có trong PATH
- [ ] Mặc định để `full`; chỉ `ultra` khi cố tình muốn bị chất vấn ngược
- [ ] Chạy `/ponytail-review` lên diff trước khi mở PR
- [ ] Không để agent cắt validation / error handling / security / a11y
- [ ] Đánh dấu chỗ cắt góc bằng comment `ponytail:` + đường nâng cấp
- [ ] Định kỳ `/ponytail-debt` để dọn các "later" đã hứa
- [ ] Đọc số benchmark theo bản agentic (60-94%), không theo bản single-shot
