# Interactive redesign prototype

Prototype แบบ standalone สำหรับ **ศูนย์สถิติคำร้อง CCTV / CCTV Request Insights** ใช้ทดแทน Figma screen mockups หลัง Figma Starter Plan จำกัดจำนวน MCP tool calls

## เปิดใช้งาน

ดับเบิลคลิก `index.html` หรือเปิดด้วย browser โดยตรง ไม่ต้องติดตั้ง dependency และไม่ต้องเปิด dev server

หน้าจอและ viewport สามารถแชร์ด้วย query string เช่น:

```text
index.html?screen=dashboard&viewport=desktop
index.html?screen=new-request&viewport=mobile
```

## ขอบเขต

- Brand foundations และ component states
- Desktop: Login, Dashboard, เพิ่มคำร้อง, success, ค้นหา, แก้ไข, แนบหลักฐาน, รายงาน, Master Data และ print report
- Mobile: Login, Dashboard, เพิ่มคำร้อง, success, ค้นหา, แก้ไข และแนบหลักฐาน
- Clickable flows:
  - Dashboard → เพิ่มคำร้อง → duplicate hint → success → แนบหลักฐาน
  - Dashboard → ค้นหา → เปิดคำร้อง → แก้ไข
- ข้อมูลทุกชุดเป็นข้อมูลสมมติและไม่มีการเชื่อม backend

## สถานะ artifact

- Prototype นี้เป็น source สำหรับ review และ developer handoff
- [ไฟล์ Figma](https://www.figma.com/design/MYZR5R8v6sqSknUhEmmNXO) เก็บ foundations บางส่วน แต่ไม่สามารถสร้างต่อได้เพราะ quota ของ Starter Plan
- Prototype ไม่ถูกนำเข้า production build และไม่เปลี่ยน runtime behavior ของ CCTVStat
