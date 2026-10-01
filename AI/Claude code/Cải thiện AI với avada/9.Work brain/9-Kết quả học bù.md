---
tags: [work-brain, learning-loop, backfill]
created: 2026-10-01
status: kết quả — chờ anh duyệt từng mục
---

# Kết quả học bù từ phiên cũ

Quay về [[0-Tổng quan]] · Cách làm ở [[8-Học liên tục]]

**Kết luận:** 207 lần anh thật sự bực agent, gom được khoảng 20 nhóm lỗi. Phát hiện lớn nhất: **2 nhóm lỗi lặp nhiều nhất đã có luật từ tháng 3–4, nhưng luật nằm ở kho memory không bao giờ được nạp khi làm Joy.** Đây là bằng chứng thật cho việc cần brain dùng chung.

## Cách làm
1. `scan-ai-friction.py` lọc sơ → 1.003 câu có từ khoá.
2. Bỏ rác (prompt kickoff, tin giữa các agent, đoạn dán dài) → **860 trường hợp**. Gắn kèm đoạn agent nói/làm ngay trước, với 397 trường hợp có transcript.
3. 5 subagent đọc song song, đối chiếu với danh mục luật hiện có: 55 memory kèm ngày tạo, 18 hook, `CLAUDE.local.md`, output style.
4. Kết quả: **207 thật / 653 rác**. Số thật/rác là subagent tự đếm, có sai số.
5. Em kiểm tay bằng chứng của 5 nhóm quan trọng nhất (câu gốc của anh, ngày, project) → đúng là câu anh gõ.

Giới hạn: 463 trường hợp tháng 3–8 chỉ có câu anh gõ (`history.jsonl`), không có câu agent → phân loại các trường hợp này kém chắc hơn.

---

## Nhóm 1 — Có luật nhưng luật **nằm sai chỗ**, không được nạp
Sửa được bằng cách đưa luật vào `rules/` của brain (nạp ở mọi thư mục).

| Lỗi | Số lần | Luật có sẵn | Vì sao không tác dụng |
|---|---:|---|---|
| Đặt tên hàm/biến khó hiểu, sai nghĩa | 16 | `feedback_naming` (tạo 2026-03-18) | Nằm trong memory của `~/WebstormProjects`, không nạp khi mở ở `joy` |
| Bịa field, link, sự thật; khẳng định khi chưa kiểm | ~22 | `feedback_no_hallucination` (2026-04-21) | Nằm trong memory của vault Obsidian. Joy chỉ có 1 dòng chung chung trong `feedback_work_approach` |

Ví dụ thật:
- 2026-08-05: "orderSubTotalValid biến này… sao ko đặt tên đúng nghĩa hơn nhỉ là refund amount"
- 2026-08-20: "xin doc đi xem có đúng là có field này ko hay bn bịa ấy"

## Nhóm 2 — Luật được nạp nhưng **vẫn tái phạm** → cần lên bậc
| Lỗi | Số lần | Luật | Đề xuất |
|---|---:|---|---|
| Commit khi anh chưa đọc/duyệt | 6 | `feedback_git_workflow` (05/08) + hook `commit-consent` | Hook bị tắt (file `.disabled`, sửa lần cuối 06/08). Sau đó vẫn sai ngày 11/08 và 17/08 → **bật lại hook** hoặc viết hook mới gọn hơn |
| Hiểu sai yêu cầu, làm sai việc | ~20 | `feedback_work_approach` | Không chặn được bằng hook. Đề xuất: việc dài thì bắt buộc 1 câu "Em hiểu là… đúng không?" trước khi làm (output style đã có, nhưng nên đưa vào `rules/how-i-work`) |
| Làm quá phạm vi, phức tạp hoá | ~10 | `feedback_review_scope` | Rule rõ hơn: "anh nói sửa 1 chỗ → chỉ sửa 1 chỗ; muốn làm thêm thì hỏi" |
| Đụng/stash file không phải của mình | 6 | `feedback_local_dev_files_untouchable`, `feedback_git_workflow` | **Hook**: chặn `git stash`, `git checkout --`, `git restore` khi có file `M` không thuộc task |
| Sửa 1 surface khi lỗi/setting dùng chung; mockup không khớp UI thật | ~10 | `joy-2/feedback-fix-all-surfaces` | Cũng là luật nằm sai chỗ (memory `joy-2`) → đưa vào brain |
| Viết helper/endpoint mới khi đã có | 4 | `feedback_reuse_before_create` | Giữ rule, theo dõi thêm |

## Nhóm 3 — Luật mới ghi gần đây, chưa đủ dữ liệu để biết có tác dụng không
Mọi trường hợp đều xảy ra **trước** ngày luật được ghi. Theo dõi ở vòng hằng tuần.
- Báo "đã sửa" trong khi UI còn lỗi (9 lần) → `CLAUDE.local.md` §7 (28/09).
- UI giao đi mà không render kiểm tra (~24 lần) → `feedback_verify_css_with_render` (cập nhật 28/09).
- Review sau mỗi lần sửa thay vì 1 lần cuối (6 lần) → `CLAUDE.local.md` §2.
- Hỏi A/B cho lỗi đã quá rõ (2 lần) → `CLAUDE.local.md` §6.

## Nhóm 4 — Chưa có luật nào (bài học mới)
| Lỗi | Số lần | Luật đề xuất |
|---|---:|---|
| Anh bảo "chạy lại", "huỷ job" mà agent hỏi lại hoặc chần chừ | 4 | Lệnh rõ ràng thì làm ngay. Ranh giới với `feedback_question_vs_action`: **câu hỏi** thì không tự chạy, **câu lệnh** thì chạy luôn |
| Agent thay hướng sửa anh đã chọn bằng hướng của nó | 3 | Anh đã chọn hướng thì làm theo hướng đó. Có lý do phản đối thì nói 1 câu rồi vẫn chờ anh |
| Mockup đưa anh thiếu màn, nút hỏng, có thứ không có thật | 6 | Mockup phải dựng từ UI thật và đủ mọi trạng thái anh hỏi. Tự mở lại kiểm trước khi gửi |
| Thêm bước xác nhận thừa làm chậm | 4 | Độ tin cậy thấp (0.3), chưa đủ để thành luật |

Subagent còn báo "dùng Artifact thay vì HTML local" là chưa có luật. **Sai**: output style `plain-vietnamese` đã ghi rõ. Đã loại khỏi bảng.

## Nhóm 5 — Thuộc việc viết note Obsidian, không vào work brain
Note khó hiểu, thiếu ý, tự tưởng tượng, văn AI (~19 lần). Đã có luật trong memory của vault (`feedback_note_style_book`, `feedback_cite_dont_invent_examples`, …) → **để lại vault**. Lần sau phiên học note thì tự nạp.

---

## Đề xuất ghi vào brain (chờ anh duyệt từng dòng)
`rules/how-i-work.md`:
1. Never state a field, file, link or fact you have not opened in this session; say "chưa kiểm" instead.
2. Restate the request in one line before any multi-step work; wait for "đúng".
3. Do exactly the scope asked; anything extra is a question, not a change.
4. An explicit command ("chạy lại", "huỷ", "làm đi") is executed now; only questions stay read-only.
5. Once the owner picks a fix direction, implement that direction.
6. A bug or setting shared by several surfaces is fixed on all of them.
7. Mockups are built from the real UI, cover every state asked, and are reopened and checked before sending.

`rules/code-style.md`:
8. Names state the exact meaning of the value (`refundAmount`, not `orderSubTotalValid`); propose names when unsure.

Hook (lên bậc, cần anh đồng ý vì đụng harness Joy):
9. Bật lại `commit-consent` hoặc thay bằng bản mới.
10. Hook chặn `git stash` / `git checkout --` / `git restore` trên file không thuộc task.

## Dữ liệu
Toàn bộ ở thư mục tạm của phiên này (sẽ mất khi dọn): `cases.jsonl` (860 trường hợp), `lessons1..5.json`, `catalog.md`, `extract.py`. Khi dựng brain thì chép vào `~/work-brain/.raw/backfill-2026-10-01/`.
