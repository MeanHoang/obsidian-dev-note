# Chương 8 — Refactoring the Database

> ⚠️ Tóm tắt khái niệm theo mục lục sách + kiến thức DDD chuẩn — không phải bản dịch nguyên văn. Đọc sách gốc để lấy case study chi tiết. Ví dụ đời sống & Joy Loyalty là ví dụ của mình, không phải từ sách. Sách viết thiên về SQL — note này dịch thêm sang góc nhìn Firestore (NoSQL) của mình.

## TL;DR
Code refactor được từng bước nhỏ thì database cũng phải vậy — chương này trả lời: **làm sao thay đổi schema/dữ liệu đang chạy production mà không downtime, và khi tách module/service thì dữ liệu chia thế nào?** Hai ý xương sống: (1) mọi thay đổi DB đi qua **expand → migrate → contract** — không bao giờ "đổi một phát ăn ngay"; (2) khi dữ liệu phân tán theo bounded context thì mất transaction chung, phải chọn có ý thức giữa gọi sync, replica qua event, saga + compensating action — và mọi dữ liệu duplicate phải biết **ai là nguồn sự thật**.

## Nội dung chính

### Evolutionary database development — DB tiến hoá từng bước

🏪 **Ví dụ đời sống:** thay đường ống nước cho cả chung cư đang có người ở. Không ai cắt nước toàn bộ rồi "cố làm xong trong đêm" — lỡ 3h sáng phát hiện ống mới lỗi thì cả chung cư khô khốc. Cách đúng: **lắp ống mới chạy song song ống cũ** (expand), chuyển van từng tầng sang ống mới, theo dõi vài ngày (migrate), tất cả ổn rồi mới tháo ống cũ (contract). Bất kỳ lúc nào cũng quay lại ống cũ được chỉ bằng một cái vặn van.

Trong code, cái này chính là:
- Tư duy cốt lõi (trường phái Ambler/Sadalage): schema không phải thứ "thiết kế một lần rồi đóng băng" — nó tiến hoá cùng code, mỗi thay đổi là một **migration nhỏ, có version, chạy tự động** trong pipeline như code.
- Nguyên tắc vàng cho zero-downtime: **expand → migrate → contract**:
  1. **Expand**: thêm cấu trúc mới *song song* cấu trúc cũ (thêm field mới, chưa xoá field cũ); code ghi cả hai (dual write) hoặc đọc có fallback.
  2. **Migrate**: backfill dữ liệu cũ sang cấu trúc mới; chuyển reader dần sang cấu trúc mới.
  3. **Contract**: khi xác nhận không còn ai đọc cấu trúc cũ → xoá. Mỗi bước **deploy riêng, rollback được**.
- **Góc Firestore (NoSQL)**: không có schema cứng nên không có `ALTER TABLE` — nhưng điều đó **không** có nghĩa là không có schema; schema nằm trong code đọc/ghi (**schema-on-read**). Như tủ hồ sơ không có form in sẵn: ai bỏ giấy gì vào cũng được, nên người *đọc* hồ sơ phải đủ khôn để hiểu cả giấy viết theo mẫu 2023 lẫn mẫu 2026.
- Ví dụ Joy Loyalty — đổi shape document member đang chạy production: gom `pts`, `lifetimePts` rời rạc thành object `points` có cấu trúc:

```js
// BƯỚC 1 — EXPAND: code ghi CẢ HAI shape, đọc ưu tiên mới + fallback cũ
function readPoints(doc) {
  if (doc.schemaVersion >= 2) return doc.points;            // shape mới
  return { balance: doc.pts || 0, lifetime: doc.lifetimePts || 0 }; // shape cũ
}
async function writePoints(ref, points) {
  await ref.set({
    points,                                  // shape mới
    pts: points.balance,                     // shape cũ — giữ cho reader cũ
    lifetimePts: points.lifetime,
    schemaVersion: 2,
  }, { merge: true });
}

// BƯỚC 2 — MIGRATE: backfill batch (script chạy 1 lần, idempotent)
// hoặc LAZY MIGRATION: document tự nâng cấp khi được chạm vào
async function getMember(ref) {
  const doc = (await ref.get()).data();
  if (!doc.schemaVersion || doc.schemaVersion < 2) {
    await writePoints(ref, readPoints(doc)); // nâng cấp tại chỗ
  }
  return { ...doc, points: readPoints(doc) };
}

// BƯỚC 3 — CONTRACT (vài tuần sau, monitor xác nhận hết reader cũ):
// bỏ ghi pts/lifetimePts, chạy script xoá field cũ (FieldValue.delete())
```

- Rủi ro lớn nhất của NoSQL: document tạo từ 2 năm trước **vẫn nằm đó với shape cũ** — code phải defensive (fallback) hoặc backfill triệt để. Field `schemaVersion` là vũ khí rẻ nhất: thêm ngay từ bây giờ, dù chưa cần.

### Database refactoring patterns

Sách dựa trên catalog database refactoring kinh điển — các pattern tiêu biểu và bản dịch sang Firestore:

| Pattern | SQL | Bản dịch Firestore |
|---|---|---|
| **Rename column/field** | View/trigger trung gian | Expand (ghi cả `pts` lẫn `pointBalance`) → backfill → contract |
| **Split table / Move column** | Tách bảng theo nghiệp vụ | Tách document to thành document/subcollection riêng — vd `members/{id}` phình to → tách `members/{id}` + `members/{id}/pointsAccount`; nhớ giới hạn **1MB/document** và write contention trên document nóng (1 write/giây/document là ngưỡng nên nhớ) |
| **Introduce calculated field** | Computed column / materialized view | Field tính sẵn (`balance`, `tierPoints`) — chính là read model chương 7; phải có nguồn gốc rõ (derive từ ledger) + job recompute |
| **Encapsulate database access** | Stored procedure / DAO | **Repository pattern** — mọi truy cập Firestore đi qua repo của module |

🏪 **Repository — ví dụ đời sống:** kho hàng chỉ nên có **một thủ kho giữ chìa khoá**. Khi ai cũng tự do vào kho lấy đồ, muốn sắp xếp lại kệ là bất khả thi — vì không biết ai đang quen lấy đồ ở kệ nào. Có thủ kho rồi thì đổi cách xếp kệ thoải mái: người ngoài vẫn chỉ cần nói "cho tôi món X".

→ Đây là pattern **nền tảng phải làm TRƯỚC** các refactor khác: còn chỗ nào query thẳng collection thì mọi thay đổi cấu trúc dữ liệu đều phải sửa rải rác khắp codebase.

### Extracting services and managing data consistency

🏪 **Ví dụ đời sống:** đặt tour du lịch trọn gói = book vé máy bay + book khách sạn + thuê xe — ba nhà cung cấp khác nhau, **không có nút "đặt cả ba hoặc không gì cả"**. Đại lý tour xử lý kiểu khác: book lần lượt, và nếu khách sạn hết phòng thì **gọi hoàn vé máy bay đã đặt** (hành động bù). Mỗi bước đều chắc chắn xong trong nhà cung cấp của nó, còn tính "trọn gói" được đảm bảo bằng quy trình bù trừ, không phải bằng phép màu.

Trong code:
- Khi một bounded context tách ra (module riêng hoặc service riêng), nguyên tắc DDD: **mỗi context sở hữu dữ liệu của mình** — không module nào đọc/ghi thẳng collection của module khác, chỉ qua API hoặc event.
- Hệ quả: mất transaction chung. Trong monolith, redeem + trừ điểm nằm trong một Firestore transaction; khi `rewards` và `points` tách ownership, phải dùng **Saga**: chuỗi local transaction nối bằng event, mỗi bước có **compensating action** nếu bước sau fail.
- Saga thực tế của Joy Loyalty — redeem có gọi hệ ngoài (Shopify):
  1. Trừ điểm (local transaction) → phát `points.deducted`
  2. Gọi Shopify Admin API tạo discount code
  3. Fail? → compensating action: **hoàn điểm** + phát `points.refunded` (event riêng, có lý do — không phải "lén cộng lại")
- Hai kiểu saga: **choreography** (các module tự nghe event của nhau, không nhạc trưởng — gọn khi ít bước) và **orchestration** (một orchestrator điều khiển từng bước — dễ trace khi luồng dài, nên dùng khi saga > 3 bước).
- Kỹ thuật tách dữ liệu an toàn: giống strangler — module mới dual-write/sync từ collection cũ, chuyển reader dần, rồi cắt. **Đừng "chuyển dữ liệu một đêm"** — đó là cắt nước cả chung cư.
- Lưu ý Firestore: transaction giới hạn 500 document và chỉ trong một database — thiết kế ranh giới aggregate sao cho **một command chỉ cần transaction trên một aggregate** (một document hoặc nhóm document nhỏ).

#### Outbox pattern với Firestore + Pub/Sub

🏪 Nhắc lại hình ảnh chương 7: ghi sổ và bỏ thư vào **khay gửi đi** là MỘT động tác — bưu tá đến lấy thư sau, lấy hỏng còn lấy lại được.

```js
// 1) Ghi nghiệp vụ + ghi outbox trong CÙNG một transaction — không thể lệch
await db.runTransaction(async (tx) => {
  const memberRef = db.doc(`shops/${shopId}/members/${memberId}`);
  tx.update(memberRef, { 'points.balance': FieldValue.increment(-cost) });
  tx.set(db.collection('outbox').doc(), {
    topic: 'loyalty-events',
    type: 'reward.redeemed',
    payload: { shopId, memberId, rewardId, pointsSpent: cost },
    status: 'pending',
    createdAt: FieldValue.serverTimestamp(),
  });
});

// 2) Relay worker (Cloud Run job / scheduler): đọc outbox → publish → đánh dấu
const pending = await db.collection('outbox')
  .where('status', '==', 'pending').orderBy('createdAt').limit(100).get();
for (const doc of pending.docs) {
  const evt = doc.data();
  await pubsub.topic(evt.topic).publishMessage({
    json: { type: evt.type, ...evt.payload },
    attributes: { eventId: doc.id }, // subscriber dùng làm khoá idempotency
  });
  await doc.ref.update({ status: 'published' });
}
// Lưu ý: relay có thể publish TRÙNG (publish xong, update fail) →
// subscriber bắt buộc idempotent theo eventId. At-least-once là luật chơi.
```

- Biến thể "outbox miễn phí" trên GCP: Firestore trigger (Eventarc) trên collection nghiệp vụ — trigger chỉ phát khi ghi DB đã thành công, đỡ tự viết relay; đổi lại ít kiểm soát hơn (retry policy, ordering).

### Distributed data access patterns

🏪 **Ví dụ đời sống:** quán cà phê cần biết giá sữa của đại lý. Ba cách: (1) mỗi lần pha một ly lại **gọi điện hỏi đại lý** — luôn đúng giá nhưng đại lý bận là quán đứng hình; (2) **dán bảng giá đại lý gửi mỗi sáng** lên tường — nhanh, chấp nhận giá có thể cũ vài tiếng; (3) việc tổng kết doanh thu tháng thì làm trên **sổ tổng hợp riêng**, không gọi điện hỏi từng đại lý từng dòng.

Trong code — khi module A cần dữ liệu của module B, theo thứ tự coupling giảm dần:
- **Gọi API/facade của B** (sync): đơn giản, dữ liệu luôn tươi, nhưng A chết theo B và chậm theo B.
- **Local cache/replica**: A giữ **bản sao tối thiểu** dữ liệu của B, cập nhật qua event của B — vd module `rewards` giữ sẵn `memberTier` (update khi nghe `tier.upgraded`) để check eligibility mà không gọi `tiers` mỗi lần.
- **Read model dùng chung cho query** (CQRS): query tổng hợp đa context (dashboard) đọc từ projection riêng, không gọi vòng quanh các module.
- Quy tắc chọn: dữ liệu cần **độ tươi tuyệt đối + tham gia quyết định nghiệp vụ** (balance khi redeem) → gọi sync/own data; dữ liệu **tham khảo, chấp nhận trễ** (tier để hiển thị, email để gửi mail) → replica qua event.

### Caching, replication, and synchronization strategies

- **Caching**: các chiến lược chuẩn — **cache-aside** (đọc cache, miss thì đọc DB rồi nạp cache), write-through (ghi DB và cache cùng lúc), TTL. Vấn đề khó duy nhất là **invalidation** — và trong kiến trúc event-based, event chính là tín hiệu invalidate đẹp nhất (`points.earned` → update/xoá cache balance của member đó). Hình ảnh: bảng giá photocopy dán ở quầy là cache; nghe loa "giá sữa đổi" thì thay tờ mới — đừng chờ hết tuần (TTL) mới thay.
- **Replication**: nhân bản dữ liệu cho mục đích đọc — trong thế giới Firestore, "replication" thực dụng là duplicate vào read model/collection summary (chương 7), hoặc **export sang BigQuery** cho analytics thay vì aggregate trên Firestore (vừa chậm vừa tốn tiền document read).
- **Synchronization** hai chiều với hệ ngoài (Shopify customer ↔ member) là dạng khó nhất, ba bài toán bắt buộc:
  - **Idempotency**: webhook Shopify gửi trùng là chuyện thường — xử lý hai lần không được cộng điểm hai lần; dùng webhook/event ID làm khoá đã-xử-lý.
  - **Thứ tự không đảm bảo**: event đến sau có thể mang dữ liệu cũ hơn — so timestamp/version trước khi ghi đè.
  - **Reconciliation job** định kỳ: so nguồn sự thật với bản sao để bắt drift mà hai cơ chế trên lọt lưới.
- Mọi dữ liệu duplicate đều phải trả lời được 2 câu: **nguồn sự thật là ai?** và **lệch thì phát hiện + sửa bằng gì?** Không trả lời được → đừng duplicate.

## Sai lầm thường gặp
1. **Đổi schema một phát ăn ngay** — deploy code chỉ đọc shape mới trong khi triệu document cũ vẫn shape cũ → lỗi rải rác khó hiểu suốt nhiều tuần (vì chỉ document cũ mới lỗi). Luôn expand–migrate–contract, kể cả khi "chỉ là đổi tên field".
2. **Contract quá sớm** — xoá field/collection cũ khi còn một consumer quên kiểm (cái script report chạy mỗi tháng chẳng hạn). Trước khi contract: log warning khi có reader chạm shape cũ, chờ im lặng vài tuần rồi mới xoá.
3. **NoSQL nên khỏi cần nghĩ về schema** — không ép schema lúc ghi nghĩa là *mỗi nơi đọc* phải tự xử mọi shape lịch sử. Không có `schemaVersion`, không có quy ước, sau 2 năm mỗi document một kiểu — "tủ hồ sơ không form" đúng nghĩa đen.
4. **Query thẳng collection của module khác "cho nhanh"** — dashboard đọc thẳng `pointTransactions` của module points: từ nay points không bao giờ đổi được cấu trúc collection nữa mà không phá dashboard. Mọi truy cập xuyên context đi qua API/read model.
5. **Dual write không outbox** — `update DB` rồi `publish Pub/Sub` nối nhau trần trụi; fail giữa chừng là data lệch không dấu vết. Outbox hoặc Firestore trigger, và subscriber luôn idempotent.
6. **Duplicate dữ liệu mà không có chủ** — copy `memberTier` sang module rewards nhưng không ai trả lời được "lệch thì sao". Mỗi bản sao phải có: nguồn sự thật + cơ chế cập nhật + reconciliation.

## Thuật ngữ cần nhớ
| Thuật ngữ | Nghĩa là gì (1 câu) |
|---|---|
| Evolutionary database design | Schema tiến hoá bằng các migration nhỏ, có version, tự động như code. |
| Expand–migrate–contract | Lắp ống mới song song → chuyển van từng tầng → tháo ống cũ; ba bước deploy riêng, rollback được. |
| Schema-on-read | NoSQL không ép schema lúc ghi — code đọc phải hiểu mọi shape đang tồn tại. |
| Lazy migration | Nâng cấp document lên shape mới tại thời điểm chạm vào nó, kèm `schemaVersion`. |
| Backfill | Script chạy một lần (idempotent) nâng cấp hàng loạt dữ liệu cũ sang shape mới. |
| Repository pattern | "Một thủ kho giữ chìa khoá" — mọi truy cập DB qua một lớp, điều kiện tiên quyết để refactor DB. |
| Data ownership | Mỗi bounded context sở hữu collection của mình, bên ngoài chỉ vào qua API/event. |
| Saga | Chuỗi local transaction nối bằng event, fail thì chạy compensating action. |
| Compensating action | Hành động bù để hoàn tác một bước đã commit (hoàn điểm khi tạo discount fail). |
| Choreography / Orchestration | Saga tự phối hợp qua event vs có nhạc trưởng điều khiển từng bước. |
| Outbox pattern | Ghi event vào collection outbox cùng transaction với dữ liệu; relay publish sau, at-least-once. |
| Idempotency | Xử lý cùng một message nhiều lần cho kết quả như một lần (khoá theo event ID). |
| Cache-aside | Đọc cache trước, miss thì đọc DB và nạp lại cache. |
| Reconciliation | Job định kỳ so nguồn sự thật với bản sao để phát hiện và sửa drift. |

## Áp dụng cho mình (Joy Loyalty)
- Thêm `schemaVersion` vào các document chính (members, campaigns, rewards) **ngay từ bây giờ** — chi phí gần 0, cứu mạng khi cần lazy migration sau này.
- Gom hết chỗ query Firestore rải rác vào repository theo từng bounded context **trước khi** đổi bất kỳ cấu trúc dữ liệu nào — bước 0 của mọi database refactoring.
- Mọi thay đổi shape document production từ nay theo đúng nghi thức expand → backfill/lazy migrate → contract, mỗi bước một deploy; viết checklist này vào quy trình team.
- Luồng redeem (trừ điểm → gọi Shopify tạo discount code) là một saga trá hình: định nghĩa rõ compensating action (hoàn điểm + event `points.refunded`) và đảm bảo mọi webhook/Pub/Sub handler idempotent bằng event ID — Shopify webhook gửi trùng là chắc chắn xảy ra, không phải "nếu".
- Triển khai outbox (hoặc tận dụng Firestore trigger qua Eventarc) cho mọi chỗ đang ghi Firestore rồi publish Pub/Sub liền kề nhau.
- Dashboard analytics của merchant đọc từ collection summary hoặc BigQuery export, đừng aggregate trực tiếp trên collection transaction — vừa nhanh vừa rẻ (Firestore tính tiền theo document read).
