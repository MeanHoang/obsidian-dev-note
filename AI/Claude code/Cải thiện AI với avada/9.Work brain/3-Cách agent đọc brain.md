---
tags: [work-brain]
status: bản cũ — đã bị note 7 thay
---

# Cách agent đọc brain

> [!warning] Bản cũ
> Bản cũ. Xem [[7-Research và thiết kế lại]]: luật đặt ở `~/.claude/rules/` thay vì `@import`. Hai câu sai trong note này đã được sửa bên dưới.

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

## Khi hai chỗ mâu thuẫn
~~Bản đầu ghi: `CLAUDE.local.md` thắng `CLAUDE.md`, `CLAUDE.md` thắng brain.~~ **Sai.** Tài liệu Claude Code nói các file được **nối vào nhau**, không file nào ghi đè file nào: "if two instructions contradict each other, Claude may pick one arbitrarily".

→ Không trông vào thứ tự. Phải **xoá mâu thuẫn**: chạy `/doctor prompt-audit` sau khi viết brain.

(`joy/CLAUDE.local.md` tự ghi "wins wherever the two disagree" là một lời dặn agent, không phải cơ chế của Claude Code.)

## Còn với auto-memory (`~/.claude/projects/*/memory`)?
Claude Code vẫn tự ghi vào đó. ~~Không tắt được.~~ **Sai:** đổi được chỗ ghi bằng `autoMemoryDirectory`, tắt được bằng `autoMemoryEnabled: false`. Note 7 giải thích vì sao chưa nên đổi. Đề xuất:
- Coi auto-memory là **nháp tạm** của từng project.
- Khi dọn ([[5-Giữ brain luôn mới]]), cái gì đáng giữ thì chép sang brain, rồi rút gọn file memory gốc.

## Cần thử trước khi chốt
1. Cú pháp `@~/...` có nạp được từ `~/.claude/CLAUDE.md` không → mở Claude ở `~/`, hỏi "anh là ai".
2. Mở trong worktree Orca → agent có thấy cả brain + `joy/CLAUDE.md` không.
3. Đếm số dòng nạp mặc định — **chưa đo**, đo sau khi viết xong `me/`.
