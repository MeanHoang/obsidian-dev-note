# Chapter 2. Architectural Thinking
**Architectural thinking = tư duy của kiến trúc sư phần mềm**, tức là:
- Không chỉ nhìn **1 đoạn code / 1 tính năng**
- Mà nhìn **toàn bộ hệ thống**, giống như nhìn bản vẽ tổng thể của một tòa nhà 🏗️
Nói đơn giản:
Dev thường hỏi: _“Viết đoạn này sao cho chạy được?”_  
Architect hỏi: _“Viết như vậy thì **hệ thống sau 1 năm, 10 lần scale** sẽ ra sao?”_
**Architectural thinking** là cách nhìn hệ thống từ **góc độ kiến trúc sư**, tức là nhìn **tổng thể hệ thống** chứ không chỉ từng phần nhỏ. Nó bao gồm việc:
- Hiểu **một thay đổi sẽ ảnh hưởng thế nào đến toàn bộ hệ thống**, đặc biệt là khả năng mở rộng (scalability)
- Chú ý đến **cách các thành phần trong hệ thống tương tác với nhau**
- Biết **chọn thư viện và framework phù hợp** với từng bối cảnh cụ thể
Để có tư duy như một kiến trúc sư, trước hết cần:
- Hiểu **software architecture là gì** và **khác gì với design**
- Có **kiến thức rộng** để nhận ra các giải pháp và khả năng mà người khác có thể không thấy
- Hiểu **yếu tố kinh doanh (business drivers)** và cách chúng ảnh hưởng đến quyết định kiến trúc
- Biết **phân tích và cân bằng các đánh đổi (trade-offs)** giữa các giải pháp và công nghệ
Chương này sẽ trình bày những khía cạnh trên của tư duy kiến trúc.
# Architecture Versus Design
Đoạn này dùng **ví dụ ngôi nhà** để phân biệt **architecture** và **design**.
- **Architecture** giống như cấu trúc tổng thể của ngôi nhà: số tầng, kiểu mái, quy mô… → quyết định **hình dạng và cấu trúc chung**.
- **Design** giống như phần bên trong: sàn nhà, màu tường, đèn… → quyết định **cách trông và cảm nhận**.
Tương tự trong phần mềm:
- **Software architecture** tập trung vào **cấu trúc hệ thống** (ví dụ: chọn [[Microservices]] hay không).
- **Design** tập trung vào **cách thể hiện** (ví dụ: giao diện UI trông thế nào).
Tuy nhiên, nhiều quyết định không hoàn toàn là architecture hay design mà nằm **giữa hai thái cực**, nên khó phân loại.
Để xác định một quyết định thuộc về architecture hay design, có thể dựa vào:
- Nó mang tính **chiến lược hay chiến thuật**
- **Độ khó và chi phí** khi thay đổi
- **Mức độ đánh đổi (trade-off)** của quyết định đó
Những yếu tố này tạo thành một **phổ (spectrum)** giữa architecture và design.
# Strategic Versus Tactical Decisions
- **Quyết định càng mang tính chiến lược (strategic)** thì càng thuộc về **architecture**.
- **Quyết định càng mang tính chiến thuật (tactical)** thì càng thuộc về **design**.
**Strategic decisions** thường:
- Dài hạn
- Ảnh hưởng lớn
- Phụ thuộc nhiều quyết định khác
**Tactical decisions** thường:
- Ngắn hạn
- Ít ảnh hưởng
- Có thể thay đổi dễ dàng
Để phân biệt strategic hay tactical, có thể xét:
- **Mức độ suy nghĩ và lập kế hoạch**:  
    Quyết định mất vài phút → tactical (design)  
    Quyết định cần nhiều tuần → strategic (architecture)
- **Số người tham gia**:  
    Ít người → tactical  
    Nhiều stakeholder → strategic
- **Tầm nhìn dài hay ngắn hạn**:  
    Dễ thay đổi → tactical  
    Tồn tại lâu dài → strategic
Những tiêu chí này giúp xác định một quyết định nghiêng về **architecture** hay **design**, dù việc phân loại có thể mang tính chủ quan.
# Level of Effort
**Architecture** là những quyết định **khó thay đổi** (theo Martin Fowler).  
Quyết định **càng khó thay đổi, càng tốn nhiều công sức**, thì càng thuộc về **architecture**.
Ngược lại:
- Quyết định **dễ làm, dễ sửa, ít tốn công** → nghiêng về **design**
**Ví dụ**:
- Chuyển từ [[Monolithic]] sang [[Microservices]]** → tốn nhiều effort → **architecture**
- Sắp xếp lại các field trên UI → ít effort → **design**
# The Significance of Trade-Offs
**Mức độ đánh đổi (trade-offs)** của một quyết định giúp xác định nó thuộc **architecture** hay **design**.
- **Trade-off càng lớn, càng nghiêng về architecture**
- **Trade-off nhỏ, ít ảnh hưởng**, thì nghiêng về **design**
**Ví dụ**:
- Chọn **microservices**:
    - Ưu: scalability, agility, elasticity, fault tolerance
    - Nhược: phức tạp, tốn kém, dữ liệu kém nhất quán, hiệu năng không tốt  
        → Trade-off lớn → **architecture**
- Tách một class thành nhiều class:
    - Ưu: dễ bảo trì, dễ đọc
    - Nhược: quản lý nhiều class hơn  
        → Trade-off nhỏ → **design**
# Technical Breadth
- **Developer** cần **technical depth**: hiểu rất sâu về một số công nghệ cụ thể (ngôn ngữ, framework, platform…).
- **Software architect** cần **technical breadth**: biết **rộng**, nắm được nhiều công nghệ và khái niệm khác nhau để nhìn hệ thống ở mức kiến trúc.
**Technical depth** = biết sâu một lĩnh vực  
**Technical breadth** = biết ít nhưng **nhiều lĩnh vực**
![[Pasted image 20251225143927.png]]
**Knowledge pyramid** chia kiến thức kỹ thuật thành 3 nhóm:
1. **Stuff you know**
    - Những công nghệ bạn biết rõ và dùng hằng ngày
    - Bạn giỏi hoặc rất giỏi ở các lĩnh vực này
    - Phần này **nhỏ nhất**, vì không ai có thể giỏi mọi thứ  
        → Đây chính là **technical depth**
2. **Stuff you know you don’t know**
    - Những thứ bạn đã nghe qua, biết sơ nhưng **chưa có kinh nghiệm**
    - Ví dụ: biết Clojure là ngôn ngữ Lisp-based nhưng không viết được
    - Phần này **lớn hơn**, vì ta có thể biết sơ rất nhiều thứ
3. **Stuff you don’t know you don’t know**
    - Những công nghệ/giải pháp **tồn tại nhưng bạn không hề biết đến**
    - Đây là **phần lớn nhất** của kim tự tháp
    - Có thể có giải pháp rất phù hợp cho vấn đề, nhưng bạn không biết nó tồn tại
**Mục tiêu phát triển nghề nghiệp**:
- Đưa kiến thức từ:
    - “không biết là mình không biết” → “biết là mình chưa biết”
    - Khi cần thiết → thành “biết rõ”
Ở giai đoạn đầu sự nghiệp:
- Mở rộng **đỉnh kim tự tháp** (stuff you know) giúp tạo giá trị
- Nhưng kiến thức ở đỉnh cần **duy trì liên tục**, vì công nghệ luôn thay đổi
- Nếu không dùng hoặc cập nhật, expertise sẽ mai một
Khi chuyển từ **developer** sang **architect**, bản chất kiến thức cần có sẽ thay đổi.
- **Giá trị lớn của architect** nằm ở việc có **hiểu biết rộng về công nghệ** và biết **cách áp dụng công nghệ để giải quyết vấn đề**.
- Với architect, **biết có nhiều giải pháp cho một vấn đề** quan trọng hơn là chỉ giỏi sâu một giải pháp duy nhất.
- Trong **knowledge pyramid**, phần quan trọng nhất với architect là:
    - **Top**: những gì biết rõ
    - **Middle**: những gì biết là chưa biết
- **Độ sâu mà phần middle “chạm xuống” phần bottom** thể hiện **technical breadth** của architect.
👉 Architect không cần giỏi hết mọi thứ, nhưng cần **biết nhiều lựa chọn tồn tại** và **khi nào nên dùng cái nào**.
- Vì vậy, architect nên:
    - **Giảm bớt việc duy trì chuyên môn sâu ở mọi lĩnh vực**
    - Dùng thời gian đó để **mở rộng kiến thức sang nhiều công nghệ khác**
- Một số chuyên môn sâu vẫn được giữ lại (thường là lĩnh vực yêu thích), còn những chuyên môn khác sẽ **dần mai một**.
**Knowledge pyramid** cho thấy sự khác biệt căn bản:
- **Developer**: cả sự nghiệp tập trung **mài giũa chuyên môn sâu**
- **Architect**: phải **chuyển tư duy** sang hiểu biết rộng
Việc chuyển vai trò này thường khó và dễ dẫn đến 2 vấn đề:
1. Cố gắng giỏi sâu quá nhiều thứ → **không giỏi thật sự cái nào**
2. **Chuyên môn lỗi thời** nhưng vẫn nghĩ là còn актуal (cutting-edge)
Hiện tượng này hay gặp ở các công ty lớn, nơi người lên vai trò lãnh đạo vẫn ra quyết định dựa trên **tiêu chí công nghệ cũ** (gọi là _Frozen Caveman Antipattern_).
- **Antipattern** là một ý tưởng **ban đầu có vẻ đúng** nhưng về sau **gây rắc rối**.
- **Frozen Caveman antipattern** mô tả những architect bị **ám ảnh bởi một rủi ro trong quá khứ**, nên luôn lặp lại cùng một mối lo không còn phù hợp.
- Ví dụ: dù khả năng xảy ra rất thấp, architect vẫn cứ lo “nếu mất kết nối với Italy thì sao?” vì từng gặp sự cố tương tự trước đó.
Nguyên nhân:
- Bị “đốt” bởi quyết định sai hoặc sự cố bất ngờ trong quá khứ
- Dẫn đến **quá thận trọng** và đánh giá rủi ro **không thực tế**
Bài học:
- Đánh giá rủi ro là cần thiết, nhưng phải **phân biệt rủi ro thật và rủi ro tưởng tượng**
- Tư duy kiến trúc đòi hỏi:
    - Vượt qua các định kiến cũ
    - Nhìn ra **những giải pháp khác**
    - Đặt **đúng câu hỏi**
Để làm được điều này:
- Architect cần **technical breadth** (nhiều lựa chọn hơn để quyết định)
- Developer chuyển sang vai trò architect phải thay đổi cách tiếp cận việc học
- Cân bằng giữa **độ sâu và độ rộng kiến thức** là việc cần suy nghĩ suốt sự nghiệp
# The 20-Minute Rule
 Với **architect**, **technical breadth quan trọng hơn technical depth**, nhưng việc theo kịp công nghệ mới là khó khi còn phải làm việc, lo cuộc sống cá nhân.
- Một cách hiệu quả là **quy tắc 20 phút**:
    - Dành **ít nhất 20 phút mỗi ngày** để học điều mới hoặc đào sâu một chủ đề.
- Có thể dùng 20 phút đó để:
    - Đọc các nguồn như **InfoQ, DZone Refcardz, Thoughtworks Technology Radar**
    - Tra cứu các **buzzword** chưa biết trên internet
    - Đọc sách chuyên môn
- Mục tiêu là:
    - Chuyển kiến thức từ **“không biết là mình không biết”** → **“biết là mình chưa biết”**
    - Từng bước **mở rộng technical breadth**
- Quan trọng nhất là **chủ động dành thời gian mỗi ngày** để phát triển kiến thức và sự nghiệp.
# Developing a Personal Radar
Link: https://www.thoughtworks.com/radar
- Công nghệ có thể **biến mất rất nhanh**, dù từng là nền tảng chính (ví dụ Clipper → DOS → Windows).
- Developer dễ rơi vào **technology bubble**:
    - Quá đầu tư vào một công nghệ
    - Sống trong “echo chamber” nơi ai cũng nghĩ công nghệ đó quan trọng
    - Không thấy đánh giá khách quan từ bên ngoài
    - Khi công nghệ suy tàn thì **không có cảnh báo sớm**
- Bài học rút ra: **phớt lờ sự thay đổi của công nghệ là rất nguy hiểm**.
- Điều còn thiếu là một **technology radar**:
    - Một công cụ/sơ đồ “sống”
    - Giúp đánh giá **rủi ro và lợi ích** của các công nghệ hiện tại và mới nổi
## The Thoughtworks Technology Radar
Link: https://www.thoughtworks.com/radar
Nói chung cái web trên và 1 radar. Radar này tạo ra hiệu ứng lan tỏa:
- Nhiều người trong cộng đồng công nghệ đánh giá cao
- Nhiều công ty bắt đầu xây dựng **Radar riêng**
👉 Những người nói chuyện tại hội thảo đều có **một “technology radar” nội bộ** để định hướng việc học và lựa chọn công nghệ.
Còn nó như thế nào tự vào trang để trải nghiệm nhé

👉 Đừng chọn công nghệ một cách ngẫu hứng.  
Hãy coi kỹ năng công nghệ như một danh mục đầu tư (portfolio).
# Analyzing Trade-Offs
Tư duy như một kiến trúc sư là khả năng **nhận ra trade-off trong mọi giải pháp**, dù là kỹ thuật hay không kỹ thuật, và **phân tích các trade-off đó** để chọn ra giải pháp phù hợp nhất.
Đây là một trong những hoạt động quan trọng nhất của kiến trúc sư, được thể hiện qua câu nói của Mark Richards:
> **Architecture là những thứ bạn không thể Google hoặc hỏi LLM.**

Trong kiến trúc, **mọi thứ đều là trade-off**, vì vậy câu trả lời quen thuộc cho mọi câu hỏi kiến trúc là:
> **“It depends” (Còn tùy).**

Dù câu trả lời này gây khó chịu, nhưng nó là sự thật.  
Bạn không thể Google hay hỏi AI xem:
- REST hay messaging tốt hơn cho hệ thống?
- [[Microservices]] có phải kiến trúc phù hợp cho sản phẩm mới không?
👉 **Architecture = quyết định phụ thuộc bối cảnh (context)**, bao gồm:
- Môi trường triển khai
- Mục tiêu kinh doanh
- Văn hóa công ty
- Ngân sách
- Thời gian
- Kỹ năng của đội ngũ
- Và nhiều yếu tố khác
Mỗi hệ thống và mỗi tổ chức đều khác nhau, đó là lý do kiến trúc trở nên khó.
Neal Ford kết luận:
       **Trong kiến trúc không có đúng hay sai — chỉ có trade-off.**

## Phân tích trade-off: Queue vs Topic
Trong hệ thống đấu giá, để xử lý **bất đồng bộ (asynchronous)**, kiến trúc sư có thể chọn:
- **Queue** (point-to-point messaging)
- **Topic** (publish–subscribe messaging)
Không thể Google câu trả lời cho việc nên chọn cái nào. Kiến trúc yêu cầu phải **phân tích trade-off** của từng phương án và chọn giải pháp **phù hợp nhất với bối cảnh cụ thể**.
# Understanding Business Drivers
**Thinking like an architect** còn bao gồm:
    - Hiểu rõ **business drivers** quyết định sự thành công của hệ thống
    - Chuyển các yêu cầu kinh doanh thành **architectural characteristics**
        - Ví dụ: scalability, performance, availability
- Đây là nhiệm vụ **khó** vì:
    - Kiến trúc sư cần hiểu **domain business**
    - Cần mối quan hệ hợp tác tốt với **business stakeholders**
- Chủ đề này được trình bày xuyên suốt 4 chương:
    - **Chapter 4**: Định nghĩa các architectural characteristics
    - **Chapter 5**: Cách xác định và đánh giá các characteristics
    - **Chapter 6**: Cách đo lường từng characteristic để đảm bảo đáp ứng nhu cầu business
    - **Chapter 7**: Phạm vi của characteristics và mối liên hệ với coupling
👉 **Kiến trúc không bắt đầu từ công nghệ, mà bắt đầu từ business.**
Business nói:
- “Hệ thống phải chịu tải lớn”
- “Không được downtime”
- “Phải ra tính năng nhanh”
SA phải dịch những câu đó thành:
- Scalability
- Availability
- Deployability
- Performance
- Coupling level
Nếu SA **không hiểu business**:
- Sẽ chọn sai ưu tiên
- Tối ưu nhầm chỗ
- Kiến trúc đẹp nhưng… vô dụng
📌 **Architect = người phiên dịch giữa business và công nghệ**
# Balancing Architecture and HandsOn Coding
### Cân bằng giữa coding và vai trò Software Architect
- Architect **nên code** và duy trì **một mức technical depth nhất định**
- Tuy nhiên, việc cân bằng giữa:    
    - Hands-on coding
    - Công việc kiến trúc (thiết kế, họp, ra quyết định)  
        → **khá khó**
### Bottleneck Trap (Antipattern)
- **Bottleneck Trap** xảy ra khi:
    - Architect **nắm giữ code ở critical path** của hệ thống
        - Framework cốt lõi
        - Phần code phức tạp
    - Architect không phải dev full-time → trở thành **điểm nghẽn của team*
Nguyên nhân:
- Architect phải chia thời gian cho:
    - Viết & test code
    - Vẽ diagram
    - Họp (rất nhiều họp)
### Cách tránh Bottleneck Trap
- Architect nên:
    - **Giao critical path & framework code cho team**
    - Tự mình code **một phần business nhỏ**
        - Ví dụ: một service, một UI screen
        - Thường ở **1–3 iteration sau**
### 3 lợi ích của cách làm này
1. Architect vẫn có **hands-on production code**
    - Nhưng không trở thành bottleneck
2. Team:
    - Sở hữu code quan trọng
    - Hiểu rõ phần khó của hệ thống
3. Architect:
    - Code cùng loại business logic như dev
    - Hiểu rõ pain point của team:
        - Process
        - Tooling
        - Environment
    - Từ đó cải thiện hệ thống & quy trình