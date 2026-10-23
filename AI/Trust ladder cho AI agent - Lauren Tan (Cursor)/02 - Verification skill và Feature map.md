---
tags: [ai, ai-coding, agent, verification, skill]
source: https://www.youtube.com/watch?v=EWSUvEyFwjc
timestamp: "05:53–13:27"
---

# 02 · Verification skill và Feature map

← [[01 - Trust curve - Từ micromanage tới auto-merge]] · Tiếp → [[03 - Pstack - Biến lỗi agent thành skill và eval]]

> [!quote] 💬
> "For me I think the most important skill that you should have in your toolbox when you work with agents is verification." (06:01)
> Kỹ năng quan trọng nhất trong hộp đồ nghề khi làm với agent là **verification**.

---

## 🎯 Verification là gì (theo Lauren) (05:53)

- Phần này nối tiếp lời hứa ở cuối phần trước: Lauren vừa nói "nếu set up agent tốt thì bạn cũng đạt được tốc độ tương tự", rồi chuyển sang giải thích cách làm.
- Lauren nói đây là ý kiến riêng của cô và quay sang hỏi người dẫn chương trình rằng kinh nghiệm của họ có giống không. (Tên người dẫn trong auto caption ra chữ "call", có thể là phụ đề nghe sai tên; người dẫn không trả lời ở đoạn này.)
- Verification theo nghĩa của Lauren = **agent tự chạy code thật**, ví dụ:
  - chạy app,
  - lấy CPU trace hoặc heap snapshot,
  - mở iOS simulator,
  - nói chung: app được đưa tới user theo cách nào thì agent cũng dùng được đúng cách đó, chạy thật và tự kiểm tra xem có chạy không.
- Lý do quan trọng: đây là thứ **khép kín vòng lặp** (close the loop) — agent viết code xong tự biết kết quả, không cần người báo lại.
- Giới hạn Lauren nói rõ: verification **không đảm bảo agent viết code tốt** (good code), nhưng giúp agent **ít nhất viết code đúng** (correct code). Vì vậy cô gọi đó là "bước tiến rất lớn" để có thể tin agent.

---

## 🐢 Câu chuyện: tuần đầu ở Cursor, không có verification (07:05)

Lauren mở màn hình để chia sẻ một ví dụ trong Cursor (agents window), rồi kể câu chuyện đằng sau:

1. **Bị đổi team ngay khi vào.** Khi vào Cursor 5 tháng trước, Lauren lẽ ra vào team **cloud agents**. Nhưng vì cô có nhiều kinh nghiệm với **React**, và agents window là một **app React**, nên cô được nhờ sang giúp phần agents window.
2. **Không có skill nào hỗ trợ.** Lúc đó gần như chưa có skill nào giúp cô làm việc này.
3. **Deadline rất gấp.** Agents window sắp launch, khoảng một tuần nữa (caption ghi "launch in like week", có thể bị nuốt chữ "a").
4. **Tự đọc trace bằng tay.** Cô ngồi mở Chrome DevTools (tab performance), lấy trace và tự nhìn flame graph để tìm vấn đề hiệu năng.
5. **Bản thân cũng mù codebase.** Đó mới là tuần đầu: cô "có chút ý tưởng" nhưng codebase hoàn toàn mới, gần như không biết mình đang nhìn cái gì.
6. **Agent cũng mù y như vậy.** Cô chụp màn hình cây (caption ghi "the tree", có thể là cây call/flame graph), tải trace về rồi gửi cho agent. Agent trả lời kiểu "có vẻ là thế này", rồi **tự tin khẳng định** "là cái này". Cô sửa theo thì hoá ra **không phải nguyên nhân thật**.
7. **Kết quả:** một quá trình rất, rất chậm.

> [!note] 📝 So sánh dễ hiểu: mình là "người kiểm tra" duy nhất (08:36)
> Lauren mở rộng ra: không chỉ performance, mà bất kỳ việc dev nào làm với agent khi **không có verification skill** thì **mình chính là verifier**, và mình là **nút thắt cổ chai**:
> 1. Giao việc cho agent → agent đi viết code.
> 2. Mình mở bản dev build local → thấy "không chạy".
> 3. Mình phải copy-paste screenshot, console error… dán cho agent.
> 4. Agent từ từ đọc, cố hiểu rồi sửa.
> 5. Lặp lại — mình luôn bị kẹt trong vòng lặp.
>
> Vì mình phải ngồi trong từng vòng như vậy nên **không có cách nào chạy song song** nhiều việc.

---

## 🔧 Skill `control glass` (09:22)

- Vì câu chuyện trên, `control glass` là **một trong những skill đầu tiên** Lauren viết cho Cursor.
- "Glass" là **code name nội bộ** của agents window. Lauren đùa thêm: "nhưng giờ thì nó chỉ là Cursor thôi".
- Bản thân code của skill **không có gì thú vị**: agent của mình có thể dễ dàng tự viết một cái tương tự.
- Ý tưởng: dạy agent điều khiển app bằng lập trình, tuỳ loại app:
  - **Electron app hoặc web app** → dạy agent dùng **Chrome DevTools Protocol (CDP)**.
  - **App iOS** → Apple cũng có các tiện ích để chạy simulator, lấy trace và điều khiển app bằng lập trình.
- Lauren nói kiểu skill này "rất hữu ích", nhưng thứ cô muốn nói kỹ là một file khác nằm trong skill (cô mở README của skill để chỉ).

---

## 🗺️ Feature map — file đặc biệt đi kèm skill (10:15)

Lauren gọi nó là "một tính năng rất độc đáo… à không phải tính năng, một **file** độc đáo tên là **feature map**".

**Vấn đề (10:29):** sau khi có `control glass`, agent đã chạy được agents window và lấy trace, nhưng **không biết agents window là cái gì, có những gì**.
- Có người báo "sidebar trái bị lag", hoặc "tab PR ở bên phải không chạy" → agent **loay hoay** (flailing), tốn nhiều thời gian tra code: tính năng này nằm ở đâu? Trên UI đi tới nó bằng cách nào?
- Vì thế skill gần như **hoàn toàn vô dụng**: Lauren chạy skill ở local, nó spawn được bản dev build, rồi cứ quay vòng (caption ghi "turnurning", có thể là "churning") kiểu "thử click chỗ này", không biết cách đi tới các thứ. Lauren gọi đó là "trải nghiệm tệ hại".
- (Xen giữa, 11:22, Lauren hỏi vui "ai đang vẽ mũi tên lên màn hình tôi vậy?" — có người đang chú thích lên màn hình chia sẻ; không có ý nội dung.)

**Giải pháp (11:27):** feature map **dạy agent cách đi tới tất cả các tính năng** của app. Ví dụ phần sidebar (12:50), map ghi:
- Sidebar là gì, có những tính năng con nào bên trong.
- Từ góc nhìn user: đi tới nó bằng cách nào.
- Tất cả các phím tắt liên quan.
- Các DOM element / attribute dùng để select phần tử qua CDP.

Lauren nhấn mạnh hai lần là thứ này "cực kỳ mạnh" với agent.

> [!tip] 💡 Lợi ích với report "chất lượng thấp" (12:02)
> - Có feature map rồi thì khi report từ user đổ về, agent có thể **map cả report mơ hồ, thậm chí chỉ là một screenshot**, sang đúng tính năng.
> - Ví dụ thật trong Cursor: có một **kênh Slack** nhiều người gửi feedback về agents window và một sản phẩm khác (caption ghi "rockbot", không chắc tên thật — có thể là phụ đề nghe sai).
> - Report ở đó thường **rất kém chất lượng**: rất hay chỉ là một screenshot kèm "???" — "cái gì đây?" (cả phòng cười).
> - Không có feature map → agent "không biết gì cả". Có feature map → agent có nhiều ngữ cảnh hơn để hiểu cách điều hướng và đi tới đúng tính năng.

---

## 📦 Tự làm cho mình (11:33 và 13:20)

- Lauren có plugin **Pstack** (caption ghi "PAC"; cô bảo search "Pstack cursor" trên Google là thấy). Tên và ý nghĩa của Pstack được giải thích ở phần sau → [[03 - Pstack - Biến lỗi agent thành skill và eval]].
- Trong plugin có skill **create verification**: giúp mình dựng một skill giống `control glass` cho app của mình, **kể cả feature map** — nó tự khám phá code và dựng feature map ban đầu, chỉ cho agent cách đi tới các tính năng khác nhau.
- Pstack còn kèm skill **maintain verification** để giữ verification skill (và feature map) luôn cập nhật.
- Ngay sau đó người dẫn hỏi Lauren tạo ra nó như thế nào và Pstack là gì → nội dung ở note 03.

---

## ✅ Checklist
- [ ] Agent của mình đã tự chạy được app thật chưa (CDP, simulator, CLI…)?
- [ ] Mình có đang là "người dán screenshot" duy nhất không? Nếu có → cần verification skill
- [ ] Viết feature map: tính năng con, đường đi trên UI, phím tắt, selector
- [ ] Có cơ chế cập nhật feature map khi app đổi
