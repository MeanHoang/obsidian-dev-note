# 🤖 AI, Security & Khác — 2026-07-15

> OpenAI ra mắt dòng GPT-5.6 (Sol/Terra/Luna), npm dính vụ compromise nghiêm trọng qua package `jscrambler`, và một GUI agent chạy thuần JavaScript đang trending mạnh.

## 🤖 AI

### ⭐ [OpenAI ra mắt dòng model GPT-5.6: Sol, Terra, Luna](https://techcrunch.com/2026/07/09/openai-launches-its-new-family-of-models-with-gpt-5-6/) — (TechCrunch)
**Đây là gì:** OpenAI phát hành GPT-5.6 dưới dạng một họ model 3 bậc thay vì một model đơn, công bố ngày 09/07/2026.
**Chi tiết:**
- 3 biến thể: **Sol** (mạnh nhất, "workhorse"), **Terra** (cân bằng), **Luna** (rẻ, nhanh).
- Giá / triệu token: Sol $5 in / $30 out — Terra $2.50 / $15 — Luna $1 / $6.
- Sam Altman tuyên bố Sol **tiết kiệm 54% token** cho tác vụ AI coding; đạt điểm 80 trên Artificial Analysis Coding Agent Index.
- OpenAI khẳng định Sol vượt Anthropic Fable 5 mà "dùng chưa tới một nửa số output token" và rẻ hơn ~1/3.
- Được quảng bá là "model an ninh mạng mạnh nhất" của OpenAI, phục vụ threat modeling và code review.
**Vì sao đáng đọc:** Bậc Luna giá rẻ + hiệu quả token cao là lựa chọn đáng cân nhắc cho các tác vụ AI trong dev workflow (sinh code, review) nếu bạn muốn giảm chi phí so với Claude; giá và benchmark giờ đã đủ để so sánh trực tiếp giữa các nhà cung cấp.

## 🔒 Security

### ⭐ [Package npm `jscrambler` 8.14.0 bị chèn Rust infostealer khi install](https://thehackernews.com/2026/07/compromised-jscrambler-8140-npm-release.html) — (The Hacker News)
**Đây là gì:** Package `jscrambler` (công cụ obfuscate JS phổ biến) bị compromise: bản 8.14.0 phát hành 11/07/2026 chứa hook `preinstall` thả và chạy một native binary infostealer tên **IronWorm** (viết bằng Rust) ngay khi cài đặt.
**Chi tiết:**
- Có build riêng cho Windows, macOS, Linux; đánh cắp credential dev, ví crypto, cloud key và cả cấu hình AI tool / MCP API key.
- Socket phát hiện chỉ **6 phút** sau khi publish; nhiều bản độc hại tiếp theo: 8.16.0, 8.17.0, 8.18.0, 8.20.0. Bản sạch: nâng lên **8.22.0**.
- Nếu đã chạy 8.14.0: coi mọi secret trên máy là đã lộ — xoay vòng cloud key, npm/GitHub token, AI/MCP API key; thu hồi session browser và ví crypto.
- Chặn C2 IP: `37.27.122.124` và `57.128.246.79`. Đáng chú ý: npm 12 (ra 08/07/2026) đã tắt install script mặc định.
**Vì sao đáng đọc:** Đây là kiểu tấn công supply-chain đánh thẳng vào stack JS/npm của bạn — kịch bản `preinstall` chạy tự động khi `npm install`. Nếu CI/CD trên GCP hoặc máy dev có pin phiên bản qua lockfile, hãy audit ngay; và cân nhắc bật `--ignore-scripts` cho các build không cần script.

## 📦 GitHub Trending

### [alibaba/page-agent](https://github.com/alibaba/page-agent) — GUI agent thuần JavaScript điều khiển web bằng ngôn ngữ tự nhiên (~26.7k sao, TypeScript-first, MIT)
**Đây là gì:** Một GUI agent "sống" ngay trong trang web dưới dạng JS thuần — không cần browser extension, Python hay headless browser; đọc DOM live như text rồi thao tác như user thật.
**Chi tiết:**
- Hỗ trợ nhiều backend qua endpoint OpenAI-compatible: DashScope (Qwen), GPT, Claude, hoặc Ollama local.
- Use case: smart form-filling (biến workflow 20 click thành 1 câu), accessibility bằng giọng nói, có thêm Chrome extension và MCP Server (beta) cho tác vụ đa trang.
**Vì sao đáng đọc:** Với app Shopify/admin dashboard nhiều form phức tạp, hướng nhúng agent client-side bằng JS thuần (không cần TS) đáng để tham khảo cho tính năng tự động hóa hoặc trợ năng trong app.
