# Interactive Redesign Handoff

## ภาพรวม

Interactive prototype สำหรับทิศทาง **ศูนย์สถิติคำร้อง CCTV / CCTV Request Insights** ใช้ทดแทน Figma screen mockups หลัง Figma Starter Plan จำกัดจำนวน MCP tool calls

Artifact หลัก:

- [`../design-prototype/index.html`](../design-prototype/index.html) — เปิดด้วย browser ได้โดยตรง
- [`../design-prototype/README.md`](../design-prototype/README.md) — วิธีใช้และ query parameters
- [Partial Figma foundations](https://www.figma.com/design/MYZR5R8v6sqSknUhEmmNXO) — variables, typography และ effect styles บางส่วน

Prototype เป็นงานออกแบบสำหรับ review และ developer handoff ไม่ได้เชื่อมฐานข้อมูล ไม่ส่งข้อมูลจริง และไม่ถูกนำเข้า production build

## ทิศทางผลิตภัณฑ์

| หัวข้อ | ข้อกำหนด |
|---|---|
| ผู้ใช้หลัก | เจ้าหน้าที่บันทึกข้อมูล |
| เป้าหมาย | เริ่มงานทันทีและเพิ่มคำร้องให้เสร็จภายใน 30 วินาที |
| บุคลิก | Modern Friendly, น่าเชื่อถือ, อ่านง่ายในเวลากลางวัน |
| ธีม | Light mode |
| สี | Teal สำหรับ primary action, sky สำหรับ info, amber สำหรับ warning และ slate neutrals |
| Typography | Noto Sans Thai พร้อม tabular request numbers |
| Accessibility | WCAG AA, focus state ชัด, touch target ขั้นต่ำ 44px และ reduced motion |

ชื่อใหม่และตราสัญลักษณ์เป็นข้อเสนอใน prototype เท่านั้น Production runtime ยังใช้ชื่อ `CCTVStat` จนกว่าจะมีการอนุมัติ implementation

## ขอบเขตหน้าจอ

| หน้าจอ | Desktop | Mobile |
|---|---:|---:|
| Brand & Foundations | ใช่ | ใช่ |
| Components & States | ใช่ | ใช่ |
| Login | ใช่ | ใช่ |
| Dashboard | ใช่ | ใช่ |
| เพิ่มคำร้อง | ใช่ | ใช่ |
| Success | ใช่ | ใช่ |
| ค้นหา / รายการ | ใช่ | ใช่ พร้อม record list |
| แก้ไขคำร้อง | ใช่ | ใช่ |
| แนบหลักฐาน | ใช่ | ใช่ |
| รายงาน | ใช่ | responsive rules |
| Master Data | ใช่ | responsive rules |
| Print Report | ใช่ | responsive rules |

## Clickable flows

1. Dashboard → เพิ่มคำร้อง → กรอกสถานที่ → duplicate hint → บันทึก → success → แนบหลักฐาน → preview ไฟล์
2. Dashboard → ค้นหา → เปิดรายการ → แก้ไขคำร้อง → บันทึก

ทุก action ที่อาจเปลี่ยนข้อมูลจริงจำลองอยู่ใน memory ของหน้าและ reset เมื่อ reload

## Runtime contracts ที่ต้องรักษา

- Category tile picker ต้องส่ง `category_id` เหมือน production
- Duplicate hint เป็นคำแนะนำและต้องไม่ block การบันทึก
- เลขคำร้องจริงออกเมื่อบันทึก และต้องคง validation ปีงบประมาณ
- ตาราง desktop แปลงเป็น record list บน mobile
- ระบบยังเป็นเครื่องมือสถิติ ไม่ใช่คิวงานหรือ case management
- หลักฐานแนบยังเป็น optional และเพิ่มภายหลังได้

## หลักฐานการตรวจ

ตรวจเมื่อวันที่ 21 มิถุนายน 2569 ด้วย Chrome headless และ Chrome DevTools Protocol:

- `node --check design-prototype/app.js` — ผ่าน
- Visual review ที่ 1600×1100: Dashboard desktop — ผ่าน
- Visual review ที่ 1280×1100: New Request mobile 390×844 — ผ่านหลังแก้ bottom-nav containment
- Automated interaction checks 21 รายการ — ผ่านทั้งหมด
- Runtime exceptions ระหว่างทดสอบ — 0

Automated checks ครอบคลุม:

- Dashboard และ action-first band แสดงครบ
- Category tiles มี 4 รายการและ selected state ชัด
- กรอกสถานที่แล้ว duplicate hint ปรากฏ
- บันทึกแล้วไป success state และแสดง `C69-0043`
- ไปหน้าแนบหลักฐานและแสดง preview 2 ไฟล์
- สลับ mobile viewport และ bottom navigation อยู่ภายใน device frame
- Mobile search แสดง record list 4 รายการและเปิดหน้าแก้ไขได้
- Foundations, components, reports, master data และ print report render สำเร็จ

## ข้อจำกัดและขั้นตอนถัดไป

- Figma Starter Plan จำกัดไฟล์ไว้ 3 pages และจำกัด MCP tool calls จึงไม่สามารถประกอบทุก screen ใน Figma ได้
- Figma artifact ปัจจุบันมี 3 variable collections, 64 variables, 9 text styles และ 3 effect styles โดย foundations validation ผ่านก่อน quota หมด
- หากเลือกทิศทางนี้ ให้ใช้ prototype เป็น visual source และ `UI_SPEC.md` เป็น behavioral source ระหว่าง implementation
- หลัง implement ต้องทดสอบ production routes, access gate, database, attachments และ exports แยกจาก prototype QA
