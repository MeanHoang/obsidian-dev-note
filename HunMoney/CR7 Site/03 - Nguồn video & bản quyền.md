---
tags: [project, cr7, legal, video]
created: 2026-09-08
---

# 03 - Nguồn video & bản quyền

> Đây là câu hỏi khó nhất của cả project, và là chỗ quyết định site sống hay chết.

## Thực tế pháp lý

- Bản quyền footage trận đấu thuộc về **ban tổ chức giải hoặc đài giữ bản quyền phát sóng**. Dùng footage không xin phép = xâm phạm bản quyền. ([UpNorth Productions](https://www.upnorthproductions.co.uk/copyright-laws-navigating-the-legal-landscape-of-football-highlights-videos))
- Các giải đấu **chủ động dùng DMCA** để yêu cầu YouTube và các host video gỡ clip. Premier League đặc biệt gắt — upload dễ ăn strike và bay kênh.
- Fair use có tồn tại, và bên giữ bản quyền **bắt buộc phải cân nhắc fair use trước khi gửi DMCA**, nhưng dùng **phi thương mại** mới được xét thuận lợi. ([Public Citizen](https://www.citizen.org/article/a-guide-to-fair-use-in-posting-soccer-video-clips/)) → Site có quảng cáo = thương mại = fair use yếu đi rất nhiều.
- Về **embed**: toà án Mỹ **chưa có kết luận dứt khoát** việc blogger có chịu trách nhiệm khi embed video vi phạm hay không. ([Harvard Cyberlaw](https://cyber.harvard.edu/node/93724)) → Embed an toàn hơn self-host, nhưng không phải miễn nhiễm tuyệt đối.

## messiallgoals làm thế nào?

Đọc CSP header của họ thấy rõ mô hình:
- `media-src 'self' blob: https://cdn.messiallgoals.com` → họ **tự host video trên CDN riêng**
- `frame-src ... https://www.youtube.com https://www.youtube-nocookie.com` → đồng thời có **embed YouTube**
- Trang có meta disclaimer: *"All video content belongs to their respective owners. This site is for educational and entertainment purposes only."*

→ Họ đi hướng lai: self-host clip + embed YouTube + disclaimer.
**Disclaimer kiểu này về mặt pháp lý gần như vô giá trị** — nó không biến việc dùng trái phép thành hợp pháp. Họ đang chấp nhận rủi ro, không phải đã giải quyết rủi ro.

---

## Bốn hướng đi, xếp theo rủi ro

### 1. Self-host clip trên CDN riêng — RỦI RO CAO ❌
Giống messiallgoals. Được cái trải nghiệm mượt, không phụ thuộc YouTube.
Mất: hosting video tốn tiền (bandwidth), và mình là bên host trực tiếp → là mục tiêu DMCA đầu tiên, có thể bị takedown cả domain, và không xin được AdSense.
**Không khuyến nghị.**

### 2. Embed YouTube từ kênh CHÍNH CHỦ — AN TOÀN ✅
Chỉ embed video từ kênh chính thức: Al Nassr, Real Madrid, Man Utd, UEFA, FIFA, Portugal FPF, Saudi Pro League.
- Các CLB **muốn** video của họ được lan toả → embed là điều họ khuyến khích
- Nếu video gốc bị gỡ, mình chỉ hiện placeholder, không bị liên đới
- **Đây nên là hướng chính.**

Hạn chế thật: các kênh chính chủ **không có đủ** 978 bàn, nhất là giai đoạn Sporting/MU 2003-2009 (thời đó YouTube còn chưa có/chưa phổ biến). → Chấp nhận: phủ khoảng 40-60% số bàn, phần còn lại thay bằng nội dung tự sản xuất (mục 4).

### 3. YouTube Data API để tự tìm video — BỔ TRỢ ⚠️
Dùng YouTube Data API v3 search với query kiểu `"Ronaldo goal vs Juventus 2018"`, lọc theo `channelId` nằm trong whitelist kênh chính chủ.
- Tự động hoá được việc gán video cho từng bàn
- Quota free 10.000 unit/ngày, mỗi search tốn 100 unit → 100 search/ngày, đủ để backfill dần trong ~10 ngày
- **Bắt buộc whitelist channelId.** Nếu để nó tự tìm kênh nào cũng được thì mình lại quay về hướng 1 nhưng gián tiếp.

### 4. Nội dung TỰ SẢN XUẤT — không dính bản quyền ✅✅
Đây là hướng khác biệt hoá, và là thứ đối thủ không có:
- **Animation SVG/Canvas tái hiện bàn thắng** — sơ đồ sân, đường chạy, vị trí sút, quỹ đạo bóng. Dữ liệu vị trí là *fact*, không có bản quyền.
- **Shot map / heatmap** từ dữ liệu xG
- **Ảnh có license mở** — Wikimedia Commons có ảnh CC của Ronaldo
- **Bình luận text tự viết** cho từng bàn

Vì sao hướng này đáng đầu tư: nó vừa an toàn pháp lý, vừa là thứ Google thích (nội dung gốc, không trùng lặp), vừa không tốn bandwidth video.

---

## Khuyến nghị

**Đi hướng 2 + 4 làm lõi, dùng 3 để tự động hoá. Bỏ hẳn hướng 1.**

Cụ thể trên UI mỗi bàn thắng:
- Có video chính chủ → nhúng `youtube-nocookie` embed
- Không có → hiện animation tự sản xuất + số liệu + mô tả text

Ngoài ra:
- Trang `/methodology` và `/copyright` ghi rõ nguồn dữ liệu, license Wikipedia (CC BY-SA), chính sách video
- Có **quy trình nhận DMCA** thật (email liên hệ, cam kết gỡ trong 48h) — không phải disclaimer suông
- Không bao giờ mirror/rehost file video của bên khác

> Nói thẳng: nếu mục tiêu là kiếm traffic nhanh bằng clip lậu thì mô hình đó chạy được vài tháng rồi chết, và không kiếm được tiền quảng cáo tử tế. Hướng 2+4 chậm hơn nhưng xây được tài sản.
