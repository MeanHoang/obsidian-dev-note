**Debug Thinking (Tư duy debug & troubleshoot)** là cách tiếp cận bug **như một bài toán khoa học có giả thuyết và bằng chứng**, không phải đoán mò rồi sửa.

> *"Debugging is the scientific method with a deadline."* — Nicole Tietz-Sokolskaya

---

## 🔍 Hiểu đơn giản

Junior thường hỏi:
> "Sửa thế này được không?"

Senior debug giỏi sẽ hỏi:
> "Hệ thống đang chạy KHÁC mental model của tôi ở chỗ nào? Bằng chứng nào chứng minh?"

**"Bug không phải lỗi cần sửa — bug là chỗ mental model của bạn sai. Sửa mental model trước, code sau."**

---

## 🧠 Bản chất của Debug Thinking

Debug giỏi không phải nhanh tay gõ `console.log` — mà là **3 năng lực tư duy**:

### 1. **Tư duy khoa học (Scientific method)**
Bug = hiện tượng → đưa giả thuyết → test → khẳng định/loại bỏ → lặp.
- Mỗi hành động (đọc log, thêm log, chạy thử) phải trả lời **đúng 1 câu hỏi**.
- Nếu không biết hành động này sẽ học được gì → đừng làm.

### 2. **Tư duy phản biện (Critical thinking)**
- **Trust nobody, trust nothing** — không tin lib, không tin log, không tin chính tay mình code hôm qua.
- Câu "không thể nào" là **dấu hiệu bug đang ở chính chỗ bạn vừa loại trừ**.
- Phân biệt **observation (cái thấy)** vs **interpretation (cái nghĩ)**. Junior thường gộp 2 cái → đi sai hướng.

### 3. **Tư duy thu hẹp không gian (Search space narrowing)**
- Mỗi bước phải **loại được ≥50% khả năng** → giống binary search.
- Nếu sau 30 phút chưa loại được nửa nào → đang sai phương pháp, không phải bug khó.

---

## ⚡ Quy trình debug 6 bước (systematic)

Theo [Nicole Tietz](https://ntietz.com/blog/how-i-debug-2023/), [Agans](https://embeddedartistry.com/blog/2017/09/06/debugging-9-indispensable-rules/), [Julia Evans](https://jvns.ca/blog/2022/12/08/a-debugging-manifesto/):

### Bước 1 — **Xác định triệu chứng chính xác**
- Bug "không hoạt động" KHÔNG phải triệu chứng. "Khi user click Save trên Safari iOS 17, request 200 nhưng UI vẫn loading vĩnh viễn" MỚI là triệu chứng.
- Câu hỏi: *Cái gì sai? Sai ở đâu? Sai như thế nào? So với cái gì là đúng?*

### Bước 2 — **Reproduce — Make it fail**
- Bug không reproduce được = bug không tồn tại để fix.
- Nếu intermittent → record mọi điều kiện (input, time, user, env, version).
- **Minimize repro**: cắt dần điều kiện cho đến khi chỉ còn yếu tố thiết yếu. Repro ngắn = bug rõ.

### Bước 3 — **Quit thinking and look (lấy data trước, đoán sau)**
> *"Too many try to 'fix' things based on a guess instead of gathering data."* — Agans

- Đọc log thật, đọc value biến thật, đọc network response thật.
- Nếu chưa có dữ liệu → **thêm instrumentation**. Đừng đoán.
- Quy tắc Julia Evans: *"Inspect, don't squash"* — hiểu bug trước khi sửa, đừng vội fix.

### Bước 4 — **Form hypothesis (giả thuyết có thể loại trừ)**
Giả thuyết tốt phải:
- **Cụ thể**: "Cache không invalidate khi user update profile" (chứ không phải "Cache có vấn đề").
- **Falsifiable**: nghĩ ra được 1 test trả lời rõ Đúng/Sai.
- **Thu hẹp được không gian**: dù đúng hay sai, vẫn loại được nhiều khả năng khác.

### Bước 5 — **Divide & Conquer — test giả thuyết bằng binary search**
- Chia hệ thống làm đôi (frontend vs backend? service A vs B? function X vs Y?).
- Test 1 nửa → loại nửa kia → lặp.
- Code regression → `git bisect` tự động binary search 100 commit trong **≤7 bước** (O(log n)).
- Quy tắc: **change one thing at a time** — đổi nhiều biến cùng lúc thì không biết biến nào gây ra.

### Bước 6 — **Fix & verify (and verify fix is real)**
> *"If you didn't fix it, it ain't fixed."* — Agans rule 9

- Cycle: broken → apply fix → fixed → revert fix → broken lại → re-apply → fixed.
- Chứng minh fix là **nguyên nhân**, không phải coincidence.
- Hỏi: *bug còn xảy ra ở case nào tương tự mà tôi chưa test?*

---

## 🧰 9 quy tắc của David Agans (kinh điển)

| # | Rule | Bản chất |
|---|------|----------|
| 1 | **Understand the system** | Đọc docs, đọc code, biết hệ thống _đáng lẽ_ chạy thế nào |
| 2 | **Make it fail** | Reproduce được mới debug được |
| 3 | **Quit thinking and look** | Lấy data trước, đoán sau |
| 4 | **Divide and conquer** | Binary search trong không gian khả năng |
| 5 | **Change one thing at a time** | Đổi 1 biến / lần để biết biến nào gây ra |
| 6 | **Keep an audit trail** | Ghi lại đã thử gì, kết quả gì — chống lú |
| 7 | **Check the plug** | Check những thứ "không thể nào sai" trước (env var? đúng branch? service đang chạy?) |
| 8 | **Get a fresh view** | Giải thích cho người khác → phát hiện assumption sai |
| 9 | **If you didn't fix it, it ain't fixed** | Verify fix bằng cycle broken↔fixed |

---

## 🛠️ Các kỹ thuật cốt lõi

### A. **Rubber Duck Debugging** (giải thích cho con vịt)
Giải thích code từng dòng cho 1 vật vô tri (vịt cao su, đồng nghiệp, Claude):
- **Vì sao hiệu quả**: phải nói chậm hơn nghĩ → ép articulate assumption ngầm.
- **Cognitive offloading**: working memory hữu hạn, nói ra giúp não thấy gap.
- **Perspective shift**: vịt không biết gì → bạn buộc phải giải thích cả thứ tưởng "hiển nhiên" — đó là chỗ bug thường nấp.

> Trong 80% case, chưa nói xong là tự thấy bug.

### B. **5 Whys** (Sakichi Toyoda — Toyota)
Hỏi "tại sao" 5 lần để xuyên qua triệu chứng đến root cause:
```
- App crash khi gọi API discount.
  → Why? Vì response null khi merchant chưa setup market.
  → Why? Vì code assume market luôn tồn tại.
  → Why? Vì spec ban đầu chỉ có 1 market mặc định.
  → Why? Vì PRD không cover multi-market case khi GA.
  → Why? Vì design review skip phần edge case → cần thêm checklist
```
- Fix tầng 1 = patch. Fix tầng 4-5 = ngăn cả class bug.
- Best cho bug **lặp lại nhiều lần** hoặc **incident postmortem**, không hợp với bug đơn giản.

### C. **Git Bisect** (binary search commit history)
Khi biết "trước OK, giờ hỏng" nhưng không biết commit nào:
```bash
git bisect start
git bisect bad                  # commit hiện tại hỏng
git bisect good <commit-cũ-OK>  # commit cũ chắc chắn OK
# Git checkout giữa, mình test → mark good/bad → lặp
git bisect run ./test.sh        # tự động nếu có test script
```
- 1000 commit → tìm ra commit gây bug trong **≤10 bước**.
- Áp dụng được cho cả: bisect config, bisect data version, bisect dependency version.

### D. **Tư duy ngược (Reverse thinking)**
- Thay vì hỏi "code này chạy đúng thế nào?" → hỏi "**làm sao tôi có thể phá vỡ code này?**"
- Đầu vào nào sẽ làm function này panic? Null? Empty string? Unicode? Race condition?
- Dùng nhiều khi test edge case + security review.

### E. **Tư duy tương đồng (Analogical thinking)**
- "Bug này giống bug gì tôi đã gặp?" → search code, search PR, search Slack, search Sentry.
- "Service A có pattern tương tự service B đã từng gặp lỗi này → kiểm tra A."
- Senior debug nhanh không phải vì giỏi hơn → mà vì **đã thấy bug tương đồng trước**. Build "bug library" cá nhân (note lại mỗi bug khó gặp).

### F. **Failure-first thinking** (đã có note riêng [[Failure-first Thinking]])
- Trước khi viết code: nghĩ trước cách nó sẽ hỏng.
- Khi debug: assume **chính code của tôi** sai trước (Julia Evans: *"It's probably your code — 95% of the time"*).

---

## ❓ Asking good questions — Hỏi đúng để tới vấn đề

### Khi hỏi đồng đội/senior, follow **Read-Search-Ask** order:

#### 1. **Read** (5–15 phút)
- Đọc error message **đầy đủ**, không chỉ dòng đầu.
- Đọc stack trace từ trên xuống — tìm dòng đầu tiên thuộc **code của mình** (không phải lib).
- Đọc docs của lib/API liên quan.

#### 2. **Search** (5–15 phút)
- Search exact error message trên Google, Slack history, Sentry, GitHub issues của repo.
- Search code: function này được gọi từ đâu? Có ai đã đụng vào tuần qua?
- 60% bug đã có người gặp.

#### 3. **Ask** — Cấu trúc câu hỏi đúng

Template "good question":
```
[Context]    Tôi đang làm X (link PR / task)
[Expected]   Tôi expect: Y xảy ra
[Actual]     Thực tế: Z (kèm log/screenshot/repro steps)
[Tried]      Đã thử: A, B, C — kết quả từng cái
[Hypothesis] Tôi nghi: vì ... — nhưng chưa chắc vì ...
[Ask]        Anh/chị có gợi ý hướng nào để loại trừ tiếp không?
```

### Câu hỏi tốt vs câu hỏi tệ

| ❌ Tệ | ✅ Tốt |
|------|-------|
| "API không chạy" | "POST `/orders` trả 500, log nói `null pointer at OrderService:142`, đã verify input không null ở line 138 — em nghi line 140 mutate state" |
| "Sửa thế nào?" | "Em đã thử fix bằng cách X, nó pass test nhưng case Y vẫn fail — anh thấy approach có sai gì không?" |
| "Code này có bug" | "Function `applyDiscount` với input `{type: 'BOGO', qty: 0}` trả `NaN` — em nghĩ do chia cho qty ở line 27, đúng không?" |

### Câu hỏi tự hỏi chính mình (self-questioning)

- *Cái gì tôi đang **giả định** mà chưa **verify**?* (assumption hidden = bug hidden)
- *Lần cuối tính năng này **chạy đúng** là bao giờ? Đã đổi gì giữa lúc đó với giờ?*
- *Bug này xảy ra **mọi lúc** hay **chỉ điều kiện nào**? Điều kiện đó nói lên gì?*
- *Nếu tôi chỉ được hỏi **1 câu** với người viết code này, tôi sẽ hỏi gì?*
- *Nếu phải đặt tiền cược **bug nằm ở file nào**, tôi đặt file gì? Tại sao?*

---

## 🏭 Production debug — khi không thể `console.log` rồi reload

Local debug có luxury: thêm log → save → reload. **Production thì không**:
- Mỗi lần thêm log = build + deploy + cold start (Cloud Run mất 5–15 phút mới chạy).
- User đang chịu lỗi **ngay lúc này** — không có time để debug từ tốn.
- Data thực, traffic thực, edge case thực — local không repro nổi.
- Sửa sai = downtime / data corruption thật.

→ Cần **đảo ngược tư duy**: thay vì "debug khi cần", **trang bị khả năng debug trước** (observability) và **mitigate trước, diagnose sau** khi incident xảy ra.

### A. Mitigate first, diagnose later (Google SRE)

> *"Customers do not care whether or not you fully understand what caused an outage. What they want is to stop receiving errors."* — Google SRE Workbook

Thứ tự đúng khi production có sự cố:
1. **Assess impact** — bao nhiêu user/merchant ảnh hưởng? Doanh thu? Data integrity?
2. **Mitigate** — dừng đau cho user trước (chưa cần hiểu vì sao):
   - **Rollback** revision Cloud Run về version cũ (lệnh 1 dòng, ~30s).
   - **Disable feature flag** (off 1 nút, không cần deploy).
   - **Failover** traffic sang region khác.
   - **Scale up** nếu là resource issue.
   - **Drain** instance lỗi.
3. **Diagnose** — sau khi user đỡ đau mới điều tra root cause.
4. **Postmortem** — viết lại, fix vĩnh viễn.

**Quy tắc vàng**: nếu bug xuất hiện trong vòng **15 phút sau deploy** → **rollback trước, hỏi sau**. 80% case là deploy gây ra.

### B. Đầu tư observability **trước** khi cần (3 trụ)

Khi bug xảy ra mà chưa có observability = quá muộn. Bắt buộc setup từ trước:

| Trụ | Trả lời câu hỏi | Tool cho stack Joy |
|-----|----------------|---------------------|
| **Metrics** | "Có gì sai không? Khi nào bắt đầu sai?" | Cloud Monitoring, Firestore usage insights, custom metrics |
| **Logs** | "Cái gì sai? Context cụ thể request đó?" | Cloud Logging (auto từ stdout/stderr Cloud Run), Sentry |
| **Traces** | "Sai ở đâu trong chuỗi service A→B→C? Bottleneck nào?" | Cloud Trace (auto qua `X-Cloud-Trace-Context` header) |

**Cách 3 trụ phối hợp**: Metrics → **alert** bạn có vấn đề → Traces → chỉ ra **request/service nào** chậm/lỗi → Logs → cho **context chi tiết** để fix.

### C. Pre-deploy checklist — code phải debug được trước khi ship

Phải có **trước** khi production lên:

- [ ] **Structured logging (JSON)** — không log free text, log object có field rõ:
  ```js
  // ❌ Bad
  console.log("user " + userId + " bought " + productId);
  // ✅ Good
  logger.info({ event: 'purchase', userId, productId, shopId, amount }, 'purchase completed');
  ```
- [ ] **Correlation ID / trace ID** trong mọi log entry — generate ở entry point (API gateway / first middleware), propagate qua mọi service/job.
- [ ] **Log levels rõ ràng** — ERROR (cái hỏng) / WARN (đáng nghi) / INFO (state machine flow) / DEBUG (chi tiết, chỉ bật khi cần).
- [ ] **User-facing identifier** trong log — `shopId`, `userId`, `orderId` — để filter theo merchant cụ thể.
- [ ] **Không log secret/PII** — token, password, email full → log hash hoặc ID.
- [ ] **Error tracking** — Sentry / Cloud Error Reporting tự bắt exception, không phụ thuộc dev nhớ log.
- [ ] **Feature flag** cho mọi feature mới — bật/tắt không cần deploy.
- [ ] **Dynamic log level** — đổi level qua env var / config (không cần deploy code để bật DEBUG).
- [ ] **Health endpoint** — `/health` check downstream (Firestore, Pub/Sub) để biết cái nào down.

### D. Live debug techniques — KHÔNG cần deploy

Khi bug đang xảy ra, không có quyền thêm `console.log`:

#### 1. **Query logs với filter cụ thể** (Cloud Logging)
```
# Lọc log Cloud Run của 1 service, 1 revision, 1 user cụ thể trong 5 phút qua
resource.type="cloud_run_revision"
resource.labels.service_name="joy-loyalty-api"
jsonPayload.shopId="12345"
severity>=ERROR
timestamp>="2026-05-22T08:00:00Z"
```
- Học cú pháp Logs Explorer — biết filter nhanh = debug nhanh.

#### 2. **Follow theo trace ID / correlation ID**
- Khi merchant báo lỗi → xin **trace ID** từ response header / Sentry / error page.
- Filter mọi log có trace ID đó → đọc narrative đầy đủ request đi qua service nào, fail ở đâu.
- *"Nếu logs được correlate với traces, bạn không cần reproduce bug — bạn có thể reconstruct exactly what happened."* — OneUptime

#### 3. **Cloud Trace** — coi waterfall request
- Mở 1 trace cụ thể → thấy mỗi service tốn bao lâu, ai gọi ai, đâu là bottleneck.
- Compare trace **chậm vs nhanh** cùng endpoint → biết bước nào outlier.

#### 4. **Error Reporting** — Cloud Run auto group exception
- Exception viết ra stderr với stack trace → tự gom theo signature.
- Coi: lỗi gì xuất hiện mới sau deploy? Bao nhiêu user? Có spike không?

#### 5. **Firestore audit logs** — debug data layer
- Bật **Data Access Audit Logs** (`IAM & Admin > Audit Logs > Firestore Data Read/Write`).
- Query: `protoPayload.serviceName="firestore.googleapis.com"` → biết ai đọc/ghi document nào, khi nào.
- Hữu ích khi nghi data corruption hoặc query chậm.

#### 6. **BigQuery log sink** — ad-hoc analytics trên log
- Sink Cloud Logging → BigQuery → SQL aggregate log:
  - "Count error theo endpoint trong 1h qua, group by error code"
  - "Top 10 shopId gặp 500 nhiều nhất hôm nay"
- Trả lời câu hỏi phức tạp mà Logs Explorer không làm nổi.

#### 7. **Dynamic log level / debug flag**
- Có sẵn env var `LOG_LEVEL` → set `DEBUG` cho 1 revision → redeploy chỉ revision đó (không cần code change).
- Hoặc dùng feature flag: bật `enableVerboseLogging` cho 1 shopId cụ thể → log chi tiết chỉ cho shop đó.

#### 8. **Replay request** (nếu là idempotent)
- Lưu raw request webhook Shopify → replay vào staging với hệ thống vừa được instrumented thêm.
- Quan trọng: phải có cơ chế **idempotency** trước, không thì replay = double charge.

#### 9. **Heap dump / CPU profile** (Cloud Profiler)
- Memory leak nghi ngờ? → Cloud Profiler chụp snapshot heap on-the-fly mà không restart service.
- So sánh snapshot trước & sau memory tăng → object nào không free.

#### 10. **Canary / shadow traffic** để test fix
- Có fix nhưng sợ sai? → deploy revision mới với traffic split 1% → coi metric → tăng dần.
- Hoặc **shadow**: gửi traffic giả lập song song không ảnh hưởng user.

### E. Symptom → Action cheat sheet (production)

| Triệu chứng | Bước 1 (mitigate) | Bước 2 (diagnose) |
|------------|---------------------|---------------------|
| **5xx spike ngay sau deploy** | Rollback revision Cloud Run | So diff revision mới vs cũ, đọc Error Reporting cho exception mới |
| **Latency spike, không có deploy** | Scale up instance / tăng concurrency limit | Cloud Trace coi service nào chậm; check Firestore latency metric |
| **1 merchant kêu lỗi, các merchant khác OK** | Workaround thủ công cho merchant đó | Filter log `shopId=X`; coi data shop có gì khác (volume, config, feature flag) |
| **Webhook miss, data inconsistent** | Backfill thủ công từ Shopify API | Check Pub/Sub dead-letter queue + audit log Firestore |
| **Memory leak, OOM** | Tăng memory limit Cloud Run tạm | Cloud Profiler heap snapshot; compare revisions |
| **3rd-party API down (Shopify, Stripe)** | Bật circuit breaker / queue retry | Check status page, retry policy, fallback path |
| **Sporadic bug, không pattern** | (chưa rõ impact thì chưa mitigate) | Query log đủ lâu để tìm pattern (time of day? region? shop type?) |
| **Data corruption** | **Stop writes** ngay, freeze, snapshot | Audit log Firestore — ai ghi cái gì lúc nào |

### F. Câu hỏi tốt khi debug production

- *Bug bắt đầu **lúc nào**? Khớp với deploy/release nào? Khớp với event ngoài nào (sale, traffic spike)?*
- *Bao nhiêu **% request** lỗi? 100% hay 0.1%? Pattern nào (user nào, region, version)?*
- *Có **mitigation tạm** nào áp dụng được trong **<5 phút** không?*
- *Bug **có đang gây mất data** không? Nếu có → stop writes trước.*
- *Tôi có **đủ observability** để chẩn đoán không? Nếu không → bug này là bài học: thêm gì lần sau?*
- *Nếu rollback, có **mất feature mới** nào critical không?*

### G. Anti-pattern đặc trưng production

| Bẫy | Hậu quả | Fix mindset |
|-----|---------|-------------|
| **Debug bằng cách deploy thêm log** | Mỗi cycle deploy 10p, user chịu lỗi cộng dồn | Học query log đã có; dynamic log level |
| **Forensic mà không mitigate** | Hiểu rõ root cause sau 2h nhưng user đã rời app | Rollback trước, RCA sau |
| **Fix forward** thay vì rollback | Fix vội → bug mới chồng bug cũ | Revert luôn nếu chưa rõ root cause trong 10p |
| **Không có trace ID** | 1 merchant report bug → đào log như mò kim đáy bể | Setup correlation ID trước khi cần |
| **Log free text, không structured** | Filter / aggregate gần như impossible | JSON log từ ngày đầu |
| **Log secret/PII vào prod** | Compliance breach, có thể bị fine | Hash / redact trước khi log |
| **Setup observability sau khi có incident** | Incident lần 2 mới đủ data | Đầu tư observability là **investment**, không phải overhead |

---

## 🪤 Anti-pattern (bẫy thường gặp)

| Bẫy | Triệu chứng | Fix mindset |
|-----|-------------|-------------|
| **Shotgun debugging** | Sửa lung tung 5-6 chỗ cùng lúc, "đoán xem cái nào ăn" | Change one thing at a time |
| **Confirmation bias** | Chỉ tìm bằng chứng cho giả thuyết của mình, bỏ qua phản chứng | Cố tình tìm bằng chứng **phản** giả thuyết |
| **It works on my machine** | Stop investigation khi local OK | Repro environment khác mới là thật |
| **Cargo cult fix** | "Thêm `await` là hết" mà không hiểu vì sao | Hỏi: bug đã GỌI là gì, fix CHỮA điều gì, có khớp không |
| **Premature fix** | Sửa khi chưa hiểu root cause | Inspect first, squash later (Julia Evans) |
| **"Không thể nào"** | Loại trừ khả năng dựa trên niềm tin, không phải test | "Không thể nào" là nơi bug đang nấp |
| **Tunneling** | Chôn chân 3h vào 1 hướng sai | Set timer 30p, không tiến → đổi cách |
| **Skip cơ bản** | Bỏ qua "check the plug" (đúng branch? service chạy? env đúng?) | Always check basics trước, dù tự ái |

---

## 📋 Checklist trước khi hỏi/escalate (treo bàn)

- [ ] Reproduce được local chưa? Repro steps tối thiểu?
- [ ] Đọc **toàn bộ** error message + stack trace chưa?
- [ ] Search exact error message trên Slack/Google/Sentry chưa?
- [ ] Đã `git log` xem có ai đụng vùng code này gần đây không?
- [ ] Đã verify input thực sự là cái tôi nghĩ chưa? (log ra xem)
- [ ] Đã đổi 1 biến / lần chưa, hay đang đổi 5 chỗ?
- [ ] Đã có giả thuyết cụ thể chưa, hay chỉ "không hiểu sao"?
- [ ] Bug này tôi từng gặp dạng tương đồng ở đâu chưa?
- [ ] Đã thử giải thích cho rubber duck / Claude chưa?

---

## 🎯 Bài tập training (gợi ý cho buổi tuần sau)

### Exercise 1 — Repro & minimize (30p)
- Đưa 1 bug report mơ hồ: *"Loyalty point không cộng cho merchant X"*.
- Team chia nhóm, mỗi nhóm trong 20p phải:
  1. Liệt kê 10 câu hỏi cần hỏi merchant/code để pin down bug.
  2. Đề xuất repro steps tối thiểu nhất.
- Discuss câu hỏi của ai loại được nhiều khả năng nhất.

### Exercise 2 — Hypothesis tree (20p)
- Cho 1 bug thực tế (vd: "API GET /rewards thi thoảng trả empty array dù DB có data").
- Team vẽ cây giả thuyết:
  - Mỗi node = 1 hypothesis cụ thể.
  - Mỗi nhánh = 1 test loại trừ.
- Đánh giá: nhánh nào loại nhiều khả năng nhất với chi phí test thấp nhất → đi nhánh đó trước.

### Exercise 3 — Rubber duck thực hành (15p)
- Cặp 2 người, A giải thích 1 đoạn code mình viết tuần qua cho B.
- B chỉ được hỏi *"Tại sao chỗ này lại thế?"* — không gợi ý fix.
- A có quyền dừng giải thích nếu "thấy ngay vấn đề".
- Discuss: ai tìm ra bug/lỗ hổng từ chính code mình?

### Exercise 4 — Bug postmortem 5 Whys (20p)
- Pick 1 bug production gần đây trong Joy.
- Team chạy 5 Whys live trên whiteboard.
- Xem đến why thứ 4-5 có chạm đến **process / design** không, hay vẫn dừng ở "code sai".

### Exercise 5 — Asking-question audit (15p)
- Team chia sẻ 1 câu hỏi mình từng hỏi trong Slack tuần qua.
- Cùng rewrite theo template Context-Expected-Actual-Tried-Hypothesis-Ask.
- So sánh: câu hỏi nào lẽ ra senior trả lời được trong 1 dòng?

### Exercise 6 — Production incident simulation (30p)
- Giả định 1 incident thực tế: *"5 phút trước, 30% request `/api/rewards/redeem` trả 500. Vừa deploy revision mới 10 phút trước. Slack đang flood report từ merchant."*
- Team chia 2 vai: **Incident Commander** + **Investigator**.
- Trong 15 phút phải:
  1. Quyết định mitigate gì **đầu tiên** (và vì sao).
  2. Viết query Cloud Logging để pull error log của revision mới.
  3. Quyết định khi nào dừng tìm root cause để rollback, khi nào kiên trì điều tra.
  4. Báo cáo impact cho stakeholder (1 câu, không jargon).
- Discuss: ai mitigate trước, ai cố hiểu root cause trước? Ai đúng?

### Exercise 7 — Observability gap audit (20p)
- Mỗi dev pick 1 endpoint / job mình owner.
- Tự trả lời:
  - Nếu endpoint này lỗi 5xx, mình **biết** trong bao lâu? Bằng cách nào?
  - Mình filter được log theo `shopId` không? Theo `requestId` không?
  - Có metric nào báo latency p95 / p99 không?
  - Nếu 1 merchant kêu "lúc 14:32 hôm qua tôi bị lỗi", mình tìm được trace tương ứng trong **<5 phút** không?
- Liệt kê 3 gap lớn nhất → tạo ticket bổ sung observability.

---

## 🔗 Liên quan

- [[System Thinking]] — nhìn cả hệ thống chứ không chỉ file lỗi
- [[Failure-first Thinking]] — nghĩ trước cách hệ thống sẽ hỏng
- [[Logging Thinking]] — log để debug được, không phải log cho có
- [[Reading Code Thinking]] — đọc code để hiểu mental model hệ thống
- [[Consistency Thinking]] — bug phân tán thường là consistency issue

---

## 📚 Tham khảo (nguồn gốc & đọc sâu)

### Sách (must-read)
- **David J. Agans — [*Debugging: The 9 Indispensable Rules*](https://www.amazon.com/Debugging-Indispensable-Software-Hardware-Problems/dp/0814474578)** — kinh điển, ngắn (180 trang), 9 rule + war story. ([Tóm tắt embedded artistry](https://embeddedartistry.com/blog/2017/09/06/debugging-9-indispensable-rules/))
- **Julia Evans — [*The Pocket Guide to Debugging*](https://wizardzines.com/zines/debugging-guide/)** — 47 chiến lược, dạng zine dễ đọc.
- **Andreas Zeller — *Why Programs Fail*** — academic, deep dive về systematic debugging + delta debugging.

### Articles
- [A Debugging Manifesto — Julia Evans](https://jvns.ca/blog/2022/12/08/a-debugging-manifesto/) — 8 niềm tin cốt lõi khi debug.
- [A systematic approach to debugging — Nicole Tietz-Sokolskaya](https://ntietz.com/blog/how-i-debug-2023/) — quy trình 6 bước hypothesis-driven.
- [The Debugging Mindset — Martin Garramon (Medium, 03/2026)](https://medium.com/@martin_50671/the-debugging-mindset-why-the-best-problem-solvers-think-like-engineers-cdbc64bc9bc3) — mindset của engineer.
- [Systematic debugging skill — obra/superpowers](https://github.com/obra/superpowers/blob/main/skills/systematic-debugging/SKILL.md) — skill prompt cho AI agent debug.

### Kỹ thuật cụ thể
- [Rubber Duck Debugging — psychology](https://www.thoughtfulcode.com/rubber-duck-debugging-psychology/) — vì sao nói ra lại tìm thấy bug.
- [Five Whys Root Cause Analysis (FlowFuse, 2026)](https://flowfuse.com/blog/2025/12/five-whys-root-cause-analysis-definition-examples/) — áp dụng trong software postmortem.
- [git-bisect Documentation](https://git-scm.com/docs/git-bisect) — binary search commit history.
- [Debugging with git bisect — Graphite](https://graphite.com/guides/git-bisect-debugging-guide) — workflow + ví dụ thực tế.

### Asking questions
- [How to Ask Effective Questions — freeCodeCamp](https://www.freecodecamp.org/news/asking-effective-questions-a-practical-guide-for-developers/) — Read-Search-Ask model.
- [How to ask senior engineers good questions — DEV](https://dev.to/alexkhantreras/how-to-ask-senior-engineers-good-questions-1jaf) — template + ví dụ.
- [Don't Be "Too Senior" to Ask — DEV](https://dev.to/gramli/echoes-of-experience-dont-be-too-senior-to-ask-4ake) — senior cũng nên hỏi.

### Production debug & observability
- [Google SRE Workbook — Incident Response](https://sre.google/workbook/incident-response/) — "mitigate before diagnose", rollback first.
- [Google SRE Book — Emergency Response](https://sre.google/sre-book/emergency-response/) — chương về incident handling.
- [Three Pillars of Observability — IBM](https://www.ibm.com/think/insights/observability-pillars) — logs / metrics / traces phối hợp.
- [Logging và viewing logs trong Cloud Run](https://cloud.google.com/run/docs/logging) — official docs, Logs Explorer cú pháp.
- [Error Reporting trong Cloud Run](https://cloud.google.com/run/docs/error-reporting) — auto detect exception từ stderr.
- [Google Cloud Trace, Debug, Error Reporting workflow](https://hilliao.medium.com/google-cloud-trace-debug-error-reporting-7b6d293bc1a9) — setup trace context.
- [Tracing Firestore Queries với Cloud Audit Logs](https://www.devoteam.com/expert-view/tracing-firestore-queries-a-step-by-step-guide-for-google-cloud-audit-logs-and-log-analytics/) — debug data layer.
- [OpenTelemetry log-trace correlation](https://oneuptime.com/blog/post/2026-02-06-otel-log-trace-correlation-debug-errors/view) — debug bug không cần reproduce local.
- [Structured Logging in Node.js — From console.log to Production Observability](https://dev.to/axiom_agent/structured-logging-in-nodejs-from-consolelog-to-production-observability-456h) — JSON log, correlation ID pattern.
- [Beyond console.log — AppSignal](https://blog.appsignal.com/2025/07/09/beyond-console-log-smarter-debugging%20with-modern-javascript-tooling.html) — modern JS debug tooling cho production.

---

## 💡 Hai câu nhớ duy nhất nếu chỉ được nhớ

**Khi debug local:**
> **"Bug không phải lỗi cần sửa nhanh — bug là chỗ mental model của bạn sai với hệ thống. Lấy data trước, đoán sau, đổi 1 biến / lần, verify fix bằng cách phá lại."**

**Khi debug production:**
> **"Mitigate trước, diagnose sau. Khi không thể `console.log` rồi reload, observability bạn đầu tư từ trước là tài sản duy nhất. Bug 15 phút sau deploy = rollback, không hỏi."**
