# 🤖 AI, Security & Khác — 2026-07-07

> Anthropic mở Claude Science cho dân nghiên cứu, npm/Langflow tiếp tục là mặt trận supply-chain, và trending JS tuần này toàn công cụ "memory" cho AI agent.

## 🤖 AI

## ⭐ [Claude Science — AI workbench cho nhà khoa học](https://www.anthropic.com/news/claude-science-ai-workbench) — (anthropic.com)
**Đây là gì:** App mới của Anthropic gom database, code, compute và workflow nghiên cứu vào một môi trường duy nhất, tối ưu Claude cho phòng lab và ngành dược. Ra mắt 30/06/2026, đang beta.

**Chi tiết:**
- Beta cho user **Claude Pro, Max, Team, Enterprise** (không chỉ enterprise).
- Pre-config sẵn **60+ database khoa học** + connector cho genomics, single-cell, proteomics, structural biology, cheminformatics.
- Phân tích literature, chạy nghiên cứu multi-step, sinh **artifact có thể audit**, tinh chỉnh figure/manuscript tới mức publish.
- Anthropic tài trợ tới **50 dự án "AI for Science"**, mỗi dự án tối đa **$30,000 credit**; đăng ký tới 15/07, thông báo trước 31/07.
- Anthropic dùng chính Claude Science để tự chạy nghiên cứu thuốc cho bệnh hiếm.

**Vì sao đáng đọc:** Cùng kiến trúc "workbench gom nhiều tool + sinh artifact auditable" chính là hướng Anthropic đang đẩy cho mọi vertical — đáng để hình dung một "Claude for X" tương tự có thể áp cho phân tích data loyalty/retention (gom Firebase, BigQuery, cohort tool vào một workspace).

## [OpenAI DevDay 2026 mở đăng ký](https://openai.com/index/devday-2026/) — (openai.com)
**Đây là gì:** OpenAI công bố hội nghị developer thường niên DevDay 2026, dự kiến **29/09 tại San Francisco**; đơn đăng ký đóng **10/07**, có suất free vé qua bốc thăm hàng tuần cho ai đã ship dự án với tool của OpenAI.
**Vì sao đáng đọc:** Mốc cần theo dõi nếu định dùng API OpenAI trong app — các thay đổi lớn về API/Codex thường được hé lộ quanh DevDay.

## [Anthropic redeploy Claude Fable 5](https://www.anthropic.com/news/redeploying-fable-5) — (anthropic.com)
**Đây là gì:** Fable 5 được mở lại toàn cầu từ 01/07 trên Claude Platform, Claude.ai, Claude Code và Cowork, sau khi bị tạm ngưng 12/06 do export control (nay đã gỡ).
**Vì sao đáng đọc:** Nếu workflow của bạn từng pin vào Fable 5 thì model đã trở lại — không cần fallback tạm nữa.

## 🔒 Security

## ⭐ [AI Agent bị lợi dụng khai thác Langflow RCE để tự động hóa ransomware](https://thehackernews.com/2026/07/ai-agent-exploits-langflow-rce-to.html) — (thehackernews.com)
**Đây là gì:** Kẻ tấn công dùng chính một AI agent để tự động khai thác lỗ hổng RCE trong **Langflow** (framework low-code phổ biến để dựng pipeline LLM/agent) rồi tự động chạy ransomware lên database nạn nhân.
**Vì sao đáng đọc:** Cột mốc đáng lo — attacker đang tự động hóa toàn bộ chuỗi khai thác bằng AI agent; bất kỳ tool AI/LLM self-host nào (kể cả nội bộ) mở ra internet đều là bề mặt tấn công phải patch ngay.

## [Lỗ hổng filesystem FatFs nhúng trong hàng triệu thiết bị embedded](https://thehackernews.com/2026/07/unpatched-flaws-disclosed-in-filesystem.html) — (thehackernews.com)
**Đây là gì:** Bug đầu bảng **CVE-2026-6682 (CVSS 7.6)** — integer overflow khi mount volume FAT32 trong thư viện FatFs; PoC (disk image, test harness, exploit QEMU) đã public.
**Vì sao đáng đọc:** Không đụng trực tiếp web/Shopify, nhưng là ví dụ điển hình về rủi ro thư viện nền tảng dùng lại khắp nơi — nhắc nhở audit dependency low-level trong bất kỳ firmware/thiết bị nào bạn tích hợp.

## 📦 GitHub Trending

## ⭐ [thedotmack/claude-mem](https://github.com/thedotmack/claude-mem) — (github.com)
**Đây là gì:** Plugin JS/Node cho persistent memory across sessions của AI agent: capture việc agent làm, nén bằng AI, inject context liên quan vào session sau. Hỗ trợ Claude Code, Codex, Gemini, Copilot, OpenCode… Data lưu local ở `~/.claude-mem/`, cài qua `npx claude-mem install`, license AGPL-3.0.
**Vì sao đáng đọc:** Giải quyết đúng nỗi đau "mất context giữa các phiên" khi dùng AI để code app — đáng thử để agent nhớ được kiến trúc dự án Firebase/React của bạn qua nhiều session.

## [diegosouzapw/OmniRoute](https://github.com/diegosouzapw/OmniRoute) — (github.com)
**Đây là gì:** AI gateway mã nguồn mở (MIT), một endpoint OpenAI-compatible nối tới 231+ provider (50+ free), có smart routing, load balancing, fallback, nén token (RTK+Caveman) tiết kiệm 15-95%; cắm được Claude Code, Codex, Cursor, Cline, Copilot.
**Vì sao đáng đọc:** Nếu muốn thử nhiều model mà không đổi code, hoặc cần một lớp routing/fallback + tiết kiệm token trước LLM — pattern gateway này rất hữu ích cho backend dùng nhiều provider.

<!-- 🎁 Loyalty: không có tin đủ lớn tuần này (Rivo/BON/Smile/LoyaltyLion) → skip -->
