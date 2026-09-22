# 🤖 AI, Security & Khác — 2026-09-22

> Claude API thêm compaction chủ động cho agent chạy dài, 4 lỗ hổng leo thang quyền root trên Linux kernel đã có exploit công khai, và Meta Muse bị chứng minh có thể biến thành backdoor trên macOS.

## 🤖 AI

### ⭐ [Messages API: compaction on demand (beta)](https://platform.claude.com/docs/en/release-notes/api) — (Claude Platform release notes, 2026-09-14)

**Đây là gì:** Một tính năng beta của Claude Messages API cho phép bạn *chủ động* yêu cầu API nén (compact) lịch sử hội thoại thành một "compaction block" có chữ ký, thay vì tự cắt/tóm tắt context bằng tay. Bật bằng beta header `compact-2026-09-04`.

**Chi tiết:**
- Gửi tham số top-level `compaction` trong request; API trả về một `compaction` block đã được ký (signed) tóm tắt đúng những message bạn vừa gửi.
- Ở các request sau, bạn gửi block đó lên đầu, đặt **thay cho** cụm message cũ — không phải gửi lại toàn bộ transcript.
- Bạn tự quyết định thời điểm compact, và request compact có thể chạy ở background.
- Có thể giữ nguyên văn (word-for-word) một số lượt hội thoại gần nhất đặt sau phần summary.
- Trên các model có preserved thinking, thinking block trong những lượt được giữ lại vẫn còn hợp lệ.
- Cùng ngày 2026-09-14, release notes cũng thêm entry type `thinking_mismatch_allowed` trong field `input_transformations` (header `thinking-binding-controls-2026-08-01`).
- Entry gần nhất trên trang là 2026-09-18: Compliance API local session endpoints trả về transcript của session Claude in Chrome (`product_surface` = `claude_in_chrome`), beta cho Claude Enterprise.

**Vì sao đáng đọc:** Nếu Joy Loyalty có job dùng LLM chạy nhiều bước (ví dụ agent phân tích hành vi member, gợi ý earning rule, hay auto-support ticket), compaction on demand giúp giảm token phình ra theo từng step mà không phải tự viết logic tóm tắt trong Node/Firebase Functions.

## 🔒 Security

### [Public Exploits Released for Four Linux Kernel Flaws That Enable Local Root](https://thehackernews.com/2026/09/public-exploits-released-for-four-linux.html) — (The Hacker News, 2026-09-18)

**Đây là gì:** Researcher Asim Manizada công bố 4 lỗi memory-safety trong Linux kernel, kèm exploit PoC công khai, cho phép user thường leo thang lên **root**: DirtyAH6 (CVE-2026-80844, IPv6 Authentication Header), TUNderflow (CVE-2026-81000, TUN/TAP), PPPoEject (CVE-2026-68121, PPPoE), DiagSpill (CVE-2026-74469, code báo cáo SCTP).

**Vì sao đáng đọc:** 3 trong 4 lỗi cần unprivileged user namespaces (thứ mà container runtime hay bật), DiagSpill chỉ cần module SCTP có mặt — nên nếu team tự quản VM/container ngoài Cloud Run, cần lên kernel đã fix (5.10.270 / 5.15.221 / 6.1.188 / 6.6.157 / 6.12.109 / 6.18.50 / 7.2.4) hoặc tắt unprivileged user namespaces và các module không dùng. Bài ghi rõ: chưa có tấn công thực tế, exploit là PoC tuned theo build cụ thể.

### [One Hidden Meta Muse Setting Could Let Attackers Turn the AI Assistant Into a Backdoor](https://thehackernews.com/2026/09/one-hidden-meta-muse-setting-could-let.html) — (The Hacker News, 2026-09-22)

**Đây là gì:** Patrick Wardle công bố (full disclosure, không qua coordinated report) rằng Meta Muse trên Mac có một setting không được document là `endo_voyager_dictation_endpoint` quyết định voice command được gửi đi đâu. Attacker đã có code execution trên máy có thể trỏ endpoint này về server của mình để thu audio, chèn instruction và lấy authentication token.

**Vì sao đáng đọc:** Vì Muse là app có signature hợp lệ, request của nó đi qua được phần mềm bảo mật; token lấy được điều khiển Muse trên mọi thiết bị user đang đăng nhập. Đây là mẫu tấn công đáng lưu ý cho chính dev: bất kỳ AI assistant local nào có config endpoint ghi được đều là điểm exfil — áp dụng khi review MCP server / AI tool cài trên máy dev của team.

## 📦 GitHub Trending

### [akitaonrails/ai-memory](https://github.com/akitaonrails/ai-memory) — (GitHub Trending, Rust)

**Đây là gì:** Một binary Rust tự chứa (SQLite index trên các trang markdown wiki, git-backed) làm **long-term memory dùng chung cho nhiều AI coding agent** — Claude Code, Codex, Cursor… — để bạn đổi agent giữa dự án mà không mất context về kiến trúc, các hướng đã thử và thất bại, hay câu hỏi còn treo. Repo hiện ở mức 7.9k star.

**Vì sao đáng đọc:** Memory nằm ở dạng markdown commit được vào git nên review/diff bình thường, không cần LLM (full-text search offline, LLM là optional), và có lifecycle hook tự ghi lại prompt + tool call — hợp với workflow dev Shopify app khi context codebase Joy (Admin API, Polaris, Firebase) rất tốn công mồi lại mỗi lần đổi agent.
