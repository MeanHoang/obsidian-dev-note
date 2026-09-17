# 🏗️ System Design — 2026-09-17

> Chủ đề nổi bật hôm nay: **bỏ cache làm source of truth, quay về database quan hệ** — Shopify kể chuyện thay Redis bằng MySQL cho inventory reservation, cùng nhóm bài về ledger nhất quán mạnh của Uber và platform nội bộ của Cloudflare/Shopify.

## ⭐ [We replaced Redis with MySQL for inventory reservations—and it scaled](https://shopify.engineering/scaling-inventory-reservations) — (Shopify Engineering, 12/05/2026)

**Đây là gì:** Case study re-architecture hệ thống giữ chỗ tồn kho (inventory reservation) ở checkout — đúng loại bài "chống overselling ở scale cực lớn".

**Chi tiết:**
- Bối cảnh scale: Shopify chiếm 14% ecommerce Mỹ; Black Friday 2025 đạt đỉnh **5,1 triệu USD doanh số/phút**, mỗi giao dịch đều chạm tồn kho.
- Vấn đề với kiến trúc cũ: reservation nằm ở **Redis** còn inventory ledger nằm ở **MySQL** → không thể gói reserve + claim trong **một transaction atomic duy nhất**. Hệ quả là các failure mode kiểu: thanh toán thành công nhưng tồn kho không trừ, hoặc tồn kho bị trừ mà vẫn ở trạng thái reserved.
- Thiết kế mới: thay vì 1 row/item kèm cột quantity, họ dùng **one row per sellable unit** (item 10 cái = 10 rows), và khai thác `SKIP LOCKED` của MySQL 8 để query bỏ qua row đang bị lock và trả về row còn rảnh → xoá bỏ contention. Pool giới hạn **1.000 rows mỗi cặp item/location** giữ hiệu năng ổn định, dự đoán được.
- Tối ưu đi kèm: **composite primary key** giảm số lock từ 2 xuống 1 mỗi row; isolation level **READ COMMITTED** để tránh gap lock chặn luồng replenishment; dọn checkout path bỏ **50% reads và 33% transactions** trên primary DB.
- Kết quả & bài học: lúc flash sale, **writer CPU dưới 50%, reader CPU dưới 16%**. Bottleneck thật hoá ra **không phải query chậm** mà là process upstream giữ connection quá lâu — chỉ thấy được khi có visibility vào connection. Rollout bằng **shadow mode** (chạy song song hai hệ thống rồi mới chuyển MySQL thành source of truth).

**Vì sao đáng đọc:** Đây gần như là bài mẫu cho tình huống Joy Loyalty hay gặp: **điểm thưởng / reward redemption cũng là bài toán "trừ số dư không được âm, không được trừ hai lần"** giống hệt inventory. Bài này cho thấy đừng vội đẩy state nóng sang Redis/Firestore cache rồi tự viết lock — nếu ledger đã ở một DB, hãy để reservation nằm cùng DB đó để có transaction atomic, rồi mới tối ưu contention bằng cách thiết kế row/lock. Và chiêu **shadow mode** rất đáng áp dụng khi đổi luồng redeem coupon.

## [Zero-Sum by Design: 10 Years of Uber's Payments Platform](https://www.uber.com/us/en/blog/ubers-payments-platform/) — (Uber Engineering, 06/08/2026)

**Đây là gì:** Bài tổng kết 10 năm kiến trúc nền tảng thanh toán của Uber, kể lại các nguyên tắc thiết kế được giữ nguyên suốt một thập kỷ.

**Chi tiết:**
- **Immutable money order**: bản ghi giao dịch không bao giờ được sửa; muốn điều chỉnh thì tạo order bổ sung.
- **Zero-sum principle**: mọi entry trong một money order cộng lại bằng 0 — tiền không tự sinh ra cũng không mất đi (double-entry bookkeeping).
- Ledger balance **strongly consistent** dựng trên Amazon DynamoDB, phục vụ hơn **1,2 tỷ entity**, mỗi entity gom nhiều sub-ledger account vào một row.
- Kiến trúc **loosely coupled**: các microservice stateless độc lập nối nhau qua Apache Kafka, mỗi service lo một giai đoạn của dòng tiền.
- **Business-agnostic**: money order type dạng generic dùng chung cho Rides, Eats, Freight... nên onboard business line mới gần như không phải đổi core platform.

**Vì sao đáng đọc:** Hệ thống điểm loyalty **chính là một ledger**. Áp dụng zero-sum + immutable entry (chỉ ghi thêm, không sửa/xoá transaction điểm) sẽ giúp Joy luôn giải thích được "vì sao member này có đúng bấy nhiêu điểm" — đúng tinh thần tool `joy_explain_order_points`. Cách họ tách money order type generic cũng là gợi ý để earning rule mới không phải đụng core.

## [The AI engineering stack we built internally — on the platform we ship](https://blog.cloudflare.com/internal-ai-engineering-stack/) — (Cloudflare Blog, 20/04/2026, cập nhật 15/07/2026)

**Đây là gì:** Mô tả kiến trúc 3 lớp của hạ tầng AI nội bộ Cloudflare, tự dựng trên chính sản phẩm họ bán ra (dogfooding).

**Chi tiết:**
- **Platform layer**: auth qua Cloudflare Access, route request qua AI Gateway (20,18M request/tháng, 241,37B token), inference trên Workers AI, cộng MCP Server Portal có OAuth.
- **Knowledge layer**: service catalog Backstage theo dõi **2.055 service và 375 team**, cộng file `AGENTS.md` sinh cho khoảng **3.900 repo** để coding agent biết convention, test command, ranh giới của từng repo.
- **Enforcement layer**: AI Code Reviewer cắm vào GitLab CI, tách thành nhiều agent chuyên biệt (security, code quality, compliance) đối chiếu với Engineering Codex — 5,47M request và 24,77B token trong 30 ngày.
- Độ phủ: **3.683 user nội bộ (93% tổ chức R&D)**, 47,95M AI request trong 30 ngày, tốc độ merge request gần như gấp đôi so với quý trước.

**Vì sao đáng đọc:** Điểm ăn được ngay cho Joy Loyalty là mô hình **knowledge layer**: viết `AGENTS.md` cho từng repo/service để agent (và cả người mới) có context chuẩn, thay vì để AI đoán convention. Đây là "architecture cho quy trình dev", không cần scale Cloudflare mới dùng được.

## [Quick: An internal hosting platform for the AI era](https://shopify.engineering/quick) — (Shopify Engineering, 10/06/2026)

**Đây là gì:** Câu chuyện platform nội bộ cho phép nhân viên Shopify upload một folder HTML + asset là có URL chạy ngay, không framework, không pipeline, không file config.

**Chi tiết:**
- Ra mắt tháng 7/2025, nay host **hơn 50.000 site**, **hơn 50% nhân viên** Shopify đã tạo ít nhất một site — chạy trên **một VM giá 200 USD/tháng**.
- Kiến trúc đơn giản có chủ đích: bucket **Google Cloud Storage** mount qua gcsfuse, NGINX serve file, **Identity-Aware Proxy** lo auth — mọi site chỉ nhân viên đã xác thực mới xem được.
- Cung cấp 6 capability nền: database (có real-time subscription), file upload, AI (LLM + sinh ảnh), truy cập data warehouse, WebSocket cho app cộng tác, và API identity/user.

**Vì sao đáng đọc:** Đây là phản đề đẹp cho xu hướng over-engineering: **GCS + NGINX + IAP** — toàn thứ Joy Loyalty đã có sẵn trên GCP — đủ dựng một internal platform để team dựng dashboard merchant, prototype widget, demo cho sales mà không tốn sprint hạ tầng. Rất đáng thử cho môi trường internal tooling.
