# DATA_MODEL.md

# โครงสร้างข้อมูล

## ตารางหลัก
1. `requests`
2. `requester_types`
3. `categories`
4. `statuses`
5. `evidence_types`
6. `request_attachments`
7. `delivery_item_types`
8. `request_deliveries`
9. `request_counters`

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
| semantic_key | text | no |
| sort_order | integer | yes |
| is_active | boolean | yes |
| created_at | datetime | yes |
| updated_at | datetime | yes |

Rule: `semantic_key` ใช้กับ logic ภายใน เช่น `received`, `checking`, `found`, `not_found`, `notified`, `other` เพื่อให้รายงานและ dashboard ไม่ผูกกับชื่อสถานะภาษาไทยโดยตรง

### Master Data Ordering Rules

- `sort_order` เป็นค่าที่ระบบดูแล ไม่ใช่ช่องที่ผู้ใช้กรอก
- รายการใหม่ใช้ค่าถัดจาก `sort_order` สูงสุดของตารางนั้น
- เมื่อมีการลากเรียง ระบบรับ ID ครบทั้งตาราง ตรวจว่าไม่ซ้ำ/ไม่ขาด/ไม่มี ID แปลกปลอม แล้วเขียนตำแหน่งใหม่เป็น `1..N`
- ลำดับครอบคลุมทั้งรายการ active และ inactive; การเปิดหรือปิดใช้งานไม่ทำให้ลำดับเปลี่ยนเอง
- ระหว่างเตรียม schema ระบบตรวจลำดับเดิมของทั้ง 4 ตารางและปรับเลขซ้ำหรือช่องว่างให้เป็น `1..N` ตามลำดับเดิม

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

## 7. delivery_item_types
| Field | Type | Required | Description |
|---|---|---:|---|
| id | integer | yes | Primary key |
| name | text | yes | ชื่อประเภทข้อมูลที่ส่งมอบ |
| sort_order | integer | yes | ลำดับการแสดง |
| is_active | boolean | yes | เปิด/ปิดใช้งาน |
| created_at | datetime | yes | วันที่สร้าง |
| updated_at | datetime | yes | วันที่แก้ไขล่าสุด |

Rule: เป็น master table ใช้รูปแบบเดียวกับ requester_types ฯลฯ รองรับการเพิ่ม แก้ไข ปิดใช้งาน และลากเรียงลำดับ

ประเภทข้อมูลที่ส่งมอบเริ่มต้น:
1. ไฟล์วิดีโอจากกล้อง
2. ภาพนิ่ง/ภาพถ่ายหน้าจอ
3. รายงานผลการตรวจสอบ
4. หนังสือแจ้งผล
5. อื่น ๆ

## 8. request_deliveries
| Field | Type | Required | Description |
|---|---|---:|---|
| id | integer | yes | Primary key |
| request_id | integer | yes | FK ไป requests (CASCADE) |
| delivery_item_type_id | integer | yes | FK ไป delivery_item_types |
| delivery_method | text | yes | ช่องทางส่งมอบ เช่น รับด้วยตนเอง อีเมล ไลน์ |
| recipient_name | text | no | ชื่อผู้รับ |
| delivered_at | datetime | yes | วันที่ส่งมอบ |
| note | text | no | หมายเหตุ |
| created_at | datetime | yes | วันที่บันทึก |

Rule:
- หนึ่งคำร้องสามารถมีได้หลายรายการส่งมอบ
- การลบคำร้อง (soft delete) จะไม่ลบรายการส่งมอบ แต่รายงานปกติจะไม่แสดงคำร้องที่ถูกลบ
- `delivery_method` เป็นค่าอิสระ แต่มีค่าแนะนำในระบบ: รับด้วยตนเอง, อีเมล, ไลน์ (LINE), ไปรษณีย์, USB / แผ่นบันทึก, ระบบออนไลน์, อื่น ๆ
- ช่องทางส่งมอบกำหนดใน `src/lib/delivery.ts` (DELIVERY_METHODS)

## 9. request_counters
| Field | Type | Required | Description |
|---|---|---:|---|
| fiscal_year | integer | yes | Primary key (ปีงบประมาณ พ.ศ.) |
| last_sequence | integer | yes | เลขลำดับล่าสุดที่ออกแล้ว |
| updated_at | datetime | yes | วันที่อัปเดตล่าสุด |

Rule:
- ใช้สำหรับการออกเลขคำร้องแบบ atomic (กัน race condition)
- เมื่อเตรียม schema ระบบจะ seed ค่าเริ่มต้นจาก `MAX(sequence_no)` ของแต่ละปีงบประมาณที่มีอยู่
- การออกเลขใช้ `INSERT ... ON CONFLICT DO UPDATE SET last_sequence = GREATEST(counter, max_existing) + 1` เพื่อรับประกันความ unique

## ความสัมพันธ์
```text
requests 1 ---- many request_attachments
requests 1 ---- many request_deliveries
evidence_types 1 ---- many request_attachments
delivery_item_types 1 ---- many request_deliveries
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
sequence_no = allocateSequenceNo(fiscal_year)  // atomic via request_counters
request_no = "C" + yy + "-" + sequence_no padded 4 digits
```

การออกเลขใช้ตาราง `request_counters` เพื่อรับประกันความ unique แม้มีการบันทึกพร้อมกัน โดยใช้ `INSERT ... ON CONFLICT DO UPDATE` แบบ atomic ส่วน `nextRequestNumber` สำหรับ preview จะอ่านค่า `GREATEST(counter, max(sequence_no)) + 1` โดยไม่กลายเป็น counter

สำหรับข้อมูลย้อนหลังหรือการแก้เลขโดยตรง ระบบควรรับเลข `CYY-NNNN` ที่ผู้ใช้กำหนดเองได้เมื่อไม่ซ้ำ และต้อง reject หาก `YY` ไม่ตรงกับปีงบประมาณที่คำนวณจาก `request_date`

ตัวอย่าง:
| request_date | fiscal_year | sequence | request_no |
|---|---:|---:|---|
| 2026-06-16 | 2569 | 1 | C69-0001 |
| 2026-10-01 | 2570 | 1 | C70-0001 |
