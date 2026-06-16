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

  return Response.json(
    {
      exportedAt: new Date().toISOString(),
      version: 1,
      data: {
        requests,
        attachments,
        requesterTypes,
        categories,
        statuses,
        evidenceTypes,
      },
    },
    {
      headers: {
        "content-disposition": `attachment; filename="cctvstat-backup-${new Date().toISOString().slice(0, 10)}.json"`,
      },
    },
  );
}
