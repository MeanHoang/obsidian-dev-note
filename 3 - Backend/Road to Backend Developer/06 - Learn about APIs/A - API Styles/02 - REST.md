# 02 — REST (Representational State Transfer)

> **Nguồn chính:** Roy Thomas Fielding, *Architectural Styles and the Design of Network-based Software Architectures* (PhD Dissertation, UC Irvine, 2000) — **Chapter 5: Representational State Transfer (REST)** — https://www.ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm
> **Nguồn phụ:** RFC 9110 — *HTTP Semantics* — https://www.rfc-editor.org/rfc/rfc9110.txt · và Chapter 6 (Experience and Evaluation) của cùng luận án — https://www.ics.uci.edu/~fielding/pubs/dissertation/evaluation.htm
> Bài này bám Chapter 5 (§5.1 Deriving REST, §5.2 REST Architectural Elements) làm phần lý thuyết gốc, rồi đối chiếu với cách REST được dùng trong thực tế.

---

## Vì sao phải đọc thẳng luận án gốc

REST không phải một giao thức, không phải một chuẩn (standard), cũng không phải một thư viện. Nó là một **architectural style** — một tập **constraints** (ràng buộc) mà Roy Fielding đặt ra trong luận án tiến sĩ năm 2000, chính là nơi thuật ngữ REST lần đầu xuất hiện. Fielding đồng thời là tác giả chính của spec HTTP/1.1, nên REST và HTTP là hai thứ sinh ra cùng một hệ tư tưởng.

Phần lớn tài liệu "REST API" trên mạng là diễn giải đời thứ ba, thứ tư. Bài này đi thẳng vào bản gốc.

---

# PHẦN A — REST THEO ĐÚNG FIELDING

## A.1. REST là gì — định nghĩa gốc

📖 **Nguyên văn** (Chapter 5, đoạn mở đầu)
> "This chapter introduces and elaborates the Representational State Transfer (REST) architectural style for distributed hypermedia systems, describing the software engineering principles guiding REST and the interaction constraints chosen to retain those principles, while contrasting them to the constraints of other architectural styles. REST is a hybrid style derived from several of the network-based architectural styles described in Chapter 3 and combined with additional constraints that define a uniform connector interface."

🇻🇳 **Dịch**
> "Chương này giới thiệu và trình bày chi tiết architectural style Representational State Transfer (REST) dành cho các hệ thống distributed hypermedia, mô tả các nguyên tắc kỹ thuật phần mềm định hướng REST và các ràng buộc tương tác được chọn để giữ những nguyên tắc đó, đồng thời đối chiếu chúng với ràng buộc của các architectural style khác. REST là một style lai, dẫn xuất từ một số network-based architectural style được mô tả ở Chương 3, kết hợp thêm các ràng buộc bổ sung định nghĩa nên một uniform connector interface."

Ba chữ đáng chú ý: **architectural style**. Không có chữ "protocol", không có chữ "standard", không có chữ "JSON".

📖 **Nguyên văn** (§5.1, Deriving REST)
> "The design rationale behind the Web architecture can be described by an architectural style consisting of the set of constraints applied to elements within the architecture. By examining the impact of each constraint as it is added to the evolving style, we can identify the properties induced by the Web's constraints."

🇻🇳 **Dịch**
> "Lý do thiết kế đằng sau kiến trúc Web có thể được mô tả bằng một architectural style bao gồm tập các constraint áp lên các phần tử bên trong kiến trúc đó. Bằng cách xem xét tác động của từng constraint khi nó được thêm vào style đang hình thành, ta có thể nhận diện các thuộc tính mà những constraint của Web tạo ra."

📖 **Nguyên văn** (§5.5 Summary)
> "REST provides a set of architectural constraints that, when applied as a whole, emphasizes scalability of component interactions, generality of interfaces, independent deployment of components, and intermediary components to reduce interaction latency, enforce security, and encapsulate legacy systems."

🇻🇳 **Dịch**
> "REST cung cấp một tập các architectural constraint mà khi được áp dụng như một tổng thể, sẽ nhấn mạnh vào khả năng mở rộng của tương tác giữa các component, tính tổng quát của các interface, khả năng triển khai độc lập của các component, và các component trung gian dùng để giảm độ trễ tương tác, thực thi bảo mật, và đóng gói các hệ thống legacy."

> [!note]
> Cụm **"when applied as a whole"** rất quan trọng. Fielding nói các constraint phải áp **cả bộ**. Lấy ra vài cái mình thích rồi vẫn gọi là REST thì về mặt định nghĩa gốc là không đúng.

💡 **Ví dụ đời sống**
"Architectural style" giống như **phong cách kiến trúc nhà kiểu Nhật**: không phải bản vẽ một căn nhà cụ thể, mà là tập quy tắc — sàn tatami theo module, vách giấy trượt, không dùng tường chịu lực cố định. Ai xây theo đủ bộ quy tắc đó thì ra một căn nhà có tính chất nhất định (dễ chia lại phòng, thông gió tốt). Bạn không thể "mua một cái phong cách Nhật" về cài; bạn chỉ có thể **tuân theo** nó. REST y hệt.

---

## A.2. Cách Fielding dẫn ra REST: bắt đầu từ con số 0

📖 **Nguyên văn** (§5.1.1 Starting with the Null Style)
> "The Null style (Figure 5-1) is simply an empty set of constraints. From an architectural perspective, the null style describes a system in which there are no distinguished boundaries between components. It is the starting point for our description of REST."

🇻🇳 **Dịch**
> "Null style (Hình 5-1) đơn giản là một tập constraint rỗng. Từ góc nhìn kiến trúc, null style mô tả một hệ thống trong đó không có ranh giới phân biệt nào giữa các component. Đó là điểm khởi đầu cho phần mô tả REST của chúng tôi."

Fielding không "thiết kế" REST bằng cách ghép linh kiện. Ông bắt đầu từ hệ thống **không có ràng buộc nào**, rồi thêm từng ràng buộc một, và mỗi lần thêm thì phân tích: được gì, mất gì. Đó là lý do mỗi constraint dưới đây đều đi kèm một đoạn **trade-off**.

---

## A.3. Sáu ràng buộc (constraints) của REST

### Constraint 1 — Client-Server

📖 **Nguyên văn** (§5.1.2)
> "The first constraints added to our hybrid style are those of the client-server architectural style (Figure 5-2), described in Section 3.4.1. Separation of concerns is the principle behind the client-server constraints. By separating the user interface concerns from the data storage concerns, we improve the portability of the user interface across multiple platforms and improve scalability by simplifying the server components. Perhaps most significant to the Web, however, is that the separation allows the components to evolve independently, thus supporting the Internet-scale requirement of multiple organizational domains."

🇻🇳 **Dịch**
> "Những constraint đầu tiên được thêm vào style lai của chúng tôi là các constraint của client-server architectural style (Hình 5-2), mô tả ở Mục 3.4.1. Separation of concerns là nguyên tắc nằm sau các constraint client-server. Bằng cách tách mối quan tâm về user interface khỏi mối quan tâm về lưu trữ dữ liệu, ta cải thiện khả năng chuyển đổi (portability) của user interface qua nhiều nền tảng và cải thiện khả năng mở rộng (scalability) nhờ đơn giản hóa các component server. Tuy nhiên, điều có lẽ quan trọng nhất đối với Web là việc tách biệt này cho phép các component tiến hóa độc lập, nhờ đó đáp ứng yêu cầu quy mô Internet với nhiều organizational domain khác nhau."

**Đọc kỹ:** cái được nhấn mạnh không phải "có client và có server" (ai cũng biết) mà là **evolve independently** — client và server được phép nâng cấp riêng, do hai tổ chức khác nhau vận hành, mà không phải hẹn nhau deploy cùng lúc.

---

### Constraint 2 — Stateless

📖 **Nguyên văn** (§5.1.3)
> "We next add a constraint to the client-server interaction: communication must be stateless in nature, as in the client-stateless-server (CSS) style of Section 3.4.3 (Figure 5-3), such that each request from client to server must contain all of the information necessary to understand the request, and cannot take advantage of any stored context on the server. Session state is therefore kept entirely on the client."

🇻🇳 **Dịch**
> "Tiếp theo chúng tôi thêm một constraint vào tương tác client-server: giao tiếp phải mang bản chất stateless, giống như client-stateless-server (CSS) style ở Mục 3.4.3 (Hình 5-3), sao cho mỗi request từ client tới server phải chứa toàn bộ thông tin cần thiết để hiểu được request đó, và không được tận dụng bất kỳ context nào đang lưu trên server. Do đó session state được giữ hoàn toàn ở phía client."

📖 **Nguyên văn** (§5.1.3, tiếp)
> "This constraint induces the properties of visibility, reliability, and scalability. Visibility is improved because a monitoring system does not have to look beyond a single request datum in order to determine the full nature of the request. Reliability is improved because it eases the task of recovering from partial failures [133]. Scalability is improved because not having to store state between requests allows the server component to quickly free resources, and further simplifies implementation because the server doesn't have to manage resource usage across requests."

🇻🇳 **Dịch**
> "Constraint này tạo ra các thuộc tính visibility, reliability và scalability. Visibility được cải thiện vì hệ thống giám sát không cần nhìn xa hơn dữ liệu của một request đơn lẻ để xác định đầy đủ bản chất của request đó. Reliability được cải thiện vì nó làm nhẹ công việc phục hồi sau các lỗi cục bộ (partial failure). Scalability được cải thiện vì không phải lưu state giữa các request nên component server có thể giải phóng tài nguyên nhanh, và việc hiện thực cũng đơn giản hơn vì server không phải quản lý việc sử dụng tài nguyên xuyên suốt nhiều request."

📖 **Nguyên văn** (§5.1.3, phần trade-off)
> "Like most architectural choices, the stateless constraint reflects a design trade-off. The disadvantage is that it may decrease network performance by increasing the repetitive data (per-interaction overhead) sent in a series of requests, since that data cannot be left on the server in a shared context. In addition, placing the application state on the client-side reduces the server's control over consistent application behavior, since the application becomes dependent on the correct implementation of semantics across multiple client versions."

🇻🇳 **Dịch**
> "Như phần lớn các lựa chọn kiến trúc, constraint stateless phản ánh một sự đánh đổi trong thiết kế. Nhược điểm là nó có thể làm giảm hiệu năng mạng do tăng lượng dữ liệu lặp lại (overhead trên mỗi lần tương tác) phải gửi trong một chuỗi request, vì dữ liệu đó không thể để lại trên server trong một context dùng chung. Ngoài ra, đặt application state ở phía client làm giảm khả năng kiểm soát của server đối với tính nhất quán trong hành vi ứng dụng, vì ứng dụng trở nên phụ thuộc vào việc các phiên bản client khác nhau có hiện thực đúng ngữ nghĩa hay không."

💡 **Ví dụ đời sống**
Stateless giống như **quầy bán vé không có nhân viên nhớ mặt khách**. Mỗi lần bạn tới quầy, bạn phải chìa ra đủ giấy tờ: tôi là ai, tôi mua vé nào, tôi trả bằng gì. Nhân viên xử lý xong là quên sạch. Bù lại, quầy nào cũng phục vụ được bạn — hôm nay quầy 3, mai quầy 7, đều như nhau; và có thể mở thêm 20 quầy mà không cần đồng bộ trí nhớ giữa chúng. Cái giá phải trả: bạn phải lôi giấy tờ ra mỗi lần (repetitive data).

---

### Constraint 3 — Cache

📖 **Nguyên văn** (§5.1.4)
> "In order to improve network efficiency, we add cache constraints to form the client-cache-stateless-server style of Section 3.4.4 (Figure 5-4). Cache constraints require that the data within a response to a request be implicitly or explicitly labeled as cacheable or non-cacheable. If a response is cacheable, then a client cache is given the right to reuse that response data for later, equivalent requests."

🇻🇳 **Dịch**
> "Để cải thiện hiệu quả mạng, chúng tôi thêm các cache constraint để tạo thành client-cache-stateless-server style ở Mục 3.4.4 (Hình 5-4). Các cache constraint đòi hỏi dữ liệu bên trong một response phải được gán nhãn — ngầm định hoặc tường minh — là cacheable hoặc non-cacheable. Nếu một response là cacheable thì cache phía client được quyền tái sử dụng dữ liệu response đó cho các request tương đương về sau."

📖 **Nguyên văn** (§5.1.4, trade-off)
> "The advantage of adding cache constraints is that they have the potential to partially or completely eliminate some interactions, improving efficiency, scalability, and user-perceived performance by reducing the average latency of a series of interactions. The trade-off, however, is that a cache can decrease reliability if stale data within the cache differs significantly from the data that would have been obtained had the request been sent directly to the server."

🇻🇳 **Dịch**
> "Ưu điểm của việc thêm cache constraint là chúng có tiềm năng loại bỏ một phần hoặc toàn bộ một số lần tương tác, qua đó cải thiện hiệu quả, khả năng mở rộng và hiệu năng mà người dùng cảm nhận được, bằng cách giảm độ trễ trung bình của một chuỗi tương tác. Tuy nhiên cái giá phải trả là cache có thể làm giảm độ tin cậy nếu dữ liệu cũ (stale) trong cache khác biệt đáng kể so với dữ liệu lẽ ra nhận được nếu request được gửi thẳng tới server."

📖 **Nguyên văn** (§5.2.2, quy tắc cacheability mặc định)
> "A cache is able to determine the cacheability of a response because the interface is generic rather than specific to each resource. By default, the response to a retrieval request is cacheable and the responses to other requests are non-cacheable."

🇻🇳 **Dịch**
> "Một cache có thể xác định được tính cacheable của một response bởi vì interface là tổng quát chứ không riêng biệt cho từng resource. Theo mặc định, response của một request dạng truy xuất (retrieval) là cacheable, còn response của các loại request khác là non-cacheable."

📖 **Nguyên văn** (§5.3.3)
> "An interesting observation is that the most efficient network request is one that doesn't use the network."

🇻🇳 **Dịch**
> "Một nhận xét thú vị là request mạng hiệu quả nhất chính là request không dùng tới mạng."

---

### Constraint 4 — Uniform Interface

Đây là constraint **cốt lõi nhất**, thứ phân biệt REST với mọi style khác.

📖 **Nguyên văn** (§5.1.5)
> "The central feature that distinguishes the REST architectural style from other network-based styles is its emphasis on a uniform interface between components (Figure 5-6). By applying the software engineering principle of generality to the component interface, the overall system architecture is simplified and the visibility of interactions is improved. Implementations are decoupled from the services they provide, which encourages independent evolvability. The trade-off, though, is that a uniform interface degrades efficiency, since information is transferred in a standardized form rather than one which is specific to an application's needs."

🇻🇳 **Dịch**
> "Đặc điểm trung tâm phân biệt REST architectural style với các network-based style khác là sự nhấn mạnh vào một uniform interface giữa các component (Hình 5-6). Bằng cách áp dụng nguyên tắc tổng quát hóa (generality) của kỹ thuật phần mềm lên interface của component, kiến trúc tổng thể của hệ thống được đơn giản hóa và khả năng quan sát (visibility) các tương tác được cải thiện. Các implementation được tách rời khỏi những service mà chúng cung cấp, điều này khuyến khích khả năng tiến hóa độc lập. Tuy nhiên cái giá phải trả là uniform interface làm giảm hiệu quả, vì thông tin được truyền dưới một dạng chuẩn hóa thay vì dạng riêng phù hợp với nhu cầu của ứng dụng."

📖 **Nguyên văn** (§5.1.5, liệt kê 4 sub-constraint)
> "In order to obtain a uniform interface, multiple architectural constraints are needed to guide the behavior of components. REST is defined by four interface constraints: identification of resources; manipulation of resources through representations; self-descriptive messages; and, hypermedia as the engine of application state."

🇻🇳 **Dịch**
> "Để đạt được một uniform interface, cần nhiều constraint kiến trúc nhằm định hướng hành vi của các component. REST được định nghĩa bởi bốn constraint về interface: định danh resource (identification of resources); thao tác resource thông qua representation (manipulation of resources through representations); message tự mô tả (self-descriptive messages); và hypermedia là động cơ của application state (hypermedia as the engine of application state)."

💡 **Ví dụ đời sống**
Uniform interface giống như **ổ điện chuẩn quốc gia**. Máy giặt, quạt, laptop — mỗi thiết bị bên trong khác nhau hoàn toàn, nhưng đều cắm chung một loại ổ. Nhờ vậy thợ điện, ổn áp, aptomat (những "intermediary") có thể xen vào giữa mà không cần biết thiết bị là gì. Cái giá: ổ chuẩn không tối ưu cho riêng thiết bị nào — máy giặt có thể chạy tốt hơn nếu có ổ riêng, nhưng khi đó cả hệ sinh thái sập.

#### 4a. Identification of resources

📖 **Nguyên văn** (§5.2.1.1)
> "The key abstraction of information in REST is a resource. Any information that can be named can be a resource: a document or image, a temporal service (e.g. "today's weather in Los Angeles"), a collection of other resources, a non-virtual object (e.g. a person), and so on. In other words, any concept that might be the target of an author's hypertext reference must fit within the definition of a resource. A resource is a conceptual mapping to a set of entities, not the entity that corresponds to the mapping at any particular point in time."

🇻🇳 **Dịch**
> "Trừu tượng hóa then chốt về thông tin trong REST là resource. Bất kỳ thông tin nào có thể đặt tên đều có thể là một resource: một document hay image, một dịch vụ mang tính thời điểm (ví dụ "thời tiết hôm nay ở Los Angeles"), một tập hợp các resource khác, một đối tượng phi ảo (ví dụ một con người), v.v. Nói cách khác, bất kỳ khái niệm nào có thể là đích của một hypertext reference do tác giả tạo ra đều phải nằm gọn trong định nghĩa của resource. Một resource là một ánh xạ khái niệm tới một tập các thực thể, chứ không phải là cái thực thể tương ứng với ánh xạ đó tại một thời điểm cụ thể nào."

📖 **Nguyên văn** (§5.2.1.1, định nghĩa hình thức)
> "More precisely, a resource R is a temporally varying membership function MR(t), which for time t maps to a set of entities, or values, which are equivalent. The values in the set may be resource representations and/or resource identifiers. A resource can map to the empty set, which allows references to be made to a concept before any realization of that concept exists -- a notion that was foreign to most hypertext systems prior to the Web [61]. Some resources are static in the sense that, when examined at any time after their creation, they always correspond to the same value set. Others have a high degree of variance in their value over time. The only thing that is required to be static for a resource is the semantics of the mapping, since the semantics is what distinguishes one resource from another."

🇻🇳 **Dịch**
> "Chính xác hơn, một resource R là một hàm thành viên biến thiên theo thời gian MR(t), với thời điểm t sẽ ánh xạ tới một tập các thực thể, hoặc giá trị, tương đương nhau. Các giá trị trong tập đó có thể là resource representation và/hoặc resource identifier. Một resource có thể ánh xạ tới tập rỗng, điều này cho phép tham chiếu tới một khái niệm trước khi có bất kỳ hiện thực hóa nào của khái niệm đó tồn tại — một ý niệm xa lạ với phần lớn các hệ hypertext trước thời Web. Một số resource là tĩnh theo nghĩa: khi xem xét ở bất kỳ thời điểm nào sau khi được tạo, chúng luôn tương ứng với cùng một tập giá trị. Số khác lại biến thiên rất lớn theo thời gian. Thứ duy nhất bắt buộc phải tĩnh đối với một resource là ngữ nghĩa (semantics) của ánh xạ, vì chính ngữ nghĩa mới là thứ phân biệt resource này với resource kia."

📖 **Nguyên văn** (§5.2.1.1, ví dụ của Fielding)
> "For example, the "authors' preferred version" of an academic paper is a mapping whose value changes over time, whereas a mapping to "the paper published in the proceedings of conference X" is static. These are two distinct resources, even if they both map to the same value at some point in time."

🇻🇳 **Dịch**
> "Ví dụ, "phiên bản mà tác giả ưa thích" của một bài báo khoa học là một ánh xạ có giá trị thay đổi theo thời gian, trong khi ánh xạ tới "bài báo đã đăng trong kỷ yếu hội nghị X" lại là tĩnh. Đây là hai resource khác biệt, kể cả khi tại một thời điểm nào đó cả hai cùng ánh xạ tới một giá trị."

> [!tip]
> Đây là chỗ nhiều người hiểu sai nhất. **Resource KHÔNG phải là row trong database.** Resource là một *khái niệm được đặt tên*. `/reports/latest` và `/reports/2026-09` có thể trả về cùng một nội dung hôm nay, nhưng chúng là **hai resource khác nhau** vì ngữ nghĩa ánh xạ khác nhau.

📖 **Nguyên văn** (§5.2.1.1, về resource identifier)
> "REST uses a resource identifier to identify the particular resource involved in an interaction between components. REST connectors provide a generic interface for accessing and manipulating the value set of a resource, regardless of how the membership function is defined or the type of software that is handling the request."

🇻🇳 **Dịch**
> "REST dùng một resource identifier để định danh resource cụ thể tham gia vào một tương tác giữa các component. Các REST connector cung cấp một interface tổng quát để truy cập và thao tác tập giá trị của một resource, bất kể hàm thành viên được định nghĩa ra sao hay loại phần mềm nào đang xử lý request."

#### 4b. Manipulation of resources through representations

📖 **Nguyên văn** (§5.2.1.2)
> "REST components perform actions on a resource by using a representation to capture the current or intended state of that resource and transferring that representation between components. A representation is a sequence of bytes, plus representation metadata to describe those bytes. Other commonly used but less precise names for a representation include: document, file, and HTTP message entity, instance, or variant."

🇻🇳 **Dịch**
> "Các component REST thực hiện hành động lên một resource bằng cách dùng một representation để nắm bắt trạng thái hiện tại hoặc trạng thái mong muốn của resource đó, rồi truyền representation ấy giữa các component. Một representation là một chuỗi byte, cộng thêm representation metadata mô tả các byte đó. Những tên gọi khác thường dùng nhưng kém chính xác hơn cho representation gồm: document, file, và HTTP message entity, instance, hay variant."

📖 **Nguyên văn** (§5.2.1.2, tiếp)
> "A representation consists of data, metadata describing the data, and, on occasion, metadata to describe the metadata (usually for the purpose of verifying message integrity). Metadata is in the form of name-value pairs, where the name corresponds to a standard that defines the value's structure and semantics."

🇻🇳 **Dịch**
> "Một representation bao gồm dữ liệu, metadata mô tả dữ liệu đó, và đôi khi cả metadata mô tả chính metadata (thường nhằm kiểm chứng tính toàn vẹn của message). Metadata ở dạng các cặp name-value, trong đó name tương ứng với một chuẩn định nghĩa cấu trúc và ngữ nghĩa của value."

📖 **Nguyên văn** (§5.2.1.2, về media type)
> "The data format of a representation is known as a media type [48]. A representation can be included in a message and processed by the recipient according to the control data of the message and the nature of the media type."

🇻🇳 **Dịch**
> "Định dạng dữ liệu của một representation được gọi là media type. Một representation có thể được đặt trong một message và được bên nhận xử lý dựa theo control data của message cùng bản chất của media type."

💡 **Ví dụ đời sống**
Resource là **"tình hình sức khỏe của bệnh nhân A"** — một khái niệm, không cầm được. Representation là **tờ giấy kết quả xét nghiệm** in ra hôm nay: một chuỗi ký tự cụ thể + phần đầu trang ghi rõ "xét nghiệm máu, ngày 11/09/2026" (metadata). Cùng một resource có thể ra tờ tiếng Việt hoặc tờ tiếng Anh, bản in hoặc file PDF — đó là các representation khác nhau. Bạn muốn sửa hồ sơ bệnh nhân thì bạn nộp **một tờ giấy mới**, chứ bạn không chọc tay vào "tình hình sức khỏe".

Bảng data element gốc Fielding đưa ra (Table 5-1):

| Data Element | Modern Web Examples |
|---|---|
| resource | the intended conceptual target of a hypertext reference |
| resource identifier | URL, URN |
| representation | HTML document, JPEG image |
| representation metadata | media type, last-modified time |
| resource metadata | source link, alternates, vary |
| control data | if-modified-since, cache-control |

🇻🇳 Bảng trên chép nguyên từ Table 5-1 của luận án: cột trái là phần tử dữ liệu trừu tượng của REST, cột phải là ví dụ tương ứng trên Web hiện đại.

#### 4c. Self-descriptive messages

📖 **Nguyên văn** (§5.1.6)
> "Within REST, intermediary components can actively transform the content of messages because the messages are self-descriptive and their semantics are visible to intermediaries."

🇻🇳 **Dịch**
> "Trong REST, các component trung gian có thể chủ động biến đổi nội dung của message bởi vì các message tự mô tả và ngữ nghĩa của chúng hiển lộ với các thành phần trung gian."

📖 **Nguyên văn** (§5.3.1)
> "REST enables intermediate processing by constraining messages to be self-descriptive: interaction is stateless between requests, standard methods and media types are used to indicate semantics and exchange information, and responses explicitly indicate cacheability."

🇻🇳 **Dịch**
> "REST cho phép xử lý trung gian bằng cách ràng buộc các message phải tự mô tả: tương tác là stateless giữa các request, các method và media type chuẩn được dùng để chỉ ra ngữ nghĩa và trao đổi thông tin, và các response chỉ rõ tính cacheable một cách tường minh."

📖 **Nguyên văn** (§5.2.1.2, về control data)
> "Control data defines the purpose of a message between components, such as the action being requested or the meaning of a response. It is also used to parameterize requests and override the default behavior of some connecting elements. For example, cache behavior can be modified by control data included in the request or response message."

🇻🇳 **Dịch**
> "Control data định nghĩa mục đích của một message giữa các component, chẳng hạn hành động đang được yêu cầu hoặc ý nghĩa của một response. Nó cũng được dùng để tham số hóa các request và ghi đè hành vi mặc định của một số phần tử kết nối. Ví dụ, hành vi cache có thể bị thay đổi bởi control data đặt trong message request hoặc response."

💡 **Ví dụ đời sống**
Self-descriptive message giống như **bưu kiện dán đủ nhãn**: người gửi, người nhận, "hàng dễ vỡ", "thực phẩm — bảo quản lạnh", ngày gửi. Nhờ đó nhân viên bưu điện ở bất kỳ trạm trung chuyển nào (intermediary) cũng biết phải xếp nó vào kho lạnh hay kho thường, **mà không cần mở ra xem và không cần gọi điện hỏi người gửi**. Nếu bưu kiện chỉ ghi mã "#8837" rồi bảo "tra sổ ở kho chính" thì mọi trạm trung chuyển đều tê liệt.

#### 4d. Hypermedia as the engine of application state (HATEOAS)

Đây là sub-constraint bị bỏ qua nhiều nhất. Fielding không dùng chữ viết tắt "HATEOAS" trong luận án; ông viết đầy đủ trong danh sách 4 constraint ở §5.1.5 (đã trích ở trên) và mô tả cơ chế ở §5.3.3.

📖 **Nguyên văn** (§5.3.3 Data View)
> "REST concentrates all of the control state into the representations received in response to interactions. The goal is to improve server scalability by eliminating any need for the server to maintain an awareness of the client state beyond the current request. An application's state is therefore defined by its pending requests, the topology of connected components (some of which may be filtering buffered data), the active requests on those connectors, the data flow of representations in response to those requests, and the processing of those representations as they are received by the user agent."

🇻🇳 **Dịch**
> "REST tập trung toàn bộ control state vào trong các representation nhận được từ các lần tương tác. Mục tiêu là cải thiện khả năng mở rộng của server bằng cách loại bỏ mọi nhu cầu server phải duy trì nhận thức về state của client ngoài phạm vi request hiện tại. Do đó state của một ứng dụng được định nghĩa bởi: các request đang chờ, topology của các component đang kết nối (một số có thể đang lọc dữ liệu đệm), các request đang hoạt động trên những connector đó, luồng dữ liệu của các representation trả về cho những request ấy, và quá trình xử lý các representation đó khi user agent nhận được."

📖 **Nguyên văn** (§5.3.3, câu định nghĩa cơ chế "engine")
> "The model application is therefore an engine that moves from one state to the next by examining and choosing from among the alternative state transitions in the current set of representations. Not surprisingly, this exactly matches the user interface of a hypermedia browser. However, the style does not assume that all applications are browsers. In fact, the application details are hidden from the server by the generic connector interface, and thus a user agent could equally be an automated robot performing information retrieval for an indexing service, a personal agent looking for data that matches certain criteria, or a maintenance spider busy patrolling the information for broken references or modified content [39]."

🇻🇳 **Dịch**
> "Vậy nên ứng dụng mẫu là một cỗ máy (engine) chuyển từ state này sang state kế tiếp bằng cách xem xét và lựa chọn trong số các state transition thay thế có sẵn trong tập representation hiện tại. Không có gì bất ngờ khi điều này khớp chính xác với giao diện người dùng của một hypermedia browser. Tuy nhiên style này không giả định rằng mọi ứng dụng đều là browser. Thực tế, chi tiết của ứng dụng được che khỏi server nhờ generic connector interface, và do đó một user agent hoàn toàn có thể là một robot tự động đi truy xuất thông tin cho dịch vụ lập chỉ mục, một agent cá nhân đi tìm dữ liệu khớp tiêu chí nào đó, hoặc một con spider bảo trì đang tuần tra thông tin để tìm reference hỏng hay nội dung đã thay đổi."

📖 **Nguyên văn** (§5.3.3, về steady-state)
> "An application reaches a steady-state whenever it has no outstanding requests; i.e., it has no pending requests and all of the responses to its current set of requests have been completely received or received to the point where they can be treated as a representation data stream. For a browser application, this state corresponds to a "web page," including the primary representation and ancillary representations, such as in-line images, embedded applets, and style sheets."

🇻🇳 **Dịch**
> "Một ứng dụng đạt tới steady-state bất cứ khi nào nó không còn request nào tồn đọng; tức là không có request đang chờ và toàn bộ response cho tập request hiện tại đã được nhận đầy đủ, hoặc nhận tới mức có thể coi như một luồng dữ liệu representation. Với một ứng dụng browser, state này tương ứng với một "trang web", bao gồm representation chính và các representation phụ trợ như ảnh nhúng, applet nhúng, và style sheet."

📖 **Nguyên văn** (§5.3.3, về nơi lưu application state)
> "The application state is controlled and stored by the user agent and can be composed of representations from multiple servers. In addition to freeing the server from the scalability problems of storing state, this allows the user to directly manipulate the state (e.g., a Web browser's history), anticipate changes to that state (e.g., link maps and prefetching of representations), and jump from one application to another (e.g., bookmarks and URI-entry dialogs)."

🇻🇳 **Dịch**
> "Application state được user agent kiểm soát và lưu trữ, và có thể được tạo thành từ các representation đến từ nhiều server khác nhau. Ngoài việc giải phóng server khỏi các vấn đề mở rộng do phải lưu state, điều này còn cho phép người dùng trực tiếp thao tác lên state (ví dụ history của Web browser), dự đoán trước các thay đổi của state (ví dụ link map và prefetch representation), và nhảy từ ứng dụng này sang ứng dụng khác (ví dụ bookmark và ô nhập URI)."

💡 **Ví dụ đời sống**
HATEOAS chính là **cách bạn dùng web bằng browser**. Bạn không cần đọc tài liệu để biết "muốn xem giỏ hàng thì gõ URL nào". Bạn vào trang chủ, **trang chủ đưa cho bạn các link khả dụng**, bạn bấm một cái, trang mới lại đưa tiếp các link khả dụng khác. Hypermedia (các link/form trong representation) chính là thứ **điều khiển** bạn đi từ trạng thái này sang trạng thái kia. Bạn — user agent — không hề biết trước sơ đồ đường đi của website; bạn học nó **ngay trong lúc chạy**, từ chính nội dung server trả về.

Trái ngược: một app mobile hardcode sẵn 40 URL endpoint trong source code là **không** HATEOAS — nó biết trước bản đồ, và khi server đổi URL thì app chết.

---

### Constraint 5 — Layered System

📖 **Nguyên văn** (§5.1.6)
> "In order to further improve behavior for Internet-scale requirements, we add layered system constraints (Figure 5-7). As described in Section 3.4.2, the layered system style allows an architecture to be composed of hierarchical layers by constraining component behavior such that each component cannot "see" beyond the immediate layer with which they are interacting. By restricting knowledge of the system to a single layer, we place a bound on the overall system complexity and promote substrate independence. Layers can be used to encapsulate legacy services and to protect new services from legacy clients, simplifying components by moving infrequently used functionality to a shared intermediary. Intermediaries can also be used to improve system scalability by enabling load balancing of services across multiple networks and processors."

🇻🇳 **Dịch**
> "Để cải thiện thêm hành vi nhằm đáp ứng các yêu cầu ở quy mô Internet, chúng tôi thêm các constraint layered system (Hình 5-7). Như mô tả ở Mục 3.4.2, layered system style cho phép một kiến trúc được cấu thành từ các tầng phân cấp, bằng cách ràng buộc hành vi component sao cho mỗi component không thể "nhìn" xa hơn tầng liền kề mà nó đang tương tác. Bằng cách giới hạn hiểu biết về hệ thống trong phạm vi một tầng, ta đặt một giới hạn lên độ phức tạp tổng thể của hệ thống và thúc đẩy tính độc lập với nền tảng bên dưới. Các tầng có thể được dùng để đóng gói các service legacy và bảo vệ service mới khỏi các client legacy, làm đơn giản hóa component bằng cách chuyển những chức năng ít dùng sang một thành phần trung gian dùng chung. Các thành phần trung gian cũng có thể được dùng để cải thiện khả năng mở rộng của hệ thống nhờ cho phép cân bằng tải service qua nhiều mạng và nhiều bộ xử lý."

📖 **Nguyên văn** (§5.1.6, trade-off)
> "The primary disadvantage of layered systems is that they add overhead and latency to the processing of data, reducing user-perceived performance [32]. For a network-based system that supports cache constraints, this can be offset by the benefits of shared caching at intermediaries."

🇻🇳 **Dịch**
> "Nhược điểm chính của layered system là chúng thêm overhead và độ trễ vào quá trình xử lý dữ liệu, làm giảm hiệu năng mà người dùng cảm nhận. Với một hệ thống network-based có hỗ trợ cache constraint, điều này có thể được bù lại bởi lợi ích của shared cache đặt ở các thành phần trung gian."

💡 **Ví dụ đời sống**
Bạn gọi điện cho tổng đài ngân hàng. Bạn nói chuyện với **một tổng đài viên** — bạn không biết và không cần biết phía sau cô ấy là hệ thống nào, có bao nhiêu phòng ban, dữ liệu nằm ở trung tâm nào. Ngân hàng có thể thay toàn bộ hệ thống lõi bên trong mà bạn vẫn gọi đúng số đó, nói đúng cách đó. Đổi lại: mỗi lớp trung gian đều thêm vài giây chờ.

---

### Constraint 6 — Code-On-Demand (tuỳ chọn)

📖 **Nguyên văn** (§5.1.7)
> "The final addition to our constraint set for REST comes from the code-on-demand style of Section 3.5.3 (Figure 5-8). REST allows client functionality to be extended by downloading and executing code in the form of applets or scripts. This simplifies clients by reducing the number of features required to be pre-implemented. Allowing features to be downloaded after deployment improves system extensibility. However, it also reduces visibility, and thus is only an optional constraint within REST."

🇻🇳 **Dịch**
> "Bổ sung cuối cùng vào tập constraint của REST đến từ code-on-demand style ở Mục 3.5.3 (Hình 5-8). REST cho phép mở rộng chức năng của client bằng cách tải về và thực thi code dưới dạng applet hoặc script. Điều này làm đơn giản hóa client vì giảm số tính năng phải hiện thực sẵn. Cho phép tải tính năng về sau khi đã triển khai giúp cải thiện khả năng mở rộng của hệ thống. Tuy nhiên nó cũng làm giảm visibility, **và vì vậy đây chỉ là một constraint tuỳ chọn (optional) trong REST**."

📖 **Nguyên văn** (§5.1.7, giải thích "optional constraint")
> "The notion of an optional constraint may seem like an oxymoron. However, it does have a purpose in the architectural design of a system that encompasses multiple organizational boundaries. It means that the architecture only gains the benefit (and suffers the disadvantages) of the optional constraints when they are known to be in effect for some realm of the overall system."

🇻🇳 **Dịch**
> "Khái niệm "constraint tuỳ chọn" nghe có vẻ tự mâu thuẫn. Tuy nhiên nó có mục đích riêng trong thiết kế kiến trúc của một hệ thống trải rộng qua nhiều ranh giới tổ chức. Nó có nghĩa là kiến trúc chỉ hưởng lợi (và chịu bất lợi) từ các constraint tuỳ chọn khi những constraint đó được biết chắc là đang có hiệu lực trong một phạm vi nào đó của toàn hệ thống."

💡 **Ví dụ đời sống**
Code-on-demand chính là **JavaScript**. Browser của bạn ban đầu không biết validate form đơn hàng của shop X, nhưng shop X gửi kèm đoạn script và browser thực thi nó. Browser "học thêm kỹ năng" ngay lúc chạy. Đây cũng là lý do nó "reduces visibility": proxy đứng giữa không còn đoán được request tiếp theo sẽ là gì, vì logic nằm trong code vừa tải về.

---

## A.4. Tóm tắt Phần A

| # | Constraint | Điểm cốt lõi theo Fielding | Trade-off Fielding nêu |
|---|---|---|---|
| 1 | Client-Server | separation of concerns; hai bên **evolve independently** | (không nêu nhược điểm riêng) |
| 2 | Stateless | mỗi request chứa **toàn bộ** thông tin; session state nằm ở client | tăng dữ liệu lặp lại; server mất kiểm soát tính nhất quán |
| 3 | Cache | response phải gán nhãn cacheable / non-cacheable | dữ liệu stale làm giảm reliability |
| 4 | Uniform Interface | 4 sub-constraint; đặc điểm **trung tâm** phân biệt REST | giảm hiệu quả vì dùng dạng chuẩn hóa |
| 5 | Layered System | component không "nhìn" quá tầng liền kề | thêm overhead và latency |
| 6 | Code-On-Demand | client tải code về chạy — **optional** | giảm visibility |

🇻🇳 Bảng tự tổng hợp từ §5.1.2–§5.1.7, không phải trích nguyên văn.

---

# PHẦN B — KHOẢNG CÁCH GIỮA LÝ THUYẾT VÀ THỰC TẾ

> [!warning] Đọc kỹ nhãn
> Phần B này **chủ yếu là nhận định của mình** sau khi đối chiếu luận án với thực tế ngành. Các câu nhận định **không** mang nhãn "Nguyên văn". Chỉ những khối có nhãn "Nguyên văn" mới là trích đúng từng chữ từ nguồn.

## B.1. "REST API" mà đa số người nói đến là gì

Trong thực tế công việc, khi ai đó nói "API này là REST", gần như luôn có nghĩa là:

1. URL đặt theo danh từ số nhiều: `/customers`, `/orders/42/items`
2. Dùng đúng HTTP method: GET để đọc, POST để tạo, PUT/PATCH để sửa, DELETE để xoá
3. Trả về JSON
4. Dùng status code hợp lý: 200, 201, 404, 422, 500

**Nhận định của mình:** 4 điểm này đối chiếu với Chapter 5 thì chỉ chạm được vào sub-constraint 4a (identification of resources) và một phần 4b/4c. Ba constraint còn lại (stateless, cache, layered system) thường **có** nhưng là do dùng HTTP nên được miễn phí, chứ không phải do thiết kế có ý thức. Còn 4d — HATEOAS — thì gần như vắng mặt.

Fielding định nghĩa REST ở mức **kiến trúc hệ thống phân tán**, còn ngành công nghiệp dùng chữ REST ở mức **quy ước đặt tên URL**. Đó là hai tầng khác hẳn nhau.

## B.2. HATEOAS — ràng buộc bắt buộc nhưng gần như không ai làm

Nhắc lại đoạn đã trích ở §5.1.5: Fielding liệt kê **bốn** interface constraint và "hypermedia as the engine of application state" nằm trong đó, ngang hàng với ba cái kia. Không có chữ "optional" nào gắn cho nó — chữ "optional" Fielding chỉ dùng duy nhất cho code-on-demand (§5.1.7, đã trích).

**Nhận định của mình:** HATEOAS đòi hỏi response phải chứa các link/control cho biết **từ trạng thái này đi tiếp được đâu**, và client phải điều hướng bằng chính các link đó thay vì hardcode URL. Ví dụ một response đơn hàng "RESTful đầy đủ" sẽ kèm theo link `cancel`, `pay`, `refund` — và client chỉ hiện nút "Huỷ đơn" khi link `cancel` có mặt.

Thực tế: gần như không API thương mại lớn nào triển khai đầy đủ HATEOAS. Lý do mình quan sát được:

- Client phổ biến nhất ngày nay là **SPA / mobile app**, không phải browser tổng quát. Chúng vốn đã được viết riêng cho đúng một backend, nên lợi ích "client không cần biết trước bản đồ URL" gần như không được dùng tới.
- Viết client biết tự khám phá link phức tạp hơn nhiều so với gọi thẳng URL đã biết.
- Không có media type hypermedia nào thắng tuyệt đối (HAL, JSON:API, Siren, Collection+JSON... mỗi nơi một kiểu), nên "generic client" — tiền đề để HATEOAS có giá trị — không tồn tại.

Hệ quả thực tế: cái mà ngành gọi là "REST API" phần lớn đúng ra nên gọi là **HTTP API kiểu resource-oriented**. Không sai về kỹ thuật, chỉ là không phải REST theo định nghĩa gốc.

> [!tip]
> Về mặt nghề nghiệp: đừng đi cãi nhau chuyện "API này không REST thật". Điều đáng làm là **biết mình đang bỏ constraint nào và vì sao**. Bỏ HATEOAS để đổi lấy client đơn giản là một trade-off hợp lý; bỏ stateless để nhét session vào RAM server thì trả giá thật bằng scalability.

## B.3. Fielding có phàn nàn về việc REST bị hiểu sai không?

**Trong phạm vi luận án (Chapter 5 và Chapter 6):** mình **KHÔNG tìm thấy** đoạn nào Fielding phàn nàn trực tiếp về việc "REST bị hiểu sai thành URL đẹp + JSON". Điều này hợp lý về mặt thời gian — luận án viết năm 2000, còn làn sóng "REST API" thương mại nổ ra vài năm sau đó. (Fielding có viết một bài blog năm 2008 về chủ đề này, nhưng bài đó **không** nằm trong nguồn mình được giao nên mình không trích, để tránh dẫn sai.)

Tuy nhiên, Chapter 6 **có** một mục chuyên bàn về việc các hệ thống thực tế vi phạm constraint của REST. Đây là các đoạn nguyên văn:

📖 **Nguyên văn** (Chapter 6, §6.2.5 REST Mismatches in URI)
> "Like most real-world systems, not all components of the deployed Web architecture obey every constraint present in its architectural design. REST has been used both as a means to define architectural improvements and to identify architectural mismatches. Mismatches occur when, due to ignorance or oversight, a software implementation is deployed that violates the architectural constraints. While mismatches cannot be avoided in general, it is possible to identify them before they become standardized."

🇻🇳 **Dịch**
> "Như phần lớn hệ thống thực tế, không phải mọi component của kiến trúc Web đã triển khai đều tuân theo mọi constraint có trong thiết kế kiến trúc của nó. REST đã được dùng vừa như một phương tiện để định nghĩa các cải tiến kiến trúc, vừa để nhận diện các sai lệch kiến trúc (architectural mismatch). Sai lệch xảy ra khi, do thiếu hiểu biết hoặc sơ suất, một hiện thực phần mềm được triển khai mà vi phạm các constraint kiến trúc. Dù nhìn chung không thể tránh được sai lệch, ta vẫn có thể nhận diện chúng trước khi chúng bị chuẩn hóa."

📖 **Nguyên văn** (Chapter 6, §6.5.4.1 Application State in a Network-based System)
> "REST defines a model of expected application behavior which supports simple and robust applications that are largely immune from the partial failure conditions that beset most network-based applications. However, that doesn't stop application developers from introducing features which violate the model. The most frequent violations are in regard to the constraints on application state and stateless interaction."

🇻🇳 **Dịch**
> "REST định nghĩa một mô hình hành vi ứng dụng kỳ vọng, hỗ trợ những ứng dụng đơn giản và bền bỉ, phần lớn miễn nhiễm với các tình huống lỗi cục bộ vốn hành hạ hầu hết ứng dụng network-based. Tuy nhiên điều đó không ngăn được lập trình viên đưa vào những tính năng vi phạm mô hình. **Những vi phạm thường gặp nhất liên quan tới các constraint về application state và tương tác stateless.**"

📖 **Nguyên văn** (Chapter 6, §6.3.4.2 Cookies)
> "Cookies also violate REST because they allow data to be passed without sufficiently identifying its semantics, thus becoming a concern for both security and privacy. The combination of cookies with the Referer [sic] header field makes it possible to track a user as they browse between sites."

🇻🇳 **Dịch**
> "Cookie cũng vi phạm REST vì chúng cho phép truyền dữ liệu mà không định danh đủ rõ ngữ nghĩa của dữ liệu đó, do vậy trở thành mối lo cho cả bảo mật lẫn quyền riêng tư. Việc kết hợp cookie với header field Referer [sic] khiến việc theo dõi người dùng khi họ duyệt qua các site trở nên khả thi."

📖 **Nguyên văn** (Chapter 6, §6.2.5, về việc nhét user-id vào URI)
> "One form of abuse is to include information that identifies the current user within all of the URI referenced by a hypermedia response representation. Such embedded user-ids can be used to maintain session state on the server, track user behavior by logging their actions, or carry user preferences across multiple actions (e.g., Hyper-G's gateways [84]). However, by violating REST's constraints, these systems also cause shared caching to become ineffective, reduce server scalability, and result in undesirable effects when a user shares those references with others."

🇻🇳 **Dịch**
> "Một dạng lạm dụng là nhúng thông tin định danh người dùng hiện tại vào tất cả các URI được tham chiếu trong một hypermedia response representation. Những user-id nhúng như vậy có thể dùng để duy trì session state trên server, theo dõi hành vi người dùng bằng cách ghi log hành động của họ, hoặc mang theo tuỳ chọn của người dùng qua nhiều thao tác. Tuy nhiên, do vi phạm các constraint của REST, những hệ thống này cũng khiến shared cache mất tác dụng, làm giảm scalability của server, và gây ra hệ quả không mong muốn khi người dùng chia sẻ các tham chiếu đó cho người khác."

📖 **Nguyên văn** (Chapter 6, §6.5.3 HTTP is not a Transport Protocol)
> "Most of the recently proposed extensions to HTTP, aside from WebDAV [60], have merely used HTTP as a way to move other application protocols through a firewall, which is a fundamentally misguided idea. Not only does it defeat the purpose of having a firewall, but it won't work for the long term because firewall vendors will simply have to perform additional protocol filtering. It therefore makes no sense to do those extensions on top of HTTP, since the only thing HTTP accomplishes in that situation is to add overhead from a legacy syntax."

🇻🇳 **Dịch**
> "Phần lớn các đề xuất mở rộng HTTP gần đây, ngoại trừ WebDAV, chỉ đơn thuần dùng HTTP như một cách để đẩy các application protocol khác xuyên qua firewall, và đó là một ý tưởng sai lầm về căn bản. Nó không chỉ làm mất đi mục đích của việc có firewall, mà còn không bền vững lâu dài vì các hãng làm firewall rồi sẽ phải bổ sung khả năng lọc protocol. Vì vậy việc xây các mở rộng đó trên nền HTTP là vô nghĩa, bởi thứ duy nhất HTTP làm được trong tình huống ấy là thêm overhead từ một cú pháp legacy."

**Nhận định của mình:** đoạn §6.5.3 này chính là mũi kim đâm vào kiểu API "tunnel" — nơi mọi thứ là `POST /api` với một body JSON `{"action": "..."}`. Về hình thức nó chạy trên HTTP, nhưng nó dùng HTTP làm ống dẫn chứ không dùng semantics của HTTP, nên mọi intermediary (cache, proxy, CDN) đều mù.

---

# PHẦN C — REST TRONG THỰC HÀNH

## C.1. Ánh xạ constraint của REST sang HTTP

Fielding không chỉ viết lý thuyết — ông đồng thời là tác giả HTTP/1.1, nên HTTP chính là hiện thực tham chiếu của REST. Bảng ánh xạ:

| Khái niệm REST (Ch.5) | Hiện thực trong HTTP | Nguồn |
|---|---|---|
| resource | target của request, định danh bằng URI | RFC 9110 §3.1 |
| resource identifier | URL / URN | Table 5-1 |
| representation | message body + representation metadata | RFC 9110 §3.2 |
| representation metadata | header field: `Content-Type`, `Last-Modified` | Table 5-1 |
| control data | header field: `If-Modified-Since`, `Cache-Control` | Table 5-1 |
| hành động trên resource | HTTP method (GET/POST/PUT/DELETE/PATCH) | RFC 9110 §9 |
| kết quả xử lý | status code 3 chữ số | RFC 9110 §15 |
| uniform interface | tập method + media type chuẩn, ai cũng hiểu như nhau | §5.1.5 |

🇻🇳 Bảng tự tổng hợp; cột nguồn chỉ chỗ để tra lại, không phải trích nguyên văn.

### Resource → URI

📖 **Nguyên văn** (RFC 9110, §3.1 Resources)
> "The target of an HTTP request is called a "resource".  HTTP does not limit the nature of a resource; it merely defines an interface that might be used to interact with resources.  Most resources are identified by a Uniform Resource Identifier (URI), as described in Section 4."

🇻🇳 **Dịch**
> "Đích của một HTTP request được gọi là "resource". HTTP không giới hạn bản chất của một resource; nó chỉ định nghĩa một interface có thể dùng để tương tác với các resource. Phần lớn resource được định danh bằng một Uniform Resource Identifier (URI), như mô tả ở Mục 4."

📖 **Nguyên văn** (RFC 9110, §3.1, tiếp)
> "One design goal of HTTP is to separate resource identification from request semantics, which is made possible by vesting the request semantics in the request method (Section 9) and a few request-modifying header fields.  A resource cannot treat a request in a manner inconsistent with the semantics of the method of the request."

🇻🇳 **Dịch**
> "Một mục tiêu thiết kế của HTTP là tách việc định danh resource khỏi ngữ nghĩa của request, điều này thực hiện được nhờ đặt ngữ nghĩa request vào trong request method (Mục 9) và một vài header field chỉnh sửa request. Một resource không được xử lý request theo cách mâu thuẫn với ngữ nghĩa của method trong request đó."

> [!tip]
> Đây là lý do kỹ thuật khiến `GET /orders/42/delete` là thiết kế tồi: URI nói "xoá", còn method GET có ngữ nghĩa "chỉ đọc". RFC 9110 nói thẳng resource **không được** hành xử mâu thuẫn với ngữ nghĩa của method. Chi tiết về safe / idempotent xem [[01 - API là gì và nền tảng HTTP]].

### Representation → body + header

📖 **Nguyên văn** (RFC 9110, §3.2 Representations)
> "A "representation" is information that is intended to reflect a past, current, or desired state of a given resource, in a format that can be readily communicated via the protocol.  A representation consists of a set of representation metadata and a potentially unbounded stream of representation data (Section 8)."

🇻🇳 **Dịch**
> "Một "representation" là thông tin nhằm phản ánh trạng thái quá khứ, hiện tại, hoặc mong muốn của một resource cho trước, ở một định dạng có thể dễ dàng truyền đi qua protocol. Một representation bao gồm một tập representation metadata và một luồng representation data có thể không giới hạn độ dài."

📖 **Nguyên văn** (RFC 9110, §3.2, tiếp — dẫn thẳng tới REST)
> "HTTP allows "information hiding" behind its uniform interface by defining communication with respect to a transferable representation of the resource state, rather than transferring the resource itself.  This allows the resource identified by a URI to be anything, including temporal functions like "the current weather in Laguna Beach", while potentially providing information that represents that resource at the time a message is generated [REST]."

🇻🇳 **Dịch**
> "HTTP cho phép "che giấu thông tin" đằng sau uniform interface của nó bằng cách định nghĩa giao tiếp dựa trên một representation có thể truyền đi của trạng thái resource, thay vì truyền chính bản thân resource. Điều này cho phép resource được định danh bởi một URI có thể là bất cứ thứ gì, kể cả các hàm mang tính thời điểm như "thời tiết hiện tại ở Laguna Beach", trong khi vẫn có thể cung cấp thông tin đại diện cho resource đó tại thời điểm message được tạo ra [REST]."

> [!note]
> Chú ý cái tham chiếu `[REST]` ở cuối câu: RFC 9110 — spec HTTP hiện hành, xuất bản 2022 — **trích dẫn thẳng luận án của Fielding** làm nguồn. Đây là bằng chứng rõ nhất rằng REST và HTTP không phải hai thứ ghép lại cho vui.

### Header → metadata

📖 **Nguyên văn** (RFC 9110, §6.3 Header Fields)
> "Fields (Section 5) that are sent or received before the content are referred to as "header fields" (or just "headers", colloquially). The "header section" of a message consists of a sequence of header field lines.  Each header field might modify or extend message semantics, describe the sender, define the content, or provide additional context."

🇻🇳 **Dịch**
> "Các field được gửi hoặc nhận trước phần content được gọi là "header field" (hoặc gọi nôm na là "header"). Phần "header section" của một message bao gồm một chuỗi các dòng header field. Mỗi header field có thể chỉnh sửa hoặc mở rộng ngữ nghĩa của message, mô tả bên gửi, định nghĩa content, hoặc cung cấp thêm ngữ cảnh."

Đối chiếu với Fielding §5.2.1.2: header chính là chỗ chứa cả **representation metadata** (`Content-Type`, `Last-Modified`) lẫn **control data** (`Cache-Control`, `If-Modified-Since`). Chính header là thứ làm message "self-descriptive".

### Method → hành động

📖 **Nguyên văn** (RFC 9110, §9.3.1 GET)
> "The GET method requests transfer of a current selected representation for the target resource."

🇻🇳 **Dịch**
> "Method GET yêu cầu truyền về một representation hiện đang được chọn của target resource."

📖 **Nguyên văn** (RFC 9110, §9.3.3 POST)
> "The POST method requests that the target resource process the representation enclosed in the request according to the resource's own specific semantics."

🇻🇳 **Dịch**
> "Method POST yêu cầu target resource xử lý representation đính kèm trong request theo ngữ nghĩa riêng của chính resource đó."

📖 **Nguyên văn** (RFC 9110, §9.3.4 PUT)
> "The PUT method requests that the state of the target resource be created or replaced with the state defined by the representation enclosed in the request message content.  A successful PUT of a given representation would suggest that a subsequent GET on that same target resource will result in an equivalent representation being sent in a 200 (OK) response."

🇻🇳 **Dịch**
> "Method PUT yêu cầu trạng thái của target resource được tạo mới hoặc thay thế bằng trạng thái được định nghĩa bởi representation đính kèm trong phần content của request. Một lần PUT thành công với một representation cho trước hàm ý rằng một lần GET tiếp theo lên chính target resource đó sẽ trả về một representation tương đương trong response 200 (OK)."

📖 **Nguyên văn** (RFC 9110, §9.3.5 DELETE)
> "The DELETE method requests that the origin server remove the association between the target resource and its current functionality.  In effect, this method is similar to the "rm" command in UNIX: it expresses a deletion operation on the URI mapping of the origin server rather than an expectation that the previously associated information be deleted."

🇻🇳 **Dịch**
> "Method DELETE yêu cầu origin server gỡ bỏ liên kết giữa target resource và chức năng hiện tại của nó. Trên thực tế, method này tương tự lệnh "rm" trong UNIX: nó thể hiện thao tác xoá lên ánh xạ URI của origin server, chứ không phải kỳ vọng rằng thông tin từng gắn với nó sẽ bị xoá."

> [!note]
> Câu về DELETE rất đáng nhớ: DELETE **không** hứa "dữ liệu bị xoá khỏi database". Nó chỉ nói "URI này không còn ánh xạ tới chức năng đó nữa". Soft-delete vẫn hoàn toàn hợp lệ với DELETE.

### Status code → kết quả

📖 **Nguyên văn** (RFC 9110, §15 Status Codes)
> "The status code of a response is a three-digit integer code that describes the result of the request and the semantics of the response, including whether the request was successful and what content is enclosed (if any).  All valid status codes are within the range of 100 to 599, inclusive.
>
>    The first digit of the status code defines the class of response.  The last two digits do not have any categorization role.  There are five values for the first digit:
>
>    *  1xx (Informational): The request was received, continuing process
>
>    *  2xx (Successful): The request was successfully received, understood, and accepted
>
>    *  3xx (Redirection): Further action needs to be taken in order to complete the request
>
>    *  4xx (Client Error): The request contains bad syntax or cannot be fulfilled
>
>    *  5xx (Server Error): The server failed to fulfill an apparently valid request"

🇻🇳 **Dịch**
> "Status code của một response là một số nguyên ba chữ số mô tả kết quả của request và ngữ nghĩa của response, bao gồm việc request có thành công hay không và content nào được đính kèm (nếu có). Mọi status code hợp lệ nằm trong khoảng từ 100 tới 599.
>
> Chữ số đầu tiên của status code định nghĩa lớp (class) của response. Hai chữ số cuối không mang vai trò phân loại nào. Chữ số đầu có năm giá trị:
>
> * 1xx (Informational): request đã được nhận, đang tiếp tục xử lý
> * 2xx (Successful): request đã được nhận, hiểu, và chấp nhận thành công
> * 3xx (Redirection): cần thực hiện thêm hành động để hoàn tất request
> * 4xx (Client Error): request có cú pháp sai hoặc không thể được đáp ứng
> * 5xx (Server Error): server đã thất bại trong việc đáp ứng một request trông có vẻ hợp lệ"

📖 **Nguyên văn** (RFC 9110, §15, quy tắc client)
> "HTTP status codes are extensible.  A client is not required to understand the meaning of all registered status codes, though such understanding is obviously desirable.  However, a client MUST understand the class of any status code, as indicated by the first digit, and treat an unrecognized status code as being equivalent to the x00 status code of that class."

🇻🇳 **Dịch**
> "Status code của HTTP có thể mở rộng. Client không bắt buộc phải hiểu ý nghĩa của mọi status code đã đăng ký, dù dĩ nhiên hiểu được thì tốt. Tuy nhiên client **PHẢI** hiểu lớp của bất kỳ status code nào, theo chữ số đầu tiên, và phải xử lý một status code không nhận diện được như thể nó là status code x00 của lớp đó."

> [!warning]
> Quy tắc này chính là biểu hiện cụ thể của **self-descriptive messages**. Nó cho phép server thêm status code mới mà client cũ vẫn không vỡ — đúng tinh thần "components evolve independently" ở constraint client-server. Nhưng nó chỉ hoạt động khi bạn **dùng đúng lớp**. API trả `200 OK` kèm body `{"error": "not found"}` phá hỏng chính xác cơ chế này: mọi cache và monitoring ở giữa đều tưởng request thành công.

---

## C.2. Ví dụ thiết kế endpoint cho một resource

> **Ví dụ tự viết** — không trích từ luận án hay RFC. Dùng để minh hoạ cách ánh xạ constraint sang thiết kế cụ thể.

Giả sử resource là **"chương trình tích điểm của một cửa hàng"** và **"thành viên"** thuộc chương trình đó.

```
GET    /programs/{programId}              → lấy representation của chương trình
GET    /programs/{programId}/members      → lấy collection thành viên (có phân trang)
POST   /programs/{programId}/members      → tạo một thành viên mới → 201 + Location
GET    /members/{memberId}                → lấy representation một thành viên
PUT    /members/{memberId}                → thay thế toàn bộ state của thành viên
PATCH  /members/{memberId}                → sửa một phần state
DELETE /members/{memberId}                → gỡ ánh xạ resource này
GET    /members/{memberId}/transactions   → lịch sử giao dịch điểm của thành viên
```

🇻🇳 Bảng endpoint trên là ví dụ tự viết: mỗi dòng gồm method, URI, và ý nghĩa hành động tương ứng.

Vì sao đặt như vậy — đối chiếu từng constraint:

- **Identification of resources:** mỗi URI trỏ tới đúng một khái niệm. `/members/{id}` là "thành viên X", không phải "hàm getMember".
- **Uniform interface:** không có URI nào dạng `/getMember` hay `/deleteMember`. Động từ nằm ở method, danh từ nằm ở URI.
- **Self-descriptive:** response luôn có `Content-Type: application/json`, `Cache-Control`, `ETag`. Lỗi validate trả `422`, không phải `200` kèm `{"ok": false}`.
- **Cache:** `GET /members/{id}` đặt được `Cache-Control: private, max-age=...` + `ETag`; client gửi `If-None-Match` để nhận `304`. `POST` thì non-cacheable theo mặc định (§5.2.2 đã trích).
- **Stateless:** không có endpoint kiểu `POST /select-program` rồi các request sau "ngầm hiểu" đang ở program nào. `programId` luôn nằm trong URI hoặc trong request.

Một response có thêm hypermedia (hướng HATEOAS) sẽ trông như thế này — **ví dụ tự viết**:

```json
{
  "id": "mem_10293",
  "name": "Nguyen Van A",
  "points": 1450,
  "tier": "silver",
  "_links": {
    "self":         { "href": "/members/mem_10293" },
    "transactions": { "href": "/members/mem_10293/transactions" },
    "redeem":       { "href": "/members/mem_10293/redemptions", "method": "POST" },
    "upgrade":      { "href": "/members/mem_10293/tier", "method": "PUT" }
  }
}
```

🇻🇳 JSON trên là ví dụ tự viết: khối `_links` liệt kê các state transition khả dụng từ trạng thái hiện tại; client đọc `_links` để biết được phép làm gì tiếp theo, thay vì hardcode sẵn URL.

Điểm mấu chốt: nếu thành viên chưa đủ điểm đổi quà, server **không trả link `redeem`**. Client chỉ cần kiểm tra sự có mặt của link chứ không phải tự cài lại luật nghiệp vụ "điểm >= 500 thì hiện nút Đổi quà". Đó là "hypermedia as the engine of application state" hoạt động.

---

## C.3. Stateless nghĩa là gì khi server có session?

Đây là chỗ nhầm lẫn phổ biến nhất. Nhắc lại chính xác câu của Fielding (§5.1.3, đã trích đầy đủ ở trên): *"...cannot take advantage of any stored context on the server. Session state is therefore kept entirely on the client."*

**Nhận định của mình** — cần phân biệt hai loại state, vì Fielding phân biệt rất rõ:

| Loại state | Được lưu ở server? | Giải thích |
|---|---|---|
| **Resource state** | **Có** — đây là việc của server | Đơn hàng, số điểm, danh sách thành viên. Đây là dữ liệu nghiệp vụ, nằm trong database. Stateless không cấm cái này. |
| **Application / session state** | **Không** | "Người dùng này đang ở bước 3 của wizard", "đang đăng nhập với tài khoản nào", "đang chọn program nào". Cái này phải nằm ở client và được gửi kèm mỗi request. |

Stateless **không** có nghĩa là "server không được có database". Nó có nghĩa là: hai request liên tiếp của cùng một client **không được phụ thuộc vào bộ nhớ tạm mà server giữ giữa chúng**.

Ví dụ so sánh — **ví dụ tự viết**:

| Cách làm | Có stateless không? | Vì sao |
|---|---|---|
| Server tạo `sessionId`, lưu `{userId, cart}` trong RAM của process, client gửi cookie `sessionId` | **Không** | Request thứ hai vô nghĩa nếu không có context đã lưu trên server. Đổi instance là mất session. |
| Client gửi token tự chứa (self-contained) trong header, server verify chữ ký rồi đọc luôn `userId` từ token | **Có** | Request tự mang đủ thông tin; server không cần nhớ gì giữa các request. |
| Server lưu session trong Redis dùng chung, client gửi `sessionId` | Về mặt lý thuyết Fielding: **vẫn không** | Server vẫn dựa vào "stored context". Nhưng về mặt vận hành, nó giải được vấn đề scale ngang — đây là trade-off rất phổ biến trong thực tế. |

Liên hệ tới đoạn Fielding phê cookie (§6.3.4.2, đã trích ở Phần B): vấn đề ông chỉ ra là cookie gắn với **một tập URI** chứ không gắn với **application state hiện tại của browser** — nên khi bấm nút Back, state trong cookie và state đang hiển thị lệch nhau.

> [!note]
> Câu chuyện "làm sao truyền danh tính người dùng mà vẫn stateless" chính là chủ đề của các bài **Authentication** ở đợt B. Ở đây chỉ cần nắm: mọi cơ chế auth dạng token tự chứa (self-contained token) đều sinh ra để thoả mãn constraint stateless này, còn session lưu trên server thì đánh đổi stateless lấy sự tiện lợi.

---

## C.4. Checklist đọc nhanh: API của mình REST tới đâu?

> **Ví dụ tự viết** — checklist tự tổng hợp từ 6 constraint, không phải nội dung có sẵn trong nguồn.

| Constraint | Câu hỏi kiểm tra |
|---|---|
| Client-Server | Frontend và backend deploy độc lập được không? Đổi UI có phải sửa server không? |
| Stateless | Nếu xoá sạch RAM của một instance server, request đang dở của user có hỏng không? |
| Cache | Response GET có `Cache-Control` / `ETag` không? Có gửi `304` không? |
| Uniform — identification | URI là danh từ chỉ resource, hay là tên hàm? |
| Uniform — representations | Client sửa resource bằng cách gửi representation, hay bằng cách gọi `?action=xxx`? |
| Uniform — self-descriptive | Status code có phản ánh đúng lớp kết quả không? `Content-Type` có đúng không? Proxy đứng giữa có hiểu được message không? |
| Uniform — HATEOAS | Response có chứa link cho các hành động kế tiếp không? Client có hardcode URL không? |
| Layered System | Chèn CDN / reverse proxy / API gateway vào giữa có làm hỏng gì không? |
| Code-On-Demand | (optional — không có cũng không sao) |

---

## 🔌 Liên hệ stack thực tế

> Phần này là ghi chú riêng, KHÔNG trích từ tài liệu spec.

- **Cloud Run / serverless nói chung ép bạn phải stateless.** Mỗi request có thể rơi vào một container instance khác nhau và instance bị thu hồi bất cứ lúc nào. Session lưu trong biến toàn cục của process sẽ hoạt động lúc test rồi hỏng ngẫu nhiên khi có nhiều instance. Đây là constraint số 2 của Fielding hiện ra dưới dạng hoá đơn phải trả.
- **Constraint "Layered System" là thứ khiến CDN/reverse proxy cắm vào được.** Nhưng nó chỉ có tác dụng khi message self-descriptive: nếu mọi thứ đều là `POST /api` trả `200` thì CDN không cache được gì cả, dù bạn có bật.
- **Cache constraint đáng tiền nhất ở tầng API đọc nhiều.** Đặt `ETag` + `Cache-Control` cho các endpoint GET có thể cắt hẳn một lượng lớn round-trip — đúng câu Fielding: "the most efficient network request is one that doesn't use the network".
- **Đừng dùng `200` cho mọi thứ.** Rất nhiều backend trả `200` rồi nhét `{"success": false}` vào body. Điều này phá self-descriptive message: monitoring, alert, retry logic, cache đều đọc status code chứ không parse body.

---

## Liên kết

- [[01 - API là gì và nền tảng HTTP]] — resource, safe / idempotent method, nền tảng HTTP cho bài này
- [[02 - What is HTTP]] — HTTP cơ bản: request/response, method, header, status code
- [[07 - N+1 Problem]] — hệ quả hay gặp khi client REST phải gọi lần lượt nhiều endpoint con
- [[11 - NULL, Hàm String, Date và JSON]] — JSON, định dạng representation phổ biến nhất của REST API ngày nay
- [[13 - SQL Injection và Parameterized Query]] — input từ API là input không tin cậy

---

## Nguồn tham khảo

- Roy Thomas Fielding, *Architectural Styles and the Design of Network-based Software Architectures*, PhD Dissertation, University of California, Irvine, 2000 — **Chapter 5: Representational State Transfer (REST)** : https://www.ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm
- Cùng luận án — **Chapter 6: Experience and Evaluation** : https://www.ics.uci.edu/~fielding/pubs/dissertation/evaluation.htm
- Trang mục lục luận án : https://www.ics.uci.edu/~fielding/pubs/dissertation/top.htm
- RFC 9110 — *HTTP Semantics* (R. Fielding, M. Nottingham, J. Reschke, eds., June 2022) : https://www.rfc-editor.org/rfc/rfc9110.txt
