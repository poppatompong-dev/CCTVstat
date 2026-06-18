import { Download, FileArchive, FileText, ImageIcon, Trash2 } from "lucide-react";
import { deleteAttachmentAction } from "@/app/actions";
import { formatThaiDateTime } from "@/lib/dates";
import { formatBytes, optionalText } from "@/lib/format";
import type { AttachmentRow } from "@/lib/types";
import { ConfirmSubmitButton } from "@/components/ConfirmSubmitButton";

function extension(name: string) {
  return name.split(".").pop()?.toUpperCase() || "FILE";
}

function isImage(attachment: AttachmentRow) {
  const type = attachment.content_type || "";
  const name = attachment.original_file_name.toLowerCase();
  return type.startsWith("image/") || [".jpg", ".jpeg", ".png"].some((ext) => name.endsWith(ext));
}

function TypeIcon({ attachment }: { attachment: AttachmentRow }) {
  const name = attachment.original_file_name.toLowerCase();
  if (isImage(attachment)) return <ImageIcon size={24} aria-hidden="true" />;
  if (name.endsWith(".pdf")) return <FileText size={24} aria-hidden="true" />;
  return <FileArchive size={24} aria-hidden="true" />;
}

export function AttachmentGallery({
  requestId,
  attachments,
}: {
  requestId: number;
  attachments: AttachmentRow[];
}) {
  if (!attachments.length) {
    return <div className="empty-inline">ยังไม่มีหลักฐานแนบ</div>;
  }

  return (
    <div className="attachment-grid attached-files">
      {attachments.map((attachment) => (
        <article className="attachment-card uploaded" key={attachment.id}>
          <a className="attachment-thumb" href={`/api/attachments/${attachment.id}/download`} target="_blank" rel="noreferrer">
            {isImage(attachment) ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={`/api/attachments/${attachment.id}/download`} alt="" loading="lazy" />
            ) : (
              <span>
                <TypeIcon attachment={attachment} />
                <strong>{extension(attachment.original_file_name)}</strong>
              </span>
            )}
          </a>
          <div className="attachment-card-body">
            <strong title={attachment.original_file_name}>{attachment.original_file_name}</strong>
            <small>{attachment.evidence_type_name}</small>
            <small>
              {formatBytes(attachment.size_bytes)} · {formatThaiDateTime(attachment.uploaded_at)}
            </small>
            <p>{optionalText(attachment.note)}</p>
          </div>
          <div className="row-actions">
            <a className="btn small outline" href={`/api/attachments/${attachment.id}/download`}>
              <Download size={15} aria-hidden="true" />
              ดาวน์โหลด
            </a>
            <form action={deleteAttachmentAction.bind(null, requestId, attachment.id)}>
              <ConfirmSubmitButton
                className="icon-btn danger"
                message="ต้องการลบไฟล์แนบนี้ใช่หรือไม่"
                ariaLabel="ลบไฟล์แนบ"
              >
                <Trash2 size={16} />
              </ConfirmSubmitButton>
            </form>
          </div>
        </article>
      ))}
    </div>
  );
}
