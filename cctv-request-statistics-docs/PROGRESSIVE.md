# PROGRESSIVE.md

# Checklist แผนพัฒนาแบบไล่ระดับ

เอกสารนี้ใช้ดูสถานะงานของ CCTVStat แบบไล่ระดับว่าอะไรทำแล้ว อะไรยังเหลือ และเหลือประมาณไหน โดยแยก **งานที่เสร็จในโค้ดแล้ว** ออกจาก **งานที่ต้องยืนยันบน runtime จริง** เช่น Vercel, Neon และ Vercel Blob

## สถานะรวมล่าสุด

| หมวด | สถานะ | หมายเหตุ |
|---|---|---|
| Product decisions | เสร็จแล้ว | scope, stack, access gate, soft delete, backfill validation ตกลงแล้ว |
| MVP application code | เสร็จแล้ว | build/lint ผ่าน แก้ master settings redirect แล้ว และ push ขึ้น GitHub แล้ว |
| Smart Enhancements A | เสร็จแล้ว | dashboard actionable, next-number preview, smart defaults, report insights, quick filters |
| Documentation sync | เสร็จแล้ว | รวมถึง `SEED_DATA.md`/`ALL_DOCS.md` ที่ sync `statuses.semantic_key` แล้ว |
| Local verification | เสร็จแล้ว | `npm run lint`, `npm run build`, local route smoke test ที่ `127.0.0.1:3001` ผ่าน dashboard, requests, reports และ Excel export |
| Trial deployment runtime | เหลือยืนยันหลัง deploy | Vercel env หลักมีรายการที่ต้องตั้งครบแล้ว แต่ยังควรทดสอบ production URL, Neon, Blob และ export หลัง deploy ล่าสุด |
| Smart Enhancements B | เสร็จแล้ว | duplicate hint และ location autocomplete แบบไม่ block |
| Performance optimization | เสร็จแล้วรอบ P1/P2 | เพิ่ม database indexes, ลด dashboard query, aggregate report ด้วย SQL, ลด `GROUP BY` จาก attachment count |

ภาพรวมโดยประมาณ:
- งานพัฒนาใน repo: **100% สำหรับ MVP trial scope ปัจจุบัน**
- งานที่เหลือเพื่อใช้งานทดลองจริง: **เป็นงาน runtime/deployment ภายนอก repo หลัง deploy ล่าสุด**
- งานต่อยอด smart รอบถัดไป: แยกเป็น phase ใหม่ ไม่บล็อก MVP trial

หมายเหตุสถานะ:
- checkbox ที่ยังว่างในเอกสารนี้คือการทดสอบกับ environment จริง เช่น Vercel, Neon และ Vercel Blob หรือ future requirement ที่ยังไม่อยู่ใน version 1
- ไม่พบงาน code/docs ใน local repo ที่ค้างสำหรับ MVP trial หลังรอบ performance optimization นี้

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
- [x] เพิ่ม `allowedDevOrigins` สำหรับ `127.0.0.1` เพื่อให้ HMR/dev resources ไม่ถูก block ตอนทดสอบ local

หลักฐาน:
- [x] `npm run build` ผ่าน
- [x] `npm run lint` ผ่าน
- [x] push ขึ้น GitHub แล้ว
- [x] local dev server เปิดที่ `http://127.0.0.1:3001/login` และหน้า login ตอบ `200 OK`
- [x] หน้า `/` redirect ไป `/login` เมื่อยังไม่มี session
- [x] ทดสอบ login ด้วย Chrome headless แล้วเข้า dashboard ได้ ไม่มี 500 response, console error หรือ page error

เหลือ:
- [ ] ตรวจบน Vercel preview หลัง env พร้อม (external runtime)

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
- [x] ปรับ `SEED_DATA.md` และ `ALL_DOCS.md` ให้ระบุ `semantic_key` ตรงกับ runtime schema
- [x] เพิ่ม schema initialization lock เพื่อกัน cold-start race เมื่อหลาย query เรียก `ensureSchema()` พร้อมกัน
- [x] ปิดใช้งาน seed เก่าที่เลิกใช้ เช่น `ยกเลิก`, `คดีอาชญากรรม`, `เหตุเดือดร้อนรำคาญ`
- [x] เพิ่ม index สำหรับ query หลัก: active request date, created date, fiscal sequence, requester type, category, status, category/date และ attachment request id

เหลือ:
- [ ] ทดสอบ schema creation กับ Neon production จริง (external runtime)
- [ ] ยืนยันว่าข้อมูลเดิมใน Neon ถ้ามี ไม่ถูกกระทบจาก reseed (external runtime/data)

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
- [x] เปลี่ยนหมวดหมู่จาก dropdown เป็น tile picker พร้อมไอคอนและ radio semantics
- [x] เพิ่ม CSS micro-animations สำหรับ selected state, เลขคำร้อง, success state, alerts และ data tiles พร้อม reduced-motion guard

เกณฑ์ผ่าน:
- [x] field บังคับไม่เกิน 4 field
- [x] วันที่ 2026-06-16 อยู่ปีงบ 2569 และใช้ prefix `C69`
- [x] วันที่ 2026-10-01 อยู่ปีงบ 2570 และใช้ prefix `C70`
- [x] เลขคำร้องจริงยืนยันเมื่อบันทึก ไม่ถือว่า preview เป็นเลขจอง

เหลือ:
- [ ] ทดสอบเพิ่มคำร้องจริงบน Vercel + Neon (external runtime)
- [ ] จับเวลาหน้างานจริงว่าไม่แนบไฟล์ใช้ไม่เกิน 30 วินาที (field/user test)

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
- [x] เพิ่ม confirmation dialog ฝั่ง client ให้การลบคำร้องชัดขึ้น
- [x] ปรับ error mapping กรณีเลขซ้ำให้แยก `request_no` กับ `(fiscal_year, sequence_no)` ชัดขึ้น

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
- [x] เพิ่มหน้าจัดการ requester types และ statuses
- [x] แสดง `semantic_key` เป็น chip อ่านอย่างเดียว ไม่เปิดให้แก้จาก UI ระหว่างทดสอบ
- [x] แก้ redirect หลังบันทึก requester types/statuses ให้กลับหน้าจัดการที่ถูกต้อง

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
- [ ] ทดสอบ upload/download/delete กับ Vercel Blob token จริง (external runtime)
- [x] เพิ่มขนาดไฟล์สูงสุดที่ชัดเจนใน env/spec/runtime
- [x] เพิ่ม confirmation dialog ฝั่ง client ก่อนลบไฟล์แนบ

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
- [x] ปรับ summary report ให้ aggregate ด้วย SQL แทนการดึง 1,000 rows มานับใน Node
- [x] ให้ summary totals ใช้ข้อมูลครบตาม filter ส่วนตาราง detail ยังแสดงสูงสุด 1,000 รายการ

เหลือ:
- [ ] ทดสอบ Excel กับข้อมูลจำนวนมากอย่างน้อย 5,000 รายการ (load/performance test)
- [x] ตัดสินใจคง print-to-PDF สำหรับ MVP เพื่อให้ภาษาไทย render จาก browser ได้แน่นอน
- [x] เพิ่มพื้นที่ลงชื่อใน print/PDF view ให้ตรงแบบรายงานราชการมากขึ้น
- [x] เปลี่ยน Backup เป็น Excel หลาย sheet ตาม spec

## [ ] Slice 8: Trial Deployment Runtime (เหลือเฉพาะ external runtime)

เป้าหมาย:
- [x] สร้าง GitHub repository
- [x] push source code ไป GitHub repo
- [x] ให้ Vercel สามารถ build จาก repo ได้
- [x] local build/lint ผ่านหลัง commit ล่าสุด
- [x] local login route ทดสอบได้ที่ port 3001
- [x] ระบุรายการ Vercel Environment Variables ที่ต้องตั้งครบ
- [ ] ยืนยันค่า Vercel Environment Variables บน production หลัง deploy ล่าสุด
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
- [x] `DATABASE_URL`
- [x] `APP_PASSWORD`
- [x] `SESSION_SECRET`
- [x] `BLOB_READ_WRITE_TOKEN`
- [x] `REPORT_ORGANIZATION_NAME`
- [x] `FOLLOW_UP_DAYS` optional, default 7
- [x] `MAX_UPLOAD_BYTES` optional, default 4194304

เกณฑ์ผ่าน:
- [ ] URL ทดลองเข้าได้เฉพาะผู้รู้รหัสทดลอง
- [ ] ไม่มี public URL ของไฟล์หลักฐานใน UI
- [ ] เพิ่มคำร้องและออกเลขได้จริง
- [ ] รายงานและ export ใช้งานได้จริง

ข้อจำกัดปัจจุบัน:
- ยังไม่มี `.vercel` project link ใน local workspace
- ยังไม่ควรบันทึก secret จริงลง repo จึงต้องตั้งค่า env ใน Vercel Project Environment Variables หรือดึงผ่านเครื่องมือที่ปลอดภัยเท่านั้น

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
- [ ] ทดสอบกับข้อมูลจริงบน Vercel/Neon (external runtime)
- [ ] ยืนยันกับผู้ใช้จริงว่าคำว่า **คำร้องที่ควรติดตาม** สื่อสารชัด (user feedback)

## [x] Smart Enhancements B

เป้าหมาย:
- [x] B1 Duplicate hint แบบไม่ block
- [x] B2 Location autocomplete จากสถานที่ที่เคยกรอก

ข้อควรระวัง:
- [x] ห้ามเพิ่ม required field ใหม่
- [x] ห้าม block การบันทึก
- [x] ห้ามทำให้เพิ่มคำร้องเกิน 30 วินาที
- [x] ต้องใช้คำว่า hint/คำแนะนำ ไม่ใช่ error ถ้าเป็น duplicate ที่ไม่แน่นอน

## [x] Performance Optimization P1/P2

เป้าหมาย:
- [x] เพิ่ม database indexes ที่ตรงกับ query หลักของ dashboard, list, report และ attachment lookup
- [x] ลด `getDashboardStats()` จากหลาย query sequential เป็น summary aggregate query และดึง follow-up rows แบบ parallel
- [x] ลดภาระ `listRequests()` โดยนับไฟล์แนบจาก pre-aggregated subquery แทน `LEFT JOIN` แล้ว `GROUP BY` ทุก request row
- [x] ปรับ `getReport()` ให้คำนวณ total, previous total, found rate และ count by category/requester/status ด้วย SQL aggregate
- [x] เพิ่ม lightweight timing logs สำหรับ route/function สำคัญ เช่น dashboard, requests, reports, smart APIs, Excel และ backup
- [x] แก้ cold runtime bottleneck ของ `ensureSchema()` โดยเพิ่ม schema readiness check ก่อนรัน DDL/seed ชุดใหญ่
- [x] ทำ DB round-trip probe ให้เปิดเฉพาะ diagnostic mode ด้วย `PERF_DB_PROBE=1` เพื่อไม่เพิ่ม query บน dashboard ปกติ
- [x] คง business logic เดิม: request numbering, soft delete, auth, Blob privacy และ report filters

หลักฐาน local:
- [x] `npm.cmd run lint` ผ่าน
- [x] `npm.cmd run build` ผ่าน
- [x] local smoke test ที่ `http://127.0.0.1:3001` ผ่าน route `/`, `/requests`, `/reports`, `/api/reports/excel`
- [x] production local ก่อนแก้: `/` รอบแรกประมาณ 2146ms, `/api/requests/next-number` รอบแรกประมาณ 1766ms เพราะ `ensureSchema()` ใช้ประมาณ 1694-1718ms ใน cold runtime
- [x] production local หลังแก้: `/` รอบแรกประมาณ 324ms, `/api/requests/next-number` รอบแรกประมาณ 102ms และ warm refresh `/` ประมาณ 155ms

เหลือ:
- [ ] วัดผลจริงบน Neon production ด้วยข้อมูลจริงหลัง deploy ล่าสุด
- [ ] ทำ load/performance test สำหรับ Excel/backup เมื่อข้อมูล 5,000+ รายการ
- [ ] พิจารณา export แบบ streaming หรือแบ่งหน้า หากข้อมูลจริงเริ่มใหญ่

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

งานใน repo:
1. [x] โค้ด MVP trial scope เสร็จ
2. [x] เอกสาร sync กับ implementation ล่าสุด
3. [x] lint/build/local login smoke test ผ่าน
4. [x] commit และ push ขึ้น GitHub แล้ว

ถ้าต้องการให้ MVP ทดลองใช้จริง:
1. [x] ตั้ง env หลักบน Vercel
2. [ ] deploy โค้ด performance optimization ล่าสุดขึ้น Vercel
3. [ ] เปิด Vercel deployment URL
4. [ ] ทดสอบ login ด้วย shared password
5. [ ] เพิ่มคำร้องจริง 2-3 รายการ
6. [ ] ทดสอบแนบไฟล์จริง
7. [ ] ทดสอบรายงาน/Excel/PDF/Backup
8. [ ] เก็บ feedback จากผู้ใช้หน้างาน

ถ้าต้องการต่อยอด smart:
1. [x] ทำ duplicate hint
2. [x] ทำ location autocomplete
3. [ ] เพิ่ม import Excel ย้อนหลัง
4. [ ] เพิ่ม dashboard ผู้บริหาร
