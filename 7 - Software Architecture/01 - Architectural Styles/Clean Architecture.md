---
name: Clean Architecture
description: Stub - cần fill
---

# Clean Architecture

> [!warning] ⚠️ Stub note — chưa có content chi tiết

## 🎯 Ý tưởng cốt lõi (1 dòng)

Tách code thành **layers** với **dependency rule**: dependency chỉ chảy **từ ngoài vào trong**, không ngược lại.

## 📐 Circles (Uncle Bob)

```
┌────────────────────────────────────────┐
│  Frameworks & Drivers (UI, DB, Web)    │
│  ┌──────────────────────────────────┐  │
│  │  Interface Adapters              │  │
│  │  (Controllers, Gateways, ...)    │  │
│  │  ┌────────────────────────────┐  │  │
│  │  │  Use Cases (Application)   │  │  │
│  │  │  ┌──────────────────────┐  │  │  │
│  │  │  │  Entities (Domain)   │  │  │  │
│  │  │  └──────────────────────┘  │  │  │
│  │  └────────────────────────────┘  │  │
│  └──────────────────────────────────┘  │
└────────────────────────────────────────┘
```

## 🔗 Related

- [[Hexagonal]] — cùng họ với Clean Architecture
- [[SOLID]] — nguyên tắc nền tảng
- [[DDD]] — thường đi kèm

## ✍️ TODO

- [ ] Viết section chi tiết từng layer
- [ ] Thêm code example JS/Firebase
- [ ] So sánh Clean vs Hexagonal vs Onion
- [ ] Apply cho Joy Loyalty (use case layer)
