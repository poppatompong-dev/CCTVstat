import { FilePlus2 } from "lucide-react";
import Link from "next/link";
import { requireAuth } from "@/lib/auth";
import { getMasters, listRequests } from "@/lib/db";
import { perfLog, perfStart, timed } from "@/lib/perf";
import type { RequestFilters } from "@/lib/types";
import { AppShell } from "@/components/AppShell";
import { Feedback } from "@/components/Feedback";
import { PageHeader } from "@/components/PageHeader";
import { RequestList } from "@/components/RequestList";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function readParams(params: Record<string, string | string[] | undefined>): RequestFilters {
  const get = (key: string) => (typeof params[key] === "string" ? params[key] : undefined);
  return {
    q: get("q"),
    startDate: get("startDate"),
    endDate: get("endDate"),
    requesterTypeId: get("requesterTypeId"),
    categoryId: get("categoryId"),
    statusId: get("statusId"),
    view: get("view"),
  };
}

export default async function RequestsPage({ searchParams }: { searchParams: SearchParams }) {
  const routeStart = perfStart();
  try {
  await timed("/requests requireAuth", () => requireAuth());
  const params = await timed("/requests searchParams", () => searchParams);
  const filters = readParams(params);
  const [masters, rows] = await Promise.all([
    timed("/requests getMasters", () => getMasters()),
    timed("/requests listRequests", () => listRequests(filters)),
  ]);

  return (
    <AppShell>
      <PageHeader
        title="ค้นหา / แก้ไขคำร้อง"
        description="ค้นหาด้วยเลขคำร้อง วันที่ ประเภทผู้ขอ หมวดหมู่ หรือสถานะ"
        action={{ href: "/requests/new", label: "เพิ่มคำร้อง", icon: <FilePlus2 size={18} /> }}
      />
      <Feedback params={params} />

      <nav className="quick-filter-row" aria-label="มุมมองด่วน">
        <Link className={`quick-filter ${!filters.view ? "active" : ""}`} href="/requests">
          ทั้งหมด
        </Link>
        <Link className={`quick-filter ${filters.view === "this-month" ? "active" : ""}`} href="/requests?view=this-month">
          เดือนนี้
        </Link>
        <Link className={`quick-filter ${filters.view === "follow-up" ? "active" : ""}`} href="/requests?view=follow-up">
          ควรติดตาม
        </Link>
        <Link className={`quick-filter ${filters.view === "found" ? "active" : ""}`} href="/requests?view=found">
          พบภาพ
        </Link>
      </nav>

      <section className="panel">
        <form className="filter-grid">
          <label className="field">
            <span>เลขคำร้อง / สถานที่</span>
            <input name="q" defaultValue={filters.q} placeholder="เช่น C69-0001" />
          </label>
          <label className="field">
            <span>ตั้งแต่วันที่</span>
            <input name="startDate" type="date" defaultValue={filters.startDate} />
          </label>
          <label className="field">
            <span>ถึงวันที่</span>
            <input name="endDate" type="date" defaultValue={filters.endDate} />
          </label>
          <label className="field">
            <span>ประเภทผู้ขอ</span>
            <select name="requesterTypeId" defaultValue={filters.requesterTypeId ?? ""}>
              <option value="">ทั้งหมด</option>
              {masters.requesterTypes.map((row) => (
                <option key={row.id} value={row.id}>{row.name}</option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>หมวดหมู่</span>
            <select name="categoryId" defaultValue={filters.categoryId ?? ""}>
              <option value="">ทั้งหมด</option>
              {masters.categories.map((row) => (
                <option key={row.id} value={row.id}>{row.name}</option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>สถานะ</span>
            <select name="statusId" defaultValue={filters.statusId ?? ""}>
              <option value="">ทั้งหมด</option>
              {masters.statuses.map((row) => (
                <option key={row.id} value={row.id}>{row.name}</option>
              ))}
            </select>
          </label>
          <div className="filter-actions">
            <button className="btn primary" type="submit">ค้นหา</button>
            <Link className="btn ghost" href="/requests">ล้างตัวกรอง</Link>
          </div>
        </form>
      </section>

      <RequestList rows={rows} />
    </AppShell>
  );
  } finally {
    perfLog("/requests total", routeStart);
  }
}
