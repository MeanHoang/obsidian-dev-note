# Glossary — Thuật ngữ trong Domain-Driven Refactoring

> File sống: gặp từ mới trong sách → thêm vào đây. Mỗi từ: định nghĩa ngắn + ví dụ đời sống/Joy context nếu cần.
> Mỗi thuật ngữ là một heading — note chương link về đây dạng `[[Glossary - Thuật ngữ#Tên thuật ngữ]]`.
> Chi tiết đầy đủ xem note chương tương ứng (link cuối mỗi mục).

## Từ chung / quy trình

### -centric

Hậu tố "lấy ... làm trung tâm". *Domain-centric architecture* = kiến trúc xoay quanh domain (nghiệp vụ), mọi thứ khác (DB, framework, UI) là chi tiết phụ thuộc vào nó — ngược với database-centric hay framework-centric.

### Agile

Triết lý phát triển theo chu kỳ lặp ngắn (1-2 tuần), ship phần nhỏ chạy được rồi điều chỉnh theo feedback, thay vì lên kế hoạch lớn làm một mạch. *Như dọn tiệc từng món để xem khách ăn thế nào, thay vì nấu cả 10 món rồi mới biết khách không ăn cay.* Sách dựa trên tinh thần này: refactor từng bước nhỏ, không big-bang rewrite.

### Legacy system

Hệ thống cũ đang chạy, đang tạo ra tiền, nhưng khó sửa/khó hiểu. Điểm xuất phát của cả cuốn sách.

### Big ball of mud

Codebase không có cấu trúc rõ ràng, mọi thứ phụ thuộc chằng chịt vào nhau. *Như căn phòng kho lâu năm: đồ vẫn ở đó, vẫn dùng được, nhưng lấy một món phải dỡ cả đống.* → [[6 - Transitioning from Chaos]]

### Technical debt

"Nợ kỹ thuật": những lựa chọn nhanh-gọn-tạm trước đây mà giờ phải trả lãi bằng thời gian sửa bug, thêm feature chậm.

## Strategic DDD (khoanh vùng bài toán)

### Domain

Lĩnh vực nghiệp vụ mà phần mềm phục vụ. Với Joy: loyalty/retention cho merchant Shopify.

### Subdomain

Mảnh con của domain, chia 3 loại:

- **Core domain** — phần tạo lợi thế cạnh tranh, đáng đầu tư công sức nhất (Joy: points, rewards, tiers).
- **Supporting subdomain** — cần thiết nhưng không phải lợi thế (vd: email notification).
- **Generic subdomain** — ai cũng có, mua/dùng sẵn được (vd: auth, billing).

*Như mở quán phở: nước dùng là core (bí quyết riêng), chỗ ngồi là supporting, máy POS là generic — mua sẵn, không tự chế.* → [[3 - Strategic Patterns]]

### Bounded context

Ranh giới mà trong đó một model và ngôn ngữ có nghĩa nhất quán. Cùng một từ "customer" ở context Sales và context Shipping có thể là 2 model khác nhau. *Như từ "anh" trong gia đình và trong công ty — cùng từ, nghĩa theo ngữ cảnh.* → [[3 - Strategic Patterns]]

### Context mapping

Vẽ bản đồ quan hệ giữa các bounded context (ai phụ thuộc ai, dạng quan hệ gì: partnership, customer-supplier, anti-corruption layer...). → [[3 - Strategic Patterns]]

### Ubiquitous language

Ngôn ngữ chung giữa dev và business, dùng nhất quán từ cuộc họp đến tên class/function. Nếu business gọi là "redeem" thì code không được gọi là "exchange". → [[1 - Evolution of Domain-Driven Design]]

### EventStorming

Workshop dán sticky note để cả team (dev + business) cùng khám phá domain qua các sự kiện nghiệp vụ ("đơn hàng được tạo", "điểm được cộng"...). → [[2 - Understanding Complexity - Problem and Solution Space]]

### Cynefin

Framework phân loại độ phức tạp của vấn đề (clear / complicated / complex / chaotic) để chọn cách tiếp cận phù hợp. → [[2 - Understanding Complexity - Problem and Solution Space]]

## Tactical DDD (xây model trong từng context)

### Anemic model

Anti-pattern: object chỉ chứa data (getter/setter), logic nghiệp vụ bị tách hết ra service bên ngoài — mất đóng gói, logic rải rác. *Như nhân viên chỉ cầm hồ sơ của mình nhưng việc gì cũng phải nhờ phòng hành chính làm hộ.* Ngược lại là **rich domain model**: data + behavior đi cùng nhau. → [[4 - Tactical Patterns]]

### Entity

Object có danh tính (ID) xuyên suốt vòng đời, dù thuộc tính thay đổi. Vd: một member của chương trình loyalty — đổi tên, đổi email vẫn là member đó.

### Value object

Object không có danh tính, chỉ là giá trị; hai value object bằng nhau nếu thuộc tính bằng nhau. Vd: số tiền `{amount: 100, currency: 'USD'}`, địa chỉ. *Tờ 100k này với tờ 100k kia là như nhau — không ai quan tâm "danh tính" tờ tiền.*

### Aggregate

Cụm entity + value object được coi là một đơn vị nhất quán, có một **aggregate root** làm cổng vào duy nhất — mọi thay đổi bên trong phải đi qua root. *Như giỏ hàng: muốn sửa item phải qua giỏ, không thò tay sửa item trực tiếp.* → [[4 - Tactical Patterns]]

### Domain event

Sự kiện nghiệp vụ đã xảy ra, đặt tên ở thì quá khứ: `PointsEarned`, `RewardRedeemed`. Là chất keo để các context giao tiếp mà không phụ thuộc trực tiếp. → [[4 - Tactical Patterns]]

### Repository

Lớp trừu tượng việc lưu/lấy aggregate, che giấu chi tiết DB. Code domain chỉ biết `memberRepo.findById()`, không biết đằng sau là Firestore hay Postgres.

## Refactoring & migration

### Refactoring

Thay đổi cấu trúc code mà không đổi hành vi bên ngoài, đi từng bước nhỏ có test bảo vệ. → [[5 - Introducing Refactoring Principles]]

### Layered architecture

Tổ chức code theo tầng kỹ thuật (controllers / services / repositories). Khởi đầu nhanh nhưng một thay đổi nghiệp vụ phải đụng nhiều folder. Điểm xuất phát của hành trình refactor trong sách.

### Modular monolith

Vẫn là một app deploy chung, nhưng bên trong chia module theo domain với ranh giới rõ ràng (module này không import thẳng vào ruột module kia). Bước trung gian an toàn trước khi cân nhắc microservices. → [[6 - Transitioning from Chaos]]

### Strangler fig pattern

Thay thế hệ thống cũ dần dần: xây phần mới chạy song song, route traffic sang từng phần, đến khi phần cũ "bị bóp nghẹt" thì gỡ bỏ. *Như cây đa bóp nghẹt cây chủ: mọc bám quanh, lớn dần, cuối cùng thay thế hẳn.* → [[6 - Transitioning from Chaos]]

### Testing pyramid

Chiến lược test: nhiều unit test (rẻ, nhanh) ở đáy, ít integration test ở giữa, rất ít e2e test (đắt, chậm) ở đỉnh. Lưới an toàn bắt buộc trước khi refactor. → [[5 - Introducing Refactoring Principles]]

## Events, CQRS & microservices

### CQRS

Command Query Responsibility Segregation — tách model ghi (command) và model đọc (query) riêng — bên ghi tối ưu cho nghiệp vụ, bên đọc tối ưu cho hiển thị. *Như bếp nhà hàng: phiếu order (ghi) và menu có hình (đọc) là hai thứ khác nhau dù cùng nói về món ăn.* → [[7 - Integrating Events with CQRS]]

### Event sourcing

Thay vì lưu trạng thái hiện tại, lưu chuỗi sự kiện đã xảy ra; trạng thái = replay các event. *Như sổ tiết kiệm ngân hàng: số dư là kết quả cộng dồn các giao dịch, không phải con số sửa đè.* → [[7 - Integrating Events with CQRS]]

### Eventual consistency

Dữ liệu giữa các phần hệ thống có thể lệch nhau trong chốc lát, nhưng cuối cùng sẽ khớp. Cái giá phải trả khi tách hệ thống bằng event.

### Event versioning & upcasting

Khi schema của event thay đổi theo thời gian, cần chiến lược để đọc được event cũ: *upcasting* = chuyển event version cũ lên version mới lúc đọc. → [[11 - Dealing with Events and Their Evolution]]

### Saga & Process manager

Pattern điều phối một quy trình nghiệp vụ chạy qua nhiều service/context (vd: đặt hàng → trừ kho → thanh toán → cộng điểm), kèm **compensating transaction** (hành động bù) khi một bước thất bại — vì không có transaction chung giữa các service. *Như đặt tour: vé máy bay đặt xong mà khách sạn hết phòng thì phải chủ động hủy vé (bù), không có nút "rollback cả chuyến đi".* → [[12 - Orchestrating Complexity - Business Processes]]

## Liên kết

- [[0 - Introduction & Reading Guide]] — guide đọc cả cuốn.
