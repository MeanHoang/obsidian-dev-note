# 00 — Tổng hợp: Version Control Systems

> Phần 3 series [Road to Backend Developer](https://roadmap.sh/backend) — node **Version Control Systems → Git**.
>
> **Tài liệu chính thống chọn để follow:** **Pro Git, 2nd Edition** (Scott Chacon & Ben Straub) — sách chính thức của dự án Git, đọc miễn phí tại <https://git-scm.com/book/en/v2>.
>
> Lý do chọn: đây là tài liệu được chính `git-scm.com` (trang chủ Git) xuất bản, không phải blog bên thứ ba.
>
> **Cách trình bày mỗi bài:** 📖 trích nguyên văn tiếng Anh → 🇻🇳 dịch → 💡 ví dụ đời sống. Thuật ngữ (commit, branch, staging area, working tree...) giữ nguyên tiếng Anh. Toàn bộ sơ đồ là hình gốc của sách, lưu trong `assets/`.

---

## Mục lục

### Chương 1 — Getting Started
| # | Bài | Bám theo |
|---|---|---|
| 01 | [[01 - About Version Control]] | §1.1 |
| 02 | [[02 - What is Git]] ⭐ | §1.3 |
| 03 | [[03 - Lịch sử, cài đặt và cấu hình Git]] | §1.2, §1.4–1.7 |

### Chương 2 — Git Basics
| # | Bài | Bám theo |
|---|---|---|
| 04 | [[04 - Getting a Git Repository]] | §2.1 |
| 05 | [[05 - Recording Changes to the Repository]] ⭐ | §2.2 |
| 06 | [[06 - Viewing the Commit History]] | §2.3 |
| 07 | [[07 - Undoing Things]] | §2.4 |
| 08 | [[08 - Working with Remotes]] | §2.5 |
| 09 | [[09 - Tagging và Git Aliases]] | §2.6–2.7 |

### Chương 3 — Git Branching
| # | Bài | Bám theo |
|---|---|---|
| 10 | [[10 - Branches in a Nutshell]] ⭐ | §3.1 |
| 11 | [[11 - Basic Branching and Merging]] ⭐ | §3.2 |
| 12 | [[12 - Branch Management và Branching Workflows]] | §3.3–3.4 |
| 13 | [[13 - Remote Branches]] | §3.5 |
| 14 | [[14 - Rebasing]] ⭐⭐ | §3.6 |

---

## Bản đồ khái niệm

```
Version control ─┬─ Local VCS (RCS)
                 ├─ Centralized VCS (SVN, Perforce)
                 └─ Distributed VCS (Git) ──► mỗi clone là 1 bản backup đầy đủ

Git lưu dữ liệu = SNAPSHOT (không phải delta)
  └─ commit ──► tree ──► blob      (đều định danh bằng SHA-1)
     └─ mỗi commit trỏ về parent của nó

3 khu vực          3 trạng thái file
  working tree  ←→  modified
  staging area  ←→  staged
  Git directory ←→  committed

branch = con trỏ 41 byte tới 1 commit
HEAD   = con trỏ tới branch đang đứng

Tích hợp branch ─┬─ merge  ─┬─ fast-forward (không tạo commit mới)
                 │          └─ three-way merge (tạo merge commit ≥2 parent)
                 └─ rebase  ─── phát lại patch, lịch sử tuyến tính
                                🔴 KHÔNG rebase thứ đã push
```

---

## 10 điều cần nhớ

1. **Git lưu snapshot, không lưu delta** — đây là gốc rễ mọi khác biệt của Git. ([[02 - What is Git]])
2. **Gần như mọi thao tác đều local** — nên nhanh, và làm việc offline được.
3. **Ba trạng thái: modified → staged → committed.** ([[05 - Recording Changes to the Repository]])
4. `git add` nghĩa là *"thêm chính xác nội dung này vào commit kế tiếp"* — stage rồi sửa tiếp thì phải `add` lại.
5. **Đã commit thì gần như luôn khôi phục được; chưa commit mà mất là mất thật.** ([[07 - Undoing Things]])
6. `git pull` = `git fetch` + `git merge`. Muốn an toàn thì fetch rồi xem trước. ([[08 - Working with Remotes]])
7. **Branch chỉ là một file 41 byte** — vì vậy tạo/xoá branch thoải mái. ([[10 - Branches in a Nutshell]])
8. **Chuyển branch làm thay đổi file trên đĩa.** Working tree bẩn thì Git chặn không cho chuyển.
9. Khi conflict: sửa file, **xoá hết marker `<<<<<<< ======= >>>>>>>`**, rồi `git add` = đánh dấu đã resolve. ([[11 - Basic Branching and Merging]])
10. **Đừng bao giờ rebase commit đã push công khai.** ([[14 - Rebasing]])

---

## Còn lại trong Pro Git (chưa note)
Để dành khi cần đào sâu:
- §5 Distributed Git — các workflow cộng tác (sẽ chạm tới ở phần `04 - Repo Hosting Services`)
- §6 GitHub
- §7 Git Tools — stashing, searching, rewriting history, reset demystified, submodules
- §10 Git Internals — plumbing commands, object model

## Nguồn tham khảo
- Pro Git, 2nd Edition: <https://git-scm.com/book/en/v2>
- roadmap.sh — Backend: <https://roadmap.sh/backend>
- roadmap.sh — Git & GitHub (roadmap riêng): <https://roadmap.sh/git-github>
