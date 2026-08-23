# Sidekick với Shopify Flow — Automation Tests

Sidekick có thể tự động tạo **simulated test events** cho workflow trong Shopify Flow, giúp merchant kiểm tra logic trước khi kích hoạt workflow thật.

---

## Cách hoạt động

### Bước tạo test events:

1. Vào **Apps > Flow** từ Shopify admin
2. Chọn workflow cần test
3. Click **Edit** để mở workflow editor
4. Tại trigger, chọn **"Test your workflow"**
5. Click **"Generate events"** trong dialog
6. Sidekick tự động tạo **2 test events**:
   - Một event **passing condition** (đi qua điều kiện đúng)
   - Một event **failing condition** (đi qua điều kiện sai)
7. Chọn 1 trong 2 events từ danh sách **Saved event** để chạy test

> "Sidekick can generate 2 test events (a passing condition and a failing condition) to test an Order created workflow using existing order data in your store, and then you can use, edit, or remove those test events."

---

## Verify logic

### Preview outputs
Click vào **condition hoặc action step** trong workflow, chọn tab **Preview** để "confirm that any variables are displaying the correct data."

### Logic path visualization
"The workflow highlights specific conditions and actions to visually display the logic path" — hệ thống highlight các conditions và actions để hiển thị trực quan đường đi logic của test event.

### Chọn test events khác
Chọn từ danh sách **"Saved events"** hoặc **"Event history"**.

### Refresh results
Dùng nút **Restart test** để refresh workflow test results.

---

## Quản lý Saved Events

- Hover trên event, chọn **Edit** hoặc **Remove**
- Update field content và click **Save** để lưu thay đổi
- Sidekick-generated events xuất hiện chung với saved events và event history

---

## An toàn khi test

Test workflows **không thực hiện thay đổi nào lên store**:

- "Don't take actions or make modifications to your store"
- "A test run stops at the first action that tries to make a change in the workflow logic to prevent unintended changes"
- External service actions (như "Send HTTP request") hiển thị **"Can't simulate this action"** thay vì actual data

Test events sử dụng **real store data** nhưng hoàn toàn an toàn — chỉ mô phỏng, không modify.

---

## Nguồn

- [Shopify Flow test workflow - Help doc](https://help.shopify.com/manual/shopify-flow/manage/test-workflow)
