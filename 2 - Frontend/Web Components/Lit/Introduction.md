## 🔥 Lit là gì?

**Lit** là một thư viện nhẹ giúp bạn viết **Web Components dễ hơn, gọn hơn, có state “xịn” hơn**.
👉 Hiểu đơn giản:
 Lit = Web Components + reactive state + template gọn — cả thư viện chỉ **~5 KB** (minified + gzip, theo lit.dev)
 
---
## 🧠 Vấn đề Lit giải quyết
Web Components thuần có vấn đề:
- Code dài, khó đọc
- Update UI thủ công (`innerHTML`)
- Không có reactive state
👉 Lit giải quyết hết:
- Reactive state
- Template đẹp
- Auto re-render
---
## ⚡ Ví dụ so sánh
### ❌ Web Components thuần (khá mệt)
```js
class Counter extends HTMLElement {
  count = 0;

  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `<button>${this.count}</button>`;   // ⚠️ ghi đè cả cây con → mất listener
  }
}

customElements.define('my-counter-vanilla', Counter);   // ⚠️ thiếu dòng này thì tag không chạy
```
👉 Và `count++` cũng **không** tự gọi lại `render()` — phải tự gọi tay.
### ✅ Lit (gọn + sạch hơn nhiều)
```js
import { LitElement, html } from 'lit';

class Counter extends LitElement {
  static properties = {
    count: { type: Number }
  };

  constructor() {
    super();
    this.count = 0;
  }

  render() {
    return html`
      <button @click=${() => this.count++}>
        Count: ${this.count}
      </button>
    `;
  }
}

customElements.define('my-counter', Counter);
```
👉 Điểm khác biệt:
- `count` → reactive property: đổi giá trị là Lit tự schedule re-render
- Không phải tự gọi `render()`, và Lit chỉ update đúng phần expression thay đổi chứ không ghi đè cả cây con
- Template là **tagged template literal** (`` html`...` ``) — không phải JSX, không cần build step