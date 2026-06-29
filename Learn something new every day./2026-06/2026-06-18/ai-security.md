# 🤖 AI, Security & Khác — 2026-06-18

> Hôm nay là ngày Gemini CLI ngừng phục vụ tier free/Pro/Ultra (chuyển sang Antigravity CLI); cùng lúc làn sóng npm worm dòng Shai-Hulud tiếp tục với vụ Miasma trên package Red Hat — chuyên đánh cắp GitHub token, SSH key và cloud credentials.

## 🤖 AI

### ⭐ [Gemini CLI chính thức ngừng phục vụ từ 18/06, ép migrate sang Antigravity CLI](https://developers.googleblog.com/an-important-update-transitioning-gemini-cli-to-antigravity-cli/) — (Google Developers Blog)
**Đây là gì:** Hôm nay (18/06/2026) Google ngừng phục vụ request của Gemini CLI và Gemini Code Assist IDE extension cho các tier free/AI Pro/Ultra. Tool thay thế là **Antigravity CLI** (viết bằng Go), định hướng agent-first, orchestrate nhiều agent chạy nền song song.
**Chi tiết:**
- Bị ảnh hưởng: user free (Gemini Code Assist for individuals), Google AI Pro và Ultra, và GitHub org (từ hôm nay không cho cài mới, các tuần sau ngừng phục vụ request cho Gemini Code Assist for GitHub).
- Antigravity CLI viết bằng Go nên "snappier", chạy refactor lớn / research nhiều topic ở background mà không khóa terminal session.
- Tính năng được giữ lại: Agent Skills, Hooks, Subagents, Extensions (giờ gọi là Antigravity plugins). Lưu ý: KHÔNG có feature parity 1:1 ngay từ đầu.
- Ngoại lệ enterprise: org dùng Gemini Code Assist **Standard/Enterprise** hoặc qua Google Cloud thì truy cập Gemini CLI vẫn không đổi.
- Việc cần làm nếu đang phụ thuộc Gemini CLI: đọc doc migration để chuyển sang `agy` (Antigravity CLI) — automation/script cũ gọi `gemini` có thể vỡ.
**Vì sao đáng đọc:** Nếu team có script CI hay workflow nào gọi Gemini CLI ở tier free/Pro, hôm nay là deadline — cần kiểm tra ngay và đổi sang Antigravity CLI hoặc fallback về Claude Code/Codex để không gãy pipeline.

### [Làn sóng model coding tháng 6: GPT-5.6, Gemini 3.5 Pro, Claude 4.8 cùng đổ bộ](https://www.cnbc.com/2026/06/01/microsoft-and-google-take-on-anthropic-and-openai-in-ai-coding-models.html) — (CNBC)
**Đây là gì:** Tháng 6/2026 chứng kiến hàng loạt model mới hướng coding ra mắt sát nhau — GPT-5.6 (OpenAI), Gemini 3.5 Pro (Google, từng giữ lại ở Google I/O 19/05), và Claude 4.8. Microsoft và Google đang đẩy mạnh để cạnh tranh trực tiếp với Anthropic và OpenAI ở mảng AI coding model.
**Vì sao đáng đọc:** Cuộc đua model coding nóng lên nghĩa là giá/chất lượng agentic coding thay đổi liên tục — đáng theo dõi để cân nhắc model nào dùng cho Claude Code và backend Node của team.

## 🔒 Security

### ⭐ [Miasma: npm worm dòng Shai-Hulud tấn công 32 package Red Hat, đánh cắp cloud credentials](https://www.wiz.io/blog/miasma-supply-chain-attack-targeting-redhat-npm-packages) — (Wiz)
**Đây là gì:** Ngày 01/06/2026, ít nhất **32 package** thuộc namespace `@redhat-cloud-services` trên npm bị nhiễm payload tên **Miasma** — biến thể của (Mini) Shai-Hulud do nhóm TeamPCP open-source, chỉ thay theme Dune bằng thần thoại Hy Lạp nhưng chức năng "substantially similar".
**Chi tiết:**
- Quy mô: ≥32 package release bị nhiễm, các package này trung bình **~80.000 lượt tải/tuần**.
- Cách lây: chiếm GitHub account của một nhân viên Red Hat → tiêm code độc qua **preinstall script** tự gọi `index.js` độc ngay khi `npm install`.
- Đánh cắp: GitHub token, **SSH key**, **cloud credentials**, và **CI/CD secret**.
- Điểm mới đáng sợ: thêm collector cho **danh tính GCP và Azure** — quét toàn bộ identity mà máy nhiễm có thể truy cập (trước đây chỉ tập trung trích secret).
- Đây là một mắt xích trong chuỗi worm tự lan (Shai-Hulud / Miasma) đã nhiều lần đánh npm từ cuối 2025.
**Vì sao đáng đọc:** Đây đúng kịch bản đáng sợ nhất với team Joy Loyalty — máy dev/CI chạy `npm install` một package nhiễm là lộ GCP/Firebase identity, npm token và CI secret. Cần bật pinning version, kiểm soát preinstall/lifecycle script, và xoay vòng credential nếu nghi ngờ.

### [TanStack bị Mini Shai-Hulud: 42 package npm và hơn 170 package npm/PyPI bị nhiễm](https://snyk.io/blog/tanstack-npm-packages-compromised/) — (Snyk)
**Đây là gì:** Attacker publish **84 phiên bản độc** trên **42 package `@tanstack/*`** bằng cách lợi dụng pattern `pull_request_target` ("Pwn Request"), poison GitHub Actions cache qua ranh giới fork↔base, và trích OIDC token từ bộ nhớ runner — package được chính release pipeline hợp lệ của TanStack đẩy lên dưới identity OIDC tin cậy. Đến cuối ngày, hơn **170 package** trên npm/PyPI bị xác nhận nhiễm (hơn 400 phiên bản độc). Riêng `@tanstack/react-router` có ~12,7 triệu lượt tải/tuần.
**Vì sao đáng đọc:** Cùng họ worm với Miasma và cũng nhắm credential + tự lan; nếu dự án frontend của team dùng TanStack Router/Query thì cần kiểm tra lockfile có dính phiên bản độc ngày 11/05 không.

## 📦 GitHub Trending

### [continuedev/continue](https://github.com/continuedev/continue) — (GitHub)
**Đây là gì:** AI coding agent mã nguồn mở (TypeScript), tích hợp vào IDE/terminal, cho phép tự host và chọn model tùy ý — một đối thủ open-source của Claude Code/Codex/Antigravity.
**Vì sao đáng đọc:** Đáng để so sánh khi muốn một AI coding agent model-agnostic, đặc biệt trong bối cảnh các CLI hãng (Gemini CLI) bị sunset.

### [DeusData/codebase-memory-mcp](https://github.com/DeusData/codebase-memory-mcp) — (GitHub)
**Đây là gì:** MCP server "code intelligence" hiệu năng cao, hỗ trợ 158 ngôn ngữ, cung cấp bộ nhớ/ngữ cảnh codebase cho AI agent qua giao thức MCP.
**Vì sao đáng đọc:** Là MCP server nên cắm thẳng vào Claude Code được — hữu ích để agent hiểu codebase Node/JS lớn của team mà không phải nạp lại context mỗi lần.
