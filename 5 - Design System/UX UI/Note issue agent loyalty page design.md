1. Luôn luôn hero banner fullwidth còn lại ko nên trừ trươngf hợp shop chứ mặc định họ quá to thì tất cả block đều fulll width
2. Button và card màu khi hover thường trùng or cùng tông với màu text nên là rất khó nhìn. Đọc về màu tương phản để chọn màu. Cân nhắc màu parent nhìn khá sang 
3. preset cung cấp đày đủ animation đấy đọc và cân nhắc ko làm sơ sài 
4. Ko hiểu sao agent rất lười gen icon hãy gen icon nhiều hơn nhé không để mình text không rất sơ sài. Cái này chắc do thiếu update cdn vào để đưa link vào import đã cải theienj nhé note vào cho agent cải thiện harness nhé

Từng block này 
1. Hero banner 
- Luôn là overlay chữ không nên đặt giữa nên đưa ra dưới dùng trái phải nên
- 

---

## Re-audit Loyalty Page — 2026-08-28

**Trang:** `https://ag-mh-shop-staging25.myshopify.com/pages/contact`  
**Phạm vi:** khách chưa đăng nhập; desktop 1440px và mobile 390px.

### Đã cải thiện tốt

- Hero vẫn full-width, chữ đặt góc trái trên overlay và CTA có hierarchy rõ; đúng hướng mặc định cho hero.
- Header mobile không còn chồng logo lên menu/search như bản trước.
- FAQ đã giảm từ 10 câu lặp xuống đúng 5 câu. Trang mobile giảm từ khoảng **7.600px** xuống **5.125px**.
- Các card earning/reward hiện có icon minh hoạ đồng bộ thay vì chỉ có chữ; visual rhythm tốt hơn.
- FAQ vẫn là accordion đúng ngữ nghĩa (`aria-expanded` + vùng answer); mỗi trigger cao khoảng 53px, tốt cho chạm.
- Skeleton ở các block lazy-load **không bị kẹt**: khi cuộn block vào viewport, nội dung/icon xuất hiện trong khoảng 1,5 giây và không có console error. Không kết luận là lỗi chỉ từ ảnh full-page capture.

### Còn cần cải thiện

| Ưu tiên | Finding | Hướng xử lý |
|---|---|---|
| P1 | CTA phụ hero **“See What Points Get You”** đang dẫn đến Shopify login, dù phần rewards hiển thị công khai ngay bên dưới. | Cho CTA cuộn tới section rewards; nếu thực sự bắt buộc đăng nhập thì đổi copy cho đúng kỳ vọng, ví dụ “Sign in to view rewards”. |
| P1 | Đơn vị tiền tệ không nhất quán: promo dùng **RM**, currency selector là **USD**, rewards dùng `$5`, `$10` và `$1 spent`. | Lấy money format theo market/currency đang chọn, hoặc dùng copy trung tính nếu chưa có giá trị động. |
| P1 | Referral input label là **“Your email address”** nhưng placeholder là **“Their email address”**. | Chốt đối tượng cần nhập là người được mời hay người giới thiệu rồi đồng bộ label, placeholder, validation và lỗi. |
| P2 | Title browser/SEO vẫn là **“Contact”** và URL `/pages/contact`, nhưng navigation + nội dung là Loyalty Page. | Đổi title/meta sang “Arrae Rewards”; cân nhắc slug loyalty page để dễ tìm và tăng credibility. |
| P2 | Nút chuyển tier trên mobile là 36×36px. | Tăng hit area lên 44×44px theo target UX khuyến nghị; vẫn giữ icon nhỏ nếu cần. |
| P2 | “Ways to Earn” và rewards vẫn tạo trang dài trên mobile dù đã tốt hơn. | Chỉ khi cần tối ưu thêm: hiển thị các mục phổ biến trước, phần còn lại qua “View all”/accordion để progressive disclosure. |

### Kết luận

Không còn blocker giao diện như bản trước. Ưu tiên tiếp theo là sửa **CTA phụ**, **currency**, và **copy referral** trước khi coi trang hoàn chỉnh về UX.
