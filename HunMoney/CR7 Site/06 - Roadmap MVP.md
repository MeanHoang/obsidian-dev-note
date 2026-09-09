---
tags: [project, cr7, roadmap]
created: 2026-09-08
---

# 06 - Roadmap MVP

Nguyên tắc: **dữ liệu trước, giao diện sau.** Cái khó nhất và mất thời gian nhất là gom đủ 978 bàn cho sạch. Làm UI đẹp mà dataset rỗng thì vô nghĩa.

---

## Giai đoạn 0 — Chốt dataset (tuần 1-2) ← quan trọng nhất

- [ ] Chốt **chuẩn đếm** (tính trận nào, không tính trận nào) → viết ra thành file `methodology.md`
- [ ] Viết script Node crawl bảng bàn thắng từ Wikipedia → JSON
- [ ] Enrich phút / kiểu ghi bàn / assist từ nguồn thứ hai
- [ ] Đối chiếu tổng số với các site đếm công khai; nếu lệch thì tìm ra lệch ở đâu
- [ ] Xuất `goals.json` — **đây là tài sản của project**, mọi thứ khác đều có thể làm lại

> Nếu bước này thất bại (không gom nổi dữ liệu sạch) thì dừng project. Đừng làm tiếp UI.

## Giai đoạn 1 — Site tĩnh MVP (tuần 3-4)

- [ ] Astro + Tailwind, đọc từ `goals.json`
- [ ] Trang chủ: counter "978 / 1000" + 5 bàn gần nhất
- [ ] `/goals` — bảng đầy đủ, filter theo CLB / mùa / kiểu ghi bàn
- [ ] `/goal/[n]` — 978 trang chi tiết (chưa cần video)
- [ ] Trang `/methodology`, `/copyright`
- [ ] SEO: sitemap.xml, JSON-LD schema, Open Graph
- [ ] Deploy Cloudflare Pages + domain

**Mốc kiểm chứng:** submit sitemap lên Search Console, sau 2 tuần xem Google index được bao nhiêu trang. Nếu index tốt → đi tiếp. Nếu không → xem lại SEO trước khi đầu tư thêm.

## Giai đoạn 2 — Tự động cập nhật (tuần 5)

- [ ] Firestore + import `goals.json`
- [ ] Cloud Run Job: cron 6h/lần gọi API-Football, phát hiện bàn mới
- [ ] Có bàn mới → ghi Firestore + trigger rebuild Astro
- [ ] Island đọc Firestore cho counter live giữa các lần build

## Giai đoạn 3 — Video (tuần 6-7)

- [ ] Whitelist channelId các kênh chính chủ (Al Nassr, Real, MU, UEFA, FIFA, FPF, SPL)
- [ ] Script YouTube Data API tự tìm và gán video cho từng bàn — chỉ trong whitelist
- [ ] Review tay kết quả gán (máy sẽ gán sai kha khá)
- [ ] UI: YouTube facade (thumbnail + nút play), chỉ load iframe khi bấm

## Giai đoạn 4 — Khác biệt hoá (tuần 8+)

- [ ] Data viz: shot map, biểu đồ tích luỹ theo tuổi, phân bố phút ghi bàn — xem [[dataviz]]
- [ ] Animation SVG tái hiện bàn thắng cho các bàn không có video
- [ ] `/vs-messi` — trang so sánh (cụm từ khoá lớn nhất trong ngách này)
- [ ] PWA + push notification "Ronaldo vừa ghi bàn thứ N"
- [ ] Xin AdSense

---

## Cách quyết định dừng hay tiếp

| Thời điểm | Câu hỏi | Nếu KHÔNG thì |
|---|---|---|
| Cuối GĐ 0 | Có dataset sạch 978 bàn không? | Dừng |
| Cuối GĐ 1 + 2 tuần | Google index được > 500 trang không? | Sửa SEO trước khi làm tiếp |
| Cuối GĐ 3 | Có > 100 khách/ngày không? | Xem lại định vị, đừng đổ thêm công |
| Mốc 1000 bàn | Traffic có tăng đột biến không? | Đây là bài kiểm tra thật của cả project |

## Việc làm ngay hôm nay

1. Kiểm tra trang Wikipedia "List of career goals scored by Cristiano Ronaldo" xem bảng có đủ cột không
2. Đăng ký key free API-Football, gọi thử endpoint player statistics
3. Chọn domain (kiểm tra `cr7goals.com`, `ronaldoallgoals.com`, `every-cr7-goal.com`...)
