# API_SPEC.md

# แนวทาง API

## 1. Resources
- requests
- requester-types
- categories
- statuses
- evidence-types
- attachments
- reports

## 2. Requests

### Create
```http
POST /api/requests
```

Body:
```json
{
  "request_date": "2026-06-16",
  "requester_type_id": 1,
  "category_id": 1,
  "status_id": 1,
  "location_text": "หน้าตลาดสด",
  "note": "ขอดูภาพช่วงเช้า"
}
```

Response:
```json
{
  "id": 1,
  "request_no": "C69-0001",
  "message": "บันทึกสำเร็จ"
}
```

### List
```http
GET /api/requests?start_date=2026-06-01&end_date=2026-06-30
```

Query:
- request_no
- start_date
- end_date
- requester_type_id
- category_id
- status_id
- view (`this-month`, `follow-up`, `found`)

### Next Number Preview
```http
GET /api/requests/next-number?date=2026-06-16
```

Response:
```json
{
  "fiscalYear": 2569,
  "sequenceNo": 42,
  "requestNo": "C69-0042"
}
```

หมายเหตุ: ใช้เป็นเลขคำร้องโดยประมาณเท่านั้น เลขจริงยืนยันเมื่อบันทึกสำเร็จ

### Duplicate Hints
```http
GET /api/requests/duplicate-hints?requestDate=2026-06-16&categoryId=1&locationText=หน้าตลาด
```

Response:
```json
{
  "rows": [
    {
      "id": 1,
      "requestNo": "C69-0001",
      "status": "รับคำร้องแล้ว",
      "location": "หน้าตลาด"
    }
  ]
}
```

หมายเหตุ: ใช้เป็น hint แบบไม่ block การบันทึก

### Form Assist
```http
GET /api/requests/form-assist
```

Response:
```json
{
  "smartDefaults": {
    "requesterTypeId": 2,
    "statusId": 1
  },
  "locationSuggestions": ["หน้าตลาด", "สี่แยกเทศบาล"]
}
```

หมายเหตุ: endpoint นี้โหลดหลังหน้าเพิ่มคำร้องแสดงแล้ว เพื่อให้ฟอร์มหลักตอบสนองก่อน ส่วน smart defaults และ location autocomplete เติมตามมาทีหลังโดยไม่ block การบันทึก

### Detail
```http
GET /api/requests/{id}
```

### Update
```http
PUT /api/requests/{id}
```

Body อาจมี `request_no` ได้เฉพาะกรณีแก้เลขคำร้องโดยตรงหรือ backfill โดยต้อง validate format, unique, และ fiscal year ให้ตรงกับ `request_date`

### Delete
```http
DELETE /api/requests/{id}
```

Delete เป็น soft delete โดยตั้งค่า `deleted_at` และไม่คืนเลขคำร้องไปใช้ซ้ำ

## 3. Master Data APIs
Categories:
```http
GET /api/categories
POST /api/categories
PUT /api/categories/{id}
PATCH /api/categories/{id}/deactivate
```

Requester types:
```http
GET /api/requester-types
POST /api/requester-types
PUT /api/requester-types/{id}
PATCH /api/requester-types/{id}/deactivate
```

Statuses:
```http
GET /api/statuses
POST /api/statuses
PUT /api/statuses/{id}
PATCH /api/statuses/{id}/deactivate
```

Evidence types:
```http
GET /api/evidence-types
POST /api/evidence-types
PUT /api/evidence-types/{id}
PATCH /api/evidence-types/{id}/deactivate
```

## 4. Attachments

### Upload
```http
POST /api/requests/{request_id}/attachments
```

Form data:
| Field | Type |
|---|---|
| evidence_type_id | number |
| file | file |
| note | string |

### List
```http
GET /api/requests/{request_id}/attachments
```

### Download
```http
GET /api/attachments/{attachment_id}/download
```

### Delete
```http
DELETE /api/attachments/{attachment_id}
```

## 4.1 Test Fixtures

ใช้เฉพาะ automated E2E บน preview/staging ที่ตั้ง `E2E_FIXTURES_ENABLED=1` และต้องผ่าน shared password access gate แล้วเท่านั้น

### Reset E2E Fixture
```http
POST /api/test-fixtures/e2e
```

ผลลัพธ์:
- เตรียมคำร้อง `C69-0003`
- เตรียมไฟล์แนบ `test-private.pdf` หากยังไม่มีไฟล์แนบ
- reset tombstone หลัง delete test เพื่อเริ่มรอบ E2E ใหม่ได้อย่างตั้งใจ

## 5. Reports

### Summary
```http
GET /api/reports/summary
```

Query:
- start_date
- end_date
- requester_type_id
- category_id
- status_id
- include_deleted (admin/audit only, optional future)

Response:
```json
{
  "total": 25,
  "by_category": [],
  "by_requester_type": [],
  "by_status": [],
  "previous_total": 20,
  "change_percent": 25,
  "found_rate": 64.5,
  "monthly_trend": [],
  "records": []
}
```

### Export Excel
```http
GET /api/reports/export/excel
```

### Export PDF
```http
GET /api/reports/export/pdf
```

### Backup
```http
GET /api/reports/export/backup
```

ใน implementation ปัจจุบันใช้:
```http
GET /api/backup
```

Response เป็นไฟล์ Excel หลาย sheet

## 6. Validation
| Field | Rule |
|---|---|
| request_date | required, valid date |
| requester_type_id | required |
| category_id | required |
| status_id | required |
| request_no | optional on correction/backfill, unique, format `CYY-NNNN`, fiscal year must match request_date |
| file | optional |
| file extension | allowed only |
| file size | max size |
