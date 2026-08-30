# 06 — Events & giao tiếp giữa component

> Nguyên tắc một câu: **property đi xuống, event đi lên** (props down, events up).
> Phát event từ trong shadow DOM cần **cả hai**: `bubbles: true` để leo lên cây, `composed: true` để thoát khỏi shadow root.
> Và `event.target` bị **retarget** thành host khi ra ngoài — muốn node thật thì dùng `composedPath()`.

Series: [[00 - Roadmap Web Components - Lit]]
Note anh em: [[02 - Custom Elements]] · [[03 - Shadow DOM]] · [[04 - Template va Slot]]

---
## 🧭 1. Props down / events up

`parent ── set property/attribute ──▶ <my-child>` · `parent ◀── dispatchEvent(CustomEvent) ── <my-child>`

- **Child không biết parent là ai.** Nó chỉ "la lên" rằng có chuyện xảy ra; ai nghe và làm gì không phải việc của nó.
- **Child không gọi method của parent.** `this.parentElement.doSomething()` → coupling chặt, component chỉ dùng được đúng một chỗ, khó test, vỡ ngay khi ai đó bọc thêm một `<div>` ở giữa.
- Pattern an toàn: child phát event → parent đổi property → property chảy ngược xuống child (one-way data flow, giống controlled component của React).

| Hướng | Cơ chế |
| --- | --- |
| Parent → child | property (ưu tiên — truyền được object/array), attribute (chỉ string) |
| Child → parent | `CustomEvent` + bubbling, data nằm trong `detail` |
| Child ↔ child khác nhánh | bubbling lên container chung, hoặc context/store (mục 8) |

---
## 📣 2. `CustomEvent`

```js
this.dispatchEvent(new CustomEvent('joy-change', {
  detail: { value: this.value, oldValue },   // payload
  bubbles: true,      // đi lên theo cây DOM
  composed: true,     // xuyên qua shadow boundary
  cancelable: false,  // parent có preventDefault() được không
}));
```

| Option | Mặc định | Ý nghĩa |
| --- | --- | --- |
| `detail` | `null` | Payload tuỳ ý — chỉ đây mới nhét được data. Nên là object để sau thêm field không breaking. |
| `bubbles` | `false` | `false` = chỉ listener gắn đúng element đó bắt được. |
| `composed` | `false` | `false` = event **dừng lại ở shadow root**, bên ngoài không thấy gì. |
| `cancelable` | `false` | Cho phép `preventDefault()`. `dispatchEvent()` trả `false` nếu bị huỷ. |

Hay quên: **`detail` không được clone** (là reference thật — listener sửa object trong `detail` là sửa data của bạn); **`dispatchEvent` chạy đồng bộ** (mọi listener chạy xong hàm mới return, nên đọc `defaultPrevented` ngay sau đó là hợp lệ). Muốn type tốt hơn thì subclass `Event` và gắn field riêng, nhưng `detail` là quy ước phổ biến hơn — chọn một, giữ nhất quán cả design system.

---
## 🚪 3. `composed: true` ⭐ — cửa ra khỏi shadow DOM

```js
this.dispatchEvent(new CustomEvent('save', { bubbles: true }));                 // ❌ kẹt ở shadow root
this.dispatchEvent(new CustomEvent('save', { bubbles: true, composed: true })); // ✅ ra tới document
```

> Cần **cả hai**: `composed: true` mà `bubbles: false` thì event vẫn không leo lên cây (trừ khi bắt ở capture phase).

**Quy tắc chung** (MDN `Event.composed`): *"All UA-dispatched UI events are composed (click/touch/mouseover/copy/paste, etc.). Most other types of events are not composed"* — event do JS tự tạo mặc định `composed: false`.

Các trường hợp đã kiểm chứng tận spec (những cái còn lại: đừng đoán, đo bằng code ở dưới):

| Event | `composed` | Nguồn |
| --- | --- | --- |
| `focus`, `blur`, `focusin`, `focusout` | ✅ `true` | UI Events, bảng định nghĩa từng event |
| `keydown`, `keyup`, `beforeinput`, `input` | ✅ `true` | UI Events |
| `pointerdown/up/move/over/out/cancel` | ✅ `true` | Pointer Events |
| `pointerenter`, `pointerleave` | ❌ `false` | Pointer Events: *"For `pointerenter` and `pointerleave` events, the `composed` attribute SHOULD be `false`"* |
| `mouseenter`, `mouseleave` | ❌ `false` | MDN `mouseenter` (cũng không bubble) |
| `slotchange` | ❌ `false` | DOM Standard fire nó chỉ với `bubbles: true` |
| `change` | ❌ `false` | HTML Standard: *"fire an event named `change` at element, with the `bubbles` attribute initialized to true"* — không set `composed` |

⚠️ Vài trang MDN mâu thuẫn nhau ở ô `composed` (vd `mouseleave`). Không có bảng chính thức đầy đủ cho mọi event → khi nghi ngờ, đo 3 giây:
```js
document.addEventListener('change', e => console.log(e.bubbles, e.composed), true);
```

**Hệ quả thực tế:** `change` không composed → component bọc `<input>` trong shadow DOM thì event `change` của input **không ra tới ngoài**. Phải tự re-dispatch:
```js
input.addEventListener('change', () => this.dispatchEvent(new CustomEvent('joy-change',
  { detail: { value: input.value }, bubbles: true, composed: true })));
```

---
## 🎯 4. Event retargeting & `composedPath()`

Khi event qua shadow boundary, browser **đổi `event.target`** thành host — để bên ngoài không cần (và không nên) biết cấu trúc bên trong component.

```js
// <my-button>: shadow root chứa <button><span id="label">Click</span></button>
const root = this.attachShadow({ mode: 'open' });
root.addEventListener('click', e =>                          // TẦNG 1 — trong shadow root
  console.log('[shadow]  target =', e.target.tagName));      // SPAN — node thật

document.body.addEventListener('click', e => {               // TẦNG 2 — ngoài shadow root
  console.log('[document] target =', e.target.tagName);      // MY-BUTTON — đã retarget
  console.log('[document] path   =', e.composedPath().map(n => n.nodeName ?? n));
  // ["SPAN", "BUTTON", "#document-fragment", "MY-BUTTON", "BODY", "HTML", "#document", Window]
});                                  // Window không phải Node nên không có nodeName
```

`composedPath()` trả mảng các `EventTarget` mà listener sẽ được gọi, từ node gốc thật lên `Window`. `mode: 'open'` → path chứa cả node bên trong shadow (`ShadowRoot` in ra `#document-fragment`); `mode: 'closed'` → path **bị cắt tại host**: `[MY-BUTTON, BODY, HTML, #document, Window]`. Dùng nhiều nhất cho click-outside, vì `el.contains(e.target)` sẽ **sai** khi click vào node trong shadow DOM — thay bằng `e.composedPath().includes(el)`. Muốn node gốc thật: `e.composedPath()[0]`.

---
## 🏷 5. Quy ước đặt tên event

Công thức: `<prefix>-<động từ/danh từ>` — ví dụ `joy-change`, `joy-open`, `joy-before-close`.

1. **lowercase, nối bằng `-`. Không camelCase.** HTML attribute không phân biệt hoa thường nên `onJoyChange` trong markup vô nghĩa; event built-in cũng đều lowercase.
2. **Có prefix** trùng prefix component (`joy-`) → tránh đụng event built-in và component của thư viện khác.
3. **Đừng dùng lại tên built-in** đã có ngữ nghĩa khác (`change`, `input`, `close` — `close` là event thật của `<dialog>`). Cặp before/after đặt rõ: `joy-before-close` (cancelable) vs `joy-after-close` (đã xong).

**Vấn đề với React ≤ 18:** React 19 release notes tự mô tả: *"In past versions, using Custom Elements in React has been difficult because React treated unrecognized props as attributes rather than properties."* Hệ quả kép — object/array truyền vào bị stringify thành attribute, và `onJoyChange` chỉ là một prop lạ chứ **không** map thành `addEventListener('joy-change')`. Listener im lặng không chạy, không lỗi, không cảnh báo.
```jsx
const ref = useRef(null);                          // React ≤ 18: gắn tay bằng ref
useEffect(() => {
  const el = ref.current, onChange = e => setValue(e.detail.value);
  el.addEventListener('joy-change', onChange);
  return () => el.removeEventListener('joy-change', onChange);
}, []);
return <joy-input ref={ref} />;   // JSX: tên tag có gạch ngang → React render ra custom element
```

Hoặc dùng wrapper `@lit/react` (`createComponent`) — nó khai báo sẵn map `onJoyChange → 'joy-change'`. **React 19** đã pass 100% bộ test custom-elements-everywhere (6/6 attributes & properties, 7/7 DOM events, kể cả tên event kebab-case): trên client, prop nào trùng tên một property có sẵn trên instance thì set bằng property, còn lại set bằng attribute; khi SSR chỉ primitive (`string`, `number`, `true`) mới ra attribute, `object`/`function`/`false` bị bỏ qua. Vẫn nên ship wrapper nếu library nhắm người dùng React ≤ 18.

---
## 🛑 6. `cancelable` + `preventDefault()`

```js
close(reason = 'user') {
  const evt = new CustomEvent('joy-before-close', { detail: { reason },
    bubbles: true, composed: true,
    cancelable: true });                  // ⭐ thiếu thì preventDefault() vô hiệu
  if (!this.dispatchEvent(evt)) return;   // trả false = có listener gọi preventDefault()
  this.open = false;
  this.dispatchEvent(new CustomEvent('joy-after-close', { bubbles: true, composed: true }));
}

modal.addEventListener('joy-before-close', e => {   // phía parent — chặn khi form còn dở
  if (formDirty) { e.preventDefault(); showToast('Còn thay đổi chưa lưu'); }
});
```

> ⚠️ `preventDefault()` trên event **không** `cancelable` không báo lỗi — nó im lặng không làm gì. Bug hay tốn nửa buổi để tìm. Và vì `dispatchEvent` đồng bộ, listener **không thể async** để chặn: muốn xác nhận bất đồng bộ thì luôn `preventDefault()`, xử lý xong rồi gọi lại `close()` với cờ `force`.

---
## 🧹 7. Đăng ký & gỡ listener

Quy tắc vàng: **đăng ký trong `connectedCallback`, gỡ trong `disconnectedCallback`.** Element có thể bị gỡ rồi gắn lại nhiều lần → không cleanup là leak + double-fire.

```js
class MyWidget extends HTMLElement {
  #ac;
  connectedCallback() {
    this.#ac = new AbortController();
    const { signal } = this.#ac;                 // 1 signal cho mọi listener
    this.addEventListener('click', this.#onClick, { signal });
    window.addEventListener('resize', this.#onResize, { signal });
    document.addEventListener('keydown', this.#onKeydown, { signal });
  }
  disconnectedCallback() { this.#ac.abort(); }   // gỡ hết, kể cả trên window/document

  #onClick = () => { /* ... */ };  #onResize = () => { /* ... */ };
  #onKeydown = e => { if (e.key === 'Escape') this.close(); };
}
```

`AbortController` khỏi phải giữ reference từng handler để `removeEventListener`; cùng một `signal` dùng được cho `fetch()` → `abort()` huỷ luôn request đang bay. Option `signal` của `addEventListener` là Baseline *widely available*. **3 cách giữ `this` đúng:**
```js
constructor() { super(); this.onClick = this.onClick.bind(this); }  // (a) bind — dài, dễ quên reference
#onClick = e => { this.value++; };                                  // (b) arrow class field ⭐ gọn nhất
handleEvent(e) { if (e.type === 'click') this.onClick(e); }         // (c) addEventListener('click', this)
```

(c) `handleEvent` không tốn closure và remove rất gọn (`removeEventListener('click', this)`), đổi lại phải tự switch theo `e.type`. ⚠️ Đừng viết `addEventListener('click', () => ...)` rồi định `removeEventListener` — arrow tạo tại chỗ không có reference để gỡ.

---
## 🔗 8. Component không cùng cha

**Cách 1 — bubbling lên container chung**, khi có element cha bọc cả nhóm. `<joy-tabs>` nghe event từ mọi `<joy-tab>` con, dù lồng sâu bao nhiêu:

```js
this.addEventListener('joy-tab-select', e => {
  this.#activate(e.target);   // <joy-tab> — nó dispatch trên chính nó (hoặc đã bị retarget về host)
  e.stopPropagation();        // không cho rò ra ngoài
});
```
**Cách 2 — context / store**, khi hai component ở hai nhánh cây khác hẳn (theme, i18n, session, giỏ hàng) — bubbling không tới được: `@lit/context` (provide/consume, giống React Context); store ngoài (Nanostores, Zustand, Redux) subscribe qua một Reactive Controller; hoặc event trên `document`/`window` như event bus — đơn giản nhưng dễ thành global mess, chỉ dùng cho số ít event thật sự toàn cục. → chi tiết ở [[04 - Quan ly data - Context, Task, Signals]].

> Rule of thumb: **event cho tương tác** (user vừa làm gì), **context/store cho state** (hệ thống đang ở trạng thái nào).

---
## 🧩 9. Ví dụ hoàn chỉnh — `<my-modal>` cancelable

```js
const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host { display: none; }  :host([open]) { display: block; }
    .backdrop { position: fixed; inset: 0; background: rgb(0 0 0 / .5); }
    .panel { position: fixed; inset: 50% auto auto 50%; transform: translate(-50%,-50%); background: #fff; }
  </style>
  <div class="backdrop" part="backdrop"></div>
  <div class="panel" part="panel" role="dialog" aria-modal="true">
    <button class="close" aria-label="Đóng">&times;</button><slot></slot></div>`;

class MyModal extends HTMLElement {
  #ac;
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).appendChild(template.content.cloneNode(true));
  }
  connectedCallback() {
    this.#ac = new AbortController();
    const { signal } = this.#ac, root = this.shadowRoot;
    root.querySelector('.close').addEventListener('click', () => this.close('close-button'), { signal });
    root.querySelector('.backdrop').addEventListener('click', () => this.close('backdrop'), { signal });
    const esc = e => { if (e.key === 'Escape' && this.open) this.close('escape'); };
    document.addEventListener('keydown', esc, { signal });
  }
  disconnectedCallback() { this.#ac.abort(); }
  get open()  { return this.hasAttribute('open'); }
  set open(v) { this.toggleAttribute('open', Boolean(v)); }

  close(reason = 'api') {
    const allowed = this.dispatchEvent(new CustomEvent('modal-close', {
      detail: { reason }, bubbles: true, composed: true, cancelable: true,
    }));
    if (!allowed) return false;   // parent đã preventDefault() → giữ modal mở
    this.open = false;
    return true;
  }
}
customElements.define('my-modal', MyModal);
```

```html
<my-modal open><h2>Chỉnh sửa hồ sơ</h2><input id="name" value="Tinh"></my-modal>
<script type="module">
  import './my-modal.js';
  let dirty = false;
  document.querySelector('#name').addEventListener('input', () => { dirty = true; });

  // Nghe ở document — chạy được vì event có bubbles + composed
  document.addEventListener('modal-close', e => {
    // reason: 'escape' | 'backdrop' | 'close-button' | 'api'; path[0] = chính <my-modal> vì event
    console.log(e.detail.reason, e.composedPath()[0]); // được dispatch trên host, không phải trong shadow
    if (dirty && !confirm('Bỏ thay đổi chưa lưu?')) e.preventDefault(); // chặn — modal vẫn mở
  });
</script>
```

---
## ⚠️ Bẫy thường gặp

1. **Quên `composed: true`** → event kẹt trong shadow root, parent im lặng không nghe thấy. Bug số 1. Và **quên `bubbles: true`** → chỉ listener gắn đúng element đó bắt được; `composed` một mình không đủ.
2. **Quên `cancelable: true`** → `preventDefault()` của parent không làm gì, cũng không báo lỗi.
3. **Tưởng `e.target` là node bên trong** → đã retarget thành host. Dùng `e.composedPath()[0]`.
4. **`el.contains(e.target)` cho click-outside** → sai khi click vào node trong shadow DOM.
5. **`mode: 'closed'` cắt `composedPath()`** tại host → debug và tooling đều khó. Mặc định cứ `open`.
6. **`change` không composed** → wrapper bọc `<input>` trong shadow DOM phải tự re-dispatch. (`slotchange` cũng không composed, nhưng nó là chuyện nội bộ component — đừng re-dispatch.)
7. **Tên event camelCase** (`joyChange`) → sai quy ước, vô nghĩa trong markup. Và **React ≤ 18 không bind `onJoyChange`** → dùng ref hoặc `@lit/react`.
8. **Không cleanup listener trên `window`/`document`** → memory leak; arrow inline thì không có reference để gỡ.
9. **Sửa object trong `e.detail`** → `detail` không clone, đó là data thật của component.
10. **Child gọi `parentElement.method()`** → vỡ khi có element bọc ở giữa. Phát event thay vì gọi.

---
## 📚 Nguồn

- [MDN — `CustomEvent`](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent) · [constructor](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent) · [`Event.composed`](https://developer.mozilla.org/en-US/docs/Web/API/Event/composed) · [`composedPath()`](https://developer.mozilla.org/en-US/docs/Web/API/Event/composedPath)
- [MDN — `preventDefault()`](https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault) · [`addEventListener()` (option `signal`)](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener) · [`AbortController`](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)
- Bảng `composed`: [UI Events](https://w3c.github.io/uievents/) (focus/blur/focusin/focusout, keydown/keyup, beforeinput/input) · [Pointer Events](https://w3c.github.io/pointerevents/) (`pointerenter`/`pointerleave` SHOULD be `false`) · [MDN `mouseenter`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseenter_event) · [DOM Standard — signaling slot change](https://dom.spec.whatwg.org/#signaling-slot-change) · [HTML Standard — form elements](https://html.spec.whatwg.org/multipage/form-elements.html) (event `change`)
- [React 19 release notes — Support for Custom Elements](https://react.dev/blog/2024/12/05/react-19) · [custom-elements-everywhere — React](https://custom-elements-everywhere.com/libraries/react/results/results.html)
