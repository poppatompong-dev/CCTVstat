# PROGRESSIVE.md

# แผนพัฒนาแบบไล่ระดับ

เอกสารนี้ใช้กำหนดลำดับการทำระบบ CCTV Request Statistics System ให้ค่อย ๆ ใช้งานได้จริงบน cloud free tier โดยไม่ทำให้ MVP ใหญ่เกินจำเป็น

## 1. หลักการ

| หลักการ | ความหมาย |
|---|---|
| ใช้งานได้เร็ว | เจ้าหน้าที่ต้องบันทึกคำร้องและได้เลขอ้างอิงก่อน |
| Cloud-first | ช่วงทดลองใช้ไม่มีเครื่อง server ภายใน จึงต้องรองรับ Vercel และ Neon |
| เก็บเท่าที่จำเป็น | ไม่เพิ่ม field ข้อมูลส่วนบุคคลที่ไม่จำเป็นต่อสถิติ |
| แนบไฟล์เป็น optional | คำร้องต้องบันทึกได้แม้ยังไม่มีหลักฐานแนบ |
| รายงานถูกต้องหลายมิติ | รายงานต้อง filter และสรุปได้ตามช่วงวันที่ หมวดหมู่ ประเภทผู้ขอ และสถานะ |
| UI สวยงามแต่ไม่ช้า | หน้าจอต้องอ่านง่าย ดูเป็นงานราชการสมัยใหม่ และยังบันทึกคำร้องได้เร็ว |
| ใช้งานหน้างานได้ | มือถือและแท็บเล็ตต้องเพิ่มคำร้อง ค้นหา และดูสถานะได้สะดวก |
| ประสิทธิภาพเพียงพอ | ค้นหาและ export ต้องรองรับข้อมูลหลักพันรายการในช่วงทดลอง |
| ตัด scope ที่เสี่ยง | ไม่รับวิดีโอ CCTV และไม่ทำ case management ใน version 1 |

## 2. Progressive Slices

### Slice 0: Decision Lock

เป้าหมาย:
- ยืนยัน stack สำหรับช่วงทดลอง
- ยืนยันวิธีป้องกันการเข้าถึงเมื่อ deploy บน public URL
- ยืนยันวิธีเก็บไฟล์แนบบน cloud

สถานะที่ต้องตกผลึกก่อน implement:
- App hosting: Vercel
- Database: Neon PostgreSQL
- File storage: Vercel Blob Private Storage
- Access control: shared password access gate ด้วย `APP_PASSWORD` และ session cookie

### Slice 1: Project Skeleton

เป้าหมาย:
- สร้าง Next.js + TypeScript project
- ตั้งค่า environment variables
- เตรียม connection ไป Neon แบบ lazy initialization
- เตรียมโครงสร้างหน้าหลักภาษาไทย

ยังไม่ทำ:
- Upload จริง
- Export จริง
- Login เต็มระบบหรือ user/role management

### Slice 2: Database Foundation

เป้าหมาย:
- สร้าง PostgreSQL schema
- seed ข้อมูลเริ่มต้น
- ทดสอบ connection จาก local และ Vercel

ตารางหลัก:
1. `requester_types`
2. `categories`
3. `statuses`
4. `evidence_types`
5. `requests`
6. `request_attachments`

จุดที่ต้องระวัง:
- `request_no` ต้อง unique
- `(fiscal_year, sequence_no)` ต้อง unique
- การออกเลขต้องกันเลขซ้ำเมื่อมีผู้ใช้หลายคนกดบันทึกใกล้กัน

### Slice 3: Add Request

เป้าหมาย:
- เพิ่มคำร้องใหม่ด้วย field บังคับ 4 ช่อง
- ออกเลข `CYY-NNNN`
- แสดงเลขคำร้องเด่นหลังบันทึก
- วางโครงให้แก้เลขคำร้องได้ภายหลังสำหรับ correction/backfill

เกณฑ์ผ่าน:
- บันทึกโดยไม่แนบไฟล์ได้
- วันที่ default เป็นวันนี้
- คำร้องแรกปีงบประมาณ 2569 ได้ `C69-0001`
- วันที่ 2026-10-01 เริ่ม `C70-0001`

### Slice 4: Search and Edit

เป้าหมาย:
- ค้นหาด้วยเลขคำร้อง
- filter ตามช่วงวันที่ ประเภทผู้ขอ หมวดหมู่ สถานะ
- แก้ไขข้อมูลทั่วไปโดยเลขคำร้องเดิมไม่เปลี่ยนเอง
- แก้ไขเลขคำร้องโดยตรงได้เมื่อ format ถูกและไม่ซ้ำ
- ลบคำร้องพร้อม confirmation

จุดที่ต้องตกลง:
- ใช้ soft delete เมื่อผู้ใช้ลบคำร้อง
- เลขคำร้องของรายการที่ถูกลบต้องไม่นำกลับมาใช้ซ้ำ

### Slice 5: Master Data

เป้าหมาย:
- จัดการหมวดหมู่
- จัดการประเภทหลักฐาน
- เพิ่ม แก้ไข เรียงลำดับ เปิด/ปิดใช้งาน

หลักการ:
- รายการที่เคยถูกใช้แล้วไม่ควร hard delete
- รายการที่ปิดใช้งานไม่ควรแสดงในฟอร์มใหม่
- รายงานย้อนหลังยังต้องเห็นชื่อเดิม

### Slice 6: Attachments

เป้าหมาย:
- แนบไฟล์หลักฐานภายหลังได้
- ตรวจ extension และ MIME type
- จำกัดขนาดไฟล์
- ดาวน์โหลดผ่าน endpoint ของระบบ
- ลบไฟล์พร้อม confirmation

Cloud constraint:
- Vercel filesystem ไม่ใช่ที่เก็บไฟล์ถาวร
- ห้ามใช้ `uploads/` เป็น storage หลักบน Vercel
- เก็บไฟล์จริงใน Vercel Blob Private Storage และเก็บ metadata ใน Neon

ไฟล์ที่รองรับ:
- `.pdf`
- `.jpg`
- `.jpeg`
- `.png`
- `.doc`
- `.docx`

ไฟล์ที่ต้อง block:
- `.exe`
- `.bat`
- `.cmd`
- `.js`
- `.sh`
- `.php`
- `.html`

### Slice 7: Reports and Exports

เป้าหมาย:
- รายงานตามช่วงวันที่
- สรุปจำนวนทั้งหมด
- count by category
- count by requester type
- count by status
- ตารางรายการคำร้อง
- Export Excel
- Export PDF
- Export Backup

จุดที่ต้องระวัง:
- PDF ภาษาไทยต้องใช้ font ที่ render ภาษาไทยได้
- Backup ควรรวม metadata ไฟล์แนบ แต่ไม่ควรฝังไฟล์แนบจริงใน Excel

### Slice 8: Trial Deployment

เป้าหมาย:
- push source code ไป GitHub repo
- import GitHub repo เข้า Vercel
- deploy ไป Vercel
- ตั้งค่า env vars
- ทดสอบ Neon connection
- ทดสอบ upload/download
- ทดสอบ flow เพิ่มคำร้องภายใน 30 วินาที

เกณฑ์ผ่าน:
- URL ทดลองเข้าได้เฉพาะผู้มีสิทธิ์หรือผู้รู้รหัสทดลอง
- ไม่มี public URL ของไฟล์หลักฐานใน UI
- Export Excel/PDF ใช้งานได้

## 3. สิ่งที่ยังไม่ทำใน Version 1

| รายการ | เหตุผล |
|---|---|
| รับคำร้องออนไลน์จากประชาชน | ยังใช้ใบคำร้องกระดาษ |
| บัญชีผู้ใช้หลาย role | เพิ่มภาระ MVP |
| Audit log เต็มรูปแบบ | เก็บเฉพาะ timestamp ขั้นต่ำก่อน |
| อัปโหลดวิดีโอ CCTV | เสี่ยงพื้นที่และข้อมูลส่วนบุคคล |
| Workflow อนุมัติหลายชั้น | ระบบนี้เป็นระบบสถิติ ไม่ใช่ case management |

## 4. Remaining Runtime Setup

ไม่มี owner decision ที่บล็อก implementation แล้ว เหลือค่า runtime ที่ต้องตั้งผ่าน env เท่านั้น:

1. `BLOB_READ_WRITE_TOKEN` จาก Vercel Blob store
2. Vercel Environment Variables สำหรับ deployment

## 5. Resolved Decisions

| Decision | Resolution |
|---|---|
| Access control สำหรับ Vercel trial | ใช้ shared password access gate ผ่าน `APP_PASSWORD` และ session cookie |
| Login เต็มระบบ | ยังไม่ทำใน version 1 |
| Attachment storage | ใช้ Vercel Blob Private Storage และเก็บ metadata ใน Neon |
| Delete policy | ใช้ soft delete และซ่อนจากรายงานปกติ |
| Report organization name | กลุ่มงานสถิติข้อมูลและสารสนเทศ |
| Soft deleted records in MVP | ไม่มีหน้า audit/restore ใน MVP; เก็บไว้ backend และ backup ก่อน |
| Backup scope in MVP | Export ข้อมูลตารางและ metadata รวม `deleted_at`; ไม่รวม binary blob files |
| Request number correction | ต้อง reject หาก `CYY` ไม่ตรงกับปีงบประมาณจาก `request_date` |
