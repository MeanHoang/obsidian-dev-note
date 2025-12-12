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