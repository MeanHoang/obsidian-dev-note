# 🤖 AI, Security & Khác — 2026-06-23

> OpenAI siết spend controls cho Enterprise, hai CVE RCE nóng (NGINX HTTP/3 + Splunk đang bị khai thác), và Perplexity ra scanner supply-chain mới.

## 🤖 AI

### ⭐ [New usage analytics and updated spend controls for enterprises](https://openai.com/index/chatgpt-enterprise-spend-controls/) — (OpenAI, 18/06)
**Đây là gì:** OpenAI thêm bộ phân tích usage và spend controls mới cho ChatGPT Enterprise, giúp admin kiểm soát chi phí AI theo nhiều cấp.
**Chi tiết:**
- "Usage limits" mới trong Workspace settings: đặt hạn mức credit hàng tháng theo **workspace / group / user** (hard spend limits, nhiều cấp).
- Credit usage analytics: theo dõi lượng credit tiêu thụ, hiểu pattern adoption để quyết định triển khai AI hợp lý hơn.
- Cho phép user **request tăng hạn mức** ngay trong sản phẩm khi vượt limit; mặc định bật, có thể tắt hoặc route request sang trang nội bộ tùy chỉnh.
- User override limit: đặt cap riêng cho từng user cụ thể, đè lên limit của workspace/group.
**Vì sao đáng đọc:** Joy Loyalty dùng Claude Code hàng ngày — đây là mô hình quản trị chi phí LLM ở quy mô team. Pattern hard cap theo workspace/group/user là thứ đáng tham khảo nếu sau này phải kiểm soát budget AI nội bộ (kể cả với Anthropic/Claude). Cũng cho thấy thị trường AI enterprise đang chuyển từ "dùng thoải mái" sang "FinOps cho token".

### [Anthropic mở văn phòng Seoul + partnership hệ sinh thái AI Hàn Quốc](https://www.anthropic.com/news) — (Anthropic, 17/06)
**Đây là gì:** Anthropic mở văn phòng tại Seoul và công bố loạt partnership mới trong hệ sinh thái AI Hàn Quốc.
**Vì sao đáng đọc:** Tín hiệu Anthropic đẩy mạnh hiện diện APAC — vùng có nhiều merchant Shopify (Hàn/Nhật/SEA). Không tác động trực tiếp tới workflow hiện tại nhưng đáng theo dõi về độ phủ region và partner network. (Lưu ý: trang `/news` là index; tin Seoul nằm trong feed ngày 17/06.)

## 🔒 Security

### [F5 vá khẩn NGINX: use-after-free HTTP/3 CVE-2026-42530](https://nginx.org/en/security_advisories.html) — (nginx.org / BleepingComputer, 17-18/06)
**Đây là gì:** F5 phát hành bản vá out-of-band cho NGINX Open Source. CVE-2026-42530 là lỗi use-after-free trong module HTTP/3 (`ngx_http_v3_module`).
**Chi tiết:**
- Attacker không cần xác thực có thể reopen QPACK encoder stream qua một HTTP/3 session được tạo riêng → "lifetime mismatch": con trỏ thuộc HTTP/3 session giữ vùng nhớ đã được free khi unidirectional stream đóng.
- Hậu quả: worker process restart / DoS; trong môi trường ASLR bị tắt hoặc bypass được, có thể dẫn tới RCE. CVSS v3.1 ~8.1 (theo phân tích bên thứ ba; advisory nginx.org xếp mức "Major").
- **Phiên bản dính:** 1.31.0–1.31.1. **Đã vá:** 1.31.2+ (phát hành 17/06).
- Đi kèm CVE-2026-42055 (buffer overflow trong `ngx_http_proxy_v2_module` / `ngx_http_grpc_module`, mức Medium): dính 1.13.10–1.31.1, vá ở 1.31.2+ và 1.30.3+.
- Chỉ ảnh hưởng cấu hình **non-default** (có bật `http3 on;` / QUIC). Mitigation: tắt module HTTP/3, bỏ `http3 on;` và tham số `quic` khỏi listen directive.
**Vì sao đáng đọc:** Nhiều stack đặt NGINX làm reverse proxy phía trước (kể cả trước service trên Cloud Run/GCE). Nếu có bật HTTP/3 QUIC, cần check version và nâng lên 1.31.2+ ngay. Cloud Run managed không expose NGINX của bạn ở edge, nhưng self-hosted NGINX (VM, sidecar, ingress) thì cần rà.

### [Splunk Enterprise RCE CVE-2026-20253 đang bị khai thác — CISA bắt vá gấp](https://www.bleepingcomputer.com/news/security/cisa-splunk-enterprise-flaw-actively-exploited-patch-by-sunday/) — (BleepingComputer / CISA, 18/06)
**Đây là gì:** Lỗ hổng RCE không cần xác thực trong Splunk Enterprise, đã bị khai thác thực tế. CISA thêm vào KEV catalog ngày 18/06, bắt cơ quan liên bang vá trước Chủ nhật (BOD 26-04).
**Chi tiết:**
- Endpoint PostgreSQL sidecar service (lo backup/recovery DB) **không có authentication** → attacker network-reachable có thể tạo/truncate file tùy ý không cần credential.
- WatchTowr Labs công bố write-up + PoC ngày 12/06; khai thác thực tế quan sát từ 15/06 (chỉ 3 ngày sau PoC). Chain file-write thành RCE qua tính năng PostgreSQL như `lo_export`.
- **Dính:** Splunk Enterprise 10.2.0–10.2.3 và 10.0.0–10.0.6. **Vá ở:** 10.2.4 và 10.0.7.
- Mitigation tạm: tắt PostgreSQL sidecar service (sẽ làm hỏng Edge Processor, OpAmp, SPL2 pipeline).
**Vì sao đáng đọc:** Bài học pattern lặp lại: sidecar/internal service quên gắn auth → unauth RCE. Joy Loyalty không chạy Splunk thì rủi ro trực tiếp thấp, nhưng đây là reminder cho mọi internal endpoint (Cloud Run service-to-service, admin/metrics endpoint) — đừng giả định "chỉ internal là an toàn". Tốc độ PoC→exploit 3 ngày cho thấy phải vá theo KEV gần như real-time.

## 📦 GitHub Trending

### [perplexityai/bumblebee](https://github.com/perplexityai/bumblebee) — (GitHub, ~4.6k★)
**Đây là gì:** Scanner supply-chain read-only của Perplexity AI: kiểm tra metadata package/extension/dev-tool **trên đĩa local** để biết máy nào đang dính một compromise đã được công bố.
**Chi tiết:**
- Single static binary, **zero non-stdlib dependency** (viết bằng Go) — chạy được mà không kéo thêm dependency (đúng tinh thần một công cụ security đáng tin).
- Quét lockfile, metadata package-manager, manifest extension và config MCP; hỗ trợ **npm, PyPI, Go modules, RubyGems, Composer**…
- Trả lời câu hỏi hẹp nhưng đúng lúc incident: "advisory vừa nêu tên package/version X — máy dev nào của tôi đang khớp ngay bây giờ?" Output NDJSON cho từng package/finding.
- 3 profile quét: baseline / project / deep.
**Vì sao đáng đọc:** Trùng đúng nỗi đau của tháng 6 (Miasma RedHat npm, TanStack…). Là công cụ JS/npm-ecosystem-friendly để rà nhanh worker máy dev hoặc CI khi có advisory mới — bổ sung cho lockfile pinning + `npm ci`. Đáng thử trên repo Joy Loyalty (JS thuần, nhiều npm dep) như một bước triage khi có cảnh báo supply-chain.

---
*Đã skip (dedupe 7 ngày): Miasma RedHat npm, TanStack/Shai-Hulud, GPT-5.6/Gemini 3.5 Pro coding wave, Gemini CLI→Antigravity, Check Point VPN zero-day, continuedev/continue, codebase-memory-mcp. Anthropic & OpenAI IPO filing là tin tài chính, không phải dev/tech nên không đưa vào.*
