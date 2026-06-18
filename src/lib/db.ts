import "server-only";

import { neon, type NeonQueryFunction } from "@neondatabase/serverless";
import {
  fiscalYearFromDate,
  formatRequestNo,
  parseRequestNo,
} from "@/lib/dates";
import type {
  AttachmentRow,
  DashboardStats,
  MasterKind,
  MasterRow,
  ReportData,
  RequestFilters,
  RequestRow,
  SmartDefaults,
} from "@/lib/types";

let sqlClient: NeonQueryFunction<false, false> | null = null;
let schemaReady = false;
let schemaReadyPromise: Promise<void> | null = null;

function getSql() {
  if (!sqlClient) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("Missing DATABASE_URL");
    sqlClient = neon(url);
  }
  return sqlClient;
}

export async function query<T>(text: string, params: unknown[] = []) {
  const sql = getSql();
  return (await sql.query(text, params)) as T[];
}

const masterTables: MasterKind[] = [
  "requester_types",
  "categories",
  "statuses",
  "evidence_types",
];

function assertMasterKind(kind: string): asserts kind is MasterKind {
  if (!masterTables.includes(kind as MasterKind)) {
    throw new Error("Invalid master table");
  }
}

async function createMasterTable(name: MasterKind) {
  await query(`
    CREATE TABLE IF NOT EXISTS ${name} (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      sort_order INTEGER NOT NULL DEFAULT 0,
      is_active BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

type SeedRow = {
  name: string;
  sortOrder: number;
  semanticKey?: string;
};

async function seedMaster(kind: MasterKind, rows: SeedRow[]) {
  for (const row of rows) {
    await query(
      `INSERT INTO ${kind} (name, sort_order)
       VALUES ($1, $2)
       ON CONFLICT (name)
       DO UPDATE SET sort_order = EXCLUDED.sort_order,
         updated_at = NOW()`,
      [row.name, row.sortOrder],
    );
  }
}

async function seedStatuses(rows: SeedRow[]) {
  for (const row of rows) {
    await query(
      `INSERT INTO statuses (name, sort_order, semantic_key)
       VALUES ($1, $2, $3)
       ON CONFLICT (name)
       DO UPDATE SET sort_order = EXCLUDED.sort_order,
         semantic_key = EXCLUDED.semantic_key,
         updated_at = NOW()`,
      [row.name, row.sortOrder, row.semanticKey ?? null],
    );
  }
}

async function deactivateDeprecated(kind: MasterKind, names: string[]) {
  if (!names.length) return;
  await query(
    `UPDATE ${kind}
     SET is_active = FALSE, updated_at = NOW()
     WHERE name = ANY($1)`,
    [names],
  );
}

async function initializeSchema() {

  for (const table of masterTables) {
    await createMasterTable(table);
  }

  await query(`
    CREATE TABLE IF NOT EXISTS requests (
      id SERIAL PRIMARY KEY,
      request_no TEXT NOT NULL UNIQUE,
      request_date DATE NOT NULL,
      fiscal_year INTEGER NOT NULL,
      sequence_no INTEGER NOT NULL,
      requester_type_id INTEGER NOT NULL REFERENCES requester_types(id),
      category_id INTEGER NOT NULL REFERENCES categories(id),
      status_id INTEGER NOT NULL REFERENCES statuses(id),
      location_text TEXT,
      note TEXT,
      deleted_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE (fiscal_year, sequence_no)
    )
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS request_attachments (
      id SERIAL PRIMARY KEY,
      request_id INTEGER NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
      evidence_type_id INTEGER NOT NULL REFERENCES evidence_types(id),
      original_file_name TEXT NOT NULL,
      blob_url TEXT NOT NULL,
      download_url TEXT,
      blob_pathname TEXT NOT NULL,
      content_type TEXT,
      size_bytes INTEGER NOT NULL DEFAULT 0,
      note TEXT,
      uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  await query("ALTER TABLE statuses ADD COLUMN IF NOT EXISTS semantic_key TEXT");
  await query("CREATE UNIQUE INDEX IF NOT EXISTS statuses_semantic_key_unique ON statuses (semantic_key) WHERE semantic_key IS NOT NULL");

  await seedMaster("requester_types", [
    { name: "ประชาชน", sortOrder: 1 },
    { name: "เจ้าหน้าที่เทศบาล", sortOrder: 2 },
    { name: "ตำรวจ", sortOrder: 3 },
    { name: "หน่วยงานรัฐ", sortOrder: 4 },
    { name: "อื่น ๆ", sortOrder: 5 },
  ]);
  await seedMaster("categories", [
    { name: "อุบัติเหตุจราจร", sortOrder: 1 },
    { name: "ทรัพย์สินสูญหาย", sortOrder: 2 },
    { name: "เหตุเกี่ยวกับคดี/อาชญากรรม", sortOrder: 3 },
    { name: "ตรวจสอบการจราจร", sortOrder: 4 },
    { name: "เหตุความสงบเรียบร้อย", sortOrder: 5 },
    { name: "หน่วยงานรัฐ/ตำรวจขอข้อมูล", sortOrder: 6 },
    { name: "งานภายในเทศบาล", sortOrder: 7 },
    { name: "อื่น ๆ", sortOrder: 8 },
  ]);
  await seedStatuses([
    { name: "รับคำร้องแล้ว", sortOrder: 1, semanticKey: "received" },
    { name: "กำลังตรวจสอบภาพ", sortOrder: 2, semanticKey: "checking" },
    { name: "พบภาพ", sortOrder: 3, semanticKey: "found" },
    { name: "ไม่พบภาพ", sortOrder: 4, semanticKey: "not_found" },
    { name: "แจ้งผลแล้ว", sortOrder: 5, semanticKey: "notified" },
    { name: "อื่น ๆ", sortOrder: 6, semanticKey: "other" },
  ]);
  await seedMaster("evidence_types", [
    { name: "ใบคำร้อง", sortOrder: 1 },
    { name: "หนังสือราชการ", sortOrder: 2 },
    { name: "ใบแจ้งความ", sortOrder: 3 },
    { name: "เอกสารส่งมอบ", sortOrder: 4 },
    { name: "รูปภาพประกอบ", sortOrder: 5 },
    { name: "อื่น ๆ", sortOrder: 6 },
  ]);
  await deactivateDeprecated("categories", ["คดีอาชญากรรม", "เหตุเดือดร้อนรำคาญ"]);
  await deactivateDeprecated("statuses", ["ยกเลิก"]);

  schemaReady = true;
}

export async function ensureSchema() {
  if (schemaReady) return;

  schemaReadyPromise ??= initializeSchema().catch((error) => {
    schemaReadyPromise = null;
    throw error;
  });

  await schemaReadyPromise;
}

export async function getMasters() {
  await ensureSchema();
  const [requesterTypes, categories, statuses, evidenceTypes] =
    await Promise.all([
      getMasterRows("requester_types"),
      getMasterRows("categories"),
      getMasterRows("statuses"),
      getMasterRows("evidence_types"),
    ]);
  return { requesterTypes, categories, statuses, evidenceTypes };
}

export async function getMasterRows(kind: MasterKind, activeOnly = false) {
  await ensureSchema();
  assertMasterKind(kind);
  return query<MasterRow>(
    `SELECT id, name, sort_order, is_active,
       ${kind === "statuses" ? "semantic_key" : "NULL AS semantic_key"}
     FROM ${kind}
     ${activeOnly ? "WHERE is_active = TRUE" : ""}
     ORDER BY sort_order, id`,
  );
}

export async function upsertMaster(kind: MasterKind, form: FormData) {
  await ensureSchema();
  assertMasterKind(kind);
  const id = Number(form.get("id") || 0);
  const name = String(form.get("name") || "").trim();
  const sortOrder = Number(form.get("sort_order") || 0);
  const isActive = form.get("is_active") === "on";
  if (!name) throw new Error("กรุณาระบุชื่อ");

  if (id) {
    await query(
      `UPDATE ${kind}
       SET name = $1, sort_order = $2, is_active = $3, updated_at = NOW()
       WHERE id = $4`,
      [name, sortOrder, isActive, id],
    );
  } else {
    await query(
      `INSERT INTO ${kind} (name, sort_order, is_active)
       VALUES ($1, $2, $3)
       ON CONFLICT (name)
       DO UPDATE SET sort_order = EXCLUDED.sort_order,
         is_active = EXCLUDED.is_active,
         updated_at = NOW()`,
      [name, sortOrder, isActive],
    );
  }
}

function filtersToWhere(filters: RequestFilters, startIndex = 1) {
  const clauses = ["r.deleted_at IS NULL"];
  const params: unknown[] = [];
  let index = startIndex;

  if (filters.q) {
    clauses.push(`(r.request_no ILIKE $${index} OR r.location_text ILIKE $${index})`);
    params.push(`%${filters.q}%`);
    index += 1;
  }
  if (filters.startDate) {
    clauses.push(`r.request_date >= $${index}`);
    params.push(filters.startDate);
    index += 1;
  }
  if (filters.endDate) {
    clauses.push(`r.request_date <= $${index}`);
    params.push(filters.endDate);
    index += 1;
  }
  if (filters.requesterTypeId) {
    clauses.push(`r.requester_type_id = $${index}`);
    params.push(Number(filters.requesterTypeId));
    index += 1;
  }
  if (filters.categoryId) {
    clauses.push(`r.category_id = $${index}`);
    params.push(Number(filters.categoryId));
    index += 1;
  }
  if (filters.statusId) {
    clauses.push(`r.status_id = $${index}`);
    params.push(Number(filters.statusId));
    index += 1;
  }
  if (filters.statusSemanticKey) {
    clauses.push(`s.semantic_key = $${index}`);
    params.push(filters.statusSemanticKey);
    index += 1;
  }
  if (filters.view === "this-month") {
    clauses.push("r.request_date >= DATE_TRUNC('month', CURRENT_DATE)");
  }
  if (filters.view === "follow-up") {
    clauses.push("COALESCE(s.semantic_key, '') <> 'notified'");
    clauses.push("r.request_date <= CURRENT_DATE - ($" + index + "::int * INTERVAL '1 day')");
    params.push(followUpDays());
    index += 1;
  }
  if (filters.view === "found") {
    clauses.push("s.semantic_key = 'found'");
  }

  return { where: clauses.join(" AND "), params, nextIndex: index };
}

const requestSelect = `
  SELECT r.id, r.request_no, r.request_date::text, r.fiscal_year, r.sequence_no,
    r.requester_type_id, r.category_id, r.status_id, r.location_text, r.note,
    r.created_at::text, r.updated_at::text,
    rt.name AS requester_type_name,
    c.name AS category_name,
    s.name AS status_name,
    s.semantic_key AS status_semantic_key,
    COUNT(a.id)::int AS attachment_count
  FROM requests r
  JOIN requester_types rt ON rt.id = r.requester_type_id
  JOIN categories c ON c.id = r.category_id
  JOIN statuses s ON s.id = r.status_id
  LEFT JOIN request_attachments a ON a.request_id = r.id
`;

export async function listRequests(filters: RequestFilters = {}, limit = 80) {
  await ensureSchema();
  const { where, params, nextIndex } = filtersToWhere(filters);
  return query<RequestRow>(
    `${requestSelect}
     WHERE ${where}
     GROUP BY r.id, rt.name, c.name, s.name, s.semantic_key
     ORDER BY r.request_date DESC, r.id DESC
     LIMIT $${nextIndex}`,
    [...params, limit],
  );
}

export async function getRequest(id: number) {
  await ensureSchema();
  const rows = await query<RequestRow>(
    `${requestSelect}
     WHERE r.deleted_at IS NULL AND r.id = $1
     GROUP BY r.id, rt.name, c.name, s.name, s.semantic_key
     LIMIT 1`,
    [id],
  );
  return rows[0] ?? null;
}

export async function getAttachments(requestId: number) {
  await ensureSchema();
  return query<AttachmentRow>(
    `SELECT a.id, a.request_id, a.evidence_type_id, e.name AS evidence_type_name,
      a.original_file_name, a.blob_url, a.download_url, a.blob_pathname,
      a.content_type, a.size_bytes, a.note, a.uploaded_at::text
     FROM request_attachments a
     JOIN evidence_types e ON e.id = a.evidence_type_id
     WHERE a.request_id = $1
     ORDER BY a.uploaded_at DESC`,
    [requestId],
  );
}

export async function getAttachment(id: number) {
  await ensureSchema();
  const rows = await query<AttachmentRow>(
    `SELECT a.id, a.request_id, a.evidence_type_id, e.name AS evidence_type_name,
      a.original_file_name, a.blob_url, a.download_url, a.blob_pathname,
      a.content_type, a.size_bytes, a.note, a.uploaded_at::text
     FROM request_attachments a
     JOIN evidence_types e ON e.id = a.evidence_type_id
     WHERE a.id = $1
     LIMIT 1`,
    [id],
  );
  return rows[0] ?? null;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  await ensureSchema();
  const [{ total }] = await query<{ total: number }>(
    "SELECT COUNT(*)::int AS total FROM requests WHERE deleted_at IS NULL",
  );
  const [{ this_month }] = await query<{ this_month: number }>(
    `SELECT COUNT(*)::int AS this_month
     FROM requests
     WHERE deleted_at IS NULL
       AND request_date >= DATE_TRUNC('month', CURRENT_DATE)`,
  );
  const [{ with_attachments }] = await query<{ with_attachments: number }>(
    `SELECT COUNT(DISTINCT r.id)::int AS with_attachments
     FROM requests r
     JOIN request_attachments a ON a.request_id = r.id
     WHERE r.deleted_at IS NULL`,
  );
  const latest = await query<{ request_no: string }>(
    `SELECT request_no
     FROM requests
     WHERE deleted_at IS NULL
     ORDER BY created_at DESC
     LIMIT 1`,
  );
  const days = followUpDays();
  const [{ follow_up_total }] = await query<{ follow_up_total: number }>(
    `SELECT COUNT(*)::int AS follow_up_total
     FROM requests r
     JOIN statuses s ON s.id = r.status_id
     WHERE r.deleted_at IS NULL
       AND COALESCE(s.semantic_key, '') <> 'notified'
       AND r.request_date <= CURRENT_DATE - ($1::int * INTERVAL '1 day')`,
    [days],
  );
  const [{ overdue_checking }] = await query<{ overdue_checking: number }>(
    `SELECT COUNT(*)::int AS overdue_checking
     FROM requests r
     JOIN statuses s ON s.id = r.status_id
     WHERE r.deleted_at IS NULL
       AND s.semantic_key = 'checking'
       AND r.request_date <= CURRENT_DATE - ($1::int * INTERVAL '1 day')`,
    [days],
  );
  const [{ unresolved_total }] = await query<{ unresolved_total: number }>(
    `SELECT COUNT(*)::int AS unresolved_total
     FROM requests r
     JOIN statuses s ON s.id = r.status_id
     WHERE r.deleted_at IS NULL
       AND COALESCE(s.semantic_key, '') <> 'notified'`,
  );
  const followUpRows = await listRequests({ view: "follow-up" }, 5);
  return {
    total,
    thisMonth: this_month,
    withAttachments: with_attachments,
    latestRequestNo: latest[0]?.request_no ?? null,
    followUpTotal: follow_up_total,
    overdueChecking: overdue_checking,
    unresolvedTotal: unresolved_total,
    followUpDays: days,
    followUpRows,
  };
}

function followUpDays() {
  const value = Number(process.env.FOLLOW_UP_DAYS || 7);
  return Number.isFinite(value) && value > 0 ? value : 7;
}

export async function nextRequestNumber(requestDate: string) {
  await ensureSchema();
  const fiscalYear = fiscalYearFromDate(requestDate);
  const [{ next_sequence }] = await query<{ next_sequence: number }>(
    `SELECT COALESCE(MAX(sequence_no), 0)::int + 1 AS next_sequence
     FROM requests
     WHERE fiscal_year = $1`,
    [fiscalYear],
  );
  return {
    fiscalYear,
    sequenceNo: next_sequence,
    requestNo: formatRequestNo(requestDate, next_sequence),
  };
}

export async function getSmartDefaults(): Promise<SmartDefaults> {
  await ensureSchema();
  const requesterRows = await query<{ id: number }>(
    `SELECT r.requester_type_id AS id
     FROM requests r
     JOIN requester_types rt ON rt.id = r.requester_type_id
     WHERE r.deleted_at IS NULL
       AND r.request_date >= CURRENT_DATE - INTERVAL '90 days'
       AND rt.is_active = TRUE
     GROUP BY r.requester_type_id
     ORDER BY COUNT(*) DESC, MAX(r.created_at) DESC
     LIMIT 1`,
  );
  const statusRows = await query<{ id: number }>(
    `SELECT r.status_id AS id
     FROM requests r
     JOIN statuses s ON s.id = r.status_id
     WHERE r.deleted_at IS NULL
       AND r.request_date >= CURRENT_DATE - INTERVAL '90 days'
       AND s.is_active = TRUE
       AND COALESCE(s.semantic_key, '') <> 'notified'
     GROUP BY r.status_id
     ORDER BY COUNT(*) DESC, MAX(r.created_at) DESC
     LIMIT 1`,
  );

  if (requesterRows[0]?.id && statusRows[0]?.id) {
    return {
      requesterTypeId: requesterRows[0].id,
      statusId: statusRows[0].id,
    };
  }

  const fallback = await query<{ requester_type_id: number | null; status_id: number | null }>(
    `SELECT
       (SELECT id FROM requester_types WHERE name = 'ประชาชน' ORDER BY sort_order LIMIT 1) AS requester_type_id,
       (SELECT id FROM statuses WHERE semantic_key = 'received' ORDER BY sort_order LIMIT 1) AS status_id`,
  );

  return {
    requesterTypeId: requesterRows[0]?.id ?? fallback[0]?.requester_type_id ?? null,
    statusId: statusRows[0]?.id ?? fallback[0]?.status_id ?? null,
  };
}

export async function getLocationSuggestions(limit = 40) {
  await ensureSchema();
  const rows = await query<{ location_text: string }>(
    `SELECT location_text
     FROM requests
     WHERE deleted_at IS NULL
       AND location_text IS NOT NULL
       AND LENGTH(TRIM(location_text)) >= 2
     GROUP BY location_text
     ORDER BY COUNT(*) DESC, MAX(created_at) DESC
     LIMIT $1`,
    [limit],
  );
  return rows.map((row) => row.location_text);
}

export async function findDuplicateHints(input: {
  requestDate: string;
  categoryId: number;
  locationText: string;
}) {
  await ensureSchema();
  const location = input.locationText.trim();
  if (!input.requestDate || !input.categoryId || location.length < 2) return [];
  return query<RequestRow>(
    `${requestSelect}
     WHERE r.deleted_at IS NULL
       AND r.request_date = $1
       AND r.category_id = $2
       AND r.location_text ILIKE $3
     GROUP BY r.id, rt.name, c.name, s.name, s.semantic_key
     ORDER BY r.created_at DESC
     LIMIT 3`,
    [input.requestDate, input.categoryId, `%${location}%`],
  );
}

export async function createRequest(form: FormData) {
  await ensureSchema();
  const requestDate = String(form.get("request_date") || "");
  const base = {
    requesterTypeId: Number(form.get("requester_type_id")),
    categoryId: Number(form.get("category_id")),
    statusId: Number(form.get("status_id")),
    locationText: String(form.get("location_text") || "").trim() || null,
    note: String(form.get("note") || "").trim() || null,
  };

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const generated = await nextRequestNumber(requestDate);
    try {
      const rows = await query<{ id: number; request_no: string }>(
        `INSERT INTO requests (
          request_no, request_date, fiscal_year, sequence_no, requester_type_id,
          category_id, status_id, location_text, note
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING id, request_no`,
        [
          generated.requestNo,
          requestDate,
          generated.fiscalYear,
          generated.sequenceNo,
          base.requesterTypeId,
          base.categoryId,
          base.statusId,
          base.locationText,
          base.note,
        ],
      );
      return rows[0];
    } catch (error) {
      if (attempt === 2) throw error;
    }
  }

  throw new Error("ไม่สามารถออกเลขคำร้องได้");
}

export async function updateRequest(id: number, form: FormData) {
  await ensureSchema();
  const requestDate = String(form.get("request_date") || "");
  const requestNoInput = String(form.get("request_no") || "").trim().toUpperCase();
  const parsed = parseRequestNo(requestNoInput);
  if (!parsed) throw new Error("รูปแบบเลขคำร้องต้องเป็น CYY-NNNN เช่น C69-0001");

  const fiscalYear = fiscalYearFromDate(requestDate);
  await query(
    `UPDATE requests
     SET request_no = $1,
       request_date = $2,
       fiscal_year = $3,
       sequence_no = $4,
       requester_type_id = $5,
       category_id = $6,
       status_id = $7,
       location_text = $8,
       note = $9,
       updated_at = NOW()
     WHERE id = $10 AND deleted_at IS NULL`,
    [
      parsed.normalized,
      requestDate,
      fiscalYear,
      parsed.sequence,
      Number(form.get("requester_type_id")),
      Number(form.get("category_id")),
      Number(form.get("status_id")),
      String(form.get("location_text") || "").trim() || null,
      String(form.get("note") || "").trim() || null,
      id,
    ],
  );
}

export async function softDeleteRequest(id: number) {
  await ensureSchema();
  await query(
    `UPDATE requests
     SET deleted_at = NOW(), updated_at = NOW()
     WHERE id = $1 AND deleted_at IS NULL`,
    [id],
  );
}

export async function insertAttachment(data: {
  requestId: number;
  evidenceTypeId: number;
  originalFileName: string;
  blobUrl: string;
  downloadUrl?: string | null;
  blobPathname: string;
  contentType?: string | null;
  sizeBytes: number;
  note?: string | null;
}) {
  await ensureSchema();
  await query(
    `INSERT INTO request_attachments (
      request_id, evidence_type_id, original_file_name, blob_url, download_url,
      blob_pathname, content_type, size_bytes, note
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
    [
      data.requestId,
      data.evidenceTypeId,
      data.originalFileName,
      data.blobUrl,
      data.downloadUrl,
      data.blobPathname,
      data.contentType,
      data.sizeBytes,
      data.note,
    ],
  );
}

export async function deleteAttachmentRecord(id: number) {
  await ensureSchema();
  await query("DELETE FROM request_attachments WHERE id = $1", [id]);
}

export async function getReport(filters: RequestFilters): Promise<ReportData> {
  const rows = await listRequests(filters, 1000);
  const previousFilters = previousPeriodFilters(filters);
  const previousRows = previousFilters ? await listRequests(previousFilters, 1000) : [];
  const countBy = (key: keyof RequestRow) => {
    const map = new Map<string, number>();
    for (const row of rows) {
      const name = String(row[key]);
      map.set(name, (map.get(name) ?? 0) + 1);
    }
    return Array.from(map, ([name, count]) => ({ name, count })).sort(
      (a, b) => b.count - a.count || a.name.localeCompare(b.name, "th"),
    );
  };
  const found = rows.filter((row) => row.status_semantic_key === "found").length;
  const notFound = rows.filter((row) => row.status_semantic_key === "not_found").length;
  const denominator = found + notFound;
  const trendRows = await query<{ month: string; count: number }>(
    `SELECT TO_CHAR(DATE_TRUNC('month', request_date), 'YYYY-MM') AS month,
      COUNT(*)::int AS count
     FROM requests
     WHERE deleted_at IS NULL
       AND request_date >= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '5 months'
     GROUP BY 1
     ORDER BY 1`,
  );

  return {
    total: rows.length,
    previousTotal: previousRows.length,
    changePercent: previousRows.length
      ? ((rows.length - previousRows.length) / previousRows.length) * 100
      : null,
    foundRate: denominator ? (found / denominator) * 100 : null,
    byCategory: countBy("category_name"),
    byRequesterType: countBy("requester_type_name"),
    byStatus: countBy("status_name"),
    monthlyTrend: trendRows,
    rows,
  };
}

function previousPeriodFilters(filters: RequestFilters): RequestFilters | null {
  if (!filters.startDate || !filters.endDate) return null;
  const start = new Date(`${filters.startDate}T00:00:00Z`);
  const end = new Date(`${filters.endDate}T00:00:00Z`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end < start) {
    return null;
  }
  const days = Math.round((end.getTime() - start.getTime()) / 86_400_000) + 1;
  const previousEnd = new Date(start);
  previousEnd.setUTCDate(previousEnd.getUTCDate() - 1);
  const previousStart = new Date(previousEnd);
  previousStart.setUTCDate(previousStart.getUTCDate() - days + 1);
  return {
    ...filters,
    startDate: previousStart.toISOString().slice(0, 10),
    endDate: previousEnd.toISOString().slice(0, 10),
  };
}
