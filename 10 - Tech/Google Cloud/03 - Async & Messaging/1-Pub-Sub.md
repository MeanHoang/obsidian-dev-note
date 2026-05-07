> [!quote] 💬
> *"Pub/Sub is the duct tape of distributed systems."*

# 📨 Pub/Sub là gì?
**Google Cloud Pub/Sub** = messaging service event-driven, fully-managed. Producer (publisher) gửi message vào **topic**, consumer (subscriber) nhận từ **subscription** — **decouple** producer khỏi consumer.
Đặc tính:
- **At-least-once delivery** (1 message có thể giao 2+ lần → consumer phải dedupe).
- Không guarantee thứ tự (trừ khi bật ordering key).
- Throughput rất cao (millions msg/s), latency vài chục ms.
- Tính tiền theo data volume + subscription type.

> [!note] 📝 So sánh dễ hiểu
> Pub/Sub giống **bưu điện**: bạn gửi thư (publish) đến hộp thư (topic), nhiều người đăng ký (subscription) cùng nhận được. Bưu điện đảm bảo **thư đến tay ít nhất 1 lần** (đôi khi 2 lần do giao lại) — bạn nhận phải tự check trùng.

---
# 🆚 Pub/Sub vs Cloud Tasks
| Tiêu chí | Pub/Sub | Cloud Tasks |
|---|---|---|
| Mô hình | 1 publisher → N subscriber | 1 producer → 1 consumer |
| Use case | Event broadcast, fan-out | Job queue, "tôi cần cái này được làm" |
| Throughput | Triệu msg/s | Hàng nghìn req/s |
| Delay | Vài giây (push), vài ms (pull) | Schedule chính xác đến phút |
| Retry | Có (retry policy + DLQ) | Có (exponential backoff) |
| Order | Không (trừ ordering key) | Theo schedule time |
| Khi dùng | Analytics event, fan-out, microservice event | Email, webhook, image resize |

> [!tip] 💡
> **Pub/Sub** = "tôi muốn báo cho ai quan tâm" (event).
> **Cloud Tasks** = "tôi cần việc này được làm xong" (command).

---
# 🔄 Push vs Pull subscription

## Pull subscription
Consumer **chủ động fetch** message từ Pub/Sub (giữ kết nối streaming hoặc polling).
```js
const { PubSub } = require("@google-cloud/pubsub");
const pubsub = new PubSub();

const subscription = pubsub.subscription("loyalty-events-sub");
subscription.on("message", async (msg) => {
  console.log("Got:", msg.data.toString(), msg.attributes);
  try {
    await processMessage(msg.data);
    msg.ack();           // báo "đã xử lý xong"
  } catch (err) {
    msg.nack();          // báo "fail, retry sau"
  }
});
```
- ✅ Ưu: subscriber kiểm soát rate, batch tốt hơn, không cần expose endpoint public.
- ❌ Nhược: phải có process always-on (Cloud Run worker pool, GCE) → cost idle.

## Push subscription
Pub/Sub **chủ động POST** message tới HTTP endpoint của bạn.
```js
// Endpoint Cloud Functions / Cloud Run
exports.loyaltyEventHandler = onRequest(async (req, res) => {
  const msg = req.body.message;
  const payload = JSON.parse(Buffer.from(msg.data, "base64").toString());
  await processMessage(payload);
  res.status(200).end();      // 2xx = ack, 4xx/5xx = nack (retry)
});
```
- ✅ Ưu: không có process idle, deploy như HTTP function.
- ❌ Nhược: timeout 10 phút max, slow consumer = retry storm, cần verify caller (Pub/Sub gửi JWT).

> [!tip] 💡
> **Default chọn push** nếu work nhẹ + đã có Cloud Functions/Run.
> **Pull** nếu high-throughput hoặc cần kiểm soát rate (vd 1000 msg/s vào BigQuery).

---
# 🛠 Setup cơ bản (publish + subscribe)

## Tạo topic + subscription
```bash
gcloud pubsub topics create loyalty-events
gcloud pubsub subscriptions create loyalty-events-sub \
  --topic loyalty-events \
  --ack-deadline 60                            # consumer có 60s để ack
```

## Publish (Node.js)
```js
const { PubSub } = require("@google-cloud/pubsub");
const pubsub = new PubSub();
const topic = pubsub.topic("loyalty-events");

const messageId = await topic.publishMessage({
  data: Buffer.from(JSON.stringify({
    type: "order_paid",
    orderId: "shopify_123",
    points: 50,
  })),
  attributes: {                                // metadata key-value, queryable
    shopId: "demo",
    eventType: "order_paid",
  },
});
console.log("Published:", messageId);
```

## Subscribe via Cloud Functions
```js
const { onMessagePublished } = require("firebase-functions/v2/pubsub");

exports.processLoyaltyEvent = onMessagePublished({
  topic: "loyalty-events",
  region: "asia-southeast1",
  retry: true,                                 // function throw → retry
  maxInstances: 50,                            // chặn runaway
}, async (event) => {
  const data = event.data.message.json;        // tự decode JSON
  const attrs = event.data.message.attributes;
  console.log(data, attrs);
});
```

---
# 🔁 Idempotency — XỬ LÝ TRÙNG LÀ BẮT BUỘC
Pub/Sub là **at-least-once** → consumer **phải** dedupe. Cách phổ biến:

## Cách 1: Dùng message ID làm khóa dedupe
```js
async function processOrderEvent(event) {
  const msgId = event.id;                      // unique mỗi message
  const ref = db.collection("processedEvents").doc(msgId);
  const exists = (await ref.get()).exists;
  if (exists) return;                          // đã xử lý
  await ref.set({ processedAt: new Date() });
  // ... business logic ...
}
```
> [!warning] ⚠️
> `processedEvents` collection sẽ phình to. Set TTL policy (xoá doc > 7 ngày) hoặc dùng [Firestore TTL](https://firebase.google.com/docs/firestore/ttl).

## Cách 2: Idempotent business logic
```js
// ❌ Bad — duplicate event = cộng 2 lần
await userRef.update({ points: FieldValue.increment(50) });

// ✅ Good — dùng transaction kiểm tra orderId chưa xử lý
await db.runTransaction(async (tx) => {
  const orderRef = db.doc(`processedOrders/${orderId}`);
  if ((await tx.get(orderRef)).exists) return;
  tx.set(orderRef, { processedAt: new Date() });
  tx.update(userRef, { points: FieldValue.increment(50) });
});
```

---
# 💀 Dead Letter Topic (DLQ)
Khi message retry quá N lần vẫn fail → đẩy vào **dead letter topic** để debug riêng.
```bash
gcloud pubsub subscriptions create loyalty-events-sub \
  --topic loyalty-events \
  --dead-letter-topic loyalty-events-dlq \
  --max-delivery-attempts 5
```
DLQ chứa message + attribute `CloudPubSubDeadLetterSourceDeliveryCount` = số lần đã thử. Setup alert khi DLQ có message.

---
# 📊 Ordering & Exactly-once
## Ordering key
```js
await topic.publishMessage({
  data: Buffer.from(JSON.stringify(payload)),
  orderingKey: `shop_${shopId}`,    // cùng key → giao đúng thứ tự publish
});
```
> [!warning] ⚠️
> Ordering chỉ bảo đảm trong **cùng region** + **cùng ordering key**. Throughput giảm vì subscription phải xử lý tuần tự per-key.

## Exactly-once delivery (preview)
Pub/Sub có chế độ exactly-once nhưng cost cao + giảm throughput. Đa số case dùng at-least-once + idempotent code là OK.

---
# 🛒 Joy Loyalty patterns

## Pattern 1: Fan-out webhook Shopify → nhiều consumer
```
Shopify webhook (orders/paid)
  │
  ▼
[Webhook Function] ─► publish topic "order-events"
                         │
       ┌─────────────────┼─────────────────┐
       ▼                 ▼                 ▼
  [Loyalty consumer]  [Email consumer]  [BigQuery sink]
  (cộng điểm)         (gửi mail)        (analytics)
```
Mỗi consumer 1 subscription riêng → fail 1 cái không ảnh hưởng cái khác.

## Pattern 2: Stream event vào BigQuery
Pub/Sub có **BigQuery subscription** built-in → message tự ghi vào BQ table, không cần code consumer.
```bash
gcloud pubsub subscriptions create order-events-bq \
  --topic order-events \
  --bigquery-table joy-prod:analytics.events \
  --use-topic-schema
```
Latency vài giây, near-realtime analytics.

---
# 📚 Tham khảo
- [Pub/Sub overview — Google Cloud docs](https://cloud.google.com/pubsub/docs/subscriber) — official, chọn subscription type.
- [Best practices to subscribe — Google Cloud docs](https://cloud.google.com/pubsub/docs/subscribe-best-practices) — ack deadline, flow control, retry.
- [Pub/Sub triggers in Firebase Functions](https://firebase.google.com/docs/functions/pubsub-events) — `onMessagePublished` example.
- 🔥 [Push vs Pull Subscriptions — OneUptime 02/2026](https://oneuptime.com/blog/post/2026-02-17-how-to-choose-between-push-and-pull-subscriptions-in-google-cloud-pubsub/view) — bài 2026, decision tree push/pull.
- 🔥 [Pub/Sub Message Deduplication — OneUptime 02/2026](https://oneuptime.com/blog/post/2026-02-17-how-to-handle-pubsub-message-deduplication-in-subscriber-applications/view) — pattern dedupe ở consumer.
- [Handling duplicate data with Pub/Sub & Dataflow — Google Cloud Blog](https://cloud.google.com/blog/products/data-analytics/handling-duplicate-data-in-streaming-pipeline-using-pubsub-dataflow) — built-in dedupe của Dataflow.

---
# ✅ Checklist Pub/Sub
- [ ] Hiểu **at-least-once** → consumer **bắt buộc** idempotent
- [ ] Chọn push (mặc định nhẹ) vs pull (high-throughput control)
- [ ] Ack deadline ≥ thời gian xử lý max + buffer
- [ ] Setup **dead letter topic** với `--max-delivery-attempts 5`
- [ ] Dedupe bằng message_id hoặc business key trong transaction
- [ ] Cleanup `processedEvents` collection (TTL 7 ngày)
- [ ] Push subscription verify Pub/Sub JWT (chống caller giả)
- [ ] Stream vào BigQuery → dùng built-in BigQuery subscription
- [ ] Alert khi DLQ có message
- [ ] Liên kết: [[0-Cloud Tasks]], [[2-Tasks vs Pub-Sub]], [[1-Cloud Functions v2]]
