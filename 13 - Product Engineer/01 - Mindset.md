# 🧠 Mindset của Product Engineer

> Khác biệt lớn nhất giữa **dev thuần** và **product engineer** nằm ở *câu hỏi mặc định trong đầu*.

## Developer thuần vs Product Engineer

| Developer thuần hỏi | Product Engineer hỏi |
|---|---|
| "Làm cái này thế nào?" | "Có nên làm cái này không? Tại sao?" |
| "Requirement đâu?" | "Vấn đề thật sự là gì?" |
| "Spec ghi vậy thì làm vậy" | "Spec này có giải quyết đúng vấn đề không?" |
| "Code chạy là xong" | "User có thực sự dùng và đạt mục tiêu không?" |

## 6 nguyên tắc cần khắc sâu

### 1. Tách Problem khỏi Solution
Yêu cầu "thêm nút export Excel" đã là **solution**. Hãy đào ngược lên **problem**:
*"User cần lấy data ra để làm gì?"* — có khi giải pháp đúng là dashboard, không phải Excel.

### 2. Outcome > Output
- **Output:** "đã ship 5 features"
- **Outcome:** "tỷ lệ user hoàn thành onboarding tăng 20%"
> Feature không ai dùng là **nợ (liability)**, không phải tài sản.

### 3. Mọi feature đều có chi phí ẩn
Không chỉ chi phí code, mà còn: bảo trì, UI phức tạp hơn, tăng tải support, tăng bug surface.
> Câu hỏi mạnh nhất: **"Điều gì xảy ra nếu ta KHÔNG làm cái này?"**

### 4. Tư duy "Jobs To Be Done" (JTBD)
User không mua cái khoan, họ mua *"cái lỗ trên tường"*.
Hỏi: user đang **"thuê" feature này để làm công việc gì** trong đời họ? → xem [[06 - Frameworks]]

### 5. MVP = bài học rẻ nhất, không phải sản phẩm tệ nhất
Mục tiêu MVP không phải "làm ít cho nhanh" mà là
**kiểm chứng giả định rủi ro nhất với chi phí thấp nhất**.

### 6. Lợi thế của bạn: gần code nhất
Bạn thấy điều PO không thấy:
*"Case này backend đã có sẵn data, làm thêm chỉ 2 giờ"* hoặc *"Cái này sẽ phá vỡ data model"*.
> Product Engineer **negotiate scope dựa trên hiểu biết kỹ thuật**.

## 🤖 Trong kỷ nguyên AI

AI viết code rẻ đi → giá trị của bạn dịch chuyển **lên trên**: *judgment, taste, hiểu vấn đề*.
> Người thắng không phải người gõ nhanh nhất, mà người biết **hỏi đúng câu hỏi** và biết **khi nào nên dừng**.

Liên quan: [[02 - Checklist phân tích Feature]] · [[06 - Frameworks]]
