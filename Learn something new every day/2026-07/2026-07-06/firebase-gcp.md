# 🔥 Firebase & GCP — 2026-07-06

> Firestore lột xác thành database "agentic + search + MongoDB", Firebase đẩy mạnh AI Studio / Cloud Run deploy, cùng 2 pattern nền tảng cho backend: concurrency Gen 2 và blocking Auth functions.

## ⭐ [Firestore at Next '26: agentic development, search và MongoDB compatibility](https://cloud.google.com/blog/products/databases/firestore-agentic-ai-search-and-mongodb-compatibility) — (cloud.google.com/blog)
**Đây là gì:** Bản tổng hợp Firestore tại Next '26 — biến Firestore từ document DB thuần thành nền tảng có full-text search, JOIN, geospatial và tích hợp AI agent native.
**Chi tiết:**
- **Full-text search (Preview):** built-in, hỗ trợ 40+ ngôn ngữ, **strongly consistent** với dữ liệu transactional (không phải eventual như giải pháp search ngoài) → khỏi bơm data sang Algolia/Elastic.
- **Pipeline query engine (GA, Enterprise edition):** hàng trăm khả năng query mới, gồm **JOIN via subqueries** (GA) giữa các collection, geospatial queries (Preview) và data manipulation operators (bulk normalize/sanitize/backfill, Preview).
- **MongoDB compatibility nâng cấp:** giới hạn document tăng lên **16 MiB**, **change streams (GA)** để sync realtime sang BigQuery ở quy mô lớn, TTL với time offset linh hoạt, lệnh drop collection.
- **Agentic:** Firestore Skills + remote MCP service (GA) cho Claude Code / Cursor / Codex; natural-language query trong console (Preview) dịch tiếng người → query qua Gemini.
- Quy mô: **750k developer active/tháng**, hơn **10M database** đang host — tín hiệu Firestore vẫn là default backend, đáng đầu tư học sâu.
**Vì sao đáng đọc:** Joy Loyalty đang phải denormalize nặng vì Firestore không JOIN được; pipeline engine + full-text search (nếu lên Enterprise) có thể xoá bớt các collection sao chép cho search/report, còn change streams GA là đường ống sạch để đẩy event loyalty sang BigQuery analytics.

## [What's new from Firebase at Google I/O 2026](https://firebase.blog/posts/2026/05/google-io-2026-announcements/) — (firebase.blog)
**Đây là gì:** Tổng hợp announcement Firebase tại I/O 2026 (đăng 19/05/2026), xoay quanh AI Studio, deploy Cloud Run và mở rộng agent skills.
**Chi tiết:**
- One-click deploy lên **Cloud Run** không cần nhập payment cho **2 app đầu** trên Google Cloud Starter Tier mới.
- App có thể kết nối dữ liệu **Google Workspace** (Gmail, Docs, Sheets) qua flow "Sign in with Google" bằng natural language.
- **Crashlytics for Web** (sắp ra): tích hợp Cloud Logging + Trace để debug end-to-end client ↔ server.
- **Agent Skills** mở rộng: phủ Android/iOS/Flutter + web, thêm Crashlytics & Remote Config, tương thích Claude Code / Codex.
**Vì sao đáng đọc:** Joy Loyalty deploy backend trên Cloud Run hàng ngày — luồng deploy trực tiếp từ Firebase/AI Studio và Crashlytics web (nếu có admin dashboard React) cắt bớt bước CI/CD thủ công.

## [Manage functions — concurrency & min instances (Gen 2)](https://firebase.google.com/docs/functions/manage-functions) — (firebase.google.com/docs)
**Đây là gì:** Doc chính thức về cấu hình runtime cho Cloud Functions Gen 2, đặc biệt concurrency (mỗi instance xử lý nhiều request) và min instances chống cold start.
**Chi tiết:**
- Concurrency mặc định **80**, chỉnh 1–1000. I/O-bound (gọi API, query Firestore) để 80–100; CPU-bound (xử lý ảnh, encrypt) để thấp 1–10.
- Instance còn headroom hấp thụ được burst mà không cold start: instance đang chạy 25/50 request có thể nhận thêm 25 mà không spawn instance mới.
- Min instances cho endpoint user-facing: chi phí nhỏ so với UX; kết hợp min instances + high concurrency (vd 2 warm × 80 = 160 request warm) là combo chống cold start tối ưu.
**Vì sao đáng đọc:** Webhook Shopify (order/paid, app/uninstalled) của Joy Loyalty chủ yếu I/O-bound — nâng concurrency thay vì scale số instance giúp giảm cost và tránh cold start làm trễ webhook (Shopify timeout).

## [Extend Firebase Authentication with blocking functions](https://firebase.google.com/docs/auth/extend-with-blocking-functions) — (firebase.google.com/docs)
**Đây là gì:** Doc pattern chạy custom code *trước khi* user được tạo hoặc đăng nhập, để chặn/sửa dữ liệu auth (yêu cầu nâng lên Firebase Auth with Identity Platform).
**Chi tiết:**
- Trigger: `beforeUserCreated`, `beforeUserSignedIn`, và (Node.js only) trước khi gửi email / SMS.
- Có thể chặn đăng nhập nếu user không đạt điều kiện, hoặc chỉnh thông tin user trước khi trả token về client.
- **Ràng buộc cứng:** function phải phản hồi trong **7 giây**, quá thì Auth trả lỗi và thao tác client thất bại → giữ logic nhẹ, tránh gọi API chậm.
**Vì sao đáng đọc:** Nếu Joy Loyalty gắn login riêng cho merchant/customer, blocking function là chỗ enforce domain rule (chặn email tạm, gán custom claims theo plan) ngay tại nguồn thay vì check rải rác trong app code.
