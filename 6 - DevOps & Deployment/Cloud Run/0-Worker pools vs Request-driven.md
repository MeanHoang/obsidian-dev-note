> [!quote] 💬
> "Worker pools are a distinct resource type well-suited for continuous, non-HTTP, pull-based background processing." — Google Cloud Documentation

## 🎯 Topic là gì
Cloud Run là serverless container platform của GCP — bạn đẩy 1 container Docker lên, GCP lo phần infra (network, scaling, OS). Cloud Run có **3 loại resource** khác nhau, sinh ra cho 3 workload pattern khác nhau:
- **Service** — request-driven (HTTP-triggered)
- **Job** — batch run-to-completion
- **Worker pool** — continuous pull-based background (vừa **GA tháng 4/2026**)

Note này tập trung phân biệt **Service (request-driven)** vs **Worker pool**, vì đây là 2 mô hình hay nhầm khi bạn cần xử lý queue/Pub/Sub.

> [!note] 📝 So sánh dễ hiểu
> - **Service (request-driven)** = nhân viên ngồi quầy. Có khách bấm chuông mới làm việc, không khách thì về nhà ngủ (scale to 0). Không gọi → không tính lương.
> - **Worker pool** = nhân viên kho luôn ở kho. Tự đi lấy việc trên băng chuyền (pull message), không cần ai gọi. Luôn có mặt → luôn tính lương, nhưng bù lại xử lý nhanh + nhiều việc/người.
> - **Job** = freelancer thuê làm 1 task → xong → về.

---

## 🏗️ Request-driven Service
Cách chạy: container chỉ "tỉnh" khi có HTTP request đi vào.
```
Request HTTP → Cloud Run wakes container → handle → response → idle → shutdown
```
**Đặc tính:**
- **Scale to 0**: 0 traffic = 0 instance = $0.
- **Autoscaling tự động** theo concurrent request.
- Có **URL công khai** (hoặc internal) — phải dùng load balancer/IAP để gate.
- **Cold start** mỗi lần wake từ 0.

**Hợp với:** API server, webhook handler từ Shopify/Stripe, frontend SSR (Next.js), AI inference endpoint.

```js
// Joy: webhook order từ Shopify
// app.js — Express service deploy lên Cloud Run service
import express from 'express';
const app = express();
app.post('/webhooks/order-created', async (req, res) => {
  // Shopify gọi vào → container wake (cold start nếu đang ngủ)
  // → xử lý → trả 200
  await processOrder(req.body);
  res.status(200).end();
});
app.listen(8080);
```

> [!warning] ⚠️ Workload pull-based KHÔNG hợp Service
> Service không tự đi lấy việc. Muốn pull Pub/Sub bằng Service, phải fake bằng:
> 1. Cloud Scheduler ping endpoint mỗi N phút → lãng phí cold start.
> 2. Pub/Sub **push subscription** → Pub/Sub gọi HTTP vào Service → mỗi message = 1 cold start nếu đang scale to 0.
> Cả 2 cách đều awkward, latency xấu, code phức tạp hơn.

---

## 🔄 Worker Pool
Cách chạy: container **luôn chạy** (always-on), tự đi pull việc từ queue/topic.
```
Container start → loop: pull message → process → ack → continue
```
**Đặc tính:**
- **Không có URL** — không expose HTTP endpoint, không cần load balancer.
- **KHÔNG autoscale** — bạn **manual** set số instance (scale lên/xuống bằng `gcloud run worker-pools update --instances=N`).
- **Không cold start** giữa các message — container đã chạy rồi, pull tiếp message là xong.
- **Rollout bằng instance split** thay vì traffic split (vd 70% instance chạy revision A, 30% chạy revision B).
- Hỗ trợ **GPU NVIDIA L4 + RTX PRO 6000 Blackwell** từ GA.
- **Rẻ hơn ~40%** so Service/Job cho workload long-running background.

**Hợp với:**
- Pub/Sub **pull** subscription consumer.
- Kafka/RabbitMQ consumer.
- Redis task queue worker.
- GitHub Actions self-hosted runner.
- Distributed LLM training/fine-tuning.

```js
// Joy: consumer Pub/Sub pull message order, tính điểm thưởng
// worker.js — deploy lên Cloud Run worker pool
import { PubSub } from '@google-cloud/pubsub';
const pubsub = new PubSub();
const subscription = pubsub.subscription('order-created-sub');

subscription.on('message', async (msg) => {
  // Container đã chạy sẵn → không cold start
  // Pull batch nhiều message song song
  try {
    await calculateLoyaltyPoints(JSON.parse(msg.data.toString()));
    msg.ack();
  } catch (err) {
    msg.nack(); // retry sau
  }
});

// Container không bao giờ "exit" — luôn nghe message
console.log('Worker pool listening...');
```

---

## 📊 Bảng so sánh

| Tiêu chí | Service (request-driven) | Worker Pool | Job |
|---|---|---|---|
| **Trigger** | HTTP request | Tự pull từ queue | Manual/scheduled run |
| **Có URL** | ✅ | ❌ | ❌ |
| **Scale to 0** | ✅ | ❌ | N/A (run rồi exit) |
| **Autoscale** | ✅ tự động | ❌ manual | N/A |
| **Cold start/msg** | Có | Không | Có lúc start |
| **Pricing model** | Theo request + CPU/memory time | Theo thời gian instance chạy | Theo thời gian execute |
| **Cost (long-running)** | Bình thường | **~40% rẻ hơn** | Bình thường |
| **Use case** | API, webhook, SSR | Pub/Sub pull, Kafka, queue worker | Batch script, ETL |
| **Rollout** | Traffic split (%) | Instance split (%) | Không rollout |
| **GPU** | ✅ | ✅ (L4, Blackwell) | ✅ |

---

## 💡 Khi nào chọn cái nào?

> [!tip] 💡 Cây quyết định
> 1. **Code chạy xong rồi exit** (vd ETL, cron import data) → **Job**.
> 2. **Code phải xử lý HTTP request từ outside** (API/webhook) → **Service**.
> 3. **Code chạy liên tục pull việc từ queue/topic** → **Worker pool** (rẻ + đơn giản hơn nhiều so với Service + push subscription).

> [!warning] ⚠️ Đừng vội chuyển sang Worker Pool nếu:
> - Workload **bursty hiếm** (vd 10 message/ngày): Worker pool luôn chạy = luôn tốn tiền. Service scale-to-0 rẻ hơn.
> - Workload có **HTTP endpoint** cần response (vd Shopify webhook chờ 200): không thay được, vì worker pool không có URL.
> - Bạn cần **autoscaling tự động** theo backlog: worker pool manual scaling, phải tự setup metric + Cloud Scheduler hoặc Kafka Autoscaler để chỉnh `--instances`.

---

## 🛒 Áp dụng cho Joy Loyalty

> [!tip] 💡 Pattern điển hình
> **Flow hiện tại có thể đang là (Service + Pub/Sub push):**
> ```
> Shopify webhook → Cloud Run Service (/webhooks) → publish Pub/Sub
>                                                          ↓
> Pub/Sub PUSH → Cloud Run Service (/process) → tính điểm
> ```
> Mỗi message qua `/process` = 1 HTTP request = có thể cold start.
>
> **Có thể đổi thành (Service vào + Worker pool xử lý):**
> ```
> Shopify webhook → Cloud Run Service (/webhooks) → publish Pub/Sub
>                                                          ↓
> Pub/Sub PULL ← Cloud Run Worker Pool (luôn chạy) → tính điểm batch
> ```
> Lợi: ~40% rẻ hơn cho phần xử lý điểm, không cold start, batch-process nhiều message/container.

> [!danger] ⛔ Lưu ý migration
> - Đổi từ push → pull subscription = phải tạo **subscription mới** (push/pull không đổi qua lại được).
> - Test kỹ logic ack/nack: pull subscription cần ack đúng cách, nack sai → message lặp vô tận.
> - Worker pool **không scale to 0** — set min instance hợp lý (1-2) để tiết kiệm khi tải thấp.

---

## 🧪 Lệnh CLI cơ bản

```bash
# Deploy worker pool từ image
gcloud run worker-pools deploy joy-loyalty-worker \
  --image=gcr.io/PROJECT/loyalty-worker:latest \
  --region=asia-southeast1 \
  --instances=2

# Scale up khi backlog cao
gcloud run worker-pools update joy-loyalty-worker \
  --instances=5 \
  --region=asia-southeast1

# Rollout 30% sang revision mới
gcloud run worker-pools update joy-loyalty-worker \
  --to-revisions=joy-loyalty-worker-002=30 \
  --region=asia-southeast1
```

---

## 📚 Tham khảo
- [Deploy worker pools to Cloud Run](https://docs.cloud.google.com/run/docs/deploy-worker-pools) — docs chính thức GCP, hướng dẫn deploy + config.
- [Manage worker pools](https://docs.cloud.google.com/run/docs/managing/workerpools) — quản lý lifecycle, instance count, rollout.
- 🔥 [Cloud Run worker pools at Estée Lauder Companies](https://cloud.google.com/blog/products/serverless/cloud-run-worker-pools-at-estee-lauder-companies) — case study production: tại sao Estée Lauder migrate từ Service sang Worker pool.
- [Exploring Cloud Run worker pools and Kafka Autoscaler](https://cloud.google.com/blog/products/serverless/exploring-cloud-run-worker-pools-and-kafka-autoscaler) — cách dùng Kafka Autoscaler để auto-scale worker pool theo backlog.
- [Codelab: Worker pool with Pub/Sub pull subscription](https://codelabs.developers.google.com/codelabs/cloud-run/cloud-run-worker-pool-pull-based-subscriptions) — tutorial step-by-step, hands-on code.
- [Deploy a service, job, or worker pool](https://docs.cloud.google.com/deploy/docs/run-targets) — comparison docs cho cả 3 loại resource.

---

## ✅ Checklist
- [ ] Hiểu rõ 3 loại Cloud Run resource: Service / Job / Worker pool
- [ ] Biết Service = request-driven (HTTP, scale to 0), Worker pool = pull-based (always-on, manual scale)
- [ ] Biết Worker pool **không có URL** + **không autoscale** mặc định
- [ ] Biết Worker pool **rẻ hơn ~40%** cho long-running background workload
- [ ] Audit Joy: workload nào đang là Service + Pub/Sub push có thể migrate sang Worker pool + pull subscription
- [ ] Tính trade-off: bursty hiếm → Service tốt hơn (scale-to-0); continuous pull → Worker pool rẻ hơn
- [ ] Biết command cơ bản: `gcloud run worker-pools deploy/update`
- [ ] Test ack/nack logic kỹ trước khi deploy worker pool production
