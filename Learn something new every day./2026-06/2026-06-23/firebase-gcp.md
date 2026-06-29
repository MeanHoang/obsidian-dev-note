# 🔥 Firebase & GCP — 2026-06-23

> Tuần khá yên với Cloud Run/Functions/Pub/Sub/Firestore (không tin mới), điểm nhấn nằm ở Firebase CLI v15.22.x (thêm lệnh revoke secret cho App Hosting) và BigQuery Data Transfer Service mở rộng sync metadata sang Knowledge Catalog.

## ⭐ [BigQuery Data Transfer Service — sync metadata từ Oracle & MySQL vào Knowledge Catalog (Preview)](https://docs.cloud.google.com/bigquery/docs/release-notes) — (BigQuery release notes, 22/06/2026)
**Đây là gì:** *Knowledge Catalog* là nền tảng metadata của Google Cloud (tiền thân là Dataplex/Data Catalog) — nơi lưu, quản lý và tìm kiếm metadata (schema, bảng, cột, mô tả, lineage) của các tài sản dữ liệu. *BigQuery Data Transfer Service (DTS)* là dịch vụ chạy lịch transfer dữ liệu/metadata tự động từ nguồn ngoài vào BigQuery. Bản cập nhật này cho phép DTS kéo **metadata** (không phải data) từ các CSDL nguồn vào Knowledge Catalog để bạn search/quản trị tập trung.
**Chi tiết:**
- Trích nguyên văn release note: *"You can use the BigQuery Data Transfer Service to transfer metadata from the following data sources into Knowledge Catalog"*.
- Nguồn được hỗ trợ trong entry này: **Oracle** và **MySQL**.
- Trạng thái: **Preview** (chưa GA → cẩn trọng khi đưa vào pipeline production).
- Đây là metadata transfer (catalog/discovery), khác với transfer dữ liệu thật vào bảng BigQuery.
- Liên quan tới hướng đi 01/06/2026: Firestore cũng đã hỗ trợ search/quản lý resource qua Knowledge Catalog → Google đang gom metadata mọi nguồn về một catalog chung.
**Vì sao đáng đọc:** Joy Loyalty đẩy event loyalty (orders, points, redemptions) vào BigQuery cho analytics. Nếu sau này có dữ liệu nằm ở MySQL/Oracle phía merchant hoặc hệ thống nội bộ, việc DTS tự sync metadata sang Knowledge Catalog giúp data team discovery schema mà không phải dò thủ công. Hiện chỉ Preview nên ghi nhận để theo dõi, chưa nên phụ thuộc.

## [Firebase CLI v15.22.0 — thêm lệnh `apphosting:secrets:revokeaccess`](https://firebase.google.com/support/releases) — (Firebase release notes, 18/06/2026)
**Đây là gì:** App Hosting backend chạy bằng một service account riêng. Để backend đọc được secret trong Secret Manager, trước đây bạn dùng `firebase apphosting:secrets:grantaccess` để cấp quyền. Lệnh mới `revokeaccess` làm điều ngược lại — **gỡ** quyền truy cập secret ngay trong CLI thay vì phải vào Google Cloud Console xoá tay.
**Chi tiết:**
- Release note v15.22.0 (18/06): *"adds the `apphosting:secrets:revokeaccess` command, updates the Pub/Sub and SQL Connect emulators, and includes several fixes and improvements"*.
- Theo [issue gốc #10645](https://github.com/firebase/firebase-tools/issues/10645) (13/06/2026, tiêu đề "[Apphosting] Support revoke Secret Manager secret CLI command"): lệnh gỡ binding IAM `roles/secretmanager.secretAccessor` của secret cho service account của backend.
- Động lực: tuân thủ **Principle of Least Privilege** — *"users should be able to easily clean up and revoke permissions that are no longer in use directly through the Firebase CLI"*.
- Cùng đợt: bản v15.22.1 (22/06) cập nhật SQL Connect emulator lên v3.4.13 và tạm pin Docker image `firebase-tools` về Node 24.16.0.
**Đây là gì với mình:** Stack của bạn dùng Cloud Run + secret nhiều; cùng nguyên tắc PoLP, mỗi khi rotate hoặc bỏ một secret nên revoke quyền cũ thay vì để service account "ôm" quyền dư — giảm bề mặt tấn công.

## [Firebase Flutter SDK v4.16.0 & C++ SDK v13.9.0 + hướng dẫn đo IAP trên Unity](https://firebase.google.com/support/releases) — (Firebase release notes, 17/06 & 22/06/2026)
**Đây là gì:** Đợt phát hành SDK định kỳ cho client nền tảng game/mobile — chủ yếu là bản vá và thay đổi nội bộ ở Auth, Firestore, App Check, Cloud Messaging.
**Chi tiết:**
- **Flutter v4.16.0** (17/06): thay đổi ở Cloud Firestore, Firebase AI Logic, App Check, Core và Cloud Messaging; bug fixes ở Firebase AI Logic, Analytics, Cloud Messaging.
- **C++ v13.9.0** (22/06): gồm thay đổi ở Authentication và một số phần khác.
- **Analytics** (22/06): thêm hướng dẫn *"measure in-app purchases in Unity apps"*.
**Vì sao ghi nhận:** Joy Loyalty là Shopify app (web/Polaris/React), không dùng Flutter/Unity/C++ trực tiếp → tin này impact thấp với bạn, ghi để biết Firebase vẫn nhả SDK đều. Có thể bỏ qua nếu không làm mobile/game.

---

## Ghi chú kiểm tra (cửa sổ ~18–23/06/2026)
- **Cloud Run**: đã kiểm tra release notes, không có tin mới (entry gần nhất 20/04/2026 — ephemeral disk Preview).
- **Cloud Functions (Cloud Run functions) v2**: đã kiểm tra, không có tin mới (entry gần nhất 17/03/2026 — Ruby 4.0 runtime GA).
- **Pub/Sub**: đã kiểm tra, không có tin mới (entry gần nhất 17/04/2026).
- **Firestore**: đã kiểm tra, không có tin mới trong cửa sổ (entry gần nhất 01/06/2026 — Knowledge Catalog cho Firestore resources).
- **BigQuery 17/06 (autonomous embedding generation GA)**: đã xuất hiện 7 ngày qua → bỏ theo rule DEDUPE.
