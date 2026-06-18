"use client";

import { FileArchive, FileText, ImageIcon, Paperclip, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { MasterRow } from "@/lib/types";
import { SubmitButton } from "@/components/SubmitButton";

type PreviewFile = {
  key: string;
  name: string;
  size: number;
  type: string;
  url: string | null;
};

function formatBytes(bytes: number) {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / 1024 ** index).toFixed(index ? 1 : 0)} ${units[index]}`;
}

function FileKindIcon({ type, name }: { type: string; name: string }) {
  const lower = name.toLowerCase();
  if (type.startsWith("image/")) return <ImageIcon size={22} aria-hidden="true" />;
  if (lower.endsWith(".pdf")) return <FileText size={22} aria-hidden="true" />;
  return <FileArchive size={22} aria-hidden="true" />;
}

export function AttachmentUploadForm({
  action,
  evidenceTypes,
  maxFiles = 5,
}: {
  action: (formData: FormData) => void | Promise<void>;
  evidenceTypes: MasterRow[];
  maxFiles?: number;
}) {
  const [files, setFiles] = useState<PreviewFile[]>([]);
  const totalSize = useMemo(() => files.reduce((sum, file) => sum + file.size, 0), [files]);

  useEffect(() => {
    return () => {
      files.forEach((file) => {
        if (file.url) URL.revokeObjectURL(file.url);
      });
    };
  }, [files]);

  return (
    <form action={action} className="form-grid">
      <label className="field">
        <span>ประเภทหลักฐาน</span>
        <select name="evidence_type_id" required>
          {evidenceTypes.filter((row) => row.is_active).map((row) => (
            <option key={row.id} value={row.id}>{row.name}</option>
          ))}
        </select>
      </label>
      <label className="field">
        <span>เลือกไฟล์</span>
        <input
          name="files"
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
          multiple
          required
          onChange={(event) => {
            files.forEach((file) => {
              if (file.url) URL.revokeObjectURL(file.url);
            });
            const selected = Array.from(event.currentTarget.files ?? []).slice(0, maxFiles);
            setFiles(selected.map((file) => ({
              key: `${file.name}-${file.size}-${file.lastModified}`,
              name: file.name,
              size: file.size,
              type: file.type,
              url: file.type.startsWith("image/") ? URL.createObjectURL(file) : null,
            })));
          }}
        />
        <small>เลือกได้สูงสุด {maxFiles} ไฟล์ต่อครั้ง</small>
      </label>

      {files.length ? (
        <div className="span-2 upload-preview" aria-live="polite">
          <div className="upload-preview-head">
            <strong>{files.length} ไฟล์ที่เลือก</strong>
            <span>{formatBytes(totalSize)}</span>
          </div>
          <div className="attachment-grid">
            {files.map((file) => (
              <div className="attachment-card" key={file.key}>
                <div className="attachment-thumb">
                  {file.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={file.url} alt="" />
                  ) : (
                    <FileKindIcon type={file.type} name={file.name} />
                  )}
                </div>
                <div>
                  <strong title={file.name}>{file.name}</strong>
                  <small>{formatBytes(file.size)}</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <label className="field span-2">
        <span>หมายเหตุไฟล์</span>
        <input name="note" placeholder="ไม่บังคับ และจะใช้กับทุกไฟล์ในชุดนี้" />
      </label>
      <div className="form-actions span-2">
        <SubmitButton
          pendingLabel="กำลังอัปโหลด..."
          modalTitle="กำลังอัปโหลดหลักฐาน"
          modalDescription="ระบบกำลังส่งไฟล์ไปยัง Vercel Blob และบันทึกข้อมูล กรุณาอย่าปิดหน้านี้"
        >
          <Paperclip size={18} />
          อัปโหลดไฟล์
        </SubmitButton>
        {files.length ? (
          <button
            className="btn ghost"
            type="reset"
            onClick={() => {
              files.forEach((file) => {
                if (file.url) URL.revokeObjectURL(file.url);
              });
              setFiles([]);
            }}
          >
            <X size={16} />
            ล้างไฟล์
          </button>
        ) : null}
      </div>
    </form>
  );
}
