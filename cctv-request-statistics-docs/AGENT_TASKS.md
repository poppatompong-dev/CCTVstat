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
