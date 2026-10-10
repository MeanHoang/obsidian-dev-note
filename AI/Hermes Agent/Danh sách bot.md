## Trạng thái (kiểm 2026-10-05 11:44)
| # | Bot | Username | Profile Hermes | Trạng thái | Vai |
|---|---|---|---|---|---|
| 1 | Evil Morty | `@Evil_Morty_666_bot` | `default` | ✅ connected | Trợ lý chung + 2 cron Slack (`daily-report-9h`, `slack-mention-handler`) |
| 2 | Toxic Morty | `@Toxic_Morty_Bot` | `toxic-morty` | ✅ connected | Chưa giao |
| 3 | Morty Prime | `@Morty_Primee_Bot` | `morty-prime` | ✅ connected | Chưa giao |
| 4 | Cop Morty | `@Cop_Morty_Bot` | `cop-morty` | ✅ connected | Chưa giao |
| 5 | The One True Morty | `@The_One_True_Morty_Bot` | `true-morty` | ✅ connected | Chưa giao |

- Cả 5 bot chạy chung 1 gateway (launchd `ai.hermes.gateway.plist`). Chỉ Telegram ID `6357139656` (Mean Hoàng) nhắn được.
- 4 bot mới: clone model + skill từ `default`, **không** có token Slack, **không** có cron.
- Kiểm lại: `hermes profile list` · log `~/.hermes/profiles/<profile>/logs/gateway.log`.
- Kế hoạch chia vai: [[2-Kế hoạch nhiều bot (mỗi bot 1 việc)]].

---
Phân vai 
1.Con này tôi tính cấu hình lại thành chuyên xử lý check tin trên slack gồm 
-daily báo slack đc nhắc tên này 
-tự động nhận việc nếu task tên kiểu nếu mà thế vào sesion mửo work tree chạy skill bug check chế độ auto rồi báo lại vào thread cái này chắc xem lại skill 
2.Toxi morty con này tương tác chính tôi với máy tính kiểu tôi cầm đt và muốn ra và lệnh trên máy tính. Cần keiemr tra xem harness của bot này có thể với tới gì 
3.Morty prime còn này dùng sau 
4.Cop Morty 
Con này cron monitor cac staging của tôi dùng là 7 22 25 xem có gặp loop không có bị tràn hay gì tăng cloud chạy nheieuf ảnh hưởng đến billing không thì nó sẽ ngay lập tực dừng dịch vụ lại điều tra cơ chế để set up nhé 
5.Con này chưa nghỉ ra cứ tạm đó trong quá trình làm việc thì sẽ cập nhập thêm 

À tất cả bot phản hồi đêu tiếng việt nhé 