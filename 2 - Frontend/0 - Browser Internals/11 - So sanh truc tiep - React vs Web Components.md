# 11 — So sánh trực tiếp: React vs Web Components

> **TL;DR:** Khác nhau ở **ai sở hữu khái niệm "component"**. Với React, component là khái niệm **của thư viện** — browser không hề biết `<MyButton>` tồn tại; JSX bị build thành object mô tả, React so sánh object cũ/mới rồi tự gọi DOM API. Với Web Components, component là khái niệm **của browser** — `<my-button>` là một node thật trong DOM, browser tự khởi tạo class của bạn và class đó tự sửa DOM của chính nó, không diff gì cả. Nhưng **cả hai đều đổ vào đúng một dây chuyền render** ở [[01 - Tu URL den Pixel - Vong doi mot trang web]] — khác nhau là ở *ai ra lệnh*, không phải ở *pipeline*. Note này không chọn phe: React thắng ở hệ sinh thái và DX, Web Components thắng ở tuổi thọ và encapsulation, và cách dùng phổ biến nhất ngoài đời là **dùng cả hai**.

Series: [[00 - Roadmap - Tu HTML den Pixel]]
Anh em: [[07 - React - Truy vet mot lan setState tu click den pixel]] · [[09 - Web Components - Truy vet mot custom element tu HTML den pixel]] · [[10 - Shadow DOM - Cay trong cay va ranh gioi that su]]

---

## 🎯 Note này trả lời đúng một câu hỏi

> *"Biết là JSX là React, thì cách hoạt động khác gì Web Components?"*

Sau 10 note trước, bạn đã có đủ mảnh ghép. Note này chỉ làm một việc: **đặt hai mảnh cạnh nhau**.

---

## 🧠 Câu trả lời trong 30 giây

```
React            = component là khái niệm CỦA THƯ VIỆN.
                   Browser không biết nó tồn tại.
                   JSX → object mô tả → React tự dịch ra lệnh DOM.

Web Components   = component là khái niệm CỦA BROWSER.
                   Nó là một loại node trong DOM, y như <div>.
                   Tag thật → browser tự chạy class của bạn.
```

Và điểm quan trọng nhất, cái mà đọc tài liệu "cao siêu" hay bị bỏ qua:

```
        BẠN VIẾT                    AI DỊCH                      CÁI CUỐI CÙNG
   ─────────────────────      ──────────────────────      ────────────────────────

   <MyButton label="x"/>  ──►  Babel/SWC (lúc BUILD)  ──►  _jsx(MyButton,{label:"x"})
                                       │
                                       ▼
                              React runtime (lúc CHẠY)
                              gọi hàm MyButton()
                                       │
                                       ▼
                              diff object cũ vs mới
                                       │
                                       ▼
                              document.createElement("button")   ┐
                              el.textContent = "x"               │
                              parent.appendChild(el)             │
                                                                 │
                                                                 ├──► DOM THẬT
                                                                 │
   <my-button label="x">  ──►  (không ai dịch cả)                │
                              browser parse HTML                 │
                                       │                         │
                                       ▼                         │
                              gặp tag có gạch ngang              │
                              → tra registry → upgrade           │
                              → chạy constructor + connectedCb   ┘
                                       │
                                       ▼
                              class TỰ gọi DOM API của chính nó

                                       │
                                       ▼
              ┌──────────────────────────────────────────────┐
              │   TỪ ĐÂY TRỞ ĐI HAI ĐƯỜNG NHẬP LÀM MỘT       │
              │   DOM → CSSOM → render tree → layout →       │
              │   paint → composite      (note 01)           │
              └──────────────────────────────────────────────┘
```

**React không "render nhanh hơn browser".** Cuối cùng nó vẫn gọi `appendChild`. Nó chỉ **quyết định giùm bạn** nên gọi lệnh nào. Còn Web Components thì bạn (hoặc Lit) tự quyết định.

---

## ⚖️ Đối chiếu từng bước của pipeline

Đây là phần quan trọng nhất bài. Đọc kỹ cột 1 trước, rồi liếc ngang.

| Bước | React | Web Components |
| --- | --- | --- |
| **Tác giả viết gì** | `<MyButton label="Gửi" />` — chữ HOA, tự đặt tên tuỳ ý | `<my-button label="Gửi">` — **bắt buộc có gạch ngang** trong tên tag |
| **Có cần build step không** | **Bắt buộc** transpile JSX (Babel/SWC/esbuild/tsc). Không build thì browser SyntaxError ngay | **Không bắt buộc.** Mở file `.html` bằng `file://` cũng chạy. Build chỉ để bundle/minify cho tiện |
| **Ai hiểu cú pháp đó** | Babel / SWC / esbuild — **lúc build**. Browser chưa từng thấy JSX | **Chính browser** — HTML parser + `CustomElementRegistry`. Không có tầng dịch |
| **Sau khi load, "component" tồn tại ở đâu** | Object JS trong memory của React (Fiber tree). **Không có trong DOM** | **Node trong DOM.** Nó *là* một `HTMLElement`, kế thừa mọi thứ của element thường |
| **Mở DevTools → Elements thấy gì** | Chỉ thấy `<button class="...">`. `<MyButton>` biến mất. Muốn thấy phải cài **React DevTools** → tab Components | Thấy đúng `<my-button>`, mở ra có `#shadow-root (open)` nếu dùng Shadow DOM. Không cần extension |
| **`document.querySelector` tìm ra không** | `querySelector("MyButton")` → **`null`**. Không tồn tại | `querySelector("my-button")` → **ra element thật**, gọi được method của class trên nó |
| **Truyền dữ liệu VÀO** | `props` — truyền **mọi kiểu JS**: object, array, function, Map, JSX. Không mất kiểu | 2 kênh: **attribute** (HTML → luôn là **string**, phải tự parse) và **property** (JS → mọi kiểu, nhưng phải set bằng JS: `el.data = {...}`) |
| **Truyền dữ liệu RA** | **Callback prop**: `<X onSave={fn} />`. Gọi thẳng hàm, đồng bộ, có return value | **`CustomEvent`**: `this.dispatchEvent(new CustomEvent("save",{detail,bubbles:true,composed:true}))`. Bên ngoài `addEventListener`. Không có return value; muốn "chặn" thì dùng `preventDefault` + `cancelable` |
| **Cơ chế update UI** | `setState` → schedule → **render phase** (gọi lại function component) → **diff** VDOM cũ/mới → **commit** patch tối thiểu | Set property → component **tự biết** phải sửa gì → gọi thẳng DOM API. **Không diff.** (Lit thì diff *bên trong* template, phạm vi hẹp hơn nhiều) |
| **Lúc nào update chạy** | React batch trong scheduler; từ React 18 batch cả trong `setTimeout`/promise. Concurrent → render phase **có thể bị ngắt** | **Tuỳ implementation.** Vanilla: chạy **ngay lập tức, đồng bộ** trong setter. **Lit**: gom vào **microtask** (`this.updateComplete` là một Promise) |
| **Style scoping** | Chỉ là **quy ước lúc build**: CSS Modules đổi `.btn` → `.btn_x7f2a`. Với browser vẫn là CSS global. Xem [[08 - React - CSS va chuyen khong co encapsulation]] | **Shadow boundary thật ở style engine.** Selector bên ngoài không xuyên vào, selector bên trong không rò ra. Xem [[10 - Shadow DOM - Cay trong cay va ranh gioi that su]] |
| **Runtime phải tải về** | **~45KB min+gzip** cho `react` + `react-dom` (con số **xấp xỉ**, đổi theo version/bundler) | **0KB** nếu viết thuần — API có sẵn trong browser. **~5KB min+gzip** nếu dùng Lit (cũng là **xấp xỉ**) |
| **Vòng đời** | `useEffect`, `useLayoutEffect`, cleanup function; class cũ: `componentDidMount`… | `constructor`, `connectedCallback`, `disconnectedCallback`, `attributeChangedCallback`, `adoptedCallback` — **browser gọi**, không phải thư viện gọi |
| **SSR** | Rất trưởng thành: `renderToPipeableStream` + hydration, Next.js, RSC, streaming | **Declarative Shadow DOM** (`<template shadowrootmode="open">`) — đã có ở các browser hiện đại, nhưng tooling mỏng hơn React nhiều |
| **Dùng lại ở framework khác** | **Không.** Component React chỉ chạy trong app React | **Được.** Cùng một `<my-button>` chạy trong Angular, Vue, Svelte, HTML tĩnh, WordPress, Shopify theme |

---

## 🔍 Hai timeline đặt cạnh nhau

Cùng một hành động: **người dùng click nút, số đếm tăng lên**.

### Một lần click trong React (tóm từ [[07 - React - Truy vet mot lan setState tu click den pixel]])

```
 1. Browser: click → tạo TASK trong event loop
 2. Event bubble lên tận ROOT container
 3. React bắt ở root (synthetic event delegation) → tra Fiber xem handler nào
 4. Handler chạy → setState(n+1)  → chỉ ENQUEUE update, chưa render gì
 5. React scheduler batch mọi setState trong cùng lượt
 6. RENDER PHASE: gọi lại function component → ra VDOM mới
 7. RECONCILIATION: diff VDOM cũ vs mới (dùng `key` để ghép cặp)
 8. COMMIT PHASE (đồng bộ, không ngắt được): gọi DOM API thật
 9. useLayoutEffect chạy (trước khi vẽ)
10. Browser: layout → paint → composite     ← pixel đổi ở đây
11. useEffect chạy (sau khi vẽ)
```

### Một lần click trong Web Component (tóm từ [[09 - Web Components - Truy vet mot custom element tu HTML den pixel]])

```
 1. Browser: click → tạo TASK trong event loop
 2. Listener gắn TRỰC TIẾP trên nút (trong shadow root) chạy
 3. Handler chạy → this.count = n + 1
 4. Setter tự sửa DOM của chính mình  (vanilla: ngay lập tức
    | Lit: gom vào microtask rồi sửa phần thay đổi trong template)
 5. Browser: layout → paint → composite     ← pixel đổi ở đây
```

### Bình luận trung thực

**Ít tầng hơn KHÔNG tự động là tốt hơn.**

| | React | Web Components |
| --- | --- | --- |
| Số tầng trung gian | Nhiều | Ít |
| Bạn phải nghĩ gì | *"State mới là gì?"* | *"State đổi thì phải sửa những chỗ nào trong DOM?"* |
| Ai chịu trách nhiệm đúng/sai | React | **Bạn** (vanilla) hoặc Lit |
| Khi UI phức tạp lên | Chi phí gần như không đổi | Vanilla: code tự sửa DOM **phình rất nhanh** |

React **cố ý đổi** mấy tầng đó để lấy **mô hình khai báo**: bạn mô tả UI-tại-một-state, không phải viết chuỗi lệnh chuyển từ state A sang state B. Đó là một trao đổi hợp lý, không phải phí phạm. Lit tồn tại chính vì nó mang mô hình khai báo đó vào thế giới Web Components, với giá rẻ hơn nhiều.

---

## 🔍 Cùng một `<counter>` viết 2 cách

### Cách 1 — React

```jsx
import { useState } from "react";

export function Counter({ start = 0, label = "Đếm" }) {
  const [count, setCount] = useState(start);
  return (
    <div className="counter">
      <span>{label}: {count}</span>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  );
}

// dùng:  <Counter start={5} label="Số lần" />
```

### Cách 2 — Vanilla custom element

```js
class MyCounter extends HTMLElement {
  static observedAttributes = ["start", "label"];

  #count = 0;
  #label = "Đếm";

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <style>
        .counter { display: flex; gap: 8px; align-items: center; }
      </style>
      <div class="counter">
        <span id="txt"></span>
        <button id="btn">+1</button>
      </div>
    `;
    this.shadowRoot.getElementById("btn")
      .addEventListener("click", () => { this.count = this.#count + 1; });
  }

  connectedCallback() { this.#render(); }

  attributeChangedCallback(name, _old, value) {
    if (name === "start") this.#count = Number(value) || 0;   // attribute = STRING
    if (name === "label") this.#label = value ?? "Đếm";
    this.#render();
  }

  get count() { return this.#count; }
  set count(v) { this.#count = v; this.#render(); }

  #render() {                                   // tự tay cập nhật DOM
    const txt = this.shadowRoot?.getElementById("txt");
    if (txt) txt.textContent = `${this.#label}: ${this.#count}`;
  }
}
customElements.define("my-counter", MyCounter);

// dùng:  <my-counter start="5" label="Số lần"></my-counter>
```

### Cách 3 — Lit (cùng một thứ, ngắn lại)

```js
import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";

@customElement("my-counter")
export class MyCounter extends LitElement {
  static styles = css`.counter { display: flex; gap: 8px; align-items: center; }`;

  @property({ type: Number }) start = 0;   // tự parse attribute → number
  @property() label = "Đếm";
  @state() private count = 0;

  connectedCallback() { super.connectedCallback(); this.count = this.start; }

  render() {
    return html`
      <div class="counter">
        <span>${this.label}: ${this.count}</span>
        <button @click=${() => this.count++}>+1</button>
      </div>`;
  }
}
```

### Nhận xét thẳng thắn

| Tiêu chí | React | Vanilla WC | Lit |
| --- | --- | --- | --- |
| Số dòng | Ngắn nhất | **Dài gấp ~3** | Gần bằng React |
| Đọc có rõ "UI trông thế nào" không | Rõ | **Không** — logic render nằm rải rác | Rõ |
| Phải tự làm gì | Không | Parse attribute, sync attr↔prop, tự gọi `#render()`, tự viết template | Không |
| Style bị rò ra ngoài không | **Có** (trừ khi CSS Modules đổi tên) | Không | Không |
| Chạy được ngoài framework | Không | Được | Được |
| Runtime | ~45KB (xấp xỉ) | 0KB | ~5KB (xấp xỉ) |

**Kết luận thật lòng: vanilla Web Components verbose hơn nhiều.** Đó chính xác là lý do **Lit tồn tại** — nó giữ nguyên mô hình của browser (vẫn là custom element thật, vẫn 0 lock-in) nhưng trả lại cho bạn cách viết khai báo. Nếu bạn sắp làm Web Components thật, đi thẳng vào [[00 - Roadmap Web Components - Lit]], đừng viết vanilla cho toàn bộ app.

---

## ⚖️ Chỗ React MẠNH HƠN

Viết cho bạn — người đang làm React. Đây là những thứ bạn sẽ **mất** nếu bỏ React:

| Điểm mạnh | Cụ thể |
| --- | --- |
| **State & data flow trưởng thành** | Redux Toolkit, Zustand, Jotai, TanStack Query — hàng chục năm-người đã đổ vào. Bên WC không có gì tương đương về độ chín |
| **Hệ sinh thái khổng lồ** | Router, form (React Hook Form), table (TanStack Table), animation (Framer Motion), i18n… cắm vào là chạy |
| **DX & DevTools** | React DevTools (Components + Profiler), Fast Refresh giữ nguyên state khi sửa code, error boundary, error message rất tốt |
| **SSR / RSC / streaming** | Next.js, `renderToPipeableStream`, React Server Components. Đây là khoảng cách **lớn nhất** so với WC |
| **TypeScript** | Kiểu props end-to-end, generic component, autocomplete chuẩn. Bên WC kiểu chỉ chắc ở kênh **property**, còn attribute vẫn là string |
| **Không vướng chuyện CSS bị chặn** | Tailwind, global reset, theme… đều "ăn" bình thường. Với Shadow DOM, CSS global **không lọt vào trong** — đây là phiền toái có thật |
| **Test dễ hơn** | Testing Library + jsdom quá quen thuộc. Test Web Components thường cần browser thật (Web Test Runner) vì jsdom hỗ trợ Shadow DOM/custom element không đầy đủ |
| **Hiring** | Tuyển dev React dễ hơn tuyển dev Web Components rất nhiều |

---

## ⚖️ Chỗ Web Components MẠNH HƠN

| Điểm mạnh | Cụ thể |
| --- | --- |
| **Không lệ thuộc framework** | Không có "migration React 18 → 19", không có "Vue 2 hết hỗ trợ". Không có bản nâng cấp lớn nào để lo |
| **Tuổi thọ = tuổi thọ web platform** | Code viết hôm nay chạy được nhiều năm sau, vì browser cam kết không phá vỡ web |
| **Encapsulation THẬT** | Shadow boundary do style engine của browser thi hành, không phải quy ước đặt tên. CSS bên ngoài không thể vô tình đè lên |
| **Chạy ở mọi nơi** | Shopify theme (Liquid), WordPress, email builder, CMS, app Angular/Vue/jQuery cũ — chỗ nào có HTML là chạy |
| **Bundle nhỏ** | 0KB thuần / ~5KB với Lit. Quan trọng với widget nhúng vào trang người khác |
| **Dùng trực tiếp trong HTML tĩnh** | `<script type="module" src="...">` rồi viết tag. Không build, không bundler, không config |
| **Đã dùng thật ở quy mô lớn** | Shoelace / Web Awesome, Adobe Spectrum Web Components, Material Web (Google), YouTube (Polymer), Photoshop Web (Adobe), một số phần UI của GitHub |

---

## ⚖️ Khi nào chọn cái nào

| Tình huống | Chọn | Vì sao |
| --- | --- | --- |
| App nội bộ, 1 team, 1 stack | **React** | Hệ sinh thái + tốc độ ra tính năng thắng tuyệt đối |
| Design system dùng chung nhiều team / nhiều framework | **Web Components** | Viết 1 lần, xài ở mọi app. Không phải maintain 3 bản React/Vue/Angular |
| Widget nhúng vào trang của người khác (chat, review, booking) | **Web Components** | Shadow DOM chặn CSS của trang chủ phá layout của bạn — đây là lý do sát sườn nhất |
| Cần SEO tốt / SSR nặng | **React** (Next.js) | WC + Declarative Shadow DOM làm được nhưng tooling còn mỏng — chọn WC ở đây phải chấp nhận tự lo nhiều |
| Team chỉ biết React, deadline gấp | **React** | Đừng học công nghệ mới trên đường găng của dự án |
| Sản phẩm dự kiến sống 10 năm, không muốn viết lại | **Web Components** | Không có chu kỳ đập đi xây lại theo framework |
| App nhiều state phức tạp, nhiều luồng dữ liệu | **React** | Đây là bài toán React sinh ra để giải |
| Trang tĩnh / landing page cần vài đảo tương tác | **Web Components** | Không cần kéo cả runtime React về chỉ để làm cái accordion |
| Micro-frontend, nhiều team deploy độc lập | **Web Components** (làm lớp vỏ) | Boundary rõ ràng, không sợ đụng version React |

---

## 🔍 Dùng CHUNG — phần thực dụng nhất

Ngoài đời rất ít ai chọn một-mất-một. Chiến lược phổ biến nhất:

```
   ┌───────────────────────────────────────────────────────┐
   │  Design system  =  Web Components  (Lit)              │
   │  ────────────────────────────────────────             │
   │  <ds-button> <ds-input> <ds-modal> <ds-table>         │
   └───────────────────┬───────────────────┬───────────────┘
                       │                   │
        ┌──────────────▼──────┐   ┌────────▼─────────────┐
        │  App A  =  React    │   │  App B  =  Angular   │
        │  (team chính)       │   │  (hệ thống cũ)       │
        └─────────────────────┘   └──────────────────────┘
```

### Web Component **trong** React

**React 19** đã hỗ trợ custom element đầy đủ — nó đạt **điểm tối đa trên custom-elements-everywhere.com**. Cụ thể React 19 làm được 2 việc mà trước đó không:

| | React ≤ 18 | React 19 |
| --- | --- | --- |
| Truyền **object/array** vào custom element | Bị ép thành **attribute string** → element nhận `"[object Object]"` | Nếu element **có property** cùng tên → set **property**; nếu không → set attribute |
| Bắt **`CustomEvent`** | **Không có** cách khai báo. Phải `useRef` + `addEventListener` thủ công | Vẫn dùng `ref` + `addEventListener` là cách chuẩn, nhưng phần truyền dữ liệu hai chiều đã hết vướng |

```jsx
// React 19 — truyền object vào WC gọn gàng
function Page({ rows }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    const onPick = (e) => console.log("chọn:", e.detail);   // CustomEvent
    el.addEventListener("row-pick", onPick);
    return () => el.removeEventListener("row-pick", onPick);
  }, []);

  //  rows là array → React 19 set thành PROPERTY, không stringify
  return <ds-table ref={ref} rows={rows} dense />;
}
```

Nếu còn kẹt ở React 18, hoặc muốn `onRowPick` viết như prop React bình thường, dùng wrapper chính chủ của Lit:

```jsx
import { createComponent } from "@lit/react";
import * as React from "react";
import { DsTable } from "./ds-table.js";

export const DsTableReact = createComponent({
  tagName: "ds-table",
  elementClass: DsTable,
  react: React,
  events: { onRowPick: "row-pick" },   // CustomEvent → prop kiểu React
});

// dùng:  <DsTableReact rows={rows} onRowPick={(e) => ...} />
```

### React **trong** Web Component

Ngược lại cũng làm được: mount một React root bên trong custom element.

```js
class ReactIsland extends HTMLElement {
  connectedCallback() {
    this.mountPoint = document.createElement("div");
    this.appendChild(this.mountPoint);           //  light DOM, không shadow
    this.root = createRoot(this.mountPoint);
    this.root.render(<App />);
  }
  disconnectedCallback() { this.root?.unmount(); }  // nhớ dọn, kẻo leak
}
```

**Cảnh báo, đừng bỏ qua:**

- **Hai runtime chồng nhau** — bundle to lên, và mỗi island là một React root riêng, không share context/state với nhau.
- **Nếu mount vào shadow root**: React gắn listener ở container root, nhưng event từ trong shadow đi ra ngoài bị **retarget** ([[10 - Shadow DOM - Cay trong cay va ranh gioi that su]]). Nói chung là chạy được, nhưng portal, `document`-level listener và thư viện bên thứ ba (dropdown, tooltip) hay lỗi lặt vặt. **Mount vào light DOM an toàn hơn nhiều.**
- Đây là kỹ thuật cho **kiến trúc island / micro-frontend**, không nên dùng đại trà.

### Bảng gotcha khi trộn

| Gotcha | Triệu chứng | Cách xử lý |
| --- | --- | --- |
| **Attribute string vs property object** | Element nhận `"[object Object]"` hoặc `"undefined"` | React 19 tự lo. React 18: `ref.current.data = obj` trong `useEffect` |
| **Boolean attribute** | `disabled={false}` mà vẫn thấy bị disable | Attribute **có mặt** = true, bất kể giá trị. Set/remove attribute, hoặc dùng property |
| **`CustomEvent` không nổi lên** | Handler ở component cha không chạy | Phải `bubbles: true` **và** `composed: true` nếu event phát từ trong shadow root |
| **Form submit** | `<my-input>` trong `<form>` không gửi giá trị | Dùng **form-associated custom element** (`static formAssociated = true` + `ElementInternals`), hoặc render một `<input hidden>` ở light DOM |
| **Focus / a11y** | Tab không vào được, screen reader không đọc | Tự set `tabindex`, `role`, `aria-*`. `delegatesFocus: true` khi `attachShadow`. Không dùng `aria-labelledby` xuyên qua shadow boundary — id không xuyên được |
| **CSS global không lọt vào** | Tailwind/reset không ăn bên trong component | Đó là **thiết kế**, không phải bug. Mở cửa có chủ đích: CSS variable, `::part`, `::slotted` |
| **SSR** | Trang nháy layout (FOUC) trước khi element upgrade | Declarative Shadow DOM, hoặc đặt `:not(:defined) { visibility: hidden }` — xem [[03 - Script duoc tai luc nao - defer, async, module]] |
| **Test** | jsdom báo `customElements is not defined` / shadowRoot rỗng | Test Web Components trong browser thật (Web Test Runner / Playwright), đừng ép jsdom |

---

## 🔍 Bảng dịch thuật ngữ React ↔ Web Components

In cái bảng này ra dán màn hình. Nó rút ngắn thời gian học Web Components xuống rất nhiều.

| React | Web Components (vanilla) | Với Lit |
| --- | --- | --- |
| `props` | attribute (string) **hoặc** property (mọi kiểu JS) | `@property()` — tự đồng bộ attribute ↔ property, tự ép kiểu |
| `props.children` | `<slot>` | `<slot>` (giống hệt) |
| `props.children` nhiều vùng | `<slot name="header">` + `slot="header"` | như trên |
| callback prop `onChange` | `dispatchEvent(new CustomEvent("change", { detail }))` | như trên, hoặc `@lit/react` để có prop `onChange` bên React |
| `useState` | property riêng + tự gọi hàm render | `@state()` — set là tự re-render |
| `useEffect(fn, [])` mount | `connectedCallback()` | `connectedCallback()` / `firstUpdated()` |
| `useEffect` cleanup | `disconnectedCallback()` | `disconnectedCallback()` |
| `useEffect(fn, [dep])` | `attributeChangedCallback()` / setter | `willUpdate(changed)` / `updated(changed)` |
| `useLayoutEffect` | code chạy đồng bộ ngay sau khi sửa DOM | `updated()` (chạy trước lần paint kế tiếp) |
| `React.memo` / `shouldComponentUpdate` | tự kiểm tra trong setter rồi bỏ qua | `shouldUpdate(changed)` |
| `useContext` / Context Provider | tự làm bằng event "xin context" bubble lên | `@lit/context` (`@consume` / `@provide`) |
| `useMemo` | biến cache trong instance | `@state` phái sinh, hoặc tính trong `willUpdate` |
| custom hook | mixin (hàm nhận class trả class) | **Reactive Controller** — đây là bản đối chiếu sát nhất với custom hook |
| CSS Modules / styled-components | Shadow DOM + `<style>` trong shadow root | `static styles = css\`...\`` |
| prop `className` để cha chỉnh style con | `::part()` + `part="..."` | như trên |
| theme qua Context | CSS custom property (`--ds-color-primary`) | như trên |
| `ref` → DOM node | `this.shadowRoot.querySelector("#x")` | `@query("#x")` hoặc directive `ref()` |
| `key` trong list | tự quản lý | directive `repeat(items, keyFn, tpl)` |
| `ReactDOM.createRoot().render()` | `customElements.define("x-y", XY)` + viết tag | `@customElement("x-y")` |
| `<Suspense>` + data fetching | tự viết state loading | `Task` của `@lit/task` |

---

## ⚠️ Bẫy hay gặp khi dev React đọc Web Components

| Bẫy | Thực tế |
| --- | --- |
| *"Web Components là để thay thế React"* | Không. Nó thay thế **lớp component**, không thay thế router/state/data-fetching. Rất nhiều app dùng cả hai |
| *"Không có VDOM chắc nhanh hơn"* | Không đảm bảo. Vanilla WC viết cẩu thả (`innerHTML = ...` mỗi lần update) **chậm hơn** React nhiều, vì phá và dựng lại DOM |
| *"Shadow DOM = CSS Modules xịn"* | Khác **về bản chất**: CSS Modules đổi tên class **lúc build**; Shadow DOM là ranh giới **lúc chạy** do browser thi hành |
| *"Truyền object qua attribute được"* | Attribute **luôn là string**. Object phải đi qua **property** |
| *"Đặt tên `<mybutton>` cũng được"* | Không. Tên custom element **bắt buộc có gạch ngang**, nếu không browser coi là thẻ HTML lạ và không upgrade |
| *"Component tự update như React"* | Vanilla thì **không**. Bạn phải tự viết code sửa DOM. Lit mới lo giùm |
| *"React không dùng được với WC"* | Cũ rồi. **React 19 đạt điểm tối đa** trên custom-elements-everywhere |

---

## ✅ Nhớ 5 điều

1. **Khác biệt gốc: ai sở hữu khái niệm "component".** React = thư viện sở hữu (object trong memory, browser mù tịt). Web Components = browser sở hữu (node thật trong DOM, `querySelector` tìm ra).
2. **Hai đường khác nhau nhưng đổ vào cùng một pipeline.** DOM → CSSOM → layout → paint → composite không đổi. Khác nhau ở **ai ra lệnh gọi DOM API**, không phải ở tốc độ pipeline.
3. **React đổi thêm mấy tầng trung gian lấy mô hình khai báo và một hệ sinh thái khổng lồ.** Ít tầng hơn không tự động tốt hơn — vanilla Web Components verbose hơn thật, và đó là lý do Lit ra đời.
4. **Encapsulation là điểm khác biệt thật sự duy nhất mà không copy được.** Shadow boundary do browser thi hành; CSS Modules chỉ là đổi tên class. Đây là lý do chính để chọn WC cho design system và widget nhúng.
5. **Câu trả lời thực dụng thường là "cả hai".** Design system bằng Web Components, app bằng React. React 19 đã hỗ trợ custom element đầy đủ, `@lit/react` lấp phần còn lại. Đi tiếp: [[00 - Roadmap Web Components - Lit]].

---

## 📚 Nguồn

- [react.dev — Learn React](https://react.dev/learn)
- [React 19 release blog — Support for Custom Elements](https://react.dev/blog/2024/12/05/react-19#support-for-custom-elements)
- [Custom Elements Everywhere — bảng điểm hỗ trợ theo framework](https://custom-elements-everywhere.com/)
- [MDN — Web Components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components)
- [MDN — Using custom elements](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements)
- [MDN — Using shadow DOM](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM)
- [lit.dev — Introduction](https://lit.dev/docs/)
- [lit.dev — Lit and React (`@lit/react`)](https://lit.dev/docs/frameworks/react/)
- [lit.dev — Reactive Controllers](https://lit.dev/docs/composition/controllers/)
- [web.dev — Declarative Shadow DOM](https://web.dev/articles/declarative-shadow-dom)
- [Shoelace / Web Awesome — design system bằng Web Components](https://shoelace.style/)
- [Material Web (Google)](https://github.com/material-components/material-web)
