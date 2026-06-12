# Chương 4 — Tactical Patterns

> ⚠️ Tóm tắt khái niệm theo mục lục sách + kiến thức DDD chuẩn — không phải bản dịch nguyên văn. Đọc sách gốc để lấy case study chi tiết. Mọi ví dụ đời sống & Joy Loyalty là ví dụ của mình để minh hoạ, không phải từ sách.

## TL;DR
Tactical patterns là bộ "viên gạch" để xây domain model *bên trong* một [[Glossary - Thuật ngữ#Bounded context|bounded context]]: [[Glossary - Thuật ngữ#Entity|entity]], [[Glossary - Thuật ngữ#Value object|value object]], [[Glossary - Thuật ngữ#Aggregate|aggregate]], [[Glossary - Thuật ngữ#Repository|repository]], factory, service, module, và domain/integration event. Ý quan trọng nhất: **aggregate là đơn vị bảo vệ tính nhất quán** — mọi thay đổi state đi qua aggregate root, và đó là chỗ business rule sống. Tin vui cho stack JS thuần: tất cả pattern này làm được bằng function + closure + `Object.freeze`, không cần class cầu kỳ hay TypeScript.

## Nội dung chính

### Entities và Value objects

🏪 **Ví dụ đời sống:** Anh Hùng — khách quen của quán — năm nay đổi số điện thoại, chuyển nhà, thậm chí... giảm 20kg. Nhưng với quán, anh vẫn là *anh Hùng đó*, vẫn cuốn sổ tích điểm đó. Danh tính của anh không nằm ở thuộc tính (số điện thoại, địa chỉ, cân nặng) mà ở việc anh *là ai* xuyên suốt thời gian. Ngược lại, tờ 50 nghìn trong ví anh: anh đưa quán tờ này hay tờ khác *hoàn toàn không quan trọng* — hai tờ 50k là một, thứ duy nhất có nghĩa là *giá trị*. Không ai "sửa" tờ 50k thành tờ 100k; muốn giá trị khác thì cầm tờ khác.

Trong code:

- **Entity**: object có *danh tính* (identity) xuyên suốt vòng đời — hai entity bằng nhau khi cùng ID, dù attribute khác hết. Vd: `Member` — đổi email, đổi tier vẫn là member đó. Entity được phép thay đổi state theo thời gian (anh Hùng được phép chuyển nhà).
- **Value object**: object định nghĩa bởi *giá trị*, không có ID, và nên **immutable** — muốn "đổi" thì tạo cái mới (cầm tờ tiền khác). Hai value object bằng nhau khi mọi giá trị bên trong bằng nhau. Vd: `PointsAmount` (số điểm), `TierName`, `DateRange` của campaign, `RedemptionRate`.
- Lợi ích lớn nhất của value object: **gom validation + behavior về một chỗ**. Thay vì rải `if (points < 0) throw...` khắp 7 service, `PointsAmount` tự đảm bảo không âm và tự biết cộng trừ:

```js
// domain/points-amount.js — value object bằng JS thuần
function createPointsAmount(value) {
  if (!Number.isInteger(value) || value < 0) {
    throw new Error('PointsAmount must be a non-negative integer');
  }
  return Object.freeze({
    value,
    add: (other) => createPointsAmount(value + other.value),
    subtract: (other) => createPointsAmount(value - other.value), // âm → constructor tự chặn
    isGreaterOrEqual: (other) => value >= other.value,
  });
}
```

Để ý: `subtract` không cần check âm — vì kết quả lại đi qua `createPointsAmount`, "luật không âm" chỉ tồn tại **một chỗ duy nhất**. Đó là cái đẹp của value object.

- Mẹo nhận diện khi refactor: các primitive đi cặp với nhau lẻ loi khắp nơi (amount + currency, points + expiryDate, start + end) là value object đang "ẩn mình" — bệnh **primitive obsession**. Như việc ghi "ngày 5, tháng 3, năm 2026" thành 3 cột rời trong sổ thay vì một khái niệm "ngày hẹn".

### Aggregates, Repositories, Factories

**Aggregate**

🏪 **Ví dụ đời sống:** Sổ tiết kiệm ngân hàng. Muốn rút tiền, bạn không tự cầm bút gạch số dư trong sổ — bạn đưa yêu cầu cho **giao dịch viên**, người duy nhất được phép ghi vào sổ. Giao dịch viên kiểm tra: đủ số dư không, đúng chủ sổ không — rồi mới ghi *cả hai dòng cùng lúc*: dòng giao dịch và số dư mới. Nhờ có một cửa duy nhất, cuốn sổ **không bao giờ** rơi vào trạng thái vô lý kiểu "có dòng rút 5 triệu nhưng số dư chưa trừ". Quy tắc "số dư không âm" không phải dán ở cửa ngân hàng cho khách tự giác — nó được *enforce tại quầy*, không cách nào lách.

Trong code:

- **Aggregate**: cụm entity + value object được coi là *một đơn vị nhất quán*, có một **aggregate root** làm cổng vào duy nhất (giao dịch viên). Mọi **invariant** (rule luôn phải đúng) được enforce tại root — không ai sửa dữ liệu con từ bên ngoài mà không qua root.

```js
// domain/points-account.js — aggregate root, JS thuần + closure
function createPointsAccount({ memberId, balance = 0, version = 0 }) {
  let _balance = createPointsAmount(balance);
  const _pendingEvents = [];

  return {
    get memberId() { return memberId; },
    get balance() { return _balance.value; },

    earn(amount, { ruleId, orderId } = {}) {
      const earned = createPointsAmount(amount); // validate tại đây
      _balance = _balance.add(earned);
      _pendingEvents.push({
        type: 'points.earned',
        memberId, amount: earned.value, ruleId, orderId,
        occurredAt: new Date().toISOString(),
      });
    },

    redeem(cost, { rewardId } = {}) {
      const price = createPointsAmount(cost);
      // ⭐ INVARIANT: balance không bao giờ âm — chặn ngay tại "quầy giao dịch"
      if (!_balance.isGreaterOrEqual(price)) {
        throw new Error('INSUFFICIENT_POINTS');
      }
      _balance = _balance.subtract(price);
      _pendingEvents.push({
        type: 'points.redeemed',
        memberId, amount: price.value, rewardId,
        occurredAt: new Date().toISOString(),
      });
    },

    // application service sẽ lấy event ra publish sau khi save thành công
    pullPendingEvents: () => _pendingEvents.splice(0),
    toSnapshot: () => ({ memberId, balance: _balance.value, version: version + 1 }),
  };
}
```

Giờ thì *không tồn tại* đường code nào làm balance âm — muốn trừ điểm bắt buộc qua `redeem()`, và `redeem()` đứng gác. So với hiện trạng "rule check âm rải trong 3 service", khác nhau như ngân hàng có quầy giao dịch vs hộp tiền chung để giữa chợ kèm tờ giấy "vui lòng không lấy quá số mình gửi".

- Nguyên tắc thiết kế aggregate: **nhỏ nhất có thể**; reference aggregate khác bằng ID (lưu `rewardId`, đừng nhúng nguyên object `Reward` — như sổ tiết kiệm ghi số CMND chứ không kẹp luôn hộ khẩu vào sổ); **một transaction chỉ sửa một aggregate**; giữa các aggregate chấp nhận [[Glossary - Thuật ngữ#Eventual consistency|eventual consistency]] qua event.
- Điều này khớp tự nhiên với Firestore: 1 aggregate ≈ 1 document (hoặc document + subcollection transactions), update root trong 1 Firestore transaction — đúng giới hạn atomic mà Firestore làm tốt.

**Repository**

🏪 **Ví dụ đời sống:** Thủ thư. Bạn hỏi "cho mượn *Số Đỏ* của Vũ Trọng Phụng" — thủ thư đi lấy. Kệ nào, tầng mấy, xếp theo mã gì — chuyện của thư viện, bạn không cần biết và *không được tự vào kho*. Mai thư viện sắp xếp lại toàn bộ kho, bạn vẫn hỏi mượn y câu cũ.

Trong code: **repository** là abstraction load/save *nguyên aggregate*, che giấu persistence. Domain code gọi `pointsAccountRepo.findByMemberId(id)` / `.save(account)` — không biết gì về Firestore:

```js
// infra/points-account-repo.js — chỉ file này biết Firestore tồn tại
function createPointsAccountRepo(db) {
  const col = db.collection('points_accounts');
  return {
    async findByMemberId(memberId) {
      const doc = await col.doc(memberId).get();
      if (!doc.exists) return createPointsAccount({ memberId });
      return createPointsAccount(doc.data()); // dữ liệu thô → aggregate "sống"
    },
    async save(account) {
      await col.doc(account.memberId).set(account.toSnapshot());
    },
  };
}
```

Mỗi aggregate root một repository; **không có repository cho entity con** (không ai mượn "trang 47 của Số Đỏ" — mượn nguyên cuốn).

**Factory**

🏪 **Ví dụ đời sống:** Bếp trưởng kiểm món trước khi ra. Món đã ra khỏi bếp là món *hoàn chỉnh* — không có chuyện bưng ra tô phở thiếu nước dùng rồi "bổ sung sau". Nếu thiếu nguyên liệu, món không ra khỏi bếp, chấm hết.

Trong code: **factory** đóng gói logic *tạo* aggregate phức tạp sao cho object sinh ra **đã hợp lệ ngay từ đầu** — không có trạng thái "tạo xong rồi set dần từng field" (nguồn bug kinh điển: object nửa-init bị ai đó dùng sớm). Vd: `createCampaign(config)` validate đủ rule (ngày bắt đầu < kết thúc, multiplier > 0, có ít nhất 1 earning rule) rồi mới trả về campaign; config sai thì throw, không bao giờ trả về campaign "tạm".

### Domain services vs Application services

🏪 **Ví dụ đời sống:** Phòng khám tư. **Lễ tân** điều phối mọi luồng: đón khách, lấy hồ sơ, gọi đúng bác sĩ, thu tiền, trả kết quả — nhưng lễ tân *không bao giờ tự khám bệnh*. **Bác sĩ** mới là người có chuyên môn ra quyết định y khoa. Phòng khám loạn khi nào? Khi lễ tân bắt đầu... kê đơn ("ho thì uống tạm cái này") — chuyên môn rò rỉ ra chỗ điều phối, không ai kiểm soát được nữa.

Trong code:

- **Domain service** (bác sĩ): chứa business logic *không thuộc về riêng một entity/value object nào* — thường là logic dính nhiều aggregate. Stateless, tên đặt theo [[Glossary - Thuật ngữ#Ubiquitous language|ubiquitous language]]. Vd: `tierCalculation` — quyết định tier dựa trên points history + tier rules (hai aggregate khác nhau, không nhét vừa vào cái nào).
- **Application service** (lễ tân): điều phối use case — nhận request, load aggregate từ repository, gọi method domain, save, publish event. **Không chứa business rule.**

```js
// app/redeem-reward.js — application service: thuần điều phối, không một rule nào
async function redeemReward({ memberId, rewardId }, { accountRepo, rewardRepo, eventBus }) {
  const account = await accountRepo.findByMemberId(memberId);
  const reward = await rewardRepo.findById(rewardId);

  account.redeem(reward.pointsCost, { rewardId }); // rule sống TRONG aggregate

  await accountRepo.save(account);
  for (const event of account.pullPendingEvents()) {
    await eventBus.publish(event); // 'points.redeemed' bay đi
  }
}
```

- Quy tắc kiểm tra nhanh: **nếu xoá application service đi mà business rule mất theo → rule đang đặt sai chỗ** (lễ tân đang kê đơn). Trong [[Glossary - Thuật ngữ#Layered architecture|layered architecture]] cũ, "service layer" thường là application service và domain service trộn lẫn — refactor chính là gỡ rule ra khỏi orchestration, đẩy vào aggregate/domain service.

### Modules

🏪 **Ví dụ đời sống:** Siêu thị xếp hàng theo **gian nhu cầu**: gian đồ ăn sáng, gian gia vị, gian đồ em bé — vì khách đi theo *mục đích*. Tưởng tượng siêu thị xếp theo "chất liệu": gian đồ thuỷ tinh (nước mắm cạnh nước hoa cạnh bình sữa), gian đồ nhựa, gian đồ giấy... Tìm đủ đồ nấu một bữa cơm phải đi 5 gian. Đó chính xác là codebase xếp theo `controllers/`, `services/`, `models/` — sửa một tính năng points phải mở 5 folder.

Trong code:

- Module = cách tổ chức code *bên trong* một bounded context theo **khái niệm domain**, không theo loại kỹ thuật: folder `points/`, `rewards/`, `tiers/` (mỗi folder chứa đủ domain + app + infra của nó) thay vì `controllers/`, `services/`, `models/` dùng chung cho tất cả.
- Tên module phải nằm trong ubiquitous language; dependency giữa module nên **một chiều, ít và rõ ràng**.
- Đây là bước refactor "rẻ" nhất mà hiệu quả cao: chỉ di chuyển file theo chiều dọc nghiệp vụ, chưa cần đổi logic — như sắp lại kệ siêu thị mà chưa cần đổi món hàng nào.

### Domain events và Integration events

🏪 **Ví dụ đời sống:** Trong nhà, tin "con bé đậu đại học rồi!" được hét từ bếp lên gác, kể đi kể lại mỗi lần một kiểu, thêm mắm thêm muối thoải mái — người nhà hiểu hết, chẳng cần format. Nhưng **thiệp báo tin gửi họ hàng** thì khác: in ấn chỉn chu, đủ họ tên, ngày giờ, địa điểm, và *một khi đã gửi đi thì không đổi nội dung được nữa*. Chuyện nội bộ thì linh hoạt; chuyện đã thành "hợp đồng với bên ngoài" thì phải ổn định.

Trong code:

- **[[Glossary - Thuật ngữ#Domain event|Domain event]]**: ghi nhận một việc nghiệp vụ *đã xảy ra* bên trong bounded context, tên thì quá khứ: `points.earned`, `tier.upgraded`. Do aggregate phát ra khi state đổi (xem `_pendingEvents` ở trên); các handler **trong cùng context** phản ứng — "tiếng hét trong nhà", đổi format thoải mái vì mọi consumer cùng một codebase, sửa một PR là xong.
- **Integration event**: event đã được "đóng gói" để **vượt ranh giới context** — schema ổn định, versioned, là contract công khai (published language, chương 3) — "tấm thiệp gửi họ hàng". Bên trong đổi thoải mái, nhưng đổi integration event là đổi hợp đồng với context khác.
- Phân biệt quan trọng khi refactor: **đừng bê nguyên domain event nội bộ ra làm message liên context** — sẽ khoá chặt model nội bộ vào consumer bên ngoài (gửi họ hàng tờ giấy nháp trong bếp, rồi từ đó không dám sửa giấy nháp nữa). Map domain event → integration event ở rìa context:

```js
// points/edge/to-integration-event.js — "in thiệp" từ chuyện nội bộ
function toIntegrationEvent(domainEvent) {
  if (domainEvent.type === 'points.earned') {
    return {
      topic: 'member.points-earned.v1',          // versioned — đây là hợp đồng
      data: {
        memberId: domainEvent.memberId,
        points: domainEvent.amount,
        earnedAt: domainEvent.occurredAt,
        // KHÔNG leak chi tiết nội bộ: ruleId, debug info... giữ trong nhà
      },
    };
  }
  return null; // không phải event nào trong nhà cũng đáng in thiệp
}
```

- Trên GCP: domain event xử lý in-process; integration event đi qua **Pub/Sub** (Points context publish `member.points-earned.v1`, Notifications context subscribe để gửi email).
- Event hoá còn giúp gỡ coupling khi refactor monolith: thay vì module A gọi thẳng hàm của module B, A phát event và B tự nghe — cắt được dependency trực tiếp, sau này tách service cũng dễ.

## Sai lầm thường gặp

- **Aggregate to như cái chợ**: nhét `Member` + toàn bộ orders + points history + reward claims vào một aggregate — mỗi lần cộng điểm phải load cả núi, hai request đụng nhau liên tục. Như bắt một giao dịch viên giữ sổ của *cả phường*: ai đến cũng phải xếp hàng chờ cùng một người. Aggregate phải nhỏ nhất có thể quanh đúng invariant cần bảo vệ.
- **Lách qua mặt aggregate root**: tiện tay `doc.ref.update({ pointsBalance: x })` thẳng vào Firestore ở một script admin/migration — tự cầm bút ghi vào sổ tiết kiệm không qua quầy. Một đường lách là invariant thành tờ giấy dán cửa.
- **Lễ tân kê đơn**: business rule nằm trong application service / route handler ("nếu member tier Gold thì discount 10%" viết ngay trong handler) — xoá orchestration là mất rule. Rule phải sống trong aggregate hoặc domain service.
- **Repository trả về data thô thay vì aggregate**: `repo.findById()` trả `doc.data()` rồi service tự xử — thủ thư đưa bạn... chìa khoá kho tự vào lục. Repository phải trả aggregate "sống" với đầy đủ behavior.
- **Publish thẳng domain event nội bộ lên Pub/Sub**: object nội bộ (kèm field debug, naming tuỳ hứng) thành contract mà 3 context khác phụ thuộc — từ đó không dám đổi model trong nhà. Luôn map qua integration event có version ở rìa.
- **Value object nhưng mutable**: tạo `pointsAmount` rồi chỗ khác gán `amount.value = -50` — quên `Object.freeze` là tờ tiền bị... viết đè mệnh giá. Immutability là một nửa giá trị của value object.

## Thuật ngữ cần nhớ
| Thuật ngữ | Nghĩa là gì (1 câu) |
|---|---|
| Entity | Object có identity xuyên suốt vòng đời, so bằng ID ("anh Hùng dù đổi số điện thoại") |
| Value object | Object immutable định nghĩa bởi giá trị, gom validation + behavior ("tờ 50k") |
| Primitive obsession | Bệnh dùng number/string trần thay vì value object — validation rải khắp nơi |
| Aggregate / Aggregate root | Cụm object là một đơn vị nhất quán / cổng vào duy nhất enforce invariant ("sổ tiết kiệm / giao dịch viên") |
| Invariant | Business rule phải luôn đúng bên trong aggregate (vd: balance ≥ 0) |
| Repository | Abstraction load/save nguyên aggregate, che giấu Firestore/DB ("thủ thư") |
| Factory | Đóng gói việc tạo aggregate phức tạp, hợp lệ ngay từ đầu ("bếp trưởng kiểm món trước khi ra") |
| Domain service | Business logic stateless không thuộc riêng entity nào — thường dính nhiều aggregate ("bác sĩ") |
| Application service | Điều phối use case: load → gọi domain → save → publish, không chứa rule ("lễ tân") |
| Module | Tổ chức code theo khái niệm domain (`points/`) thay vì loại kỹ thuật (`services/`) — "gian siêu thị" |
| Domain event | Sự kiện nội bộ context, aggregate phát khi state đổi ("tiếng hét trong nhà") |
| Integration event | Event đóng gói thành contract versioned liên context ("thiệp báo gửi họ hàng") |

## Áp dụng cho mình (Joy Loyalty)
- Refactor thí điểm một aggregate: `PointsAccount` (balance + transactions) với invariant "balance không âm, mọi thay đổi đều có transaction ghi lại" — map thành 1 document Firestore + subcollection, update qua Firestore transaction. Code mẫu ở trên dùng được làm khung khởi đầu.
- Tách `PointsAmount` thành value object đầu tiên (JS thuần + `Object.freeze` là đủ, không cần TS) — gom hết validation điểm đang rải rác trong các service về một chỗ.
- Soi service layer hiện tại bằng câu hỏi "lễ tân có đang kê đơn không?": hàm nào vừa orchestrate vừa chứa rule → tách đôi thành application service (mỏng) + method trên aggregate/domain service (chứa rule).
- Audit các script admin/migration/cron: chỗ nào đang `update()` thẳng `pointsBalance` không qua aggregate → đường lách invariant, ưu tiên bịt.
- Khi nối context qua Pub/Sub, định nghĩa integration event có version (`member.points-earned.v1`) ngay từ đầu — đừng publish thẳng object nội bộ; viết schema ra file (published language) cho team khác đọc.
- Thử tái cấu trúc folder theo module nghiệp vụ (`points/`, `rewards/`, `tiers/` — mỗi folder đủ domain/app/infra) cho phần code mới trước, code cũ dời dần — bước rẻ nhất, thấy kết quả ngay.
