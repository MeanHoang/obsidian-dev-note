# 🧩 **Ref trong `<div>` là gì?**
Trong React, **ref** dùng để truy cập trực tiếp vào **DOM element** hoặc **giá trị** của một component, thay vì thông qua state.
Khi bạn gắn ref vào một `<div>`, bạn có thể làm những việc như:
- Lấy chiều cao / chiều rộng của div
- Cuộn tới div
- Focus, scrollIntoView
- Thao tác với classList
- Làm animation…
- Dùng trong intersection observer để detect khi div xuất hiện trên màn hình
Lưu ý quan trọng
- **ref không dùng để truyền dữ liệu** → dùng state, props
- Chỉ dùng ref khi cần truy cập DOM thật
- Gắn ref vào **function component** thì cần `forwardRef`
- phần tử trong div load mới ref không load lại