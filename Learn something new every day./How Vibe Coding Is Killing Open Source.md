https://hackaday.com/2026/02/02/how-vibe-coding-is-killing-open-source/?ref=dailydev
# 🧠 Tóm tắt bài: _How Vibe Coding Is Killing Open Source_
## 🤖 Vibe coding là gì
**Vibe coding** là kiểu lập trình mà developer **giao việc cho AI viết code thay mình**.
Ví dụ:
- hỏi chatbot: _“viết API login bằng Node.js”_
- AI sinh code
- dev chỉ cần chạy nếu thấy **“nó hoạt động”**
Lúc này developer gần như **không cần hiểu code chi tiết**.
👉 Vai trò dev chuyển từ **engineer → người đặt yêu cầu cho AI**.

---
# ⚠️ Vấn đề lớn mà bài viết cảnh báo
## 👻 1. Dev không còn tương tác với open-source
Trước đây khi dùng thư viện OSS dev thường:
- đọc documentation
- mở GitHub issue
- gửi bug report
- tạo pull request
Nhưng với vibe coding: **AI làm hết việc chọn library và viết code.**
➡️ dev **không cần vào repo hoặc đọc docs nữa**.
Hệ quả:
- ít bug report
- ít contributor
- ít cộng đồng

---
## 📉 2. Traffic và doanh thu của OSS giảm
Nhiều dự án OSS kiếm tiền từ:
- sponsor
- commercial license
- documentation traffic
- community engagement
Nhưng khi dev chỉ hỏi AI: ChatGPT → trả code
➡️ dev **không cần vào website project** nữa.
Điều này làm **maintainer mất nguồn thu và động lực**.

---
## 🧬 3. Ecosystem bị “đóng băng”
AI thường chọn thư viện **phổ biến trong training data**.
Ví dụ: AI hay đề xuất:
- React
- lodash
- Express
Nhưng **ít khi đề xuất thư viện mới**.
➡️ tạo hiệu ứng:
Popular library → được AI dùng nhiều  
→ càng popular hơn  
→ library mới không ai biết
Kết quả:  
**innovation trong open source bị chậm lại**.

---
## 🧑‍💻 4. AI không đóng góp cho OSS
AI:
- không mở issue
- không gửi pull request
- không review code
- không báo bug
Trong khi **OSS tồn tại nhờ cộng đồng đóng góp**.
Vì vậy nếu dev chuyển sang vibe coding:
👉 OSS có thể **mất nguồn lực duy trì**.

---
## 🧩 5. Chất lượng code có thể tệ hơn
Một số nghiên cứu cho thấy:
- vibe coding có thể **tăng bug ~41%**
- productivity thậm chí **giảm ~19%** trong vài trường hợp.
Ngoài ra:
- dev không hiểu code
- khó maintain
- khó debug
---
# 🧭 Kết luận của bài viết

AI giúp **viết phần mềm nhanh hơn**, nhưng có thể tạo ra vấn đề lớn:
⚡ productivity tăng  
nhưng
💀 ecosystem open-source suy yếu
Nếu quá nhiều dev dùng vibe coding:
```
ít người đóng góp OSS  
↓  
maintainer bỏ project  
↓  
ít software open source chất lượng
```

---

💡 **Ý chính của bài viết:**
> AI không giết open source trực tiếp  
> nhưng nó **lấy đi sự chú ý và tương tác của developer** — thứ giúp OSS tồn tại.