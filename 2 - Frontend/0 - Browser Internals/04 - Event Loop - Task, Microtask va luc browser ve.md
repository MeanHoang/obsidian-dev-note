# 04 — Event Loop: Task, Microtask và lúc browser vẽ

> **TL;DR:** JS, layout, paint và xử lý sự kiện **dùng chung một luồng duy nhất**. Browser chạy theo vòng: lấy **1 task** → chạy tới hết → **vét sạch toàn bộ microtask** → mới **có cơ hội vẽ** → lặp lại. Hiểu vòng này là hiểu vì sao `for` 3 tỷ vòng làm đơ trang, vì sao sửa DOM 10 lần chỉ thấy kết quả cuối, và vì sao `console.log` ngay sau `setState` vẫn ra giá trị cũ.

Series: [[00 - Roadmap - Tu HTML den Pixel]]
Anh em: [[02 - DOM la gi - Cay, Node va API]] · [[03 - Script duoc tai luc nao - defer, async, module]] · [[07 - React - Truy vet mot lan setState tu click den pixel]] · [[Glossary/B - JS Runtime va Event Loop|Glossary B]]

---

## 🧠 Mental model gốc: MỘT luồng, làm mọi thứ

**Main thread** (luồng chính) = một dòng thi hành duy nhất. Trên đó, browser lần lượt làm:

```
chạy JS  ·  xử lý click/scroll  ·  tính style  ·  tính layout  ·  vẽ
└──────────────── TẤT CẢ đứng xếp hàng trên CÙNG một luồng ───────────────┘
```

Nghĩa là: khi JS đang chạy, **không ai vẽ được gì, không click nào được xử lý**.

```js
document.querySelector('button').addEventListener('click', () => {
  let s = 0;
  for (let i = 0; i < 3_000_000_000; i++) s += i;   // ~vài giây
  console.log(s);
});
```

Trong vài giây đó: nút không đổi màu hover, scroll không nhúc nhích, spinner đứng hình, tab hiện "Page unresponsive". Không phải browser hỏng — **browser đang xếp hàng sau bạn**.

> Đây là mental model duy nhất cần nhớ. Mọi thứ còn lại trong bài chỉ là chi tiết của nó.

---

## ⚙️ Các mảnh ghép

| Mảnh | Là gì | Ví dụ |
| --- | --- | --- |
| **Call stack** | Chồng các hàm đang chạy. Hàm gọi hàm thì chồng lên; xong thì bóc ra | `a()` gọi `b()` → stack `[a, b]` |
| **Heap** | Vùng nhớ chứa object, array, closure | `{ name: 'x' }` nằm ở đây |
| **Web APIs** | Các bộ máy **browser cung cấp**, chạy **ngoài** JS engine | `setTimeout`, `fetch`, DOM events, `IntersectionObserver` |
| **Task queue** (macrotask) | Hàng đợi các "việc lớn" chờ tới lượt | callback của `setTimeout`, handler của `click` |
| **Microtask queue** | Hàng đợi riêng, **ưu tiên cao hơn**, được vét sạch giữa các task | `.then()`, `await`, `queueMicrotask` |
| **Event loop** | Vòng lặp vô hạn điều phối tất cả | — |

Điểm hay bị hiểu sai: **`setTimeout` không phải JS**. Nó là một Web API. JS chỉ nói "browser ơi, 100ms nữa bỏ hàm này vào hàng đợi giúp", rồi đi tiếp ngay. Bộ đếm giờ chạy ở **chỗ khác**, không tốn main thread.

```
        ┌──────────────── JS ENGINE (V8) ────────────────┐
        │                                                │
        │   CALL STACK              HEAP                 │
        │   ┌──────────┐            ┌────────────────┐   │
        │   │  b()     │            │  {objects}     │   │
        │   │  a()     │            │  [arrays]      │   │
        │   └──────────┘            └────────────────┘   │
        └──────────────────────┬─────────────────────────┘
                               │ đăng ký callback
                               ▼
        ┌──────────── WEB APIs (browser cung cấp) ───────┐
        │  timer · fetch/XHR · DOM events · observers    │
        └───────┬──────────────────────────┬─────────────┘
                │ hết giờ / có phản hồi    │
                ▼                          ▼
   ┌────────────────────────┐   ┌──────────────────────────┐
   │  TASK QUEUE (macro)    │   │  MICROTASK QUEUE         │
   │  [timeout, click, ...] │   │  [then, await, qMT, ...] │
   └───────────┬────────────┘   └────────────┬─────────────┘
               │                             │
               └────────► EVENT LOOP ◄───────┘
                    lấy 1 task → chạy hết
                    → VÉT SẠCH microtask
                    → (có thể) RENDER
                    → lặp
```

---

## 🔁 Vòng lặp, viết bằng chữ

```
while (browser còn sống) {
  1. Lấy MỘT task ra khỏi task queue.
  2. Chạy nó cho tới khi call stack rỗng hoàn toàn.
  3. VÉT SẠCH microtask queue:
       - lấy microtask đầu tiên, chạy
       - nếu nó SINH RA microtask mới → cái mới cũng vào hàng và cũng phải chạy
       - lặp cho tới khi hàng RỖNG HẲN
  4. Nếu tới lúc cần vẽ frame → chạy rAF → tính style → layout → paint.
  5. Quay lại 1.
}
```

Hai chữ quan trọng nhất: **VÉT SẠCH**.

```js
// ⛔ TREO TRANG VĨNH VIỄN
function boom() { queueMicrotask(boom); }
boom();

// ✅ Trang vẫn mượt (dù chạy vô hạn)
function ok() { setTimeout(ok, 0); }
ok();
```

Vì sao khác nhau? Microtask sinh microtask thì **bước 3 không bao giờ kết thúc** → không bao giờ tới bước 4 → không bao giờ vẽ. Còn `setTimeout` tạo **task**, mỗi vòng lặp chỉ lấy **một** cái, nên browser vẫn chen được render vào giữa.

---

## 📋 Task vs Microtask

| | **Task** (macrotask) | **Microtask** |
| --- | --- | --- |
| Mỗi vòng chạy bao nhiêu | **Đúng 1** cái | **Toàn bộ**, tới khi rỗng |
| Browser được vẽ ở giữa? | ✅ Có | ❌ Không |
| Nguồn phát sinh | `setTimeout`, `setInterval`, event handler (`click`, `scroll`), `MessageChannel`, `postMessage`, tải xong script/resource | `Promise.then/catch/finally`, code sau `await`, `queueMicrotask()`, `MutationObserver` |
| Độ trễ thực tế | ≥ thời gian yêu cầu, có thể lâu hơn nhiều | Gần như tức thì, ngay sau đoạn code hiện tại |

Nhớ mẹo: **microtask = "làm nốt cho xong việc đang dở"**, **task = "một việc mới hoàn toàn"**.

> `setTimeout(fn, 0)` **không** chạy sau 0ms. Spec cho phép browser ép tối thiểu ~4ms khi lồng nhau quá 5 tầng, và thực tế phải đợi task hiện tại + toàn bộ microtask xong đã.

---

## 🧪 Bài tập đoán thứ tự (làm kỹ phần này)

```js
console.log('A · script start');

setTimeout(() => console.log('B · setTimeout 0'), 0);

Promise.resolve().then(() => console.log('C · then #1'));

queueMicrotask(() => console.log('D · queueMicrotask'));

(async function main() {
  console.log('E · async: trước await');
  await null;
  console.log('F · async: sau await');
})();

Promise.resolve().then(() => console.log('G · then #2'));

console.log('H · script end');
```

Đoán trước khi kéo xuống. Kết quả thật:

```
A · script start
E · async: trước await
H · script end
C · then #1
D · queueMicrotask
F · async: sau await
G · then #2
B · setTimeout 0
```

### Giải thích từng dòng

**Giai đoạn 1 — chạy đồng bộ (đây vẫn là MỘT task: "chạy script")**

| Dòng | Chuyện gì xảy ra |
| --- | --- |
| `console.log('A')` | In ngay. → **A** |
| `setTimeout(…, 0)` | Giao cho Web API. Timer hết hạn → callback vào **task queue**. Chưa in gì |
| `Promise.resolve().then(C)` | Promise **đã** resolved → callback C xếp vào **microtask queue**. Hàng: `[C]` |
| `queueMicrotask(D)` | Xếp thẳng vào microtask queue. Hàng: `[C, D]` |
| Gọi `main()` | Thân async function chạy **đồng bộ** cho tới `await` đầu tiên → in ngay. → **E** |
| `await null` | Dừng hàm tại đây, phần còn lại (`F`) được xếp làm **microtask**. Hàng: `[C, D, F]` |
| `Promise.resolve().then(G)` | Hàng: `[C, D, F, G]` |
| `console.log('H')` | In ngay. → **H** |

👉 Điểm dễ sai nhất: **`async function` KHÔNG chạy nền**. Nó chạy đồng bộ cho tới `await`. Nên `E` in trước `H`.

**Giai đoạn 2 — call stack rỗng → vét microtask theo đúng thứ tự vào hàng**

```
[C, D, F, G]  →  C  →  D  →  F  →  G      → hàng rỗng
```

→ **C, D, F, G**.

Lưu ý `F` đứng sau `D`: vì lúc `await null` xếp hàng thì `D` đã nằm trong hàng trước rồi. (`await` một giá trị không phải promise vẫn tốn **đúng 1 lượt microtask**.)

**Giai đoạn 3 — microtask rỗng → có cơ hội render → lấy task tiếp theo**

→ **B**.

> Đổi `await null` thành `await Promise.resolve()` thì kết quả **không đổi** (vẫn 1 tick, nhờ tối ưu `await` đã vào spec). Nhưng `await { then(r){ r() } }` (thenable tự viết) thì tốn thêm tick → `F` sẽ tụt xuống sau `G`.

---

## 🎨 "Rendering opportunity" — browser chỉ được vẽ giữa các task

Browser **không vẽ bất cứ lúc nào nó muốn**. Nó chỉ có **cơ hội vẽ** (rendering opportunity) ở cuối một vòng event loop, và chỉ khi microtask queue đã rỗng. Nhịp thường thấy: **~16.7ms một lần** (60 khung hình/giây; màn 120Hz thì ~8.3ms).

Hệ quả trực tiếp:

```js
const box = document.querySelector('#box');
box.style.left = '0px';
box.style.left = '100px';
box.style.left = '200px';
box.style.left = '300px';
// Người dùng chỉ thấy DUY NHẤT 300px. Ba giá trị kia chưa từng lên màn hình.
```

Cả 4 dòng nằm trong **cùng một task**, chưa có cơ hội render nào chen vào. Đây chính là nền tảng của khái niệm **batching** (gộp nhiều thay đổi rồi xử lý một lần) mà React và Lit đều dựa vào.

### Một frame trông như thế nào

```
│◄──────────────── 1 frame ≈ 16.7ms ────────────────►│
│                                                    │
├─[ TASK ]──[ vét MICROTASK ]──┬─ rAF callbacks      │
│  vd: click handler            │                    │
│  chạy JS của bạn              ├─ tính STYLE        │  ← "update the rendering"
│                               ├─ tính LAYOUT       │     (chỉ chạy khi tới nhịp vẽ)
│                               ├─ PAINT             │
│                               └─ COMPOSITE ────────┼──▶ 🖼 lên màn hình
│                                                    │
└────────────────────────────────────────────────────┘
                  rồi lặp lại với task tiếp theo
```

Nếu task của bạn ngốn 50ms, frame đó **trượt** — người dùng thấy giật. Đó là toàn bộ câu chuyện của "trang lag".

Chi tiết style → layout → paint → composite nằm ở [[01 - Tu URL den Pixel - Vong doi mot trang web]].

---

## 🎞 `requestAnimationFrame` (rAF)

```js
function step(timestamp) {          // timestamp: ms có độ chính xác cao
  box.style.transform = `translateX(${timestamp / 10}px)`;
  requestAnimationFrame(step);      // đăng ký cho frame kế tiếp
}
requestAnimationFrame(step);
```

`requestAnimationFrame(fn)` = "chạy `fn` **ngay trước** bước tính style/layout của frame sắp tới".

| | `requestAnimationFrame(fn)` | `setTimeout(fn, 16)` |
| --- | --- | --- |
| Đồng bộ với nhịp vẽ | ✅ Luôn đúng ngay trước khi vẽ | ❌ Trôi dần, lệch nhịp |
| Màn 120Hz | ✅ Tự chạy ~8.3ms/lần | ❌ Vẫn 16ms, mất nửa số frame |
| Tab chạy nền | ✅ Tự dừng, tiết kiệm pin | ⚠️ Vẫn chạy (bị bóp về ≥1000ms) |
| Tham số | Nhận `timestamp` chuẩn | Không có |

Quy tắc: **animate bằng JS → luôn dùng rAF.** Còn animate được bằng CSS `transition`/`animation` thì tốt hơn nữa, vì nó chạy trên compositor thread, không đụng main thread.

---

## ⚛️ Ứng dụng vào React

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
    console.log(count);   // ← in ra 0, không phải 3
  }

  return <button onClick={handleClick}>{count}</button>;
}
```

Hai chuyện khác nhau, hay bị gộp làm một:

**1. Vì sao `console.log(count)` ra giá trị cũ?**
Không phải vì "setState là async". Mà vì `count` là một **hằng số của lần render này** — nó được `useState` trả về một lần khi hàm `Counter()` chạy, và **không bao giờ đổi giá trị** bên trong lần render đó. `setCount` không sửa biến `count`; nó nói với React "lần render sau, giá trị là X". Lần render sau là **một lần gọi hàm `Counter()` khác**, với một biến `count` khác.

Còn `setCount(count + 1)` ba lần đều tính `0 + 1` → kết quả cuối là `1`, không phải `3`. Muốn `3` thì dùng dạng hàm cập nhật:

```js
setCount(c => c + 1);   // ×3 → 3 ✅ (React đưa giá trị mới nhất vào c)
```

**2. Vì sao React chỉ render 1 lần dù gọi `setCount` 3 lần?**
React **batch**: nó gom mọi lần `setState` trong **cùng một task** (ở đây là task xử lý sự kiện click), rồi mới render **một lần duy nhất** trước khi browser có cơ hội vẽ. Chính là cơ chế "chỉ thấy giá trị cuối" ở phần trên, áp dụng ở tầng React.

Từ **React 18** có **automatic batching**: batching áp dụng cả trong `setTimeout`, trong `.then()` của promise, trong native event handler — trước 18 thì những chỗ đó **không** được batch và mỗi `setState` gây một lần render riêng.

```
click ──┐
        │ [ TASK: React event handler ]
        │   setCount ×3  → xếp vào hàng cập nhật
        │ ─────────────────────────────
        │   React render 1 lần → commit → sửa DOM
        └─────────────────────────► browser vẽ 1 lần
```

Truy vết chi tiết từng bước: [[07 - React - Truy vet mot lan setState tu click den pixel]] · [[06 - React - Virtual DOM, Reconciliation va Fiber]].

---

## 🧩 Ứng dụng vào Web Components / Lit

Lit làm y hệt ý tưởng đó, nhưng dùng **microtask** làm điểm hẹn:

```js
el.name = 'A';
el.name = 'B';
el.age = 30;
// Lit KHÔNG render 3 lần. Nó đặt lịch một lần cập nhật ở microtask,
// gom cả 3 thay đổi, rồi render 1 lần.

console.log(el.shadowRoot.textContent);   // ⛔ vẫn là nội dung CŨ

await el.updateComplete;                   // ✅ đợi Lit render xong
console.log(el.shadowRoot.textContent);   // giờ mới đúng
```

`updateComplete` là một Promise Lit cung cấp, resolve **sau khi** lần cập nhật đang chờ đã render xong DOM. Vì thế trong test Web Components, gần như mọi assertion về DOM đều phải đứng sau `await el.updateComplete`.

Đây cũng là lý do một số framework dùng `await nextTick()` / `await tick()` — cùng một ý: **đợi hết microtask rồi mới đọc DOM**.

Chi tiết vòng đời: [[09 - Web Components - Truy vet mot custom element tu HTML den pixel]] · [[10 - Shadow DOM - Cay trong cay va ranh gioi that su]].

---

## 🐢 Long task & INP

**Long task** = một task chiếm main thread **hơn 50ms**. Trong suốt task đó, mọi click/scroll đều bị treo trong hàng đợi.

**INP** (Interaction to Next Paint) = một chỉ số Core Web Vitals: đo từ lúc người dùng tương tác tới lúc **frame kế tiếp được vẽ**. Mốc "tốt" là **≤ 200ms**. Long task là thủ phạm số 1 làm INP xấu.

Cách chữa: **chia nhỏ task, nhường luồng cho browser giữa chừng** (gọi là *yielding*).

```js
// Cách phổ thông, chạy ở mọi browser
function yieldToMain() {
  return new Promise(resolve => setTimeout(resolve, 0));
}

async function processAll(items) {
  for (const item of items) {
    doWork(item);
    await yieldToMain();   // kết thúc task hiện tại → browser được vẽ + xử lý click
  }
}
```

```js
// Cách mới, ưu tiên cao hơn setTimeout (Chrome mới; cần kiểm tra hỗ trợ)
if ('scheduler' in window && 'yield' in scheduler) {
  await scheduler.yield();
}
```

Ngoài ra: việc tính toán nặng thuần JS (không đụng DOM) nên đẩy sang **Web Worker** — đó là luồng thật sự khác, không cướp main thread.

---

## ⚠️ Bẫy thường gặp

**1. Đọc DOM ngay sau khi set state / set property**

```js
setCount(5);
console.log(ref.current.textContent);   // ⛔ vẫn giá trị cũ
```

DOM chưa được cập nhật vì React/Lit còn chưa render. Đợi đúng cách: `await el.updateComplete` (Lit), `useEffect` (React), `requestAnimationFrame` (DOM thuần).

**2. Tưởng `await` làm code chạy song song**

```js
const a = await fetchA();   // đợi xong hẳn
const b = await fetchB();   // rồi mới bắt đầu → TỔNG = a + b
```

`await` chỉ **tạm dừng hàm này** và trả luồng lại cho event loop — nó không tạo luồng mới. Muốn song song thật:

```js
const [a, b] = await Promise.all([fetchA(), fetchB()]);   // ✅
```

**3. Đo `offsetWidth` trong vòng lặp (layout thrashing)**

```js
for (const el of items) {
  el.style.width = el.offsetWidth + 10 + 'px';   // ⛔ đọc-ghi xen kẽ
}
```

Mỗi lần đọc `offsetWidth` sau một lần ghi style buộc browser **tính lại layout đồng bộ ngay lập tức** (forced synchronous layout) — 100 phần tử = 100 lần layout trong cùng một task. Cách sửa: đọc hết trước, ghi hết sau. Chi tiết: [[02 - DOM la gi - Cay, Node va API]].

**4. Dùng `setTimeout(fn, 0)` để "đợi render"**

Nó *thường* chạy sau frame, nhưng không có gì đảm bảo — thời điểm chính xác phụ thuộc tải máy. Đó là code mong manh, chạy được trên máy bạn và lỗi trên CI. Dùng đúng công cụ: `updateComplete`, `useEffect`, hoặc `requestAnimationFrame` lồng hai lần nếu cần chắc chắn đã vẽ:

```js
requestAnimationFrame(() => requestAnimationFrame(() => {
  // tới đây frame trước đã được vẽ xong
}));
```

**5. Tưởng `setInterval(fn, 100)` chạy đúng mỗi 100ms**

Không. Nếu một task khác đang chiếm luồng, callback phải xếp hàng. `setInterval` còn có thể dồn cục sau khi tab quay lại foreground. Animation → dùng rAF; việc định kỳ chính xác → tự tính bằng `performance.now()`.

---

## ✅ Nhớ 5 điều

1. **Một luồng duy nhất** cho JS + layout + paint + event. JS chạy lâu = trang đơ, không có ngoại lệ.
2. **Vòng lặp**: 1 task → vét **sạch** microtask → mới có cơ hội vẽ → lặp.
3. **Microtask được vét hết** (kể cả microtask mới sinh ra); **task mỗi vòng chỉ 1 cái** — khác biệt này quyết định trang có bị treo hay không.
4. **Browser chỉ vẽ giữa các task** → nhiều thay đổi trong cùng một task chỉ lên màn hình một lần. Đó là gốc của batching trong React và Lit.
5. **Task > 50ms là long task** → INP xấu. Chia nhỏ và nhường luồng, hoặc đẩy sang Web Worker.

---

## 📚 Nguồn

- [Jake Archibald — Tasks, microtasks, queues and schedules](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/) ⭐ bài kinh điển, có animation mô phỏng
- [HTML Standard — Event loops](https://html.spec.whatwg.org/multipage/webappapis.html#event-loops)
- [HTML Standard — Update the rendering](https://html.spec.whatwg.org/multipage/webappapis.html#update-the-rendering)
- [MDN — The event loop](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Event_loop)
- [MDN — `queueMicrotask()`](https://developer.mozilla.org/en-US/docs/Web/API/Window/queueMicrotask)
- [MDN — `requestAnimationFrame()`](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame)
- [web.dev — Optimize long tasks](https://web.dev/articles/optimize-long-tasks)
- [web.dev — Interaction to Next Paint (INP)](https://web.dev/articles/inp)
- [React docs — Queueing a series of state updates](https://react.dev/learn/queueing-a-series-of-state-updates)
- [Lit docs — Reactive update cycle](https://lit.dev/docs/components/lifecycle/#reactive-update-cycle)
