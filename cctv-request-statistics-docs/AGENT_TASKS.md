# AGENT_TASKS.md

# รายการงานสำหรับ AI Agent

เอกสารนี้สะท้อนสถานะ implementation ปัจจุบันของ CCTVStat หลังย้ายมาใช้ Next.js, Neon PostgreSQL, Vercel Blob private storage, performance instrumentation และ multi-file attachment UX แล้ว

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

## Phase 9: Performance
- [x] เพิ่ม timing instrumentation สำหรับ route/function สำคัญ
- [x] วัด dev mode เทียบ production local
- [x] แก้ cold runtime cost ของ `ensureSchema()`
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
