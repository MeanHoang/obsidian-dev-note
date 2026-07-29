# 🔥 Firebase & GCP — 2026-07-15

> Cloud Run tung loạt tính năng "kiểm soát chi phí + vận hành" tại Next '26, cộng vài best practice cost/functions đáng nhét vào workflow daily của Joy Loyalty.

## ⭐ [What's new for Cloud Run at Next '26](https://cloud.google.com/blog/products/serverless/whats-new-for-cloud-run-at-next26) — (cloud.google.com/blog)

**Đây là gì:** Cloud Run là nền serverless container của GCP (Cloud Functions v2 chạy trên nó). Bài tổng hợp tính năng mới công bố tại Cloud Next '26.
**Chi tiết:**
- **Billing caps (Coming Soon):** đặt trần chi tiêu tối đa/tháng, khi chạm ngưỡng thì resource tự deactivate — chốt chặn cứng chống hoá đơn tăng đột biến.
- **Cloud Run MCP server (GA):** MCP server remote managed để agent/dev deploy app trực tiếp; hợp với hướng "vibe deploy".
- **SSH support (Preview):** shell trực tiếp vào container đang chạy để soi filesystem, debug production — thứ trước đây phải hack qua log.
- **Ephemeral disk + Cloud Run Instances (Preview):** disk tạm per-instance để xử lý file lớn không ngốn RAM container; Instances cho phép chạm tới từng instance riêng (hợp long-running agent).
- **NVIDIA RTX PRO 6000 Blackwell GPU (GA):** serve model 70B+, scale-to-zero khi rảnh — chỉ trả tiền lúc chạy.
- **Lưu ý cost:** billing caps + scale-to-zero GPU là cặp đôi giữ chi phí đúng ngân sách; nhớ caps sẽ *tắt service* chứ không chỉ cảnh báo.
**Vì sao đáng đọc:** Joy Loyalty chạy webhook/worker trên Cloud Run — billing caps chặn hoá đơn runaway khi merchant bùng traffic mùa sale, còn SSH giúp debug container production thay vì đoán qua log.

## [Cloud Functions version comparison: 1st gen vs 2nd gen](https://firebase.google.com/docs/functions/version-comparison) — (firebase.google.com/docs)

**Đây là gì:** Trang docs so sánh Cloud Functions 1st gen và 2nd gen (v2) cho Firebase — quyết định nên viết function mới trên gen nào.
**Chi tiết:**
- **Concurrency:** 1st gen chỉ **1 request/instance**; 2nd gen tới **1000 request/instance** → ít cold start, ít instance, rẻ hơn cho workload I/O-bound.
- **Instance size:** 1st gen tối đa 8GB RAM / 2 vCPU; 2nd gen tối đa **16GiB RAM / 4 vCPU**.
- **Timeout:** 2nd gen HTTP function chạy tới **60 phút** (event-triggered vẫn 9 phút); 1st gen tối đa 9 phút.
- **Traffic splitting:** 2nd gen hỗ trợ chia traffic giữa các revision + rollback nhanh (vì build trên Cloud Run).
**Vì sao đáng đọc:** Sync đơn hàng / tính điểm loyalty thường I/O-bound — chuyển callable/HTTP function sang v2 với concurrency cao cắt được số instance và cold start, giảm cả latency lẫn cost cho code daily.

## [Estimate and control costs — BigQuery](https://docs.cloud.google.com/bigquery/docs/best-practices-costs) — (docs.cloud.google.com)

**Đây là gì:** Docs chính thức về kiểm soát chi phí query BigQuery (nơi thường đổ analytics loyalty).
**Chi tiết:**
- `--dry_run` để ước lượng bytes scan *trước khi* chạy — bắt buộc trong CI/script tránh query đắt lọt lưới.
- `maximum_bytes_billed` đặt trần cứng: query vượt ngưỡng sẽ fail thay vì đốt tiền.
- Tránh `SELECT *`; **`LIMIT` KHÔNG giảm cost** với bảng chưa clustered — đừng nhầm.
- On-demand: mỗi bảng được tham chiếu tính tối thiểu **10 MiB**; bật long-term storage sau **90 ngày** không sửa → giảm ~50% phí lưu.
**Vì sao đáng đọc:** Dashboard retention/điểm thưởng của Joy Loyalty scan bảng lớn — đặt `maximum_bytes_billed` + `--dry_run` trong pipeline là hàng rào cost cụ thể áp dụng được ngay hôm nay.

## [What's new from Firebase at Cloud Next 2026](https://firebase.blog/posts/2026/04/cloud-next-2026-announcements) — (firebase.blog)

**Đây là gì:** Round-up Firebase tại Cloud Next 2026 — tập trung phần Auth và ngôn ngữ mới (bỏ qua phần Firestore Pipelines đã điểm tuần trước).
**Chi tiết:**
- **Phone Number Verification GA (5/2026):** lấy số SIM để verify *không cần gửi SMS*, hỗ trợ 10+ nhà mạng qua 6 khu vực — rẻ và ít ma sát hơn OTP truyền thống.
- **Cloud Functions hỗ trợ Dart (experimental):** dành cho dev Flutter muốn dùng chung 1 ngôn ngữ front/back.
- **App Check replay protection cho one-time token (coming soon):** siết bảo mật cho AI Logic.
**Vì sao đáng đọc:** Nếu Joy Loyalty làm login/verify cho merchant hoặc end-customer, phone verification không-SMS cắt chi phí OTP và giảm bước nhập mã — còn App Check replay protection đáng theo dõi cho endpoint nhạy cảm.
