## 📌 **Ý chính của bài**

### 🧠 **1. Atomic Design không phải kiến trúc ứng dụng**
- Mô hình _Atomic Design_ (Atoms → Molecules → Organisms → Templates → Pages) **là một pattern để _tổ chức UI_, không phải giải pháp kiến trúc toàn bộ ứng dụng**.
- Nhiều dev nhầm lẫn dùng Atomic Design như “architecture” và khiến codebase trở nên rối và khó mở rộng.
📌 **Tóm lại:**
> _Atomic Design giúp bạn tổ chức UI — nhưng không tự động giải quyết logic ứng dụng, state, data flow hay domain boundaries._

---
## 🧱 **2. Cách Atomic Design hoạt động**
Atomic Design chia UI thành **5 cấp độ tái sử dụng**:
1. **Atoms** – phần tử nhỏ nhất (button, input, label).
Ví dụ:
```jsx
// shared/ui/atoms/Button.tsx
export function Button({ children, onClick, disabled }) {
  return <button onClick={onClick} disabled={disabled}>{children}</button>
}
```
- Nút, label, input…
- Chỉ render UI
- Không fetch dữ liệu
- Không chứa logic domain

2. **Molecules** – kết hợp atoms để tạo UI đơn vị (form field + button).
Ví dụ:
```jsx
// shared/ui/molecules/TextInputWithLabel.tsx
import { Label } from "../atoms/Label"
import { Input } from "../atoms/Input"

export function TextInputWithLabel({ label, ...props }) {
  return (
    <div>
      <Label>{label}</Label>
      <Input {...props} />
    </div>
  )
}
```
- Cụm UI nhỏ
- Không chứa business logic

3. **Organisms** – nhóm molecules & atoms tạo thành vùng UI lớn hơn.
Ví dụ:
```jsx
// shared/ui/organisms/SearchBar.tsx
import { TextInputWithLabel } from "../molecules/TextInputWithLabel"
import { Button } from "../atoms/Button"

export function SearchBar({ onSearch, ...props }) {
  return (
    <div>
      <TextInputWithLabel label="Search" {...props} />
      <Button onClick={onSearch}>Go</Button>
    </div>
  )
}
```
- Kết hợp UI lại
- Có thể chứa state UI (nhưng KHÔNG chứa logic domain)

4. **Templates** – bố cục UI không gắn dữ liệu, định hình layout.
```jsx
// templates/ProductListTemplate.tsx
export function ProductListTemplate({ children }) {
  return (
    <main>
      <h1>Products</h1>
      <section>{children}</section>
    </main>
  )
}
```
- Cấu trúc layout
- Dùng để định hình “vị trí” các organism

5. **Pages** – templates + dữ liệu thực tế → UI hoàn chỉnh.
```jsx
// pages/ProductsPage.tsx
import { ProductListTemplate } from "@/templates/ProductListTemplate"
import { ProductCard } from "@/features/products/ProductCard"

export function ProductsPage({ products }) {
  return (
    <ProductListTemplate>
      {products.map(p => <ProductCard key={p.id} product={p} />)}
    </ProductListTemplate>
  )
}
```
- Có dữ liệu API
- Là entry point render cho route
### Lợi ích khi dùng đúng Atomic Design
✔ **Tái sử dụng UI mạnh**  
✔ **Consistency UI cao**  
✔ **Testable components**  
✔ **Đội nhiều dev cùng làm UI vẫn nhanh hiểu**  
✔ **Tách presentation logic khỏi business rule**

---
## 🧠 **3. Sai lầm phổ biến khi dùng Atomic Design**
✨ **Không nên dùng Atomic Design làm kiến trúc tổng thể** (ví dụ gom cả business logic vào components).  
👉 Một component khi **chứa logic domain, state hay fetch data** thì _không còn là component UI trang trí_, và nên chuyển vào “layer khác”.
Điều này dẫn tới:
- UI component bị _tích tụ logic_ → khó test
- Khó tái sử dụng qua các feature khác
- Tăng độ phức tạp khi app mở rộng
### ❌ Sai lầm 1:
Nhét logic domain vào atoms/molecules
**Ví dụ sai:**
```jsx
export function PriceButton({ productId }) {
  async function handleBuy() {
    await fetch(`/api/buy/${productId}`, { method: "POST" })
  }
  return <button onClick={handleBuy}>Buy</button>
}
```
➡ UI component đang chứa:
- API call
- Business logic mua hàng  
    ➡ Điều này phá vỡ separation of concerns.
### ❌ Sai lầm 2:
Dùng Atomic Design để làm “architecture ứng dụng” — gom cả logic fetch, state quản lý, data flow vào một chỗ.
Điều này dẫn tới:
- logic domain bị rải khắp UI
- test khó
- khó mở rộng app lâu dài
Atomic Design **chỉ tập trung UI**, còn **application logic** cần layer riêng.

---
## 🧩 **4. Kiến trúc tốt hơn: tách UI và application logic**
Một kiến trúc frontend lành mạnh nên tách:
📌 **UI Composition** – Atomic Design  
📌 **Application Architecture** – nơi xử lý logic, state, domain logic (như features/ module)
Để ứng dụng dễ mở rộng, chúng ta **tách UI Presentation khỏi Application Logic / State / Data Fetch**.
```
shared/
  ui/
    atoms/
    molecules/
    organisms/

features/
  cart/
    api.ts
    hooks.ts
    BuyButton.tsx
```
👉 UI components _chỉ_ dùng state UI tạm thời (nút mở menu, hover state), còn _business state + logic_ nằm ở các feature.

---
## 🧪 **5. Lợi ích khi dùng đúng**
💡 Atomic Design làm UI nhất quán, tái sử dụng và dễ test  
💡 Domain logic được tách riêng → dễ mở rộng app  
💡 Khi codebase lớn, cấu trúc rõ ràng giúp dev mới hiểu nhanh

---
# 🧠 6. Khi nào dùng gì?

✅ **Chỉ UI structure (Buttons/Forms/Layout)** → dùng Atomic  
❌ **Ứng dụng lớn cần handles logic/data flow/state** → cần Feature architecture  
🟡 **Cả hai** → UI theo Atomic + Feature Structure cho logic

---
## 📌 **Tóm gọn 3 dòng để ghi chép**
- **Atomic Design là pattern UI dùng để _tổ chức giao diện_, không phải kiến trúc ứng dụng.**
- **Tách UI Presentation khỏi application logic / state để app scalable.**
- **Shared UI chỉ chứa logic trạng thái UI, còn logic domain / fetch data đặt trong feature modules.**