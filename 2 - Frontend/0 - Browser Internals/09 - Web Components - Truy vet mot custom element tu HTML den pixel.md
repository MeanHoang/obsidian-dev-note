# 09 — Web Components: truy vết một custom element từ HTML đến pixel

> **TL;DR:** Khi parser HTML gặp `<my-counter>`, nó **không bỏ qua** và cũng không cần biết bạn là ai — vì tên có dấu gạch ngang, nó tạo luôn một node `HTMLElement` thật, cắm vào DOM, layout và paint như mọi element khác. Node đó ban đầu **rỗng và vô hồn**. Chỉ đến khi `customElements.define()` chạy, browser mới **"upgrade"** đúng node cũ đó — đổi prototype, gọi `constructor()`, rồi `connectedCallback()`. Từ đầu đến cuối **không có tầng trung gian nào**: không VDOM, không diff, không scheduler. Bạn sửa DOM thật, browser vẽ lại, hết.

Series: [[00 - Roadmap - Tu HTML den Pixel]]
Anh em: [[07 - React - Truy vet mot lan setState tu click den pixel]] · [[10 - Shadow DOM - Cay trong cay va ranh gioi that su]] · [[11 - So sanh truc tiep - React vs Web Components]] · [[Glossary/D - Web Components va DOM nang cao|Glossary D]]

---

## 🎯 Câu hỏi note này trả lời

- Browser gặp một tag **nó chưa từng nghe tên** thì làm gì? Bỏ qua? Báo lỗi?
- Vì sao trang mới load thoáng thấy **chỗ trống nhấp nháy** rồi component mới hiện ra?
- `constructor` chạy lúc nào, `connectedCallback` chạy lúc nào — và vì sao **thứ tự đảo ngược** tuỳ cách bạn viết?
- Vì sao `constructor` **cấm** đụng vào attribute và children?
- Vì sao truyền một object qua attribute thì nhận về chuỗi `"[object Object]"`?
- Cùng một hành động "tăng số đếm", React đi **9 bước** (note 07), custom element đi mấy bước?

> Note này là **bản song song của [[07 - React - Truy vet mot lan setState tu click den pixel]]**. Cố tình cùng cấu trúc, cùng kiểu timeline, để bạn mở hai tab đặt cạnh nhau là thấy khác biệt ngay.

---

## 🧪 Ví dụ dùng chung cả bài

Vanilla thuần, không thư viện. Copy vào một file `.html` là chạy được ngay trên browser hiện đại.

```html
<!doctype html>
<meta charset="utf-8">

<h1>Demo</h1>
<my-counter start="0"></my-counter>

<script type="module">
  class MyCounter extends HTMLElement {
    static get observedAttributes() { return ['start']; }

    #count  = 0;
    #label  = null;
    #button = null;
    #onClick = () => { this.#count += 1; this.#paint(); };

    constructor() {
      super();                              // BẮT BUỘC, và phải đứng đầu tiên
      this.attachShadow({ mode: 'open' });  // được phép làm trong constructor
    }

    connectedCallback() {
      if (!this.shadowRoot.childElementCount) {   // chỉ dựng DOM đúng 1 lần
        this.shadowRoot.innerHTML = `
          <style>
            :host { display: inline-flex; align-items: center; gap: .5rem; }
            button { font: inherit; }
          </style>
          <button type="button">+1</button><span></span>`;
        this.#button = this.shadowRoot.querySelector('button');
        this.#label  = this.shadowRoot.querySelector('span');
      }
      this.#count = Number(this.getAttribute('start') ?? 0);
      this.#button.addEventListener('click', this.#onClick);
      this.#paint();
    }

    disconnectedCallback() {
      this.#button?.removeEventListener('click', this.#onClick);
    }

    attributeChangedCallback(name, oldValue, newValue) {
      if (name === 'start' && this.isConnected) {
        this.#count = Number(newValue ?? 0);
        this.#paint();
      }
    }

    get value()  { return this.#count; }
    set value(v) { this.#count = Number(v); this.#paint(); }

    #paint() {
      if (this.#label) this.#label.textContent = String(this.#count);
    }
  }

  customElements.define('my-counter', MyCounter);
</script>
```

Đây là bản vanilla tương đương `<Counter>` của note 07. Giữ nó trong đầu, cả bài sẽ bám vào nó.

---

## 🧠 Phần 1 — Browser gặp một tag lạ thì làm gì?

### Bước 1 — Parser đọc tới `<my-counter>` và **tạo node ngay lập tức**

Parser HTML **không có danh sách "tag hợp lệ" để từ chối**. Nó đọc tên tag, rồi quyết định element đó mang **interface** nào:

| Tag trong HTML | Interface JS được gán | Vì sao |
| --- | --- | --- |
| `<div>` | `HTMLDivElement` | tag chuẩn, có trong HTML Standard |
| `<my-counter>` | **`HTMLElement`** | tên **có dấu gạch ngang** → là *valid custom element name* |
| `<foo>` | **`HTMLUnknownElement`** | không gạch ngang, không phải tag chuẩn → "không biết là gì" |

Đây là chi tiết quan trọng nhất và cũng bị hiểu sai nhiều nhất:

> **Dấu gạch ngang không phải quy ước cho đẹp.** Nó là tín hiệu cho parser: "tag này *có thể* sẽ được định nghĩa sau, hãy để dành chỗ tử tế cho nó." Tên không gạch ngang thì `customElements.define()` sẽ **throw `SyntaxError`** — không phải cảnh báo, mà là ném lỗi thẳng.

Node `<my-counter>` lúc này đã:

- ✅ nằm trong cây DOM thật (xem [[02 - DOM la gi - Cay, Node va API]])
- ✅ đi vào render tree, được **layout** và **paint** (xem [[01 - Tu URL den Pixel - Vong doi mot trang web]])
- ❌ nhưng nội dung rỗng, và mặc định `display: inline` → chiếm **0 chiều cao**

### Bước 2 — Element ở trạng thái **"undefined"**

Browser giữ cho mỗi element một *custom element state*. Lúc này nó là `"undefined"`:

```js
document.querySelector('my-counter') instanceof HTMLElement  // true
document.querySelector('my-counter').matches(':defined')     // false ← chưa upgrade
customElements.get('my-counter')                             // undefined
```

Chưa có `constructor` nào chạy. Chưa có shadow root. Chưa có gì cả. Nó đúng nghĩa là **một cái vỏ**.

### Bước 3 — Script chạy

`<script type="module">` **mặc định là defer** — nó chờ parse xong toàn bộ HTML mới chạy (chi tiết ở [[03 - Script duoc tai luc nao - defer, async, module]]). Nghĩa là:

```
parse xong toàn bộ HTML  ──▶  module script chạy  ──▶  customElements.define(...)
```

Đây chính là lý do **luôn có một khoảng thời gian element tồn tại mà chưa có hành vi**. Không phải bug — là bản chất của thứ tự.

### Bước 4 — **Upgrade**: browser đi quét lại cả document

Ngay khi `customElements.define('my-counter', MyCounter)` chạy, browser làm việc này (đây là *"upgrade an element"* trong HTML Standard):

```
Với MỌI <my-counter> đang tồn tại trong document:
   4a. Đổi prototype của node → MyCounter.prototype
   4b. Gọi constructor()  (this chính là node cũ, không phải node mới)
   4c. Gọi attributeChangedCallback() cho từng attribute đã có
       và nằm trong observedAttributes   →  ở đây: start="0"
   4d. Nếu node đang nằm trong document → gọi connectedCallback()
   4e. Đổi state thành "custom"  →  :defined bắt đầu match
```

> **Điểm phải khắc vào đầu:** vẫn là **cùng một node object**. Browser không xoá node cũ rồi tạo node mới. Reference bạn giữ từ trước vẫn dùng được:

```js
const el = document.querySelector('my-counter');   // trước khi define
// ... define chạy ...
el instanceof MyCounter;   // true — vẫn là nó, chỉ là "lột xác"
```

Đây là điểm khác hẳn React: ở React, `<Counter />` chỉ là một **object mô tả** (note 05), phải chờ React tự tay gọi `document.createElement`. Ở đây node DOM có trước, hành vi đến sau.

### Bước 5 — `connectedCallback()` dựng nội dung → DOM đổi → browser vẽ lại

`this.shadowRoot.innerHTML = ...` làm DOM thay đổi → browser đánh dấu cần **layout + paint** lại. Việc vẽ không xảy ra ngay dòng đó, mà ở **rendering opportunity** gần nhất của event loop ([[04 - Event Loop - Task, Microtask va luc browser ve]]).

### 📊 Timeline — đánh số 1→5

```
 thời gian ──────────────────────────────────────────────────────────────▶

 [1] parser đọc <my-counter>
      │  tạo node HTMLElement, cắm vào DOM
      ▼
 ┌─────────────────────────────────────────┐
 │ state = "undefined"                     │
 │ node RỖNG, display:inline, cao 0px      │
 └────────────────┬────────────────────────┘
                  │
      ╔═══════════╪═══════════╗
      ║ 🖥️ BROWSER PAINT #1   ║   ← người dùng thấy chỗ trống ở đây!
      ╚═══════════╪═══════════╝      (khoảng "chưa upgrade")
                  │
 [2] state "undefined" kéo dài tới khi script chạy
                  │
 [3] parse xong HTML ──▶ module script chạy
                  │      customElements.define('my-counter', MyCounter)
                  ▼
 [4] UPGRADE (đồng bộ, ngay trong lượt define)
        4a  đổi prototype
        4b  constructor()           → attachShadow
        4c  attributeChangedCallback('start', null, '0')
        4d  connectedCallback()     → dựng shadow DOM, gắn listener
        4e  :defined = true
                  │
 [5] DOM đổi → đánh dấu dirty → layout → paint
                  ▼
      ╔═══════════════════════╗
      ║ 🖥️ BROWSER PAINT #2   ║   ← người dùng thấy component thật
      ╚═══════════════════════╝
```

So với timeline note 07: ở React, **paint đầu tiên đã là UI thật** (vì React dựng DOM rồi mới có gì để vẽ). Ở đây có **hai lần paint**, và lần đầu là chỗ trống. Đó chính là FOUC.

---

## ⚠️ FOUC và cách chặn nó

Khoảng trống giữa bước 1 và bước 4 là có thật, và trên mạng chậm nó dài **hàng trăm ms**. Hai cách xử lý, dùng cả hai được:

### Cách 1 — CSS `:not(:defined)` (rẻ nhất, làm luôn)

```css
/* Ẩn khi chưa upgrade — nhưng VẪN giữ chỗ, tránh giật layout */
my-counter:not(:defined) {
  visibility: hidden;
  display: inline-block;
  min-width: 6rem;
  min-height: 2rem;
}

/* Khi đã upgrade thì bỏ ẩn */
my-counter:defined {
  visibility: visible;
}
```

Dùng `visibility: hidden` chứ **đừng dùng `display: none`** — `display:none` bị loại khỏi render tree, element không chiếm chỗ, lúc hiện ra sẽ đẩy layout (CLS xấu). Xem lại [[01 - Tu URL den Pixel - Vong doi mot trang web]].

### Cách 2 — `customElements.whenDefined()` (khi cần chờ trong JS)

```js
// Chờ tất cả custom element trong trang sẵn sàng rồi mới bỏ lớp che
const tags = [...new Set(
  [...document.querySelectorAll(':not(:defined)')].map(el => el.localName)
)].filter(name => name.includes('-'));

await Promise.all(tags.map(name => customElements.whenDefined(name)));
document.body.classList.add('ready');
```

`whenDefined(name)` trả về một Promise, resolve với **constructor** của element đó. Nếu tên không hợp lệ → reject với `SyntaxError`.

---

## 🔄 Kịch bản ngược: `define()` chạy TRƯỚC

Thứ tự callback **đổi hẳn** tuỳ element có sẵn trong HTML hay được tạo bằng JS. Đây là bảng nên nhìn kỹ:

| | **A. Element có sẵn trong HTML, `define()` chạy sau** | **B. `define()` chạy trước, rồi `createElement`** |
| --- | --- | --- |
| Node được tạo lúc nào | Lúc parser đọc tag | Lúc gọi `document.createElement('my-counter')` |
| Interface ban đầu | `HTMLElement` (state `"undefined"`) | `MyCounter` ngay lập tức |
| Thứ tự thực thi | `constructor` → `attributeChangedCallback`* → `connectedCallback` | `constructor` → *(bạn set attribute / chèn vào DOM)* → `attributeChangedCallback` → `connectedCallback` |
| Attribute lúc `constructor` chạy | **Đã có sẵn** trong DOM (nhưng vẫn cấm đọc, xem dưới) | **Chưa có gì** |
| Có FOUC không | ✅ Có | ❌ Không (node chưa nằm trong document) |

\* Trong kịch bản A, `attributeChangedCallback` được gọi cho **mọi attribute đã có** khớp `observedAttributes` — và gọi **trước** `connectedCallback`. Đây là nguồn gốc của bug "`this.#label` là `null`", nên trong ví dụ trên mới có `if (... && this.isConnected)`.

```js
// Kịch bản B — thứ tự rõ ràng, dễ đoán
const el = document.createElement('my-counter');  // ① constructor()
el.setAttribute('start', '10');                   // ② attributeChangedCallback()
document.body.append(el);                         // ③ connectedCallback()
el.remove();                                      // ④ disconnectedCallback()
```

---

## ⚙️ Phần 2 — Vòng đời đầy đủ

### Bảng 5 callback

| Callback | Chạy khi nào | ĐƯỢC làm | **CẤM** làm |
| --- | --- | --- | --- |
| `constructor()` | Node được tạo hoặc được upgrade | Gọi `super()` **đầu tiên**; `attachShadow()`; khởi tạo field; gắn listener vào chính `this` | ❌ Đọc/ghi attribute · ❌ Đụng `children` / `innerHTML` của light DOM · ❌ `return` giá trị khác |
| `connectedCallback()` | Mỗi lần element được **chèn vào một document** | Dựng DOM, fetch, `addEventListener` ra ngoài (`window`, `document`), đọc attribute | ❌ Giả định chỉ chạy 1 lần |
| `disconnectedCallback()` | Mỗi lần element bị **gỡ khỏi document** | `removeEventListener`, `clearInterval`, huỷ observer, `abort()` fetch | ❌ Giả định element sẽ không quay lại |
| `attributeChangedCallback(name, old, new)` | Attribute **trong `observedAttributes`** bị thêm/sửa/xoá | Đồng bộ attribute → state nội bộ | ❌ Giả định DOM nội bộ đã dựng xong |
| `adoptedCallback()` | Element bị chuyển sang document khác (`document.adoptNode`, iframe) | Gắn lại thứ phụ thuộc document | — (hiếm dùng) |

### Vì sao `constructor` bị cấm nhiều thứ thế?

Vì `constructor` cũng chạy khi bạn gọi `document.createElement('my-counter')` — lúc đó node **chưa nằm trong cây, chưa có attribute, chưa có con nào cả**. HTML Standard quy định thẳng: element **không được có attribute hay children** khi constructor kết thúc; vi phạm thì `createElement` ném `NotSupportedError`. Ngoài ra parser cần constructor phải "rẻ và không có tác dụng phụ" để upgrade hàng loạt không giật.

Quy tắc thuộc lòng: **constructor chỉ để khởi tạo *chính bản thân object*. Mọi thứ đụng tới DOM và thế giới bên ngoài → `connectedCallback`.**

Riêng `attachShadow()` **được phép** trong constructor (và nên làm ở đó) — shadow root không phải "children" của element theo nghĩa light DOM.

### `observedAttributes` — danh sách đăng ký

```js
static get observedAttributes() { return ['start', 'label']; }
// hoặc, cú pháp static field mới, tương đương:
// static observedAttributes = ['start', 'label'];
```

Browser **đọc danh sách này đúng một lần**, tại thời điểm `define()`. Sửa mảng sau đó không có tác dụng. Attribute không nằm trong danh sách → đổi bao nhiêu lần cũng **không có callback nào**. Đây là bug hay gặp nhất khi mới học: viết `attributeChangedCallback` rồi ngồi chờ nó chạy, mà quên khai báo `observedAttributes`.

### Attribute vs Property — điểm chí tử

Xem lại [[02 - DOM la gi - Cay, Node va API]]. Nhắc lại vì đây là chỗ dev React vấp mạnh nhất:

| | **Attribute** | **Property** |
| --- | --- | --- |
| Sống ở đâu | Trong markup HTML | Trên object JS |
| Kiểu dữ liệu | **Luôn luôn là string** | Bất kỳ: object, array, function, Date… |
| Cách đặt | `el.setAttribute('start', '5')` | `el.value = 5` |
| Thấy trong DevTools | ✅ Có, ngay trên tag | ❌ Không |
| Dùng được trong CSS | ✅ `[start="5"]` | ❌ |
| Kích hoạt callback | ✅ `attributeChangedCallback` | ❌ Phải tự viết setter |

```js
const el = document.querySelector('my-counter');

// ❌ Cách này KHÔNG bao giờ hoạt động với dữ liệu phức tạp
el.setAttribute('user', { name: 'An' });
el.getAttribute('user');   // "[object Object]"  ← string, mất sạch dữ liệu

// ✅ Object / array / function thì đi bằng property
el.user = { name: 'An' };  // giữ nguyên object thật
el.value = 42;             // chạy setter → tự #paint()
```

> Ở React bạn viết `<Counter start={5} user={obj} />` và **không phải nghĩ** — vì mọi thứ đi qua object JS (note 05), attribute chưa từng tham gia. Ở custom element thì HTML là một kênh riêng, và kênh đó **chỉ chở được string**. Đây là khác biệt cấu trúc, không phải khác biệt cú pháp. So sánh đầy đủ ở [[11 - So sanh truc tiep - React vs Web Components]].

**Quy ước tốt (Lit và các thư viện đều theo):**

- Attribute = cấu hình đơn giản, string/number/boolean, muốn viết được trong HTML tĩnh.
- Property = dữ liệu thật, object/array/callback.
- Cần cả hai thì **phản chiếu** (reflect) property → attribute bằng `setAttribute` trong setter, để CSS `[state="loading"]` dùng được.

### `disconnectedCallback` và memory leak

```js
class MyClock extends HTMLElement {
  #timer = 0;
  connectedCallback() {
    this.#timer = setInterval(() => this.#tick(), 1000);
    window.addEventListener('resize', this.#onResize);
  }
  disconnectedCallback() {
    clearInterval(this.#timer);                          // ❗ quên dòng này
    window.removeEventListener('resize', this.#onResize); // ❗ và dòng này
  }                                                      //   = leak chắc chắn
  #onResize = () => { /* ... */ };
}
```

Listener gắn lên `window`/`document` giữ reference tới element → element **không bao giờ được GC** dù đã `remove()` khỏi DOM. React có `useEffect` cleanup nhắc bạn; ở đây **không ai nhắc cả**.

Lưu ý: `connectedCallback`/`disconnectedCallback` chạy **mỗi lần** element vào/ra khỏi DOM. Chỉ cần `el.remove()` rồi `append()` lại là cặp callback chạy thêm một lượt. Vì vậy ví dụ đầu bài mới có guard `if (!this.shadowRoot.childElementCount)`.

---

## 🔍 Phần 3 — Truy vết một lần "state đổi"

Bây giờ là phần đối xứng trực tiếp với note 07. Người dùng bấm nút `+1`.

```
 [1] Người dùng click nút bên trong shadow root
       │  (event thật, do browser phát — task mới trong event loop)
       ▼
 [2] Listener #onClick chạy
       │  this.#count += 1   ← chỉ là gán một biến JS thường
       ▼
 [3] this.#paint() chạy
       │  this.#label.textContent = '1'
       │  ↑ SỬA THẲNG một text node có thật trong shadow DOM
       ▼
 [4] Browser đánh dấu vùng đó "dirty"
       │
       ▼
 [5] Rendering opportunity của event loop  (xem note 04)
       │  layout (chỉ vùng liên quan) → paint → composite
       ▼
     ╔═══════════════════════╗
     ║ 🖥️  PIXEL LÊN MÀN HÌNH ║
     ╚═══════════════════════╝
```

**Năm bước. Hết.** Không có bước nào giữa (2) và (3).

### Đặt cạnh nhau

| | **React (note 07)** | **Custom element (note này)** |
| --- | --- | --- |
| Kích hoạt | `setState(c => c + 1)` | `this.#count += 1` |
| Có hàng đợi / scheduler? | ✅ Có — update được xếp hàng, có priority | ❌ Không |
| Có render lại component? | ✅ Gọi lại **toàn bộ** hàm component | ❌ Không có khái niệm "render lại" |
| Có tạo cây mô tả mới? | ✅ Sinh cây React element mới | ❌ Không |
| Có diff / reconciliation? | ✅ So cây cũ với cây mới (Fiber, note 06) | ❌ Không |
| Có commit phase? | ✅ Gom thay đổi rồi ghi vào DOM một lượt | ❌ Ghi thẳng, ngay lập tức |
| Số bước tới lúc DOM đổi | ~7 bước trước khi chạm DOM | **1 bước** |
| Ai quyết định "sửa chỗ nào" | **React** tự tìm ra | **Bạn** phải tự viết ra |
| Từ DOM đổi → pixel | Giống hệt nhau — pipeline note 01 | Giống hệt nhau — pipeline note 01 |

Nửa dưới của cả hai timeline **hoàn toàn trùng nhau**: DOM đổi → dirty → layout → paint → composite. React không có đường tắt nào tới pixel, và custom element cũng vậy ([[01 - Tu URL den Pixel - Vong doi mot trang web]]).

### Cái giá của "ít bước hơn"

Đừng đọc bảng trên rồi kết luận "vanilla thắng". Cái React làm hộ bạn — **tìm ra chỗ nào cần đổi** — là công việc thật, và nếu không có nó thì **bạn phải làm**:

```js
// Component 3 field. Bạn tự nhớ hết:
#paint() {
  this.#label.textContent    = String(this.#count);
  this.#button.disabled      = this.#count >= this.max;
  this.#status.hidden        = this.#count === 0;
  this.classList.toggle('is-max', this.#count >= this.max);
}
```

Ba field còn đỡ. Ba mươi field, có nhánh điều kiện, có list thì đây là nơi bug sinh sôi: **quên update một chỗ**. Cách sai kinh điển là đơn giản hoá bằng `this.shadowRoot.innerHTML = ...` mỗi lần đổi state — làm vậy là **phá và dựng lại toàn bộ node con**: mất focus, mất trạng thái cuộn, mất mọi listener đã gắn, và chậm.

Đây chính xác là chỗ **Lit** nhảy vào: bạn viết template khai báo, Lit đánh dấu sẵn các "lỗ" động và chỉ ghi vào đúng những lỗ đó — tức là làm hộ bạn cái `#paint()` ở trên, không cần VDOM. Chi tiết: [[00 - Roadmap Web Components - Lit]].

---

## 💡 Phần 4 — Điểm mấu chốt cần khắc

> **Custom element là một node THẬT trong cây DOM.** Browser xử lý nó bằng đúng pipeline ở note 01, **không có tầng trung gian nào**.

Kiểm chứng ngay trên Console, không cần cài gì:

```js
// 1. DevTools → Elements: thấy đúng <my-counter start="0"> trên cây
document.querySelector('my-counter');        // <my-counter start="0">

// 2. Nó là một element chuẩn — mọi DOM API đều dùng được
const el = document.querySelector('my-counter');
el.getBoundingClientRect();                  // có toạ độ, có kích thước thật
el.closest('body');                          // <body>
el.matches(':defined');                      // true

// 3. Gọi API riêng của component từ console
el.value = 5;                                // chạy setter → UI đổi ngay
el.value;                                    // 5

// 4. Nó có kiểu riêng
el instanceof HTMLElement;                   // true
el.constructor.name;                         // "MyCounter"
```

Đối lập với React ([[05 - React - JSX bien thanh gi]]):

```
   VIẾT                     BUILD/RUNTIME                DEVTOOLS → ELEMENTS
 ────────────────────────────────────────────────────────────────────────────
 <MyButton />        →   _jsx(MyButton, {})       →   <button>…</button>
                         object JS thuần               ❗ KHÔNG có <MyButton>
                         React tự gọi createElement    (tag đã bốc hơi)

 <my-counter/>       →   (không build gì cả)      →   <my-counter>…</my-counter>
                         parser tạo node luôn          ✅ đúng tag bạn viết
```

Hệ quả thực tế:

| | React component | Custom element |
| --- | --- | --- |
| Tìm bằng `document.querySelector` | ❌ Không (tag không tồn tại) | ✅ Có |
| Thấy trong "View Source" | ❌ (trừ khi SSR) | ✅ |
| Dùng được trong file HTML tĩnh | ❌ Cần bundler | ✅ Chỉ cần một thẻ `<script>` |
| Dùng được trong Vue/Angular/Svelte | ❌ | ✅ Là HTML, framework nào cũng nhận |
| Cần build tool | ✅ Bắt buộc | ❌ Không |
| Phải chờ JS mới có node | ✅ Có | ❌ Node có ngay từ parse (nhưng rỗng) |

---

## ⚠️ Bẫy thường gặp

**1. Quên dấu gạch ngang trong tên**

```js
customElements.define('counter', Counter);
// ❌ Uncaught SyntaxError: Failed to execute 'define' on 'CustomElementRegistry':
//    "counter" is not a valid custom element name
```

Tên phải: bắt đầu bằng chữ thường ASCII, chứa ít nhất **một dấu `-`**, không có chữ hoa, và không trùng vài tên đã bị chiếm (`annotation-xml`, `font-face`…). `<counter>` thì thành `HTMLUnknownElement` và im lặng không làm gì cả.

**2. Đụng vào DOM trong `constructor`**

```js
constructor() {
  super();
  this.innerHTML = '<b>hi</b>';        // ❌ vi phạm spec
  const s = this.getAttribute('start'); // ❌ createElement thì luôn null
}
// → document.createElement('my-counter') ném NotSupportedError
```

Chuyển hết xuống `connectedCallback`.

**3. `define()` hai lần cùng một tên → throw**

```js
customElements.define('my-counter', MyCounter);
customElements.define('my-counter', MyCounter);
// ❌ NotSupportedError: this name has already been used with this registry
```

Rất hay xảy ra với hot-reload hoặc khi một thư viện bị bundle hai bản. Guard khi cần:

```js
if (!customElements.get('my-counter')) {
  customElements.define('my-counter', MyCounter);
}
```

**4. Quên `:host { display: block }` → component "mất tích"**

Custom element mặc định `display: inline`. Nếu bên trong bạn đặt `<div>` với `height: 300px`, layout sẽ rất lạ, hoặc component tưởng như cao 0px. Luôn khai báo rõ:

```css
:host { display: block; }              /* hoặc inline-flex, grid… tuỳ ý */
:host([hidden]) { display: none; }     /* để attribute hidden vẫn hoạt động */
```

Dòng thứ hai quan trọng: `:host { display: block }` **đè lên** style mặc định của `[hidden]`, nên không có nó thì `el.hidden = true` sẽ không ẩn được gì.

**5. Đọc attribute trước khi element được upgrade**

```js
const el = document.querySelector('my-counter');
el.value;   // ❌ undefined — chưa upgrade thì chưa có getter nào cả

// ✅ Chờ đúng cách
await customElements.whenDefined('my-counter');
el.value;   // 0
```

**6. Quên cleanup trong `disconnectedCallback`** → xem lại phần trên. Timer và listener trên `window` là hai thủ phạm chính.

**7. Dùng `innerHTML` để "render lại" mỗi lần state đổi** → xoá sạch node con, mất focus, mất listener, và chậm hơn hẳn việc sửa đúng một `textContent`.

**8. Đặt tag custom element ở chỗ HTML không cho phép** — ví dụ `<my-row>` làm con trực tiếp của `<table>`. Parser HTML có luật riêng cho `<table>`, nó sẽ **đẩy element ra ngoài bảng** (foster parenting) trước cả khi JS chạy. Không phải lỗi của custom element, mà là luật parse HTML.

---

## ✅ Nhớ 5 điều

- **Dấu gạch ngang là hợp đồng với parser.** Có gạch ngang → browser tạo `HTMLElement` và để dành chỗ; không có → `HTMLUnknownElement` và `define()` sẽ throw.
- **Node có trước, hành vi đến sau.** Element tồn tại trong DOM từ lúc parse, ở trạng thái `"undefined"`, rồi mới được **upgrade** — vẫn là **cùng một node object**, chỉ đổi prototype rồi chạy `constructor` → `attributeChangedCallback` → `connectedCallback`.
- **`constructor` chỉ được khởi tạo chính nó.** Attribute, children, fetch, listener bên ngoài — tất cả xuống `connectedCallback`. Và nhớ dọn trong `disconnectedCallback`, vì cặp callback này chạy **mỗi lần** vào/ra DOM.
- **Attribute luôn là string, property mới chở được dữ liệu thật.** Object, array, function → đi bằng property. Đây là khác biệt cấu trúc lớn nhất so với props của React.
- **Không có VDOM, không có diff, không có scheduler.** State đổi → bạn tự sửa đúng node → browser vẽ. Ít bước hơn note 07 rất nhiều, nhưng đổi lại **bạn** phải tự biết chỗ nào cần update — và đó chính là việc Lit làm hộ.

---

## 📚 Nguồn

- [HTML Standard — Custom elements](https://html.spec.whatwg.org/multipage/custom-elements.html)
- [HTML Standard — Requirements for custom element constructors and reactions](https://html.spec.whatwg.org/multipage/custom-elements.html#custom-element-conformance)
- [HTML Standard — Upgrading elements after their creation](https://html.spec.whatwg.org/multipage/custom-elements.html#upgrades)
- [MDN — Using custom elements](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements)
- [MDN — `CustomElementRegistry.define()`](https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry/define)
- [MDN — `CustomElementRegistry.whenDefined()`](https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry/whenDefined)
- [MDN — `:defined`](https://developer.mozilla.org/en-US/docs/Web/CSS/:defined)
- [MDN — `HTMLUnknownElement`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLUnknownElement)
- [MDN — `Element.attributes` và attribute vs property](https://developer.mozilla.org/en-US/docs/Web/API/Element/attributes)
- [web.dev — Custom Elements v1: Reusable Web Components](https://web.dev/articles/custom-elements-v1)
- [DOM Standard — Interface `Element`](https://dom.spec.whatwg.org/#interface-element)

---

Đi tiếp: [[10 - Shadow DOM - Cay trong cay va ranh gioi that su]] — thứ `attachShadow()` ở dòng thứ hai của `constructor` thực sự tạo ra là gì, và vì sao nó là rào chắn CSS **thật** chứ không phải đổi tên class như note 08.
