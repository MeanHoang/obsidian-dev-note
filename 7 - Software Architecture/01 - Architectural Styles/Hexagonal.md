## Hexagonal Architecture (Ports & Adapters)
Ý tưởng cốt lõi: **Domain logic ở trung tâm, không phụ thuộc vào bất kỳ thứ gì bên ngoài** (DB, API, framework, UI). Mọi thứ bên ngoài giao tiếp với domain qua **Port** (interface) và **Adapter** (implementation).

---