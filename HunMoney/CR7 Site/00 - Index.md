---
tags: [project, cr7, web]
status: idea
created: 2026-09-08
---

# CR7 Site — Trang tổng hợp bàn thắng Cristiano Ronaldo

> Ý tưởng gốc: clone mô hình [messiallgoals.com](https://messiallgoals.com/) nhưng cho Ronaldo.
> Điểm bán khác biệt tiềm năng: **CR7 đang ở 978 bàn, còn 22 bàn nữa là chạm mốc 1000** → có một sự kiện lịch sử để "cưỡi sóng" traffic.

## Các note trong project

| Note | Nội dung |
|---|---|
| [[01 - Ý tưởng & định vị]] | Trang này là gì, khác đối thủ ở đâu, kiếm tiền kiểu gì |
| [[02 - Nguồn dữ liệu]] | Lấy số liệu bàn thắng/kiến tạo ở đâu, chi phí, cách sync |
| [[03 - Nguồn video & bản quyền]] | Câu hỏi khó nhất: video lấy đâu, có bị DMCA không |
| [[04 - Kiến trúc kỹ thuật]] | Stack, sơ đồ, chi phí hạ tầng |
| [[05 - Đối thủ & tính khả thi]] | Ai đã làm rồi, mình chen vào chỗ nào |
| [[06 - Roadmap MVP]] | Làm gì trước, làm gì sau |

## TL;DR kết luận khả thi

- **Số liệu**: dễ. Có API trả phí rẻ ([API-Football](https://www.api-football.com/pricing) free 100 req/ngày, Pro $19/tháng) + nguồn public (Wikipedia, FBref) để đối chiếu.
- **Video**: đây là chỗ chết. Bản quyền thuộc league/đài truyền hình. Self-host = ăn DMCA sớm muộn. → Nên đi hướng **embed YouTube từ kênh chính chủ** + tự làm nội dung phái sinh (shot map, animation, data viz) thay vì host clip.
- **Cạnh tranh**: đã có ít nhất 3 site Ronaldo đang chạy (xem [[05 - Đối thủ & tính khả thi]]). Không phải sân trống, nhưng cả 3 đều **chỉ có số, không có video** → còn khe hở.
- **Kết luận**: làm được, nhưng đừng định vị là "kho video lậu". Định vị là **"data + video hợp pháp + trải nghiệm đẹp"**.
