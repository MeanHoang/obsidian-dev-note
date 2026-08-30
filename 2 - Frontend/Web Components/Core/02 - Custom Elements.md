# 02 — Custom Elements

> **Custom Elements** = API để tự đăng ký một **tag HTML mới** với browser và gắn hành vi bằng một JS class. Browser tự gọi lifecycle callback khi element được tạo / gắn vào DOM / đổi attribute / bị gỡ ra. Đây là phần đầu não của Web Components — Shadow DOM và `<template>` chỉ là phụ kiện.

Series: [[00 - Roadmap Web Components - Lit]]
Anh em: [[01 - Web Components la gi - Lich su va Tong quan]] · [[03 - Shadow DOM]]

## 🧠 Custom Element là gì

Browser chỉ biết tag trong spec HTML. Tag lạ **có gạch ngang** như `<my-card>` được parse thành **`HTMLElement`** — hiển thị inline như `<span>`, không hành vi gì. (Chỉ tên **không** hợp lệ làm custom element, kiểu `<foo>`, mới thành `HTMLUnknownElement`. Spec cố ý làm vậy để lúc upgrade prototype chain chỉ đi xuống `HTMLElement → subclass`, không phải nhảy ngang.) Custom Elements cho phép nói với browser: *"tag `my-card` từ giờ chạy bằng class này"*.
```js
class MyCard extends HTMLElement {
  connectedCallback() { this.textContent = 'Hello từ my-card'; }
}
customElements.define('my-card', MyCard);   // <my-card></my-card>
```
Sau `define()`, mọi `<my-card>` trong document — kể cả cái đã có sẵn trong HTML trước khi script chạy — được **upgrade** thành instance của `MyCard`.

## 📛 Quy tắc đặt tên

| `customElements.define(name, ctor, opts?)` — luật | Hợp lệ | Sai |
|---|---|---|
| Bắt buộc có **ít nhất 1 dấu gạch ngang** | `my-card` | `mycard`, `card` |
| Bắt đầu bằng **chữ thường** (a–z) | `my-card` | `1-card`, `-card` |
| **Không có chữ HOA** | `my-card` | `myCard`, `My-Card` |
| Không chứa khoảng trắng, `NULL`, `/`, `>` | `my-card` | `my card`, `my/card` |
| Không trùng **reserved name** | — | `font-face`, `annotation-xml` |

Reserved (tên SVG/MathML vốn đã có gạch ngang): `annotation-xml`, `color-profile`, `font-face`, `font-face-src`, `font-face-uri`, `font-face-format`, `font-face-name`, `missing-glyph`. **Tại sao bắt buộc gạch ngang?** Spec HTML cam kết **không bao giờ** đặt tag mới có dấu gạch ngang → tag của bạn an toàn vĩnh viễn, không sợ HTML tương lai đụng tên. Parser cũng dùng chính dấu này để phân biệt nhanh tag chuẩn vs tag custom.

Exception của `define()`: tên sai luật → **`SyntaxError`**; trùng tên **hoặc trùng constructor** đã đăng ký, hoặc `extends` trỏ tới một custom element / tag không tồn tại → **`NotSupportedError`**; `ctor` không phải constructor → **`TypeError`**.

> **`PotentialCustomElementName`** — production trong HTML Standard định nghĩa chính xác tập ký tự hợp lệ cho tên custom element (rộng hơn danh sách trên: cho phép cả Unicode). 📖 [HTML Standard](https://html.spec.whatwg.org/multipage/custom-elements.html#valid-custom-element-name)

## 🔀 Autonomous vs Customized built-in

**Autonomous** — kế thừa thẳng `HTMLElement`, tự làm mọi thứ từ đầu. **Customized built-in** — kế thừa element có sẵn, giữ nguyên hành vi native (a11y, form submit, keyboard), dùng qua attribute `is`:
```js
class PopupInfo extends HTMLElement { /* ... */ }
customElements.define('popup-info', PopupInfo);            // <popup-info></popup-info>

class FancyButton extends HTMLButtonElement {
  connectedCallback() { this.classList.add('fancy'); }
}
customElements.define('fancy-button', FancyButton, { extends: 'button' });
// <button is="fancy-button">Click</button>
```
> ⚠️ MDN ghi rõ: *"Safari does not plan to support customized built-in elements."* → Thực tế hầu như chỉ dùng **autonomous**, rồi tự bù accessibility bằng `role` / `tabindex` / `ElementInternals`.

## ♻️ Lifecycle callbacks

| Callback | Khi nào chạy | Dùng để |
|---|---|---|
| `constructor()` | Khi tạo instance (`createElement`, parser, upgrade) | Khởi tạo state, `attachShadow` |
| `connectedCallback()` | **Mỗi lần** element gắn vào document | Render, add listener, fetch |
| `disconnectedCallback()` | Mỗi lần element bị gỡ khỏi document | Cleanup listener / timer / observer |
| `adoptedCallback(oldDoc, newDoc)` | Khi move sang document khác (iframe) | Bind lại theo `ownerDocument` |
| `attributeChangedCallback(name, old, new)` | Attribute trong `observedAttributes` đổi | Đồng bộ UI theo attribute |
| `connectedMoveCallback()` | Chỉ khi element được move bằng `Element.moveBefore()` — chạy **thay cho** cặp `disconnected`+`connected` | Xử lý riêng cho move, giữ nguyên state |

Tất cả chạy **đồng bộ** (synchronous) — browser gọi ngay tại thời điểm đó, không đợi microtask.

### `constructor()` — luật khắt khe nhất

```js
constructor() {
  super();                               // ✅ BẮT BUỘC gọi đầu tiên
  this._count = 0;                       // ✅ khởi tạo state
  this.attachShadow({ mode: 'open' });   // ✅ attach shadow root
  // ❌ this.getAttribute('x') / this.children
  // ❌ this.setAttribute(...) / this.innerHTML = ... / appendChild
}
```

**Tại sao cấm?** Element sinh ra bằng 2 đường khác hẳn nhau: (1) `document.createElement('my-el')` / `new MyEl()` → constructor chạy khi element **rỗng hoàn toàn**, chưa attribute chưa children; (2) **upgrade** từ HTML có sẵn (`<my-el foo="1">text</my-el>` đã parse xong trước khi script define chạy) → element đã có sẵn attribute và children. Đọc attribute trong constructor → case 1 luôn ra `null`. Set attribute/children → case 2 ghi đè nội dung tác giả viết. Spec chặn hẳn: ở bước *create an element*, ngay sau khi constructor chạy, nếu element đã có attribute hoặc có children thì ném `NotSupportedError` (Chrome báo: *"The result must not have attributes"*). 👉 Constructor chỉ chạm state JS + shadow root, mọi thứ dính DOM đẩy xuống `connectedCallback()`.

### `connectedCallback()` — có thể chạy NHIỀU LẦN

Move node trong DOM (`parent2.appendChild(el)`) = **disconnect rồi connect lại** → callback chạy lần 2, lần 3... Nên nó **phải idempotent**: render 2 lần không được nhân đôi DOM, add listener 2 lần không được bắn event 2 lần.

> Ngoại lệ: `Element.moveBefore()` là *state-preserving move* — nó gọi `connectedMoveCallback()` thay vì cặp disconnect/connect. Chưa Baseline (Firefox chưa hỗ trợ), nên vẫn phải viết `connectedCallback` idempotent. 📖 [MDN — moveBefore()](https://developer.mozilla.org/en-US/docs/Web/API/Element/moveBefore)
```js
connectedCallback() {
  if (!this._ready) { this._ready = true; this.shadowRoot.innerHTML = TEMPLATE; }  // dựng DOM 1 lần
  this.addEventListener('click', this._onClick);   // handler đã bind sẵn ở constructor
  this._render();                                  // cập nhật thì chạy mọi lần
}
```

### `disconnectedCallback()` — chống memory leak

```js
disconnectedCallback() {
  this.removeEventListener('click', this._onClick);
  clearInterval(this._timer);
  this._observer?.disconnect();
  this._abort?.abort();            // huỷ fetch đang chạy
}   // window/document listener bắt buộc phải gỡ ở đây
```
Listener gắn lên **chính element** thì GC dọn được. Nhưng listener gắn lên `window` / `document` / element khác **giữ tham chiếu ngược** vào element → leak nếu không gỡ; timer và `ResizeObserver` cũng vậy. ⚠️ Callback này **không** chạy khi user đóng tab / reload — đừng dựa vào nó để lưu dữ liệu.

### `adoptedCallback()`

Chạy khi element chuyển sang document khác — `document.adoptNode(el)` hoặc move node vào `<iframe>`. Spec truyền vào **2 tham số**: `adoptedCallback(oldDocument, newDocument)`. Hiếm gặp; dùng khi cần bind lại thứ gì đó theo document mới: `adoptedCallback(oldDoc, newDoc) { this._rebind(newDoc); }`

### `attributeChangedCallback()` + `observedAttributes`

```js
class MyBox extends HTMLElement {
  static observedAttributes = ['color', 'size'];   // hoặc: static get observedAttributes() { return [...] }
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) this._render();
  }
}
```

Chỉ attribute nằm trong `observedAttributes` mới kích callback (theo dõi tất cả thì mỗi lần đổi `class`/`style` cũng bắn → chậm). Callback **cũng chạy lúc parse lần đầu** cho từng attribute có sẵn trong HTML, **trước** `connectedCallback` — đúng thứ tự trong *custom element upgrade reaction* của HTML Standard: `constructor` → `attributeChangedCallback` (từng attribute, theo thứ tự trong attribute list) → `connectedCallback` (nếu element đang connected).

## ⭐ Attribute vs Property

Chỗ sinh ra 90% bug custom element. **Attribute** = cái viết trong HTML, qua `get/setAttribute`, **luôn là string** (hoặc `null`). **Property** = field/getter/setter trên object JS, kiểu gì cũng được.

| | Attribute | Property |
|---|---|---|
| Kiểu dữ liệu | Chỉ `string` \| `null` | Bất kỳ (object, array, fn) |
| Viết được trong HTML | Có | Không |
| API | `get/set/has/removeAttribute` | `el.foo` |
| Thấy trong DevTools Elements / CSS chọn được | Có (`[foo="bar"]`) | Không |
| Truyền object lớn | Không nên (phải stringify) | Ngon |

### Pattern chuẩn: getter/setter + reflect

```js
class MyToggle extends HTMLElement {
  static observedAttributes = ['label', 'disabled'];
  get label() { return this.getAttribute('label') ?? ''; }
  set label(v) { this.setAttribute('label', v); }
  get disabled() { return this.hasAttribute('disabled'); }
  set disabled(v) {
    if (v) this.setAttribute('disabled', ''); else this.removeAttribute('disabled');
  }
  attributeChangedCallback(name, oldV, newV) {
    if (oldV === newV) return;    // ⭐ chặn vòng lặp vô hạn
    this._render();
  }
}
```

**Tránh loop vô hạn:** setter ghi attribute → `attributeChangedCallback` chạy → nếu trong đó lại gán property → setter chạy lại → loop. Hai cách chặn: (1) lấy attribute làm **single source of truth** như code trên — getter đọc thẳng từ attribute, không giữ field riêng nên không có state để lệch; (2) nếu buộc giữ field riêng thì so sánh trước khi ghi (`if (this.getAttribute('x') !== String(v)) ...`) **và** `if (oldV === newV) return`. **Chỉ reflect khi cần**: cần CSS style theo state (`[disabled]`), cần a11y, cần serialize ra HTML. **Không reflect** object/array lớn hay giá trị đổi liên tục — native `<input>` cũng không reflect `value`.

### Boolean attribute: "có mặt = true"

```html
<my-toggle disabled></my-toggle>           <!-- true -->
<my-toggle disabled=""></my-toggle>        <!-- true -->
<my-toggle disabled="false"></my-toggle>   <!-- VẪN LÀ true 😱 -->
<my-toggle></my-toggle>                    <!-- false -->
```

Quy ước HTML: boolean attribute chỉ xét **có mặt hay không**, giá trị bị bỏ qua. `disabled="false"` vẫn có mặt → `hasAttribute() === true`; native `<button disabled="false">` cũng bị disable y hệt. → Getter boolean **luôn** dùng `hasAttribute`, không bao giờ `getAttribute(x) === 'true'`.

## 🔼 Element upgrade

Element có thể xuất hiện trong HTML **trước** khi script `define()` chạy (script async, bundle nặng). Lúc đó nó chỉ là `HTMLElement` thường. Khi `define()` chạy, browser quét document và **upgrade** mọi instance: `constructor` → `attributeChangedCallback` cho từng attribute có sẵn → `connectedCallback`.
```js
await customElements.whenDefined('my-card');        // chờ đến khi sẵn sàng rồi mới gọi API của nó
document.querySelector('my-card').doSomething();
customElements.upgrade(document.createElement('my-card'));   // ép upgrade ngay, không cần append
```
Chống FOUC bằng pseudo-class `:defined`:
```css
my-card:not(:defined) { display: block; min-height: 120px; opacity: 0; }  /* giữ chỗ, tránh layout shift */
my-card:defined { opacity: 1; transition: opacity .2s ease-in-out; }
```

## 🐛 Lazy property bug ⭐

Framework (React/Vue/Angular) render element rồi **set property ngay**, trong khi definition còn đang load:
```js
const el = document.createElement('my-card');
el.count = 5;              // el mới chỉ là HTMLElement thường
document.body.append(el);  // ... vài giây sau bundle mới define('my-card', MyCard)
```
Khi upgrade, class field / constructor **ghi đè** giá trị 5. Tệ hơn: `el.count = 5` đã tạo **own property** trên instance, nó **che mất** getter/setter trên prototype → setter không bao giờ được gọi nữa, reflect chết hẳn. Fix bằng `_upgradeProperty()` (pattern gốc từ *web.dev — Custom element best practices*), gọi trong `connectedCallback`:
```js
_upgradeProperty(prop) {
  if (Object.prototype.hasOwnProperty.call(this, prop)) {
    const value = this[prop];   // giữ giá trị own property
    delete this[prop];          // xoá nó → prototype setter lộ ra
    this[prop] = value;         // set lại, lần này đi đúng qua setter
  }
}
connectedCallback() { this._upgradeProperty('count'); this._upgradeProperty('disabled'); }
```
Lit làm sẵn việc này cho mọi `@property` — một lý do nên dùng Lit thay vì tự viết.

## 🧩 Ví dụ hoàn chỉnh: `<my-counter>`

```js
class MyCounter extends HTMLElement {
  static observedAttributes = ['start'];
  constructor() {
    super();
    this._count = 0;
    this._onClick = this._onClick.bind(this);        // KHÔNG đọc attribute ở đây
    this.attachShadow({ mode: 'open' }).innerHTML = `
      <style>:host { display: inline-flex; gap: .5rem; align-items: center; font: 14px system-ui }
             button { width: 2rem; height: 2rem; cursor: pointer } output { min-width: 2rem; font-weight: 600 }</style>
      <button part="dec" aria-label="giảm">−</button><output>0</output><button part="inc" aria-label="tăng">+</button>`;
  }
  get count() { return this._count; }              // property, KHÔNG reflect (đổi liên tục)
  set count(v) {
    const n = Number(v) || 0;
    if (n === this._count) return;
    this._count = n;
    this._render();
    // composed: true → event thoát được ra ngoài shadow DOM
    this.dispatchEvent(new CustomEvent('count-change', { detail: { count: n }, bubbles: true, composed: true }));
  }
  connectedCallback() {
    // `start` đã được attributeChangedCallback xử lý TRƯỚC connectedCallback rồi,
    // nên ở đây chỉ cần cứu property bị set sớm — không đọc lại attribute (sẽ đè mất giá trị đó).
    this._upgradeProperty('count');
    this.shadowRoot.addEventListener('click', this._onClick);
    this._render();
  }
  disconnectedCallback() { this.shadowRoot.removeEventListener('click', this._onClick); }
  attributeChangedCallback(name, oldV, newV) {
    if (oldV !== newV && name === 'start') this.count = Number(newV) || 0;
  }
  _onClick(e) {
    const part = e.target.getAttribute?.('part');
    if (part === 'inc') this.count = this._count + 1;
    else if (part === 'dec') this.count = this._count - 1;
  }
  _render() { this.shadowRoot.querySelector('output').textContent = this._count; }
  _upgradeProperty(prop) {   // xem mục "Lazy property bug" ở trên
    if (!Object.prototype.hasOwnProperty.call(this, prop)) return;
    const value = this[prop]; delete this[prop]; this[prop] = value;
  }
}
customElements.define('my-counter', MyCounter);
```
```html
<my-counter start="10"></my-counter>
<script type="module" src="./my-counter.js"></script>
<script type="module">
  const c = document.querySelector('my-counter');
  c.addEventListener('count-change', e => console.log('count =', e.detail.count));
  await customElements.whenDefined('my-counter');
  c.count = 42;              // set qua property
</script>
```

## 📒 CustomElementRegistry

`window.customElements` là instance toàn cục của `CustomElementRegistry` — sổ đăng ký tag ↔ class của cả document.

| API | Công dụng |
|---|---|
| `define(name, ctor, opts?)` | Đăng ký. `opts = { extends: 'button' }` cho customized built-in |
| `get(name)` / `getName(ctor)` | Class từ tên (`undefined` nếu chưa define) / tên từ class (`null`) |
| `whenDefined(name)` | `Promise` resolve khi tag được define (resolve ngay nếu đã có) |
| `upgrade(el)` | Ép upgrade element đang nằm ngoài document |

**Lỗi "already defined":** define 2 lần cùng tên → `NotSupportedError: the name "my-card" has already been used with this registry`. Hay gặp khi HMR, khi import 2 bản khác version của cùng một lib, hoặc file load 2 lần. Guard: `if (!customElements.get('my-card')) customElements.define('my-card', MyCard);`
> **Scoped registry**: `new CustomElementRegistry()` gắn vào shadow root qua `attachShadow({ mode:'open', customElementRegistry: reg })` — tránh đụng tên giữa các thư viện. Truyền `extends` vào registry scoped → `NotSupportedError`. Hỗ trợ: **Safari 26**, **Chrome/Edge 146** (bật mặc định, 03/2026); **Firefox chưa** → chưa Baseline, còn cần fallback.

## ⚠️ Bẫy thường gặp

1. **Đọc/ghi attribute trong `constructor()`** — với `createElement` luôn ra `null`; với parser ném `NotSupportedError`. Đẩy hết xuống `connectedCallback()`.
2. **`connectedCallback` không idempotent** — move node trong DOM là nó chạy lại: DOM nhân đôi, listener bắn 2 lần. Dùng cờ `_ready` + gỡ listener trong `disconnectedCallback`.
3. **Loop vô hạn setter ↔ `attributeChangedCallback`** — quên `if (oldV === newV) return`, hoặc vừa giữ field riêng vừa reflect mà không so sánh trước khi ghi.
4. **`getAttribute('disabled') === 'true'`** — sai với boolean attribute, `disabled="false"` vẫn là true. Luôn dùng `hasAttribute`.
5. **Lazy property bị ghi đè** — framework set `el.foo` trước khi upgrade → own property che getter/setter. Phải có `_upgradeProperty()`.
6. **Quên cleanup** — `setInterval`, listener trên `window`, `ResizeObserver` giữ tham chiếu ngược → element không bao giờ được GC. Và nhớ: `disconnectedCallback` không chạy khi đóng tab.
7. **Tự đóng tag `<my-card />`** — parser bỏ qua dấu `/`, mọi thứ phía sau bị nuốt thành children. Luôn viết đủ `</my-card>`.
8. **Dùng `is="..."` (customized built-in)** — chết trên Safari; cứ dùng autonomous. Define 2 lần cùng tên → `NotSupportedError`, guard bằng `customElements.get()`.
9. **FOUC / layout shift** khi bundle load chậm — style `:not(:defined)` để giữ chỗ hoặc ẩn mượt cho tới lúc element được upgrade.

## 📚 Nguồn

- [MDN — Using custom elements](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements)
- [MDN — CustomElementRegistry](https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry) · [`.define()` exceptions](https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry/define) · [scoped registry constructor](https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry/CustomElementRegistry)
- [web.dev — Custom Elements v1: Reusable Web Components](https://web.dev/articles/custom-elements-v1)
- [web.dev — Custom element best practices (nguồn `_upgradeProperty`)](https://web.dev/articles/custom-elements-best-practices)
- [HTML Spec — Valid custom element name](https://html.spec.whatwg.org/multipage/custom-elements.html#valid-custom-element-name)
- [HTML Spec — Requirements for custom element constructors & upgrade order](https://html.spec.whatwg.org/multipage/custom-elements.html#custom-element-conformance)
- [MDN — `Element.moveBefore()` / `connectedMoveCallback()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/moveBefore)
- [Chrome for Developers — Scoped custom element registries](https://developer.chrome.com/blog/scoped-registries)

⏭️ Tiếp theo: [[03 - Shadow DOM]] — đóng gói DOM + CSS, `:host`, `::part`, slot.
