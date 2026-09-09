---
tags: [project, cr7, architecture, firebase]
created: 2026-09-08
---

# 04 - Kiến trúc kỹ thuật

## Stack đề xuất

Gần giống stack mình đã quen (JS thuần + Firebase + GCP), nên không phải học gì mới:

| Lớp | Chọn | Vì sao |
|---|---|---|
| Frontend | React (Vite) hoặc Astro | Astro tốt hơn cho SEO vì render tĩnh sẵn 978 trang |
| Hosting | Cloudflare Pages / Vercel / Netlify | Đều free tier đủ dùng |
| DB | Firestore | Đã quen, free tier rộng, đọc nhiều ghi ít = đúng pattern |
| Cron | Cloud Run Job hoặc Cloud Scheduler + Function | Chạy 6h/lần, gần như free |
| Ảnh/asset | Cloudflare R2 hoặc Firebase Storage | Chỉ ảnh tĩnh, nhẹ |
| Analytics | GA4 + Cloudflare Web Analytics | |

Đúng bộ mà messiallgoals đang dùng (đọc CSP của họ): Firestore, Firebase Auth, Firebase Storage, FCM, GA4, Cloudflare. Tức là mô hình này đã được kiểm chứng ở đúng loại site này.

## Astro hay React SPA?

Đây là quyết định quan trọng nhất về mặt kỹ thuật, vì SEO là kênh traffic chính.

- **SPA (như messiallgoals)**: Google có render JS, nhưng chậm và không đảm bảo. 978 trang chi tiết mà render client thì rủi ro index kém.
- **Astro / SSG**: build ra 978 file HTML tĩnh, mỗi trang có sẵn nội dung. Google index ngay. Phần cần động (counter live) thì hydrate riêng bằng island.

→ **Chọn Astro.** Build lại khi có bàn mới (webhook từ cron trigger rebuild). Mỗi bàn = 1 trang tĩnh = 978 cửa vào từ Google.

## Sơ đồ

```
                 ┌──────────────────┐
   API-Football  │  Cron (6h/lần)   │
   YouTube API ──►  Cloud Run Job   │
                 └────────┬─────────┘
                          │ ghi nếu có bàn mới
                          ▼
                   ┌─────────────┐
                   │  Firestore  │  (nguồn sự thật)
                   └──────┬──────┘
                          │ trigger build
                          ▼
                 ┌──────────────────┐
                 │  Astro build     │ → 978 trang tĩnh
                 └────────┬─────────┘
                          ▼
                 ┌──────────────────┐
                 │ Cloudflare Pages │ ← khách truy cập
                 └──────────────────┘
                     + island đọc Firestore cho counter live
```

## Cấu trúc URL (quan trọng cho SEO)

```
/                             trang chủ + counter
/goals                        danh sách toàn bộ, có filter
/goal/978                     chi tiết 1 bàn        ← 978 trang long-tail
/club/real-madrid             gom theo CLB
/season/2017-18               gom theo mùa
/opponent/juventus            gom theo đối thủ      ← nhiều search
/stats/free-kicks             các trang thống kê chuyên đề
/vs-messi                     so sánh — từ khoá cực nhiều search
/methodology                  giải thích cách đếm
/copyright                    chính sách bản quyền
```

## Chi phí ước tính (tháng)

| Khoản | Chi phí |
|---|---|
| Domain | ~$12/năm |
| Hosting (Cloudflare Pages) | $0 |
| Firestore | $0 (trong free tier, vì đọc chủ yếu từ HTML tĩnh) |
| API-Football | $0 gói free (4 request/ngày là đủ) |
| YouTube Data API | $0 |
| Cloud Run cron | ~$0 |
| **Tổng** | **~$1/tháng** |

Chi phí gần bằng 0 chính là vì **không host video**. Nếu self-host clip thì riêng bandwidth đã vài chục đô/tháng khi có traffic — thêm một lý do nữa để theo hướng ở [[03 - Nguồn video & bản quyền]].

## Hiệu năng

- Trang chi tiết bàn thắng: HTML tĩnh, không JS chặn render → LCP nên < 1s
- YouTube embed: dùng **facade** (ảnh thumbnail + nút play, chỉ load iframe khi bấm). Iframe YouTube nặng ~1MB, nếu load sẵn thì phá nát điểm Lighthouse.
- Ảnh: AVIF/WebP + `loading="lazy"`
- Data viz: SVG tĩnh render lúc build, không dùng thư viện chart nặng ở client. Xem [[dataviz]].
