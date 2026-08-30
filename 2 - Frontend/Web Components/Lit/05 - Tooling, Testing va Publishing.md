# 05 — Tooling, Testing và Publishing

> Phase 6 của roadmap: từ "code chạy trên máy tôi" → **package npm người khác dùng được** — yêu cầu môi trường, dev server, tsconfig chuẩn Lit, lint/IDE, test trong browser thật, Custom Elements Manifest, checklist publish npm, tối ưu production.
>
> Series: [[00 - Roadmap Web Components - Lit]]

---

## 🌐 1. Yêu cầu môi trường

Doc Lit: *"Lit is published as ES2021."* — không kèm bản ES5.

| Thứ | Yêu cầu |
| --- | --- |
| JS syntax | ES2021 |
| DOM API | `<template>`, Custom Elements, Shadow DOM, `ParentNode` |
| Browser được test | Chromium / Safari bản hiện hành + 2 major trước đó; Firefox bản hiện hành + Firefox ESR |
| Không hỗ trợ | **IE11 và Classic Edge** — Lit 3 không test trên đó (non-standard DOM behavior) |

Browser cũ hơn *"may still work but will be at best efforts without guarantee"*.

👉 Với browser hiện đại: **không cần polyfill**. Doc nói transform *duy nhất* bắt buộc là **resolve bare module specifier** (`import {html} from 'lit'` → URL thật). Webpack / Vite tự làm; Rollup cần `@rollup/plugin-node-resolve`; dev không bundle thì cần dev server rewrite (mục 2).

### Legacy browser → dùng Lit 2, không phải Lit 3

Doc Lit 3: *"If you must support legacy browsers, consider using Lit 2 with additional compilation and/or polyfills."*

Setup legacy của **Lit 2** phải load đúng thứ tự — JS polyfill trước, vì web components polyfill dựa vào `Promise`: (1) `core-js` + `regenerator-runtime`, bundle **riêng** không chung app bundle → (2) `lit/polyfill-support.js` → (3) `@webcomponents/webcomponentsjs/webcomponents-loader.js` (feature-detect, nhiều round-trip) hoặc `webcomponents-bundle.js` (nạp hết, ít round-trip) → (4) code app.

Với `@web/dev-server` / `@web/test-runner`, phần legacy đi qua `@web/dev-server-legacy` (`legacyPlugin`) — doc testing của Lit có config mẫu bật `polyfills.webcomponents` + custom polyfill trỏ tới `node_modules/lit/polyfill-support.js`.

Declarative Shadow DOM trên browser chưa support → `@webcomponents/template-shadowroot` (xem [[06 - Chuyen sau - SSR, Localization, React, A11y]]).

> ⚠️ Doc Lit có hẳn mục **"Don't import polyfills into modules"**: polyfill là quyết định của app, không phải của thư viện. Ghi vào README thay vì nhét vào code.

---

## 🛠 2. Dev setup — Vite vs @web/dev-server

| | **Vite** | **@web/dev-server** (WDS) |
| --- | --- | --- |
| Mô hình | dev = esbuild transform + HMR, build = Rollup | **no-bundle**, serve file gốc, rewrite bare specifier → code chạy y như browser sẽ chạy |
| HMR | Có, sẵn | Không mặc định (chỉ reload; `@web/dev-server-hmr` mới ở mức cơ bản, web components thường dùng `@open-wc/dev-server-hmr`) |
| TS | Sẵn qua esbuild (không type-check) | Qua `@web/dev-server-esbuild`, hoặc chạy `tsc -w` song song |
| Hệ sinh thái test | Vitest | `@web/test-runner` — **chung config, chung plugin** |
| Dùng khi | App SPA, team đã quen Vite | **Publish component library**, muốn sát chuẩn |

Config WDS tối thiểu (theo doc Lit — Development):

```js
// web-dev-server.config.js
export default {
  open: true,
  watch: true,
  appIndex: 'index.html',
  nodeResolve: {
    exportConditions: ['development'],
  },
};
```

```bash
npm i -D @web/dev-server && npx web-dev-server --node-resolve --watch --open
```

> 💡 `exportConditions: ['development']` **nằm bên trong `nodeResolve`**, không phải top level. Nó chọn **development build** của Lit: unminified + thêm check và warning. Doc liệt kê 2 nhóm warning tuỳ chọn — `'migration'` (migrate từ LitElement 2.x, **tắt** mặc định) và `'change-in-update'` (đổi reactive state trong lúc update, **bật** mặc định) — cộng warning dev-only khi phát hiện **nhiều version hoặc nhiều bản copy cùng version** của package lõi Lit.

### Starter kit chính thức

`lit/lit-element-starter-js` (JS) và `lit/lit-element-starter-ts` (TS) — sẵn Web Dev Server, **Web Test Runner**, ESLint + `lit-analyzer`, và site docs tĩnh (web-component-analyzer + Eleventy). Doc ghi rõ *"None of these tools is required to work with Lit"*. Lựa chọn khác: generator của Open WC (`npm init @open-wc`).

---

## ⚙️ 3. TypeScript config ⭐ — chỗ dev mới dính bug nhiều nhất

| Option | Giá trị | Lý do |
| --- | --- | --- |
| `target` | `es2021` (hoặc cao hơn) | Lit publish ES2021; hạ target thấp hơn chỉ làm code phình |
| `lib` | `["es2021", "dom", "dom.iterable"]` | Cần DOM types |
| `module` | `es2020`+ / `esnext` | Giữ ESM, đừng compile ra CJS |
| `moduleResolution` | `bundler` (hoặc `node16`/`nodenext`) | Để hiểu `"exports"` map của `lit`. `node` (cũ) resolve sai subpath như `lit/directives/…` |
| `experimentalDecorators` | `true` **hoặc** `false` | Xem 2 chế độ bên dưới |
| **`useDefineForClassFields`** | Đi kèm chế độ decorator | ⚠️ Quan trọng nhất — xem giải thích |
| `declaration` + `declarationMap` | `true` | Publish `.d.ts` (+ jump-to-source) |
| `sourceMap` | `true` | Debug |

### `useDefineForClassFields` — vì sao phải để ý

Với `target: ES2022` trở lên, TS mặc định `useDefineForClassFields = true`: class field được emit theo semantics **`[[Define]]`** (`Object.defineProperty(this, 'x', …)` — tạo thẳng **own property** trên instance, **che mất** accessor trên prototype) thay vì **`[[Set]]`** (gán `this.x = …` — chạy qua setter kế thừa từ prototype nếu có).

`@property()` của Lit sinh **accessor trên prototype**, nên với `[[Define]]` thì `@property() name = 'world'` tạo own property che accessor đó → set `name` không trigger update, component **không re-render**. Không lỗi, không warning ở production build — cực khó debug. Doc Lit gọi đây là *"issues with class fields when declaring properties"*.

### Hai chế độ decorator hợp lệ

**Lit 3 hỗ trợ cả experimental decorators lẫn standard decorators (TC39 stage 3).** Hai cặp option đi liền nhau, không trộn:

| Chế độ | `experimentalDecorators` | `useDefineForClassFields` | Ghi chú |
| --- | --- | --- | --- |
| **A — experimental** | `true` | `false` | Doc Lit **khuyến nghị cho production** (compiler output tốt hơn) |
| **B — standard** | `false` | `true` | Bắt buộc keyword `accessor` |

```ts
// Chế độ B: decorator property phải đặt trên accessor / auto-accessor
@customElement('my-el')
class MyEl extends LitElement {
  @property() accessor name = 'world';
}
```

Version tối thiểu cho chế độ B: keyword `accessor` cần **TypeScript 4.9** (version giới thiệu keyword); standard decorators + decorator metadata cần **TypeScript 5.2**, hoặc **Babel 7.23** + `@babel/plugin-proposal-decorators` với `"version": "2023-05"`.

**Babel không hỗ trợ TS experimental decorators** → build bằng Babel thì bắt buộc chế độ B, và decorator của Lit *chỉ* chạy với `"version": "2023-05"` (version cũ hơn không dùng được).

Không dùng decorator (JS thuần) thì khai báo `static properties = {name: {}}` + gán trong `constructor()`, không dính vấn đề class field.

---

## 🔍 4. Lint & IDE

| Tool | Làm gì |
| --- | --- |
| `eslint-plugin-lit` | ~25 rule cho template `html`: `no-invalid-html`, `binding-positions`, `no-duplicate-template-bindings`, `attribute-names`, `no-template-arrow`, `prefer-static-styles`, `lifecycle-super`… |
| `eslint-plugin-lit-a11y` | Rule a11y, *"most of the rules are ported from eslint-plugin-jsx-a11y"*, chạy trên template lit-html |
| `lit-analyzer` | **CLI** type-check + validate template |
| `ts-lit-plugin` | Cùng engine, chạy như TypeScript compiler plugin |
| `vscode-lit-plugin` (publisher `runem`) | Extension VS Code: syntax highlight, autocomplete, **type-check binding trong template** |

```bash
npm i -D eslint eslint-plugin-lit eslint-plugin-lit-a11y lit-analyzer && npx lit-analyzer src/**/*.ts
```

Giá trị lớn nhất là **type-check trong template**: bắt được `<my-el .count=${'5'}>` (string vào property `number`) — thứ `tsc` thường không thấy vì template chỉ là string.

---

## 🧪 5. Testing ⭐

### Vì sao phải test trong browser thật

Doc Lit: *"Lit components are designed to run in the browser so testing should be conducted in a browser environment."* Shim DOM trong Node *"won't test the code in the way your users experience it"* — jsdom / happy-dom không implement đầy đủ Custom Elements upgrade timing, Shadow DOM thật (`::part`, `::slotted`, slot assignment), `adoptedStyleSheets` (tức `static styles` của Lit), layout, focus, `ElementInternals`, event retargeting.

Doc Lit liệt kê nhiều runner (Jest, Karma, Mocha, Jasmine, WebdriverIO, Web Test Runner) nhưng nhấn mạnh **Web Test Runner** vì nó *"specifically designed to test modern web libraries like Lit"*.

```bash
npm i -D @web/test-runner @web/test-runner-playwright @open-wc/testing
```

```js
// web-test-runner.config.mjs
import {playwrightLauncher} from '@web/test-runner-playwright';

export default {
  files: 'test/**/*.test.js',
  nodeResolve: true,
  browsers: ['chromium', 'firefox', 'webkit'].map((product) => playwrightLauncher({product})),
  coverage: true,
  coverageConfig: {threshold: {statements: 80, branches: 70, functions: 80, lines: 80}},
};
```

(Config file nhận `.js` / `.cjs` / `.mjs`; doc khuyên `.mjs` để load ESM ổn định.)

### API `@open-wc/testing` cần nhớ

| API | Dùng để |
| --- | --- |
| `fixture(html\`…\`)` | Mount element vào DOM, **await** → đã render lần đầu, tự cleanup sau mỗi test |
| `html` / `unsafeStatic` | Tagged template |
| `elementUpdated(el)` | Chờ element render xong |
| `oneEvent(el, 'name')` | Promise resolve khi element bắn event đó |
| `nextFrame()` / `aTimeout(ms)` / `waitUntil(fn)` | Chờ animation / async |
| `defineCE` / `fixtureCleanup` | Define element tạm cho test / dọn thủ công |
| `expect` / `assert` | Chai, kèm sẵn 3 plugin ↓ |
| `@open-wc/semantic-dom-diff` | `expect(el).dom.to.equal('<div>…</div>')`, `.shadowDom`, `.lightDom`, `.dom.to.equalSnapshot()` |
| `@open-wc/chai-a11y-axe` | `expect(el).to.be.accessible()` |
| `chai-dom` | `expect(el).to.have.class('foo')`, `.to.have.text('42')` |

### ⚠️ Luôn `await el.updateComplete` trước khi assert

Lit render **bất đồng bộ** (batch trong microtask) → đổi property xong DOM **chưa** đổi ngay:

```js
el.count = 5;
expect(el.shadowRoot.querySelector('p')).to.have.text('5');  // ❌ FLAKY, vẫn là '0'

el.count = 5;
await el.updateComplete;                                     // ✅ hoặc elementUpdated(el)
expect(el.shadowRoot.querySelector('p')).to.have.text('5');
```

Lý do nó "đôi khi pass": nếu trước đó có `await` nào khác (fixture, oneEvent…) thì microtask queue đã kịp flush → test xanh nhầm. Lưu ý `updateComplete` resolve `false` nghĩa là đã có update mới xếp hàng (thường do `updated()` set property khác) → phải await thêm lần nữa.

### File test hoàn chỉnh

```js
// test/my-counter.test.js
import {fixture, html, expect, elementUpdated, oneEvent} from '@open-wc/testing';
import '../src/my-counter.js';

describe('<my-counter>', () => {
  it('click làm tăng count và cập nhật shadow DOM', async () => {
    const el = await fixture(html`<my-counter count="7"></my-counter>`);
    el.shadowRoot.querySelector('button.inc').click();

    await el.updateComplete;              // ⭐ bắt buộc
    expect(el.count).to.equal(8);
    expect(el.shadowRoot.querySelector('output')).to.have.text('8');
  });

  it('bắn event count-change với detail đúng', async () => {
    const el = await fixture(html`<my-counter></my-counter>`);
    setTimeout(() => el.shadowRoot.querySelector('button.inc').click());

    const ev = await oneEvent(el, 'count-change');
    expect(ev.detail.value).to.equal(1);
    expect(ev.bubbles).to.be.true;
    expect(ev.composed).to.be.true;       // phải composed mới thoát shadow boundary
  });

  it('slot hoạt động và không vi phạm a11y', async () => {
    const el = await fixture(html`<my-counter label="Số lượng">Điểm</my-counter>`);
    el.count = 42;
    await elementUpdated(el);
    const assigned = el.shadowRoot.querySelector('slot').assignedNodes({flatten: true});
    expect(assigned.map((n) => n.textContent.trim())).to.include('Điểm');
    await expect(el).to.be.accessible();
  });
});
```

### Visual regression, coverage, E2E

- **Visual regression**: `@web/test-runner-visual-regression` — plugin `visualRegressionPlugin` + hàm `visualDiff(element, name)`; element phải đang connected trong document của test. Package tự nhận là **experimental**. Thay thế: Playwright `toHaveScreenshot()`, Chromatic, Percy.
- **Coverage**: WTR có sẵn (`coverage: true` / `--coverage`), `coverageConfig.threshold` để CI fail khi tụt.
- **E2E / component test**: WebdriverIO — `npm init wdio@latest ./`, chọn *"Component or Unit Testing - in the browser"* và framework **Lit**. Doc WDIO ghi rõ Lit **không cần preset** vì web component không phải qua compiler.

---

## 📇 6. Custom Elements Manifest

Component của bạn là HTML tag → IDE và tool không biết gì về nó nếu không có metadata. **CEM** (`custom-elements.json`) là format chuẩn mô tả tag name, properties, attributes, events, slots, CSS parts, CSS custom properties, methods.

```bash
npm i -D @custom-elements-manifest/analyzer
npx cem analyze --litelement --globs "src/**/*.ts"
```

```js
// custom-elements-manifest.config.js
export default {globs: ['src/**/*.ts'], exclude: ['**/*.test.ts'], litelement: true, outdir: '.'};
```

Analyzer có plugin cho **LitElement, FAST, Stencil, Catalyst** (flag `--litelement`, `--fast`, `--stencil`, `--catalyst`). JSDoc tag được đọc: `@tag` / `@tagname`, `@attr` / `@attribute`, `@prop` / `@property`, `@fires` / `@event`, `@slot`, `@csspart` / `@part`, `@cssprop` / `@cssproperty`, `@summary`, `@internal` / `@ignore` — viết đủ thì manifest mới có giá trị:

```ts
/**
 * Counter đơn giản.
 * @tag my-counter
 * @fires count-change - Bắn khi count thay đổi
 * @slot - Nội dung label
 * @csspart button - Nút tăng
 * @cssprop --my-counter-color - Màu chữ
 */
```

Khai báo trong `package.json` để tool tự tìm — đúng tên field là **`customElements`**: `{"customElements": "custom-elements.json"}`. Spec giải thích lý do: để tool tìm được manifest **mà không phải tải tarball của package**; chính field này được analyzer đọc khi bật flag `--dependencies` để gom manifest của dependency.

Ai tiêu thụ file này: IDE (autocomplete tag & attribute cho consumer), docs tool (`api-viewer-element`, `@wc-toolkit/*`), Storybook (mục 9), generator wrapper framework.

> 💡 CEM là thứ rẻ nhất mà nâng DX cho người dùng library nhiều nhất. Chạy nó trong `prepublishOnly`.

---

## 📦 7. Publishing lên npm — checklist

### ✅ Publish ESM hiện đại, **không bundle**

Doc Lit: *"We recommend publishing JavaScript modules in standard ES2021 syntax."* TypeScript, decorator, class field phải compile xuống ES2021 trước khi publish. Và mục **"Don't bundle, minify, or optimize modules"**: *"Bundling a reusable component before publishing to npm can also introduce multiple versions of Lit (and other packages) into a user's application since npm can't deduplicate the packages."* Tối ưu là **application concern**.

### ✅ `package.json`

Doc Lit **chỉ** quy định 4 field: `"type": "module"`, `"main"`, `"module"`, và `"types"` (cho TS). Phần còn lại dưới đây **không nằm trong doc Lit** mà là convention npm/bundler, nhưng gần như bắt buộc với component library:

```json
{
  "name": "@acme/ui",
  "type": "module",
  "main": "./index.js",
  "module": "./index.js",
  "types": "./index.d.ts",
  "exports": {
    ".": {"types": "./index.d.ts", "default": "./index.js"},
    "./button.js": {"types": "./button.d.ts", "default": "./button.js"},
    "./package.json": "./package.json"
  },
  "sideEffects": ["./*.js"],
  "customElements": "custom-elements.json",
  "files": ["*.js", "*.d.ts", "*.js.map", "*.d.ts.map", "custom-elements.json"],
  "dependencies": {"lit": "^3.0.0"}
}
```

- `"exports"` — khoá subpath, export từng file component để consumer import lẻ (`@acme/ui/button.js`) và tree-shake được. Nhớ export cả `./package.json`.
- `"sideEffects"` — module gọi `customElements.define()` **có side effect**. Đặt `"sideEffects": false` sẽ bị bundler tree-shake mất phần define → tag không tồn tại. Liệt kê file có define, hoặc để `true`.
- Doc Lit có mục **"Include file extensions in import specifiers"**: luôn viết `import './button.js'`, không viết `'./button'`.

### ✅ Element tự define, và export cả class

Doc Lit — **"Self-define elements"**: *"The module that declares the web component class should always include a call to `customElements.define()` (or the `@customElement` decorator)."* Và **"Export element classes"** để cho phép subclass.

```ts
// button.ts
export class AcmeButton extends LitElement { … }
customElements.define('acme-button', AcmeButton);

declare global {
  interface HTMLElementTagNameMap {
    'acme-button': AcmeButton;   // để querySelector trả đúng type
  }
}
```

### ⚖️ `lit`: dependency hay peerDependency?

⚠️ **Doc publishing của Lit không nói gì về chuyện này** — nó chỉ nêu yêu cầu thực sự: **đừng bundle `lit` vào package**, để npm dedupe được. Chọn `dependencies` hay `peerDependencies` là quyết định của bạn, không phải khuyến nghị chính thức của Lit. Điểm chắc chắn: dùng **range rộng** (`"lit": "^3.0.0"`) thì npm/pnpm dedupe được; **pin cứng** (`"lit": "3.1.2"`) chặn dedupe và tạo bản trùng.

### ⚠️ Vấn đề 2 bản Lit / define trùng tag

1. **Nhiều bản Lit trên một trang** — development build log warning khi phát hiện nhiều version, *hoặc nhiều bản copy của cùng một version*, của package lõi Lit. Hệ quả: tăng size, và module-level state của mỗi bản tách nhau (dev warning registry, brand check của directive) → directive lấy từ bản này dùng trong template của bản kia có thể lỗi. Chẩn đoán: `npm ls lit`, `npm dedupe`, hoặc `resolutions` / `overrides`.
2. **Define trùng tag** — hai bản cùng package cùng gọi `define` cho `acme-button` → `NotSupportedError`, vì registry custom element là **global, một tag một lần duy nhất**. Chống đỡ tạm bằng `if (!customElements.get('acme-button')) { … }` — band-aid: tránh crash nhưng bản "thắng" có thể là bản cũ. Cách đúng vẫn là dedupe ở app. Hướng tương lai: **Scoped Custom Element Registry** — `@lit-labs/scoped-registry-mixin` (⚠️ **Labs**), phụ thuộc spec chưa ship rộng.

### 🏷 Prefix tag name

Tag name là **namespace toàn cục, không có scoping** → luôn prefix theo thương hiệu/package: `acme-button`, `sl-button` (Shoelace), `md-filled-button` (Material Web) — không phải `my-button`, `ui-card`. Quy tắc: ≥ 2 từ, có dấu `-`. Library nhắm micro-frontend nên cho phép người dùng đổi prefix (build-time rename hoặc scoped registry).

---

## 🚀 8. Production

### Bundle & minify

Theo doc Lit — Building for production:

- Bundle bằng Rollup / webpack để giảm số network request; resolve bare specifier bằng `@rollup/plugin-node-resolve`.
- Minify bằng **Terser** vì *"it supports modern JavaScript"* — config mẫu của doc: `terser({ecma: 2021, module: true, warnings: true})`.
- Template Lit nằm trong JS template literal nên HTML minifier thường bỏ qua → dùng `rollup-plugin-minify-html-literals` (Rollup) hoặc `minify-html-literals-loader` (webpack). Hash tên file tĩnh để invalidate cache; bật gzip/brotli ở serve-time.

### `@lit-labs/compiler` ⚠️ **Labs**

TypeScript transformer chạy lúc build, biên dịch sẵn template `html` để bỏ qua **lit-html prepare render phase** lúc runtime.

```js
// rollup.config.js
import typescript from '@rollup/plugin-typescript';
import {compileLitTemplates} from '@lit-labs/compiler';

export default {
  plugins: [typescript({transformers: {before: [compileLitTemplates()]}})],
};
```

- **Lợi** (blog Lit 3.0): *"46% faster first render, and a 21% faster update"* trên benchmark nhiều template. README package ghi dè dặt hơn: *"sometimes up to 45% faster for template heavy pages"*.
- **Giá**: *"the output file is about 5% larger (gzipped)"*.
- ⚠️ Labs: *"published in order to get feedback on the design and may receive breaking changes or stop being supported."* Dùng được ở bất cứ đâu nhận TypeScript transformer, nhưng README chỉ có ví dụ Rollup + `@rollup/plugin-typescript`.

👉 Chỉ bật khi app **thật sự nhiều template** và đã đo thấy render là bottleneck.

### Tree-shaking & lazy define

Đừng bắt user import mọi thứ từ một barrel `index.js` — user sẽ kéo cả library. Cho phép import theo file. Component nặng / dưới màn hình thì lazy define, kết hợp `IntersectionObserver` (load khi scroll tới) hoặc `requestIdleCallback`:

```js
if (!customElements.get('acme-chart')) {
  await import('@acme/ui/chart.js');
}
await customElements.whenDefined('acme-chart');  // chờ định nghĩa xong rồi mới dùng API
```

### Đo size

Dùng `npx source-map-explorer dist/*.js` hoặc plugin `rollup-plugin-visualizer` (treemap). Kích thước tham chiếu: lit.dev quảng cáo Lit *"around 5 KB (minified and compressed)"* — cost cố định một lần cho cả app, thêm component thứ 50 gần như không cộng thêm runtime.

---

## 📖 9. Storybook (nhắc ngắn)

Framework package **`@storybook/web-components-vite`**, khởi tạo bằng `npm create storybook@latest`. Story viết bằng `html` của lit. Để có `argTypes` / Controls tự động, nạp CEM trong `.storybook/preview.js`:

```js
import {setCustomElementsManifest} from '@storybook/web-components';
import customElements from '../custom-elements.json';

setCustomElementsManifest(customElements);
```

Dùng khi cần catalog component + docs cho designer. Chỉ cần API docs thuần thì `api-viewer-element` + CEM nhẹ hơn nhiều.

---

## ⚠️ Bẫy thường gặp

| Bẫy | Hậu quả | Cách tránh |
| --- | --- | --- |
| `useDefineForClassFields: true` cùng experimental decorators | Property đổi nhưng **không re-render**, im lặng | Set `false`, hoặc chuyển sang standard decorators + `accessor` |
| `exportConditions` đặt ở top level config WDS | Dev mode Lit không bật, mất warning | Đặt trong `nodeResolve: { exportConditions: [...] }` |
| `moduleResolution: "node"` | Import `lit/directives/…` báo không tìm thấy type | Dùng `bundler` / `node16` |
| Assert ngay sau khi set property | Test flaky, xanh ở local đỏ ở CI | `await el.updateComplete` |
| Test bằng jsdom | Shadow DOM, `adoptedStyleSheets`, focus sai lệch | `@web/test-runner` + Playwright launcher |
| `"sideEffects": false` trong package có `customElements.define` | Bundler tree-shake mất define → tag không tồn tại ở production | Liệt kê file hoặc để `true` |
| Bundle dependency trước khi publish, hoặc pin cứng `"lit": "3.1.2"` | Chặn dedupe → nhiều bản Lit trong app cuối | Publish ESM raw, dùng range `^3.0.0` |
| Quên `"exports"` map | User không import được subpath | Khai báo tường minh |
| Import specifier thiếu đuôi `.js` | Không chạy trên browser / import maps | `import './button.js'` |
| Tag name không prefix | Đụng độ package khác, `NotSupportedError` | `acme-*` |
| Quên publish `.d.ts` / CEM | Consumer mất autocomplete hoàn toàn | `declaration: true` + `cem analyze` trong `prepublishOnly` |
| Import polyfill trong source library | Ép mọi consumer gánh polyfill | Chỉ để trong `devDependencies`, ghi vào README |
| Bật `@lit-labs/compiler` mà không đo | +5% size mà không thấy lợi | Đo trước, và nhớ nó là **Labs** |

---

## 📚 Nguồn

**Lit** — [Requirements](https://lit.dev/docs/tools/requirements/) · [Development](https://lit.dev/docs/tools/development/) · [Testing](https://lit.dev/docs/tools/testing/) · [Publishing](https://lit.dev/docs/tools/publishing/) · [Building for production](https://lit.dev/docs/tools/production/) · [Starter kits](https://lit.dev/docs/tools/starter-kits/) · [Decorators](https://lit.dev/docs/components/decorators/) · [Lit 2 — legacy browsers](https://lit.dev/docs/v2/tools/requirements/) · [Blog Lit 3.0 (số liệu compiler)](https://lit.dev/blog/2023-10-10-lit-3.0/) · [`@lit-labs/compiler` README](https://github.com/lit/lit/tree/main/packages/labs/compiler)

**Test** — [Open WC testing package](https://open-wc.org/docs/testing/testing-package/) · [Web Test Runner overview](https://modern-web.dev/docs/test-runner/overview/) · [WTR CLI & config](https://modern-web.dev/docs/test-runner/cli-and-configuration/) · [WTR Playwright launcher](https://modern-web.dev/docs/test-runner/browser-launchers/playwright/) · [WebdriverIO + Lit](https://webdriver.io/docs/component-testing/lit/)

**Metadata & lint** — [CEM spec (field `customElements`)](https://github.com/webcomponents/custom-elements-manifest) · [CEM Analyzer](https://custom-elements-manifest.open-wc.org/analyzer/getting-started/) · [`eslint-plugin-lit`](https://github.com/43081j/eslint-plugin-lit) · [`eslint-plugin-lit-a11y`](https://open-wc.org/docs/linting/eslint-plugin-lit-a11y/overview/) · [`lit-analyzer` / `ts-lit-plugin` / `vscode-lit-plugin`](https://github.com/runem/lit-analyzer) · [Storybook Web Components + Vite](https://storybook.js.org/docs/get-started/frameworks/web-components-vite)

---

⏭️ Tiếp theo: [[06 - Chuyen sau - SSR, Localization, React, A11y]]
