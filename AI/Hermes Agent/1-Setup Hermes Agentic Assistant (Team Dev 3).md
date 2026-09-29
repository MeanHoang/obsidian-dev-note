> [!quote] 💬
> "Mục tiêu là để trợ lý và agent xử lý phần mechanical, còn con người review và quyết định." — yêu cầu setup Team Dev 3

Hướng dẫn setup Hermes trên **máy Mac công ty** để đạt đủ 10 dòng trong format báo cáo. Khái niệm nền xem [[0-Hermes Agent là gì]].

> [!note] 📝 Bức tranh tổng
> Máy công ty = **văn phòng mở cửa 24/7**. Hermes = **thư ký ngồi trực** trong đó.
> - Anh nhắn thư ký qua **Telegram** (gateway) từ điện thoại.
> - Thư ký có chìa khoá: **Slack** (xoxp), **email** (IMAP, chỉ đọc), **GitLab** (`glab`), **Notion** (MCP), **Orca** (`orca` CLI).
> - Mỗi sáng thư ký tự viết **morning brief** (cron). Cuối ngày viết **daily report**.
> - **Tailscale** = đường hầm riêng để anh vào văn phòng từ xa khi cần sửa.

---
## 🧾 Bước 0: Chuẩn bị trước (hỏi lead nếu thiếu)
| Cần gì | Dùng ở bước | Ghi chú |
|---|---|---|
| API key LLM (provider nào công ty cấp) | 2 | Chưa rõ công ty dùng provider nào → **hỏi lead** |
| Slack xoxp cá nhân | 5 | Lấy tại `https://hrm.avada.net` |
| Host email công ty + có cho IMAP/app password không | 6 | Google Workspace có thể bị admin tắt app password (**chưa verify** với IT Avada) |
| Host GitLab công ty + Personal Access Token | 7 | Token scope `api` hoặc `read_api` |
| Link database task Notion + tên field Priority/Deadline/SLA | 8 | Để agent đọc đúng cột |
| Channel Slack nhận daily report | 10 | Lấy **channel ID** (bắt đầu bằng `C...`) |

> [!danger] ⛔ Quy tắc secret (bắt buộc theo yêu cầu)
> Mọi token/key chỉ nằm trong `~/.hermes/.env` (chmod 600). **Không** paste vào Slack, email, Notion, log, commit Git. Không nhờ agent "in token ra để kiểm tra".

---
## 1️⃣ Máy online 24/7 (macOS)
```bash
# Không sleep khi cắm sạc (-c = charger). Màn hình tắt/khoá vẫn OK
sudo pmset -c sleep 0
sudo pmset -c disksleep 0
# Kiểm tra: dòng "sleep" phải là 0
pmset -g | grep -E "^ sleep|disksleep"
```
- **Được phép**: khoá màn hình (Ctrl+Cmd+Q), tắt màn hình.
- **Không được**: Log out, Shut down, gập nắp MacBook (trừ khi cắm màn hình ngoài).
- Lý do: gateway chạy dạng **launchd agent** của user. 📖 Docs: plist nằm ở `~/Library/LaunchAgents/ai.hermes.gateway.plist` → chỉ chạy khi user còn đăng nhập. Tailscale macOS cũng vậy: chế độ chạy khi đã log out (`--unattended`) chỉ có trên Windows.

> [!warning] ⚠️ Mất điện / máy restart
> Sau restart phải **đăng nhập lại** thì gateway mới chạy. Nếu bật FileVault, máy không tự đăng nhập được → ai ở văn phòng cần mở máy giúp.

---
## 2️⃣ Cài Hermes + chọn model
```bash
# CLI only (macOS/Linux). Bản Desktop .dmg chỉ hỗ trợ Apple Silicon
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
hermes setup        # wizard đầy đủ: provider, model, tool
hermes model        # đổi provider/model sau này
hermes              # mở chat thử: "xin chào, bạn đang chạy model gì?"
```
Cấu hình bảo mật trong `~/.hermes/config.yaml`:
```yaml
terminal:
  backend: local        # phải là local: agent cần chạm git, orca, glab trên máy thật
approvals:
  mode: smart           # lệnh nguy hiểm → LLM phụ chấm, rủi ro cao thì hỏi anh
  cron_mode: deny       # job cron KHÔNG được tự chạy lệnh nguy hiểm
```
```bash
chmod 600 ~/.hermes/.env
```

> [!warning] ⚠️ Vì sao không dùng Docker ở đây
> Docker an toàn hơn nhưng container không điều khiển được Orca, git và glab trên máy host. Bù lại: giữ `approvals` bật, **không bao giờ** bật `/yolo` trên máy công ty.

---
## 3️⃣ Nhắn từ điện thoại (Telegram gateway)
1. Telegram → chat **@BotFather** → `/newbot` → đặt username kết thúc bằng `bot` → nhận token.
2. Chat **@userinfobot** → lấy **user ID** dạng số.
3. Chạy wizard, chọn Telegram, nhập token + user ID:
```bash
hermes gateway setup
```
Hoặc tự ghi vào `~/.hermes/.env`:
```bash
TELEGRAM_BOT_TOKEN=123456789:ABC...
TELEGRAM_ALLOWED_USERS=123456789   # CHỈ ID của anh
```
4. Cài thành service chạy nền:
```bash
hermes gateway install   # tạo launchd agent, tự chạy khi đăng nhập
hermes gateway status
tail -f ~/.hermes/logs/gateway.log
```
5. Trong chat Telegram với bot, gõ `/sethome` → đây là **home channel** nhận kết quả cron (morning brief).

> [!danger] ⛔ Không bao giờ
> `GATEWAY_ALLOW_ALL_USERS=true`. Ai tìm ra bot sẽ ra lệnh được cho máy công ty.

> [!tip] 💡 Máy ngủ qua đêm, sáng mới bật lại?
> Mặc định tin nhắn gửi lúc máy tắt sẽ **bị bỏ**. Muốn nhận lại, thêm vào `config.yaml`:
> ```yaml
> platforms:
>   telegram:
>     extra:
>       drop_pending_on_cold_boot: false
> ```

---
## 4️⃣ Hermes điều khiển Orca
**Orca** = app chạy nhiều coding agent (Claude Code, Codex, Hermes...) song song. Mỗi task có một **git worktree** và một terminal riêng.
1. Cài Orca desktop từ [onorca.dev](https://www.onorca.dev/) → mở app, add repo.
2. Bật CLI: **Settings → General → Orca CLI** → Register. Kiểm tra:
```bash
command -v orca
orca status --json
```
3. Cài skill `orca-cli` cho Hermes (skills CLI có hỗ trợ agent `hermes-agent`):
```bash
npx skills add https://github.com/stablyai/orca --skill orca-cli -g -a hermes-agent
ls ~/.hermes/skills/ | grep -i orca   # phải thấy skill
```
4. **Quan trọng**: gateway launchd giữ PATH cũ lúc cài. Cài thêm tool mới (`orca`, `glab`, `himalaya`) thì chạy lại:
```bash
hermes gateway install   # cập nhật PATH mới cho gateway
```
5. Orca desktop phải **luôn mở**. CLI điều khiển app đang chạy, app tắt thì CLI không làm được gì.

Các lệnh Hermes sẽ dùng (📖 docs Orca CLI):
```bash
orca worktree create --repo id:<repoId> --name my-task --json
orca terminal create --worktree path:/projects/app --command "claude" --json
orca terminal send --text "continue" --enter --json
orca terminal read --json
```

### ✅ Test end-to-end (bắt buộc, không chỉ cài xong)
Nhắn bot Telegram từ điện thoại (**tắt Wi-Fi**, dùng 4G để chắc chắn đi qua internet):
```text
Dùng orca: trong repo <tên repo test>, tạo worktree tên "hermes-e2e-test",
mở terminal chạy Claude Code, nhờ nó thêm 1 dòng "hermes e2e ok" vào README.md.
Chờ xong thì đọc terminal, gửi lại cho tôi git diff. Không commit, không push.
```
Đạt khi: nhận được diff trên điện thoại + thấy worktree mới trong Orca. Xong thì xoá worktree test.

---
## 5️⃣ Slack: đọc DM, mention, thread (xoxp)
Dùng MCP server `slack-mcp-server`. 📖 Mặc định **chỉ đọc**, không gửi được tin nào → đúng yêu cầu "chỉ đề xuất draft".
```bash
# ~/.hermes/.env
SLACK_MCP_XOXP_TOKEN=xoxp-...   # token cá nhân từ hrm.avada.net
```
```yaml
# ~/.hermes/config.yaml — ${...} lấy giá trị từ .env, không ghi token thẳng vào đây
mcp_servers:
  slack:
    command: "npx"
    args: ["-y", "slack-mcp-server@latest", "--transport", "stdio"]
    env:
      SLACK_MCP_XOXP_TOKEN: "${SLACK_MCP_XOXP_TOKEN}"
```
Tool có sẵn: `conversations_unreads`, `conversations_history`, `conversations_replies`, `conversations_search_messages`...
Test trong `hermes` chat:
```text
Liệt kê các DM và mention chưa đọc trong Slack 24h qua, nhóm theo "cần trả lời" / "FYI".
```

> [!warning] ⚠️ Không tự bật quyền gửi
> Biến `SLACK_MCP_ADD_MESSAGE_TOOL` mở quyền gửi tin. **Để trống.** Chỉ bật cho đúng 1 channel daily report ở bước 🔟.

---
## 6️⃣ Email: chỉ đọc + tổng hợp
Dùng skill `himalaya` (có sẵn trong Hermes) qua IMAP.
```bash
curl -sSL https://raw.githubusercontent.com/pimalaya/himalaya/master/install.sh | PREFIX=~/.local sh
himalaya --version
# App password lưu file riêng, chỉ user đọc được
printf '%s' 'APP_PASSWORD_HERE' > ~/.config/himalaya/app-password && chmod 600 ~/.config/himalaya/app-password
```
`~/.config/himalaya/config.toml`: **chỉ khai báo IMAP, bỏ hẳn phần SMTP** → agent về kỹ thuật không gửi được mail.
```toml
[accounts.work]
default = true
email = "ten@<domain-cong-ty>"            # email công ty của anh
backend.type = "imap"
backend.host = "imap.gmail.com"   # nếu công ty dùng Google Workspace
backend.port = 993
backend.login = "ten@<domain-cong-ty>"
backend.auth.type = "password"
backend.auth.command = "cat ~/.config/himalaya/app-password"
# KHÔNG thêm message.send.backend.* → không có đường gửi
```
```bash
himalaya envelope list   # thấy danh sách mail = OK
hermes gateway install   # cập nhật PATH vì vừa cài himalaya
```

> [!warning] ⚠️ Docs Hermes khuyên ngược lại
> 📖 Docs himalaya: *"Create a fresh mailbox for the agent — never hand it your personal inbox."* Yêu cầu team là đọc mail công ty, nên phải bù bằng: không có SMTP, agent chỉ viết draft ra Telegram, không forward mail ra ngoài. Nếu Google Workspace công ty chặn app password → báo blocker, dùng skill `google-workspace` (OAuth) và **hỏi IT** trước.

---
## 7️⃣ Git / GitLab
Hermes có sẵn skill cho GitHub (`gh`), **không có** skill GitLab → dùng CLI chính thức `glab`.
```bash
brew install glab
glab auth login --hostname <gitlab.cong-ty>   # dán Personal Access Token
glab mr list --assignee=@me                   # test
glab ci status                                 # chạy trong 1 repo
hermes gateway install                         # cập nhật PATH
```
Test trong chat:
```text
Với các repo tôi đang làm: liệt kê MR của tôi đang mở, MR nào >2 ngày không update,
pipeline nào fail, review comment nào chưa trả lời.
```

---
## 8️⃣ Notion + SLA
Notion có trong **catalog MCP** của Hermes (bản hosted, đăng nhập OAuth bằng tài khoản của anh → chỉ thấy đúng trang anh có quyền).
```bash
hermes mcp catalog | grep -i notion    # lấy đúng tên entry
hermes mcp install <tên-entry-notion>
hermes mcp login <tên-entry-notion>    # mở link, approve bằng account Notion công ty
hermes gateway restart
```
Dạy agent cấu trúc database 1 lần (nó sẽ lưu vào memory):
```text
Nhớ: database task của tôi là <link Notion>. Field: Assignee, Priority, Deadline,
SLA, Status, Acceptance Criteria. Task "nguy cơ trễ" = còn <24h tới Deadline/SLA mà Status chưa Done.
```

---
## 9️⃣ Tailscale
1. Tải **bản Standalone** tại tailscale.com/download (không dùng bản App Store). Đăng nhập bằng **email cá nhân**, gói Personal.
2. Cài app Tailscale trên điện thoại / laptop cá nhân, cùng tài khoản.
3. Kiểm tra:
```bash
tailscale status            # thấy máy công ty + điện thoại
tailscale ip -4             # IP 100.x.x.x của máy công ty
```
4. Kết nối thử từ thiết bị khác: `ping <100.x.x.x>`, hoặc SSH nếu đã bật **System Settings → General → Sharing → Remote Login**.
- **Không**: chia sẻ auth key, bật Exit Node, share máy cho người khác (chưa được duyệt).

---
## 🔟 Morning brief + daily report
### Morning brief (gửi về Telegram)
```bash
hermes cron create "every day at 8:30" "$(cat <<'EOF'
Morning brief cho tôi, tiếng Việt, ngắn gọn, mỗi mục tối đa 5 dòng:
1. Hôm nay ưu tiên việc gì (từ Notion: Priority + Deadline).
2. Email (himalaya) và Slack (DM, mention, thread tôi đã tham gia) cần phản hồi — kèm draft trả lời, KHÔNG gửi.
3. Task Notion sắp hoặc đã quá SLA.
4. MR/pipeline GitLab cần xử lý (glab).
5. Đang chờ ai, cần follow-up gì.
6. Việc nào agent có thể tự làm tiếp (liệt kê, chưa làm).
EOF
)" --name "morning-brief"
```
💭 Cú pháp lịch `"every day at 8:30"` là em suy theo ví dụ `"every 2h"` trong docs, **chưa verify**. Chắc nhất là nhắn thẳng cho bot: *"Mỗi sáng 8h30 thứ 2 đến thứ 6, chạy morning brief theo mẫu sau..."*. 📖 Docs xác nhận Hermes tự tạo cron từ câu nói tự nhiên. Kiểm tra: `hermes cron list`.

### Daily report vào nhóm Slack
Chỉ mở quyền gửi cho **đúng 1 channel** report:
```bash
# ~/.hermes/.env — chỉ channel này được post, mọi channel khác vẫn read-only
SLACK_MCP_ADD_MESSAGE_TOOL=C0XXXXXXX
```
```yaml
# thêm vào env của mcp_servers.slack trong config.yaml
      SLACK_MCP_ADD_MESSAGE_TOOL: "${SLACK_MCP_ADD_MESSAGE_TOOL}"
```
Cron cuối ngày, format theo yêu cầu: `completed / running / test-review evidence / SLA risk / blocker / next actions / ETA`.

> [!tip] 💡 Tuần đầu: duyệt tay trước khi post
> Cho cron gửi bản nháp về Telegram trước. Anh đọc, OK thì bảo "post đi". Tin rồi mới cho post thẳng.

---
## 🩺 Tự kiểm trước khi reply thread
| Dòng báo cáo | Cách kiểm | ✅ khi |
|---|---|---|
| Máy online 24/7 | `pmset -g \| grep sleep` | `sleep 0` |
| Hermes reachable từ điện thoại | Nhắn bot qua 4G | Bot trả lời |
| Hermes điều khiển Orca | Test E2E bước 4 | Nhận diff trên điện thoại |
| Email đọc/tổng hợp được | "tóm tắt 10 mail mới nhất" | Có tóm tắt, không gửi gì |
| Slack DM/mention/thread | "DM + mention chưa đọc" | Đúng tin thật |
| xoxp từ hrm.avada.net | `grep -c SLACK_MCP_XOXP ~/.hermes/.env` | `1` (không in token) |
| Git/GitLab | "MR của tôi đang mở" | Khớp GitLab web |
| Notion + SLA | "task nào sắp trễ SLA" | Khớp Notion |
| Tailscale | Ping 100.x từ thiết bị khác | Có phản hồi |
| Morning brief + daily report | `hermes cron list` + chạy thử 1 lần | Nhận được trên Telegram / Slack |

---
## 📚 Tham khảo
- [Hermes Docs — Installation](https://hermes-agent.nousresearch.com/docs/getting-started/installation) — lệnh cài, bản Desktop chỉ Apple Silicon.
- [Hermes Docs — Messaging / Telegram / Service Management](https://hermes-agent.nousresearch.com/docs/user-guide/messaging) — `hermes gateway setup/install`, launchd, `/sethome`, allowlist.
- [Hermes Docs — Security](https://hermes-agent.nousresearch.com/docs/user-guide/security) — approval modes, `cron_mode`, checklist production.
- [Hermes Docs — MCP](https://hermes-agent.nousresearch.com/docs/user-guide/features/mcp) — `mcp_servers`, catalog, `hermes mcp install/login`, `${VAR}` từ `.env`.
- [Orca Docs — CLI](https://www.onorca.dev/docs/cli/overview) và [Skills](https://www.onorca.dev/docs/cli/skills) — `orca worktree/terminal`, cài skill `orca-cli`.
- [korotovsky/slack-mcp-server](https://github.com/korotovsky/slack-mcp-server) — xoxp token, read-only mặc định, `SLACK_MCP_ADD_MESSAGE_TOOL`.
- [Tailscale — Three ways to run Tailscale on macOS](https://tailscale.com/docs/concepts/macos-variants) — Standalone vs App Store.
- [Tailscale — Run unattended](https://tailscale.com/docs/how-to/run-unattended) — `--unattended` chỉ có trên Windows.

---
## ✅ Checklist
- [ ] Bước 0: đủ API key LLM, xoxp, host email/GitLab, link Notion DB, channel ID report
- [ ] `pmset -c sleep 0`, chỉ khoá màn hình, không log out
- [ ] Hermes cài xong, `approvals.mode: smart`, `cron_mode: deny`, `.env` chmod 600
- [ ] Telegram bot + `TELEGRAM_ALLOWED_USERS` chỉ có ID mình, `hermes gateway install`, `/sethome`
- [ ] Orca CLI registered, skill `orca-cli` cài cho Hermes, **test E2E qua 4G**
- [ ] Slack MCP xoxp, read-only (chưa set `SLACK_MCP_ADD_MESSAGE_TOOL`)
- [ ] Himalaya chỉ IMAP, không SMTP
- [ ] `glab auth login` + test MR list
- [ ] Notion MCP login + dạy agent cấu trúc DB
- [ ] Tailscale Standalone, ping thử thành công, không bật Exit Node
- [ ] Chạy lại `hermes gateway install` sau khi cài xong mọi tool
- [ ] Morning brief chạy thử 1 lần, daily report gửi nháp về Telegram tuần đầu
- [ ] Reply thread theo format, blocker báo ngay
