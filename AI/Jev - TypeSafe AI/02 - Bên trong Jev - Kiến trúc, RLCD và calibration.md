---
tags:
  - ai
  - jev
  - calibration
  - reinforcement-learning
---

# 02 — Bên trong Jev: kiến trúc, RLCD và calibration

[[01 - Jev là gì - System One vs System Two|← Trước]] · [[00 - README|Mục lục]] · [[03 - API - State, Questions và 3 primitive|Tiếp →]]

> TypeSafe công bố rất ít chi tiết kỹ thuật (không paper, không số tham số). Note này chỉ ghi những gì họ đã nói + phần giải thích nền để hiểu vì sao nó hoạt động.

---

## Ba thành phần TypeSafe công bố

```
 ┌───────────────────────┐   ┌──────────────────┐   ┌──────────────────────────┐
 │ Kiến trúc model mới   │ + │ Parallel sampler │ + │ RLCD (cách train)        │
 │ (không phải LLM chat) │   │ sinh mọi output  │   │ Reinforcement Learning   │
 │ input: program state  │   │ trong 1 lượt     │   │ for Calibrated Decisions │
 └───────────────────────┘   └──────────────────┘   └──────────────────────────┘
```

### 1. Parallel sampler — vì sao nhanh

LLM sinh **từng token một** (autoregressive): muốn trả `{"department":"technical"}` phải chạy model khoảng 10 lần nối tiếp. Thêm reasoning thì hàng nghìn lần.

Jev **sinh toàn bộ output trong một lượt truy vấn**. Mỗi câu hỏi được đánh giá **song song và độc lập** trên cùng state → thêm câu hỏi gần như không tăng latency.

> 🧠 **Cách nhớ:** LLM như người viết câu trả lời ra giấy từng chữ. Jev như người giơ tay chọn A/B/C — một động tác là xong, và giơ 5 tay cùng lúc cho 5 câu hỏi.

### 2. Input là *program state*, không phải hội thoại

LLM chat được tối ưu cho chuỗi message (user/assistant). Jev được tối ưu cho **state của chương trình**: một object JSON, một ticket, một bản ghi đơn hàng. Đây là thứ code của mình đang có sẵn — không cần dựng prompt hội thoại.

### 3. RLCD — train cho cái gì

So sánh mục tiêu tối ưu:

| Cách train | Model được thưởng khi | Hệ quả |
|---|---|---|
| RLHF (ChatGPT) | Người thích câu trả lời | Văn hay, tự tin — kể cả khi sai |
| RLVR (model reasoning) | Đáp án kiểm được là đúng | Giỏi toán/code |
| **RLCD (Jev)** | **Xác suất nói ra khớp tần suất đúng thật** | *"Epistemically honest probabilities"* — biết mình không chắc |

> 💡 **Ý là:** RLHF dạy model *làm người ta hài lòng*, nên LLM hay tự tin sai. RLCD dạy model *nói thật về độ chắc chắn*. Đây là điểm khác biệt gốc nhất, không phải tốc độ.

---

## Calibration là gì (phải hiểu kỹ)

Một model **calibrated** khi: trong tất cả lần nó nói "80% chắc", nó đúng khoảng 80%.

```
Nhóm các câu trả lời theo xác suất model đưa ra:

  xác suất nói ra   │ tỉ lệ đúng thật   │ đánh giá
  ──────────────────┼───────────────────┼──────────────────
  0.9 – 1.0         │ ~95%              │ ✅ calibrated
  0.7 – 0.8         │ ~75%              │ ✅
  0.5 – 0.6         │ ~55%              │ ✅
  ──────────────────┼───────────────────┼──────────────────
  LLM điển hình:    │                   │
  "chắc chắn 95%"   │ đúng 70%          │ ❌ overconfident
```

Ba điều hay bị hiểu nhầm:

1. **Calibration đo trên nhóm, không đo từng câu.** Một câu 0.95 vẫn có thể sai. Docs nói rõ: calibration *"doesn't guarantee that any single answer is correct."*
2. **Calibrated ≠ chính xác.** Model đoán bừa nhưng luôn nói "50%" trên bài nhị phân cân bằng thì vẫn calibrated — chỉ là vô dụng. Cần cả hai: đúng nhiều *và* biết khi nào không chắc.
3. **Calibration chung ≠ calibration trên data của mình.** Domain lạ (thuật ngữ nội bộ, tiếng Việt lóng…) có thể lệch. Phải tự đo — xem [[09 - Lab - Tự build ticket router]].

Thêm một tính chất TypeSafe nhấn mạnh: **input giống nhau → câu trả lời nhất quán**. Nhưng xác suất vẫn dao động nhẹ giữa các lần gọi giống hệt, nên đặt ngưỡng theo *dải* chứ đừng so bằng.

---

## Về khả năng chọn nhiều phương án

- Choice hỗ trợ tới **255 lựa chọn**.
- Quá một mức nhất định, Jev chuyển sang **chấm điểm 2 giai đoạn** (lọc rồi chọn) → đôi khi chậm hơn. Ví dụ demo Wikiracing: chọn link trong hàng trăm–hàng nghìn link.

---

## Tự kiểm tra

1. Vì sao thêm 5 câu hỏi vào 1 request Jev gần như không tăng latency, còn với LLM thì có?
2. Một model luôn nói 0.99 và đúng 99% — calibrated không? Một model luôn nói 0.99 và đúng 80%?
