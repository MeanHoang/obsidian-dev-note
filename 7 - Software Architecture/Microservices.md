==scale tốt, độc lập, nhưng phức tạp, tốn chi phí vận hành==
DDD - Driven Domain Design
**Microservices** (kiến trúc vi dịch vụ) là một **mô hình thiết kế phần mềm** trong đó một ứng dụng lớn được chia thành **nhiều dịch vụ nhỏ, độc lập**, mỗi dịch vụ đảm nhận **một chức năng cụ thể**.
Mỗi dịch vụ:
- Có **codebase riêng**
- Có **database riêng**
- Có thể **triển khai và mở rộng độc lập*
- Giao tiếp với các dịch vụ khác thông qua **API** hoặc **[[Message Broker]]**.
=> Nói cách khác: thay vì xây một ứng dụng lớn ([[Monolithic]]), bạn tách thành nhiều “ứng dụng nhỏ” hợp tác với nhau.