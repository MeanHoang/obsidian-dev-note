# 🌐 Web Dev & Craft — 2026-06-15

> Next.js 16.2 tăng tốc dev/render mạnh, Chrome 150 mang loạt API CSS mới, cùng 2 kỹ năng nền tảng: centering trong CSS 2026 và quản lý tài nguyên tự động trong JavaScript.

## ⭐ [Next.js 16.2: dev startup nhanh 400%, render nhanh hơn, tooling sâu cho AI agent](https://www.infoq.com/news/2026/06/nextjs-6-2/) — (InfoQ)
**Đây là gì:** Next.js là framework React phổ biến nhất (của Vercel) để dựng app full-stack — routing, server rendering, build. Bản 16.2 tập trung vào tốc độ vòng lặp dev và render server, cộng thêm tooling cho coding agent.
**Chi tiết:**
- `next dev` khởi động nhanh hơn ~400% (khoảng 87% nhanh hơn 16.1 trên app mặc định) — tức "time-to-URL" tới lúc `localhost:3000` sẵn sàng giảm rõ rệt.
- Render nhanh hơn ~50%: nhờ đóng góp 1 thay đổi vào React làm việc giải mã (deserialize) payload Server Components nhanh tới 350%. Lý do: bỏ `JSON.parse` với reviver callback (mỗi cặp key-value phải vượt biên C++/JS trong V8, khiến `JSON.parse` chậm ~4x), thay bằng `JSON.parse()` thường + duyệt đệ quy bằng JS thuần.
- Turbopack: Server Fast Refresh bật mặc định → refresh app nhanh 67%–100%, compile nhanh 400%–900% do chỉ reload module đã đổi; kèm SRI cho JS, tree shaking tốt hơn, hỗ trợ `postcss.config.ts` và 200+ bug fix.
- Tooling AI agent: `create-next-app` tự tạo file `AGENTS.md`, chuyển hướng log lỗi trình duyệt về terminal, và gói kèm docs dạng Markdown khớp version để agent đọc cục bộ.
- Debug tốt hơn: trang lỗi 500 mặc định được thiết kế lại, overlay hiển thị chuỗi `Error.cause` (tới 5 cấp) và "hydration diff indicator" gắn nhãn `+ Client` / `- Server`; thêm `next start --inspect` để gắn Node.js debugger vào server production.
**Vì sao đáng đọc:** Joy Loyalty chạy React (vì Polaris) + Node trên Cloud Run; vòng dev nhanh hơn và việc forward log lỗi trình duyệt về terminal cải thiện DX hằng ngày, còn `--inspect` cho production server giúp debug/profiling sự cố thực tế dễ hơn — tất cả áp dụng được dù bạn dùng JS thuần (không cần TS).

## [Chrome 150 beta — loạt API CSS & UI mới](https://developer.chrome.com/blog/chrome-150-beta) — (Chrome for Developers)
**Đây là gì:** Bản ghi chú beta liệt kê các tính năng web platform sắp lên stable ở Chrome 150 (dự kiến ra cuối tháng 6/2026). Đây là nơi xem trước CSS/JS API mới trước khi chúng "baseline".
**Chi tiết:**
- CSS `text-fit`: tự co/giãn cỡ chữ của text node để vừa khít chiều rộng container — làm typography responsive mà không cần tính tay bằng JS.
- Container queries phân tách bằng dấu phẩy: 1 rule `@container` chứa nhiều query, áp dụng nếu ít nhất một query khớp (kèm fallback).
- `zoom` animatable: thuộc tính CSS `zoom` (dạng số) giờ transition/animate mượt được.
- Thuộc tính HTML `focusgroup`: điều hướng bằng phím mũi tên, quản lý tab stop và "nhớ" focus cho widget tổ hợp một cách khai báo, không cần script tùy biến.
- System color `AccentColor` / `AccentColorText`: lấy màu nhấn của thiết bị vào CSS để giao diện app cài đặt trông "native" hơn.
- PWA Origin Migration: di chuyển PWA đã cài sang origin same-site mới mà vẫn giữ permission và "user trust".
**Vì sao đáng đọc:** Embed UI của Joy Loyalty (widget loyalty, theme block) có thể tận dụng `text-fit` và comma-separated container queries để layout component co giãn theo nhiều breakpoint mà bớt JS — gọn và ít bug hơn.

## [The State of CSS Centering in 2026](https://css-tricks.com/the-state-of-css-centering-in-2026/) — (CSS-Tricks, Temani Afif)
**Đây là gì:** Bài craft/CSS rà soát lại "căn giữa" — bài toán kinh điển — và cho thấy năm 2026 có nhiều cách đúng/sai tùy ngữ cảnh, không chỉ một công thức copy-paste.
**Chi tiết:**
- Flexbox gọn: `display: flex; flex-wrap: wrap; place-content: center;` thay vì gõ riêng `justify-content` + `align-items`.
- Grid: `display: grid; place-content: center;` — cách ngắn nhất cho hầu hết trường hợp.
- Căn giữa trong block layout: `align-content: center; justify-items: center;` (không cần đổi sang flex/grid).
- Absolute hiện đại: `inset: 0; place-self: center;` thay cho mẹo cũ `top/left: 50%; transform: translate(-50%,-50%)` (tác giả coi là lỗi thời).
- Anchor positioning: `justify-self: anchor-center;` để căn giữa theo phần tử neo; bonus `text-box: cap alphabetic;` để cắt khoảng trắng thừa quanh text.
**Vì sao đáng đọc:** UI Joy Loyalty xây bằng Polaris + CSS thuần; nắm các kiểu căn giữa "đúng ngữ cảnh" giúp viết style sạch, ít hack hơn khi cần override hoặc layout tùy biến ngoài component Polaris.

## [JavaScript's New Superpower: Explicit Resource Management (`using` / `await using`)](https://v8.dev/features/explicit-resource-management) — (V8 blog)
**Đây là gì:** Một tính năng JavaScript (đã ship trong V8/Chromium) cho phép tự động dọn dẹp tài nguyên (file handle, kết nối mạng, lock...) khi biến ra khỏi scope — tương tự `using` của C#. Đây là một trong các điểm nhấn của hướng ngôn ngữ ES2026.
**Chi tiết:**
- `using`: khai báo cho tài nguyên đồng bộ, tự gọi `[Symbol.dispose]()` khi biến rời scope; `await using`: cho tài nguyên bất đồng bộ, gọi và `await` `[Symbol.asyncDispose]()`.
- Bạn định nghĩa cách dọn dẹp ngay trên object bằng `[Symbol.dispose]()` — không cần nhớ gọi cleanup thủ công, tránh leak.
- Có `DisposableStack` / `AsyncDisposableStack` để gộp nhiều tài nguyên với `use()`, `adopt()`, `defer()`, `move()`.
- Ví dụ (JS thuần, không TS):
  ```js
  async function processData(response) {
    using readerResource = {
      reader: response.body.getReader(),
      [Symbol.dispose]() {
        this.reader.releaseLock();
      },
    };
    // ... dùng reader ...
  } // readerResource[Symbol.dispose]() tự chạy khi thoát hàm
  ```
- Hỗ trợ: Chromium 134 / V8 v13.8 và Firefox 134; chưa có ở Safari và (tại thời điểm bài viết) Node.js — nên kiểm tra runtime trước khi dùng trên Cloud Run.
**Vì sao đáng đọc:** Code Node của Joy Loyalty thường mở/đóng tài nguyên (stream, kết nối Firestore/GCP, lock); pattern `using` giúp đảm bảo cleanup ngay cả khi có lỗi/early-return — giảm rò rỉ tài nguyên trong hàm xử lý, nhưng cần xác nhận Node version trên Cloud Run đã hỗ trợ trước khi áp dụng.
