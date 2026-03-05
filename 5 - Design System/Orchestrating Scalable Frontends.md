🔹 Trước đó ta đã xây nền tảng:
### 🎨 Với Atomic Design
- Tổ chức UI trong `shared/components`
- Tách component generic khỏi domain
### 🧠 Với Feature-Driven Architecture
- Tạo `features/`
- Mỗi feature là một đơn vị business độc lập
- Giữ domain tách biệt, không import lung tung
## Nhưng vấn đề mới xuất hiện
Ứng dụng thực tế không phải là tập hợp module cô lập.
Ví dụ:
- Auth cần nói chuyện với Cart
- Cart cần Checkout
- Checkout cần Payment
👉 Các feature phải giao tiếp với nhau.
## Câu hỏi quan trọng
***Làm sao cho các feature giao tiếp mà không phá vỡ isolation?***
Nếu cho feature import trực tiếp lẫn nhau:
- Coupling tăng
- Boundary bị phá
- Kiến trúc rối loạn
➡️ Giải pháp: Composition Root

---
### Revisiting the Structure
### 🗂 Cấu trúc tổng thể
```
src/
├─ shared/     → UI & utilities tái sử dụng (Atomic Design)
├─ features/   → Domain độc lập (Feature-Driven)
├─ pages/      → Orchestration / Composition layer
└─ app/        → Bootstrap toàn hệ thống
```
Chúng ta đã xác định một nguyên tắc nền tảng:
👉 Một feature có thể phụ thuộc vào `shared/`, nhưng nó không được biết đến sự tồn tại của các feature khác.
👉`features/cart` không bao giờ được import bất cứ thứ gì từ `features/checkout`.
👉Đây không phải là một giới hạn kỹ thuật, mà là một lựa chọn thiết kế nhằm bảo toàn tính độc lập của từng domain.

---
### The Risk of the “Cannibal Feature” (God Feature)
🔹 Nếu không có layer orchestration (như `pages/`), các feature sẽ bắt đầu import lẫn nhau.
Ví dụ:
- Cart cần trigger Checkout  → Dev import `checkout` vào `cart`
🔹 Điều gì xảy ra?
- Isolation biến mất
- Boundary bị phá vỡ
- Một feature “nuốt” feature kia
→ Tạo ra **God Feature**
## ⚠️ God Feature là gì?
God Feature = một feature phình to bất thường vì:
- Kéo theo dependency của feature khác
- Chứa logic không thuộc về nó
- Chứa type không thuộc domain của nó
Nó trở thành một module cồng kềnh, khó test, khó bảo trì.
## 🎯 Ý chính
Nếu để feature giao tiếp trực tiếp:
→ Sớm muộn sẽ có một feature “ăn” feature khác  
→ Kiến trúc mất tính độc lập  
→ Hệ thống dần thành monolith trá hình
Đó chính là “Feature Cannibalization”.

---
### The Illusion of Simplicity
🔹 Bỏ layer `pages/` nhìn có vẻ đơn giản hơn. Nhưng thực tế chỉ là **giấu complexity đi nơi khác**.
🔹 Ví dụ:
Nếu `Cart` chứa luôn logic điều hướng sang `Checkout`:
→ `Cart` không còn reusable  
→ Không thể dùng lại Cart ở nơi khác (ví dụ Sidebar)  
→ Vì nó kéo theo cả hệ thống thanh toán
🔹 Vấn đề
Feature bắt đầu:
- Biết global navigation
- Biết feature khác
- Biết context toàn hệ thống
→ Boundary bị phá vỡ.
#### 🎯 Nguyên tắc quan trọng
👉 Feature phải “ngu” về global context để có thể “thông minh” về business logic của chính nó.
Nghĩa là:
- Không biết hệ thống lớn thế nào
- Không biết ai sẽ dùng nó
- Chỉ tập trung xử lý domain của mình
#### ✅ Tóm lại
Bỏ orchestration layer không làm hệ thống đơn giản hơn.  
Nó chỉ làm feature bị trộn lẫn responsibility và mất tính tái sử dụng.

---
## Pages as a Composition Root
🔹 Trong sách Clean Architecture,  
Robert C. Martin giới thiệu khái niệm **Composition Root**.
👉 Composition Root = nơi lắp ráp dependency và kết nối các module.
## Trong frontend
`Page` chính là **Composition Root**.
Nó không chỉ là route container.
Nó là nơi:
- Feature được khởi tạo
- Contract giữa các feature được kết nối (callback, event)
- Responsibility được điều phối
Page đứng ở trên cùng để:
- Lắp ráp
- Kết nối
- Điều phối
→ Giữ feature độc lập nhưng vẫn phối hợp được với nhau.

---
#### The Director and the Actors
🔹 Ẩn dụ để hiểu kiến trúc:
***🎭 Feature = Diễn viên***
- Biết rõ vai của mình
- Làm tốt business logic của mình
- Không quyết định khi nào “lên sân khấu”
***🎬 Page = Đạo diễn***
- Biết toàn cảnh vở diễn
- Khi Actor A (Cart) phát sự kiện  
→ Ra tín hiệu cho Actor B (Checkout) xuất hiện
Page:
- Điều phối
- Kết nối event
- Quyết định thứ tự và tương tác

---
### Hierarchy of Responsibilities
### 📊 Cấp bậc theo mức độ “biết”
🔹 **app/**  
→ Bootstrapping  
→ Biết tất cả (global state, routing)
🔹 **pages/**  
→ Orchestrate  
→ Biết nhiều feature  
→ Không biết logic bên trong từng feature
🔹 **features/**  
→ Domain  
→ Chỉ biết chính nó
🔹 **shared/**  
→ Utility / UI tái sử dụng  
→ Không biết gì về business (domain-agnostic)
### 🔻 Nguyên tắc quan trọng: Knowledge giảm dần từ trên xuống
app  
↓  
pages  
↓  
features  
↓  
shared
Layer càng thấp → càng ít biết về hệ thống.
## 🔁 Luồng đúng
```
Feature A ← Page → Feature B
```
