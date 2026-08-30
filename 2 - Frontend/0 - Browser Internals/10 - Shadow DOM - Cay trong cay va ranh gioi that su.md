# 10 — Shadow DOM: cây trong cây và ranh giới thật sự

> **TL;DR:** Note 08 kết luận: mọi giải pháp CSS của React — CSS Modules, styled-components, Tailwind — chỉ **đổi tên class** cho khỏi đụng nhau, chứ không dựng được rào chắn nào. Shadow DOM thì khác về bản chất: `attachShadow()` tạo một **cây DOM riêng**, và **chính style engine của browser** từ chối cho selector đi xuyên qua ranh giới đó, ngay tại bước matching selector. Không phải build tool, không phải JS, không phải hash tên class — đây là encapsulation **thật**, do spec bảo đảm. Cái giá: global CSS cũng không lọt vào, Tailwind vướng, ARIA không trỏ xuyên biên, và JS phải đi qua `shadowRoot`.

Series: [[00 - Roadmap - Tu HTML den Pixel]]
Anh em: [[08 - React - CSS va chuyen khong co encapsulation]] · [[09 - Web Components - Truy vet mot custom element tu HTML den pixel]] · [[11 - So sanh truc tiep - React vs Web Components]] · [[Glossary/D - Web Components va DOM nang cao|Glossary D]]

---

## 🎯 Câu hỏi note này trả lời

- Có cách nào **thật sự** chặn CSS ngoài lọt vào component không, hay chỉ là quy ước đặt tên?
- **Ai** chặn? Ở bước nào trong pipeline của note 01?
- `<slot>` có **di chuyển** nội dung vào trong shadow tree không? (Không — và đây là hiểu lầm phổ biến nhất.)
- Cái gì **xuyên qua được** ranh giới, cái gì không?
- Vì sao `CustomEvent` của tôi không nổi ra ngoài được?
- Vì sao `document.querySelector('button')` không tìm thấy nút của tôi?
- Vì sao Tailwind + shadow DOM lại đau đầu đến thế?

---

## 🧠 Phần 1 — Nhắc lại vấn đề từ note 08

Note 08 nói: CSS trong browser vốn **global**. Một dòng

```css
.title { color: red; }
```

viết ở bất cứ đâu cũng áp lên **mọi** `.title` trong document. Không có scope. Và mọi giải pháp phổ biến chỉ né chứ không chặn:

| Giải pháp | Thực chất làm gì | Có rào chắn không? |
| --- | --- | --- |
| BEM (`.card__title`) | Quy ước đặt tên, do **con người** giữ | ❌ |
| CSS Modules | Build tool đổi `.title` → `.title_a3f9x` | ❌ |
| styled-components / Emotion | Sinh class hash lúc runtime | ❌ |
| Tailwind | Không đặt tên nữa, dùng utility toàn cục | ❌ (ngược lại: **cố ý** global) |
| Vue `<style scoped>` | Thêm attribute `[data-v-abc]` vào selector | ❌ |

Tất cả đều là **`.title` đổi thành một cái tên khác**. Selector vẫn chạy trên đúng một cây DOM, vẫn match được mọi thứ nếu bạn viết đúng tên. Ai đó viết `* { border: 1px solid red }` hay `div span { margin: 0 }` là component của bạn dính ngay.

**Câu hỏi:** có cách nào để dù ai viết selector gì đi nữa, nó **không thể** chạm vào bên trong component?

**Có.** Và nó không nằm ở tầng thư viện — nó nằm ở tầng browser.

---

## ⚙️ Phần 2 — `attachShadow()` tạo một cây con riêng

```js
const shadow = host.attachShadow({ mode: 'open' });
```

Một dòng này gắn vào element `host` một **`ShadowRoot`** — một node gốc mới, kiểu `DocumentFragment`, mở đầu một **cây DOM độc lập**.

Từ đây bạn phải phân biệt **ba cây**. Đây là hình quan trọng nhất của cả bài.

### Ví dụ `<my-card>` có slot

```html
<!-- ① LIGHT DOM: cái người DÙNG component viết trong HTML -->
<my-card>
  <h2 slot="title">Báo cáo quý 3</h2>
  <p>Doanh thu tăng 12%.</p>
  <p>Chi phí giảm 4%.</p>
</my-card>
```

```js
// ② SHADOW DOM: cái người VIẾT component dựng bên trong
class MyCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).innerHTML = `
      <style>
        :host { display: block; border: 1px solid #ddd; border-radius: 8px; }
        header { padding: .75rem 1rem; border-bottom: 1px solid #eee; }
        .body  { padding: 1rem; }
      </style>
      <header><slot name="title">Không có tiêu đề</slot></header>
      <div class="body"><slot></slot></div>`;
  }
}
customElements.define('my-card', MyCard);
```

### Ba cây, vẽ ra cho rõ

```
① LIGHT DOM — cây document thật, cái bạn thấy trong "View Source"
   Đây là con RUỘT của <my-card>.

   <my-card>
      ├── <h2 slot="title">Báo cáo quý 3</h2>
      ├── <p>Doanh thu tăng 12%.</p>
      └── <p>Chi phí giảm 4%.</p>


② SHADOW DOM — cây riêng, treo dưới #shadow-root, KHÔNG phải con của <my-card>
   Nằm ngoài document tree. document.querySelector không thấy.

   <my-card>
      └── #shadow-root (open)
             ├── <style>…</style>
             ├── <header>
             │      └── <slot name="title">   ← một "cửa sổ"
             └── <div class="body">
                    └── <slot>                 ← "cửa sổ" mặc định


③ FLATTENED TREE — cái browser THỰC SỰ đem đi layout & paint
   Ghép ① và ② lại: mỗi <slot> được thay bằng nội dung được gán vào nó.

   <my-card>
      └── #shadow-root
             ├── <header>
             │      └── ⟦slot "title"⟧
             │             └── <h2>Báo cáo quý 3</h2>      ← từ cây ①
             └── <div class="body">
                    └── ⟦slot mặc định⟧
                           ├── <p>Doanh thu tăng 12%.</p>  ← từ cây ①
                           └── <p>Chi phí giảm 4%.</p>     ← từ cây ①
```

Bước từ ① + ② sang ③ gọi là **flattening**, và nó xảy ra ngay trước bước dựng render tree ([[01 - Tu URL den Pixel - Vong doi mot trang web]]). Render tree, layout, paint, composite — tất cả đều làm việc trên **cây phẳng ③**, không phải cây ① hay ②.

| Cây | Ai viết | `document.querySelector` thấy? | Được đem đi render? |
| --- | --- | --- | --- |
| ① Light DOM | Người **dùng** component | ✅ Có | Chỉ phần được gán vào slot |
| ② Shadow DOM | Người **viết** component | ❌ Không | ✅ |
| ③ Flattened | Browser tự ghép | Không truy cập trực tiếp được | ✅ **Đây mới là cái được vẽ** |

---

## 🔍 Phần 3 — `<slot>` là "cửa sổ", không phải "cái hộp"

Hiểu lầm phổ biến nhất: *"nội dung của tôi bị chuyển vào trong shadow root"*. **Sai.**

> Nội dung light DOM **không hề bị di chuyển**. Nó vẫn nguyên vị trí cũ trong cây document, vẫn là con ruột của host. `<slot>` chỉ nói cho browser biết **vẽ nó ở đâu** trong cây phẳng.

Nghĩ về `<slot>` như một **cái cửa sổ nhìn xuyên tường**, không phải cái hộp để nhét đồ vào.

### Chứng minh bằng code — chạy được ngay trong Console

```js
const card = document.querySelector('my-card');

// ① Nội dung VẪN là con ruột của host, không đi đâu cả
card.children.length;                          // 3
card.querySelector('h2').textContent;          // "Báo cáo quý 3"
card.querySelector('h2').parentElement;        // <my-card>  ← vẫn ở đây!

// ② Shadow root KHÔNG chứa nó
card.shadowRoot.querySelector('h2');           // null
card.shadowRoot.children.length;               // 3 (style, header, div.body)

// ③ Ngược lại: document KHÔNG thấy nội dung shadow
document.querySelector('header');              // null
card.shadowRoot.querySelector('header');       // <header>  ← phải đi qua shadowRoot

// ④ Hỏi cái slot xem nó đang chiếu những gì
const slot = card.shadowRoot.querySelector('slot:not([name])');
slot.assignedElements();                       // [<p>, <p>]
slot.assignedNodes();                          // gồm cả text node (khoảng trắng)
slot.assignedElements({ flatten: true });       // trả fallback nếu slot rỗng

// ⑤ Từ một node bất kỳ, hỏi nó đang ở cây nào
card.querySelector('h2').getRootNode();         // #document
card.shadowRoot.querySelector('header').getRootNode();          // #shadow-root
card.shadowRoot.querySelector('header').getRootNode({composed:true}); // #document
```

**So với React một dòng:** `props.children` là **dữ liệu** được truyền vào, component nhận rồi tự quyết định đem đi đâu (note 05). `<slot>` là **vị trí chiếu** — nội dung không bao giờ rời khỏi chỗ của nó trong cây document, chỉ được browser vẽ ở nơi khác.

Hệ quả quan trọng: **CSS của document VẪN áp lên nội dung slotted**, vì nó vẫn nằm trong document tree. Ranh giới chỉ chặn theo một chiều bạn tưởng, còn phần này thì không.

### Named slot, default slot, fallback

```html
<my-card>
  <h2 slot="title">Tiêu đề</h2>   <!-- vào <slot name="title"> -->
  <p>Nội dung</p>                 <!-- không có slot= → vào <slot> mặc định -->
  <span slot="ghost">?</span>     <!-- slot không tồn tại → KHÔNG được vẽ -->
</my-card>
```

| Luật | Chi tiết |
| --- | --- |
| Gán theo `slot="tên"` | Khớp với `<slot name="tên">` |
| Không có `slot=` | Vào `<slot>` không tên (default slot) |
| Nhiều node cùng tên | Tất cả cùng vào, giữ nguyên thứ tự trong light DOM |
| Không khớp slot nào | **Không được render** (biến mất khỏi cây phẳng, nhưng vẫn trong DOM) |
| Slot rỗng | Nội dung bên trong `<slot>…</slot>` được dùng làm **fallback** |
| Chỉ con **trực tiếp** của host mới gán được | `<div slot="title">` lồng 2 tầng thì vô hiệu |

### `slotchange` — biết khi nội dung đổi

```js
connectedCallback() {
  const slot = this.shadowRoot.querySelector('slot[name="title"]');
  slot.addEventListener('slotchange', () => {
    const els = slot.assignedElements();
    this.shadowRoot.querySelector('header').hidden = els.length === 0;
  });
}
```

`slotchange` bắn khi tập node được gán vào slot thay đổi. Lưu ý: nó **không** bắn khi nội dung *bên trong* một node đã gán bị sửa — muốn theo dõi cái đó phải dùng `MutationObserver`.

---

## 🛡️ Phần 4 — AI chặn CSS? Trả lời thẳng

> **Chính style engine của browser chặn, ở bước matching selector.** Không phải build tool. Không phải JavaScript. Không phải đổi tên class.

Nhớ lại pipeline note 01: sau khi có DOM và CSSOM, browser phải **ghép** hai thứ đó lại — với mỗi element, duyệt các rule CSS xem selector nào match. Chính tại bước này, spec CSS Scoping quy định:

```
   ┌──────────────── DOCUMENT TREE ───────────────────┐
   │                                                   │
   │   <style>                                         │
   │     .title  { color: red }        ──┐              │
   │     * { box-sizing: border-box }  ──┤              │
   │     div span { margin: 0 }        ──┤              │
   │   </style>                          │              │
   │                                     │              │
   │   <my-card>                         │              │
   │  ═══════════════════════════════════▼════════════  │
   │  ║        S H A D O W   B O U N D A R Y      🛑 ║  │  selector DỪNG Ở ĐÂY
   │  ═══════════════════════════════════════════════  │
   │      #shadow-root                                  │
   │         <style>                                    │
   │           header { padding: 1rem }  ──┐             │
   │         </style>                      │             │
   │         <header class="title">        │             │
   │            ▲                          │             │
   │            └── chỉ rule TRONG shadow  ◄┘            │
   │                mới match được nó                    │
   │                                                     │
   │  ═══════════════════════════════════════════════   │
   │  ║   🛑 selector trong shadow cũng KHÔNG ra ngoài ║ │
   │  ═══════════════════════════════════════════════   │
   └───────────────────────────────────────────────────┘
```

Hai chiều, cả hai đều bị chặn:

| Hướng | Ví dụ | Kết quả |
| --- | --- | --- |
| Ngoài → trong | `.title { color: red }` ở document | ❌ Không chạm `<header class="title">` trong shadow |
| Ngoài → trong | `* { box-sizing: border-box }` | ❌ Không lọt vào — kể cả `*` |
| Trong → ngoài | `header { padding: 1rem }` trong shadow | ❌ Không chạm `<header>` nào ngoài document |

**Vì sao khác hẳn note 08?**

| | CSS Modules / styled-components (note 08) | Shadow DOM (note này) |
| --- | --- | --- |
| Cơ chế | Đổi `.title` → `.title_a3f9x` | Selector **không được phép** đi qua boundary |
| Ai thực thi | Build tool / thư viện runtime | **Browser**, ở bước matching selector |
| `* { … }` có lọt vào? | ✅ Có | ❌ Không |
| `!important` từ ngoài có xuyên vào? | ✅ Có | ❌ Không (trừ khi nhắm vào chính host) |
| Bỏ build tool đi thì sao? | Sập, không còn scope | Vẫn hoạt động nguyên vẹn |
| Bản chất | **Quy ước đặt tên** | **Ranh giới do spec bảo đảm** |

Đây là điểm mà Web Components có thứ React (và Vue, Svelte…) về nguyên tắc không tự làm được: **encapsulation thật, ở tầng platform**.

---

## 🚪 Phần 5 — Cái gì XUYÊN QUA được boundary

Nếu chặn tuyệt đối thì component sẽ không thể tuỳ biến được. Spec để lại đúng bốn cửa, và bạn phải mở chúng **có chủ đích**.

### Bảng tổng — dán lên tường

| Thứ | Xuyên qua? | Ghi chú |
| --- | --- | --- |
| **Inherited properties** (`color`, `font-family`, `font-size`, `line-height`, `letter-spacing`, `text-align`, `visibility`, `cursor`, `white-space`, `list-style`…) | ✅ | Kế thừa đi theo **cây phẳng**, boundary không chặn kế thừa |
| **CSS custom properties** (`--brand`) | ✅ | Cũng là inherited → đây là **API tạo hình chính** |
| `::part(name)` | ✅ | Cửa sổ mở **có chủ đích** từ trong ra |
| `::slotted(sel)` | ✅ | Style nội dung do bên ngoài nhét vào |
| `:host`, `:host(sel)` | ✅ | Style chính element host, viết từ **bên trong** |
| Class thường `.title` | ❌ | Chặn |
| ID `#header` | ❌ | Chặn. ID trong shadow là một **scope riêng**, không đụng ID ngoài |
| Selector con `.card .title` | ❌ | Chặn |
| Global reset `* { box-sizing: border-box }` | ❌ | **Mỗi shadow root phải tự lo reset của mình** |
| `@font-face` | ⚠️ | Định nghĩa ở document thì shadow **dùng được** (font là tài nguyên document-level) |
| `@keyframes` | ❌ | Phải khai báo trong chính shadow root đó |
| Tailwind utility class | ❌ | Xem mục riêng bên dưới |

### 1. Inherited properties — cửa lớn nhất, hay bị quên

```css
/* document */
body { font-family: system-ui; color: #333; line-height: 1.6; }
```

Ba dòng này **áp thẳng** vào mọi text trong mọi shadow root. Đây là hành vi mong muốn: component vẫn hoà vào typography của trang.

Nhưng cẩn thận với các element form — chúng **không kế thừa font** theo mặc định của UA stylesheet. Trong shadow root nhớ:

```css
button, input, select, textarea { font: inherit; color: inherit; }
```

### 2. CSS custom properties — API tạo hình chính thức

Đây là cách **đúng** để cho phép tuỳ biến component:

```css
/* Bên TRONG shadow root — khai báo API và giá trị mặc định */
:host {
  display: block;
  background: var(--card-bg, #fff);
  border-radius: var(--card-radius, 8px);
  padding: var(--card-padding, 1rem);
}
```

```css
/* Bên NGOÀI — người dùng component chỉnh */
my-card {
  --card-bg: #f7f7f7;
  --card-radius: 16px;
}
.dark-theme { --card-bg: #1e1e1e; }   /* kế thừa xuống, đổi cả theme */
```

Custom property là inherited property → nó chảy xuống qua boundary tự nhiên. **Đây là hợp đồng công khai của component**: bạn quyết định mở đúng những biến nào, phần còn lại vẫn kín.

### 3. `::part()` — mở cửa sổ có chủ đích

```html
<!-- trong shadow root -->
<button part="close-button" class="btn btn--icon">×</button>
```

```css
/* ngoài document — style được, nhưng chỉ đúng cái đã gắn part -->  */
my-dialog::part(close-button) {
  background: crimson;
  border-radius: 50%;
}
```

Đặc điểm:

- Bạn **chỉ style được** những gì component chủ động đánh dấu `part` → nó là API, có thể giữ ổn định qua các version.
- **Không** viết được selector con: `::part(x) .icon` vô hiệu (nhưng `::part(x):hover` thì được).
- Muốn "chuyển tiếp" part từ component lồng bên trong ra ngoài: dùng `exportparts`.

### 4. `::slotted()` — style nội dung người khác nhét vào

```css
/* trong shadow root */
::slotted(p)          { margin: 0 0 .5rem; }
::slotted(h2)         { font-size: 1.25rem; }
::slotted(.highlight) { background: yellow; }
```

Hai giới hạn phải nhớ:

- Chỉ match **node cấp cao nhất** được gán vào slot. `::slotted(p span)` hoặc `::slotted(p) span` đều **không** chạy.
- Style từ **document luôn thắng** style `::slotted()` với declaration thường — vì node đó thuộc document tree, và theo luật cascade, tree ngoài thắng tree trong (với `!important` thì ngược lại). Đừng ngạc nhiên khi `::slotted()` bị đè.

### 5. `:host` và `:host()`

```css
:host              { display: block; }         /* chính <my-card> */
:host([disabled])  { opacity: .5; pointer-events: none; }
:host(.featured)   { border-color: gold; }
:host([hidden])    { display: none; }          /* ❗ bắt buộc, xem note 09 */
```

⚠️ **`:host` có specificity rất thấp** so với selector từ document. `my-card { display: flex }` viết ở document sẽ **đè** `:host { display: block }`. Đây là cố ý: người dùng component có quyền quyết định cuối cùng về chính cái host.

⚠️ **`:host-context()` — đừng dùng cho project mới.** Nó đã bị **gỡ khỏi CSS Scoping spec**, chỉ Chromium hỗ trợ; Firefox và Safari thì không. Muốn làm theme, dùng custom property kế thừa xuống (`.dark-theme { --card-bg: … }`) — cách này chạy ở mọi browser.

### 6. Tailwind + Shadow DOM — vì sao đau đầu

Tailwind hoạt động bằng cách sinh ra **một stylesheet global** chứa hàng nghìn class utility (`.p-4`, `.flex`, `.text-sm`…). Stylesheet đó nằm ở document. Shadow boundary chặn nó. Nên:

```html
<my-card>
  <p class="p-4 text-blue-500">Cái này ĂN Tailwind ✅ (nó ở light DOM)</p>
</my-card>
```

```js
// Nhưng bên trong shadow root:
shadow.innerHTML = `<div class="p-4 text-blue-500">Cái này KHÔNG ăn ❌</div>`;
```

Ba hướng xử lý, chọn theo hoàn cảnh:

| Hướng | Cách làm | Đánh đổi |
| --- | --- | --- |
| **A. Không dùng Tailwind trong shadow** | Viết CSS thật trong shadow, phơi ra ngoài bằng CSS custom property + `::part()` | Sạch nhất, đúng tinh thần Web Components; phải viết CSS tay |
| **B. Inject stylesheet vào từng shadow root** | Build Tailwind ra một `CSSStyleSheet` rồi `shadow.adoptedStyleSheets = [sheet]` (một object sheet dùng chung cho mọi instance, không tốn bộ nhớ) | Được dùng Tailwind; bundle to; cần bước build riêng |
| **C. Bỏ shadow DOM** | Render vào light DOM. Với Lit: `createRenderRoot() { return this; }` | Tailwind chạy ngon; **mất sạch encapsulation** — quay lại đúng vấn đề note 08 |

Nói thẳng: Tailwind và Shadow DOM có **triết lý ngược nhau**. Tailwind cố tình global hoá style; Shadow DOM cố tình cô lập. Chọn một, đừng cố ép cả hai.

---

## 🔒 Phần 6 — JS cũng bị chặn

Ranh giới không chỉ chặn CSS. Nó chặn cả **truy vấn DOM**.

```js
// ❌ Không thấy gì
document.querySelector('my-card header');     // null
document.querySelectorAll('button').length;   // không tính nút trong shadow
document.getElementById('title');             // không thấy id trong shadow

// ✅ Phải đi qua shadowRoot, từng tầng một
const card = document.querySelector('my-card');
card.shadowRoot.querySelector('header');      // <header>

// Component lồng nhau thì phải đi từng nấc
document.querySelector('my-app')
        .shadowRoot.querySelector('my-card')
        .shadowRoot.querySelector('button');
```

Vài API bị "retarget" — trả về **host** thay vì element thật bên trong:

| API | Trả về gì khi element thật nằm trong shadow |
| --- | --- |
| `document.activeElement` | **Host**, không phải input bên trong. Muốn lấy thật: `host.shadowRoot.activeElement` |
| `document.elementFromPoint(x, y)` | **Host** (dùng `shadowRoot.elementFromPoint` để đi sâu) |
| `event.target` (sau khi vượt biên) | **Host** — xem phần 7 |
| `node.getRootNode()` | `#shadow-root` gần nhất. Thêm `{composed: true}` để lên tới `#document` |

**Với E2E test:** Playwright xuyên shadow DOM (open) tự động với CSS selector thường. Cypress cần `includeShadowDom: true` hoặc `.shadow()`. Selenium cổ điển phải lấy `shadowRoot` thủ công. Không có "descendant selector xuyên biên" chuẩn nào cả — `>>>` chỉ là cú pháp riêng của từng tool.

---

## 📡 Phần 7 — Event retargeting

Event vẫn nổi (bubble) từ trong shadow ra ngoài — nhưng browser **giả mạo `event.target`** để không rò rỉ chi tiết nội bộ.

```
   Người dùng click <button> bên trong shadow của <my-card>

   Trong shadow tree:            Ngoài document:
   ─────────────────────         ─────────────────────
   listener trên <header>        listener trên <body>
     event.target = <button>       event.target = <my-card>  ← BỊ ĐỔI
                                                   ▲
                        đây là "retargeting": target
                        luôn là node gần nhất mà listener
                        đó "được phép nhìn thấy"
```

```js
document.body.addEventListener('click', (e) => {
  e.target;              // <my-card>          ← đã bị retarget
  e.composedPath();      // [button, header, #shadow-root, my-card, body, html,
                         //  document, Window]  ← đường đi THẬT, đầy đủ
  e.composedPath()[0];   // <button>  ← muốn biết thật thì lấy phần tử đầu
});
```

`composedPath()` chỉ trả về đường đi đầy đủ khi shadow root là `open`. Với `closed`, phần bên trong bị cắt.

### ❗ Bug kinh điển: `CustomEvent` không ra được

```js
// ❌ Không nổi ra ngoài shadow — đây là lỗi hầu như ai cũng mắc một lần
this.dispatchEvent(new CustomEvent('card-select', {
  detail: { id: 1 },
  bubbles: true,          // nổi lên được... nhưng dừng lại ở shadow boundary
}));

// ✅ Cần CẢ HAI
this.dispatchEvent(new CustomEvent('card-select', {
  detail: { id: 1 },
  bubbles: true,          // ① được phép nổi lên cây
  composed: true,         // ② được phép VƯỢT shadow boundary
}));
```

Hai cờ này độc lập nhau và **cả hai đều mặc định `false`** cho `CustomEvent`. Thiếu `bubbles` → event không đi đâu cả. Thiếu `composed` → event nổi lên trong shadow tree rồi **chết tại `#shadow-root`**, bên ngoài không nghe được gì. Triệu chứng: "listener của tôi không bao giờ chạy, mà console không báo lỗi gì".

### Event nào mặc định `composed`?

| `composed: true` (vượt biên được) | `composed: false` (kẹt trong shadow) |
| --- | --- |
| `click`, `dblclick`, `mousedown/up/move` | `change` ⚠️ |
| `keydown`, `keyup`, `keypress` | `submit`, `reset` ⚠️ |
| `focus`, `blur`, `focusin`, `focusout` | `slotchange` |
| `input`, `beforeinput` | `load`, `error`, `abort` |
| `pointer*`, `touch*`, `wheel` | `scroll` |
| `drag*`, `drop` | `select`, `toggle`, `invalid` |
| | **`CustomEvent` mặc định** ⚠️ |

Ba dòng có ⚠️ là nguồn gốc của phần lớn bug thực tế: `<input>` bên trong shadow bắn `change`, mà code bên ngoài lại đang lắng nghe `change` trên form → không bao giờ nhận được. Cách xử lý: bắt `change` **bên trong** shadow rồi bắn lại một `CustomEvent` có `composed: true`.

---

## 🔓 Phần 8 — `open` vs `closed`

```js
this.attachShadow({ mode: 'open' });    // el.shadowRoot → ShadowRoot
this.attachShadow({ mode: 'closed' });  // el.shadowRoot → null
```

| | `open` | `closed` |
| --- | --- | --- |
| `el.shadowRoot` | Trả về ShadowRoot | `null` |
| `composedPath()` từ ngoài | Thấy đủ | Bị cắt phần trong |
| DevTools | Xem được | Xem được (DevTools không bị chặn) |
| Test E2E | Bình thường | Rất khó |

> **`closed` không phải bảo mật.** Code bên trong component vẫn giữ được reference tới shadow root, và bất cứ ai cũng có thể patch `Element.prototype.attachShadow` trước khi component chạy để thu lại mọi shadow root. Nó chỉ tạo **bất tiện**, không tạo **an toàn**.

Cái nó chắc chắn làm được là gây khó cho chính bạn: không debug được từ console, không test E2E được, không cho người dùng component thoát hiểm khi cần. **Mặc định luôn dùng `open`.** Chỉ cân nhắc `closed` cho widget nhúng vào trang của bên thứ ba, và biết rõ mình đang đánh đổi cái gì.

---

## ⚖️ Phần 9 — Cái giá phải trả (nói thật, không tô hồng)

Encapsulation thật là con dao hai lưỡi. Đây là những thứ **thật sự đau** khi dùng shadow DOM trong production:

| Vấn đề | Chi tiết | Cách sống chung |
| --- | --- | --- |
| **Global CSS / reset không lọt vào** | `normalize.css`, `* { box-sizing }`, design token dạng class — tất cả đứng ngoài | Dùng CSS custom property cho token; mỗi shadow root tự khai `:host { box-sizing: border-box } *, *::before, *::after { box-sizing: inherit }` |
| **Tailwind vướng** | Utility class là global stylesheet | Xem 3 hướng ở Phần 5 |
| **ARIA không trỏ xuyên biên** ⚠️ | `aria-labelledby="x"` chỉ tìm `id="x"` **trong cùng một cây**. Trỏ từ light DOM vào shadow (hoặc ngược lại) → **im lặng thất bại**, không báo lỗi, screen reader không đọc | Giữ cả label và control trong **cùng một cây**; hoặc dùng `ElementInternals` / thuộc tính ARIA element reflection (`ariaLabelledByElements`) — hỗ trợ còn đang lan dần |
| **`<label for>` không xuyên biên** | Cùng lý do: IDREF scoped theo cây | Bọc `<input>` bên trong `<label>`, hoặc để cả hai cùng cây |
| **Form không tự nhận input trong shadow** | `<form>` ngoài không thấy `<input>` trong shadow → không submit, không validate | Dùng **form-associated custom element** (`ElementInternals` + `static formAssociated = true`) — xem [[07 - API nang cao - ElementInternals, Form-associated, DSD]] |
| **SEO / crawler** | Shadow DOM chỉ tồn tại sau khi JS chạy. Crawler không chạy JS → thấy trang rỗng | **Declarative Shadow DOM** cho SSR; hoặc để nội dung quan trọng ở **light DOM** qua slot (crawler đọc được vì nó nằm trong HTML gốc) |
| **Debug khó hơn** | Phải mở từng `#shadow-root`; `Ctrl+F` trong Elements panel không tìm xuyên biên trong mọi trường hợp | Luôn `open`; đặt tên class có nghĩa trong shadow |
| **`position: fixed` / dropdown tràn ra ngoài** | `overflow: hidden` hay `transform` ở tổ tiên vẫn cắt như thường — boundary không giúp gì | Dùng `<dialog>`, Popover API, hoặc `position-anchor` |

### Khi nào NÊN / KHÔNG NÊN dùng shadow DOM

| ✅ NÊN | ❌ KHÔNG NÊN |
| --- | --- |
| Design system / thư viện component dùng chung nhiều team | App nội bộ một team, CSS đã kiểm soát tốt |
| Widget nhúng vào trang của người khác (chat, payment, embed) | Layout page-level (header, sidebar, grid trang) |
| Component phải sống chung với CSS legacy không kiểm soát được | Dự án Tailwind-first |
| Component phát hành ra ngoài (npm), không biết ai dùng | Nội dung cần crawler đọc mà chưa có SSR |
| Cần chắc chắn style không rò rỉ ra ngoài | Cần global theme dày đặc bằng class utility |

**Và nhớ:** custom element **không bắt buộc** phải có shadow DOM. Bỏ `attachShadow()` đi thì bạn vẫn có custom element đầy đủ vòng đời ([[09 - Web Components - Truy vet mot custom element tu HTML den pixel]]), chỉ là style lại global như bình thường. Đây là lựa chọn hoàn toàn hợp lệ và nhiều thư viện chọn nó.

---

## 🧭 Phần 10 — Hai thứ nên biết tên (chi tiết ở note khác)

**Declarative Shadow DOM** — dựng shadow root **từ HTML thuần**, không cần JS. Đây là mảnh ghép cho SSR: server trả về HTML đã có sẵn shadow tree, browser dựng nó ngay lúc parse, trước cả khi custom element được define.

```html
<my-card>
  <template shadowrootmode="open">
    <style>:host { display: block; border: 1px solid #ddd; }</style>
    <header><slot name="title"></slot></header>
    <div class="body"><slot></slot></div>
  </template>
  <h2 slot="title">Có ngay từ HTML, không cần JS</h2>
</my-card>
```

**`adoptedStyleSheets`** — chia sẻ **một object stylesheet duy nhất** cho nhiều shadow root, thay vì nhân bản `<style>` vào từng instance. Tiết kiệm bộ nhớ và parse; đây cũng là cách Lit làm bên trong.

```js
const sheet = new CSSStyleSheet();
sheet.replaceSync(':host { display: block } button { font: inherit }');
// mọi instance dùng CHUNG một object sheet
shadow.adoptedStyleSheets = [sheet];
```

Chi tiết đầy đủ hai thứ này: [[03 - Shadow DOM]] và [[05 - Styling - CSS API cua Component]]. Slot chuyên sâu: [[04 - Template va Slot]].

---

## ⚠️ Bẫy thường gặp

**1. Quên `composed: true` khi bắn `CustomEvent`** — bug số một. Cần **cả** `bubbles` **và** `composed`.

**2. Tưởng `change`/`submit` nổi ra ngoài** — chúng có `composed: false`. Phải bắt bên trong rồi bắn lại.

**3. `document.querySelector` không thấy element trong shadow** — không phải bug, là thiết kế. Đi qua `.shadowRoot`.

**4. `aria-labelledby` trỏ xuyên biên** — **thất bại im lặng**, không có warning nào. Đây là bẫy accessibility nguy hiểm nhất vì bạn không biết mình đã hỏng.

**5. Quên reset trong shadow root**

```css
/* Đặt ở đầu mỗi shadow root */
:host { display: block; box-sizing: border-box; }
*, *::before, *::after { box-sizing: inherit; }
button, input, select, textarea { font: inherit; color: inherit; }
```

**6. `:host` bị đè mà tưởng CSS không chạy** — style từ document nhắm vào host **luôn thắng** `:host` với declaration thường. Đây là spec, không phải bug.

**7. Dùng `:host-context()`** — đã gỡ khỏi spec, Firefox/Safari không có. Dùng custom property kế thừa thay thế.

**8. `::slotted(p span)` hoặc `::slotted(.a .b)`** — không chạy. `::slotted()` chỉ nhận **compound selector** và chỉ match node cấp cao nhất được gán vào slot.

**9. Dùng `mode: 'closed'` để "bảo mật"** — không bảo mật gì cả, chỉ tự làm khó mình.

**10. Đặt `id` trùng nhau giữa shadow root và document rồi hoảng** — không sao cả, ID trong shadow tree là scope riêng. Nhưng cũng vì thế mà mọi thứ dựa trên IDREF (`for`, `aria-*`, `<use href>`) không trỏ xuyên biên được.

---

## ✅ Nhớ 5 điều

- **Có ba cây, không phải một:** light DOM (con ruột của host, người dùng viết), shadow DOM (cây riêng, người viết component dựng), và **flattened tree** — cái browser thật sự đem đi layout và paint. Vẽ được ba cây này là hiểu được 80% shadow DOM.
- **`<slot>` là cửa sổ, không phải cái hộp.** Nội dung light DOM **không bị di chuyển** — nó vẫn là con của host trong DOM, chỉ được **chiếu** vào vị trí slot lúc render. Vì thế CSS của document vẫn áp lên nó.
- **Người chặn CSS là style engine của browser**, ở bước matching selector — không phải build tool, không phải đổi tên class. Đây là khác biệt bản chất so với mọi giải pháp ở note 08: `* { … }` và `!important` từ ngoài cũng không lọt vào.
- **Bốn cửa được mở có chủ đích:** inherited properties (gồm **CSS custom properties** — API tạo hình chính), `::part()`, `::slotted()`, và `:host()`. Ngoài bốn cửa đó, coi như tường kín.
- **Event bị retarget:** `event.target` thành host, dùng `composedPath()` để xem đường thật. `CustomEvent` cần **cả** `bubbles: true` **và** `composed: true` mới vượt biên — thiếu một cái là im lặng không chạy.

---

## 📚 Nguồn

- [DOM Standard — Shadow trees](https://dom.spec.whatwg.org/#shadow-trees)
- [DOM Standard — Retargeting và event dispatch](https://dom.spec.whatwg.org/#retarget)
- [CSS Scoping Module Level 1](https://drafts.csswg.org/css-scoping/)
- [CSS Shadow Parts — `::part()` / `exportparts`](https://drafts.csswg.org/css-shadow-parts/)
- [CSS Cascade Level 5 — Cascade sorting order (context)](https://drafts.csswg.org/css-cascade-5/#cascade-sort)
- [MDN — Using shadow DOM](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM)
- [MDN — Using templates and slots](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_templates_and_slots)
- [MDN — `Element.attachShadow()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/attachShadow)
- [MDN — `:host`](https://developer.mozilla.org/en-US/docs/Web/CSS/:host) · [`::slotted()`](https://developer.mozilla.org/en-US/docs/Web/CSS/::slotted) · [`::part()`](https://developer.mozilla.org/en-US/docs/Web/CSS/::part)
- [MDN — `Event.composed`](https://developer.mozilla.org/en-US/docs/Web/API/Event/composed) · [`Event.composedPath()`](https://developer.mozilla.org/en-US/docs/Web/API/Event/composedPath)
- [MDN — `Node.getRootNode()`](https://developer.mozilla.org/en-US/docs/Web/API/Node/getRootNode)
- [MDN — `HTMLSlotElement.assignedElements()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLSlotElement/assignedElements)
- [MDN — `Document.adoptedStyleSheets`](https://developer.mozilla.org/en-US/docs/Web/API/Document/adoptedStyleSheets)
- [MDN — `<template>` `shadowrootmode`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/template#shadowrootmode)
- [web.dev — Declarative Shadow DOM](https://web.dev/articles/declarative-shadow-dom)

---

Đi tiếp: [[11 - So sanh truc tiep - React vs Web Components]] — đặt hai mô hình cạnh nhau trên từng tiêu chí, và trả lời câu "vậy tôi nên dùng cái nào".
