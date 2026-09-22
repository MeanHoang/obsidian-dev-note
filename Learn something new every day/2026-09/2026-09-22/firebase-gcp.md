# 🔥 Firebase & GCP — 2026-09-22

> Firebase ra spend caps (cầu dao chặn bill), Cloud Run thêm Agent Platform identity + Go 1.27 GA, BigQuery cải thiện UX query history, và một bài mẫu Auth + Security Rules cho giỏ hàng e-commerce.

## ⭐ [Introducing Firebase spend caps](https://firebase.blog/posts/2026/09/firebase-spend-caps) — (firebase.blog, 2026-09-14)
**Đây là gì:** Tính năng đặt ngưỡng chi tiêu theo từng service Firebase. Khi tiêu vượt ngưỡng, Firebase tự **tạm dừng service** đó thay vì để bill chạy tiếp — giống một cầu dao (circuit breaker) cho hoá đơn cloud.
**Chi tiết:**
- Cảnh báo email nhiều mức: 50%, 80%, 100% ngưỡng; tới 100% thì service bị pause.
- Hiện hỗ trợ 3 sản phẩm: **Firebase AI Logic, Cloud Functions for Firebase, Firebase App Hosting**. Cấu hình ở mức từng service, không phải cả project.
- Quản lý trong Firebase console → Usage and Billing → tab **Account & budgets**; tuỳ chọn nâng cao nằm ở Google Cloud console.
- Caveat quan trọng: bài viết nói rõ đây **không phải "hard caps"** — do độ trễ báo cáo usage, service vẫn có thể phát sinh phí vài phút sau khi cap được kích hoạt, nên chi thực tế có thể vượt ngưỡng.
- Tính toán dựa trên **gross cost**, chưa trừ credit/discount. Sau khi bỏ cap, service có thể cần tới 1 giờ để hoạt động lại. Tính năng đang ở Public Preview.
**Vì sao đáng đọc:** Joy Loyalty chạy rất nhiều Cloud Functions (webhook Shopify: orders/create, customers/update, points calculation). Một shop lớn spam webhook hoặc một bug loop trigger là đủ để bill nhảy vọt trong đêm — spend cap cho Cloud Functions là lớp bảo hiểm nên bật ngay. Nhưng vì nó pause service, cần cân nhắc: pause function = mất webhook = mất điểm khách hàng, nên đặt ngưỡng cao hơn mức peak bình thường và dùng alert 50/80% như tín hiệu điều tra thật.

## [Cloud Run: Agent Platform capabilities (Preview) + Go 1.27 GA](https://docs.cloud.google.com/run/docs/release-notes) — (Cloud Run release notes, 2026-09-01)
**Đây là gì:** Cloud Run cho phép bật "Agent Platform capabilities" trên service và job, để AI agent / MCP server xác thực an toàn bằng **system-managed Agent Identities** và tự động đăng ký vào Agent Registry (Preview). Cùng ngày, runtime **Go 1.27** lên GA.
**Vì sao đáng đọc:** Nếu Joy Loyalty muốn dựng MCP server (kiểu các tool `joy_*`) hay agent chạy trên Cloud Run, phần identity/auth trước đây phải tự làm bằng service account + token thủ công; giờ có cơ chế identity do hệ thống quản lý. Đáng theo dõi khi mở rộng hướng AI agent cho merchant.

## [BigQuery: query run history ngay trong Results pane (GA) + gemini-3.8-flash](https://docs.cloud.google.com/bigquery/docs/release-notes) — (BigQuery release notes, 2026-09-21)
**Đây là gì:** Trong BigQuery console, pane kết quả nay hiển thị lịch sử các lần chạy query gần đây (kể cả multi-statement query) mà không cần nhảy sang tab Job History — đã GA. Cùng ngày, các hàm generative AI của BigQuery thêm hỗ trợ model `gemini-3.8-flash`.
**Vì sao đáng đọc:** Khi debug query phân tích loyalty (points earned/redeemed theo shop, cohort retention), việc so sánh nhanh vài lần chạy liên tiếp tiết kiệm thời gian thật — trước đây phải mở Job History để tìm lại query cũ. Model flash mới thì đáng thử cho các job phân loại/summarize dữ liệu merchant trực tiếp bằng SQL, rẻ hơn dựng pipeline riêng.

## [Authentication made easy: Building a secure e-commerce shopping cart with Firebase](https://firebase.blog/posts/2026/09/secure-shopping-cart-firebase) — (firebase.blog, 2026-09-01)
**Đây là gì:** Bài hướng dẫn pattern bảo mật cho giỏ hàng: dùng **Anonymous Auth** cấp identity ngay khi load trang (không cần signup), Security Rules giới hạn theo path `/carts/{uid}/items` và chặn client chỉ được ghi đúng field `qty` bằng `.hasOnly(['qty'])`, xử lý chuyển guest → account (link credential giữ nguyên `uid`, hoặc batch migrate khi user cũ đăng nhập lại), và đẩy việc tính giá cuối về backend Cloud Run verify ID token.
**Vì sao đáng đọc:** Đúng bài toán widget loyalty của Joy: khách chưa login vẫn cần state (điểm dự kiến, reward đang chọn), rồi merge khi họ đăng nhập. Hai điểm áp dụng được ngay: (1) field-level write restriction bằng `hasOnly` để client không tự sửa `points`/`tier`; (2) câu chốt của bài — **"rules are not filters"** — query từ client phải có `where()` khớp đúng điều kiện trong rules, nếu không sẽ fail permission dù data hợp lệ.
