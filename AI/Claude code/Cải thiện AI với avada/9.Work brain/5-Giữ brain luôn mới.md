---
tags: [work-brain]
status: đề xuất
---

# Giữ brain luôn mới

Quay về [[0-Tổng quan]]

Ví von: brain như **tủ lạnh**. Ai cũng được bỏ đồ vào khay trên cùng (`inbox/`). Chỉ chủ nhà xếp vào ngăn và vứt đồ hỏng.

## Khi nào agent ghi
| Chuyện xảy ra | Agent ghi gì | Ghi vào |
|---|---|---|
| Anh sửa cách agent làm ("đừng làm X", "làm thế này") | Luật + Why + ví dụ thật | `inbox/` |
| Phát hiện bẫy riêng Joy tốn > 1 lần thử mới ra | Triệu chứng → gốc → cách sửa | `inbox/` |
| Bắt đầu / xong / đổi task | Task, branch, worktree, đang chờ ai | `work/now.md` (ghi thẳng) |
| Task xong có root cause đáng nhớ | Tóm tắt 10 dòng | `work/archive/` (ghi thẳng) |

`work/` được ghi thẳng vì nó thay đổi hằng ngày và không phải luật. `me/` + `knowledge/` chỉ đổi qua `inbox/`.

## Mẫu 1 file inbox
```markdown
---
date: 2026-10-01
from: <repo/worktree nơi phát hiện>
target: me/how-i-work.md | knowledge/joy/pitfalls.md | …
---
Rule: …
Why: <chuyện thật đã xảy ra>
```

## Ai dọn, khi nào
1. **Anh** duyệt `inbox/` — tần suất anh chọn (đề xuất: mỗi thứ 6, vì inbox tích theo tuần).
2. Agent hỗ trợ: một lệnh kiểu `/brain-review` đọc inbox → đề xuất gộp vào file nào, chỗ nào trùng → anh OK → agent ghép + `git commit`.
3. Mỗi lần dọn = 1 commit → xem lại được brain thay đổi gì, quay lui được.

## Chống phình
- File `me/` vượt độ dài anh chấp nhận → gộp/cắt luật cũ. (Ngưỡng cụ thể: đo sau khi viết xong bản đầu, không đặt trước.)
- Luật nào agent đã có hook/skill ép → xoá khỏi brain, chỉ để 1 dòng trỏ tới hook.
- Mỗi file `knowledge/` có dòng `verified: <ngày>` → lúc dọn thấy ngày cũ thì kiểm lại với code.

## Bài học worktree quay về đâu
Hiện 18 worktree Orca không có memory. Với brain: agent trong worktree ghi vào `~/work-brain/inbox/` (đường dẫn tuyệt đối) → mọi worktree đổ về một chỗ. Hook `joy-worktree-harness.sh` không cần sửa (**chưa verify** — kiểm lúc xây).
