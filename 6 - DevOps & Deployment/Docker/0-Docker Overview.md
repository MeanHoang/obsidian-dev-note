> [!quote] 💬
> "Docker là cách bạn nói: ứng dụng của tôi sẽ chạy giống y hệt trên máy tôi, máy đồng nghiệp, server staging, và prod — không cãi nhau nữa."

## 🎯 Docker là gì
**Docker** là công cụ đóng gói app (code + runtime + thư viện + config) thành 1 **"hộp"** chạy được trên bất kỳ máy nào có Docker, không phụ thuộc OS host. Đây là tiêu chuẩn de-facto của containerization từ ~2014, là nền tảng cho mọi platform serverless container hiện đại (Cloud Run, AWS Fargate, Azure Container Apps).

> [!note] 📝 Vấn đề Docker giải quyết — "works on my machine"
> Trước Docker, dev hay than: "Trên máy tôi chạy được mà??" Lý do: máy dev có Node 20, máy server có Node 14. Máy dev có lib `libpng v2`, server có `v1`. Code lệch một chút là vỡ.
> Docker đóng gói **toàn bộ environment** (OS thư viện, runtime, code, config) vào 1 image → máy nào cũng chạy giống y hệt. Vấn đề "works on my machine" tan biến.

---

## 🧱 3 khái niệm cốt lõi

### 1️⃣ Image — "khuôn đúc" (read-only template)
**Image** là file blueprint chứa:
- **OS base layer** (vd Linux Alpine ~5MB, Debian slim ~80MB).
- **Runtime** (Node.js, Python, Go binary).
- **Code app** của bạn.
- **Dependencies** (`node_modules/`, `vendor/`, lib hệ thống).
- **Env config** (vd `NODE_ENV=production`).

> [!tip] 💡 Image immutable + layered
> Đã build là **khoá lại**, không sửa được. Image cấu thành từ nhiều **layer** xếp chồng (kiểu lasagna): mỗi instruction trong Dockerfile = 1 layer. Layer share giữa các image → tiết kiệm disk + tăng tốc pull.

Image lưu trên **registry** (kho online):
- **Docker Hub** (`hub.docker.com`) — public, mặc định.
- **Google Container Registry** (`gcr.io`) — của GCP.
- **Google Artifact Registry** (`*-docker.pkg.dev`) — bản nâng cấp của GCR, GCP đang push dùng cái này.
- **GitHub Container Registry** (`ghcr.io`).

Tên image đầy đủ: `<registry>/<project>/<name>:<tag>`
- `gcr.io/joy-loyalty/api:v1.2.3`
- `node:20-slim`
- `nginx:latest`

### 2️⃣ Container — "instance đang chạy" của image
Image = file recipe. Container = **bản đang nấu** từ recipe.
Từ **1 image** chạy được **nhiều container** đồng thời, mỗi cái độc lập (RAM, network, filesystem riêng).

```
Image: joy-api:v1
   ├── Container A (port 8080, xử lý req user X)
   ├── Container B (port 8081, xử lý req user Y)
   └── Container C (chạy trên server khác)
```

> [!note] 📝 Container đời ngắn
> Container thường **ephemeral** — start, làm việc, stop, biến mất. State trong container (file, RAM) **mất khi container chết**. Muốn lưu data → mount **volume** từ host hoặc dùng external store (DB, object storage). Đây là cách hoạt động của Cloud Run, Kubernetes, Docker Compose production.

### 3️⃣ Dockerfile — recipe để build image
File text mô tả các bước build image:

```dockerfile
# Bắt đầu từ image có sẵn (Node 20 trên Linux Debian slim)
FROM node:20-slim

# Đặt thư mục làm việc trong container
WORKDIR /app

# Copy file deps trước, install (tận dụng cache khi code đổi)
COPY package*.json ./
RUN npm ci --omit=dev

# Copy toàn bộ code
COPY . .

# Khai báo port app sẽ listen
EXPOSE 8080

# Lệnh chạy khi container start
CMD ["node", "index.js"]
```

Build image từ Dockerfile:
```bash
docker build -t joy-api:v1 .
```

Chạy container từ image:
```bash
docker run -p 8080:8080 joy-api:v1
# Mở http://localhost:8080 → app chạy
```

---

## 🥪 Ví dụ đời thường: tiệm bánh mì

| Khái niệm Docker | Ví dụ đời thường |
|---|---|
| **Dockerfile** | Công thức làm bánh ghi trên giấy |
| **Image** | Khuôn đúc bánh + nguyên liệu đóng gói sẵn |
| **Container** | 1 ổ bánh đang nướng trong lò |
| **Registry** | Thư viện công thức online (tải về làm) |
| **Docker engine** | Cái bếp + lò nướng (môi trường chạy) |
| **Layer** | Lớp nhân — bánh mì, pa-tê, chả, dưa chuột (đóng gói riêng từng lớp, chia sẻ giữa nhiều bánh) |

---

## 🏗️ Workflow tổng thể (cao cấp)

```
┌── Bạn (dev) ──┐
│  viết code   │
│  + Dockerfile│
└──────┬───────┘
       │ docker build
       ↓
┌── Image (joy-api:v1) ──┐
│  - Linux base          │
│  - Node 20             │
│  - Code + node_modules │
└──────┬─────────────────┘
       │ docker push
       ↓
┌── Registry (gcr.io) ──┐
│  Lưu image online    │
└──────┬───────────────┘
       │ Cloud Run / K8s pull
       ↓
┌── Production runtime ──────┐
│  docker run → container    │
│  Container: 1 process Node │
│  chạy index.js, listen 8080│
└────────────────────────────┘
```

---

## 🆚 Container vs VM (Virtual Machine)

Đừng nhầm container với VM:

| | VM | Container |
|---|---|---|
| **Cô lập** | Cả OS riêng (kernel riêng) | Chia sẻ kernel của host |
| **Kích thước** | GB (cả OS) | MB (chỉ app + lib) |
| **Boot time** | 1-2 phút | 1-2 giây |
| **Overhead RAM** | Nặng (mỗi VM ~1GB+) | Nhẹ (~50-200MB/container) |
| **Mật độ** | Vài chục VM/máy | Hàng trăm container/máy |
| **Use case** | Chạy nhiều OS khác nhau, isolation mạnh | Chạy nhiều app cô lập trên cùng OS |

```
┌──────────────────────────────────────────┐
│             Hardware                      │
├──────────────────────────────────────────┤
│             Host OS                       │
├──────────────────────────────────────────┤
│   Hypervisor              Docker Engine   │
├──────────────────────────────────────────┤
│  ┌──────┐ ┌──────┐    ┌──────┐ ┌──────┐  │
│  │ VM A │ │ VM B │    │Cont A│ │Cont B│  │
│  │ OS   │ │ OS   │    │ App  │ │ App  │  │
│  │ App  │ │ App  │    │ Lib  │ │ Lib  │  │
│  └──────┘ └──────┘    └──────┘ └──────┘  │
│   (nặng)              (nhẹ, share kernel) │
└──────────────────────────────────────────┘
```

> [!tip] 💡 Hybrid trong production 2026
> Production thực tế thường là **container chạy bên trong VM**: VM cấp isolation phần cứng (multi-tenant security), container cấp packaging + scale nhanh. Cloud Run/Kubernetes/ECS đều chạy theo mô hình này phía dưới — bạn chỉ thấy container, GCP/AWS lo VM bên dưới.

---

## ⚡ Lệnh Docker thường dùng

```bash
# Build image từ Dockerfile thư mục hiện tại, tag joy-api:v1
docker build -t joy-api:v1 .

# Liệt kê image local
docker images

# Chạy container, map port host:container
docker run -p 8080:8080 joy-api:v1

# Chạy detached (background), đặt tên
docker run -d --name joy-local -p 8080:8080 joy-api:v1

# Xem container đang chạy
docker ps

# Xem container kể cả đã stop
docker ps -a

# Xem log container
docker logs joy-local
docker logs -f joy-local      # follow real-time

# Vào shell trong container đang chạy (debug)
docker exec -it joy-local sh
docker exec -it joy-local bash # nếu image có bash

# Stop + xoá container
docker stop joy-local
docker rm joy-local

# Xoá image
docker rmi joy-api:v1

# Push image lên registry
docker push gcr.io/joy-loyalty/api:v1

# Dọn dẹp resource không dùng (image dangling, container stopped)
docker system prune

# Xem disk usage Docker
docker system df
```

---

## 🛡️ Best practices Dockerfile cho Node.js production

> [!tip] 💡 Dockerfile tối ưu cho Joy API
> ```dockerfile
> # === Stage 1: Build ===
> FROM node:20-alpine AS builder
> WORKDIR /app
>
> # Copy file deps trước để tận dụng cache layer
> COPY package*.json ./
> RUN npm ci --omit=dev
>
> # === Stage 2: Production runtime ===
> FROM gcr.io/distroless/nodejs20-debian12
> WORKDIR /app
>
> # Copy chỉ những gì cần từ builder
> COPY --from=builder /app/node_modules ./node_modules
> COPY . .
>
> ENV NODE_ENV=production
> EXPOSE 8080
>
> # Chạy node trực tiếp, không qua npm start (để SIGTERM về đúng Node)
> CMD ["index.js"]
> ```

### 10 best practice quan trọng
1. **Multi-stage build** — tách stage build vs runtime, image nhỏ hơn ~70%.
2. **Alpine hoặc distroless base** — Alpine ~70MB, distroless không có shell + package manager → secure hơn, ~50MB.
3. **Chỉ install production deps** — `npm ci --omit=dev` hoặc `npm ci --only=production`.
4. **`npm ci` thay `npm install`** — deterministic build từ `package-lock.json`, fail nếu lockfile lệch.
5. **Set `NODE_ENV=production`** — Express, React, nhiều lib bật optimization khi flag này set.
6. **Run as non-root user** — mặc định Docker chạy root, tạo user thường (`USER node`) để tuân Principle of Least Privilege.
7. **Cache layer hợp lý** — instruction ít đổi đặt trên (FROM, COPY package.json, RUN npm ci), instruction hay đổi đặt dưới (COPY . .).
8. **`.dockerignore`** — bỏ `node_modules`, `.git`, `.env`, log file khỏi build context — build nhanh + image gọn.
9. **`HEALTHCHECK`** — Docker tự kiểm tra container còn sống không (vd curl `/healthz`). Cloud Run cũng có cơ chế riêng nhưng Docker level vẫn tốt cho local.
10. **Bỏ qua `npm start`** — `CMD ["node", "index.js"]` thay vì `CMD ["npm", "start"]` để Node nhận trực tiếp `SIGTERM` (npm nuốt signal → graceful shutdown gãy).

### File `.dockerignore` mẫu
```
node_modules
npm-debug.log
.git
.gitignore
.env
.env.*
.vscode
.idea
*.md
.DS_Store
coverage
.nyc_output
dist
build
```

---

## 🔌 Liên kết với Cloud Run

```
Bạn build image: gcr.io/joy/api:v1.2.3
       ↓
Push lên registry (Artifact Registry)
       ↓
Cloud Run pull image về
       ↓
Cloud Run spawn N container instance từ image
       ↓
Mỗi container = 1 [[1-Cloud Run Service (Request-driven)|Cloud Run instance]]
```

> [!tip] 💡 Nối kiến thức
> - **"Cloud Run instance"** = **1 container Docker** đang chạy image của bạn trên hạ tầng Google.
> - **"Ephemeral"** vì Cloud Run start/stop container theo nhu cầu (autoscale, deploy revision mới).
> - **Image immutable** = mỗi lần code đổi → build image mới với tag mới (`v1.2.4`) → deploy = tạo Cloud Run **revision** mới reference image mới.
> - Xem chi tiết Cloud Run instance lifecycle: [[1-Cloud Run Service (Request-driven)]] và [[2-Cloud Run Worker Pool]].

> [!note] 📝 Cloud Run Buildpacks — không cần Dockerfile
> Cloud Run support **buildpacks** (Cloud Native Buildpacks) tự sinh image từ source code:
> ```bash
> gcloud run deploy joy-api --source=.
> # Auto-detect Node/Python/Go từ package.json/requirements.txt/go.mod
> # Tự build image, push lên Artifact Registry, deploy
> ```
> **Trade-off**: ít kiểm soát, image to hơn ~2× so với Dockerfile distroless tự viết. Tốt cho prototype, dở cho production scale.

---

## ⚠️ Pitfall thường gặp

> [!warning] ⚠️ Lỗi phổ biến khi mới dùng Docker
> 1. **Build context to** — quên `.dockerignore` → upload cả `node_modules/` 500MB lên Docker daemon mỗi lần build. Build cực chậm.
> 2. **Cache layer hỏng** — `COPY . .` ngay từ đầu → mỗi lần đổi 1 dòng code, layer `npm install` cũng phải chạy lại. Đặt `COPY package*.json ./` trước rồi `npm ci` rồi mới `COPY . .`.
> 3. **Lưu state trong container** — ghi log file vào `/app/logs/`, ghi upload vào `/app/uploads/` → container chết là mất sạch. Dùng external storage (Cloud Storage, S3).
> 4. **Hardcode secret trong Dockerfile** — `ENV API_KEY=xxx` → image push lên registry public là lộ. Dùng secret manager runtime.
> 5. **Không handle SIGTERM** — Cloud Run gửi SIGTERM trước khi kill, code không handle → request đang xử lý bị cắt giữa chừng.
> 6. **Chạy root** — root trong container = root trên host nếu container escape. Tạo user thường + `USER` directive.
> 7. **`latest` tag in production** — `joy-api:latest` không deterministic, deploy hôm nay khác hôm qua. Dùng tag version cụ thể (`v1.2.3` hoặc git SHA).

---

## 🛒 Áp dụng cho Joy

> [!tip] 💡 Workflow Joy điển hình
> 1. Code app Node.js trong VS Code/Cursor.
> 2. Viết `Dockerfile` (multi-stage + distroless) trong root project.
> 3. Tạo `.dockerignore` (bỏ node_modules, .git, .env).
> 4. Test local: `docker build -t joy-api:dev .` rồi `docker run -p 8080:8080 joy-api:dev` → mở `localhost:8080` xem app.
> 5. Tag với git SHA: `docker tag joy-api:dev gcr.io/joy/api:$(git rev-parse --short HEAD)`.
> 6. Push: `gcloud builds submit --tag asia-southeast1-docker.pkg.dev/PROJECT/joy/api:v1`.
> 7. Deploy Cloud Run: `gcloud run deploy joy-api --image=...:v1` → revision mới + spawn container instance.

---

## 📚 Tham khảo
- 🔥 [Docker Complete Guide for Beginners 2026](https://dev.to/_d7eb1c1703182e3ce1782/docker-complete-guide-for-beginners-containerize-your-app-in-2026-57j9) — bài toàn diện cho người mới, cập nhật 2026.
- [Containers are not VMs (Docker Blog)](https://www.docker.com/blog/containers-are-not-vms/) — giải thích thẳng từ Docker tại sao container ≠ VM.
- [Docker vs VM — Atlassian](https://www.atlassian.com/microservices/cloud-computing/containers-vs-vms) — so sánh kèm diagram chi tiết.
- 🔥 [Dockerizing Node.js for Production: Complete 2026 Guide](https://dev.to/axiom_agent/dockerizing-nodejs-for-production-the-complete-2026-guide-7n3) — guide deep cho Node.js production.
- [Official nodejs/docker-node Best Practices](https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md) — best practice chính thức từ Node.js team.
- [10 best practices to containerize Node.js (Snyk)](https://snyk.io/blog/10-best-practices-to-containerize-nodejs-web-applications-with-docker/) — checklist security + performance.
- [Bret Fisher node-docker-good-defaults](https://github.com/BretFisher/node-docker-good-defaults) — sample repo Dockerfile production-ready cho Node.
- [Better Stack: Dockerizing Node.js Apps](https://betterstack.com/community/guides/scaling-nodejs/dockerize-nodejs/) — guide đầy đủ kèm production tips.

---

## ✅ Checklist
- [ ] Hiểu 3 khái niệm cốt lõi: **Image / Container / Dockerfile**
- [ ] Phân biệt được Image (immutable blueprint) vs Container (instance đang chạy)
- [ ] Hiểu image cấu thành từ nhiều **layer**, share giữa các image
- [ ] Biết container vs VM khác gì (kernel sharing, kích thước, boot time)
- [ ] Đã viết Dockerfile multi-stage cho project Node.js
- [ ] Có `.dockerignore` đầy đủ (node_modules, .git, .env)
- [ ] Dùng `npm ci` thay `npm install` trong Dockerfile
- [ ] Set `NODE_ENV=production` trong production stage
- [ ] Image base là **distroless** hoặc **alpine** cho production
- [ ] Run as non-root user
- [ ] CMD chạy `node index.js` trực tiếp, không qua npm start
- [ ] Tag image bằng version cụ thể (vX.Y.Z hoặc git SHA), không dùng `:latest` ở prod
- [ ] Hiểu liên kết Docker → Cloud Run: image push lên registry → Cloud Run pull → spawn container instance
- [ ] Biết các pitfall: build context to, cache layer hỏng, hardcode secret, chạy root
