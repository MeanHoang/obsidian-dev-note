> [!quote] 💬
> "The AI Orchestrator for 100x builders." — tagline trong `README.md` của repo [stablyai/orca](https://github.com/stablyai/orca)

## Nguồn của note này
- 📖 `README.md` của repo, đọc từ bản clone commit `9db7b8b` (2026-10-13).
- 📖 GitHub API `repos/stablyai/orca` và `repos/stablyai/orca/languages` (gọi ngày 2026-10-14): số sao, ngôn ngữ, ngày tạo.
- 📖 `package.json` của repo và `package.json` trong `app.asar` của bản Orca 1.4.224 đang cài trên máy.
- 📖 Đếm file bằng `find` trên bản clone (lệnh ở phần "Quy mô").
- 💭 Phần so sánh và bài học là nhận định của AI.

---
## 🎯 Orca là gì?
📖 Mô tả repo trên GitHub:
> "Orca is the ADE for working with a fleet of parallel agents. Run any coding agent with your own subscription. Available on desktop, mobile and remote runtime."

Dịch: Orca là **môi trường phát triển cho agent (ADE, Agent Development Environment)**, dùng để điều khiển một đội agent chạy song song. Anh dùng agent nào cũng được, bằng chính tài khoản (subscription) của anh. Có bản desktop, mobile và chạy trên máy từ xa.

📖 README: *"Run Codex, ClaudeCode, OpenCode or Pi side-by-side — each in its own worktree, tracked in one place."* Dịch: chạy Codex, Claude Code, OpenCode hay Pi cạnh nhau, mỗi con một worktree, theo dõi ở một chỗ.

> [!note] 📝 So sánh dễ hiểu
> Orca giống **phòng điều hành của một bếp nhà hàng**:
> - Mỗi đầu bếp (agent: Claude Code, Codex…) đứng **một bàn riêng** (git worktree). Không ai giẫm lên nguyên liệu của ai.
> - Bếp trưởng (anh) đứng giữa, nhìn **màn hình camera** của mọi bàn (terminal chia ô), thấy bàn nào đang nấu, bàn nào đang chờ hỏi ý.
> - Muốn thử 3 cách nấu cùng một món thì giao cùng một phiếu order cho 3 bàn, nếm xong chọn đĩa ngon nhất (fan-out prompt, so diff, merge bản tốt nhất).
> - Ra khỏi bếp vẫn cầm **bộ đàm** (app điện thoại) để nghe báo "xong món" và nhắn thêm.

Điểm quan trọng: 📖 *"Works with any CLI agent — if it runs in a terminal, it runs in Orca."* Orca **không tự làm agent**. Nó là cái vỏ điều phối quanh các agent CLI có sẵn.

---
## 🧩 Tính năng chính (📖 theo README)
1. **Parallel Worktrees**: một prompt gửi cho 5 agent, mỗi agent một worktree. So kết quả rồi merge bản thắng.
2. **Terminal Splits**: terminal vẽ bằng WebGL, chia ô không giới hạn, lịch sử (scrollback) còn sau khi tắt mở app.
3. **Design Mode**: bấm vào phần tử UI trong cửa sổ Chromium thật, Orca gửi HTML, CSS và ảnh cắt vào prompt của agent.
4. **GitHub & Linear**: xem PR, issue, board ngay trong app. Mở worktree từ một task.
5. **SSH Worktrees**: chạy agent trên máy mạnh ở xa, có sửa file, git, terminal, tự kết nối lại, chuyển tiếp cổng (port forwarding).
6. **Annotate AI Diffs**: comment lên từng dòng diff rồi gửi lại cho agent.
7. **Orca CLI**: *"Agents drive Orca too"*. Agent cũng điều khiển được Orca bằng `orca worktree create`, `snapshot`, `click`, `fill`.
8. **Mobile Companion**: app iOS/Android báo khi agent xong và gửi câu hỏi tiếp.
9. Thêm: Quick open, đổi tài khoản + theo dõi usage/rate limit của Claude và Codex, Computer Use (agent điều khiển app desktop), thông báo.

README kể tên hơn 25 agent được hỗ trợ: Claude Code, Codex, Cursor, GitHub Copilot, Gemini, OpenCode, Pi, Amp, Hermes Agent ([[0-Hermes Agent là gì]]), Devin, Goose, Cline…

---
## 🏗️ Công nghệ lõi
📖 Lấy từ `package.json` (bản clone) và `app.asar` của bản đang cài:

| Lớp | Công nghệ | Dùng để |
|---|---|---|
| Khung app | `electron` 43.7.5, build bằng `electron-vite` | App desktop viết bằng web, chạy Mac/Windows/Linux |
| Giao diện | `react` 19.2, `zustand` 5, `tailwindcss` 4, `monaco-editor` | UI, quản lý state, editor code (lõi của VS Code) |
| Terminal | `node-pty`, `@xterm/xterm` 6.1 beta, `@xterm/headless`, `@xterm/addon-serialize` | Shell thật + vẽ terminal + lưu lịch sử |
| Agent | `@anthropic-ai/claude-agent-sdk`, mỗi agent một thư mục adapter trong `src/main/` | Chạy và theo dõi agent |
| Từ xa | `ssh2`, `ws`, `tweetnacl` | Worktree qua SSH, kết nối mã hoá với điện thoại |
| Trình duyệt | `agent-browser` + Chromium của Electron | Trình duyệt cho agent dùng |
| Native | Swift (computer use macOS), C/C++, Rust, Kotlin | Điều khiển máy, phần riêng của từng hệ điều hành |
| Cloud relay | thư mục `cloud/`, có HCL (Terraform) | Máy trung gian nối điện thoại với desktop |

📖 GitHub API `languages`: TypeScript ~191.7 MB mã, JavaScript ~8.3 MB, Swift ~0.39 MB, HCL ~0.30 MB. Tức là TypeScript chiếm khoảng 96%.

Chi tiết từng lớp nằm ở các note con (xem mục lục cuối bài).

---
## 📏 Quy mô
📖 Số liệu GitHub API (2026-10-14): **91,678 sao**, **5,854 fork**, repo tạo ngày **2026-03-17**, giấy phép **MIT** (`LICENSE`: "Copyright (c) 2026 Lovecast Inc."). Tác giả trên GitHub là `stablyai`.

📖 Đếm file mã (`.ts/.tsx/.swift/.rs/.c/.mm/.cc`, bỏ `node_modules`) trên bản clone:

| Thư mục | Số file | Trong đó file test |
|---|---|---|
| `src/main` (tiến trình chính) | 12,206 | 5,602 |
| `src/renderer` (giao diện) | 11,872 | 4,775 |
| `src/shared` | 3,135 | 1,102 |
| `src/cli` | 389 | 163 |
| `mobile` | 2,729 | 987 |
| `cloud` | 400 | 220 |
| `native` | 45 | 0 |

Lệnh đã chạy: `find <dir> \( -name '*.ts' -o -name '*.tsx' … \) -not -path '*/node_modules/*' | wc -l`.

💭 Gần một nửa số file là test. Repo mới 7 tháng mà đã gần 30 nghìn file. Kiểu "ship daily" này chỉ giữ nổi nhờ cả hệ thống kiểm tra tự động, xem [[9-Kỹ thuật giữ chất lượng code]].

---
## 🔁 Một vòng làm việc điển hình
Ví dụ: anh có task Linear "sửa lỗi VIP tier" cho repo `joy`.
1. Mở task trong Orca, bấm tạo worktree. Orca chạy `git worktree add` và chạy script setup trong `orca.yaml` (xem [[3-Worktree & Git]]).
2. Orca mở một terminal thật (PTY) trong worktree đó và chạy `claude` (xem [[2-Terminal & PTY]]).
3. Hook của agent báo trạng thái về Orca: đang làm / chờ anh trả lời / xong. Sidebar đổi icon, máy và điện thoại hiện thông báo (xem [[4-Tích hợp agent]], [[8-Mobile & Cloud relay]]).
4. Agent mở trang admin trong trình duyệt của Orca để tự kiểm UI, hoặc gọi `orca` CLI để chụp và bấm (xem [[5-Browser & Computer use]], [[6-CLI, RPC & Skills]]).
5. Anh xem diff trong Orca, comment lên dòng sai, gửi lại cho agent.
6. Xong việc thì xoá worktree. Orca kiểm an toàn trước khi xoá.

Toàn bộ các bước trên chạy qua kiến trúc nhiều tiến trình, xem [[1-Kiến trúc tiến trình]]. Nếu máy mình yếu thì chuyển sang máy xa, xem [[7-Remote - SSH, WSL, VM]].

---
## 💭 So với cách tự làm bằng tay
| Việc | Tự làm (tmux + git) | Orca |
|---|---|---|
| Tạo môi trường riêng cho mỗi agent | Gõ `git worktree add`, copy `.env`, cài package | Một nút bấm, script setup trong `orca.yaml` |
| Biết agent nào đang chờ mình | Tự lướt qua từng cửa sổ tmux | Icon trạng thái + thông báo |
| Xem diff và góp ý | Mở editor riêng, copy đoạn sai dán vào chat | Comment trên dòng diff rồi gửi thẳng |
| Theo dõi khi ra ngoài | Không có | App điện thoại |

💭 Cái giá phải trả: app Electron nặng, mỗi pane là một tiến trình thật. Trên máy 16 GB đang chạy thêm dev stack, không nên mở quá nhiều agent cùng lúc trên máy local.

---
## 📚 Mục lục bộ note
0. [[0-Tổng quan]]: note này.
1. [[1-Kiến trúc tiến trình]]: Electron main/preload/renderer, daemon `orcad`, IPC/RPC, lưu trạng thái.
2. [[2-Terminal & PTY]]: `node-pty`, xterm.js, giữ scrollback sau khi khởi động lại, tích hợp shell (OSC 133).
3. [[3-Worktree & Git]]: tạo/xoá worktree, `orca.yaml`, diff, GitHub/GitLab/Linear.
4. [[4-Tích hợp agent]]: chạy agent, hook báo trạng thái, đổi tài khoản, usage, ACP.
5. [[5-Browser & Computer use]]: Chromium nhúng, Design Mode, `agent-browser`, computer use.
6. [[6-CLI, RPC & Skills]]: `orca` CLI nói chuyện với app thế nào, skill phát cho agent.
7. [[7-Remote - SSH, WSL, VM]]: worktree trên máy xa.
8. [[8-Mobile & Cloud relay]]: app điện thoại, ghép cặp, mã hoá đầu-cuối.
9. [[9-Kỹ thuật giữ chất lượng code]]: ratchet, anti-slop, cách team giữ repo do AI viết khỏi nát.

Liên quan: [[Harness trong AI là gì]], [[parallel-agent-workflow-research]].

---
## Nguồn
- https://github.com/stablyai/orca (README, LICENSE, package.json tại commit `9db7b8b`)
- GitHub API: `gh api repos/stablyai/orca`, `gh api repos/stablyai/orca/languages`
- https://onorca.dev (trang chủ, được README dẫn tới)
- `/Applications/Orca.app/Contents/Resources/app.asar` → `package.json` (bản 1.4.224 trên máy)
