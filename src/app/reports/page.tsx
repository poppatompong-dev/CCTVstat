import { Suspense } from "react";
import { Download, Printer } from "lucide-react";
import { requireAuth } from "@/lib/auth";
import { defaultReportRange } from "@/lib/dates";
import { getMasters, getReport } from "@/lib/db";
import { formatNumber } from "@/lib/format";
import { perfLog, perfStart, timed } from "@/lib/perf";
import type { MasterRow, ReportData, RequestFilters } from "@/lib/types";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { RequestList } from "@/components/RequestList";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;
type Masters = {
  requesterTypes: MasterRow[];
  categories: MasterRow[];
  statuses: MasterRow[];
  evidenceTypes: MasterRow[];
};

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

async function ReportFilters({
  filters,
  mastersPromise,
}: {
  filters: RequestFilters;
  mastersPromise: Promise<Masters>;
}) {
  const masters = await mastersPromise;

  return (
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
  );
}

function ReportFiltersSkeleton() {
  return (
    <section className="panel">
      <div className="filter-grid loading-form" aria-label="กำลังเตรียมตัวกรอง">
        {Array.from({ length: 5 }).map((_, index) => (
          <div className="skeleton-field" key={index} />
        ))}
        <div className="skeleton-button" />
      </div>
    </section>
  );
}

async function ReportResults({
  filters,
  reportPromise,
}: {
  filters: RequestFilters;
  reportPromise: Promise<ReportData>;
}) {
  const report = await reportPromise;
  const query = qs(filters);

  return (
    <>
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
    </>
  );
}

function ReportResultsSkeleton() {
  return (
    <>
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
      <section className="section-block">
        <div className="section-head">
          <h2>ตารางรายการคำร้อง</h2>
          <span className="muted">กำลังโหลดข้อมูล</span>
        </div>
        <div className="responsive-table skeleton-table" />
      </section>
    </>
  );
}

export default async function ReportsPage({ searchParams }: { searchParams: SearchParams }) {
  const routeStart = perfStart();
  try {
  await timed("/reports requireAuth", () => requireAuth());
  const params = await timed("/reports searchParams", () => searchParams);
  const filters = readFilters(params);
  const mastersPromise = timed("/reports getMasters", () => getMasters());
  const reportPromise = timed("/reports getReport", () => getReport(filters));

  return (
    <AppShell>
      <PageHeader
        title="รายงานสถิติ"
        description="สรุปจำนวนคำร้องตามช่วงวันที่ ประเภทผู้ขอ หมวดหมู่ และสถานะ"
      />

      <Suspense fallback={<ReportFiltersSkeleton />}>
        <ReportFilters filters={filters} mastersPromise={mastersPromise} />
      </Suspense>

      <Suspense fallback={<ReportResultsSkeleton />}>
        <ReportResults filters={filters} reportPromise={reportPromise} />
      </Suspense>
    </AppShell>
  );
  } finally {
    perfLog("/reports total", routeStart);
  }
}
