
📌 **Tên trong code quan trọng hơn bạn nghĩ**
# 1. Use Intention-Revealing Names 
💡 Chọn tên tốt mất thời gian, nhưng tiết kiệm thời gian nhiều hơn rất nhiều
##  Một cái tên tốt phải trả lời được 3 câu hỏi
Tên của **biến / hàm / class** phải nói rõ:
1. **Why** – Tại sao nó tồn tại?
2. **What** – Nó làm gì?
3. **How** – Nó được dùng như thế nào?
👉 Nếu **cần comment để giải thích tên**, thì:
> ❌ Tên đó **chưa đạt**
### Example
#### ❌ Bad
`int d; // elapsed time in days`
👉 Comment đang **vá lỗi cho cái tên kém**
#### ✅ Good
`int elapsedTimeInDays;
`int daysSinceCreation;
`int daysSinceModification;
📌 Cùng kiểu dữ liệu  
📌 Nhưng **ý nghĩa hoàn toàn khác → tên phải khác**

### Example “khó hiểu dù code rất đơn giản”
### ❌ Code gốc
```js
public List<int[]> getThem() { 
	List<int[]> list1 = new ArrayList<int[]>();   
	for (int[] x : theList)   
	 if (x[0] == 4)
	  list1.add(x);   
	  return list1;
}
```
👉 Code **không hề phức tạp**, nhưng **rất khó hiểu**

Tại sao nó khó hiểu, không phải vì logic -> mà vì ngử cảnh bị ẩn 
Người đọc phải tự hỏi:
1. `theList` chứa cái gì?
2. `x[0]` có ý nghĩa gì?
3. số `4` là cái gì?
4. Danh sách trả về dùng để làm gì?
📌 Đây gọi là:
> **Implicit code** – code bắt người đọc phải đoán

=> **Chỉ cần đặt lại tên -> code phát sáng**
Giả sử đang làm **game Minesweeper (Game dò mìn)** 
### ✅ Đặt tên lại đúng ngữ cảnh
```java
public List<int[]> getFlaggedCells() {
  List<int[]> flaggedCells = new ArrayList<int[]>();
  for (int[] cell : gameBoard)
    if (cell[STATUS_VALUE] == FLAGGED)
      flaggedCells.add(cell);
  return flaggedCells;
}
```

💡 Điều quan trọng:
- Logic **KHÔNG đổi**
- Số dòng **KHÔNG đổi**
- Độ lồng **KHÔNG đổi**
- Nhưng **đọc là hiểu ngay**
➡️ **Tên đã mang ý nghĩa thay cho comment**
## So sánh trực giác (rất quan trọng)

| Bad Code             | Clean Code      |     |
| -------------------- | --------------- | --- |
| Đoán xem code làm gì | Đọc là hiểu     |     |
| Phụ thuộc comment    | Tên tự nói      |     |
| Dễ sai khi sửa       | Ít bug          |     |
| Sợ đụng vào          | Tự tin refactor |     |
❝ **Vấn đề không phải code phức tạp mà là code không nói rõ ngữ cảnh** ❞
👉 Clean Code không làm code “thông minh hơn”  
👉 Clean Code làm code **trung thực hơn về ý định**

## Checklist khi đặt tên (áp dụng liền)
Trước khi chốt tên, hỏi:
- Người **chưa từng viết** code này có hiểu không?
- Có còn **Magic number số ma thuật** không? [[Terminology]]
- Có phải đọc thêm file khác mới hiểu không?
Nếu có → **đặt tên lại**

# 2. Avoid Disinformation
### False clues – “gợi ý sai” nguy hiểm thế nào?
**False clue** = tên làm người đọc **hiểu sai bản chất của code**
Nếu bạn đang tính **hypotenuse** (cạnh huyền) thì `hp` tưởng chừng hợp lý.  
```java
int hp;
```
Nhưng với programmer:
- `HP` → Hewlett-Packard
- `AIX`, `SCO` → hệ điều hành Unix
👉 **Tên đã mang sẵn ý nghĩa khác trong ngành**, gây nhiễu.
✅ **Bài học:** Đừng dùng từ đã có **nghĩa “mặc định” mạnh** trong ngành cho ý nghĩa khác.

## Đừng nói dối về kiểu dữ liệu
### ❌ Bad
```java
accountList
```
Nhưng thực tế:
- Không phải `List`
- Có thể là `Set`, `Map`, `Array`
📌 Từ **List** có nghĩa rất cụ thể với dev.
✅ Tên tốt hơn:
```java
accounts
accountGroup
accountCollection
```

⚠️ Ngay cả khi nó _thật sự_ là List → Clean Code **vẫn khuyên không nên encode kiểu dữ liệu vào tên** (sẽ học rõ hơn sau).

## Tên giống nhau quá ⇒ tai họa
### ❌ Ví dụ kinh điển
```java
XYZControllerForEfficientHandlingOfStrings
XYZControllerForEfficientStorageOfStrings
```
😵‍💫 Vấn đề:
- Mắt người **không phân biệt nhanh**
- Auto-complete càng làm dev chọn nhầm
✅ **Nguyên tắc**:
> Giống nhau = phải giống **hoàn toàn**  
> Khác nhau = phải khác **rõ ràng**

## Chính tả không nhất quán = thông tin sai
### ❌ Bad 
```java
analyseData() // UK
analyzeData() // US
```
Hoặc:
```java
getUserInfo() // summary user
getUserInformation() // full info
```

👉 Dev nghĩ là khác nhưng thực chất cùng concept
📌 **Consistent naming = thông tin**  
📌 **Inconsistent naming = disinformation**
Và thảm hoạ kinh dị là sài l, 0, O, 1 hạn chế à ko né nó đi nhé

# 3. Make Meaningful Distinctions
Đặt tên chỉ để qua mắt trình biên dịch. Vì trong cùng scope ko đc trùng tên => Dev muốn đặt tên nhanh ví dụ 
```java
klass   // vì class đã bị dùng
custumer // đánh sai customer
```
😱 Hệ quả:
- Sửa chính tả → code **không compile**
- Tên xấu trở thành **phụ thuộc kỹ thuật**
## “Khác tên” ≠ “Khác nghĩa”
Clean Code nhấn mạnh:
 ❝ Nếu tên buộc phải khác, thì **nghĩa cũng phải khác** ❞
❌ Compiler chấp nhận  
❌ Con người thì **không hiểu**

### Number series naming – a1, a2 … là thảm họa
### ❌ Bad
```java
public static void copyChars(char a1[], char a2[]) {
  for (int i = 0; i < a1.length; i++) {
    a2[i] = a1[i];
  }
}
```

👉 Đọc không biết:
- `a1` là gì?
- `a2` để làm gì?
### ✅ Good
```java
public static void copyChars(char source[], char destination[]) {
  for (int i = 0; i < source.length; i++) {
    destination[i] = source[i];
  }
}
```
📌 Không thêm code  
📌 Không thêm comment  
📌 Nhưng ý nghĩa rõ gấp 10 lần

### Noise words – từ rác nguy hiểm
### ❌ Noise words là gì?
Là từ:
- làm **tên khác đi**
- nhưng **không làm nghĩa khác**
Ví dụ điển hình:
- Info
- Data
- Object
- Variable
- Table
### ❌ Ví dụ sai
```java
class Product {}
class ProductInfo {}
class ProductData {}
```
🤔 Khác nhau ở đâu?
Nếu không trả lời được → **tên đang nói dối**

### Đừng thừa thãi: biến không cần tự nói nó là biến
### ❌ Bad
```java
nameString
moneyAmount
customerInfo
accountData
theMessage
```
📌 Vấn đề:
- `String`, `Amount`, `Info`, `Data` → **không thêm thông tin**
- Thậm chí còn gây hiểu nhầm:
    - `moneyAmount` khác `money` chỗ nào?
    - `customerInfo` có phải ít hơn `customer`?
### ✅ Good
```java
name
balance
customer
message
```

### Ví dụ thảm họa thực tế (rất hay gặp)
```java
getActiveAccount();
getActiveAccounts();
getActiveAccountInfo();
```
💥 Dev mới vào team sẽ:
- Gọi nhầm
- Sửa nhầm
- Debug trong tuyệt vọng
👉 Vì:
- Không biết hàm nào:
    - trả 1 hay nhiều?
    - đầy đủ hay rút gọn?
    - dùng trong tình huống nào?
??? thế khi đặt tên 1 hàm mà hàm đấy có thể sẻ vì thêm gì đó mà mở rộng sau này thì tôi nên đặt nó như nào chi chuẩn nhỉ
## Nguyên tắc cốt lõi (trả lời nhanh)
**KHÔNG đặt tên hàm theo “tương lai có thể mở rộng”**  
👉 **Đặt tên đúng với _hành vi HIỆN TẠI_**  
👉 Khi mở rộng → **tách hàm mới hoặc đổi tên hàm cho đúng hơn**
## “The name of a function should say what it does.”

# 4. Use Pronounceable Names
Con người rất giỏi về từ ngữ. Một phần quan trọng trong bộ não của chúng ta được dành riêng cho các khái niệm về từ. Và các từ, theo định nghĩa, có thể phát âm được. Thật lãng phí khi không sử dụng được bộ não mà chúng ta đã tiến hóa nhằm thích nghi với ngôn ngữ nói. Vậy nên, hãy làm cho những cái tên phát âm được đi nào.
Nếu bạn không thể phát âm nó, thì bạn không thể thảo luận một cách bình thường: "Hey, ở đây chúng ta có _bee cee arr three cee enn tee_, và _pee ess zee kyew int_, thấy chứ?" – Vâng, tôi thấy một thằng thiểu năng. Vấn đề này rất quan trọng vì lập trình cũng là một hoạt động xã hội, chúng ta cần trao đổi với mọi người.
=> Tóm lại hàm càng dễ phát âm, dễ đọc là nói ra cho mn xung quanh nghe hiểu càng tốt 

# 5. Use Searchable Name 
Người ta có thể dễ dàng tìm kiếm `MAX_CLASSES_PER_STUDENT`, nhưng số 7 thì lại rắc rối hơn.
**Tên quá ngắn (1 ký tự) và số “hard-code” gây khó tìm, khó hiểu, dễ bug.**  
→ **Tên dài, có nghĩa, search được luôn thắng.**
### Numeric constant (số viết thẳng) còn nguy hiểm hơn
Example 
```java
if (days > 13467) { ... }
```
❌ Vấn đề:
- Không biết 13467 là gì
- Ai đó gõ nhầm `13476` → bug
- Search không ra hết hoặc không biết đúng chỗ
✅ Thay bằng:
```java
MAX_DAYS_ALLOWED
```
!!!! Tên biến 1 ký tự cũng vậy (e, a, b…)
**Prefer searchable names over short names.**  
(Thà dài mà search được, còn hơn ngắn mà mù mờ)
## Checklist nhanh để áp dụng
✅ Dùng tên dài khi:
- Constant
- Business logic
- Dùng ở nhiều file
- Có thể thay đổi sau này
✅ Dùng tên ngắn khi:
- Loop index (`i`, `j`)
- Temporary variable
- Hàm nhỏ
❌ Không bao giờ
- Hard-code số có ý nghĩa
- Biến 1 chữ cái đại diện cho nghiệp vụ

# 6. Avoid Encodings
**Đừng “mã hóa” (encode) kiểu dữ liệu, scope, hay thông tin kỹ thuật vào tên biến/hàm.**  
Vì nó **tăng gánh nặng cho não người đọc**, không giúp giải quyết bài toán.
❌ Vấn đề:
```java
strName
intAge
tblUser
mUser
fTotalPrice
lstOrders
```

# 7. Hungarian Notation
Không quan trọng lắm skip 
# 8. Member Prefixes
Cx thế không quan trong lắm skip
# 9. Interfaces and Implementations
Cx thế không quan trong lắm skip
# 10. Avoid Mental Mapping 
Tác giả nói thẳng 😄:
> Người thông minh **thích chứng minh họ nhớ được nhiều thứ**  
> Người chuyên nghiệp **không ép người khác phải nhớ**

Ví dụ khoe thông minh ❌:
```java
String r; // r = lowercased url w/o host & scheme
```
Code chuyên nghiệp ✅:
```java
String sanitizedUrl;
```
# "Clarity is king"
➡ Code không phải để:
- Trình diễn IQ
- Thể hiện kỹ thuật cao siêu
➡ Code để:
- Người khác đọc
- Chính bạn 6 tháng sau đọc lại
## Class Names
👉 **Tên Class phải là DANH TỪ (noun / noun phrase)**  
Vì:
- Class **đại diện cho một “thứ” trong hệ thống**
- Object là “vật thể”, không phải hành động
📌 Ví dụ đúng:
```java
Customer
Account
Order
Invoice
AddressParser
```
### ❌ Vì sao KHÔNG nên dùng `Manager`, `Processor`, `Data`, `Info`?
### ⚠️ Các từ này quá **mơ hồ**
Chúng **không nói rõ class này làm gì, chịu trách nhiệm gì**
```java
UserManager
DataProcessor
OrderInfo
CustomerData
```
❓ Vấn đề:
- `Manager` → quản lý cái gì? CRUD? business? cache?
- `Data` / `Info` → khác gì class gốc?
- Trách nhiệm **bị mờ**, dễ thành _God Class_ [[Terminology]]
👉 Vi phạm **Single Responsibility Principle (SRP)**
### ❌ Bad
```java
CustomerData
CustomerInfo
CustomerManager
```
### ✅ Better
```java
Customer
CustomerProfile
CustomerRepository
CustomerService
```
👉 Mỗi class **nói rõ vai trò**
Tóm lại tất tần tật 
👉 **Hãy đặt câu hỏi:**
    “Class này là cái GÌ?”
Nếu trả lời được bằng **danh từ** → đúng  
Nếu trả lời bằng **hành động** → sai
**Class là “danh từ” – Function là “động từ”**
## Methods Names
### Method (hàm) phải là **động từ**
👉 Vì **method biểu diễn hành động**, không phải “thứ”
✅ Đúng
```java
postPayment()
deletePage()
saveUser()
calculateSalary()
```
❌ Sai
```java
payment()
pageDeletion()
userSave()
```
#### Accessor / Mutator / Predicate (chuẩn JavaBean)
Java có **quy ước đặt tên chuẩn**, IDE & framework dựa rất nhiều vào nó. => Tham khảo 

## Dont be cute
**Say what you mean. Mean what you say.**
👉 Nói chung đừng có sáng tạo chuẩn và đồng bộ mới là chìa khoá

## Pick One Word per Concept
Đừng tạo khác biệt
❌ Ví dụ gây rối:
- `fetchUser()`
- `retrieveUser()`
- `getUser()`
→ Cùng **1 hành động** nhưng **3 từ khác nhau**
👉 Vấn đề:
- Không nhớ nổi method nào thuộc class nào
- Phải nhớ “thằng viết code này hay dùng từ gì”
- Mất thời gian đọc header / code cũ để đoán
✅ Cách làm đúng:
- Chọn **1 từ**
- Dùng **ở mọi nơi**
## Dont Pun
Tránh dùng cùng một từ cho hai mục đích. Sử dụng cùng một thuật ngữ cho hai ý tưởng khác nhau về cơ bản là một cách chơi chữ.
Nói chúng cx như cái trên 

## Use Solution Domain Names
📌 Ý chính:
- Code **không viết cho khách hàng**
- Code **viết cho dev khác (và chính bạn trong tương lai)**
👉 Vì vậy:
- **Cứ dùng thuật ngữ CS / IT chuẩn**
- Đừng né thuật ngữ kỹ thuật một cách không cần thiết

## Use Problem Domain Names
**Khi KHÔNG có thuật ngữ kỹ thuật → dùng thuật ngữ nghiệp vụ**
“When there is no programmer-eese for what you’re doing…”_
📌 Ý nghĩa:
- Nếu **CS / design pattern / thuật toán**  
    👉 **không có từ chuẩn**
- Thì **đừng bịa ra tên kỹ thuật cho có vẻ pro**
✅ Thay vào đó:
- Dùng **tên đúng theo nghiệp vụ (problem domain)**
👉 Vì:
- Dev sau còn có thể:
    - hỏi BA
    - hỏi PM
    - hỏi domain expert  
        → còn có điểm tựa để hiểu
## Add Meaningful Context
📌 Ý chính:
- Phần lớn **biến / hàm KHÔNG tự nói lên ý nghĩa**
- Người đọc hiểu được là nhờ **ngữ cảnh (context)**
👉 Context đến từ:
- class
- function
- namespace
- module
Nói chung mấy cái context rất quan trọng cần lưu ý luôn 
## Kết luận 
- **Đặt tên là kỹ năng diễn đạt**, không phải kỹ thuật
- **Tên phải nói rõ ý định**, không cần comment giải thích
- **Đừng sợ rename** → rename là một dạng refactor tốt
- **Code nên đọc như văn bản**, không phải câu đố
- **Rõ ràng > thông minh / hài hước**
- **Một khái niệm → một từ, dùng nhất quán**
- **Ét scope → tên có thể ngắn, scope lớn → tên phải rõ**
- **Đừng encode type / m / I vào tên** (IDE & type system lo rồi)
- **Đừng thêm noise**: Info, Data, Object, Manager…
- **Dùng refactor tool**, không rename “bằng tay”
> 🔑 **Code viết cho người đọc, không phải cho compiler**




