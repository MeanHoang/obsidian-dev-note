# 🌐 Web Dev & Craft — 2026-09-25

> Tuần này: React Compiler bản Rust đã dùng được trong Vite (một dòng config) nhưng thực tế build không nhanh hơn bao nhiêu, container queries tiếp tục bị hiểu nhầm là "media query thu nhỏ", Node 26.9 có `node:bench` + Web Workers, và Vercel chia sẻ cách giảm 91% latency tra metadata bằng shard + binary search.

## ⭐ [Rust React Compiler vs Babel: Is 10x speed real?](https://blog.logrocket.com/rust-react-compiler-vs-babel/) — (LogRocket Blog, 16/09/2026)
**Đây là gì:** React Compiler (công cụ tự thêm memoization cho component, khỏi phải viết `useMemo`/`useCallback` bằng tay) đã được port sang Rust và phân phối qua team Oxc. Bài này benchmark bản Rust với bản Babel cũ trên một app thật.
**Chi tiết:**
- Có 2 cách dùng: trong Vite qua `@vitejs/plugin-react` 6.1+, và có sẵn trong Bun 1.4. Với Vite, đổi `react({ babel: { plugins: ['babel-plugin-react-compiler'] } })` thành `react({ compiler: true })` và cài thêm `oxc-transform-react`. Với Bun, thêm `reactCompiler: true` vào options của `Bun.build()`.
- Riêng tầng transform thì bản Rust nhanh hơn **19.1x**, tính trên từng file là **18.8x**. App dùng để test có 178 component.
- Nhưng cold build toàn app qua Vite/Oxc lại **hơi chậm hơn** Babel (317.1ms so với 305.9ms). Lý do: bước compiler chỉ tốn khoảng 4ms trong cả build 300ms, tức "barely one percent". Bun build nhanh hơn 8.8x (34.9ms), nhưng bundle lớn hơn 43% và mặc định không có source map.
- Chạy được với cả JavaScript thuần lẫn TypeScript. Output memoization giống hệt bản Babel. Theo tác giả, app dưới khoảng 1.000 component thì không thấy được lợi ích về tốc độ.
- Kết luận của tác giả: người dùng Vite cứ bật ("ship it") vì chỉ đổi một dòng config và an toàn. Với Bun thì nên chờ bundler ổn định hơn.
**Vì sao đáng đọc:** Nếu admin app Polaris của Joy build bằng Vite, bật React Compiler bản Rust gần như không rủi ro và được auto-memoization cho các bảng/list member nặng. Tuy vậy, đừng kỳ vọng CI build nhanh hẳn lên, vì bài đo cho thấy nút thắt nằm ở chỗ khác.

## ⭐ [Stop Treating CSS Container Queries Like Traditional Media Queries](https://www.smashingmagazine.com/2026/09/stop-treating-css-container-queries-traditional-media-queries/) — (Smashing Magazine, 16/09/2026)
**Đây là gì:** Bài phân tích vì sao container queries đã được 94% trình duyệt hỗ trợ mà chỉ 41.4% dev thực sự dùng. Theo tác giả, nguyên nhân là cú pháp giống media query nên dev dùng sai mục đích. Media query nhìn ra viewport để lo layout cấp trang ("macro"). Container query nhìn vào khung chứa trực tiếp của component để lo layout cấp component ("micro").
**Chi tiết:**
- Cách chia việc: media query dành cho header, footer, navigation và system preferences. Container query dành cho card, widget, form, tức những component xuất hiện ở "more than one layout context" (vừa nằm trong sidebar vừa nằm trong grid full-width).
- Dùng unit riêng của container (`cqi`, `cqw`, `cqb`) để chữ co giãn theo component thay vì theo viewport, ví dụ `font-size: clamp(1rem, .5rem + 3cqi, 2rem)`.
- Có một kỹ thuật phát hiện flex item bị wrap mà không cần JS: đặt container query bên trong flex item. Khi item wrap xuống dòng, nó rộng ra và query được kích hoạt.
- Ba giới hạn cần biết. (1) "A container cannot query itself", nên luôn phải có thêm wrapper. (2) `container-type: size` có thể "collapse to 0px" nếu không set height, nên ưu tiên `inline-size`. (3) Không dùng được custom property làm breakpoint, ví dụ `@container (min-width: var(--breakpoint))` sẽ không chạy.
- Kết luận: container query không thay thế media query. Nó là công cụ đúng khi cần biết ngữ cảnh của một component cụ thể đã thay đổi.
**Vì sao đáng đọc:** Các widget của Joy (loyalty launcher, block trong theme app extension, trang rewards) bị merchant nhét vào đủ kiểu theme và cột có độ rộng khác nhau. Media query theo viewport không biết widget đang nằm ở cột hẹp hay cột rộng, còn container query thì biết, nên một widget có thể tự thích nghi mà không cần JS đo kích thước.

## [Node.js 26.9.0 (Current)](https://nodejs.org/en/blog/release/v26.9.0) — (nodejs.org, 16/09/2026)
**Đây là gì:** Bản Current trước 26.10 và có nhiều feature. Các thay đổi semver-minor đáng chú ý: module `node:bench` mới, **support Web Workers** trong `worker`, bật module `ffi` mặc định, `vfs` tích hợp với loader CJS/ESM, API DTLS thử nghiệm, API MAC chung cho `crypto`, và `meanCI` cùng export/import CBOR cho Histogram của `perf_hooks`.
**Vì sao đáng đọc:** `node:bench` cùng `meanCI` của histogram có thể giúp benchmark các hàm tính điểm hoặc tier của Joy ngay trong Node mà không cần thư viện ngoài. Đây là bản Current, không phải LTS, nên dùng để thử ở local trước. Cloud Functions/Cloud Run production vẫn nên chạy LTS.

## [How we cut CDN metadata lookup latency by 91%](https://vercel.com/blog/how-we-cut-cdn-metadata-lookup-latency-by-91-percent) — (Vercel Blog, 10/09/2026)
**Đây là gì:** Case study về tối ưu hiệu năng. Trước đây mỗi path có một object metadata riêng. Vercel đổi sang gom metadata của nhiều path vào các "shard" khoảng 200 KB, dạng JSONL đã sort, kèm index byte-offset tạo lúc build để binary search (O(log n)) và chỉ parse đúng record cần tìm. Một lần fetch shard sẽ làm ấm cache cho nhiều path cùng lúc. Kết quả: P99 giảm từ 215.8 ms xuống 19.1 ms (-91%), trung bình từ 8.59 ms xuống 1.81 ms, build nhanh hơn khoảng 16.6 giây.
**Vì sao đáng đọc:** Pattern "gom nhiều record nhỏ vào shard có index" áp dụng thẳng được cho Joy. Ví dụ khi cache config shop, earning rule hay widget setting trên GCS/Firestore, thay vì mỗi key một lần đọc (tốn read và dễ cache miss), có thể gom lại theo shard để giảm latency và giảm chi phí đọc.
