**Magic number**: Những con số xuất hiện “trơ trọi” trong code không rõ ý nghĩa, không rõ vì sao lại là số đó
**Pronounceable Names**: Tên (biến, hàm, class, v.v.) có thể đọc thành lời một cách dễ dàng.
**God Class:** Ám chỉ hàm ôm đồm tất cả: biết quá nhiều, làm quá nhiều, điều khiển quá nhiều thứ trong hệ thống 
**Magic string:** Một chuổi ký tự đc viết "cứng" (hard-code) trước tiếp vào code. Không có tên, không có nghĩa rõ ràng 
Example: Magic String 
```js
if (user.role === "ADMIN") {
  // ...
}
if (request.status === "ACTIVE") {
  // ...
}
```
nên là 
```js
const USER_ROLE = {
  ADMIN: "ADMIN",
  USER: "USER",
};
const STATUS = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
};
if (user.role === USER_ROLE.ADMIN) {}
if (request.status === STATUS.ACTIVE) {}

```
**monadic:** Đơn ngôi - Ám chỉ hàm có 1 tham số
**dyadic:** Nhị ngôi - Ám chỉ hàm có 2 tham số
**sieve:** Sàng lọc (lọc dần, loại bỏ những phần tử không hợp lệ, chỉ giữ lại phần đúng.)
**temporal coupling:** xảy ra khi hai hoặc nhiều hành động phải được thực hiện theo một thứ tự nhất định, và nếu thứ tự sai thì code bị lỗi.
**Output argument**: Là khi bạn truyền 1 biến vào và hàm thay đổi trực tiếp biến đố thay vì trả giá trị 
**Stack trace**: (hay “dấu vết ngăn xếp”) là **bản ghi lại đường đi của chương trình** qua các hàm (function calls) **tại thời điểm xảy ra lỗi**.
**pseudo-code**: giả mã) là **cách mô tả thuật toán bằng ngôn ngữ gần giống tiếng Anh + một chút cú pháp lập trình**, để diễn tả logic mà không phụ thuộc vào bất kỳ ngôn ngữ lập trình nào.
**Boundaries**: (ranh giới) là **biên giới giữa các phần khác nhau của hệ thống**, nơi mà **một module, lớp, hoặc hệ thống giao tiếp với thế giới bên ngoài hoặc với module khác**.
**SOLID:** Là bộ 5 nguyên tắc thiết kế hướng đối tượng giúp code dễ hiểu, dễ maintain, dễ mở rộng 
**Antipattern**: à **những cách làm / giải pháp trong thiết kế hoặc lập trình _trông có vẻ đúng, quen thuộc hoặc tiện lúc ban đầu_, nhưng về lâu dài lại gây ra nhiều vấn đề hơn là lợi ích.**
**Frozen Caveman antipattern**:  **Kiến trúc sư hoặc dev bị “đóng băng” trong nỗi sợ cũ**, và **luôn áp cùng một mối lo ngại phi lý** cho mọi hệ thống mới, bất kể bối cảnh đã thay đổi.
Ví dụ làm 1 app quản lý sv có 3000 user và Dev B nói:
  “Không được! Lỡ mai mốt **1 triệu sinh viên** thì sao?”
👉 **Nỗi sợ từ quá khứ**, không phải từ yêu cầu hiện tại.
**technology bubble**: là hiện tượng khi **một công nghệ / xu hướng được thổi phồng quá mức giá trị thực**, khiến mọi người **đổ xô sử dụng** dù **chưa thật sự cần hoặc chưa hiểu rõ**.
**Echo chamber** : (buồng vọng âm) là hiện tượng khi **bạn chỉ nghe những ý kiến giống mình**, còn ý kiến trái chiều thì **bị loại bỏ hoặc xem nhẹ**. Kết quả: **niềm tin sai ngày càng được củng cố**, dù không đúng thực tế.
**LLM**: **(Large Language Model)** là **mô hình ngôn ngữ lớn** – một hệ thống AI được huấn luyện trên **khối lượng văn bản cực lớn** để **hiểu và sinh ngôn ngữ tự nhiên**
**Consumer**: (trong hệ thống phần mềm) là **thành phần NHẬN và XỬ LÝ dữ liệu / message / event** do **Producer** gửi ra.
**Extensibility**: (tính **dễ mở rộng về chức năng**) là khả năng của **hệ thống / code** cho phép **thêm tính năng mới** mà **không phải sửa nhiều code cũ**.
**Business drivers** là **những yếu tố kinh doanh cốt lõi thúc đẩy mọi quyết định** của sản phẩm, hệ thống và kiến trúc.
**Domain business** (hay **business domain**) là **lĩnh vực nghiệp vụ cốt lõi mà hệ thống đang phục vụ** – tức **“business thực sự đang làm gì”**, không phải công nghệ.
**Bottleneck Trap**: là một **anti-pattern trong tư duy thiết kế hệ thống**:  
team **chăm chăm tối ưu hoặc xử lý “nút thắt cổ chai” tưởng tượng**, trong khi **bottleneck thật sự lại nằm ở chỗ khác (hoặc chưa tồn tại)**.
**Performance tuning**:là quá trình tối ưu hệ thống (phần mềm, server, database, network…) để nó chạy **nhanh hơn, ổn định hơn và chịu tải tốt hơn**.
**Separation of Concerns (SoC)** là nguyên tắc thiết kế phần mềm: Mỗi phần của hệ thống chỉ nên chịu trách nhiệm cho **một mối quan tâm (concern)** cụ thể, không ôm đồm nhiều việc.