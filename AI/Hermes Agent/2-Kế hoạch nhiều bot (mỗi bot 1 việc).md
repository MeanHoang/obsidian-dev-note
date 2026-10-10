> [!quote] 💬
> "Mỗi con bot 1 việc." — mong muốn của anh, 2026-10-05

Kế hoạch tách Hermes thành nhiều bot Telegram, mỗi bot một vai. **Chưa làm**, sẽ set up và chốt vai trò sau. Nền: [[0-Hermes Agent là gì]] · [[1-Setup Hermes Agentic Assistant (Team Dev 3)]].

---
## 📍 Hiện trạng (đã kiểm trên máy 2026-10-05)
| | |
|---|---|
| Profile | Chỉ có `default` (`~/.hermes`) |
| Bot Telegram | **`@Evil_Morty_666_bot`** (tên hiển thị `Evil_Morty`, id `8551776040`) |
| Ai được nhắn | Chỉ tài khoản Telegram của anh (`TELEGRAM_ALLOWED_USERS`) |
| Model | `claude-sonnet-5` (Anthropic API key) |
| Gateway | launchd `ai.hermes.gateway.plist`, tự chạy khi đăng nhập |
| Kết nối | Slack MCP (xoxp, chỉ đọc; được gửi vào đúng 1 channel), skill `orca-cli` |

**Bot đang làm 2 việc định kỳ (cron), cả hai gửi kết quả về `@Evil_Morty_666_bot`:**

| Cron | Lịch | Làm gì |
|---|---|---|
| `daily-report-9h` | 9:00 hằng ngày | Tóm tắt Slack chưa đọc: `#1-joy-loyalty-support`, `#release-retention`, DM/mention `@hoangtm`. Chỉ đọc |
| `slack-mention-handler` | 15 phút/lần (96 lần/ngày) | Gộp 3 việc: (B) check ticket bug đang chạy trong Orca xong chưa → (A) quét mention Slack mới → phân loại. Không bao giờ tự trả lời Slack |

Lần chạy gần nhất của cả hai: `ok` (`hermes cron list`, 2026-10-05).

> [!warning] ⚠️ Vì sao muốn tách
> Một cron đang làm 3 việc. Lỗi ở khâu nào cũng chỉ thấy "job lỗi", khó biết hỏng chỗ nào. Mọi thông báo đổ về 1 khung chat nên lẫn nhau. Memory và skill của mọi việc nằm chung một chỗ.

---
## 🧩 Cơ chế: profile = 1 bot
📖 Nguồn: tài liệu đi kèm bản cài `~/.hermes/hermes-agent/website/docs/user-guide/profiles.md` và `multi-profile-gateways.md`.

> [!note] 📝 Ví von
> Mỗi profile là **một nhân viên riêng**: bàn riêng, sổ tay riêng, số điện thoại riêng (bot token). Cả văn phòng chỉ có **một tổng đài** (gateway của `default`) nối máy cho tất cả.

1. `hermes profile create <tên>` → thư mục `~/.hermes/profiles/<tên>/` với `.env`, `config.yaml`, `SOUL.md`, memory, skill, cron **riêng**. Bot này không đọc được memory bot kia.
2. Mỗi bot cần **token riêng** từ @BotFather. Hai profile dùng chung 1 token → gateway khoá bot thứ hai (`duplicate_credential`).
3. **Chỉ một gateway** (của `default`) phục vụ mọi profile, tự nhận profile mới trong ≤30 giây. **Không** chạy `gateway install` cho từng profile (bị từ chối, exit 78).
4. Tắt riêng 1 bot: `hermes -p <tên> gateway stop` (các bot khác vẫn chạy). Bật lại: `gateway start`.
5. Allowlist (`TELEGRAM_ALLOWED_USERS`) đọc từ `.env` **của từng profile** → bot mới phải tự khai lại ID của anh.
6. ⛔ Profile **không cách ly** máy: `backend: local` vẫn có quyền như tài khoản anh. Đặt `terminal.cwd` riêng mỗi bot, giữ `approvals.mode: smart`, `cron_mode: deny`.

---
## 🤖 Đề xuất vai trò (chưa chốt)
| Profile | Bot | Vai | Chuyển từ đâu |
|---|---|---|---|
| `default` | `@Evil_Morty_666_bot` (giữ) | Trợ lý chung, anh nhắn hỏi | — |
| `slack-bot` | *(tạo mới)* | Báo cáo 9h + quét mention 15 phút | Phần Slack của 2 cron hiện tại |
| `orca-bot` | *(tạo mới)* | Giao ticket bug cho Orca, báo khi xong | Phần (B) của `slack-mention-handler` |

Ý tưởng thêm sau (chưa có gì chạy): bot morning brief (Notion + GitLab + email), bot nhắc việc cá nhân.

---
## 🛠️ Các bước khi làm
1. Anh: tạo bot mới ở @BotFather → lấy token. **Không** dán token vào chat với AI.
2. Tạo profile và viết vai:
```bash
hermes profile create slack-bot --clone --description "Reads Slack, reports unread and new mentions. Never posts."
hermes profile create orca-bot  --clone --description "Dispatches bug tickets to Orca and reports when done."
# --clone: copy config, .env (trừ token bot), SOUL, skill; KHÔNG copy kênh nhắn
```
3. Anh tự dán vào `~/.hermes/profiles/<tên>/.env`:
```bash
TELEGRAM_BOT_TOKEN=<token bot mới>
TELEGRAM_ALLOWED_USERS=<ID Telegram của anh>
```
4. Viết `SOUL.md` mỗi bot: chỉ làm đúng vai, việc ngoài vai thì từ chối.
5. Tạo cron mới trong profile đúng vai (`hermes -p slack-bot cron create …`), chạy thử 1 lần, rồi mới **xoá** cron cũ ở `default`. Không để 2 bản chạy song song.
6. Kiểm: `hermes profile list` (gateway `running`), nhắn từng bot qua 4G, `hermes -p <tên> cron list`.

---
## ❓ Còn phải chốt
- [ ] Danh sách bot cuối cùng và tên từng bot
- [ ] Bot Slack có cần chạy 15 phút/lần không (96 lần/ngày, mỗi lần tốn token) hay thưa hơn
- [ ] Bot nào được gửi Slack (hiện chỉ 1 channel được phép)
- [ ] Có cần các bot nói chuyện với nhau không (Hermes có `kanban` và `peer`, chưa tìm hiểu)
