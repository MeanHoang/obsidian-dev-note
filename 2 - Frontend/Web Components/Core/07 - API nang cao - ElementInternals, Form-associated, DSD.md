# 07 — API nâng cao: ElementInternals, Form-associated, DSD

> Nhóm API "tầng 2" của Web Components: cho component **tham gia form thật**, **có semantic a11y mặc định**, **có state style được từ ngoài**, và **render shadow DOM từ HTML tĩnh (SSR)**. Ranh giới giữa custom element đồ chơi và component dùng được trong design system.

Series: [[00 - Roadmap Web Components - Lit]] · Nền tảng: [[03 - Shadow DOM]] · [[05 - Styling - CSS API cua Component]]

## 🔑 `ElementInternals` — cửa vào của mọi thứ

Lấy bằng `constructor() { super(); this.#internals = this.attachInternals(); }` — mở khoá 3 nhóm khả năng:

| Nhóm khả năng | Thành viên chính | Dùng để |
| --- | --- | --- |
| **Form** | `setFormValue`, `setValidity`, `form`, `labels`, `willValidate`, `validity`, `validationMessage` | Submit + validate như `<input>` |
| **A11y** | `role`, `ariaLabel`, `ariaExpanded`, `ariaLabelledByElements`… (~50 property) | Semantic **mặc định**, không bôi attribute lên host |
| **State** | `states` (`CustomStateSet`) | Style từ ngoài bằng `:state(...)` |

- Gọi `attachInternals()` lần thứ hai → throw `NotSupportedError`; cache vào private field. Chỉ dùng được với **autonomous custom element** (`extends HTMLElement`), kế thừa built-in → throw.
- `internals.shadowRoot` trả về shadow root **kể cả mode `closed`** → cách chuẩn để component tự truy cập root của mình.
- **Support:** Baseline *widely available* từ 03/2023 (Chrome 77+, Firefox 93+, Safari 16.4+).

## 📝 Form-associated custom elements ⭐

Mặc định custom element **vô hình với `<form>`**: không vào `FormData`, không submit, không validate. Bật bằng `static formAssociated = true` (⚠️ `static`, không phải instance field) — khi đó mới có `internals.form`, `internals.labels`, form lifecycle callbacks và constraint validation.

### `setFormValue()` — giá trị submit

```js
this.#internals.setFormValue('abc');          // string — hoặc File, hoặc null (không gửi gì)
this.#internals.setFormValue(value, state);   // state = giá trị nội bộ để restore
```

Key khi submit lấy từ attribute `name` trên host. **Nhiều field** → truyền `FormData`: browser dùng **nguyên các entry** trong đó, **không tự ghép `name` của host vào key** — muốn có prefix thì tự ghép:

```js
const n = this.getAttribute('name');
const data = new FormData();
data.append(`${n}-street`, this.street);
data.append(`${n}-city`,   this.city);
this.#internals.setFormValue(data);
```

Tham số `state` là thứ browser lưu để trả lại qua `formStateRestoreCallback` (back/forward, autofill). Dùng khi **giá trị submit ≠ state nội bộ** — combobox submit `id` nhưng state là `{id, label}`.

### Validation

| API | Ý nghĩa |
| --- | --- |
| `setValidity(flags, message, anchor)` | `flags` rỗng `{}` = hợp lệ. Có flag `true` mà thiếu `message` → **`TypeError`**. `anchor` phải là *shadow-including descendant* của chính element, sai → `NotFoundError`; thiếu `anchor` thì browser vẫn chặn submit nhưng không biết neo bubble lỗi vào đâu |
| `checkValidity()` | Trả `boolean`, bắn event `invalid`, **không** hiện UI |
| `reportValidity()` | Như trên nhưng **có** hiện bubble lỗi của browser |
| `willValidate` | Có nằm trong diện validate không — `false` khi host có `disabled`, `readonly` hoặc `hidden` |
| `validity` / `validationMessage` | `ValidityState` và message hiện tại. Flag hay dùng: `valueMissing` (required), `customError`, `typeMismatch` |

### Form lifecycle callbacks

| Callback | Khi nào chạy | Việc cần làm |
| --- | --- | --- |
| `formAssociatedCallback(form)` | Gắn/gỡ khỏi `<form>` (`null` khi gỡ) | Đăng ký listener theo form |
| `formDisabledCallback(disabled)` | Form/`<fieldset>` cha disable, hoặc host có `disabled` | Tắt input bên trong, đổi style |
| `formResetCallback()` | `form.reset()` | Trả về default |
| `formStateRestoreCallback(state, mode)` | `mode` = `'restore'` (back/forward) hoặc `'autocomplete'` | Khôi phục `state` |

### Ví dụ đầy đủ — `<my-input>` submit được + required

```js
class MyInput extends HTMLElement {
  static formAssociated = true;
  static observedAttributes = ['required'];
  #internals; #input; #inited = false;

  constructor() {
    super();
    this.#internals = this.attachInternals();
    this.attachShadow({ mode: 'open', delegatesFocus: true }).innerHTML =
      `<style>:host(:state(invalid)) input { border-color: #d33 }</style><input part="input">`;
    this.#input = this.shadowRoot.querySelector('input');
    this.#input.addEventListener('input', () => { this.value = this.#input.value; });
  }
  get value() { return this.#input.value; }
  set value(v) {
    this.#input.value = v ?? '';
    this.#internals.setFormValue(this.#input.value);   // ⭐ thiếu dòng này thì form rỗng
    this.#validate();
  }

  // proxy API native ra ngoài cho app dùng
  get form()       { return this.#internals.form; }
  get validity()   { return this.#internals.validity; }
  checkValidity()  { return this.#internals.checkValidity(); }
  reportValidity() { return this.#internals.reportValidity(); }
  #validate() {
    if (this.hasAttribute('required') && this.value === '') {
      this.#internals.setValidity({ valueMissing: true }, 'Trường này bắt buộc', this.#input);
      this.#internals.states.add('invalid');
    } else {
      this.#internals.setValidity({});
      this.#internals.states.delete('invalid');
    }
  }
  // ⭐ khởi tạo value ở lần gắn vào DOM đầu tiên — chưa gọi setFormValue thì field không có trong FormData.
  //    Cần cờ vì connectedCallback chạy lại mỗi lần element bị di chuyển trong DOM.
  connectedCallback() {
    if (this.#inited) return;
    this.#inited = true;
    this.value = this.getAttribute('value') ?? '';
  }
  attributeChangedCallback()      { this.#validate(); }
  formResetCallback()             { this.value = this.getAttribute('value') ?? ''; }
  formDisabledCallback(disabled)  { this.#input.disabled = disabled; }
  formStateRestoreCallback(state) { this.value = state; }
}
customElements.define('my-input', MyInput);
```

```html
<form id="f">
  <label for="name">Họ tên</label>
  <my-input id="name" name="fullname" required></my-input>
  <button>Gửi</button>   <!-- bấm khi rỗng → browser chặn submit, báo "Trường này bắt buộc" tại `anchor` -->
</form>
<script>
  f.addEventListener('submit', e => { e.preventDefault();
    console.log([...new FormData(f)]); }); // [['fullname','...']]
</script>
```

`<label for>` chạy được vì host là form-associated → `internals.labels` trả đúng label, click label focus vào trong nhờ `delegatesFocus`.

## ♿ ARIA qua `ElementInternals`

```js
this.#internals.role = 'button';   this.#internals.ariaLabel = 'Đóng';
this.#internals.ariaLabelledByElements = [this.shadowRoot.querySelector('#title')]; // ref thẳng, không qua ID
```

Khác `this.setAttribute('role', 'button')` ở hai điểm: DOM **không** mọc thêm attribute (HTML sạch, không lộ chi tiết nội bộ), và **author vẫn override được** — attribute trên host thắng `internals.*`. Đây là *default semantics*, đúng cách built-in element hành xử: `internals.*` là mặc định, attribute của author là override; set `role` trực tiếp thì component và app giành nhau ghi đè. Nhóm `*Elements` chỉ trỏ tới element component **nhìn thấy**, không xuyên ngược ra ngoài host.

**Support:** `internals.role` Chrome 103+, Firefox 119+, Safari 16.4+; `ariaLabel` Chrome 81+, Firefox 119+, Safari 16.4+; nhóm `ariaLabelledByElements` mới hơn hẳn — Chrome 135+, Firefox 136+, Safari 16.4+ → cần feature detect.

## 🚧 A11y xuyên Shadow DOM — chưa giải quyết xong

**IDREF không xuyên shadow boundary.** ID trong shadow tree không thấy từ document và ngược lại.

```html
<label for="x">Email</label>
<fancy-input id="x">  <!-- #shadow-root chứa <input id="real">; for="x" không tới được -->
```

Workaround dùng được hôm nay:

1. **Form-associated + `delegatesFocus`** — giải quyết `<label for>` và focus, đủ cho phần lớn form control.
2. **`internals.role` / `aria*`** — đặt semantic ngay trên host, screen reader đọc host.
3. **`ariaLabelledByElements`** — nối reference bằng object thay vì ID.
4. **Mirror attribute** — quan sát `aria-label`/`aria-describedby` trên host rồi copy xuống element thật; xấu, dễ lệch, nhưng chạy mọi nơi.
5. **Bỏ Shadow DOM cho phần cần a11y** — nhiều design system chọn light DOM cho input để né hẳn.

### Reference Target — ⚠️ đề xuất, **chưa** ổn định

```html
<!-- ĐỀ XUẤT, chưa dùng production được -->
<fancy-input id="x">
  <template shadowrootmode="open" shadowrootreferencetarget="real"><input id="real"></template>
</fancy-input>
```

Tính tới 08/2026: MDN có ghi option `referenceTarget` của `attachShadow()` nhưng đánh dấu **experimental, chưa vào standards track**. BCD: Chrome 152, Firefox 144 và Safari 26 — hai bản sau **cần bật pref**. Chưa Baseline. Dùng để thử nghiệm thì được, đừng đưa vào production hay tài liệu team như thể đã chốt.

## 🎨 `CustomStateSet` + CSS `:state()`

```js
this.#internals.states.add('loading');
this.#internals.states.delete('loading');   // còn .has() .clear() .size
```
```css
my-btn:state(loading) { opacity: .6; pointer-events: none }
:host(:state(loading)) .spinner { display: block }   /* trong shadow stylesheet */
my-form::part(submit):state(loading) { cursor: wait }
```

Hơn attribute ở chỗ: state **không xuất hiện trong DOM**, author không fake được bằng `setAttribute`, không đụng class của app.

⚠️ **Cú pháp cũ đã đổi:** Chrome 90–124 dùng dashed-ident — `states.add('--loading')` + selector `:--loading`; từ Chrome 125 đổi sang `states.add('loading')` + `:state(loading)`. Cần đỡ cả hai thì `try { add('loading') } catch { add('--loading') }` rồi selector `my-btn:is(:--loading, :state(loading))`. **Support:** `:state()` Baseline từ 05/2024 (Chrome 125+, Firefox 126+, Safari 17.4+); riêng object `CustomStateSet` có sớm hơn (Chrome 90+, Firefox 126+, Safari 17.4+). Detect bằng `CSS.supports('selector(:state(x))')`.

## 🖥️ Declarative Shadow DOM (DSD) ⭐

Shadow DOM khai báo bằng HTML thuần — SSR được, không FOUC, xem được khi JS chưa load.

```html
<my-card>
  <template shadowrootmode="open">
    <style>:host { display: block; border: 1px solid #ddd; padding: 1rem }</style>
    <h3><slot name="title">Không tiêu đề</slot></h3>
    <div><slot></slot></div>
  </template>
  <span slot="title">Hoá đơn #123</span>
  <p>Nội dung light DOM.</p>
</my-card>
```

Parser gặp `<template shadowrootmode>` → attach shadow root **ngay tại chỗ** (hỗ trợ streaming), `<template>` biến mất khỏi DOM.

| Attribute | Tương đương option của `attachShadow()` |
| --- | --- |
| `shadowrootmode="open\|closed"` | `{ mode }` |
| `shadowrootdelegatesfocus` | `{ delegatesFocus: true }` |
| `shadowrootclonable` / `shadowrootserializable` | `{ clonable }` (cloneNode copy luôn shadow root) / `{ serializable }` (cho `getHTML()` serialize — attribute này Firefox **chưa** hỗ trợ) |
| `shadowrootcustomelementregistry` | Đặt `shadowRoot.customElementRegistry = null` thay vì registry của document, để gắn scoped registry sau bằng `registry.initialize(root)` |

```js
// hydrate trong constructor — đừng tạo lại root
const internals = this.attachInternals();
const root = internals.shadowRoot ?? this.attachShadow({ mode: 'open' });
if (!internals.shadowRoot) root.innerHTML = TEMPLATE;
// serialize & parse lại
const html = document.body.getHTML({ serializableShadowRoots: true });
container.setHTMLUnsafe(html);                  // hoặc Document.parseHTMLUnsafe(html)
```

**Hạn chế quan trọng:**

- DSD **chỉ parse khi HTML đến từ HTML parser** (response server, `setHTMLUnsafe`, `parseHTMLUnsafe`).
- `innerHTML`, `insertAdjacentHTML`, `DOMParser.parseFromString` **không** tạo shadow root — template nằm im như template thường. Quyết định bảo mật, không phải bug.
- `setHTMLUnsafe`/`parseHTMLUnsafe` **không sanitize** (đúng như tên) — chỉ dùng HTML mình kiểm soát; chỉ `<template shadowrootmode>` **đầu tiên** trong một element tạo shadow root.

**Support:** DSD Baseline từ 02/2024 (Chrome/Edge 111+, Safari 16.4+, Firefox 123+ — Chrome 90–110 dùng tên cũ `shadowroot`). `getHTML()` Baseline *newly available* 09/2024, `setHTMLUnsafe()` 09/2025 → feature detect cả hai. Detect DSD: `HTMLTemplateElement.prototype.hasOwnProperty('shadowRootMode')`.

## 🧩 Constructable Stylesheets & `adoptedStyleSheets`

```js
const sheet = new CSSStyleSheet();
sheet.replaceSync(`:host { display: block }`);
shadowRoot.adoptedStyleSheets = [sheet];   // share 1 sheet cho N instance
```

Parse CSS **một lần** cho mọi instance thay vì mỗi shadow root một `<style>`. Baseline widely available; Lit dùng cơ chế này cho `static styles`. Chi tiết → [[05 - Styling - CSS API cua Component]].

## 📦 Scoped Custom Element Registries

`customElements.define('my-btn', X)` là **global**; define lần 2 cùng tên → throw. Hai version của cùng thư viện trên một trang = vỡ.

```js
const registry = new CustomElementRegistry();
registry.define('my-btn', MyBtnV2);            // không đụng registry global
const root = host.attachShadow({ mode: 'open', customElementRegistry: registry });
root.innerHTML = `<my-btn>V2 ở đây</my-btn>`;  // dùng định nghĩa riêng
```

Kèm theo: `Document.customElementRegistry`, `ShadowRoot.customElementRegistry`, `registry.initialize(subtree)`, attribute `shadowrootcustomelementregistry` trong DSD. ⚠️ `customElementRegistry` chỉ nhận `null` hoặc một registry scoped — truyền registry global vào sẽ throw. **Support (MDN/BCD, 08/2026):** Safari 26+, Chrome/Edge 146+, **Firefox mới có ở bản preview (Nightly)** → chưa Baseline. Production chỉ nên dùng kèm polyfill `@webcomponents/scoped-custom-element-registry` hoặc coi như progressive enhancement.

## 📊 Bảng tổng kết

| API | Dùng để làm gì | Mức support | Production? |
| --- | --- | --- | --- |
| `attachInternals()` / `ElementInternals` | Cửa vào form + a11y + state | Baseline widely available (03/2023) | ✅ Có |
| `static formAssociated` + `setFormValue` | Submit được trong `<form>` | Chrome 77+, FF 98+, Safari 16.4+ | ✅ Có |
| `setValidity` + nhóm `form*Callback` | Validation, reset, disable, restore state | Như trên | ✅ Có |
| `internals.role` / `ariaLabel` | Semantic mặc định, override được | Chrome 103+ (`ariaLabel` 81+), FF 119+, Safari 16.4+ | ✅ Có |
| `ariaLabelledByElements` (nhóm `*Elements`) | Nối ARIA reference bằng object | Chrome 135+, FF 136+, Safari 16.4+ | ⚠️ Feature detect |
| `CustomStateSet` + `:state()` | State nội bộ style từ ngoài | Baseline 05/2024 | ✅ Có (fallback `:--x` nếu cần) |
| Declarative Shadow DOM | SSR / no-JS / chống FOUC | Baseline 02/2024 | ✅ Có |
| `getHTML()` / `setHTMLUnsafe()` | Serialize & parse lại DSD | Baseline newly available 09/2024 / 09/2025 | ⚠️ Feature detect |
| Constructable Stylesheets | Share CSS giữa instance | Baseline widely available | ✅ Có |
| Scoped `CustomElementRegistry` | Nhiều version cùng tag name | Safari 26+, Chrome/Edge 146+, **FF preview** | ⚠️ Cần polyfill |
| Reference Target (cross-root ARIA) | IDREF xuyên shadow boundary | Experimental, chưa vào standards track | ❌ Chưa |

## 🎁 Lit bọc sẵn phần lớn những thứ này

- `static formAssociated = true` dùng y hệt trên `LitElement`; `ElementInternals` lấy qua `this.attachInternals()` hoặc mixin/controller `@lit-labs/*`. `static styles` = Constructable Stylesheets + `adoptedStyleSheets`, tự động.
- `@lit-labs/ssr` render ra **Declarative Shadow DOM** rồi hydrate ở client — không phải tự viết `<template shadowrootmode>`.
- Reactive property + `willUpdate` giúp đồng bộ `setFormValue`/`setValidity` gọn hơn vanilla nhiều.
- Nhưng Lit **không** giấu được giới hạn của nền tảng (cross-root ARIA, scoped registry) → vẫn phải hiểu tầng dưới. Xem [[Lit/Introduction]].

## ⚠️ Bẫy thường gặp

- **`formAssociated` viết thành instance field** (`this.formAssociated = true`) → vô tác dụng, phải `static`. Gọi `attachInternals()` hai lần → `NotSupportedError`.
- **`setValidity` có flag true nhưng thiếu message** → `TypeError`. Muốn clear thì `setValidity({})`. Quên `anchor` → submit bị chặn mà browser không biết neo bubble lỗi vào đâu.
- **Không gọi `setFormValue` khi value đổi (kể cả giá trị khởi tạo)** → field không có trong `FormData` hoặc mang giá trị cũ. Đặt trong setter của `value` và gọi ở `connectedCallback`.
- **Truyền `FormData` mà mong browser tự ghép `name` của host vào key** → không, key là đúng thứ mình `append`.
- **Nhét DSD qua `innerHTML`** → template không thành shadow root. Phải parser hoặc `setHTMLUnsafe`.
- **Gọi `attachShadow()` khi đã có DSD root** → cùng `mode` thì **không** throw nhưng **xoá sạch** nội dung đã SSR; khác `mode` mới throw `NotSupportedError`. Check `internals.shadowRoot` trước.
- **Quên `shadowrootserializable`** → `getHTML({ serializableShadowRoots: true })` trả HTML thiếu shadow content, im lặng, không lỗi. **Dùng `:--loading` như cú pháp mới** → đó là bản cũ, chuẩn hiện tại là `:state(loading)`.
- **Tưởng Reference Target / scoped registry đã dùng được mọi nơi** → Reference Target còn experimental (Firefox/Safari cần pref), scoped registry Firefox mới ở preview.

## 📚 Nguồn

- MDN — [ElementInternals](https://developer.mozilla.org/en-US/docs/Web/API/ElementInternals) · [Web components (reference)](https://developer.mozilla.org/en-US/docs/Web/API/Web_components) · [CustomStateSet](https://developer.mozilla.org/en-US/docs/Web/API/CustomStateSet)
- MDN — [`<template>` (shadowrootmode & bạn bè)](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/template) · [Element.setHTMLUnsafe()](https://developer.mozilla.org/en-US/docs/Web/API/Element/setHTMLUnsafe)
- web.dev — [Declarative Shadow DOM](https://web.dev/articles/declarative-shadow-dom) · [More capable form controls](https://web.dev/articles/more-capable-form-controls)
- [Chrome for Developers — Scoped custom element registries](https://developer.chrome.com/blog/scoped-registries)
- [Igalia — Reference Target: having your encapsulation and eating it too](https://blogs.igalia.com/alice/reference-target-having-your-encapsulation-and-eating-it-too/)
