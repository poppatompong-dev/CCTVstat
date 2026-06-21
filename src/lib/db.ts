import "server-only";

import { neon, type NeonQueryFunction } from "@neondatabase/serverless";
import {
  fiscalYearFromDate,
  formatRequestNo,
  parseRequestNo,
} from "@/lib/dates";
import { e2eFixtureBlobUrl, e2eFixturesEnabled, fixturePdfBody } from "@/lib/attachment-fixtures";
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
import { timed } from "@/lib/perf";
import { hasCanonicalMasterOrder, normalizeMasterOrder } from "@/lib/master-order";

let sqlClient: NeonQueryFunction<false, false> | null = null;
let schemaReady = false;
let schemaReadyPromise: Promise<void> | null = null;
let e2eFixturesReadyPromise: Promise<void> | null = null;
const e2eAttachmentFixtureKey = "c69-0003-attachment";

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
  await query("CREATE INDEX IF NOT EXISTS requests_active_date_idx ON requests (request_date DESC, id DESC) WHERE deleted_at IS NULL");
  await query("CREATE INDEX IF NOT EXISTS requests_active_created_idx ON requests (created_at DESC) WHERE deleted_at IS NULL");
  await query("CREATE INDEX IF NOT EXISTS requests_fiscal_sequence_idx ON requests (fiscal_year, sequence_no DESC)");
  await query("CREATE INDEX IF NOT EXISTS requests_active_requester_type_idx ON requests (requester_type_id) WHERE deleted_at IS NULL");
  await query("CREATE INDEX IF NOT EXISTS requests_active_category_idx ON requests (category_id) WHERE deleted_at IS NULL");
  await query("CREATE INDEX IF NOT EXISTS requests_active_status_idx ON requests (status_id) WHERE deleted_at IS NULL");
  await query("CREATE INDEX IF NOT EXISTS requests_active_category_date_idx ON requests (category_id, request_date DESC) WHERE deleted_at IS NULL");
  await query("CREATE INDEX IF NOT EXISTS request_attachments_request_id_idx ON request_attachments (request_id)");

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

}

async function normalizeStoredMasterOrders() {
  const storedRows = await query<{ kind: MasterKind; id: number; sort_order: number }>(`
    SELECT 'requester_types'::text AS kind, id, sort_order FROM requester_types
    UNION ALL
    SELECT 'categories'::text AS kind, id, sort_order FROM categories
    UNION ALL
    SELECT 'statuses'::text AS kind, id, sort_order FROM statuses
    UNION ALL
    SELECT 'evidence_types'::text AS kind, id, sort_order FROM evidence_types
    ORDER BY kind, sort_order, id
  `);

  for (const kind of masterTables) {
    const rows = storedRows.filter((row) => row.kind === kind);
    if (hasCanonicalMasterOrder(rows.map((row) => row.sort_order))) continue;

    await query(
      `UPDATE ${kind} AS master
       SET sort_order = positions.sort_order::int, updated_at = NOW()
       FROM unnest($1::int[]) WITH ORDINALITY AS positions(id, sort_order)
       WHERE master.id = positions.id`,
      [rows.map((row) => row.id)],
    );
  }
}

async function schemaLooksInitialized() {
  const rows = await query<{ ready: boolean }>(`
    SELECT (
      to_regclass('public.requester_types') IS NOT NULL
      AND to_regclass('public.categories') IS NOT NULL
      AND to_regclass('public.statuses') IS NOT NULL
      AND to_regclass('public.evidence_types') IS NOT NULL
      AND to_regclass('public.requests') IS NOT NULL
      AND to_regclass('public.request_attachments') IS NOT NULL
      AND EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'statuses'
          AND column_name = 'semantic_key'
      )
      AND to_regclass('public.statuses_semantic_key_unique') IS NOT NULL
      AND to_regclass('public.requests_active_date_idx') IS NOT NULL
      AND to_regclass('public.requests_active_created_idx') IS NOT NULL
      AND to_regclass('public.requests_fiscal_sequence_idx') IS NOT NULL
      AND to_regclass('public.requests_active_requester_type_idx') IS NOT NULL
      AND to_regclass('public.requests_active_category_idx') IS NOT NULL
      AND to_regclass('public.requests_active_status_idx') IS NOT NULL
      AND to_regclass('public.requests_active_category_date_idx') IS NOT NULL
      AND to_regclass('public.request_attachments_request_id_idx') IS NOT NULL
    ) AS ready
  `);
  return Boolean(rows[0]?.ready);
}

async function initializeSchemaIfNeeded() {
  if (!(await timed("schema readiness check", () => schemaLooksInitialized()))) {
    await initializeSchema();
  }

  await normalizeStoredMasterOrders();
  schemaReady = true;
}

async function ensureE2EFixtureStateTable() {
  await query(`
    CREATE TABLE IF NOT EXISTS e2e_fixture_state (
      fixture_key TEXT PRIMARY KEY,
      state TEXT NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

async function setE2EFixtureState(fixtureKey: string, state: string) {
  await ensureE2EFixtureStateTable();
  await query(
    `INSERT INTO e2e_fixture_state (fixture_key, state)
     VALUES ($1, $2)
     ON CONFLICT (fixture_key)
     DO UPDATE SET state = EXCLUDED.state, updated_at = NOW()`,
    [fixtureKey, state],
  );
}

async function getE2EFixtureState(fixtureKey: string) {
  await ensureE2EFixtureStateTable();
  const rows = await query<{ state: string }>(
    "SELECT state FROM e2e_fixture_state WHERE fixture_key = $1 LIMIT 1",
    [fixtureKey],
  );
  return rows[0]?.state ?? null;
}

async function ensureE2EFixtures(options: { reset?: boolean } = {}) {
  if (!e2eFixturesEnabled()) return;

  await timed("ensureE2EFixtures", async () => {
    const currentState = await getE2EFixtureState(e2eAttachmentFixtureKey);
    if (currentState === "deleted" && !options.reset) return;

    const [requesterType] = await query<{ id: number }>(
      "SELECT id FROM requester_types WHERE is_active = TRUE ORDER BY sort_order, id LIMIT 1",
    );
    const [category] = await query<{ id: number }>(
      "SELECT id FROM categories WHERE is_active = TRUE ORDER BY sort_order, id LIMIT 1",
    );
    const [status] = await query<{ id: number }>(
      "SELECT id FROM statuses WHERE semantic_key = 'received' OR is_active = TRUE ORDER BY CASE WHEN semantic_key = 'received' THEN 0 ELSE 1 END, sort_order, id LIMIT 1",
    );
    const [evidenceType] = await query<{ id: number }>(
      "SELECT id FROM evidence_types WHERE is_active = TRUE ORDER BY sort_order, id LIMIT 1",
    );

    if (!requesterType || !category || !status || !evidenceType) {
      console.warn("[e2e-fixtures] skipped: missing active master data");
      return;
    }

    let [request] = await query<{ id: number }>(
      "SELECT id FROM requests WHERE request_no = 'C69-0003' LIMIT 1",
    );

    if (!request) {
      const conflict = await query<{ id: number; request_no: string }>(
        "SELECT id, request_no FROM requests WHERE fiscal_year = 2569 AND sequence_no = 3 LIMIT 1",
      );

      if (conflict[0]) {
        console.warn(`[e2e-fixtures] skipped C69-0003: sequence is already used by ${conflict[0].request_no}`);
        return;
      }

      const inserted = await query<{ id: number }>(
        `INSERT INTO requests (
          request_no, request_date, fiscal_year, sequence_no, requester_type_id,
          category_id, status_id, location_text, note
        )
        VALUES ('C69-0003', '2026-06-18', 2569, 3, $1, $2, $3, $4, $5)
        RETURNING id`,
        [
          requesterType.id,
          category.id,
          status.id,
          "E2E fixture location",
          "สร้างโดย E2E_FIXTURES_ENABLED เพื่อทดสอบไฟล์แนบใน staging",
        ],
      );
      request = inserted[0];
    }

    const existingAttachments = await query<{ id: number; blob_url: string }>(
      "SELECT id, blob_url FROM request_attachments WHERE request_id = $1 LIMIT 1",
      [request.id],
    );

    if (existingAttachments.length) {
      await setE2EFixtureState(e2eAttachmentFixtureKey, "ready");
      return;
    }

    await query(
      `INSERT INTO request_attachments (
        request_id, evidence_type_id, original_file_name, blob_url, download_url,
        blob_pathname, content_type, size_bytes, note
      )
      VALUES ($1, $2, $3, $4, NULL, $4, $5, $6, $7)`,
      [
        request.id,
        evidenceType.id,
        "test-private.pdf",
        e2eFixtureBlobUrl,
        "application/pdf",
        fixturePdfBody().length,
        "ไฟล์ fixture สำหรับ automated E2E staging เท่านั้น",
      ],
    );
    await setE2EFixtureState(e2eAttachmentFixtureKey, "ready");
  });
}

export async function resetE2EFixtures() {
  if (!e2eFixturesEnabled()) {
    throw new Error("E2E fixtures are disabled");
  }

  await ensureSchema();
  await ensureE2EFixtures({ reset: true });
  e2eFixturesReadyPromise = Promise.resolve();
}

export async function markE2EAttachmentFixtureDeleted() {
  if (!e2eFixturesEnabled()) return;
  await setE2EFixtureState(e2eAttachmentFixtureKey, "deleted");
}

export async function ensureSchema() {
  return timed("ensureSchema", async () => {
    if (!schemaReady) {
      schemaReadyPromise ??= initializeSchemaIfNeeded().catch((error) => {
        schemaReadyPromise = null;
        throw error;
      });

      await schemaReadyPromise;
    }

    if (e2eFixturesEnabled()) {
      e2eFixturesReadyPromise ??= ensureE2EFixtures().catch((error) => {
        e2eFixturesReadyPromise = null;
        throw error;
      });
      await e2eFixturesReadyPromise;
    }
  });
}

export async function measureDatabaseLatency(label: string) {
  if (process.env.PERF_DB_PROBE !== "1") return;
  await timed(`${label} db SELECT 1`, () => query("SELECT 1"));
  await timed(`${label} db active request count`, () =>
    query("SELECT COUNT(*)::int AS total FROM requests WHERE deleted_at IS NULL"),
  );
}

export async function getMasters() {
  return timed("getMasters", async () => {
    await ensureSchema();
    const [requesterTypes, categories, statuses, evidenceTypes] =
    await Promise.all([
      getMasterRows("requester_types"),
      getMasterRows("categories"),
      getMasterRows("statuses"),
      getMasterRows("evidence_types"),
    ]);
    return { requesterTypes, categories, statuses, evidenceTypes };
  });
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
  const isActive = form.get("is_active") === "on";
  if (!name) throw new Error("กรุณาระบุชื่อ");

  if (id) {
    await query(
      `UPDATE ${kind}
       SET name = $1, is_active = $2, updated_at = NOW()
       WHERE id = $3`,
      [name, isActive, id],
    );
  } else {
    await query(
      `INSERT INTO ${kind} (name, sort_order, is_active)
       SELECT $1, COALESCE(MAX(sort_order), 0) + 1, $2
       FROM ${kind}`,
      [name, isActive],
    );
  }
}

export async function reorderMaster(kind: MasterKind, orderedIds: number[]) {
  await ensureSchema();
  assertMasterKind(kind);

  const existing = await query<{ id: number }>(`SELECT id FROM ${kind} ORDER BY sort_order, id`);
  const normalized = normalizeMasterOrder(
    existing.map((row) => row.id),
    orderedIds,
  );

  await query(
    `UPDATE ${kind} AS master
     SET sort_order = positions.sort_order::int, updated_at = NOW()
     FROM unnest($1::int[]) WITH ORDINALITY AS positions(id, sort_order)
     WHERE master.id = positions.id`,
    [normalized.map((row) => row.id)],
  );
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
    COALESCE(ac.attachment_count, 0)::int AS attachment_count
  FROM requests r
  JOIN requester_types rt ON rt.id = r.requester_type_id
  JOIN categories c ON c.id = r.category_id
  JOIN statuses s ON s.id = r.status_id
  LEFT JOIN (
    SELECT request_id, COUNT(*)::int AS attachment_count
    FROM request_attachments
    GROUP BY request_id
  ) ac ON ac.request_id = r.id
`;

export async function listRequests(filters: RequestFilters = {}, limit = 80) {
  return timed(`listRequests limit ${limit}`, async () => {
    await ensureSchema();
    const { where, params, nextIndex } = filtersToWhere(filters);
    return query<RequestRow>(
      `${requestSelect}
       WHERE ${where}
       ORDER BY r.request_date DESC, r.id DESC
       LIMIT $${nextIndex}`,
      [...params, limit],
    );
  });
}

export async function getRequest(id: number) {
  return timed("getRequest", async () => {
    await ensureSchema();
    const rows = await query<RequestRow>(
      `${requestSelect}
       WHERE r.deleted_at IS NULL AND r.id = $1
       LIMIT 1`,
      [id],
    );
    return rows[0] ?? null;
  });
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
  const days = followUpDays();
  const [summary, followUpRows] = await Promise.all([
    timed("getDashboardStats summary query", () => query<{
      total: number;
      this_month: number;
      with_attachments: number;
      latest_request_no: string | null;
      follow_up_total: number;
      overdue_checking: number;
      unresolved_total: number;
    }>(
      `WITH active_requests AS (
        SELECT r.id, r.request_date, r.created_at, r.request_no, s.semantic_key,
          EXISTS (
            SELECT 1 FROM request_attachments a WHERE a.request_id = r.id
          ) AS has_attachment
        FROM requests r
        JOIN statuses s ON s.id = r.status_id
        WHERE r.deleted_at IS NULL
      )
      SELECT
        COUNT(*)::int AS total,
        COUNT(*) FILTER (
          WHERE request_date >= DATE_TRUNC('month', CURRENT_DATE)
        )::int AS this_month,
        COUNT(*) FILTER (WHERE has_attachment)::int AS with_attachments,
        (
          SELECT request_no
          FROM active_requests
          ORDER BY created_at DESC
          LIMIT 1
        ) AS latest_request_no,
        COUNT(*) FILTER (
          WHERE COALESCE(semantic_key, '') <> 'notified'
            AND request_date <= CURRENT_DATE - ($1::int * INTERVAL '1 day')
        )::int AS follow_up_total,
        COUNT(*) FILTER (
          WHERE semantic_key = 'checking'
            AND request_date <= CURRENT_DATE - ($1::int * INTERVAL '1 day')
        )::int AS overdue_checking,
        COUNT(*) FILTER (
          WHERE COALESCE(semantic_key, '') <> 'notified'
        )::int AS unresolved_total
      FROM active_requests`,
      [days],
    )),
    timed("getDashboardStats follow-up rows", () => listRequests({ view: "follow-up" }, 5)),
  ]);
  const metrics = summary[0];
  return {
    total: metrics.total,
    thisMonth: metrics.this_month,
    withAttachments: metrics.with_attachments,
    latestRequestNo: metrics.latest_request_no,
    followUpTotal: metrics.follow_up_total,
    overdueChecking: metrics.overdue_checking,
    unresolvedTotal: metrics.unresolved_total,
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

export async function findRequestNumberConflict(id: number, requestNo: string) {
  await ensureSchema();
  const parsed = parseRequestNo(requestNo.trim().toUpperCase());
  if (!parsed) return null;

  const rows = await query<{ id: number; request_no: string; is_deleted: boolean }>(
    `SELECT id, request_no, (deleted_at IS NOT NULL) AS is_deleted
     FROM requests
     WHERE request_no = $1 AND id <> $2
     LIMIT 1`,
    [parsed.normalized, id],
  );
  return rows[0] ?? null;
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

type CountRow = { name: string; count: number };

async function countRequests(filters: RequestFilters) {
  const { where, params } = filtersToWhere(filters);
  const [{ total }] = await query<{ total: number }>(
    `SELECT COUNT(*)::int AS total
     FROM requests r
     JOIN statuses s ON s.id = r.status_id
     WHERE ${where}`,
    params,
  );
  return total;
}

async function countByRequesterType(filters: RequestFilters) {
  const { where, params } = filtersToWhere(filters);
  return query<CountRow>(
    `SELECT rt.name, COUNT(*)::int AS count
     FROM requests r
     JOIN requester_types rt ON rt.id = r.requester_type_id
     JOIN statuses s ON s.id = r.status_id
     WHERE ${where}
     GROUP BY rt.name
     ORDER BY count DESC, rt.name`,
    params,
  );
}

async function countByCategory(filters: RequestFilters) {
  const { where, params } = filtersToWhere(filters);
  return query<CountRow>(
    `SELECT c.name, COUNT(*)::int AS count
     FROM requests r
     JOIN categories c ON c.id = r.category_id
     JOIN statuses s ON s.id = r.status_id
     WHERE ${where}
     GROUP BY c.name
     ORDER BY count DESC, c.name`,
    params,
  );
}

async function countByStatus(filters: RequestFilters) {
  const { where, params } = filtersToWhere(filters);
  return query<CountRow>(
    `SELECT s.name, COUNT(*)::int AS count
     FROM requests r
     JOIN statuses s ON s.id = r.status_id
     WHERE ${where}
     GROUP BY s.name
     ORDER BY count DESC, s.name`,
    params,
  );
}

async function foundRate(filters: RequestFilters) {
  const { where, params } = filtersToWhere(filters);
  const [{ found, not_found }] = await query<{ found: number; not_found: number }>(
    `SELECT
       COUNT(*) FILTER (WHERE s.semantic_key = 'found')::int AS found,
       COUNT(*) FILTER (WHERE s.semantic_key = 'not_found')::int AS not_found
     FROM requests r
     JOIN statuses s ON s.id = r.status_id
     WHERE ${where}`,
    params,
  );
  const denominator = found + not_found;
  return denominator ? (found / denominator) * 100 : null;
}

async function monthlyTrend() {
  return query<{ month: string; count: number }>(
    `SELECT TO_CHAR(DATE_TRUNC('month', request_date), 'YYYY-MM') AS month,
      COUNT(*)::int AS count
     FROM requests
     WHERE deleted_at IS NULL
       AND request_date >= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '5 months'
     GROUP BY 1
     ORDER BY 1`,
  );
}

export async function getReport(filters: RequestFilters): Promise<ReportData> {
  return timed("getReport total", async () => {
    await ensureSchema();
    const previousFilters = previousPeriodFilters(filters);
    const [
      rows,
      total,
      previousTotal,
      rate,
      byCategory,
      byRequesterType,
      byStatus,
      trendRows,
    ] = await Promise.all([
      timed("getReport detail rows", () => listRequests(filters, 1000)),
      timed("getReport current total", () => countRequests(filters)),
      previousFilters
        ? timed("getReport previous total", () => countRequests(previousFilters))
        : Promise.resolve(0),
      timed("getReport found rate", () => foundRate(filters)),
      timed("getReport by category", () => countByCategory(filters)),
      timed("getReport by requester type", () => countByRequesterType(filters)),
      timed("getReport by status", () => countByStatus(filters)),
      timed("getReport monthly trend", () => monthlyTrend()),
    ]);

    return {
      total,
      previousTotal,
      changePercent: previousTotal
        ? ((total - previousTotal) / previousTotal) * 100
        : null,
      foundRate: rate,
      byCategory,
      byRequesterType,
      byStatus,
      monthlyTrend: trendRows,
      rows,
    };
  });
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
