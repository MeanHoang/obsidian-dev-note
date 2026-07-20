# 🌐 Web Dev & Craft — 2026-07-06

> Kỷ nguyên compiler + Rust hoá tooling: React tách event khỏi effect, Vite 8 hợp nhất bundler bằng Rolldown, cộng loạt update JS/CSS/performance đáng ngấm.

## ⭐ [useEffectEvent: tách "event" ra khỏi Effect](https://react.dev/reference/react/useEffectEvent) — (react.dev)
**Đây là gì:** Hook mới (stable từ React 19.2) tạo một "Effect Event" — hàm gọi được từ trong `useEffect` mà luôn đọc props/state mới nhất, nhưng KHÔNG bị đưa vào dependency array nên không làm Effect chạy lại.
**Chi tiết:**
- Giải quyết pain kinh điển: Effect cần đọc một giá trị (theme, user hiện tại...) nhưng nếu bỏ vào deps thì Effect re-run và reconnect lại external system một cách vô nghĩa.
- Chỉ được gọi ở **top level** của component/custom hook; và chỉ gọi được **bên trong Effect** (useEffect/useLayoutEffect...), không gọi khi render, không truyền xuống component con.
- Identity của Effect Event cố tình **bất ổn định** (đổi mỗi lần render) → tuyệt đối không cho vào dependency array; đây là design để bắt bug.
- Cảnh báo: đừng lạm dụng để "né" khai báo dependencies — chỉ dùng cho logic thực sự không nên trigger Effect (logging, notification với state hiện tại). Lạm dụng sẽ giấu bug.
**Vì sao đáng đọc:** Với Joy Loyalty dùng React (Polaris), pattern này dọn sạch mấy Effect "reconnect liên tục" khi lắng nghe webhook/subscription hoặc log analytics theo state hiện tại — ổn định connection mà vẫn đọc giá trị mới.

```js
function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    // luôn đọc `theme` mới nhất mà không cần cho vào deps
    showToast('Connected!', theme);
  });

  useEffect(() => {
    const conn = createConnection(roomId);
    conn.on('connected', () => onConnected());
    conn.connect();
    return () => conn.disconnect();
  }, [roomId]); // chỉ reconnect khi roomId đổi, KHÔNG vì theme
}
```

## ⭐ [Vite 8.0: một bundler Rust duy nhất (Rolldown)](https://vite.dev/blog/announcing-vite8) — (vite.dev)
**Đây là gì:** Vite 8 (ra 12/03/2026) bỏ kiến trúc 2 bundler cũ (esbuild cho dev + Rollup cho prod), thay bằng **Rolldown** — bundler viết bằng Rust, xử lý cả dev lẫn production trong một hệ thống.
**Chi tiết:**
- Build nhanh hơn **10-30x** so với setup cũ; ví dụ thật: Linear từ 46s xuống 6s, Beehiiv giảm 64%.
- Rolldown giữ tương thích với **Rollup plugin API** → hầu hết plugin Vite hiện có chạy được ngay, không phải viết lại.
- Mở khoá tính năng trước đây bất khả thi khi tách 2 bundler: full bundle mode, chunk splitting linh hoạt, **module-level persistent caching**, và Module Federation.
- Toolchain end-to-end: Rolldown (bundler) + Oxc (compiler) + Vite hoạt động nhất quán qua các stage parse/resolve/transform/minify.
**Vì sao đáng đọc:** Nếu embedded UI / extension của Joy Loyalty dùng Vite, nâng cấp gần như "free win" về build time và HMR — CI nhanh hơn, dev loop mượt hơn, ít lệch behavior giữa dev và prod.

## [Container Queries 2026: mạnh, nhưng không phải viên đạn bạc](https://blog.logrocket.com/container-queries-2026/) — (blog.logrocket.com)
**Đây là gì:** Bài phân tích cân bằng (Sebastian Weber) về container queries — cho phép component tự adapt theo kích thước **container cha trực tiếp** thay vì viewport, nhưng chỉ bổ sung chứ không thay thế media queries.
**Chi tiết:**
- Ưu tiên unit logic **`cqi`/`cqb`** (1% inline/block size của container) hơn `cqw/cqh` vật lý — hợp cho fluid typography và spacing theo tỉ lệ.
- Dùng **named container** (`container: card / inline-size`) để query ổn định khi thêm/bớt container lồng nhau; ý định rõ ràng hơn.
- Phải set `container-type` để tạo containment context (tránh vòng lặp vô hạn); nhưng flex item cần sizing rõ ràng nếu không dễ collapse layout.
- Khi KHÔNG nên dùng: không đặt container trực tiếp lên grid item (thêm wrapper), đừng query root element, container không self-query được — chỉ đo được ancestor.
**Vì sao đáng đọc:** Polaris component (card, banner, widget) của Joy Loyalty xuất hiện ở nhiều vị trí (sidebar, main, modal) — container query cho phép một component responsive theo chỗ nó nằm, giảm số media query rải rác.

## [Những feature ES2026 đáng biết ngay](https://blog.webdevsimplified.com/2026-06/new-javascript-features-es2026/) — (blog.webdevsimplified.com)
**Đây là gì:** Tổng hợp các API JavaScript mới trong ES2026 đã landing vào runtime hiện đại (Node, V8), tập trung vào những thứ thực sự dùng hằng ngày.
**Chi tiết:**
- **`Array.fromAsync`** — như `Array.from` nhưng cho async iterable (stream, API phân trang, async generator).
- **`Error.isError`** — check error object đúng cả khi qua iframe/realm boundary, nơi `instanceof` fail.
- **`Map.getOrInsert`** — lấy value nếu có key, không thì insert default rồi trả về; gọn hoá pattern quen thuộc.
- **`Math.sumPrecise`** — cộng dãy số float chính xác bằng compensated summation, tránh sai số làm tròn.
**Vì sao đáng đọc:** `Array.fromAsync` hợp gu Firebase/GCP (gom kết quả từ Firestore paginated query hay stream), còn `Math.sumPrecise` hữu ích khi cộng điểm/tiền thưởng loyalty mà không muốn dính lỗi float.

## [Cách tối ưu INP (Interaction to Next Paint)](https://web.dev/explore/how-to-optimize-inp) — (web.dev)
**Đây là gì:** Guide chính chủ của web.dev về INP — Core Web Vital đo độ phản hồi khi user tương tác; ngưỡng tốt là **≤ 200ms** ở phân vị 75.
**Chi tiết:**
- Bắt đầu từ **field data (RUM)** chứ không chỉ lab — field data còn cho biết interaction cụ thể nào gây INP xấu.
- Chiến lược cốt lõi: **break long tasks** (tách task > 50ms), defer công việc không quan trọng, yield về main thread trong lúc interaction, giảm độ phức tạp DOM.
- Đẩy tính toán nặng CPU sang **web worker** để main thread luôn sẵn sàng phản hồi click.
**Vì sao đáng đọc:** UI Joy Loyalty trong Shopify admin (Polaris) nếu long task chặn main thread sẽ làm merchant thấy lag khi bấm — checklist INP này trực tiếp cải thiện DX cảm nhận của merchant.

---
*Nguồn tham khảo: [react.dev](https://react.dev/reference/react/useEffectEvent), [vite.dev](https://vite.dev/blog/announcing-vite8), [blog.logrocket.com](https://blog.logrocket.com/container-queries-2026/), [blog.webdevsimplified.com](https://blog.webdevsimplified.com/2026-06/new-javascript-features-es2026/), [web.dev](https://web.dev/explore/how-to-optimize-inp)*
