"use server";

import { del, getDownloadUrl, put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { clearAuthCookie, requireAuth, setAuthCookie, verifyPassword } from "@/lib/auth";
import { isFixtureBlobUrl } from "@/lib/attachment-fixtures";
import {
  createRequest,
  deleteAttachmentRecord,
  findRequestNumberConflict,
  getAttachment,
  insertAttachment,
  markE2EAttachmentFixtureDeleted,
  softDeleteRequest,
  updateRequest,
  upsertMaster,
} from "@/lib/db";
import { validateRequestNoForDate } from "@/lib/dates";
import type { MasterKind } from "@/lib/types";

const allowedFileExt = new Set(["pdf", "jpg", "jpeg", "png", "doc", "docx"]);
const blockedFileExt = new Set(["exe", "bat", "cmd", "js", "sh", "php", "html"]);
const defaultMaxUploadBytes = 4 * 1024 * 1024;
const defaultMaxUploadFiles = 5;

function maxUploadBytes() {
  const value = Number(process.env.MAX_UPLOAD_BYTES || defaultMaxUploadBytes);
  return Number.isFinite(value) && value > 0 ? value : defaultMaxUploadBytes;
}

function maxUploadFiles() {
  const value = Number(process.env.MAX_UPLOAD_FILES || defaultMaxUploadFiles);
  return Number.isFinite(value) && value > 0 ? value : defaultMaxUploadFiles;
}

function message(path: string, text: string, type: "ok" | "error" = "ok"): never {
  redirect(`${path}?${type}=${encodeURIComponent(text)}`);
}

function masterSettingsPath(kind: MasterKind) {
  switch (kind) {
    case "requester_types":
      return "/settings/requester-types";
    case "categories":
      return "/settings/categories";
    case "statuses":
      return "/settings/statuses";
    case "evidence_types":
      return "/settings/evidence-types";
  }
}

export async function loginAction(formData: FormData) {
  const password = String(formData.get("password") || "");
  const result = verifyPassword(password);
  if (!result.ok) message("/login", result.reason, "error");
  await setAuthCookie();
  redirect("/");
}

export async function logoutAction() {
  await clearAuthCookie();
  redirect("/login");
}

const requestSchema = z.object({
  request_date: z.string().min(1),
  requester_type_id: z.coerce.number().int().positive(),
  category_id: z.coerce.number().int().positive(),
  status_id: z.coerce.number().int().positive(),
});

export async function createRequestAction(formData: FormData) {
  await requireAuth();
  const parsed = requestSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) message("/requests/new", "กรุณากรอกข้อมูลบังคับให้ครบ", "error");
  const created = await createRequest(formData);
  revalidatePath("/");
  revalidatePath("/requests");
  redirect(`/requests/${created.id}?ok=${encodeURIComponent(`บันทึกสำเร็จ เลขคำร้อง ${created.request_no}`)}`);
}

export async function updateRequestAction(id: number, formData: FormData) {
  await requireAuth();
  const parsed = requestSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) message(`/requests/${id}`, "กรุณากรอกข้อมูลบังคับให้ครบ", "error");

  const requestNo = String(formData.get("request_no") || "");
  const requestDate = String(formData.get("request_date") || "");
  const validation = validateRequestNoForDate(requestNo, requestDate);
  if (validation) message(`/requests/${id}`, validation, "error");

  const conflict = await findRequestNumberConflict(id, requestNo);
  if (conflict) {
    const suffix = conflict.is_deleted ? "ในรายการที่ถูกลบแล้ว" : `ในรายการ ID ${conflict.id}`;
    message(`/requests/${id}`, `เลขคำร้อง ${conflict.request_no} ถูกใช้แล้ว${suffix} กรุณาเลือกเลขอื่น`, "error");
  }

  try {
    await updateRequest(id, formData);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "";
    const normalizedRequestNo = requestNo.trim().toUpperCase();
    const text = errorMessage.includes("requests_request_no_key")
      ? `เลขคำร้อง ${normalizedRequestNo} ซ้ำกับรายการอื่นแล้ว กรุณาเลือกเลขอื่น`
      : errorMessage.includes("requests_fiscal_year_sequence_no_key")
      ? `ลำดับของเลขคำร้อง ${normalizedRequestNo} ในปีงบประมาณนี้ซ้ำกับรายการอื่นแล้ว`
      : "บันทึกไม่สำเร็จ กรุณาตรวจสอบข้อมูลอีกครั้ง";
    message(`/requests/${id}`, text, "error");
  }

  revalidatePath("/");
  revalidatePath("/requests");
  revalidatePath(`/requests/${id}`);
  message(`/requests/${id}`, "บันทึกการแก้ไขสำเร็จ");
}

export async function deleteRequestAction(id: number) {
  await requireAuth();
  await softDeleteRequest(id);
  revalidatePath("/");
  revalidatePath("/requests");
  message("/requests", "ลบคำร้องแล้ว");
}

export async function saveMasterAction(kind: MasterKind, formData: FormData) {
  await requireAuth();
  const path = masterSettingsPath(kind);

  try {
    await upsertMaster(kind, formData);
  } catch {
    message(path, "บันทึกไม่สำเร็จ กรุณาตรวจสอบชื่อซ้ำหรือข้อมูลที่กรอก", "error");
  }

  revalidatePath(path);
  message(path, "บันทึกสำเร็จ");
}

function fileExtension(name: string) {
  return name.split(".").pop()?.toLowerCase() ?? "";
}

function safePathSegment(value: string) {
  return value.replace(/[^a-zA-Z0-9ก-๙._-]+/g, "-").slice(0, 90);
}

export async function uploadAttachmentAction(requestId: number, requestNo: string, formData: FormData) {
  await requireAuth();
  const files = formData
    .getAll("files")
    .concat(formData.getAll("file"))
    .filter((value): value is File => value instanceof File && value.size > 0);
  const evidenceTypeId = Number(formData.get("evidence_type_id"));
  const note = String(formData.get("note") || "").trim() || null;

  if (!files.length) {
    message(`/requests/${requestId}`, "กรุณาเลือกไฟล์", "error");
  }
  if (!Number.isInteger(evidenceTypeId) || evidenceTypeId <= 0) {
    message(`/requests/${requestId}`, "กรุณาเลือกประเภทหลักฐาน", "error");
  }
  if (files.length > maxUploadFiles()) {
    message(`/requests/${requestId}`, `อัปโหลดได้สูงสุด ${maxUploadFiles()} ไฟล์ต่อครั้ง`, "error");
  }

  for (const file of files) {
    if (file.size > maxUploadBytes()) {
      message(`/requests/${requestId}`, `ไฟล์ ${file.name} มีขนาดเกิน ${(maxUploadBytes() / 1024 / 1024).toFixed(1)} MB`, "error");
    }

    const ext = fileExtension(file.name);
    if (!allowedFileExt.has(ext) || blockedFileExt.has(ext)) {
      message(`/requests/${requestId}`, `ไม่รองรับประเภทไฟล์ ${file.name}`, "error");
    }
  }

  try {
    for (const file of files) {
      const pathname = `cctv-requests/${safePathSegment(requestNo)}/${Date.now()}-${safePathSegment(file.name)}`;
      const blob = await put(pathname, file, {
        access: "private",
        addRandomSuffix: true,
        contentType: file.type || undefined,
      });

      await insertAttachment({
        requestId,
        evidenceTypeId,
        originalFileName: file.name,
        blobUrl: blob.url,
        downloadUrl: blob.downloadUrl || getDownloadUrl(blob.url),
        blobPathname: blob.pathname,
        contentType: file.type || null,
        sizeBytes: file.size,
        note,
      });
    }
  } catch (error) {
    const text = error instanceof Error && error.message.includes("No blob credentials")
      ? "ยังไม่ได้ตั้งค่า BLOB_READ_WRITE_TOKEN"
      : "อัปโหลดไฟล์ไม่สำเร็จ";
    message(`/requests/${requestId}`, text, "error");
  }

  revalidatePath(`/requests/${requestId}`);
  message(`/requests/${requestId}`, `อัปโหลดหลักฐานสำเร็จ ${files.length} ไฟล์`);
}

export async function deleteAttachmentAction(requestId: number, attachmentId: number) {
  await requireAuth();
  const attachment = await getAttachment(attachmentId);
  if (attachment) {
    const isFixtureAttachment = isFixtureBlobUrl(attachment.blob_url);
    try {
      if (!isFixtureAttachment) {
        await del(attachment.blob_url);
      }
    } catch {
      // If Blob deletion fails, keep the UI flowing and remove metadata.
    }
    await deleteAttachmentRecord(attachmentId);
    if (isFixtureAttachment) {
      await markE2EAttachmentFixtureDeleted();
    }
  }
  revalidatePath(`/requests/${requestId}`);
  message(`/requests/${requestId}`, "ลบไฟล์แนบแล้ว");
}
