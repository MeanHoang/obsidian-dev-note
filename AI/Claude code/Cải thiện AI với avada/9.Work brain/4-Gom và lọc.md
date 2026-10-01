---
tags: [work-brain]
status: đề xuất — phân loại theo tên + mô tả trong index, chưa đọc kỹ từng file
---

# Gom và lọc

Quay về [[0-Tổng quan]]

Nguyên tắc:
1. **Chép**, không di chuyển. File gốc giữ nguyên tới khi anh duyệt.
2. Nhiều file nhỏ cùng chủ đề → **gộp** thành 1 file, giữ phần "Why" (vì chuyện gì mà có luật này).
3. Trùng output style → bỏ, sau khi kiểm không có ý riêng.
4. Phân loại dưới đây dựa trên tên + mô tả trong `MEMORY.md`. **Chưa đọc kỹ từng file** — lúc gom sẽ đọc và sửa bảng nếu sai.

## Nguồn: `joy/memory` (55 file)

### Bỏ — `plain-vietnamese.md` đã lo
- `feedback_response_style`, `feedback_plain_explanations`, `feedback_narrate_progress`
- `feedback_eslint_changed_lines_only` — hook `auto-lint.sh` đã lo

### → `me/profile.md`
- `user_profile` (+ gộp `Obsidian-Vault/joy-shopify-app.md`, trùng ý)

### → `me/how-i-work.md` (đúng ở mọi dự án)
- `feedback_work_approach`, `feedback_question_vs_action`, `feedback_data_driven_decisions_monitor`, `feedback_no_invented_thresholds`
- `feedback_debug_approach`, `feedback_real_fix_not_avoidance`, `feedback_absence_is_a_signal`, `feedback_no_redundant_defensive_code`
- `feedback_notion_ai_gen_verify` (+ gộp `joy-handle/joy-verify-over-notion`, trùng ý)
- `feedback_review_scope`, `feedback_one_session_one_task` (+ `joy-2/feedback-fix-all-surfaces` — ghép cẩn thận: "không sửa lỗi có sẵn ngoài task" khác "lỗi của task chạm nhiều surface thì sửa hết")
- `feedback_git_workflow` (phần chung), `feedback_docs_out_of_commits`, `feedback_view_images_via_browser`
- `joy-handle/joy-use-repo-skills` ("dùng skill của repo trước khi tự làm tay")

### → `me/code-style.md`
- `feedback_no_return_undefined`, `feedback_reuse_before_create`, `feedback_avoid_forced_dry`, `feedback_logic_in_helper_not_callsite`
- `feedback_command_script_style`, `feedback_verify_callback_signature`
- `WebstormProjects/feedback_naming`

### → `knowledge/joy/` (chỉ đúng trong Joy)
| File đích | Nguồn |
|---|---|
| `architecture.md` | `project_firebase_function_discovery`, `feedback_declare_new_fields_in_dts`, `project_shop_fields_pickfields_whitelist`, `project_detectlocale_storefront_source`, `feedback_firestore_indexes_source` |
| `pitfalls.md` | `feedback_field_trigger_loops`, `feedback_audit_shared_key_flows`, `project_backwards_compat_existing_shops`, `feedback_verify_surface_and_data_source`, `feedback_consult_joy_surfaces_first` |
| `ui-i18n.md` | `feedback_ui_display_conventions`, `feedback_admin_badge_toggle_convention`, `feedback_new_field_needs_preset_default`, `feedback_translation_workflow`, `feedback_translation_key_placement`, `feedback_verify_css_with_render` |
| `dev-local.md` | `feedback_local_dev_files_untouchable`, `project_local_widget_blank_causes`, `project_standalone_local_fixes`, `project_embedded_401_clock_skew`, `project_browser_test_env_corrections`, `project_translate_in_worktree`, `project_locale_merge_conflicts`, `project_staging_storage_rules`, `project_local_only_harness_hooks` |
| `workflow.md` | `feedback_feature_workflow_order` |

### → `refs/`
- `reference_dev_environment` → `environments.md`
- `reference_external_systems` → `systems.md`
- `reference_service_accounts` → `secrets-where.md` (bỏ mọi giá trị nhạy cảm nếu có)

## Nguồn khác

| Nguồn | Đi đâu |
|---|---|
| `Obsidian-Vault-dev-note/memory` (16 file) | **Ở lại** — quy tắc viết note học, không phải việc |
| `joy-handle` + `joy-pm` `joy-handle-project.md` (2 bản trùng) | 1 dòng trong `work/now.md` hoặc `refs/` — tuỳ câu trả lời [[6-Câu hỏi chốt]] |
| `WebstormProjects/podevache-guest-root-cause.md` | `work/archive/` |
| `-Users-avada/project_work_brain.md` | Xoá sau khi brain chạy (chỉ là ghi chú "đang xây") |
| `joy/CLAUDE.local.md` | **Ở lại repo** — luật riêng Joy. Chỉ chép mục "Chat Vietnamese / em-anh" lên brain nếu output style chưa có |
| `joy/CLAUDE.md` 427 dòng, agents/roles/commands trùng | **Ngoài phạm vi brain** — dọn riêng một đợt khác, vì là file team |

## Số lượng dự kiến
- Trước: ~80 file memory ở 8 chỗ (không tính 16 file dev-note ở lại).
- Sau: khoảng 13 file trong brain (3 `me/` + 1 `now` + 5 `joy/` + vài `general/` + 3 `refs/`). Con số chính xác chốt lúc gom.
