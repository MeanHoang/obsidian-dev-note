# 🔥 Firebase & GCP — 2026-09-16

> Cloud Functions v2 cuối cùng cũng có Auth event trigger (`onUserCreated`/`onUserDeleted`), Remote Config chuyển sang tính tiền theo fetch, cộng thêm 2 tin hạ tầng đáng để mắt: Cloud Run instances và BigQuery Graph GA.

## ⭐ [Firebase Authentication triggers cho Cloud Functions v2](https://firebase.google.com/docs/functions/auth-events) — (Firebase Docs, phát hành 15/09/2026)

**Đây là gì:** Trigger cho phép chạy function mỗi khi một tài khoản Firebase Authentication được **tạo** hoặc **xoá**. Trước đây `onUserCreated`/`onUserDeleted` chỉ tồn tại ở Cloud Functions gen 1; giờ đã có bản v2 trong module `firebase-functions/v2/identity`. Trạng thái: **Preview**.

**Chi tiết:**
- Hai handler: `onUserCreated` (fire khi đăng ký email/password, lần federated login đầu tiên, tạo bằng Admin SDK, hoặc mở anonymous auth session) và `onUserDeleted` (fire khi tài khoản bị xoá).
- Lưu ý quan trọng: **batch delete qua Admin SDK KHÔNG trigger event** — nếu dọn user hàng loạt thì function sẽ không chạy.
- Hỗ trợ multi-tenancy qua option `tenantId`: trỏ vào 1 tenant cụ thể (`{ tenantId: "tenant-id-1" }`), chỉ default project (`{ tenantId: IS_NOT_TENANT }`), hoặc bỏ trống để bắt mọi tenant.
- Ví dụ trong docs (JS thuần):
  ```javascript
  const { onUserCreated } = require("firebase-functions/identity");

  exports.newUserWelcome = onUserCreated(
    { secrets: [emailApiKey] },
    async (event) => {
      const { uid, email, displayName } = event.data;
      // Send welcome email
    }
  );
  ```
- Docs ghi rõ đang ở Preview, có thể có thay đổi backward-incompatible.

**Vì sao đáng đọc:** Đây là đúng use-case của Joy Loyalty — mỗi customer mới cần được tạo loyalty member record trong Firestore, và khi merchant xoá account thì phải dọn điểm/tier tương ứng. Nếu code hiện tại còn kẹt ở Cloud Functions gen 1 chỉ vì auth trigger, thì đây là mảnh ghép cuối để migrate hẳn sang v2 (được chạy trên Cloud Run, config concurrency/CPU tử tế hơn). Cảnh báo batch-delete không fire event rất đáng nhớ nếu bạn có job dọn dữ liệu merchant uninstall.

## [Pricing for Remote Config — chuyển sang usage-based từ 01/09/2026](https://firebase.google.com/docs/remote-config/pricing) — (Firebase Docs)

**Đây là gì:** Firebase Remote Config (dịch vụ đẩy config/feature flag xuống client mà không cần redeploy) từ 01/09/2026 bắt đầu tính phí theo số **fetch request mỗi ngày**, thay vì miễn phí không giới hạn như trước.

- No-cost tier: 100.000 fetch request/ngày cho mọi project.
- Blaze: 100.001–10.000.000 request/ngày = $0.000006/request ($0.06 / 10K); trên 10.000.000 = $0.000001/request ($0.01 / 10K).
- Chỉ fetch gọi trực tiếp tới Remote Config (client SDK hoặc REST API) mới bị tính; giá trị đã cache và thao tác nội bộ của Firebase khác thì không.
- Grace period cho project đã bật trước 01/09/2026: Spark 3 tháng (bắt đầu tính tiền 01/12/2026), Blaze 5 tháng (01/02/2027). Spark upgrade trước 15/11 được kéo dài thành 5 tháng.

**Vì sao đáng đọc:** Nếu Joy Loyalty dùng Remote Config để bật/tắt feature cho widget loyalty phía storefront, mỗi pageview của shopper có thể thành 1 fetch — con số 100K/ngày cháy rất nhanh khi app chạy trên vài nghìn store. Nên kiểm tra `minimumFetchIntervalMillis` ngay trong grace period, trước 01/12/2026.

## [Deploy personal AI agents with Cloud Run instances](https://cloud.google.com/blog/products/serverless/introducing-cloud-run-instances) — (Google Cloud Blog, 28/08/2026)

**Đây là gì:** "Cloud Run instances" là một dạng compute mới bên cạnh Cloud Run services: chạy **đúng một instance duy nhất, không autoscale, không scale-to-zero**, dành cho workload long-lived/stateful. Đang ở Preview.

- Chạy liên tục tới 7 ngày với restart policy tự động; mỗi instance có HTTPS URL cố định không đổi qua các lần update/restart; stop/resume thủ công.
- Giá bài blog nêu: $5.70/tháng cho 1 vCPU + 1 GiB chạy liên tục (dùng shared vCPU với burst budget).

**Vì sao đáng đọc:** Là lựa chọn rẻ hơn VM cho các worker "một mình một cõi" mà Cloud Run service làm không tốt — ví dụ job đồng bộ dài hơi với Shopify Admin API, hoặc một daemon giữ state cần URL cố định. Không thay thế service chính của Joy Loyalty, nhưng đáng biết khi cần chỗ chạy thứ gì đó luôn-bật mà không muốn trả tiền VM.

## [BigQuery Graph is now GA: the knowledge foundation for the agentic era](https://cloud.google.com/blog/products/data-analytics/bigquery-graph-connecting-data-and-ai-at-scale) — (Google Cloud Blog, 01/09/2026)

**Đây là gì:** BigQuery Graph cho phép chạy graph analytics ngay trong BigQuery bằng GQL (ISO-standard Graph Query Language) cạnh SQL, không cần dựng graph database riêng hay ETL sang nơi khác. Nay đã GA.

- Điểm GA: graph trải trên cả bảng BigQuery native lẫn Iceberg tables đa cloud không cần di chuyển dữ liệu; nhanh hơn 2x so với preview, undirected traversal nhanh hơn 100x; thêm statement `CALL` và mở rộng subquery.
- Kế thừa row-level/column-level security sẵn có của BigQuery; dùng chung query với BigQuery ML và Gemini.
- Use case blog nêu: fraud detection, identity resolution / Customer 360, supply chain, knowledge graph cho AI agent.

**Vì sao đáng đọc:** Identity resolution / Customer 360 là bài toán thật của loyalty — cùng một shopper xuất hiện dưới nhiều email/phone/device qua nhiều store. Nếu data warehouse của Joy Loyalty đã ở BigQuery, phần graph này chạy ngay trên dữ liệu hiện có, không phải bê sang Neo4j. Cũng là hướng cho referral fraud detection (phát hiện vòng referral tự giới thiệu nhau).
