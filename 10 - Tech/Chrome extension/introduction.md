## 1️⃣ Chrome Extension là gì? (nói ngắn gọn)
Chrome Extension là một **ứng dụng nhỏ chạy trong trình duyệt Chrome**, có thể:
- Thêm nút vào thanh công cụ
- Can thiệp vào trang web (đổi UI, đọc nội dung, chặn quảng cáo…)
- Tự động hoá thao tác

👉 Extension **không chạy như web bình thường**, mà chạy theo cơ chế riêng của Chrome.
## 2️⃣ Cấu trúc thư mục cơ bản (BẮT BUỘC PHẢI CÓ)
Ví dụ 1 extension đơn giản:
```
my-first-extension/
│
├── manifest.json      ⭐ (bắt buộc)
├── popup.html         (giao diện khi bấm icon)
├── popup.js
├── popup.css
│
├── background.js      (xử lý logic nền)
│
├── content.js         (can thiệp vào trang web)
│
└── icons/
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```
👉 **`manifest.json` là trái tim của extension**  
Không có file này = Chrome không nhận extension.
## 3️⃣ File quan trọng nhất: `manifest.json`
Chrome hiện dùng **Manifest V3**, nên bạn học luôn bản mới nhất nhé 👍
### 📌 Ví dụ `manifest.json` cơ bản
```json
{
  "manifest_version": 3,
  "name": "My First Extension",
  "version": "1.0",
  "description": "Extension đầu tiên của tôi",

  "action": {
    "default_popup": "popup.html",
    "default_icon": {
      "16": "icons/icon16.png",
      "48": "icons/icon48.png",
      "128": "icons/icon128.png"
    }
  },

  "background": {
    "service_worker": "background.js"
  },

  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["content.js"]
    }
  ],

  "permissions": ["tabs"]
}
```
→ Xử lý:
- Lắng nghe sự kiện
- Giao tiếp popup ↔ content
- Chạy ngầm (không có UI)
⚠️ Manifest V3 dùng **service worker**, không chạy liên tục.
