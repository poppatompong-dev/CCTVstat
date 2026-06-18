# CCTV Request Statistics System - All Markdown Documents

เอกสารรวมทุกไฟล์สำหรับโปรเจกต์ระบบบันทึกสถิติหมวดหมู่การขอดูภาพจากกล้องวงจรปิด


---

# File: ACCEPTANCE_CRITERIA.md

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

## 2. UX Criteria
| เกณฑ์ | ค่าเป้าหมาย |
|---|---|
| เพิ่มคำร้องไม่แนบไฟล์ | ไม่เกิน 30 วินาที |
| field บังคับ | ไม่เกิน 4 field |
| เมนูหลัก | ไม่เกิน 5 เมนู |
| การแนบไฟล์ | ไม่บังคับ |
| เลขคำร้องหลังบันทึก | ต้องแสดงเด่นชัด |

## 3. Request Number Criteria
| สถานการณ์ | ผลที่ต้องได้ |
|---|---|
| คำร้องแรกปีงบ 2569 | `C69-0001` |
| คำร้องถัดไป | `C69-0002` |
| ขึ้นปีงบใหม่ | เริ่มลำดับใหม่ |
| แก้ไขคำร้อง | เลขเดิมไม่เปลี่ยน |
| ลบคำร้อง | ไม่ควรนำเลขเดิมกลับมาใช้ซ้ำ |

## 4. Attachment Criteria
| เกณฑ์ | รายละเอียด |
|---|---|
| แนบไฟล์ได้ | PDF, JPG, JPEG, PNG, DOC, DOCX |
| Block ไฟล์อันตราย | EXE, BAT, CMD, JS, SH, PHP, HTML |
| แสดงรายการไฟล์แนบ | ต้องมี |
| ดาวน์โหลดไฟล์ | ต้องได้ |
| ลบไฟล์แนบ | ต้องถามยืนยัน |
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

# File: AGENT_TASKS.md

# AGENT_TASKS.md

# รายการงานสำหรับ AI Agent

## Phase 1: Project Setup
- [ ] สร้าง project structure
- [ ] ตั้งค่า TypeScript
- [ ] ตั้งค่า SQLite
- [ ] สร้าง `.env.example`
- [ ] สร้างโฟลเดอร์ `uploads/`
- [ ] เขียน README วิธี run

## Phase 2: Database
- [ ] สร้างตาราง requester_types
- [ ] สร้างตาราง categories
- [ ] สร้างตาราง statuses
- [ ] สร้างตาราง evidence_types
- [ ] สร้างตาราง requests
- [ ] สร้างตาราง request_attachments
- [ ] สร้าง seed data
- [ ] สร้าง migration/initialization script

## Phase 3: Request Number
- [ ] แปลง ค.ศ. เป็น พ.ศ.
- [ ] คำนวณปีงบประมาณ
- [ ] สร้างเลข `CYY-NNNN`
- [ ] reset running number ตามปีงบประมาณ
- [ ] ป้องกันเลขซ้ำ
- [ ] ทดสอบวันที่ 30 ก.ย. และ 1 ต.ค.

## Phase 4: Add Request
- [ ] สร้างหน้าเพิ่มคำร้อง
- [ ] วันที่ default วันนี้
- [ ] dropdown ประเภทผู้ขอ
- [ ] dropdown หมวดหมู่
- [ ] dropdown สถานะ
- [ ] field สถานที่และหมายเหตุ
- [ ] ปุ่มบันทึกและออกเลข
- [ ] success message พร้อมเลขคำร้องใหญ่ชัดเจน

## Phase 5: Search / Edit
- [ ] ค้นหาด้วยเลขคำร้อง
- [ ] ค้นหาด้วยช่วงวันที่
- [ ] filter ประเภทผู้ขอ
- [ ] filter หมวดหมู่
- [ ] filter สถานะ
- [ ] แก้ไขคำร้อง
- [ ] ลบคำร้องพร้อม confirmation

## Phase 6: Master Data
- [ ] จัดการหมวดหมู่
- [ ] จัดการประเภทหลักฐาน
- [ ] เพิ่ม/แก้ไข/เรียงลำดับ/เปิดปิดใช้งาน
- [ ] ป้องกัน hard delete หากถูกใช้แล้ว

## Phase 7: Attachments
- [ ] ฟอร์มอัปโหลดไฟล์
- [ ] เลือกประเภทหลักฐาน
- [ ] ตรวจ extension
- [ ] ตรวจ MIME type
- [ ] จำกัดขนาดไฟล์
- [ ] safe file name
- [ ] บันทึก metadata
- [ ] แสดงรายการไฟล์
- [ ] ดาวน์โหลดไฟล์
- [ ] ลบไฟล์พร้อม confirmation

## Phase 8: Reports
- [ ] filter ช่วงวันที่
- [ ] filter ประเภทผู้ขอ
- [ ] filter หมวดหมู่
- [ ] filter สถานะ
- [ ] summary total
- [ ] count by category
- [ ] count by requester type
- [ ] count by status
- [ ] table records
- [ ] Export Excel
- [ ] Export PDF
- [ ] Export Backup

## Phase 9: QA
- [ ] ทดสอบเพิ่มคำร้องไม่เกิน 30 วินาที
- [ ] ทดสอบเลขคำร้อง
- [ ] ทดสอบแนบไฟล์
- [ ] ทดสอบ block ไฟล์อันตราย
- [ ] ทดสอบรายงาน
- [ ] ทดสอบ export
- [ ] ตรวจว่าไม่มี field ข้อมูลส่วนบุคคลเกินจำเป็น


---

# File: API_SPEC.md

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

### Detail
```http
GET /api/requests/{id}
```

### Update
```http
PUT /api/requests/{id}
```

### Delete
```http
DELETE /api/requests/{id}
```

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

Response:
```json
{
  "total": 25,
  "by_category": [],
  "by_requester_type": [],
  "by_status": [],
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

## 6. Validation
| Field | Rule |
|---|---|
| request_date | required, valid date |
| requester_type_id | required |
| category_id | required |
| status_id | required |
| file | optional |
| file extension | allowed only |
| file size | max size |


---

# File: ATTACHMENT_SPEC.md

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
ค่าเริ่มต้นแนะนำ: 10 MB ต่อไฟล์ และควรปรับได้จาก config

## 8. Folder Structure
```text
uploads/
  requests/
    C69-0001/
      C69-0001_20260616_143000_request-form.pdf
    C69-0002/
      C69-0002_20260616_150000_request-form.jpg
```

## 9. File Naming
รูปแบบแนะนำ:
```text
{request_no}_{YYYYMMDD}_{HHmmss}_{safe_original_name}
```

เก็บทั้ง:
- `original_file_name`
- `stored_file_name`

## 10. Metadata
| Field | รายละเอียด |
|---|---|
| request_id | คำร้องที่เกี่ยวข้อง |
| evidence_type_id | ประเภทหลักฐาน |
| original_file_name | ชื่อไฟล์เดิม |
| stored_file_name | ชื่อไฟล์จัดเก็บ |
| file_path | ตำแหน่งไฟล์ |
| mime_type | MIME type |
| file_size | ขนาดไฟล์ |
| note | หมายเหตุ |
| uploaded_at | วันที่อัปโหลด |

## 11. Security
- ห้ามให้ upload folder execute file
- ห้ามเปิดไฟล์ผ่าน public URL โดยตรง
- ดาวน์โหลดผ่าน endpoint ของระบบเท่านั้น
- ตรวจ extension และ MIME type
- ป้องกัน path traversal เช่น `../../`


---

# File: CHANGELOG.md

# CHANGELOG.md

# Changelog

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


---

# File: DATA_MODEL.md

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
| created_at | datetime | yes | วันที่สร้าง |
| updated_at | datetime | yes | วันที่แก้ไขล่าสุด |

Constraints:
- `request_no` unique
- `(fiscal_year, sequence_no)` unique

## 2. requester_types
| Field | Type | Required |
|---|---|---:|
| id | integer | yes |
| name | text | yes |
| sort_order | integer | yes |
| is_active | boolean | yes |
| created_at | datetime | yes |
| updated_at | datetime | yes |

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
| stored_file_name | text | yes | ชื่อไฟล์ในระบบ |
| file_path | text | yes | path ไฟล์ |
| mime_type | text | yes | MIME type |
| file_size | integer | yes | bytes |
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

ตัวอย่าง:
| request_date | fiscal_year | sequence | request_no |
|---|---:|---:|---|
| 2026-06-16 | 2569 | 1 | C69-0001 |
| 2026-10-01 | 2570 | 1 | C70-0001 |


---

# File: DEPLOYMENT.md

# DEPLOYMENT.md

# แนวทางติดตั้งระบบ

## 1. สภาพแวดล้อมที่เหมาะสม
ระบบนี้เหมาะกับ:
1. เครื่องคอมพิวเตอร์ภายในสำนักงาน
2. เครื่อง server ภายในเทศบาล
3. Mini PC / NUC ในเครือข่าย LAN
4. Internal hosting ที่จำกัดการเข้าถึง

## 2. Stack แนะนำ
| Layer | Recommendation |
|---|---|
| Frontend | React / Next.js |
| Backend | Next.js API routes หรือ Node.js Express |
| Database | SQLite |
| File storage | Local folder `uploads/` |
| Excel Export | xlsx library |
| PDF Export | pdfmake / jsPDF / server-side PDF |

## 3. Environment Variables
ตัวอย่าง `.env`
```env
DATABASE_URL="file:./data/app.db"
UPLOAD_DIR="./uploads"
MAX_UPLOAD_SIZE_MB=10
APP_NAME="CCTV Request Statistics System"
```

## 4. Folder Structure
```text
cctv-request-statistics/
  app/
  components/
  lib/
  data/
    app.db
  uploads/
    requests/
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
```bash
npm install
npm run build
npm run start
```

หากต้องให้เครื่องอื่นใน LAN เข้าได้ ให้ bind host เป็น `0.0.0.0` ตาม framework ที่ใช้

## 7. Backup
สำรองอย่างน้อย:
| รายการ | Path ตัวอย่าง |
|---|---|
| Database | `data/app.db` |
| Upload files | `uploads/` |
| Config | `.env` |

## 8. Restore
1. ปิดระบบ
2. นำ `app.db` กลับไปไว้ที่ `data/`
3. นำ `uploads/` กลับไปวางที่เดิม
4. ตรวจสอบ config
5. เปิดระบบใหม่

## 9. Security Notes
- ไม่ควรเปิด public internet ใน version 1
- ใช้งานผ่าน LAN เป็นหลัก
- upload folder ต้องไม่ execute file
- สำรองข้อมูลสม่ำเสมอ
- หากมีผู้ใช้หลายคนพร้อมกัน ต้องทดสอบการออกเลขซ้ำ


---

# File: PROJECT_DECISIONS.md

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

## 4. นับตามปีงบประมาณ
เหมาะกับงานราชการและรายงานผู้บังคับบัญชา

## 5. ไม่บังคับ login ใน version 1
เหตุผล:
- ลดความยุ่งยาก
- ใช้ภายในสำนักงาน
- ต้องการ MVP ที่ใช้งานได้เร็ว

ข้อจำกัด:
- ควรใช้งานใน LAN เท่านั้น
- หากเปิดนอกสำนักงานควรเพิ่ม login

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


---

# File: PROMPT.md

# PROMPT.md

You are an expert full-stack developer. Build a small internal web application for a municipality CCTV team.

## Project
CCTV Request Statistics System

## Objective
Build a very simple internal web app for recording statistical categories of CCTV footage viewing requests. The paper request form remains the official document. The app only helps staff generate a short reference number, select categories/statuses, optionally attach evidence, and produce reports.

## Core Principle
> Keep the system extremely simple. Do not create unnecessary workload for staff.

## Recommended Stack
- Frontend: React or Next.js
- Language: TypeScript
- Styling: Tailwind CSS or simple CSS
- Database: SQLite
- File storage: local controlled upload folder
- Export: Excel and PDF
- Authentication: not required in version 1
- Deployment: local PC or internal office server

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

# File: README.md

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


---

# File: REPORT_SPEC.md

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
- requests
- requester_types
- categories
- statuses
- evidence_types
- attachments


---

# File: REQUIREMENTS.md

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
| หมวดหมู่ | Dropdown | เลือก |
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


---

# File: SECURITY_PRIVACY.md

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
เนื่องจากไม่ทำ login ใน version 1:
- ควรใช้ใน LAN
- ไม่ควรเปิด public internet
- จำกัดสิทธิ์โฟลเดอร์ `uploads`
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
1. Database เช่น `app.db`
2. โฟลเดอร์ `uploads/`
3. config เช่น `.env`


---

# File: SEED_DATA.md

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

# File: TEST_PLAN.md

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

## 2. Request Number
| TC | ทดสอบ | ผลที่คาดหวัง |
|---|---|---|
| 1 | คำร้องแรกปีงบประมาณ 2569 | `C69-0001` |
| 2 | คำร้องถัดไป | `C69-0002` |
| 3 | วันที่ 2026-09-30 | ยังเป็นปีงบประมาณ 2569 |
| 4 | วันที่ 2026-10-01 | เริ่ม `C70-0001` |
| 5 | แก้ไขคำร้อง | เลขไม่เปลี่ยน |

## 3. Search / Edit
| TC | ทดสอบ | ผลที่คาดหวัง |
|---|---|---|
| 1 | ค้นหาด้วยเลขคำร้อง | พบรายการ |
| 2 | ค้นหาด้วยช่วงวันที่ | แสดงข้อมูลถูกช่วง |
| 3 | filter หมวดหมู่ | แสดงเฉพาะหมวด |
| 4 | แก้ไขสถานะ | บันทึกสำเร็จ |
| 5 | ลบรายการ | ถามยืนยันก่อนลบ |

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

## 7. Performance Target
| รายการ | เป้าหมาย |
|---|---|
| เพิ่มคำร้องไม่แนบไฟล์ | ไม่เกิน 30 วินาที |
| Export Excel | รองรับข้อมูลอย่างน้อย 5,000 รายการ |
| ค้นหา | ไม่ช้าเกินจำเป็นสำหรับข้อมูลหลักพันรายการ |


---

# File: UI_SPEC.md

# UI_SPEC.md

# ข้อกำหนดหน้าจอ

## 1. หลักการออกแบบ
| หลักการ | รายละเอียด |
|---|---|
| เร็ว | บันทึกคำร้องโดยไม่แนบไฟล์ไม่เกิน 30 วินาที |
| ง่าย | ใช้ dropdown และปุ่มใหญ่ |
| สั้น | ฟอร์มเพิ่มคำร้องมี field บังคับน้อย |
| ไม่บังคับไฟล์ | แนบหลักฐานได้ภายหลัง |
| ภาษาไทย | ทุกหน้าจอใช้ภาษาไทย |

## 2. หน้าแรก
ปุ่มหลัก:
```text
[ เพิ่มคำร้องใหม่ ]
[ ค้นหา / แก้ไขคำร้อง ]
[ รายงานสถิติ ]
[ จัดการหมวดหมู่ ]
[ จัดการประเภทหลักฐาน ]
```

## 3. หน้าเพิ่มคำร้องใหม่
```text
วันที่รับคำร้อง: [ 16/06/2569 ]

ประเภทผู้ขอ:
[ ประชาชน ▼ ]

หมวดหมู่การขอดูภาพ:
[ อุบัติเหตุจราจร ▼ ]

สถานะ:
[ รับคำร้องแล้ว ▼ ]

สถานที่เกิดเหตุ:
[ ______________________________ ]  ไม่บังคับ

หมายเหตุ:
[ ______________________________ ]  ไม่บังคับ

[ บันทึกและออกเลขคำร้อง ]
```

หลังบันทึกสำเร็จ:
```text
บันทึกสำเร็จ

เลขคำร้อง: C69-0001

กรุณาเขียนเลขนี้ที่หัวใบคำร้อง

[ แนบหลักฐาน ] [ เพิ่มคำร้องใหม่ ] [ กลับหน้าหลัก ]
```

## 4. หน้าแนบหลักฐาน
```text
เลขคำร้อง: C69-0001

ประเภทหลักฐาน:
[ ใบคำร้อง ▼ ]

เลือกไฟล์:
[ Choose File ]

หมายเหตุไฟล์:
[ ______________________________ ]  ไม่บังคับ

[ อัปโหลดไฟล์ ]
```

รายการไฟล์แนบ:
| ประเภท | ชื่อไฟล์ | ขนาด | วันที่อัปโหลด | จัดการ |
|---|---|---:|---|---|
| ใบคำร้อง | request-form.pdf | 512 KB | 16/06/2569 14:30 | ดาวน์โหลด / ลบ |

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
