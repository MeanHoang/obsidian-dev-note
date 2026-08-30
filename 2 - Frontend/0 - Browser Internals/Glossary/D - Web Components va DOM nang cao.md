# Glossary D — Web Components & DOM nâng cao

> Tra nhanh thuật ngữ gặp trong note 09–11. Không cần học thuộc, gặp từ lạ thì nhảy vào đây.

Series: [[00 - Roadmap - Tu HTML den Pixel]] · Index: [[00 - Index]]

---

## Mục lục nhanh

| Thuật ngữ | Một câu |
|---|---|
| [[#Web Components (nhóm 3 spec)]] | Tên gọi chung của ba spec: custom element, shadow DOM, template. |
| [[#Custom Element]] | Thẻ HTML do bạn tự định nghĩa, có tên chứa dấu gạch ngang. |
| [[#CustomElementRegistry]] | Sổ đăng ký toàn cục ánh xạ tên thẻ tới class. |
| [[#customElements.define()]] | Lệnh khai sinh: gắn tên thẻ với class xử lý. |
| [[#Element upgrade]] | Node đã có sẵn trong DOM được "nhập hồn" khi class được đăng ký. |
| [[#:defined]] | Selector CSS chọn element đã được định nghĩa xong. |
| [[#Autonomous vs Customized built-in element]] | Thẻ hoàn toàn mới, hay thẻ chuẩn được mở rộng bằng `is=`. |
| [[#Lifecycle callbacks (tổng quan)]] | Năm hàm browser tự gọi trong vòng đời element. |
| [[#constructor()]] | Lúc element được tạo — chỗ dựng shadow root, cấm đụng attribute. |
| [[#connectedCallback()]] | Element vừa được cắm vào document — chỗ render và gắn listener. |
| [[#disconnectedCallback()]] | Element vừa bị gỡ ra — chỗ dọn dẹp. |
| [[#attributeChangedCallback()]] | Một attribute trong danh sách theo dõi vừa đổi giá trị. |
| [[#adoptedCallback()]] | Element bị chuyển sang document khác (hiếm gặp). |
| [[#observedAttributes]] | Danh sách attribute mà browser chịu khó theo dõi giùm bạn. |
| [[#Attribute vs Property]] | Chữ trong HTML và ô nhớ trong JS — hai thứ khác nhau. |
| [[#Reflect (property → attribute)]] | Đồng bộ ngược giá trị JS ra lại HTML để CSS/devtools thấy. |
| [[#Shadow DOM]] | Cây DOM riêng gắn trong element, cách ly CSS và selector. |
| [[#Shadow root]] | Node gốc của cây con đó, trả về từ `attachShadow()`. |
| [[#Shadow host]] | Element bên ngoài đang chứa shadow root. |
| [[#Shadow boundary]] | Ranh giới mà selector, CSS và một số event không vượt qua. |
| [[#open vs closed mode]] | Cho hay không cho bên ngoài lấy `el.shadowRoot`. |
| [[#Light DOM]] | Phần con "bình thường" bạn viết giữa cặp thẻ. |
| [[#Flattened tree]] | Cây kết quả sau khi ghép light DOM vào các slot để đem đi vẽ. |
| [[#slot]] | Cái lỗ trong shadow DOM để nội dung ngoài chui vào hiển thị. |
| [[#Named slot]] | Slot có tên, nhận đúng phần tử khai `slot="tên"`. |
| [[#::slotted()]] | Selector style cho node light DOM đang nằm trong slot. |
| [[#slotchange]] | Event báo nội dung được nhét vào slot vừa đổi. |
| [[#assignedElements()]] | Hỏi một slot: rốt cuộc ai đang nằm trong bạn? |
| [[#:host / :host()]] | Selector trỏ tới chính element chủ, viết từ bên trong shadow. |
| [[#::part()]] | Cửa sổ hé ra cho bên ngoài style vài phần nội thất chỉ định. |
| [[#CSS custom property (biến CSS)]] | Biến CSS — thứ duy nhất xuyên shadow boundary một cách tự nhiên. |
| [[#Style encapsulation]] | CSS trong không lọt ra, CSS ngoài không lọt vào. |
| [[#Event retargeting]] | Event ra khỏi shadow thì `target` bị đổi thành element chủ. |
| [[#composed]] | Cờ quyết định event có được vượt shadow boundary hay không. |
| [[#composedPath()]] | Xem đường đi thật của event, kể cả đoạn bên trong shadow. |
| [[#CustomEvent]] | Event tự chế để component báo tin ra ngoài. |
| [[#template]] | Khối HTML được parse sẵn nhưng chưa hiển thị, để đem nhân bản. |
| [[#DocumentFragment]] | Túi đựng node rời, chèn vào DOM thì túi tan chỉ còn ruột. |
| [[#cloneNode()]] | Nhân bản node; muốn cả cây con thì nhớ truyền `true`. |
| [[#Declarative Shadow DOM (DSD)]] | Viết sẵn shadow DOM bằng HTML thuần, không cần JS. |
| [[#adoptedStyleSheets / Constructable Stylesheet]] | Một object stylesheet dùng chung cho nhiều shadow root. |
| [[#ElementInternals]] | Cửa hậu cho custom element có form value, ARIA và state như thẻ chuẩn. |
| [[#Form-associated custom element]] | Custom element biết submit, biết validate, biết reset cùng form. |
| [[#CustomStateSet / :state()]] | Trạng thái nội bộ của component, style được bằng CSS. |
| [[#Framework-agnostic]] | Chạy được ở mọi framework vì nó chỉ là DOM chuẩn. |
| [[#Lit]] | Thư viện nhỏ làm Web Components bớt cực. |
| [[#LitElement]] | Class cơ sở của Lit: reactive property + render tự động. |
| [[#Reactive property]] | Property mà đổi giá trị là component tự vẽ lại. |
| [[#Reactive Controller]] | Mảnh logic tái sử dụng móc vào vòng đời component — họ hàng của hook. |

---

### Web Components (nhóm 3 spec)

**Dịch thô:** các thành phần web · **Gặp ở:** [[09 - Web Components - Truy vet mot custom element tu HTML den pixel]]

Không phải một thư viện, không phải một API duy nhất — đây là **tên gọi chung của ba spec** đứng cạnh nhau: **Custom Elements** (tự định nghĩa thẻ mới), **Shadow DOM** (cây con riêng có cách ly CSS), và **HTML Template** (`<template>`, `<slot>`). Ba thứ này dùng riêng lẻ được, không bắt buộc phải xài cả bộ. Điểm khác biệt lớn nhất so với React: chúng nằm sẵn trong browser, không cần tải gì về.

> 💡 **Nhớ nhanh:** Web Components là tên của một nhóm nhạc, không phải tên của một bài hát.

### Custom Element

**Dịch thô:** phần tử tuỳ chỉnh · **Gặp ở:** [[09 - Web Components - Truy vet mot custom element tu HTML den pixel]] · [[11 - So sanh truc tiep - React vs Web Components]]

Một thẻ HTML do bạn định nghĩa, ví dụ `<user-card>`. Tên **bắt buộc có ít nhất một dấu gạch ngang** — đây là luật spec để browser chắc chắn không bao giờ đụng tên với thẻ chuẩn tương lai (`<mycard>` sẽ bị từ chối, `<my-card>` thì được). Khác với component React, nó là **element thật trong DOM**: `document.querySelector('user-card')` tìm ra, devtools thấy, `innerHTML` in ra đúng tên thẻ đó.

```js
class UserCard extends HTMLElement { /* ... */ }
customElements.define('user-card', UserCard);
```

> 💡 **Nhớ nhanh:** dấu gạch ngang là "họ" của thẻ do bạn đẻ ra — không có họ thì browser không cho vào sổ.

### CustomElementRegistry

**Dịch thô:** sổ đăng ký element tuỳ chỉnh · **Gặp ở:** [[09 - Web Components - Truy vet mot custom element tu HTML den pixel]]

Cuốn sổ toàn cục của mỗi window, truy cập qua biến `customElements`, lưu ánh xạ "tên thẻ → class". Ngoài `define()` nó còn có `get('my-card')` để lấy lại class đã đăng ký, và `whenDefined('my-card')` trả về một Promise resolve khi tên đó được định nghĩa — rất tiện để chờ trước khi đụng vào API của component.

```js
await customElements.whenDefined('user-card');
```

> 💡 **Nhớ nhanh:** registry là sổ hộ khẩu của trang: một tên chỉ đăng ký được một lần.

### customElements.define()

**Dịch thô:** định nghĩa element · **Gặp ở:** [[09 - Web Components - Truy vet mot custom element tu HTML den pixel]]

Lệnh gắn tên thẻ với class. Gọi nó là kích hoạt hai việc: mọi node cùng tên **đã có sẵn** trong document được [[#Element upgrade|upgrade]] ngay, và mọi node tạo sau này sẽ chạy đúng class đó. Vài lỗi hay gặp: gọi `define()` **hai lần cùng một tên** sẽ ném `NotSupportedError`; tên không có dấu gạch ngang ném `SyntaxError`.

```js
if (!customElements.get('user-card')) customElements.define('user-card', UserCard);
```

> 💡 **Nhớ nhanh:** `define()` là lễ khai sinh — làm một lần, làm lần hai là browser quăng lỗi vào mặt.

### Element upgrade

**Dịch thô:** nâng cấp element · **Gặp ở:** [[09 - Web Components - Truy vet mot custom element tu HTML den pixel]]

Khi HTML parser gặp `<user-card>` mà `define()` chưa chạy, browser vẫn tạo một node `HTMLElement` bình thường — nó nằm trong DOM, hiển thị được, nhưng chưa có hành vi gì. Lúc `define()` chạy, browser quét document, đổi prototype của node đó thành class của bạn rồi gọi theo **đúng thứ tự**: `constructor()` → `attributeChangedCallback()` cho từng attribute đã có sẵn trong HTML → `connectedCallback()`. Node vẫn là node cũ, không bị thay mới, nên mọi tham chiếu bạn đang giữ vẫn đúng.

> 💡 **Nhớ nhanh:** element sinh ra trước, "nhập hồn" sau.

### :defined

**Dịch thô:** đã được định nghĩa · **Gặp ở:** [[09 - Web Components - Truy vet mot custom element tu HTML den pixel]] · [[10 - Shadow DOM - Cay trong cay va ranh gioi that su]]

Pseudo-class CSS khớp với element **đã upgrade xong**. Nó sinh ra để giải quyết FOUC: khoảng thời gian giữa lúc HTML hiện ra và lúc file JS định nghĩa component tải xong, `<user-card>` là một thẻ trống nhảy múa xấu xí. Ẩn nó đi bằng `:not(:defined)` rồi để nó tự hiện khi sẵn sàng.

```css
user-card:not(:defined) { visibility: hidden; }
```

> 💡 **Nhớ nhanh:** `:defined` là tấm rèm sân khấu — kéo lên khi diễn viên đã hoá trang xong.

### Autonomous vs Customized built-in element

**Dịch thô:** element tự lập / element chuẩn được tuỳ biến · **Gặp ở:** [[09 - Web Components - Truy vet mot custom element tu HTML den pixel]]

**Autonomous** là loại bạn gặp 99% thời gian: `class X extends HTMLElement`, viết ra thẻ `<my-card>` hoàn toàn mới. **Customized built-in** là mở rộng một thẻ chuẩn để thừa hưởng hành vi có sẵn: `class X extends HTMLButtonElement`, đăng ký kèm `{ extends: 'button' }`, dùng bằng cú pháp `is=`. Vấn đề thực tế: **Safari từ chối triển khai** loại thứ hai, nên nếu cần chạy mọi nơi thì phải kèm polyfill hoặc tránh luôn.

```html
<button is="fancy-button">OK</button>
```

> 💡 **Nhớ nhanh:** autonomous là xây nhà mới; customized built-in là cơi nới nhà có sẵn — tiện hơn nhưng Safari không cấp phép.

### Lifecycle callbacks (tổng quan)

**Dịch thô:** các hàm vòng đời · **Gặp ở:** [[09 - Web Components - Truy vet mot custom element tu HTML den pixel]] · [[11 - So sanh truc tiep - React vs Web Components]]

Năm hàm mà **browser tự gọi** (bạn không bao giờ gọi tay): `constructor`, `connectedCallback`, `disconnectedCallback`, `attributeChangedCallback`, `adoptedCallback`. Chúng là bản gốc của thứ mà React gọi là `useEffect` — nhưng ở đây do chính DOM engine gọi, không cần thư viện nào ở giữa. Điểm hay bị bỏ qua: các callback này chạy **đồng bộ** ngay tại thời điểm sự kiện xảy ra, không hoãn lại như effect của React.

> 💡 **Nhớ nhanh:** đây là "hook" của browser — có trước hook của React nhiều năm và chẳng cần import gì.

### constructor()

**Dịch thô:** hàm khởi tạo · **Gặp ở:** [[09 - Web Components - Truy vet mot custom element tu HTML den pixel]]

Chạy lúc element được tạo ra, **trước khi** nó vào document. Việc đầu tiên bắt buộc là `super()`. Được làm: dựng shadow root, khởi tạo biến nội bộ, bind hàm. **Spec cấm**: đọc/ghi attribute, đụng vào children, thêm node vào chính mình. Lý do rất thực tế — lúc này parser có thể chưa đọc tới các attribute và con của thẻ, nên bạn sẽ đọc ra `null` một cách khó hiểu; ghi vào thì phá vỡ giả định của trình parse.

```js
constructor() { super(); this.attachShadow({ mode: 'open' }); }
```

> 💡 **Nhớ nhanh:** trong `constructor`, element mới chỉ là cái xác chưa mọc tay chân — đừng bắt nó đếm ngón tay.

### connectedCallback()

**Dịch thô:** khi được cắm vào cây · **Gặp ở:** [[09 - Web Components - Truy vet mot custom element tu HTML den pixel]]

Chạy mỗi lần element được chèn vào một document. Đây mới là chỗ để render nội dung, gắn event listener, gọi API, đọc attribute. Lưu ý nó **có thể chạy nhiều lần**: `appendChild` một node đã tồn tại sang chỗ khác là một lần gỡ và một lần cắm, nên cứ `disconnected` rồi lại `connected`. Vì vậy mọi thứ bạn đăng ký ở đây phải có chỗ tháo tương ứng.

> 💡 **Nhớ nhanh:** không phải "mount một lần" như React — mà là "mỗi lần cắm phích điện".

### disconnectedCallback()

**Dịch thô:** khi bị rút khỏi cây · **Gặp ở:** [[09 - Web Components - Truy vet mot custom element tu HTML den pixel]]

Chạy khi element bị gỡ khỏi DOM. Đây là nơi dọn: `removeEventListener` cho listener gắn lên `window`/`document`, `clearInterval`, huỷ `ResizeObserver`, abort fetch đang chạy. Quên dọn là rò rỉ bộ nhớ kinh điển — listener trên `window` giữ tham chiếu tới element khiến nó không bao giờ được thu hồi. Lưu ý: nó **không** được gọi khi người dùng đóng tab.

> 💡 **Nhớ nhanh:** rời phòng thì nhớ tắt điện — không ai tắt hộ bạn.

### attributeChangedCallback()

**Dịch thô:** khi attribute đổi · **Gặp ở:** [[09 - Web Components - Truy vet mot custom element tu HTML den pixel]]

Chạy khi một attribute **có tên trong `observedAttributes`** được thêm, sửa hoặc xoá; nhận `(name, oldValue, newValue)`. Giá trị luôn là **chuỗi hoặc `null`** (xoá attribute cho ra `null`). Nó cũng chạy trong lúc upgrade cho mọi attribute đã viết sẵn trong HTML — tức là **trước `connectedCallback`**, nên đừng giả định lúc đó shadow DOM đã render xong.

```js
attributeChangedCallback(name, oldVal, newVal) {
  if (oldVal === newVal) return;
  if (name === 'count') this.render();
}
```

> 💡 **Nhớ nhanh:** nó chạy sớm hơn bạn tưởng — luôn viết code phòng trường hợp "chưa render gì cả".

### adoptedCallback()

**Dịch thô:** khi bị nhận nuôi · **Gặp ở:** [[09 - Web Components - Truy vet mot custom element tu HTML den pixel]]

Chạy khi element bị chuyển sang **một document khác** bằng `document.adoptNode()` — ví dụ kéo node từ trang chính vào một `<iframe>`, hoặc từ một document tạo bởi `DOMParser`. Đây là callback hiếm dùng nhất; đa số component không cần cài đặt nó. Nếu bạn có cache thứ gì phụ thuộc `document` hay `window` thì đây là chỗ làm mới.

> 💡 **Nhớ nhanh:** đổi document = đổi quốc tịch. Cả đời code bạn có khi không gặp lần nào.

### observedAttributes

**Dịch thô:** danh sách attribute được theo dõi · **Gặp ở:** [[09 - Web Components - Truy vet mot custom element tu HTML den pixel]]

Một `static get` (hoặc `static` field) trả về mảng tên attribute. Browser **chỉ gọi `attributeChangedCallback` cho những tên có trong danh sách này** — thiếu tên là callback im lặng không chạy, và đây là lỗi "sao nó không phản ứng" phổ biến nhất khi mới học. Browser đọc danh sách này **một lần lúc `define()`**, nên sửa nó lúc chạy không có tác dụng.

```js
static observedAttributes = ['count', 'label'];
```

> 💡 **Nhớ nhanh:** browser không tự động theo dõi gì cả — bạn phải nộp danh sách tên trước.

### Attribute vs Property

**Dịch thô:** thuộc tính HTML / thuộc tính JS · **Gặp ở:** [[09 - Web Components - Truy vet mot custom element tu HTML den pixel]] · [[11 - So sanh truc tiep - React vs Web Components]]

Đây là chỗ gây nhầm nhiều nhất khi chuyển từ React sang Web Components. **Attribute** là chữ viết trong HTML, sống trong markup, **luôn luôn là chuỗi**. **Property** là ô nhớ trên object JS của element, chứa được mọi kiểu dữ liệu. Với thẻ chuẩn hai bên thường được đồng bộ sẵn, nhưng với custom element **bạn phải tự nối** — không tự nối thì gán `el.user = {...}` sẽ chẳng có gì xảy ra.

| | Attribute | Property |
|---|---|---|
| Nằm ở đâu | Trong HTML markup | Trên object JS của element |
| Kiểu dữ liệu | Chỉ chuỗi (hoặc `null`) | Bất kỳ: object, mảng, hàm |
| Đọc/ghi | `getAttribute` / `setAttribute` | `el.foo` |
| Ai theo dõi | `attributeChangedCallback` | Setter bạn tự viết |
| CSS thấy không | Có (`[foo="x"]`) | Không |
| Truyền object | Không (phải `JSON.stringify`) | Có, truyền thẳng |

```js
el.setAttribute('count', 5);   // lưu chuỗi "5"
el.count = 5;                  // lưu số 5 — chỉ chạy nếu bạn viết setter
```

Hệ quả thực tế trong template engine: React (trước v19) và Angular gán **property**, còn `innerHTML` hay HTML tĩnh chỉ đặt được **attribute**. Đó là lý do truyền một mảng vào custom element từ HTML thuần là chuyện không làm được trực tiếp.

> 💡 **Nhớ nhanh:** attribute là dòng chữ ghi trên hộp; property là món đồ thật bên trong hộp. Chữ chỉ ghi được chữ.

### Reflect (property → attribute)

**Dịch thô:** phản chiếu ngược ra HTML · **Gặp ở:** [[09 - Web Components - Truy vet mot custom element tu HTML den pixel]]

Việc setter của property chủ động ghi lại giá trị ra attribute, để CSS (`[disabled]`), devtools và code bên ngoài nhìn thấy trạng thái. Chỉ nên reflect những giá trị **đơn giản và đáng để style** (boolean, chuỗi ngắn) — đừng reflect object hay mảng. Cạm bẫy kinh điển là **vòng lặp vô tận**: setter ghi attribute → `attributeChangedCallback` chạy → gán lại property → setter chạy tiếp. Chặn bằng một phép so sánh trước khi ghi.

```js
set disabled(v) {
  v ? this.setAttribute('disabled', '') : this.removeAttribute('disabled');
}
get disabled() { return this.hasAttribute('disabled'); }
```

> 💡 **Nhớ nhanh:** reflect là treo bảng ra cửa cho người ngoài đọc — nhưng nhớ khoá vòng lặp kẻo hai bên gọi nhau bất tận.

### Shadow DOM

**Dịch thô:** DOM trong bóng tối · **Gặp ở:** [[10 - Shadow DOM - Cay trong cay va ranh gioi that su]] · [[08 - React - CSS va chuyen khong co encapsulation]]

Một cây DOM **riêng** gắn vào bên trong một element, tách khỏi cây chính. Style viết trong đó không rò ra ngoài, style ngoài (trừ vài ngoại lệ như thuộc tính kế thừa và biến CSS) không rò vào trong, và `document.querySelector` bên ngoài **không nhìn thấy** node bên trong. Đây là cách ly **thật do browser thực thi**, khác hẳn kiểu đổi tên class của [[C - React#CSS Modules|CSS Modules]] vốn chỉ là mẹo lúc build.

```js
const root = this.attachShadow({ mode: 'open' });
root.innerHTML = `<style>p { color: red }</style><p>hi</p>`;
```

> 💡 **Nhớ nhanh:** shadow DOM là căn phòng có tường thật, không phải vạch phấn kẻ trên sàn.

### Shadow root

**Dịch thô:** gốc của cây bóng · **Gặp ở:** [[10 - Shadow DOM - Cay trong cay va ranh gioi that su]]

Node gốc của cây shadow, trả về từ `attachShadow()` và truy cập lại qua `el.shadowRoot` (khi ở mode `open`). Nó là một `DocumentFragment` đặc biệt: có `querySelector`, `innerHTML`, `adoptedStyleSheets`, nhưng **không phải element** — nó không có tag name, không style trực tiếp được (muốn style phần vỏ thì dùng `:host`). Một element chỉ gắn được **một** shadow root.

> 💡 **Nhớ nhanh:** shadow root là nền móng vô hình: có thật, chứa được cả căn nhà, nhưng bạn không sơn nó được.

### Shadow host

**Dịch thô:** element chủ · **Gặp ở:** [[10 - Shadow DOM - Cay trong cay va ranh gioi that su]]

Element bên ngoài đang mang shadow root — chính là cái `<user-card>` bạn viết trong HTML. Từ trong shadow trỏ ngược ra bằng `shadowRoot.host`; từ ngoài đi vào bằng `host.shadowRoot`. Host là phần **duy nhất** người dùng component nhìn thấy và style được từ bên ngoài (`user-card { display: block }`), nên nó là mặt tiền công khai của component.

> 💡 **Nhớ nhanh:** host là cái vỏ hộp; shadow root là ruột. Người ngoài chỉ cầm được vỏ.

### Shadow boundary

**Dịch thô:** ranh giới bóng · **Gặp ở:** [[10 - Shadow DOM - Cay trong cay va ranh gioi that su]] · [[11 - So sanh truc tiep - React vs Web Components]]

Đường biên giữa cây chính và cây shadow. Những thứ **không** qua được: CSS selector hai chiều, `querySelector`, và event có `composed: false`. Những thứ **qua được**: thuộc tính CSS kế thừa (`color`, `font-family`, `line-height`...), [[#CSS custom property (biến CSS)|biến CSS]], event có `composed: true`, và mọi thứ trong JS nếu bạn cầm được tham chiếu tới node.

> 💡 **Nhớ nhanh:** biên giới này chặn selector và chặn CSS, nhưng không phải bức tường chống JS.

### open vs closed mode

**Dịch thô:** chế độ mở / đóng · **Gặp ở:** [[10 - Shadow DOM - Cay trong cay va ranh gioi that su]]

`attachShadow({ mode: 'open' })` cho phép bên ngoài lấy `el.shadowRoot`; `mode: 'closed'` khiến `el.shadowRoot` trả về `null`. Đó là **toàn bộ** khác biệt. `closed` **không phải cơ chế bảo mật**: code bên ngoài vẫn vá được `Element.prototype.attachShadow` để giữ lại tham chiếu, và bản thân bạn cũng phải tự lưu root vào biến mới dùng được. Nó chỉ gây khó cho việc test, debug và cho người dùng component muốn tuỳ biến. **Thực tế: gần như luôn chọn `open`.**

> 💡 **Nhớ nhanh:** `closed` là dán giấy "cấm nhìn", không phải lắp khoá.

### Light DOM

**Dịch thô:** DOM sáng, DOM thường · **Gặp ở:** [[10 - Shadow DOM - Cay trong cay va ranh gioi that su]]

Phần con "bình thường" mà người dùng component viết giữa cặp thẻ mở/đóng, ví dụ chữ `Xin chào` trong `<user-card>Xin chào</user-card>`. Nó thuộc về document chính, nên **CSS toàn cục style được nó** và `document.querySelector` tìm ra nó. Nếu component có shadow DOM, phần light DOM này **không tự hiển thị** — nó chỉ lên hình khi có [[#slot|`<slot>`]] đón. Đây là tương đương của `props.children` bên React.

> 💡 **Nhớ nhanh:** light DOM là đồ khách mang tới; shadow DOM là nội thất chủ nhà.

### Flattened tree

**Dịch thô:** cây đã ghép phẳng · **Gặp ở:** [[10 - Shadow DOM - Cay trong cay va ranh gioi that su]] · [[01 - Tu URL den Pixel - Vong doi mot trang web]]

Cây cuối cùng mà browser dùng để tính style và vẽ, sau khi đã ghép nội dung light DOM vào đúng vị trí các slot trong shadow tree. Đây là lý do một node có thể **nằm một chỗ trong DOM tree nhưng hiển thị ở chỗ khác**: cha trong DOM là `<user-card>`, còn cha để kế thừa style lại là thẻ bọc quanh slot. Hiểu khái niệm này giải thích được vì sao `color` từ shadow DOM lại ảnh hưởng tới chữ do bên ngoài truyền vào.

> 💡 **Nhớ nhanh:** DOM tree là sơ đồ chỗ ngồi; flattened tree là bức ảnh chụp bữa tiệc thật.

### slot

**Dịch thô:** khe cắm · **Gặp ở:** [[10 - Shadow DOM - Cay trong cay va ranh gioi that su]]

Thẻ `<slot>` đặt trong shadow DOM, làm chỗ cho nội dung light DOM hiển thị. Điểm cực kỳ quan trọng: slot **chiếu (project)** nội dung chứ **không di chuyển node**. Node vẫn ở nguyên vị trí cũ trong DOM tree, vẫn thuộc document chính, vẫn bị CSS toàn cục style — chỉ có chỗ *hiển thị* là đổi. Nội dung viết bên trong `<slot>` là nội dung mặc định, hiện khi không ai nhét gì vào.

```html
<slot>Chưa có nội dung</slot>
```

> 💡 **Nhớ nhanh:** slot là cái máy chiếu, không phải cái xe tải — nó chiếu hình chứ không chở đồ đi.

### Named slot

**Dịch thô:** khe cắm có tên · **Gặp ở:** [[10 - Shadow DOM - Cay trong cay va ranh gioi that su]]

Khi component cần nhiều chỗ nhét (header, thân, footer), đặt tên cho slot bằng `name="..."` và bên ngoài chỉ định `slot="..."`. Chỉ **con trực tiếp** của host mới gán được slot — cháu chắt bên trong không tự tìm đường ra. Mọi node không khai `slot` sẽ rơi vào slot không tên (default slot); nếu không có default slot thì chúng đơn giản là không hiển thị.

```html
<!-- shadow -->  <slot name="title"></slot><slot></slot>
<!-- light  -->  <h2 slot="title">Tiêu đề</h2><p>Nội dung</p>
```

> 💡 **Nhớ nhanh:** `name` ở trong, `slot` ở ngoài — hai chữ khác nhau, đừng viết ngược.

### ::slotted()

**Dịch thô:** phần tử đã được cắm vào · **Gặp ở:** [[10 - Shadow DOM - Cay trong cay va ranh gioi that su]]

Selector cho phép shadow DOM style những node light DOM đang nằm trong slot của nó. Hai giới hạn thường làm người mới bực: nó **chỉ chọn được con trực tiếp** được gán slot (không đi sâu vào cháu chắt), và style của nó **ưu tiên thấp hơn** CSS từ bên ngoài — vì node đó vốn thuộc document chính, chủ nhà ngoài kia có quyền cao hơn.

```css
::slotted(p) { margin: 0; }
::slotted(*)  { font-family: inherit; }
```

> 💡 **Nhớ nhanh:** đồ của khách thì bạn chỉ được chỉnh nhẹ ở lớp ngoài cùng — khách vẫn có tiếng nói cuối.

### slotchange

**Dịch thô:** đổi nội dung khe cắm · **Gặp ở:** [[10 - Shadow DOM - Cay trong cay va ranh gioi that su]]

Event bắn ra trên `<slot>` khi tập node được gán vào nó thay đổi (thêm/bớt/đổi con). Dùng khi component cần biết bên ngoài vừa nhét gì vào để đếm, đo, hay gắn listener. Lưu ý nó **`composed: false`** nên không nổi ra ngoài shadow boundary — phải nghe ngay trên chính thẻ slot. Nó cũng bắn một lần lúc slot có nội dung ban đầu.

```js
this.shadowRoot.querySelector('slot')
  .addEventListener('slotchange', e => console.log(e.target.assignedElements()));
```

> 💡 **Nhớ nhanh:** `slotchange` là tiếng chuông cửa của riêng căn phòng đó — ngoài hành lang không nghe thấy.

### assignedElements()

**Dịch thô:** các phần tử được gán vào · **Gặp ở:** [[10 - Shadow DOM - Cay trong cay va ranh gioi that su]]

Phương thức của `<slot>`, trả về mảng các **element** đang được chiếu qua nó. Bản anh em `assignedNodes()` trả về cả text node và comment. Truyền `{ flatten: true }` để đi xuyên qua các slot lồng nhau và lấy cả nội dung mặc định khi slot rỗng. Ngược lại, từ một node bất kỳ hỏi "tôi đang nằm ở slot nào" thì dùng `node.assignedSlot`.

```js
slot.assignedElements({ flatten: true });
```

> 💡 **Nhớ nhanh:** `querySelector` trong shadow không thấy đồ của khách — muốn biết khách mang gì thì phải hỏi đúng cái slot.

### :host / :host()

**Dịch thô:** chính element chủ · **Gặp ở:** [[10 - Shadow DOM - Cay trong cay va ranh gioi that su]]

Viết trong CSS của shadow DOM để trỏ tới **chính element chứa nó**. `:host` là bản trần; `:host(.dark)` chỉ khớp khi host có class đó; `:host([disabled])` khớp theo attribute. Đây là chỗ nên đặt `display` — custom element mặc định là `display: inline`, quên khai báo là layout vỡ ngay. Điểm cần nhớ về độ ưu tiên: style từ **bên ngoài** đặt lên host **thắng** `:host` bên trong, đúng theo thiết kế để người dùng component tuỳ biến được.

```css
:host { display: block; }
:host([hidden]) { display: none; }
```

> 💡 **Nhớ nhanh:** `:host` là "tôi tự nói về cái vỏ của mình" — nhưng chủ nhà bên ngoài vẫn có quyền phủ quyết.

Còn `:host-context()` thì **đừng dùng**: nó đã bị gỡ khỏi spec, chỉ Chromium hỗ trợ. Muốn theo theme thì truyền biến CSS hoặc một attribute xuống.

### ::part()

**Dịch thô:** bộ phận được hé ra · **Gặp ở:** [[10 - Shadow DOM - Cay trong cay va ranh gioi that su]]

Cơ chế cho phép component **chủ động mở** vài node bên trong cho bên ngoài style. Tác giả component đánh dấu `part="label"` lên node, người dùng ngoài viết `user-card::part(label) { ... }`. Nó là hợp đồng có kiểm soát: bạn chỉ mở đúng những phần muốn mở, và bên ngoài **chỉ đặt được thuộc tính CSS**, không selector sâu thêm vào bên trong được (`::part(label) span` không hoạt động).

```html
<span part="label">Tên</span>
```

> 💡 **Nhớ nhanh:** `::part` là ô cửa sổ nhỏ có song sắt — nhìn và với tay vào được đúng chỗ đó thôi.

### CSS custom property (biến CSS)

**Dịch thô:** thuộc tính CSS tuỳ chỉnh · **Gặp ở:** [[10 - Shadow DOM - Cay trong cay va ranh gioi that su]] · [[08 - React - CSS va chuyen khong co encapsulation]]

Biến dạng `--mau-chinh: red`, đọc bằng `var(--mau-chinh, xanh)`. Chúng **kế thừa xuống, nên xuyên qua shadow boundary một cách tự nhiên** — đây là con đường chính thống và mượt nhất để cho phép tuỳ biến giao diện component từ bên ngoài. Cách làm chuẩn: bên trong component chỉ dùng `var()` kèm giá trị mặc định, coi tên biến như một phần API công khai.

```css
:host { background: var(--card-bg, #fff); }
user-card { --card-bg: #eee; }  /* từ ngoài */
```

> 💡 **Nhớ nhanh:** biến CSS là ổ cắm chừa sẵn trên tường — khách muốn đổi đèn thì cắm vào đó, không phải đục tường.

### Style encapsulation

**Dịch thô:** đóng gói style · **Gặp ở:** [[10 - Shadow DOM - Cay trong cay va ranh gioi that su]] · [[08 - React - CSS va chuyen khong co encapsulation]]

Tính chất "CSS trong không lọt ra, CSS ngoài không lọt vào" do shadow DOM đem lại. Nhờ nó bạn viết được `p { color: red }` mà không lo huỷ diệt cả trang. Ba lỗ hổng cố ý cần nhớ: **thuộc tính kế thừa** (`color`, `font`, `line-height`) vẫn chảy vào; **biến CSS** vẫn chảy vào; và **style đặt lên chính host** từ ngoài vẫn có tác dụng. Đây là điều CSS Modules và CSS-in-JS không làm được — chúng chỉ đổi tên class chứ không dựng tường.

> 💡 **Nhớ nhanh:** cách ly thật, nhưng có chừa vài lỗ thông gió — cố ý chừa, không phải bug.

### Event retargeting

**Dịch thô:** đổi lại đích của sự kiện · **Gặp ở:** [[10 - Shadow DOM - Cay trong cay va ranh gioi that su]]

Khi một event từ bên trong shadow nổi ra ngoài, browser **đổi `event.target` thành shadow host** để không lộ chi tiết nội thất ra ngoài. Người click vào cái `<button>` trong shadow, nhưng listener gắn ở `document` lại thấy `e.target` là `<user-card>`. Bên **trong** shadow thì `target` vẫn là cái button thật. Đây là nguồn gốc của bug "sao `e.target.closest()` trả về sai node" khi làm event delegation.

> 💡 **Nhớ nhanh:** ra tới cửa thì component ký tên mình lên phong bì — người ngoài chỉ biết thư từ công ty gửi, không biết nhân viên nào viết.

### composed

**Dịch thô:** có được ghép xuyên biên hay không · **Gặp ở:** [[10 - Shadow DOM - Cay trong cay va ranh gioi that su]]

Cờ boolean trên event quyết định nó có **vượt qua shadow boundary** hay không. Đa số event tương tác người dùng (`click`, `focus`, `input`, `keydown`, `pointer*`) mặc định `composed: true`. Nhưng một loạt event quen thuộc lại là **`composed: false`**: `change`, `submit`, `slotchange`, `reset`. Đó là lý do form trong shadow DOM hay "im lặng" khó hiểu — event `submit` chết ngay tại biên giới.

> 💡 **Nhớ nhanh:** `bubbles` là "nổi lên trên", `composed` là "ra khỏi nhà" — hai chuyện khác nhau, cần cả hai mới đi xa được.

### composedPath()

**Dịch thô:** đường đi đã ghép · **Gặp ở:** [[10 - Shadow DOM - Cay trong cay va ranh gioi that su]]

Phương thức của event, trả về **mảng đầy đủ các node** mà event đi qua, kể cả đoạn bên trong shadow DOM — tức là thứ mà `e.target` đã cố giấu đi. Phần tử đầu mảng chính là node thật sự bị click. Đây là công cụ debug số một khi event trong Web Components hành xử lạ, và cũng là cách đúng để làm "click ra ngoài thì đóng dropdown".

```js
el.addEventListener('click', e => console.log(e.composedPath()[0]));
```

> 💡 **Nhớ nhanh:** `target` là lời khai chính thức; `composedPath()` là camera hành trình.

### CustomEvent

**Dịch thô:** sự kiện tự định nghĩa · **Gặp ở:** [[09 - Web Components - Truy vet mot custom element tu HTML den pixel]] · [[11 - So sanh truc tiep - React vs Web Components]]

Cách chuẩn để component báo tin ra ngoài — thay cho việc React truyền hàm `onChange` xuống bằng props. Dữ liệu kèm theo nhét vào `detail`. Điểm chết người: mặc định cả `bubbles` lẫn `composed` đều là `false`, nên event bắn từ trong shadow DOM sẽ **không ai nghe thấy**. Muốn nó đi tới cha bên ngoài thì phải bật **cả hai**.

```js
this.dispatchEvent(new CustomEvent('user-select', {
  detail: { id: 7 }, bubbles: true, composed: true,
}));
```

> 💡 **Nhớ nhanh:** React đưa dữ liệu xuống bằng props, đưa lên bằng callback; Web Components đưa xuống bằng property, đưa lên bằng event.

### template

**Dịch thô:** khuôn mẫu · **Gặp ở:** [[09 - Web Components - Truy vet mot custom element tu HTML den pixel]] · [[02 - DOM la gi - Cay, Node va API]]

Thẻ `<template>` chứa HTML được parser **đọc và hiểu sẵn nhưng chưa kích hoạt**: không hiển thị, ảnh trong đó không tải, script trong đó không chạy. Nội dung nằm trong `template.content` (một `DocumentFragment`), lấy ra dùng bằng cách clone. Lợi ích so với `innerHTML`: HTML chỉ phải parse **một lần**, sau đó nhân bản 1000 lần rất rẻ.

```html
<template id="row"><li class="row"></li></template>
```

> 💡 **Nhớ nhanh:** `<template>` là cái khuôn bánh — bản thân nó không ăn được, nhưng đúc ra bao nhiêu cái cũng nhanh.

### DocumentFragment

**Dịch thô:** mảnh tài liệu · **Gặp ở:** [[02 - DOM la gi - Cay, Node va API]] · [[09 - Web Components - Truy vet mot custom element tu HTML den pixel]]

Một container node nhẹ, sống ngoài document chính, dùng để gom nhiều node rồi chèn một lượt. Đặc tính quan trọng: khi `appendChild(fragment)`, **bản thân fragment không được chèn vào** — chỉ các con của nó được chuyển sang, còn fragment thì rỗng lại. Vì nó không nằm trong document nên thao tác bên trong nó **không gây reflow**, đó là mẹo tối ưu chèn hàng loạt cổ điển.

> 💡 **Nhớ nhanh:** fragment là cái túi nylon: đổ hàng vào tủ xong thì túi xẹp lép, không nằm lại trong tủ.

### cloneNode()

**Dịch thô:** nhân bản node · **Gặp ở:** [[09 - Web Components - Truy vet mot custom element tu HTML den pixel]]

Tạo bản sao của một node. Mặc định là **sao nông** — chỉ mình node đó, mất sạch con; truyền `true` mới sao cả cây con. Điều bản sao **không** mang theo: event listener gắn bằng `addEventListener`, và trạng thái do JS đặt (giá trị đang gõ trong input). Với `<template>` thì luôn clone `tpl.content`, đừng clone chính thẻ template.

```js
const node = tpl.content.cloneNode(true);
this.shadowRoot.append(node);
```

> 💡 **Nhớ nhanh:** clone sao được hình dáng, không sao được ký ức — listener phải gắn lại từ đầu.

### Declarative Shadow DOM (DSD)

**Dịch thô:** shadow DOM khai báo bằng HTML · **Gặp ở:** [[10 - Shadow DOM - Cay trong cay va ranh gioi that su]] · [[11 - So sanh truc tiep - React vs Web Components]]

Cách viết sẵn shadow DOM ngay trong HTML bằng `<template shadowrootmode="open">`, để **HTML parser tự dựng shadow root mà không cần JS**. Đây là mảnh ghép giúp Web Components làm được SSR: server gửi xuống HTML đã có đầy đủ nội thất, người dùng thấy ngay, JS tải sau chỉ việc gắn hành vi. Lưu ý khi dựng bằng JS: `innerHTML` **không** kích hoạt DSD, phải dùng `setHTMLUnsafe()` hoặc `DOMParser` với `{ includeShadowRoots: true }`.

```html
<user-card><template shadowrootmode="open"><p>Xin chào</p></template></user-card>
```

> 💡 **Nhớ nhanh:** DSD là bản "shadow DOM không cần điện" — HTML tự dựng, JS tới sau chỉ cắm phích.

### adoptedStyleSheets / Constructable Stylesheet

**Dịch thô:** stylesheet dựng bằng JS, dùng chung · **Gặp ở:** [[10 - Shadow DOM - Cay trong cay va ranh gioi that su]]

`new CSSStyleSheet()` tạo một object stylesheet trong JS, nạp CSS bằng `replaceSync()`, rồi gán vào `shadowRoot.adoptedStyleSheets`. Cái hay là **một object dùng chung cho 1000 instance**: browser chỉ parse CSS một lần thay vì nhân bản thẻ `<style>` một nghìn lần. Sửa stylesheet đó là mọi component dùng nó đổi theo ngay. Lit dùng đúng cơ chế này bên dưới `static styles`.

```js
const sheet = new CSSStyleSheet();
sheet.replaceSync(':host { display: block }');
this.shadowRoot.adoptedStyleSheets = [sheet];
```

> 💡 **Nhớ nhanh:** thay vì phát cho mỗi phòng một bản nội quy in riêng, treo một bản chung ai cũng đọc.

### ElementInternals

**Dịch thô:** phần ruột chuẩn của element · **Gặp ở:** [[09 - Web Components - Truy vet mot custom element tu HTML den pixel]]

Object lấy bằng `this.attachInternals()` trong constructor, mở cho custom element những khả năng vốn chỉ thẻ chuẩn mới có: tham gia form (`setFormValue`), báo lỗi validate (`setValidity`), khai vai trò accessibility mặc định (`internals.role`, `internals.ariaLabel`), và giữ [[#CustomStateSet / :state()|state nội bộ]]. Mỗi element gọi được **một lần duy nhất**, gọi lần hai ném lỗi.

```js
constructor() { super(); this.internals = this.attachInternals(); }
```

> 💡 **Nhớ nhanh:** `ElementInternals` là bộ giấy tờ giúp thẻ tự chế được đối xử như công dân hạng nhất.

### Form-associated custom element

**Dịch thô:** custom element gắn được vào form · **Gặp ở:** [[09 - Web Components - Truy vet mot custom element tu HTML den pixel]]

Khai `static formAssociated = true` là component của bạn được `<form>` công nhận: giá trị đặt bằng `internals.setFormValue()` sẽ đi theo `FormData` lúc submit, và bạn nhận thêm các callback riêng như `formResetCallback`, `formDisabledCallback`, `formStateRestoreCallback`. Không có cơ chế này thì mọi input tự chế nằm trong shadow DOM đều **vô hình với form** — một cái bẫy rất hay gặp.

```js
static formAssociated = true;
set value(v) { this.internals.setFormValue(v); }
```

> 💡 **Nhớ nhanh:** shadow DOM giấu input khỏi form; `formAssociated` là cách khai báo lại "tôi cũng là một ô nhập liệu".

### CustomStateSet / :state()

**Dịch thô:** tập trạng thái tuỳ chỉnh · **Gặp ở:** [[09 - Web Components - Truy vet mot custom element tu HTML den pixel]] · [[10 - Shadow DOM - Cay trong cay va ranh gioi that su]]

Nơi chứa các trạng thái nội bộ của component (`internals.states`, một Set), style được từ CSS bằng pseudo-class `:state(ten)`. Nó thay cho thói quen cũ là reflect ra attribute chỉ để CSS bắt được — vốn làm bẩn HTML và cho phép người ngoài giả mạo trạng thái. Cú pháp từng là `--ten` ở bản Chrome đời đầu, nay chuẩn hoá thành `:state()`.

```js
this.internals.states.add('loading');
```
```css
:host(:state(loading)) { opacity: .5 }
```

> 💡 **Nhớ nhanh:** giống `:checked`, `:disabled` của thẻ chuẩn — nhưng là trạng thái do bạn tự đặt tên.

### Framework-agnostic

**Dịch thô:** không phụ thuộc framework · **Gặp ở:** [[11 - So sanh truc tiep - React vs Web Components]]

Tính chất "chạy được ở mọi nơi" của Web Components: vì chúng chỉ là DOM chuẩn, một `<user-card>` dùng được trong React, Vue, Angular, Svelte, hay file HTML trần, mà không cần bản build riêng cho từng framework. Đây là lý do các design system dùng chung cho nhiều đội (Shoelace, Adobe Spectrum, Material Web) chọn con đường này. Đổi lại phải chấp nhận vài chỗ gợn: React trước v19 gán property kém, TypeScript và SSR cần thêm công.

> 💡 **Nhớ nhanh:** framework đến rồi đi; `<button>` thì ở lại — Web Components cược vào phe ở lại.

### Lit

**Dịch thô:** (tên riêng) · **Gặp ở:** [[11 - So sanh truc tiep - React vs Web Components]] · [[00 - Roadmap Web Components - Lit]]

Thư viện nhỏ của Google (~5–7KB gzip) làm cho việc viết Web Components bớt cực: khai báo property phản ứng, template hiệu quả, quản lý style. Nó **không thay thế** chuẩn Web Components mà đứng trên chuẩn — kết quả cuối cùng vẫn là custom element thật, ai không dùng Lit vẫn xài được. Template dùng [[B - JS Runtime va Event Loop#Tagged template literal|tagged template literal]] nên không cần bước build để chạy thử.

```js
html`<p>Chào ${name}</p>`
```

> 💡 **Nhớ nhanh:** Lit là bộ đồ nghề cho chuẩn có sẵn, không phải một framework đòi bạn viết theo luật riêng.

### LitElement

**Dịch thô:** class element của Lit · **Gặp ở:** [[11 - So sanh truc tiep - React vs Web Components]] · [[00 - Roadmap Web Components - Lit]]

Class cơ sở kế thừa `HTMLElement`, lo giùm bạn phần nhàm chán: tự tạo shadow root, tự theo dõi property, tự gọi `render()` khi có gì đổi, và tự gom nhiều thay đổi trong cùng một lượt thành **một** lần cập nhật (chạy ở microtask). Bạn chỉ viết `static properties` và hàm `render()` trả về template.

```js
class UserCard extends LitElement {
  static properties = { name: {} };
  render() { return html`<p>Chào ${this.name}</p>`; }
}
```

> 💡 **Nhớ nhanh:** `LitElement` làm với custom element đúng việc React làm với DOM: bạn mô tả kết quả, nó lo phần cập nhật.

### Reactive property

**Dịch thô:** thuộc tính phản ứng · **Gặp ở:** [[11 - So sanh truc tiep - React vs Web Components]] · [[00 - Roadmap Web Components - Lit]]

Property khai trong `static properties` của Lit: đổi giá trị là component tự xếp lịch vẽ lại, gần giống `useState` bên React nhưng viết như một thuộc tính bình thường. Lit so sánh bằng `!==` nên **sửa tại chỗ mảng/object sẽ không kích hoạt gì** — phải gán giá trị mới, đúng bài học đã gặp ở [[C - React#State|state của React]]. Khai `{ attribute: false }` cho dữ liệu phức tạp, `{ reflect: true }` khi muốn giá trị hiện ra HTML.

```js
static properties = { items: { attribute: false }, open: { type: Boolean, reflect: true } };
```

> 💡 **Nhớ nhanh:** viết như biến thường, hành xử như state — nhưng vẫn phải "thay mới" chứ không "sửa lén".

### Reactive Controller

**Dịch thô:** bộ điều khiển phản ứng · **Gặp ở:** [[11 - So sanh truc tiep - React vs Web Components]] · [[00 - Roadmap Web Components - Lit]]

Một object thường có các hàm `hostConnected`, `hostDisconnected`, `hostUpdate`... được component đăng ký qua `addController()`. Đây là cách Lit tái sử dụng logic có vòng đời — vai trò tương đương custom hook bên React (ví dụ: theo dõi kích thước, giữ kết nối WebSocket, đồng bộ URL). Khác biệt so với hook: nó là object bình thường, không phụ thuộc thứ tự gọi, và một controller phục vụ được nhiều host.

> 💡 **Nhớ nhanh:** controller là "custom hook dạng object" — không có luật xếp hàng, chỉ có đăng ký và bị gọi.

---

## Nguồn

- MDN — [Web Components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components)
- MDN — [Using shadow DOM](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM)
- HTML Spec — [Custom elements](https://html.spec.whatwg.org/multipage/custom-elements.html)
- DOM Spec — [Shadow trees](https://dom.spec.whatwg.org/#shadow-trees)
- CSS Scoping — [Selectors for shadow trees](https://drafts.csswg.org/css-scoping/)
- lit.dev — [Components overview](https://lit.dev/docs/components/overview/)
- web.dev — [Declarative Shadow DOM](https://web.dev/articles/declarative-shadow-dom)
