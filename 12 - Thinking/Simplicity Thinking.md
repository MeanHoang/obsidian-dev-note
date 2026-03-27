![[Pasted image 20260327134553.png]]

## 🧠 Simplicity Thinking là gì?

> [!quote] 💬
> *"Simplicity is the ultimate sophistication."* — Leonardo da Vinci
> Đơn giản không phải là thiếu năng lực — mà là **đỉnh cao của sự tinh gọn**.

Simplicity Thinking là tư duy **luôn ưu tiên giải pháp đơn giản nhất** mà vẫn giải quyết được vấn đề. Trong software engineering, nó nghĩa là:
- Viết code mà **người khác đọc hiểu ngay**, không cần giải thích
- Chọn architecture **vừa đủ** cho bài toán hiện tại, không over-engineer
- Mỗi khi muốn thêm gì đó, hỏi: **"Bỏ nó đi có sao không?"** — nếu không sao thì bỏ

> [!note] 📝 So sánh dễ hiểu
> Code phức tạp giống như viết văn dài dòng — người đọc phải đọc 3 lần mới hiểu.
> Code đơn giản giống như viết ngắn gọn súc tích — đọc 1 lần là hiểu ngay ý.
> **Viết ngắn khó hơn viết dài** — simplicity đòi hỏi suy nghĩ nhiều hơn, không phải ít hơn.

> [!warning] ⚠️ Đơn giản ≠ Dễ dãi
> Simplicity không phải là cắt corner, bỏ qua error handling, hay hardcode cho nhanh.
> Simplicity là **tìm ra cách giải quyết gọn gàng nhất mà vẫn đúng, vẫn đủ**.

---
## 📈 Simplicity is Scalability
Hệ thống đơn giản mới scale được. Hệ thống phức tạp — càng scale càng vỡ.

> [!note] 📝 So sánh dễ hiểu
> Hệ thống phức tạp giống như **cục dây điện rối** — thêm 1 sợi dây nữa là cả cục cháy.
> Hệ thống đơn giản giống như **ổ cắm gắn ray** — cần thêm thì cắm vào, cần bớt thì rút ra.

Tại sao đơn giản = scale được?

| Phức tạp | Đơn giản |
|---|---|
| Thêm feature mới → sợ break cái cũ | Thêm feature mới → thêm vào, không ảnh hưởng cái khác |
| Onboard dev mới → mất 2 tuần đọc code | Onboard dev mới → đọc 1 ngày là contribute được |
| Debug → phải hiểu 10 layer abstraction | Debug → đọc thẳng vào chỗ lỗi |
| Scale team → mọi người block nhau | Scale team → mỗi người làm phần của mình |
| Thay đổi 1 chỗ → domino effect khắp nơi | Thay đổi 1 chỗ → chỉ ảnh hưởng chỗ đó |

> [!tip] 💡
> **Complexity không scale linearly — nó scale exponentially.**
> 10 module đơn giản dễ quản lý hơn 5 module phức tạp đan xen nhau.

> [!quote] 💬
> *"The cheapest, fastest, and most reliable components are those that aren't there."* — Gordon Bell
> Component rẻ nhất, nhanh nhất, đáng tin nhất — là component **không tồn tại**.

---

## 🧭 Các nguyên tắc giữ hệ thống luôn rõ ràng

### 1️⃣ KISS — Keep It Simple, Stupid
Luôn chọn cách làm đơn giản nhất mà vẫn đúng.
- Đừng dùng design pattern chỉ vì "nghe pro" — dùng khi nó **thật sự giải quyết vấn đề**
- 3 dòng if/else rõ ràng tốt hơn 1 abstraction mà phải mở 5 file mới hiểu
```
// ❌ Over-engineered
const strategy = StrategyFactory.create(type)
const result = strategy.execute(data)

// ✅ Simple - khi chỉ có 2-3 case
if (type === "email") sendEmail(data)
else if (type === "sms") sendSms(data)
```

### 2️⃣ YAGNI — You Aren't Gonna Need It
Không build cái chưa cần. **80% các feature "phòng trường hợp" sẽ không bao giờ được dùng.**
- Đừng tạo abstraction cho 1 use case duy nhất
- Đừng thêm config cho thứ chưa ai yêu cầu thay đổi
- Đừng design cho "nếu sau này cần..." — khi nào cần thì refactor

> [!note] 📝 So sánh dễ hiểu
> YAGNI giống như **đi du lịch 3 ngày mà mang vali cho 3 tuần** — nặng, chậm, mà phần lớn đồ không dùng đến.

### 3️⃣ Single Responsibility — Mỗi thứ làm 1 việc
- 1 function → 1 nhiệm vụ
- 1 module → 1 mục đích
- 1 service → 1 domain
Nếu giải thích function mà phải dùng chữ **"và"** → nên tách ra.
```
// ❌ Làm 2 việc
function validateAndSaveUser(data) { ... }

// ✅ Tách ra
function validateUser(data) { ... }
function saveUser(data) { ... }
```

### 4️⃣ Naming rõ ràng — Code tự giải thích
Tên biến, tên hàm tốt = không cần comment.
```
// ❌ Đọc xong vẫn không hiểu
const d = getData(u, t)

// ✅ Đọc là hiểu ngay
const activeOrders = getOrdersByUser(userId, { status: "active" })
```

> [!tip] 💡
> Nếu bạn phải viết comment để giải thích code đang làm gì → code đó chưa đủ rõ ràng. Comment nên giải thích **tại sao**, không phải **cái gì**.

### 5️⃣ Avoid Premature Abstraction — Đừng trừu tượng quá sớm
- Lần 1: viết thẳng
- Lần 2: thấy lặp, ok chấp nhận
- Lần 3: lặp lại → giờ mới tạo abstraction (Rule of Three)

> [!warning] ⚠️
> **Wrong abstraction còn tệ hơn duplication.**
> Duplicate code thì copy-paste sửa được. Wrong abstraction thì cả team bị kẹt trong đó, sửa 1 chỗ vỡ 10 chỗ.

### 6️⃣ Delete Code — Xóa không thương tiếc
- Code không dùng → xóa. Git nhớ hết rồi, không mất đâu.
- Feature flag cũ → dọn. Dead code là noise.
- "Để đó phòng khi cần" → không, xóa đi. Khi nào cần thì git checkout lại.

> [!quote] 💬
> *"One of my most productive days was throwing away 1,000 lines of code."* — Ken Thompson
> Một trong những ngày làm việc hiệu quả nhất của tôi là xóa đi 1,000 dòng code.

---

## ⚖️ Khi nào nên Simple, khi nào nên Optimize?

Với 1 người phát triển product, câu hỏi không phải "optimize hay không" mà là **"optimize cái này có đáng không, ở thời điểm này?"**

> [!quote] 💬
> *"Premature optimization is the root of all evil."* — Donald Knuth
> Tối ưu sớm là gốc rễ của mọi vấn đề.

### 🧪 Bài test nhanh: Hỏi 3 câu trước khi optimize

| Câu hỏi | Nếu "Không" → |
|---|---|
| **1. Có user thật đang bị ảnh hưởng không?** | Đừng optimize. Chưa ai đau thì chưa cần thuốc. |
| **2. Có số liệu chứng minh đây là bottleneck không?** | Đừng optimize. Đang đoán mò, không phải engineering. |
| **3. Simple hiện tại có chặn mình ship feature tiếp không?** | Đừng optimize. Simple đang hoạt động tốt, để yên nó. |

Nếu cả 3 câu đều **"Có"** → lúc này mới optimize, và chỉ optimize **đúng chỗ bottleneck**.

### 📊 Thứ tự ưu tiên cho solo/small team

```
Ship được  →  Chạy đúng  →  Chạy nhanh
(simple)      (correct)     (optimized)
```

- **Phase 1: Ship được** — simple code, hardcode nếu cần, monolith, 1 database. Mục tiêu: có user dùng.
- **Phase 2: Chạy đúng** — thêm validation, error handling, test các case quan trọng. Mục tiêu: user tin tưởng.
- **Phase 3: Chạy nhanh** — chỉ khi data/traffic đủ lớn để thấy chậm. Mục tiêu: user không chờ.

> [!warning] ⚠️
> Phần lớn product **chết ở phase 1** vì không ship được — không phải vì chạy chậm.
> Đừng ở phase 1 mà lo chuyện của phase 3.

### 🔍 Ví dụ thực tế

| Tình huống | Simple ✅ | Over-optimize ❌ |
|---|---|---|
| 100 users | SQLite / PostgreSQL đơn | Kubernetes + Redis + Kafka |
| Search sản phẩm | `WHERE name LIKE '%...'` | Elasticsearch cluster |
| Background job | Cron + simple queue | Distributed job system |
| Auth | JWT + 1 bảng users | OAuth server riêng + SSO |
| Deploy | VPS + git pull | CI/CD pipeline 10 bước |

> [!tip] 💡
> **Optimize khi có bằng chứng, không phải khi có lo lắng.**
> 1 người làm product thì thời gian là tài nguyên quý nhất — mỗi giờ optimize là 1 giờ không ship feature.

---

## 🚩 Dấu hiệu của engineer đang phức tạp hóa

### 🔴 Dấu hiệu nguy hiểm
- **"Để mình refactor lại cho clean đã"** — trước khi feature đầu tiên có user dùng
- **Dùng design pattern mà chỉ có 1 implementation** — Factory cho 1 class, Strategy cho 1 case
- **Setup infra trước khi có user** — Kubernetes, microservices, message queue cho MVP
- **Tạo abstraction layer cho mọi thứ** — wrapper cho wrapper, util cho util
- **Tranh luận về tech stack nhiều hơn thời gian code** — 3 ngày chọn framework, 1 ngày code
- **Sợ duplicate code hơn sợ ship trễ** — DRY mù quáng đến mức tạo abstraction không ai hiểu
- **Giải thích architecture mất 30 phút** — cho 1 CRUD app

> [!note] 📝
> Không phải những thứ trên luôn sai — chúng sai **khi dùng ở sai thời điểm**. Kubernetes tuyệt vời cho 1 triệu users, nhưng là over-engineering cho 100 users.

### 🟢 Dấu hiệu của engineer giữ được simplicity
- **Ship nhanh, iterate sau** — v1 xấu nhưng chạy được > v1 đẹp nhưng mãi chưa xong
- **Đọc code là hiểu** — người mới join đọc 1 ngày là làm được
- **Chọn boring technology** — PostgreSQL, Redis, monolith... đã được chứng minh, ít surprise
- **Biết nói "chưa cần"** — "Cái đó hay nhưng chưa cần bây giờ"
- **Xóa code thoải mái** — không bám víu vào code mình viết
- **Giải thích được system trong 5 phút** — nếu không giải thích được → hệ thống quá phức tạp
- **Dùng ít dependency** — mỗi dependency là 1 rủi ro thêm

> [!quote] 💬
> *"A senior engineer's superpower is not knowing more patterns — it's knowing when NOT to use them."*
> Sức mạnh của senior không phải biết nhiều pattern — mà là biết **khi nào KHÔNG dùng** chúng.

> [!tip] 💡 Tự kiểm tra
> Nhìn lại code tuần này, hỏi:
> - Có chỗ nào mình build vì "phòng trường hợp" mà chưa ai yêu cầu không?
> - Có chỗ nào mình tốn hơn 1 ngày mà user không thấy khác biệt không?
> - Nếu xóa 30% code, app có còn chạy đúng không?

![[Pasted image 20260327140528.png]]
