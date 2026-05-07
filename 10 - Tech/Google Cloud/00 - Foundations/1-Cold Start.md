> [!quote] 💬
> *"Cold start không phải là bug, đó là cái giá phải trả khi bạn không trả tiền giữ máy chạy 24/7."*

# 🧊 Cold Start là gì?
**Cold start** = khoảng thời gian từ lúc request đầu tiên đến server đến lúc code của bạn thực sự chạy được, **khi container/instance chưa tồn tại** và phải khởi tạo từ đầu.
Đây là vấn đề **chung của mọi serverless platform** — không phải riêng Google Cloud:
- **AWS Lambda**, **Lambda@Edge**
- **Google Cloud Functions**, **Cloud Run**
- **Azure Functions**
- **Cloudflare Workers**, **Vercel Functions**, **Netlify Functions**, **Deno Deploy**

Khi không có request, platform **scale instance về 0** để tiết kiệm tiền. Request mới đến, hệ thống phải:
1. Schedule 1 instance mới (tìm node trống)
2. Pull container image về node đó
3. Khởi động runtime (Node, JVM…)
4. Chạy code init (require/import, kết nối DB, load config)
5. **Mới** xử lý được request

Tổng thời gian này = cold start latency. Request **kế tiếp** trên cùng instance đó là **warm start** (chỉ ~ms).

> [!note] 📝 So sánh dễ hiểu
> Cold start giống **mở quán bánh mì lúc 5h sáng**: phải nướng lò, hâm chảo, lấy nguyên liệu ra (mất 15 phút) trước khi bán được ổ đầu tiên. Khách số 2, số 3 không phải đợi nữa — quán đã "warm". Nhưng nếu bạn đóng cửa nghỉ trưa 2 tiếng, đến chiều mở lại lại phải nướng lò lần nữa.

---
# 🌐 Cold start theo platform
| Platform | Runtime | Cold start trung bình | Cách diệt cold start |
|---|---|---|---|
| **AWS Lambda** | Node, Python, Go | 100ms-1s | Provisioned Concurrency, SnapStart (Java) |
| **AWS Lambda@Edge** | Node | 30-200ms | Bundle nhẹ, ít dep |
| **Google Cloud Run** | Bất kỳ container | 100ms-1s | `--min-instances`, `--cpu-boost`, slim image |
| **Google Cloud Functions v2** | Node, Python, Go | 200ms-2s | `minInstances`, codebases, lazy load |
| **Azure Functions** | Node, .NET, Python | 500ms-3s | Premium plan, Always-On, pre-warmed |
| **Cloudflare Workers** | V8 isolate | **5-10ms** ⭐ | Built-in (không cần làm gì) |
| **Vercel Functions** | Node, Edge | 100ms-1s (Node), 10-50ms (Edge) | Chuyển sang Edge runtime |
| **Deno Deploy** | V8 isolate | **~10ms** ⭐ | Built-in (giống CF Workers) |
| **Netlify Functions** | Node | 200ms-2s | Background functions |

> [!tip] 💡
> **V8 isolate platform (Cloudflare Workers, Deno Deploy)** gần như không có cold start vì không spawn container — chỉ load JS module vào isolate có sẵn. Trade-off: bị giới hạn API (không full Node.js), CPU time max ~50ms/request, không phù hợp work nặng.

---
# 📊 Con số tham khảo (2026)
| Runtime | Cold start trung bình | Warm start |
|---|---|---|
| Node.js (small bundle) | 200-800ms | 5-20ms |
| Node.js (heavy deps) | 1-3s | 5-20ms |
| Python | 500ms-2s | 10-30ms |
| Java/.NET | 3-10s | 10-50ms |
| Cloud Run container (Node) | 300ms-1s | 5-20ms |
Nguồn: blog OneUptime, dev.to, Medium 2026 (xem Tham khảo).

> [!warning] ⚠️
> Cold start **mỗi `require()`/`import` ~10MB dependencies = thêm ~10s** vào cold start time (theo Firebase docs). Đây là kẻ thù lớn nhất với Node.js function.

---
# 🔬 Vòng đời 1 cold start
```
[Request đến]
   │
   ├─► [1] Platform tìm node trống         ~50-200ms
   ├─► [2] Pull container image            ~100-500ms (tuỳ size)
   ├─► [3] Start runtime (node process)     ~50-200ms
   ├─► [4] Module load (require all deps)   ~100-2000ms ⬅ điểm đau nhất
   ├─► [5] Top-level code (init Firestore,
   │       open connection, parse config)   ~50-500ms
   └─► [6] Handler() chạy                   ~5-50ms
```
**Bước 4 + 5** là chỗ developer kiểm soát được. Bước 1-3 là platform.

---
# 🛠 Cách đo cold start
## Cloud Run / Cloud Functions v2
Vào **Cloud Logging** filter:
```
resource.type="cloud_run_revision"
labels."run.googleapis.com/startupLatency" != ""
```
Hoặc dùng metric **`run.googleapis.com/container/startup_latencies`** trong Cloud Monitoring → tạo dashboard p50/p95/p99.
## Đo thủ công trong code
```js
// index.js — Cloud Function
const startTime = Date.now();
console.log(`[BOOT] Module loading at ${startTime}`);
const { getFirestore } = require("firebase-admin/firestore");
console.log(`[BOOT] After firestore import: ${Date.now() - startTime}ms`);
exports.api = async (req, res) => {
  console.log(`[REQ] Handler start: ${Date.now() - startTime}ms`);
  // ...
  res.json({ ok: true });
};
```
Khi xem log, nếu `[REQ] Handler start: 1500ms` mà warm chỉ 5ms → đó là cold start.

---
# 🎯 7 kỹ thuật tối ưu (xếp theo impact)

## 1️⃣ Min instances — Diệt cold start tận gốc
Giữ N instance **luôn warm**, không bao giờ scale về 0.
```bash
# Cloud Run
gcloud run services update my-api --min-instances=1
# Firebase Functions v2
exports.api = onRequest({ minInstances: 1 }, handler);
```
**Cost:** ~$3-5/tháng cho 1 instance idle (memory charge, không tính CPU vì idle).
> [!tip] 💡
> Production service mà SLA quan trọng (vd webhook Shopify, API merchant gọi) → bật `minInstances: 1` luôn. $3/tháng đổi lấy 0 cold start là hời.

## 2️⃣ Concurrency cao (Cloud Functions v2 / Cloud Run)
1 instance xử lý nhiều request cùng lúc → ít cold start hơn vì không cần spawn instance mới cho mỗi request.
```js
// Firebase Functions v2 — default 80 concurrent
exports.api = onRequest({
  concurrency: 80,        // 1 instance ôm 80 request
  cpu: 1,
  memory: "512MiB"
}, handler);
```
> [!warning] ⚠️
> **Concurrency chỉ work nếu code không có shared state mutable**. Nếu bạn dùng global variable kiểu `let cache = {}` rồi mutate trong handler → race condition. Phải dùng `Map` thread-safe hoặc external cache (Redis).

## 3️⃣ Startup CPU Boost
Cấp **2x CPU miễn phí** trong 10 giây đầu instance startup → init nhanh hơn 30-50%.
```bash
gcloud run services update my-api --cpu-boost
```
```js
// Firebase Functions v2
exports.api = onRequest({ cpuBoost: true }, handler);
```
> [!tip] 💡
> **Free** — bật mặc định cho mọi production service. Không có lý do gì để tắt.

## 4️⃣ Lazy load dependencies (impact lớn nhất từ phía code)
Đừng `require()` heavy module ở top-level nếu chỉ dùng cho 1 endpoint hiếm khi gọi.
**❌ Bad — load mọi thứ lúc cold start**
```js
const admin = require("firebase-admin");
const stripe = require("stripe")(process.env.STRIPE_KEY);  // 2MB
const sharp = require("sharp");                             // 30MB!
const PDFDocument = require("pdfkit");                      // 5MB
admin.initializeApp();
exports.api = async (req, res) => {
  if (req.path === "/upload") {
    await sharp(req.body).resize(800).toBuffer();
  }
  // 99% request không cần sharp/pdfkit
};
```
**✅ Good — chỉ load khi thực sự cần**
```js
const admin = require("firebase-admin");  // luôn cần, để top-level
admin.initializeApp();
exports.api = async (req, res) => {
  if (req.path === "/upload") {
    const sharp = require("sharp");  // load lazy, cache module
    await sharp(req.body).resize(800).toBuffer();
  }
};
```
Node.js cache module sau lần `require()` đầu → lần thứ 2 instant.

## 5️⃣ Trim bundle / dependencies
- Xoá `devDependencies` khỏi production build (`npm ci --omit=dev`).
- Audit `node_modules` size: `npx package-size <name>`.
- Thay heavy lib bằng nhẹ hơn: `moment` (300KB) → `dayjs` (7KB), `lodash` (70KB) → import lẻ `lodash/get`.
- Dùng **codebases** (Firebase Functions v2) tách function nặng/nhẹ thành nhiều `package.json` khác nhau.
```js
// firebase.json
{
  "functions": [
    { "source": "functions/api",     "codebase": "api" },     // gọn
    { "source": "functions/imaging", "codebase": "imaging" }  // sharp ở riêng
  ]
}
```

## 6️⃣ Connection pooling — init 1 lần, reuse
Init Firestore/Redis/HTTP client **ngoài handler** để reuse giữa các warm request:
**❌ Bad — tạo mới mỗi request**
```js
exports.api = async (req, res) => {
  const db = getFirestore();  // tạo mới mỗi lần!
  await db.collection("users").get();
};
```
**✅ Good — init top-level, dùng chung**
```js
const { getFirestore } = require("firebase-admin/firestore");
admin.initializeApp();
const db = getFirestore();    // chỉ tạo 1 lần khi cold start
exports.api = async (req, res) => {
  await db.collection("users").get();  // dùng instance đã có
};
```

## 7️⃣ Memory & CPU tier hợp lý
Memory thấp = CPU thấp (Cloud Functions tỉ lệ thuận). Function cold start chậm có thể là do **không đủ CPU** để load module.
```js
// Tăng memory tier nếu cold start > 2s
exports.api = onRequest({
  memory: "1GiB",   // mặc định 256MiB → đôi khi nâng lên 512/1Gi nhanh hơn
  cpu: 1,
}, handler);
```
> [!tip] 💡
> Đo trước khi tăng. Có lúc 256MiB đủ nhưng dependencies nặng → 512MiB cold start nhanh hơn **gấp đôi**. Cost cũng gấp đôi nhưng latency p99 ngon hơn.

---
# 💰 Trade-off Cost vs Latency
| Chiến lược | Cold start giảm | Cost tăng | Khi nào dùng |
|---|---|---|---|
| `minInstances=0` (default) | 0% | $0 | Internal tool, batch job, webhook không SLA |
| `minInstances=1` | ~95% | ~$3-5/tháng | Production API, webhook Shopify |
| `minInstances=3` | ~99% | ~$10-15/tháng | High-traffic, p99 quan trọng |
| `cpuBoost: true` | ~30-50% | $0 | **Luôn bật** |
| Lazy load + trim deps | ~30-70% | $0 | **Luôn làm** |
| Concurrency 80 | giảm số lần spawn | $0 | API stateless |

---
# 🛒 Context Joy Loyalty
- **Webhook Shopify** (vd `orders/paid` để cộng điểm loyalty): nếu cold start 2s → Shopify retry → nguy cơ duplicate point. Bật `minInstances=1` + `cpuBoost`.
- **Admin API gọi từ embedded app**: merchant click → đợi 2s là UX kém. Lazy load Polaris-render path, init Firestore top-level.
- **Background job** (sync metafield, generate report): cold start không quan trọng → để `minInstances=0` tiết kiệm.
- **Discount Function** (Shopify Functions chạy Wasm, không phải Cloud Functions): không có cold start truyền thống nhưng có **cold cache** — vẫn nên cache config metafield trong-memory.

---
# 📚 Tham khảo
- [Faster cold starts with startup CPU Boost — Google Cloud Blog](https://cloud.google.com/blog/products/serverless/announcing-startup-cpu-boost-for-cloud-run--cloud-functions) — bài chính chủ giới thiệu CPU boost, giải thích cơ chế cấp 2x CPU trong 10s đầu.
- [Tips & tricks — Cloud Functions for Firebase docs](https://firebase.google.com/docs/functions/tips) — docs chính thức về best practice giảm cold start, bao gồm lazy load + concurrency.
- [Functions best practices — Cloud Run docs](https://docs.cloud.google.com/run/docs/tips/functions-best-practices) — Google official, focus vào function on Cloud Run v2.
- 🔥 [How to Configure Minimum Instances on Cloud Run (OneUptime, 02/2026)](https://oneuptime.com/blog/post/2026-02-17-how-to-configure-minimum-instances-on-cloud-run-to-eliminate-cold-starts-for-production-services/view) — bài 2026 mới, có benchmark cụ thể cost vs latency cho min-instances.
- [Cloud Run Scaling Explained: Cold Starts, Min/Max Instances, Concurrency — CloudWebSchool](https://cloudwebschool.com/docs/gcp/compute/cloud-run-scaling-behaviour/) — giải thích trực quan cách Cloud Run scale + relationship min/max/concurrency.
- [A Toolkit to Speed Up Firebase Cloud Functions — Medium](https://medium.com/swlh/a-toolkit-to-speed-up-and-optimise-firebase-cloud-functions-part-1-6f74f278660c) — toolkit thực dụng cho Node.js dev, có code mẫu lazy load.

---
# ✅ Checklist tối ưu cold start
- [ ] Đo cold start hiện tại bằng Cloud Logging (`startup_latencies` p95)
- [ ] Bật `cpuBoost: true` (free, luôn nên có)
- [ ] Set `minInstances: 1` cho production-critical service
- [ ] Set `concurrency: 80` (default v2) cho stateless API
- [ ] Lazy load module nặng (`sharp`, `pdfkit`, `puppeteer`) chỉ khi endpoint cần
- [ ] Init Firestore/Redis client **ngoài** handler, reuse giữa các request
- [ ] Audit `node_modules` size, thay thư viện nặng bằng alternative nhẹ
- [ ] Tách function nặng/nhẹ thành **codebases** riêng
- [ ] Build với `npm ci --omit=dev` để loại devDependencies
- [ ] Re-đo p95 cold start sau optimize, so sánh trước/sau
