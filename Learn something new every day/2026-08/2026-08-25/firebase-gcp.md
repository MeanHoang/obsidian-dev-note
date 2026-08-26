# 🔥 Firebase & GCP — 2026-08-25

> Firestore Enterprise pipeline queries đã GA, Firebase mở rộng sang Cloud SQL, cộng thêm 3 tài liệu best-practice sát với việc tối ưu chi phí và cold start của Joy Loyalty.

## ⭐ [What's new from Firebase at Cloud Next 2026](https://firebase.blog/posts/2026/04/cloud-next-2026-announcements) — (firebase.blog, 22/04/2026)

**Đây là gì:** Bài tổng hợp các thay đổi lớn của Firebase công bố tại Google Cloud Next 2026 — gồm hướng đi mới cho lớp dữ liệu (Firestore Enterprise, SQL Connect), quản trị hạ tầng (Application Design Center) và Auth.

**Chi tiết:**
- **Firebase SQL Connect** (tiến hoá từ Firebase Data Connect): nối app web/mobile trực tiếp tới **Cloud SQL for PostgreSQL**, có realtime syncing, offline cache và query SQL native. Đang có bản dùng thử không tính phí.
- **Firestore Enterprise Pipeline queries GA**: cú pháp query nhiều tầng, hỗ trợ **JOIN qua correlated subqueries**; full-text search và geospatial query ở trạng thái preview. Đây là lần đầu Firestore chạm được các pattern quan hệ mà trước đây phải denormalize thủ công.
- **Firebase + Application Design Center (ADC)**: mô hình deploy hợp nhất, quản lý Firestore / App Check / Authentication / AI Logic cùng chỗ với phần hạ tầng Google Cloud còn lại thay vì tách rời.
- **Firebase Phone Number Verification** lên GA từ tháng 5/2026, hỗ trợ bởi **10+ nhà mạng ở 6 khu vực**, xác thực số điện thoại **không cần gửi SMS**.
- **Dart cho Cloud Functions** ở dạng thử nghiệm (dành cho dev Flutter), và **explicit content caching** trong Firebase AI Logic để giảm chi phí prompt lặp lại.

**Vì sao đáng đọc:** Pipeline query + JOIN đổi trực tiếp cách model dữ liệu loyalty — các báo cáo kiểu "customer × tier × earn/redeem history" hiện đang phải denormalize hoặc kéo về Node xử lý, nay có thể đẩy xuống Firestore. Phone verification không cần SMS cũng là hướng cắt chi phí OTP nếu Joy Loyalty làm luồng verify khách hàng.

## [Functions best practices — Cloud Run](https://docs.cloud.google.com/run/docs/tips/functions-best-practices) — (Google Cloud Docs)

**Đây là gì:** Trang best-practice chính thức cho Cloud Run functions (tên mới của Cloud Functions v2), tập trung vào tính đúng đắn và tối ưu cold start.

**Chi tiết:**
- Viết function **idempotent** — cùng input gọi nhiều lần vẫn ra cùng kết quả (quan trọng vì Pub/Sub và event trigger là at-least-once).
- Đưa object đắt tiền (client SDK, connection pool) ra **global scope** để tái dùng giữa các invocation trên cùng instance: "may result in significant performance improvements".
- **Concurrency cao** giúp gộp nhiều request vào một instance, đỡ cold start khi traffic spike; ngược lại giới hạn concurrency thấp làm tăng cold start.
- **Min instances** được khuyến nghị cho service nhạy độ trễ; init ở global scope nên chạy đồng bộ (block) để request không được phục vụ trước khi khởi tạo xong.
- Dependencies thừa làm chậm cold start — chỉ import module thực sự dùng.

```js
// global scope: khởi tạo 1 lần cho cả instance
const { getFirestore } = require('firebase-admin/firestore');
const { initializeApp } = require('firebase-admin/app');
initializeApp();
const db = getFirestore();

exports.onOrderPaid = async (event) => {
  // idempotent: dùng eventId làm khoá chống xử lý trùng
  const ref = db.collection('processedEvents').doc(event.id);
  const snap = await ref.get();
  if (snap.exists) return;
  await ref.set({ at: Date.now() });
  // ... cộng điểm loyalty
};
```

**Vì sao đáng đọc:** Webhook Shopify (orders/paid, refunds) là at-least-once — thiếu khoá idempotent thì khách được cộng điểm hai lần. Cộng thêm việc để Firestore client ở global scope là cách rẻ nhất giảm latency webhook mà không phải trả tiền min-instances.

## [Firebase security checklist](https://firebase.google.com/support/guides/security-checklist) — (Firebase Docs)

**Đây là gì:** Checklist chính thức trước khi đưa app Firebase lên production — chống lạm dụng traffic, quản lý API key, security rules và Auth.

**Chi tiết:**
- Bật **App Check** để chỉ app của bạn gọi được backend service; đặt budget alert và monitoring cho Firestore/Storage/Hosting.
- **Giới hạn số instance đồng thời** của Cloud Functions theo mức traffic bình thường — đây là phanh chi phí khi bị spam hoặc loop vô hạn.
- Security rules: khởi tạo ở **locked mode** (deny all), coi rules như schema và **unit test bằng Local Emulator Suite, chạy trong CI**.
- API key Firebase chỉ định danh project/app nên không phải secret; nhưng **FCM server key và service account key thì phải giữ bí mật**.
- Email-password auth: siết quota endpoint `identitytoolkit.googleapis.com` chống brute force và bật **email enumeration protection**.

**Vì sao đáng đọc:** Mục "limit concurrent instances" là thứ trực tiếp chặn hoá đơn Cloud Functions nổ khi một merchant lớn đẩy hàng chục nghìn webhook; còn rule test trong CI hợp với việc Joy Loyalty có dữ liệu điểm thưởng đa merchant, sai rule là rò dữ liệu chéo shop.

## [Cost optimization best practices for BigQuery](https://cloud.google.com/blog/products/data-analytics/cost-optimization-best-practices-for-bigquery) — (Google Cloud Blog, 26/09/2019 — evergreen)

**Đây là gì:** Bài nền tảng về cách chi phí BigQuery phát sinh (storage vs bytes-processed) và các đòn bẩy giảm chi phí.

**Chi tiết:**
- Bảng không sửa đổi trong **90 ngày** tự chuyển sang long-term storage, giá giảm **~50%** mà không mất hiệu năng/độ bền.
- Chỉ SELECT cột cần dùng thay vì `SELECT *` giảm bytes processed **~8 lần** trong ví dụ của bài.
- Ví dụ đắt giá: dataset 10 TB, 10 user chạy `SELECT *` 10 lần/tháng → storage ~$200/tháng nhưng query ~**$5.000/tháng** (quét 1 PB), tức chênh **25 lần** chỉ vì thói quen query xấu.
- Đặt **default table expiration** (ví dụ 7 ngày) cho bảng staging tạm để tự xoá, khỏi trả tiền lưu trữ rác.
- Cân nhắc flat-rate khi hoá đơn tháng vượt **$10.000**; mức flat-rate tối thiểu là **500 slots**.

**Vì sao đáng đọc:** Nếu export Firestore events sang BigQuery để làm analytics loyalty, `SELECT *` trong dashboard là nguồn đốt tiền lớn nhất — partition + chọn cột + expiration cho bảng staging là ba việc làm được ngay trong tuần.
