# 🌐 Web Dev & Craft — 2026-06-12

> Tuần này tooling JS rung chuyển: Cloudflare mua VoidZero (Vite/Rolldown/Oxc), còn npm v12 sắp tắt install scripts mặc định — cả hai đều ảnh hưởng trực tiếp workflow build & CI của mọi dev JS.

## ⭐ [VoidZero is joining Cloudflare](https://blog.cloudflare.com/voidzero-joins-cloudflare/) — (blog.cloudflare.com, 04/06/2026)
**Đây là gì:** VoidZero là công ty của Evan You (tác giả Vue/Vite), đứng sau toolchain JS thế hệ mới: Vite (build tool), Vitest (test runner), Rolldown (bundler viết bằng Rust), Oxc (linter/parser Rust). Cloudflare vừa mua lại toàn bộ công ty này.
**Chi tiết:**
- Bài announcement do chính Evan You + Steve Faulkner viết: Vite giờ là hạ tầng nền của Vue, React Router, Angular, Next.js... nên Cloudflare muốn đầu tư trực tiếp vào tầng tooling này.
- Cam kết: Vite, Vitest, Rolldown, Oxc, Vite+ giữ nguyên MIT license, governance trung lập vendor, roadmap vẫn do community dẫn dắt; team VoidZero tiếp tục lead các project (mô hình giống vụ Cloudflare mua Astro trước đó).
- Cloudflare lập quỹ $1 triệu cho hệ sinh thái Vite, do Vite core team quản lý, hỗ trợ maintainer độc lập với cả VoidZero lẫn Cloudflare.
- Kế hoạch tích hợp: thống nhất CLI của Cloudflare quanh Vite — `cf dev`, `cf build`, `cf deploy` sẽ như extension tự nhiên của Vite thay vì tool riêng.
- Roadmap xa hơn: thêm primitives provider-agnostic cho full-stack app và agents vào thẳng Vite, Cloudflare chỉ là một implementation hạng nhất (không lock-in).
**Vì sao đáng đọc:** Vite/Vitest đang là chuẩn de-facto của frontend tooling (kể cả app React/Polaris như Joy) — biết ai "sở hữu" toolchain và cam kết license giúp đánh giá rủi ro dài hạn khi đặt cược stack vào Vite.

## ⭐ [Upcoming breaking changes for npm v12](https://github.blog/changelog/2026-06-09-upcoming-breaking-changes-for-npm-v12/) — (github.blog, 09/06/2026)
**Đây là gì:** npm v12 (dự kiến tháng 7/2026) đổi 3 default theo hướng siết bảo mật supply chain — đáng kể nhất là `npm install` sẽ KHÔNG tự chạy install scripts của dependencies nữa, bắt kịp Yarn/pnpm/Bun vốn đã block từ lâu.
**Chi tiết:**
- `allowScripts` mặc định off: preinstall/install/postinstall/prepare của dependencies không chạy nếu chưa được allow tường minh — bao gồm cả native builds (node-gyp).
- `--allow-git` mặc định `none`: git dependencies bị chặn (đóng một đường code-execution); `--allow-remote` mặc định `none`: không resolve dependency từ URL tarball (trực tiếp lẫn transitive).
- Cách chuẩn bị ngay từ npm 11.16.0: chạy install bình thường để xem warnings, `npm approve-scripts --allow-scripts-pending` để xem package nào có scripts, rồi `npm approve-scripts` / `npm deny-scripts` từng package — allowlist tự ghi vào `package.json`, commit vào repo.
- Đây là phản ứng trực tiếp với chuỗi supply chain attack qua postinstall scripts trên npm thời gian qua; đi kèm staged publishing (publish từ CI phải có người duyệt + 2FA mới public).
**Vì sao đáng đọc:** App Shopify cài hàng trăm dependencies — khi npm v12 ra, CI build của Joy có thể gãy ở các package cần postinstall (native modules, sharp...); audit allowlist từ bây giờ bằng npm 11.16+ là việc nên làm trước tháng 7.

## [Node.js 26.3.0 (Current) released](https://nodejs.org/en/blog/release/v26.3.0) — (nodejs.org, 01/06/2026)
**Đây là gì:** Bản minor mới của Node 26 (dòng Current). Điểm nổi bật: `Buffer.poolSize` mặc định tăng từ 16 KiB lên 64 KiB (giảm allocation khi xử lý nhiều buffer nhỏ — Matteo Collina), option `httpValidation` để tùy chỉnh validate HTTP header, `permission.drop()` để bỏ bớt quyền lúc runtime, npm lên 11.16.0.
**Vì sao đáng đọc:** Backend Firebase/Cloud Run chạy Node — buffer pool lớn hơn có lợi cho workload HTTP/stream nhiều request nhỏ; và npm 11.16.0 bundled chính là bản có warnings để chuẩn bị cho npm v12 ở trên.

## [The React Compiler at Eighteen Months: The Arc, the Debates, and What's Next](https://saschb2b.com/blog/react-compiler-year-in-review) — (saschb2b.com, bài 22/04/2026)
**Đây là gì:** Bài tổng kết 18 tháng React Compiler — build-time transform tự chèn memoization, thay cho `useMemo`/`useCallback`/`React.memo` thủ công. Tác giả tóm gọn hiện trạng: "greenfield is solved, brownfield is a project" — app mới bật mặc định là xong, codebase cũ là cả một dự án migration.
**Vì sao đáng đọc:** Codebase React/Polaris lâu năm của Joy đúng kiểu "brownfield" — bài nêu migration path thực tế (bật ESLint rules strict → compile chọn lọc → inference mode → xóa memo thủ công) và các failure mode compiler từ chối optimize (mutation lúc render, đọc ref trong render).

## [New to the web platform in May](https://web.dev/blog/web-platform-05-2026) — (web.dev, 29/05/2026)
**Đây là gì:** Roundup hàng tháng các feature web platform mới landing ở browser stable/beta (Chrome 148, Firefox 151, Safari 26.5): name-only container queries (Chrome 148), pseudo-class `:open` (Safari 26.5), lazy loading cho `<video>`/`<audio>` (Chrome 148), container style queries cho custom properties (Firefox 151).
**Vì sao đáng đọc:** Container queries theo tên + style queries là pattern hữu ích cho widget nhúng vào theme storefront (như loyalty widget của Joy) — component tự thích ứng theo container thay vì viewport.
