# 🤖 AI, Security & Khác — 2026-09-04

> Anthropic đưa zero-data-retention lên tầm enterprise, Codex CLI ra loạt bản vá nhỏ, còn phía security thì CISA thêm 7 lỗ hổng đang bị khai thác — trong đó có Artifactory và LiteLLM (MCP).

## 🤖 AI

### ⭐ [Developing Enterprise Frontier Safeguards with our customers](https://www.anthropic.com/news/enterprise-frontier-safeguards) — (Anthropic, 01/09/2026)

**Đây là gì:** Anthropic công bố **Enterprise Frontier Safeguards (EFS)** — cách kết hợp *zero data retention* (Anthropic không giữ lại dữ liệu prompt/response) với cơ chế phát hiện lạm dụng (misuse detection). Trước đây hai thứ này mâu thuẫn nhau: muốn Anthropic phát hiện misuse thì phải để họ giữ log; muốn giữ privacy tuyệt đối thì mất lớp an toàn đó. EFS giải bằng cách đẩy phần lưu trữ về phía khách hàng.

**Chi tiết:**
- Dữ liệu được lưu trong **hạ tầng cloud do chính khách hàng kiểm soát**, thay vì hệ thống của Anthropic — nghĩa là không cần thêm một vendor được tin cậy nữa trong chuỗi.
- Khách hàng tự quản **encryption key, access policy và audit logging** dưới quyền của mình.
- Quy trình giám sát an toàn **hoàn toàn tự động, không có Anthropic human review** — các flag đi thẳng về đội của khách hàng để họ tự đánh giá và xử lý.
- Được xây dựng cùng **hơn 100 khách hàng** thuộc tài chính, y tế, sản xuất và các ngành bị quản lý chặt, cộng với AWS, Google Cloud và Microsoft Azure.
- Triển khai **theo từng giai đoạn bắt đầu mùa thu 2026**; trong lúc chờ, khách hàng đủ điều kiện được cấp quyền zero data retention trên các model Claude Fable.

**Vì sao đáng đọc:** Đây là bản thiết kế tham chiếu tốt cho câu hỏi "làm sao vừa gửi dữ liệu merchant cho LLM vừa không để dữ liệu rời khỏi tầm kiểm soát" — với Joy Loyalty, mô hình "log ở phía mình, detection ở phía vendor" là hướng đáng cân nhắc khi bọn mình đưa dữ liệu member/order vào AI feature.

### [ChatGPT & Codex changelog — Codex CLI 0.152.1 → 0.153.2](https://learn.chatgpt.com/docs/changelog) — (OpenAI, 01–03/09/2026)

**Đây là gì:** Chuỗi bản phát hành nhỏ của Codex CLI (coding agent chạy trong terminal của OpenAI) trong 3 ngày đầu tháng 9. Bản 0.153.0 (03/09/2026) bổ sung Vim mode có undo `u` / redo `Ctrl+R` giữ nguyên draft kể cả nội dung paste và attachment, plugin CLI có thể list/install/remove plugin từ **remote marketplace**, tuỳ chọn `tui.auto_recap = false` để tắt recap tự động, TUI tự reconnect khi mất kết nối app-server mà vẫn giữ draft, và cảnh báo rate-limit sớm hơn cho user Plus/Team. Bản 0.152.1 (01/09) sửa Guardian approval review để tôn trọng Node REPL policy từ model metadata.

**Vì sao đáng đọc:** Hướng "plugin marketplace cho coding agent" đang thành chuẩn chung (Claude, Cursor, Codex đều đi lối này) — nếu dev workflow ở Joy Loyalty muốn đóng gói convention Shopify/Polaris/Firebase thành thứ tái dùng được, đây là format nên nhắm tới thay vì copy prompt thủ công.

## 🔒 Security

### [CISA Adds Seven Exploited Flaws as Attackers Deploy Reverse Shells and Crypto Miners](https://thehackernews.com/2026/09/cisa-adds-seven-exploited-flaws-as.html) — (The Hacker News, 03/09/2026)

**Đây là gì:** CISA thêm 7 lỗ hổng **đang bị khai thác thực tế** vào KEV catalog, với hạn vá cho cơ quan liên bang Mỹ là 05/09/2026. Danh sách: CVE-2026-83548 (SonicWall SMA, SSRF, CVSS 10.0), CVE-2026-83549 (SonicWall SMA, command injection, 7.8), CVE-2026-9586 (Sangoma Switchvox, SQL injection, 9.3), CVE-2026-82329 (JFrog Artifactory, authentication bypass, 9.8), CVE-2026-48710 (Starlette, HTTP smuggling, 6.5), CVE-2026-49869 (Kestra, command injection, 10.0), CVE-2026-59822 (LiteLLM, lỗi authentication, 8.8). Attacker được ghi nhận thả reverse shell và crypto miner, nhắm cả vào hạ tầng AI lẫn hệ thống doanh nghiệp.

**Vì sao đáng đọc:** Hai cái đáng chú ý cho dev: **LiteLLM CVE-2026-59822** cho phép attacker chưa xác thực mở session MCP hợp lệ bằng Bearer token bất kỳ trên endpoint MCP Streamable HTTP — ai đang tự host LLM gateway/MCP server nội bộ (kể cả cho MCP của Joy) phải vá ngay; và **Artifactory** nhắc lại rằng artifact registry là điểm chết người của supply chain.

### [GitLab CVE-2026-19478 Comes Under Active Exploitation Within Days of Disclosure](https://thehackernews.com/2026/08/gitlab-cve-2026-19478-comes-under.html) — (The Hacker News, 21/08/2026)

**Đây là gì:** Lỗ hổng GitLab CVSS 9.4 cho phép **attacker chưa xác thực sửa hoặc xoá các project public và ghi đè dữ liệu của chúng** mà không cần credential. Nhóm watchTowr cho biết họ tái hiện được lỗ hổng "trong vòng vài phút sau khi công bố", và honeypot ghi nhận khai thác thật. Ảnh hưởng GitLab 18.2 trước 18.11.11 và các nhánh 19.0–19.2. Điểm nhấn của bài là **AI đang rút ngắn khoảng cách từ disclosure đến exploitation**.

**Vì sao đáng đọc:** Nếu team còn self-host GitLab (mirror, CI cũ) thì đây là bài "vá trong ngày, không phải trong sprint"; rộng hơn, giả định "còn vài tuần để vá sau khi CVE công bố" đã hết hiệu lực.

## 📦 GitHub Trending

### [tt-a1i/archify](https://github.com/tt-a1i/archify) — (GitHub Trending, JavaScript)
**Đây là gì:** Agent skill sinh sơ đồ kiến trúc / workflow / sequence / data-flow / lifecycle, xuất ra HTML self-contained có animation và export sắc nét. Mô tả hệ thống bằng chữ → compile qua một JSON IR có kiểu → ra HTML/SVG deterministic. Đang ~46k sao, tăng hơn 24k sao chỉ trong tuần.

### [bilawalsidhu/gods-eye-view](https://github.com/bilawalsidhu/gods-eye-view) — (GitHub Trending, JavaScript)
**Đây là gì:** "Spy satellite simulator" chạy trong trình duyệt nhưng dữ liệu là thật — máy bay, vệ tinh, tàu biển, động đất, giao thông, camera công cộng phủ lên quả địa cầu 3D. Dựng bằng CesiumJS + Vite, không cần API key để chạy thử. ~17k sao, từng đứng #1 GitHub Trending.

### [DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail) — (GitHub Trending, đa nền tảng / Node.js)
**Đây là gì:** Bộ ruleset khiến AI agent "suy nghĩ như senior dev lười nhất phòng" — triết lý "code tốt nhất là code bạn không viết". Ruleset gốc nằm ở `AGENTS.md` rồi port sang 20+ agent/IDE (Cursor, Kiro, .agents...). Tăng ~9.5k sao trong tuần.
