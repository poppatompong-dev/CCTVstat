import {
  BarChart3,
  ClipboardList,
  FilePlus2,
  Paperclip,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { requireAuth } from "@/lib/auth";
import { getDashboardStats, listRequests } from "@/lib/db";
import { formatNumber } from "@/lib/format";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { RequestList } from "@/components/RequestList";

export default async function HomePage() {
  await requireAuth();
  const [stats, latest] = await Promise.all([
    getDashboardStats(),
    listRequests({}, 8),
  ]);

  return (
    <AppShell>
      <PageHeader
        title="แดชบอร์ดคำร้อง CCTV"
        description="บันทึก ค้นหา และสรุปรายงานคำร้องจากใบคำร้องกระดาษเดิม"
        action={{ href: "/requests/new", label: "เพิ่มคำร้องใหม่", icon: <FilePlus2 size={18} /> }}
      />

      <section className="hero-panel">
        <div>
          <p className="kicker">วันนี้พร้อมทำงาน</p>
          <h2>เพิ่มคำร้องให้จบในไม่กี่จังหวะ แล้วค่อยแนบหลักฐานภายหลัง</h2>
          <p>
            ระบบออกเลขคำร้องตามปีงบประมาณให้อัตโนมัติ แต่ยังแก้เลขได้อย่างตั้งใจเมื่อต้องนำเข้าข้อมูลย้อนหลัง
          </p>
        </div>
        <div className="hero-actions">
          <Link className="btn primary" href="/requests/new">
            <FilePlus2 size={18} />
            เพิ่มคำร้อง
          </Link>
          <Link className="btn outline" href="/reports">
            <BarChart3 size={18} />
            ดูรายงาน
          </Link>
        </div>
      </section>

      <section className="metric-grid" aria-label="สถิติโดยรวม">
        <div className="metric-tile">
          <ClipboardList size={20} />
          <span>คำร้องทั้งหมด</span>
          <strong>{formatNumber(stats.total)}</strong>
        </div>
        <div className="metric-tile">
          <Sparkles size={20} />
          <span>เดือนนี้</span>
          <strong>{formatNumber(stats.thisMonth)}</strong>
        </div>
        <div className="metric-tile">
          <Paperclip size={20} />
          <span>มีไฟล์แนบ</span>
          <strong>{formatNumber(stats.withAttachments)}</strong>
        </div>
        <div className="metric-tile emphasized">
          <span>เลขล่าสุด</span>
          <strong className="mono">{stats.latestRequestNo ?? "-"}</strong>
        </div>
      </section>

      <section className="section-block">
        <div className="section-head">
          <h2>รายการล่าสุด</h2>
          <Link href="/requests" className="text-link">
            ดูทั้งหมด
          </Link>
        </div>
        <RequestList rows={latest} />
      </section>
    </AppShell>
  );
}
