Khi hệ thống gặp sự cố bạn có đúng 2 lựa chọn. Đoán mò or đọc log. Senior chọn log
![[Pasted image 20260327133622.png]]

> [!quote] 💬
> *"You can't fix what you can't see."*
> Logging không phải viết cho máy đọc — mà viết cho **con người lúc 3h sáng** đọc.

---

## 🎯 Log để trả lời được câu hỏi gì?
Trước khi log, hỏi: **"Khi có bug lúc 3h sáng, mình cần biết gì để fix?"**
Mỗi dòng log phải giúp trả lời ít nhất 1 trong các câu hỏi:
- 👤 **Ai** gây ra? (user nào, service nào)
- ⚡ **Làm gì?** (action gì, API nào)
- 📦 **Với dữ liệu gì?** (input, params chính)
- ✅❌ **Kết quả ra sao?** (success/fail, response code, error message)
- 🕐 **Khi nào?** (timestamp)
- 📍 **Ở đâu trong hệ thống?** (service, function, line)

> [!tip] 💡
> Nếu dòng log không trả lời được câu nào ở trên → xem lại có cần không.

---

## 👑 Context là vua

> [!quote] 💬
> *"A log without context is like a crime scene without evidence."*
> Log mà thiếu context giống như hiện trường vụ án mà không có bằng chứng — biết có chuyện xảy ra nhưng không biết ai làm, làm gì, ở đâu.

Log mà thiếu context thì vô dụng. So sánh:
```
// ❌ Bad - không biết của ai, order nào
logger.error("Payment failed")

// ✅ Good - biết ngay user nào, order nào, lỗi gì
logger.error("Payment failed", {
  userId: "u_123",
  orderId: "ord_456",
  amount: 50000,
  gateway: "stripe",
  error: "card_declined"
})
```

> [!note] 📝 So sánh dễ hiểu
> Log thiếu context giống như gọi 115 nói *"có người bị thương"* rồi cúp máy.
> Log đủ context giống như nói *"nam, 30 tuổi, gãy chân phải, tại 123 Nguyễn Huệ, Q1"* — người ta biết mang gì đến ngay.

### 📋 Context tối thiểu cần có

| Context | Tại sao cần |
|---|---|
| 🔗 **Request ID / Correlation ID** | Trace 1 request xuyên suốt nhiều service |
| 👤 **User ID** | Biết ai bị ảnh hưởng, reproduce được |
| 🏷️ **Resource ID** | Order, payment, product... đang thao tác trên cái gì |
| ⚙️ **Action / Operation** | Đang làm gì: create, update, delete, sync... |
| 🕐 **Timestamp** | Sắp xếp theo thời gian, tính duration |

### 🔗 Correlation ID — xâu chuỗi sự kiện
Khi 1 request đi qua nhiều service, không có correlation ID thì log mỗi service 1 nơi, **không biết liên quan nhau thế nào**.

> [!note] 📝 So sánh dễ hiểu
> Correlation ID giống như **số vận đơn** khi gửi hàng — dù hàng đi qua bao nhiêu kho, trạm trung chuyển, chỉ cần 1 mã là track được toàn bộ hành trình.

```
// Request vào -> gắn correlationId
const correlationId = req.headers['x-correlation-id'] || uuid()

// Mọi log trong request đó đều mang theo
logger.info("Order created", { correlationId, orderId })
// Service khác nhận event cũng giữ lại
logger.info("Payment processing", { correlationId, orderId })
// 🔍 Giờ search correlationId là ra toàn bộ flow
```

---

## 🗺️ Xác định yêu cầu trước khi log

> [!warning] ⚠️
> Không phải cái gì cũng cần log. **Log quá nhiều thì noise, log quá ít thì mù.**
> Giống như camera an ninh — lắp quá nhiều thì không ai ngồi xem hết, lắp quá ít thì đúng chỗ cần lại không có.

### 1️⃣ Liệt kê các flow chính của hệ thống
Ví dụ e-commerce: `đăng ký → đặt hàng → thanh toán → giao hàng`

### 2️⃣ Với mỗi flow, hỏi: "Cái gì có thể sai?"
- 💳 Thanh toán: gateway timeout, card declined, số tiền sai
- 🚚 Giao hàng: API vận chuyển lỗi, webhook không nhận được

### 3️⃣ Log ở các điểm quyết định
- 🚪 **Entry/Exit** — của flow quan trọng (bắt đầu thanh toán, hoàn thành thanh toán)
- 🔀 **Branching** — khi hệ thống đưa ra quyết định (retry, fallback, skip)
- 💥 **Failure** — mọi error, nhưng kèm đủ context để reproduce
- 🔄 **State change** — dữ liệu thay đổi trạng thái (`pending → paid`)

> [!tip] 💡
> Nếu bạn vẽ flowchart của hệ thống, **mỗi hình thoi (decision) và mỗi điểm nối giữa 2 service** đều nên có log.

---

## 🚦 Log Level — dùng đúng

| Level | Khi nào | Ví dụ |
|---|---|---|
| 🔍 **DEBUG** | Chi tiết kỹ thuật, chỉ bật khi cần debug | Query SQL, request payload đầy đủ |
| ℹ️ **INFO** | Flow chạy bình thường, các sự kiện business | User đăng nhập, order tạo thành công |
| ⚠️ **WARN** | Chưa lỗi nhưng bất thường, có thể thành lỗi | Retry lần 2, response chậm, disk gần đầy |
| 🔴 **ERROR** | Lỗi thật, cần xử lý | Payment failed, API timeout, unhandled exception |

> [!note] 📝 So sánh dễ hiểu
> - **DEBUG** = ghi chép chi tiết trong sổ tay cá nhân
> - **INFO** = báo cáo cuối ngày cho sếp
> - **WARN** = đèn vàng — chưa phải dừng nhưng cần chú ý
> - **ERROR** = chuông báo cháy — phải xử lý ngay

> [!tip] 💡 Rule of thumb
> **Production nên chạy INFO trở lên. DEBUG chỉ bật khi đang điều tra.**

---

## 🚫 Không log gì?
- 🔐 **Password, token, secret** → bị lộ log là bị lộ hết
- 🛡️ **Dữ liệu cá nhân không cần thiết** (số CMND, số thẻ đầy đủ) → vi phạm privacy
- 📏 **Request/response body quá lớn** → tốn storage, chậm search
- 🔁 **Log trong vòng lặp lớn** → 1 triệu iteration = 1 triệu dòng log

> [!danger] ⛔
> `logger.info("Processing item", { item })` bên trong `for (100k items)` = tự DDoS hệ thống logging của chính mình.

---

## ✅ Checklist khi thêm log
- [ ] Dòng log này trả lời được câu hỏi gì khi debug?
- [ ] Có đủ context không? (who, what, which resource)
- [ ] Có correlation ID để trace không?
- [ ] Log level có đúng không?
- [ ] Có vô tình log sensitive data không?
- [ ] Nếu flow này lỗi lúc 3h sáng, đọc log này có fix được không?

> [!quote] 💬
> *"The best time to add good logging was when writing the code. The second best time is now."*
> Logging tốt nhất là lúc viết code. Tốt nhì là bây giờ — đừng đợi đến khi production cháy mới thêm.
