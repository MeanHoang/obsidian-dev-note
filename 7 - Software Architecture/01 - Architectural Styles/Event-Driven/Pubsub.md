**Pub/Sub (Publish–Subscribe)** là một **mô hình giao tiếp bất đồng bộ** rất phổ biến trong hệ thống phần mềm phân tán.
---
## 1. Pub/Sub là gì?
Pub/Sub gồm 3 thành phần chính:
1. **Publisher (Người phát)**  
    → Gửi (publish) message/sự kiện
2. **Subscriber (Người nhận)**  
    → Đăng ký (subscribe) để nhận message
3. **Broker / Message Bus**  
    → Trung gian nhận message từ publisher và phân phối cho subscriber
📌 **Publisher và Subscriber không biết nhau trực tiếp** → hệ thống **loose coupling** (kết nối lỏng).
---
## 2. Cách hoạt động
1. Subscriber **subscribe** vào một **topic**
2. Publisher **publish** message lên topic đó
3. Broker gửi message cho **tất cả subscriber** đã đăng ký topic
```
Publisher → Topic → Subscriber A
                   → Subscriber B
                   → Subscriber C
```

---
## 3. Ví dụ đời thực
🔔 **Thông báo YouTube**
- YouTube channel = Publisher
- Video mới = Message
- Người theo dõi = Subscriber
- Hệ thống thông báo = Broker
---
## 4. So sánh Pub/Sub vs Request–Response

|Tiêu chí|Pub/Sub|Request–Response|
|---|---|---|
|Kiểu giao tiếp|Bất đồng bộ|Đồng bộ|
|Kết nối|Lỏng|Chặt|
|1 gửi – nhiều nhận|✅|❌|
|Khả năng mở rộng|Rất tốt|Kém hơn|

## 6. Pub/Sub dùng ở đâu?
- Microservices
- Realtime app (chat, notification)
- Event-driven system
- Logging, analytics
- Message queue
---

## 7. Công nghệ phổ biến dùng Pub/Sub

- **Redis Pub/Sub**
- **RabbitMQ**
- **Kafka**
- **Google Cloud Pub/Sub**
- **AWS SNS / SQS**
- **Socket.io (gần giống)**
---
## 8. Khi nào nên dùng Pub/Sub?

✅ Khi:
- Cần mở rộng hệ thống
- Nhiều service phản ứng cùng 1 sự kiện
- Không muốn các module phụ thuộc chặt

❌ Không nên dùng khi:
- Cần phản hồi ngay lập tức
- Logic đơn giản