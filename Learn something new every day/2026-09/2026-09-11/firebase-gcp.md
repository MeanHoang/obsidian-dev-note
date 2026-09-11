# 🔥 Firebase & GCP — 2026-09-11

> Tuần này Firebase đẩy loạt SDK release (JS v12.19.0, Admin Node v14.4.0, CLI v15.30.0) thiên về fix ổn định Auth/Firestore, còn BigQuery tiếp tục nhồi thêm hàm ML/AI chạy trực tiếp trong SQL.

## ⭐ [Firebase JavaScript SDK v12.19.0](https://firebase.google.com/support/release-notes/js) — (firebase.google.com, 09/09/2026)
**Đây là gì:** Bản release mới nhất của Firebase JS SDK (client-side, bản dùng trong React app / Shopify app frontend). Đây là release thuần maintenance — fix bug và bổ sung interop kiểu dữ liệu, không có feature lớn.

**Chi tiết:**
- **Auth — iPadOS/iOS Safari popup:** fix lỗi IndexedDB persistence khi đăng nhập bằng popup trên iPadOS và iOS Safari. SDK giờ "gracefully fallback to in-memory persistence when persistence initialization fails", tránh tình trạng initialization deadlock (app treo ở bước khởi tạo Auth).
- **Auth — error handling:** các lỗi storage giờ được bọc trong object `FirebaseError` với error code chuẩn, thay vì ném raw error → bắt lỗi bằng `err.code` được nhất quán hơn.
- **Firestore — Temporal:** thêm hỗ trợ convert qua lại giữa `Temporal.Instant` của JavaScript và `Timestamp` của Firestore. Đây là lần đầu Firestore bắt tay với Temporal API thay vì chỉ `Date`.
- **Firestore — networking:** cải thiện message lỗi khi fetch connection thất bại (trước đây lỗi mạng khá mơ hồ, khó phân biệt với lỗi rules).
- **AI Logic:** fix bug SDK hardcode role `function` không hợp lệ gây lỗi 400 với các model Gemini mới; đồng thời bỏ client-side validation chặn nhầm một số enum type khi có response schema.

**Vì sao đáng đọc:** Hai fix đầu trực tiếp chạm vào Joy Loyalty — widget loyalty chạy trong storefront được mở rất nhiều trên iOS Safari, và lỗi IndexedDB persistence dạng deadlock chính là kiểu bug "customer không login được mà không có log". Phần `FirebaseError` code chuẩn cũng giúp dọn mấy chỗ `try/catch` đang phải đoán lỗi. Riêng `Temporal.Instant` là tín hiệu nên bắt đầu tính đường thoát khỏi `Date` khi xử lý mốc thời gian điểm/tier expiry.

## [Firebase Admin Node.js SDK v14.4.0 — deprecate Firebase ML](https://firebase.google.com/support/release-notes/admin/node) — (firebase.google.com, 10/09/2026)
**Đây là gì:** Release của Admin SDK (bản chạy server-side: Cloud Functions, Cloud Run). Điểm chính là Firebase ML module cùng toàn bộ interface/class/method liên quan bị đánh dấu deprecated, chuẩn bị cho việc service tắt hẳn ngày **15/06/2027**. Kèm theo là nâng dependency `@google-cloud/firestore` lên v9.1.0 và `@google-cloud/storage` lên v8.1.0.

**Vì sao đáng đọc:** Nếu backend Joy Loyalty còn import bất cứ thứ gì từ Firebase ML thì đã có deadline cứng để migrate. Quan trọng hơn với daily code là bump `@google-cloud/firestore` lên major v9 — đây là major version của client Firestore server-side, nên khi upgrade Admin SDK cần đọc changelog v9 trước khi deploy Functions/Cloud Run, đừng bump mù.

## [BigQuery: ML.CORRELATION, ML.METRICS và AI.CAUSAL_EFFECT vào Preview](https://docs.cloud.google.com/bigquery/docs/release-notes) — (docs.cloud.google.com, 10/09/2026)
**Đây là gì:** BigQuery bổ sung ba hàm SQL chạy trực tiếp trên bảng, đều ở trạng thái Preview:
- `ML.CORRELATION` — tính tương quan thống kê giữa một target column và một hoặc nhiều metric column trong bảng.
- `ML.METRICS` — tính evaluation metrics cho bài toán classification hoặc regression **mà không cần tạo stored model**.
- `AI.CAUSAL_EFFECT` — lượng hóa tác động của một can thiệp cụ thể lên dữ liệu time series.

**Vì sao đáng đọc:** Data loyalty của Joy vốn đã nằm sẵn trong BigQuery, nên `ML.CORRELATION` là cách rẻ nhất để trả lời kiểu câu hỏi "điểm tích lũy có tương quan với repeat purchase không" bằng một câu SQL thay vì dựng pipeline. `AI.CAUSAL_EFFECT` hợp với đúng bài toán merchant hay hỏi: bật chương trình tier mới có thật sự làm tăng retention, hay chỉ trùng mùa sale. Lưu ý vẫn là Preview, đừng đưa thẳng vào report bán cho merchant.

## [BigQuery generative AI functions hỗ trợ thêm 3 model Gemini](https://docs.cloud.google.com/bigquery/docs/release-notes) — (docs.cloud.google.com, 09/09/2026)
**Đây là gì:** Các hàm generative AI trong BigQuery nay hỗ trợ thêm `gemini-3.5-flash-lite`, `gemini-3.6-flash` và `gemini-3.7-flash` — toàn bộ đều là dòng flash, tức nhóm model rẻ và nhanh.

**Vì sao đáng đọc:** Với các job phân loại/tóm tắt chạy hàng loạt trên bảng (ví dụ gắn nhãn feedback khách hàng, phân loại lý do churn), chọn đúng biến thể flash-lite thay vì model nặng là đòn bẩy cost trực tiếp trên hóa đơn BigQuery. Đáng benchmark lại các query AI đang chạy định kỳ.

## [5 ways to use Gemini text-to-speech (TTS) in your apps with Firebase AI Logic](https://firebase.blog/posts/2026/09/ai-logic-text-to-speech) — (firebase.blog, 09/09/2026)
**Đây là gì:** Bài của Ankita Saxena (Product Manager) giới thiệu 5 hướng dùng Gemini TTS qua Firebase AI Logic: học ngôn ngữ, hướng dẫn rảnh tay (recipe/instruction), accessibility cho người khiếm thị, narration cho sách/game với tông cảm xúc điều chỉnh được, và sinh podcast/hội thoại nhiều giọng ngay phía client không cần server xử lý. Điểm nhấn kỹ thuật: Gemini TTS dùng năng lực LLM để hiểu không chỉ *nói gì* mà còn *nói như thế nào*, thông qua audio profile, scene context và "director's notes".

**Vì sao đáng đọc:** Phần multi-speaker sinh client-side là điểm đáng chú ý về mặt kiến trúc — nếu Joy làm tính năng audio (ví dụ đọc reward summary), việc không phải dựng server xử lý audio giúp tránh hẳn một tầng Cloud Run chạy dài và tốn CPU-second.
