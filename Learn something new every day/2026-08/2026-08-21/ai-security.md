# 🤖 AI, Security & Khác — 2026-08-21

> Claude Code cho các session nói chuyện với nhau và bật auto mode mặc định; npm tiếp tục là bãi mìn với hai chiến dịch malware quy mô lớn; GitHub trending nghiêng hẳn về agent tooling.

## 🤖 AI

### ⭐ [Claude Code Week 32 · August 3–7, 2026](https://code.claude.com/docs/en/whats-new/2026-w32) — (Claude Code Docs)

**Đây là gì:** Bản digest tuần 32 của Claude Code (release v2.1.220 → v2.1.224), với 3 feature chính là cross-session messaging, self-hosted environments và auto mode trở thành permission mode mặc định.

**Chi tiết:**
- **Cross-session messaging** (v2.1.224, macOS + Linux): các session Claude Code có thể nhắn tin cho nhau. Claude tìm session khác bằng tool `ListAgents` và gửi bằng `SendMessage`. Nội dung gửi đi chỉ là text Claude tự viết, **không phải** conversation history hay file. Xem danh sách session tới được bằng `/list-agents`, mở message bằng `Ctrl+O`.
- **Self-hosted environments** (public beta, Team + Enterprise): chạy `claude self-hosted-runner setup` để biến máy/container của mình thành runner, session cloud khởi từ claude.ai / app mobile / `claude --cloud` sẽ chạy trong network nội bộ và truy cập được internal service. Owner/admin phải bật "Allow self-hosted environments" trong admin settings trước.
- **Auto mode mặc định**: từ 14/08, auto mode là permission mode mặc định cho session mới trên gói Pro, Max, Team. Nếu tự set default mode thì giữ nguyên trừ khi accept prompt chuyển đổi một lần. Các lệnh gọi classifier của auto mode không còn tính vào usage limit.
- **Bảo mật siết lại**: worktree isolation giờ chặn cả Bash command và git redirect chọc sang main checkout (không chỉ file edit); một Bash command không còn giấu được phần của nó khỏi permission check, tab/invisible-Unicode padding hết tác dụng; PreToolUse auto-allow hooks không còn bypass được tool restriction trong side task nội bộ như summary/compaction.
- **Vặt nhưng hữu ích**: bỏ cap 200 subagent mỗi session; plugin phân phối được dưới dạng zip archive qua HTTPS kèm SHA-256 pin (khỏi cần git/npm); `/review` thành alias của `/code-review`; background session có đổi code trong worktree giờ tự commit + push trước khi kết thúc và tuân theo git instruction trong `CLAUDE.md`; Ultraplan research preview bị gỡ.

**Vì sao đáng đọc:** Với Joy Loyalty, self-hosted environments là đường để chạy cloud session mà vẫn chạm được Firebase emulator / service nội bộ không public; còn auto mode default + siết worktree isolation nghĩa là workflow hằng ngày thay đổi ngay tuần này — nên đọc trước khi thấy prompt lạ.

## 🔒 Security

### [Nearly 800 Malicious npm Packages Deliver Cross-Platform RAT and Infostealer](https://thehackernews.com/2026/08/nearly-800-malicious-npm-packages.html) — (The Hacker News)

**Đây là gì:** Chiến dịch với khoảng 1.033 package npm độc hại đã xác nhận, dùng tên typo-squat sinh bằng AI. Điểm đáng chú ý: **không dùng lifecycle hook** (preinstall/postinstall) mà dụ dev nạp package qua `require()` — nên các biện pháp chặn install script không cứu được. Chuỗi tấn công bắt đầu bằng downloader WEL1DROPPER, nhận diện OS + kiến trúc CPU rồi kéo payload từ hạ tầng Cloudflare Workers; khi tải HTTPS thất bại thì fallback sang DNS TXT record của domain `wel1[.]ru`. Trên Windows nó patch ETW và AMSI, persist qua Registry Run key và scheduled task; macOS persist bằng LaunchAgent; Linux dùng ELF nén UPX để deploy Sliver C2.

**Vì sao đáng đọc:** Chặn install script là phòng thủ mặc định của phần lớn team Node — chiêu `require()` này đi vòng qua nó, nên với app Shopify chạy trên Firebase Functions/Cloud Run thì việc rà tên dependency và pin version quan trọng hơn là tin vào `--ignore-scripts`.

### [18 Malicious npm Packages Deliver Cross-Platform RAT to Alibaba Tool Users](https://thehackernews.com/2026/08/18-malicious-npm-packages-deliver-cross.html) — (The Hacker News)

**Đây là gì:** 18 package npm độc hại nhắm vào dev dùng developer tool của Alibaba, chủ yếu là dev nói tiếng Trung. Package `lib-mtop` giả một private package hợp lệ của Alibaba. Chiến dịch dùng phân phối nhiều lớp: package mồi phụ thuộc vào package trung gian, package trung gian mới kích hoạt loader thật. Payload cuối khác nhau theo OS, backdoor hỗ trợ thực thi lệnh, truyền file, do thám và persist bằng cách inject vào app collaboration doanh nghiệp như DingTalk. Bằng chứng (comment code, timestamp offset UTC+08:00) chỉ về threat actor nói tiếng Trung.

**Vì sao đáng đọc:** Mô hình "package mồi → package trung gian → loader" nghĩa là audit chỉ nhìn direct dependency sẽ trượt; với `package-lock.json` của app loyalty, transitive dependency mới là chỗ cần soi.

## 📦 GitHub Trending

### [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) — (GitHub Trending JavaScript)

**Đây là gì:** "The Anti-Slop Frontend Framework for AI Agents" — tập hợp agent skill dạng portable (file `SKILL.md`) nhằm làm AI sinh UI đỡ generic. Gồm nhiều skill design từ minimalist tới brutalist, skill sinh ảnh làm design reference, và skill chính `taste-skill` với các "dial" chỉnh design variance, motion intensity, visual density. Cài bằng `npx skills add`, dùng được với Claude, Codex, Cursor. Repo ~78.8k star, hôm nay +424.

**Vì sao đáng đọc:** Joy Loyalty làm UI trên Polaris nên khỏi cần phần thẩm mỹ tự do, nhưng cấu trúc "skill portable = file markdown + dial cấu hình" là mẫu rất đáng copy để viết skill nội bộ ép agent tuân thủ Polaris component và design token thay vì bịa CSS.

### [agent-substrate/substrate](https://github.com/agent-substrate/substrate) — (GitHub Trending Go)

**Đây là gì:** Control plane viết bằng Go cho việc chạy agent ở quy mô lớn: multiplex nhiều "actor" có state lên ít tài nguyên vật lý hơn bằng suspend/resume, hỗ trợ nhiều công nghệ sandbox (microVM, gVisor), dựng trên Kubernetes để provision hạ tầng rồi thêm scheduling riêng cho agent, activate agent dưới một giây và persist state qua các chu kỳ hibernate. Có CLI, demo (counter, sandbox, Claude Code), tự nhận là framework/harness agnostic. ~1.5k star. Repo tự ghi rõ đang giai đoạn đầu, chưa production-ready, API sẽ đổi.

**Vì sao đáng đọc:** Bài toán "giữ hàng nghìn workload có state mà không đốt tiền compute" chính là bài toán background job của app loyalty trên Cloud Run — kiến trúc suspend/resume ở đây là tài liệu tham khảo tốt kể cả khi không dùng repo.
