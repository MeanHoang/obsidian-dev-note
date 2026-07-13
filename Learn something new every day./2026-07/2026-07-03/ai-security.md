# 🤖 AI, Security & Khác — 2026-07-03

> Anthropic đưa Fable 5 trở lại toàn cầu sau khi Mỹ gỡ kiểm soát xuất khẩu, SharePoint dính RCE đang bị khai thác thực tế, và GitHub trending phủ đầy tool AI-dev.

## 🤖 AI
### ⭐ [Claude Fable 5 & Mythos 5](https://www.anthropic.com/news/claude-fable-5-mythos-5) — (anthropic.com)
**Đây là gì:** Cặp model Mythos-class của Anthropic (ra mắt 9/6, Fable 5 vừa được khôi phục toàn cầu ngày 1/7 sau khi Mỹ gỡ export controls). Fable 5 là bản general-purpose có guardrail; Mythos 5 là cùng model nhưng ít hạn chế, chỉ dành cho đối tác cybersecurity/nghiên cứu được duyệt.
**Chi tiết:**
- Điểm benchmark state-of-the-art gần như toàn bộ metric về software engineering, knowledge work, vision và nghiên cứu khoa học; chạy tự động qua hàng triệu token.
- Ví dụ dẫn chứng: Fable 5 "nén nhiều tháng engineering thành vài ngày" cho migration codebase của Stripe; Mythos 5 được nhà khoa học chọn giả thuyết ~80% trong so sánh mù về molecular biology/genomics.
- Giá: $10 / 1M input token và $50 / 1M output token. Khi khôi phục ngày 1/7, Anthropic thêm bộ classifier mới chặn nhiều tác vụ cybersecurity hơn, đồng thời đề xuất framework chấm điểm mức độ nghiêm trọng của jailbreak cùng Amazon, Microsoft, Google.
**Vì sao đáng đọc:** Fable 5 đang là top coding model (Terminal-Bench 2.1 ~83.1% qua Claude Code) — mức giá và năng lực agentic này định hình lựa chọn tool khi build feature loyalty phức tạp; classifier cybersecurity mới có thể ảnh hưởng prompt liên quan bảo mật trong workflow dev.

## 🔒 Security
### [SharePoint RCE CVE-2026-45659 vào CISA KEV](https://thehackernews.com/2026/07/sharepoint-rce-cve-2026-45659-added-to.html) — (thehackernews.com)
**Đây là gì:** Lỗ hổng remote code execution trên SharePoint Server (deserialization dữ liệu không tin cậy, CVSS 8.8) đã bị khai thác thực tế, được CISA thêm vào Known Exploited Vulnerabilities với hạn vá cho cơ quan Mỹ là 4/7/2026. Microsoft đã ra bản vá từ tháng 5/2026 cho SharePoint Subscription Edition, 2019 và Enterprise 2016; bất kỳ attacker đã xác thực nào (không cần quyền admin) đều trigger được.
**Vì sao đáng đọc:** Nhắc lại bài học nền tảng: chỉ ~7% CVE năm 2026 thực sự bị khai thác — ưu tiên patch theo KEV thay vì chạy theo toàn bộ ~66k CVE dự báo; nếu tích hợp bất kỳ dịch vụ SharePoint/enterprise nào cho khách, đây là mục cần rà.

## 📦 GitHub Trending
### [santifer/career-ops](https://github.com/santifer/career-ops) — hệ thống tìm việc AI-powered với 14 "skill modes", dashboard viết bằng Go và xử lý batch; ~58k sao, đang leo mạnh trong tuần.
### [openai/codex-plugin-cc](https://github.com/openai/codex-plugin-cc) — plugin cho phép code review và delegate task qua Codex ngay trong Claude Code (~22.8k sao) — tín hiệu rõ về xu hướng dùng nhiều coding agent song song trong một workflow.
