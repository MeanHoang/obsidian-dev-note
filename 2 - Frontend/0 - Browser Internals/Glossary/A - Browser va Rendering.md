# Glossary A — Browser & Rendering

> Tra nhanh thuật ngữ gặp trong note 01–04. Không cần học thuộc, gặp từ lạ thì nhảy vào đây.

Series: [[00 - Roadmap - Tu HTML den Pixel]] · Index: [[00 - Index]]

---

## Mục lục nhanh

| Thuật ngữ | Một câu |
|---|---|
| [[#Rendering engine (browser engine)]] | Phần lõi của browser lo việc biến HTML/CSS thành hình ảnh trên màn hình. |
| [[#HTML parser]] | Cỗ máy đọc chuỗi HTML và dựng ra cây DOM. |
| [[#Tokenizer]] | Bước cắt chuỗi HTML thành từng mẩu có nghĩa trước khi dựng cây. |
| [[#Incremental parsing]] | Vừa tải tới đâu vừa dựng tới đó, không đợi tải hết file. |
| [[#DOM (Document Object Model)]] | Cây object trong bộ nhớ đại diện cho trang, JS thao tác vào đây. |
| [[#CSSOM (CSS Object Model)]] | Cây object tương tự DOM nhưng cho toàn bộ luật CSS. |
| [[#Render tree]] | Cây chỉ chứa những gì thực sự được vẽ, kèm style đã tính xong. |
| [[#Layout (Reflow)]] | Tính toạ độ và kích thước thật (px) của từng box. |
| [[#Paint (Repaint)]] | Ghi ra danh sách lệnh vẽ: màu, chữ, viền, bóng. |
| [[#Raster (Rasterization)]] | Thực thi lệnh vẽ thành pixel thật trong bitmap. |
| [[#Layer (Compositing layer)]] | Một "tấm kính" riêng chứa một phần trang, di chuyển được độc lập. |
| [[#Compositing (Composite)]] | Xếp chồng các layer đúng thứ tự để ra khung hình cuối. |
| [[#GPU acceleration]] | Đẩy việc raster/compositing sang card đồ hoạ cho mượt. |
| [[#Critical Rendering Path (CRP)]] | Chuỗi bước tối thiểu từ byte HTML đến pixel đầu tiên. |
| [[#Render-blocking resource]] | Tài nguyên khiến browser không dám vẽ khung hình đầu tiên. |
| [[#Parser-blocking script]] | Script làm HTML parser đứng hình giữa chừng. |
| [[#Preload scanner]] | Con mắt phụ chạy trước, tìm ảnh/CSS/JS để tải sớm. |
| [[#Main thread]] | Luồng duy nhất vừa chạy JS vừa lo layout/paint — tắc là lag. |
| [[#FOUC (Flash of Unstyled Content)]] | Chớp một nhịp trang trần trụi chưa có CSS. |
| [[#FOIT / FOUT]] | Chữ biến mất hoặc nhảy font khi web font tải chậm. |
| [[#Forced synchronous layout (Layout thrashing)]] | Đọc–ghi DOM xen kẽ ép browser tính layout lại liên tục. |
| [[#Viewport]] | Khung nhìn — vùng màn hình đang thực sự thấy trang. |
| [[#Specificity (độ ưu tiên selector)]] | Điểm số quyết định selector nào thắng khi đụng nhau. |
| [[#Cascade (thác đổ)]] | Luật xếp hạng khi nhiều CSS cùng chỉ vào một thuộc tính. |
| [[#Inheritance (CSS)]] | Một số thuộc tính tự chảy từ cha xuống con. |
| [[#Box model]] | Mọi element là một hộp: content + padding + border + margin. |
| [[#Stacking context]] | "Cõi riêng" quyết định ai đè lên ai theo trục z. |
| [[#FCP / LCP / CLS / INP]] | Bốn chỉ số đo trang nhanh/ổn định/phản hồi tốt tới đâu. |
| [[#Reflow vs Repaint]] | Bảng đối chiếu hai việc hay bị lẫn lộn nhất. |

---

### Rendering engine (browser engine)

**Dịch thô:** bộ máy dựng hình · **Gặp ở:** [[01 - Tu URL den Pixel - Vong doi mot trang web]] · [[00 - Roadmap - Tu HTML den Pixel]]

Là phần lõi bên trong browser chịu trách nhiệm đọc HTML/CSS rồi vẽ ra màn hình. Chrome/Edge dùng **Blink**, Safari dùng **WebKit**, Firefox dùng **Gecko**. Nó khác với JS engine (V8, JavaScriptCore, SpiderMonkey) — JS engine chỉ lo chạy code JS, còn rendering engine lo phần hình ảnh. Hai thằng này nằm chung trong một browser và nói chuyện với nhau liên tục.

> 💡 **Nhớ nhanh:** rendering engine là "thợ xây", JS engine là "ông chủ hay đổi ý" đứng bên cạnh chỉ trỏ.

### HTML parser

**Dịch thô:** bộ phân tích HTML · **Gặp ở:** [[01 - Tu URL den Pixel - Vong doi mot trang web]] · [[02 - DOM la gi - Cay, Node va API]]

Là cỗ máy nhận vào chuỗi ký tự HTML và nhả ra cây DOM. Nó đọc từ trái sang phải, từ trên xuống dưới, gặp `<div>` thì tạo node div, gặp `</div>` thì đóng lại. Điểm đặc biệt của HTML parser là nó **cực kỳ khoan dung**: bạn quên đóng thẻ, viết sai lồng nhau, nó vẫn tự sửa và dựng ra một cây hợp lệ (khác hẳn XML hay JSON, sai một dấu là văng lỗi).

> 💡 **Nhớ nhanh:** HTML parser như bà bán hàng dễ tính — bạn nói lắp nó vẫn hiểu và vẫn bán.

### Tokenizer

**Dịch thô:** bộ cắt mẩu · **Gặp ở:** [[01 - Tu URL den Pixel - Vong doi mot trang web]]

Bước đầu tiên bên trong parser: cắt chuỗi ký tự thô thành các "mẩu có nghĩa" gọi là **token**. Ví dụ chuỗi `<p class="a">Hi</p>` bị cắt thành: token *start tag p (có attribute class="a")*, token *text "Hi"*, token *end tag p*. Sau khi có token rồi thì bước dựng cây mới bắt đầu ghép chúng thành node cha–con.

> 💡 **Nhớ nhanh:** tokenizer là bước "thái nguyên liệu", dựng cây mới là bước "nấu".

### Incremental parsing

**Dịch thô:** phân tích dần dần · **Gặp ở:** [[01 - Tu URL den Pixel - Vong doi mot trang web]] · [[03 - Script duoc tai luc nao - defer, async, module]]

Browser không đợi tải xong 100% file HTML rồi mới bắt đầu dựng DOM. Nó nhận được bao nhiêu byte thì parse ngay bấy nhiêu, dựng được phần nào của cây thì dựng, thậm chí vẽ tạm ra màn hình. Đó là lý do trên mạng chậm bạn thấy trang hiện dần từ trên xuống chứ không phải chờ trắng rồi bùm ra một phát.

> 💡 **Nhớ nhanh:** browser ăn HTML kiểu "vừa nhai vừa gắp", không đợi dọn hết mâm.

### DOM (Document Object Model)

**Dịch thô:** mô hình đối tượng tài liệu · **Gặp ở:** [[02 - DOM la gi - Cay, Node va API]] · [[01 - Tu URL den Pixel - Vong doi mot trang web]]

Là **cây object nằm trong bộ nhớ** mà browser dựng lên từ HTML, cộng thêm bộ API để JS đọc/sửa nó. Quan trọng: DOM **không phải** file HTML của bạn — HTML là văn bản chết, DOM là cấu trúc sống. Bạn `document.body.append(...)` là sửa DOM, file HTML trên server không đổi một byte nào.

```js
document.querySelector('h1').textContent = 'Xin chào'; // sửa DOM, không sửa file
```

> 💡 **Nhớ nhanh:** HTML là công thức nấu ăn, DOM là món ăn đã dọn ra bàn — bạn nêm nếm vào món, không nêm vào tờ giấy.

### CSSOM (CSS Object Model)

**Dịch thô:** mô hình đối tượng CSS · **Gặp ở:** [[01 - Tu URL den Pixel - Vong doi mot trang web]]

Giống DOM nhưng dành cho CSS: toàn bộ luật CSS (từ `<style>`, file `.css`, thuộc tính `style=`) được parse thành một cây object để browser tra cứu. Khác DOM ở một điểm sinh tử: **CSSOM phải hoàn chỉnh mới dùng được**. Một luật CSS ở cuối file có thể ghi đè luật ở đầu file, nên browser không dám vẽ khi CSSOM còn dở — đây chính là gốc rễ của chuyện CSS "render-blocking".

> 💡 **Nhớ nhanh:** DOM dựng dần cũng xài được, CSSOM thì phải đủ bộ mới dám phán.

### Render tree

**Dịch thô:** cây dựng hình · **Gặp ở:** [[01 - Tu URL den Pixel - Vong doi mot trang web]]

Browser ghép DOM + CSSOM lại thành một cây thứ ba: chỉ gồm những node **thực sự được vẽ ra**, mỗi node kèm sẵn style đã tính xong (computed style). Element có `display: none` bị loại khỏi cây này (không tồn tại để vẽ), nhưng `visibility: hidden` thì vẫn ở lại (vẫn chiếm chỗ, chỉ là vẽ trong suốt). Thẻ `<head>`, `<script>`, `<meta>` cũng không có mặt vì chẳng vẽ gì.

> 💡 **Nhớ nhanh:** render tree là "danh sách khách được vào tiệc" — `display: none` bị gạch tên, `visibility: hidden` vẫn có ghế nhưng ngồi tàng hình.

### Layout (Reflow)

**Dịch thô:** tính bố cục · **Gặp ở:** [[01 - Tu URL den Pixel - Vong doi mot trang web]] · [[07 - React - Truy vet mot lan setState tu click den pixel]]

Browser tính toạ độ x/y và kích thước thật của từng box trên trang. Đây là lúc `width: 50%` biến thành `640px`. Lần tính đầu tiên gọi là **layout**, những lần tính lại sau đó quen gọi là **reflow** — về bản chất là một việc. Đổi kích thước cửa sổ, thêm/xoá element, đổi `width`/`padding`/`font-size` đều buộc browser reflow.

> 💡 **Nhớ nhanh:** reflow = "sắp lại chỗ ngồi cả phòng", nên nó là bước đắt nhất trong chuỗi.

### Paint (Repaint)

**Dịch thô:** vẽ · **Gặp ở:** [[01 - Tu URL den Pixel - Vong doi mot trang web]]

Sau khi biết mỗi box nằm ở đâu, to bao nhiêu, browser sinh ra một **danh sách lệnh vẽ**: "tô hình chữ nhật này màu đỏ", "viết chữ này ở đây", "vẽ border 1px". Đổi `color`, `background-color`, `box-shadow`, `border-radius` chỉ cần paint lại chứ không cần tính lại vị trí — nên rẻ hơn reflow, nhưng vẫn tốn.

> 💡 **Nhớ nhanh:** paint = "sơn lại tường", chỗ ngồi vẫn nguyên.

### Raster (Rasterization)

**Dịch thô:** biến thành pixel · **Gặp ở:** [[01 - Tu URL den Pixel - Vong doi mot trang web]]

Bước thực thi danh sách lệnh vẽ thành **pixel thật** trong một vùng bộ nhớ (bitmap). Paint chỉ là bản kế hoạch dạng lệnh; raster mới là lúc từng ô màu được điền vào. Chrome thường raster theo từng ô nhỏ (tile) và ưu tiên raster phần đang nằm trong tầm nhìn trước.

> 💡 **Nhớ nhanh:** paint viết kịch bản, raster mới là diễn viên bước ra sân khấu.

### Layer (Compositing layer)

**Dịch thô:** lớp · **Gặp ở:** [[01 - Tu URL den Pixel - Vong doi mot trang web]]

Browser có thể tách một phần trang ra thành một "tấm kính" riêng có bitmap riêng. Nhờ vậy khi tấm kính đó di chuyển/mờ đi, browser chỉ cần dịch chuyển tấm kính chứ không phải vẽ lại nội dung bên trong. Những thứ hay tạo layer riêng: `transform`, `opacity` đang animate, `position: fixed`, `will-change: transform`, video, canvas.

> 💡 **Nhớ nhanh:** layer như tấm mica trong phim hoạt hình vẽ tay — trượt tấm mica, không vẽ lại nhân vật.

### Compositing (Composite)

**Dịch thô:** ghép lớp · **Gặp ở:** [[01 - Tu URL den Pixel - Vong doi mot trang web]]

Bước cuối: xếp chồng tất cả layer đúng thứ tự trước–sau, áp `transform`/`opacity` của từng layer, rồi đẩy ra màn hình. Bước này chạy trên một luồng riêng (compositor thread) và thường do GPU làm, nên **animation chỉ đụng `transform` và `opacity` vẫn mượt kể cả khi main thread đang bận**.

```css
/* mượt: chỉ composite */      .a { transform: translateX(100px); }
/* tốn: reflow + paint + ... */ .b { left: 100px; }
```

> 💡 **Nhớ nhanh:** composite là lúc "dán các tấm mica lên nhau rồi chụp một phát".

### GPU acceleration

**Dịch thô:** tăng tốc bằng card đồ hoạ · **Gặp ở:** [[01 - Tu URL den Pixel - Vong doi mot trang web]]

Giao phần raster và compositing cho GPU thay vì CPU. GPU giỏi làm hàng triệu phép tính giống nhau song song nên xử lý pixel cực nhanh. Đây là lý do animate bằng `transform: translate3d(...)` thường mượt hơn animate `top/left`. Nhưng đừng lạm dụng `will-change`: mỗi layer tốn VRAM, tạo bừa hàng trăm layer thì máy yếu sẽ tệ đi chứ không tốt lên.

> 💡 **Nhớ nhanh:** GPU là đội quân 1000 thợ sơn cùng quét một lượt; CPU là một ông thợ giỏi nhưng làm tuần tự.

### Critical Rendering Path (CRP)

**Dịch thô:** đường tới hạn để dựng hình · **Gặp ở:** [[01 - Tu URL den Pixel - Vong doi mot trang web]] · [[03 - Script duoc tai luc nao - defer, async, module]]

Chuỗi bước tối thiểu browser buộc phải làm xong để vẽ được **khung hình đầu tiên**: tải HTML → dựng DOM → tải + dựng CSSOM → render tree → layout → paint. Tối ưu CRP nghĩa là rút ngắn chuỗi này: giảm CSS chặn, hoãn JS không cần thiết, inline CSS tối thiểu cho phần trên màn hình.

> 💡 **Nhớ nhanh:** CRP là "quãng đường tới miếng ăn đầu tiên" — mọi thứ nằm trên đường đó đều làm khách đói lâu hơn.

### Render-blocking resource

**Dịch thô:** tài nguyên chặn dựng hình · **Gặp ở:** [[03 - Script duoc tai luc nao - defer, async, module]] · [[01 - Tu URL den Pixel - Vong doi mot trang web]]

Tài nguyên mà browser bắt buộc phải tải và xử lý xong trước khi dám vẽ khung hình đầu tiên. Điển hình nhất là `<link rel="stylesheet">`: nếu vẽ trước khi có CSS thì người dùng sẽ thấy trang trần trụi rồi giật một phát (xem [[#FOUC (Flash of Unstyled Content)]]), nên browser thà chờ. Cách giảm: tách CSS theo `media`, inline phần CSS tối thiểu, bỏ CSS không dùng.

```html
<!-- không chặn render lúc đầu vì chỉ dùng khi in -->
<link rel="stylesheet" href="print.css" media="print">
```

> 💡 **Nhớ nhanh:** render-blocking = "chưa mặc quần áo thì chưa mở cửa cho khách xem".

### Parser-blocking script

**Dịch thô:** script chặn phân tích HTML · **Gặp ở:** [[03 - Script duoc tai luc nao - defer, async, module]]

Một thẻ `<script>` thường (không `defer`, không `async`, không `type="module"`) khiến HTML parser **dừng hẳn** tại đúng vị trí đó: đi tải file JS về, chạy xong, rồi mới parse tiếp phần HTML còn lại. Lý do là script cũ có thể gọi `document.write()` chèn thẳng HTML vào giữa dòng, nên browser không dám parse trước. Đây là lý do lời khuyên kinh điển "để `<script>` cuối `<body>`" tồn tại.

> 💡 **Nhớ nhanh:** script thường như người chen ngang giữa hàng, cả hàng đứng chờ nó xong việc.

### Preload scanner

**Dịch thô:** bộ quét tải trước · **Gặp ở:** [[03 - Script duoc tai luc nao - defer, async, module]] · [[01 - Tu URL den Pixel - Vong doi mot trang web]]

Trong lúc parser chính đang bị một script chặn đứng, browser cho một "con mắt phụ" chạy lướt tiếp phần HTML còn lại để tìm các URL (`<img>`, `<link>`, `<script>`) và bắt đầu tải chúng sớm. Nó chỉ tải chứ không dựng DOM. Vì vậy ảnh chèn bằng JS hoặc CSS `background-image` sẽ **không** được preload scanner nhìn thấy — muốn sớm thì phải khai báo `<link rel="preload">`.

> 💡 **Nhớ nhanh:** preload scanner là thằng em chạy đi mua đồ trước trong lúc anh cả còn kẹt ở cửa.

### Main thread

**Dịch thô:** luồng chính · **Gặp ở:** [[04 - Event Loop - Task, Microtask va luc browser ve]] · [[07 - React - Truy vet mot lan setState tu click den pixel]]

Một luồng duy nhất trong browser gánh gần như mọi việc: parse HTML/CSS, chạy JS, tính layout, paint, xử lý event. Vì chỉ có một, nếu JS của bạn chạy một vòng lặp 500ms thì trong 500ms đó **không có gì khác xảy ra** — click không phản hồi, animation đứng, trang treo cứng.

> 💡 **Nhớ nhanh:** main thread là một cái bếp một đầu bếp — ông ấy đang thái hành thì không ai chiên trứng hộ.

### FOUC (Flash of Unstyled Content)

**Dịch thô:** chớp nội dung chưa có style · **Gặp ở:** [[01 - Tu URL den Pixel - Vong doi mot trang web]] · [[09 - Web Components - Truy vet mot custom element tu HTML den pixel]]

Hiện tượng người dùng thấy trang trong trạng thái "trần" (font Times New Roman, chữ đen nền trắng, layout vỡ) trong một khoảnh khắc rồi CSS mới nhảy vào và mọi thứ giật một phát về đúng chỗ. Xảy ra khi browser vẽ trước lúc CSS sẵn sàng — hay gặp khi CSS được nạp bằng JS, hoặc với custom element chưa kịp `define` nên browser chưa biết nó trông thế nào.

> 💡 **Nhớ nhanh:** FOUC là khoảnh khắc trang web "bị bắt gặp lúc chưa kịp mặc đồ".

### FOIT / FOUT

**Dịch thô:** chớp chữ vô hình / chớp chữ sai font · **Gặp ở:** [[01 - Tu URL den Pixel - Vong doi mot trang web]]

Hai kiểu khó chịu khi web font tải chậm. **FOIT** (Flash of Invisible Text): browser giấu luôn chữ, để chỗ trống, đợi font về mới hiện — người dùng thấy khoảng trắng. **FOUT** (Flash of Unstyled Text): browser hiện chữ bằng font dự phòng của hệ thống trước, font thật về thì đổi — chữ nhảy một phát. Thuộc tính `font-display` quyết định browser chọn kiểu nào.

```css
@font-face { font-family: 'Inter'; src: url(...); font-display: swap; } /* chọn FOUT */
```

> 💡 **Nhớ nhanh:** FOIT = "im lặng chờ đủ đồ", FOUT = "cứ nói trước rồi sửa giọng sau".

### Forced synchronous layout (Layout thrashing)

**Dịch thô:** ép tính bố cục ngay lập tức · **Gặp ở:** [[04 - Event Loop - Task, Microtask va luc browser ve]] · [[07 - React - Truy vet mot lan setState tu click den pixel]]

Bình thường browser gom các thay đổi DOM lại rồi tính layout một lần cho tiết kiệm. Nhưng nếu JS **ghi** DOM rồi ngay sau đó **đọc** một giá trị phụ thuộc layout (`offsetHeight`, `getBoundingClientRect()`, `scrollTop`), browser buộc phải tính layout ngay tại chỗ để trả về số đúng. Lặp việc này trong vòng `for` thì mỗi vòng là một lần reflow — trang lag thấy rõ. Cách chữa: đọc hết một lượt trước, rồi ghi hết một lượt sau.

```js
// XẤU: mỗi vòng lặp ép 1 reflow
for (const el of els) el.style.width = el.offsetWidth + 10 + 'px';
// TỐT: đọc gom trước, ghi gom sau
const ws = els.map(el => el.offsetWidth);
els.forEach((el, i) => el.style.width = ws[i] + 10 + 'px');
```

> 💡 **Nhớ nhanh:** cứ hỏi "trang giờ trông thế nào?" ngay sau khi vừa sửa là bắt browser làm lại sổ sách gấp.

### Viewport

**Dịch thô:** khung nhìn · **Gặp ở:** [[01 - Tu URL den Pixel - Vong doi mot trang web]]

Vùng chữ nhật của cửa sổ browser đang thực sự hiển thị nội dung trang (không tính thanh địa chỉ, tab). Đơn vị `vw`/`vh` đo theo nó, media query `max-width` so với nó, và browser ưu tiên raster phần nằm trong nó trước. Trên mobile, thẻ `<meta name="viewport" content="width=device-width, initial-scale=1">` là thứ bảo browser "đừng giả vờ màn hình rộng 980px nữa".

> 💡 **Nhớ nhanh:** viewport là "ô cửa sổ", trang web là "phong cảnh" — cửa sổ nhỏ không làm phong cảnh nhỏ đi.

### Specificity (độ ưu tiên selector)

**Dịch thô:** độ đặc hiệu · **Gặp ở:** [[08 - React - CSS va chuyen khong co encapsulation]]

Khi hai luật CSS cùng chỉ vào một element và cùng đặt `color`, browser chấm điểm selector để chọn bên thắng. Thang điểm gồm ba bậc: số lượng **id** > số lượng **class/attribute/pseudo-class** > số lượng **tên thẻ**. Ví dụ `#nav a` (1-0-1) thắng `.menu .item a` (0-2-1) dù bên kia trông dài hơn. Inline `style=` còn cao hơn nữa, và `!important` phá luật riêng một cõi.

> 💡 **Nhớ nhanh:** specificity so theo bậc như so vàng–bạc–đồng: một huy chương vàng thắng mọi số lượng huy chương bạc.

### Cascade (thác đổ)

**Dịch thô:** dòng thác · **Gặp ở:** [[08 - React - CSS va chuyen khong co encapsulation]]

Chữ "C" trong CSS. Là bộ luật xếp hạng khi nhiều nguồn CSS cùng nói về một thuộc tính. Thứ tự xét: origin và `!important` trước → rồi tới [[#Specificity (độ ưu tiên selector)]] → cuối cùng nếu vẫn hoà thì **luật viết sau thắng**. Đây là lý do đổi thứ tự import file CSS có thể làm giao diện đổi mà bạn chẳng sửa dòng CSS nào.

> 💡 **Nhớ nhanh:** cascade là "ai vào sau ngồi trên" — trừ khi người vào trước có chức vụ cao hơn.

### Inheritance (CSS)

**Dịch thô:** kế thừa · **Gặp ở:** [[10 - Shadow DOM - Cay trong cay va ranh gioi that su]]

Một số thuộc tính CSS tự động chảy từ element cha xuống con nếu con không tự đặt: `color`, `font-family`, `font-size`, `line-height`, `visibility`. Ngược lại `border`, `padding`, `background`, `width` **không** kế thừa. Điểm này rất quan trọng với Shadow DOM: bức tường style chặn selector từ ngoài, nhưng **không chặn thuộc tính kế thừa** — đặt `font-family` ở `body` thì chữ bên trong shadow vẫn đổi theo.

> 💡 **Nhớ nhanh:** kế thừa như gen di truyền: màu mắt truyền xuống, còn cái nhà thì không.

### Box model

**Dịch thô:** mô hình hộp · **Gặp ở:** [[01 - Tu URL den Pixel - Vong doi mot trang web]]

Mọi element khi layout đều là một hình chữ nhật gồm 4 vòng từ trong ra: **content** (nội dung) → **padding** (đệm trong) → **border** (viền) → **margin** (khoảng cách ngoài). Mặc định `width` chỉ tính phần content, nên thêm padding là hộp phình ra — đó là lý do gần như mọi dự án đều đặt `box-sizing: border-box` để `width` tính luôn cả padding và border.

```css
*, *::before, *::after { box-sizing: border-box; }
```

> 💡 **Nhớ nhanh:** hộp quà: món đồ (content), xốp chống sốc (padding), vỏ hộp (border), khoảng cách với hộp bên cạnh (margin).

### Stacking context

**Dịch thô:** ngữ cảnh xếp chồng · **Gặp ở:** [[01 - Tu URL den Pixel - Vong doi mot trang web]] · [[08 - React - CSS va chuyen khong co encapsulation]]

Một "cõi riêng" về trục z: các element bên trong nó chỉ tranh nhau thứ tự đè trong phạm vi cõi đó, và cả cõi được xếp như một khối duy nhất so với bên ngoài. Nhiều thứ tạo stacking context ngoài `position` + `z-index`: `opacity` khác 1, `transform`, `filter`, `will-change`, `isolation: isolate`. Đây là lý do kinh điển khiến `z-index: 9999` vẫn bị đè — modal của bạn nằm trong một cõi mà cả cõi đó đã bị xếp dưới rồi.

> 💡 **Nhớ nhanh:** `z-index` chỉ so trong nhà mình; nhà mình xếp sau nhà hàng xóm thì bạn có leo nóc cũng vẫn thấp hơn.

### FCP / LCP / CLS / INP

**Dịch thô:** các chỉ số trải nghiệm · **Gặp ở:** [[01 - Tu URL den Pixel - Vong doi mot trang web]] · [[11 - So sanh truc tiep - React vs Web Components]]

Bốn con số Google dùng để chấm điểm trang. **FCP** (First Contentful Paint): giây phút pixel có nội dung đầu tiên xuất hiện. **LCP** (Largest Contentful Paint): lúc khối nội dung lớn nhất trong viewport vẽ xong — đại diện cho "người dùng cảm thấy trang đã tải xong"; tốt là ≤ 2.5s. **CLS** (Cumulative Layout Shift): đo tổng mức nội dung nhảy chỗ bất ngờ; tốt là ≤ 0.1. **INP** (Interaction to Next Paint): đo từ lúc bấm đến lúc màn hình đổi để phản hồi; tốt là ≤ 200ms. LCP, CLS, INP là bộ ba Core Web Vitals hiện tại (INP đã thay FID từ 2024).

> 💡 **Nhớ nhanh:** FCP "thấy gì chưa", LCP "thấy đủ chưa", CLS "có bị giật không", INP "bấm có ăn không".

### Reflow vs Repaint

**Dịch thô:** tính lại bố cục và vẽ lại · **Gặp ở:** [[01 - Tu URL den Pixel - Vong doi mot trang web]] · [[07 - React - Truy vet mot lan setState tu click den pixel]]

Hai việc hay bị gọi lẫn. Reflow là tính lại *chỗ*, repaint là tô lại *màu*. Reflow luôn kéo theo repaint, nhưng repaint không kéo theo reflow. Rẻ nhất là loại thứ ba: chỉ composite.

| | Reflow (Layout) | Repaint (Paint) | Composite |
|---|---|---|---|
| Làm gì | Tính lại vị trí + kích thước | Tô lại màu/chữ/viền | Xếp lại các layer |
| Chi phí | Đắt nhất | Trung bình | Rẻ nhất |
| Ai làm | Main thread | Main thread | Compositor / GPU |
| Kéo theo | Repaint + composite | Composite | — |
| Ví dụ trigger | `width`, `padding`, `font-size`, thêm/xoá node, đọc `offsetHeight` | `color`, `background-color`, `box-shadow`, `visibility` | `transform`, `opacity` |

> 💡 **Nhớ nhanh:** đổi chỗ ngồi (reflow) > sơn lại tường (repaint) > trượt tấm mica (composite). Animation thì cố gắng chỉ trượt mica.

---

## Nguồn

- MDN — [Critical rendering path](https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/Critical_rendering_path)
- MDN — [Introduction to the DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction)
- web.dev — [Core Web Vitals](https://web.dev/articles/vitals)
- web.dev — [Avoid large, complex layouts and layout thrashing](https://web.dev/articles/avoid-large-complex-layouts-and-layout-thrashing)
- Chrome Developers — [Inside look at modern web browser](https://developer.chrome.com/blog/inside-browser-part3)
