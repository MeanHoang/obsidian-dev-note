# 01 — Web Components là gì? Lịch sử & Tổng quan

> **TL;DR:** Web Components là **bộ tiêu chuẩn có sẵn trong browser** cho phép tự tạo tag HTML riêng, có style và DOM đóng gói độc lập. Không cần cài gì, không cần build. Nó không cạnh tranh với React/Vue ở tầng app — nó là tầng **component nguyên thủy** mà mọi framework đều chạy được.

Series: [[00 - Roadmap Web Components - Lit]]

---

## 🎯 Web Components là gì

**Định nghĩa 1 câu:** Web Components là một nhóm API chuẩn của web platform cho phép tạo **custom element** tái sử dụng, với **DOM và CSS được đóng gói (encapsulated)**, chạy native trong browser mà không cần thư viện.

Điểm mấu chốt cần khắc vào đầu:

```
React / Vue / Svelte  →  THƯ VIỆN. Bạn npm install. Có version. Có thể chết.
Web Components        →  TIÊU CHUẨN. Browser đã có sẵn. Như <div> hay fetch().
```

Nó nằm cùng hạng với `fetch()`, `localStorage`, `<video>` — tức là một phần của **platform**, không phải một lựa chọn công nghệ bạn phải cài.

```html
<!-- Không import gì. Mở file HTML này bằng browser là chạy. -->
<script type="module">
  class HelloBadge extends HTMLElement {
    connectedCallback() {
      const root = this.attachShadow({ mode: 'open' });
      root.innerHTML = `
        <style>span { background: #222; color: #fff; padding: 2px 8px; border-radius: 4px }</style>
        <span><slot>hello</slot></span>
      `;
    }
  }
  customElements.define('hello-badge', HelloBadge);
</script>

<hello-badge>Web Components</hello-badge>
```

Đoạn code trên **không có bundler, không có dependency**. Đó là toàn bộ luận điểm.

---

## 📜 Ai xây dựng — lịch sử đầy đủ

### Giai đoạn 1: Ý tưởng (2011)

Khái niệm được **Alex Russell** (kỹ sư Chrome team, Google) trình bày công khai tại **Fronteers Conference 2011** (Pathé Tuschinski, Amsterdam, 4–7/10/2011), trong talk *"Web Components and Model Driven Views"*.

Luận điểm gốc của ông: HTML có sẵn những element cực phức tạp như `<video>`, `<select>` — bên trong chúng có cả một cây DOM ẩn với style riêng — nhưng developer **không có cách nào tự tạo ra thứ tương tự**. Toàn bộ web platform bị "đóng". Web Components sinh ra để **mở cái hộp đó** cho developer: đưa Shadow DOM (thứ browser vẫn dùng nội bộ) ra thành API public.

> Ý tưởng nền: **"explain the platform"** — giải thích các HTML element có sẵn bằng những cơ chế cấp thấp hơn, rồi mở chính cơ chế đó cho developer. Tư tưởng này về sau thành *Extensible Web Manifesto*.

### Giai đoạn 2: Các thư viện tiên phong (2013–2015)

Spec chưa xong nhưng ai cũng muốn dùng trước → sinh ra một loạt polyfill/library:

| Dự án | Của ai | Vai trò |
|---|---|---|
| **Polymer** | Google (2013) | Nổi nhất. Vừa là polyfill vừa là framework trên Web Components |
| **X-Tag** | Mozilla (Daniel Buchner), sau chuyển sang Microsoft | Wrapper gọn nhẹ cho custom element |
| **Brick** | Mozilla (2013) | Bộ UI component xây trên X-Tag |
| **Bosonic** | Cộng đồng | Bộ tool hỗ trợ cả browser cũ (IE9) |

Tất cả đều dùng chung bộ `webcomponents.js` polyfill.

### Giai đoạn 3: Khủng hoảng v0 → v1 ⭐

Đây là phần quan trọng nhất và cũng hay bị kể sai.

**Spec v0** (chỉ Chrome ship) gồm 4 mảnh:
- `document.registerElement()` — Custom Elements v0
- Shadow DOM v0 — dùng `<content select="...">` để phân phối nội dung
- **HTML Imports** — `<link rel="import" href="component.html">`
- `<template>`

**Vấn đề:** Apple (WebKit) và Mozilla **không chấp nhận** thiết kế này.

- WebKit chê Shadow DOM v0 quá phức tạp, đặc biệt cơ chế `<content select>` cho phép selector CSS tùy ý → khó tối ưu hiệu năng. Họ đề xuất mô hình **slot-based** đơn giản hơn (`<slot name="...">`).
- Mozilla đứng về phía WebKit ở phần lớn các điểm tranh cãi — quan điểm chung là thà ship v1 sớm còn hơn đưa "warts" vào platform rồi phải sống chung vĩnh viễn.
- **HTML Imports không được Apple lẫn Mozilla implement.** Mozilla nói thẳng (06/2015): *"Mozilla is not currently intending to implementing HTML Imports"* — muốn chờ xem **ES6 modules** đi tới đâu trước khi thêm cơ chế import thứ hai, và cho rằng Imports không mở ra thứ gì chưa làm được. Không ai muốn web có 2 module system.

Kết quả: spec bị **làm lại từ đầu thành v1** — `customElements.define()`, Shadow DOM slot-based. Lần này cả 3 engine đồng thuận. HTML Imports bị bỏ hẳn, **ES Modules thay thế vai trò của nó**.

Chrome giữ v0 thêm vài năm cho hệ sinh thái Polymer 1/2 kịp migrate: cảnh báo deprecate ở **Chrome 70 (16/10/2018)**, dự kiến gỡ ở Chrome 73 rồi hoãn, và **gỡ hẳn ở Chrome 80 (02/2020)**.

> 💡 Bài học: từ talk đầu tiên (10/2011) đến khi cả 4 browser lớn cùng support (Edge 79, 15/01/2020) là **hơn 8 năm**, phần lớn thời gian đó là đàm phán giữa các vendor. Đó cũng là lý do nó bị mang tiếng "hype rồi xịt" giai đoạn 2014–2018 — sự thật là nó chỉ chậm, không xịt.

### Giai đoạn 4: Spec về đâu?

Ban đầu spec do **W3C** giữ. Ngày **28/05/2019** W3C và WHATWG ký Memorandum of Understanding: HTML và DOM chỉ còn **một** bản chuẩn duy nhất là WHATWG Living Standard. Hiện tại:

| Phần | Spec chính thức nằm ở |
|---|---|
| Custom Elements, `<template>`, Declarative Shadow DOM | **WHATWG HTML Standard** (`html.spec.whatwg.org`) |
| Shadow DOM, `<slot>`, event retargeting, `attachShadow()` | **WHATWG DOM Standard** (`dom.spec.whatwg.org`) |
| `:host`, `:host()`, `:host-context()`, `::slotted()`, `::part()` | **W3C CSS WG** — CSS Shadow Module Level 1 |

👉 Hai lưu ý khi tra spec: (1) **đừng đọc mấy bản W3C cũ trên `w3c.github.io`**, nhiều bản đã đóng băng ở v0/v1 cũ — đọc WHATWG; (2) *CSS Scoping Module Level 1* và *CSS Shadow Parts Module Level 1* đã được gộp và đổi tên thành **CSS Shadow Module Level 1** (01/2026), nên link cũ chỉ còn là redirect. Pseudo-element `::theme()` từng có trong draft Shadow Parts nhưng **đã bị bỏ khỏi spec** — đừng dùng.

### 📅 Timeline

| Thời điểm | Sự kiện |
|---|---|
| 10/2011 | Alex Russell giới thiệu Web Components tại Fronteers 2011 |
| 2013 | Google ra **Polymer**; Mozilla ra **X-Tag** + **Brick** |
| 2014–2016 | Spec **v0** chỉ có Chrome ship. Apple/Mozilla phản đối thiết kế |
| ~2015–2016 | Spec **v1** ra đời: `customElements.define()` + slot-based Shadow DOM |
| 31/08/2016 | **Chrome 53** ship Shadow DOM v1 |
| 20/09/2016 | **Safari 10** ship Shadow DOM v1 |
| 12/10/2016 | **Chrome 54** ship Custom Elements v1 |
| 27/03/2017 | **Safari 10.1** ship Custom Elements v1 |
| 16/10/2018 | **Chrome 70** deprecate Shadow DOM v0, Custom Elements v0, HTML Imports |
| 23/10/2018 | **Firefox 63** bật Custom Elements + Shadow DOM mặc định |
| 28/05/2019 | W3C ↔ WHATWG ký MoU → HTML/DOM về **WHATWG Living Standard** |
| 15/01/2020 | **Edge 79** (nền Chromium) → **cả 4 browser lớn đều support native** ✅ |
| 02/2020 | **Chrome 80** gỡ hẳn Shadow DOM v0, Custom Elements v0, HTML Imports |
| 21/09/2021 | **Lit 2.0** stable — team Polymer chuyển hướng sang thư viện mỏng hơn |
| 15/07/2022 | Custom Elements + Shadow DOM đạt **Baseline Widely available** |
| 07/03/2023 | **Chrome 111** ship `shadowrootmode` (Declarative Shadow DOM chuẩn) |
| 27/03/2023 | **Safari 16.4** ship Declarative Shadow DOM |
| 20/02/2024 | **Firefox 123** ship DSD → DSD đạt **Baseline Newly available** |
| 05/12/2024 | **React 19** hỗ trợ đầy đủ custom element (đạt 100% custom-elements-everywhere) |
| 03/2026 | **Chrome/Edge 146** bật scoped `CustomElementRegistry` mặc định (Safari 26 đã có, Firefox chưa) |
| 20/08/2026 | Declarative Shadow DOM đạt **Baseline Widely available** |

---

## 🧩 Các mảnh ghép

Chuẩn "Web Components" thực chất là **3 spec chính** (v0 có 4, mảnh thứ 4 đã chết):

### 1. Custom Elements → [[02 - Custom Elements]]
API để đăng ký tag riêng: `customElements.define('my-card', MyCard)`. Tên **bắt buộc có dấu gạch ngang** để không đụng tag HTML tương lai. Cung cấp lifecycle: `connectedCallback`, `disconnectedCallback`, `attributeChangedCallback`, `adoptedCallback`.

### 2. Shadow DOM → [[03 - Shadow DOM]]
Cây DOM riêng gắn vào element qua `attachShadow()`. CSS bên trong **không rò ra ngoài**, CSS ngoài **không lọt vào trong**. `id` bên trong không đụng `id` ngoài. Đây là encapsulation thật ở tầng browser, không phải quy ước đặt tên.

### 3. HTML Template + Slot → [[04 - Template va Slot]]
`<template>` chứa markup không render, dùng làm khuôn để clone. `<slot>` là chỗ trống trong shadow tree để nhận nội dung người dùng truyền từ ngoài vào (light DOM).

### 4. ~~HTML Imports~~ → **ES Modules**
HTML Imports đã chết (xem lịch sử ở trên). Cách nạp component hiện tại là ES Modules chuẩn:

```js
import './components/my-card.js'; // file này tự gọi customElements.define()
```

---

## 🤔 Vì sao Web Components tồn tại

Ba vấn đề thực tế nó giải quyết:

**1. Chia sẻ component giữa các framework.** Công ty có team dùng React, team dùng Vue, team dùng Angular, còn Shopify theme thì thuần Liquid + HTML. Muốn 1 cái button dùng chung ở cả 4 nơi → viết 4 lần, sửa 4 lần. Web Components là mẫu số chung duy nhất: `<my-button>` chạy được ở mọi chỗ có DOM.

**2. CSS đè nhau ở app lớn.** BEM, CSS Modules, CSS-in-JS đều là **quy ước hoặc trick build-time** — vẫn cùng một global stylesheet, vẫn có thể bị `!important` từ third-party script phá. Shadow DOM chặn ở tầng browser, không thể lách.

**3. Framework fatigue — component sống lâu hơn framework.** jQuery UI, AngularJS 1, Polymer 1, Enzyme… component viết bằng chúng giờ đều là nợ kỹ thuật. Component viết bằng chuẩn browser thì browser **cam kết không phá backward compatibility** — code custom element 2018 vẫn chạy nguyên năm 2026.

---

## 💪 Điểm mạnh

| Điểm mạnh | Vì sao |
|---|---|
| **Framework-agnostic** | Chỉ là DOM element. React, Vue, Angular, Svelte, hay HTML thuần đều render được. Không cần wrapper riêng cho từng stack |
| **Không runtime overhead** | Không phải tải framework runtime, không virtual DOM, không reconciliation. Browser trực tiếp xử lý. Chi phí gần bằng viết DOM tay |
| **Encapsulation thật** | Shadow DOM là ranh giới cứng ở tầng engine — không phải hash class name (CSS Modules) hay convention (BEM). Third-party CSS không thể đè vào, kể cả cố tình |
| **Tuổi thọ dài** | Browser không được phép phá backward compat. Không có "migration guide v3 → v4" mỗi 18 tháng |
| **Lazy-load & progressive enhancement tốt** | HTML render trước, `import()` file định nghĩa element sau — element tự "nâng cấp" (upgrade) khi được define. Trước đó nó vẫn là DOM node hợp lệ, không vỡ layout |
| **Chuẩn cho design system đa team** | Đây là use case sát nhất. Một team platform build 1 bộ component, mọi team consume bất kể stack. Đúng lý do SAP, Adobe, Salesforce chọn nó |
| **DevTools & a11y tree native** | Element xuất hiện trong DOM inspector như element thật, không bị ẩn sau lớp abstraction của framework |

---

## ⚠️ Điểm yếu — khi nào KHÔNG nên dùng

Trung thực để không mất thời gian sai chỗ:

- **Verbose khi viết thuần.** Không có reactive state, không có template engine → tự `innerHTML`, tự diff, tự bind. Viết 3 component thì vui, viết 30 thì khổ. → Đây chính là lý do **[[Lit/Introduction|Lit]]** tồn tại.
- **SSR / SEO khó hơn.** Shadow DOM vốn chỉ tạo được bằng JS → server render ra HTML rỗng. **Declarative Shadow DOM** (`<template shadowrootmode="open">`) giải quyết được phần lớn — Baseline *Newly available* 20/02/2024, *Widely available* 20/08/2026 — nhưng tooling SSR vẫn non hơn Next.js/Nuxt rất nhiều.
- **A11y xuyên shadow boundary rất khó.** ARIA tham chiếu bằng `id` (`aria-labelledby`, `aria-controls`, `for`) **không xuyên qua được shadow boundary**. Đây là điểm đau kinh điển. Giải pháp mới (`ElementInternals`, ARIA reflection, cross-root ARIA) vẫn đang hoàn thiện.
- **Form integration cần thêm việc.** Custom element mặc định **không** tự submit trong `<form>`. Phải dùng `static formAssociated = true` + `ElementInternals` (`attachInternals()`) để nối vào form, validation, `FormData`.
- **React < 19 truyền props lằng nhằng.** React cũ coi mọi prop lạ là **attribute** (chỉ string) → truyền object/array vào custom element phải dùng `ref` gán property tay; custom event phải `addEventListener` tay. Tra bảng tương thích ở **custom-elements-everywhere.com**. **React 19 (12/2024) đã sửa và đạt 100%** — nếu team đang ở React 19+ thì vấn đề này coi như xong.
- **Không phải giải pháp cho app logic.** Web Components **chỉ là lớp UI/component**. Không có router, không có state management, không có data fetching. Đừng kỳ vọng nó thay React ở tầng app.

> 👉 Quy tắc thực dụng: **Web Components rất mạnh cho design system / component library / widget nhúng. Yếu cho việc build nguyên một SPA phức tạp.**

---

## 🏭 Ai đang dùng thật ngoài production

| Nơi dùng | Chi tiết |
|---|---|
| **YouTube** | Web app xây trên Polymer — tag `ytd-*` nhìn thấy thẳng trong DOM inspector |
| **GitHub** | Custom element thuần, không framework. Bộ `github/github-elements` public (17 element): `<clipboard-copy>`, `<details-dialog>`, `<relative-time>`, `<tab-container>`… |
| **SAP** | **UI5 Web Components** — bộ enterprise component, viết bằng Lit, chạy được với React/Angular/Vue |
| **Adobe** | **Spectrum Web Components** — hiện thực design system Spectrum, base class là `LitElement` |
| **Salesforce** | **Lightning Web Components (LWC)** — framework nội bộ xây thẳng trên chuẩn custom element |
| **IBM** | **Carbon Web Components** — design system Carbon viết bằng Lit |
| **Google** | **Material Web** (`material-web`) — Material Design 3 viết bằng Lit; repo hiện ở **maintenance mode**, chờ maintainer mới |
| **Shoelace** | Component library open-source viết bằng Lit |

Điểm chung: **toàn là design system dùng chung nhiều team / nhiều stack.** Rất ít ai build SPA thuần bằng Web Components — và đó là tín hiệu đúng về chỗ đứng của nó.

---

## 📊 So sánh Web Components vs React vs Vue

| Tiêu chí | Web Components | React | Vue |
|---|---|---|---|
| **Bản chất** | Tiêu chuẩn browser | Thư viện | Framework |
| **Style encapsulation** | Shadow DOM — thật, cấp engine | Không có sẵn (CSS Modules / CSS-in-JS) | `scoped` — attribute hash, build-time |
| **Runtime size** | 0 KB (native) | ~45 KB gzip (React + ReactDOM) | ~35 KB gzip |
| **State management** | Không có. Tự lo hoặc dùng Lit/Signals | `useState` / `useReducer` + lib ngoài | `ref` / `reactive` + Pinia |
| **Ecosystem** | Nhỏ nhưng chất, thiên về design system | Cực lớn | Lớn |
| **SSR** | Cần Declarative Shadow DOM, tooling còn non | Rất trưởng thành (Next.js, RSC) | Trưởng thành (Nuxt) |
| **Learning curve** | API ít nhưng nhiều bẫy (timing, boundary, a11y) | Trung bình (hooks, rules) | Dễ vào nhất |
| **Interop** | ⭐ Dùng được ở mọi framework | Chỉ trong React | Chỉ trong Vue |
| **Tuổi thọ** | ⭐ Rất dài (chuẩn) | Phụ thuộc roadmap Meta | Phụ thuộc roadmap core team |

---

## 🔥 Web Components vs Lit

Câu hỏi sai: *"Nên học Web Components hay Lit?"*

```
Lit KHÔNG thay thế Web Components.
Lit = lớp tiện ích ~5KB ngồi TRÊN Web Components.

LitElement extends HTMLElement   ← vẫn là custom element chuẩn 100%
```

Component viết bằng Lit khi build ra vẫn là một custom element bình thường — người dùng không cần biết bạn dùng Lit. Lit chỉ thêm 3 thứ mà chuẩn không có: **reactive properties**, **template engine hiệu quả** (`html` tagged template + chỉ update phần thay đổi), và **styling tiện** (`static styles` + `css`).

→ Chi tiết: [[Lit/Introduction]]

---

## ⚠️ Ngộ nhận thường gặp

| Ngộ nhận | Sự thật |
|---|---|
| "Web Components là đối thủ của React" | Sai tầng. WC là tầng component nguyên thủy; React là tầng app. Chúng **dùng chung được**, không loại trừ nhau |
| "Web Components chết rồi / hype rồi xịt" | Nhầm với **v0 và Polymer 1** — cái chết là chúng. Chuẩn v1 sống khỏe, hiện diện trong YouTube, GitHub, SAP, Adobe, Salesforce |
| "Phải dùng Polymer / Lit mới xài được" | Không. Vanilla chạy tốt. Lit chỉ để đỡ verbose |
| "Shadow DOM = Virtual DOM" | Hoàn toàn khác nhau. Shadow DOM là **cây DOM thật, ẩn và cách ly** của browser. Virtual DOM là **cấu trúc JS trong bộ nhớ** để diff của React |
| "Dùng Web Components là mất SEO" | Nội dung ở **light DOM** (children truyền vào slot) crawler đọc bình thường. Chỉ nội dung sinh bằng JS trong shadow root mới rủi ro → dùng Declarative Shadow DOM / SSR |
| "Cần polyfill" | Từ 15/01/2020 (Edge 79) là hết cần; Baseline *Widely available* từ 15/07/2022 |
| "Tên tag nào cũng được" | Sai. **Bắt buộc có ít nhất 1 dấu gạch ngang**, chữ thường, bắt đầu bằng chữ cái ASCII. `<mybutton>` sẽ không đăng ký được |
| "`<slot>` là nội dung được copy vào shadow DOM" | Không copy. Node vẫn nằm ở light DOM và thuộc document chính — chỉ **được render tại vị trí slot**. Nên CSS ngoài vẫn style được nó |

---

## 📚 Nguồn

- [MDN — Web Components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components)
- [web.dev — Custom Elements v1: reusable web components](https://web.dev/articles/custom-elements-v1)
- [WHATWG HTML Standard — Custom elements](https://html.spec.whatwg.org/multipage/custom-elements.html)
- [WHATWG DOM Standard](https://dom.spec.whatwg.org/)
- [Fronteers — lịch sử conference (2011: Pathé Tuschinski, Amsterdam)](https://www.fronteers.nl/en/organisation/history/conference/)
- [Chromium blink-dev — Intent to Deprecate and Remove: Shadow DOM V0, Custom Elements V0, HTML Imports](https://groups.google.com/a/chromium.org/g/blink-dev/c/h-JwMiPUnuU)
- [Chrome for Developers — Deprecations and removals in Chrome 70](https://developer.chrome.com/blog/chrome-70-deps-rems)
- [Chrome for Developers — Deprecations and removals in Chrome 80 (gỡ v0)](https://developer.chrome.com/blog/chrome-80-deps-rems)
- [Polymer Blog — Web Components v0 deprecations](https://www.polymer-project.org/blog/2018-10-02-webcomponents-v0-deprecations)
- [Polymer Blog — Native Web Components come to Microsoft Edge (Edge 79)](https://www.polymer-project.org/blog/2020-01-15-edge-79-release)
- [W3C News — W3C and WHATWG sign MoU (28/05/2019)](https://www.w3.org/blog/news/archives/7753)
- [Mozilla Hacks — The state of Web Components (2015): vì sao Mozilla từ chối HTML Imports](https://hacks.mozilla.org/2015/06/the-state-of-web-components/)
- [CSS Shadow Module Level 1 (gộp CSS Scoping 1 + CSS Shadow Parts 1)](https://drafts.csswg.org/css-shadow-1/)
- [web.dev — Declarative Shadow DOM](https://web.dev/articles/declarative-shadow-dom)
- [Web features explorer — declarative-shadow-dom (Baseline + version)](https://web-platform-dx.github.io/web-features-explorer/features/declarative-shadow-dom/)
- [Web features explorer — autonomous-custom-elements (Baseline + version)](https://web-platform-dx.github.io/web-features-explorer/features/autonomous-custom-elements/)
- [Chrome for Developers — Scoped custom element registries](https://developer.chrome.com/blog/scoped-registries)
- [React 19 release notes — Support for Custom Elements](https://react.dev/blog/2024/12/05/react-19)
- [Custom Elements Everywhere](https://custom-elements-everywhere.com/)
- [github/github-elements](https://github.com/github/github-elements)
- [UI5 Web Components](https://github.com/UI5/webcomponents)
- [Lit blog — Announcing Lit 2 stable (21/09/2021)](https://lit.dev/blog/2021-09-21-announcing-lit-2/)

---

**Note tiếp theo:** [[02 - Custom Elements]]
