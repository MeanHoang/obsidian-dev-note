# 🏗️ System Design — 2026-09-21

> Chủ đề hôm nay: tối ưu tài nguyên bằng toán học thay vì thêm máy (Cloudflare), biến vận hành thủ công thành workflow engine có thể resume (Discord), và cách các team lớn giữ chất lượng khi tốc độ ship tăng vọt.

## ⭐ [Saving another 100TB of RAM with math (and Rust)](https://blog.cloudflare.com/saving-100-tb-of-ram-with-math/) — (Cloudflare Blog, 18/09/2026)
**Đây là gì:** Case study tối ưu bộ nhớ của **consistent hashing** — kỹ thuật chia request cho một tập server sao cho khi thêm/bớt server thì chỉ một phần nhỏ key bị chuyển chỗ (thay vì `hash % N` làm xáo trộn toàn bộ). Hiện thực phổ biến là "hash ring": mỗi server được nhân bản thành hàng trăm/hàng nghìn điểm ảo trên vòng hash để phân bố tải đều.

**Chi tiết:**
- Hệ thống liên quan là **Pingora Backend Router (PBR)** — service load-balancing nội bộ của Cloudflare, dùng thư viện `pingora-ketama`. Vì mỗi tổ hợp tính năng cần một ring riêng, PBR phải giữ hàng chục ring với hàng triệu hash point, có trường hợp ngốn tới **6GB RAM** mỗi tiến trình.
- Tối ưu 1 — **nén struct**: đổi trường index từ `u32` xuống `u16` (vì thực tế chưa tới 65k server), rồi pack byte cẩn thận trong Rust → giảm **25%** kích thước.
- Tối ưu 2 — **cắt số lượng hash point**: phân tích thống kê chứng minh **90%** số hash point gần như không cải thiện độ đều của phân bố, nên bỏ đi được mà không tăng sai số đáng kể. Coefficient of variation (độ lệch phân bố tải) sau tối ưu ở mức **~8%** so với ~99% ở cấu hình chưa tối ưu.
- Trade-off: không thể đổi ring một phát. Họ phải **rollout theo giai đoạn, chạy song song hai phiên bản ring**, vì đổi ring đột ngột = key nhảy backend = cache miss hàng loạt và origin bị dội tải.
- Kết quả: tiết kiệm **100TB RAM toàn cầu**; thay đổi đã được đẩy ngược về crate open-source `pingora-ketama`.

**Vì sao đáng đọc:** Bài học trực tiếp cho Joy Loyalty — trước khi scale up instance vì "hết RAM", hãy đo xem cấu trúc dữ liệu in-memory (cache member/tier, sharding key) có đang trả giá cho những tham số mặc định mà không ai từng verify bằng số liệu hay không.

## ⭐ [How Discord Automates ScyllaDB Clusters at Scale](https://discord.com/blog/how-discord-automates-scylladb-clusters-at-scale) — (Discord Engineering, 08/05/2026)
**Đây là gì:** Case study xây **control plane** cho database cluster — tức một service chuyên điều phối vòng đời hạ tầng (tạo node, mở rộng cluster, restart) thay cho người gõ lệnh tay. Đây là pattern "orchestration engine" áp dụng cho ops chứ không phải cho business logic.

**Chi tiết:**
- Bối cảnh: team Persistence Infrastructure quản **hàng chục cluster, tổng cộng hàng trăm database node**, bằng script rời rạc. Một lần dựng shadow cluster mất **hơn 36 giờ** và chỉ cần sai một bước là phải làm lại từ đầu.
- Kiến trúc **Scylla Control Plane (SCP)** chia 3 lớp: **Task** (đơn vị việc nhỏ nhất, ở mức node hoặc cluster, có precondition check trước khi chạy) → **Workflow** (chuỗi task định nghĩa bằng YAML, cấu hình được mức song song và retry) → **Job** (trạng thái thực thi được lưu bền, nên gián đoạn xong có thể resume đúng chỗ).
- Nguyên tắc thiết kế: **idempotency** (chạy lại một task không gây hại), **safe-by-default precondition**, và ràng buộc concurrency theo availability zone — mở rộng cluster **từng zone một**, tối đa **2 node restart đồng thời**.
- Trade-off nêu rõ: chọn **SQLite** thay vì state store phân tán để đơn giản vận hành, chấp nhận giới hạn scale; chọn **YAML workflow** thay vì code biên dịch để đổi tham số không phải build lại.
- Kết quả: dựng shadow cluster từ **~36 giờ xuống dưới 2 giờ**; ops chuyển từ "ngồi canh terminal" sang "kích hoạt rồi quay lại kiểm tra".

**Vì sao đáng đọc:** Mô hình Task/Workflow/Job có state bền là bản thiết kế chuẩn để thay thế mọi script migration/backfill thủ công — rất hợp cho các job dữ liệu dài hơi trên Firebase/GCP (tính lại điểm, migrate tier hàng loạt) vốn hay chết giữa chừng và không resume được.

## [River: how Shopify takes security work from a fix to merge](https://shopify.engineering/river-vulnerability-remediation) — (Shopify Engineering, 02/09/2026)
**Đây là gì:** Agent tự động vá lỗ hổng bảo mật, chạy trong Slack và làm việc trực tiếp trên monorepo "World" của Shopify với đúng môi trường dev và convention mà người thật dùng.

**Chi tiết:**
- Điểm thiết kế đáng chú ý nhất: River coi mọi bản ghi trong ledger của nó là **claim cần verify**, không phải fact — trước khi hành động nó đối chiếu lại với trạng thái thật của repo, PR và vulnerability tracker.
- Pipeline: xác nhận lỗ hổng còn tồn tại → tìm xem đã có fix đang chạy chưa → rebase PR cũ lên head, regenerate lockfile, sửa các lỗi cơ học do nâng dependency → nếu cần phán đoán con người thì **giữ nguyên context điều tra và hỏi đúng một câu rõ ràng** thay vì ném nguyên vấn đề cho dev → sau merge còn verify lại code vulnerable đã biến mất khỏi default branch.
- Số liệu: trong **11 ngày đầu** của workflow dependency, backlog issue mở giảm **~70%** (khoảng hai phần ba là merge trực tiếp, phần còn lại River xác nhận là đã lỗi thời hoặc đã fix nơi khác). Tỉ lệ security merge tăng từ **~10% lên 80%** nhờ merge queue có gate về độ "tươi" của branch.

**Vì sao đáng đọc:** Pattern "verify state trước khi act" và "handoff kèm context + một câu hỏi duy nhất" áp dụng được cho bất kỳ automation nào chạm vào dữ liệu production — kể cả job đồng bộ dữ liệu merchant.

## [AI Changed How Spotify Builds. What We Learned (and Fixed) About Quality at Higher Velocity](https://engineering.atspotify.com/2026/9/ai-changed-how-spotify-builds-what-we-learned-and-fixed-about-quality-at-higher-velocity) — (Spotify Engineering, 16/09/2026)
**Đây là gì:** Bài tổng kết của Head of Technology & Platforms về việc tốc độ thay đổi code tăng nhanh hơn khả năng thích nghi của các lớp kiểm chứng (verification control), kèm bốn nhóm sự cố thật và cách vá.

**Chi tiết:**
- Scale làm bối cảnh: **777 triệu MAU**, hơn **2.000 loại thiết bị**, **100 triệu client đồng thời** lúc đỉnh, **11–12 triệu backend request/giây**, gần **3.000 service production**.
- Bốn vấn đề: (1) content processing — hơn **500K** bài hát/video/podcast/audiobook mỗi ngày, gặp lỗi xử lý âm thầm và thiếu capacity transcode video; (2) fleet update — tự động nâng dependency nhanh hơn nhưng sinh failure mode mới, phải siết safeguard và dời lịch chạy vào giờ hành chính của team; (3) thiếu compute — nhu cầu AI toàn ngành làm cạn capacity dự phòng, failover vùng phơi ra những lỗi trước đây vô hại, họ nhân đôi reserved edge capacity; (4) chất lượng app mobile.
- Kết luận đáng chú ý: theo dữ liệu phân tích của họ, **code do AI viết không đóng góp đáng kể trực tiếp vào các sự cố** — vấn đề nằm ở *volume* thay đổi vượt quá năng lực của hệ thống kiểm chứng.

**Vì sao đáng đọc:** Nếu bạn đang ship nhanh hơn nhờ AI, bottleneck thật không phải chất lượng từng PR mà là CI/staging/monitoring có theo kịp số lượng thay đổi hay không.

## [Cost Attribution in Discord's API](https://discord.com/blog/cost-attribution-in-discords-api) — (Discord Engineering, 30/06/2026)
**Đây là gì:** Cách quy chi phí hạ tầng về từng feature trong một codebase Python hợp nhất chạy trên hàng trăm Kubernetes deployment, với hơn **1.700 endpoint** và **700 background task** — mà không phải tái cấu trúc hạ tầng.

**Chi tiết:**
- Hai cách tiếp cận ngây thơ đều sai: chia đều chi phí theo số request (endpoint không tiêu tốn tài nguyên như nhau), và dùng latency làm proxy (latency bị chi phối bởi lời gọi downstream chứ không phải CPU time). Mô hình concurrency **gevent** còn khiến một task nặng CPU làm chậm lây các request khác.
- Giải pháp: mở rộng CPU profiler để mỗi mẫu (sample) mang nhãn **feature + endpoint**, lấy mẫu ở **10Hz**, đẩy về Pyroscope; sau đó một data pipeline join dữ liệu billing của cloud với dữ liệu profiling để ra chi phí thật theo feature.

**Vì sao đáng đọc:** Đúng bài toán của app Shopify chạy trên GCP — muốn biết feature nào (widget, tính điểm, referral) đang đốt tiền Cloud Run thì phải gắn nhãn ở tầng profiler, chứ log request và hóa đơn GCP không bao giờ tự ghép lại được.
