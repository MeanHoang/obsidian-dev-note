> [!quote] 💬
> *"Skills are a simple, open format for giving agents new capabilities and expertise."* — Google Cloud Blog, Cloud Next 2026

# 🎯 Google Agent Skills — repo `google/skills`

## Định nghĩa
- **`google/skills`** = repo Agent Skills **chính chủ của Google** cho Google Cloud, Gemini, Firebase — công bố ngày **23/04/2026 tại Cloud Next 2026**. Hiện ~13.5k ⭐, license Apache 2.0.
- **Agent Skill** (kỹ năng cho agent) = "tài liệu agent-first" viết bằng Markdown: 1 file `SKILL.md` (frontmatter `name` + `description`) kèm reference files, code snippets. Agent **chỉ load nội dung khi cần** (on-demand) → tránh **context bloat** (phình context — nhồi quá nhiều docs vào context window làm agent chậm, tốn token, loãng thông tin).
- Cùng format Agent Skills mà Claude Code dùng → xem thêm [[Skill]] (note về skill trong Claude Code).

> [!note] 📝 So sánh dễ hiểu
> Skill giống **sổ tay nghiệp vụ phát cho nhân viên mới**: bình thường cuốn sổ nằm trên kệ, chỉ tốn 1 dòng trong mục lục trí nhớ ("có sổ về hoàn tiền đấy"); khi gặp ca hoàn tiền mới rút đúng chương đó ra đọc. Còn nhồi docs vào system prompt / MCP server load full schema giống **bắt nhân viên học thuộc toàn bộ quy trình công ty ngay ngày đầu** — tốn "RAM não" mà 90% chưa dùng tới.

---
## 📦 Repo `google/skills` có gì? (30 skills trong `skills/cloud/`)

| Nhóm | Skills | Liên quan stack mình? |
|---|---|---|
| **GCP Basics** | `firebase-basics`, `cloud-run-basics`, `bigquery-basics`, `cloud-sql-basics`, `alloydb-basics`, `gke-basics`, `gcloud` | ✅ Firebase, Cloud Run, BigQuery — dùng hàng ngày |
| **Recipes** (công thức từng việc) | `google-cloud-recipe-onboarding`, `google-cloud-recipe-auth`, `google-cloud-networking-observability` | ✅ Auth/ADC hay vướng khi setup local |
| **Well-Architected Framework** (6 pillars) | `google-cloud-waf-security`, `-reliability`, `-cost-optimization`, `-operational-excellence`, `-performance-optimization`, `-sustainability` | ✅ Cost + security review kiến trúc |
| **Gemini & Agent Platform** | `gemini-api`, `gemini-agents-api`, `gemini-interactions-api` + 11 skill `agent-platform-*` (deploy, tuning, RAG engine, model registry…) | ⚠️ Chỉ khi build AI feature trên Vertex/Agent Platform |

Google nói rõ roadmap: *"Stay tuned as we launch additional skills in this repo in the coming weeks and months!"* → repo sẽ phình thêm.

---
## 🧩 Mổ xẻ 1 skill — `firebase-basics`
Frontmatter description nguyên văn: *"Use this skill whenever you are working on a project that uses Firebase products or services, especially for mobile or web apps."*

Skill này dạy agent quy trình:
1. **Bắt buộc cài skill chi tiết hơn trước**: `npx -y skills add firebase/agent-skills -y` (tức `google/skills` chỉ là "cửa ngõ", trỏ sang repo Firebase chuyên sâu bên dưới)
2. Login CLI: `npx -y firebase-tools@latest login`, chọn project qua `use` / `use --add`
3. Kèm 6 reference files: `core-concepts.md`, `cli-usage.md`, `client-library-usage.md`, `mcp-usage.md`, `iac-usage.md`, `iam-security.md`

Lý do tồn tại, nguyên văn trong SKILL.md: *"Failure to follow these instructions may result in using outdated patterns and lack of access to essential reference materials."* — tức là chống chuyện này:
```js
// ❌ Bad — agent không có skill, kiến thức train cũ → viết Cloud Functions v1
const functions = require('firebase-functions');
exports.webhook = functions.https.onRequest((req, res) => { /* ... */ });

// ✅ Good — có skill load pattern mới → Functions v2 (xem [[1-Cloud Functions v2]])
const { onRequest } = require('firebase-functions/v2/https');
exports.webhook = onRequest({ region: 'us-central1' }, (req, res) => { /* ... */ });
```

---
## 🔥 Repo anh em: `firebase/agent-skills` — cái này mới "ăn tiền" với stack mình
Repo riêng của Firebase team (Apache 2.0, ~348 ⭐), 11 skills trong `/skills`:

| Skill | Dùng khi |
|---|---|
| `firebase-firestore` | Data modeling, query, index → bổ trợ [[0-Firestore Basics]], [[1-Composite Indexes]] |
| `firebase-auth-basics` | ID token, session, custom claims → bổ trợ [[0-Firebase Auth]] |
| `firebase-security-rules-auditor` | **Audit Security Rules** — agent soát rules trước khi deploy |
| `firebase-app-hosting-basics`, `firebase-hosting-basics` | Hosting/App Hosting → [[1-Firebase Hosting CDN]] |
| `firebase-remote-config-basics` | Feature flag, A/B config |
| `firebase-crashlytics` | Crash report (mobile là chính) |
| `firebase-data-connect-basics`, `firebase-ai-logic-basics` | Data Connect (Postgres), AI Logic — chưa dùng |
| `firebase-basics`, `xcode-project-setup` | Nền chung + iOS setup |

---
## ⚙️ Cài đặt — lệnh theo từng agent

| Agent | Lệnh (nguyên văn từ docs/repo) |
|---|---|
| Agent Skills CLI (đa agent) | `npx skills install github.com/google/skills` hoặc `npx skills add google/skills` |
| Firebase skills qua CLI | `npx skills add firebase/skills` |
| **Claude Code** (plugin) | `claude plugin marketplace add firebase/skills` → `claude plugin install firebase@firebase` |
| Gemini CLI | `gemini extensions install https://github.com/firebase/skills` |
| Codex | `codex plugin marketplace add firebase/skills` → `codex plugin add firebase@firebase` |

Chạy `npx skills add` xong sẽ có menu chọn từng skill — **không cần cài cả 30**.

> [!tip] 💡
> Firebase skills hỗ trợ rộng: Cursor, Windsurf, GitHub Copilot, Claude, Codex, Gemini CLI. Format Agent Skills là chuẩn mở → cài 1 lần, agent nào cũng đọc được.

---
## 🛒 Áp dụng với stack Joy Loyalty — đối chiếu codebase thật (12/06/2026)
Đã scan `~/WebstormProjects/joy`: Functions **100% v2 API** (Node 22, esbuild), Firestore (rules + composite indexes), Storage (`storage.rules`), Hosting, Pub/Sub, Cloud Tasks (`onTaskDispatched`), Scheduler (`onSchedule`), **Cloud SQL/Postgres** (`@google-cloud/cloud-sql-connector` + `pg`), BigQuery, Monitoring, Redis, Gemini (`@google/genai`) + LangChain/LangGraph + MCP SDK, ~35 Shopify extensions.

**Điểm mấu chốt:** Joy đã có ~60 skill tự viết trong `.claude/skills/` (bigquery-analytics, firestore-database, cloud-tasks-queue, security-audit, redis-cache-patterns, billing-monitor, prod-troubleshoot, backend…) — phần lớn official skills bị **trùng** với bộ này, và bản tự viết tốt hơn vì có Joy conventions.

| Skill official | Verdict | Lý do |
|---|---|---|
| `firebase-security-rules-auditor` | ✅ **Cài** | Gap thật: skill `security-audit` của Joy chỉ cover app-layer (IDOR, HMAC, PII trong functions), **không ai audit `firestore.rules` + `storage.rules`** |
| `cloud-sql-basics` | ✅ **Cài** | Gap thật: dùng Cloud SQL connector + `pg` nhưng không có skill nào về Cloud SQL/Postgres |
| `gemini-api` | ✅ **Cài** | Dùng `@google/genai` trực tiếp; bộ langchain-* skills không cover Gemini API (model, structured output, pricing) |
| `google-cloud-waf-security` | 🤔 Cân nhắc | Infra-level (IAM, network) — bổ sung góc nhìn mà security-audit app-layer không có; dùng khi review kiến trúc |
| `firebase-firestore`, `bigquery-basics`, `firebase-basics` | ❌ Bỏ qua | Trùng `firestore-database`, `bigquery-analytics` đã tailored cho Joy |
| `cloud-run-basics` | ❌ Bỏ qua | Không có custom Cloud Run service (Functions v2 lo phần infra); skill `backend` đã cover config |
| `google-cloud-waf-cost-optimization` | ❌ Bỏ qua | `billing-monitor` tự viết đã code-aware, xịn hơn bản generic |
| `firebase-remote-config-basics` | 💡 Ý tưởng | Joy chưa dùng Remote Config — thiếu feature chứ không thiếu skill; cân nhắc nếu muốn feature flag |

> [!warning] ⚠️ Lưu ý khi dùng trong project production
> - `firebase-basics` **chỉ thị agent tự chạy lệnh cài đặt + login CLI** (`npx -y skills add...`, `firebase-tools login`). Trong repo production: chạy agent ở permission mode có hỏi trước, đừng YOLO mode — lệnh `use --add` chọn nhầm project là thao tác thẳng vào project thật.
> - Skill là Markdown từ repo ngoài → bản chất là **prompt injection surface**. Repo chính chủ Google thì tin được, nhưng skill bên thứ ba (vd. tổng hợp từ awesome-list) phải đọc SKILL.md trước khi cài.
> - Skill không thay thế hiểu biết: agent audit Security Rules giúp bắt lỗi sớm, nhưng rule bảo vệ tiền điểm loyalty vẫn phải tự review (xem [[3-Security Rules]] — chưa viết).

---
## 📚 Tham khảo
- [Level Up Your Agents: Announcing Google's Official Skills Repository](https://cloud.google.com/blog/topics/developers-practitioners/level-up-your-agents-announcing-googles-official-skills-repository) — blog announcement chính thức (23/04/2026, Cloud Next 2026): định nghĩa skill, lý do chống context bloat, 13 skills đầu tiên.
- [google/skills (GitHub)](https://github.com/google/skills) — repo gốc, 30 skills trong `skills/cloud/`, cài qua `npx skills add google/skills`.
- [firebase/agent-skills (GitHub)](https://github.com/firebase/agent-skills) — repo Firebase chuyên sâu: Firestore, Auth, Security Rules auditor, App Hosting…
- [Firebase agent skills — Develop with AI assistance (docs)](https://firebase.google.com/docs/ai-assistance/agent-skills) — docs chính thức: skill là "portable, self-contained modules of Firebase-specific knowledge" giúp agent chính xác hơn với token thấp hơn.
- 🔥 [Google Just Launched an Official Agent Skills Repository. Here's What It Actually Solves.](https://dev.to/om_shree_0709/google-just-launched-an-official-agent-skills-repository-heres-what-it-actually-solves-2k5c) — bài phân tích trending trên DEV Community.
- [VoltAgent/awesome-agent-skills](https://github.com/VoltAgent/awesome-agent-skills) — curated list 1000+ skills cộng đồng (Claude Code, Codex, Gemini CLI, Cursor…).

---
## ✅ Checklist
- [ ] Hiểu Agent Skill = Markdown docs load on-demand, chống context bloat (≠ MCP server)
- [ ] Cài skill Firebase cho Claude Code: `claude plugin marketplace add firebase/skills` → `claude plugin install firebase@firebase`
- [ ] Chọn lọc skill theo stack: `firebase-firestore`, `firebase-auth-basics`, `cloud-run-basics`, `bigquery-basics`
- [ ] Thử `firebase-security-rules-auditor` audit rules của Joy trước release
- [ ] Không cho agent tự chạy `firebase use --add` / login trong repo production mà không review
- [ ] Theo dõi repo — Google sẽ thêm skills mới "in the coming weeks and months"
