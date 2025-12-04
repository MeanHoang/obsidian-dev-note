Cơ bản là nó bất đồng bộ không cần res như API. Để đây nghiên cứu sau
Message được broker **đưa vào hàng đợi (queue)** hoặc **topic**, chờ các service nhận và xử lý.
Message broker ==là phần mềm trung gian (middleware) giúp các ứng dụng khác nhau giao tiếp với nhau một cách hiệu quả bằng cách nhận, lưu trữ và chuyển tiếp tin nhắn (messages)==.. Nói nôm na, nó như **người đưa thư hoặc trung gian** để các ứng dụng không cần kết nối trực tiếp với nhau nhưng vẫn trao đổi thông tin.
### 1. Chức năng chính của Message Broker:

- **Nhận và chuyển tiếp thông điệp**: Ứng dụng gửi thông điệp vào broker, broker sẽ chuyển tiếp đến ứng dụng nhận.
- **Giảm phụ thuộc giữa các hệ thống**: Ứng dụng gửi và nhận không cần biết địa chỉ hay trạng thái của nhau.
- **Hỗ trợ bất đồng bộ**: Ứng dụng gửi xong có thể tiếp tục làm việc mà không cần đợi ứng dụng nhận xử lý xong.
- **Đảm bảo tin cậy**: Nhiều broker có cơ chế lưu trữ tạm thời (persist), retry khi gửi thất bại, hoặc đảm bảo thông điệp chỉ được xử lý một lần (exactly-once delivery).

### 2. Các loại Message Broker phổ biến:
- **RabbitMQ**: Sử dụng mô hình queue, hỗ trợ các kiểu exchange để route message.
- **Apache Kafka**: Dùng cho xử lý luồng dữ liệu lớn (stream processing), mô hình publish-subscribe.
- **ActiveMQ**: Java-based, hỗ trợ queue và topic.
- **Redis Streams**: Redis có tính năng message broker đơn giản.

### 3. Ví dụ minh họa:
Giả sử bạn có một **ứng dụng bán hàng online**:
- Khi khách đặt hàng, hệ thống gửi thông điệp “đơn hàng mới” vào message broker.
- Broker chuyển thông điệp này đến các dịch vụ khác: **gửi email xác nhận**, **cập nhật kho hàng**, **tạo hóa đơn**, …
- Các dịch vụ nhận thông điệp xử lý độc lập, không cần kết nối trực tiếp với nhau.

Nói cách khác, **message broker giúp các hệ thống giao tiếp hiệu quả, linh hoạt và bền vững**, đặc biệt khi hệ thống lớn, phân tán hoặc có nhiều dịch vụ microservices.