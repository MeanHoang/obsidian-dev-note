---
tags: [ai, ai-coding, agent, cloud-agent, automation]
source: https://www.youtube.com/watch?v=EWSUvEyFwjc
timestamp: "23:28–29:13"
---

# 04 · Local trước, cloud sau — Agent Benny

← [[03 - Pstack - Biến lỗi agent thành skill và eval]] · Tiếp → [[05 - Có nên rewrite - Greenfield và organic architecture]]

> [!quote] 💬
> Không có đường tắt từ đáy lên đỉnh đường cong. Đây là chuyện **mức tin của chính mình** vào agent.

---

## 🏠 Bắt đầu ở local

**Câu hỏi:** muốn dựng hệ verification thì bắt đầu ở đâu: worktree cô lập, cloud…?

**Lauren:** bắt đầu **local**, vì mình **quan sát được**:
- Cho agent tự bật app (CLI, desktop app…).
- Nhìn agent tương tác với app ra sao, gọi những API nào để điều khiển app.

---

## ☁️ Sau đó lên cloud agent

- Lauren hiện gần như dùng hẳn cloud agent.
- Bỏ chút thời gian setup môi trường thì control skill / verification skill **trả lãi rất lớn**:
  - Không chỉ giúp một kỹ sư, mà **nâng cả team, cả công ty**.
  - Mở ra **automation**: việc chạy tự động không cần người ngồi canh.

---

## 🤖 Ví dụ: agent Benny

1. Benny nhận **mọi bug report** gửi về.
2. Tự mở một máy trên cloud, chạy Cursor trên máy của nó.
3. Dùng **chính control skill** ở [[02 - Verification skill và Feature map]] để tương tác với app và **reproduce** bug.
4. Ví dụ trong video: Benny reproduce được bug nhưng thấy **đã fix trên `main`** → việc còn lại chỉ là release bản build mới.

> [!tip] 💡 Giá trị
> Thông tin đó Lauren có **tự động**, không phải ngồi một tiếng với agent để tìm "fix chưa?". Mọi người trong team, trong công ty đều hưởng lợi.

> [!warning] ⚠️ Đừng nhảy cóc
> Còn ở đáy đường cong mà spawn hàng trăm, hàng nghìn cloud agent ngay → **phí token, rất tốn tiền**.

---

## 🪜 Tóm lại hành trình (người dẫn chương trình recap, Lauren xác nhận)

1. **Verification**: skill + cách kiểm agent ra code **đúng** (stack trace, hành vi thật trong app). Code **tốt** hay không là chuyện riêng.
2. **Tin ở local** rồi mới **scale lên cloud**: agent tự nhặt tín hiệu (bug report…), tự giải, trả về PR.
3. **Auto-merge PR**, review lại trên `main`. Đây là chỗ Lauren đang đứng, chưa phải ai cũng tới.

---

## 🧩 Trust = encode chuẩn của mình vào skill

- Plugin như Pstack giúp lên nhanh hơn. "Tin tôi và tin Pstack thì gián tiếp tin được agent". Nhưng Lauren **khuyên đừng tin mù quáng**.
- Nên tự xây bộ skill riêng: xem Pstack, fork, sửa cho hợp.
- Mỗi người có **chuẩn engineering riêng**, codebase có thứ quan trọng riêng. Encode được chúng vào skill **và verify được agent làm theo** → mới leo được đường cong, mới automate được.

---

## ✅ Checklist
- [ ] Dựng verification ở local, quan sát agent điều khiển app
- [ ] Chỉ lên cloud khi đã tin output ở local
- [ ] Nghĩ tới 1 automation kiểu Benny: bug report → tự reproduce → báo kết quả
- [ ] Viết chuẩn engineering của team thành skill, có cách kiểm agent tuân theo
