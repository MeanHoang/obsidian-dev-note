# DiscountCodeBasic vs DiscountCodeApp — vì sao Shopify có 2 loại?

Đây là 2 "thế hệ" discount khác nhau: **declarative** (khai báo config, Shopify chạy) vs **programmable** (app tự chạy logic).

## 1) `DiscountCodeBasic` — discount native, logic do Shopify chạy

- Loại discount chuẩn của Shopify: "giảm X% / X đồng cho sản phẩm Y, điều kiện tối thiểu Z".
- Logic tính giảm giá **Shopify tự thực thi** ở checkout — người tạo (merchant trong Admin, hoặc app qua mutation `discountCodeBasicCreate`) chỉ **khai báo cấu hình**.
- Cấu hình nằm trong data model của Shopify → **ai cũng đọc được** qua API: `customerGets` (giảm gì), `minimumRequirement` (điều kiện), `customerSelection` (áp cho ai)...
- Giới hạn: chỉ làm được những gì Shopify hỗ trợ sẵn. Logic kiểu "giảm 5% mỗi khi mua thêm 2 sản phẩm, cộng dồn tối đa 20%, trừ ngày lễ" → chịu.
- Cùng họ: `DiscountCodeBxgy` (buy X get Y), `DiscountCodeFreeShipping`.

## 2) `DiscountCodeApp` — discount custom, logic do app chạy (Shopify Functions)

- Sinh ra để giải giới hạn ở trên: app viết **code riêng** (một Shopify Function, compile ra WASM) quyết định giảm bao nhiêu, cho ai, điều kiện gì. Shopify chạy function đó ở checkout.
- Với Shopify, nó là **hộp đen**: Shopify chỉ biết "có discount này, gắn với `functionId` kia" — không biết bên trong giảm gì. Cấu hình (nếu có) app tự lưu trong metafield namespace `$app:` của mình.
- Vì vậy API chỉ expose `title`, `code`, `status`, `appDiscountType` — **không có `customerGets`**, vì bản thân Shopify cũng không biết value là gì cho đến lúc function chạy.
- Bản automatic tương ứng: `DiscountAutomaticApp`.

## 3) So sánh nhanh

| | `DiscountCodeBasic` | `DiscountCodeApp` |
|---|---|---|
| Logic giảm giá | Shopify thực thi, theo config khai báo | Function của app thực thi (WASM) |
| Độ linh hoạt | Chỉ các kiểu Shopify hỗ trợ sẵn | Tuỳ ý, code gì cũng được |
| App khác đọc được value? | ✅ (`customerGets`...) | ❌ (hộp đen, config trong `$app:` metafield) |
| Ai hay tạo | Merchant trong Admin, app đơn giản | App bundle/upsell/loyalty có logic phức tạp |

## 4) Liên quan tới Joy

Vì `DiscountCodeApp` là hộp đen nên mới có rào cản trong ý tưởng [[Hiển thị discount của app khác trong ví Joy]]: Shopify còn không biết discount đó giảm gì, thì Joy càng không đọc được — chỉ hiện được title/code, mô tả chi tiết phải để merchant bổ sung.
