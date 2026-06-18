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
