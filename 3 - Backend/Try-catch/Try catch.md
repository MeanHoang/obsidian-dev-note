
## Try-catch nên đặt ở **Handler/Controller layer**
**Handler/Controller** là nơi duy nhất cần try-catch vì nó là điểm cuối trả response cho client:
```js
// handlers/someHandler.js
const doSomething = async ctx => {
  try {
    const result = await someService.doSomething(ctx.req.body);
    return ctx.res.json({ success: true, data: result });
  } catch (error) {
    return ctx.res.json({ success: false, error: error.message });
  }
};
```

**Service** và **Repository** — **không cần try-catch**, cứ để error bubble up:
```js
// services/someService.js
const doSomething = async (data) => {
  const shop = await shopRepository.getById(data.shopId); // throw tự nhiên
  if (!shop) throw new Error('Shop not found');            // throw chủ động
  return await someRepository.create(data);                // throw tự nhiên
};
```

## Ngoại lệ
Chỉ try-catch ở Service/Repository khi:
1. **Fire-and-forget** — lỗi không nên block flow chính (ví dụ log activity, trigger popup):
```js
logActivity(data).catch(e => console.error('Log failed', e));
```
2. **Cần fallback/recovery** — lỗi có thể xử lý được thay vì crash:
```js
let cached;
try { cached = await redis.get(key); } catch { cached = null; }
```
2. **External API** cần retry hoặc custom error message:
```js
try {
  await shopifyApi.call();
} catch (error) {
  throw new Error(`Shopify sync failed: ${error.message}`);
}
```

## Tóm lại

|Layer|Try-catch?|Lý do|
|---|---|---|
|**Handler**|Luôn luôn|Điểm cuối, format response|
|**Service**|Chỉ khi cần|Fire-and-forget, fallback, wrap error|
|**Repository**|Hầu như không|Để lỗi bubble up|

Nguyên tắc: **catch ở nơi bạn biết phải làm gì với error đó**. Không biết xử lý gì thì đừng catch — để nó bubble lên handler.

---

## Tổng kết

|Architecture|Catch chính ở đâu|Đặc thù|
|---|---|---|
|**Layered / Modular**|Controller/Handler|Đơn giản, error bubble up|
|**DDD**|Controller + custom domain errors|Domain throw typed errors, controller map|
|**Hexagonal**|Adapter IN + Adapter OUT wrap errors|Boundary layers catch, domain thuần|

Bất kể architecture nào: **đừng catch nếu không biết xử lý gì** — để nó bubble lên layer có trách nhiệm xử lý.