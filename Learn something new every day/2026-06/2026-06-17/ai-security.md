# 🤖 AI, Security & Khác — 2026-06-17

> Claude Code tháng 6 mở khoá sub-agent lồng nhau + safe mode, đúng lúc Anthropic gặp loạt outage hạ tầng — và một zero-day VPN Check Point đang bị ransomware khai thác.

## 🤖 AI

### ⭐ [Claude Code changelog tháng 6: nested sub-agents, safe mode, fallback models](https://code.claude.com/docs/en/changelog) — (code.claude.com — docs chính thức)
**Đây là gì:** Loạt update Claude Code đầu/giữa tháng 6/2026 thêm nhiều tính năng đáng giá cho workflow agentic và resilience khi model quá tải.

**Chi tiết:**
- **Nested sub-agents (v2.1.172, 10/06):** sub-agent giờ có thể spawn sub-agent của riêng nó, tối đa 5 cấp sâu (background chains bị cap 5 cấp để tránh runaway; foreground tự giới hạn). Bỏ hẳn giới hạn cũ "không cho lồng".
- **Safe mode (v2.1.169, 08/06):** flag `--safe-mode` (hoặc env `CLAUDE_CODE_SAFE_MODE`) khởi động Claude Code với toàn bộ customization tắt — CLAUDE.md, plugins, skills, hooks, MCP servers — để debug khi config hỏng. Auth, model selection, built-in tools, permissions vẫn chạy.
- **Fallback models (v2.1.166, 06/06):** setting `fallbackModel` cho phép cấu hình tối đa 3 model dự phòng, thử lần lượt khi model chính overloaded/unavailable; `--fallback-model` nay áp cả cho interactive session.
- **`/cd` command (v2.1.169, 08/06):** đổi working directory của session mà không phá prompt cache giữa chừng.
- **Siết bảo mật sub-agent (v2.1.178, 15/06):** trong auto mode, lệnh spawn sub-agent giờ được classifier đánh giá TRƯỚC khi chạy — vá lỗ hổng sub-agent có thể yêu cầu hành động bị chặn mà không qua review.

**Vì sao đáng đọc:** Bạn dùng Claude Code hằng ngày — nested sub-agents giúp orchestrate task đa bước phức tạp hơn, còn `fallbackModel` + `--safe-mode` là cứu cánh thực tế khi gặp outage/config lỗi (xem item dưới).

### [Anthropic gặp loạt outage hạ tầng đầu tháng 6/2026](https://www.anthropic.com/news) — (anthropic.com — newsroom)
**Đây là gì:** Trong nửa đầu tháng 6, Claude (gồm Opus 4.8 và Haiku 4.5) trải qua nhiều đợt gián đoạn dịch vụ liên tiếp; Anthropic thừa nhận hạ tầng bị căng vì nhu cầu tăng đột biến. Cùng giai đoạn, newsroom chính thức cũng dồn dập tin: Fable 5 / Mythos 5 (09/06) rồi bị chỉ thị export-control của chính phủ Mỹ yêu cầu tạm ngưng truy cập (12/06), và chương trình Claude Corps (11/06).

**Vì sao đáng đọc:** Nếu pipeline của team phụ thuộc Claude Code/API, nên bật ngay `fallbackModel` (3 model dự phòng) để giảm rủi ro downtime trong giai đoạn hạ tầng còn căng.

## 🔒 Security

### [Check Point VPN zero-day CVE-2026-50751 đang bị khai thác trong thực tế](https://www.rapid7.com/blog/post/etr-critical-check-point-vpn-zero-day-exploited-in-the-wild-cve-2026-50751/) — (rapid7.com — đã WebFetch verify)
**Đây là gì:** Lỗ hổng authentication bypass nghiêm trọng (CVSS 9.3) trong giao thức trao đổi khoá IKEv1, ảnh hưởng Check Point Remote Access VPN, Mobile Access/SSL VPN và Spark Firewall.

**Chi tiết:**
- Ảnh hưởng 9 nhánh version từ R80.20.X đến R82.10.
- Khai thác sớm nhất ghi nhận từ 07/05/2026, tăng mạnh đầu tháng 6; công bố 08/06, thêm vào CISA KEV ngày 09/06/2026.
- Ít nhất một vụ liên quan affiliate của ransomware Qilin; Rapid7 xác nhận thêm 2 ca. Phạm vi "vài chục tổ chức".

**Vì sao đáng đọc:** Nếu team/công ty dùng Check Point VPN làm cổng truy cập hạ tầng, đây là patch khẩn — auth bypass + đang bị ransomware lợi dụng nghĩa là credential và mạng nội bộ có thể bị xâm nhập trực tiếp.
