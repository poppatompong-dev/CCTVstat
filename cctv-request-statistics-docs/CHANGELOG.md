# CHANGELOG.md

# Changelog

## 1.8.0 - Delivery Tracking and Database Performance (P4)
### Added
- เพิ่มตาราง `delivery_item_types` (master data) สำหรับจัดการประเภทข้อมูลที่ส่งมอบ พร้อม seed ค่าเริ่มต้น 5 รายการ
- เพิ่มตาราง `request_deliveries` สำหรับบันทึกการส่งมอบข้อมูลให้ผู้ร้อง รองรับหลายรายการต่อคำร้อง
- เพิ่มตาราง `request_counters` สำหรับการออกเลขคำร้องแบบ atomic กัน race condition ด้วย `INSERT ... ON CONFLICT DO UPDATE`
- เพิ่มหน้าจัดการประเภทข้อมูลที่ส่งมอบ (`/settings/delivery-item-types`) ในเมนูนำทาง
- เพิ่ม `DeliveryManager` component บนหน้ารายละเอียดคำร้อง สำหรับเพิ่ม/ลบรายการส่งมอบ
- เพิ่มคอลัมน์ "ส่งมอบ" ในตารางรายการคำร้อง แสดงจำนวนรายการส่งมอบต่อคำร้อง
- เพิ่ม insight tile "รายการส่งมอบ" และ bar list "ส่งมอบตามประเภทข้อมูล" และ "ส่งมอบตามช่องทาง" ในหน้ารายงาน
- เพิ่มคอลัมน์ "ส่งมอบ" และตาราง "สรุปการส่งมอบข้อมูล" ในรายงานพิมพ์
- เพิ่มคอลัมน์ "รายการส่งมอบ" ใน Excel export และ sheet "สรุปการส่งมอบ" แยก
- เพิ่ม `request_deliveries` และ `delivery_item_types` ใน backup export (version 2)
- เพิ่ม env var `AUTO_SCHEMA_INIT` สำหรับควบคุมการตรวจสอบ schema อัตโนมัติเมื่อ cold start

### Changed
- ปรับการออกเลขคำร้องจาก `MAX(sequence_no) + 1` เป็น `allocateSequenceNo()` แบบ atomic ผ่าน `request_counters`
- ปรับ `requestSelect` ให้ใช้ correlated subqueries สำหรับ `attachment_count` และ `delivery_count` แทน full-table aggregate
- รวม report aggregation queries หลายตัวเป็น `getRequestAggregates()` และ `getDeliveryAggregates()` ลด DB round trips
- ปรับ `ensureSchema()` ให้ข้าม schema readiness check เมื่อ `AUTO_SCHEMA_INIT` ไม่ได้ตั้ง ลด cold start latency

### Verified
- `npx tsc --noEmit` ผ่าน
- `npm.cmd run lint` ผ่าน
- `npm.cmd run test` ผ่าน
- `npm.cmd run build` ผ่าน

## 1.7.0 - Interactive Redesign Handoff
### Added
- เพิ่ม interactive prototype แบบ standalone สำหรับแบรนด์ `ศูนย์สถิติคำร้อง CCTV / CCTV Request Insights`
- เพิ่มหน้าจอ desktop ครบตาม scope และ mobile core flow พร้อม design foundations และ component states
- เพิ่ม clickable flow สำหรับเพิ่มคำร้อง, duplicate hint, success, แนบหลักฐาน, ค้นหา และแก้ไขคำร้อง
- เพิ่ม `REDESIGN_HANDOFF.md` อธิบายขอบเขต วิธีเปิด และหลักฐาน browser QA

### Notes
- Prototype ใช้ข้อมูลสมมติ ไม่เชื่อม backend และไม่ถูกรวมใน production build
- ไฟล์ Figma เก็บ foundations บางส่วนเท่านั้น เนื่องจาก Figma Starter Plan จำกัด MCP tool calls; standalone prototype เป็น artifact หลักสำหรับ review รอบนี้

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
