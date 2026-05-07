> [!quote] 💬
> *"Design your Firestore schema for your reads, not your writes."* — Firebase team

# 🔥 Firestore là gì?
**Cloud Firestore** = NoSQL document database fully-managed của Google. Lưu data dạng **JSON-like document** trong **collection**, sync realtime giữa client + server, scale tự động đến petabyte mà không cần shard tay.
Khác SQL ở 3 điểm cốt lõi:
1. **Không có JOIN** — phải denormalize hoặc fan-out query.
2. **Không có WHERE phức tạp tự do** — query phải có index trước.
3. **Tính tiền theo operation** (read/write/delete) chứ không theo CPU/storage.

> [!note] 📝 So sánh dễ hiểu
> Firestore giống **kho hàng tự động**: mỗi món hàng (document) đặt trong 1 ngăn (collection) có nhãn rõ ràng. Muốn lấy phải biết **chính xác đường đi** (`/users/abc123/orders/xyz`). Robot không tự "tìm" — nó **đi theo nhãn đã sắp xếp** (index). Càng nhiều cách lọc = càng nhiều index = càng tốn chỗ.

---
# 🧱 Mô hình dữ liệu
## Cấu trúc 4 cấp
```
Database
└── Collection (vd "users")
    └── Document (vd "abc123")              ← chứa field key-value
        ├── Field (vd email: "a@b.com")
        └── Subcollection (vd "orders")     ← lặp lại từ Collection
            └── Document...
```
- **Collection** = thư mục, chỉ chứa document.
- **Document** = file JSON, max **1 MiB**, chứa field + (optional) subcollection.
- **Field** = key-value, support type: string, number, bool, array, map, timestamp, geopoint, reference, null.

> [!warning] ⚠️
> **Document max 1 MiB** + **field max 20.000** + **depth subcollection max 100 cấp**, nhưng best practice là **không quá 3 cấp**. Quá sâu = query khó, debug khổ.

## Path = ID đường đi
```
/users/abc123                          ← document path
/users/abc123/orders/order_2024_001    ← document trong subcollection
```
Path luôn xen kẽ collection/document/collection/document → **chiều dài chẵn = document, lẻ = collection**.

---
# 🛠 CRUD cơ bản (Admin SDK Node.js)
## Setup
```js
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();
```

## Create / Set
```js
// Tạo doc với ID tự động
const ref = await db.collection("users").add({
  email: "merchant@joy.app",
  shop: "demo.myshopify.com",
  createdAt: admin.firestore.FieldValue.serverTimestamp(),
});
console.log(ref.id);  // auto-generated ID

// Tạo doc với ID cố định (idempotent)
await db.collection("users").doc("abc123").set({
  email: "merchant@joy.app",
}, { merge: true });   // merge: true = không ghi đè field cũ
```

## Read
```js
// 1 document
const snap = await db.collection("users").doc("abc123").get();
if (snap.exists) {
  console.log(snap.data());
}

// Query nhiều document
const snaps = await db.collection("users")
  .where("shop", "==", "demo.myshopify.com")
  .where("status", "==", "active")
  .orderBy("createdAt", "desc")
  .limit(20)
  .get();

snaps.forEach(doc => console.log(doc.id, doc.data()));
```

## Update
```js
await db.collection("users").doc("abc123").update({
  lastLogin: admin.firestore.FieldValue.serverTimestamp(),
  loginCount: admin.firestore.FieldValue.increment(1),  // atomic +1
});
```

## Delete
```js
await db.collection("users").doc("abc123").delete();
// ⚠️ KHÔNG xoá subcollection — phải xoá thủ công recursive
```
> [!danger] ⛔
> **Xoá document KHÔNG xoá subcollection** của nó. Subcollection trở thành "orphan" — vẫn tốn storage + đếm trong stats. Phải dùng `firebase firestore:delete` CLI hoặc viết script recursive.

---
# 🔍 Query patterns
## Equality + Range
```js
// OK — 1 range field (price), nhiều equality (shop, active)
db.collection("products")
  .where("shop", "==", "demo")
  .where("active", "==", true)
  .where("price", ">=", 100)
  .where("price", "<=", 500)
  .orderBy("price")
```

> [!warning] ⚠️
> **Chỉ 1 field range/inequality (`<`, `<=`, `>`, `>=`, `!=`) trong 1 query**. Muốn lọc 2 field range → phải fetch về client filter, hoặc redesign data.

## Array operations
```js
// array-contains: tìm doc có element trong array
db.collection("posts").where("tags", "array-contains", "loyalty")

// array-contains-any: match BẤT KỲ trong list (max 30 element)
db.collection("posts").where("tags", "array-contains-any", ["loyalty", "vip"])

// in: field bằng 1 trong list (max 30)
db.collection("orders").where("status", "in", ["pending", "paid"])
```

## Pagination với cursor
```js
// ❌ Bad — dùng offset (vẫn tính tiền doc bị skip)
db.collection("orders").offset(100).limit(20)

// ✅ Good — dùng cursor (chỉ tính 20 doc trả về)
const last = previousQuery.docs[previousQuery.docs.length - 1];
db.collection("orders")
  .orderBy("createdAt", "desc")
  .startAfter(last)
  .limit(20);
```

---
# 📡 Realtime listener
```js
// Listen 1 document
const unsub = db.collection("users").doc("abc123")
  .onSnapshot(snap => {
    console.log("Updated:", snap.data());
  }, err => console.error(err));
// Nhớ unsub khi component unmount
unsub();

// Listen query
db.collection("orders")
  .where("shop", "==", "demo")
  .onSnapshot(snaps => {
    snaps.docChanges().forEach(change => {
      if (change.type === "added")    console.log("New:", change.doc.data());
      if (change.type === "modified") console.log("Updated:", change.doc.data());
      if (change.type === "removed")  console.log("Deleted:", change.doc.id);
    });
  });
```
> [!tip] 💡
> Listener **rẻ** vì Firestore chỉ push delta khi có thay đổi — nhưng **mỗi listener đếm = 1 read khi setup + 1 read mỗi lần document thay đổi**. Với listener trên 1000 doc, mỗi update = 1000 read tổng cộng (1 cho mỗi listener).

---
# 💸 Pricing model — biết để tránh sốc bill
| Operation | Giá (us-central1) |
|---|---|
| Read | $0.06 / 100k |
| Write | $0.18 / 100k |
| Delete | $0.02 / 100k |
| Storage | $0.18 / GiB / tháng |
| Network egress | $0.12 / GiB |

**Rule cốt lõi:**
- **Mỗi document trả về = 1 read** (kể cả khi bạn chỉ dùng 2 field).
- **Listener active = 1 read setup + N read khi update** (N = số doc match).
- **Query rỗng (no result) = 1 read minimum**.
- **Aggregation (`count()`, `sum()`)** = đếm rẻ hơn read all (1 aggregation = 1 read), nhưng chỉ index up to 1000 doc.

---
# 🛒 Joy Loyalty patterns
## Loyalty point ledger
```js
// Mỗi giao dịch = 1 doc trong subcollection
/users/{userId}/pointTransactions/{txId}
  amount: +50
  reason: "order_paid"
  orderId: "shopify_order_123"
  createdAt: serverTimestamp

// Total balance = field denormalize trên user doc
/users/{userId}
  pointBalance: 2350         ← update bằng increment() atomic
```
> [!tip] 💡
> Đừng tính lại `pointBalance` bằng `sum()` mỗi lần đọc → nhiều read. Update **denormalized** bằng `FieldValue.increment(50)` mỗi lần insert transaction. Reconcile định kỳ bằng job nếu cần.

## Webhook idempotency
```js
// Shopify retry → cùng webhook gửi nhiều lần
// Dùng webhook_id làm document ID để dedupe
const webhookId = req.headers["x-shopify-webhook-id"];
const ref = db.collection("processedWebhooks").doc(webhookId);
const exists = (await ref.get()).exists;
if (exists) return res.json({ ok: true, dedup: true });
await ref.set({ processedAt: serverTimestamp() });
// ... xử lý webhook ...
```

---
# 📚 Tham khảo
- [Cloud Firestore Data model — Firebase docs](https://firebase.google.com/docs/firestore/data-model) — official, giải thích collection/document/subcollection chuẩn.
- [Choose a data structure — Firebase docs](https://firebase.google.com/docs/firestore/manage-data/structure-data) — best practice nested vs subcollection vs root collection.
- 🔥 [7+ Firestore Query Performance Best Practices for 2026 — Estuary](https://estuary.dev/blog/firestore-query-best-practices/) — bài 2026 mới, focus vào query cost + index.
- [How to Design Firestore for Many-to-Many — OneUptime 02/2026](https://oneuptime.com/blog/post/2026-02-17-how-to-design-firestore-data-models-for-complex-many-to-many-relationships/view) — pattern cho user-group, product-tag.
- [5 things I wish I knew before Firestore — zakka.dev](https://zakka.dev/posts/5-firestore-tips) — pitfall thực tế.
- [Advanced Firestore Data Modeling — Fireship.io](https://fireship.io/lessons/advanced-firestore-nosql-data-structure-examples/) — case study chat app, social feed.

---
# ✅ Checklist Firestore
- [ ] Hiểu path = collection/document xen kẽ, chiều dài chẵn = doc
- [ ] Document < 1 MiB, không quá 3 cấp subcollection
- [ ] Dùng `set({}, { merge: true })` thay vì `set({})` để tránh ghi đè
- [ ] Atomic counter dùng `FieldValue.increment()`, không read-modify-write
- [ ] Pagination dùng `startAfter(cursor)`, không `offset()`
- [ ] Chỉ 1 range field (`<`, `>`, `!=`) trong 1 query
- [ ] Tạo composite index khi query có 2+ field (xem [[1-Composite Indexes]])
- [ ] Listener cleanup khi component unmount (tránh leak)
- [ ] Webhook dùng `webhook_id` làm doc ID → idempotent
- [ ] Xoá document → cũng phải xoá subcollection bằng script
