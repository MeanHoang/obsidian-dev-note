Hệ thống của bạn không lỗi, nhưng người dùng vẫn đi. Vì với họ, chậm = không dùng được
![[Pasted image 20260326133322.png]]
**Latency Thinking** là một kiểu tư duy rất “pro” trong backend & system design — và nó liên quan cực mạnh tới cái bạn đang học (API, DB, distributed system).

---
## 🧠 Latency Thinking là gì?
👉 **Latency Thinking = luôn suy nghĩ về độ trễ (latency) của từng bước trong hệ thống**
Không chỉ hỏi:
“Chạy đúng chưa?”
Mà hỏi:
“Chạy mất bao lâu? bottleneck nằm ở đâu?”

---
## ⚡ Ví dụ cực dễ hiểu (dev backend)
### API đơn giản:
Client → API → DB → Response
![[Pasted image 20260326133607.png]]
### ❌ Không có Latency Thinking:
- “API chạy ok rồi”
- Không quan tâm mất 50ms hay 2s
---
### ✅ Có Latency Thinking:
Bạn sẽ breakdown:

|Step|Latency|
|---|---|
|Network (client → server)|50ms|
|Server xử lý|20ms|
|DB query|300ms ❗|
|Response|50ms|

👉 Nhìn phát biết ngay:> **DB là bottleneck**

---
## 🔥 Insight quan trọng
### 1. **Latency cộng dồn**
Total latency = sum(all steps)
👉 5 step × 100ms = 500ms (chậm rõ)

---
### 2. **Network luôn đắt**
- Call API ngoài → 100ms – 1000ms
- Gọi trong RAM → ~1ms
👉 Vì vậy:
- Cache > DB > external API

---
### 3. **N+1 problem (cực phổ biến)**
```js
for (user of users) {  
  await getPosts(user.id) // mỗi lần gọi DB  
}
```
👉 100 users = 100 queries  
=> latency x100 💀

---
### 4. **Parallel vs Sequential**
❌ Sequential:
```js
await A()  
await B()  
await C()
```

✅ Parallel:
```js
await Promise.all([A(), B(), C()])
```

👉 Giảm latency cực mạnh

---
👉 **Bottleneck (nút thắt cổ chai) hiếm khi chỉ đến từ code.**  
Thực tế, code chỉ là _1 phần nhỏ_ trong toàn bộ hệ thống.