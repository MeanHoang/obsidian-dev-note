Tác giả bảo cơm mừn là sự thất bại của bạn trong việc thể hiện ý định của mình bằng code. Là giải pháp cuối cũng của mình để bù đắp cho thất bại đó 
# Comments Do Not Make Up for Bad Code 
Tóm lại trước khi comment hãy suy nghỉ sao lại cần comment có thể cải thiện code thêm hơn nữa không 
Đừng 
“Code này hơi tệ nhỉ… thôi để lại cái comment cho đỡ tội lỗi.”
⚠️ **Và đó là sai lầm.**
Nếu code khiến bạn muốn viết comment để giải thích → đó là dấu hiệu cần refactor.
Refactor những gì?
- Đặt lại tên biến
- Viết function nhỏ hơn
- Tách logic phức tạp
- Giảm số lượng if/else
- Đưa magic number → hằng số
- Tách module cho đúng trách nhiệm
Hãy coi comment như:
- Cây nạng khi bị gãy chân
- Không dùng trừ khi BẮT BUỘC
# Explain Yourself in Code 
Tác giả nói rằng:
- Có lúc code _thật sự_ không thể diễn đạt ý định → lúc đó mới cần comment.
- Nhưng nhiều lập trình viên hiểu sai → nghĩ rằng “code thì không bao giờ diễn đạt đủ, nên phải dùng comment.”
→ **Sai hoàn toàn.**
Code, nếu viết đúng cách, **luôn là phương tiện giải thích tốt nhất**, vì nó:
- không lỗi thời
- không sai lệch
- luôn đúng với chương trình thực tế
- được compiler kiểm tra
- không gây hiểu lầm
# Good Comments 
- **Comment _đôi khi_ là cần thiết**, ví dụ:
    - tài liệu cảnh báo
    - mô tả quyết định kỹ thuật khó
    - TODO
    - giải thích workaround cho bug của thư viện
    - mô tả APIs công khai
- Nhưng **comment không bao giờ là tối ưu**.
**“The only truly good comment is the comment you found a way _not_ to write.”**  
→ Nghĩa là: **Comment tốt nhất là cái mà bạn refactor code để không cần comment nữa.**
# Legal Comments
Trong nhiều công ty, **coding standards bắt buộc** phải có comment pháp lý ở đầu file để:
- Gắn copyright
- Gắn license
- Ghi tên tổ chức/owner của source code
- Đảm bảo tính tuân thủ pháp luật
➡️ Đây là loại comment **business bắt buộc**, không liên quan đến chất lượng code.
# Informative Comments 
🧩 Tác giả nói rằng **đôi khi comment có ích**, nhưng **nếu có thể biểu đạt bằng tên hàm hoặc cấu trúc code thì luôn tốt hơn comment**.
✔ Comment **chỉ là lựa chọn cuối cùng**, khi code không thể tự diễn đạt.  
✔ Tên hàm, tên biến, cấu trúc code nên nói lên ý nghĩa → hạn chế comment.  
✔ Nếu comment cần quá nhiều để giải thích logic → đó là tín hiệu code nên được tách ra hoặc refactor.  
✔ Regex, thuật toán phức tạp → comment **có thể chấp nhận**, nhưng nếu có class/hàm mô tả rõ thì càng tốt.
# Explanation of Intent 
Đoạn Clean Code này nói về **những comment hiếm hoi được xem là "tốt"**, vì chúng ghi lại **ý định (intent)** hoặc **lý do** đằng sau một quyết định thiết kế — những thứ không thể dễ dàng diễn đạt bằng code.
Đây là loại comment mà tác giả chấp nhận, vì:
- Code có thể diễn tả “làm gì”
- Nhưng rất khó diễn tả “tại sao làm thế” (why)
# Clarification 
Nói chung cũng là như trên ko có gì db lắm 
# Warning of Consequeces 
Có những comment không chỉ mô tả code, **mà cảnh báo lập trình viên khác về rủi ro hoặc hậu quả nếu sửa code không đúng cách**. Những comment dạng này cực kỳ hữu ích, vì chúng truyền tải thông tin _mà bản thân code không thể nói lên được_.
# TODO Comments
Cũng cơ bản thêm 1 loại comment cần có 
`// TODO` là ghi chú **nhắc nhở về việc cần làm sau**, ví dụ:
```js
// TODO: refactor function name
// TODO: remove deprecated method after release v2
// TODO: optimize this loop later
```
# Amplification 
Đôi khi một dòng code trông rất bình thường, rất nhỏ, nhưng **lại cực kỳ quan trọng** cho logic.
```js
const cleaned = input.trim();
// trim is VERY important!
// Without it, the parser will think this is a nested item.
return parseListItem(cleaned);
```
## 💡 Giải thích
`trim()` trông rất bình thường — chỉ là xóa khoảng trắng.
Nhưng ở đây, **nếu không trim**, thì:
- dấu cách đầu dòng sẽ làm hệ thống hiểu sai
- và coi dòng này như là **một list mới** thay vì item của list hiện tại.
Tức là: **không trim → cấu trúc list bị sai hoàn toàn.**
### → Vì vậy comment giúp _ngăn người sau hiểu nhầm và xóa nhầm_.
# Bad Comments
Hầu hết comments trong code đều chỉ là cái chống tạm, ngụy biện cho code tệ hoặc quyết định nửa vời của lập trình viên — chỉ là lập trình viên tự nói chuyện với chính mình.
# Mumbling
Nếu viết comment mà không suy nghĩ nghiêm túc, comment đó gần như vô dụng — thậm chí gây hại.
Cách duy nhất là kiểm tra code của hệ thống để tìm hiểu những gì xảy ra. Bất kỳ comment nào khiến bạn phải lục tung code của hệ thống lên để tìm hiểu thì comment đó không truyền tải tốt thông tin cho bạn, và nó không xứng đáng với số bit nó chiếm trong mã nguồn.
# Redundant Comments 
#### ❌ Đừng viết comment để mô tả lại code
→ Code luôn chính xác hơn comment
#### ❌ Đừng viết comment do quy trình bắt buộc
→ Sinh ra rác, không ai đọc.
#### ❌ Comment thừa = nguy hiểm hơn không comment
→ Làm người đọc tin vào mô tả sai.
#### ❌ Javadoc mô tả biến hay mô tả function rỗng → vô dụng
→ Vì tên biến và tên hàm đã nói hết rồi.
### ✔ Comment chỉ có ích khi:
- giải thích **tại sao** làm vậy, không phải **làm gì**
- giải thích quyết định thiết kế
- cảnh báo điều nguy hiểm
- mô tả _business rule_, không phải logic code
# Misleading Comments
Tác giả nói rằng **comment sai hoặc không đủ chính xác còn nguy hiểm hơn cả không có comment**. Đọc nghe thật vô nghĩa 
# Mandated Comments
Cũng ko có gì db 
# Journal Comments 
Kiểu ghi chứ ngày giờ này git đã làm tốt nên không cần thiết 
# Noise Comments
Cx ko có gì db 
# Scary Noise
Cx ko có gì db 
# Dont Use a Comment When You Can Use a Function or a Variable 
Cx ko có gì db 
# Position Market
Cx ko có gì db 
# Closing Brace Comments
Một số lập trình viên thích thêm comment vào dấu `}`:
```js
if (condition) {
    ...
} // end if
```
### ❌ Vấn đề:
- Với **hàm dài**, **cấu trúc lồng nhau nhiều**, họ làm thế để đỡ lạc dấu `}`.
- Nhưng **Clean Code không khuyến khích hàm dài và lồng nhiều**.
- Với hàm ngắn và rõ ràng thì các comment kiểu này chỉ tạo **rác**, **noise**, không có giá trị.
### ✔️ Nếu bạn thấy cần comment cho dấu `}` → nghĩa là:
- Hàm quá dài
- Nesting quá sâu
- Bạn nên **refactor** để đơn giản hóa
# ⭐ Kết luận Clean Code
✔️ Nếu bạn cần ghi chú ở `}` → nghĩa là hàm **quá dài**  
✔️ Thay vì comment, hãy **refactor**  
✔️ Comment kiểu đó = **noise**

