---
tags:
  - ai
  - ai-coding
  - agent
  - verification
  - moc
source: https://www.youtube.com/watch?v=EWSUvEyFwjc
speaker: Lauren Tan
channel: Vision Sabbat
duration: "55:05"
created: 2026-10-21
---

# Trust ladder cho AI agent — Lauren Tan (Cursor)

Buổi chia sẻ ~55 phút (dạng livestream có Q&A với người dẫn chương trình). Tiêu đề video: *"Lauren Tan - SpaceXAI engineer"*. Lauren là kỹ sư ở Cursor (vào được 5 tháng), trước đó làm ở Meta.

Chủ đề xuyên suốt: **làm sao tin agent đủ để giao việc rồi đi ngủ**, từ canh từng output tới để agent tự merge PR.

> [!info] Nguồn của note
> Dịch và sắp xếp lại **chỉ từ phụ đề tự động tiếng Anh** của video, không thêm thông tin ngoài. Phụ đề tự động ghi tên riêng không ổn định: "Grockbot" có chỗ ghi "Graphbot"/"Rockbot", "Pstack" có chỗ ghi "PAC". Note dùng cách viết xuất hiện nhiều nhất. Video không có chapter YouTube; timestamp dưới đây em tự chia theo nội dung.

---

## Mục lục theo timestamp

| Timestamp | File | Nội dung |
|---|---|---|
| `00:00–05:53` | [[01 - Trust curve - Từ micromanage tới auto-merge]] | AI là pair, không phải chỗ outsource suy nghĩ. Biểu đồ trust curve, 1.000 PR/tháng |
| `05:53–13:27` | [[02 - Verification skill và Feature map]] | Agent tự chạy app thật. Skill `control glass`, file feature map |
| `13:27–23:28` | [[03 - Pstack - Biến lỗi agent thành skill và eval]] | Quan sát lỗi agent → skill. Eval = unit test cho skill, hill climb, judge agent |
| `23:28–29:28` | [[04 - Local trước, cloud sau - Agent Benny]] | Bắt đầu local, rồi cloud agent. Benny tự reproduce bug report |
| `29:21–37:50` | [[05 - Có nên rewrite - Greenfield và organic architecture]] | Brownfield vs greenfield, "human slop", 600 PR refactor Grockbot, kích thước PR |
| `37:42–47:43` | [[06 - Các lớp enforcement - Hard constraint thắng soft rule]] | Kiến trúc Dune, CI cấm `useEffect`/comment, lớp cứng vs mềm, thoát "code review land" |
| `47:23–55:05` | [[07 - Q&A - Token, ROI và team product]] | ROI token, PM/designer ship code qua Grockbot |

---

## Hành trình 3 bậc (Lauren xác nhận ở 27:49)

1. **Verification**: agent tự chạy app thật và kiểm code **đúng**. → [[02 - Verification skill và Feature map]]
2. **Tin ở local rồi lên cloud**: agent tự nhặt bug report, trả PR. → [[04 - Local trước, cloud sau - Agent Benny]]
3. **Auto-merge**, người review lại trên `main`. Cần codebase có guardrail cứng. → [[06 - Các lớp enforcement - Hard constraint thắng soft rule]]

Không có đường tắt: mỗi bậc là **mức tin của chính mình**. Nhảy cóc lên hàng trăm cloud agent khi chưa tin 1 agent = đốt token.

---

## Ba ý đắt nhất

1. **Không có verification thì mình là nút thắt.** Agent phải tự chạy app, tự lấy trace; feature map chỉ đường cho nó. `[[02 - Verification skill và Feature map]]`
2. **Lỗi lặp của agent → skill, skill → eval.** Đọc tool call để thấy agent hỏng ở đâu, kiểm skill bằng sub agent không biết mình bị test. `[[03 - Pstack - Biến lỗi agent thành skill và eval]]`
3. **Luật cứng thắng luật mềm.** Mỗi comment review "đừng làm X" là dấu hiệu cần một lint/CI check. Đường ngắn nhất phải là đường đúng. `[[06 - Các lớp enforcement - Hard constraint thắng soft rule]]`

---

## Checklist áp dụng

**Dễ, làm ngay được**
- [ ] Đọc tool call + thinking block của agent trong 1 task, ghi các kiểu lỗi lặp
- [ ] Mỗi lần comment review "đừng làm X", ghi X vào danh sách ứng viên lint/CI

**Trung bình**
- [ ] Viết verification skill cho app của mình: agent tự bật app, điều khiển, lấy log/trace
- [ ] Viết feature map: tính năng con, đường đi trên UI, phím tắt, selector
- [ ] Dựng eval nhỏ cho 1 skill: rubric + vài sub agent + judge khác model

**Nặng**
- [ ] Chuyển danh sách lỗi lặp thành lint/CI check (chặn import sai tầng, cấm pattern xấu)
- [ ] Gom code theo feature/thư mục để agent copy pattern
- [ ] Automation kiểu Benny: bug report → cloud agent reproduce → báo kết quả

---

## Liên quan trong vault

- [[AI/Workflow for AI Coding - Matt Pocock/00 - README|Workflow for AI Coding - Matt Pocock]]: cũng nhấn feedback loop và thiết kế codebase cho AI
- [[Harness trong AI là gì]]
