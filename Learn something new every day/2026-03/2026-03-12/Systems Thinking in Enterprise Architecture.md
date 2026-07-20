https://frederickvanbrabant.com/blog/2026-02-20-systems-thinking-in-enterprise-architecture/?ref=dailydev
# 🧠 Systems Thinking trong Enterprise Architecture

## 🌍 1. Tổ chức là một hệ thống phức tạp
Tác giả mở đầu bằng ví dụ từ **quy hoạch đô thị**:
- Một tòa nhà mới có thể ảnh hưởng đến **đường bay của chim**.
- Trồng thêm cây để giảm nhiệt độ thành phố có thể ảnh hưởng tới **doanh thu quán café**.
👉 Ý chính:  
Trong **hệ thống lớn**, một thay đổi nhỏ có thể gây ra nhiều hiệu ứng ngoài dự đoán.  
Điều này cũng đúng với **tổ chức và hệ thống IT**.
Enterprise Architect phải hiểu rằng **mọi thứ liên kết với nhau**, nhưng **không thể mô hình hóa hết tất cả**.

---
# 📊 2. Rumsfeld Matrix – phân loại kiến thức
Tác giả dùng **Rumsfeld Matrix** để phân loại những gì ta biết và không biết.
### 🟢 Known Knowns
Những thứ **ta biết và đã document**  
Ví dụ:
- API documentation
- CMDB
- sơ đồ tổ chức
➡️ Đây là phần lớn các diagram trong Enterprise Architecture.
### 🟡 Known Unknowns
Những thứ **biết là tồn tại nhưng chưa hiểu rõ**
Ví dụ:
- technical debt
- business process chưa được map
- hệ thống chưa được phân tích
➡️ Nằm trong backlog cần nghiên cứu.

### 🔵 Unknown Knowns
Những thứ **hệ thống biết nhưng kiến trúc sư không biết**
Ví dụ:
- Shadow IT
- workflow bí mật trong hệ thống legacy
- “tribal knowledge” của dev cũ
➡️ Những “skeleton in the closet”.

---
### 🔴 Unknown Unknowns
Những thứ **ta hoàn toàn không biết tồn tại**
Ví dụ:
- interaction mới giữa hai hệ thống
- market change
- cascade failures
➡️ Đây là phần **nguy hiểm nhất** vì không thể dự đoán.

---
# 🔁 3. Causal Loop Diagrams (feedback loops)
Sau khi sự cố xảy ra, ta có thể phân tích bằng **causal loop diagrams** để hiểu hệ thống.
Có 2 loại vòng lặp chính:
## 🔺 Reinforcing loop (tăng cường)
Hiệu ứng **snowball**.
Ví dụ:
```
Platform tốt → nhiều user → nhiều funding → thêm feature → platform tốt hơn
```
Nhưng cũng có thể là **death spiral**:
```
Áp lực delivery → fix nhanh → complexity tăng → delivery chậm → áp lực tăng
```
## ⚖️ Balancing loop (cân bằng)
Hệ thống cố giữ **status quo**.
Ví dụ trong chuyển đổi số:
```
Innovation → cần integrate legacy → maintenance tăng → ít thời gian innovation
```
➡️ Vì vậy nhiều **digital transformation thất bại**.

---
# 🗺️ 4. “The map is not the territory”
Một nguyên tắc quan trọng:
**Bản đồ không phải lãnh thổ.**
Diagram chỉ là **mô hình hóa thực tế**, không phải thực tế.
👉 Vì vậy:
- Không thể map toàn bộ hệ thống
- Không nên cố hiểu tất cả
- Chỉ nên model những thứ **tạo ra value**
---
# 🤖 5. Câu hỏi mở về AI
Tác giả đặt câu hỏi thú vị:
AI / LLM thuộc loại nào trong matrix?
- **Known Unknown**  
    (biết nó tồn tại nhưng không biết output)
hay
- **Unknown Unknown**  
    (black box, không biết bên trong)

---
# 🎯 Ý chính của toàn bài
**Enterprise Architecture không phải là hiểu tất cả hệ thống.**
Thay vào đó:
- Nhận thức rằng hệ thống rất phức tạp
- Chấp nhận có nhiều thứ **không thể biết**
- Tập trung vào **những thứ mang lại giá trị chiến lược**
💡 **1 câu tóm tắt toàn bài:**
**Enterprise Architecture không phải là map mọi thứ, mà là hiểu rằng hệ thống luôn có những phần ta không thể thấy.**