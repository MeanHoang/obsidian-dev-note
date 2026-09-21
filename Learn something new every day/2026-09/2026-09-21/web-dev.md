# 🌐 Web Dev & Craft — 2026-09-21

> React 19.3 chốt View Transitions + Fragment Refs, CSS Anchor Positioning mở ra animation cho grid reflow, pnpm và Chrome đều tăng tốc nhịp release.

## ⭐ [React 19.3](https://react.dev/blog/2026/09/09/react-19-3) — (react.dev, 09/09/2026)
**Đây là gì:** Bản minor mới của React, đưa một loạt API từ experimental lên stable — đáng chú ý nhất là `<ViewTransition>` (animation khi element vào/ra/di chuyển) và Fragment Refs (gắn ref thẳng vào `<Fragment>`).
**Chi tiết:**
- `<ViewTransition>` stable: bọc component để animate dựa trên View Transition API của browser. Chỉ chạy khi update được đánh dấu là Transition (`startTransition`, `Suspense` reveal, `useDeferredValue`). Có 4 loại animation: enter, exit, update, share. Thêm `addTransitionType` để đổi animation theo nguyên nhân transition (ví dụ carousel đi tới vs đi lui).
- Fragment Refs stable: `<Fragment ref={fragmentRef}>` trả về một `FragmentInstance` với các method như `addEventListener`, `focus`, `focusLast`, `observeUsing`, `getClientRects`, `scrollIntoView` — thao tác trên nhóm children như một khối mà không cần thêm div bọc hay sửa nội bộ component con.
- API mới `browser()` (từ `react-dom`): gọi `use(browser())` để opt-out component khỏi server-side rendering — trên server nó trigger Suspense, trên client thì không. Hợp cho code phụ thuộc API browser (ví dụ `Intl.DateTimeFormat().resolvedOptions().timeZone`).
- Server Components giờ render được `<Context>` trực tiếp (context import từ module `'use client'`), bỏ được lớp Provider wrapper riêng. Kèm hỗ trợ Trusted Types: React truyền thẳng `TrustedHTML`/`TrustedScript`/`TrustedScriptURL` xuống DOM API, không coerce — chạy được với CSP `require-trusted-types-for 'script'`.
- Hiệu năng: Transitions được render độc lập thay vì entangle nhau (một Transition chậm không chặn các Transition khác); update từ event `resize` được batch tới frame kế tiếp. Bài viết không nêu breaking change.
**Vì sao đáng đọc:** Joy Loyalty đang dùng React cho Polaris admin UI — `<ViewTransition>` và batch resize là thứ cải thiện cảm giác mượt của widget/modal mà gần như không phải viết thêm state logic.

## ⭐ [Animating CSS Grid Layouts with CSS Anchor Positioning](https://www.bram.us/2026/09/07/animating-css-grid-layouts-with-css-anchor-positioning/) — (bram.us, 07/09/2026)
**Đây là gì:** Bramus (Chrome DevRel) chỉ cách làm grid tự animate khi reflow lúc resize viewport — thứ CSS Grid vốn không làm được vì grid track không transition — bằng CSS Anchor Positioning, không JavaScript, không View Transitions.
**Chi tiết:**
- Vấn đề gốc: grid cell là khái niệm "ảo", không thể anchor nội dung vào nó. Giải pháp là thêm một lớp div bọc bên trong mỗi cell, div này chiếm trọn không gian cell và đóng vai trò anchor.
- Cặp `anchor-name: --a` + `anchor-scope: --a` cho phép mọi cell dùng lại cùng một tên anchor mà không đụng nhau, vì scope bị giới hạn trong subtree của từng cell.
- Phần content dùng `position: absolute`, `position-anchor: --a`, `inset: anchor(inside)` để bám vào anchor; `aspect-ratio: 1` giữ cell vuông khi grid co giãn.
- Animation đến từ `transition: inset 0.2s ease` — không phải grid item di chuyển, mà là con của nó trượt theo vị trí cell mới. Kết quả interruptible hoàn toàn.
- Lưu ý bẫy: content div phải khai báo `width`/`height` rõ ràng, nếu không element sẽ bị méo trong lúc interpolate qua các bước resize.
**Vì sao đáng đọc:** Mẫu pattern sạch cho bất kỳ grid sản phẩm/reward nào cần reflow mượt, và là ví dụ tốt để hiểu `anchor-scope` — phần khó nhất của Anchor Positioning.

## [pnpm 12.5](https://pnpm.io/blog/releases/12.5) — (pnpm.io, 18/09/2026)
**Đây là gì:** Bản release mới nhất của pnpm 12 (phiên bản đã viết lại bằng Rust), tiếp tục mở rộng pnpm từ package manager JS thành công cụ quản lý workspace đa ngôn ngữ.
**Chi tiết:**
- Python support sâu hơn: chọn interpreter theo từng project dựa trên `requires-python`, tự tải python-build-standalone khi thiếu, cài editable package cho project có `[build-system]`, và tùy chọn gộp workspace về một `pylock.toml` chung.
- `pnpm add` giờ nhận Package URL kiểu `pkg:npm/express@4.18.2`; có registry riêng theo ecosystem (npm, cargo, PyPI) định tuyến theo tên package.
- Thêm `allowBuilds` để duyệt build backend, concurrency group giới hạn task song song ở mức toàn máy, tool mirror cho Node.js/Bun/Python, và `pnpm cache prune` dọn metadata registry cũ.
**Vì sao đáng đọc:** Nếu repo Joy có phần script Python/tooling ngoài Node, pnpm đang dần thay thế nhu cầu phải có nhiều package manager song song trong một workspace.

## [Fresher features, faster fixes: The two-week release cycle is here](https://developer.chrome.com/blog/chrome-two-week-start) — (developer.chrome.com, 08/09/2026)
**Đây là gì:** Chrome chính thức chuyển từ chu kỳ release 4 tuần sang 2 tuần, bắt đầu từ Chrome 153 trên Desktop, Android và iOS.
**Vì sao đáng đọc:** Feature web platform đến tay user nhanh gấp đôi nhưng mỗi bản nhỏ hơn nên dễ khoanh vùng regression; Chrome 154 stable dự kiến 22/09 — đáng lưu lịch nếu app embed vào storefront cần test cross-version, và Extended Stable (8 tuần) vẫn còn cho môi trường enterprise.
