> [!quote] 💬
> *"Functions are just Cloud Run with extra steps — but the right extra steps."*

# ⚡ Cloud Functions v2 là gì?
**Cloud Functions for Firebase v2** = framework để viết function ngắn (HTTP/event trigger) mà **không cần viết Dockerfile**. Code → deploy 1 lệnh, Google tự build container chạy trên Cloud Run hạ tầng.
Khác Cloud Run "thuần":
- Không cần Dockerfile, container.
- SDK xử lý sẵn auth token, App Check, CORS cho callable function.
- Trigger định nghĩa bằng decorator/wrapper: `onRequest`, `onCall`, `onMessagePublished`, `onDocumentCreated`…

> [!note] 📝 So sánh dễ hiểu
> Cloud Run = **bếp riêng đầy đủ** (tự lo dao thớt = Dockerfile).
> Cloud Functions v2 = **bếp share-kitchen có sẵn dụng cụ** — chỉ cần mang nguyên liệu (code), không cần lo bếp.
> Cùng 1 ngôi nhà (Cloud Run platform), nhưng khác trải nghiệm.

---
# 🆚 v1 vs v2 — luôn dùng v2
| Tiêu chí | v1 (legacy) | **v2** (recommended) |
|---|---|---|
| Hạ tầng | Cloud Functions cũ | Cloud Run v2 |
| Concurrency | 1 (mỗi instance 1 req) | 1-1000 (default 80) |
| CPU/Memory tier | 256MiB-8GiB | 256MiB-32GiB |
| Cold start | Chậm hơn | ~50% nhanh hơn |
| Min instances | ✅ | ✅ |
| Trigger mới | ❌ | ✅ Eventarc |

> [!danger] ⛔
> Code mới **luôn dùng v2**. v1 sẽ deprecate dần. Migrate guide: [Upgrade 1st gen → 2nd gen](https://firebase.google.com/docs/functions/2nd-gen-upgrade).

---
# 🛠 Setup project
```bash
npm install -g firebase-tools
firebase init functions     # chọn JavaScript, source folder = functions/
cd functions
npm install firebase-functions firebase-admin
```
```js
// functions/index.js
const { onRequest, onCall } = require("firebase-functions/v2/https");
const { onMessagePublished } = require("firebase-functions/v2/pubsub");
const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const admin = require("firebase-admin");
admin.initializeApp();
```

Deploy:
```bash
firebase deploy --only functions
firebase deploy --only functions:api,functions:processOrder    # chỉ vài function
```

---
# 🚦 4 trigger phổ biến

## 1️⃣ HTTP request (REST API, webhook)
```js
exports.api = onRequest({
  region: "asia-southeast1",
  cors: true,                       // CORS allow all
  minInstances: 1,                  // production
  concurrency: 80,
  cpuBoost: true,
  memory: "512MiB",
  timeoutSeconds: 60,
}, async (req, res) => {
  if (req.method !== "POST") return res.status(405).end();
  const data = req.body;
  await admin.firestore().collection("logs").add({ data, ts: new Date() });
  res.json({ ok: true });
});
```
URL: `https://asia-southeast1-<project>.cloudfunctions.net/api`

## 2️⃣ Callable function (gọi từ client app)
```js
// Server
exports.addLoyaltyPoint = onCall({
  region: "asia-southeast1",
  enforceAppCheck: true,           // chỉ chấp nhận client App Check verified
}, async (request) => {
  // request.auth = Firebase Auth user (nếu signed in)
  // request.data = payload từ client
  if (!request.auth) throw new HttpsError("unauthenticated", "Must sign in");
  const { orderId, points } = request.data;
  await admin.firestore()
    .doc(`users/${request.auth.uid}`)
    .update({ pointBalance: admin.firestore.FieldValue.increment(points) });
  return { newBalance: 1234 };
});
```
```js
// Client (web)
import { getFunctions, httpsCallable } from "firebase/functions";
const fn = httpsCallable(getFunctions(), "addLoyaltyPoint");
const result = await fn({ orderId: "abc", points: 50 });
console.log(result.data.newBalance);
```
> [!tip] 💡
> **Callable** ưu tiên hơn HTTP cho client app vì SDK tự gửi auth token + App Check token + serialize JSON. Tránh viết bằng tay.

## 3️⃣ Pub/Sub trigger
```js
exports.onLoyaltyEvent = onMessagePublished({
  topic: "loyalty-events",
  region: "asia-southeast1",
  retry: true,                     // retry nếu function throw
}, async (event) => {
  const msg = event.data.message;
  const payload = msg.json;        // tự decode JSON
  // hoặc Buffer.from(msg.data, "base64").toString()
  console.log("Got event:", payload);
});
```

## 4️⃣ Firestore trigger
```js
exports.onUserCreated = onDocumentCreated({
  document: "users/{userId}",
  region: "asia-southeast1",
}, async (event) => {
  const userId = event.params.userId;
  const data = event.data.data();
  await admin.firestore().doc(`profiles/${userId}`).set({
    welcomedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
});
```
Trigger types: `onDocumentCreated`, `onDocumentUpdated`, `onDocumentDeleted`, `onDocumentWritten` (any).

---
# 🔧 Config quan trọng
```js
exports.api = onRequest({
  region: "asia-southeast1",       // gần user
  minInstances: 1,                 // tránh cold start (xem [[0-Cold Start]])
  maxInstances: 100,               // chặn runaway scaling
  concurrency: 80,                 // 1 instance ôm 80 req
  cpu: 1,                          // 1 vCPU
  memory: "512MiB",                // 256/512/1Gi/2Gi/4Gi/8Gi/16Gi/32Gi
  timeoutSeconds: 60,              // max 3600 (1h) cho HTTP, 540 cho event
  cpuBoost: true,                  // 2x CPU lúc start, free
  ingressSettings: "ALLOW_INTERNAL_AND_GCLB",  // chỉ qua Load Balancer
  vpcConnector: "my-vpc",          // truy cập VPC private
  secrets: ["SHOPIFY_API_SECRET"], // mount Secret Manager
}, handler);
```

---
# 📦 Codebases — tách function nặng/nhẹ
Vấn đề: tất cả function share `package.json` → install `sharp` (30MB) cho 1 function thì mọi function khác cũng load → cold start chậm cả lốc.
**Fix:** tách thành **codebases**:
```json
// firebase.json
{
  "functions": [
    {
      "source": "functions/api",
      "codebase": "api",
      "runtime": "nodejs22"
    },
    {
      "source": "functions/imaging",
      "codebase": "imaging",
      "runtime": "nodejs22"
    }
  ]
}
```
Mỗi folder có `package.json` riêng → chỉ install dep cần thiết → cold start nhẹ.

---
# 🛒 Joy Loyalty patterns

## Webhook Shopify (HTTP)
```js
const crypto = require("crypto");
exports.shopifyWebhook = onRequest({
  region: "asia-southeast1",
  minInstances: 1,
  cpuBoost: true,
  secrets: ["SHOPIFY_WEBHOOK_SECRET"],
}, async (req, res) => {
  // 1. Verify HMAC signature
  const hmac = req.headers["x-shopify-hmac-sha256"];
  const computed = crypto
    .createHmac("sha256", process.env.SHOPIFY_WEBHOOK_SECRET)
    .update(req.rawBody)
    .digest("base64");
  if (hmac !== computed) return res.status(401).end();

  // 2. Idempotent dedupe (xem [[0-Firestore Basics]])
  const webhookId = req.headers["x-shopify-webhook-id"];
  const ref = admin.firestore().collection("processedWebhooks").doc(webhookId);
  if ((await ref.get()).exists) return res.json({ ok: true });
  await ref.set({ processedAt: new Date() });

  // 3. Process (offload heavy work to Cloud Tasks)
  await enqueueTask({ type: "addLoyaltyPoint", order: req.body });
  res.json({ ok: true });
});
```

## Daily reconcile (scheduled)
```js
const { onSchedule } = require("firebase-functions/v2/scheduler");
exports.dailyReconcile = onSchedule({
  schedule: "every day 02:00",
  timeZone: "Asia/Ho_Chi_Minh",
  region: "asia-southeast1",
}, async () => {
  // chạy job 2h sáng giờ VN
});
```

---
# 📚 Tham khảo
- [Cloud Functions for Firebase docs](https://firebase.google.com/docs/functions) — official, có example mọi trigger.
- [HTTP request triggers](https://firebase.google.com/docs/functions/http-events) — chi tiết `onRequest` + CORS.
- [Callable functions](https://firebase.google.com/docs/functions/callable) — `onCall` + auth token + App Check.
- [Pub/Sub triggers](https://firebase.google.com/docs/functions/pubsub-events) — `onMessagePublished` + retry.
- [Tips & tricks — Cloud Functions docs](https://firebase.google.com/docs/functions/tips) — performance, cold start, codebase.
- [Upgrade v1 → v2 guide](https://firebase.google.com/docs/functions/2nd-gen-upgrade) — migration step-by-step.

---
# ✅ Checklist Cloud Functions v2
- [ ] Project init: `firebase init functions` (JavaScript)
- [ ] Luôn dùng `firebase-functions/v2/*`, không phải v1
- [ ] Set `region` gần user (mặc định `us-central1`)
- [ ] Production: `minInstances: 1, cpuBoost: true`
- [ ] Webhook verify HMAC + idempotent dedupe bằng webhook_id
- [ ] Callable từ client → ưu tiên `onCall` (auto auth + App Check)
- [ ] Tách function nặng (sharp, puppeteer) thành **codebase** riêng
- [ ] Lazy load heavy module trong handler (xem [[0-Cold Start]])
- [ ] Secret từ Secret Manager qua `secrets: [...]`, không hardcode
- [ ] Liên kết: [[0-Cloud Run]], [[0-Cold Start]], [[0-Firestore Basics]]
