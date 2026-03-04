## 📌 **Feature-Driven Architecture là gì?**
**Feature-Driven Architecture (FDA)** là một cách tổ chức mã để **tạo ứng dụng lớn dễ mở rộng**, bằng cách **sắp xếp code theo _features_ (chức năng)** thay vì theo _technical layers_ như `components/`, `hooks/`, `services/`…
Mục tiêu: **giảm sự phức tạp, tăng khả năng mở rộng & dễ bảo trì** khi ứng dụng lớn dần.

---
## Scalability is not just performance
Câu này hay vì mn thường khi nghe “scalable”, ta thường nghĩ đến: 
- tăng server
- tăng CPU
- load balancer
- microservices
- cloud như Amazon Web Services hoặc Google Cloud Platform
Nhưng tác giả nói:
➡️  Vấn đề scale đầu tiên KHÔNG phải là hạ tầng. Mà là code.
### Khi nào ứng dụng KHÔNG scale được
❌ **1. Every new feature requires changes in multiple places**
Mỗi lần thêm feature phải sửa 5–6 chỗ:
- component
- service
- reducer
- route
- utils
- file unrelated
Ví dụ: Bạn thêm “wishlist” nhưng phải sửa:
- product service
- cart service
- user reducer
- order logic
👉 Điều này chứng tỏ feature không được tách biệt rõ.
❌ **2. Logic is scattered and hard to trace**
Logic bị rải rác khắp nơi.
Ví dụ:
- Validation nằm trong component
- Một phần trong hook
- Một phần trong service
- Một phần trong middleware
Khi bug xảy ra: ➡️  Bạn không biết bắt đầu tìm ở đâu.
❌ **3. Dependencies are implicit and fragile**
Các phần phụ thuộc vào nhau một cách “ngầm”.
Ex:
```text
authService dùng userService
userService lại gọi orderService
orderService lại dùng auth context
```
Nhìn ngoài thì không thấy.  
Nhưng sửa 1 chỗ → sập dây chuyền.
➡️ Đây gọi là **tight coupling**.
**❌ 4. Understanding the context costs more than the change**
Câu này cực hay.
   **Hiểu hệ thống mất nhiều thời gian hơn là sửa bug.**
Ví dụ:
Sửa 1 dòng code mất 2 phút.  
Nhưng phải mất 3 tiếng đọc code để hiểu hệ thống.
Đây là dấu hiệu hệ thống đang “cognitive overload”.

---
## 🧠 **Tại sao cần tổ chức theo features?**
Khi project càng to:
✔ nhiều dev cùng làm  
✔ logic domain phức tạp  
✔ data flow phức tạp  
✔ nhiều module phụ thuộc lẫn nhau
Nếu bạn tổ chức theo _layer kỹ thuật_, bạn sẽ gặp:
❌ Tìm code khó  
❌ Mỗi feature rải rác khắp nơi  
❌ Khi muốn thay đổi feature → chỉnh nhiều folder  
❌ Cognitive load lớn 
➡️ Đây là _scalability problem_ về mặt **code & cognitive load** — chứ không chỉ performance hay server.

---
## 🧱 **Tư duy chính của Feature-Driven**
👉 _Feature là đơn vị chính yếu của ứng dụng._  
Không phải component, không phải service – mà là **chức năng có ý nghĩa với người dùng**.
**Feature = UI + business logic + state + fetch data + orchestration liên quan đến chức năng đó.**
## 💡 **Feature là gì?**
Một feature không chỉ là UI, mà là:
✔ Một mục tiêu sản phẩm  
✔ Một hành vi hoàn chỉnh  
✔ Một tập hợp logic liên quan
Khi user nói:
**“Tôi muốn làm X”**
→ X chính là một **feature**
🎯 Ví dụ feature:
- “Tôi muốn đăng nhập” → Authentication
- “Tôi muốn mua hàng” → Checkout
- “Tôi muốn kết bạn” → Friend feature
### Một feature đúng nghĩa phải có:
- 🎯 **Mục tiêu rõ ràng** (Clear objective)
- 🔄 **Hành vi hoàn chỉnh** (Complete behavior)
- 📦 **Context rõ ràng** (Well-defined boundary)
-
---
## 🧱 **Cách tổ chức FDA**
Thay vì tách theo kiểu kỹ thuật như:
```
components/
hooks/
services/
utils/
```
bạn nhóm tất cả thứ cần cho một feature kể cả UI, logic, state, tests… vào cùng một thư mục:
```
features/  
└─ cart/  
    ├─ components/  
    ├─ helpers/  
    ├─ state/  
    ├─ views/  
    ├─ types/  
    ├─ tests/  
    ├─ mocks/  
    └─ index.ts
└─ checkout/  
    ├─ components/  
    ├─ helpers/  
    ├─ state/  
    ├─ views/  
    ├─ types/  
    ├─ tests/  
    ├─ mocks/  
    └─ index.ts
```
Trong `index.ts`, chỉ _export_ những thứ cần dùng ra ngoài — mọi thứ còn lại giữ nội bộ.
Example index.ts
```js
// Only expose what should be used outside the feature
export * from './components';
export * from './helpers';
export * from './types';

// Do NOT export state, views, tests, or mocks
// These remain internal to the feature
```

---
## 📌 **Lợi ích của FDA**
🔥 **Giảm phụ thuộc code giữa các feature** — mỗi feature tự trị  
🔥 **Dễ thay đổi & mở rộng** — thêm feature mới mà không làm rối code hiện tại  
🔥 **Thuận lợi cho team lớn** – mỗi người/team có domain riêng  
🔥 **Context rõ ràng** – ai nhìn vào cũng thấy feature đó xử lý gì  
🔥 **Giảm “cognitive overhead”** cho developer mới vào dự án
### ❌ Khi không nên dùng FDA
⚠️ Ứng dụng rất nhỏ (<10 components) → không cần phức tạp.  
⚠️ Codebase đơn giản, feature ít → tổ chức theo cách thông thường vẫn ổn.

---
### Combining Atomic Design + Feature-Driven Architecture
#### 🧠 **FDA không bác bỏ UI Component Design**
**Hai cái này KHÔNG loại trừ nhau**
- **Atomic Design** → Tổ chức & tái sử dụng UI
- **Feature-Driven Architecture (FDA)** → Tổ chức business logic theo feature
👉 Kết hợp lại = UI scale được + Logic scale được
### Cấu trúc thư mục khi kết hợp
**📦 features/**
```
features/
├─ cart/
│   ├─ components/   (UI riêng của cart)
│   ├─ helpers/
│   ├─ state/
│   ├─ views/
│   ├─ types/
│   ├─ tests/
│   ├─ mocks/
│   └─ index.ts
├─ checkout/
└─ wishlist/
```
👉 Mỗi feature:
- Có logic riêng
- Có state riêng
- Có UI riêng
- Có test riêng
- Hoạt động độc lập
**📦 shared/**
```
shared/
├─ components/
│   ├─ atoms/
│   ├─ molecules/
│   └─ organisms/
└─ utils/
```
👉 Dùng cho toàn hệ thống.
**Nguyên tắc quan trọng**
- Feature dùng được shared components
- Nhưng feature không được xâm phạm feature khác
- Mỗi feature có `index.ts` làm entry point
---
### Features and Reusability
#### Mindset shift (Thay đổi tư duy)
Trong **Feature-Driven Architecture (FDA)**:
- ❌ Feature **không mặc định phải tái sử dụng**
- ✅ Reusability là **quyết định có ý thức**, không phải yêu cầu bắt buộc ban đầu
👉 Không phải cứ viết gì cũng cố làm generic.
#### Khác gì với tư duy UI truyền thống?
Trong UI (đặc biệt với **Atomic Design**):
- Ta thường cố làm component thật generic ngay từ đầu
- Tối đa hóa reusability
Nhưng điều đó dễ dẫn tới:
- Abstraction quá sớm
- Code phức tạp không cần thiết
Thay vì:
**“Làm sao để cái này tái sử dụng cho 10 chỗ?”**
Hỏi:
**“Feature này có thực sự cần tái sử dụng không?”**
Nếu không → giữ nó trong feature.
***Less premature abstraction, more clarity.***
Nghĩa là:
- ❌ Ít trừu tượng hóa quá sớm
- ✅ Rõ ràng hơn
- ✅ Boundary tốt hơn
- ✅ Dễ scale hơn
Feature không sinh ra để tái sử dụng.  
Chỉ những thứ thật sự generic mới được đưa vào shared.

---
## Scaling the team, not just the code — Ghi chép ngắn gọn

1️⃣ Scalability không chỉ là code
Một yếu tố thường bị bỏ quên: **con người (team)**.Hệ thống chỉ thật sự scale khi:
- Dev làm việc dễ dàng
- Ít xung đột
- Hiểu rõ mình chịu trách nhiệm gì
2️⃣ Khi tổ chức theo Feature
Nếu code được chia theo feature:
```
features/  
  auth/  
  cart/  
  checkout/  
```
Thì:
✅ Phân công dễ hơn
- 1 người phụ trách `auth`
- 1 người phụ trách `cart`
- 1 người phụ trách `checkout`
✅ Context rõ ràng
Sửa feature nào → vào đúng thư mục đó  
Không cần đọc toàn bộ project
✅ Giảm conflict
- Ít sửa chung file
- Ít đụng chéo
- Ít merge conflict
3️⃣ Feature trở thành đơn vị tự nhiên cho:
- 📅 Planning (lập kế hoạch theo feature)
- 👥 Parallel development (làm song song)
- 🧪 Testing (test theo feature)
- 🔧 Maintenance (bảo trì dễ hơn)
4️⃣ Ý nghĩa sâu xa
Khi kiến trúc phản ánh cách con người làm việc:
- Dev nghĩ theo hành động người dùng
- Product nghĩ theo feature
- Team chia việc theo feature
→ Architecture = cách team tư duy
5️⃣ Dấu hiệu hệ thống thật sự scale
Không phải:
- Có microservice
- Có cloud
- Có load balancer
Mà là:
**	✅ Team lớn lên nhưng hệ thống không trở nên hỗn loạn.**
**Kiến trúc tốt không chỉ giúp code scale mà giúp team scale.**

---
## 🛠 **Ứng dụng thực tế trong dự án lớn**
✔ Khi app có:
✔ Module rất nhiều  
✔ Multi team dev  
✔ Business logic phức tạp  
✔ Yêu cầu maintain lâu dài
→ FDA là lựa chọn tốt
✅ Tóm lại 1 câu:
**Nếu complexity là thật và sẽ tăng lên, tổ chức theo feature là đầu tư dài hạn đúng đắn.**

---
## 🧠 **Checklist áp dụng FDA**
1️⃣ Xác định feature chính  
2️⃣ Tạo folder riêng từng feature  
3️⃣ Chỉ logic liên quan feature nằm trong folder đó  
4️⃣ Shared code nằm ở `shared/`  
5️⃣ Dùng hooks/ui riêng cho feature  
6️⃣ Tests theo feature

---
## 🤝 **Tóm lại**
**Feature-Driven Architecture đặt “chức năng sản phẩm” làm trung tâm**, gói tất cả những gì liên quan vào một **feature module**, giúp codebase rõ ràng, dễ bảo trì và mở rộng khi dự án lớn hơn theo thời gian — đặc biệt khi nhiều dev cùng làm việc.