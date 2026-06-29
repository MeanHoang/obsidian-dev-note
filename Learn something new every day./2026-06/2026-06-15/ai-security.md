# 🤖 AI, Security & Khác — 2026-06-15

> Nổi bật hôm nay: Hôm nay (15/06) chính thức có hiệu lực thay đổi billing của Anthropic — Agent SDK / `claude -p` / GitHub Actions tách khỏi limit subscription sang credit riêng. Bên cạnh đó là worm npm mới "IronWorm" (Rust) nhắm thẳng vào credential cloud/AI, và OpenAI thâu tóm Ona (Gitpod cũ) để chạy Codex trong cloud của chính khách hàng.

## 🤖 AI

### ⭐ [Claude Code đổi billing từ 15/06: Agent SDK & `claude -p` tách sang credit riêng](https://code.claude.com/docs/en/costs) — (Anthropic docs)
**Đây là gì:** Từ hôm nay 15/06/2026, các luồng dùng tự động — Claude Agent SDK, lệnh `claude -p`, Claude Code GitHub Actions, và app bên thứ ba xác thực qua subscription — không còn tính vào limit của gói Claude nữa, mà chuyển sang một pool credit riêng tính theo giá API list (không cộng dồn tháng sau).
**Chi tiết:**
- Credit mỗi gói: Pro $20, Max 5x $100, Max 20x $200 mỗi tháng; hết credit thì request tự động dừng trừ khi bật "usage credits" để tràn sang tính theo giá API.
- Phiên Claude Code tương tác (gõ tay trong terminal) và chat Claude.ai vẫn nằm trên limit subscription cũ, KHÔNG bị ảnh hưởng.
- Docs chính thức xác nhận cơ chế đi kèm: lệnh `/usage-credits` để đặt trần chi tiêu hàng tháng trên Pro/Max, và `/usage` để theo dõi token tiêu thụ theo skills/subagent/MCP.
- Anthropic gửi email "claim credit" trước 15/06; cần claim 1 lần qua tài khoản Claude.
- Đây là phần tách billing riêng cho automation, khác với phiên dùng tay — cần kiểm tra script CI/automation đang ngốn credit ở đâu.
**Vì sao đáng đọc:** Team dùng Claude Code hằng ngày + có thể chạy `claude -p`/GitHub Actions trong CI — từ hôm nay các luồng automation đó ăn vào credit riêng có giới hạn, cần claim credit và cân nhắc bật usage credits kẻo pipeline dừng giữa chừng.

### [OpenAI thâu tóm Ona (tức Gitpod cũ) để chạy Codex trong cloud của khách hàng](https://openai.com/index/openai-to-acquire-ona/) — (OpenAI)
**Đây là gì:** OpenAI mua lại Ona — startup Đức tiền thân là Gitpod — chuyên cung cấp môi trường cloud bền bỉ để agent tiếp tục chạy ngay cả khi dev đã đóng máy. Mục tiêu là đưa hạ tầng "secure cloud execution" này vào hệ sinh thái Codex.
**Vì sao đáng đọc:** Hướng "agent chạy nền trong cloud của chính bạn" đang thành chuẩn (Anthropic cũng có Managed Agents + sandbox riêng) — đáng theo dõi vì ảnh hưởng cách team đóng gói agent tooling cho workflow dài hơi.

## 🔒 Security

### ⭐ [IronWorm: worm npm viết bằng Rust, nhắm credential OpenAI/AWS/Anthropic/npm](https://www.bleepingcomputer.com/news/security/new-ironworm-malware-hits-36-packages-in-npm-supply-chain-attack/) — (BleepingComputer)
**Đây là gì:** Một đợt tấn công supply-chain mới (phát hiện 04/06/2026) đã nhiễm infostealer "IronWorm" vào 36 package npm. Khác với Shai-Hulud/Miasma trước đó, payload lần này là binary Rust, ẩn sau eBPF kernel rootkit và liên lạc qua Tor.
**Chi tiết:**
- Nhắm 86 biến môi trường và 20 file credential — có thể chứa khóa OpenAI, AWS, Anthropic, npm, file cấu hình vault, SSH keys và ví crypto Exodus.
- Tự lây lan: dùng credential đánh cắp (kể cả secret của npm Trusted Publishing) để publish phiên bản trojan của package mà nạn nhân sở hữu, lây tiếp sang dev/CI khác.
- Chạy qua hook `preinstall` bằng ELF binary; commit author giả mạo tên "claude" và timestamp lùi tới 13 năm để ngụy trang.
- 36 package nhiễm, tổng ~32.177 lượt tải/tháng; đã được chặn trước khi lan rộng.
- Nghiên cứu (JFrog) coi đây là phiên bản "rustier cousin" của Shai-Hulud — cùng tên commit nhưng không tìm thấy liên kết rõ ràng, có thể là implant tự xây mới.
**Vì sao đáng đọc:** Team chạy Node/npm với credential GCP/Firebase + khóa AI rất nhạy — đây là diễn biến MỚI (Rust + eBPF + nhắm Trusted Publishing) so với các đợt đã đăng; cần rà `preinstall` script lạ, pin version và xoay secret nếu nghi ngờ.

## 📦 GitHub Trending

### [Piebald-AI/claude-code-system-prompts — toàn bộ system prompt nội bộ của Claude Code](https://github.com/Piebald-AI/claude-code-system-prompts) — (GitHub)
**Đây là gì:** Repo (≈11.1k sao) trích xuất đầy đủ system prompt của Claude Code v2.1.177 (cập nhật 12/06/2026): hơn 500 đoạn prompt, mô tả 27 builtin tool, prompt sub-agent (Plan/Explore/security review/code review) và các prompt tiện ích (sinh CLAUDE.md, compact, WebFetch).
**Vì sao đáng đọc:** Hiểu Claude Code "nghĩ" thế nào giúp viết CLAUDE.md và subagent hiệu quả hơn — hữu ích trực tiếp cho team dùng Claude Code mỗi ngày để tinh chỉnh workflow.
