# CHANGELOG.md

# Changelog

## 1.6.0 - Master Data Drag Ordering
### Added
- เพิ่ม drag handle สำหรับเรียงประเภทผู้ขอ หมวดหมู่ สถานะ และประเภทหลักฐานด้วยเมาส์ การสัมผัส และคีย์บอร์ด
- เพิ่ม auto-save หลังวาง พร้อมสถานะกำลังบันทึก สำเร็จ และ rollback เมื่อผิดพลาด
- เพิ่ม validation ว่ารายการ ID ที่ส่งมาไม่ซ้ำ ไม่ขาด และไม่มี ID แปลกปลอม
- เพิ่มการตรวจและปรับข้อมูลเดิมที่มี `sort_order` ซ้ำหรือเว้นช่วงระหว่างเตรียม schema

### Changed
- เอาช่องกรอก `sort_order` ออกจาก UI และให้รายการใหม่ต่อท้ายอัตโนมัติ
- การเรียงใหม่กำหนด `sort_order` เป็น `1..N` ทั้งชุด
- การเพิ่มชื่อซ้ำถูกปฏิเสธ แทนการอัปเดตรายการเดิมแบบเงียบ ๆ
- แก้ `DATA_MODEL.md` ให้ `semantic_key` อยู่ใน `statuses` ตรงกับ runtime schema

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
