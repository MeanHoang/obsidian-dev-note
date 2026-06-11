# 🤖 AI, Security & Khác — 2026-06-11

> Tuần của model lớn: Anthropic chính thức launch Claude Fable 5 (Mythos-class), OpenAI nâng cấp memory ChatGPT bằng "Dreaming", trong khi npm hứng thêm một wave supply chain attack (Miasma) — cần check lockfile ngay.

## 🤖 AI

### ⭐ [Claude Fable 5 và Claude Mythos 5 chính thức ra mắt](https://www.anthropic.com/news/claude-fable-5-mythos-5) — (anthropic.com, 2026-06-09)
**Đây là gì:** Thế hệ model mới nhất của Anthropic: Fable 5 là bản Mythos-class phát hành rộng rãi kèm safeguards; Mythos 5 là cùng model nhưng bỏ safety classifiers, chỉ cấp cho đối tác được duyệt (cybersecurity, hạ tầng, biomedical).
**Chi tiết:**
- Software engineering là điểm nhấn lớn nhất: Anthropic mô tả Fable 5 "nén nhiều tháng engineering thành vài ngày" — một case migration codebase 50 triệu dòng hoàn thành trong 1 ngày thay vì 2 tháng làm tay.
- Rất mạnh ở agentic task dài hơi: giữ focus qua hàng triệu token context, persistent memory giúp tăng hiệu năng ~3x trên task phức tạp; user feedback nhấn mạnh khả năng tự chủ trên coding task long-horizon.
- State-of-the-art trên "gần như mọi benchmark được test", lợi thế lớn nhất ở các task dài và phức tạp; vision cũng SOTA (đọc số liệu chính xác từ figure khoa học, rebuild web app từ screenshot).
- Giá API: $10/triệu input token, $50/triệu output token, model name `claude-fable-5`; miễn phí trong subscription (Pro/Max/Team/Enterprise) từ 09–22/06, sau đó cần usage credits.
- Fable 5 có classifier tự redirect các query nhạy cảm (cybersecurity, bio/chem) sang Opus 4.8 — trigger dưới 5% session nhưng có false positive, cần lưu ý khi build workflow tự động.
**Vì sao đáng đọc:** Đây sẽ là model chạy trong Claude Code của bạn — coding agent long-horizon mạnh hơn hẳn nghĩa là có thể giao các task refactor/migration lớn của Joy Loyalty (Firebase functions, React Polaris) cho agent chạy dài thay vì chia nhỏ thủ công; cân nhắc dùng window miễn phí trước 22/06 để benchmark trên codebase thật.

### [OpenAI ra mắt "Dreaming" — kiến trúc memory mới cho ChatGPT](https://openai.com/index/chatgpt-memory-dreaming/) — (openai.com)
**Đây là gì:** Hệ thống memory mới thay thế danh sách saved-memories thủ công bằng quá trình tổng hợp nền: ChatGPT tự đọc lại lịch sử hội thoại nhiều năm và tự cập nhật hiểu biết về user theo thời gian (vd. tự sửa "sẽ đi Singapore tháng 7" thành "đã đi Singapore 7/2026").
**Vì sao đáng đọc:** Pattern "memory tự lão hóa theo thời gian" này (kèm tối ưu compute ~5x để mở cho Free user) là tham khảo tốt nếu Joy Loyalty muốn build personalization/retention dựa trên lịch sử hành vi khách hàng thay vì profile tĩnh.

## 🔒 Security

### [Miasma: supply chain attack vào npm packages của Red Hat và loạt SDK phổ biến](https://www.wiz.io/blog/miasma-supply-chain-attack-targeting-redhat-npm-packages) — (wiz.io)
**Đây là gì:** Ngày 01/06, tài khoản GitHub của một nhân viên Red Hat bị chiếm, đẩy malware vào ít nhất 32 bản release npm thuộc namespace `@redhat-cloud-services` (~80k download/tuần, gồm `frontend-components`, `rbac-client`, `chrome`). Malware "Miasma" (biến thể Mini Shai-Hulud) chạy qua preinstall script, thu thập cloud identity GCP/Azure, GitHub token, SSH key và CI/CD secrets, payload mã hóa riêng từng lần lây nên khó detect bằng hash.
**Vì sao đáng đọc:** Action ngay: audit lockfile/CI của app xem có dependency dính namespace trên không; vì payload nhắm cả credential GCP nên nếu nghi nhiễm phải rotate service account key, GitHub token và secrets trong CI; bật dependency allowlist/pin version cho pipeline deploy Firebase.

### [Node.js thông báo security releases ngày 17/06/2026](https://nodejs.org/en/blog/vulnerability/june-2026-security-releases) — (nodejs.org)
**Đây là gì:** Node.js đã phát thông báo trước (pre-announcement) đợt vá bảo mật chính thức, các bản release sẽ ra vào hoặc ngay sau thứ Tư 17/06/2026.
**Vì sao đáng đọc:** Đặt lịch tuần sau update Node runtime cho Cloud Functions/Cloud Run và môi trường local ngay khi bản vá ra — các đợt security release của Node thường kèm CVE bị khai thác nhanh sau khi công bố.

## 📦 GitHub Trending

### [Understand-Anything — biến codebase thành knowledge graph tương tác](https://github.com/Lum1104/Understand-Anything) — (github.com, ~56.6k stars)
**Đây là gì:** Repo TypeScript đang đứng top trending (gần 2.000 stars/tuần đầu tháng 6): plugin phân tích codebase bằng pipeline multi-agent (tree-sitter + LLM), dựng knowledge graph mọi file/function/class/dependency kèm dashboard tương tác, semantic search và impact analysis; cài được vào Claude Code, Cursor, Copilot, Codex, Gemini CLI.
**Vì sao đáng đọc:** Cài thử vào Claude Code để map codebase Joy Loyalty — impact analysis trước khi sửa shared module (points engine, webhook handlers) giúp giảm regression, và onboarding dev mới nhanh hơn nhờ guided tour theo dependency.
