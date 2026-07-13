# 🤖 AI, Security & Khác — 2026-07-02

> Anthropic ra Claude Sonnet 5 (default trong Claude Code, 1M context), OpenAI preview GPT-5.6, và một zero-day V8 trên Chrome đang bị khai thác — tuần này nặng đô cả AI lẫn security.

## 🤖 AI

### ⭐ [Claude Sonnet 5 ra mắt — default model mới, 1M context, giá rẻ hơn](https://www.anthropic.com/news/claude-sonnet-5) — (anthropic.com)
**Đây là gì:** Anthropic ra Claude Sonnet 5 ngày 30/06, model tầm trung nhưng hiệu năng agentic tiệm cận Opus 4.8 với chi phí thấp hơn nhiều. Đã là default trong Claude Code, Free và Pro.
**Chi tiết:**
- Cải thiện rõ so với Sonnet 4.6 ở reasoning, tool use, coding và knowledge work; tester nói nó "hoàn thành task phức tạp mà Sonnet cũ bỏ dở" và tự kiểm tra output mà không cần nhắc.
- Hỗ trợ 1M token context làm mặc định (cũng là max, không có bản context nhỏ hơn), output tối đa 128k token.
- Giá giới thiệu tới 31/08/2026: $2/triệu input token, $10/triệu output token; sau đó về $3/$15. Rẻ hơn đáng kể so với dùng Opus.
- Model id qua API: `claude-sonnet-5`. Có thể chạy autonomous với browser/terminal, xử lý debugging và pull request nhiều bước.
**Vì sao đáng đọc:** Đây là con dao Thụy Sĩ mới cho dev workflow — với JS/Firebase/React, bạn có thể để Sonnet 5 làm default trong Claude Code, tận dụng 1M context để nạp cả codebase Shopify app mà không phải nhảy lên Opus đắt tiền.

### [OpenAI preview GPT-5.6: Sol, Terra, Luna](https://openai.com/index/previewing-gpt-5-6-sol/) — (openai.com)
**Đây là gì:** OpenAI mở limited preview dòng GPT-5.6 gồm Sol (flagship), Terra (cân bằng cho công việc hằng ngày) và Luna (nhanh, rẻ nhất). Ban đầu chỉ mở qua API và Codex cho nhóm đối tác được chọn, ChatGPT/API rộng rãi sau.
**Vì sao đáng đọc:** Terra được cho là ngang GPT-5.5 nhưng rẻ 2x, Luna là mức giá thấp nhất của OpenAI — nếu đúng thì đây là áp lực giá trực tiếp lên Sonnet 5, đáng theo dõi khi chọn model backend cho tính năng AI trong app.

## 🔒 Security

### [Chrome V8 zero-day CVE-2026-11645 đang bị khai thác — cập nhật ngay](https://thehackernews.com/2026/06/chrome-v8-zero-day-cve-2026-11645.html) — (The Hacker News, đối chiếu BleepingComputer)
**Đây là gì:** Lỗ hổng high-severity trong engine JavaScript V8 của Chrome (out-of-bounds read/write). Kẻ tấn công dùng trang HTML dựng sẵn để gây heap corruption, rò rỉ dữ liệu ngoài buffer hoặc chạy code trong sandbox trình duyệt. Google xác nhận đã bị khai thác trong thực tế và giữ kín chi tiết đến khi đa số user cập nhật.
**Ảnh hưởng ai / cần làm gì:** Mọi user Chrome (và trình duyệt Chromium) đều dính. Update Chrome về bản mới nhất ngay; lỗi còn có thể bypass ASLR nên dễ ghép với lỗ hổng khác để RCE. Dev nên kiểm tra cả các Electron/embedded browser trong tooling của mình.
**Vì sao đáng đọc:** V8 zero-day = rủi ro trực tiếp cho máy dev vì ta mở đủ loại link/preview mỗi ngày; đây là loại lỗi "chỉ cần ghé trang là dính".

## 📦 GitHub Trending

### [Trending JavaScript — caveman dẫn đầu](https://github.com/trending/javascript) — (github.com/trending)
**Đây là gì:** Top trending JS hôm nay bị các repo quanh Claude Code/AI-agent thống trị. Nổi nhất là **caveman** (~79k sao, +866 hôm nay) — một Claude Code skill "nói kiểu người tiền sử" để cắt ~65% token; kèm theo **codex-plugin-cc** (dùng Codex ngay trong Claude Code để review/delegate task) và **archify** (sinh diagram kiến trúc, +487 sao/ngày).
**Vì sao đáng đọc:** Xu hướng rõ: cộng đồng đang tối ưu chi phí token và ghép nhiều AI coding tool với nhau — caveman là mẹo thực dụng để giảm bill khi chạy agent trên codebase lớn.
