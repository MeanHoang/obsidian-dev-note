Trên đời này cái gì cũng có thể xảy ra, lỗi cũng vậy có thể đầu vào bị bất thường, thiết bị có thể bị lỗi. 
 Nói tóm lại, mọi thứ đều có thể xảy ra sai sót, và khi chúng xảy ra, chúng ta với tư cách là người lập trình có trách nhiệm đảm bảo rằng mã của chúng ta thực hiện những gì nó cần làm.
# Use Exceptions Rather Than Return Code 
Nói chúng cái này nói về các lỗi thay vì if/else check ra trông rất thủ cổng thì exception try/catch ra để lỗi không khuất logic và thẩm mỹ
Đấy ngày xưa giờ ai làm thế nữa 
# Write Your Try/Catch/Finally Statement First
À có ý so sánh rất đúng 
**Try-catch tạo ra một "scope giao dịch" (transaction-like scope).**
Nghĩa là:
- Mọi thứ trong `try { ... }` **có thể dừng giữa chừng** nếu lỗi xuất hiện.
- Khi lỗi xảy ra → code _nhảy ngay_ đến `catch`.
- Vì vậy, **catch phải đảm bảo chương trình trở về trạng thái ổn định**.
Giống như database **transaction**:
- Nếu lỗi, rollback → hệ thống không ở trạng thái nửa vời.
### Tóm lại nên viết khung trước rồi mới viết try catch 
Có thể 
“Hãy viết test ép code ném lỗi, rồi viết handler để đáp ứng test. Như vậy bạn xây transaction scope trước.”
# Use Unchecked Exceptions
**Unchecked exception = exception KHÔNG bắt buộc phải khai báo hoặc bắt.**
Bạn _có thể_ bắt (catch) nhưng _không bắt cũng không sao_, chương trình vẫn compile và chạy.
✔ Không cần ghi vào hàm  
✔ Không bị ép phải `try/catch`  
✔ Không bị ép phải thêm vào signature
Tóm lại lỗi nên:
- được **bắt và xử lý ở tầng phù hợp nhất**,
- không lan bừa lên trên khiến code khó hiểu.
Vì JS không bắt buộc khai báo loại exception, nên:
→ bạn phải ghi rõ hàm có thể throw lỗi gì  
→ hoặc trả về triệu chứng như `{ ok: false, error: ... }`
Trong JS, mọi lỗi đều "unchecked".  
➡ Nghĩa là bạn cần tự quyết định lỗi nào nên catch, lỗi nào nên throw lên.
Note: Cái này rất hay cho Java nên đọc mà mất gốc rồi đọc không hiểu sau học Java cumback lại nhé!!!!
# Provide Context with Exceptions
### 🔥 Stack Trace là gì? (hiểu nhanh)
Khi một exception xảy ra, ngôn ngữ sẽ ghi lại:
- Function nào gây lỗi
- Function nào gọi nó
- Function nào gọi function bên trên
- …
- Cho đến hàm gốc
Nó được “xếp chồng” giống stack trong cấu trúc dữ liệu → gọi là **stack trace**.
Exception không chỉ để báo lỗi — nó phải giải thích lỗi xảy ra trong lúc bạn đang làm gì.  
Stack trace nói "nó hỏng ở đâu", còn message phải nói "nó hỏng khi đang làm gì".
🔥 Ví dụ tệ
```java
throw new RuntimeException("Error");
// Không ai hiểu gì hết.
```
⚡ Ví dụ tốt
```java
throw new FileProcessingException(
    "Failed to parse config file: " + filePath
);
/*
Message này rõ:
- Đang xử lý file
- Loại lỗi: không parse được
- File nào bị lỗi
*/
```
Nói chung cái này nói stack trace không thông báo đầy đủ đâu nên mình cần chủ động hơn throw thêm lỗi như nào ở message. Cái nào cần check thêm về lỗi. Nhưng tôi thấy log nhiều quá cũng không tốt nên chỉ ở những nơi logic phức tạp dễ lỗi ấy 
# Define Exception Classes in Terms of a Caller's Needs
Cái này nói chung là các exception giống nhau mới cần gộp lại. Giống nhau là xử lý nếu nó lỗi giống nhau. Cái này chắc là nhiều lớp try catch đây mà 
# Define the Normal Flow 
### ❤️ Tóm lại (ý chính bạn cần nhớ)
- **Exception dùng cho lỗi thực sự**
- Nếu chỉ là trường hợp “không có dữ liệu” → đó **không phải lỗi*
- Dùng **Special Case Pattern** để giấu xử lý đặc biệt vào object
- Business logic trở nên cực kỳ sạch, không bị chen ngang bởi error handling
# Dont return null
- **Trả về null là nguyên nhân số 1 khiến code bẩn và dễ crash.**
- Null ép mọi caller phải viết vô số điều kiện:
- Chỉ cần _một lần quên check_ → crash runtime.
- Code tràn ngập null-check → khó đọc.
- Tốt hơn:
    - Không return null
    - Return **Special Case Object**
    - Hoặc return **empty list/object**
    - Hoặc **throw exception** nếu đó là lỗi thật
### 💥 JavaScript còn tệ hơn vì có cả `null` lẫn `undefined`
JS không ném lỗi ngay như Java, mà thường gây lỗi kiểu:
```
Cannot read properties of undefined
```
Điều này xảy ra khi code như:
```js
const employees = getEmployees(); // returns null or undefined
employees.forEach(e => total += e.getPay());
```
→ Crash ngay.
## ✅ CÁCH CLEAN TỐT NHẤT RETURN VỀ EMPTY LIST THAY VÌ NULL
# Dont Pass Null
Trả về Null đã tệ, truyền null vào còn hàm còn khốn nạn hơn. Trừ khi bạn đang làm việc với một API yêu cầu bạn truyền vào **null**, còn đâu bạn nên tránh truyền **null** trong mã của mình bất cứ khi nào có thể.
# 🚫 Vì sao “pass null vào hàm” là hành vi xấu?
- Gây lỗi runtime (NullPointerException ở Java, TypeError ở JS)
- Hàm không biết nên làm gì: return cái gì? throw lỗi? fallback?
- Bắt buộc thêm logic xử lý ngoại lệ → code bẩn
#### 💡 Ví dụ JavaScript cho đoạn “xProjection” của Clean Code
#### ❌ Cách tệ: Cho phép truyền null → crash
```js
function xProjection(p1, p2) {
  return (p2.x - p1.x) * 1.5;
}

xProjection(null, { x: 10, y: 20 });
// TypeError: Cannot read properties of null
```
#### ❌ Cách “cải thiện nhưng vẫn xấu”: throw error
```js
function xProjection(p1, p2) {
  if (!p1 || !p2) {
    throw new Error("Invalid arguments");
  }
  return (p2.x - p1.x) * 1.5;
}
```
→ Giảm lỗi, nhưng gây phiền vì mọi caller phải try/catch  
→ Không giải quyết gốc rễ
## ✔️ Cách CLEAN: **Không cho null đi vào từ đầu!**
# Conclusion 
Code sạch là code _dễ đọc_ nhưng cũng phải _chống chịu tốt_ (robust). Hai thứ này **không hề mâu thuẫn**. Muốn đạt cả hai, ta phải xem _error handling_ như một **mối quan tâm riêng biệt** (separate concern), tách khỏi logic chính.