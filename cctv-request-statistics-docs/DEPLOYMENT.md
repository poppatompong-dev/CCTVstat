# DEPLOYMENT.md

# แนวทางติดตั้งระบบ

## 1. สภาพแวดล้อมที่เหมาะสม
ระบบนี้เหมาะกับ:
1. Vercel trial deployment ผ่าน GitHub repo
2. Neon PostgreSQL สำหรับฐานข้อมูล
3. Vercel Blob Private Storage สำหรับไฟล์แนบ
4. อนาคตสามารถย้ายไป internal hosting ได้ หากต้องการควบคุมระบบเอง

## 2. Stack แนะนำ
| Layer | Recommendation |
|---|---|
| Frontend | Next.js / React |
| Backend | Next.js Route Handlers / Server Actions |
| Database | Neon PostgreSQL |
| File storage | Vercel Blob Private Storage |
| Excel Export | xlsx library |
| PDF Export | pdfmake / jsPDF / server-side PDF |
| Hosting | Vercel |

## 3. Environment Variables
ตัวอย่าง `.env.local`
```env
DATABASE_URL="..."
BLOB_READ_WRITE_TOKEN="..."
APP_PASSWORD="..."
SESSION_SECRET="..."
MAX_UPLOAD_BYTES=4194304
MAX_UPLOAD_FILES=5
E2E_FIXTURES_ENABLED=0
AUTO_SCHEMA_INIT=1
REPORT_ORGANIZATION_NAME="กลุ่มงานสถิติข้อมูลและสารสนเทศ"
FOLLOW_UP_DAYS=7
```

ห้าม commit ค่า secret จริง เช่น `DATABASE_URL`, `BLOB_READ_WRITE_TOKEN`, หรือ `APP_PASSWORD`

Environment ที่จำเป็นบน Vercel production:
| Variable | Required | Notes |
|---|---:|---|
| `DATABASE_URL` | Yes | Neon PostgreSQL connection string |
| `APP_PASSWORD` | Yes | shared password สำหรับ login ทดลอง |
| `SESSION_SECRET` | Yes | ใช้ sign session cookie; ควรแยกจาก `APP_PASSWORD` |
| `BLOB_READ_WRITE_TOKEN` | Yes | token จาก Vercel Blob private store |
| `REPORT_ORGANIZATION_NAME` | Yes | ชื่อหน่วยงานในรายงาน |
| `FOLLOW_UP_DAYS` | No | default 7 |
| `MAX_UPLOAD_BYTES` | No | default 4194304 bytes |
| `MAX_UPLOAD_FILES` | No | default 5 files per upload action |
| `PERF_DB_PROBE` | No | ตั้งเป็น `1` เฉพาะตอน diagnostic เพื่อ log `SELECT 1` และ active request count; ไม่ควรเปิดค้างถ้าไม่ต้องวัด |
| `E2E_FIXTURES_ENABLED` | No | ตั้งเป็น `1` เฉพาะ staging/preview ที่ใช้ automated E2E; จะ seed คำร้อง `C69-0003` พร้อม fixture attachment `test-private.pdf` ถ้ายังไม่มีไฟล์แนบ |
| `AUTO_SCHEMA_INIT` | No | ตั้งเป็น `1` เพื่อให้ระบบตรวจสอบและสร้าง schema อัตโนมัติเมื่อ cold start; **ควรตั้งเป็น `1` เฉพาะการ deploy ครั้งแรก** หรือเมื่อมีการเปลี่ยนแปลง schema หลังจาก schema พร้อมใช้แล้วให้ตั้งกลับเป็น `0` หรือลบออก เพื่อลด round trip และเร่ง cold start |

ห้ามเปิด `E2E_FIXTURES_ENABLED=1` ใน production จริง เพราะ flag นี้มีไว้สร้างข้อมูลทดสอบสำหรับ automation เท่านั้น

เมื่อต้อง reset fixture สำหรับ automated test ให้ login ผ่าน access gate แล้วเรียก:
```text
POST /api/test-fixtures/e2e
```
endpoint นี้ทำงานเฉพาะเมื่อ `E2E_FIXTURES_ENABLED=1` และใช้เพื่อเตรียมคำร้อง `C69-0003` พร้อมไฟล์ `test-private.pdf` ก่อนรัน view/download/delete tests

## 4. Folder Structure
```text
cctv-request-statistics/
  src/
    app/
    components/
    lib/
  docs/
  package.json
  .env.example
```

## 5. Local Run
ตัวอย่างคำสั่ง:
```bash
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

เปิดใช้งาน:
```text
http://localhost:3000
```

## 6. Internal Server Run
ยังไม่ใช่เป้าหมายหลักของช่วงทดลอง

```bash
npm install
npm run build
npm run start
```

## 7. GitHub and Vercel Deployment Order

ต้องสร้าง GitHub repository ก่อนสร้าง Vercel project

GitHub repository:
```text
https://github.com/poppatompong-dev/CCTVstat.git
```

```text
สร้าง source code
-> init git
-> สร้าง GitHub repository
-> push code ไป GitHub
-> สร้างหรือ import project ใน Vercel จาก GitHub repo
-> ตั้งค่า Environment Variables บน Vercel
-> สร้าง Vercel Blob store ใน project
-> ตรวจว่า `BLOB_READ_WRITE_TOKEN` ถูกเพิ่มใน env
-> deploy preview
-> ทดสอบ shared password, Neon, Blob upload/download, report/export
```

เหตุผล:
- Vercel workflow เหมาะกับการ import จาก GitHub repo
- Vercel Blob token จะผูกกับ Vercel project/env
- การ deploy preview และ production จะตาม branch/repo ได้ชัดเจน

## 8. Vercel Blob Token

หลังสร้าง Vercel project แล้ว:
1. เข้า Vercel project
2. ไปที่ Storage
3. Create Database
4. เลือก Blob
5. เลือก Private access
6. เลือก environment ที่ต้องการ
7. Vercel จะสร้าง `BLOB_READ_WRITE_TOKEN` ให้ project

สำหรับ local development ใช้:
```bash
vercel env pull
```

## 9. Backup
สำรองอย่างน้อย:
| รายการ | Path ตัวอย่าง |
|---|---|
| Database | Neon backup/export |
| Upload metadata | `request_attachments` table |
| Upload files | Vercel Blob store |
| Delivery records | `request_deliveries` table |
| Config | Vercel env vars / `.env.local` |

นอกจากนี้ระบบมี endpoint สำรองข้อมูลแบบ Excel:
```http
GET /api/backup
```
ไฟล์ Excel (version 2) ประกอบด้วย sheets: `requests`, `requester_types`, `categories`, `statuses`, `evidence_types`, `request_attachments`, `request_deliveries`, `delivery_item_types`

## 10. Restore
1. Restore Neon data
2. ตรวจ Vercel Blob objects
3. ตรวจ env vars
4. Deploy app ใหม่จาก GitHub repo
5. ทดสอบ search/report/download

## 11. Security Notes
- ต้องมี shared password access gate
- ไม่แสดง Blob public URL ใน UI
- ไฟล์แนบดาวน์โหลดผ่าน endpoint ของระบบ
- ห้าม commit secret
- สำรองข้อมูลสม่ำเสมอ
- หากมีผู้ใช้หลายคนพร้อมกัน ต้องทดสอบการออกเลขซ้ำ — ระบบใช้ตาราง `request_counters` แบบ atomic (`INSERT ... ON CONFLICT DO UPDATE`) เพื่อป้องกัน race condition
