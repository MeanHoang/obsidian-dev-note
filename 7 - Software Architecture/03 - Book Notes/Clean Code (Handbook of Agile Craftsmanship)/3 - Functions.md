- **Function là đơn vị tổ chức quan trọng nhất của chương trình**
- **Function khó đọc vì làm quá nhiều việc, nhiều mức trừu tượng**
- **Refactor bằng cách tách hàm + đặt tên tốt → code dễ hiểu ngay**
### 🔴 Vấn đề của function dài 
- Quá **dài**
- Nhiều **if lồng nhau**
- Trộn **logic nghiệp vụ + chi tiết kỹ thuật**
- Có **magic string**, API lạ [[Terminology]]
- Đọc 3 phút vẫn **không hiểu đang làm gì**
👉 Người đọc phải **suy luận**, không phải **được kể chuyện**
### ✅ Function tốt trông như thế nào?
- **Ngắn**
- **Tên nói lên mục đích**
- Mỗi dòng gọi 1 hàm có ý nghĩa rõ:
- Đọc **từ trên xuống như kể chuyện**
- Không cần hiểu chi tiết vẫn biết
### 🔑❝ Function tốt là function **truyền đạt ý định**, không phải thuật toán ❞

# Small!
Viết hàm càng nhỏ, càng ngắn nhất có thể 
### 🤔 Vì sao function phải nhỏ?
- Dễ **đọc**
- Dễ **hiểu**
- Dễ **sửa
- Dễ **kể chuyện**
Uncle Bob rút ra điều này **không phải từ lý thuyết**, mà từ **40 năm viết code**, từ:
- Function 3000 dòng ❌
- Function 100–300 dòng ❌
- Function 20–30 dòng 😐
- **Function 2–5 dòng ✅✅✅ (tốt nhất)**
# Blocks and Indenting 
**Hàm nhỏ ⇒ block bên trong cũng phải nhỏ**
### 1️⃣ Block trong `if / else / while / for` nên **chỉ 1 dòng**
✅ Dòng đó **nên là lời gọi hàm**, không phải logic dài:
```js
if (userIsValid())
    processOrder();
```
❌ Tránh:
```js
if (userIsValid()) {
    checkPermission();
    loadData();
    validateData();
    saveResult();
}
```
➡️ Tại sao?
- Giữ function bên ngoài **ngắn**
- Tên hàm bên trong đóng vai trò như **comment sống**
- Đọc code như đọc văn bản
### 2️⃣ Tránh nesting sâu (lồng `if` nhiều cấp)
✅ Quy tắc:
- **Indent (thụt dòng) tối đa: 1–2 cấp**
- Function **không nên chứa logic hình “kim tự tháp”**

# Do One Thing
👉 **Một hàm chỉ nên làm _một việc_**  
Nhưng **“một việc” = một _mức trừu tượng_**, **không phải một dòng code**.
## Hiểu đơn giản
- Tên hàm = **việc lớn**
- Bên trong hàm = **các bước nhỏ hơn đúng 1 level**
- Nếu bên trong có **việc quá chi tiết + việc quá tổng quát trộn lẫn** → ❌ hàm làm nhiều việc
## Quy tắc nhận biết nhanh
👉 **Nếu bạn có thể tách ra một hàm con với tên “có ý nghĩa mới”  
(không chỉ lặp lại code)**  
→ hàm đang làm **nhiều hơn một việc**
### Nhớ 1 câu thôi 👇
> **Một hàm làm một việc khi mọi dòng code trong nó nói về cùng một ý tưởng.**

# Sections within Functions
👉 **Một hàm mà còn chia được thành nhiều “section” (khai báo, khởi tạo, xử lý, …)**  
→ gần như chắc chắn là **đang làm nhiều hơn một việc** ❌
**Hàm làm một việc thì không thể (và không cần) chia section.**
## Vì sao?
- Mỗi section = **một trách nhiệm khác nhau**
    - Khai báo biến
    - Khởi tạo dữ liệu
    - Xử lý logic chính (ví dụ: sieve) [[Terminology]]
- Khi gom tất cả vào 1 hàm → **trộn nhiều mức trừu tượng**

# One Level of Abstraction per Function 
👉 **Muốn hàm chỉ làm “một việc” → tất cả các câu lệnh trong hàm phải ở CÙNG MỘT MỨC TRỪU TƯỢNG (level of abstraction).**
## Level of abstraction là gì? (hiểu đơn giản)
- **Mức cao**: nói về _ý nghĩa_, _mục đích_
- **Mức thấp**: nói về _chi tiết kỹ thuật_
### 3 mức trừu tượng cơ bản (dễ nhớ)
#### 🟢 MỨC CAO – Ý nghĩa / Business logic
📌 Trả lời câu hỏi: _Chương trình đang làm gì?_
```js
validateUser()
calculateTotalPrice()
renderPage()
sendEmail()
```
✅ Đọc như **tiêu đề câu chuyện**
#### 🟡 MỨC TRUNG BÌNH – Cách thực hiện
📌 Trả lời: _Làm việc đó bằng cách nào (ở mức tổng quát)_
```js
user.isActive()
order.items.length
html = template.render(data)
```
#### 🔴 MỨC THẤP – Chi tiết kỹ thuật
📌 Trả lời: _Chi tiết máy móc làm ra sao_
```js
for (let i = 0; i < items.length; i++)
.append("\n")
if (x == null)
```
#### Quy tắc VÀNG (rule of thumb)
**Trong 1 hàm, mỗi dòng code phải trả lời cùng một kiểu câu hỏi**

| Nếu dòng này trả lời…       | Thì tất cả dòng khác phải trả lời… |
| --------------------------- | ---------------------------------- |
| “Chương trình đang làm gì?” | “Làm gì?”                          |
| “Làm thế nào?”              | “Làm thế nào?”                     |
| “Chi tiết máy móc?”         | “Chi tiết máy móc?”                |
# Reading Code from Top to Bottom: _The Stepdown Rule_
Cái này chủ yếu nói khi đọc code từ trên xuống dưới thì nó như 1 câu chuyện lần lượt ko bị ví dụ nhảy từ ý nghĩa cao đến chi tiết máy móc 
Giống như đọc sách:
Chương → Mục → Ý → Chi tiết
Hãy đọc code như các đoạn văn bắt đầu bằng **“TO …”**
TO render page
  TO include setups and teardowns
    TO include setups
      TO include suite setup
        TO find SuiteSetup page
👉 Mỗi dòng = một hàm  
👉 Mỗi hàm = 1 mức trừu tượng
Dấu hiệu code đang ĐÚNG Stepdown Rule
✔ Đọc từ trên xuống **không cần cuộn lại**  
✔ Mỗi hàm gọi các hàm **tên rõ nghĩa**  
✔ Không có `.append`, `for`, `if null` trong hàm mức cao  
✔ Hàm trên **không biết chi tiết bên dưới**
# Switch Statements
👉 **Switch / if–else gần như luôn là code xấu** nếu dùng trực tiếp trong business logic
Vì:
- ❌ Khó làm nhỏ
- ❌ Luôn làm **N việc**
- ❌ Vi phạm Clean Code & SOLID
👉 **Không cấm switch**, nhưng:
	✅ Switch **chỉ nên xuất hiện 1 lần**  
	✅ Dùng **để tạo object**  
	✅ Bị “giấu” phía sau **đa hình (polymorphism)**
### 1️⃣ Thực tế: Business logic LUÔN có điều kiện
Ví dụ app:
- User: free / pro / enterprise
- Feature: bật / tắt
- Country khác → luật khác
- Khách A muốn custom riêng
👉 **Không có app nào không có if**
✅ **IF để kiểm tra TRẠNG THÁI là hoàn toàn OK**
### 2️⃣ Vấn đề KHÔNG phải là `if`
## 👉 Mà là **if dùng để chọn HÀNH VI**
❌ Ví dụ sai (kinh điển)
```js
function calculatePrice(order, user) {
  if (user.type === 'FREE') {
    return order.total;
  } else if (user.type === 'PRO') {
    return order.total * 0.9;
  } else if (user.type === 'ENTERPRISE') {
    return customContractPrice(order);
  }
}
```
✅ Đúng nghiệp vụ  
❌ Sai kiến trúc
### 3️⃣ Vì sao đoạn trên nguy hiểm?
### ❌ Khi thêm biến thể mới
- VIP
- Student
- Partner
👉 Code **phình tuyến tính**  
👉 Mỗi function phải sửa lại
### 4️⃣ Vậy xử lý “custom riêng” KIỂU GÌ?
#### ✅ Cách đúng: **IF chọn cấu hình — Object xử lý hành vi**
### 🧠 Tư duy chuẩn Clean Code
❌ IF quyết định **làm gì**
✅ IF quyết định **dùng ai làm**
#### ✅ Nguyên tắc
IF **chỉ để chọn handler**, không xử lý nghiệp vụ
#### ✅ Cách xử lý: [[Strategy]] Pattern (JS thuần, dễ hiểu)
#### 1️⃣ Mỗi loại user = 1 cách tính
```js
const pricingStrategies = {
  FREE: (order) => order.total,
  PRO: (order) => order.total * 0.9,
  ENTERPRISE: (order) => customContractPrice(order),
};
```
### 2️⃣ Business logic gọn lại
```js
function calculatePrice(order, user) {
  const strategy = pricingStrategies[user.type];
  return strategy(order);
}
```
✅ Hết if–else  
✅ Dễ thêm loại mới  
✅ Code **đọc như cấu hình**

# Use Descriptive Names 
Cơ bản đọc lại phần 1 chủ yếu nói về cách đặt tên thui
# Function Argument 
Nên hạn chế đối số nhiều nhất có thể nên là từ 1-3
Nếu hàm có 3 đối số nên hạn chế dùng nó ở mức thấp nhất
### ❌ Khó đọc
### ❌ Arguments làm test khó hơn rất nhiều 😵
### ❌ Output argument (rất khó hiểu)
# Tóm tắt gọn để nhớ
✅ Ít argument = code dễ đọc  
✅ 0–1 argument là lý tưởng  
✅ Tránh >2 arguments  
✅ Tránh output argument  
✅ Argument = **ý nghĩa**, không phải **chi tiết kỹ thuật**
Nói chung nhiều không sai chỉ là hơi nguy hiểm nếu cần check nhiều ảnh hưởng đến rule. Vì cứ thêm 1 param là thêm 1 ảnh hưởng tới hàm mà nên là nên hạn chế
#### ?? Vậy trong quá trình phát triển cần truyền thêm tạo thêm params thì sao nhỉ 
Vì **rule luôn thay đổi**, mà **thêm rule = thêm params** → code to dần → khó giữ clean.
# ✅ TƯ DUY ĐÚNG KHI “THÊM RULE = THÊM PARAM”
 ❌ Sai tư duy: _“Rule mới → thêm param cho hàm”_  
✅ Đúng tư duy: _“Rule mới → thêm hành vi / object / chiến lược”_
## 1️⃣ Dấu hiệu ĐỎ: bạn sắp làm code bẩn
Nếu bạn thấy code bắt đầu như thế này 👇
```js
calculatePrice(order, user, isVip)
```
rồi thành:
```js
calculatePrice(order, user, isVip, hasCoupon)
```
rồi nữa:
```js
calculatePrice(order, user, isVip, hasCoupon, campaign)
```
🚨 **STOP**  
🚨 Bạn đang “bơm rule vào param”  
🚨 Function đang ceasing doing “one thing”
## 2️⃣ Case 1: Rule liên quan đến _cùng một concept_
👉 **Gom thành object (Parameter Object Pattern)** ✅
### ✅ tốt
```js
calculatePrice(order, pricingContext)
const pricingContext = {
  userType: 'PRO',
  hasCoupon: true,
  region: 'EU'
}
```
✅ Vẫn là **monadic function**  
✅ Dễ mở rộng  
✅ Không phá hàm cũ
## 3️⃣ Case 2: Rule làm thay đổi hành vi (🚨 nguy hiểm nhất)
👉 **DÙNG [[STRATEGY]] / POLYMORPHISM** tách hàm ra riêng lớn để control
### ❌ business if–else
```js
if (user.type === 'PRO') {
  price *= 0.9;
} else if (user.type === 'ENTERPRISE') {
  price = customContractPrice(order);
}
```
### ✅ clean
```js
pricingStrategy.calculate(order)
const strategies = {
  FREE: new FreePricing(),
  PRO: new ProPricing(),
  ENTERPRISE: new EnterprisePricing()
}
```
➡️ **Rule mới = class mới**  
➡️ KHÔNG sửa calculatePrice()
## 4️⃣ Case 3: Rule bật/tắt logic (feature flag)
👉 **Dùng Rule Object / Policy**
### ❌ thêm param
```js
calculatePrice(order, user, enableNewDiscount)
```
### ✅ đúng
```js
calculatePrice(order, pricingPolicy)

pricingPolicy.apply(price)
```
✅ Logic nằm bên TRONG policy  
✅ Hàm chính không đổi
# Common Monadic Forms
Ko có gi mới mẻ hết như trên 
# Flag Arguments
**Truyền boolean vào hàm = dấu hiệu đỏ 🚨**
Vì nó **nói to** rằng:  
👉 “Hàm này đang làm nhiều hơn _một việc_”
Cái này cx còn tuỳ vào trường hợp không phải tất cả đều đúng á
# Dyadic Functions
**Càng nhiều tham số → hàm càng khó đọc, khó hiểu, dễ bug**
Cũng ko có gì hot
# Triads
Cũng ko có gì hot
# Argument Objects
👉 Nói chung đây nói hàm nhiều tham số nên warp thành 1 object 
# Argument Lists
Tóm tắt là `...args` được coi là **1 argument duy nhất**, giữ nguyên nguyên tắc.
# Verbs and Keywords
💡 **Tóm tắt:**
- Tên hàm nên **miêu tả hành động + đối tượng**.
- Với nhiều tham số, **keyword form** giúp tránh nhầm lẫn thứ tự.
- Càng rõ ràng, càng dễ đọc, dễ maintain, và dễ test.
# Have No Side Effect
💡 **Tóm tắt:**
- Side effect là **một loại lời nói dối của hàm**.
- Gây ra **temporal coupling** → khó debug & test.
- Nếu bắt buộc, **đặt tên hàm sao cho side effect rõ ràng**.
- Clean code = hàm **nhỏ, rõ ràng, làm một việc, không thay đổi trạng thái ẩn**
# Output Arguments [[Terminology]]
**Output argument** Là khi bạn truyền 1 biến vào và hàm thay đổi trực tiếp biến đố thay vì trả giá trị 
```js
function appendFooter(report) {
  report.text += " Footer";  // report là output argument
}

const myReport = { text: "Report" };
appendFooter(myReport);

console.log(myReport.text); // "Report Footer"
```
## Tại sao output arguments xấu?
1. **Khó đọc / gây nhầm lẫn**
    - Khi bạn đọc `appendFooter(myReport)` → bạn không biết `myReport` là input hay output.
    - Phải nhìn declaration (`void appendFooter(StringBuffer report)`) mới hiểu.
    - Mỗi lần phải check hàm → **cognitive break**, gián đoạn suy nghĩ.
2. **Side effects tiềm ẩn**
    - Hàm đang làm một việc (appendFooter), nhưng lại **thay đổi trạng thái bên ngoài** → dễ gây lỗi không lường trước.
3. **Khó test**
    - Nếu hàm chỉ thay đổi output argument mà không trả giá trị, bạn phải kiểm tra **biến ngoài** → viết test phức tạp hơn.
## Thay vào đó 
1. Trả giá trị mới 
2. Obj quản lý trạng thái của chính nó 
# Command Query Separation 
À đây tác giả đang nói về **Command–Query Separation (CQS)** trong clean code:
- **Command**: làm gì đó → thay đổi trạng thái, **không trả về giá trị quan trọng**.
- **Query**: trả về thông tin → không làm thay đổi trạng thái.
**Một function nên hoặc là command, hoặc là query, nhưng không phải cả hai.**
#  Prefer Exceptions to Returning Error Codes
Tóm lại **thay vì trả về giá trị đặc biệt để báo lỗi (error code), hãy ném ra một exception**. Đây là cách clean code khuyên vì nó làm code dễ đọc, dễ bảo trì hơn.
- Nếu xảy ra lỗi, **ném exception**.
- **Caller** chỉ lo xử lý lỗi khi cần (`try/catch`).
Đúng, về nguyên tắc **clean code** thì thường áp dụng như sau:
### 1️⃣ Nơi nên `throw`
- **Hàm cấp thấp nhất (low-level / core function)** phát hiện ra lỗi nghiêm trọng nên **throw**.
- Không cố gắng handle lỗi ở mức quá chi tiết trừ khi bạn biết cách “khôi phục” (recover) ngay tại chỗ.
### 2️⃣ Nơi nên `try...catch`
- **Hàm cấp cao hơn (caller / business logic / UI)** chịu trách nhiệm **xử lý lỗi**.
- Ở đây bạn có thể:
    - Log lỗi
    - Show message cho user
    - Thực hiện fallback logic
### 3️⃣ Nguyên tắc chính
- **Throw ở nơi phát hiện lỗi.**
- **Catch ở nơi xử lý lỗi.**
- Không dùng try...catch ở mọi cấp, chỉ catch khi bạn thực sự **biết cách xử lý**.
- Đừng dùng try...catch để “bịt lỗi” mà không xử lý, sẽ dễ tạo **bug ẩn**.
### 4️⃣ Bonus: Propagate
- Lỗi có thể đi qua nhiều hàm trung gian mà không try...catch.
- Chỉ catch khi cần hành động, các hàm trung gian có thể để throw tiếp.
# Extraction Try/Catch Blocks
- **Hàm core**: throw error khi gặp vấn đề.
- **Hàm wrapper / UI / service**: try/catch, gọi các helper function riêng biệt.
- Không nhồi try/catch trực tiếp vào logic chính.
# Error Handling Is One Thing 
Ý của đoạn này là:
- **Nguyên tắc “Một hàm chỉ làm một việc”** cũng áp dụng cho việc xử lý lỗi
- Nếu một hàm **dành riêng để xử lý lỗi**, thì **hàm đó không nên làm bất kỳ công việc chính nào khác** (như tính toán, update dữ liệu…).
- **Cách sắp xếp:** nếu hàm có `try`, thì `try` nên **xuất hiện đầu tiên trong hàm**, và sau `catch`/`finally` **không nên có logic khác**.
# Dont Repeat Yourself
- Nếu một thuật toán được viết nhiều lần ở các vị trí khác nhau, ví dụ: `SetUp`, `SuiteSetUp`, `TearDown`, `SuiteTearDown` → như trong đoạn trích.
- Vấn đề:
    1. **Code bloated**: Code dài hơn, khó đọc.
    2. **Hard to maintain**: Nếu thuật toán thay đổi, bạn phải sửa **tất cả các chỗ** → dễ quên → lỗi.
    3. **Error of omission**: Khi sửa một chỗ mà quên các chỗ khác → lỗi logic.
### Cách xử lý (Reduce duplication)
- **Đưa code trùng lặp vào một hàm riêng**:
- Giờ nếu logic thay đổi, bạn chỉ sửa **1 chỗ duy nhất** → dễ bảo trì.
- Tác giả nói: **Duplication may be the root of all evil in software.**
    - Nhiều nguyên tắc ra đời để loại trừ duplication:
        - **Database normalization** → loại trùng lặp dữ liệu.
        - **OOP** → tập trung code chung vào **base class**.
        - **Structured/Aspect/Component Oriented Programming** → giảm duplication logic.
- Nói cách khác, **từ khi có subroutine/function**, các phương pháp phát triển phần mềm luôn tìm cách giảm trùng lặp.
# Structured Programming 
### ✔ Function nhỏ (khuyến khích)
- Dùng nhiều return → OK
- Dùng break/continue → OK
- Không cần tuân theo strict structured programming
### ✖ Function lớn (không khuyến khích)
- Nếu phải dùng nhiều return → dễ loạn → nên refactor
- break/continue → dễ lạc luồng
# How Do You Write Functions Like This
### 🧠 Clean Code KHÔNG YÊU CẦU bạn viết sạch từ đầu
Clean Code yêu cầu:
1. **Viết code chạy được trước**
2. **Có test bảo vệ** (unit test)
3. **Refactor liên tục**
    - Tách function nhỏ
    - Đổi tên cho rõ nghĩa
    - Xoá duplication
    - Tách class cho hợp lý
    - Sắp xếp lại order
4. **Không làm vỡ logic (test vẫn pass)**
Đây chính là quy tắc của:
- TDD
- Refactoring
- Martin Fowler
- Clean Code
- Clean Architecture
# Conclusion 

