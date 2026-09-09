# 🔥 Firebase & GCP — 2026-09-09

> Tuần này GCP ra 2 thứ đáng chú ý cho stack Joy Loyalty: Cloud Run jobs có chế độ chạy trễ để đổi lấy giá rẻ hơn, và Firestore Security Rules simulator lên thẳng Google Cloud console.

## ⭐ [Cloud Run: delay execution of a job (Preview)](https://docs.cloud.google.com/run/docs/delayed-jobs) — (Cloud Run docs / release notes, 08/09/2026)

**Đây là gì:** Một chế độ mới cho Cloud Run **jobs**: thay vì chạy ngay khi trigger, bạn đánh dấu job là "delayed" và Cloud Run sẽ tự chọn thời điểm provision trong một cửa sổ thời gian, đổi lại **giá thấp hơn job thường**. Dành cho task không gấp (batch, ETL, tổng hợp báo cáo).

**Chi tiết:**
- Cloud Run provision execution "during a low utilization window, in exchange for a lower price" — tức là bạn nhường quyền chọn thời điểm chạy cho Google để đổi lấy giá rẻ.
- Độ trễ provisioning **tối đa 12 giờ**. Tổng runtime của tất cả task trong 1 execution cũng tối đa 12 giờ → tổng cộng execution phải hoàn tất trong vòng **24 giờ**. Task timeout trần vẫn là 12 giờ.
- Bật/tắt bằng gcloud flag `--delay-execution` / `--no-delay-execution`; muốn chạy ngay lập tức khi create/update thì thêm `--execute-now`. Với YAML là field `delayExecution: "true"`.
- Có thể chuyển qua lại: một job thường vẫn execute được dưới dạng delayed và ngược lại — không cần định nghĩa 2 job riêng.
- Cảnh báo vận hành: "When a delayed job's execution has reached the maximum duration limit, the execution is cancelled by the system" — job bị hủy chứ không retry, nên logic phải idempotent.
- Trang docs chỉ trỏ sang Cloud Run Pricing cho con số discount cụ thể, **không nêu phần trăm** trong docs. Đây là feature pre-GA (Preview), support hạn chế.

**Vì sao đáng đọc:** Joy Loyalty có kha khá job kiểu "chạy 1 lần/ngày": recalculate tier cho member, expire points, tổng hợp analytics report, sync dữ liệu Shopify về BigQuery. Toàn bộ đám này không gấp theo phút — chuyển sang delayed jobs là cắt cost hạ tầng gần như free, chỉ cần đảm bảo job idempotent và không có downstream nào assume "chạy đúng 2h sáng". Ngược lại, job nào ảnh hưởng trực tiếp trải nghiệm merchant (ví dụ import member sau khi cài app) thì **tuyệt đối giữ nguyên** — 12 tiếng trễ là không chấp nhận được.

## ⭐ [Firestore Security Rules simulator lên Google Cloud console](https://docs.cloud.google.com/firestore/native/docs/security/get-started) — (Firestore release notes, 04/09/2026)

**Đây là gì:** Simulator để test security rules trước khi deploy — vốn chỉ có trong Firebase console — nay đã có trong **Google Cloud console**, cho cả Firestore Standard và Enterprise edition.

**Chi tiết:**
- Đường đi: Google Cloud console → Databases → click database ID → menu **Security** → tab **Simulator**.
- Simulate được 4 loại operation: **get, create, update, delete**, ở cả trạng thái đã đăng nhập lẫn chưa đăng nhập.
- Với request có auth, bạn bật authentication, chọn provider (Google, Anonymous...) và tự cấu hình các field trong token payload → test được rule kiểu `request.auth.token.shop_id == ...`.
- Điểm quan trọng dễ nhầm: "Simulated requests run against the ruleset in your editor, not your deployed ruleset" — nó chạy trên rules đang gõ trong editor, không phải rules đang live.
- Cần IAM permission `firebaserules.rulesets.test` mới dùng được.
- Docs vẫn khuyến nghị dùng **Local Emulator Suite** để viết unit test tự động — simulator là công cụ thử tay, không thay thế test trong CI.

**Vì sao đáng đọc:** Joy Loyalty đọc/ghi Firestore từ cả backend (Admin SDK, bypass rules) lẫn widget phía storefront (client SDK, chịu rules). Mỗi lần sửa rules phân quyền theo `shop_id` là một lần rủi ro leak dữ liệu member giữa các shop. Có simulator ngay trong Cloud console — nơi mình vốn đã ngồi để xem index và quota — nghĩa là verify rule nhanh hơn nhiều so với deploy rồi test bằng tay. Nhưng nhớ: pass simulator ≠ pass production, vẫn phải có emulator test trong pipeline.

## [Firebase AI Logic hỗ trợ gemini-3.8-flash, Firebase CLI v15.29.0](https://firebase.google.com/support/releases) — (Firebase release notes, 02/09/2026)

**Đây là gì:** Firebase AI Logic SDK đã hỗ trợ model stable mới nhất `gemini-3.8-flash` qua Gemini Developer API hoặc Agent Platform Gemini API. Kèm theo là Firebase CLI v15.29.0.

Điểm cần lưu ý khi migrate: model này **không hỗ trợ `MINIMAL` thinking level** (phải dùng thinking levels thay vì budgets), và đã **bỏ một loạt param quen thuộc**: temperature, top-K, top-P, frequency penalty, presence penalty, candidate count. Prefilled model turns cũng không còn được hỗ trợ. CLI v15.29.0 thêm biến môi trường `FIREBASE_DEBUG_PATH` và flag `-f, --force` cho `firebase ext:migrate`.

**Vì sao đáng đọc:** Nếu Joy Loyalty có feature AI nào gọi Gemini qua Firebase AI Logic (gợi ý reward, viết mô tả campaign), thì việc bỏ `temperature`/`top-P` là **breaking change ở tầng code**, không phải chỉ đổi tên model — phải rà lại toàn bộ chỗ build request và thay bằng thinking level. `FIREBASE_DEBUG_PATH` thì hữu ích ngay cho việc gom log CLI trong CI.

## [BigQuery: AI.PREDICT trong conversational analytics + Rust SDK Preview](https://docs.cloud.google.com/bigquery/docs/release-notes) — (BigQuery release notes, 01–08/09/2026)

**Đây là gì:** Chuỗi update BigQuery đầu tháng 9. Đáng chú ý nhất: conversational analytics giờ trả lời được câu hỏi dạng **predictive modeling** thông qua hàm `AI.PREDICT` (Preview, 08/09/2026); market basket analysis đã GA (03/09/2026); Rust SDK cho BigQuery vào Preview (01/09/2026); driver Simba JDBC có bản mới (02/09/2026).

**Vì sao đáng đọc:** Joy Loyalty đẩy dữ liệu order/member/points sang BigQuery để làm analytics — market basket analysis GA là món hợp trực tiếp với bài toán "khách mua A thường mua kèm B" để gợi ý reward bundle, còn `AI.PREDICT` qua conversational analytics mở đường cho việc hỏi thẳng bằng ngôn ngữ tự nhiên về churn/retention thay vì phải tự viết BQML pipeline. Rust SDK thì không liên quan tới stack JS hiện tại, chỉ để biết.
