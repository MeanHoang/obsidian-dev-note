> [!quote] 💬
> "The Agent That Grows With You." — tagline trang chủ Hermes Agent (Nous Research)

---
## 🎯 Hermes Agent là gì?
📖 Theo README trên GitHub:
> "The self-improving AI agent built by Nous Research. It's the only agent with a built-in learning loop — it creates skills from experience, improves them during use, nudges itself to persist knowledge, searches its own past conversations, and builds a deepening model of who you are across sessions."

Dịch: Agent AI **tự cải thiện** do Nous Research làm. Nó có sẵn **vòng học (learning loop)**: tự tạo skill từ kinh nghiệm, sửa skill trong lúc dùng, tự nhắc mình lưu kiến thức, tìm lại các cuộc hội thoại cũ, và hiểu anh ngày càng rõ qua từng phiên.

Gọn lại:
- **Open-source, MIT license**, tự host (self-hosted): chạy trên máy mình, VPS $5, hay serverless.
- **Model nào cũng được**: Nous Portal, OpenRouter, OpenAI, endpoint riêng...
- **Nói chuyện qua nhiều kênh**: CLI, Telegram, Discord, Slack, WhatsApp, Signal, Email. Tất cả qua **một tiến trình gateway**.
- Repo: `NousResearch/hermes-agent`, **249.6k stars** (lấy từ GitHub ngày 2026-09-28).

> [!note] 📝 So sánh dễ hiểu
> Hermes giống **một nhân viên mới biết tự ghi sổ tay**:
> - **Sổ tay bỏ túi** (`MEMORY.md`, `USER.md`): vài dòng ghi chú ngắn, luôn mang theo. "Sếp thích báo cáo gạch đầu dòng", "server chạy Ubuntu".
> - **Tủ quy trình (SOP)** (`skills/`): mỗi việc khó đã làm xong → viết thành 1 quy trình, cất tủ. Lần sau gặp việc giống thì mở tủ lấy ra, không mò lại từ đầu.
> - **Lục lại tin nhắn cũ** (session search): quên chuyện tuần trước thì tìm lại trong lịch sử chat, như search Zalo.
> - **Một số tổng đài, nhiều kênh** (gateway): nhắn Telegram hay Slack đều gặp đúng một nhân viên đó, cùng một trí nhớ.

---
## 🧠 Learning loop hoạt động thế nào
### 1️⃣ Một lượt (turn) chạy ra sao
📖 Theo bài phân tích của Mr. Anand (Substack, 2026-04-02):
1. Tin nhắn tới → tạo task ID, lấy system prompt đã cache hoặc build mới.
2. Kiểm tra lịch sử hội thoại có sắp chạm giới hạn context không → nén (compress) nếu cần.
3. Gọi model. Model trả về tool call → chạy tool, gắn kết quả, gọi model tiếp. Lặp đến khi model trả text cuối.
4. Lưu phiên vào SQLite, gửi câu trả lời ra qua gateway.

Đây chính là **agent loop** giống mọi harness khác, xem [[Harness trong AI là gì]].

### 2️⃣ Phần "tự học" nằm ở đâu
📖 Sau mỗi lượt, một **agent review chạy nền** tách ra (fork), đọc lại chuyện vừa xảy ra, và có thể ghi 1 trong 2 thứ:
- **Memory entry**: một fact ngắn, bền.
- **Skill**: một quy trình, lưu thành file `SKILL.md`.

📖 Khi nào tự tạo skill (docs Skills System): khi agent
- tìm ra một workflow nhiều bước đáng lặp lại,
- tìm ra cách giải sau khi gặp lỗi hoặc đi vào ngõ cụt,
- nhận lời sửa (correction) từ người dùng.

Bài Substack ghi thêm ngưỡng cụ thể: *"five or more tool calls, recovery from an error, a user correction, or a non-obvious workflow that worked."*

> [!tip] 💡 Sửa skill bằng `patch`, không viết lại
> 📖 Agent mặc định dùng `patch` (đưa `old_string` + `new_string`) thay vì viết lại cả file. Lý do: viết lại dễ làm hỏng phần đang chạy tốt, còn patch chỉ sửa đúng chỗ đổi và tốn ít token hơn. Giống cách Claude Code dùng `Edit` thay vì `Write`.

---
## 🗂️ 4 lớp trí nhớ
| Lớp | Lưu ở đâu | Chứa gì | Khi nào vào context |
|---|---|---|---|
| **MEMORY.md** | `~/.hermes/memories/` | Ghi chú của agent: môi trường, convention, bài học. Tối đa **2,200 ký tự (~800 tokens)** | Luôn luôn, lúc bắt đầu phiên |
| **USER.md** | `~/.hermes/memories/` | Hồ sơ người dùng: sở thích, cách giao tiếp. Tối đa **1,375 ký tự (~500 tokens)** | Luôn luôn, lúc bắt đầu phiên |
| **Skills** | `~/.hermes/skills/` | Quy trình dài | Chỉ khi cần (progressive disclosure) |
| **Session search** | `~/.hermes/state.db` (SQLite + FTS5) | Toàn bộ hội thoại cũ | Khi agent chủ động tìm |

Nguồn số liệu: docs [Persistent Memory](https://hermes-agent.nousresearch.com/docs/user-guide/features/memory).

### Frozen snapshot: vì sao memory mới không hiện ngay
📖 *"The system prompt injection is captured once at session start and never changes mid-session."*
- Memory được chụp **một lần** lúc mở phiên. Ghi thêm giữa phiên thì **phiên sau** mới thấy.
- Lý do: giữ nguyên phần đầu prompt → **prefix cache** của LLM vẫn trúng → rẻ và nhanh hơn.

> [!note] 📝 Liên hệ Claude Code
> 💭 Claude Code anh đang dùng cũng có kiểu tương tự: `MEMORY.md` là file index nạp vào đầu mỗi phiên, skill trong `~/.claude/skills/` chỉ load khi gọi. Xem [[Skill]]. Khác biệt lớn nhất: Hermes **tự viết skill sau mỗi phiên**, còn skill Claude Code chủ yếu do người viết.

### Progressive disclosure: skill load theo 3 tầng
📖 Docs Skills System:
- **Level 0**: `skills_list()` → chỉ metadata (~3k tokens).
- **Level 1**: `skill_view(name)` → nội dung đầy đủ.
- **Level 2**: `skill_view(name, path)` → file tham chiếu cụ thể trong skill.

Format skill theo chuẩn mở [agentskills.io](https://agentskills.io/specification), nên có thể dùng chung skill với agent khác.
```yaml
---
name: my-skill
description: Brief description of what this skill does
version: 1.0.0
platforms: [macos, linux]
metadata:
  hermes:
    tags: [python, automation]
    category: devops
    requires_toolsets: [terminal]
---
```

---
## ⚙️ Tính năng chính khác
- **Cron bằng ngôn ngữ tự nhiên**: "mỗi sáng 8h gửi báo cáo" → chạy không cần người, gửi kết quả qua kênh bất kỳ.
- **Subagent tách biệt**: mỗi subagent có hội thoại, terminal và script Python RPC riêng.
- **Web + đa phương tiện**: web search, điều khiển browser, vision, sinh ảnh, text-to-speech.
- **Nhiều backend chạy lệnh (terminal backend)**: docs hiện liệt kê 7 loại: local, Docker, SSH, Daytona, Singularity, Modal, Vercel Sandbox.
- **Memory provider ngoài**: 7 plugin (Honcho, OpenViking, Mem0, Holographic, RetainDB, ByteRover, Supermemory). Chạy **song song** với memory có sẵn, không thay thế.

> [!warning] ⚠️ Số backend mỗi nguồn nói một khác
> Trang chủ ghi "Five backends", docs ghi "7 terminal backends", bài review của eesel ghi 6. Dự án đổi nhanh → tin **docs** hơn trang marketing.

### Lệnh CLI cơ bản
```bash
# Cài đặt
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
hermes              # Mở CLI tương tác
hermes setup        # Wizard cấu hình đầy đủ
hermes model        # Chọn LLM provider
hermes tools        # Cấu hình tool
hermes gateway      # Chạy gateway nhắn tin (Telegram, Slack...)
hermes update       # Cập nhật bản mới
hermes claw migrate # Chuyển từ OpenClaw: settings, memory, skill, API key
# Skills hub
hermes skills search kubernetes
hermes skills install openai/skills/k8s
```

---
## 🔐 Bảo mật: phần phải đọc trước khi chạy thật
Agent này chạy lệnh shell, đọc/ghi file, và **nhận tin nhắn từ ngoài vào**. Cấu hình sai = cho người lạ quyền vào máy anh.

### 1️⃣ Duyệt lệnh nguy hiểm (approval)
📖 3 chế độ:
- `smart` (mặc định): một LLM phụ chấm rủi ro, lệnh rủi ro thấp thì tự duyệt.
- `manual`: lệnh nguy hiểm nào cũng hỏi.
- `off`: tắt hết.

Luôn có **blocklist cứng**: `rm -rf /`, fork bomb, format ổ đĩa bị chặn **kể cả khi bật YOLO** (giống [[YOLO Mode]] của Claude Code).

### 2️⃣ Ai được nhắn cho agent
📖 Thứ tự kiểm tra: allow-all theo platform → danh sách DM pairing → allowlist theo platform → allowlist chung → allow-all chung → **mặc định: từ chối**.
- **DM pairing**: người lạ nhắn vào nhận mã 8 ký tự, hết hạn sau 1 giờ. Chủ chạy `hermes pairing approve <platform> <code>` mới được dùng.

### ❌ Bad vs ✅ Good: cấu hình gateway
```bash
# ❌ Bad — ai tìm được bot Telegram cũng ra lệnh được cho máy anh
GATEWAY_ALLOW_ALL_USERS=true
```
```bash
# ✅ Good — chỉ ID được liệt kê mới dùng được, còn lại dùng DM pairing
TELEGRAM_ALLOWED_USERS=123456789
GATEWAY_ALLOWED_USERS=123456789
```

### ❌ Bad vs ✅ Good: chạy lệnh trên máy thật
```yaml
# ❌ Bad — chạy thẳng trên máy host, tắt duyệt lệnh
terminal:
  backend: local
approvals:
  mode: off
```
```yaml
# ✅ Good — chạy trong container có giới hạn tài nguyên
terminal:
  backend: docker
  container_cpu: 1
  container_memory: 5120
  container_disk: 51200
approvals:
  mode: smart
  cron_mode: deny # job cron không được tự chạy lệnh nguy hiểm
```

> [!warning] ⚠️ Trong Docker thì không còn bước duyệt lệnh
> 📖 *"When running in `docker`, `singularity`, `modal`... backends, dangerous command checks are **skipped** because the container itself is the security boundary."*
> Nghĩa là: container = hàng rào duy nhất. **Đừng mount** `~/.ssh`, `~/.aws`, source code công ty vào container.

### Các lớp bảo vệ khác (có sẵn)
- **Path cấm ghi**: `~/.ssh/`, `~/.aws/`, `/etc/sudoers`, `.env`...
- **Quét prompt injection** trong file context (như `AGENTS.md`) trước khi đưa vào system prompt.
- **MCP subprocess** chỉ nhận env an toàn (`PATH`, `HOME`...). API key bị lọc bỏ trừ khi khai báo rõ.
- **Chặn SSRF**: không cho gọi IP nội bộ, loopback, cloud metadata (`169.254.169.254` trên GCP/AWS).

> [!danger] ⛔ Skill tự học cũng có thể học cái sai
> 📖 Paper "Practice Makes Unsafe: Skill Misevolution in Self-Improving LLM Agents" (arXiv, 2026-08-13): *"An unsafe success can thereby become reusable policy after its triggering input disappears."* Một lần "làm được" bằng cách không an toàn có thể thành skill, rồi bị dùng lại mãi.
> Paper **không** nhắc tên Hermes, nhưng nói đúng loại agent này. Cách giảm rủi ro: bật `write_approval: true` để duyệt memory/skill trước khi lưu, và định kỳ đọc lại `~/.hermes/skills/`.

---
## 💼 Dùng vào việc gì (cho dev Joy)
💭 Nhận định của AI, chưa thử thật:

| Việc | Có hợp không | Lý do |
|---|---|---|
| Trợ lý cá nhân qua Telegram: nhắc việc, tóm tắt tin sáng | ✅ Hợp | Đúng thế mạnh: gateway + cron + memory |
| Sysadmin homelab / VPS cá nhân | ✅ Hợp | Bài review eesel có user dùng đúng việc này |
| Code hằng ngày trong repo Joy | ⚠️ Chưa cần | Claude Code đã làm tốt, tích hợp IDE, có sẵn |
| Chạy trên server production, chạm data merchant | ⛔ Không | Agent tự học + nhận tin từ ngoài = bề mặt tấn công lớn |

> [!note] 📝 Chi phí thật
> 📖 Phần mềm miễn phí (MIT), nhưng trả tiền model riêng. Bài review eesel (sửa lần cuối 2026-07-19) ước tính self-host thật tốn **khoảng $535/tháng** (VPS + API + công bảo trì). Nhược điểm được nêu: khởi động chậm, CLI giật (*"flickery CLI"*), model trả lời dài dòng.

---
## 📚 Tham khảo
- [Hermes Agent — trang chủ](https://hermes-agent.nousresearch.com/) — giới thiệu 6 nhóm tính năng, lệnh cài đặt, license MIT.
- [NousResearch/hermes-agent (GitHub)](https://github.com/NousResearch/hermes-agent) — README: learning loop, danh sách lệnh CLI, migrate từ OpenClaw.
- [Docs: Persistent Memory](https://hermes-agent.nousresearch.com/docs/user-guide/features/memory) — `MEMORY.md`/`USER.md`, giới hạn ký tự, frozen snapshot, FTS5.
- [Docs: Skills System](https://hermes-agent.nousresearch.com/docs/user-guide/features/skills) — format `SKILL.md`, progressive disclosure 3 tầng, `skill_manage`.
- [Docs: Security](https://hermes-agent.nousresearch.com/docs/user-guide/security) — approval, allowlist, DM pairing, Docker hardening, checklist production.
- [Inside Hermes Agent: How a Self-Improving AI Agent Actually Works](https://mranand.substack.com/p/inside-hermes-agent-how-a-self-improving) — phân tích từng bước agent loop và điều kiện tạo skill.
- 🔥 [Hermes AI agent review: an honest 2026 take (eesel)](https://www.eesel.ai/blog/hermes-agent-review) — ưu/nhược thực tế, chi phí self-host, hợp với ai.
- 🔥 [Practice Makes Unsafe: Skill Misevolution in Self-Improving LLM Agents (arXiv)](https://arxiv.org/abs/2608.12851) — rủi ro agent tự học biến hành vi không an toàn thành skill.

---
## ✅ Checklist
- [ ] Hiểu Hermes = agent open-source, tự host, **tự viết skill và memory** sau mỗi phiên
- [ ] Phân biệt 4 lớp trí nhớ: `MEMORY.md`/`USER.md` (luôn nạp) · skills (nạp khi cần) · session search (tự tìm)
- [ ] Hiểu frozen snapshot: memory mới chỉ có hiệu lực từ **phiên sau**, để giữ prefix cache
- [ ] Hiểu progressive disclosure: metadata → nội dung skill → file tham chiếu
- [ ] Trước khi bật gateway: đặt allowlist, **không** dùng `GATEWAY_ALLOW_ALL_USERS=true`
- [ ] Chạy trong Docker, không mount `~/.ssh`, `~/.aws`, source code công ty
- [ ] Bật `write_approval` nếu muốn duyệt skill/memory trước khi agent lưu
- [ ] Không đưa lên server production hay cho chạm data merchant
