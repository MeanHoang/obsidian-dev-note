Vocabulary: [[SoftwareArchitecture vocabulary]]
Summary
- **Software architecture là gì:**  
    Kiến trúc phần mềm là cách mà một hệ thống phần mềm được tổ chức. Nó bao gồm nhiều khía cạnh khác nhau.

**4 khía cạnh của kiến trúc phần mềm:**
1. **Architecture style (Kiểu kiến trúc):**  
    Là điểm xuất phát, ví dụ như kiến trúc lớp (layered), kiến trúc microservices, client-server… Đây là “cách thức tổ chức chung” của hệ thống.
2. **Architecture characteristics (Đặc tính kiến trúc):**  
    Những tính chất mà kiến trúc phải hỗ trợ, ví dụ: hiệu năng (performance), khả năng mở rộng (scalability), độ tin cậy (reliability)…
3. **Logical components (Các thành phần logic):**  
    Những phần tử cấu thành hệ thống để thực hiện các hành vi cụ thể. Ví dụ: module, service, lớp…
4. **Architecture decisions (Các quyết định kiến trúc):**  
    Những quyết định giải thích **tại sao** kiến trúc được thiết kế như vậy, ví dụ chọn framework này, database này, mô hình phân tách service này…
### **“Everything in software architecture is a trade-off.”**
=> Tóm gọn lại là 1 kiến trúc sư phần mềm đã cần xác định các thông tin đặc tính kiến trúc, các phần logic từ đó tìm ra kiểu kiến trúc phù hợp
Ví dụ:
- Nếu hệ thống cần **scale mạnh**, mỗi phần phải chạy độc lập → chọn **[[Microservices]]**
- Nếu hệ thống đơn giản, đội nhỏ → chọn **[[Monolithic]] Layered**
- Nếu giao tiếp thời gian thực → chọn [[Event-driven]]
- Nếu nhiều workflow tuần tự → chọn [[Pipeline architecture]]
Không có cái nào là hoàn hảo chỉ có cái phù hợp nhất thôi. This is trade-off

**Lưu ý thiết kế cơ bản:**
- ==Presentation chỉ nên làm UI → không xử lý logic → không được đụng DB==
- ==Business và Service mới là nơi xử lý logic → được quyền truy cập DB==
Thế có thể tính logic để hiển thị thì đc mà nếu FE tự tính **logic nghiệp vụ**, như **xác định thưởng, thay đổi mốc, hoặc đưa ra quyết định kinh doanh** thì mới vi phạm
### **“Why is more important than how.”**
Trong kiến trúc, **lý do tại sao bạn chọn một giải pháp** quan trọng hơn việc **cách bạn triển khai nó**.
Kiến trúc không phải viết code theo pattern nào, mà là **đưa ra quyết định có lý do rõ ràng**.
### **"Most architecture decisions aren’t binary but rather exist on a spectrum between extremes."**
Không có lựa chọn kiến trúc nào là đúng - sai rõ ràng; mọi quyết định đều nằm giữa hai thái cực và phải chọn điểm phù hợp nhất với bối cảnh.

- Architect hướng dẫn (guide) team về _định hướng kiến trúc_, không áp đặt công nghệ.
- Team tự chọn công nghệ phù hợp trong phạm vi kiến trúc.
- Trong một số trường hợp đặc biệt (performance, scalability…), architect phải chọn công nghệ cụ thể.
- Việc tìm balance giữa _guide_ và _full control_ là kỹ năng khó nhất của kiến trúc sư.
- Liên tục phải kiểm tra xem kiến trúc có bị xuống cấp hay không 
- Liên tục cập nhập công nghệ mới vì Không cập nhật → quyết định dễ lỗi thời → cả hệ thống dính hậu quả.
- Một kiến trúc sư phải đảm bảo rằng **các team dev thực hiện đúng những quyết định và nguyên tắc kiến trúc** đã được đề ra.
- Một **software architect** phải **quen thuộc với nhiều công nghệ, framework, ngôn ngữ, nền tảng** — không cần giỏi tất cả, nhưng phải hiểu chúng hoạt động thế nào và dùng khi nào.

