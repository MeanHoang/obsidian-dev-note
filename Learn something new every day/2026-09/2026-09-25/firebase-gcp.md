# 🔥 Firebase & GCP — 2026-09-25

> Tuần này ít tin lớn: nổi bật nhất là Cloud Run delayed jobs (chạy job chậm lại để được giá rẻ hơn), cùng unit test cho SQL pipeline trong BigQuery (GA) và rules simulator của Firestore trên Cloud console.

## ⭐ [Cloud Run jobs: Delay execution (Preview)](https://docs.cloud.google.com/run/docs/delayed-jobs) — (Cloud Run docs, release notes 2026-09-08)
**Đây là gì:** Một chế độ mới của Cloud Run jobs. Bạn chấp nhận để Google chạy job **vào lúc nào đó trong vòng 12 giờ tới**, rơi vào khung giờ hạ tầng đang rảnh, và đổi lại được **tính giá thấp hơn**. Giống gửi hàng "giao tiết kiệm" thay vì "giao hỏa tốc": hàng vẫn tới, chỉ là không biết chính xác lúc nào.
**Chi tiết:**
- Bật bằng flag `--delay-execution`: `gcloud beta run jobs create JOB_NAME --image IMAGE_URL --delay-execution --region=REGION`. Cũng có thể lấy job thường chạy dạng delayed qua `gcloud beta run jobs execute JOB_NAME --async --delay-execution`. Tắt bằng `--no-delay-execution`. Trên console là checkbox "Delay execution", còn trong `job.yaml` là `delayExecution: "true"`.
- Giới hạn: việc cấp tài nguyên (provisioning) có thể mất tới 12 giờ. Tổng thời gian chạy của các task trong một execution tối đa 12 giờ, và task timeout cũng là 12 giờ. Theo docs, cả execution được đảm bảo xong trong vòng 24 giờ.
- **Không đảm bảo thời điểm chạy.** Docs chỉ nói job chạy "at some point in next 12 hours", nên đừng dùng cho việc cần đúng giờ.
- Mức giá giảm nằm ở trang [Cloud Run pricing](https://cloud.google.com/run/pricing#delayed-jobs). Docs không ghi con số % cụ thể và mình cũng chưa đọc được con số này.
- Tính năng đang ở giai đoạn Preview và dùng lệnh `gcloud beta`.

**Vì sao đáng đọc:** Joy Loyalty có nhiều batch không gấp như recalculate tier, expire điểm hằng đêm, export analytics sang BigQuery hay backfill dữ liệu shop. Chuyển các job Cloud Run này sang delayed là cách giảm bill rất nhanh mà không phải sửa code JS. Chỉ cần tách riêng những job phải chạy đúng giờ (ví dụ gửi email nhắc điểm sắp hết hạn theo lịch).

## [BigQuery pipelines: unit test cho SQL transformation (GA)](https://docs.cloud.google.com/dataform/docs/test-data) — (BigQuery release notes 2026-09-17)
**Đây là gì:** Pipelines (dựa trên Dataform) giờ cho phép viết unit test cho logic SQL. Bạn khai báo dữ liệu giả (mock) cho các bảng đầu vào bằng block `input`, rồi viết câu `SELECT` mô tả kết quả mong đợi. Test trả về `SUCCESS` nếu kết quả khớp, `FAILURE` nếu lệch. File test là `.sqlx` với `config { type: "test", dataset: "ACTION_NAME" }`. Cần Dataform core 3.0.56 trở lên. Mỗi input tối đa 100 dòng, và docs khuyên nên giữ dưới 10 dòng.
**Vì sao đáng đọc:** Nếu team có SQL tổng hợp doanh thu loyalty, điểm theo tier hay retention cohort trong BigQuery, giờ có thể test các edge case như NULL, đơn refund hay aggregate trước khi deploy. Không còn phải phát hiện sai số trên dashboard của merchant rồi mới sửa.

## [BigQuery data agent publish lên Gemini Enterprise (Preview)](https://docs.cloud.google.com/bigquery/docs/release-notes) — (BigQuery release notes 2026-09-22)
**Đây là gì:** BigQuery data agent là agent hỏi đáp dữ liệu bằng ngôn ngữ tự nhiên. Giờ có thể publish nó vào Gemini Enterprise bằng cách đăng ký agent với Agent Registry. Nếu BigQuery và Gemini Enterprise cùng project và cùng region Agent Gateway thì credential được cấu hình tự động (Google-managed credentials). Cùng trang release notes còn có hai cập nhật nhỏ: ngày 24/09 bảng Query results giữ cột số dòng cố định khi cuộn ngang, và ngày 21/09 Lakehouse hỗ trợ Workday Data Lake làm remote catalog.
**Vì sao đáng đọc:** Nếu công ty dùng Gemini Enterprise, team CS/Sales có thể tự hỏi số liệu (ví dụ "shop nào redeem nhiều nhất tuần này") mà không cần dev viết query hộ. Tuy vậy tính năng mới ở Preview nên chỉ nên thử nghiệm nội bộ.

## [Firestore: Security Rules simulator trên Google Cloud console](https://docs.cloud.google.com/firestore/docs/release-notes) — (Firestore release notes 2026-09-04)
**Đây là gì:** Rules simulator giờ có trong Google Cloud console cho Firestore (cả Standard và Enterprise edition). Bạn có thể thử bản rules nháp với các request giả lập, kèm auth token giả, **trước khi deploy**. Đây là bước tiếp theo sau cập nhật ngày 2026-07-20, khi Cloud console bắt đầu cho xem, quản lý và deploy rules. Tin này đã ra khoảng 3 tuần nên hơi cũ so với khung 1-2 tuần, nhưng chưa từng được đưa tin.
**Vì sao đáng đọc:** Với các collection nhạy cảm như điểm, reward hay referral của customer, sửa rules sai một dòng là có thể lộ dữ liệu giữa các shop. Giờ có thể test nhanh ngay trên Cloud console, kể cả khi project quản lý qua GCP chứ không qua Firebase console. Nên dùng song song với test bằng emulator trong CI.
