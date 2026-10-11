---
tags:
  - ai
  - jev
  - lab
  - hands-on
---

# 09 — Lab: tự build ticket router

[[08 - Giới hạn, giá và rủi ro|← Trước]] · [[00 - README|Mục lục]]

Mục tiêu: không chỉ "chạy được", mà **đo được** Jev có calibrated trên data của mình không, và so với LLM.

---

## Bước 0 — Chuẩn bị

```bash
mkdir jev-lab && cd jev-lab
uv init && uv add typesafe-sdk   # hoặc: pip install typesafe-sdk
export TYPESAFE_API_KEY=...      # lấy ở console.typesafe.ai
```

Tạo `tickets.jsonl` — **50–100 ticket thật** (tiếng Anh + tiếng Việt lẫn lộn càng tốt), tự gắn nhãn:

```json
{"text": "Payout bị lỗi 3 ngày rồi, mất đơn liên tục", "team": "technical", "urgent": true}
{"text": "Cho mình hỏi gói Pro có giới hạn số đơn không?", "team": "sales", "urgent": false}
```

---

## Bước 1 — Gọi thử 1 ticket

```python
# route.py
from typesafe_sdk import Choice, Noul, Score, TypeSafeClient

client = TypeSafeClient()

QUESTIONS = {
    "team": Choice(
        instructions="Which team should handle this support message",
        criteria={
            "billing":   "Payments, invoices, refunds, subscription charges",
            "technical": "Bugs, errors, outages, integration problems",
            "sales":     "Pricing questions, plan comparison, upgrades",
        },
    ),
    "urgent": Noul(instructions="The message conveys urgency or ongoing business loss"),
    "frustration": Score(
        instructions="How frustrated the customer appears",
        criteria=["Calm", "Frustrated but civil", "Very angry"],
    ),
}

def route(text):
    return client.system_one(state=text, questions=QUESTIONS).answers

if __name__ == "__main__":
    a = route("Payout bị lỗi 3 ngày rồi, mất đơn liên tục")
    print(a["team"].choice, a["team"].probabilities, a["team"].confidence)
    print(a["urgent"].noul, a["frustration"].score)
```

Quan sát: tiếng Việt có ra đúng không? Confidence bao nhiêu?

---

## Bước 2 — Chạy cả bộ và đo

```python
# eval.py
import json, time
from route import route

rows = [json.loads(l) for l in open("tickets.jsonl", encoding="utf-8")]
results = []
for r in rows:
    t = time.perf_counter()
    a = route(r["text"])
    results.append({
        "ok": a["team"].choice == r["team"],
        "conf": a["team"].confidence,
        "ms": (time.perf_counter() - t) * 1000,
    })

# Accuracy theo dải confidence  →  đây là calibration thô
for lo, hi in [(0, .3), (.3, .6), (.6, .8), (.8, 1.01)]:
    b = [x for x in results if lo <= x["conf"] < hi]
    if b:
        acc = sum(x["ok"] for x in b) / len(b)
        print(f"conf {lo:.1f}-{hi:.1f}: n={len(b):3d}  accuracy={acc:.0%}")

ms = sorted(x["ms"] for x in results)
print("p50 ms:", ms[len(ms)//2], " p95 ms:", ms[int(len(ms)*.95)])
```

**Đọc kết quả:**

- Dải confidence cao phải có accuracy cao hơn dải thấp. Nếu không → Jev không calibrated trên data này.
- Từ bảng, chọn ngưỡng: dưới mức nào thì đẩy cho người?
- Latency p50/p95 từ Việt Nam là bao nhiêu (so với 70–500 ms quảng cáo)?

---

## Bước 3 — So với LLM

Chạy cùng bộ ticket qua LLM đang dùng (Claude/GPT với structured output, hoặc `system-one-adapter-python`). Ghi bảng:

| | Jev | LLM |
|---|---|---|
| Accuracy | | |
| p50 latency | | |
| Chi phí / 1000 ticket | | |
| Số lần output lỗi format | 0 | |
| Có tín hiệu "không chắc" dùng được? | | |

---

## Bước 4 — Thêm confidence gate

```python
def handle(text):
    a = route(text)
    team = a["team"]
    if team.confidence < THRESHOLD:          # lấy từ bảng bước 2
        return "human_triage"
    if a["urgent"].noul > 0.8 or a["frustration"].score >= 1.5:
        return f"{team.choice}:priority"
    return team.choice
```

---

## Mở rộng (tuỳ chọn)

- [ ] Thử state dạng JSON (`{"message": ..., "plan": "pro", "mrr": 49}`) và nhắc field bằng backtick trong instructions.
- [ ] Gọi 1 ticket 10 lần, xem xác suất dao động bao nhiêu → hiểu vì sao đặt ngưỡng theo dải.
- [ ] Gate một lệnh nguy hiểm của agent bằng Noul (xem [[05 - Patterns - 4 kiến trúc chuẩn]]).
- [ ] Map-reduce 1.000 review app Shopify → chủ đề pain point.

---

## Ghi kết quả của mình

> Điền sau khi chạy:
>
> - Accuracy:
> - Ngưỡng chọn:
> - Tiếng Việt ổn không:
> - Có đáng thay LLM ở đâu trong dự án thật:
