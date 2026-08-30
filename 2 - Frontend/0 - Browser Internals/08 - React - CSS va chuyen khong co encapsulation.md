# 08 — React: CSS và chuyện không có encapsulation

> **TL;DR:** React **không** đóng gói CSS. Không có bất kỳ cơ chế nào ở tầng browser ngăn CSS của trang chọc vào component của bạn. Mọi thứ ta quen gọi là "scoped CSS" trong hệ React — CSS Modules, styled-components, BEM — thực chất chỉ là **đổi tên class cho khỏi trùng**, chứ không phải dựng rào chắn.
>
> Phân biệt được "đổi tên" với "rào chắn" là chìa khoá để hiểu vì sao Shadow DOM tồn tại (note 10).

Series: [[00 - Roadmap - Tu HTML den Pixel]]
Anh em: [[07 - React - Truy vet mot lan setState tu click den pixel]] · [[10 - Shadow DOM - Cay trong cay va ranh gioi that su]] · [[01 - Tu URL den Pixel - Vong doi mot trang web]] · [[11 - So sanh truc tiep - React vs Web Components]]

---

## 🎯 Sự thật gốc: CSS mặc định là **global**

Quay lại note 01: browser gom **tất cả** CSS của trang thành **một** CSSOM duy nhất, rồi khớp selector với **từng node** trong DOM.

```
  style.css ─┐
  app.css   ─┼──▶  MỘT CSSOM DUY NHẤT  ──▶ khớp với MỌI node trong document
  <style>   ─┘                                       │
  (bất kể ai chèn vào)                                ▼
                                              render tree → layout → paint
```

Một selector `.title` khớp **mọi** phần tử có class `title` trong document — bất kể node đó do component nào tạo ra, do thư viện nào render, hay do bạn viết tay trong `index.html`.

Và điểm mấu chốt:

> **Style engine của browser không biết "component" là gì.**
> Nó chỉ thấy một cây DOM phẳng gồm các node có tag, id, class, attribute.

React không hề đổi điều đó. React chỉ làm đúng một việc (note 07 bước 6): gọi `document.createElement` và set `className`. Sau đó nó đứng ngoài. Cái cây DOM mà React tạo ra **không khác gì** cây DOM bạn viết tay bằng HTML — cùng chịu một CSSOM, cùng luật cascade.

---

## 🧠 Điểm quan trọng nhất của bài

Đọc chậm câu này:

> ### "Scoped CSS" trong hệ React = **đổi tên**, không phải **rào chắn**.
>
> Nó làm class của bạn khó trùng với người khác.
> Nó **không** ngăn người khác nhắm vào bạn.

Hai chuyện hoàn toàn khác nhau:

```
   ĐỔI TÊN (CSS Modules, BEM, styled-components)
   ┌──────────────────────────────────────────────┐
   │  .title  →  .Button_title__x7f2a             │
   │                                              │
   │  ✅ CSS của tôi không đè nhầm .title của bạn │
   │  ❌ Nhưng div{...!important} vẫn trúng tôi   │
   │  ❌ Và * { } vẫn trúng tôi                    │
   └──────────────────────────────────────────────┘

   RÀO CHẮN (Shadow DOM — note 10)
   ┌──────────────────────────────────────────────┐
   │  BROWSER từ chối khớp selector qua ranh giới │
   │                                              │
   │  ✅ CSS của tôi không rò ra ngoài             │
   │  ✅ CSS ngoài KHÔNG chọc vào được             │
   └──────────────────────────────────────────────┘
```

Ai thực thi cũng khác: cái trên do **build tool / thư viện JS** làm ở tầng đặt tên; cái dưới do **chính browser** làm ở tầng khớp selector.

---

## ⚙️ Điểm qua từng cách

### 1. Global CSS + BEM

```css
/* button.css — file này load một lần cho cả app */
.c-button { padding: 8px 16px; }
.c-button__label { font-weight: 600; }
.c-button--primary { background: #2563eb; }
```

- **Cơ chế thật:** không có cơ chế nào. Đây thuần tuý là **quy ước đặt tên** để tên đủ dài, đủ đặc thù nên khó trùng.
- **Ưu:** không cần build tool, DevTools đọc rất dễ, ai cũng hiểu.
- **Nhược:** rào chắn = **kỷ luật con người**. Một người mới vào viết `.button` là vỡ. Xoá CSS chết rất sợ vì không biết còn ai dùng.
- **Encapsulation thật?** ❌ Không.

### 2. CSS Modules

```css
/* Button.module.css — bạn viết */
.title { color: red; }
```

```jsx
import styles from './Button.module.css';
<h2 className={styles.title}>Xin chào</h2>
```

Build tool (Vite, webpack css-loader, Next.js) biến nó thành:

```css
/* CSS thật gửi tới browser */
.Button_title__x7f2a { color: red; }
```
```html
<!-- DOM thật -->
<h2 class="Button_title__x7f2a">Xin chào</h2>
```

- **Cơ chế thật:** build tool **băm tên class** thành chuỗi duy nhất, rồi thay thế trong cả CSS lẫn JS. File CSS xuất ra **vẫn là một stylesheet global bình thường**, nhập chung vào cùng một CSSOM với mọi CSS khác.
- **Ưu:** không trùng tên (thật sự), xoá code chết an toàn, không tốn runtime.
- **Nhược:** chỉ chống trùng theo **chiều tôi ra ngoài**. Class băm thì chọn kiểu `div`, `*`, `[data-x]`, `!important` vẫn trúng bình thường.
- **Encapsulation thật?** ❌ Không — chỉ là name mangling.

### 3. CSS-in-JS (styled-components, Emotion)

```jsx
const Title = styled.h2`color: red;`;
```

Lúc chạy, thư viện băm nội dung CSS ra một tên class (ví dụ `sc-kFuwaP` / `css-1a2b3c`), rồi **chèn một `<style>` vào `<head>`**:

```html
<head>
  <style data-styled>.sc-kFuwaP { color: red; }</style>  ← chèn lúc runtime
</head>
<body>
  <h2 class="sc-kFuwaP">Xin chào</h2>
</body>
```

- **Cơ chế thật:** vẫn là **class toàn cục nằm trong `<head>`**. Chỉ khác chỗ: tên do runtime sinh, và CSS có thể phụ thuộc props.
- **Ưu:** style gắn liền component, style động theo props/theme rất tự nhiên, tự dead-code-elimination theo component.
- **Nhược:**
  - **Chi phí runtime**: parse template, băm, chèn stylesheet — tốn ở lần render đầu, và nếu style phụ thuộc props thì tốn lại mỗi lần đổi.
  - **Không hợp React Server Components**: thư viện CSS-in-JS chạy bằng React context + hook nên chỉ dùng được trong Client Component; với App Router phải dựng thêm một *style registry* để gom CSS khi streaming SSR. Xu hướng gần đây là dịch chuyển sang các giải pháp **zero-runtime** (biên dịch ra CSS tĩnh lúc build) chính vì lý do này.
- **Encapsulation thật?** ❌ Không.

### 4. Tailwind

```jsx
<h2 className="text-red-500 font-semibold text-2xl">Xin chào</h2>
```

- **Cơ chế thật:** một tập **utility class toàn cục**. `.text-red-500` là class global, không scope gì hết. Điều làm nó ít xung đột là tính **atomic**: mỗi class chỉ set 1–2 thuộc tính và tên gắn liền giá trị, nên hai chỗ dùng `.text-red-500` thì đằng nào cũng muốn cùng một thứ.
- **Ưu:** không phải nghĩ tên class, CSS output không phình theo số component, đọc component là biết ngay style.
- **Nhược:** JSX dài; vẫn dính global reset (preflight) và vẫn bị `!important` từ bên ngoài đè; component nhìn "bẩn" nếu không tách.
- **Encapsulation thật?** ❌ Không (và Tailwind cũng chưa bao giờ nhận là có).

### 5. `style={{ }}` inline

```jsx
<h2 style={{ color: 'red' }}>Xin chào</h2>
```

- **Cơ chế thật:** React set thẳng vào `element.style` — thuộc tính nằm trong attribute `style` của **đúng node đó**, không qua stylesheet nào.
- **Ưu:** đây là cách **duy nhất** trong danh sách thật sự chỉ áp cho một node; giá trị tính bằng JS (vị trí tooltip, chiều rộng progress bar) rất tiện.
- **Nhược:**
  - **Không có** `:hover`, `:focus`, `::before`, `@media`, `@keyframes`.
  - **Specificity rất cao** (inline thắng gần như mọi selector), nên muốn override phải dùng `!important` — dễ thành nợ kỹ thuật.
  - Tạo object mới mỗi lần render.
- **Encapsulation thật?** ⚠️ Một nửa: CSS của bạn không rò ra ngoài, nhưng CSS ngoài vẫn kế thừa/đặt nền vào node đó, và `!important` từ ngoài vẫn thắng được inline.

### Bảng tổng hợp

| Cách | Cơ chế thật | Build hay runtime | Chặn CSS **ngoài chọc vào**? | Chặn CSS **mình rò ra**? |
| --- | --- | --- | --- | --- |
| Global CSS / BEM | Quy ước đặt tên | — | ❌ Không | ❌ Không |
| CSS Modules | Băm tên class lúc build | Build | ❌ **Không** | ✅ Có (nhờ tên duy nhất) |
| CSS-in-JS | Băm tên + chèn `<style>` vào `<head>` | Runtime (hoặc build nếu zero-runtime) | ❌ **Không** | ✅ Có |
| Tailwind | Utility class toàn cục | Build (quét class) | ❌ Không | ❌ Không (class dùng chung) |
| `style={{}}` inline | Set `element.style` | Runtime | ⚠️ Gần như — nhưng thua `!important` | ✅ Có |
| **Shadow DOM** (note 10) | **Browser từ chối khớp qua ranh giới** | **Runtime, do browser** | ✅ **Có** | ✅ **Có** |

👉 Nhìn cột thứ 4: **cả cột đều ❌**. Đó là toàn bộ luận điểm của bài này.

---

## 🔍 Thí nghiệm chứng minh

Giả sử bạn đã dùng CSS Modules — cách "scoped" nhất trong hệ React.

```jsx
// Card.jsx
import s from './Card.module.css';
export default function Card() {
  return <div className={s.card}><h2 className={s.title}>Xin chào</h2></div>;
}
```
```css
/* Card.module.css */
.card  { padding: 16px; box-sizing: border-box; }
.title { color: #111; }
```

DOM thật sinh ra:

```html
<div class="Card_card__a1b2c">
  <h2 class="Card_title__d3e4f">Xin chào</h2>
</div>
```

Bây giờ, ở **bất kỳ** file CSS nào khác trong document — file của trang chủ nhà, của một thư viện, của một quảng cáo nhúng:

```css
/* CSS ở ngoài, không liên quan gì tới component của bạn */
div  { border: 1px solid red !important; }   /* → viền đỏ quanh Card */
*    { box-sizing: content-box; }            /* → phá layout: padding cộng thêm */
h2   { color: hotpink; }                     /* → có ăn không? xem bên dưới */
```

Kết quả:

| Selector ngoài | Có chọc vào Card không | Vì sao |
| --- | --- | --- |
| `div { ... !important }` | ✅ **Có** | Class bị băm không cứu được — selector này nhắm vào **tag**, và `!important` thắng cả specificity cao hơn |
| `* { box-sizing: content-box }` | ✅ **Có** | `*` khớp mọi node. Dòng `box-sizing` trong `.card` cùng file cứu được `.card`, nhưng **mọi node con** bạn quên khai báo thì dính |
| `h2 { color: hotpink }` | ❌ Không đổi màu chữ | Ở đây `.Card_title__d3e4f` (specificity `0,1,0`) thắng `h2` (`0,0,1`) — **nhưng chỉ vì bạn tình cờ có khai báo `color`**. Thuộc tính nào bạn không set thì `h2 { letter-spacing: 3px }` vẫn ăn ngay |

Và chiều ngược lại cũng đúng: một **global reset** trong app của bạn…

```css
/* app.css */
button { all: unset; }
input  { font-family: inherit; }
```

…sẽ chọc thẳng vào mọi `<button>` do **thư viện component** render ra, dù thư viện đó dùng CSS Modules chuẩn chỉnh. Đây chính là loại bug "cài thư viện xong nút của nó mất hết style" mà ai cũng từng gặp.

> **Kết luận thí nghiệm:** class băm chỉ bảo vệ bạn khỏi **trùng tên**. Nó không bảo vệ bạn khỏi **tag selector, universal selector, attribute selector, thuộc tính kế thừa, và `!important`**.

---

## ⚠️ Vì sao điều này thành vấn đề thật

Trong một SPA bạn tự làm chủ 100%, chuyện trên **hiếm khi đau**: bạn kiểm soát mọi dòng CSS, có lỗi thì sửa.

Nó thành vấn đề nghiêm trọng khi bạn **phát hành một widget nhúng vào trang của người khác**:

```
  ┌──────────── Trang của KHÁCH HÀNG ─────────────────────┐
  │  CSS của họ: bootstrap 3 + theme riêng + 4 plugin     │
  │  * { box-sizing: content-box }                        │
  │  div { line-height: 1.8 !important }                  │
  │  .btn { border-radius: 0 !important }                 │
  │                                                        │
  │      ┌──── Widget CỦA BẠN ─────┐                       │
  │      │  bị mọi dòng trên       │  ← bạn KHÔNG kiểm soát│
  │      │  chọc thẳng vào         │     CSS bên ngoài      │
  │      └─────────────────────────┘                       │
  └────────────────────────────────────────────────────────┘
```

Các tình huống thực tế:
- **Shopify app / theme extension** — nhúng vào theme của merchant, mỗi merchant một bộ CSS khác nhau.
- **Chat widget / support bubble** (kiểu Intercom, Crisp) — nhúng vào hàng nghìn site lạ.
- **Embed** bình luận, thanh toán, bản đồ, lịch đặt chỗ.
- **Design system dùng chung** cho nhiều team, nhiều app cũ mới lẫn lộn.

Ở những bối cảnh này, "đặt tên khéo" là không đủ. Bạn cần một cơ chế mà **browser** thực thi. Đó chính xác là lý do Shadow DOM tồn tại.

---

## 🔍 Nhử sang note 10: "đổi tên" vs "shadow boundary"

| | Đổi tên class (CSS Modules / CSS-in-JS) | Shadow boundary |
| --- | --- | --- |
| **Ai thực thi** | Build tool hoặc thư viện JS | **Chính browser**, ở bước khớp selector |
| **Thực thi lúc nào** | Lúc build / lúc render | Lúc dựng render tree — không bypass được |
| **Chặn CSS ngoài chọc vào** | ❌ | ✅ (trừ thuộc tính kế thừa như `color`, `font`, và CSS custom properties — cố ý cho đi qua) |
| **Chặn CSS mình rò ra** | ✅ (chỉ nhờ tên duy nhất) | ✅ (theo cơ chế, không phải nhờ may) |
| **`div { ... !important }` từ ngoài** | Trúng | **Không trúng** |
| **`document.querySelector('.title')`** | Tìm thấy | Không thấy (node nằm trong shadow tree) |
| **Vượt rào có chủ đích** | Không cần | Qua CSS custom properties, `::part()`, `::slotted()` |
| **Trả giá** | Gần như không | Style toàn cục/Tailwind **không** lọt vào; phải chủ động mở API style; DevTools thêm một lớp |

Chi tiết cơ chế, ai chặn ai và chặn ở đâu: [[10 - Shadow DOM - Cay trong cay va ranh gioi that su]].

---

## ✅ Công bằng cho React: cái "global" cũng có giá của nó

Đừng đọc bài này thành "React kém". Không có encapsulation cũng là một **đánh đổi có lợi** trong rất nhiều trường hợp:

| Ưu điểm của mô hình CSS toàn cục | Vì sao |
| --- | --- |
| **Design token dùng chung dễ** | Một khối `:root { --brand: #2563eb }` là cả app dùng được ngay, không cần khai báo lại cho từng component |
| **Đổi theme toàn cục dễ** | Thêm class `.dark` lên `<html>` là mọi component đổi theo — không cần bơm biến qua từng ranh giới |
| **Tailwind / utility CSS chạy ngon** | Utility class cần đến được mọi node. Trong shadow root thì mặc định **không tới được** — đây là điểm đau kinh điển của Web Components |
| **Không cần nghĩ chuyện "style không lọt vào"** | Dùng thư viện UI bên ngoài, tuỳ biến CSS của nó, viết override — tất cả đều là CSS thường |
| **DevTools dễ debug** | Một cây DOM phẳng, một CSSOM. Không phải mở từng shadow root để dò |
| **Server-render CSS trưởng thành** | CSS Modules / Tailwind xuất file `.css` tĩnh, cache tốt, không cần JS để có style |

Nói gọn: **global CSS tối ưu cho "một app do một team làm chủ"; shadow boundary tối ưu cho "một mảnh UI sống trong lãnh thổ người lạ".** Chọn theo bối cảnh, không có cái nào đúng tuyệt đối.

---

## 🧠 Platform đang đi về đâu: `@scope` và `:has()`

CSS thuần đang bổ sung công cụ cho chính vấn đề này.

### `@scope`

```css
@scope (.card) to (.card-content) {
  h2 { color: red; }   /* chỉ khớp h2 trong .card, và DỪNG lại ở .card-content */
}
```

- Cho phép giới hạn phạm vi khớp selector **theo cây DOM**, và có **giới hạn dưới** (`to ...`) — thứ mà specificity không làm được.
- ⚠️ **Quan trọng:** `@scope` giới hạn **CSS của bạn**, tức là chống **rò ra ngoài**. Nó **không** ngăn CSS người khác chọc vào bạn. Xét theo bảng ở trên, nó vẫn nằm ở cột "đổi tên/giới hạn", không phải "rào chắn".
- **Hỗ trợ:** đã có trong các trình duyệt nhân Chromium và Safari bản gần đây, Firefox bổ sung sau. Trước khi dùng production hãy kiểm tra MDN/caniuse cho nhóm người dùng của bạn, và cân nhắc fallback.

### `:has()`

```css
.card:has(> img) { padding: 0; }        /* card nào CÓ ảnh thì bỏ padding */
form:has(input:invalid) { border-color: red; }
```

- "Parent selector" mà CSS thiếu suốt 20 năm. Cho phép style cha dựa trên con — trước đây phải làm bằng JS + state React.
- **Hỗ trợ:** đã có ở tất cả trình duyệt lớn phiên bản hiện đại; vẫn nên kiểm tra ngưỡng hỗ trợ tối thiểu của dự án.
- ⚠️ Nó **không** liên quan gì đến encapsulation — chỉ là selector mạnh hơn. Nhắc ở đây vì nó thường bị gộp chung vào "CSS hiện đại giải quyết mọi thứ rồi". Không, nó giải quyết chuyện khác.

> Cùng nhóm đáng theo dõi: **CSS Cascade Layers** (`@layer`) — quản lý thứ tự ưu tiên giữa reset / thư viện / app một cách tường minh, giảm nhu cầu dùng `!important`. Cũng vẫn không phải encapsulation.

---

## ⚠️ Bẫy thường gặp

1. **Tưởng CSS Modules là encapsulation.** Nó là name mangling. Bảng ở trên, cột "chặn CSS ngoài chọc vào" là ❌. Đây là hiểu nhầm phổ biến nhất về CSS trong React.
2. **Global reset đè component thư viện.** `button { all: unset }` trong `app.css` sẽ phá nút của mọi thư viện UI bạn cài. Reset càng rộng càng nguy hiểm; ưu tiên nhắm class cụ thể hoặc dùng `@layer`.
3. **Quên `box-sizing` trong component nhúng.** Nếu widget của bạn sống trong trang người khác mà họ set `* { box-sizing: content-box }`, layout của bạn vỡ. Component nhúng nên tự set lại cho gốc **và** con của mình.
4. **Đua `!important`.** Bị đè → thêm `!important` → người sau lại thêm `!important` nữa. Đây là triệu chứng của thiếu encapsulation, không phải giải pháp. Cân nhắc `@layer` hoặc, đúng bối cảnh, Shadow DOM.
5. **Dùng inline style cho mọi thứ để "cho chắc".** Mất `:hover`/`:focus`/`@media`, mất khả năng override, và tạo object mới mỗi render. Inline chỉ nên dùng cho **giá trị tính bằng JS**.
6. **Nghĩ CSS-in-JS "an toàn hơn" CSS Modules về mặt cô lập.** Không. Cả hai đều kết thúc bằng một class toàn cục trong cùng một CSSOM; khác nhau ở lúc sinh tên và chi phí runtime, không khác nhau ở mức bảo vệ.
7. **Bê nguyên Tailwind vào Web Component có shadow root.** Class toàn cục không đi xuyên qua shadow boundary. Đây là lỗi số 1 khi chuyển từ React sang Web Components — chi tiết ở note 10.

---

## ✅ Nhớ 5 điều

1. **CSS trên web mặc định là global**, và React không thay đổi điều đó — React chỉ tạo node rồi set `className`.
2. **"Scoped CSS" trong hệ React = đổi tên, không phải rào chắn.** CSS Modules băm tên lúc build; CSS-in-JS băm tên rồi chèn `<style>` vào `<head>`. Cả hai đều nằm chung một CSSOM.
3. **Không cách nào trong hệ React chặn được CSS bên ngoài chọc vào.** `div{...!important}`, `*{}`, tag selector và thuộc tính kế thừa luôn đi qua.
4. **Chỉ đau khi bạn không sở hữu trang.** Widget nhúng, Shopify app, embed — đó là lúc cần rào chắn do **browser** thực thi, tức Shadow DOM.
5. **Global cũng có ưu điểm thật:** design token, theme, Tailwind, DevTools, SSR CSS đều dễ hơn. Đây là đánh đổi, không phải khuyết tật.

---

## 📚 Nguồn

- [MDN — Cascade, specificity, and inheritance](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_cascade/Cascade)
- [MDN — `@scope`](https://developer.mozilla.org/en-US/docs/Web/CSS/@scope)
- [MDN — `:has()`](https://developer.mozilla.org/en-US/docs/Web/CSS/:has)
- [MDN — Cascade layers (`@layer`)](https://developer.mozilla.org/en-US/docs/Web/CSS/@layer)
- [CSS Modules — README chính thức](https://github.com/css-modules/css-modules)
- [Vite — CSS Modules](https://vite.dev/guide/features#css-modules)
- [styled-components — Documentation](https://styled-components.com/docs)
- [Emotion — Introduction](https://emotion.sh/docs/introduction)
- [Tailwind CSS — Styling with utility classes](https://tailwindcss.com/docs/styling-with-utility-classes)
- [React — `style` prop trên DOM component](https://react.dev/reference/react-dom/components/common#applying-css-styles)
- [MDN — Using shadow DOM](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM)
