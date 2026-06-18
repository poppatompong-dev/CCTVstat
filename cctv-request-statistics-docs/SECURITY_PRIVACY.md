# SECURITY_PRIVACY.md

# ความปลอดภัยและข้อมูลส่วนบุคคล

## 1. หลักการ
ระบบนี้เก็บข้อมูลสถิติและเอกสารแนบที่อาจมีข้อมูลส่วนบุคคล จึงต้องเก็บเท่าที่จำเป็นและไม่เปิดเผยไฟล์สู่สาธารณะ

## 2. ข้อมูลที่ควรเก็บ
| ข้อมูล | เหตุผล |
|---|---|
| เลขคำร้อง | อ้างอิงใบคำร้องกระดาษ |
| วันที่รับคำร้อง | รายงาน |
| ประเภทผู้ขอ | สถิติ |
| หมวดหมู่ | สถิติ |
| สถานะ | ผลเบื้องต้น |
| สถานที่ | วิเคราะห์พื้นที่ |
| หมายเหตุ | รายละเอียดเสริม |
| ไฟล์หลักฐาน | อ้างอิงภายในแบบ optional |

## 3. ข้อมูลที่ไม่ควรบังคับเก็บ
- เลขบัตรประชาชน
- ชื่อ-สกุลผู้ขอ
- เบอร์โทรศัพท์
- ที่อยู่
- ไฟล์วิดีโอ CCTV

## 4. หลักฐานแนบ
มาตรการ:
1. ไม่บังคับแนบทุกเคส
2. ไม่เปิด public URL
3. ดาวน์โหลดผ่านระบบ
4. จำกัดประเภทไฟล์
5. จำกัดขนาดไฟล์
6. ใช้ safe filename
7. ป้องกัน path traversal

## 5. File Upload Security
Allowed:
```text
.pdf .jpg .jpeg .png .doc .docx
```

Blocked:
```text
.exe .bat .cmd .js .sh .php .html
```

## 6. Access Control ระยะที่ 1
เนื่องจากช่วงทดลอง deploy บน Vercel และมี public URL:
- ต้องมี shared password access gate
- shared password เก็บใน env `APP_PASSWORD`
- หลังผ่านรหัสผ่านให้ใช้ session cookie
- ไม่ทำ user/role management ใน version 1
- ไม่ควรแสดงข้อมูลคำร้องหรือไฟล์แนบก่อนผ่าน access gate
- สำรองข้อมูลสม่ำเสมอ

## 7. Logging ขั้นต่ำ
ควรเก็บ:
- created_at
- updated_at
- uploaded_at

อนาคตเมื่อมี login ค่อยเพิ่ม:
- created_by
- updated_by
- uploaded_by
- audit_logs

## 8. Backup
สำรอง:
1. Neon PostgreSQL data หรือ export จากระบบ
2. Vercel Blob objects และ metadata ใน `request_attachments`
3. Vercel Environment Variables / `.env.local` ในเครื่องผู้ดูแล

## 9. Secret Handling
- ห้ามบันทึกค่า `DATABASE_URL`, blob token, หรือ `APP_PASSWORD` ลง markdown
- ค่า secret ต้องอยู่ใน `.env.local` สำหรับ local development และ Vercel Environment Variables สำหรับ deployment
- `.env.local` ต้องไม่ถูก commit
- หาก secret ถูกเผยแพร่ในที่สาธารณะ ควร rotate ทันที
- `DATABASE_URL`, `APP_PASSWORD`, `SESSION_SECRET`, และ `BLOB_READ_WRITE_TOKEN` ต้องเก็บเป็น env secret เท่านั้น
- หากเปิด `PERF_DB_PROBE=1` เพื่อ diagnostic ต้องปิดหลังเก็บ log เสร็จ เพื่อลด query เพิ่มเติมบน production
