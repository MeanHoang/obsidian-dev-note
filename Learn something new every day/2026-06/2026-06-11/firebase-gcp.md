# 🔥 Firebase & GCP — 2026-06-11

> Tuần này nặng về release notes: Admin Node.js SDK v14.0.0 ra mắt với breaking change Node 22+, BigQuery cho phép gộp nhiều remote function vào 1 Cloud Run service, và Firestore tích hợp Knowledge Catalog.

## ⭐ [Firebase Admin Node.js SDK v14.0.0 — drop Node 18/20, revamp error handling](https://firebase.google.com/support/release-notes/admin/node) — (firebase.google.com, 2026-06-08)
**Đây là gì:** Major release của Admin SDK cho Node.js (bản chạy trên Cloud Run / Cloud Functions / backend), phát hành ngày 08/06/2026, với nhiều breaking change và hệ thống error handling mới toàn SDK.
**Chi tiết:**
- **Breaking — Node version:** "Dropped support for Node.js 18 and 20. You should use Node.js 22 or higher when deploying the Admin SDK." → upgrade lên v14 mà runtime/base image còn Node 20 là vỡ deploy.
- **Breaking — module system:** bỏ hẳn legacy namespace API, bắt buộc import qua ES module entry points:
  ```js
  // v14: không còn admin.firestore() kiểu namespace cũ
  import { initializeApp } from 'firebase-admin/app';
  import { getFirestore } from 'firebase-admin/firestore';
  ```
- **Error handling revamp toàn SDK:** thêm error types và error codes mới cho phép viết logic xử lý lỗi chi tiết hơn (guide tại `/docs/reference/admin/error-handling`) — code đang match lỗi bằng string message cũ cần review lại.
- **FCM:** bỏ 4 legacy message types; lỗi subscribe topic được remap về code chính xác hơn `TOPICS_SUBSCRIPTION_RATE_EXCEEDED`.
- **Khác:** bỏ Instance ID API (dùng Installations API thay thế), Firestore library nội bộ lên 8.6.0, Auth cache emulator host lúc init thay vì mỗi request.
**Vì sao đáng đọc:** Joy Loyalty dùng Admin SDK trên Cloud Run/Functions hàng ngày — trước khi bump lên v14 phải kiểm tra Node 22 trong Dockerfile/runtime config và audit mọi chỗ catch error theo message string, nếu không sẽ dính lỗi production khó trace.

## [BigQuery remote functions hỗ trợ custom path — 1 Cloud Run service phục vụ nhiều function (GA)](https://docs.cloud.google.com/bigquery/docs/release-notes) — (docs.cloud.google.com, 2026-06-08)
**Đây là gì:** BigQuery remote functions giờ cho phép khai báo path suffix riêng trong endpoint URL, nghĩa là nhiều remote function có thể trỏ về cùng 1 Cloud Run service với các route khác nhau (GA ngày 08/06). Cùng đợt release notes đầu tháng 6: BigQuery "fluid scaling" GA (03/06) — billing theo giây, không minimum duration cho autoscaling reservations; và daily token quotas để kiểm soát chi phí generative AI functions (GA).
**Vì sao đáng đọc:** Nếu Joy Loyalty export analytics sang BigQuery và cần enrich data qua remote functions, giờ chỉ cần deploy 1 Cloud Run service duy nhất với router (Express) thay vì N service — giảm số service phải quản lý, giảm min-instance cost và cold start.

## [Firestore tích hợp Knowledge Catalog để quản lý metadata](https://docs.cloud.google.com/firestore/docs/release-notes) — (docs.cloud.google.com, 2026-06-01)
**Đây là gì:** Release note ngày 01/06/2026: Firestore hỗ trợ tìm kiếm và quản lý resources qua Knowledge Catalog — platform tập trung để lưu trữ, quản lý và truy cập metadata trên GCP.
**Vì sao đáng đọc:** Với app multi-tenant như Joy Loyalty chạy nhiều database/collection Firestore, đây là cách audit và discover resource tập trung từ console thay vì tự maintain doc về cấu trúc data — hữu ích khi onboard dev mới hoặc rà soát data governance.
