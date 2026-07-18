# 🔥 Firebase & GCP — 2026-07-02

> Cloud Run tung loạt tính năng cho AI agent (billing caps, sandboxes, SSH), Firestore mở Regional/Multi-Regional endpoints GA, và vài deprecation cần để mắt trong tháng 6.

## ⭐ [What's new for Cloud Run at Next '26](https://cloud.google.com/blog/products/serverless/whats-new-for-cloud-run-at-next26) — (cloud.google.com/blog)
**Đây là gì:** Tổng hợp các tính năng Cloud Run công bố tại Google Cloud Next '26, xoay quanh việc chạy full-stack app và AI agent trên serverless.
**Chi tiết:**
- **Billing Caps (coming soon):** đặt mức chi tối đa/tháng; khi chạm ngưỡng, Cloud Run resource sẽ tự deactivate — chốt chặn cost cho môi trường dev/staging.
- **Cloud Run MCP Server (GA):** remote MCP server chính thức để agent/AI app tự deploy lên Cloud Run bằng lệnh MCP.
- **Cloud Run Sandboxes (coming soon) + SSH (preview):** sandbox cô lập cho agent chạy code trong 1 request; SSH cho phép vào thẳng container đang chạy để troubleshoot, inspect filesystem.
- **Service Bindings (coming soon):** kết nối service-to-service liền mạch cho kiến trúc microservices, không phải tự dựng auth/URL.
- **NVIDIA RTX PRO 6000 Blackwell GPU (GA):** serve model 70B+ tham số, vẫn scale-to-zero. Cloud Run instances (preview) + ephemeral disk (preview) cho background agent chạy dài.
**Vì sao đáng đọc:** Joy Loyalty chạy backend trên Cloud Run — billing caps giúp bọc an toàn chi phí cho service phụ, SSH tiết kiệm hàng giờ debug container thay vì chỉ dựa vào log, còn MCP server mở đường tự động hoá deploy.

## [Cloud Firestore Regional & Multi-Regional endpoints GA](https://firebase.google.com/support/releases) — (firebase.google.com/support/releases)
**Đây là gì:** Regional và Multi-Regional endpoint cho Cloud Firestore API nay đã Generally Available. Bạn gọi qua endpoint theo region để đảm bảo request được truyền, lưu và xử lý cùng region/multi-region với database.
**Vì sao đáng đọc:** Với app Shopify phục vụ merchant nhiều khu vực, dùng endpoint theo region giúp giảm latency và đáp ứng yêu cầu data residency — đáng cân nhắc khi cấu hình Firestore client cho Joy Loyalty. Ví dụ khởi tạo vẫn JS thuần: `initializeFirestore(app, { host: 'nam5-firestore.googleapis.com' })` (chọn host theo region database).

## [Firebase Release Notes — CLI v15.20.0, JS SDK v12.15.0 & deprecations tháng 6](https://firebase.google.com/support/releases) — (firebase.google.com/support/releases)
**Đây là gì:** Bản cập nhật Firebase tháng 6/2026: CLI v15.20.0, Firebase JS SDK v12.15.0, Apple SDK v12.15.0, kèm vài thay đổi ngừng dịch vụ quan trọng.
**Vì sao đáng đọc:** Hai mốc deprecation cần nhớ: (1) Firebase extension cho Gemini CLI ngừng hoạt động từ 18/06/2026 khi Gemini CLI chuyển sang Antigravity CLI; (2) toàn bộ Imagen model deprecated, có thể shut down sớm nhất 30/06/2026 — nếu code Joy Loyalty có sinh ảnh qua Imagen thì cần lên kế hoạch thay thế ngay. CLI mới cũng bỏ prompt xoá SQL Connect service khi `firebase deploy`.

## [Functions best practices — Cloud Run functions (Gen 2)](https://firebase.google.com/docs/functions/tips) — (firebase.google.com/docs)
**Đây là gì:** Hướng dẫn tối ưu Cloud Functions v2 (Cloud Run functions): khuyến nghị mặc định chọn Gen 2 cho project mới năm 2026.
**Vì sao đáng đọc:** Điểm actionable dùng daily — 1 instance Gen 2 xử lý tới 1000 concurrent request (thay vì 1 như Gen 1), giảm mạnh cold start và cost; cache connection/API client ở global scope; đặt `minInstances` cho function nhạy latency; viết function idempotent để retry an toàn; dùng Secret Manager thay vì env var cho secret. Ví dụ JS: đặt `const db = getFirestore()` ngoài handler để tái dùng qua các invocation.
