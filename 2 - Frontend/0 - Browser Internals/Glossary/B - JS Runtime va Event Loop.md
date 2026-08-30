# Glossary B — JS Runtime & Event Loop

> Tra nhanh thuật ngữ gặp trong note 03–04 (và mọi chỗ nói về JS chạy thế nào). Không cần học thuộc, gặp từ lạ thì nhảy vào đây.

Series: [[00 - Roadmap - Tu HTML den Pixel]] · Index: [[00 - Index]]

---

## Mục lục nhanh

| Thuật ngữ | Một câu |
|---|---|
| [[#JS engine (V8)]] | Chương trình đọc và chạy code JS của bạn. |
| [[#Call stack]] | Chồng đĩa ghi nhớ hàm nào đang gọi hàm nào. |
| [[#Heap]] | Kho bộ nhớ chứa object, array, function. |
| [[#Single-threaded]] | JS chỉ có một luồng — làm xong việc này mới tới việc kia. |
| [[#Web API (browser API)]] | Những khả năng browser cho JS mượn: DOM, fetch, timer. |
| [[#Event loop]] | Vòng lặp điều phối: hết việc thì lấy việc mới ra chạy. |
| [[#Task (Macrotask)]] | Một đơn vị việc lớn: chạy script, xử lý click, callback timer. |
| [[#Task queue]] | Hàng đợi chứa các task chờ tới lượt. |
| [[#Microtask]] | Việc nhỏ ưu tiên cao, chen ngay sau task hiện tại. |
| [[#Microtask queue]] | Hàng đợi riêng cho microtask, luôn được vét sạch. |
| [[#queueMicrotask()]] | Cách chủ động nhét một việc vào microtask queue. |
| [[#Rendering opportunity]] | Khe thời gian browser được phép vẽ lại màn hình. |
| [[#requestAnimationFrame() (rAF)]] | Đặt lịch chạy code ngay trước lần vẽ tiếp theo. |
| [[#Frame / 60fps / 16.7ms]] | Ngân sách thời gian cho mỗi khung hình. |
| [[#Blocking]] | Chiếm luồng chính khiến mọi thứ khác đứng chờ. |
| [[#Long task]] | Task chạy quá 50ms — thủ phạm chính gây lag. |
| [[#Batching (gom lô)]] | Gom nhiều thay đổi lại xử lý một lần cho rẻ. |
| [[#Synchronous vs Asynchronous]] | Chạy thẳng một mạch hay hẹn lát nữa quay lại. |
| [[#Callback]] | Hàm đưa cho người khác giữ để gọi lại sau. |
| [[#Promise]] | Object đại diện cho một kết quả sẽ có trong tương lai. |
| [[#async / await]] | Cú pháp viết code bất đồng bộ trông như đồng bộ. |
| [[#Closure]] | Hàm nhớ luôn "hộp biến" nơi nó được sinh ra. |
| [[#ES Module (ESM)]] | Hệ module chuẩn của JS, browser hiểu trực tiếp. |
| [[#import / export]] | Hai từ khoá để chia và ghép code giữa các file. |
| [[#Bundler (Vite, webpack)]] | Gom hàng trăm file module thành vài file để tải nhanh. |
| [[#Transpiler (Babel, SWC)]] | Dịch cú pháp mới/JSX thành JS mà browser hiểu. |
| [[#Minify]] | Ép code nhỏ lại: xoá khoảng trắng, rút tên biến. |
| [[#Tree-shaking]] | Cắt bỏ code được import nhưng không hề dùng. |
| [[#Source map]] | Bản đồ dẫn ngược từ code đã build về code gốc. |
| [[#defer (attribute)]] | Tải song song, chạy sau khi HTML parse xong, đúng thứ tự. |
| [[#async (attribute)]] | Tải song song, tải xong là chạy ngay, không đảm bảo thứ tự. |
| [[#DOMContentLoaded]] | Sự kiện báo "cây DOM đã dựng xong". |
| [[#load]] | Sự kiện báo "mọi ảnh, font, iframe đã tải xong". |
| [[#Tagged template literal]] | Hàm nhận thẳng các mảnh chuỗi và biến — Lit sống bằng cái này. |
| [[#Strict mode]] | Chế độ JS nghiêm khắc, ít bẫy ngầm hơn. |
| [[#Event bubbling / capturing]] | Sự kiện đi từ ngoài vào rồi từ trong ra. |
| [[#Event delegation]] | Gắn một listener ở cha thay vì trăm listener ở con. |
| [[#preventDefault() / stopPropagation()]] | Chặn hành vi mặc định vs chặn đường đi của event. |

---

### JS engine (V8)

**Dịch thô:** bộ máy chạy JavaScript · **Gặp ở:** [[03 - Script duoc tai luc nao - defer, async, module]] · [[04 - Event Loop - Task, Microtask va luc browser ve]]

Chương trình biết đọc code JS và thực thi nó. Chrome/Edge/Node.js dùng **V8**, Safari dùng JavaScriptCore, Firefox dùng SpiderMonkey. V8 không "thông dịch từng dòng" như người ta hay tưởng: nó parse thành bytecode rồi chạy, đoạn nào chạy nhiều lần sẽ được biên dịch tiếp thành mã máy tối ưu (JIT). Điểm quan trọng cần nhớ: **event loop, `setTimeout`, DOM đều KHÔNG nằm trong V8** — chúng do browser cung cấp.

> 💡 **Nhớ nhanh:** V8 là cái động cơ; browser là cả chiếc xe (có bánh, đèn, còi) lắp quanh động cơ đó.

### Call stack

**Dịch thô:** chồng lời gọi hàm · **Gặp ở:** [[04 - Event Loop - Task, Microtask va luc browser ve]]

Cấu trúc dạng chồng đĩa ghi lại hàm nào đang chạy và ai gọi nó. Gọi hàm → đặt một đĩa lên; hàm `return` → nhấc đĩa ra. Khi lỗi xảy ra, cái stack trace bạn thấy trong console chính là ảnh chụp chồng đĩa này từ trên xuống. Đệ quy vô hạn thì chồng cao quá giới hạn → `Maximum call stack size exceeded`.

> 💡 **Nhớ nhanh:** call stack là chồng đĩa — đĩa đặt sau cùng luôn được lấy ra trước.

### Heap

**Dịch thô:** vùng nhớ động · **Gặp ở:** [[04 - Event Loop - Task, Microtask va luc browser ve]]

Kho bộ nhớ lộn xộn nơi mọi object, array, function thực sự nằm. Biến của bạn trên stack chỉ giữ **địa chỉ** trỏ vào heap. Đây là lý do `a = {x:1}; b = a; b.x = 2;` thì `a.x` cũng thành 2 — hai biến trỏ chung một chỗ trong heap. Bộ dọn rác (garbage collector) tự thu hồi vùng heap không còn ai trỏ tới.

> 💡 **Nhớ nhanh:** heap là nhà kho, biến chỉ là tờ giấy ghi số kệ.

### Single-threaded

**Dịch thô:** đơn luồng · **Gặp ở:** [[04 - Event Loop - Task, Microtask va luc browser ve]]

JS trong một trang web chỉ có **một** call stack, tức một việc tại một thời điểm. Không có chuyện hai hàm JS chạy song song. Ưu điểm: không bao giờ phải lo hai luồng cùng sửa một biến. Nhược điểm: một vòng `for` nặng là cả trang treo. Muốn thật sự song song thì phải dùng Web Worker (một luồng khác, có heap riêng, không đụng được DOM).

> 💡 **Nhớ nhanh:** JS là quán ăn một đầu bếp — đông khách mấy cũng chỉ một tay làm.

### Web API (browser API)

**Dịch thô:** API của trình duyệt · **Gặp ở:** [[04 - Event Loop - Task, Microtask va luc browser ve]] · [[02 - DOM la gi - Cay, Node va API]]

Những năng lực browser cho JS mượn mà bản thân ngôn ngữ JS không có: `document`, `fetch`, `setTimeout`, `localStorage`, `addEventListener`. Chúng chạy **bên ngoài** JS engine, thường trên luồng khác của browser. Khi xong việc, chúng không gọi callback của bạn ngay — chúng xếp callback đó vào hàng đợi cho event loop lấy ra.

```js
setTimeout(fn, 0); // browser đếm giờ hộ, engine JS rảnh tay chạy tiếp
```

> 💡 **Nhớ nhanh:** Web API là mấy anh nhân viên browser cho mượn để chạy việc vặt; JS đưa việc rồi đi làm chuyện khác.

### Event loop

**Dịch thô:** vòng lặp sự kiện · **Gặp ở:** [[04 - Event Loop - Task, Microtask va luc browser ve]] · [[07 - React - Truy vet mot lan setState tu click den pixel]]

Vòng lặp vô tận điều phối mọi thứ, đại ý: *khi call stack rỗng → lấy một task ra chạy → chạy xong thì vét sạch microtask queue → nếu tới lúc thì vẽ lại màn hình → quay lại đầu*. Đây là lý do `setTimeout(fn, 0)` không chạy ngay lập tức: nó phải đợi code hiện tại chạy hết đã. Hiểu đúng vòng này là hiểu được vì sao UI đứng hình, vì sao `await` xen kẽ chỗ này chỗ kia.

> 💡 **Nhớ nhanh:** event loop là anh điều phối cửa bếp: "xong món này chưa? xong thì lấy phiếu tiếp theo".

### Task (Macrotask)

**Dịch thô:** việc lớn · **Gặp ở:** [[04 - Event Loop - Task, Microtask va luc browser ve]]

Một đơn vị công việc mà event loop lấy ra chạy trọn vẹn từ đầu tới cuối, không bị cắt ngang. Ví dụ: chạy một thẻ `<script>`, xử lý một cú click, callback của `setTimeout`, callback của một `<img>` load xong. Chữ "macrotask" không có trong spec (spec chỉ gọi là *task*) nhưng dev dùng để phân biệt với microtask.

> 💡 **Nhớ nhanh:** task là "một phiếu order", browser làm xong nguyên phiếu rồi mới bốc phiếu sau.

### Task queue

**Dịch thô:** hàng đợi việc · **Gặp ở:** [[04 - Event Loop - Task, Microtask va luc browser ve]]

Hàng đợi kiểu vào trước ra trước chứa các task đang chờ. Thực tế browser có **nhiều** task queue (một cho sự kiện chuột, một cho timer, một cho mạng...) và nó được quyền chọn queue nào trước theo độ ưu tiên — nên `setTimeout` 0ms có thể bị chậm hơn bạn tưởng nếu đang có sự kiện người dùng.

> 💡 **Nhớ nhanh:** không phải một hàng, mà là mấy quầy — quầy VIP (input người dùng) được gọi trước.

### Microtask

**Dịch thô:** việc nhỏ ưu tiên cao · **Gặp ở:** [[04 - Event Loop - Task, Microtask va luc browser ve]] · [[07 - React - Truy vet mot lan setState tu click den pixel]]

Việc nhỏ được chạy **ngay sau khi task hiện tại kết thúc**, trước khi browser lấy task tiếp theo và trước khi vẽ màn hình. Nguồn microtask phổ biến: `.then()` của Promise, phần sau `await`, `queueMicrotask()`, callback của `MutationObserver`. Vì được vét sạch trước lúc vẽ, đây là chỗ lý tưởng để "gom thay đổi rồi cập nhật một lần" — Lit và Vue đều đợi ở đây.

> 💡 **Nhớ nhanh:** microtask là việc "tiện tay làm nốt" trước khi rời bàn — chưa làm hết thì chưa được đứng dậy.

### Microtask queue

**Dịch thô:** hàng đợi việc nhỏ · **Gặp ở:** [[04 - Event Loop - Task, Microtask va luc browser ve]]

Hàng đợi riêng cho microtask, và luật của nó khắt khe: browser phải **vét cạn** hàng này mới đi tiếp. Nếu một microtask lại tạo thêm microtask mới, cái mới đó cũng phải chạy nốt trong cùng lượt. Hệ quả: một vòng lặp Promise vô tận sẽ treo trang vĩnh viễn, còn `setTimeout` đệ quy thì không (vì mỗi lần là một task riêng).

```js
// treo trang: microtask sinh microtask mãi mãi
function loop() { Promise.resolve().then(loop); } loop();
```

> 💡 **Nhớ nhanh:** microtask queue là cái giỏ phải đổ sạch mới được ra về — kể cả có người liên tục ném thêm vào.

### queueMicrotask()

**Dịch thô:** xếp một việc nhỏ vào hàng · **Gặp ở:** [[04 - Event Loop - Task, Microtask va luc browser ve]]

Hàm cho phép bạn chủ động nhét một callback vào microtask queue mà không cần mượn Promise. Dùng khi muốn hoãn code tới "ngay sau khi đoạn hiện tại xong nhưng trước khi browser vẽ" — ví dụ gom nhiều lần thay đổi state rồi cập nhật DOM một lần.

```js
queueMicrotask(() => console.log('sau cùng, nhưng trước setTimeout 0'));
```

> 💡 **Nhớ nhanh:** `queueMicrotask` là `Promise.resolve().then(...)` nhưng nói thẳng ý định, không vòng qua Promise.

### Rendering opportunity

**Dịch thô:** cơ hội vẽ lại · **Gặp ở:** [[04 - Event Loop - Task, Microtask va luc browser ve]] · [[07 - React - Truy vet mot lan setState tu click den pixel]]

Khe thời gian giữa các vòng event loop mà browser được phép cập nhật màn hình. Nó **không** xảy ra sau mỗi task — browser tự quyết, thường bám theo nhịp làm mới của màn hình (~60 lần/giây) và bỏ qua nếu tab đang ẩn. Đây là lý do bạn đổi `style.width` 100 lần trong một hàm thì người dùng chỉ thấy kết quả cuối: chưa có khe nào để vẽ giữa chừng cả.

> 💡 **Nhớ nhanh:** browser chỉ "chụp ảnh" trang vào những nhịp cố định, không phải mỗi lần bạn cựa quậy.

### requestAnimationFrame() (rAF)

**Dịch thô:** xin một khung hình · **Gặp ở:** [[04 - Event Loop - Task, Microtask va luc browser ve]]

Đặt lịch cho callback chạy **ngay trước** lần vẽ tiếp theo của browser. Dùng nó cho animation thay vì `setTimeout(fn, 16)`: nhịp luôn khớp với màn hình (144Hz thì nó gọi 144 lần/giây), và tab ẩn thì nó tự ngừng để tiết kiệm pin. Muốn animation chạy tiếp thì gọi lại rAF bên trong chính callback.

```js
function tick() { box.style.transform = `translateX(${x++}px)`; requestAnimationFrame(tick); }
requestAnimationFrame(tick);
```

> 💡 **Nhớ nhanh:** rAF là "gọi tôi dậy ngay trước lúc chụp ảnh", còn `setTimeout` là "gọi tôi sau chừng này phút, chụp hay chưa kệ".

### Frame / 60fps / 16.7ms

**Dịch thô:** khung hình · **Gặp ở:** [[04 - Event Loop - Task, Microtask va luc browser ve]] · [[07 - React - Truy vet mot lan setState tu click den pixel]]

Một **frame** là một khung hình được đẩy ra màn hình. Màn hình 60Hz vẽ 60 frame mỗi giây, tức mỗi frame chỉ có **1000/60 ≈ 16.7ms** để làm xong tất cả: chạy JS, layout, paint, composite. Quá 16.7ms là frame bị bỏ lỡ, người dùng thấy giật. Thực tế nên nhắm dưới ~10ms cho phần JS để chừa chỗ cho browser.

> 💡 **Nhớ nhanh:** 16.7ms là "ngân sách một khung hình" — tiêu lố thì mất một nhịp, mắt người thấy ngay.

### Blocking

**Dịch thô:** chặn luồng · **Gặp ở:** [[04 - Event Loop - Task, Microtask va luc browser ve]] · [[03 - Script duoc tai luc nao - defer, async, module]]

Chiếm giữ main thread lâu khiến mọi việc khác phải xếp hàng: không xử lý được click, không chạy được animation, không vẽ lại được. Thủ phạm hay gặp: vòng lặp trên mảng 100k phần tử, `JSON.parse` file lớn, regex tham lam, và các API đồng bộ như `alert()` hay XHR đồng bộ.

> 💡 **Nhớ nhanh:** blocking là ai đó đứng chắn ngay cửa bếp — không ai ra vào được cho tới khi họ nhích.

### Long task

**Dịch thô:** việc chạy quá lâu · **Gặp ở:** [[04 - Event Loop - Task, Microtask va luc browser ve]] · [[11 - So sanh truc tiep - React vs Web Components]]

Định nghĩa chuẩn: một task chiếm main thread **quá 50ms**. Ngưỡng 50ms có lý do — nếu người dùng bấm ngay đầu task, họ sẽ đợi tối đa ~50ms trước khi được phản hồi, vẫn nằm trong mức "cảm giác tức thì". Chrome DevTools gạch chéo đỏ trên Performance panel để chỉ ra chúng. Cách chữa: cắt việc lớn thành nhiều mẩu, hoặc đẩy sang Web Worker.

> 💡 **Nhớ nhanh:** trên 50ms là bắt đầu "sờ thấy độ trễ" — cứ coi 50ms là vạch đỏ.

### Batching (gom lô)

**Dịch thô:** gom lại xử lý một lần · **Gặp ở:** [[07 - React - Truy vet mot lan setState tu click den pixel]] · [[04 - Event Loop - Task, Microtask va luc browser ve]]

Thay vì phản ứng ngay với từng thay đổi, hệ thống ghi nhận rồi đợi tới một mốc nhất định mới xử lý gọn một lượt. React gọi `setState` 3 lần trong một handler thì chỉ render lại **một** lần; Lit gọi đổi 3 property thì chỉ update DOM **một** lần ở microtask kế tiếp. Mục đích: tránh làm việc thừa và tránh người dùng thấy trạng thái nửa vời.

> 💡 **Nhớ nhanh:** gom đơn hàng rồi giao một chuyến, thay vì chạy xe ba lần cho ba gói.

### Synchronous vs Asynchronous

**Dịch thô:** đồng bộ và bất đồng bộ · **Gặp ở:** [[04 - Event Loop - Task, Microtask va luc browser ve]]

**Đồng bộ**: dòng lệnh chạy tuần tự, dòng sau đợi dòng trước xong hẳn. **Bất đồng bộ**: bạn khởi động một việc (gọi mạng, hẹn giờ) rồi đi làm chuyện khác, kết quả về sau sẽ được xử lý trong một lượt event loop khác. Lưu ý bất đồng bộ **không có nghĩa là song song** — mọi thứ vẫn chạy trên một luồng, chỉ là đan xen theo thời gian.

> 💡 **Nhớ nhanh:** đồng bộ = đứng đợi nồi nước sôi; bất đồng bộ = bật bếp rồi đi làm việc khác, nghe tiếng còi thì quay lại.

### Callback

**Dịch thô:** hàm gọi lại · **Gặp ở:** [[04 - Event Loop - Task, Microtask va luc browser ve]]

Một hàm bạn đưa cho code khác giữ, để nó gọi lại khi tới lúc. `addEventListener('click', fn)` là đưa `fn` cho browser giữ. Vấn đề kinh điển là "callback hell": lồng callback trong callback nhiều tầng thì code thụt vào thành hình kim tự tháp và cực khó bắt lỗi — chính vì thế Promise ra đời.

> 💡 **Nhớ nhanh:** callback là để lại số điện thoại: "xong thì gọi tôi", chứ không đứng đợi.

### Promise

**Dịch thô:** lời hứa · **Gặp ở:** [[04 - Event Loop - Task, Microtask va luc browser ve]]

Một object đại diện cho **kết quả sẽ có trong tương lai**, ở một trong ba trạng thái: đang chờ (pending), thành công (fulfilled), thất bại (rejected). Đã chuyển trạng thái rồi thì không đổi lại được nữa. Callback trong `.then()` / `.catch()` luôn chạy ở **microtask**, nghĩa là sau khi code đồng bộ hiện tại xong nhưng trước khi browser vẽ.

```js
console.log(1);
Promise.resolve().then(() => console.log(3));
console.log(2);            // in ra: 1, 2, 3
```

> 💡 **Nhớ nhanh:** Promise là tờ phiếu giữ chỗ — cầm phiếu ngay, món ăn tới sau.

### async / await

**Dịch thô:** bất đồng bộ / chờ · **Gặp ở:** [[04 - Event Loop - Task, Microtask va luc browser ve]]

Cú pháp giúp viết Promise theo kiểu nhìn như code tuần tự. Hàm gắn `async` **luôn** trả về một Promise. `await` tạm dừng riêng hàm đó, trả quyền điều khiển về cho event loop, và phần code phía sau `await` sẽ chạy lại như một **microtask** khi Promise xong. Điểm dễ nhầm: `await` không chặn cả trang, nó chỉ tạm dừng đúng hàm chứa nó.

```js
async function load() {
  const res = await fetch('/api');   // nhả quyền cho browser
  return res.json();                 // chạy tiếp ở microtask sau đó
}
```

> 💡 **Nhớ nhanh:** `await` là "tôi ra ngoài hút thuốc, ai cần thì cứ dùng bếp" — không phải "khoá cửa bếp lại".

### Closure

**Dịch thô:** bao đóng · **Gặp ở:** [[07 - React - Truy vet mot lan setState tu click den pixel]] · [[05 - React - JSX bien thanh gi]]

Khi bạn định nghĩa một hàm bên trong một hàm khác, hàm con **giữ luôn đường về cái hộp biến** nơi nó được sinh ra — kể cả khi hàm cha đã chạy xong từ lâu. Nó không copy giá trị, nó giữ liên kết tới biến đó.

```js
function counter() {
  let n = 0;                 // hộp biến này không bị dọn
  return () => ++n;          // hàm con vẫn với tới n
}
const inc = counter(); inc(); inc(); // 1, 2
```

Đây là gốc rễ của **bug `setState` kinh điển** trong React. Mỗi lần component render là một lần hàm component chạy lại, sinh ra **một hộp biến mới** với một giá trị `count` mới. Callback bạn đưa vào `setTimeout` hay `useEffect` đã "chụp" hộp biến của lần render lúc đó, nên nó mãi mãi nhìn thấy giá trị cũ — dân gian gọi là **stale closure**:

```js
const [count, setCount] = useState(0);
// nhấn 3 lần thật nhanh: cả 3 lần đều thấy count = 0
const onClick = () => setTimeout(() => console.log(count), 1000);
// cách chữa: dùng dạng hàm, React đưa giá trị mới nhất vào
setCount(c => c + 1);
```

> 💡 **Nhớ nhanh:** closure là cái ba lô hàm mang theo suốt đời — trong ba lô là đồ của **ngày nó ra đời**, không phải đồ hôm nay.

### ES Module (ESM)

**Dịch thô:** module chuẩn của JS · **Gặp ở:** [[03 - Script duoc tai luc nao - defer, async, module]]

Hệ thống chia file chính thức của JavaScript, browser hiểu trực tiếp qua `<script type="module">`. Vài tính chất khác hẳn script thường: mỗi module có phạm vi riêng (khai báo `var` không rơi ra `window`), luôn ở [[#Strict mode]], được **defer mặc định** (không chặn parser), và mỗi URL chỉ tải + chạy **một lần** dù bao nhiêu file import nó.

> 💡 **Nhớ nhanh:** module là căn hộ riêng có cửa; script thường là ngủ chung phòng khách với cả nhà.

### import / export

**Dịch thô:** nhập / xuất · **Gặp ở:** [[03 - Script duoc tai luc nao - defer, async, module]]

Hai từ khoá để chia code ra file và ghép lại. `export` công bố cái gì cho bên ngoài dùng, `import` lấy về. Chúng **tĩnh**: browser đọc được danh sách phụ thuộc mà không cần chạy code, nhờ đó có thể tải song song và bundler có thể [[#Tree-shaking]]. Muốn nạp động lúc chạy thì dùng `import('./x.js')` — hàm này trả về Promise.

```js
export function add(a, b) { return a + b; }   // file math.js
import { add } from './math.js';              // file khác
```

> 💡 **Nhớ nhanh:** `import` phải viết ở đầu file và không nhét vào `if` được — vì browser cần đọc trước khi chạy.

### Bundler (Vite, webpack)

**Dịch thô:** bộ đóng gói · **Gặp ở:** [[03 - Script duoc tai luc nao - defer, async, module]] · [[11 - So sanh truc tiep - React vs Web Components]]

Công cụ đi theo chuỗi `import` từ file gốc, gom hàng trăm module thành vài file để browser tải ít request hơn, đồng thời lo luôn [[#Minify]], [[#Tree-shaking]], [[#Source map]], xử lý CSS và ảnh. Vite khi dev thì không bundle (dùng thẳng ESM cho nhanh) nhưng khi build production vẫn bundle bằng Rollup.

> 💡 **Nhớ nhanh:** bundler là người xếp 300 món đồ lẻ vào 3 thùng để chở một chuyến.

### Transpiler (Babel, SWC)

**Dịch thô:** bộ dịch cú pháp · **Gặp ở:** [[05 - React - JSX bien thanh gi]] · [[03 - Script duoc tai luc nao - defer, async, module]]

Dịch từ JS-này sang JS-khác: JSX → lời gọi hàm thường, cú pháp ES2023 → cú pháp browser cũ hiểu, TypeScript → JS (bỏ phần type). Khác **compiler** ở chỗ đầu ra vẫn là JavaScript chứ không phải mã máy. Babel viết bằng JS, SWC viết bằng Rust nên nhanh hơn nhiều lần — đó là lý do Next.js chuyển sang SWC.

> 💡 **Nhớ nhanh:** transpiler là phiên dịch tiếng Việt hiện đại sang tiếng Việt thời ông bà — vẫn tiếng Việt, chỉ đổi cách nói.

### Minify

**Dịch thô:** thu nhỏ · **Gặp ở:** [[03 - Script duoc tai luc nao - defer, async, module]]

Bỏ mọi thứ máy không cần: khoảng trắng, xuống dòng, comment, và đổi tên biến dài thành `a`, `b`, `c`. Hành vi code giữ nguyên, dung lượng thường giảm 30–60%. Đây là lý do mở file `.min.js` trên production thấy một dòng dài vô tận — và cũng là lý do bạn cần [[#Source map]] để debug.

> 💡 **Nhớ nhanh:** minify là hút chân không cái chăn — vẫn cái chăn đó, chỉ nhỏ lại để nhét vali.

### Tree-shaking

**Dịch thô:** rung cây rụng lá thừa · **Gặp ở:** [[03 - Script duoc tai luc nao - defer, async, module]] · [[11 - So sanh truc tiep - React vs Web Components]]

Bundler nhìn vào các `import`/`export` tĩnh, thấy hàm nào được import nhưng chẳng ai gọi thì cắt luôn khỏi file build. Chỉ hoạt động tốt với ES Module (vì `import` phân tích được không cần chạy) và với code **không có side effect**. Đây là lý do `import { debounce } from 'lodash-es'` nhẹ hơn hẳn `import _ from 'lodash'`.

> 💡 **Nhớ nhanh:** rung cây cho lá chết rụng — chỉ rung được nếu cây đứng yên (module tĩnh).

### Source map

**Dịch thô:** bản đồ mã nguồn · **Gặp ở:** [[03 - Script duoc tai luc nao - defer, async, module]]

File `.map` ghi lại "dòng 1 cột 4823 trong file đã minify tương ứng với dòng 12 của `Button.tsx`". Nhờ nó DevTools hiện code gốc, đặt breakpoint đúng chỗ, stack trace đọc được. Đừng công khai source map của production nếu không muốn ai cũng đọc được code gốc của bạn.

> 💡 **Nhớ nhanh:** source map là bản dịch ngược — không có nó, debug production như đọc mật mã.

### defer (attribute)

**Dịch thô:** hoãn lại · **Gặp ở:** [[03 - Script duoc tai luc nao - defer, async, module]]

Thuộc tính trên `<script src>`: browser tải file **song song** với việc parse HTML (không chặn parser), nhưng chỉ **chạy sau khi DOM dựng xong**, và các script `defer` chạy **đúng thứ tự khai báo**, ngay trước `DOMContentLoaded`. Đây là lựa chọn mặc định tốt nhất cho script phụ thuộc DOM và phụ thuộc lẫn nhau. Lưu ý `defer` không có tác dụng với script inline.

```html
<script defer src="a.js"></script><script defer src="b.js"></script> <!-- a chạy trước b -->
```

> 💡 **Nhớ nhanh:** `defer` = "cứ tải đi, nhưng đợi dọn nhà xong rồi hãy vào, và vào theo thứ tự".

### async (attribute)

**Dịch thô:** chạy độc lập · **Gặp ở:** [[03 - Script duoc tai luc nao - defer, async, module]]

Cũng tải song song không chặn parser, nhưng **tải xong lúc nào là chạy ngay lúc đó** — có thể cắt ngang việc parse HTML, và thứ tự chạy giữa nhiều script `async` là không đoán trước được (ai về trước chạy trước). Chỉ nên dùng cho script độc lập hoàn toàn: analytics, quảng cáo, tracking.

> 💡 **Nhớ nhanh:** `async` = "về tới là xông vào bếp luôn" — nhanh nhưng đừng giao việc cần thứ tự.

### DOMContentLoaded

**Dịch thô:** DOM đã dựng xong · **Gặp ở:** [[03 - Script duoc tai luc nao - defer, async, module]] · [[01 - Tu URL den Pixel - Vong doi mot trang web]]

Sự kiện bắn ra khi HTML đã parse xong và cây DOM đã đầy đủ — **không** đợi ảnh, CSS phụ hay iframe. Đây là lúc an toàn để `querySelector` mọi element. Mọi script `defer` và module đã chạy xong trước sự kiện này.

> 💡 **Nhớ nhanh:** DOMContentLoaded = "khung nhà đã dựng xong"; ảnh, font là nội thất chở tới sau.

### load

**Dịch thô:** tải xong hết · **Gặp ở:** [[01 - Tu URL den Pixel - Vong doi mot trang web]] · [[03 - Script duoc tai luc nao - defer, async, module]]

Sự kiện bắn ra khi **mọi tài nguyên** đã tải xong: ảnh, stylesheet, font, iframe. Luôn xảy ra sau `DOMContentLoaded`, đôi khi chậm hơn vài giây. Đừng dùng `window.onload` để khởi động app — người dùng sẽ ngồi nhìn trang chết trong lúc chờ một cái ảnh 2MB ở cuối trang.

> 💡 **Nhớ nhanh:** `load` = "nhà đã dọn xong, nội thất đã vào đủ" — thường là quá muộn để bắt đầu.

### Tagged template literal

**Dịch thô:** chuỗi mẫu có gắn hàm · **Gặp ở:** [[09 - Web Components - Truy vet mot custom element tu HTML den pixel]]

Cú pháp đặt tên hàm ngay trước dấu backtick. Hàm đó nhận **mảng các mẩu chuỗi tĩnh** làm tham số đầu, rồi các giá trị chèn vào làm tham số sau — tức nó thấy rõ đâu là phần cố định, đâu là phần thay đổi. Lit dựa hoàn toàn vào đây: mảng chuỗi tĩnh của mỗi vị trí trong code là **cùng một object** qua mọi lần gọi, nên Lit nhận ra "vẫn template cũ" và chỉ cập nhật đúng những chỗ giá trị đổi, không dựng lại DOM.

```js
html`<p>Chào ${name}</p>`   // hàm html nhận ['<p>Chào ', '</p>'] và [name]
```

> 💡 **Nhớ nhanh:** template thường trả về một chuỗi bẹp dí; tagged template giữ nguyên "khuôn và lỗ trống" để nhét lại sau.

### Strict mode

**Dịch thô:** chế độ nghiêm · **Gặp ở:** [[03 - Script duoc tai luc nao - defer, async, module]]

Chế độ bật bằng `'use strict'` (và tự động bật trong ES Module và class). Nó biến vài lỗi thầm lặng thành lỗi thật: gán vào biến chưa khai báo sẽ văng `ReferenceError` thay vì âm thầm tạo biến toàn cục; `this` trong hàm thường gọi trơ là `undefined` chứ không phải `window`. **Đừng nhầm với React StrictMode** — đó là một thứ hoàn toàn khác.

> 💡 **Nhớ nhanh:** JS strict mode là ngôn ngữ nghiêm khắc hơn; React StrictMode là component cảnh báo lúc dev. Trùng tên, không họ hàng.

### Event bubbling / capturing

**Dịch thô:** nổi bọt / bắt từ trên · **Gặp ở:** [[10 - Shadow DOM - Cay trong cay va ranh gioi that su]] · [[02 - DOM la gi - Cay, Node va API]]

Một sự kiện đi ba chặng. **Capture**: từ `window` chạy xuống dần tới element bị click. **Target**: tới đúng element đó. **Bubble**: nổi ngược từ element đó lên lại `window`. `addEventListener` mặc định nghe ở chặng bubble; muốn nghe chặng capture thì truyền `true` hoặc `{ capture: true }`. Vài sự kiện không bubble: `focus`, `blur`, `mouseenter`.

> 💡 **Nhớ nhanh:** thả viên đá xuống đáy hồ (capture) rồi bọt khí nổi lên mặt (bubble) — bạn thường đứng ở mặt hồ mà hứng.

### Event delegation

**Dịch thô:** uỷ quyền xử lý sự kiện · **Gặp ở:** [[02 - DOM la gi - Cay, Node va API]]

Thay vì gắn listener lên 500 hàng của bảng, gắn **một** listener lên thẻ cha rồi dựa vào `event.target` để biết ai vừa bị click. Nhờ bubbling nên mọi click ở con đều nổi lên cha. Lợi: ít listener hơn, và element thêm vào sau này vẫn hoạt động mà không cần gắn thêm gì.

```js
list.addEventListener('click', e => {
  const item = e.target.closest('li'); if (item) console.log(item.dataset.id);
});
```

> 💡 **Nhớ nhanh:** một bảo vệ đứng ở cổng thay vì mỗi phòng một bảo vệ.

### preventDefault() / stopPropagation()

**Dịch thô:** chặn hành vi mặc định / chặn lan truyền · **Gặp ở:** [[02 - DOM la gi - Cay, Node va API]] · [[10 - Shadow DOM - Cay trong cay va ranh gioi that su]]

Hai thứ hoàn toàn khác nhau nhưng hay bị dùng lẫn. `preventDefault()` bảo browser **đừng làm việc mặc định** của nó: đừng submit form, đừng đi theo link, đừng hiện menu chuột phải — nhưng event vẫn tiếp tục lan lên cha. `stopPropagation()` thì ngược lại: **cắt đường lan** của event nên cha không nghe được nữa, nhưng browser vẫn làm việc mặc định. Dùng `stopPropagation()` bừa bãi sẽ phá vỡ [[#Event delegation]] của người khác.

> 💡 **Nhớ nhanh:** `preventDefault` = "đừng làm gì cả"; `stopPropagation` = "đừng kể cho ai".

---

## Nguồn

- MDN — [The event loop](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Execution_model)
- HTML Spec — [Event loops](https://html.spec.whatwg.org/multipage/webappapis.html#event-loops)
- MDN — [Closures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures)
- MDN — [JavaScript modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
- web.dev — [Optimize long tasks](https://web.dev/articles/optimize-long-tasks)
