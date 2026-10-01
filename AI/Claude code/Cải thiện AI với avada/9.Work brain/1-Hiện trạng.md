---
tags: [work-brain]
checked: 2026-10-01
---

# Hiện trạng (đã kiểm trên máy 2026-10-01)

Quay về [[0-Tổng quan]]

## Bộ nhớ agent — `~/.claude/projects/*/memory`

| Thư mục (project) | Số file | Nội dung chính |
|---|---:|---|
| `-Users-avada-WebstormProjects-joy` | 56 | 39 feedback, 12 project, 3 reference, 1 user, 1 index |
| `-Users-avada-Documents-Obsidian-Vault-dev-note` | 16 | Quy tắc viết note học (Java, vault structure…) — không phải việc Joy |
| `-Users-avada-WebstormProjects-joy-handle` | 4 | joy-handle là gì, "dùng skill của repo trước", "tin code hơn Notion" |
| `-Users-avada-WebstormProjects` | 3 | Đặt tên hàm rõ nghĩa; root cause shop podevache |
| `-Users-avada` | 2 | Memory "đang xây work brain" |
| `-Users-avada-WebstormProjects-joy-pm` | 2 | Bản trùng `joy-handle-project.md` |
| `-Users-avada-WebstormProjects-joy-2` | 2 | "Bug nhiều surface → sửa hết" |
| `-Users-avada-Documents-Obsidian-Vault` | 2 | "Anh làm Joy ở Avada" (trùng user profile) |
| 18 thư mục `orca-workspaces` | **0** | Không có file memory nào |

Ghi chú (đã verify qua tài liệu chính thức, xem [[7-Research và thiết kế lại]]): auto-memory chia theo **git repo**, mọi worktree dùng chung. Vì vậy 18 thư mục Orca có 0 file là đúng: bài học trong worktree vẫn ghi vào memory của `joy`. Còn `joy-2` là bản clone riêng → có memory riêng, bị tách khỏi `joy`.

## `~/.claude` (cấp toàn máy)
- Không có `CLAUDE.md` → agent mở ngoài `joy` không biết gì về anh.
- `output-styles/plain-vietnamese.md` — đã lo phần "cách trả lời".
- `hooks/`: `joy-worktree-harness.sh`, `chrome-activate-tab.sh`.
- `skills/`: `bigquery-basics`, `firebase-basics`, `gcloud`, `google-cloud-waf-cost-optimization`, `synced`.

## Repo `joy`
- `CLAUDE.md` 427 dòng (team, có commit) + `CLAUDE.local.md` 95 dòng (cá nhân, ghi đè team).
- `.claude/`: agents, roles (trùng vai agents), commands (có cặp trùng `plan`/`plan-v2`, `review`/`review-v2`), skills, workflow blocks, ship-profile.

## Thứ liên quan đã có sẵn
- `~/WebstormProjects/joy-handle` — "bảng việc cá nhân" (Next.js, kanban theo quy trình Joy). Ý tưởng trong `BRIEF.md` trùng một phần với phần `work/` của brain → xem [[6-Câu hỏi chốt]].
- `~/WebstormProjects/joy-pm-agent` — repo khác, chưa đọc.
- Vault: `dev-note/Avada/Joy/` (note Joy: CDN deploy, import format, run local light…) và chuỗi note này ([[4.Các bước cải thiện harness]]).
