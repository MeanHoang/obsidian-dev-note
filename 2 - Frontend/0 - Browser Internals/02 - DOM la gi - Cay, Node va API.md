# 02 — DOM là gì: Cây, Node và API

> **TL;DR:** DOM **không phải** file HTML của bạn. HTML là text chết nằm trên đĩa; DOM là **cây object sống trong RAM** do browser dựng ra — và nó thường **khác** những gì bạn gõ (browser tự sửa lỗi, khoảng trắng cũng thành node). Sửa DOM "đắt" vì mỗi lần sửa có thể kéo theo layout + paint. Hiểu chương này rồi thì React và Web Components chỉ còn là hai cách khác nhau để làm đúng những việc bên dưới.

Series: [[00 - Roadmap - Tu HTML den Pixel]]
Anh em: [[01 - Tu URL den Pixel - Vong doi mot trang web]] · [[03 - Script duoc tai luc nao - defer, async, module]] · [[09 - Web Components - Truy vet mot custom element tu HTML den pixel]] · [[Glossary/A - Browser va Rendering|Glossary A]]

---

## 🎯 Mục tiêu note này

- Phân biệt dứt khoát **HTML** (file) và **DOM** (cây object).
- Đọc được cây DOM, biết vì sao `firstChild` hay trả về thứ lạ.
- Nhớ được bộ API nền tảng và bảng **attribute vs property** (note 09 sẽ dùng lại nguyên bảng này).
- Hiểu vì sao thao tác DOM chậm, và **layout thrashing** là gì.

---

## 🧠 1. DOM KHÔNG phải file HTML

Đây là điểm nhầm số một. Hãy tách bạch:

| | HTML | DOM |
| --- | --- | --- |
| Bản chất | **Text** — một chuỗi ký tự | **Object** — cây node trong bộ nhớ |
| Ở đâu | File trên đĩa / trên server / trong response | RAM của tab đang mở |
| Ai tạo | Bạn gõ | Browser dựng ra khi parse HTML |
| Sửa được bằng JS? | ❌ Không (sửa xong file trên server cũng không đổi trang đang mở) | ✅ Có — `document.createElement`, `el.remove()`... |
| Sau khi JS chạy | Không đổi | **Đổi liên tục** |

Một câu để nhớ:

```
HTML  =  BẢN VẼ THIẾT KẾ  (giấy, tĩnh, gửi một lần)
DOM   =  NGÔI NHÀ ĐÃ XÂY  (đứng đó, sờ được, đập tường thêm phòng được)
```

Browser đọc bản vẽ **một lần** để xây nhà. Sau đó bạn sửa nhà bao nhiêu tuỳ thích — bản vẽ vẫn nằm im.

### 🔬 Bằng chứng: `view-source:` vs tab Elements

Đây là cách kiểm chứng trực tiếp, làm thử 2 phút là thấm.

```html
<!-- index.html — file bạn viết -->
<!DOCTYPE html>
<html>
  <body>
    <div id="app">Đang tải...</div>
    <script>
      document.getElementById('app').textContent = 'Xin chào!';
      const p = document.createElement('p');
      p.textContent = 'Dòng này không có trong file HTML';
      document.body.append(p);
    </script>
  </body>
</html>
```

Bây giờ:

**Mở `view-source:http://localhost:3000/`** (hoặc Ctrl+U) → bạn thấy **đúng y nguyên** file trên. Vẫn là `Đang tải...`, vẫn không có thẻ `<p>` nào.

```
view-source  →  HTML GỐC mà server đã gửi về. Là TEXT. Không bao giờ đổi.
```

**Mở DevTools → tab Elements** → bạn thấy:

```html
<body>
  <div id="app">Xin chào!</div>       ← đã đổi
  <script>...</script>
  <p>Dòng này không có trong file HTML</p>   ← xuất hiện từ hư không
</body>
```

```
tab Elements  →  ẢNH CHỤP DOM HIỆN TẠI. Là OBJECT. Đổi realtime.
```

> 💡 Đây chính là lý do khi bạn "View Source" một trang React, bạn thường chỉ thấy `<div id="root"></div>` trống trơn — vì toàn bộ giao diện được JS dựng vào DOM **sau đó**. Còn tab Elements thì đầy ắp. Hai thứ khác nhau, không phải bug.

### Ba cách "xem HTML" hay bị lẫn

| Cách xem | Bạn đang xem cái gì |
| --- | --- |
| `view-source:` / Ctrl+U | HTML gốc từ server — **text** |
| DevTools → **Network** → tab Response | Cũng là HTML gốc từ server — **text** |
| DevTools → **Elements** | **DOM hiện tại**, đã qua parser fix lỗi + đã bị JS sửa |
| `document.documentElement.outerHTML` trong Console | DOM hiện tại, **serialize ngược** ra chuỗi text |

Hai dòng cuối là DOM. Hai dòng đầu là HTML. Trộn lẫn hai nhóm này là nguồn gốc của rất nhiều tiếng đồng hồ debug vô ích.

---

## 🧩 2. Parser tự sửa lỗi → DOM khác HTML bạn viết

HTML parser được spec yêu cầu **không bao giờ báo lỗi**. Gặp markup sai, nó phải tự đoán ý bạn và sửa. Kết quả: cây DOM có thể chứa những thứ bạn **không hề gõ**.

### Ví dụ A — Bảng tự mọc `<tbody>`

Bạn viết:

```html
<table>
  <tr><td>A</td></tr>
</table>
```

DOM thật sự:

```
table
└── tbody          ← 😲 BẠN KHÔNG HỀ VIẾT CÁI NÀY
    └── tr
        └── td
            └── #text "A"
```

Kiểm chứng: `document.querySelector('table').firstElementChild.tagName` → `"TBODY"`.

Hệ quả thật: CSS selector `table > tr` **không bao giờ khớp**, vì giữa chúng luôn có `tbody`. Phải viết `table tr` (hậu duệ) hoặc `table > tbody > tr`.

### Ví dụ B — Quên đóng thẻ

Bạn viết:

```html
<p>Một
<p>Hai
```

DOM thật sự:

```
body
├── p
│   └── #text "Một"          ← parser tự đóng p đầu khi gặp <p> thứ hai
└── p
    └── #text "Hai"
```

Không phải `p` lồng trong `p` — vì spec quy định `<p>` không được chứa `<p>`, gặp `<p>` mới thì đóng cái cũ.

### Ví dụ C — Thẻ đặt sai chỗ bị "đá" ra

Bạn viết:

```html
<table>
  <div>Lạc chỗ</div>
  <tr><td>A</td></tr>
</table>
```

DOM thật sự (rất bất ngờ):

```
body
├── div                   ← 😲 bị đẩy RA NGOÀI table
│   └── #text "Lạc chỗ"
└── table
    └── tbody
        └── tr
            └── td → #text "A"
```

Cơ chế này gọi là **foster parenting** trong spec HTML. Đây là lý do một `<div>` "biến mất khỏi bảng" và nhảy lên trên.

### Ví dụ D — Thẻ browser luôn tự thêm

```html
<title>Hi</title><p>Xin chào</p>
```

DOM:

```
Document
└── html          ← tự thêm
    ├── head      ← tự thêm
    │   └── title → #text "Hi"
    └── body      ← tự thêm
        └── p → #text "Xin chào"
```

> **Chốt:** khi debug, đừng tin file HTML bạn viết. Hãy tin **tab Elements**. Cây thật mới là cái CSS selector chạy trên đó, và là cái JS truy vấn.

---

## 🌳 3. Node vs Element — không phải một

Nhiều người dùng lẫn hai từ này. Chúng có quan hệ **cha–con** rõ ràng:

```
Node  (lớp cha, mọi thứ trong cây đều là Node)
├── Document           #document   — gốc của cây
├── Element            <div>, <p>  — cái ta hay gọi là "thẻ"
│   └── HTMLElement    (Element chuyên cho HTML)
├── Text               #text       — chữ, KỂ CẢ khoảng trắng
├── Comment            #comment    — <!-- ... -->
└── DocumentFragment   #document-fragment — cây rời, không nằm trong trang
```

| Loại node | `nodeType` | Nhận ra bằng gì |
| --- | --- | --- |
| `Element` | 1 | Có `tagName`, có attribute, có style |
| `Text` | 3 | Chỉ có nội dung chữ, **không** có attribute |
| `Comment` | 8 | Nội dung comment |
| `Document` | 9 | Chính là biến `document` |
| `DocumentFragment` | 11 | Container tạm, không có cha |

### ⚠️ Khoảng trắng CŨNG là Text node

Đây là cái bẫy khiến `firstChild` trả về thứ lạ. Xét:

```html
<ul>
  <li>A</li>
  <li>B</li>
</ul>
```

Bạn nghĩ cây là `ul → li, li`. Thật ra:

```
ul
├── #text "\n  "     ← xuống dòng + 2 space sau <ul>
├── li → #text "A"
├── #text "\n  "     ← xuống dòng giữa hai <li>
├── li → #text "B"
└── #text "\n"       ← xuống dòng trước </ul>
```

**5 node con**, trong đó chỉ 2 là element. Nên:

```js
const ul = document.querySelector('ul');

ul.childNodes.length          // 5   😱
ul.children.length            // 2   ✅

ul.firstChild                 // #text "\n  "   ← KHÔNG phải <li>A</li>
ul.firstElementChild          // <li>A</li>     ✅

ul.firstChild.nodeType        // 3 (Text)
ul.firstElementChild.tagName  // "LI"
```

### Bảng cặp đôi cần thuộc

| Muốn **mọi node** (kể cả text/comment) | Muốn **chỉ element** |
| --- | --- |
| `node.childNodes` | `el.children` |
| `node.firstChild` | `el.firstElementChild` |
| `node.lastChild` | `el.lastElementChild` |
| `node.nextSibling` | `el.nextElementSibling` |
| `node.previousSibling` | `el.previousElementSibling` |
| `node.parentNode` | `el.parentElement` |

👉 **Quy tắc thực dụng: 95% trường hợp bạn muốn bản có chữ `Element`.**

---

## 🔴 4. DOM là "live" — một số danh sách tự cập nhật

Có hai kiểu danh sách, và chúng hành xử **khác nhau**:

| API | Trả về | Live? |
| --- | --- | --- |
| `getElementsByTagName('li')` | `HTMLCollection` | ✅ **Live** — DOM đổi thì nó đổi theo |
| `getElementsByClassName('x')` | `HTMLCollection` | ✅ Live |
| `el.children` | `HTMLCollection` | ✅ Live |
| `el.childNodes` | `NodeList` | ✅ Live |
| `querySelectorAll('li')` | `NodeList` | ❌ **Static** — ảnh chụp tại thời điểm gọi |

Ví dụ cho thấy khác biệt:

```js
document.body.innerHTML = '<ul><li>A</li></ul>';
const ul = document.querySelector('ul');

const live   = ul.getElementsByTagName('li');  // HTMLCollection — live
const stat   = ul.querySelectorAll('li');      // NodeList — static

console.log(live.length, stat.length);   // 1  1

ul.append(document.createElement('li')); // thêm 1 <li> mới

console.log(live.length, stat.length);   // 2  1   👈 khác nhau!
```

### 💥 Bẫy vòng lặp vô tận kinh điển

```js
// ❌ TREO TRÌNH DUYỆT
const items = document.getElementsByTagName('li');   // live!
for (let i = 0; i < items.length; i++) {
  const li = document.createElement('li');
  document.querySelector('ul').append(li);
  // mỗi vòng thêm 1 li → items.length tăng 1 → điều kiện không bao giờ sai
}
```

```js
// ✅ AN TOÀN
const items = document.querySelectorAll('li');   // static, chốt số lượng
for (const item of items) { /* ... */ }
```

Tương tự khi **xoá**:

```js
// ❌ bỏ sót một nửa: xoá phần tử 0 thì phần tử 1 tụt xuống thành 0
const els = document.getElementsByClassName('gone');
for (let i = 0; i < els.length; i++) els[i].remove();

// ✅
[...document.getElementsByClassName('gone')].forEach(el => el.remove());
// hoặc
document.querySelectorAll('.gone').forEach(el => el.remove());
```

> **Quy tắc:** cứ dùng `querySelector` / `querySelectorAll`, trừ khi bạn **cố ý** muốn tính chất live.

---

## ⚙️ 5. API nền tảng — bộ đồ nghề tối thiểu

### Tạo, gắn, xoá

```js
const el = document.createElement('div');      // tạo node rời (chưa nằm trong trang)
el.className = 'card';

parent.append(el);          // gắn vào CUỐI parent. Nhận nhiều tham số + cả chuỗi text
parent.appendChild(el);     // API cũ. Chỉ nhận 1 Node, trả về node vừa gắn
parent.prepend(el);         // gắn vào ĐẦU
ref.before(el);  ref.after(el);   // chèn trước/sau một node anh em
ref.replaceWith(el);        // thay thế
el.remove();                // tự xoá mình khỏi cha
```

| API | Nhận chuỗi text? | Nhiều tham số? | Trả về |
| --- | --- | --- | --- |
| `append()` | ✅ (tự thành Text node) | ✅ | `undefined` |
| `appendChild()` | ❌ (chỉ Node) | ❌ | node vừa gắn |

Dùng `append()` cho code mới; `appendChild()` chỉ khi cần giá trị trả về.

### `textContent` vs `innerHTML` — chỗ này liên quan bảo mật

```js
const name = '<img src=x onerror="alert(document.cookie)">';

el.textContent = name;   // ✅ hiện ra ĐÚNG chuỗi đó dưới dạng chữ. An toàn tuyệt đối.
el.innerHTML   = name;   // 🚨 parse thành HTML → thẻ <img> lỗi → onerror CHẠY.
```

| | `textContent` | `innerHTML` |
| --- | --- | --- |
| Gán vào | Tạo **một** Text node | **Parse** chuỗi thành HTML rồi dựng cây node |
| Đọc ra | Chữ của cả nhánh (kể cả node ẩn) | Chuỗi HTML của các con |
| Tốc độ | Nhanh | Chậm hơn (phải parse + dựng lại cả nhánh) |
| Rủi ro **XSS** | Không | ✅ **Có** — nếu chuỗi đến từ người dùng |
| Giữ event listener của con cũ? | Không (con bị xoá) | Không (con cũ bị vứt, listener mất theo) |

> 🚨 **Nguyên tắc vàng:** dữ liệu do người dùng nhập → **luôn** dùng `textContent`. Chỉ dùng `innerHTML` với chuỗi bạn **tự viết ra trong code**, hoặc đã lọc qua thư viện sanitize (DOMPurify) — hoặc dùng `setHTML()` khi môi trường bạn hỗ trợ.
>
> `<script>` chèn qua `innerHTML` **không** chạy — nhưng `onerror`, `onload`, `<iframe srcdoc>`... thì **có**. Nên "không chạy `<script>`" hoàn toàn không đồng nghĩa với "an toàn".

### Attribute vs Property — bảng quan trọng nhất note này

Đây là điểm gây rối kinh niên, và **note 09 (Web Components) sẽ dùng lại nguyên chỗ này**.

- **Attribute**: thứ bạn gõ trong HTML — `<input value="a">`. Giá trị **luôn là chuỗi**.
- **Property**: thuộc tính của **object JS** tương ứng — `inputEl.value`. Có kiểu thật (string, boolean, number, object).

```js
el.setAttribute('id', 'box');   // ghi vào ATTRIBUTE
el.id = 'box';                  // ghi vào PROPERTY
el.getAttribute('id');          // đọc ATTRIBUTE (luôn là string hoặc null)
```

Một số property **phản chiếu** (reflect) attribute — sửa cái này thì cái kia đổi theo. Nhưng **không phải tất cả**:

| Trường hợp | Attribute | Property | Có đồng bộ? |
| --- | --- | --- | --- |
| `id`, `title`, `lang`, `hidden` | `id="box"` | `el.id` | ✅ Đồng bộ hai chiều |
| `class` | `class="a b"` | `el.className` (chuỗi) / `el.classList` | ✅ (nhưng **khác tên**!) |
| `<input value>` | Giá trị **khởi tạo** | `el.value` = giá trị **hiện tại** người dùng đang gõ | ⚠️ **Không** — gõ vào ô, attribute vẫn nguyên |
| `<input checked>` | Trạng thái **mặc định** | `el.checked` = trạng thái **hiện tại** | ⚠️ Không |
| `<a href="/x">` | Chuỗi **y nguyên** `"/x"` | `el.href` = URL **tuyệt đối** `"https://site.com/x"` | ⚠️ Khác giá trị |
| `data-*` | `data-user-id="7"` | `el.dataset.userId` (chuỗi `"7"`) | ✅ (đổi tên kebab → camel) |
| Attribute tự chế `foo="1"` | `getAttribute('foo')` | `el.foo` là `undefined` | ❌ Không có property |
| Property bạn tự gán `el.data = {...}` | Không xuất hiện trong HTML | Có, giữ được **object** | ❌ Không phản chiếu |

Minh hoạ cái bẫy hay gặp nhất:

```js
const input = document.querySelector('input');   // <input value="ban đầu">

// người dùng gõ "đã sửa" vào ô

input.value                      // "đã sửa"      ← trạng thái HIỆN TẠI
input.getAttribute('value')      // "ban đầu"     ← vẫn là giá trị trong HTML
input.outerHTML                  // <input value="ban đầu">  ← DevTools cũng hiện thế
```

> Nhớ: **attribute là chuỗi trong markup, property là trạng thái sống trong object.** Attribute chỉ chở được string; muốn truyền object/array cho một component thì phải qua property. Đây chính xác là vấn đề mà [[09 - Web Components - Truy vet mot custom element tu HTML den pixel]] và [[11 - So sanh truc tiep - React vs Web Components]] sẽ mổ kỹ.

### `classList` và `dataset`

```js
el.classList.add('active', 'big');
el.classList.remove('big');
el.classList.toggle('open');            // bật/tắt
el.classList.toggle('open', isOpen);    // ép theo boolean — rất tiện
el.classList.contains('active');        // true/false
el.classList.replace('old', 'new');
```

Đừng dùng `el.className += ' active'` — dễ thiếu space, dễ ghi đè class khác.

```html
<div id="u" data-user-id="7" data-role="admin"></div>
```
```js
const u = document.getElementById('u');
u.dataset.userId    // "7"      ← data-user-id → userId (kebab → camel)
u.dataset.role      // "admin"
u.dataset.theme = 'dark';       // → thêm attribute data-theme="dark" vào HTML

// ⚠️ LUÔN là chuỗi
typeof u.dataset.userId         // "string"  → cần số thì Number(...)
```

---

## 💸 6. Vì sao thao tác DOM "đắt"?

DOM API bản thân nó không chậm — gán một property JS thì nhanh. Cái đắt là **hệ quả**.

Nối lại với [[01 - Tu URL den Pixel - Vong doi mot trang web]]:

```
   Bạn sửa DOM (thêm node / đổi style / đổi text)
        │
        ▼
   Browser đánh dấu vùng đó là "BẨN" (dirty)
        │
        ▼
   Trước khung hình kế tiếp:  tính lại style → LAYOUT → PAINT → COMPOSITE
```

Tin tốt: browser **rất lười**. Nó gom hết thay đổi trong một lượt code và chỉ layout **một lần** trước khi vẽ khung hình mới:

```js
el.style.width  = '100px';   // đánh dấu bẩn
el.style.height = '100px';   // đánh dấu bẩn
el.style.margin = '10px';    // đánh dấu bẩn
// → tới đây browser vẫn CHƯA layout lần nào. Nó sẽ layout 1 lần, sau này.
```

(Vì sao "sau này"? Vì browser vẽ theo nhịp khung hình — xem [[04 - Event Loop - Task, Microtask va luc browser ve]].)

### 🔥 Forced synchronous layout — khi bạn phá sự lười biếng đó

Sự lười chỉ giữ được **cho tới khi bạn hỏi một câu cần đáp án chính xác ngay**:

```js
el.style.width = '100px';    // GHI  → đánh dấu bẩn, hẹn tính sau
const h = el.offsetHeight;   // ĐỌC  → "cao bao nhiêu?" → không thể đoán
                             //        → browser BUỘC PHẢI layout NGAY LẬP TỨC
```

Đó là **forced synchronous layout** (còn gọi là *layout trigger*). Một lần thì không sao. Đặt trong vòng lặp thì thành thảm hoạ.

### Danh sách "hỏi là bị ép layout"

| Nhóm | Ví dụ |
| --- | --- |
| Kích thước / vị trí | `offsetTop/Left/Width/Height`, `clientTop/Left/Width/Height`, `getBoundingClientRect()`, `getClientRects()` |
| Scroll | `scrollTop/Left/Width/Height`, `scrollBy()`, `scrollIntoView()` |
| Style đã tính | `getComputedStyle(el)` (rồi đọc giá trị) |
| Khác | `el.focus()`, `document.elementFromPoint()`, `window.getSelection().getRangeAt()` |

### ❌ Code SAI — layout thrashing

```js
const boxes = document.querySelectorAll('.box');

// Mỗi vòng lặp: ĐỌC → GHI → ĐỌC → GHI ...
for (const box of boxes) {
  const w = box.offsetWidth;        // ĐỌC → ép layout (vì vòng trước vừa GHI)
  box.style.width = w * 2 + 'px';   // GHI → làm bẩn lại
}
```

Với 500 element, đây là **500 lần layout đồng bộ**. Trang khựng thấy rõ. Hiện tượng đọc-ghi xen kẽ này gọi là **layout thrashing** (đập phá layout).

```
ĐỌC ─ layout! ─ GHI ─ ĐỌC ─ layout! ─ GHI ─ ĐỌC ─ layout! ─ GHI ...
      ↑ mỗi mũi tên là một lần tính lại toàn bộ
```

### ✅ Code ĐÚNG — gom ĐỌC, rồi gom GHI

```js
const boxes = document.querySelectorAll('.box');

// Pha 1: ĐỌC hết
const widths = [...boxes].map(box => box.offsetWidth);   // chỉ 1 lần layout ở lần đọc đầu

// Pha 2: GHI hết
boxes.forEach((box, i) => {
  box.style.width = widths[i] * 2 + 'px';
});
```

```
ĐỌC ─ layout! ─ ĐỌC ─ ĐỌC ─ ĐỌC ─ GHI ─ GHI ─ GHI ─ GHI ─ (layout 1 lần trước khi vẽ)
      ↑ chỉ 1 lần
```

Từ 500 lần layout xuống còn ~1. Đây là tối ưu hiệu năng frontend "rẻ" nhất mà bạn có thể học.

> Mẹo trong animation: dồn phần **đọc** vào một chỗ, phần **ghi** vào `requestAnimationFrame` — pattern này thường được gọi là *read/write batching* (thư viện FastDom làm đúng việc này).

---

## 📦 7. DocumentFragment — cái khay tạm

`DocumentFragment` là một node container **không nằm trong document**. Bạn lắp ráp trong khay, xong mới bê một lượt vào trang.

```js
const frag = document.createDocumentFragment();

for (let i = 0; i < 1000; i++) {
  const li = document.createElement('li');
  li.textContent = `Item ${i}`;
  frag.append(li);              // gắn vào KHAY → không đụng gì tới trang đang hiện
}

list.append(frag);              // 1 lần chạm vào DOM thật
```

Tính chất đặc biệt: khi bạn `append` một fragment, **các con của nó được chuyển vào** chỗ đích, còn bản thân fragment thì **biến mất** (rỗng, không tạo thẻ bọc nào trong DOM).

```
TRƯỚC:                          SAU list.append(frag):
  #document-fragment              ul
  ├── li Item 0                   ├── li Item 0
  ├── li Item 1        ───►       ├── li Item 1
  └── ...                         └── ...
  (fragment rỗng, tự tan)
```

### Vì sao ngày nay ít quan trọng hơn xưa?

Ngày trước, mỗi lần `append` vào DOM sống bị coi là gây một lần reflow, nên gom lại là tối ưu lớn. Ngày nay browser đã **gom (batch) các thay đổi** và chỉ layout một lần trước khung hình kế tiếp — nên vòng lặp `append` thẳng vào DOM cũng **không** gây 1000 lần layout như huyền thoại cũ.

Fragment vẫn còn hữu ích, nhưng vì lý do khác:

| Vẫn dùng khi | Vì |
| --- | --- |
| Dựng cây phức tạp rồi mới quyết chèn vào đâu | Code sạch, có "vùng nháp" |
| Nội dung của `<template>` | `template.content` **chính là** một `DocumentFragment` |
| Cần clone một cụm node để dùng nhiều lần | `frag.cloneNode(true)` |
| Muốn chắc chắn tránh mọi trạng thái trung gian bị đọc | Trong khay thì không ai layout được |

`<template>` là chỗ fragment lộ diện rõ nhất, và **Web Components dùng nó rất nhiều** — xem [[09 - Web Components - Truy vet mot custom element tu HTML den pixel]]:

```html
<template id="card-tpl">
  <div class="card"><h3></h3><p></p></div>
</template>
```
```js
const tpl = document.getElementById('card-tpl');
tpl.content;                       // → #document-fragment (KHÔNG được render ra trang)
const clone = tpl.content.cloneNode(true);
clone.querySelector('h3').textContent = 'Tiêu đề';
document.body.append(clone);
```

---

## 🔗 8. Chốt: React và Web Components liên quan gì tới chương này?

Toàn bộ API trên là **cách duy nhất** để thay đổi giao diện. Không có đường nào khác.

> **React sinh ra để bạn *không phải* viết những lệnh này bằng tay.**
> Nhưng đến cuối cùng, React **vẫn gọi đúng những API này** — `createElement`, `appendChild`, `setAttribute`, `textContent`. Nó chỉ tự động hoá việc quyết định *gọi cái nào, lúc nào*. Truy vết đầy đủ ở [[07 - React - Truy vet mot lan setState tu click den pixel]].
>
> **Web Components thì đi hướng khác**: nó không đứng ngoài điều khiển, mà **thêm một loại node MỚI vào chính cây DOM này** — một element mà browser hiểu bản địa. Xem [[09 - Web Components - Truy vet mot custom element tu HTML den pixel]].

### Cùng một UI, viết 3 cách

Chỉ để bạn "thấy hình" — không giải thích sâu, note 05–11 lo phần đó.

**a) DOM thuần**

```js
const btn = document.createElement('button');
let count = 0;
btn.textContent = `Đã bấm ${count} lần`;
btn.addEventListener('click', () => {
  count++;
  btn.textContent = `Đã bấm ${count} lần`;   // 👈 TỰ TAY cập nhật DOM
});
document.body.append(btn);
```

**b) React**

```jsx
function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>
      Đã bấm {count} lần
    </button>
  );
}
// 👆 bạn mô tả "giao diện TRÔNG NHƯ THẾ NÀO ứng với state".
//    React tự tính ra cần gọi lệnh DOM nào.
```

**c) Web Component**

```js
class ClickCounter extends HTMLElement {
  #count = 0;
  connectedCallback() {                 // browser gọi khi element vào DOM
    this.innerHTML = `<button>Đã bấm 0 lần</button>`;
    this.querySelector('button').addEventListener('click', () => {
      this.#count++;
      this.querySelector('button').textContent = `Đã bấm ${this.#count} lần`;
    });
  }
}
customElements.define('click-counter', ClickCounter);
```
```html
<click-counter></click-counter>   <!-- 👆 dùng như một thẻ HTML bình thường -->
```

Ba đoạn code, một kết quả, và **cả ba đều kết thúc ở cùng những lệnh DOM** rồi đi tiếp vào layout → paint → composite của note 01.

---

## ⚠️ Bẫy thường gặp

| Bẫy | Triệu chứng | Cách tránh |
| --- | --- | --- |
| Nhầm `view-source` với DOM | "Sao View Source trang React trống trơn?" | Dùng tab Elements để xem DOM thật |
| Tin vào HTML mình viết | CSS `table > tr` không ăn | Nhìn cây thật — có `tbody` chen vào |
| `firstChild` trả về `#text` | `el.firstChild.tagName` là `undefined` | Dùng `firstElementChild` |
| Vòng lặp trên HTMLCollection live | Treo tab hoặc xoá sót phần tử | `querySelectorAll`, hoặc `[...collection]` |
| `innerHTML` với dữ liệu người dùng | Lỗ hổng **XSS** | `textContent`, hoặc sanitize |
| Nhầm attribute với property | `getAttribute('value')` trả giá trị cũ | Đọc `el.value` cho trạng thái hiện tại |
| Đọc-ghi xen kẽ trong vòng lặp | Trang khựng khi scroll/resize | Gom ĐỌC trước, GHI sau |
| Gán lại `innerHTML` cả khối | Event listener của con biến mất, mất focus/scroll | Sửa đúng node cần sửa |
| Quên `data-*` luôn là chuỗi | `dataset.count + 1` ra `"01"` | `Number(el.dataset.count) + 1` |

---

## ✅ Nhớ 5 điều

- **HTML là text, DOM là cây object sống.** `view-source` cho bạn xem HTML gốc; tab Elements cho bạn xem DOM hiện tại. Lẫn hai thứ này là mất hàng giờ debug.
- **DOM khác HTML bạn gõ**: parser tự chèn `<tbody>`, tự đóng thẻ, tự đá element lạc chỗ ra ngoài. Luôn tin cây thật.
- **Khoảng trắng cũng là Text node.** Dùng nhóm API có chữ `Element` (`firstElementChild`, `children`) cho lành.
- **`querySelectorAll` static, `getElementsBy*` live.** Chọn nhầm là treo vòng lặp hoặc xoá sót.
- **DOM đắt vì hệ quả layout/paint, không vì bản thân lời gọi.** Gom ĐỌC rồi gom GHI để tránh layout thrashing — và nhớ `textContent` thay vì `innerHTML` với dữ liệu người dùng.

---

## 📚 Nguồn

- [MDN — Document Object Model (DOM)](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model)
- [MDN — Introduction to the DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction)
- [MDN — `Node`](https://developer.mozilla.org/en-US/docs/Web/API/Node) · [`Element`](https://developer.mozilla.org/en-US/docs/Web/API/Element) · [`Text`](https://developer.mozilla.org/en-US/docs/Web/API/Text)
- [MDN — `HTMLCollection`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCollection) · [`NodeList`](https://developer.mozilla.org/en-US/docs/Web/API/NodeList)
- [MDN — `Element.innerHTML` (mục Security considerations)](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML)
- [MDN — `Element.setAttribute()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/setAttribute)
- [MDN — `HTMLElement.dataset`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset)
- [MDN — `DocumentFragment`](https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment) · [`<template>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/template)
- [HTML Standard — Tree construction (foster parenting, tbody…)](https://html.spec.whatwg.org/multipage/parsing.html#tree-construction)
- [Paul Irish — What forces layout / reflow](https://gist.github.com/paulirish/5d52fb081b3570c81e3a)
- [web.dev — Avoid large, complex layouts and layout thrashing](https://web.dev/articles/avoid-large-complex-layouts-and-layout-thrashing)
- [OWASP — DOM based XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/DOM_based_XSS_Prevention_Cheat_Sheet.html)
