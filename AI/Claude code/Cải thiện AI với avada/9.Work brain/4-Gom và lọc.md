---
tags: [work-brain]
status: đã đọc toàn bộ 55 file memory của joy (2026-10-01)
---

# Gom và lọc

Quay về [[0-Tổng quan]]

Bản đầu xếp loại theo tên file. Bản này viết lại sau khi **đọc hết nội dung 55 file** trong `joy/memory` và kiểm các file/skill/hook chúng nhắc tới.

## Phát hiện làm đổi kế hoạch
1. **23 file `feedback_*` đã có chủ.** `.claude/roles/lessons/*.md` là 23 symlink trỏ thẳng vào các file đó. `.claude/roles/README.md` ghi: "Coding/review/naming lessons live here, not in memory. Memory keeps only facts about the owner". Vậy anh đã chốt từ trước: bài học code thuộc harness Joy. **Không được gộp, đổi tên hay di chuyển** các file này, vì symlink sẽ gãy.
2. **Nhiều luật đã có hook hoặc file repo lo.** Chép thêm vào brain là thành 2 bản, dễ lệch nhau.
3. **Có nội dung đã cũ** (danh sách ở cuối note). Lúc chuyển sang brain phải sửa, không chép nguyên.
4. **Luật "chung" lẫn chi tiết riêng Joy.** Ví dụ `feedback_git_workflow` vừa có nguyên tắc chung "không tự commit", vừa có cách tạo MR trên GitLab. Khi chuyển phải tách đôi: nguyên tắc vào `rules/`, chi tiết Joy vào wiki.

## Bảng phân loại — `joy/memory` (55 file)

| Nhóm | Số file | Đi đâu |
|---|---:|---|
| A. Trùng output style | 3 | Bỏ |
| B. Hồ sơ anh | 1 | `rules/me.md` |
| C. Bài học code có symlink | 23 | **Giữ nguyên chỗ**. Brain chỉ chép 1 dòng nguyên tắc cho những bài dùng được ngoài Joy |
| D. Feedback chưa có chủ | 13 | Tách: nguyên tắc → `rules/how-i-work.md`, chi tiết Joy → wiki |
| E. `project_*` + `reference_*` | 15 | Wiki Joy, qua `wiki-ingest` |

### A. Bỏ — `plain-vietnamese` đã lo, và bản cũ còn **mâu thuẫn** với nó
- `feedback_response_style`, `feedback_plain_explanations`, `feedback_narrate_progress`
- Mâu thuẫn cụ thể: bản cũ bảo "giữ thuật ngữ tiếng Anh", "dùng heading/bảng". Output style bảo "nói tiếng Việt trước, thuật ngữ trong ngoặc", "bảng chỉ khi từ khoảng 4 dòng trở lên". Output style mới hơn → bỏ bản cũ.

### B. → `rules/me.md`
- `user_profile`: chỉ lấy phần "anh là ai, stack". Bỏ phần cách trả lời (trùng nhóm A).
- Gộp `Obsidian-Vault/joy-shopify-app.md`: thêm đối thủ (Smile.io, Yotpo, Rivo, BON).

### C. 23 bài học code — giữ nguyên, có symlink từ `roles/lessons/`
`absence_is_a_signal`, `admin_badge_toggle_convention`, `audit_shared_key_flows`, `avoid_forced_dry`, `command_script_style`, `consult_joy_surfaces_first`, `declare_new_fields_in_dts`, `eslint_changed_lines_only`, `field_trigger_loops`, `file_placement`, `firestore_indexes_source`, `logic_in_helper_not_callsite`, `new_field_needs_preset_default`, `no_redundant_defensive_code`, `no_return_undefined`, `real_fix_not_avoidance`, `reuse_before_create`, `translation_key_placement`, `translation_workflow`, `ui_display_conventions`, `verify_callback_signature`, `verify_css_with_render`, `verify_surface_and_data_source` (đều có tiền tố `feedback_`).

Dùng được ngoài Joy → brain chép **1 dòng nguyên tắc** vào `rules/code-style.md`:
- Không `return undefined`, dùng `null`.
- Tìm cái có sẵn trước khi tạo biến/field/helper mới.
- Không ép DRY: hàm đang chạy tốt thì không biến thành wrapper.
- Data mới cho helper → thêm param tuỳ chọn, không ghi đè ở chỗ gọi.
- Sửa gốc là đủ, không thêm guard cho nhánh đã không thể chạy tới.
- Code "thiếu" so với chỗ khác → điều tra vì sao thiếu trước khi thêm.
- Sửa gốc, không né bằng cách giấu triệu chứng hay đổi dữ liệu demo.
- Tên hàm/biến tự giải thích (từ `WebstormProjects/feedback_naming`).

Phần còn lại chỉ đúng trong Joy → để nguyên ở harness.

### D. 13 feedback chưa có chủ → tách đôi
| File | Nguyên tắc → `rules/how-i-work.md` | Chi tiết Joy → wiki |
|---|---|---|
| `work_approach` | Hỏi khi chưa rõ, không bịa, dùng skill có sẵn, không tự tạo doc | "Dùng `/plan` hoặc agent `planner`" — **đã cũ**, `CLAUDE.local.md` nay dùng `/ship` |
| `question_vs_action` | Câu hỏi thì chỉ trả lời, không tự chạy gì | — |
| `data_driven_decisions_monitor` | Anh quyết; em lấy số thật để anh quyết | Skill lấy số: `billing-monitor`, `prod-troubleshoot` |
| `no_invented_thresholds` | Không bịa hằng số/ngưỡng | Ví dụ variant limit |
| `debug_approach` | Đọc log trước, không đoán từ triệu chứng | Log ở đâu: `firebase-debug.log`, `prod-troubleshoot` |
| `notion_ai_gen_verify` (+ `joy-handle/joy-verify-over-notion`) | Spec do AI sinh: chỉ tin mục tiêu, kiểm mọi claim trong code | — |
| `review_scope` | Không sửa/flag lỗi có sẵn ngoài diff; truy commit gây lỗi trước khi sửa | — |
| `one_session_one_task` | 1 phiên 1 việc | `.claude/ship/<slug>/progress.md` |
| `docs_out_of_commits` | Doc theo dõi không vào commit | — |
| `view_images_via_browser` | Link ảnh thì tự mở Chrome xem | `capture.avada.io` |
| `git_workflow` | Chỉ commit khi có chữ "commit" trong tin mới nhất. Message tiếng Anh | Lệnh tạo MR GitLab bằng push option. **Đã có ở `CLAUDE.local.md` §3**, chỉ giữ phần chưa có |
| `local_dev_files_untouchable` | — | Toàn bộ là chuyện Joy |
| `feature_workflow_order` | — | B1 admin → B2 backend → B3 storefront. Bước "(b) dùng `/plan`" **đã cũ** |

Ghép `joy-2/feedback-fix-all-surfaces` vào `review_scope` cẩn thận. Hai ý không mâu thuẫn: lỗi **của task** chạm nhiều surface thì sửa hết; lỗi **có sẵn ngoài task** thì không sửa.

### E. 15 file kiến thức → wiki Joy (`wiki-ingest`)
`project_backwards_compat_existing_shops`, `project_browser_test_env_corrections`, `project_detectlocale_storefront_source`, `project_embedded_401_clock_skew`, `project_firebase_function_discovery`, `project_local_only_harness_hooks`, `project_local_widget_blank_causes`, `project_locale_merge_conflicts`, `project_shop_fields_pickfields_whitelist`, `project_staging_storage_rules`, `project_standalone_local_fixes`, `project_translate_in_worktree`, `reference_dev_environment`, `reference_external_systems`, `reference_service_accounts`.

`reference_service_accounts` chỉ chứa **đường dẫn** file SA và email, không chứa key → chép được.

## Nội dung đã cũ / sai — phải sửa lúc chuyển
| File | Chỗ sai | Sự thật hiện tại |
|---|---|---|
| `reference_dev_environment` | "`sudo yarn dev`" | `CLAUDE.md`: không bao giờ chạy dev bằng sudo; dùng `/dev-start` |
| `reference_dev_environment` | "Dev store URL đọc từ `shopify.app.toml`" | `project_browser_test_env_corrections`: nằm ở `.shopify/project.json` |
| `reference_external_systems` | Trỏ tới `project_lark_base_integration.md` | File không tồn tại |
| `project_local_only_harness_hooks` | "review = `/review` + tracer" | `CLAUDE.local.md` §2: đã bỏ tracer từ 2026-09-29 |
| `feedback_consult_joy_surfaces_first` (nhóm C) | "Đọc skill `joy-surfaces`" | Skill không còn. Nay là `.claude/surfaces/map.md` qua `/surfaces`. File này có symlink → sửa tại chỗ, nếu anh đồng ý |
| `feedback_work_approach`, `feedback_feature_workflow_order` | "dùng `/plan`" | `CLAUDE.local.md` §1: `/ship`, `/ship-fix`, `/bug-check` |

## Nguồn khác
| Nguồn | Đi đâu |
|---|---|
| `Obsidian-Vault-dev-note/memory` (16 file) | **Ở lại**. Đây là quy tắc viết note học |
| `joy-handle` + `joy-pm` `joy-handle-project.md` (2 bản giống nhau) | 1 trang wiki "các repo của anh" |
| `joy-handle/joy-use-repo-skills` | `rules/how-i-work.md`: "vào repo nào thì đọc `CLAUDE.md` + skill của repo đó trước" |
| `WebstormProjects/podevache-guest-root-cause.md` | Wiki, mục việc đã xong |
| `WebstormProjects/feedback_naming.md` | `rules/code-style.md` (đã ghi ở nhóm C) |
| `-Users-avada/project_work_brain.md` | Xoá sau khi brain chạy |
| `joy/CLAUDE.local.md`, `joy/CLAUDE.md`, agents/roles/commands | **Ngoài phạm vi brain**. Là harness Joy, dọn riêng một đợt khác |

## Kết quả dự kiến
- `rules/`: 3 file (`me`, `how-i-work`, `code-style`). Đo số dòng sau khi viết, mục tiêu tổng dưới 200 dòng (theo tài liệu Claude Code).
- Wiki: khoảng 15 trang từ nhóm E. `wiki-ingest` có thể gộp bớt.
- `joy/memory`: còn 23 bài học (nhóm C) + `MEMORY.md`. Nhóm A, B, D, E rút khỏi index **sau khi anh duyệt**.
