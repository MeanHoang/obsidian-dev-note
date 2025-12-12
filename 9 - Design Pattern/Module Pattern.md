**Module Pattern** là một **design pattern trong JavaScript** dùng để **tổ chức code thành các đơn vị (module) riêng biệt**, **ẩn thông tin nội bộ** và **chỉ expose những gì cần thiết ra bên ngoài**.
# 🔹 Đặc điểm của Module Pattern
1. **Ẩn biến và hàm private**
    - Không thể truy cập từ bên ngoài module nếu không expose.
2. **Expose public API**
    - Chỉ những hàm hoặc biến cần thiết mới được trả ra ngoài.
3. **Giữ global namespace sạch**
    - Tránh trùng tên biến hoặc hàm.
4. **Có thể dùng closure để lưu state riêng tư**
# 🔹 Ví dụ JS
### Basic Module Pattern
```js
const counter = (function() {
  // private
  let count = 0;

  function log() {
    console.log(count);
  }

  // public API
  return {
    increment() { count++; log(); },
    reset() { count = 0; log(); }
  };
})();

counter.increment(); // 1
counter.increment(); // 2
counter.reset();     // 0
```
- `count` và `log()` là **private**
- `increment()` và `reset()` là **public**
- Global scope không bị lấp bởi biến trung gian
