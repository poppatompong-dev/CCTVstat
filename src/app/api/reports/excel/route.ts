import { utils, write } from "xlsx";
import { requireAuth } from "@/lib/auth";
import { defaultReportRange, formatThaiDate } from "@/lib/dates";
import { getReport } from "@/lib/db";
import { perfLog, perfStart, timed } from "@/lib/perf";
import type { RequestFilters } from "@/lib/types";

function filtersFromUrl(url: string): RequestFilters {
  const params = new URL(url).searchParams;
  const defaults = defaultReportRange();
  return {
    startDate: params.get("startDate") ?? defaults.startDate,
    endDate: params.get("endDate") ?? defaults.endDate,
    requesterTypeId: params.get("requesterTypeId") ?? undefined,
    categoryId: params.get("categoryId") ?? undefined,
    statusId: params.get("statusId") ?? undefined,
  };
}

export async function GET(request: Request) {
  const routeStart = perfStart();
  try {
  await timed("/api/reports/excel requireAuth", () => requireAuth());
  const filters = filtersFromUrl(request.url);
  const report = await timed("/api/reports/excel query data", () => getReport(filters));
  const buffer = await timed("/api/reports/excel build workbook", async () => {
    const workbook = utils.book_new();

    const rows = report.rows.map((row) => ({
      "เลขคำร้อง": row.request_no,
      "วันที่": formatThaiDate(row.request_date),
      "ประเภทผู้ขอ": row.requester_type_name,
      "หมวดหมู่": row.category_name,
      "สถานะ": row.status_name,
      "สถานที่": row.location_text ?? "",
      "ไฟล์แนบ": row.attachment_count,
      "หมายเหตุ": row.note ?? "",
    }));

    const summary = [
      { มิติ: "จำนวนคำร้องทั้งหมด", ค่า: report.total },
      { มิติ: "จำนวนคำร้องช่วงก่อนหน้า", ค่า: report.previousTotal },
      { มิติ: "เปลี่ยนแปลงเทียบช่วงก่อนหน้า (%)", ค่า: report.changePercent ?? "" },
      { มิติ: "อัตราพบภาพ (%)", ค่า: report.foundRate ?? "" },
      ...report.byCategory.map((row) => ({ มิติ: `หมวดหมู่: ${row.name}`, ค่า: row.count })),
      ...report.byRequesterType.map((row) => ({ มิติ: `ประเภทผู้ขอ: ${row.name}`, ค่า: row.count })),
      ...report.byStatus.map((row) => ({ มิติ: `สถานะ: ${row.name}`, ค่า: row.count })),
    ];

    utils.book_append_sheet(workbook, utils.json_to_sheet(summary), "สรุป");
    utils.book_append_sheet(workbook, utils.json_to_sheet(rows), "รายการคำร้อง");
    utils.book_append_sheet(workbook, utils.json_to_sheet(report.monthlyTrend), "แนวโน้ม 6 เดือน");

    return write(workbook, { type: "buffer", bookType: "xlsx" }) as Buffer;
  });
  const body = new Uint8Array(buffer);
  return new Response(body, {
    headers: {
      "content-type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "content-disposition": `attachment; filename="cctv-report-${filters.startDate}-${filters.endDate}.xlsx"`,
    },
  });
  } finally {
    perfLog("/api/reports/excel total", routeStart);
  }
}
