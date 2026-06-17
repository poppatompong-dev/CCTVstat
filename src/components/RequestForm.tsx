import type { MasterRow, RequestRow } from "@/lib/types";
import { RequestNumberPreview } from "@/components/RequestNumberPreview";

export function RequestForm({
  action,
  masters,
  request,
  submitLabel,
  showRequestNo = false,
}: {
  action: (formData: FormData) => void | Promise<void>;
  masters: {
    requesterTypes: MasterRow[];
    categories: MasterRow[];
    statuses: MasterRow[];
  };
  request?: RequestRow;
  submitLabel: string;
  showRequestNo?: boolean;
}) {
  const requesterTypes = masters.requesterTypes.filter((row) => row.is_active || row.id === request?.requester_type_id);
  const categories = masters.categories.filter((row) => row.is_active || row.id === request?.category_id);
  const statuses = masters.statuses.filter((row) => row.is_active || row.id === request?.status_id);

  return (
    <form action={action} className="form-grid">
      {!showRequestNo && request?.request_date ? (
        <div className="span-2">
          <RequestNumberPreview initialDate={request.request_date} />
        </div>
      ) : null}

      {showRequestNo ? (
        <label className="field span-2 warning-field">
          <span>เลขคำร้อง</span>
          <input name="request_no" defaultValue={request?.request_no} required pattern="C\d{2}-\d{4}" />
          <small>แก้ไขเฉพาะกรณีแก้ข้อมูลผิดหรือนำเข้าข้อมูลย้อนหลัง</small>
        </label>
      ) : null}

      <label className="field">
        <span>วันที่รับคำร้อง</span>
        <input name="request_date" type="date" defaultValue={request?.request_date} required />
      </label>

      <label className="field">
        <span>ประเภทผู้ขอ</span>
        <select name="requester_type_id" defaultValue={request?.requester_type_id} required>
          {requesterTypes.map((row) => (
            <option key={row.id} value={row.id}>
              {row.name}
            </option>
          ))}
        </select>
      </label>

      <label className="field">
        <span>หมวดหมู่</span>
        <select name="category_id" defaultValue={request?.category_id} required>
          <option value="">เลือกหมวดหมู่</option>
          {categories.map((row) => (
            <option key={row.id} value={row.id}>
              {row.name}
            </option>
          ))}
        </select>
      </label>

      <label className="field">
        <span>สถานะ</span>
        <select name="status_id" defaultValue={request?.status_id} required>
          {statuses.map((row) => (
            <option key={row.id} value={row.id}>
              {row.name}
            </option>
          ))}
        </select>
      </label>

      <label className="field span-2">
        <span>สถานที่เกิดเหตุ</span>
        <input name="location_text" defaultValue={request?.location_text ?? ""} placeholder="ไม่บังคับ" />
      </label>

      <label className="field span-2">
        <span>หมายเหตุ</span>
        <textarea name="note" defaultValue={request?.note ?? ""} rows={4} placeholder="ไม่บังคับ" />
      </label>

      <div className="form-actions span-2">
        <button className="btn primary" type="submit">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
