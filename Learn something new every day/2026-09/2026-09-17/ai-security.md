# 🤖 AI, Security & Khác — 2026-09-17

> Ngày của "AI agent bị biến thành vector tấn công": worm Shai-Hulud lan qua session coding assistant bị chiếm, extension trình duyệt giả mạo trang vendor để điều khiển AI agent; bên cạnh đó Gemini ra model Live audio-to-audio và GitHub trending toàn skill/plugin cho coding agent.

## 🔒 Security

### ⭐ [Attacker Hijacks AI Coding Assistant Session, Spreads Shai-Hulud Across About 100 Repositories](https://thehackernews.com/2026/09/attacker-hijacks-ai-coding-assistant.html) — (The Hacker News, 16/09/2026)

**Đây là gì:** Một nhà cung cấp SaaS (không nêu tên) bị tấn công theo kiểu mới: kẻ tấn công chiếm quyền một **session AI coding assistant đang hoạt động** của developer, rồi dùng chính assistant đó để "gợi ý" package đã bị đầu độc — lập trình viên chấp nhận gợi ý và cài malware vào máy.

**Chi tiết:**
- Attacker giành quyền điều khiển session coding assistant đang chạy, sau đó "recommended software that the attacker had poisoned, and the recommendation was accepted".
- Chuỗi lây: cài công cụ info-stealer qua một **PyPI package đã bị compromise**, kèm đánh cắp **GitHub OAuth token**.
- Hậu quả: khoảng **100 repository nội bộ** bị nhiễm worm **Shai-Hulud**; secrets trong repo và source code sản phẩm bị lấy đi.
- Lây đợt hai xảy ra khi một nhân viên khác pull package đã bị đầu độc từ **chính namespace nội bộ của công ty**.
- Mandiant khuyến nghị 3 biện pháp: (1) validate dependency do AI gợi ý bằng checksum + allowlist, (2) chặn extension truy cập trực tiếp API key / OAuth token, (3) route toàn bộ traffic dependency qua internal repository có kiểm soát.

**Vì sao đáng đọc:** Đây đúng mô hình làm việc của Joy Loyalty — dev dùng coding agent gợi ý package npm rồi `npm i` ngay; nên bật lockfile + `npm ci`, review mọi dependency do agent đề xuất, và xoay vòng GitHub OAuth token / service account key của Firebase-GCP nếu từng cài package lạ theo gợi ý AI.

### [One Extension Could Hijack AI Assistants Across Chrome, Comet, Edge, Opera Neon and Claude](https://thehackernews.com/2026/09/one-extension-could-hijack-ai.html) — (The Hacker News, 16/09/2026)

**Đây là gì:** Nghiên cứu của Forever Security cho thấy **một extension trình duyệt duy nhất**, chỉ cần 2 quyền phổ biến (sửa nội dung trang + quản lý network traffic), có thể inject code vào các trang vendor "được tin cậy" (ví dụ gemini.google.com) và **giả mạo vendor để ra lệnh cho AI agent trong browser**. Chrome/Comet có thể bị đọc file local và truy cập camera/mic; Edge, Opera Neon và Claude in Chrome bị điều khiển agent. Chrome vá ở bản 143.0.7499.192 (**CVE-2026-0628**, severity 8.8), Edge vá ở 150.0.4078.48 (**CVE-2026-55945**, severity 4.2); Comet, Opera Neon và Claude chưa được cấp CVE và được mô tả là chưa vá. Chưa có bằng chứng bị khai thác thực tế.

**Vì sao đáng đọc:** Nếu bạn dùng browser AI agent để thao tác trên Shopify Admin hay Firebase Console, một extension rác trong cùng profile có thể mượn quyền đó — nên tách profile Chrome riêng cho công việc, cập nhật Chrome lên ≥143.0.7499.192 và dọn extension không dùng.

## 🤖 AI

### [Gemini 3.8 Live và Gemini 3.8 Live Extended Thinking](https://ai.google.dev/gemini-api/docs/changelog) — (Gemini API release notes, 15/09/2026)

**Đây là gì:** Google phát hành 2 model **audio-to-audio** cho ứng dụng voice real-time: `Gemini 3.8 Live` và `Gemini 3.8 Live Extended Thinking`, với interleaved reasoning, **asynchronous function calling mặc định** và full session client content updates. Cũng trong tháng 9: Lyria 3.5 GA (03/09) và Gemini 3.8 Flash GA (02/09) — bản Flash "thông minh nhất" nhắm long-horizon software engineering và autonomous agents.

**Vì sao đáng đọc:** Async function calling mặc định là thứ đáng chú ý nếu muốn làm voice/chat support agent cho merchant — agent có thể gọi API Joy Loyalty (tra điểm, tra tier) mà không chặn luồng hội thoại; Gemini 3.8 Flash thì hợp làm batch job JS trên Cloud Run vì rẻ hơn model pro.

## 📦 GitHub Trending

### [cloudflare/security-audit-skill](https://github.com/cloudflare/security-audit-skill) — (GitHub Trending, JavaScript — 927 sao hôm nay, 7.7k tổng)

**Đây là gì:** Skill cho coding agent (Claude Code, Cursor…) biến agent thành security auditor chạy 6 phase: reconnaissance → coverage-led hunting (agent độc lập đi tìm lỗi) → candidate validation (agent mới cố bác bỏ finding) → structured output → independent verification → neutral report. Kết quả ra `findings.json` với 3 verdict: `confirmed`, `needs_validation`, `rejected`. Chủ yếu là markdown + validator viết bằng **JavaScript (Node.js)**, không cần TypeScript. Kích hoạt bằng prompt tự nhiên kiểu "security audit this codebase".

**Vì sao đáng đọc:** Cơ chế adversarial validation (agent tìm lỗi ≠ agent xác minh) cắt được false positive — hợp để quét app Shopify: chỗ verify HMAC webhook, session token, và rule Firestore.

### [anthropics/knowledge-work-plugins](https://github.com/anthropics/knowledge-work-plugins) — (GitHub Trending, Python — 110 sao hôm nay, 24.3k tổng)

**Đây là gì:** Repo mã nguồn mở của Anthropic gồm **11 plugin** chuyên hóa Claude theo vai trò công việc (Productivity, Sales, Customer Support, Product Management, Marketing, Legal, Finance, Data, Enterprise Search, Bio Research, Cowork Plugin Management). Mỗi plugin gồm Skills (kiến thức domain Claude tự dùng), Commands (slash command kiểu `/sales:call-prep`) và Connectors (MCP server nối tool ngoài). Toàn bộ là file markdown/JSON, không cần viết code. Dùng cho Claude Cowork, tương thích Claude Code: `claude plugin marketplace add anthropics/knowledge-work-plugins`.

**Vì sao đáng đọc:** Plugin Data có connector sẵn cho **BigQuery/Snowflake/Databricks** — mẫu tốt để dựng plugin nội bộ Joy Loyalty (truy vấn analytics loyalty, triage ticket merchant) mà chỉ cần viết markdown thay vì code.
