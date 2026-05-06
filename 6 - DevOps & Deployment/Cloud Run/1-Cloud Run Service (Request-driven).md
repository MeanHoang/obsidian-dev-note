> [!quote] 💬
> "Cloud Run is a fully managed compute platform that lets you run containers directly on top of Google's scalable infrastructure." — Google Cloud Documentation

## 🎯 Cloud Run Service là gì
**Cloud Run Service** là 1 trong 3 loại resource của Cloud Run, dành riêng cho workload **request-driven** — tức là code của bạn chỉ chạy khi có **HTTP request** (hoặc gRPC, WebSocket) đi vào. Không request → container ngủ. Có request → container thức dậy xử lý.
Đây là loại resource phổ biến nhất, được dùng cho API server, webhook handler, Next.js SSR, AI inference endpoint, v.v.

> [!note] 📝 So sánh dễ hiểu
> Cloud Run Service giống như **nhân viên trực điện thoại tổng đài** — chỉ làm việc khi có cuộc gọi đến. Không có cuộc gọi thì về nhà ngủ (scale to 0, không tính lương). Khi có cuộc gọi đầu tiên thì phải mất chút thời gian tỉnh dậy, mở máy, đăng nhập (cold start). Khi đông cuộc gọi quá thì tổng đài tự thuê thêm nhân viên (autoscale).

---

## 🏗️ Kiến trúc nội tại

Cloud Run Service được cấu thành từ 5 lớp:

### 1️⃣ Service (logical resource)
Là grouping cấp cao — có **endpoint URL ổn định** (vd `https://joy-api-abc123-as.a.run.app`). URL này không đổi qua các lần deploy. Service quản lý 1+ Revision và route traffic giữa chúng.

### 2️⃣ Revision (immutable snapshot)
Mỗi lần bạn deploy code mới = tạo 1 **revision mới** (vd `joy-api-00042-xyz`). Revision **immutable** — đã tạo là không sửa được. Revision lưu:
- Container image (Docker)
- Config: env var, CPU/memory, concurrency, min/max instance, timeout, secret mount.

### 3️⃣ Traffic Split
Service có thể chia traffic giữa nhiều revision (canary deploy):
```
joy-api Service
├── revision-00042 (90% traffic) ← stable
└── revision-00043 (10% traffic) ← canary
```

### 4️⃣ Container Instance (ephemeral worker)
Là **process container thật** đang chạy code của bạn. 1 revision có thể có **0 → N instance** tuỳ traffic. Mỗi instance:
- Có vCPU + memory riêng (theo config revision).
- Xử lý request đến với concurrency cấu hình (mặc định 80).
- Bị **shutdown** khi idle quá lâu hoặc auto-scale xuống.

### 5️⃣ Control Plane + Networking
- **Control plane**: Google quản lý — provision instance, route traffic, autoscale, IAM check.
- **Networking**: Load balancer + TLS termination + optional VPC egress (Cloud NAT, VPC connector).

---

## 🔄 Request lifecycle (theo timeline)

```
[1] Developer push image + create revision
        ↓
[2] User/external service gửi HTTPS request đến URL service
        ↓
[3] Load balancer + TLS termination tại edge
        ↓
[4] Control plane check: có instance warm không?
    ├── CÓ → route đến instance đó (warm path, ~10-50ms overhead)
    └── KHÔNG → cold start: provision instance mới
        ↓
[5] Instance handle request (theo concurrency setting)
        ↓
[6] Trả response → user
        ↓
[7] Instance idle. Nếu không request mới trong vài phút → terminate
        ↓
[8] Service về 0 instance (nếu min-instances=0)
```

> [!tip] 💡 Stable URL không liên quan instance lifecycle
> URL service ổn định mãi mãi dù instance liên tục scale up/down. Cloud Run Frontend Load Balancer là layer abstraction giữa URL và instance — bạn cứ POST/GET, GCP lo route.

---

## 🥶 Cold Start chi tiết

**Cold start** = khoảng thời gian từ khi request đến mà chưa có instance warm cho đến khi instance mới sẵn sàng xử lý request đó.

### Cấu phần thời gian cold start
1. **Image pull** (nếu image chưa cached trên node) — vài trăm ms tới vài giây.
2. **Container boot** (Linux init, container runtime start).
3. **Application init** — code khởi động: import lib, đọc config, connect DB, warm cache.
4. **Listen on PORT** — Cloud Run check `0.0.0.0:$PORT` đã listen chưa, sau đó mới gửi request đầu.

### Số liệu thực tế
- **Lean Go binary**: ~200ms.
- **Node.js + Express vừa phải**: 1-3 giây.
- **Java + Spring Boot heavy DI**: 5-15 giây.
- **Median Cloud Run workload**: 1-3 giây.

### Mitigation
| Chiến lược | Cách làm | Trade-off |
|---|---|---|
| **Min instances** | `--min-instances=1` (hoặc N) | Luôn có instance warm → không cold start, **luôn tính tiền** N×CPU 24/7. |
| **Startup CPU boost** | `--cpu-boost` | Cấp gấp đôi CPU trong 10s đầu để boot nhanh hơn. Free, không tính thêm tiền. |
| **Lazy init** | Defer import + DB connect cho đến khi cần | Code phức tạp hơn, request đầu vẫn chậm. |
| **Lighter image** | Multi-stage Dockerfile, distroless base | Giảm image pull time. |
| **Concurrent boot** | Set concurrency cao, ít instance hơn | Cold start ít xảy ra hơn vì 1 instance gánh nhiều request. |

```dockerfile
# Ví dụ Dockerfile lean cho Node.js Joy API
FROM node:20-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .

FROM gcr.io/distroless/nodejs20-debian12
COPY --from=builder /app /app
WORKDIR /app
EXPOSE 8080
CMD ["index.js"]
```

---

## 🧮 Concurrency model

**Concurrency** = số request **đồng thời** mà 1 instance có thể xử lý.

### Mặc định
- **CLI/Terraform deploy**: `concurrency = 80 × vCPU` (1 vCPU → 80, 2 vCPU → 160).
- **Console deploy**: 80 cố định.
- **Tối đa**: 1000.
- **Tối thiểu**: 1 (mỗi instance 1 request — giống AWS Lambda).

### Tác động
```
Concurrency thấp (1):
- Mỗi instance handle 1 request → cần nhiều instance hơn
- Tránh contention nội bộ (dùng cho code không thread-safe)
- Cost cao hơn

Concurrency cao (80-1000):
- Ít instance hơn cho cùng tải → cost thấp hơn
- Yêu cầu code async/non-blocking, không có shared mutable state
```

> [!warning] ⚠️ Code có shared state là bom hẹn giờ
> Nếu Node.js code dùng global variable (vd cache trong RAM, counter), khi concurrency=80 thì 80 request **ghi cùng 1 biến** → race condition. Best practice: stateless hoàn toàn, state bên ngoài (Redis, Firestore).

---

## 📈 Autoscaling

Cloud Run Service có **2 cơ chế** autoscale chạy song song:

### 1️⃣ Metrics-based scaling
Đo trung bình:
- **CPU utilization** của các instance đang chạy (target ~60%).
- **Concurrent request** trung bình per instance (target ~ concurrency setting).

Cái nào **vượt threshold trước** sẽ trigger thêm instance.

### 2️⃣ On-demand scaling
Khi traffic spike đột ngột mà không instance nào sẵn sàng → spawn instance mới ngay (kèm cold start cho request đó).

### Knob cấu hình
```bash
gcloud run deploy joy-api \
  --image=gcr.io/PROJECT/joy-api:latest \
  --min-instances=0 \         # 0 = scale to zero, N = giữ N warm 24/7
  --max-instances=100 \       # cap để tránh runaway scaling tốn tiền
  --concurrency=80 \          # request/instance
  --cpu=1 \
  --memory=512Mi \
  --timeout=300 \             # max 60 phút (3600s)
  --cpu-boost                 # tăng CPU trong startup
```

> [!tip] 💡 Set max-instances là kỷ luật cost
> Default max là 100. Nếu app bị DDoS hoặc bug infinite-loop request → tự scale tới 100 instance, bill bay 1000$/giờ. Set max thấp (vd 20) cho service ít quan trọng để có hard cap.

---

## 💻 Code example: Joy webhook handler

```js
// index.js — Express service deploy lên Cloud Run
import express from 'express';
import { Firestore } from '@google-cloud/firestore';

const app = express();
const db = new Firestore(); // Reuse connection across requests

// Lazy init heavy stuff để cold start nhanh
let _shopifyClient;
async function getShopifyClient() {
  if (!_shopifyClient) {
    const { Shopify } = await import('@shopify/shopify-api');
    _shopifyClient = new Shopify(/* config */);
  }
  return _shopifyClient;
}

// Webhook từ Shopify
app.post('/webhooks/order-created', express.json(), async (req, res) => {
  // Verify HMAC, etc.
  const order = req.body;

  // Ghi event vào Firestore (idempotent qua orderId)
  await db.collection('orders').doc(order.id.toString()).set(order);

  // Trả 200 ngay — Shopify chỉ chờ ack, work nặng đẩy qua Pub/Sub
  res.status(200).end();
});

// Cloud Run inject PORT env var
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Listening on ${PORT}`));
```

```yaml
# service.yaml (Knative-style)
apiVersion: serving.knative.dev/v1
kind: Service
metadata:
  name: joy-api
  annotations:
    run.googleapis.com/launch-stage: GA
spec:
  template:
    metadata:
      annotations:
        autoscaling.knative.dev/minScale: "1"  # 1 warm instance
        autoscaling.knative.dev/maxScale: "50"
        run.googleapis.com/cpu-boost: "true"
    spec:
      containerConcurrency: 80
      timeoutSeconds: 60
      containers:
        - image: gcr.io/joy-loyalty/joy-api:latest
          ports:
            - containerPort: 8080
          env:
            - name: NODE_ENV
              value: production
          resources:
            limits:
              cpu: "1"
              memory: 512Mi
```

---

## 🛒 Checklist tối ưu cho Joy

> [!tip] 💡 Best practice cho Cloud Run Service ở Joy
> - **Stateless 100%** — không lưu session/cache trong RAM. State đẩy Firestore/Redis.
> - **Min-instances ≥ 1** cho service có user-facing traffic (admin app, embedded UI) để tránh cold start làm xấu UX.
> - **Min-instances = 0** cho webhook handler ít gọi (vd uninstall app webhook) để tiết kiệm.
> - **Concurrency 80-100** cho Express/Fastify Node.js — code Node async tốt, gánh được nhiều req.
> - **Concurrency 1** chỉ khi code có shared mutable state hoặc CPU-bound nặng (vd image processing).
> - **Set max-instances** explicit để tránh bill bay.
> - **CPU boost** bật mặc định cho mọi service — free.
> - **Lazy init** module nặng (Shopify SDK, Stripe SDK) bằng dynamic `import()`.
> - **Distroless base image** cho production để giảm image pull + attack surface.

---

## 📚 Tham khảo
- [What is Cloud Run](https://docs.cloud.google.com/run/docs/overview/what-is-cloud-run) — docs chính thức, định nghĩa cả 3 resource type.
- 🔥 [About instance autoscaling in Cloud Run services](https://docs.cloud.google.com/run/docs/about-instance-autoscaling) — chi tiết 2 cơ chế scaling, signal CPU vs concurrency.
- [Maximum concurrent requests for services](https://docs.cloud.google.com/run/docs/about-concurrency) — concurrency model + công thức 80×vCPU.
- 🔥 [Cloud Run Scaling Explained: Cold Starts, Min/Max Instances, Concurrency](https://cloudwebschool.com/docs/gcp/compute/cloud-run-scaling-behaviour/) — bài tổng hợp dễ hiểu, có biểu đồ.
- [Mitigating Cold Starts on Cloud Run — 3 strategies](https://medium.com/google-cloud/3-solutions-to-mitigate-the-cold-starts-on-cloud-run-8c60f0ae7894) — Guillaume Blaquiere (GDE), 3 cách giảm cold start kèm benchmark.
- [Cloud Run min_instances: Cold Start vs Cost Tradeoff](https://cloudguard.dev/blog/cloud-run-min-instances) — phân tích trade-off của `min-instances`.
- [Unofficial Cloud Run FAQ — ahmetb](https://github.com/ahmetb/cloud-run-faq) — FAQ siêu đầy đủ từ Ahmet Alp Balkan (cựu Cloud Run PM).
- [General development tips](https://cloud.google.com/run/docs/tips/general) — best practice chính thức từ Google.

---

## ✅ Checklist
- [ ] Hiểu kiến trúc 5 lớp: Service → Revision → Traffic Split → Instance → Control Plane
- [ ] Biết request lifecycle 8 bước, đặc biệt cold path vs warm path
- [ ] Biết cold start là gì + 4 cấu phần thời gian
- [ ] Đã thử min-instances + cpu-boost trên ít nhất 1 service Joy
- [ ] Hiểu concurrency model: default 80×vCPU, max 1000
- [ ] Biết khi nào nên set concurrency=1 (shared state hoặc CPU-bound)
- [ ] Hiểu 2 cơ chế autoscaling: metrics-based + on-demand
- [ ] Đã set max-instances explicit cho mọi service tránh bill bay
- [ ] Code stateless 100%, lazy init module nặng
- [ ] Dùng distroless base image cho production
