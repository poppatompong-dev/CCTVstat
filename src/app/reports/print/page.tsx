import { requireAuth } from "@/lib/auth";
import { defaultReportRange, formatThaiDate } from "@/lib/dates";
import { getReport } from "@/lib/db";
import { formatNumber, optionalText } from "@/lib/format";
import type { RequestFilters } from "@/lib/types";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function filters(params: Record<string, string | string[] | undefined>): RequestFilters {
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

export default async function PrintReportPage({ searchParams }: { searchParams: SearchParams }) {
  await requireAuth();
  const reportFilters = filters(await searchParams);
  const report = await getReport(reportFilters);
  const organization = process.env.REPORT_ORGANIZATION_NAME || "กลุ่มงานสถิติข้อมูลและสารสนเทศ";

  return (
    <main className="print-page">
      <div className="btn primary print-button">
        กด Ctrl+P หรือ Command+P เพื่อบันทึกเป็น PDF
      </div>
      <header>
        <h1>รายงานสถิติการขอดูภาพจากกล้องวงจรปิด</h1>
        <p>{organization}</p>
        <p>
          ช่วงวันที่ {formatThaiDate(reportFilters.startDate)} ถึง {formatThaiDate(reportFilters.endDate)}
        </p>
      </header>
      <section className="print-total">
        <span>จำนวนคำร้องทั้งหมด</span>
        <strong>{formatNumber(report.total)}</strong>
      </section>
      <section className="print-insights">
        <div>
          <span>ช่วงก่อนหน้า</span>
          <strong>{formatNumber(report.previousTotal)}</strong>
        </div>
        <div>
          <span>อัตราพบภาพ</span>
          <strong>{report.foundRate === null ? "-" : `${report.foundRate.toFixed(1)}%`}</strong>
        </div>
      </section>
      <table>
        <thead>
          <tr>
            <th>เลขคำร้อง</th>
            <th>วันที่</th>
            <th>ประเภทผู้ขอ</th>
            <th>หมวดหมู่</th>
            <th>สถานะ</th>
            <th>สถานที่</th>
          </tr>
        </thead>
        <tbody>
          {report.rows.map((row) => (
            <tr key={row.id}>
              <td>{row.request_no}</td>
              <td>{formatThaiDate(row.request_date)}</td>
              <td>{row.requester_type_name}</td>
              <td>{row.category_name}</td>
              <td>{row.status_name}</td>
              <td>{optionalText(row.location_text)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <section className="signature-block">
        <div>
          <p>ผู้จัดทำรายงาน</p>
          <span />
          <p>วันที่ ........../........../..........</p>
        </div>
        <div>
          <p>ผู้ตรวจสอบ</p>
          <span />
          <p>วันที่ ........../........../..........</p>
        </div>
      </section>
      <script dangerouslySetInnerHTML={{ __html: "window.addEventListener('load',()=>setTimeout(()=>window.print(),250));" }} />
    </main>
  );
}
