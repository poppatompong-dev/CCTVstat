# CCTVStat

ระบบบันทึกสถิติการขอดูภาพจากกล้องวงจรปิด สำหรับใช้งานคู่กับใบคำร้องกระดาษเดิมของเทศบาล

## Design Review Prototype

งาน redesign ภายใต้ชื่อ **ศูนย์สถิติคำร้อง CCTV / CCTV Request Insights** อยู่ใน [`design-prototype/index.html`](design-prototype/index.html) เป็น interactive prototype แบบ standalone สำหรับ review และ developer handoff

- เปิดด้วย browser ได้โดยตรง ไม่ต้องติดตั้ง dependency
- สลับ Desktop/Mobile และหน้าจอหลักได้จาก studio rail
- ทดสอบ flow เพิ่มคำร้องและค้นหา/แก้ไขได้โดยไม่เชื่อมฐานข้อมูล
- Prototype ไม่ถูกนำเข้า production build และยังไม่เปลี่ยนชื่อหรือ UI ของ runtime ปัจจุบัน

รายละเอียดขอบเขตและผลตรวจอยู่ที่ [`cctv-request-statistics-docs/REDESIGN_HANDOFF.md`](cctv-request-statistics-docs/REDESIGN_HANDOFF.md)

## Stack

- Next.js App Router + TypeScript
- Neon PostgreSQL
- Vercel Blob Private Storage
- Vercel deployment

## Environment

คัดลอกจาก `.env.example` แล้วตั้งค่าใน `.env.local` สำหรับ local หรือใน Vercel Project Environment Variables

```text
DATABASE_URL=...
APP_PASSWORD=...
SESSION_SECRET=...
BLOB_READ_WRITE_TOKEN=...
REPORT_ORGANIZATION_NAME=...
FOLLOW_UP_DAYS=...
MAX_UPLOAD_BYTES=...
MAX_UPLOAD_FILES=...
```

อย่า commit ค่า secret จริงขึ้น GitHub

## Local Development

```bash
npm install
npm run dev
```

เปิด `http://localhost:3000/login`

## Features

- Access Gate ด้วย shared password
- ออกเลขคำร้องรูปแบบ `CYY-NNNN` ตามปีงบประมาณไทย
- แก้ไขเลขคำร้องได้อย่างตั้งใจสำหรับข้อมูลย้อนหลัง พร้อม validation ปีงบประมาณ
- บันทึก/ค้นหา/แก้ไข/soft delete คำร้อง
- แนบหลักฐานผ่าน Vercel Blob แบบ private
- รายงานหลายมิติ พร้อม Excel, print-to-PDF และ JSON backup
- UI ภาษาไทย responsive สำหรับมือถือ แท็บเล็ต และ desktop

## Deployment Notes

1. Push repo ไป GitHub
2. Import repo เข้า Vercel
3. ตั้งค่า Environment Variables จาก `.env.example`
4. Build command: `npm run build`
5. Output/framework: Vercel auto-detect Next.js

ครั้งแรกที่เข้าใช้งานหลัง deploy ระบบจะสร้าง table และ seed master data ใน Neon อัตโนมัติเมื่อมี request แรกเข้าหน้า protected
