# 🤖 AI, Security & Khác — 2026-09-24

> Tuần của cuộc đua model rẻ hơn: Claude Opus 5.5 và GPT-6 Sol/Luna ra cùng ngày, Anthropic mở Claude Marketplace. Bên security thì AI agent bị dùng để gắn skimmer lên web bán hàng, còn npm supply chain tiếp tục gây hậu quả.

## 🤖 AI

### ⭐ [Introducing Claude Opus 5.5](https://www.anthropic.com/claude-opus-5-5) — (Anthropic)
**Đây là gì:** Model đầu tiên của dòng Claude 5.5, ra mắt ngày 22/09/2026. Anthropic nói nó chạy rẻ hơn khoảng 40% so với Opus 5 trên workload thông thường và làm agentic coding tốt hơn.
**Chi tiết:**
- Giá cho mỗi 1M token: input $4 (Opus 5 là $5), output $20 (Opus 5 là $25), cache read $0.20 (Opus 5 là $0.50). Fast mode giá $8/$40, nhanh hơn tối đa 2.5x.
- Sinh output nhanh hơn Opus 5 trên 30%.
- Benchmark: Terminal-Bench 4.0 đạt 66.4% (Opus 5 là 52.3%), FrontierCode v1.1 đạt 54.4% (Opus 5 là 48.0%), OSWorld 2.0 đạt 81.8%.
- Một tester chạy xong một đợt migration 680,000 dòng code trong chưa đầy một ngày.
- Model ID trên API là `claude-opus-5-5`. Có trên Claude Platform, AWS, Google Cloud và Microsoft Azure. Có tùy chọn zero data retention.
**Vì sao đáng đọc:** Nếu Joy đang dùng Claude qua API hoặc Vertex AI trên GCP, chỉ cần đổi model ID là có ngay giá thấp hơn, cache read rẻ hơn 60% và tốc độ nhanh hơn. Nên cân nhắc cho các job AI chạy trên Cloud Run, cũng như cho việc refactor codebase JS cũ.

### [OpenAI launches GPT-6 Sol and Luna, boasting lower cost and fewer mistakes](https://techcrunch.com/2026/09/22/openai-launches-gpt-6-sol-and-luna/) — (TechCrunch)
**Đây là gì:** OpenAI ra 2 model GPT-6 mới vào ngày 22/09. Sol dùng cho task phức tạp như coding, còn Luna dùng cho việc văn phòng như tóm tắt và trích xuất thông tin. Theo TechCrunch, giá chỉ bằng một nửa dòng 5.6 nhờ cải tiến caching và inference. Hai model có trong ChatGPT Work, Codex và API cho người dùng trả phí. Bài viết cũng ghi nhận Anthropic ra Opus 5.5 chỉ 90 phút trước đó.
**Vì sao đáng đọc:** Một model rẻ kiểu Luna rất hợp với các task số lượng lớn của loyalty app, ví dụ phân loại hoặc tóm tắt feedback và sinh nội dung email cho member. Nên benchmark Luna với Claude trước khi chọn provider.

### [Anthropic launches Claude Marketplace for software, connectors and consultants](https://runtimewire.com/article/anthropic-claude-marketplace-software-connectors-consultants) — (RuntimeWire)
**Đây là gì:** Ngày 23/09/2026, Anthropic ra mắt Claude Marketplace, gom hơn 2,000 connector và plugin, các sản phẩm chạy trên Claude và các đối tác triển khai vào một catalog chung. Catalog chia thành 3 mục: Add (connector tới Google, Microsoft, Notion, Salesforce, Atlassian...), Buy (sản phẩm của Cursor, CrowdStrike, Harvey, Snowflake...) và Scale (đối tác tư vấn như Accenture, BCG, Deloitte).
**Vì sao đáng đọc:** Đây là thêm một kênh phân phối cho app. Nếu Joy có MCP server hoặc connector loyalty, Marketplace có thể giúp Joy tiếp cận merchant đang dùng Claude.

## 🔒 Security

### ⭐ [Malicious AI agents steal 600K credit cards, infect 100+ sites with skimmers](https://www.bleepingcomputer.com/news/security/malicious-ai-agents-steal-600k-credit-cards-infect-100-plus-sites-with-skimmers/) — (BleepingComputer)
**Đây là gì:** Một nhóm tội phạm có động cơ tài chính dùng các framework AI agent mã nguồn mở để tấn công hàng loạt web bán lẻ. Chiến dịch hoạt động từ tháng 7/2026.
**Chi tiết:**
- Nhóm này đã lấy hơn 600,000 bản ghi thẻ tín dụng từ 2 công ty, cài skimmer lên hơn 119 website và xâm nhập hơn 27 công ty chỉ trong 5 ngày.
- Họ dùng 3 framework: Strix để quét lỗ hổng (146 lượt chạy trên 138 host trong tháng 8), Cairn để tự động khai thác, và Hermes để điều phối (121 skill, trong đó 78 skill phục vụ tấn công).
- Skimmer được cài bằng nhiều cách: nối JS độc vào file hợp lệ, sửa trang checkout, đầu độc nội dung CDN, sửa field trong database và sửa Kubernetes deployment. Bài có nhắc tới database Magento.
- Tổng chi phí vận hành khoảng $12,000-$18,000, trung bình khoảng $25 cho mỗi mục tiêu. Sau khi lấy dữ liệu, agent còn chạy routine xoá dữ liệu.
**Vì sao đáng đọc:** Kiểu tấn công này nhắm thẳng vào e-commerce. Script storefront của Joy (theme app extension, widget JS) và CDN phục vụ asset cần được kiểm tra integrity. Không bao giờ để JS bên thứ ba sửa được luồng checkout.

### [GHAPPIER Supply Chain Attack Compromises 65 GitHub Repositories and Poisons npm Package](https://cybersecuritynews.com/ghappier-supply-chain-attack/) — (Cyber Security News)
**Đây là gì:** Ngày 09/09, attacker chiếm tài khoản maintainer của `@dforge-core/dforge-mcp` trong 105 phút. Trong thời gian đó, họ sửa release workflow để tự publish bản 0.2.21 có chứa loader độc. Bản này tồn tại 35 phút trước khi bị gỡ. Chiến dịch lan tới 65 repo, 73 file thuộc 22 account, và lấy Git credential đang được cache trên máy nạn nhân.
**Vì sao đáng đọc:** Đây là thêm một vụ npm bị tấn công qua package MCP. Team nên pin version, audit mọi thay đổi trong GitHub Actions release workflow và giới hạn quyền push lên main.

### [CrowdSec Says TanStack npm Attack Led to Copy of 170 Private GitHub Repositories](https://thehackernews.com/2026/09/crowdsec-says-tanstack-npm-attack-led.html) — (The Hacker News)
**Đây là gì:** Dư chấn của vụ TanStack npm tháng 5/2026. Package độc đã lấy được GitHub OAuth token của một cựu nhân viên CrowdSec, người này vẫn còn giữ quyền truy cập. Attacker dùng token đó copy khoảng 170 private repo, làm lộ email của 83 user và thông tin của 51 nhà đầu tư tiềm năng.
**Vì sao đáng đọc:** Bài học trực tiếp: phải thu hồi token và OAuth grant của người đã nghỉ việc. Một package npm bị nhiễm trên máy dev có thể dẫn tới lộ toàn bộ source của Joy nhiều tháng sau.

## 📦 GitHub Trending

### [google/ax](https://github.com/google/ax) — (GitHub, trending Go)
**Đây là gì:** Runtime mã nguồn mở của Google dùng để điều phối AI agent, viết bằng Go, license Apache 2.0. Cách dùng giống Kubernetes: khai báo bằng YAML, có các lệnh `apply/get/describe/watch/delete` cùng `suspend/resume/ssh`. Mỗi task chạy trong sandbox có giới hạn CPU/memory, mạng bị giới hạn theo allowlist host, và workspace được cấu hình sẵn với Git repo và MCP server.
**Vì sao đáng đọc:** Nếu Joy muốn chạy nhiều agent (ví dụ agent phân tích từng shop) trên GCP/GKE, đây là mẫu tham khảo về sandbox và suspend/resume agent, thay vì tự dựng hệ thống queue trên Cloud Run.
