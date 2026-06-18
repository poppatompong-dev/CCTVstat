import { notFound } from "next/navigation";
import Link from "next/link";
import { Paperclip, Trash2 } from "lucide-react";
import { requireAuth } from "@/lib/auth";
import { formatThaiDateTime } from "@/lib/dates";
import { formatBytes, optionalText } from "@/lib/format";
import {
  deleteAttachmentAction,
  deleteRequestAction,
  updateRequestAction,
  uploadAttachmentAction,
} from "@/app/actions";
import { getAttachments, getMasters, getRequest } from "@/lib/db";
import { AppShell } from "@/components/AppShell";
import { CopyButton } from "@/components/CopyButton";
import { ConfirmSubmitButton } from "@/components/ConfirmSubmitButton";
import { Feedback } from "@/components/Feedback";
import { PageHeader } from "@/components/PageHeader";
import { RequestForm } from "@/components/RequestForm";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function RequestDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: SearchParams;
}) {
  await requireAuth();
  const [{ id }, feedbackParams] = await Promise.all([params, searchParams]);
  const requestId = Number(id);
  const [request, masters, attachments] = await Promise.all([
    getRequest(requestId),
    getMasters(),
    getAttachments(requestId),
  ]);

  if (!request) notFound();

  return (
    <AppShell>
      <PageHeader
        title={`คำร้อง ${request.request_no}`}
        description="แก้ไขข้อมูลสถิติ แนบหลักฐาน และจัดการคำร้อง"
      />
      <Feedback params={feedbackParams} />

      <section className="success-strip">
        <div>
          <span>เลขคำร้อง</span>
          <strong className="mono">{request.request_no}</strong>
          <p>กรุณาเขียนเลขนี้ที่หัวใบคำร้อง</p>
        </div>
        <div className="success-actions">
          <CopyButton value={request.request_no} />
          <Link className="btn outline" href="/requests/new">เพิ่มคำร้องใหม่</Link>
          <Link className="btn ghost" href="/">กลับหน้าหลัก</Link>
        </div>
      </section>

      <section className="panel">
        <div className="section-head">
          <h2>ข้อมูลคำร้อง</h2>
          <span className="muted">แก้เลขคำร้องได้เมื่อจำเป็นเท่านั้น</span>
        </div>
        <RequestForm
          action={updateRequestAction.bind(null, request.id)}
          masters={masters}
          request={request}
          showRequestNo
          submitLabel="บันทึกการแก้ไข"
        />
      </section>

      <section className="panel">
        <div className="section-head">
          <h2>หลักฐานแนบ</h2>
          <span className="muted">รองรับ PDF, JPG, PNG, DOC, DOCX สูงสุด 4 MB</span>
        </div>
        <form
          action={uploadAttachmentAction.bind(null, request.id, request.request_no)}
          className="form-grid"
        >
          <label className="field">
            <span>ประเภทหลักฐาน</span>
            <select name="evidence_type_id" required>
              {masters.evidenceTypes.filter((row) => row.is_active).map((row) => (
                <option key={row.id} value={row.id}>{row.name}</option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>เลือกไฟล์</span>
            <input name="file" type="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" required />
          </label>
          <label className="field span-2">
            <span>หมายเหตุไฟล์</span>
            <input name="note" placeholder="ไม่บังคับ" />
          </label>
          <div className="form-actions span-2">
            <button className="btn primary" type="submit">
              <Paperclip size={18} />
              อัปโหลดไฟล์
            </button>
          </div>
        </form>

        <div className="attachment-list">
          {attachments.length ? (
            attachments.map((attachment) => (
              <div className="attachment-row" key={attachment.id}>
                <div>
                  <strong>{attachment.evidence_type_name}</strong>
                  <p>{attachment.original_file_name}</p>
                  <small>
                    {formatBytes(attachment.size_bytes)} · {formatThaiDateTime(attachment.uploaded_at)} · {optionalText(attachment.note)}
                  </small>
                </div>
                <div className="row-actions">
                  <a className="btn small outline" href={`/api/attachments/${attachment.id}/download`}>
                    ดาวน์โหลด
                  </a>
                  <form action={deleteAttachmentAction.bind(null, request.id, attachment.id)}>
                    <ConfirmSubmitButton
                      className="icon-btn danger"
                      message="ต้องการลบไฟล์แนบนี้ใช่หรือไม่"
                      ariaLabel="ลบไฟล์แนบ"
                    >
                      <Trash2 size={16} />
                    </ConfirmSubmitButton>
                  </form>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-inline">ยังไม่มีหลักฐานแนบ</div>
          )}
        </div>
      </section>

      <section className="danger-zone">
        <div>
          <h2>ลบคำร้อง</h2>
          <p>ระบบจะซ่อนรายการนี้จากการค้นหาและรายงาน แต่ไม่ reuse เลขคำร้องเดิม</p>
        </div>
        <form action={deleteRequestAction.bind(null, request.id)}>
          <ConfirmSubmitButton
            className="btn danger"
            message="ต้องการลบคำร้องนี้ใช่หรือไม่ ระบบจะซ่อนจากรายงานปกติและไม่นำเลขกลับมาใช้ซ้ำ"
          >
            <Trash2 size={18} />
            ลบคำร้อง
          </ConfirmSubmitButton>
        </form>
      </section>
    </AppShell>
  );
}
