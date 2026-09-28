# Parallel Agent Workflow — Tổng hợp research cho Joy Loyalty

> Research từ ~12 bài blog (Addy Osmani, Anthropic docs, cmux, Zed, Conductor)
> về multi-agent orchestration, agent harness, parallel agent workflow.
> Đã đối chiếu với [[1.Cải thiện AI harness - Vấn đề thực tế và lộ trình parallel agent tự kiểm]]
> để lọc ra **cái phù hợp với workflow Joy**, không phải lý thuyết chung chung.

---

## 1. Bức tranh lớn: Inner Loop vs Outer Loop

Nguồn: [Loop Engineering](https://addyosmani.com/blog/loop-engineering/) + [Own the Outer Loop](https://addyosmani.com/blog/own-the-outer-loop/) — Addy Osmani

Đây là framework quan trọng nhất để hiểu mình đang đứng ở đâu:

```
Inner Loop (agent domain)          Outer Loop (human domain)
─────────────────────────          ────────────────────────
investigate                        quality checks
implement                          verdict: "should we ship?"
verify (automated)                 answerability: "tại sao quyết định này safe?"
iterate                            ← KHÔNG BAO GIỜ delegate cái này
```

**Áp vào Joy:** `/joy-ship` đang chia đúng rồi — Gate 1/2/3 chính là outer loop. Nhưng vấn đề thực tế (từ note harness) là agent hay **nhảy cóc từ inner vào outer** — tự commit, tự sửa khi chỉ được bảo check. Hook H2 (`readonly-intent-guard`) chính là cách chặn cứng ranh giới này.

**Bổ sung từ research:** Osmani gọi hiện tượng agent tự ý là "cognitive surrender" — khi người dùng bắt đầu chấp nhận output mà không review kỹ. Ba chi phí ẩn:
- **Cognitive Surrender** — chấp nhận output mù
- **Cognitive Debt** — mất khả năng hiểu hệ thống mình viết
- **Orchestration Tax** — quản lý agent tốn hơn tự làm nếu không có hệ thống

---

## 2. Con số thực tế: bao nhiêu agent song song?

Nguồn: [Your Parallel Agent Limit](https://addyosmani.com/blog/cognitive-parallel-agents/) — Addy Osmani

**Osmani's ceiling: 3-4 thread song song.** Lý do:

| Chi phí ẩn | Giải thích |
|---|---|
| **Ambient anxiety tax** | Duy trì nhiều mental model tạo vigilance không thể relax |
| **Comprehension debt** | Agent sinh code nhanh hơn mình hiểu; compound qua nhiều thread |
| **Context switching** | Reload mental model mỗi lần nhảy thread, recovery không đủ |
| **Trust calibration decay** | Không maintain attention → phải re-review từ đầu |

**Rule of thumb:** bắt đầu với **ít hơn 1 thread** so với cảm giác thoải mái. Monitor review quality, không phải agent count, làm ceiling indicator.

**Áp vào Joy:** Kiến trúc 3 vòng trong note harness (scout → implement → verify) đúng hướng vì **không chạy song song cả 3 vòng** — mỗi vòng có barrier. Vòng 1 (scout) 4 agent song song, vòng 3 (verify) 5 agent — nhưng mỗi vòng tôi chỉ cần review 1 lần (output đã gộp), nên cognitive load thực tế ~ 3 lần review, không phải 9.

---

## 3. Agent Harness = Model + Scaffolding

Nguồn: [Agent Harness Engineering](https://addyosmani.com/blog/agent-harness-engineering/) — Addy Osmani

**Phương trình cốt lõi:** `Agent = Model + Harness`. Model chỉ ~10% hệ thống. Harness (instructions, tools, hooks, orchestration, guardrails) = ~90%. Phần lớn agent failure là lỗi config, không phải lỗi model.

**Điều này validate note harness của tôi:** 3 tầng enforcement (Memory → Skill → Hook) đúng pattern industry. Cụ thể:

```
Joy hiện tại                    Best practice (Osmani)
────────────────                ──────────────────────
~50 memory, 7 hook              AGENTS.md < 60 dòng, mỗi rule trace về 1 failure cụ thể
→ quá nhiều memory              → cần dọn, chuyển rule quan trọng xuống hook
```

**The Ratchet Pattern:** mỗi lần agent sai → engineer 1 constraint vĩnh viễn ngăn nó sai lại. Constraint trace về observed failure, không phải suy đoán. Remove chỉ khi model đã làm nó thừa.

→ Đây chính xác là nguyên tắc "rule càng quan trọng → càng phải đẩy xuống tầng thấp" trong note harness. Osmani cũng dùng cùng mô hình, gọi nó là ratchet.

**AGENTS.md discipline:** dưới 60 dòng. Chỉ chứa thông tin agent **không thể tự discover** — tooling requirements, conventions không hiển nhiên, landmine warnings. **ETH Zurich study: LLM-generated AGENTS.md giảm success 2-3% và tăng cost 20%+** so với human-authored.

---

## 4. Tool landscape: cái nào phù hợp Joy?

### 4.1. cmux (terminal app — manaflow-ai)

Nguồn: [cmux.com](https://cmux.com/), [GitHub](https://github.com/manaflow-ai/cmux)

**Là gì:** macOS native terminal (build trên Ghostty's libghostty), thiết kế riêng cho supervise nhiều AI agent. ~22k GitHub stars. Free, GPL.

**Feature nổi bật cho Joy workflow:**
- **Notification rings** — pane có ring xanh khi agent cần attention, xanh lá = done, vàng = waiting input, đỏ = error → giải quyết đúng vấn đề "attention management for parallel agents"
- **Vertical sidebar tabs** — hiện git branch, PR status, working directory, ports, notifications mỗi workspace
- **Programmable** — CLI + Unix socket API: tạo workspace, split pane, gửi keystroke, browser automation
- **Claude Code Teams integration** — `cmux claude-teams` chạy teammate mode với native splits
- **Session restore** — save layout, working directories, scrollback khi quit

**Install:**
```bash
brew tap manaflow-ai/cmux
brew install --cask cmux
```

**Hạn chế:** macOS only. Không tự quản lý worktree (cần kết hợp với `claude --worktree` hoặc cmux CLI).

### 4.2. cmux (CLI — craigsc)

Nguồn: [GitHub](https://github.com/craigsc/cmux)

**Là gì:** Pure-bash CLI, "tmux for Claude Code". Wrap Git worktree lifecycle.

**Workflow mẫu:**
```bash
cmux new feature-auth           # tạo worktree + launch Claude
cmux new fix-payments           # agent thứ 2, isolated
cmux merge fix-payments --squash # merge xong
cmux rm fix-payments            # cleanup
```

**Phù hợp Joy:** dùng kết hợp với cmux terminal app — CLI lo isolation, terminal app lo attention routing.

### 4.3. Zed Editor

Nguồn: [Zed AI Overview](https://zed.dev/docs/ai/overview), [Zed Parallel Agents](https://www.agent-wars.com/news/2026-04-22-zed-parallel-agents-multi-ai-editing)

**Là gì:** Rust-native editor, **editor đầu tiên có native parallel agent support** (April 2026).

**Feature quan trọng:**
- **Parallel Agents** — nhiều AI agent chạy đồng thời trong cùng editor, mỗi thread riêng
- **Threads Sidebar** — launch, monitor, stop, archive threads
- **Mix models per thread** — Claude thread này, Gemini thread kia
- **ACP (Agent Client Protocol)** — open standard, Claude Code chạy native qua adapter
- **Performance** — 120fps kể cả khi nhiều agent đang chạy (0.4s startup, 2ms input latency)

**Claude Code trong Zed (beta):**
- Real-time editing nhiều file + syntax highlighting
- Granular change review — accept/reject từng hunk
- Đọc `CLAUDE.md` trực tiếp
- Hạn chế hiện tại: Plan mode và một số slash commands chưa available

**So với Cursor:**

| | Zed | Cursor |
|---|---|---|
| Parallel agents | ✅ native | ❌ |
| Startup | 0.4s | 1.2s |
| RAM (large repo) | 200-400MB | 500-800MB |
| Extension ecosystem | Nhỏ hơn | ~50k (VS Code compat) |
| Open source | ✅ | ❌ |
| Giá | Free / $10 Pro | $20 Pro |

### 4.4. Conductor

Nguồn: [conductor.build](https://www.conductor.build)

**Là gì:** macOS app orchestrate nhiều coding agents (Claude Code, Codex, Cursor) song song, mỗi agent trong worktree riêng. Raised $22M Series A.

**Hai model isolation:**
- **Multiple workspaces** (Cmd+N) — branch riêng, files riêng, review path riêng → cho feature độc lập
- **Single workspace** — nhiều agent share branch → cho implement + review cùng diff

### 4.5. Đề xuất combo cho Joy

```
┌─────────────────────────────────────────────────────────┐
│  cmux terminal app (attention routing, notification)    │
│  ├── Pane 1: claude --worktree scout-code               │
│  ├── Pane 2: claude --worktree scout-pattern            │
│  ├── Pane 3: claude --worktree implement                │
│  └── Pane 4: claude --worktree verify                   │
│                                                         │
│  Zed (code review surface)                              │
│  └── Agent Panel: review diffs, accept/reject hunks     │
│                                                         │
│  Hooks (H1-H4) chạy ở TẤT CẢ pane — không lách được  │
└─────────────────────────────────────────────────────────┘
```

**Tại sao combo này chứ không chọn 1:**
- cmux lo **attention routing** (biết agent nào cần mình) — Zed không có notification rings
- Zed lo **code review** (diff view, hunk accept/reject) — cmux là terminal, review code trong terminal kém hơn
- Cả hai đều free
- Hooks chạy ở tầng Claude Code, không phụ thuộc terminal/editor nào

---

## 5. Verification Stack — từ máy đến người

Nguồn: [Agentic Code Review](https://addyosmani.com/blog/agentic-code-review/), [Claude Code Best Practices](https://code.claude.com/docs/en/best-practices)

**Số liệu đáng sợ từ Osmani:** Dev merge 4x more code với AI, nhưng chỉ ~12% real productivity gain. Code churn tăng 861%. Defect rate từ 9% → 54%. AI-written code sinh 1.7x issues hơn human code.

**Verification hierarchy (4 level, tăng dần automation):**

| Level | Cách | Áp vào Joy |
|---|---|---|
| 1. In-prompt | Bảo agent chạy check + iterate trong cùng message | Đang làm |
| 2. Across session | `/goal` condition, evaluator riêng re-check mỗi turn | Chưa dùng |
| 3. Deterministic gate | Stop hook chạy script, chặn cho tới khi pass | **Hook H1-H4** |
| 4. Second opinion | Verification subagent hoặc dynamic workflow, model mới try refute | **Vòng 3 verify** |

**93.4% bugs caught by exactly ONE tool** (thí nghiệm 4 reviewer AI song song) → không tool nào dominate → cần **heterogeneous reviewers** (khác góc nhìn). Đây validate thiết kế "verify bất đối xứng" trong note harness.

**Writer/Reviewer pattern (Anthropic docs):** Session A implement, Session B review trong fresh context — không bị bias toward code vừa viết. Đúng pattern vòng 3 verify.

**Adversarial review nuance:** reviewer được prompt tìm lỗi sẽ **luôn report gì đó**, kể cả khi code đúng. → "Flag only gaps affecting correctness or stated requirements" — không thì noise.

---

## 6. Orchestration Tax — cái giá thực của song song

Nguồn: [The Orchestration Tax](https://addyosmani.com/blog/orchestration-tax/) — Addy Osmani

**Core insight:** "You're the GIL (Global Interpreter Lock) of your agent system." Mọi parallel work serialize qua judgment của mình.

**Amdahl's Law áp vào agent:** thêm agent chỉ optimize phần parallelizable. Phần serial (review, quyết định) là bottleneck thật. → **Optimize review throughput, không phải agent count.**

**5 strategy:**
1. **Scale fleet to review rate** — backpressure, đừng spawn nhiều hơn khả năng review
2. **Sort work** — tách delegatable vs judgment-heavy
3. **Batch reviews** — context-switching mất minutes mỗi lần reload mental model
4. **Protect scarce attention** — automate verification, reserve judgment cho 20% cần human
5. **Defend serial time** — đôi khi dừng orchestration hẳn để deep focus

**Áp vào Joy:** Gate 3 hiện tại review TỪNG phase → tốn context switching. Gợi ý từ note harness "gộp 2-3 phase cùng surface" đúng hướng — batch review giảm orchestration tax.

---

## 7. Claude Code Worktree — cách dùng đúng

Nguồn: [Claude Code Worktree Docs](https://code.claude.com/docs/en/worktrees)

**Setup:**
```bash
claude --worktree feature-auth    # tạo .claude/worktrees/feature-auth/
claude --worktree bug-fix         # terminal thứ 2, worktree riêng
```

**Config quan trọng:**
- `.gitignore`: thêm `.claude/worktrees/`
- `.worktreeinclude`: copy gitignored files (`.env`, secrets) vào mỗi worktree tự động
- `worktree.baseRef`: `"fresh"` (branch từ main) hoặc `"head"` (branch từ HEAD hiện tại)

**Subagent isolation:** thêm `isolation: worktree` vào custom subagent frontmatter → mỗi subagent tự có worktree riêng. Worktree sạch tự xoá khi subagent xong.

**Áp vào Joy scout agents:**
```
scout-code:      isolation: worktree, read-only
scout-pattern:   isolation: worktree, read-only
scout-surface:   isolation: worktree, read-only
```
Read-only + worktree isolation = an toàn chạy song song, không sợ conflict.

---

## 8. Agent Teams vs Subagents — chọn cái nào

Nguồn: [Claude Code Swarms](https://addyosmani.com/blog/claude-code-agent-teams/), [Claude Code Agents Docs](https://code.claude.com/docs/en/agents)

| | Subagents | Agent Teams |
|---|---|---|
| Communication | Report to parent only | Peer-to-peer messaging + shared task list |
| Coordination | Parent manages all | Self-coordinating |
| Cost | Thấp hơn (~220k tokens) | Cao hơn (mỗi teammate = 1 Claude instance) |
| Best for | Quick focused tasks | Complex collaborative work |
| File conflict | Parent quản lý | File ownership per teammate |

**Enable Agent Teams:**
```json
// settings.json
{ "env": { "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1" } }
```

**Áp vào Joy:**
- **Vòng 1 (scout):** subagents đủ — chỉ read-only, không cần communicate với nhau
- **Vòng 2 (implement):** tuần tự, 1 agent → không cần teams
- **Vòng 3 (verify):** subagents — mỗi verifier có góc nhìn riêng, BAN communicate để giữ independence

Agent Teams hữu ích hơn cho case: **nhiều feature đồng thời cần sync** (frontend + backend landing cùng lúc). Hiện Joy chưa cần.

---

## 9. Practical patterns đáng bê về

### 9.1. Ralph Loop
Nguồn: [Long-Running Agents](https://addyosmani.com/blog/long-running-agents/)

```
pick task → build prompt with context → call agent → run validation
     → append results to progress file → update status → repeat
```

State sống trên filesystem, không trong context. Agent quên → filesystem nhớ. Đây đúng là cách `progress.md` trong `/joy-ship` hoạt động — validate pattern.

### 9.2. AGENTS.md < 60 dòng
Nguồn: [Stop Using /init for AGENTS.md](https://addyosmani.com/blog/agents-md/)

Mỗi dòng phải trace về 1 failure cụ thể. Nếu agent có thể tự discover (cấu trúc thư mục, tech stack) → không viết vào. Treat AGENTS.md như "list of codebase smells chưa fix", không phải permanent config.

**Action cho Joy:** rà lại `CLAUDE.md` + ~50 memory, gộp/xoá cái trùng, chuyển rule quan trọng xuống hook.

### 9.3. Kill criteria
Nguồn: [Code Agent Orchestra](https://addyosmani.com/blog/code-agent-orchestra/)

Agent stuck > 3 iterations → kill, không chờ. Token budget: set hard limit per agent, pause ở 85% consumption. WIP limit: 3-5 agents.

### 9.4. Heterogeneous verification
Nguồn: [Agentic Code Review](https://addyosmani.com/blog/agentic-code-review/)

93.4% bugs caught by **exactly 1 tool** → cần nhiều reviewer **khác kiến trúc**, không phải nhiều bản sao cùng 1 reviewer. Validate thiết kế vòng 3 của Joy: verify-diff-scope ≠ verify-pattern ≠ verify-adversarial ≠ verify-surface ≠ verify-render.

---

## 10. Lộ trình cập nhật cho Joy — sau research

Đối chiếu research với note harness, **không thay đổi kiến trúc 3 vòng** — research validate nó. Bổ sung:

### Ưu tiên cao (tuần này)
1. **Cài cmux terminal app** — thay thế terminal thường, được notification rings miễn phí
2. **Thử `claude --worktree`** trên 1 task nhỏ — verify worktree isolation hoạt động với Joy repo
3. **Hook H2 (`readonly-intent-guard`)** — vẫn là item giá trị nhất, chặn vấn đề #1

### Ưu tiên trung bình
4. **Dọn memory** — target: từ ~50 → ~30, mỗi cái trace về failure cụ thể (ratchet pattern)
5. **Thử Zed Agent Panel** cho code review — nếu diff review tốt hơn terminal thì dùng song song với cmux
6. **Token budget per agent** — set limit trong subagent prompt, kill sau 3 stuck iterations

### Ưu tiên thấp (sau khi nền vững)
7. **Agent Teams** cho multi-feature sync — chỉ khi đã chạy ổn subagent workflow
8. **`/goal` condition** (level 2 verification) — tự động re-check mỗi turn

---

## Sources

- [Loop Engineering](https://addyosmani.com/blog/loop-engineering/) — Addy Osmani, June 2026
- [Own the Outer Loop](https://addyosmani.com/blog/own-the-outer-loop/) — Addy Osmani, July 2026
- [Your Parallel Agent Limit](https://addyosmani.com/blog/cognitive-parallel-agents/) — Addy Osmani, April 2026
- [Agent Harness Engineering](https://addyosmani.com/blog/agent-harness-engineering/) — Addy Osmani, April 2026
- [The Code Agent Orchestra](https://addyosmani.com/blog/code-agent-orchestra/) — Addy Osmani, March 2026
- [Agentic Code Review](https://addyosmani.com/blog/agentic-code-review/) — Addy Osmani, June 2026
- [The Orchestration Tax](https://addyosmani.com/blog/orchestration-tax/) — Addy Osmani, May 2026
- [Long-Running Agents](https://addyosmani.com/blog/long-running-agents/) — Addy Osmani, April 2026
- [Stop Using /init for AGENTS.md](https://addyosmani.com/blog/agents-md/) — Addy Osmani, February 2026
- [Claude Code Swarms](https://addyosmani.com/blog/claude-code-agent-teams/) — Addy Osmani, February 2026
- [Claude Code Worktree Docs](https://code.claude.com/docs/en/worktrees) — Anthropic
- [Claude Code Best Practices](https://code.claude.com/docs/en/best-practices) — Anthropic
- [Claude Code Agents Docs](https://code.claude.com/docs/en/agents) — Anthropic
- [cmux Terminal App](https://cmux.com/) — manaflow-ai, [GitHub](https://github.com/manaflow-ai/cmux)
- [cmux CLI](https://github.com/craigsc/cmux) — craigsc
- [Zed AI Overview](https://zed.dev/docs/ai/overview) — Zed
- [Zed Parallel Agents](https://www.agent-wars.com/news/2026-04-22-zed-parallel-agents-multi-ai-editing)
- [Claude Code in Zed via ACP](https://zed.dev/blog/claude-code-via-acp) — Zed
- [Conductor](https://www.conductor.build)
- [Is the IDE dead?](https://x.com/addyosmani/status/2035444544125456785) — Addy Osmani, March 2026
