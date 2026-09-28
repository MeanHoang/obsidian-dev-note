# 🤖 AI, Security & Khác — 2026-09-25

> Tuần này supply-chain vẫn là chủ đề nóng: token CI của GitHub Actions bị lấy để đẩy bản npm độc hại, domain placeholder trong docs bị chiếm để phát tán malware. Bên AI, Gemini API siết quyền truy cập model 2.5.

## 🔒 Security

### ⭐ [Compromised MemTensor Packages Deliver sckit Credential Stealer via npm and PyPI](https://thehackernews.com/2026/09/compromised-memtensor-packages-deliver.html) — (The Hacker News, 23/09/2026)
**Đây là gì:** Một vụ supply-chain attack: kẻ tấn công chiếm quyền publish của 2 package hợp lệ của MemTensor trên npm và PyPI, rồi đẩy lên các bản chứa implant viết bằng Go tên **sckit**, chuyên đánh cắp credential của developer.
**Chi tiết:**
- Package bị nhiễm: npm `@memtensor/memos-cloud-openclaw-plugin` các bản 0.1.21, 0.1.23, 0.1.25 (bản sạch: 0.1.20); PyPI `MemoryOS` 2.0.34 (bản sạch: 2.0.33).
- Cách lấy quyền publish: attacker push commit khiến workflow GitHub Actions của MemTensor "nhả" npm/PyPI token ra ngoài.
- sckit chạy trên Windows, Linux, macOS; gom `.npmrc`, `.vault-token`, SSH key, biến môi trường chứa token/API key, AWS access key, token GitHub/GitLab, npm/PyPI, Hugging Face, Vault, Slack, Stripe, SendGrid. Dữ liệu gửi về `skyleen[.]fr`.
- Implant có khả năng tự lây như worm: tự publish tiếp lên GitHub, npm, PyPI bằng credential lấy được.
- Khuyến nghị: rotate secret đã lộ, pin package về bản sạch, kill process sckit, chặn domain exfil và các subdomain.
**Vì sao đáng đọc:** Kiểu tấn công này nhắm thẳng vào CI. Joy Loyalty cũng chạy GitHub Actions, dùng npm token và secret GCP/Firebase trong env, nên nên rà lại xem workflow nào có thể để lộ token khi build commit/PR lạ (`pull_request_target`, secrets truyền vào job không tin cậy).

### ⭐ [Placeholder third-party[.]com Referenced Across 1,700+ Repositories Now Serves Malicious Content](https://thehackernews.com/2026/09/placeholder-third-partycom-referenced.html) — (The Hacker News, 24/09/2026)
**Đây là gì:** `third-party[.]com` là một domain người ta hay dùng làm ví dụ trong tài liệu. Nó không nằm trong nhóm domain IANA giữ riêng như `example.com`, nên kẻ xấu đã đăng ký được và dùng để phát tán malware.
**Chi tiết:**
- Hơn 1.700 repo GitHub public nhắc tới domain này, trong đó có repo về AI agent skills và tài liệu MCP server dùng nó làm endpoint mẫu.
- Người dùng Windows vào domain sẽ thấy trang check Cloudflare giả (ClickFix). Trang này chép sẵn lệnh vào clipboard rồi bảo nạn nhân dán vào hộp Run, và lệnh đó tải PowerShell payload từ xa về chạy. Người dùng macOS chỉ thấy báo lỗi "cần Windows".
- Manifold Security (nhóm của Ax Sharma) phát hiện ra. Domain đã phát ClickFix lure ít nhất từ tháng 6/2026.
- Nhóm này còn tìm thấy 13 domain placeholder khác có thể bị chiếm, ví dụ `yoursite[.]com` và `your-domain[.]com` đang phát scareware/scam.
- Khuyến nghị: chỉ dùng `example.com/.org/.net` làm placeholder, và rà lại docs xem còn domain "nghe hợp lý" nào có thể bị chiếm.
**Vì sao đáng đọc:** Code mẫu, README, prompt hay skill mà AI agent đọc đều có thể chứa URL placeholder, và agent có thể gọi thẳng vào đó. Team nên grep repo và docs nội bộ của Joy để tìm domain placeholder không thuộc nhóm IANA.

### [WSO2 and Adobe Commerce Flaws Exploited in Attacks, Added to CISA KEV](https://thehackernews.com/2026/09/wso2-and-adobe-commerce-flaws-exploited.html) — (The Hacker News, 25/09/2026)
**Đây là gì:** CISA thêm 2 lỗ hổng đang bị khai thác vào danh mục KEV. Lỗ thứ nhất là CVE-2026-5430 (CVSS 9.8), lỗi path traversal trong WSO2 dẫn tới RCE. Lỗ thứ hai là CVE-2026-71362 (CVSS 9.1), lỗi phân quyền trong Adobe Commerce/Magento cho phép chuyển session của một khách hàng sang tài khoản khách hàng khác và truy cập dữ liệu nạn nhân. Sansec ghi nhận các lần thử khai thác lỗi Adobe từ tháng 8/2026.
**Vì sao đáng đọc:** Joy chạy trên Shopify nên không bị ảnh hưởng trực tiếp. Tuy vậy, lỗi chiếm session khách hàng trên nền tảng e-commerce là bài học nên nhớ khi thiết kế luồng xác thực customer cho widget loyalty/app proxy: luôn kiểm tra customer ID ở server, không tin giá trị client gửi lên.

## 🤖 AI

### [Gemini API Release notes — siết quyền dùng model 2.5, ra mắt TTS 3.8](https://ai.google.dev/gemini-api/docs/changelog) — (Google AI for Developers)
**Đây là gì:** Changelog chính thức của Gemini API. Hai mục đáng chú ý trong tuần: ngày 18/09 Google giới hạn model 2.5, chỉ còn cho "users who have actively used them in the past" dùng, và khuyên project mới chuyển sang 3.5 Flash-Lite hoặc 3.8 Flash. Ngày 22/09, Gemini 3.8 Flash TTS và 3.8 Flash-Lite TTS lên GA, kèm thư viện hơn 150 giọng.
**Vì sao đáng đọc:** Nếu Cloud Functions/Cloud Run nào của Joy đang gọi Gemini 2.5 thì cần kiểm tra lại. Project hay môi trường mới có thể không còn được dùng model 2.5, nên nên lên kế hoạch migrate sang 3.x.

## 📦 GitHub Trending
### [GitHub Trending hôm nay](https://github.com/trending?since=daily) — (github.com)
**Đây là gì:** Một số repo JS/TS đang lên nhanh, liên quan tới AI agent:
- [pbakaus/impeccable](https://github.com/pbakaus/impeccable) (JS, +527⭐ hôm nay): "design language" giúp AI harness làm UI đẹp hơn.
- [BuilderIO/skills](https://github.com/BuilderIO/skills) (JS): bộ skills cho agent do Builder.io phát hành.
- [dream-num/univer](https://github.com/dream-num/univer) (TS, +1.082⭐): bộ office (spreadsheet, docs, slides, PDF) thiết kế cho AI agent.
- [vectorize-io/hindsight](https://github.com/vectorize-io/hindsight) (+1.668⭐): "Agent Memory That Learns", lớp memory cho agent.
**Vì sao đáng đọc:** `impeccable` và `BuilderIO/skills` có thể thử ngay với Claude Code để agent sinh UI Polaris/admin nhất quán hơn. Nhưng nên đọc kỹ skill trước khi cài: skill do bên thứ ba viết cũng là một đường supply-chain, như hai bài Security ở trên.
