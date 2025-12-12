### 1. **Throwing Exceptions (`throw`)**
- Khi gặp lỗi hoặc tình huống không bình thường, bạn **“ném” (throw)** một exception.
- Việc này sẽ **ngưng chạy code hiện tại** và chuyển quyền xử lý đến **catch** gần nhất (hoặc nếu không có, trình duyệt/node sẽ báo lỗi).
- Cú pháp:
```js
function divide(a, b) {
    if (b === 0) {
        throw new Error("Cannot divide by zero"); // ném exception
    }
    return a / b;
}

```
- Ở đây `Error` là một đối tượng exception tiêu chuẩn, bạn cũng có thể ném **string, số, hoặc object**, nhưng tốt nhất là dùng `Error` hoặc class kế thừa từ `Error`.
Tóm lại ném lỗi lên trên để caller trên bắt đc ấy 
### 2. **Catching Exceptions (`try...catch`)**
- Để **bắt và xử lý lỗi** mà không làm crash chương trình, ta dùng `try...catch`.
- **`try`** chứa code có khả năng gây lỗi.
- **`catch`** nhận exception và xử lý
