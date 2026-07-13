# 🤖 AI & Security — 2026-07-06

> Anthropic mở gateway self-host cho Claude Code trên Bedrock/Google Cloud, lỗ hổng auth-bypass CVSS 10.0 của SimpleHelp RMM đang bị khai thác nhắm thẳng vào credential của dev, và Alibaba page-agent (JS thuần) leo top GitHub trending.

## 🤖 AI

### [Claude apps gateway cho Amazon Bedrock & Google Cloud](https://claude.com/blog/introducing-the-claude-apps-gateway) — (claude.com / Google Cloud Blog)
**Đây là gì:** Anthropic ra một self-hosted control plane để doanh nghiệp chạy Claude Code trên Bedrock/Google Cloud mà không phải phát credential lẻ cho từng dev.
**Chi tiết:**
- Là một container **stateless duy nhất**, tự deploy trên hạ tầng của bạn, backing bằng PostgreSQL.
- Đóng vai OIDC relying party — ghép với Google Workspace, Entra ID, Okta hoặc bất kỳ OIDC provider chuẩn nào để SSO + role-based access.
- Routing inference tới Claude API, Bedrock hoặc Google Cloud, có **failover** giữa các provider.
- Spend caps theo ngày/tuần/tháng ở cấp org, group hoặc từng người; per-user cost attribution.
- Với deploy Bedrock/Google Cloud, traffic và usage data **không gửi về Anthropic** trừ khi bạn cấu hình dùng Claude API.
**Vì sao đáng đọc:** User dùng GCP — đây là cách chạy Claude Code ở quy mô team mà vẫn kiểm soát được chi phí và dữ liệu ở lại trong tổ chức.

### Claude Code: /dataviz skill, Claude in Chrome GA, background notifications — (releasebot / support.claude.com)
**Đây là gì:** Bản cập nhật Claude Code tháng 7 mở rộng agent workflow ngoài phần model.
**Chi tiết:**
- Thêm **/dataviz skill** hướng dẫn thiết kế chart/dashboard (đúng lúc làm UI loyalty analytics).
- **Claude in Chrome** chuyển sang GA; thêm background notifications, draft PR handoff, cải thiện failover và session handling.
- Trusted Devices cho Remote Control Admins (Team/Enterprise) — verify thiết bị trước khi steer session từ xa.
**Vì sao đáng đọc:** Draft PR handoff + background notification hợp với workflow agent chạy nền song song.

## 🔒 Security

### ⭐ [SimpleHelp RMM CVE-2026-48558 — auth bypass CVSS 10.0 đang bị khai thác](https://www.securityweek.com/critical-simplehelp-vulnerability-exploited-for-malware-delivery/) — (SecurityWeek, Help Net Security, Arctic Wolf, CISA KEV)
**Đây là gì:** Lỗ hổng bypass xác thực trong SimpleHelp RMM do **không verify chữ ký cryptographic của OIDC identity token** — kẻ tấn công forge token là vào thẳng session technician, bỏ qua cả MFA.
**Chi tiết:**
- CVSS **10.0**; khi OIDC bật với group-authenticated login, attacker chưa auth vẫn giả token để lấy quyền technician; MFA bypass được vì technician tự đăng ký MFA ở lần login đầu.
- Chuỗi khai thác thả **TaskWeaver** (Node.js loader fingerprint hệ thống) rồi **Djinn Stealer** (info-stealer đa nền Windows/macOS/Linux).
- Djinn nhắm **thẳng môi trường dev**: cloud credentials, SSH keys, source-control tokens, package-registry auth, **credentials của AI dev tools**, browser data, ví crypto.
- Ảnh hưởng SimpleHelp **≤ 5.5.15** và các bản 6.0 pre-release; ~14.000 server lộ ra internet, ~1.000 trực tiếp dính.
- **Fix:** nâng lên **5.5.16 hoặc 6.0 RC2**. CISA đưa vào KEV (29/06), deadline vá cho cơ quan liên bang là 02/07/2026.
**Vì sao đáng đọc:** Đây là supply-chain qua MSP + stealer nhắm đúng loại secret mà dev Firebase/GCP hay giữ (SSH, cloud creds, registry tokens) — nhắc kiểm tra token/credential hygiene ngay cả khi bạn không dùng SimpleHelp.

## 📦 GitHub Trending

### [alibaba/page-agent](https://github.com/alibaba/page-agent) — JS in-page GUI agent điều khiển web bằng ngôn ngữ tự nhiên, **~23.9k sao**, MIT.
Chạy hoàn toàn bằng **JavaScript in-page** (không extension, không headless browser, không Python) — chỉ drop 1 `<script>` và nối LLM. Đọc DOM dạng text nên rẻ, hợp tự động hóa ERP/CRM/admin. Có Chrome extension opt-in cho multi-tab và **MCP server (beta)** để Claude/LangChain/n8n điều khiển nó qua Model Context Protocol. Hợp stack JS thuần của user và hướng "AI copilot sống trong web app" (nghĩ tới Shopify admin/loyalty dashboard).
