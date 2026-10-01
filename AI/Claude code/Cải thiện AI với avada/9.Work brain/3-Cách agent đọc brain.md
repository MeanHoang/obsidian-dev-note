---
tags: [work-brain]
status: đề xuất
---

# Cách agent đọc brain

Quay về [[0-Tổng quan]]

## Cơ chế
Claude Code luôn tự đọc `~/.claude/CLAUDE.md` (cấp user) ở **mọi** thư mục, trước cả `CLAUDE.md` của project. File này hỗ trợ cú pháp `@đường/dẫn` để nạp nội dung file khác vào.

→ Ta dùng `~/.claude/CLAUDE.md` làm **biển chỉ đường** ngắn, trỏ về brain.

## Bản nháp `~/.claude/CLAUDE.md` (chưa tạo)

```markdown
# Work brain
Owner's work brain lives at ~/work-brain. Always loaded:

@~/work-brain/me/profile.md
@~/work-brain/me/how-i-work.md
@~/work-brain/me/code-style.md
@~/work-brain/work/now.md

On demand: read ~/work-brain/knowledge/index.md and open only the files the task needs.
Project-specific (Joy): ~/work-brain/knowledge/joy/ — read when working in a joy repo/worktree.
Writing new lessons: see ~/work-brain/CLAUDE.md § Writing. Never edit me/ directly.
```

## Thứ tự ưu tiên khi mâu thuẫn
1. `CLAUDE.local.md` của project (ghi đè cá nhân theo repo)
2. `CLAUDE.md` của project (luật team)
3. Brain (`~/.claude/CLAUDE.md` → `me/`)

Lý do: luật team của repo phải thắng thói quen chung. Brain chỉ lấp chỗ trống.

## Còn với auto-memory (`~/.claude/projects/*/memory`)?
Claude Code vẫn tự ghi vào đó, không tắt được bằng brain. Đề xuất:
- Coi auto-memory là **nháp tạm** của từng project.
- Khi dọn ([[5-Giữ brain luôn mới]]), cái gì đáng giữ thì chép sang brain, rồi rút gọn file memory gốc.

## Cần thử trước khi chốt
1. Cú pháp `@~/...` có nạp được từ `~/.claude/CLAUDE.md` không → mở Claude ở `~/`, hỏi "anh là ai".
2. Mở trong worktree Orca → agent có thấy cả brain + `joy/CLAUDE.md` không.
3. Đếm số dòng nạp mặc định — **chưa đo**, đo sau khi viết xong `me/`.
