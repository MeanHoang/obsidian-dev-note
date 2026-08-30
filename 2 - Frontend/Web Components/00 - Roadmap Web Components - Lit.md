# 00 — Roadmap học Web Components & Lit

> **Mục tiêu:** đi từ zero → tự build được một **UI library / design system** bằng Web Components + [Lit](https://lit.dev), dùng được ở mọi nơi (React, Vue, Shopify theme, vanilla HTML).
>
> **Thời lượng gợi ý:** ~8 tuần (2–5h/tuần). Nén còn ~3 tuần nếu chỉ cần "dùng được".
>
> **Prereq:** JS ES6+ (class, module, arrow fn, destructuring, template literal), DOM API cơ bản, CSS.
>
> Note nền đã có: [[Introduction]] · [[Lit/Introduction|Lit — Introduction]]
>
> 🧱 **Thấy series này khó?** Đọc [[00 - Roadmap - Tu HTML den Pixel]] trước — nó giải thích browser hoạt động thế nào (DOM, script, render) rồi so sánh React vs Web Components ở tầng đó.

---

## 🧭 Mental model — hiểu trong 1 câu

```
Web Components  =  TIÊU CHUẨN của browser (không phải thư viện)
                   → Custom Elements + Shadow DOM + Template/Slot

Lit             =  THƯ VIỆN mỏng (~5KB min+gzip) ngồi trên tiêu chuẩn đó
                   → thêm: reactive state + template engine + styling tiện
```

👉 Học Lit mà **không hiểu Web Components** = học React mà không hiểu DOM. Chạy thì chạy, nhưng debug sẽ khóc. Nên **Phase 1 bắt buộc là vanilla trước**.

```mermaid
flowchart TD
    P0["Phase 0<br/>Chuẩn bị JS/DOM"] --> P1["Phase 1<br/>Web Components thuần"]
    P1 --> P2["Phase 2<br/>Lit cơ bản"]
    P2 --> P3["Phase 3<br/>Template nâng cao<br/>(directives)"]
    P3 --> P4["Phase 4<br/>Composition<br/>(mixin · controller)"]
    P4 --> P5["Phase 5<br/>Data & Async<br/>(Context · Task · Signals)"]
    P5 --> P6["Phase 6<br/>Tooling · Test · Publish"]
    P6 --> P7["Phase 7<br/>Chuyên sâu<br/>SSR · i18n · Design System"]
```

---

## 🗂 Bản đồ note (MOC)

> Mỗi phase có note chi tiết riêng, bám sát doc chính thức (MDN + lit.dev).

### 📘 Core — Web Components thuần

| # | Note | Nội dung chính |
| --- | --- | --- |
| 01 | [[01 - Web Components la gi - Lich su va Tong quan]] ⭐ | Định nghĩa, ai xây dựng, lịch sử spec v0→v1, điểm mạnh/yếu, ai đang dùng |
| 02 | [[02 - Custom Elements]] | Lifecycle callbacks, attribute vs property, element upgrade |
| 03 | [[03 - Shadow DOM]] | Encapsulation, open/closed, event retargeting |
| 04 | [[04 - Template va Slot]] | `<template>`, slot, light DOM vs flattened tree |
| 05 | [[05 - Styling - CSS API cua Component]] | CSS var, `::part`, `::slotted`, `:host`, Tailwind |
| 06 | [[06 - Events va giao tiep]] | CustomEvent, `composed`, props down/events up |
| 07 | [[07 - API nang cao - ElementInternals, Form-associated, DSD]] | Form, ARIA, `:state()`, Declarative Shadow DOM |

### 🔥 Lit

| # | Note | Nội dung chính |
| --- | --- | --- |
| — | [[Lit/Introduction\|Lit — Introduction]] | Lit là gì, so sánh với WC thuần |
| 01 | [[01 - Lit co ban - LitElement va Reactive Properties]] | Reactive properties, lifecycle, styles |
| 02 | [[02 - Templates va Directives]] | 6 kiểu binding, directives, custom directive |
| 03 | [[03 - Composition - Mixin va Reactive Controller]] | Mixin vs Controller (≈ React hooks) |
| 04 | [[04 - Quan ly data - Context, Task, Signals]] | `@lit/context`, `@lit/task`, Signals (Labs) |
| 05 | [[05 - Tooling, Testing va Publishing]] | Vite/WDS, `@web/test-runner`, publish npm |
| 06 | [[06 - Chuyen sau - SSR, Localization, React, A11y]] | SSR, i18n, `@lit/react`, a11y, perf |

---

## 🟢 Phase 0 — Chuẩn bị (1–2 ngày)

Chỉ cần chắc mấy thứ này, thiếu thì ôn:

- [ ] `class`, `extends`, `super()`, static field, getter/setter
- [ ] ES modules: `import` / `export`, `<script type="module">`
- [ ] Template literal + **tagged template literal** ⭐ (Lit sống bằng cái này)
- [ ] DOM: `querySelector`, `addEventListener`, `CustomEvent`, event bubbling
- [ ] Async: Promise, `async/await`

> 💡 Tagged template literal là chỗ nhiều người bỏ qua, rồi sau đó không hiểu ``html`...` `` thực chất là gì. Dành 15 phút đọc kỹ.

---

## 🔵 Phase 1 — Web Components thuần (tuần 1–2) ⭐ QUAN TRỌNG NHẤT

Không dùng thư viện gì cả. Chỉ 1 file HTML + browser.

### 1.1 Custom Elements
- `class X extends HTMLElement` + `customElements.define('my-x', X)`
- Quy tắc tên: **bắt buộc có dấu gạch ngang** (`my-button` ✅ / `button2` ❌)
- 4 lifecycle callbacks:

| Callback | Khi nào chạy | Dùng để |
| --- | --- | --- |
| `constructor()` | lúc tạo element | set state mặc định (❌ đừng đụng DOM/attribute) |
| `connectedCallback()` | gắn vào DOM | render, đăng ký listener, fetch |
| `disconnectedCallback()` | gỡ khỏi DOM | **cleanup** listener, timer |
| `attributeChangedCallback()` | attribute đổi | sync attribute → property |

- `static observedAttributes = ['label', 'disabled']`
- **Attribute vs Property** ⭐ — attribute luôn là string trong HTML, property là giá trị JS (giữ được object/array/function)
- **`element upgrade`** — element đã có trong DOM trước khi `customElements.define()` chạy → xem [[02 - Custom Elements]]
- `:defined` — `my-el:not(:defined) { visibility: hidden }` để chặn FOUC lúc chưa define xong

### 1.2 Shadow DOM
- `this.attachShadow({ mode: 'open' })` vs `'closed'`
- **Style encapsulation**: CSS ngoài không lọt vào, CSS trong không lọt ra
- Cái gì **xuyên qua được** shadow boundary? → CSS custom properties (`--joy-color`), inherited properties (`font`, `color`)
- Cái gì **không** xuyên qua? → class, selector thường
- `getRootNode()`, `Node.isConnected`

### 1.3 Template & Slot
- `<template>` — HTML "ngủ đông", không render; clone bằng `content.cloneNode(true)`
- `<slot>` — chỗ trống nhận content từ ngoài (tương đương `children` của React)
- Named slot: `<slot name="header">` ↔ `<div slot="header">`
- `slotchange` event, `assignedElements()`

### 1.4 Styling từ ngoài vào (đây là "API tạo hình" của component)

| Cách | Cú pháp | Dùng khi |
| --- | --- | --- |
| CSS variables | `--btn-bg: red` | ⭐ cách chính, linh hoạt nhất |
| `::part()` | `<x-btn part="label">` → `x-btn::part(label)` | mở "cửa sổ" style có chủ đích |
| `::slotted()` | `::slotted(span)` | style content người dùng nhét vào |
| `:host`, `:host()` | `:host([disabled])` | style chính element, biến thể theo attribute |

> ⚠️ `:host-context()` đã bị CSSWG gỡ khỏi spec, Firefox/Safari không hỗ trợ — **đừng dùng cho project mới** ([MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/:host-context)).

### 1.5 Events
- `CustomEvent` + `dispatchEvent`
- `bubbles: true`, **`composed: true`** ⭐ — thiếu `composed` là event kẹt trong shadow root
- `event.composedPath()`

### 1.6 Nâng cao (đọc lướt, biết là có)
- `ElementInternals` + **form-associated custom elements** → component tự submit được trong `<form>`
- `CustomStateSet` + CSS `:state()` — state nội bộ nhưng style được từ ngoài
- **Declarative Shadow DOM** (`<template shadowrootmode="open">`) — nền tảng cho SSR
- Constructable Stylesheets (`adoptedStyleSheets`)

### ✅ Checkpoint Phase 1
Tự làm, **không copy-paste**:
1. `<my-counter>` — nút +/−, có attribute `start`, phát event `count-change`
2. `<my-card>` — dùng slot `header` / `body` / `footer`, style qua CSS variable + `::part`
3. Trả lời được: *tại sao CSS ngoài không style được vào trong? cách nào cho phép có chủ đích?*

📖 [MDN Web Components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components) · [web.dev — Custom Elements v1](https://web.dev/articles/custom-elements-v1)

---

## 🟣 Phase 2 — Lit cơ bản (tuần 3)

Setup: `npm create vite@latest` → chọn template **Lit**, hoặc `npm i lit` vào project sẵn có (Lit 3.x).

- `LitElement` = `HTMLElement` + reactive + auto render
- `render()` trả về ``html`...` ``
- **Reactive properties**:
  ```js
  static properties = {
    count: { type: Number },
    open:  { type: Boolean, reflect: true },
  };
  ```
  - `type` · `attribute` (đổi tên / tắt) · `reflect` (property → attribute) · `state: true` (internal) · `converter` · `hasChanged`
  - Dùng TypeScript thì có `@property()` / `@state()`
- **Styles**: ``static styles = css`...` `` — expression trong CSS chỉ evaluate **1 lần** rồi dùng lại cho mọi instance
- **Template syntax** — 6 kiểu binding ([doc](https://lit.dev/docs/templates/expressions/)):

| Cú pháp | Ý nghĩa | Ví dụ |
| --- | --- | --- |
| `${x}` | child (text / template / list) | `<p>${this.name}</p>` |
| `attr=${x}` | attribute | `<div class=${this.cls}>` |
| `.prop=${x}` | **property** ⭐ | `<input .value=${this.v}>` |
| `?attr=${x}` | boolean attribute (có/không có attr) | `<button ?disabled=${this.busy}>` |
| `@event=${fn}` | event listener | `<button @click=${this.onClick}>` |
| `${directive()}` | element expression — chỉ nhận directive | `<div ${ref(this.r)}>` |

- **Lifecycle** ⭐ — tách 2 nhóm ([doc](https://lit.dev/docs/components/lifecycle/)):
  ```
  Custom element (chuẩn browser):
    constructor → connectedCallback → disconnectedCallback → adoptedCallback
                                    → attributeChangedCallback

  Reactive update cycle (Lit) — chạy ở microtask, lặp mỗi lần property đổi:
    requestUpdate → shouldUpdate → willUpdate → update → render
                  → firstUpdated (chỉ lần đầu) → updated → updateComplete
  ```
  - Update cycle đầu tiên được kích hoạt trong `connectedCallback()`
  - `firstUpdated()` = chỗ đụng DOM lần đầu (query element con)
- Conditional: ``${cond ? html`...` : html`...`}`` · List: `${items.map(...)}`, dùng **`repeat()`** khi cần key
- `createRenderRoot() { return this }` — render vào light DOM (vd để xài Tailwind global). Lit khuyến cáo hạn chế: mất DOM scoping, style scoping và khả năng compose nội bộ

### ✅ Checkpoint Phase 2
Viết lại `<my-counter>` và `<my-card>` bằng Lit → đếm số dòng, so với Phase 1.

📖 [lit.dev/docs/components](https://lit.dev/docs/components/overview/) · [lit.dev/tutorials](https://lit.dev/tutorials/) ← **làm hết tutorial này**

---

## 🟠 Phase 3 — Template nâng cao & Directives (tuần 4)

Built-in directives — biết khi nào dùng cái nào:

| Directive | Dùng để |
| --- | --- |
| `repeat()` | list có key, giữ nguyên DOM khi reorder |
| `map()`, `range()`, `join()` | lặp gọn |
| `classMap()`, `styleMap()` | bind class / style động ⭐ |
| `ifDefined()` | bỏ hẳn attribute khi value `undefined` |
| `when()`, `choose()` | conditional gọn |
| `cache()` | giữ DOM khi switch qua lại giữa 2 template |
| `guard()` | chỉ re-evaluate template khi dependency đổi |
| `keyed()` | gắn value với 1 key — key đổi thì ép render lại DOM mới |
| `live()` | so sánh với giá trị DOM thật thay vì giá trị render lần trước (input) |
| `ref()` | lấy reference tới element |
| `until()`, `asyncAppend()`, `asyncReplace()` | render giá trị async / AsyncIterable |
| `unsafeHTML()` | ⚠️ render string thành HTML thay vì text — nhớ sanitize |

> Tất cả import từ `lit/directives/<tên>.js`. Danh sách đầy đủ: [lit.dev/docs/templates/directives](https://lit.dev/docs/templates/directives/)

- **Custom directive**: `directive()`, `Directive`, `AsyncDirective` (nắm khái niệm là đủ)
- `lit/static-html.js` (`literal`, `unsafeStatic`) — khi cần đổi tag name động
- **Cơ chế lit-html**: mỗi tagged template có một *strings array* với identity cố định → lit-html parse & cache `<template>` theo array đó, mỗi lần render chỉ ghi lại đúng những vị trí `${}` có giá trị đổi

---

## 🟡 Phase 4 — Composition (tuần 5)

Đây là chỗ tách "biết dùng Lit" ↔ "biết **thiết kế** component".

- **Component composition** — chia nhỏ, giao tiếp: property đi xuống, event đi lên
- **Mixins** — `const Foo = (Base) => class extends Base { ... }` → tái dùng behavior (vd `ClickOutsideMixin`)
- **Reactive Controllers** ⭐ — object gắn vào lifecycle của host, tương đương "custom hook" của React:
  ```js
  class ClockController {
    hostConnected() { /* start timer */ }
    hostDisconnected() { /* cleanup */ }
  }
  ```
  - `addController()`, `hostUpdate`, `hostUpdated`
  - Tách logic (timer, fetch, ResizeObserver, media query) ra khỏi component

> So sánh nhanh: **Mixin** = thêm API vào class · **Controller** = đóng gói state + lifecycle, không đụng API của class. Mặc định nên ưu tiên **Controller**.

---

## 🔴 Phase 5 — Quản lý data (tuần 6)

- **`@lit/context`** (stable) — DI / provide–inject, thay cho prop drilling (giống React Context)
  - `createContext()`, `@provide()`, `@consume()`, `ContextProvider` / `ContextConsumer` — hợp cho theme, i18n, store
- **`@lit/task`** (stable) — quản lý async: `TaskStatus` = `INITIAL / PENDING / COMPLETE / ERROR`, tự re-run khi `args` đổi
  - `task.render({ initial, pending, complete, error })`
- **Signals** — `@lit-labs/signals` (dựa trên [TC39 Signals Proposal](https://github.com/tc39/proposal-signals)) hoặc `@lit-labs/preact-signals`
  - ⚠️ **Labs** = experimental, có thể breaking change / ngừng support → cân nhắc trước khi lên production
- State ngoài (Redux / Zustand / Nanostores): subscribe bằng một Reactive Controller

---

## ⚫ Phase 6 — Tooling · Testing · Publishing (tuần 7)

- **Dev server**: Vite (hệ plugin lớn) hoặc `@web/dev-server` (no-bundle, phục vụ ES module gốc)
- **TypeScript** ⚠️ — tuỳ loại decorator, chọn đúng một trong hai:
  - `experimentalDecorators: true` → **bắt buộc** `useDefineForClassFields: false` (khi `target` ≥ ES2022)
  - standard decorators (TS 5.2+) → `useDefineForClassFields: true`
  - Sai cặp này = class field ghi đè accessor → **mất reactivity** ([doc](https://lit.dev/docs/components/decorators/))
- **Testing**: `@web/test-runner` + `@open-wc/testing` — chạy trong **browser thật** (Puppeteer / Playwright / Selenium / WebdriverIO), không dùng jsdom
  - Luôn `await el.updateComplete` trước khi assert ⭐
- **Lint**: `eslint-plugin-lit`, `lit-analyzer` (check template ngay trong IDE)
- **Custom Elements Manifest** — `@custom-elements-manifest/analyzer` sinh file `custom-elements.json`, trỏ tới nó bằng field `"customElements"` trong `package.json` → docs + autocomplete cho IDE
- **Publish npm** ([doc](https://lit.dev/docs/tools/publishing/)): xuất ES module cú pháp ES2021, `"type": "module"`, **không bundle / không minify** (đó là việc của app, bundle sẽ nhân bản Lit), import có đuôi `.js`, kèm `.d.ts` + entry `HTMLElementTagNameMap`
- **Production**: bundle + minify + brotli ở tầng app, lazy-load component; `@lit-labs/compiler` (Labs) compile template trước runtime

---

## 🟤 Phase 7 — Chuyên sâu (tuần 8+, chọn hướng bạn cần)

| Hướng | Nội dung |
| --- | --- |
| **Design System** ⭐ | token → primitive → component → pattern (liên kết với `5 - Design System` trong vault) |
| **SSR** (Labs) | `@lit-labs/ssr` + Declarative Shadow DOM, hydration |
| **Framework interop** | `@lit/react` (wrapper cho React), dùng trong Vue / Angular / Svelte |
| **Localization** | `@lit/localize` — runtime mode vs transform mode |
| **A11y** | focus trap, `delegatesFocus`, ARIA xuyên shadow DOM (phần khó nhất!) |
| **Performance** | `guard()`, `cache()`, lazy define, đo bundle size |

---

## 🛠 Dự án thực chiến (làm song song với các phase)

1. **`<joy-button>`** (sau Phase 2) — variant, size, loading, disabled, icon slot
2. **`<joy-modal>`** (sau Phase 4) — focus trap, ESC để đóng, click-outside (dùng controller), a11y
3. **`<joy-data-table>`** (sau Phase 5) — fetch bằng `@lit/task`, sort/filter, `repeat()`, pagination
4. **Mini design system** (sau Phase 6) — 8–10 component + token + docs + publish npm
5. **Nhúng vào project thật** — dùng trong Shopify theme / React app để thấy đúng giá trị "framework-agnostic"

---

## ⚠️ Bẫy thường gặp (đọc trước, đỡ mất một buổi tối)

1. **Mutate object/array tại chỗ → không re-render** — `hasChanged` mặc định so sánh reference (`!Object.is()` trong source `reactive-element.ts`; prose lit.dev viết `!==`), sửa in-place giữ nguyên reference. Phải gán mới: `this.items = [...this.items, x]`. Chi tiết: [[01 - Lit co ban - LitElement va Reactive Properties]]
2. Đọc/ghi attribute hay children trong `constructor()` → spec custom element cấm; chuyển sang `connectedCallback()` / `firstUpdated()`
3. Quên `composed: true` → event không vượt được shadow boundary (`bubbles` một mình là chưa đủ)
4. Quên cleanup trong `disconnectedCallback()` / `hostDisconnected()` → memory leak (timer, listener, observer)
5. `experimentalDecorators` + `useDefineForClassFields: true` → class field ghi đè accessor mà Lit tạo → mất reactivity
6. `reflect: true` trên property không khai `type` → mặc định là `type: String` nên attribute ra `[object Object]`. Khai `type: Object` thì reflect ra `JSON.stringify` — nhưng nói chung **đừng reflect object/array**
7. Tailwind + Shadow DOM không ăn → dùng CSS variable, inject stylesheet vào shadow root, hoặc bỏ shadow DOM bằng `createRenderRoot() { return this }` (đánh đổi: mất DOM scoping + style scoping)
8. Test assert trước khi `await el.updateComplete` → flaky, vì update chạy ở microtask sau khi property đổi

---

## 📚 Tài nguyên

**Chính thức**
- [lit.dev/docs](https://lit.dev/docs/) — docs Lit 3
- [lit.dev/tutorials](https://lit.dev/tutorials/) ⭐ interactive, làm hết
- [lit.dev/playground](https://lit.dev/playground/) — thử nhanh, không cần setup
- [MDN — Web Components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components)

**Cộng đồng / đọc source thật**
- [Open WC](https://open-wc.org) — best practice, testing, linting
- [Shoelace](https://shoelace.style) — design system viết bằng Lit, source rất đáng đọc. ⚠️ Đã sunset, kế tục bởi [Web Awesome](https://webawesome.com)
- [Material Web](https://github.com/material-components/material-web) — Google, Lit
- [Spectrum Web Components](https://opensource.adobe.com/spectrum-web-components/) — Adobe
- [custom-elements-everywhere.com](https://custom-elements-everywhere.com) — độ tương thích với từng framework

---

## ✅ Checklist tự đánh giá

- [ ] Giải thích được Custom Elements / Shadow DOM / Template mà không nhìn note
- [ ] Phân biệt attribute vs property, biết khi nào cần `reflect`
- [ ] Style được component từ ngoài bằng 3 cách (CSS var, `::part`, `::slotted`)
- [ ] Vẽ được lifecycle Lit từ `constructor` → `updated`
- [ ] Biết khi nào dùng `repeat()` thay vì `.map()`
- [ ] Viết được 1 Reactive Controller tự chế
- [ ] Dùng được `@lit/task` cho 1 màn hình fetch data
- [ ] Test được component bằng `@web/test-runner`
- [ ] Publish được 1 package lên npm và dùng lại ở project khác
