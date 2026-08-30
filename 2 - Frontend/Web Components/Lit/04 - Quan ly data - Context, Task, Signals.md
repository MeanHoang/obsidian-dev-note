# 04 — Quản lý data: Context, Task, Signals
> Lit không ép "state management". Nó cho 3 mảnh ghép: **`@lit/context`** (chia sẻ), **`@lit/task`** (async), **signals** (⚠️ Labs). Còn lại: store ngoài bọc bằng Reactive Controller.

Series: [[00 - Roadmap Web Components - Lit]]

## 🗺 Bức tranh tổng
```
@state/@property → @lit/context → @lit/task → signals (⚠️Labs) / store ngoài
  state cục bộ     chia sẻ xuống    async +     reactive graph / Redux-Zustand
                   sâu, DI          abort       bọc bằng Reactive Controller
```
| Vấn đề | Dùng |
| --- | --- |
| State chỉ 1 component dùng | `@state()` |
| Truyền cho con trực tiếp | property binding `.foo=${}` + event |
| Truyền xuống sâu, xuyên slot/shadow DOM | `@lit/context` |
| Fetch API, loading/error, race condition | `@lit/task` |
| Nhiều component khác nhánh dùng chung 1 giá trị | signals (⚠️ Labs) **hoặc** store ngoài |
| App lớn, devtools, time-travel | Redux/Zustand + controller |

## 🧵 1. `@lit/context` ⭐
`npm i @lit/context` — triển khai **Context Community Protocol** của W3C Web Components CG → interop được với thư viện khác, không riêng Lit. Đã **graduate khỏi Labs** (`@lit-labs/context` → scope `@lit`), bản stable 1.x.

### Cơ chế: event bubbling, không phải cây component ⭐
```
Consumer → dispatch ContextEvent('context-request')   // bubbles + composed
         → event nổi lên DOM tree
Provider → bắt event, gọi event.callback(value, dispose) → consumer nhận value
```
`ContextEvent` mang 4 field: `context` (key), `contextTarget` (element phát), `callback`, `subscribe`. Consumer disconnect → `ContextConsumer` gọi `dispose()` mà provider đưa, tự huỷ subscription.
Hệ quả thực tế:
- Provider **phải là ancestor trong DOM tree** của consumer (xuyên shadow DOM nhờ `composed: true`).
- Consumer nằm trong **light DOM** qua `<slot>` vẫn nhận được → làm plugin architecture rất tiện. React Context không làm được vì nó bám cây React chứ không phải DOM.
- Consumer connect **trước** provider → request bị hụt (xem phần bẫy).

### `createContext()`
```ts
// theme-context.ts
import {createContext} from '@lit/context';
export interface Theme { mode: 'light' | 'dark'; primary: string; }
export const themeContext = createContext<Theme>(Symbol('theme'));
```
`createContext(key)` trả về **chính `key`**, chỉ cast type ở TS để mang theo kiểu của value. Context dùng như key của `Map`, so sánh `===`:
- `createContext('theme')` (string) hoặc `Symbol.for('theme')` (global symbol) → 2 lần gọi ở 2 module cho **cùng một** context.
- `Symbol('theme')` hoặc `{}` → **unique tuyệt đối**, 2 lần gọi ra 2 context khác nhau.

👉 Doc khuyên mặc định dùng Symbol duy nhất; nếu buộc phải dùng string thì chọn chuỗi đặc thù (`'console-logger'` thay vì `'logger'`) để tránh 2 module vô tình trùng key. Nên đặt context object ở module riêng.

### Provider — `@provide()` hoặc `ContextProvider`
```ts
import {provide, ContextProvider} from '@lit/context';

@customElement('theme-provider')
export class ThemeProvider extends LitElement {
  @provide({context: themeContext})
  @state()
  theme: Theme = {mode: 'light', primary: '#0b6'};

  toggle() {
    // phải tạo object MỚI, mutate thì @state không nhận ra
    this.theme = {...this.theme, mode: this.theme.mode === 'light' ? 'dark' : 'light'};
  }
  render() { return html`<button @click=${this.toggle}>Toggle</button><slot></slot>`; }
}
```
Không dùng decorator thì dùng controller tương đương: `_p = new ContextProvider(this, {context: themeContext, initialValue: DEFAULT})`, đổi giá trị bằng `this._p.setValue(next)` — chỉ báo cho consumer khi value **đổi**; `setValue(next, true)` ép báo dù reference không đổi (dùng khi mutate sâu bên trong object).

### Consumer — `@consume()` hoặc `ContextConsumer`
```ts
import {consume, ContextConsumer} from '@lit/context';

@customElement('theme-badge')
export class ThemeBadge extends LitElement {
  @consume({context: themeContext, subscribe: true})
  @state()
  theme?: Theme;

  render() {
    if (!this.theme) return html`<span>…</span>`;   // context có thể chưa tới
    return html`<span style="color:${this.theme.primary}">mode = ${this.theme.mode}</span>`;
  }
}
```
Bản controller: `_theme = new ContextConsumer(this, {context: themeContext, subscribe: true})`, đọc bằng `this._theme.value`.
Dùng: `<theme-provider><theme-badge></theme-badge></theme-provider>` — `<theme-badge>` nằm ở light DOM vẫn nhận được context.

### `subscribe`
| | Hành vi |
| --- | --- |
| `subscribe: false` (mặc định) | Lấy giá trị **1 lần** lúc connect; provider đổi sau đó → consumer **không** biết |
| `subscribe: true` | Giữ subscription; provider `setValue()` → consumer nhận + `requestUpdate()` |

👉 Service/DI (không đổi) → `false`. Theme/locale/user (đổi runtime) → **`true`**.

### So với React Context
| | React Context | `@lit/context` |
| --- | --- | --- |
| Cơ chế | React tree (fiber) | **DOM event** `context-request` (bubbles + composed) |
| Xuyên shadow DOM / slot | N/A · ❌ | ✅ · ✅ |
| Interop khác framework | ❌ | ✅ chuẩn W3C CG |
| Re-render khi value đổi | Mọi component đang consume context đó | Chỉ consumer khai `subscribe: true` |
| Provider chưa mount | Không vấn đề (render top-down) | ⚠️ cần `ContextRoot` |
| Default value | `createContext(default)` | Không có — consumer nhận `undefined` |

**Use case**: theme/design tokens · i18n, `Intl` formatter · service/DI (API client, logger, analytics, feature flag) · current user/auth · plugin registry cho light DOM children.

## ⚡ 2. `@lit/task` ⭐
`npm i @lit/task` — cũng đã **graduate khỏi Labs** (`@lit-labs/task` → `@lit/task`), bản stable 1.x.

**Bài toán**: fetch trong `updated()` = tự giữ `loading`/`error`/`data`, **race condition** (đổi id liên tục, response cũ về sau ghi đè data mới), không hủy request cũ, không biết khi nào chạy lại. `Task` là một **Reactive Controller** giải quyết cả 4.

### Ví dụ hoàn chỉnh: fetch user theo `userId`
```js
import {LitElement, html} from 'lit';
import {Task} from '@lit/task';

class UserCard extends LitElement {
  static properties = {userId: {type: String}};
  userId = '';

  _userTask = new Task(this, {
    task: async ([userId], {signal}) => {
      if (!userId) return undefined;
      const res = await fetch(`https://api.example.com/users/${userId}`, {signal});
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    },
    args: () => [this.userId],   // autoRun: true là mặc định
  });

  render() {
    return html`
      <input .value=${this.userId} @input=${(e) => (this.userId = e.target.value)} />
      ${this._userTask.render({
        pending:  () => html`<p>Đang tải…</p>`,
        complete: (u) => u ? html`<h3>${u.name}</h3><p>${u.email}</p>`
                           : html`<p>Nhập user id</p>`,
        error:    (e) => html`<p class="err">${e.message}</p>`,
      })}`;
  }
}
customElements.define('user-card', UserCard);
```
Đổi `userId` → task tự re-run, request cũ tự abort.

**Config của `new Task(host, {...})`**: `task` (hàm async), `args` (hàm trả mảng tham số), `autoRun` (mặc định `true`), `argsEqual`, `initialValue`, `onComplete`, `onError`.
- `args` được gọi **sau mỗi lần host update**, so với mảng args lần trước; khác → chạy lại. Mặc định so bằng `shallowArrayEquals` (từng phần tử, `===`). Args là object → dùng `argsEqual: deepArrayEquals` (import từ `@lit/task/deep-equals.js`).
- `args: () => []` → chạy **đúng 1 lần**. **Không khai báo `args`** → task ở chế độ manual, y như `autoRun: false`.
- 4 nhánh của `render()` đều optional; thiếu nhánh nào thì trạng thái đó render `undefined`.
- ⚠️ Với `autoRun: true` + có `args`, task chạy ngay ở update đầu → trạng thái `INITIAL` gần như không thấy được. Nhánh `initial` chỉ thực sự hữu dụng khi `autoRun: false`.

### `TaskStatus` — kiểm tra thủ công
`import {TaskStatus} from '@lit/task'` rồi so sánh: `if (this._userTask.status === TaskStatus.ERROR) {...}`.

| Giá trị | Ý nghĩa |
| --- | --- |
| `INITIAL` | Chưa chạy lần nào |
| `PENDING` | Đang chạy |
| `COMPLETE` | Xong → `task.value` |
| `ERROR` | Lỗi → `task.error` |

Thành viên khác: `task.value` · `task.error` · `task.taskComplete` (Promise, `await` được trong test) · `task.run(args?)` · `task.abort()`.

### `autoRun: false` — chạy tay
Cho submit form, nút "Tìm kiếm", mutation:
```js
_saveTask = new Task(this, {
  task: async ([payload], {signal}) => {
    const res = await fetch('/api/save', {method: 'POST', body: JSON.stringify(payload), signal});
    if (!res.ok) throw new Error('Save failed');
    return res.json();
  },
  args: () => [],
  autoRun: false,
});
_onSubmit() { this._saveTask.run([{name: this.name}]); }   // truyền args trực tiếp
```

### `AbortSignal` — hủy request cũ ⭐
Mỗi lần task chạy lại, Lit **abort** signal của lần chạy trước. Chỉ cần forward nó vào API hỗ trợ hủy; API không nhận `signal` (SDK bên thứ 3) thì tự check:
```js
task: async ([q], {signal}) => (await fetch(`/api/search?q=${q}`, {signal})).json()

task: async ([id], {signal}) => {
  const data = await sdk.load(id);
  signal.throwIfAborted();     // ném AbortError nếu đã có lần chạy mới hơn
  return transform(data);
}
```
👉 Gõ nhanh `1` → `12` → `123`: chỉ kết quả của `123` được nhận. Đây là thứ diệt race condition.

**Chaining** — output task này làm input task kia; TS dùng `as const` để args thành tuple đúng kiểu:
```ts
_getData = new Task(this, {task: ([id]) => getData(id), args: () => [this.dataId] as const});
_process = new Task(this, {task: ([d, p]) => processData(d, p),
                           args: () => [this._getData.value, this.param] as const});
```

## 📡 3. Signals — ⚠️ Labs
> ⚠️ **CẢNH BÁO**: `@lit-labs/signals` và `@lit-labs/preact-signals` đều thuộc **Lit Labs**. README nói thẳng: *"may receive breaking changes or stop being supported"* và **"`@lit-labs/signals` is not recommended for production use"**. Thêm nữa **TC39 Signals Proposal chưa chốt** → API còn đổi. Nếu vẫn dùng: pin version chính xác và cô lập sau một lớp abstraction để dễ thay.

| | `@lit-labs/signals` (Lit khuyến nghị) | `@lit-labs/preact-signals` |
| --- | --- | --- |
| Nền | Polyfill **TC39 Signals Proposal** (`signal-polyfill`) | Signals của Preact (`@preact/signals`) |
| Trạng thái Labs | Nhóm *near graduation* | Nhóm *prototyping* (kém trưởng thành hơn) |
| Ưu | Hướng chuẩn hoá, interop giữa framework | Preact Signals là lib độc lập, "relatively fast and small" |
| Nhược | Proposal chưa chốt | Gắn với hệ Preact, doc Lit không tập trung vào nó |

### `SignalWatcher` + `signal()` + `computed()`
Export chính: **`SignalWatcher`** (mixin), **`watch()`** (directive), **`html`** (template tag tự bọc `watch`), **`withWatch()`** (factory tạo template tag tuỳ biến). Ngoài ra package re-export API của `signal-polyfill` cho tiện: `signal()`, `computed()`, `State`, `Computed`.

```js
// npm i @lit-labs/signals
import {LitElement} from 'lit';
import {customElement} from 'lit/decorators.js';
import {SignalWatcher, signal, computed, html} from '@lit-labs/signals';

const count = signal(0);                         // state dùng chung, không cần context
const double = computed(() => count.get() * 2);  // cache, chỉ tính lại khi count đổi

@customElement('shared-counter')
export class SharedCounter extends SignalWatcher(LitElement) {
  render() {
    return html`
      <p>The count is ${count.get()} (x2 = ${double.get()})</p>
      <button @click=${this.#onClick}>Increment</button>`;
  }
  #onClick() { count.set(count.get() + 1); }
}
```
Mọi instance `<shared-counter>` trên trang cùng update. `SignalWatcher` tự track signal nào được đọc trong `render()`.

### `watch()` directive — pinpoint update
```js
import {SignalWatcher, watch, signal} from '@lit-labs/signals';
render() { return html`<p>The count is ${watch(count)}</p>`; }   // chỉ binding này update
```
📌 Doc Lit nói thẳng: phần việc tiết kiệm được **rất ít** vì Lit đã update binding hiệu quả rồi — đừng tối ưu sớm.
Import `html` từ `@lit-labs/signals` (thay vì từ `lit`) → tự bọc `watch()` cho mọi signal binding, viết `${count}` là đủ.

⚠️ **Polyfill phải duy nhất**: cả trang chỉ được có **một bản** `signal-polyfill`. Trùng bản → graph bị chia đôi, reactivity chết im lặng. Check: `npm ls signal-polyfill && npm dedupe`.

✅ Update chính xác từng binding · chia sẻ state không cần provider · `computed` cache tự động. ❌ Labs + proposal chưa chốt · module-level state khó SSR · debug khó khi graph lớn · phải quản lý polyfill.

## 🗃 4. State ngoài: Redux / Zustand / Nanostores / MobX
Pattern chuẩn: **bọc store bằng Reactive Controller** (xem [[03 - Composition - Mixin va Reactive Controller]]) để subscribe/unsubscribe theo lifecycle element.
```js
export class StoreController {
  constructor(host, store, selector = (s) => s) {
    this.host = host; this.store = store; this.selector = selector;
    this.value = selector(store.getState());
    host.addController(this);
  }
  _sync() {
    const next = this.selector(this.store.getState());
    if (next !== this.value) {            // chỉ update khi slice đổi thật
      this.value = next;
      this.host.requestUpdate();
    }
  }
  hostConnected() {
    this._unsub = this.store.subscribe(() => this._sync());
    this._sync();                         // store có thể đã đổi lúc element disconnect
  }
  hostDisconnected() { this._unsub?.(); this._unsub = undefined; }
}

class CartBadge extends LitElement {
  _count = new StoreController(this, cartStore, (s) => s.items.length);
  render() { return html`<span>${this._count.value}</span>`; }
}
```

| Store | API subscribe | Lưu ý |
| --- | --- | --- |
| **Zustand** | `store.subscribe(fn)` → `unsub`; có `subscribeWithSelector` | Nhẹ nhất, hợp Lit |
| **Redux** | `store.subscribe(fn)` → `unsub`, tự `getState()` | Cần selector + memo, nếu không update thừa |
| **Nanostores** | `atom.subscribe(fn)` → `unsub` | Thiết kế cho vanilla/WC, có `@nanostores/lit` |
| **MobX** | `autorun(() => ...)` → `dispose` | Gọi `dispose()` trong `hostDisconnected` |

Muốn test/mock dễ → **provide store qua `@lit/context`** thay vì import singleton trực tiếp.

## 📊 Bảng tổng kết
| Giải pháp | Dùng khi | Nhược | Ổn định |
| --- | --- | --- | --- |
| `@state()` / `@property()` | State chỉ 1 component | Không chia sẻ được | ✅ **Stable** (core) |
| Props down / events up | Parent ↔ child trực tiếp | Prop drilling khi sâu | ✅ **Stable** (core) |
| `@lit/context` | Theme, i18n, config, service/DI | Provider phải là ancestor DOM; timing | ✅ **Stable** |
| `@lit/task` | Fetch async, mutation | Chỉ cho async, không thay store, không cache | ✅ **Stable** |
| Signals | Chia sẻ state không phụ thuộc DOM, pinpoint | TC39 chưa chốt, khó SSR, quản lý polyfill | ⚠️ **Labs** |
| Store ngoài + controller | App lớn, devtools | Thêm dependency, tự viết controller | Bên thứ 3 |

**Đường đi thực dụng cho 90% app**: `@state` → prop/event → `@lit/context` cho service & theme → `@lit/task` cho mọi thứ async → thiếu nữa thì thêm Zustand/Nanostores bọc controller. Signals chỉ khi chấp nhận rủi ro Labs.

## ⚠️ Bẫy thường gặp
1. **Consumer upgrade trước provider** → `context-request` bắn khi chưa ai nghe, consumer treo `undefined`. Fix: `new ContextRoot().attach(document.body)` — buffer request và replay khi provider xuất hiện.
2. **Quên `subscribe: true`** → nhận giá trị đúng 1 lần, provider đổi về sau nhưng UI đứng im.
3. **Mutate object trong context** (`this.theme.mode = 'dark'`) → cùng reference, `@state` không phát hiện, không ai được báo. Luôn tạo object mới.
4. **Provider không phải ancestor DOM** (đặt cạnh nhau, hoặc consumer render vào `document.body`) → event không bubble tới. Context bám **DOM tree**.
5. **Nhầm key context**: `createContext('theme')` ở 2 file là **cùng** context (string `===`); `createContext(Symbol('theme'))` ở 2 file là **hai** context khác nhau.
6. **`args` trả object/array mới mỗi lần** → `shallowArrayEquals` luôn thấy khác → task chạy lại liên tục. Fix: trả primitive / reference ổn định, hoặc `argsEqual: deepArrayEquals`.
7. **Quên forward `signal` vào `fetch`** → request cũ không bị hủy, response về muộn ghi đè kết quả mới.
8. **Không khai báo nhánh `error`** → lỗi bị nuốt, UI trống. **`args: () => []` mà mong re-run** → chạy đúng 1 lần; muốn re-run phải đưa property vào `args`.
9. **Task không phải cache**: đổi id A→B→A sẽ fetch lại A. Cần cache thì tự thêm `Map` hoặc dùng thư viện query.
10. **Signals**: hai bản `signal-polyfill` trong `node_modules` → reactivity chết im lặng. Signal ở module scope + SSR → singleton toàn server, state user này rò sang user khác.
11. **Quên `unsubscribe`** store trong `hostDisconnected` → leak, element đã gỡ vẫn `requestUpdate()`. Subscribe không selector → mọi thay đổi làm cả trăm component re-render.
12. **Nhét mọi thứ vào context** → context không phải store: không middleware, không devtools, không time-travel. Context để **cung cấp**, store để **quản lý**.

## 📚 Nguồn
- [Context](https://lit.dev/docs/data/context/) · [Async tasks](https://lit.dev/docs/data/task/) · [Signals](https://lit.dev/docs/data/signals/) (⚠️ Labs)
- [Context Community Protocol — W3C WCCG](https://github.com/webcomponents-cg/community-protocols/blob/main/proposals/context.md) · [TC39 Signals Proposal](https://github.com/tc39/proposal-signals) (⚠️ chưa chốt)
- [Lit Labs — trạng thái & graduation](https://lit.dev/docs/libraries/labs/) · [README `@lit/task` (argument equality)](https://github.com/lit/lit/tree/main/packages/task) · [README `@lit-labs/signals`](https://github.com/lit/lit/tree/main/packages/labs/signals)

Liên quan: [[03 - Composition - Mixin va Reactive Controller]]
