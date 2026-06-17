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
