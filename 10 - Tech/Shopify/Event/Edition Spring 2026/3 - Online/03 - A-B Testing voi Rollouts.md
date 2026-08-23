# A/B Testing voi Rollouts - Editions Spring 2026

Rollouts cho phép publish theme mới, checkout configuration, hoặc customer accounts setup theo lịch hẹn giờ hoặc dưới dạng A/B test. Đây là feature quan trọng giúp merchant đưa ra quyết định dựa trên data.

---

## Rollouts la gi?

Rollouts là tính năng cho phép merchant schedule controlled changes cho online store. Có 2 chế độ:

1. **Launch** - deploy changes ngay lập tức hoặc vào thời điểm đã lên lịch
2. **Experiment** - chạy A/B test giữa treatment và control group

> "A treatment is the group of customizations applied to the rollout" while "the control is the unmodified version of your changes."

---

## Nhung gi co the test?

| Loại thay đổi | Mô tả |
|---------------|--------|
| **Theme modifications** | Edit hoặc replace main theme |
| **Checkout & accounts** | Replace checkout configuration |
| **Localization** | Content và language changes (cần translation app tương thích) |

**Lưu ý:** Editing main theme không hỗ trợ content changes; phải **replace** theme mới hỗ trợ.

---

## Scheduling

Merchant có thể "prepare seasonal updates, sales, or campaigns in advance and schedule them to launch at a specific time."

**Gradual rollout:** Changes có thể deploy cho tất cả visitors cùng lúc hoặc incremental bằng configurable launch reach percentage.

---

## Scheduling and testing for localized themes

Kết hợp theme localization với Rollouts:
1. Dịch theme sang ngôn ngữ/nội dung phù hợp cho từng market
2. Lên lịch publish theme đã localize vào thời điểm cụ thể
3. Hoặc chạy A/B test giữa theme gốc và theme đã localize

Yêu cầu sử dụng Shopify Markets và translation app tương thích.

---

## Availability

| Plan | Rollouts (launch) | Experiments (A/B test) |
|------|-------------------|----------------------|
| Basic | Co | Khong |
| Grow | Co | Co |
| Advanced | Co | Co |
| Plus | Co | Co |

- **Basic plan trở lên:** có thể dùng rollouts để schedule changes
- **Grow plan trở lên:** có thể chạy experiments (A/B test)

---

## Limitations

- Chỉ hỗ trợ **online store checkouts**; headless và custom storefronts KHÔNG hỗ trợ
- Mỗi rollout chỉ cho phép **1 change type per category**
- Metrics và analytics khác nhau tùy loại (launch vs experiment), docs chưa chi tiết cụ thể metrics nào

---

## Permissions

Owners, administrators, và users có permission **Markets > Rollouts** mới có thể quản lý rollouts.

---

## Nguon

- [Rollouts docs](https://help.shopify.com/en/manual/markets-new/rollouts)
- [Shopify Editions Spring 2026](https://www.shopify.com/editions/spring2026) - truy cap 2026-07-29
