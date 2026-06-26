import { PackageCheck, Send, Trash2 } from "lucide-react";
import { addDeliveryAction, deleteDeliveryAction } from "@/app/actions";
import { formatThaiDate, todayInput } from "@/lib/dates";
import { optionalText } from "@/lib/format";
import { DELIVERY_METHODS } from "@/lib/delivery";
import type { DeliveryRow, MasterRow } from "@/lib/types";
import { ConfirmSubmitButton } from "@/components/ConfirmSubmitButton";
import { SubmitButton } from "@/components/SubmitButton";

export function DeliveryManager({
  requestId,
  deliveries,
  deliveryItemTypes,
}: {
  requestId: number;
  deliveries: DeliveryRow[];
  deliveryItemTypes: MasterRow[];
}) {
  const activeTypes = deliveryItemTypes.filter((row) => row.is_active);

  return (
    <div className="stack gap-4">
      {activeTypes.length ? (
        <form action={addDeliveryAction.bind(null, requestId)} className="form-grid">
          <label className="field">
            <span>ประเภทข้อมูลที่ส่งมอบ</span>
            <select name="delivery_item_type_id" required>
              {activeTypes.map((row) => (
                <option key={row.id} value={row.id}>{row.name}</option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>ช่องทางส่งมอบ</span>
            <select name="delivery_method" required defaultValue={DELIVERY_METHODS[0]}>
              {DELIVERY_METHODS.map((method) => (
                <option key={method} value={method}>{method}</option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>วันที่ส่งมอบ</span>
            <input name="delivered_at" type="date" defaultValue={todayInput()} />
          </label>
          <label className="field">
            <span>ผู้รับ</span>
            <input name="recipient_name" placeholder="ไม่บังคับ" />
          </label>
          <label className="field span-2">
            <span>หมายเหตุ</span>
            <input name="note" placeholder="ไม่บังคับ เช่น จำนวนไฟล์ ช่วงเวลาของภาพ" />
          </label>
          <div className="form-actions span-2">
            <SubmitButton
              pendingLabel="กำลังบันทึก..."
              modalTitle="กำลังบันทึกการส่งมอบ"
              modalDescription="ระบบกำลังบันทึกรายการส่งมอบ กรุณารอสักครู่"
            >
              <Send size={18} />
              บันทึกการส่งมอบ
            </SubmitButton>
          </div>
        </form>
      ) : (
        <div className="empty-inline">
          ยังไม่มีประเภทข้อมูลที่ส่งมอบที่เปิดใช้งาน เพิ่มได้ที่เมนู &ldquo;ข้อมูลส่งมอบ&rdquo;
        </div>
      )}

      {deliveries.length ? (
        <div className="responsive-table">
          <table>
            <thead>
              <tr>
                <th>วันที่ส่งมอบ</th>
                <th>ประเภทข้อมูล</th>
                <th>ช่องทาง</th>
                <th>ผู้รับ</th>
                <th>หมายเหตุ</th>
                <th>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {deliveries.map((delivery) => (
                <tr key={delivery.id}>
                  <td data-label="วันที่ส่งมอบ">{formatThaiDate(delivery.delivered_at)}</td>
                  <td data-label="ประเภทข้อมูล">{delivery.delivery_item_type_name}</td>
                  <td data-label="ช่องทาง">{delivery.delivery_method}</td>
                  <td data-label="ผู้รับ">{optionalText(delivery.recipient_name)}</td>
                  <td data-label="หมายเหตุ">{optionalText(delivery.note)}</td>
                  <td data-label="จัดการ">
                    <form action={deleteDeliveryAction.bind(null, requestId, delivery.id)}>
                      <ConfirmSubmitButton
                        className="icon-btn danger"
                        message="ต้องการลบรายการส่งมอบนี้ใช่หรือไม่"
                        ariaLabel="ลบรายการส่งมอบ"
                      >
                        <Trash2 size={16} />
                      </ConfirmSubmitButton>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-inline">
          <PackageCheck size={18} aria-hidden="true" /> ยังไม่มีการบันทึกการส่งมอบข้อมูล
        </div>
      )}
    </div>
  );
}
