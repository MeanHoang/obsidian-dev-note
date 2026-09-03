# 🤖 AI & Security — 2026-09-03

> Anthropic ra Fable 5.1 rẻ hơn 25% và cache read giảm 75%, trong khi lỗ hổng auth bypass CVSS 9.8 của JFrog Artifactory đang bị khai thác thật — cả hai đều chạm trực tiếp vào workflow build/deploy của dev.

## 🤖 AI

### ⭐ [Introducing Claude Fable 5.1 and Claude Mythos 5.1](https://www.anthropic.com/claude-fable-and-mythos-5-1) — (anthropic.com, 01/09/2026)
**Đây là gì:** Anthropic phát hành hai model frontier mới. Fable 5.1 và Mythos 5.1 thực chất là **cùng một model**, chỉ khác mức safeguard: Fable 5.1 mở công khai, còn Mythos 5.1 chỉ cấp qua chương trình "trusted access" cho người làm cybersecurity và life sciences.
**Chi tiết:**
- Giá: Fable 5.1 rẻ hơn Fable 5 khoảng **25%** cho workload thông thường.
- **Cache read giảm 75%**, còn **$0.25 / 1 triệu token** — đây là phần tiết kiệm lớn nhất với agentic workload.
- Benchmark theo trang công bố: Terminal-Bench-Science 0.1 đạt **52.6%** (Fable 5 chỉ 24.7%); Terminal-Bench 4.0 đạt **55.8%** (Fable 5: 42.0%); CursorBench 3.2.0 đạt **73.4%** (Fable 5: 70.5%).
- Safeguard cybersecurity chặn **ít hơn 60% false positive** so với trước — tức ít bị model từ chối oan khi hỏi về bảo mật.
- Đã có ngay trên Claude API, AWS, Google Cloud và Microsoft Azure.
**Vì sao đáng đọc:** Nếu bạn chạy Claude Code / agent lặp lại trên codebase Joy Loyalty, mức giảm 75% giá cache read là khoản cắt chi phí trực tiếp — vì agentic loop đọc lại cùng context (schema Firestore, Shopify Admin API docs, file JS lớn) rất nhiều lần.

### [Previewing the Model Hardware Standard](https://www.anthropic.com/news/model-hardware-standard-research-preview) — (anthropic.com, 27/08/2026)
**Đây là gì:** Anthropic mở research preview của Model Hardware Standard (MHS) — một đặc tả chung để AI agent điều khiển thiết bị vật lý một cách an toàn, tương tự cách MCP chuẩn hoá việc agent gọi tool phần mềm.
**Vì sao đáng đọc:** Cùng một tư duy "chuẩn hoá interface cho agent" mà bạn đang dùng khi viết MCP tool cho Shopify Admin API — đọc để nắm hướng chuẩn hoá agent mà Anthropic đang đẩy.

## 🔒 Security

### [Hackers exploit critical JFrog Artifactory flaw to forge admin tokens](https://www.bleepingcomputer.com/news/security/hackers-exploit-critical-jfrog-artifactory-flaw-to-forge-admin-tokens/) — (BleepingComputer, 02/09/2026)
**Đây là gì:** JFrog Artifactory là repository manager dùng để lưu trữ và phân phối package (npm, Docker, Maven...) trong nội bộ công ty. Lỗ hổng **CVE-2026-82329** là auth bypass **CVSS 9.8** trong cấu hình mặc định của bản self-managed.
**Chi tiết:**
- Attacker **không cần đăng nhập**, chỉ cần truy cập mạng là chiếm được quyền admin — không cần tương tác người dùng.
- Bản vá phát hành **28/08/2026**: các version **7.111.21, 7.117.28, 7.125.20, 7.133.29, 7.146.38, 7.161.20** trở lên. JFrog Cloud đã được vá sẵn.
- Đến **01/09**, watchTowr đã ghi nhận attacker khai thác thật: tự cấp admin token rồi liệt kê user, group, credential và quan hệ federated access.
- JFrog công bố rất ít chi tiết kỹ thuật, chỉ nói lỗi khai thác được ở cấu hình mặc định.
- Rủi ro lớn nhất là **poisoning artifact**: package độc hại sẽ được các hệ thống downstream tự động tin tưởng và deploy.
**Vì sao đáng đọc:** Đây đúng mô hình supply-chain attack mà một Shopify app dev cần cảnh giác — nếu pipeline build của bạn kéo package từ bất kỳ private registry nào, một registry bị chiếm đồng nghĩa mã độc chui thẳng vào bundle app mà không qua npm public.

## 📦 GitHub Trending

### [every-app/open-seo](https://github.com/every-app/open-seo) — (GitHub Trending, TypeScript)
**Đây là gì:** "Open source alternative to Semrush and Ahrefs" — nền tảng SEO self-host gồm keyword research, rank tracking, phân tích đối thủ, backlink, site audit và AI visibility. Dùng DataForSEO API theo mô hình pay-as-you-go thay vì subscription, deploy được qua Docker hoặc Cloudflare, và có sẵn **MCP server** để AI agent gọi trực tiếp.
**Vì sao đáng đọc:** Merchant Shopify sống bằng organic traffic — có MCP server cho SEO nghĩa là bạn có thể cho agent tự audit/nghiên cứu keyword cho landing page của Joy Loyalty mà không trả phí Ahrefs.

### [THU-MAIC/OpenMAIC](https://github.com/THU-MAIC/OpenMAIC) — (GitHub Trending, TypeScript)
**Đây là gì:** Open Multi-Agent Interactive Classroom — nền tảng open-source (MIT license) biến một chủ đề hoặc tài liệu thành lớp học tương tác, dùng multi-agent orchestration để tự sinh slide, quiz, mô phỏng và bài tập project.
**Vì sao đáng đọc:** Mẫu multi-agent orchestration đáng đọc code: cách chia vai agent và ghép output thành một sản phẩm hoàn chỉnh là pattern bạn tái dùng được khi build tính năng AI trong app.
