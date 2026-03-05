https://ayende.com/blog/203747-A/api-design-dont-try-to-guess?ref=dailydev
## 🧠 Ý tưởng chính
Khi thiết kế **API**, **đừng cố đoán ý định của người dùng API**.
➡️ Thay vì API cố “thông minh”, hãy **để người gọi API quyết định rõ ràng**.
Nếu API cố đoán quá nhiều, nó có thể:
- hạn chế khả năng sử dụng
- khó mở rộng trong tương lai
- làm API trở nên cứng nhắc.
# ⚠️ Ví dụ trong bài
Tác giả đưa ra đoạn code API:
```
AddAttachment(string fileName, Stream stream)
```
API sẽ **tự đoán content-type từ extension**:
```
.jpg -> image/jpeg
.png -> image/png
.pdf -> application/pdf
```
Nếu không có extension → mặc định `image/jpeg`.
# 🚨 Vấn đề của cách làm này
## 🔍 API đang “đoán” thay vì “nhận thông tin”
API cố suy luận:
```
fileName -> extension -> content type
```
Nhưng thực tế: 👉 **caller biết rõ hơn API**.
Ví dụ caller biết:
- file là **CSV**
- file là **image**
- file là **binary**
API **không nên suy đoán điều này**.
## 🧱 Làm API bị giới hạn
Nếu API tự đoán như vậy:
- muốn hỗ trợ file mới → phải **sửa library**
- phải **release version mới**
- user phải **update dependency**
Điều này làm API **kém linh hoạt**.
# ✅ Cách thiết kế API tốt hơn
Thay vì:
```
AddAttachment(fileName, stream)
```
nên
```
AddAttachment(fileName, stream, contentType)
```
➡️ Caller tự truyền:
```
image/png
text/csv
application/json
```
Lợi ích:
- API **đơn giản hơn**
- user **linh hoạt hơn**
- không cần update library khi có format mới.

# 📦 Bài học quan trọng
## 🧭 API nên:
✔ explicit (rõ ràng)  
✔ flexible (linh hoạt)  
✔ không đoán logic business
## ❌ API không nên:
❌ suy đoán ý định user  
❌ “cố thông minh”  
❌ tự thêm logic ngầm

# 💡 Insight quan trọng của bài
Khi API cố giúp người dùng bằng cách đoán,  đôi khi nó **làm giảm khả năng của người dùng**.
Tức là 
```
helpful API
   ↓
over-smart API
   ↓
crippled API
```
✅ **Tóm gọn một câu:**
👉 **API tốt là API rõ ràng, không phải API thông minh.**