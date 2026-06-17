import { utils, write } from "xlsx";
import { requireAuth } from "@/lib/auth";
import { ensureSchema, query } from "@/lib/db";

export async function GET() {
  await requireAuth();
  await ensureSchema();

  const [
    requests,
    attachments,
    requesterTypes,
    categories,
    statuses,
    evidenceTypes,
  ] = await Promise.all([
    query("SELECT * FROM requests ORDER BY id"),
    query("SELECT * FROM request_attachments ORDER BY id"),
    query("SELECT * FROM requester_types ORDER BY id"),
    query("SELECT * FROM categories ORDER BY id"),
    query("SELECT * FROM statuses ORDER BY id"),
    query("SELECT * FROM evidence_types ORDER BY id"),
  ]);

  const workbook = utils.book_new();
  const meta = [{ exported_at: new Date().toISOString(), version: 1 }];
  utils.book_append_sheet(workbook, utils.json_to_sheet(meta), "metadata");
  utils.book_append_sheet(workbook, utils.json_to_sheet(requests), "requests");
  utils.book_append_sheet(workbook, utils.json_to_sheet(attachments), "attachments");
  utils.book_append_sheet(workbook, utils.json_to_sheet(requesterTypes), "requester_types");
  utils.book_append_sheet(workbook, utils.json_to_sheet(categories), "categories");
  utils.book_append_sheet(workbook, utils.json_to_sheet(statuses), "statuses");
  utils.book_append_sheet(workbook, utils.json_to_sheet(evidenceTypes), "evidence_types");

  const buffer = write(workbook, { type: "buffer", bookType: "xlsx" }) as Buffer;
  const body = new Uint8Array(buffer);
  return new Response(body, {
    headers: {
      "content-type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "content-disposition": `attachment; filename="cctvstat-backup-${new Date().toISOString().slice(0, 10)}.xlsx"`,
    },
  });
}
