---
tags:
  - ai
  - jev
  - system-one
  - moc
source: https://typesafe.ai/blog/introducing-system-one-models-and-jev
docs: https://docs.typesafe.ai
company: TypeSafe AI
version: Jev 1.13
created: 2026-10-11
---

# Jev — TypeSafe AI (System One model)

Jev là model AI **không sinh text**. Mình đưa vào một *state* (text/JSON) và một bộ *câu hỏi có kiểu*, nó trả về **quyết định có kiểu + xác suất**: chọn 1 trong N, chấm điểm theo thang, hoặc xác suất đúng/sai. Mất 70–500 ms, input tính $0.042 / 1M token, output miễn phí.

Lần đầu thấy nó trong [[avada-digest|digest 22/09]]: GA ngày 20/09/2026, *"waitlist chỉ tồn tại 5 ngày"*, trong tuần đầu đã tích hợp Vercel AI Gateway, Cloudflare, OpenRouter, LiteLLM, Netlify.

> **Luận điểm một câu:** LLM = System 2 (chậm, viết văn, suy luận). Jev = System 1 (nhanh, trực giác, trả lời bằng enum/số). Đây là một **"if-statement có trí thông minh"**, không phải chatbot.

---

## Lộ trình đọc

| # | File | Đọc để hiểu |
|---|---|---|
| 01 | [[01 - Jev là gì - System One vs System Two]] | Khái niệm gốc, vì sao cần một loại model mới |
| 02 | [[02 - Bên trong Jev - Kiến trúc, RLCD và calibration]] | Parallel sampler, RLCD, calibration là gì |
| 03 | [[03 - API - State, Questions và 3 primitive]] | Choice / Score / Noul, request & response, SDK |
| 04 | [[04 - Confidence - Đọc xác suất và đặt ngưỡng]] | Công thức confidence, 3 dải hành động |
| 05 | [[05 - Patterns - 4 kiến trúc chuẩn]] | Fan-out, confidence-gated routing, composite score, intent routing |
| 06 | [[06 - Jev vs LLM - Khi nào dùng cái nào]] | Bảng quyết định, kết hợp Jev + LLM |
| 07 | [[07 - Ứng dụng thực tế]] | Support triage, Shopify app, gate agent, LLM-judge, map-reduce |
| 08 | [[08 - Giới hạn, giá và rủi ro]] | Những gì Jev KHÔNG làm, tính tiền, độ tin của benchmark |
| 09 | [[09 - Lab - Tự build ticket router]] | Bài thực hành từng bước |

---

## Sơ đồ tổng

```
            unstructured state (text / JSON)
                         │
                         ▼
  ┌──────────────── Jev (1 lần gọi, 70–500 ms) ────────────────┐
  │   question A: Choice  ─┐                                    │
  │   question B: Score   ─┼─ chạy SONG SONG, ĐỘC LẬP           │
  │   question C: Noul    ─┘   trên cùng một state              │
  └─────────────────────────────────────────────────────────────┘
                         │
     typed answers + probabilities + confidence (không parse)
                         │
                         ▼
          code của mình: if / switch / threshold
         ┌───────────────┼─────────────────┐
     confidence cao   trung bình       thấp
      tự động làm    xác nhận lại   người / LLM reasoning
```

---

## Ba ý đắt nhất

1. **Đổi khả năng viết lấy tốc độ + kiểu an toàn.** Jev bỏ hẳn sinh chuỗi nên không có type error, không cần parse JSON, không "bịa" văn. → [[01 - Jev là gì - System One vs System Two]]
2. **Xác suất là output chính, không phải phụ.** Giá trị thật nằm ở `confidence` — biết khi nào *được phép* tự động, khi nào phải đẩy cho người. → [[04 - Confidence - Đọc xác suất và đặt ngưỡng]]
3. **Hỏi hẹp, ghép bằng code.** Mỗi câu hỏi một yếu tố; trọng số và logic tổng hợp để ở code, chỉnh không cần sửa prompt. → [[05 - Patterns - 4 kiến trúc chuẩn]]

---

## Checklist tìm hiểu

- [ ] Tạo key ở `console.typesafe.ai` (hoặc dùng OpenRouter `typesafe/jev-1.13`)
- [ ] Chạy ví dụ quickstart Python ở [[03 - API - State, Questions và 3 primitive]]
- [ ] Tự tính tay confidence cho 2–3 phân phối ở [[04 - Confidence - Đọc xác suất và đặt ngưỡng]]
- [ ] Làm [[09 - Lab - Tự build ticket router]] với 50 ticket thật, gắn nhãn tay, đo calibration
- [ ] Chọn 1 chỗ trong app đang gọi LLM chỉ để trả enum/boolean → thử thay bằng Jev

---

## Nguồn

- Blog ra mắt: https://typesafe.ai/blog/introducing-system-one-models-and-jev
- Docs: https://docs.typesafe.ai (index: `/llms.txt`)
- OpenRouter — What is Jev: https://openrouter.ai/blog/insights/what-is-jev/
- LiteLLM pass-through: https://docs.litellm.ai/docs/pass_through/typesafe
- Evals: https://evals.typesafe.ai
- Adapter LLM → format System One: `github.com/typesafe-ai/system-one-adapter-python`

> ⚠️ `jevmodel.org`, `thejevai.com` là site **bên thứ ba**, không phải TypeSafe. Đừng nhập API key ở đó.

## Liên quan

- [[Glossary AI]]
- [[LLM Design Patterns]]
- [[Harness trong AI là gì]]
