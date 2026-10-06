---
tags: [work-brain, research]
created: 2026-10-01
---

# So sánh với các brain khác trên GitHub

Quay về [[0-Tổng quan]]

**Trả lời thật:** lúc dựng `~/work-brain`, em chỉ tham khảo **mẫu thiết kế**: gist LLM Wiki của Karpathy, LLM Wiki v2, skill `continuous-learning` của ECC, plugin `claude-obsidian`. Em **chưa** xem repo brain hoàn chỉnh của ai. Note này bù phần đó (đọc ngày 2026-10-01).

## Ba repo đã đọc
| Repo | Ý chính | Độ phổ biến |
|---|---|---|
| [remember-md/remember](https://github.com/remember-md/remember) | Quét **phiên cũ** (`/remember:process`), rút ra người, quyết định, task, nhật ký. Trong phiên: AI thấy sở thích ổn định thì hỏi "💡 Want me to remember this?", anh đồng ý mới ghi. `Persona.md` (cách làm việc của chủ) nạp mọi phiên. Ý được nâng lên Persona khi đủ ngưỡng (`promotion_confidence: 0.85`, `promotion_sources: 5`). Dọn hằng tuần bằng `/remember:evolve` | Có hệ thống, plugin hoàn chỉnh |
| [kaushikhazra/second-brain](https://github.com/kaushikhazra/second-brain) | Vòng đời phiên: mở phiên → mỗi 30 phút tự gom bài học ("heartbeat") → cuối phiên ghi "bàn giao" → "dream" sắp xếp lại bộ nhớ. **Mỗi quy ước về memory có script kiểm** (`verify_memory.py`, hook chặn sai định dạng) | 0 sao, template cá nhân |
| [mattbeswick/second-brain-starter](https://github.com/mattbeswick/second-brain-starter) | Phỏng vấn khoảng 12 câu rồi dựng cấu trúc theo người dùng. "One memory index… kept short. It points to notes rather than holding them." Hook `memory-guard` giữ index gọn. Khuyên repo private | 1 sao, mới |

(`vermingov/claude-brain` trả về 404, không đọc được.)

## Brain của mình so với họ

**Giống, nên thiết kế của mình đi đúng hướng:**
- Hỏi trước khi ghi ("Anh muốn em ghi… không?") = "Want me to remember this?" của remember.md.
- Học từ phiên cũ = `/remember:process`.
- Index ngắn trỏ tới trang = `wiki/index.md`.
- Dọn hằng tuần = `/brain-review` ≈ `/remember:evolve`.
- Repo private.

**Mình có mà họ không có:**
1. **Số đo:** mốc friction 16–17%; bộ phát hiện bắt 81% số lần anh bực, đo trên 207 trường hợp có nhãn. Ba repo trên đều không đo xem brain có làm AI tốt lên không.
2. **Cái thang lên bậc:** luật bị vi phạm lại thì thành hook. remember.md chỉ nâng ý lên Persona, vẫn là chữ.
3. **Bài thi "đoán quyết định của anh"** (note 10): chưa thấy repo nào làm.
4. **Kho bằng chứng `.raw/`**: biết mỗi luật sinh ra từ đâu.

**Họ có mà mình chưa có, nên học:**

| Thiếu | Lấy từ | Đề xuất cho brain |
|---|---|---|
| **Ghi lại phiên cũ nào đã học rồi** | remember.md (state file) | `.raw/processed-sessions.txt`, để `/brain-review` không đọc lại phiên đã xử lý |
| **Người** (PM, BA, tester, reviewer: ai muốn gì, ai chốt gì) | remember.md `People/` | `wiki/people.md`. Nhiều quyết định của anh phụ thuộc người khác (PM build harness team, BA viết spec bằng AI…) |
| **Script kiểm brain đúng quy ước** | kaushikhazra (`verify_memory.py`) + mattbeswick (`memory-guard`) | `scripts/check-brain.py`: `rules/` < 200 dòng, trang wiki đủ frontmatter, `index.md` có đủ trang, không có chuỗi giống key. Chạy trong `/brain-review` và trước commit |
| **Bàn giao cuối phiên** ("dừng ở đâu, tiếp theo là gì") | kaushikhazra `/session-end` | Gộp vào `hot.md`. Hook cuối phiên nhắc agent cập nhật `hot.md` khi có việc dở |
| **Ngưỡng nâng ý thành luật** có con số | remember.md (5 nguồn, 0.85) | **Không chép số của họ.** Đo bằng bài thi ở note 10: cần bao nhiêu lần lặp thì AI đoán đúng ý anh |

## Không nên học
- **Heartbeat 30 phút** (kaushikhazra): mỗi 30 phút gọi LLM gom bài học. Tốn token liên tục. Bằng chứng của ECC v1: cách gom bằng LLM chạy không đều (~50–80%).
- **Persona cho AI tự đặt** (kaushikhazra): anh cần AI theo cách làm của anh, không cần AI có tính cách riêng.
- **MCP server riêng** để lưu memory: thêm một thứ phải chạy và bảo trì. Brain của anh là markdown thuần trong git, đủ dùng.
