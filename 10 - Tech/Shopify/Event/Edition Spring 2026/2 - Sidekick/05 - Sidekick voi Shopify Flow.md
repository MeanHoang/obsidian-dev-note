# Sidekick voi Shopify Flow -- Automation Tests

Sidekick co the tu dong tao **simulated test events** cho workflow trong Shopify Flow, giup merchant kiem tra logic truoc khi kich hoat workflow that.

---

## Cach hoat dong

### Buoc tao test events:

1. Vao **Apps > Flow** tu Shopify admin
2. Chon workflow can test
3. Click **Edit** de mo workflow editor
4. Tai trigger, chon **"Test your workflow"**
5. Click **"Generate events"** trong dialog
6. Sidekick tu dong tao **2 test events**:
   - Mot event **passing condition** (di qua dieu kien dung)
   - Mot event **failing condition** (di qua dieu kien sai)
7. Chon 1 trong 2 events tu danh sach **Saved event** de chay test

> "Sidekick can generate 2 test events (a passing condition and a failing condition) to test an Order created workflow using existing order data in your store, and then you can use, edit, or remove those test events."

---

## Verify logic

### Preview outputs
Click vao **condition hoac action step** trong workflow, chon tab **Preview** de "confirm that any variables are displaying the correct data."

### Logic path visualization
"The workflow highlights specific conditions and actions to visually display the logic path" -- he thong highlight cac conditions va actions de hien thi truc quan duong di logic cua test event.

### Chon test events khac
Chon tu danh sach **"Saved events"** hoac **"Event history"**.

### Refresh results
Dung nut **Restart test** de refresh workflow test results.

---

## Quan ly Saved Events

- Hover tren event, chon **Edit** hoac **Remove**
- Update field content va click **Save** de luu thay doi
- Sidekick-generated events xuat hien chung voi saved events va event history

---

## An toan khi test

Test workflows **khong thuc hien thay doi nao len store**:

- "Don't take actions or make modifications to your store"
- "A test run stops at the first action that tries to make a change in the workflow logic to prevent unintended changes"
- External service actions (nhu "Send HTTP request") hien thi **"Can't simulate this action"** thay vi actual data

Test events su dung **real store data** nhung hoan toan an toan -- chi mo phong, khong modify.

---

## Nguon

- [Shopify Flow test workflow - Help doc](https://help.shopify.com/manual/shopify-flow/manage/test-workflow)
