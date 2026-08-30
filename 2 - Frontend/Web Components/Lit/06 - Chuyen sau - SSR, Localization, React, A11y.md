# 06 — Chuyên sâu: SSR, Localization, React, A11y

> Phase 7: những thứ chỉ gặp khi làm **thật** — server-side rendering, đa ngôn ngữ, nhét component vào app React/Vue/Angular, accessibility xuyên shadow DOM, performance, và kiến trúc design system.
> Nhiều package ở đây là **Lit Labs** ⚠️ — đọc kỹ phần cảnh báo trước khi đưa vào production.
>
> Series: [[00 - Roadmap Web Components - Lit]]

---

## ⚠️ Lit Labs là gì (đọc trước)

Package dưới scope `@lit-labs/*` = **thử nghiệm**, đang lấy feedback cộng đồng.

- Breaking change **hay xảy ra hơn** package thường, nhưng vẫn tuân theo semver.
- Package "tốt nghiệp" sẽ chuyển sang scope `@lit`. Version `@lit` đầu tiên khớp version `@lit-labs` cuối cùng; sau đó **chỉ `@lit` được update** (ví dụ `@lit-labs/task` → `@lit/task`, `@lit-labs/react` → `@lit/react`).
- Package bị deprecate được support fix bug **tối thiểu 6 tháng**.

Mức trưởng thành theo [lit.dev/docs/libraries/labs](https://lit.dev/docs/libraries/labs/) — *near graduation*: `scoped-registry-mixin`; *under development*: `eleventy-plugin-lit`, `motion`, `observers`, `signals`, `ssr`, `testing`, `virtualizer`; *prototyping*: `analyzer`, `cli`, `compiler`, `preact-signals`, `router`.

👉 Quy tắc cá nhân: Labs chỉ dùng khi **(a)** có fallback rõ ràng, **(b)** pin version, **(c)** có test bao phủ.

---

## 🖥 1. SSR với `@lit-labs/ssr` ⚠️ Labs

### Cách hoạt động

```
Node.js: render(html`<my-el>`) → HTML có <template shadowrootmode="open">…</template>
                                 (Declarative Shadow DOM — browser tự parse thành shadow root)
Browser: HTML hiển thị ngay → JS load → hydrate()
                              → Lit gắn lại expression vào DOM có sẵn, không re-render
```

Theo doc: Lit SSR **"works without fully emulating the browser's DOM"** — nó tận dụng định dạng template khai báo của lit-html để đạt TTFB thấp và **stream được**.

### Phía server

```js
import {render} from '@lit-labs/ssr';
import {RenderResultReadable} from '@lit-labs/ssr/lib/render-result-readable.js';
import {collectResult} from '@lit-labs/ssr/lib/render-result.js';
import {html} from 'lit';
import './my-element.js';           // component phải được import để define trên server

app.get('/', (req, res) => {        // Express: stream
  res.type('html');
  const result = render(html`<my-element .data=${data}></my-element>`);
  new RenderResultReadable(result).pipe(res);
});

// Hoặc gom thành string một cục
const htmlString = await collectResult(render(html`<my-element></my-element>`));
```

- Signature: `render(value: unknown, renderInfo?: Partial<RenderInfo>): RenderResult`.
- `collectResultSync()` (cùng module với `collectResult`) là bản đồng bộ — **throw nếu gặp Promise**.
- `RenderInfo` (tham số thứ 2): `deferHydration: boolean` (mặc định `false`, thêm attribute `defer-hydration` để kiểm soát thời điểm hydrate) và `elementRenderers: ElementRenderer[]` (renderer cho element non-Lit).

### Phía client — hydrate

```js
// index.js — THỨ TỰ IMPORT QUAN TRỌNG
import '@lit-labs/ssr-client/lit-element-hydrate-support.js';  // TRƯỚC lit và mọi component
import './my-element.js';
```

> *"This module must be loaded before the `lit` module is loaded (including any component modules that import `lit`)."* Khi bundle: import này đứng **đầu tiên** trong entry file.

Với template độc lập (không phải LitElement), hydrate thủ công — sau đó `render()` bình thường cho các lần update tiếp theo. Browser chưa hỗ trợ Declarative Shadow DOM thì polyfill một lần sau khi HTML parse xong:

```js
import {hydrate} from '@lit-labs/ssr-client';
hydrate(myTemplate(data), document.body);   // data phải GIỐNG HỆT lúc render server

if (!HTMLTemplateElement.prototype.hasOwnProperty('shadowRoot')) {
  const {hydrateShadowRoots} =
    await import('@webcomponents/template-shadowroot/template-shadowroot.js');
  hydrateShadowRoots(document.body);
}
```

### DOM emulation trên server

Lit tự import một bộ **DOM shim tối thiểu** và define global `customElements`. Doc: *"only the minimal DOM interfaces needed to define and register components are implemented"*.

- ✅ đầy đủ: `attributes`, `setAttribute()`, `getAttribute()`, `hasAttribute()`, `removeAttribute()`.
- ⚠️ một phần: `attachShadow()` / `shadowRoot` trả về `{host: this}` (`shadowRoot` chỉ khi mode `'open'`); `HTMLElement` là empty class.
- ❌ không có: `window` / `document` đầy đủ, layout, event, observer.

Chi tiết: [lit.dev/docs/ssr/dom-emulation](https://lit.dev/docs/ssr/dom-emulation/)

### Lifecycle nào chạy trên server

| | Chạy trên server ✅ | KHÔNG chạy ❌ |
| --- | --- | --- |
| **LitElement** | `constructor()`, `hasChanged()`, `willUpdate()`, `render()` | `connectedCallback()`, `disconnectedCallback()`, `attributeChangedCallback()`, `adoptedCallback()`, `shouldUpdate()`, `update()`, `firstUpdated()`, `updated()` |
| **ReactiveController** | `constructor()` | `hostConnected()`, `hostDisconnected()`, `hostUpdate()`, `hostUpdated()` |
| **Directive** | `constructor()`, `render()` | `update()`, `disconnected()`, `reconnected()` |

Hệ quả: directive async (`until`, `asyncAppend`, `asyncReplace`) không resolve trên server — xem phần hạn chế bên dưới.

### Viết component "SSR-safe"

```js
import {isServer} from 'lit';   // ⭐ export sẵn từ lit

class MyEl extends LitElement {
  constructor() {
    super();
    this.width = 0;   // ✅ state thuần. ❌ offsetWidth / querySelector / ResizeObserver
  }
  willUpdate() { /* ❌ đừng đo DOM ở đây — willUpdate CHẠY trên server */ }
  firstUpdated() { this.width = this.offsetWidth; }   // ✅ chỉ chạy trên browser
}

// Side effect ở module level
if (isServer) { /* code Node */ } else { window.addEventListener('resize', /* … */); }
```

Quy tắc rút gọn:

1. `constructor` / `hasChanged` / `willUpdate` / `render` phải **thuần** — không đụng DOM chưa được shim.
2. Mọi thứ đụng DOM → `firstUpdated` / `updated` / `connectedCallback`.
3. Data phải **serialize được** và **giống hệt nhau** hai phía, nếu không hydration sẽ lệch.
4. Đừng bundle `lit` vào package của bạn — làm vậy phá `exports` conditional (node/browser) mà SSR dựa vào.

### Tích hợp sẵn

Eleventy (`@lit-labs/eleventy-plugin-lit` ⚠️ Labs) · Next.js pages router (`@lit-labs/nextjs` ⚠️ Labs) · Astro integration for Lit · Rocket · Nuxt 3 (`nuxt-ssr-lit`, cộng đồng) · Node/Koa/Express thì tự viết, ~15 dòng như ví dụ trên.

### 🧭 Đánh giá thật: có nên dùng?

**Cho SEO thì thường KHÔNG cần.** Google Search chạy JS bằng **evergreen Chromium** và Web Rendering Service *"flattens the light DOM and shadow DOM"* — tức nội dung shadow DOM vẫn được index. Caveat của Google: nếu component **không dùng `<slot>`** cho nội dung light DOM thì có thể không render như mong đợi.

Lý do hợp lý để dùng SSR: **TTFB / FCP** (content-heavy site, mạng chậm), hoặc kiến trúc bắt buộc SSR (Eleventy/Astro/Next đã SSR sẵn và bạn muốn nhúng component Lit vào).

Hạn chế hiện tại (theo [SSR overview](https://lit.dev/docs/ssr/overview/)): vẫn **Labs**, chưa 1.0 · **"Async component work is not supported"** → `@lit/task`, `until()` không render ra HTML · chỉ hỗ trợ component có **shadow DOM** (light-DOM component chưa) · `ElementRendererRegistry` cho interop với custom element non-Lit còn đang thảo luận · Declarative Shadow DOM cần cân nhắc polyfill cho browser cũ.

👉 Kết luận thực dụng: **site marketing/nội dung** → cân nhắc, dùng qua Eleventy/Astro. **App nội bộ, dashboard, widget nhúng** → bỏ qua, không đáng.

---

## 🌍 2. Localization với `@lit/localize`

Package **stable** (scope `@lit`, không phải Labs): `npm i @lit/localize` + `npm i -D @lit/localize-tools`.

### `msg()` và `str`

```js
import {msg, str} from '@lit/localize';
import {html} from 'lit';

msg('Hello World');                                 // string thuần
msg(str`Hello ${name}`);                            // ⭐ string CÓ biến → bắt buộc tag `str`
msg(html`Hello <b>${name}</b>, <a href=${url}>xem</a>`);   // markup (+ biến) → tag `html`
msg('Launch', {desc: 'Nút phóng tên lửa'});         // context cho translator
msg('Buffalo', {id: 'buffalo-animal'});             // ID thủ công khi trùng chữ khác nghĩa
```

> Doc: *"Strings that contain an expression must be tagged with either `html` or `str` in order to be localizable… untagged template string literals are evaluated to regular strings before they are received by the `msg` function, which means dynamic expression values could not otherwise be captured."*

Khi không có markup, **ưu tiên `str` hơn `html`** — doc nói `str` *"has slightly less performance overhead"*.

### Runtime mode vs Transform mode

| | **Runtime mode** | **Transform mode** |
| --- | --- | --- |
| Output | 1 module JS/TS load động **cho mỗi locale** | 1 **build app độc lập** cho mỗi locale |
| Đổi ngôn ngữ | `setLocale()` | **Reload trang** |
| JS bytes thêm | **1.27 KiB** (minified + compressed) | **0 KiB** |
| Template API | `msg()` | `msg()` (giống hệt) |
| Config API | `configureLocalization()` | `configureTransformLocalization()` |
| Ưu điểm chính | Đổi locale nhanh hơn, ít byte biên | Render nhanh hơn, ít byte mỗi locale |

> 💡 Doc: *"Unsure which mode to use? Start with runtime mode. It's easy to switch modes later because the core `msg` API is identical."*

### `lit-localize.json`

```json
{
  "$schema": "https://raw.githubusercontent.com/lit/lit/main/packages/localize-tools/config.schema.json",
  "sourceLocale": "en",
  "targetLocales": ["vi", "ja"],
  "tsConfig": "./tsconfig.json",
  "output": {
    "mode": "runtime", "language": "ts",
    "outputDir": "src/generated/locales",
    "localeCodesModule": "src/generated/locale-codes.ts"
  },
  "interchange": {"format": "xliff", "xliffDir": "./xliff/"}
}
```

- Bắt buộc: `sourceLocale`, `targetLocales`, `output`, `interchange`.
- Input: `tsConfig` **hoặc** `inputFiles` (mảng glob) — JS thuần dùng `"inputFiles": ["src/**/*.js"]`.
- `output.mode`: `"runtime"` (cần thêm `language`: `"js"`|`"ts"`) | `"transform"` (chỉ cần `outputDir`, mỗi locale một subdirectory).
- `interchange.format`: `"xliff"` (cần `xliffDir`, tuỳ chọn `placeholderStyle`) | `"xlb"` (cần `outputFile` + `translationsGlob`).

### Workflow: extract → dịch → build

`npx lit-localize extract` quét `msg()` → tạo/cập nhật file XLIFF (`.xlf`) → gửi cho translator (hoặc TMS: Crowdin, Lokalise, Phrase…) điền `<target>` → `npx lit-localize build` đưa bản dịch trở lại app theo mode đã cấu hình. XLIFF là format chuẩn ngành, mọi tool dịch chuyên nghiệp đọc được; commit cả `.xlf` vào git.

### Runtime mode — code

```ts
// setup 1 lần, sớm nhất có thể
import {configureLocalization} from '@lit/localize';
import {sourceLocale, targetLocales} from './generated/locale-codes.js';

export const {getLocale, setLocale} = configureLocalization({
  sourceLocale, targetLocales,
  loadLocale: (locale) => import(`./generated/locales/${locale}.js`),
});

await setLocale('vi');   // trả về Promise, resolve khi locale mới load xong
```

Module `locale-codes` sinh ra export `sourceLocale`, `targetLocales`, `allLocales`.

Component muốn tự re-render khi đổi locale — TS dùng class decorator `@localized()`, JS gọi `updateWhenLocaleChanges(this)` trong `constructor` (cả hai import từ `@lit/localize`):

```ts
@localized() @customElement('my-greeting')
class MyGreeting extends LitElement {
  render() { return html`<p>${msg('Hello')}</p>`; }
}
// JS tương đương: constructor() { super(); updateWhenLocaleChanges(this); }
```

### Transform mode — code

```js
import {configureTransformLocalization} from '@lit/localize';
export const {getLocale} = configureTransformLocalization({sourceLocale: 'en'});
```

Chỉ trả về `getLocale`. Doc: *"In transform mode, the `setLocale` function is not available. Instead, reload the page so that the next load will pick a different locale bundle."*

> ⚠️ **Bẫy runtime mode**: quên `@localized()` / `updateWhenLocaleChanges()` → gọi `setLocale()` xong component vẫn hiển thị ngôn ngữ cũ cho tới lần update tiếp theo.

---

## ⚛️ 3. Dùng Lit component trong React — `@lit/react`

### Vì sao cần wrapper (React ≤ 18)

- **Property phức tạp**: `<my-el data={{a:1}} />` → React set attribute `data="[object Object]"`. JSX không có cú pháp set **property**.
- **Custom event**: React chỉ nhận event có "event property" chuẩn (`onClick`…); `<my-el onmy-event={…}>` **không** gọi `addEventListener`.
- Workaround thủ công (`useRef` + `useEffect` để set property và `addEventListener`) phải lặp lại ở mọi chỗ dùng.

### `createComponent()`

```jsx
import React from 'react';
import {createComponent} from '@lit/react';
import {MyElement} from './my-element.js';

export const MyElementComponent = createComponent({
  tagName: 'my-element',
  elementClass: MyElement,
  react: React,                        // cũng nhận preact-compat
  events: {onactivate: 'activate'},    // prop React → tên DOM event
});

// dùng: <MyElementComponent data={{a: 1}} onactivate={(e) => …} />
//        data được set như PROPERTY, không phải attribute
```

Cơ chế: `createComponent` dùng toán tử `in` để kiểm tra element có property đó không — có thì set property, không thì set attribute.

TypeScript gõ đúng type event bằng `EventName` (import từ `@lit/react`): `events: {'onmy-event': 'my-event' as EventName<MyEvent>}`.

Children render vào **default slot**. Named slot cần element bọc, dùng `display: contents` để không ảnh hưởng layout: `<div slot="footer" style={{display: 'contents'}}><ReactFooter /></div>`.

Bonus: `useController()` (`@lit/react/use-controller.js`) — dùng **Reactive Controller** của Lit như một React hook.

### React 19 — khi nào KHÔNG cần wrapper nữa

Theo [custom-elements-everywhere.com](https://custom-elements-everywhere.com), React `^19` đạt **100%** (16/16 basic, 16/16 advanced) — ngang Vue, Angular, Svelte, Solid, Preact.

- React 19 dùng **runtime heuristic** để quyết định truyền property hay attribute: object/array → property; primitive → attribute hoặc property.
- Custom event: gắn bằng `addEventListener`; test suite của CEE pass với nhiều quy ước tên prop (`onlowercaseevent`, `onKebabCaseEvent`, `onMyEvent`).

👉 App React 19+ dùng nội bộ → dùng thẳng custom element, **không cần** `@lit/react`. Còn React 17/18 → cần wrapper. **Publish library** cho người ngoài → vẫn nên xuất bản wrapper `@lit/react` ở entry `/react`: bạn không kiểm soát version React của consumer, và wrapper cho type/autocomplete tốt hơn.

---

## 🧩 4. Vue / Angular / Svelte

Tất cả đều đạt **100%** trên custom-elements-everywhere: Vue `^3.2.38`, Angular `16.2.10`, Svelte `4.2.19`, Solid `1.6.8`, Preact `^10`. Khác biệt nằm ở **cú pháp**, không ở khả năng.

**Vue 3** — báo cho compiler biết tag nào là custom element, nếu không Vue warn "failed to resolve component":

```js
// vite.config.js
vue({template: {compilerOptions: {isCustomElement: (tag) => tag.includes('-')}}});
```

Vue **cần cú pháp tường minh để ép property**: `<my-el :data.prop="obj">`. Event: `@count-change="handler"`.

**Angular** — thêm `CUSTOM_ELEMENTS_SCHEMA` ở `@NgModule({schemas: [...]})` hoặc `@Component` standalone (import từ `@angular/core`). Binding: `[data]="obj"` set property, `(count-change)="handler($event)"` nghe custom event.

**Svelte** — gần như zero-config: `<my-el data={obj} on:count-change={handler} />`.

> 📊 Luôn tra [custom-elements-everywhere.com](https://custom-elements-everywhere.com) trước khi hứa "component của tôi chạy mọi framework".

---

## ♿ 5. Accessibility ⭐

### Vấn đề ARIA xuyên Shadow DOM

ARIA liên kết bằng **ID reference** (`aria-labelledby`, `aria-describedby`, `aria-controls`, `for`). ID chỉ có hiệu lực **trong cùng một tree** → reference xuyên shadow boundary **chết im lặng**:

```html
<label id="lbl">Tên</label>                  <!-- light DOM -->
<my-input aria-labelledby="lbl"></my-input>  <!-- <input> bên trong KHÔNG thấy #lbl -->
```

Cách xử lý thực tế:

1. **Đưa element cần a11y ra light DOM qua `<slot>`** — chắc ăn nhất. Shoelace/Material Web đều làm vậy cho label.
2. **Reflect thuộc tính vào bên trong**: nhận `label` làm property, tự render `<label for>` **trong cùng** shadow root.
3. **`ElementInternals`** để set role/ARIA mặc định cho chính host element.
4. Với ID cross-root thật sự: chờ **ARIA Element Reflection** (`ariaLabelledByElements`) / **Reference Target** — mới, chưa dùng được rộng.
5. `aria-label` (text thuần, không cần ID) là lối thoát an toàn nhất khi bí.

👉 Chi tiết `ElementInternals`, form-associated custom element, `:state()`: [[07 - API nang cao - ElementInternals, Form-associated, DSD]]

### Focus & tab order

```js
static shadowRootOptions = {...LitElement.shadowRootOptions, delegatesFocus: true};
```

Theo [MDN — `ShadowRoot.delegatesFocus`](https://developer.mozilla.org/docs/Web/API/ShadowRoot/delegatesFocus), khi `delegatesFocus: true`: click vào phần **không focusable** trong shadow DOM, hoặc gọi `host.focus()`, đều đưa focus vào element focusable **đầu tiên** trong shadow root; shadow host nhận styling **`:focus`**. ⚠️ MDN cảnh báo "element focusable đầu tiên" có thể là **sai element** (ví dụ nút close thay vì ô text) — dùng attribute `autofocus` để chỉnh lại.

Ngoài ra: tab order tôn trọng **thứ tự DOM phẳng**, `tabindex` dương là anti-pattern; `document.activeElement` chỉ trả về **host**, muốn biết element thật phải đi `el.shadowRoot.activeElement` (đệ quy nếu nested).

**Focus trap cho modal**: ưu tiên **`<dialog>` native** + `showModal()` — browser lo focus trap, inert phần nền, Esc đóng, trả focus về element cũ. Tự viết trap là nguồn bug vô tận, và `querySelectorAll` tìm focusable **không xuyên shadow root** → phải duyệt từng shadow root hoặc dùng thư viện (`focus-trap`, `a11y-dialog`).

### Lint & test a11y

`npm i -D eslint-plugin-lit-a11y`, rồi `{"plugins": ["lit-a11y"], "extends": ["plugin:lit-a11y/recommended"]}` trong `.eslintrc.json`. 26 rule, phần lớn port từ `eslint-plugin-jsx-a11y` sang template `html` của lit-html: ARIA attribute/role/value, alt cho image, keyboard event handler, heading, iframe, tabindex, autofocus.

Test runtime bằng **axe-core** — package `chai-a11y-axe`, ship sẵn trong `@open-wc/testing`:

```js
import {fixture, expect, html} from '@open-wc/testing';
const el = await fixture(html`<my-dialog open>Nội dung</my-dialog>`);
await expect(el).to.be.accessible();
await expect(el).to.be.accessible({ignoredRules: ['color-contrast']});  // hoặc ignoredTags
```

⚠️ axe chỉ bắt được các vấn đề **tự động hoá được** — vẫn phải **test bàn phím thủ công** (Tab / Shift+Tab / Enter / Space / Esc / mũi tên) và nghe thử bằng screen reader (NVDA trên Windows, VoiceOver trên macOS).

### ✅ Checklist a11y cho component library

- [ ] Keyboard-operable đúng key theo [APG](https://www.w3.org/WAI/ARIA/apg/); focus ring nhìn thấy (`:focus-visible`), không `outline: none` trần trụi.
- [ ] Role & ARIA state đúng, ưu tiên `ElementInternals`, cho phép override bằng attribute.
- [ ] Label: hỗ trợ cả `<slot>` label và `aria-label` / `label` property.
- [ ] Modal/overlay: `<dialog>` + `showModal()`, Esc đóng, trả focus, `inert` nền.
- [ ] Live region (`aria-live="polite"`) nằm **cùng shadow root** với nội dung thông báo.
- [ ] Tôn trọng `prefers-reduced-motion`, `prefers-contrast`; contrast ≥ 4.5:1 kể cả dark mode.
- [ ] `eslint-plugin-lit-a11y` + axe test trong CI; screen reader thật ít nhất 1 lần cho component phức tạp.

---

## ⚡ 6. Performance

| Kỹ thuật | Khi nào dùng |
| --- | --- |
| `guard(deps, () => tmpl)` | Sub-template đắt, chỉ render lại khi `deps` đổi |
| `cache(cond ? a : b)` | Đổi qua lại giữa **các template khác nhau** (tab, view mode) — giữ DOM đã tạo trong cache |
| `repeat(items, keyFn, tmpl)` vs `items.map()` | `repeat` cho list **có reorder / chèn / xoá** và item có state; `map()` rẻ hơn cho list tĩnh hoặc chỉ append cuối |
| `keyed(key, tmpl)` | Ép huỷ & tạo lại DOM khi identity thay đổi |
| Lazy define + dynamic `import()` | Component nặng, dưới màn hình, ít dùng |
| `static styles` | Chia sẻ `CSSStyleSheet` giữa mọi instance — **đừng** dùng `<style>` inline trong `render()` |

Nguyên tắc tránh re-render thừa:

- Lit vốn **không** re-render cây con: mỗi `LitElement` update **độc lập**. Cha update không kéo theo con, trừ khi cha truyền property mới xuống.
- ⚠️ Bẫy: truyền **object/array literal mới mỗi lần render** (`.config=${{a: 1}}`) → `hasChanged` mặc định so sánh `!==` → con update mọi lần. Fix: giữ reference ổn định, hoặc custom `hasChanged`.
- Đừng làm việc nặng trong `render()` — đưa lên `willUpdate()` với điều kiện `changedProperties.has('x')`. Đừng set property trong `updated()` mà không có guard → vòng lặp update vô hạn.

Đo đạc: Chrome DevTools **Performance** panel, `performance.mark()` / `measure()` quanh update, và warning `'change-in-update'` của Lit dev build. Bundle size: xem [[05 - Tooling, Testing va Publishing]].

**List dài** → `@lit-labs/virtualizer` ⚠️ **Labs** (under development; README mô tả là "late prerelease", API dự kiến ổn định trước 1.0). Chỉ render đủ item lấp viewport:

```js
import '@lit-labs/virtualizer';
// hoặc directive khi cần tự kiểm soát container:
// import {virtualize} from '@lit-labs/virtualizer/virtualize.js';

html`<lit-virtualizer .items=${contacts}
  .renderItem=${(c) => html`<my-contact .data=${c}></my-contact>`}></lit-virtualizer>`;
```

Cân nhắc CSS `content-visibility: auto` như giải pháp không-JS trước khi thêm dependency Labs.

---

## 🏛 7. Kiến trúc design system

4 tầng: **Pattern/Recipe** (form layout, page shell — thường chỉ là docs) → **Component** (`<acme-datepicker>`) → **Primitive** (`<acme-button>`, `<acme-input>`) → **Design token** (`--acme-color-primary`, CSS custom property).

**Tầng 1 — Design token.** CSS custom property là API tạo kiểu **xuyên được shadow DOM** (kế thừa qua boundary) → nền tảng của mọi design system web-component. Nguồn sự thật nên là JSON/**DTCG** → build ra CSS/JS/iOS/Android bằng **Style Dictionary**, đừng viết tay. Token 2 tầng: *primitive* (`--acme-blue-500`) → *semantic* (`--acme-color-action`); chỉ semantic mới được component dùng → đổi theme không phải sửa component.

**Tầng 2–3 — Component.**

- **Styling API công khai**: custom property, `::part()`, `:state()` — chỉ expose thứ bạn cam kết duy trì. Nội bộ shadow DOM **không** phải API. Chi tiết styling & publishing: [[05 - Tooling, Testing va Publishing]].
- Prefix tag nhất quán; attribute theo chuẩn HTML (`disabled`, `value`, `name`, `required`). Event kebab-case, `bubbles: true, composed: true` nếu cần nghe từ ngoài, `detail` có schema rõ.
- Mỗi component: 1 file, tự define, export class, JSDoc đủ để CEM sinh docs.

**Versioning & docs.** Semver nghiêm túc — đổi tag name / xoá part / đổi tên CSS property = **breaking**, deprecate ít nhất 1 minor và log warning ở dev build. Dùng `@changesets/cli` cho version + changelog; docs sinh từ **CEM** (`api-viewer-element`) hoặc Storybook; publish kèm wrapper React (`@acme/ui/react`); visual regression trong CI để đổi token không âm thầm phá layout.

**Tham khảo (đọc source rất đáng):** Shoelace / Web Awesome (styling API, `::part`, form association) · Material Web `@material/web` (token 2 tầng, a11y, `ElementInternals`) · Adobe Spectrum Web Components (monorepo, theming, i18n) · Nord / Carbon / Vaadin (design system doanh nghiệp).

---

## ⚠️ Bẫy thường gặp

| Bẫy | Hậu quả | Cách tránh |
| --- | --- | --- |
| Đụng DOM trong `constructor()` / `willUpdate()` | Crash khi SSR (DOM chưa được shim) | Đẩy xuống `firstUpdated`/`updated`/`connectedCallback`; dùng `isServer` |
| Import `lit-element-hydrate-support.js` **sau** `lit`/component | Hydration không được cài đặt | Đặt import đó **đầu tiên** trong entry |
| Data hydrate khác data server | DOM lệch, expression gắn sai chỗ | Serialize state server → client, dùng đúng một nguồn |
| Kỳ vọng `@lit/task` / `until()` render trên server | HTML server ra rỗng | SSR chưa hỗ trợ async — render placeholder |
| Template literal thường trong `msg()` | Placeholder biến mất, translator nhận chuỗi đã ghép | Dùng `` msg(str`…`) `` |
| Quên `@localized()` / `updateWhenLocaleChanges()` | `setLocale()` xong UI không đổi | Thêm vào mọi component có `msg()` |
| Chọn transform mode rồi mới cần language switcher | `setLocale()` không tồn tại | Bắt đầu bằng runtime mode |
| `aria-labelledby` trỏ ID xuyên shadow boundary | Screen reader **không đọc gì**, im lặng | Slot label ra light DOM, `aria-label`, hoặc render label cùng shadow root |
| Tự viết focus trap / `querySelectorAll` tìm focusable | Không xuyên shadow root → trap thủng | `<dialog>` + `showModal()`, hoặc thư viện |
| Object literal mới mỗi render (`.config=${{...}}`) | Component con update vô ích | Giữ reference ổn định / `hasChanged` tuỳ biến |
| Coi nội bộ shadow DOM là API | User style bằng selector nội bộ → refactor là họ vỡ | Công khai `::part` / custom property, ghi rõ trong docs |
| Dùng package Labs mà không pin version | Minor update phá build | Pin, đọc changelog, có kế hoạch thoát |

---

## 📚 Nguồn

- Lit SSR — [overview](https://lit.dev/docs/ssr/overview/) · [server-usage](https://lit.dev/docs/ssr/server-usage/) · [client-usage](https://lit.dev/docs/ssr/client-usage/) · [authoring](https://lit.dev/docs/ssr/authoring/) · [dom-emulation](https://lit.dev/docs/ssr/dom-emulation/)
- Lit Localization — [overview](https://lit.dev/docs/localization/overview/) · [runtime-mode](https://lit.dev/docs/localization/runtime-mode/) · [transform-mode](https://lit.dev/docs/localization/transform-mode/) · [cli-and-config](https://lit.dev/docs/localization/cli-and-config/)
- Lit — [React (`@lit/react`)](https://lit.dev/docs/frameworks/react/) · [Lit Labs (chính sách & package)](https://lit.dev/docs/libraries/labs/) · [`@lit-labs/virtualizer`](https://github.com/lit/lit/tree/main/packages/labs/virtualizer)
- [Custom Elements Everywhere](https://custom-elements-everywhere.com)
- [`eslint-plugin-lit-a11y`](https://open-wc.org/docs/linting/eslint-plugin-lit-a11y/overview/) · [`chai-a11y-axe`](https://open-wc.org/docs/testing/chai-a11y-axe/) · [WAI-ARIA APG](https://www.w3.org/WAI/ARIA/apg/)
- MDN — [`ShadowRoot.delegatesFocus`](https://developer.mozilla.org/docs/Web/API/ShadowRoot/delegatesFocus) · [`ElementInternals`](https://developer.mozilla.org/docs/Web/API/ElementInternals)
- Google Search — [Fix JavaScript problems (shadow DOM flattening)](https://developers.google.com/search/docs/crawling-indexing/javascript/fix-search-javascript) · [The new evergreen Googlebot](https://developers.google.com/search/blog/2019/05/the-new-evergreen-googlebot)
- [Shoelace](https://shoelace.style) · [Material Web](https://material-web.dev) · [Spectrum WC](https://opensource.adobe.com/spectrum-web-components/)

---

⏮️ Trước đó: [[05 - Tooling, Testing va Publishing]] · 🧩 Liên quan: [[07 - API nang cao - ElementInternals, Form-associated, DSD]]
