# ATTACHMENT_SPEC.md

# ข้อกำหนดการแนบหลักฐาน

## 1. วัตถุประสงค์
ฟังก์ชันหลักฐานแนบใช้เก็บเอกสารประกอบคำร้อง เช่น ใบคำร้อง หนังสือราชการ ใบแจ้งความ หรือรูปภาพประกอบ เพื่อใช้อ้างอิงภายใน

## 2. หลักการ
| หลักการ | รายละเอียด |
|---|---|
| ไม่บังคับ | บันทึกคำร้องได้โดยไม่ต้องแนบไฟล์ |
| แนบภายหลังได้ | กลับมาแนบจากหน้าแก้ไขคำร้องได้ |
| ไม่ public | ไฟล์ใช้ภายในเท่านั้น |
| ไม่รับวิดีโอ | version 1 ไม่รองรับไฟล์ CCTV video |

## 3. Flow
```text
เพิ่มคำร้องใหม่
→ ระบบออกเลขคำร้อง
→ กด [แนบหลักฐาน] หรือกลับมาแนบภายหลัง
→ เลือกประเภทหลักฐาน
→ เลือกไฟล์
→ อัปโหลด
```

## 4. ประเภทหลักฐานเริ่มต้น
1. ใบคำร้อง
2. หนังสือราชการ
3. ใบแจ้งความ
4. เอกสารส่งมอบ
5. รูปภาพประกอบ
6. อื่น ๆ

## 5. ไฟล์ที่อนุญาต
| ประเภท | Extension |
|---|---|
| PDF | `.pdf` |
| Image | `.jpg`, `.jpeg`, `.png` |
| Word | `.doc`, `.docx` |

## 6. ไฟล์ที่ต้อง block
`.exe`, `.bat`, `.cmd`, `.js`, `.sh`, `.php`, `.html`

## 7. ขนาดไฟล์
ค่าเริ่มต้นสำหรับช่วงทดลองบน Vercel server upload: 4 MB ต่อไฟล์ (`MAX_UPLOAD_BYTES=4194304`) และอัปโหลดได้สูงสุด 5 ไฟล์ต่อครั้ง (`MAX_UPLOAD_FILES=5`) เพื่อคุม body size และ serverless runtime

UI ต้องแสดง preview ก่อนอัปโหลดสำหรับรูปภาพ และแสดงการ์ดชนิดไฟล์สำหรับ PDF/DOC/DOCX หลังอัปโหลดต้องแสดง thumbnail/การ์ดไฟล์ผ่าน endpoint ของระบบ ไม่เปิด Blob URL ตรงใน UI

## 8. Blob Path Structure
```text
cctv-requests/
    C69-0001/
    1780000000000-request-form.pdf
    C69-0002/
    1780000000000-request-form.jpg
```

## 9. File Naming
รูปแบบแนะนำ:
```text
{request_no}_{YYYYMMDD}_{HHmmss}_{safe_original_name}
```

เก็บทั้ง:
- `original_file_name`
- `blob_pathname`
- `blob_url`
- `download_url`

หากมีการแก้เลขคำร้องภายหลัง ไม่ควร rename ไฟล์เดิมอัตโนมัติ ความสัมพันธ์ของไฟล์แนบต้องยึด `request_id` และ metadata เป็นหลัก เพื่อไม่ให้การแก้เลขกระทบไฟล์ที่ upload แล้ว

## 10. Metadata
| Field | รายละเอียด |
|---|---|
| request_id | คำร้องที่เกี่ยวข้อง |
| evidence_type_id | ประเภทหลักฐาน |
| original_file_name | ชื่อไฟล์เดิม |
| blob_pathname | path ใน Vercel Blob |
| blob_url | URL จาก Blob SDK |
| download_url | URL สำหรับดาวน์โหลด |
| content_type | MIME type |
| size_bytes | ขนาดไฟล์ |
| note | หมายเหตุ |
| uploaded_at | วันที่อัปโหลด |

## 11. Security
- ห้ามให้ upload folder execute file
- ห้ามเปิดไฟล์ผ่าน public URL โดยตรง
- ดาวน์โหลดผ่าน endpoint ของระบบเท่านั้น
- ตรวจ extension และ MIME type
- ป้องกัน path traversal เช่น `../../`
