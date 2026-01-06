Chương 1 **không dạy nguyên lý**
Mà sẽ:
- đưa ra **một ví dụ refactoring cụ thể**
- cho bạn **cảm nhận được quá trình refactor**
- hiểu **refactoring diễn ra từng bước như thế nào**
📌 Còn phần:
- định nghĩa
- nguyên tắc
- lý thuyết bài bản
→ sẽ để sang **chương sau**
# The Staring Point 
Tác giả đưa giả ví dụ về hoá đơn thanh toán tiền cho 1 đoàn kịch 
### Data
plays.json
```js
{
  "hamlet": { "name": "Hamlet", "type": "tragedy" },
  "as-like": { "name": "As You Like It", "type": "comedy" },
  "othello": { "name": "Othello", "type": "tragedy" }
}
```
invoices.json
```js
{
  "customer": "BigCo",
  "performances": [
    { "playID": "hamlet", "audience": 55 },
    { "playID": "as-like", "audience": 35 },
    { "playID": "othello", "audience": 40 }
  ]
}
```
Hàm tính tiền 
```js
function statement(invoice, plays) {
  let totalAmount = 0;
  let volumeCredits = 0;
  let result = `Statement for ${invoice.customer}\n`;

  const format = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2
  }).format;

  for (let perf of invoice.performances) {
    const play = plays[perf.playID];
    let thisAmount = 0;

    switch (play.type) {
      case "tragedy":
        thisAmount = 40000;
        if (perf.audience > 30) {
          thisAmount += 1000 * (perf.audience - 30);
        }
        break;

      case "comedy":
        thisAmount = 30000;
        if (perf.audience > 20) {
          thisAmount += 10000 + 500 * (perf.audience - 20);
        }
        thisAmount += 300 * perf.audience;
        break;

      default:
        throw new Error(`unknown type: ${play.type}`);
    }
    // add volume credits
    volumeCredits += Math.max(perf.audience - 30, 0);
    // add extra credit for every five comedy attendees
    if (play.type === "comedy") {
      volumeCredits += Math.floor(perf.audience / 5);
    }
    // print line for this order
    result += ` ${play.name}: ${format(thisAmount / 100)} (${perf.audience} seats)\n`;
    totalAmount += thisAmount;
  }
  result += `Amount owed is ${format(totalAmount / 100)}\n`;
  result += `You earned ${volumeCredits} credits\n`;

  return result;
}
```
Martin Fowler **cố tình** đưa ra code này để bạn thấy:
### ❌ Code có nhiều vấn đề thiết kế
- Hàm `statement` làm **quá nhiều việc**
- Logic tính tiền:
    - gắn chặt với `switch`
    - khó mở rộng nếu thêm loại kịch mới
- Logic tính điểm:
    - trộn lẫn với logic in hóa đơn
- Khó:
    - đọc
    - sửa
    - test
    - tái sử dụng
👉 **Đây là code “chạy được nhưng không sạch”**
=> Tóm lại tác giả bảo việc refactor là cần thiết 
# COMMENTS ON THE STARTING PROGRAM
Ví dụ buộc phải nhỏ, nhưng hệ thống thật thì không nhỏ như vậy.

