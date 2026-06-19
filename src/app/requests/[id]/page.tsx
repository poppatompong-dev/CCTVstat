import { notFound } from "next/navigation";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { requireAuth } from "@/lib/auth";
import {
  deleteRequestAction,
  updateRequestAction,
  uploadAttachmentAction,
} from "@/app/actions";
import { getAttachments, getMasters, getRequest } from "@/lib/db";
import { perfLog, perfStart, timed } from "@/lib/perf";
import { AttachmentGallery } from "@/components/AttachmentGallery";
import { AttachmentUploadForm } from "@/components/AttachmentUploadForm";
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
  const routeStart = perfStart();
  try {
  await timed("/requests/[id] requireAuth", () => requireAuth());
  const [{ id }, feedbackParams] = await Promise.all([
    timed("/requests/[id] params", () => params),
    timed("/requests/[id] searchParams", () => searchParams),
  ]);
  const requestId = Number(id);
  const [request, masters, attachments] = await Promise.all([
    timed("/requests/[id] getRequest", () => getRequest(requestId)),
    timed("/requests/[id] getMasters", () => getMasters()),
    timed("/requests/[id] getAttachments", () => getAttachments(requestId)),
  ]);

  if (!request) notFound();
  const requestNoError =
    typeof feedbackParams.error === "string" && feedbackParams.error.includes("เลขคำร้อง")
      ? feedbackParams.error
      : null;

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
          requestNoError={requestNoError}
          submitLabel="บันทึกการแก้ไข"
        />
      </section>

      <section className="panel">
        <div className="section-head">
          <h2>หลักฐานแนบ</h2>
          <span className="muted">รองรับ PDF, JPG, PNG, DOC, DOCX สูงสุด 4 MB ต่อไฟล์</span>
        </div>
        <AttachmentUploadForm
          action={uploadAttachmentAction.bind(null, request.id, request.request_no)}
          evidenceTypes={masters.evidenceTypes}
        />

        <AttachmentGallery requestId={request.id} attachments={attachments} />
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
  } finally {
    perfLog("/requests/[id] total", routeStart);
  }
}
