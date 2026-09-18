# 🏗️ System Design — 2026-09-18

> Tuần này Uber Engineering ra một loạt bài chất lượng về reliability trong microservice: chống retry storm, tự động lập bản đồ dependency, tách controller scaling — cộng thêm Cloudflare viết lại module registry của Workers.

## ⭐ [How Uber Protects Against Retry Storms](https://www.uber.com/us/en/blog/protecting-against-retry-storms/) — (Uber Engineering, 17/09/2026)

**Đây là gì:** Case study về **retry storm** — hiện tượng khi một service bị lỗi, các service gọi nó tự động retry, rồi service gọi tầng trên nữa cũng retry, làm traffic bị khuếch đại theo cấp số nhân dọc chuỗi dependency. Uber giải bài toán này bằng một khái niệm mới gọi là **error ownership** (quyền "sở hữu" lỗi).

**Chi tiết:**
- Bài chỉ ra mức khuếch đại: ở độ sâu 3 tầng dependency, traffic có thể lên **8× baseline**; trường hợp xấu nhất trong service mesh của Uber lên tới **2^25**.
- Vấn đề gốc là "retry được áp dụng đồng loạt thay vì có điều kiện" — mọi service trên chuỗi đều retry, kể cả service chỉ *truyền lại* lỗi chứ không phải nơi sinh ra lỗi.
- Giải pháp: một service chỉ "own" lỗi khi **các outbound call của chính nó đều thành công mà nó vẫn trả về lỗi**. Thông tin ownership được gắn vào header `x-uber-error-claim` và truyền ngược lên upstream; caller chỉ retry khi service đó thực sự own lỗi.
- Logic này nằm trong **retry middleware dùng chung**, không phải code riêng từng service — nên toàn bộ mesh được bảo vệ mà team product không phải làm gì.
- Kết quả: trong sự cố Core Entity service tháng 11/2025, hệ thống chặn được **9,5 triệu request thừa**; bán kính lan (retry storm radius) tối đa giảm từ **25 xuống 3**, trung bình từ **20 xuống 2**; ngăn được mức tăng traffic 46–135% đổ lên service đang suy yếu.
- Trade-off bài tự nêu: cần hạ tầng Service Dependency Analysis đi kèm, và khoảng **2% case lỗi trùng hợp ngẫu nhiên** phải xử lý bằng correlation memory.

**Vì sao đáng đọc:** Joy Loyalty cũng là một chuỗi gọi lồng nhau — Shopify webhook → Cloud Functions → Firestore → Admin GraphQL API. Khi Firestore hay Shopify API chậm, retry mặc định ở mọi tầng (Cloud Tasks, axios retry, Functions auto-retry) đúng là công thức tạo retry storm và đốt quota. Bài này cho một mental model rất sắc: **đừng retry ở mọi tầng, chỉ retry ở tầng thực sự sinh lỗi** — áp dụng được ngay khi review lại chính sách retry của webhook handler.

## [Halving the Time: How Uber Eats Rebuilt Its Search Pipeline](https://www.uber.com/us/en/blog/uber-eats-search-pipeline/) — (Uber Engineering, 10/09/2026)

**Đây là gì:** Case study tối ưu latency một search pipeline nhiều tầng (retrieval → hydration → ranking → presentation), giảm được một nửa thời gian search của Uber Eats.

**Chi tiết:**
- Nguyên nhân gốc theo bài: pipeline "tích tụ nhiều quyết định kiến trúc hợp lý khi đứng riêng, nhưng cộng lại thành lãng phí".
- Các tối ưu đã triển khai và mức giảm tương ứng: tối ưu retrieval ~**120ms**, tách feature population / ranking hơn **100ms**, tối ưu ads serving ~**130ms**, tuning hạ tầng (parallel encoding, nén embedding, connection pooling) ~**200ms**.
- Cách làm đáng chú ý: tách hydration thành 2 pha song song (ranking và presentation) để bỏ dữ liệu không cần thiết khỏi critical path; audit DAG để xoá **false dependency** — những phụ thuộc tưởng là bắt buộc nhưng thực ra không phải; thêm **request hedging** (gửi request dự phòng song song để cắt đuôi p99).
- Hướng đi tiếp: **microbatching** end-to-end (candidate chảy qua retrieval/hydration/ranking đồng thời thay vì tuần tự), và **product-based search** — chuyển từ xử lý mức item sang mức product, thu nhỏ catalog khoảng **100 lần**, kỳ vọng giảm hơn 50% p99.

**Vì sao đáng đọc:** Hai kỹ thuật ở đây dùng được trực tiếp cho dashboard Joy: audit "false dependency" trong chuỗi `await` (rất nhiều query Firestore thực ra chạy song song được nhưng đang xếp hàng tuần tự), và tách phần dữ liệu chỉ để hiển thị ra khỏi critical path để trả kết quả sớm hơn.

## [Large-Scale Automated Dependency Analysis Across Uber's Service Mesh](https://www.uber.com/us/en/blog/automated-dependency-analysis/) — (Uber Engineering, 15/09/2026)

**Đây là gì:** Bài "chị em" với bài retry storm ở trên — hệ thống tự động lập bản đồ dependency giữa các service, phân loại mỗi quan hệ là **fail-close** (dependency chết thì caller cũng chết) hay **fail-open** (dependency chết nhưng caller vẫn chạy được). Nói cách khác: xác định đâu là dependency thật sự sống còn.

**Vì sao đáng đọc:** Điểm hay nhất là cách họ né distributed tracing — tracing có sampling rate quá thấp nên bỏ lỡ lỗi. Thay vào đó họ đặt middleware (YARPC) để **đối chiếu lỗi inbound với lỗi outbound trên 100% traffic production**, rồi dùng công thức xác suất để suy ra quan hệ. Tư duy "quan sát mọi lỗi thay vì lấy mẫu" rất đáng mang về khi làm observability cho Functions — Cloud Trace cũng sampling, mà log lỗi thì đầy đủ.

## [From One Horizontal Scaling Controller to Many: Evolving Uber's Compute Platform](https://www.uber.com/us/en/blog/evolving-ubers-compute-platform/) — (Uber Engineering, 09/09/2026)

**Đây là gì:** Bài về Kubernetes control plane: khi Uber thêm tính năng regional failover, họ cần nhiều "orchestrator" cùng tác động lên việc scale một workload. Thay vì nhồi thêm logic vào UberDeployment Controller sẵn có, họ tạo **ServiceScale Controller** + CRD riêng để mỗi orchestrator "khai báo mong muốn scale của riêng mình".

**Vì sao đáng đọc:** Đây là bài học separation of concerns ở tầng hạ tầng: giữ deployment path ổn định bằng cách tách nơi ghi state, thay vì làm phình một component đã critical. Bài cũng thẳng thắn về cái giá phải trả — **eventual consistency, stale cache, concurrent write** — phải xử lý bằng guardrail và cơ chế tự healing. Đúng nhóm vấn đề gặp khi nhiều Cloud Function cùng ghi vào một document Firestore.

## [How we rebuilt Cloudflare Workers' module registry for Node.js compatibility](https://blog.cloudflare.com/workers-module-registry-nodejs/) — (Cloudflare Blog, 09/09/2026)

**Đây là gì:** Cloudflare viết lại module registry trong `workerd` (runtime open-source của Workers) để tương thích Node.js. Điểm kiến trúc cốt lõi: coi **module specifier là URL thật** thay vì đường dẫn filesystem.

**Vì sao đáng đọc:** Ba thay đổi có hệ quả kiến trúc rõ rệt — **lazy compilation** (module chỉ compile khi lần đầu được import, thay vì compile cả bundle lúc khởi động), **shared code cache** (nhiều V8 isolate replica dùng chung, không compile trùng), và bỏ giới hạn compressed bundle, nâng lên **64 MiB trên mọi plan**. Node.js compat giờ bật mặc định; registry mới nằm sau flag `new_module_registry` và không tự bật cho worker cũ. Cold start của Cloud Functions v2 cũng chịu đúng loại chi phí này — đọc để hiểu vì sao "chia module nhỏ, import khi cần" lại ăn tiền ở serverless.
