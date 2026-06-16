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
} from "@/lib/types";

let sqlClient: NeonQueryFunction<false, false> | null = null;
let schemaReady = false;

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

async function seedMaster(kind: MasterKind, names: string[]) {
  for (const [index, name] of names.entries()) {
    await query(
      `INSERT INTO ${kind} (name, sort_order)
       VALUES ($1, $2)
       ON CONFLICT (name) DO NOTHING`,
      [name, index + 1],
    );
  }
}

export async function ensureSchema() {
  if (schemaReady) return;

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

  await seedMaster("requester_types", [
    "ประชาชน",
    "ตำรวจ",
    "หน่วยงานรัฐ",
    "เจ้าหน้าที่เทศบาล",
  ]);
  await seedMaster("categories", [
    "อุบัติเหตุจราจร",
    "ทรัพย์สินสูญหาย",
    "คดีอาชญากรรม",
    "เหตุเดือดร้อนรำคาญ",
    "อื่น ๆ",
  ]);
  await seedMaster("statuses", [
    "รับคำร้องแล้ว",
    "พบภาพ",
    "ไม่พบภาพ",
    "แจ้งผลแล้ว",
    "ยกเลิก",
  ]);
  await seedMaster("evidence_types", [
    "ใบคำร้อง",
    "หนังสือราชการ",
    "ใบแจ้งความ",
    "เอกสารส่งมอบ",
    "รูปภาพประกอบ",
    "อื่น ๆ",
  ]);

  schemaReady = true;
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
    `SELECT id, name, sort_order, is_active
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

  return { where: clauses.join(" AND "), params, nextIndex: index };
}

const requestSelect = `
  SELECT r.id, r.request_no, r.request_date::text, r.fiscal_year, r.sequence_no,
    r.requester_type_id, r.category_id, r.status_id, r.location_text, r.note,
    r.created_at::text, r.updated_at::text,
    rt.name AS requester_type_name,
    c.name AS category_name,
    s.name AS status_name,
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
     GROUP BY r.id, rt.name, c.name, s.name
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
     GROUP BY r.id, rt.name, c.name, s.name
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
  return {
    total,
    thisMonth: this_month,
    withAttachments: with_attachments,
    latestRequestNo: latest[0]?.request_no ?? null,
  };
}

export async function nextRequestNumber(requestDate: string) {
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

  return {
    total: rows.length,
    byCategory: countBy("category_name"),
    byRequesterType: countBy("requester_type_name"),
    byStatus: countBy("status_name"),
    rows,
  };
}
