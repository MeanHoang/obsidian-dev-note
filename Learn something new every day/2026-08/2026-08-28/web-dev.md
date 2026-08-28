# 🌐 Web Dev & Craft — 2026-08-28

> Chrome 152 đã stable với API mới cho performance và network policy; ưu tiên thực tế nhất là đo đúng soft navigation và rà lại các project Next.js cần vá ngay.

## ⭐ [New in Chrome 152](https://developer.chrome.com/blog/new-in-chrome-152) — (Chrome for Developers, 25/08/2026)

**Đây là gì:** Chrome 152 đã phát hành stable, thêm CPU Performance API, Connection Allowlists và mở rộng JavaScript interface `CSSPseudoElement` cho các pseudo-element hiện đại.

**Chi tiết:**

- CPU Performance API cho web app biết *performance tier* của CPU thiết bị, để điều chỉnh tác vụ nặng, background work hoặc mức đồ hoạ theo năng lực máy.
- API này có thể kết hợp Compute Pressure API, vốn cung cấp dữ liệu thời gian thực về áp lực và mức sử dụng CPU.
- `CSSPseudoElement` nay truy cập được `::backdrop`, `::scroll-marker` và `::view-transition`; riêng `::backdrop` giúp xử lý click ngoài dialog mà không cần tự tính vùng giao nhau với nội dung modal.
- Header HTTP `Connection-Allowlist` giới hạn các URL pattern mà document hoặc web worker được phép kết nối; browser đóng vai trò chặn các kết nối ngoài allowlist.

**Vì sao đáng đọc:** Widget loyalty trên storefront phải chạy được cả trên máy yếu lẫn máy mạnh; có thể thử progressive enhancement để giảm animation/tác vụ nền khi tier thấp, nhưng cần feature-detect và giữ fallback vì đây là tính năng Chrome. Connection allowlist cũng là hướng hardening đáng theo dõi cho trang có nhiều script bên thứ ba.

## [Chrome DevTools 152: đo Core Web Vitals cho SPA và resend mọi fetch](https://developer.chrome.com/blog/new-in-devtools-152) — (Chrome for Developers, 25/08/2026)

**Đây là gì:** DevTools 152 đưa Core Web Vitals của *soft navigation* (chuyển route không reload trong SPA) vào Performance Live Metrics, đồng thời nâng Network panel với resend cho request fetch/XHR, quan sát preload và đọc payload nhị phân.

**Vì sao đáng đọc:** Admin React của Joy chuyển tab/route liên tục trong embedded iframe, nên LCP/INP của lần tải đầu là chưa đủ. Giờ có thể xem metric của chính từng lần merchant chuyển Rewards → Members, rồi resend request lỗi ngay trong DevTools thay vì viết lại bằng tay. Network panel cũng có cột Preloaded và lệnh copy sẵn `<link rel="preload">` để kiểm chứng tối ưu tải tài nguyên.

## [Node.js 26.8.0 (Current)](https://nodejs.org/en/blog/release/v26.8.0) — (nodejs.org, 26/08/2026)

**Đây là gì:** Bản semver-minor mới của nhánh Current bổ sung các mode mã hoá SIV/GCM-SIV cho `Cipher`/`Decipher`, đưa `diagnostics_channel` `TracingChannel` lên stable, thêm statistical hypothesis testing cho histogram trong `perf_hooks`, cùng API ZIP native (`ZipEntry`, `ZipFile`, `ZipBuffer`).

**Vì sao đáng đọc:** `TracingChannel` stable đáng chú ý nếu Joy cần instrument các flow Node/Cloud Run theo một chuẩn ít tự chế hơn; histogram có kiểm định thống kê cũng hữu ích khi so benchmark trước/sau tối ưu. Tuy nhiên đây là nhánh **Current**, không phải tín hiệu tự động nâng runtime production đang dùng LTS.

## [August 2026 Security Release: Next.js đã vá 2 lỗ hổng Critical](https://nextjs.org/blog/august-2026-security-release) — (nextjs.org, 25/08/2026)

**Đây là gì:** Next.js đã phát hành security release tháng 8 sớm hơn lịch dự kiến, đưa bản vá **16.3.3** (Active LTS) và **15.5.24** (Maintenance LTS) để xử lý hai lỗ hổng mức Critical.

**Vì sao đáng đọc:** Bản tin ngày 22/08 mới là cảnh báo trước; giờ đã có version đích để action. Cần rà các service/site dùng Next.js, nâng đúng nhánh đang chạy, lockfile, build/test/deploy lại — không chờ tới đợt dependency update định kỳ. Nếu Joy không dùng Next.js ở production thì ghi nhận cho các project phụ/website, không cần tạo churn cho stack chính.
