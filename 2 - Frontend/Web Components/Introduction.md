**Web Components** là tính năng **built-in của browser** (Chrome, Firefox, Safari...) cho phép tạo **HTML tag riêng**.
Bình thường browser có sẵn `<button>`, `<input>`, `<div>`... Web Components cho phép bạn tạo tag tùy ý như `<joy-button>`, `<joy-modal>`.
**Web Components** là một tập hợp các tiêu chuẩn của trình duyệt cho phép bạn tạo ra **component UI tái sử dụng** (giống React component) nhưng **không cần framework** như React hay Vue.js.
Nói đơn giản:  
👉 Bạn có thể tạo **HTML tag riêng của bạn** và dùng lại ở bất kỳ đâu.
### 3 công nghệ cốt lõi:

| Công nghệ           | Giải thích đơn giản                                                            |
| ------------------- | ------------------------------------------------------------------------------ |
| **Custom Elements** | Đăng ký tag HTML mới, ví dụ `<joy-button>`                                     |
| **Shadow DOM**      | Tạo "hộp kín" cho CSS — style bên trong không ảnh hưởng bên ngoài và ngược lại |
| **HTML Templates**  | Khuôn mẫu HTML có thể tái sử dụng                                              |
## 🔧 3 thành phần chính của Web Components
### 1. **Custom Elements**
Cho phép bạn tạo thẻ HTML riêng
```html
<my-button></my-button>
```
```js
class MyButton extends HTMLElement {  
connectedCallback() {  
this.innerHTML = `<button>Click me</button>`;  
}  
}  
customElements.define("my-button", MyButton);
```
⚠️ Ví dụ trên chỉ để cho dễ hiểu, **đừng bê vào production**: `connectedCallback` chạy lại **mỗi lần** element được gắn lại vào DOM (kể cả khi bị `appendChild` sang chỗ khác), nên `innerHTML` sẽ ghi đè lại toàn bộ → mất mọi event listener và state đã gắn bên trong.
👉 Cách đúng: dựng DOM **một lần** trong `constructor` (hoặc dùng cờ đánh dấu đã render), rồi chỉ update phần thay đổi.
### 2. **Shadow DOM**
Tạo **DOM riêng biệt**, không bị CSS bên ngoài ảnh hưởng
👉 Giống kiểu “style riêng, không sợ bị đè”
```js
this.attachShadow({ mode: "open" });
this.shadowRoot.innerHTML = `<style>button { color: red }</style><button>Click</button>`;
```
👉 Không kín 100%: các property **kế thừa** (`color`, `font`, `line-height`…) và **CSS custom property** (`--xxx`) vẫn xuyên từ ngoài vào — đó là cách chủ động để cho phép theme component.
### 3. **HTML Templates**
Tạo template sẵn, dùng lại nhiều lần
```html
<template id="my-template">
  <p>Hello World</p>
</template>
```

---
## ⚡ Ưu điểm
- Không phụ thuộc framework
- Tái sử dụng cao
- Encapsulation tốt (nhờ Shadow DOM)
- Chạy thẳng bằng API của browser → không phải tải runtime của framework
---
## ❌ Nhược điểm
- Code hơi verbose (dài hơn React)
- Không có reactive state / diffing sẵn — phải tự viết hoặc dùng Lit
- Ecosystem nhỏ hơn React: có Lit, Shoelace, Material Web… nhưng ít component library và ít tài liệu/tooling hơn nhiều
---
## 🧠 So sánh nhanh

|                        | Web Components               | React                          |
| ---------------------- | ---------------------------- | ------------------------------ |
| Cần runtime/build tool | ❌ không                      | ✅ có                           |
| Reusable               | ✅                            | ✅                              |
| Reactive state         | ❌ tự làm (hoặc dùng Lit)     | ✅ có sẵn (`useState`…)         |
| Style encapsulation    | ✅ Shadow DOM (native)        | ❌ tự lo (CSS Modules, CSS-in-JS) |
## 📌 Khi nào nên dùng?
👉 Dùng Web Components khi:
- Muốn tạo **UI library dùng chung nhiều project**
- Muốn **không phụ thuộc framework**
- Làm **design system**
👉 Không nên dùng nếu:
- Làm app lớn cần state phức tạp → nên dùng React hoặc Angular
