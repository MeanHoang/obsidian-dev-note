# 🤖 AI, Security & Khác — 2026-09-27

> Tuần này chuỗi cung ứng JS vẫn là tâm điểm: GitHub Actions nhiễm Mini Shai-Hulud được bật lại, npm malware bắt đầu giấu loader trong runtime code. Bên AI, Anthropic công bố số liệu Claude tự dẫn dắt 26% R&D, còn trending tràn ngập skill review/audit code cho coding agent.

## 🤖 AI

### ⭐ [Measurements for understanding the pace of AI development inside frontier labs](https://www.anthropic.com/institute/measuring-pace-of-ai-development) — (Anthropic)
**Đây là gì:** Anthropic (công ty làm ra Claude) công bố bộ chỉ số minh bạch đo tốc độ phát triển AI bên trong chính phòng lab của họ: AI tự làm được bao nhiêu phần R&D, giám sát agent ra sao, và dành bao nhiêu compute cho an toàn.
**Chi tiết:**
- Claude "lead" 26% công việc AI R&D của Anthropic tính đến tháng 8/2026, tăng từ dưới 1% hồi tháng 2/2026; hơn 90% công việc đạt mức "AI collaborates" trở lên.
- Khoảng 30.000 agent cùng làm việc research/engineering trên nền tảng nội bộ chính trong kỳ đo.
- 100% hành động của agent đi qua online monitor trước khi thực thi và được review lại bằng offline monitoring sau đó.
- Khoảng 0,002% quyết định của agent (cỡ 1/47.000) bị online monitor chặn trong tháng 8/2026.
- Khoảng 6% compute dành cho AI R&D được dùng cho safety, lên 12% nếu chỉ tính phần R&D do AI dẫn dắt.
**Vì sao đáng đọc:** Mô hình "agent làm, monitor chặn trước và review sau" là khuôn mẫu tốt nếu team Joy muốn để coding agent tự chạy task dài trên repo mà vẫn kiểm soát được.

## 🔒 Security

### ⭐ [GitHub Actions re-enabled with Mini Shai-Hulud payload still active](https://www.bleepingcomputer.com/news/security/github-actions-re-enabled-with-mini-shai-hulud-payload-still-active/) — (BleepingComputer)
**Đây là gì:** Hai GitHub Action bên thứ ba từng bị nhiễm trong đợt tấn công chuỗi cung ứng Mini Shai-Hulud (tháng 5) đã được maintainer bật lại, nhưng release tag vẫn trỏ vào code độc.
**Chi tiết:**
- Hai action bị ảnh hưởng: `actions-cool/issues-helper` và `actions-cool/maintain-one-comment`, bị nhiễm từ đợt Mini Shai-Hulud ngày 18/5.
- Sau khi GitHub vô hiệu hoá hồi tháng 5, chúng truy cập lại được từ 16/9 và tag vẫn trỏ vào nội dung độc hại.
- Payload là JavaScript bị obfuscate trong `index.js`, nhắm vào token, credential và CI/CD secret của developer.
- Cửa sổ phơi nhiễm là 16–25/9/2026, ảnh hưởng các workflow gọi action bằng tag (mutable) thay vì commit SHA đã pin.
- Khuyến nghị: gỡ các tham chiếu, pin commit sạch đã kiểm tra, audit workflow run từ 16/9 và rotate mọi secret mà pipeline đó truy cập được.
**Vì sao đáng đọc:** Nếu CI của Joy (deploy Firebase/GCP) dùng action bên thứ ba theo tag, đây là lúc grep `.github/workflows` và chuyển sang pin SHA, vì secret deploy nằm ngay trong đó.

### [Malicious npm Package indexed-btree Hid Its Loader in Runtime Code Before Removal](https://thehackernews.com/2026/09/malicious-npm-package-indexed-btree-hid.html) — (The Hacker News)
**Đây là gì:** Package npm độc `indexed-btree` giả dạng thư viện `sorted-btree` và giấu loader trong method `BTree.prototype.set()` thay vì trong lifecycle script (postinstall), nhằm né các giới hạn bảo mật mới của npm v12. Payload tải qua blockchain (EtherHiding), C2 qua Slack/Telegram.
**Vì sao đáng đọc:** Chỉ chặn install script (`--ignore-scripts`) là chưa đủ, code độc giờ chạy lúc app gọi hàm, nên cần review kỹ dependency mới trong Cloud Functions trước khi thêm vào.

### [Malicious npm Package Poses as Twilio Bug-Bounty Probe, Can Exfiltrate Credentials](https://thehackernews.com/2026/09/malicious-npm-package-poses-as-twilio.html) — (The Hacker News)
**Đây là gì:** Package `tw-pkgprobe-7731` đội lốt công cụ nghiên cứu bug bounty của Twilio; từ bản 1.0.4 nó đánh cắp `process.env.ACCOUNT_SID` và `process.env.AUTH_TOKEN`. Twilio đã xác nhận gỡ package và khuyên dùng API key có scope hẹp.
**Vì sao đáng đọc:** Kiểu tấn công đọc thẳng `process.env` cũng áp dụng được cho biến môi trường Shopify API secret/Firebase trong function, nên nhắc lại nguyên tắc key scope hẹp và dùng Secret Manager.

## 📦 GitHub Trending

### [cloudflare/security-audit-skill](https://github.com/cloudflare/security-audit-skill) — (GitHub, JavaScript)
**Đây là gì:** Skill cho coding agent của Cloudflare để chạy security audit nhiều pha (recon, hunting bằng sub-agent, validate đối kháng, xuất finding JSON, verify độc lập, báo cáo). Cài bằng `npx skills add https://github.com/cloudflare/security-audit-skill --skill security-audit`; cần agent hỗ trợ sub-agent song song và sandbox. Trending JS với khoảng +6,4k star tuần này.
**Vì sao đáng đọc:** Có thể chạy thử trên repo app Joy để quét lỗ hổng (webhook HMAC, proxy route, Firestore rules) mà không phải set up tool SAST riêng.

### [alibaba/open-code-review](https://github.com/alibaba/open-code-review) — (GitHub, Go)
**Đây là gì:** CLI review code bằng AI của Alibaba, kết hợp pipeline tất định (chọn file, khớp rule) với LLM agent để comment trên git diff tới từng dòng; tự nhận chỉ tốn khoảng 1/9 token so với agent đa dụng. Chạy được với Claude Code, Codex, Cursor và GitHub Actions/GitLab CI.
**Vì sao đáng đọc:** Là lựa chọn rẻ hơn để gắn review tự động vào PR của team Joy, hỗ trợ cả model Anthropic lẫn OpenAI.
