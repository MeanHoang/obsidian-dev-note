---
title: "Sổ tay harness"
created: 2026-09-28
tags:
  - ai/claude-code
  - workflow
  - avada/joy
type: note
domain: meta
status: live
---

# Sổ tay harness Joy (cá nhân)

> Tình trạng harness sau đợt cải thiện 28/09/2026. Bối cảnh vì sao làm vậy: [[3.Cải thiện AI harness]] · [[4.Các bước cải thiện harness]].
> **Sửa harness thì sửa ở repo gốc** `~/WebstormProjects/joy`, sau đó `/sync-harness` trong worktree.

---

## 1. Tra nhanh: tình huống → gõ gì

| Tình huống                                      | Gõ                                                      |
| ----------------------------------------------- | ------------------------------------------------------- |
| Nhận **task feature** từ Notion                 | `/joy-ship <notion-url>`                                |
| **Tester báo bug** trên branch đang UAT         | `/joy-ship <notion-url>` (tự vào chế độ STABILIZE)      |
| **Merchant báo bug** (Crisp, ticket, Slack)     | `/bug-check <link>`                                     |
| Muốn nhắc AI tập trung vào đâu                  | thêm `--note "check kỹ luồng A, file abc"` vào sau lệnh |
| Quay lại branch, quên đang làm tới đâu          | `/branch-focus`                                         |
| Xem mọi task, task nào đang chờ mình            | `/ship-board`                                           |
| Xem Notion / Slack có gì mới                    | `/joy-task-catchup`                                     |
| Merge master vào branch, xử lý conflict         | `/merge-branch`                                         |
| Chạy dev local                                  | `/dev-start` (của team; AI tự chọn scope theo task)     |
| Dừng dev                                        | `yarn kill-dev-orphans`                                 |
| Deploy extension                                | `/deploy-extensions`                                    |
| Deploy staging                                  | `/deploy-staging N` (của team)                          |
| Store nào để test, mật khẩu, đăng nhập customer | `/test-environments`                                    |
| Worktree thiếu skill / harness ở main mới hơn   | `/sync-harness`                                         |
| Đầy đĩa, worktree cũ, ảnh rác                   | `/joy-disk-cleanup`                                     |
| Thêm label mới                                  | `/translate` (của team)                                 |

**Mở một task mới:**
1. Orca → tạo workspace (worktree) cho task.
2. Trong tab: `claude --dangerously-skip-permissions`.
3. Hook tự trang bị harness nếu worktree còn "trần" (xem §6).
4. Gõ `/joy-ship …` hoặc `/bug-check …`.

**Session cũ chưa nhận luật mới:** `/exit` rồi `claude -c --dangerously-skip-permissions` (`-c` mở lại đúng cuộc trò chuyện gần nhất).

---

## 2. Hai lớp harness: team và của tôi

| | Lớp team (PM build) | Lớp của tôi |
|---|---|---|
| Nằm ở | `CLAUDE.md`, `.claude/agents`, `commands`, skill team, 6 hook | `CLAUDE.local.md`, 11 skill, `workflow/`, `roles/`, 5 hook, script |
| Git | đã commit | **untracked**, ẩn bằng `.git/info/exclude` |
| Khi mâu thuẫn | — | **lớp của tôi thắng** (`CLAUDE.local.md`) |

**`CLAUDE.local.md` ghi đè 7 điểm:**
1. Bỏ qua khối `orca-lanes` / `cmux-workflow` → **không mở lane Codex**; song song trong task = sub agent.
2. Review = `/review` (của Joy) chạy trong sub agent + 1 tracer, **1 vòng**; không dùng `code-reviewer` thay.
3. Commit chờ tôi nói "commit"; bug tester **mỗi bug 1 commit**; push chỉ khi tôi bảo; message tiếng Anh.
4. Dev local: chỉ `/dev-start` + luật chọn scope (§5).
5. Chat tiếng Việt; tài liệu cho agent viết tiếng Anh.
6. Giao việc cho sub agent kèm file role + khối; hỏi tôi theo `grill-me.md`.
7. **Phải verify trước khi nói "đã sửa"**: FE có ảnh trước/sau, BE có test fail → pass.

---

## 3. Ba luồng làm việc

Mọi luồng dùng chung **8 khối** (`.claude/workflow/blocks/`):

| Khối | Làm gì |
|---|---|
| **K0** Mở việc | worktree từ `origin/master`, kiểm tra auth, tạo `.claude/ship/<task>/` |
| **K1** Bằng chứng | 3 chân: vấn đề · code (`file:line`, đọc trên master) · setting thật |
| **K2** Tái hiện | FE: **chụp ảnh bug** · BE: **test/script FAIL** |
| **K3** Sửa | FE: **thử sửa live trên trình duyệt → gửi 2 ảnh → tôi duyệt** → mới code · BE: code cho test PASS |
| **K4** Xác nhận | FE: ảnh sau · BE: test pass (output thô) |
| **K5** Review | **1 lần** cuối lô: `/review` + tracer |
| **K6** Commit | chờ chữ "commit" của tôi, chỉ file của task |
| **K7** Ship | push, MR, deploy, test lại sau pipeline — **chỉ khi tôi bảo** |

🚦 = AI dừng, chờ tôi.

### 3.1. `/bug-check`: bug merchant (prod)
```
K0 → K1 (3 chân) → K2 (tái hiện) → VERDICT 🚦
                                   └─ tôi nói "fix" → K3 → K4 → K5 → K6 🚦 commit → (K7 khi bảo)
```
- **4 verdict:** `fix` · `skip` · `need-data` · `need-logging`. Verdict nào cũng kèm **số shop bị ảnh hưởng** (đo thật) và *"verdict này lật nếu…"*.
- Không bao giờ ghi vào store prod.
- Fix lớn, nhiều surface → nâng lên `/joy-ship` ngay trong worktree đó, mang theo chẩn đoán.

### 3.2. `/joy-ship` STABILIZE: bug tester
```
Đọc danh sách bug (Notion theo số)
Mỗi bug, TUẦN TỰ: K1 (+ tìm commit gây lỗi) → K2 → K3 → K4 → K6 🚦 commit
Hết lô: K5 review 1 lần → sửa finding (commit riêng) → K7 khi bảo
```
- Bug do master hoặc dev khác gây ra → **báo commit + tác giả**, không tự sửa.
- Bug khác surface → scout đọc song song; còn sửa thì vẫn tuần tự.

### 3.3. `/joy-ship` SHIP: feature
```
Gate 1 🚦 Hiểu (analysis.md, hỏi từng câu, chốt GOAL)
Gate 2 🚦 Plan: 2a gom facts (scout song song) → 2b chốt trade-off → 2c chia phase (tôi chọn thứ tự) → 2d plan.html
Mỗi phase: K3 → K4 (ảnh/test) → K6 🚦 commit
Hết phase: K5 review 1 lần → K7 khi bảo
```
- Giữa chừng phát hiện mới: **A** (trade-off kỹ thuật) · **B** (bản đồ Gate 1 sai → 🚦) · **C** (đổi hướng → chia lại phase).
- File của task (`.claude/ship/<task>/`): `analysis.md` · `facts.md` · `plan.html` · `progress.md` (checkbox + 1 dòng NOW) · `decisions.md` · `tmp/` (ảnh, mockup, log, xoá được).

---

## 4. Role và bộ tiêu chuẩn

| Role | Việc | Khối |
|---|---|---|
| **parent** (session chính) | điều phối, verify lại, hỏi tôi, commit | K0, K6, K7, các gate |
| scout | đọc code / setting / log | K1, feature 2a |
| implementer | viết code | K3 |
| verifier | chụp ảnh, test fail → pass, chọn store | K2, K4 |
| reviewer | chạy `/review` + chuẩn riêng của tôi | K5 |
| tracer | tìm hidden dependency giữa surface | K5 |
| decider | có đáng làm không / làm thế nào | trước khi build |

**Bộ tiêu chuẩn tự lớn lên:**
1. Tôi sửa lưng agent.
2. Parent soạn 1 dòng tiêu chuẩn → **hỏi tôi** → tôi gật thì ghi vào file role (kèm ngày + câu gốc).
3. Vi phạm lần 2 → đẩy xuống hook hoặc test.

**Luật hỏi (grill me):** chỉ hỏi khi có trade-off thật / khẩu vị / đã thử query mà vẫn không tự trả lời được. Format: bối cảnh 1 dòng → lựa chọn → **đề xuất + vì sao**. BE kèm luồng `1→2→3` + `file:line`; FE kèm ảnh.

---

## 5. Dev local và test

### Dev local: chỉ `/dev-start`
Trước khi chạy, AI **đọc diff của task để chọn scope** và nói cho tôi:

| Task đụng vào | Tham số |
|---|---|
| chỉ `packages/assets`, `packages/functions` | (không cần) → stack nhẹ mặc định |
| `packages/scripttag`, `packages/web-components` | `--scripttag` |
| `extensions/<x>` | `light <nhóm>` |
| widget storefront gọi data (app proxy) | cần tunnel: `light theme --scripttag` |

- **Trong worktree:** chạy `bootstrap-worktree.sh <wt> --dev` trước (cài `node_modules` thật, khoảng 3,6 GB). Không làm bước này thì sẽ **chạy nhầm code của main**.
- **Worktree khác đang giữ cổng dev** → AI hỏi *chờ / giành (`JOY_DEV_TAKEOVER=1`) / huỷ*, không tự kill.
- Dừng: `yarn kill-dev-orphans`. Restart: dừng rồi `/dev-start` lại với đúng tham số cũ.
- Bẫy hay gặp: xem `CLAUDE.local.md` §4 (widget trắng, `[app_proxy]` với localhost, locale quá 250 key, app embedded "treo", đĩa đầy).

### Test: store nào
Claude in Chrome (đăng nhập `hoangtm@avadagroup.com`) **chỉ có quyền ở 5 store**:

| Store | App Joy |
|---|---|
| `ag-mh-shop2` (local) | `ag-hoangtm-local` |
| `ag-maint7-joy-staging7` | `avada-joy-staging-7` |
| `mh2-shop-staging22` | `avada-joy-staging-22` |
| `ag-mh-shop-staging25` | `avada-joy-staging-25` |
| `my-store-hai` (**store test trên app PROD**) | `loyaltify-loyalty-program` |

**Luật chọn** (AI phải **nói "test ở store X vì Y"** trước khi test):
1. Code chưa deploy → local.
2. Đã deploy → đúng staging đang chạy **branch của task** (xem nhãn branch màu xanh trên dashboard Joy).
3. Bug tester → store ghi trong báo cáo (loyalty page V2 = staging 25).
4. Bug merchant (prod) → **không đụng store của merchant**; đọc setting qua MCP, tái hiện trên **`my-store-hai`** khi cần đúng code/app prod, không thì local/staging.
5. Kiểm tra sau khi release prod → `my-store-hai`.

**Trình duyệt:** Claude in Chrome cho **mọi** test (admin lẫn storefront). Playwright chỉ là dự phòng khi Chrome mất kết nối (`/chrome`). Mật khẩu storefront dev/staging: `1`.
**Đổi setting để test:** **chỉ qua giao diện**, tức admin Joy trên Chrome (5 store, gồm `my-store-hai`; không bao giờ store của merchant thật) → **ghi giá trị cũ, test xong trả lại**. **Không tự gọi API, không tự ghi Firestore** (chỉ được đọc Firestore để kiểm tra kết quả). UI không có chỗ chỉnh → hỏi tôi.
**Đọc setting khi không có key SA:** MCP Joy (chỉ đọc) → Chrome vào admin → Chrome vào storefront (`window.AVADA_JOY`; program chưa launch thì không có metafield).
**Override storefront (v0):** ghi đè `fetch` / `window.AVADA_JOY` / CSS **chỉ trên trình duyệt**, không ghi DB. Dùng để tái hiện, thử bản sửa, gắn log tạm.

---

## 6. Worktree và bảo trì harness

| Việc | Cách |
|---|---|
| Worktree mới / còn trần | **tự động**: hook global `~/.claude/hooks/joy-worktree-harness.sh` (SessionStart) chạy bootstrap |
| Harness ở main mới hơn | hook nhắc → `/sync-harness` |
| Chạy tay | `bash ~/WebstormProjects/joy/.claude/scripts/bootstrap-worktree.sh <worktree> [--dev] [--quiet]` |
| CLAUDE.md của worktree cũ hơn master | bootstrap cảnh báo → merge master vào branch |

- Bootstrap **copy** harness sang worktree; chạy lại = đồng bộ, tự gỡ những thứ đã xoá ở main. Chỉ `.claude/ship` (trạng thái task dùng chung) và `node_modules` (tới khi `--dev`) là symlink.
- `.git/info/exclude` dùng chung mọi worktree → WebStorm không hiện harness trong mục "Unversioned".
- Output của `loyalty-page-from-shop` (`designs/`, `loyalty-page-v2-<shop>.html`) cũng đã ẩn. Muốn commit file preview mới thì dùng `git add -f`.

**Dọn đĩa:** `/joy-disk-cleanup` — quét → hỏi → dọn (vào Thùng rác). Gồm `node_modules` của worktree đã merge, ảnh/mockup task xong, rác. Không bao giờ đụng worktree còn thay đổi chưa commit hoặc đang có session.

**Backup trước khi sửa lớn:** `~/.claude/harness-backups/` (bản 28/09 gồm cả 4 skill dev đã bỏ).

---

## 7. Hook đang chạy

| Hook | Tác dụng |
|---|---|
| `branch-guard` | chặn `git stash -u`, commit/push lệch branch |
| `block-translation-append` | chặn thêm key dịch vào cuối file |
| `memory-consent` | chặn AI tự ghi memory (phải hỏi tôi) |
| `require-worktree-deps` | chặn chạy dev trong worktree còn `node_modules` symlink → bắt chạy `bootstrap … --dev` trước |
| `ship-state-sync` / `ship-context-restore` | lưu / nạp lại tiến độ joy-ship khi compact, resume |
| `auto-lint` (bản của tôi, skip-worktree) | eslint chỉ dòng đã đổi |
| `joy-worktree-harness` (global) | tự trang bị worktree |
| *team:* `require-translate`, `block-tunnel-url`, `block-dangerous-bash`, `require-docs`, `recursion-guard` | — |
| *đã tắt:* `readonly-intent-guard`, `commit-consent` | — |

---

## 8. Xử lý sự cố

| Triệu chứng | Làm |
|---|---|
| Session không biết luật mới / không có skill | `/exit` → `claude -c --dangerously-skip-permissions` |
| Worktree thiếu `joy-ship` | `/sync-harness`, hoặc `! bash ~/WebstormProjects/joy/.claude/scripts/bootstrap-worktree.sh "$(git rev-parse --show-toplevel)"` |
| AI không đọc được `~/Documents` (Obsidian) | Orca mất quyền TCC → `tccutil reset SystemPolicyDocumentsFolder com.stablyai.orca` → thoát hẳn Orca (kill cả Orca Helper cũ) → mở lại |
| AI bị chặn ghi memory | đúng luật `memory-consent`: **câu mới nhất** phải có chữ *"memory"* / *"lưu lại"* / *"ghi nhớ"* (vd *"ok sửa memory"*). "sửa nhé", "đồng ý" không đủ |
| `/dev-start` báo cổng bị worktree khác giữ | chọn chờ / giành / huỷ |
| Trang Joy local báo "Not Found / technical problem", Vite 403 "outside of Vite serving allow list" | worktree chưa `--dev` → `node_modules` symlink sang main. Chạy `bootstrap-worktree.sh <wt> --dev` (~1 phút, ~4 GB) rồi `/dev-start` lại |
| Đầy đĩa | `/joy-disk-cleanup` |
| Hook `block-dangerous-bash` chặn `rm -rf` | đúng luật team; xoá từng file hoặc dùng đường dẫn tương đối |

---

## 9. Bản đồ file

```
~/WebstormProjects/joy/
├── CLAUDE.md                       team
├── CLAUDE.local.md                 ghi đè của tôi
├── .claude/
│   ├── settings.local.json         wiring hook của tôi
│   ├── hooks/                      hook (team + của tôi)
│   ├── skills/                     skill (team + 11 của tôi)
│   ├── workflow/blocks/K0…K7.md    8 khối dùng chung
│   ├── workflow/grill-me.md        luật hỏi
│   ├── roles/*.md                  7 role + tiêu chuẩn
│   ├── scripts/                    bootstrap-worktree.sh · joy-disk-cleanup.sh · ship-board.sh
│   └── ship/<task>/                trạng thái từng task (dùng chung mọi worktree)
└── .git/info/exclude               ẩn harness khỏi git
~/.claude/
├── settings.json                   hook global + telemetry
├── hooks/joy-worktree-harness.sh
├── harness-backups/
└── projects/…/memory/              memory (chỉ ghi khi tôi bảo)
```

**11 skill của tôi:** `joy-ship` · `bug-check` · `analyze-task` · `branch-focus` · `merge-branch` · `test-environments` · `deploy-extensions` · `ship-board` · `joy-task-catchup` · `sync-harness` · `joy-disk-cleanup`
