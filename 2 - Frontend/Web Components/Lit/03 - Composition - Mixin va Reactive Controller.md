# 03 — Composition: Mixin và Reactive Controller
> Chia sẻ **logic** (không phải UI) giữa các component. Lit có 3 công cụ: **component composition**, **class mixin**, **reactive controller**.
> Chốt: mặc định dùng **Reactive Controller**, chỉ dùng mixin khi cần thêm API công khai vào class.

Series: [[00 - Roadmap Web Components - Lit]]

## 🎯 Vấn đề
Có loại code không phải UI: global event listener, `ResizeObserver`/`IntersectionObserver`, async task, timer/animation, subscribe store ngoài. Nhét hết vào `connectedCallback`/`disconnectedCallback` từng component → copy-paste, quên cleanup, component phình.

| Công cụ | Quan hệ | Dùng khi |
| --- | --- | --- |
| Component composition | has-a (DOM) | Chia sẻ **UI** + state đi kèm |
| Class mixin | **is-a** | Thêm **API công khai** (property/method) vào component |
| Reactive controller | **has-a** | Chia sẻ **behavior/state**, không cần lộ API |

## 🧩 1. Component composition
Cách tổ chức **mặc định** cho project Lit lớn.

**Tách component riêng khi** mảnh UI đó: có state riêng, có template riêng, tái sử dụng nhiều nơi, làm một việc và làm tốt, có API rõ ràng (property + event).
**Không tách khi**: vài dòng markup dùng đúng 1 chỗ, không state → viết hàm `renderXxx()` trả `TemplateResult` là đủ, đừng đẻ custom element.

### Props down / events up
```js
render() {
  return html`<my-menu .items=${this.items} .selected=${this.selected}
    @selected-item-changed=${(e) => (this.selected = e.detail.item)}></my-menu>`;
}
```
- Parent **set property** xuống con (khai báo được trong template) — hạn chế gọi method.
- Con **bắn event** lên: `dispatchEvent(new CustomEvent('selected-item-changed', {detail: {item}}))`.
- Con **không** set property / gọi method lên host. Giống `<input>`: bạn set `value`, nó bắn `input`/`change`.
- 2 component ngang hàng → **mediator pattern**: parent (hoặc store) nghe event của A rồi set property cho B.

### Slot — đảo ngược điều khiển
`<slot>` = `children` của React: user quyết định nội dung, component quyết định **chỗ đặt**.

```js
render() {
  return html`<header><slot name="title"></slot></header>
    <div class="body"><slot @slotchange=${this._onSlot}></slot></div>`;
}
_onSlot(e) { this._items = e.target.assignedElements({flatten: true}); }
```
Light DOM children do bên ngoài quản lý (thêm/xoá lúc nào cũng được), component vẫn đọc được qua `assignedElements()` + `slotchange`.

## 🔀 2. Class Mixins
Mixin = **subclass factory**: nhận base class, trả subclass đã mở rộng.

```js
const MyMixin = (superClass) => class extends superClass { /* field & method thêm */ };
class MyElement extends MyMixin(LitElement) { /* ... */ }
export const LitElementWithMixin = MyMixin(LitElement);  // đóng gói base dùng chung
```

### Override lifecycle — luôn gọi `super`
```js
const LoggingMixin = (superClass) => class extends superClass {
  constructor() { super(); console.log(`${this.localName} created`); }
  connectedCallback() { super.connectedCallback(); }  // bắt buộc, thiếu là component trắng
  updated(changed) { super.updated?.(changed); }      // hook có thể không tồn tại → ?.
};
```

### Typing trong TypeScript
```ts
import {LitElement, html} from 'lit';
import {property} from 'lit/decorators.js';

type Constructor<T = {}> = new (...args: any[]) => T;
// A. Mixin KHÔNG thêm API mới (chỉ override) → cast về T
export const MyMixin = <T extends Constructor<LitElement>>(superClass: T) => {
  class MyMixinClass extends superClass {
    connectedCallback() { super.connectedCallback(); this.doPrivate(); }
    private doPrivate() { /* không cần lộ ra interface */ }
  }
  return MyMixinClass as T;
};
```

**B. Có thêm API công khai** → khai báo interface riêng rồi cast:
```ts
export declare class HighlightableInterface {
  highlight: boolean;
  protected renderHighlight(content: unknown): unknown;
}

export const Highlightable = <T extends Constructor<LitElement>>(superClass: T) => {
  class HighlightableClass extends superClass {
    @property({type: Boolean}) highlight = false;
    protected renderHighlight(content: unknown) {
      return this.highlight ? html`<div class="hl">${content}</div>` : content;
    }
  }
  return HighlightableClass as Constructor<HighlightableInterface> & T;
};
```

⚠️ **Decorator trong mixin (TS)**: giới hạn của type system TypeScript — decorator (`@property()`…) chỉ áp được lên **class declaration**, không áp được lên **class expression**. Nên phải khai báo `class X extends superClass {...}` trong thân hàm rồi `return X`, không dùng arrow-function shorthand trả thẳng class expression. 📖 [Applying decorators in mixins](https://lit.dev/docs/composition/mixins/#applying-decorators-in-mixins)

### Ví dụ thật: `ClickOutsideMixin`
```js
export const ClickOutsideMixin = (superClass) => class extends superClass {
  onClickOutside(event) {}               // API công khai để subclass override
  connectedCallback() {
    super.connectedCallback();
    // composedPath() xuyên qua shadow DOM
    this._outside = (e) => { if (!e.composedPath().includes(this)) this.onClickOutside(e); };
    document.addEventListener('pointerdown', this._outside);
  }
  disconnectedCallback() {
    document.removeEventListener('pointerdown', this._outside);
    super.disconnectedCallback();        // super gọi SAU khi cleanup
  }
};

class MyDropdown extends ClickOutsideMixin(LitElement) {
  static properties = {open: {type: Boolean, reflect: true}};
  onClickOutside() { this.open = false; }
}
customElements.define('my-dropdown', MyDropdown);
```

Hợp lý cho mixin vì nó **thêm API công khai** (`onClickOutside`).

### Nhược điểm
| Vấn đề | Chi tiết |
| --- | --- |
| Name collision | 2 mixin cùng đặt `this.value` → mixin sau đè, **im lặng** |
| Khó truy vết | `this.foo` từ đâu ra? phải đi ngược prototype chain |
| Thứ tự quan trọng | `A(B(Lit))` ≠ `B(A(Lit))` khi cùng override một method |
| Ô nhiễm public API | Mọi thứ mixin thêm nằm trên instance, bên ngoài chạm được |
| Duplication | Cùng một mixin bị apply nhiều lần qua chuỗi dependency → behavior nhân đôi. Cần `dedupeMixin` (open-wc) |
| Không có nhiều instance | Mixin nằm trên prototype chain → 1 lần dùng / class. Cần 2 "bản sao" logic thì phải dùng controller |

## ⚙️ 3. Reactive Controllers ⭐⭐
Một **object thường** móc vào update cycle của host, đăng ký bằng `host.addController(this)`.

| Hook | Khi nào | Dùng để |
| --- | --- | --- |
| `hostConnected()` | Host connect, sau khi shadow root đã tạo | Add listener, tạo observer |
| `hostUpdate()` | Trước `update()`/`render()` của host | Đọc DOM **trước** khi Lit ghi |
| `hostUpdated()` | Sau update, trước `updated()` của host | Đo DOM **sau** khi render |
| `hostDisconnected()` | Host disconnect | **Cleanup**: remove listener, clear timer |

Hook của controller luôn chạy **trước** callback tương ứng của host.

Interface `ReactiveControllerHost` chỉ có 4 thành viên: `addController(controller)`, `removeController(controller)`, `requestUpdate()`, `updateComplete: Promise<boolean>` → controller **không phụ thuộc LitElement**, test được bằng một host giả.

### So với React hooks
| | React hooks | Reactive Controller |
| --- | --- | --- |
| Bản chất | Function gọi trong render, state trong fiber | **Object** có state riêng, sống trong instance |
| Khai báo | Body render, chạy lại mỗi lần render | Khởi tạo **1 lần** ở class field |
| Rules of hooks | ❌ không được gọi trong `if`/loop | ✅ không có luật gì |
| Dependency array | ⚠️ tự khai báo; thiếu/thừa → effect chạy sai | ❌ không có — tự gọi `requestUpdate()` |
| Cleanup | `return () => {}` trong `useEffect` | `hostDisconnected()` |
| Stale closure | Vấn đề kinh điển | Không có — `this.x` luôn mới |
| Nhiều instance | Gọi `useX()` 2 lần | `new XController(this)` 2 lần |

Đổi lại: controller **không tự re-render** — đổi state xong phải `this.host.requestUpdate()`.

### Ví dụ 1 — `ClockController` (timer, tự cleanup)
```ts
import {ReactiveController, ReactiveControllerHost} from 'lit';

export class ClockController implements ReactiveController {
  host: ReactiveControllerHost;
  value = new Date();
  private _timerID?: number;

  constructor(host: ReactiveControllerHost, private timeout = 1000) {
    (this.host = host).addController(this);
  }
  hostConnected() {
    this._timerID = setInterval(() => {
      this.value = new Date();
      this.host.requestUpdate();        // báo host render lại
    }, this.timeout);
  }
  hostDisconnected() {
    clearInterval(this._timerID);       // cleanup, không leak
    this._timerID = undefined;
  }
}

class MyElement extends LitElement {
  private clock = new ClockController(this, 1000);
  render() { return html`<p>${this.clock.value.toLocaleTimeString()}</p>`; }
}
```

Element bị gỡ khỏi DOM → timer tự dừng, không cần nhớ gì.

### Ví dụ 2 — `MediaQueryController` (observer)
```js
export class MediaQueryController {
  constructor(host, query) {
    this.host = host;
    this._mql = window.matchMedia(query);
    this.matches = this._mql.matches;
    this._onChange = (e) => { this.matches = e.matches; this.host.requestUpdate(); };
    host.addController(this);
  }
  hostConnected() {
    this._mql.addEventListener('change', this._onChange);
    this._onChange(this._mql);          // re-sync + requestUpdate sau khi re-connect
  }
  hostDisconnected() { this._mql.removeEventListener('change', this._onChange); }
}

class ResponsiveBox extends LitElement {
  _mobile = new MediaQueryController(this, '(max-width: 640px)');
  render() {
    return this._mobile.matches ? html`<mobile-view></mobile-view>`
                                : html`<desktop-view></desktop-view>`;
  }
}
```

### Ví dụ 3 — Subscribe store ngoài (Zustand / Redux / Nanostores)
```js
export class StoreController {
  constructor(host, store, selector = (s) => s) {
    this.host = host; this.store = store; this.selector = selector;
    this.value = selector(store.getState());
    host.addController(this);
  }
  _sync() {
    const next = this.selector(this.store.getState());
    if (next !== this.value) {          // chỉ update khi slice thực sự đổi
      this.value = next;
      this.host.requestUpdate();
    }
  }
  hostConnected() {
    this._unsub = this.store.subscribe(() => this._sync());
    this._sync();                       // store có thể đã đổi lúc element disconnect
  }
  hostDisconnected() { this._unsub?.(); this._unsub = undefined; }
}

class CartBadge extends LitElement {
  _count = new StoreController(this, cartStore, (s) => s.items.length);
  render() { return html`<span class="badge">${this._count.value}</span>`; }
}
```

Chi tiết theo từng store: [[04 - Quan ly data - Context, Task, Signals]].

### Dùng chung host, lồng nhau, kèm directive
Controller có identity riêng, không nằm trên prototype → **nhiều instance trên cùng một host** là chuyện bình thường. Lồng nhau thì forward `host` xuống controller con:

```js
class DualClockController {
  constructor(host, d1, d2) {
    this.clock1 = new ClockController(host, d1);   // cùng một host
    this.clock2 = new ClockController(host, d2);
  }
  get time1() { return this.clock1.value; }
  get time2() { return this.clock2.value; }
}
```
Doc còn nêu 2 pattern controller ↔ directive: **controller directive** (directive tự nó gọi `addController()` để hook vào lifecycle host) và **controller sở hữu directive** (controller expose method trả về directive, để trỏ vào đúng element cần theo dõi):
```js
render() {
  return html`<textarea ${this._textSize.observe()}></textarea>
    <p>The width is ${this._textSize.contentRect?.width}</p>`;
}
```
(Đây là `ResizeController` **giả định** trong doc để minh hoạ pattern — API khác với `ResizeController` thật của `@lit-labs/observers` bên dưới.)

## 📦 `@lit-labs/observers` — controller có sẵn
```js
// npm i @lit-labs/observers
import {ResizeController} from '@lit-labs/observers/resize-controller.js';

class MyBox extends LitElement {
  // `value` = KẾT QUẢ của `callback`. Không truyền callback → value luôn undefined.
  _resize = new ResizeController(this, {
    callback: (entries) => entries[0]?.contentRect.width,
  });
  render() { return html`<div>${this._resize.value ?? 0}px</div>`; }
}
```
4 controller, mỗi cái một entrypoint riêng: `ResizeController` (`/resize-controller.js`), `IntersectionController` (`/intersection-controller.js`), `MutationController` (`/mutation-controller.js`), `PerformanceController` (`/performance-controller.js`).
Config chung: `target` (mặc định = host, `null` = không tự observe), `config` (options của observer gốc), `callback`, `skipInitial`. Gọi `.observe(el)` để theo dõi thêm element khác.

⚠️ **Labs**: `@lit-labs/observers` vẫn nằm trong Lit Labs (nhóm *near graduation*) — "may receive breaking changes or stop being supported". Pin version nếu dùng production. Khi graduate sẽ đổi scope sang `@lit/`.

## 🧭 Bảng quyết định
| Bài toán | Chọn |
| --- | --- |
| Mảnh UI có state + template, dùng nhiều nơi | Component composition |
| User tự quyết nội dung bên trong | Slot |
| 2 component ngang hàng cần đồng bộ | Mediator (parent) hoặc store + controller |
| Timer / animation / polling · global listener · observer | **Controller** |
| Fetch async + pending/error | **Controller** (`@lit/task`) |
| Subscribe store ngoài | **Controller** |
| Cần **2 instance** cùng loại logic trong 1 component | **Controller** (mixin không làm được) |
| Thêm **property/method công khai** cho mọi component dùng nó | **Mixin** |
| Override lifecycle rất sâu (`update`, `createRenderRoot`, `static styles`) | **Mixin** |

> Mặc định **controller**. Chỉ sang mixin khi cần mở rộng API công khai hoặc cần hook controller không có. Kết hợp cũng được: mixin làm lớp API, bên trong dùng controller làm việc thật.

## ⚠️ Bẫy thường gặp
1. **Quên `super.connectedCallback()`** trong mixin → Lit không chạy update đầu, component trắng trơn. `disconnectedCallback` thì gọi `super` **cuối cùng**, sau cleanup.
2. **Quên `host.addController(this)`** trong constructor → không hook nào chạy, không báo lỗi.
3. **Quên `requestUpdate()`** sau khi đổi state trong controller → data đúng, UI đứng im. Controller không có reactive property tự động.
4. **Add listener trong `constructor`** thay vì `hostConnected()` → element move trong DOM sẽ mất listener hoặc leak. Luôn cặp `hostConnected`/`hostDisconnected`.
5. **`hostConnected` chạy nhiều lần** (move element = disconnect + connect) → code phải idempotent, đừng cộng dồn listener.
6. **Đọc DOM trong `hostUpdate()`** khi cần giá trị *sau* render → sai, phải dùng `hostUpdated()`.
7. **Thứ tự mixin** khi nhiều mixin override cùng method → kết quả đổi theo thứ tự apply. Luôn gọi `super` để chain không đứt.
8. **Name collision** mixin ↔ class → không warning. Prefix tên (`_myMixinX`) hoặc dùng private field `#x`.
9. **Subscribe store không so sánh slice** → mọi thay đổi bất kỳ đều `requestUpdate()` cả component.
10. **Dùng mixin cho việc controller làm được** → phình public API, khó test. Controller test được độc lập bằng host giả.

## 📚 Nguồn
- [Composition overview](https://lit.dev/docs/composition/overview/) · [Component composition](https://lit.dev/docs/composition/component-composition/) · [Mixins](https://lit.dev/docs/composition/mixins/) · [Reactive controllers](https://lit.dev/docs/composition/controllers/)
- [`@lit-labs/observers`](https://github.com/lit/lit/tree/main/packages/labs/observers) · [Lit Labs — trạng thái package](https://lit.dev/docs/libraries/labs/) (⚠️ Labs)
- [Dedupe mixin — open-wc](https://open-wc.org/docs/development/dedupe-mixin/)

Tiếp theo: [[04 - Quan ly data - Context, Task, Signals]]
