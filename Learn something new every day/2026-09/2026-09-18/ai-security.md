# 🤖 AI, Security & Khác — 2026-09-18

> Gemini API đổi hẳn agent Antigravity (breaking change cho tool local), OpenAI công bố khung báo cáo model misalignment, Docker Sandboxes dính lỗ hổng critical thoát sandbox trên macOS, Gyazo lộ 23,62 triệu bản ghi user, và GitHub trending tuần này toàn tooling cho coding agent.

## 🤖 AI

### ⭐ [Gemini API release notes — antigravity-preview-09-2026](https://ai.google.dev/gemini-api/docs/changelog) — (ai.google.dev, 17/09/2026)
**Đây là gì:** Google phát hành phiên bản agent mới `antigravity-preview-09-2026` trên Gemini API, thay thế bản `antigravity-preview-05-2026`. "Agent" ở đây là model đã được đóng gói sẵn vòng lặp đọc/sửa file + chạy tool, dùng để build coding agent mà không phải tự viết orchestration.

**Chi tiết:**
- `antigravity-preview-09-2026` thay thế và deprecate `antigravity-preview-05-2026`; bản cũ tắt hẳn ngày **05/10/2026**.
- Built-in tools đổi quy ước tham số: dùng **PascalCase** thay vì snake_case → code nào parse `function_call` steps sẽ vỡ.
- Cơ chế sửa file đổi từ ghi đè toàn bộ file sang **line-range replacements** (thay theo khoảng dòng).
- Bổ sung tool `find_by_name()` và `grep_search()`.
- Nếu chỉ chạy trên remote sandbox (`environment: "remote"`) và chỉ đọc `output_text` / `model_output` steps thì chỉ cần đổi chuỗi tên agent, không cần sửa gì thêm.
- Các entry khác trong tháng: `gemini-3.8-live` + `gemini-3.8-live-extended-thinking` (15/09), `lyria-3.5` GA (03/09), `gemini-3.8-flash` (02/09).

**Vì sao đáng đọc:** Nếu Joy Loyalty có bất kỳ automation nào gọi Gemini agent để đọc/sửa code hay xử lý file (script JS chạy trên Cloud Run/Functions), đây là breaking change có deadline cứng 05/10 — phải đổi tên agent và kiểm lại chỗ parse `function_call` trước khi bản cũ bị tắt.

### [Our framework for reporting model misalignment](https://openai.com/index/model-misalignment-reporting-framework/) — (openai.com, 16/09/2026)
**Đây là gì:** OpenAI công bố khung quy trình để theo dõi, điều tra và công khai các trường hợp model hành xử lệch chuẩn (misalignment), kèm 6 báo cáo sự cố quan sát được trong quá trình train/eval các model chưa phát hành. Khung này chia thành 3 "track" công bố, trong đó có track có deadline công bố cứng tính bằng ngày làm việc.

**Vì sao đáng đọc:** Với dev đang đẩy AI vào workflow (code review, agent tự chạy), đây là tín hiệu rằng lỗi hành vi của model là rủi ro vận hành có thật chứ không phải chuyện lý thuyết — nên giữ human review ở các bước agent chạm vào data merchant hoặc Shopify Admin API.

## 🔒 Security

### ⭐ [Critical Docker Sandboxes Flaw Lets Malicious Guest Code Read and Modify macOS Host Files](https://thehackernews.com/2026/09/critical-docker-sandboxes-flaw-lets.html) — (The Hacker News, 17/09/2026)
**Đây là gì:** Docker Sandboxes (tính năng chạy code trong VM cách ly trên macOS, hay được dùng để cho AI coding agent chạy code mà không đụng máy thật) dính lỗ hổng cho phép code bên trong sandbox thoát ra và đọc/ghi file trên host.

**Chi tiết:**
- **CVE-2026-77179** — Critical, **CVSS 9.4**. Ảnh hưởng Docker Sandboxes **0.28.0 → 0.41.9** trên macOS.
- Cơ chế: code trong sandbox **thay một thư mục cha bằng symlink** để thoát khỏi project directory được share vào, rồi truy cập file host với quyền của user chạy VM → đọc/sửa file bất kỳ, có thể dẫn tới thực thi code.
- **CVE-2026-79994** — High, **CVSS 8.7**, ảnh hưởng **0.37.0 → 0.41.9**: guest thao túng đường dẫn Unix socket relay cũng bằng thủ thuật symlink, làm lộ dữ liệu hoặc khả năng phía host.
- Đã vá ở **0.42.0**, phát hành **07/09/2026**.
- Docker chưa ghi nhận khai thác thực tế; CISA đánh giá exploitation = "none".

**Vì sao đáng đọc:** Nếu bạn đang dùng Docker Sandboxes trên macOS để cho Claude Code / agent chạy code Joy Loyalty, giả định "sandbox nên chạy đại cũng được" là sai — update lên 0.42.0 ngay, vì escape này đọc được cả `.env`, service account key GCP và token Shopify nằm ngoài thư mục project.

### [Gyazo Breach Exposes 23.62 Million User Records and 490 Million Image Metadata Records](https://thehackernews.com/2026/09/gyazo-breach-exposes-2362-million-user.html) — (The Hacker News, 17/09/2026)
**Đây là gì:** Gyazo — công cụ chụp & share ảnh màn hình rất phổ biến trong giới dev — bị đánh cắp **23,62 triệu** bản ghi user (email, password hash, user ID, device ID, login session ID, integration token) và **490 triệu** bản ghi metadata ảnh, gồm cả image ID tạo nên link chia sẻ. Kẻ tấn công khai thác lỗ hổng ở image upload server rồi chạy lệnh tùy ý trên hệ thống. Không có thông tin thanh toán bị lộ. Hoạt động bất thường bị phát hiện 11–12/09, công bố 16/09.

**Vì sao đáng đọc:** Dev hay dùng Gyazo để screenshot Shopify admin, dashboard Firebase, config — mà image ID bị lộ nghĩa là link "unlisted" không còn kín. Nên đổi password Gyazo, thu hồi integration token, và rà lại xem có screenshot nào chứa API key hay data merchant không.

## 📦 GitHub Trending

### [mksglu/context-mode](https://github.com/mksglu/context-mode) — (GitHub Trending tuần 09/2026)
**Đây là gì:** Middleware nằm giữa AI coding agent và tool của nó, cắt bớt output tool ồn ào (repo tuyên bố giảm ~98% output), kèm session memory bền và routing đa nền tảng.
**Vì sao đáng đọc:** Với repo Shopify app nhiều file build/log, phần lớn context window bị đốt bởi output tool vô nghĩa — ý tưởng "sandbox output" này áp dụng được ngay kể cả không cài repo.

### [max-sixty/worktrunk](https://github.com/max-sixty/worktrunk) — (GitHub Trending tuần 09/2026)
**Đây là gì:** CLI (viết bằng Rust) quản lý git worktree, thiết kế riêng cho việc chạy song song nhiều AI agent trên cùng một repo.
**Vì sao đáng đọc:** Khi cho nhiều agent cùng sửa app Joy Loyalty, worktree tách biệt tránh việc agent này ghi đè branch của agent kia — pattern đáng copy dù chỉ dùng `git worktree` thuần.
