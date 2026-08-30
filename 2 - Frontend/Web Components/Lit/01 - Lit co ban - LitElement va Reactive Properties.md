///////////////////////# 01 — Lit cơ bản: LitElement & Reactive Properties

> Lit = `HTMLElement` + reactive state + template engine, "around 5 KB (minified and compressed)" theo lit.dev. Note này đi hết phần "component": khai báo, reactive properties, lifecycle, styles, render root, query DOM. Nắm chắc **Reactive properties** + **Lifecycle** là đã dùng được Lit trong việc thật.

Series: [[00 - Roadmap Web Components - Lit]] · Nền: [[Introduction]] · Vanilla: [[02 - Custom Elements]]

---

## 🚀 1. Setup

### JS thuần + Vite

```bash
npm create vite@latest my-lit-app -- --template vanilla   # hoặc vanilla-ts
cd my-lit-app && npm i lit && npm run dev
```

```js
// src/my-el.js — JS thuần
import { LitElement, html, css } from 'lit';

export class MyEl extends LitElement {
  static properties = { name: { type: String } };
  static styles = css`:host { display: block; }`;
  constructor() { super(); this.name = 'world'; }
  render() { return html`<p>hello ${this.name}</p>`; }
}
customElements.define('my-el', MyEl);
```

Package `lit` re-export `lit-html` (template) + `lit-element` (base class `LitElement`), mà `lit-element` kế thừa `ReactiveElement` từ `@lit/reactive-element`.

### TypeScript + decorators

```ts
import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

@customElement('my-el')      // shorthand của customElements.define('my-el', MyEl)
export class MyEl extends LitElement {
  @property({ type: String }) name = 'world';
  @state() private _open = false;
  render() { return html`<p>hello ${this.name}</p>`; }
}

declare global {
  interface HTMLElementTagNameMap { 'my-el': MyEl }
}
```

> `HTMLElementTagNameMap` giúp `document.querySelector('my-el')` / `document.createElement('my-el')` trả về đúng type `MyEl` thay vì `Element`.

### ⚠️ Config TS

Lit 3 hỗ trợ **cả hai** hệ decorator. Doc Lit hiện khuyến nghị **experimental decorators** cho production (output của standard decorators lớn hơn đáng kể cho tới khi Lit có compiler transform).

| Cách | tsconfig | Cú pháp field |
| --- | --- | --- |
| Experimental decorators *(khuyến nghị)* | `experimentalDecorators: true` + `useDefineForClassFields: false` | `@property() name = 'x'` |
| Standard decorators | `experimentalDecorators: false` + `useDefineForClassFields: true` (mặc định khi `target: es2022`), **TS ≥ 5.2** | `@property() accessor name = 'x'` |
| Không decorators | không cần gì | `static properties` + gán trong `constructor()` |

```jsonc
// tsconfig.json — nhánh experimental decorators
{
  "compilerOptions": {
    "target": "es2022",
    "experimentalDecorators": true,
    "useDefineForClassFields": false
  }
}
```

**Vì sao `useDefineForClassFields: false`?**

> **`accessor-shadowing`** — class field theo chuẩn ES2022 dùng semantics `[[Define]]` (`Object.defineProperty`), tạo **own property** trên instance, che mất accessor Lit sinh trên **prototype** → setter không bao giờ chạy → mất reactivity. 📖 [lit.dev](https://lit.dev/docs/components/decorators/#avoiding-issues-with-class-fields)

Với `useDefineForClassFields: false`, TS emit `name = 'world'` thành `this.name = 'world'` (`[[Set]]`) → đi qua setter của Lit. Doc nói setting này *chỉ* bắt buộc khi `target` ≥ ES2022, nhưng nên khai báo tường minh. Keyword `accessor` (TS ≥ 4.9) tự tạo cặp getter/setter trên private field nên không dính accessor-shadowing — đó là lý do standard decorators bắt buộc dùng nó.

Nếu buộc phải bật `useDefineForClassFields: true` mà **không** dùng decorators, khai báo `declare` để TS không emit field:

```ts
declare foo: string;
static properties = { foo: { type: String } };
constructor() { super(); this.foo = 'Default'; }
```

---

## 🧬 2. Cây kế thừa

`HTMLElement` → `ReactiveElement` → `LitElement` → `MyComponent`

- **`ReactiveElement`** (`@lit/reactive-element`): reactive properties + update cycle + `static styles`.
- **`LitElement`**: thêm `render()` trả về lit-html `TemplateResult`.

Lit thêm gì so với custom element thuần:

| Vanilla | Lit |
| --- | --- |
| `attributeChangedCallback` tự viết, tự parse string | reactive property tự convert & tự re-render |
| Tự gọi `innerHTML = ...` | `render()` khai báo, lit-html chỉ patch phần đổi |
| Update đồng bộ, dễ render thừa | batch async ở microtask: nhiều thay đổi → 1 update |
| `<style>` clone mỗi instance | `static styles` → `adoptedStyleSheets`, share giữa các instance |
| Không có hook sau khi DOM update | `firstUpdated` / `updated` / `updateComplete` |
| Không có | `shouldUpdate` / `willUpdate` |

Chi tiết lifecycle vanilla xem [[02 - Custom Elements]].

---

## ⭐ 3. Reactive properties

**Reactive property** = property mà khi đổi giá trị sẽ tự schedule một update (re-render).

### Khai báo

```js
// JS — static properties + gán default trong constructor
static properties = {
  count:   { type: Number, reflect: true },
  items:   { type: Array },
  data:    { attribute: false },
  _active: { state: true },
};
constructor() {
  super();
  this.count = 0; this.items = []; this.data = {}; this._active = false;
}
```

```ts
// TS — decorators, tương đương y hệt
@property({ type: Number, reflect: true }) count = 0;
@property({ type: Array }) items: string[] = [];
@property({ attribute: false }) data: Record<string, unknown> = {};
@state() private _active = false;
```

### Options

Đầy đủ 8 option, khớp `defaultPropertyDeclaration` trong source `reactive-element.ts`:

| Option | Mặc định | Nghĩa |
| --- | --- | --- |
| `type` | `String` | Kiểu để converter mặc định parse (`String`/`Number`/`Boolean`/`Array`/`Object`) |
| `attribute` | `true` | `false` = không quan sát attribute. String = đổi tên attribute (`attribute: 'my-name'`) |
| `converter` | `defaultConverter` | Object `{ fromAttribute, toAttribute }` hoặc 1 hàm (= `fromAttribute`) |
| `reflect` | `false` | Property đổi → ghi ngược ra attribute (dùng cho CSS selector `[disabled]`) |
| `hasChanged` | `notEqual` | Hàm quyết định "có đổi không" |
| `state` | `false` | Internal reactive state — Lit tự ép `attribute: false`. Tương đương `@state()` |
| `noAccessor` | `false` | Không sinh accessor. Chỉ dùng ở ca hiếm: subclass muốn đổi option của superclass |
| `useDefault` | `false` | **Lit ≥ 3.3.0.** Không reflect giá trị mặc định lúc khởi tạo; xoá attribute → property về lại default |

- `@state()` = `@property({ ...options, state: true, attribute: false })`. Vẫn reactive, chỉ là không có attribute.
- **Không cần** `noAccessor` khi bạn tự viết getter/setter — Lit tự phát hiện accessor có sẵn và không ghi đè.
- `useDefault`: giá trị default bị giữ trong memory → doc khuyến cáo **tránh** `useDefault: true` cho property kiểu Object/Array.

Tên attribute mặc định = tên property **viết thường** (`name.toLowerCase()`): `myProp` → `myprop`, **không phải** `my-prop`. Muốn kebab-case phải khai báo tay: `@property({ attribute: 'my-prop' })`.

### Attribute ⇄ property conversion mặc định

Theo `defaultConverter` trong source:

| `type` | attribute → property (`fromAttribute`) | property → attribute (`toAttribute`, khi `reflect: true`) |
| --- | --- | --- |
| `String` | giá trị attribute nguyên xi; attribute bị xoá → `null` | set attribute; `null`/`undefined` → xoá attribute |
| `Number` | `null` nếu attribute vắng mặt, còn lại `Number(value)` | `String(value)`; `null`/`undefined` → xoá |
| `Boolean` | `value !== null` — **có mặt attribute** = `true` | truthy → `attr=""`, falsy → **xoá** attribute |
| `Array` / `Object` | `JSON.parse(value)`; parse lỗi → `null` (không throw) | `JSON.stringify(value)`; `null`/`undefined` → xoá |

```html
<!-- Boolean: giá trị attribute KHÔNG quan trọng, chỉ sự tồn tại -->
<my-el disabled></my-el>        <!-- disabled = true -->
<my-el disabled="false"></my-el><!-- vẫn = true (!!) -->
<my-el></my-el>                 <!-- disabled = false -->
```

👉 Vì vậy boolean property **luôn để default `false`**.

⚠️ `reflect: true` với Object/Array sẽ `JSON.stringify` cả object vào attribute mỗi lần đổi — doc Lit khuyến cáo không nên. Chỉ reflect primitive cần cho CSS selector.

### Custom converter

```js
static properties = {
  tags: {
    converter: {
      fromAttribute: (v) => (v ? v.split(',') : []),
      toAttribute: (v) => v.join(','),
    },
    reflect: true,
  },
};
```

### `hasChanged` — mặc định là `!Object.is()`

```ts
// source reactive-element.ts, is === Object.is
export const notEqual: HasChanged = (value, old) => !is(value, old);

// ghi đè khi cần so sánh theo giá trị:
@property({ hasChanged: (n: string, o: string) => n?.toLowerCase() !== o?.toLowerCase() })
name = '';
```

Prose trên lit.dev viết là "strict inequality (`newValue !== oldValue`)", nhưng implementation thực tế là `!Object.is()`. Khác biệt duy nhất:

- `NaN` → `NaN`: `!==` cho là **đổi**, `Object.is` cho là **không đổi** → Lit **không** re-render.
- `+0` → `-0`: `!==` cho là không đổi, `Object.is` cho là **đổi** → Lit re-render.

### ⚠️ Bẫy lớn nhất: so sánh reference

Vì `Object.is` chỉ so **reference** với object/array — mutate tại chỗ → reference không đổi → **không re-render**.

```js
// ❌ SAI — UI không update
addItem(item)     { this.items.push(item); }
updateUser(name)  { this.user.name = name; }

// ✅ ĐÚNG — tạo reference mới (immutable)
addItem(item)     { this.items = [...this.items, item]; }
removeAt(i)       { this.items = this.items.filter((_, idx) => idx !== i); }
updateUser(name)  { this.user = { ...this.user, name }; }

// ✅ Cách 2 — mutate rồi báo tay (khi array cực lớn, tránh copy)
this.items.splice(i, 1);
this.requestUpdate();   // gọi không tham số → schedule update, bỏ qua hasChanged()
```

### Khi nào `@state()`

Giá trị **nội bộ** (`_loading`, `_open`, `_selectedIndex`, dữ liệu fetch về) — không phải public API, không muốn user set từ ngoài.

> Quy tắc: component **không tự đổi public property của chính nó**, trừ khi phản hồi user input — và khi đó nên `dispatchEvent` báo ra ngoài.

---

## ⭐ 4. Lifecycle

### Chuỗi đầy đủ

```
constructor()  →  connectedCallback()  →  requestUpdate()
                  (tạo renderRoot)         (auto khi property đổi qua hasChanged, hoặc gọi tay)
   ↓ chờ microtask — batch nhiều thay đổi thành 1 update
scheduleUpdate()  →  performUpdate()
        ├── shouldUpdate(changed)   → false thì DỪNG (updateComplete VẪN resolve)
        ├── willUpdate(changed)     ← tính giá trị dẫn xuất
        ├── update(changed)         ← reflect property → attribute
        │      └── render()         ← trả TemplateResult, lit-html patch DOM
        ├── firstUpdated(changed)   ← chỉ lần đầu
        └── updated(changed)        ← mỗi lần
   ↓
updateComplete (Promise<boolean>)  →  disconnectedCallback() khi gỡ khỏi DOM
```

### Bảng hook

| Hook | Chạy | `changed` | Set property ở đây | Dùng để |
| --- | --- | --- | --- | --- |
| `constructor()` | 1 lần | — | — | set default. ❌ đụng DOM/attribute. Nhớ `super()` |
| `connectedCallback()` | mỗi lần vào DOM | — | — | listener lên `window`/`document`, subscribe. Phải gọi `super.connectedCallback()` |
| `disconnectedCallback()` | mỗi lần rời DOM | — | — | cleanup timer, unsubscribe. Listener trong template Lit tự dọn |
| `shouldUpdate()` | mỗi update | ✅ | không tạo cycle mới | chặn re-render; `false` → bỏ qua phần còn lại |
| `willUpdate()` | mỗi update | ✅ | không tạo cycle mới → **an toàn** | tính state dẫn xuất trước `render()` |
| `update()` | mỗi update | ✅ | không tạo cycle mới | hiếm khi override; phải gọi `super.update()` không thì không render |
| `render()` | mỗi update | — | không tạo cycle mới | trả template. **Pure** — chỉ đọc, không side-effect |
| `firstUpdated()` | 1 lần | ✅ | **tạo update mới** | đo DOM lần đầu, focus, init thư viện bên thứ 3 |
| `updated()` | mỗi update | ✅ | **tạo update mới** (dễ loop vô hạn) | đồng bộ với DOM thật, đo kích thước |

- Set property **từ `shouldUpdate` đến hết `render()`** chỉ cập nhật `changedProperties` của cycle hiện tại, không schedule cycle mới. Sau `render()` thì có.
- Nếu lifecycle method ném exception, `firstUpdated`/`updated` **không** được gọi và `updateComplete` **reject**.
- Khi SSR chỉ `willUpdate()` và `render()` chạy.

### `changedProperties` Map

Key = tên property, **value = giá trị CŨ**. Giá trị mới đọc qua `this.x`. TS: type `PropertyValues<this>`.

```js
willUpdate(changed) {
  if (changed.has('firstName') || changed.has('lastName')) {
    this.fullName = `${this.firstName} ${this.lastName}`;   // an toàn: không tạo cycle mới
  }
}

updated(changed) {
  if (changed.has('open')) {
    console.log(changed.get('open'), '→', this.open);  // CŨ → MỚI
  }
}

shouldUpdate(changed) { return changed.has('value'); }   // chỉ re-render khi 'value' đổi
```

### `await this.updateComplete`

Update của Lit là **async** (microtask, trước paint). Set property xong thì DOM **chưa** đổi ngay:

```js
this.count = 5;
console.log(this.shadowRoot.querySelector('span').textContent); // vẫn giá trị cũ!

await this.updateComplete;
console.log(this.shadowRoot.querySelector('span').textContent); // '5' ✅
```

Dùng khi: **test** (`el.value = 'x'; await el.updateComplete; expect(...)`), **đo DOM** (`getBoundingClientRect()`), **dispatch event** sau khi DOM ổn định.

`updateComplete` là `Promise<boolean>`: resolve `true` nếu không còn update pending, **reject** nếu update cycle ném exception → nên `try/catch` trong test. Muốn chờ thêm điều kiện (ví dụ child component update xong) thì override `getUpdateComplete()`.

Còn có: `this.hasUpdated` (`true` sau update đầu tiên), `this.isUpdatePending` (đang có update chờ).

---

## 🎨 5. Styles

```js
import { LitElement, html, css, unsafeCSS } from 'lit';

class MyCard extends LitElement {
  static styles = css`
    :host { display: block; padding: 16px; background: var(--card-bg, #fff); }
    :host([hidden]) { display: none; }
    :host(.compact) { padding: 4px; }
    ::slotted(p) { margin: 0; }
    .title { font-weight: 600; }
  `;
}
```

- Style bị **scope trong Shadow DOM**: CSS ngoài không lọt vào, CSS trong không lọt ra.
- `static styles` được evaluate **một lần cho mỗi class** rồi reuse cho mọi instance, áp vào shadow root qua `adoptedStyleSheets`. Doc Lit gọi cách này là *"the most optimal performance"*.

### Share styles

```js
// shared-styles.js
export const buttonStyles = css`button { border: none; cursor: pointer; }`;

// my-el.js
import { buttonStyles } from './shared-styles.js';
static styles = [buttonStyles, css`button { background: teal; }`];
```

Mảng styles được **dedupe, giữ lại instance CUỐI** trong list. TS: khai báo type `CSSResultGroup` để subclass override được.

### `unsafeCSS`

Tag `css` chỉ cho nhúng `CSSResult` khác hoặc number (chống CSS injection). Giá trị JS khác phải bọc `unsafeCSS` — và chỉ với input **tin cậy** (hằng số trong code), không bao giờ với input từ user.

```js
const brand = '#0a84ff';
static styles = css`:host { color: ${unsafeCSS(brand)}; }`;
```

### Theming bằng CSS custom properties

`static styles` là static → không đổi theo instance. Muốn tuỳ biến từng instance thì dùng CSS var (custom property **kế thừa xuyên qua** shadow boundary):

```css
/* App — biến chui được vào shadow DOM của my-card */
my-card { --card-bg: #111; }
.dark-theme { --card-bg: #000; }  /* kế thừa xuống cả cây */
```

> ❌ Tránh đặt `<style>` có `${}` trong `render()`. Doc: *"When any text inside a `<style>` element changes, the browser must re-parse the whole `<style>` element, resulting in unnecessary work."* Dùng CSS var hoặc `styleMap`/`classMap` (xem [[02 - Templates va Directives]]).

---

## 🌗 6. `createRenderRoot()` — tắt Shadow DOM

Mặc định `createRenderRoot()` tạo shadow root (`attachShadow` với `static shadowRootOptions`, mặc định `{ mode: 'open' }`) và apply `static styles`. Override để render vào **light DOM**:

```js
class NoShadow extends LitElement {
  createRenderRoot() { return this; }   // render thẳng vào children, không Shadow DOM
  render() { return html`<p class="text">light DOM</p>`; }
}

// Chỉ muốn đổi option shadow root thì KHÔNG cần override createRenderRoot:
static shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true };
```

| | Shadow DOM (mặc định) | Light DOM (`return this`) |
| --- | --- | --- |
| Style encapsulation | ✅ có | ❌ CSS global ăn vào |
| `static styles` | ✅ hoạt động | ❌ **bị bỏ qua** — phải tự nhúng `<style>` |
| `<slot>` | ✅ có | ❌ không có (slot chỉ hoạt động trong shadow DOM) |
| CSS framework ngoài (Tailwind, Bootstrap) | ❌ không xuyên vào | ✅ dùng được |
| Query từ ngoài | ❌ bị chặn | ✅ `document.querySelector` thấy |

👉 Chọn light DOM khi nhúng vào trang có design system global sẵn (Shopify theme, WordPress), hoặc cần third-party script thấy DOM. Đánh đổi: **mất encapsulation** — đúng thứ khiến Web Components có giá trị.

`this.renderRoot` (type `HTMLElement | ShadowRoot`) luôn trỏ tới render root thực tế, dùng được cho cả hai chế độ.

---

## 🔍 7. Query DOM con

| Decorator | Trả về | Option |
| --- | --- | --- |
| `@query(selector, cache?)` | node đầu tiên hoặc `null` | `cache: boolean` (tham số thứ 2) — cache kết quả sau lần query đầu |
| `@queryAll(selector)` | `NodeListOf<HTMLElement>` | — |
| `@queryAsync(selector)` | `Promise<Node \| null>` — await `updateComplete` rồi mới query | — |
| `@queryAssignedElements(options)` | `Array<HTMLElement>` | `slot`, `flatten`, `selector` |
| `@queryAssignedNodes(options)` | `Array<Node>` | `slot`, `flatten` |

```ts
import { query, queryAll, queryAssignedElements } from 'lit/decorators.js';

class MyEl extends LitElement {
  @query('#input') private _input!: HTMLInputElement;
  @query('#input', true) private _cached!: HTMLInputElement;  // cache — chỉ khi node không bị template thay/xoá
  @queryAll('.row') private _rows!: NodeListOf<HTMLElement>;
  @queryAssignedElements({ slot: 'item', selector: 'li' })
  private _items!: HTMLLIElement[];                           // element được slot vào

  render() { return html`<input id="input"><slot name="item"></slot>`; }
  firstUpdated() { this._input.focus(); }   // ✅ DOM đã tồn tại
}
```

JS thuần thì dùng thẳng `this.renderRoot.querySelector('#input')`.

⚠️ **Chỉ query sau `firstUpdated()`**. Trong `constructor` / `connectedCallback` template chưa render → luôn `null`. Nếu phải làm ngay sau khi đổi state: `await this.updateComplete` rồi mới query (hoặc dùng `@queryAsync`).

> Ngoài ra có `ref()` directive — xem [[02 - Templates va Directives]].

---

## 🧪 8. Ví dụ hoàn chỉnh — `<joy-counter>`

### Bản JS

```js
import { LitElement, html, css } from 'lit';

export class JoyCounter extends LitElement {
  static properties = {
    start:  { type: Number, reflect: true },
    step:   { type: Number },
    _count: { state: true },
  };

  static styles = css`
    :host {
      display: inline-flex; align-items: center; gap: 8px;
      font-family: var(--joy-font, system-ui, sans-serif);
      color: var(--joy-fg, #111);
    }
    button {
      width: 32px; height: 32px; font-size: 16px; cursor: pointer;
      border: 1px solid var(--joy-border, #ccc); border-radius: 6px;
      background: var(--joy-bg, #fff); color: inherit;
    }
    button:hover { background: var(--joy-bg-hover, #f2f2f2); }
    .value { min-width: 3ch; text-align: center; font-variant-numeric: tabular-nums; }
  `;

  constructor() {
    super();
    this.start = 0; this.step = 1; this._count = 0;
  }

  willUpdate(changed) {
    // start đổi từ ngoài → reset counter. Set property trong willUpdate không tạo cycle mới.
    if (changed.has('start')) this._count = this.start;
  }

  _change(delta) {
    this._count += delta;
    this.dispatchEvent(new CustomEvent('count-change', {
      detail: { value: this._count },
      bubbles: true,
      composed: true,   // ⭐ cho event xuyên qua shadow boundary
    }));
  }

  render() {
    return html`
      <button @click=${() => this._change(-this.step)} aria-label="decrease">−</button>
      <span class="value">${this._count}</span>
      <button @click=${() => this._change(this.step)} aria-label="increase">+</button>
    `;
  }
}
customElements.define('joy-counter', JoyCounter);
```

### Bản TS

Giống hệt, chỉ thay `static properties` + gán trong constructor bằng decorators (`render()` và `static styles` không đổi):

```ts
import { LitElement, html, css, type PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

@customElement('joy-counter')                      // thay cho customElements.define
export class JoyCounter extends LitElement {
  static styles = css`/* ...như bản JS... */`;

  @property({ type: Number, reflect: true }) start = 0;
  @property({ type: Number }) step = 1;
  @state() private _count = 0;

  protected willUpdate(changed: PropertyValues<this>) {
    if (changed.has('start')) this._count = this.start;
  }

  private _change(delta: number) {
    this._count += delta;
    this.dispatchEvent(new CustomEvent<{ value: number }>('count-change', {
      detail: { value: this._count }, bubbles: true, composed: true,
    }));
  }

  render() { /* ...như bản JS... */ }
}

declare global {
  interface HTMLElementTagNameMap { 'joy-counter': JoyCounter }
}
```

### Dùng

```html
<style> joy-counter { --joy-bg: #111; --joy-fg: #eee; --joy-border: #333; } </style>
<joy-counter start="10" step="5"></joy-counter>
<script type="module">
  import './joy-counter.js';
  document.querySelector('joy-counter')
    .addEventListener('count-change', (e) => console.log(e.detail.value));
</script>
```

---

## ⚠️ Bẫy thường gặp

1. **Mất reactivity trong TS** — quên `useDefineForClassFields: false` (accessor-shadowing). Set property, UI đứng im.
2. **Mutate array/object** — `this.items.push(x)` không đổi reference → không re-render. Gán reference mới hoặc `this.requestUpdate()`.
3. **Quên `super.connectedCallback()` / `super.update()`** — Lit không schedule update / không render, không báo lỗi.
4. **Query DOM trong `constructor` / `connectedCallback`**, hoặc đọc DOM ngay sau khi set property → `null` / giá trị cũ. Chờ `firstUpdated()` hoặc `await this.updateComplete`.
5. **Set property trong `updated()`** → tạo update mới → dễ **infinite loop**. Chuyển sang `willUpdate()`.
6. **Boolean attribute** — `<my-el disabled="false">` vẫn ra `true`. Có attribute = `true`, chấm hết.
7. **`reflect: true` cho Object/Array** — `JSON.stringify` vào attribute mỗi lần đổi, doc khuyến cáo không nên.
8. **Tên attribute mặc định là lowercase, không phải kebab-case** — `myProp` → `myprop`.
9. **`static styles` với light DOM** — bị bỏ qua hoàn toàn, không báo lỗi.
10. **Không có two-way binding** — đổi property trong component thì parent không biết, phải `dispatchEvent` (`composed: true` để xuyên shadow DOM).

---

## 📚 Nguồn

- [Defining a component](https://lit.dev/docs/components/defining/)
- [Reactive properties](https://lit.dev/docs/components/properties/)
- [Lifecycle](https://lit.dev/docs/components/lifecycle/)
- [Styles](https://lit.dev/docs/components/styles/)
- [Shadow DOM / render root](https://lit.dev/docs/components/shadow-dom/)
- [Decorators](https://lit.dev/docs/components/decorators/) — experimental vs standard decorators, tsconfig
- [ReactiveElement API](https://lit.dev/docs/api/ReactiveElement/)
- [`reactive-element.ts` source](https://github.com/lit/lit/blob/main/packages/reactive-element/src/reactive-element.ts) — `notEqual`, `defaultConverter`, `defaultPropertyDeclaration`
- [Release lit@3.3.0](https://github.com/lit/lit/releases/tag/lit%403.3.0) — `useDefault`

→ Tiếp: [[02 - Templates va Directives]]
