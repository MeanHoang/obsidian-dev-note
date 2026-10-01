---
tags: [work-brain]
status: chờ anh trả lời
---

# Câu hỏi chốt

Quay về [[0-Tổng quan]]

## 1. Đặt brain ở đâu?
A) `~/work-brain`, git riêng. Mở được bằng Obsidian như một vault thứ hai nếu anh muốn đọc đẹp.
B) Folder riêng trong vault hiện tại (`~/Documents/Obsidian Vault/work-brain`, ngoài `dev-note`).
C) Gộp vào `~/WebstormProjects/joy-handle` (repo "bảng việc cá nhân" đã có).

**Em đề xuất A.**
1. Đường dẫn ngắn, cố định → `~/.claude/CLAUDE.md` trỏ về không bao giờ gãy.
2. Tách hẳn khỏi vault → agent không lỡ quét sang note học.
3. `joy-handle` là app Next.js có `node_modules` → agent đọc brain dễ lạc vào code app. Nếu sau này anh muốn kanban của joy-handle hiển thị `work/`, cho nó đọc `~/work-brain/work/` là được.

Trả lời: …

## 2. Kiến thức chỉ riêng Joy để đâu?
A) Chuyển vào brain `knowledge/joy/`. Memory của repo `joy` rút gọn còn 1 dòng trỏ về brain.
B) Để nguyên trong memory `joy`. Brain chỉ giữ phần chung (`me/`, `refs/`).

**Em đề xuất A.**
1. Hiện có 18 worktree Orca + `joy-2`, `joy-handle`, `joy-pm` — mỗi chỗ một thư mục memory. Để ở brain thì mọi bản sao Joy đọc chung một nguồn.
2. Một chỗ duy nhất để dọn.

Trả lời: …

## Ghi chú cho lúc xây (không cần trả lời ngay)
- Brain viết tiếng Anh hay Việt? (CLAUDE.local.md hiện quy định: thứ agent đọc → tiếng Anh.)
- Có commit `~/.claude/CLAUDE.md` vào brain không (symlink từ brain ra `~/.claude/`)?
