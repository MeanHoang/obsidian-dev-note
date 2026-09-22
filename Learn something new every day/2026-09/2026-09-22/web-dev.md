# 🌐 Web Dev & Craft — 2026-09-22

> Hôm nay Next.js tung bản patch bảo mật khẩn (out-of-band) cho lỗi critical từ dependency upstream; Chrome 154 lên stable với loạt API mới; cộng thêm 3 bài nền tảng về React memoization, Baseline 2026 và Temporal API.

## ⭐ [Upcoming Next.js Security Update for a Critical Upstream Issue](https://nextjs.org/blog/upcoming-nextjs-security-release-september-22-2026) — (nextjs.org, Josh Story / Karim Rahal / Sebastian Silbermann, 21/09/2026)

**Đây là gì:** Thông báo chính thức từ team Next.js: một lỗi bảo mật **critical** được phát hiện trong một **dependency upstream** (thư viện Next.js phụ thuộc vào, không phải code Next.js). Họ lên kế hoạch phát hành bản vá **out-of-band** (ngoài lịch release thường lệ) ngay hôm nay 22/09/2026.

**Chi tiết:**
- Hai phiên bản vá được nêu rõ trong bài: **Next.js 16.3.6** và **15.5.26**.
- Advisory đầy đủ là **GHSA-vcvr-r3jv-pc5j**, sẽ được publish *cùng lúc* với bản update — bao gồm impact, danh sách phiên bản bị ảnh hưởng và hướng dẫn upgrade. Tức là tại thời điểm bài blog ra, chi tiết lỗi vẫn đang được giữ kín (coordinated disclosure).
- Khuyến nghị của team: "Upgrade to Next.js 16.3.6 or 15.5.26 as soon as they are available" — nâng cấp ngay khi có.
- Bài nhắc lại chương trình bảo mật: Next.js làm việc với security researcher qua **Vercel's Open Source Bug Bounty** trên HackerOne; câu hỏi về vulnerability gửi `security@vercel.com`.
- Điểm đáng lưu ý về mặt quy trình: đây là lỗi *upstream dependency* → nghĩa là các framework/app khác dùng chung dependency đó cũng có thể bị ảnh hưởng, không riêng Next.js.

**Vì sao đáng đọc:** Nếu Joy Loyalty có bất kỳ service nào chạy Next.js (landing page, admin dashboard, docs site), đây là việc cần làm **hôm nay** chứ không phải sprint sau — bản vá critical + advisory publish đồng thời nghĩa là khoảng thời gian an toàn sau khi công bố rất ngắn. Rộng hơn, nó là lời nhắc cho stack JS thuần + Firebase: lỗi thường không nằm ở code mình viết mà ở cây `node_modules`, nên `npm audit` / Dependabot / pin version phải là thói quen chứ không phải phản ứng bị động.

## [Chrome 154 beta](https://developer.chrome.com/blog/chrome-154-beta) — (developer.chrome.com, 02/09/2026)

**Đây là gì:** Bản tổng hợp các web platform feature trong Chrome 154 (bài viết ở giai đoạn beta ngày 02/09/2026). Đáng chú ý cho CSS/UI và JS:
- **CSS:** `scroll-marker-group` giờ hỗ trợ 2 mode `links` (mặc định, hoạt động như navigation list) và `tabs` (hoạt động như tablist); thêm `text-decoration-inset` (điều khiển khoảng cách underline/overline) và `text-decoration-skip-spaces` (không vẽ decoration trên whitespace); `FontFace` có attribute `width` làm alias cho `stretch`; cải thiện hành vi **light dismiss** cho `popover` và `<dialog>`; `<iframe>` responsive theo kích thước.
- **JavaScript:** iterator helper mới `includes()` để kiểm tra một giá trị có được yield ra hay không.
- **Web API:** WebSocket constructor nhận options dictionary; thuật toán **post-quantum crypto** (ML-KEM, ML-DSA, X-Wing) và ChaCha20-Poly1305; forward abort reason từ `AbortController` sang fetch response; các method chèn HTML dạng streaming (`streamAppendHTML()`); WebGPU fragment depth modifier; Window Shape API.

**Vì sao đáng đọc:** `scroll-marker-group` mode `tabs` và light-dismiss cho popover/dialog là thứ trực tiếp thay được JS handmade trong loyalty widget (modal đổi điểm, carousel reward, tab tier) — bớt code, bớt bug focus/keyboard. `text-decoration-skip-spaces` nhỏ nhưng ăn ngay vào chất lượng typography của widget hiển thị trên storefront khách hàng.

## [The React pattern everyone uses that quietly kills performance](https://blog.logrocket.com/react-pattern-everyone-uses-kills-performance/) — (LogRocket Blog, Ikeh Akinyemi, 03/04/2026)

**Đây là gì:** Bài phân tích một anti-pattern rất phổ biến: truyền **object / array / callback inline ngay tại call site** xuống component đã được memo hóa. React so sánh props bằng `Object.is` (so **reference**, không so **value**), nên mỗi lần render parent tạo ra reference mới → React coi như prop đã "đổi" → phá vỡ memoization boundary dù giá trị logic y hệt. Bài chỉ rõ vấn đề chỉ thực sự đau khi 3 điều kiện chồng nhau: parent re-render thường xuyên + child subtree lớn + đã có memo nhưng memo không chặn được re-render. Cách sửa: đưa object tĩnh ra ngoài component body, dùng `useCallback` để ổn định reference của callback động; bài dẫn ví dụ giảm render time từ **243.9ms xuống 6ms**. Công cụ phát hiện: React DevTools Profiler và package **Why Did You Render**.

**Vì sao đáng đọc:** Đúng tình huống của UI Polaris ở Joy Loyalty: bảng member/activity dài, `ResourceList` / `IndexTable` có hàng trăm row, mỗi row nhận `onClick={() => ...}` và `style={{...}}` inline — memo không có tác dụng gì. Đây là checklist cụ thể để soi lại các list nặng thay vì rải `React.memo` bừa rồi tưởng đã tối ưu.

## [Baseline 2026](https://web.dev/baseline/2026) — (web.dev)

**Đây là gì:** Trang tổng hợp chính thức "các feature đã trở thành Baseline trong năm 2026" — tức là đã chạy được trên bản stable hiện tại của cả Chrome, Edge, Firefox, Safari (desktop + mobile), nghĩa là dùng được mà không cần polyfill/fallback phức tạp. Nhóm **HTML & CSS** bao gồm `field-sizing`, **container style queries**, selector `:open`, `contrast-color()`, `@scope`, và các đơn vị font-relative mới (`rcap`, `rch`, `rex`, `ric`). Nhóm **JavaScript & Web API** có **Navigation API**, WebTransport, **Trusted Types**, `Math.sumPrecise()`, và shared worker hỗ trợ module.

**Vì sao đáng đọc:** Widget loyalty phải nhúng vào theme của muôn vàn store Shopify — `@scope` và container style queries là vũ khí để CSS widget không bị theme của merchant "ăn" và ngược lại, mà không cần hack `!important` hay Shadow DOM. Dùng trang này làm nguồn tra cứu "đã an toàn để ship chưa" thay vì đoán theo caniuse.

## [Temporal — JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal) — (MDN Web Docs)

**Đây là gì:** Trang reference của `Temporal`, namespace object mới trong JavaScript được thiết kế làm **bản thay thế hoàn toàn cho `Date`**. Nó không phải constructor (không dùng `new Temporal(...)`, giống `Math` — tất cả property/method đều static). Đặc trưng: có time zone và calendar ngay trong kiểu dữ liệu, chuyển đổi wall-clock time, làm toán ngày/giờ, format, và độ chính xác tới **nanosecond**. Các class chính: `Temporal.Duration` (khoảng thời gian), `Temporal.Instant` (một điểm thời gian tuyệt đối), `Temporal.ZonedDateTime` (date-time có time zone tường minh), `Temporal.PlainDateTime`, `Temporal.PlainDate`, `Temporal.PlainTime`, `Temporal.PlainYearMonth`, `Temporal.PlainMonthDay`, cùng `Temporal.Now`. **Lưu ý quan trọng:** MDN ghi rõ trạng thái **Limited availability** — "This feature is not Baseline because it does not work in some of the most widely-used browsers."

**Vì sao đáng đọc:** Loyalty là bài toán ngày tháng dày đặc: hạn dùng điểm (points expiry), chu kỳ tier, cửa sổ khuyến mãi, birthday reward — và tất cả đều phải đúng theo **timezone của store**, chỗ mà `Date` thuần thường sai âm thầm. Đọc để nắm mental model `ZonedDateTime` vs `PlainDate` (điểm hết hạn là "ngày theo lịch của merchant", không phải timestamp UTC). Nhưng vì mới ở Limited availability, phía client vẫn cần polyfill hoặc giữ thư viện hiện tại — chưa nên đổi ngay trong code production.
