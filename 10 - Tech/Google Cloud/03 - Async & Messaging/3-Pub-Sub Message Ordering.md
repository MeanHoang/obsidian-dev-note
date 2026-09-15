> [!quote] 💬
> *"Distributed systems don't have race conditions. They have **schedules you didn't know you were allowed to choose**."*

# 🔢 Message Ordering là gì?
Mặc định Pub/Sub **không đảm bảo thứ tự** — publish A rồi B, subscriber có thể nhận B trước A, hoặc nhận **song song trên 2 instance khác nhau**. Với message độc lập (analytics event) thì không sao. Nhưng khi nhiều message cùng **sửa một entity**, xử lý song song = **race condition**.

**Ordering key** giải bài đó: gắn mỗi message một khóa (ví dụ `shopId_customerId`). Pub/Sub cam kết **các message cùng key được giao tuần tự theo đúng thứ tự publish, tới một subscriber tại một thời điểm** — message N+1 chỉ được giao **sau khi N đã ack**. Message khác key vẫn chạy song song bình thường.

> [!note] 📝 So sánh dễ hiểu
> Pub/Sub thường = **quầy siêu thị nhiều làn**: ai cũng có thể được gọi bất cứ lúc nào.
> Ordering key = **mỗi khách hàng có một làn riêng, xếp hàng dọc**. Trong làn thì tuần tự tuyệt đối; giữa các làn vẫn song song. Bạn không phải giành giật (lock), vì hạ tầng không cho phép 2 người cùng làn đứng quầy một lúc.

Điểm quan trọng về mặt tư duy: ordering key **không phải là lock**. Lock là "tôi né race"; ordering key là "**tôi bỏ điều kiện sinh ra race**". Không có gì để retry, không có gì để timeout, không có deadlock.

---
# 🎯 Nó giải đúng loại bug nào?

Mẫu bug kinh điển — **read-modify-write đồng thời**:

```
Message 1 (earn_point)    ──► đọc customer (tier=Rose)   ──────────────► ghi Rose  ❌ đè
Message 2 (tier/upgraded) ──► đọc customer (tier=Ochna) ──► ghi Ochna ✅
                                                            (message 1 về đích SAU)
```

Cả hai đều "đúng" tại thời điểm đọc, nhưng **thằng đọc dữ liệu cũ nhất lại ghi sau cùng** → kết quả cuối là dữ liệu cũ. Đây là bug **không ổn định**: cùng một luồng, lần thì đúng lần thì sai, tùy ai giành được lượt ghi. Xem case thật ở cuối note.

Ordering key làm message 2 **không thể** được giao trước khi message 1 ack xong → đọc-ghi tuần tự → hết bug.

---
# ✅ Đảm bảo gì / ❌ KHÔNG đảm bảo gì

| | |
|---|---|
| ✅ Cùng ordering key → giao **đúng thứ tự publish** | ❌ Khác key → **không** có quan hệ thứ tự nào |
| ✅ Cùng key → **một message outstanding tại một thời điểm** | ❌ **Không** phải exactly-once — vẫn at-least-once, vẫn phải idempotent |
| ✅ Key rỗng → message không ordered (trộn chung topic được) | ❌ Thứ tự **không** được giữ khi message rơi vào **dead-letter topic** |

> [!warning] ⚠️ Cái bẫy dễ quên nhất
> Redelivery lan về sau: **nếu message 2 phải giao lại thì message 3 cũng bị giao lại — dù message 3 đã được ack.** Ordering bảo toàn *thứ tự*, không bảo toàn *số lần*. Consumer **vẫn bắt buộc idempotent** (xem [[1-Pub-Sub]] § Idempotency).

---
# 🧱 Điều kiện bắt buộc (thiếu 1 trong 2 là hỏng, mà không báo lỗi)

## 1. Phía publisher
- Bật `messageOrdering: true` **trên topic object** (Node.js) — không phải trên từng message.
- Mọi message cùng key phải publish **trong cùng một region**.
- Ordering key tối đa **1 KB**.

```js
// Node.js — publish có thứ tự
const pubSub = new PubSub();

// LƯU Ý: cache topic object riêng cho bản ordered.
// Trộn ordered/unordered trên cùng một topic object sẽ lỗi.
const topic = pubSub.topic('customerSyncOrdered', {messageOrdering: true});

await topic.publishMessage({
  data: Buffer.from(JSON.stringify(payload)),
  orderingKey: `${shopId}_${customerId}`,   // ← cùng khách = cùng làn
});
```

## 2. Phía subscription
`enableMessageOrdering` **chỉ set được lúc TẠO subscription**.

> [!danger] 🚨 Không thể bật sau
> *"You can't change the message ordering property after you create a subscription."*
> Muốn bật cho subscription đã có → **xóa và tạo lại**. Không có lệnh update.

```bash
gcloud pubsub subscriptions create my-sub \
  --topic=customerSyncOrdered \
  --enable-message-ordering \
  --dead-letter-topic=customerSyncOrderedDlq \
  --max-delivery-attempts=5 \
  --ack-deadline=600
```

---
# 💣 Bẫy lớn nhất khi dùng với Firebase Functions v2

`onMessagePublished` **tự tạo subscription — và tạo KHÔNG có ordering**. Code publish vẫn chạy ngon lành, không lỗi, không cảnh báo. Chỉ là **thứ tự không được đảm bảo** → bug âm thầm quay lại y như trước khi "fix".

Tệ hơn: **mỗi lần `firebase deploy` có thể dựng lại subscription** và xóa mất cờ ordering.

> [!tip] 💡 Cách sống chung
> Viết một script chạy **sau mỗi lần deploy**: tìm subscription Firebase vừa tạo → đọc `pushEndpoint` + OIDC service account của nó → **xóa** → **tạo lại** với `--enable-message-ordering` + DLQ, rồi cấp quyền cho service account của Pub/Sub. Joy đang làm đúng vậy: `scripts/setup-pubsub-ordering.sh`.
> Và **verify sau mỗi deploy**:
> ```bash
> gcloud pubsub subscriptions describe <SUB> --format="value(enableMessageOrdering)"
> ```
> Phải in ra `True`. Đây là loại kiểm tra nên đưa vào CI, vì mắt thường không thấy được nó tắt.

Quyền cần cấp thêm cho Pub/Sub service agent (`service-<PROJECT_NUMBER>@gcp-sa-pubsub.iam.gserviceaccount.com`):
- `roles/pubsub.publisher` trên **DLQ topic** (để nó đẩy message chết sang đó),
- `roles/pubsub.subscriber` trên **subscription** (để nó ack message đã chuyển sang DLQ).

Thiếu 2 quyền này → DLQ im lặng không hoạt động, message chết quay vòng mãi.

---
# 🔗 Publish lỗi → cả làn đứng hình (rất dễ bị bất ngờ)

> *"When publishing with an ordering key fails, queued-up messages of the same ordering key in the publisher fail, **including future publish requests of this ordering key**."*

Tức là: 1 lần publish fail → **mọi publish sau đó cùng key đều fail luôn**, cho tới khi gọi `resumePublish(orderingKey)`. Đây là **thiết kế có chủ đích** (thà đứng còn hơn giao sai thứ tự), nhưng nếu không biết thì thấy như "publish chết hẳn".

```js
try {
  await topic.publishMessage({data, orderingKey});
} catch (err) {
  // Không có dòng này, khách đó sẽ không bao giờ publish được nữa
  topic.resumePublish(orderingKey);
  throw err;
}
```

---
# 📉 Cái giá phải trả

| Chi phí | Chi tiết |
|---|---|
| **Throughput mỗi key** | tối đa **1 MB/s** cho publish. Tổng các key thì theo quota region. |
| **Latency** | *"Ordered delivery decreases publish availability and increases end-to-end message delivery latency."* |
| **Push subscription** | chỉ **1 outstanding message cho mỗi key** tại một thời điểm → consumer chậm là nghẽn làn đó. |
| **Hot key** | key có volume cao thành nút cổ chai — giới hạn là **tốc độ consumer xử lý**, không phải hạ tầng. |
| **Lây chậm** | *"Unacknowledged messages for a given ordering key can potentially delay delivery of messages for other ordering keys."* Một làn kẹt vẫn có thể làm chậm làn khác. |

> [!important] 🎯 Chọn ordering key cho đúng
> Key phải **đủ mịn** để không thành hot key, nhưng **đủ thô** để bao trọn phạm vi cần tuần tự.
> - `shopId` → quá thô: một shop lớn là một hàng dài, tự bóp cổ chai chính mình.
> - `shopId_customerId` → vừa đẹp: race chỉ xảy ra **trong phạm vi một khách**, và mỗi khách vài event/ngày.
> - `orderId` → quá mịn nếu bug nằm ở mức customer: hai order khác nhau của **cùng khách** vẫn chạy song song → race vẫn còn.
>
> Quy tắc: **key = đúng entity mà các message cùng ghi vào.**

---
# 💀 DLQ là bắt buộc, không phải tùy chọn

Với ordering, một message chết sẽ **chặn toàn bộ message sau của cùng key** — khách đó ngừng được cập nhật vô thời hạn. DLQ chính là cái van xả: sau `max-delivery-attempts` lần, message bị đẩy sang DLQ topic và **làn được khai thông**.

Pattern Joy đang dùng: DLQ topic → một function riêng (`retry: false`) → **ghi vào Firestore** (`orderedDlqEvents`) để người xem lại. Không ghi lại thì message chết biến mất, đúng kiểu mất dữ liệu âm thầm.

```js
export const orderedDlqHandler = onMessagePublished(
  {topic: 'customerSyncOrderedDlq', timeoutSeconds: 60, retry: false},
  async (event) => {
    const msg = event.data.message;
    // deliveryAttempt + orderingKey là thứ cần nhất khi đi điều tra
    await saveDlqEvent({
      orderingKey: msg.orderingKey || null,
      payload: msg.json,
      attempts: msg.deliveryAttempt,
    });
  },
);
```

---
# 🛒 Case thật ở Joy

## Case 1 — Cộng điểm trùng khi đặt hàng (đã fix bằng ordering)
`orders/create` + `orders/updated` của **cùng một order** về gần nhau → 2 message `giveOrderReward` cho cùng khách chạy song song → cả hai cùng đọc số điểm cũ → **cộng điểm 2 lần**.

Fix: publish sang topic riêng `backgroundHandlingOrdered` với `orderingKey = shopId_customerId`, subscription bật ordering + DLQ. Handler **không phải sửa logic** — chỉ cần không còn bị chạy song song.

## Case 2 — Sync Joy → Lark Base sai tier (cùng một lớp bug)
Khách mua hàng đủ lên hạng → Joy bắn **4 webhook trong 3 giây** (`points/earned` ×3 + `tier/upgraded`). Mỗi webhook rơi vào một Cloud Run instance, **tự fetch snapshot rồi mới xếp hàng chờ lock** để ghi:

```
21:00:53.650  earn_point    → đọc tier=Rose    → ghi lúc 21:01:14  ← về đích CUỐI
21:00:56.687  tier/upgraded → đọc tier=Ochna   → ghi lúc 21:01:10
```

Instance đến **sớm nhất** ghi **sau cùng**, với snapshot cũ 20 giây: đè tier về `Rose` **và** xóa khách khỏi bảng VIP. Khách đếm tay thấy lệch số lượng mới phát hiện.

Điều đáng chú ý: **đã có distributed lock (Redis SETNX)** mà vẫn sai. Vì lock chỉ chống *ghi chồng nhau*, **không chống ghi sai thứ tự** — nó thậm chí còn kéo dài thời gian ôm snapshot cũ. Cùng lúc đó một khách khác trong cùng burst lại đúng, thuần túy vì giành được lock sớm hơn.

> [!tip] 💡 Bài học rút ra
> Nếu trong hệ có **hai đường ghi cùng một entity**, đừng hỏi "khóa thế nào cho chặt". Hỏi "**làm sao để chỉ còn một đường ghi**". Lock là vá; ordering key (hoặc single-writer) là chữa.

---
# 🤔 Khi nào KHÔNG dùng ordering

| Tình huống | Dùng gì thay thế |
|---|---|
| Message độc lập (analytics, log, email) | Pub/Sub thường — ordering chỉ tốn latency vô ích |
| Chỉ cần "đừng làm 2 lần" chứ không cần thứ tự | Idempotency key + dedupe ([[1-Pub-Sub]]) |
| Cần chạy sau X phút / cần gộp burst | [[0-Cloud Tasks]] + task name để dedupe |
| Chỉ chống ghi đè bằng dữ liệu cũ | Optimistic check: so `updatedAt` trước khi ghi, cũ hơn thì bỏ |
| Một entity bị ghi bởi hệ thống ngoài tầm kiểm soát | Reconcile định kỳ — ordering không cứu được cái mình không thấy |

---
# ✅ Checklist khi triển khai ordering

- [ ] Ordering key đúng **entity đang bị tranh chấp** (thường là `shopId_customerId`)
- [ ] Publisher bật `messageOrdering: true`, cache topic object **riêng** cho bản ordered
- [ ] Có gọi `resumePublish(key)` ở nhánh catch
- [ ] Subscription tạo **mới** với `--enable-message-ordering` (không thể bật sau)
- [ ] Có DLQ topic + `--max-delivery-attempts` + handler lưu lại message chết
- [ ] Cấp `pubsub.publisher` trên DLQ và `pubsub.subscriber` trên subscription cho Pub/Sub service agent
- [ ] Consumer **vẫn idempotent** (ordering ≠ exactly-once, redelivery lan về sau)
- [ ] `ack-deadline` đủ dài cho công việc chậm nhất (mặc định 10s là quá ngắn)
- [ ] **Có bước verify `enableMessageOrdering=True` sau mỗi deploy** — đây là chỗ dễ mất nhất
- [ ] Dùng **topic riêng** cho luồng ordered, đừng bật trên topic đang chạy chung

---
# 📚 Tham khảo
- [Ordering messages](https://cloud.google.com/pubsub/docs/ordering) — guarantee, giới hạn, tương tác với DLQ
- [Publish with ordering keys](https://cloud.google.com/pubsub/docs/publisher#using-ordering-keys) — cấu hình từng client library
- [Retry requests with ordering keys](https://cloud.google.com/pubsub/docs/handling-failures) — `resumePublish`
- Joy repo: `scripts/setup-pubsub-ordering.sh`, `docs/features/pubsub-ordering-give-order-reward.md`, `helpers/pubsub/publishTopic.js`

---
**Liên quan:** [[1-Pub-Sub]] · [[0-Cloud Tasks]] · [[_MOC]]
