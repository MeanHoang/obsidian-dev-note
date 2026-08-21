# 🔥 Firebase & GCP — 2026-08-20

> Hôm nay xoay quanh security: Firebase ra guide 3 lớp bảo mật cho web app, Cloud Run mở sandbox chạy code không tin cậy, còn Firestore đưa Security Rules lên Cloud Console.

## ⭐ [Triple-layer security for Firebase web apps](https://firebase.blog/posts/2026/07/three-layer-security) — (Firebase Blog, Roger Martinez, 30/07/2026)

**Đây là gì:** Bài hướng dẫn dựng bảo mật cho Firebase web app theo 3 lớp độc lập bổ trợ nhau — Security Rules (chặn client), Service Account + IAM (chặn backend), App Check (xác thực nguồn request). Ý tưởng: mỗi lớp bảo vệ một bề mặt tấn công khác nhau, thiếu lớp nào là hở lớp đó.

**Chi tiết:**
- **Lớp 1 — Security Rules**: tác giả đề xuất quy trình 3 bước khi viết rule: (1) xác định resource cụ thể, (2) xác định operation được phép, (3) xác định ai được phép. Ví dụ blog app: `allow get, list: if resource.data.status == "published";` và `allow create, update, delete : if isAdmin();`. Khuyến nghị dùng path cụ thể (`/posts/{postId}`) thay vì wildcard, và tách riêng `get`/`list` thay vì gộp `read` cho rõ ràng.
- **Lớp 2 — Service Account**: cảnh báo rằng dựa vào default service account đồng nghĩa với "overly permissive access to your project" — cụ thể Compute Engine default account mang role **Editor** với quyền rộng khắp project. Thay bằng user-managed service account theo least privilege; với function chỉ cần đọc/ghi Firestore thì role **Cloud Datastore User** là đủ.
- Cấu hình service account cho Cloud Functions gọn trong một chỗ:
  ```js
  setGlobalOptions({
    serviceAccount: "your-service-account@your-project-id.iam.gserviceaccount.com",
  });
  ```
- **Lớp 3 — App Check**: xác minh request đến *từ chính app của bạn*, không phải script/curl. Attestation provider theo nền tảng: **Play Integrity** (Android), **DeviceCheck hoặc App Attest** (iOS), **reCAPTCHA** (Web). Khi dev local thì dùng debug token để bypass attestation, và nên sinh token riêng theo môi trường.
- Thứ tự triển khai quan trọng: khởi tạo App Check **sớm** trong quá trình startup của app, trước khi các Firebase service khác gửi request.

**Vì sao đáng đọc:** Joy Loyalty là Shopify app chạy Firebase — lớp 2 là chỗ dễ dính nhất, vì Cloud Functions mặc định chạy bằng default service account có role Editor, tức là một function bị khai thác có thể đụng tới toàn bộ project. Đổi sang service account riêng + Cloud Datastore User là một buổi chiều làm, và đây cũng đúng thứ mà security review của Shopify hay soi. App Check thì chặn được người ta gọi thẳng endpoint loyalty của mình ngoài storefront.

## [Safely run AI-generated code in Cloud Run sandboxes](https://cloud.google.com/blog/topics/developers-practitioners/google-cloud-run-sandboxes-are-in-public-preview) — (Google Cloud Blog, 10/07/2026)

**Đây là gì:** Cloud Run bổ sung "sandbox" — vùng thực thi cô lập, spawn gần như tức thì ngay bên trong instance Cloud Run đang chạy, để execute code không tin cậy (code do AI sinh ra, binary của người dùng upload) mà không đụng tới host app hay credential. Bật bằng một flag: `gcloud beta run deploy ... --sandbox-launcher`. Bài nêu độ trễ trung bình **500ms** cho trọn vòng spawn → execute → stop, demo scale tới 1.000 sandbox. Ba ranh giới cô lập: không truy cập được env var của service lẫn metadata server, network **deny-by-default** (muốn egress phải khai báo `--allow-egress`), filesystem read-only với ghi vào overlay tạm rồi bị xoá. Đáng chú ý về giá: sandbox chạy trên CPU/memory đã cấp sẵn nên "there is no additional cost or premium to use this feature".

**Vì sao đáng đọc:** Nếu Joy Loyalty có tính năng cho merchant nhập biểu thức/rule tự viết để tính điểm, hoặc chạy code do LLM sinh ra để transform data, đây là cách chạy an toàn mà không phải dựng microVM riêng hay trả premium. Riêng ý "chạy trên tài nguyên đã cấp, không tính phí thêm" khiến bài toán chi phí khác hẳn các nền tảng sandbox chuyên dụng.

## [Cloud Run release notes — tháng 7 & 8/2026](https://docs.cloud.google.com/run/docs/release-notes) — (Google Cloud Documentation)

**Đây là gì:** Vài mục đáng chú ý gần đây: **05/08/2026** — sandbox mở rộng ra *toàn bộ* Cloud Run resource, gồm cả jobs và worker pools (Preview), không còn giới hạn ở service. **27/07/2026** — runtime **Node.js 26** vào Preview, và **Budget spend caps** vào Preview, cho phép *tạm dừng* workload Cloud Run khi chạm ngưỡng ngân sách. **14/07/2026** — import public container image từ GitHub Container Registry lên GA. **19/08/2026** — Go 1.27 runtime vào Preview.

**Vì sao đáng đọc:** Budget spend caps là thứ đáng bật ngay cho môi trường staging/dev — Cloud Run tính theo request nên một job loop lỗi hoặc bot spam webhook Shopify có thể đốt tiền âm thầm; giờ có cơ chế pause thay vì chỉ nhận alert sau khi đã cháy. Node.js 26 Preview thì nên chờ GA trước khi đụng vào production.

## [Firestore release notes — Security Rules trên Cloud Console](https://docs.cloud.google.com/firestore/docs/release-notes) — (Google Cloud Documentation)

**Đây là gì:** **20/07/2026** — có thể xem, quản lý và deploy Firestore Security Rules trực tiếp trong Google Cloud console, áp dụng cho cả Standard và Enterprise edition; kèm tạo ruleset mới, clone hoặc restore từ timeline. **11/08/2026** — Firestore hỗ trợ region mới `asia-southeast3` (Bangkok).

**Vì sao đáng đọc:** Restore rules từ timeline là cái phao khi deploy nhầm rule làm sập quyền đọc của storefront — trước đây phải lục lại git và redeploy qua CLI. Còn `asia-southeast3` (Bangkok) là region gần VN thứ hai sau Singapore, đáng cân nhắc nếu sau này tính lại độ trễ cho merchant khu vực Đông Nam Á.
