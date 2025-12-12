## Strategy dựa trên dữ liệu runtime (context phức tạp)
Ví dụ:
- region
- permission
- experiment group
- tier + addon
### ✅ DÙNG RULE ENGINE NHẸ
```js
const pricingRules = [
  {
    match: user => user.isTrial,
    strategy: trialPricing
  },
  {
    match: user => user.type === 'PRO',
    strategy: proPricing
  }
];
```
```js
function resolvePricingStrategy(user) {
  return pricingRules.find(rule => rule.match(user))?.strategy
    ?? freePricing;
}
```
✅ thêm rule **không sửa code cũ**  
✅ rất sạch