# 🌐 Web Dev & Craft — 2026-09-09

> Chrome 151+ cuối cùng đã đo được Core Web Vitals cho SPA route transition, Node.js đổi hẳn mô hình release, Vite 8 gom về một bundler Rust duy nhất.

## ⭐ [Measuring soft navigations](https://developer.chrome.com/docs/web-platform/soft-navigations-experiment) — (Chrome for Developers, cập nhật 09/2026)

**Đây là gì:** Tài liệu chính thức về "soft navigation" — chuyển trang trong SPA bằng JS mà không reload. Trước đây LCP/CLS/INP chỉ được đo cho lần load đầu tiên, nên mọi route sau đó của một app React/Remix/Next client-side đều là vùng tối. Chrome 151+ bổ sung API để reset và đo lại Core Web Vitals cho từng route transition.

**Chi tiết:**
- Một điều hướng chỉ được tính là soft navigation khi thoả 3 điều kiện: khởi phát từ hành động của user, URL thay đổi và user nhìn thấy được, và tương tác dẫn tới một lần paint thật.
- Hai `PerformanceEntry` type mới: `soft-navigation` (mang `navigationId`, URL nằm ở thuộc tính `name`, kèm `interactionId`) và `interaction-contentful-paint` (có `largestContentfulPaint` để tính LCP cho route mới).
- Cả hai entry đều mang `navigationId`, nhờ đó gắn được từng metric vào đúng route thay vì trộn chung vào lần load đầu.
- Feature phát hiện bằng `PerformanceObserver.supportedEntryTypes.includes('soft-navigation')`; bật mặc định từ Chrome 151+ và Edge 151+, Firefox và Safari chưa hỗ trợ.
- Thư viện `web-vitals` từ v6.0.0 đã hỗ trợ sẵn, tự lo phần tính lại metric và attribution theo URL — không cần tự viết observer.

**Vì sao đáng đọc:** Đây là mảnh còn thiếu để đo hiệu năng thật của app SPA. **Impact Joy Loyalty:** Admin app Polaris là SPA thuần — merchant nhấn qua tab Members/Rewards/Analytics là soft navigation, lâu nay không có số liệu; nâng `web-vitals` lên v6 là có ngay INP/LCP cho từng màn hình, đủ để biết trang nào của app đang chậm thật.

## [New in Chrome 153](https://developer.chrome.com/blog/new-in-chrome-153) — (Chrome for Developers, 08/09/2026)

**Đây là gì:** Bản Chrome stable mới nhất, cũng là bản đầu tiên chạy theo nhịp release 2 tuần. Ba thứ đáng chú ý: single-axis scroll containers (mở rộng `overflow` để kết hợp giá trị scroll với `clip`, tạo scroll trên đúng một trục mà không ảnh hưởng trục kia), capability elements `<camera>` và `<microphone>` cho việc xin quyền quay video/thu âm, và joint iteration trong JS với `Iterator.zip()` / `Iterator.zipKeyed()` (ghép nhiều iterator theo mode "shortest", "longest" hoặc "strict").

**Vì sao đáng đọc:** `Iterator.zip()` xoá được đống code `for` thủ công khi ghép hai list song song. **Impact Joy Loyalty:** single-axis scroll giúp làm bảng member/activity scroll ngang gọn hơn mà không sinh scrollbar dọc thừa; `Iterator.zip()` tiện khi ghép danh sách member với danh sách points trả về từ hai query Firestore riêng.

## [Evolving the Node.js Release Schedule](https://nodejs.org/en/blog/announcements/evolving-the-nodejs-release-schedule) — (Node.js blog, 10/03/2026)

**Đây là gì:** Node.js bỏ mô hình odd/even đã dùng nhiều năm. Từ tháng 10/2026, mỗi năm chỉ còn **một** major release (tháng 4), lên LTS vào tháng 10, và **mọi** release đều thành LTS — không còn bản lẻ "sống 6 tháng rồi chết". Số version bám theo năm dương lịch (27.0.0 năm 2027, 28.0.0 năm 2028). Thêm kênh Alpha kéo dài 6 tháng (10 → 3) cho phép breaking change trước khi bản Current ra. Node.js 27: alpha 10/2026, Current 04/2027, LTS 10/2027, EOL 04/2030 — vòng đời hỗ trợ 30 tháng.

**Vì sao đáng đọc:** Thay đổi cách bạn lên kế hoạch nâng runtime cho vài năm tới. **Impact Joy Loyalty:** Cloud Functions / Cloud Run của Joy sẽ có nhịp nâng Node dễ đoán hơn hẳn — mỗi năm một lần thay vì phải theo dõi bản chẵn/lẻ, và cửa sổ 30 tháng cho phép hoãn upgrade an toàn hơn.

## [Vite 8.0 is out!](https://vite.dev/blog/announcing-vite8) — (Vite blog, 12/03/2026)

**Đây là gì:** Thay đổi kiến trúc lớn nhất của Vite kể từ v2. Trước đây Vite dùng esbuild cho dev và Rollup cho production build — hai bundler khác nhau nên dev và prod hay lệch hành vi. Vite 8 gom về **Rolldown**, một bundler viết bằng Rust, cho cả hai giai đoạn, giữ nguyên tương thích plugin. Số liệu trong bài: build nhanh hơn 10–30x, Linear giảm từ 46s xuống 6s, Beehiiv giảm 64%. Kèm theo: Vite Devtools tích hợp, hỗ trợ `tsconfig` paths sẵn, `emitDecoratorMetadata` tự động, WebAssembly SSR qua `.wasm?init`, và forward console của browser về terminal dev server. Yêu cầu Node 20.19+ hoặc 22.12+.

**Vì sao đáng đọc:** Giải quyết gốc rễ chuyện "chạy dev thì ổn, build prod thì lỗi". **Impact Joy Loyalty:** app embedded Shopify build bằng Vite được hưởng trực tiếp — CI nhanh hơn nhiều lần và bớt hẳn loại bug chỉ xuất hiện sau `vite build`.

## [How To Make Your Design System AI-Ready](https://www.smashingmagazine.com/2026/06/how-make-design-system-ai-ready/) — (Smashing Magazine, 03/06/2026)

**Đây là gì:** Vitaly Friedman đề xuất cách tái cấu trúc design system để LLM dùng được đáng tin cậy, thay vì để nó bịa tên token và đoán giá trị. Phương pháp gồm ba lớp: spec file dạng Markdown ghi rõ nguyên tắc và ví dụ (coi quyết định thiết kế là hạ tầng, không phải ngầm hiểu), một token layer gồm biến định sẵn để AI chỉ được chọn trong tập đóng, và script audit (ví dụ FigmaLint) quét ra giá trị hard-code, state không nhất quán, instance bị detach và lỗi accessibility.

**Vì sao đáng đọc:** Cách hiếm hoi biến "AI code UI bị drift" thành vấn đề kỹ thuật có thể kiểm chứng bằng script. **Impact Joy Loyalty:** áp lên Polaris token — viết spec file liệt kê đúng những token Polaris được phép dùng rồi cho lint chặn hard-code, để code UI sinh bằng AI không đẻ ra màu/spacing ngoài design system của Shopify.
