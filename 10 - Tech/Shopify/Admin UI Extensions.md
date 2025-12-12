https://shopify.dev/docs/api/admin-extensions/2025-07
Admin UI Extensions là công nghệ cho phép mở rộng giao diện Shopify Admin, giúp hiển thị các chức năng của app một cách có ngữ cảnh (contextual) ngay trong giao diện quản trị của Shopify.

## 🏗️ Kiến Trúc & Cách Hoạt Động

Extensions có thể được đặt ở nhiều vị trí khác nhau trong Shopify Admin:
- Product details pages (admin.product-details.block.render)
- Action extensions
- Customer account pages
- Order pages
- Và nhiều vị trí khác

Phải tuân thủ thiết kế theo 
https://shopify.dev/docs/api/admin-extensions/latest/polaris-web-components
https://shopify.dev/docs/apps/build/admin/actions-blocks
https://shopify.dev/docs/api/admin-extensions/components -UI
https://shopify.dev/docs/api/customer-account-ui-extensions/latest/using-polaris-components.com

- `s-*` **≠ div**
- Không custom layout / CSS phức tạp trong Admin Extension
 - https://community.shopify.dev/t/fetch-customer-data-in-custom-ui-extension/14947
 - https://community.shopify.dev/t/how-do-i-modify-the-styles-of-admin-ui-extensions/1930
- Shopify **cố tình giới hạn UI**
- Admin extension → _data & action_, không phải design
- **Admin UI Extensions không phải UI canvas**  
👉 Nó là **form-driven / data-driven UI**  
👉 Chỉ render cái mà Shopify định nghĩa là “Admin concept”
➡️ **Admin Extension KHÔNG chạy trong browser sandbox như web bình thường**  
➡️ Shopify **chặn toàn bộ Clipboard API + DOM hacks**
# Khi nào nên dùng mỗi cách?
### ✅ Dùng `<Button />` (React)
- App mới
- Dùng TypeScript
- Muốn code ngắn, ít bug
### ✅ Dùng `<s-button>` (như bạn)
- App cũ
- Dùng Preact
- Custom flow
- Muốn full control

