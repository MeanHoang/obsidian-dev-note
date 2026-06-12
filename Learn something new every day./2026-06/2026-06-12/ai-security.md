# 🤖 AI, Security & Khác — 2026-06-12

> Nổi bật hôm nay: OpenAI nộp hồ sơ IPO bí mật chỉ 1 tuần sau Anthropic, và worm npm "Phantom Gyp" — diễn biến mới của chiến dịch Miasma — né được mọi cơ chế detect lifecycle script bằng `binding.gyp`.

## 🤖 AI

### ⭐ [OpenAI nộp hồ sơ IPO bí mật lên SEC](https://techcrunch.com/2026/06/08/following-anthropic-openai-files-confidentially-for-ipo/) — (TechCrunch)
**Đây là gì:** OpenAI (công ty đứng sau ChatGPT, Codex) đã nộp draft S-1 bí mật lên SEC ngày 08/06 để chuẩn bị lên sàn — chỉ hơn 1 tuần sau khi Anthropic làm điều tương tự, mở ra cuộc đua IPO giữa 2 AI lab lớn nhất.
**Chi tiết:**
- Định giá gần nhất của OpenAI: **$852B** (post-money); chưa quyết thời điểm IPO — công ty nói "có thể còn lâu vì nhiều việc làm dễ hơn khi còn private".
- Bối cảnh cạnh tranh: Anthropic nộp hồ sơ trước (01/06) và đã vọt lên **$1 trillion** trên thị trường secondary; mức tăng giá trị từ đầu năm của Anthropic là 123% so với 11.3% của OpenAI.
- Sức ép tài chính: OpenAI vừa miss target doanh thu và user; dự kiến **burn $85B năm 2028** dù doanh số tăng gấp đôi, riêng chi phí compute cho research năm 2028 ước ~$122B.
- Bài báo nêu OpenAI sẽ không dương cash flow trong ít nhất 4 năm tới; ChatGPT hiện có ~900 triệu weekly active users.
**Vì sao đáng đọc:** 2 AI lab lớn nhất cùng lên sàn nghĩa là áp lực doanh thu sẽ định hình pricing/packaging của API và dev tools (Claude, Codex) — ảnh hưởng trực tiếp chi phí AI workflow của team.

### [OpenAI models và Codex dùng được qua Oracle Universal Credits](https://openai.com/index/openai-on-oracle-cloud/) — (openai.com)
**Đây là gì:** OpenAI và Oracle công bố (10/06) cho phép khách hàng Oracle Cloud Infrastructure dùng credits/cloud commitment sẵn có để truy cập frontier models và Codex, không cần kênh procurement riêng.
**Vì sao đáng đọc:** Xu hướng "AI bán qua cloud commitment" đang lan rộng — đáng theo dõi vì GCP (stack của Joy) nhiều khả năng cũng sẽ đẩy mô hình tương tự.

## 🔒 Security

### ⭐ [Phantom Gyp: worm npm tự lan né lifecycle script bằng binding.gyp](https://snyk.io/blog/node-gyp-supply-chain-compromise-self-propagating-npm-worm-binding-gyp/) — (Snyk)
**Đây là gì:** Wave mới nhất trong chuỗi tấn công Shai-Hulud/Miasma (diễn biến MỚI sau vụ Red Hat npm): worm "Phantom Gyp" lợi dụng file `binding.gyp` — `node-gyp` tự chạy khi install package native — để thực thi code độc mà **không cần preinstall/postinstall script**, qua mặt các tool detect lifecycle script truyền thống.
**Chi tiết:**
- **57 packages, hàng trăm version độc** bị compromise; nạn nhân lớn gồm `@vapi-ai/server-sdk` (~86.5k downloads/tuần), `ai-sdk-ollama` (~36.9k/tuần) và họ `autotel` (25+ packages).
- Cơ chế: command expansion của GYP (`<!(node index.js)`) chạy code attacker ngay trong bước build configuration khi `npm install`.
- Payload: loader obfuscated 4.5MB (mã hóa ROT-14, dùng Bun runtime) chuyên harvest credentials **AWS, GCP, Azure, GitHub, Vault, Kubernetes**.
- Tự lan: account bị chiếm sẽ republish version độc sang npm và cả RubyGems; worm còn **giả mạo Sigstore provenance attestation** để trông như package được ký hợp lệ.
**Vì sao đáng đọc:** Stack Joy là Node/npm + Firebase/GCP — đúng loại credentials worm này nhắm tới; cần audit dependency có `binding.gyp`, pin version và rotate credentials nếu dính package trong danh sách.

## 📦 GitHub Trending

### [google/skills — Agent Skills chính chủ cho Google Cloud & Firebase](https://github.com/google/skills) — (GitHub)
**Đây là gì:** Repo mới của Google (đang active development, **13.5k stars**) chứa Agent Skills cho các sản phẩm Google: BigQuery, Cloud Run, **Firebase**, GKE, Cloud SQL, Gemini API... cài bằng `npx skills add google/skills`.
**Vì sao đáng đọc:** Joy chạy Firebase + Cloud Run — cài skills chính chủ này vào Claude Code giúp agent hiểu đúng best practice GCP (kèm cả bộ skill Well-Architected Framework về security/cost) thay vì tự đoán.

                