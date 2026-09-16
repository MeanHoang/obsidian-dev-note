# 🤖 AI, Security & Khác — 2026-09-16

> OpenAI ra hướng dẫn viết lại skills/prompt cho GPT-6 Astra; tuần này bảo mật nóng ở mảng browser extension đánh cắp OAuth token và một lỗ hổng Cisco đang bị khai thác thực tế.

## 🤖 AI

### ⭐ [Rethinking skills and prompts for GPT-6 Astra](https://developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra) — (OpenAI Developers Blog)

**Đây là gì:** Bài hướng dẫn chính thức của OpenAI cho developer về cách viết lại "skills" (tập instruction đóng gói sẵn cho coding agent) và file `AGENTS.md` (file mô tả quy tắc repo cho AI agent đọc) khi chuyển sang model GPT-6 Astra.

**Chi tiết:**
- **Refine skill descriptions** — mô tả skill phải ngắn và nói rõ *khi nào* dùng. Ví dụ thay vì "Use when working with databases" thì viết "Use when adding or changing a migration".
- **Progressive disclosure** — skill có nhiều workflow nên cấu trúc như một "router" tối giản trỏ sang tài liệu phụ, thay vì bắt model đọc hết mọi thứ ngay từ đầu.
- **Đơn giản hóa `AGENTS.md`** — bỏ các yêu cầu kiểu "phải đọc toàn bộ docs trước mỗi lần sửa"; gắn hướng dẫn theo từng loại task cụ thể.
- **Recalibrate decision boundaries** — Astra có judgment tốt hơn model cũ, nên ngôn ngữ quá hạn chế trong instruction sẽ kìm hãm nó một cách không cần thiết.
- **Định nghĩa rõ "xong là gì"** — Astra có xu hướng dừng sớm, nên phải nêu tiêu chí hoàn thành để nó chạy hết workflow trước khi xin review.
- Thông điệp xuyên suốt: model càng mạnh thì càng cần **ít scaffolding**; instruction phình to trở thành phản tác dụng.

**Vì sao đáng đọc:** Nếu team Joy Loyalty đang dùng coding agent với skill files / `AGENTS.md` (hoặc `CLAUDE.md` tương đương) cho repo app Shopify, đây là lý do để dọn bớt instruction thừa — nhất là các rule kiểu "luôn đọc toàn bộ docs" vốn làm chậm agent và đốt context mà không tăng chất lượng.

### [GPT-6 Astra: A new generation of intelligence](https://openai.com/index/gpt-6-astra/) — (OpenAI)

**Đây là gì:** Trang công bố GPT-6 Astra, model flagship mới nhất của OpenAI, được quảng bá là state-of-the-art ở mảng computer use, browsing, software engineering và cybersecurity. Model đang rollout theo giai đoạn cho ChatGPT Plus/Pro/Business/Enterprise, OpenAI API, Microsoft Azure và AWS Bedrock.

**Vì sao đáng đọc:** Đây là model mà bài hướng dẫn skills ở trên nhắm tới — nếu định đổi model backend cho tooling nội bộ (script generate code, review PR JS/React Polaris), cần đọc trang gốc để nắm chính xác capability và điều kiện truy cập trước khi cam kết.

## 🔒 Security

### [Malicious Twitch Browser Extension Leaks OAuth Tokens From Nearly 31,000 Users](https://thehackernews.com/2026/09/malicious-twitch-browser-extension.html) — (The Hacker News, 14/09/2026)

**Đây là gì:** Extension "Twitch Enhanced Viewer | JeetBot" trên Chrome Web Store (30.000 users) và Firefox Add-ons (604 users) bị phát hiện chặn lấy `authorization` header của Twitch web client, trích OAuth token rồi gửi qua proxy server của JeetBot — một dịch vụ bot/chatbot thương mại nói tiếng Nga. Token cho phép truy cập chat, tin nhắn riêng và account settings. Người phát hiện: researcher Kush Pandya (Socket). Tại thời điểm đăng bài, cả hai extension vẫn còn tải được; tác giả Aleksandr Popov đã phát hành bản 85.8.7 trên Firefox để dừng gửi token, bản Chrome còn chờ review.

**Vì sao đáng đọc:** Đúng mô hình rủi ro mà Joy Loyalty phải phòng: một extension "tiện ích" trong browser của dev/merchant có thể đọc trộm header Authorization của session Shopify Admin. Đáng rà soát extension đang cài trên máy dev và tách profile Chrome riêng cho công việc Shopify Admin / Firebase Console.

### [Cisco Secure Email Gateway Flaw Exploited in the Wild, Enables Root Command Execution](https://thehackernews.com/2026/09/cisco-secure-email-gateway-flaw.html) — (The Hacker News, 15/09/2026)

**Đây là gì:** CVE-2026-76461 (CVSS 9.8) trong Cisco Secure Email Gateway (cả appliance vật lý lẫn ảo chạy AsyncOS). Lỗi do validate thiếu ở logic parse email: attacker gửi email chứa câu lệnh SQL độc hại là có thể dẫn tới thực thi lệnh ở quyền root. Cisco đã vá cho AsyncOS 15.5, 16.0 và 16.5. CISA đưa vào danh mục Known Exploited Vulnerabilities, hạn vá cho cơ quan liên bang là 17/09/2026.

**Vì sao đáng đọc:** Joy Loyalty không chạy Cisco SEG, nhưng đây là nhắc nhở về lớp hạ tầng email: hệ thống loyalty gửi rất nhiều transactional email (điểm thưởng, reward, referral) — nếu merchant hoặc đối tác dùng gateway dính lỗi này thì email flow là bề mặt tấn công, không chỉ là kênh gửi tin.

## 📦 GitHub Trending

### [alibaba/open-code-review](https://github.com/alibaba/open-code-review) — (GitHub Trending, Go)

**Đây là gì:** Công cụ code review mã nguồn mở của Alibaba, mô tả là "fast, efficient, battle-tested at Alibaba's scale", dùng kiến trúc lai giữa LLM và bộ rule bảo mật đa ngôn ngữ. Đang ở ~28.7k sao, +5.169 sao trong tuần — repo Go tăng mạnh nhất tuần.

**Vì sao đáng đọc:** Một lựa chọn self-host cho automated code review trên repo JavaScript của Joy Loyalty, kết hợp rule bảo mật tĩnh với LLM — hợp với team không muốn đẩy source code lên SaaS review bên thứ ba.

### [tt-a1i/archify](https://github.com/tt-a1i/archify) — (GitHub Trending, JavaScript)

**Đây là gì:** Agent skill để sinh sơ đồ kiến trúc, workflow, sequence và data-flow dưới dạng file HTML self-contained kèm khả năng export. Đang ở ~63.6k sao, +1.373 sao hôm nay.

**Vì sao đáng đọc:** Dùng để vẽ nhanh data-flow của loyalty (Shopify webhook → Cloud Run → Firestore → widget) khi onboarding dev mới hoặc viết tài liệu kỹ thuật, không cần dựng thêm tooling diagram nào.
