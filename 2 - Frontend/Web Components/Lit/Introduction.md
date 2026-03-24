## 🔥 Lit là gì?

**Lit** là một thư viện nhẹ giúp bạn viết **Web Components dễ hơn, gọn hơn, có state “xịn” hơn**.
👉 Hiểu đơn giản:
 Lit = Web Components + syntax giống React (nhưng nhẹ hơn rất nhiều)
 
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
    this.innerHTML = `<button>${this.count}</button>`;
  }
}
```
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
- `count` → reactive (tự update UI)
- Không cần `render()` thủ công lại
- Code giống JSX nhẹ