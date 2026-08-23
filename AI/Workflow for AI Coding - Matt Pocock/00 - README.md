---
tags:
  - ai
  - ai-coding
  - workflow
  - agent
  - moc
source: https://www.youtube.com/watch?v=-QFHIoCo-Ko
speaker: Matt Pocock
channel: AI Engineer
duration: 1:36:30
uploaded: 2026-04-24
created: 2026-08-17
---

# Full Walkthrough: Workflow for AI Coding — Matt Pocock

Workshop 1h36m tại **AI Engineer**. Toàn bộ vòng đời làm một feature với AI agent: từ tin nhắn Slack mơ hồ → PRD → Kanban board → agent tự code AFK → QA.

Note được tách theo **đúng chapter của YouTube** để vừa xem vừa đọc — tua tới timestamp nào thì mở file tương ứng.

---

## Mục lục theo timestamp

| Timestamp | Chapter trên YouTube | File | Nội dung thực tế |
|---|---|---|---|
| `00:00–04:20` | Introduction + The Thesis of AI Engineering | [[01 - Thesis - Software engineering fundamentals vẫn đúng]] | Luận điểm gốc, phản biện specs-to-code |
| `04:20–12:45` | Phase 1: Research & Prototyping | [[02 - Hai ràng buộc của LLM - Smart zone và Memento]] | Smart/dumb zone, Ralph loop, compact vs clear |
| `12:45–22:10` | Phase 2: The Grill Session | [[03 - Grill Me - Đạt shared understanding]] | Skill `grill-me`, design concept, sub agent |
| `22:10–35:50` | Phase 3: Writing the PRD | [[04 - PRD - Document điểm đến]] | Template PRD, tại sao không đọc PRD |
| `35:50–48:15` | Phase 4: Slicing Work into Issues | [[05 - Vertical Slices - Cắt issue thành tracer bullets]] | Kanban DAG, AI code ngang vs dọc |
| `48:15–01:05:30` | Phase 5: Implementation with AI Agents | [[06 - AFK Agent - Ralph loop và TDD]] | `once.sh`, prompt Ralph, TDD chống gian lận |
| `01:05:30–01:18:45` | Phase 6: Human-in-the-Loop Review | [[07 - QA và Code Review - Nơi con người áp taste]] | Review trong smart zone, QA fail thật |
| `01:18:45–01:28:10` | Phase 7: Deployment & Monitoring ⚠️ | [[08 - Deep Modules - Thiết kế codebase cho AI]] | Ousterhout, gray box, `improve-codebase-architecture` |
| `01:28:10–01:34:06` | Designing Codebases for AI Effectiveness ⚠️ | [[09 - Parallelization - Sandcastle và Push vs Pull]] | Sandcastle, coding standards, model split |
| `01:34:06–01:36:30` | Final Takeaways & Summary | [[10 - Tổng kết và Q&A]] | Sơ đồ tổng + toàn bộ Q&A rải rác |

⚠️ **Lưu ý**: hai chapter cuối trên YouTube bị **đặt tên sai**. Chapter "Phase 7: Deployment & Monitoring" thực tế **không nói gì về deployment** — nội dung là deep modules. Chapter "Designing Codebases" thực tế là Sandcastle/parallelization. Cột "nội dung thực tế" mới là đúng.

---

## Luận điểm một câu

> Đây **không phải** một paradigm mới. Toàn bộ workflow là software engineering fundamentals cũ 20 năm, áp lên AI agent.

Mọi kỹ thuật trong workshop đều truy về sách:

| Sách | Tác giả | Đóng góp cho workflow |
|---|---|---|
| *The Pragmatic Programmer* | Hunt & Thomas | **Tracer bullets**, "don't bite off more than you can chew" |
| *A Philosophy of Software Design* | John Ousterhout | **Deep vs shallow modules** |
| *The Design of Design* | Frederick P. Brooks | **Design concept** — nền tảng của Grill Me |
| *Refactoring* | Martin Fowler | Giữ task nhỏ |

---

## Sơ đồ tổng

```
        ┌───────── HUMAN IN THE LOOP — "day shift" ─────────┐
        │                                                    │
   idea → grill me → [research/prototype] → PRD → Kanban board
                          ↑                              │
                          └── team, domain expert ───┘   │
                                                          │
        ┌───────── AFK — "night shift" ────────────────────┘
        ↓
   planner (tính blocking → chọn N issue song song)
        ↓
   implementer × N   (TDD · Docker sandbox · git worktree · Sonnet)
        ↓
   automated reviewer (⚠️ CLEAR CONTEXT trước · push coding standards · Opus)
        ↓
   merger (merge branch, tự fix type/test conflict)
        ↓
   HUMAN: QA thủ công + code review ──┐
        │                             │
        └──────── issue mới ──────────┘  → nạp ngược vào Kanban
        ↓
   share với team → full review
```

Xuyên suốt mọi bước: **giữ module map của codebase trong đầu**. Đây là thứ phân biệt workflow này với specs-to-code.

---

## Ba ý đắt nhất nếu chỉ nhớ được ba thứ

1. **Alignment > plan.** Công sức dồn vào grilling session, không dồn vào việc mài PRD. `[[03 - Grill Me - Đạt shared understanding]]`
2. **Cắt dọc, không cắt ngang.** AI mặc định code theo layer; phải ép nó làm lát mỏng xuyên hết layer để có feedback sớm. `[[05 - Vertical Slices - Cắt issue thành tracer bullets]]`
3. **Chất lượng feedback loop = trần chất lượng của AI.** Codebase không test được thì agent không thể giỏi. `[[08 - Deep Modules - Thiết kế codebase cho AI]]`

---

## Checklist áp dụng

**Dễ, làm ngay được**
- [ ] Viết skill `grill-me` (~5 dòng, nguyên văn ở [[03 - Grill Me - Đạt shared understanding]])
- [ ] Gắn status line hiển thị **số token chính xác**
- [ ] Bỏ `/compact`, chuyển sang `/clear`
- [ ] Tách reviewer thành session riêng — **clear context trước khi review**

**Trung bình**
- [ ] Viết PRD template có mục **proposed modules** và **out of scope**
- [ ] Lần cắt issue tiếp theo, tự hỏi: *"slice này có xuyên qua đủ layer không?"*
- [ ] Chạy skill kiểu `improve-codebase-architecture` trên repo hiện tại
- [ ] Split model: implement bằng model rẻ, review bằng model mạnh

**Nặng**
- [ ] Dựng `once.sh` chạy 1 lần → tune prompt → mới nâng lên loop
- [ ] Sandbox Docker + git worktree cho agent chạy song song

---

## Liên quan

- [[Harness trong AI là gì]]
- [[Harness design cho app chạy dài (Anthropic)]]
- [[Glossary AI]]
