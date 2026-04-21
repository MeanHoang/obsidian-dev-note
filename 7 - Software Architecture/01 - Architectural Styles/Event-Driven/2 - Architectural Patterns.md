> [!quote] 💬
> *"A failed project claiming 'event sourcing disaster' might actually suffer from CQRS complexity or asynchronous communication challenges — not event sourcing itself."*
> — Martin Fowler

---

## 🎯 Bài này nói gì?

"Event-Driven Architecture" (EDA) là một thuật ngữ **rất mơ hồ** — khi 2 người nói về "EDA", họ có thể đang nói về 2 thứ hoàn toàn khác nhau. Martin Fowler chỉ ra **4 pattern riêng biệt** thường bị gộp chung dưới cái tên EDA:

1. **Event Notification** — "Ê, có chuyện xảy ra nè"
2. **Event-Carried State Transfer** — "Ê, có chuyện xảy ra, đây là full data"
3. **Event Sourcing** — "Lưu event log làm source of truth"
4. **CQRS** — "Tách model read khỏi model write"

Bài ByteByteGo tổng hợp 4 pattern này kèm trade-off từng cái. Note này dựa trên canonical reference của Martin Fowler.

> [!note] 📝 So sánh dễ hiểu
> Nghĩ về 4 pattern như **4 kiểu giao tiếp trong đời sống**:
> - **Event Notification** = hét "Cháy nhà!" — người nghe tự quyết định làm gì, bạn không quan tâm
> - **Event-Carried State Transfer** = gửi bưu phẩm kèm mô tả đầy đủ — người nhận không cần hỏi lại
> - **Event Sourcing** = nhật ký cá nhân — ghi mọi việc xảy ra, đọc lại để biết hôm nay vì sao buồn
> - **CQRS** = có sổ chi tiêu riêng + báo cáo tổng hợp riêng — viết 1 kiểu, đọc 1 kiểu khác

---

## 1️⃣ Event Notification

**Là gì**: Service A publish event "có thay đổi nè", service B/C/D tự quyết định làm gì. A không quan tâm response.

```
┌─────────────┐  "UserSignedUp"   ┌──────────┐
│  User Svc   │ ─────────────────▶│  Broker  │
└─────────────┘                   └────┬─────┘
                                       │
                          ┌────────────┼────────────┐
                          ▼            ▼            ▼
                    ┌──────────┐ ┌──────────┐ ┌──────────┐
                    │  Email   │ │Analytics │ │ Loyalty  │
                    └──────────┘ └──────────┘ └──────────┘
```

### Code example (Shopify/Joy context)

```js
// Producer: User service chỉ publish, không care ai xử lý
await pubsub.topic('user-signed-up').publishMessage({
  json: { userId: 'u_123' }  // payload nhỏ, chỉ ID
});

// Consumer: Loyalty service tự fetch data đầy đủ khi cần
app.post('/handler/user-signed-up', async (req, res) => {
  const { userId } = req.body;
  const user = await userService.get(userId);  // fetch lại từ source
  await awardWelcomePoints(user);
  res.sendStatus(200);
});
```

### Trade-off

| ✅ Pros | ❌ Cons |
|---|---|
| **Coupling thấp** — producer không biết consumer | **Hidden flow** — hard to trace end-to-end logic |
| **Đơn giản** — payload nhỏ | **Debug khó** — logic span qua nhiều service |
| **Flexible** — thêm consumer mới không ảnh hưởng producer | **Implicit dependency** dễ tạo ra |

> [!tip] 💡 **Khi nào dùng**
> One-way notification mà producer không care response. Ví dụ: "user đăng ký" → analytics, email, loyalty mỗi service tự xử lý.

---

## 2️⃣ Event-Carried State Transfer (ECST)

**Là gì**: Event chứa **đầy đủ data cần thiết**. Consumer lưu copy local, không cần gọi lại producer.

```
┌─────────────┐  Full payload          ┌──────────┐
│  User Svc   │ ─────────────────────▶ │  Broker  │
│ (source)    │  {id, name, email,     └────┬─────┘
└─────────────┘   address, tier, ...}       │
                                             ▼
                                      ┌──────────────┐
                                      │ Loyalty Svc  │
                                      │ (local copy) │
                                      └──────────────┘
                                   Không cần call back User Svc
```

### Code example

```js
// Producer: publish FULL state
await pubsub.topic('user-updated').publishMessage({
  json: {
    userId: 'u_123',
    name: 'An Nguyen',
    email: 'an@example.com',
    tier: 'gold',
    address: { /* full object */ },
    updatedAt: '2026-04-21T10:00:00Z'
  }
});

// Consumer: lưu local copy, query cục bộ
app.post('/handler/user-updated', async (req, res) => {
  const user = req.body;
  await db.doc(`users_cache/${user.userId}`).set(user);
  // Sau này cần user info → query local, không call User Svc
  res.sendStatus(200);
});
```

### Trade-off

| ✅ Pros | ❌ Cons |
|---|---|
| **High availability** — source down, consumer vẫn chạy | **Data duplication** khắp nơi |
| **Low latency** — không call cross-service | **Eventual consistency** |
| **Giảm tải source** | **Sync logic phức tạp** hơn |

> [!warning] ⚠️
> Event payload to → schema evolution khó. 10 consumer depend vào schema → đổi 1 field = breaking change cho tất cả.

> [!tip] 💡 **Khi nào dùng**
> Consumer cần data thường xuyên + source system không đáng tin / chậm. Ví dụ: Joy cache thông tin shop từ Shopify để tránh rate limit.

---

## 3️⃣ Event Sourcing

**Là gì**: **Event log là source of truth**. State hiện tại = replay toàn bộ event log. Không lưu state trực tiếp, chỉ lưu changes.

```
Traditional:               Event Sourcing:
┌──────────────┐          ┌─────────────────────────┐
│ users table  │          │ events log (append-only)│
│ id=1         │          │ 1. UserCreated(name=An) │
│ name=An V2   │          │ 2. NameChanged(An → An2)│
│ balance=500  │          │ 3. PointsAdded(+100)    │
└──────────────┘          │ 4. PointsAdded(+400)    │
 (chỉ state hiện tại)     └─────────────────────────┘
                           State = replay toàn bộ events
```

### Code example

```js
// Ghi event thay vì update state
async function awardPoints(userId, amount, reason) {
  await db.collection('events').add({
    type: 'PointsAwarded',
    aggregateId: userId,
    data: { amount, reason },
    timestamp: FieldValue.serverTimestamp(),
    version: await getNextVersion(userId)
  });
}

// Lấy state hiện tại = replay events
async function getUserState(userId) {
  const events = await db.collection('events')
    .where('aggregateId', '==', userId)
    .orderBy('version')
    .get();

  return events.docs.reduce((state, eventDoc) => {
    const event = eventDoc.data();
    switch (event.type) {
      case 'UserCreated':    return { ...state, ...event.data };
      case 'PointsAwarded':  return { ...state, points: (state.points || 0) + event.data.amount };
      case 'PointsRedeemed': return { ...state, points: state.points - event.data.amount };
      default: return state;
    }
  }, {});
}
```

### Trade-off

| ✅ Pros | ❌ Cons |
|---|---|
| **Full audit trail** — ai làm gì lúc nào, biết hết | **Complexity rất cao** |
| **Time travel** — replay đến bất kỳ thời điểm | **Schema evolution** khó (event cũ schema cũ) |
| **Debug hypothetical** — "nếu không có event X thì sao?" | **Replay khó khi có external side effect** (gửi email, charge card) |
| **Analytics mạnh** — có full history | **Query hiện tại chậm** nếu không có snapshot/projection |

> [!danger] ⛔
> Event sourcing **KHÔNG phải** cho mọi project. Đa số app CRUD bình thường KHÔNG cần event sourcing — chỉ tạo thêm complexity.

> [!tip] 💡 **Khi nào dùng**
> - Tài chính / kế toán (cần audit mọi giao dịch)
> - Hệ thống versioning (Git chính là event sourcing)
> - Business logic phụ thuộc vào history (undo/redo, xem lại timeline)

### Ví dụ đời thực

- **Git** = event sourcing kinh điển. Mỗi commit = event. Working directory = derived state.
- **Redux** cũng là event sourcing ở frontend. Action = event, state = replay reducer.

---

## 4️⃣ CQRS (Command Query Responsibility Segregation)

**Là gì**: **Tách model read khỏi model write**. Write vào 1 model, đọc từ model khác (được denormalize để đọc nhanh).

```
Traditional:                        CQRS:
         ┌───────────┐                       Write              Read
Client ─▶│  1 Model  │◀─ Client     Client ──▶┌──────┐        ┌──────┐◀─ Client
         └───────────┘                        │Write │        │ Read │
          (Read/Write                         │Model │──sync─▶│Model │
           cùng 1 schema)                     └──────┘        └──────┘
                                              (SQL, normalized) (denorm, fast query)
```

**Lưu ý**: CQRS **không bắt buộc là event-driven**. Nhưng thường đi kèm với event sourcing.

### Code example (Joy Loyalty)

```js
// Write model: normalized, strict validation
async function redeemReward(userId, rewardId) {
  await db.runTransaction(async (tx) => {
    const user = await tx.get(`users/${userId}`);
    const reward = await tx.get(`rewards/${rewardId}`);
    if (user.data().points < reward.data().cost) throw new Error('Not enough points');

    tx.update(`users/${userId}`, {
      points: FieldValue.increment(-reward.data().cost)
    });
    tx.create(`redemptions/${uuid()}`, { userId, rewardId, at: new Date() });
  });
}

// Read model: denormalized, optimize cho UI
// → 1 collection 'user_dashboard' được update async từ write events
// → UI chỉ cần query 1 doc là có đủ data, không cần join
const dashboard = await db.doc(`user_dashboard/${userId}`).get();
// { name, tier, points, recentRedemptions: [...], nextReward: {...} }
```

### Trade-off

| ✅ Pros | ❌ Cons |
|---|---|
| **Read-heavy scale tốt** — read model tối ưu riêng | **Complexity cao** — 2 model phải sync |
| **Model rõ ràng** — write logic không lẫn read concern | **Eventual consistency** giữa write & read |
| **Tối ưu riêng** — SQL write + NoSQL read | **Bị lạm dụng** — không phải ai cũng cần |

> [!warning] ⚠️ Martin Fowler warning
> CQRS **bị misuse nhiều nhất** trong 4 pattern. Đừng áp dụng nếu domain đơn giản.

> [!tip] 💡 **Khi nào dùng**
> - Read pattern **rất khác** write pattern (read 99%, write 1%)
> - Read cần aggregate/join phức tạp → cache vào read model
> - Domain complex, business logic write nặng

---

## 📊 Bảng so sánh 4 pattern

| Pattern | Coupling | Complexity | Consistency | Use case chính |
|---|---|---|---|---|
| **Event Notification** | Thấp nhất | Thấp | Không care | Broadcast notification, analytics |
| **ECST** | Thấp | Trung bình | Eventual | Cross-service cache, high availability |
| **Event Sourcing** | N/A | Cao | Strong (trong aggregate) | Audit, time travel, financial |
| **CQRS** | N/A | Cao | Eventual (read vs write) | Read-heavy, complex domain |

## 🧩 Các pattern thường kết hợp

| Combo | Tại sao |
|---|---|
| Event Notification + ECST | Notify + attach data nếu consumer cần → hybrid |
| Event Sourcing + CQRS | Event log = write side, projection = read model |
| Event Sourcing + ECST | Publish state-transfer event từ event log |

> [!tip] 💡
> **Không bắt buộc chọn 1**. Trong 1 hệ thống có thể dùng nhiều pattern cho các context khác nhau. Ví dụ Joy Loyalty:
> - **Notification** cho "user-signed-up" (broadcast)
> - **ECST** cho shop metadata (cache từ Shopify)
> - **Event Sourcing** cho points transactions (cần audit)
> - **CQRS** cho merchant dashboard (read-heavy)

---

## 🔗 Áp dụng Joy Loyalty

| Scenario | Pattern phù hợp | Lý do |
|---|---|---|
| User signup → tặng welcome points | **Event Notification** | Loyalty chỉ cần biết "có user mới", self-fetch nếu cần |
| Shopify order paid → cộng points | **ECST** | Payload Shopify có full order → dùng luôn, tránh call back Shopify (rate limit) |
| Lịch sử points (earn/redeem/expire) | **Event Sourcing** | Merchant cần audit: "user này vì sao có 1000 points?" |
| Dashboard merchant xem summary | **CQRS** | Read nhiều, cần aggregate nhiều collection → denormalize vào 1 doc |

---

## 🧰 Checklist trước khi chọn pattern

- [ ] **Đã hiểu problem** chưa? Đừng chọn pattern trước khi hiểu use case
- [ ] **Team có đủ senior** để maintain pattern phức tạp không?
- [ ] **Có observability** (tracing, logging) chưa? Không có → đừng dùng event sourcing
- [ ] **Business có cần audit trail** không? Không → đừng event sourcing
- [ ] **Read/write pattern khác nhau nhiều** không? Không → đừng CQRS
- [ ] **Source system có đáng tin** không? Không → cân nhắc ECST
- [ ] **Đã có monitoring queue length / DLQ** chưa?
- [ ] **Consumer đã idempotent** chưa? (tất cả pattern đều cần)
- [ ] **Schema versioning plan** có chưa? (event sourcing + ECST đặc biệt cần)

---

## 📚 Tham khảo

- 🔥 [Event-Driven Architectural Patterns — ByteByteGo](https://blog.bytebytego.com/p/event-driven-architectural-patterns) — bài gốc tổng hợp ngắn gọn kèm diagrams (paywall 1 phần)
- ⭐ [What do you mean by "Event-Driven"? — Martin Fowler](https://martinfowler.com/articles/201701-event-driven.html) — canonical reference, 4 pattern gốc từ Fowler
- [The Many Meanings of Event-Driven Architecture (GOTO 2017) — Martin Fowler](https://www.youtube.com/watch?v=STKCRSUsyP0) — keynote YouTube, 50 phút, giải thích rất rõ bằng ví dụ
- [Event Sourcing Pattern — Microsoft Azure Architecture Center](https://learn.microsoft.com/en-us/azure/architecture/patterns/event-sourcing) — implementation guide với code snippet
- [Event Sourcing — Martin Fowler](https://martinfowler.com/eaaDev/EventSourcing.html) — bài sâu hơn về event sourcing cụ thể
- [My notes on "Many Meanings of EDA" — xpepper GitHub gist](https://gist.github.com/xpepper/36beda855540b0c1dde6c4c417dafec9) — note tóm tắt keynote Fowler, free

---

Related notes: [[1 - The Hard Parts]] · [[Event-driven]] · [[Message Broker]] · [[Pubsub]] · [[Idempotency]] · [[Ordering]]
