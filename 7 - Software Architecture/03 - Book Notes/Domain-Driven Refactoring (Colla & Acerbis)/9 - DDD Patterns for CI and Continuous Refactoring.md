# Chương 9 — DDD Patterns for Continuous Integration and Continuous Refactoring

> ⚠️ Tóm tắt khái niệm theo mục lục sách + kiến thức DDD chuẩn — không phải bản dịch nguyên văn. Đọc sách gốc để lấy case study chi tiết. Ví dụ đời sống & Joy Loyalty là ví dụ của mình, không phải từ sách.

## TL;DR
Refactoring không phải dự án có ngày kết thúc mà là **thói quen liên tục** — như đánh răng, không phải như đại tu nhà. Chương cuối phần này bàn cách nhúng DDD vào quy trình CI/CD: ranh giới bounded context được **enforce bằng máy** (fitness functions trong pipeline), ranh giới không bất biến — biết khi nào nên tách/gộp context, và dùng tooling (SonarQube, GitHub Actions/GitLab) để chất lượng kiến trúc không phụ thuộc vào trí nhớ và thiện chí của con người.

## Nội dung chính

### Integrating DDD with CI/CD

🏪 **Ví dụ đời sống:** luật giao thông mà chỉ trông vào ý thức thì chạy được vài tuần. Thứ giữ được trật tự lâu dài là **camera phạt nguội**: tự động, không cảm xúc, không nể nang, hoạt động 24/7 kể cả tuần deadline. Vạch kẻ đường (ranh giới module) đẹp đến đâu mà không có camera thì rồi ai cũng đè vạch "một tí thôi mà".

Trong code, cái này chính là: **kiến trúc chỉ sống sót nếu được enforce bằng máy.** Các practice chuẩn:

- **Fitness functions** (từ trường phái evolutionary architecture): test tự động kiểm tra *thuộc tính kiến trúc* — ví dụ "module `points` không được import từ `rewards/infra`" — chạy trong CI như một test thường. Trong JS: ESLint `no-restricted-imports`/plugin boundaries, hoặc `dependency-cruiser` assert cả dependency graph. GitHub Actions check mẫu chặn vi phạm boundary:

```yaml
# .github/workflows/ci.yml
name: CI
on: [pull_request]
jobs:
  architecture-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
      # Fitness function 1: cấm import xuyên ruột module khác
      - name: Module boundaries
        run: npx depcruise src --config .dependency-cruiser.cjs
      # Fitness function 2: lint (gồm no-restricted-imports + complexity)
      - run: npm run lint
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
      - run: npm test -- --coverage
```

```js
// .dependency-cruiser.cjs — luật kiến trúc viết thành code
module.exports = {
  forbidden: [
    {
      name: 'no-cross-module-internals',
      severity: 'error',
      from: { path: '^src/modules/([^/]+)/' },
      to: {
        path: '^src/modules/([^/]+)/(domain|infra)/',
        pathNot: ['^src/modules/$1/'], // ruột của chính mình thì OK
      },
    },
    {
      name: 'shared-kernel-depends-on-nothing',
      severity: 'error',
      from: { path: '^src/shared-kernel/' },
      to: { path: '^src/modules/' },
    },
  ],
};
// PR nào vi phạm → pipeline đỏ → không merge được. Hết tranh luận miệng.
```

- **Pipeline theo module**: modular monolith cho phép CI thông minh — path filter để chỉ chạy test của module bị ảnh hưởng → build nhanh → feedback nhanh → dám refactor thường xuyên hơn. Vòng lặp tốt tự nuôi chính nó.
- **Trunk-based development + feature flags**: refactor lớn được chẻ thành các bước nhỏ merge sớm vào main, code mới ẩn sau flag — thay vì branch sống 3 tuần rồi merge conflict địa ngục. 🏪 Như dọn nhà mỗi ngày 15 phút thay vì để dồn thành "chiến dịch tổng vệ sinh" cuối năm — chiến dịch nghe hoành tráng nhưng thường bị hoãn vô thời hạn.
- **Deployment an toàn**: canary/gradual rollout. 🏪 Như nếm một muỗng canh trước khi múc cho cả nhà — Cloud Run traffic splitting làm việc này rất gọn: đẩy 10% traffic sang revision mới, xem metrics (error rate + metrics nghiệp vụ từ structured logging chương 5), rồi tăng dần. Có vấn đề → vặn về 0% trong vài giây.
- Ubiquitous language cũng đi vào CI được: spec test Given–When–Then (chương 7) chạy trong pipeline chính là "executable documentation" — tài liệu nghiệp vụ không bao giờ outdated vì outdated là pipeline đỏ.

### Splitting and merging bounded contexts

🏪 **Ví dụ đời sống:** hai đứa con nhỏ ở chung một phòng thì hợp lý. Lớn lên, một đứa học khuya một đứa ngủ sớm, đồ đạc dẫm chân nhau — **đến lúc ngăn phòng** (split). Ngược lại, khi một đứa đi học xa, hai phòng trống mà mỗi lần dọn phải dọn cả hai — **gộp lại** (merge). Vách ngăn xây theo nhu cầu sống, không phải xây một lần rồi thờ.

Trong code: ranh giới bounded context **không bất biến** — nghiệp vụ đổi thì ranh giới đổi. Chương này bàn cả hai chiều:

- **Khi nào tách (split)**:
  - Một context phình to, bên trong xuất hiện hai nhóm khái niệm ít liên quan, hai nhịp thay đổi khác nhau, hoặc một từ bắt đầu mang hai nghĩa.
  - Ví dụ Joy Loyalty: context `Campaigns` ban đầu gộp chung "earning rules" (cách kiếm điểm thường trực) và "promotional campaigns" (chương trình thời vụ) — khi promotional mọc thêm scheduling, targeting, A/B testing... thì hai nhóm khái niệm đã rõ ràng là hai câu chuyện → tách context.
  - Cách tách an toàn: **bằng các bước nhỏ qua CI** — tách module trong code trước (ranh giới logic), mỗi bước một PR xanh, chạy ổn một thời gian rồi mới cân nhắc tách dữ liệu/deploy. Đúng tinh thần strangler của chương 6.
- **Khi nào gộp (merge)**:
  - Hai context "chat" với nhau quá nhiều (luồng nào cũng gọi qua lại), thay đổi nào cũng phải sửa cả hai cùng lúc (**coupled change** — soi được bằng git history: hai module hay xuất hiện chung một commit), hoặc ranh giới ban đầu vẽ sai vì hồi đó chưa hiểu domain. Vẽ sai là bình thường — hiểu domain là quá trình.
  - Gộp cũng đi từng bước: hợp nhất ngôn ngữ/model trước, gộp code sau, gộp dữ liệu cuối cùng.
- Bài học meta: tách/gộp context chính là **refactoring ở tầng kiến trúc** — và nó cũng cần lưới an toàn (contract test giữa các module, fitness functions) y như refactoring tầng hàm cần unit test.

### Automation and tooling — SonarQube, GitLab, GitHub Actions

🏪 **Ví dụ đời sống:** khám sức khoẻ định kỳ không chữa bệnh — nó cho **số liệu theo thời gian**: mỡ máu đang tăng dần, nên chỉnh chế độ ăn *trước khi* thành bệnh. Tooling chất lượng code cũng vậy: complexity trend, duplication, hotspot — để biết "cơ thể codebase" đang xấu đi ở đâu và refactor *trước khi* thành sự cố.

Trong code:
- **Static analysis / quality gate (SonarQube hoặc tương đương)**:
  - Theo dõi code smells, **cyclomatic complexity** (số đường đi độc lập qua một hàm — càng cao càng khó test), duplication, coverage.
  - Khái niệm quan trọng nhất: **quality gate trên code mới** — không đòi trả hết nợ cũ một lần, chỉ yêu cầu *code mới chạm vào phải sạch hơn*. Đây là "boy scout rule" được tự động hoá: không ai bắt dọn cả công viên, chỉ cần đừng xả thêm rác và nhặt vài cọng quanh chỗ mình ngồi.
  - Hệ JS có lựa chọn nhẹ hơn SonarQube: ESLint (`complexity`, `max-lines`, `max-depth`), `jscpd` (duplication), coverage threshold của Jest/Vitest — đủ dùng cho team nhỏ, không thêm hạ tầng.
- **CI platform (GitHub Actions / GitLab CI)** — pipeline mẫu cho modular monolith, thứ tự từ rẻ đến đắt:
  1. Lint + **kiểm tra ranh giới module** (dependency-cruiser/ESLint boundaries) — vài giây
  2. Unit + specification test (theo module, có cache) — vài chục giây
  3. Integration test với **Firestore emulator** — vài phút
  4. Build + deploy lên Cloud Run dạng canary (traffic 10%) → theo dõi → promote 100%
- Vai trò của tooling trong continuous refactoring: biến "nên làm" thành "**không làm thì pipeline đỏ**" — kỷ luật kiến trúc không scale bằng review tay, chỉ scale bằng automation. Và metrics từ tooling (complexity trend, hotspot, coupled changes) là **la bàn chọn chỗ refactor tiếp theo** thay vì refactor theo cảm tính/theo chỗ mình ghét.

## Sai lầm thường gặp
1. **Kiến trúc giữ bằng văn bản + thiện chí** — vẽ context map đẹp, viết wiki, rồi không có check nào trong CI. Sáu tháng sau ranh giới mục hết — như vạch kẻ đường không camera. Mỗi quy tắc kiến trúc phải có một fitness function tương ứng, hoặc chấp nhận nó sẽ bị vi phạm.
2. **Quality gate áp lên toàn bộ nợ cũ** — bật SonarQube/coverage threshold cho cả codebase legacy → 4000 lỗi, team tê liệt, tắt tool sau 2 tuần. Gate chỉ áp trên **code mới/file thay đổi trong PR** — nợ cũ trả dần theo boy scout rule.
3. **Branch refactor sống lâu** — "để em làm xong hết rồi merge một thể" → conflict chồng chất, review bất khả thi, cuối cùng bỏ branch. Trunk-based + feature flag: merge nhỏ mỗi ngày, main luôn xanh.
4. **Coi ranh giới context là bất biến** — đã vẽ rồi thì "đụng vào là phạm thượng", trong khi nghiệp vụ đã đổi. Ngược lại cũng sai: đổi ranh giới xoành xoạch theo mood. Nhịp hợp lý: review context map định kỳ (quý/lần) dựa trên số liệu coupled changes, không dựa cảm tính.
5. **Deploy bản refactor 100% traffic một phát** — có Cloud Run traffic splitting miễn phí mà không dùng. Mọi deploy của bản refactor đáng kể đều nên canary: 10% → soi metrics → 100%. Múc cả nồi canh ra mâm rồi mới biết mặn thì đã muộn.
6. **Sưu tầm tool thay vì dùng tool** — bật SonarQube + 5 GitHub Actions + dashboard chất lượng... nhưng pipeline đỏ thì vẫn force-merge "vì gấp". Một check mà vi phạm được thì tệ hơn không có check — vì nó dạy team rằng check là trang trí.

## Thuật ngữ cần nhớ
| Thuật ngữ | Nghĩa là gì (1 câu) |
|---|---|
| Fitness function | "Camera phạt nguội" của kiến trúc — test tự động kiểm tra một thuộc tính kiến trúc trong CI. |
| Architecture check | Job CI chạy fitness functions (vd dependency-cruiser) — fail là không merge được. |
| Trunk-based development | Merge vào main thường xuyên, branch sống ngắn, refactor lớn chẻ nhỏ sau feature flag. |
| Feature flag | Công tắc bật/tắt code mới lúc runtime, cho phép merge sớm mà chưa kích hoạt. |
| Quality gate | Ngưỡng chất lượng (coverage, complexity, duplication) PR phải vượt qua mới được merge. |
| Quality gate on new code | Chỉ đòi code mới sạch, không bắt trả nợ cũ một lần — boy scout rule tự động hoá. |
| Cyclomatic complexity | Số đường đi độc lập qua một hàm — càng cao càng khó test và dễ bug. |
| Canary deployment | "Nếm một muỗng trước" — đẩy bản mới cho phần nhỏ traffic, xem metrics rồi mới rollout hết. |
| Coupled change | Hai module luôn bị sửa cùng nhau trong các commit — dấu hiệu ranh giới vẽ sai. |
| Split / merge context | Tách context khi hai nhóm khái niệm lệch nhịp; gộp khi hai context dính nhau quá mức. |
| Executable documentation | Spec test Given–When–Then chạy trong CI — tài liệu không bao giờ outdated. |
| Boy scout rule | Mỗi lần chạm vào code, để nó sạch hơn lúc mình đến một chút. |

## Áp dụng cho mình (Joy Loyalty)
- Thêm job CI "architecture check" bằng `dependency-cruiser` (config mẫu ở trên): fail PR nào import xuyên ranh giới module — fitness function đầu tiên, rẻ nhất, hiệu quả nhất cho modular monolith. Làm ngay khi module `tiers` đầu tiên hình thành (chương 6), đừng đợi "xong hết kiến trúc".
- Tận dụng Cloud Run traffic splitting làm canary mặc định cho mọi deploy của bản refactor: 10% → xem error rate + metrics nghiệp vụ (`points.earned`/giờ từ structured logging) → 100%; có lệch thì về 0% trong vài giây.
- Đặt quality gate kiểu "code mới phải sạch": ESLint complexity + coverage threshold chỉ áp trên file thay đổi trong PR, không đòi trả hết nợ cũ một lần — tránh tê liệt team.
- Mỗi quý nhìn lại context map một lần: dùng git log tìm coupled changes giữa các module (hai module hay xuất hiện chung commit) để quyết định tách/gộp ranh giới — coi đây là nghi thức định kỳ của team, như khám sức khoẻ, không phải việc phát sinh khi có biến.
- Quy ước cứng với team: pipeline đỏ là không merge, không có ngoại lệ "vì gấp" — một check vi phạm được sẽ dạy cả team rằng mọi check đều vi phạm được.
