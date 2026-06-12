# Chương 5 — Introducing Refactoring Principles

> ⚠️ Tóm tắt khái niệm theo mục lục sách + kiến thức DDD chuẩn — không phải bản dịch nguyên văn. Đọc sách gốc để lấy case study chi tiết. Ví dụ đời sống & Joy Loyalty là ví dụ của mình, không phải từ sách.

## TL;DR
Chương này trả lời câu hỏi: **trước khi đụng vào code [[Glossary - Thuật ngữ#Legacy system|legacy]], cần chuẩn bị gì để refactor an toàn?** Ý quan trọng nhất: refactoring không phải là "viết lại cho đẹp" mà là thay đổi cấu trúc code **mà không đổi hành vi**, và muốn làm được điều đó thì phải có lưới an toàn (test, CI/CD, observability) trước, rồi mới áp dụng các nguyên tắc thiết kế như SOLID. Thứ tự đúng: **hiểu → bảo vệ → mới sửa**. Làm ngược lại (sửa trước, test sau) là nguồn gốc của 90% tai nạn refactoring.

## Nội dung chính

### Refactoring là gì — và không phải là gì

🏪 **Ví dụ đời sống:** refactoring giống như **sửa lại căn nhà mình đang ở**. Cả nhà vẫn ăn ngủ sinh hoạt bình thường, mình sửa từng phòng một: tuần này đi lại dây điện phòng khách, tuần sau ốp lại bếp. Sau mỗi ngày thợ về, nhà vẫn ở được, nước vẫn chảy, đèn vẫn sáng. Còn "đập đi xây mới" là cả nhà phải dọn ra khách sạn 6 tháng — và khi dọn về mới phát hiện quên xây chỗ để máy giặt.

Trong code, cái này chính là:
- Định nghĩa chuẩn (theo Fowler): refactoring là **chuỗi các bước biến đổi nhỏ**, mỗi bước giữ nguyên hành vi quan sát được từ bên ngoài, cộng dồn lại thành thay đổi cấu trúc lớn. Từ khoá là **nhỏ** và **giữ hành vi** — sau mỗi bước hệ thống vẫn chạy được, test vẫn xanh, deploy được bất cứ lúc nào.
- Phân biệt với 2 thứ hay bị gọi nhầm là refactoring:
  - **Rewrite**: đập đi viết lại — rủi ro cao nhất vì trong nhiều tháng không ship được gì, và code cũ chứa hàng trăm edge case không ai nhớ (giống căn nhà cũ có cái gờ chống ngập mà chỉ trận mưa lớn mới biết nó để làm gì).
  - **Restructure kèm đổi hành vi**: vừa sửa cấu trúc vừa "tiện tay fix bug" — khi có sự cố không biết do cấu trúc hay do logic. Quy tắc: **một commit hoặc đổi cấu trúc, hoặc đổi hành vi — không bao giờ cả hai**.
- Vì sao nguyên tắc này quan trọng với người làm app production như Joy Loyalty: app đang có merchant trả tiền, điểm của member là tiền thật — không có chỗ cho "deploy bản viết lại rồi cầu nguyện".

### Understanding before acting — hiểu trước, sửa sau

🏪 **Ví dụ đời sống:** thuê thợ điện về sửa nhà, ông thợ giỏi không bao giờ cắt ngay sợi dây "trông thừa thừa" trên tường. Ông dò xem nó nối đi đâu trước — vì biết đâu nó cấp điện cho cái bơm nước trên mái. Sợi dây xấu xí đó tồn tại **có lý do**, chỉ là không ai còn nhớ lý do.

Trong code, cái này chính là:
- Sai lầm phổ biến nhất khi refactor là nhảy vào sửa ngay khi thấy "code xấu". Code xấu thường xấu **có lý do**: deadline cũ, một edge case của khách lớn, một workaround cho bug của API bên thứ ba. Xoá "đoạn if vô nghĩa" đi rồi mới biết nó chặn double-counting cho một merchant cụ thể.
- Phải hiểu hai thứ trước khi sửa:
  1. **Hành vi hiện tại** — kể cả bug đang được nghiệp vụ dựa vào (bug đã thành feature).
  2. **Lý do code thành ra như vậy** — đọc git blame/history, hỏi người viết, đọc ticket cũ.

🏪 Công cụ chính để "đóng băng" hiểu biết là **characterization test** — tưởng tượng trước khi dọn lại căn phòng bừa bộn của người khác, mình **chụp ảnh từng góc phòng**. Không phán xét đồ đạc để đúng hay sai chỗ, chỉ ghi lại y nguyên hiện trạng. Dọn xong so với ảnh: mọi thứ vẫn tìm thấy được như cũ là đạt.

- Quy trình viết: gọi hàm với input thật → xem output thật là gì → assert đúng output đó (**kể cả khi nó trông sai**). Refactor xong chạy lại, kết quả không đổi nghĩa là an toàn.
- Ví dụ Joy Loyalty — characterization test cho hàm tính điểm legacy trước khi dám refactor nó:

```js
// legacy: calculatePoints(order, settings) — 300 dòng if/else, không ai dám đụng
const { calculatePoints } = require('../legacy/pointCalculator');

describe('characterization: calculatePoints (hành vi HIỆN TẠI, chưa chắc đúng)', () => {
  const settings = { pointsPerDollar: 1, rounding: 'floor' };

  test('order thường', () => {
    const order = { subtotal: '49.99', discounts: [], refunds: [] };
    // 49 chứ không phải 50 — floor, ghi nhận đúng như đang chạy
    expect(calculatePoints(order, settings)).toBe(49);
  });

  test('order có discount code', () => {
    const order = { subtotal: '100.00', discounts: [{ amount: '20.00' }], refunds: [] };
    // hiện tại tính trên subtotal TRƯỚC discount — nghi là bug,
    // nhưng merchant đã quen, cứ ghi lại làm baseline
    expect(calculatePoints(order, settings)).toBe(100);
  });

  test('order refund toàn phần vẫn trả về 0 chứ không âm', () => {
    const order = { subtotal: '30.00', discounts: [], refunds: [{ amount: '30.00' }] };
    expect(calculatePoints(order, settings)).toBe(0);
  });
});
```

- Lấy input ở đâu: kéo payload webhook `orders/create` thật từ log production (ẩn PII) — input thật luôn quái hơn input mình tự nghĩ ra (subtotal là string, thiếu field, currency lạ...).
- Sau khi có bộ characterization test xanh → mới được refactor. Nếu trong lúc refactor phát hiện logic discount thật sự sai → **ghi ticket riêng**, sửa hành vi ở PR khác sau khi bàn với product, không trộn vào PR refactor.

### CI/CD và Observability — lưới an toàn tầng hệ thống

🏪 **Ví dụ đời sống:** nhà đang sửa thì phải có **chuông báo khói và đồng hồ nước**. Thợ làm sai ở đâu, chuông kêu ngay trong ngày — chứ không phải ba tháng sau nhận hoá đơn nước gấp 5 lần mới biết ống bị rò từ hôm đổi đường ống. CI là chuông báo kêu *trước khi* dọn vào ở; observability là đồng hồ nước cho biết nhà *đang vận hành* có gì lạ.

Trong code, cái này chính là:
- **CI (Continuous Integration)**: merge code thường xuyên + chạy test tự động mỗi lần push. Refactor mà không có CI thì mỗi thay đổi là một canh bạc. Không có CI thì characterization test viết xong cũng vô dụng vì không ai chạy nó.
- **CD (Continuous Delivery/Deployment)**: deploy được nhỏ, thường xuyên, rollback nhanh — điều kiện để refactor theo từng bước nhỏ thay vì "big bang" nhiều tháng rồi merge một cục. Trên Cloud Run, rollback = route traffic về revision cũ trong vài giây — tận dụng triệt để.
- **Observability** (logs, metrics, traces): test không bao giờ cover hết hành vi production — cần nhìn được hành vi thật. Khi deploy bản refactor, so sánh metrics trước/sau: error rate, latency, **và metrics nghiệp vụ** (số điểm cộng mỗi giờ, số reward redeem mỗi ngày). Test xanh nhưng "tổng điểm cộng/giờ giảm 40% sau deploy" là regression mà chỉ observability bắt được.
- Với stack của mình: Cloud Run + Cloud Logging/Monitoring có sẵn nền tảng — việc cần làm là **structured logging** (log JSON có field chuẩn) cho các nghiệp vụ quan trọng:

```js
// thay vì console.log('cộng điểm xong')
console.log(JSON.stringify({
  severity: 'INFO',
  event: 'points.earned',
  shopId, memberId, orderId,
  points: earned,
  calculator: 'v2', // tag version để diff hành vi v1 vs v2
}));
// → Cloud Logging tự parse, query được: event="points.earned" AND calculator="v2"
```

- Trick hữu ích khi refactor hàm rủi ro cao: **shadow run / parallel run** — chạy cả hàm cũ lẫn hàm mới, dùng kết quả hàm cũ, log diff nếu hai bên lệch. Giống thuê đầu bếp mới: cho nấu song song với bếp trưởng cũ một tuần, khách vẫn ăn món của bếp cũ, mình nếm so hai bên — giống hệt nhau rồi mới giao bếp.

### Testing pyramid — kim tự tháp test

🏪 **Ví dụ đời sống:** nấu một nồi phở. Khôn ngoan là **nếm từng thứ trong lúc nấu**: nước dùng mặn chưa, bánh phở mềm chưa (unit test — nhanh, rẻ, làm liên tục). Thỉnh thoảng múc một tô ráp thử các thành phần với nhau (integration test). Còn mời 10 người khách đến ăn và hỏi cảm nhận thì chỉ làm một lần trước khi mở quán (E2E — đắt, chậm, không thể làm mỗi 5 phút). Quán nào chỉ biết "chờ khách ăn rồi nghe chê" là quán sắp đóng cửa.

Trong code, cái này chính là:
- **Unit test** (đáy, nhiều nhất): test một hàm/module cô lập, chạy trong mili giây, không cần network/DB. Tầng quan trọng nhất cho refactoring vì cho feedback trong vài giây — refactor là hàng trăm bước nhỏ, mỗi bước cần biết ngay mình có phá gì không.
- **Integration test** (giữa): test các thành phần nói chuyện với nhau — code + **Firestore emulator**, code + Shopify API mock (nock/msw). Chậm hơn nhưng bắt được lỗi unit test mù: query sai index, security rules, serialize Timestamp.
- **E2E test** (đỉnh, ít nhất): test toàn luồng như user thật. Đắt, chậm, dễ flaky — chỉ giữ vài luồng vàng (order webhook → nhận điểm → đổi reward → discount code xuất hiện).
- Codebase legacy thường có hình **kim tự tháp ngược**: toàn test tay/E2E, không có unit test — vì code không tách được dependency nên *không thể* viết unit test. Đây chính là cầu nối sang SOLID: muốn test được thì phải tách được, muốn tách được thì cần SRP + DIP.
- Khi nào KHÔNG cần đủ 3 tầng: script một lần, prototype, admin tool nội bộ ít rủi ro — đầu tư test theo mức độ "tiền tươi" của luồng. Với Joy Loyalty, luồng earn/redeem điểm đáng đầu tư gấp 10 lần luồng đổi màu widget.

### SOLID principles (trọng tâm: SRP, OCP, DIP)

🏪 **SRP — ví dụ đời sống:** cái tủ quần áo mà nhét chung quần áo + giấy tờ nhà đất + đồ nghề sửa xe thì mỗi lần lấy hợp đồng phải bới đống áo, và lúc vợ dọn áo rất dễ làm thất lạc sổ đỏ. Mỗi ngăn tủ nên có **một "chủ" duy nhất quyết định khi nào nó thay đổi**.

- **Single Responsibility Principle (SRP)**: một module chỉ nên có **một lý do để thay đổi** (một "actor" nghiệp vụ yêu cầu đổi). Không phải "một hàm chỉ làm một việc" theo nghĩa máy móc, mà là: *ai* yêu cầu đổi cái này?
  - Dấu hiệu vi phạm trong layered app: một `orderService.js` vừa tính điểm (product yêu cầu đổi rule), vừa gửi email (marketing đổi template), vừa parse Shopify webhook (Shopify đổi API version) — ba nguồn thay đổi nhét chung một file, sửa cho ông này dễ vỡ của ông kia.
  - Sau khi tách: `pointCalculator.js` (chỉ đổi khi rule điểm đổi), `orderWebhookHandler.js` (chỉ đổi khi Shopify đổi), `notificationTrigger.js` (chỉ đổi khi marketing đổi).

🏪 **OCP — ví dụ đời sống:** muốn thêm cái quạt mới trong nhà, ta **cắm vào ổ điện** chứ không đục tường đi lại dây. Hệ thống điện được thiết kế "đóng" (không ai đụng vào dây trong tường) nhưng "mở" (cắm thêm thiết bị thoải mái).

- **Open/Closed Principle (OCP)**: mở cho mở rộng, đóng cho sửa đổi — thêm hành vi mới bằng cách **thêm code mới**, không sửa code cũ đang chạy. Mỗi lần thêm loại campaign mà phải sửa `if/else` trong hàm tính điểm trung tâm = mỗi lần thêm feature là một lần risk regress toàn bộ campaign cũ.

🏪 **DIP — ví dụ đời sống:** cái đèn bàn không hàn chết vào dây điện âm tường — nó có **phích cắm theo chuẩn ổ cắm**. Nhờ chuẩn chung đó, đèn nào cắm ổ nào cũng được, đổi nhà mang đèn theo vẫn dùng. Phích cắm chính là "abstraction": đèn (nghiệp vụ) và lưới điện (hạ tầng) đều tuân theo nó, không phụ thuộc trực tiếp nhau.

- **Dependency Inversion Principle (DIP)**: tầng nghiệp vụ (high-level) không phụ thuộc trực tiếp vào chi tiết hạ tầng (low-level: Firestore, Shopify API) — cả hai phụ thuộc vào **abstraction**. JS thuần không có interface, nhưng DIP vẫn áp dụng được bằng **inject dependency qua factory function**:

```js
// ❌ Trước: service buộc chặt vào Firestore, muốn unit test phải bật emulator
const { db } = require('../db/firestore');
async function earnPoints(memberId, points) {
  const ref = db.collection('members').doc(memberId);
  await ref.update({ balance: FieldValue.increment(points) });
}

// ✅ Sau: nghiệp vụ nhận repo từ ngoài — "abstraction" là hợp đồng ngầm
// { getMember, addTransaction } mà repo nào cũng phải có
function createPointService({ memberRepo }) {
  return {
    async earnPoints(memberId, points) {
      const member = await memberRepo.getMember(memberId);
      if (!member) throw new Error('MEMBER_NOT_FOUND');
      await memberRepo.addTransaction(memberId, { type: 'earn', points });
    },
  };
}

// test: fake repo bằng object thường, chạy mili giây, không emulator
const fakeRepo = { getMember: async () => ({ id: 'm1' }), addTransaction: jest.fn() };
const service = createPointService({ memberRepo: fakeRepo });
```

- Lợi ích kép của DIP: (1) unit test được ngay, (2) đổi hạ tầng (Firestore → chỗ khác, REST Admin API → GraphQL) chỉ sửa một adapter, nghiệp vụ không đụng.
- ISP và LSP cũng thuộc SOLID nhưng tác động đến khả năng refactor ít trực tiếp hơn — SRP/OCP/DIP là bộ ba quyết định code có "tách được để test được" hay không.

### Strategy pattern — OCP bằng xương bằng thịt

🏪 **Ví dụ đời sống:** quán cà phê có công thức pha chế in trên từng **thẻ công thức** rời. Muốn thêm món mới, in thêm một thẻ bỏ vào hộp — không phải lấy bút sửa chằng chịt lên cuốn sổ công thức chung mà cả quán đang dùng. Barista chỉ cần biết: khách gọi món gì → rút đúng thẻ → pha theo thẻ.

Trong code, cái này chính là pattern hiện thực hoá OCP: đóng gói các **biến thể thuật toán** thành các đơn vị hoán đổi được, thay cho chuỗi `if/else`/`switch` lớn.

```js
// ❌ Trước: thêm campaign mới = sửa hàm trung tâm, regress mọi campaign cũ
function calculatePoints(order, campaign) {
  if (campaign.type === 'standard') return Math.floor(order.subtotal);
  else if (campaign.type === 'double') return Math.floor(order.subtotal) * 2;
  else if (campaign.type === 'bonusFixed')
    return Math.floor(order.subtotal) + campaign.config.bonus;
  // ... 8 nhánh nữa, mỗi nhánh một lịch sử đau thương
}

// ✅ Sau: mỗi strategy một hàm thuần — một "thẻ công thức", test riêng được
const pointStrategies = {
  standard:   (order) => Math.floor(order.subtotal),
  double:     (order) => Math.floor(order.subtotal) * 2,
  bonusFixed: (order, config) => Math.floor(order.subtotal) + config.bonus,
  // thêm campaign mới = thêm 1 dòng + 1 file test, KHÔNG đụng code cũ
  multiplierByTier: (order, config, ctx) =>
    Math.floor(order.subtotal * (config.multipliers[ctx.memberTier] || 1)),
};

function calculatePoints(order, campaign, ctx) {
  const strategy = pointStrategies[campaign.type] || pointStrategies.standard;
  return strategy(order, campaign.config, ctx);
}
```

- Khi nào KHÔNG nên dùng: chỉ có 2 nhánh ổn định và không có dấu hiệu mọc thêm — strategy lúc đó là over-engineering, `if` thường đọc dễ hơn. Áp pattern khi đã thấy nhánh thứ 3-4 xuất hiện và biết chắc sẽ còn thêm.

## Sai lầm thường gặp
1. **Refactor không có test trước** — như dọn phòng người khác mà không chụp ảnh hiện trạng: "code này đơn giản mà" → đổi hành vi mà không biết, phát hiện khi merchant complain điểm lệch. Luôn characterization test trước, kể cả xấu hổ vì assert một giá trị trông sai.
2. **Trộn refactor + fix bug + feature trong một PR** — như vừa sơn tường vừa đổi đường ống trong một buổi: tường ố không biết do sơn dở hay ống rò. Khi có sự cố không bisect được nguyên nhân, reviewer cũng không review nổi. Một PR một mục đích.
3. **Big bang rewrite đội lốt refactor** — branch `refactor/new-architecture` sống 2 tháng, conflict khắp nơi, cuối cùng bỏ. Refactor đúng nghĩa là mỗi PR vài giờ, merge liên tục, main luôn deploy được.
4. **Xoá code "thừa" mà không khảo cổ** — cắt sợi dây điện "vô dụng" rồi bơm nước trên mái ngừng chạy. Git blame + log production trước khi xoá.
5. **Viết test bám vào implementation thay vì hành vi** — mock từng hàm private, assert thứ tự gọi nội bộ → vừa refactor là test đỏ dù hành vi không đổi, test thành lực cản thay vì lưới an toàn. Test qua public API của module, assert output/side effect.

## Thuật ngữ cần nhớ
| Thuật ngữ | Nghĩa là gì (1 câu) |
|---|---|
| Refactoring | Thay đổi cấu trúc bên trong của code bằng các bước nhỏ mà không đổi hành vi bên ngoài. |
| Rewrite | Đập đi viết lại từ đầu — rủi ro cao vì mất hết edge case tích luỹ trong code cũ. |
| Characterization test | Test ghi lại hành vi hiện tại của code legacy (kể cả bug) làm baseline trước khi sửa. |
| Shadow run / parallel run | Chạy song song code cũ và mới trên production, dùng kết quả cũ, log diff để xác minh code mới. |
| [[Glossary - Thuật ngữ#Testing pyramid\|Testing pyramid]] | Mô hình phân bổ test: nhiều unit, vừa integration, ít E2E. |
| Kim tự tháp ngược | Anti-pattern: toàn E2E/test tay, không unit test — dấu hiệu code không tách được dependency. |
| CI | Merge thường xuyên + test tự động mỗi lần push. |
| CD | Deploy nhỏ, thường xuyên, rollback nhanh — điều kiện để refactor từng bước. |
| Observability | Nhìn thấy hành vi hệ thống qua logs/metrics/traces — lưới an toàn ngoài test. |
| Structured logging | Log dạng JSON có field chuẩn để query/so sánh được trên Cloud Logging. |
| SRP | Một module chỉ có một lý do (một actor nghiệp vụ) để thay đổi. |
| OCP | Thêm tính năng bằng code mới thay vì sửa code cũ đang chạy. |
| DIP | Nghiệp vụ phụ thuộc abstraction; hạ tầng (Firestore, Shopify API) được inject từ ngoài. |
| Factory function | Hàm tạo object service nhận dependency qua tham số — cách làm DIP trong JS thuần. |
| Strategy pattern | Đóng gói biến thể thuật toán thành đơn vị hoán đổi được, thay cho if/else dài. |
| Boy scout rule | Mỗi lần chạm code, để nó sạch hơn một chút so với lúc đến. |

## Áp dụng cho mình (Joy Loyalty)
- Trước khi migrate sang DDD, viết characterization test cho 2 luồng tiền tươi nhất: tính điểm từ webhook `orders/create` và trừ điểm khi redeem — lấy payload thật từ log làm fixture. Đây là lưới an toàn cho mọi bước refactor sau.
- Audit các service hiện tại: chỗ nào đang `require` Firestore trực tiếp trong logic nghiệp vụ → chuyển dần sang inject repo qua factory function (DIP kiểu JS thuần), mở đường cho unit test không cần emulator.
- Chuỗi `if (campaign.type === ...)` trong logic tính điểm/reward là ứng viên số một cho Strategy pattern — làm trước vì rủi ro thấp, lợi ích thấy ngay.
- Thêm structured logging (JSON, có field `event`, `calculator` version) cho mọi sự kiện cộng/trừ điểm trên Cloud Run ngay từ bây giờ — khi deploy bản refactor sẽ có số liệu so sánh trước/sau; cân nhắc shadow run cho hàm tính điểm v2.
- Quy ước team: PR refactor không chứa thay đổi hành vi; bug phát hiện trong lúc refactor → ticket riêng.
