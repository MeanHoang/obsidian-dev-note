# 🤖 AI, Security & Khác — 2026-09-15

> Exploit kit BlueMoon ghép 3 zero-day Chrome/Windows đang được 4 nhóm gián điệp dùng chung; OpenAI mở Agents API public beta; Claude Code siết sandbox theo domain; repo agent-skills leo top GitHub trending JavaScript.

## 🔒 Security

### ⭐ [Once in a BlueMoon: Multiple State-Aligned Threat Actors Rapidly Adopt Novel Exploit Chain Using Chrome and Windows Zero-Days](https://www.proofpoint.com/us/blog/threat-insight/once-bluemoon-multiple-state-aligned-threat-actors-rapidly-adopt-novel-exploit) — (Proofpoint, 09/09/2026)

**Đây là gì:** Proofpoint công bố "BlueMoon" — một exploit kit ghép 3 lỗ hổng zero-day để chiếm máy nạn nhân chỉ qua việc mở một trang web bằng Chrome/Chromium, và điều bất thường là nhiều nhóm APT khác nhau cùng xài chung bộ kit này chỉ trong vòng một tuần.

**Chi tiết:**
- Chuỗi khai thác gồm 3 CVE: `CVE-2026-85046` (type confusion trong V8 JavaScript engine của Chromium), `CVE-2026-87491` (thoát sandbox của V8), và `CVE-2026-85880` (leo thang đặc quyền trong Windows kernel).
- Lần sử dụng đầu tiên ghi nhận ngày 28/08/2026 bởi nhóm TA412 (China-aligned), nhắm vào NGO Mỹ, công ty khai khoáng và commodity trading.
- Chỉ trong vài ngày sau đó, các nhóm UNK_LateNight (nhắm hàng không vũ trụ Mỹ), UNK_DoubleCheck (sản xuất tại Việt Nam) và UNK_QuietRacket (chính phủ Indonesia/Singapore) đều lần lượt dùng lại đúng bộ kit này.
- Sau khi chiếm renderer, kit nạp reflective DLL để fingerprint host Windows, chạy exploit LPE, rồi dùng `curl` tải payload từ xa về thực thi.
- Proofpoint khuyến nghị: vá Chrome/Chromium và Windows ngay, giám sát cây tiến trình bất thường `chrome.exe → cmd.exe → curl.exe`, và chặn scheduled task tên `EdgeCore_AutoUpdate`.

**Vì sao đáng đọc:** Máy dev là mục tiêu béo bở nhất (chứa Shopify API token, service account key của Firebase/GCP, session admin) — nếu bạn còn Chrome chưa update sau bản vá Stable đầu tháng 9 thì chỉ cần một link phishing là toàn bộ credential của Joy Loyalty có thể ra ngoài; cập nhật Chrome là việc nên làm ngay hôm nay.

## 🤖 AI

### [OpenAI's new Agents API gives developers the infrastructure behind Codex and ChatGPT](https://the-decoder.com/openais-new-agents-api-gives-developers-the-infrastructure-behind-codex-and-chatgpt/) — (The Decoder, 11/09/2026)

**Đây là gì:** OpenAI mở public beta Agents API — cho phép dev gọi thẳng vào phần "harness" của Codex thay vì tự viết orchestration: agent chạy dài hạn trên cloud, tự quản lý context, gọi tool song song, và delegate việc cho sub-agent. Hỗ trợ MCP, custom function và built-in tool như web search; sandbox chạy trên hạ tầng OpenAI hoặc partner như Cloudflare, Vercel, Oracle. Không có phí thêm ngoài token usage.

**Vì sao đáng đọc:** Nếu bạn từng nghĩ tới việc tự build agent xử lý tác vụ dài (migrate data loyalty, rà soát webhook Shopify hàng loạt), đây là lựa chọn bỏ qua được toàn bộ phần orchestration + sandbox tự viết — nhưng cũng đáng cân nhắc vendor lock-in so với việc tự chạy trên Cloud Run.

### [Claude Code CHANGELOG — v2.1.271 / v2.1.272](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md) — (github.com/anthropics/claude-code)

**Đây là gì:** Hai bản release mới nhất của Claude Code. Điểm đáng chú ý ở 2.1.271: **per-command domain allowlisting** cho Bash/PowerShell chạy trong sandbox (giới hạn từng lệnh chỉ được gọi ra những domain nào), thêm fast mode cho Remote session, mouse support cho config panel, và render Markdown artifact thành trang document có style. Bản 2.1.272 chủ yếu vá ổn định: cache của organization policy, cập nhật tool list, và permission check trong cloud session / self-hosted runner.

**Vì sao đáng đọc:** Domain allowlist theo từng lệnh là thứ trực tiếp hữu ích khi để agent chạy `npm install` hay script gọi Shopify Admin API — bạn khoá được đúng domain cần thiết thay vì mở toang network cho sandbox.

## 📦 GitHub Trending

### [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) — (github.com/trending, JavaScript)

**Đây là gì:** Bộ 25 "skill" đóng gói quy trình engineering production-grade cho AI coding agent, do Addy Osmani (Google Chrome) làm — gồm 9 slash command map theo từng pha dev (`/spec`, `/plan`, `/build`, `/test`, `/review`, `/ship`...), 4 agent persona reviewer (code reviewer, test engineer, security auditor, performance auditor) và 7 reference checklist về testing, security, performance, accessibility, observability. Chạy được trên 15+ platform gồm Claude Code, Cursor, Copilot, Codex, Gemini CLI.

**Vì sao đáng đọc:** Thay vì prompt tay mỗi lần, bạn có thể lấy nguyên checklist security/performance của repo này áp vào review code Shopify app — đặc biệt phần security auditor persona rất hợp với code động tới token và webhook.
