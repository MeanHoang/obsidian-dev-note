# 1. Binary Search là gì?
**Binary Search (Tìm kiếm nhị phân)** là một thuật toán tìm kiếm dùng để **tìm vị trí của một phần tử trong một tập dữ liệu đã được sắp xếp** bằng cách **chia đôi không gian tìm kiếm sau mỗi bước**.
👉 Ý tưởng cốt lõi:
> _Thay vì tìm từng phần tử một (linear search), ta liên tục chia đôi mảng để loại bỏ 1/2 số phần tử không cần thiết._

# 2. Điều kiện áp dụng

⚠️ **BẮT BUỘC**:
- Dữ liệu phải **được sắp xếp** (tăng dần hoặc giảm dần)
- Có thể truy cập phần tử theo **chỉ số** (array, vector)

❌ Không phù hợp với:
- Mảng **chưa sắp xếp**
- Cấu trúc dữ liệu không truy cập ngẫu nhiên (ví dụ: linked list)
# 3. Ý tưởng hoạt động (Tư duy thuật toán)

Giả sử:
- Ta có mảng `A` đã sắp xếp
- Cần tìm giá trị `x`
Các bước:
1. Xác định:
    - `left` = vị trí đầu
    - `right` = vị trí cuối
2. Tính:
    - `mid = (left + right) / 2`
3. So sánh:
    - Nếu `A[mid] == x` → tìm thấy
    - Nếu `A[mid] < x` → tìm bên **phải**
    - Nếu `A[mid] > x` → tìm bên **trái**
4. Lặp lại cho đến khi:
    - `left > right` → không tồn tại
📌 **Mỗi lần so sánh → loại bỏ được 1/2 dữ liệu**
