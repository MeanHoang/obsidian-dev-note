# Glossary C — React

> Tra nhanh thuật ngữ gặp trong note 05–08. Không cần học thuộc, gặp từ lạ thì nhảy vào đây.

Series: [[00 - Roadmap - Tu HTML den Pixel]] · Index: [[00 - Index]]

---

## Mục lục nhanh

| Thuật ngữ | Một câu |
|---|---|
| [[#JSX]] | Cú pháp giống HTML viết trong file JS, phải dịch mới chạy được. |
| [[#Transpile (trong React)]] | Bước dịch JSX thành lời gọi hàm JS thường. |
| [[#React.createElement()]] | Hàm cũ mà JSX được dịch thành, trả về một object mô tả UI. |
| [[#Automatic JSX runtime (_jsx)]] | Cách dịch JSX mới, không cần import React nữa. |
| [[#React element]] | Object mô tả "cần vẽ gì" — nhẹ, bất biến, không phải DOM. |
| [[#Component]] | Hàm nhận props và trả về mô tả UI. |
| [[#Props]] | Dữ liệu cha truyền xuống con, con chỉ được đọc. |
| [[#State]] | Dữ liệu component tự giữ, đổi thì React vẽ lại. |
| [[#Hook]] | Hàm đặc biệt cho phép component dùng state và tính năng React. |
| [[#useState]] | Hook tạo một ô nhớ có thể thay đổi và gây re-render. |
| [[#useEffect]] | Chạy code phụ sau khi màn hình đã vẽ xong. |
| [[#useLayoutEffect]] | Như useEffect nhưng chạy trước khi browser vẽ. |
| [[#useRef]] | Ô nhớ tồn tại qua các lần render nhưng đổi không gây re-render. |
| [[#Virtual DOM (VDOM)]] | Cây object trong bộ nhớ mô tả UI để đem đi so sánh. |
| [[#Reconciliation]] | Quá trình React đối chiếu cây mới với cây cũ. |
| [[#Diffing]] | Thuật toán so sánh cụ thể bên trong reconciliation. |
| [[#key]] | Danh tính của item trong danh sách, giúp React nhận ra ai là ai. |
| [[#Mount / Unmount]] | Lần đầu component xuất hiện / lúc bị gỡ khỏi cây. |
| [[#Re-render]] | React gọi lại hàm component để lấy mô tả UI mới. |
| [[#Render phase]] | Giai đoạn tính toán, chưa đụng vào DOM thật. |
| [[#Commit phase]] | Giai đoạn áp thay đổi vào DOM thật. |
| [[#Fiber]] | Kiến trúc và đơn vị công việc cho phép React tạm dừng giữa chừng. |
| [[#Scheduler]] | Bộ phân lịch quyết định làm việc gì trước, khi nào nhường main thread. |
| [[#Concurrent rendering]] | Render có thể bị ngắt, hoãn, bỏ dở để ưu tiên việc gấp. |
| [[#Automatic batching]] | Gom nhiều setState trong cùng lượt thành một lần render. |
| [[#Pure function (component thuần)]] | Cùng input phải cho cùng output, không gây tác dụng phụ khi render. |
| [[#StrictMode]] | Chế độ dev cố tình chạy đôi để lộ ra bug ẩn. |
| [[#Synthetic event]] | Lớp bọc sự kiện của React đặt lên trên event thật của browser. |
| [[#Controlled vs Uncontrolled component]] | Ai giữ giá trị của input: React hay bản thân DOM. |
| [[#Lifting state up]] | Đẩy state lên cha chung khi nhiều con cần dùng chung. |
| [[#Prop drilling]] | Truyền props xuyên qua nhiều tầng chỉ để tới tầng dưới cùng. |
| [[#Context]] | Đường ống truyền dữ liệu bỏ qua các tầng trung gian. |
| [[#Memoization (React.memo, useMemo, useCallback)]] | Nhớ kết quả cũ để khỏi tính lại khi input không đổi. |
| [[#CSR / SSR / SSG]] | Ba nơi HTML được sinh ra: trình duyệt, server lúc request, lúc build. |
| [[#Hydration]] | Gắn logic React vào HTML có sẵn từ server. |
| [[#RSC (React Server Component)]] | Component chỉ chạy trên server, không gửi JS xuống client. |
| [[#CSS Modules]] | Tự đổi tên class thành duy nhất lúc build để khỏi đụng nhau. |
| [[#CSS-in-JS]] | Viết CSS bằng JS, sinh class và chèn style lúc chạy. |
| [[#Bundle size]] | Tổng dung lượng JS người dùng phải tải và chạy. |

---

### JSX

**Dịch thô:** cú pháp XML trong JavaScript · **Gặp ở:** [[05 - React - JSX bien thanh gi]]

Cú pháp cho phép viết thứ trông y hệt HTML ngay trong file JavaScript. Browser **không hiểu JSX** — nó chỉ là đường tắt cú pháp, phải qua bước dịch mới thành JS chạy được. Vài chỗ khác HTML vì trùng từ khoá JS: `class` → `className`, `for` → `htmlFor`, và mọi thuộc tính viết kiểu camelCase (`onClick`, `tabIndex`).

```jsx
const el = <h1 className="title">Chào {name}</h1>;
```

> 💡 **Nhớ nhanh:** JSX không phải HTML, cũng không phải template — nó là JavaScript hoá trang.

### Transpile (trong React)

**Dịch thô:** dịch cú pháp · **Gặp ở:** [[05 - React - JSX bien thanh gi]]

Bước build biến JSX thành JS thuần bằng Babel, SWC hoặc esbuild. Hiểu bước này giải toả rất nhiều bí ẩn: vì sao phải viết hoa tên component (chữ thường bị dịch thành chuỗi `'div'`, chữ hoa dịch thành biến), vì sao không đặt được `if` giữa JSX (vì mọi thứ trở thành **đối số của một lời gọi hàm**).

```jsx
<Button color="red">OK</Button>
// → jsx(Button, { color: "red", children: "OK" })
```

> 💡 **Nhớ nhanh:** mọi câu hỏi "vì sao JSX không cho tôi làm X" đều trả lời được bằng cách nhìn code sau khi dịch.

### React.createElement()

**Dịch thô:** hàm tạo phần tử React · **Gặp ở:** [[05 - React - JSX bien thanh gi]]

Hàm mà JSX được dịch thành theo cách cũ (classic runtime). Nó nhận: loại element (chuỗi `'div'` hoặc chính hàm component), object props, rồi các children. Nó **không tạo DOM** — chỉ trả về một object JS mô tả ý định. Đây chính là lý do file dùng JSX ngày xưa bắt buộc phải `import React`.

```js
React.createElement('h1', { className: 'title' }, 'Chào ', name);
```

> 💡 **Nhớ nhanh:** `createElement` không "create element" thật — nó chỉ viết đơn đặt hàng.

### Automatic JSX runtime (_jsx)

**Dịch thô:** runtime JSX tự động · **Gặp ở:** [[05 - React - JSX bien thanh gi]]

Cách dịch JSX mới (React 17+): thay vì `React.createElement`, compiler tự chèn `import { jsx as _jsx } from 'react/jsx-runtime'` vào đầu file. Nhờ vậy bạn **không cần `import React` nữa**. Khác biệt nhỏ: `children` được đưa vào trong object props chứ không phải làm đối số rời, và có bản `jsxDEV` riêng cho dev kèm thông tin file/dòng để báo lỗi rõ hơn.

> 💡 **Nhớ nhanh:** vẫn cùng một ý tưởng "tạo object mô tả", chỉ đổi tên hàm và ai lo phần `import`.

### React element

**Dịch thô:** phần tử React · **Gặp ở:** [[05 - React - JSX bien thanh gi]] · [[06 - React - Virtual DOM, Reconciliation va Fiber]]

Một object JS nhẹ tênh, **bất biến** (tạo xong không sửa), chỉ mô tả "cần hiển thị gì": `{ type, props, key, ... }`. Nó không có phương thức, không nằm trên màn hình, không phải DOM node. Mỗi lần render là React tạo ra một lô element mới hoàn toàn — chuyện đó rẻ vì chúng chỉ là object.

> 💡 **Nhớ nhanh:** React element là tờ đơn thuốc, không phải viên thuốc.

### Component

**Dịch thô:** thành phần · **Gặp ở:** [[05 - React - JSX bien thanh gi]] · [[11 - So sanh truc tiep - React vs Web Components]]

Một hàm JS nhận `props` và trả về mô tả UI (React element). Tên **bắt buộc viết hoa chữ cái đầu** để JSX phân biệt với thẻ HTML. Lưu ý: component của React **không phải** một element trong DOM — nó không tồn tại trong `document`, bạn không `querySelector` được nó. Đây là khác biệt căn bản với [[D - Web Components va DOM nang cao#Custom Element|Custom Element]], vốn là element thật.

> 💡 **Nhớ nhanh:** component React chỉ sống trong ký ức của React; custom element sống thật trong DOM.

### Props

**Dịch thô:** thuộc tính truyền vào · **Gặp ở:** [[05 - React - JSX bien thanh gi]]

Object dữ liệu cha truyền xuống con. Con **chỉ được đọc, không được sửa** — sửa props là phá luật của React. Props không giới hạn kiểu: có thể là chuỗi, số, mảng, object, hàm, thậm chí cả JSX. Việc truyền được cả object và hàm một cách tự nhiên là điểm React sướng hơn HTML attribute thuần (vốn chỉ chứa được chuỗi).

> 💡 **Nhớ nhanh:** props là "hàng gửi từ trên xuống, cấm bóc ra sửa rồi gửi ngược".

### State

**Dịch thô:** trạng thái · **Gặp ở:** [[07 - React - Truy vet mot lan setState tu click den pixel]]

Dữ liệu do chính component giữ và có quyền thay đổi. Thay đổi state là tín hiệu bảo React "vẽ lại tôi đi". Hai điều hay bị hiểu sai: (1) `setState` **không** đổi biến ngay lập tức — trong cùng một lần chạy hàm, `count` vẫn là giá trị cũ; (2) phải thay bằng **giá trị mới**, sửa trực tiếp mảng/object cũ (`arr.push`) thì React không nhận ra gì đã đổi.

```js
setItems([...items, newItem]);  // đúng
items.push(newItem);            // sai: React không thấy gì thay đổi
```

> 💡 **Nhớ nhanh:** state là ảnh chụp của một lần render — muốn ảnh mới thì phải yêu cầu chụp lại, chứ không tô lên ảnh cũ.

### Hook

**Dịch thô:** móc nối · **Gặp ở:** [[07 - React - Truy vet mot lan setState tu click den pixel]]

Hàm bắt đầu bằng `use` cho phép hàm component "móc" vào các tính năng của React: nhớ state, chạy side effect, đọc context. Luật sắt: **chỉ gọi ở cấp cao nhất của component** (không trong `if`, không trong vòng lặp). Lý do rất thực tế: React nhận diện hook bằng **thứ tự gọi**, không phải bằng tên — gọi lệch thứ tự giữa hai lần render là state lẫn lộn ngay.

> 💡 **Nhớ nhanh:** React đếm hook theo số thứ tự như xếp hàng. Nhảy hàng là lấy nhầm đồ của người khác.

### useState

**Dịch thô:** dùng trạng thái · **Gặp ở:** [[07 - React - Truy vet mot lan setState tu click den pixel]]

Hook tạo một ô nhớ tồn tại xuyên các lần render, trả về cặp `[giá trị, hàm cập nhật]`. Gọi hàm cập nhật sẽ xếp lịch re-render. Khi giá trị mới phụ thuộc giá trị cũ, luôn dùng **dạng hàm** để tránh dính [[B - JS Runtime va Event Loop#Closure|stale closure]]. React so sánh bằng `Object.is`, nên set lại đúng giá trị cũ sẽ bị bỏ qua, không render lại.

```js
setCount(count + 1); setCount(count + 1);   // chỉ +1
setCount(c => c + 1); setCount(c => c + 1); // +2
```

> 💡 **Nhớ nhanh:** dạng hàm `c => c + 1` là "tính dựa trên số mới nhất", dạng thường là "tính dựa trên số tôi thấy lúc render".

### useEffect

**Dịch thô:** dùng hiệu ứng phụ · **Gặp ở:** [[07 - React - Truy vet mot lan setState tu click den pixel]]

Chạy code **sau khi** React đã cập nhật DOM và browser đã vẽ xong: gọi API, đăng ký listener, chỉnh title trang. Mảng dependency quyết định khi nào chạy lại: `[]` là chỉ một lần lúc mount, `[a, b]` là chạy lại khi `a` hoặc `b` đổi, bỏ trống là chạy sau **mọi** lần render. Hàm bạn `return` bên trong là hàm dọn dẹp, chạy trước lần effect kế tiếp và lúc unmount.

```js
useEffect(() => { const id = setInterval(tick, 1000); return () => clearInterval(id); }, []);
```

> 💡 **Nhớ nhanh:** `useEffect` là "sau khi lên hình rồi thì làm nốt việc hậu trường" — đừng dùng nó để tính toán dữ liệu hiển thị.

### useLayoutEffect

**Dịch thô:** hiệu ứng chạy trước khi vẽ · **Gặp ở:** [[07 - React - Truy vet mot lan setState tu click den pixel]]

Giống `useEffect` nhưng chạy **đồng bộ ngay sau khi React sửa DOM và trước khi browser vẽ**. Dùng khi bạn cần đo kích thước/vị trí rồi chỉnh lại ngay mà không muốn người dùng thấy nhấp nháy (ví dụ định vị tooltip). Đổi lại, nó **chặn** việc vẽ nên làm chậm màn hình — mặc định vẫn nên chọn `useEffect`.

> 💡 **Nhớ nhanh:** `useLayoutEffect` là "sửa son phấn trước khi màn kéo lên"; `useEffect` là "sửa sau khi khán giả đã thấy".

### useRef

**Dịch thô:** dùng tham chiếu · **Gặp ở:** [[07 - React - Truy vet mot lan setState tu click den pixel]]

Tạo một object `{ current: ... }` sống xuyên các lần render nhưng **đổi `.current` KHÔNG gây re-render**. Hai công dụng chính: (1) giữ tham chiếu tới DOM node thật qua `ref={myRef}`; (2) làm cái hộp nhớ giá trị giữa các lần render mà không cần vẽ lại — ví dụ lưu id của `setInterval`, lưu giá trị trước đó.

```js
const inputRef = useRef(null);
<input ref={inputRef} />;  inputRef.current.focus();
```

> 💡 **Nhớ nhanh:** `useState` là "đổi thì báo cả nhà"; `useRef` là "đổi thì im lặng ghi vào sổ tay".

### Virtual DOM (VDOM)

**Dịch thô:** DOM ảo · **Gặp ở:** [[06 - React - Virtual DOM, Reconciliation va Fiber]]

Cây các object JS nhẹ mô tả UI nên trông thế nào, giữ trong bộ nhớ. Mỗi lần render, React dựng cây mới rồi so với cây cũ để tìm ra thay đổi tối thiểu cần áp vào DOM thật.

**Nói cho đúng, tránh huyền thoại:** VDOM **không nhanh hơn** thao tác DOM trực tiếp. Sửa một node bằng tay luôn nhanh hơn dựng cả cây rồi so sánh. Giá trị thật của VDOM là **lập trình**: bạn được viết code kiểu "UI trông như thế này" và không phải tự tay tính xem cần thêm/xoá/sửa node nào. Nó nhanh hơn so với *cách viết ngây thơ* là xoá sạch rồi dựng lại tất cả — không phải nhanh hơn code DOM tối ưu bằng tay.

> 💡 **Nhớ nhanh:** VDOM bán sự tiện, không bán tốc độ. "Nhanh hơn DOM" là quảng cáo, không phải sự thật.

### Reconciliation

**Dịch thô:** đối chiếu, dung hoà · **Gặp ở:** [[06 - React - Virtual DOM, Reconciliation va Fiber]]

Toàn bộ quá trình React đối chiếu cây mô tả mới với cây đang có, quyết định node nào giữ, node nào cập nhật, node nào tạo mới, node nào xoá. Hai luật rút gọn quan trọng: nếu **kiểu element đổi** (`<div>` thành `<span>`, hoặc component A thành component B), React **vứt cả cây con và dựng lại từ đầu** — state bên trong mất sạch. Nếu kiểu giữ nguyên, React chỉ cập nhật thuộc tính khác nhau.

> 💡 **Nhớ nhanh:** đổi kiểu thẻ = đập nhà xây lại; giữ kiểu thẻ = chỉ sơn lại tường.

### Diffing

**Dịch thô:** so sai khác · **Gặp ở:** [[06 - React - Virtual DOM, Reconciliation va Fiber]]

Thuật toán so sánh cụ thể bên trong reconciliation. So hai cây bất kỳ một cách tối ưu tuyệt đối tốn O(n³) — quá đắt, nên React dùng heuristic O(n): chỉ so **cùng cấp** với nhau (không đi tìm node bị di chuyển sang nhánh khác), và dựa vào `key` để nhận diện item trong danh sách.

> 💡 **Nhớ nhanh:** React không so kiểu "tìm mọi khả năng", nó so kiểu "cùng tầng, cùng vị trí" cho nhanh.

### key

**Dịch thô:** khoá định danh · **Gặp ở:** [[06 - React - Virtual DOM, Reconciliation va Fiber]]

Thuộc tính cho React biết item nào trong danh sách là item nào giữa hai lần render. Dùng **index làm key là bug chờ ngày nổ**: chèn một item vào đầu danh sách sẽ làm mọi index dịch đi, React tưởng mọi item đều đổi nội dung nên state/DOM bị gán nhầm chỗ (ô input đang gõ nhảy sang dòng khác). Hãy dùng id ổn định từ dữ liệu. `key` cũng dùng được như một mẹo: đổi `key` của component là ép React reset toàn bộ state của nó.

> 💡 **Nhớ nhanh:** `key` là số áo cầu thủ, không phải vị trí đứng trên sân.

### Mount / Unmount

**Dịch thô:** gắn vào / gỡ ra · **Gặp ở:** [[07 - React - Truy vet mot lan setState tu click den pixel]]

**Mount** là lần đầu component được tạo và DOM của nó được chèn vào trang — lúc này state khởi tạo, effect với `[]` chạy. **Unmount** là lúc component bị gỡ khỏi cây: DOM bị xoá, state mất hẳn, hàm dọn dẹp của các effect được gọi. Component ẩn bằng `display: none` thì vẫn còn mount; render có điều kiện `{show && <X/>}` mới thực sự unmount.

> 💡 **Nhớ nhanh:** mount/unmount là "sinh ra / mất đi", không phải "hiện / ẩn".

### Re-render

**Dịch thô:** vẽ lại · **Gặp ở:** [[07 - React - Truy vet mot lan setState tu click den pixel]]

React gọi lại hàm component để lấy mô tả UI mới. **Re-render không đồng nghĩa với đụng vào DOM**: nếu kết quả so ra giống hệt cũ, React chẳng sửa gì trong DOM cả. Nguyên nhân re-render: state của chính nó đổi, props đổi, context nó dùng đổi, hoặc đơn giản là component cha re-render.

> 💡 **Nhớ nhanh:** re-render = "tính lại bản vẽ". Có tính lại không có nghĩa là có đập tường.

### Render phase

**Dịch thô:** giai đoạn tính toán · **Gặp ở:** [[06 - React - Virtual DOM, Reconciliation va Fiber]] · [[07 - React - Truy vet mot lan setState tu click den pixel]]

Giai đoạn React gọi các hàm component, dựng cây mới, tìm ra danh sách thay đổi. Giai đoạn này **chưa đụng vào DOM thật**, nên nó có thể bị tạm dừng, bỏ dở và chạy lại từ đầu. Đúng vì lý do đó mà hàm component phải "thuần": đặt `fetch` hay `console.log` gây tác dụng phụ ở đây là ăn hậu quả khi React chạy lại.

> 💡 **Nhớ nhanh:** render phase là "bản nháp trên giấy" — xé đi làm lại cũng chẳng ai thấy.

### Commit phase

**Dịch thô:** giai đoạn áp thay đổi · **Gặp ở:** [[06 - React - Virtual DOM, Reconciliation va Fiber]] · [[07 - React - Truy vet mot lan setState tu click den pixel]]

Giai đoạn React thực sự áp danh sách thay đổi vào DOM thật: thêm node, đổi thuộc tính, xoá node. Chạy **đồng bộ một mạch, không thể ngắt**, để người dùng không bao giờ thấy giao diện dở dang. `useLayoutEffect` chạy cuối giai đoạn này, còn `useEffect` được hoãn tới sau khi browser vẽ.

> 💡 **Nhớ nhanh:** commit là lúc thợ thật sự cầm búa — bắt đầu rồi thì phải làm cho xong.

### Fiber

**Dịch thô:** sợi công việc · **Gặp ở:** [[06 - React - Virtual DOM, Reconciliation va Fiber]]

Kiến trúc lõi của React từ v16, và cũng là tên của **đơn vị công việc**: mỗi component tương ứng một object fiber giữ type, props, state, con trỏ tới cha/con/anh em, và danh sách việc cần làm. Vì cây fiber là danh sách liên kết chứ không phải đệ quy trên call stack, React có thể **dừng giữa chừng, nhường main thread cho browser, rồi quay lại làm tiếp** — điều bất khả thi với thuật toán đệ quy cũ.

> 💡 **Nhớ nhanh:** trước Fiber, React đi một mạch không dừng được; có Fiber, nó biết đánh dấu trang sách rồi nghỉ tay.

### Scheduler

**Dịch thô:** bộ lập lịch · **Gặp ở:** [[06 - React - Virtual DOM, Reconciliation va Fiber]] · [[07 - React - Truy vet mot lan setState tu click den pixel]]

Gói riêng của React quyết định làm việc nào trước và khi nào phải nhả main thread lại cho browser. Nó gán mức ưu tiên khác nhau cho các cập nhật (gõ phím gấp hơn tải danh sách), làm việc trong khoảng ~5ms rồi kiểm tra xem có nên nhường không. Nó nhường bằng `MessageChannel` chứ không dùng `requestIdleCallback` (API đó quá thất thường trên thực tế).

> 💡 **Nhớ nhanh:** scheduler là quản đốc: chia việc, xem đồng hồ, và biết lúc nào phải cho browser thở.

### Concurrent rendering

**Dịch thô:** render đồng thời · **Gặp ở:** [[06 - React - Virtual DOM, Reconciliation va Fiber]]

Khả năng từ React 18: một lần render có thể bị **ngắt giữa chừng, hoãn lại, hoặc vứt bỏ hẳn** để nhường cho việc gấp hơn. Không phải đa luồng — vẫn một main thread, chỉ là biết chia nhỏ và nhường. Cửa vào là các API như `useTransition` và `useDeferredValue`: đánh dấu "cập nhật này không gấp", để việc gõ phím luôn mượt trong khi danh sách nặng cập nhật chậm hơn cũng không sao.

> 💡 **Nhớ nhanh:** concurrent không phải "chạy hai việc cùng lúc", mà là "biết đặt việc này xuống để làm việc gấp hơn".

### Automatic batching

**Dịch thô:** tự động gom lô · **Gặp ở:** [[07 - React - Truy vet mot lan setState tu click den pixel]]

Gọi `setState` nhiều lần trong cùng một lượt thì React chỉ render lại **một** lần. Trước React 18, chuyện này chỉ đúng bên trong event handler của React; trong `setTimeout`, `.then()` hay handler DOM thuần thì mỗi `setState` là một lần render. Từ React 18 (với `createRoot`) thì **mọi nơi đều được gom**. Cần thoát ra thì dùng `flushSync`, nhưng hiếm khi nên dùng.

> 💡 **Nhớ nhanh:** React thu hết yêu cầu trong lượt rồi mới làm một chuyến — đây cũng là lý do `count` không đổi ngay sau `setCount`.

### Pure function (component thuần)

**Dịch thô:** hàm thuần · **Gặp ở:** [[06 - React - Virtual DOM, Reconciliation va Fiber]]

Hàm thoả hai điều: cùng input luôn cho cùng output, và không gây tác dụng phụ ra bên ngoài. React yêu cầu hàm component phải như vậy **trong lúc render**: không sửa biến toàn cục, không sửa props, không gọi API, không đụng `document`. Nhờ tính chất này React mới dám bỏ dở một lần render và chạy lại mà không sợ hậu quả. Việc "bẩn" thì đẩy vào `useEffect` hoặc event handler.

> 💡 **Nhớ nhanh:** hàm component phải như cái máy tính bỏ túi — bấm cùng phép luôn ra cùng kết quả, không tự ý gửi email.

### StrictMode

**Dịch thô:** chế độ nghiêm ngặt của React · **Gặp ở:** [[07 - React - Truy vet mot lan setState tu click den pixel]]

Component bọc ngoài, **chỉ có tác dụng khi dev**, không ảnh hưởng production. Nó cố tình gọi hàm component hai lần và (từ React 18) mount → unmount → mount lại một lượt, để lộ ra những component không thuần hoặc effect quên dọn dẹp. Thấy log in hai lần là bình thường, không phải bug. Đừng nhầm với [[B - JS Runtime va Event Loop#Strict mode|strict mode của JavaScript]] — hai thứ khác nhau hoàn toàn.

> 💡 **Nhớ nhanh:** StrictMode là bài kiểm tra đột xuất: nếu code bạn tử tế thì chạy đôi cũng chẳng sao.

### Synthetic event

**Dịch thô:** sự kiện tổng hợp · **Gặp ở:** [[07 - React - Truy vet mot lan setState tu click den pixel]] · [[11 - So sanh truc tiep - React vs Web Components]]

React không gắn listener lên từng thẻ. Nó gắn listener ở **node gốc của app** (từ React 17; trước đó là ở `document`), hứng mọi event nổi lên rồi tự phân phối tới đúng handler, bọc event gốc trong một object `SyntheticEvent` để hành vi đồng nhất giữa các browser. Hệ quả cần nhớ: `e.stopPropagation()` trong React chỉ chặn được trong hệ React, còn một listener DOM thuần gắn ở giữa đường vẫn nghe thấy trước. Event gốc luôn lấy được qua `e.nativeEvent`.

> 💡 **Nhớ nhanh:** React đứng ở cửa chính hứng hết thư rồi phát lại trong nhà — nên "chặn thư" trong nhà không ngăn được người ngoài cổng.

### Controlled vs Uncontrolled component

**Dịch thô:** có kiểm soát / không kiểm soát · **Gặp ở:** [[07 - React - Truy vet mot lan setState tu click den pixel]]

**Controlled**: giá trị của input do React state quyết định (`value={v}` + `onChange`), DOM chỉ hiển thị theo — dễ validate, dễ đồng bộ, nhưng mỗi phím gõ là một lần render. **Uncontrolled**: DOM tự giữ giá trị, React chỉ đọc khi cần qua `ref` (hoặc dùng `defaultValue`) — nhẹ hơn, gần với cách HTML vốn hoạt động. Đừng nhập nhằng: đặt `value` mà quên `onChange` sẽ khiến input trơ không gõ được.

> 💡 **Nhớ nhanh:** controlled = React cầm lái; uncontrolled = để DOM tự lái, thỉnh thoảng ngó gương.

### Lifting state up

**Dịch thô:** đẩy state lên trên · **Gặp ở:** [[07 - React - Truy vet mot lan setState tu click den pixel]]

Khi hai component anh em cần dùng chung một dữ liệu, đưa state đó lên component cha gần nhất, rồi truyền xuống bằng props kèm hàm cập nhật. Đây là cách React giữ "một nguồn sự thật duy nhất". Nhược điểm khi cây sâu là dẫn tới [[#Prop drilling]].

> 💡 **Nhớ nhanh:** hai đứa trẻ giành đồ chơi thì cất đồ chơi ở chỗ bố mẹ.

### Prop drilling

**Dịch thô:** khoan props xuyên tầng · **Gặp ở:** [[07 - React - Truy vet mot lan setState tu click den pixel]]

Tình huống phải truyền một prop qua 5 tầng component chỉ để tầng thứ 6 dùng, trong khi 4 tầng ở giữa chẳng quan tâm gì tới nó. Code trở nên rườm rà và mỗi lần đổi kiểu dữ liệu là sửa cả chuỗi. Cách gỡ: [[#Context]], gom state ra ngoài (Zustand, Redux), hoặc đơn giản là truyền JSX qua prop `children`.

> 💡 **Nhớ nhanh:** như chuyền xô nước qua 6 người chỉ để tưới một chậu cây ở cuối hàng.

### Context

**Dịch thô:** ngữ cảnh dùng chung · **Gặp ở:** [[07 - React - Truy vet mot lan setState tu click den pixel]]

Cơ chế cho phép một component cung cấp giá trị cho toàn bộ cây con, và bất kỳ con cháu nào cũng đọc được bằng `useContext` mà không cần truyền qua từng tầng. Hợp cho dữ liệu ít đổi: theme, ngôn ngữ, user đang đăng nhập. Cảnh báo hiệu năng: khi giá trị context đổi thì **mọi** component đang đọc nó đều re-render — đừng nhét state đổi liên tục vào đây.

> 💡 **Nhớ nhanh:** Context là hệ thống loa phát thanh của toà nhà — tiện, nhưng thông báo liên tục thì ai cũng mệt.

### Memoization (React.memo, useMemo, useCallback)

**Dịch thô:** ghi nhớ kết quả cũ · **Gặp ở:** [[07 - React - Truy vet mot lan setState tu click den pixel]]

Ba công cụ cùng một ý tưởng: nhớ kết quả lần trước để khỏi làm lại khi input không đổi. `React.memo` bọc component, bỏ qua re-render nếu props so nông ra giống cũ. `useMemo` nhớ **giá trị** tính toán nặng. `useCallback` nhớ **định danh hàm** để không phá vỡ `React.memo` ở component con. Lưu ý: bản thân chúng cũng tốn bộ nhớ và một phép so sánh — dùng bừa thì code khó đọc mà chẳng nhanh hơn. Với React 19 và React Compiler, phần lớn các chỗ này được tự động hoá.

> 💡 **Nhớ nhanh:** memo là ghi cache — chỉ đáng khi việc tính lại đắt hơn việc so sánh.

### CSR / SSR / SSG

**Dịch thô:** dựng ở client / ở server / lúc build · **Gặp ở:** [[11 - So sanh truc tiep - React vs Web Components]]

Ba nơi HTML được sinh ra. **CSR**: server trả về một trang gần như trống, JS tải xong mới vẽ nội dung — trang đầu chậm, SEO yếu, nhưng chuyển trang sau đó rất mượt. **SSR**: server dựng HTML cho mỗi request rồi gửi xuống — thấy nội dung sớm, hợp với dữ liệu thay đổi liên tục. **SSG**: HTML được dựng sẵn lúc build, chỉ việc phục vụ file tĩnh — nhanh nhất và rẻ nhất, hợp với blog, tài liệu.

> 💡 **Nhớ nhanh:** CSR nấu tại bàn khách, SSR nấu theo đơn, SSG nấu sẵn để tủ lạnh.

### Hydration

**Dịch thô:** cấp nước, làm sống dậy · **Gặp ở:** [[11 - So sanh truc tiep - React vs Web Components]]

Sau khi server gửi HTML tĩnh xuống, React ở client chạy lại toàn bộ component để dựng cây fiber và **gắn event listener vào đám DOM có sẵn** thay vì tạo mới. Đây là khoảng thời gian khó chịu: người dùng **thấy** trang đầy đủ nhưng bấm chưa ăn. Nếu HTML server sinh khác với cái client tính ra sẽ có lỗi "hydration mismatch" — thủ phạm quen mặt là `Date.now()`, `Math.random()`, hay đọc `window` lúc render.

> 💡 **Nhớ nhanh:** hydration là đổ nước vào mì ăn liền — hình dạng có sẵn rồi, giờ mới ăn được.

### RSC (React Server Component)

**Dịch thô:** component chạy ở server · **Gặp ở:** [[11 - So sanh truc tiep - React vs Web Components]]

Component **chỉ chạy trên server**, code của nó không bao giờ được gửi xuống browser. Nó truy vấn database trực tiếp được, và thư viện nặng nó dùng (ví dụ bộ render markdown) không tính vào bundle của người dùng. Đổi lại nó **không có** state, effect hay event handler — cần tương tác thì phải giao cho Client Component (đánh dấu `'use client'`). Khác hẳn SSR ở chỗ SSR vẫn gửi JS xuống để hydrate, còn RSC thì không gửi gì cả.

> 💡 **Nhớ nhanh:** RSC là "phần giao diện nấu xong ở bếp và bưng ra" — khách không cần nhận công thức.

### CSS Modules

**Dịch thô:** CSS đóng gói theo file · **Gặp ở:** [[08 - React - CSS va chuyen khong co encapsulation]]

Viết CSS bình thường trong file `Button.module.css`, bundler sẽ tự đổi tên class thành duy nhất lúc build (`.title` → `.Button_title__x7f2a`) và trả về một object ánh xạ. Nhờ vậy hai file cùng đặt tên `.title` cũng không đụng nhau. Đây là **giải pháp lúc build, không phải cách ly thật sự**: CSS vẫn nằm chung một chỗ toàn cục, ai viết `div { margin: 0 }` vẫn ảnh hưởng khắp nơi — khác hẳn cách ly thật của [[D - Web Components va DOM nang cao#Shadow DOM|Shadow DOM]].

> 💡 **Nhớ nhanh:** CSS Modules không xây tường, nó chỉ đổi tên cho khỏi trùng.

### CSS-in-JS

**Dịch thô:** viết CSS bằng JavaScript · **Gặp ở:** [[08 - React - CSS va chuyen khong co encapsulation]]

Cách viết style ngay trong file JS (styled-components, Emotion). Ưu điểm: style theo props rất linh hoạt, tự sinh tên class, xoá component là xoá luôn style. Nhược điểm: thư viện runtime làm tăng bundle, và việc sinh + chèn CSS lúc chạy tốn thời gian, gây khó cho SSR. Xu hướng gần đây nghiêng về giải pháp không có runtime (vanilla-extract, Panda CSS) hoặc utility class (Tailwind).

> 💡 **Nhớ nhanh:** CSS-in-JS mạnh vì CSS biết suy nghĩ, tốn vì phải suy nghĩ ngay lúc người dùng đang chờ.

### Bundle size

**Dịch thô:** dung lượng gói JS · **Gặp ở:** [[11 - So sanh truc tiep - React vs Web Components]]

Tổng số byte JS người dùng phải tải, parse và chạy trước khi trang dùng được. Đừng chỉ nhìn con số gzip: **thời gian parse + execute** trên điện thoại tầm trung thường mới là thứ giết trải nghiệm. Riêng React + React DOM đã khoảng 45KB gzip trước khi bạn viết dòng code nào; Lit vào khoảng 5–7KB. Cách giảm: code splitting theo route, `import()` động, tree-shaking, bỏ thư viện to cho việc nhỏ.

> 💡 **Nhớ nhanh:** JS không như ảnh — tải xong vẫn phải "tiêu hoá", và cái dạ dày điện thoại rẻ tiền thì yếu.

---

## Nguồn

- react.dev — [Render and Commit](https://react.dev/learn/render-and-commit)
- react.dev — [State as a Snapshot](https://react.dev/learn/state-as-a-snapshot)
- react.dev — [Preserving and Resetting State](https://react.dev/learn/preserving-and-resetting-state)
- React Docs — [Reconciliation](https://legacy.reactjs.org/docs/reconciliation.html)
- react.dev — [React Server Components](https://react.dev/reference/rsc/server-components)
