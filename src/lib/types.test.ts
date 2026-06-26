import assert from "node:assert/strict";
import test from "node:test";

import type { DeliveryRow, MasterKind, ReportData, RequestRow } from "./types";

test("DeliveryRow type has all required fields", () => {
  const sample: DeliveryRow = {
    id: 1,
    request_id: 100,
    delivery_item_type_id: 2,
    delivery_item_type_name: "ไฟล์วิดีโอจากกล้อง",
    delivery_method: "อีเมล",
    recipient_name: "นาย สมชาย",
    delivered_at: "2026-06-20T10:00:00Z",
    note: "ส่ง 3 ไฟล์",
    created_at: "2026-06-20T10:05:00Z",
  };
  assert.equal(sample.id, 1);
  assert.equal(sample.delivery_method, "อีเมล");
  assert.equal(sample.delivery_item_type_name, "ไฟล์วิดีโอจากกล้อง");
});

test("RequestRow type includes delivery_count", () => {
  const sample: RequestRow = {
    id: 1,
    request_no: "C69-0001",
    request_date: "2026-06-16",
    fiscal_year: 2569,
    sequence_no: 1,
    requester_type_id: 1,
    category_id: 1,
    status_id: 1,
    location_text: "หน้าตลาด",
    note: null,
    created_at: "2026-06-16T08:00:00Z",
    updated_at: "2026-06-16T08:00:00Z",
    requester_type_name: "ประชาชน",
    category_name: "อุบัติเหตุจราจร",
    status_name: "รับคำร้องแล้ว",
    status_semantic_key: "received",
    attachment_count: 0,
    delivery_count: 2,
  };
  assert.equal(sample.delivery_count, 2);
});

test("ReportData type includes delivery summary fields", () => {
  const sample: ReportData = {
    total: 25,
    previousTotal: 20,
    changePercent: 25,
    foundRate: 64.5,
    byCategory: [],
    byRequesterType: [],
    byStatus: [],
    byDeliveryItemType: [{ name: "ไฟล์วิดีโอจากกล้อง", count: 5 }],
    byDeliveryMethod: [{ name: "อีเมล", count: 4 }],
    deliveryTotal: 8,
    monthlyTrend: [],
    rows: [],
  };
  assert.equal(sample.deliveryTotal, 8);
  assert.equal(sample.byDeliveryItemType.length, 1);
  assert.equal(sample.byDeliveryMethod[0].name, "อีเมล");
});

test("MasterKind includes delivery_item_types", () => {
  const kinds: MasterKind[] = [
    "requester_types",
    "categories",
    "statuses",
    "evidence_types",
    "delivery_item_types",
  ];
  assert.ok(kinds.includes("delivery_item_types"));
});
