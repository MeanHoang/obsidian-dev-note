# 00 — Tổng hợp: Repo Hosting Services

> Phần 4 series [Road to Backend Developer](https://roadmap.sh/backend) — node **Repo Hosting Services → GitHub, GitLab**.
>
> **Tài liệu chính thống dùng để follow:**
> - **Pro Git, 2nd Edition** — chương 6 (GitHub): <https://git-scm.com/book/en/v2>
> - **GitHub Docs** — <https://docs.github.com>
> - **GitLab Docs** — markdown gốc từ repo `gitlab-org/gitlab` (vì `docs.gitlab.com` chặn Cloudflare)
>
> **Cách trình bày:** 📖 trích nguyên văn tiếng Anh → 🇻🇳 dịch → 💡 ví dụ đời sống. Thuật ngữ (repository, pull request, merge request, fork, upstream...) giữ nguyên tiếng Anh. Toàn bộ sơ đồ/ảnh là hình gốc của tài liệu, lưu trong `assets/`.

---

## Mục lục

| # | Bài | Nguồn | Dòng |
|---|---|---|---|
| 01 | [[01 - Repo Hosting Services là gì]] | roadmap.sh + GitHub Docs + GitLab Docs | 271 |
| 02 | [[02 - GitHub - Account Setup and Configuration]] | Pro Git §6.1 | 266 |
| 03 | [[03 - GitHub - Contributing to a Project]] ⭐⭐ | Pro Git §6.2 | 862 |
| 04 | [[04 - GitHub - Maintaining a Project]] ⭐ | Pro Git §6.3 | 656 |
| 05 | [[05 - GitHub Flow]] ⭐ | GitHub Docs | 311 |
| 06 | [[06 - GitLab - Merge Requests]] | GitLab Docs | 441 |
| 07 | [[07 - GitLab - Forks và cộng tác]] | GitLab Docs | 532 |

---

## Điều quan trọng nhất của cả phần

> [!important] Git ≠ GitHub
> **Git** là phần mềm quản lý phiên bản chạy trên máy bạn — miễn phí, mã nguồn mở, không cần Internet.
> **GitHub / GitLab / Bitbucket** là **dịch vụ host** một bản Git repository trên server, cộng thêm giao diện web, quyền truy cập, issue, pull request, CI/CD...
>
> Phần 03 dạy bạn Git. Phần 04 này dạy bạn cái *bọc quanh* Git.
> Toàn bộ những gì học ở [[08 - Working with Remotes]] và [[13 - Remote Branches]] vẫn đúng nguyên — GitHub chỉ là một `remote` cụ thể.

---

## Bản đồ khái niệm

```
Repository hosting service
 ├── GitHub ──┬── fork ──► bản copy repo dưới tài khoản bạn (trên server)
 │            ├── pull request (PR) ──► đề nghị merge branch này vào branch kia
 │            ├── issue, mention (@user), notification
 │            └── GitHub Flow: branch → commit → PR → review → merge → xoá branch
 │
 └── GitLab ──┬── fork ──► tương tự GitHub
              ├── merge request (MR) ──► CÙNG khái niệm với pull request, khác tên
              └── merge methods: merge commit / semi-linear / fast-forward

Hai mô hình cộng tác:
  1. Fork-based   — không có quyền ghi vào repo gốc (open source)
  2. Shared repo  — là collaborator, tạo branch ngay trong repo gốc (team nội bộ)
```

---

## 8 điều cần nhớ

1. **Git là công cụ, GitHub/GitLab là dịch vụ.** Xoá GitHub đi thì Git vẫn chạy. ([[01 - Repo Hosting Services là gì]])
2. **SSH key** là cách xác thực chuẩn khi push; email trong `user.email` quyết định commit được gán cho tài khoản nào. ([[02 - GitHub - Account Setup and Configuration]])
3. **Fork** = bản copy repository nằm trên server, dưới tài khoản của bạn — khác với `clone` (bản copy trên máy bạn). ([[03 - GitHub - Contributing to a Project]])
4. **Pull request (GitHub) và merge request (GitLab) là cùng một khái niệm**, chỉ khác tên. GitHub dùng `#123`, GitLab dùng `!123`. ([[06 - GitLab - Merge Requests]])
5. **GitHub Flow chỉ có 1 branch chính + topic branch** — đơn giản hơn mô hình long-running branch nhiều tầng ở [[12 - Branch Management và Branching Workflows]]. ([[05 - GitHub Flow]])
6. **Giữ fork đồng bộ với upstream**: thêm remote `upstream`, `fetch`, rồi merge/rebase. Không làm thì PR sẽ conflict. ([[03 - GitHub - Contributing to a Project]], [[07 - GitLab - Forks và cộng tác]])
7. **Pull Request Refs** (`refs/pull/<n>/head`) cho phép fetch và checkout PR của người khác về máy để test — ít người biết nhưng rất hữu ích. ([[04 - GitHub - Maintaining a Project]])
8. **README và CONTRIBUTING là file đặc biệt** — GitHub render tự động và dùng chúng để hướng dẫn người đóng góp. ([[04 - GitHub - Maintaining a Project]])

---

## Những chỗ nguồn chính thống KHÔNG nói rõ

Ghi lại để sau này không nhầm đây là kiến thức có trích dẫn:

- **"Merge request = pull request"**: GitLab docs không có câu định nghĩa trực tiếp nào như vậy. Kết luận này trong [[06 - GitLab - Merge Requests]] dựa trên bằng chứng gián tiếp có thật — bảng ánh xạ dữ liệu khi import project từ GitHub sang GitLab (pull requests → merge requests).
- **"Fork khác clone thế nào"**: GitLab docs không có đoạn so sánh trực tiếp; [[07 - GitLab - Forks và cộng tác]] ghép hai định nghĩa riêng biệt và đã ghi chú rõ trong bài.
- **Bảng so sánh GitHub/GitLab/Bitbucket** trong [[01 - Repo Hosting Services là gì]] có vài ô để trống — vì không kiểm chứng được từ tài liệu chính thống của chính họ. Để trống chứ không đoán.

---

## Chưa note (để dành)

- Pro Git §6.4 Managing an Organization, §6.5 Scripting GitHub (GitHub API, webhook)
- GitHub Actions / GitLab CI — thuộc node **CI/CD** ở `11 - Advanced Backend/01 - CI-CD`
- Protected branch, code owners, review rules — chạm sơ ở bài 05 và 07

## Nguồn tham khảo
- Pro Git, 2nd Edition — chương 6: <https://git-scm.com/book/en/v2/GitHub-Account-Setup-and-Configuration>
- GitHub Docs: <https://docs.github.com>
- GitLab docs (markdown gốc): <https://gitlab.com/gitlab-org/gitlab/-/tree/master/doc>
- roadmap.sh — Backend: <https://roadmap.sh/backend>
