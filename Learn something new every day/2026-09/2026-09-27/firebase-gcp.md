# 🔥 Firebase & GCP — 2026-09-27

> Tuần này Firebase gần như không có release mới đáng chú ý (chỉ Admin SDK Java/.NET chuyển sang FCM v1). Tin đáng đọc nằm bên GCP: Memorystore for Valkey 9.1 GA (cache nhanh hơn), bộ hàm augmented analytics của BigQuery, Cloud Run jobs chạy trễ để được giá rẻ hơn, và Security Rules simulator cho Firestore trên Cloud console.

## ⭐ [Unlock 3x QPS and microsecond latency with Memorystore for Valkey 9.1](https://cloud.google.com/blog/products/databases/memorystore-for-valkey-9-1-3x-qps-caching) — (Google Cloud Blog, 26/09/2026)
**Đây là gì:** Memorystore là dịch vụ cache in-memory được Google quản lý. Valkey là bản fork open-source của Redis, tương thích với các lệnh Redis. Bản 9.1 vừa lên GA.
**Chi tiết:**
- Theo Google, QPS tăng tới 3x so với Memorystore for Redis Cluster mà latency vẫn ở mức micro giây. Họ đạt được nhờ kiến trúc messaging đa hàng đợi không dùng lock (lock-free) và engine tự scale theo CPU và độ sâu hàng đợi.
- Thêm các lệnh atomic mới: `HGETDEL` (đọc rồi xóa một field hash trong một round-trip), `MSETEX` (set nhiều key cùng một TTL), và `HSETEX` giờ hỗ trợ cờ `NX`/`XX`.
- `CLUSTERSCAN` duyệt key trên toàn cluster (16.384 slot), chạy tuần tự hoặc song song, và không bị lỗi khi đang migrate slot hoặc failover.
- Có ACL theo từng database số, ví dụ user `staging` chỉ được vào `db=1`. Kế thừa từ 9.0: JSON native, Bloom filter, và 6 cỡ node mới từ Custom-Pico (1,25 GB) đến Highmem-XXLarge (110 GB).
- Có quy trình migration được quản lý (GA): replication online từ nguồn cũ, kiểm tra dữ liệu đã đồng bộ, rồi cutover sang endpoint mới.
**Vì sao đáng đọc:** Nếu Joy đang cache config shop, bảng tier hoặc số dư điểm trước Firestore để giảm read, `MSETEX` và `HGETDEL` giúp gom nhiều thao tác thành một lần gọi (ví dụ lấy rồi xóa một token redeem dùng một lần), và ACL theo db cho phép tách staging với prod ngay trong một instance.

## ⭐ [Agent-ready analytics: Unlocking insights with BigQuery augmented analytics](https://cloud.google.com/blog/products/data-analytics/bigquery-augmented-analytics-tvfs) — (Google Cloud Blog, 15/09/2026)
**Đây là gì:** Đây là 6 hàm dạng table-valued function (TVF), tức hàm trả về một bảng. Chúng chạy thẳng trong BigQuery SQL để trả lời các câu hỏi kiểu "vì sao metric thay đổi", nên không cần export dữ liệu ra notebook.
**Chi tiết:**
- `AI.KEY_DRIVERS` tìm yếu tố chính làm metric thay đổi. `AI.CAUSAL_EFFECT` đo tác động của một hành động so với baseline.
- `ML.CORRELATION` đo tương quan giữa các metric số. `ML.DETECT_CHANGE_POINTS` tìm ngày metric bắt đầu đổi hẳn xu hướng. `ML.TREND` tách xu hướng khỏi nhiễu ngắn hạn. `ML.SEASONALITY` tìm các chu kỳ lặp lại.
- Ví dụ trong bài (dữ liệu Austin Bikeshare): chạy lần lượt DETECT_CHANGE_POINTS → KEY_DRIVERS → CAUSAL_EFFECT thì tìm ra mốc 02/2018 và đo được mức tăng +358% so với baseline organic (89.775 chuyến tăng thêm).
- Output là SQL có cấu trúc nên có thể dùng làm skill cho AI agent. Các hàm cũng dùng được trong Conversational Analytics. Bài viết không nói rõ hàm nào đang Preview hay GA; release notes ngày 10/09 ghi `ML.CORRELATION` và `AI.CAUSAL_EFFECT` là Preview.
**Vì sao đáng đọc:** Nếu event loyalty (earn/redeem/referral) đã được export sang BigQuery, `AI.CAUSAL_EFFECT` có thể đo một campaign x2 điểm thực sự tạo thêm bao nhiêu đơn so với baseline, còn `ML.DETECT_CHANGE_POINTS` chỉ ra ngày tỷ lệ redeem của một merchant bắt đầu tụt. Cả hai chạy bằng SQL thuần, không cần viết pipeline ML riêng.

## [Delay execution of a job — Cloud Run](https://docs.cloud.google.com/run/docs/delayed-jobs) — (Cloud Run docs, Preview)
**Đây là gì:** Delayed execution là chế độ để Cloud Run tự chọn lúc hạ tầng đang rảnh (trễ tối đa 12 giờ) để chạy một job không gấp, đổi lại job được tính giá thấp hơn. Release notes ghi tính năng này ra mắt ngày 08/09/2026.
**Chi tiết:**
- Bật khi tạo job: `gcloud beta run jobs create JOB_NAME --image IMAGE_URL --delay-execution --region=REGION`. Cũng có thể bật cho riêng một lần chạy: `gcloud beta run jobs execute JOB_NAME --async --delay-execution`.
- Giới hạn: trễ tối đa 12 giờ, tổng thời gian chạy của các task tối đa 12 giờ, và job được đảm bảo hoàn tất trong vòng 24 giờ. Tắt bằng `--no-delay-execution`.
- Trang docs không ghi mức giảm giá cụ thể mà dẫn sang trang pricing của Cloud Run.
**Vì sao đáng đọc:** Các batch không cần realtime của Joy, như tính lại tier hằng đêm, dọn điểm hết hạn hay backfill analytics, có thể chuyển sang delayed job để giảm chi phí compute mà không phải sửa code.

## [Security Rules simulator cho Firestore trên Google Cloud console](https://docs.cloud.google.com/firestore/docs/release-notes) — (Firestore release notes, 04/09/2026)
**Đây là gì:** Đây là công cụ mô phỏng request trên Cloud console. Nó cho phép test bản nháp security rules với request giả lập và auth token giả trước khi deploy, dùng được cho cả Standard và Enterprise edition. Tháng 7, Cloud console đã hỗ trợ xem, quản lý, deploy và khôi phục rules từ timeline.
**Vì sao đáng đọc:** Khi sửa rules cho các collection member hoặc điểm của từng shop, có thể giả lập request mang custom claim `shopId` để kiểm tra việc cô lập dữ liệu giữa các shop ngay trên console trước khi deploy, không phải dựng emulator.
