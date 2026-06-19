import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";

export default function Loading() {
  return (
    <AppShell>
      <PageHeader
        title="เพิ่มคำร้องใหม่"
        description="กรอกเฉพาะข้อมูลสถิติที่จำเป็น ระบบจะออกเลขคำร้องให้ทันทีหลังบันทึก"
      />
      <section className="panel">
        <div className="form-grid loading-form" aria-label="กำลังเตรียมฟอร์ม">
          <div className="span-2 skeleton-box number-preview-skeleton" />
          <div className="skeleton-field" />
          <div className="skeleton-field" />
          <div className="span-2 skeleton-category-grid">
            {Array.from({ length: 4 }).map((_, index) => (
              <div className="skeleton-box category-skeleton" key={index} />
            ))}
          </div>
          <div className="skeleton-field" />
          <div className="span-2 skeleton-field" />
          <div className="span-2 skeleton-textarea" />
        </div>
      </section>
    </AppShell>
  );
}
