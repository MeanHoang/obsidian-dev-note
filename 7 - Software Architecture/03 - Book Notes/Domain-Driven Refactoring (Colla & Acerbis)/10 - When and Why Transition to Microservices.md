# Chương 10 — When and Why You Should Transition to a Microservices Architecture

> ⚠️ Tóm tắt khái niệm theo mục lục sách + kiến thức DDD chuẩn — không phải bản dịch nguyên văn. Đọc sách gốc để lấy case study chi tiết. Ví dụ đời sống & Joy Loyalty là ví dụ của mình để minh hoạ khái niệm, không phải ví dụ trong sách.

## TL;DR
Chương này trả lời câu hỏi: **khi nào** việc tách monolith thành microservices là đáng làm, và **khi nào nó là cái bẫy**. Ý quan trọng nhất: microservices không phải đích đến mặc định — nó là một trade-off đổi độ phức tạp vận hành lấy khả năng scale team và deploy độc lập. Một [[Glossary - Thuật ngữ#Modular monolith|modular monolith]] với [[Glossary - Thuật ngữ#Bounded context|bounded context]] rõ ràng thường là điểm dừng hợp lý, và cũng là bước đệm gần như bắt buộc nếu sau này muốn tách. Với team 1-2 người như Joy Loyalty hiện tại, gần như mọi tín hiệu đều chỉ về modular monolith — note này chủ yếu để **biết mà đánh giá đúng thời điểm**, không phải để làm ngay.

## Nội dung chính

### Microservices là gì — chuyện ra ở riêng

🏪 **Ví dụ đời sống.** Ở chung nhà bố mẹ (monolith): cơm chung, điện nước chung, cần cái tua vít thì với tay lấy trong tủ đồ chung. Tiện, nhanh, nhưng cả nhà sinh hoạt theo một nhịp — em út ốm thì cả nhà mất ngủ, muốn sơn lại phòng phải hỏi ý cả nhà. Tách hộ ra ở riêng (microservices): tự do tuyệt đối, sơn nhà màu gì tuỳ mình, ngủ giờ nào tuỳ mình. Nhưng từ nay tự đóng tiền điện nước, tự sửa ống nước, và muốn mượn cái tua vít thì phải **chạy sang nhà bố mẹ** — không còn "với tay lấy" được nữa.

**Map sang kỹ thuật:**
- Microservices = kiến trúc chia hệ thống thành các service nhỏ, **deploy độc lập**, mỗi service **sở hữu dữ liệu riêng** (không service nào đọc thẳng database của service khác — như không tự ý mở tủ nhà người khác) và giao tiếp qua network (HTTP/gRPC hoặc message như Pub/Sub — tức là "chạy sang nhà nhau", chậm hơn với tay nhiều).
- Vấn đề nó giải quyết: khi hệ thống và team lớn lên, một codebase + một deploy unit thành nút thắt — 30 dev cùng merge vào 1 repo, mỗi release phải đồng bộ tất cả, một module memory leak kéo sập cả app (em út ốm, cả nhà mất ngủ). Microservices cắt hệ thống để **mỗi team own trọn vòng đời một phần**: code, data, deploy, on-call — như mỗi hộ tự lo nhà mình.
- Điểm ăn khớp với DDD: ranh giới lý tưởng của một microservice chính là một **bounded context** — vì bounded context đã là ranh giới ngữ nghĩa, bên trong nói chung một ngôn ngữ, ra ngoài giao tiếp qua contract. Cắt theo đó thì các "hộ" ít phải chạy sang nhà nhau nhất.
- Ánh xạ sang Joy Loyalty: `points` (ledger điểm), `rewards` (đổi thưởng, tạo discount code Shopify), `tiers`, `members`, `campaigns` — mỗi cái là một bounded context **ứng viên**. Ứng viên thôi: là ranh giới module trước, có "ra ở riêng" hay không là quyết định khác, đến sau.
- Lợi ích thật (khi đủ điều kiện): scale riêng phần nóng — merchant chạy flash sale thì chỉ webhook `orders/create` + tính điểm bị dội; nếu `points` là service riêng trên Cloud Run thì chỉ nó autoscale lên 50 instance, admin dashboard vẫn 1 instance. Fault isolation — `campaigns` bug không sập `points`. Release theo nhịp riêng, chọn công nghệ từng phần.

### Monolith versus microservices — so sánh thẳng

So sánh bằng một thao tác cụ thể của Joy Loyalty — *"khi member đặt hàng, cộng điểm và check tier"*:

| Khía cạnh | Monolith (ở chung nhà) | Microservices (ra ở riêng) |
|---|---|---|
| Gọi `points.earn()` từ webhook handler | Function call, ~nanosecond, không bao giờ "mất gói tin" | HTTP/Pub/Sub call, ~10-100ms, có thể timeout/fail/đến trùng |
| Cộng điểm + update tier atomic | 1 Firestore transaction, hoặc ít nhất cùng process | Không có transaction xuyên service → [[Glossary - Thuật ngữ#Eventual consistency\|eventual consistency]] + [[Glossary - Thuật ngữ#Saga & Process manager\|saga]] (ch12) |
| Deploy fix nhỏ ở `campaigns` | Deploy cả app (vài phút, risk thấp nếu CI tốt) | Deploy đúng service `campaigns`, service khác không động |
| Debug "member này thiếu điểm" | Đọc log 1 service, stack trace liền mạch | Distributed tracing xuyên 3-4 service, cần correlation ID |
| Hạ tầng | 1 Cloud Run service, 1 pipeline | N services, N pipelines, N bộ monitoring/alert, service-to-service auth |
| Phù hợp team | 1-5 người | Nhiều team, mỗi team own vài service |

- Monolith xấu không phải vì nó là monolith, mà vì nó là **[[Glossary - Thuật ngữ#Big ball of mud|big ball of mud]]** — module nào cũng thò tay vào ruột module khác, như nhà đông người mà đồ ai cũng vứt lẫn vào phòng nhau. Cái cần sửa là *coupling*, không phải *deploy unit*.
- **Modular monolith** là trung gian được sách (và cộng đồng DDD) đề cao: vẫn ở chung một nhà, nhưng **mỗi người một phòng có cửa khoá** — vẫn 1 deploy unit, bên trong chia module theo bounded context, mỗi module có public interface rõ ràng, giao tiếp qua interface hoặc event nội bộ, cấm import chéo ruột nhau. Được 80% lợi ích kiến trúc với 20% chi phí vận hành. Đây chính là hướng Joy Loyalty nên đi trước.

Trước/sau trong code Joy Loyalty — cùng một webhook handler:

```js
// ❌ TRƯỚC — big ball of mud: handler thò tay vào ruột mọi module
export async function onOrderCreated(order) {
  const member = await db.collection('members').doc(order.customerId).get();
  const rate = await db.collection('campaigns')
    .where('type', '==', 'earn_rate').get(); // đọc thẳng data của campaigns
  const points = order.total * rate.docs[0].data().multiplier;
  await db.collection('members').doc(order.customerId)
    .update({ points: member.data().points + points }); // sửa thẳng data của members
}

// ✅ SAU — modular monolith: handler chỉ gõ cửa, không tự mở tủ
import { calculateEarnRate } from '../campaigns/index.js';
import { earnPoints } from '../points/index.js';

export async function onOrderCreated(order) {
  const rate = await calculateEarnRate(order);     // campaigns own logic của nó
  await earnPoints(order.customerId, order.total * rate, {
    source: 'order', orderId: order.id,            // points own ledger của nó
  });
}
```
Phiên bản "sau" tách ra thành microservices được (đổi import thành HTTP/Pub/Sub call); phiên bản "trước" thì tách kiểu gì cũng ra distributed monolith.

### Rationale and challenges — lý do đúng, lý do sai

🏪 **Ví dụ đời sống.** Lý do *đúng* để ra ở riêng: nhà chật quá, 10 người tranh nhau 1 bếp, giờ giấc xung đột nhau thật sự. Lý do *sai*: "thằng bạn ra riêng rồi, mình cũng phải ra cho oách" — trong khi lương chưa đủ trả tiền nhà.

**Map sang kỹ thuật — lý do *đúng* để tách:**
- Team đông đến mức giẫm chân nhau: merge conflict liên tục, release train phải xếp hàng.
- Một phần hệ thống cần scale/SLA khác hẳn: widget hiển thị điểm trên storefront chịu traffic gấp 1000 lần admin dashboard, cần latency thấp và uptime cao hơn hẳn.
- Cần release theo nhịp khác nhau, hoặc một phần có yêu cầu compliance/công nghệ riêng.

**Lý do *sai*:** "cho hiện đại", "Netflix làm vậy" (Netflix có hàng nghìn engineer — bài toán của họ không phải bài toán của mình), CV-driven development, hy vọng microservices tự sửa code rối. Tách một monolith rối sẽ cho ra **distributed monolith** — xem mục Sai lầm thường gặp.

**Thách thức phải trả khi tách** (phần người ta hay quên tính, như quên tính tiền điện nước khi mơ ra riêng):
- **Observability**: cần distributed tracing (Cloud Trace + correlation ID qua mọi message) — không có thì câu hỏi "redemption #123 kẹt ở đâu" là không trả lời được.
- **Data consistency**: mất ACID xuyên service, phải thiết kế saga/compensation (ch12).
- **Versioning**: API và event giữa các service thành contract công khai, đổi schema phải tương thích ngược (ch11).
- **Chi phí hạ tầng + nhân lực vận hành**: N pipeline, N dashboard, secret management, service auth.

### Fallacies of distributed computing — tam sao thất bản

🏪 **Ví dụ đời sống.** Ngồi cạnh nhau thì nói chuyện trực tiếp: nói là nghe, hỏi là đáp. Giờ ở xa, phải **nhờ người chuyển lời**: lời nhắn có thể thất lạc, đến chậm, hoặc tam sao thất bản — "bảo nó mai qua ăn cơm" thành "mai nó qua đòi nợ". Người mới nhờ chuyển lời lần đầu hay *quên mất* rằng chuyển lời không chắc chắn như nói trực tiếp. 8 fallacies chính là 8 kiểu "quên" đó.

**Map sang kỹ thuật** — 8 ngộ nhận kinh điển (Peter Deutsch và đồng nghiệp tại Sun Microsystems), những điều dev *vô thức assume* khi code in-process và sẽ trả giá khi chuyển sang network:
1. **The network is reliable** — lời nhắn có thể thất lạc; mọi call cần timeout + retry + kế hoạch khi retry hết.
2. **Latency is zero** — nói trực tiếp ~tức thì, nhờ chuyển lời mất cả buổi. Gọi 20 lần trong vòng lặp: in-process không ai để ý, qua network là +2 giây.
3. **Bandwidth is infinite** — payload to (nhét cả member object vào mỗi event) có chi phí thật.
4. **The network is secure** — lời nhắn đi qua người lạ; service gọi nhau phải auth (Cloud Run service-to-service cần OIDC token, không còn "cùng nhà nên tin nhau").
5. **Topology doesn't change** — người đưa tin nay người này mai người khác; instance sinh ra chết đi liên tục (Cloud Run autoscale), đừng hardcode địa chỉ hay assume sticky.
6. **There is one administrator** — nhiều team, nhiều config, không ai nắm toàn bộ.
7. **Transport cost is zero** — serialize/deserialize JSON, egress traffic đều tốn CPU và tiền.
8. **The network is homogeneous** — các node khác phần cứng, khác version, khác tốc độ.

Minh hoạ bằng Joy Loyalty — giả sử tách `points` thành service riêng, đoạn code "ngây thơ" này dính fallacy #1 và #2 ngay:

```js
// ❌ Code như thể network là function call
async function onOrderCreated(order) {
  // Nếu points-service đang cold start / timeout thì sao?
  // Webhook Shopify chỉ chờ 5s là đánh fail và retry → cộng điểm 2 lần?
  const res = await fetch('https://points-service.run.app/earn', {
    method: 'POST',
    body: JSON.stringify({ memberId: order.customerId, points: 100 }),
  });
}

// ✅ Chấp nhận network sẽ fail: ack webhook ngay, đẩy việc qua Pub/Sub
async function onOrderCreated(order, res) {
  await pubsub.topic('points.commands').publishMessage({
    json: { type: 'EarnPoints', memberId: order.customerId,
            points: 100, idempotencyKey: `order-${order.id}` },
  });
  res.status(200).end(); // Shopify hài lòng, việc nặng xử lý sau
}
// Consumer phía points: check idempotencyKey trước khi cộng,
// vì Pub/Sub là at-least-once — message CÓ THỂ đến 2 lần.
```
Bài học: dùng Pub/Sub nghĩa là đã *thừa nhận* fallacy #1, #2 — message có thể trễ, có thể trùng, nên consumer **bắt buộc idempotent**. Cái này đúng ngay từ bây giờ, kể cả khi còn là monolith.

### Readiness assessment signals — đủ điều kiện ra riêng chưa?

🏪 **Ví dụ đời sống.** Trước khi ra ở riêng, người tỉnh táo tự hỏi: lương đủ trả tiền nhà chưa? Biết nấu ăn, biết sửa bóng đèn chưa? Có *lý do thật* để ra riêng không, hay chỉ vì sĩ diện? Checklist readiness của microservices y hệt vậy.

Áp thẳng vào Joy Loyalty hiện tại:

| Tín hiệu | Joy Loyalty 2026 | Đánh giá |
|---|---|---|
| Bounded context rõ trong code, modular monolith chạy ổn ≥ vài tháng | Đang trên đường tới | ❌ chưa — điều kiện gần như tiên quyết |
| Ranh giới domain đã ổn định, schema ít đổi | Earn rule, tier logic còn đổi theo feedback merchant | ❌ — tách lúc schema còn xoay là refactor xuyên service, đắt gấp nhiều lần |
| CI/CD, monitoring, structured logging, alerting tốt | Có CI/CD cơ bản trên Cloud Run | ⚠️ một phần |
| Team đủ người để own nhiều service + on-call | 1 dev | ❌ — 1 người own 5 service nghĩa là 1 người làm việc của 5 team, chỉ nhận phần chi phí |
| Có nhu cầu scale/SLA khác biệt thật sự, đo được | Storefront widget có thể đến lúc cần, nhưng chưa đo thấy đau | ❌/⚠️ |

- Team 1 người tách service **được gì**: ranh giới bị ép cứng (không thể "tiện tay" import chéo), scale độc lập phần nóng. **Mất gì**: mọi chi phí của distributed system (tracing, versioning, saga, N pipeline) đổ lên đúng 1 cái đầu, tốc độ ship feature giảm hẳn. Với loyalty app, tốc độ ship feature là vũ khí cạnh tranh — kết luận tự rút ra được.
- Tín hiệu *nên cân nhắc lại* trong tương lai: thuê thêm dev và bắt đầu giẫm chân nhau; hoặc một module (vd widget API) cần scale đo được mà scale cả monolith quá tốn.

### Transition strategies — chuyển nhà từng món, đừng dọn một ngày

🏪 **Ví dụ đời sống.** Chuyển nhà khôn ngoan không ai bê hết đồ trong một ngày rồi cầu trời mọi thứ ổn. Người ta chuyển dần: hôm nay mang quần áo sang, ở thử vài hôm; tuần sau mang bếp; thấy nhà mới dột thì đồ vẫn còn bên nhà cũ, quay về được. [[Glossary - Thuật ngữ#Strangler fig pattern|Strangler Fig]] đúng là chiến lược đó.

**Map sang kỹ thuật:**
- **Strangler Fig pattern** (đặt theo cây đa "bóp nghẹt" cây chủ): không big-bang rewrite. Dựng service mới cho **một** capability, đặt router/facade phía trước route traffic của capability đó sang service mới, phần còn lại vẫn vào monolith. Lặp lại cho đến khi monolith teo dần. Mỗi bước nhỏ, có đường lùi (route ngược lại nếu service mới lỗi).
- Thứ tự tách: bắt đầu từ context **ít coupling, rủi ro thấp, dễ đo thành công** để học cách vận hành distributed — với Joy Loyalty đó là notification (gửi email reward — fail thì gửi lại, không mất tiền merchant) hoặc analytics export. Phần lõi nắm tiền bạc như **points ledger tách sau cùng**, khi đã thạo. (Như chuyển nhà: mang chăn gối đi trước, két sắt đi sau cùng.)
- Điều kiện kỹ thuật phải xong **trước** khi tách: cắt đứt chia sẻ database. Mỗi context own collection riêng, context khác muốn data thì gọi API/nghe event, cấm query chéo. Việc này làm được **ngay trong monolith** với Firestore: quy ước prefix collection theo module (`points_transactions`, `rewards_redemptions`...), mỗi module chỉ được chạm collection của mình — lint rule hoặc code review enforce. Làm xong bước này thì "tách service" sau này chủ yếu là đổi transport, không phải đại phẫu data.

## Sai lầm thường gặp
1. **Distributed monolith** — *ra ở riêng nhưng ngày nào cũng phải về nhà bố mẹ ăn cơm, lấy quần áo, xin tiền*: tách service nhưng giữ shared database hoặc gọi nhau đồng bộ dây chuyền (A chờ B chờ C) — coupling cũ + chi phí network mới, worst of both worlds. Dấu hiệu nhận biết: "deploy service X nhớ deploy Y trước".
2. **Tách service theo layer thay vì theo bounded context** — như chia nhà theo "phòng chứa toàn bát đĩa của cả xóm, phòng chứa toàn nồi của cả xóm": `api-service`, `business-logic-service`, `data-service` — mọi request xuyên cả 3, mọi feature sửa cả 3. Phải cắt **dọc** theo capability (points, rewards), không cắt **ngang** theo tầng kỹ thuật.
3. **Tách quá sớm, khi ranh giới domain chưa ổn định** — như xây tường gạch ngăn phòng khi còn chưa biết nhà mấy người ở: ranh giới sai trong monolith sửa bằng refactor 1 buổi; ranh giới sai giữa 2 service là migration data + version API + phối hợp deploy.
4. **Quên tính chi phí vận hành**: chỉ so sánh kiến trúc trên giấy, không tính tracing/alerting/on-call/secret rotation × N service. Với team nhỏ, chi phí này là phần lớn của hoá đơn — như mơ ra riêng mà chỉ tính tiền thuê nhà, quên điện nước mạng rác gửi xe.
5. **Tách để sửa code rối**: microservices không dọn được mud, nó chỉ phân phối mud qua network. Nhà bừa thì chuyển sang nhà mới vẫn bừa — phải dọn (refactor module hoá) trước, chuyển (tách) sau. Đây là luận điểm xuyên suốt cả cuốn sách: refactor toward deeper insight rồi mới đổi kiến trúc.

## Thuật ngữ cần nhớ
| Thuật ngữ | Nghĩa là gì (1 câu) |
|---|---|
| Microservices | Kiến trúc gồm các service nhỏ deploy độc lập, own data riêng, giao tiếp qua network. |
| Monolith | Toàn bộ hệ thống là 1 deploy unit, gọi nhau in-process. |
| Modular monolith | Monolith 1 deploy unit nhưng bên trong chia module theo bounded context, giao tiếp qua interface rõ ràng. |
| Big ball of mud | Codebase không có ranh giới — module nào cũng gọi thẳng vào ruột module khác. |
| Distributed monolith | Hệ "microservices" nhưng các service coupling chặt, phải deploy cùng nhau — worst of both worlds. |
| Bounded context | Ranh giới ngữ nghĩa của một model trong domain — ứng viên tự nhiên cho ranh giới service/module. |
| Strangler Fig | Chiến lược migrate dần: dựng phần mới song song, route traffic sang, thu hẹp monolith từng bước. |
| Fallacies of distributed computing | 8 giả định sai kinh điển về network (reliable, zero latency...) khiến hệ phân tán fail. |
| Fault isolation | Lỗi của một service không lan sang service khác. |
| Eventual consistency | Dữ liệu giữa các phần sẽ *cuối cùng* khớp nhau, không khớp tức thì — cái giá của việc bỏ transaction xuyên service. |
| At-least-once delivery | Cam kết của Pub/Sub: message chắc chắn đến, nhưng có thể đến nhiều lần. |
| Idempotent consumer | Consumer xử lý message trùng nhiều lần mà kết quả vẫn như xử lý 1 lần. |
| Idempotency key | Định danh duy nhất của một thao tác (vd `order-1234`) dùng để phát hiện và bỏ qua lần xử lý trùng. |
| Distributed tracing | Theo dấu một request xuyên nhiều service bằng correlation/trace ID. |
| Service-to-service auth | Xác thực giữa các service (Cloud Run: OIDC token) vì không còn "cùng process nên tin nhau". |

## Áp dụng cho mình (Joy Loyalty)
- **Đừng tách service vội** — checklist readiness ở trên đang đỏ gần hết, và đỏ nhất là "team 1 người". Mục tiêu 2026: modular monolith trên Cloud Run — chia code thành module `points`, `rewards`, `tiers`, `members`, `campaigns`, mỗi module own nhóm collection Firestore riêng (prefix theo module), public API qua `index.js` của module, cấm import chéo ruột. Ở chung nhà nhưng mỗi người một phòng có khoá.
- Giao tiếp giữa module bằng [[Glossary - Thuật ngữ#Domain event|domain event]] ngay từ bây giờ (in-process emitter hoặc Pub/Sub) — sau này nếu tách, chỉ đổi transport, không đổi model.
- Viết mọi Pub/Sub consumer hiện tại theo chuẩn **idempotent** (check idempotency key/event ID đã xử lý chưa, lưu trong Firestore) — trả nợ fallacy "network is reliable" từ sớm, vì at-least-once delivery là chuyện đang xảy ra rồi chứ không phải tương lai.
- Webhook Shopify: ack nhanh (200 ngay) + đẩy việc nặng qua Pub/Sub — vừa đúng pattern Shopify khuyến nghị, vừa là bài tập tư duy async đúng đắn.
- Nếu sau này có tín hiệu thật (thêm dev, hoặc widget API cần scale đo được), ứng viên tách đầu tiên là phần ngoại vi (notification, analytics export) theo Strangler Fig — **không bao giờ** bắt đầu từ points ledger. Chăn gối đi trước, két sắt đi sau cùng.
