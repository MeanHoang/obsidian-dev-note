---
tags: [project, cr7, research]
created: 2026-09-08
---

# 05 - Đối thủ & tính khả thi

## Sân này đã có người chơi

Khảo sát ngày 08/09/2026 — có ít nhất 3 site Ronaldo đang chạy:

### 1. [cr1000goals.com](https://cr1000goals.com/) — "Cristiano Ronaldo Goal Counter"
- Title: *"Cristiano Ronaldo Goal Counter — Live Career Goals Tracker | Road to 1000"*
- Định vị: bộ đếm live, tự cập nhật sau mỗi trận
- Dữ liệu: API-Football
- Hạ tầng: server `RHProxy`
- **Không có video**

### 2. [ronaldostats.app](https://ronaldostats.app/) — "Ronaldo Stats"
- Title: *"Ronaldo Stats Broken Down by Club, Season and Year"*
- Định vị: bóc tách số liệu theo 6 CLB, cộng free kick / penalty / hat-trick
- Hạ tầng: **GitHub Pages** (server: GitHub.com) → site tĩnh, chi phí $0, cập nhật thủ công
- Có cấu trúc trang con theo từng năm (`2002: 5 goals`, `2003: 1 goal`...) → đang ăn long-tail
- **Không có video**

### 3. [theroadto1000goals.com](https://theroadto1000goals.com/)
- Title: *"Cristiano Ronaldo Career Goals — Total Goals & Road to 1,000 (2026)"*
- Hạ tầng: Netlify
- **Không có video**

## Đọc ra được gì

**Tin xấu:** không phải sân trống. Cả 3 đều đã tối ưu SEO cho đúng cụm từ khoá mình định nhắm ("total goals", "road to 1000"). Chen vào cụm đó tốn công.

**Tin tốt:**
1. **Không site nào có thư viện video.** Đây là khe hở rõ ràng — messiallgoals chứng minh mô hình video có khách, nhưng chưa ai làm cho Ronaldo.
2. **Không site nào có trang riêng cho từng bàn.** Cả 3 đều là vài trang tổng hợp. Mình có 978 trang thì chiếm được lớp long-tail sâu hơn hẳn.
3. Cả 3 đều đơn giản về mặt kỹ thuật (một site chạy GitHub Pages, cập nhật tay). Rào cản gia nhập thấp → nghĩa là mình vào được, nhưng cũng nghĩa là người khác vào được.
4. Sự tồn tại của cả 3 **chứng minh có nhu cầu** — không ai bỏ công làm site cho một chủ đề không ai search.

## Rủi ro thật sự

| Rủi ro | Mức | Xử lý |
|---|---|---|
| DMCA nếu host clip | Cao | Không host clip — xem [[03 - Nguồn video & bản quyền]] |
| Ronaldo giải nghệ / đạt mốc 1000 rồi traffic tụt | Trung bình | Xây nội dung evergreen (từng bàn, so sánh, lịch sử) chứ không chỉ counter |
| Số liệu sai lệch giữa các nguồn | Trung bình | Chọn 1 chuẩn, công khai ở `/methodology` |
| API-Football đổi giá / ngừng free tier | Thấp | Dữ liệu nằm trong Firestore của mình, đổi provider không mất data |
| Không cạnh tranh nổi SEO với 3 site kia | Trung bình | Không đối đầu trực diện ở "total goals"; đánh long-tail từng bàn + video |

## Kết luận

**Khả thi.** Chi phí gần bằng 0, stack đã quen, dữ liệu có nguồn hợp pháp, và có một khe hở thật (video + trang chi tiết từng bàn) mà đối thủ chưa lấp.

Điều kiện: **không đi đường tắt bằng clip lậu.** Nếu đi đường đó thì bài toán đổi từ "xây tài sản" sang "chạy đua với DMCA", và mình sẽ thua.
