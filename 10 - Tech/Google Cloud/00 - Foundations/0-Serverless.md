> [!quote] 💬
> *"Serverless doesn't mean no servers. It means no servers **you** have to think about."*

# 🌥️ Serverless là gì?
**Serverless** = mô hình điện toán mà **bạn không quản lý server** — cloud provider tự lo provision, scale, patch OS, load balance, monitor. Bạn chỉ viết code + config, push lên, provider chạy.
Tên gọi gây hiểu lầm: **vẫn có server thật** chạy code, chỉ là **bị abstract đi** khỏi developer. Bạn không SSH vào, không setup nginx, không lo CPU 100%.

> [!note] 📝 So sánh dễ hiểu
> Serverless giống **Grab** vs sở hữu xe riêng:
> - **VM/server riêng** = bạn mua xe, đổ xăng, bảo dưỡng, đậu xe (kể cả lúc không đi).
> - **Container/Kubernetes** = bạn thuê garage có sẵn xe, vẫn tự lái.
> - **Serverless** = mở app gọi Grab — đi đâu trả đó, không đi không trả tiền, không lo bảo dưỡng.
>
> "Serverless không có server" giống "Grab không có xe" — vẫn có, chỉ không phải xe **của bạn**.

---
# 🧬 4 đặc trưng cốt lõi
## 1️⃣ Event-driven
Code chỉ chạy khi có **event trigger**: HTTP request, file upload, message queue, cron schedule, database change…
```js
// Cloud Functions v2 — trigger bởi HTTP
exports.api = onRequest(async (req, res) => {
  res.json({ ok: true });
});

// Trigger bởi Firestore document tạo mới
exports.onUserCreated = onDocumentCreated("users/{id}", async (event) => {
  // chạy mỗi khi có user mới
});
```

## 2️⃣ Auto-scale 0 → N
Không có request = **0 instance** = $0. Đột nhiên 10.000 request/giây = platform spawn 100+ instance trong vài giây. Hết peak = lại scale về 0.
> [!warning] ⚠️
> Auto-scale 0 = lý do có **cold start** (xem [[1-Cold Start]]). Đây là trade-off cố hữu.

## 3️⃣ Pay-per-use
Tính tiền theo **CPU-second + memory-second + request count** thay vì giờ hosting.
```
VM ($20/tháng cố định)        Serverless (pay-per-use)
├─ Trafic 10 req/ngày = $20    ├─ 10 req/ngày = ~$0.001
└─ Trafic 1M req/ngày = $20    └─ 1M req/ngày = ~$15
   (nhưng có thể quá tải)
```
**Free tier hào phóng** — app nhỏ thường $0/tháng:
- AWS Lambda: 1M request + 400k GB-second/tháng free.
- Google Cloud Functions/Run: 2M request + 360k vCPU-second/tháng free.

## 4️⃣ Stateless
Mỗi instance không giữ state giữa request. Cần state → đẩy ra **bên ngoài** (Firestore, Redis, Cloud Storage).
```js
// ❌ Bad — counter trong memory mất khi instance tắt
let count = 0;
exports.api = onRequest((req, res) => {
  count++;
  res.json({ count });
});

// ✅ Good — state ở Firestore
exports.api = onRequest(async (req, res) => {
  const ref = db.doc("stats/global");
  await ref.update({ count: FieldValue.increment(1) });
  res.json({ count: (await ref.get()).data().count });
});
```

---
# 🔀 FaaS vs BaaS — 2 mặt của Serverless
**Serverless** là khái niệm mẹ, có 2 dạng chính:

## FaaS — Function-as-a-Service
Bạn viết **function ngắn** (1 file, 1 endpoint), platform chạy theo trigger.
- AWS Lambda, **Google Cloud Functions**, Azure Functions, Cloudflare Workers.
- Stateless, cold start, pay-per-execution.

## BaaS — Backend-as-a-Service
Provider cho sẵn **backend service** (DB, auth, storage, push) — bạn không viết backend code, gọi SDK từ frontend.
- **Firebase** (Firestore + Auth + Storage + Hosting), Supabase, AWS Amplify, Appwrite.
- Realtime sync, security rules thay cho REST API tự viết.

> [!tip] 💡
> Joy Loyalty stack = **kết hợp FaaS + BaaS**: Cloud Functions (FaaS) handle webhook + business logic, Firebase (BaaS) lo DB + auth + hosting. Đây là pattern hiện đại — không cần dựng Express server riêng.

---
# 🆚 Serverless vs Container vs VM
| Tiêu chí | VM (GCE/EC2) | Container (Cloud Run/ECS) | Serverless (Functions/Lambda) |
|---|---|---|---|
| Đơn vị deploy | Máy ảo + OS | Container image | Function code |
| Scale | Manual hoặc auto-scale group | Auto 0→N (Cloud Run) | Auto 0→N |
| Cold start | Không | 100ms-1s | 100ms-2s |
| Idle cost | $$$ (24/7) | $0 (nếu min=0) | $0 |
| Long-running OK | ✅ | ✅ (Cloud Run) | ❌ (max 15-60 phút) |
| WebSocket | ✅ | ✅ (Cloud Run) | Hạn chế |
| Quyền root | ✅ | ✅ | ❌ |
| Setup time | Vài chục phút | 5 phút | 5 phút |
| Khi dùng | Database, legacy app, regulated workload | API/web app cần custom runtime | Event-driven, glue logic, webhook |

**Cloud Run** là trường hợp đặc biệt — về mặt billing/scale là serverless, nhưng đơn vị deploy là container → "**serverless container**" (cùng loại với AWS Fargate, Azure Container Apps).

---
# ⚖️ Khi nào dùng Serverless — và khi nào KHÔNG
## ✅ Dùng khi
- **Webhook handler** (Shopify, Stripe…) — traffic không đều, cần scale tự động.
- **Cron job ngắn** — sync data hằng đêm, gửi email, cleanup.
- **Glue logic** — kết nối service A → service B (Pub/Sub → BigQuery, Storage upload → resize).
- **API low-medium traffic** — embedded app, internal tool.
- **MVP/prototype** — không muốn tốn $20/tháng cho 1 server idle.

## ❌ Không dùng khi
- **WebSocket / real-time persistent connection** — function tắt sau response, không giữ socket. Dùng Cloud Run, ECS, hoặc chuyên dụng (Pusher, Ably).
- **CPU/memory cực nặng > 15 phút** (vd ML training, video transcode) — quá timeout, dùng VM/GKE.
- **Latency p99 < 50ms** liên tục — cold start có thể bùng lên 1-2s. Dùng Cloud Run với min-instances cao, hoặc Cloudflare Workers (V8 isolate).
- **State in-memory cần persist** (game server, chat room) — stateless không phù hợp. Dùng container long-lived.
- **Database connection pool** — mỗi cold start = 1 connection mới → drain pool. Workaround: dùng **HTTP-native DB** (Firestore, PlanetScale serverless driver) hoặc connection pooler (RDS Proxy, PgBouncer).

> [!danger] ⛔
> **Anti-pattern phổ biến:** dùng Lambda/Cloud Functions cho **migration script chạy 30 phút** → fail giữa chừng do timeout, không có resume. Migration nặng nên chạy trên VM hoặc Cloud Run job.

---
# 💸 Cost mental model
Công thức cơ bản:
```
Cost ≈ (Request count × $X)
     + (CPU-second × $Y)
     + (Memory-second × $Z)
     + (Network egress × $W)
```
**3 case sample (Cloud Functions v2, 256MiB, 100ms execution):**
| Traffic | Cost/tháng |
|---|---|
| 100k request | **$0** (free tier) |
| 5M request | ~$2 |
| 100M request | ~$60 |
**Cùng app trên VM e2-small (24/7):** ~$13/tháng dù 0 request.
→ Serverless **rẻ hơn nhiều** cho traffic thấp/trung bình. Chỉ đắt hơn khi **traffic rất cao + đều** (>500M req/tháng).

---
# 🛒 Joy Loyalty stack
```
┌─────────────────────────────────────────────┐
│ Shopify Storefront / Embedded App           │
└─────────────────────┬───────────────────────┘
                      │
        ┌─────────────┼─────────────────┐
        ▼             ▼                 ▼
┌──────────────┐ ┌──────────┐  ┌──────────────────┐
│ Cloud Run    │ │ Cloud    │  │ Firebase Hosting │
│ (embedded    │ │Functions │  │ (static asset)   │
│  app API)    │ │(webhook) │  └──────────────────┘
└──────┬───────┘ └────┬─────┘
       │              │
       └──────┬───────┘
              ▼
   ┌──────────────────────┐
   │ Firestore + Auth     │  ← BaaS
   │ Cloud Tasks/Pub-Sub  │  ← FaaS support
   └──────────────────────┘
```
**Đặc điểm Joy:**
- Webhook Shopify burst (100 req/giây lúc sale, 1 req/phút lúc bình thường) → serverless scale tự động phù hợp.
- Merchant nhỏ (free tier) → cost gần $0; merchant lớn (paid plan) cũng chỉ vài $/tháng/merchant.
- Không có WebSocket → không vướng giới hạn FaaS.
- Background job nặng (export CSV 1M dòng) → đẩy sang **Cloud Run job** hoặc **Cloud Tasks** chia nhỏ batch.

---
# 📚 Tham khảo
- [What is Serverless? — AWS](https://aws.amazon.com/what-is/serverless-computing/) — định nghĩa chính thức từ vendor lớn nhất.
- [What is Serverless Computing — Cloudflare Learning](https://www.cloudflare.com/learning/serverless/what-is-serverless/) — giải thích súc tích, nhấn mạnh "no servers" misconception.
- [What is serverless computing — Google Cloud](https://cloud.google.com/discover/what-is-serverless-computing) — góc nhìn GCP, có so sánh với Cloud Run/Functions.
- [Serverless vs Containers — Cloudflare](https://www.cloudflare.com/learning/serverless/serverless-vs-containers/) — bảng trade-off chi tiết.
- 🔥 [Serverless Architecture in 2026 — Middleware.io](https://middleware.io/blog/serverless-architecture/) — case study + xu hướng 2026.
- [Serverless does not mean Lambda or FaaS — Medium](https://medium.com/@pooyan_razian/serverless-does-not-mean-lambda-or-faas-2da350891862) — phân biệt Serverless/FaaS/BaaS rõ ràng.

---
# ✅ Checklist hiểu Serverless
- [ ] Hiểu "no servers" = không quản lý server, vẫn có server thật
- [ ] Phân biệt FaaS (function) vs BaaS (managed backend)
- [ ] Biết 4 đặc trưng: event-driven, auto-scale 0→N, pay-per-use, stateless
- [ ] Biết cold start là trade-off của auto-scale 0 (xem [[1-Cold Start]])
- [ ] Phân biệt Serverless function vs serverless container (Cloud Run, Fargate)
- [ ] Code stateless: state ra Firestore/Redis, không giữ in-memory
- [ ] Tránh dùng cho WebSocket, long-running >15p, CPU/RAM rất nặng
- [ ] Tính cost: request × CPU-s × memory-s, không phải hourly hosting
- [ ] Liên kết: [[1-Cold Start]], [[0-Cloud Run]], [[1-Cloud Functions v2]]
