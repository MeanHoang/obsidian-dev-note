# Road to TOEIC 900 — Thiết kế dữ liệu

> Chốt cấu trúc file JSON làm "database" của app. Sửa sai chỗ này một lần là phải sửa lại mọi buổi học về sau, nên chốt kỹ trước khi đổ dữ liệu.
>
> Liên quan: [[00 - Hướng đi ứng dụng]] · [[01 - Yêu cầu tính năng]]

---

## Nguyên tắc: tách NỘI DUNG khỏi TIẾN ĐỘ

Đây là quyết định quan trọng nhất, và nó **khác một chút so với yêu cầu ban đầu**.

Yêu cầu ban đầu: mỗi từ vựng có field `done` / *"đã học xong chưa"* nằm ngay trong file JSON.

Vấn đề nếu làm đúng như vậy:

| Vấn đề | Cụ thể |
|---|---|
| **Git bẩn** | Mỗi lần lật một cái thẻ là file JSON đổi → `git status` luôn đỏ, commit đầy rác |
| **Deploy đè mất tiến độ** | File JSON nằm trong repo. Deploy bản mới lên Vercel là ghi đè, tiến độ học bay sạch |
| **Không ghi được** | Vercel chạy read-only. App **không thể** ghi vào file JSON trong repo lúc đang chạy |
| **Đổi máy** | Tiến độ dính vào repo, không dính vào người học |

Bản chất: **nội dung** thì tĩnh, ai học cũng như nhau, cả năm không đổi. **Tiến độ** thì động, riêng từng người, đổi mỗi phút. Nhét chung một file là hai thứ đá nhau.

**Cách làm:**

```
content/day-1/vocabulary.json     ← NỘI DUNG. commit vào git. app chỉ đọc.
localStorage["toeic900"]          ← TIẾN ĐỘ. nằm trên máy người học. app đọc + ghi.
```

Nối hai thứ lại bằng **`id`**. Nội dung có `id: "d1-v06"`, tiến độ có `{ "d1-v06": { "status": "known" } }`. App ghép lúc render.

Nếu sau này muốn đồng bộ nhiều thiết bị thì chỉ cần đổi chỗ lưu tiến độ (Firebase chẳng hạn) — phần nội dung không phải sửa một dòng nào.

---

## Cấu trúc thư mục

Mỗi buổi học là **một folder**, trong đó mỗi loại nội dung là **một file JSON riêng** (gọi là collection):

```
content/
├── days.json                  danh sách buổi học — app đọc file này trước
│
├── day-1/
│   ├── day.json               thông tin buổi + thứ tự hoạt động
│   ├── grammar.json           cấu trúc ngữ pháp
│   ├── theory.json            khối lý thuyết (4 yếu tố, bảng giới từ, so sánh từ)
│   ├── vocabulary.json        từ vựng
│   ├── translation.json       bài tập gạch S/V/O + dịch
│   ├── listening.json         bài nghe + audio + đáp án
│   └── pictures.json          từ vựng qua hình
│
└── day-2/                     ← buổi sau lặp lại y hệt bộ file này
    └── …
```

Vì sao tách nhiều file thay vì một file to:

- Sửa từ vựng không đụng vào bài nghe → merge git không xung đột
- Mở file ra là biết ngay đang xem gì, không phải cuộn qua 800 dòng
- Buổi nào thiếu loại nội dung nào thì **thiếu hẳn file đó** — không phải để mảng rỗng

---

## Khuôn chung của mọi file collection

Đây chính là *"form chung giữa các ngày"*. Mọi file collection đều có đúng khuôn này:

```json
{
  "collection": "vocabulary",
  "day": "day-1",
  "title": "Từ vựng",
  "schemaVersion": 1,
  "items": [ … ]
}
```

| Field | Ý nghĩa |
|---|---|
| `collection` | Loại nội dung. App dựa vào đây để chọn màn hình hiển thị |
| `day` | Thuộc buổi nào. Trùng với tên folder — để kiểm tra chéo, tránh copy nhầm file |
| `title` | Tên hiển thị trên giao diện |
| `schemaVersion` | Đổi cấu trúc thì tăng số này, code cũ biết mà báo lỗi thay vì hiểu sai |
| `items` | Mảng nội dung. **Luôn là mảng**, kể cả khi chỉ có một phần tử |

Và mọi `item` ở mọi collection đều có 2 field bắt buộc:

| Field | Ý nghĩa |
|---|---|
| `id` | Định danh **toàn cục**, không đổi. Dạng `d<số buổi>-<loại><số>` — vd `d1-v06`, `d1-hw1-03` |
| `source` | Dữ liệu này từ đâu ra. Xem bảng bên dưới |

### `source` — dấu vết nguồn gốc

Đây là field dễ bị coi thường nhưng quan trọng nhất khi soát dữ liệu:

| Giá trị | Nghĩa | Có cần soát lại không |
|---|---|---|
| `pdf` | Nguyên văn từ `DAY 1.pdf` / `Picture for Part 1.pdf` | Không |
| `drive` | Từ file khác trong Drive, vd bảng đáp án `IMG_0292.PNG` | Không |
| `ai` | AI bổ sung vì tài liệu gốc **bỏ trống** | **Có — bắt buộc** |
| `whisper` | Máy chép lại từ audio | **Có — bắt buộc** |

`source` ghi được theo từng field khi một item lẫn nhiều nguồn:

```json
"source": { "word": "pdf", "ipa": "pdf", "meaningVi": "ai" }
```

Nhìn phát biết ngay chỗ nào tin được, chỗ nào phải kiểm.

---

## Từng collection

### `vocabulary.json`

```json
{
  "id": "d1-v06",
  "no": 6,
  "word": "copier",
  "pos": "n",
  "ipa": { "uk": "/ˈkɒpiə(r)/", "us": "/ˈkɑːpiər/" },
  "meaningVi": "máy photocopy",
  "image": "/assets/day-1/images/picture-for-part-1/p01-4.jpg",
  "example": { "en": "A man is using the copier.", "vi": "Một người đàn ông đang dùng máy photocopy." },
  "group": "Practice 1",
  "source": { "word": "pdf", "ipa": "pdf", "meaningVi": "ai", "example": "ai" }
}
```

- `image` — `null` nếu chưa có ảnh. Ảnh hiện ở **mặt sau** thẻ, không phải mặt trước
- `ipa` gộp thành object thay vì `ipaUk` / `ipaUs` rời — sau này thêm giọng khác chỉ cần thêm key
- **Không có** `done` / `learned` — cái đó nằm ở tiến độ

### `grammar.json`

```json
{
  "id": "d1-g1",
  "voice": "active",
  "name": "Thì hiện tại tiếp diễn",
  "nameVi": "đang …",
  "formula": "S + is/are + V_ing + place",
  "example": { "en": "Some people are standing outside.", "vi": "Một vài người đang đứng bên ngoài." },
  "source": { "formula": "pdf", "example": "pdf", "exampleVi": "ai" }
}
```

### `theory.json`

Chỗ này nội dung **không đồng dạng** — có khối là danh sách gạch đầu dòng, có khối là bảng cặp đối lập, có khối là so sánh hai ảnh. Nên mỗi item mang thêm field `type`, app nhìn `type` để chọn cách vẽ:

```json
{ "id": "d1-t-aspects", "type": "aspects",      "title": "Bốn yếu tố khi tả tranh người", "items": [ … ] }
{ "id": "d1-t-prep",    "type": "pairs",        "title": "Bảng giới từ chỉ vị trí",       "pairs": [ … ], "singles": [ … ] }
{ "id": "d1-t-wear",    "type": "compare",      "title": "wear vs put on",                "left": { … }, "right": { … } }
{ "id": "d1-t-places",  "type": "wordGroups",   "title": "Danh từ chỉ địa điểm",          "groups": { … } }
```

Buổi sau có kiểu khối mới thì **thêm `type` mới**, không phải đập lại cấu trúc cũ.

### `translation.json`

```json
{
  "id": "d1-tr01",
  "no": 1,
  "tokens": ["The whole company", "is planning", "to go on vacation", "next Friday"],
  "key": ["S", "V", "O", null],
  "vi": "Cả công ty đang dự định đi nghỉ mát vào thứ Sáu tới.",
  "source": { "tokens": "pdf", "key": "ai", "vi": "ai" }
}
```

`key` khớp 1-1 theo vị trí với `tokens`. `null` = cụm đó không thuộc S/V/O, để trống là đúng.

### `listening.json`

Hai tầng: `items` là **bộ bài**, trong mỗi bộ có `questions` là từng câu.

```json
{
  "id": "d1-hw1",
  "title": "Homework 1",
  "subtitle": "10 câu · có đáp án chính thức",
  "mode": "choice",
  "hasKey": true,
  "fullAudio": "/assets/day-1/audio/0 - Full.mp3",
  "questions": [
    {
      "id": "d1-hw1-01",
      "no": 1,
      "audio": "/assets/day-1/audio/1.mp3",
      "image": null,
      "answer": "C",
      "transcript": null,
      "transcriptVi": null,
      "source": { "answer": "drive", "transcript": "whisper" }
    }
  ]
}
```

| Field | Ghi chú |
|---|---|
| `mode` | `choice` (chọn A/B/C/D) hoặc `dictation` (chép chính tả) |
| `hasKey` | `false` khi tài liệu không kèm đáp án — Practice 1.2 và 2.2 rơi vào đây. App phải **nói rõ** thay vì giả vờ chấm được |
| `answer` | Chữ cái đáp án đúng |
| `transcript` | Object 4 phương án A/B/C/D sau khi chạy whisper. `null` = chưa chạy |
| `transcriptVi` | Bản dịch để làm Vietsub |

### `pictures.json`

```json
{
  "id": "d1-pic-clothes",
  "title": "Types of clothes",
  "icon": "👕",
  "questions": [
    {
      "id": "d1-pic-clothes-01",
      "image": "/assets/day-1/images/picture-for-part-1/p01-4.jpg",
      "answer": "cap",
      "accept": ["baseball cap"],
      "source": { "image": "pdf", "answer": "ai" }
    }
  ]
}
```

`accept` — các cách viết khác cũng tính đúng. Không có nó thì gõ `baseball cap` bị chấm sai oan.

### `day.json` và `days.json`

```json
// content/day-1/day.json
{
  "slug": "day-1",
  "no": 1,
  "title": "DAY 1",
  "subtitle": "Part 1 – Photographs",
  "importedAt": "2026-09-04",
  "collections": ["grammar", "theory", "vocabulary", "translation", "listening", "pictures"]
}
```

`collections` liệt kê buổi này **thật sự có** những gì. Buổi 2 không có bài dịch thì bỏ `translation` ra khỏi mảng — app tự ẩn hoạt động đó, không cần sửa code.

```json
// content/days.json
{ "days": ["day-1"] }
```

---

## Cấu trúc tiến độ (localStorage)

Không nằm trong repo, nhưng phải chốt vì mọi tính năng đọc chung:

```json
{
  "day-1": {
    "vocab":   { "d1-v06": "known" },
    "listen":  { "d1-hw1-03": { "picked": "B", "correct": false, "tries": 2 } },
    "trans":   { "d1-tr01": { "done": true, "correct": true } },
    "picture": { "d1-pic-clothes-01": "cap" },
    "updatedAt": "2026-09-04T10:22:00Z"
  }
}
```

Khoá bằng `id` chứ **không phải** bằng từ tiếng Anh. Vì nếu sửa chính tả một từ trong `vocabulary.json` mà khoá là từ đó thì tiến độ mất trắng — khoá bằng `id` thì sửa thoải mái.

---

## Quy tắc đặt `id`

Cố định, không được đổi về sau, vì tiến độ của người học neo vào đây:

| Loại | Mẫu | Ví dụ |
|---|---|---|
| Từ vựng | `d<buổi>-v<số 2 chữ số>` | `d1-v06` |
| Ngữ pháp | `d<buổi>-g<số>` | `d1-g1` |
| Khối lý thuyết | `d<buổi>-t-<tên>` | `d1-t-prep` |
| Bài dịch | `d<buổi>-tr<số 2 chữ số>` | `d1-tr01` |
| Bộ bài nghe | `d<buổi>-<mã bộ>` | `d1-hw1` |
| Câu nghe | `d<buổi>-<mã bộ>-<số 2 chữ số>` | `d1-hw1-03` |
| Ảnh | `d<buổi>-pic-<nhóm>-<số 2 chữ số>` | `d1-pic-clothes-01` |

Số 2 chữ số để sắp xếp theo tên file/khoá vẫn đúng thứ tự — `v10` không nhảy lên trước `v6`.

---

## Sửa dữ liệu bằng tay thế nào

Toàn bộ là JSON thường, mở bằng editor nào cũng được:

- Nghĩa tiếng Việt sai → sửa `meaningVi` trong `vocabulary.json`
- Gán ảnh cho từ → điền đường dẫn vào `image`
- Điền đáp án ảnh → sửa `answer` trong `pictures.json`, đổi `source.answer` thành `pdf` nếu tự tay kiểm

Sửa xong đổi luôn `source` cho khớp — đó là cách biết chỗ nào đã soát, chỗ nào còn là bản nháp của máy.
