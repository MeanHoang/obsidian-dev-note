> [!quote] 💬
> *"The cloud is just someone else's computer — but with someone else's bill."*

# 🗺️ Map of Content — Google Cloud
Index toàn bộ note về Firebase + Google Cloud, tổ chức theo 7 nhóm dùng ở Joy Loyalty (Shopify app stack).

> 📖 **Tra nhanh thuật ngữ:** [[Glossary]] (provisioning, idempotent, p99, SLO/SLA, throttling, …)

---
## 🧭 Cách dùng folder này
- Mỗi subfolder = 1 nhóm chức năng (giống cách Google docs phân loại).
- File đánh số `0-`, `1-`… → **đọc theo thứ tự** sẽ build kiến thức từ basic → advanced.
- File trong `00 - Foundations` là **concept xuyên service** (cold start, IAM, region) — đọc trước khi đi sâu service nào.
- File `_MOC.md` này luôn ở root, link đến mọi note để Obsidian graph hiển thị quan hệ.

---
## 🏗️ Kiến trúc tổng thể (Joy Loyalty stack)
```
[Shopify Storefront]
        │
        ▼
[Embedded App (Polaris/React)] ──► [Cloud Run / Functions v2] ──► [Firestore]
                                            │                          │
                                            │                          └─► Security Rules
                                            ├─► [Cloud Tasks] (async job)
                                            ├─► [Pub/Sub] (event fan-out)
                                            ├─► [Firebase Auth] (merchant session)
                                            └─► [Cloud Storage] (export, asset)

[BigQuery] ◄── [Pub/Sub] ◄── analytics event
[Cloud Logging + Monitoring] ◄── log mọi service
```

---
## 📂 Index theo nhóm

### 00 - Foundations (concept nền tảng + serverless)
- [[0-Serverless]] — định nghĩa, FaaS vs BaaS, khi nào dùng/không dùng
- [[1-Cold Start]] — cold start xuyên platform (Lambda/Cloud Run/CF Workers…) + 7 cách tối ưu
- [[2-IAM & Service Accounts]] — *(chưa viết)* — principle of least privilege, key rotation
- [[3-Regions & Latency]] — *(chưa viết)* — chọn region nào cho merchant Mỹ/EU/APAC

### 01 - Compute (nơi code chạy)
- [[0-Cloud Run]] — container serverless, scale 0→N, request-driven
- [[1-Cloud Functions v2]] — function ngắn cho event/HTTP (built trên Cloud Run)
- [[2-Cloud Run vs Functions]] — *(chưa viết)* — chọn cái nào cho use case nào

### 02 - Databases (Firestore là chính)
- [[0-Firestore Basics]] — document/collection model, query, listener
- [[1-Composite Indexes]] — index khi query nhiều field, không phải hash map
- [[2-Data Modeling]] — *(chưa viết)* — denormalize, subcollection, fan-out
- [[3-Security Rules]] — *(chưa viết)* — bảo vệ Firestore từ client

### 03 - Async & Messaging (queue, event)
- [[0-Cloud Tasks]] — task queue HTTP, retry exponential backoff
- [[1-Pub-Sub]] — event bus pub/sub, push vs pull, deduplication
- [[2-Tasks vs Pub-Sub]] — *(chưa viết)* — khi nào dùng cái nào

### 04 - Storage & Hosting (file + static)
- [[0-Cloud Storage]] — *(chưa viết)* — bucket, signed URL, lifecycle
- [[1-Firebase Hosting CDN]] — *(stub)* — static asset CDN

### 05 - Auth & Security
- [[0-Firebase Auth]] — user auth, ID token, session cookie, custom claims
- [[1-App Check]] — *(chưa viết)* — chống abuse từ client giả mạo
- [[2-Phone Number Verification]] — *(chưa viết)* — PNV GA 05/2026

### 06 - Analytics & Observability
- [[0-BigQuery Basics]] — *(chưa viết)* — data warehouse, SQL, partition
- [[1-Cloud Logging]] — *(chưa viết)* — structured log, query log, retention
- [[2-Cloud Monitoring]] — *(chưa viết)* — metric, alert, SLO

### 07 - Cost & Ops
- [[0-Firestore cost optimization]] — *(chưa viết)* — read/write/storage charge breakdown
- [[1-Cloud Run cost]] — *(chưa viết)* — CPU vs memory tier, idle billing
- [[2-Budget alerts]] — *(chưa viết)* — set 50/75/100% alert

---
## 🛒 Mapping với Joy Loyalty
| Tính năng Joy | Service GCP | Note liên quan |
|---|---|---|
| Webhook Shopify (`orders/paid`) | Cloud Functions v2 (HTTP trigger) | [[1-Cloud Functions v2]], [[0-Cold Start]] |
| Embedded app API | Cloud Run | [[0-Cloud Run]], [[0-Firebase Auth]] |
| Loyalty point ledger | Firestore | [[0-Firestore Basics]], [[1-Composite Indexes]] |
| Send email/notification | Cloud Tasks | [[0-Cloud Tasks]] |
| Sync metafield batch | Pub/Sub | [[1-Pub-Sub]] |
| Merchant session | Firebase Auth + custom claim | [[0-Firebase Auth]] |
| Export CSV report | Cloud Storage | [[0-Cloud Storage]] *(chưa viết)* |
| Analytics dashboard | BigQuery | [[0-BigQuery Basics]] *(chưa viết)* |

---
## 📚 Nguồn tham khảo chung
- [Google Cloud Products & Services (official)](https://cloud.google.com/products) — danh sách 200+ service GCP.
- [Firebase Build Products](https://firebase.google.com/products-build) — service nhóm "build app".
- [Firebase Run Products](https://firebase.google.com/products-run) — service nhóm "sau khi ship".
- [Google Cloud product list (docs)](https://docs.cloud.google.com/docs/product-list) — phân loại 13 category official.
- [firebase.blog](https://firebase.blog/) — update + best practice từ Firebase team.

---
## ✅ Tracking note
- [x] _MOC + cấu trúc folder
- [x] 0-Serverless (Foundations)
- [x] 1-Cold Start (Foundations)
- [x] 0-Firestore Basics
- [x] 0-Cloud Run
- [x] 1-Cloud Functions v2
- [x] 0-Firebase Auth
- [x] 1-Pub-Sub
- [ ] Còn lại (~14 file) — viết dần khi học topic cụ thể
