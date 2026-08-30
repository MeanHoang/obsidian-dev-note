# 03 — Shadow DOM

> **Shadow DOM = một cây DOM riêng, gắn vào 1 element, được browser render nhưng **tách biệt** khỏi document chính.** Đây là thứ cho ta *style encapsulation* và *DOM encapsulation* thật sự — không phải hack bằng BEM hay CSS-in-JS.
>
> Series: [[00 - Roadmap Web Components - Lit]]
> Note anh em: [[02 - Custom Elements]] · [[04 - Template va Slot]] · [[05 - Styling - CSS API cua Component]] · [[06 - Events va giao tiep]] · [[07 - API nang cao - ElementInternals, Form-associated, DSD]]

---

## 🌑 1. Shadow DOM là gì

Bình thường 1 document chỉ có 1 cây DOM. Shadow DOM cho phép **gắn thêm cây con "ẩn"** vào một element: cây đó được render ra màn hình, nhưng **không nằm trong** `document.querySelectorAll('*')` và CSS ngoài **không selector được vào trong**.

### Thuật ngữ (thuộc lòng, doc nào cũng dùng)

| Term | Nghĩa |
| --- | --- |
| **shadow host** | Element thường mà ta gắn shadow root vào (vd `<x-card>`) |
| **shadow root** | Node gốc của cây shadow — `ShadowRoot`, là 1 `DocumentFragment` |
| **shadow tree** | Toàn bộ cây DOM bên trong shadow root |
| **shadow boundary** | Ranh giới giữa shadow tree và DOM thường |
| **light DOM** | Con "thật" của host trong markup — cái user viết giữa `<x-card>...</x-card>` |
| **flattened DOM tree** | Cây browser thật sự render = shadow tree + light DOM đã được nhét vào `<slot>` |

```
<x-card>                             ← shadow host
  ├── #shadow-root                   ← shadow root  ─┐
  │     ├── <style>                                  │ shadow tree
  │     ├── <div class="box"> → <slot>               │ (component tự viết)
  │     └── <div class="footer">                    ─┘
  └── <p>Hello</p>                   ← light DOM (user viết)

khi render, browser "làm phẳng" — light DOM được chiếu vào vị trí <slot>:
  flattened tree = <x-card> → div.box → <p>Hello</p> → div.footer
```

> ⚠️ Node light DOM **không bị move** vào shadow tree. Nó vẫn là con của host trong DOM thật; chỉ *vị trí render* đổi. `p.parentElement` vẫn là `<x-card>`.

---

## 🔧 2. `attachShadow()`

```js
const root = host.attachShadow({
  mode: 'open',            // BẮT BUỘC: 'open' | 'closed'
  delegatesFocus: false,   // optional
  slotAssignment: 'named', // optional: 'named' | 'manual'
  clonable: false,         // optional: giữ shadow root khi cloneNode()/importNode()
  serializable: false,     // optional: cho getHTML({ serializableShadowRoots: true })
});
```

Trả về `ShadowRoot`. Với custom element thì host chính là `this` — gọi trong `constructor()` là hợp lệ (chưa đụng attribute/children):

```js
class XCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).innerHTML = `
      <style>:host { display: block; border: 1px solid #ddd; padding: 12px }</style>
      <slot></slot>`;
  }
}
customElements.define('x-card', XCard);
```

### `open` vs `closed`

| | `open` | `closed` |
| --- | --- | --- |
| `host.shadowRoot` | `ShadowRoot` | `null` |
| Bên ngoài chọc vào được? | có | "khó hơn", **không phải không thể** |
| Devtools thấy? | có | có (`#shadow-root (closed)`) |
| Dùng thực tế | ~99% | hiếm |

**`closed` KHÔNG phải cơ chế bảo mật:** (1) component vẫn phải tự giữ reference (`this.#root = this.attachShadow(...)`) → lỡ lộ instance là lộ root; (2) trang có thể **patch `Element.prototype.attachShadow`** *trước khi* component chạy, ép mở và thu hết mọi root; (3) cùng origin, cùng JS realm → **không có ranh giới bảo mật nào** cả. Muốn bảo mật thật: `<iframe>` khác origin.

```js
const orig = Element.prototype.attachShadow;
Element.prototype.attachShadow = function (init) {
  const root = orig.call(this, { ...init, mode: 'open' }); // ép mở
  (window.__stolen ??= new WeakMap()).set(this, root);
  return root;
};
```

Đổi lại `closed` gây khổ thật: khó test, khó debug từ console, a11y tooling và framework wrapper đều vướng. **→ Cứ dùng `open`.**

### `delegatesFocus: true`

Click vùng non-focusable trong shadow → focus nhảy vào element focusable **đầu tiên** bên trong; host match `:focus`; `host.focus()` focus vào trong. Rất hợp cho `<x-input>` wrap `<input>`.

### `slotAssignment: 'manual'`

Mặc định `'named'`: browser tự map theo attribute `slot="..."`. Với `'manual'` thì tự gán bằng JS (`slotEl.assign(node)`) — dùng khi cần chọn node theo logic (vd tab đang active), không muốn ép author viết `slot="..."`. Chi tiết ở [[04 - Template va Slot]].

### Element nào KHÔNG attach shadow được

DOM Standard định nghĩa một **allow-list** (*valid shadow host name*): autonomous custom element (tên có dấu `-`) và đúng 18 tag HTML — `article`, `aside`, `blockquote`, `body`, `div`, `footer`, `h1`–`h6`, `header`, `main`, `nav`, `p`, `section`, `span`.

Mọi thứ khác → ném `NotSupportedError`: `<input>`, `<img>`, `<button>`, `<select>`, `<textarea>`, `<a>`, `<table>`, `<ul>`, `<li>`, `<video>`… (nhiều tag trong số đó *đã* có shadow DOM nội bộ của UA rồi). Cũng `NotSupportedError` khi:

- gọi `attachShadow()` lần 2 lên element đã có shadow root — **trừ** trường hợp root đó là *declarative* (DSD) và `mode` trùng khớp: khi đó browser **xoá sạch nội dung và trả về chính root cũ**, không ném;
- class custom element khai `static disabledFeatures = ['shadow']`.

---

## 🎨 3. Style encapsulation — cái gì lọt, cái gì không

| Thứ | Từ ngoài vào trong shadow? | Ghi chú |
| --- | --- | --- |
| Selector thường (`.btn`, `#id`, `div p`) | ❌ | Bị chặn hoàn toàn |
| Global reset / Tailwind utilities | ❌ | Lý do Tailwind "chết" trong shadow → [[05 - Styling - CSS API cua Component]] |
| **CSS custom properties** (`--x`) | ✅ | Kế thừa nên xuyên qua — kênh theming chính |
| **Inherited properties** (`color`, `font-*`, `line-height`, `letter-spacing`, `visibility`, `cursor`) | ✅ | Kế thừa từ host xuống, trừ khi shadow tự set đè |
| `::part(name)` | ✅ | Chỉ những element component **chủ đích** đánh `part` |
| `::slotted(sel)` | ✅ (từ trong ra) | Style node light DOM được slot vào, chỉ top-level |
| `:host`, `:host()` | (từ trong) | Style chính host. `:host-context()` chỉ Chromium, đã deprecated → [[05 - Styling - CSS API cua Component]] |
| Style vào **host** từ ngoài (`x-card { padding: 8px }`) | ✅ | Host là element **thường**, nằm ở document → CSS ngoài chọn được bình thường |

### Ai thắng ai ở host? (`!important` — chỗ nhiều người tưởng sai)

Shadow tree là một **`encapsulation context`** riêng. CSS Cascade 5 § *Cascade Sorting Order* xếp theo thứ tự: **① Origin & Importance → ② Context → ③ Element-Attached Styles → ④ Layers → ⑤ Specificity → ⑥ Order of Appearance**. Vì Importance được so **trước** Context nên phải đọc 2 bước, và spec nói về bước ② nguyên văn:

> "When comparing two declarations that are sourced from different **encapsulation contexts**, then for **normal** rules the declaration from the **outer** context wins, and for **important** rules the declaration from the **inner** context wins."

| Trường hợp | Bước quyết định | Thắng |
| --- | --- | --- |
| `x-card { color: red }` vs `:host { color: blue }` (cùng normal) | ② Context | 🟢 **Ngoài** → red |
| `x-card { color: red !important }` vs `:host { color: blue }` | ① Importance | 🟢 Ngoài → red |
| `x-card { color: red !important }` vs `:host { color: blue !important }` | ① hoà → ② Context | 🔵 **Trong** → blue |

👉 Ngược với trực giác: `!important` **từ ngoài KHÔNG đè** được `!important` trong `:host`. Đúng ý spec: *"normal declarations ... set defaults that are easily overridden by the outer context, while important declarations ... can enforce requirements that cannot be overridden by the outer context."* Nên `:host` = **default styles**; chỉ dùng `!important` trong shadow cho ràng buộc mà component không cho phá.

---

## 🚧 4. DOM encapsulation

| API | Trả về |
| --- | --- |
| `element.shadowRoot` | `ShadowRoot` nếu `open`, `null` nếu `closed`/chưa attach |
| `node.getRootNode()` | Root gần nhất — là `ShadowRoot` nếu node nằm trong shadow |
| `node.getRootNode({ composed: true })` | Luôn trèo hết mọi boundary → `document` |
| `shadowRoot.host` | Ngược lại: từ root về host |
| `node.isConnected` | `true` nếu node nằm trong 1 document *qua cả shadow tree* |
| `shadowRoot.activeElement` | Element đang focus **trong** shadow đó |

```js
document.querySelectorAll('button').length; // 0 — không thấy button trong shadow
const inner = host.shadowRoot.querySelector('.box'); // ✅ đúng đường
inner.getRootNode() === host.shadowRoot;    // true
inner.getRootNode({ composed: true });      // #document
inner.closest('body');                      // null! closest() không vượt boundary
```

> 💡 `closest()`, `matches()`, `parentElement` đều **dừng ở shadow boundary**. Muốn đi lên tiếp: `node.getRootNode().host`.

---

## ⭐ 5. Event retargeting

Event bay từ trong shadow ra ngoài sẽ bị **đổi `target` thành host** — để bên ngoài không "nhìn thấy" chi tiết implementation.

```js
class XBtn extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).innerHTML = `<button id="inner">Go</button>`;
    this.shadowRoot.querySelector('#inner').addEventListener('click', (e) => {
      console.log('trong shadow → target =', e.target.id);    // "inner"
    });
  }
}
customElements.define('x-btn', XBtn);

document.addEventListener('click', (e) => {
  console.log('ngoài → target =', e.target.tagName);          // "X-BTN" ← retargeted
  console.log('composedPath()[0] =', e.composedPath()[0].id); // "inner" ← path thật
});
```

Hai flag quyết định: `bubbles` (nổi lên cha) và `composed` (**vượt shadow boundary**). Hầu hết UI event built-in có `composed: true` (`click`, `focus`, `input`, `keydown`…). Ngược lại `slotchange` và **`new CustomEvent()` mặc định** là `composed: false` → event tự chế mắc kẹt trong shadow nếu quên bật.

```js
this.dispatchEvent(new CustomEvent('x-change', { bubbles: true }));                 // ❌ kẹt
this.dispatchEvent(new CustomEvent('x-change', { bubbles: true, composed: true })); // ✅
```

`e.composedPath()` trả về mảng node **thật** mà event đi qua (từ trong ra ngoài, không bị retarget) — cách duy nhất để biết chính xác node nào bị click. Chi tiết sâu (event delegation, custom event API design) ở [[06 - Events va giao tiep]].

---

## 🔩 6. Shadow DOM ảnh hưởng tới thứ khác

**Focus** — tab order vẫn đi vào shadow bình thường (theo flattened tree), nhưng `document.activeElement` **trả về host**. Muốn đào sâu:

```js
function deepActiveElement(root = document) {
  let el = root.activeElement;
  while (el?.shadowRoot?.activeElement) el = el.shadowRoot.activeElement;
  return el;
}
```

**Form** — `<input>` trong shadow **không tự động** tham gia `<form>` bao ngoài: không có trong `form.elements`, không submit, không validate. Fix bằng form-associated custom element + `ElementInternals` → [[07 - API nang cao - ElementInternals, Form-associated, DSD]].

**A11y / ARIA** — role và accessible name hoạt động bình thường trong flattened tree, nhưng **reference bằng `id` chỉ resolve trong cùng một tree**: `aria-labelledby`, `aria-controls`, `for` không xuyên boundary, thất bại im lặng.

> **`ARIA element reflection`** — set reference bằng *object element* thay vì chuỗi `id`: `input.ariaLabelledByElements = [el]`. Target được phép nằm **cùng scope hoặc scope cha** (trong shadow trỏ ra ngoài: ✅) nhưng **không** trỏ vào shadow lồng bên trong (ngoài trỏ vào trong: ❌). Baseline 04/2025. 📖 [MDN — Reflected element references](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Reflected_attributes#reflected_element_references)

Với custom element, default semantics đặt qua `internals.role` / `internals.ariaLabel` (`ElementInternals`, Baseline 03/2023). Đơn giản nhất: giữ cặp label + control **trong cùng 1 tree**.

**SEO / SSR** — Google Search: *"When Google renders a page, it flattens the shadow DOM and light DOM content"* → nội dung trong shadow **vẫn index được**, miễn nó thực sự render ra. Điều kiện là JS phải chạy được ở lượt render. SSR ra HTML tĩnh không có shadow → nhấp nháy khi hydrate; giải bằng Declarative Shadow DOM.

---

## 📜 7. Declarative Shadow DOM (nhắc nhanh)

Tạo shadow root **thuần HTML**, không cần JS chạy trước:

```html
<x-card>
  <template shadowrootmode="open">
    <style>:host { display: block; border: 1px solid #ddd }</style>
    <slot></slot>
  </template>
  <p>Hello</p>
</x-card>
```

Attribute kèm theo: `shadowrootdelegatesfocus`, `shadowrootclonable`, `shadowrootserializable`. Chỉ hoạt động khi HTML đi qua **parser** — `innerHTML` bỏ qua nó, phải dùng `setHTMLUnsafe()` / `parseHTMLUnsafe()`. Chi tiết + SSR ở [[07 - API nang cao - ElementInternals, Form-associated, DSD]].

---

## ⚖️ 8. Khi nào NÊN / KHÔNG NÊN dùng Shadow DOM

| | Tình huống |
| --- | --- |
| ✅ **NÊN** | Design system / UI library dùng chung nhiều app, nhiều team → CSS không được đụng nhau |
| ✅ | Widget nhúng vào trang **không kiểm soát được** (Shopify theme, embed 3rd-party, extension) |
| ✅ | Component có nhiều internal DOM cần giấu |
| ⚠️ **CÂN NHẮC BỎ** | App dùng **Tailwind / global tokens** — utility class không lọt vào shadow. Nhiều team chọn `createRenderRoot() { return this }` trong Lit |
| ⚠️ | Cần form / label / ARIA `id` reference chéo boundary; hoặc content phải đọc được **khi không chạy JS** (crawler không render, RSS, reader mode) — trừ khi dùng Declarative Shadow DOM |
| ⚠️ | Chỉ dùng nội bộ 1 app, CSS đã có convention rõ (CSS Modules, scoped style) |

> Rule of thumb: **thư viện dùng chung → shadow DOM. Component trong app → cân nhắc light DOM.**

---

## ⚠️ Bẫy thường gặp

- **`closed` tưởng là bảo mật** — không phải, chỉ gây khó chịu cho chính mình.
- **Quên `composed: true`** trên `CustomEvent` → event chết ở boundary, debug mất cả buổi.
- **Custom element mặc định `display: inline`** → `width`/`height`/`padding` dọc không ăn. Luôn `:host { display: block }`.
- **`document.querySelector` không thấy gì** → phải qua `shadowRoot`; E2E (Playwright) cần piercing selector.
- **`document.activeElement` luôn ra host** → cần đệ quy qua `shadowRoot.activeElement`.
- **`aria-labelledby`/`for` trỏ xuyên boundary → im lặng thất bại**, không warning.
- **Global CSS reset không lọt vào** → mỗi shadow root tự lo (`box-sizing`, `margin: 0`).
- **`!important` từ ngoài không đè được `!important` trong `:host`** (ngược trực giác — mục 3).
- **`innerHTML` không parse `<template shadowrootmode>`** → phải `setHTMLUnsafe()`.
- **Attach shadow 2 lần** (trừ DSD cùng `mode`) hoặc attach lên `<input>`/`<img>` → `NotSupportedError`.

---

## 📚 Nguồn

- [MDN — Using shadow DOM](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM) · [`Element.attachShadow()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/attachShadow) (allow-list host + `NotSupportedError`) · [`ShadowRoot`](https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot) · [`Document.activeElement`](https://developer.mozilla.org/en-US/docs/Web/API/Document/activeElement) · [`Event.composedPath()`](https://developer.mozilla.org/en-US/docs/Web/API/Event/composedPath)
- [CSS Cascade 5 — Cascade Sorting Order (encapsulation context)](https://drafts.csswg.org/css-cascade-5/#cascade-sort) · [CSS Shadow Parts / Scoping — `:host`, `::slotted`](https://drafts.csswg.org/css-shadow-1/) · [DOM Standard — retargeting](https://dom.spec.whatwg.org/#retarget)
- [MDN — Reflected element references (ARIA qua shadow boundary)](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Reflected_attributes#reflected_element_references) · [`ElementInternals`](https://developer.mozilla.org/en-US/docs/Web/API/ElementInternals)
- [Google Search Central — JavaScript SEO basics (web components)](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics)
