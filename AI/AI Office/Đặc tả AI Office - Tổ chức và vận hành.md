# Đặc tả AI Office — Tổ chức và vận hành

> Trạng thái: Bản thảo để cùng chủ sản phẩm làm rõ. Các đề xuất trong tài liệu chưa mặc nhiên là quyết định đã chốt.
> Nguồn yêu cầu: [[Vấn đề và hướng đi mới]]. Không kế thừa các bản thiết kế đã bỏ trước đó.
> Cập nhật: 16/10/2026.

## 1. Mục đích sản phẩm

AI Office giúp chủ sản phẩm tổ chức, cấu hình và điều hành các đội ngũ AI làm việc trên nhiều project thông qua một nơi quản lý chung.

Người dùng nhìn thấy đội nào đang làm việc gì, quy trình đang ở đâu, kết quả nào đã có bằng chứng và quyết định nào đang chờ mình. Họ có thể hiểu và chỉnh cách đội ngũ làm việc mà không phải tự viết harness hoặc đọc toàn bộ code, terminal và hội thoại.

App cần giải quyết hai vấn đề chính:

1. Thông tin đang nhiều chữ và phân tán giữa môi trường chạy agent, Slack, email và hội thoại; người dùng khó theo dõi bối cảnh.
2. Role, quy tắc làm việc và workflow chủ yếu được truyền đạt qua chat; khó nhìn lại, sửa, tái sử dụng và biết phiên bản nào đang áp dụng.

Chưa mặc định app phải thay thế toàn bộ Slack hoặc email. Trước mắt cần xác định cách gom ngữ cảnh và truyền đạt công việc; phạm vi tích hợp dịch vụ sẽ chốt riêng.

## 2. Những yêu cầu anh đã nêu rõ

| Mã | Yêu cầu |
|---|---|
| R01 | Dựa trên cấu trúc Orca: một project là một team; một workspace là một đội ngũ được tạo ra trong team đó. |
| R02 | Có phần lõi dùng chung được quản lý ở AI Office để mang đội ngũ sang nhiều project. |
| R03 | Thêm, sửa và cấu hình role bằng ngôn ngữ tự nhiên. |
| R04 | Chọn agent/provider, model và effort bằng UI trong phạm vi môi trường chạy hỗ trợ. |
| R05 | Mỗi role có session riêng; các session tương tác như những nhân sự trong đội. |
| R06 | Giữ kiểu ghi chép của ship: phân tích, bằng chứng và quyết định của chủ sản phẩm. |
| R07 | Xây workflow bằng kéo thả và ngôn ngữ tự nhiên; AI chuyển cấu hình đó thành harness làm việc. |
| R08 | Có một session/role phụ trách hỗ trợ xây dựng workflow và harness. |
| R09 | Workflow khai báo được báo cáo cần tạo, tên báo cáo và gate chờ chủ sản phẩm quyết định. |
| R10 | Có Thư ký dùng chung để hỗ trợ xây workflow và truyền lời tới các team/đội. |
| R11 | Mỗi đội mặc định có PM làm đầu mối chat chính của người dùng. |
| R12 | Chưa cần chốt toàn bộ role chuyên môn và thứ tự từng bước phát triển sản phẩm ở giai đoạn này. |
| R13 | Giữ cơ chế `progress.md` của ship để lưu tiến trình bền vững và tiếp tục sau gián đoạn hoặc đổi agent. |
| R14 | Có nhiều workflow; chọn workflow phù hợp khi giao việc. UI biên tập theo canvas kéo thả, nối khối như Shopify Flow. |
| R15 | Nhân sự chọn agent chính và fallback, ví dụ Claude hết quota thì chuyển sang Codex; cơ chế vận hành chi tiết cần kiểm chứng khi triển khai. |

## 3. Mô hình tổ chức

```text
AI Office
├── Thư ký chung
├── Thư viện dùng chung
│   ├── Role mẫu
│   ├── Workflow mẫu
│   ├── Quy tắc làm việc / kỹ năng
│   └── Mẫu báo cáo và gate
└── Project / Team
    ├── Hồ sơ và cấu hình riêng của project
    └── Workspace / Đội thực hiện một công việc
        ├── PM — đầu mối điều phối và trao đổi với người dùng
        ├── Các nhân sự theo role được gán
        │   └── Mỗi nhân sự gắn với session thực tế
        ├── Workflow và phiên bản cấu hình được áp dụng
        └── Hồ sơ công việc, kết quả, bằng chứng, báo cáo, quyết định
```

### 3.1. Các khái niệm cần phân biệt

| Khái niệm | Ý nghĩa | Ví dụ |
|---|---|---|
| Project / Team | Sản phẩm hoặc dự án có bối cảnh lâu dài | Joy, một app học ngoại ngữ |
| Workspace / Đội | Đội được lập để thực hiện một phạm vi công việc trong project | Đội làm tính năng nhắc học |
| Role mẫu | Định nghĩa trách nhiệm, quy tắc, đầu ra và cấu hình mặc định | Developer yêu cầu viết test phát hiện lỗi trước khi sửa |
| Nhân sự trong đội | Bản gán một role vào workspace, có cấu hình hiệu lực riêng | Developer của đội nhắc học |
| Session | Hội thoại và tiến trình agent thực sự thực hiện vai trò đó | Một session Claude hoặc Codex được gắn định danh |
| Workflow mẫu | Định nghĩa các bước, tác nhân, bàn giao, báo cáo và gate | Quy trình sửa lỗi |
| Lần chạy | Một lần thực hiện workflow với đầu vào và phiên bản cụ thể | Chạy quy trình sửa lỗi cho lỗi A |
| Hồ sơ công việc | Bối cảnh và lịch sử có thể đọc lại ngoài transcript | Mục tiêu, phân tích, quyết định, bằng chứng |

Một role mẫu có thể được dùng trong nhiều đội. Session và bối cảnh của từng đội không được dùng chung một cách ngầm định.

Một role không bắt buộc phải có session đang chạy ngay khi tạo đội. Cách khởi tạo session ngay hoặc khi đến lượt làm là lựa chọn vận hành còn cần chốt.

## 4. Trách nhiệm của các tác nhân mặc định

### 4.1. Thư ký của AI Office

- Trao đổi với người dùng ở phạm vi toàn công ty.
- Giúp tạo hoặc chỉnh role, workflow và các cấu hình dùng chung.
- Nhận đề bài, xác định project/đội đích và chuyển thông tin đúng nơi.
- Tổng hợp đội đang chạy, đội đang chờ và quyết định cần chủ sản phẩm xử lý.
- Khi chuyển lời, hiển thị người nhận và lưu được quan hệ giữa yêu cầu gốc với phản hồi.
- Không tự trở thành PM của mọi đội hoặc làm mất trách nhiệm của PM trong đội đó.

### 4.2. PM của mỗi workspace

- Là đầu mối chat chính của người dùng cho công việc của đội.
- Giữ mục tiêu, phạm vi, kế hoạch và trạng thái hiện hành.
- Giao việc cho đúng nhân sự theo workflow và theo dõi bàn giao.
- Gom các vấn đề cần quyết định thành câu hỏi cụ thể, có bằng chứng và phương án.
- Báo cáo tiến độ từ kết quả thực tế; phân biệt đang chạy, bị chặn, chưa kiểm chứng và đã hoàn thành.
- Không dùng lời khẳng định của chính agent làm bằng chứng duy nhất rằng công việc đã đạt.

### 4.3. Người hỗ trợ xây workflow / harness

Đề xuất ban đầu: đây là một năng lực của Thư ký. Nếu công việc biên soạn nặng hoặc cần tách context, có thể giao cho một session chuyên trách, nhưng người dùng vẫn trao đổi qua Thư ký.

Trách nhiệm: chuyển ý định thành cấu hình có cấu trúc, kiểm tra mâu thuẫn, giải thích tác động, tạo bản thay đổi để người dùng xem và xuất harness phù hợp môi trường chạy.

Việc gộp hay tách session này chưa được chốt.

### 4.4. Các role chuyên môn

Thư viện cho phép thêm Developer, Tester, Tech Lead, Designer hoặc vai trò khác. Chưa ấn định bộ role và quy trình sản phẩm hoàn chỉnh trong bản đặc tả tổ chức này.

Mỗi role phải có tối thiểu:

- Tên, mục đích và trách nhiệm.
- Đầu vào cần nhận và đầu ra phải bàn giao.
- Quy tắc làm việc, kỹ năng, phạm vi công cụ và quyền thực hiện.
- Cấu hình agent/model mặc định và cấu hình có thể thay đổi trong từng đội.
- Cách báo cáo tiến độ, câu hỏi bị chặn và kết quả.
- Phiên bản để biết đội đang sử dụng định nghĩa nào.

## 5. Ranh giới giữa AI Office và Orca

**Đang chờ quyết định Q01:** AI Office dùng Orca làm môi trường chạy bên dưới hay tự thực hiện cả việc quản lý/chạy session?

Đề xuất của em là tận dụng Orca cho project, workspace/worktree, terminal/session và các khả năng điều phối đã có; AI Office tập trung vào tổ chức, cấu hình, ngữ cảnh và cách trình bày cho người dùng.

Nếu chọn hướng này:

| Phần việc | Nơi chịu trách nhiệm đề xuất |
|---|---|
| Định danh project, workspace và terminal thực tế | Orca; AI Office giữ liên kết tới định danh đó |
| Role mẫu, workflow mẫu và cấu hình nghiệp vụ | AI Office |
| Khởi chạy và quan sát agent thực tế | Qua adapter Orca, theo khả năng đã kiểm chứng |
| Hội thoại và chuyển thông tin | AI Office định tuyến; adapter giao nhận với session đúng |
| Hiển thị báo cáo, bằng chứng và quyết định | AI Office |
| Trạng thái bước, gate và lần chạy | Cần chốt một nơi ghi chính; không ghi hai bản độc lập |

Đã kiểm tra CLI Orca trên máy: có nhóm lệnh project, worktree, terminal, orchestration task/worker/gate. Schema của `worker-start` có tùy chọn model/effort với các giới hạn theo agent và không áp dụng theo cùng một cách cho terminal có sẵn. Điều này chưa chứng minh UI có thể đổi model/effort trực tiếp trong mọi session đang chạy.

Trước khi triển khai phải thử một luồng nhỏ để xác nhận cách gắn session, nhận trạng thái, tiếp tục sau gate và các lựa chọn model thực sự hỗ trợ.

## 6. Nơi lưu phần dùng chung và phần riêng

Đề xuất chia thành ba nhóm dữ liệu, tránh nhầm dữ liệu sử dụng với source code của chính app.

| Nhóm | Nội dung | Nơi lưu đề xuất |
|---|---|---|
| Thư viện của AI Office | Role, workflow, mẫu báo cáo/gate, quy tắc dùng chung | Kho cấu hình có phiên bản do AI Office quản lý, tách khỏi code giao diện |
| Hồ sơ project | Bối cảnh sản phẩm, quy ước, công cụ, lệnh chạy/test, cấu hình áp dụng | Trong repo project nếu là kiến thức cần đi cùng code; project trỏ về các bản mẫu được dùng |
| Dữ liệu vận hành | Gán nhân sự, liên kết session, lần chạy, trạng thái, hội thoại, gate, báo cáo | Kho dữ liệu bền vững của AI Office hoặc Orca theo ranh giới đã chốt |

### 6.1. Vì sao không để tất cả trong repo AI Office?

Bối cảnh riêng của Joy phải đi cùng Joy để người/agent làm ở ngoài AI Office vẫn đọc được. Lịch sử chạy và cấu hình riêng của người dùng không nên bị mất khi nâng cấp hoặc checkout phiên bản app khác.

### 6.2. Vì sao không sao chép toàn bộ core vào từng project?

Các bản sao dễ lệch nhau và không biết đội đang áp dụng bản nào. Nên giữ thư viện gốc có phiên bản, gắn project với phiên bản cụ thể rồi sinh phần harness cần thiết cho agent.

### 6.3. Thứ tự áp dụng cấu hình đề xuất

```text
Role / Workflow mẫu dùng chung
    → cấu hình phù hợp project
    → cấu hình riêng cho đội
    → bản chụp được áp dụng cho lần chạy
```

Cấu hình từng lớp phải xem được giá trị cuối cùng và nó đến từ đâu. Những quy tắc bắt buộc ở cấp cao không được vô tình ghi đè bởi cấu hình ở cấp thấp.

Khi thay đổi mẫu dùng chung, đội đang chạy giữ phiên bản đã dùng. App cho biết có bản mới và hỗ trợ xem khác biệt trước khi nâng cấp. Chính sách nâng cấp chi tiết còn cần chốt.

Đường dẫn cụ thể, cơ sở dữ liệu và cơ chế đồng bộ chưa được chọn trong bản này.

## 7. Cấu hình bằng ngôn ngữ tự nhiên

### 7.1. Luồng chỉnh sửa

1. Người dùng nói điều muốn thay đổi và phạm vi áp dụng.
2. Thư ký/người biên soạn đọc cấu hình hiện tại.
3. AI chuyển ý định thành thay đổi có cấu trúc; hỏi lại khi có nhiều cách hiểu ảnh hưởng hành vi.
4. App hiển thị trước/sau bằng ngôn ngữ dễ hiểu: thay đổi quy tắc gì, tác động đội nào, đầu ra nào sẽ khác.
5. Lưu thành phiên bản theo chính sách áp dụng đã chốt.
6. Kiểm tra và sinh harness tương ứng. Lỗi biên dịch/cấu hình phải được hiển thị, không báo đã áp dụng thành công.

### 7.2. Ví dụ từ note của anh

> “Developer trước khi code phải viết test fail; sửa bug xong test phải pass.”

Cấu hình cần thể hiện được:

- Quy tắc áp dụng cho sửa lỗi hay cả phát triển tính năng? Đây là chỗ có thể cần hỏi lại.
- Trước khi sửa, có test chứng minh hành vi mong muốn chưa đạt, với lỗi phù hợp mục tiêu; lỗi do môi trường hỏng không đủ.
- Sau khi sửa, chạy lại test đó và kiểm tra hồi quy theo phạm vi.
- Báo cáo kèm bằng chứng trước/sau.
- Chưa đủ bằng chứng thì chưa được xác nhận hoàn thành.

Quy tắc của Developer không thay thế kiểm thử độc lập nếu workflow có bước Tester.

### 7.3. Quy tắc về thực thi

Instruction trong prompt chỉ hướng dẫn agent. Những điều cần chặn thật — ví dụ gate chưa được trả lời, thiếu báo cáo bắt buộc hoặc chưa có bằng chứng kiểm thử — cần được bộ điều phối kiểm tra trước khi chuyển bước.

Các điều kiện không thể kiểm tra tự động phải chỉ rõ cần người/role nào xác nhận; không giả định AI có thể tự chứng minh mọi yêu cầu.

## 8. Workflow được thể hiện và chạy như thế nào

### 8.1. Các khối tối thiểu

| Khối | Chức năng |
|---|---|
| Bắt đầu | Nhận đầu vào thủ công hoặc từ trigger đã cấu hình |
| Giao việc | Giao mục tiêu và dữ liệu cho một nhân sự theo role |
| Điều kiện | Chọn đường dựa trên kết quả có cấu trúc |
| Báo cáo | Tạo tài liệu có tên/mẫu, người chịu trách nhiệm và dữ liệu nguồn |
| Gate | Dừng nhánh liên quan, chờ người có quyền quyết định |
| Kết thúc | Ghi nhận kết quả và các việc còn tồn đọng |

Chạy song song, lặp lại và gọi workflow con là nhu cầu có thể mở rộng; chưa mặc định đều thuộc bản đầu.

### 8.2. Mỗi bước phải khai báo được

- Tên và mục đích.
- Nhân sự/role phụ trách.
- Đầu vào và nguồn context.
- Công việc cần thực hiện.
- Đầu ra và nơi bàn giao.
- Điều kiện đạt, thất bại hoặc bị chặn.
- Bước tiếp theo hoặc nơi trả lại.
- Báo cáo và gate gắn với bước, nếu có.

### 8.3. Quan hệ giữa canvas và harness

```text
Kéo thả + ngôn ngữ tự nhiên
    → định nghĩa workflow có cấu trúc
    → kiểm tra hợp lệ và hiển thị diễn giải
    → phiên bản được áp dụng
    → harness / chỉ dẫn cho từng session + quy tắc điều phối
    → kết quả thực tế cập nhật lại trạng thái trên app
```

Canvas và phần ngôn ngữ tự nhiên cùng chỉnh một định nghĩa. Tránh để hình vẽ nói một đường còn prompt được sinh ra chạy một đường khác.

Harness cần gắn với phiên bản và cấu hình đầu vào đã tạo ra nó. Không lấy transcript dài làm nguồn định nghĩa workflow duy nhất.

### 8.4. Các kiểm tra trước khi chạy

- Bước đầu/cuối và các đường nối hợp lệ.
- Bước có role và đủ nguồn đầu vào cần thiết.
- Báo cáo bắt buộc có người tạo, nơi lưu và quy tắc đặt tên.
- Gate có người quyết định, lựa chọn và đường tiếp tục.
- Nhánh quay lại không tự lặp vô hạn; vòng lặp phải có điều kiện dừng.
- Môi trường hỗ trợ agent/công cụ được cấu hình.
- Không có hai nguồn trạng thái mâu thuẫn mà app âm thầm chọn một.

## 9. Session, provider, model và effort

Người dùng cấu hình ở role mẫu hoặc nhân sự của đội. App phải cho thấy cấu hình mặc định và cấu hình đang có hiệu lực.

Không hiển thị tổ hợp model/effort như thể luôn được hỗ trợ. Khả năng lựa chọn phụ thuộc provider, phiên bản và môi trường chạy thực tế.

### 9.1. Định danh

Mỗi nhân sự được gắn rõ project, workspace, role, session, terminal/worker và lần chạy liên quan. Không tìm “session mới nhất của thư mục” hoặc đoán session qua tiêu đề khi trong đội có nhiều role.

### 9.2. Khi đổi Claude ↔ Codex

Đây là đổi môi trường hội thoại, không mặc định giữ nguyên trí nhớ của session cũ. Đề xuất tạo bản bàn giao gồm mục tiêu, trạng thái, quyết định, bằng chứng, tài liệu, đầu việc còn lại và liên kết session trước.

Phải xử lý rõ worker cũ đang làm gì và quyền ghi hiện tại trước khi worker mới tiếp tục cùng phần việc. Nếu trạng thái worker cũ chưa xác định, hiển thị chưa xác định và chặn thao tác có thể ghi đè.

### 9.3. Những hành vi còn cần chốt

- Đổi model trong lúc đang chạy áp dụng ngay khi công cụ hỗ trợ, ở lần giao việc kế tiếp hay qua session mới?
- Một role giữ một session cho cả workspace hay có thể thay session theo giai đoạn nhưng giữ cùng hồ sơ nhân sự?
- Tự động đổi provider khi bị giới hạn hay chỉ đề nghị người dùng đổi?

Không mặc định đã có khả năng đổi trực tiếp hoặc tự động chuyển provider.

## 10. Hồ sơ công việc và context

Kế thừa tinh thần ghi chép của ship, với cấu trúc chung:

| Hồ sơ | Nội dung |
|---|---|
| Đề bài và mục tiêu | Yêu cầu gốc, người yêu cầu, phạm vi, kết quả mong muốn |
| Phân tích | Hiểu biết hiện tại, điểm chưa rõ, các cách hiểu còn mở |
| Bằng chứng | Nguồn, thời điểm, kết quả kiểm tra và giới hạn |
| Quyết định | Câu hỏi, phương án, người quyết định, lý do và tác động |
| Kế hoạch | Các phần việc, phụ thuộc, người phụ trách và cách kiểm tra |
| Tiến độ | Bước hiện tại, kết quả đã có, điều đang chờ |
| Báo cáo | Tài liệu được workflow yêu cầu, các phiên bản và kết luận |
| Hội thoại | Tham chiếu trao đổi với Thư ký, PM và các session liên quan |

Phân biệt rõ sự thật đã kiểm chứng, giả định và đề xuất. Quyết định của anh phải được ghi riêng để session sau không phải đoán lại từ lịch sử chat.

Context bàn giao cần đủ cho nhiệm vụ, có liên kết tới hồ sơ gốc. Không tự đưa toàn bộ lịch sử của mọi đội vào mọi session.

## 11. Báo cáo và gate cho người không đọc code

### 11.1. Cấu hình báo cáo

Workflow khai báo được tên báo cáo, thời điểm tạo, người tạo và nội dung bắt buộc. Quy tắc đặt tên cần tránh ghi đè giữa các lần chạy, có thể gắn định danh công việc và phiên bản.

Báo cáo cần cho thấy:

1. Công việc đang nhằm giải quyết vấn đề gì.
2. Kết quả đạt được hoặc phương án được đề xuất.
3. Bằng chứng chính và phần chưa kiểm được.
4. Tác động, rủi ro và việc còn lại.
5. Câu hỏi cần anh quyết định, nếu có.

Định dạng Markdown/HTML hay hiển thị trực tiếp trong app sẽ chốt riêng. Không mặc định sinh HTML cho mọi bước.

### 11.2. Cấu hình gate

Mỗi gate có câu hỏi, người quyết định, báo cáo liên quan, các lựa chọn, phạm vi bị chặn và hành vi sau từng lựa chọn.

Các phản hồi có thể gồm chấp nhận, yêu cầu sửa, chọn phương án hoặc dừng. Nếu người dùng trả lời tự do, app cần xác định phản hồi gắn với gate nào và làm rõ khi không đủ để tiếp tục.

Gate chỉ được giải quyết bởi người có quyền. Hết thời gian chờ không được xem là đồng ý. Báo cáo được tạo xong cũng không đồng nghĩa gate đã được duyệt.

### 11.3. Trải nghiệm đề xuất

Mặc định hiển thị bản tóm tắt ngắn và quyết định đang chờ. Chi tiết, bằng chứng và log nằm ở các lớp có thể mở thêm. Người dùng không phải đọc transcript đầy đủ để biết cần làm gì.

## 12. Các hành trình sử dụng chính

### 12.1. Mang một đội ngũ sang project khác

Chọn project → tạo workspace → chọn workflow và role mẫu → bổ sung cấu hình riêng của project → xem cấu hình hiệu lực → bắt đầu làm việc qua PM.

Các kiến thức dùng chung được tái sử dụng; bối cảnh, dữ liệu và session của project cũ không tự đi sang.

### 12.2. Tạo workflow bằng lời nói

Nói với Thư ký → AI dựng bản cấu hình → xem được các bước trên canvas → chỉnh bằng kéo thả hoặc tiếp tục bằng lời → khai báo báo cáo/gate → kiểm tra hợp lệ → lưu phiên bản để sử dụng.

### 12.3. Thay đổi cách Developer làm việc

Mở role hoặc nói với Thư ký → nêu yêu cầu → app xác định sửa mẫu chung hay chỉ đội hiện tại → xem khác biệt và ảnh hưởng → áp dụng theo chính sách → nhân sự nhận quy tắc ở thời điểm được xác định.

### 12.4. Đội đang chờ anh

Trang tổng quan hiện đội, việc đang chờ và báo cáo liên quan → anh đọc tóm tắt → trao đổi với PM nếu cần → trả lời gate → hệ thống lưu quyết định và tiếp tục đúng nhánh.

### 12.5. Anh truyền lời qua Thư ký

Nêu yêu cầu → xác định đội/PM đích → chuyển một lần với tham chiếu yêu cầu → theo dõi đã tiếp nhận hay chưa → nhận phản hồi tại cuộc trao đổi gốc. Nếu đích không rõ thì hỏi lại, không gửi đoán.

### 12.6. Session lỗi hoặc cần đổi provider

Hiển thị nhân sự bị gián đoạn và trạng thái thực tế → chọn cách khôi phục → tạo/tiếp tục session phù hợp → bàn giao hồ sơ → cập nhật liên kết → giữ lịch sử cũ để tra cứu.

Không mặc định chỉ chạy lại bước nếu bước đó đã gây tác động bên ngoài; cần kiểm tra kết quả lần trước để tránh làm trùng.

## 13. Cấu trúc thông tin của app — đề xuất

| Khu vực | Câu hỏi người dùng cần trả lời |
|---|---|
| Tổng quan | Đội nào đang chạy, việc nào chờ tôi, điều gì cần chú ý? |
| Thư ký | Tôi muốn lập đội, chỉnh cách làm hoặc chuyển thông tin tới đâu? |
| Project | Bối cảnh lâu dài, các đội và cấu hình riêng của dự án là gì? |
| Workspace | Đội đang làm gì, ai phụ trách, workflow ở đâu, PM nói gì? |
| Thư viện role | Mỗi role có trách nhiệm, quy tắc và cấu hình gì? |
| Thư viện workflow | Những quy trình dùng lại được và các phiên bản của chúng là gì? |
| Báo cáo và quyết định | Tôi cần đọc/chốt gì và trước đây đã quyết định thế nào? |

Đây là cấu trúc thông tin, chưa phải bản thiết kế giao diện. Tránh đưa log kỹ thuật và toàn bộ hội thoại lên màn hình mặc định.

## 14. Trạng thái cần biểu diễn đúng

Lần chạy/bước có thể ở các trạng thái: chưa bắt đầu, sẵn sàng, đang chạy, chờ người quyết định, bị chặn, lỗi, tạm dừng, hoàn thành hoặc đã hủy.

Nhân sự có thể rảnh, đang làm, chờ bàn giao, chờ phản hồi, lỗi hoặc không xác định trạng thái. Terminal còn mở không đủ chứng minh nhân sự đang làm việc; mất kết nối không đủ kết luận công việc đã dừng.

Mỗi trạng thái phải có nguồn cập nhật và thời điểm quan sát. App khởi động lại cần khôi phục từ dữ liệu bền vững rồi đối chiếu với môi trường chạy, không tự tạo lại session và giao việc trùng.

## 15. Tiêu chí nghiệm thu chức năng

- [ ] Tạo một project/team hoặc liên kết project có sẵn mà không sinh bản trùng.
- [ ] Tạo workspace có PM và nhiều nhân sự; chat tới đúng session của từng đội.
- [ ] Dùng cùng role/workflow mẫu cho hai project mà bối cảnh và cấu hình riêng không lẫn nhau.
- [ ] Sửa một quy tắc bằng lời, xem được cấu hình trước/sau và phạm vi áp dụng.
- [ ] Chọn agent/model/effort phù hợp khả năng môi trường; báo rõ lựa chọn không hỗ trợ.
- [ ] Tạo workflow có bàn giao, báo cáo và gate bằng canvas + ngôn ngữ tự nhiên.
- [ ] Định nghĩa hiển thị trên canvas khớp với cấu hình/harness đang chạy.
- [ ] Khi đến gate, nhánh bị chặn đúng; câu trả lời và người quyết định được lưu lại.
- [ ] Báo cáo bắt buộc có thể truy cập từ gate và từ hồ sơ công việc.
- [ ] Thay mẫu chung không âm thầm đổi cấu hình của lần chạy đang hoạt động.
- [ ] Đổi/khôi phục session có bàn giao và giữ liên kết lịch sử.
- [ ] Khởi động lại app không mất quyết định hoặc tự chạy trùng công việc.
- [ ] Trạng thái không có bằng chứng được thể hiện là chưa xác định/chưa kiểm chứng.

## 16. Phạm vi triển khai đề xuất

### 16.1. Luồng cần chứng minh trước

Một project → một workspace → PM + một role làm việc → giao việc → sinh một báo cáo → dừng tại gate → anh phản hồi → tiếp tục. Cấu hình bằng UI/lời nói phải có thể đọc lại và biết phiên bản đang dùng.

Luồng này giúp kiểm chứng tích hợp Orca, định tuyến session, cấu hình và điều phối trước khi đầu tư canvas đầy đủ.

### 16.2. Chưa mặc định thuộc bản đầu

- Tự quyết định đầy đủ mọi role và mọi quy trình phát triển sản phẩm.
- Tự thay thế toàn bộ chức năng Orca.
- Tích hợp toàn bộ Slack/email và mọi trigger bên ngoài.
- Tự động chuyển provider trong mọi tình huống.
- Workflow lồng nhau hoặc chạy song song phức tạp.
- Đồng bộ nhiều người dùng/máy và mô hình triển khai từ xa khi chưa chốt nhu cầu.

Các mục trên là đề xuất giới hạn phạm vi, cần anh quyết định; không phải loại bỏ khỏi hướng sản phẩm.

## 17. Những câu hỏi cần grill tiếp

Các câu được hỏi lần lượt theo ảnh hưởng tới đặc tả. Chưa coi phương án đề xuất là câu trả lời của anh.

| Mã | Quyết định cần làm rõ | Vì sao ảnh hưởng lớn | Đề xuất ban đầu | Trạng thái |
|---|---|---|---|---|
| Q01 | Orca chạy bên dưới hay AI Office tự chạy session? | Quyết định phần tái sử dụng và phần phải xây | Dùng Orca bên dưới, AI Office quản lý bên trên | Đã hỏi, chờ trả lời |
| Q02 | Một workspace tồn tại cho một task, một dự án con hay đội lâu dài làm nhiều việc? | Quyết định vòng đời PM, session, workflow và hồ sơ | Workspace theo phạm vi công việc; có thể chứa nhiều phần việc liên quan | Chưa hỏi |
| Q03 | Chỉnh role/workflow áp dụng cho đội hiện tại hay thư viện chung theo mặc định? | Tránh đổi hàng loạt ngoài ý muốn và lệch các bản mẫu | Mặc định sửa đội đang xem, lưu lên thư viện bằng lựa chọn riêng | Chưa hỏi |
| Q04 | Đổi agent/model khi đang làm sẽ được phép chuyển thế nào? | Quyết định bàn giao, dừng/tiếp tục và bảo toàn context | Hoàn tất hoặc dừng phần đang làm rồi bàn giao; không giả định chuyển trí nhớ tự động | Chưa hỏi |
| Q05 | Bản đầu cần chạy thực tế qua workflow UI hay ưu tiên biên soạn/xuất harness để chạy bằng cơ chế hiện tại? | Quyết định lát cắt đầu tiên và mức điều phối phải xây | Chứng minh một luồng chạy thật nhỏ rồi mở rộng | Chưa hỏi |
| Q06 | Cần truy cập từ máy/điện thoại khác ngay ở bản đầu không? | Ảnh hưởng nơi lưu, xác thực, kết nối Orca và triển khai | Chưa chọn khi chưa nghe nhu cầu mới của anh | Chưa hỏi |

## 18. Đối chiếu với app hiện tại

Quan sát từ code ngày 16/10/2026:

- Project/phòng đang khai báo tĩnh qua `office.config.js`.
- `lib/server/parent.js` đọc transcript Claude và gửi tin qua Orca terminal.
- Việc chọn terminal hiện chỉ gửi khi tìm được đúng một terminal Claude phù hợp; chưa phù hợp mô hình một workspace có nhiều role và hai provider.
- `lib/server/sessions.js` có cơ chế tìm session mới nhất theo thư mục; không nên dùng cơ chế này để định danh từng nhân sự trong mô hình mới.

Vì vậy đây là thay đổi mô hình tổ chức và quản lý context/session, cần được đặc tả trước khi chỉnh giao diện. Bản này chưa yêu cầu sửa code ứng dụng.

### Nguồn kiểm tra

- `Vấn đề và hướng đi mới.md`: yêu cầu gốc của anh.
- `office.config.js`, `lib/server/parent.js`, `lib/server/sessions.js`: giới hạn app hiện tại.
- `orca --help` và schema từ `orca agent-context --json`: các khả năng CLI được công bố trên máy, chưa thay thế kiểm thử tích hợp thực tế.


## 19. Giữ cơ chế progress.md của ship — yêu cầu đã xác nhận

Anh yêu cầu giữ cơ chế file Markdown lưu tiến trình của ship. Phần này bổ sung cho mục 10 và 14; chưa triển khai vào runtime và không thay đổi harness Joy.

### 19.1. Hồ sơ của một lần thực hiện

- `progress.md`: trạng thái hiện tại, checklist bám kế hoạch, bước tiếp theo, gate/câu hỏi đang chờ và tham chiếu kết quả.
- `decisions.md`: ghi thêm các quyết định, người quyết định, lý do và phương án bị loại; giữ lịch sử thay vì viết lại như tiến độ.
- Hồ sơ phân tích, sự thật đã kiểm chứng, kế hoạch và báo cáo: giữ vai trò tương ứng như ship; tên/định dạng chi tiết có thể cấu hình theo workflow.

`progress.md` là bản thể hiện tiến độ của kế hoạch, không phải nhật ký hội thoại. Giữ ngắn, đúng một dòng NOW và không chép lại những gì có thể đọc từ git hoặc báo cáo kiểm thử.

### 19.2. Tách tiến trình với workflow mẫu

Workflow trong thư viện mô tả cách làm. Mỗi công việc/lần chạy giữ phiên bản workflow đã chọn và có hồ sơ tiến trình riêng.

File tiến trình cần liên kết được tới project, workspace, công việc/lần chạy, phiên bản workflow, các task con và nhân sự/session đang được gán. Không dùng tên role hoặc session mới nhất trong thư mục để đoán người thực hiện.

Đề xuất nơi lưu: thư mục hồ sơ của công việc gắn với workspace, có định danh riêng cho từng lần chạy. Đường dẫn cụ thể chưa chốt. Không lưu tiến trình riêng của mọi project chung vào thư mục source code của app AI Office.

### 19.3. Công việc cha và con

- Công việc cha có tiến trình tổng và liên kết tới các task/đội con.
- Phần việc chạy độc lập có hồ sơ tiến trình riêng theo phạm vi được giao.
- Task con hoàn thành không tự làm công việc cha hoàn thành: vẫn cần kiểm tra tích hợp và nghiệm thu mục tiêu tổng.
- Không sao chép toàn bộ checklist con vào file cha; file cha thể hiện phần tổng, phụ thuộc và các điểm chặn.

### 19.4. Quyền cập nhật và đồng bộ UI

Đề xuất: PM hoặc bộ điều phối là bên ghi chính cho tiến trình của phạm vi mình quản lý. Các role bàn giao kết quả có cấu trúc và bằng chứng để cập nhật; tránh nhiều agent cùng sửa một file.

UI trình bày tiến độ từ hồ sơ này. Câu trả lời gate trên UI phải được lưu vào quyết định và cập nhật trạng thái tương ứng trước khi tiếp tục công việc. Không có một trạng thái trong file và một trạng thái UI độc lập, tự chọn khi mâu thuẫn.

Nếu có database/event log khi triển khai, cần chốt rõ nơi ghi chính và cơ chế xuất/đối chiếu Markdown. Yêu cầu giữ file tiến trình bền vững vẫn phải được đáp ứng; database không được biến nó thành báo cáo cũ không thể dùng để tiếp tục.

Việc cập nhật trạng thái, quyết định và phát lệnh tiếp tục phải có khả năng phục hồi khi bị gián đoạn; không phát lại thao tác bên ngoài chỉ vì UI chưa nhận được xác nhận.

### 19.5. Khôi phục hoặc fallback agent

1. Đọc state, dòng NOW, gate đang chờ và phần việc chưa hoàn thành trong `progress.md`.
2. Đọc các quyết định và kế hoạch liên quan.
3. Đối chiếu với hiện trạng file/git, tác vụ còn chạy và bằng chứng đã có. Không đánh dấu hoàn thành chỉ dựa vào lời ghi trước đó.
4. Xác định phần có thể tiếp tục và những gì cần hỏi lại.
5. Ghi nhận session/agent tiếp nhận; giữ tham chiếu tới session trước và quyền đã được cấp.
6. Tiếp tục đúng bước; gate chưa duyệt vẫn giữ chặn, không khởi động lại toàn bộ workflow.

Nếu agent cũ hết quota đột ngột, PM/bộ điều phối dùng hồ sơ bền vững và hiện trạng để bàn giao; không phụ thuộc vào agent cũ còn khả năng viết bản tóm tắt cuối.

### 19.6. Tiêu chí nghiệm thu bổ sung

- [ ] Khởi động lại app vẫn đọc được đúng tiến trình và quyết định đang chờ.
- [ ] Agent tiếp nhận đọc hồ sơ và tiếp tục đúng phần chưa xong, không chạy lại các thao tác đã hoàn thành.
- [ ] Fallback Claude → Codex giữ mục tiêu, quyết định, quyền và gate của công việc.
- [ ] UI và hồ sơ tiến trình không hiển thị hai kết luận trái nhau mà không báo cần đối chiếu.
- [ ] PM tổng theo dõi được tiến trình con nhưng không xác nhận mục tiêu cha chỉ bằng số task đã xong.
