---
tags:
  - ux
  - ui
  - design-system
  - moc
type: map-of-content
created: 2026-08-23
---

# 🗺️ UX/UI Roadmap cho Dev SaaS — Mục lục (MOC)

> [!abstract] Bộ tài liệu này dành cho ai?
> Dành cho **web developer chuyên SaaS** muốn tự làm được app **đẹp + dễ dùng** mà không cần thuê designer. Không dạy bạn thành designer — dạy bạn đủ nguyên tắc **có tên gọi chuyên môn** để ra quyết định thiết kế có cơ sở, và tra cứu lại nhanh.

## 🧭 Cách đọc

Đọc theo thứ tự số. Mỗi chương là 1 note độc lập, có tên nguyên tắc rõ ràng để search lại (Ctrl+O trong Obsidian). Ba tầng kiến thức:

1. **Tư duy & tâm lý học** (Ch. 1–2): *tại sao* con người dùng giao diện theo cách họ dùng.
2. **Visual craft** (Ch. 3–6): *cách* làm cho pixel đẹp — hierarchy, typography, color, spacing.
3. **Áp dụng thực chiến** (Ch. 7–10): component, accessibility, đặc thù SaaS, quy trình & tool.

## 📚 Danh sách chương

| # | Chương | Nội dung cốt lõi |
|---|--------|------------------|
| 1 | [[01 - Nền tảng tư duy UX]] | User-Centered Design, UX vs UI, Mental Model, Double Diamond |
| 2 | [[02 - Laws of UX - Nguyên tắc tâm lý học]] | Hick, Fitts, Miller, Jakob, Gestalt, Peak-End, Tesler… |
| 3 | [[03 - Visual Hierarchy & Layout]] | Visual Hierarchy, Emphasis, Grid, Alignment, Whitespace |
| 4 | [[04 - Typography]] | Type Scale, Line Height, Measure, Font Pairing |
| 5 | [[05 - Color & Theming]] | HSL, Palette, Contrast, Grayscale-first, Dark Mode |
| 6 | [[06 - Spacing & Design Tokens]] | 8-Point Grid, Spacing Scale, Design Tokens |
| 7 | [[07 - Components & Interaction Design]] | Component States, Feedback, Micro-interaction, Motion |
| 8 | [[08 - Accessibility (a11y)]] | WCAG, Contrast Ratio, Keyboard Nav, ARIA, Focus |
| 9 | [[09 - UX cho SaaS]] | Onboarding, Empty State, Pricing, Dashboard, Activation |
| 10 | [[10 - Design Process & Tools]] | Research, Wireframe, Prototype, Usability Test, Figma |

## ✅ Checklist "app của tôi có đẹp & dễ dùng không?"

- [ ] Có **visual hierarchy** rõ: user biết nhìn vào đâu trước ([[03 - Visual Hierarchy & Layout]])
- [ ] Spacing nhất quán theo scale, không "số lẻ" tùy hứng ([[06 - Spacing & Design Tokens]])
- [ ] Type scale giới hạn, contrast đạt WCAG AA ([[04 - Typography]], [[08 - Accessibility (a11y)]])
- [ ] Mọi action có đủ **states** (hover/focus/disabled/loading/error) ([[07 - Components & Interaction Design]])
- [ ] Giảm **cognitive load**: ít lựa chọn mỗi lúc (Hick's Law) ([[02 - Laws of UX - Nguyên tắc tâm lý học]])
- [ ] Có **empty state** & **onboarding** dẫn tới "aha moment" ([[09 - UX cho SaaS]])

---
> 🤖 Bộ note được tổng hợp từ roadmap UX/UI 2026 (Laws of UX, Refactoring UI, UX Design Institute, NN/g) và review lại tính đúng đắn bởi agent kiểm định.
