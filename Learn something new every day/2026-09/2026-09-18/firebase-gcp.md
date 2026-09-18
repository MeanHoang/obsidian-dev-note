# 🔥 Firebase & GCP — 2026-09-18

> Tuần này Firebase JS SDK vá loạt bug Auth persistence trên iOS/iPadOS Safari, BigQuery đưa unit test cho pipelines lên GA, và mở thêm hàng loạt hàm ML/AI ở dạng Preview.

## ⭐ [Firebase JavaScript SDK 12.19.0 (09/09/2026)](https://firebase.google.com/support/release-notes/js) — (firebase.google.com/support/release-notes/js)

**Đây là gì:** Bản release mới nhất của Firebase JS SDK — bộ SDK client mà app Shopify embedded (React/Polaris) dùng để gọi Auth, Firestore, AI Logic từ browser. Bản này chủ yếu là bug fix, nhưng đúng vào những chỗ hay gây lỗi khó tái hiện ở production.

**Chi tiết:** (theo release notes 12.19.0)
- **Auth:** SDK giờ kết nối lại IndexedDB persistence sau sự kiện `pagehide`, sửa lỗi `Database is closing` khi xác thực bằng popup trên **iPadOS và iOS Safari**. Đây đúng là class lỗi kiểu "chỉ xảy ra trên iPad, không repro được trên máy dev".
- **Auth:** thêm fallback mềm sang **in-memory persistence** khi khởi tạo storage thất bại — trước đó tình huống này gây deadlock (Auth treo, không resolve cũng không reject).
- **Auth:** lỗi storage giờ được bọc trong `FirebaseError` và đính kèm exception gốc → log/Sentry đọc được nguyên nhân thật thay vì một error rỗng.
- **Firestore:** hỗ trợ chuyển đổi hai chiều giữa `Temporal.Instant` và `Timestamp` của Firestore — bước đầu tiên để bỏ dần `Date` trong code xử lý thời gian.
- **Firestore:** sửa lỗi error message bị `undefined` khi fetch connection thất bại.
- **AI Logic:** sửa bug hardcode gây **lỗi 400 khi function calling** trên các model Gemini mới như `gemini-3.5-flash`; sửa validation phía client chặn nhầm `text/x.enum` khi dùng structured output.

**Vì sao đáng đọc:** Joy Loyalty chạy widget/embedded app trên đủ loại thiết bị khách hàng cuối — nhóm fix Auth trên iOS/iPadOS Safari và fallback in-memory persistence trực tiếp giảm loại ticket "khách đăng nhập không được, chỉ trên iPhone". Nếu có code gọi Gemini function calling qua AI Logic thì fix lỗi 400 là lý do đủ để bump version ngay.

## ⭐ [BigQuery: unit test cho pipelines đã GA (17/09/2026)](https://docs.cloud.google.com/bigquery/docs/release-notes) — (BigQuery release notes)

**Đây là gì:** BigQuery pipelines là tính năng tự động hoá data process — lên lịch và chạy tuần tự các code asset theo dependency. Từ 17/09, khả năng **unit test** cho pipelines chuyển sang General Availability: kiểm chứng logic transform SQL bằng cách chạy nó trên **mock dataset** thay vì dữ liệu thật.

**Chi tiết:** (theo release notes 17/09 và tài liệu "Introduction to BigQuery pipelines")
- Release note ghi rõ: unit tests for pipelines **generally available**, cho phép validate logic transform SQL đối chiếu với mock dataset.
- Pipelines **được vận hành bởi Dataform**; ngoài chạy code asset, Dataform còn tự cập nhật metadata vào Knowledge Catalog cho các bảng tạo ra trong pipeline.
- Code asset được hỗ trợ trong pipeline gồm: **notebook, SQL query, data preparation, và SQLX task** (table, view, source, data quality test).
- Khi trigger, pipeline chạy các action theo dependency đã khai báo; với mỗi action BigQuery (1) thực thi SQL đã compile, (2) cập nhật trạng thái action vào log, (3) sync metadata sang Knowledge Catalog bất đồng bộ.
- Pipelines chịu **quota và limit của Dataform**, không phải quota riêng — điểm cần nhớ khi scale số pipeline.
- Trade-off thực tế: unit test chạy trên mock dataset nên bắt được lỗi logic SQL (join sai, filter sai, NULL handling), nhưng **không** thay thế được data quality test trên dữ liệu production.

**Vì sao đáng đọc:** Báo cáo loyalty của Joy (điểm tích/tiêu, tier breakdown, revenue attribution) là chuỗi transform SQL nhiều tầng — hiện sai một dòng `JOIN` thì chỉ phát hiện khi merchant kêu số lệch. Unit test trên mock dataset cho phép đưa các query báo cáo vào CI, giống cách test business logic trong Node.

## [BigQuery: ML.METRICS và các hàm phân tích mới (Preview, 10/09/2026)](https://docs.cloud.google.com/bigquery/docs/reference/standard-sql/bigqueryml-syntax-metrics) — (BigQuery ML SQL reference)

**Đây là gì:** Ngày 10/09 BigQuery mở Preview một loạt hàm phân tích mới: `ML.METRICS` (đánh giá kết quả ML mà không cần model đã lưu), `ML.CORRELATION` (phân tích tương quan thống kê trong conversational analytics), và `AI.CAUSAL_EFFECT` (định lượng tác động của một can thiệp lên time series). `ML.METRICS` nằm trong nhóm **Evaluation functions** của BigQuery ML SQL reference.

**Vì sao đáng đọc:** `AI.CAUSAL_EFFECT` đúng là câu hỏi Joy Loyalty bị hỏi nhiều nhất: "bật chương trình tier/referral có thật sự làm tăng doanh thu không, hay chỉ trùng mùa sale?" — thay vì tự dựng mô hình, có thể thử ngay bằng SQL trên BigQuery. Lưu ý đều đang **Preview**, chưa nên đưa vào báo cáo bán cho merchant.

## [5 ways to use Gemini text-to-speech (TTS) in your apps with Firebase AI Logic](https://firebase.blog/posts/2026/09/ai-logic-text-to-speech) — (firebase.blog, 09/09/2026, Ankita Saxena)

**Đây là gì:** Bài hướng dẫn dùng model `gemini-3.1-flash-tts-preview` qua Firebase AI Logic để sinh giọng nói ngay trên client. Hỗ trợ SDK **JavaScript**, Swift, Kotlin, Java, Dart, Unity; **hơn 30 giọng đa ngôn ngữ** với tự động nhận diện ngôn ngữ; output là PCM stream chất lượng cao (24kHz, 1 channel, 16-bit) trả thẳng về thiết bị client với độ trễ thấp. Có các control tuỳ biến: audio profile, scene/vibe, "director's notes" (style, accent, pacing) và chọn giọng. 5 use case bài nêu: học ngôn ngữ, đọc nội dung rảnh tay, accessibility + tóm tắt, kể chuyện/narration, và podcast nhiều người nói.

**Vì sao đáng đọc:** Ít liên quan trực tiếp tới loyalty, nhưng đáng biết vì SDK là JS thuần và gọi được từ client — nếu muốn làm accessibility cho widget (đọc số điểm, đọc reward description bằng đúng ngôn ngữ store) thì đây là đường ngắn nhất, không cần dựng service TTS riêng.

## [Firebase CLI 15.30.0 (09/09/2026)](https://firebase.google.com/support/release-notes/cli) — (firebase.google.com/support/release-notes/cli)

**Đây là gì:** Bản CLI trước 15.30.1, tập trung vào độ tin cậy khi deploy: dọn dẹp managed service account khi toàn bộ functions bị xoá, **retry khi cập nhật IAM policy** để chịu được replication lag và tranh chấp đồng thời, và **sửa deadlock khi retry deploy Cloud Functions**. Kèm theo là sửa message lỗi validate Queue ID của Cloud Tasks emulator, cập nhật SQL Connect local toolkit lên v3.4.19, đổi `dataconnect_execute` thành `dataconnect_execute_in_emulator`, và thêm bộ SQL Connect OneMCP tools.

**Vì sao đáng đọc:** Fix deadlock khi retry deploy Cloud Functions và retry IAM policy là hai thứ trực tiếp cắt bớt cảnh deploy treo giữa chừng rồi phải chạy lại thủ công — đáng bump CLI trong CI của Joy Loyalty.
