# 🌐 Web Dev & Craft — 2026-06-17

> Tuần này thiên về "nền tảng": React 19.2 chuẩn hóa Activity + useEffectEvent, Node đẩy mạnh dùng `fetch` thuần thay Axios, và loạt API JS mới (ES2026) gọn việc xử lý lỗi/số liệu — toàn thứ áp thẳng được vào code JS thuần ở Joy Loyalty.

## ⭐ [React 19.2](https://react.dev/blog/2025/10/01/react-19-2) — (react.dev)

**Đây là gì:** React là thư viện UI của Meta mà Joy Loyalty dùng (vì Polaris build trên React). Bản 19.2 bổ sung vài API "đóng đinh" những pattern trước đây phải tự chế bằng tay (memo, ẩn/hiện component, tách event khỏi effect).

**Chi tiết:**
- **`<Activity mode="visible | hidden">`**: bọc một phần UI để pre-render trước hoặc giữ state khi rời đi. `hidden` ẩn children, unmount effect và hoãn update tới khi React rảnh; `visible` mount lại như bình thường — thay cho mẹo `display:none` cũ vốn không nhả effect.
  ```js
  <Activity mode={isVisible ? 'visible' : 'hidden'}>
    <Page />
  </Activity>
  ```
- **`useEffectEvent`**: tách logic "sự kiện" ra khỏi effect để không bị re-run vì dependency phụ. Ví dụ kết nối lại chỉ khi `roomId` đổi, còn `theme` đọc ở thời điểm chạy mà không cần liệt kê trong deps:
  ```js
  const onConnected = useEffectEvent(() => {
    showNotification('Connected!', theme); // đọc theme mới nhất, không gây re-run
  });
  useEffect(() => {
    const conn = createConnection(serverUrl, roomId);
    conn.on('connected', () => onConnected());
    conn.connect();
    return () => conn.disconnect();
  }, [roomId]); // ✅ chỉ roomId
  ```
- **`cacheSignal()`** (React Server Components): trả về một `AbortSignal` khớp vòng đời của `cache()`, để hủy fetch khi cache hết hạn — `await dedupedFetch(url, { signal: cacheSignal() })`.
- **Performance Tracks**: thêm track tùy chỉnh trong Chrome DevTools (Scheduler + Components) hiển thị độ ưu tiên render và cây component có timing — debug perf không cần đoán mò.
- Ngoài ra: SSR batch các Suspense boundary cho mượt, đổi prefix `useId` từ `:r:` sang `_r_` để hợp View Transitions, `eslint-plugin-react-hooks` v6 mặc định flat config + lint rule từ React Compiler.

**Vì sao đáng đọc:** `useEffectEvent` xử lý đúng cái bug "effect re-run thừa vì closure bắt biến cũ" mà mọi màn settings/realtime trong Joy hay dính; còn Performance Tracks giúp soi render chậm trong admin Polaris ngay trên DevTools.

## [Axios → WHATWG Fetch (migration guide + codemod)](https://nodejs.org/en/blog/migrations/axios-to-fetch) — (nodejs.org)

**Đây là gì:** Node.js đã có `fetch` thuần (stable từ v21) nên không còn cần thư viện HTTP bên ngoài. Bài này (kèm codemod chính chủ trong repo `nodejs/userland-migrations`) hướng dẫn bỏ Axios để gọi `fetch` native.

**Chi tiết:**
- **Đọc dữ liệu khác nhau**: Axios trả `res.data` đã parse sẵn; `fetch` phải tự `await res.json()`. Codemod giữ giao diện `.data` bằng cách bọc lại:
  ```js
  const all = await fetch(base)
    .then(async (res) => Object.assign(res, { data: await res.json() }))
    .catch(() => null);
  console.log(all.data);
  ```
- **Xử lý lỗi khác hẳn**: `fetch` KHÔNG throw khi gặp 4xx/5xx (chỉ throw khi lỗi mạng), trong khi Axios throw. Phải tự kiểm `res.ok` / `res.status` — đây là cái bẫy lớn nhất khi chuyển.
- **POST cần stringify thủ công**: `body: JSON.stringify(...)` + tự set `Content-Type`; form thì dùng `new URLSearchParams(...)`.
- **Timeout**: dùng `fetch(url, { signal: AbortSignal.timeout(5000) })` thay cho `timeout` config của Axios.
- **Không cover**: interceptors, cancel token, và `axios.create()` — phần này phải viết tay khi migrate.

**Vì sao đáng đọc:** Joy Loyalty gọi Shopify Admin API / webhook từ Node trên Cloud Run rất nhiều; bỏ Axios = bớt 1 dependency phải vá bảo mật, nhưng phải nhớ tự check `res.ok` để không "nuốt" lỗi 4xx/5xx.

## [Every New JavaScript Feature Worth Knowing Right Now (ES2026)](https://blog.webdevsimplified.com/2026-06/new-javascript-features-es2026/) — (Web Dev Simplified)

**Đây là gì:** ES2026 là phiên bản ECMAScript được TC39 chốt cuối 2025. Bài này điểm các API mới đã/đang phổ cập trên runtime, dùng được luôn trong JS thuần.

**Chi tiết:**
- **`Error.isError(value)`**: kiểm tra Error đáng tin hơn `instanceof Error` (không dính false positive khi qua realm/iframe). VD `Error.isError(new Error("oops")) // true`.
- **`Map.prototype.getOrInsert(key, default)`**: lấy value hoặc chèn mặc định trong 1 bước — thay cho mẫu `if (!map.has(k)) map.set(k, [])`: `const arr = map.getOrInsert(key, []);`.
- **`Math.sumPrecise([...])`**: cộng mảng số chính xác, tránh sai số float — `Math.sumPrecise([0.1, 0.2, 0.3]) // 0.6`.
- **`Array.fromAsync(asyncIterable)`**: gom async iterable thành mảng, tiện cho stream / API phân trang.
- (Bài có nhắc thêm Temporal và `using`/`await using` nhưng xếp vào ES2027, không gộp vào ES2026.)

**Vì sao đáng đọc:** `Math.sumPrecise` giúp cộng điểm/point loyalty không lệch float, còn `Map.getOrInsert` gọn đúng kiểu logic gom điểm theo customer mà code Joy hay viết bằng tay.

## [Temporal — API ngày giờ mới của JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal) — (MDN)

**Đây là gì:** Temporal là API thay thế `Date` (vốn nổi tiếng khó dùng, mutable, lệch timezone). Nó đạt TC39 Stage 4 (11/03/2026) và đã bật mặc định trong Node.js 26 (không còn cần flag `--harmony-temporal`).

**Chi tiết:**
- Bộ kiểu tách bạch rõ ràng: `Temporal.PlainDate` (chỉ ngày), `Temporal.PlainTime`, `Temporal.PlainDateTime`, `Temporal.ZonedDateTime` (kèm timezone), `Temporal.Instant` (mốc chính xác tới nanosecond), `Temporal.Duration`, và `Temporal.Now`.
- Mọi object Temporal là **immutable** + ý thức được timezone/calendar — hết kiểu vô tình mutate `Date` rồi lệch giờ.
- **Lưu ý support**: MDN ghi Temporal hiện ở mức "Limited availability / chưa Baseline" — đã có ở Node 26 và một số trình duyệt mới, nhưng Safari + nhiều mobile browser vẫn thiếu. Trên server (Node 26) thì dùng được ổn; phía client còn cần polyfill.

**Vì sao đáng đọc:** Joy Loyalty xử lý nhiều mốc thời gian theo timezone của merchant (hết hạn điểm, lịch campaign); `ZonedDateTime` xóa hẳn lớp lỗi cộng/trừ ngày sai timezone — nhưng nhớ rằng phía browser hiện vẫn nên polyfill, chỉ Node 26 mới native.
