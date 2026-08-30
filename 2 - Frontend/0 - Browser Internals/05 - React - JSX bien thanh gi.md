# 05 — React: JSX biến thành gì

> **TL;DR:** Browser **không hiểu JSX**. Trước khi chạy, một công cụ build (Babel/SWC/esbuild/tsc) dịch JSX thành lời gọi hàm JS thường, và kết quả cuối cùng chỉ là **một object JS thuần** mô tả UI — không phải DOM node. React đọc cái object đó rồi tự tay gọi `document.createElement`, `setAttribute`, `appendChild`… tức là đúng những API DOM ở note 02. Không có phép thuật nào cả.

Series: [[00 - Roadmap - Tu HTML den Pixel]]
Anh em: [[02 - DOM la gi - Cay, Node va API]] · [[06 - React - Virtual DOM, Reconciliation va Fiber]] · [[07 - React - Truy vet mot lan setState tu click den pixel]] · [[Glossary/C - React|Glossary C]]

---

## 🎯 Câu hỏi note này trả lời

- `<MyButton />` **thực chất** là cái gì sau khi build?
- Vì sao mở DevTools → Elements lại **không thấy** `<MyButton>` đâu, chỉ thấy `<button>`?
- Vì sao trước đây file nào cũng phải `import React`, giờ thì không?
- Vì sao phải viết `className` chứ không phải `class`?
- Vì sao viết `<myButton />` (chữ thường) thì không lỗi nhưng UI trắng trơn?

---

## 🧠 Bước 0 — JSX không phải HTML, cũng không phải JS

Thử copy đoạn này vào Console của browser:

```js
const x = <div className="card">Hello</div>;
// ❌ Uncaught SyntaxError: Unexpected token '<'
```

Browser **từ chối ngay từ bước parse JS**. Nó chưa kịp chạy dòng nào.

JSX là **cú pháp mở rộng** của JavaScript — một quy ước viết cho *người*, do Facebook đặt ra, để mô tả UI trông giống HTML. Muốn chạy được, nó **bắt buộc** phải đi qua một **transpiler**:

| Công cụ | Thường gặp ở đâu |
| --- | --- |
| **Babel** (`@babel/preset-react`) | Create React App cũ, cấu hình thủ công, Jest |
| **SWC** (viết bằng Rust) | Next.js, Parcel 2 |
| **esbuild** | Vite (dev + build), tsup |
| **TypeScript compiler** (`tsc`) | project `.tsx` build bằng `tsc` |

Cả 4 làm **cùng một việc**, chỉ khác tốc độ. Nghĩa là: **JSX là chuyện của lúc build, không phải chuyện của lúc chạy.** Đến lúc code tới browser thì JSX đã biến mất sạch.

```
     Bạn viết              Build tool             Browser nhận
  ┌────────────┐        ┌─────────────┐        ┌──────────────┐
  │ App.jsx    │  ───▶  │ Babel/SWC/  │  ───▶  │ App.js       │
  │ <div>...   │        │ esbuild/tsc │        │ _jsx("div")  │
  └────────────┘        └─────────────┘        └──────────────┘
                                                 ↑ JS hợp lệ 100%
```

---

## ⚙️ Bước 1 — Before → After: JSX biến thành lời gọi hàm

Đây là **trái tim của note này**. Có **hai kiểu dịch**, tuỳ cấu hình.

### 1a. Classic runtime (kiểu cũ, React ≤ 16 và các project chưa đổi cấu hình)

```jsx
// ── BEFORE ──
import React from "react";

function Card() {
  return <div className="card">Hello</div>;
}
```

```js
// ── AFTER (Babel, runtime: "classic") ──
import React from "react";

function Card() {
  return React.createElement("div", { className: "card" }, "Hello");
}
```

👉 Vì code sau khi dịch có chữ `React.createElement`, nên **biến `React` phải tồn tại trong scope** → đó là lý do file `.jsx` nào cũng phải `import React from "react"` dù bạn không dùng chữ `React` ở đâu cả. Quên import = `React is not defined`.

Chữ ký: `React.createElement(type, props, ...children)` — children đi vào **các tham số sau**.

### 1b. Automatic runtime (mặc định từ React 17, và là chuẩn ở React 18/19)

```jsx
// ── BEFORE ── (không import React nữa)
function Card() {
  return <div className="card">Hello</div>;
}
```

```js
// ── AFTER (Babel/SWC, runtime: "automatic") ──
import { jsx as _jsx } from "react/jsx-runtime";   // ⬅ build tool TỰ chèn dòng này

function Card() {
  return _jsx("div", { className: "card", children: "Hello" });
}
```

👉 Build tool **tự chèn import** từ `react/jsx-runtime`. Bạn không cần `import React` nữa. (Vẫn cần import khi dùng thứ khác của React như `useState`.)

Ba hàm bạn sẽ thấy trong bundle:

| Hàm | Khi nào dùng |
| --- | --- |
| `_jsx(type, props, key?)` | có **0 hoặc 1** child |
| `_jsxs(type, props, key?)` | có **nhiều** children (mảng cố định, React biết chắc không cần cảnh báo `key`) |
| `_jsxDEV(...)` | bản dev, mang thêm file/dòng để hiện trong thông báo lỗi |

### So sánh nhanh 2 runtime

| | Classic | Automatic |
| --- | --- | --- |
| Hàm được gọi | `React.createElement` | `_jsx` / `_jsxs` |
| `import React` | **bắt buộc** | không cần |
| `children` nằm đâu | tham số thứ 3, 4, 5… | **bên trong `props.children`** |
| `key` nằm đâu | trong `props` | **tham số riêng**, tách khỏi props |
| Bundle | to hơn chút | nhỏ hơn, tối ưu tốt hơn |

> ⚠️ Hai runtime **cho ra cùng một kết quả cuối cùng**. Chỉ khác đường đi. Đừng lo bạn đang dùng cái nào — Vite/Next/CRA 5 đều đã là automatic.

---

## 🔍 Bước 2 — Kết quả cuối cùng là một OBJECT JS thuần

Gọi `_jsx("div", {...})` trả về cái gì? Một object. Thử luôn:

```jsx
const el = <div className="card">Hello</div>;
console.log(el);
```

Shape thật (React 18):

```js
{
  $$typeof: Symbol(react.element),   // dấu niêm phong
  type: "div",                        // thẻ gì / component nào
  key: null,                          // để reconciliation (note 06)
  ref: null,                          // để lấy DOM node thật
  props: {
    className: "card",
    children: "Hello"
  },
  _owner: null, _store: {}            // nội bộ React, kệ nó
}
```

Object này gọi là **React element**.

> 🔬 Chi tiết nhỏ: từ **React 19**, symbol nội bộ đổi tên thành `Symbol.for("react.transitional.element")`, và `ref` không còn là field riêng mà nằm luôn trong `props` cho function component. Ý nghĩa không đổi — đừng phụ thuộc vào những field này, chúng là nội bộ.

### `$$typeof` để làm gì? — chống XSS

`Symbol` **không serialize được sang JSON**. Nếu server trả về một JSON do người dùng nhập:

```json
{ "type": "div", "props": { "dangerouslySetInnerHTML": { "__html": "<img onerror=...>" } } }
```

rồi bạn lỡ `render(userData)`, thì object đó **thiếu `$$typeof`** (vì JSON không đẻ ra Symbol được) → React nhận ra đây không phải element thật và **từ chối render**. Đó là một lớp chắn XSS gần như miễn phí.

---

## 🏠 Bước 3 — Điểm mấu chốt: React element ≠ DOM node

Đây là chỗ hầu hết mọi người hiểu sai.

> **React element = BẢN VẼ THIẾT KẾ. DOM node = NGÔI NHÀ THẬT.**

| | React element | DOM node |
| --- | --- | --- |
| Bản chất | object JS thường | object của browser engine |
| Tạo bằng | `_jsx(...)` / JSX | `document.createElement(...)` |
| Có `appendChild`? | ❌ không | ✅ có |
| Có nằm trong `document`? | ❌ không | ✅ có |
| Có gây layout/paint? | ❌ không | ✅ có (note 01) |
| Chi phí tạo | rẻ như tạo `{a: 1}` | **đắt** — engine phải cấp phát, gắn vào cây |
| Sửa được sau khi tạo? | ❌ **immutable** | ✅ có |

```jsx
const el = <div>hi</div>;

el.appendChild(...)          // ❌ TypeError: el.appendChild is not a function
document.body.contains(el)   // ❌ false — nó chưa ở đâu cả
el.props.children = "bye";   // ❌ React element là read-only, đừng làm
```

👉 Vì element rẻ, React **thoải mái tạo lại cả nghìn cái mỗi lần render**. Đó là nền móng cho toàn bộ ý tưởng ở [[06 - React - Virtual DOM, Reconciliation va Fiber]].

Vẽ bản thiết kế 1000 lần thì không tốn gì. Xây lại nhà 1000 lần mới tốn.

---

## 🔠 Bước 4 — Chữ HOA vs chữ thường: quy tắc sống còn

Transpiler quyết định `type` là gì **chỉ dựa vào chữ cái đầu**:

```jsx
<div />          →  _jsx("div", {})        // type là CHUỖI "div"
<MyButton />     →  _jsx(MyButton, {})     // type là CHÍNH HÀM MyButton
```

| Bạn viết | `type` sau khi build | React làm gì |
| --- | --- | --- |
| `<div>` | `"div"` (string) | biết đây là thẻ HTML → `document.createElement("div")` |
| `<my-card>` | `"my-card"` (string) | cũng là thẻ HTML → custom element (xem [[09 - Web Components - Truy vet mot custom element tu HTML den pixel]]) |
| `<MyButton>` | `MyButton` (function) | **gọi hàm** `MyButton(props)` để lấy element con |
| `<myButton>` | `"myButton"` (string) 💀 | tưởng là thẻ HTML lạ → tạo `<mybutton>` rỗng, **không lỗi**, chỉ trắng |

Ghi nhớ một dòng: **chữ thường = thẻ HTML, chữ HOA = component của bạn.**

Cùng lý do đó, muốn dùng component qua object phải viết `<Lib.Button />` (có dấu chấm → React cũng hiểu là component), còn `<button2 />` thì mãi mãi là thẻ HTML.

---

## 🌳 Bước 5 — Component là hàm trả về element → thành CÂY

Component không phải "một thẻ". Nó là **một hàm nhận props, trả về React element**:

```jsx
function MyButton({ label }) {
  return <button className="btn">{label}</button>;
}

function App() {
  return (
    <div className="page">
      <MyButton label="Lưu" />
    </div>
  );
}
```

React bắt đầu từ `<App />`, thấy `type` là function → **gọi nó** → nhận element con → thấy trong đó có `<MyButton>` cũng là function → **gọi tiếp** → … cứ thế đi xuống cho đến khi mọi `type` đều là string.

```
① CÂY JSX BẠN VIẾT           ② CÂY ELEMENT (sau khi React gọi hết)     ③ CÂY DOM THẬT
─────────────────────        ────────────────────────────────────      ─────────────────
<App>                        {type: App}                               (không có gì)
  └ <div className="page">     └ {type: "div", props:{className}}       <div class="page">
      └ <MyButton label>          └ {type: MyButton, props:{label}}       (BIẾN MẤT ✂)
                                     └ {type: "button", props:{...}}      └ <button class="btn">
                                          └ "Lưu"                             └ "Lưu"
```

### 💡 Vì sao DevTools → Elements KHÔNG thấy `<MyButton>`?

Vì **`<MyButton>` chưa bao giờ là một thẻ HTML.** Nó chỉ là một cái tên hàm, tồn tại ở cột ②. Khi React đi tới bước tạo DOM thật (cột ③), nó **chỉ tạo node cho những `type` là string**. Function component **không để lại dấu vết nào trong DOM** — nó tan ra thành đúng những gì nó `return`.

Đây là khác biệt lớn nhất so với Web Components: `<my-card>` là **một node thật, tồn tại trong `document`**, DevTools nhìn thấy, `querySelector("my-card")` tìm được. Còn `<MyButton>` thì không. Chi tiết ở [[11 - So sanh truc tiep - React vs Web Components]].

> Muốn "nhìn thấy" cột ② thì cài **React DevTools** — tab **Components** (khác tab **Elements** của browser). Hai tab đó đang xem hai cây khác nhau.

---

## 👶 Bước 6 — `children` chỉ là một prop, không có gì đặc biệt

```jsx
<Card title="Hi">
  <p>nội dung</p>
</Card>
```

biến thành:

```js
_jsx(Card, {
  title: "Hi",
  children: _jsx("p", { children: "nội dung" })   // ⬅ chỉ là một prop tên "children"
});
```

Bằng chứng: hai cách viết này **giống hệt nhau**:

```jsx
<Card>xin chào</Card>
<Card children="xin chào" />   // hợp lệ, tuy không ai viết thế
```

`children` là `undefined` nếu không có, là **1 element** nếu có 1, là **mảng** nếu có nhiều. (Đừng tự đoán — dùng `React.Children` nếu cần xử lý.)

> 🔁 Web Components giải bài toán này bằng `<slot>` — nhưng cơ chế hoàn toàn khác: slot **không truyền dữ liệu**, nó *chiếu* node có sẵn trong light DOM sang vị trí khác. Chi tiết ở note 10.

---

## 🔨 Bước 7 — Từ cây element → DOM thật: React gọi đúng API ở note 02

```jsx
import { createRoot } from "react-dom/client";   // React 18/19
createRoot(document.getElementById("root")).render(<App />);
```

React duyệt cây element rồi làm chính xác những việc này (đơn giản hoá):

```js
// với {type: "button", props: {className: "btn", onClick: f, children: "Lưu"}}
const node = document.createElement("button");   //  ← note 02
node.className = "btn";                          //  ← note 02
node.appendChild(document.createTextNode("Lưu"));//  ← note 02
parent.appendChild(node);                        //  ← note 02 → trigger layout/paint (note 01)
```

👉 **Không có phép thuật.** React chỉ là JS chạy trong bước "execute script" của pipeline (note 03), và việc duy nhất nó làm được với màn hình là **gọi DOM API**. Browser vẫn là cái máy duy nhất biết vẽ.

Sự khác biệt của React nằm ở chỗ khác: **bạn mô tả "muốn UI trông thế nào"**, còn **React tự tính xem phải gọi những API nào** — đó là nội dung note 06.

---

## 🧩 Bước 8 — Những chi tiết cú pháp hay làm người mới vấp

| Bạn muốn | Viết trong JSX | Vì sao |
| --- | --- | --- |
| `class="card"` | `className="card"` | `class` là **từ khoá JS**, không đặt làm key thoải mái được thời JSX ra đời |
| `<label for="x">` | `htmlFor="x"` | `for` cũng là từ khoá JS |
| inline style | `style={{ fontSize: 14 }}` | là **object**, key **camelCase**, số tự thêm `px` (trừ vài prop như `lineHeight`, `zIndex`) |
| chèn biến | `{user.name}` | `{}` = "nhét một **biểu thức JS** vào đây" |
| gắn sự kiện | `onClick={handle}` | camelCase, nhận **hàm** chứ không phải chuỗi như HTML |
| nhiều node, không thêm div | `<>...</>` hoặc `<Fragment>` | gom con lại mà **không tạo DOM node nào** |
| bình luận | `{/* ghi chú */}` | vì bên trong JSX vẫn là JS |

### `{}` chứa **biểu thức**, không chứa **câu lệnh**

```jsx
{ if (ok) ... }                 // ❌ if là STATEMENT, không có giá trị
{ ok ? <A/> : <B/> }            // ✅ ternary là expression
{ ok && <A/> }                  // ✅ && là expression
{ items.map(i => <Li key={i.id} .../>) }   // ✅ map trả về mảng
```

Lý do rất đơn giản: `_jsx("div", { children: ??? })` — chỗ `???` là **một tham số hàm**, mà tham số thì phải là *giá trị*. `if` không có giá trị. Muốn dùng `if` thì viết **trước** phần `return`:

```jsx
function View({ ok }) {
  if (!ok) return null;         // ✅ được, vì đây là JS thường, chưa vào JSX
  return <div>xong</div>;
}
```

> 🪤 Bẫy `&&`: `{items.length && <List/>}` — khi mảng rỗng, `0` là giá trị **hợp lệ để render** → màn hình hiện số **0** chình ình. Dùng `{items.length > 0 && ...}`.

---

## ⚡ Bước 9 — Synthetic event: React KHÔNG gắn listener lên từng node

Bạn viết `onClick` trên 500 dòng danh sách. Trực giác nói React gọi `addEventListener` 500 lần. **Sai.**

Từ React 17 trở đi (và React 18/19 giữ nguyên), React gắn listener **một lần ở root container** — chính cái DOM node bạn truyền vào `createRoot(container)`:

```
       <div id="root">   ⬅ listener "click" gắn ở ĐÂY (1 lần cho cả app)
         └ <ul>
             └ <li>
                 └ <button>  ⬅ bạn bấm ở đây
```

1. Bạn bấm `<button>` → browser bubble sự kiện lên tới `#root` (cơ chế DOM thường).
2. React bắt được ở `#root`, nhìn xem node gốc là ai, lần ngược cây nội bộ.
3. React tạo một object **SyntheticEvent** (bọc quanh event thật, chuẩn hoá khác biệt giữa browser) rồi gọi lần lượt các `onClick` trên đường đi.

**Vì sao làm thế:** ít listener hơn → nhẹ hơn; và React chủ động được **thứ tự + gom batch update** (note 07).

**Hệ quả cần nhớ:**

| Tình huống | Chuyện gì xảy ra |
| --- | --- |
| `e.stopPropagation()` trong React handler | chặn được **các React handler cha**, nhưng sự kiện DOM **đã bubble tới root rồi** |
| `document.addEventListener("click", f)` thủ công | thường chạy **sau** React handler (vì root nằm dưới document) → hay gây bug "click ra ngoài để đóng modal" |
| Trộn với Web Components phát `CustomEvent` | React 19 **hỗ trợ custom event tốt hơn**; React ≤18 không tự map `onMyEvent` → phải `ref` + `addEventListener` tay. Chi tiết ở [[11 - So sanh truc tiep - React vs Web Components]] |
| `e.target` vs `e.currentTarget` | `target` = node thật bị bấm; `currentTarget` = node có handler |

> Một số sự kiện không bubble (`scroll`, `focus`/`blur` bản gốc, media events) được React gắn trực tiếp lên node — đây là chi tiết nội bộ, đừng dựa vào.

---

## ⚠️ Bẫy thường gặp

| Bẫy | Triệu chứng | Cách sửa |
| --- | --- | --- |
| Viết thường tên component: `<myCard />` | **Không lỗi**, chỉ trắng; DevTools thấy `<mycard>` rỗng | Luôn viết HOA chữ đầu |
| `React is not defined` | Project cấu hình classic runtime | Thêm `import React`, hoặc bật automatic runtime trong config |
| `onClick={handle()}` | Hàm chạy ngay lúc render, có khi loop vô tận | `onClick={handle}` hoặc `onClick={() => handle(x)}` |
| `class="..."` trong JSX | React warning, class không ăn | `className` |
| `style="color:red"` | Lỗi: style phải là object | `style={{ color: "red" }}` |
| `{0 && <X/>}` hiện số 0 | `0` là giá trị render được | `{count > 0 && <X/>}` |
| Sửa `element.props` sau khi tạo | không có tác dụng / lỗi khó hiểu | Element **immutable** — tạo element mới |
| Tưởng `<MyButton>` có trong DOM | `querySelector("MyButton")` = `null` | Dùng tab **Components** của React DevTools |
| Modal "click outside" bằng `document.addEventListener` | modal đóng ngay khi vừa mở | Hiểu thứ tự delegation, hoặc dùng `pointerdown`/kiểm tra `contains` |

---

## ✅ Nhớ 5 điều

1. **JSX là chuyện của lúc build.** Browser không bao giờ thấy JSX — nó chỉ thấy `_jsx(...)` hoặc `React.createElement(...)`.
2. **Kết quả là object JS thuần**, không phải DOM node. Bản vẽ, không phải ngôi nhà. Rẻ, immutable, không có `appendChild`.
3. **Chữ HOA = component (gọi hàm), chữ thường = thẻ HTML (string).** Viết sai là bug im lặng.
4. **Component tan biến khi ra DOM.** `<MyButton>` chỉ tồn tại trong cây element của React; DOM thật chỉ có `<button>`.
5. **React cuối cùng vẫn gọi DOM API thường.** Giá trị của nó không nằm ở tốc độ gọi API, mà ở chỗ **bạn không phải tự quyết định gọi cái nào** → xem [[06 - React - Virtual DOM, Reconciliation va Fiber]].

---

## 📚 Nguồn

- [react.dev — Writing markup with JSX](https://react.dev/learn/writing-markup-with-jsx)
- [react.dev — JavaScript in JSX with curly braces](https://react.dev/learn/javascript-in-jsx-with-curly-braces)
- [react.dev — `createElement` reference](https://react.dev/reference/react/createElement)
- [react.dev — `createRoot`](https://react.dev/reference/react-dom/client/createRoot)
- [React blog — Introducing the New JSX Transform](https://legacy.reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html)
- [Babel — `@babel/plugin-transform-react-jsx`](https://babeljs.io/docs/babel-plugin-transform-react-jsx)
- [MDN — `document.createElement`](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement)
- [MDN — Event delegation / bubbling](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Event_bubbling)
