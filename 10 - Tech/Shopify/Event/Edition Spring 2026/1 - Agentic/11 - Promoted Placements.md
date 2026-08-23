# Promoted Placements (Sponsored Products)

Developer có thể kiếm commission từ sales thông qua **paid placements** (sponsored products) blend vào Global Catalog search results.

---

## Cách hoạt động

1. Agent gửi `placements: ["affiliate"]` trong `search_catalog` request
2. Response trả về mix organic + sponsored variants
3. Sponsored variant có thêm `placement` object; organic variant không có
4. Agent direct buyer qua **attributed URL** (giữ nguyên params)
5. Agent earn commission trên qualifying purchases

---

## Integration

### Request

Thêm `placements` param vào `search_catalog`:

```json
{
  "params": {
    "name": "search_catalog",
    "arguments": {
      "catalog": {
        "query": "running shoes",
        "placements": ["affiliate"]
      }
    }
  }
}
```

### Response

Sponsored variant chứa `placement` object:

```json
{
  "placement": {
    "type": "affiliate",
    "commission": {
      "percentage": { "value": 5 }
    }
  }
}
```

- `type`: luôn là `"affiliate"`
- `commission.percentage.value`: % commission thêm từ merchant

---

## Commission Model

| Metric | Chi tiết |
|---|---|
| Base rate | **0.3%** (30 bps) trên attributed purchases |
| Scope | Commission áp dụng cho **tất cả** Global Catalog items trong attributed order, không chỉ sản phẩm clicked |
| Attribution window | **7 ngày**, last-click methodology |
| Additional commission | Merchant có thể offer thêm %, hiển thị trong response |

---

## URL Attribution

Promoted placement URL chứa:
- `shdid` — developer identifier
- `utm_source=shopify`
- `utm_medium=catalog`
- `shclid` — click tracking

> Commission chỉ được credited khi agent gửi buyer qua variant URL **đúng như provided**, giữ nguyên attribution parameters.

---

## Payout

- Qua **Shopify Partner payout** infrastructure (Hyperwallet)
- Monthly schedule
- Minimum threshold — balance dưới threshold roll over sang tháng sau

---

## Disclosure

- **Bắt buộc** nói với user rằng agent có thể earn commission
- Label rõ ràng sponsored placements
- Không giấu ở footer
- Tuân thủ FTC material-connection + EU/UK advertising-transparency regulations

---

## Yêu cầu tham gia

- Đã integrate Global Catalog
- Có access Dev Dashboard
- Enroll qua **invite-led waitlist** + chấp nhận program agreement

---

## Docs gốc

- Promoted Placements: https://shopify.dev/docs/agents/catalog/promoted-placement
