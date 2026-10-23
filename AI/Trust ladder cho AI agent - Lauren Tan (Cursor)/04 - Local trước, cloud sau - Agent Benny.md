---
tags: [ai, ai-coding, agent, cloud-agent, automation]
source: https://www.youtube.com/watch?v=EWSUvEyFwjc
timestamp: "23:28–29:28"
---

# 04 · Local trước, cloud sau — Agent Benny

← [[03 - Pstack - Biến lỗi agent thành skill và eval]] · Tiếp → [[05 - Có nên rewrite - Greenfield và organic architecture]]

> [!quote] 💬
> Không có đường tắt từ đáy lên đỉnh đường cong. Đây là chuyện **mức tin của chính mình** vào agent.

---

## ❓ Câu hỏi của người dẫn (23:28)

Người dẫn muốn "đào sâu thêm một lớp" sau phần Lauren kể cách dựng verification skill:
- Giả sử muốn dựng một **eval hoặc skill** cho một việc nào đó, và muốn nó **tự tốt lên dần** (theo cách hiểu của người dẫn, đó là điều Lauren đang gợi ý).
- Việc đó chạy ở đâu? Trong một **worktree cô lập** với các **subagent** và **reviewer agent**? Hay trong một môi trường **cloud-hosted** nào đó?
- Nói cụ thể: nếu muốn dựng một hệ verification cho một thứ gì đó thì **làm gì trước, bắt đầu từ đâu**?

---

## 🏠 Bắt đầu ở local (23:58)

**Lauren:** chỗ tốt nhất để bắt đầu là **local**, **vì ở local mình quan sát được** agent đang làm gì.
- Nếu đang dựng verification skill cho chính mình: cho agent **tự bật ứng dụng lên**, dù là CLI, desktop app hay loại nào khác.
- Nhờ vậy mình **thấy tận mắt**:
  - agent tương tác với ứng dụng ra sao;
  - agent gọi những **API** nào, tức là các API cho phép nó điều khiển ứng dụng.

> [!note] 📝
> Lauren không trả lời thẳng vế "worktree / subagent / reviewer agent" trong câu hỏi; cô chỉ nói bắt đầu ở local rồi chuyển sang chuyện cloud agent.

---

## ☁️ Sau đó lên cloud agent (24:33)

- Riêng Lauren thì đã **"gần như dồn hết"** sang cloud agent, vì chúng **cực kỳ mạnh**. Cô nói điểm thật sự mạnh của Cursor chính là cloud agent.
- Lý do: nếu bỏ **một chút thời gian setup môi trường**, thì control skill và verification skill **trả lãi rất lớn**, bởi vì:
  - chúng không chỉ làm **một kỹ sư** giỏi hơn;
  - chúng **nâng cả team, thậm chí cả công ty**, vì khi đó mình bắt đầu nghĩ được tới cloud agent và tới **automation**: những thứ **tự động làm việc** mà không cần ai ra lệnh.
- Cô chen một câu: phần này cô định nói kỹ ở sau, nhưng kể luôn ở đây.

---

## 🤖 Ví dụ: agent Benny (25:16)

1. Ở Cursor có một agent tên **Benny** (Lauren nói cô hay kể về nó).
2. Benny nhận **tất cả bug report** (hoặc report từ người dùng) gửi về.
3. Nó **tự chạy trên cloud**: mở desktop riêng của nó, **chạy Cursor trên máy của chính nó**.
4. Nó dùng **chính các control skill** (xem [[02 - Verification skill và Feature map]]) để tương tác với ứng dụng và **thử reproduce** bug / report đó.
5. Ví dụ trên slide (25:52): Benny **reproduce được bug**, nhưng đồng thời thấy bug **đã được fix trên `main`**. Tức là nó xác nhận team đã sửa lỗi này rồi, việc còn lại của Lauren chỉ là **release thêm một bản build Cursor**.

> [!tip] 💡 Vì sao mạnh
> - Lauren nhận được **rất nhiều thông tin ngay lập tức, tự động**.
> - Cô **không phải tự ngồi với một agent cả tiếng** để mò xem "lỗi này fix chưa hay chưa fix" → **lấy lại được rất nhiều thời gian**.
> - Không chỉ cô: **mọi người trong team, mọi người trong công ty** đều hưởng lợi. Vì thế cô cho rằng dùng cloud agent là rất mạnh.

---

## 🪜 Đây là một hành trình, phải tin trước đã (26:30)

- Lauren nhấn mạnh: đây là **một hành trình**. Phải **tin agent trước** thì mới tới được điểm như Benny.
- Cô quay lại đường cong (trust curve, xem [[01 - Trust curve - Từ micromanage tới auto-merge]]): nhảy thẳng từ đáy lên là **rất khó, gần như không thể**.

> [!warning] ⚠️ Đừng nhảy cóc
> Nếu còn ở vùng đáy đường cong mà muốn "spawn ngay hàng trăm, hàng nghìn cloud agent" → chỉ **phí rất nhiều token** và **cực kỳ tốn tiền**. Lauren khuyên rõ là đừng làm vậy.

---

## 🔁 Người dẫn recap, Lauren xác nhận (27:00)

Người dẫn tóm lại hành trình của Lauren để người khác đi theo:
1. **Bắt đầu bằng verification**: dựng skill và cách kiểm để biết agent ra code **ít nhất là đúng**, tức là **giải được bài toán về mặt kỹ thuật**, dựa vào stack trace và hành vi thật trong app. Còn code đó **có tốt hay không** thì, như Lauren đã nói, có thể là câu hỏi riêng.
2. **Khi đã tin ở local** thì mới nghĩ tới **scale lên cloud**: chạy nhiều agent hơn, **tự nhặt tín hiệu** (ví dụ một bug report đổ về), tự đi giải và **trả lại một PR**.
3. Bước cuối có lẽ là **auto-merge PR**. Người dẫn đùa: "đó là chỗ chị đang đứng, chắc chưa phải ai cũng ở đó" (khán giả cười).
4. Lauren chen vào: "rồi review trên main". (Caption ghi "reviewing the one main", nhiều khả năng là "reviewing on main", tức là merge xong rồi mới review trên `main`; caption bị méo nên không chắc.)

**Lauren (27:49):** "Đúng vậy". Đó chính là lý do cô vẽ đường cong:
- Nó mô tả **hành trình của cô**: lúc đầu **chỉ dùng nổi vài agent** và **quan sát từng thứ một**.
- Cô cho rằng **thật sự không có đường tắt** từ đáy lên đỉnh, vì đây là chuyện **mức tin của chính mình vào agent**.

---

## 🧩 Trust = taste + encode chuẩn của mình vào skill (28:10)

- Là kỹ sư thì **không ai muốn "slop" code lên production**. Vậy xây niềm tin bằng cách nào? Lauren nói nó cần **nhiều taste và judgment**.
- Plugin như **Pstack** giúp **lên tay nhanh hơn nhiều**. Lập luận của cô: nếu bạn tin cô và tin Pstack, thì **gián tiếp** có thể tin agent của mình.
- Nhưng nếu bạn **không** tin cô, và cô nói rõ: **"tôi chắc chắn không khuyến khích mọi người tin tôi một cách mù quáng"** (28:40), thì nên tự xây bộ skill riêng. Câu này trong video bị nói vấp, bỏ dở giữa chừng ("if you build up your own set of skills that you can obviously…") rồi chuyển ý; phần rõ ràng là: **xem Pstack, fork về, biến thành của mình, cải thiện các skill**, cô rất khuyến khích việc đó.
- Với cô, mọi thứ **cứ quay về chữ "trust"**:
  - Mỗi người trong buổi chat có **một chuẩn engineering khác nhau**; mỗi codebase có **những thứ quan trọng khác nhau**.
  - Khi **encode được tất cả những điều đó vào skill**, **và verify được** agent thật sự làm theo → mới **leo được đường cong** và **bắt đầu automate** mọi thứ.

> [!note] 📝 Tên plugin
> Caption tự động lúc ghi "Pstack", lúc ghi "PAC" (28:24, 28:33, 28:48). Các file trước dùng "Pstack"; tên chính xác chưa kiểm được từ caption.

---

## ➡️ Chuyển ý (29:21)

Lauren nói còn **một phần nữa** muốn kể; người dẫn bảo cứ nói, câu hỏi thì anh sẽ gom dần. Phần tiếp theo (refactor và rewrite) nằm ở [[05 - Có nên rewrite - Greenfield và organic architecture]].

---

## ✅ Checklist
- [ ] Dựng verification ở local, cho agent tự bật app và quan sát nó điều khiển app qua API nào
- [ ] Chỉ lên cloud khi đã tin output ở local, không spawn hàng loạt agent khi còn ở đáy đường cong
- [ ] Nghĩ tới 1 automation kiểu Benny: bug report → tự reproduce trên cloud → báo kết quả (kể cả "đã fix trên main")
- [ ] Không tin mù quáng plugin của người khác: xem, fork, sửa thành bộ skill của mình
- [ ] Viết chuẩn engineering của team thành skill, có cách kiểm agent tuân theo
