https://dev.to/josephciullo/atomic-design-from-ui-composition-to-real-world-applications-j25
## 📌 **Ý chính của bài**
🔹 **Atomic Design rất phổ biến**  
Atomic Design thường được nhắc tới khi nói về frontend architecture vì:
- Dễ hiểu
- Dễ hình dung (atom → molecule → organism…)
- Tổ chức UI rất rõ ràng
Nó hoạt động rất tốt… cho đến khi ứng dụng bắt đầu lớn lên.
🔹 **Vấn đề không nằm ở Atomic Design**  
Không phải phương pháp này sai. Vấn đề là chúng ta gán cho nó **vai trò quá lớn**.
🔹 **Sai lầm phổ biến**  
Dùng Atomic Design như **kiến trúc toàn bộ ứng dụng**.
Hệ quả:
- Cấu trúc trở nên cứng nhắc
- Logic bị nhét vào component
- Khó test
- Khó mở rộng khi app phức tạp
Vì Atomic Design chỉ giải quyết:
- UI composition
- Design consistency
Nó không giải quyết:
- Business logic
- Feature boundary
- Domain organization
- State ownership
🔹 **Tóm lại**
Atomic Design rất mạnh cho UI. Nhưng nếu dùng nó để tổ chức cả application, nó sẽ lộ giới hạn khi hệ thống phát triển.

### 🧠 **1. Atomic Design không phải kiến trúc ứng dụng**
- Mô hình _Atomic Design_ (Atoms → Molecules → Organisms → Templates → Pages) **là một pattern để _tổ chức UI_, không phải giải pháp kiến trúc toàn bộ ứng dụng**.
- Nhiều dev nhầm lẫn dùng Atomic Design như “architecture” và khiến codebase trở nên rối và khó mở rộng.
🔹 Atomic Design không trả lời:
- Domain nằm ở đâu?
- Ai điều phối flow của ứng dụng?
- Logic nghiệp vụ tổ chức thế nào?
- Hệ thống scale ra sao?
🔹 **Điểm mấu chốt**
Atomic Design = cách ghép UI  
Architecture = cách tổ chức toàn bộ hệ thống
Nhầm lẫn hai thứ này là lúc vấn đề bắt đầu xuất hiện
🔹 **Tóm lại**
***Atomic Design rất mạnh cho UI composition. Nhưng nó không phải là kiến trúc ứng dụng***

---
## 🧱 **Cách Atomic Design hoạt động**
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
### The real-world short circuit
🔹 **Vấn đề xảy ra trong thực tế**
Ban đầu, trong Atomic Design, **Organism** chỉ là một component UI phức tạp hơn. Nhưng theo thời gian… nó bắt đầu “phình to”.
🔹 **Organism biến thành mini application**
Thay vì chỉ render UI, nó bắt đầu làm:
```js
fetchData()
applyBusinessRules()
manageGlobalState()
renderUI()
```
Nghĩa là trong một component đã có:
- Gọi API
- Xử lý logic nghiệp vụ
- Quản lý state toàn cục
- Render giao diện
🔹 **Hệ quả**
• Không còn là presentational component nữa  
• Khó test (vì vừa UI vừa logic)  
• Coupling chặt với một feature cụ thể
🔹 **Điều nguy hiểm nhất**: UI trở thành nơi logic tích tụ.
Kết quả:
**Một “monolith” được ngụy trang dưới dạng component.**
Nhìn bên ngoài thì có vẻ modular (atoms, molecules, organisms). Nhưng thực tế bên trong lại là một khối logic dính chặt vào UI.
🔹 **Tóm lại**
Organism không nên trở thành “mini application”.  
Nếu logic nằm trong UI quá nhiều, hệ thống sẽ trở nên cứng nhắc và khó scale.

---
### The false Molecule vs Organism problem
🔹 **Vấn đề nhiều team hay tranh luận**
**"Component này là molecule hay organism?”**
Trong Atomic Design, việc phân biệt:
- Molecule
- Organism
thường mang tính **chủ quan**.
🔹 **Thực tế: câu hỏi đó không quan trọng**
Việc đặt tên molecule hay organism:
- Không làm kiến trúc tốt hơn
- Không giúp hệ thống scale
- Không giảm coupling
Nó chỉ là phân loại UI.
🔹 **Câu hỏi thực sự quan trọng là gì?**
***Component này có biết về domain không?***
🔹 Nếu câu trả lời là “Có”
Ví dụ component:
- Biết user role
- Biết business rule
- Biết logic giảm giá
- Biết flow checkout
👉 Thì nó không còn thuộc Atomic Design nữa.
Dù bạn gọi nó là:
- molecule
- organism
- super-organism
Thì nó vẫn đang chứa domain logic.
🔹 **Domain là gì? (quan trọng cần nhớ)**
Domain = nghiệp vụ của hệ thống.  
Ví dụ:
- Mua hàng
- Thanh toán
- Phân quyền
- Đặt lịch
UI thuần túy không nên biết domain.
🔹 **Insight quan trọng**
Atomic Design chỉ dành cho **UI composition**. Nếu component:
- Biết business rule
- Biết flow ứng dụng
- Biết state domain
→ Nó thuộc layer feature, không phải design system.
✅ Tóm lại
Đừng hỏi: Molecule hay Organism?
Hãy hỏi: Nó có biết domain không?
Nếu có → nó không thuộc Atomic Design nữa.

---
## 🧠 **Sai lầm phổ biến khi dùng Atomic Design**
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
## 🧩 ** Kiến trúc tốt hơn: tách UI và application logic**
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
## 🧪 **Lợi ích khi dùng đúng**
💡 Atomic Design làm UI nhất quán, tái sử dụng và dễ test  
💡 Domain logic được tách riêng → dễ mở rộng app  
💡 Khi codebase lớn, cấu trúc rõ ràng giúp dev mới hiểu nhanh

---
# 🧠 Khi nào dùng gì?

✅ **Chỉ UI structure (Buttons/Forms/Layout)** → dùng Atomic  
❌ **Ứng dụng lớn cần handles logic/data flow/state** → cần Feature architecture  
🟡 **Cả hai** → UI theo Atomic + Feature Structure cho logic

---
## 📌 **Tóm gọn 3 dòng để ghi chép**
- **Atomic Design là pattern UI dùng để _tổ chức giao diện_, không phải kiến trúc ứng dụng.**
- **Tách UI Presentation khỏi application logic / state để app scalable.**
- **Shared UI chỉ chứa logic trạng thái UI, còn logic domain / fetch data đặt trong feature modules.**