# Harness design cho app chạy dài (Anthropic Engineering)

> **Nguồn:** [Harness design for long-running application development](https://www.anthropic.com/engineering/harness-design-long-running-apps) — Anthropic Engineering.
> **Đọc trước:** [[Harness trong AI là gì]] (note nền tảng: harness = phần mềm bao quanh model). Note này đi sâu hơn: **thiết kế harness thế nào để agent làm được task kéo dài NHIỀU GIỜ** (build cả một web app từ 1 câu prompt).

> **TL;DR:** Một agent đơn lẻ chạy task dài sẽ "đuối" — mất mạch, tự chấm điểm quá cao cho chính mình. Giải pháp là **chia vai**: Planner (lập kế hoạch) → Generator (code) → Evaluator (chấm điểm bằng cách thật sự bấm thử app). Nhưng nghịch lý cốt lõi: **model càng giỏi, harness càng nên gỡ bớt scaffold**. Mỗi mảnh harness là một "giả định về việc model KHÔNG tự làm được" — và giả định đó cần được kiểm tra lại mỗi khi có model mới.

---

## 1. Ví dụ đời sống trước

**Giao cho một đầu bếp giỏi nấu tiệc 12 món trong 6 tiếng.**

- **Cách ngây thơ (solo agent):** bảo anh ta "nấu đi" rồi để mặc. Anh ta nấu hăng say món 1–2, nhưng đến món 7 thì bắt đầu quên mình đã nêm gì, làm qua loa, và tự khen "ngon rồi" dù canh đã mặn chát. Không có ai nếm lại.
- **Cách có harness:** có **bếp trưởng lên thực đơn** (Planner), **đầu bếp nấu** (Generator), và **một giám khảo đi nếm từng món, chấm điểm theo tiêu chí** (Evaluator). Giám khảo không nấu → không thiên vị → dám chê thẳng "món này nhạt, làm lại".

Hai điểm mấu chốt bài báo rút ra chính là hai điểm ở đây:
1. Người nấu **không tự chấm được món của mình** (self-evaluation bias).
2. Càng nấu lâu càng **mất mạch** (context degradation).

Và điểm thứ ba tinh tế hơn: **nếu thuê được một đầu bếp siêu đẳng (model mới, giỏi hơn), bạn không cần bếp trưởng chia nhỏ từng bước nữa** — anh ta tự giữ được mạch cả bữa tiệc. Giữ nguyên bộ máy cồng kềnh lúc này chỉ tổ tốn tiền.

---

## 2. Hai lý do khiến agent chạy dài thất bại

| Failure mode             | Là gì                                                                                                          | Hệ quả                                           |
| ------------------------ | -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| **Context degradation**  | Task càng dài, model càng mất coherence. Iteration sau có khi *tệ hơn* iteration giữa.                         | Sản phẩm cuối kém hơn bản nháp giữa chừng        |
| **Self-evaluation bias** | Agent chấm bài của chính nó thì "confidently praising the work — even when the quality is obviously mediocre." | Không có tín hiệu để iterate, dừng sớm với đồ dở |

Bài báo còn đặt tên một hiện tượng: **"context anxiety"** — model *tưởng* mình sắp hết context window nên vội vàng kết luận "xong rồi" dù chưa xong.

---

## 3. Bộ công cụ thiết kế harness (các pattern)

### 3.1. Tách Generation ra khỏi Evaluation ⭐ (insight quan trọng nhất)
- Agent tạo và agent chấm phải là **hai vai khác nhau**.
- Evaluator dễ "chỉnh cho hoài nghi" hơn là bắt một self-critic tự nghi ngờ mình.
- Biến phán xét chủ quan ("đẹp/xấu") thành **có thể chấm điểm** qua tiêu chí định nghĩa rõ.

### 3.2. Tiêu chí chấm được (gradable criteria) cho việc chủ quan
Với thiết kế frontend, họ định nghĩa khung đo cái "đẹp":
- **Design quality:** "Tổng thể có phải một khối gắn kết, hay chỉ là đống mảnh ghép rời?"
- **Originality:** dấu vết quyết định riêng vs template mặc định.
- **Craft:** typography hierarchy, spacing, color harmony, contrast ratio.
- **Functionality:** dùng được, tách khỏi thẩm mỹ.

⚠️ **Bài học prompt cực hay:** *"cách chọn chữ trong tiêu chí lái generator theo hướng tôi không lường trước"*. Chỉ cần thêm chữ **"museum quality"** là output bị kéo về một kiểu thẩm mỹ đồng nhất. → **Prompt nào cũng nhúng một giả định; chọn chữ = định hình sản phẩm.**

### 3.3. Evaluator phải TƯƠNG TÁC THẬT, không chấm ảnh tĩnh
- Dùng **Playwright MCP** để agent thật sự click, điều hướng, thao tác trên app đang chạy.
- Bắt được bug mà nhìn screenshot không thấy: vd tool đổ màu hình chữ nhật chỉ đặt tile ở *điểm đầu–cuối* của thao tác kéo, chứ không đổ đầy vùng.

### 3.4. Sprint-based decomposition (chia theo từng feature)
- Bản harness đầu chia task thành sprint **mỗi lần 1 feature**.
- Generator + Evaluator "đàm phán" một **sprint contract** định nghĩa tiêu chí thành công → test → mới bàn giao sprint sau.
- Chống việc "đi chệch đường ray theo thời gian".

### 3.5. Giao tiếp qua FILE, không nhồi hết vào hội thoại
- Một agent ghi spec/artifact ra file → agent sau đọc và phản hồi qua file chung.
- "Giữ công việc trung thành với spec mà không over-specify implementation quá sớm."

### 3.6. Xử lý context: Reset vs Compaction
- **Context reset:** xóa sạch hội thoại, bắt đầu lại từ artifact bàn giao có cấu trúc ("clean slate"). Tốn token + latency nhưng cần với Sonnet 4.5.
- **Compaction:** tóm tắt tại chỗ phần cũ.

---

## 4. Con số thật (rất đắt giá để cân nhắc)

| Case | Solo agent | Full harness |
|---|---|---|
| **Retro game maker** | 20 phút · **$9** — layout phí chỗ, gameplay hỏng, entity không nối được runtime | 6 giờ · **$200** — 1 câu prompt → spec 16 feature qua 10 sprint, game chơi được thật |
| **Digital Audio Workstation** (Opus 4.6, bỏ sprint) | — | 3h50 · **$124.70** (Planner $0.46 · Build phase 1 $71 · QA $3.24 · nhiều vòng lặp) |
| **Frontend design loop** | — | 5–15 vòng/lần generate, có run kéo dài **4 tiếng** |

> **"Đắt hơn 20 lần, nhưng khác biệt chất lượng thấy ngay lập tức."**

Ví dụ frontend ấn tượng nhất: web bảo tàng nghệ thuật Hà Lan — đến vòng 9 vẫn là landing page tối màu thường; **vòng 10 model vứt bỏ toàn bộ**, làm lại thành trải nghiệm không gian 3D (CSS perspective, sàn caro, tranh treo tường, điều hướng qua ô cửa).

DAW: Evaluator vòng 1 dù khen "design fidelity tuyệt vời" vẫn bắt được **thiếu feature lõi**: clip không kéo được trên timeline, không có panel nhạc cụ, không có editor hiệu ứng.

---

## 5. Nghịch lý cốt lõi: model giỏi lên → gỡ bớt harness

Đây là phần "twist" của bài, khác hẳn trực giác thông thường:

- **Sonnet 4.5:** cần context reset, context anxiety mạnh.
- **Opus 4.5:** anxiety nhẹ hơn, vẫn cần sprint để giữ mạch.
- **Opus 4.6:** "lập kế hoạch kỹ hơn, duy trì task agentic lâu hơn" → **bỏ hẳn được sprint** mà chất lượng không giảm. Evaluator chỉ còn đáng tiền cho **task nằm ở rìa khả năng** của model.

Tác giả **gỡ từng component một**, đo tác động mỗi lần (gỡ ẩu, không hiểu mảnh nào đang "chịu lực" thì hỏng).

> **"Mỗi component trong harness mã hóa một giả định về việc model KHÔNG tự làm được — và giả định đó đáng được stress-test."**

> **"Không gian các harness thú vị KHÔNG co lại khi model giỏi lên. Nó DỊCH CHUYỂN."** — gỡ scaffold cũ lỗi thời, nhưng mở ra tổ hợp mới ở tầng khó hơn.

---

## 6. Liên hệ với công việc mình (Joy Loyalty / dev daily)

- **Skill workflow của mình chính là harness thu nhỏ.** `/news-daily` spawn 6 agent song song ghi ra file riêng, rồi main agent tổng hợp index → đúng pattern **decomposition + file-based handoff** trong bài. `career-ops` (14 skill mode) hôm qua cũng vậy.
- **Tách generate/evaluate áp được ngay:** khi dùng agent viết code cho Joy, đừng để chính nó tự phán "ổn rồi". Cho một pass review riêng (như `/code-review`) với tiêu chí chấm rõ → bắt được lỗi self-eval bỏ qua.
- **Evaluator phải chạy thật:** với app Shopify/Polaris, chấm bằng cách *bấm thử flow* (Playwright/Claude-in-Chrome) giá trị hơn nhìn screenshot — y hệt bug "đổ màu" trong bài.
- **Cân nhắc chi phí:** harness đầy đủ đắt 20×. Với task nằm trong tầm model làm solo được thì **đừng over-engineer harness** — chỉ bung full scaffold cho task ở rìa khả năng.
- **Prompt = giả định:** chữ trong tiêu chí đánh giá lái kết quả. Khi viết prompt cho agent nội bộ, để ý mình đang vô tình "ép" phong cách nào.

---

## 7. Ghi nhớ nhanh

> Harness không phải càng nhiều tầng càng tốt. **Mỗi tầng là một cái nạng cho khuyết điểm hiện tại của model.** Model khỏe lên thì bỏ nạng đi — nhưng luôn có ngọn núi cao hơn cần nạng mới. Việc của kỹ sư AI là **liên tục tìm tổ hợp harness mới** cho tầng khó kế tiếp.

**Liên quan:** [[Harness trong AI là gì]] · Skill-based workflow (`/news-daily`, `career-ops`) là ví dụ decomposition thực tế.
