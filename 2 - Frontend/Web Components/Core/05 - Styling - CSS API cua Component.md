# 05 — Styling: CSS API của Component

> **Shadow DOM chặn hết CSS ngoài. Nên mọi lỗ hổng bạn chừa ra đều là API công khai** — cho phép cái gì thì phải chủ đích, vì sau này gỡ đi = breaking change. Note này liệt kê 5 kênh styling (`:host`, CSS custom properties, `::part`, `::slotted`, `:state`) và khi nào chọn cái nào.
>
> Series: [[00 - Roadmap Web Components - Lit]]
> Note anh em: [[02 - Custom Elements]] · [[03 - Shadow DOM]] · [[04 - Template va Slot]] · [[07 - API nang cao - ElementInternals, Form-associated, DSD]]

---

## 🧠 Mental model

```
NGOÀI (app dev)                 BOUNDARY                 TRONG (component)
──────────────────────────────────────────────────────────────────────────
x-btn { }                  ──►  host là element thường ──►  :host { }
--joy-btn-bg: red          ──►  kế thừa, xuyên qua     ──►  var(--joy-btn-bg, #333)
x-btn::part(label) { }     ──►  chỉ part được khai báo ──►  <span part="label">
x-btn:state(loading) { }   ──►  state component bật    ──►  internals.states
<b>…</b> (light DOM)       ◄──  style ngược từ trong   ──►  ::slotted(b) { }
.random-class { }          ──✗  BỊ CHẶN
                    Mỗi mũi tên = MỘT CAM KẾT API.
```

---

## 🎨 1. Style bên trong shadow root

**Cách A — `<style>` inline trong template.** Dễ viết, declarative, chạy được với Declarative Shadow DOM. Nhược: **mỗi instance là một stylesheet riêng**, không share được giữa các component.

```js
this.attachShadow({ mode: 'open' }).innerHTML = `
  <style>:host { display: inline-block } button { padding: 8px 16px }</style>
  <button part="button"><slot></slot></button>`;
```

**Cách B — `adoptedStyleSheets` + constructable `CSSStyleSheet` ⭐**

```js
const sheet = new CSSStyleSheet();
sheet.replaceSync(`:host { display: inline-block } button { padding: 8px 16px }`);

class XBtn extends HTMLElement {
  constructor() {
    super();
    const root = this.attachShadow({ mode: 'open' });
    root.adoptedStyleSheets = [sheet];   // share cùng 1 object cho MỌI instance
    root.innerHTML = `<button part="button"><slot></slot></button>`;
  }
}
customElements.define('x-btn', XBtn);
```

- `replaceSync(css)` set đồng bộ; `replace(css)` trả Promise (cho `@import`).
- Sheet **mutable sau khi adopt**: `sheet.insertRule(...)` áp dụng ngay cho mọi root đang dùng → đổi theme runtime không phải đụng DOM. Array mutate tại chỗ được (`root.adoptedStyleSheets.push(themeSheet)`), adopt được vào cả `document.adoptedStyleSheets` lẫn nhiều `shadowRoot`.
- Sheet phải tạo bằng `new CSSStyleSheet()` **trong cùng document** với shadow root, không thì `NotAllowedError`. Không adopt được sheet từ `<style>`/`<link>`.
- MDN nói rõ lợi ích: *"a component library could create a single stylesheet and then share it among all the custom elements belonging to that library. **The browser will parse that stylesheet once.**"*

| | `<style>` inline | `adoptedStyleSheets` |
| --- | --- | --- |
| Parse với n instance | n lần | 1 lần (MDN) |
| Share giữa component | ❌ | ✅ |
| Update runtime | phải sửa DOM | `insertRule` / `replaceSync` |
| SSR / Declarative Shadow DOM | ✅ | ❌ cần JS |
| Baseline | luôn | widely available từ 03/2023 |

> 💡 Lit dùng `static styles = css\`...\`` → tự chọn `adoptedStyleSheets` nếu browser hỗ trợ, fallback `<style>`.

---

## 🏠 2. `:host` — style chính element

```css
:host { display: block }                     /* base — hoặc inline-block / flex */
:host([hidden]) { display: none }            /* khôi phục, xem ghi chú dưới */
:host(.dark) { background: #111 }            /* khi host có class .dark */
:host([disabled]) { opacity: .5; pointer-events: none }
:host([size="lg"]) { font-size: 18px }
:host(:hover) { border-color: #999 }
:host(:state(loading)) { cursor: progress }  /* xem mục 6 */
```

**Bắt buộc nhớ:** custom element **không có rule nào trong UA stylesheet**, nên `display` giữ nguyên initial value của CSS Display 3 là `inline`. Chưa set `display` thì `width`, `height`, `padding-block`, `margin-block` **không ăn** → 90% ca "sao CSS không chạy" là do đây. Và `:host { display: block }` đè mất `[hidden]`, nên phải khôi phục bằng `:host([hidden]) { display: none }`.

**`:host-context()` — ĐỪNG DÙNG.** Nó match host nếu host hoặc một shadow-including ancestor match selector, nhưng theo MDN BCD: **chỉ Chromium hỗ trợ (Chrome/Edge 54+), Firefox và Safari đều không**, và MDN đánh dấu **deprecated** — CSSWG đã bỏ nó khỏi spec vì vendor phản đối + lý do performance. Thay thế: CSS custom property kế thừa từ ngoài, `@media (prefers-color-scheme: dark)` ngay trong shadow (media query chạy bình thường ở đó), hoặc container style query `@container style(--theme: dark)`.

**Specificity & cascade.** Theo CSS Shadow 1: `:host` = specificity của một pseudo-class → (0,1,0); `:host()` = pseudo-class **+ specificity của argument** → `:host(.dark)` = (0,2,0). Nhưng như ở [[03 - Shadow DOM]]: **declaration thường từ ngoài luôn thắng `:host`** bất kể specificity, vì khác encapsulation context. Nên `:host` = default values, không phải "khoá cứng".

---

## ⭐ 3. CSS custom properties — kênh theming chính

Custom property là **inherited property** → xuyên shadow boundary tự nhiên. Đây là cơ chế theming số 1. Bên trong luôn khai báo kèm fallback; bên ngoài chỉ cần set biến ở bất kỳ scope nào.

```css
/* TRONG shadow */
:host {
  display: inline-block;
  --_bg: var(--joy-btn-bg, #333);   /* biến private, gom fallback về 1 chỗ */
  --_fg: var(--joy-btn-fg, #fff);
}
button { background: var(--_bg); color: var(--_fg); padding: var(--joy-btn-padding, 8px 16px) }
button:hover { background: var(--joy-btn-bg-hover, var(--_bg)) }

/* NGOÀI: :root cho toàn app, selector cho scope, hoặc inline style trên host */
:root { --joy-btn-bg: #0066ff }
.danger-zone x-btn { --joy-btn-bg: #d33 }
```

### Quy ước đặt tên

| Pattern | Ý nghĩa |
| --- | --- |
| `--joy-*` | prefix thư viện, tránh đụng biến app |
| `--joy-color-primary` | **global token** — dùng chung mọi component |
| `--joy-btn-bg` | **component token** — chỉ `x-btn` đọc |
| `--_bg` (gạch dưới) | **private**, quy ước "đừng set từ ngoài" |

Chuỗi 3 tầng chuẩn design system: `:root { --joy-color-primary }` → `x-btn { --joy-btn-bg: var(--joy-color-primary) }` → trong shadow `var(--joy-btn-bg, #333)`.

> ⚠️ Biến **không tự nhiên tồn tại** — chỉ có nếu ai đó set ở host hoặc ancestor. Fallback trong `var()` là bắt buộc, thiếu là property thành *invalid at computed-value time*, mất luôn giá trị mặc định.

---

## 🧩 4. `::part()` — expose element cụ thể

Trong shadow gắn attribute `part` (`<div part="tab active">Tab A</div>`), ngoài style tự do:
```css
x-tabs::part(tab)        { color: blue; border-bottom: 4px solid transparent }
x-tabs::part(tab):hover  { background: #000; color: #fff }  /* ✅ pseudo-class */
x-tabs::part(tab active) { border-color: blue }             /* ✅ nhiều tên, thứ tự tuỳ ý */
x-tabs::part(close-btn)::before { content: "" }             /* ✅ pseudo-element */
```

### Giới hạn (quan trọng)

| Viết | OK? |
| --- | --- |
| `::part(x):hover`, `:focus-visible`, `:state(y)` · `::part(x)::before` · `::part(a b)` | ✅ |
| `::part(list) li` — **descendant sau part** | ❌ không match gì cả |
| `::part(a)::part(b)` — chain part | ❌ (dùng `::part(a b)`) |
| `::part(tab):last-child`, `:empty` — structural pseudo | ❌ |

👉 Vì không descendant được, mỗi element cần style **phải tự có `part`**. Đó là chủ ý của spec: bạn phải liệt kê từng thứ mình cam kết.

### `exportparts` — forward qua nhiều tầng

`::part()` chỉ nhìn thấy từ **DOM cha trực tiếp** — shadow lồng shadow thì ông nội không thấy cháu. Đặt `exportparts` trên shadow host của tầng trong; không liệt kê → part đó **biến mất** với bên ngoài (dưới đây `footer` không style được).

```html
<!-- trong shadow của <card-wrapper> -->
<card-component exportparts="base, header, body"></card-component>
<card-component exportparts="base:card__base, header:card__header"></card-component> <!-- đổi tên -->
```

---

## 📥 5. `::slotted()` — style content người dùng đưa vào

Từ **trong** shadow, style node light DOM đã được slot vào:

```css
::slotted(*)      { margin: 0 }
::slotted(a)      { color: var(--joy-link, #06c); text-decoration: none }
slot[name="icon"]::slotted(*) { width: 16px; height: 16px }   /* theo slot cụ thể */
```

**Giới hạn:**
- Chỉ match **top-level node** được assign vào slot — `::slotted(div p)` / `::slotted(div) p` ❌ không bao giờ match con cháu; không match text node. Cũng không nối selector phía sau: `::slotted(span).foo` ❌ → `::slotted(span.foo)` ✅ (argument phải là 1 *compound selector*).
- **Thua style từ ngoài**: light DOM vẫn ở document tree, nên `x-card p {}` ngoài thắng `::slotted(p)`. `::slotted` chỉ là **default styling** cho content.

---

## 🔘 6. `:state()` + `CustomStateSet`

Thay cho hack "set class lên host" — bẩn, dễ bị user xoá, rò rỉ implementation:
```js
class XLoader extends HTMLElement {
  #internals = this.attachInternals();
  set loading(v) { this.#internals.states[v ? 'add' : 'delete']('loading') }
  get loading()  { return this.#internals.states.has('loading') }
}
customElements.define('x-loader', XLoader);
```
```css
x-loader:state(loading) { opacity: .6; cursor: progress }   /* ngoài */
x-tabs::part(tab):state(selected) { border-color: blue }    /* ngoài, kèm part */
:host(:state(loading)) .spinner { display: block }          /* trong shadow */
```

`states` là một `CustomStateSet` (giống `Set`): `.add()`, `.delete()`, `.has()`, `.clear()`. Baseline 05/2024. Syntax `<dashed-ident>` cũ (`states.add('--loading')` + CSS `:--loading`) **bị Chrome 125 gỡ bỏ** và MDN đánh dấu deprecated — đừng copy từ blog cũ. Chi tiết `ElementInternals` → [[07 - API nang cao - ElementInternals, Form-associated, DSD]].

---

## 📊 7. Chọn cách nào khi nào

| Nhu cầu | Dùng | Vì sao |
| --- | --- | --- |
| Đổi màu / spacing / radius — **giá trị đơn lẻ** | **CSS custom property** | An toàn nhất, không lộ DOM, dễ document, dễ giữ backward-compat |
| Đổi **layout / property tuỳ ý** của 1 phần bên trong | **`::part()`** | Mở toàn quyền CSS cho đúng element đó |
| Style **content người dùng** truyền vào | **`::slotted()`** | Chỉ đặt default, ngoài override được |
| Trạng thái nội bộ (loading, selected, invalid) | **`:state()`** | Không rò implementation, không bị user xoá nhầm |
| Trạng thái / variant là **API cho author** (`disabled`, `size`, `variant`) | **attribute + `:host([...])`** | Set trong HTML được, SSR được, a11y rõ, không bắt user viết CSS |
| Class trên host từ ngoài | ⚠️ tránh làm API | Không kiểm soát, dễ đụng class app |

**Rule:** ưu tiên **custom property → attribute variant → `:state` → `::part`**. `::part` là "escape hatch", mở càng ít càng dễ maintain.

---

## 🌊 8. Tailwind / CSS framework + Shadow DOM

Vấn đề: Tailwind sinh utility class ở **global sheet**, mà global sheet **không lọt vào shadow** → `class="px-4 bg-blue-500"` trong shadow = vô nghĩa.

| Cách | Làm gì | ✅ | ❌ |
| --- | --- | --- | --- |
| **A. Bỏ shadow DOM** | Lit: `createRenderRoot() { return this }` → render thẳng vào light DOM | Tailwind chạy y như React | Mất encapsulation; `:host`/`::part`/`::slotted` vô dụng |
| **B. Inject compiled sheet** | Build `tailwind.css` → `sheet.replaceSync(css)` → `adoptedStyleSheets` | Giữ encapsulation | Sheet lặp cho mỗi bundle; phải quét source component; preflight dễ đụng |
| **C. Chỉ expose CSS var** | Không dùng utility trong shadow, app map Tailwind → `--joy-btn-bg` | API sạch nhất, độc lập framework | Phải tự viết CSS bên trong |

**Làm cách B cho chạy thật (Tailwind v4):**

```js
// build ra 1 file css, import raw (Vite: ?inline / ?raw; esbuild: loader text)
import css from './tailwind.out.css?inline';

// v4 phát theme variable (@theme) ra selector :root → KHÔNG với tới trong shadow root.
// Phải map sang :host thì var mới resolve được.
const sheet = new CSSStyleSheet();
sheet.replaceSync(css.replaceAll(':root', ':host'));   // hoặc build sẵn ':root, :host'
// root.adoptedStyleSheets = [sheet];
```

Kèm 2 điều bắt buộc: (1) khai báo source cho Tailwind quét đúng file component (`@source "./src/**/*.ts"` trong v4, `content` trong v3) — utility không có trong output thì không tồn tại; (2) preflight reset `*, ::before, ::after` sẽ chạy lại **trong từng shadow root** — nếu không muốn thì build sheet component không kèm preflight.

**Thực tế:** component **nội bộ 1 app đã có Tailwind** → **A**, đừng chống lại toolchain. **Thư viện phân phối ra ngoài** (npm, embed Shopify) → **C** + `::part` cho case đặc biệt — không ai muốn kéo Tailwind của bạn về. **B** chỉ khi bắt buộc có encapsulation *và* team quen Tailwind.

---

## ✨ 9. Vài thứ vặt nhưng hay dùng

**`:defined` — chống FOUC.** Trước khi `customElements.define()` chạy, element là `HTMLUnknownElement` inline → content nhảy loạn. Ưu tiên `visibility: hidden` (giữ chỗ) hơn `display: none` (gây layout shift lúc define xong); biết size thì đặt sẵn `min-height`. **`content-visibility`** hoãn render component ngoài viewport — `contain-intrinsic-size` là bắt buộc, không thì scrollbar nhảy.

**Dark mode qua CSS custom property** — app định nghĩa token, component không cần biết gì, chỉ đọc `var(--joy-surface, #fff)`. Đổi theme không cần JS, không re-render. Đây là lý do nên theming bằng biến thay vì `:host(.dark)`.

```css
x-btn:not(:defined) { visibility: hidden; min-height: 40px }
x-heavy-card { content-visibility: auto; contain-intrinsic-size: auto 200px }

:root { --joy-surface: #fff; --joy-text: #111 }
:root[data-theme="dark"] { --joy-surface: #111; --joy-text: #eee }
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) { --joy-surface: #111; --joy-text: #eee }
}
```

---

## ⚠️ Bẫy thường gặp

- **Quên `:host { display: block }`** → `width`/`height`/`padding` im lặng không ăn. Bug số 1. Và nó đè mất `[hidden]` → thêm `:host([hidden]) { display: none }`.
- **`var()` không fallback** → biến chưa set thì property invalid, mất luôn style mặc định.
- **`::part(list) li` / `::slotted(div p)`** — không match; phải gắn `part` cho từng element.
- **Quên `exportparts`** ở component lồng nhau → part biến mất, không warning.
- **`:host-context()`** — Chromium-only (Firefox + Safari không hỗ trợ), MDN deprecated, CSSWG đã bỏ khỏi spec. Đừng dùng.
- **Dùng `!important` để ép từ ngoài** → thua `!important` trong `:host` (xem [[03 - Shadow DOM]]).
- **`<style>` inline nhân bản n lần** trong list dài → dùng `adoptedStyleSheets`. Nhưng adopt sheet tạo từ document khác (iframe) → `NotAllowedError`.
- **Expose `part` bừa bãi** → thành API vĩnh viễn, refactor internal DOM = breaking change.
- **Syntax `:--state` cũ** đã bị bỏ, dùng `:state(name)`.

---

## 📚 Nguồn

- [MDN — `:host`](https://developer.mozilla.org/en-US/docs/Web/CSS/:host) · [`:host()`](https://developer.mozilla.org/en-US/docs/Web/CSS/:host_function) · [`::slotted()`](https://developer.mozilla.org/en-US/docs/Web/CSS/::slotted) · [`:host-context()` (deprecated, Chromium-only)](https://developer.mozilla.org/en-US/docs/Web/CSS/:host-context)
- [CSS Shadow / Scoping Level 1 — specificity của `:host`, `::slotted`](https://drafts.csswg.org/css-shadow-1/) · [CSS Cascade 5 — Cascade Sorting Order](https://drafts.csswg.org/css-cascade-5/#cascade-sort)
- [MDN — `::part()`](https://developer.mozilla.org/en-US/docs/Web/CSS/::part) (Baseline 07/2020) · [`part`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/part) · [`exportparts`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/exportparts)
- [MDN — `:state()`](https://developer.mozilla.org/en-US/docs/Web/CSS/:state) · [`CustomStateSet`](https://developer.mozilla.org/en-US/docs/Web/API/CustomStateSet)
- [MDN — `ShadowRoot.adoptedStyleSheets`](https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot/adoptedStyleSheets) · [`CSSStyleSheet.replaceSync()`](https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleSheet/replaceSync) · [Using shadow DOM — programmatic vs declarative](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM)
