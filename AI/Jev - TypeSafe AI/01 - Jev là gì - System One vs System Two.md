---
tags:
  - ai
  - jev
  - system-one
---

# 01 — Jev là gì: System One vs System Two

[[00 - README|Mục lục]] · [[02 - Bên trong Jev - Kiến trúc, RLCD và calibration|Tiếp →]]

---

## Bài toán Jev giải

Trong app thật, phần lớn chỗ gọi LLM **không cần văn**. Mình chỉ cần:

- ticket này thuộc team nào? → enum
- review này tiêu cực cỡ nào? → số
- prompt này có phải jailbreak không? → boolean

Nhưng LLM sinh **chuỗi**, nên quy trình luôn là:

```
prompt → LLM sinh text (chậm, từng token) → parse JSON → validate → retry nếu sai → dùng
```

Mỗi bước là một chỗ có thể vỡ: JSON hỏng, enum lạ (`"Technical "` thay vì `"technical"`), trả lời kèm giải thích, tốn 2–10 giây và tiền output token.

Jev cắt hết đoạn giữa:

```
state + typed questions → Jev → typed answers + probabilities → dùng luôn
```

TypeSafe gọi đây là *"a frontier-intelligence function call: unstructured state in, typed probabilistic decisions out"* — **một lời gọi hàm có trí thông minh**: input lộn xộn vào, quyết định có kiểu ra.

---

## Vì sao tên là "System One"

Lấy từ sách *Thinking, Fast and Slow* của Daniel Kahneman:

| | System 1 | System 2 |
|---|---|---|
| Kiểu nghĩ | Nhanh, trực giác, tự động | Chậm, có chủ đích, từng bước |
| Ví dụ ở người | Nhìn mặt biết đang giận; đọc biển "STOP" | Tính 17 × 24; điền tờ khai thuế |
| Tương ứng AI | **Jev** — trả quyết định trong 70–500 ms | **LLM reasoning** — chain of thought, viết code |

> 💡 **Ý là:** LLM hiện nay bị dùng cho cả hai loại việc. Dùng LLM reasoning để phân loại một email giống thuê kỹ sư trưởng để phân loại thư — được, nhưng đắt và chậm. Jev là "nhân viên phân loại" chuyên làm System 1.

---

## Đổi cái gì lấy cái gì

| Bỏ đi | Được lại |
|---|---|
| Sinh text, code, giải thích | **Không thể có type error** (theo thiết kế, 0%) |
| Chat nhiều lượt, tool call | **Nhanh 40–200×** so với frontier LLM trên việc kiểu System 1 (số của TypeSafe) |
| Chain of thought | **Xác suất có calibration** cho mọi câu trả lời |
| | Giá input $0.042/1M token, output $0 |

Câu đáng nhớ trong blog: *"While Jev gives up string generation, it's optimized for structured outputs and **can't** hallucinate."*

> ⚠️ "Can't hallucinate" ở đây nghĩa hẹp: nó không bịa **chuỗi** và không trả về giá trị ngoài tập đã định. Nó **vẫn có thể chọn sai**. Khác biệt là khi nó không chắc, xác suất sẽ cho mình biết (xem [[04 - Confidence - Đọc xác suất và đặt ngưỡng]]).

---

## Ai làm

- **TypeSafe AI**, founder **Diogo Almeida**, trước ở OpenAI làm nghiên cứu RLHF (cho model biết làm theo chỉ dẫn — nền của ChatGPT). OpenRouter ghi thêm co-founder Erik Gafni và Sasha Sheng.
- Early access 15/09/2026, GA 20/09/2026. Bản hiện tại: **Jev 1.13**.
- **Closed model**: không public weights, không có paper. Chỉ dùng qua API.

---

## Tự kiểm tra

1. Một chỗ trong code của mình đang gọi LLM rồi `JSON.parse` để lấy 1 enum — đó có phải việc System 1 không?
2. Vì sao "không sinh text" lại làm model **nhanh hơn** về bản chất? (gợi ý: LLM sinh từng token tuần tự, Jev sinh mọi output trong một lượt — xem file 02)
