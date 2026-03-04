https://dev.to/josephciullo/feature-driven-architecture-designing-scalable-applications-2ac6?ref=dailydev
## 📌 **Feature-Driven Architecture là gì?**
**Feature-Driven Architecture (FDA)** là một cách tổ chức mã để **tạo ứng dụng lớn dễ mở rộng**, bằng cách **sắp xếp code theo _features_ (chức năng)** thay vì theo _technical layers_ như `components/`, `hooks/`, `services/`…

---
## 🧠 **Tại sao cần tổ chức theo features?**
Khi app lớn dần:
- Code bị _rải rác_ khắp nơi
- Mỗi thay đổi đòi hỏi chỉnh nhiều file
- Khó theo dõi logic khi feature mới được thêm  
    ➡️ Đây là _scalability problem_ về mặt **code & cognitive load** — chứ không chỉ performance hay server.
---
## 💡 **Feature là gì?**
Một feature không chỉ là một màn hình UI — nó là:
- **Objective rõ ràng**
- **Behavior hoàn chỉnh**
- **Context đầy đủ**  
    (ví dụ tính năng “giỏ hàng”, “checkout”, “user profile”)
---
## 🧱 **Cách tổ chức FDA**
Thay vì tách theo kiểu kỹ thuật, bạn nhóm tất cả thứ cần cho một feature kể cả UI, logic, state, tests… vào cùng một thư mục:
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
Trong `index.ts`, chỉ _export_ những thứ cần dùng ra ngoài — mọi thứ còn lại giữ nội bộ.

---
## 📌 **Lợi ích của FDA**
🔥 **Giảm phụ thuộc code giữa các feature** — mỗi feature tự trị  
🔥 **Dễ thay đổi & mở rộng** — thêm feature mới mà không làm rối code hiện tại  
🔥 **Thuận lợi cho team lớn** – mỗi người/team có domain riêng  
🔥 **Context rõ ràng** – ai nhìn vào cũng thấy feature đó xử lý gì  
🔥 **Giảm “cognitive overhead”** cho developer mới vào dự án

---
## 🧠 **FDA không bác bỏ UI Component Design**
Bạn vẫn có thể (và nên) dùng những phương pháp như **Atomic Design** để tạo các _shared/components_ chung. Nhưng bây giờ:
- UI generic nằm trong `shared/components`
- Logic domain + feature cụ thể nằm trong `features/`
---
## 🤝 **Tóm lại**

> **Feature-Driven Architecture đặt “chức năng sản phẩm” làm trung tâm**, gói tất cả những gì liên quan vào một **feature module**, giúp codebase rõ ràng, dễ bảo trì và mở rộng khi dự án lớn hơn theo thời gian — đặc biệt khi nhiều dev cùng làm việc.