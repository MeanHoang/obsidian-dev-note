# Chương 11 — Dealing with Events and Their Evolution

> ⚠️ Tóm tắt khái niệm theo mục lục sách + kiến thức DDD chuẩn — không phải bản dịch nguyên văn. Đọc sách gốc để lấy case study chi tiết. Ví dụ đời sống & Joy Loyalty là ví dụ của mình để minh hoạ khái niệm, không phải ví dụ trong sách.

## TL;DR
Khi hệ thống dựa trên event ([[Glossary - Thuật ngữ#CQRS|CQRS]], [[Glossary - Thuật ngữ#Event sourcing|event sourcing]], hoặc đơn giản là publish event qua Pub/Sub), event trở thành **contract lâu dài**: event đã ghi/đã gửi thì không sửa được, nhưng business thì đổi liên tục. Vấn đề trung tâm của chương: **hoá đơn mẫu cũ vẫn phải đọc được khi công ty đã đổi sang mẫu mới**. Lời giải: versioning có kỷ luật, [[Glossary - Thuật ngữ#Event versioning & upcasting|upcasting]] (dịch bản cũ sang bản mới lúc đọc), và weak schema (người đọc khoan dung). Với Joy Loyalty: ledger `point_transactions` append-only đã là event sourcing nhẹ, và mọi event qua Pub/Sub nên theo luật "chỉ thêm field, không bao giờ xoá/đổi nghĩa".

## Nội dung chính

### CQRS — sổ ghi của thủ quỹ và bảng tổng kết treo tường

🏪 **Ví dụ đời sống.** Quỹ lớp có hai thứ: cuốn **sổ thu chi** thủ quỹ ghi từng khoản (ngày nào, ai nộp, bao nhiêu, chi gì) và tờ **bảng tổng kết** dán trên tường "Quỹ hiện còn: 2.350.000đ". Cả lớp muốn biết quỹ còn bao nhiêu thì liếc bảng — không ai bắt cả lớp tự cộng lại cuốn sổ. Ghi và đọc là hai nhu cầu khác nhau, phục vụ bằng hai "tài liệu" khác nhau.

**Map sang kỹ thuật:** đó là **CQRS** (Command Query Responsibility Segregation) — tách model ghi (command: xử lý nghiệp vụ, validate, ghi sổ) khỏi model đọc (query: denormalize sẵn, tối ưu cho hiển thị). Không bắt buộc đi kèm event sourcing, và áp dụng được ở mức nhẹ.

**Joy Loyalty:** pattern này cực tự nhiên với Firestore vì Firestore không giỏi join/aggregate lúc đọc:

```js
// WRITE SIDE — sổ thu chi: ghi từng giao dịch điểm, append-only
await db.collection('point_transactions').add({
  memberId, points: 150, type: 'earn',
  source: 'order', orderId, createdAt: Date.now(),
});

// READ SIDE — bảng tổng kết: consumer/trigger update document denormalize
// Dashboard merchant chỉ đọc 1 doc, không aggregate nghìn transaction
await db.collection('member_summary').doc(memberId).set({
  balance: FieldValue.increment(150),
  lifetimePoints: FieldValue.increment(150),
  lastActivityAt: Date.now(),
}, { merge: true });
```

### Event sourcing — sổ kế toán không tẩy xoá

🏪 **Ví dụ đời sống.** Kế toán chuyên nghiệp không bao giờ lấy bút xoá sửa sổ. Ghi nhầm? Ghi thêm một **bút toán điều chỉnh**. Nhờ vậy bất kỳ lúc nào cũng truy lại được: số dư hôm nay đến từ chuỗi giao dịch nào, ai sửa gì, khi nào. Cái "số dư" chỉ là kết quả cộng dồn — cuốn sổ mới là sự thật.

**Map sang kỹ thuật:**
- **Event sourcing**: thay vì lưu state hiện tại, lưu **chuỗi event bất biến** đã xảy ra (`PointsEarned`, `PointsRedeemed`, `TierUpgraded`); state = replay toàn bộ event. Source of truth là cuốn sổ, không phải con số tổng.
- Lợi ích: audit trail hoàn hảo — với ledger điểm thì cực hợp: biết chính xác vì sao member có 1.250 điểm, trả lời được khiếu nại "shop trừ nhầm điểm của tôi". Có thể dựng read model mới từ lịch sử (mai muốn thêm bảng "điểm theo tháng"? Replay là có).
- Chi phí: phức tạp hơn CRUD nhiều. Và sinh ra đúng vấn đề của chương này: **event lưu vĩnh viễn — event hôm nay viết ra, 2 năm sau vẫn phải đọc được**, dù schema đã đổi 3 lần.
- Hệ quả chung cho mọi hệ event-driven (kể cả không event sourcing): event đã publish lên Pub/Sub là **immutable** — không gọi lại được message đã gửi, như không rút lại được lời đã nói.

### Event versioning strategies — công ty đổi mẫu hoá đơn

🏪 **Ví dụ đời sống.** Công ty dùng mẫu hoá đơn cũ 3 năm, giờ đổi mẫu mới có thêm mã QR và cột "kênh bán hàng". Nhưng trong kho còn hàng chục nghìn hoá đơn mẫu cũ — kiểm toán đến thì **mẫu cũ vẫn phải đọc được, vẫn hợp lệ**. Không ai in lại toàn bộ hoá đơn cũ theo mẫu mới (vừa đắt vừa mất tính nguyên bản), và nhân viên mới phải được dạy đọc cả hai mẫu trong giai đoạn chuyển tiếp.

**Map sang kỹ thuật** — khi cần thêm/đổi field trong event, các chiến lược chuẩn:
- **Additive change only** (cách rẻ nhất, nên là mặc định): chỉ *thêm* field optional, không bao giờ xoá/đổi nghĩa field cũ. Consumer cũ ignore field mới, consumer mới có default cho field thiếu. Như mẫu hoá đơn mới chỉ *thêm* ô, không bỏ ô cũ — ai quen mẫu cũ vẫn đọc được mẫu mới.
- **Version tường minh**: field `version: 2` trong payload, hoặc tên mới `PointsEarnedV2`. Consumer phải handle được mọi version còn tồn tại — như nhân viên phải đọc được cả hai mẫu hoá đơn.
- **Copy-and-transform / migration**: với event store, migrate toàn bộ stream sang schema mới — tức "in lại toàn bộ hoá đơn cũ": đắt, mất tính nguyên bản (audit yếu đi), thường là phương án cuối.
- Nguyên tắc: breaking change trong event = breaking change trong public API — phải có giai đoạn cả hai version cùng sống, không bao giờ "cắt phụt".

**Joy Loyalty:** event `points.earned` v1 chỉ có `{ memberId, points }`. Sau này muốn biết điểm đến từ đâu (order, review, referral...) → v2 thêm `source`; muốn phục vụ multi-store → v3 thêm `shopDomain`. Cả ba thế hệ event này có thể cùng nằm trong hệ thống (message cũ chưa ack, replay từ log, code producer cũ chưa deploy hết).

### Upcasting — người phiên dịch ở cửa kho lưu trữ

🏪 **Ví dụ đời sống.** Kho lưu trữ giữ nguyên giấy tờ viết tay chữ cũ — không ai sửa bản gốc. Nhưng ở cửa kho có một người phiên dịch: ai cần đọc thì người này "dịch" tài liệu cũ sang bản đánh máy chuẩn hiện hành, điền "không rõ" vào những mục mà mẫu cũ chưa có. Người đọc chỉ cần biết đúng một định dạng — định dạng mới nhất.

**Map sang kỹ thuật:**
- **Upcasting** = một lớp transform đặt giữa storage/transport và consumer: nhận event version cũ, **nâng cấp tại thời điểm đọc** thành version mới nhất, để domain code chỉ cần biết đúng 1 shape. Event trong store giữ nguyên bản gốc mãi mãi.
- Chuỗi upcaster: V1 → V2 → V3, mỗi bước một hàm nhỏ thuần (pure function), compose lại. Không viết hàm "V1 nhảy thẳng V3" — để mỗi bước đơn giản, test được riêng.

**Joy Loyalty — JS thuần:**

```js
// points.earned qua 3 đời schema:
// v1: { memberId, points }
// v2: + source ('order' | 'review' | 'referral' | ...)
// v3: + shopDomain (multi-store)

const upcasters = {
  1: (e) => ({ ...e, version: 2, source: e.source ?? 'unknown' }),
  2: (e) => ({ ...e, version: 3, shopDomain: e.shopDomain ?? 'legacy.myshopify.com' }),
};

function upcast(event) {
  let e = { version: 1, ...event }; // event không có version → coi là v1
  while (upcasters[e.version]) e = upcasters[e.version](e);
  return e; // domain code chỉ thấy v3
}

// Pub/Sub consumer: dịch trước, xử lý sau
async function onPointsEarned(message) {
  const event = upcast(JSON.parse(message.data.toString()));
  await updateMemberSummary(event); // chỉ cần biết shape v3
  message.ack();
}
```
- Trade-off: domain code sạch (1 shape duy nhất), nhưng chuỗi upcaster dài dần theo năm tháng — cần unit test riêng cho từng bước, và test "v1 đi xuyên cả chuỗi ra đúng v3".

### Weak schema & content negotiation — người đọc khoan dung

🏪 **Ví dụ đời sống.** Bạn nhận thiệp cưới đời mới có in mã QR dẫn tới website đám cưới. Ông bà không biết QR là gì — nhưng chẳng sao, giờ giấc địa điểm vẫn in rõ trên thiệp, ông bà **bỏ qua phần không hiểu** và vẫn đi ăn cưới đúng giờ. Thiệp thêm thông tin mới mà không làm khách cũ "vỡ". Còn content negotiation thì như nhà hàng hỏi trước: "anh chị nhận hoá đơn giấy hay email?" — hai bên thoả thuận format trước khi đưa nội dung.

**Map sang kỹ thuật:**
- **Weak schema / tolerant reader**: thay vì schema cứng (reject khi thấy field lạ/thiếu), consumer khoan dung theo quy ước: *ignore field không biết, có default cho field thiếu*. Đổi lại, validate chuyển từ "schema enforce" sang "kỷ luật + test". Đây là bạn đồng hành tự nhiên của chiến lược additive change.
- Hợp với JS thuần: vốn không có type cứng, chỉ cần kỷ luật destructure với default:

```js
// Tolerant reader: không throw vì field lạ, không vỡ vì field thiếu
function handlePointsEarned(payload) {
  const {
    memberId,
    points = 0,
    source = 'unknown',        // v1 không có → default
    shopDomain = 'legacy',     // v2 không có → default
    // field lạ trong payload? Kệ — không đụng tới là không vỡ.
  } = payload;
  if (!memberId) throw new Error('invalid event: missing memberId'); // chỉ chặn cái thật sự bắt buộc
  return creditPoints(shopDomain, memberId, points, source);
}
```
- **Content negotiation**: mượn ý từ HTTP — consumer khai báo version/format nó hiểu, producer (hoặc lớp trung gian) trả đúng format đó. Trong messaging thể hiện bằng **metadata kèm message**: với Pub/Sub là message attributes — consumer đọc attribute để route và chọn cách parse **trước khi** mở payload, và filter subscription theo attribute được mà không cần parse JSON:

```js
// Producer: version nằm ở attributes, không cần mở payload mới biết
await pubsub.topic('loyalty.events').publishMessage({
  json: { memberId, points: 150, source: 'order', shopDomain },
  attributes: { eventType: 'points.earned', schemaVersion: '3' },
});

// Consumer: route theo attribute trước, parse sau
function onMessage(message) {
  const { eventType, schemaVersion = '1' } = message.attributes;
  if (eventType !== 'points.earned') return message.ack(); // không phải việc của mình
  const event = upcast({ version: Number(schemaVersion), ...JSON.parse(message.data) });
  // ... xử lý với shape mới nhất
}
```
- Chọn gì? Hệ nhỏ/ít team: weak schema + additive change là đủ. Hệ lớn/nhiều consumer ngoài tầm kiểm soát (public API, partner): versioning tường minh + upcasting.

## Sai lầm thường gặp
1. **Sửa/xoá event đã ghi để "fix data"** — như lấy bút xoá sửa sổ kế toán: mất audit trail, ledger không còn đáng tin. Sai thì ghi event/transaction điều chỉnh mới, bản gốc giữ nguyên.
2. **Đổi nghĩa field cũ thay vì thêm field mới** — đổi `points` từ "điểm cộng lần này" thành "tổng điểm sau giao dịch" mà tên giữ nguyên: hoá đơn nhìn y hệt mẫu cũ nhưng con số mang nghĩa khác — kiểu lừa người đọc này còn tệ hơn breaking change tường minh, vì không ai phát hiện cho đến khi số liệu lệch.
3. **Consumer schema cứng, vỡ vì field lạ** — validate kiểu "payload có field không khai báo → reject": producer chỉ cần *thêm* một field vô hại là toàn bộ consumer sập. Tolerant reader là mặc định, strict validate chỉ dành cho field thật sự bắt buộc.
4. **Nhét cả object to vào event cho "tiện"** — bê nguyên member object + order object vào mỗi event: payload phình to (fallacy "bandwidth is infinite" — ch10), và mỗi lần member schema đổi là event schema đổi theo, coupling ngầm. Event nên mang ID + đúng dữ liệu mà consumer cần tại thời điểm đó.
5. **Dùng full event sourcing vì "nghe hay"** — dựng event store + replay + snapshot cho mọi thứ trong khi CRUD + một ledger append-only là đủ. Event sourcing trả giá bằng độ phức tạp vĩnh viễn; chỉ đáng khi audit/replay là yêu cầu nghiệp vụ thật (với ledger điểm: đáng; với setting hiển thị widget: không).

## Thuật ngữ cần nhớ
| Thuật ngữ | Nghĩa là gì (1 câu) |
|---|---|
| CQRS | Tách model ghi (command) và model đọc (query) để mỗi bên tối ưu riêng — sổ thu chi vs bảng tổng kết. |
| Event sourcing | Lưu chuỗi event bất biến làm source of truth; state là kết quả replay event — sổ kế toán không tẩy xoá. |
| Immutable event | Event đã ghi/đã publish thì không sửa không xoá; sai thì ghi event điều chỉnh mới. |
| Projection / read model | View denormalize được build từ event, tối ưu cho việc đọc (`member_summary`). |
| Event versioning | Quản lý nhiều phiên bản schema của cùng một loại event cùng tồn tại — mẫu hoá đơn cũ và mới cùng hợp lệ. |
| Additive change | Tiến hoá schema chỉ bằng cách thêm field optional, không xoá/đổi nghĩa field cũ. |
| Upcasting | Transform event version cũ thành version mới nhất tại thời điểm đọc; store giữ nguyên bản gốc — người phiên dịch ở cửa kho. |
| Weak schema / tolerant reader | Consumer khoan dung: ignore field lạ, default cho field thiếu, không vỡ vì additive change. |
| Content negotiation | Consumer và producer thoả thuận format/version của payload qua metadata (Pub/Sub message attributes). |
| Snapshot | State chụp tại một thời điểm để replay không phải đi từ event đầu tiên (tối ưu của event sourcing). |

## Áp dụng cho mình (Joy Loyalty)
- Ledger `point_transactions` append-only sẵn là **event sourcing nhẹ** cho điểm — giữ nguyên hướng này: tuyệt đối không update/delete transaction cũ, điều chỉnh điểm thì ghi transaction bù (bút toán điều chỉnh). `member_summary` là read model — được phép rebuild từ ledger bất cứ lúc nào, nên hỏng cũng không sợ.
- Đặt quy tắc ngay từ giờ, viết vào doc/convention: mọi event publish lên Pub/Sub phải có **attributes `eventType` + `schemaVersion`**, payload chỉ được tiến hoá kiểu **additive** (thêm field optional, không xoá/đổi nghĩa). Quy tắc rẻ nhất, đỡ được 90% đau sau này.
- Mọi consumer viết theo **tolerant reader**: destructure với default value, chỉ validate field thật sự bắt buộc (`memberId`), không bao giờ throw vì field lạ.
- Khi nào buộc phải breaking change (hiếm): tăng `schemaVersion`, viết upcaster JS thuần như mẫu ở trên, chạy song song hai version cho đến khi chắc chắn không còn message/producer cũ.
- **Chưa cần** full event sourcing với event store + replay engine — CQRS nhẹ (transaction collection + summary document update qua Pub/Sub consumer) là đủ cho quy mô hiện tại. Chỉ cân nhắc nâng cấp nếu xuất hiện nhu cầu rebuild read model từ lịch sử hoặc yêu cầu audit sâu từ merchant lớn.
