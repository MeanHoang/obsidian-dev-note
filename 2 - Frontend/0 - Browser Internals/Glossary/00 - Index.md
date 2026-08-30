# Glossary — Index

> Từ điển thuật ngữ cho series [[00 - Roadmap - Tu HTML den Pixel]]. **Không phải để học thuộc.** Đang đọc note mà gặp từ lạ thì `Ctrl+F` trong bảng dưới, đọc 3 câu rồi quay lại đọc tiếp.
>
> Mỗi mục từ có: tên tiếng Anh chuẩn (thứ dev hay nói) → dịch thô → giải thích đời thường → một câu **Nhớ nhanh** để ghim vào đầu.

Series: [[00 - Roadmap - Tu HTML den Pixel]]

---

## 📂 Bốn nhóm

| File | Chứa gì | Đọc kèm note |
| --- | --- | --- |
| [[A - Browser va Rendering\|A — Browser & Rendering]] | Cách browser biến text thành pixel: parser, DOM, CSSOM, render tree, layout, paint, composite, reflow, FOUC… | 01–04 |
| [[B - JS Runtime va Event Loop\|B — JS Runtime & Event Loop]] | JS chạy thế nào: call stack, task, microtask, event loop, `defer`/`async`, module, closure, bundler… | 03–04 |
| [[C - React\|C — React]] | Bộ máy React: JSX, React element, VDOM, reconciliation, Fiber, render/commit phase, hook, hydration… | 05–08 |
| [[D - Web Components va DOM nang cao\|D — Web Components & DOM nâng cao]] | Chuẩn của browser: custom element, upgrade, shadow root, light DOM, flattened tree, slot, retargeting… | 09–11 |

**Tổng: 155 mục từ** (A 29 · B 38 · C 39 · D 49)

---

## 🔥 20 từ nếu chỉ nhớ được 20

Học đúng 20 từ này là đọc được 80% tài liệu frontend tiếng Anh:

| # | Thuật ngữ | Một câu |
| --- | --- | --- |
| 1 | [[A - Browser va Rendering#DOM (Document Object Model)\|DOM]] | Cây object sống trong RAM — **không phải** file HTML trên đĩa. |
| 2 | [[A - Browser va Rendering#Layout (Reflow)\|Layout / Reflow]] | Lúc `width: 50%` biến thành `640px`. Đắt. |
| 3 | [[A - Browser va Rendering#Paint (Repaint)\|Paint]] | Lúc box biến thành pixel màu. |
| 4 | [[A - Browser va Rendering#Main thread\|Main thread]] | Một luồng duy nhất lo cả JS lẫn vẽ. Chiếm nó = trang đơ. |
| 5 | [[A - Browser va Rendering#Render-blocking resource\|Render-blocking]] | Thứ browser bắt buộc phải chờ xong mới dám vẽ. |
| 6 | [[B - JS Runtime va Event Loop#Event loop\|Event loop]] | Vòng lặp: chạy 1 task → vét microtask → mới có cơ hội vẽ. |
| 7 | [[B - JS Runtime va Event Loop#Microtask\|Microtask]] | Việc chen ngang ngay sau task hiện tại (`Promise.then`). |
| 8 | [[B - JS Runtime va Event Loop#Closure\|Closure]] | Hàm nhớ biến lúc nó được sinh ra — gốc của bug `setState`. |
| 9 | [[B - JS Runtime va Event Loop#defer (attribute)\|defer]] | Tải song song, chạy sau khi DOM xong, giữ đúng thứ tự. |
| 10 | [[B - JS Runtime va Event Loop#Batching (gom lô)\|Batching]] | Gom nhiều lần đổi state thành một lần vẽ. |
| 11 | [[C - React#JSX\|JSX]] | Cú pháp giống HTML, browser **không hiểu**, phải dịch. |
| 12 | [[C - React#React element\|React element]] | Object mô tả UI — bản vẽ, không phải ngôi nhà. |
| 13 | [[C - React#Virtual DOM (VDOM)\|Virtual DOM]] | Cây object trong memory để đem đi so sánh. Không "nhanh hơn DOM". |
| 14 | [[C - React#Reconciliation\|Reconciliation]] | Đối chiếu cây mới với cây cũ để biết sửa chỗ nào. |
| 15 | [[C - React#Render phase\|Render vs Commit phase]] | Tính toán (ngắt được) ↔ áp vào DOM thật (không ngắt được). |
| 16 | [[D - Web Components va DOM nang cao#Custom Element\|Custom Element]] | Dạy browser một thẻ HTML mới. Tên **bắt buộc có gạch ngang**. |
| 17 | [[D - Web Components va DOM nang cao#Element upgrade\|Element upgrade]] | Element sinh ra trước, "nhập hồn" sau khi `define()` chạy. |
| 18 | [[D - Web Components va DOM nang cao#Shadow DOM\|Shadow DOM]] | Cây con riêng, có rào chắn CSS **thật** do browser thực thi. |
| 19 | [[D - Web Components va DOM nang cao#Attribute vs Property\|Attribute vs Property]] | HTML luôn là string; property là giá trị JS thật. |
| 20 | [[D - Web Components va DOM nang cao#composed\|composed]] | Thiếu nó thì `CustomEvent` kẹt trong shadow root. Bug kinh điển. |

---

## 🔤 Tra A → Z (155 mục)

> Cột cuối cho biết từ đó nằm ở file nào.

| Thuật ngữ | Một câu | File |
| --- | --- | --- |
| [[D - Web Components va DOM nang cao#::part()\|::part()]] | Cửa sổ bạn cố tình mở ra để bên ngoài style một phần bên trong. | D |
| [[D - Web Components va DOM nang cao#::slotted()\|::slotted()]] | Selector style nội dung được nhét vào slot, chỉ chạm được con trực tiếp. | D |
| [[D - Web Components va DOM nang cao#:defined\|:defined]] | Selector chọn element đã được đăng ký, dùng để giấu lúc chưa sẵn sàng. | D |
| [[D - Web Components va DOM nang cao#:host / :host()\|:host / :host()]] | Selector trong shadow DOM trỏ ngược ra chính element chủ. | D |
| [[D - Web Components va DOM nang cao#adoptedCallback()\|adoptedCallback()]] | Chạy khi element bị chuyển sang một document khác. | D |
| [[D - Web Components va DOM nang cao#adoptedStyleSheets / Constructable Stylesheet\|adoptedStyleSheets / Constructable Stylesheet]] | Một object stylesheet dùng chung cho nghìn instance, khỏi lặp CSS. | D |
| [[D - Web Components va DOM nang cao#assignedElements()\|assignedElements()]] | Hàm hỏi xem hiện có element nào đang nằm trong slot này. | D |
| [[B - JS Runtime va Event Loop#async (attribute)\|async (attribute)]] | Tải song song, tải xong là chạy ngay, không đảm bảo thứ tự. | B |
| [[B - JS Runtime va Event Loop#async / await\|async / await]] | Cú pháp viết code bất đồng bộ trông như đồng bộ. | B |
| [[D - Web Components va DOM nang cao#Attribute vs Property\|Attribute vs Property]] | Chữ trong HTML và ô nhớ trong JS — hai thứ khác nhau, hay bị nhầm. | D |
| [[D - Web Components va DOM nang cao#attributeChangedCallback()\|attributeChangedCallback()]] | Chạy khi một attribute được theo dõi thay đổi giá trị. | D |
| [[C - React#Automatic batching\|Automatic batching]] | Gom nhiều setState trong cùng lượt thành một lần render. | C |
| [[C - React#Automatic JSX runtime (_jsx)\|Automatic JSX runtime (_jsx)]] | Cách dịch JSX mới, không cần import React nữa. | C |
| [[D - Web Components va DOM nang cao#Autonomous vs Customized built-in element\|Autonomous vs Customized built-in element]] | Tự đẻ thẻ mới hay đi mượn thẻ có sẵn rồi mở rộng. | D |
| [[B - JS Runtime va Event Loop#Batching (gom lô)\|Batching (gom lô)]] | Gom nhiều thay đổi lại xử lý một lần cho rẻ. | B |
| [[B - JS Runtime va Event Loop#Blocking\|Blocking]] | Chiếm luồng chính khiến mọi thứ khác đứng chờ. | B |
| [[A - Browser va Rendering#Box model\|Box model]] | Mọi element là một hộp: content + padding + border + margin. | A |
| [[C - React#Bundle size\|Bundle size]] | Tổng dung lượng JS người dùng phải tải và chạy. | C |
| [[B - JS Runtime va Event Loop#Bundler (Vite, webpack)\|Bundler (Vite, webpack)]] | Gom hàng trăm file module thành vài file để tải nhanh. | B |
| [[B - JS Runtime va Event Loop#Call stack\|Call stack]] | Chồng đĩa ghi nhớ hàm nào đang gọi hàm nào. | B |
| [[B - JS Runtime va Event Loop#Callback\|Callback]] | Hàm đưa cho người khác giữ để gọi lại sau. | B |
| [[A - Browser va Rendering#Cascade (thác đổ)\|Cascade (thác đổ)]] | Luật xếp hạng khi nhiều CSS cùng chỉ vào một thuộc tính. | A |
| [[D - Web Components va DOM nang cao#cloneNode()\|cloneNode()]] | Nhân bản một node, `true` để chép luôn cả cây con. | D |
| [[B - JS Runtime va Event Loop#Closure\|Closure]] | Hàm nhớ luôn "hộp biến" nơi nó được sinh ra. | B |
| [[C - React#Commit phase\|Commit phase]] | Giai đoạn áp thay đổi vào DOM thật. | C |
| [[C - React#Component\|Component]] | Hàm nhận props và trả về mô tả UI. | C |
| [[D - Web Components va DOM nang cao#composed\|composed]] | Cờ quyết định event có được phép vượt shadow boundary hay không. | D |
| [[D - Web Components va DOM nang cao#composedPath()\|composedPath()]] | Hàm cho xem đường đi thật của event, kể cả đoạn trong shadow. | D |
| [[A - Browser va Rendering#Compositing (Composite)\|Compositing (Composite)]] | Xếp chồng các layer đúng thứ tự để ra khung hình cuối. | A |
| [[C - React#Concurrent rendering\|Concurrent rendering]] | Render có thể bị ngắt, hoãn, bỏ dở để ưu tiên việc gấp. | C |
| [[D - Web Components va DOM nang cao#connectedCallback()\|connectedCallback()]] | Chạy mỗi lần element được gắn vào document — chỗ làm việc chính. | D |
| [[D - Web Components va DOM nang cao#constructor()\|constructor()]] | Chạy lúc element vừa được tạo, cấm đụng attribute và children. | D |
| [[C - React#Context\|Context]] | Đường ống truyền dữ liệu bỏ qua các tầng trung gian. | C |
| [[C - React#Controlled vs Uncontrolled component\|Controlled vs Uncontrolled component]] | Ai giữ giá trị của input: React hay bản thân DOM. | C |
| [[A - Browser va Rendering#Critical Rendering Path (CRP)\|Critical Rendering Path (CRP)]] | Chuỗi bước tối thiểu từ byte HTML đến pixel đầu tiên. | A |
| [[C - React#CSR / SSR / SSG\|CSR / SSR / SSG]] | Ba nơi HTML được sinh ra: trình duyệt, server lúc request, lúc build. | C |
| [[D - Web Components va DOM nang cao#CSS custom property (biến CSS)\|CSS custom property (biến CSS)]] | Biến CSS xuyên được shadow boundary, cách chỉnh theme phổ biến nhất. | D |
| [[C - React#CSS Modules\|CSS Modules]] | Tự đổi tên class thành duy nhất lúc build để khỏi đụng nhau. | C |
| [[C - React#CSS-in-JS\|CSS-in-JS]] | Viết CSS bằng JS, sinh class và chèn style lúc chạy. | C |
| [[A - Browser va Rendering#CSSOM (CSS Object Model)\|CSSOM (CSS Object Model)]] | Cây object tương tự DOM nhưng cho toàn bộ luật CSS. | A |
| [[D - Web Components va DOM nang cao#Custom Element\|Custom Element]] | Thẻ HTML do bạn tự đặt tên và tự viết hành vi. | D |
| [[D - Web Components va DOM nang cao#CustomElementRegistry\|CustomElementRegistry]] | Cuốn sổ hộ tịch của document, ghi tên thẻ nào ứng với class nào. | D |
| [[D - Web Components va DOM nang cao#customElements.define()\|customElements.define()]] | Lệnh đăng ký tên thẻ với class, tên bắt buộc có dấu gạch ngang. | D |
| [[D - Web Components va DOM nang cao#CustomEvent\|CustomEvent]] | Event tự chế để component báo tin ra ngoài, thay cho callback prop. | D |
| [[D - Web Components va DOM nang cao#CustomStateSet / :state()\|CustomStateSet / :state()]] | Cách khai báo trạng thái nội bộ để CSS ngoài chọn được. | D |
| [[D - Web Components va DOM nang cao#Declarative Shadow DOM (DSD)\|Declarative Shadow DOM (DSD)]] | Viết shadow DOM thẳng trong HTML, không cần JS — chìa khoá cho SSR. | D |
| [[B - JS Runtime va Event Loop#defer (attribute)\|defer (attribute)]] | Tải song song, chạy sau khi HTML parse xong, đúng thứ tự. | B |
| [[C - React#Diffing\|Diffing]] | Thuật toán so sánh cụ thể bên trong reconciliation. | C |
| [[D - Web Components va DOM nang cao#disconnectedCallback()\|disconnectedCallback()]] | Chạy khi element bị gỡ khỏi cây, chỗ dọn dẹp listener và timer. | D |
| [[D - Web Components va DOM nang cao#DocumentFragment\|DocumentFragment]] | Túi đựng node tạm, chèn vào DOM thì đổ hết con ra rồi tự biến mất. | D |
| [[A - Browser va Rendering#DOM (Document Object Model)\|DOM (Document Object Model)]] | Cây object trong bộ nhớ đại diện cho trang, JS thao tác vào đây. | A |
| [[B - JS Runtime va Event Loop#DOMContentLoaded\|DOMContentLoaded]] | Sự kiện báo "cây DOM đã dựng xong". | B |
| [[D - Web Components va DOM nang cao#Element upgrade\|Element upgrade]] | Node đã có sẵn trong DOM được "nhập hồn" khi class được đăng ký. | D |
| [[D - Web Components va DOM nang cao#ElementInternals\|ElementInternals]] | Cửa hậu cho custom element chạm vào phần nội bộ của platform. | D |
| [[B - JS Runtime va Event Loop#ES Module (ESM)\|ES Module (ESM)]] | Hệ module chuẩn của JS, browser hiểu trực tiếp. | B |
| [[B - JS Runtime va Event Loop#Event bubbling / capturing\|Event bubbling / capturing]] | Sự kiện đi từ ngoài vào rồi từ trong ra. | B |
| [[B - JS Runtime va Event Loop#Event delegation\|Event delegation]] | Gắn một listener ở cha thay vì trăm listener ở con. | B |
| [[B - JS Runtime va Event Loop#Event loop\|Event loop]] | Vòng lặp điều phối: hết việc thì lấy việc mới ra chạy. | B |
| [[D - Web Components va DOM nang cao#Event retargeting\|Event retargeting]] | Browser đổi `event.target` thành host để giấu chi tiết bên trong. | D |
| [[A - Browser va Rendering#FCP / LCP / CLS / INP\|FCP / LCP / CLS / INP]] | Bốn chỉ số đo trang nhanh/ổn định/phản hồi tốt tới đâu. | A |
| [[C - React#Fiber\|Fiber]] | Kiến trúc và đơn vị công việc cho phép React tạm dừng giữa chừng. | C |
| [[D - Web Components va DOM nang cao#Flattened tree\|Flattened tree]] | Cây "sau khi ráp", thứ browser thật sự đem đi style và vẽ. | D |
| [[A - Browser va Rendering#FOIT / FOUT\|FOIT / FOUT]] | Chữ biến mất hoặc nhảy font khi web font tải chậm. | A |
| [[A - Browser va Rendering#Forced synchronous layout (Layout thrashing)\|Forced synchronous layout (Layout thrashing)]] | Đọc–ghi DOM xen kẽ ép browser tính layout lại liên tục. | A |
| [[D - Web Components va DOM nang cao#Form-associated custom element\|Form-associated custom element]] | Custom element hành xử như `<input>` thật trong form. | D |
| [[A - Browser va Rendering#FOUC (Flash of Unstyled Content)\|FOUC (Flash of Unstyled Content)]] | Chớp một nhịp trang trần trụi chưa có CSS. | A |
| [[B - JS Runtime va Event Loop#Frame / 60fps / 16.7ms\|Frame / 60fps / 16.7ms]] | Ngân sách thời gian cho mỗi khung hình. | B |
| [[D - Web Components va DOM nang cao#Framework-agnostic\|Framework-agnostic]] | Chạy được ở mọi framework vì nó là chuẩn của browser. | D |
| [[A - Browser va Rendering#GPU acceleration\|GPU acceleration]] | Đẩy việc raster/compositing sang card đồ hoạ cho mượt. | A |
| [[B - JS Runtime va Event Loop#Heap\|Heap]] | Kho bộ nhớ chứa object, array, function. | B |
| [[C - React#Hook\|Hook]] | Hàm đặc biệt cho phép component dùng state và tính năng React. | C |
| [[A - Browser va Rendering#HTML parser\|HTML parser]] | Cỗ máy đọc chuỗi HTML và dựng ra cây DOM. | A |
| [[C - React#Hydration\|Hydration]] | Gắn logic React vào HTML có sẵn từ server. | C |
| [[B - JS Runtime va Event Loop#import / export\|import / export]] | Hai từ khoá để chia và ghép code giữa các file. | B |
| [[A - Browser va Rendering#Incremental parsing\|Incremental parsing]] | Vừa tải tới đâu vừa dựng tới đó, không đợi tải hết file. | A |
| [[A - Browser va Rendering#Inheritance (CSS)\|Inheritance (CSS)]] | Một số thuộc tính tự chảy từ cha xuống con. | A |
| [[B - JS Runtime va Event Loop#JS engine (V8)\|JS engine (V8)]] | Chương trình đọc và chạy code JS của bạn. | B |
| [[C - React#JSX\|JSX]] | Cú pháp giống HTML viết trong file JS, phải dịch mới chạy được. | C |
| [[C - React#key\|key]] | Danh tính của item trong danh sách, giúp React nhận ra ai là ai. | C |
| [[A - Browser va Rendering#Layer (Compositing layer)\|Layer (Compositing layer)]] | Một "tấm kính" riêng chứa một phần trang, di chuyển được độc lập. | A |
| [[A - Browser va Rendering#Layout (Reflow)\|Layout (Reflow)]] | Tính toạ độ và kích thước thật (px) của từng box. | A |
| [[D - Web Components va DOM nang cao#Lifecycle callbacks (tổng quan)\|Lifecycle callbacks (tổng quan)]] | Năm hàm browser tự gọi ở các mốc đời của element. | D |
| [[C - React#Lifting state up\|Lifting state up]] | Đẩy state lên cha chung khi nhiều con cần dùng chung. | C |
| [[D - Web Components va DOM nang cao#Light DOM\|Light DOM]] | Đám con bình thường bạn viết bên trong thẻ, nằm ngoài shadow tree. | D |
| [[D - Web Components va DOM nang cao#Lit\|Lit]] | Thư viện mỏng bọc quanh Web Components cho đỡ cực. | D |
| [[D - Web Components va DOM nang cao#LitElement\|LitElement]] | Class cơ sở của Lit, lo sẵn shadow DOM, property và render. | D |
| [[B - JS Runtime va Event Loop#load\|load]] | Sự kiện báo "mọi ảnh, font, iframe đã tải xong". | B |
| [[B - JS Runtime va Event Loop#Long task\|Long task]] | Task chạy quá 50ms — thủ phạm chính gây lag. | B |
| [[A - Browser va Rendering#Main thread\|Main thread]] | Luồng duy nhất vừa chạy JS vừa lo layout/paint — tắc là lag. | A |
| [[C - React#Memoization (React.memo, useMemo, useCallback)\|Memoization (React.memo, useMemo, useCallback)]] | Nhớ kết quả cũ để khỏi tính lại khi input không đổi. | C |
| [[B - JS Runtime va Event Loop#Microtask\|Microtask]] | Việc nhỏ ưu tiên cao, chen ngay sau task hiện tại. | B |
| [[B - JS Runtime va Event Loop#Microtask queue\|Microtask queue]] | Hàng đợi riêng cho microtask, luôn được vét sạch. | B |
| [[B - JS Runtime va Event Loop#Minify\|Minify]] | Ép code nhỏ lại: xoá khoảng trắng, rút tên biến. | B |
| [[C - React#Mount / Unmount\|Mount / Unmount]] | Lần đầu component xuất hiện / lúc bị gỡ khỏi cây. | C |
| [[D - Web Components va DOM nang cao#Named slot\|Named slot]] | Slot có tên, để phân loại nội dung vào đúng ô header/body/footer. | D |
| [[D - Web Components va DOM nang cao#observedAttributes\|observedAttributes]] | Danh sách attribute bạn khai báo muốn được báo khi đổi. | D |
| [[D - Web Components va DOM nang cao#open vs closed mode\|open vs closed mode]] | Có cho người ngoài lấy shadowRoot hay không — không phải bảo mật. | D |
| [[A - Browser va Rendering#Paint (Repaint)\|Paint (Repaint)]] | Ghi ra danh sách lệnh vẽ: màu, chữ, viền, bóng. | A |
| [[A - Browser va Rendering#Parser-blocking script\|Parser-blocking script]] | Script làm HTML parser đứng hình giữa chừng. | A |
| [[A - Browser va Rendering#Preload scanner\|Preload scanner]] | Con mắt phụ chạy trước, tìm ảnh/CSS/JS để tải sớm. | A |
| [[B - JS Runtime va Event Loop#preventDefault() / stopPropagation()\|preventDefault() / stopPropagation()]] | Chặn hành vi mặc định vs chặn đường đi của event. | B |
| [[B - JS Runtime va Event Loop#Promise\|Promise]] | Object đại diện cho một kết quả sẽ có trong tương lai. | B |
| [[C - React#Prop drilling\|Prop drilling]] | Truyền props xuyên qua nhiều tầng chỉ để tới tầng dưới cùng. | C |
| [[C - React#Props\|Props]] | Dữ liệu cha truyền xuống con, con chỉ được đọc. | C |
| [[C - React#Pure function (component thuần)\|Pure function (component thuần)]] | Cùng input phải cho cùng output, không gây tác dụng phụ khi render. | C |
| [[B - JS Runtime va Event Loop#queueMicrotask()\|queueMicrotask()]] | Cách chủ động nhét một việc vào microtask queue. | B |
| [[A - Browser va Rendering#Raster (Rasterization)\|Raster (Rasterization)]] | Thực thi lệnh vẽ thành pixel thật trong bitmap. | A |
| [[C - React#Re-render\|Re-render]] | React gọi lại hàm component để lấy mô tả UI mới. | C |
| [[C - React#React element\|React element]] | Object mô tả "cần vẽ gì" — nhẹ, bất biến, không phải DOM. | C |
| [[C - React#React.createElement()\|React.createElement()]] | Hàm cũ mà JSX được dịch thành, trả về một object mô tả UI. | C |
| [[D - Web Components va DOM nang cao#Reactive Controller\|Reactive Controller]] | Mẩu logic tái sử dụng móc vào vòng đời component, na ná hook. | D |
| [[D - Web Components va DOM nang cao#Reactive property\|Reactive property]] | Property mà đổi giá trị thì Lit tự xếp lịch vẽ lại. | D |
| [[C - React#Reconciliation\|Reconciliation]] | Quá trình React đối chiếu cây mới với cây cũ. | C |
| [[D - Web Components va DOM nang cao#Reflect (property → attribute)\|Reflect (property → attribute)]] | Chép giá trị property ngược ra attribute để CSS và DevTools thấy. | D |
| [[A - Browser va Rendering#Reflow vs Repaint\|Reflow vs Repaint]] | Bảng đối chiếu hai việc hay bị lẫn lộn nhất. | A |
| [[C - React#Render phase\|Render phase]] | Giai đoạn tính toán, chưa đụng vào DOM thật. | C |
| [[A - Browser va Rendering#Render tree\|Render tree]] | Cây chỉ chứa những gì thực sự được vẽ, kèm style đã tính xong. | A |
| [[A - Browser va Rendering#Render-blocking resource\|Render-blocking resource]] | Tài nguyên khiến browser không dám vẽ khung hình đầu tiên. | A |
| [[A - Browser va Rendering#Rendering engine (browser engine)\|Rendering engine (browser engine)]] | Phần lõi của browser lo việc biến HTML/CSS thành hình ảnh trên màn hình. | A |
| [[B - JS Runtime va Event Loop#Rendering opportunity\|Rendering opportunity]] | Khe thời gian browser được phép vẽ lại màn hình. | B |
| [[B - JS Runtime va Event Loop#requestAnimationFrame() (rAF)\|requestAnimationFrame() (rAF)]] | Đặt lịch chạy code ngay trước lần vẽ tiếp theo. | B |
| [[C - React#RSC (React Server Component)\|RSC (React Server Component)]] | Component chỉ chạy trên server, không gửi JS xuống client. | C |
| [[C - React#Scheduler\|Scheduler]] | Bộ phân lịch quyết định làm việc gì trước, khi nào nhường main thread. | C |
| [[D - Web Components va DOM nang cao#Shadow boundary\|Shadow boundary]] | Đường ranh vô hình mà selector, style và một số event không vượt qua. | D |
| [[D - Web Components va DOM nang cao#Shadow DOM\|Shadow DOM]] | Cây DOM riêng gắn trong một element, cách ly CSS và selector. | D |
| [[D - Web Components va DOM nang cao#Shadow host\|Shadow host]] | Element bên ngoài đang "đội" cái shadow root. | D |
| [[D - Web Components va DOM nang cao#Shadow root\|Shadow root]] | Node gốc của cây con đó, nơi bạn đổ template và style vào. | D |
| [[B - JS Runtime va Event Loop#Single-threaded\|Single-threaded]] | JS chỉ có một luồng — làm xong việc này mới tới việc kia. | B |
| [[D - Web Components va DOM nang cao#slot\|slot]] | Cái lỗ trong shadow DOM để nội dung light DOM lọt vào hiển thị. | D |
| [[D - Web Components va DOM nang cao#slotchange\|slotchange]] | Event báo có nội dung được nhét vào hoặc rút khỏi slot. | D |
| [[B - JS Runtime va Event Loop#Source map\|Source map]] | Bản đồ dẫn ngược từ code đã build về code gốc. | B |
| [[A - Browser va Rendering#Specificity (độ ưu tiên selector)\|Specificity (độ ưu tiên selector)]] | Điểm số quyết định selector nào thắng khi đụng nhau. | A |
| [[A - Browser va Rendering#Stacking context\|Stacking context]] | "Cõi riêng" quyết định ai đè lên ai theo trục z. | A |
| [[C - React#State\|State]] | Dữ liệu component tự giữ, đổi thì React vẽ lại. | C |
| [[B - JS Runtime va Event Loop#Strict mode\|Strict mode]] | Chế độ JS nghiêm khắc, ít bẫy ngầm hơn. | B |
| [[C - React#StrictMode\|StrictMode]] | Chế độ dev cố tình chạy đôi để lộ ra bug ẩn. | C |
| [[D - Web Components va DOM nang cao#Style encapsulation\|Style encapsulation]] | CSS ngoài không lọt vào, CSS trong không lọt ra. | D |
| [[B - JS Runtime va Event Loop#Synchronous vs Asynchronous\|Synchronous vs Asynchronous]] | Chạy thẳng một mạch hay hẹn lát nữa quay lại. | B |
| [[C - React#Synthetic event\|Synthetic event]] | Lớp bọc sự kiện của React đặt lên trên event thật của browser. | C |
| [[B - JS Runtime va Event Loop#Tagged template literal\|Tagged template literal]] | Hàm nhận thẳng các mảnh chuỗi và biến — Lit sống bằng cái này. | B |
| [[B - JS Runtime va Event Loop#Task (Macrotask)\|Task (Macrotask)]] | Một đơn vị việc lớn: chạy script, xử lý click, callback timer. | B |
| [[B - JS Runtime va Event Loop#Task queue\|Task queue]] | Hàng đợi chứa các task chờ tới lượt. | B |
| [[D - Web Components va DOM nang cao#template\|template]] | Thẻ chứa HTML bị "đóng băng", không render, để đem đi nhân bản. | D |
| [[A - Browser va Rendering#Tokenizer\|Tokenizer]] | Bước cắt chuỗi HTML thành từng mẩu có nghĩa trước khi dựng cây. | A |
| [[C - React#Transpile (trong React)\|Transpile (trong React)]] | Bước dịch JSX thành lời gọi hàm JS thường. | C |
| [[B - JS Runtime va Event Loop#Transpiler (Babel, SWC)\|Transpiler (Babel, SWC)]] | Dịch cú pháp mới/JSX thành JS mà browser hiểu. | B |
| [[B - JS Runtime va Event Loop#Tree-shaking\|Tree-shaking]] | Cắt bỏ code được import nhưng không hề dùng. | B |
| [[C - React#useEffect\|useEffect]] | Chạy code phụ sau khi màn hình đã vẽ xong. | C |
| [[C - React#useLayoutEffect\|useLayoutEffect]] | Như useEffect nhưng chạy trước khi browser vẽ. | C |
| [[C - React#useRef\|useRef]] | Ô nhớ tồn tại qua các lần render nhưng đổi không gây re-render. | C |
| [[C - React#useState\|useState]] | Hook tạo một ô nhớ có thể thay đổi và gây re-render. | C |
| [[A - Browser va Rendering#Viewport\|Viewport]] | Khung nhìn — vùng màn hình đang thực sự thấy trang. | A |
| [[C - React#Virtual DOM (VDOM)\|Virtual DOM (VDOM)]] | Cây object trong bộ nhớ mô tả UI để đem đi so sánh. | C |
| [[B - JS Runtime va Event Loop#Web API (browser API)\|Web API (browser API)]] | Những khả năng browser cho JS mượn: DOM, fetch, timer. | B |
| [[D - Web Components va DOM nang cao#Web Components (nhóm 3 spec)\|Web Components (nhóm 3 spec)]] | Tên gọi chung cho ba spec rời nhau, không phải một thư viện. | D |

---

## 🧭 Không biết tra từ nào?

| Bạn đang thắc mắc | Nhảy tới |
| --- | --- |
| "Trang được vẽ ra kiểu gì?" | [[A - Browser va Rendering\|Glossary A]] + [[01 - Tu URL den Pixel - Vong doi mot trang web]] |
| "Script chạy lúc nào?" | [[B - JS Runtime va Event Loop\|Glossary B]] + [[03 - Script duoc tai luc nao - defer, async, module]] |
| "Sao `setState` xong log ra giá trị cũ?" | [[B - JS Runtime va Event Loop#Closure\|Closure]] + [[07 - React - Truy vet mot lan setState tu click den pixel]] |
| "React sửa DOM lúc nào?" | [[C - React#Commit phase\|Commit phase]] + [[06 - React - Virtual DOM, Reconciliation va Fiber]] |
| "Sao CSS ngoài không lọt vào component?" | [[D - Web Components va DOM nang cao#Style encapsulation\|Style encapsulation]] + [[10 - Shadow DOM - Cay trong cay va ranh gioi that su]] |
| "React với Web Components khác gì?" | [[11 - So sanh truc tiep - React vs Web Components]] |
