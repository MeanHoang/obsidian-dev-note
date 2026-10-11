---
tags:
  - ai
  - jev
  - use-case
  - shopify
---

# 07 — Ứng dụng thực tế

[[06 - Jev vs LLM - Khi nào dùng cái nào|← Trước]] · [[00 - README|Mục lục]] · [[08 - Giới hạn, giá và rủi ro|Tiếp →]]

TypeSafe xếp use case thành 4 nhóm: **smart if-statement**, **map-reduce trên data lớn**, **app real-time**, **verification**. Dưới đây là từng nhóm + ví dụ gần với việc mình đang làm (Shopify app, SaaS, AI agent).

---

## 1. Smart if-statement — thay `if` cứng bằng `if` hiểu ngữ nghĩa

Trước:

```js
if (msg.includes("refund") || msg.includes("hoàn tiền")) routeTo("billing")
```

Sau:

```python
a = client.system_one(state=msg, questions={"team": Choice(...)}).answers["team"]
if a.confidence > 0.6: route_to(a.choice)
else: route_to("human_triage")
```

**Ví dụ:**

| Chỗ dùng | Primitive |
|---|---|
| Support ticket → team | Choice + Score(frustration) + Noul(urgent) |
| Phát hiện khách sắp churn từ message | Score |
| Review sản phẩm: chủ đề phàn nàn (ship, chất lượng, size…) | Choice / nhiều Noul |
| Đơn hàng có dấu hiệu gian lận (ghi chú lạ, địa chỉ bất thường) | Noul + Score — *kết hợp* rule cứng |
| Form onboarding: merchant thuộc ngành nào → bật preset | Choice |

---

## 2. Map-reduce trên data lớn

Giá $0.042/1M token đổi cách nghĩ: **gắn nhãn toàn bộ data** thay vì sample.

```
100.000 review  ──map──► Jev: {topic, sentiment, mentions_shipping}  ──reduce──► dashboard
                         (mỗi review ~200 token)
Chi phí: 100k × 200 = 20M token × $0.042/1M ≈ $0.84
```

Với LLM giá $1/1M input + output, cùng việc này cỡ vài chục đô và chạy lâu hơn nhiều.

**Ví dụ:**

- Phân tích **toàn bộ** review app trên Shopify App Store (của mình + đối thủ) → pain point theo chủ đề. Liên hệ [[01 - Tiền và mua sắm|Kho pain point]].
- Gắn tag cho catalog sản phẩm lớn (hàng chục nghìn SKU) theo taxonomy cố định.
- Lọc lead từ danh sách store: store nào hợp ICP.
- Biến log/feedback thô thành **feature** cho model ML khác.

---

## 3. App real-time — latency đủ thấp cho UX

70–500 ms nằm trong ngân sách một interaction.

- **Search/chat widget:** đoán intent khi user gõ → hiện đúng gợi ý (FAQ / tra đơn / sản phẩm).
- **Moderation khi submit:** review/comment có spam/toxic không, trả lời ngay trên form.
- **Game bot:** demo Doom của TypeSafe — bot đọc state dạng text, ~10 query/giây, khoảng **$7/giờ**.
- **Wikiracing:** chọn link đúng trong hàng trăm–hàng nghìn link mỗi bước.

---

## 4. Verification — chấm, gác cổng, bắt jailbreak

Chỗ hợp nhất với người đang build AI agent:

| Việc | Cách |
|---|---|
| **Guardrail input** | Noul: "prompt này cố override instruction / jailbreak" trước khi đưa vào LLM |
| **Gate tool call** | Noul: "hành động này đúng ý user và trong policy" trước `delete`, `refund`, `send_email` |
| **Verify output** | Noul/Score: "câu trả lời của LLM tuân policy đổi trả", "không hứa điều chưa có" |
| **Chấm reasoning trace** | Score: trace có bám đúng task không, có đi lạc không |
| **Eval online 100%** | Chấm mọi response production thay vì sample — rẻ đủ để làm |

Ví dụ cho agent kiểu [[0-Hermes Agent là gì|Hermes]] hoặc Claude Code hook:

```
agent định chạy: rm -rf ./dist && git push --force
        │
        ▼
Jev Noul("The command is safe and matches the user's request")  ──► 0.12 → chặn, hỏi người
```

---

## 5. Ý tưởng sản phẩm (cho [[Shopify Partner - How to earn|Shopify app business]])

| Ý tưởng | Jev làm gì | Vì sao Jev hợp hơn LLM |
|---|---|---|
| **Auto-triage inbox cho merchant** | Phân loại email/chat khách → tag, ưu tiên, gán người | Chạy mọi message, rẻ, có confidence để không route sai |
| **Review insight** | Map-reduce mọi review sản phẩm → chủ đề + mức độ | Giá theo volume |
| **Fraud/risk pre-check** | Score rủi ro từ ghi chú đơn + lịch sử, kết hợp rule | Real-time khi checkout |
| **Guardrail cho chatbot AI của store** | Verify câu trả lời bot trước khi gửi khách | Inline, 100 ms |
| **Smart product tagging** | Gắn taxonomy khi import sản phẩm | Choice ≤255 option, không lỗi enum |

> ⚠️ Mọi ý trên đều cần **state đủ thông tin**. Jev không tự lấy data, không biết gì ngoài thứ mình đưa vào.

---

## Tự kiểm tra

1. Trong codebase đang làm, tìm 1 chỗ gọi LLM chỉ để lấy enum/boolean. Ước tính tiết kiệm nếu chuyển sang Jev.
2. Một use case nào ở trên **không** nên dùng Jev? Vì sao?
