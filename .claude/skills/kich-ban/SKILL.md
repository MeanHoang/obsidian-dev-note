---
name: kich-ban
description: Biến MỘT note trong vault thành kịch bản video hoàn chỉnh cho hệ kênh "Ngẫm" (YouTube long-form + clip TikTok) — lọc ý tưởng, đóng gói tiêu đề/thumbnail, dàn ý dẫn bằng câu hỏi, bản đọc tiếng Việt nói, tự lọc giọng AI và review 2 vòng. Dùng khi user muốn "làm kịch bản cho bài X", "lên video từ note này", hoặc gõ /kich-ban.
argument-hint: [tên note nguồn | chủ đề | để trống để chọn]
allowed-tools: Read, Grep, Glob, Write, Edit, AskUserQuestion, Agent, Bash(python3:*), Bash(ls:*), Bash(find:*), Bash(grep:*), Bash(wc:*), Bash(sed:*)
---

**Mục tiêu:** 1 lần chạy = **1 note = 1 kịch bản**. Không batch nhiều note, không tự chọn note thay user.

**Context:** user là Shopify app dev (Joy Loyalty), làm hệ 4 kênh YouTube tiếng Việt tên "Ngẫm". Kênh chính là 🔵 **Ngẫm Code**. Giọng kênh: **một đồng nghiệp giải thích cho đồng nghiệp**, không phải giảng viên đứng bục.

---

## Bước 0 — Nạp chuẩn (BẮT BUỘC, đọc trước khi viết một chữ nào)

Đọc đủ 4 file này. Đây là hợp đồng, không phải tài liệu tham khảo:

| File | Lấy gì từ đó |
|---|---|
| `HunMoney/Youtube/4-Quy trình biến bài học thành video.md` | khuôn 5 khối, hook 3 nhịp, bộ lọc giọng AI, danh sách từ cấm |
| `HunMoney/Youtube/2-Tầm nhìn và mục tiêu hệ Ngẫm.md` | bộ lọc **"cái này vận hành thế nào?"**, lời hứa cơ chế-không-phải-thông-tin |
| `HunMoney/Youtube/Bộ lọc giọng AI cho tiếng Việt NÓI.md` | 4 tật giọng tiểu luận + hạt ngữ khí |
| `HunMoney/Youtube/<Tên kênh>/0-Sổ tay <Tên kênh>.md` | quy tắc riêng kênh (nguồn đề tài, tiêu đề, thumbnail, tỷ lệ hình) |

Rồi đọc **note nguồn** trong vault. Nếu user không chỉ rõ note, dùng Glob/Grep tìm ứng viên rồi hỏi bằng AskUserQuestion — **không tự chọn**.

---

## Bước 1 — Lọc ý tưởng

Note chỉ thành video khi qua đủ **3 câu**:

1. Nó giao một **cơ chế** hay chỉ giao **thông tin**? (tra Google 30 giây ra được → trượt)
2. User có **trải nghiệm riêng** ở đây không? (không có → nói thẳng là chưa nên làm, đừng cố)
3. Có ai thực sự **gõ tìm** thứ này không? (không → vẫn làm được, nhưng đừng kỳ vọng Search)

Trượt câu 1 hoặc 2 → **báo lại cho user và dừng**, đề xuất góc khác. Đừng viết kịch bản cho ý tưởng đã trượt.

> Một note dày thường chứa **nhiều cơ chế**. Tách ra, liệt kê, để user chọn một. Đừng nhồi cả note vào một video.

---

## Bước 2 — Đóng gói TRƯỚC ⛔ chốt chặn

Viết tiêu đề và phác thumbnail **trước khi viết dàn ý**. Không nặn ra nổi tiêu đề đáng bấm trong 10 phút thì ý tưởng yếu — bỏ, tiết kiệm 80 phút.

**Luật đặt tiêu đề — chỉ dùng từ người xem ĐANG dùng.** Người xem không biết `modem` là gì thì tiêu đề phải gọi nó là "cục wifi". Thuật ngữ chưa biết nằm trong tiêu đề = không ai bấm. Nhưng chính thứ họ chưa biết lại là **cú lật hay nhất để dành tới phút thứ 2** — đừng tiêu nó ở tiêu đề.

Đưa **3–4 phương án tiêu đề** khác hướng nhau qua AskUserQuestion, mỗi phương án ghi rõ đánh đổi (tò mò / search intent / độ độc nhất / hợp chất kênh). Không tự chốt.

Thumbnail: layout chung của hệ, đổi màu theo kênh, **kiểm tra ở 210×118px**.

---

## Bước 3 — Dàn ý: câu hỏi trước, lý thuyết sau

> [!danger] Mở bằng định nghĩa là cách giết video nhanh nhất
> *"Hôm nay chúng ta tìm hiểu về mô hình TCP/IP gồm 4 tầng…"* — không ai bấm, ai lỡ bấm cũng thoát ở giây 15.

Khuôn cho **mỗi lớp** trong video:

```
① Thắc mắc đời thường  →  ② "Ơ, mình không giải thích được"  →  ③ Bóc cơ chế  →  ④ Quay lại trả lời
```

Video >10 phút cần **3–4 câu hỏi rải đều**, không chỉ một ở hook — nếu không thì tới phút 6 lại thành giáo trình. Mỗi câu hỏi mở một lớp, và **mọi câu hỏi đều phải được quay lại trả lời**, không bỏ lửng.

Vẫn giữ khuôn 5 khối: Hook → Bối cảnh → Cơ chế → **Chỗ mình sai** → Chốt.

Hai thứ bắt buộc có:
- Khối **"Chỗ mình sai"** — thứ AI không bịa được, và là đoạn giữ chân tốt nhất. Để `⟨…⟩` cho user điền mốc thật.
- **Payoff dùng được ngay** ở phần chốt (lệnh chạy được, quy tắc mang đi được). Không kết bằng lời khuyên chung chung.

---

## Bước 4 — Viết bản đọc

Ghi ra file, **không** in dài dòng ra chat.

- `[HÌNH]` cho mọi ghi chú dựng. Cắt về mặt ở mỗi câu hỏi mới. Đổi nhịp mỗi 60–90 giây.
- `⟨…⟩` cho mọi chỗ cần chi tiết thật của user — mốc thời gian, con số, tên riêng. **Không bịa hộ.**
- Ưu tiên cảnh **màn hình thật** (terminal, trang quản trị, DevTools) hơn sơ đồ vẽ. Sổ tay Ngẫm Code đòi ≥70% màn hình thật.
- Xưng **"mình"**, không phải "tôi".

> [!danger] ⛔ Luật quan trọng nhất khi viết lời thoại: ĐẶT TÊN CHO MỌI THỨ
> Đây là chỗ bản nháp hay hỏng nhất, và người xem không phàn nàn — họ chỉ thoát.
> - Đếm cái gì thì **phải đặt tên cho từng cái**, tên đời thường, rồi gọi đúng tên đó suốt cả video. *"Ba chỗ có thể đứt"* → *"trong nhà, ra ngõ, với cái danh bạ"*.
> - Khái niệm trừu tượng (tầng, giao thức, phiên) thì phải có **một hình đời sống gánh nó**, và hình đó giữ nguyên tới cuối. Ví dụ 4 tầng = cái xe · anh tìm đường · anh kiểm hàng · người nhận.
> - **Tả việc, đừng tả cảm giác.** *"Bạn sẽ thấy một chuyện hơi khó chịu"* là cảm giác của người viết, không phải thông tin của người xem.
> - Mỗi câu một ý. Câu nhồi hai ý thì tách đôi.
> Tự kiểm: mỗi lần định viết *"một thứ" · "cái này" · "chỗ đó" · "một chuyện"* → hỏi lại **nó tên là gì**. Không đặt được tên nghĩa là chưa hiểu đủ rõ để viết ra.

---

## Bước 5 — Tự lọc giọng + đếm thời lượng ⛔ không được bỏ

```bash
python3 .claude/skills/kich-ban/dem-am-tiet.py "<đường dẫn kịch bản>"
```

Script trả về số âm tiết, thời lượng thật, và cảnh báo: gạch ngang chêm · phản đề *"Không phải A. Là B."* · từ cấm · mật độ hạt ngữ khí · số chỗ `⟨…⟩` chưa điền.

> [!danger] ⛔ ĐỪNG BAO GIỜ ước lượng thời lượng bằng mắt
> Nhịp nói tiếng Việt tính theo **âm tiết** (~160/phút), không phải theo "từ". Đếm bằng từ ghép sẽ hụt khoảng 25%. Lỗi này đã xảy ra **3 lần liên tiếp** trong lần dựng đầu tiên — luôn chạy script, và ghi đúng con số script trả về vào metadata của file.

Sửa hết cảnh báo rồi chạy lại tới khi sạch (trừ `⟨…⟩`, cái đó chỉ user điền được).

---

## Bước 6 — Review 2 vòng bằng subagent

Spawn **một** agent (`general-purpose`), review theo 5 trục, **2 vòng**: vòng 2 gửi tiếp cho chính agent đó bằng SendMessage để nó soát lại bản đã sửa.

Prompt cho agent phải có: đường dẫn kịch bản, đường dẫn 4 file chuẩn ở Bước 0, **đường dẫn note nguồn để soát tính chính xác kỹ thuật**, và 5 trục:

| Trục | Soát gì |
|---|---|
| **A. Chính xác kỹ thuật** | đối chiếu từng khẳng định với note nguồn; tìm chỗ đơn giản hoá quá đà thành sai; kiểm tra mọi lệnh/con số |
| **B. Giọng** | 4 tật giọng tiểu luận + danh sách từ cấm + chỗ đọc lên ngượng mồm |
| **C. Giữ chân** | thuật ngữ dùng trước khi giải thích · đoạn trùng lặp · lời hứa đặt ra rồi bỏ rơi · nhịp chùng |
| **D. Tiêu chuẩn kênh** | đủ 5 khối · hook 3 nhịp · bộ lọc cơ chế · tỷ lệ hình |
| **E. Thời lượng** | đếm lại, đối chiếu với con số khai trong file |

Bắt agent: **trích nguyên văn câu có vấn đề + viết sẵn câu thay thế**, xếp 🔴/🟡/🟢, không sửa file, trả lời tiếng Việt.

Vòng 2 phải kết bằng phán quyết dứt khoát: **QUAY ĐƯỢC** · **QUAY ĐƯỢC SAU KHI SỬA N ĐIỂM** · **CHƯA QUAY ĐƯỢC**.

Áp fix xong thì chạy lại Bước 5.

---

## Bước 7 — Clip TikTok

Cắt từ khối **"Chỗ mình sai"**, không phải bản rút gọn video dài.

- Hook 1–3 giây, chữ to trên hình lặp đúng câu hook
- **Một ý duy nhất, kể trọn vẹn** — giả định người xem chưa biết user là ai
- ⛔ Không kết bằng "xem full ở kênh nhé" — clip treo lơ lửng không kéo được người theo dõi

---

## Đầu ra

| File | Nội dung |
|---|---|
| `HunMoney/Youtube/<Kênh>/NN - Kịch bản — <tên>.md` | đóng gói, series map, dàn ý theo mốc thời gian, ghi chú hình |
| `HunMoney/Youtube/<Kênh>/NN - Kịch bản đầy đủ (bản đọc).md` | bản đọc + `[HÌNH]` + `⟨…⟩` + clip TikTok + checklist |

Metadata đầu file bản đọc phải có: thời lượng **đúng theo script**, tiêu đề đã chốt, đạo cụ, luận điểm một dòng, và lịch sử phiên bản (v1/v2/v3 sửa gì).

## Báo cáo cuối

Ngắn. Nêu: tiêu đề đã chốt · thời lượng thật · phán quyết vòng 2 · **và những chỗ `⟨…⟩` user phải tự điền**. Không kể lại nội dung kịch bản.
