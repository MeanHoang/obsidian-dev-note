### **1. overflow: visible (mặc định)**
- Không cắt nội dung
- Nội dung tràn ra ngoài và có thể đè phần tử khác
- Không có scroll
### **2. overflow: hidden**
- Cắt phần nội dung vượt ra ngoài
- Không scroll
- Dùng cho: accordion, animation, crop ảnh, bo góc
- Lưu ý: tooltip/dropdown bên trong sẽ bị che
### **3. overflow: auto**
- Chỉ thêm scroll khi nội dung tràn
- Dùng cho danh sách dài, bảng

## 1. CSS Cascade là gì?
**CSS Cascade** là cơ chế quyết định **style nào thắng** khi có nhiều rule cùng áp lên 1 element.
Quy tắc ưu tiên (từ thấp → cao):
1. **Thứ tự load (source order)**
2. **Độ đặc hiệu (specificity)**
3. **!important*
Trong thực tế, **thứ tự load CSS khi build** là nguyên nhân gây bug RẤT NHIỀU.
---
## 2. Tại sao build xong lại lỗi CSS dù dev OK?
Trong lúc dev:
- CSS thường được load **theo file import bạn viết**
- HMR (hot reload) đôi khi **không tối ưu / chưa gộp file**
👉 Khi **build**, tool như:
- webpack
- Vite
- Next.js
- CRA
sẽ
- **gộp (bundle) CSS**
- **tối ưu / sắp lại thứ tự**
- **tree-shaking**
- **code splitting**

➡ **Thứ tự CSS có thể KHÁC so với dev**