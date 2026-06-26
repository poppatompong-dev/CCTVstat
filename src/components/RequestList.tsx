import { Edit3, FileText } from "lucide-react";
import Link from "next/link";
import { formatThaiDate } from "@/lib/dates";
import { optionalText } from "@/lib/format";
import type { RequestRow } from "@/lib/types";

function statusClass(key: string | null) {
  const semantic = key ? key.replace(/_/g, "-") : "other";
  return `status-pill status-${semantic}`;
}

export function RequestList({ rows }: { rows: RequestRow[] }) {
  if (!rows.length) {
    return (
      <div className="empty-state">
        <FileText size={34} aria-hidden="true" />
        <h2>ไม่พบข้อมูลตามเงื่อนไขที่เลือก</h2>
        <p>ลองปรับช่วงวันที่หรือค้นหาด้วยเลขคำร้องอีกครั้ง</p>
      </div>
    );
  }

  return (
    <div className="responsive-table">
      <table>
        <thead>
          <tr>
            <th>เลขคำร้อง</th>
            <th>วันที่</th>
            <th>ประเภทผู้ขอ</th>
            <th>หมวดหมู่</th>
            <th>สถานะ</th>
            <th>สถานที่</th>
            <th>ไฟล์</th>
            <th>ส่งมอบ</th>
            <th>จัดการ</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td data-label="เลขคำร้อง">
                <strong className="mono">{row.request_no}</strong>
              </td>
              <td data-label="วันที่">{formatThaiDate(row.request_date)}</td>
              <td data-label="ประเภทผู้ขอ">{row.requester_type_name}</td>
              <td data-label="หมวดหมู่">{row.category_name}</td>
              <td data-label="สถานะ">
                <span className={statusClass(row.status_semantic_key)}>{row.status_name}</span>
              </td>
              <td data-label="สถานที่">{optionalText(row.location_text)}</td>
              <td data-label="ไฟล์">{row.attachment_count}</td>
              <td data-label="ส่งมอบ">{row.delivery_count}</td>
              <td data-label="จัดการ">
                <Link className="btn small outline" href={`/requests/${row.id}`}>
                  <Edit3 size={15} aria-hidden="true" />
                  แก้ไข
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
