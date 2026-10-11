---
tags:
  - ai
  - jev
  - patterns
  - architecture
---

# 05 — Patterns: 4 kiến trúc chuẩn

[[04 - Confidence - Đọc xác suất và đặt ngưỡng|← Trước]] · [[00 - README|Mục lục]] · [[06 - Jev vs LLM - Khi nào dùng cái nào|Tiếp →]]

Docs đóng khung mọi pattern quanh một ý: *"discrete, atomic decisions that compose into complex system behavior"* — **quyết định nhỏ, nguyên tử, ghép lại thành hành vi phức tạp**. Giống tư duy Unix: mỗi câu hỏi làm một việc, code là pipe.

| Pattern | Lợi | Một dòng |
|---|---|---|
| Speculative Fan-Out | chi phí, tốc độ | Hỏi dư trong 1 call, code lọc sau |
| Confidence-Gated Routing | tin cậy, an toàn | Confidence là trục quyết định thứ hai |
| Composite Scoring | chi phí, tin cậy, tốc độ | Nhiều yếu tố hẹp → 1 điểm tổng trong code |
| Intent Routing | chi phí, tốc độ | Phân loại ý định → đẩy tới handler đúng |

---

## 1. Speculative Fan-Out

Vì các câu hỏi chạy song song, thêm câu hỏi gần như **miễn phí về thời gian** và output không tính tiền. → Hỏi luôn cả những thứ *có thể* cần.

```python
questions = {
    "intent":        Choice(...),
    "is_refund":     Noul(...),   # chỉ dùng nếu intent == billing
    "mentions_bug":  Noul(...),   # chỉ dùng nếu intent == technical
    "churn_risk":    Score(...),  # chỉ dùng nếu khách là paid
}
r = client.system_one(state=ticket, questions=questions)
# code chọn câu trả lời nào liên quan, bỏ phần còn lại
```

> 💡 So với LLM: muốn làm vậy với LLM phải hoặc gộp hết vào 1 prompt (dễ lẫn, JSON to dễ hỏng) hoặc gọi nối tiếp (chậm). Với Jev, mỗi câu hỏi **độc lập** — câu này không làm nhiễu câu kia.

Chi phí thật: input token (state) được tính, nên state dài + nhiều câu hỏi vẫn tốn hơn một chút. Nhưng rẻ hơn nhiều so với gọi lại.

---

## 2. Confidence-Gated Routing

Quyết định có **2 trục**: *chọn gì* và *chắc tới đâu*.

```
                    confidence thấp      confidence cao
  hành động nhẹ  │  làm + log         │  làm
  hành động nặng │  người duyệt       │  xác nhận nhanh / làm
```

Chi tiết cách đặt ngưỡng ở [[04 - Confidence - Đọc xác suất và đặt ngưỡng]].

Dạng mở rộng — **cascade**: Jev trước, chỉ ca khó mới leo thang lên LLM reasoning:

```
 100% request → Jev (rẻ, 100 ms)
                 ├─ 85% confidence cao → xong
                 └─ 15% confidence thấp → LLM reasoning (đắt, chậm) → nếu vẫn mờ → người
```

Giảm chi phí LLM theo đúng tỉ lệ Jev tự xử lý được.

---

## 3. Composite Scoring

Đừng hỏi *"lead này tốt cỡ nào (1–10)?"* — câu quá rộng, không biết model đang cân yếu tố gì. Hỏi từng yếu tố:

```python
r = client.system_one(state=lead, questions={
    "budget_fit":   Score(instructions="Budget matches our pricing", criteria=[...]),
    "authority":    Noul(instructions="The contact can make purchase decisions"),
    "urgency":      Score(instructions="How soon they need a solution", criteria=[...]),
    "icp_match":    Choice(instructions="Which segment", criteria={...}),
})

a = r.answers
score = (0.4 * a["budget_fit"].score / 2
       + 0.3 * a["authority"].noul
       + 0.3 * a["urgency"].score / 2)
```

Lợi ích:

- **Trọng số nằm trong code** → đổi chiến lược kinh doanh không phải sửa prompt.
- **Debug được**: lead điểm thấp vì *budget* hay vì *authority*?
- Kết hợp được với check **deterministic** (doanh thu > X, quốc gia ∈ Y) — phần đó tính bằng code, đừng hỏi Jev.

---

## 4. Intent Routing

```
user message → Jev Choice(intent) ─┬─ "faq"      → tìm FAQ, trả lời mẫu
                                   ├─ "order"    → gọi API đơn hàng
                                   ├─ "complaint"→ LLM viết phản hồi + gắn tag
                                   └─ "other"    → LLM tổng quát
```

Chỉ những nhánh **thật sự cần viết văn** mới tốn tiền LLM. Router 100 ms nên không làm chậm UX.

---

## Pattern ngầm: Gate trước hành động nguy hiểm

Không có tên riêng trong docs nhưng OpenRouter nêu rõ: **một Noul check trước tool call phá huỷ** của agent.

```python
r = client.system_one(
    state={"user_request": req, "planned_action": action, "policy": POLICY},
    questions={"safe": Noul(instructions="The `planned_action` is clearly requested by `user_request` and allowed by `policy`")},
)
if r.answers["safe"].noul < 0.9:
    ask_human()
```

Xem thêm ứng dụng ở [[07 - Ứng dụng thực tế]].
