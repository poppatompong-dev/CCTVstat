import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";

export default function Loading() {
  return (
    <AppShell>
      <PageHeader
        title="รายงานสถิติ"
        description="สรุปจำนวนคำร้องตามช่วงวันที่ ประเภทผู้ขอ หมวดหมู่ และสถานะ"
      />
      <section className="panel">
        <div className="filter-grid loading-form" aria-label="กำลังเตรียมตัวกรอง">
          {Array.from({ length: 5 }).map((_, index) => (
            <div className="skeleton-field" key={index} />
          ))}
          <div className="skeleton-button" />
        </div>
      </section>
      <section className="report-summary loading-report-summary" aria-label="กำลังสรุปรายงาน">
        <div className="skeleton-metric" />
        <div className="skeleton-metric" />
        <div className="skeleton-metric" />
        <div className="skeleton-actions" />
      </section>
      <section className="report-grid">
        {Array.from({ length: 4 }).map((_, index) => (
          <div className="panel loading-chart" key={index}>
            <div className="skeleton-line short" />
            <div className="skeleton-chart" />
          </div>
        ))}
      </section>
    </AppShell>
  );
}
