---
tags:
  - ai
  - jev
  - confidence
  - calibration
---

# 04 — Confidence: đọc xác suất và đặt ngưỡng

[[03 - API - State, Questions và 3 primitive|← Trước]] · [[00 - README|Mục lục]] · [[05 - Patterns - 4 kiến trúc chuẩn|Tiếp →]]

Đây là file quan trọng nhất. Dùng Jev mà chỉ đọc `choice` và bỏ qua `confidence` thì mất 80% giá trị.

---

## Confidence đo cái gì

`confidence` (0–1) = **mức tập trung của phân phối xác suất**.

- `1` → toàn bộ xác suất dồn vào một đáp án
- `0` → xác suất rải đều (model không biết gì)

> ⚠️ Confidence **không** phải "xác suất đáp án đúng". Nó đo độ *tập trung*. Xác suất đúng thật phải đo bằng data của mình.

---

## Công thức (theo docs)

### Noul (tuỳ chọn tự tính, API không trả)

$$\text{confidence} = |2p - 1|$$

`p = 0.5 → 0` (hoàn toàn không chắc) · `p = 0.9 → 0.8` · `p = 0.1 → 0.8` (chắc là **sai**)

### Choice — n lựa chọn, p_max là xác suất đáp án được chọn

$$\text{confidence} = \frac{p_{\max} - \frac{1}{n}}{1 - \frac{1}{n}}$$

Ý nghĩa: p_max vượt mức "đoán bừa" (1/n) được bao xa, chuẩn hoá về 0–1.

| Phân phối (3 option) | Confidence |
|---|---|
| (0.6, 0.3, 0.1) | (0.6 − 0.333) / 0.667 = **0.4** |
| (0.6, 0.2, 0.2) | **0.4** — giống hệt, vì chỉ p_max tính |
| (0.85, 0.08, 0.07) | **≈ 0.775** |
| (0.34, 0.33, 0.33) | **≈ 0.01** |

> 💡 Vì chỉ p_max được tính, (0.6, 0.3, 0.1) và (0.6, 0.2, 0.2) cùng 0.4 dù cái đầu "lưỡng lự giữa 2" rõ hơn. Muốn bắt trường hợp này, tự tính thêm **tỉ lệ top1 / top2** từ `probabilities`.

### Score — n level (0…n−1), m là level có xác suất cao nhất

$$\text{confidence} = \max\left(0,\ 1 - \frac{\sum_i p_i\,|i - m|}{\text{MAD}_{\text{unif}}}\right),\quad \text{MAD}_{\text{unif}} = \frac{1}{n}\sum_i \left|i - \frac{n-1}{2}\right|$$

Ý nghĩa: xác suất rải **xa** level đỉnh bao nhiêu, so với rải đều. Score có thứ tự nên phân vân giữa 2 level **cạnh nhau** nhẹ hơn phân vân giữa 2 **đầu**.

| Phân phối (3 level) | Confidence | Đọc |
|---|---|---|
| (0, 0.5, 0.5) | 0.25 | Phân vân giữa "bực" và "rất bực" — chấp nhận được |
| (0.5, 0, 0.5) | **0** | Phân vân giữa "bình thường" và "rất bực" — vô nghĩa |
| (0, 0.57, 0.43) | ≈ 0.35 | MAD_unif = 2/3, spread = 0.43 |

---

## Đặt ngưỡng: 3 dải hành động

```
confidence:  0 ──────────── thấp ────── trung bình ────── cao ──── 1
                 KHÔNG LÀM          LÀM THẬN TRỌNG       TỰ ĐỘNG
            → người / hỏi lại   → xác nhận / review   → làm luôn
              / fallback LLM      / lấy thêm thông tin
```

**Ngưỡng tỉ lệ với rủi ro**, không phải một số cho cả app. Ví dụ docs:

```python
answer = response.answers["intent"]

if answer.confidence < 0.5:
    route_to_human()
elif answer.choice == "show_balance":
    show_balance()                       # rủi ro thấp: 0.5 là đủ
elif answer.choice == "approve_transfer":
    if answer.confidence > 0.9:
        approve_transfer()               # rủi ro cao: cần > 0.9
    else:
        ask_user_to_confirm()
```

Quy trình tune:

1. **Bắt đầu bảo thủ** (ngưỡng cao, đẩy nhiều cho người).
2. Gắn nhãn tay 100–500 mẫu thật.
3. Vẽ: ở mỗi dải confidence, tỉ lệ đúng là bao nhiêu? (reliability diagram)
4. Hạ ngưỡng tới mức tỉ lệ sai chấp nhận được cho từng hành động.
5. **Đặt ngưỡng theo dải, không theo số chính xác** — cùng input gọi 2 lần xác suất có thể lệch nhẹ.
6. Re-tune khi đổi version model.

---

## Noul gần 0.5

`noul ≈ 0.5` = model thật sự không chắc. Đừng làm tròn thành true/false. Đó là tín hiệu để **hỏi thêm** hoặc **leo thang** (người, hoặc LLM reasoning).

---

## Tự kiểm tra

1. Choice 4 option, p_max = 0.55. Confidence bao nhiêu? (đáp: (0.55 − 0.25)/0.75 = 0.4)
2. Noul p = 0.15. Model đang "chắc" hay "không chắc"? Chắc về điều gì?
3. Vì sao không nên dùng chung một ngưỡng 0.8 cho mọi hành động?
