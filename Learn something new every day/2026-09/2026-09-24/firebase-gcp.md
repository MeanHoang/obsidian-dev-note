# 🔥 Firebase & GCP — 2026-09-24

> Tuần này Cloud Run, Firestore và Pub/Sub không có release note mới. Tin đáng chú ý: Functions 2nd gen cuối cùng đã có Auth triggers, Admin Node SDK 14.5.0 chuyển FCM topic sang API v1, AI Logic có hook server-side chạy bằng Functions, BigQuery cho phép `WHERE` ngay trong hàm aggregate.

## ⭐ [Firebase Authentication triggers — Cloud Functions for Firebase (2nd gen)](https://firebase.google.com/docs/functions/auth-events) — (Firebase Docs / Release Notes 15/09/2026)
**Đây là gì:** Theo release notes ngày 15/09/2026, Cloud Functions for Firebase (2nd gen) đã hỗ trợ trigger theo sự kiện Firebase Authentication qua `onUserCreated` và `onUserDeleted` (từ `firebase-functions/v2/identity`). Trước giờ muốn bắt các sự kiện này thì phải giữ lại function 1st gen.
**Chi tiết:**
- `onUserCreated` chạy khi user tạo tài khoản email/password, đăng nhập lần đầu qua federated provider, được tạo bằng Admin SDK, hoặc bắt đầu một phiên anonymous. `onUserDeleted` chạy khi xoá **từng** user.
- Pattern trong docs (JS):
  ```js
  const { onUserCreated } = require("firebase-functions/identity");
  exports.newUserWelcome = onUserCreated({ secrets: [emailApiKey] }, async (event) => {
    const { uid, email, displayName } = event.data;
  });
  ```
  `event` có dạng CloudEvent: `event.data` chứa thuộc tính user, kèm metadata `id`, `type`, `time`, `project`, `tenantId`.
- Multi-tenancy (Identity Platform): bỏ trống `tenantId` thì nhận mọi tenant, đặt `IS_NOT_TENANT` thì chỉ nhận user của project mặc định, truyền chuỗi tenant ID thì chỉ nhận tenant đó.
- Hỗ trợ migrate từ 1st gen: vẫn viết được `const { user, context } = event;` như code cũ.
- Hạn chế: xoá user hàng loạt bằng Admin SDK **không** bắn event xoá. Nếu cần dọn dữ liệu thì phải tự xử lý trong flow batch đó. Firebase CLI 15.30.2 (17/09) cũng đã sửa lỗi Auth triggers 2nd gen không chạy trên emulator.

**Vì sao đáng đọc:** Joy Loyalty đang còn function 1st gen nào cho `auth.user().onCreate` (ví dụ tạo hồ sơ admin hoặc staff, hay dọn dữ liệu khi xoá user) thì giờ có thể chuyển hết sang 2nd gen. Chạy trên Cloud Run, gắn được `secrets` và concurrency như các function v2 khác. Cần lưu ý chỗ batch delete không kích hoạt trigger.

## [Firebase Admin Node.js SDK 14.5.0 — FCM topic subscription chuyển sang API v1](https://firebase.google.com/support/release-notes/admin/node) — (Firebase Release Notes, 23/09/2026)
**Đây là gì:** Bản 14.5.0 (23/09/2026) chuyển `subscribeToTopic()` và `unsubscribeFromTopic()` trong class `Messaging` từ Instance ID API cũ sang Cloud Messaging v1 topic subscription API. SDK vẫn giữ các method thay thế gọi API cũ nhưng đã đánh dấu deprecated. Bản 14.4.0 (10/09) trước đó đã nâng `@google-cloud/firestore` lên v9.1.0 và `@google-cloud/storage` lên v8.1.0, đồng thời deprecate module Firebase ML (dịch vụ sẽ ngừng ngày 15/06/2027).
**Vì sao đáng đọc:** Code backend nào dùng FCM topic (ví dụ push thông báo điểm hoặc tier) cần test lại khi bump lên 14.5.0. Bump từ 14.3 trở xuống thì kéo theo `@google-cloud/firestore` lên major v9, nên chạy lại test cho các repository Firestore trước khi deploy.

## [Run custom server-side scripts before and after requests — Firebase AI Logic](https://firebase.google.com/docs/ai-logic/pre-and-post-request-scripts) — (Firebase Docs, release 10/09/2026, Preview)
**Đây là gì:** Firebase AI Logic cho phép chạy function Cloud Functions for Firebase với 2 loại event `beforeGenerateContent` và `afterGenerateContent`. Pre-request dùng để sửa prompt, giới hạn token hoặc từ chối request bằng cách throw `HttpsError`. Post-request dùng để quan sát, sửa hoặc chặn response. Tính năng đang Preview. Một số giới hạn: mỗi loại chỉ được 1 function cho mỗi project, chỉ áp dụng cho `generateContent` (còn `generateContentStream` và Live API sẽ bỏ qua hook mà không báo gì), và có thể làm tăng latency.
**Vì sao đáng đọc:** Nếu Joy gọi Gemini trực tiếp từ client (ví dụ widget gợi ý phần thưởng), đây là chỗ để thêm moderation, cap token và log vào BigQuery mà không phải sửa client. Lưu ý: gọi kiểu stream sẽ không đi qua hook.

## [BigQuery: `WHERE` bên trong aggregate function call (Preview)](https://docs.cloud.google.com/bigquery/docs/reference/standard-sql/aggregate-function-calls) — (BigQuery Docs, release 14/09/2026)
**Đây là gì:** BigQuery cho đặt mệnh đề `WHERE` ngay trong lời gọi hàm aggregate để lọc input bằng biểu thức boolean. Tính năng đang Preview. Theo docs, khi dùng `WHERE` thì bắt buộc kèm `IGNORE NULLS`. Docs cũng khuyên dùng cách này thay cho `CASE` bên trong aggregate vì hiệu năng tốt hơn.
**Vì sao đáng đọc:** Các query báo cáo loyalty kiểu "tổng điểm earn và tổng điểm redeem trong cùng một lần GROUP BY" hiện đang viết `SUM(CASE WHEN ...)` có thể gọn hơn và chạy nhanh hơn. Vì còn Preview nên chỉ nên thử ở dashboard nội bộ trước.
