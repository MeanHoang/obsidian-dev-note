# 🔥 Firebase & GCP — 2026-07-07

> Firestore biến thành "NoSQL có JOIN + full-text search", Auth redirect trong iframe cần đổi pattern, và AI Studio dựng full-stack app tự động enable Firestore/Auth.

## ⭐ [Firestore levels up: Bringing the power of search and JOINs to NoSQL](https://firebase.blog/posts/2026/04/firestore-pipelines-ga) — (firebase.blog)
**Đây là gì:** Firestore Pipelines chính thức GA trên **Enterprise edition** — một query engine mới cho phép JOIN, full-text search, geospatial và DML (update/delete) ngay trong Firestore, không cần dịch vụ ngoài.
**Chi tiết:**
- **Full-text search (Preview):** search kiểu Google với tokenization + relevance scoring, tự xử lý synonym, lỗi chính tả, cả ngôn ngữ khó như tiếng Trung phồn thể — không cần plugin. Ưu điểm lớn: kết quả nhất quán với live DB, bỏ được vụ đồng bộ sang search engine ngoài (Algolia/Elastic/Typesense).
- **Subqueries / JOIN:** ghép 2 pipeline bất kỳ để aggregate xuyên collection. Ví dụ họ đưa ra: join document `restaurant` với subcollection `reviews` để tính average rating trong 1 field, 1 query.
- **Geospatial queries (Preview):** sort kết quả theo khoảng cách tới toạ độ cho trước — app location-aware.
- **DML:** update/delete có điều kiện xuyên collection ngay trong pipeline; *insert và transaction "coming soon"*.
- Định vị: đạt "query feature parity với PostgreSQL" nhưng vẫn giữ NoSQL model, serverless, real-time sync và offline query. Lưu ý trade-off: các tính năng này thuộc **Enterprise edition** (không phải Standard mặc định), bài không nêu số liệu hiệu năng cụ thể.
**Vì sao đáng đọc:** Joy Loyalty thường phải sync data Firestore sang search engine ngoài để filter/tìm kiếm member, hoặc denormalize thủ công để "join" order ↔ customer. Nếu bật Enterprise, full-text search + subquery-JOIN có thể xoá cả một pipeline đồng bộ và giảm code denormalize — nhưng cần cân nhắc chi phí Enterprise trước khi migrate.

## [Best practices for signInWithRedirect on browsers that block third-party storage](https://firebase.google.com/docs/auth/web/redirect-best-practices) — (firebase.google.com/docs)
**Đây là gì:** Từ khi Chrome M115+, Firefox 109+, Safari 16.1+ chặn third-party storage access, cơ chế cross-origin iframe của `signInWithRedirect()` bị vỡ khi trình duyệt partition storage — Firebase liệt kê các cách sửa.
**Chi tiết:**
- **Option 1 (khuyến nghị):** đặt `authDomain` = custom domain của chính app → app và auth iframe cùng domain, hết cross-origin. Cần Firebase Hosting trên custom domain.
- **Option 2:** đổi sang `signInWithPopup()` — đơn giản nhất nhưng dễ bị popup blocker, UX mobile kém hơn.
- **Option 3:** reverse proxy — forward request `/__/auth/` sang Firebase domain, tránh 302 redirect.
- **Option 4/5:** self-host helper code, hoặc dùng SDK provider trực tiếp (Google/Apple Sign-In) rồi `signInWithCredential()` — phức tạp hơn, có giới hạn (Option 4 không hỗ trợ Apple/SAML).
**Vì sao đáng đọc:** App Shopify chạy trong iframe của Admin (cross-origin) là đúng ca "third-party storage bị chặn". Nếu Joy Loyalty có bất kỳ luồng Firebase Auth phía merchant/embedded nào dùng redirect, đây là checklist tránh vỡ đăng nhập trên Safari/Chrome mới — dùng `signInWithPopup` hoặc custom `authDomain` là fix nhanh.

## [AI Studio unlocks full-stack vibe coding with Cloud Run, Firebase, and Cloud SQL](https://cloud.google.com/blog/products/databases/vibe-coded-ai-studio-apps-with-firestore-firebase-cloud-sql) — (cloud.google.com/blog)
**Đây là gì:** AI Studio giờ dựng full-stack app bằng natural language, agent tự phát hiện nhu cầu lưu trữ/auth trong prompt và **one-click "Enable Firebase"** để provision Firestore + Firebase Auth, deploy lên Cloud Run — không cần thẻ tín dụng (Starter Tier, tối đa 2 app/user).
**Chi tiết:**
- Bấm "Enable Firebase" sẽ tự: provision Firestore, tạo trang sign-in Google Sign In, sinh code Firestore đồng bộ cross-device, và **draft + deploy Firestore Security Rules** (user phải review).
- Kết nối Google Workspace (Sheets/Calendar/Gmail) qua prompt, luồng "Sign in with Google" chạy bằng Firebase Authentication.
- Workflow: login AI Studio → prompt ("Build an expense tracker") → "Add a database" → Enable Firebase → Publish.
**Vì sao đáng đọc:** Hữu ích để prototype nhanh một internal tool/dashboard cho team Joy Loyalty (vd tool xem member/points) mà không phải scaffold Firestore + Auth + rules thủ công. Cảnh báo: rules auto-generate PHẢI review kỹ trước khi production — đúng tinh thần least-privilege.
