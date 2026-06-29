# ✅ Checklist phân tích Feature (7 bước)

> In ra, dán bàn. Mỗi khi nhận 1 yêu cầu tính năng, chạy qua 7 câu hỏi này **trước khi code**.

```
1. WHY   — Vấn đề gì? Của ai? Bằng chứng nào nó tồn tại?
2. VALUE — Giải quyết xong thì user/business được gì? Đo bằng metric nào?
3. SCOPE — Đâu là happy path tối thiểu chứng minh được giá trị? (MVP)
4. CASES — Edge case, empty state, error, quyền hạn, concurrency?
5. RULES — Business rule nào? Ai được làm gì? Khi nào hợp lệ?
6. WHERE — Logic đặt ở đâu? (DB constraint / domain / service / UI)
7. DONE  — Định nghĩa "xong": acceptance criteria + cách verify giá trị.
```

## Giải thích từng bước

### 1. WHY — Tại sao cần làm?
- Vấn đề thật sự là gì? (không phải solution được yêu cầu)
- User nào gặp? Họ đang làm gì khi gặp vấn đề này?
- **Bằng chứng:** support ticket? user interview? data? hay chỉ là "sếp nghĩ vậy"?
> ⚠️ Nếu không có bằng chứng vấn đề tồn tại → cảnh báo đỏ.

### 2. VALUE — Tạo ra giá trị gì?
- User/business được gì cụ thể? (tiết kiệm thời gian? tiền? giảm lỗi?)
- **Metric thành công** là gì? (activation, retention, churn, số ticket support...)
- Dùng [[06 - Frameworks|RICE]] để cân nhắc có đáng làm không.

### 3. SCOPE — MVP là gì?
- Happy path **tối thiểu** chứng minh được giá trị?
- Phân loại [[06 - Frameworks|MoSCoW]]: Must / Should / Could / Won't
- Liệt kê rõ **Non-goals** (cái KHÔNG làm trong version này) — quan trọng ngang must-have.

### 4. CASES — Cần cover case nào?
Checklist nhanh:
- [ ] Empty state (chưa có data)
- [ ] Error state (API fail, mất mạng)
- [ ] Quá tải (list 100k dòng → cần phân trang / async?)
- [ ] Phân quyền (ai được thấy/làm?)
- [ ] Concurrency (2 người sửa cùng lúc)
- [ ] Format / locale (số, tiền, ngày, ký tự đặc biệt)
- [ ] Idempotency (bấm 2 lần thì sao?)

### 5. RULES — Business rule nào?
- Ai được làm gì? (role / permission)
- Khi nào một hành động hợp lệ? (vd: không hủy đơn đã giao)
- Có cần **audit log** cho hành động nhạy cảm không?
- Rule nên là **invariant** (luôn đúng) — đặt ở tầng nào để không bị bypass? → bước 6

### 6. WHERE — Đặt logic ở đâu?
Thứ tự ưu tiên cho rule "phải luôn đúng":

| Tầng | Dùng cho |
|---|---|
| **DB constraint** | Bất biến tuyệt đối (unique, not null, FK) |
| **Domain / Model** | Business rule cốt lõi, tái dùng mọi nơi |
| **Service / Use-case** | Orchestration, transaction, gọi nhiều domain |
| **Controller / API** | Validate input, auth, mapping |
| **UI** | UX (disable nút) — KHÔNG bao giờ là nơi duy nhất giữ rule |

> Nguyên tắc: rule càng quan trọng → đặt càng sâu, càng gần data.
> UI chỉ là *lớp tiện lợi*, không phải lớp bảo vệ.

### 7. DONE — Làm sao biết đã hoàn thiện?
- **Acceptance criteria** viết theo dạng: *"Given... When... Then..."*
- Verify được **outcome** chứ không chỉ "code chạy":
  *Ví dụ: kế toán thực sự bỏ được thao tác copy tay, không chỉ "nút export hiện ra".*
- Đã cover các case ở bước 4 chưa?

Liên quan: [[01 - Mindset]] · [[05 - Ví dụ thực tế]] · [[06 - Frameworks]]
