Hệ thống chạy dúng không khó. Khó là làm sao để nó vẫn chạy khi mọi thử đầu đầy hỏng
**Failure-first thinking** (tư duy bắt đầu từ thất bại) là cách bạn **thiết kế hệ thống bằng cách giả định trước nó sẽ hỏng**, rồi từ đó xây dựng để **chịu lỗi tốt hơn, recover tốt hơn**.
## 🔥 Hiểu đơn giản
Thay vì hỏi: =>“Làm sao để hệ thống chạy tốt?”
Bạn hỏi: =>“Hệ thống sẽ hỏng ở đâu? Khi hỏng thì chuyện gì xảy ra?”
👉 Đây là mindset cực kỳ quan trọng trong backend, system design, distributed systems.
 Code không bao giờ là happy case. Việc mình cần là sẵn sàng với mọi lỗi có thể xảy ra. Nhưng đây không phải tư duy bi quan mà là tư duy để hệ thống ổn nhất cho dù có lỗi xảy ra để tránh dẫn đến những hậu quả nặng nề
 
---
## 🧠 Core idea
Failure-first thinking =  
**Design for failure, not for success**
Vì:
- Trong thực tế:
    - network sẽ timeout
    - DB sẽ down
    - API bên thứ 3 sẽ fail
    - user spam request
- => **failure là default**, success mới là "trường hợp may mắn"
---
## ⚙️ Ví dụ thực tế (rất sát dev)

### ❌ Cách nghĩ bình thường
```js
const data = await callPaymentAPI();
saveToDB(data);
```
👉 assume:
- API luôn trả về
- DB luôn OK
### ✅ Failure-first thinking
```js
try {
  const data = await retry(callPaymentAPI, 3);
  await saveToDB(data);
} catch (err) {
  logError(err);
  sendToQueueForRetry(data);
}
```
👉 bạn đã nghĩ trước:
- API fail → retry
- DB fail → queue lại
- log để debug

---

![[Pasted image 20260326144231.png]]
## ⏱️ 1. Timeout
**Mô tả:**
- API bên ngoài chậm → request treo → thread bị giữ → hệ thống nghẽn
**Nguy hiểm ở chỗ:**
- 1 request chậm → giữ resource → nhiều request → chết cả service
**Cách xử lý:**
- Luôn set timeout (đừng để default)
- Retry có kiểm soát
- Fallback nếu cần
## 🔁 2. Bão Retry (Retry Storm)
**Mô tả:**
- Retry không kiểm soát → request nhân lên
**Ví dụ:**
- 1 request fail → retry 3 lần  
    → 1000 user = 3000 request 😵
**Nguy hiểm:**
- Tự DDoS chính hệ thống mình
**Cách xử lý:**
- Exponential backoff (1s → 2s → 4s)
- Giới hạn số lần retry
- Circuit breaker (fail nhanh luôn)
## 🚧 3. Nghẽn Queue
**Mô tả:**
- Queue xử lý không kịp → job bị delay
**Ví dụ:**
- Order queue backlog 10k job → user đợi lâu
**Nguy hiểm:**
- Delay lan rộng → domino effect toàn hệ thống
**Cách xử lý:**
- Scale worker
- Dead-letter queue
- Monitor queue length
## 💥 4. Lỗi cục bộ (Partial Failure)
**Mô tả:**
- 1 service con chết → kéo theo cả flow chết
**Ví dụ:**
- Payment OK nhưng email service chết → flow fail
**Nguy hiểm:**
- Distributed system → fail 1 chỗ là fail dây chuyền
**Cách xử lý:**
- Tách nhỏ service
- Retry riêng từng bước
- Graceful degradation (cho phép fail 1 phần)
## 🌐 5. Lỗi mạng (Network Issue)
**Mô tả:**
- Mất gói tin, latency cao, network chập chờn
**Ví dụ:**
- API lúc gọi được lúc không
**Nguy hiểm:**
- Khó debug nhất (vì random)
**Cách xử lý:**
- Retry + timeout
- Idempotency (tránh xử lý trùng)
- Health check
## 🗄️ 6. Quá tải Database
**Mô tả:**
- DB chịu không nổi load
**Ví dụ:**
- Cache miss hàng loạt → tất cả query dồn vào DB
**Nguy hiểm:**
- DB chết = hệ thống chết
**Cách xử lý:**
- Cache (Redis)
- Read replica
- Optimize query + index
- Rate limit
---
## 🧠 Insight quan trọng (cái hình đang muốn nói)
👉 Không phải cover mọi điều đúng mà hãy để mọi thứ đều sai nhưng hệ thống không chết
👉 Thiết kế trải nghiệm lỗi cho hệ thống 


