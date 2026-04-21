https://threedots.tech/episode/event-driven-architecture/
> [!quote] 💬
> *"If you feel like you need distributed transactions between three services, maybe you should just merge them into one."*
> — Three Dots Labs

---
## 🎯 Bài này nói gì?

**Event-Driven Architecture (EDA)** nghe thì hấp dẫn — scale tốt, loose coupling, async, microservices-friendly. Nhưng Three Dots Labs chỉ ra rằng **phần lớn team áp dụng EDA đều đánh giá thấp độ phức tạp ẩn** của nó.

Bài này là tổng hợp **"những phần khó"** (the hard parts) mà không ai nói với bạn khi mới đọc về EDA trên blog quảng cáo.

> [!note] 📝 So sánh dễ hiểu
> EDA giống như **chuyển từ gọi điện thoại sang gửi thư**:
> - Gọi điện (sync): biết ngay người kia có nghe không, trả lời gì
> - Gửi thư (async): gửi xong không biết đến chưa, có đọc chưa, có trả lời không — phải có **mã vận đơn, tracking, xác nhận đã nhận**, và phải tính cả trường hợp **thư đến 2 lần** hoặc **thất lạc**
>
> EDA đắt đỏ ở những thứ "tracking" này, không phải ở việc gửi thư.

---

## 😱 8 Hard Parts chính

### 1️⃣ Observability & Debugging
Trong hệ sync, stack trace cho bạn biết mọi thứ. Trong EDA async, **event chạy qua 5 service, fail ở đâu đó** — không có stack trace xuyên suốt.

**Bắt buộc phải có**:
- **Distributed tracing** (OpenTelemetry, Jaeger)
- **Correlation ID** (UUID gắn vào mỗi request, đi theo xuyên suốt)
- **Structured logging** (JSON logs, searchable)

> [!warning] ⚠️
> Không có observability → EDA trở thành **black box**. Event biến mất mà không ai biết.

### 2️⃣ Data Consistency → Eventual Consistency
Từ **strong consistency** (SQL ACID) → **eventual consistency** (có độ trễ, có lúc sai tạm thời).

**Điều này phải communicate với cả stakeholder phi kỹ thuật** (PM, business owner). Ví dụ: "Sau khi user đặt hàng, order list có thể chưa update trong 2-3s — đó là bình thường".

### 3️⃣ Message Loss — Broker không mất, nhưng BẠN có thể mất
Broker (Kafka, RabbitMQ) được thiết kế để không mất message. Nhưng **bạn** có thể mất vì:
- Database commit thành công nhưng publish event fail → **split-brain**
- Hoặc ngược lại: publish event xong nhưng DB rollback → **event ma**

→ Phải dùng **Outbox Pattern** (xem dưới).

### 4️⃣ At-Least-Once Delivery → Phải Idempotent
Hầu hết broker đảm bảo **at-least-once** — tức là message có thể đến **nhiều hơn 1 lần**.

> [!danger] ⛔
> Horror story thật: một team gửi **10 triệu SMS cho 1 số điện thoại trong 10 phút** vì handler không idempotent + broker redelivery.

Xem thêm: [[Idempotency]]

### 5️⃣ Poison Messages
Message bị lỗi (parse fail, schema sai) có thể **block cả queue**. Giải pháp:
- **Dead Letter Queue (DLQ)** — chuyển message lỗi sang queue riêng
- **Alerting** trên DLQ length
- **Tooling** để investigate & replay (ví dụ Watermill có `pq` CLI)

### 6️⃣ Event Design — Đừng làm event "to"
Nếu event của bạn có 50 fields và 10 team dùng nó → **không thể refactor**. Đổi schema là breaking change cho tất cả.

> [!tip] 💡
> **Rule**: Event nhỏ, cụ thể dễ gộp lại sau. Event to, generic **không thể** tách ra.

### 7️⃣ Distributed Transactions (Sagas) — Tránh được thì tránh
Saga pattern cho distributed transaction = **catastrophic complexity**. Rollback fail → manual SQL correction ở prod.

> [!quote] 💬
> *"If you feel like you need distributed transactions between 3 services, maybe merge them into 1."*

### 8️⃣ Testing Complexity
- Unit test: OK
- Component test với broker thật: cần poll, cần handle eventual consistency, cần test duplicate delivery
- E2E: flaky vì async

---

## 🔑 Pattern quan trọng nhất: Outbox Pattern

Đây là pattern **phải biết** nếu làm EDA với database.

### Vấn đề: Dual Write Problem

```js
// ❌ BAD: Dual write - không atomic
async function createUser(data) {
  await db.insert('users', data);           // bước 1: DB
  await broker.publish('user.created', data); // bước 2: broker
  // Nếu bước 2 fail → event bị mất, nhưng user đã tồn tại
  // Nếu bước 1 fail nhưng bước 2 thành công → event ma
}
```

### Giải pháp: Outbox Pattern

Ghi event vào **cùng database transaction** với domain data. Một **background process** đọc từ outbox table và publish ra broker.

```js
// ✅ GOOD: Outbox pattern - atomic write
async function createUser(data) {
  await db.transaction(async (tx) => {
    // Cả 2 cùng commit hoặc cùng rollback
    await tx.insert('users', data);
    await tx.insert('outbox', {
      eventType: 'user.created',
      payload: JSON.stringify(data),
      createdAt: new Date(),
    });
  });
}

// Worker riêng đọc outbox và publish
async function outboxWorker() {
  const pending = await db.query(
    'SELECT * FROM outbox WHERE published_at IS NULL LIMIT 100'
  );
  for (const event of pending) {
    await broker.publish(event.eventType, event.payload);
    await db.update('outbox', { publishedAt: new Date() }, { id: event.id });
  }
}
```

### Bảng so sánh các cách publish event

| Cách | Atomicity | Độ phức tạp | Trade-off |
|---|---|---|---|
| **Dual write** (DB + publish riêng) | ❌ Không | Thấp | Dễ mất event / event ma |
| **Outbox + polling** | ✅ Có | Trung bình | Worker poll DB, tốn resource |
| **Outbox + CDC** (Debezium) | ✅ Có | Cao | Production-grade, scale tốt |
| **Firestore onWrite trigger** | ✅ Có | Thấp | Chỉ dùng được với Firestore |

> [!tip] 💡 **2026 trend**
> Dùng **Change Data Capture (CDC)** với PostgreSQL Logical Decoding thay vì polling. Database trở thành event stream.

---

## 🛡️ Idempotent Handler — Pattern thứ hai phải biết

Vì message có thể đến nhiều lần, **mọi handler PHẢI idempotent**.

```js
// ❌ BAD: Cộng points 2 lần nếu webhook đến 2 lần
app.post('/webhook/order-paid', async (req, res) => {
  const { userId, amount } = req.body;
  await db.update('users', {
    points: FieldValue.increment(amount * 10)
  }, { id: userId });
  res.sendStatus(200);
});

// ✅ GOOD: Check event ID trước, transaction atomic
app.post('/webhook/order-paid', async (req, res) => {
  const eventId = req.headers['x-event-id'];
  const { userId, amount } = req.body;

  await db.runTransaction(async (tx) => {
    const processed = await tx.get(`events/${eventId}`);
    if (processed.exists) return; // đã xử lý → skip

    tx.update(`users/${userId}`, {
      points: FieldValue.increment(amount * 10)
    });
    tx.set(`events/${eventId}`, {
      processedAt: FieldValue.serverTimestamp()
    });
  });

  res.sendStatus(200);
});
```

> [!tip] 💡 **Testing idempotency**
> Thêm middleware **duplicate mọi message 2 lần** trong component test. Nếu handler không idempotent, test sẽ fail → phát hiện bug sớm.

---

## 🧭 Khi nào nên dùng EDA?

> [!danger] ⛔ **Default là SYNC, không phải async**
> Đừng build EDA vì "nghe hay". Default là monolith + sync. Migrate sang async **chỉ khi có pain point cụ thể**.

### Signal nên migrate sang async

| Signal | Ví dụ |
|---|---|
| External API call chậm | Gửi email, SMS, push notification |
| Heavy computation | Generate PDF, video encoding, ML inference |
| Traffic spike | Black Friday, viral post |
| Fan-out | 1 order → update 5 hệ thống (inventory, CRM, analytics, email, loyalty) |
| Decouple teams | Team A không muốn chờ team B deploy |

### Signal KHÔNG cần EDA

- Team < 10 người
- 1 database, CRUD đơn giản
- Không có traffic issue
- Business logic có thể đồng bộ

> [!tip] 💡
> **Modular Monolith** thường là đáp án đúng cho team nhỏ: separate code modules, clean interfaces, nhưng deploy 1 cục. Có thể split sau.

---

## 🔗 Liên hệ Shopify / Joy Loyalty

Nếu bạn build app Shopify có xử lý webhook (order/paid, order/created...):

**Shopify webhook có 2 đặc tính khó**:
1. **At-least-once delivery** — webhook có thể đến nhiều lần
2. **No ordering guarantee** — webhook có thể đến sai thứ tự

→ **Mọi handler PHẢI**:
- Idempotent (dùng `order_id` hoặc `X-Shopify-Webhook-Id` làm key)
- Check `updated_at` từ payload để xác định thứ tự thật (xem [[Ordering]])

**Với Firestore làm DB**:
- Dùng `runTransaction` + event ID check
- Không dùng `FieldValue.increment` trần → dễ double count

---

## 🧰 Checklist trước khi deploy EDA lên prod

- [ ] **Observability**: distributed tracing + correlation ID + structured logs
- [ ] **Outbox pattern**: event + DB write trong cùng transaction
- [ ] **Idempotent handlers**: mọi handler check event ID/key trước khi process
- [ ] **Dead Letter Queue**: setup DLQ + alerting cho poison message
- [ ] **Queue monitoring**: alert khi queue length / unacked messages vượt ngưỡng
- [ ] **Event design**: event nhỏ, cụ thể — không dump raw DB model vào event
- [ ] **Schema registry**: versioning cho event schema (tránh breaking change)
- [ ] **Testing**: component test có duplicate middleware + eventual consistency handling
- [ ] **Retry policy**: bounded retry + exponential backoff, không retry vô hạn
- [ ] **Partition key**: partition theo aggregate ID (user_id, order_id) để giữ ordering per-entity
- [ ] **Runbook**: document cho poison queue recovery, replay, manual correction
- [ ] **Stakeholder alignment**: PM/business hiểu eventual consistency nghĩa là gì

---

## 📚 Tham khảo

- 🔥 [Event-Driven Architecture: The Hard Parts — Three Dots Labs](https://threedots.tech/episode/event-driven-architecture/) — bài gốc, podcast + transcript, tổng hợp kinh nghiệm production từ team Go
- [Event-Driven Architecture on AWS, Part III: The Hard Basics — Vlad Khononov](https://vladikk.com/2024/10/13/aws-eda-iii/) — góc nhìn từ AWS serverless, practical patterns
- [Transactional Outbox Pattern — AWS Prescriptive Guidance](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html) — doc chính thức AWS, có implementation reference
- [Outbox, Inbox patterns and delivery guarantees — Event-Driven.io](https://event-driven.io/en/outbox_inbox_patterns_and_delivery_guarantees_explained/) — giải thích at-least-once / exactly-once / at-most-once sâu
- [Microservices Pattern: Transactional Outbox — microservices.io](https://microservices.io/patterns/data/transactional-outbox.html) — Chris Richardson, reference kinh điển
- 🔥 [Outbox pattern for reliable events — Cost Optimization (Mar 2026)](https://www.sachith.co.uk/outbox-pattern-for-reliable-events-cost-optimization-practical-guide-mar-26-2026/) — bài mới về tối ưu chi phí khi dùng outbox ở scale lớn

Related notes: [[Event-driven]] · [[Message Broker]] · [[Pubsub]] · [[Microservices]] · [[Idempotency]] · [[Ordering]]
