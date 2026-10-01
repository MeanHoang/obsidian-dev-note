---
title: "Sổ tay harness"
created: 2026-09-28
updated: 2026-09-29
tags:
  - ai/claude-code
  - workflow
  - avada/joy
type: note
domain: meta
status: live
---

# Sổ tay harness Joy (cá nhân)

> Trạng thái ngày **29/09/2026**. Lý do từng quyết định: [[3.Cải thiện AI harness]] · [[4.Các bước cải thiện harness]] · [[5.Cải thiện chạy đường dài cho tính năng lớn]] · [[6.Research cải thiện joy-ship]] · [[7.Phân tích superpowers]] · [[8.Role product và ship-new]]. Sơ đồ: `Sơ đồ agent harness.html` (vẽ lại 29/09 theo bộ `ship-*`).
> **Sửa harness ở repo gốc** `~/WebstormProjects/joy`, rồi chạy `/sync-harness` trong worktree.

---

## 1. Tra nhanh: tình huống → gõ gì

| Tình huống | Gõ |
|---|---|
| **App / dự án mới** từ một ý tưởng | `/ship-new` |
| **Feature** từ Notion, cần hiểu + plan | `/ship <notion-url>` |
| Feature lớn, **muốn treo máy** | `/ship …` → chốt Gate 1, 2 → nói **"move auto"** (chạy `/ship-auto`) |
| **Việc nhỏ**: diff nói được trong 1 câu | `/ship-fix …` |
| **Tester báo bug** trên branch đang UAT | `/ship-bugs <notion-url>` |
| **Merchant báo bug** (Crisp, ticket, Slack) | `/bug-check <link>` |
| Hỏi **"fix thật chưa"**, ở bất kỳ đâu | `/ship-verify` |
| **Review nhánh 1 vòng**, ở bất kỳ đâu | `/ship-review` |
| Nhắc AI tập trung vào đâu | thêm `--note "check kỹ luồng A, file abc"` sau lệnh |
| Quay lại branch, quên đang làm tới đâu | `/branch-focus` |
| Xem mọi task, task nào đang chờ mình | `/ship-board` |
| Notion / Slack có gì mới | `/joy-task-catchup` |
| Merge master vào branch, xử lý conflict | `/merge-branch` |
| Chạy dev local / dừng | `/dev-start` (AI tự chọn scope) / `yarn kill-dev-orphans` |
| Deploy extension / staging | `/deploy-extensions` / `/deploy-staging N` |
| Store nào để test, mật khẩu, đăng nhập customer | `/test-environments` |
| Thêm label mới | `/translate` |
| Worktree thiếu skill, harness ở main mới hơn | `/sync-harness` |
| Đầy đĩa, worktree cũ, ảnh rác | `/joy-disk-cleanup` |

**Mở một task mới:**
1. Orca → tạo workspace (worktree) cho task.
2. Trong tab: `claude --dangerously-skip-permissions`.
3. Worktree còn "trần" thì hook tự cài harness (§8).
4. Gõ lệnh ở bảng trên. Không chắc gõ gì thì cứ `/ship`: AI tự chọn luồng và nói lý do, anh cãi được.

**Session cũ chưa nhận luật mới:** `/exit` → `claude -c --dangerously-skip-permissions`.

---

## 2. Harness gồm 3 lớp

| Lớp | Nằm ở | Git | Khi mâu thuẫn |
|---|---|---|---|
| **Team** (PM build) | `CLAUDE.md`, `.claude/agents`, `commands`, skill team, 6 hook | đã commit | — |
| **Bộ `ship-*`** (của tôi, dùng được mọi project) | 8 skill `ship*`, `workflow/`, `roles/`, hook `ship-*`, script | untracked | — |
| **Riêng Joy** (của tôi) | `CLAUDE.local.md`, `.claude/ship-profile.md`, `bug-check`, vài skill Joy | untracked | **thắng lớp team** |

Cả lớp của tôi được ẩn bằng `.git/info/exclude`, nên không bao giờ lọt vào commit.

**`CLAUDE.local.md` ghi đè team ở 7 điểm:**
1. Bỏ khối `orca-lanes` / `cmux-workflow`: không mở lane Codex. Song song trong task = sub agent.
2. Review = **1** sub agent chạy `/review` của Joy, **1 vòng**. Không dùng `code-reviewer` thay.
3. Commit chờ tôi nói "commit". Bug tester thì mỗi bug 1 commit. Push chỉ khi tôi bảo. Message tiếng Anh. **Ngoại lệ duy nhất:** `/ship-auto` được tự commit, vẫn không push.
4. Dev local: chỉ `/dev-start` + luật chọn scope (§6).
5. Chat tiếng Việt; tài liệu cho agent đọc viết tiếng Anh.
6. Giao việc cho sub agent kèm file role + khối; hỏi tôi theo `grill-me.md`.
7. **Phải có bằng chứng mới được nói "đã sửa"**: FE có ảnh trước/sau, BE có test fail → pass.

---

## 3. Bộ `ship-*`

### 3.1. Lõi và profile
- **Lõi dùng chung** (không có chữ Joy): 8 skill `ship*`, `workflow/ship-core.md` (luật chung: chọn luồng, gate, `--note`, việc phát sinh, file của task, resume), khối `blocks/K0…K7` + `P-product`, `roles/`, `auto-decide.md`, `mode-cards/`, hook `ship-*`, script `ship-auto-run.sh`.
- **Riêng Joy:** `.claude/ship-profile.md`, 14 mục: §1 repo · §2 surface · §3 đọc setting (Joy MCP → Chrome admin → storefront) · §4 store test + override storefront · §5 dev · §6 auth · §7 implementer + model · §8 lệnh review · §9 ship (GitLab, deploy) · §10 việc auto cấm tự quyết · §11 Standards riêng từng role (có mục product) · §12 ca dễ vỡ · §13 bối cảnh sản phẩm (chúng ta là ai, người dùng, nguồn bằng chứng) · §14 giao diện cho mockup (Polaris admin, widget V4).
- **Repo public [MeanHoang/my-ship](https://github.com/MeanHoang/my-ship)** chứa lõi (không có gì của Joy). Sửa harness ở Joy xong, muốn đồng bộ lên repo: `bash ~/WebstormProjects/joy/.claude/scripts/ship-export.sh <thư mục clone my-ship>` → xem `git diff` → commit → push. Script tự gỡ trích dẫn memory và mã ticket JOY. Project khác cài bằng `bash my-ship/install.sh <project>`.
- Khối K và role chỉ ghi "xem **profile §N**". **Mang sang project khác** = copy lõi + viết `ship-profile.md` mới, giữ nguyên số mục. Danh sách file cần copy ở cuối `ship-core.md`.

### 3.2. 8 khối dùng chung

| Khối | Làm gì |
|---|---|
| **K0** Mở việc | worktree từ `origin/master`, kiểm tra auth, tạo `.claude/ship/<task>/` |
| **K1** Bằng chứng | 3 chân: vấn đề · code (`file:line`, đọc trên master với bug prod) · setting thật |
| **K2** Tái hiện | FE: chụp ảnh bug · BE: test/script **FAIL** |
| **K3** Sửa | FE: sửa thử live trên trình duyệt → gửi 2 ảnh → **tôi duyệt** → mới code · BE: code cho test PASS, cấm sửa test |
| **K4** Xác nhận | FE: ảnh sau (nội dung thì đọc DOM) · BE: test PASS + **gỡ bản sửa thì test phải FAIL** + test cũ vẫn chạy |
| **K5** Review | 1 lần cuối lô, chỉ còn 2 mức: `must-fix` (sai hành vi / lệch GOAL, được sửa) và `optional` (chỉ liệt kê) |
| **K6** Commit | chờ chữ "commit"; chỉ file có tên trong `progress.md`; lúc xin commit hỏi luôn có thêm dòng tiêu chuẩn không |
| **K7** Ship | push, MR, deploy, test lại sau pipeline, **chỉ khi tôi bảo** |
| **P** Sản phẩm | role `product`, **chạy mù với bản BA**: **P1** hiện trạng + research (chỉ nhận mục tiêu; mỗi claim có nguồn + ngày, đoạn trích kết quả tìm kiếm không tính; tối đa 4 câu hỏi) → **P2** đề xuất v1 + **mockup 2–4 màn HTML** (parent mở cho anh) → **P3** bảng so với spec BA · **Decide** (thẻ quyết định: lựa chọn · đề xuất · fails if · cách thử rẻ nhất · điều gì làm đổi ý) |

🚦 = AI dừng, chờ tôi.

### 3.3. Các luồng

**`/ship-new`: app mới từ ý tưởng** (mode `NEW`)
```
Gate 0 🚦 Sản phẩm: role product P1 research → P2 đề xuất + mockup → product.md → Build/Reframe/Kill
Gate 1 🚦 Stack + kiến trúc: 2–3 phương án (có phương án tối giản), tôi chọn → decisions.md
Phase 0 🚦 Bộ khung chạy được: template chính thức, lint, 1 test thật, CI, 1 luồng end-to-end
AI viết ship-profile.md 🚦 → từ đây mỗi feature đi /ship hoặc /ship-auto
```

**`/ship`: feature** (mode `SHIP`, hoặc `CONTINUE` khi branch đã có tiến độ)
```
Sản phẩm 🚦: role product P1 hiện trạng + research → P2 đề xuất + mockup → P3 so với bản BA (anh chốt)
Gate 1 🚦 Hiểu: analysis.md, hỏi từng câu, chốt GOAL
Gate 2 🚦 Plan: 2a 1 scout gom facts → 2b chốt trade-off → 2c chia phase (tôi chọn thứ tự) → 2d plan.html (có mục "ca dễ vỡ")
Mỗi phase: K3 → K4 → K6 🚦 commit
Hết phase: K5 review 1 lần → K7 khi bảo
```
Giữa chừng phát hiện mới: **A** trade-off kỹ thuật (hỏi) · **B** bản đồ Gate 1 sai (🚦) · **C** đổi hướng (chia lại phase). B, C và trade-off làm đổi thứ người dùng thấy → kèm **thẻ Decide của role product**.

**`/ship-auto`: treo máy sau Gate 2**
1. Nói "move auto" → AI kiểm tra auth, đĩa, dev, Chrome → hỏi *"Cho chạy đến mấy giờ?"*.
2. Script `ship-auto-run.sh` chạy nền: **mỗi phase một phiên `claude -p` mới** (để không trôi sau nhiều giờ).
3. Mỗi phase: code → bằng chứng → review riêng phase (sửa must-fix 1 vòng) → **tự commit** → tick kèm bằng chứng.
4. Gặp chuyện mới: AI quyết theo `auto-decide.md` (GOAL → pattern có sẵn → dễ đảo ngược → không phá shop cũ → diff nhỏ). Mỗi quyết định = 1 commit `[D-auto-N]` + 1 dòng trong `decisions.md` có lệnh `git revert`. Việc trong vùng cấm (ghi data thật, đổi GOAL, query tốn tiền, surface khác, profile §10) thì **park** rồi làm việc khác.
5. Dừng khi: hết việc · quá giờ · kẹt 2 vòng liền. Lần nào dừng cũng chạy thêm 1 phiên cuối để viết `report.html`. **Không bao giờ push.**
6. Tôi về: mở `report.html` → trả lời "giữ" / "đảo D-auto-N". Gõ `dừng auto` hoặc `pkill -f ship-auto-run` để dừng giữa chừng. Trong lúc script chạy, **đừng bảo session chính sửa gì** (2 bên cùng ghi file = hỏng trạng thái).

**`/ship-fix`: việc 1 câu** (mode `LITE`): K0 → sửa → bằng chứng → 🚦 commit → K5. Không plan. Đụng tới component dùng chung, surface khác, setting mới, hoặc bị chặn commit file thứ 2 → AI tự chuyển sang `/ship` và báo.

**`/ship-bugs`: bug tester** (mode `STABILIZE`)
```
Đọc danh sách bug. Mỗi bug có dòng Files:
Mỗi bug, TUẦN TỰ: K1 (+ git log -S tìm commit gây lỗi) → K2 → K3 → K4 → K6 🚦 commit
Hết lô: K5 1 lần → sửa finding (commit riêng) → K7 khi bảo
```
Bug do master hoặc dev khác gây ra → báo commit + tác giả, không tự sửa. Bug báo thêm giữa chừng → xếp cuối hàng đợi.

**`/ship-verify`** (dùng lẻ): 1 verifier chứng minh một thay đổi chạy thật (test fail/pass + gỡ bản sửa, hoặc ảnh trước/sau). Kết luận: proven / not proven / không verify được. Không sửa gì.

**`/ship-review`** (dùng lẻ): 1 reviewer chạy `/review` + Standards; parent tự mở lại từng must-fix trước khi báo.

**`/bug-check`: bug merchant (prod)**, skill riêng của Joy
```
K0 → K1 (3 chân) → K2 → VERDICT 🚦 → tôi nói "fix" → K3 → K4 → K5 → K6 🚦 → (K7 khi bảo)
```
4 verdict: `fix` · `skip` · `need-data` · `need-logging`, kèm **số shop bị ảnh hưởng** (đo thật). Không bao giờ ghi vào store prod. Fix lớn → chuyển lên `/ship` ngay trong worktree đó.

### 3.4. File của một task (`.claude/ship/<task>/`, không commit)

| File | Chứa |
|---|---|
| `progress.md` | khối state (mode, auto…) + checkbox (mỗi việc ghi file) + **1 dòng NOW** + "Waiting on user" |
| `decisions.md` | quyết định + lý do + phương án bị loại (chỉ ghi thêm, không sửa) |
| `analysis.md` · `facts.md` · `plan.html` | Gate 1 · bằng chứng của scout · plan |
| `report.html` | cuối `/ship-auto` |
| `tmp/{shots,mockups,logs}` | ảnh, mockup, log: xoá được |

---

## 4. Role và bộ tiêu chuẩn

| Role | Việc | Khối | Model |
|---|---|---|---|
| **parent** (session chính) | điều phối, tự mở `file:line` để kiểm lại, hỏi tôi, commit; không tự code | K0, K6, K7, các gate | session của anh (phiên phase `/ship-auto` cũng vậy) |
| product | đáng làm không, bản v1, cắt gì, mockup; research có nguồn; chạy mù với bản BA tới P3; chỉ đề xuất | P | **Opus** (đã cân nhắc Fable, không dùng) |
| scout | đọc code / setting / log; mặc định 1 con | K1, 2a | **Opus** |
| implementer | viết code, phải ghi pattern đã bê từ `file:line` nào | K3 | **Sonnet** (bị bác 2 lần → implementer mới chạy Opus) |
| verifier | ảnh, test fail → pass, gỡ bản sửa | K2, K4 | **Sonnet** |
| reviewer | `/review` + chuẩn riêng | K5 | **Opus** |

Giao việc lúc nào cũng phải ghi `model`. Để trống thì sub agent chạy theo model của session (Opus). Bảng này nằm ở `ship-core.md`; project khác muốn đổi thì ghi đè ở profile §7.

- Standards chung nằm trong `roles/*.md`. Standards riêng của Joy nằm ở profile §11. Giao việc thì dán cả hai.
- **Bộ tiêu chuẩn tự lớn lên:** tôi sửa lưng → parent soạn 1 dòng và hỏi (thường ngay lúc xin commit) → tôi gật thì ghi, kèm ngày + câu gốc → vi phạm lần 2 thì chuyển xuống hook hoặc test.
- **Tôi bác cùng một bản sửa 2 lần** → parent dừng, ghi lại những gì đã thử, giao cho implementer mới.
- **Luật hỏi (grill me):** chỉ hỏi khi có trade-off thật / khẩu vị / đã thử query mà vẫn không tự trả lời được. Format: bối cảnh 1 dòng → lựa chọn → đề xuất + vì sao. BE kèm luồng `1→2→3` + `file:line`; FE kèm ảnh.

---

## 5. Hàng rào tự động (hook)

| Hook | Chặn / làm gì |
|---|---|
| `branch-guard` | `git stash -u`, `git add -A`, commit/push lệch branch |
| `ship-scope-guard` | commit có file **không có tên trong `progress.md`** (chống sửa lan) |
| `ship-auto-guard` | khi `auto: on`: sửa/xoá test, fixture, assert có sẵn trên master; làm mất ô trong checklist |
| `ship-mode-card` | mỗi tin tôi gửi: chèn luật của mode đang chạy + dòng NOW (chat thêm vẫn đi đúng luồng) |
| `ship-auto-continue` | auto kiểu `session`: đẩy chạy tiếp; kẹt 2 lần hoặc quá giờ thì cho dừng |
| `ship-state-sync` / `ship-context-restore` | lưu / nạp lại tiến độ khi compact, resume |
| `block-translation-append` | thêm key dịch vào cuối file |
| `memory-consent` | AI tự ghi memory (phải hỏi tôi) |
| `require-worktree-deps` | chạy dev trong worktree còn `node_modules` symlink |
| `auto-lint` (bản của tôi) | eslint chỉ dòng đã đổi |
| `joy-worktree-harness` (global) | tự cài harness cho worktree trần |
| *team:* `require-translate`, `block-tunnel-url`, `block-dangerous-bash`, `require-docs`, `recursion-guard` | — |
| *đã tắt:* `readonly-intent-guard`, `commit-consent` | — |

---

## 6. Dev local và test

### Dev local: chỉ `/dev-start`
AI đọc diff của task để chọn scope rồi nói cho tôi:

| Task đụng vào | Tham số |
|---|---|
| chỉ `packages/assets`, `packages/functions` | (không cần) → stack nhẹ mặc định |
| `packages/scripttag`, `packages/web-components` | `--scripttag` |
| `extensions/<x>` | `light <nhóm>` |
| widget storefront gọi data (app proxy) | tunnel: `light theme --scripttag` |

- Trong worktree phải chạy `bootstrap-worktree.sh <wt> --dev` trước (cài `node_modules` thật, khoảng 3,6 GB). Không thì sẽ **chạy nhầm code của main**.
- Worktree khác đang giữ cổng → AI hỏi *chờ / giành (`JOY_DEV_TAKEOVER=1`) / huỷ*, không tự kill.
- Bẫy hay gặp: `CLAUDE.local.md` §4 (widget trắng, `[app_proxy]` với localhost, locale quá 250 key, app embedded "treo", đĩa đầy).

### Test: chỉ 5 store
Claude in Chrome (đăng nhập `hoangtm@avadagroup.com`):

| Store | App Joy |
|---|---|
| `ag-mh-shop2` (local) | `ag-hoangtm-local` |
| `ag-maint7-joy-staging7` | `avada-joy-staging-7` |
| `mh2-shop-staging22` | `avada-joy-staging-22` |
| `ag-mh-shop-staging25` | `avada-joy-staging-25` |
| `my-store-hai` (**store test trên app PROD**) | `loyaltify-loyalty-program` |

- **Luật chọn** (AI phải nói "test ở store X vì Y"): chưa deploy → local · đã deploy → staging đang chạy branch · bug tester → store trong báo cáo (loyalty page V2 = staging 25) · bug merchant → đọc qua MCP, tái hiện trên `my-store-hai` hoặc local · sau release → `my-store-hai`.
- Đổi setting để test **chỉ qua giao diện admin**, ghi giá trị cũ rồi trả lại. Không tự gọi API, không tự ghi Firestore (chỉ được đọc để kiểm tra).
- Đọc setting khi không có key SA: MCP Joy → Chrome admin → Chrome storefront (`window.AVADA_JOY`; program chưa launch thì không có metafield).
- Override storefront (v0): ghi đè `fetch` / `window.AVADA_JOY` / CSS **chỉ trên trình duyệt**. Công thức nằm ở profile §4.
- Mật khẩu storefront dev/staging: `1`. Playwright chỉ dùng khi Chrome mất kết nối.

---

## 7. Xử lý sự cố

| Triệu chứng | Làm |
|---|---|
| Session không biết luật mới / không thấy skill `ship-*` | `/sync-harness` → `/exit` → `claude -c --dangerously-skip-permissions` |
| Gõ `/joy-ship` không chạy | đã đổi thành `/ship` (29/09) |
| Commit bị chặn "file NGOÀI PLAN" | cần thật thì ghi 1 dòng lý do vào mục "Việc phát sinh ngoài plan" của `progress.md`; không cần thì `git restore --staged` |
| Auto chạy nhưng không tiến | xem dòng NOW trong `progress.md` + log `tmp/logs/auto-run-*.jsonl`; dừng bằng `pkill -f ship-auto-run` |
| AI không đọc được `~/Documents` (Obsidian) | `tccutil reset SystemPolicyDocumentsFolder com.stablyai.orca` → thoát hẳn Orca → mở lại |
| AI bị chặn ghi memory | câu mới nhất phải có chữ *"memory"* / *"lưu lại"* / *"ghi nhớ"* |
| Trang Joy local "Not Found", Vite 403 | worktree chưa `--dev` → chạy `bootstrap-worktree.sh <wt> --dev` rồi `/dev-start` lại |
| Đầy đĩa | `/joy-disk-cleanup` |
| `block-dangerous-bash` chặn `rm -rf` | đúng luật team; xoá từng file |
| Claude in Chrome mất kết nối | `/chrome` để nối lại; tạm thời AI chụp bằng Chrome headless |

---

## 8. Worktree và bảo trì harness

| Việc | Cách |
|---|---|
| Worktree mới / còn trần | tự động: hook global `~/.claude/hooks/joy-worktree-harness.sh` chạy bootstrap |
| Harness ở main mới hơn | hook nhắc → `/sync-harness` |
| Chạy tay | `bash ~/WebstormProjects/joy/.claude/scripts/bootstrap-worktree.sh <worktree> [--dev] [--quiet]` |
| CLAUDE.md của worktree cũ hơn master | bootstrap cảnh báo → merge master vào branch |

- Bootstrap **copy** harness sang worktree (kể cả `ship-profile.md`). Chạy lại = đồng bộ, và tự gỡ những gì đã xoá ở main. Chỉ `.claude/ship` (trạng thái task, dùng chung) và `node_modules` (tới khi `--dev`) là symlink.
- **Dọn đĩa:** `/joy-disk-cleanup` (quét → hỏi → dọn vào Thùng rác). Không đụng worktree còn thay đổi chưa commit.
- **Backup trước khi sửa lớn:** `~/.claude/harness-backups/` (có `pre-ship-rename-*`, `pre-research-improve-*`…).

---

## 9. Bản đồ file

```
~/WebstormProjects/joy/
├── CLAUDE.md                          team
├── CLAUDE.local.md                    ghi đè của tôi
├── .claude/
│   ├── ship-profile.md                mọi thứ riêng của Joy cho bộ ship-* (§1–§12)
│   ├── settings.local.json            wiring hook của tôi
│   ├── skills/ship*/                  8 skill ship (+ templates/ trong skills/ship)
│   ├── skills/bug-check, analyze-task, branch-focus, merge-branch, test-environments,
│   │         deploy-extensions, joy-task-catchup, sync-harness, joy-disk-cleanup
│   ├── workflow/ship-core.md          luật chung của bộ ship
│   ├── workflow/blocks/K0…K7.md       8 khối
│   ├── workflow/auto-decide.md        bộ chuẩn tự quyết (auto)
│   ├── workflow/grill-me.md           luật hỏi
│   ├── workflow/mode-cards/*.md       thẻ chế độ (ship, continue, stabilize, lite, auto)
│   ├── roles/*.md                     5 role + tiêu chuẩn chung (lessons/ = bài học chi tiết)
│   ├── hooks/ship-*.sh, branch-guard, memory-consent, block-translation-append, require-worktree-deps, auto-lint
│   ├── scripts/                       bootstrap-worktree.sh · ship-auto-run.sh · ship-board.sh · joy-disk-cleanup.sh
│   └── ship/<task>/                   trạng thái từng task (dùng chung mọi worktree)
└── .git/info/exclude                  ẩn harness khỏi git
~/.claude/
├── settings.json                      hook global
├── hooks/joy-worktree-harness.sh
├── harness-backups/
└── projects/…/memory/                 memory (chỉ ghi khi tôi bảo)
```

**17 skill của tôi:** `ship` · `ship-new` · `ship-auto` · `ship-bugs` · `ship-fix` · `ship-verify` · `ship-review` · `ship-board` · `bug-check` · `analyze-task` · `branch-focus` · `merge-branch` · `test-environments` · `deploy-extensions` · `joy-task-catchup` · `sync-harness` · `joy-disk-cleanup`
