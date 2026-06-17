# ROADMAP.md

# Roadmap การพัฒนา

Roadmap นี้จัดลำดับงานจากสิ่งที่ต้องตกผลึกก่อน ไปจนถึง MVP ที่ทดลองใช้งานบน Vercel ได้จริง โดยยึดเป้าหมายหลัก: รวดเร็ว ใช้งานง่าย มีประสิทธิภาพ รายงานหลายมิติ ถูกต้อง และ UI ต้องดูดีระดับที่เจ้าหน้าที่เห็นแล้วอยากใช้

## 1. Product Direction

ระบบนี้ไม่ใช่ case management และไม่ใช่ระบบรับคำร้องออนไลน์จากประชาชน แต่เป็น internal statistics app สำหรับเจ้าหน้าที่ CCTV ของเทศบาล ใช้คู่กับใบคำร้องกระดาษเดิม

เป้าหมายของ MVP:
- เพิ่มคำร้องและออกเลข `CYY-NNNN` ได้เร็ว
- บันทึกข้อมูลสถิติเท่าที่จำเป็น
- แนบหลักฐานได้ภายหลังแบบ optional
- ค้นหา แก้ไข และจัดการข้อมูลพื้นฐานได้
- รายงานและ export ได้หลายมิติ
- deploy ทดลองบน Vercel โดยใช้ Neon และ Vercel Blob

## 2. Current Decisions

| Topic | Decision |
|---|---|
| Hosting | Vercel |
| Source control | ต้องสร้าง GitHub repo ก่อนสร้าง Vercel project |
| GitHub repo | `https://github.com/poppatompong-dev/CCTVstat.git` |
| Database | Neon PostgreSQL |
| Attachments | Vercel Blob Private Storage |
| Access control | Shared password access gate ผ่าน `APP_PASSWORD` และ session cookie |
| Full login / roles | ไม่ทำใน version 1 |
| Official document | ใบคำร้องกระดาษยังเป็นเอกสารหลัก |
| CCTV video upload | ไม่ทำใน version 1 |
| Request number correction | รองรับการแก้เลขคำร้องอย่างตั้งใจเพื่อ correction/backfill |
| Delete policy | ใช้ soft delete และไม่ reuse เลขคำร้อง |
| Report organization name | กลุ่มงานสถิติข้อมูลและสารสนเทศ |
| Soft delete UI in MVP | ไม่มีหน้า audit/restore; เก็บใน backend และ backup ก่อน |
| Backfill validation | ไม่ยอมบันทึกเลขคำร้องที่ปีงบไม่ตรงกับวันที่ |

## 3. UX North Star

หน้าจอต้องให้ความรู้สึก:
- เร็ว: เพิ่มคำร้องไม่แนบไฟล์ภายใน 30 วินาที
- ง่าย: field บังคับน้อย ปุ่มหลักชัดเจน
- สวยงาม: ดูสะอาด เป็นงานราชการสมัยใหม่ ไม่เหมือนฟอร์มดิบ
- น่าเชื่อถือ: เลขคำร้อง รายงาน และ export ต้องอ่านง่าย
- หน้างาน: มือถือและแท็บเล็ตต้องใช้งานเพิ่มคำร้อง ค้นหา และดูสถานะได้สะดวก
- ไม่รก: ใช้ layout สำหรับงานจริง ไม่ใช่ landing page

แนวทาง UI:
- ใช้หน้าแรกเป็น command dashboard ไม่ใช่หน้าโฆษณา
- ให้ปุ่ม "เพิ่มคำร้องใหม่" เป็น action เด่นที่สุด
- ใช้สีสุภาพ อ่านง่าย มี contrast ดี และไม่ใช้ palette สีเดียวทั้งระบบ
- ตารางต้อง scan ง่าย มี filter bar ชัดเจน
- รายงานต้องมี visual summary เช่น stat tiles และ chart ขนาดพอดี
- เลขคำร้องหลังบันทึกต้องเด่นมากและ copy/print-friendly
- mobile layout ต้องไม่ใช่แค่ย่อ desktop ลงมา แต่ต้องจัด flow ใหม่ให้กดง่ายและอ่านเร็ว

## 4. Phase 0: Final Decisions Before Implementation

ไม่มี owner decision ที่บล็อก implementation แล้ว:

1. รายงานจะซ่อน soft-deleted requests จากยอดรวมปกติ
2. ไม่มีหน้า audit/restore ใน MVP; ข้อมูล soft delete อยู่ใน backend และ backup
3. ค่า shared password จะตั้งผ่าน env เท่านั้น ไม่เขียนลง repo
4. Neon `DATABASE_URL` และ Vercel Blob token จะถูกใส่ใน `.env.local` / Vercel env โดยผู้ดูแล ห้ามบันทึกค่าจริงลง markdown หรือ commit

## 5. Phase 1: Foundation

Deliverables:
- Next.js + TypeScript project
- Thai UI shell
- Shared password access gate
- Neon connection แบบ lazy initialization
- Environment variable template
- Basic app navigation

Verification:
- เปิด local app ได้
- กรอกรหัสผ่านแล้วเข้า dashboard ได้
- ไม่มีหน้า data สำคัญที่ bypass access gate ได้

## 6. Phase 2: Data Model and Seed

Deliverables:
- PostgreSQL schema
- Migration/init script
- Seed data สำหรับ requester types, categories, statuses, evidence types
- Function ออกเลขคำร้องตามปีงบประมาณ

Verification:
- `C69-0001` สำหรับวันที่ 2026-06-16
- `C70-0001` สำหรับวันที่ 2026-10-01
- unique constraint กันเลขซ้ำ
- รองรับ manual/backfill request number โดยไม่ทำให้ flow ปกติช้าลง
- manual/backfill request number ต้องตรงปีงบประมาณของ `request_date`
- seed idempotent หรือรันซ้ำได้อย่างควบคุม

## 7. Phase 3: Add Request Flow

Deliverables:
- หน้าเพิ่มคำร้องใหม่
- วันที่ default วันนี้
- dropdown 3 รายการ
- location/note optional
- success state แสดงเลขคำร้องชัดเจน

Verification:
- บันทึกโดยไม่แนบไฟล์ได้
- field บังคับไม่เกิน 4 field
- ใช้งานจริงได้เร็วใน 30 วินาที
- UI ต้องดู polished ตั้งแต่ phase นี้

## 8. Phase 4: Search, Edit, and Delete Policy

Deliverables:
- หน้า search/edit
- filter ตามเลข วันที่ ประเภท หมวดหมู่ สถานะ
- หน้าแก้ไขคำร้อง
- delete confirmation ตามนโยบายที่ตกลง
- action สำหรับแก้เลขคำร้องโดยตรงพร้อม validation/confirmation

Verification:
- แก้ไขข้อมูลทั่วไปแล้วเลขคำร้องไม่เปลี่ยน
- แก้เลขคำร้องโดยตรงได้เมื่อ format ถูกและไม่ซ้ำ
- แก้เลขคำร้องโดยตรงไม่ได้ถ้า `CYY` ไม่ตรงกับปีงบประมาณของวันที่คำร้อง
- filter ทำงานถูก
- รายการย้อนหลังยังอ่านชื่อ master data ได้

## 9. Phase 5: Master Data

Deliverables:
- จัดการหมวดหมู่
- จัดการประเภทหลักฐาน
- เปิด/ปิดใช้งาน
- sort order

Verification:
- รายการ inactive ไม่แสดงในฟอร์มใหม่
- รายงานย้อนหลังยังแสดงชื่อเดิม
- ไม่ hard delete รายการที่ถูกใช้แล้ว

## 10. Phase 6: Attachments

Deliverables:
- Upload ไป Vercel Blob Private Storage
- Metadata ใน Neon
- List/download/delete attachment
- ตรวจ extension, MIME type, size

Verification:
- ไม่มี public URL ใน UI
- download ผ่าน endpoint หลังผ่าน access gate
- upload fail ไม่ทำให้คำร้องหลักเสีย
- block `.exe`, `.bat`, `.cmd`, `.js`, `.sh`, `.php`, `.html`

## 11. Phase 7: Reports and Export

Deliverables:
- Report filters
- Summary total
- Count by category, requester type, status
- Records table
- Export Excel
- Export PDF ภาษาไทย
- Export backup หลาย sheet

Verification:
- รายงานหลายมิติถูกต้อง
- Excel เปิดอ่านได้
- PDF มีหัวรายงาน ช่วงวันที่ วันที่จัดทำ และพื้นที่ลงชื่อ
- รองรับข้อมูลอย่างน้อย 5,000 รายการสำหรับ export Excel

## 12. Phase 8: Deployment Trial

Deliverables:
- GitHub repository
- Vercel deployment
- Vercel env vars
- Neon connection production
- Vercel Blob production token
- Deployment checklist

Verification:
- code ถูก push ไป GitHub ก่อน import เข้า Vercel
- preview/prod URL เข้าได้ผ่าน shared password
- เพิ่มคำร้องได้จริง
- upload/download ได้จริง
- export ได้จริง

## 13. Future-Ready But Not Built Now

ออกแบบให้ไม่ตันในอนาคต แต่ยังไม่ implement ใน MVP:

| Future Requirement | เตรียมเผื่ออย่างไร |
|---|---|
| Login หลายผู้ใช้ | แยก access gate logic ออกจาก domain logic |
| Role admin/staff/viewer | อย่าผูก permission กับ schema คำร้องโดยตรงตั้งแต่แรก |
| Audit log | ใช้ timestamp ชัดเจน และเตรียม service layer สำหรับ mutations |
| created_by / updated_by | ยังไม่บังคับ field แต่ไม่ออกแบบ schema ให้ขัดกับการเพิ่มภายหลัง |
| แนบไฟล์ storage อื่น | เก็บ `storage_key` และ metadata ไม่ผูก UI กับ URL ตรง |
| Backup ไฟล์แนบจริง | MVP export metadata ก่อน และแยกจาก blob export ให้ต่อยอดได้ |
| แผนที่หรือพิกัด | `location_text` ยังเป็น text ก่อน แต่ไม่ปิดทางเพิ่ม location fields |
| นำเข้าข้อมูลจาก Excel เดิม | schema และ request number logic รองรับ manual/backfill number ตั้งแต่แรก |
| Dashboard ผู้บริหาร | report query ควร reusable ไม่ผูกกับหน้าเดียว |
| เปลี่ยนจาก shared password เป็น auth เต็ม | session/access layer ต้องเปลี่ยนได้โดยไม่แตะ core request flow |
| PWA/offline mode | ยังไม่ทำตอนนี้ แต่ responsive layout ไม่ควรขวางการต่อยอดเป็น PWA ภายหลัง |

## 13.1 Smart Enhancements

Smart Enhancements เป็นส่วนต่อยอดจาก MVP โดยมีเงื่อนไขสำคัญว่าไม่เพิ่มภาระเจ้าหน้าที่ ไม่เพิ่ม required field และไม่เปลี่ยนระบบให้กลายเป็น case management

สิ่งที่ทำได้ในระยะนี้:
- Dashboard แสดงคำร้องที่ควรติดตามจากสถานะและวันที่เดิม
- หน้าเพิ่มคำร้องแสดงเลขคำร้องโดยประมาณ โดยเลขจริงยืนยันเมื่อบันทึก
- Smart defaults เลือกค่าที่ใช้บ่อยจากข้อมูลจริง แต่ยังแก้ไขได้เสมอ
- รายงานเปรียบเทียบช่วงก่อนหน้า แนวโน้มย้อนหลัง 6 เดือน และอัตราพบภาพ
- มุมมองด่วนบนหน้าค้นหา เช่น เดือนนี้ ควรติดตาม พบภาพ และทั้งหมด

สิ่งที่ยังต้องระวัง:
- ห้ามเพิ่ม required field ใหม่
- ห้ามทำ assignment, SLA, notification, หรือ workflow อนุมัติหลายชั้น
- คำว่า "คำร้องที่ควรติดตาม" เป็นมุมมองช่วยดูข้อมูล ไม่ใช่การมอบหมายงาน

## 14. Information Needed From Owner

ก่อน implement ต้องขอข้อมูลจากเจ้าของระบบเป็นลำดับ:

1. ชื่อหน่วยงานสำหรับรายงาน PDF: ได้รับแล้ว
2. คำยืนยันนโยบายลบคำร้อง: ได้รับแล้ว ใช้ soft delete
3. ค่า `DATABASE_URL` สำหรับ local/Vercel: ได้รับแล้ว ต้องเก็บเป็น secret เท่านั้น
4. ค่า Vercel Blob token: มี/พร้อมตั้งค่าแล้ว ต้องเก็บเป็น secret เท่านั้น
5. ค่า `APP_PASSWORD`: ได้รับแล้ว ต้องเก็บเป็น secret เท่านั้น
6. ค่า `REPORT_ORGANIZATION_NAME`: `กลุ่มงานสถิติข้อมูลและสารสนเทศ`
7. คำยืนยันว่าใช้ปีงบประมาณไทย 1 ต.ค. - 30 ก.ย. เสมอ: ใช่
8. ตัวอย่างรายงานราชการที่อยากให้หน้าตาใกล้เคียง ถ้ามี: optional

## 15. Deployment Dependency

GitHub repository ถูกสร้างแล้วที่ `https://github.com/poppatompong-dev/CCTVstat.git` Vercel project และ Vercel Blob token จะผูกกับ repo/project นี้ ดังนั้น implementation ควรจบด้วยการ push code ไป repo นี้ แล้วค่อยตรวจ Vercel build, env vars, Blob store, และ preview deployment เป็นขั้นถัดไป
