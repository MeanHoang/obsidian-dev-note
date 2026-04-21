https://dev.to/hadil/web-development-is-more-than-frontend-and-backend-heres-what-actually-matters-23kc?ref=dailydev
# 🧠 Tóm tắt bài viết

## 1️⃣ Sai lầm phổ biến: Web dev = Frontend + Backend
Nhiều người mới học lập trình thường nghĩ web development chỉ gồm:
- **Frontend** → HTML, CSS, JS
- **Backend** → API, database, server
Nếu UI gọi được API và hiển thị dữ liệu thì coi như xong.
Nhưng thực tế **nhiều project vẫn “chạy được” nhưng trải nghiệm rất tệ**.

---
# 🚨 2️⃣ App fail không phải vì code
Website thường thất bại vì những thứ **không nằm riêng ở FE hay BE** như:
- UX kém
- không xử lý edge cases
- performance chậm
- accessibility kém
- deployment lỗi
- teamwork kém
Những vấn đề này nằm **ở level system**, không phải chỉ code.

---
# ⚙️ 3️⃣ Những “layer vô hình” của web development
Một website tốt thường đến từ **những chi tiết nhỏ mà tutorial không dạy**:
Ví dụ:
- loading state rõ ràng
- error message dễ hiểu
- keyboard navigation
- màu sắc đủ contrast
- URL sạch và dễ đọc
- empty state hợp lý
- tối ưu bundle size
- tránh re-render không cần thiết
👉 Những thứ này **framework không tự làm giúp bạn**.  
Developer phải tự thiết kế.

---
# 🧩 4️⃣ Backend cũng không chỉ là API
Backend không chỉ là viết endpoint như:
```js
app.get('/users', async (req, res) => {
  const users = await db.getUsers();
  res.json(users);
});
```
Một backend tốt cần thêm:
- error handling
- logging
- validation
- config môi trường
- security
Ví dụ:
```js
try {
  const users = await db.getUsers();
  res.json(users);
} catch (err) {
  logger.error(err);
  res.status(500).json({ message: "Something went wrong" });
}
```
👉 **Cùng một feature nhưng mức độ “trách nhiệm kỹ thuật” khác nhau.**

---
# 📚 5️⃣ Tutorial chỉ dạy “happy path”
Tutorial thường chỉ dạy:
- API chạy
- UI hiển thị
- form submit thành công
Nhưng **project thật** phải xử lý:
- API fail
- mạng chậm
- accessibility
- code maintain lâu dài
- nhiều dev cùng làm
Đây mới là phần **software engineering thực sự**.
---

# 🧠 6️⃣ Mindset của developer giỏi
Khi dev trưởng thành hơn, câu hỏi không còn là:
❌ “Code có chạy không?”
Mà là:
- Có dễ hiểu không?
- Có maintain được không?
- Có predictable không?
- Có thân thiện với user không?
- Có thân thiện với future dev không?
Đây gọi là **thinking in systems**.

---
# 🎯 Kết luận của bài
Web development **không phải là stack công nghệ**.
Nó là **sự kết nối giữa các quyết định**:
- UX
- performance
- accessibility
- reliability
- maintainability
> Web development is not stacking technologies — it's connecting decisions.

---
# 💡 Ý rất đáng chú ý trong bài
Bài này đang nói một điều khá sâu:
**Dev junior focus:**
- framework  
- feature  
- API  
- component
**Dev giỏi focus:**
- system
- user experience
- edge cases
- maintainability
- operability