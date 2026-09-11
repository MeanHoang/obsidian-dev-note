# 00 — Tổng hợp: Version Control Systems

> Phần 3 series [Road to Backend Developer](https://roadmap.sh/backend) — node **Version Control Systems → Git**.
>
> **Tài liệu chính thống chọn để follow:** **Pro Git, 2nd Edition** (Scott Chacon & Ben Straub) — sách chính thức của dự án Git, đọc miễn phí tại <https://git-scm.com/book/en/v2>.
>
> Lý do chọn: đây là tài liệu được chính `git-scm.com` (trang chủ Git) xuất bản, không phải blog bên thứ ba.

---

## Mục lục

| # | Bài | Bám theo |
|---|---|---|
| 01 | [[01 - About Version Control]] | Pro Git §1.1 |
| 02 | [[02 - What is Git]] | Pro Git §1.3 |

---

## Tóm tắt một câu

- **Version control** = hệ thống ghi lại thay đổi của file theo thời gian để gọi lại đúng phiên bản cần.
- Ba thế hệ: **Local** (RCS) → **Centralized** (SVN, Perforce) → **Distributed** (Git).
- Git khác biệt ở 5 điểm: lưu **snapshot** chứ không phải **delta**, gần như mọi thao tác đều **local**, mọi thứ được **checksum bằng SHA-1**, gần như chỉ **thêm** dữ liệu, và có **ba trạng thái** modified / staged / committed.

---

## Còn lại trong roadmap (chưa note)
Pro Git còn các chương sau, để dành khi cần đào sâu:
- §1.2 A Short History of Git
- §1.5–1.6 Installing Git / First-Time Git Setup
- §2 Git Basics
- §3 Git Branching ⭐
- §5 Distributed Git

## Nguồn tham khảo
- Pro Git, 2nd Edition: <https://git-scm.com/book/en/v2>
- roadmap.sh — Backend: <https://roadmap.sh/backend>
- roadmap.sh — Git & GitHub (roadmap riêng): <https://roadmap.sh/git-github>
