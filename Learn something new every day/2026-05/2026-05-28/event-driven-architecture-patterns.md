# Event-Driven Architecture — Messaging Patterns

> [!quote] 💬
> *"Event-driven architecture is easy to draw on a whiteboard and hard to run in production."*
> — đúc kết chung từ các bài operational EDA (Solace, CodeOpinion)

Note này dựa trên bài 🔥 ByteByteGo *"A Guide To Event-Driven Architectural Patterns"* (14/05/2026), gom **các pattern vận hành** để EDA chạy đáng tin ở production. Khác với 4 pattern *khái niệm* của Martin Fowler (Event Notification / State Transfer / Event Sourcing / CQRS) — nhóm này trả lời câu hỏi **"làm sao để message không mất, không double, không kẹt queue?"**.

---

## 🎯 EDA đẻ ra vấn đề gì?

Khi bỏ gọi hàm trực tiếp (synchronous) để chuyển sang publish/subscribe event, bạn **được** decoupling + scale, nhưng **mất** mấy đảm bảo quen thuộc:
- **Không còn 1 transaction** bao trùm 2 service → ghi DB xong mà publish event fail thì sao?
- **Broker giao "at-least-once"** → cùng 1 event có thể tới 2-3 lần → xử lý trùng.
- **Consumer/network chết giữa chừng** → message kẹt, hoặc "poison message" làm nghẽn cả queue.
- **Không có distributed transaction** → 1 nghiệp vụ trải nhiều service, fail nửa chừng phải rollback thế nào?

5 pattern dưới đây là bộ "đồ nghề" xử lý đúng các vấn đề đó.

> [!note] 📝 So sánh dễ hiểu
> Hình dung EDA như **bưu điện** thay vì gọi điện trực tiếp:
> - **Competing Consumers** = mở thêm quầy phát thư khi đông khách
> - **Transactional Outbox** = bỏ thư vào hòm nội bộ *trong cùng lúc* ghi sổ, nhân viên gom đi gửi sau — không có cảnh "ghi sổ rồi quên gửi"
> - **Idempotent Consumer** = thư trùng tới lần 2 thì nhìn mã bưu phẩm, thấy xử lý rồi thì bỏ
> - **Dead Letter Queue** = thư sai địa chỉ gửi mãi không được → bỏ vào ngăn "thư hỏng" để xử lý riêng, không chặn dây chuyền
> - **Saga** = đặt tour gồm vé máy bay + khách sạn + xe; hủy 1 cái thì có quy trình hoàn lại từng cái

---

## 1️⃣ Competing Consumers — scale throughput

**Là gì**: Nhiều consumer cùng lắng nghe *một* queue, mỗi message chỉ 1 consumer xử lý. Đông việc → thêm consumer. Đây là cách scale ngang tự nhiên của EDA.

```js
// ❌ Bad: 1 worker xử lý tuần tự → BFCM spike là nghẽn
sub.on('message', async (msg) => {
  await awardPoints(msg);   // 1 message/lần, queue dồn ứ
  msg.ack();
});

// ✅ Good: Cloud Run nhận Pub/Sub push, auto-scale theo tải
// Mỗi instance là 1 "competing consumer", Shopify bắn 10k order → GCP tự bung instance
app.post('/orders/created', async (req, res) => {
  await awardPoints(req.body);
  res.sendStatus(204);       // ack = trả 2xx
});
```

> [!tip] 💡 Trong Joy stack: để Cloud Run scale đúng, set `maxInstances` đủ cao và bật concurrency hợp lý. Pub/Sub tự cân bằng message giữa các instance đang chạy.

---

## 2️⃣ Transactional Outbox — diệt "dual-write problem"

**Vấn đề**: Ghi DB *và* publish event là **2 thao tác riêng**. Crash ở giữa → DB đã đổi nhưng event không bao giờ bắn (hoặc ngược lại) → dữ liệu lệch vĩnh viễn.

```js
// ❌ Bad: dual write — crash sau dòng 1 là mất event
await db.collection('orders').doc(id).set(order);
await pubsub.topic('order-created').publishMessage({ json: order }); // có thể không chạy

// ✅ Good: ghi business data + "outbox" trong CÙNG 1 transaction
await db.runTransaction(async (tx) => {
  tx.set(db.collection('orders').doc(id), order);
  tx.set(db.collection('outbox').doc(), {          // event nằm chung transaction
    topic: 'order-created', payload: order, status: 'pending', at: Date.now()
  });
});
// Một Firestore trigger / Cloud Function riêng đọc outbox → publish → đánh dấu 'sent'
```

> [!note] 📝 Với Firestore, **Firestore trigger chính là một dạng Change Data Capture (CDC)** — biến thể của Outbox: bạn chỉ ghi data, trigger tự bắn event từ thay đổi document, khỏi cần bảng outbox thủ công.

> [!warning] ⚠️ Nhớ dọn outbox đã gửi (TTL / xóa định kỳ) kẻo collection phình to.

---

## 3️⃣ Idempotent Consumer — xử lý message trùng

**Vấn đề**: Broker giao **at-least-once** → cùng event tới 2 lần. Nếu handler có side-effect (cộng điểm, trừ kho) thì chạy 2 lần = sai.

```js
// ❌ Bad: cộng điểm mỗi lần nhận → khách được x2, x3 điểm
await awardPoints(userId, 100);

// ✅ Good: chốt theo messageId/eventId đã xử lý
const seenRef = db.collection('processed_events').doc(eventId);
await db.runTransaction(async (tx) => {
  if ((await tx.get(seenRef)).exists) return;   // đã xử lý → bỏ qua
  tx.set(seenRef, { at: Date.now() });
  // ... cộng điểm trong cùng transaction
});
```

> [!tip] 💡 "Idempotency key" tốt nhất là khóa nghiệp vụ (vd `orderId`), không phải messageId — vì retry có thể đổi messageId nhưng order vẫn là một.

---

## 4️⃣ Dead Letter Queue (DLQ) — chặn "poison message"

**Vấn đề**: 1 message lỗi vĩnh viễn (payload hỏng) bị retry vô tận → chặn cả queue.

**Giải**: Retry có giới hạn + **exponential backoff**; quá N lần → đẩy sang **DLQ** để điều tra, queue chính chạy tiếp.

```js
// ✅ Pub/Sub có DLQ native — khai báo lúc tạo subscription:
await pubsub.createSubscription('order-created', 'order-sub', {
  deadLetterPolicy: {
    deadLetterTopic: 'projects/joy/topics/order-created-dlq',
    maxDeliveryAttempts: 5,        // thử 5 lần rồi bỏ sang DLQ
  },
  retryPolicy: {                   // backoff thay vì dồn dập
    minimumBackoff: { seconds: 10 }, maximumBackoff: { seconds: 600 },
  },
});
```

> [!danger] ⛔ Đừng để DLQ thành "bãi rác im lặng" — phải có alert (Cloud Monitoring) khi DLQ có message, nếu không bạn mất data mà không hề biết.

---

## 5️⃣ Saga — transaction trải nhiều service

**Vấn đề**: 1 nghiệp vụ = nhiều bước ở nhiều service (đặt hàng → trừ kho → trừ điểm → gửi mail). Không có 2PC/ACID xuyên service. Fail bước 3 thì bước 1-2 phải hoàn lại.

**Giải**: Chuỗi local transaction; mỗi bước fail thì chạy **compensating action** (hành động bù trừ) cho các bước trước.

| Kiểu Saga | Cách điều phối | Ưu | Nhược |
|---|---|---|---|
| **Choreography** | Mỗi service nghe event, tự bắn event kế tiếp | Không có điểm nghẽn trung tâm | Khó nhìn toàn cảnh flow |
| **Orchestration** | 1 orchestrator ra lệnh từng bước | Dễ theo dõi, dễ debug | Orchestrator thành single point |

```js
// ✅ Choreography (bù trừ khi fail):
// order-created → reserve-stock → redeem-points → ...
// Nếu redeem-points FAIL → bắn 'points-redeem-failed'
//   → stock service nghe và chạy compensating: release-stock
app.post('/points/redeem-failed', async (req, res) => {
  await releaseStock(req.body.orderId);   // hoàn tác bước trước
  res.sendStatus(204);
});
```

> [!warning] ⚠️ Saga là **eventually consistent**, không phải atomic. Có khoảng thời gian dữ liệu "lệch tạm" giữa các bước — UI/nghiệp vụ phải chấp nhận được điều đó.

---

## 🧭 Tóm tắt: pattern nào trị bệnh gì

| Pattern | Vấn đề EDA | Công cụ trên GCP |
|---|---|---|
| Competing Consumers | Throughput cao, scale ngang | Cloud Run + Pub/Sub push |
| Transactional Outbox | Dual-write (DB ↔ event lệch nhau) | Firestore transaction + trigger (CDC) |
| Idempotent Consumer | Message trùng (at-least-once) | Firestore `processed_events` doc |
| Dead Letter Queue | Poison message kẹt queue | Pub/Sub `deadLetterPolicy` + `retryPolicy` |
| Saga | Transaction trải nhiều service | Pub/Sub events + compensating handlers |

---

## 📚 Tham khảo
- 🔥 [A Guide To Event-Driven Architectural Patterns — ByteByteGo](https://blog.bytebytego.com/p/a-guide-to-event-driven-architectural) — bài gốc (14/05/2026), đi qua 6 pattern giải quyết vấn đề EDA đẻ ra (phần chi tiết cần subscription).
- [Event-Driven Architecture Style — Microsoft Azure Architecture Center](https://learn.microsoft.com/en-us/azure/architecture/guide/architecture-styles/event-driven) — định nghĩa style + khi nào nên/không nên dùng, kèm sơ đồ producer/broker/consumer.
- [The Ultimate Guide to Event-Driven Architecture Patterns — Solace](https://solace.com/event-driven-architecture-patterns/) — tổng hợp pattern (competing consumers, fan-out, request-reply…) theo hướng thực dụng.
- [My TOP Patterns for Event-Driven Architecture — CodeOpinion](https://codeopinion.com/my-top-patterns-for-event-driven-architecture/) — Derek Comartin nói về outbox, idempotency, ordering từ kinh nghiệm thực chiến.
- [Must-Know Event-Driven Architectural Patterns — System Design Codex](https://newsletter.systemdesigncodex.com/p/must-know-event-driven-architectural) — bản tóm tắt ngắn gọn, hợp để ôn nhanh.

---

## ✅ Checklist
- [ ] Hiểu EDA đánh đổi: được decoupling/scale, mất single-transaction & exactly-once
- [ ] **Competing Consumers**: để Cloud Run auto-scale làm consumer, set `maxInstances`
- [ ] **Outbox / CDC**: ghi data + event atomic; ở Firestore tận dụng trigger thay bảng outbox
- [ ] **Idempotent Consumer**: chốt theo khóa nghiệp vụ (orderId), không chỉ messageId
- [ ] **DLQ**: cấu hình `maxDeliveryAttempts` + backoff + **alert khi DLQ có message**
- [ ] **Saga**: chọn choreography vs orchestration; chuẩn bị compensating action; chấp nhận eventual consistency
