# PROMPT.md

You are an expert full-stack developer. Build a small internal web application for a municipality CCTV team.

## Project
CCTV Request Statistics System

## Objective
Build a very simple internal web app for recording statistical categories of CCTV footage viewing requests. The paper request form remains the official document. The app only helps staff generate a short reference number, select categories/statuses, optionally attach evidence, and produce reports.

## Core Principle
> Keep the system extremely simple. Do not create unnecessary workload for staff.

## Recommended Stack
- Frontend: React or Next.js
- Language: TypeScript
- Styling: Tailwind CSS or simple CSS
- Database: SQLite
- File storage: local controlled upload folder
- Export: Excel and PDF
- Authentication: not required in version 1
- Deployment: local PC or internal office server

## Main Pages
1. Add New Request
2. Search / Edit Request
3. Statistics Report
4. Manage Categories
5. Manage Evidence Types

## Request Number Format
Generate automatically on first save.

```text
CYY-NNNN
```

Examples:
```text
C69-0001
C69-0002
C70-0001
```

Rules:
- `C` means CCTV.
- `YY` is the last two digits of Thai Buddhist fiscal year.
- `NNNN` is a 4-digit running number.
- Reset running number every fiscal year.
- Thai fiscal year: Oct 1 - Sep 30.
- 2026-06-16 = Buddhist year 2569 = fiscal year 2569 = `C69-0001`
- 2026-10-01 = fiscal year 2570 = `C70-0001`

After save, show:
```text
บันทึกสำเร็จ
เลขคำร้อง: C69-0001
กรุณาเขียนเลขนี้ที่หัวใบคำร้อง
```

## Add Request Fields
Required:
- Request date, default today, editable
- Requester type, dropdown
- Category, dropdown
- Status, dropdown

Optional:
- Location text
- Note

Do not require:
- requester name
- citizen ID
- phone
- address
- CCTV video file

## Evidence Attachment
File upload is optional and must never block quick request recording. Staff can save a request first, get the reference number, and upload evidence later.

Supported evidence types:
1. ใบคำร้อง
2. หนังสือราชการ
3. ใบแจ้งความ
4. เอกสารส่งมอบ
5. รูปภาพประกอบ
6. อื่น ๆ

Allowed files:
- PDF
- JPG / JPEG
- PNG
- DOC / DOCX

Blocked files:
- EXE, BAT, CMD, JS, SH, PHP, HTML

Video upload is not required in version 1.

## Seed Data
Requester types:
1. ประชาชน
2. เจ้าหน้าที่เทศบาล
3. ตำรวจ
4. หน่วยงานรัฐ
5. อื่น ๆ

Categories:
1. อุบัติเหตุจราจร
2. ทรัพย์สินสูญหาย
3. เหตุเกี่ยวกับคดี/อาชญากรรม
4. ตรวจสอบการจราจร
5. เหตุความสงบเรียบร้อย
6. หน่วยงานรัฐ/ตำรวจขอข้อมูล
7. งานภายในเทศบาล
8. อื่น ๆ

Statuses:
1. รับคำร้องแล้ว
2. กำลังตรวจสอบภาพ
3. พบภาพ
4. ไม่พบภาพ
5. แจ้งผลแล้ว
6. อื่น ๆ

## Reports
Allow custom date range and filters:
- start date
- end date
- requester type
- category
- status

Show:
- total requests
- count by category
- count by requester type
- count by status
- request record table

Export:
- Excel filtered records
- PDF summary report
- Excel full backup

## UX Requirements
- Thai UI
- large buttons
- short form
- dropdowns where possible
- one-page add form
- no multi-step required form
- generated request number must be highly visible
- upload must be optional

## Deliverables
- working source code
- database schema
- seed data
- upload feature
- report/export feature
- setup/run instructions
- Thai UI
