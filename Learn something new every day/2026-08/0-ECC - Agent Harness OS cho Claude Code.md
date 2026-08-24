# 0 — ECC: "operating system" cho agent harness, và skill của nó chạy thế nào

> [!quote] 💬
> "Optimize the context window. Persist everything else." — [affaan-m/ECC](https://github.com/affaan-m/ECC)

---
## 🎯 ECC là gì
[affaan-m/ECC](https://github.com/affaan-m/ECC) tự mô tả là **"The agent harness performance optimization system"** — một bộ skills, agents, hooks, rules, memory và security scanner cắm vào Claude Code (và Codex, OpenCode, Cursor…). Ý tưởng gốc nằm ở một câu trong README:

> "Instead of rebuilding that process in every prompt, you install it once and make it part of how your agent works."

Quy trình mà nó cài sẵn:
```text
plan -> test -> implement -> review -> verify -> remember -> improve
```

| Thông tin | Giá trị |
|---|---|
| Repo | `affaan-m/ECC` · MIT license · ngôn ngữ chính JavaScript |
| Star / Fork | 241,921 ⭐ · 36,671 forks (số ngày 22/08/2026) |
| Vòng đời | Tạo 18/01/2026 · push gần nhất 21/08/2026 |
| Topic | `ai-agents`, `anthropic`, `claude`, `claude-code`, `developer-tools`, `llm`, `mcp`, `productivity` |
| Quy mô | **68 agents · 286 skills · 94 legacy command shims** + hooks, rules, memory, AgentShield |

> [!note] 📝 So sánh dễ hiểu
> Hình dung cái bếp nhà bạn. **Rule** là mấy tờ giấy dán tường: "rửa tay trước khi nấu", "không để dao trong bồn" — lúc nào cũng nằm trước mắt, nhìn hoài, chiếm chỗ vĩnh viễn. **Skill** là mấy cuốn công thức xếp trong ngăn kéo: chỉ khi nào định làm bánh flan bạn mới rút đúng cuốn đó ra, đọc, làm xong cất lại. **Agent** là ông phụ bếp bạn sai đi chợ — ổng có cái đầu riêng, bạn không phải nhớ giùm ổng cái danh sách. **Hook** là cái chuông báo khói: nó kêu tự động, không cần ai nhớ tới nó.
>
> Context window của model là mặt bàn bếp. Dán quá nhiều giấy lên tường thì vẫn còn chỗ nấu, nhưng trải hết 286 cuốn công thức ra bàn thì hết chỗ thái rau. Toàn bộ thiết kế skill của ECC là để **giữ mặt bàn trống**.

README nói thẳng ý này: *"Keeping those jobs separate is how ECC adds capability without dumping the entire repository into every session."*

---
## 🧩 Skill hoạt động ra sao — phần lõi

### 1. Skill là cái gì, dưới góc nhìn file
Theo [docs/SKILL-DEVELOPMENT-GUIDE.md](https://github.com/affaan-m/ECC/blob/main/docs/SKILL-DEVELOPMENT-GUIDE.md), skill là **"knowledge modules that Claude Code loads based on context"** — 4 loại nội dung: domain expertise, workflow definitions, reference material, context injection. Và một câu phân định rất quan trọng:

> "Unlike **agents** (specialized subassistants) or **commands** (user-triggered actions), skills are passive knowledge that Claude Code references when relevant."

Cấu trúc thư mục của một skill (nguyên văn từ guide):
```text
skills/
└── your-skill-name/
    ├── SKILL.md           # Required: Main skill definition
    ├── examples/          # Optional: Code examples
    │   ├── basic.ts
    │   └── advanced.ts
    └── references/        # Optional: External references
        └── links.md
```

Bắt buộc chỉ có đúng **1 file**: `SKILL.md`. Validator `scripts/ci/validate-skills.js` chỉ kiểm tra: mỗi subdirectory trong `skills/` phải có `SKILL.md` và file đó không rỗng.

### 2. Frontmatter — phần model "nhìn thấy" trước
Đây là frontmatter thật của [`skills/search-first/SKILL.md`](https://github.com/affaan-m/ECC/blob/main/skills/search-first/SKILL.md):

```yaml
---
name: search-first
description: Research-before-coding workflow. Search for existing tools, libraries, and patterns before writing custom code. Invokes the researcher agent.
metadata:
  origin: ECC
---
```

Và của [`skills/strategic-compact/SKILL.md`](https://github.com/affaan-m/ECC/blob/main/skills/strategic-compact/SKILL.md) — để ý cách viết `description`:

```yaml
---
name: strategic-compact
description: Suggests manual context compaction at logical intervals to preserve context through task phases rather than arbitrary auto-compaction. Use when a session is approaching a context limit and a task phase is a natural place to compact.
metadata:
  origin: ECC
---
```

Bảng field của guide:

| Field | Bắt buộc | Mô tả (nguyên văn guide) |
|---|---|---|
| `name` | Yes | Lowercase, hyphenated identifier (e.g., `react-patterns`) |
| `description` | Yes | One-line description for skill list and **auto-activation** |
| `origin` | No | Source identifier (e.g., `ECC`, `community`, project name) |
| `tags` | No | Array of tags for categorization |
| `version` | No | Skill version for tracking updates |

> [!tip] 💡 `description` chính là cơ chế discovery
> Guide ghi rõ `description` được dùng cho **auto-activation**. Nghĩa là chỉ dòng `name` + `description` của mỗi skill được đưa vào context; phần thân SKILL.md dài hàng trăm dòng **chưa** được nạp. Model đọc cái mục lục mỏng đó, thấy task khớp thì mới mở đúng file ra đọc — đây chính là **progressive disclosure**. Bởi vậy `description` phải viết dạng "Use when…", như ví dụ `strategic-compact` ở trên: nó không tả skill làm gì cho đẹp, nó tả **khi nào cần rút cuốn công thức này ra**.

### 3. Discovery path — chỗ dễ sai nhất khi cài tay
README nhắc đúng ý này **ba lần** ở ba chỗ khác nhau, kèm comment ngay trong lệnh cài:

```bash
# Core/general skills only (Claude Code loads skills from direct children
# of ~/.claude/skills; do not nest manual installs under ~/.claude/skills/ecc/)
mkdir -p ~/.claude/skills
cp -r .agents/skills/* ~/.claude/skills/
cp -r skills/search-first ~/.claude/skills/
```

Tức là: `~/.claude/skills/search-first/SKILL.md` ✅, còn `~/.claude/skills/ecc/search-first/SKILL.md` ❌ — Claude Code không thấy. Bản cài project-local thì là `.claude/skills/<skill-name>/`.

[docs/SKILL-PLACEMENT-POLICY.md](https://github.com/affaan-m/ECC/blob/main/docs/SKILL-PLACEMENT-POLICY.md) chia skill thành 4 loại theo nguồn gốc:

| Type | Root path | Ship kèm repo? | Provenance |
|---|---|---|---|
| **Curated** | `skills/` (trong repo) | Yes | Không cần, dùng `origin` trong frontmatter |
| **Learned** | `~/.claude/skills/learned/` | No | Bắt buộc có `.provenance.json` |
| **Imported** | `~/.claude/skills/imported/` | No | Bắt buộc có `.provenance.json` |
| **Evolved** | `~/.claude/homunculus/evolved/skills/` (global) hoặc `projects/<hash>/evolved/skills/` | No | Kế thừa từ instinct nguồn |

File `.provenance.json` bắt buộc 4 field: `source`, `created_at`, `confidence` (0–1), `author`. Điểm hay: skill do máy tự sinh **không bao giờ bị commit ngược vào repo** — install manifest chỉ trỏ tới `skills/` curated.

### 4. Skill được invoke bằng những đường nào
README, mục "Agents, skills, hooks, and rules explained":

> "Skills are the primary workflow surface. They can be invoked directly, suggested automatically, and reused by agents."

Ba đường vào, cộng thêm hai đường phụ theo guide (*"A command references a skill"*, *"An agent needs domain knowledge"*):

| Đường vào | Ví dụ thật trong ECC |
|---|---|
| Gọi trực tiếp | `/ecc:configure-ecc` (namespaced sau khi cài plugin) |
| Gợi ý tự động theo context | `description` khớp task → model tự mở SKILL.md |
| Agent gọi lại skill | `mle-workflow` skill + `mle-reviewer` agent |
| Command shim trỏ về skill | `/tdd` → *"Prefer the tdd-workflow skill"*, `/verify` → `verification-loop` skill |
| Skill gọi ngược ra agent | `search-first` ghi trong description: *"Invokes the researcher agent"* |

README nói rõ hướng đi: 94 commands là *"convenient entry points while ECC moves to a skills-first surface"*, các short-name shim đã nghỉ hưu nằm ở `legacy-command-shims/`, và *"New workflow development should land in `skills/` first."*

### 5. Bên trong thân một SKILL.md
`search-first` là ví dụ gọn nhất về "skill là workflow chứ không phải bài giảng" — nó vẽ luôn pipeline bằng ASCII:

```text
│  0. TOOL AVAILABILITY PREFLIGHT             │
│  1. NEED ANALYSIS                           │
│  2. PARALLEL SEARCH (researcher agent)      │
│  3. EVALUATE                                │
│  4. DECIDE   → Adopt / Extend / Build Custom│
│  5. IMPLEMENT                               │
```

kèm decision matrix:

| Signal | Action |
|---|---|
| Exact match, well-maintained, MIT/Apache | **Adopt** — install and use directly |
| Partial match, good foundation | **Extend** — install + write thin wrapper |
| Multiple weak matches | **Compose** — combine 2-3 small packages |

Guideline độ dài của ECC: **200–500 dòng là bình thường, tối đa 800 dòng**. Một skill = một domain; guide có bảng "focus tốt vs quá rộng": `react-hook-patterns` ✅ vs `react` ❌, `postgresql-indexing` ✅ vs `databases` ❌.

> [!warning] ⚠️ Skill là **knowledge**, không phải **runtime**
> `unified-memory` ghi ngay đầu file: *"This skill is guidance, not the Memory Vault executable."* Cài skill xong mà chưa `npm install -g ecc-universal` thì mọi lệnh `ecc memory ...` trong đó vẫn không chạy. Tương tự `strategic-compact`: phần "quyết định khi nào compact" nằm trong SKILL.md, nhưng phần **đo** thì do hook `suggest-compact.js` chạy ở PreToolUse (Edit/Write) — nó đọc `transcript_path` rồi cộng `input_tokens + cache_read_input_tokens + cache_creation_input_tokens`, ngưỡng 160k trên window 200k, 250k trên window 1M, nhắc lại mỗi 60k. Skill lo phần "nghĩ", hook lo phần "đếm".

---
## 🔀 Skills vs Agents vs Rules vs Hooks vs Instincts
Bảng này lấy nguyên từ README, và nó là bảng đáng nhớ nhất cả repo:

| Concept | What it does | Context behavior |
|---|---|---|
| **Skills** | Reusable workflows such as TDD, security review, or deep research | **Loaded when the task needs them** |
| **Agents** | Scoped workers with their own context and tool permissions | Isolate planning, implementation, and review |
| **Rules** | Durable project or language standards | **Always loaded, so install them selectively** |
| **Hooks** | Scripts triggered by harness events | **Run outside the model context** |
| **Instincts** | Patterns learned from real sessions with confidence scores | Recalled when relevant |

Đọc cột bên phải là ra chiến lược: thứ nào **always loaded** thì phải hà tiện (rules), thứ nào **on demand** thì thoải mái nhiều (skills), thứ nào **ngoài context** thì free về token (hooks). README dặn với rules: *"Start with `rules/common` plus one language or framework pack you actually use."*

Một chi tiết dễ vấp: **Claude Code plugin không phân phối được `rules`**. Cài plugin xong vẫn phải clone repo rồi copy tay:
```bash
git clone https://github.com/affaan-m/ECC.git
cd ECC
mkdir -p ~/.claude/rules/ecc
cp -R rules/common ~/.claude/rules/ecc/
cp -R rules/typescript ~/.claude/rules/ecc/  # replace with your stack
```

---
## 🔁 Skill tự sinh ra skill
Đây là chỗ ECC khác các bộ skill tĩnh: nó có hai vòng lặp tự tạo skill từ chính lịch sử làm việc của bạn.

**Vòng 1 — `/skill-create`, đọc git history:**
```bash
/skill-create                    # Analyze current repo
/skill-create --instincts        # Also generate instincts for continuous-learning-v2
```
README: *"This analyzes your git history locally and generates SKILL.md files."* Output gồm SKILL.md files, instinct collections, và pattern extraction từ commit history. Có bản GitHub App ([ecc-tools](https://github.com/apps/ecc-tools)) cho repo 10k+ commits và auto-PR.

**Vòng 2 — instincts rồi `/evolve`:** `continuous-learning-v2` quan sát session qua hook rồi đẻ ra các **instinct** — hành vi nhỏ có điểm confidence. Instinct thật trông như vầy (từ SKILL.md của skill đó):

```yaml
---
id: prefer-functional-style
trigger: "when writing new functions"
confidence: 0.7
domain: "code-style"
source: "session-observation"
scope: project
project_id: "a1b2c3d4e5f6"
project_name: "my-react-app"
---
```

Bộ lệnh:
```text
/instinct-status        # Show learned instincts with confidence
/instinct-import <file> # Import instincts from others
/instinct-export        # Export your instincts for sharing
/evolve                 # Cluster related instincts into skills
```

Khác biệt v1 → v2 (bảng trong SKILL.md): observation chuyển từ Stop hook (cuối session) sang **PreToolUse/PostToolUse** (repo ghi "100% reliable"); analysis chuyển từ main context sang **background agent (Haiku)**; granularity từ "full skills" xuống "atomic instincts"; evolution từ "direct to skill" thành **instincts → cluster → skill/command/agent**. Bản 2.1 thêm **project-scoped instincts**: pattern React ở lại project React, chỉ khi một instinct xuất hiện ở **2+ project** mới được promote lên global — chống "cross-project contamination".

> [!note] 📝 So sánh dễ hiểu
> Instinct giống mấy mẹo bạn tự rút ra sau vài lần nấu: "bếp nhà mình lửa to, hạ một nấc". Ban đầu chỉ là ghi chú lẻ, độ tin cậy thấp. Lặp lại đủ nhiều thì nó thành thói quen. `/evolve` là lúc bạn gom mười mẩu ghi chú lẻ đó lại, chép thành **một trang công thức tử tế** cất vào ngăn kéo — từ instinct thành skill.

---
## ⚠️ Đọc kỹ trước khi cài
> [!warning] ⚠️ Bốn cái bẫy thật, lấy từ chính README
> **1. Context footprint.** Bảng Platform Support ghi về Claude Code: *"The plugin advertises the installed catalog to the model; use a selective/manual profile when context footprint matters."* Cài đủ 286 skills thì cái mục lục name+description cũng tốn token mỗi session. Có đường cài chọn lọc: `./install.sh --target claude --skills tdd-workflow,security-review`, hoặc hỏi advisor trước bằng `node scripts/ecc.js consult "security reviews" --target claude`.
>
> **2. Đừng chồng install method.** *"Do not stack install methods. Installing ECC twice into the same harness can duplicate skills, commands, hooks, or configuration."* Cài plugin rồi thì **không** chạy `./install.sh --profile full` nữa.
>
> **3. Official sources only.** README có callout WARNING riêng: chỉ cài từ repo `github.com/affaan-m/ECC`, npm `ecc-universal` / `ecc-agentshield`, GitHub App, plugin slug `ecc@ecc`, và ecc.tools — *"Third-party re-uploads and unofficial mirrors are not maintained or reviewed by the project and may contain malware."*
>
> **4. Không có parity giữa các harness.** Skills format (SKILL.md + YAML frontmatter) chạy được trên Claude Code, Codex, OpenCode. Nhưng GitHub Copilot là *"instruction-only"*: **no ECC hooks, runtime agents, delegation, or native skill discovery**. Codex thì không có ECC hook runtime.

**Cài cho Claude Code** — đúng 2 lệnh, chạy bên trong Claude Code:
```text
/plugin marketplace add https://github.com/affaan-m/ECC
/plugin install ecc@ecc
```
Kiểm tra bằng `/plugin list ecc@ecc`. Nếu thấy loạn/trùng: `node scripts/ecc.js list-installed` → `doctor` → `repair` → `uninstall --dry-run`.

---
## 🛠️ Áp vào công việc thế nào
- **Tự viết skill cho Joy Loyalty trước khi nghĩ tới cài 286 cái.** Đúng công thức của guide: một skill = một domain hẹp. Ví dụ `shopify-webhook-hmac`, `shopify-graphql-bulk-operations`, `firestore-points-ledger` — chứ không phải một skill `shopify` khổng lồ (guide xếp `react` vào cột "Too broad").
- **Viết `description` theo kiểu "Use when…".** Đây là dòng duy nhất luôn nằm trong context, và là thứ quyết định skill có được gọi hay không. Ví dụ cho app Shopify:
```js
// skills/shopify-webhook-hmac/SKILL.md — frontmatter
// ---
// name: shopify-webhook-hmac
// description: Verify Shopify webhook HMAC before processing any payload. Use when adding
//   or editing a webhook route, or when webhooks return 401 in production.
// ---

// Nội dung skill nên là code copy-paste được, không phải lý thuyết:
import crypto from 'node:crypto';

function verifyShopifyHmac(rawBody, hmacHeader, secret) {
  const digest = crypto
    .createHmac('sha256', secret)
    .update(rawBody, 'utf8')   // PHẢI là raw body, không phải object đã JSON.parse
    .digest('base64');
  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(hmacHeader));
}
```
- **Chia đúng tầng cho stack JS + Firebase + GCP:** convention code JS thuần → **rule** (always-loaded, ít thôi); quy trình "deploy Cloud Function rồi verify log" → **skill** (chỉ nạp khi deploy); "chặn `console.log` lọt vào file `.js`" → **hook** (chạy ngoài context, không tốn token nào — README có sẵn ví dụ hook grep `console.log`).
- **`search-first` hợp với hệ Shopify.** Trước khi tự viết helper, bắt agent kiểm tra Polaris / `@shopify/shopify-api` đã có sẵn chưa — cùng tinh thần nấc 2 và nấc 5 của [[0-Ponytail - Lazy Senior Dev cho AI Agent]].
- **`/skill-create` lên repo Joy Loyalty** là cách rẻ nhất để bắt đầu: nó đọc git history thật của mình, không phải bê pattern của người lạ về.
- **Cẩn thận với memory.** README nói rõ: *"Memory is unreviewed context, not executable policy."* Không để agent coi nội dung memory là lệnh — nhất là trong path tiền (tính điểm, redeem reward).

---
## 📚 Tham khảo
- 🔥 [affaan-m/ECC — README](https://github.com/affaan-m/ECC) — nguồn chính: bảng counts (68 agents / 286 skills / 94 commands), bảng Skills–Agents–Rules–Hooks–Instincts, install paths, platform support matrix, cảnh báo official sources.
- [docs/SKILL-DEVELOPMENT-GUIDE.md](https://github.com/affaan-m/ECC/blob/main/docs/SKILL-DEVELOPMENT-GUIDE.md) — định nghĩa "knowledge modules", cấu trúc thư mục skill, bảng field frontmatter, template SKILL.md, bảng DO/DON'T, giới hạn 200–500 dòng (max 800). Đọc file này là hiểu 90% cách viết skill.
- [docs/SKILL-PLACEMENT-POLICY.md](https://github.com/affaan-m/ECC/blob/main/docs/SKILL-PLACEMENT-POLICY.md) — 4 loại skill (curated/learned/imported/evolved), path của từng loại, schema `.provenance.json`, hành vi của validator.
- [skills/search-first/SKILL.md](https://github.com/affaan-m/ECC/blob/main/skills/search-first/SKILL.md) — mẫu skill "workflow": frontmatter thật, ASCII pipeline 6 bước, decision matrix Adopt/Extend/Compose.
- [skills/strategic-compact/SKILL.md](https://github.com/affaan-m/ECC/blob/main/skills/strategic-compact/SKILL.md) — mẫu skill bắt cặp với hook: cách `suggest-compact.js` đo context size từ transcript, ngưỡng 160k/250k.
- [skills/continuous-learning-v2/SKILL.md](https://github.com/affaan-m/ECC/blob/main/skills/continuous-learning-v2/SKILL.md) — mô hình instinct (YAML + confidence 0.3–0.9), bảng khác biệt v1/v2, project-scoped instincts của v2.1.
- [skills/unified-memory/SKILL.md](https://github.com/affaan-m/ECC/blob/main/skills/unified-memory/SKILL.md) — Memory Vault: 3 scope project/team/user, trust boundary, và câu "skill is guidance, not the executable".
- [The Longform Guide](https://github.com/affaan-m/ECC/blob/main/the-longform-guide.md) — context economics, memory, evals, parallel agents (README liệt kê 3 guide: shortform để bắt đầu, longform, security).

---
## ✅ Checklist
- [ ] Nhớ cột "Context behavior": rules = always loaded, skills = on demand, hooks = ngoài context
- [ ] Hiểu progressive disclosure: chỉ `name` + `description` vào context, thân SKILL.md nạp sau
- [ ] Viết `description` dạng "Use when…", vì đó là cơ chế auto-activation
- [ ] Cài tay thì đặt skill ở **direct children** `~/.claude/skills/<skill-name>/`, KHÔNG lồng `~/.claude/skills/ecc/`
- [ ] Một skill = một domain hẹp, 200–500 dòng, tối đa 800
- [ ] Không stack install method; cài plugin rồi thì đừng chạy `install.sh --profile full`
- [ ] Chỉ cài từ nguồn official (repo, `ecc-universal`, `ecc-agentshield`, `ecc@ecc`, ecc.tools)
- [ ] Cân nhắc profile chọn lọc (`--skills a,b`) thay vì full 286 skills nếu quan tâm context footprint
- [ ] Copy `rules/common` + đúng 1 pack ngôn ngữ đang dùng, không copy hết
- [ ] Thử `/skill-create` trên repo của mình trước khi đi tìm skill của người khác
- [ ] Coi memory/instinct là context chưa được review, không phải policy
