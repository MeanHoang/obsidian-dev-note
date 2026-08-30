# 02 — Templates & Directives

> lit-html: template là tagged template literal. Lit dựng một biểu diễn hiệu quả từ phần tĩnh, mỗi lần render sau chỉ cập nhật những chỗ `${}` đã đổi. Note này đi hết binding, conditional, list, toàn bộ built-in directives, custom directive và các giới hạn thật của lit-html.

Series: [[00 - Roadmap Web Components - Lit]] · Nền: [[Introduction]] · Trước: [[01 - Lit co ban - LitElement va Reactive Properties]]

---

## ⭐ 1. `html` hoạt động thế nào

`html` là một **tag function**: browser gọi nó với mảng phần tĩnh + danh sách phần động.

```js
html`<h1>Hello ${name}</h1>`
// strings = ['<h1>Hello ', '</h1>']   ← TemplateStringsArray
// values  = [name]
```

> **`TemplateStringsArray` identity** — theo spec JS, mỗi vị trí template literal trong source code luôn trả về **cùng một object** `strings` (so được bằng `===`), dù chạy bao nhiêu lần. lit-html cache `Template` đã parse theo identity này, nên lần render sau không phải parse lại HTML mà chỉ cập nhật các `Part` — con trỏ tới từng vị trí `${}`. 📖 [Templates overview](https://lit.dev/docs/templates/overview/)

```
Render đầu:  cache miss → parse HTML 1 lần, dựng <template> + danh sách Part
                        → clone content, gắn vào container
Render sau:  cache hit  → không parse lại, so từng value, chỉ commit Part đã đổi
```

### So với Virtual DOM (React)

| | lit-html | React VDOM |
| --- | --- | --- |
| Mô hình | Template tĩnh + danh sách vị trí động cố định | Tạo lại cây object mô tả UI mỗi render |
| Render lại | Chỉ so các `${}` — số lượng biết trước từ lúc parse | Diff cây con để tìm chỗ đổi |
| Cấu trúc HTML | **Hằng** với mỗi template | Có thể đổi ở bất kỳ đâu |
| Cần compile | Không — chạy thẳng trong browser | JSX phải build |

Khác biệt bản chất: **lit-html không phải diff cấu trúc** vì cấu trúc đã cố định từ lúc viết code. (lit.dev không công bố benchmark cho việc này — đừng trích số liệu.)

`html\`...\`` trả về một **`TemplateResult`** — object mô tả template strings + values + loại template, **không tự tạo DOM**. DOM chỉ sinh ra khi được `render()`, và `render()` dùng được ngoài `LitElement`:

```js
import { html, render } from 'lit';
render(html`<p>${msg}</p>`, document.body);
```

---

## ⭐ 2. Các kiểu expression

Lit có **5 kiểu binding + element expression**:

| Kiểu | Cú pháp | Set cái gì | Ví dụ |
| --- | --- | --- | --- |
| Child | `${}` giữa 2 tag | Nội dung node | `<p>${text}</p>` |
| Attribute | `attr=${}` | HTML attribute (string) | `<div class=${cls}>` |
| Boolean attribute | `?attr=${}` | Thêm/xóa attribute theo truthiness | `<input ?disabled=${busy}>` |
| Property | `.prop=${}` | JS property trên element | `<my-list .items=${arr}>` |
| Event listener | `@event=${}` | `addEventListener` | `<button @click=${this._go}>` |
| Element | `${}` ngay sau tên tag | Truy cập chính element | `<input ${ref(this.r)}>` |

Attribute expression **nội suy được** (`src="/img/${f}"`, `class="card ${v}"`); các kiểu còn lại phải chiếm trọn giá trị. **Element expression chỉ nhận directive** — mọi giá trị khác bị bỏ qua im lặng.

### Attribute vs `.property`

Attribute **luôn là string**. Property là **giá trị JS thật**.

```js
html`<my-list items=${this.items}>`   // ❌ → "[object Object],[object Object]"
html`<my-list .items=${this.items}>`  // ✅ array thật
```

- Object / array / function / number → dùng `.prop`.
- String đơn giản, hoặc cần selector CSS `[type="x"]` nhìn thấy → dùng attribute.
- **Native input**: dùng `.value` / `.checked` (attribute `value`/`checked` chỉ là giá trị *khởi tạo*).

### Event listener

Listener nhận **plain function hoặc object có `handleEvent`** — giống tham số `listener` của `addEventListener`. Trong LitElement, listener **tự bind vào component**, nên `this` trong handler là component instance. lit-html truyền chính giá trị đó làm tham số **options**, nên object dưới đây bật được `once` / `capture` / `passive`; gán binding thành `nothing` thì listener bị gỡ.

```js
html`<button @click=${{ handleEvent: this._go, once: true }}>Once</button>`
```

---

## 🔀 3. Điều kiện

Lit không có cú pháp điều kiện riêng — dùng JS thuần: ternary trong expression, hoặc `if` tính ngoài template rồi nhét `TemplateResult` vào.

```js
html`${this.user ? html`<p>Chào ${this.user.name}</p>` : html`<a href="/login">Đăng nhập</a>`}`
```

### `nothing` vs `noChange` vs `undefined` / `null` / `''`

Cả ba sentinel đều import từ `lit`: `import { html, nothing, noChange } from 'lit';`

| Giá trị | Child position | Attribute position | Property position |
| --- | --- | --- | --- |
| `undefined` / `null` | không render node | render **chuỗi rỗng** (attribute vẫn còn) | set property = `undefined`/`null` |
| `''` | không render node | `attr=""` | `''` |
| `nothing` | clear ChildPart, không render node | **XOÁ attribute** | property thành `undefined` |
| `noChange` | giữ nguyên giá trị đã render lần trước, **không đụng DOM** | như trên | như trên |

Khác biệt thực dụng nằm ở **attribute position**:

```js
// ✅ imagePath undefined/null → attribute src bị xoá hẳn
html`<img src=${this.imagePath ?? nothing}>`

// ❌ dùng '' hoặc undefined → ra <img src=""> → browser request lại trang hiện tại
html`<img src=${this.imagePath ?? ''}>`
```

`ifDefined(v)` chính là đường cú pháp cho `v ?? nothing`.

**Với `<slot>` fallback**: ở child position, `''` / `null` / `undefined` / `nothing` đều **không tạo node nào**, nên cả bốn đều để fallback content hiện ra. Điều phải tránh là render một node thật — kể cả text node chỉ chứa whitespace — vì slot sẽ coi như đã có content. Dùng `nothing` cho nhất quán giữa các vị trí binding.

### `when()` và `choose()`

```js
// when(condition, trueCase, falseCase?) — falseCase là optional
html`${when(this.user, () => html`User: ${this.user.username}`, () => html`<a href="/login">Sign In</a>`)}`

// choose(value, cases, defaultCase?)
html`${choose(this.section, [
  ['home',  () => html`<h1>Home</h1>`],
  ['about', () => html`<h1>About</h1>`],
], () => html`<h1>404</h1>`)}`
```

Cả hai chỉ là đường cú pháp (nhánh không chọn không bị gọi). `choose` so bằng **strict equality**, lấy case khớp đầu tiên, không fallthrough.

---

## 📋 4. Lists

```js
import { map } from 'lit/directives/map.js';
import { repeat } from 'lit/directives/repeat.js';

// 1. .map() thuần
html`<ul>${this.items.map((i) => html`<li>${i.name}</li>`)}</ul>`

// 2. map() directive — nhận iterable bất kỳ, chấp nhận cả undefined
html`<ul>${map(this.items, (i, idx) => html`<li>${idx}: ${i.name}</li>`)}</ul>`

// 3. repeat(items, keyFn, template)
html`<ul>${repeat(this.items, (i) => i.id, (i, idx) => html`<li>${idx}: ${i.name}</li>`)}</ul>`
```

### Khi nào cần `repeat()`

`.map()` / `map()` cập nhật DOM **tại chỗ**, không diff và không di chuyển node: node thứ n giữ nguyên, chỉ nội dung bị ghi đè. lit.dev nêu đúng **hai** trường hợp nên chuyển sang `repeat()` có keyFn:

1. **Cập nhật node đắt hơn di chuyển node** — item nặng, list bị sort/reorder nhiều.
2. **Node có state không do template expression điều khiển** — checkbox đã tick, `<input>` đang gõ dở / đang focus, animation đang chạy, video đang phát, scroll position, `@state` bên trong component con.

```js
html`${this.todos.map((t) => html`<li><input .value=${t.text}></li>`)}`        // ❌ reorder → focus dính sai item
html`${repeat(this.todos, (t) => t.id, (t) => html`<li><input .value=${t.text}></li>`)}`  // ✅
```

| | `.map()` / `map()` | `repeat()` có keyFn |
| --- | --- | --- |
| Cơ chế | update tại chỗ, không diff, không move | diff theo key, **di chuyển** DOM node |
| Kích thước / tốc độ | nhỏ hơn, nhanh hơn (lit.dev) | thêm chi phí diff key |
| Item có state DOM ngoài template | ❌ | ✅ |
| Vị trí hợp lệ | mọi expression | **chỉ child expression** |

👉 lit.dev khuyến nghị: **mặc định dùng `map()` / `.map()`**, chỉ dùng `repeat()` khi rơi vào 1 trong 2 trường hợp trên. `repeat()` **không có** keyFn thì hành xử gần như `map()` — lúc đó nên dùng `map()`.

### `range()` và `join()`

```js
// range(end) hoặc range(start, end, step) — end là exclusive
html`${map(range(5), (i) => html`<span>${i + 1}</span>`)}`   // in ra 1..5

// join(items, joiner) — joiner có thể là giá trị hoặc (index) => giá trị
html`${join(map(this.crumbs, (c) => html`<a href=${c.href}>${c.label}</a>`), ' / ')}`
```

---

## 🧰 5. Toàn bộ built-in directives

lit.dev liệt kê **20 directive** (cộng helper `createRef`). Import theo dạng `lit/directives/<kebab-name>.js`.

| Directive | Import | Vị trí hợp lệ | Dùng khi nào |
| --- | --- | --- | --- |
| `classMap` | `class-map.js` | attribute `class` | Bật/tắt nhiều class theo object truthiness (dùng `classList`) |
| `styleMap` | `style-map.js` | attribute `style` | Set nhiều inline style từ object (dùng `element.style`) |
| `ifDefined` | `if-defined.js` | attribute | Xoá attribute khi giá trị `undefined`/`null` — sugar của `?? nothing` |
| `when` | `when.js` | mọi vị trí | If/else 2 nhánh, gọn hơn ternary lồng nhau |
| `choose` | `choose.js` | mọi vị trí | Switch-case dạng expression, so strict equality |
| `map` | `map.js` | mọi vị trí | Lặp iterable bất kỳ (Set, generator), chấp nhận `undefined` |
| `repeat` | `repeat.js` | child | List có keyFn — cần diff + giữ DOM ổn định |
| `join` | `join.js` | mọi vị trí | Chèn separator giữa các item (breadcrumb, tag list) |
| `range` | `range.js` | mọi vị trí | Iterable số nguyên `[start, end)` — lặp n lần không cần array |
| `cache` | `cache.js` | child | Toggle giữa các template — **cache DOM cũ**, quay lại thì khôi phục |
| `guard` | `guard.js` | mọi vị trí | Chỉ gọi lại `valueFn` khi dependency đổi **identity (`===`)** |
| `keyed` | `keyed.js` | mọi vị trí | Key đổi → **huỷ DOM cũ** và dựng mới (opt-out khỏi reuse) |
| `live` | `live.js` | attribute / property | So giá trị với **DOM thật** thay vì giá trị render lần trước |
| `ref` / `createRef` | `ref.js` | element | Lấy tham chiếu element trong template |
| `templateContent` | `template-content.js` | child | Clone và render nội dung một `<template>` có sẵn |
| `unsafeHTML` | `unsafe-html.js` | child | Parse string thành HTML thật — ⚠️ XSS |
| `unsafeSVG` | `unsafe-svg.js` | child | Như trên nhưng cho SVG |
| `until` | `until.js` | mọi vị trí | Nhiều giá trị theo **thứ tự ưu tiên**, arg đầu ưu tiên cao nhất |
| `asyncAppend` | `async-append.js` | child | AsyncIterable — **nối thêm** mỗi giá trị (stream log, chat) |
| `asyncReplace` | `async-replace.js` | mọi vị trí | AsyncIterable — **thay** bằng giá trị mới nhất (timer, progress) |

### Những chỗ dễ sai khi dùng

```js
// classMap / styleMap: phải là expression DUY NHẤT trong attribute đó,
// nhưng vẫn ghép được với phần tĩnh.
html`<div class="card ${classMap({ active: this.active, disabled: this.busy })}">`

// styleMap: key có dấu gạch nhận CẢ camelCase lẫn dạng quote;
// riêng CSS custom property BẮT BUỘC quote đủ tên.
html`<div style=${styleMap({
  backgroundColor: this.color,   // 'background-color' cũng được
  '--gap': '8px',                // custom prop: phải quote
})}>`

// live: chỉ truyền string cho attribute expression — mọi kiểu ép kiểu
// sẽ khiến DOM bị ghi lại mỗi render.
html`<input .value=${live(this.value)} @input=${this._onInput}>`

// ref + createRef (element position)
class X extends LitElement {
  inputRef = createRef();
  render() { return html`<input ${ref(this.inputRef)}>`; }
  firstUpdated() { this.inputRef.value?.focus(); }
}
html`<div>${guard([this.value], () => expensiveRender(this.value))}</div>`
html`${until(this.contentPromise, html`<p>Đang tải…</p>`)}`
html`Timer: <span>${asyncReplace(ticker())}</span>`
```

> `cache` vs `keyed` — ngược nhau hoàn toàn: `cache` **giữ** DOM cũ lại để quay về nhanh khi toggle template; `keyed(key, value)` khi `key` đổi thì **huỷ và bỏ** DOM cũ để reset sạch state.

---

## 🛡️ 6. `unsafeHTML` và XSS

Mặc định lit-html coi **string ở child position là text content**, không phải HTML — nên nó vốn rất kháng XSS. `unsafeHTML` tắt lớp đó và parse string thành HTML thật (qua `innerHTML`).

```js
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

html`${unsafeHTML(userComment)}`   // ☠️ user gửi: <img src=x onerror="...">
```

lit.dev nói rõ: string truyền vào phải **do developer kiểm soát**. Nếu buộc phải render HTML từ ngoài thì sanitize trước:

```js
import DOMPurify from 'dompurify';
html`${unsafeHTML(DOMPurify.sanitize(this.markup, {
  ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'ul', 'li', 'code'],
  ALLOWED_ATTR: ['href', 'title'],
}))}`
```

Nguyên tắc: sanitize ở **nơi dữ liệu vào**, không phải nơi render; chỉ cần in text thì dùng `${value}` thường. Shadow DOM **không** bảo vệ khỏi XSS. `unsafeSVG` tương tự và rủi ro hơn (SVG cho phép `<script>`, `<foreignObject>`).

lit-html tương thích **Trusted Types** từ 1.3.0: phần HTML tĩnh của template được đẩy qua policy tên `lit-html` khi API này tồn tại. Điều đó **không** làm `unsafeHTML` an toàn — nội dung truyền vào vẫn phải tự đảm bảo.

---

## 🔧 7. Custom directive

Directive = hàm chạy **ở vị trí expression**, có thể truy cập DOM trực tiếp và giữ state qua nhiều lần render.

### Cấu trúc

```js
import { Directive, directive, PartType } from 'lit/directive.js';

class MyDirective extends Directive {
  constructor(partInfo) { super(partInfo); }           // 1 lần — validate vị trí dùng
  update(part, args) { return this.render(...args); }  // mặc định đúng như dòng này
  render(...args) { return value; }
}
export const myDirective = directive(MyDirective);
```

- **`update(part, args)` chạy TRƯỚC `render()`** trong mỗi lần cập nhật, và nhận `part` → có DOM thật. Implementation mặc định là `return this.render(...args)`, nên nếu không override thì chỉ `render()` chạy.
- `render()` khai báo thuần: trả về giá trị lit-html render được (kể cả một `DirectiveResult` khác). **Không** đụng DOM ở đây — `render()` là phần chạy được cả khi SSR.
- Trả về **`noChange`** = "giá trị này đã được directive xử lý, đừng ghi vào DOM" → giữ nguyên nội dung đã render lần trước. Khác với `undefined`, thứ sẽ clear Part.

### `PartType`

Enum trong `lit/directive.js`, đúng 6 giá trị. `ChildPart` **không có** `element` (nó có `parentNode`); `ElementPart` **không có** `name`.

| PartType | Giá trị | Vị trí | Part class truy cập được |
| --- | --- | --- | --- |
| `ATTRIBUTE` | 1 | `attr=${}` | `element`, `name`, `strings`, `options` |
| `CHILD` | 2 | `<p>${}</p>` | `parentNode`, `startNode`, `endNode`, `options` |
| `PROPERTY` | 3 | `.prop=${}` | `element`, `name`, `options` |
| `BOOLEAN_ATTRIBUTE` | 4 | `?attr=${}` | `element`, `name`, `options` |
| `EVENT` | 5 | `@evt=${}` | `element`, `name`, `options` |
| `ELEMENT` | 6 | `<div ${}>` | `element`, `options` |

### Ví dụ — `update()` + `PartType.ELEMENT`

Directive ở element position, chỉ đọc `part.element` (không sửa DOM mà lit đang quản lý). Đây gần đúng cách `ref()` hoạt động:

```js
import { noChange } from 'lit';

class MyRef extends Directive {
  constructor(partInfo) {
    super(partInfo);
    if (partInfo.type !== PartType.ELEMENT) {
      throw new Error('myRef() chỉ dùng ở element position: <input ${myRef(r)}>');
    }
  }
  update(part, [refObj]) {
    if (part.element !== this._el) {
      this._el = part.element;
      refObj.value = part.element;
    }
    return noChange;                 // element expression không ghi giá trị nào
  }
  render(_refObj) { return noChange; }
}
export const myRef = directive(MyRef);

// const r = { value: undefined };
// html`<input ${myRef(r)}>`   → sau render: r.value là <input>
```

> ⚠️ Đừng để directive ghi đè phần DOM mà lit-html đang giữ Part ở đó (ví dụ sửa `innerHTML` của một element vốn có child expression bên trong). Lần render sau lit sẽ ghi đè lại, hoặc tệ hơn là commit nhầm vị trí.

### `AsyncDirective`

Khi directive cần set giá trị **sau này** (subscription, promise, timer) và phải cleanup khi rời DOM:

```js
import { AsyncDirective, directive } from 'lit/async-directive.js';
import { noChange } from 'lit';

class ObserveDirective extends AsyncDirective {
  observable;
  unsubscribe;

  render(observable) {
    if (this.observable !== observable) {
      this.unsubscribe?.();
      this.observable = observable;
      if (this.isConnected) this.subscribe(observable);   // ⭐ luôn kiểm tra isConnected
    }
    return noChange;
  }
  subscribe(observable) {
    this.unsubscribe = observable.subscribe((v) => this.setValue(v));
  }
  disconnected() { this.unsubscribe?.(); }             // rời DOM → huỷ subscription
  reconnected() { this.subscribe(this.observable); }   // quay lại DOM → subscribe lại
}
export const observe = directive(ObserveDirective);
```

- `setValue(v)` — "push" giá trị mới vào riêng Part đó, **ngoài** chu kỳ update bình thường của component.
- `isConnected` — trạng thái kết nối hiện tại; kiểm tra trước khi subscribe để tránh leak.
- Không có `disconnected()` = **memory leak**.

---

## 🏷️ 8. `static-html` — đổi tag name / attribute name động

Bình thường **không thể** binding vào tag name hay tên attribute. `lit/static-html.js` cho phép, bằng cách nhúng giá trị vào chính phần template strings:

```js
import { html, literal } from 'lit/static-html.js';

class MyHeading extends LitElement {
  render() {
    const tag = this.level === 1 ? literal`h1` : literal`h2`;
    return html`<${tag} class="title">${this.text}</${tag}>`;
  }
}
```

Module export: `html`, `svg`, `literal`, `unsafeStatic`, `withStatic`.

- `literal` chỉ tag được **template literal viết thẳng trong source** — đó chính là thứ khiến nó an toàn (không nhận biến string). Kết quả gán vào biến thì được.
- Mỗi tổ hợp giá trị static khác nhau **tạo ra một template mới** → parse lại HTML và cache thêm một entry trong bộ nhớ (lit.dev gọi việc đổi giá trị static là "expensive"). Chỉ dùng với tập giá trị **hữu hạn, biết trước**; đừng buộc giá trị static vào reactive property đổi liên tục.
- `unsafeStatic(str)` nhận string thường — injection ở mức **cấu trúc template**, không sanitize được ở tầng giá trị. Chỉ dùng với hằng số trong code, và HTML sinh ra phải well-formed:

```js
// ☠️ TUYỆT ĐỐI KHÔNG — userInput = 'img src=x onerror=alert(1)' inject thẳng vào HTML source
html`<${unsafeStatic(userInput)}></${unsafeStatic(userInput)}>`
```

---

## 🚧 9. Giới hạn thật của lit-html

**Yêu cầu gốc: template phải là HTML well-formed khi thay mọi `${}` bằng chuỗi rỗng.** Template có thể có nhiều element ở cấp cao nhất, nhưng **không được để tag hở** — HTML parser sẽ tự đóng và gây lồng nhau ngoài ý muốn.

```js
const s = `<p>${text}</p>`; html`${s}`   // ❌ nối chuỗi HTML → ra text, không phải HTML
html`<${tag}>`                           // ❌ tên tag (dev mode báo lỗi) — trừ static-html
html`<div ${attrName}=${value}>`         // ❌ tên attribute — trừ static-html
html`${cond ? '<div>' : ''}abc</div>`    // ❌ tag mở/đóng phải cùng một template
html`<div ${cond ? 'hidden' : ''}>`      // ❌ element expr chỉ nhận directive → bỏ qua im lặng
html`<template>${x}</template>`          // ❌ nội dung <template> không cập nhật
html`<textarea>${text}</textarea>`       // ❌ → dùng .value=${text}
html`<div contenteditable>${t}</div>`    // ❌ → dùng .innerText=${t}
html`<!-- ${note} -->`                   // ❌ render ra token của Lit, không cập nhật
html`<style>.x { color: ${c} }</style>`  // ❌ khi dùng ShadyCSS polyfill → dùng custom prop
```

Cách nghĩ đúng: **cấu trúc HTML là hằng, chỉ giá trị là biến**. Cần đổi cấu trúc thì đổi **cả template**:

```js
html`${this.compact
  ? html`<span class="chip">${this.label}</span>`
  : html`<div class="card"><h3>${this.label}</h3><slot></slot></div>`}`
```

Hệ quả tốt: HTML không bao giờ được ghép chuỗi → bề mặt HTML injection chỉ còn `unsafeHTML` / `unsafeSVG` / `unsafeStatic`.

---

## ⚠️ Bẫy thường gặp

1. **Quên dấu `.`** — `<my-el items=${arr}>` biến array thành string. Object/array luôn dùng `.prop`.
2. **`value=` với input** — chỉ set giá trị khởi tạo. Dùng `.value=${x}`, thêm `live()` nếu giá trị bị sửa ngoài luồng.
3. **Dùng `''`/`undefined` thay `nothing` ở attribute** — attribute vẫn tồn tại với giá trị rỗng; `<img src="">` khiến browser request lại trang hiện tại. Dùng `ifDefined` hoặc `?? nothing`.
4. **`.map()` cho list có state DOM ngoài template** — checkbox/focus dính sai item khi reorder. Dùng `repeat()` **có keyFn**.
5. **keyFn trong `repeat()` trả về index** — vô nghĩa, hành xử y hệt `map()`. Key phải là **id ổn định** của item.
6. **`styleMap` tưởng phải camelCase** — thực ra `'background-color'` (quote) cũng chạy; chỉ **CSS custom property** là bắt buộc quote đủ tên: `'--my-var'`.
7. **`classMap` không phải là expression duy nhất của `class`** — được ghép với phần tĩnh (`class="card ${classMap(...)}"`) nhưng **không được có 2 expression** trong cùng attribute `class`. `styleMap` y hệt với `style`.
8. **`.data=${{ a: 1 }}` inline** — object mới mỗi render → child component update vô ích. Hoist ra ngoài hoặc `guard`. (`@click=${() => …}` thì lit chỉ remove/add listener, ít tốn hơn nhiều.)
9. **Build template bằng nối chuỗi / `new Function`** — `TemplateStringsArray` mới mỗi lần → cache miss, mất hết ưu thế của lit-html.
10. **Quên `disconnected()` trong `AsyncDirective`** — subscription/timer sống mãi sau khi element bị xoá.
11. **Expression ở vị trí không hợp lệ** (`<textarea>`, comment, `<template>`) — im lặng không hoạt động, không có warning.

---

## 📚 Nguồn

- [Templates overview](https://lit.dev/docs/templates/overview/) · [Expressions](https://lit.dev/docs/templates/expressions/)
- [Conditionals](https://lit.dev/docs/templates/conditionals/) · [Lists](https://lit.dev/docs/templates/lists/)
- [Built-in directives (guide)](https://lit.dev/docs/templates/directives/) · [Directives API](https://lit.dev/docs/api/directives/)
- [Custom directives (guide)](https://lit.dev/docs/templates/custom-directives/) · [Custom directives API](https://lit.dev/docs/api/custom-directives/)
- [Templates API — `nothing`, `TemplateResult`](https://lit.dev/docs/api/templates/) · [static-html API](https://lit.dev/docs/api/static-html/)
- [Shadow DOM — slot fallback](https://lit.dev/docs/components/shadow-dom/) · [lit-html 1.3.0 — Trusted Types](https://lit.dev/docs/v2/releases/release-notes/1.3.0/)

→ Trước: [[01 - Lit co ban - LitElement va Reactive Properties]] · Roadmap: [[00 - Roadmap Web Components - Lit]]
