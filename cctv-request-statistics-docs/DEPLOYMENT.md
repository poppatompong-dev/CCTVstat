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
MAX_UPLOAD_SIZE_MB=10
APP_NAME="CCTV Request Statistics System"
REPORT_ORGANIZATION_NAME="กลุ่มงานสถิติข้อมูลและสารสนเทศ"
```

ห้าม commit ค่า secret จริง เช่น `DATABASE_URL`, `BLOB_READ_WRITE_TOKEN`, หรือ `APP_PASSWORD`

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
| Config | Vercel env vars / `.env.local` |

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
- หากมีผู้ใช้หลายคนพร้อมกัน ต้องทดสอบการออกเลขซ้ำ
