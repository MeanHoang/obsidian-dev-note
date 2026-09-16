# 🔥 Firebase & GCP — 2026-09-15

> Firebase ra spend caps (circuit breaker chi phí) ngay hôm qua, Cloud Run mở Agent Platform integration, BigQuery cho phép WHERE bên trong aggregate function.

## ⭐ [Introducing Firebase spend caps](https://firebase.blog/posts/2026/09/firebase-spend-caps) — (firebase.blog, 14/09/2026)
**Đây là gì:** Firebase cho phép đặt trần chi tiêu theo từng service; khi chạm trần, service bị tạm dừng thay vì tiếp tục đốt tiền — bài viết gọi đây là "circuit breaker" chống bill sốc do bug hoặc traffic spike.
**Chi tiết:**
- Gửi email cảnh báo nhiều mốc: **50%, 80% và 100%** ngân sách đã cấu hình.
- Hiện hỗ trợ 3 service: **Firebase AI Logic, Cloud Functions for Firebase, Firebase App Hosting** (sẽ mở rộng thêm).
- **Không phải hard cap**: do độ trễ báo cáo usage, việc chặn có thể chậm vài phút → vẫn có thể lố nhẹ.
- Tính theo **gross cost** — trước khi trừ credits, free tier hay discount.
- Bật tại Firebase console → **Usage and Billing → tab Account & budgets**, đặt limit riêng cho từng service. Gỡ cap xong service có thể mất tới **1 giờ** mới hoạt động lại bình thường.
- Trạng thái: **Public Preview** từ 14/09/2026.
**Vì sao đáng đọc:** Joy Loyalty chạy Cloud Functions v2 cho webhook Shopify — một vòng lặp vô hạn hoặc merchant bulk-import order là đủ để bill nhảy vọt; đặt spend cap cho Functions là lớp bảo hiểm nên bật ngay, nhưng phải nhớ nó mềm (không chặn tức thì) nên vẫn cần alert riêng.

## [Cloud Run: Agent Platform integration (Preview) + Go 1.27 GA](https://docs.cloud.google.com/run/docs/release-notes) — (Cloud Run release notes, 01/09/2026)
**Đây là gì:** Cloud Run thêm tích hợp Agent Platform (Preview) — cho phép xác thực AI agent và MCP server bằng **system-managed identity**, tự động đăng ký vào Agent Registry; cùng ngày Go 1.27 runtime lên GA.
**Vì sao đáng đọc:** Nếu team định dựng MCP server cho Joy (kiểu MCP tool đọc dữ liệu loyalty), đây là đường chính thức để agent có identity và được quản lý tập trung, thay vì tự chế API key.

## [BigQuery: WHERE clause bên trong aggregate function (Preview)](https://docs.cloud.google.com/bigquery/docs/release-notes) — (BigQuery release notes, 14/09/2026)
**Đây là gì:** BigQuery hỗ trợ đặt mệnh đề `WHERE` ngay trong lời gọi aggregate function, thay vì phải bọc `CASE WHEN` hoặc subquery cho từng điều kiện. Cùng ngày còn có BigQuery Graph metadata tự động đưa vào Knowledge Catalog (Preview).
**Vì sao đáng đọc:** Query analytics loyalty thường phải đếm nhiều nhóm cùng lúc (đơn có redeem / không redeem, member theo tier) — viết được điều kiện trực tiếp trong aggregate giúp SQL report ngắn và dễ đọc hơn hẳn `COUNTIF`/`CASE` chồng chất.

## [Authentication made easy: Building a secure e-commerce shopping cart with Firebase](https://firebase.blog/posts/2026/09/secure-shopping-cart-firebase) — (firebase.blog, 01/09/2026)
**Đây là gì:** Bài hướng dẫn dựng giỏ hàng e-commerce an toàn: Anonymous Auth cấp identity cho khách vãng lai ngay lập tức, Security Rules khoá mỗi user vào cart của chính mình và chặn sửa giá từ client, xử lý merge cart khi khách ẩn danh đăng nhập (link account giữ nguyên `uid`, hoặc batch reconcile nếu đã có tài khoản cũ), và đẩy toàn bộ tính giá + tạo order sang backend Cloud Run xác thực ID token rồi ghi bằng quyền admin.
**Vì sao đáng đọc:** Đúng mô hình widget loyalty của Joy — customer chưa đăng nhập vẫn cần state, và phần tính điểm/redeem tuyệt đối không được để client quyết định; pattern "client chỉ đọc, server tính và ghi" trong bài là khuôn mẫu chuẩn cho Security Rules bên mình.
