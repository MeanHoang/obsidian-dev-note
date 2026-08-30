# 04 — Template & Slot

> `<template>` = HTML "ngủ đông" (không render, script không chạy, ảnh không load), dùng làm khuôn để clone.
> `<slot>` = chỗ trống trong shadow DOM nhận content từ light DOM — tương đương `children` của React.
> Điểm dễ nhầm nhất: **node được slot vẫn thuộc light DOM**, chỉ được *render* ở vị trí slot.

Series: [[00 - Roadmap Web Components - Lit]]
Note anh em: [[02 - Custom Elements]] · [[03 - Shadow DOM]] · [[05 - Styling - CSS API cua Component]]

---
## 🧊 1. `<template>` là gì

```html
<template id="tpl-card">
  <style>.card { border: 1px solid #ddd; padding: 12px; }</style>
  <div class="card"><slot></slot></div>
</template>
```
Browser **parse HTML nhưng không kích hoạt gì cả**:

| Thứ | Bên trong `<template>` |
| --- | --- |
| Render ra màn hình | ❌ |
| `<script>` bên trong | ❌ không chạy |
| `<img src>`, `<video>` | ❌ không load |
| CSS bên trong | ❌ không áp dụng |
| Custom element | ❌ không upgrade — constructor chưa chạy |
| `document.querySelector('.card')` | ❌ không thấy (ngoài document tree) |

Lý do chung: `template.content` **không thuộc document hiện tại** mà thuộc một document riêng do browser tạo (spec gọi là *template contents owner document*), không có browsing context → không có gì được kích hoạt.

Tất cả chỉ "thức dậy" khi clone và gắn vào DOM thật. **Vì sao hữu ích:** viết markup bằng HTML thật thay vì nối chuỗi `innerHTML`; parse **một lần** lúc load, mỗi instance chỉ tốn một lần clone; không có side effect ngoài ý muốn (ảnh không request, script không chạy sớm).

---
## 📦 2. `template.content` — `DocumentFragment`

`template.content` trả về một `DocumentFragment` chứa cây DOM bên trong (thuộc tính `content` là read-only, nhưng fragment thì vẫn mutate được). **Vì sao PHẢI clone:** `appendChild` một fragment sẽ **move các con ra khỏi fragment** — fragment thành rỗng.

```js
shadowRoot.appendChild(tpl.content);                            // ❌ instance đầu "ăn" hết, sau đó trống
shadowRoot.appendChild(tpl.content.cloneNode(true));            // ✅ deep clone, template giữ nguyên
shadowRoot.appendChild(document.importNode(tpl.content, true)); // ✅ clone + đổi node document sang document hiện tại
```

`cloneNode(true)` = deep clone (cả cây con); `cloneNode(false)` chỉ copy chính node đó. Khác biệt thật giữa hai cách nằm ở **node document của bản copy**: `cloneNode()` giữ node document của node gốc — tức document riêng của template — còn `importNode()` clone **trong ngữ cảnh document gọi nó**. Node document quyết định `CustomElementRegistry` nào được dùng để construct custom element, nên MDN khuyến nghị clone `template.content` bằng `document.importNode()` để custom element con được construct theo definition của document hiện tại. Với `cloneNode()` thì chúng chỉ được upgrade muộn hơn, lúc bị adopt vào document khi insert.

> ⚠️ Expando property (`node.myData = ...`) **không bao giờ** được `cloneNode`/`importNode` copy — clone chỉ copy attribute. Muốn data đi theo clone thì để trong attribute (`data-*`), gắn lên fragment hay lên element con đều vô ích.

---
## ⚡ 3. Pattern chuẩn: template ở module scope

```js
const template = document.createElement('template');   // parse 1 lần cho cả module
template.innerHTML = `
  <style>:host { display: block; } .card { border: 1px solid #ddd; padding: 12px; }</style>
  <div class="card"><p class="title"></p><slot></slot></div>`;

class MyCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true)); // clone cho mỗi instance
  }
  connectedCallback() {
    this.shadowRoot.querySelector('.title').textContent = this.getAttribute('title') ?? '';
  }
}
customElements.define('my-card', MyCard);
```

Render 1000 card = **1 lần parse + 1000 lần clone** thay vì 1000 lần parse. Lit làm đúng chuyện này bên dưới (cache template theo *strings array*).

---
## 🕳 4. `<slot>` — chỗ trống nhận content từ ngoài

```html
<!-- trong shadow DOM -->            <!-- khi dùng -->
<slot name="header">Chưa có</slot>   <my-card>
<slot></slot>                          <h2 slot="header">Tiêu đề</h2>
                                       <p>Rơi vào default slot</p>  </my-card>
```

| | Trong shadow DOM | Khi dùng |
| --- | --- | --- |
| Default slot | `<slot></slot>` | mọi node **không có** attribute `slot` |
| Named slot | `<slot name="header">` | `<div slot="header">` |

- Chỉ nên có **một** default slot; cái thứ hai luôn rỗng. Text node trần cũng vào default slot.
- Attribute `slot` chỉ tác dụng trên **con trực tiếp** của host. `<div><span slot="x">` lồng sâu → không được slot.
- **Fallback content** = nội dung nằm *bên trong* `<slot>`, chỉ hiện khi không có gì được assign: `<slot name="footer"><button>OK</button></slot>`.
- **Nhiều node cùng slot name** hợp lệ, render theo thứ tự xuất hiện trong light DOM (vd hai `<button slot="actions">`).

---
## 🌳 5. Light DOM vs Shadow DOM vs Flattened tree ⭐

```
LIGHT DOM (bạn viết)            SHADOW DOM (component tự dựng)
<my-card>                        #shadow-root
 ├─ <h2 slot="header">           └─ <div class="card">
 └─ <p>                              ├─ <slot name="header">
                                     └─ <slot>
        ▼  FLATTENED TREE (cái browser thực sự render)
   <my-card>
     └─ <div class="card">
          ├─ <slot name="header">
          │    └─ <h2 slot="header">   ← vẫn là node của LIGHT DOM
          └─ <slot>
               └─ <p>                  ← vẫn là node của LIGHT DOM
```

> **`flattened tree`** — cây có được sau khi browser phân phối (assign) slottable của light DOM vào các `<slot>`; đây là cây thực sự được layout và render. 📖 [DOM Standard — Assigning slottables and slots](https://dom.spec.whatwg.org/#assigning-slotables-and-slots)

**Node được slot vẫn thuộc light DOM**, chỉ được *render* ở vị trí slot. Hệ quả:

| Câu hỏi | Trả lời |
| --- | --- |
| `document.querySelector('h2')` thấy nó? | ✅ có |
| `card.shadowRoot.querySelector('h2')` | ❌ không thuộc shadow tree |
| `h2.parentNode` | `<my-card>` (host), **không phải** `<slot>` |
| `h2.getRootNode()` | `document` |
| CSS nào style nó? | **CSS ngoài**, không phải `<style>` trong shadow |
| Style từ trong shadow? | chỉ qua `::slotted()`, và chỉ con trực tiếp |

```css
/* trong shadow DOM */
h2                { color: red; }             /* ❌ h2 không thuộc shadow tree */
::slotted(h2)     { color: red; }             /* ✅ */
::slotted(div h2) { color: red; }             /* ❌ chỉ nhận compound selector 1 cấp */
slot[name=header]::slotted(*) { margin: 0; }  /* ✅ nhắm theo slot cụ thể */
```

> CSS ngoài **luôn thắng** `::slotted()` với declaration thường — **không phụ thuộc specificity**: trong cascade sorting order, bước *Context* (outer tree thắng) đứng **trước** bước specificity. Ngược lại, `!important` từ trong shadow tree thắng `!important` ở ngoài. → `::slotted()` chỉ nên set default.

---
## 🔌 6. API của `HTMLSlotElement`

```js
const slot = this.shadowRoot.querySelector('slot[name="header"]');
slot.assignedNodes()                   // [Node] — kể cả text node; đúng những node được assign vào slot này
slot.assignedNodes({ flatten: true })  // + node được assign vào các <slot> con; không có gì → trả fallback content
slot.assignedElements()                // chỉ Element — 90% trường hợp dùng cái này
slot.name                              // 'header'
slot.addEventListener('slotchange', () => console.log(slot.assignedElements()));

const h2 = document.querySelector('my-card > h2');
h2.slot;          // 'header' — chính là attribute slot
h2.assignedSlot;  // <slot name="header"> | null
```

`slotchange` fire khi **danh sách node được assign** thay đổi (thêm/bớt con, đổi attribute `slot`):

- ⚠️ **Không** fire khi chỉ nội dung *bên trong* node đã slot đổi (vd đổi `textContent`) → cần `MutationObserver`.
- Fire **một lần lúc đầu** nếu có node được assign ngay khi slot vào shadow tree; slot rỗng từ đầu thì không fire (không có gì thay đổi).
- `bubbles: true` nhưng **`composed: false`** → bubble tới shadow root rồi dừng. Đây là event chuẩn hiếm hoi vừa bubble vừa không composed.

---
## ✋ 7. `slotAssignment: 'manual'` + `slot.assign()`

Mặc định là **named assignment** (browser tự match `slot="x"` ↔ `<slot name="x">`). Chế độ `manual` tắt cơ chế đó, bạn tự chỉ định:

```js
constructor() {
  super();
  this.attachShadow({ mode: 'open', slotAssignment: 'manual' });
  this.shadowRoot.innerHTML = `<div class="panel"><slot></slot></div>`;
}
showPanel(i) {
  const panels = this.querySelectorAll(':scope > section');
  this.shadowRoot.querySelector('slot').assign(panels[i]);  // chỉ render 1 panel
}
```

Bản declarative: `<template shadowrootmode="open" shadowrootslotassignment="manual">` (giá trị: `named` — mặc định, hoặc `manual`). **Dùng khi nào:** component tự quyết định *node nào* được hiện (tab, carousel, accordion) mà không bắt user gắn attribute `slot`, và không phải mutate DOM của user để đổi mapping.

- `assign()` không tham số → xoá hết assignment (rơi về fallback).
- Gọi `assign()` trên shadow root chế độ `named` → ném `NotAllowedError`. Không trộn hai chế độ được.
- Support: Baseline *widely available* từ 03/2023.

---
## 🧩 8. Ví dụ hoàn chỉnh — `<my-card>` 3 slot

```js
const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host { display: block; border: 1px solid #e2e2e2; border-radius: 10px; overflow: hidden; }
    .header { padding: 10px 14px; background: #fafafa; border-bottom: 1px solid #eee; }
    .header[data-empty] { display: none; }        /* ẩn khi không có content */
    .body { padding: 14px; }  .footer { padding: 10px 14px; border-top: 1px solid #eee; }
    ::slotted(h2) { margin: 0; font-size: 16px; }
  </style>
  <div class="header" part="header"><slot name="header"></slot></div>
  <div class="body" part="body"><slot>Chưa có nội dung.</slot></div>
  <div class="footer" part="footer"><slot name="footer"><button>Đóng</button></slot></div>`;

class MyCard extends HTMLElement {
  #headerSlot; #headerBox;
  constructor() {
    super();
    const root = this.attachShadow({ mode: 'open' });
    root.appendChild(template.content.cloneNode(true));
    this.#headerSlot = root.querySelector('slot[name="header"]');
    this.#headerBox  = root.querySelector('.header');
  }
  connectedCallback() {
    this.#headerSlot.addEventListener('slotchange', this.#syncHeader);
    this.#syncHeader();   // slotchange không fire khi slot rỗng ngay từ đầu
  }
  disconnectedCallback() { this.#headerSlot.removeEventListener('slotchange', this.#syncHeader); }
  #syncHeader = () => {
    this.#headerBox.toggleAttribute('data-empty', this.#headerSlot.assignedElements().length === 0);
  };
}
customElements.define('my-card', MyCard);
```

```html
<my-card>
  <h2 slot="header">Hoá đơn #1042</h2>
  <p>Tổng cộng: 1.250.000đ</p>
  <button slot="footer">Thanh toán</button>
</my-card>
<my-card></my-card>   <!-- header tự ẩn, body dùng fallback, footer nút mặc định -->
```

---
## 🔀 9. So sánh với React / Vue

| | Web Components | React | Vue |
| --- | --- | --- | --- |
| Default slot | `<slot></slot>` | `props.children` | `<slot></slot>` |
| Named slot | `<slot name="x">` ↔ `slot="x"` | prop kiểu `header={<h2/>}` | `<slot name="x">` ↔ `v-slot:x` |
| Fallback | content bên trong `<slot>` | `children ?? <Default/>` | content bên trong `<slot>` |
| Node thuộc về ai | **light DOM của user** | cây React của parent | cây render của parent |
| Style áp dụng | CSS **ngoài** thắng; trong dùng `::slotted()` | CSS nơi khai báo | CSS nơi khai báo (`:slotted()`) |
| Truyền data vào slot | ❌ không có | render prop: `children(data)` | scoped slot: `<slot :item="x">` |
| Biết slot có content? | `assignedElements().length` | `React.Children.count` | `$slots.x` |

> Khác biệt lớn nhất: **scoped slot** — Web Components không truyền được data từ component ra cho content của slot. Workaround: set property lên node đã slot (`assignedElements()[0].item = data`), hoặc CSS custom property / context.

---
## ⚠️ Bẫy thường gặp

1. **`appendChild(tpl.content)` không clone** → instance đầu chạy, các instance sau trống. Luôn `cloneNode(true)`.
2. **Style trong shadow không ăn vào node được slot** — chúng thuộc light DOM. Dùng `::slotted()`, và nhớ nó chỉ chọn con trực tiếp.
3. **`slot="x"` trên node lồng sâu** vô tác dụng — chỉ con trực tiếp của host mới slottable.
4. **`slotchange` không fire khi text bên trong node đã slot đổi** → cần `MutationObserver`.
5. **Hai `<slot>` không tên** trong cùng shadow root → cái thứ hai luôn rỗng. Và **quên fallback** → component trống hoác khi user không truyền gì.
6. **`shadowRoot.querySelector` không tìm thấy node được slot** → phải qua `slot.assignedElements()`.
7. **Mutate attribute `slot` của user** để điều khiển hiển thị → đụng DOM của người khác. Dùng `slotAssignment: 'manual'`.
8. **Đặt `<template>` bên trong mỗi instance** → parse lại mỗi lần. Đặt ở module scope.
9. **`template.content` luôn thuộc một document khác** → custom element bên trong chưa upgrade. `document.importNode(tpl.content, true)` construct chúng theo registry của document hiện tại; `cloneNode(true)` thì phải đợi tới lúc insert.

---
## 📚 Nguồn

- [MDN — Using templates and slots](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_templates_and_slots) · [`<template>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/template) (danh sách attribute `shadowroot*`)
- [MDN — `HTMLSlotElement`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLSlotElement) · [`assignedNodes()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLSlotElement/assignedNodes) · [`assign()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLSlotElement/assign) · [`slotchange`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLSlotElement/slotchange_event) · [`::slotted()`](https://developer.mozilla.org/en-US/docs/Web/CSS/::slotted)
- [MDN — `document.importNode()`](https://developer.mozilla.org/en-US/docs/Web/API/Document/importNode) (khác biệt với `cloneNode`, `CustomElementRegistry`)
- [DOM Standard — Assigning slottables and slots](https://dom.spec.whatwg.org/#assigning-slotables-and-slots) · [HTML Standard — `<template>`](https://html.spec.whatwg.org/multipage/scripting.html#the-template-element)
- [CSS Shadow Parts/Scoping — `::slotted()`](https://drafts.csswg.org/css-shadow-1/#slotted-pseudo) · [CSS Cascade 4 — Cascade Sorting Order (bước *Context*)](https://drafts.csswg.org/css-cascade-4/#cascade-sort)
