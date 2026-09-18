# 🌐 Web Dev & Craft — 2026-09-18

> Tuần này xoay quanh "ship ít JS hơn": Turbopack mở API tinh chỉnh chunking, Chrome 153 thêm API platform thay thư viện, và một bài benchmark bóc trần con số "10x nhanh hơn" của React Compiler bản Rust.

## ⭐ [How Turbopack chunks your JavaScript](https://nextjs.org/blog/turbopack-chunking) — (nextjs.org, 03/09/2026)

**Đây là gì:** Bài giải thích cách Turbopack quyết định "code nào nằm trong file JS nào" (chunking), vì sao bài toán này luôn là đánh đổi giữa *số request* và *lượng code tải về*, và loạt option experimental mới trong Next.js 16.3 cho phép bạn tự chỉnh thuật toán theo dữ liệu thật của site mình.

**Chi tiết:**
- Tác giả đi qua 3 chiến lược ngây thơ: **1 chunk cho cả app** (cache tốt, nhưng trang nào cũng tải JS của mọi trang), **1 chunk / page** (không thừa code, nhưng `<Footer />` bị tải lại ở mỗi trang), **1 chunk / module** (không bao giờ thừa, nhưng hàng trăm request nhỏ — gzip cũng nén tệ hơn vì chỉ tìm được pattern lặp trong từng file).
- Giải pháp của Turbopack là khái niệm **chunk group** (tập chunk luôn được load cùng nhau cho một page) và chỉ merge chunk *trong cùng group*. Bài có bảng 8 kịch bản điều hướng 2 trang cho thấy merge `A`+`B` chỉ thực sự lời (−1 request) khi **cả hai trang đều cần cả A lẫn B**; các trường hợp còn lại hoặc hòa, hoặc phải tải dư nguyên cụm `A` / `B`.
- Benchmark thật trên chính nextjs.org với 8 bước điều hướng: **không merge** = 561.6 KiB / 96 requests; **default** = 554.8 KiB / 38 requests; **merge tối đa mỗi group** = 610.0 KiB / 15 requests. Tức default cắt hơn nửa số request mà vẫn ship ít code hơn; merge tối đa đẹp cho lần load đầu nhưng tốn thêm ~10% code khi user điều hướng nhiều.
- Điểm mù của bundler: merge được quyết định lúc **build time**, không biết browser đang cache gì, và thuật toán phải *đoán* hành vi user (mặc định giả định 2/3 session chỉ xem 1 trang). Next.js 16.3 vá cả hai: `experimental.turbopackChunking.generateComponentChunks` phát hành thêm bản chunk **chưa merge** song song, để runtime chọn cái rẻ hơn tại thời điểm request; và nhóm option `firstPageLoadPriority` (mặc định 0.67, gợi ý lấy bounce rate làm giá trị khởi đầu), `priorityRoutes`, `clusters` (nhóm route hay được xem cùng nhau, định nghĩa bằng mảng regex).
- Ngoài ra là 3 tính năng "ship ít code hơn ngay từ đầu": **tree-shaking cho CJS module** (`experimental.turbopackCjsTreeShaking` — trước đây chỉ ESM được tree-shake), **shared Turbopack runtime** (`experimental.turbopackSharedRuntime`, tiết kiệm một blocking request và ~10 KB JS mỗi lần navigate sau lần đầu), và runtime mặc định nhẹ hơn do không còn nhét sẵn code WebAssembly / Web Worker.

**Vì sao đáng đọc:** Đây là bài hiếm hoi giải thích *tại sao* bundler chia file như vậy thay vì chỉ liệt kê flag — đọc xong bạn có mô hình tư duy để nhìn Network tab của bất kỳ app nào. Với Joy Loyalty: widget loyalty nhúng vào storefront khách và Admin app Polaris đều là bài toán "ít request + ít KB" y hệt, và khái niệm chunk group giúp bạn lý giải vì sao một component dùng chung lại bị tải lại nhiều lần giữa các trang admin.

## ⭐ [How we closed 1,500 GitHub issues in one month](https://nextjs.org/blog/how-we-closed-1500-github-issues) — (nextjs.org, 04/09/2026)

**Đây là gì:** Team Next.js kể lại cách họ dựng một agent tên `closability` để *nghiên cứu* backlog issue (chứ không tự đóng bừa), giúp maintainer đóng 1.462 issue trong khoảng 3 tuần và kéo backlog xuống dưới 1.000.

**Chi tiết:**
- Bối cảnh: repo nhận trung bình **36 issue mới mỗi tuần**; backlog đỉnh 3.109 issue (01/2025), đến 10/08/2026 vẫn còn 2.244. Cách cũ là auto-close theo "stale" (2 năm không hoạt động, sau rút còn 18 tháng) — nhưng bài thừa nhận **thời gian không hoạt động là chỉ báo tệ cho mức độ còn liên quan**, khiến họ đóng nhầm nhiều bug thật.
- Agent chạy trong sandbox sạch có sẵn repo Next.js, Node.js, Playwright, Chromium; quy trình 4 bước: đọc hội thoại + kiểm tra version còn được support → tìm issue/PR/commit/release/docs liên quan → thử reproduce trên version được báo, bản stable mới nhất và canary → **chủ động tìm bằng chứng phản bác kết luận của chính nó**. Output là JSON có `closeConfidence`, `primaryReason`, `evidence`, `references`.
- Hai quyết định an toàn đáng học: agent **read-only bên ngoài sandbox** (không comment, không close, không push, không deploy) và được cấu hình **bỏ qua mọi chỉ thị nằm trong nội dung issue hoặc repo** để chống prompt injection.
- Phân bố lý do đóng issue: đã fix 543 (37%), trùng lặp 278 (19%), hành vi đúng như thiết kế 237 (16%), không còn reproduce được 89 (6%), version không còn support 66 (5%), khác 249 (17%).
- Vận hành tiếp: mỗi thứ Hai agent review tối đa 100 issue không hoạt động ≥ 30 ngày; các case rõ ràng (điểm ≥ 80) phải qua **agent thứ hai đi tìm lý do giữ issue mở** rồi mới auto-close, giới hạn 25 issue/tuần, và luôn có GitHub Action cho phép người dùng reopen.

**Vì sao đáng đọc:** Đây là blueprint thực tế cho việc dùng agent vào việc *triage/nghiên cứu* thay vì để nó tự ý sửa code — pattern "agent chỉ đọc + con người ra quyết định + luôn có đường lùi" rất hợp với support ticket và bug backlog của Joy Loyalty, nơi nhiều ticket cũ thực ra đã được fix hoặc trùng nhau.

## [New in Chrome 153](https://developer.chrome.com/blog/new-in-chrome-153) — (developer.chrome.com, 08/09/2026)

**Đây là gì:** Bản tin tính năng của Chrome 153 (stable 08/09/2026), gồm một cải tiến CSS `overflow`, hai element HTML mới cho media capture, và một API iterator mới của JavaScript.

- **CSS:** `overflow` nay nhận giá trị scroll kết hợp với `clip`, tạo scroll container **chỉ trên một trục** mà không biến trục còn lại thành scroller — đúng bài toán kinh điển của carousel/tab bar ngang bị cắt mất shadow hoặc dropdown.
- **HTML:** thêm `<camera>` và `<microphone>` — control khai báo, do browser vẽ UI và tự xử lý permission, dành cho case capture đơn lẻ (tương tự `<usermedia>` đã ra trước đó).
- **JavaScript:** `Iterator.zip()` và `Iterator.zipKeyed()` gộp phần tử từ nhiều iterable thành một iterator trả về mảng, với các mode `shortest` (mặc định), `longest`, `strict`.

**Vì sao đáng đọc:** Ba thứ trước đây phải viết tay hoặc kéo lodash giờ là platform API — `Iterator.zip()` thay được mấy đoạn `map` + index thủ công khi ghép hai mảng dữ liệu (ví dụ ghép danh sách member với danh sách điểm tương ứng), còn `overflow` một trục xóa hẳn workaround `overflow: hidden` gây cắt popover trong widget.

## [Rust React Compiler vs Babel: Is 10x speed real?](https://blog.logrocket.com/rust-react-compiler-vs-babel/) — (LogRocket Blog, 16/09/2026)

**Đây là gì:** Bài benchmark kiểm chứng lời hứa "React Compiler viết lại bằng Rust nhanh 10x", đo trên một admin dashboard thật 178 component.

- Ở **tầng transform**, con số còn ấn tượng hơn quảng cáo: Oxc (Rust) nhanh **19.1x** so với Babel — 6.02ms xuống 0.32ms mỗi file.
- Nhưng ở **full build**, Babel 305.9ms, Oxc qua Vite 317.1ms (tức 0.96x — *chậm hơn* một chút), Bun 34.9ms (8.8x). Lý do: compiler chỉ chiếm khoảng 1% tổng thời gian build, phần còn lại là bundling.
- Về chất lượng output: memoization sinh ra giống hệt bản Babel, source map hoạt động bình thường, không phát hiện regression lúc runtime. Kết luận của tác giả: người dùng Vite cứ bật (chỉ một dòng config), nhưng lợi ích thực sự chỉ rõ khi app tiến tới quy mô 1.000+ component.

**Vì sao đáng đọc:** Bài học craft quan trọng hơn con số: **tăng tốc một thành phần chiếm 1% tổng thời gian thì wall-clock gần như không đổi** — luôn profile để biết bottleneck nằm ở đâu trước khi đổi tool. Với Joy Loyalty đang dùng React cho Polaris, đây là lý do để không vội đảo toolchain build chỉ vì một benchmark microbenchmark đẹp.
