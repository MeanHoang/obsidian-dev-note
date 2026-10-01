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
3. `joy-handle` là app Next.js có `node_modules` → agent đọc brain dễ lạc vào code app. Nếu sau này anh muốn kanban của joy-handle hiển thị "đang làm gì", cho nó đọc `~/work-brain/wiki/hot.md` là được.

Trả lời: …

## 2. Kiến thức chỉ riêng Joy để đâu?
Chỉ hỏi về **15 file kiến thức** (nhóm E ở [[4-Gom và lọc]]: môi trường, bẫy dev local, whitelist field…). 23 bài học code (nhóm C) đã có chủ là `roles/lessons/` → giữ nguyên, không hỏi.

A) Chuyển 15 file vào wiki của brain. `joy/memory` rút khỏi index sau khi anh duyệt.
B) Để nguyên trong `joy/memory`. Brain chỉ giữ `rules/` + trang wiki chung.

**Em đề xuất A.**
1. Mở Claude ở `joy-2`, `joy-handle` hay thư mục khác đều đọc được. Hiện `joy-2` có memory riêng nên không thấy 15 file này.
2. `wiki-lint` dọn được nội dung cũ. Note 4 đã tìm ra 6 chỗ cũ/sai mà không ai dọn.

~~Lý do cũ: "18 worktree Orca mỗi chỗ một thư mục memory"~~ — **sai**, worktree dùng chung memory với `joy`.

Trả lời: …

## Ghi chú cho lúc xây (không cần trả lời ngay)
- Brain viết tiếng Anh hay Việt? (CLAUDE.local.md hiện quy định: thứ agent đọc → tiếng Anh.)
- Có commit `~/.claude/CLAUDE.md` vào brain không (symlink từ brain ra `~/.claude/`)?
- Sửa 1 bài học đã cũ: `feedback_consult_joy_surfaces_first` vẫn bảo đọc skill `joy-surfaces` (đã không còn, nay là `.claude/surfaces/map.md`). File này nằm trong memory nên cần anh cho phép mới sửa được.
