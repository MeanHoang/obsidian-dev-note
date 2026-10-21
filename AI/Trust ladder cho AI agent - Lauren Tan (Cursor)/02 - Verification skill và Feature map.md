---
tags: [ai, ai-coding, agent, verification, skill]
source: https://www.youtube.com/watch?v=EWSUvEyFwjc
timestamp: "05:53–13:27"
---

# 02 · Verification skill và Feature map

← [[01 - Trust curve - Từ micromanage tới auto-merge]] · Tiếp → [[03 - Pstack - Biến lỗi agent thành skill và eval]]

> [!quote] 💬
> Kỹ năng quan trọng nhất trong hộp đồ nghề khi làm với agent là **verification**.

---

## 🎯 Verification là gì (theo Lauren)

- Agent **tự chạy code thật**: chạy app, lấy CPU trace, heap snapshot, mở iOS simulator… tức là dùng app theo đúng cách user của mình dùng.
- Đây là thứ **khép kín vòng lặp** (close the loop).
- Verification **không đảm bảo code tốt**, nhưng giúp agent viết **code đúng**. Đó là bước tiến lớn để tin agent.

---

## 🐢 Câu chuyện: tuần đầu ở Cursor, không có verification

1. Lauren định vào team cloud agents, nhưng có nhiều kinh nghiệm React nên được kéo sang **agents window** (một app React/Electron), deadline launch còn khoảng 1 tuần.
2. Phải sửa performance. Lauren tự mở Chrome DevTools, lấy trace, đọc flame graph, trong khi codebase còn hoàn toàn lạ.
3. Agent cũng mù như vậy: Lauren chụp màn hình, tải trace gửi cho nó, nó "đoán là cái này", tự tin khẳng định. Sửa xong thì không phải.
4. Kết quả: rất chậm.

> [!note] 📝 So sánh dễ hiểu: mình là "người kiểm tra" duy nhất
> Không có verification skill thì **mình chính là verifier**, và là **nút thắt cổ chai**:
> giao việc → agent viết code → mình mở bản dev local → "không chạy" → copy screenshot/console error dán vào → agent sửa dần → lặp lại.
> Mình bị kẹt trong vòng lặp nên **không song song hoá được**.

---

## 🔧 Skill `control glass`

- Một trong những skill đầu tiên Lauren viết ở Cursor. "Glass" là code name nội bộ của agents window.
- Bản thân code của skill **không có gì đặc biệt**, agent có thể tự viết cho mình.
- Ý tưởng: dạy agent điều khiển app bằng lập trình:
  - Electron / web app → qua **Chrome DevTools Protocol (CDP)**.
  - iOS → qua tiện ích của Apple để chạy simulator, lấy trace, điều khiển app.

---

## 🗺️ Feature map — phần đắt nhất của skill

**Vấn đề:** có skill rồi, agent chạy được app và lấy trace, nhưng **không biết app có gì**.
- Ai đó báo "sidebar trái bị lag" hoặc "tab PR bên phải không chạy" → agent loay hoay tìm code, không biết đi tới tính năng đó trên UI bằng cách nào.
- Agent spawn được bản dev build rồi đứng đó "thử click chỗ này" → trải nghiệm tệ, gần như vô dụng.

**Giải pháp:** một file **feature map** đi kèm skill, chỉ cho agent cách tới **mọi tính năng**. Ví dụ với sidebar, map ghi:
- Sidebar là gì, có những tính năng con nào.
- Từ góc nhìn user: đi tới nó bằng cách nào.
- Các phím tắt.
- DOM element / attribute dùng để select qua CDP.

> [!tip] 💡 Lợi ích với report "chất lượng thấp"
> Cursor có kênh Slack nhận feedback. Nhiều report chỉ là **1 screenshot kèm "???"**.
> Không có feature map → agent bó tay. Có feature map → agent map được report mơ hồ (kể cả chỉ là ảnh) sang đúng tính năng và cách tới nó.

---

## 📦 Tự làm cho mình

- Plugin **Pstack** của Lauren (search "Pstack cursor") có skill **create verification**: tự khám phá code và dựng feature map ban đầu cho mình.
- Kèm skill **maintain verification** để giữ feature map luôn cập nhật.

---

## ✅ Checklist
- [ ] Agent của mình đã tự chạy được app thật chưa (CDP, simulator, CLI…)?
- [ ] Mình có đang là "người dán screenshot" duy nhất không? Nếu có → cần verification skill
- [ ] Viết feature map: tính năng con, đường đi trên UI, phím tắt, selector
- [ ] Có cơ chế cập nhật feature map khi app đổi
