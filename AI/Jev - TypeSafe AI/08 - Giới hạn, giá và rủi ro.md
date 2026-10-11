---
tags:
  - ai
  - jev
  - pricing
  - risk
---

# 08 — Giới hạn, giá và rủi ro

[[07 - Ứng dụng thực tế|← Trước]] · [[00 - README|Mục lục]] · [[09 - Lab - Tự build ticket router|Tiếp →]]

---

## Jev KHÔNG làm được

- ❌ Sinh text, code, lý do, chain of thought
- ❌ Chat nhiều lượt, tool call, lập kế hoạch nhiều bước
- ❌ Ảnh, audio, video (text only)
- ❌ Số học chính xác, tính ngày, so ngưỡng (`amount > 500`) → **tính bằng code trước, đưa kết quả vào state**
- ❌ Kiến thức thời sự / tự lấy data → app phải đưa vào state
- ❌ Self-host: closed weights, không paper

---

## Tính tiền

| | Giá |
|---|---|
| Input | **$0.042 / 1M token** |
| Output | **$0** ("too cheap to meter") |

Ví dụ từ OpenRouter: 1 call 3 câu hỏi, 447 input token ≈ **$0.000019**. 1 triệu ticket ≈ **$19**.

Kiểm tra lại demo Doom: ~10 query/s = 36.000 query/giờ, $7/giờ → ~$0.00019/query → ~4.600 token state mỗi query. Hợp lý cho state game dạng text.

Bảng nhẩm nhanh:

| Volume / tháng | Token TB / call | Chi phí |
|---|---|---|
| 10.000 | 500 | $0.21 |
| 1.000.000 | 500 | $21 |
| 10.000.000 | 2.000 | $840 |

> ⚠️ TypeSafe tự nói: họ **không chứng minh được giá không được trợ giá** (có thể đang đốt tiền để chiếm thị phần). Đừng xây business model chỉ đúng ở mức giá này.

---

## Đọc benchmark có phê phán

Những con số TypeSafe đưa ra:

- **Nhanh hơn 193.6×, rẻ hơn 444.6×** trung bình trên "workflow evals"
- Giữ **Pareto frontier** (tốt nhất ở mọi mức chi phí) gần 2 bậc độ lớn
- So side-by-side với GPT-5.6 Terra: chỉ lệch ở 1 câu ("Churn likelihood level") mà họ cho là vốn mơ hồ

Những điểm chính TypeSafe thừa nhận:

| Điểm yếu | Ảnh hưởng |
|---|---|
| Workflow eval do **team họ tự viết** | Có thể chọn bài có lợi |
| "Đáp án chuẩn" = trung bình xác suất của GPT-6 Astra + Fable 5.1 | Đo mức **giống LLM**, không đo mức **đúng với thực tế** |
| Số nhanh/rẻ trên homepage là **mức cao** | Thực tế có thể thấp hơn |
| Speed test chạy từ laptop ở West Coast | Từ Việt Nam latency mạng sẽ cộng thêm |
| Wikiracing: lợi ít hơn vì LLM chạy non-reasoning | So với LLM không reasoning thì chênh lệch nhỏ lại |
| Type-error 0% là **theo thiết kế**, không phải đo | Đúng, nhưng không nói gì về việc chọn *sai* |

> 🧠 **Cách nhớ:** benchmark của vendor = **giới hạn trên**. Con số thật là con số mình đo trên data mình.

---

## Rủi ro khi đưa vào production

1. **Vendor lock-in / startup risk** — một công ty mới, model đóng. Giảm rủi ro: bọc qua interface riêng, có fallback bằng LLM + `system-one-adapter`.
2. **Model drift** — `jev-latest` đổi → phân phối xác suất đổi → ngưỡng lệch. Pin version, re-tune khi nâng.
3. **Tiếng Việt / domain riêng** — chưa thấy số liệu đánh giá tiếng Việt. **Phải tự đo**.
4. **Data privacy** — state gửi lên server TypeSafe (hoặc qua OpenRouter). Cân nhắc PII của merchant/khách.
5. **Mất khả năng giải thích** — khi khách hỏi "vì sao đơn tôi bị chặn", Jev không có lý do. Cần log các câu hỏi con (composite) để tự dựng lời giải thích.
6. **Context giới hạn** — 32K cho state. Tài liệu dài phải cắt / tóm tắt trước.

---

## Tự kiểm tra

1. Benchmark lấy LLM làm "đáp án chuẩn" thì Jev có thể *vượt* LLM về độ đúng trên benchmark đó không?
2. App của mình cần giải thích quyết định cho người dùng cuối — dùng Jev thế nào cho ổn?
