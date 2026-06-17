# PROGRESSIVE.md

# Checklist แผนพัฒนาแบบไล่ระดับ

เอกสารนี้ใช้ดูสถานะงานของ CCTVStat แบบไล่ระดับว่าอะไรทำแล้ว อะไรยังเหลือ และเหลือประมาณไหน โดยแยก **งานที่เสร็จในโค้ดแล้ว** ออกจาก **งานที่ต้องยืนยันบน runtime จริง** เช่น Vercel, Neon และ Vercel Blob

## สถานะรวมล่าสุด

| หมวด | สถานะ | หมายเหตุ |
|---|---|---|
| Product decisions | เสร็จแล้ว | scope, stack, access gate, soft delete, backfill validation ตกลงแล้ว |
| MVP application code | เสร็จแล้ว | build/lint ผ่าน และ push ขึ้น GitHub แล้ว |
| Smart Enhancements A | เสร็จแล้ว | dashboard actionable, next-number preview, smart defaults, report insights, quick filters |
| Documentation sync | เสร็จแล้ว | glossary, roadmap, UI/report/API/data/test/acceptance sync แล้ว |
| Trial deployment runtime | ยังเหลือ | ต้องตั้ง env บน Vercel และทดสอบ Neon/Blob/export จริง |
| Smart Enhancements B | ยังไม่ทำ | duplicate hint และ location autocomplete |

ภาพรวมโดยประมาณ:
- งานพัฒนาใน repo: **ประมาณ 85-90% เสร็จ**
- งานที่เหลือเพื่อใช้งานทดลองจริง: **ประมาณ 10-15%**
- งานต่อยอด smart รอบถัดไป: แยกเป็น phase ใหม่ ไม่บล็อก MVP trial

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

หลักฐาน:
- [x] `npm run build` ผ่าน
- [x] `npm run lint` ผ่าน
- [x] push ขึ้น GitHub แล้ว

เหลือ:
- [ ] ตรวจบน Vercel preview หลัง env พร้อม

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
- [x] ปิดใช้งาน seed เก่าที่เลิกใช้ เช่น `ยกเลิก`, `คดีอาชญากรรม`, `เหตุเดือดร้อนรำคาญ`

เหลือ:
- [ ] ทดสอบ schema creation กับ Neon production จริง
- [ ] ยืนยันว่าข้อมูลเดิมใน Neon ถ้ามี ไม่ถูกกระทบจาก reseed

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

เกณฑ์ผ่าน:
- [x] field บังคับไม่เกิน 4 field
- [x] วันที่ 2026-06-16 อยู่ปีงบ 2569 และใช้ prefix `C69`
- [x] วันที่ 2026-10-01 อยู่ปีงบ 2570 และใช้ prefix `C70`
- [x] เลขคำร้องจริงยืนยันเมื่อบันทึก ไม่ถือว่า preview เป็นเลขจอง

เหลือ:
- [ ] ทดสอบเพิ่มคำร้องจริงบน Vercel + Neon
- [ ] จับเวลาหน้างานจริงว่าไม่แนบไฟล์ใช้ไม่เกิน 30 วินาที

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
- [ ] เพิ่ม confirmation dialog ฝั่ง client ให้การลบคำร้องชัดขึ้น
- [ ] ปรับ error mapping กรณีเลขซ้ำให้แยก `request_no` กับ `(fiscal_year, sequence_no)` ชัดขึ้น

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
- [ ] เพิ่มหน้าจัดการ requester types และ statuses หากต้องการให้ผู้ดูแลปรับเองจาก UI
- [ ] เพิ่ม validation/UX กันแก้ `semantic_key` ของสถานะผิดพลาด ถ้าเปิดให้แก้ในอนาคต

## [x] Slice 6: Attachments

เป้าหมาย:
- [x] แนบไฟล์หลักฐานภายหลังได้
- [x] Upload ไป Vercel Blob Private Storage
- [x] เก็บ metadata ใน Neon
- [x] List/download/delete attachment
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
- [ ] ทดสอบ upload/download/delete กับ Vercel Blob token จริง
- [ ] เพิ่มขนาดไฟล์สูงสุดที่ชัดเจนใน env/spec/runtime
- [ ] เพิ่ม confirmation dialog ฝั่ง client ก่อนลบไฟล์แนบ

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

เหลือ:
- [ ] ทดสอบ Excel กับข้อมูลจำนวนมากอย่างน้อย 5,000 รายการ
- [ ] ตัดสินใจว่าจะใช้ binary PDF server-side หรือคง print-to-PDF สำหรับ MVP
- [ ] เพิ่มพื้นที่ลงชื่อใน print/PDF view ให้ตรงแบบรายงานราชการมากขึ้น
- [ ] Backup ยังเป็น JSON ไม่ใช่ Excel หลาย sheet ตาม spec เดิม ต้องตัดสินใจว่าจะเปลี่ยนหรือยอมรับ MVP นี้

## [ ] Slice 8: Trial Deployment Runtime

เป้าหมาย:
- [x] สร้าง GitHub repository
- [x] push source code ไป GitHub repo
- [x] ให้ Vercel สามารถ build จาก repo ได้
- [ ] ตั้งค่า Vercel Environment Variables
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
- [ ] `DATABASE_URL`
- [ ] `APP_PASSWORD`
- [ ] `SESSION_SECRET`
- [ ] `BLOB_READ_WRITE_TOKEN`
- [ ] `REPORT_ORGANIZATION_NAME`
- [ ] `FOLLOW_UP_DAYS` optional, default 7

เกณฑ์ผ่าน:
- [ ] URL ทดลองเข้าได้เฉพาะผู้รู้รหัสทดลอง
- [ ] ไม่มี public URL ของไฟล์หลักฐานใน UI
- [ ] เพิ่มคำร้องและออกเลขได้จริง
- [ ] รายงานและ export ใช้งานได้จริง

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
- [ ] ทดสอบกับข้อมูลจริงบน Vercel/Neon
- [ ] ยืนยันว่าคำว่า **คำร้องที่ควรติดตาม** สื่อสารกับผู้ใช้จริงได้ชัด

## [ ] Smart Enhancements B

เป้าหมาย:
- [ ] B1 Duplicate hint แบบไม่ block
- [ ] B2 Location autocomplete จากสถานที่ที่เคยกรอก

ข้อควรระวัง:
- [ ] ห้ามเพิ่ม required field ใหม่
- [ ] ห้าม block การบันทึก
- [ ] ห้ามทำให้เพิ่มคำร้องเกิน 30 วินาที
- [ ] ต้องใช้คำว่า hint/คำแนะนำ ไม่ใช่ error ถ้าเป็น duplicate ที่ไม่แน่นอน

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

ถ้าต้องการให้ MVP ทดลองใช้จริง:
1. [ ] ตั้ง env บน Vercel
2. [ ] เปิด Vercel deployment URL
3. [ ] ทดสอบ login ด้วย shared password
4. [ ] เพิ่มคำร้องจริง 2-3 รายการ
5. [ ] ทดสอบแนบไฟล์จริง
6. [ ] ทดสอบรายงาน/Excel/PDF/Backup
7. [ ] เก็บ feedback จากผู้ใช้หน้างาน

ถ้าต้องการต่อยอด smart:
1. [ ] ทำ duplicate hint
2. [ ] ทำ location autocomplete
3. [ ] เพิ่ม import Excel ย้อนหลัง
4. [ ] เพิ่ม dashboard ผู้บริหาร
