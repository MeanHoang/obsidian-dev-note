---
tags: [work-brain]
status: đề xuất — chờ anh chốt
---

# Cấu trúc đề xuất

Quay về [[0-Tổng quan]]

Ví von: brain = **cuốn sổ tay nhân viên mới**. Trang đầu là "anh là ai, làm việc kiểu gì" (đọc ngay ngày đầu). Phía sau là các chương tra cứu (chỉ mở khi cần).

## Cây thư mục — `~/work-brain` (có git)

```
work-brain/
├── CLAUDE.md              # cửa vào, ~30 dòng: đọc gì, theo thứ tự nào, ghi vào đâu
├── me/                    # LUÔN nạp — anh là ai
│   ├── profile.md         # vai trò, công ty, stack (JS thuần, Firebase, GCP, không TS)
│   ├── how-i-work.md      # hỏi khi chưa rõ, không tự commit, verify trước khi nói "fixed"…
│   └── code-style.md      # null không undefined, reuse trước khi tạo, không DRY ép…
├── work/                  # LUÔN nạp now.md — đang làm gì
│   ├── now.md             # 5–10 dòng: task đang chạy, branch, worktree, đang chờ ai
│   └── archive/           # task xong, root cause đáng nhớ (vd podevache)
├── knowledge/             # ĐỌC KHI CẦN — qua index
│   ├── index.md           # 1 dòng / file, để agent chọn đúng file
│   ├── general/           # đúng ở mọi dự án: git, debug, review, test
│   └── joy/               # chỉ đúng trong Joy
│       ├── architecture.md    # Firestore, function discovery, pickFields, d.ts…
│       ├── ui-i18n.md         # badge/toggle, dịch, key placement…
│       ├── dev-local.md       # widget trắng, standalone, 401 lệch giờ, worktree…
│       └── pitfalls.md        # field-trigger loop, shared-key, backwards compat…
├── refs/                  # ĐỌC KHI CẦN — tra cứu
│   ├── environments.md    # store, staging N, Firebase project
│   ├── systems.md         # Notion, Crisp, Slack, ticket, GCP logs → skill nào lo
│   └── secrets-where.md   # CHỈ đường dẫn tới file SA/token, không chứa giá trị
└── inbox/                 # agent ghi bài học mới vào đây, anh duyệt rồi mới chuyển
```

## Vì sao chia như vậy
1. **Nạp ít, tra nhiều.** `me/` + `work/now.md` nạp mọi lúc → phải ngắn (mục tiêu dưới 150 dòng tổng). `knowledge/` + `refs/` chỉ đọc khi task cần → không làm loãng context.
2. **Tách chung / riêng Joy.** Mai anh làm repo khác (joy-data-sync, mini-joy…) thì `general/` vẫn dùng, `joy/` không nạp nhầm.
3. **`inbox/` chặn rác.** Agent không sửa thẳng `me/`. Tránh lặp lại cảnh 56 file memory mọc dần không ai dọn.
4. **Gộp file nhỏ.** 39 file feedback hiện tại → khoảng 3 file theo chủ đề. File nhỏ quá thì agent phải mở 39 lần.

## Không đưa vào brain
- Cách trả lời (giọng, format) → đã ở `plain-vietnamese.md`.
- Quy tắc kỹ thuật của team Joy (layer, Firestore, webhook) → đã ở `joy/CLAUDE.md` + skills của repo.
- Note học (Java, TOEIC, HSK) → ở lại Obsidian.
- Tiến độ chi tiết từng task → ở lại `.claude/ship/<task>/progress.md` của worktree; `now.md` chỉ trỏ tới.
