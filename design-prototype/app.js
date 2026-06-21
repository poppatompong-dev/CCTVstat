const screenTitles = {
  foundations: "Brand & Foundations",
  components: "Components & States",
  login: "เข้าสู่ระบบ",
  dashboard: "Dashboard",
  "new-request": "เพิ่มคำร้องใหม่",
  success: "บันทึกสำเร็จ",
  search: "ค้นหา / รายการคำร้อง",
  edit: "แก้ไขคำร้อง",
  attachments: "แนบหลักฐาน",
  reports: "รายงานสถิติ",
  "master-data": "Master Data",
  print: "Print Report",
};

const mobileScreens = new Set(["foundations", "components", "login", "dashboard", "new-request", "success", "search", "edit", "attachments"]);

const state = {
  screen: new URLSearchParams(location.search).get("screen") || "dashboard",
  viewport: new URLSearchParams(location.search).get("viewport") || "desktop",
  category: "อุบัติเหตุจราจร",
  duplicateVisible: false,
  previewAdded: false,
};

const root = document.querySelector("#prototypeRoot");
const device = document.querySelector("#device");
const screenTitle = document.querySelector("#screenTitle");
const screenMeta = document.querySelector("#screenMeta");
const toast = document.querySelector("#toast");

const paths = {
  camera: '<rect x="3" y="6" width="18" height="14" rx="3"></rect><circle cx="12" cy="13" r="3"></circle><path d="M8 6l1.2-2h5.6L16 6"></path>',
  dashboard: '<rect x="3" y="3" width="7" height="7" rx="1"></rect><rect x="14" y="3" width="7" height="7" rx="1"></rect><rect x="3" y="14" width="7" height="7" rx="1"></rect><rect x="14" y="14" width="7" height="7" rx="1"></rect>',
  plus: '<path d="M12 5v14M5 12h14"></path>',
  search: '<circle cx="11" cy="11" r="7"></circle><path d="m20 20-4-4"></path>',
  report: '<path d="M4 20V10M10 20V4M16 20v-7M22 20V7"></path>',
  settings: '<circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V21h-4v-.1A1.7 1.7 0 0 0 9 19.3a1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1A1.7 1.7 0 0 0 4.6 15 1.7 1.7 0 0 0 3 14H3v-4h.1A1.7 1.7 0 0 0 4.7 9a1.7 1.7 0 0 0-.3-1.9L4.3 7 7 4.2l.1.1A1.7 1.7 0 0 0 9 4.6 1.7 1.7 0 0 0 10 3h4a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1H21v4h-.1a1.7 1.7 0 0 0-1.5 1Z"></path>',
  car: '<path d="M5 17h14l-1.5-6h-11L5 17Z"></path><path d="M7 11l1.5-4h7L17 11"></path><circle cx="8" cy="18" r="1.5"></circle><circle cx="16" cy="18" r="1.5"></circle>',
  building: '<path d="M4 21h16M6 21V8l6-4 6 4v13M9 12h2M13 12h2M9 16h2M13 16h2"></path>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"></path><path d="m9 12 2 2 4-4"></path>',
  eye: '<path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"></path><circle cx="12" cy="12" r="2.5"></circle>',
  alert: '<path d="M10.3 3.7 2.5 18a2 2 0 0 0 1.8 3h15.4a2 2 0 0 0 1.8-3L13.7 3.7a2 2 0 0 0-3.4 0Z"></path><path d="M12 9v4M12 17h.01"></path>',
  check: '<path d="m5 12 4 4L19 6"></path>',
  upload: '<path d="M12 16V4M7 9l5-5 5 5"></path><path d="M4 15v5h16v-5"></path>',
  file: '<path d="M6 2h8l4 4v16H6z"></path><path d="M14 2v5h5"></path>',
  clip: '<path d="m21.4 11.6-8.9 8.9a6 6 0 0 1-8.5-8.5l9.6-9.6a4 4 0 0 1 5.7 5.7l-9.6 9.6a2 2 0 1 1-2.8-2.8l8.9-8.9"></path>',
};

function icon(name) {
  return `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${paths[name] || paths.dashboard}</svg>`;
}

const rows = [
  ["C69-0042", "20 มิ.ย. 2569", "อุบัติเหตุจราจร", "แยกเดชาติวงศ์", "checking", "กำลังตรวจสอบภาพ"],
  ["C69-0041", "20 มิ.ย. 2569", "เหตุเกี่ยวกับทรัพย์สิน", "หน้าตลาดบ่อนไก่", "received", "รับคำร้องแล้ว"],
  ["C69-0040", "19 มิ.ย. 2569", "ตรวจสอบเหตุการณ์", "ถนนอรรถกวี", "found", "พบภาพ"],
  ["C69-0039", "18 มิ.ย. 2569", "หน่วยงานราชการ", "บริเวณสวนสาธารณะ", "notified", "แจ้งผลแล้ว"],
];

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 1800);
}

function navButton(screen, label, iconName, active) {
  return `<button type="button" class="${active === screen ? "active" : ""}" data-action="goto" data-target="${screen}">${icon(iconName)}<span>${label}</span></button>`;
}

function shell(content, active = "dashboard") {
  return `
    <div class="product-app">
      <aside class="product-sidebar">
        <div class="product-brand"><span class="brand-symbol">${icon("camera")}</span><div><strong>ศูนย์สถิติคำร้อง CCTV</strong><small>CCTV Request Insights</small></div></div>
        <nav class="product-nav" aria-label="เมนูหลัก">
          ${navButton("dashboard", "Dashboard", "dashboard", active)}
          ${navButton("new-request", "เพิ่มคำร้อง", "plus", active)}
          ${navButton("search", "ค้นหา / แก้ไข", "search", active)}
          ${navButton("reports", "รายงาน", "report", active)}
          ${navButton("master-data", "ตั้งค่าข้อมูลหลัก", "settings", active)}
        </nav>
        <div class="sidebar-footer">กลุ่มงานสถิติข้อมูลและสารสนเทศ<br>เทศบาลนครนครสวรรค์</div>
      </aside>
      <div class="product-main">
        <header class="product-topbar"><strong>พื้นที่ทำงานของเจ้าหน้าที่</strong><span class="work-status"><i class="status-dot"></i>ระบบพร้อมใช้งาน</span></header>
        <header class="mobile-topbar"><div class="mobile-brand"><span class="brand-symbol">${icon("camera")}</span><span>ศูนย์สถิติคำร้อง</span></div><button class="btn btn-secondary btn-small" type="button">เมนู</button></header>
        <main class="product-content">${content}</main>
        <nav class="mobile-bottom-nav" aria-label="เมนูมือถือ">
          ${navButton("dashboard", "หน้าหลัก", "dashboard", active)}
          ${navButton("new-request", "เพิ่ม", "plus", active)}
          ${navButton("search", "ค้นหา", "search", active)}
          ${navButton("reports", "รายงาน", "report", active)}
        </nav>
      </div>
    </div>`;
}

function pageHeading(title, description, action = "") {
  return `<div class="page-heading"><div><h1>${title}</h1><p>${description}</p></div>${action ? `<div class="heading-actions">${action}</div>` : ""}</div>`;
}

function tableRows() {
  return rows.map((r) => `<tr><td><button class="text-link request-id" data-action="goto" data-target="edit">${r[0]}</button></td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td><td><span class="status ${r[4]}">${r[5]}</span></td><td><button class="btn btn-secondary btn-small" data-action="goto" data-target="edit">เปิด</button></td></tr>`).join("");
}

function recordRows() {
  return rows.map((r) => `<article class="record-card" data-action="goto" data-target="edit"><div class="record-card-head"><strong class="request-id">${r[0]}</strong><span class="status ${r[4]}">${r[5]}</span></div><dl><dt>วันที่</dt><dd>${r[1]}</dd><dt>หมวดหมู่</dt><dd>${r[2]}</dd><dt>สถานที่</dt><dd>${r[3]}</dd></dl></article>`).join("");
}

function dashboard() {
  const content = `${pageHeading("Dashboard", "เริ่มงานสำคัญได้ทันที แล้วดูตัวเลขประกอบการติดตาม", `<button class="btn btn-primary" data-action="goto" data-target="new-request">${icon("plus")}เพิ่มคำร้องใหม่</button>`)}
    <section class="action-band"><div><h2>บันทึกคำร้องใหม่ให้เสร็จภายใน 30 วินาที</h2><p>กรอกเฉพาะข้อมูลจำเป็น ระบบออกเลขตามปีงบประมาณอัตโนมัติ และแนบหลักฐานภายหลังได้</p><div style="margin-top:18px"><button class="btn btn-primary" data-action="goto" data-target="new-request">${icon("plus")}เริ่มเพิ่มคำร้อง</button></div></div><div class="quick-search"><label for="quickRequest">ค้นหาเลขคำร้อง</label><div class="search-box">${icon("search")}<input id="quickRequest" placeholder="เช่น C69-0042"><button class="text-link" data-action="goto" data-target="search">ค้นหา</button></div></div></section>
    <section class="metric-row" aria-label="สถิติภาพรวม"><div class="metric"><span>คำร้องทั้งหมด</span><strong>427</strong></div><div class="metric"><span>เดือนนี้</span><strong>42</strong></div><div class="metric"><span>มีไฟล์แนบ</span><strong>318</strong></div><div class="metric"><span>เลขล่าสุด</span><strong class="request-number">C69-0042</strong></div></section>
    <div class="split-layout"><section class="section-panel"><div class="section-header"><h2>รายการล่าสุด</h2><button class="text-link" data-action="goto" data-target="search">ดูทั้งหมด</button></div><table class="data-table"><thead><tr><th>เลขคำร้อง</th><th>วันที่</th><th>หมวดหมู่</th><th>สถานที่</th><th>สถานะ</th><th></th></tr></thead><tbody>${tableRows()}</tbody></table><div class="record-list">${recordRows()}</div></section><aside class="section-panel"><div class="section-header"><h2>ควรติดตาม</h2><button class="text-link" data-action="goto" data-target="search">เปิดมุมมอง</button></div><div class="follow-summary"><div class="follow-item"><span>กำลังตรวจสอบเกินกำหนด</span><strong>7</strong></div><div class="follow-item"><span>ยังไม่แจ้งผล</span><strong>12</strong></div><div class="inline-alert info">${icon("eye")}รายการนี้เป็นสถิติเพื่อช่วยติดตาม ไม่ใช่คิวงานหรือการมอบหมายคดี</div></div></aside></div>`;
  return shell(content, "dashboard");
}

function requestForm(editing = false) {
  const categories = [["อุบัติเหตุจราจร", "car"], ["เหตุเกี่ยวกับทรัพย์สิน", "shield"], ["ตรวจสอบเหตุการณ์", "eye"], ["หน่วยงานราชการ", "building"]];
  const categoryTiles = categories.map(([label, ico]) => `<button type="button" class="category-tile ${state.category === label ? "selected" : ""}" data-action="category" data-category="${label}">${icon(ico)}<span>${label}</span></button>`).join("");
  const content = `${pageHeading(editing ? "แก้ไขคำร้อง C69-0042" : "เพิ่มคำร้องใหม่", editing ? "แก้ไขข้อมูลและบันทึกประวัติการเปลี่ยนแปลง" : "กรอกข้อมูลจำเป็นก่อน รายละเอียดและหลักฐานเพิ่มภายหลังได้", editing ? `<button class="btn btn-secondary" data-action="goto" data-target="attachments">${icon("clip")}หลักฐาน 2 ไฟล์</button>` : "")}
    <section class="form-panel"><div class="form-grid"><div class="field"><label>วันที่รับคำร้อง</label><input inputmode="numeric" value="21/06/2569"></div><div class="field"><label>ประเภทผู้ขอ</label><select><option>ประชาชน</option><option>หน่วยงานราชการ</option><option>เจ้าหน้าที่</option></select></div><div class="field full"><label>หมวดหมู่การขอดูภาพ</label><div class="category-grid">${categoryTiles}</div><small>เลือกได้ 1 หมวดหมู่ · ส่งค่า category_id เหมือนระบบเดิม</small></div><div class="field"><label>สถานะ</label><select><option>รับคำร้องแล้ว</option><option ${editing ? "selected" : ""}>กำลังตรวจสอบภาพ</option><option>พบภาพ</option><option>ไม่พบภาพ</option><option>แจ้งผลแล้ว</option></select></div><div class="field"><label>สถานที่เกิดเหตุ</label><input id="locationField" value="${editing ? "แยกเดชาติวงศ์" : ""}" placeholder="เช่น แยกเดชาติวงศ์"></div><div class="field full"><label>หมายเหตุ</label><textarea placeholder="ไม่บังคับ">${editing ? "ตรวจสอบช่วงเวลาประมาณ 18.30–19.00 น." : ""}</textarea></div></div>
    ${state.duplicateVisible ? `<div class="inline-alert warning">${icon("alert")}<div><strong>มีคำร้องคล้ายกันวันนี้</strong><br>C69-0040 · อุบัติเหตุจราจร · แยกเดชาติวงศ์ <button class="text-link" data-action="goto" data-target="edit">เปิดดู</button></div></div>` : ""}
    <div class="estimate"><div><span>${editing ? "เลขคำร้องปัจจุบัน" : "เลขคำร้องโดยประมาณ"}</span><strong>${editing ? "C69-0042" : "C69-0043"}</strong></div><span>${editing ? "แก้เลขได้ผ่าน action เฉพาะพร้อม validation" : "เลขจริงออกเมื่อบันทึก"}</span></div>
    <div class="form-actions"><button class="btn btn-secondary" data-action="goto" data-target="dashboard">ยกเลิก</button>${editing ? `<button class="btn btn-danger btn-small" data-action="toast" data-message="Prototype: เปิด confirmation modal ก่อนลบ">ลบคำร้อง</button>` : ""}<button class="btn btn-primary" data-action="${editing ? "save-edit" : "save-request"}">${icon("check")}${editing ? "บันทึกการแก้ไข" : "บันทึกและออกเลขคำร้อง"}</button></div></section>`;
  return shell(content, editing ? "search" : "new-request");
}

function success() {
  return shell(`<section class="success-layout"><div class="success-icon">${icon("check")}</div><h1>บันทึกสำเร็จ</h1><p>กรุณาเขียนเลขนี้ที่หัวใบคำร้อง</p><div class="issued-number"><span>เลขคำร้อง</span><strong>C69-0043</strong><button class="btn btn-secondary btn-small" data-action="copy-number">คัดลอกเลข</button></div><div class="success-actions"><button class="btn btn-primary" data-action="goto" data-target="attachments">${icon("clip")}แนบหลักฐาน</button><button class="btn btn-secondary" data-action="goto" data-target="new-request">เพิ่มคำร้องใหม่</button><button class="btn btn-ghost" data-action="goto" data-target="dashboard">กลับหน้าหลัก</button></div></section>`, "new-request");
}

function search() {
  const content = `${pageHeading("ค้นหา / แก้ไขคำร้อง", "ค้นหาเร็วจากเลขคำร้อง หรือกรองตามข้อมูลที่ทราบ")}
    <div class="quick-filters"><button class="quick-filter active">ทั้งหมด</button><button class="quick-filter">เดือนนี้</button><button class="quick-filter">ควรติดตาม</button><button class="quick-filter">พบภาพ</button></div>
    <section class="filter-panel"><div class="filter-grid"><div class="field"><label>เลขคำร้อง</label><input placeholder="C69-0042"></div><div class="field"><label>หมวดหมู่</label><select><option>ทั้งหมด</option><option>อุบัติเหตุจราจร</option></select></div><div class="field"><label>ประเภทผู้ขอ</label><select><option>ทั้งหมด</option><option>ประชาชน</option></select></div><div class="field"><label>สถานะ</label><select><option>ทั้งหมด</option><option>กำลังตรวจสอบภาพ</option></select></div><button class="btn btn-primary" data-action="toast" data-message="แสดงผลลัพธ์ 4 รายการ">${icon("search")}ค้นหา</button></div></section>
    <section class="section-panel"><div class="section-header"><h2>ผลการค้นหา 4 รายการ</h2><span style="color:var(--slate-500);font-size:.74rem">เรียงจากล่าสุด</span></div><table class="data-table"><thead><tr><th>เลขคำร้อง</th><th>วันที่</th><th>หมวดหมู่</th><th>สถานที่</th><th>สถานะ</th><th></th></tr></thead><tbody>${tableRows()}</tbody></table><div class="record-list">${recordRows()}</div></section>`;
  return shell(content, "search");
}

function attachments() {
  const content = `${pageHeading("หลักฐานแนบ · C69-0043", "รองรับรูปภาพ PDF DOC และ DOCX สูงสุด 5 ไฟล์ต่อครั้ง", `<button class="btn btn-secondary" data-action="goto" data-target="edit">กลับข้อมูลคำร้อง</button>`)}
    <div class="detail-layout"><section class="form-panel" style="max-width:none"><div class="form-grid"><div class="field"><label>ประเภทหลักฐาน</label><select><option>ใบคำร้อง</option><option>เอกสารประกอบ</option><option>ภาพจากกล้อง</option></select></div><div class="field"><label>หมายเหตุไฟล์</label><input placeholder="ใช้กับทุกไฟล์ในชุดนี้"></div><div class="field full"><button type="button" class="upload-zone" data-action="add-preview">${icon("upload")}<strong>เลือกไฟล์หรือลากมาวาง</strong><span>Prototype จะแสดง preview ตัวอย่างโดยไม่อ่านไฟล์จริง</span></button></div></div>${state.previewAdded ? `<div class="inline-alert success">${icon("check")}เลือก 2 ไฟล์ · รวม 3.2 MB · พร้อมอัปโหลด</div><div class="file-grid"><article class="file-card added">${icon("file")}<strong>ใบคำร้อง-C69-0043.pdf</strong><span>PDF · 1.2 MB</span></article><article class="file-card added">${icon("file")}<strong>ภาพสถานที่-01.jpg</strong><span>JPG · 2.0 MB</span></article></div><div class="form-actions"><button class="btn btn-primary" data-action="upload-files">${icon("upload")}อัปโหลด 2 ไฟล์</button></div>` : ""}</section><aside class="detail-side"><section class="mini-panel"><h3>ไฟล์ที่แนบแล้ว</h3><div class="file-grid" style="grid-template-columns:1fr"><article class="file-card">${icon("file")}<strong>ใบคำร้องเดิม.pdf</strong><span>PDF · ดาวน์โหลด · ลบ</span></article><article class="file-card">${icon("file")}<strong>ภาพประกอบ.jpg</strong><span>JPG · ดาวน์โหลด · ลบ</span></article></div></section></aside></div>`;
  return shell(content, "search");
}

function reports() {
  const content = `${pageHeading("รายงานสถิติ", "สรุปผลตามช่วงวันที่ หมวดหมู่ ประเภทผู้ขอ และสถานะ", `<button class="btn btn-secondary" data-action="goto" data-target="print">พิมพ์รายงาน</button><button class="btn btn-primary" data-action="toast" data-message="Prototype: เตรียม Export Excel">Export Excel</button>`)}
    <section class="filter-panel"><div class="filter-grid"><div class="field"><label>ตั้งแต่วันที่</label><input inputmode="numeric" value="01/06/2569"></div><div class="field"><label>ถึงวันที่</label><input inputmode="numeric" value="30/06/2569"></div><div class="field"><label>หมวดหมู่</label><select><option>ทั้งหมด</option></select></div><div class="field"><label>สถานะ</label><select><option>ทั้งหมด</option></select></div><button class="btn btn-primary" data-action="toast" data-message="อัปเดตรายงานแล้ว">แสดงรายงาน</button></div></section>
    <section class="report-summary"><div class="report-stat"><span>คำร้องทั้งหมดในช่วง</span><strong>42</strong></div><div class="report-stat"><span>พบภาพ</span><strong style="color:var(--green-700)">18</strong></div><div class="report-stat"><span>ควรติดตาม</span><strong style="color:var(--amber-600)">7</strong></div></section>
    <div class="report-grid"><section class="chart-panel"><h3>สรุปตามหมวดหมู่</h3><div class="bar-list">${[["อุบัติเหตุจราจร",82,18],["ทรัพย์สิน",58,12],["ตรวจสอบเหตุการณ์",39,8],["หน่วยงานราชการ",20,4]].map(([l,w,n])=>`<div class="bar-item"><span>${l}</span><div class="bar-track"><div class="bar-fill" style="width:${w}%"></div></div><strong>${n}</strong></div>`).join("")}</div></section><section class="chart-panel"><h3>สรุปตามสถานะ</h3><div class="bar-list">${[["รับคำร้องแล้ว",36,8],["กำลังตรวจสอบ",62,14],["พบภาพ",80,18],["แจ้งผลแล้ว",52,12]].map(([l,w,n])=>`<div class="bar-item"><span>${l}</span><div class="bar-track"><div class="bar-fill" style="width:${w}%;background:var(--sky-600)"></div></div><strong>${n}</strong></div>`).join("")}</div></section></div>`;
  return shell(content, "reports");
}

function masterData() {
  const items = ["อุบัติเหตุจราจร", "เหตุเกี่ยวกับทรัพย์สิน", "ตรวจสอบเหตุการณ์", "หน่วยงานราชการ"];
  const content = `${pageHeading("จัดการหมวดหมู่", "กำหนดชื่อ สถานะ และลำดับที่ใช้ในแบบฟอร์มและรายงาน")}
    <div class="master-layout"><aside class="master-add"><h2 style="margin-top:0;font-size:1rem">เพิ่มหมวดหมู่</h2><div class="field"><label>ชื่อหมวดหมู่</label><input placeholder="กรอกชื่อ"></div><div class="field" style="margin-top:12px"><label>สถานะ</label><select><option>เปิดใช้งาน</option><option>ปิดใช้งาน</option></select></div><button class="btn btn-primary" style="width:100%;margin-top:16px" data-action="toast" data-message="เพิ่มรายการตัวอย่างแล้ว">${icon("plus")}เพิ่มรายการ</button></aside><section class="section-panel"><div class="section-header"><h2>หมวดหมู่ทั้งหมด</h2><span style="color:var(--slate-500);font-size:.72rem">ลากเพื่อจัดลำดับ</span></div>${items.map((item,i)=>`<div class="master-row"><button class="drag-handle" data-action="toast" data-message="Prototype: ลากสลับตำแหน่งแล้ว">⋮⋮ ${i+1}</button><div class="field"><input value="${item}"></div><span class="status found">เปิดใช้งาน</span><button class="btn btn-secondary btn-small" data-action="toast" data-message="บันทึกรายการแล้ว">บันทึก</button></div>`).join("")}</section></div>`;
  return shell(content, "master-data");
}

function login() {
  return `<div class="login-screen"><section class="login-brand"><div class="login-brand-inner"><span class="brand-symbol">${icon("camera")}</span><h1>ศูนย์สถิติคำร้อง CCTV</h1><p>เครื่องมือภายในสำหรับบันทึก ค้นหา และสรุปสถิติการขอดูภาพจากกล้องวงจรปิดอย่างรวดเร็ว</p></div></section><section class="login-form-wrap"><form class="login-form" onsubmit="return false"><h2>เข้าสู่พื้นที่ทำงาน</h2><p>ใช้รหัสผ่านส่วนกลางสำหรับช่วงทดลองระบบ</p><div class="field"><label for="password">รหัสผ่าน</label><input id="password" type="password" value="prototype" autocomplete="current-password"></div><button class="btn btn-primary" style="width:100%;margin-top:16px" data-action="goto" data-target="dashboard">เข้าสู่ระบบ</button><div class="inline-alert info">${icon("shield")}ระบบจริงปกป้องทุกหน้าด้วย Access Gate และ session cookie</div></form></section></div>`;
}

function foundations() {
  const swatches = [["Primary","var(--teal-700)","#0F766E"],["Primary soft","var(--teal-50)","#F0FDFA"],["Info","var(--sky-600)","#0284C7"],["Warning","var(--amber-600)","#D97706"],["Canvas","var(--slate-50)","#F8FAFC"],["Ink","var(--slate-900)","#0F172A"],["Border","var(--slate-200)","#E2E8F0"],["Success","var(--green-700)","#15803D"]];
  return `<div class="foundation-page"><header class="foundation-header"><div class="product-brand" style="padding:0;color:var(--slate-900)"><span class="brand-symbol">${icon("camera")}</span><div><strong style="color:var(--slate-900)">ศูนย์สถิติคำร้อง CCTV</strong><small>CCTV Request Insights</small></div></div><h1>Modern Friendly product system</h1><p>ระบบภาพสำหรับเครื่องมือสถิติภายในที่ใช้งานกลางวัน สีช่วยนำสายตาและสื่อสถานะโดยไม่กลบข้อมูล ตัวเลขและแบบฟอร์มต้องอ่านเร็วบนจอจริง</p></header><section class="foundation-section"><h2>Color tokens</h2><div class="swatch-row">${swatches.map(([n,c,h])=>`<div class="swatch"><div class="swatch-color" style="background:${c}"></div><strong>${n}</strong><small>${h}</small></div>`).join("")}</div></section><section class="foundation-section"><h2>Typography · Noto Sans Thai</h2><div class="type-sample"><span>Heading / H1 · Bold 32</span><strong style="font-size:2rem">ข้อมูลชัด เริ่มงานได้ทันที</strong></div><div class="type-sample"><span>Heading / H2 · SemiBold 24</span><strong style="font-size:1.5rem">รายงานสถิติที่เชื่อถือได้</strong></div><div class="type-sample"><span>Body / Medium · Regular 14</span><p style="margin:0;font-size:.875rem;line-height:1.65">บันทึกคำร้องจากใบคำร้องกระดาษเดิม พร้อมค้นหา แก้ไข และแนบหลักฐานภายหลัง</p></div><div class="type-sample"><span>Number / Large · Bold 32</span><strong class="request-id" style="font-size:2rem">C69-0043</strong></div></section><section class="foundation-section"><h2>Rules</h2><div class="component-showcase"><span class="status received">รับคำร้องแล้ว</span><span class="status checking">กำลังตรวจสอบ</span><span class="status found">พบภาพ</span><button class="btn btn-primary">Primary action</button><button class="btn btn-secondary">Secondary</button></div><div class="inline-alert info">${icon("shield")}WCAG AA · touch target ขั้นต่ำ 44px · motion 150–220ms · รองรับ reduced motion · mobile tables แปลงเป็น record lists</div></section></div>`;
}

function components() {
  return `<div class="foundation-page"><header class="foundation-header"><h1>Components & States</h1><p>ตัวอย่าง component vocabulary ที่ใช้ร่วมกันทุกหน้าจอ คงรูปทรงและ state เดิมเพื่อให้เจ้าหน้าที่เรียนรู้ครั้งเดียวแล้วใช้ได้ทั้งระบบ</p></header><section class="foundation-section"><h2>Actions</h2><div class="component-showcase"><button class="btn btn-primary">บันทึกข้อมูล</button><button class="btn btn-secondary">ยกเลิก</button><button class="btn btn-danger">ลบรายการ</button><button class="btn btn-ghost">ดูรายละเอียด</button><button class="btn btn-primary" disabled style="opacity:.5;cursor:not-allowed">กำลังบันทึก…</button></div></section><section class="foundation-section"><h2>Inputs & category_id tile picker</h2><div class="component-showcase" style="align-items:start"><div class="field" style="width:260px"><label>สถานที่เกิดเหตุ</label><input placeholder="กรอกสถานที่"><small>รองรับคำแนะนำจากประวัติเดิม</small></div><div class="field" style="width:220px"><label>สถานะ</label><select><option>รับคำร้องแล้ว</option></select></div><button class="category-tile selected" style="width:180px">${icon("car")}<span>อุบัติเหตุจราจร</span></button><button class="category-tile" style="width:180px">${icon("shield")}<span>เหตุเกี่ยวกับทรัพย์สิน</span></button></div></section><section class="foundation-section"><h2>Feedback</h2><div style="display:grid;gap:10px;max-width:780px"><div class="inline-alert info">${icon("eye")}มีคำร้องคล้ายกันวันนี้ — เปิดดูได้โดยไม่ block การบันทึก</div><div class="inline-alert success">${icon("check")}บันทึกสำเร็จและออกเลขคำร้องแล้ว</div><div class="inline-alert warning">${icon("alert")}เลขคำร้องไม่ตรงกับปีงบประมาณของวันที่รับคำร้อง</div><div class="inline-alert danger">${icon("alert")}อัปโหลดไม่สำเร็จ กรุณาลองอีกครั้ง</div></div></section><section class="foundation-section"><h2>Loading & Empty</h2><div class="component-showcase"><div style="width:320px"><div style="height:16px;width:52%;background:var(--slate-200);border-radius:4px;margin-bottom:12px"></div><div style="height:76px;background:var(--slate-100);border-radius:8px"></div></div><div style="width:320px;text-align:center;padding:24px"><strong>ยังไม่มีคำร้องในช่วงนี้</strong><p style="color:var(--slate-500);font-size:.78rem">เปลี่ยนช่วงวันที่หรือเพิ่มคำร้องใหม่</p></div></div></section></div>`;
}

function printReport() {
  return `<div style="padding:20px;background:#e5e7eb;min-height:860px"><article class="print-sheet"><header><h1>รายงานสถิติการขอดูภาพจากกล้องวงจรปิด</h1><p>กลุ่มงานสถิติข้อมูลและสารสนเทศ</p><p>ประจำวันที่ 1–30 มิถุนายน 2569</p></header><div class="print-total"><strong>จำนวนคำร้องทั้งหมด</strong><strong>42 รายการ</strong></div><table class="data-table"><thead><tr><th>เลขคำร้อง</th><th>วันที่</th><th>หมวดหมู่</th><th>สถานะ</th></tr></thead><tbody>${rows.map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td>${r[5]}</td></tr>`).join("")}</tbody></table><div class="signature-grid"><div><div class="signature-line"></div><p>ผู้จัดทำรายงาน</p></div><div><div class="signature-line"></div><p>ผู้ตรวจสอบ</p></div></div></article></div>`;
}

const renderers = {
  foundations,
  components,
  login,
  dashboard,
  "new-request": () => requestForm(false),
  success,
  search,
  edit: () => requestForm(true),
  attachments,
  reports,
  "master-data": masterData,
  print: printReport,
};

function updateUrl() {
  const url = new URL(location.href);
  url.searchParams.set("screen", state.screen);
  url.searchParams.set("viewport", state.viewport);
  history.replaceState({}, "", url);
}

function render() {
  if (state.viewport === "mobile" && !mobileScreens.has(state.screen)) {
    state.viewport = "desktop";
    showToast("หน้าจอนี้ออกแบบเป็น Desktop พร้อม responsive rules ตาม scope");
  }
  device.className = `device ${state.viewport}`;
  root.innerHTML = (renderers[state.screen] || dashboard)();
  screenTitle.textContent = screenTitles[state.screen] || "Dashboard";
  screenMeta.textContent = state.viewport === "mobile" ? "Mobile · 390 × 844 design target" : "Desktop · 1440px design target";
  document.querySelectorAll("[data-screen]").forEach((button) => button.classList.toggle("active", button.dataset.screen === state.screen));
  document.querySelectorAll("[data-viewport]").forEach((button) => button.classList.toggle("active", button.dataset.viewport === state.viewport));
  updateUrl();
  document.querySelector("#canvas").scrollTo({ top: 0, behavior: "smooth" });
}

document.addEventListener("click", async (event) => {
  const screenButton = event.target.closest("[data-screen]");
  if (screenButton) {
    state.screen = screenButton.dataset.screen;
    render();
    return;
  }
  const viewportButton = event.target.closest("[data-viewport]");
  if (viewportButton) {
    state.viewport = viewportButton.dataset.viewport;
    render();
    return;
  }
  const action = event.target.closest("[data-action]");
  if (!action) return;
  switch (action.dataset.action) {
    case "goto": state.screen = action.dataset.target; render(); break;
    case "category": state.category = action.dataset.category; render(); break;
    case "save-request": state.screen = "success"; render(); break;
    case "save-edit": showToast("บันทึกการแก้ไขแล้ว"); break;
    case "copy-number":
      try { await navigator.clipboard.writeText("C69-0043"); } catch { /* file:// may block clipboard */ }
      showToast("คัดลอก C69-0043 แล้ว");
      break;
    case "add-preview": state.previewAdded = true; render(); break;
    case "upload-files": showToast("อัปโหลดไฟล์ตัวอย่างสำเร็จ"); break;
    case "toast": showToast(action.dataset.message || "ดำเนินการแล้ว"); break;
  }
});

document.addEventListener("input", (event) => {
  if (event.target.id === "locationField" && event.target.value.trim().length > 3 && !state.duplicateVisible) {
    state.duplicateVisible = true;
    render();
  }
});

document.querySelector("#resetPrototype").addEventListener("click", () => {
  Object.assign(state, { screen: "dashboard", viewport: "desktop", category: "อุบัติเหตุจราจร", duplicateVisible: false, previewAdded: false });
  render();
  showToast("Reset prototype แล้ว");
});

render();
