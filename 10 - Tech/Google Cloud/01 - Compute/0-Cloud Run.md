> [!quote] 💬
> *"If it's in a container, Cloud Run can run it. No YAML, no cluster, no kubectl."*

# 🏃 Cloud Run là gì?
**Cloud Run** = serverless platform chạy **bất kỳ container nào** (Docker image) trên hạ tầng Google. Bạn push image → Google scale 0 → N instance theo request, tính tiền theo CPU-second + memory-second + request count.
Khác Cloud Functions ở:
- Cloud Run: chạy **container** (bất kỳ runtime: Node, Python, Go, Java, Rust, ngay cả binary).
- Cloud Functions v2: chạy **function** (code ngắn, framework lo phần container) — thực ra Functions v2 *được build trên* Cloud Run.

> [!note] 📝 So sánh dễ hiểu
> Cloud Run = **uber container**: bạn đưa "container" (gói hàng) → Google tự "lái" (scale, route, log). Khác **GKE** (tự sở hữu xe Kubernetes), khác **VM** (tự thuê garage). Pay-per-trip thay vì pay-per-month.

---
# 🆚 Cloud Run vs các option khác
| Tiêu chí | Cloud Run | Cloud Functions v2 | GKE | VM (GCE) |
|---|---|---|---|---|
| Đơn vị deploy | Container | Function code | Pod (cluster) | Disk image |
| Cold start | 100ms-1s | 200ms-2s | None (always on) | None |
| Scale 0 | ✅ | ✅ | ❌ | ❌ |
| Custom runtime | ✅ (any binary) | ❌ (Node/Python/Go/Java) | ✅ | ✅ |
| Setup time | 5 phút | 5 phút | Vài giờ | Vài chục phút |
| Giá khi idle | $0 (nếu min=0) | $0 | $$$ | $$$ |

---
# 🛠 Deploy 1 Node.js service trong 5 phút
## 1. Code service (Express)
```js
// server.js
const express = require("express");
const app = express();
app.get("/", (req, res) => res.json({ ok: true, env: process.env.K_SERVICE }));
const port = process.env.PORT || 8080;     // ⚠️ phải đọc PORT từ env
app.listen(port, () => console.log(`Listening on ${port}`));
```
```json
// package.json
{
  "main": "server.js",
  "scripts": { "start": "node server.js" },
  "dependencies": { "express": "^4.18.0" }
}
```

> [!warning] ⚠️
> **BẮT BUỘC đọc `PORT` từ env**, không hardcode. Cloud Run inject `PORT=8080` runtime — hardcode khác sẽ fail health check.

## 2. Dockerfile
```dockerfile
FROM node:22-alpine                # alpine = nhẹ, cold start nhanh
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev              # bỏ devDependencies
COPY . .
ENV NODE_ENV=production
CMD ["node", "server.js"]
```

## 3. Deploy 1 lệnh
```bash
gcloud run deploy joy-api \
  --source . \                                  # build từ local source (Buildpacks)
  --region asia-southeast1 \                    # gần merchant VN/SG
  --allow-unauthenticated \                     # public; bỏ nếu cần IAM
  --min-instances 1 \                           # tránh cold start
  --max-instances 100 \
  --concurrency 80 \                            # 1 instance ôm 80 request
  --cpu 1 --memory 512Mi \
  --cpu-boost                                   # 2x CPU lúc start, free
```
Output: `Service URL: https://joy-api-xxxxx.a.run.app`

---
# ⚙️ Concurrency — đặc trưng Cloud Run
**Concurrency** = số request đồng thời 1 instance xử lý (default 80, max 1000).
| Concurrency | Khi nào dùng |
|---|---|
| 1 | CPU-bound (image processing, ML inference) — request block lẫn nhau |
| 80 | API I/O-bound (default) — Node.js async ngon |
| 200-300 | Pure I/O proxy, gateway |
| 1000 | Stateless cache server (rất hiếm) |

```js
// Test concurrency: nếu handler block (CPU-bound), instance bị nghẹt
app.get("/heavy", (req, res) => {
  // ❌ CPU-bound block event loop → giảm concurrency xuống 1
  for (let i = 0; i < 1e9; i++) {}
  res.json({ done: true });
});

app.get("/light", async (req, res) => {
  // ✅ async I/O → concurrency 80+ chạy ngon
  const data = await fetch("https://api.shopify.com/...").then(r => r.json());
  res.json(data);
});
```

> [!tip] 💡
> Đo p95 latency với concurrency 1, 10, 80, 200 → tìm sweet spot. Quá cao = CPU contention; quá thấp = nhiều instance = tốn tiền.

---
# 💰 Pricing model
**Tính tiền 3 chiều:**
1. **CPU-second:** $0.000024/vCPU-s (chỉ tính lúc xử lý request, "request-based")
2. **Memory-second:** $0.0000025/GiB-s
3. **Request:** $0.40 / 1M request

**2 billing model:**
- **Request-based** (default): chỉ tính tiền lúc xử lý request, idle instance free.
- **Instance-based** (always-allocated): tính tiền 24/7 cho mọi instance — chỉ chọn nếu app cần background work giữa request.

> [!warning] ⚠️
> `--min-instances 1` ở **request-based** mode = idle instance vẫn tính memory ($3-5/tháng) nhưng CPU free → bật cho production.
> `--min-instances 1` ở **instance-based** mode = idle vẫn full price → đắt gấp 10x.

## Free tier (mỗi tháng)
- 2 triệu request
- 360.000 vCPU-second
- 180.000 GiB-second
- 1 GiB egress
→ App nhỏ thường **free** hoàn toàn.

---
# 🔐 Auth options
```bash
# Public (anyone có URL)
gcloud run deploy ... --allow-unauthenticated

# Private — IAM only
gcloud run deploy ... --no-allow-unauthenticated
# Caller cần role roles/run.invoker
```
Trong code, verify caller bằng JWT từ header `Authorization: Bearer <token>`:
```js
import { OAuth2Client } from "google-auth-library";
const client = new OAuth2Client();
app.use(async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  try {
    const ticket = await client.verifyIdToken({ idToken: token });
    req.user = ticket.getPayload();
    next();
  } catch {
    res.status(401).end();
  }
});
```

---
# 🛒 Joy Loyalty pattern: deploy embedded app API
```bash
gcloud run deploy joy-embedded-api \
  --source . \
  --region asia-southeast1 \
  --min-instances 1 \                           # production-critical
  --max-instances 50 \
  --concurrency 80 \
  --cpu 1 --memory 1Gi \                        # 1Gi cho Polaris SSR + Firestore
  --cpu-boost \
  --set-env-vars SHOPIFY_API_KEY=xxx,FIREBASE_PROJECT=joy-prod \
  --service-account joy-api@joy-prod.iam.gserviceaccount.com
```
- `--service-account` → ràng IAM role chính xác (Firestore read, không cho admin).
- `--set-env-vars` → inject Shopify key, Firebase config; **không hardcode** trong image.
- Domain map: `gcloud run domain-mappings create --service joy-embedded-api --domain api.joy.app`

---
# 🔬 Worker pools (mới GA 2026)
**Worker pool** = Cloud Run mode "always-on" (không request-driven), dùng cho:
- Pub/Sub pull subscriber long-lived
- Kafka consumer
- WebSocket server
```bash
gcloud run worker-pools create joy-pubsub-worker \
  --image asia.gcr.io/joy/worker:latest \
  --region asia-southeast1 \
  --min-instances 1 --max-instances 10
```
> [!tip] 💡
> Worker pool **rẻ hơn** Cloud Run service nếu có long-lived connection (WebSocket) vì không tính per-request, chỉ tính CPU/memory time.

---
# 📚 Tham khảo
- [Quickstart: Build & deploy Node.js to Cloud Run — Google docs](https://cloud.google.com/run/docs/quickstarts/build-and-deploy/deploy-nodejs-service) — official, copy-paste được.
- [Configure CPU limits for services — Cloud Run docs](https://docs.cloud.google.com/run/docs/configuring/services/cpu) — giải thích CPU allocation, boost, idle.
- 🔥 [Tune Cloud Run Concurrency Settings — OneUptime 02/2026](https://oneuptime.com/blog/post/2026-02-17-how-to-tune-cloud-run-concurrency-settings-to-maximize-request-throughput-per-instance/view) — bài 2026 mới, có benchmark concurrency 1/10/80/200.
- [Cloud Run Scaling Explained — CloudWebSchool](https://cloudwebschool.com/docs/gcp/compute/cloud-run-scaling-behaviour/) — giải thích trực quan cold start + min/max/concurrency.
- [General development tips — Cloud Run docs](https://docs.cloud.google.com/run/docs/tips/general) — tổng hợp best practice từ Google.
- [Cloud Run vs Lambda vs App Engine — DataCamp](https://www.datacamp.com/tutorial/cloud-run) — so sánh với competitor.

---
# ✅ Checklist Cloud Run
- [ ] Service đọc `process.env.PORT` (không hardcode)
- [ ] Dockerfile dùng base image alpine + `npm ci --omit=dev`
- [ ] Region gần user (`asia-southeast1` cho VN/SG, `us-central1` cho US)
- [ ] Production: `--min-instances 1 --cpu-boost --concurrency 80`
- [ ] Set `--service-account` riêng (không dùng default compute SA)
- [ ] Env var injection qua `--set-env-vars` hoặc Secret Manager
- [ ] Health check OK trên `/` (default 240s timeout)
- [ ] Đo p95 latency theo concurrency, tìm sweet spot
- [ ] Liên kết: [[0-Cold Start]], [[1-Cloud Functions v2]], [[2-Cloud Run vs Functions]]
