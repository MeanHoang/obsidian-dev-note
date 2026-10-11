---
tags:
  - ai
  - jev
  - llm
  - decision
---

# 06 — Jev vs LLM: khi nào dùng cái nào

[[05 - Patterns - 4 kiến trúc chuẩn|← Trước]] · [[00 - README|Mục lục]] · [[07 - Ứng dụng thực tế|Tiếp →]]

---

## Câu hỏi quyết định duy nhất

> **Output mà code cần là gì?**
> - Văn / code / tóm tắt → **LLM**
> - Enum / boolean / số mà code `if` được → **Jev**
> - Phép tính, so sánh, regex, lookup DB → **code thường** (không dùng AI)

---

## Bảng so sánh

| | Jev | LLM (frontier) |
|---|---|---|
| Output | Choice / Score / Noul | Text bất kỳ |
| Latency | 70–500 ms | 1–30 s (có reasoning còn lâu hơn) |
| Giá | $0.042/1M input, output $0 | $0.20–$10/1M input, output ~5× |
| Type error | 0% (thiết kế) | Phải parse + validate + retry |
| Độ chắc chắn | Xác suất calibrated cho mỗi câu | Không có (hoặc tự khai, không đáng tin) |
| Giải thích lý do | ❌ | ✅ |
| Tool call, multi-step, chat | ❌ | ✅ |
| Ảnh / audio | ❌ (chưa) | ✅ (nhiều model) |
| Tính toán chính xác, so ngày | ❌ | Tạm được, nên dùng code |
| Kiến thức thời sự | ❌ — app phải đưa vào `state` | Có tới cutoff / có search |

---

## Flowchart

```
                 Cần output dạng gì?
                        │
        ┌───────────────┼──────────────────┐
     văn/code      enum/bool/số        tính toán/luật cứng
        │               │                  │
       LLM         Input là ảnh?         code / regex / SQL
                    ├─ có → LLM vision
                    └─ không
                        │
                   Cần lý do giải thích cho người dùng?
                    ├─ có → LLM (hoặc Jev quyết + LLM viết lý do)
                    └─ không → Jev ✅
```

---

## Kết hợp: Jev route & verify, LLM viết

Hầu hết pipeline thật dùng **cả hai**:

```
              ┌──────── Jev: phân loại / route ────────┐
 input ──────►│                                         │
              └──────────────┬──────────────────────────┘
                             ▼
                    LLM: viết phản hồi / code
                             │
              ┌──────────────▼──────────────────────────┐
              │ Jev: verify output với policy (Noul)    │──► đạt → gửi
              └─────────────────────────────────────────┘    không → sửa / người
```

### Jev làm LLM-as-a-judge

Hiện nay nhiều team dùng một LLM để chấm output của LLM khác (eval, guardrail). Jev hợp vai này hơn:

| LLM-as-judge | Jev as judge |
|---|---|
| Chậm → khó chạy inline mỗi request | 100 ms → chạy mọi request được |
| Đắt → thường chỉ sample 1–5% | Rẻ → chấm 100% |
| Điểm 1–10 tự khai, hay dồn về 7–8 | Phân phối xác suất trên thang mình định nghĩa |
| Phải parse | Có kiểu |

---

## Khi nào KHÔNG nên dùng Jev

- Logic **deterministic** được → regex, lookup DB rẻ hơn, chắc hơn.
- Câu trả lời cần **giải thích** (khiếu nại, pháp lý) → LLM.
- Input là **ảnh** (ảnh sản phẩm, hoá đơn chụp) → model vision.
- Volume quá nhỏ (vài chục call/ngày) → lợi ích tốc độ/giá không đáng công tích hợp thêm một provider; LLM + structured output là đủ.

---

## LLM giả lập Jev: System One adapter

TypeSafe open-source `system-one-adapter-python` — wrapper ép LLM bất kỳ trả về đúng format System One. Dùng để:

- **So sánh** Jev với GPT/Claude trên cùng bộ câu hỏi, cùng code.
- **Fallback** khi Jev down: đổi backend, code không đổi.
