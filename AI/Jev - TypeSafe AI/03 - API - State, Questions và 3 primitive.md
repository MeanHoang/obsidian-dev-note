---
tags:
  - ai
  - jev
  - api
---

# 03 — API: State, Questions và 3 primitive

[[02 - Bên trong Jev - Kiến trúc, RLCD và calibration|← Trước]] · [[00 - README|Mục lục]] · [[04 - Confidence - Đọc xác suất và đặt ngưỡng|Tiếp →]]

---

## Mô hình tư duy

Mỗi request có đúng 2 thứ:

```
state     = "thế giới hiện tại"   (string, JSON object, hoặc mảng text)
questions = { id: câu hỏi có kiểu, ... }
```

Response trả `answers` với **cùng key** mình đặt. Không có prompt hệ thống, không có message history.

---

## 3 primitive

| Primitive | Hỏi gì | Input cần | Output |
|---|---|---|---|
| **Choice** | Chọn 1 trong N | `instructions` + `criteria` = **object** `{option: mô tả}` | `choice`, `probabilities` theo option, `confidence` |
| **Score** | Đặt lên thang | `instructions` + `criteria` = **mảng** mô tả level (tối đa 10, level đánh số từ 0) | `score` (trung bình có trọng số xác suất), `probabilities`, `confidence`, `legend` |
| **Noul** | Mệnh đề này đúng không | chỉ `instructions` (viết dạng *khẳng định*) | `noul` = xác suất "đúng" (0–1), **không có** `confidence` |

> 🧠 **Cách nhớ:** Choice = `enum`, Score = `number` có thứ tự, Noul = `boolean` mềm. "Noul" đọc gần "null/bool" — một boolean có xác suất.

### Lưu ý viết câu hỏi

- **Jev không nhìn thấy question ID.** `"is_urgent"` chỉ là key cho code của mình; nghĩa phải nằm hết trong `instructions` và mô tả `criteria`.
- **Noul viết dạng mệnh đề**, không phải câu hỏi: `"The message conveys urgency"` chứ không phải `"Is it urgent?"`.
- **Score: `score` là trung bình có trọng số**, nên có thể ra số lẻ (`1.3`) — không phải luôn là số nguyên.
- Khi `state` là JSON, `instructions` có thể nhắc tới field bằng backtick: ``"Does `refund_reason` match the `policy`?"``.
- **Hỏi hẹp.** Muốn đánh giá đa yếu tố → mỗi yếu tố một câu, ghép trọng số trong code.

---

## Python SDK (quickstart chính thức)

```bash
pip install typesafe-sdk        # Python >= 3.10
export TYPESAFE_API_KEY=...
```

```python
from typesafe_sdk import Choice, Noul, Score, TypeSafeClient

client = TypeSafeClient()  # đọc TYPESAFE_API_KEY, mặc định model jev-latest

ticket = "Hi, I've been trying to connect my Stripe account for 3 days and the integration keeps failing. I'm losing sales. Please help ASAP."

response = client.system_one(
    state=ticket,
    questions={
        "department": Choice(
            instructions="Which team should handle this",
            criteria={
                "billing": "Payment or subscription issues",
                "technical": "Bugs or integration problems",
                "sales": "Pricing or account questions",
            },
        ),
        "frustration": Score(
            instructions="How frustrated the customer appears",
            criteria=[
                "Calm, just stating facts",
                "Frustrated but civil",
                "Very angry, strong language",
            ],
        ),
        "is_urgent": Noul(
            instructions="The message conveys urgency or time-sensitivity",
        ),
    },
)

print(response.answers["department"].choice)  # "technical"
print(response.answers["frustration"].score)  # 1.0
print(response.answers["is_urgent"].noul)     # 1.0
```

---

## HTTP thô

Endpoint TypeSafe: `POST https://api.typesafe.ai/v1/systemone`

```bash
curl -X POST https://api.typesafe.ai/v1/systemone \
  -H "Authorization: Bearer $TYPESAFE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "jev-latest",
    "state": "Help! My payouts have been failing for 3 days.",
    "questions": {
      "department": {
        "type": "choice",
        "instructions": "Which team should handle this?",
        "criteria": {
          "billing": "Payments, invoicing, refunds",
          "technical": "Bugs, outages, integrations",
          "sales": "Pricing, upgrades, new accounts"
        }
      }
    }
  }'
```

Response (dạng tài liệu LiteLLM minh hoạ):

```json
{
  "model": "jev-1.13.0",
  "answers": {
    "department": {
      "type": "choice",
      "choice": "technical",
      "probabilities": { "billing": 0.08, "technical": 0.85, "sales": 0.07 },
      "confidence": 0.82
    }
  },
  "usage": { "input_tokens": 312, "output_tokens": 48 }
}
```

> ⚠️ Nếu tự tính bằng công thức ở [[04 - Confidence - Đọc xác suất và đặt ngưỡng|file 04]]: (0.85 − 1/3) / (1 − 1/3) ≈ **0.775**, không phải 0.82. Ví dụ trên là minh hoạ của LiteLLM, đừng dùng nó để kiểm công thức — gọi thật rồi so.

---

## Các cửa vào khác

| Cửa | Endpoint / ID | Ghi chú |
|---|---|---|
| **OpenRouter** | `POST https://openrouter.ai/api/alpha/decisions`, model `typesafe/jev-1.13` hoặc `~typesafe/jev-latest` | Dùng **Decisions API**, *không* phải chat completions → SDK chat (OpenAI SDK) không gọi được |
| TypeSafe SDK qua OpenRouter | đặt `baseURL = https://openrouter.ai/api` | Python `typesafe-sdk`, JS SDK đều được |
| **LiteLLM proxy** | `POST /typesafe/v1/systemone` | Pass-through, mọi path `/typesafe/*` được forward |
| Vercel AI Gateway, Cloudflare, Netlify | — | Tích hợp tuần ra mắt; xem docs từng bên |

**Pin version khi chạy production**: dùng `jev-1.13` thay vì `jev-latest`, vì model mới có thể dịch xác suất → ngưỡng mình đã tune bị lệch.

---

## Giới hạn request

- Text only (string, JSON, mảng text). Chưa có ảnh/âm thanh/video.
- Context: TypeSafe ghi **64K token / request**, trong đó tối đa **32K cho `state` + câu hỏi dài nhất**. OpenRouter ghi 32K.
- Score tối đa 10 level. Choice tối đa 255 option.
