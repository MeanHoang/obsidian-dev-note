# 🌐 Web Dev — 2026-08-04

> IDE đang bị "de-centered" — orchestration layer cho AI agents đang trở thành bề mặt làm việc chính của developer.

## ⭐ [Is the IDE dead?](https://x.com/addyosmani/status/2035444544125456785) — Addy Osmani (X)
**Đây là gì:** Bài phân tích của Addy Osmani (Director of Google Cloud AI) về sự dịch chuyển trọng tâm công việc dev — từ việc ngồi edit code line-by-line trong IDE sang việc supervise các AI agent có khả năng plan, rewrite file, chạy test và propose changes. IDE không chết, nhưng đang mất vị trí "trung tâm".
**Chi tiết:**
- Vòng lặp dev mới: specify intent → delegate cho agent → observe → review diffs → merge, thay vì edit → build → debug → repeat truyền thống.
- Các tool như Conductor, Claude Code Web, GitHub Copilot Agent, Jules, Cursor Glass đều hướng tới mô hình "control plane" — nơi quản lý agent là trải nghiệm chính, editor chỉ là một instrument phụ bên dưới.
- Work isolation qua git worktrees trở thành primitive cho parallel agents; planning và task state thay thế "tabs and files" làm mental model chính.
- IDE vẫn critical cho: precise navigation, local reasoning, interactive debugging, understanding systems — những việc cần con người đào sâu trực tiếp.
- Chi phí mới xuất hiện: review fatigue khi phải duyệt output từ nhiều agent, governance overhead, và security surface mở rộng khi agent có quyền thao tác code.
**Vì sao đáng đọc:** Workflow hàng ngày ở Joy đang dùng Claude Code và Copilot — bài này giúp nhận diện rõ bottleneck thực tế (attention management khi chạy nhiều agent song song, review fatigue) và chuẩn bị mindset chuyển từ "người viết code" sang "người orchestrate agent" một cách có kiểm soát.
