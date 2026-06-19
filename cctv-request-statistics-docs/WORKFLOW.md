# WORKFLOW.md

# Workflow การใช้งานและการทำงานของระบบ

เอกสารนี้อธิบาย flow หลักของเจ้าหน้าที่และ flow ภายในระบบสำหรับ CCTV Request Statistics System ช่วงทดลองใช้งานบน Vercel + Neon

## 1. Actors

| Actor | บทบาท |
|---|---|
| เจ้าหน้าที่ CCTV | เพิ่มคำร้อง ค้นหา แก้ไข แนบหลักฐาน และออกรายงาน |
| ผู้ดูแลระบบทดลอง | ตั้งค่า env vars, seed data, ตรวจ deploy และสำรองข้อมูล |
| ผู้บังคับบัญชา | รับรายงานสถิติจาก export PDF/Excel |

หมายเหตุ: version 1 ยังไม่แยก user role ในระบบ แต่จะมี shared password access gate ขั้นต่ำสำหรับป้องกัน public access ในช่วงทดลอง

## 2. Workflow: เข้าใช้งานระบบ

```text
เปิด URL บน Vercel
-> ถ้ายังไม่มี session ให้แสดงหน้าใส่รหัสผ่าน
-> เจ้าหน้าที่กรอก shared password
-> ระบบตรวจเทียบกับ APP_PASSWORD
-> ถ้าถูกต้อง ระบบตั้ง session cookie
-> เข้าหน้าหลักของระบบ
```

หลักการ:
- shared password เป็น access gate ไม่ใช่บัญชีผู้ใช้
- ไม่มี user role ใน version 1
- ไม่ควรแสดงข้อมูลคำร้องหรือไฟล์แนบก่อนผ่าน access gate
- ต้องมีทางออกจากระบบเพื่อล้าง session cookie

## 3. Workflow: เพิ่มคำร้องใหม่

```text
เปิดระบบ
-> เลือก เพิ่มคำร้องใหม่
-> ระบบแสดงฟอร์มหลักทันทีหลังผ่าน access gate และโหลดข้อมูลช่วยเหลือที่ไม่จำเป็นต่อการบันทึกตามมาทีหลัง
-> ตรวจวันที่รับคำร้อง
-> เลือกประเภทผู้ขอ
-> เลือกหมวดหมู่
-> เลือกสถานะ
-> กรอกสถานที่หรือหมายเหตุถ้ามี
-> กด บันทึกและออกเลขคำร้อง
-> ระบบบันทึกข้อมูลและออกเลข CYY-NNNN
-> เจ้าหน้าที่เขียนเลขบนหัวใบคำร้องกระดาษ
```

เกณฑ์สำคัญ:
- ต้องบันทึกได้โดยไม่แนบไฟล์
- หลังบันทึกต้องเห็นเลขคำร้องชัดเจน
- แก้ไขข้อมูลทั่วไปแล้วเลขคำร้องต้องไม่เปลี่ยนเอง
- ต้องมีทางแก้เลขคำร้องอย่างตั้งใจสำหรับ correction/backfill
- smart defaults และ location autocomplete ต้องไม่ทำให้การเปิดฟอร์มช้าลง และต้องไม่ block การบันทึก

## 4. Workflow: ออกเลขคำร้อง

```text
รับ request_date
-> คำนวณปี พ.ศ.
-> คำนวณปีงบประมาณ
-> หาเลข sequence ถัดไปของปีงบประมาณนั้น
-> สร้าง request_no เช่น C69-0001
-> บันทึกใน transaction
-> ถ้าเลขชนกัน ให้ retry หรือแจ้ง error ที่ควบคุมได้
```

กติกา:
- ปีงบประมาณเริ่ม 1 ตุลาคม
- 2026-06-16 อยู่ปีงบประมาณ 2569
- 2026-10-01 อยู่ปีงบประมาณ 2570
- ลบคำร้องแล้วไม่ควรนำเลขเดิมกลับมาใช้ซ้ำ

## 5. Workflow: แนบหลักฐาน

```text
เปิดคำร้องที่มีเลขแล้ว
-> เลือกประเภทหลักฐาน
-> เลือกไฟล์หนึ่งไฟล์หรือหลายไฟล์
-> ระบบแสดง preview/thumbnail สำหรับไฟล์ที่เลือก
-> ระบบตรวจ extension, จำนวนไฟล์, และขนาดไฟล์ต่อไฟล์
-> upload ไฟล์ไป Vercel Blob Private Storage
-> บันทึก metadata ใน Neon
-> แสดง thumbnail/gallery ของไฟล์แนบในหน้าคำร้อง
```

กติกา:
- หลักฐานแนบเป็น optional
- ไม่รับวิดีโอ CCTV
- ห้ามเปิดไฟล์ผ่าน public URL ตรง ๆ
- ดาวน์โหลดต้องผ่าน endpoint ของระบบ
- ลบไฟล์ต้องถามยืนยันด้วย modal
- upload/delete/save ต้องมี modal หรือ pending state ให้ผู้ใช้รู้ว่าระบบกำลังทำงาน
- default อัปโหลดได้สูงสุด 5 ไฟล์ต่อครั้ง และขนาดไม่เกิน 4 MB ต่อไฟล์

Metadata ที่ควรเก็บ:
- `request_id`
- `evidence_type_id`
- `original_file_name`
- `blob_url`
- `download_url`
- `blob_pathname`
- `content_type`
- `size_bytes`
- `note`
- `uploaded_at`

## 6. Workflow: ดาวน์โหลดหลักฐาน

```text
เจ้าหน้าที่กด ดาวน์โหลด
-> ระบบตรวจว่าไฟล์แนบมี metadata
-> ระบบอ่านไฟล์จาก private storage
-> ส่งไฟล์กลับเป็น download response
```

หลักการ:
- UI ไม่ควรแสดง private storage URL
- ต้องตรวจ session จาก access gate ก่อน download
- ถ้าไฟล์หายจาก storage แต่ metadata ยังอยู่ ต้องแสดง error ที่เข้าใจง่าย

## 7. Workflow: ค้นหาและแก้ไข

```text
เปิดหน้า ค้นหา / แก้ไขคำร้อง
-> ใส่เลขคำร้อง หรือเลือก filter
-> กด ค้นหา
-> ระบบแสดงตารางรายการ
-> กด แก้ไข
-> ปรับสถานะ สถานที่ หรือหมายเหตุ
-> บันทึก
```

ข้อห้าม:
- การแก้ไขข้อมูลทั่วไปต้องไม่ออกเลขใหม่
- การแก้เลขคำร้องต้องเป็น action ที่ตั้งใจ มี validation และ confirmation
- การปิดใช้งานหมวดหมู่ใน master data ต้องไม่ทำให้รายการย้อนหลังอ่านไม่ออก

## 7.1 Workflow: แก้เลขคำร้องหรือข้อมูลย้อนหลัง

```text
เปิดหน้าแก้ไขคำร้อง
-> เลือกแก้ไขเลขคำร้อง
-> ระบบแสดงคำเตือนว่าเลขนี้ใช้อ้างอิงใบคำร้องกระดาษ
-> เจ้าหน้าที่กรอกเลขรูปแบบ CYY-NNNN
-> ระบบตรวจ format และตรวจว่าไม่ซ้ำ
-> ระบบตรวจว่า YY ตรงกับปีงบประมาณจากวันที่คำร้อง
-> บันทึกเลขใหม่
```

หลักการ:
- ใช้สำหรับ correction/backfill ไม่ใช่ flow ปกติของการเพิ่มคำร้องเร็ว
- เลขใหม่ต้องค้นหาได้ทันที
- ถ้าเลขกับวันที่อยู่คนละปีงบประมาณ ต้องไม่ยอมบันทึกและแสดงข้อความแจ้งเตือน
- ถ้ามีไฟล์แนบอยู่แล้ว ความสัมพันธ์ยังยึดตาม `request_id` ไม่ใช่ชื่อไฟล์

## 8. Workflow: ลบคำร้อง

```text
เปิดหน้าแก้ไขคำร้อง
-> กด ลบคำร้อง
-> ระบบถามยืนยัน
-> ระบบทำ soft delete
-> กลับไปหน้าค้นหา
```

หลักการ:
- ไม่ hard delete คำร้องใน version 1
- เลขคำร้องของรายการที่ถูกลบยังถูก reserve และห้าม reuse
- รายงานและค้นหาปกติซ่อนรายการที่ถูกลบ
- อนาคตอาจเพิ่ม filter สำหรับดูรายการที่ถูกลบเพื่อ audit/restore
- MVP ยังไม่มีหน้า audit/restore รายการที่ถูกลบ

## 9. Workflow: จัดการ Master Data

```text
เปิดหน้าจัดการหมวดหมู่หรือประเภทหลักฐาน
-> เพิ่มหรือแก้ไขชื่อ
-> ปรับลำดับ
-> เปิดหรือปิดใช้งาน
-> ระบบอัปเดต dropdown สำหรับคำร้องใหม่
```

หลักการ:
- ใช้ soft deactivate แทน hard delete เมื่อรายการเคยถูกใช้งาน
- รายงานย้อนหลังยังต้องแสดงค่าที่เคยบันทึกไว้

## 10. Workflow: รายงานสถิติ

```text
เปิดหน้า รายงานสถิติ
-> ระบบแสดง shell และ loading skeleton ก่อนหาก query รายงานยังทำงานอยู่
-> เลือกวันที่เริ่มต้นและวันที่สิ้นสุด
-> เลือก filter เพิ่มเติมถ้าต้องการ
-> กด แสดงรายงาน
-> ระบบแสดง summary และตารางรายการ
-> export Excel หรือ PDF
```

รายงานต้องมี:
- จำนวนคำร้องทั้งหมด
- สรุปตามหมวดหมู่
- สรุปตามประเภทผู้ขอ
- สรุปตามสถานะ
- ตารางรายการคำร้อง

## 11. Workflow: Export Backup

```text
ผู้ดูแลระบบกด Export Backup
-> ระบบดึงข้อมูลตารางหลักทั้งหมด
-> สร้าง Excel หลาย sheet
-> ส่งไฟล์ให้ดาวน์โหลด
```

Sheet ที่ควรมี:
- `requests`
- `requester_types`
- `categories`
- `statuses`
- `evidence_types`
- `attachments`

หมายเหตุ:
- Backup ระยะทดลองควรเริ่มจาก metadata และข้อมูลตาราง
- Backup ระยะทดลองยังไม่รวม binary blob files

## 12. Trial Deployment Workflow

```text
สร้าง GitHub repository
-> push source code ไป GitHub
-> import GitHub repo เข้า Vercel
-> เตรียม Neon database
-> เตรียม Blob storage ใน Vercel project
-> ตั้งค่า env vars บน Vercel
-> deploy preview
-> ทดสอบ shared password access gate
-> seed master data
-> ทดสอบเพิ่มคำร้อง
-> ทดสอบแนบไฟล์
-> ถ้าเป็น automated E2E staging ให้เปิด E2E_FIXTURES_ENABLED=1 แล้วเรียก POST /api/test-fixtures/e2e หลัง login
-> ทดสอบรายงานและ export
```

GitHub repo สำหรับทดลอง deploy:
```text
https://github.com/poppatompong-dev/CCTVstat.git
```

Env vars ที่คาดว่าจะต้องมี:
- `DATABASE_URL`
- `APP_PASSWORD`
- `SESSION_SECRET`
- `BLOB_READ_WRITE_TOKEN`
- `REPORT_ORGANIZATION_NAME`
- `FOLLOW_UP_DAYS` optional
- `MAX_UPLOAD_BYTES` optional
- `MAX_UPLOAD_FILES` optional
- `PERF_DB_PROBE` optional สำหรับ diagnostic ชั่วคราว
- `E2E_FIXTURES_ENABLED` optional สำหรับ automated E2E staging/preview เท่านั้น

## 13. Failure Workflows

| เหตุการณ์ | พฤติกรรมที่ควรเกิด |
|---|---|
| Neon connection ล้มเหลว | แจ้งว่าระบบฐานข้อมูลไม่พร้อม |
| ออกเลขคำร้องชนกัน | retry ใน transaction หรือแจ้งให้ลองใหม่ |
| Upload ไฟล์ไม่ผ่าน | ไม่กระทบข้อมูลคำร้องหลัก |
| Download ไฟล์ไม่เจอ | แจ้งว่าไม่พบไฟล์แนบ แต่ไม่ลบ metadata อัตโนมัติ |
| Export PDF fail | ยังควร export Excel ได้ |

## 14. Implementation Readiness

ไม่มี owner decision ที่บล็อก implementation แล้ว
