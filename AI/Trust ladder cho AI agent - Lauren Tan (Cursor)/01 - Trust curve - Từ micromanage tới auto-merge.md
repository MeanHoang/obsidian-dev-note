---
tags: [ai, ai-coding, agent, trust]
source: https://www.youtube.com/watch?v=EWSUvEyFwjc
timestamp: "00:00–05:53"
---

# 01 · Trust curve — Từ micromanage tới auto-merge

← [[AI/Trust ladder cho AI agent - Lauren Tan (Cursor)/00 - README|README]] · Tiếp → [[02 - Verification skill và Feature map]]

> [!quote] 💬 Mở đầu video (00:00)
> Theo Lauren, AI dùng tốt nhất là như **người pair programming cùng mình**, không phải công cụ thay việc viết code, càng không phải chỗ để **outsource việc suy nghĩ**.

> [!note] 📝 Về đoạn mở đầu
> Đoạn 00:00–01:24 kết thúc giữa câu, rồi chuyển sang lúc bắt đầu share màn hình ("I assume you can see my screen" / host: "Yes, we're good"). Có vẻ đây là một đoạn trích được đặt lên đầu video, còn bài nói chính bắt đầu từ 01:24 ("So yeah, today..."). Đây là suy đoán từ transcript, video không nói rõ.

---

## 🎯 Áp lực "phải dùng AI cho thật nhiều" (00:00)

- Vì AI đang rất hấp dẫn, có xu hướng muốn **nhét AI vào mọi chỗ** để được nhìn nhận là người "on the ball", tức là bắt kịp AI (Lauren phải dừng lại tìm từ này).
- Từ đó sinh ra áp lực kiểu: phải tăng năng suất, tuần này phải ship **100 PR** dù gần như không hiểu mình đang làm gì, "vibe code tới 1 triệu ARR" (câu nói mỉa áp lực, không phải lời khuyên).
- Trải nghiệm thật của Lauren: dùng AI thì **tiết kiệm được chút thời gian viết code**, nhưng bà thấy mình **tốn nhiều thời gian hơn để review** cái AI làm và **sửa lại** nó.
- Bà đã thử cách nhiều người khuyên: thay vì prompt AI build thẳng feature, bắt AI viết **spec** trước, mình review spec, rồi mới làm tiếp cả quy trình... Câu **bị ngắt giữa chừng** ("then it's like...") khi chuyển sang share màn hình, không có kết luận về cách này.

---

## 🧭 Vấn đề gốc: làm sao TIN được agent? (01:24)

- Chủ đề lớn của Lauren khi dùng agent viết code (và bà đoán nhiều người nghe cũng vậy): **làm sao tin được nó**.
- Khó nhất với **kỹ sư đã code rất lâu năm**: họ có nhiều quan điểm và bài học về thế nào là engineering tốt.
- Trong khi đó agent thì "winging it" (làm đại), đoán mò, hallucinate, và **tự tin tuyên bố đã tìm ra "smoking gun"** (thủ phạm của bug) "lần thứ một trăm", nhưng thực ra đó không phải vấn đề thật.
- Mỗi lần như vậy là **mất rất nhiều niềm tin**. Và khi không có nhiều niềm tin vào agent thì **không khai thác hết được nó**.

> [!note] 📝 So sánh của Lauren: làm quản lý (01:52)
> Nếu là engineering manager có một team kỹ sư mà **không tin** họ, thì cách vận hành sẽ là **micromanagement**: tốn nhiều thời gian nhìn qua vai cấp dưới, kiểm tra họ làm có tốt không, có ship bug lên production không.
> Với agent cũng vậy: không tin thì phải ngồi canh từng output.

---

## 📈 Biểu đồ "trust curve" của Lauren (02:20)

Lauren tự vẽ biểu đồ này và nói rõ là "không khoa học lắm", chỉ là cách bà hình dung hành trình dùng agent của mình. (Bà nói vấp "fast forward... fast backwards" rồi mới chốt là lùi lại quá khứ.)

| Giai đoạn | Mức tin | Cách làm việc |
|---|---|---|
| Khoảng 1 năm trước, khi chưa nhiều người dùng agent để code | Thấp | Ngồi **rất sâu trong vòng lặp** (in the loop) với một hoặc vài agent; liên tục cố hiểu agent đang làm gì; xem **từng output**; ngồi đó prompt. **Không song song hoá thêm được** vì không có niềm tin |
| 5 tháng gần đây | Tăng dần | Bà thấy mình đã "leo" được đường cong niềm tin này. Leo bằng cách nào là nội dung chính của bài nói (các file sau) |
| Hiện tại | Cao | Agent **tự merge (auto-merge) PR** cho bà |

> [!warning] ⚠️ Logic cốt lõi (03:21)
> Không thể spawn 100 agent khi còn chưa tin output của **1** agent.

### Auto-merge: "nghe như slop artist" (03:52)

- Lauren nói trước là câu này "nghe hơi đáng sợ" và khiến bà nghe như một **"slop artist"** (người xả code rác bằng AI), nhưng bà "hứa là không phải".
- Agent giờ **tự merge PR** cho bà, bà thừa nhận "nói ra nghe thật điên rồ".
- Ví dụ cụ thể: sáng hôm đó thức dậy đã có khoảng **20 PR landed**; bà review chúng **trên `main`**, tức là sau khi đã land, và chúng **ổn**.
- "Làm sao tới được điểm đó" chính là điều bà muốn nói trong buổi này. Bà mời mọi người cứ chen vào hỏi.

> [!tip] 💡 Chen ngang vui (04:21)
> Lúc share chart, có người trong buổi gửi yêu cầu điều khiển máy tính của bà. Lauren từ chối: "chắc là tôi sẽ không làm vậy đâu".

---

## 📊 Số liệu Lauren chia sẻ (tại Cursor) (04:21)

- Bà chia sẻ chart **không phải để khoe** mà để cho thấy hành trình: đường cong niềm tin đi cùng với số contribution bà land được ở Cursor.
  - Caption ghi "**inversely** matches" (khớp ngược). Nhưng phần sau lại mô tả hai thứ cùng tăng, nên có thể caption nghe nhầm hoặc bà nói nhầm; chưa xác định được.
- Bà vào Cursor **5 tháng trước**. Tháng đầu **không năng suất lắm** vì đang học codebase, "không biết chuyện quái gì đang diễn ra".
- Càng tự tin vào agent, bà càng **tăng được năng suất**.
- Tháng trước: **khoảng 1.000 PR** shipped, bà tự gọi là "ridiculous" (vô lý).
- Tháng này mới **ngày 12** đã **gần 800 PR** landed. Velocity chắc chắn cao.
- Bà biết nhiều người sẽ hỏi: **bao nhiêu trong số code đó thật sự tốt?** Bà cho là câu hỏi hoàn toàn chính đáng.
- Bà không trả lời thẳng câu đó, chỉ nói: nếu **setup agent tốt** thì người khác chắc chắn cũng đạt được **mức tương tự**, và phần tiếp theo sẽ nói cách làm.

> [!note] 📝 Chuyển sang phần sau (05:53)
> Ngay sau đó Lauren nói kỹ năng quan trọng nhất khi làm với agent là **verification**. Xem [[02 - Verification skill và Feature map]].

---

## ✅ Checklist
- [ ] Tự hỏi: mình đang ở đâu trên trust curve? (canh từng output hay để agent tự chạy)
- [ ] Đo xem AI đang tiết kiệm thời gian viết hay chỉ dời thời gian sang review/sửa
- [ ] Chưa tin 1 agent thì chưa tăng số agent song song
