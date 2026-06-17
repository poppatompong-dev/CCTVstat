import { saveMasterAction } from "@/app/actions";
import type { MasterKind, MasterRow } from "@/lib/types";

export function MasterSettings({
  title,
  description,
  kind,
  rows,
}: {
  title: string;
  description: string;
  kind: MasterKind;
  rows: MasterRow[];
}) {
  return (
    <section className="settings-grid">
      <div className="panel">
        <h2>เพิ่มรายการใหม่</h2>
        <form action={saveMasterAction.bind(null, kind)} className="stack gap-4">
          <label className="field">
            <span>ชื่อ</span>
            <input name="name" required />
          </label>
          <label className="field">
            <span>ลำดับ</span>
            <input name="sort_order" type="number" defaultValue={rows.length + 1} />
          </label>
          <label className="check-row">
            <input name="is_active" type="checkbox" defaultChecked />
            <span>เปิดใช้งาน</span>
          </label>
          <button className="btn primary" type="submit">เพิ่มรายการ</button>
        </form>
      </div>

      <div className="panel">
        <div className="section-head">
          <div>
            <h2>{title}</h2>
            <p className="muted">{description}</p>
          </div>
        </div>
        <div className="master-list">
          {rows.map((row) => (
            <form key={row.id} action={saveMasterAction.bind(null, kind)} className="master-row">
              <input type="hidden" name="id" value={row.id} />
              <label className="field compact">
                <span>ชื่อ</span>
                <input name="name" defaultValue={row.name} required />
              </label>
              <label className="field compact order-field">
                <span>ลำดับ</span>
                <input name="sort_order" type="number" defaultValue={row.sort_order} />
              </label>
              <label className="check-row">
                <input name="is_active" type="checkbox" defaultChecked={row.is_active} />
                <span>เปิด</span>
              </label>
              {row.semantic_key ? (
                <span className="semantic-chip">{row.semantic_key}</span>
              ) : null}
              <button className="btn small outline" type="submit">บันทึก</button>
            </form>
          ))}
        </div>
      </div>
    </section>
  );
}
