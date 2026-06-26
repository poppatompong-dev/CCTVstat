# Design

## Redesign Review Artifact

ต้นแบบทิศทางถัดไปใช้ชื่อ **ศูนย์สถิติคำร้อง CCTV / CCTV Request Insights** และแนวทาง Modern Friendly, light mode, action-first โดยยังรักษาผลิตภัณฑ์ให้เป็นเครื่องมือสถิติที่เพิ่มคำร้องได้เร็ว ไม่ขยายเป็น case management

- Interactive prototype: [`design-prototype/index.html`](design-prototype/index.html)
- Handoff และหลักฐาน QA: [`cctv-request-statistics-docs/REDESIGN_HANDOFF.md`](cctv-request-statistics-docs/REDESIGN_HANDOFF.md)
- Partial Figma foundations: [ศูนย์สถิติคำร้อง CCTV — Full Product Redesign](https://www.figma.com/design/MYZR5R8v6sqSknUhEmmNXO)

Prototype เป็น artifact สำหรับ review เท่านั้น Design ด้านล่างยังอธิบาย production UI ปัจจุบันจนกว่าจะมีการอนุมัติและนำ redesign ไป implement จริง

## Theme

เครื่องมือสถิติภายในเทศบาลที่ใช้งานกลางวันบนโต๊ะทำงานและหน้างาน: แสงจริง หน้าจอมือถือจริง ข้อมูลต้องอ่านทันที ความสวยมาจากความคมของลำดับชั้น ระยะหายใจ และสถานะที่ชัด ไม่ใช่ของตกแต่ง

## Color Strategy

Restrained product palette. Primary teal ใช้กับ action สำคัญ สถานะ active และจุดนำสายตาเท่านั้น เสริมด้วย accent copper สำหรับการแจ้งเตือน/จุดเน้นเล็กน้อย พื้นหลักเป็น pure white เพื่อความเร็ว อ่านง่าย และไม่ติดภาพ template

## Palette

```css
:root {
  --bg: oklch(1.000 0.000 0);
  --surface: oklch(0.973 0.006 175);
  --surface-strong: oklch(0.935 0.012 175);
  --ink: oklch(0.185 0.025 170);
  --muted: oklch(0.455 0.025 170);
  --primary: oklch(0.450 0.086 170);
  --primary-strong: oklch(0.360 0.090 170);
  --primary-soft: oklch(0.930 0.035 170);
  --accent: oklch(0.560 0.130 45);
  --accent-soft: oklch(0.930 0.045 55);
  --danger: oklch(0.520 0.160 25);
  --warning: oklch(0.680 0.125 75);
  --success: oklch(0.480 0.115 145);
  --border: oklch(0.875 0.010 175);
  --focus: oklch(0.650 0.120 170);
}
```

## Typography

ใช้ system sans stack ที่อ่านภาษาไทยดี: `Leelawadee UI`, `Noto Sans Thai`, `Tahoma`, `Arial`, `system-ui`, `sans-serif`. ขนาดตัวอักษรเป็น fixed rem scale ไม่ใช้ fluid typography ใน product UI. ตัวเลขคำร้องใช้ tabular numerals เพื่อ scan ง่าย

## Layout

Desktop ใช้ app shell แบบ sidebar ซ้าย + content หลักกว้างพอดี Tablet ยุบ sidebar เป็น top rail หรือ compact nav Mobile ใช้ bottom action/stacked layout โดยหน้าเพิ่มคำร้องต้องเป็น first-class flow ไม่ใช่ table ย่อส่วน

## Components

ปุ่มหลักเป็น filled primary พร้อม icon ปุ่มรองเป็น outline/ghost ที่ affordance ชัด Form control สูงพอสำหรับ touch target มี focus ring ชัด Tables บน desktop เป็น dense แต่ mobile แปลงเป็น record list พร้อม label-value pair. Cards ใช้เฉพาะรายการซ้ำหรือ panel งานจริง รัศมีไม่เกิน 8px

## Motion

ใช้ transition 160-220ms สำหรับ hover, focus, reveal panel และ success feedback เท่านั้น รองรับ `prefers-reduced-motion: reduce` เสมอ ไม่มี page-load choreography
