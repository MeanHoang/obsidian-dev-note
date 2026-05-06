> [!quote] 💬
> "Worker pools provide an always-on environment where the worker pool instances pull tasks or messages from a queue at their own pace, providing built-in backpressure that protects your infrastructure from crashing under load." — Google Cloud Blog

## 🎯 Cloud Run Worker Pool là gì
**Worker Pool** là loại Cloud Run resource **GA tháng 4/2026**, sinh ra cho workload **không phải HTTP** — code chạy liên tục ở background, **tự đi pull việc** từ queue/topic thay vì chờ request đến.
Khác biệt then chốt: worker pool **không có URL endpoint**, **không autoscale tự động**, và **không scale to zero**. Đổi lại được **~40% rẻ hơn** Service/Job cho workload long-running và **không cold start** giữa các message.

> [!note] 📝 So sánh dễ hiểu
> Worker Pool giống như **công nhân trong dây chuyền sản xuất**. Họ luôn đứng tại trạm, **tự lấy linh kiện trên băng chuyền** (pull message), lắp xong thì lấy tiếp — không cần ai gọi. Quản đốc (admin) phải **thuê thêm hoặc cho nghỉ** thủ công khi tải đổi (manual scaling). Để tự động hơn, có thể setup hệ thống đếm linh kiện trên băng chuyền rồi báo quản đốc (autoscaler dựa metric).

---

## 🏗️ Kiến trúc nội tại

### 1️⃣ Worker Pool (logical resource)
Là grouping cấp cao chứa N instance container chạy cùng image. Khác Service:
- **Không có URL công khai** (không gắn được Load Balancer/IAP/Custom domain).
- **Không có traffic split** — thay bằng **instance split**.

### 2️⃣ Revision
Giống Service: mỗi deploy mới = revision mới (immutable). Lưu image + config (CPU, memory, env, secret).

### 3️⃣ Instance Split (rollout pattern riêng)
Worker pool rollout bằng cách chia **% instance** chạy revision nào:
```
joy-loyalty-worker (4 instances)
├── revision-001: 3 instance (75%) ← stable
└── revision-002: 1 instance (25%) ← canary
```
Khác Service rollout bằng % traffic — vì không có HTTP request để route.

### 4️⃣ Container Instance (always-on)
- **Luôn chạy** sau khi deploy. Không idle-shutdown như Service.
- **Không nhận HTTP request** từ outside — Cloud Run không expose port ra ngoài.
- Bạn phải code container tự đi lấy việc (subscribe Pub/Sub pull, poll Kafka, v.v.).

### 5️⃣ Networking
- **Outbound only** mặc định — code call ra Pub/Sub/Kafka/DB bình thường.
- VPC connector + Cloud NAT khi cần truy cập private resource.
- **Không có inbound endpoint** → giảm attack surface (không lo public URL bị scan).

---

## 🔄 Lifecycle (theo timeline)

```
[1] Developer push image + create worker pool revision
        ↓
[2] Set --instances=N (vd 2)
        ↓
[3] Cloud Run provision N container instance, chạy luôn
        ↓
[4] Container code tự subscribe Pub/Sub pull / Kafka topic
        ↓
[5] Loop forever:
    │   pull batch message → process → ack/commit → pull tiếp
    │
    └── Backpressure tự nhiên: chỉ pull khi sẵn sàng, không bị overwhelm
        ↓
[6] Admin scale up/down: gcloud run worker-pools update --instances=K
        ↓
[7] Deploy revision mới → instance split rollout
```

> [!tip] 💡 Backpressure là điểm mạnh
> Pull-based = consumer chủ động kéo theo tốc độ của mình. Producer (Pub/Sub) giữ message lại, không bị flood consumer. Push-based (Service + Pub/Sub push) ngược lại — Pub/Sub push hết tốc độ, consumer phải tự throttle bằng `max_concurrent_dispatches` hoặc bị 429.

---

## 🪝 Pull subscription pattern

### Pub/Sub pull
Consumer dùng client lib `@google-cloud/pubsub`, gọi `subscription.on('message', ...)`. Lib này:
- Mở **streaming pull connection** (gRPC long-lived) tới Pub/Sub.
- Pub/Sub đẩy message qua stream xuống consumer.
- Consumer ack/nack từng message.
- Lib tự manage flow control, retry, dead-letter.

```js
// worker.js — chạy trên worker pool
import { PubSub } from '@google-cloud/pubsub';

const pubsub = new PubSub();
const subscription = pubsub.subscription('order-created-sub', {
  flowControl: {
    maxMessages: 100,        // Pull tối đa 100 msg in-flight 1 lúc
    maxBytes: 10 * 1024 * 1024, // 10MB buffer
  },
  ackDeadline: 60,           // Ack trong 60s, không sẽ redelivered
});

subscription.on('message', async (msg) => {
  try {
    const order = JSON.parse(msg.data.toString());
    await calculateLoyaltyPoints(order);
    msg.ack();              // Confirm đã xử lý
  } catch (err) {
    console.error('Process failed:', err);
    msg.nack();             // Pub/Sub redeliver
  }
});

subscription.on('error', (err) => {
  console.error('Subscription error:', err);
  // Worker pool sẽ restart container nếu process crash
  process.exit(1);
});

console.log('Worker started, listening for messages...');
// Process không exit — đây là intended behavior cho worker pool
```

### Kafka consumer
Tương tự Pub/Sub nhưng dùng `kafkajs` hoặc `node-rdkafka`:
```js
import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'joy-loyalty',
  brokers: [process.env.KAFKA_BROKER],
});
const consumer = kafka.consumer({ groupId: 'loyalty-group' });

await consumer.connect();
await consumer.subscribe({ topic: 'order-events', fromBeginning: false });
await consumer.run({
  eachMessage: async ({ message }) => {
    const order = JSON.parse(message.value.toString());
    await calculateLoyaltyPoints(order);
    // Auto-commit offset trừ khi disable
  },
});
```

### Sidecar mode (cho legacy code chỉ biết HTTP)
Nếu code business logic vốn là **HTTP server**, không muốn rewrite thành pull consumer, GCP có **sidecar pattern**:
```
┌── Worker Pool Instance ──────────────────┐
│                                          │
│  ┌── Sidecar (Pub/Sub pull worker) ──┐   │
│  │  pull msg → POST localhost:8080   │   │
│  └────────────────────────────────────┘   │
│             ↓ HTTP local                  │
│  ┌── Your existing HTTP business logic ┐  │
│  │  Express app listen 8080            │  │
│  │  Receive Pub/Sub push JSON format   │  │
│  └─────────────────────────────────────┘   │
│                                          │
└──────────────────────────────────────────┘
```
Sidecar GCP-managed pull message từ Pub/Sub → forward HTTP nội bộ tới container business logic dưới dạng **Pub/Sub push subscription JSON format** → bạn tận dụng được code Express cũ mà không cần đổi.

---

## 📈 Scaling: hoàn toàn manual (mặc định)

```bash
# Scale lên/xuống thủ công
gcloud run worker-pools update joy-loyalty-worker \
  --instances=5 \
  --region=asia-southeast1
```

> [!warning] ⚠️ Worker pool KHÔNG tự scale theo backlog
> Khác Service đo CPU/concurrency tự thêm instance, worker pool **đứng yên** ở số instance bạn set, dù backlog Pub/Sub có nhân lên 1 triệu message.

### Custom autoscaler — 2 lựa chọn chính thức từ GCP

#### A. CREMA (Cloud Run External Metrics Autoscaler) — cho Pub/Sub
GCP cung cấp **CREMA**: Cloud Scheduler trigger 1 Cloud Run service mỗi N giây → service đọc metric Pub/Sub backlog → tính số instance tối ưu → gọi `worker-pools update --instances`.

```
┌── Cloud Scheduler (mỗi 30s) ──┐
        ↓
┌── CREMA autoscaler service ──┐
│  read pubsub_undelivered_msg │
│  compute target instances    │
│  call API update --instances │
└──────────────────────────────┘
        ↓
┌── joy-loyalty-worker pool ──┐
│  scale 2 → 8 → 3 → ...      │
└─────────────────────────────┘
```

#### B. Kafka Autoscaler — cho Kafka consumer
Dùng `cloud-run-kafka-scaler` (GCP open source): đọc **Kafka consumer lag** → scale instance theo lag.

> [!tip] 💡 Worker pool + Kafka Autoscaler là combo Google khuyên
> Doc Cloud Run nói: "Kafka Autoscaler can scale Kafka consumers running as either Cloud Run services or worker pools, but **worker pools are strongly recommended** as they are 40% cheaper than comparable instance-billed services."

---

## 💰 Pricing model riêng

Worker pool tính tiền **theo thời gian instance chạy** (always-on), không theo số request:
- Bill = `instance_count × (vCPU + memory) × thời_gian_chạy`.
- **CPU/memory tính 24/7** kể cả khi instance idle — nhưng vì code luôn pull message nên hiếm khi idle thật.
- **Không có request fee** (Service tính thêm $0.40/M request).
- **Rẻ hơn ~40%** Service cho cùng workload long-running theo Google.

Lý do rẻ hơn: Service phải dự phòng capacity cho cold start + spike → bill conservative. Worker pool đã always-on → bill chính xác hơn theo thời gian thực dùng.

---

## 🎮 GPU support
Worker pool ở GA support:
- **NVIDIA L4** (inference cost-efficient).
- **NVIDIA RTX PRO 6000 Blackwell** (training + heavy inference, 96GB VRAM).

Use case GCP nhắm: **distributed LLM training/fine-tuning**, batch inference pipeline. Service cũng có GPU nhưng worker pool hợp hơn vì training job chạy hàng giờ, không phải request-driven.

---

## 🛠️ CLI cơ bản

```bash
# Deploy lần đầu
gcloud run worker-pools deploy joy-loyalty-worker \
  --image=gcr.io/PROJECT/loyalty-worker:latest \
  --region=asia-southeast1 \
  --instances=2 \
  --cpu=1 \
  --memory=512Mi \
  --service-account=worker-sa@PROJECT.iam.gserviceaccount.com \
  --set-env-vars=PUBSUB_SUBSCRIPTION=order-created-sub

# Update instance count
gcloud run worker-pools update joy-loyalty-worker \
  --instances=5 \
  --region=asia-southeast1

# Deploy revision mới với instance split
gcloud run worker-pools update joy-loyalty-worker \
  --to-revisions=joy-loyalty-worker-002=25 \
  --region=asia-southeast1   # 25% instance chạy v002, 75% chạy v001

# Inspect
gcloud run worker-pools describe joy-loyalty-worker \
  --region=asia-southeast1

# Logs
gcloud run worker-pools logs read joy-loyalty-worker \
  --region=asia-southeast1 \
  --limit=50
```

### Terraform
```hcl
resource "google_cloud_run_v2_worker_pool" "loyalty_worker" {
  name     = "joy-loyalty-worker"
  location = "asia-southeast1"

  template {
    containers {
      image = "gcr.io/${var.project}/loyalty-worker:latest"
      resources {
        limits = {
          cpu    = "1"
          memory = "512Mi"
        }
      }
      env {
        name  = "PUBSUB_SUBSCRIPTION"
        value = google_pubsub_subscription.order_created.name
      }
    }
    service_account = google_service_account.worker.email
  }

  scaling {
    instance_count = 2
  }
}
```

---

## 🛒 Áp dụng cho Joy Loyalty

> [!tip] 💡 Use case ở Joy
> - **Consumer Pub/Sub order events**: Shopify webhook → Service handler trả 200 → publish Pub/Sub → worker pool pull → tính điểm thưởng + ghi Firestore. Bỏ overhead cold start, batch process nhiều order.
> - **Background sync**: định kỳ pull data từ Shopify Bulk Operations API (long-running, kết quả vài phút sau) — worker pool poll status mỗi 10s đến khi xong.
> - **Email/notification queue worker**: pull job từ Pub/Sub `notifications` → send qua SendGrid/Postmark → ack.
> - **AI feature inference** (sau này): pull request từ queue → run Gemini/Claude inference → ghi result. Tận dụng GPU L4 nếu cần.

> [!warning] ⚠️ Lưu ý migration từ Pub/Sub push
> - Push subscription và pull subscription **không đổi qua lại được** — phải tạo **subscription mới**.
> - Code lib khác hoàn toàn (push = HTTP handler, pull = client lib subscribe).
> - Test ack/nack kỹ: pull subscription bắt buộc consumer ack đúng cách, nack/timeout sai → message redelivered.
> - Worker pool **không scale to 0** → set min ≥ 1 nhưng cũng không quá thấp khi tải cao (hoặc setup CREMA).

> [!danger] ⛔ Đừng dùng worker pool nếu:
> - Workload **request-driven** (cần response cho client) → dùng Service.
> - Tải **bursty hiếm**, vd 10 message/ngày → worker pool 1 instance × 24h tốn hơn Service scale-to-0.
> - Cần **HTTP endpoint** cho healthcheck/admin → worker pool không có URL công khai (vẫn có internal HTTP nhưng phức tạp).

---

## 📚 Tham khảo
- 🔥 [Deploy worker pools to Cloud Run](https://docs.cloud.google.com/run/docs/deploy-worker-pools) — docs chính thức GCP, hướng dẫn deploy đầy đủ.
- [Manage worker pools](https://docs.cloud.google.com/run/docs/managing/workerpools) — quản lý lifecycle, instance split, rollout.
- [Cloud Run worker pools at Estée Lauder Companies](https://cloud.google.com/blog/products/serverless/cloud-run-worker-pools-at-estee-lauder-companies) — case study production thực tế cho agentic workload.
- 🔥 [Codelab: Worker pool with Pub/Sub pull subscription](https://codelabs.developers.google.com/codelabs/cloud-run/cloud-run-worker-pool-pull-based-subscriptions) — hands-on tutorial step-by-step.
- [Codelab: Autoscale worker pool với CREMA + Pub/Sub](https://codelabs.developers.google.com/codelabs/cloud-run/crema-autoscaler-pubsub-workerpool) — setup auto-scaling theo backlog.
- [Exploring Cloud Run worker pools and Kafka Autoscaler](https://cloud.google.com/blog/products/serverless/exploring-cloud-run-worker-pools-and-kafka-autoscaler) — combo worker pool + Kafka, có architecture diagram.
- [GitHub: cloud-run-pubsub-pull example](https://github.com/GoogleCloudPlatform/cloud-run-pubsub-pull) — code mẫu của Google cho autoscaling consumer.
- [GitHub: cloud-run-kafka-scaler](https://github.com/GoogleCloudPlatform/cloud-run-kafka-scaler) — buildable image scale Kafka consumer trên Cloud Run.
- [Autoscale worker pools based on Pub/Sub queue volume](https://docs.cloud.google.com/run/docs/tutorials/autoscale-workerpools-pubsub) — tutorial chính thức.
- [The Surprising Simplicity of Temporal Worker Pools on Cloud Run](https://dev.to/gbostoen/the-surprising-simplicity-of-temporal-worker-pools-on-cloud-run-14db) — pattern dùng Temporal trên worker pool.

---

## ✅ Checklist
- [ ] Hiểu worker pool **always-on, không URL, không autoscale mặc định, không scale to 0**
- [ ] Hiểu lifecycle: provision N instance → loop pull message → ack
- [ ] Biết pull subscription pattern Pub/Sub (`@google-cloud/pubsub` streaming pull)
- [ ] Biết flowControl options: `maxMessages`, `maxBytes`, `ackDeadline`
- [ ] Hiểu sidecar mode khi muốn tận dụng HTTP business logic cũ
- [ ] Biết **manual scaling** + 2 custom autoscaler (CREMA cho Pub/Sub, Kafka Autoscaler)
- [ ] Hiểu instance split rollout (khác traffic split của Service)
- [ ] Biết pricing: theo instance time, không có request fee, ~40% rẻ hơn Service
- [ ] Biết GPU GA: L4 + RTX PRO 6000 Blackwell
- [ ] Code worker stateless, ack/nack đúng cách, exit khi crash để Cloud Run restart
- [ ] Set service account riêng với IAM tối thiểu (chỉ subscriber + writer cần thiết)
- [ ] Identify được workload Joy phù hợp migrate từ Pub/Sub push → worker pool pull
