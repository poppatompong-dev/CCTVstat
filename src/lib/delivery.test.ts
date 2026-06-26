import assert from "node:assert/strict";
import test from "node:test";

import {
  DELIVERY_METHODS,
  normalizeDeliveryMethod,
} from "./delivery";

test("DELIVERY_METHODS contains expected channels", () => {
  assert.ok(DELIVERY_METHODS.length >= 7);
  assert.ok(DELIVERY_METHODS.includes("รับด้วยตนเอง"));
  assert.ok(DELIVERY_METHODS.includes("อีเมล"));
  assert.ok(DELIVERY_METHODS.includes("ไลน์ (LINE)"));
  assert.ok(DELIVERY_METHODS.includes("ไปรษณีย์"));
  assert.ok(DELIVERY_METHODS.includes("USB / แผ่นบันทึก"));
  assert.ok(DELIVERY_METHODS.includes("ระบบออนไลน์"));
  assert.ok(DELIVERY_METHODS.includes("อื่น ๆ"));
});

test("normalizeDeliveryMethod trims whitespace and returns the value", () => {
  assert.equal(normalizeDeliveryMethod("  อีเมล  "), "อีเมล");
  assert.equal(normalizeDeliveryMethod("ไลน์ (LINE)"), "ไลน์ (LINE)");
});

test("normalizeDeliveryMethod returns null for empty or whitespace-only input", () => {
  assert.equal(normalizeDeliveryMethod(""), null);
  assert.equal(normalizeDeliveryMethod("   "), null);
  assert.equal(normalizeDeliveryMethod("\t\n"), null);
});

test("normalizeDeliveryMethod accepts custom/free-text methods", () => {
  assert.equal(normalizeDeliveryMethod("Fax"), "Fax");
  assert.equal(normalizeDeliveryMethod("  มอบหมายภายใน  "), "มอบหมายภายใน");
});
