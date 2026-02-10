**ervice Worker** là một **script chạy nền trong trình duyệt** (background), tách biệt khỏi trang web, giúp web app **nhanh hơn, hoạt động offline và giống app mobile hơn** 🚀

Nói ngắn gọn:  
👉 _Service Worker đứng giữa web của bạn và network_, nó **chặn request**, **cache dữ liệu**, và **quyết định lấy data từ đâu**.

---

## Service Worker làm được gì?

### 1️⃣ Cache & chạy **offline**

- Lần đầu vào web → cache HTML, CSS, JS, ảnh
    
- Mất mạng → vẫn mở web bình thường (offline mode)
    

👉 Rất hay cho:

- PWA (Progressive Web App)
    
- Blog, trang tin, landing page
    

---

### 2️⃣ Tăng tốc web

- Không cần gọi server mỗi lần
    
- Lấy file từ cache → load **cực nhanh**
    

---

### 3️⃣ Push Notification 🔔

- Gửi thông báo dù user **không mở web**
    
- Giống notification của app mobile
    

---

### 4️⃣ Background Sync

- Mạng yếu → lưu request
    
- Có mạng lại → tự gửi request lên server
    

---

## Service Worker **KHÔNG** làm được

❌ Không truy cập DOM  
❌ Không dùng `window`, `document`  
❌ Chỉ chạy trên **HTTPS** (trừ `localhost`)

---
## Vòng đời của Service Worker
```
Register → Install → Activate → Fetch
```
- **Register**: đăng ký SW
    
- **Install**: cache file
    
- **Activate**: xóa cache cũ
    
- **Fetch**: intercept request
    

---
## Service Worker dùng ở đâu?

- PWA
    
- Web offline
    
- App React / Vue / Angular
    
- Website thương mại điện tử (cache trang)
    

---

## So sánh nhanh

|Thứ|Mục đích|
|---|---|
|LocalStorage|Lưu data nhỏ|
|Cache API|Lưu request/response|