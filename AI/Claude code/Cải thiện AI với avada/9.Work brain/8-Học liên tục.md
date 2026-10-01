---
tags: [work-brain, research, learning-loop]
created: 2026-10-01
status: anh đã chốt 2026-10-01 — đang chạy học bù
---

# Học liên tục

Quay về [[0-Tổng quan]] · Dựa trên [[7-Research và thiết kế lại]]

**Câu hỏi:** làm sao brain tự tốt lên mỗi lần anh dùng, và học được từ các phiên cũ?

**Kết luận ngắn:** lấy dữ liệu thật của anh làm gốc. Ghi chữ (memory, rules) không đủ để agent hết lặp lỗi. Lỗi nào lặp lại sau khi đã ghi thì phải "nâng cấp" thành hook. Cần 3 vòng: trong phiên, cuối phiên, hằng tuần.

---

## 1. Dữ liệu thật trên máy (đo ngày 2026-10-01)

| Nguồn | Có gì | Từ khi nào |
|---|---|---|
| `~/.claude/projects/*/*.jsonl` | 484 phiên đầy đủ (cả câu anh lẫn câu agent), 2.0 GB | **Chỉ từ 2026-09** |
| `~/.claude/history.jsonl` | 6.719 câu anh gõ, không có câu agent | Từ 2026-03-23 |

**Phiên cũ đang bị xoá dần.** Claude Code xoá transcript cũ theo `cleanupPeriodDays`. Máy anh chưa đặt setting này, và thực tế chỉ còn phiên của 1 tháng gần nhất. Muốn học từ phiên cũ thì việc đầu tiên là **giữ dữ liệu lại**.

Chạy script có sẵn của anh `AI/Claude code/scan-ai-friction.py` trên dữ liệu đó:

| | Số |
|---|---:|
| Câu của anh (đã khử trùng) | 6.708 |
| Câu có dấu hiệu anh không hài lòng | 1.003 (14%) |
| Anh bấm ESC cắt ngang | 38 |
| Anh phản hồi ngay sau khi agent sửa file | 117 |

Tỉ lệ theo tháng: tháng 3–7 khoảng **6–11%**, tháng 8–9 lên **16–17%** (tháng 8–9 cũng là lúc số câu tăng gấp 6–8 lần).

Nhóm lỗi nhiều nhất: bịa/đoán (185), tự ý hành động (130), code thừa khó hiểu (86), không bám mẫu có sẵn (76), UI (73), dịch (71).

**Giới hạn của script (đã kiểm):** nó lọc bằng từ khoá nên lẫn nhiều rác. Ví dụ nhóm "vi phạm luật đã nhắc" có 20 câu, nhưng xem tay thì phần lớn là prompt kickoff do agent sinh ra hoặc tin nhắn giữa các agent, không phải câu anh mắng. → Script chỉ dùng để **lọc sơ**. Bước sau phải cho LLM đọc từng câu để phân loại.

## 2. Bằng chứng: chữ không đủ, hook mới chặn được
Ngay trong harness Joy đã có 2 lần đi đúng con đường này:
1. **Vị trí key dịch.** Memory `feedback_translation_key_placement` ghi: "flagged 6+ times… Same exact miss twice". Ghi memory rồi mà agent vẫn sai → cuối cùng thành hook `block-translation-append.sh`.
2. **eslint cả file.** Bài học `feedback_eslint_changed_lines_only` → thành hook `auto-lint.sh` chỉ giữ chỗ sửa trên dòng đã đổi.

Tài liệu Claude Code nói cùng ý: "CLAUDE.md … not a hard enforcement layer… If the instruction is something that must run at a specific point… write it as a hook".

→ Gọi là **cái thang 3 bậc**: anh sửa lần 1 → ghi thành 1 dòng luật. Sai lại sau khi đã ghi → nâng thành hook hoặc test. Luật không còn dùng → xoá.

## 3. Research bên ngoài

| Nguồn | Cơ chế | Lấy gì cho brain |
|---|---|---|
| Auto-memory của Claude Code ([docs](https://code.claude.com/docs/en/memory)) | Agent tự ghi khi bị sửa. Joy có hook `memory-consent` chặn ghi khi anh chưa bảo | Giữ: anh muốn duyệt trước khi ghi |
| `continuous-learning` v1 ([ECC](https://github.com/affaan-m/everything-claude-code/blob/main/skills/continuous-learning/SKILL.md)) | Hook Stop cuối phiên đọc transcript, rút mẫu thành skill trong `~/.claude/skills/learned/`. Có `auto_approve: false` | Ý cuối phiên. Nhưng tác giả tự ghi v1 chỉ chạy "~50–80% of the time" và đã bỏ v1 |
| `continuous-learning` v2 | Quan sát từng lần dùng tool, mỗi bài học nhỏ có điểm tin cậy. Học theo project trước, lặp đủ nhiều mới đưa lên dùng chung | Ý **điểm tin cậy + đưa lên dần**: bài học Joy chỉ thành luật chung khi đúng ở nhiều nơi |
| LLM Wiki v2 ([gist](https://gist.github.com/rohitg00/2067ab416f7bbe447c1977edaaa681e2)) | "Everything is manual" là lý do wiki thối → cần hook tự chạy. Thông tin mới phải **thay** thông tin cũ | Vòng hằng tuần phải tự nhắc, và mỗi luật mới ghi rõ nó thay luật nào |
| Plugin `claude-obsidian` (đã cài) | Hook Stop cập nhật `hot.md`; `wiki-lint` dọn wiki | Dùng nguyên cho phần wiki |
| `/insights` của Claude Code | Báo cáo friction (anh đã có bản 2026-04-23 trong vault) | Dùng làm báo cáo tháng, so với số của script |

## 4. Đề xuất: 3 vòng học

### Vòng 1 — Trong phiên (lúc anh sửa agent)
- **Khi nào:** anh nói kiểu "sai rồi", "đã bảo rồi", "đừng tự…".
- **Làm gì:** hook `UserPromptSubmit` dùng lại bộ từ khoá của `scan-ai-friction.py`. Thấy câu sửa thì nhắc agent: "anh vừa sửa em, đề xuất 1 dòng bài học". Agent **đề xuất**, anh nói "ghi" thì mới ghi (giữ đúng tinh thần `memory-consent`).
- **Ghi vào đâu:** bài học code Joy → memory `joy` (có symlink sang `roles/lessons`). Cách làm việc chung → `~/work-brain/rules/`.
- **Chi phí:** hook chạy regex, không tốn token.

### Vòng 2 — Cuối phiên
- **Khi nào:** hook `SessionEnd`.
- **Làm gì:** không gọi LLM, chỉ ghi 1 dòng vào `~/work-brain/.raw/sessions.jsonl`: ngày, project, đường dẫn transcript, số câu sửa trong phiên (chạy regex). Đồng thời hook Stop của plugin cập nhật `wiki/hot.md` ("đang làm gì").
- **Vì sao không cho LLM tóm tắt mỗi phiên:** tốn token mỗi phiên, và v1 của ECC cho thấy cách này chạy không ổn định.

### Vòng 3 — Hằng tuần (học từ phiên cũ)
Một skill `/brain-review` (tên tạm):
1. Chạy `scan-ai-friction.py` cho 7 ngày qua → lọc sơ.
2. Subagent đọc các câu đã lọc trong transcript thật (có cả câu agent trước đó) → bỏ rác → gom thành bài học.
3. So với `rules/`, memory, hook hiện có:
   - Bài học **mới** → đề xuất 1 dòng luật.
   - Bài học **đã có mà vẫn sai** → đề xuất nâng thành hook/test (bậc 2 của cái thang).
   - Luật không thấy dùng / đã cũ → đề xuất xoá.
4. Anh duyệt từng mục → agent ghi + `git commit` trong `~/work-brain`.
5. Chạy `wiki-lint` + `/doctor prompt-audit`.
6. Ghi tỉ lệ friction tuần vào `wiki/meta/friction.md` → nhìn được brain có làm agent tốt lên không.

Nhắc chạy: hook `SessionStart` kiểm ngày chạy `/brain-review` gần nhất, quá 7 ngày thì nhắc 1 dòng. Tự chạy ngầm bằng cron thì không làm, vì anh muốn tự quyết.

### Việc 1 lần: học bù từ phiên cũ
Chạy vòng 3 trên **toàn bộ** dữ liệu còn lại (484 phiên + 6.719 câu từ tháng 3) → ra danh sách bài học còn thiếu so với 55 file memory hiện có. Làm trước khi dữ liệu tháng 9 bị xoá tiếp.

## 5. Đo xem có hiệu quả không
- **Mốc ban đầu:** friction tháng 8–9 = 16–17% (script hiện tại, cùng bộ từ khoá).
- Mỗi tuần đo lại cùng một cách → tỉ lệ giảm là brain đang có tác dụng.
- Riêng nhóm "đã nhắc rồi mà vẫn sai": đếm bằng LLM (không bằng regex vì rác nhiều) → nhóm này phải về gần 0, vì mỗi lần xuất hiện là một lần cái thang đã phải nâng thành hook.

## 6. Anh đã chốt (2026-10-01)
1. **Không giữ transcript.** Không đổi `cleanupPeriodDays`. Thay vào đó, vòng 2 **trích** từng lần anh bực/sửa agent (câu của anh + đoạn agent làm ngay trước) ra brain dưới dạng file nhỏ. Transcript cứ để Claude Code xoá như bình thường.
2. **Chạy học bù ngay** trên 484 phiên + `history.jsonl`. Kết quả ở [[9-Kết quả học bù]].
3. **Vòng 1 chạy song song trong phiên.** Hook thấy anh có dấu hiệu bực → agent hỏi ngay: "Anh muốn em ghi bài học này vào second brain để không lặp lại không?". Anh "có" thì mới ghi.
