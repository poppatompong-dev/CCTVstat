# ALL_DOCS.md

เอกสารรวมนี้สร้างจากไฟล์เอกสารต้นทางปัจจุบันใน cctv-request-statistics-docs/ เพื่อใช้ตรวจภาพรวมและลด doc drift

## สารบัญ
- ACCEPTANCE_CRITERIA.md
- AGENT_TASKS.md
- API_SPEC.md
- ATTACHMENT_SPEC.md
- CHANGELOG.md
- CONTEXT.md
- DATA_MODEL.md
- DEPLOYMENT.md
- PRODUCT_DESCRIPTION.md
- PROGRESSIVE.md
- PROJECT_DECISIONS.md
- PROMPT.md
- README.md
- REPORT_SPEC.md
- REQUIREMENTS.md
- ROADMAP.md
- SECURITY_PRIVACY.md
- SEED_DATA.md
- TEST_PLAN.md
- UI_SPEC.md
- WORKFLOW.md
- docs/adr/0001-use-shared-password-access-gate-for-vercel-trial.md
- docs/adr/0002-use-vercel-blob-private-storage-for-attachments.md
- docs/adr/0003-allow-request-number-correction-for-backfill.md
- docs/adr/0004-use-soft-delete-for-requests.md
- docs/adr/0005-reject-request-number-fiscal-year-mismatch.md

---

## ACCEPTANCE_CRITERIA.md

# ACCEPTANCE_CRITERIA.md

# เกณฑ์รับมอบงาน

## 1. Functional Criteria
| ข้อ | เกณฑ์ | ต้องผ่าน |
|---:|---|---:|
| 1 | เพิ่มคำร้องใหม่ได้ | ใช่ |
| 2 | ออกเลข `C69-0001` ได้ | ใช่ |
| 3 | เลขนับตามปีงบประมาณ | ใช่ |
| 4 | เลือกประเภทผู้ขอได้ | ใช่ |
| 5 | เลือกหมวดหมู่ได้ | ใช่ |
| 6 | เลือกสถานะได้ | ใช่ |
| 7 | บันทึกโดยไม่แนบไฟล์ได้ | ใช่ |
| 8 | แนบหลักฐานภายหลังได้ | ใช่ |
| 9 | ค้นหาและแก้ไขได้ | ใช่ |
| 10 | จัดการหมวดหมู่ได้ | ใช่ |
| 11 | จัดการประเภทหลักฐานได้ | ใช่ |
| 12 | รายงานตามช่วงวันที่ได้ | ใช่ |
| 13 | Export Excel ได้ | ใช่ |
| 14 | Export PDF ได้ | ใช่ |
| 15 | Export Backup ได้ | ใช่ |
| 16 | UI ภาษาไทย | ใช่ |
| 17 | ใช้งานบนมือถือ/แท็บเล็ตได้ | ใช่ |
| 18 | Dashboard แสดงคำร้องที่ควรติดตาม | ใช่ |
| 19 | หน้าเพิ่มคำร้องแสดงเลขคำร้องโดยประมาณ | ใช่ |
| 20 | มี smart defaults ที่แก้ไขได้ | ใช่ |
| 21 | รายงานมี insight เทียบช่วงก่อนหน้าและแนวโน้ม | ใช่ |
| 22 | หน้าค้นหามีมุมมองด่วน | ใช่ |
| 23 | Duplicate hint ไม่ block การบันทึก | ใช่ |
| 24 | Location autocomplete ยังพิมพ์อิสระได้ | ใช่ |
| 25 | Backup เป็น Excel หลาย sheet | ใช่ |
| 26 | อัปโหลดหลักฐานหลายไฟล์ต่อครั้งได้ | ใช่ |
| 27 | มี thumbnail/gallery สำหรับไฟล์แนบ | ใช่ |
| 28 | มี modal/pending state สำหรับ action สำคัญ | ใช่ |
| 29 | หน้าเพิ่มคำร้องไม่รอ smart assist ก่อนแสดงฟอร์มหลัก | ใช่ |
| 30 | หน้ารายงานมี loading feedback ระหว่าง query aggregate | ใช่ |

## 2. UX Criteria
| เกณฑ์ | ค่าเป้าหมาย |
|---|---|
| เพิ่มคำร้องไม่แนบไฟล์ | ไม่เกิน 30 วินาที |
| field บังคับ | ไม่เกิน 4 field |
| เมนูหลัก | ไม่เกิน 5 เมนู |
| การแนบไฟล์ | ไม่บังคับ |
| เลขคำร้องหลังบันทึก | ต้องแสดงเด่นชัด |
| เพิ่มคำร้องบนมือถือ | ต้องใช้งานได้สะดวก ไม่บีบฟอร์มจนอ่านยาก |
| touch target | ปุ่มและ dropdown ต้องกดง่ายบนจอสัมผัส |
| smart feature | ห้ามเพิ่ม required field ใหม่ |
| smart feature | ห้ามทำให้เพิ่มคำร้องช้ากว่า 30 วินาที |
| smart assist | ต้องโหลดแบบไม่ block ฟอร์มหลัก |
| รายงาน | ต้องมี shell/loading feedback หาก query ยังไม่เสร็จ |
| action feedback | ต้องมี modal/pending state ตอนบันทึก อัปโหลด หรือลบ |

## 3. Request Number Criteria
| สถานการณ์ | ผลที่ต้องได้ |
|---|---|
| คำร้องแรกปีงบ 2569 | `C69-0001` |
| คำร้องถัดไป | `C69-0002` |
| ขึ้นปีงบใหม่ | เริ่มลำดับใหม่ |
| แก้ไขข้อมูลทั่วไป | เลขเดิมไม่เปลี่ยน |
| แก้ไขเลขคำร้องโดยตรง | ทำได้เมื่อ format ถูกและไม่ซ้ำ |
| แก้ไขเลขคำร้องปีงบไม่ตรงวันที่ | ระบบปฏิเสธและแจ้งเตือน |
| นำเข้าข้อมูลย้อนหลัง | รองรับเลขคำร้องที่กำหนดเองได้ |
| ลบคำร้อง | soft delete และไม่นำเลขเดิมกลับมาใช้ซ้ำ |

## 4. Attachment Criteria
| เกณฑ์ | รายละเอียด |
|---|---|
| แนบไฟล์ได้ | PDF, JPG, JPEG, PNG, DOC, DOCX |
| แนบหลายไฟล์ | ต้องได้ตาม `MAX_UPLOAD_FILES` |
| ขนาดไฟล์ | จำกัดต่อไฟล์ตาม `MAX_UPLOAD_BYTES` |
| Block ไฟล์อันตราย | EXE, BAT, CMD, JS, SH, PHP, HTML |
| แสดงรายการไฟล์แนบ | ต้องมี |
| Thumbnail/gallery | รูปภาพต้องเห็น thumbnail และเอกสารต้องเห็นชนิดไฟล์ |
| ดาวน์โหลดไฟล์ | ต้องได้ |
| ลบไฟล์แนบ | ต้องถามยืนยันด้วย modal |
| Public URL | ต้องไม่มี |

## 5. Privacy Criteria
| รายการ | เกณฑ์ |
|---|---|
| เลขบัตรประชาชน | ไม่ใช่ field หลัก |
| ชื่อผู้ขอ | ไม่ใช่ field หลัก |
| เบอร์โทร | ไม่ใช่ field หลัก |
| วิดีโอ CCTV | ไม่รองรับใน version 1 |
| ไฟล์หลักฐาน | optional เท่านั้น |

---

## AGENT_TASKS.md

# AGENT_TASKS.md

# รายการงานสำหรับ AI Agent

เอกสารนี้สะท้อนสถานะ implementation ปัจจุบันของ CCTVStat หลังย้ายมาใช้ Next.js, Neon PostgreSQL, Vercel Blob private storage, performance instrumentation, perceived-performance streaming UI และ multi-file attachment UX แล้ว

## Phase 1: Project Setup
- [x] สร้าง Next.js 16 + React 19 + TypeScript project
- [x] ตั้งค่า styling/theme ภาษาไทย
- [x] สร้าง `.env.example`
- [x] ตั้งค่า shared password access gate
- [x] ตั้งค่า Vercel-ready project structure
- [x] เขียน README วิธี run/deploy

## Phase 2: Database
- [x] ใช้ Neon PostgreSQL ผ่าน `@neondatabase/serverless`
- [x] สร้างตาราง requester_types
- [x] สร้างตาราง categories
- [x] สร้างตาราง statuses พร้อม `semantic_key`
- [x] สร้างตาราง evidence_types
- [x] สร้างตาราง requests
- [x] สร้างตาราง request_attachments
- [x] seed master data
- [x] เพิ่ม schema initialization guard และ readiness check
- [x] เพิ่ม indexes สำหรับ query หลัก

## Phase 3: Request Number
- [x] แปลง ค.ศ. เป็น พ.ศ.
- [x] คำนวณปีงบประมาณ
- [x] สร้างเลข `CYY-NNNN`
- [x] reset running number ตามปีงบประมาณ
- [x] ป้องกันเลขซ้ำด้วย unique constraints
- [x] validate การแก้เลขคำร้องให้ปีงบตรงกับวันที่

## Phase 4: Add Request
- [x] สร้างหน้าเพิ่มคำร้อง
- [x] วันที่ default วันนี้
- [x] dropdown ประเภทผู้ขอ
- [x] tile picker หมวดหมู่
- [x] dropdown สถานะ
- [x] field สถานที่และหมายเหตุแบบ optional
- [x] preview เลขคำร้องถัดไปแบบไม่จองเลข
- [x] smart defaults จากข้อมูลที่ใช้จริง
- [x] duplicate hint แบบไม่ block
- [x] location autocomplete
- [x] โหลด smart defaults และ location autocomplete ผ่าน `/api/requests/form-assist` หลังฟอร์มหลักแสดงแล้ว
- [x] modal/pending state ระหว่างบันทึก
- [x] success message พร้อมเลขคำร้องใหญ่ชัดเจน

## Phase 5: Search / Edit
- [x] ค้นหาด้วยเลขคำร้อง/สถานที่
- [x] ค้นหาด้วยช่วงวันที่
- [x] filter ประเภทผู้ขอ
- [x] filter หมวดหมู่
- [x] filter สถานะ
- [x] quick filters: ทั้งหมด, เดือนนี้, ควรติดตาม, พบภาพ
- [x] แก้ไขคำร้อง
- [x] แก้ไขเลขคำร้องอย่างตั้งใจพร้อม validation
- [x] soft delete พร้อม modal confirmation

## Phase 6: Master Data
- [x] จัดการหมวดหมู่
- [x] จัดการประเภทหลักฐาน
- [x] จัดการประเภทผู้ขอ
- [x] จัดการสถานะ
- [x] เพิ่ม/แก้ไข/เรียงลำดับ/เปิดปิดใช้งาน
- [x] แสดง semantic key ของ status แบบอ่านอย่างเดียว

## Phase 7: Attachments
- [x] ใช้ Vercel Blob Private Storage
- [x] ฟอร์มอัปโหลดไฟล์
- [x] อัปโหลดหลายไฟล์ต่อครั้งด้วย `MAX_UPLOAD_FILES`
- [x] เลือกประเภทหลักฐาน
- [x] ตรวจ extension
- [x] จำกัดขนาดไฟล์ต่อไฟล์ด้วย `MAX_UPLOAD_BYTES`
- [x] safe pathname สำหรับ Blob
- [x] บันทึก metadata ใน Neon
- [x] แสดง preview ก่อนอัปโหลด
- [x] แสดง thumbnail/gallery หลังอัปโหลด
- [x] ดาวน์โหลดผ่าน endpoint ที่ต้อง auth
- [x] ลบไฟล์พร้อม modal confirmation

## Phase 8: Reports
- [x] filter ช่วงวันที่
- [x] filter ประเภทผู้ขอ
- [x] filter หมวดหมู่
- [x] filter สถานะ
- [x] summary total ด้วย SQL aggregate
- [x] count by category
- [x] count by requester type
- [x] count by status
- [x] trend ย้อนหลัง 6 เดือน
- [x] found-rate insight
- [x] table records สูงสุด 1,000 rows ต่อ report view
- [x] Export Excel
- [x] Print-to-PDF view
- [x] Export Backup Excel หลาย sheet
- [x] แสดง loading skeleton ระหว่าง query รายงานเพื่อให้หน้า feedback ทันที

## Phase 9: Performance
- [x] เพิ่ม timing instrumentation สำหรับ route/function สำคัญ
- [x] วัด dev mode เทียบ production local
- [x] แก้ cold runtime cost ของ `ensureSchema()`
- [x] แยก smart assist ออกจาก critical render path ของหน้าเพิ่มคำร้อง
- [x] ใช้ Suspense/loading skeleton กับหน้าเพิ่มคำร้องและรายงาน
- [x] เพิ่ม `PERF_DB_PROBE=1` สำหรับ diagnostic ชั่วคราว
- [ ] วัดผลซ้ำบน Vercel/Neon production หลัง deploy ล่าสุด
- [ ] ทดสอบ Excel/backup กับข้อมูล 5,000+ รายการ

## Phase 10: QA ที่ต้องทำบน Runtime จริง
- [ ] ตรวจ Vercel production URL หลัง deploy ล่าสุด
- [ ] ทดสอบ login ด้วย shared password
- [ ] ทดสอบเพิ่มคำร้องจริง 2-3 รายการ
- [ ] ทดสอบ upload/download/delete กับ Vercel Blob token จริง
- [ ] ทดสอบ thumbnail รูปภาพและการ์ด PDF/DOC/DOCX
- [ ] ทดสอบรายงาน/Excel/PDF/Backup
- [ ] ทดสอบ cold start รอบแรกและ refresh รอบสองบน Vercel
- [ ] ทดสอบเพิ่มคำร้องพร้อมกันหลายคนเพื่อดูเลขคำร้องชนกัน

---

## API_SPEC.md

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

---

## ATTACHMENT_SPEC.md

# ATTACHMENT_SPEC.md

# ข้อกำหนดการแนบหลักฐาน

## 1. วัตถุประสงค์
ฟังก์ชันหลักฐานแนบใช้เก็บเอกสารประกอบคำร้อง เช่น ใบคำร้อง หนังสือราชการ ใบแจ้งความ หรือรูปภาพประกอบ เพื่อใช้อ้างอิงภายใน

## 2. หลักการ
| หลักการ | รายละเอียด |
|---|---|
| ไม่บังคับ | บันทึกคำร้องได้โดยไม่ต้องแนบไฟล์ |
| แนบภายหลังได้ | กลับมาแนบจากหน้าแก้ไขคำร้องได้ |
| ไม่ public | ไฟล์ใช้ภายในเท่านั้น |
| ไม่รับวิดีโอ | version 1 ไม่รองรับไฟล์ CCTV video |

## 3. Flow
```text
เพิ่มคำร้องใหม่
→ ระบบออกเลขคำร้อง
→ กด [แนบหลักฐาน] หรือกลับมาแนบภายหลัง
→ เลือกประเภทหลักฐาน
→ เลือกไฟล์
→ อัปโหลด
```

## 4. ประเภทหลักฐานเริ่มต้น
1. ใบคำร้อง
2. หนังสือราชการ
3. ใบแจ้งความ
4. เอกสารส่งมอบ
5. รูปภาพประกอบ
6. อื่น ๆ

## 5. ไฟล์ที่อนุญาต
| ประเภท | Extension |
|---|---|
| PDF | `.pdf` |
| Image | `.jpg`, `.jpeg`, `.png` |
| Word | `.doc`, `.docx` |

## 6. ไฟล์ที่ต้อง block
`.exe`, `.bat`, `.cmd`, `.js`, `.sh`, `.php`, `.html`

## 7. ขนาดไฟล์
ค่าเริ่มต้นสำหรับช่วงทดลองบน Vercel server upload: 4 MB ต่อไฟล์ (`MAX_UPLOAD_BYTES=4194304`) และอัปโหลดได้สูงสุด 5 ไฟล์ต่อครั้ง (`MAX_UPLOAD_FILES=5`) เพื่อคุม body size และ serverless runtime

UI ต้องแสดง preview ก่อนอัปโหลดสำหรับรูปภาพ และแสดงการ์ดชนิดไฟล์สำหรับ PDF/DOC/DOCX หลังอัปโหลดต้องแสดง thumbnail/การ์ดไฟล์ผ่าน endpoint ของระบบ ไม่เปิด Blob URL ตรงใน UI

## 8. Blob Path Structure
```text
cctv-requests/
    C69-0001/
    1780000000000-request-form.pdf
    C69-0002/
    1780000000000-request-form.jpg
```

## 9. File Naming
รูปแบบแนะนำ:
```text
{request_no}_{YYYYMMDD}_{HHmmss}_{safe_original_name}
```

เก็บทั้ง:
- `original_file_name`
- `blob_pathname`
- `blob_url`
- `download_url`

หากมีการแก้เลขคำร้องภายหลัง ไม่ควร rename ไฟล์เดิมอัตโนมัติ ความสัมพันธ์ของไฟล์แนบต้องยึด `request_id` และ metadata เป็นหลัก เพื่อไม่ให้การแก้เลขกระทบไฟล์ที่ upload แล้ว

## 10. Metadata
| Field | รายละเอียด |
|---|---|
| request_id | คำร้องที่เกี่ยวข้อง |
| evidence_type_id | ประเภทหลักฐาน |
| original_file_name | ชื่อไฟล์เดิม |
| blob_pathname | path ใน Vercel Blob |
| blob_url | URL จาก Blob SDK |
| download_url | URL สำหรับดาวน์โหลด |
| content_type | MIME type |
| size_bytes | ขนาดไฟล์ |
| note | หมายเหตุ |
| uploaded_at | วันที่อัปโหลด |

## 11. Security
- ห้ามให้ upload folder execute file
- ห้ามเปิดไฟล์ผ่าน public URL โดยตรง
- ดาวน์โหลดผ่าน endpoint ของระบบเท่านั้น
- ตรวจ extension และ MIME type
- ป้องกัน path traversal เช่น `../../`

---

## CHANGELOG.md

# CHANGELOG.md

# Changelog

## 1.5.0 - Perceived Performance and Streaming UI
### Added
- เพิ่ม `GET /api/requests/form-assist` สำหรับ smart defaults และ location suggestions ที่โหลดหลังหน้าเพิ่มคำร้องแสดงแล้ว
- เพิ่ม loading skeleton สำหรับหน้าเพิ่มคำร้องและหน้ารายงาน เพื่อให้ client navigation มี feedback ทันที

### Changed
- หน้าเพิ่มคำร้องไม่รอ `getSmartDefaults()` และ `getLocationSuggestions()` ก่อน render ฟอร์มหลักแล้ว
- หน้ารายงานแยกฟิลเตอร์และผลรายงานไว้ใน Suspense boundaries เพื่อให้ shell แสดงก่อน query aggregate เสร็จ

### Verified
- `npm.cmd run lint` ผ่าน
- `npm.cmd run build` ผ่าน
- local production smoke test ผ่าน โดย `/requests/new` DOMContentLoaded ประมาณ 76ms และ `/reports` ประมาณ 160ms บน `127.0.0.1:3001`

## 1.4.0 - E2E Fixture Support and Request Number Feedback
### Added
- เพิ่ม committed fixture `test-private.pdf` สำหรับ automated upload test
- เพิ่ม `E2E_FIXTURES_ENABLED` สำหรับ staging/preview เพื่อ seed คำร้อง `C69-0003` พร้อมไฟล์แนบสำหรับทดสอบ view/download/delete
- เพิ่ม `POST /api/test-fixtures/e2e` สำหรับ reset fixture อย่างตั้งใจก่อนรัน automated E2E
- เพิ่ม tombstone state หลังลบ fixture เพื่อกัน cold serverless instance seed ไฟล์กลับมาระหว่าง delete test

### Changed
- ปรับ error การแก้เลขคำร้องซ้ำให้บอกเลขที่ชนชัดขึ้นและแสดงใต้ช่องเลขคำร้อง
- fixture attachment ใช้ endpoint download ของระบบเหมือนไฟล์จริง และยังต้องผ่าน access gate

### Notes
- `E2E_FIXTURES_ENABLED=1` ใช้เฉพาะ automated E2E staging/preview เท่านั้น ไม่ควรเปิดใน production จริง

## 0.1.0 - Initial Scope
### Added
- กำหนดระบบเป็น Web App ภายใน
- กำหนดว่าเป็นระบบเก็บสถิติ ไม่ใช่ case management
- ใช้ใบคำร้องกระดาษเดิม
- กำหนดเลขคำร้อง `CYY-NNNN`
- กำหนดหมวดหมู่ ประเภทผู้ขอ และสถานะเริ่มต้น
- กำหนดรายงานและ export

## 0.2.0 - Evidence Attachment
### Added
- เพิ่มฟังก์ชันแนบหลักฐานแบบ optional
- เพิ่มประเภทหลักฐาน
- เพิ่มตาราง request_attachments
- เพิ่มข้อกำหนดไฟล์ที่อนุญาตและไฟล์ที่ต้อง block
- เพิ่มข้อกำหนดความปลอดภัยไฟล์แนบ

## 0.3.0 - Backfill Readiness
### Added
- รองรับแนวคิดการแก้เลขคำร้องอย่างตั้งใจสำหรับ correction/backfill
- เพิ่มข้อกำหนดว่าเลขคำร้องที่แก้ต้อง format ถูกและไม่ซ้ำ
- ระบุว่าไฟล์แนบเดิมไม่ควรถูก rename อัตโนมัติเมื่อแก้เลขคำร้อง

## 1.0.0 - MVP Target
### Planned
- เพิ่มคำร้อง
- ออกเลขคำร้อง
- ค้นหา/แก้ไข
- จัดการหมวดหมู่
- จัดการประเภทหลักฐาน
- แนบหลักฐาน
- รายงาน
- Export Excel/PDF/Backup

## 1.1.0 - Smart Enhancements
### Added
- เพิ่มแนวคิดคำร้องที่ควรติดตามบน dashboard
- เพิ่มเลขคำร้องโดยประมาณบนหน้าเพิ่มคำร้อง
- เพิ่ม smart defaults จากข้อมูลที่ใช้บ่อยจริง
- เพิ่มรายงานเปรียบเทียบช่วงก่อนหน้า แนวโน้มย้อนหลัง 6 เดือน และอัตราพบภาพ
- เพิ่มมุมมองด่วนบนหน้าค้นหา ได้แก่ เดือนนี้ ควรติดตาม พบภาพ และทั้งหมด
- เพิ่ม duplicate hint แบบไม่ block การบันทึก
- เพิ่ม location autocomplete จากข้อมูลเดิม
- เปลี่ยน backup เป็น Excel หลาย sheet
- เพิ่ม confirmation ก่อนลบคำร้องและไฟล์แนบ
- เพิ่มหน้าจัดการประเภทผู้ขอและสถานะ

### Changed
- ปรับ seed data ให้ตรงกับ `SEED_DATA.md`
- เพิ่ม semantic key ให้สถานะ เพื่อให้ smart query ไม่ผูกกับชื่อสถานะภาษาไทยโดยตรง
- เพิ่ม `MAX_UPLOAD_BYTES` สำหรับควบคุมขนาดไฟล์แนบ

## 1.2.0 - Performance Optimization
### Added
- เพิ่ม database indexes สำหรับ query หลักของ request list, dashboard, report, fiscal sequence และ attachment lookup
- เพิ่ม lightweight performance timing log สำหรับ route/function สำคัญ
- เพิ่ม schema readiness check เพื่อลด cold runtime cost จาก `ensureSchema()`

### Changed
- ปรับ dashboard summary ให้รวม metric หลักด้วย SQL aggregate และดึง follow-up rows แบบ parallel
- ปรับ request list ให้ใช้ attachment count จาก pre-aggregated subquery ลด `GROUP BY` บนทุกแถวคำร้อง
- ปรับ report summary ให้ aggregate ด้วย SQL แทนการดึง 1,000 rows มานับใน Node
- ให้ report summary totals ใช้ข้อมูลครบตาม filter ส่วนตาราง detail ยังจำกัดสูงสุด 1,000 รายการเพื่อคุม payload
- เปลี่ยน DB round-trip probe ให้ทำงานเฉพาะเมื่อกำหนด `PERF_DB_PROBE=1`

### Verified
- `npm.cmd run lint` ผ่าน
- `npm.cmd run build` ผ่าน
- local smoke test ผ่าน `/`, `/requests`, `/reports`, `/api/reports/excel`
- production local รอบแรกหลังแก้ `/` ลดจากประมาณ 2146ms เหลือ 324ms และ `/api/requests/next-number` ลดจากประมาณ 1766ms เหลือ 102ms

## 1.3.0 - Attachment UX and Action Feedback
### Added
- เพิ่มการอัปโหลดหลักฐานหลายไฟล์ต่อครั้ง โดยคุมด้วย `MAX_UPLOAD_FILES`
- เพิ่ม preview ไฟล์ก่อนอัปโหลด และ thumbnail/gallery สำหรับไฟล์แนบที่อัปโหลดแล้ว
- เพิ่ม modal แสดงสถานะระหว่างบันทึก/อัปโหลด/ลบ และ modal ยืนยันก่อน action ที่มีผลกับข้อมูล

### Changed
- เพิ่ม Server Action body limit เป็น 25 MB เพื่อรองรับหลายไฟล์ โดยยังคุมขนาดรายไฟล์ด้วย `MAX_UPLOAD_BYTES`
- ปรับหน้ารายละเอียดคำร้องให้แสดงไฟล์แนบเป็นการ์ดพร้อม thumbnail/ชนิดไฟล์แทนรายการแถวอย่างเดียว

---

## CONTEXT.md

# CCTV Request Statistics Context

ระบบนี้เป็นบริบทของงานบันทึกสถิติการขอดูภาพจากกล้องวงจรปิดของเทศบาล โดยใช้คู่กับใบคำร้องกระดาษเดิมและเน้นความเร็ว ความถูกต้องของรายงาน และการเก็บข้อมูลเท่าที่จำเป็น

## Language

**คำร้อง**:
รายการอ้างอิงการขอดูภาพจากกล้องวงจรปิดหนึ่งครั้งในระบบสถิติ มีเลขคำร้อง วันที่ ประเภทผู้ขอ หมวดหมู่ สถานะ และข้อมูลเสริมเท่าที่จำเป็น
_Avoid_: เคส, ticket, งานอนุมัติ

**เลขคำร้อง**:
เลขอ้างอิงสั้นรูปแบบ `CYY-NNNN` ที่ระบบออกให้เมื่อบันทึกคำร้องครั้งแรก โดยปกติไม่เปลี่ยนจากการแก้ไขข้อมูลทั่วไป แต่ต้องแก้ได้อย่างตั้งใจเพื่อแก้ข้อมูลผิดหรือนำเข้าข้อมูลย้อนหลัง
_Avoid_: case number, เลขเอกสารเต็ม

**ใบคำร้องกระดาษ**:
เอกสารหลักของกระบวนการราชการเดิม ซึ่งอาจมีรายละเอียดและลายเซ็นที่ระบบ web app ไม่พยายามแทนที่
_Avoid_: online request, digital form หลัก

**ประเภทผู้ขอ**:
กลุ่มของผู้ที่ขอดูภาพ เช่น ประชาชน ตำรวจ หน่วยงานรัฐ หรือเจ้าหน้าที่เทศบาล ใช้เพื่อรายงานสถิติ
_Avoid_: account, user role

**หมวดหมู่**:
เหตุผลหรือประเภทเหตุการณ์ที่ทำให้มีการขอดูภาพ เช่น อุบัติเหตุจราจร ทรัพย์สินสูญหาย หรือคดีอาชญากรรม
_Avoid_: department, queue

**สถานะ**:
ผลหรือความคืบหน้าเบื้องต้นของคำร้องในระบบสถิติ เช่น รับคำร้องแล้ว พบภาพ ไม่พบภาพ หรือแจ้งผลแล้ว
_Avoid_: approval step, workflow state แบบหลายชั้น

**หลักฐานแนบ**:
ไฟล์เอกสารหรือรูปภาพประกอบคำร้องที่แนบได้ภายหลังแบบ optional เช่น ใบคำร้อง หนังสือราชการ ใบแจ้งความ หรือรูปภาพประกอบ
_Avoid_: CCTV video, public file

**Access Gate**:
ชั้นป้องกันการเข้าถึงขั้นต่ำสำหรับช่วงทดลองบน Vercel public URL โดยใช้ shared password ก่อนเข้าระบบ ไม่ใช่ระบบบัญชีผู้ใช้หรือ role management
_Avoid_: login เต็มระบบ, user management, Vercel team access

**รายงานสถิติ**:
มุมมองสรุปจำนวนคำร้องตามช่วงวันที่และตัวกรอง เช่น หมวดหมู่ ประเภทผู้ขอ และสถานะ เพื่อใช้รายงานผู้บังคับบัญชา
_Avoid_: case dashboard, operational queue

**หน้างาน**:
บริบทการใช้งานจริงนอกโต๊ะทำงานหรือระหว่างรับคำร้อง ที่เจ้าหน้าที่อาจใช้มือถือหรือแท็บเล็ตเพื่อเพิ่มคำร้อง ค้นหาเลขคำร้อง หรือดูสถานะอย่างรวดเร็ว
_Avoid_: desktop-only workflow

**ข้อมูลย้อนหลัง**:
คำร้องจากใบคำร้องกระดาษเดิมหรือข้อมูลเก่าที่ถูกนำเข้าระบบภายหลัง และอาจมีเลขคำร้องที่ต้องคงตามเอกสารเดิม
_Avoid_: new live request

**คำร้องที่ควรติดตาม**:
คำร้องที่ยังไม่ถึงสถานะสุดท้าย เช่น ยังไม่แจ้งผล หรืออยู่ในขั้นตรวจสอบนานเกินช่วงวันที่กำหนด ใช้เพื่อช่วยเจ้าหน้าที่เห็นรายการที่ควรกลับไปดูต่อ ไม่ใช่งานค้างแบบ queue หรือระบบมอบหมายงาน
_Avoid_: งานค้าง, task, assignment, SLA บังคับ

**เลขคำร้องโดยประมาณ**:
เลขคำร้องถัดไปที่ระบบแสดงล่วงหน้าตามวันที่รับคำร้อง เพื่อช่วยให้เจ้าหน้าที่คาดการณ์ก่อนบันทึก เลขจริงจะยืนยันเมื่อบันทึกสำเร็จเท่านั้น
_Avoid_: เลขคำร้องจริงก่อนบันทึก, reserved number

**มุมมองด่วน**:
ตัวกรองสำเร็จรูปสำหรับค้นหาคำร้อง เช่น เดือนนี้ ควรติดตาม หรือพบภาพ โดยไม่แทนที่ตัวกรองละเอียดเดิม
_Avoid_: saved report, workflow queue

## Relationships

**คำร้อง** 1 รายการมี **เลขคำร้อง** 1 เลข และอาจมี **หลักฐานแนบ** ได้หลายไฟล์

**คำร้อง** 1 รายการมี **ประเภทผู้ขอ**, **หมวดหมู่**, และ **สถานะ** อย่างละ 1 ค่า

**รายงานสถิติ** สรุปจาก **คำร้อง** หลายรายการ แต่ไม่แทนที่ **ใบคำร้องกระดาษ**

**คำร้องที่ควรติดตาม** เป็นมุมมองจาก **คำร้อง** และ **สถานะ** ไม่ใช่ entity ใหม่

## Flagged Ambiguities

**Login**:
ในเอกสารเดิมหมายถึงไม่ทำระบบบัญชีผู้ใช้ใน version 1 เมื่อ deploy บน Vercel ต้องใช้คำว่า **Access Gate** สำหรับ shared password ขั้นต่ำ และยังถือว่าไม่ได้ทำ login เต็มระบบ

**หลักฐานแนบ**:
หมายถึงไฟล์เอกสารหรือรูปภาพประกอบเท่านั้น ไม่รวมวิดีโอ CCTV

## Example Dialogue

Dev: คำร้องนี้ต้องมีชื่อผู้ขอไหม

Domain expert: ไม่ต้อง ระบบนี้เก็บสถิติ ไม่ใช่ใบคำร้องหลัก ชื่ออยู่ในใบคำร้องกระดาษได้

Dev: หลังบันทึกแล้วเลขคำร้องแก้ได้ไหม

Domain expert: แก้ข้อมูลทั่วไปแล้วเลขไม่ควรเปลี่ยนเอง แต่ต้องมีทางแก้เลขอย่างตั้งใจ เพราะอนาคตจะนำเข้าข้อมูลย้อนหลังจากใบคำร้องกระดาษ

Dev: ถ้าขึ้น Vercel ต้องมี login ไหม

Domain expert: ไม่ทำ login เต็มระบบ แต่ต้องมี Access Gate แบบ shared password เพราะ URL เป็น public

---

## DATA_MODEL.md

# DATA_MODEL.md

# โครงสร้างข้อมูล

## ตารางหลัก
1. `requests`
2. `requester_types`
3. `categories`
4. `statuses`
5. `evidence_types`
6. `request_attachments`

## 1. requests
| Field | Type | Required | Description |
|---|---|---:|---|
| id | integer | yes | Primary key |
| request_no | text | yes | เลขคำร้อง เช่น `C69-0001` |
| request_date | date | yes | วันที่รับคำร้อง |
| fiscal_year | integer | yes | ปีงบประมาณ พ.ศ. |
| sequence_no | integer | yes | ลำดับในปีงบประมาณ |
| requester_type_id | integer | yes | FK ไป requester_types |
| category_id | integer | yes | FK ไป categories |
| status_id | integer | yes | FK ไป statuses |
| location_text | text | no | สถานที่เกิดเหตุ |
| note | text | no | หมายเหตุ |
| deleted_at | datetime | no | วันที่ลบแบบ soft delete |
| created_at | datetime | yes | วันที่สร้าง |
| updated_at | datetime | yes | วันที่แก้ไขล่าสุด |

Constraints:
- `request_no` unique
- `(fiscal_year, sequence_no)` unique

Rule:
- ระบบสร้าง `request_no`, `fiscal_year`, และ `sequence_no` ให้อัตโนมัติเมื่อเพิ่มคำร้องใหม่ตาม flow ปกติ
- ต้องรองรับการแก้ไข `request_no` อย่างตั้งใจสำหรับ correction/backfill
- เมื่อแก้ `request_no` ต้อง validate format `CYY-NNNN` และ unique
- เมื่อแก้ `request_no` ต้องตรวจว่า `YY` ตรงกับปีงบประมาณ พ.ศ. จาก `request_date`
- การแก้ข้อมูลทั่วไปต้องไม่เปลี่ยน `request_no`
- การลบคำร้องใช้ soft delete โดยตั้งค่า `deleted_at`
- รายงานและค้นหาปกติควร exclude รายการที่มี `deleted_at`

## 2. requester_types
| Field | Type | Required |
|---|---|---:|
| id | integer | yes |
| name | text | yes |
| semantic_key | text | no |
| sort_order | integer | yes |
| is_active | boolean | yes |
| created_at | datetime | yes |
| updated_at | datetime | yes |

Rule: `semantic_key` ใช้กับ logic ภายใน เช่น `received`, `checking`, `found`, `not_found`, `notified`, `other` เพื่อให้รายงานและ dashboard ไม่ผูกกับชื่อสถานะภาษาไทยโดยตรง

## 3. categories
| Field | Type | Required |
|---|---|---:|
| id | integer | yes |
| name | text | yes |
| sort_order | integer | yes |
| is_active | boolean | yes |
| created_at | datetime | yes |
| updated_at | datetime | yes |

Rule: หมวดหมู่ที่ถูกใช้งานแล้วไม่ควรลบจริง ให้ปิดใช้งานแทน

## 4. statuses
| Field | Type | Required |
|---|---|---:|
| id | integer | yes |
| name | text | yes |
| sort_order | integer | yes |
| is_active | boolean | yes |
| created_at | datetime | yes |
| updated_at | datetime | yes |

## 5. evidence_types
| Field | Type | Required |
|---|---|---:|
| id | integer | yes |
| name | text | yes |
| sort_order | integer | yes |
| is_active | boolean | yes |
| created_at | datetime | yes |
| updated_at | datetime | yes |

## 6. request_attachments
| Field | Type | Required | Description |
|---|---|---:|---|
| id | integer | yes | Primary key |
| request_id | integer | yes | FK ไป requests |
| evidence_type_id | integer | yes | FK ไป evidence_types |
| original_file_name | text | yes | ชื่อไฟล์เดิม |
| blob_url | text | yes | URL จาก Vercel Blob |
| download_url | text | no | URL สำหรับดาวน์โหลด |
| blob_pathname | text | yes | path ใน Blob store |
| content_type | text | no | MIME type |
| size_bytes | integer | yes | bytes |
| note | text | no | หมายเหตุ |
| uploaded_at | datetime | yes | วันที่อัปโหลด |

## ความสัมพันธ์
```text
requests 1 ---- many request_attachments
evidence_types 1 ---- many request_attachments
categories 1 ---- many requests
requester_types 1 ---- many requests
statuses 1 ---- many requests
```

## Logic การออกเลขคำร้อง
```text
buddhist_year = gregorian_year + 543

if month >= 10:
    fiscal_year = buddhist_year + 1
else:
    fiscal_year = buddhist_year

yy = fiscal_year % 100
sequence_no = max(sequence_no in fiscal_year) + 1
request_no = "C" + yy + "-" + sequence_no padded 4 digits
```

สำหรับข้อมูลย้อนหลังหรือการแก้เลขโดยตรง ระบบควรรับเลข `CYY-NNNN` ที่ผู้ใช้กำหนดเองได้เมื่อไม่ซ้ำ และต้อง reject หาก `YY` ไม่ตรงกับปีงบประมาณที่คำนวณจาก `request_date`

ตัวอย่าง:
| request_date | fiscal_year | sequence | request_no |
|---|---:|---:|---|
| 2026-06-16 | 2569 | 1 | C69-0001 |
| 2026-10-01 | 2570 | 1 | C70-0001 |

---

## DEPLOYMENT.md

# DEPLOYMENT.md

# แนวทางติดตั้งระบบ

## 1. สภาพแวดล้อมที่เหมาะสม
ระบบนี้เหมาะกับ:
1. Vercel trial deployment ผ่าน GitHub repo
2. Neon PostgreSQL สำหรับฐานข้อมูล
3. Vercel Blob Private Storage สำหรับไฟล์แนบ
4. อนาคตสามารถย้ายไป internal hosting ได้ หากต้องการควบคุมระบบเอง

## 2. Stack แนะนำ
| Layer | Recommendation |
|---|---|
| Frontend | Next.js / React |
| Backend | Next.js Route Handlers / Server Actions |
| Database | Neon PostgreSQL |
| File storage | Vercel Blob Private Storage |
| Excel Export | xlsx library |
| PDF Export | pdfmake / jsPDF / server-side PDF |
| Hosting | Vercel |

## 3. Environment Variables
ตัวอย่าง `.env.local`
```env
DATABASE_URL="..."
BLOB_READ_WRITE_TOKEN="..."
APP_PASSWORD="..."
SESSION_SECRET="..."
MAX_UPLOAD_BYTES=4194304
MAX_UPLOAD_FILES=5
E2E_FIXTURES_ENABLED=0
REPORT_ORGANIZATION_NAME="กลุ่มงานสถิติข้อมูลและสารสนเทศ"
FOLLOW_UP_DAYS=7
```

ห้าม commit ค่า secret จริง เช่น `DATABASE_URL`, `BLOB_READ_WRITE_TOKEN`, หรือ `APP_PASSWORD`

Environment ที่จำเป็นบน Vercel production:
| Variable | Required | Notes |
|---|---:|---|
| `DATABASE_URL` | Yes | Neon PostgreSQL connection string |
| `APP_PASSWORD` | Yes | shared password สำหรับ login ทดลอง |
| `SESSION_SECRET` | Yes | ใช้ sign session cookie; ควรแยกจาก `APP_PASSWORD` |
| `BLOB_READ_WRITE_TOKEN` | Yes | token จาก Vercel Blob private store |
| `REPORT_ORGANIZATION_NAME` | Yes | ชื่อหน่วยงานในรายงาน |
| `FOLLOW_UP_DAYS` | No | default 7 |
| `MAX_UPLOAD_BYTES` | No | default 4194304 bytes |
| `MAX_UPLOAD_FILES` | No | default 5 files per upload action |
| `PERF_DB_PROBE` | No | ตั้งเป็น `1` เฉพาะตอน diagnostic เพื่อ log `SELECT 1` และ active request count; ไม่ควรเปิดค้างถ้าไม่ต้องวัด |
| `E2E_FIXTURES_ENABLED` | No | ตั้งเป็น `1` เฉพาะ staging/preview ที่ใช้ automated E2E; จะ seed คำร้อง `C69-0003` พร้อม fixture attachment `test-private.pdf` ถ้ายังไม่มีไฟล์แนบ |

ห้ามเปิด `E2E_FIXTURES_ENABLED=1` ใน production จริง เพราะ flag นี้มีไว้สร้างข้อมูลทดสอบสำหรับ automation เท่านั้น

เมื่อต้อง reset fixture สำหรับ automated test ให้ login ผ่าน access gate แล้วเรียก:
```text
POST /api/test-fixtures/e2e
```
endpoint นี้ทำงานเฉพาะเมื่อ `E2E_FIXTURES_ENABLED=1` และใช้เพื่อเตรียมคำร้อง `C69-0003` พร้อมไฟล์ `test-private.pdf` ก่อนรัน view/download/delete tests

## 4. Folder Structure
```text
cctv-request-statistics/
  src/
    app/
    components/
    lib/
  docs/
  package.json
  .env.example
```

## 5. Local Run
ตัวอย่างคำสั่ง:
```bash
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

เปิดใช้งาน:
```text
http://localhost:3000
```

## 6. Internal Server Run
ยังไม่ใช่เป้าหมายหลักของช่วงทดลอง

```bash
npm install
npm run build
npm run start
```

## 7. GitHub and Vercel Deployment Order

ต้องสร้าง GitHub repository ก่อนสร้าง Vercel project

GitHub repository:
```text
https://github.com/poppatompong-dev/CCTVstat.git
```

```text
สร้าง source code
-> init git
-> สร้าง GitHub repository
-> push code ไป GitHub
-> สร้างหรือ import project ใน Vercel จาก GitHub repo
-> ตั้งค่า Environment Variables บน Vercel
-> สร้าง Vercel Blob store ใน project
-> ตรวจว่า `BLOB_READ_WRITE_TOKEN` ถูกเพิ่มใน env
-> deploy preview
-> ทดสอบ shared password, Neon, Blob upload/download, report/export
```

เหตุผล:
- Vercel workflow เหมาะกับการ import จาก GitHub repo
- Vercel Blob token จะผูกกับ Vercel project/env
- การ deploy preview และ production จะตาม branch/repo ได้ชัดเจน

## 8. Vercel Blob Token

หลังสร้าง Vercel project แล้ว:
1. เข้า Vercel project
2. ไปที่ Storage
3. Create Database
4. เลือก Blob
5. เลือก Private access
6. เลือก environment ที่ต้องการ
7. Vercel จะสร้าง `BLOB_READ_WRITE_TOKEN` ให้ project

สำหรับ local development ใช้:
```bash
vercel env pull
```

## 9. Backup
สำรองอย่างน้อย:
| รายการ | Path ตัวอย่าง |
|---|---|
| Database | Neon backup/export |
| Upload metadata | `request_attachments` table |
| Upload files | Vercel Blob store |
| Config | Vercel env vars / `.env.local` |

## 10. Restore
1. Restore Neon data
2. ตรวจ Vercel Blob objects
3. ตรวจ env vars
4. Deploy app ใหม่จาก GitHub repo
5. ทดสอบ search/report/download

## 11. Security Notes
- ต้องมี shared password access gate
- ไม่แสดง Blob public URL ใน UI
- ไฟล์แนบดาวน์โหลดผ่าน endpoint ของระบบ
- ห้าม commit secret
- สำรองข้อมูลสม่ำเสมอ
- หากมีผู้ใช้หลายคนพร้อมกัน ต้องทดสอบการออกเลขซ้ำ

---

## PRODUCT_DESCRIPTION.md

# CCTVStat Product Description / PRD

CCTVStat is an internal web application for municipal staff to record and analyze statistics for CCTV footage viewing requests. The official request process still relies on paper forms; this system helps staff create a short reference number, categorize each request, optionally attach supporting documents, and generate reports.

## Target Users

Primary users are municipal officers who receive, record, search, update, and report CCTV viewing requests. The app is designed for quick use on desktop, tablet, and mobile devices.

## Core User Flows

### 1. Login

Users access the system through a shared password gate. Unauthenticated users are redirected to the login page. After entering the correct shared password, users are taken to the dashboard.

### 2. Dashboard

The dashboard shows summary metrics such as total requests, requests this month, requests with attachments, latest request number, and requests that should be followed up. Users can navigate to add a new request, view reports, or open request lists.

### 3. Create Request

Users create a new CCTV request by entering only the required statistical fields:

- request date
- requester type
- category
- status

Optional fields include location and notes. The system previews the next likely request number, but the real request number is confirmed only after saving. Request numbers follow the Thai fiscal year format, such as `C69-0001`.

The main request form should render before non-critical assistive data is ready. Smart defaults and location autocomplete load after the form is visible so staff can start working immediately, especially on Vercel/Neon cold starts.

### 4. Search, Filter, and Edit Requests

Users can search by request number or location and filter by date range, requester type, category, status, or quick views such as this month, follow-up, and found footage. Users can edit request details, intentionally correct request numbers for backfill/correction cases, and soft-delete records.

### 5. Attachments

After a request is created, users can optionally upload supporting evidence such as request forms, police reports, official letters, images, or Word/PDF documents. Users can select multiple files per upload action, preview selected files, and review uploaded files in a thumbnail/gallery layout. Attachments are stored privately and downloaded through the application.

### 6. Master Data Management

Users can manage requester types, categories, statuses, and evidence types. Items can be added, renamed, reordered, activated, or deactivated. Inactive items remain readable for historical records.

### 7. Reports and Exports

Users can generate reports by date range and filters. Reports include totals, category breakdowns, requester type breakdowns, status breakdowns, monthly trends, found-rate insights, detailed request tables, Excel export, print-to-PDF view, and backup export.

The reports page should provide immediate shell/loading feedback while aggregate queries are running, instead of keeping the previous screen visually frozen.

## Important Product Rules

- The app is a statistics and record-keeping tool, not a full case-management system.
- The paper request form remains the official document.
- Request numbers must not be reused, even after soft deletion.
- Request number correction is allowed only when intentional and valid.
- The `CYY-NNNN` prefix must match the Thai fiscal year derived from the request date.
- File attachment is optional and must not block quick request recording.
- The app should avoid collecting unnecessary personal information.
- Smart features must remain assistive and non-blocking.

## Key Test Scenarios

- Unauthenticated access redirects to login.
- Correct password allows login.
- Incorrect password shows an error.
- Dashboard loads after login.
- Creating a request generates the correct fiscal-year request number.
- Editing general request data does not automatically change the request number.
- Invalid request number formats are rejected.
- Request numbers with mismatched fiscal years are rejected.
- Duplicate request numbers are rejected.
- Soft-deleted requests are hidden from normal lists and reports.
- Master data save returns users to the correct settings page.
- Attachments can be uploaded, listed, downloaded, and deleted when Blob credentials are configured.
- Multiple attachments can be uploaded in one action, with file count and per-file size limits.
- Image attachments show thumbnails, and document attachments show clear file-type cards.
- Save, upload, delete, and confirmation flows provide visible modal/pending feedback.
- Reports and exports respect filters.
- Quick filters show the expected request subsets.
- Local development login works on `127.0.0.1:3001`.
- Request creation and reports show fast shell/loading feedback before slower assistive or aggregate data finishes loading.

## Current Status

The MVP application code is complete for local testing. Lint and production build pass. Local dashboard, request list, request creation page, reports, performance instrumentation, perceived-performance loading states, and attachment UX have been verified at build/smoke-test level. Remaining work before real trial usage is deployment/runtime validation on Vercel with real environment variables, Neon PostgreSQL, and Vercel Blob.

---

## PROGRESSIVE.md

# PROGRESSIVE.md

# Checklist แผนพัฒนาแบบไล่ระดับ

เอกสารนี้ใช้ดูสถานะงานของ CCTVStat แบบไล่ระดับว่าอะไรทำแล้ว อะไรยังเหลือ และเหลือประมาณไหน โดยแยก **งานที่เสร็จในโค้ดแล้ว** ออกจาก **งานที่ต้องยืนยันบน runtime จริง** เช่น Vercel, Neon และ Vercel Blob

## สถานะรวมล่าสุด

| หมวด | สถานะ | หมายเหตุ |
|---|---|---|
| Product decisions | เสร็จแล้ว | scope, stack, access gate, soft delete, backfill validation ตกลงแล้ว |
| MVP application code | เสร็จแล้ว | build/lint ผ่าน แก้ master settings redirect แล้ว และ push ขึ้น GitHub แล้ว |
| Smart Enhancements A | เสร็จแล้ว | dashboard actionable, next-number preview, smart defaults, report insights, quick filters |
| Documentation sync | เสร็จแล้ว | รวมถึง `SEED_DATA.md`/`ALL_DOCS.md` ที่ sync `statuses.semantic_key` แล้ว |
| Local verification | เสร็จแล้ว | `npm run lint`, `npm run build`, local route smoke test ที่ `127.0.0.1:3001` ผ่าน dashboard, requests, reports และ Excel export |
| Trial deployment runtime | เหลือยืนยันหลัง deploy | Vercel env หลักมีรายการที่ต้องตั้งครบแล้ว แต่ยังควรทดสอบ production URL, Neon, Blob และ export หลัง deploy ล่าสุด |
| Smart Enhancements B | เสร็จแล้ว | duplicate hint และ location autocomplete แบบไม่ block |
| Performance optimization | เสร็จแล้วรอบ P1/P2/P3 | เพิ่ม database indexes, ลด dashboard query, aggregate report ด้วย SQL, ลด `GROUP BY` จาก attachment count และปรับ perceived performance ด้วย streaming/loading skeleton |
| E2E staging fixtures | เสร็จแล้วในโค้ด | เพิ่ม `test-private.pdf`, `E2E_FIXTURES_ENABLED=1`, tombstone หลังลบ และ `POST /api/test-fixtures/e2e` สำหรับ reset fixture ใน staging เท่านั้น |

ภาพรวมโดยประมาณ:
- งานพัฒนาใน repo: **100% สำหรับ MVP trial scope ปัจจุบัน**
- งานที่เหลือเพื่อใช้งานทดลองจริง: **เป็นงาน runtime/deployment ภายนอก repo หลัง deploy ล่าสุด**
- งานต่อยอด smart รอบถัดไป: แยกเป็น phase ใหม่ ไม่บล็อก MVP trial

หมายเหตุสถานะ:
- checkbox ที่ยังว่างในเอกสารนี้คือการทดสอบกับ environment จริง เช่น Vercel, Neon และ Vercel Blob หรือ future requirement ที่ยังไม่อยู่ใน version 1
- ไม่พบงาน code/docs ใน local repo ที่ค้างสำหรับ MVP trial หลังรอบ performance optimization, attachment UX และ documentation sync ล่าสุด

## [x] Slice 0: Decision Lock

เป้าหมาย:
- [x] ยืนยัน stack สำหรับช่วงทดลอง
- [x] ยืนยันวิธีป้องกัน public URL
- [x] ยืนยันวิธีเก็บไฟล์แนบบน cloud
- [x] ยืนยันนโยบายลบคำร้อง
- [x] ยืนยันการแก้เลขคำร้องสำหรับ correction/backfill

ข้อสรุป:
- [x] Hosting: Vercel
- [x] Database: Neon PostgreSQL
- [x] File storage: Vercel Blob Private Storage
- [x] Access control: shared password access gate ผ่าน `APP_PASSWORD` และ session cookie
- [x] Full login / roles: ยังไม่ทำใน version 1
- [x] Delete policy: soft delete และไม่ reuse เลขคำร้อง
- [x] Backfill validation: reject หาก `CYY` ไม่ตรงปีงบประมาณจาก `request_date`

เหลือ:
- [x] ไม่มี owner decision ที่บล็อก implementation แล้ว

## [x] Slice 1: Project Skeleton

เป้าหมาย:
- [x] สร้าง Next.js + TypeScript project
- [x] ตั้งค่า Tailwind/CSS theme ภาษาไทย
- [x] เตรียม app shell สำหรับ dashboard, form, list, report, settings
- [x] ตั้งค่า environment variable template
- [x] เตรียม connection ไป Neon แบบ lazy initialization
- [x] เพิ่ม shared password access gate
- [x] ใช้ `src/proxy.ts` สำหรับ optimistic redirect ตาม Next.js 16
- [x] เพิ่ม `allowedDevOrigins` สำหรับ `127.0.0.1` เพื่อให้ HMR/dev resources ไม่ถูก block ตอนทดสอบ local

หลักฐาน:
- [x] `npm run build` ผ่าน
- [x] `npm run lint` ผ่าน
- [x] push ขึ้น GitHub แล้ว
- [x] local dev server เปิดที่ `http://127.0.0.1:3001/login` และหน้า login ตอบ `200 OK`
- [x] หน้า `/` redirect ไป `/login` เมื่อยังไม่มี session
- [x] ทดสอบ login ด้วย Chrome headless แล้วเข้า dashboard ได้ ไม่มี 500 response, console error หรือ page error

เหลือ:
- [ ] ตรวจบน Vercel preview หลัง env พร้อม (external runtime)

## [x] Slice 2: Database Foundation

เป้าหมาย:
- [x] สร้าง PostgreSQL schema อัตโนมัติผ่าน `ensureSchema`
- [x] สร้างตาราง `requester_types`
- [x] สร้างตาราง `categories`
- [x] สร้างตาราง `statuses`
- [x] สร้างตาราง `evidence_types`
- [x] สร้างตาราง `requests`
- [x] สร้างตาราง `request_attachments`
- [x] เพิ่ม unique constraint สำหรับ `request_no`
- [x] เพิ่ม unique constraint สำหรับ `(fiscal_year, sequence_no)`
- [x] เพิ่ม `statuses.semantic_key` สำหรับ logic smart ที่ไม่ผูกกับชื่อภาษาไทย
- [x] ปรับ seed data ให้ตรง `SEED_DATA.md`
- [x] ปรับ `SEED_DATA.md` และ `ALL_DOCS.md` ให้ระบุ `semantic_key` ตรงกับ runtime schema
- [x] เพิ่ม schema initialization lock เพื่อกัน cold-start race เมื่อหลาย query เรียก `ensureSchema()` พร้อมกัน
- [x] ปิดใช้งาน seed เก่าที่เลิกใช้ เช่น `ยกเลิก`, `คดีอาชญากรรม`, `เหตุเดือดร้อนรำคาญ`
- [x] เพิ่ม index สำหรับ query หลัก: active request date, created date, fiscal sequence, requester type, category, status, category/date และ attachment request id

เหลือ:
- [ ] ทดสอบ schema creation กับ Neon production จริง (external runtime)
- [ ] ยืนยันว่าข้อมูลเดิมใน Neon ถ้ามี ไม่ถูกกระทบจาก reseed (external runtime/data)

## [x] Slice 3: Add Request Flow

เป้าหมาย:
- [x] เพิ่มคำร้องใหม่ด้วย field บังคับ 4 ช่อง
- [x] วันที่ default เป็นวันนี้
- [x] ออกเลข `CYY-NNNN`
- [x] แสดงเลขคำร้องเด่นหลังบันทึก
- [x] รองรับ copy เลขคำร้อง
- [x] บันทึกโดยไม่แนบไฟล์ได้
- [x] วางโครงให้แก้เลขคำร้องได้ภายหลังสำหรับ correction/backfill
- [x] เพิ่มเลขคำร้องโดยประมาณก่อนบันทึก
- [x] เพิ่ม smart defaults จากข้อมูลที่ใช้บ่อยจริง
- [x] เปลี่ยนหมวดหมู่จาก dropdown เป็น tile picker พร้อมไอคอนและ radio semantics
- [x] เพิ่ม CSS micro-animations สำหรับ selected state, เลขคำร้อง, success state, alerts และ data tiles พร้อม reduced-motion guard

เกณฑ์ผ่าน:
- [x] field บังคับไม่เกิน 4 field
- [x] วันที่ 2026-06-16 อยู่ปีงบ 2569 และใช้ prefix `C69`
- [x] วันที่ 2026-10-01 อยู่ปีงบ 2570 และใช้ prefix `C70`
- [x] เลขคำร้องจริงยืนยันเมื่อบันทึก ไม่ถือว่า preview เป็นเลขจอง

เหลือ:
- [ ] ทดสอบเพิ่มคำร้องจริงบน Vercel + Neon (external runtime)
- [ ] จับเวลาหน้างานจริงว่าไม่แนบไฟล์ใช้ไม่เกิน 30 วินาที (field/user test)

## [x] Slice 4: Search, Edit, and Delete Policy

เป้าหมาย:
- [x] ค้นหาด้วยเลขคำร้อง/สถานที่
- [x] filter ตามช่วงวันที่
- [x] filter ตามประเภทผู้ขอ
- [x] filter ตามหมวดหมู่
- [x] filter ตามสถานะ
- [x] แก้ไขข้อมูลทั่วไปโดยเลขคำร้องเดิมไม่เปลี่ยนเอง
- [x] แก้ไขเลขคำร้องโดยตรงได้เมื่อ format ถูกและไม่ซ้ำ
- [x] reject เลขคำร้องที่ปีงบไม่ตรงกับวันที่รับคำร้อง
- [x] soft delete คำร้อง
- [x] รายงานและค้นหาปกติซ่อน soft-deleted records
- [x] เพิ่ม quick filters: ทั้งหมด, เดือนนี้, ควรติดตาม, พบภาพ

เหลือ:
- [x] เพิ่ม confirmation dialog ฝั่ง client ให้การลบคำร้องชัดขึ้น
- [x] ปรับ error mapping กรณีเลขซ้ำให้แยก `request_no` กับ `(fiscal_year, sequence_no)` ชัดขึ้น

## [x] Slice 5: Master Data

เป้าหมาย:
- [x] จัดการหมวดหมู่
- [x] จัดการประเภทหลักฐาน
- [x] เพิ่มรายการใหม่
- [x] แก้ไขชื่อ
- [x] เรียงลำดับ
- [x] เปิด/ปิดใช้งาน
- [x] รายการ inactive ไม่แสดงในฟอร์มใหม่ถ้าไม่ได้เป็นค่าของข้อมูลเดิม

เหลือ:
- [x] เพิ่มหน้าจัดการ requester types และ statuses
- [x] แสดง `semantic_key` เป็น chip อ่านอย่างเดียว ไม่เปิดให้แก้จาก UI ระหว่างทดสอบ
- [x] แก้ redirect หลังบันทึก requester types/statuses ให้กลับหน้าจัดการที่ถูกต้อง

## [x] Slice 6: Attachments

เป้าหมาย:
- [x] แนบไฟล์หลักฐานภายหลังได้
- [x] Upload ไป Vercel Blob Private Storage
- [x] เก็บ metadata ใน Neon
- [x] List/download/delete attachment
- [x] Upload หลายไฟล์ต่อครั้ง โดยยังจำกัดขนาดรายไฟล์และจำนวนไฟล์ต่อครั้ง
- [x] แสดง preview ก่อนอัปโหลด และ thumbnail/gallery หลังอัปโหลด
- [x] แสดง modal สถานะระหว่าง upload/delete เพื่อให้ผู้ใช้รู้ว่าระบบกำลังทำงาน
- [x] ตรวจ extension
- [x] block `.exe`, `.bat`, `.cmd`, `.js`, `.sh`, `.php`, `.html`
- [x] ไม่ rename ไฟล์แนบเดิมเมื่อแก้เลขคำร้อง

ไฟล์ที่รองรับ:
- [x] `.pdf`
- [x] `.jpg`
- [x] `.jpeg`
- [x] `.png`
- [x] `.doc`
- [x] `.docx`

เหลือ:
- [ ] ทดสอบ upload/download/delete กับ Vercel Blob token จริง (external runtime)
- [x] เพิ่มขนาดไฟล์สูงสุดที่ชัดเจนใน env/spec/runtime
- [x] เพิ่มจำนวนไฟล์สูงสุดต่อครั้งผ่าน `MAX_UPLOAD_FILES`
- [x] เพิ่ม confirmation dialog ฝั่ง client ก่อนลบไฟล์แนบ
- [x] เพิ่ม committed fixture `test-private.pdf` สำหรับ automated upload test
- [x] เพิ่ม staging-only E2E attachment fixture สำหรับคำร้อง `C69-0003` ผ่าน `E2E_FIXTURES_ENABLED=1`
- [x] เพิ่ม tombstone state หลังลบ fixture เพื่อไม่ให้ cold serverless instance seed ไฟล์กลับมาเอง
- [x] เพิ่ม `POST /api/test-fixtures/e2e` สำหรับ reset fixture ก่อนรัน automated E2E รอบใหม่

## [x] Slice 7: Reports and Exports

เป้าหมาย:
- [x] รายงานตามช่วงวันที่
- [x] สรุปจำนวนทั้งหมด
- [x] count by category
- [x] count by requester type
- [x] count by status
- [x] ตารางรายการคำร้อง
- [x] Export Excel
- [x] Print-to-PDF view ภาษาไทย
- [x] Export Backup JSON
- [x] เทียบช่วงก่อนหน้า
- [x] แนวโน้มย้อนหลัง 6 เดือน
- [x] อัตราพบภาพจาก semantic `found` และ `not_found`
- [x] ปรับ summary report ให้ aggregate ด้วย SQL แทนการดึง 1,000 rows มานับใน Node
- [x] ให้ summary totals ใช้ข้อมูลครบตาม filter ส่วนตาราง detail ยังแสดงสูงสุด 1,000 รายการ

เหลือ:
- [ ] ทดสอบ Excel กับข้อมูลจำนวนมากอย่างน้อย 5,000 รายการ (load/performance test)
- [x] ตัดสินใจคง print-to-PDF สำหรับ MVP เพื่อให้ภาษาไทย render จาก browser ได้แน่นอน
- [x] เพิ่มพื้นที่ลงชื่อใน print/PDF view ให้ตรงแบบรายงานราชการมากขึ้น
- [x] เปลี่ยน Backup เป็น Excel หลาย sheet ตาม spec

## [ ] Slice 8: Trial Deployment Runtime (เหลือเฉพาะ external runtime)

เป้าหมาย:
- [x] สร้าง GitHub repository
- [x] push source code ไป GitHub repo
- [x] ให้ Vercel สามารถ build จาก repo ได้
- [x] local build/lint ผ่านหลัง commit ล่าสุด
- [x] local login route ทดสอบได้ที่ port 3001
- [x] ระบุรายการ Vercel Environment Variables ที่ต้องตั้งครบ
- [ ] ยืนยันค่า Vercel Environment Variables บน production หลัง deploy ล่าสุด
- [ ] ตรวจ Vercel preview/prod URL
- [ ] ทดสอบ shared password access gate บน Vercel
- [ ] ทดสอบ Neon connection production
- [ ] ทดสอบสร้างคำร้องจริง
- [ ] ทดสอบแก้เลขคำร้องย้อนหลัง
- [ ] ทดสอบ upload/download/delete กับ Vercel Blob
- [ ] ทดสอบ export Excel
- [ ] ทดสอบ print-to-PDF
- [ ] ทดสอบ backup

Environment ที่ต้องตั้ง:
- [x] `DATABASE_URL`
- [x] `APP_PASSWORD`
- [x] `SESSION_SECRET`
- [x] `BLOB_READ_WRITE_TOKEN`
- [x] `REPORT_ORGANIZATION_NAME`
- [x] `FOLLOW_UP_DAYS` optional, default 7
- [x] `MAX_UPLOAD_BYTES` optional, default 4194304
- [x] `MAX_UPLOAD_FILES` optional, default 5
- [ ] `E2E_FIXTURES_ENABLED=1` เฉพาะ preview/staging ที่ใช้ automated test; production จริงควรเป็น `0` หรือไม่ตั้งค่า

เกณฑ์ผ่าน:
- [ ] URL ทดลองเข้าได้เฉพาะผู้รู้รหัสทดลอง
- [ ] ไม่มี public URL ของไฟล์หลักฐานใน UI
- [ ] เพิ่มคำร้องและออกเลขได้จริง
- [ ] รายงานและ export ใช้งานได้จริง

ข้อจำกัดปัจจุบัน:
- ยังไม่มี `.vercel` project link ใน local workspace
- ยังไม่ควรบันทึก secret จริงลง repo จึงต้องตั้งค่า env ใน Vercel Project Environment Variables หรือดึงผ่านเครื่องมือที่ปลอดภัยเท่านั้น

## [x] Smart Enhancements A

เป้าหมาย:
- [x] A1 Dashboard แบบ actionable
- [x] A2 Live preview เลขคำร้องถัดไป
- [x] A3 Smart defaults บนฟอร์ม
- [x] A4 รายงานเชิงเปรียบเทียบ/แนวโน้ม
- [x] A5 Quick filters / Saved views แบบเบา
- [x] อัปเดตเอกสารคู่กับโค้ด
- [x] ไม่เพิ่ม required field
- [x] ไม่เปลี่ยนระบบเป็น case management

เหลือ:
- [ ] ทดสอบกับข้อมูลจริงบน Vercel/Neon (external runtime)
- [ ] ยืนยันกับผู้ใช้จริงว่าคำว่า **คำร้องที่ควรติดตาม** สื่อสารชัด (user feedback)

## [x] Smart Enhancements B

เป้าหมาย:
- [x] B1 Duplicate hint แบบไม่ block
- [x] B2 Location autocomplete จากสถานที่ที่เคยกรอก

ข้อควรระวัง:
- [x] ห้ามเพิ่ม required field ใหม่
- [x] ห้าม block การบันทึก
- [x] ห้ามทำให้เพิ่มคำร้องเกิน 30 วินาที
- [x] ต้องใช้คำว่า hint/คำแนะนำ ไม่ใช่ error ถ้าเป็น duplicate ที่ไม่แน่นอน

## [x] Performance Optimization P1/P2

เป้าหมาย:
- [x] เพิ่ม database indexes ที่ตรงกับ query หลักของ dashboard, list, report และ attachment lookup
- [x] ลด `getDashboardStats()` จากหลาย query sequential เป็น summary aggregate query และดึง follow-up rows แบบ parallel
- [x] ลดภาระ `listRequests()` โดยนับไฟล์แนบจาก pre-aggregated subquery แทน `LEFT JOIN` แล้ว `GROUP BY` ทุก request row
- [x] ปรับ `getReport()` ให้คำนวณ total, previous total, found rate และ count by category/requester/status ด้วย SQL aggregate
- [x] เพิ่ม lightweight timing logs สำหรับ route/function สำคัญ เช่น dashboard, requests, reports, smart APIs, Excel และ backup
- [x] แก้ cold runtime bottleneck ของ `ensureSchema()` โดยเพิ่ม schema readiness check ก่อนรัน DDL/seed ชุดใหญ่
- [x] ทำ DB round-trip probe ให้เปิดเฉพาะ diagnostic mode ด้วย `PERF_DB_PROBE=1` เพื่อไม่เพิ่ม query บน dashboard ปกติ
- [x] คง business logic เดิม: request numbering, soft delete, auth, Blob privacy และ report filters
- [x] P3 perceived performance: หน้าเพิ่มคำร้องไม่รอ smart defaults/location suggestions ก่อน render ฟอร์มหลัก
- [x] P3 perceived performance: หน้ารายงานแยก filter/results ด้วย Suspense และมี loading skeleton สำหรับ client navigation
- [x] เพิ่ม `/api/requests/form-assist` สำหรับโหลด smart defaults และ location autocomplete หลังฟอร์มหลักแสดงแล้ว

หลักฐาน local:
- [x] `npm.cmd run lint` ผ่าน
- [x] `npm.cmd run build` ผ่าน
- [x] local smoke test ที่ `http://127.0.0.1:3001` ผ่าน route `/`, `/requests`, `/reports`, `/api/reports/excel`
- [x] production local ก่อนแก้: `/` รอบแรกประมาณ 2146ms, `/api/requests/next-number` รอบแรกประมาณ 1766ms เพราะ `ensureSchema()` ใช้ประมาณ 1694-1718ms ใน cold runtime
- [x] production local หลังแก้: `/` รอบแรกประมาณ 324ms, `/api/requests/next-number` รอบแรกประมาณ 102ms และ warm refresh `/` ประมาณ 155ms
- [x] local production หลัง P3: `/requests/new` DOMContentLoaded ประมาณ 76ms, `/reports` ประมาณ 160ms, ไม่มี console error/warning ใน Chrome headless

เหลือ:
- [ ] วัดผลจริงบน Neon production ด้วยข้อมูลจริงหลัง deploy ล่าสุด
- [ ] ทำ load/performance test สำหรับ Excel/backup เมื่อข้อมูล 5,000+ รายการ
- [ ] พิจารณา export แบบ streaming หรือแบ่งหน้า หากข้อมูลจริงเริ่มใหญ่

## [ ] Future Requirements

ยังไม่ทำใน version 1:
- [ ] รับคำร้องออนไลน์จากประชาชน
- [ ] บัญชีผู้ใช้หลาย role
- [ ] Audit log เต็มรูปแบบ
- [ ] Restore UI สำหรับ soft-deleted records
- [ ] อัปโหลดวิดีโอ CCTV
- [ ] Workflow อนุมัติหลายชั้น
- [ ] Notification/email
- [ ] PWA/offline mode
- [ ] Import ข้อมูลย้อนหลังจาก Excel
- [ ] Dashboard ผู้บริหารแยกหน้า

## Remaining Work แบบสั้นที่สุด

งานใน repo:
1. [x] โค้ด MVP trial scope เสร็จ
2. [x] เอกสาร sync กับ implementation ล่าสุด
3. [x] lint/build/local login smoke test ผ่าน
4. [x] commit และ push ขึ้น GitHub แล้ว

ถ้าต้องการให้ MVP ทดลองใช้จริง:
1. [x] ตั้ง env หลักบน Vercel
2. [ ] deploy โค้ด performance optimization และ attachment UX ล่าสุดขึ้น Vercel
3. [ ] เปิด Vercel deployment URL
4. [ ] ทดสอบ login ด้วย shared password
5. [ ] เพิ่มคำร้องจริง 2-3 รายการ
6. [ ] ทดสอบแนบไฟล์จริง
7. [ ] ถ้ารัน automated E2E ให้เปิด `E2E_FIXTURES_ENABLED=1` บน preview/staging แล้วเรียก `POST /api/test-fixtures/e2e` หลัง login เพื่อเตรียม `C69-0003` พร้อมไฟล์แนบ
8. [ ] ทดสอบรายงาน/Excel/PDF/Backup
9. [ ] เก็บ feedback จากผู้ใช้หน้างาน

ถ้าต้องการต่อยอด smart:
1. [x] ทำ duplicate hint
2. [x] ทำ location autocomplete
3. [ ] เพิ่ม import Excel ย้อนหลัง
4. [ ] เพิ่ม dashboard ผู้บริหาร

---

## PROJECT_DECISIONS.md

# PROJECT_DECISIONS.md

# บันทึกการตัดสินใจออกแบบ

## 1. ระบบนี้เป็นระบบเก็บสถิติ ไม่ใช่ระบบบริหารเคส
เหตุผล:
- ความต้องการหลักคือรายงานสถิติ
- ถ้าระบบใหญ่เกินไป เจ้าหน้าที่อาจไม่ยอมใช้
- กระบวนการเดิมมีใบคำร้องกระดาษรองรับอยู่แล้ว

## 2. ใช้ใบคำร้องกระดาษต่อไป
| ใบคำร้องกระดาษ | Web App |
|---|---|
| เอกสารหลัก | ฐานข้อมูลสถิติ |
| มีลายเซ็น/รายละเอียด | ออกเลขและจัดหมวดหมู่ |
| เก็บในแฟ้ม | ค้นหาและรายงาน |

## 3. เลขคำร้องต้องสั้น
เลือกใช้ `C69-0001` เพราะ:
- เขียนบนหัวใบคำร้องง่าย
- ค้นหาในระบบง่าย
- สั้นกว่ารูปแบบเต็ม เช่น `CCTV-2569-0001`

ต้องแก้ไขเลขคำร้องได้อย่างตั้งใจสำหรับกรณี correction/backfill เพราะอาจมีการนำเข้าข้อมูลย้อนหลังจากใบคำร้องกระดาษเดิม

## 4. นับตามปีงบประมาณ
เหมาะกับงานราชการและรายงานผู้บังคับบัญชา

## 5. ไม่ทำ login เต็มระบบใน version 1 แต่มี access gate เมื่อ deploy บน Vercel
เหตุผล:
- ลดความยุ่งยาก
- ต้องการ MVP ที่ใช้งานได้เร็ว
- ช่วงทดลอง deploy บน Vercel ซึ่งเป็น public URL จึงต้องมี shared password access gate ขั้นต่ำ

ข้อจำกัด:
- shared password ไม่ใช่ระบบ user/role management
- ไม่เหมาะกับ production ที่มีผู้ใช้หลายกลุ่มหรือข้อมูลอ่อนไหวมากขึ้น
- หากเปิดใช้งานจริงระยะยาวควรพิจารณา authentication เต็มระบบ

## 6. แนบหลักฐานได้ แต่ต้อง optional
เหตุผล:
- บางกรณีต้องอ้างอิงใบคำร้องหรือหนังสือราชการ
- แต่ถ้าบังคับแนบทุกครั้งจะเพิ่มภาระงาน
- Flow ที่เหมาะสมคือ บันทึกก่อน แนบทีหลัง

## 7. ไม่อัปโหลดวิดีโอ CCTV ใน version 1
เหตุผล:
- ไฟล์ใหญ่
- เสี่ยงข้อมูลส่วนบุคคล
- เกินขอบเขตของระบบสถิติ

## 8. ลบคำร้องด้วย soft delete
เหตุผล:
- ต้องรักษาประวัติเลขคำร้องและการนำเข้าข้อมูลย้อนหลัง
- ป้องกันการ reuse เลขคำร้องที่เคยออกแล้ว
- รายงานปกติไม่ควรนับรายการที่ถูกลบ แต่ backup ต้องยังตรวจสอบได้
- MVP ยังไม่ต้องมีหน้า audit/restore สำหรับรายการที่ถูกลบ เพื่อลดความรกของ UI

## 9. ไม่ยอมให้เลขคำร้องข้ามปีงบประมาณของวันที่คำร้อง
เหตุผล:
- `CYY` คือปีงบประมาณ พ.ศ. แบบสองหลัก
- หากเลขคำร้องกับวันที่อยู่คนละปีงบประมาณ รายงานและการนำเข้าข้อมูลย้อนหลังจะคลาดเคลื่อน
- ระบบต้องแจ้งเตือนและไม่บันทึกจนกว่าเลขคำร้องกับวันที่รับคำร้องจะสอดคล้องกัน

---

## PROMPT.md

# PROMPT.md

You are an expert full-stack developer. Build a small internal web application for a municipality CCTV team.

## Project
CCTV Request Statistics System

## Objective
Build a very simple internal web app for recording statistical categories of CCTV footage viewing requests. The paper request form remains the official document. The app only helps staff generate a short reference number, select categories/statuses, optionally attach evidence, and produce reports.

## Core Principle
> Keep the system extremely simple. Do not create unnecessary workload for staff.

## Recommended Stack
- Frontend: Next.js App Router / React
- Language: TypeScript
- Styling: CSS theme for Thai municipal dashboard UI
- Database: Neon PostgreSQL via `@neondatabase/serverless`
- File storage: Vercel Blob Private Storage
- Export: Excel and PDF
- Authentication: shared password access gate for trial deployment
- Deployment: Vercel via GitHub

## Main Pages
1. Add New Request
2. Search / Edit Request
3. Statistics Report
4. Manage Categories
5. Manage Evidence Types

## Request Number Format
Generate automatically on first save.

```text
CYY-NNNN
```

Examples:
```text
C69-0001
C69-0002
C70-0001
```

Rules:
- `C` means CCTV.
- `YY` is the last two digits of Thai Buddhist fiscal year.
- `NNNN` is a 4-digit running number.
- Reset running number every fiscal year.
- Thai fiscal year: Oct 1 - Sep 30.
- 2026-06-16 = Buddhist year 2569 = fiscal year 2569 = `C69-0001`
- 2026-10-01 = fiscal year 2570 = `C70-0001`

After save, show:
```text
บันทึกสำเร็จ
เลขคำร้อง: C69-0001
กรุณาเขียนเลขนี้ที่หัวใบคำร้อง
```

## Add Request Fields
Required:
- Request date, default today, editable
- Requester type, dropdown
- Category, dropdown
- Status, dropdown

Optional:
- Location text
- Note

Do not require:
- requester name
- citizen ID
- phone
- address
- CCTV video file

## Evidence Attachment
File upload is optional and must never block quick request recording. Staff can save a request first, get the reference number, and upload evidence later.

Attachments:
- support PDF, JPG, JPEG, PNG, DOC, DOCX
- do not support CCTV video upload in version 1
- store files in Vercel Blob private storage
- store metadata in Neon PostgreSQL
- download through authenticated application endpoints, not direct public Blob URLs
- support multiple files per upload action, controlled by `MAX_UPLOAD_FILES`
- limit per-file size with `MAX_UPLOAD_BYTES`
- show selected-file preview before upload
- show uploaded-file thumbnail/gallery after upload
- show modal/pending feedback for upload and delete actions

Supported evidence types:
1. ใบคำร้อง
2. หนังสือราชการ
3. ใบแจ้งความ
4. เอกสารส่งมอบ
5. รูปภาพประกอบ
6. อื่น ๆ

Allowed files:
- PDF
- JPG / JPEG
- PNG
- DOC / DOCX

Blocked files:
- EXE, BAT, CMD, JS, SH, PHP, HTML

Video upload is not required in version 1.

## Seed Data
Requester types:
1. ประชาชน
2. เจ้าหน้าที่เทศบาล
3. ตำรวจ
4. หน่วยงานรัฐ
5. อื่น ๆ

Categories:
1. อุบัติเหตุจราจร
2. ทรัพย์สินสูญหาย
3. เหตุเกี่ยวกับคดี/อาชญากรรม
4. ตรวจสอบการจราจร
5. เหตุความสงบเรียบร้อย
6. หน่วยงานรัฐ/ตำรวจขอข้อมูล
7. งานภายในเทศบาล
8. อื่น ๆ

Statuses:
1. รับคำร้องแล้ว
2. กำลังตรวจสอบภาพ
3. พบภาพ
4. ไม่พบภาพ
5. แจ้งผลแล้ว
6. อื่น ๆ

## Reports
Allow custom date range and filters:
- start date
- end date
- requester type
- category
- status

Show:
- total requests
- count by category
- count by requester type
- count by status
- request record table

Export:
- Excel filtered records
- PDF summary report
- Excel full backup

## UX Requirements
- Thai UI
- large buttons
- short form
- dropdowns where possible
- one-page add form
- no multi-step required form
- generated request number must be highly visible
- upload must be optional

## Deliverables
- working source code
- database schema
- seed data
- upload feature
- report/export feature
- setup/run instructions
- Thai UI

---

## README.md

# CCTV Request Statistics System

## ภาพรวม
**ระบบบันทึกสถิติหมวดหมู่การขอดูภาพจากกล้องวงจรปิด** เป็น Web App ภายในสำหรับเจ้าหน้าที่เทศบาล ใช้คู่กับใบคำร้องกระดาษเดิม ไม่ใช่ระบบรับคำร้องออนไลน์จากประชาชน

## เป้าหมาย
1. ออกเลขอ้างอิงคำร้องแบบสั้น เช่น `C69-0001`
2. บันทึกประเภทผู้ขอ หมวดหมู่ และสถานะ
3. แนบหลักฐาน เช่น ใบคำร้อง หนังสือราชการ ใบแจ้งความ หรือเอกสารอื่น ๆ แบบไม่บังคับ
4. ออกรายงานสถิติตามช่วงวันที่ที่ต้องการ
5. Export Excel / PDF / Backup

## หลักการออกแบบ
> บันทึกให้เร็วที่สุด ไม่เพิ่มภาระเจ้าหน้าที่ และเก็บข้อมูลเฉพาะที่จำเป็นต่อสถิติ

ระบบต้องเน้นความรวดเร็ว ใช้งานง่าย มีประสิทธิภาพ ออกรายงานได้หลายมิติ ถูกต้อง และมีหน้าตาที่สวยงามเหมาะกับงานภายในเทศบาล
ต้องใช้งานบนมือถือหรือแท็บเล็ตได้สะดวกสำหรับเจ้าหน้าที่หน้างาน โดยเฉพาะการเพิ่มคำร้อง ค้นหาเลขคำร้อง และดูสถานะเบื้องต้น

## เมนูหลัก
| เมนู | หน้าที่ |
|---|---|
| เพิ่มคำร้องใหม่ | บันทึกข้อมูลสั้น ๆ และออกเลขคำร้อง |
| ค้นหา / แก้ไขคำร้อง | ค้นหา แก้ไข ลบรายการที่กรอกผิด |
| รายงานสถิติ | สรุปตามช่วงวันที่และ export |
| จัดการหมวดหมู่ | เพิ่ม/แก้ไข/ปิดใช้งานหมวดหมู่ |
| จัดการประเภทหลักฐาน | เพิ่ม/แก้ไข/ปิดใช้งานประเภทหลักฐาน |

## รูปแบบเลขคำร้อง
```text
CYY-NNNN
```
ตัวอย่าง `C69-0001`

| ส่วน | ความหมาย |
|---|---|
| C | CCTV |
| YY | ปีงบประมาณ พ.ศ. แบบสองหลัก |
| NNNN | ลำดับ 4 หลักในปีงบประมาณ |

ปีงบประมาณเริ่ม 1 ตุลาคม และสิ้นสุด 30 กันยายน

## เอกสารในชุดนี้
| ไฟล์ | รายละเอียด |
|---|---|
| `PROMPT.md` | Prompt หลักสำหรับ AI Agent |
| `REQUIREMENTS.md` | ข้อกำหนดระบบ |
| `DATA_MODEL.md` | โครงสร้างฐานข้อมูล |
| `UI_SPEC.md` | รายละเอียดหน้าจอ |
| `ATTACHMENT_SPEC.md` | ข้อกำหนดการแนบหลักฐาน |
| `REPORT_SPEC.md` | ข้อกำหนดรายงาน |
| `API_SPEC.md` | แนวทาง API |
| `SEED_DATA.md` | ข้อมูลเริ่มต้น |
| `SECURITY_PRIVACY.md` | ความปลอดภัยและข้อมูลส่วนบุคคล |
| `DEPLOYMENT.md` | แนวทางติดตั้ง |
| `TEST_PLAN.md` | แผนทดสอบ |
| `ACCEPTANCE_CRITERIA.md` | เกณฑ์รับมอบ |
| `AGENT_TASKS.md` | รายการงานให้ AI Agent |
| `PROJECT_DECISIONS.md` | เหตุผลการตัดสินใจออกแบบ |
| `PROGRESSIVE.md` | แผนพัฒนาแบบไล่ระดับสำหรับ cloud trial |
| `ROADMAP.md` | ลำดับงาน implementation และ future-ready plan |
| `WORKFLOW.md` | workflow การใช้งานและการทำงานของระบบ |
| `CONTEXT.md` | glossary คำสำคัญของระบบ |
| `docs/adr/` | บันทึก decision สำคัญ |

---

## REPORT_SPEC.md

# REPORT_SPEC.md

# ข้อกำหนดรายงาน

## 1. วัตถุประสงค์
ใช้สรุปสถิติการขอดูภาพจากกล้องวงจรปิดให้ผู้บังคับบัญชา โดยเลือกช่วงเวลาได้ตามต้องการ

## 2. ช่วงเวลาที่รองรับ
| ช่วงเวลา | ตัวอย่าง |
|---|---|
| รายวัน | 16/06/2569 |
| รายเดือน | 01/06/2569 - 30/06/2569 |
| รายไตรมาส | 01/04/2569 - 30/06/2569 |
| รายปีงบประมาณ | 01/10/2568 - 30/09/2569 |
| รายปีปฏิทิน | 01/01/2569 - 31/12/2569 |
| กำหนดเอง | ผู้ใช้เลือกเอง |

## 3. ตัวกรอง
| ตัวกรอง | จำเป็น | ค่าเริ่มต้น |
|---|---:|---|
| วันที่เริ่มต้น | ใช่ | วันแรกของเดือน |
| วันที่สิ้นสุด | ใช่ | วันนี้ |
| ประเภทผู้ขอ | ไม่ | ทั้งหมด |
| หมวดหมู่ | ไม่ | ทั้งหมด |
| สถานะ | ไม่ | ทั้งหมด |

## 4. รายงานที่ต้องแสดง
หน้ารายงานควรแสดง shell/loading skeleton ก่อนหาก query aggregate ยังไม่เสร็จ เพื่อให้ผู้ใช้รู้ว่าระบบตอบสนองแล้วและลดความรู้สึกว่าหน้าค้าง

### 4.1 จำนวนคำร้องทั้งหมด
```text
จำนวนคำร้องทั้งหมด: 25 รายการ
```

### 4.2 สรุปตามหมวดหมู่
| หมวดหมู่ | จำนวน |
|---|---:|
| อุบัติเหตุจราจร | 12 |
| ทรัพย์สินสูญหาย | 5 |

### 4.3 สรุปตามประเภทผู้ขอ
| ประเภทผู้ขอ | จำนวน |
|---|---:|
| ประชาชน | 18 |
| ตำรวจ | 4 |

### 4.4 สรุปตามสถานะ
| สถานะ | จำนวน |
|---|---:|
| รับคำร้องแล้ว | 5 |
| พบภาพ | 10 |
| ไม่พบภาพ | 4 |

### 4.5 ตารางรายการคำร้อง
| เลขคำร้อง | วันที่ | ประเภทผู้ขอ | หมวดหมู่ | สถานะ | สถานที่ | ไฟล์แนบ |
|---|---|---|---|---|---|---:|

### 4.6 Insight เพิ่มเติม
รายงานควรแสดง insight จากข้อมูลเดิม โดยไม่เพิ่ม field ที่ต้องกรอก:

| Insight | วิธีคิด |
|---|---|
| เทียบช่วงก่อนหน้า | นับจำนวนคำร้องในช่วงวันที่ที่เลือก เทียบกับช่วงเวลาก่อนหน้าที่มีจำนวนวันเท่ากัน |
| แนวโน้มย้อนหลัง 6 เดือน | นับคำร้องรายเดือนย้อนหลัง 6 เดือน โดยไม่นับ soft-deleted records |
| อัตราพบภาพ | จำนวนสถานะที่มีความหมาย `found` เทียบกับผลรวม `found` และ `not_found` |

หมายเหตุ: สถานะควรอ้างอิง semantic key ภายใน ไม่ผูกกับชื่อภาษาไทยโดยตรง เพื่อให้แก้ชื่อสถานะในอนาคตได้

## 5. Export Excel
Column:
1. เลขคำร้อง
2. วันที่รับคำร้อง
3. ประเภทผู้ขอ
4. หมวดหมู่
5. สถานะ
6. สถานที่
7. หมายเหตุ
8. จำนวนหลักฐานแนบ
9. วันที่บันทึก
10. วันที่แก้ไขล่าสุด

## 6. Export PDF
รูปแบบควรเป็นตารางราชการ

หัวรายงาน:
```text
รายงานสถิติการขอดูภาพจากกล้องวงจรปิด
เทศบาล..........................
ช่วงวันที่: .... ถึง ....
จัดทำเมื่อ: ....
```

ท้ายรายงาน:
```text
ผู้จัดทำรายงาน: ................................
ตำแหน่ง: ........................................
วันที่: ............................................
```

## 7. Export Backup
ควร export เป็น Excel หลาย sheet:
- metadata
- requests
- requester_types
- categories
- statuses
- evidence_types
- attachments

## 8. Soft Deleted Records
รายงานปกติไม่นับคำร้องที่ถูก soft delete แล้ว แต่ export backup ควรรวม field `deleted_at` เพื่อให้ตรวจสอบย้อนหลังได้ MVP ยังไม่ต้องมีหน้า audit/restore สำหรับรายการที่ถูกลบ

---

## REQUIREMENTS.md

# REQUIREMENTS.md

# ระบบบันทึกสถิติหมวดหมู่การขอดูภาพจากกล้องวงจรปิด

## 1. วัตถุประสงค์
ระบบนี้ช่วยเจ้าหน้าที่เทศบาลบันทึกสถิติการขอดูภาพจากกล้องวงจรปิด โดยยังใช้ใบคำร้องกระดาษเดิมเป็นเอกสารหลัก

## 2. ความสามารถหลัก
| ความสามารถ | รายละเอียด |
|---|---|
| ออกเลขคำร้อง | ระบบออกเลขอ้างอิง เช่น `C69-0001` |
| บันทึกคำร้อง | บันทึกวันที่ ประเภทผู้ขอ หมวดหมู่ สถานะ สถานที่ หมายเหตุ |
| แนบหลักฐาน | แนบใบคำร้อง หนังสือราชการ ใบแจ้งความ รูปภาพ แบบไม่บังคับ |
| ค้นหา/แก้ไข | ค้นหาตามเลข วันที่ ประเภท หมวดหมู่ สถานะ |
| จัดการหมวดหมู่ | เพิ่ม แก้ไข ปิดใช้งาน |
| จัดการประเภทหลักฐาน | เพิ่ม แก้ไข ปิดใช้งาน |
| รายงาน | สรุปตามช่วงวันที่ที่เลือก |
| Export | Excel, PDF, Backup |
| Smart dashboard | แสดงคำร้องที่ควรติดตามจากข้อมูลเดิม |
| เลขคำร้องโดยประมาณ | แสดงเลขถัดไปก่อนบันทึก โดยเลขจริงยืนยันหลังบันทึก |
| Smart defaults | เลือกค่าเริ่มต้นจากข้อมูลที่ใช้บ่อยจริง |
| มุมมองด่วน | กรองเดือนนี้ ควรติดตาม พบภาพ และทั้งหมดได้ในคลิกเดียว |
| Insight รายงาน | เปรียบเทียบช่วงก่อนหน้า แนวโน้ม 6 เดือน และอัตราพบภาพ |
| Duplicate hint | เตือนรายการคล้ายกันแบบไม่ block |
| Location autocomplete | แนะนำสถานที่จากข้อมูลเดิมโดยยังพิมพ์อิสระได้ |
| Perceived performance | หน้าเพิ่มคำร้องและรายงานต้องมี shell/loading feedback โดยไม่รอ query เสริมที่ไม่จำเป็น |

## 3. สิ่งที่ไม่ทำในระยะที่ 1
| รายการ | เหตุผล |
|---|---|
| รับคำร้องออนไลน์จากประชาชน | ยังใช้ใบคำร้องกระดาษ |
| บังคับเก็บชื่อ/เลขบัตร/โทรศัพท์ | ไม่จำเป็นต่อสถิติ |
| อัปโหลดวิดีโอ CCTV | เสี่ยงพื้นที่และข้อมูลส่วนบุคคล |
| ระบบอนุมัติหลายชั้น | เพิ่มภาระเจ้าหน้าที่ |
| Login ซับซ้อน | ใช้งานภายในก่อน |

## 4. ฟอร์มเพิ่มคำร้อง
### ช่องบังคับ
| ช่อง | รูปแบบ | ค่าเริ่มต้น |
|---|---|---|
| วันที่รับคำร้อง | Date picker | วันนี้ |
| ประเภทผู้ขอ | Dropdown | ประชาชน |
| หมวดหมู่ | Tile radio picker | เลือก |
| สถานะ | Dropdown | รับคำร้องแล้ว |

### ช่องไม่บังคับ
| ช่อง | รูปแบบ |
|---|---|
| สถานที่เกิดเหตุ | Text |
| หมายเหตุ | Textarea |

## 5. เลขคำร้อง
รูปแบบ:
```text
CYY-NNNN
```
ตัวอย่าง:
```text
C69-0001
```

ปีงบประมาณเริ่ม 1 ตุลาคม ถึง 30 กันยายน

ระบบต้องรองรับการแก้ไขเลขคำร้องอย่างตั้งใจสำหรับกรณีแก้ข้อมูลผิดหรือนำเข้าข้อมูลย้อนหลัง โดยต้องตรวจ format และห้ามซ้ำกับเลขที่มีอยู่แล้ว การแก้ไขข้อมูลทั่วไปต้องไม่ทำให้เลขคำร้องเปลี่ยนเอง

## 6. หลักฐานแนบ
การแนบหลักฐานต้องเป็น optional

Flow:
```text
บันทึกข้อมูลสถิติ → ออกเลขคำร้อง → แนบหลักฐานภายหลังได้
```

ประเภทหลักฐานเริ่มต้น:
1. ใบคำร้อง
2. หนังสือราชการ
3. ใบแจ้งความ
4. เอกสารส่งมอบ
5. รูปภาพประกอบ
6. อื่น ๆ

ไฟล์ที่อนุญาต:
- `.pdf`
- `.jpg`
- `.jpeg`
- `.png`
- `.doc`
- `.docx`

## 7. รายงาน
ต้องเลือกช่วงวันที่ได้อย่างอิสระ และสรุป:
- จำนวนคำร้องทั้งหมด
- แยกตามหมวดหมู่
- แยกตามประเภทผู้ขอ
- แยกตามสถานะ
- ตารางรายการคำร้อง

## 8. เกณฑ์ด้าน UX
- เพิ่มคำร้องโดยไม่แนบไฟล์ควรใช้เวลาไม่เกิน 30 วินาที
- UI ภาษาไทย
- ปุ่มใหญ่
- ฟอร์มสั้น
- ไม่บังคับ field เกินจำเป็น
- หลังบันทึกต้องแสดงเลขคำร้องชัดเจน
- รองรับมือถือและแท็บเล็ตแบบ responsive สำหรับใช้งานหน้างาน
- touch target ต้องกดง่ายบนหน้าจอสัมผัส
- flow เพิ่มคำร้องบนมือถือยังต้องสั้นและไม่บังคับแนบไฟล์
- ฟีเจอร์ smart ต้องไม่เพิ่ม required field ใหม่
- ฟีเจอร์ smart ต้องเป็น optional/passive ไม่ block flow หลัก
- smart defaults และ location autocomplete ต้องไม่ block การแสดงฟอร์มหลัก
- หน้ารายงานต้องให้ feedback ระหว่างรอ query aggregate หรือ export-related data

---

## ROADMAP.md

# ROADMAP.md

# Roadmap การพัฒนา

Roadmap นี้จัดลำดับงานจากสิ่งที่ต้องตกผลึกก่อน ไปจนถึง MVP ที่ทดลองใช้งานบน Vercel ได้จริง โดยยึดเป้าหมายหลัก: รวดเร็ว ใช้งานง่าย มีประสิทธิภาพ รายงานหลายมิติ ถูกต้อง และ UI ต้องดูดีระดับที่เจ้าหน้าที่เห็นแล้วอยากใช้

## 1. Product Direction

ระบบนี้ไม่ใช่ case management และไม่ใช่ระบบรับคำร้องออนไลน์จากประชาชน แต่เป็น internal statistics app สำหรับเจ้าหน้าที่ CCTV ของเทศบาล ใช้คู่กับใบคำร้องกระดาษเดิม

เป้าหมายของ MVP:
- เพิ่มคำร้องและออกเลข `CYY-NNNN` ได้เร็ว
- บันทึกข้อมูลสถิติเท่าที่จำเป็น
- แนบหลักฐานได้ภายหลังแบบ optional
- ค้นหา แก้ไข และจัดการข้อมูลพื้นฐานได้
- รายงานและ export ได้หลายมิติ
- deploy ทดลองบน Vercel โดยใช้ Neon และ Vercel Blob

## 2. Current Decisions

| Topic | Decision |
|---|---|
| Hosting | Vercel |
| Source control | ต้องสร้าง GitHub repo ก่อนสร้าง Vercel project |
| GitHub repo | `https://github.com/poppatompong-dev/CCTVstat.git` |
| Database | Neon PostgreSQL |
| Attachments | Vercel Blob Private Storage |
| Access control | Shared password access gate ผ่าน `APP_PASSWORD` และ session cookie |
| Full login / roles | ไม่ทำใน version 1 |
| Official document | ใบคำร้องกระดาษยังเป็นเอกสารหลัก |
| CCTV video upload | ไม่ทำใน version 1 |
| Request number correction | รองรับการแก้เลขคำร้องอย่างตั้งใจเพื่อ correction/backfill |
| Delete policy | ใช้ soft delete และไม่ reuse เลขคำร้อง |
| Report organization name | กลุ่มงานสถิติข้อมูลและสารสนเทศ |
| Soft delete UI in MVP | ไม่มีหน้า audit/restore; เก็บใน backend และ backup ก่อน |
| Backfill validation | ไม่ยอมบันทึกเลขคำร้องที่ปีงบไม่ตรงกับวันที่ |

## 3. UX North Star

หน้าจอต้องให้ความรู้สึก:
- เร็ว: เพิ่มคำร้องไม่แนบไฟล์ภายใน 30 วินาที
- ง่าย: field บังคับน้อย ปุ่มหลักชัดเจน
- สวยงาม: ดูสะอาด เป็นงานราชการสมัยใหม่ ไม่เหมือนฟอร์มดิบ
- น่าเชื่อถือ: เลขคำร้อง รายงาน และ export ต้องอ่านง่าย
- หน้างาน: มือถือและแท็บเล็ตต้องใช้งานเพิ่มคำร้อง ค้นหา และดูสถานะได้สะดวก
- ไม่รก: ใช้ layout สำหรับงานจริง ไม่ใช่ landing page

แนวทาง UI:
- ใช้หน้าแรกเป็น command dashboard ไม่ใช่หน้าโฆษณา
- ให้ปุ่ม "เพิ่มคำร้องใหม่" เป็น action เด่นที่สุด
- ใช้สีสุภาพ อ่านง่าย มี contrast ดี และไม่ใช้ palette สีเดียวทั้งระบบ
- ตารางต้อง scan ง่าย มี filter bar ชัดเจน
- รายงานต้องมี visual summary เช่น stat tiles และ chart ขนาดพอดี
- เลขคำร้องหลังบันทึกต้องเด่นมากและ copy/print-friendly
- mobile layout ต้องไม่ใช่แค่ย่อ desktop ลงมา แต่ต้องจัด flow ใหม่ให้กดง่ายและอ่านเร็ว

## 4. Phase 0: Final Decisions Before Implementation

ไม่มี owner decision ที่บล็อก implementation แล้ว:

1. รายงานจะซ่อน soft-deleted requests จากยอดรวมปกติ
2. ไม่มีหน้า audit/restore ใน MVP; ข้อมูล soft delete อยู่ใน backend และ backup
3. ค่า shared password จะตั้งผ่าน env เท่านั้น ไม่เขียนลง repo
4. Neon `DATABASE_URL` และ Vercel Blob token จะถูกใส่ใน `.env.local` / Vercel env โดยผู้ดูแล ห้ามบันทึกค่าจริงลง markdown หรือ commit

## 5. Phase 1: Foundation

Deliverables:
- Next.js + TypeScript project
- Thai UI shell
- Shared password access gate
- Neon connection แบบ lazy initialization
- Environment variable template
- Basic app navigation

Verification:
- เปิด local app ได้
- กรอกรหัสผ่านแล้วเข้า dashboard ได้
- ไม่มีหน้า data สำคัญที่ bypass access gate ได้

## 6. Phase 2: Data Model and Seed

Deliverables:
- PostgreSQL schema
- Migration/init script
- Seed data สำหรับ requester types, categories, statuses, evidence types
- Function ออกเลขคำร้องตามปีงบประมาณ

Verification:
- `C69-0001` สำหรับวันที่ 2026-06-16
- `C70-0001` สำหรับวันที่ 2026-10-01
- unique constraint กันเลขซ้ำ
- รองรับ manual/backfill request number โดยไม่ทำให้ flow ปกติช้าลง
- manual/backfill request number ต้องตรงปีงบประมาณของ `request_date`
- seed idempotent หรือรันซ้ำได้อย่างควบคุม

## 7. Phase 3: Add Request Flow

Deliverables:
- หน้าเพิ่มคำร้องใหม่
- วันที่ default วันนี้
- dropdown 3 รายการ
- location/note optional
- success state แสดงเลขคำร้องชัดเจน

Verification:
- บันทึกโดยไม่แนบไฟล์ได้
- field บังคับไม่เกิน 4 field
- ใช้งานจริงได้เร็วใน 30 วินาที
- UI ต้องดู polished ตั้งแต่ phase นี้

## 8. Phase 4: Search, Edit, and Delete Policy

Deliverables:
- หน้า search/edit
- filter ตามเลข วันที่ ประเภท หมวดหมู่ สถานะ
- หน้าแก้ไขคำร้อง
- delete confirmation ตามนโยบายที่ตกลง
- action สำหรับแก้เลขคำร้องโดยตรงพร้อม validation/confirmation

Verification:
- แก้ไขข้อมูลทั่วไปแล้วเลขคำร้องไม่เปลี่ยน
- แก้เลขคำร้องโดยตรงได้เมื่อ format ถูกและไม่ซ้ำ
- แก้เลขคำร้องโดยตรงไม่ได้ถ้า `CYY` ไม่ตรงกับปีงบประมาณของวันที่คำร้อง
- filter ทำงานถูก
- รายการย้อนหลังยังอ่านชื่อ master data ได้

## 9. Phase 5: Master Data

Deliverables:
- จัดการหมวดหมู่
- จัดการประเภทหลักฐาน
- เปิด/ปิดใช้งาน
- sort order

Verification:
- รายการ inactive ไม่แสดงในฟอร์มใหม่
- รายงานย้อนหลังยังแสดงชื่อเดิม
- ไม่ hard delete รายการที่ถูกใช้แล้ว

## 10. Phase 6: Attachments

Deliverables:
- Upload ไป Vercel Blob Private Storage
- Metadata ใน Neon
- List/download/delete attachment
- ตรวจ extension, MIME type, size

Verification:
- ไม่มี public URL ใน UI
- download ผ่าน endpoint หลังผ่าน access gate
- upload fail ไม่ทำให้คำร้องหลักเสีย
- block `.exe`, `.bat`, `.cmd`, `.js`, `.sh`, `.php`, `.html`

## 11. Phase 7: Reports and Export

Deliverables:
- Report filters
- Summary total
- Count by category, requester type, status
- Records table
- Export Excel
- Export PDF ภาษาไทย
- Export backup หลาย sheet

Verification:
- รายงานหลายมิติถูกต้อง
- Excel เปิดอ่านได้
- PDF มีหัวรายงาน ช่วงวันที่ วันที่จัดทำ และพื้นที่ลงชื่อ
- รองรับข้อมูลอย่างน้อย 5,000 รายการสำหรับ export Excel

## 12. Phase 8: Deployment Trial

Deliverables:
- GitHub repository
- Vercel deployment
- Vercel env vars
- Neon connection production
- Vercel Blob production token
- Deployment checklist

Verification:
- code ถูก push ไป GitHub ก่อน import เข้า Vercel
- preview/prod URL เข้าได้ผ่าน shared password
- เพิ่มคำร้องได้จริง
- upload/download ได้จริง
- export ได้จริง

## 13. Future-Ready But Not Built Now

ออกแบบให้ไม่ตันในอนาคต แต่ยังไม่ implement ใน MVP:

| Future Requirement | เตรียมเผื่ออย่างไร |
|---|---|
| Login หลายผู้ใช้ | แยก access gate logic ออกจาก domain logic |
| Role admin/staff/viewer | อย่าผูก permission กับ schema คำร้องโดยตรงตั้งแต่แรก |
| Audit log | ใช้ timestamp ชัดเจน และเตรียม service layer สำหรับ mutations |
| created_by / updated_by | ยังไม่บังคับ field แต่ไม่ออกแบบ schema ให้ขัดกับการเพิ่มภายหลัง |
| แนบไฟล์ storage อื่น | เก็บ `storage_key` และ metadata ไม่ผูก UI กับ URL ตรง |
| Backup ไฟล์แนบจริง | MVP export metadata ก่อน และแยกจาก blob export ให้ต่อยอดได้ |
| แผนที่หรือพิกัด | `location_text` ยังเป็น text ก่อน แต่ไม่ปิดทางเพิ่ม location fields |
| นำเข้าข้อมูลจาก Excel เดิม | schema และ request number logic รองรับ manual/backfill number ตั้งแต่แรก |
| Dashboard ผู้บริหาร | report query ควร reusable ไม่ผูกกับหน้าเดียว |
| เปลี่ยนจาก shared password เป็น auth เต็ม | session/access layer ต้องเปลี่ยนได้โดยไม่แตะ core request flow |
| PWA/offline mode | ยังไม่ทำตอนนี้ แต่ responsive layout ไม่ควรขวางการต่อยอดเป็น PWA ภายหลัง |

## 13.1 Smart Enhancements

Smart Enhancements เป็นส่วนต่อยอดจาก MVP โดยมีเงื่อนไขสำคัญว่าไม่เพิ่มภาระเจ้าหน้าที่ ไม่เพิ่ม required field และไม่เปลี่ยนระบบให้กลายเป็น case management

สิ่งที่ทำได้ในระยะนี้:
- Dashboard แสดงคำร้องที่ควรติดตามจากสถานะและวันที่เดิม
- หน้าเพิ่มคำร้องแสดงเลขคำร้องโดยประมาณ โดยเลขจริงยืนยันเมื่อบันทึก
- Smart defaults เลือกค่าที่ใช้บ่อยจากข้อมูลจริง แต่ยังแก้ไขได้เสมอ
- รายงานเปรียบเทียบช่วงก่อนหน้า แนวโน้มย้อนหลัง 6 เดือน และอัตราพบภาพ
- มุมมองด่วนบนหน้าค้นหา เช่น เดือนนี้ ควรติดตาม พบภาพ และทั้งหมด

สิ่งที่ยังต้องระวัง:
- ห้ามเพิ่ม required field ใหม่
- ห้ามทำ assignment, SLA, notification, หรือ workflow อนุมัติหลายชั้น
- คำว่า "คำร้องที่ควรติดตาม" เป็นมุมมองช่วยดูข้อมูล ไม่ใช่การมอบหมายงาน

## 14. Information Needed From Owner

ก่อน implement ต้องขอข้อมูลจากเจ้าของระบบเป็นลำดับ:

1. ชื่อหน่วยงานสำหรับรายงาน PDF: ได้รับแล้ว
2. คำยืนยันนโยบายลบคำร้อง: ได้รับแล้ว ใช้ soft delete
3. ค่า `DATABASE_URL` สำหรับ local/Vercel: ได้รับแล้ว ต้องเก็บเป็น secret เท่านั้น
4. ค่า Vercel Blob token: มี/พร้อมตั้งค่าแล้ว ต้องเก็บเป็น secret เท่านั้น
5. ค่า `APP_PASSWORD`: ได้รับแล้ว ต้องเก็บเป็น secret เท่านั้น
6. ค่า `REPORT_ORGANIZATION_NAME`: `กลุ่มงานสถิติข้อมูลและสารสนเทศ`
7. คำยืนยันว่าใช้ปีงบประมาณไทย 1 ต.ค. - 30 ก.ย. เสมอ: ใช่
8. ตัวอย่างรายงานราชการที่อยากให้หน้าตาใกล้เคียง ถ้ามี: optional

## 15. Deployment Dependency

GitHub repository ถูกสร้างแล้วที่ `https://github.com/poppatompong-dev/CCTVstat.git` Vercel project และ Vercel Blob token จะผูกกับ repo/project นี้ ดังนั้น implementation ควรจบด้วยการ push code ไป repo นี้ แล้วค่อยตรวจ Vercel build, env vars, Blob store, และ preview deployment เป็นขั้นถัดไป

---

## SECURITY_PRIVACY.md

# SECURITY_PRIVACY.md

# ความปลอดภัยและข้อมูลส่วนบุคคล

## 1. หลักการ
ระบบนี้เก็บข้อมูลสถิติและเอกสารแนบที่อาจมีข้อมูลส่วนบุคคล จึงต้องเก็บเท่าที่จำเป็นและไม่เปิดเผยไฟล์สู่สาธารณะ

## 2. ข้อมูลที่ควรเก็บ
| ข้อมูล | เหตุผล |
|---|---|
| เลขคำร้อง | อ้างอิงใบคำร้องกระดาษ |
| วันที่รับคำร้อง | รายงาน |
| ประเภทผู้ขอ | สถิติ |
| หมวดหมู่ | สถิติ |
| สถานะ | ผลเบื้องต้น |
| สถานที่ | วิเคราะห์พื้นที่ |
| หมายเหตุ | รายละเอียดเสริม |
| ไฟล์หลักฐาน | อ้างอิงภายในแบบ optional |

## 3. ข้อมูลที่ไม่ควรบังคับเก็บ
- เลขบัตรประชาชน
- ชื่อ-สกุลผู้ขอ
- เบอร์โทรศัพท์
- ที่อยู่
- ไฟล์วิดีโอ CCTV

## 4. หลักฐานแนบ
มาตรการ:
1. ไม่บังคับแนบทุกเคส
2. ไม่เปิด public URL
3. ดาวน์โหลดผ่านระบบ
4. จำกัดประเภทไฟล์
5. จำกัดขนาดไฟล์
6. ใช้ safe filename
7. ป้องกัน path traversal

## 5. File Upload Security
Allowed:
```text
.pdf .jpg .jpeg .png .doc .docx
```

Blocked:
```text
.exe .bat .cmd .js .sh .php .html
```

## 6. Access Control ระยะที่ 1
เนื่องจากช่วงทดลอง deploy บน Vercel และมี public URL:
- ต้องมี shared password access gate
- shared password เก็บใน env `APP_PASSWORD`
- หลังผ่านรหัสผ่านให้ใช้ session cookie
- ไม่ทำ user/role management ใน version 1
- ไม่ควรแสดงข้อมูลคำร้องหรือไฟล์แนบก่อนผ่าน access gate
- สำรองข้อมูลสม่ำเสมอ

## 7. Logging ขั้นต่ำ
ควรเก็บ:
- created_at
- updated_at
- uploaded_at

อนาคตเมื่อมี login ค่อยเพิ่ม:
- created_by
- updated_by
- uploaded_by
- audit_logs

## 8. Backup
สำรอง:
1. Neon PostgreSQL data หรือ export จากระบบ
2. Vercel Blob objects และ metadata ใน `request_attachments`
3. Vercel Environment Variables / `.env.local` ในเครื่องผู้ดูแล

## 9. Secret Handling
- ห้ามบันทึกค่า `DATABASE_URL`, blob token, หรือ `APP_PASSWORD` ลง markdown
- ค่า secret ต้องอยู่ใน `.env.local` สำหรับ local development และ Vercel Environment Variables สำหรับ deployment
- `.env.local` ต้องไม่ถูก commit
- หาก secret ถูกเผยแพร่ในที่สาธารณะ ควร rotate ทันที
- `DATABASE_URL`, `APP_PASSWORD`, `SESSION_SECRET`, และ `BLOB_READ_WRITE_TOKEN` ต้องเก็บเป็น env secret เท่านั้น
- หากเปิด `PERF_DB_PROBE=1` เพื่อ diagnostic ต้องปิดหลังเก็บ log เสร็จ เพื่อลด query เพิ่มเติมบน production

---

## SEED_DATA.md

# SEED_DATA.md

# ข้อมูลเริ่มต้น

## ประเภทผู้ขอ
| sort_order | name | is_active |
|---:|---|---|
| 1 | ประชาชน | true |
| 2 | เจ้าหน้าที่เทศบาล | true |
| 3 | ตำรวจ | true |
| 4 | หน่วยงานรัฐ | true |
| 5 | อื่น ๆ | true |

```sql
INSERT INTO requester_types (name, sort_order, is_active) VALUES
('ประชาชน', 1, 1),
('เจ้าหน้าที่เทศบาล', 2, 1),
('ตำรวจ', 3, 1),
('หน่วยงานรัฐ', 4, 1),
('อื่น ๆ', 5, 1);
```

## หมวดหมู่
| sort_order | name | is_active |
|---:|---|---|
| 1 | อุบัติเหตุจราจร | true |
| 2 | ทรัพย์สินสูญหาย | true |
| 3 | เหตุเกี่ยวกับคดี/อาชญากรรม | true |
| 4 | ตรวจสอบการจราจร | true |
| 5 | เหตุความสงบเรียบร้อย | true |
| 6 | หน่วยงานรัฐ/ตำรวจขอข้อมูล | true |
| 7 | งานภายในเทศบาล | true |
| 8 | อื่น ๆ | true |

```sql
INSERT INTO categories (name, sort_order, is_active) VALUES
('อุบัติเหตุจราจร', 1, 1),
('ทรัพย์สินสูญหาย', 2, 1),
('เหตุเกี่ยวกับคดี/อาชญากรรม', 3, 1),
('ตรวจสอบการจราจร', 4, 1),
('เหตุความสงบเรียบร้อย', 5, 1),
('หน่วยงานรัฐ/ตำรวจขอข้อมูล', 6, 1),
('งานภายในเทศบาล', 7, 1),
('อื่น ๆ', 8, 1);
```

## สถานะ
| sort_order | name | semantic_key | is_active |
|---:|---|---|---|
| 1 | รับคำร้องแล้ว | received | true |
| 2 | กำลังตรวจสอบภาพ | checking | true |
| 3 | พบภาพ | found | true |
| 4 | ไม่พบภาพ | not_found | true |
| 5 | แจ้งผลแล้ว | notified | true |
| 6 | อื่น ๆ | other | true |

```sql
INSERT INTO statuses (name, sort_order, semantic_key, is_active) VALUES
('รับคำร้องแล้ว', 1, 'received', 1),
('กำลังตรวจสอบภาพ', 2, 'checking', 1),
('พบภาพ', 3, 'found', 1),
('ไม่พบภาพ', 4, 'not_found', 1),
('แจ้งผลแล้ว', 5, 'notified', 1),
('อื่น ๆ', 6, 'other', 1);
```

## ประเภทหลักฐาน
| sort_order | name | is_active |
|---:|---|---|
| 1 | ใบคำร้อง | true |
| 2 | หนังสือราชการ | true |
| 3 | ใบแจ้งความ | true |
| 4 | เอกสารส่งมอบ | true |
| 5 | รูปภาพประกอบ | true |
| 6 | อื่น ๆ | true |

```sql
INSERT INTO evidence_types (name, sort_order, is_active) VALUES
('ใบคำร้อง', 1, 1),
('หนังสือราชการ', 2, 1),
('ใบแจ้งความ', 3, 1),
('เอกสารส่งมอบ', 4, 1),
('รูปภาพประกอบ', 5, 1),
('อื่น ๆ', 6, 1);
```

---

## TEST_PLAN.md

# TEST_PLAN.md

# แผนทดสอบระบบ

## 1. Add Request
| TC | ทดสอบ | ผลที่คาดหวัง |
|---|---|---|
| 1 | เปิดหน้าเพิ่มคำร้อง | แสดงฟอร์มภาษาไทย |
| 2 | วันที่ default เป็นวันนี้ | ถูกต้อง |
| 3 | กรอกเฉพาะ field บังคับ | บันทึกสำเร็จ |
| 4 | ไม่เลือกหมวดหมู่ | แจ้งเตือน |
| 5 | บันทึกสำเร็จ | แสดงเลขคำร้อง |
| 6 | กดเพิ่มคำร้องใหม่ | ฟอร์มพร้อมกรอกใหม่ |
| 7 | เปลี่ยนวันที่รับคำร้อง | เลขคำร้องโดยประมาณเปลี่ยนตามปีงบประมาณ |
| 8 | เปิดฟอร์มหลังมีข้อมูลเดิม | ประเภทผู้ขอและสถานะ default ตามค่าที่ใช้บ่อยและยังแก้ได้ |
| 9 | เปิดหน้าเพิ่มคำร้องบน Vercel | shell/form loading state แสดงก่อน smart defaults และ location autocomplete โหลดตามมา |

## 2. Request Number
| TC | ทดสอบ | ผลที่คาดหวัง |
|---|---|---|
| 1 | คำร้องแรกปีงบประมาณ 2569 | `C69-0001` |
| 2 | คำร้องถัดไป | `C69-0002` |
| 3 | วันที่ 2026-09-30 | ยังเป็นปีงบประมาณ 2569 |
| 4 | วันที่ 2026-10-01 | เริ่ม `C70-0001` |
| 5 | แก้ไขข้อมูลทั่วไป | เลขไม่เปลี่ยนเอง |
| 6 | แก้เลขคำร้องเป็นเลขที่ไม่ซ้ำ | บันทึกสำเร็จและค้นหาเลขใหม่ได้ |
| 7 | แก้เลขคำร้องเป็นเลขซ้ำ | ระบบปฏิเสธ |
| 8 | แก้เลขคำร้อง format ผิด | ระบบแจ้งเตือน |
| 9 | แก้เลข `C68-0012` แต่วันที่อยู่ปีงบ 2569 | ระบบปฏิเสธและแจ้งว่าเลขไม่ตรงปีงบประมาณ |

## 3. Search / Edit
| TC | ทดสอบ | ผลที่คาดหวัง |
|---|---|---|
| 1 | ค้นหาด้วยเลขคำร้อง | พบรายการ |
| 2 | ค้นหาด้วยช่วงวันที่ | แสดงข้อมูลถูกช่วง |
| 3 | filter หมวดหมู่ | แสดงเฉพาะหมวด |
| 4 | แก้ไขสถานะ | บันทึกสำเร็จ |
| 5 | ลบรายการ | ถามยืนยันก่อน soft delete |
| 6 | ค้นหาปกติหลังลบ | ไม่แสดงรายการที่ถูก soft delete |
| 7 | เพิ่มคำร้องใหม่หลังลบ | ไม่ reuse เลขคำร้องที่ถูกลบ |
| 8 | กดมุมมองด่วนเดือนนี้ | แสดงคำร้องเดือนปัจจุบัน |
| 9 | กดมุมมองด่วนควรติดตาม | แสดงคำร้องที่ยังไม่แจ้งผลและเกินช่วงวันที่กำหนด |
| 10 | กดมุมมองด่วนพบภาพ | แสดงคำร้องที่สถานะมี semantic `found` |

## 4. Category Management
| TC | ทดสอบ | ผลที่คาดหวัง |
|---|---|---|
| 1 | เพิ่มหมวดใหม่ | แสดงใน dropdown |
| 2 | แก้ไขชื่อหมวด | ชื่อใหม่ถูกต้อง |
| 3 | ปิดใช้งาน | ไม่แสดงในฟอร์มใหม่ |
| 4 | หมวดเก่าที่ใช้แล้ว | ยังแสดงในรายงานย้อนหลัง |

## 5. Evidence Attachment
| TC | ทดสอบ | ผลที่คาดหวัง |
|---|---|---|
| 1 | บันทึกคำร้องโดยไม่แนบไฟล์ | สำเร็จ |
| 2 | แนบ PDF | สำเร็จ |
| 3 | แนบ JPG/PNG | สำเร็จ |
| 4 | แนบ DOCX | สำเร็จ |
| 5 | แนบ EXE | ระบบปฏิเสธ |
| 6 | ดาวน์โหลดไฟล์ | สำเร็จ |
| 7 | ลบไฟล์แนบ | ถามยืนยัน |
| 8 | ดูหน้าแก้ไข | เห็นรายการไฟล์แนบ |
| 9 | เลือกหลายไฟล์พร้อมกัน | แสดง preview และอัปโหลดได้ตาม `MAX_UPLOAD_FILES` |
| 10 | เลือกรูปภาพ | เห็น thumbnail ก่อนและหลังอัปโหลด |
| 11 | เลือก PDF/DOC/DOCX | เห็นการ์ดชนิดไฟล์ก่อนและหลังอัปโหลด |
| 12 | เลือกไฟล์เกินจำนวนที่กำหนด | ระบบจำกัดตามค่า `MAX_UPLOAD_FILES` |
| 13 | เลือกไฟล์เกิน `MAX_UPLOAD_BYTES` | ระบบปฏิเสธไฟล์นั้น |
| 14 | ระหว่างอัปโหลด | แสดง modal/pending state และปุ่มไม่ควรถูกกดซ้ำ |
| 15 | Automated E2E upload fixture | ใช้ไฟล์ committed fixture `test-private.pdf` จาก root repo ได้ |
| 16 | Automated E2E view/download/delete fixture | staging ที่เปิด `E2E_FIXTURES_ENABLED=1` มีคำร้อง `C69-0003` พร้อมไฟล์แนบอย่างน้อย 1 ไฟล์สำหรับทดสอบ |

หมายเหตุ E2E:
- `test-private.pdf` เป็น fixture สำหรับ test runner เท่านั้น
- `E2E_FIXTURES_ENABLED=1` ควรเปิดเฉพาะ Vercel preview/staging ที่ใช้ automated test ไม่ใช่ production จริง
- ก่อนรันชุด view/download/delete ให้เรียก `POST /api/test-fixtures/e2e` หลัง login เพื่อ reset fixture ให้พร้อม
- หลังทดสอบลบไฟล์แนบ fixture แล้ว ระบบจะ mark tombstone เพื่อไม่ให้ ordinary page load หรือ cold serverless instance seed ไฟล์กลับมาทันที

## 6. Reports
| TC | ทดสอบ | ผลที่คาดหวัง |
|---|---|---|
| 1 | รายวัน | ถูกต้อง |
| 2 | รายเดือน | ถูกต้อง |
| 3 | ปีงบประมาณ | ถูกต้อง |
| 4 | filter หมวดหมู่ | ถูกต้อง |
| 5 | Export Excel | ได้ไฟล์ |
| 6 | Export PDF | ได้ไฟล์ |
| 7 | Export Backup | ได้ไฟล์ |
| 8 | รายงานเทียบช่วงก่อนหน้า | แสดงจำนวนช่วงก่อนหน้าและ % เปลี่ยนแปลง |
| 9 | แนวโน้ม 6 เดือน | แสดงข้อมูลรายเดือนย้อนหลัง |
| 10 | อัตราพบภาพ | คำนวณจาก semantic `found` และ `not_found` |
| 11 | Backup | ได้ไฟล์ Excel หลาย sheet |

## 6.1 Smart Dashboard
| TC | ทดสอบ | ผลที่คาดหวัง |
|---|---|---|
| 1 | มีคำร้องยังไม่แจ้งผลเกิน 7 วัน | แสดงในคำร้องที่ควรติดตาม |
| 2 | มีคำร้องสถานะกำลังตรวจสอบภาพเกิน 7 วัน | นับในกำลังตรวจสอบเกินกำหนด |
| 3 | คลิกรายการที่ควรติดตาม | เปิดหน้าแก้ไขคำร้อง |
| 4 | เปลี่ยนชื่อสถานะใน master data | dashboard ยังทำงานจาก semantic key |

## 6.2 Smart Assist
| TC | ทดสอบ | ผลที่คาดหวัง |
|---|---|---|
| 1 | กรอกวันที่ หมวดหมู่ และสถานที่คล้ายรายการเดิม | แสดง duplicate hint |
| 2 | duplicate hint แสดงรายการ | คลิกเปิดคำร้องเดิมได้ |
| 3 | มี duplicate hint | ยังบันทึกคำร้องใหม่ได้ ไม่ถูก block |
| 4 | เคยกรอกสถานที่มาก่อน | ช่องสถานที่มี autocomplete |
| 5 | เปิดหน้าเพิ่มคำร้องครั้งแรก | smart assist ใช้ `/api/requests/form-assist` และไม่ทำให้ฟอร์มหลักรอ query เสริมก่อนแสดง |

## 7. Performance Target
| รายการ | เป้าหมาย |
|---|---|
| เพิ่มคำร้องไม่แนบไฟล์ | ไม่เกิน 30 วินาที |
| Export Excel | รองรับข้อมูลอย่างน้อย 5,000 รายการ |
| ค้นหา | ไม่ช้าเกินจำเป็นสำหรับข้อมูลหลักพันรายการ |
| เปิดหน้าเพิ่มคำร้อง | เห็น shell หรือฟอร์มหลักเร็ว โดย smart assist โหลดตามหลังแบบไม่ block |
| เปิดหน้ารายงาน | เห็น shell/loading skeleton ก่อนผล aggregate หาก query ยังไม่เสร็จ |

## 8. Responsive / Field Use
| TC | ทดสอบ | ผลที่คาดหวัง |
|---|---|---|
| 1 | เปิดบนมือถือขนาดประมาณ 390px | ไม่มีข้อความหรือปุ่มล้นจอ |
| 2 | เพิ่มคำร้องบนมือถือ | กรอก field บังคับและออกเลขได้สะดวก |
| 3 | เปิดบนแท็บเล็ต | ใช้งานเมนูหลัก ฟอร์ม และรายงานได้อ่านง่าย |
| 4 | ใช้ dropdown และปุ่มบนจอสัมผัส | touch target กดง่าย ไม่ชิดกันเกินไป |
| 5 | ดูตารางค้นหาบนมือถือ | ข้อมูลสำคัญอ่านได้โดยไม่สับสน |

## 9. Action Feedback
| TC | ทดสอบ | ผลที่คาดหวัง |
|---|---|---|
| 1 | กดบันทึกคำร้อง | แสดง modal/pending state ระหว่างบันทึก |
| 2 | กดบันทึกแก้ไข | แสดง modal/pending state ระหว่างบันทึก |
| 3 | กดลบคำร้อง | แสดง modal ยืนยันก่อนส่ง action |
| 4 | กดลบไฟล์แนบ | แสดง modal ยืนยันก่อนส่ง action |
| 5 | action สำเร็จ | กลับมาหน้าเดิม/หน้าที่กำหนดพร้อม feedback message |

---

## UI_SPEC.md

# UI_SPEC.md

# ข้อกำหนดหน้าจอ

## 1. หลักการออกแบบ
| หลักการ | รายละเอียด |
|---|---|
| เร็ว | บันทึกคำร้องโดยไม่แนบไฟล์ไม่เกิน 30 วินาที |
| ง่าย | ใช้ control ที่กดง่าย เช่น dropdown ปุ่มใหญ่ และแผงเลือกแบบ tile |
| สั้น | ฟอร์มเพิ่มคำร้องมี field บังคับน้อย |
| ไม่บังคับไฟล์ | แนบหลักฐานได้ภายหลัง |
| ภาษาไทย | ทุกหน้าจอใช้ภาษาไทย |
| ร้องว้าว | หน้าจอต้องดูสวยงาม สะอาด ทันสมัย และยังเหมาะกับงานราชการ |
| Responsive หน้างาน | ใช้งานบนมือถือและแท็บเล็ตได้ง่ายสำหรับการบันทึกสถิติหน้างาน |

## 1.1 Visual Quality Bar

- หน้าแรกต้องเป็น dashboard สำหรับทำงานจริง ไม่ใช่ landing page
- สีและ typography ต้องให้ความรู้สึกน่าเชื่อถือ อ่านง่าย และไม่ล้าสมัย
- ปุ่มหลักต้องเด่นพอให้เจ้าหน้าที่เริ่มงานได้ทันที
- รายงานต้องสวยและ scan ง่าย ทั้งบนหน้าจอและตอน export
- หลีกเลี่ยง UI ที่รก การ์ดซ้อนการ์ด หรือ layout ที่ดูเหมือน template ทั่วไป
- ใช้ animation เฉพาะ feedback/สถานะสำคัญ เช่น การเลือกหมวดหมู่ เลขคำร้อง และ success state พร้อมรองรับ reduced motion

## 1.2 Responsive Field Use

- มือถือ: ให้เน้น flow เพิ่มคำร้องใหม่ ค้นหาเลขคำร้อง และดูสถานะอย่างรวดเร็ว
- แท็บเล็ต: ให้ใช้งานได้ครบใกล้เคียง desktop โดยตารางต้องอ่านและเลื่อนดูง่าย
- ปุ่มหลัก dropdown และแผงเลือกหมวดหมู่ต้องมี touch target ใหญ่พอสำหรับใช้นิ้วกด
- filter รายงานบนจอเล็กควรยุบเป็นแผงหรือจัดเรียงแนวตั้ง ไม่เบียดกัน
- ตารางบนมือถือควรเปลี่ยนเป็นรายการที่ scan ได้ แทนการบังคับเลื่อนแนวนอนทุกจุด
- success state หลังออกเลขคำร้องต้องเห็นชัดทั้งบนมือถือ แท็บเล็ต และ desktop

## 2. หน้าแรก
ปุ่มหลัก:
```text
[ เพิ่มคำร้องใหม่ ]
[ ค้นหา / แก้ไขคำร้อง ]
[ รายงานสถิติ ]
[ จัดการหมวดหมู่ ]
[ จัดการประเภทหลักฐาน ]
```

หน้าแรกต้องมีส่วน **คำร้องที่ควรติดตาม**:
- จำนวนคำร้องที่ยังไม่แจ้งผลและเก่ากว่าค่าที่กำหนด
- จำนวนคำร้องที่อยู่ระหว่างตรวจสอบภาพนานเกินกำหนด
- รายการคำร้องที่ควรติดตามล่าสุด พร้อมลิงก์ไปหน้าแก้ไข
- ห้ามใช้รูปแบบ queue/assignment ที่ทำให้ระบบดูเป็น case management

## 3. หน้าเพิ่มคำร้องใหม่
```text
วันที่รับคำร้อง: [ 16/06/2569 ]

ประเภทผู้ขอ:
[ ประชาชน ▼ ]

หมวดหมู่การขอดูภาพ:
[ อุบัติเหตุจราจร ] [ เหตุเกี่ยวกับทรัพย์สิน ]
[ ตรวจสอบเหตุการณ์ ] [ หน่วยงานราชการ ]

สถานะ:
[ รับคำร้องแล้ว ▼ ]

สถานที่เกิดเหตุ:
[ ______________________________ ]  ไม่บังคับ

หมายเหตุ:
[ ______________________________ ]  ไม่บังคับ

[ บันทึกและออกเลขคำร้อง ]
```

ต้องแสดง **เลขคำร้องโดยประมาณ** ตามวันที่รับคำร้อง:
```text
เลขคำร้องโดยประมาณ: C69-0042
เลขจริงออกเมื่อบันทึก
```

ค่า default ของประเภทผู้ขอและสถานะควรมาจากข้อมูลที่ใช้บ่อยจริง หากยังไม่มีข้อมูลให้ fallback เป็นค่าเริ่มต้น

Smart defaults และ location autocomplete ต้องโหลดหลังฟอร์มหลักแสดงแล้วได้ เพื่อให้หน้าเพิ่มคำร้องตอบสนองทันทีแม้ฐานข้อมูลหรือ runtime ช้า ห้ามทำให้ผู้ใช้ต้องรอข้อมูลช่วยเหลือก่อนเริ่มกรอก

หมวดหมู่การขอดูภาพต้องไม่เป็น dropdown ธรรมดา ให้ใช้แผงเลือกแบบ tile พร้อมไอคอนและสถานะ selected ที่ชัดเจน โดยยังส่งค่า `category_id` เหมือนเดิมเพื่อไม่กระทบฐานข้อมูล รายงาน และการนำเข้าข้อมูลย้อนหลัง

หลังบันทึกสำเร็จ:
```text
บันทึกสำเร็จ

เลขคำร้อง: C69-0001

กรุณาเขียนเลขนี้ที่หัวใบคำร้อง

[ แนบหลักฐาน ] [ เพิ่มคำร้องใหม่ ] [ กลับหน้าหลัก ]
```

ต้องมีปุ่มคัดลอกเลขคำร้อง และ success state ต้อง print-friendly

## 4. หน้าแนบหลักฐาน
```text
เลขคำร้อง: C69-0001

ประเภทหลักฐาน:
[ ใบคำร้อง ▼ ]

เลือกไฟล์:
[ Choose Files ]  รองรับหลายไฟล์

หมายเหตุไฟล์:
[ ______________________________ ]  ไม่บังคับ ใช้กับทุกไฟล์ในชุดนี้

[ อัปโหลดไฟล์ ]
```

เมื่อเลือกไฟล์แล้วต้องแสดง preview ก่อนอัปโหลด:
- รูปภาพแสดง thumbnail
- PDF/DOC/DOCX แสดงการ์ดชนิดไฟล์
- แสดงจำนวนไฟล์และขนาดรวม
- จำกัด default สูงสุด 5 ไฟล์ต่อครั้ง และ 4 MB ต่อไฟล์
- ระหว่างอัปโหลดต้องมี modal/pending state ชัดเจน

รายการไฟล์แนบ:
ต้องแสดงเป็น thumbnail/gallery:
- รูปภาพแสดง thumbnail จริงผ่าน endpoint ของระบบ
- PDF/DOC/DOCX แสดงการ์ดชนิดไฟล์
- ทุกไฟล์มีปุ่มดาวน์โหลดและลบ
- ลบไฟล์ต้องใช้ modal confirmation ไม่ใช้ browser confirm

## 5. หน้าค้นหา / แก้ไข
ตัวกรอง:
```text
เลขคำร้อง: [ C69-0001 ]
ช่วงวันที่: [ 01/06/2569 ] ถึง [ 30/06/2569 ]
ประเภทผู้ขอ: [ ทั้งหมด ▼ ]
หมวดหมู่: [ ทั้งหมด ▼ ]
สถานะ: [ ทั้งหมด ▼ ]
[ ค้นหา ]
```

ต้องมีมุมมองด่วน:
```text
[ ทั้งหมด ] [ เดือนนี้ ] [ ควรติดตาม ] [ พบภาพ ]
```

Duplicate hint:
- เมื่อกรอกวันที่ หมวดหมู่ และสถานที่ใกล้เคียงรายการเดิม ระบบแสดงคำแนะนำ "มีคำร้องคล้ายกันวันนี้"
- hint ต้องคลิกเปิดคำร้องเดิมได้
- hint ต้องไม่ block การบันทึกคำร้องใหม่

Location autocomplete:
- ช่องสถานที่ควรแนะนำจากสถานที่ที่เคยกรอก
- ผู้ใช้ยังพิมพ์อิสระได้เสมอ

ตารางผลลัพธ์:
| เลขคำร้อง | วันที่ | ประเภทผู้ขอ | หมวดหมู่ | สถานะ | สถานที่ | ไฟล์แนบ | จัดการ |
|---|---|---|---|---|---|---:|---|
| C69-0001 | 16/06/2569 | ประชาชน | อุบัติเหตุจราจร | รับคำร้องแล้ว | หน้าตลาด | 1 | แก้ไข |

## 6. หน้าแก้ไขคำร้อง
ต้องมี:
1. ข้อมูลคำร้อง
2. ปุ่มบันทึกการแก้ไข
3. ส่วนหลักฐานแนบ
4. ปุ่มเพิ่มไฟล์แนบ
5. ปุ่มลบคำร้องพร้อม confirmation
6. action สำหรับแก้เลขคำร้องโดยตรง พร้อมคำเตือนและ validation

## 7. หน้ารายงาน
```text
ช่วงวันที่:
[ 01/06/2569 ] ถึง [ 30/06/2569 ]

ประเภทผู้ขอ: [ ทั้งหมด ▼ ]
หมวดหมู่: [ ทั้งหมด ▼ ]
สถานะ: [ ทั้งหมด ▼ ]

[ แสดงรายงาน ] [ Export Excel ] [ Export PDF ]
```

แสดง:
- จำนวนคำร้องทั้งหมด
- สรุปตามหมวดหมู่
- สรุปตามประเภทผู้ขอ
- สรุปตามสถานะ
- ตารางรายการคำร้อง

หาก query รายงานยังไม่เสร็จ ต้องแสดง loading skeleton ที่รักษาขนาดพื้นที่ใกล้เคียงผลลัพธ์จริง เพื่อให้ navigation รู้สึกตอบสนองและลด layout shift

หัวรายงาน PDF:
```text
รายงานสถิติการขอดูภาพจากกล้องวงจรปิด
กลุ่มงานสถิติข้อมูลและสารสนเทศ
```

## 8. หน้าจัดการหมวดหมู่
| ลำดับ | หมวดหมู่ | สถานะ | จัดการ |
|---:|---|---|---|
| 1 | อุบัติเหตุจราจร | เปิดใช้งาน | แก้ไข / ปิดใช้งาน |

## 9. หน้าจัดการประเภทหลักฐาน
| ลำดับ | ประเภทหลักฐาน | สถานะ | จัดการ |
|---:|---|---|---|
| 1 | ใบคำร้อง | เปิดใช้งาน | แก้ไข / ปิดใช้งาน |

## 10. ข้อความแจ้งเตือน
| สถานการณ์ | ข้อความ |
|---|---|
| บันทึกสำเร็จ | บันทึกสำเร็จ |
| ได้เลขคำร้อง | กรุณาเขียนเลขนี้ที่หัวใบคำร้อง |
| ลบข้อมูล | ต้องการลบรายการนี้ใช่หรือไม่ |
| ไฟล์ผิดประเภท | ไม่รองรับประเภทไฟล์นี้ |
| ไม่พบข้อมูล | ไม่พบข้อมูลตามเงื่อนไขที่เลือก |
| เลขคำร้องไม่ตรงปีงบประมาณ | เลขคำร้องไม่ตรงกับปีงบประมาณของวันที่รับคำร้อง |
| เลขคำร้องโดยประมาณ | เลขจริงออกเมื่อบันทึก |
| กำลังบันทึก | ระบบกำลังตรวจสอบข้อมูลและบันทึกลงฐานข้อมูล |
| กำลังอัปโหลด | ระบบกำลังส่งไฟล์ไปยัง Vercel Blob และบันทึกข้อมูล |
| ยืนยัน action สำคัญ | ใช้ modal พร้อมปุ่มยืนยัน/ยกเลิก |

---

## WORKFLOW.md

# WORKFLOW.md

# Workflow การใช้งานและการทำงานของระบบ

เอกสารนี้อธิบาย flow หลักของเจ้าหน้าที่และ flow ภายในระบบสำหรับ CCTV Request Statistics System ช่วงทดลองใช้งานบน Vercel + Neon

## 1. Actors

| Actor | บทบาท |
|---|---|
| เจ้าหน้าที่ CCTV | เพิ่มคำร้อง ค้นหา แก้ไข แนบหลักฐาน และออกรายงาน |
| ผู้ดูแลระบบทดลอง | ตั้งค่า env vars, seed data, ตรวจ deploy และสำรองข้อมูล |
| ผู้บังคับบัญชา | รับรายงานสถิติจาก export PDF/Excel |

หมายเหตุ: version 1 ยังไม่แยก user role ในระบบ แต่จะมี shared password access gate ขั้นต่ำสำหรับป้องกัน public access ในช่วงทดลอง

## 2. Workflow: เข้าใช้งานระบบ

```text
เปิด URL บน Vercel
-> ถ้ายังไม่มี session ให้แสดงหน้าใส่รหัสผ่าน
-> เจ้าหน้าที่กรอก shared password
-> ระบบตรวจเทียบกับ APP_PASSWORD
-> ถ้าถูกต้อง ระบบตั้ง session cookie
-> เข้าหน้าหลักของระบบ
```

หลักการ:
- shared password เป็น access gate ไม่ใช่บัญชีผู้ใช้
- ไม่มี user role ใน version 1
- ไม่ควรแสดงข้อมูลคำร้องหรือไฟล์แนบก่อนผ่าน access gate
- ต้องมีทางออกจากระบบเพื่อล้าง session cookie

## 3. Workflow: เพิ่มคำร้องใหม่

```text
เปิดระบบ
-> เลือก เพิ่มคำร้องใหม่
-> ระบบแสดงฟอร์มหลักทันทีหลังผ่าน access gate และโหลดข้อมูลช่วยเหลือที่ไม่จำเป็นต่อการบันทึกตามมาทีหลัง
-> ตรวจวันที่รับคำร้อง
-> เลือกประเภทผู้ขอ
-> เลือกหมวดหมู่
-> เลือกสถานะ
-> กรอกสถานที่หรือหมายเหตุถ้ามี
-> กด บันทึกและออกเลขคำร้อง
-> ระบบบันทึกข้อมูลและออกเลข CYY-NNNN
-> เจ้าหน้าที่เขียนเลขบนหัวใบคำร้องกระดาษ
```

เกณฑ์สำคัญ:
- ต้องบันทึกได้โดยไม่แนบไฟล์
- หลังบันทึกต้องเห็นเลขคำร้องชัดเจน
- แก้ไขข้อมูลทั่วไปแล้วเลขคำร้องต้องไม่เปลี่ยนเอง
- ต้องมีทางแก้เลขคำร้องอย่างตั้งใจสำหรับ correction/backfill
- smart defaults และ location autocomplete ต้องไม่ทำให้การเปิดฟอร์มช้าลง และต้องไม่ block การบันทึก

## 4. Workflow: ออกเลขคำร้อง

```text
รับ request_date
-> คำนวณปี พ.ศ.
-> คำนวณปีงบประมาณ
-> หาเลข sequence ถัดไปของปีงบประมาณนั้น
-> สร้าง request_no เช่น C69-0001
-> บันทึกใน transaction
-> ถ้าเลขชนกัน ให้ retry หรือแจ้ง error ที่ควบคุมได้
```

กติกา:
- ปีงบประมาณเริ่ม 1 ตุลาคม
- 2026-06-16 อยู่ปีงบประมาณ 2569
- 2026-10-01 อยู่ปีงบประมาณ 2570
- ลบคำร้องแล้วไม่ควรนำเลขเดิมกลับมาใช้ซ้ำ

## 5. Workflow: แนบหลักฐาน

```text
เปิดคำร้องที่มีเลขแล้ว
-> เลือกประเภทหลักฐาน
-> เลือกไฟล์หนึ่งไฟล์หรือหลายไฟล์
-> ระบบแสดง preview/thumbnail สำหรับไฟล์ที่เลือก
-> ระบบตรวจ extension, จำนวนไฟล์, และขนาดไฟล์ต่อไฟล์
-> upload ไฟล์ไป Vercel Blob Private Storage
-> บันทึก metadata ใน Neon
-> แสดง thumbnail/gallery ของไฟล์แนบในหน้าคำร้อง
```

กติกา:
- หลักฐานแนบเป็น optional
- ไม่รับวิดีโอ CCTV
- ห้ามเปิดไฟล์ผ่าน public URL ตรง ๆ
- ดาวน์โหลดต้องผ่าน endpoint ของระบบ
- ลบไฟล์ต้องถามยืนยันด้วย modal
- upload/delete/save ต้องมี modal หรือ pending state ให้ผู้ใช้รู้ว่าระบบกำลังทำงาน
- default อัปโหลดได้สูงสุด 5 ไฟล์ต่อครั้ง และขนาดไม่เกิน 4 MB ต่อไฟล์

Metadata ที่ควรเก็บ:
- `request_id`
- `evidence_type_id`
- `original_file_name`
- `blob_url`
- `download_url`
- `blob_pathname`
- `content_type`
- `size_bytes`
- `note`
- `uploaded_at`

## 6. Workflow: ดาวน์โหลดหลักฐาน

```text
เจ้าหน้าที่กด ดาวน์โหลด
-> ระบบตรวจว่าไฟล์แนบมี metadata
-> ระบบอ่านไฟล์จาก private storage
-> ส่งไฟล์กลับเป็น download response
```

หลักการ:
- UI ไม่ควรแสดง private storage URL
- ต้องตรวจ session จาก access gate ก่อน download
- ถ้าไฟล์หายจาก storage แต่ metadata ยังอยู่ ต้องแสดง error ที่เข้าใจง่าย

## 7. Workflow: ค้นหาและแก้ไข

```text
เปิดหน้า ค้นหา / แก้ไขคำร้อง
-> ใส่เลขคำร้อง หรือเลือก filter
-> กด ค้นหา
-> ระบบแสดงตารางรายการ
-> กด แก้ไข
-> ปรับสถานะ สถานที่ หรือหมายเหตุ
-> บันทึก
```

ข้อห้าม:
- การแก้ไขข้อมูลทั่วไปต้องไม่ออกเลขใหม่
- การแก้เลขคำร้องต้องเป็น action ที่ตั้งใจ มี validation และ confirmation
- การปิดใช้งานหมวดหมู่ใน master data ต้องไม่ทำให้รายการย้อนหลังอ่านไม่ออก

## 7.1 Workflow: แก้เลขคำร้องหรือข้อมูลย้อนหลัง

```text
เปิดหน้าแก้ไขคำร้อง
-> เลือกแก้ไขเลขคำร้อง
-> ระบบแสดงคำเตือนว่าเลขนี้ใช้อ้างอิงใบคำร้องกระดาษ
-> เจ้าหน้าที่กรอกเลขรูปแบบ CYY-NNNN
-> ระบบตรวจ format และตรวจว่าไม่ซ้ำ
-> ระบบตรวจว่า YY ตรงกับปีงบประมาณจากวันที่คำร้อง
-> บันทึกเลขใหม่
```

หลักการ:
- ใช้สำหรับ correction/backfill ไม่ใช่ flow ปกติของการเพิ่มคำร้องเร็ว
- เลขใหม่ต้องค้นหาได้ทันที
- ถ้าเลขกับวันที่อยู่คนละปีงบประมาณ ต้องไม่ยอมบันทึกและแสดงข้อความแจ้งเตือน
- ถ้ามีไฟล์แนบอยู่แล้ว ความสัมพันธ์ยังยึดตาม `request_id` ไม่ใช่ชื่อไฟล์

## 8. Workflow: ลบคำร้อง

```text
เปิดหน้าแก้ไขคำร้อง
-> กด ลบคำร้อง
-> ระบบถามยืนยัน
-> ระบบทำ soft delete
-> กลับไปหน้าค้นหา
```

หลักการ:
- ไม่ hard delete คำร้องใน version 1
- เลขคำร้องของรายการที่ถูกลบยังถูก reserve และห้าม reuse
- รายงานและค้นหาปกติซ่อนรายการที่ถูกลบ
- อนาคตอาจเพิ่ม filter สำหรับดูรายการที่ถูกลบเพื่อ audit/restore
- MVP ยังไม่มีหน้า audit/restore รายการที่ถูกลบ

## 9. Workflow: จัดการ Master Data

```text
เปิดหน้าจัดการหมวดหมู่หรือประเภทหลักฐาน
-> เพิ่มหรือแก้ไขชื่อ
-> ปรับลำดับ
-> เปิดหรือปิดใช้งาน
-> ระบบอัปเดต dropdown สำหรับคำร้องใหม่
```

หลักการ:
- ใช้ soft deactivate แทน hard delete เมื่อรายการเคยถูกใช้งาน
- รายงานย้อนหลังยังต้องแสดงค่าที่เคยบันทึกไว้

## 10. Workflow: รายงานสถิติ

```text
เปิดหน้า รายงานสถิติ
-> ระบบแสดง shell และ loading skeleton ก่อนหาก query รายงานยังทำงานอยู่
-> เลือกวันที่เริ่มต้นและวันที่สิ้นสุด
-> เลือก filter เพิ่มเติมถ้าต้องการ
-> กด แสดงรายงาน
-> ระบบแสดง summary และตารางรายการ
-> export Excel หรือ PDF
```

รายงานต้องมี:
- จำนวนคำร้องทั้งหมด
- สรุปตามหมวดหมู่
- สรุปตามประเภทผู้ขอ
- สรุปตามสถานะ
- ตารางรายการคำร้อง

## 11. Workflow: Export Backup

```text
ผู้ดูแลระบบกด Export Backup
-> ระบบดึงข้อมูลตารางหลักทั้งหมด
-> สร้าง Excel หลาย sheet
-> ส่งไฟล์ให้ดาวน์โหลด
```

Sheet ที่ควรมี:
- `requests`
- `requester_types`
- `categories`
- `statuses`
- `evidence_types`
- `attachments`

หมายเหตุ:
- Backup ระยะทดลองควรเริ่มจาก metadata และข้อมูลตาราง
- Backup ระยะทดลองยังไม่รวม binary blob files

## 12. Trial Deployment Workflow

```text
สร้าง GitHub repository
-> push source code ไป GitHub
-> import GitHub repo เข้า Vercel
-> เตรียม Neon database
-> เตรียม Blob storage ใน Vercel project
-> ตั้งค่า env vars บน Vercel
-> deploy preview
-> ทดสอบ shared password access gate
-> seed master data
-> ทดสอบเพิ่มคำร้อง
-> ทดสอบแนบไฟล์
-> ถ้าเป็น automated E2E staging ให้เปิด E2E_FIXTURES_ENABLED=1 แล้วเรียก POST /api/test-fixtures/e2e หลัง login
-> ทดสอบรายงานและ export
```

GitHub repo สำหรับทดลอง deploy:
```text
https://github.com/poppatompong-dev/CCTVstat.git
```

Env vars ที่คาดว่าจะต้องมี:
- `DATABASE_URL`
- `APP_PASSWORD`
- `SESSION_SECRET`
- `BLOB_READ_WRITE_TOKEN`
- `REPORT_ORGANIZATION_NAME`
- `FOLLOW_UP_DAYS` optional
- `MAX_UPLOAD_BYTES` optional
- `MAX_UPLOAD_FILES` optional
- `PERF_DB_PROBE` optional สำหรับ diagnostic ชั่วคราว
- `E2E_FIXTURES_ENABLED` optional สำหรับ automated E2E staging/preview เท่านั้น

## 13. Failure Workflows

| เหตุการณ์ | พฤติกรรมที่ควรเกิด |
|---|---|
| Neon connection ล้มเหลว | แจ้งว่าระบบฐานข้อมูลไม่พร้อม |
| ออกเลขคำร้องชนกัน | retry ใน transaction หรือแจ้งให้ลองใหม่ |
| Upload ไฟล์ไม่ผ่าน | ไม่กระทบข้อมูลคำร้องหลัก |
| Download ไฟล์ไม่เจอ | แจ้งว่าไม่พบไฟล์แนบ แต่ไม่ลบ metadata อัตโนมัติ |
| Export PDF fail | ยังควร export Excel ได้ |

## 14. Implementation Readiness

ไม่มี owner decision ที่บล็อก implementation แล้ว

---

## docs/adr/0001-use-shared-password-access-gate-for-vercel-trial.md

# Use shared password access gate for Vercel trial

For version 1, the system will be deployed on Vercel for trial use, which means the app has a public URL instead of being protected by an office LAN. We will add a lightweight shared-password access gate using an environment variable and a session cookie, rather than full user accounts or role management, because the project prioritizes fast internal use while still avoiding an unprotected public surface for request records and evidence attachments.

---

## docs/adr/0002-use-vercel-blob-private-storage-for-attachments.md

# Use Vercel Blob Private Storage for attachments

For the trial deployment, the app will run on Vercel without a persistent office server, so evidence attachments cannot rely on a local `uploads/` folder. We will store attachment files in Vercel Blob Private Storage and keep only metadata in Neon PostgreSQL, because this keeps the stack cloud-native, avoids public file URLs in the UI, and preserves the requirement that downloads go through the application access gate.

---

## docs/adr/0003-allow-request-number-correction-for-backfill.md

# Allow request number correction for backfill

The app generates a short request number on first save, but the number must remain editable in a deliberate correction/backfill flow because the municipality may later import historical paper records. Request numbers must still be unique and validated, and ordinary edits should not accidentally change the number.

---

## docs/adr/0004-use-soft-delete-for-requests.md

# Use soft delete for requests

Requests will use soft delete instead of hard delete so historical request numbers, reports, and backfill/import work remain auditable. Deleted requests are hidden from normal search/report totals by default, but their numbers stay reserved and can be reviewed or restored later if needed.

---

## docs/adr/0005-reject-request-number-fiscal-year-mismatch.md

# Reject request number fiscal year mismatch

When a request number is manually corrected or imported for backfill, the `CYY` portion must match the Thai fiscal year derived from `request_date`. The app will reject mismatches with a clear validation message instead of allowing a warning-only save, because mismatched request numbers would make fiscal-year reporting unreliable.

---
