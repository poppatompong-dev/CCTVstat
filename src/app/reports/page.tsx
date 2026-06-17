import { Download, Printer } from "lucide-react";
import { requireAuth } from "@/lib/auth";
import { defaultReportRange } from "@/lib/dates";
import { getMasters, getReport } from "@/lib/db";
import { formatNumber } from "@/lib/format";
import type { RequestFilters } from "@/lib/types";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { RequestList } from "@/components/RequestList";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function readFilters(params: Record<string, string | string[] | undefined>): RequestFilters {
  const defaults = defaultReportRange();
  const get = (key: string) => (typeof params[key] === "string" ? params[key] : undefined);
  return {
    startDate: get("startDate") ?? defaults.startDate,
    endDate: get("endDate") ?? defaults.endDate,
    requesterTypeId: get("requesterTypeId"),
    categoryId: get("categoryId"),
    statusId: get("statusId"),
  };
}

function qs(filters: RequestFilters) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value) params.set(key, value);
  }
  return params.toString();
}

function BarList({ data }: { data: Array<{ name: string; count: number }> }) {
  const max = Math.max(1, ...data.map((row) => row.count));
  return (
    <div className="bar-list">
      {data.length ? data.map((row) => (
        <div className="bar-row" key={row.name}>
          <span>{row.name}</span>
          <div className="bar-track"><i style={{ width: `${Math.max(6, (row.count / max) * 100)}%` }} /></div>
          <strong>{formatNumber(row.count)}</strong>
        </div>
      )) : <p className="muted">ไม่มีข้อมูลในช่วงนี้</p>}
    </div>
  );
}

function percent(value: number | null) {
  if (value === null) return "-";
  return `${value > 0 ? "+" : ""}${value.toFixed(1)}%`;
}

function TrendChart({ data }: { data: Array<{ month: string; count: number }> }) {
  const max = Math.max(1, ...data.map((row) => row.count));
  return (
    <div className="trend-chart" aria-label="แนวโน้มย้อนหลัง 6 เดือน">
      {data.map((row) => (
        <div className="trend-bar" key={row.month}>
          <i style={{ height: `${Math.max(8, (row.count / max) * 100)}%` }} />
          <span>{row.month.slice(5)}</span>
        </div>
      ))}
    </div>
  );
}

export default async function ReportsPage({ searchParams }: { searchParams: SearchParams }) {
  await requireAuth();
  const params = await searchParams;
  const filters = readFilters(params);
  const [masters, report] = await Promise.all([getMasters(), getReport(filters)]);
  const query = qs(filters);

  return (
    <AppShell>
      <PageHeader
        title="รายงานสถิติ"
        description="สรุปจำนวนคำร้องตามช่วงวันที่ ประเภทผู้ขอ หมวดหมู่ และสถานะ"
      />

      <section className="panel">
        <form className="filter-grid">
          <label className="field">
            <span>ตั้งแต่วันที่</span>
            <input name="startDate" type="date" defaultValue={filters.startDate} required />
          </label>
          <label className="field">
            <span>ถึงวันที่</span>
            <input name="endDate" type="date" defaultValue={filters.endDate} required />
          </label>
          <label className="field">
            <span>ประเภทผู้ขอ</span>
            <select name="requesterTypeId" defaultValue={filters.requesterTypeId ?? ""}>
              <option value="">ทั้งหมด</option>
              {masters.requesterTypes.map((row) => <option key={row.id} value={row.id}>{row.name}</option>)}
            </select>
          </label>
          <label className="field">
            <span>หมวดหมู่</span>
            <select name="categoryId" defaultValue={filters.categoryId ?? ""}>
              <option value="">ทั้งหมด</option>
              {masters.categories.map((row) => <option key={row.id} value={row.id}>{row.name}</option>)}
            </select>
          </label>
          <label className="field">
            <span>สถานะ</span>
            <select name="statusId" defaultValue={filters.statusId ?? ""}>
              <option value="">ทั้งหมด</option>
              {masters.statuses.map((row) => <option key={row.id} value={row.id}>{row.name}</option>)}
            </select>
          </label>
          <div className="filter-actions">
            <button className="btn primary" type="submit">แสดงรายงาน</button>
          </div>
        </form>
      </section>

      <section className="report-summary">
        <div className="report-total">
          <span>จำนวนคำร้องทั้งหมด</span>
          <strong>{formatNumber(report.total)}</strong>
        </div>
        <div className="insight-tile">
          <span>เทียบช่วงก่อนหน้า</span>
          <strong>{percent(report.changePercent)}</strong>
          <small>ช่วงก่อนหน้า {formatNumber(report.previousTotal)} รายการ</small>
        </div>
        <div className="insight-tile">
          <span>อัตราพบภาพ</span>
          <strong>{report.foundRate === null ? "-" : `${report.foundRate.toFixed(1)}%`}</strong>
          <small>จากสถานะพบภาพและไม่พบภาพ</small>
        </div>
        <div className="export-actions">
          <a className="btn outline" href={`/api/reports/excel?${query}`}>
            <Download size={18} />
            Export Excel
          </a>
          <a className="btn outline" href={`/reports/print?${query}`} target="_blank" rel="noreferrer">
            <Printer size={18} />
            Export PDF
          </a>
          <a className="btn outline" href="/api/backup">
            <Download size={18} />
            Backup
          </a>
        </div>
      </section>

      <section className="report-grid">
        <div className="panel">
          <h2>แนวโน้มย้อนหลัง 6 เดือน</h2>
          <TrendChart data={report.monthlyTrend} />
        </div>
        <div className="panel">
          <h2>ตามหมวดหมู่</h2>
          <BarList data={report.byCategory} />
        </div>
        <div className="panel">
          <h2>ตามประเภทผู้ขอ</h2>
          <BarList data={report.byRequesterType} />
        </div>
        <div className="panel">
          <h2>ตามสถานะ</h2>
          <BarList data={report.byStatus} />
        </div>
      </section>

      <section className="section-block">
        <div className="section-head">
          <h2>ตารางรายการคำร้อง</h2>
          <span className="muted">สูงสุด 1,000 รายการต่อรายงาน</span>
        </div>
        <RequestList rows={report.rows} />
      </section>
    </AppShell>
  );
}
