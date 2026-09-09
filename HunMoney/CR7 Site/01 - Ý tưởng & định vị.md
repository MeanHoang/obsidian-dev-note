---
tags: [project, cr7, idea]
created: 2026-09-08
---

# 01 - Ý tưởng & định vị

## Trang này là gì

Một trang web (SPA + PWA) tra cứu **toàn bộ sự nghiệp ghi bàn của Cristiano Ronaldo**:
- Mỗi bàn thắng = 1 "thẻ": số thứ tự, ngày, đối thủ, giải, phút, kiểu bàn (chân trái/phải/đầu/phạt đền/đá phạt), người kiến tạo, video (nếu có).
- Bộ lọc: theo CLB (Sporting → MU → Real → Juventus → MU → Al Nassr), theo mùa, theo giải, theo kiểu ghi bàn, theo thủ môn bị thủng lưới.
- Bộ đếm live "Road to 1000" + đếm ngược số bàn còn lại.
- Trang thống kê: hat-trick, đá phạt, bàn ở Champions League, bàn quyết định...

## Vì sao bây giờ là đúng thời điểm

Tính đến **07/09/2026**, Ronaldo có **978 bàn / 1.334 trận** cho CLB + ĐTQG, **291 kiến tạo**, còn **22 bàn** nữa là chạm 1.000 (theo [theroadto1000goals.com](https://theroadto1000goals.com/)). Anh vẫn đang thi đấu ở tuổi 41 cho Al Nassr và Bồ Đào Nha, có **146 bàn** cho ĐTQG — kỷ lục thế giới.

→ Mốc 1000 là một **sự kiện có ngày hết hạn**. Khi nó xảy ra, lượng search sẽ nổ. Ai đã có sẵn trang xếp hạng tốt sẽ hốt.
→ Nhưng cũng là con dao hai lưỡi: sau mốc 1000, traffic tụt. Phải có nội dung sống lâu (evergreen) chứ không chỉ counter.

## Định vị: khác gì đối thủ

Ba site Ronaldo đang chạy đều thiên về **số liệu khô**. Không site nào có thư viện video.
Còn messiallgoals thì mạnh video nhưng phần data lại mỏng.

→ Khe hở: **"mỗi bàn thắng là một trang có cả số liệu, ngữ cảnh và hình ảnh"**.

Ba thứ nên đầu tư mà đối thủ không có:
1. **Data viz** — shot map, heatmap phút ghi bàn, biểu đồ tích luỹ theo tuổi, so sánh Ronaldo vs Messi theo cùng số tuổi. Xem [[dataviz]] khi làm phần này.
2. **Trang chi tiết cho từng bàn** — SEO long-tail cực mạnh ("ronaldo goal vs juventus bicycle kick 2018"). 978 bàn = 978 trang có thể index.
3. **Nội dung tự sản xuất** — animation tái hiện bàn thắng bằng SVG/canvas (không dính bản quyền), thay vì clip lậu.

## Kiếm tiền kiểu gì

| Cách | Ghi chú |
|---|---|
| Google AdSense / Ezoic | Dễ nhất, cần traffic. Nhưng site có clip lậu thì AdSense có thể từ chối. |
| Affiliate | Áo đấu, giày Nike Mercurial, vé xem trận, sách/tiểu sử |
| Bán dữ liệu / API | Có dataset sạch 978 bàn là tài sản, có thể mở API trả phí cho dev khác |
| Merch print-on-demand | Poster "978 goals" tự sinh từ data viz |

**Rủi ro doanh thu:** nếu đi hướng clip lậu → không xin được AdSense, không làm affiliate nghiêm túc được. Đây là lý do nữa để chọn hướng hợp pháp ngay từ đầu (xem [[03 - Nguồn video & bản quyền]]).
